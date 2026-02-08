# FlowAgora Backend API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

## 📖 Project Overview

**FlowAgora** is a comprehensive event management platform backend built with **NestJS**. It provides a robust and scalable architecture for managing events, users, and reservations, featuring role-based access control (RBAC), PDF ticket generation, and automated status management.

### 🧠 Core Business Logic

The application is structured into domain-driven modules that handle specific business flows:

### 📂 Project Structure

```bash
src/
├── common/
│   ├── decorators/
│   ├── filters/
│   └── guards/
├── database/
├── modules/
│   ├── auth/
│   ├── events/
│   ├── reservations/
│   └── users/
├── app.module.ts
└── main.ts
```

#### 1. Auth & Users (Identity Management)

- **Registration**: New users can register as `PARTICIPANT` or `ADMIN`.
- **Authentication**: Secure login using JWT strategies. A valid token is required for most operations.
- **Profile Management**: Users can view their own profile details.
- **RBAC**: Strict separation between Admin and Participant capabilities.

#### 2. Event Lifecycle

Events go through a defined lifecycle managed by Admins:

- **Draft**: Initial creation state.
- **Published**: Visible to participants for booking.
- **Completed/Cancelled**: Terminal states.
- **Stats**: Admins can track capacity, reservation counts, and fill rates.

#### 3. Reservations & Ticketing

- **Booking Flow**: Participants can reserve spots in `PUBLISHED` events.
- **Validation**: Checks for event capacity and availability ensuring no overbooking.
- **PDF Tickets**: Upon successful reservation, a unique PDF ticket is generated containing event details and user information.
- **Cancellation**: Participants can cancel their reservations, freeing up spots for others.

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
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas connection string)

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
    Create a `.env` file in the root directory. You can copy the structure below:

    ```env
    # Application Port
    PORT=3000

    # Database Connection
    MONGODB_URI=mongodb://localhost:27017/flowagora

    # Security
    JWT_SECRET=your_super_secret_key_change_this
    ```

---

## 🏃‍♂️ Running the Application

### Development Mode

Runs the server with hot-reload enabled. Ideal for local development.

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
2.  Navigate to **[http://localhost:3000/api](http://localhost:3000/api)**.
3.  You can explore all endpoints, view schemas, and execute requests directly.

### Key Endpoints

#### Authentication & Users

| Method | Endpoint         | Description                                     | Auth Required |
| :----- | :--------------- | :---------------------------------------------- | :------------ |
| `POST` | `/users`         | **Register** a new user (Participant/Admin)     | ❌ No         |
| `POST` | `/auth/login`    | **Login** to receive access token               | ❌ No         |
| `GET`  | `/users/profile` | **Get Profile** of the currently logged-in user | ✅ Yes        |

#### Events & Reservations

| Method | Endpoint                   | Description               | Auth Required  |
| :----- | :------------------------- | :------------------------ | :------------- |
| `GET`  | `/events`                  | List all published events | ❌ No          |
| `POST` | `/events`                  | Create a new event        | ✅ Yes (Admin) |
| `POST` | `/reservations`            | Book an event             | ✅ Yes         |
| `GET`  | `/reservations/:id/ticket` | Download PDF ticket       | ✅ Yes         |

---

## 🧪 Testing

We rely on Jest for our testing strategy, covering both unit logic and full end-to-end flows.

### 1. Unit Tests

Run unit tests to verify individual service methods and business logic isolation.

```bash
npm run test
```

### 2. End-to-End (E2E) Tests

E2E tests simulate real user scenarios against a running application instance (using a test database/module).

```bash
npm run test:e2e
```

**What is tested?**

- **Admin Flow (`admin-flow.e2e-spec.ts`)**:
  - Admin registration & login.
  - Creating and updating events.
  - Viewing event statistics.
- **Participant Flow (`participant-flow.e2e-spec.ts`)**:
  - Participant registration & login.
  - Browsing available events.
  - Making a reservation.
  - Viewing personal reservation history.
  - Cancelling a reservation.

### 3. Test Coverage

Generate a coverage report to see code utilization.

```bash
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
