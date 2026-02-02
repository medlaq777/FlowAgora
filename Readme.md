# FlowAgora 🚀

**A full-stack, industrial-grade event management and reservation system.**

This project addresses the challenges of manual event management (spreadsheets, emails, overbooking) by providing a centralized, role-based web application. Built with **NestJS**, **Next.js**, and **Docker**, it focuses on security, scalability, and automated CI/CD workflows.

---

## 📋 Table of Contents

* [Context & Goals](#-context--goals)
* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Business Rules](#️-business-rules)
* [Project Management (JIRA)](#-project-management-jira)
* [Getting Started](#-getting-started)
* [CI/CD Pipeline](#️-cicd-pipeline-github-actions)

---

## 🎯 Context & Goals

Managing workshops, training sessions, and internal meetings manually often leads to errors like overbooking and lack of real-time visibility. This application aims to:

* **Centralize** all event and participant information.
* **Automate** reservation workflows (Pending -> Confirmed).
* **Enforce** strict role-based access control (Admin vs. Participant).
* **Ensure** data integrity through rigorous validation and industrialization standards.

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

### 🛠 Technical Highlights

* **Backend:** Modular NestJS architecture with JWT Authentication and DTO validation.
* **Frontend:** Next.js with Hybrid Rendering (SSR for SEO/Public pages, CSR for Dashboards).
* **Testing:** Comprehensive Unit and E2E testing for both Front and Back ends.
* **DevOps:** Fully containerized environment using Docker.

---

## ⚖️ Business Rules

### Event Lifecycle

* **Status:** `DRAFT`, `PUBLISHED`, `CANCELED`.
* Only `PUBLISHED` events are visible to participants.

### Reservation Rules

* **Status:** `PENDING`, `CONFIRMED`, `REFUSED`, `CANCELED`.
* A participant cannot book:
  * An event that is canceled or not yet published.
  * A full event (capacity limit reached).
  * The same event twice (active reservation check).
* **PDF Generation:** Only available for reservations with a `CONFIRMED` status.

---

## 🛠 Tech Stack

* **Frontend:** Next.js, TypeScript, Tailwind CSS, Redux.
* **Backend:** NestJS, TypeScript, MongoDB (Mongoose).
* **Testing:** Jest, SonarQube, React Testing Library.
* **Infrastructure:** Docker, Docker Compose, GitHub Actions (CI/CD).

---

## 📊 Project Management (JIRA)

This project follows a strict Agile methodology:

* **Hierarchy:** Epics -> User Stories -> Tasks -> Sub-tasks.
* **Integration:** GitHub is linked to JIRA.
* **Automation:** Moving a task to "Done" automatically via PR Merges.
* **Traceability:** Every commit message must include the JIRA ticket reference (e.g., `feat: [SC2-15] add jwt strategy`).

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* Docker & Docker Compose

### Installation

1. **Clone the repo:**

   ```bash
   git clone [https://github.com/medlaq777/FlowAgora.git](https://github.com/medlaq777/FlowAgora.git)

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

* **Install/Cache:** Fast dependency management.
* **Lint:** Static code analysis.
* **Tests:** Runs all unit and E2E tests.
* **Build:** Verifies that both applications compile.

> ⚠️ Any failure in the steps above will block the merge to ensure production stability.

---

## 📝 Author

Developed as part of a professional training project focusing on software quality and industrialization.
