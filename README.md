# Product Explorer 🚀

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

**Live Demo:** [product-explorer-assign.netlify.app](https://product-explorer-assign.netlify.app/)

## 📖 Overview
Product Explorer is a full-stack web scraping application designed to extract, process, and dynamically display structured product data. Built with strict type safety using TypeScript across both the client and server, the application features a decoupled architecture and is fully containerized using Docker for seamless cross-platform deployment.

## ✨ Features
* **Automated Data Extraction:** Utilizes Playwright to efficiently scrape and process product data from target sources.
* **Full-Stack TypeScript:** Ensures high reliability, maintainability, and shared type definitions between the frontend and backend.
* **Containerized Environment:** Easily spin up the entire application stack using Docker and Docker Compose.
* **Responsive UI:** Clean, modern, and accessible frontend deployed continuously via Netlify.

## 🛠️ Tech Stack
* **Frontend:** TypeScript, CSS, HTML (Deployed on Netlify)
* **Backend:** Node.js, TypeScript, Playwright (Web Scraping)
* **DevOps / Infrastructure:** Docker, Docker Compose

## 📁 Repository Structure
```text
product-explorer-assignment/
├── backend/            # Node.js/TypeScript backend & Playwright scraping scripts
├── frontend/           # Client-side UI application
├── docker-compose.yml  # Docker configuration for multi-container orchestration
└── README.md
