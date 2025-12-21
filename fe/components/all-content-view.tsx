"use client"

import { useEffect, useState } from "react"
import { Folder, Plus, Trash2, Edit2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { foldersApi } from "@/lib/api"
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

interface Folder {
  _id: string
  name: string
  isShared?: boolean
  createdAt: string
  updatedAt: string
}

export function AllContentView({ 
  onFolderClick 
}: { 
  onFolderClick?: (folderId: string) => void 
} = {}) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const [folderName, setFolderName] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)

  const fetchFolders = async () => {
    try {
      setLoading(true)
      const data = await foldersApi.getAll()
      setFolders(data)
    } catch (error) {
      console.error("Error fetching folders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFolders()
  }, [])

  const handleCreate = async () => {
    if (!folderName.trim()) return
    try {
      await foldersApi.create(folderName)
      setFolderName("")
      setIsCreateOpen(false)
      toast.success("Đã tạo folder thành công!")
      fetchFolders()
    } catch (error) {
      console.error("Error creating folder:", error)
      toast.error("Lỗi khi tạo folder")
    }
  }

  const handleEdit = async () => {
    if (!editingFolder || !folderName.trim()) return
    try {
      await foldersApi.update(editingFolder._id, folderName)
      setFolderName("")
      setEditingFolder(null)
      setIsEditOpen(false)
      toast.success("Đã cập nhật folder thành công!")
      fetchFolders()
    } catch (error) {
      console.error("Error updating folder:", error)
      toast.error("Lỗi khi cập nhật folder")
    }
  }

  const handleDeleteClick = (id: string) => {
    setFolderToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!folderToDelete) return
    try {
      await foldersApi.delete(folderToDelete)
      setDeleteDialogOpen(false)
      setFolderToDelete(null)
      fetchFolders()
    } catch (error) {
      console.error("Error deleting folder:", error)
      toast.error("Lỗi khi xóa folder")
    }
  }

  const openEditDialog = (folder: Folder) => {
    setEditingFolder(folder)
    setFolderName(folder.name)
    setIsEditOpen(true)
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
      <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-4">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 bg-black text-white border-gray-800 hover:bg-gray-800 hover:border-gray-600 hover:text-white text-sm font-medium">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create folder</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-black font-medium">Tạo folder mới</DialogTitle>
              <DialogDescription>Nhập tên folder bạn muốn tạo</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-black font-medium">Tên folder</Label>
                <Input
                  id="name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Nhập tên folder"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className="text-black border-gray-300 focus-visible:border-gray-500 focus-visible:ring-gray-300"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="border-gray-300 text-white hover:bg-gray-100 hover:text-black hover:bg-gray-400">Hủy</Button>
              <Button onClick={handleCreate} className="bg-black text-white hover:bg-gray-800 font-medium">Tạo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black">Chỉnh sửa folder</DialogTitle>
            <DialogDescription>Nhập tên mới cho folder</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-black font-medium">Tên folder</Label>
              <Input
                id="edit-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Nhập tên folder"
                onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                className="text-black border-gray-300 focus-visible:border-gray-500 focus-visible:ring-gray-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="border-gray-300 text-white hover:bg-gray-100 hover:text-black hover:border-gray-400">Hủy</Button>
            <Button onClick={handleEdit} className="bg-black text-white hover:bg-white hover:text-black font-medium">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Folder className="h-12 w-12 mb-4 opacity-50" />
          <p>Chưa có folder nào. Tạo folder mới để bắt đầu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="group relative overflow-hidden rounded-lg border border-gray-300 bg-white hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => onFolderClick?.(folder._id)}
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100 flex items-center justify-center">
                <Folder className="h-16 w-16 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-black mb-1">{folder.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(folder.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 bg-white hover:bg-gray-100 ${folder.isShared ? "text-black" : "text-gray-700 hover:text-black"}`}
                  onClick={async (e) => {
                    e.stopPropagation()
                    try {
                      const updated = await foldersApi.toggleShare(folder._id, !folder.isShared)
                      setFolders(folders.map(f => f._id === folder._id ? updated : f))
                      toast.success(folder.isShared ? "Đã tắt share" : "Đã bật share")
                    } catch (error) {
                      console.error("Error toggling share:", error)
                      toast.error("Lỗi khi toggle share")
                    }
                  }}
                  title={folder.isShared ? "Đang share - Click để tắt" : "Click để share"}
                >
                  <Share2 className={`h-4 w-4 ${folder.isShared ? "font-bold fill-black" : ""}`} strokeWidth={folder.isShared ? 2.5 : 1.5} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white hover:bg-gray-100 text-gray-700 hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditDialog(folder)
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
                    handleDeleteClick(folder._id)
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
              Bạn có chắc muốn xóa folder này? Tất cả notes trong folder cũng sẽ bị xóa. Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-800 bg-black text-white hover:bg-white hover:text-black hover:border-gray-400"
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


