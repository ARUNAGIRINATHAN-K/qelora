# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the Vite frontend and bundle the Express server to dist/
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package configurations
COPY package.json package-lock.json ./

# Install only production dependencies to minimize container size
RUN npm install --omit=dev && npm cache clean --force

# Copy build artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Expose the production port (Qelora servers MUST listen on 3000)
EXPOSE 3000

# Start the bundled Express server
CMD ["npm", "start"]
