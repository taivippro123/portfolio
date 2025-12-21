# Portfolio Backend API

Backend API cho hệ thống quản lý portfolio cá nhân.

## Tính năng

1. **Quản lý Folder và Note**
   - Tạo, đọc, cập nhật, xóa folders
   - Tạo, đọc, cập nhật, xóa notes (có title, content, ngày tạo, ngày update)
   - Notes có thể được tổ chức trong folders

2. **Quản lý CV**
   - Upload CV mới nhất (PDF/DOC/DOCX)
   - Tự động replace CV cũ khi upload CV mới
   - Public endpoint để xem CV (không cần auth)

3. **Upload Files**
   - Upload ảnh và PDF lên Cloudinary
   - Files được lưu trên Cloudinary, không lưu trên server

4. **Analytics**
   - Theo dõi lượt xem CV
   - Phân tích: IP address, quốc gia, thành phố, trình duyệt, OS, device type (mobile/desktop/tablet)

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` với các biến môi trường:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

3. Chạy server:
```bash
npm run dev
```

## API Documentation

Swagger documentation có sẵn tại: `http://localhost:5000/api-docs`

## Endpoints

### Authentication
- `POST /api/users/register` - Đăng ký
- `POST /api/users/login` - Đăng nhập
- `POST /api/users/logout` - Đăng xuất (cần auth)
- `GET /api/users/verify` - Verify token (cần auth)

### Folders (cần auth)
- `POST /api/folders` - Tạo folder
- `GET /api/folders` - Lấy tất cả folders
- `GET /api/folders/:id` - Lấy folder theo ID
- `PUT /api/folders/:id` - Cập nhật folder
- `DELETE /api/folders/:id` - Xóa folder

### Notes (cần auth)
- `POST /api/notes` - Tạo note
- `GET /api/notes` - Lấy tất cả notes (có thể filter theo folderId)
- `GET /api/notes/:id` - Lấy note theo ID
- `PUT /api/notes/:id` - Cập nhật note
- `DELETE /api/notes/:id` - Xóa note

### CV
- `GET /api/cv/public` - Lấy CV mới nhất (Public - không cần auth)
- `POST /api/cv` - Upload CV mới (cần auth)
- `GET /api/cv` - Lấy thông tin CV (cần auth)
- `DELETE /api/cv` - Xóa CV (cần auth)

### Upload (cần auth)
- `POST /api/upload` - Upload ảnh hoặc PDF lên Cloudinary
- `DELETE /api/upload` - Xóa file từ Cloudinary

### Analytics (cần auth)
- `GET /api/analytics` - Lấy thống kê lượt xem CV

## Models

### Folder
- `name`: String (required)
- `parentId`: ObjectId (ref: Folder, nullable)
- `userId`: ObjectId (ref: User, required)
- `createdAt`, `updatedAt`: Timestamps

### Note
- `title`: String (required)
- `content`: String (required)
- `folderId`: ObjectId (ref: Folder, nullable)
- `userId`: ObjectId (ref: User, required)
- `createdAt`, `updatedAt`: Timestamps

### CV
- `fileName`: String (required)
- `fileUrl`: String (required)
- `cloudinaryId`: String (required)
- `fileType`: String (enum: pdf, doc, docx)
- `userId`: ObjectId (ref: User, required, unique)
- `createdAt`, `updatedAt`: Timestamps

### Analytics
- `cvId`: ObjectId (ref: CV, required)
- `ipAddress`: String (required)
- `country`: String
- `city`: String
- `browser`: String
- `browserVersion`: String
- `os`: String
- `device`: String (enum: mobile, desktop, tablet, unknown)
- `userAgent`: String
- `referer`: String
- `createdAt`, `updatedAt`: Timestamps

