import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export default defineType({
  name: 'supportQuestion',
  title: 'Support Question',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description: 'The order in which this question appears in the wizard',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'type',
      title: 'Question Type',
      type: 'string',
      options: {
        list: [
          {title: 'Multiple Choice', value: 'multiple-choice'},
          {title: 'Text Input', value: 'text'},
          {title: 'Long Text (Textarea)', value: 'textarea'},
          {title: 'File Upload', value: 'file'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'multiple-choice',
    }),
    defineField({
      name: 'options',
      title: 'Options',
      description: 'For multiple choice questions only',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      hidden: ({document}) => document?.type !== 'multiple-choice',
      validation: (Rule) =>
        Rule.custom((options, context) => {
          const type = (context.document as any)?.type
          if (type === 'multiple-choice' && (!options || options.length === 0)) {
            return 'Multiple choice questions must have at least one option'
          }
          return true
        }),
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder Text',
      description: 'For text input questions',
      type: 'string',
      hidden: ({document}) =>
        document?.type !== 'text' && document?.type !== 'textarea',
    }),
    defineField({
      name: 'acceptedFileTypes',
      title: 'Accepted File Types',
      description: 'For file upload questions (e.g., image/*, .pdf, .doc)',
      type: 'string',
      hidden: ({document}) => document?.type !== 'file',
      placeholder: 'image/*,.pdf,.doc,.docx',
    }),
    defineField({
      name: 'maxFileSize',
      title: 'Max File Size (MB)',
      description: 'Maximum file size in megabytes',
      type: 'number',
      hidden: ({document}) => document?.type !== 'file',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(50),
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      description: 'Show this question in the wizard',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'question',
      order: 'order',
      active: 'active',
    },
    prepare({title, order, active}) {
      return {
        title: `${order}. ${title}`,
        subtitle: active ? 'Active' : 'Inactive',
      }
    },
  },
})
