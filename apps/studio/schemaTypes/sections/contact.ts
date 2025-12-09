import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactSection',
  title: 'Contact Section',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactMethods',
      title: 'Contact Methods',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'type',
              title: 'Contact Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Email', value: 'email'},
                  {title: 'Phone', value: 'phone'},
                  {title: 'Address', value: 'address'},
                  {title: 'Social Media', value: 'social'},
                ],
              },
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'value',
              title: 'Contact Information',
              type: 'string',
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
              description: 'Optional link (mailto:, tel:, etc.)',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      contactMethods: 'contactMethods',
    },
    prepare({ title, contactMethods }) {
      const methodCount = contactMethods?.length || 0
      return {
        title: title || 'Contact Section',
        subtitle: `${methodCount} contact method${methodCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
