# 🏢 Leave Management System

A full-stack **Leave Management System** built with:

* **Backend:** FastAPI (Python 3.10, async, Motor, MongoDB)
* **Frontend:** React (Vite, modern UI)
* **Database:** MongoDB (NoSQL, automatically managed collections)

This system allows employees to request leaves, view their leave history, and lets administrators manage approvals, ensuring smooth office operations.

Here are the Answers for Part1 & Part2: [LINK](SYMPLORA.pdf)
---

## 📂 Project Structure

```
├── backend/          # FastAPI application
│   ├── app/          # Core FastAPI app (models, utils)
│   └── requirements.txt
├── front/            # React (Vite) frontend
│   ├── src/          # Components and pages
│   ├── public/
│   └── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 1. Backend (FastAPI + MongoDB)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (Python 3.10):

   ```bash
   python3.10 -m venv venv
   source venv/bin/activate    # On Linux/Mac
   venv\Scripts\activate       # On Windows
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server using Uvicorn:

   ```bash
   uvicorn app.main:app --reload
   ```

   Server will be available at 👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

### 🔹 2. Frontend (React + Vite)

1. Navigate to the frontend directory:

   ```bash
   cd front
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   Frontend will be available at 👉 **[http://localhost:5173](http://localhost:5173)**

---

### 🔹 3. Database (MongoDB)

1. Start MongoDB on your local machine:

   ```bash
   mongod
   ```

2. Connect at **mongodb://localhost:27017**

   * A new database will be created automatically when the application runs.
   * Collections:

     * `employees` → stores employee details (name, email, department, joining date, leave balance)
     * `leaves` → stores leave applications (employee\_id, start\_date, end\_date, status)

---

## 🚀 Features

* Employee Management (Add, View Employees)
* Leave Requests (Apply, Cancel, Approve/Reject)
* Role-based Access (Admin vs Employee)
* Real-time Updates with FastAPI async I/O
* MongoDB NoSQL backend with automatic schema handling

---

## 📌 API Endpoints (Backend Preview)

* `GET /employees` → List employees
* `POST /employees` → Add new employee
* `GET /leaves` → List leave requests
* `POST /leaves` → Apply for leave
* `POST /leaves/{leave_id}/action` → Approve/Reject leave

---

## ✅ Tech Stack

* **Backend:** FastAPI, Uvicorn, Motor, Pydantic
* **Frontend:** React (Vite, JSX)
* **Database:** MongoDB (local instance)

---


