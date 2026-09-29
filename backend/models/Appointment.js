import { pool } from "../config/db.js";

const formatAppointment = (row) => ({
  _id: String(row.id),
  id: row.id,
  patientName: row.patient_name,
  patientEmail: row.patient_email,
  doctor: {
    _id: String(row.doctor_id),
    id: row.doctor_id,
    name: row.doctor_name,
    specialization: row.doctor_specialization
  },
  date: row.date,
  slot: row.slot,
  reason: row.reason,
  createdAt: row.created_at
});

const Appointment = {
  find: async (filter = {}) => {
    let query = `
      SELECT 
        a.id, a.patient_name, a.patient_email, a.doctor_id, a.date, a.slot, a.reason, a.created_at,
        d.name AS doctor_name, d.specialization AS doctor_specialization
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
    `;
    const conditions = [];
    const values = [];

    if (filter.doctor) {
      values.push(parseInt(filter.doctor, 10));
      conditions.push(`a.doctor_id = $${values.length}`);
    }

    if (filter.date) {
      values.push(filter.date);
      conditions.push(`a.date = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY a.date ASC, a.slot ASC`;

    const result = await pool.query(query, values);
    return result.rows.map(formatAppointment);
  },

  create: async ({ patientName, patientEmail, doctor, date, slot, reason }) => {
    const doctorId = parseInt(doctor, 10);
    const result = await pool.query(
      `INSERT INTO appointments (patient_name, patient_email, doctor_id, date, slot, reason)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [patientName, patientEmail, doctorId, date, slot, reason || "General Checkup"]
    );

    const created = result.rows[0];
    const docResult = await pool.query("SELECT name, specialization FROM doctors WHERE id = $1", [doctorId]);
    const doc = docResult.rows[0] || {};

    return formatAppointment({
      ...created,
      doctor_name: doc.name,
      doctor_specialization: doc.specialization
    });
  },

  findByIdAndDelete: async (id) => {
    const result = await pool.query("DELETE FROM appointments WHERE id = $1 RETURNING id", [parseInt(id, 10)]);
    return result.rowCount > 0;
  }
};

export default Appointment;
