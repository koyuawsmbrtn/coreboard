import { PUBLIC_SANITY_PAGE_TITLE, PUBLIC_SANITY_PUBLIC_VIEWER_TOKEN, PUBLIC_SANITY_STUDIO_HOST, PUBLIC_SANITY_STUDIO_URL, PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_PREVIEW_URL, PUBLIC_SANITY_DATASET } from '$env/static/public';

export const sanityConnection = {
  pageTitle: PUBLIC_SANITY_PAGE_TITLE || "Coreboard",
  publicViewerToken: PUBLIC_SANITY_PUBLIC_VIEWER_TOKEN || "skfYYEuLCRMcMWjbtwmc25xhwlPTcKA0Ntik8VGw4JPjaJWtodZqaxvPmQ0tGZfTuWDkagTpsX0gIObkxC9YmAoGbl15L4OU9AuKaACzMAGWnxZ6rQ4a6GpczH8yZEPbE2Q508gtMODTGG2dysIbtvewtnqY0E8pAkTEzRStoxuokWgNl9G6",
  studioHost: PUBLIC_SANITY_STUDIO_HOST || "coreboard",
  studioUrl: PUBLIC_SANITY_STUDIO_URL || "https://coreboard.sanity.studio",
  projectId: PUBLIC_SANITY_PROJECT_ID || "u3x2jw5m",
  previewUrl: PUBLIC_SANITY_PREVIEW_URL || "http://localhost:5173",
  dataset: PUBLIC_SANITY_DATASET || "production",
};