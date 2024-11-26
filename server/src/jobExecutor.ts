import Docker from "dockerode";
import fs from "fs";
import path from "path";
import Job from "./models/job";
import ConnectDb from "./config/db";
import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";

const langs: { [key: string]: string } = {
  py: "python3",
  js: "node",
};

const docker = new Docker();
let connection: Connection;
let channel: Channel;

// Initialize RabbitMQ connection
async function initRabbitMQ() {
  try {
    ConnectDb();
    connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertExchange("compiler", "direct");
    await channel.assertQueue("Job");
    console.log("Connected to RabbitMQ");

    // Start consuming jobs
    channel.consume("Job", processJob, { noAck: false });
  } catch (error) {
    console.error("RabbitMQ initialization error:", error);
  }
}

// Process job from the queue
async function processJob(msg: ConsumeMessage | null) {
  console.log("Starting new execution");
  if (msg) {
    const { jobId } = JSON.parse(msg.content.toString());
    console.log(`Processing job ID: ${jobId}`);

    let fileName;
    try {
      // Fetch the job from the database
      const job = await Job.findById(jobId);
      if (!job) {
        console.error(`Job ID ${jobId} not found`);
        channel.ack(msg); // Acknowledge the message to remove it from the queue
        return;
      }

      fileName = job.filepath;

      // Create a docker Container
      const container = await docker.createContainer({
        Image: "code-executor",
        Cmd: [langs[job.lang], `/code/${job.filepath}`],
        HostConfig: {
          Binds: [`${path.join(__dirname, "../", "codes")}:/code`],
        },
        AttachStdout: true,
        AttachStderr: true,
      });

      await container.start();

      const logs = await container.logs({
        stdout: true,
        stderr: true,
        follow: true,
      });

      // Collect logs asynchronously
      let output = "";
      await new Promise<void>((resolve, reject) => {
        logs.on("data", (data) => {
          output += data.toString();
        });
        logs.on("end", resolve);
        logs.on("error", reject);
      });

      const cleanedLog = output.replace(/[^\x20-\x7E\n]/g, "").trim();

      job.status = "success";
      job.output = cleanedLog;

      await job.save();
      await container.wait();
      await container.remove();

      console.log(`Job ID ${jobId} completed`);
      channel.ack(msg); // Acknowledge message after successful processing
    } catch (error) {
      console.error(`Error processing job ID ${jobId}:`, error);
      channel.nack(msg); // Negative acknowledgment, requeue message
    } finally {
      if (fileName) {
        fs.unlinkSync(path.join(__dirname, "../", "codes", fileName));
      }
    }
  }
}

// Start the RabbitMQ connection
initRabbitMQ();
