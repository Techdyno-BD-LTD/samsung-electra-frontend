import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        darkgray: "#1B1B1B",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // --- Added Animation Logic ---
      // tailwind.config.ts
keyframes: {
  "roll-text": {
    // 0% - 7%: Rapidly roll in from bottom (approx 0.5s)
    "0%": { transform: "translateY(100%)", opacity: "0" },
    "7%": { transform: "translateY(0)", opacity: "1" },
    
    // 7% - 80%: THE 5 SECOND STOP (No change in translateY)
    "80%": { transform: "translateY(0)", opacity: "1" },
    
    // 80% - 87%: Rapidly roll out through the top (approx 0.5s)
    "87%": { transform: "translateY(-100%)", opacity: "0" },
    
    // 87% - 100%: Stay hidden before the next loop starts
    "100%": { transform: "translateY(-100%)", opacity: "0" },
  },
},
animation: {
  // Total duration: 7 seconds
  "roll-text": "roll-text 7s cubic-bezier(0.4, 0, 0.2, 1) infinite",
},
      // ----------------------------
    },
  },
  plugins: [],
};
export default config;