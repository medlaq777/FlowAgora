# FlowAgora Backend API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

## 📖 Project Overview

**FlowAgora** is a comprehensive event management platform backend built with **NestJS**. It provides a robust and scalable architecture for managing events, users, and reservations, featuring role-based access control (RBAC), PDF ticket generation, and automated status management.

### 🧠 Core Business Logic

The application is structured into domain-driven modules:

- **Auth Module** (`/auth`):
  - Handles user registration and secure login using **JWT** (JSON Web Tokens).
  - Implements **Passport** strategies for authentication.
  - Provides role-based guards for protecting endpoints.

- **Users Module** (`/users`):
  - Manages user profiles and roles (`ADMIN` vs `PARTICIPANT`).
  - Allows admins to view all users and users to view their own profiles.

- **Events Module** (`/events`):
  - **Creation & Management**: Admins can create, update, and manage events.
  - **Discovery**: Public endpoints for listing published events.
  - **Lifecycle Management**: Automated status updates (e.g., `PUBLISHED`, `COMPLETED`, `CANCELLED`).
  - **Statistics**: Admin-only endpoints for event performance analytics.

- **Reservations Module** (`/reservations`):
  - **Booking**: Authenticated users can reserve spots for events.
  - **Ticket Generation**: Generates downloadable **PDF tickets** for confirmed reservations.
  - **Status Workflow**: Manage reservation states (`PENDING`, `CONFIRMED`, `CANCELLED`).
  - **User Dashboard**: Users can view their history; admins can view by event or user.

---

## 🛠️ Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB (via [Mongoose](https://mongoosejs.com/))
- **Documentation**: Swagger (OpenAPI 3.0)
- **PDF Generation**: PDFKit
- **Validation**: class-validator & class-transformer

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas connection string)

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/medlaq777/FlowAgora.git
    cd FlowAgora/back-end
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory (or rename a sample if provided):
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/flowagora
    JWT_SECRET=your_super_secret_key
    ```

---

## 🏃‍♂️ Running the Application

### Development Mode

Runs the server with hot-reload enabled.

```bash
npm run start:dev
```

### Production Mode

Builds the application and runs the optimized production build.

```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000` (or your configured port).

---

## 📚 API Documentation

This project uses **Swagger** for interactive API documentation.

1.  Start the server (`npm run start:dev`).
2.  Navigate to **[http://localhost:3000/api](http://localhost:3000/api)** in your browser.
3.  You can explore all endpoints, view schemas, and execute requests directly from the UI.

### Key Endpoints

| Module           | Method | Endpoint                   | Description                  |
| :--------------- | :----- | :------------------------- | :--------------------------- |
| **Auth**         | `POST` | `/auth/login`              | Authenticate and receive JWT |
| **Events**       | `GET`  | `/events`                  | List all published events    |
| **Events**       | `POST` | `/events`                  | Create a new event (Admin)   |
| **Reservations** | `POST` | `/reservations`            | Book an event                |
| **Reservations** | `GET`  | `/reservations/:id/ticket` | Download PDF ticket          |

---

## 🧪 Testing

Run unit and integration tests:

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

**FlowAgora Backend** — _Empowering Event Management_
