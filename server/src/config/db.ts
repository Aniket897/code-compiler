import mongoose from "mongoose";

const monogURL = process.env.MONGO_URL || "mongodb://localhost:27017";

export default function ConnectDb() {
  mongoose
    .connect(monogURL, {
      dbName: "online-compiler",
    })
    .then(() => {
      console.log("mongodb conneted");
    })
    .catch((e) => {
      console.log("failed to connect mongodb", e);
    });
}
