import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/* ──────────────────────────────────────────────
   Composition constants — exactly 15 s, 1920×1080, 30 fps
   Designed as a perfect loop: every animation has period
   that divides evenly into the total duration.
   ────────────────────────────────────────────── */
export const INTRO_FPS = 30;
export const INTRO_WIDTH = 1920;
export const INTRO_HEIGHT = 1080;
export const INTRO_DURATION_FRAMES = INTRO_FPS * 15; // 450

/* Brand colors (matching styles.css tokens) */
const COLORS = {
  bg: "#06080f",
  bgSoft: "#0c1124",
  cyan: "#00f0ff",
  violet: "#8b5cf6",
  magenta: "#ff2d7b",
  textBright: "#ffffff",
  muted: "#9ba4b8",
};

/* ──────────────────────────────────────────────
   Background — circuit grid + drifting gradient blobs
   3 blobs orbit on circular paths with period = duration.
   ────────────────────────────────────────────── */
const Background: React.FC<{ progress: number }> = ({ progress }) => {
  const tau = Math.PI * 2;
  const phase = progress * tau;

  const blob = (i: number, color: string, radius: number, ampX: number, ampY: number) => {
    const offset = (i / 3) * tau;
    const cx = INTRO_WIDTH * 0.5 + Math.sin(phase + offset) * ampX;
    const cy = INTRO_HEIGHT * 0.5 + Math.cos(phase + offset) * ampY;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: cx - radius,
          top: cy - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
          filter: "blur(80px)",
          opacity: 0.85,
        }}
      />
    );
  };

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 100%)",
        }}
      />
      {/* Drifting orbs (three colors) */}
      {blob(0, "rgba(0, 240, 255, 0.45)", 520, 480, 260)}
      {blob(1, "rgba(139, 92, 246, 0.45)", 540, 460, 280)}
      {blob(2, "rgba(255, 45, 123, 0.32)", 480, 420, 240)}
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(6,8,15,0.85) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ──────────────────────────────────────────────
   Brand sphere — conic gradient with gloss highlight,
   rotates exactly 360° over the loop.
   ────────────────────────────────────────────── */
const BrandSphere: React.FC<{ progress: number; breath: number }> = ({ progress, breath }) => {
  const rotation = progress * 360;
  const size = 220;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `scale(${1 + breath * 0.04})`,
      }}
    >
      {/* Outer halo (subtle pulse) */}
      <div
        style={{
          position: "absolute",
          inset: -30,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,240,255,0.35) 0%, transparent 70%)",
          opacity: 0.6 + breath * 0.4,
          filter: "blur(28px)",
        }}
      />
      {/* The orb itself */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(from ${rotation}deg at 50% 50%, ${COLORS.cyan}, ${COLORS.violet}, ${COLORS.magenta}, ${COLORS.cyan})`,
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.5) inset," +
            "0 -10px 20px rgba(0,0,0,0.45) inset," +
            "0 30px 60px rgba(0,240,255,0.35)," +
            "0 10px 30px rgba(139,92,246,0.3)",
        }}
      />
      {/* Top-left specular sheen for sphere illusion */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.55), transparent 50%)",
          pointerEvents: "none",
        }}
      />
      {/* Center mark — sparkle */}
      <svg
        viewBox="0 0 24 24"
        width={size * 0.42}
        height={size * 0.42}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          color: "#06080f",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        }}
      >
        <polygon
          points="12 2 15 9 22 9.5 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.5 9 9 12 2"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Main composition
   ────────────────────────────────────────────── */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Loop progress 0..1 (continuous, never resets visually)
  const progress = (frame % durationInFrames) / durationInFrames;
  const tau = Math.PI * 2;

  // Breathing scale for orb (3 cycles in 15 s — period 5 s)
  const breath = 0.5 + 0.5 * Math.sin(progress * tau * 3);

  // Headline gradient shift (one full cycle)
  const gradientShift = progress * 100;

  // Subtle URL fade pulse (1 cycle)
  const urlOpacity = 0.55 + 0.35 * Math.sin(progress * tau);

  // Subtle text glow pulse (synced to breath)
  const textGlow = 8 + breath * 16;

  return (
    <AbsoluteFill style={{ fontFamily: "ui-sans-serif, system-ui, 'Segoe UI', sans-serif" }}>
      <Background progress={progress} />

      {/* Center stack */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
        }}
      >
        <BrandSphere progress={progress} breath={breath} />

        {/* Eyebrow badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 22px",
            borderRadius: 999,
            background: "rgba(15, 20, 40, 0.55)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: COLORS.textBright,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            backdropFilter: "blur(12px)",
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#34d399",
              boxShadow: `0 0 ${4 + breath * 10}px rgba(52,211,153,${0.6 + breath * 0.4})`,
            }}
          />
          M365 Copilot
        </div>

        {/* Main headline with shifting gradient */}
        <h1
          style={{
            margin: 0,
            fontSize: 132,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            textAlign: "center",
            color: COLORS.textBright,
            textShadow: `0 0 ${textGlow}px rgba(0,240,255,0.3)`,
          }}
        >
          Microsoft{" "}
          <span
            style={{
              backgroundImage: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.violet}, ${COLORS.magenta}, ${COLORS.cyan})`,
              backgroundSize: "300% 300%",
              backgroundPosition: `${gradientShift}% 50%`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            Copilot.
          </span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            margin: 0,
            fontSize: 44,
            fontWeight: 500,
            color: COLORS.muted,
            letterSpacing: "-0.01em",
          }}
        >
          Fokus trifft Kreativität.
        </p>
      </AbsoluteFill>

      {/* Bottom-right URL */}
      <div
        style={{
          position: "absolute",
          right: 72,
          bottom: 56,
          padding: "12px 24px",
          borderRadius: 999,
          background: "rgba(15, 20, 40, 0.55)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: COLORS.textBright,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: "0.06em",
          opacity: urlOpacity,
          backdropFilter: "blur(10px)",
        }}
      >
        copilot.ovh
      </div>

      {/* Top-left brand wordmark */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 56,
          color: COLORS.textBright,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          opacity: 0.7,
        }}
      >
        Copilot
      </div>
    </AbsoluteFill>
  );
};
