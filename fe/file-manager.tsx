"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileManagerSidebar } from "@/components/file-manager-sidebar"
import { AllContentView } from "@/components/all-content-view"
import { CVManagementView } from "@/components/cv-management-view"
import { AnalyticsView } from "@/components/analytics-view"
import { FolderContentView } from "@/components/folder-content-view"
import { NoteEditorView } from "@/components/note-editor-view"
import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar"
import { Bell, Grid, Plus, Search, User, LogOut } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/config/api"

function FileCard({ title, metadata, thumbnail }: { title: string; metadata: string; thumbnail: string }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-300 bg-white hover:border-gray-400 transition-colors">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-black">{title}</h3>
        <p className="text-sm text-gray-600">{metadata}</p>
      </div>
    </div>
  )
}

function AvatarMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      // Gọi API logout
      await fetch(`${API_URL}/api/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      // Xóa token khỏi localStorage
      localStorage.removeItem('token')
      
      // Redirect về trang login
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Vẫn xóa token và redirect ngay cả khi API call fail
      localStorage.removeItem('token')
      router.push('/login')
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <User className="h-4 w-4 text-gray-700" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-1">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
                  <span>Đang đăng xuất...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
      </div>
  )
}

function SwipeableContent({ children }: { children: React.ReactNode }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const minSwipeDistance = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || touchStartX.current === null) return
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = currentX - touchStartX.current
    const diffY = currentY - (touchStartY.current || 0)

    // Chỉ xử lý swipe ngang nếu di chuyển ngang nhiều hơn dọc
    if (Math.abs(diffX) > Math.abs(diffY) && diffX > 0 && touchStartX.current < 20) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || touchStartX.current === null) return
    
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const diffX = touchEndX - touchStartX.current
    const diffY = touchEndY - (touchStartY.current || 0)

    // Swipe từ trái sang phải (mở sidebar)
    if (
      Math.abs(diffX) > Math.abs(diffY) &&
      diffX > minSwipeDistance &&
      touchStartX.current < 50
    ) {
      setOpenMobile(true)
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full"
    >
      {children}
    </div>
  )
}

function FileManagerContent({ 
  activeView, 
  selectedFolderId,
  selectedNoteId,
  onFolderClick,
  onNoteClick,
  onBack
}: { 
  activeView: string
  selectedFolderId: string | null
  selectedNoteId: string | null
  onFolderClick: (folderId: string) => void
  onNoteClick?: (noteId: string) => void
  onBack?: () => void
}) {
  const renderContent = () => {
    switch (activeView) {
      case "note":
        return selectedNoteId ? <NoteEditorView noteId={selectedNoteId} onBack={onBack} /> : null
      case "all-content":
        return <AllContentView onFolderClick={onFolderClick} />
      case "cv":
        return <CVManagementView />
      case "analytics":
        return <AnalyticsView />
      case "folder-content":
        return <FolderContentView folderId={selectedFolderId} onNoteClick={onNoteClick} />
      default:
        return <AllContentView onFolderClick={onFolderClick} />
    }
  }

  return (
    <SwipeableContent>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-300 px-2 sm:px-4 bg-white">
          <div className="flex-1 max-w-96">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search files..." 
                className="pl-9 text-sm text-black border-gray-300 focus:border-gray-500 focus-visible:border-gray-500 focus-visible:ring-gray-300/50 focus-visible:ring-[3px]" 
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-black hover:bg-gray-100 hidden sm:flex">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-black hover:bg-gray-100">
              <Bell className="h-4 w-4" />
            </Button>
            <AvatarMenu />
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
    </SwipeableContent>
  )
}

export default function FileManager() {
  const [activeView, setActiveView] = useState("all-content")
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  // Check if there's a noteId in sessionStorage (from /note/[id] redirect)
  useEffect(() => {
    const openNoteId = sessionStorage.getItem('openNoteId')
    if (openNoteId) {
      sessionStorage.removeItem('openNoteId')
      setSelectedNoteId(openNoteId)
      setActiveView("note")
    }
  }, [])

  const handleViewChange = (view: string) => {
    setActiveView(view)
    if (view !== "folder-content" && view !== "note") {
      setSelectedFolderId(null)
      setSelectedNoteId(null)
    }
  }

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId)
    setActiveView("folder-content")
  }

  const handleNoteClick = (noteId: string) => {
    setSelectedNoteId(noteId)
    setActiveView("note")
  }

  const handleBack = () => {
    if (selectedFolderId) {
      setActiveView("folder-content")
    } else {
      setActiveView("all-content")
    }
    setSelectedNoteId(null)
  }

  return (
    <SidebarProvider>
      <FileManagerSidebar 
        activeView={activeView}
        selectedFolderId={selectedFolderId}
        selectedNoteId={selectedNoteId}
        onViewChange={handleViewChange}
        onFolderClick={handleFolderClick}
        onNoteClick={handleNoteClick}
      />
      <SidebarInset className="bg-white flex flex-col">
        <FileManagerContent 
          activeView={activeView}
          selectedFolderId={selectedFolderId}
          selectedNoteId={selectedNoteId}
          onFolderClick={handleFolderClick}
          onNoteClick={handleNoteClick}
          onBack={handleBack}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
