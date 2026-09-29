# Doctor Appointment Booking App (Assignment)

A simple full-stack web application built with:
- React + Vite (frontend)
- Node.js + Express (backend)
- PostgreSQL (Alpine lightweight SQL database)

## Features
- View doctors list
- Select date from a calendar strip (next 7 days)
- Book appointment by choosing slot
- Prevent double booking for same doctor/date/slot
- View and cancel appointments

## Project Structure
- `backend/` Express API + PostgreSQL database
- `frontend/` React Vite app

## Running with Docker (Recommended)

Run the entire application stack (Frontend, Backend, PostgreSQL Alpine) using Docker Compose:

```bash
docker compose up --build
```

- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **PostgreSQL**: `localhost:5432`

To run in background mode:
```bash
docker compose up -d --build
```

To stop containers:
```bash
docker compose down
```


## API Endpoints
- `GET /api/doctors`
- `GET /api/appointments?doctorId=<id>&date=YYYY-MM-DD`
- `POST /api/appointments`
- `DELETE /api/appointments/:id`

## Sample Appointment JSON
```json
{
  "patientName": "Rahul",
  "patientEmail": "rahul@gmail.com",
  "doctor": "<doctor_id>",
  "date": "2026-03-01",
  "slot": "10:00",
  "reason": "General Checkup"
}
```
