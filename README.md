# Oddsquat

Oddsquat is my own private fanzine about experiments, code and other cyberpunk stuff.

## Conventions

- Descriptions should end with a period.

## New Post Internal Checklist

### Content

- Create `src/pages/posts/[year]/[name].md`
- Compose the post
- Commit the post
- Check the post content

### Format

- `npm run tool:linter src/pages/posts/[year]/[name].md`
- `git add -p` + commit
- Check the post format

### Preview on the Web

- `./tools/gh.release.sh`

### Publishing

- Update `src/pages/posts.md`
- Update `tools/rss-entries.js`
- `npm run tool:rss-generator`
- `./tools/gh.release.sh`
