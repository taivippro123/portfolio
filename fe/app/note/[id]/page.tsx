"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

export default function NotePage() {
  const params = useParams()
  const router = useRouter()
  const noteId = params.id as string

  // Redirect to manage page with note opened inline
  useEffect(() => {
    if (noteId) {
      // Store noteId in sessionStorage so FileManager can open it
      sessionStorage.setItem('openNoteId', noteId)
      router.replace('/manage')
    }
  }, [noteId, router])

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-gray-500">Đang chuyển hướng...</div>
      </div>
    </ProtectedRoute>
  )
}
