"use client"

import FileManager from "@/file-manager"
import { ProtectedRoute } from "@/components/protected-route"

export default function ManagePage() {
  return (
    <ProtectedRoute>
      <FileManager />
    </ProtectedRoute>
  )
}

