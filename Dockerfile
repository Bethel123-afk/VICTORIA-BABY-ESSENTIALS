# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv,UndefinedVar

# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Pass Vite build-time environment variables
ARG VITE_FLUTTERWAVE_PUBLIC_KEY
ARG VITE_API_URL
ENV VITE_FLUTTERWAVE_PUBLIC_KEY=$VITE_FLUTTERWAVE_PUBLIC_KEY
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Build/Run the Node.js backend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci --only=production --prefix backend

# Copy backend files and built frontend files
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

CMD ["npm", "start"]
