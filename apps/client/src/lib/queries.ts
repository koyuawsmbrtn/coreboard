import type { Home } from './sanity.types'

export type HomeResult = Home

export const homeQuery = `{
  "home": *[_type == "home"][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    showKnowledgebase,
    knowledgebaseTitle,
    headerSection{
      _type,
      title,
      description,
      backgroundImage{
        asset->{
          _id,
          _ref,
          _type,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        crop,
        hotspot,
        alt
      },
      button{
        _type,
        text,
        link{
          _type,
          type,
          value,
          anchor,
          parameters,
          blank,
          url,
          email,
          phone,
          internalLink->{
            _ref,
            _type
          }
        }
      }
    }
  },
  "featuredCategories": *[_type == "category" && featured == true && !defined(parent)] | order(order asc) [0...6] {
    _id,
    name,
    slug,
    description,
    icon,
    color,
    "articleCount": count(*[_type == "article" && references(^._id)])
  },
  "featuredArticles": *[_type == "article" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    category->{
      name,
      slug,
      color
    },
    estimatedReadTime
  }
}`