/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
    './src/**/*.{html,js,svelte,ts}',
  ],
	darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
		require('@skeletonlabs/skeleton/tailwind/skeleton.cjs'),
  ],
}
