import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    cvId: { type: mongoose.Schema.Types.ObjectId, ref: "CV", required: true },
    ipAddress: { type: String, required: true },
    country: { type: String },
    city: { type: String },
    browser: { type: String },
    browserVersion: { type: String },
    os: { type: String },
    device: { type: String, enum: ["mobile", "desktop", "tablet", "unknown"] },
    userAgent: { type: String },
    referer: { type: String },
  },
  { timestamps: true }
);

// Index để query nhanh hơn
analyticsSchema.index({ cvId: 1, createdAt: -1 });
analyticsSchema.index({ ipAddress: 1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;

