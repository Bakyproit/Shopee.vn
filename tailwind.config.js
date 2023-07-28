/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        oranges: '#ee4d2d',
        bgfooter: 'f5f5f5'
      },
      backgroundImage: {
        bglogin: "url('https://down-vn.img.susercontent.com/file/sg-11134004-7qvf6-li8l24tj9g8cc8')"
      },
      height: {
        img: '37.5rem'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.8'),
          paddingRight: theme('spacing.8')
        }
      })
    }),
    require('@tailwindcss/line-clamp')
  ]
}
