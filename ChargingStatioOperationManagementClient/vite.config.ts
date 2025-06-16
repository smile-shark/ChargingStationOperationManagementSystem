/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

function getPlugins() {
  const plugins = [react(), tsconfigPaths()];
  return plugins;
}

export default defineConfig({
  plugins: getPlugins(),
  // base: '/ChargingStationOperationManagementSystem/'
  server:{
    port:3001,
    proxy:{
      '^/api':{
        target:'http://localhost:8080',
        changeOrigin:true,
        rewrite:(path)=>{
          return path.replace(/^\/api/,'')
        }
      }
    }
  }
});
