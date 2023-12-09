import rss from 'rss-generator'
import { feed } from './rss-entries.js'

const url = 'https://oddsquat.org'
const rssFeed = new rss({
  title: 'oddsquat',
  site_url: `${url}`,
  feed_url: `${url}/rss.xml`,
  image_url: `${url}/icon.svg'`,
  description:
    'Fanzine about experiments, code and other cyberpunk stuff'})

feed.forEach(([date, url, title, description]) =>
  rssFeed.item({date, url, title, description}))

import { writeFile } from 'fs'
const RSS_FILEPATH =
  './src/assets/rss.xml'

void writeFile(
  RSS_FILEPATH,
  rssFeed.xml(),
  err => err
    ? console.error(err)
    : console.log(`Updated: ${RSS_FILEPATH}`))
