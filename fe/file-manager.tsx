"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileManagerSidebar } from "@/components/file-manager-sidebar"
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

function FileManagerContent() {
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

        <div className="p-3 sm:p-6 bg-white">
          <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
          <Button variant="outline" className="gap-2 bg-black text-white border-gray-800 hover:bg-gray-100 hover:border-gray-700 text-sm whitespace-nowrap shrink-0">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
            <Button variant="outline" className="gap-2 bg-black text-white border-gray-800 hover:bg-gray-100 hover:border-gray-700 text-sm whitespace-nowrap shrink-0">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline">Upload</span>
            </Button>
            <Button variant="outline" className="gap-2 bg-black text-white border-gray-800 hover:bg-gray-100 hover:border-gray-700 text-sm whitespace-nowrap shrink-0">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline">Create folder</span>
            </Button>
            <Button variant="outline" className="gap-2 bg-black text-white border-gray-800 hover:bg-gray-100 hover:border-gray-700 text-sm whitespace-nowrap shrink-0">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM12 14a2 2 0 100-4 2 2 0 000 4z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline">Record</span>
            </Button>
          </div>

          <div className="mb-6">
            <Tabs defaultValue="recent">
              <TabsList className="bg-gray-100 border border-gray-300">
                <TabsTrigger 
                  value="recent" 
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-gray-300 text-gray-700"
                >
                  Recent
                </TabsTrigger>
                <TabsTrigger 
                  value="starred"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-gray-300 text-gray-700"
                >
                  Starred
                </TabsTrigger>
                <TabsTrigger 
                  value="shared"
                  className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-gray-300 text-gray-700"
                >
                  Shared
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FileCard title="Q4 Sales Deck" metadata="Shared folder • 8 presentations" thumbnail="/placeholder.svg" />
            <FileCard title="Product Videos" metadata="Shared folder • 5 videos" thumbnail="/placeholder.svg" />
            <FileCard title="ROI Calculator" metadata="Shared file • 1 Excel" thumbnail="/placeholder.svg" />
            <FileCard title="Marketing Materials" metadata="Shared folder • 12 files" thumbnail="/placeholder.svg" />
            <FileCard title="Team Photos" metadata="Shared folder • 24 images" thumbnail="/placeholder.svg" />
            <FileCard title="Annual Report" metadata="Shared file • 1 PDF" thumbnail="/placeholder.svg" />
            <FileCard title="Training Videos" metadata="Shared folder • 6 videos" thumbnail="/placeholder.svg" />
            <FileCard title="Client Proposals" metadata="Shared folder • 15 documents" thumbnail="/placeholder.svg" />
          </div>
        </div>
    </SwipeableContent>
  )
}

export default function FileManager() {
  return (
    <SidebarProvider>
      <FileManagerSidebar />
      <SidebarInset className="bg-white">
        <FileManagerContent />
      </SidebarInset>
    </SidebarProvider>
  )
}
