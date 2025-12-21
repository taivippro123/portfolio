import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const gradientBackground =
  "linear-gradient(135deg, #020617 0%, #1e1b4b 40%, #0f766e 75%, #22c55e 100%)";

const Card = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div
    style={{
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: 24,
      padding: "24px 32px",
      backdropFilter: "blur(12px)",
      backgroundColor: "rgba(2,6,23,0.45)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <span style={{ fontSize: 32, color: "#22c55e", fontWeight: 600 }}>
      {title}
    </span>
    <span style={{ fontSize: 28, color: "rgba(255,255,255,0.85)" }}>
      {subtitle}
    </span>
  </div>
);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundImage: gradientBackground,
          color: "white",
          fontFamily: "Geist, 'Inter', 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ fontSize: 42, textTransform: "uppercase", opacity: 0.8 }}>
          taivippro123 • Front-End Engineer
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <h1 style={{ fontSize: 92, margin: 0 }}>Phan Võ Thành Tài</h1>
          <p
            style={{
              fontSize: 36,
              maxWidth: "900px",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Crafting fast, accessible experiences with Next.js, React, and modern
            tooling for the web.
          </p>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Card title="Stack" subtitle="Next.js • React • TypeScript" />
          <Card title="Based in" subtitle="Ho Chi Minh City, Viet Nam" />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

