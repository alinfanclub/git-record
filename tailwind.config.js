/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#6096B4",
      },
      minWidth: {
        "1/2": "50%",
      },
      maxWidth: {
        "1/2": "50%",
      },
      fontSize: {
        sm: "1vw",
        base: "2vw",
      },
    },
  },
};
