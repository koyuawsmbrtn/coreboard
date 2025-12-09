import { ComponentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'button',
  title: 'CTA Button',
  type: 'object',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Button Label',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'text',
    },
    prepare({ title }) {
      return {
        title: title || 'Untitled Button',
      }
    },
  },
})
