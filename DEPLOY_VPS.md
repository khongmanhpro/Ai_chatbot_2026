# 🚀 Hướng Dẫn Deploy LightRAG lên VPS

Hướng dẫn clone và chạy LightRAG + Chat Demo trên VPS Ubuntu/Debian không gặp lỗi.

## ✅ Yêu Cầu Hệ Thống

### Tối Thiểu
- **OS**: Ubuntu 20.04+ hoặc Debian 11+
- **RAM**: 4GB (khuyến nghị 8GB+)
- **CPU**: 2 cores (khuyến nghị 4+ cores)
- **Disk**: 20GB free space
- **Docker**: 20.10+
- **Docker Compose**: 2.0+

### Ports Cần Mở
```bash
9621  # LightRAG API
7474  # Neo4j Browser (optional)
7687  # Neo4j Bolt
5432  # PostgreSQL (optional, nếu expose)
```

## 📦 Bước 1: Cài Đặt Docker

### Ubuntu/Debian
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (để không cần sudo)
sudo usermod -aG docker $USER

# Logout và login lại để apply group changes
```

### Kiểm Tra Docker
```bash
docker --version
docker compose version
```

## 📥 Bước 2: Clone Repository

```bash
# Tạo thư mục làm việc
mkdir -p ~/apps
cd ~/apps

# Clone repository
git clone https://github.com/khongmanhpro/Ai_chatbot_2026.git
cd Ai_chatbot_2026

# Kiểm tra files
ls -la chat-demo/
ls -la optimizations/
```

## ⚙️ Bước 3: Cấu Hình Environment

### Copy file env mẫu
```bash
cp .env.example .env
```

### Chỉnh sửa .env
```bash
nano .env  # hoặc vi .env
```

### Cấu hình tối thiểu cần thay đổi:

```bash
# === LLM Configuration ===
LLM_BINDING=openai          # hoặc provider bạn dùng
LLM_MODEL=gpt-4o-mini       # hoặc model bạn muốn
LLM_BINDING_API_KEY=sk-xxx  # API key của bạn

# === Embedding Configuration ===
EMBEDDING_BINDING=openai
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_BINDING_API_KEY=sk-xxx  # Cùng key hoặc key khác

# === API Security ===
API_KEYS=["your-secure-api-key-here"]  # Đổi thành key mạnh

# === Database Passwords ===
POSTGRES_PASSWORD=your-strong-password-here
NEO4J_AUTH=neo4j/your-strong-password-here

# === Optional: Rerank ===
RERANK_BINDING=jina
RERANK_BINDING_API_KEY=jina_xxx
```

### Lưu file
- **nano**: Ctrl+O, Enter, Ctrl+X
- **vi**: Esc, `:wq`, Enter

## 🚀 Bước 4: Khởi Động Services

### Start tất cả containers
```bash
# Build và start
docker compose up -d

# Xem logs
docker compose logs -f

# Hoặc xem logs của 1 service cụ thể
docker logs lightrag -f
```

### Kiểm tra containers
```bash
docker ps

# Output mong đợi:
# CONTAINER ID   IMAGE                                    STATUS
# xxxx           ghcr.io/hkuds/lightrag:latest           Up
# xxxx           neo4j:5.26.0                            Up
# xxxx           pgvector/pgvector:pg16                  Up
```

## ✅ Bước 5: Verify Deployment

### 1. Kiểm tra API Health
```bash
curl http://localhost:9621/health

# Hoặc từ máy khác (thay YOUR_VPS_IP)
curl http://YOUR_VPS_IP:9621/health
```

Response OK:
```json
{
  "status": "healthy",
  "configuration": {...}
}
```

### 2. Test Query Endpoint
```bash
curl -X POST http://localhost:9621/query/stream \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{
    "query": "Test",
    "mode": "mix",
    "stream": true
  }'
```

### 3. Kiểm tra Chat Demo
```bash
# Mở browser và truy cập
http://YOUR_VPS_IP:9621/

# Sẽ redirect đến chat demo hoặc API docs
```

## 📂 Bước 6: Upload Documents

### Option 1: Copy từ local
```bash
# Từ máy local
scp -r ./insurance-docs user@VPS_IP:~/apps/Ai_chatbot_2026/data/inputs/

# Trên VPS
cd ~/apps/Ai_chatbot_2026
docker restart lightrag
```

### Option 2: Upload qua API
```bash
curl -X POST http://YOUR_VPS_IP:9621/documents/text \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Nội dung tài liệu...",
    "description": "Tài liệu bảo hiểm",
    "metadata": {"source": "manual"}
  }'
```

## 🌐 Bước 7: Setup Nginx (Optional - Recommended)

### Install Nginx
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Cấu hình Nginx
```bash
sudo nano /etc/nginx/sites-available/lightrag
```

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Thay bằng domain của bạn

    # Chat Demo
    location / {
        proxy_pass http://localhost:9621;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Streaming support
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}
```

### Enable site
```bash
sudo ln -s /etc/nginx/sites-available/lightrag /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Setup SSL (Optional)
```bash
sudo certbot --nginx -d your-domain.com
```

## 🔧 Troubleshooting

### Lỗi: Port already in use
```bash
# Tìm process đang dùng port
sudo lsof -i :9621

# Kill process
sudo kill -9 <PID>

# Hoặc stop service cũ
docker compose down
```

### Lỗi: Docker permission denied
```bash
# Thêm user vào docker group
sudo usermod -aG docker $USER

# Logout và login lại
exit
# SSH vào lại
```

### Lỗi: Container keeps restarting
```bash
# Xem logs
docker logs lightrag --tail 100

# Kiểm tra .env
cat .env | grep -E "API_KEY|PASSWORD"

# Restart services
docker compose down
docker compose up -d
```

### Lỗi: Out of memory
```bash
# Kiểm tra RAM
free -h

# Tăng swap (nếu cần)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Lỗi: Neo4j connection failed
```bash
# Kiểm tra Neo4j logs
docker logs neo4j

# Restart Neo4j
docker restart neo4j

# Wait 30s và retry
sleep 30
docker restart lightrag
```

## 📊 Monitoring

### Xem tài nguyên
```bash
# CPU, Memory usage
docker stats

# Disk usage
df -h
docker system df
```

### Xem logs
```bash
# All services
docker compose logs -f

# Specific service
docker logs lightrag -f --tail 100
docker logs neo4j -f --tail 100
docker logs lightrag-postgres -f --tail 100
```

### Cleanup
```bash
# Xóa unused images
docker image prune -a

# Xóa unused volumes
docker volume prune

# Full cleanup (cẩn thận!)
docker system prune -a --volumes
```

## 🔄 Update Code

### Pull latest changes
```bash
cd ~/apps/Ai_chatbot_2026

# Backup .env
cp .env .env.backup

# Pull updates
git pull origin main

# Restore .env nếu bị overwrite
cp .env.backup .env

# Rebuild và restart
docker compose down
docker compose up -d --build
```

## 🔐 Security Best Practices

### 1. Firewall
```bash
# Install UFW
sudo apt install -y ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow LightRAG (nếu không dùng Nginx)
sudo ufw allow 9621/tcp

# Enable firewall
sudo ufw enable
```

### 2. Đổi API Keys định kỳ
```bash
nano .env
# Đổi API_KEYS
docker compose restart lightrag
```

### 3. Giới hạn kết nối (Nginx)
```nginx
# Trong /etc/nginx/sites-available/lightrag
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location / {
    limit_req zone=api_limit burst=20 nodelay;
    # ... rest of config
}
```

## 📞 Support

- **GitHub**: https://github.com/khongmanhpro/Ai_chatbot_2026
- **Chat Demo**: `/chat-demo/index.html`
- **API Docs**: `http://YOUR_VPS_IP:9621/docs`

---

## ✅ Quick Deploy Script

Tạo file `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying LightRAG..."

# 1. Clone repo
cd ~/apps
git clone https://github.com/khongmanhpro/Ai_chatbot_2026.git || true
cd Ai_chatbot_2026

# 2. Pull latest
git pull origin main

# 3. Copy env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys!"
    exit 1
fi

# 4. Start services
docker compose down
docker compose up -d --build

# 5. Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# 6. Health check
curl -f http://localhost:9621/health || {
    echo "❌ Health check failed!"
    docker compose logs
    exit 1
}

echo "✅ Deployment successful!"
echo "🌐 Access: http://$(curl -s ifconfig.me):9621"
```

Chạy:
```bash
chmod +x deploy.sh
./deploy.sh
```
