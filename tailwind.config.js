/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#6096B4",
      },
      minHeight: {
        half: "50vh",
      },
      minWidth: {
        "1/2": "50%",
      },
      maxWidth: {
        "1/2": "50%",
        ssm: "55%",
        s: "100%",
      },
      fontSize: {
        sm: "1vw",
        base: "2vw",
      },
    },
  },
  darkMode: "class", // Tailwindcss 3.0 default is 'media',  'class'
};
