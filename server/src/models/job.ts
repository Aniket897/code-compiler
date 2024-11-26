import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  lang: {
    type: String,
    required: true,
    enum: ["js", "py"],
  },
  filepath: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "error"],
  },
  output: {
    type: String,
  },
});

export default mongoose.model("Job", jobSchema);
