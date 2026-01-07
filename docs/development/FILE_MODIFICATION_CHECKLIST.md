# ✅ LightRAG - Checklist Sửa Đổi File

## 🟢 FILE CÓ THỂ SỬA (Safe to Modify)

### Configuration Files
- [x] `.env` - ⭐⭐⭐ **QUAN TRỌNG NHẤT** - Cấu hình LLM, Embedding, Storage
- [x] `config.ini` - Cấu hình server bổ sung
- [x] `docker-compose.yml` - Docker deployment
- [x] `pyproject.toml` - Python package config (khi thêm dependencies)

### Your Own Files
- [x] `my_app/*.py` - Scripts riêng của bạn
- [x] `examples/*.py` - Copy và modify (không sửa trực tiếp)
- [x] Custom extensions trong thư mục riêng

### Frontend (Nếu tùy chỉnh UI)
- [x] `lightrag_webui/src/**/*.tsx` - React components
- [x] `lightrag_webui/tailwind.config.js` - Styling

---

## 🔴 FILE KHÔNG NÊN SỬA (Core Library)

### Core Implementation
- [ ] `lightrag/lightrag.py` - ⚠️ Core LightRAG class
- [ ] `lightrag/base.py` - ⚠️ Base interfaces
- [ ] `lightrag/operate.py` - ⚠️ Core operations
- [ ] `lightrag/prompt.py` - ⚠️ Prompt templates
- [ ] `lightrag/constants.py` - ⚠️ Constants
- [ ] `lightrag/utils.py` - ⚠️ Core utilities

### Storage Implementations
- [ ] `lightrag/kg/json_kv_impl.py`
- [ ] `lightrag/kg/postgres_impl.py`
- [ ] `lightrag/kg/neo4j_impl.py`
- [ ] `lightrag/kg/mongo_impl.py`
- [ ] `lightrag/kg/*_impl.py` - Tất cả storage implementations

### LLM Implementations
- [ ] `lightrag/llm/openai.py`
- [ ] `lightrag/llm/ollama.py`
- [ ] `lightrag/llm/gemini.py`
- [ ] `lightrag/llm/*.py` - Tất cả LLM implementations

### API Server Core
- [ ] `lightrag/api/lightrag_server.py` - ⚠️ Main API server
- [ ] `lightrag/api/config.py` - ⚠️ Server config logic

---

## 🟡 FILE CÓ THỂ MỞ RỘNG (Extension Points)

### Tạo File Mới - Custom Storage
```python
# ✅ Tạo mới: lightrag/kg/my_storage.py
from lightrag.base import BaseKVStorage

class MyStorage(BaseKVStorage):
    # Implement methods
    pass
```

**Cần sửa:**
- [ ] `lightrag/kg/__init__.py` - Đăng ký storage mới

### Tạo File Mới - Custom LLM
```python
# ✅ Tạo mới: lightrag/llm/my_llm.py
async def my_llm_complete(prompt, **kwargs):
    # Your implementation
    pass
```

**Không cần sửa file core** - Chỉ inject vào LightRAG constructor

### Tạo File Mới - Custom API Routes
```python
# ✅ Tạo mới: lightrag/api/routers/my_routes.py
from fastapi import APIRouter

def create_my_routes(rag, api_key):
    router = APIRouter()
    # Add routes
    return router
```

**Cần sửa:**
- [ ] `lightrag/api/lightrag_server.py` - Thêm router vào app

---

## 📋 Checklist Trước Khi Sửa File Core

- [ ] Đã đọc documentation đầy đủ?
- [ ] Đã thử giải pháp qua configuration?
- [ ] Đã check extension points?
- [ ] Đã backup code gốc?
- [ ] Đã hiểu rõ impact của thay đổi?
- [ ] Có plan để maintain sau khi update LightRAG?

**Nếu trả lời "Không" cho bất kỳ câu nào → KHÔNG SỬA file core!**

---

## 🎯 Quick Decision Tree

```
Cần thay đổi chức năng?
│
├─> Có thể làm qua .env/config?
│   └─> ✅ SỬA .env hoặc config.ini
│
├─> Cần tạo storage/LLM mới?
│   └─> ✅ TẠO FILE MỚI trong kg/ hoặc llm/
│
├─> Cần thêm API endpoint?
│   └─> ✅ TẠO FILE MỚI trong api/routers/
│
└─> Phải sửa logic core?
    └─> ⚠️ CẨN THẬN! 
        └─> Backup trước
        └─> Document thay đổi
        └─> Test kỹ
        └─> Có plan maintain
```

---

## 📝 Template Cho Custom Extension

### Custom Storage Template
```python
# lightrag/kg/my_custom_storage.py
from lightrag.base import BaseKVStorage
from typing import Optional

class MyCustomStorage(BaseKVStorage):
    def __init__(self, connection_string: str):
        self.conn = connection_string
        # Initialize your storage
    
    async def get(self, key: str) -> Optional[str]:
        # Implement
        pass
    
    async def put(self, key: str, value: str):
        # Implement
        pass
    
    # ... implement other required methods
```

### Custom LLM Template
```python
# lightrag/llm/my_custom_llm.py
from typing import Optional, List, Dict

async def my_custom_llm_complete(
    prompt: str,
    system_prompt: Optional[str] = None,
    history_messages: List[Dict[str, str]] = [],
    **kwargs
) -> str:
    """
    Custom LLM completion function
    
    Args:
        prompt: User prompt
        system_prompt: System prompt (optional)
        history_messages: Conversation history
        **kwargs: Additional parameters
    
    Returns:
        Generated text response
    """
    # Your implementation
    pass
```

---

## 🔍 File Quan Trọng Theo Mức Độ

### ⭐⭐⭐ Rất Quan Trọng (Luôn cần check)
1. `.env` - Configuration chính
2. `lightrag/lightrag.py` - Core class
3. `lightrag/api/lightrag_server.py` - API server

### ⭐⭐ Quan Trọng (Cần hiểu khi extend)
1. `lightrag/base.py` - Interfaces
2. `lightrag/operate.py` - Core operations
3. `lightrag/kg/__init__.py` - Storage registry
4. `lightrag/api/config.py` - API config

### ⭐ Tham Khảo (Đọc để hiểu)
1. `lightrag/prompt.py` - Prompt templates
2. `lightrag/constants.py` - Constants
3. `examples/*.py` - Usage examples

---

## 💡 Best Practices Summary

1. **Configuration > Code** - Ưu tiên `.env` config
2. **Extension > Modification** - Tạo mới thay vì sửa
3. **Examples > Core** - Copy examples làm template
4. **Backup > Regret** - Luôn backup trước khi sửa
5. **Document > Assume** - Document mọi thay đổi

---

**Nhớ:** Khi nghi ngờ → Đọc documentation → Hỏi community → Backup → Mới sửa!


