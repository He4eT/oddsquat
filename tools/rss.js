const feed = [[
  '2021-10-02',
  'http://example.com/article4?this&that',
  'item title',
  'use this for the content. It can include html.'
], [
  '2021-10-01',
  'http://example.com/arthat',
  'another item title',
  'another use this for the content. It can include html.'
]]

const url = 'https://oddsquat.org'
const rssFeed = new (require('rss-generator'))({
  title: 'oddsquat',
  site_url: `${url}`,
  feed_url: `${url}/rss.xml`,
  image_url: `${url}/icon.svg'`,
  description:
    'Fanzine about experiments, code and other cyberpunk stuff'})

feed.forEach(([date, url, title, description]) =>
  rssFeed.item({date, url, title, description}))

const fs = require('fs')
const RSS_FILEPATH =
  './src/assets/rss.xml'

void fs.writeFile(
  RSS_FILEPATH,
  rssFeed.xml(),
  err => err
    ? console.error(err)
    : console.log(`Updated: ${RSS_FILEPATH}`))
