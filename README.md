# Thiết Lập Môi Trường Web App Đặt Lịch Phòng Khám (React + Spring Boot)

## 1. Chuẩn Bị Windows
- Cài Git for Windows, VS Code (thêm extension WSL), và IntelliJ IDEA hoặc Spring Tools Suite.
- Bật WSL2: mở PowerShell (Admin) chạy `wsl --install -d Ubuntu`, khởi động lại, tạo user/password.
- (Khuyến nghị) Bật Developer Mode và Windows Terminal để quản lý shell thuận tiện.

## 2. Cấu Hình Trong WSL (Ubuntu)
- Cập nhật hệ thống: `sudo apt update && sudo apt upgrade -y`.
- Cài tiện ích cơ bản: `sudo apt install git curl wget zip unzip -y`.
- Cấu hình Git: `git config --global user.name "Tên"`, `git config --global user.email "email"`.

## 3. Node.js & npm Cho React
- Cài NVM và Node LTS:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  source ~/.bashrc
  nvm install --lts
  nvm alias default node
  node -v
  npm -v
  ```
- (Tùy chọn) cài thêm Yarn: `npm install -g yarn`.

## 4. Java & Maven Cho Spring Boot
- Cài Temurin JDK 21:
  ```bash
  sudo apt install apt-transport-https wget -y
  wget -O- https://packages.adoptium.net/artifactory/api/gpg/key/public | sudo tee /etc/apt/trusted.gpg.d/adoptium.asc
  echo "deb https://packages.adoptium.net/artifactory/deb $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
  sudo apt update
  sudo apt install temurin-21-jdk -y
  ```
- Thêm vào `~/.bashrc`:
  ```bash
  export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk
  export PATH=$JAVA_HOME/bin:$PATH
  ```
  Chạy `source ~/.bashrc`, kiểm tra `java -version`.
- Cài Maven: `sudo apt install maven -y`, kiểm tra `mvn -v`.

## 5. Docker Desktop & WSL Integration
- Cài Docker Desktop, bật `Use the WSL 2 based engine` và tick Ubuntu trong `Settings > Resources > WSL Integration`.
- Trong WSL, xác nhận `docker version` hoạt động.
- Docker Compose v2 đã tích hợp cùng Docker Desktop.

## 6. Khởi Tạo Dự Án
### 6.1 Front-end (Vite + React)
```bash
mkdir -p ~/projects/clinic
cd ~/projects/clinic
npm create vite@latest clinic-frontend -- --template react
cd clinic-frontend
npm install
npm run dev -- --host 0.0.0.0
```
- Truy cập từ Windows: `http://localhost:5173`.
- Thêm thư viện: `npm install react-router-dom axios react-hook-form zustand` (ví dụ).

### 6.2 Back-end (Spring Boot)
```bash
cd ~/projects/clinic
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,security,validation,lombok,postgresql \
  -d language=java -d type=maven-project -d javaVersion=21 \
  -o clinic-backend.zip
unzip clinic-backend.zip -d clinic-backend
cd clinic-backend
./mvnw spring-boot:run
```
- Thiết lập `application.yml` kết nối PostgreSQL: `jdbc:postgresql://localhost:5432/clinic`.
- Thêm `springdoc-openapi` hoặc Swagger để kiểm tra API.

## 7. Docker Compose Mẫu
Tạo `docker-compose.yml` tại `~/projects/clinic`:
```yaml
version: "3.9"
services:
  backend:
    build: ./clinic-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      DB_URL: jdbc:postgresql://db:5432/clinic
      DB_USERNAME: postgres
      DB_PASSWORD: secret
    depends_on:
      - db

  frontend:
    build: ./clinic-frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:8080/api
    command: ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
    volumes:
      - ./clinic-frontend:/app
    depends_on:
      - backend

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: clinic
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

### Dockerfile Backend (`clinic-backend/Dockerfile`)
```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

### Dockerfile Frontend (`clinic-frontend/Dockerfile`)
```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]
```

- Chạy toàn bộ: `docker compose up --build` (từ thư mục gốc).
- React chạy ở `http://localhost:5173`, Spring Boot ở `http://localhost:8080`, PostgreSQL ở `localhost:5432`.

## 8. Kết Nối Front–Back
- Spring cấu hình CORS cho phép `http://localhost:5173`.
- Vite proxy (nếu cần) trong `vite.config.js`:
  ```js
  export default defineConfig({
    server: {
      proxy: {
        '/api': 'http://localhost:8080'
      }
    }
  })
  ```
- Lưu API base URL trong `.env` (`VITE_API_URL`), backend dùng profile `SPRING_PROFILES_ACTIVE`.

## 9. Quy Trình Làm Việc Hằng Ngày
- Mở VS Code → `WSL: Ubuntu` → mở `~/projects/clinic`.
- Terminal 1: `docker compose up` (hoặc chạy riêng `npm run dev`, `./mvnw spring-boot:run`).
- Terminal 2: chạy test (`npm run test`, `./mvnw test`), lint (`npm run lint`).
- Dùng Postman/Insomnia từ Windows để test API `localhost`.
- Commit/push bằng Git trong WSL hoặc kết hợp GitHub Desktop (chỉ định repo qua WSL path).
