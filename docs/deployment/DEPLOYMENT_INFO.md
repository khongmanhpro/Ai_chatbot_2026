# LightRAG Deployment Information

**Document Version**: 1.0
**Last Updated**: 2026-01-05
**System**: LightRAG - Graph-Based RAG System
**Repository**: LightRAG (HKUDS)

---

## 📋 Quick Reference

| Item | Non-Production | Production |
|------|----------------|------------|
| **Environment** | Dev/Staging/Testing | Production |
| **Port** | 9621 | 9621 (behind reverse proxy) |
| **SSL** | No | Yes (Required) |
| **Domain** | localhost / dev.yourdomain.com | rag.yourdomain.com |
| **Config File** | `.env.nonprod` | `.env.prod` |

---

## 🏗️ Repository Information

### Repository Details
- **Name**: LightRAG
- **Organization**: HKUDS (Hong Kong University)
- **License**: MIT
- **Version**: 1.4.9.11
- **Package**: `lightrag-hku` (PyPI)
- **Repository URL**: `https://github.com/HKUDS/LightRAG`

### Repository Structure
```
LightRAG/
├── lightrag/                    # Core Python package (65 files)
│   ├── __init__.py             # Main exports
│   ├── lightrag.py             # Core LightRAG class (4,042 lines)
│   ├── operate.py              # Core operations (5,002 lines)
│   ├── base.py                 # Base interfaces (907 lines)
│   ├── utils.py                # Utilities (3,352 lines)
│   ├── kg/                     # Storage implementations (17 files)
│   ├── llm/                    # LLM providers (18 files)
│   ├── api/                    # FastAPI server (16 files)
│   └── evaluation/             # RAGAS evaluation (7 files)
├── lightrag_webui/             # React 19 + TypeScript UI
├── examples/                   # Usage examples (17 files)
├── tests/                      # Pytest test suite (23 files)
├── docs/                       # Documentation
├── k8s-deploy/                 # Kubernetes configs
├── .env.nonprod               # Non-prod configuration
├── .env.prod                  # Production configuration
└── docker-compose.yml         # Docker deployment
```

---

## 💻 Stack Technology

### Backend Stack
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Language** | Python | 3.10+ | Core application |
| **Web Framework** | FastAPI | Latest | REST API server |
| **Async Runtime** | AsyncIO | Built-in | Concurrent operations |
| **Graph Library** | NetworkX | Latest | Graph manipulation |
| **LLM Integration** | OpenAI SDK | Latest | LLM communication |
| **Validation** | Pydantic | Latest | Data validation |
| **Server** | Gunicorn | Latest | Production WSGI server |

### LLM & AI Stack
| Component | Options | Purpose |
|-----------|---------|---------|
| **LLM Provider** | OpenAI, Azure, Gemini, Claude, Ollama | Text generation |
| **Embedding** | OpenAI, Jina, Ollama | Vector embeddings |
| **Reranking** | Cohere, Jina, Aliyun | Result reranking |
| **Evaluation** | RAGAS | Quality assessment |
| **Observability** | Langfuse | Tracing & monitoring |

### Frontend Stack
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | React 19 | UI framework |
| **Language** | TypeScript | Type-safe JavaScript |
| **Build Tool** | Vite | Fast builds |
| **Runtime** | Bun | Package manager |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **i18n** | i18next | Multi-language support |

### Infrastructure Stack

#### Non-Production
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Storage** | JSON Files | Lightweight data storage |
| **Graph** | NetworkX (in-memory) | Graph operations |
| **Vector DB** | NanoVectorDB | Lightweight vector search |
| **Cache** | In-memory | LLM response caching |

#### Production
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Database** | PostgreSQL 14+ | Primary data store |
| **Extensions** | pgvector | Vector similarity search |
| **Cache** | Redis 7+ | Fast caching layer |
| **Graph DB** | Neo4j / PostgreSQL | Knowledge graph storage |
| **Vector DB** | Milvus / Qdrant (optional) | Scalable vector search |
| **Load Balancer** | Nginx / Traefik | Traffic distribution |
| **Monitoring** | Langfuse + Prometheus | Observability |

---

## 🗄️ Database Configuration

### Non-Production Database
**Type**: File-based storage (No external database required)
- **KV Storage**: JSON files in `WORKING_DIR`
- **Vector Storage**: NanoVectorDB (local)
- **Graph Storage**: NetworkX (in-memory)
- **Pros**: Easy setup, no dependencies
- **Cons**: Not scalable, single instance only

### Production Database

#### Primary Option: PostgreSQL (Recommended)
**Why PostgreSQL?**
- All-in-one solution (KV, Vector, Graph, DocStatus)
- Proven reliability and performance
- Built-in vector support with pgvector
- ACID compliance
- Excellent tooling and community

**Required PostgreSQL Extensions:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
```

**Recommended Specs:**
| Environment | vCPU | RAM | Storage | Connections |
|-------------|------|-----|---------|-------------|
| Non-Prod | 2 | 4GB | 50GB SSD | 20 |
| Production | 8+ | 32GB+ | 500GB+ SSD | 100+ |

**PostgreSQL Configuration** (in `.env.prod`):
```env
POSTGRES_HOST=your-postgres-host.com
POSTGRES_PORT=5432
POSTGRES_USER=lightrag_prod_user
POSTGRES_PASSWORD='strong_password_here'
POSTGRES_DATABASE=lightrag_production
POSTGRES_MAX_CONNECTIONS=50
POSTGRES_VECTOR_INDEX_TYPE=HNSW
```

#### Alternative: MongoDB Atlas (All-in-one)
**Use Case**: Cloud-native, document-oriented needs
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGO_DATABASE=lightrag_production
```

#### Alternative: Neo4j (Best for Complex Graphs)
**Use Case**: Heavy graph traversal workloads
```env
NEO4J_URI=neo4j+s://instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD='password'
```

#### Redis Configuration (Required for Production)
**Purpose**: Caching, session management
```env
REDIS_URI=redis://your-redis-host.com:6379
REDIS_MAX_CONNECTIONS=200
```

**Redis Persistence** (redis.conf):
```conf
# AOF for durability
appendonly yes
appendfsync everysec

# RDB for backup
save 900 1
save 300 10
save 60 10000
```

---

## 🌐 Domain Configuration

### Non-Production Domains
```
Development:  http://localhost:9621
              http://dev.yourdomain.com:9621

Staging:      http://staging.yourdomain.com:9621
```

### Production Domain
```
Primary:      https://rag.yourdomain.com
Alt:          https://kb.yourdomain.com
              https://api-rag.yourdomain.com
```

### DNS Configuration
```dns
# A/AAAA Records
rag.yourdomain.com.    A    YOUR_SERVER_IP
rag.yourdomain.com.    AAAA YOUR_SERVER_IPv6

# For CDN/Proxy
rag.yourdomain.com.    CNAME proxy.cloudflare.com
```

### SSL/TLS Certificate
**Recommended**: Let's Encrypt with auto-renewal

**Setup with Certbot:**
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d rag.yourdomain.com

# Auto-renewal (already configured)
sudo certbot renew --dry-run
```

**Manual SSL Configuration** (in `.env.prod`):
```env
SSL=true
SSL_CERTFILE=/etc/ssl/certs/lightrag-cert.pem
SSL_KEYFILE=/etc/ssl/private/lightrag-key.pem
```

---

## 🔌 Port Configuration

### Default Ports
| Service | Port | Protocol | Purpose |
|---------|------|----------|---------|
| **LightRAG API** | 9621 | HTTP/HTTPS | Main application |
| **Web UI** | 9621 | HTTP/HTTPS | Built into API server |
| **PostgreSQL** | 5432 | TCP | Database |
| **Redis** | 6379 | TCP | Cache |
| **Neo4j** | 7687 | Bolt | Graph DB |
| **Ollama** | 11434 | HTTP | Local LLM (optional) |

### Firewall Rules (UFW)

**Non-Production:**
```bash
sudo ufw allow 9621/tcp comment 'LightRAG Dev'
sudo ufw allow 5432/tcp comment 'PostgreSQL'
sudo ufw allow 6379/tcp comment 'Redis'
```

**Production:**
```bash
# Only allow through reverse proxy
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 9621/tcp  # Block direct access
sudo ufw allow from 10.0.0.0/8 to any port 5432  # Internal only
```

### Nginx Reverse Proxy Configuration
```nginx
# /etc/nginx/sites-available/lightrag
upstream lightrag_backend {
    server 127.0.0.1:9621;
    keepalive 64;
}

server {
    listen 443 ssl http2;
    server_name rag.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/rag.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rag.yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=lightrag:10m rate=10r/s;
    limit_req zone=lightrag burst=20 nodelay;

    location / {
        proxy_pass http://lightrag_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for long-running requests
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name rag.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 Monitoring & Logging

### Log Configuration

**Non-Production:**
```env
LOG_LEVEL=DEBUG
VERBOSE=True
LOG_DIR=/app/logs
LOG_MAX_BYTES=10485760      # 10MB
LOG_BACKUP_COUNT=5
```

**Production:**
```env
LOG_LEVEL=INFO
VERBOSE=False
LOG_DIR=/var/log/lightrag
LOG_MAX_BYTES=52428800      # 50MB
LOG_BACKUP_COUNT=10
```

### Log Locations
```
Application Logs: /var/log/lightrag/lightrag.log
Access Logs:      /var/log/nginx/rag.yourdomain.com-access.log
Error Logs:       /var/log/nginx/rag.yourdomain.com-error.log
```

### Log Rotation
```bash
# /etc/logrotate.d/lightrag
/var/log/lightrag/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 lightrag lightrag
    sharedscripts
    postrotate
        systemctl reload lightrag
    endscript
}
```

### Performance Monitoring

**Langfuse** (Recommended for Production):
```env
LANGFUSE_SECRET_KEY="your_secret_key"
LANGFUSE_PUBLIC_KEY="your_public_key"
LANGFUSE_HOST="https://cloud.langfuse.com"
LANGFUSE_ENABLE_TRACE=true
```

**Health Check Endpoint:**
```bash
curl https://rag.yourdomain.com/health
```

**Metrics to Monitor:**
- API response time (p50, p95, p99)
- LLM token usage and cost
- Database query performance
- Cache hit rate
- Error rates by endpoint
- Concurrent users
- Document processing queue length

---

## 🎯 Features Overview

### Core Features
1. **Document Processing**
   - Multi-format support: PDF, DOCX, PPTX, XLSX, TXT, MD
   - Automatic chunking (configurable size)
   - Entity and relationship extraction
   - Knowledge graph construction
   - Batch upload support

2. **Knowledge Graph**
   - Automatic entity recognition (12+ types)
   - Relationship extraction and classification
   - Graph-based retrieval
   - Visual graph exploration (Web UI)
   - Incremental updates and merging

3. **Query Modes**
   - **naive**: Simple vector similarity
   - **local**: Entity-focused context retrieval
   - **global**: Global knowledge relationships
   - **hybrid**: Combined local + global
   - **mix**: KG + vector integrated (default)
   - **bypass**: Direct LLM query (no RAG)

4. **Advanced Capabilities**
   - **Reranking**: Improves retrieval quality (Cohere, Jina)
   - **Citations**: Source attribution with file paths
   - **Streaming**: Real-time response generation
   - **Multi-language**: Entity extraction in any language
   - **Multimodal**: Image support via RAG-Anything
   - **Evaluation**: RAGAS metrics integration

5. **API Features**
   - RESTful API with OpenAPI docs
   - JWT authentication
   - API key protection
   - Ollama-compatible chat interface
   - WebSocket support for streaming
   - Health check endpoints

6. **Web UI Features**
   - Document upload and management
   - Interactive knowledge graph visualization
   - Query interface with mode selection
   - Multi-language support (10+ languages)
   - Response history
   - User authentication

### Scalability Features
- Async/await architecture
- Configurable concurrency limits
- Connection pooling (DB, Redis)
- LLM response caching
- Batch embedding processing
- Horizontal scaling support (stateless API)

---

## 🖥️ Server Requirements

### Non-Production Server
**Minimum Specs:**
- **OS**: Ubuntu 22.04 LTS
- **CPU**: 2 vCPU
- **RAM**: 4GB
- **Storage**: 50GB SSD
- **Network**: 100 Mbps

**Recommended:**
- **OS**: Ubuntu 22.04 LTS
- **CPU**: 4 vCPU
- **RAM**: 8GB
- **Storage**: 100GB SSD

### Production Server
**Minimum Specs:**
- **OS**: Ubuntu 22.04 LTS (or Ubuntu 24.04 LTS)
- **CPU**: 8 vCPU
- **RAM**: 32GB
- **Storage**: 500GB SSD (NVMe preferred)
- **Network**: 1 Gbps
- **Backup**: Automated daily backups

**Recommended (High-Load):**
- **OS**: Ubuntu 22.04 LTS
- **CPU**: 16+ vCPU
- **RAM**: 64GB+
- **Storage**: 1TB+ NVMe SSD
- **Network**: 10 Gbps
- **Load Balancer**: Multiple instances behind LB

### OS Configuration
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y \
    python3.10 \
    python3.10-venv \
    python3-pip \
    git \
    nginx \
    redis-server \
    postgresql-14 \
    postgresql-contrib \
    certbot \
    python3-certbot-nginx

# Install PostgreSQL extensions
sudo -u postgres psql -c "CREATE EXTENSION vector;"

# System limits
sudo tee -a /etc/security/limits.conf <<EOF
*  soft  nofile  65536
*  hard  nofile  65536
EOF

# Sysctl tuning
sudo tee -a /etc/sysctl.conf <<EOF
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 8192
vm.overcommit_memory = 1
EOF
sudo sysctl -p
```

---

## 🚀 Deployment Steps

### Non-Production Deployment

**1. Clone Repository:**
```bash
cd /opt
git clone https://github.com/HKUDS/LightRAG.git
cd LightRAG
```

**2. Setup Python Environment:**
```bash
python3.10 -m venv venv
source venv/bin/activate
pip install -e .
```

**3. Configure Environment:**
```bash
cp .env.nonprod .env
nano .env  # Edit API keys
```

**4. Create Directories:**
```bash
mkdir -p /app/data/inputs
mkdir -p /app/data/rag_storage
mkdir -p /app/logs
```

**5. Start Server:**
```bash
lightrag-server
```

**6. Verify:**
```bash
curl http://localhost:9621/health
```

### Production Deployment

**1. Setup User:**
```bash
sudo useradd -r -s /bin/bash -d /opt/lightrag lightrag
sudo mkdir -p /opt/lightrag
sudo chown lightrag:lightrag /opt/lightrag
```

**2. Clone and Install:**
```bash
sudo -u lightrag bash
cd /opt/lightrag
git clone https://github.com/HKUDS/LightRAG.git .
python3.10 -m venv venv
source venv/bin/activate
pip install -e .
pip install gunicorn
```

**3. Configure Environment:**
```bash
cp .env.prod .env
nano .env  # Update ALL credentials
chmod 600 .env
```

**4. Setup PostgreSQL:**
```bash
sudo -u postgres psql <<EOF
CREATE USER lightrag_prod_user WITH PASSWORD 'strong_password';
CREATE DATABASE lightrag_production OWNER lightrag_prod_user;
\c lightrag_production
CREATE EXTENSION vector;
GRANT ALL PRIVILEGES ON DATABASE lightrag_production TO lightrag_prod_user;
EOF
```

**5. Setup Systemd Service:**
```bash
sudo tee /etc/systemd/system/lightrag.service <<EOF
[Unit]
Description=LightRAG API Server
After=network.target postgresql.service redis.service

[Service]
Type=notify
User=lightrag
Group=lightrag
WorkingDirectory=/opt/lightrag
Environment="PATH=/opt/lightrag/venv/bin"
ExecStart=/opt/lightrag/venv/bin/lightrag-gunicorn
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable lightrag
sudo systemctl start lightrag
```

**6. Setup Nginx:**
```bash
# Copy nginx config from above
sudo ln -s /etc/nginx/sites-available/lightrag /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**7. Setup SSL:**
```bash
sudo certbot --nginx -d rag.yourdomain.com
```

**8. Verify Deployment:**
```bash
curl https://rag.yourdomain.com/health
sudo systemctl status lightrag
sudo journalctl -u lightrag -f
```

---

## 🔐 Security Checklist

### Pre-Deployment
- [ ] Change all default passwords in `.env.prod`
- [ ] Generate strong `TOKEN_SECRET` (min 32 chars)
- [ ] Generate strong `LIGHTRAG_API_KEY` (min 32 chars)
- [ ] Update `AUTH_ACCOUNTS` with strong passwords
- [ ] Configure SSL certificates
- [ ] Set proper CORS origins
- [ ] Review firewall rules
- [ ] Disable password-based SSH (use keys only)

### Database Security
- [ ] Use strong database passwords
- [ ] Enable PostgreSQL SSL connections
- [ ] Restrict database access to application server only
- [ ] Configure regular automated backups
- [ ] Test backup restoration procedure
- [ ] Enable query logging for auditing

### Application Security
- [ ] Enable `SSL=true` in `.env.prod`
- [ ] Configure proper CORS (no wildcards)
- [ ] Set up rate limiting (nginx/cloudflare)
- [ ] Enable Langfuse for request tracing
- [ ] Review and rotate API keys quarterly
- [ ] Implement API key rotation policy
- [ ] Set up WAF rules (Cloudflare, AWS WAF)

### Monitoring & Alerting
- [ ] Configure log aggregation (ELK, Datadog)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error alerting (PagerDuty, Slack)
- [ ] Monitor LLM API usage and costs
- [ ] Set up database performance monitoring
- [ ] Configure disk space alerts
- [ ] Set up SSL certificate expiry alerts

---

## 📚 Additional Resources

### Documentation
- **Main Docs**: `/Volumes/data/123/RAG/LightRAG/README.md`
- **Algorithm**: `/Volumes/data/123/RAG/LightRAG/docs/Algorithm.md`
- **Docker Deployment**: `/Volumes/data/123/RAG/LightRAG/docs/DockerDeployment.md`
- **API Documentation**: `https://rag.yourdomain.com/docs` (Swagger UI)

### Useful Commands
```bash
# Check service status
sudo systemctl status lightrag

# View logs
sudo journalctl -u lightrag -f

# Restart service
sudo systemctl restart lightrag

# Check nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Check disk usage
df -h

# Check memory usage
free -h

# Check PostgreSQL connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Backup database
pg_dump -U lightrag_prod_user lightrag_production > backup.sql
```

### Support Contacts
- **Repository Issues**: https://github.com/HKUDS/LightRAG/issues
- **Documentation**: https://github.com/HKUDS/LightRAG/tree/main/docs

---

## 📞 Emergency Procedures

### Service Down
1. Check service status: `sudo systemctl status lightrag`
2. Check logs: `sudo journalctl -u lightrag -n 100`
3. Check disk space: `df -h`
4. Check memory: `free -h`
5. Restart service: `sudo systemctl restart lightrag`

### Database Issues
1. Check PostgreSQL status: `sudo systemctl status postgresql`
2. Check connections: `sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"`
3. Check logs: `sudo tail -f /var/log/postgresql/postgresql-14-main.log`
4. Restart PostgreSQL: `sudo systemctl restart postgresql`

### High Memory Usage
1. Check processes: `top` or `htop`
2. Reduce `MAX_ASYNC` in `.env`
3. Reduce `MAX_PARALLEL_INSERT` in `.env`
4. Restart service: `sudo systemctl restart lightrag`

### SSL Certificate Expiry
1. Check expiry: `sudo certbot certificates`
2. Renew manually: `sudo certbot renew`
3. Reload nginx: `sudo systemctl reload nginx`

---

**END OF DOCUMENT**
