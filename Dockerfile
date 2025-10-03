# 使用一個包含 Node.js 的映像檔來建置專案
FROM node:20-alpine AS build

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝專案依賴
RUN npm install

# 複製所有專案檔案到工作目錄
COPY . .

# 執行建置命令，產生靜態檔案
RUN npm run build

# 使用一個非常輕量級的 Nginx 映像檔來提供服務
FROM nginx:stable-alpine

# 從 'build' 階段將建置好的靜態檔案複製到 Nginx 的網站根目錄
COPY --from=build /app/dist /usr/share/nginx/html

# 開放 80 port，這是 Nginx 預設的監聽埠
EXPOSE 80

# 啟動 Nginx 服務
CMD ["nginx", "-g", "daemon off;"]