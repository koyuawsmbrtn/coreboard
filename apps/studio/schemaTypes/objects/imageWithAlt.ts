import {defineField, defineType} from 'sanity'

export default defineField({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Important for SEO and accessibility',
      validation: (Rule) => Rule.max(100),
    }),
  ],
  options: {
    hotspot: true,
  },
})
