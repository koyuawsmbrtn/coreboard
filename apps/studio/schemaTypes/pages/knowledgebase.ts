import {SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'knowledgebase',
  title: 'Knowledgebase Settings',
  type: 'document',
  icon: SearchIcon,
  groups: [
    {
      name: 'general',
      title: 'General',
    },
    {
      name: 'homepage',
      title: 'Homepage',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      initialValue: 'Knowledgebase',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main headline on the knowledgebase homepage',
      group: 'homepage',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      description: 'Subtitle text below the hero title',
      group: 'homepage',
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Search Placeholder',
      type: 'string',
      initialValue: 'Search for articles...',
      group: 'homepage',
    }),
    defineField({
      name: 'showFeaturedArticles',
      title: 'Show Featured Articles',
      type: 'boolean',
      initialValue: true,
      group: 'homepage',
    }),
    defineField({
      name: 'featuredArticlesTitle',
      title: 'Featured Articles Section Title',
      type: 'string',
      initialValue: 'Featured Articles',
      group: 'homepage',
    }),
    defineField({
      name: 'showCategories',
      title: 'Show Category Grid',
      type: 'boolean',
      initialValue: true,
      group: 'homepage',
    }),
    defineField({
      name: 'categoriesTitle',
      title: 'Categories Section Title',
      type: 'string',
      initialValue: 'Browse by Category',
      group: 'homepage',
    }),
    defineField({
      name: 'articlesPerPage',
      title: 'Articles Per Page',
      type: 'number',
      initialValue: 12,
      validation: (Rule) => Rule.min(6).max(50),
      group: 'general',
    }),
  ],
})
