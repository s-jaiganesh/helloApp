FROM node:18-alpine
WORKDIR /app
COPY app/package.json ./
RUN npm ci --omit=dev || npm install --production
COPY app/app.js .
ENV PORT=3000 LOG_NOISE=true LOG_INTERVAL_MS=2000
EXPOSE 3000
CMD ["node","app.js"]