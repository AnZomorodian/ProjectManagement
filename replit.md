# Project Management Information System (PMIS)

## Overview

This is a full-stack Project Management Information System built with Express.js backend and React frontend. The application provides comprehensive project management capabilities including engineering document management, procurement tracking, task planning, and data analytics with file import functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **File Uploads**: Multer middleware for handling file uploads
- **API Design**: RESTful API with consistent error handling
- **Development**: Hot reload with Vite middleware in development

## Key Components

### Database Layer
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Centralized in `shared/schema.ts` with Zod validation
- **Tables**: Users, projects, tasks, procurement orders, engineering documents, imported files, notifications
- **Migrations**: Managed through `drizzle-kit`

### Core Entities
1. **Projects**: Enhanced project entities with objectives, stakeholders, milestones, and risk assessment
2. **Tasks**: Project-related tasks with assignments and due dates
3. **Procurement Orders**: Vendor management and order tracking
4. **Procurement Requests**: Comprehensive request system with specifications, approvals, and justifications
5. **Project Phases**: Phase-based project management with dependencies and deliverables
6. **Engineering Documents**: Document management with file storage
7. **Imported Files**: File upload tracking and processing status
8. **Users**: Basic user management with roles

### UI Components
- **Layout**: Sidebar navigation with responsive design
- **Dashboard**: Overview cards, charts, and project tables
- **Forms**: Consistent form handling with validation
- **File Upload**: Drag-and-drop interface with progress tracking
- **Charts**: Recharts integration for data visualization

## Data Flow

1. **Client Requests**: React components use TanStack Query for API calls
2. **API Layer**: Express routes handle CRUD operations
3. **Data Layer**: Drizzle ORM manages database interactions
4. **Storage**: PostgreSQL stores all application data
5. **File Handling**: Multer processes uploads with size and type validation

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Connection**: Environment variable `DATABASE_URL` required

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Recharts**: Chart visualization
- **React Dropzone**: File upload interface

### Development Tools
- **Replit Integration**: Development environment optimizations
- **ESBuild**: Production bundling
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development
- **Command**: `npm run dev`
- **Features**: Hot reload, Vite middleware, development banner
- **Database**: Requires PostgreSQL connection

### Production
- **Build Process**: 
  1. Frontend: Vite builds to `dist/public`
  2. Backend: ESBuild bundles server to `dist/index.js`
- **Start Command**: `npm start`
- **Static Files**: Served from built frontend in production

### Configuration
- **Environment Variables**: `DATABASE_URL` for database connection
- **File Storage**: Local uploads directory (production may need cloud storage)
- **Sessions**: PostgreSQL-backed sessions with `connect-pg-simple`

## Key Features

1. **Comprehensive Planning Hub**: Enhanced first-phase PMIS with project creation wizards and procurement management
2. **Step-by-Step Workflows**: Project creation wizard with objectives, stakeholders, and risk assessment
3. **Procurement Request System**: Full procurement workflow with specifications, vendor preferences, and approval tracking  
4. **Classic Enterprise Design**: Professional styling with section-specific theming for planning, engineering, and procurement
5. **File Import System**: CSV/Excel processing with status tracking
6. **Responsive UI**: Mobile-friendly design with adaptive layouts
7. **Data Visualization**: Interactive charts and progress tracking
8. **Form Validation**: Client and server-side validation with Zod
9. **Type Safety**: Full TypeScript coverage with shared schemas

## Recent Changes (July 20, 2025)

- Enhanced planning section as the comprehensive first phase of PMIS
- Implemented step-by-step project creation wizard with objectives, stakeholders, and risk assessment
- Added comprehensive procurement request system with specifications and vendor management
- Created classic enterprise styling with gradient headers and professional design
- Extended database schema with procurement requests and project phases
- Added full API routes and storage methods for new entities
- Designed executive dashboard with key performance indicators