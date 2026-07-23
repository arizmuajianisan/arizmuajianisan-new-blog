import { queryCollection } from '@nuxt/content/nitro'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const site = getSiteConfig(event)

  const posts = await queryCollection(event, 'blog')
    .where('draft', '<>', true)
    .order('pubDatetime', 'DESC')
    .all()

  const items = posts.map((post) => {
    const url = `${site.url}${post.path}`
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description ?? '')}</description>
      <pubDate>${new Date(post.pubDatetime).toUTCString()}</pubDate>
${(post.tags ?? []).map(tag => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`
  }).join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name ?? 'Ariz Muajianisan')}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description ?? '')}</description>
    <language>en</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return feed
})
