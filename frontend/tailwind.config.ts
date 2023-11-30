import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/flowbite-react/**/*.js', 
    './pages/**/*.{ts,tsx}', './public/**/*.html'
  ],
  theme: {
    extend: {
      backgroundImage: {
        login: "url('/img/LoginBackground.png')",
      },
      colors: {
        background: "#1B1C26",
        primary: "#D9923B",
        secondary: "#000000",
        accent: "#056CF2",
        text: "#FFFFFF",
        textSecondary: "#4D5960",
        W: "#00CB00",
        L: "#CE3100",
      },
      fontSize: {
        title: "2rem",
        body: "1.125rem",
        small: "0.875rem",
        countdown: "15rem",
      },
      fontFamily: {
        sans: ["inter", "sans-serif"],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
export default config;