import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { wallpaperPlugin } from './server/wallpaper-plugin'

export default defineConfig({
  plugins: [
    react(),
    wallpaperPlugin(),
  ],
})
