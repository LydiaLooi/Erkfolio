# Erkfolio

> A website to showcase my art and serve as a portfolio >> https://www.erkfir.com <<

This project created was because...
- I wanted an art portfolio,
- I wanted to learn new technologies (React, Next, Firebase),
- and it might encourage me to draw more.

## Features
- Home page to feature artworks that are "pinned" (using the "pinned" attribute)
- Categorised gallery page based on artwork tags ("digital art", "traditional art") or the misc. attribute "dump"
- An admin dashboard that uses Google sign-in
- Upload from the dashboard, edit, and delete artworks from the gallery


## Technical Stuff
### Running the Application
- In Development with fast reloading: `npm run dev`
- Build and start the application: `npm run build` then `npm run start`

#### Environment Variables
Minimum required `.env`

```
FIREBASE_API_KEY="Insert Firebase API key here"
LOG_LEVEL="debug"
ADMIN_UUID="Insert Firebase UUID of admin user"

MAX_HEIGHT=800
MAX_WIDTH=1000

ART_COLLECTION="art"
TAG_COLLECTION="filters"
PROJECT_COLLECTION="project"

DIGITAL_GALLERY_TAG="digital art"
TRADITIONAL_GALLERY_TAG="traditional art"
```

### Technologies Used
- Next
- React
- Firebase