# Doctor Appointment Booking App (Assignment)

A simple full-stack web application built with:
- React + Vite (frontend)
- Node.js + Express (backend)
- MongoDB + Mongoose (NoSQL database)

## Features
- View doctors list
- Select date from a calendar strip (next 7 days)
- Book appointment by choosing slot
- Prevent double booking for same doctor/date/slot
- View and cancel appointments

## Project Structure
- `backend/` Express API + MongoDB models
- `frontend/` React Vite app

## How to Run

### 1) Backend setup
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### 2) Frontend setup
Open new terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

### 3) MongoDB
Make sure MongoDB is running locally on:
`mongodb://127.0.0.1:27017/doctor_appointment_db`

If needed, seed doctors manually:
```bash
cd backend
npm run seed
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
