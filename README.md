# Productivity Dashboard

A beautiful, modern productivity tool built with React, TypeScript, and Tailwind CSS. Manage your tasks, track your time, and capture your thoughts all in one place.

## Features

### 📋 Task Management
- Create, edit, and delete tasks
- Set task priorities (low, medium, high)
- Mark tasks as complete
- Filter tasks by status (all, active, completed)
- Add descriptions to tasks

### ⏱️ Time Tracker
- Start, pause, and stop timers
- Track time spent on different activities
- View today's total time
- See recent time tracking sessions
- Beautiful timer interface

### 📝 Notes
- Create and manage notes
- Rich text editing
- View creation and update timestamps
- Quick note navigation sidebar

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **LocalStorage** - Data persistence

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

The preview will be available at `http://localhost:4173`

## Deployment

The application is production-ready. The build process includes:

- ✅ TypeScript type checking
- ✅ Code minification and optimization
- ✅ Automatic code splitting and chunking
- ✅ Console log removal in production
- ✅ Error boundary for better error handling
- ✅ Optimized asset organization

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy to Static Hosting

The `dist/` folder contains all the static files needed for deployment. You can deploy to:

- **Vercel**: Connect your repository or run `vercel --prod`
- **Netlify**: Drag and drop the `dist/` folder or connect your repository
- **GitHub Pages**: Use the `dist/` folder as the source
- **AWS S3 + CloudFront**: Upload `dist/` contents to an S3 bucket
- **Any static hosting service**: Serve the `dist/` folder contents

### Production Features

- Optimized bundle sizes with code splitting
- Minified JavaScript and CSS
- Removed console logs and debuggers
- Error boundary for graceful error handling
- SEO-friendly meta tags
- Responsive design

## Data Storage

All data (tasks, time entries, notes) is stored locally in your browser's localStorage. Your data never leaves your device.

## License

MIT

