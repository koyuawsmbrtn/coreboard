import {LinkIcon, MenuIcon} from '@sanity/icons'
import {defineField, defineType, type Rule, type StringRule} from 'sanity'
import {requiredLinkField} from 'sanity-plugin-link-field'

export default defineType({
  name: 'navbar',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      initialValue: 'Navigation',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'links',
      title: 'Links',
      icon: LinkIcon,
      type: 'array',
      initialValue: [
        {
          text: 'Home',
          link: {
            type: 'url',
            value: '/',
          },
        },
        {
          text: 'Blog',
          link: {
            type: 'url',
            value: '/blog',
          },
          sublinks: [
            {
              type: 'auto',
              pageType: 'blog',
              autoTitle: 'Latest Blog Posts',
            },
          ],
        },
      ],
      of: [
        {
          type: 'object',
          title: 'Link',
          icon: LinkIcon,
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: (Rule: StringRule) => Rule.required().error('Text is required'),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
              validation: (rule: Rule) => rule.custom((field: Rule) => requiredLinkField(field)),
            }),
            defineField({
              name: 'sublinks',
              title: 'Sublinks',
              type: 'array',
              validation: (Rule) => Rule.max(5).error('Maximum 5 sublinks allowed'),
              of: [
                {
                  type: 'object',
                  title: 'Sublink',
                  icon: LinkIcon,
                  fields: [
                    defineField({
                      name: 'type',
                      title: 'Link Type',
                      type: 'string',
                      initialValue: 'auto',
                      options: {
                        list: [
                          {
                            title: 'Last Pages',
                            value: 'auto',
                          },
                          {
                            title: 'Pages by Tag',
                            value: 'tag',
                          },
                          {
                            title: 'Manual Link',
                            value: 'manual',
                          },
                        ],
                        layout: 'radio',
                      },
                      validation: (Rule: StringRule) => Rule.required(),
                    }),
                    defineField({
                      name: 'pageType',
                      title: 'Page Type',
                      type: 'string',
                      initialValue: 'custom',
                      description:
                        'Automatically displays the 5 most recently published pages from the selected type',
                      options: {
                        list: [
                          {title: 'Custom Pages', value: 'custom'},
                          {title: 'Blog Posts', value: 'blog'},
                        ],
                      },
                      hidden: ({parent}) => parent?.type !== 'auto',
                      validation: (Rule: StringRule) =>
                        Rule.custom((value, context) => {
                          const parent = context.parent as {type?: string}
                          if (parent?.type === 'auto' && !value) {
                            return 'A page type must be selected'
                          }
                          return true
                        }),
                    }),
                    defineField({
                      name: 'text',
                      title: 'Text',
                      type: 'string',
                      hidden: ({parent}) => parent?.type !== 'manual',
                      validation: (Rule: StringRule) =>
                        Rule.custom((value, context) => {
                          const parent = context.parent as {type?: string}
                          if (parent?.type === 'manual' && !value) {
                            return 'Text is required for manual links'
                          }
                          return true
                        }),
                    }),
                    defineField({
                      name: 'link',
                      title: 'Link',
                      type: 'link',
                      hidden: ({parent}) => parent?.type !== 'manual',
                      validation: (rule: Rule) =>
                        rule.custom((field, context) => {
                          const parent = context.parent as {type?: string}
                          if (parent?.type === 'manual') {
                            return requiredLinkField(field)
                          }
                          return true
                        }),
                    }),
                    defineField({
                      name: 'tagFilter',
                      title: 'Tag Filter',
                      type: 'reference',
                      to: [{type: 'tag'}],
                      description:
                        'Select a tag to filter pages by. The last 5 published pages with this tag will be shown.',
                      hidden: ({parent}) => parent?.type !== 'tag',
                      validation: (Rule) =>
                        Rule.custom((value, context) => {
                          const parent = context.parent as {type?: string}
                          if (parent?.type === 'tag' && !value) {
                            return 'A tag is required when using tag-based filtering'
                          }
                          return true
                        }),
                    }),
                    defineField({
                      name: 'tagPageType',
                      title: 'Page Type for Tag Filter',
                      type: 'string',
                      description: 'Select which type of pages to search for the tag',
                      options: {
                        list: [
                          {title: 'Custom Pages', value: 'custom'},
                          {title: 'Blog Posts', value: 'blog'},
                        ],
                      },
                      hidden: ({parent}) => parent?.type !== 'tag',
                      initialValue: 'custom',
                      validation: (Rule: StringRule) =>
                        Rule.custom((value, context) => {
                          const parent = context.parent as {type?: string}
                          if (parent?.type === 'tag' && !value) {
                            return 'A page type must be selected for tag filtering'
                          }
                          return true
                        }),
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'text',
                      type: 'type',
                      tagTitles: 'tagTitles',
                      autoTitle: 'autoTitle',
                      pageType: 'pageType',
                      tagPageType: 'tagPageType',
                    },
                    prepare({title, type, tagTitles, autoTitle, pageType, tagPageType}) {
                      let displayTitle = title
                      let subtitle = ''

                      const formatPageType = (pageType: string) => {
                        const typeMap: Record<string, string> = {
                          home: 'Home',
                          custom: 'Custom',
                          blog: 'Blog',
                        }
                        return (
                          typeMap[pageType] || pageType.charAt(0).toUpperCase() + pageType.slice(1)
                        )
                      }

                      switch (type) {
                        case 'auto':
                          displayTitle = autoTitle || 'Last Pages'
                          subtitle = `Auto: Latest 5 from ${formatPageType(pageType)}`
                          break
                        case 'tag':
                          const tagNames = tagTitles?.filter(Boolean).join(', ') || 'No tags'
                          displayTitle = autoTitle || `Pages tagged: ${tagNames}`
                          subtitle = `Tag: "${tagNames}" in ${formatPageType(tagPageType)}`
                          break
                        case 'manual':
                          subtitle = 'Manual link'
                          break
                        default:
                          displayTitle = 'Unconfigured link'
                      }

                      return {
                        title: displayTitle || 'Untitled Sublink',
                        subtitle,
                        media: LinkIcon,
                      }
                    },
                  },
                },
              ],
            }),
          ],
        },
      ],
    }),
  ],
})
