import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(circle at top, #14b8a6, transparent 60%), #020617",
          color: "#f8fafc",
          fontFamily: "Geist, 'Inter', 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: 6, opacity: 0.8 }}>
          taivippro123
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <h1 style={{ fontSize: 88, margin: 0 }}>Phan Võ Thành Tài</h1>
          <p style={{ fontSize: 34, margin: 0, maxWidth: 940, lineHeight: 1.4 }}>
            Front-end developer delivering polished product experiences with
            React, Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 32,
            opacity: 0.85,
          }}
        >
          <span>Next.js • React • UI Engineering</span>
          <span>taivippro123.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

