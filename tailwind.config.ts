import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
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
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      typography: {
        scale: {
          css: {
            fontSize: "clamp(0.875rem, 1vw + 0.5rem, 1.5rem)",
            p: {
              fontSize: "clamp(0.875rem, 1vw + 0.5rem, 1.5rem)",
            },
            "p + p": {
              marginTop: "1.5rem",
            },
            h1: {
              fontSize: "clamp(2rem, 3.5vw + 1.5rem, 3.5rem)",
              fontWeight: "normal",
              lineHeight: "1.25",
            },
            h2: {
              fontSize: "clamp(1.75rem, 3vw + 1.25rem, 3rem)",
              fontWeight: "normal",
              lineHeight: "1.25",
            },
            h3: {
              fontSize: "clamp(1.5rem, 2.5vw + 1rem, 2.5rem)",
              fontWeight: "normal",
              lineHeight: "1.25",
            },
            h4: {
              fontSize: "clamp(1.25rem, 2vw + 0.75rem, 2rem)",
              lineHeight: "1.25",
            },
            h5: {
              fontSize: "clamp(1rem, 1.5vw + 0.5rem, 1.5rem)",
              lineHeight: "1.25",
            },
            h6: {
              fontSize: "clamp(0.875rem, 1.5vw + 0.5rem, 1.25rem)",
              lineHeight: "1.25",
            },
          },
        },
        "scale-sm": {
          css: {
            fontSize: "clamp(0.75rem, 0.8vw + 0.4rem, 1.25rem)",
            p: {
              fontSize: "clamp(0.75rem, 0.8vw + 0.4rem, 1.25rem)",
            },
            "p + p": {
              marginTop: "1.25rem",
            },
            h1: {
              fontSize: "clamp(1.75rem, 3vw + 1.25rem, 3rem)",
              fontWeight: "normal",
              lineHeight: "1.25",
            },
            h2: {
              fontSize: "clamp(1.5rem, 2.5vw + 1rem, 2.5rem)",
              fontWeight: "normal",
              lineHeight: "1.25",
            },
            h3: {
              fontSize: "clamp(1.25rem, 2vw + 0.75rem, 2rem)",
              fontWeight: "normal",
              lineHeight: "1.25",
            },
            h4: {
              fontSize: "clamp(1rem, 1.5vw + 0.5rem, 1.5rem)",
              lineHeight: "1.25",
            },
            h5: {
              fontSize: "clamp(0.875rem, 1vw + 0.5rem, 1.25rem)",
              lineHeight: "1.25",
            },
            h6: {
              fontSize: "clamp(0.75rem, 0.8vw + 0.4rem, 1rem)",
              lineHeight: "1.25",
            },
          },
        },
      },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        fadeIn: "fadeIn 1s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config

export default config
