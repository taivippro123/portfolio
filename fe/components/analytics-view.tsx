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
  const [activeTab, setActiveTab] = useState<"cv" | "home">("cv")
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const data =
          activeTab === "cv"
            ? await analyticsApi.getCV(currentPage)
            : await analyticsApi.getHome(currentPage)
        setAnalytics(data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [currentPage, activeTab])

  const handleTabChange = (tab: "cv" | "home") => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <div className="p-3 sm:p-6 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Thống kê Lượt xem</h2>
          <p className="text-sm text-gray-500 mt-1">Theo dõi lượt truy cập portfolio của bạn</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 self-start">
          <button
            onClick={() => handleTabChange("cv")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "cv"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Lượt xem CV
          </button>
          <button
            onClick={() => handleTabChange("home")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "home"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Lượt xem Trang chủ
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-gray-500 animate-pulse">Đang tải dữ liệu...</div>
        </div>
      ) : !analytics || analytics.totalViews === 0 ? (
        <div className="border border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
          <p className="text-gray-600 font-medium">Chưa có dữ liệu thống kê nào cho mục này</p>
        </div>
      ) : (
        <>
          {/* Stats summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Tổng lượt xem</p>
              <p className="text-2xl font-bold text-black mt-1">{analytics.totalViews}</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Unique IPs</p>
              <p className="text-2xl font-bold text-black mt-1">{analytics.uniqueIPs || 0}</p>
            </div>
            {/* Device breakdown summaries */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm col-span-1 sm:col-span-2">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Thiết bị</p>
              <div className="flex gap-4 items-center h-8">
                {analytics.deviceStats && (
                  <>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-gray-500">Desktop</span>
                      <span className="block font-semibold text-black text-sm">{analytics.deviceStats.desktop || 0}</span>
                    </div>
                    <div className="w-px h-full bg-gray-200"></div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-gray-500">Mobile</span>
                      <span className="block font-semibold text-black text-sm">{analytics.deviceStats.mobile || 0}</span>
                    </div>
                    <div className="w-px h-full bg-gray-200"></div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-gray-500">Tablet</span>
                      <span className="block font-semibold text-black text-sm">{analytics.deviceStats.tablet || 0}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Thời gian</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">IP Address</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Quốc gia</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Thành phố</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Trình duyệt</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">OS</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Referer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(analytics.data || analytics.recentViews || []).map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-black font-medium">
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-sm text-black font-mono">
                      {item.ipAddress === "::1" || item.ipAddress === "127.0.0.1" ? "Localhost" : item.ipAddress}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {item.country === "Unknown" && (item.ipAddress === "::1" || item.ipAddress === "127.0.0.1") ? "Local" : item.country}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {item.city === "Unknown" && (item.ipAddress === "::1" || item.ipAddress === "127.0.0.1") ? "Local" : (item.city || "N/A")}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {item.browser} {item.browserVersion ? `v${item.browserVersion}` : ""}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">{item.os}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium text-black ${
                        item.device === "mobile" ? "bg-blue-100 text-blue-800" :
                        item.device === "tablet" ? "bg-amber-100 text-amber-800" :
                        item.device === "desktop" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {item.device}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.referer === "Me" ? (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-850 border border-purple-300 rounded text-xs font-bold shadow-sm">
                          Me (Self)
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          item.referer === "Facebook" ? "bg-indigo-100 text-indigo-800 border border-indigo-200" :
                          item.referer === "LinkedIn" ? "bg-sky-100 text-sky-800 border border-sky-200" :
                          item.referer === "GitHub" ? "bg-slate-100 text-slate-800 border border-slate-200" :
                          item.referer === "CV" ? "bg-rose-100 text-rose-800 border border-rose-200" :
                          item.referer === "Direct" ? "bg-gray-100 text-gray-800 border border-gray-200" :
                          "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        } border`}>
                          {item.referer || "Direct"}
                        </span>
                      )}
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
                  Trang {pagination.currentPage}/{pagination.totalPages} { }
                  ({pagination.totalRecords} bản ghi)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="border-gray-300 text-white hover:bg-gray-100 hover:text-black hover:border-gray-400 disabled:opacity-50"
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
                              ? "bg-black text-white hover:bg-grey-200 animate-none"
                              : "border-gray-300 text-white hover:bg-gray-100 hover:text-black hover:border-gray-400"
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
                    className="border-gray-300 text-white hover:bg-gray-100 hover:text-black hover:border-gray-400 disabled:opacity-50"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  )
}
