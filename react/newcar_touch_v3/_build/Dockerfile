FROM node:5
MAINTAINER Derek Chan <dchan0831@gmail.com>

# 創建 www 用戶（nginx 用戶）
RUN groupadd www -g8080
RUN useradd www -u8080 -g8080

# 安裝環境依賴
RUN apt-get update && apt-get install nginx libmagick++-dev -y
COPY ./_build/nginx.conf /etc/nginx/nginx.conf

# 設定工作路徑
WORKDIR /www

# Copy package.json到工作目錄
COPY ./package.json /www/package.json

# 構建項目環境
RUN npm install webpack -g && npm install webpack --save-dev
RUN export PATH=$PATH:/usr/lib/x86_64-linux-gnu/ImageMagick-6.8.9/bin-Q16 \
    && npm install

# Copy 代碼到工作目錄
COPY . /www

# 運行項目環境
RUN npm run build

CMD nginx -g 'daemon off;'