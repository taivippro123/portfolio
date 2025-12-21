"use client"

import { useEffect, useState } from "react"
import { Folder, FileText, Eye, Calendar } from "lucide-react"
import { shareApi } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Folder {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface Note {
  _id: string
  title: string
  content: string
  folderId?: string
  createdAt: string
  updatedAt: string
}

interface SharedContent {
  folders: Folder[]
  notes: Note[]
  notesByFolder: Record<string, Note[]>
}

export default function SharePage() {
  const [content, setContent] = useState<SharedContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        setLoading(true)
        const data = await shareApi.getSharedContent()
        setContent(data)
      } catch (error) {
        console.error("Error fetching shared content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSharedContent()
  }, [])

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!content || (content.folders.length === 0 && content.notes.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Chưa có nội dung được share</h2>
          <p className="text-gray-600">Nội dung được share sẽ hiển thị tại đây</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Taivippro123</h1>
            <p className="text-lg text-gray-600">Nội dung được chia sẻ</p>
          </div>

          {/* Shared Notes */}
          {content.notes.length > 0 && (
            <div className="space-y-12">
              {/* Notes grouped by folder */}
              {Object.keys(content.notesByFolder).map((folderId) => {
                const folderNotes = content.notesByFolder[folderId]
                const folder = content.folders.find((f) => f._id === folderId)
                
                return (
                  <section key={folderId} className="space-y-6">
                    {folder && (
                      <div className="flex items-center gap-3 pb-2 border-b-2 border-gray-300">
                        <div className="p-2 bg-gray-200 rounded-lg">
                          <Folder className="h-6 w-6 text-gray-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{folder.name}</h2>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {folderNotes.map((note) => (
                        <div
                          key={note._id}
                          className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                          onClick={() => handleNoteClick(note)}
                        >
                          {/* Card Header */}
                          <div className="p-5 pb-3">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                                <FileText className="h-5 w-5 text-gray-700" />
                              </div>
                              <h3 className="font-semibold text-gray-900 text-lg flex-1 leading-tight">
                                {note.title}
                              </h3>
                            </div>
                            
                            {/* Content Preview */}
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 line-clamp-4">
                                {note.content ? (
                                  <span 
                                    dangerouslySetInnerHTML={{ 
                                      __html: note.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                                    }} 
                                  />
                                ) : (
                                  <span className="text-gray-400 italic">Không có nội dung</span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(note.updatedAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-gray-600 hover:text-black hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleNoteClick(note)
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Xem chi tiết
                            </Button>
                          </div>

                          {/* Hover Effect */}
                          <div className="absolute inset-0 border-2 border-gray-300 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}

              {/* Notes without folder */}
              {content.notesByFolder["no-folder"] && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b-2 border-gray-300">
                    <div className="p-2 bg-gray-200 rounded-lg">
                      <FileText className="h-6 w-6 text-gray-700" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Notes không có folder</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {content.notesByFolder["no-folder"].map((note) => (
                      <div
                        key={note._id}
                        className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                        onClick={() => handleNoteClick(note)}
                      >
                        {/* Card Header */}
                        <div className="p-5 pb-3">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                              <FileText className="h-5 w-5 text-gray-700" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-lg flex-1 leading-tight">
                              {note.title}
                            </h3>
                          </div>
                          
                          {/* Content Preview */}
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 line-clamp-4">
                              {note.content ? (
                                <span 
                                  dangerouslySetInnerHTML={{ 
                                    __html: note.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                                  }} 
                                />
                              ) : (
                                <span className="text-gray-400 italic">Không có nội dung</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(note.updatedAt).toLocaleDateString("vi-VN")}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-600 hover:text-black hover:bg-gray-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNoteClick(note)
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Xem chi tiết
                          </Button>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 border-2 border-gray-300 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Content Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-gray-300 bg-white [&>button]:text-black [&>button]:hover:text-black [&>button]:hover:bg-gray-200 [&>button]:opacity-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black mb-2">
              {selectedNote?.title}
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4" />
              <span>
                Cập nhật: {selectedNote ? new Date(selectedNote.updatedAt).toLocaleDateString("vi-VN", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : ''}
              </span>
            </div>
          </DialogHeader>
          
          <div className="mt-4">
            <div 
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ 
                __html: selectedNote?.content 
                  ? (() => {
                      let html = selectedNote.content;
                      // Process all <a> tags to ensure they have proper attributes
                      html = html.replace(/<a\s+([^>]*?)>/gi, (match, attrs) => {
                        // Ensure links have target="_blank" and rel="noopener noreferrer"
                        let newAttrs = attrs;
                        if (!newAttrs.includes('target=')) {
                          newAttrs += ' target="_blank"';
                        }
                        if (!newAttrs.includes('rel=')) {
                          newAttrs += ' rel="noopener noreferrer"';
                        }
                        // Ensure href exists
                        if (!newAttrs.includes('href=')) {
                          // Try to extract URL from text if href is missing
                          const urlMatch = match.match(/https?:\/\/[^\s<>"']+/i);
                          if (urlMatch) {
                            newAttrs = `href="${urlMatch[0]}" ${newAttrs}`;
                          }
                        }
                        return `<a ${newAttrs}>`;
                      });
                      return html;
                    })()
                  : '' 
              }}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
              onClick={(e) => {
                // Allow clicks on links to work properly
                const target = e.target as HTMLElement;
                const link = target.tagName === 'A' ? target : target.closest('a');
                if (link) {
                  // Don't prevent default - let the link work naturally
                  e.stopPropagation();
                  // Ensure the link has href
                  const href = (link as HTMLAnchorElement).getAttribute('href');
                  if (!href || href === '#') {
                    e.preventDefault();
                  }
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
