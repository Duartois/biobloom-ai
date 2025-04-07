
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
        // Definindo as cores do tema customizado
        marinho: {
          50: "#E9EDF2",
          100: "#C8D3E0",
          200: "#A6B9CD",
          300: "#849FB9",
          400: "#628AAB",
          500: "#40759C", 
          600: "#336182", // Base azul marinho
          700: "#1B3B5A", // Azul marinho escuro
          800: "#0F2540",
          900: "#051226",
          950: "#020A15",
        },
        festa: {
          amarelo: "#FFAA00", // Amarelo
          laranja: "#E25B0E", // Laranja
          rosa: "#D11571",    // Rosa
          roxo: "#4D0974",    // Roxo
          light: "#FFFFFF",   // Branco
          dark: "#1A1A1A",    // Preto
        },
        vintage: {
          dark: "#2C4366",
          medium: "#36C5CE",
          light: "#FFFFFF",
          accent: "#FF5B85",
        },
        biobloom: {
          50: "#E9EDF2",
          100: "#C8D3E0",
          200: "#A6B9CD",
          300: "#849FB9",
          400: "#628AAB",
          500: "#40759C", 
          600: "#336182",
          700: "#1B3B5A", // Azul marinho escuro - cor principal
          800: "#0F2540",
          900: "#051226",
          950: "#020A15",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'neobrutal': '4px 4px 0px #000000',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
