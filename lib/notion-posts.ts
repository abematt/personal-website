import { notion } from './notion'
import { NotionAPI } from 'notion-client'

const notionApi = new NotionAPI()

export async function getPageContentBySlug(slug: string) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'Slug',
        rich_text: { equals: slug },
      },
    })

    const page = response.results[0]
    if (!page) return { recordMap: null, title: null, date: null }

    // Type guard to ensure we have a PageObjectResponse
    if (!('properties' in page)) return { recordMap: null, title: null, date: null }

    console.log('About to call notionApi.getPage with page.id:', page.id)
    const recordMap = await notionApi.getPage(page.id)
    console.log('Successfully got recordMap')
    
    const titleProperty = page.properties.Title
    const title = (titleProperty && 'title' in titleProperty && Array.isArray(titleProperty.title) && titleProperty.title.length > 0) 
      ? titleProperty.title[0]?.plain_text || 'Untitled'
      : 'Untitled'

    // Extract the date
    const dateProperty = page.properties.Date
    const date = dateProperty && 'date' in dateProperty && dateProperty.date?.start
      ? dateProperty.date.start
      : null

    return { recordMap, title, date }
  } catch (error) {
    console.error('Error in getPageContentBySlug:', error)
    throw error
  }
}
