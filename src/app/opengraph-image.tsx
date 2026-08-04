import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: 80,
          background: "#0F2240",
          color: "#F7F5EF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#6FA63C",
            }}
          />
          <span style={{ fontSize: 28, fontWeight: 600 }}>
            {siteConfig.event.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>
            {siteConfig.event.tagline}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30 }}>
          <span style={{ color: "#6FA63C", fontWeight: 700 }}>
            {siteConfig.event.dateLabel}
          </span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ opacity: 0.8 }}>{siteConfig.event.location}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
