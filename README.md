# 🏥 LightRAG Insurance Chatbot

Vietnamese insurance domain chatbot powered by the LightRAG framework.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](https://www.docker.com/)

---

## 🎯 Overview

This project is a **production-ready** Vietnamese insurance chatbot built on the [LightRAG](https://github.com/HKUDS/LightRAG) framework, customized for the insurance domain with:

- 🇻🇳 **Vietnamese language support** with insurance-specific prompts
- 📊 **Custom knowledge graphs** for insurance products and regulations
- 🔍 **Hybrid retrieval** combining Neo4j (graph) + PostgreSQL pgvector (semantic search)
- ⚡ **Docker deployment** with health checks and production configuration
- 📚 **11 insurance documents** pre-indexed (MIC, PVI, VNI regulations)

---

## ✨ Key Features

### Domain Customization

- **Custom Prompts**: Vietnamese insurance query response and entity extraction
- **Hyperparameters**: Optimized for Vietnamese legal document chunking
- **Knowledge Base**: 11 normalized insurance regulations and product rules

### Technical Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Graph Database** | Neo4j 5.26 | Entity relationships & graph traversal |
| **Vector Database** | PostgreSQL 16 + pgvector | Semantic search (1536d embeddings) |
| **API Server** | LightRAG FastAPI | REST API & Web UI |
| **Embeddings** | OpenAI text-embedding-3-small | Document & query vectorization |
| **LLM** | OpenAI compatible API | Entity extraction & query generation |

### Indexed Documents

- ✅ MIC CARE Health Insurance Rules 2025
- ✅ MIC Auto Voluntary Insurance Rules 2025
- ✅ MIC Personal Accident Insurance Rules 2025
- ✅ MIC Travel Insurance (Domestic/International/Worldwide) 2025
- ✅ PVI Personal Accident Insurance Rules 2025
- ✅ VNI Home Private Insurance Rules 2019
- ✅ Government Decree 03/2021 (TNDS Regulation)
- ✅ Shared Non-Life Insurance Glossary

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- OpenAI API key (or compatible endpoint)

### 1. Clone & Configure

```bash
git clone <your-repo-url>
cd LightRAG

# Copy and edit environment file
cp env.example .env
```

### 2. Configure `.env`

Edit `.env` and set your API credentials:

```bash
# LLM Configuration
LLM_BINDING=openai
LLM_MODEL=gpt-4o-mini
LLM_BINDING_API_KEY=sk-your-api-key-here

# Embedding Configuration (DO NOT CHANGE after first run)
EMBEDDING_BINDING=openai
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIM=1536
EMBEDDING_BINDING_API_KEY=sk-your-api-key-here

# Database
POSTGRES_PASSWORD=your-secure-password
NEO4J_AUTH=neo4j/your-secure-password
```

### 3. Start Services

```bash
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker logs lightrag --tail 100
```

### 4. Access Web UI

Open your browser:

- **Web UI**: http://localhost:9621/docs
- **API Documentation**: http://localhost:9621/docs
- **Neo4j Browser**: http://localhost:7474 (username: `neo4j`)

### 5. Upload Documents (Optional)

Documents are already pre-uploaded in `data/inputs/insurance_graph_kb/__enqueued__/`.

To re-index or add new documents:

1. Login to Web UI
2. Go to **Documents** tab
3. Upload `.md` files
4. Wait for processing to complete

---

## 📂 Project Structure

```
LightRAG/
├── custom_prompts/              # Vietnamese insurance prompts
│   ├── insurance_query_response.txt
│   └── insurance_entity_extraction.txt
├── config/                      # Custom configuration
│   └── insurance_hyperparameters.env
├── data/
│   ├── inputs/insurance_graph_kb/__enqueued__/  # 11 insurance docs
│   ├── rag_storage/insurance_graph_kb/          # Vector storage
│   ├── neo4j/                   # Graph database
│   └── postgres/                # Vector database
├── docs/                        # Reorganized documentation
│   ├── architecture/
│   ├── deployment/
│   ├── development/
│   ├── planning/
│   └── assessment/
├── docker-compose.yml           # Production deployment
├── .env                         # Configuration (not in git)
└── README.md                    # This file
```

---

## 🔧 Configuration

### Custom Hyperparameters

See [`config/insurance_hyperparameters.env`](config/insurance_hyperparameters.env):

```bash
# Optimized for insurance legal documents
CHUNK_SIZE=1000                  # Smaller chunks for precise legal text
CHUNK_OVERLAP_SIZE=150           # Higher overlap to preserve context
TOP_K=15                         # More results for comprehensive coverage
COSINE_THRESHOLD=0.25            # Lower threshold for better recall
```

### Custom Prompts

- **Query Response**: [`custom_prompts/insurance_query_response.txt`](custom_prompts/insurance_query_response.txt)
  - Emphasizes accuracy, source citation, and risk warnings
  - Structured responses with proper formatting
  
- **Entity Extraction**: [`custom_prompts/insurance_entity_extraction.txt`](custom_prompts/insurance_entity_extraction.txt)
  - Extracts insurance-specific entities (products, regulations, conditions)

---

## 📖 Usage

### Query via Web UI

1. Go to http://localhost:9621
2. Navigate to **Retrieval** tab
3. Enter query: `"Bảo hiểm TNDS xe máy bồi thường tối đa bao nhiêu?"`
4. View results with sources

### Query via API

```bash
curl -X POST http://localhost:9621/query/stream \
  -H "Content-Type: application/json" \
  -d '{
    "workspace": "insurance_graph_kb",
    "query": "Bảo hiểm sức khỏe là gì?",
    "mode": "hybrid"
  }'
```

### Query Modes

| Mode | Description | Best For |
|------|-------------|---------|
| `local` | Entity-focused retrieval | Specific product/regulation questions |
| `global` | Relationship-focused | Broad overview questions |
| `hybrid` | Combines local + global | Most general use cases |
| `naive` | Simple vector search | Quick lookups |
| `mix` | KG + vector blended | Complex multi-hop questions |

---

## 🔍 Troubleshooting

### Check Container Health

```bash
docker-compose ps
docker logs lightrag --tail 50
docker logs neo4j --tail 50
docker logs lightrag-postgres --tail 50
```

### Common Issues

**1. No query results (`[no-context]`)**
- Check if documents are processed: `docker logs lightrag | grep "Completed processing"`
- Verify vector index created: `docker logs lightrag | grep "HNSW index"`

**2. Dimension mismatch error**
- Ensure `EMBEDDING_DIM=1536` matches `text-embedding-3-small`
- If changing models, delete `data/rag_storage/` and `data/postgres/`

**3. Out of memory**
- Reduce `LLM_MODEL_MAX_ASYNC` in `.env`
- Increase Docker memory limit

---

## 📚 Documentation

- **Architecture**: [docs/architecture/ARCHITECTURE_DIAGRAM.md](docs/architecture/ARCHITECTURE_DIAGRAM.md)
- **Deployment Guide**: [docs/deployment/DOCKER_COMPOSE_GUIDE.md](docs/deployment/DOCKER_COMPOSE_GUIDE.md)
- **Quick Start**: [docs/deployment/QUICK_START.md](docs/deployment/QUICK_START.md)
- **Development**: [docs/development/CUSTOMIZATION_GUIDE.md](docs/development/CUSTOMIZATION_GUIDE.md)

---

## 🛠️ Development

### Adding New Documents

1. Place `.md` files in `data/inputs/insurance_graph_kb/`
2. Files will auto-process on next restart
3. Or upload via Web UI

### Modifying Prompts

Edit files in `custom_prompts/` and restart containers:

```bash
docker-compose restart lightrag
```

### Changing Hyperparameters

Edit `config/insurance_hyperparameters.env` and restart.

---

## 📊 Performance

Tested with **11 insurance documents** (~500KB text):

- **Knowledge Graph**: 840 entities, 577 relations
- **Processing Time**: ~15 minutes (first run)
- **Query Response**: <2 seconds (average)
- **Vector Search**: Sub-second retrieval

---

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

For issues or questions:

- **Project Issues**: Open an issue in this repository
- **Insurance Domain**: Review [docs/assessment/INSURANCE_CHATBOT_ASSESSMENT.md](docs/assessment/INSURANCE_CHATBOT_ASSESSMENT.md)

---

**Made with ❤️ for the Vietnamese insurance industry**
