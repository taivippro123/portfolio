import Analytics from "../models/AnalyticsModel.js";
import geoip from "geoip-lite";
import UAParser from "ua-parser-js";

// Helper to parse and clean referer strings
export const parseReferer = (refererStr, queryRef) => {
  if (queryRef) {
    const q = queryRef.trim().toLowerCase();
    if (q === "me") return "Me";
    if (q === "facebook" || q === "fb") return "Facebook";
    if (q === "linkedin") return "LinkedIn";
    if (q === "github") return "GitHub";
    if (q === "cv") return "CV";
    // Capitalize first letter of other custom ref parameters
    return q.charAt(0).toUpperCase() + q.slice(1);
  }

  if (!refererStr || refererStr === "direct" || refererStr === "unknown") return "Direct";

  const ref = refererStr.toLowerCase();
  if (ref.includes("facebook.com") || ref.includes("fb.me")) return "Facebook";
  if (ref.includes("linkedin.com")) return "LinkedIn";
  if (ref.includes("github.com")) return "GitHub";
  if (ref.includes("google.com")) return "Google Search";
  
  try {
    const url = new URL(refererStr);
    const hostname = url.hostname.replace("www.", "");
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);
  } catch (e) {
    return refererStr;
  }
};

// Ghi lại lượt xem CV
export const recordCVView = async (cvId, reqData) => {
  try {
    const ip = reqData.ipAddress;
    const userAgent = reqData.userAgent;
    const referer = parseReferer(reqData.referer, reqData.ref);

    // Parse IP để lấy thông tin địa lý
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
      resourceType: "cv",
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

// Ghi lại lượt xem trang Home
export const recordHomeView = async (req, res) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress || req.socket.remoteAddress || "unknown";
    const userAgent = req.get("user-agent") || "unknown";
    
    const { referer: clientReferer, ref: queryRef } = req.body;
    const refererHeader = req.get("referer") || "direct";
    const rawReferer = clientReferer || refererHeader;
    const referer = parseReferer(rawReferer, queryRef);

    // Parse IP để lấy thông tin địa lý
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
      resourceType: "home",
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
    return res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    console.log("Record Home View Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
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

    // Lấy tổng số records (bao gồm cả "Me") để hiển thị trong table
    const totalRecords = await Analytics.countDocuments({ cvId: cv._id, resourceType: "cv" });
    
    // Lấy tổng số lượt xem thực tế (không tính "Me") để hiển thị Tổng lượt xem
    const totalViews = await Analytics.countDocuments({ cvId: cv._id, resourceType: "cv", referer: { $ne: "Me" } });

    // Lấy analytics với pagination (mới nhất trước)
    const analytics = await Analytics.find({ cvId: cv._id, resourceType: "cv" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Lấy tất cả analytics để tính thống kê (không pagination)
    const allAnalytics = await Analytics.find({ cvId: cv._id, resourceType: "cv" })
      .sort({ createdAt: -1 })
      .limit(1000);

    // Lọc bỏ "Me" để tính các thống kê biểu đồ/quốc gia/thiết bị
    const statsAnalytics = allAnalytics.filter((a) => a.referer !== "Me");

    const uniqueIPs = new Set(statsAnalytics.map((a) => a.ipAddress)).size;
    
    // Thống kê theo quốc gia
    const countryStats = {};
    statsAnalytics.forEach((a) => {
      countryStats[a.country] = (countryStats[a.country] || 0) + 1;
    });

    // Thống kê theo device
    const deviceStats = {
      mobile: statsAnalytics.filter((a) => a.device === "mobile").length,
      desktop: statsAnalytics.filter((a) => a.device === "desktop").length,
      tablet: statsAnalytics.filter((a) => a.device === "tablet").length,
      unknown: statsAnalytics.filter((a) => a.device === "unknown").length,
    };

    // Thống kê theo browser
    const browserStats = {};
    statsAnalytics.forEach((a) => {
      const browser = a.browser;
      browserStats[browser] = (browserStats[browser] || 0) + 1;
    });

    // Thống kê theo OS
    const osStats = {};
    statsAnalytics.forEach((a) => {
      const os = a.os;
      osStats[os] = (osStats[os] || 0) + 1;
    });

    // Thống kê theo ngày
    const dailyStats = {};
    statsAnalytics.forEach((a) => {
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
      data: analytics,
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

// Lấy thống kê Home page views (cần auth)
export const getHomeAnalytics = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // Lấy tổng số records (bao gồm cả "Me") để hiển thị trong table
    const totalRecords = await Analytics.countDocuments({ resourceType: "home" });
    
    // Lấy tổng số lượt xem thực tế (không tính "Me") để hiển thị Tổng lượt xem
    const totalViews = await Analytics.countDocuments({ resourceType: "home", referer: { $ne: "Me" } });

    // Lấy analytics với pagination (mới nhất trước)
    const analytics = await Analytics.find({ resourceType: "home" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Lấy tất cả analytics để tính thống kê (không pagination)
    const allAnalytics = await Analytics.find({ resourceType: "home" })
      .sort({ createdAt: -1 })
      .limit(1000);

    // Lọc bỏ "Me" để tính các thống kê biểu đồ/quốc gia/thiết bị
    const statsAnalytics = allAnalytics.filter((a) => a.referer !== "Me");

    const uniqueIPs = new Set(statsAnalytics.map((a) => a.ipAddress)).size;
    
    // Thống kê theo quốc gia
    const countryStats = {};
    statsAnalytics.forEach((a) => {
      countryStats[a.country] = (countryStats[a.country] || 0) + 1;
    });

    // Thống kê theo device
    const deviceStats = {
      mobile: statsAnalytics.filter((a) => a.device === "mobile").length,
      desktop: statsAnalytics.filter((a) => a.device === "desktop").length,
      tablet: statsAnalytics.filter((a) => a.device === "tablet").length,
      unknown: statsAnalytics.filter((a) => a.device === "unknown").length,
    };

    // Thống kê theo browser
    const browserStats = {};
    statsAnalytics.forEach((a) => {
      const browser = a.browser;
      browserStats[browser] = (browserStats[browser] || 0) + 1;
    });

    // Thống kê theo OS
    const osStats = {};
    statsAnalytics.forEach((a) => {
      const os = a.os;
      osStats[os] = (osStats[os] || 0) + 1;
    });

    // Thống kê theo ngày
    const dailyStats = {};
    statsAnalytics.forEach((a) => {
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
      data: analytics,
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
    console.log("Get Home Analytics Error:", error);
  }
};
