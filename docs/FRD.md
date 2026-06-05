# Functional Requirements Document (FRD)

## Product Name

**Chronicle**
(Historical Timeline Builder for UPSC/PSC Aspirants)

---

# 1. Product Vision

Chronicle enables UPSC/PSC aspirants, teachers, and history enthusiasts to create, organize, visualize, and share historical timelines through an interactive timeline builder.

The application combines:

* Timeline management
* Historical event organization
* Visual chronology analysis
* Community-contributed timeline repository

without requiring software installation or user accounts for regular use.

---

# 2. Target Users

### Primary

UPSC Aspirants

### Secondary

PSC Aspirants

### Tertiary

Teachers

History Researchers

Content Creators

---

# 3. User Types

## Guest User

No login required.

Capabilities:

* View prebuilt timelines
* Create timelines
* Edit timelines
* Export timelines
* Import timelines

Storage:

```text
Browser Local Storage
```

---

## Contributor

Authenticated through Firebase.

Capabilities:

* All Guest capabilities
* Submit timelines to community repository
* Update own submitted timelines

---

## Admin

Manual contributor management.

Capabilities:

* Approve contributors
* Review submissions
* Manage official timelines

---

# 4. Navigation Structure

```text
/
├── Home
│
├── /timelines
│   ├── Prebuilt
│   └── My Timelines
│
├── /timeline/:id
│
├── /contributor
│
└── /about
```

---

# 5. Home Screen

## Purpose

Introduce application.

### Content

Hero Section

```text
Build and Explore Historical Timelines
```

Subtext

```text
Create interactive timelines for UPSC, PSC and history studies.
```

Primary CTA

```text
Explore Timelines
```

Destination

```text
/timelines
```

---

## Additional Sections

### Features

* Visual timeline graph
* Event grouping
* Markdown notes
* JSON import/export
* HTML export

### Contributor Section

```text
Want to contribute timelines?

Connect via LinkedIn or Email.
```

Buttons:

* LinkedIn
* Email

---

# 6. Timeline Listing Screen

Route

```text
/timelines
```

---

## Tabs

### Prebuilt

Loaded from GitHub repository.

Source:

```text
repo/timelines/*.json
```

Card Layout

```text
Title
Description
Contributor
Event Count
Category Tags
Last Updated
```

---

### My Timelines

Loaded from browser storage.

Card Layout

```text
Title
Event Count
Created Date
Updated Date
```

Actions

* Open
* Duplicate
* Export
* Delete

---

# 7. Timeline Detail Screen

Route

```text
/timeline/:id
```

Layout

```text
+--------------------------------+
| Toolbar                        |
+--------------------------------+

+--------------------------------+
| Event Table                    |
+--------------------------------+

+--------------------------------+
| Timeline Graph                 |
+--------------------------------+
```

---

# 8. Event Table

## Columns

| Column     | Description     |
| ---------- | --------------- |
| Event Name | User entered    |
| Start Date | Year required   |
| End Date   | Optional        |
| Era        | BC/AD           |
| Duration   | Auto-calculated |
| Group      | Optional        |
| Actions    | Edit/Delete     |

---

## Date Structure

```json
{
  "year": 322,
  "month": 1,
  "day": 1,
  "era": "BC"
}
```

Only year required.

---

## Internal Representation

BC

```text
500 BC -> -500
```

AD

```text
2026 AD -> 2026
```

---

## New Event Row

Last row always visible.

Contains:

```text
[Name]
[Start]
[End]
[BC/AD]
[Add]
```

Adding automatically creates row.

---

## Sorting

Supported:

### By Start Date

Ascending

Descending

### By Duration

Ascending

Descending

---

## Group Sorting Rule

If grouped:

Sorting occurs only at group level.

Example:

```text
Group A
 Event 1
 Event 2

Group B
 Event 3
 Event 4
```

Entire group moves together.

---

# 9. Timeline Graph

Technology

```text
SVG Renderer
```

---

## Default Behavior

Show all events in one screen.

Auto-fit timeline.

---

## Controls

Zoom In

Zoom Out

Reset Zoom

Fit Timeline

---

## Bar Display

Each event:

```text
|------------|
Mauryan Empire
```

Displays:

* Event Name
* Optional Icon

---

## Click Behavior

Open Event Details Modal.

---

# 10. Event Details Modal

Tabs

## Notes

Rich Text Editor

Supports:

* Bold
* Italic
* Underline
* Lists
* Headings
* Links

Stored as Markdown.

---

## Resources

Resource Types

### Website

```json
{
  "type": "website",
  "url": ""
}
```

### Image

```json
{
  "type": "image",
  "url": ""
}
```

### YouTube

```json
{
  "type": "youtube",
  "url": ""
}
```

---

Each resource may be marked:

```json
"isIcon": true
```

Only one icon allowed.

---

# 11. Event Grouping

Selection

Checkbox per row.

Toolbar:

```text
Group Selected
Ungroup
```

---

## Group Metadata

```json
{
  "id": "group-1",
  "name": "Mauryan Dynasty",
  "color": "#F4C430"
}
```

---

## Table Display

Shows:

```text
[ Mauryan Dynasty ]
```

tag on every event.

---

## Graph Display

Background lane color:

```text
██████████
```

representing group.

---

## Single Line Mode

Toggle:

```text
Display grouped events in one row
```

Behavior:

Events in same group share timeline lane.

---

# 12. Local Storage

Storage Key

```text
chronicle.timelines
```

---

Structure

```json
{
  "timelines": []
}
```

---

# 13. Timeline JSON Schema

```json
{
  "id": "uuid",
  "name": "Ancient India",
  "description": "",
  "createdAt": "",
  "updatedAt": "",
  "events": [],
  "groups": []
}
```

---

# 14. Import

Supported

```text
.json
```

Validation:

* Schema validation
* Duplicate detection

---

# 15. Export JSON

Export current timeline.

Produces:

```text
timeline-name.json
```

---

# 16. Export HTML

Produces:

```text
timeline-name.html
```

Single file.

Contains:

* HTML
* CSS
* JavaScript
* Timeline Data

Embedded.

---

## Read-Only Mode

Allowed

✅ Zoom

✅ Open Notes

✅ Open Resources

✅ Collapse Groups

---

Blocked

❌ Add Event

❌ Delete Event

❌ Edit Event

---

# 17. Prebuilt Timeline Repository

GitHub Structure

```text
repo/
│
├── timelines/
│
│   ├── ancient-india-a12d9.json
│   ├── ancient-india-c55ff.json
│   ├── mughal-era-912de.json
│
├── contributors/
│   └── contributors.json
│
└── metadata/
    └── index.json
```

---

# 18. Contributor Workflow

## Authentication

Firebase Authentication

Supported:

* Google Login

---

## Approval

Contributor requests access.

Admin manually adds email.

---

## Publish Flow

```text
Login
↓
Create Timeline
↓
Submit
↓
GitHub Pull Request / Commit
↓
Review
↓
Published
```

---

# 19. GitHub Sync Architecture

```text
React App
    ↓
Netlify Function
    ↓
GitHub API
    ↓
Repository
```

---

Responsibilities

Netlify Function:

* Verify Firebase token
* Check contributor permission
* Validate schema
* Commit JSON
* Update index

---

# 20. Performance Requirements

Timeline Size

```text
500 Events
```

Maximum supported.

---

Load Time

< 2 seconds

---

Zoom FPS

Target:

60 FPS

---

# 21. Accessibility

Keyboard Navigation

Screen Reader Labels

Color-Blind Safe Group Colors

WCAG AA Contrast

---

# 22. MVP Scope

Included

✅ Timeline Creation

✅ Timeline Editing

✅ Timeline Graph

✅ Grouping

✅ Notes

✅ Resources

✅ Local Storage

✅ JSON Import

✅ JSON Export

✅ HTML Export

✅ Firebase Contributor Login

✅ GitHub Sync

✅ Prebuilt Timelines

---

# 23. Future Roadmap (Post-MVP)

### Version 2

* Historical map integration
* Timeline comparison mode
* AI-generated timeline summaries
* AI-assisted event extraction
* Search across all timelines
* Timeline sharing URL

### Version 3

* Collaborative editing
* Timeline quizzes for UPSC revision
* Spaced repetition integration
* Offline PWA support

This scope is well-sized for a React + TypeScript application and can realistically support 500-event UPSC timelines while keeping all personal data local unless the user explicitly publishes a timeline.
