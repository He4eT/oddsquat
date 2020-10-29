const Typography = require('typography')
const fs = require('fs')

const TYPOGRAPHY_CSS_FILEPATH =
  './src/assets/css/typography.css'

const typography = new Typography({
})

void fs.writeFile(
  TYPOGRAPHY_CSS_FILEPATH,
  typography.toString(),
  err => err
    ? console.error(err)
    : console.log(`Updated: ${TYPOGRAPHY_CSS_FILEPATH}`))
