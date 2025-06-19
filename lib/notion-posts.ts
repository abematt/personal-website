import { notion } from './notion'

export async function getPageContentBySlug(slug: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug },
    },
  })

  const page = response.results[0]
  if (!page) return { blocks: null, title: null, date: null }

  if (!('properties' in page)) return { blocks: null, title: null, date: null }

  // Get all blocks using official API
  const blocks = await notion.blocks.children.list({
    block_id: page.id,
    page_size: 100,
  })

  const titleProperty = page.properties.Title
  const title = (titleProperty && 'title' in titleProperty && Array.isArray(titleProperty.title) && titleProperty.title.length > 0) 
    ? titleProperty.title[0]?.plain_text || 'Untitled'
    : 'Untitled'

  const dateProperty = page.properties.Date
  const date = dateProperty && 'date' in dateProperty && dateProperty.date?.start
    ? dateProperty.date.start
    : null

  return { blocks: blocks.results, title, date }
}
