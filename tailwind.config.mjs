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
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#2563eb",  // Blue 600
          "primary-focus": "#1d4ed8", // Blue 700
          "primary-content": "#ffffff",
          
          "secondary": "#0891b2",  // Cyan 600
          "secondary-focus": "#0e7490", // Cyan 700
          "secondary-content": "#ffffff",
          
          "accent": "#8b5cf6",     // Violet 500
          "accent-focus": "#7c3aed", // Violet 600
          "accent-content": "#ffffff",
          
          "neutral": "#2a2e37",
          "neutral-focus": "#16181d",
          "neutral-content": "#ffffff",
          
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "base-content": "#1f2937",
          
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
  },
};
