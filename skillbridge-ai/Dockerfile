# Stage 1: Build the React frontend
FROM node:20-alpine AS builder

WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine

WORKDIR /app

# Install server dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server source
COPY server/ ./server/

# Copy built React frontend
COPY --from=builder /app/client/dist ./client/dist

# Cloud Run provides PORT env variable
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

WORKDIR /app/server
CMD ["node", "index.js"]
