## Tổng quan dự án ###

## Technology Stack

### Backend Core
```
Python 3.10+
├── FastAPI              # Web framework
├── Uvicorn              # ASGI server
├── Gunicorn             # Production WSGI server
├── Pydantic             # Data validation
├── AsyncIO              # Asynchronous operations
└── aiohttp              # Async HTTP client
```

### Frontend
```
React 19 + TypeScript
├── Vite                 # Build tool
├── Bun                  # Package manager & runtime
├── Tailwind CSS         # Styling
├── React Router         # Routing
├── Zustand              # State management
├── React Sigma          # Graph visualization
└── Radix UI             # UI components
```

### AI/ML Stack
```
LLM Providers:
├── OpenAI               # GPT models
├── Ollama                # Local LLM
├── Google Gemini         # Gemini models
├── Azure OpenAI          # Azure deployment
├── AWS Bedrock           # AWS LLM
├── Anthropic Claude      # Claude models

Embedding Models:
├── OpenAI Embeddings    # text-embedding-3-large
├── Ollama Embeddings    # nomic-embed-text, bge-m3
├── Gemini Embeddings    # text-embedding-004
├── Jina AI              # jina-embeddings-v4
└── Voyage AI            # voyage embeddings

Reranking:
├── Cohere               # rerank-v3.5
├── Jina AI              # jina-reranker-v2
└── Aliyun               # gte-rerank-v2
```

### Storage Stack
```
KV Storage:
├── JSON (default)       # JsonKVStorage
├── PostgreSQL           # PGKVStorage
├── Redis                # RedisKVStorage
└── MongoDB              # MongoKVStorage

Vector Storage:
├── NanoVectorDB (default) # NanoVectorDBStorage
├── PostgreSQL + pgvector # PGVectorStorage
├── Milvus               # MilvusVectorDBStorage
├── Qdrant               # QdrantVectorDBStorage
├── Faiss                # FaissVectorDBStorage
└── MongoDB Atlas         # MongoVectorDBStorage

Graph Storage:
├── NetworkX (default)    # NetworkXStorage
├── Neo4j                 # Neo4JStorage
├── PostgreSQL + AGE      # PGGraphStorage
├── Memgraph              # MemgraphStorage
└── MongoDB               # MongoGraphStorage

Document Status:
├── JSON (default)        # JsonDocStatusStorage
├── PostgreSQL            # PGDocStatusStorage
└── MongoDB               # MongoDocStatusStorage
```
## 100GB ##
### Development Tools
```
Package Management:
├── uv                    # Fast Python package manager
├── pip                   # Alternative package manager
└── Bun                   # Frontend package manager

Testing:
├── pytest                # Testing framework
├── pytest-asyncio        # Async testing
└── Vitest                # Frontend testing

Code Quality:
├── ruff                  # Linter
├── pre-commit            # Git hooks
└── ESLint                # Frontend linter

Documentation:
├── Markdown              # Documentation format
└── Swagger/OpenAPI       # API documentation
```

### Observability
```
├── Langfuse              # LLM observability & tracing
├── RAGAS                 # RAG evaluation framework
└── Custom logging        # Built-in logging system
```

---

## 🎯 Domain & Purpose

- **domain:** fiss.thegioiaiagent.online

### Problem Statement
 giải quyết các vấn đề của Large Language Models:
- **Knowledge Cutoff:** LLM không có thông tin mới nhất
- **Hallucinations:** LLM tạo ra thông tin sai khi không có grounding
- **Domain Expertise:** Thiếu kiến thức chuyên ngành

### Solution
- **Document-Grounded Responses:** Câu trả lời dựa trên tài liệu thực tế
- **Up-to-date Information:** Cập nhật thông tin mà không cần retrain model
- **Domain Expertise:** Tích hợp kiến thức chuyên ngành qua documents
- **Cost-Effective:** Tránh fine-tuning tốn kém
- **Transparency:** Hiển thị source documents cho mỗi response

### Use Cases
- **Document Q&A:** Hỏi đáp dựa trên tài liệu
- **Knowledge Base:** Xây dựng knowledge base từ documents
- **Research Assistant:** Hỗ trợ nghiên cứu với tài liệu chuyên ngành
- **Enterprise RAG:** RAG cho doanh nghiệp với documents nội bộ

---

## 💾 Database Support

### Supported Databases

#### 1. PostgreSQL (All-in-One)
```
Components:
├── KV Storage: PGKVStorage
├── Vector Storage: PGVectorStorage (pgvector extension)
├── Graph Storage: PGGraphStorage (Apache AGE extension)
└── Doc Status: PGDocStatusStorage

Requirements:
├── PostgreSQL >= 16.6
├── pgvector extension
└── Apache AGE extension (for graph)

Connection:
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=your_database
```

#### 2. Neo4j (Graph Database)
```
Components:
└── Graph Storage: Neo4JStorage

Connection:
NEO4J_URI=neo4j+s://xxxx.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password
NEO4J_DATABASE=neo4j
```

#### 3. MongoDB (All-in-One)
```
Components:
├── KV Storage: MongoKVStorage
├── Vector Storage: MongoVectorDBStorage (Atlas only)
├── Graph Storage: MongoGraphStorage
└── Doc Status: MongoDocStatusStorage

Connection:
MONGO_URI=mongodb://root:root@localhost:27017/
MONGO_DATABASE=LightRAG
```

#### 4. Redis (KV Storage)
```
Components:
├── KV Storage: RedisKVStorage
└── Doc Status: RedisDocStatusStorage

Connection:
REDIS_URI=redis://localhost:6379
REDIS_SOCKET_TIMEOUT=30
REDIS_MAX_CONNECTIONS=100
```

#### 5. Milvus (Vector Database)
```
Components:
└── Vector Storage: MilvusVectorDBStorage

Connection:
MILVUS_URI=http://localhost:19530
MILVUS_DB_NAME=lightrag
```

#### 6. Qdrant (Vector Database)
```
Components:
└── Vector Storage: QdrantVectorDBStorage

Connection:
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-api-key (optional)
```

#### 7. Memgraph (Graph Database)
```
Components:
└── Graph Storage: MemgraphStorage

Connection:
MEMGRAPH_URI=bolt://localhost:7687
```

#### 8. Default (File-based)
```
Components:
├── KV Storage: JsonKVStorage (JSON files)
├── Vector Storage: NanoVectorDBStorage (local files)
├── Graph Storage: NetworkXStorage (in-memory)
└── Doc Status: JsonDocStatusStorage (JSON files)

Location:
./rag_storage/ (working directory)
```

---

## 📊 Monitoring: Log & Performance

### Logging System

#### Log Configuration
```bash
# Log Level
LOG_LEVEL=INFO          # DEBUG, INFO, WARNING, ERROR, CRITICAL
VERBOSE=False           # Enable verbose debug (only for DEBUG)

# Log File
LOG_DIR=/path/to/log    # Default: current directory
LOG_MAX_BYTES=10485760  # 10MB per log file
LOG_BACKUP_COUNT=5      # Number of backup files
```

#### Log Files
```
lightrag.log            # Main log file
lightrag.log.1          # Rotated logs
lightrag.log.2
...
```

#### Logging Features
- **Structured Logging:** JSON format support
- **Log Rotation:** Automatic rotation by size
- **Multiple Levels:** DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Async Logging:** Non-blocking log writes
- **Context Information:** Request IDs, timestamps, etc.

### Performance Monitoring

#### Metrics Tracked
```
Token Usage:
├── LLM Input Tokens
├── LLM Output Tokens
├── Embedding Tokens
└── Total Cost Estimation

Query Performance:
├── Query Latency
├── Retrieval Time
├── LLM Generation Time
└── Total Response Time

Storage Performance:
├── Insert Throughput
├── Query Throughput
├── Cache Hit Rate
└── Storage Size
```

#### Observability Tools

**Langfuse Integration:**
```bash
# Install
pip install lightrag-hku[observability]

# Configure
LANGFUSE_SECRET_KEY=your_secret_key
LANGFUSE_PUBLIC_KEY=your_public_key
LANGFUSE_HOST=https://cloud.langfuse.com
LANGFUSE_ENABLE_TRACE=true
```

**Features:**
- LLM call tracing
- Token usage analytics
- Cost tracking
- Latency monitoring
- Error tracking

**RAGAS Evaluation:**
```bash
# Install
pip install lightrag-hku[evaluation]

# Features:
├── Context Precision
├── Context Recall
├── Faithfulness
├── Answer Relevance
└── Answer Semantic Similarity
```

### Performance Tuning

#### Concurrency Settings
```bash
MAX_ASYNC=4                    # Max concurrent LLM requests
MAX_PARALLEL_INSERT=2          # Parallel document processing
EMBEDDING_FUNC_MAX_ASYNC=16    # Max concurrent embeddings
EMBEDDING_BATCH_NUM=32          # Batch size for embeddings
```

#### Timeout Settings
```bash
LLM_TIMEOUT=180                # LLM request timeout (seconds)
EMBEDDING_TIMEOUT=30           # Embedding timeout (seconds)
TIMEOUT=150                    # Gunicorn worker timeout
```

#### Cache Settings
```bash
ENABLE_LLM_CACHE=true          # Enable LLM response cache
ENABLE_LLM_CACHE_FOR_EXTRACT=true  # Cache for extraction
```

---

## 🔌 Port Configuration

### Default Ports
```
LightRAG Server:    9621 (HTTP/HTTPS)
```

### Port Configuration
```bash
# Environment Variable
PORT=9621

# Command Line
lightrag-server --port 9621

# Docker Compose
ports:
  - "${PORT:-9621}:9621"
```

### Network Configuration
```bash
# Host Binding
HOST=0.0.0.0        # Listen on all interfaces
# or
HOST=127.0.0.1      # Listen on localhost only

# SSL/HTTPS (Optional)
SSL=true
SSL_CERTFILE=/path/to/cert.pem
SSL_KEYFILE=/path/to/key.pem
```

### External Services Ports
```
Ollama:             11434 (default)
LollMS:             9600 (default)
PostgreSQL:         5432 (default)
Neo4j:              7687 (Bolt), 7474 (HTTP)
MongoDB:            27017 (default)
Redis:              6379 (default)
Milvus:             19530 (default)
Qdrant:             6333 (HTTP), 6334 (gRPC)
Memgraph:           7687 (Bolt)
```

---

## ✨ Features

### Core Features

#### 1. Document Processing
- **Multi-format Support:** PDF, DOCX, PPTX, XLSX, TXT, CSV
- **Multimodal Support:** Text, images, tables, equations (via RAG-Anything)
- **Chunking:** Token-based chunking with overlap
- **Citation:** Source attribution and traceability
- **Batch Processing:** Parallel document indexing

#### 2. Knowledge Graph
- **Entity Extraction:** Automatic entity extraction from documents
- **Relation Extraction:** Relationship discovery between entities
- **Graph Storage:** Multiple graph database backends
- **Graph Visualization:** Interactive graph exploration in WebUI
- **Entity Management:** Create, edit, delete, merge entities
- **Relation Management:** Create, edit, delete relations

#### 3. Query Modes
- **Local Mode:** Context-dependent information retrieval
- **Global Mode:** Global knowledge utilization
- **Hybrid Mode:** Combines local and global retrieval
- **Naive Mode:** Basic vector search
- **Mix Mode:** Knowledge graph + vector retrieval (recommended)
- **Bypass Mode:** Direct LLM query without retrieval

#### 4. Retrieval & Reranking
- **Vector Search:** Semantic similarity search
- **Graph Traversal:** Entity and relation-based retrieval
- **Reranking:** Advanced reranking with multiple providers
- **Hybrid Retrieval:** Combine multiple retrieval methods
- **Token Budget Management:** Intelligent context size control

#### 5. API & WebUI
- **REST API:** Full-featured REST API
- **WebUI:** Modern React-based interface
- **Ollama Compatible:** Emulate as Ollama model
- **Authentication:** JWT-based auth and API keys
- **Document Management:** Upload, delete, manage documents
- **Graph Visualization:** Interactive knowledge graph viewer

#### 6. Storage & Scalability
- **Multiple Backends:** Choose storage based on needs
- **Workspace Isolation:** Multi-tenant support
- **Data Export:** Export knowledge graph to CSV/Excel/Markdown
- **Data Migration:** Tools for data migration
- **High Availability:** PostgreSQL HA support with retry logic

#### 7. Advanced Features
- **Streaming Responses:** Real-time response streaming
- **Conversation History:** Multi-turn conversation support
- **Custom Prompts:** Extendable prompt templates
- **Token Tracking:** Monitor token usage and costs
- **Cache Management:** LLM response caching
- **Document Deletion:** Smart deletion with KG regeneration

### Integration Features

#### LLM Providers
- OpenAI (GPT-4, GPT-3.5, etc.)
- Ollama (Local models)
- Google Gemini
- Azure OpenAI
- AWS Bedrock
- Anthropic Claude
- ZhipuAI
- Custom providers (extensible)

#### Embedding Providers
- OpenAI Embeddings
- Ollama Embeddings
- Gemini Embeddings
- Jina AI
- Voyage AI
- Custom embeddings (extensible)

#### Reranking Providers
- Cohere
- Jina AI
- Aliyun
- Custom rerankers (extensible)

---

## 🏗️ High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Web UI     │  │  REST API     │  │  Ollama API   │        │
│  │  (React)     │  │  (FastAPI)    │  │  Compatible   │        │
│  └──────┬───────┘  └──────┬────────┘  └──────┬───────┘        │
└─────────┼─────────────────┼───────────────────┼───────────────┘
          │                 │                   │
          └─────────────────┼───────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                     CORE LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Orchestrator                    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │  Document    │  │   Query      │  │  Graph    │ │   │
│  │  │  Processing  │  │   Engine     │  │  Manager  │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Operation Layer                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │   │
│  │  │ Chunking │  │Extraction │  │ Retrieval│         │   │
│  │  └──────────┘  └──────────┘  └──────────┘         │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬──────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  LLM Layer    │  │ Embedding     │  │  Reranking    │
│               │  │  Layer        │  │   Layer       │
│  ┌─────────┐  │  │  ┌─────────┐  │  │  ┌─────────┐ │
│  │ OpenAI  │  │  │  │ OpenAI  │  │  │  │ Cohere  │ │
│  │ Ollama  │  │  │  │ Ollama  │  │  │  │ Jina    │ │
│  │ Gemini  │  │  │  │ Gemini  │  │  │  │ Aliyun  │ │
│  │ ...     │  │  │  │ ...     │  │  │  │ ...     │ │
│  └─────────┘  │  │  └─────────┘  │  │  └─────────┘ │
└───────────────┘  └───────────────┘  └───────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    STORAGE LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  KV Storage  │  │Vector Storage│  │Graph Storage │     │
│  │              │  │              │  │              │     │
│  │  JSON        │  │  NanoVector  │  │  NetworkX    │     │
│  │  PostgreSQL  │  │  PostgreSQL  │  │  Neo4j       │     │
│  │  Redis       │  │  Milvus      │  │  PostgreSQL  │     │
│  │  MongoDB     │  │  Qdrant      │  │  Memgraph    │     │
│  │              │  │  Faiss       │  │  MongoDB     │     │
│  │              │  │  MongoDB     │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐                                          │
│  │Doc Status    │                                          │
│  │  Storage     │                                          │
│  │              │                                          │
│  │  JSON        │                                          │
│  │  PostgreSQL  │                                          │
│  │  MongoDB     │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Document Insertion Flow:
┌──────────┐
│ Document │
└────┬─────┘
     │
     ▼
┌─────────────┐
│  Chunking   │ ──► Text Chunks
└─────┬───────┘
      │
      ├──► Embedding ──► Vector Storage
      │
      └──► Entity/Relation Extraction ──► LLM
                │
                ├──► Entities ──► Graph Storage + Vector Storage
                │
                └──► Relations ──► Graph Storage + Vector Storage

Query Flow:
┌──────────┐
│  Query   │
└────┬─────┘
     │
     ▼
┌─────────────┐
│  Embedding  │ ──► Query Vector
└─────┬───────┘
      │
      ├──► Vector Search ──► Chunks
      │
      └──► Graph Traversal ──► Entities & Relations
                │
                └──► Related Chunks
      │
      ▼
┌─────────────┐
│  Reranking  │ ──► Top Chunks
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  LLM        │ ──► Final Response
└─────────────┘
```

---

## 🖥️ Server: Ubuntu Deployment

### System Requirements

#### Recommended Requirements
```
OS: Ubuntu 22.04 LTS
CPU: 4+ cores
RAM: 8GB+
Disk: 50GB+ SSD
Python: 3.12
```

