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
# ... after WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install
# ... after npm install
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/src/app/ms-playwright
RUN npx playwright install --with-deps chromium
# 🚨 ADD THIS LINE to copy the CSV specifically
COPY books_data.csv ./books_data.csv

COPY . .
RUN npm run build
# ...

RUN npm run build

# ... (rest of the file)

# ... (rest of the file)

EXPOSE 3000

# 🚨 UPDATED LINE: Run seed, THEN start the app
CMD ["/bin/sh", "-c", "npm run seed && npm run start:prod"]