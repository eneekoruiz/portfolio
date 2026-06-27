"use client";

import { useEffect, useState } from "react";

export function DevTuningPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    density: 0.0018,
    maxLinks: 5,
    glowStrength: 1,
    maxDist: 150,
    parallax: 0.045,
    followerDuration: 0.12,
    followerScale: 0.88,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize global config if not present
    const win = window as any;
    win.__PARTICLE_CONFIG = win.__PARTICLE_CONFIG || {
      density: 0.0018,
      maxLinks: 5,
      glowStrength: 1,
      maxDist: 150,
      parallax: 0.045,
      followerDuration: 0.12,
      followerScale: 0.88,
    };

    setConfig({ ...win.__PARTICLE_CONFIG });
  }, []);

  const handleChange = (key: keyof typeof config, val: number) => {
    if (typeof window === "undefined") return;
    const win = window as any;

    win.__PARTICLE_CONFIG[key] = val;
    setConfig({ ...win.__PARTICLE_CONFIG });

    // Dispatch update event to let visual components know they need to read new values
    window.dispatchEvent(
      new CustomEvent("portfolio-config-update", { detail: { key, val } }),
    );
  };

  // Render nothing in production build to completely exclude panel assets
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 999999,
        fontFamily: "monospace",
        fontSize: "11px",
      }}
      data-noprint
    >
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "rgba(0, 102, 255, 0.9)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(0, 102, 255, 0.4)",
          }}
        >
          ⚙️ TUNING PANEL
        </button>
      ) : (
        <div
          style={{
            background: "rgba(10, 10, 10, 0.92)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "16px",
            color: "#eee",
            width: "280px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#0066ff" }}>
              Dev Live Tuner
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                color: "#999",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                marginLeft: "auto",
              }}
            >
              ✕
            </button>
          </div>

          {/* Density Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Density ({config.density.toFixed(4)})</span>
            </div>
            <input
              type="range"
              min="0.0001"
              max="0.003"
              step="0.0001"
              value={config.density}
              onChange={(e) =>
                handleChange("density", parseFloat(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>

          {/* Max Links Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>MaxLinks ({config.maxLinks})</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={config.maxLinks}
              onChange={(e) =>
                handleChange("maxLinks", parseInt(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>

          {/* Glow Strength Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Glow Strength ({config.glowStrength.toFixed(1)})</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={config.glowStrength}
              onChange={(e) =>
                handleChange("glowStrength", parseFloat(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>

          {/* Max Dist Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Max Distance ({config.maxDist}px)</span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              step="5"
              value={config.maxDist}
              onChange={(e) =>
                handleChange("maxDist", parseInt(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>

          {/* Parallax Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Parallax ({config.parallax.toFixed(3)})</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.005"
              value={config.parallax}
              onChange={(e) =>
                handleChange("parallax", parseFloat(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>

          {/* Follower Duration Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Follower Speed ({config.followerDuration}s)</span>
            </div>
            <input
              type="range"
              min="0.03"
              max="0.4"
              step="0.01"
              value={config.followerDuration}
              onChange={(e) =>
                handleChange("followerDuration", parseFloat(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>

          {/* Follower Target Scale Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Follower Scale ({config.followerScale})</span>
            </div>
            <input
              type="range"
              min="0.40"
              max="1.5"
              step="0.05"
              value={config.followerScale}
              onChange={(e) =>
                handleChange("followerScale", parseFloat(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div
            style={{
              fontSize: "9px",
              color: "#666",
              textAlign: "center",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              paddingTop: "8px",
            }}
          >
            Changes apply live. Reducer caps at 60 FPS.
          </div>
        </div>
      )}
    </div>
  );
}
