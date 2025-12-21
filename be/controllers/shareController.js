import Folder from "../models/FolderModel.js";
import Note from "../models/NoteModel.js";

// Lấy tất cả folders và notes được share (public, không cần auth)
export const getSharedContent = async (req, res) => {
  try {
    // Lấy tất cả folders được share
    const sharedFolders = await Folder.find({ isShared: true })
      .select("_id name createdAt updatedAt")
      .sort({ updatedAt: -1 });

    // Lấy IDs của các folders được share
    const sharedFolderIds = sharedFolders.map((folder) => folder._id.toString());

    // Lấy tất cả notes được share HOẶC nằm trong folder được share
    const sharedNotes = await Note.find({
      $or: [
        { isShared: true },
        { folderId: { $in: sharedFolderIds } },
      ],
    })
      .select("title content folderId createdAt updatedAt")
      .sort({ updatedAt: -1 });

    // Group notes by folderId
    const notesByFolder = {};
    sharedNotes.forEach((note) => {
      const folderId = note.folderId?.toString() || "no-folder";
      if (!notesByFolder[folderId]) {
        notesByFolder[folderId] = [];
      }
      notesByFolder[folderId].push(note);
    });

    res.status(200).json({
      folders: sharedFolders,
      notes: sharedNotes,
      notesByFolder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Get Shared Content Error:", error);
  }
};

