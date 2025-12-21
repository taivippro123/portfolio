import Folder from "../models/FolderModel.js";
import { verifyToken } from "../middleware/auth.js";

// Tạo folder
export const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Tên folder là bắt buộc" });
    }

    // Kiểm tra parentId có tồn tại không (nếu có)
    if (parentId) {
      const parentFolder = await Folder.findOne({ _id: parentId, userId });
      if (!parentFolder) {
        return res.status(404).json({ message: "Folder cha không tồn tại" });
      }
    }

    const newFolder = new Folder({
      name,
      parentId: parentId || null,
      userId,
    });

    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Create Folder Error:", error);
  }
};

// Lấy tất cả folders
export const getFolders = async (req, res) => {
  try {
    const userId = req.user.id;
    const folders = await Folder.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Get Folders Error:", error);
  }
};

// Lấy folder theo ID
export const getFolderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const folder = await Folder.findOne({ _id: id, userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder không tồn tại" });
    }

    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Get Folder Error:", error);
  }
};

// Cập nhật folder
export const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId, isShared } = req.body;
    const userId = req.user.id;

    const folder = await Folder.findOne({ _id: id, userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder không tồn tại" });
    }

    if (name) folder.name = name;
    if (parentId !== undefined) {
      if (parentId) {
        const parentFolder = await Folder.findOne({ _id: parentId, userId });
        if (!parentFolder) {
          return res.status(404).json({ message: "Folder cha không tồn tại" });
        }
      }
      folder.parentId = parentId || null;
    }
    if (isShared !== undefined) folder.isShared = isShared;

    await folder.save();
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Update Folder Error:", error);
  }
};

// Xóa folder
export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const folder = await Folder.findOne({ _id: id, userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder không tồn tại" });
    }

    // Kiểm tra xem folder có chứa folder con không
    const childFolders = await Folder.find({ parentId: id });
    if (childFolders.length > 0) {
      return res.status(400).json({ message: "Không thể xóa folder có chứa folder con" });
    }

    await Folder.findByIdAndDelete(id);
    res.status(200).json({ message: "Folder đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Delete Folder Error:", error);
  }
};

