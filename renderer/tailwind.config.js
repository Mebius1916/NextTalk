const colors = require('tailwindcss/colors')
const { nextui } = require("@nextui-org/react");
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
     './node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input).js'
  ],
  theme: {
    fontSize:{
      mm:'0.5rem',
      smm:'0.7rem',
      "heading1-bold": [
        "36px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "heading2-bold": [
        "30px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "heading3-bold": [
        "24px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "heading4-bold": [
        "20px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "body-bold": [
        "18px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "body-medium": [
        "18px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "base-bold": [
        "16px",
        {
          lineHeight: "140%",
          fontWeight: "600",
        },
      ],
      "base-medium": [
        "16px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "base-light": [
        "16px",
        {
          lineHeight: "140%",
          fontWeight: "400",
        },
      ],
      "small-bold": [
        "14px",
        {
          lineHeight: "140%",
          fontWeight: "600",
        },
      ],
      "small-medium": [
        "14px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "subtle-medium": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: "500",
        },
      ],
      "tiny-medium": [
        "10px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "x-small-bold": [
        "7px",
        {
          lineHeight: "9.318px",
          fonteWeight: "600",
        },
      ],
    },
    colors: {
      // use colors only specified
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      purple:colors.purple,
      indigo:colors.indigo,
      cyan:colors.cyan,
      pink:colors.pink,
      emerald:colors.emerald,
      sky:colors.sky,
      voilet:colors.violet,
      "blue-1": "#0A065C",
      "blue-2": "#F5F7FB",
      "blue-3": "#04A1E3",
      "grey-1": "#737373",
      "grey-2": "#f0f0f0",
      "grey-3": "#8B8B8B",
      "red-1": "#FF5252",
      "purple-1": "#C6D4FF",
      "purple-2": "#4D426D",
      "green-1": "#13E0E0",
      "pink-1": "#FDDAD6",
    },
    extend: {
      boxShadow: {
        'inset-top-left': 'inset 4px 4px 6px -4px rgba(0, 0, 0, 0.2)'
      },
      width:{
        'three':'32.49%',
        'search':'90%'
      },
      fontFamily: {
        'basier-circle': ['Basier Circle', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [nextui()],
}
