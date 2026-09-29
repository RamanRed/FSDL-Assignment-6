import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgrespassword@localhost:5432/doctor_appointment_db"
});

export const connectDB = async () => {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const client = await pool.connect();
      console.log("PostgreSQL connected successfully");
      client.release();
      break;
    } catch (error) {
      retries += 1;
      console.log(`Waiting for PostgreSQL to be ready... (${retries}/${maxRetries}): ${error.message}`);
      await new Promise((res) => setTimeout(res, 2000));
      if (retries === maxRetries) {
        console.error("DB connection failed permanently:", error.message);
        process.exit(1);
      }
    }
  }

  // Create tables if they do not exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS doctors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      specialization VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      patient_name VARCHAR(255) NOT NULL,
      patient_email VARCHAR(255) NOT NULL,
      doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      slot VARCHAR(20) NOT NULL,
      reason TEXT DEFAULT 'General Checkup',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_doctor_date_slot UNIQUE (doctor_id, date, slot)
    );
  `);
};
