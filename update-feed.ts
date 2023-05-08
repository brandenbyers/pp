import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const audioPath = 'audio';
const rssPath = 'rss.xml';

function formatDate(date: Date) {
  return date.toISOString();
}

function generateRSSItem(filePath: string, fileName: string) {
  const stats = fs.statSync(filePath);
  const pubDate = formatDate(stats.birthtime);

  return `
    <item>
      <title>${fileName.replace('.mp3', '')}</title>
      <link>${`https://${process.env.GH_USERNAME}.github.io/personal-podcast/audio/${fileName}`}</link>
      <guid isPermaLink="false">${crypto.createHash('md5').update(fileName).digest('hex')}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${`https://${process.env.GH_USERNAME}.github.io/personal-podcast/audio/${fileName}`}" type="audio/mpeg"/>
    </item>`;
}

if (!fs.existsSync(rssPath)) {
  fs.writeFileSync(rssPath, '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"></rss>');
}

const rssData = fs.readFileSync(rssPath, 'utf-8');
const audioFiles = fs.readdirSync(audioPath).filter((file) => path.extname(file) === '.mp3');

const updatedRSSContent = `
<rss version="2.0">
  <channel>
    <title>Your Personal Podcast</title>
    <description>A personal podcast to record things to listen to later.</description>
    <link>https://${process.env.GH_USERNAME}.github.io/personal-podcast/</link>
${audioFiles.map((file) => generateRSSItem(path.join(audioPath, file), file)).join('')}
  </channel>
</rss>
`;

fs.writeFileSync(rssPath, updatedRSSContent);
