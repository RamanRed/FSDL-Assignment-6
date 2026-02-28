function DoctorSelector({ doctors, selectedDoctorId, onDoctorChange }) {
  return (
    <div className="card">
      <h3>Select Doctor</h3>
      <select
        className="input"
        value={selectedDoctorId}
        onChange={(event) => onDoctorChange(event.target.value)}
      >
        <option value="">Choose a doctor</option>
        {doctors.map((doctor) => (
          <option key={doctor._id} value={doctor._id}>
            {doctor.name} - {doctor.specialization}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DoctorSelector;
