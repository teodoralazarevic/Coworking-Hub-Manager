# Coworking Hub Manager

## Project Overview

Coworking Hub Manager is a full-stack web application. The system provides a platform for managing, searching, and reserving coworking spaces, offices, and meeting rooms within a shared workspace network. The application support three types od users: memebers, space managers, and system administrators, each with different roles and permissions.

## Technologies Used

- **Frontend:** Angular 20
- **Backend:** Node.js (Express.js)
- **Database:** MongoDB
- **File Uploads:** Multer (for profile and space images)
- **Charts:** ngx-charts / ng2-charts
- **Maps:** Leaflet 

---

## User Roles

### 1. Member
- User registration and login
- Profile management (personal data and profile picture)
- Search and filter coworking spaces
- Make and cancel reservations
- Leave likes, dislikes, and comments (after using a space)
- View reservation history

### 2. Space Manager
- Manage company profile and coworking spaces
- Create and update spaces (offices, desks, meeting rooms)
- Upload configuration via JSON file
- Manage reservations and confirm/no-show status
- Generate monthly PDF reports
- Interactive calendar with drag-and-drop scheduling

### 3. Administrator
- Approve or reject user registration requests
- Approve newly created coworking spaces
- Manage all users (view, update, delete)
- View analytics and statistics (charts for popularity and revenue)

---

## Authentication & Security

- Secure login system using JWT tokens
- Passwords are hashed before storing in the database
- Password policy enforcement (8–12 characters, uppercase, number, special character)
- Password reset with time-limited tokens (30 minutes)
- Role-based access control (RBAC)

---

## Core Features

### Space Search
- Search by name and city
- Multi-city filtering
- Sorting by name or city
- Dynamic results table with details view

### Reservation System
- Time-based reservations (daily scheduling)
- Availability calendar per space/room
- Conflict detection for overlapping bookings

### Reviews & Feedback
- Like / dislike system
- Comment system restricted to users with valid reservations
- Last 10 comments displayed per space

### Space Details
- Detailed view with images gallery
- Location map integration
- Company and manager information
- Likes, dislikes, and reviews

---

## Admin Analytics

- Most popular coworking spaces
- Revenue statistics per space
- User activity tracking
- Visual charts using ngx-charts / ng2-charts

---

## File Upload System

- Profile images (100x100 to 300x300 px)
- Space image galleries (up to 5 images)
- JPEG/PNG support
- Default images for users without uploads

---

## PDF Reporting

Managers can generate monthly reports containing:
- Occupancy rates
- Reservation statistics
- Revenue summaries
