# Chalkbox

A growing collection of lightweight web tools for teachers.

## Live site

- Chalkbox: https://www.brent-clark.com/teacher-tools/
- Random Student Picker: https://www.brent-clark.com/teacher-tools/random-student-picker/
- Seating Plan: https://www.brent-clark.com/teacher-tools/seating-plan/
- Classroom Timers: https://www.brent-clark.com/teacher-tools/classroom-timers/

This repository is the development/source home for the Chalkbox collection. Production copies are published through the Cloudflare-connected `bclar133/brent-clark` repository.

## Structure

```text
TeacherTools/
├── assets/
│   └── css/
│       └── teacher-tools.css
└── tools/
    ├── random-student-picker/
    ├── seating-plan/
    └── classroom-timers/
```

Shared Chalkbox styling belongs in `assets/`; each tool keeps its own app-specific HTML, CSS, and JavaScript under `tools/`.

## Current tools

### Random Student Picker

Animated picker modes, random groups, roster cleaning, no-repeat/whole-class draws, sounds, winner celebrations, saved classes, dark mode, presentation mode and responsive phone layouts.

### Seating Plan

Flexible classroom layouts with draggable students and room fixtures, auto-arranging, colour coding and locally saved plans.

### Classroom Timers

Visual countdowns, stopwatch, classroom clocks, work/rest intervals, focus sessions and multi-stage lesson schedules.
