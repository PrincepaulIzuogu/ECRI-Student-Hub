# Use node image as base
FROM node:16-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://get.docker.com -o get-docker.sh && \
    sh get-docker.sh && \
    apt-get install -y docker-compose


# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the frontend app
CMD ["npm", "start"]
