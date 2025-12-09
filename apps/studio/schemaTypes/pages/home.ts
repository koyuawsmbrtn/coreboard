import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'home',
  title: 'Landing Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {
      name: 'header',
      title: 'Header',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      initialValue: 'Home',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'header',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'header',
    }),

    // Page sections
    defineField({
      name: 'headerSection',
      title: 'Header Section',
      type: 'ctaSection',
      group: 'header',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showKnowledgebase',
      title: 'Show Knowledgebase Section',
      type: 'boolean',
      initialValue: true,
      group: 'header',
    }),
    defineField({
      name: 'knowledgebaseTitle',
      title: 'Knowledgebase Section Title',
      type: 'string',
      initialValue: 'Explore our Knowledgebase',
      group: 'header',
    }),
  ],
})
