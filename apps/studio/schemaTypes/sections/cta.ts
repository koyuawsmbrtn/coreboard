import { RocketIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ctaSection',
  title: 'Call to Action Section',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'imageWithAlt'
    }),
    defineField({
      name: 'title',
      title: 'Title',
      initialValue: 'Welcome to Our Site',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent'
    }),
    defineField({
      name: 'button',
      title: 'Button',
      initialValue: {
        text: 'Get Started',
      },
      type: 'button',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'backgroundImage.image',
      buttonText: 'primaryButton.text',
    },
    prepare({ title, media, buttonText }) {
      return {
        title: title || 'CTA Section',
        subtitle: buttonText ? `Primary: ${buttonText}` : 'No button text',
        media,
      }
    },
  },
})
