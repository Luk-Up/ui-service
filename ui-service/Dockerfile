# Step 1: Use the official Node.js image as the base image
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Install 'serve' to serve the build directory
RUN npm install -g serve

# Step 8: Expose the port the app will run on
EXPOSE 5000

# Step 9: Serve the build folder using serve
CMD ["serve", "-s", "build"]
