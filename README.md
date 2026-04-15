# Gmail Filter Architect

A web-based utility to bridge the gap in Gmail's filter management. It allows users to import Gmail's XML filter exports, manipulate them with advanced logic, and export them back seamlessly.

## 🎯 Purpose & Vision

Gmail provides a way to export filters via XML, but manipulating hundreds of filters manually is nearly impossible. **Gmail Filter Architect** solves this by offering a clean, "Bento Box" styled modular GUI to visualize, group, audit, and batch-edit Gmail filters entirely in your browser.

**Core Functionality:**
- **Parser:** Read `.xml` files from Gmail and convert `<apps:property>` tags into editable objects.
- **Domain Grouping:** Cleanly group filters by `@domain.com` for structural clarity.
- **Audit Engine:** Automatically identify duplicate rules or conflicting actions (e.g., two rules taking opposite actions on the same sender).
- **Bulk Operations:** Batch apply updates like "Mark as read", attach "Labels", or sandbox rules into a "Draft" status.
- **Privacy First:** 100% Client-side processing. Your emails and filter logic never leave your browser.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **UI & Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Core Engine:** React 19 RC 
- **Parsing:** `fast-xml-parser`

## 🚀 Deployment (Production)

The application is fully containerized and configured for an Ubuntu production server via Docker (using `standalone` Next.js output to minimize image size). 

To deploy from a local Windows machine to the configured Ubuntu server:
1. Ensure your SSH config is set up or you have passwordless auth.
2. Run the deployment script via PowerShell:
   ```powershell
   .\deploy.ps1
   ```
   *(This script packages the app via tar, ships it via SCP, natively builds the Docker Image on the Ubuntu server, logs the entire process to `deploy_log.txt`, and spins up the container.)*

## 💻 Local Development

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📈 Status

- [x] Initial Next.js 15 Setup
- [x] Tailwind CSS v4 Migration & Linting Setup
- [x] Docker Containerization & Build Optimization (`Standalone`)
- [x] Remote Deployment Pipeline (`deploy.ps1`)
- [ ] UI Component Foundation (Bento Box styled)
- [ ] XML Parser Core Integration
- [ ] Export logic Implementation
