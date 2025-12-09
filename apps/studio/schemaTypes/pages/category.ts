import {FolderIcon} from '@sanity/icons'
import {defineField, defineType, type SlugRule, type StringRule} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required().error('Category name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: SlugRule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'icon',
      title: 'Icon/Image',
      type: 'imageWithAlt',
      description: 'Optional icon or image for this category',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'simplerColor',
      description: 'Category color for visual identification',
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      description: 'Optional parent category for nested structure',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which categories should be displayed (lower numbers first)',
      initialValue: 0,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Category',
      description: 'Show this category prominently on the homepage',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'icon',
    },
  },
  orderings: [
    {
      title: 'Name, A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
