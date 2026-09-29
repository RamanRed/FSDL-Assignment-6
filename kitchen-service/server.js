import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "Kitchen Service",
    status: "running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy"
  });
});

app.post("/prepare", (req, res) => {
  const { orderId, item } = req.body;

  res.json({
    message: "Order sent to kitchen",
    orderId,
    item,
    status: "preparing"
  });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Kitchen Service running on port ${PORT}`);
});
