# Ashish Kumar — Portfolio

## About

Personal portfolio for Ashish Kumar, featuring XR and AI projects, research, experience, and contact information. The frontend uses React, TypeScript, Vite, Tailwind CSS, and Motion. An Express server provides optional Gemini-backed chat and audio endpoints.

[Visit the portfolio](https://ashish11828.github.io/)

## Local development

1. Clone this repository and install a Node.js version compatible with the committed dependencies.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and replace placeholders for the services you want to use.
4. Run `npm run dev` and open `http://localhost:3000`.

`GEMINI_API_KEY` belongs on the server. `VITE_API_BASE_URL` points a statically hosted frontend to a separately hosted API. The optional EmailJS settings are described in `.env.example`.

## Checks and build

`npm run lint` runs the TypeScript check. `npm run build` produces the frontend build; `npm run preview` previews that static build. These commands are declared in `package.json`; they have not been run as part of this documentation cleanup.

## Deployment

The repository contains a GitHub Actions workflow under `.github/workflows`. GitHub Pages serves static files and cannot run the Express backend; deploy API features separately and configure the frontend API URL when needed.

## Source guide

- `src/`: React application, components, content, and styles.
- `server.ts`: development server and API routes.
- `server/`: Gemini client and AI pipeline.
- `public/`: static assets.
