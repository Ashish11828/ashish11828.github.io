import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function parseSolved(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!/(?:name|property)=["'](?:description|og:description|twitter:description)["']/i.test(tag)) continue;
    const content = tag.match(/content=["']([^"']*)["']/i)?.[1];
    const match = content?.match(/\b([\d,]+)\s+problems?\s+solved\b/i);
    if (match) return Number(match[1].replaceAll(',', ''));
  }
  throw new Error('Public profile solved count unavailable; keeping previous count.');
}
async function main() {
  const config = JSON.parse(await readFile(path.join(root, 'practice-profiles.json'), 'utf8'));
  let html = await readFile(path.join(root, 'index.html'), 'utf8');
  let failures = 0;
  for (const profile of config.profiles) {
    if (!profile.url) continue;
    try {
      const url = new URL(profile.url);
      if (url.protocol !== 'https:' || !['www.deep-ml.com', 'deep-ml.com', 'deep-agnt.com', 'www.deep-agnt.com'].includes(url.hostname) || !url.pathname.startsWith('/profile/')) throw new Error('Expected a public profile URL.');
      const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'Ashish-Portfolio-Stats/1.0' } });
      if (!response.ok) throw new Error(`Profile returned HTTP ${response.status}`);
      const count = parseSolved(await response.text());
      const marker = `<span id="${profile.elementId}">`;
      const start = html.indexOf(marker);
      if (start < 0) throw new Error('Count element missing');
      const end = html.indexOf('</span>', start);
      html = html.slice(0, start + marker.length) + `${count.toLocaleString('en-US')} problems solved` + html.slice(end);
      console.log(`${profile.id}: ${count} problems solved`);
    } catch (error) { failures++; console.error(`${profile.id}: ${error.message}`); }
  }
  await writeFile(path.join(root, 'index.html'), html);
  if (failures) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
