# Start with the lightweight Node image
FROM node:18-slim

# 1. Install System Dependencies for Playwright (Chromium)
# We need these libraries so the headless browser can actually run inside Linux
# Added: ca-certificates (for HTTPS) and fonts-liberation (for text rendering)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
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
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# 2. Layer Caching: Copy package files first
COPY package.json package-lock.json* ./

# 3. Install Node dependencies
RUN npm ci --prefer-offline --no-audit

# 4. Install Playwright Browsers (Chromium only to save space)
RUN npx playwright install chromium

# 5. Copy Application Code
COPY . .

# 6. Build the NestJS application
RUN npm run build

# 7. Expose the port
EXPOSE 3000

# 8. Start the application
CMD ["node", "dist/main.js"]