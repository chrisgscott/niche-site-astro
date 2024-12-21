/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit Variable', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [daisyui, typography],
};
