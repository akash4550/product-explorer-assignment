Product Explorer 🚀

  
Live Demo: product-explorer-assign.netlify.app
📖 Overview

Product Explorer is a full-stack web scraping application designed to extract, process, and dynamically display structured product data. Built with strict type safety using TypeScript across both the client and server, the application features a decoupled architecture and is fully containerized using Docker for seamless cross-platform deployment.
✨ Features

Automated Data Extraction: Utilizes Playwright to efficiently scrape and process product data from target sources.
Full-Stack TypeScript: Ensures high reliability, maintainability, and shared type definitions between the frontend and backend.
Containerized Environment: Easily spin up the entire application stack using Docker and Docker Compose.
Responsive UI: Clean, modern, and accessible frontend deployed continuously via Netlify.
🛠️ Tech Stack

Frontend: TypeScript, CSS, HTML (Deployed on Netlify)
Backend: Node.js, TypeScript, Playwright (Web Scraping)
DevOps / Infrastructure: Docker, Docker Compose
📁 Repository Structure

product-explorer-assignment/
├── backend/            # Node.js/TypeScript backend & Playwright scraping scripts
├── frontend/           # Client-side UI application
├── docker-compose.yml  # Docker configuration for multi-container orchestration
└── README.md

🚀 Key Engineering Features
Automated Data Pipeline: Triggers headless browser instances to scrape and transform raw HTML into structured JSON.

Decoupled API Design: The backend acts as a standalone service, allowing the frontend to be swapped or scaled independently.

CI/CD Ready: Configured for continuous deployment with zero-configuration triggers on Git push.

⚙️ Development Setup
Using Docker (Recommended)
Bash
# Clone the repo
git clone https://github.com/Akshay-Lakwal/product-explorer.git
cd product-explorer

# Spin up the entire stack
docker-compose up --build
Manual Setup
Backend: Navigate to /backend, run npm install, and npm run dev.

Frontend: Navigate to /frontend, run npm install, and npm start.
