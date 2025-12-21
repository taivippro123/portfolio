"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Plus, Trash2, Edit2, Folder, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { notesApi, foldersApi } from "@/lib/api"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Note {
  _id: string
  title: string
  content: string
  folderId?: string
  isShared?: boolean
  createdAt: string
  updatedAt: string
}

interface Folder {
  _id: string
  name: string
  isShared?: boolean
}

export function FolderContentView({ 
  folderId,
  onNoteClick 
}: { 
  folderId: string | null
  onNoteClick?: (noteId: string) => void
}) {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [folder, setFolder] = useState<Folder | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  const fetchData = async () => {
    if (!folderId) return
    try {
      setLoading(true)
      const [notesData, foldersData] = await Promise.all([
        notesApi.getAll(folderId),
        foldersApi.getAll(),
      ])
      const folderData = foldersData.find((f: Folder) => f._id === folderId)
      setFolder(folderData || null)
      setNotes(notesData.filter((note: Note) => note.folderId === folderId))
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [folderId])

  const handleCreate = async () => {
    if (!noteTitle.trim() || !folderId) return
    try {
      await notesApi.create({
        title: noteTitle,
        content: noteContent,
        folderId,
      })
      setNoteTitle("")
      setNoteContent("")
      setIsCreateOpen(false)
      toast.success("Đã tạo note thành công!")
      fetchData()
    } catch (error) {
      console.error("Error creating note:", error)
      toast.error("Lỗi khi tạo note")
    }
  }

  const handleEdit = async () => {
    if (!editingNote || !noteTitle.trim()) return
    try {
      await notesApi.update(editingNote._id, {
        title: noteTitle,
        content: noteContent,
        folderId: editingNote.folderId,
      })
      setNoteTitle("")
      setNoteContent("")
      setEditingNote(null)
      setIsEditOpen(false)
      toast.success("Đã cập nhật note thành công!")
      fetchData()
    } catch (error) {
      console.error("Error updating note:", error)
      toast.error("Lỗi khi cập nhật note")
    }
  }

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!noteToDelete) return
    try {
      await notesApi.delete(noteToDelete)
      setDeleteDialogOpen(false)
      setNoteToDelete(null)
      fetchData()
    } catch (error) {
      console.error("Error deleting note:", error)
      toast.error("Lỗi khi xóa note")
    }
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setNoteTitle(note.title)
    setNoteContent(note.content || "")
    setIsEditOpen(true)
  }

  if (!folderId) {
    return (
      <div className="p-3 sm:p-6 bg-white">
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Folder className="h-12 w-12 mb-4 opacity-50" />
          <p>Chọn một folder từ Collections để xem nội dung</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 bg-white">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl font-bold mb-2 text-black">{folder?.name || "Folder"}</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 bg-black text-white border-gray-800 hover:bg-gray-800 hover:border-gray-600 hover:text-white text-sm font-medium">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create note</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-black font-medium">Tạo note mới</DialogTitle>
              <DialogDescription>Nhập thông tin cho note mới</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-black font-medium">Tiêu đề</Label>
                <Input
                  id="title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Nhập tiêu đề"
                  className="text-black border-gray-300 focus-visible:border-gray-500 focus-visible:ring-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content" className="text-black font-medium">Nội dung</Label>
                <textarea
                  id="content"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Nhập nội dung"
                  className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="border-gray-300 text-white hover:bg-gray-100 hover:text-black hover:border-gray-400">Hủy</Button>
              <Button onClick={handleCreate} className="bg-black text-white hover:bg-gray-800 font-medium">Tạo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black font-medium">Chỉnh sửa note</DialogTitle>
            <DialogDescription>Cập nhật thông tin note</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title" className="text-black font-medium">Tiêu đề</Label>
              <Input
                id="edit-title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Nhập tiêu đề"
                className="text-black border-gray-300 focus-visible:border-gray-500 focus-visible:ring-gray-300"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content" className="text-black font-medium">Nội dung</Label>
              <textarea
                id="edit-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Nhập nội dung"
                className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="border-gray-300 text-white hover:bg-gray-100 hover:text-black hover:border-gray-400">Hủy</Button>
            <Button onClick={handleEdit} className="bg-black text-white hover:bg-gray-800 font-medium">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FileText className="h-12 w-12 mb-4 opacity-50" />
          <p>Chưa có note nào trong folder này. Tạo note mới để bắt đầu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="group relative overflow-hidden rounded-lg border border-gray-300 bg-white hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => {
                if (onNoteClick) {
                  onNoteClick(note._id)
                } else {
                  router.push(`/note/${note._id}`)
                }
              }}
            >
              <div className="p-4">
                <h3 className="font-medium text-black mb-2">{note.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {note.content || "Không có nội dung"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(note.updatedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 bg-white hover:bg-gray-100 ${(note.isShared || folder?.isShared) ? "text-black" : "text-gray-700 hover:text-black"}`}
                  onClick={async (e) => {
                    e.stopPropagation()
                    // Nếu folder đã share thì không thể toggle note
                    if (folder?.isShared) {
                      toast.info("Folder đã được share, tất cả notes trong folder đều được share")
                      return
                    }
                    try {
                      const updated = await notesApi.toggleShare(note._id, !note.isShared)
                      setNotes(notes.map(n => n._id === note._id ? updated : n))
                      toast.success(note.isShared ? "Đã tắt share" : "Đã bật share")
                    } catch (error) {
                      console.error("Error toggling share:", error)
                      toast.error("Lỗi khi toggle share")
                    }
                  }}
                  title={
                    folder?.isShared 
                      ? "Folder đã share - Tất cả notes đều được share" 
                      : note.isShared 
                      ? "Đang share - Click để tắt" 
                      : "Click để share"
                  }
                >
                  <Share2 className={`h-4 w-4 ${(note.isShared || folder?.isShared) ? "font-bold fill-black" : ""}`} strokeWidth={(note.isShared || folder?.isShared) ? 2.5 : 1.5} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white hover:bg-gray-100 text-gray-700 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditDialog(note)
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white hover:bg-gray-100 text-gray-700 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(note._id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-gray-300 bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-gray-600">
              Bạn có chắc muốn xóa note này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-300 text-white hover:bg-gray-100 hover:text-black"
            >
              Hủy
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-gray-800 bg-black text-white hover:bg-white hover:text-black hover:border-gray-400"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

