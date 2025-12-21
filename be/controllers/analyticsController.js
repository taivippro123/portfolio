import Analytics from "../models/AnalyticsModel.js";
import geoip from "geoip-lite";
import UAParser from "ua-parser-js";

// Ghi lại lượt xem CV
export const recordCVView = async (cvId, reqData) => {
  try {
    const ip = reqData.ipAddress;
    const userAgent = reqData.userAgent;
    const referer = reqData.referer;

    // Parse IP để lấy thông tin địa lý
    // Xử lý localhost IP (::1 hoặc 127.0.0.1)
    let country = "Unknown";
    let city = "Unknown";
    
    if (ip === "::1" || ip === "127.0.0.1" || ip === "unknown" || ip?.includes("localhost")) {
      country = "Local";
      city = "Local";
    } else {
      const geo = geoip.lookup(ip);
      country = geo?.country || "Unknown";
      city = geo?.city || "Unknown";
    }

    // Parse User Agent
    const parser = new UAParser(userAgent);
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const deviceInfo = parser.getDevice();

    // Xác định device type
    let deviceType = "unknown";
    if (deviceInfo.type === "mobile") {
      deviceType = "mobile";
    } else if (deviceInfo.type === "tablet") {
      deviceType = "tablet";
    } else if (!deviceInfo.type || deviceInfo.type === "desktop") {
      deviceType = "desktop";
    }

    const analytics = new Analytics({
      cvId,
      ipAddress: ip,
      country,
      city,
      browser: browserInfo.name || "Unknown",
      browserVersion: browserInfo.version || "Unknown",
      os: osInfo.name || "Unknown",
      device: deviceType,
      userAgent,
      referer,
    });

    await analytics.save();
    return analytics;
  } catch (error) {
    console.log("Record CV View Error:", error);
    throw error;
  }
};

// Lấy thống kê CV views (cần auth)
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Lấy CV của user
    const CV = (await import("../models/CVModel.js")).default;
    const cv = await CV.findOne({ userId });
    
    if (!cv) {
      return res.status(404).json({ message: "CV chưa được upload" });
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // Lấy tổng số records
    const totalRecords = await Analytics.countDocuments({ cvId: cv._id });

    // Lấy analytics với pagination (mới nhất trước)
    const analytics = await Analytics.find({ cvId: cv._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Lấy tất cả analytics để tính thống kê (không pagination)
    const allAnalytics = await Analytics.find({ cvId: cv._id })
      .sort({ createdAt: -1 })
      .limit(1000); // Giới hạn 1000 records để tính thống kê

    // Tính toán thống kê
    const totalViews = totalRecords;
    const uniqueIPs = new Set(allAnalytics.map((a) => a.ipAddress)).size;
    
    // Thống kê theo quốc gia
    const countryStats = {};
    allAnalytics.forEach((a) => {
      countryStats[a.country] = (countryStats[a.country] || 0) + 1;
    });

    // Thống kê theo device
    const deviceStats = {
      mobile: allAnalytics.filter((a) => a.device === "mobile").length,
      desktop: allAnalytics.filter((a) => a.device === "desktop").length,
      tablet: allAnalytics.filter((a) => a.device === "tablet").length,
      unknown: allAnalytics.filter((a) => a.device === "unknown").length,
    };

    // Thống kê theo browser
    const browserStats = {};
    allAnalytics.forEach((a) => {
      const browser = a.browser;
      browserStats[browser] = (browserStats[browser] || 0) + 1;
    });

    // Thống kê theo OS
    const osStats = {};
    allAnalytics.forEach((a) => {
      const os = a.os;
      osStats[os] = (osStats[os] || 0) + 1;
    });

    // Thống kê theo ngày
    const dailyStats = {};
    allAnalytics.forEach((a) => {
      const date = new Date(a.createdAt).toISOString().split("T")[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });

    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      totalViews,
      uniqueIPs,
      countryStats,
      deviceStats,
      browserStats,
      osStats,
      dailyStats,
      data: analytics, // Data cho trang hiện tại
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Get Analytics Error:", error);
  }
};

