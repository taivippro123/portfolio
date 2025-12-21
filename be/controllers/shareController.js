import Folder from "../models/FolderModel.js";
import Note from "../models/NoteModel.js";

// Lấy tất cả folders và notes được share (public, không cần auth)
export const getSharedContent = async (req, res) => {
  try {
    // Lấy tất cả folders được share (chỉ những folder còn tồn tại)
    const sharedFolders = await Folder.find({ isShared: true })
      .select("_id name createdAt updatedAt")
      .sort({ updatedAt: -1 });

    // Lấy IDs của các folders được share (chỉ những folder còn tồn tại)
    const sharedFolderIds = sharedFolders.map((folder) => folder._id.toString());

    // Lấy tất cả notes được share HOẶC nằm trong folder được share
    // Chỉ lấy notes còn tồn tại và folderId (nếu có) phải là folder còn tồn tại
    const sharedNotes = await Note.find({
      $or: [
        { isShared: true },
        { folderId: { $in: sharedFolderIds } },
      ],
    })
      .select("title content folderId createdAt updatedAt")
      .sort({ updatedAt: -1 });

    // Lọc notes: chỉ giữ notes hợp lệ
    const validNotes = sharedNotes.filter((note) => {
      // Nếu note được share trực tiếp (isShared = true), luôn hiển thị
      if (note.isShared === true) {
        return true;
      }
      // Nếu note không được share trực tiếp, chỉ hiển thị nếu:
      // - Note không có folder (folderId = null) - không nên xảy ra vì đã filter ở trên
      // - Note có folder và folder còn tồn tại trong sharedFolders
      if (!note.folderId) {
        return false; // Note không có folder và không được share trực tiếp
      }
      // Note có folder - chỉ hiển thị nếu folder còn tồn tại trong sharedFolders
      return sharedFolderIds.includes(note.folderId.toString());
    });

    // Group notes by folderId (chỉ với notes hợp lệ)
    const notesByFolder = {};
    validNotes.forEach((note) => {
      const folderId = note.folderId?.toString() || "no-folder";
      if (!notesByFolder[folderId]) {
        notesByFolder[folderId] = [];
      }
      notesByFolder[folderId].push(note);
    });

    res.status(200).json({
      folders: sharedFolders,
      notes: validNotes,
      notesByFolder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Get Shared Content Error:", error);
  }
};

