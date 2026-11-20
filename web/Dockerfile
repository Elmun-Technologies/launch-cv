# syntax=docker/dockerfile:1
# LaunchCV — Hetzner / Coolify image (linux/arm64 va amd64 ikkalasida ishlaydi).
# Build bazaga ulanmaydi: sxema va kontent tuzatishlari `npm run release` orqali
# konteyner ishga tushganda bajariladi (docs/HETZNER.md).
FROM node:22-bookworm-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Bog'liqliklar (postinstall prisma generate uchun sxema kerak)
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --include=dev

COPY . .

# NEXT_PUBLIC_* qiymatlari build paytida bundle'ga yoziladi: Coolify'da
# "Available at Buildtime" belgilang.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_MIXPANEL_TOKEN
ARG NEXT_PUBLIC_MIXPANEL_HOST
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG NEXT_PUBLIC_POLAR_PORTAL_URL
ARG NEXT_PUBLIC_SUPPORT_EMAIL
ARG NEXT_PUBLIC_TWITTER_HANDLE
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_PUBLIC_MIXPANEL_TOKEN=$NEXT_PUBLIC_MIXPANEL_TOKEN \
    NEXT_PUBLIC_MIXPANEL_HOST=$NEXT_PUBLIC_MIXPANEL_HOST \
    NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
    NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST \
    NEXT_PUBLIC_POLAR_PORTAL_URL=$NEXT_PUBLIC_POLAR_PORTAL_URL \
    NEXT_PUBLIC_SUPPORT_EMAIL=$NEXT_PUBLIC_SUPPORT_EMAIL \
    NEXT_PUBLIC_TWITTER_HANDLE=$NEXT_PUBLIC_TWITTER_HANDLE

RUN npm run build:app

ENV NODE_ENV=production PORT=3000
RUN chown -R node:node /app
USER node
EXPOSE 3000

# 1) release: db push (ma'lumot yo'qotadigan o'zgarishda to'xtaydi), seed, content-fixes
# 2) next start. release xato bersa ham sayt eski sxema bilan ishga tushadi (log'ga yoziladi).
CMD ["sh", "-c", "npm run release || echo '[release] FAILED - starting with the current schema'; exec node_modules/.bin/next start -H 0.0.0.0 -p ${PORT:-3000}"]
