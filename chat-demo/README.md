# 🛡️ Giao Diện Chat Bảo Hiểm - LightRAG Demo

Giao diện chat tiếng Việt để test API LightRAG cho chatbot bảo hiểm.

## ✨ Tính Năng

- 💬 **Real-time Streaming**: Nhận phản hồi từng đoạn như ChatGPT
- 🎨 **Thiết kế đẹp**: Glassmorphism, gradient, animations mượt mà
- 📱 **Responsive**: Tương thích mọi thiết bị (mobile, tablet, desktop)
- ⚙️ **Cấu hình linh hoạt**: Tùy chỉnh API key, mode, top_k
- 📚 **API Docs đầy đủ**: Hướng dẫn cho dev team với code examples

## 🚀 Cách Sử Dụng

### 1. Khởi động LightRAG Server

```bash
cd /Volumes/data/123/RAG/LightRAG
docker-compose up -d
```

Server sẽ chạy tại: `http://localhost:9621`

### 2. Mở Chat Interface

Mở file `index.html` bằng trình duyệt:

```bash
# Cách 1: Click đúp vào file index.html

# Cách 2: Dùng Python HTTP server
cd chat-demo
python3 -m http.server 8000
# Mở http://localhost:8000
```

### 3. Cấu hình API Key

1. Click nút **⚙️ Cài đặt**
2. Nhập API key (lấy từ file `.env` → biến `API_KEYS`)
3. Kiểm tra API URL: `http://localhost:9621`
4. Click **Lưu cài đặt**

### 4. Bắt đầu chat!

Thử các câu hỏi mẫu:
- "Bảo hiểm xe máy là gì?"
- "Quy trình bồi thường như thế nào?"
- "Tính phí bảo hiểm ô tô"

## 📁 Cấu Trúc File

```
chat-demo/
├── index.html          # Giao diện chat chính
├── api-docs.html       # Tài liệu API (cho dev team)
├── style.css           # Styling với glassmorphism
├── app.js              # Logic xử lý chat + streaming
├── config.js           # Cấu hình API
└── README.md           # File này
```

## 🎯 Query Modes

| Mode | Mô tả | Khi nào dùng |
|------|-------|-------------|
| `mix` | Kết hợp local + global | **Khuyến nghị** - Đa số trường hợp |
| `hybrid` | Vector + keyword search | Cân bằng độ chính xác |
| `local` | Tìm theo entities gần | Câu hỏi cụ thể |
| `global` | Toàn bộ knowledge graph | Câu hỏi tổng quan |
| `naive` | Vector search đơn giản | Testing |

## 🔧 Cấu Hình Nâng Cao

Chỉnh sửa `config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:9621',  // API endpoint
    DEFAULT_MODE: 'mix',                     // Query mode
    DEFAULT_TOP_K: 60,                       // Số kết quả
    API_KEY: '',                             // Hoặc hardcode API key
};
```

## 📚 API Documentation

Mở `api-docs.html` để xem:
- Authentication guide
- Endpoint reference
- Request/Response schemas
- Code examples (cURL, JavaScript, Python)
- Error codes
- Best practices

## 🐛 Xử Lý Lỗi

### Lỗi kết nối
- Kiểm tra server đã chạy: `docker ps | grep lightrag`
- Kiểm tra port 9621: `curl http://localhost:9621/health`

### Lỗi 401 Unauthorized
- Kiểm tra API key trong cài đặt
- Xem API key trong `.env`: `grep API_KEYS .env`

### Response bị treo
- Reload page và thử lại
- Kiểm tra Docker logs: `docker logs lightrag --tail 50`

## 📦 Deploy cho Dev Team

### Option 1: Gửi thư mục chat-demo
```bash
# Nén toàn bộ thư mục
cd /Volumes/data/123/RAG/LightRAG
zip -r chat-demo.zip chat-demo/

# Gửi file chat-demo.zip cho dev team
```

### Option 2: Host trên server
```bash
# Copy vào static folder của server
cp -r chat-demo /var/www/html/insurance-chat

# Hoặc dùng nginx
```

### Option 3: Integrate vào app hiện tại
- Copy code từ `app.js` (streaming logic)
- Tích hợp vào React/Vue/Angular app
- Tham khảo `api-docs.html` cho API integration

## 🎨 Customization

### Đổi màu sắc
Chỉnh trong `style.css`:
```css
:root {
    --primary-blue: #1e40af;      /* Màu chính */
    --primary-blue-light: #3b82f6; /* Màu nhạt */
    --success-green: #10b981;      /* Màu success */
}
```

### Thêm logo công ty
Trong `index.html`:
```html
<div class="logo-icon">
    <img src="your-logo.png" alt="Logo" />
</div>
```

## 📞 Support

- Kiểm tra logs: `docker logs lightrag`
- Swagger API: http://localhost:9621/docs
- GitHub: https://github.com/HKUDS/LightRAG

## 📝 License

Free to use for testing and development.
