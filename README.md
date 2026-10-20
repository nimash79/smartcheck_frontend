# SmartCheck — Web Frontend

The React-based web interface for **SmartCheck**, a camera-based monitoring and recognition system. The frontend communicates with the Node.js backend to provide access to the application's monitoring and management functionality.

## Overview

The SmartCheck frontend is a single-page application built with React 19 and Vite. It uses React Router for navigation, Redux Toolkit for state management, and Axios for HTTP requests.

The dependency stack also includes charting, date selection, animations, and notification components to support a data-oriented management interface.

## Features and UI Capabilities

The frontend is designed to work with the backend's management resources, including:

- People-related information.
- Camera management.
- Department and gate resources.
- Settings and configuration.
- Reports and alarm-related information.
- API-driven data loading.
- Date and calendar controls.
- Charts and data visualization.
- Toast notifications and loading indicators.
- Client-side navigation.
- Progressive Web App tooling.

The available packages support these UI capabilities; the exact screens and interactions should be confirmed in the current `src` implementation.

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based UI |
| Vite 6 | Development server and build tooling |
| React Router 7 | Client-side routing |
| Redux Toolkit | State management |
| React Redux | Redux integration |
| Axios | HTTP requests |
| Material UI | UI components |
| Bootstrap 5 | Styling and responsive layout |
| Tailwind CSS | Utility-first styling |
| Framer Motion | UI animations |
| Chart.js and react-chartjs-2 | Charts and visualizations |
| React Multi Date Picker | Date selection |
| Jalali Moment | Jalali calendar and date utilities |
| React Toastify | Toast notifications |
| Vite PWA plugin | Progressive Web App support |

## Repository Structure

```text
smartcheck_frontend/
├── public/              # Static assets
├── src/                 # React application source
├── .env.example         # Frontend environment template
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js compatible with the project dependencies.
- npm.
- A running SmartCheck backend for API-driven features.

### 1. Clone the repository

```bash
git clone https://github.com/nimash79/smartcheck_frontend.git
cd smartcheck_frontend
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure the backend URL

Create a `.env` file based on `.env.example`:

```dotenv
VITE_API_URL=http://localhost:3000
```

Change the URL to match your backend address and port.

**Important:** Vite exposes variables prefixed with `VITE_` to browser-side code. Never place passwords, private keys, or other secrets in these variables.

### 4. Start the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

### 5. Create a production build

```bash
npm run build
```

The compiled application is written to the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

## Application Architecture

```text
User
 |
 v
React Web Application
 |
 +---- React Router
 |
 +---- Redux Toolkit
 |
 +---- UI Components and Charts
 |
 v
Axios HTTP Requests
 |
 v
SmartCheck Node.js Backend
 |
 +---- People / Cameras / Gates
 |
 +---- Departments / Settings
 |
 +---- Reports / Alarms
 |
 v
Database and Python Recognition Engine
```

The frontend is responsible for rendering the user interface and sending API requests. Recognition processing and centralized application logic belong to the backend and Python component.

## Deployment

The repository includes PM2 scripts:

```bash
npm run serve
```

and:

```bash
npm run unserve
```

The `serve` script starts the Vite development server through PM2. For a conventional production deployment, build the application and serve the generated `dist/` directory through a static web server or hosting platform instead.

Configure the production `VITE_API_URL` before building, because Vite environment variables are generally embedded into the generated frontend bundle at build time.

## Development Guidelines

- Keep reusable UI elements in shared components.
- Use the existing routing conventions when adding screens.
- Keep API calls consistent and handle loading and error states.
- Avoid duplicating shared state across components.
- Validate date and calendar behavior, particularly where Jalali dates are used.
- Ensure that the deployed frontend origin is permitted by the backend's CORS policy.
- Test the production build rather than relying exclusively on the Vite development server.

## Related Repositories

- [SmartCheck Python](https://github.com/nimash79/smartcheck_python) — face recognition, human detection, and audio processing.
- [SmartCheck Backend](https://github.com/nimash79/smartcheck_backend) — REST API, application logic, and real-time integration.

## License

Review the repository's licensing information before redistribution or reuse.

## Author

**Nima Sharifinia** · [GitHub](https://github.com/nimash79)
