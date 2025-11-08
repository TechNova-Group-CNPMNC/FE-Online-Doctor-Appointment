# 🚀 Hướng Dẫn Deploy Frontend

## 📋 Chuẩn Bị

### 1. Tạo file `.env` (cho development) hoặc cấu hình biến môi trường (cho production)

Tạo file `.env` trong thư mục `clinic-frontend/`:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000/api

# Google Gemini API Key cho chatbot AI
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Lưu ý:**

- Thay `http://localhost:8000/api` bằng URL backend thực tế khi deploy production
- Lấy Gemini API Key từ: https://aistudio.google.com/app/api-keys

---

## 🏗️ Build Project

```bash
cd clinic-frontend

# Cài đặt dependencies (nếu chưa có)
npm install

# Build production
npm run build
```

Sau khi build, thư mục `dist/` sẽ chứa các file tĩnh sẵn sàng deploy.

---

## 🌐 Các Cách Deploy

### Option 1: Firebase Hosting (Đã có cấu hình sẵn)

```bash
# Cài Firebase CLI (nếu chưa có)
npm install -g firebase-tools

# Đăng nhập Firebase
firebase login

# Khởi tạo project (nếu chưa có)
firebase init

# Deploy
firebase deploy
```

**Cấu hình biến môi trường trên Firebase:**

- Vào Firebase Console > Hosting > Settings
- Thêm biến môi trường trong build settings

---

### Option 2: Vercel

```bash
# Cài Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Cấu hình biến môi trường trên Vercel:**

- Vào Vercel Dashboard > Project Settings > Environment Variables
- Thêm:
  - `VITE_API_BASE_URL` = URL backend của bạn
  - `VITE_GEMINI_API_KEY` = API key của bạn

---

### Option 3: Netlify

```bash
# Cài Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

**Cấu hình biến môi trường trên Netlify:**

- Vào Netlify Dashboard > Site Settings > Environment Variables
- Thêm các biến như trên

---

### Option 4: Deploy lên VPS/Server (Nginx)

1. **Build project:**

```bash
npm run build
```

2. **Copy thư mục `dist/` lên server:**

```bash
scp -r dist/* user@your-server:/var/www/clinic-frontend/
```

3. **Cấu hình Nginx:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/clinic-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## ⚙️ Cấu Hình Quan Trọng

### Backend API URL

Khi deploy production, **PHẢI** thay đổi `VITE_API_BASE_URL`:

```env
# Development
VITE_API_BASE_URL=http://localhost:8000/api

# Production (ví dụ)
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### CORS trên Backend

Đảm bảo backend cho phép CORS từ domain frontend của bạn:

```java
// Spring Boot - CORS config
@CrossOrigin(origins = "https://your-frontend-domain.com")
```

---

## ✅ Checklist Trước Khi Deploy

- [ ] Đã build thành công (`npm run build`)
- [ ] Đã cấu hình `VITE_API_BASE_URL` đúng với backend production
- [ ] Đã cấu hình `VITE_GEMINI_API_KEY` (nếu dùng chatbot)
- [ ] Backend đã được deploy và hoạt động
- [ ] Backend đã cấu hình CORS cho domain frontend
- [ ] Đã test trên môi trường production

---

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to API"

- Kiểm tra `VITE_API_BASE_URL` có đúng không
- Kiểm tra backend có đang chạy không
- Kiểm tra CORS trên backend

### Lỗi: "Gemini API Error"

- Kiểm tra `VITE_GEMINI_API_KEY` có đúng không
- Kiểm tra API key còn hạn không

### Lỗi: "404 on refresh"

- Đảm bảo server đã cấu hình redirect về `/index.html` (SPA routing)

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:

1. Console browser (F12) để xem lỗi
2. Network tab để kiểm tra API calls
3. Build logs khi deploy
