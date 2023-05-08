import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const audioPath = 'audio';
const rssPath = 'rss.xml';
const podcastName = 'pp';
const githubUsername = 'brandenbyers'

function formatDate(date: Date) {
  return date.toISOString();
}

function generateRSSItem(filePath: string, fileName: string) {
  const stats = fs.statSync(filePath);
  const pubDate = formatDate(stats.birthtime);
  const rawGitHubUrl = `https://raw.githubusercontent.com/${githubUsername}/${podcastName}/main/audio/${fileName}`;

  return `
    <item>
      <title>${fileName.replace('.mp3', '')}</title>
      <link>${rawGitHubUrl}</link>
      <guid isPermaLink="false">${crypto.createHash('md5').update(fileName).digest('hex')}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${rawGitHubUrl}" type="audio/mpeg"/>
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
    <link>https://${githubUsername}.github.io/${podcastName}/</link>
${audioFiles.map((file) => generateRSSItem(path.join(audioPath, file), file)).join('')}
  </channel>
</rss>
`;

fs.writeFileSync(rssPath, updatedRSSContent);
