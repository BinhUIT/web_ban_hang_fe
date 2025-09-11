import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], 
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ tất cả IP
    port: 5173,      // Hoặc cổng bạn muốn (mặc định 5173)
  }
})
