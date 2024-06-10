# Use node image as base
FROM node:16-slim

# Set the working directory
WORKDIR /app

# Clear npm cache
RUN npm cache clean --force

# Copy package.json and package-lock.json to the working directory
COPY ./frontend/package*.json ./

# Install dependencies with verbose output
RUN npm install --verbose

# Copy the rest of the application
COPY ./frontend .

# Expose port 3000
EXPOSE 3000

# Start the frontend app
CMD ["npm", "start"]
