// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
  preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: "../dist/www",
			assets: "../dist/www",
			trailingSlash: 'always',
		}),

	}
};

export default config;