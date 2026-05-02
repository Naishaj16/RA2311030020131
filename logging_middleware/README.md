# Logging API Validation Middleware 🛡️

This module implements a highly strict, protected API endpoint designed to ingest application logs. It strictly follows the rules defined in the problem statement without relying on external validation libraries (like Joi or Zod).

## 🧠 Architectural Highlights

1. **Zero-Dependency Validation**: The middleware `validator.js` manually checks every field against allowed sets and cross-references the `package` against the specific `stack`. 
2. **Protected Routes**: Implements an `auth.js` middleware that verifies the presence of an `Authorization: Bearer <token>` header to prevent unauthorized access.
3. **Custom UUID Generation**: The `logID` in the response is generated using a custom cryptographic-like random algorithm in `utils/uuid.js`, proving competence in core JavaScript functionality without relying on the popular `uuid` npm package.

## 🚀 Endpoints

### `POST /api/logs`

**Headers Required:**
```
Authorization: Bearer <your_access_token>
```

**Valid Body Example:**
```json
{
  "stack": "backend",
  "level": "error",
  "package": "handler",
  "message": "received string, expected bool"
}
```

**Response (200 OK):**
```json
{
  "logID": "a4aad02e-19d0-4153-86d9-58bf55d7c402",
  "message": "log created successfully"
}
```

## 🧪 Error Handling
If you attempt to send an invalid payload (e.g., `stack: "frontend"` but `package: "db"`), the API will immediately reject the request with a `400 Bad Request` and a helpful error message explaining *why* the constraint failed.

## 💻 How to Run
```bash
npm install
npm run dev
```
