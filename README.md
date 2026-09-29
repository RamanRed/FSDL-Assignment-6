# Multi-Container Application (Assignment 5)

A multi-container microservice application managed using **Docker Compose (`compose.yaml`)**, demonstrating:
- **Services**: `frontend`, `backend`, `kitchen-service`, `postgres`
- **Port Mapping**: Host to Container port forwarding
- **Environment Variables**: Dynamic configuration per container
- **Volumes**: Named persistent storage for PostgreSQL (`pgdata`)
- **Networking**: Custom bridge network (`app-network`) with internal DNS service discovery

---

## 🏗 Architecture Diagram

```
                ┌─────────────────────┐
                │    Web Browser       │
                │  localhost:3000      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Frontend Container  │
                │ React + Nginx       │
                │ 3000 → 80           │
                └──────────┬──────────┘
                           │ API
                           ▼
                ┌─────────────────────┐
                │ Backend Container   │
                │ Node.js + Express   │
                │ 5000 → 5000         │
                └───────┬───────┬─────┘
                        │       │
              PostgreSQL│       │Kitchen API (http://kitchen-service:3003)
                        ▼       ▼
             ┌────────────┐ ┌──────────────┐
             │ PostgreSQL │ │Kitchen       │
             │ Container  │ │Service       │
             │ 5432       │ │3003          │
             └─────┬──────┘ └──────────────┘
                   │
                   ▼
             ┌────────────┐
             │ pgdata     │
             │ Volume     │
             └────────────┘
```

---

## 📁 Project Structure

```text
├── compose.yaml
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/ ...
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   └── config/ ...
└── kitchen-service/
    ├── Dockerfile
    ├── package.json
    └── server.js
```

---

## 🚀 Running the Application

### 1. Build all images:
```bash
docker compose build
```

### 2. Start all containers in background:
```bash
docker compose up -d
```

### 3. Check container status:
```bash
docker compose ps
```

### 4. Stop all containers:
```bash
docker compose down
```

---

## 🌐 Endpoints & Ports

| Service | Host URL | Description |
|---|---|---|
| **Frontend** | `http://localhost:3000` | React web application |
| **Backend API** | `http://localhost:5000/api/health` | Node.js Express backend |
| **Backend -> Kitchen Status** | `http://localhost:5000/api/kitchen-status` | Backend calling Kitchen Service over Docker network |
| **Kitchen Service** | `http://localhost:3003/` | Kitchen Service API |
| **Kitchen Health** | `http://localhost:3003/health` | Healthcheck endpoint |
| **PostgreSQL** | `localhost:5432` | Relational database (Volume: `pgdata`) |

---

## 🔍 Verification Commands for Report / Viva

- **Show running containers**:
  ```bash
  docker compose ps
  ```
- **Inspect bridge network (`app-network`)**:
  ```bash
  docker network inspect fsdl-assignment-6_app-network
  ```
- **Inspect persistent volume (`pgdata`)**:
  ```bash
  docker volume inspect fsdl-assignment-6_pgdata
  ```
- **View container logs**:
  ```bash
  docker compose logs -f
  ```
