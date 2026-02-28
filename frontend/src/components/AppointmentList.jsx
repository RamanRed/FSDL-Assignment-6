function AppointmentList({ appointments, onCancel }) {
  return (
    <div className="card">
      <h3>Appointments</h3>
      {appointments.length === 0 ? (
        <p>No bookings for this doctor and date.</p>
      ) : (
        <ul className="appointment-list">
          {appointments.map((item) => (
            <li key={item._id}>
              <div>
                <strong>{item.slot}</strong> - {item.patientName} ({item.patientEmail})
                <div className="muted">{item.reason}</div>
              </div>
              <button className="btn danger" onClick={() => onCancel(item._id)}>
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AppointmentList;
