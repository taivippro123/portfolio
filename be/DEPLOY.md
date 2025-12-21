# Hướng dẫn Deploy Backend lên Fly.io

## Bước 1: Cài đặt Fly CLI

### Windows (PowerShell):
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### macOS/Linux:
```bash
curl -L https://fly.io/install.sh | sh
```

Sau khi cài đặt, thêm Fly CLI vào PATH:
```bash
export FLYCTL_INSTALL="/home/$USER/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
```

## Bước 2: Đăng nhập Fly.io

```bash
fly auth login
```

Hoặc tạo tài khoản mới:
```bash
fly auth signup
```

## Bước 3: Khởi tạo Fly App

Trong thư mục `be/`:

```bash
cd be
fly launch
```

Fly CLI sẽ hỏi một số câu hỏi:
- **App name**: Nhập tên app (hoặc để mặc định)
- **Region**: Chọn region gần bạn (ví dụ: `sin` cho Singapore, `iad` cho US East)
- **Postgres**: Chọn `No` (vì bạn đang dùng MongoDB)
- **Redis**: Chọn `No`

## Bước 4: Cấu hình Environment Variables

Set các biến môi trường cần thiết:

```bash
# MongoDB URI
fly secrets set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/dbname"

# JWT Secret
fly secrets set JWT_SECRET="your-jwt-secret-key-here"

# Cloudinary Config
fly secrets set CLOUDINARY_CLOUD_NAME="your-cloud-name"
fly secrets set CLOUDINARY_API_KEY="your-api-key"
fly secrets set CLOUDINARY_API_SECRET="your-api-secret"

# Port (optional, mặc định là 5000)
fly secrets set PORT="5000"
```

**Lưu ý**: 
- Thay các giá trị bằng thông tin thực tế của bạn
- Secrets được mã hóa và chỉ có thể xem qua `fly secrets list`
- Không commit `.env` file lên git

## Bước 5: Cập nhật CORS trong server.js

Cập nhật CORS để cho phép frontend domain của bạn:

```javascript
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001",
    "https://your-frontend-domain.com" // Thêm domain production
  ],
  credentials: true,
}));
```

## Bước 6: Deploy

```bash
fly deploy
```

Fly.io sẽ:
1. Build Docker image từ Dockerfile
2. Push image lên Fly.io
3. Deploy và start app

## Bước 7: Kiểm tra Deployment

Xem logs:
```bash
fly logs
```

Xem thông tin app:
```bash
fly status
```

Xem URL của app:
```bash
fly info
```

App sẽ có URL dạng: `https://portfolio-backend.fly.dev`

## Bước 8: Cập nhật Frontend API URL

Trong file `fe/config/api.ts`, cập nhật:

```typescript
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend.fly.dev"
```

## Các lệnh hữu ích khác

### Xem logs real-time:
```bash
fly logs -a portfolio-backend
```

### SSH vào máy ảo:
```bash
fly ssh console -a portfolio-backend
```

### Scale app:
```bash
# Tăng memory
fly scale memory 1024 -a portfolio-backend

# Tăng CPU
fly scale vm shared-cpu-2x -a portfolio-backend
```

### Restart app:
```bash
fly apps restart portfolio-backend
```

### Xem metrics:
```bash
fly metrics -a portfolio-backend
```

### Xóa app (nếu cần):
```bash
fly apps destroy portfolio-backend
```

## Troubleshooting

### Lỗi kết nối MongoDB:
- Kiểm tra MongoDB Atlas whitelist IP: Thêm `0.0.0.0/0` để cho phép tất cả IP
- Hoặc thêm IP của Fly.io machine

### Lỗi CORS:
- Kiểm tra lại CORS origin trong `server.js`
- Đảm bảo frontend URL đã được thêm vào whitelist

### Lỗi port:
- Fly.io tự động set PORT qua environment variable
- Đảm bảo `server.js` sử dụng `process.env.PORT || 5000`

### Xem logs chi tiết:
```bash
fly logs --app portfolio-backend
```

## Tài liệu tham khảo

- [Fly.io Documentation](https://fly.io/docs/)
- [Fly.io Node.js Guide](https://fly.io/docs/languages-and-frameworks/node/)
- [Fly.io Secrets](https://fly.io/docs/reference/secrets/)

