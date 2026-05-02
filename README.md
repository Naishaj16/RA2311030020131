# Backend Engineering Assessment

This repository contains my solutions for the core backend engineering challenges. The systems are designed with a focus on clean architecture, readable code, and scalable design principles. All solutions adhere to the strict constraint of implementing custom logic and algorithms from scratch without relying on external algorithmic libraries.

## Project Architecture

The repository is modularized into independent backend services. The following diagram illustrates the high-level architecture and responsibilities of the implemented modules:

```mermaid
graph TD
    Client[Client Request]
    
    subgraph Logging Module
        LV[Logging Validation API]
        Validator[Strict Constraint Validator]
        UUID[Custom UUID Generator]
        LV -->|Payload| Validator
        Validator -->|Valid| UUID
    end

    subgraph Scheduling Module
        VS[Vehicle Scheduling Proxy]
        DP[Dynamic Programming Algorithm]
        Ext[Affordmed Test Server APIs]
        VS -->|Fetch| Ext
        Ext -->|Depot/Vehicle Data| VS
        VS -->|Optimize| DP
    end

    Client -.-> LV
    Client -.-> VS
```

## Implemented Modules

### 1. Logging Validation Middleware
A custom Express API endpoint designed to intercept incoming application logs. 
- It strictly validates the payload against a predefined set of constraints, ensuring that packages align correctly with their respective stacks.
- It includes a custom-built, zero-dependency UUID generation algorithm to handle unique log identification.

### 2. Vehicle Scheduling Microservice
An advanced microservice that acts as an optimization proxy.
- It fetches live depot and vehicle data from an external Test Server.
- It utilizes a custom Dynamic Programming algorithm to solve the 0/1 Knapsack Problem, maximizing the operational impact score of vehicle tasks within a strict mechanic-hour budget constraint.

### 3. Notification System Design & Priority Inbox
- **System Design (`notification_system_design.md`):** A comprehensive 6-stage system design document detailing API contracts, PostgreSQL schema, query optimization, caching strategies, and asynchronous message queue architectures for a scalable campus notification platform.
- **Priority Inbox Implementation (`priority_inbox.js`):** A functioning Node.js algorithm that connects to a protected evaluation API, fetches live notifications, and applies a weighted Time-Decay scoring logic (optimized via a Min-Heap strategy) to calculate the Top 10 Priority Inbox.

## Data Flow Diagram: Scheduling Optimization

The following flowchart outlines the specific execution path for the dynamic programming optimization module:

```mermaid
sequenceDiagram
    participant Client
    participant Proxy as Scheduling API
    participant Ext as Test Server
    participant Algo as DP Algorithm

    Client->>Proxy: Request Schedule (Bearer Token)
    Proxy->>Ext: Fetch /depots & /vehicles
    Ext-->>Proxy: Live API Data
    loop For each Depot
        Proxy->>Algo: Pass Capacity & Tasks
        Algo-->>Proxy: Return Max Impact & Selection
    end
    Proxy-->>Client: Optimized Schedule JSON
```

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Design Pattern:** Modular MVC architecture for separation of concerns.
- **Algorithms:** Pure JavaScript implementations (Dynamic Programming, custom UUID generation) to adhere to the zero-dependency rule.

Note: As per the challenge guidelines, external utility libraries such as lodash, moment.js, or uuid were strictly avoided for core algorithms to demonstrate raw coding competency.

## Testing & Verification

The APIs were rigorously tested to ensure performance and correctness. Screenshots capturing the request bodies, response payloads, and execution times are provided as part of the submission to verify the successful integration and output formatting required by the problem statements.
