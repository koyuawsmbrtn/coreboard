import { defineField, defineType, type SlugRule, type StringRule } from 'sanity'

export default defineType({
  name: 'custom',
  title: 'Custom page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required().error('Title is required')
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: SlugRule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add tags to categorize this page. Tags can be used to filter and group related content in navigation menus.',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      title: 'Content',
      name: 'body',
      type: 'blockContent',
    }),
  ],

  preview: {
    select: {
      title: 'title'
    },
  },
})