# Teacher Tools

A growing collection of lightweight web tools for teachers.

## Live site

- Teacher Tools: https://www.brent-clark.com/teacher-tools/
- Random Student Picker: https://www.brent-clark.com/teacher-tools/random-student-picker/

This repository is the development/source home for the Teacher Tools collection. Production copies are published through the Cloudflare-connected `bclar133/brent-clark` repository.

## Structure

```text
TeacherTools/
├── assets/
│   └── css/
│       └── teacher-tools.css
└── tools/
    └── random-student-picker/
        ├── index.html
        ├── styles.css
        ├── app.js
        └── README.md
```

Shared Teacher Tools styling belongs in `assets/`; each tool keeps its own app-specific HTML, CSS, and JavaScript under `tools/`.

## Current tool

### Random Student Picker V2

The first Teacher Tool includes nine animated picker modes, random groups, a 28-student roster limit, smart school-list name cleaning, no-repeat/whole-class draws, sounds, winner celebrations, saved classes, dark mode, presentation mode and responsive phone layouts.
