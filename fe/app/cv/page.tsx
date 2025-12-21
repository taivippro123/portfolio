"use client"

import { useEffect, useState } from "react"
import { API_URL } from "@/config/api"

export default function CVPage() {
  const [cvUrl, setCvUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCV = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/cv/public`)
        if (!response.ok) {
          throw new Error("CV không tồn tại")
        }
        const data = await response.json()
        setCvUrl(data.fileUrl)
      } catch (error: any) {
        setError(error.message || "Không thể tải CV")
      } finally {
        setLoading(false)
      }
    }

    fetchCV()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-gray-500">Đang tải CV...</div>
      </div>
    )
  }

  if (error || !cvUrl) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-2">{error || "CV không tồn tại"}</p>
          <a href="/" className="text-gray-700 hover:text-black underline">
            Về trang chủ
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-white">
      <iframe
        src={cvUrl}
        className="w-full h-full border-0"
        title="CV"
      />
    </div>
  )
}

