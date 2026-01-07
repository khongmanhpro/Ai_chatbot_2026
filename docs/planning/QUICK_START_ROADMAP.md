# 🚀 LightRAG - Quick Start Roadmap

## 📊 Sơ Đồ Tổng Quan

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                          │
│  (Có thể sửa tự do)                                          │
│  - my_app/rag_service.py                                     │
│  - my_app/config.py                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Uses
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              LIGHTRAG CORE LIBRARY                            │
│  (Không nên sửa trực tiếp)                                  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ lightrag.py  │──│  operate.py  │──│  base.py     │      │
│  │  (Core)      │  │  (Ops)       │  │  (Interfaces)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                 │               │
│         ├─────────────────┼─────────────────┤               │
│         │                 │                 │               │
│    ┌────▼────┐      ┌─────▼─────┐    ┌─────▼─────┐        │
│    │  kg/    │      │   llm/    │    │  prompt.py │        │
│    │ Storage │      │ Providers │    │ Templates  │        │
│    └─────────┘      └───────────┘    └────────────┘        │
└─────────────────────────────────────────────────────────────┘
                       │
                       │ Configured by
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              CONFIGURATION FILES                             │
│  (Có thể sửa)                                                │
│  - .env (⭐⭐⭐ QUAN TRỌNG NHẤT)                              │
│  - config.ini                                                │
│  - docker-compose.yml                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Roadmap Nhanh

### 📍 Bước 1: Setup Cơ Bản (30 phút)
```bash
# 1. Copy env file
cp env.example .env

# 2. Sửa .env với config của bạn
# - LLM_BINDING=openai
# - LLM_MODEL=gpt-4o
# - EMBEDDING_BINDING=openai
# - EMBEDDING_MODEL=text-embedding-3-large

# 3. Test với example
python examples/lightrag_openai_demo.py
```

**Files cần sửa:**
- ✅ `.env`

**Files KHÔNG sửa:**
- ❌ Tất cả files trong `lightrag/`

---

### 📍 Bước 2: Tạo Script Riêng (1-2 giờ)
```bash
# Tạo thư mục riêng
mkdir my_rag_app
cd my_rag_app

# Copy example làm template
cp ../examples/lightrag_openai_demo.py my_rag_service.py

# Sửa my_rag_service.py theo nhu cầu
```

**Files cần tạo:**
- ✅ `my_rag_app/my_rag_service.py`
- ✅ `my_rag_app/config.py` (optional)

**Files KHÔNG sửa:**
- ❌ `examples/lightrag_openai_demo.py` (chỉ copy, không sửa)

---

### 📍 Bước 3: Tích Hợp vào Ứng Dụng (1 ngày)
```python
# my_app/services/rag_service.py
from lightrag import LightRAG, QueryParam
import os

class MyRAGService:
    def __init__(self):
        self.rag = LightRAG(
            working_dir="./rag_storage",
            # Config từ .env hoặc environment variables
        )
        # Initialize
        asyncio.run(self.rag.initialize_storages())
    
    def query(self, question: str):
        return self.rag.query(
            question,
            param=QueryParam(mode="hybrid")
        )
```

**Files cần tạo:**
- ✅ `my_app/services/rag_service.py`
- ✅ `my_app/main.py` (nếu cần)

---

### 📍 Bước 4: Custom Storage/LLM (Nếu cần - 1 tuần)

#### Custom Storage:
```python
# lightrag/kg/my_custom_storage.py (FILE MỚI)
from lightrag.base import BaseKVStorage

class MyCustomStorage(BaseKVStorage):
    # Implement methods
    pass
```

#### Custom LLM:
```python
# lightrag/llm/my_custom_llm.py (FILE MỚI)
async def my_custom_llm_complete(prompt, **kwargs):
    # Your implementation
    pass
```

**Files cần tạo:**
- ✅ `lightrag/kg/my_custom_storage.py` (nếu cần)
- ✅ `lightrag/llm/my_custom_llm.py` (nếu cần)

**Files cần sửa:**
- ✅ `lightrag/kg/__init__.py` (đăng ký storage mới)

---

### 📍 Bước 5: API Customization (Nếu dùng API - 1 tuần)

```python
# lightrag/api/routers/my_custom_routes.py (FILE MỚI)
from fastapi import APIRouter

def create_my_routes(rag, api_key):
    router = APIRouter()
    
    @router.get("/my-endpoint")
    async def my_endpoint():
        return {"message": "Hello"}
    
    return router
```

**Files cần tạo:**
- ✅ `lightrag/api/routers/my_custom_routes.py`

**Files cần sửa:**
- ✅ `lightrag/api/lightrag_server.py` (thêm router)

---

## ⚠️ Quy Tắc Vàng

### ✅ NÊN LÀM:
1. **Sử dụng `.env`** để config
2. **Tạo file mới** thay vì sửa file core
3. **Copy examples** làm template
4. **Extend interfaces** từ `base.py`
5. **Backup** trước khi sửa

### ❌ KHÔNG NÊN:
1. **Sửa trực tiếp** files trong `lightrag/`
2. **Hardcode** config trong code
3. **Modify** core classes trực tiếp
4. **Delete** files trong `lightrag/`
5. **Commit** secrets vào git

---

## 📁 Cấu Trúc Đề Xuất Cho Dự Án Của Bạn

```
my_project/
├── .env                          # ⭐ Config chính
├── config.py                     # Python config (optional)
├── requirements.txt              # Dependencies
│
├── my_rag_app/                   # Application code
│   ├── services/
│   │   └── rag_service.py       # LightRAG wrapper
│   ├── models/
│   │   └── rag_models.py         # Data models
│   └── utils/
│       └── rag_utils.py          # Utilities
│
├── data/                         # Data storage
│   ├── rag_storage/             # LightRAG storage
│   └── inputs/                   # Input documents
│
└── tests/                        # Tests
    └── test_rag_service.py
```

---

## 🔄 Workflow Đề Xuất

```
1. Setup
   └─> Copy .env.example → .env
   └─> Configure LLM & Embedding

2. Test
   └─> Run examples/lightrag_openai_demo.py
   └─> Verify everything works

3. Develop
   └─> Create your own scripts
   └─> Integrate into your app

4. Extend (if needed)
   └─> Create custom storage/LLM
   └─> Add custom API routes

5. Deploy
   └─> Use docker-compose.yml
   └─> Or deploy manually
```

---

## 📞 Khi Gặp Vấn Đề

1. **Check `.env`** - 90% vấn đề là do config sai
2. **Read examples** - Xem cách sử dụng đúng
3. **Check logs** - Xem `lightrag.log`
4. **GitHub Issues** - Tìm giải pháp tương tự

---

**Nhớ:** Luôn ưu tiên **configuration** và **extension** thay vì **modification**!


