import Note from "../models/NoteModel.js";

// Tạo note
export const createNote = async (req, res) => {
  try {
    const { title, content, folderId } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: "Title và content là bắt buộc" });
    }

    const newNote = new Note({
      title,
      content,
      folderId: folderId || null,
      userId,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Create Note Error:", error);
  }
};

// Lấy tất cả notes
export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { folderId } = req.query;

    const query = { userId };
    if (folderId) {
      query.folderId = folderId;
    } else if (folderId === null || folderId === "null") {
      query.folderId = null;
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Get Notes Error:", error);
  }
};

// Lấy note theo ID
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: "Note không tồn tại" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Get Note Error:", error);
  }
};

// Cập nhật note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, folderId, isShared } = req.body;
    const userId = req.user.id;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: "Note không tồn tại" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (folderId !== undefined) note.folderId = folderId || null;
    if (isShared !== undefined) note.isShared = isShared;

    await note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Update Note Error:", error);
  }
};

// Xóa note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: "Note không tồn tại" });
    }

    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: "Note đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Delete Note Error:", error);
  }
};

