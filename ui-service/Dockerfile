# Step 1: Use the official Node.js image as the base image
FROM node:16 AS builder

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy only the package files (to cache node_modules if unchanged)
COPY package*.json ./

# Step 4: Install only production dependencies for build
RUN npm ci --legacy-peer-deps

# Step 5: Copy the rest of the files
COPY . .

# Step 6: Build the React app
RUN npm run build


# ==========================
# Stage 2: Lightweight serve
# ==========================
FROM node:16-slim AS final

# Step 7: Install serve globally
RUN npm install -g serve

# Step 8: Copy only the build folder from builder stage
COPY --from=builder /app/build /app/build

# Step 9: Set working directory
WORKDIR /app

# Step 10: Expose the port
EXPOSE 3000

# Step 11: Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
