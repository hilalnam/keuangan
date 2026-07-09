/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-variant": "#2f3634",
        "inverse-surface": "#dde4e1",
        "on-secondary": "#1000a9",
        "on-secondary-fixed-variant": "#2f2ebe",
        "tertiary-fixed-dim": "#4edea3",
        "on-surface-variant": "#bacac5",
        "error-container": "#93000a",
        "surface-container-highest": "#2f3634",
        "on-secondary-container": "#b0b2ff",
        "secondary": "#c0c1ff",
        "secondary-fixed-dim": "#c0c1ff",
        "primary-container": "#2dd4bf",
        "on-error": "#690005",
        "tertiary-container": "#44d69b",
        "on-primary": "#003731",
        "inverse-primary": "#006b5f",
        "surface-container-lowest": "#09100e",
        "surface-dim": "#0e1513",
        "surface": "#0e1513",
        "surface-container-low": "#161d1b",
        "surface-tint": "#3cddc7",
        "on-tertiary": "#003824",
        "on-primary-container": "#00574d",
        "on-secondary-fixed": "#07006c",
        "inverse-on-surface": "#2b3230",
        "outline-variant": "#3c4a46",
        "surface-bright": "#333b39",
        "secondary-fixed": "#e1e0ff",
        "on-tertiary-container": "#00593b",
        "on-tertiary-fixed": "#002113",
        "primary-fixed": "#62fae3",
        "primary-fixed-dim": "#3cddc7",
        "tertiary": "#66f3b6",
        "tertiary-fixed": "#6ffbbe",
        "on-error-container": "#ffdad6",
        "outline": "#859490",
        "secondary-container": "#3131c0",
        "error": "#ffb4ab",
        "on-primary-fixed": "#00201c",
        "background": "#0e1513",
        "on-surface": "#dde4e1",
        "on-tertiary-fixed-variant": "#005236",
        "surface-container-high": "#242b2a",
        "surface-container": "#1a211f",
        "on-primary-fixed-variant": "#005047",
        "primary": "#57f1db",
        "on-background": "#dde4e1"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "md": "16px",
        "xs": "8px",
        "base": "4px",
        "sm": "12px",
        "lg": "24px",
        "xl": "32px",
        "2xl": "48px",
        "container-padding": "20px"
      },
      fontFamily: {
        "headline-md": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-md": ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "1.2", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }]
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #2dd4bf, #c0c1ff)",
        "gradient-primary-glow": "radial-gradient(circle at center, rgba(45, 212, 191, 0.2) 0%, transparent 70%)",
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ]
}
