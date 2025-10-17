// PostCSS config for Tailwind CSS v4 on Next.js
// Ensures Tailwind is processed during the build (fixes unstyled page on Vercel)
import tailwindcss from '@tailwindcss/postcss';

export default {
  plugins: {
    [tailwindcss as unknown as string]: {},
  },
};


