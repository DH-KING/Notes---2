// tailwind.config.ts
import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* خلفيات هادئة على نمط Google Keep */
        lightBg: "#FFFFFF", // أبيض نقي للوضع الفاتح
        lightCard: "#FFFFFF", // أبيض نقي للبطاقات في الوضع الفاتح
        lightBorder: "#DEE2E6",
        lightText: "#000000", // أسود نقي للنصوص في الوضع الفاتح

        darkBg: "#1E1E1E", // رمادي فحمي غامق جداً (أقرب للأسود)
        darkCard: "#2C2C2E", // رمادي داكن جدًا لكن أفتح من الخلفية العامة
        darkText: "#E8EAED", // أبيض ناعم أو رمادي فاتح جدًا
        darkBorder: "#5F6368",

        /* ألوان ملاحظات باستيليّة هادئة */
        noteYellow: "#FFFDE7",
        noteBlue: "#E8F0FE",
        noteGreen: "#E6F4EA",
        notePink: "#FCE8F6",
        notePurple: "#F3E8FD",
        noteGray: "#E8EAED",
        noteWhite: "#FFFFFF",
        // ألوان إضافية جديدة
        noteLightGreen: "#DCE8D8", // أخضر فاتح ناعم
        noteLightBlue: "#D8E8F8", // أزرق فاتح ناعم
        noteLightPurple: "#E8D8F8", // بنفسجي فاتح ناعم
        notePeach: "#FFEDD5", // خوخي دافئ
        noteTeal: "#D8F8F8", // تركوازي فاتح
        noteLavender: "#E8D8F8", // لافندر فاتح
        noteRose: "#F8D8E8", // وردي فاتح
        noteMint: "#D8F8E8", // نعناعي فاتح
        noteCream: "#FFF8D8", // كريمي
        noteSky: "#D8E8FF", // سماء فاتحة
        noteCoral: "#FFD8D8", // مرجاني فاتح
        noteSand: "#F8F8D8", // رملي فاتح

        /* ألوان تمييز بسيطة */
        accentPrimaryLight: "#1A73E8", // أزرق داكن للشعار/العنوان في الوضع الفاتح
        accentPrimaryDark: "#8AB4F8", // أزرق فاتح للشعار/العنوان في الوضع الداكن
        accentSecondary: "#34A853",
        accentDanger: "#EA4335",
        accentWarning: "#FBBC04",

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
      },
    },
  },
  plugins: [animate],
}

export default config
