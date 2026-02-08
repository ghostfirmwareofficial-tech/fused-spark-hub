import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Fused Up Custom Colors - Deep Blue/Purple/Black Theme
        "fused-purple": "hsl(var(--fused-purple))",
        "fused-blue": "hsl(var(--fused-blue))",
        "fused-dark": "hsl(var(--fused-dark))",
        "fused-surface": "hsl(var(--fused-surface))",
        "fused-glow": "hsl(var(--fused-glow))",
        "fused-indigo": "hsl(var(--fused-indigo))",
        "fused-violet": "hsl(var(--fused-violet))",
        // Rank Colors
        "rank-recruit": "hsl(var(--rank-recruit))",
        "rank-grinder": "hsl(var(--rank-grinder))",
        "rank-challenger": "hsl(var(--rank-challenger))",
        "rank-elite": "hsl(var(--rank-elite))",
        "rank-fused-core": "hsl(var(--rank-fused-core))",
        "rank-ascended": "hsl(var(--rank-ascended))",
        // Rarity Colors
        "rarity-common": "hsl(var(--rarity-common))",
        "rarity-uncommon": "hsl(var(--rarity-uncommon))",
        "rarity-rare": "hsl(var(--rarity-rare))",
        "rarity-epic": "hsl(var(--rarity-epic))",
        "rarity-legendary": "hsl(var(--rarity-legendary))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Rajdhani", "system-ui", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-3d": {
          "0%, 100%": { transform: "translateY(0) rotateX(0) rotateY(0)" },
          "25%": { transform: "translateY(-15px) rotateX(5deg) rotateY(5deg)" },
          "50%": { transform: "translateY(-5px) rotateX(-3deg) rotateY(-3deg)" },
          "75%": { transform: "translateY(-10px) rotateX(2deg) rotateY(2deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-3d": "float-3d 8s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-fused": "linear-gradient(135deg, hsl(var(--fused-purple)), hsl(var(--fused-blue)))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;