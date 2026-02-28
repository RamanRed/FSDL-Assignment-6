import { useState } from "react";

function BookingForm({ selectedDoctorId, selectedDate, appointments, onBook }) {
  const [form, setForm] = useState({
    patientName: "",
    patientEmail: "",
    slot: "09:00",
    reason: "General Checkup"
  });

  const bookedSlots = appointments.map((item) => item.slot);

  const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedDoctorId || !selectedDate) {
      return;
    }

    const success = await onBook({
      ...form,
      doctor: selectedDoctorId,
      date: selectedDate
    });

    if (success) {
      setForm((prev) => ({ ...prev, patientName: "", patientEmail: "" }));
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Book Appointment</h3>
      <input
        className="input"
        placeholder="Patient name"
        value={form.patientName}
        onChange={(event) => setForm({ ...form, patientName: event.target.value })}
        required
      />
      <input
        className="input"
        type="email"
        placeholder="Patient email"
        value={form.patientEmail}
        onChange={(event) => setForm({ ...form, patientEmail: event.target.value })}
        required
      />
      <select
        className="input"
        value={form.slot}
        onChange={(event) => setForm({ ...form, slot: event.target.value })}
      >
        {slots.map((slot) => {
          const taken = bookedSlots.includes(slot);
          return (
            <option key={slot} value={slot} disabled={taken}>
              {slot} {taken ? "(Booked)" : ""}
            </option>
          );
        })}
      </select>
      <input
        className="input"
        placeholder="Reason"
        value={form.reason}
        onChange={(event) => setForm({ ...form, reason: event.target.value })}
      />
      <button className="btn" type="submit" disabled={!selectedDoctorId}>
        Confirm Booking
      </button>
    </form>
  );
}

export default BookingForm;