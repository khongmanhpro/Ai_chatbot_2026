# 🐳 Hướng Dẫn Sử Dụng Docker Compose & .env Files

## 📋 Tổng Quan Các File

Dự án có **3 file docker-compose** và tương ứng với **3 file .env**:

| Docker Compose File | File .env Tương Ứng | Mục Đích | Khi Nào Dùng |
|---------------------|---------------------|----------|--------------|
| `docker-compose.yml` | `.env` | Mặc định/Đơn giản | Development cơ bản |
| `docker-compose.nonprod.yml` | `.env.nonprod` | Development/Staging | Testing, Development |
| `docker-compose.prod.yml` | `.env.prod` | Production | Production server |

---

## 🚀 Cách Sử Dụng

### Option 1: docker-compose.yml (Đơn Giản Nhất)

**Dùng cho:** Development cơ bản, test nhanh

#### Bước 1: Tạo file .env
```bash
cp env.example .env
```

#### Bước 2: Sửa API keys trong .env
```bash
nano .env
# Sửa dòng 204: LLM_BINDING_API_KEY
# Sửa dòng 311: EMBEDDING_BINDING_API_KEY
```

#### Bước 3: Chạy
```bash
docker compose up -d
```

#### Bước 4: Kiểm tra
```bash
curl http://localhost:9621/health
```

**Truy cập:** http://localhost:9621

---

### Option 2: docker-compose.nonprod.yml (Development/Staging)

**Dùng cho:** Development với Redis, có thể thêm PostgreSQL/Ollama

#### Bước 1: Tạo file .env.nonprod
```bash
cp env.example .env.nonprod
```

#### Bước 2: Sửa API keys trong .env.nonprod
```bash
nano .env.nonprod
# Sửa dòng 204: LLM_BINDING_API_KEY
# Sửa dòng 311: EMBEDDING_BINDING_API_KEY
```

#### Bước 3: Tạo thư mục data
```bash
mkdir -p data/nonprod/{inputs,rag_storage,tiktoken} logs/nonprod
```

#### Bước 4: Chạy
```bash
docker compose -f docker-compose.nonprod.yml up -d
```

#### Bước 5: Kiểm tra
```bash
# Check services
docker compose -f docker-compose.nonprod.yml ps

# Check logs
docker compose -f docker-compose.nonprod.yml logs -f lightrag
```

**Tính năng:**
- ✅ Redis caching (tự động)
- ✅ Health checks
- ✅ Hot reload (mount source code)
- ✅ Separate data directories
- ⚙️ Có thể uncomment PostgreSQL/Ollama

**Truy cập:** http://localhost:9621

---

### Option 3: docker-compose.prod.yml (Production)

**Dùng cho:** Production server với đầy đủ tính năng

#### Bước 1: Tạo file .env.prod
```bash
cp env.example .env.prod
```

#### Bước 2: Cấu hình Production trong .env.prod
```bash
nano .env.prod
```

**Các cấu hình quan trọng:**
```env
# API Keys (BẮT BUỘC)
LLM_BINDING_API_KEY=your_production_api_key
EMBEDDING_BINDING_API_KEY=your_production_api_key

# Authentication (KHUYẾN NGHỊ)
AUTH_ACCOUNTS='admin:strong_password_here'
TOKEN_SECRET=your_very_secure_secret_key_here

# Database (Nếu dùng PostgreSQL trong compose)
POSTGRES_PASSWORD=strong_database_password
POSTGRES_USER=lightrag_prod
POSTGRES_DATABASE=lightrag_production

# Redis (Nếu dùng Redis trong compose)
REDIS_PASSWORD=strong_redis_password

# Storage Backend (KHUYẾN NGHỊ cho production)
LIGHTRAG_KV_STORAGE=PGKVStorage
LIGHTRAG_DOC_STATUS_STORAGE=PGDocStatusStorage
LIGHTRAG_GRAPH_STORAGE=PGGraphStorage
LIGHTRAG_VECTOR_STORAGE=PGVectorStorage

# Security
SSL=true
SSL_CERTFILE=/path/to/cert.pem
SSL_KEYFILE=/path/to/key.pem
```

#### Bước 3: Chạy
```bash
docker compose -f docker-compose.prod.yml up -d
```

#### Bước 4: Kiểm tra
```bash
# Check all services
docker compose -f docker-compose.prod.yml ps

# Check logs
docker compose -f docker-compose.prod.yml logs -f lightrag
```

**Tính năng:**
- ✅ PostgreSQL + pgvector (tự động)
- ✅ Redis caching (tự động)
- ✅ Resource limits
- ✅ Health checks
- ✅ Logging rotation
- ✅ Persistent volumes
- ✅ Network isolation
- ✅ Production-ready config

**Truy cập:** http://localhost:9621 (chỉ localhost, dùng reverse proxy)

---

## 📊 So Sánh Chi Tiết

### docker-compose.yml (Mặc định)
```
Services:
├── lightrag (chỉ service chính)

Storage:
├── Local files (./data/rag_storage)
└── JSON storage (default)

Dependencies:
└── Không có (standalone)
```

### docker-compose.nonprod.yml (Development)
```
Services:
├── lightrag
├── redis-nonprod (tự động)
└── postgres-nonprod (optional, uncomment)
└── ollama (optional, uncomment)

Storage:
├── Separate directories (./data/nonprod/)
├── Redis KV storage (optional)
└── PostgreSQL (optional)

Features:
├── Hot reload
├── Health checks
└── Development-friendly
```

### docker-compose.prod.yml (Production)
```
Services:
├── lightrag-prod
├── postgres (tự động)
├── redis (tự động)
└── nginx (optional, uncomment)

Storage:
├── Named volumes (persistent)
├── PostgreSQL (required)
└── Redis (required)

Features:
├── Resource limits
├── Health checks
├── Log rotation
├── Network isolation
└── Production security
```

---

## 🔄 Chuyển Đổi Giữa Các Môi Trường

### Từ Development sang Production

```bash
# 1. Dừng development
docker compose -f docker-compose.nonprod.yml down

# 2. Backup data
tar -czf nonprod-backup.tar.gz data/nonprod/

# 3. Tạo .env.prod
cp env.example .env.prod
nano .env.prod  # Cấu hình production

# 4. Chạy production
docker compose -f docker-compose.prod.yml up -d
```

### Chạy Cùng Lúc Nhiều Môi Trường

**Có thể chạy cùng lúc nếu dùng ports khác nhau:**

```bash
# Development trên port 9621
docker compose -f docker-compose.nonprod.yml up -d

# Production trên port 9622 (sửa trong .env.prod)
PORT=9622 docker compose -f docker-compose.prod.yml up -d
```

---

## 📝 Checklist Cho Từng Môi Trường

### Development (docker-compose.yml)
- [ ] Tạo `.env` từ `env.example`
- [ ] Sửa `LLM_BINDING_API_KEY` (dòng 204)
- [ ] Sửa `EMBEDDING_BINDING_API_KEY` (dòng 311)
- [ ] Chạy `docker compose up -d`

### Non-Production (docker-compose.nonprod.yml)
- [ ] Tạo `.env.nonprod` từ `env.example`
- [ ] Sửa `LLM_BINDING_API_KEY` (dòng 204)
- [ ] Sửa `EMBEDDING_BINDING_API_KEY` (dòng 311)
- [ ] Tạo thư mục `data/nonprod/` và `logs/nonprod/`
- [ ] (Optional) Uncomment PostgreSQL/Ollama nếu cần
- [ ] Chạy `docker compose -f docker-compose.nonprod.yml up -d`

### Production (docker-compose.prod.yml)
- [ ] Tạo `.env.prod` từ `env.example`
- [ ] Sửa `LLM_BINDING_API_KEY` (dòng 204)
- [ ] Sửa `EMBEDDING_BINDING_API_KEY` (dòng 311)
- [ ] Cấu hình `AUTH_ACCOUNTS` và `TOKEN_SECRET`
- [ ] Cấu hình `POSTGRES_PASSWORD` và `REDIS_PASSWORD`
- [ ] Cấu hình storage backend (PostgreSQL)
- [ ] (Optional) Cấu hình SSL
- [ ] Chạy `docker compose -f docker-compose.prod.yml up -d`

---

## 🛠️ Lệnh Quản Lý

### Xem Status
```bash
# Mặc định
docker compose ps

# Non-prod
docker compose -f docker-compose.nonprod.yml ps

# Production
docker compose -f docker-compose.prod.yml ps
```

### Xem Logs
```bash
# Mặc định
docker compose logs -f lightrag

# Non-prod
docker compose -f docker-compose.nonprod.yml logs -f lightrag

# Production
docker compose -f docker-compose.prod.yml logs -f lightrag
```

### Dừng Services
```bash
# Mặc định
docker compose down

# Non-prod
docker compose -f docker-compose.nonprod.yml down

# Production
docker compose -f docker-compose.prod.yml down
```

### Restart Services
```bash
# Mặc định
docker compose restart

# Non-prod
docker compose -f docker-compose.nonprod.yml restart

# Production
docker compose -f docker-compose.prod.yml restart
```

### Xóa Tất Cả (Cẩn Thận!)
```bash
# Mặc định
docker compose down -v

# Non-prod
docker compose -f docker-compose.nonprod.yml down -v

# Production
docker compose -f docker-compose.prod.yml down -v
```

---

## 🔍 Troubleshooting

### Lỗi: "env_file .env.nonprod not found"
**Nguyên nhân:** File .env tương ứng chưa được tạo
**Giải pháp:**
```bash
cp env.example .env.nonprod  # hoặc .env.prod
```

### Lỗi: "Port already in use"
**Nguyên nhân:** Port đã bị chiếm bởi service khác
**Giải pháp:**
```bash
# Tìm process đang dùng port
lsof -i :9621

# Hoặc đổi port trong .env
PORT=9622
```

### Lỗi: "Volume mount failed"
**Nguyên nhân:** Thư mục chưa được tạo
**Giải pháp:**
```bash
# Cho nonprod
mkdir -p data/nonprod/{inputs,rag_storage,tiktoken} logs/nonprod

# Cho production (volumes tự động tạo)
docker compose -f docker-compose.prod.yml up -d
```

### Lỗi: "Database connection failed" (Production)
**Nguyên nhân:** PostgreSQL chưa sẵn sàng
**Giải pháp:**
```bash
# Check PostgreSQL status
docker compose -f docker-compose.prod.yml ps postgres

# Check logs
docker compose -f docker-compose.prod.yml logs postgres

# Wait for health check
docker compose -f docker-compose.prod.yml up -d --wait
```

---

## 💡 Khuyến Nghị

### Cho Lần Đầu Sử Dụng:
→ Dùng `docker-compose.yml` với `.env` (đơn giản nhất)

### Cho Development:
→ Dùng `docker-compose.nonprod.yml` với `.env.nonprod` (có Redis, dễ debug)

### Cho Production:
→ Dùng `docker-compose.prod.yml` với `.env.prod` (đầy đủ tính năng, bảo mật)

---

## 📚 Tài Liệu Liên Quan

- **SETUP_CHECKLIST.md** - Checklist setup chi tiết
- **START_HERE.md** - Hướng dẫn nhanh
- **QUICK_START.md** - Quick start guide
- **PROJECT_OVERVIEW.md** - Tổng quan dự án

---

**Nhớ:** Mỗi docker-compose file cần file .env tương ứng!


