# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
COPY packages /temp/dev/packages
COPY apps/client/package.json /temp/dev/apps/client/package.json
COPY apps/studio/package.json /temp/dev/apps/studio/package.json
RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
COPY packages /temp/prod/packages
COPY apps/client/package.json /temp/prod/apps/client/package.json
COPY apps/studio/package.json /temp/prod/apps/studio/package.json
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY nx.json package.json tsconfig.base.json prisma.config.ts ./
COPY packages ./packages
COPY apps/client ./apps/client
COPY prisma ./prisma

# Accept build-time environment variables
ARG DATABASE_URL
ARG PUBLIC_BASE_URL
ARG PUBLIC_ORIGIN_URL
ARG LINEAR_API_KEY
ARG RESEND_API_KEY
ARG EMAIL_FROM
ARG PUBLIC_SANITY_PAGE_TITLE
ARG PUBLIC_SANITY_PUBLIC_VIEWER_TOKEN
ARG PUBLIC_SANITY_STUDIO_HOST
ARG PUBLIC_SANITY_STUDIO_URL
ARG PUBLIC_SANITY_PROJECT_ID
ARG PUBLIC_SANITY_PREVIEW_URL
ARG PUBLIC_SANITY_DATASET

# Generate Prisma client
RUN bunx prisma generate

# Build the client app using environment variables from .env
ENV NODE_ENV=production
RUN bunx nx run client:build

# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/generated/prisma generated/prisma
COPY --from=prerelease /usr/src/app/apps/client/build apps/client/build
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/prisma prisma
COPY --from=prerelease /usr/src/app/prisma.config.ts prisma.config.ts
COPY --from=prerelease /usr/src/app/apps/client/static apps/client/static
COPY --from=prerelease /usr/src/app/apps/client/package.json apps/client/package.json
# NOTE: .env is not copied to final image - docker-compose provides environment variables

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create a non-root user (using groupadd/useradd for Debian-based systems)
RUN groupadd --system --gid 1001 bunjs || true
RUN useradd --system --uid 1001 --gid bunjs --shell /bin/bash bunjs || true
USER bunjs

# Expose port
EXPOSE 3002/tcp

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Set entrypoint and command
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["bun", "run", "apps/client/build/index.js"]