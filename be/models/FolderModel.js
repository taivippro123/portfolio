import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isShared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;

