/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js", // Ruta manual a los componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'), // Usamos require para el plugin
  ],
}