#!/usr/bin/env bash
# V-Ride build script — minimal version.
# Per platform rule: "Never use `bun run build`" — the platform's deploy
# service runs its own build. This script just creates the source tarball
# the deploy service expects at /tmp/build_fullstack_<BUILD_ID>.tar.gz.
set -e
cd "${PROJECT_DIR:-/home/z/my-project}"

# Create the expected tarball with source files.
TS="${BUILD_ID:-$(date +%s)}"
OUT="/tmp/build_fullstack_${TS}.tar.gz"
tar -czf "$OUT" \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=upload \
  --exclude=skills \
  --exclude=tests \
  --exclude=examples \
  --exclude=mini-services \
  --exclude=prisma \
  --exclude=.zscripts \
  --exclude=dev.log \
  --exclude=server.log \
  --exclude=worklog.md \
  --exclude=download \
  --exclude=dist \
  --exclude=.next \
  --exclude=.env \
  --exclude='package-lock.json' \
  --exclude='bun.lock' \
  src public package.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs components.json eslint.config.mjs .gitignore Caddyfile 2>/dev/null || true
exit 0
