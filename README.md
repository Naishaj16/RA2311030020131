# Backend Engineering Challenge 🚀

Welcome to my Backend Track submission! This repository contains my solutions for the three core backend engineering problems. I've designed these systems with a focus on clean architecture, readable code, and scalable design principles.

## 📌 Project Overview

This repository is split into three independent backend projects. Each focuses on a specific challenge, built using **Node.js** and **Express**, adhering to the rule of implementing custom algorithms without relying on heavy external libraries.

1.  **[Logging Validation Middleware](./logging_middleware/)**
    *   A custom Express API endpoint that intercepts incoming application logs, strictly validates the payload against a specific set of constraints (Stack, Level, Package), and generates a zero-dependency UUID. 
2.  **[Vehicle Scheduling Microservice](./vehicle_scheduling/)**
    *   An advanced microservice that fetches live data from an external Test Server and uses a Dynamic Programming algorithm to solve the 0/1 Knapsack Problem, maximizing the operational impact score of vehicle tasks within a strict mechanic-hour budget.
3.  **[Notification System Design & App](./notification_app_be/)**
    *   *System Design:* Check out [`notification_system_design.md`](./notification_system_design.md) for the complete architecture and data flow diagrams of a scalable, decoupled notification service.
    *   *Implementation:* The `notification_app_be` folder contains the backend implementation of the API that handles queuing and dispatching these notifications.

## 🛠️ Tech Stack & Architecture

- **Runtime:** Node.js
- **Framework:** Express.js
- **Design Pattern:** Modular, separation of concerns (Routes, Controllers, Services).
- **Algorithms:** Pure JavaScript implementations (Dynamic Programming, custom UUID generation) to adhere to the zero-dependency rule.
- **Documentation:** Markdown with Mermaid.js for diagrams.

*Note: As per the challenge guidelines, I've avoided using external utility libraries (like lodash, moment.js, or uuid) for core algorithms, ensuring the logic is built from scratch and easy to evaluate.*

## 📸 Testing & Verification

I've rigorously tested the APIs using Postman/Insomnia. You will find screenshots capturing the **request body**, **response payload**, and **response times** within each specific project's documentation to verify performance and correctness.

---

*Thank you for reviewing my submission. Feel free to reach out if you have any questions about my architectural choices or code structure!*
