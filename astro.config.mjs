import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import node from '@astrojs/node';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap(), react()],
  output: "server",
  adapter: node({
    mode: "middleware"
  }),
  
  vite:{
    server:{
      proxy:{
        "/request":{
          target: "http://localhost:8080",
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }


});