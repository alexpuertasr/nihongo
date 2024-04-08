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
      keyframes: {
        "wrong-shake": {
          "0%": { color: "inherit" },
          "0%, 100%": { transform: "translateX(0)" },
          "25%, 75%": { transform: "translateX(-10px)" },
          "50%": { transform: "translateX(10px)", color: colors.red[500] },
          "100%": { color: "inherit" },
        },
      },
      animation: {
        "wrong-shake": "wrong-shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
