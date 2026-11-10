# Secure Note-Taking Application — Frontend

Modern, responsive frontend built with **React.js** and **Material UI (MUI)** for the Secure Note-Taking Platform.

## Features
- **Design System**: Material UI (MUI) components with a custom theme and Plus Jakarta Sans typography.
- **Authentication**: JWT token storage, automatic Axios authorization injection, and quick demo login chips.
- **Role-Based Views**:
  - **Standard User**: Personal notes CRUD with dialogs, search filter, and pagination.
  - **Administrator**: Management console with system user table, cascade delete, and all-notes monitor.
- **Interactive MongoDB Aggregations**:
  - **Scenario 1**: Group users by interests array with user count badges.
  - **Scenario 2**: Real-time `$lookup` join of target user profiles and their public posts.
- **Public Posts Feed**: Community feed with indexed pagination.

## Live Deployment
- **Live Frontend Application**: [http://187.53.142.30:5000](http://187.53.142.30:5000)
- **Live Backend API**: [http://187.53.142.30:5000/api](http://187.53.142.30:5000/api)
- **Backend GitHub Repository**: [https://github.com/mdfaisalahmed025/secure-notes-backend](https://github.com/mdfaisalahmed025/secure-notes-backend)

## Getting Started Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Production build**:
   ```bash
   npm run build
   ```
