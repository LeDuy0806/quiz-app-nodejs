## Yêu cầu hệ thống

-   [Node.js](https://nodejs.org/en/) (phiên bản 18 trở lên)
-   [MongoDB](https://www.mongodb.com/) (phiên bản 6 trở lên)
-   ANH EM DÙNG YARN NHÁ

### Installation

1. Clone the repo

```
   git clone https://github.com/LeDuy0806/quiz-app-nodejs.git
```

2. Install packages

```
   yarn
```

## Cấu hình

1. Tạo tệp tin `.env` trong thư mục gốc của dự án.
2. Đặt các biến môi trường sau trong tệp tin `.env`
3. Add .env file:

```
   PORT = 4000
   CONNECTION_STRING = ""
   EXPRISES_TIME= '24h'
   ACCESS_TOKEN_SECERT = 'jwttoken123'
   REFRESH_TOKEN_SECERT = 'jwtrefreshtoken123'
```

## Sử dụng

1. Khởi động server API:

```
yarn start
```

2. Server API sẽ chạy tại `http://localhost:4000` (hoặc cổng đã chỉ định trong file .env).
