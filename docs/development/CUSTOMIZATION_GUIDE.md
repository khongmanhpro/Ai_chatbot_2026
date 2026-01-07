# 📚 LightRAG - Hướng Dẫn Tùy Chỉnh (Tiếng Việt)

## 📖 Tài Liệu Có Sẵn

### 1. 📋 [FILE_STRUCTURE_GUIDE.md](./FILE_STRUCTURE_GUIDE.md)
**Chi tiết đầy đủ về:**
- Sơ đồ cấu trúc file
- File nào có thể sửa / không sửa
- Cách mở rộng LightRAG
- Roadmap chi tiết 5 phases
- Best practices

**Dùng khi:** Cần hiểu sâu về cấu trúc và cách extend

---

### 2. 🚀 [QUICK_START_ROADMAP.md](./QUICK_START_ROADMAP.md)
**Roadmap nhanh:**
- Sơ đồ tổng quan
- 5 bước setup nhanh
- Quy tắc vàng
- Cấu trúc đề xuất
- Workflow

**Dùng khi:** Muốn bắt đầu nhanh

---

### 3. ✅ [FILE_MODIFICATION_CHECKLIST.md](./FILE_MODIFICATION_CHECKLIST.md)
**Checklist ngắn gọn:**
- File có thể sửa / không sửa
- Extension points
- Decision tree
- Templates cho extension
- Best practices summary

**Dùng khi:** Cần checklist nhanh trước khi sửa file

---

## 🎯 Tóm Tắt Nhanh

### ✅ File Có Thể Sửa
- `.env` - ⭐⭐⭐ **QUAN TRỌNG NHẤT**
- `config.ini`
- `docker-compose.yml`
- Scripts riêng của bạn
- Custom extensions (tạo file mới)

### ❌ File Không Nên Sửa
- `lightrag/lightrag.py` - Core class
- `lightrag/operate.py` - Core operations
- `lightrag/base.py` - Interfaces
- Tất cả `*_impl.py` - Storage/LLM implementations
- `lightrag/api/lightrag_server.py` - API server core

### 🔄 Cách Mở Rộng
1. **Custom Storage:** Tạo class mới kế thừa `Base*Storage`
2. **Custom LLM:** Tạo function mới theo signature
3. **Custom API:** Tạo router mới trong `api/routers/`
4. **Custom Prompts:** Extend `PROMPTS` dict

---

## 🚀 Bắt Đầu Nhanh

```bash
# 1. Setup config
cp env.example .env
# Sửa .env với config của bạn

# 2. Test
python examples/lightrag_openai_demo.py

# 3. Tạo script riêng
cp examples/lightrag_openai_demo.py my_rag_service.py
# Sửa my_rag_service.py
```

---

## 📞 Khi Cần Giúp

1. Đọc tài liệu trong `docs/`
2. Xem examples trong `examples/`
3. Check GitHub Issues
4. Đọc [AGENTS.md](./AGENTS.md) cho development guidelines

---

**Lưu ý:** Luôn ưu tiên **configuration** và **extension** thay vì **modification** trực tiếp vào core files!


