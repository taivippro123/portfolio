import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    fileType: { type: String, required: true, enum: ["pdf", "doc", "docx"] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Chỉ lưu 1 CV mới nhất, khi upload CV mới thì replace cái cũ
cvSchema.index({ userId: 1 }, { unique: true });

const CV = mongoose.model("CV", cvSchema);

export default CV;

