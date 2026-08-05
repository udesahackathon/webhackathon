import { ImageResponse } from "next/og";

// Ícono placeholder propio del evento (no el escudo de UdeSA, no tenemos
// el asset oficial). Reemplazar por un ícono de marca definitivo cuando
// exista uno.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F2240",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#6FA63C",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
