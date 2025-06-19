const defaultTheme = require("tailwindcss/defaultTheme");

// Custom color with css variable color in __theme_color.scss
function customColors(cssVar) {
  return ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${cssVar}), ${opacityValue})`;
    }
    if (opacityVariable !== undefined) {
      return `rgba(var(${cssVar}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${cssVar}))`;
  };
}

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        xl: "40px",
        "2xl": "128px",
      },
    },

    extend: {
      colors: {
        primary: {
          50: customColors("--ox-primary-50"),
          100: customColors("--ox-primary-100"),
          200: customColors("--ox-primary-200"),
          300: customColors("--ox-primary-300"),
          400: customColors("--ox-primary-400"),
          500: customColors("--ox-primary-500"),
          6000: customColors("--ox-primary-600"),
          700: customColors("--ox-primary-700"),
          800: customColors("--ox-primary-800"),
          900: customColors("--ox-primary-900"),
        },
        secondary: {
          50: customColors("--ox-secondary-50"),
          100: customColors("--ox-secondary-100"),
          200: customColors("--ox-secondary-200"),
          300: customColors("--ox-secondary-300"),
          400: customColors("--ox-secondary-400"),
          500: customColors("--ox-secondary-500"),
          6000: customColors("--ox-secondary-600"),
          700: customColors("--ox-secondary-700"),
          800: customColors("--ox-secondary-800"),
          900: customColors("--ox-secondary-900"),
        },
        neutral: {
          50: customColors("--ox-neutral-50"),
          100: customColors("--ox-neutral-100"),
          200: customColors("--ox-neutral-200"),
          300: customColors("--ox-neutral-300"),
          400: customColors("--ox-neutral-400"),
          500: customColors("--ox-neutral-500"),
          6000: customColors("--ox-neutral-600"),
          700: customColors("--ox-neutral-700"),
          800: customColors("--ox-neutral-800"),
          900: customColors("--ox-neutral-900"),
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
