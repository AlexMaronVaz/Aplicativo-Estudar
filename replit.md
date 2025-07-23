# Replit.md

## Overview

This is a full-stack React application built with a TypeScript Express backend and React frontend. The application is a topic management system that allows users to create, view, and delete topics in Portuguese. It uses a modern tech stack with Drizzle ORM for database operations, shadcn/ui for UI components, and TanStack Query for state management.

## Recent Changes (January 2025)

### v3 - Simplified to File-Only Storage (FINAL VERSION)
- **Major Change**: Completely removed PostgreSQL and Drizzle ORM
- **New Architecture**: 100% file-based storage using JSON format
- **Benefits**:
  - Zero database configuration required
  - Faster and simpler Vercel deployment
  - Consistent behavior between local and production
  - Timestamp-based IDs for guaranteed uniqueness
  - Enhanced debugging with detailed logs
- **Storage Format**: Each line in topics.txt is a JSON object: `{"id":timestamp,"text":"content"}`
- **Backward Compatibility**: Handles both old plain text and new JSON formats

## User Preferences

Preferred communication style: Simple, everyday language.
Deployment preference: Free hosting solutions, specifically Vercel for permanent public access.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (using Neon serverless)
- **API Style**: RESTful API endpoints
- **Session Management**: Uses connect-pg-simple for PostgreSQL session storage

### Monorepo Structure
The application follows a monorepo pattern with three main directories:
- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared TypeScript schemas and types

## Key Components

### Database Schema
- **Topics Table**: Simple table with `id` (serial primary key) and `text` (required text field)
- **Validation**: Zod schemas for runtime validation with 1-500 character limits for topic text

### Storage Layer
- **FileStorage**: Primary and only storage implementation
- **Format**: JSON objects stored line-by-line in topics.txt
- **Interface**: IStorage interface maintained for future extensibility
- **No Database**: Completely removed PostgreSQL, Drizzle, and all database dependencies

### API Endpoints
- `GET /api/topics` - Retrieve all topics
- `POST /api/topics` - Create a new topic
- `DELETE /api/topics/:id` - Delete a topic by ID

### Frontend Pages
- **Home Page**: Main interface for viewing, creating, and deleting topics
- **404 Page**: Not found page for undefined routes

### UI Components
- Comprehensive shadcn/ui component library including forms, buttons, cards, dialogs, and more
- Custom toast notifications for user feedback
- Responsive design with mobile considerations

## Data Flow

1. **Topic Creation**: User submits form → Frontend validates → API call to POST /api/topics → Backend validates with Zod → Storage layer saves → Query invalidation → UI updates
2. **Topic Retrieval**: Page loads → TanStack Query fetches from GET /api/topics → Storage layer retrieves → Data displayed in UI
3. **Topic Deletion**: User clicks delete → API call to DELETE /api/topics/:id → Storage layer removes → Query invalidation → UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **wouter**: Lightweight React router
- **zod**: Schema validation library

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **TypeScript**: Static typing throughout the stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Build Process
1. Frontend builds to `dist/public` using Vite
2. Backend bundles to `dist/index.js` using ESBuild
3. Shared schemas are accessible to both frontend and backend

### Environment Configuration
- `NODE_ENV`: Controls development vs production behavior
- `DATABASE_URL`: PostgreSQL connection string (required for database operations)
- Development includes Vite dev server with HMR
- Production serves static files from Express

### Development vs Production
- **Development**: Vite dev server with middleware mode, file-based storage
- **Production**: Vercel serverless functions with static React build
- Hot module replacement and error overlays in development
- Request logging middleware for API debugging

### Database Setup
- File-based storage using .txt files for persistence
- Schema defined in `./shared/schema.ts` with Zod validation
- Storage interface allows easy switching between implementations
- Vercel functions use `/tmp` directory for file storage

### Deployment Configuration
- **Vercel Setup**: `vercel.json` configured for serverless deployment
- **API Functions**: Separate serverless functions in `api/` directory
- **Build Process**: `vite build` generates static frontend assets
- **Free Hosting**: Configured for Vercel's free tier with persistent file storage