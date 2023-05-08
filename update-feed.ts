import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

const audioPath = 'audio'
const rssPath = 'rss.xml'
const podcastName = 'pp'
const githubUsername = 'brandenbyers'

function formatDate(date: Date) {
  return date.toUTCString()
}

function generateRSSItem(filePath: string, fileName: string, ngrokUrl: string) {
  const stats = fs.statSync(filePath)
  const pubDate = formatDate(stats.birthtime)

  return `
    <item>
      <title>${fileName.replace('.mp3', '')}</title>
      <link>${`${ngrokUrl}/audio/${fileName}`}</link>
      <guid isPermaLink="false">${crypto
        .createHash('md5')
        .update(fileName)
        .digest('hex')}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${`${ngrokUrl}/audio/${fileName}`}" type="audio/mpeg"/>
    </item>`
}

if (!fs.existsSync(rssPath)) {
  fs.writeFileSync(
    rssPath,
    '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"></rss>'
  )
}

const rssData = fs.readFileSync(rssPath, 'utf-8')
const audioFiles = fs
  .readdirSync(audioPath)
  .filter((file) => path.extname(file) === '.mp3')
const ngrokUrl = process.env.NGROK_URL ?? ''

const updatedRSSContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>${podcastName}</title>
    <description>A personal podcast to record things to listen to later.</description>
    <link>https://${githubUsername}.github.io/${podcastName}/</link>
    <itunes:image href="https://${githubUsername}.github.io/${podcastName}/pp.png" />
${audioFiles
  .map((file) => generateRSSItem(path.join(audioPath, file), file, ngrokUrl))
  .join('')}
  </channel>
</rss>`

fs.writeFileSync(rssPath, updatedRSSContent)
