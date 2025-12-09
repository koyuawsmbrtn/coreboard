import {WrenchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Einstellungen',
  type: 'document',
  icon: WrenchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'longTitle',
      title: 'Long Title',
      description: 'Used for SEO and social media',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Important for SEO and social media',
      type: 'text',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    }),
    defineField({
      name: 'footer',
      title: 'Copyright',
      initialValue: '© {YEAR} . All rights reserved.',
      type: 'string',
    }),
  ],
})
