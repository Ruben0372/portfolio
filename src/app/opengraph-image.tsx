import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ruben Yomenou — Security Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0b",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Subtle amber glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: "#faf5e4",
              letterSpacing: "-2px",
            }}
          >
            Ruben Yomenou
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "#f59e0b",
            }}
          >
            Security Engineer
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#a1a1aa",
              marginTop: 16,
              maxWidth: 600,
              textAlign: "center",
              fontFamily: "sans-serif",
            }}
          >
            Building secure, well-engineered software — from custom TLS tunnels
            to enterprise platforms.
          </div>
        </div>

        {/* Bottom border accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #f59e0b, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
