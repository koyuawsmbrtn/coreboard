import { defineType, defineArrayMember } from 'sanity'
import AlignmentLeftIcon from '../components/icons/alignment-left'
import AlignmentCenterIcon from '../components/icons/alignment-center'
import AlignmentRightIcon from '../components/icons/alignment-right'
import { TextAlign } from '../components/TextAlignComponent'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bulletpoint', value: 'bullet' }],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Left', value: 'left', icon: AlignmentLeftIcon, component: (props) => TextAlign(props) },
          { title: 'Center', value: 'center', icon: AlignmentCenterIcon, component: (props) => TextAlign(props) },
          { title: 'Right', value: 'right', icon: AlignmentRightIcon, component: (props) => TextAlign(props) },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'Link',
                name: 'href',
                type: 'link',
              },
            ],
          },
          {
            type: "textColor"
          },
          {
            type: "highlightColor"
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      title: 'Button',
      type: 'button',
    }),
    defineArrayMember({
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineArrayMember({
      title: 'File',
      type: 'file',
    }),
  ],
})