"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2, Bold, Italic, List, ListOrdered, Heading1, Heading2, Undo, Redo } from "lucide-react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { notesApi } from "@/lib/api"
import { toast } from "sonner"

// Custom extension để auto-detect URLs
const AutolinkExtension = Extension.create({
  name: "autolink",
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("autolink"),
        appendTransaction: (transactions, oldState, newState) => {
          if (transactions.length === 0 || !transactions.some(tr => tr.docChanged)) {
            return null
          }
          
          const tr = newState.tr
          let modified = false
          
          newState.doc.descendants((node, pos) => {
            if (node.isText && node.text && !node.marks.some(mark => mark.type.name === "link")) {
              const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g
              const matches = [...node.text.matchAll(urlRegex)]
              
              if (matches.length > 0) {
                matches.reverse().forEach((match) => {
                  const url = match[0]
                  const href = url.startsWith("http") ? url : `https://${url}`
                  const start = pos + (match.index || 0)
                  const end = start + url.length
                  
                  const marksAtPos = newState.doc.resolve(start).marks()
                  const hasLink = marksAtPos.some(mark => mark.type.name === "link")
                  
                  if (!hasLink) {
                    const linkMark = newState.schema.marks.link.create({ href })
                    tr.addMark(start, end, linkMark)
                    modified = true
                  }
                })
              }
            }
          })
          
          return modified ? tr : null
        },
      }),
    ]
  },
})

interface Note {
  _id: string
  title: string
  content: string
  folderId?: string
  createdAt: string
  updatedAt: string
}

interface NoteEditorViewProps {
  noteId: string
  onBack?: () => void
}

export function NoteEditorView({ noteId, onBack }: NoteEditorViewProps) {
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.extend({
        inclusive: false,
      }).configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 hover:underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder: "Bắt đầu viết...",
      }),
      AutolinkExtension,
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[calc(100vh-300px)] px-8 py-8 text-black",
      },
      handlePaste: (view, event) => {
        return false
      },
    },
    onUpdate: ({ editor }: { editor: Editor }) => {
      if (note) {
        const currentContent = editor.getHTML()
        const originalContent = note.content || ""
        setHasChanges(title !== note.title || currentContent !== originalContent)
      }
    },
  })

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true)
        const data = await notesApi.getById(noteId)
        setNote(data)
        setTitle(data.title)
        if (editor && data.content) {
          editor.commands.setContent(data.content)
        }
      } catch (error) {
        console.error("Error fetching note:", error)
        toast.error("Không thể tải note")
        if (onBack) {
          onBack()
        } else {
          router.push("/manage")
        }
      } finally {
        setLoading(false)
      }
    }

    if (noteId && editor) {
      fetchNote()
    }
  }, [noteId, router, editor, onBack])

  const handleSave = async () => {
    if (!note || !title.trim() || !editor) return
    try {
      setSaving(true)
      const htmlContent = editor.getHTML()
      const updated = await notesApi.update(note._id, {
        title,
        content: htmlContent,
        folderId: note.folderId,
      })
      setNote(updated)
      setHasChanges(false)
      toast.success("Đã lưu thành công!")
    } catch (error) {
      console.error("Error saving note:", error)
      toast.error("Lỗi khi lưu note")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!note) return
    try {
      await notesApi.delete(note._id)
      setDeleteDialogOpen(false)
      if (onBack) {
        onBack()
      } else {
        router.push("/manage")
      }
    } catch (error) {
      console.error("Error deleting note:", error)
      toast.error("Lỗi khi xóa note")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    )
  }

  if (!note || !editor) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Note không tồn tại</p>
          <Button
            variant="outline"
            onClick={onBack || (() => router.push("/manage"))}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black"
          >
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Note Header */}
      <div className="border-b border-gray-300 bg-white px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack || (() => router.push("/manage"))}
              className="hover:bg-gray-100 text-gray-700 hover:text-black"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 max-w-2xl">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề note"
                className="w-full text-2xl font-semibold bg-transparent border-none outline-none text-black placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-sm text-gray-500">Đã thay đổi</span>
            )}
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={!hasChanges || saving || !title.trim()}
              className="gap-2 border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black hover:border-gray-400 font-medium disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-2 border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black hover:border-gray-400 font-medium"
            >
              <Trash2 className="h-4 w-4" />
              Xóa
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 border-t border-gray-200 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`h-8 px-2 hover:bg-gray-100 text-gray-700 hover:text-black ${
              editor.isActive("bold") ? "bg-gray-100 text-black" : ""
            }`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`h-8 px-2 hover:bg-gray-100 text-gray-700 hover:text-black ${
              editor.isActive("italic") ? "bg-gray-100 text-black" : ""
            }`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`h-8 px-2 hover:bg-gray-100 text-gray-700 hover:text-black ${
              editor.isActive("heading", { level: 1 }) ? "bg-gray-100 text-black" : ""
            }`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`h-8 px-2 hover:bg-gray-100 text-gray-700 hover:text-black ${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-100 text-black" : ""
            }`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 px-2 hover:bg-gray-100 text-gray-700 hover:text-black ${
              editor.isActive("bulletList") ? "bg-gray-100 text-black" : ""
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 px-2 hover:bg-gray-100 text-gray-700 hover:text-black ${
              editor.isActive("orderedList") ? "bg-gray-100 text-black" : ""
            }`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="h-8 px-2 hover:bg-gray-100 text-gray-700 hover:text-black"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="h-8 px-2 hover:bg-gray-100 text-gray-700 hover:text-black"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto bg-white">
        <EditorContent 
          editor={editor}
          className="h-full"
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 bg-gray-50 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div>
            <span>Tạo: {new Date(note.createdAt).toLocaleString("vi-VN")}</span>
          </div>
          <div>
            <span>Cập nhật: {new Date(note.updatedAt).toLocaleString("vi-VN")}</span>
          </div>
        </div>
      </div>

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
              className="border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black"
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

