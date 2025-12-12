# Coreboard

A modern, full-featured support and knowledge base platform built with SvelteKit, Sanity CMS, and Linear. Coreboard provides an integrated solution for managing documentation, support tickets, and customer interactions.

## ✨ Features

### 📚 Knowledge Base
- **Comprehensive Documentation**: Create and organize articles, guides, and tutorials
- **Categories & Tags**: Organize content with color-coded categories and searchable tags
- **Search Functionality**: Full-text search across all articles and content
- **Featured Articles**: Highlight important content on the homepage
- **Difficulty Levels**: Mark articles as beginner, intermediate, or advanced
- **Cover Images**: Visual appeal with optimized images via Sanity CDN
- **Markdown Support**: Rich content formatting with Sanity's block content

### 🎫 Support Ticket System
- **Smart Wizard**: Multi-step support form with customizable questions
- **Flexible Authentication**: Optional login with guest support via email
- **Multiple Question Types**: 
  - Multiple choice
  - Text input
  - Textarea
  - File uploads
- **Linear Integration**: Automatic ticket creation in Linear with "Support" team assignment
- **Email Notifications**: Automated ticket confirmation emails via Resend
- **Non-Guessable Ticket Numbers**: Secure CUID-based ticket identifiers
- **Real-time Comments**: Two-way comment system synced with Linear
- **Markdown Comments**: Rich text support in ticket descriptions and comments
- **Access Control**: User-owned tickets require authentication to view
- **Status Management**: Automatic comment locking on closed tickets

### 🔐 Authentication
- **External Auth**: Powered by better-auth for secure session management
- **Cookie-Based Sessions**: Server-side session extraction for secure API calls
- **User Dropdown**: Seamless login/logout experience in navbar
- **Mobile Support**: Responsive authentication UI with Sheet component

### 🎨 Design
- **Modern UI**: Built with shadcn-svelte components
- **Dark Mode**: Full dark mode support
- **Responsive**: Mobile-first design that works on all devices
- **Tailwind CSS 4**: Latest Tailwind with typography plugin
- **Custom Theming**: Brand colors and design tokens

## 🏗️ Architecture

### Tech Stack

**Frontend**
- [SvelteKit 5](https://kit.svelte.dev/) - Full-stack web framework with SSR
- [Svelte 5](https://svelte.dev/) - Reactive UI framework with runes
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn-svelte](https://www.shadcn-svelte.com/) - Beautiful UI components
- [Lucide Svelte](https://lucide.dev/) - Icon library

**Backend & Services**
- [Sanity](https://www.sanity.io/) - Headless CMS for content management
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Prisma](https://www.prisma.io/) - Type-safe ORM
- [Linear](https://linear.app/) - Issue tracking and ticket management
- [better-auth](https://www.better-auth.com/) - Authentication service
- [Resend](https://resend.com/) - Transactional email service

**Development Tools**
- [Nx](https://nx.dev/) - Monorepo management
- [Bun](https://bun.sh/) - Fast package manager and runtime
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

### Monorepo Structure

```
coreboard/
├── apps/
│   ├── client/          # SvelteKit application
│   │   ├── src/
│   │   │   ├── routes/  # Page routes
│   │   │   │   ├── support/        # Support wizard
│   │   │   │   ├── ticket/         # Ticket viewing
│   │   │   │   ├── blog/           # Blog pages
│   │   │   │   ├── kb/             # Knowledge base
│   │   │   │   └── category/       # Category pages
│   │   │   └── lib/
│   │   │       ├── components/     # Reusable components
│   │   │       ├── server/         # Server utilities
│   │   │       └── utils/          # Client utilities
│   │   └── static/      # Static assets
│   └── studio/          # Sanity Studio CMS
│       ├── schemaTypes/ # Content schemas
│       └── components/  # Custom Studio components
├── packages/
│   ├── sanity-connection/  # Shared Sanity client
│   ├── typescript-config/  # Shared TypeScript configs
│   └── ui/                 # Shared UI tokens and config
├── prisma/
│   └── schema.prisma    # Database schema
└── generated/
    └── prisma/          # Generated Prisma client
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.2.12 or higher
- [PostgreSQL](https://www.postgresql.org/) database
- [Sanity](https://www.sanity.io/) account and project
- [Linear](https://linear.app/) account with API access
- [Resend](https://resend.com/) account for email
- [better-auth](https://www.better-auth.com/) server (or compatible auth service)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coreboard
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Authentication
   PUBLIC_BASE_URL=https://your-auth-backend.com
   PUBLIC_ORIGIN_URL=http://localhost:5173

   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/coreboard

   # Linear API
   LINEAR_API_KEY=lin_api_xxxxxxxxxxxxx

   # Email Service
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_FROM=support@yourdomain.com

   # Sanity CMS
   PUBLIC_SANITY_DATASET=production
   PUBLIC_SANITY_PROJECT_ID=your-project-id
   SANITY_API_READ_TOKEN=skxxxxxxxxxxxxx
   SANITY_API_WRITE_TOKEN=skxxxxxxxxxxxxx
   PUBLIC_SANITY_API_VERSION=2024-01-01
   PUBLIC_SANITY_STUDIO_URL=https://your-studio.sanity.studio
   PUBLIC_SANITY_URL=https://yourdomain.com
   ```

4. **Initialize the database**
   ```bash
   bun run db:push
   # or for migrations:
   bun run db:migrate
   ```

5. **Set up Sanity Studio**
   ```bash
   cd apps/studio
   bun run dev
   ```
   Visit http://localhost:3333 to configure your Sanity Studio

6. **Start the development server**
   ```bash
   cd ../..
   bun run dev
   ```
   Visit http://localhost:5173

## 📝 Configuration

### Sanity Studio Setup

1. **Create Content Models**
   - Navigate to your Sanity Studio
   - Create the following document types:
     - **Knowledge Base**: Homepage configuration
     - **Article**: Documentation articles
     - **Category**: Article categories with colors
     - **Blog**: Blog posts
     - **Support Question**: Wizard questions
     - **Navbar**: Navigation configuration
     - **Settings**: Site-wide settings

2. **Configure Support Questions**
   - Go to "Support Question" document type
   - Create questions with these fields:
     - Question text
     - Order (for sequencing)
     - Type (multiple-choice, text, textarea, file)
     - Options (for multiple-choice)
     - Placeholder text
     - Required flag
     - Active flag

### Linear Setup

1. **Create API Key**
   - Go to Linear Settings → API
   - Create a new personal API key
   - Add to `LINEAR_API_KEY` in `.env`

2. **Create Support Team**
   - Create a team named "Support" in Linear
   - The system will automatically create issues in this team
   - Issues are tagged with "authed" label

### Resend Setup

1. **Create API Key**
   - Sign up at [Resend](https://resend.com/)
   - Generate API key
   - Add to `RESEND_API_KEY` in `.env`

2. **Verify Domain**
   - Add and verify your sending domain
   - Set `EMAIL_FROM` to your verified email address

### Authentication Setup

1. **Deploy better-auth Server**
   - Set up a better-auth compatible authentication server
   - Configure allowed origins to include your Coreboard domain
   - Set `PUBLIC_BASE_URL` to your auth server URL

2. **Configure Redirects**
   - Set `PUBLIC_ORIGIN_URL` to your Coreboard URL
   - Ensure auth server allows redirects to this origin

## 🛠️ Development

### Available Scripts

```bash
# Development
bun run dev              # Start dev server (client + studio)
bun run dev:client       # Start client only
bun run dev:studio       # Start Sanity Studio only

# Building
bun run build            # Build all apps
bun run build:client     # Build client only
bun run build:studio     # Build Sanity Studio only

# Database
bun run db:push          # Push schema changes
bun run db:migrate       # Create and run migrations
bun run db:studio        # Open Prisma Studio
bun run db:generate      # Generate Prisma client

# Sanity
bun run sanity:generate  # Generate Sanity types
bun run sanity:deploy    # Deploy Sanity Studio

# Linting & Formatting
bun run lint             # Lint all code
bun run format           # Format all code

# Deployment
bun run deploy           # Deploy to Cloudflare Workers
```

### Project Structure Details

**Key Files**

- [`apps/client/src/routes/support/+page.svelte`](apps/client/src/routes/support/+page.svelte) - Support wizard UI
- [`apps/client/src/routes/support/+page.server.ts`](apps/client/src/routes/support/+page.server.ts) - Ticket creation logic
- [`apps/client/src/routes/ticket/[ticketNumber]/+page.svelte`](apps/client/src/routes/ticket/[ticketNumber]/+page.svelte) - Ticket viewing UI
- [`apps/client/src/routes/ticket/[ticketNumber]/+page.server.ts`](apps/client/src/routes/ticket/[ticketNumber]/+page.server.ts) - Ticket fetching & comments
- [`apps/client/src/lib/auth.ts`](apps/client/src/lib/auth.ts) - Authentication client
- [`prisma/schema.prisma`](prisma/schema.prisma) - Database schema
- [`apps/studio/schemaTypes/`](apps/studio/schemaTypes/) - Sanity content models

## 🎯 Usage

### Creating Support Tickets

1. **User Flow**
   - Navigate to `/support`
   - Optional: Login with better-auth
   - If skipped, provide email address
   - Answer customizable questions
   - Submit ticket

2. **Backend Process**
   - Creates Linear issue in "Support" team
   - Generates non-guessable ticket number (CUID)
   - Stores ticket mapping in database
   - Sends email notification with ticket link
   - Returns ticket number to user

3. **Viewing Tickets**
   - Access via `/ticket/{ticketNumber}` link from email
   - View ticket details fetched from Linear
   - See all comments with Markdown rendering
   - Add comments (if authenticated and ticket not closed)

### Managing Content

1. **Articles**
   - Create in Sanity Studio
   - Add cover images, categories, tags
   - Set difficulty level
   - Mark as featured
   - Publish to make visible

2. **Support Questions**
   - Define in Sanity Studio
   - Set question order
   - Choose question type
   - Configure validation rules
   - Toggle active status

3. **Categories**
   - Create with unique names
   - Assign colors for visual coding
   - Link articles to categories

### Access Control

**Public Access**
- All articles and knowledge base content
- Support ticket creation (with or without login)
- Ticket viewing for anonymous tickets

**Authenticated Access Required**
- User-owned ticket viewing (requires login + ownership)
- Adding comments to tickets
- Viewing personal ticket history

**Restricted Actions**
- Comments on closed tickets (disabled)
- Comments without authentication (disabled)

## 🚢 Deployment

### Cloudflare Workers

1. **Configure Wrangler**
   - Update [`apps/client/wrangler.jsonc`](apps/client/wrangler.jsonc) with your Cloudflare account details

2. **Set Environment Variables**
   ```bash
   wrangler secret put DATABASE_URL
   wrangler secret put LINEAR_API_KEY
   wrangler secret put RESEND_API_KEY
   # ... add all secrets
   ```

3. **Deploy**
   ```bash
   bun run deploy
   ```

### Database Migration

Before deployment, ensure database is up-to-date:
```bash
bun run db:migrate
```

### Sanity Studio Deployment

```bash
bun run sanity:deploy
```

Access at your configured Sanity Studio URL.

## 📊 Database Schema

### Ticket Model

```prisma
model Ticket {
  id            String   @id @default(cuid())
  ticketNumber  String   @unique @default(cuid())  // Public ticket identifier
  linearId      String?  @unique                    // Linear issue ID
  userId        String?                             // External user ID (optional)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([userId])
  @@index([ticketNumber])
}
```

**Design Decisions**
- `ticketNumber` uses CUID for non-guessable, URL-safe identifiers
- `userId` is optional to support anonymous tickets
- No foreign key on `userId` - users managed externally by better-auth
- `linearId` stores the Linear issue ID for fetching details

## 🔒 Security

### Authentication
- Cookie-based session management via better-auth
- Server-side session validation
- Token extraction from `better-auth.session_token` cookie

### Access Control
- User-owned tickets require authentication and ownership verification
- Anonymous tickets accessible via ticketNumber (non-guessable)
- Closed tickets reject new comments

### Data Protection
- Environment variables for sensitive credentials
- No hardcoded API keys or secrets
- HTTPS required for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED license.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
- [Sanity](https://www.sanity.io/) for the powerful CMS
- [Linear](https://linear.app/) for issue tracking
- [shadcn-svelte](https://www.shadcn-svelte.com/) for beautiful components
- [Nx](https://nx.dev/) for monorepo management

## 📞 Support

For issues and questions:
1. Check existing documentation in the knowledge base
2. Create a support ticket via `/support`
3. Open an issue on GitHub

---

Built with ❤️ using SvelteKit, Sanity, and Linear
