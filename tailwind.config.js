/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,jpg}",
  ],
  theme: {
    extend: {
backgroundImage:{
  'ultimate': "url(/src/assets/loginImg.jpg)"
},
screens: {
  'small-tablet': '441px',
  // => @media (min-width: 640px) { ... }

  'medium-tablet': '629px',
  // => @media (min-width: 1024px) { ... }

  'small-laptop': '769px',
  // => @media (min-width: 1280px) { ... }

  'medium-laptop': '1023px'
},

    },
  },
  plugins: [],
}