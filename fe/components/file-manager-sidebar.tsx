"use client"

import * as React from "react"
import { ChevronRight, File, Folder, LayoutGrid, Presentation, BarChart3 } from "lucide-react"
import Link from "next/link"

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

const collections = [
  "Product Demos",
  "Case Studies",
  "Sales Collateral",
  "Training Materials",
]

export function FileManagerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                <SidebarMenuButton asChild isActive className="data-[active=true]:bg-gray-200 data-[active=true]:text-black text-gray-700 hover:bg-gray-100 hover:text-black">
                  <Link href="#">
                    <LayoutGrid className="h-4 w-4" />
                    <span>All content</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-gray-700 hover:bg-gray-100 hover:text-black">
                  <Link href="#">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 !text-gray-600">Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collections.map((collection, index) => (
                <SidebarMenuItem key={index}>
                  <Collapsible
                    className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                    defaultOpen={false}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="text-gray-700 hover:bg-gray-100 hover:text-black">
                        <ChevronRight className="transition-transform" />
                        <Folder className="h-4 w-4" />
                        <span>{collection}</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild className="text-gray-600 hover:bg-gray-100 hover:text-black">
                            <Link href="#">
                              <File className="h-4 w-4" />
                              <span>Item 1</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild className="text-gray-600 hover:bg-gray-100 hover:text-black">
                            <Link href="#">
                              <File className="h-4 w-4" />
                              <span>Item 2</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

