# LightRAG Quick Start Guide

**Last Updated**: 2026-01-05
**For**: Non-Production & Production Deployment

---

## 🚀 Quick Deployment Guide

### Prerequisites
- Ubuntu 22.04 LTS (recommended)
- Docker 20.10+ and Docker Compose 2.0+ (for Docker deployment)
- Python 3.10+ (for native deployment)
- OpenAI API key (or use Ollama for free local deployment)

---

## ⚡ Option 1: Non-Production (Development) - Fastest Start

### Step 1: Update Configuration
```bash
cd /Volumes/data/123/RAG/LightRAG
cp .env.nonprod .env
nano .env
```

**CRITICAL: Change these lines:**
```env
# Line 204: Add your OpenAI API key
LLM_BINDING_API_KEY=sk-proj-YOUR_ACTUAL_OPENAI_KEY_HERE

# Line 311: Add your OpenAI API key for embeddings
EMBEDDING_BINDING_API_KEY=sk-proj-YOUR_ACTUAL_OPENAI_KEY_HERE
```

### Step 2: Start with Docker
```bash
# Create required directories
mkdir -p data/nonprod/{inputs,rag_storage,tiktoken}
mkdir -p logs/nonprod

# Start services
docker-compose -f docker-compose.nonprod.yml up -d

# Check status
docker-compose -f docker-compose.nonprod.yml ps

# View logs
docker-compose -f docker-compose.nonprod.yml logs -f lightrag
```

### Step 3: Verify
```bash
# Health check
curl http://localhost:9621/health

# Open in browser
open http://localhost:9621
```

**Default Login:**
- Username: `admin`
- Password: `admin123`

### Step 4: Test Upload
```bash
# Upload a test document
curl -X POST http://localhost:9621/documents/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test.txt"
```

---

## 🏢 Option 2: Production Deployment

### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y \
    docker.io \
    docker-compose \
    nginx \
    certbot \
    python3-certbot-nginx

# Create user
sudo useradd -r -s /bin/bash -d /opt/lightrag lightrag
sudo mkdir -p /opt/lightrag
sudo chown lightrag:lightrag /opt/lightrag
```

### Step 2: Clone Repository
```bash
sudo -u lightrag bash
cd /opt/lightrag
git clone https://github.com/HKUDS/LightRAG.git .
```

### Step 3: Configure Production Environment
```bash
cp .env.prod .env
nano .env
```

**CRITICAL: Update ALL these values:**
```env
# Line 46-47: Change authentication
AUTH_ACCOUNTS='admin:YOUR_STRONG_PASSWORD_HERE'
TOKEN_SECRET=RANDOM_32_CHAR_STRING_HERE

# Line 70: Change API key
LIGHTRAG_API_KEY=RANDOM_32_CHAR_API_KEY_HERE

# Line 204: OpenAI API key
LLM_BINDING_API_KEY=sk-YOUR_PRODUCTION_OPENAI_KEY

# Line 311: OpenAI embedding key
EMBEDDING_BINDING_API_KEY=sk-YOUR_PRODUCTION_OPENAI_KEY

# Line 121: Cohere reranker (optional but recommended)
RERANK_BINDING_API_KEY=YOUR_COHERE_API_KEY

# Line 388-390: PostgreSQL credentials
POSTGRES_HOST=your-postgres-host.com
POSTGRES_USER=lightrag_prod_user
POSTGRES_PASSWORD='STRONG_PASSWORD_HERE'

# Line 476: Redis URI
REDIS_URI=redis://your-redis-host.com:6379

# Line 498-500: Langfuse (monitoring)
LANGFUSE_SECRET_KEY="YOUR_LANGFUSE_SECRET"
LANGFUSE_PUBLIC_KEY="YOUR_LANGFUSE_PUBLIC"
```

**Generate Strong Secrets:**
```bash
# Generate TOKEN_SECRET
openssl rand -hex 32

# Generate LIGHTRAG_API_KEY
openssl rand -hex 32
```

### Step 4: Setup SSL Certificate
```bash
# For your domain
sudo certbot --nginx -d rag.yourdomain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

### Step 5: Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/lightrag
```

**Copy this configuration:**
```nginx
upstream lightrag_backend {
    server 127.0.0.1:9621;
    keepalive 64;
}

server {
    listen 443 ssl http2;
    server_name rag.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/rag.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rag.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=lightrag:10m rate=10r/s;
    limit_req zone=lightrag burst=20 nodelay;

    # Max upload size
    client_max_body_size 100M;

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

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/lightrag /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Setup PostgreSQL
```bash
sudo -u postgres psql <<EOF
CREATE USER lightrag_prod_user WITH PASSWORD 'YOUR_STRONG_PASSWORD';
CREATE DATABASE lightrag_production OWNER lightrag_prod_user;
\c lightrag_production
CREATE EXTENSION vector;
GRANT ALL PRIVILEGES ON DATABASE lightrag_production TO lightrag_prod_user;
EOF
```

### Step 7: Start Production Services
```bash
cd /opt/lightrag

# Create directories
mkdir -p backups/postgres
mkdir -p config

# Create Redis config
cat > config/redis.conf <<EOF
bind 127.0.0.1
protected-mode yes
port 6379
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize no
supervised no
pidfile /var/run/redis_6379.pid
loglevel notice
logfile ""
databases 16
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /data
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
EOF

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 8: Verify Production Deployment
```bash
# Health check
curl https://rag.yourdomain.com/health

# Check SSL
curl -I https://rag.yourdomain.com

# Test API
curl -X GET https://rag.yourdomain.com/api/health \
  -H "X-API-Key: YOUR_LIGHTRAG_API_KEY"
```

### Step 9: Setup Systemd Service (Optional - for non-Docker)
```bash
sudo tee /etc/systemd/system/lightrag.service <<EOF
[Unit]
Description=LightRAG Production Service
After=network.target postgresql.service redis.service

[Service]
Type=notify
User=lightrag
Group=lightrag
WorkingDirectory=/opt/lightrag
Environment="PATH=/opt/lightrag/venv/bin"
ExecStart=/usr/local/bin/docker-compose -f /opt/lightrag/docker-compose.prod.yml up
ExecStop=/usr/local/bin/docker-compose -f /opt/lightrag/docker-compose.prod.yml down
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable lightrag
sudo systemctl start lightrag
```

---

## 🔧 Configuration Summary

### Files Created
```
LightRAG/
├── .env.nonprod                    # Non-production config
├── .env.prod                       # Production config
├── docker-compose.nonprod.yml      # Non-prod Docker setup
├── docker-compose.prod.yml         # Production Docker setup
├── DEPLOYMENT_INFO.md              # Complete deployment docs
├── ARCHITECTURE_DIAGRAM.md         # System architecture
└── QUICK_START.md                  # This file
```

### What to Share with Your Team

**For the person asking:**

**1. Repository Info:**
- Repo: `https://github.com/HKUDS/LightRAG`
- Version: 1.4.9.11
- License: MIT

**2. Stack Technology:**
```
Backend:
  - Python 3.10+ (FastAPI)
  - PostgreSQL 14+ (with pgvector)
  - Redis 7+
  - Neo4j (optional)

Frontend:
  - React 19
  - TypeScript
  - Vite + Bun

LLM/AI:
  - OpenAI (GPT-4o, embeddings)
  - Cohere (reranking)
  - Langfuse (monitoring)
```

**3. Domain:**
- Non-prod: `http://localhost:9621` or `http://dev.yourdomain.com:9621`
- Production: `https://rag.yourdomain.com`

**4. Database:**
- Non-prod: JSON files (no DB needed) or optional Redis
- Production: PostgreSQL + Redis (+ optional Neo4j)

**5. Monitoring:**
- Logs: `/var/log/lightrag/` and `/var/log/nginx/`
- Health: `https://rag.yourdomain.com/health`
- Langfuse: `https://cloud.langfuse.com` (if enabled)

**6. Port:**
- Application: 9621 (behind Nginx reverse proxy in production)
- PostgreSQL: 5432 (internal only)
- Redis: 6379 (internal only)

**7. Features:**
- 6 query modes (naive, local, global, hybrid, mix, bypass)
- Multi-format document processing (PDF, DOCX, PPTX, XLSX, TXT, MD)
- Knowledge graph construction
- Vector + graph retrieval
- Reranking for improved quality
- Citations and source tracking
- Streaming responses
- Multi-language support
- RESTful API + WebUI
- Authentication (JWT + API keys)

**8. Server:**
- OS: Ubuntu 22.04 LTS
- Min specs (prod): 8 vCPU, 32GB RAM, 500GB SSD
- Recommended: 16 vCPU, 64GB RAM, 1TB NVMe

**9. High Level Diagram:**
See `ARCHITECTURE_DIAGRAM.md` for complete diagrams

---

## 🆓 FREE Local Deployment (No API Costs)

If you want to avoid OpenAI costs, use Ollama:

### Step 1: Install Ollama
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Download Models
```bash
# Download LLM model
ollama pull qwen2.5:14b

# Download embedding model
ollama pull bge-m3:latest
```

### Step 3: Update .env
```bash
nano .env
```

**Comment out OpenAI, uncomment Ollama:**
```env
# LLM Configuration
LLM_BINDING=ollama
LLM_MODEL=qwen2.5:14b
LLM_BINDING_HOST=http://localhost:11434
LLM_BINDING_API_KEY=ollama
OLLAMA_LLM_NUM_CTX=32768

# Embedding Configuration
EMBEDDING_BINDING=ollama
EMBEDDING_MODEL=bge-m3:latest
EMBEDDING_DIM=1024
EMBEDDING_BINDING_HOST=http://localhost:11434
EMBEDDING_BINDING_API_KEY=ollama
```

### Step 4: Start
```bash
# Start Ollama (if not running)
ollama serve &

# Start LightRAG
docker-compose -f docker-compose.nonprod.yml up -d
```

**Pros:**
- 100% free
- No API costs
- Full privacy (local)
- No internet needed (after download)

**Cons:**
- Requires GPU for good performance
- Slower than cloud APIs
- Lower quality than GPT-4o

---

## 📊 Useful Commands

### Docker Commands
```bash
# Start services
docker-compose -f docker-compose.nonprod.yml up -d
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.nonprod.yml down
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose logs -f lightrag

# Restart single service
docker-compose restart lightrag

# Check resource usage
docker stats

# Clean up
docker system prune -a
```

### System Commands
```bash
# Check service status
sudo systemctl status lightrag

# View logs
sudo journalctl -u lightrag -f

# Check disk usage
df -h

# Check memory
free -h

# Check PostgreSQL
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Backup database
docker exec lightrag-postgres-prod pg_dump -U lightrag_prod lightrag_production > backup.sql
```

### API Testing
```bash
# Health check
curl http://localhost:9621/health

# Upload document
curl -X POST http://localhost:9621/documents/upload \
  -H "X-API-Key: YOUR_API_KEY" \
  -F "file=@document.pdf"

# Query
curl -X POST http://localhost:9621/query \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is this about?", "mode": "mix"}'
```

---

## 🆘 Troubleshooting

### Service won't start
```bash
# Check logs
docker-compose logs lightrag

# Check port conflicts
sudo netstat -tulpn | grep 9621

# Check disk space
df -h
```

### Can't connect to database
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Test connection
docker exec -it lightrag-postgres-prod psql -U lightrag_prod -d lightrag_production
```

### Out of memory
```bash
# Check memory usage
free -h
docker stats

# Reduce concurrency in .env
MAX_ASYNC=4
MAX_PARALLEL_INSERT=2
```

### SSL certificate issues
```bash
# Renew certificate
sudo certbot renew

# Check expiry
sudo certbot certificates

# Test nginx config
sudo nginx -t
```

---

## 📞 Support

- **Documentation**: `DEPLOYMENT_INFO.md`
- **Architecture**: `ARCHITECTURE_DIAGRAM.md`
- **GitHub Issues**: https://github.com/HKUDS/LightRAG/issues
- **API Docs**: `http://localhost:9621/docs` (Swagger UI)

---

**Good luck with your deployment!** 🚀
