# 📋 LightRAG - Hướng Dẫn Cấu Trúc File và Roadmap

## 🗺️ Sơ Đồ Các File Quan Trọng

```
LightRAG/
│
├── 🔧 CONFIGURATION FILES (Có thể sửa)
│   ├── .env                          # ⭐ QUAN TRỌNG: Cấu hình LLM, Embedding, Storage
│   ├── config.ini                    # Cấu hình server (optional)
│   ├── docker-compose.yml            # ⭐ Cấu hình Docker deployment
│   └── pyproject.toml                # Python package config
│
├── 📦 CORE LIBRARY (Không nên sửa trực tiếp)
│   └── lightrag/
│       ├── __init__.py               # Entry point, exports LightRAG class
│       ├── lightrag.py               # ⭐⭐⭐ CORE: Class LightRAG chính
│       ├── base.py                   # ⭐⭐ Base classes & interfaces
│       ├── operate.py                # ⭐⭐ Core operations (chunking, extraction, querying)
│       ├── prompt.py                 # ⭐ Prompt templates
│       ├── constants.py              # Constants và default values
│       ├── utils.py                  # Utility functions
│       ├── utils_graph.py            # Graph utilities
│       ├── types.py                  # Type definitions
│       ├── namespace.py              # Workspace isolation
│       ├── rerank.py                 # Reranking functionality
│       ├── exceptions.py             # Custom exceptions
│       │
│       ├── kg/                       # ⭐⭐ Storage implementations
│       │   ├── __init__.py
│       │   ├── shared_storage.py     # Shared storage utilities
│       │   ├── json_kv_impl.py      # JSON KV storage (default)
│       │   ├── postgres_impl.py     # PostgreSQL storage
│       │   ├── neo4j_impl.py        # Neo4j graph storage
│       │   ├── mongo_impl.py        # MongoDB storage
│       │   ├── redis_impl.py        # Redis storage
│       │   ├── milvus_impl.py       # Milvus vector storage
│       │   ├── qdrant_impl.py       # Qdrant vector storage
│       │   ├── faiss_impl.py        # Faiss vector storage
│       │   └── ...
│       │
│       ├── llm/                      # ⭐⭐ LLM provider implementations
│       │   ├── __init__.py
│       │   ├── openai.py             # OpenAI implementation
│       │   ├── ollama.py             # Ollama implementation
│       │   ├── gemini.py             # Google Gemini
│       │   ├── azure_openai.py       # Azure OpenAI
│       │   ├── bedrock.py            # AWS Bedrock
│       │   ├── anthropic.py          # Anthropic Claude
│       │   └── ...
│       │
│       └── api/                      # ⭐⭐ API Server
│           ├── lightrag_server.py    # ⭐⭐⭐ Main FastAPI server
│           ├── config.py             # Server configuration
│           ├── auth.py               # Authentication
│           ├── utils_api.py          # API utilities
│           ├── routers/              # API routes
│           │   ├── document_routes.py
│           │   ├── query_routes.py
│           │   ├── graph_routes.py
│           │   └── ollama_api.py
│           └── static/               # Static files
│
├── 🎨 FRONTEND (Có thể tùy chỉnh)
│   └── lightrag_webui/
│       ├── src/                      # React/TypeScript source
│       ├── package.json              # Frontend dependencies
│       └── vite.config.ts            # Vite config
│
├── 📚 EXAMPLES (Tham khảo, có thể sửa)
│   └── examples/
│       ├── lightrag_openai_demo.py   # ⭐ Basic usage example
│       ├── lightrag_ollama_demo.py
│       └── ...
│
├── 🧪 TESTS (Không nên sửa trừ khi thêm test mới)
│   └── tests/
│
└── 📖 DOCS (Tài liệu tham khảo)
    └── docs/
```

---

## ✅ File Có Thể Sửa (Safe to Modify)

### 🔧 Configuration Files
| File | Mục đích | Khi nào sửa |
|------|----------|-------------|
| `.env` | ⭐⭐⭐ Cấu hình LLM, Embedding, Storage, Server | Luôn luôn - đây là file chính để config |
| `config.ini` | Cấu hình server bổ sung | Khi cần override config từ .env |
| `docker-compose.yml` | Docker deployment config | Khi deploy với Docker |
| `pyproject.toml` | Python package metadata | Khi thêm dependencies mới |

### 📝 Examples & Custom Code
| File | Mục đích | Khi nào sửa |
|------|----------|-------------|
| `examples/*.py` | Ví dụ sử dụng | Tạo script mới dựa trên examples |
| Custom scripts | Script riêng của bạn | Tạo file mới trong thư mục riêng |

### 🎨 Frontend Customization
| File | Mục đích | Khi nào sửa |
|------|----------|-------------|
| `lightrag_webui/src/*` | UI components | Khi tùy chỉnh giao diện |
| `lightrag_webui/tailwind.config.js` | Styling config | Khi thay đổi theme |

### 🧪 Tests (Thêm mới)
| File | Mục đích | Khi nào sửa |
|------|----------|-------------|
| `tests/test_*.py` | Test cases | Thêm test cases mới |

---

## ❌ File KHÔNG Nên Sửa (Core Library)

### ⚠️ Core Implementation Files
Những file này là core của LightRAG, sửa có thể phá vỡ chức năng:

```
❌ lightrag/lightrag.py          # Core LightRAG class
❌ lightrag/base.py              # Base interfaces
❌ lightrag/operate.py           # Core operations
❌ lightrag/prompt.py            # Prompt templates (trừ khi extend)
❌ lightrag/constants.py         # Constants
❌ lightrag/kg/*_impl.py         # Storage implementations
❌ lightrag/llm/*.py             # LLM implementations
❌ lightrag/api/lightrag_server.py # API server core
```

**Lý do không nên sửa:**
- Sẽ bị ghi đè khi update LightRAG
- Có thể phá vỡ compatibility
- Khó maintain và debug

---

## 🔄 Cách Mở Rộng LightRAG (Extension Points)

### 1. Custom Storage Backend
**Tạo file mới:** `lightrag/kg/my_custom_storage.py`

```python
from lightrag.base import BaseKVStorage, BaseVectorStorage, BaseGraphStorage

class MyCustomStorage(BaseKVStorage):
    # Implement required methods
    pass
```

**Đăng ký:** Thêm vào `lightrag/kg/__init__.py`

### 2. Custom LLM Provider
**Tạo file mới:** `lightrag/llm/my_custom_llm.py`

```python
async def my_custom_llm_complete(prompt, system_prompt=None, **kwargs):
    # Your implementation
    pass
```

**Sử dụng:** Inject vào LightRAG constructor

### 3. Custom Prompts
**Tạo file mới:** `my_custom_prompts.py`

```python
from lightrag.prompt import PROMPTS

# Extend or override prompts
CUSTOM_PROMPTS = {
    "entity_extraction": "Your custom prompt..."
}
```

**Sử dụng:** Pass vào LightRAG với `addon_params`

### 4. Custom API Routes
**Tạo file mới:** `lightrag/api/routers/my_custom_routes.py`

```python
from fastapi import APIRouter

def create_my_custom_routes(rag, api_key):
    router = APIRouter()
    # Add your routes
    return router
```

**Đăng ký:** Thêm vào `lightrag/api/lightrag_server.py`

---

## 🗺️ Roadmap - Hướng Dẫn Tùy Chỉnh

### Phase 1: Setup & Configuration (1-2 ngày)
- [ ] Copy `.env.example` → `.env`
- [ ] Cấu hình LLM và Embedding models
- [ ] Chọn storage backend (PostgreSQL/Neo4j/MongoDB/etc.)
- [ ] Test với `examples/lightrag_openai_demo.py`

**Files cần sửa:**
- ✅ `.env` - Cấu hình chính

### Phase 2: Custom Integration (3-5 ngày)
- [ ] Tạo custom script sử dụng LightRAG
- [ ] Tích hợp vào ứng dụng của bạn
- [ ] Customize query parameters

**Files cần tạo:**
- ✅ `my_app/lightrag_integration.py` - Script riêng của bạn
- ✅ `my_app/config.py` - Config riêng (optional)

**Files KHÔNG sửa:**
- ❌ `lightrag/lightrag.py`
- ❌ `lightrag/operate.py`

### Phase 3: Custom Storage/LLM (1-2 tuần)
- [ ] Implement custom storage backend (nếu cần)
- [ ] Implement custom LLM provider (nếu cần)
- [ ] Test integration

**Files cần tạo:**
- ✅ `lightrag/kg/my_storage.py` - Custom storage
- ✅ `lightrag/llm/my_llm.py` - Custom LLM

**Files cần sửa:**
- ✅ `lightrag/kg/__init__.py` - Đăng ký storage mới
- ✅ `lightrag/api/config.py` - Thêm binding option (nếu dùng API)

### Phase 4: API Customization (1 tuần)
- [ ] Tùy chỉnh API routes
- [ ] Thêm authentication logic
- [ ] Customize response format

**Files cần tạo:**
- ✅ `lightrag/api/routers/my_routes.py` - Custom routes

**Files cần sửa:**
- ✅ `lightrag/api/lightrag_server.py` - Đăng ký routes mới

### Phase 5: Frontend Customization (1-2 tuần)
- [ ] Tùy chỉnh WebUI
- [ ] Thêm features mới
- [ ] Customize styling

**Files có thể sửa:**
- ✅ `lightrag_webui/src/**/*.tsx` - UI components
- ✅ `lightrag_webui/tailwind.config.js` - Styling

---

## 📋 Checklist Khi Tùy Chỉnh

### ✅ Trước khi sửa file core:
- [ ] Đã đọc documentation
- [ ] Đã thử giải pháp qua configuration
- [ ] Đã check extension points
- [ ] Đã backup code gốc

### ✅ Khi tạo extension mới:
- [ ] Tuân theo interface từ `base.py`
- [ ] Thêm tests cho code mới
- [ ] Document usage
- [ ] Đăng ký đúng cách

### ✅ Khi update LightRAG:
- [ ] Backup customizations
- [ ] Check changelog
- [ ] Test lại sau update
- [ ] Merge conflicts nếu có

---

## 🎯 Best Practices

### 1. Configuration Over Code
**✅ Đúng:**
```python
# Sử dụng .env để config
LLM_MODEL=gpt-4o
EMBEDDING_MODEL=text-embedding-3-large
```

**❌ Sai:**
```python
# Hardcode trong code
rag = LightRAG(llm_model_func=hardcoded_func)
```

### 2. Extension Over Modification
**✅ Đúng:**
```python
# Tạo custom storage class
class MyStorage(BaseKVStorage):
    pass
```

**❌ Sai:**
```python
# Sửa trực tiếp file core
# lightrag/kg/json_kv_impl.py
```

### 3. Examples as Templates
**✅ Đúng:**
```python
# Copy example và modify
cp examples/lightrag_openai_demo.py my_app/rag_service.py
```

**❌ Sai:**
```python
# Sửa trực tiếp example files
```

---

## 🔍 Quick Reference

### File Quan Trọng Nhất
1. **`.env`** - ⭐⭐⭐ Cấu hình chính
2. **`lightrag/lightrag.py`** - ⭐⭐⭐ Core class
3. **`lightrag/api/lightrag_server.py`** - ⭐⭐⭐ API server
4. **`docker-compose.yml`** - ⭐⭐ Docker config

### Extension Points
1. **Storage:** `lightrag/kg/` - Tạo class mới kế thừa `Base*Storage`
2. **LLM:** `lightrag/llm/` - Tạo function mới theo signature
3. **API:** `lightrag/api/routers/` - Tạo router mới
4. **Prompts:** Extend `PROMPTS` dict trong `prompt.py`

### Configuration Files
- **`.env`** - Environment variables (chính)
- **`config.ini`** - Server config (optional)
- **`docker-compose.yml`** - Docker deployment

---

## 📞 Khi Cần Giúp Đỡ

1. **Check documentation:** `docs/` folder
2. **Xem examples:** `examples/` folder
3. **Check issues:** GitHub Issues
4. **Read AGENTS.md:** Development guidelines

---

**Lưu ý:** Luôn backup code trước khi sửa, và ưu tiên configuration/extension thay vì modification trực tiếp vào core files.


