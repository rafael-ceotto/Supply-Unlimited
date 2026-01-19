import { motion } from "motion/react";

export function AnimatedLogo() {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* SVG Container */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* First Ellipse Group with balls */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "100px 100px" }}
        >
          <ellipse
            cx="100"
            cy="100"
            rx="85"
            ry="50"
            fill="none"
            stroke="rgba(34, 197, 94, 0.4)"
            strokeWidth="2"
          />
          {/* Ball at 0 degrees */}
          <circle cx="185" cy="100" r="4" fill="#22c55e" />
          {/* Ball at 90 degrees */}
          <circle cx="100" cy="150" r="4" fill="#22c55e" />
          {/* Ball at 180 degrees */}
          <circle cx="15" cy="100" r="4" fill="#22c55e" />
          {/* Ball at 270 degrees */}
          <circle cx="100" cy="50" r="4" fill="#22c55e" />
        </motion.g>

        {/* Second Ellipse Group with balls (rotated 90 degrees initially) */}
        <motion.g
          initial={{ rotate: 90 }}
          animate={{ rotate: 450 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "100px 100px" }}
        >
          <ellipse
            cx="100"
            cy="100"
            rx="85"
            ry="50"
            fill="none"
            stroke="rgba(34, 197, 94, 0.4)"
            strokeWidth="2"
          />
          {/* Ball at 0 degrees */}
          <circle cx="185" cy="100" r="4" fill="#16a34a" />
          {/* Ball at 90 degrees */}
          <circle cx="100" cy="150" r="4" fill="#16a34a" />
          {/* Ball at 180 degrees */}
          <circle cx="15" cy="100" r="4" fill="#16a34a" />
          {/* Ball at 270 degrees */}
          <circle cx="100" cy="50" r="4" fill="#16a34a" />
        </motion.g>

        {/* Central Circle with SU text */}
        <circle
          cx="100"
          cy="100"
          r="40"
          fill="white"
          stroke="#22c55e"
          strokeWidth="3"
        />

        {/* SU Text */}
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-bold"
          style={{ fontSize: "32px", fill: "#16a34a" }}
        >
          SU
        </text>
      </svg>
    </div>
  );
}