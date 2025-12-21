"use client"

import { useEffect, useState, useRef } from "react"
import { Upload, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cvApi } from "@/lib/api"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CV {
  _id: string
  fileName: string
  fileUrl: string
  fileType: string
  createdAt: string
  updatedAt: string
}

export function CVManagementView() {
  const [cv, setCv] = useState<CV | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchCV = async () => {
    try {
      setLoading(true)
      const data = await cvApi.getMyCV()
      setCv(data)
    } catch (error: any) {
      if (error.message.includes("404") || error.message.includes("CV chưa được upload")) {
        setCv(null)
      } else {
        console.error("Error fetching CV:", error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCV()
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file PDF hoặc DOC/DOCX")
      return
    }

    try {
      setUploading(true)
      const uploadedCV = await cvApi.upload(file)
      setCv(uploadedCV.cv || uploadedCV)
      toast.success("CV đã được upload thành công!")
    } catch (error) {
      console.error("Error uploading CV:", error)
      toast.error("Lỗi khi upload CV")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async () => {
    try {
      await cvApi.delete()
      setCv(null)
      setDeleteDialogOpen(false)
      toast.success("CV đã được xóa")
    } catch (error) {
      console.error("Error deleting CV:", error)
      toast.error("Lỗi khi xóa CV")
    }
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-black">Quản lý CV</h2>
        
        <div className="mb-4 flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="cv-upload"
          />
          <label htmlFor="cv-upload">
            <Button
              variant="outline"
              className="gap-2 bg-black text-white border-gray-800 hover:bg-gray-800 hover:border-gray-600 hover:text-white font-medium"
              disabled={uploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4" />
                {uploading ? "Đang upload..." : "Upload CV"}
              </span>
            </Button>
          </label>
        </div>

        {cv ? (
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-lg text-black">{cv.fileName}</h3>
                    <p className="text-sm text-gray-600">
                      Cập nhật: {new Date(cv.updatedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="gap-2 border-gray-300 text-white hover:bg-gray-100 hover:text-black hover:border-gray-400 font-medium"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <a
                  href="/cv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-black hover:underline text-sm"
                >
                  Xem CV trên tab mới →
                </a>
              </div>
            </div>
            
            {/* Preview inline */}
            <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
              <div className="p-4 border-b border-gray-300 bg-gray-50">
                <h3 className="font-semibold text-black">Preview CV</h3>
              </div>
              <div className="h-[600px] w-full">
                <iframe
                  src={cv.fileUrl}
                  className="w-full h-full border-0"
                  title="CV Preview"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">Chưa có CV nào. Upload CV để bắt đầu!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-gray-300 bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-gray-600">
              Bạn có chắc muốn xóa CV này? Hành động này không thể hoàn tác.
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

