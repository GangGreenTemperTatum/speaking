# Ads Dawson - Speaking Repository

This repository contains materials from various speaking engagements, podcast appearances, publications, and television segments related to AI/ML security.

Visit the [GitHub Pages site](https://ganggreentempertatum.github.io/speaking/) to browse content in a user-friendly format.

- [Ads Dawson - Speaking Repository](#ads-dawson---speaking-repository)
  - [Contents](#contents)
  - [Adding New Content](#adding-new-content)
    - [Adding a Conference Talk](#adding-a-conference-talk)
    - [Adding a Podcast Appearance](#adding-a-podcast-appearance)
    - [Adding a Publication](#adding-a-publication)
    - [Adding a Television Appearance](#adding-a-television-appearance)
  - [Development](#development)
    - [Local Development](#local-development)
    - [Testing Locally](#testing-locally)
  - [License](#license)

## Contents

- **Conference Talks**: Presentations, slides, and materials from conference appearances
- **Podcasts**: Information about podcast appearances with links to episodes
- **Publications**: Links to articles, papers, and other publications
- **Television**: TV and video appearances related to AI/ML security

## Adding New Content

### Adding a Conference Talk

1. Create a new directory in the appropriate location under `/docs/conferences/{organization}/{year}/{month or event-name}/`
2. Add your presentation files (PDFs, slides, images) to this directory
3. Create a README.md file with the following information:
   ```markdown
   # {Conference Name} - {Year}

   ## {Talk Title}

   **Date**: {Date of presentation}
   **Location**: {Physical location or "Virtual"}

   ### Description

   Brief description of the talk (1-2 paragraphs)

   ### Files

   - [Presentation Slides (PDF)]({filename})
   - [Additional Resources]({filename})

   ### Abstract

   The full abstract of your talk goes here.

   ### Links

   - [Conference Website]({url})
   - [Recording (if available)]({url})
   ```
4. Update the `docs/data/content.json` file to include your new talk in the `conferences` array:
   ```json
   {
     "id": "org-name-year",
     "name": "Organization Name",
     "path": "org-name",
     "year": "YYYY",
     "icon": "fas fa-icon-name",
     "description": "Brief description"
   }
   ```
5. Run `npm run build` to update the site content

### Adding a Podcast Appearance

1. Create a new directory under `/docs/podcasts/{podcast-name}/`
2. Create a README.md file with the following:
   ```markdown
   # {Podcast Name}

   ## Episode: {Episode Title}

   **Date**: {Release date}
   **Host**: {Host name}

   ### Description

   Brief description of the podcast episode and what was discussed.

   ### Links

   - [Listen on {Platform}]({url})
   - [Podcast Website]({url})

   ### Show Notes

   Include any relevant show notes or timestamps here.
   ```
3. Update the `docs/data/content.json` file to include your new podcast in the `podcasts` array

### Adding a Publication

1. For external publications, simply update the `docs/data/content.json` file to include the new publication in the `publications` array
2. For published books or book chapters, create a directory under `/docs/books/{publisher}/{book-name}/` and include relevant materials

### Adding a Television Appearance

1. Create a new directory under `/docs/television/{show-name}/`
2. Create a README.md file with details about the appearance
3. Add any screenshots, promotional materials, or links to the recording
4. Update the `docs/data/content.json` file to include your new TV appearance

## Development

### Local Development

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the content JSON: `npm run build`
4. Start the local server: `npm start`
5. Open your browser to http://localhost:8080

### Testing Locally

```bash
npm install -g serve
cd docs
serve
```

Run with the following command to serve the files with CORS enabled:

```bash
npm install -g http-server
npx http-server -p 3000 --cors
```

## License

Copyright © Ads Dawson. All rights reserved.

