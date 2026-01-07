FROM node:20-bookworm

# 1. Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    librandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

# 🚨 CHANGE THIS LINE: Use 'install' instead of 'ci' to bypass lockfile mismatch
RUN npm install

# Install Playwright browsers
RUN npx playwright install chromium

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]