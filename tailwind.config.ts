import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      scale: {
        "40": "0.4",
      },
      keyframes: {
        "wrong-shake": {
          "0%": { color: "inherit" },
          "0%, 100%": { transform: "translateX(0)" },
          "25%, 75%": { transform: "translateX(-10px)" },
          "50%": { transform: "translateX(10px)", color: colors.red[500] },
          "100%": { color: "inherit" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0) scale(1)" },
          "100%": { transform: "translateX(-100%) scale(0.4)" },
        },
        "slide-fade-out": {
          "0%": { transform: "translateX(-100%) scale(0.4)", opacity: "1" },
          "100%": { transform: "translateX(-100%) scale(0.4)", opacity: "0" },
        },
      },
      animation: {
        "wrong-shake": "wrong-shake 0.5s ease-in-out",
        "fade-in": "fade-in 1s forwards",
        "slide-out": "slide-out 1s forwards",
        "slide-fade-out": "slide-fade-out 1s forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
