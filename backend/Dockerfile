FROM node:20-bookworm

# 1. Install system dependencies for Playwright
# Fixed: librandr2 -> libxrandr2
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
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

# Use install to avoid lockfile issues
RUN npm install

# Install Playwright browsers
RUN npx playwright install chromium

# ... (previous lines)

COPY . .

# 🚨 ADD THIS LINE to ensure the CSV is in the right place
COPY books_data.csv ./books_data.csv

RUN npm run build

# ... (rest of the file)

EXPOSE 3000

# 🚨 UPDATED LINE: Run seed, THEN start the app
CMD ["/bin/sh", "-c", "npm run seed && npm run start:prod"]