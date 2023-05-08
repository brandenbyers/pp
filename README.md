# pp
Personal Podcast RSS Feed

Add files to `audio`

Example pre-commit hook:

```
#!/bin/sh

# Check if there are any changes in the audio directory
if git diff --cached --name-only --diff-filter=d | grep --quiet "^audio/"
then
  echo 'Updating rss.xml with new audio files...'
  # Run update-feed.ts
  npx ts-node update-feed.ts

  # Add rss.xml to the current commit
  git add rss.xml
else
  echo 'No changes in audio directory, skipping rss.xml update...'
fi
```
