"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeamPath {
  path: string;
  gradientConfig: {
    initial: { x1: string; x2: string; y1: string; y2: string };
    animate: {
      x1: string | string[];
      x2: string | string[];
      y1: string | string[];
      y2: string | string[];
    };
    transition?: {
      duration?: number;
      repeat?: number;
      repeatType?: string;
      ease?: string;
      repeatDelay?: number;
      delay?: number;
    };
  };
  connectionPoints?: Array<{ cx: number; cy: number; r: number }>;
}

interface PulseBeamsProps {
  children?: React.ReactNode;
  className?: string;
  beams: BeamPath[];
  width?: number;
  height?: number;
  baseColor?: string;
  accentColor?: string;
  gradientColors?: { start: string; middle: string; end: string };
}

export const PulseBeams = ({
  children,
  className,
  beams,
  width = 1200,
  height = 700,
  baseColor = "rgba(255,255,255,0.04)",
  accentColor = "rgba(255,255,255,0.08)",
  gradientColors = {
    start: "#4A8FE8",
    middle: "#6B7FE8",
    end: "#8B6CF6",
  },
}: PulseBeamsProps) => {
  return (
    <div
      className={cn(
        "w-full h-screen relative flex items-center justify-center overflow-hidden",
        className
      )}
      style={{ background: "#060606" }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {beams.map((beam, index) => (
            <React.Fragment key={index}>
              <path d={beam.path} stroke={baseColor} strokeWidth="1" />
              <path
                d={beam.path}
                stroke={`url(#grad${index})`}
                strokeWidth="2"
                strokeLinecap="round"
              />
              {beam.connectionPoints?.map((point, pi) => (
                <circle
                  key={pi}
                  cx={point.cx}
                  cy={point.cy}
                  r={point.r}
                  fill={baseColor}
                  stroke={accentColor}
                />
              ))}
            </React.Fragment>
          ))}
          <defs>
            {beams.map((beam, index) => (
              <motion.linearGradient
                key={index}
                id={`grad${index}`}
                gradientUnits="userSpaceOnUse"
                initial={beam.gradientConfig.initial}
                animate={beam.gradientConfig.animate}
                transition={
                  beam.gradientConfig.transition as any
                }
              >
                <stop
                  offset="0%"
                  stopColor={gradientColors.start}
                  stopOpacity="0"
                />
                <stop
                  offset="20%"
                  stopColor={gradientColors.start}
                  stopOpacity="1"
                />
                <stop
                  offset="50%"
                  stopColor={gradientColors.middle}
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor={gradientColors.end}
                  stopOpacity="0"
                />
              </motion.linearGradient>
            ))}
          </defs>
        </svg>
      </div>

      {/* Radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(74,143,232,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
