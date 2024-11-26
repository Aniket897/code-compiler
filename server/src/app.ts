import express, { Request, Response } from "express";
import cors from "cors";
import generateFile from "./helpers/generateFile";
import Docker from "dockerode";
import Job from "./models/job";
import amqp, { Channel, Connection } from "amqplib";

const app: express.Application = express();
const docker = new Docker();

let connection: Connection;
let channel: Channel;

// Initialize RabbitMQ connection
(async function initializeRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();

    // Assert exchange and bind queue to it
    await channel.assertExchange("compiler", "direct");
    await channel.assertQueue("Job");
    await channel.bindQueue("Job", "compiler", ""); // Binding queue to exchange
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    process.exit(1); // Exit if RabbitMQ isn't connected properly
  }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.get("/health", (req: Request, resp: Response) => {
  resp.status(200).json({
    message: "Compiler service is up and running",
  });
});

app.get("/status/:id", async (req: Request, resp: Response) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      resp.status(400).json({
        message: "Job you are requesting are not exists",
      });
      return;
    }

    resp.status(200).json({
      job,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/compile", async (req: Request, resp: Response) => {
  try {
    const { code, lang, input = "" } = req.body;

    // Validate data
    if (!lang) {
      resp.status(400).json({ message: "Language is required" });
      return;
    }

    if (!code) {
      resp.status(400).json({ message: "Code is required" });
      return;
    }

    // Create a file and save the code
    const { fileName, filePath } = await generateFile(code, lang);

    // Create a job entry in the database
    const job = await Job.create({
      lang,
      filepath: fileName,
    });

    // Publish the job ID to the RabbitMQ queue
    const jobData = { jobId: job._id, lang, input }; // Include additional data if needed
    channel.publish("compiler", "", Buffer.from(JSON.stringify(jobData)));

    // Send a response back to the client with the job ID
    resp.status(200).json({
      message: "Job added to the queue successfully",
      jobId: job._id, // Sending _id ensures consistency
    });
  } catch (error) {
    console.error("Error while processing /compile:", error);
    resp.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
});

export default app;
