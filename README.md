# Company Management System

A web-based internal management platform designed to streamline company operations, project tracking, team collaboration, and employee management.

## Features

### Dashboard

Provides an overview of key business metrics, project status, and team activities.

### Analytics

Displays reports and analytical insights to support decision-making and performance monitoring.

### Project Management

Manage client projects, track progress, assign tasks, and monitor project milestones.

### Kanban Board

Visual task management system that helps teams organize and track workflows efficiently.

### Leave Management

Submit, review, and approve employee leave requests.

### Overtime Management

Record and manage overtime requests and working hours.

### Team Management

Manage employee information, roles, departments, and team structures.

### Messaging

Internal communication platform for team collaboration and notifications.

### Calendar

Track meetings, events, deadlines, and company activities.

### File Management

Upload, organize, and share documents securely within the organization.

### Settings

Configure user preferences and system settings.

---

## Technology Stack

### Frontend

- React
- React Router
- JavaScript / TypeScript
- HTML5
- CSS3

### Backend

- Python
- REST API

---

## Project Structure

```text
project/
├── frontend/              # React application
│   ├── src/               # Components, pages, services, hooks
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── backend/               # Python backend service
│   ├── app/               # Application modules
│   ├── requirements.txt   # Python dependencies
│   └── main.py            # Application entry point
│
├── .gitignore
└── README.md
```

---

## Available Routes

| Route      | Description         |
| ---------- | ------------------- |
| /dashboard | Dashboard           |
| /analytics | Analytics           |
| /projects  | Project Management  |
| /kanban    | Kanban Board        |
| /leave     | Leave Management    |
| /overtime  | Overtime Management |
| /team      | Team Management     |
| /messages  | Internal Messaging  |
| /calendar  | Calendar            |
| /files     | File Management     |
| /settings  | System Settings     |

---

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

---

## Build for Production

```bash
cd frontend
npm run build
```

---

## Purpose

This system is developed to improve operational efficiency by providing a centralized platform for project management, employee administration, internal communication, and business reporting.

## License

This project is proprietary and intended for internal company use only.
