const Typography = require('typography')
const { writeFile } = require('fs')

const TYPOGRAPHY_CSS_FILEPATH =
  './src/assets/css/typography.css'

const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.5,
  scaleRatio: 3,
  googleFonts: [{
    name: 'Open Sans Condensed',
    styles: ['700']
  }, {
    name: 'Open Sans',
    styles: ['400', '400i', '700', '700i'],
  }],
  headerFontFamily: ['Open Sans Condensed', 'sans-serif'],
  bodyFontFamily: ['Open Sans', 'sans-serif'],
  headerColor: 'hsl(0, 0%, 0%, 0.7)',
  bodyColor: 'hsl(0, 0%, 0%, 0.8)'
})

void writeFile(
  TYPOGRAPHY_CSS_FILEPATH,
  typography.toString(),
  err => err
    ? console.error(err)
    : console.log(`Updated: ${TYPOGRAPHY_CSS_FILEPATH}`))
