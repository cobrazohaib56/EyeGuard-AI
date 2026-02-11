

# AI Theft Detection System — Frontend Dashboard

## Overview
A dark-themed security monitoring dashboard for an AI-based theft detection system. Built as a web app (React) with mock data, designed to later wrap in Electron and connect to a Python/YOLO backend.

## Design Style
- **Dark theme** with deep navy/charcoal backgrounds
- Red/amber accent colors for alerts and warnings
- Green indicators for healthy/active status
- Monospace fonts for timestamps and technical data
- Card-based layout with subtle borders and glowing status indicators

## Pages

### 1. Login / Signup Page
- Clean centered login form with email & password
- "Forgot password" link
- Company branding/logo area at top
- Dark background with subtle gradient

### 2. Dashboard (Main Hub)
- **Active Cameras widget** — count of online/offline cameras with colored status dots
- **Real-time Alerts feed** — scrollable list of recent theft detections with timestamps
- **System Health** — GPU utilization, FPS processing rate, detection accuracy (mock gauges/progress bars)
- **Recent Incidents summary** — last 5 incidents with thumbnail, camera name, and timestamp
- **Quick stats cards** — total incidents today, cameras active, alerts pending

### 3. Incident/Theft Archive Page
- Searchable table of all detected theft events
- Filters: date range picker, camera dropdown, severity level
- Each row shows: thumbnail, camera name, timestamp, severity badge, status (reviewed/pending)
- Click to expand and see larger image with incident details
- Export button (CSV mock)

### 4. Camera Management Page
- Grid/list view of all configured cameras
- Each camera card shows: name, location, status (active/inactive/error), last frame timestamp
- Add new camera button (form with name, location, RTSP URL fields)
- Edit/delete camera options
- Connection status indicator per camera

### 5. App Layout
- **Sidebar navigation** with icons for: Dashboard, Incidents, Cameras
- Collapsible sidebar with mini icon mode
- Top header bar with system status indicator, notification bell, and user avatar/menu
- Responsive layout

## Mock Data
All pages will use realistic mock data (28 cameras, sample incidents with timestamps, fake analytics) to demonstrate the full UI experience before connecting a real backend.

