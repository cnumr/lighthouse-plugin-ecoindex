import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
export default {
  plugins: [tailwindcss('./tailwind.config.js'), autoprefixer]
}