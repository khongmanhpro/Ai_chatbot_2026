#!/bin/bash

# LightRAG Quick Setup Script
# Tự động setup cơ bản để chạy được ngay

set -e

echo "🚀 LightRAG Quick Setup"
echo "========================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Check if API keys are configured
echo ""
echo "🔑 Checking API Keys configuration..."
echo ""

LLM_KEY=$(grep "^LLM_BINDING_API_KEY=" .env | cut -d'=' -f2)
EMBED_KEY=$(grep "^EMBEDDING_BINDING_API_KEY=" .env | cut -d'=' -f2)

if [ "$LLM_KEY" = "your_api_key" ] || [ -z "$LLM_KEY" ]; then
    echo -e "${RED}⚠️  LLM_BINDING_API_KEY chưa được cấu hình!${NC}"
    echo ""
    echo "Bạn có muốn cấu hình ngay bây giờ? (y/n)"
    read -r response
    
    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        echo ""
        echo "Nhập OpenAI API Key cho LLM:"
        read -r llm_key
        if [ -n "$llm_key" ]; then
            # macOS
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|^LLM_BINDING_API_KEY=.*|LLM_BINDING_API_KEY=$llm_key|" .env
            else
                # Linux
                sed -i "s|^LLM_BINDING_API_KEY=.*|LLM_BINDING_API_KEY=$llm_key|" .env
            fi
            echo -e "${GREEN}✅ Đã cấu hình LLM_BINDING_API_KEY${NC}"
        fi
    fi
else
    echo -e "${GREEN}✅ LLM_BINDING_API_KEY đã được cấu hình${NC}"
fi

if [ "$EMBED_KEY" = "your_api_key" ] || [ -z "$EMBED_KEY" ]; then
    echo -e "${RED}⚠️  EMBEDDING_BINDING_API_KEY chưa được cấu hình!${NC}"
    echo ""
    echo "Bạn có muốn cấu hình ngay bây giờ? (y/n)"
    read -r response
    
    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        echo ""
        echo "Nhập OpenAI API Key cho Embedding:"
        read -r embed_key
        if [ -n "$embed_key" ]; then
            # macOS
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|^EMBEDDING_BINDING_API_KEY=.*|EMBEDDING_BINDING_API_KEY=$embed_key|" .env
            else
                # Linux
                sed -i "s|^EMBEDDING_BINDING_API_KEY=.*|EMBEDDING_BINDING_API_KEY=$embed_key|" .env
            fi
            echo -e "${GREEN}✅ Đã cấu hình EMBEDDING_BINDING_API_KEY${NC}"
        fi
    fi
else
    echo -e "${GREEN}✅ EMBEDDING_BINDING_API_KEY đã được cấu hình${NC}"
fi

# Create data directories
echo ""
echo "📁 Creating data directories..."
mkdir -p data/rag_storage data/inputs
echo -e "${GREEN}✅ Data directories created${NC}"

# Check Docker
echo ""
echo "🐳 Checking Docker..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker is installed${NC}"
    
    if docker compose version &> /dev/null; then
        echo -e "${GREEN}✅ Docker Compose is available${NC}"
        echo ""
        echo "Bạn có muốn chạy LightRAG với Docker ngay bây giờ? (y/n)"
        read -r response
        
        if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
            echo ""
            echo "🚀 Starting LightRAG with Docker..."
            docker compose up -d
            echo ""
            echo -e "${GREEN}✅ LightRAG đang chạy!${NC}"
            echo ""
            echo "📊 Kiểm tra status:"
            docker compose ps
            echo ""
            echo "📝 Xem logs:"
            echo "   docker compose logs -f lightrag"
            echo ""
            echo "🌐 Truy cập WebUI:"
            echo "   http://localhost:9621"
            echo ""
            echo "🔍 Health check:"
            sleep 3
            curl -s http://localhost:9621/health || echo "Server đang khởi động..."
        fi
    else
        echo -e "${YELLOW}⚠️  Docker Compose không tìm thấy${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker không được cài đặt${NC}"
    echo ""
    echo "Bạn có thể chạy native với:"
    echo "  lightrag-server"
fi

echo ""
echo "========================"
echo -e "${GREEN}✅ Setup hoàn tất!${NC}"
echo ""
echo "📚 Xem thêm:"
echo "  - SETUP_CHECKLIST.md - Checklist chi tiết"
echo "  - QUICK_START.md - Hướng dẫn nhanh"
echo "  - PROJECT_OVERVIEW.md - Tổng quan dự án"
echo ""


