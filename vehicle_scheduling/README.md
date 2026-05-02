# Vehicle Scheduling Microservice 🚚

This is an advanced backend microservice designed to optimize daily vehicle maintenance schedules across multiple depots.

## 🧠 Architectural Highlights

The core of this module solves the classic **0/1 Knapsack Problem** using a highly efficient **Dynamic Programming (DP)** algorithm.
- **Capacity:** Daily available `MechanicHours` for each depot.
- **Weight:** The `Duration` required to complete a vehicle task.
- **Value:** The operational `Impact` score of the task.

By utilizing a 2D DP array, the algorithm guarantees the mathematically absolute maximum impact score for every depot without exceeding the mechanic-hour budget.

## 🚀 Live Data Integration

Instead of relying on mock data, this microservice acts as a proxy that fetches live data from the Affordmed Test Server APIs.

**Endpoints Integrated:**
- `GET /evaluation-service/depots`
- `GET /evaluation-service/vehicles`

## 📂 Folder Structure
- `/services/algorithm.js`: Contains the pure Dynamic Programming algorithm. Zero external libraries used.
- `/controllers/schedulerController.js`: Extracts the user's Bearer token, fetches the live data from the external APIs, and maps the data to our DP algorithm.
- `index.js`: Express entry point.


