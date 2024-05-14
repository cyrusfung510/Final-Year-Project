/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lexend: ['"Lexend Deca"'],
      },
    },
    colors: {
      lightblue: "#c5e1f2",
      darkblue: "#132c3e",
      vividred: "#ff575d",
      softorange: "#f2b958",
      gray: {
        50: "#ffffff",
        200: "#dcdcdc",
        300: "#bdbdbd",
        600: "#656565",
        700: "#525252",
        800: "#464646",
        900: "#3d3d3d",
        950: "#292929",
      },
    },
  },
  plugins: [],
};
