"use client"

import * as React from "react"
import { ChevronRight, File, Folder, LayoutGrid, Presentation, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { foldersApi, notesApi } from "@/lib/api"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"

interface Folder {
  _id: string
  name: string
}

interface Note {
  _id: string
  title: string
  folderId?: string
}

export function FileManagerSidebar({ 
  activeView,
  selectedFolderId,
  selectedNoteId,
  onViewChange,
  onFolderClick,
  onNoteClick,
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  activeView?: string
  selectedFolderId?: string | null
  selectedNoteId?: string | null
  onViewChange?: (view: string) => void
  onFolderClick?: (folderId: string) => void
  onNoteClick?: (noteId: string) => void
}) {
  const router = useRouter()
  const [folders, setFolders] = useState<Folder[]>([])
  const [folderNotes, setFolderNotes] = useState<Record<string, Note[]>>({})
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foldersData = await foldersApi.getAll()
        setFolders(foldersData)
        
        // Fetch all notes once and group by folderId
        try {
          const allNotes = await notesApi.getAll()
          const notesMap: Record<string, Note[]> = {}
          for (const folder of foldersData) {
            notesMap[folder._id] = allNotes.filter((note: Note) => note.folderId === folder._id)
          }
          setFolderNotes(notesMap)
        } catch (error) {
          console.error("Error fetching notes:", error)
          // Initialize empty map for each folder
          const notesMap: Record<string, Note[]> = {}
          for (const folder of foldersData) {
            notesMap[folder._id] = []
          }
          setFolderNotes(notesMap)
        }
      } catch (error) {
        console.error("Error fetching folders:", error)
      }
    }
    fetchData()
  }, [])

  const toggleFolder = (folderId: string) => {
    const newOpenFolders = new Set(openFolders)
    if (newOpenFolders.has(folderId)) {
      newOpenFolders.delete(folderId)
    } else {
      newOpenFolders.add(folderId)
      if (onFolderClick) {
        onFolderClick(folderId)
      }
    }
    setOpenFolders(newOpenFolders)
  }
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      [data-mobile="true"] {
        --sidebar-accent: rgb(243 244 246) !important;
        --sidebar-accent-foreground: rgb(0 0 0) !important;
        --sidebar-border: rgb(209 213 219) !important;
        --sidebar-ring: rgb(209 213 219) !important;
      }
      [data-mobile="true"] [data-sidebar="menu-button"]:hover {
        background-color: rgb(243 244 246) !important;
        color: rgb(0 0 0) !important;
      }
      [data-mobile="true"] [data-sidebar="menu-sub-button"]:hover {
        background-color: rgb(243 244 246) !important;
        color: rgb(0 0 0) !important;
      }
      [data-mobile="true"] [data-sidebar="menu-button"][data-active="true"] {
        background-color: rgb(229 231 235) !important;
        color: rgb(0 0 0) !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <Sidebar 
      {...props} 
      className="bg-white border-r border-gray-300 [&_[data-sidebar=menu-button]]:!text-gray-700 [&_[data-sidebar=menu-button]:hover]:!bg-gray-100 [&_[data-sidebar=menu-button]:hover]:!text-black [&_[data-sidebar=menu-button][data-active=true]]:!bg-gray-200 [&_[data-sidebar=menu-button][data-active=true]]:!text-black [&_[data-sidebar=menu-sub-button]]:!text-gray-600 [&_[data-sidebar=menu-sub-button]:hover]:!bg-gray-100 [&_[data-sidebar=menu-sub-button]:hover]:!text-black"
      style={{
        '--sidebar-accent': 'rgb(243 244 246)',
        '--sidebar-accent-foreground': 'rgb(0 0 0)',
        '--sidebar-border': 'rgb(209 213 219)',
        '--sidebar-ring': 'rgb(209 213 219)',
      } as React.CSSProperties}
    >
      <SidebarHeader className="p-4 border-b border-gray-300 bg-white">
        <a href="/" className="text-xl font-bold text-black bg-white">Taivippro123</a>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activeView === "all-content"} 
                  className="data-[active=true]:bg-gray-200 data-[active=true]:text-black text-gray-700 hover:bg-gray-100 hover:text-black"
                  onClick={() => onViewChange?.("all-content")}
                >
                  <a href="#" onClick={(e) => { e.preventDefault(); onViewChange?.("all-content") }}>
                    <LayoutGrid className="h-4 w-4" />
                    <span>All content</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activeView === "cv"} 
                  className="text-gray-700 hover:bg-gray-100 hover:text-black"
                  onClick={() => onViewChange?.("cv")}
                >
                  <a href="#" onClick={(e) => { e.preventDefault(); onViewChange?.("cv") }}>
                    <File className="h-4 w-4" />
                    <span>CV</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={activeView === "analytics"} 
                  className="text-gray-700 hover:bg-gray-100 hover:text-black"
                  onClick={() => onViewChange?.("analytics")}
                >
                  <a href="#" onClick={(e) => { e.preventDefault(); onViewChange?.("analytics") }}>
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 !text-gray-600">Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder._id}>
                  <Collapsible
                    className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                    open={openFolders.has(folder._id)}
                    onOpenChange={() => toggleFolder(folder._id)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        className="text-gray-700 hover:bg-gray-100 hover:text-black data-[active=true]:bg-gray-200 data-[active=true]:text-black"
                        isActive={selectedFolderId === folder._id}
                      >
                        <ChevronRight className="transition-transform" />
                        <Folder className="h-4 w-4" />
                        <span>{folder.name}</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {folderNotes[folder._id]?.map((note) => (
                          <SidebarMenuItem key={note._id}>
                            <SidebarMenuButton 
                              asChild 
                              className="text-gray-600 hover:bg-gray-100 hover:text-black data-[active=true]:bg-gray-200 data-[active=true]:text-black"
                              isActive={selectedNoteId === note._id}
                              onClick={() => {
                                if (onNoteClick) {
                                  onNoteClick(note._id)
                                } else {
                                  router.push(`/note/${note._id}`)
                                }
                              }}
                            >
                              <a href={`/note/${note._id}`} onClick={(e) => e.preventDefault()}>
                                <File className="h-4 w-4" />
                                <span>{note.title}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                        {(!folderNotes[folder._id] || folderNotes[folder._id].length === 0) && (
                          <SidebarMenuItem>
                            <div className="px-4 py-2 text-sm text-gray-500">Không có note nào</div>
                          </SidebarMenuItem>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ))}
              {folders.length === 0 && (
                <SidebarMenuItem>
                  <div className="px-4 py-2 text-sm text-gray-500">Chưa có folder nào</div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

