const Typograf = require('typograf')
const { readFileSync, writeFile } = require('fs')

if (!process.argv[2]) {
  console.log('Usage:\n node typograf file [locale]')
  process.exit(1)
}

const filePath =
  `${process.cwd()}/${process.argv[2]}`

const fileContent =
  readFileSync(filePath).toString()

const locale =
  process.argv[3] || 'en-US'

const tp = new Typograf({
  locale: [locale, 'en-US'],
  htmlEntity: {
    type: 'name',
    onlyInvisible: true
  }
})

tp.disableRule('*');[
  'common/punctuation/quote',
  'common/nbsp/*',
  'ru/nbsp/*',
  'ru/dash/main'
].forEach(rule =>
  tp.enableRule(rule))

void writeFile(
  filePath,
  tp.execute(fileContent),
  err => err
    ? console.error(err)
    : console.log(`Typografed: ${filePath}`))
