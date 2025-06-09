# Chord Builder - Frontend

A React app for creating guitar chord diagrams and exporting them to PDF.

## Live Demo
🌐 [chordbuilder.netlify.app](https://chordbuilder.netlify.app)

## Features
- Create 6-fret and 12-fret chord diagrams
- Save sheets (requires sign-in)
- Export to PDF
- Mobile-friendly

## Local Development

1. Clone and install:
   ```bash
   git clone <repo-url>
   npm install
   ```

2. Add `.env` file:
   ```
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_AUDIENCE=https://chord-app-api
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

## Tech Stack
React, Vite, Auth0, Tailwind CSS