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
    onlyInvisible: true,
  }
})

const enabledRules = [
  'common/nbsp/*',
  'common/punctuation/quote',
  'en-US/dash/main',
  'ru/dash/main',
  'ru/nbsp/*',
]

tp.disableRule('*')
enabledRules.forEach(rule =>
  tp.enableRule(rule))

void writeFile(
  filePath,
  tp.execute(fileContent),
  err => err
    ? console.error(err)
    : console.log(`Typografed: ${filePath}`))
