# Backend Engineering Challenge 🚀

Welcome to my Backend Track submission! This repository contains my solutions for the three core backend engineering problems. I've designed these systems with a focus on clean architecture, readable code, and scalable design principles.

## 📌 Project Overview

This repository is split into three independent backend projects. Each focuses on a specific challenge, built using **Node.js** and **Express**, adhering to the rule of implementing custom algorithms without relying on heavy external libraries.

1.  **[Logging Middleware](./logging_middleware/)**
    *   A custom Express middleware that intercepts incoming HTTP requests, logs essential metadata (method, URL, timestamp, response time), and handles formatting. Designed to be lightweight and easy to plug into any existing Express application.
2.  **[Vehicle Maintenance Scheduler](./vehicle_maintence_scheduler/)**
    *   A backend service logic designed to calculate and schedule maintenance windows for a fleet of vehicles based on custom rules and usage metrics. Built with pure logic and no external scheduling libraries to demonstrate algorithmic thinking.
3.  **[Notification System Design & App](./notification_app_be/)**
    *   *System Design:* Check out [`notification_system_design.md`](./notification_system_design.md) for the complete architecture and data flow diagrams of a scalable, decoupled notification service.
    *   *Implementation:* The `notification_app_be` folder contains the backend implementation of the API that handles queuing and dispatching these notifications.

## 🛠️ Tech Stack & Architecture

- **Runtime:** Node.js
- **Framework:** Express.js
- **Design Pattern:** Modular, separation of concerns (Routes, Controllers, Services).
- **Documentation:** Markdown with Mermaid.js for diagrams.

*Note: As per the challenge guidelines, I've avoided using external utility libraries (like lodash, moment.js) for core algorithms, ensuring the logic is built from scratch and easy to evaluate.*

## 🚀 How to Run Locally

Since each solution is self-contained, you can run them individually. 

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd RA2311030020131
   ```

2. **Navigate to the specific task (e.g., Logging Middleware):**
   ```bash
   cd logging_middleware
   ```

3. **Install dependencies and start the server:**
   ```bash
   npm install
   npm run dev
   ```

## 📸 Testing & Verification

I've rigorously tested the APIs using Postman/Insomnia. You will find screenshots capturing the **request body**, **response payload**, and **response times** within each specific project's documentation to verify performance and correctness.

---

*Thank you for reviewing my submission. Feel free to reach out if you have any questions about my architectural choices or code structure!*
