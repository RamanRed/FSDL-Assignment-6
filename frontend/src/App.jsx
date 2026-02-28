import { useEffect, useState } from "react";
import CalendarStrip from "./components/CalendarStrip";
import DoctorSelector from "./components/DoctorSelector";
import BookingForm from "./components/BookingForm";
import AppointmentList from "./components/AppointmentList";
import { api } from "./services/api";

const formatLocalDate = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function App() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  const loadDoctors = async () => {
    try {
      const data = await api.getDoctors();
      setDoctors(data);
      if (data.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(data[0]._id);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadAppointments = async (doctorId, date) => {
    if (!doctorId || !date) return;

    try {
      const data = await api.getAppointments(doctorId, date);
      setAppointments(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    loadAppointments(selectedDoctorId, selectedDate);
  }, [selectedDoctorId, selectedDate]);

  const handleBook = async (payload) => {
    try {
      await api.createAppointment(payload);
      setMessage("Appointment booked successfully");
      await loadAppointments(selectedDoctorId, selectedDate);
      return true;
    } catch (error) {
      setMessage(error.message);
      return false;
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.cancelAppointment(id);
      setMessage("Appointment cancelled");
      await loadAppointments(selectedDoctorId, selectedDate);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Doctor Appointment Calendar</h1>
        <p>Simple online booking app using React, Node.js, Express and MongoDB</p>
      </header>

      {message && <div className="alert">{message}</div>}

      <CalendarStrip selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <div className="grid">
        <DoctorSelector
          doctors={doctors}
          selectedDoctorId={selectedDoctorId}
          onDoctorChange={setSelectedDoctorId}
        />
        <BookingForm
          selectedDoctorId={selectedDoctorId}
          selectedDate={selectedDate}
          appointments={appointments}
          onBook={handleBook}
        />
      </div>

      <AppointmentList appointments={appointments} onCancel={handleCancel} />
    </div>
  );
}

export default App;