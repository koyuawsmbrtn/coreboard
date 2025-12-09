import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {ClipboardIcon, EditIcon, HomeIcon, MenuIcon, WrenchIcon, SearchIcon, DocumentTextIcon, FolderIcon, TagIcon} from '@sanity/icons'
import {schemaTypes} from './schemaTypes'
import {presentationTool} from 'sanity/presentation'
import {linkField} from 'sanity-plugin-link-field'
import {seoMetaFields} from 'sanity-plugin-seo'
import {simplerColorInput} from 'sanity-plugin-simpler-color-input'
import {createColorList} from './lib/colorUtils'
import {sanityConnection} from '@repo/sanity-connection'
import Logo from './components/logo'

export default defineConfig({
  name: 'default',
  title: sanityConnection.pageTitle,
  projectId: sanityConnection.projectId,
  dataset: sanityConnection.dataset,
  icon: Logo,
  plugins: [
    structureTool({
      title: 'Content',
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Settings')
              .icon(WrenchIcon)
              .child(S.document().schemaType('settings').documentId('settings').title('Settings')),
            S.listItem()
              .title('Navbar')
              .icon(MenuIcon)
              .child(S.document().schemaType('navbar').documentId('navbar').title('Navbar')),
            S.divider(),
            S.listItem()
              .title('Landing Page')
              .icon(HomeIcon)
              .child(S.document().schemaType('home').documentId('home').title('Home')),
            S.divider(),
            // Knowledgebase Section
            S.listItem()
              .title('Knowledgebase Settings')
              .icon(SearchIcon)
              .child(S.document().schemaType('knowledgebase').documentId('knowledgebase').title('Knowledgebase Settings')),
            S.listItem()
              .title('Articles')
              .icon(DocumentTextIcon)
              .child(S.documentTypeList('article').title('Articles')),
            S.listItem()
              .title('Categories')
              .icon(FolderIcon)
              .child(S.documentTypeList('category').title('Categories')),
            S.listItem()
              .title('Tags')
              .icon(TagIcon)
              .child(S.documentTypeList('tag').title('Tags')),
            S.divider(),
            S.listItem()
              .title('Custom pages')
              .icon(ClipboardIcon)
              .child(S.documentTypeList('custom').title('Content')),
            S.listItem()
              .title('Blog')
              .icon(EditIcon)
              .child(S.documentTypeList('blog').title('Blog')),
          ]),
    }),
    // @ts-ignore
    linkField({
      linkableSchemaTypes: ['custom', 'blog', 'article'],
      customLinkTypes: [
        {
          title: 'Static pages',
          value: 'static',
          icon: ClipboardIcon,
          options: [
            {
              title: 'Home',
              value: '/',
            },
            {
              title: 'Knowledgebase',
              value: '/',
            },
            {
              title: 'Blog',
              value: '/blog',
            },
          ],
        },
      ],
    }),
    presentationTool({
      previewUrl: {
        origin: sanityConnection.previewUrl ?? 'http://localhost:5173',
        preview: '/',
        previewMode: {
          enable: '/preview/enable',
          disable: '/preview/disable',
        },
      },
    }),
    seoMetaFields(),
    simplerColorInput({
      defaultColorFormat: 'hex',
      defaultColorList: createColorList(),
      enableSearch: true,
      showColorValue: true,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
