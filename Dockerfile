# Etapa 1: compila o frontend Vue com Vite
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY vite.config.mjs ./
COPY client/ ./client/
RUN npm run build

# Etapa 2: imagem final só com o servidor e o frontend compilado
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "src/server.js"]
