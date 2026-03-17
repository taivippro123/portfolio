export const runtime = "nodejs"

export async function GET() {
  try {
    const upstream = await fetch("https://taivippro123-portfolio.fly.dev/health", {
      cache: "no-store",
    })

    if (!upstream.ok) {
      return Response.json(
        { status: "error", message: `Upstream health returned ${upstream.status}` },
        { status: 502 },
      )
    }

    // Return a simple OK for the client (avoid any CORS concerns)
    return Response.json({ status: "ok", message: "Server is running" }, { status: 200 })
  } catch (e) {
    return Response.json({ status: "error", message: "Upstream health unreachable" }, { status: 502 })
  }
}

