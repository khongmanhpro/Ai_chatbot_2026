# 🚀 BẮT ĐẦU TẠI ĐÂY - Chạy LightRAG Ngay

## ⚡ 3 Bước Để Chạy Ngay

### Bước 1: Tạo file .env
```bash
cp env.example .env
```

### Bước 2: Sửa API Keys trong .env

**Mở file `.env` và tìm 2 dòng này:**

**Dòng 204:**
```env
LLM_BINDING_API_KEY=your_api_key
```
**→ Thay `your_api_key` bằng API key thật của bạn**

**Dòng 311:**
```env
EMBEDDING_BINDING_API_KEY=your_api_key
```
**→ Thay `your_api_key` bằng API key thật của bạn**

### Bước 3: Chọn Docker Compose File

**Có 3 file docker-compose, chọn 1:**

#### Option A: docker-compose.yml (Đơn giản nhất - Khuyến nghị cho lần đầu)
```bash
docker compose up -d
```

#### Option B: docker-compose.nonprod.yml (Development với Redis)
```bash
# Tạo file .env.nonprod
cp env.example .env.nonprod
nano .env.nonprod  # Sửa API keys

# Tạo thư mục
mkdir -p data/nonprod/{inputs,rag_storage,tiktoken} logs/nonprod

# Chạy
docker compose -f docker-compose.nonprod.yml up -d
```

#### Option C: docker-compose.prod.yml (Production)
```bash
# Tạo file .env.prod
cp env.example .env.prod
nano .env.prod  # Sửa API keys và cấu hình production

# Chạy
docker compose -f docker-compose.prod.yml up -d
```

**Truy cập:** http://localhost:9621

> 💡 **Xem chi tiết:** `DOCKER_COMPOSE_GUIDE.md`

---

## 🤖 Hoặc Dùng Script Tự Động

```bash
./quick_setup.sh
```

Script sẽ tự động:
- ✅ Tạo .env từ template
- ✅ Hỏi bạn nhập API keys
- ✅ Tạo thư mục data
- ✅ Chạy Docker (nếu có)

---

## 📋 Checklist Nhanh

- [ ] File `.env` đã được tạo từ `env.example`
- [ ] `LLM_BINDING_API_KEY` đã được cấu hình (dòng 204)
- [ ] `EMBEDDING_BINDING_API_KEY` đã được cấu hình (dòng 311)
- [ ] Đã chạy `docker compose up -d` hoặc `lightrag-server`
- [ ] Truy cập được http://localhost:9621

---

## 🔧 Nếu Dùng Ollama (Miễn phí)

Thay vì OpenAI, bạn có thể dùng Ollama:

1. **Cài Ollama:**
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ollama pull qwen2.5:latest
   ollama pull bge-m3:latest
   ```

2. **Sửa .env:**
   - Dòng 201: `LLM_BINDING=ollama`
   - Dòng 202: `LLM_MODEL=qwen2.5:latest`
   - Dòng 203: `LLM_BINDING_HOST=http://localhost:11434`
   - Dòng 305: `EMBEDDING_BINDING=ollama`
   - Dòng 306: `EMBEDDING_MODEL=bge-m3:latest`
   - Dòng 310: `EMBEDDING_BINDING_HOST=http://localhost:11434`

---

## ❌ Lỗi Thường Gặp

### "API key is invalid"
→ Kiểm tra lại dòng 204 và 311 trong `.env`

### "Port 9621 already in use"
→ Đổi port trong `.env`: `PORT=9622`

### "Connection refused" (Ollama)
→ Chạy: `ollama serve`

---

## 📚 Tài Liệu Chi Tiết

- **SETUP_CHECKLIST.md** - Checklist đầy đủ
- **QUICK_START.md** - Hướng dẫn chi tiết
- **PROJECT_OVERVIEW.md** - Tổng quan dự án

---

**Sau 3 bước trên, LightRAG sẽ chạy được! 🎉**

