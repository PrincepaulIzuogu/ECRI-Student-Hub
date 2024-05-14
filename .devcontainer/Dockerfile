# Use a base image with Docker pre-installed
FROM docker:latest

# Install dependencies for Docker Compose
RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash curl

# Install Docker Compose
RUN curl -L https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Set the working directory
WORKDIR /app

# Copy your project files into the container
COPY . .

# Define the command to run your application
CMD ["docker-compose", "up", "--build"]
