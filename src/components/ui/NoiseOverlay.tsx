"use client";

export function NoiseOverlay() {
  return (
    <>
      <svg
        id="noise-filter"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <filter id="grain-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0.035,
          filter: "url(#grain-filter)",
          background: "rgba(255,255,255,0.5)",
        }}
      />
    </>
  );
}
