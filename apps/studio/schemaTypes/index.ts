import blockContent from "./blockContent";
import settings from "./settings";

import * as objects from './objects'
import * as sections from './sections'
import * as pages from './pages'
import navbar from "./navbar";

export const schemaTypes = [
  blockContent,
  settings,
  navbar,

  ...Object.values(objects),
  ...Object.values(sections),
  ...Object.values(pages),
]
