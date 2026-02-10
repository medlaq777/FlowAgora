# FlowAgora 🚀

**A full-stack, industrial-grade event management and reservation system.**

This project addresses the challenges of manual event management (spreadsheets, emails, overbooking) by providing a centralized, role-based web application. Built with **NestJS**, **Next.js**, and **Docker**, it focuses on security, scalability, and automated CI/CD workflows.

---

## 📋 Table of Contents

- [FlowAgora 🚀](#flowagora-)
  - [📋 Table of Contents](#-table-of-contents)
  - [🎯 Context \& Goals](#-context--goals)
  - [✨ Features](#-features)
    - [🔑 Roles \& Permissions](#-roles--permissions)
  - [📊 JIRA Roadmap \& Planning](#-jira-roadmap--planning)
    - [Key Epics](#key-epics)
  - [⚖️ Business Rules](#️-business-rules)
    - [Event Lifecycle](#event-lifecycle)
    - [Reservation Rules](#reservation-rules)
  - [🛠 Tech Stack](#-tech-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [⚙️ CI/CD Pipeline (GitHub Actions)](#️-cicd-pipeline-github-actions)
  - [📝 Author](#-author)

---

## 🎯 Context & Goals

Managing workshops, training sessions, and internal meetings manually often leads to errors like overbooking and lack of real-time visibility. This application aims to:

- **Centralize** all event and participant information.
- **Automate** reservation workflows (Pending -> Confirmed).
- **Enforce** strict role-based access control (Admin vs. Participant).
- **Ensure** data integrity through rigorous validation and industrialization standards.

---

## ✨ Features

### 🔑 Roles & Permissions

| Feature | Admin | Participant |
| :--- | :---: | :---: |
| Create/Edit/Publish Events | ✅ | ❌ |
| View Public Catalog (SSR) | ✅ | ✅ |
| Manage Reservations (Confirm/Refuse) | ✅ | ❌ |
| Request a Booking | ❌ | ✅ |
| Download PDF Ticket | ❌ | ✅ (If Confirmed) |
| Access Stats Dashboard | ✅ | ❌ |

## 📊 JIRA Roadmap & Planning

The project is organized into 14 Epics to ensure full coverage of the technical and functional requirements.

### Key Epics

1. **Project Management:** JIRA/GitHub integration & automation rules.
2. **Auth System:** JWT implementation & Role-based guards (Admin/Participant).
3. **Event Engine:** CRUD operations and lifecycle management (Drft/Published/Canceled).
4. **Booking Logic:** Capacity validation, duplicate preention, and PDF ticket generation.
5. **Front-end Architecture:** Hybrid rendering (SSR for SEO, CSRfor Dashboards).
6. **Quality Assurance:** Mandatory Unit and E2E testing for bot layers.
7. **DevOps:** Dockerization and GitHub Actions CI/CD pipeline.

## ⚖️ Business Rules

### Event Lifecycle

- **Status:** `DRAFT`, `PUBLISHED`, `CANCELED`.
- Only `PUBLISHED` events are visible to participants.

### Reservation Rules

- **Status:** `PENDING`, `CONFIRMED`, `REFUSED`, `CANCELED`.
- A participant cannot book:
  - An event that is canceled or not yet published.
  - A full event (capacity limit reached).
  - The same event twice (active reservation check).
- **PDF Generation:** Only available for reservations with a `CONFIRMED` status.

---

## 🛠 Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, UseContext.
- **Backend:** NestJS, TypeScript, MongoDB (Mongoose).
- **Testing:** Jest, SonarQube, React Testing Library.
- **Infrastructure:** Docker, Docker Compose, GitHub Actions (CI/CD).

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

### Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/medlaq777/FlowAgora.git

2. **Setup Environment:**

    Create a `.env` file in both `FrontEnd/` and `BackEnd/` directories. Use the provided `.env.example` files as templates for required variables.

---

## 🚀 Launch with Docker

```bash
docker-compose up --build
```

This command will build and start all services defined in the `docker-compose.yml` file.

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

The project includes a mandatory pipeline that triggers on every `push` and `pull_request`:

- **Install/Cache:** Fast dependency management.
- **Lint:** Static code analysis.
- **Tests:** Runs all unit and E2E tests.
- **Build:** Verifies that both applications compile.

> ⚠️ Any failure in the steps above will block the merge to ensure production stability.

---

## 📝 Author

Developed as part of the YOUCODE | UM6P curriculum (2024-2026).
