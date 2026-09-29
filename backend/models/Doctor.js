import { pool } from "../config/db.js";

const formatDoctor = (row) => ({
  _id: String(row.id),
  id: row.id,
  name: row.name,
  specialization: row.specialization
});

const Doctor = {
  find: async () => {
    const result = await pool.query("SELECT * FROM doctors ORDER BY name ASC");
    return result.rows.map(formatDoctor);
  },

  findById: async (id) => {
    const result = await pool.query("SELECT * FROM doctors WHERE id = $1", [id]);
    if (result.rows.length === 0) return null;
    return formatDoctor(result.rows[0]);
  },

  countDocuments: async () => {
    const result = await pool.query("SELECT COUNT(*) AS count FROM doctors");
    return parseInt(result.rows[0].count, 10);
  },

  insertMany: async (doctors) => {
    const inserted = [];
    for (const doc of doctors) {
      const result = await pool.query(
        "INSERT INTO doctors (name, specialization) VALUES ($1, $2) RETURNING *",
        [doc.name, doc.specialization]
      );
      inserted.push(formatDoctor(result.rows[0]));
    }
    return inserted;
  },

  deleteMany: async () => {
    await pool.query("DELETE FROM doctors");
  }
};

export default Doctor;
