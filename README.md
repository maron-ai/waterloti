# Waterloti Tailored Open Source Contributor Hub

Discover open-source projects that match your skills and interests with Waterloti. We analyze your resume to suggest projects tailored for you, making it easier to start contributing to meaningful and relevant open-source initiatives.

## Getting Started

To get Waterloti running locally:

1. Install dependencies:

   ```sh
     pnpm install
   ```

2. Start the development server:

   ```sh
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000/) in your browser to see the application.

4. Begin editing `pages/index.tsx` to make changes. The page auto-updates as you edit.

## Roadmap

- **Scraper Development:** Build a scraper on Apify to gather open source projects from GitHub.
- **Database Integration:** Store scraped project details in our database.
- **Analysis Algorithm:** Analyze repositories for code patterns, interests, and tags.
- **Resume Scanning:** Implement functionality to extract keywords from user resumes.
- **Matching Algorithm:** Develop a system to match users with repositories based on their extracted interests and skills.

## API Routes

Access API routes such as [http://localhost:3000/api/hello](http://localhost:3000/api/hello). Edit endpoints in `pages/api/hello.ts`. The `pages/api` directory is mapped to `/api/*` and is treated as API routes.
