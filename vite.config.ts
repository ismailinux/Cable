import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Remove any import of componentTagger
// import componentTagger from "some-plugin"; // DELETE THIS

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Remove this line completely:
    // mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));