import { BulbOutlineIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faqSection',
  title: 'FAQ Section',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Small title above the main heading',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ Items',
      type: 'array',
      of: [{ type: 'faq' }],
      validation: (Rule) => Rule.required().min(1).max(20),
      options: {
        sortable: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      faqCount: 'faqs.length',
    },
    prepare({ title, faqCount }) {
      return {
        title: title || 'FAQ Section',
        subtitle: `${faqCount || 0} FAQs`,
      }
    },
  },
})
