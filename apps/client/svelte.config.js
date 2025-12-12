import { mdsvex } from "mdsvex";
import adapter from "svelte-adapter-bun";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [vitePreprocess(), mdsvex()],
  kit: {
    // Use Bun adapter for full SvelteKit functionality including API routes
    adapter: adapter({
      out: "build",
      precompress: false,
      envPrefix: "",
      development: false,
    }),
    version: { name: "0.0.2" },
  },
  extensions: [".svelte", ".svx"],
};

export default config;