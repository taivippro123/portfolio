"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { analyticsApi } from "@/lib/api"

interface AnalyticsData {
  _id: string
  resourceType: string
  resourceId: string
  ipAddress: string
  country: string
  city?: string
  browser: string
  browserVersion?: string
  os: string
  device: string
  userAgent: string
  referer?: string
  createdAt: string
}

interface AnalyticsResponse {
  totalViews: number
  uniqueIPs?: number
  countryStats?: Record<string, number>
  deviceStats?: {
    mobile: number
    desktop: number
    tablet: number
    unknown: number
  }
  browserStats?: Record<string, number>
  osStats?: Record<string, number>
  dailyStats?: Record<string, number>
  recentViews?: AnalyticsData[]
  data: AnalyticsData[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalRecords: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export function AnalyticsView() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const data = await analyticsApi.getCV(currentPage)
        setAnalytics(data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [currentPage])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    )
  }

  if (!analytics || analytics.totalViews === 0) {
    return (
      <div className="p-3 sm:p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4 text-black">Analytics</h2>
        <div className="border border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
          <p className="text-gray-600">Chưa có dữ liệu analytics nào</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-black">Analytics CV</h2>
      
      <div className="mb-6 p-4 rounded-lg">
        <p className="text-lg font-semibold text-black">Tổng lượt xem: {analytics.totalViews}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-black font-semibold">Thời gian</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-black font-semibold">IP Address</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-black font-semibold">Quốc gia</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-black font-semibold">Thành phố</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-black font-semibold">Trình duyệt</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-black font-semibold">OS</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-black font-semibold">Device</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-black font-semibold">Referer</th>
            </tr>
          </thead>
          <tbody>
            {(analytics.data || analytics.recentViews || []).map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-sm text-black">
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-black">{item.ipAddress === "::1" || item.ipAddress === "127.0.0.1" ? "Localhost" : item.ipAddress}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-black">{item.country === "Unknown" && (item.ipAddress === "::1" || item.ipAddress === "127.0.0.1") ? "Local" : item.country}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-black">{item.city === "Unknown" && (item.ipAddress === "::1" || item.ipAddress === "127.0.0.1") ? "Local" : (item.city || "N/A")}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-black">
                  {item.browser} {item.browserVersion ? `v${item.browserVersion}` : ""}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-black">{item.os}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded text-xs text-black ${
                    item.device === "mobile" ? "bg-gray-200" :
                    item.device === "tablet" ? "bg-gray-300" :
                    "bg-gray-100"
                  }`}>
                    {item.device}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-black">
                  {item.referer || "Direct"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {analytics.pagination && analytics.pagination.totalPages > 1 && (() => {
        const pagination = analytics.pagination!;
        return (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Trang {pagination.currentPage} / {pagination.totalPages} 
              ({pagination.totalRecords} records)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!pagination.hasPrevPage}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black hover:border-gray-400 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={
                        pagination.currentPage === pageNum
                          ? "bg-black text-white hover:bg-gray-800"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black hover:border-gray-400"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={!pagination.hasNextPage}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black hover:border-gray-400 disabled:opacity-50"
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })()}
    </div>
  )
}

