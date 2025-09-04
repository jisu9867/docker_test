# 1) Node 런타임
FROM node:20-alpine

# 2) 작업폴더
WORKDIR /app

# 3) 패키지 메타만 복사 → 의존성 설치 (dev 제외)
COPY package*.json ./
RUN npm install --omit=dev

# 4) 앱 소스 복사 (server.js)
COPY server.js .

# 5) 포트 설정
ENV PORT=3000
EXPOSE 3000

# 6) 컨테이너 시작 시 실행
CMD ["node", "server.js"]
