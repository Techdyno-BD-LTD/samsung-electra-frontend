import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        darkgray: "#1B1B1B",
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Product card colors
        sale: {
          DEFAULT: "hsl(var(--sale-badge))",
          foreground: "hsl(var(--sale-badge-foreground))",
        },
        emi: {
          DEFAULT: "hsl(var(--emi-badge))",
          foreground: "hsl(var(--emi-badge-foreground))",
        },
        price: "hsl(var(--price))",
        "price-old": "hsl(var(--price-old))",
        discount: "hsl(var(--discount))",
        save: "hsl(var(--save))",
      },
      keyframes: {
        "roll-text": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "7%": { transform: "translateY(0)", opacity: "1" },
          "80%": { transform: "translateY(0)", opacity: "1" },
          "87%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // New Marquee Keyframes
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "roll-text": "roll-text 7s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "slide-up": "slide-up 0.25s ease-out",
        // New Marquee Animation (25s is a good readable speed)
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;