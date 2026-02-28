const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const send = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    const message = await response.json().catch(() => ({}));
    throw new Error(message.message || "Request failed");
  }

  return response.json();
};

export const api = {
  getDoctors: () => send("/doctors"),
  getAppointments: (doctorId, date) =>
    send(`/appointments?doctorId=${doctorId}&date=${date}`),
  createAppointment: (payload) =>
    send("/appointments", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  cancelAppointment: (id) =>
    send(`/appointments/${id}`, {
      method: "DELETE"
    })
};
