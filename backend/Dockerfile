# Dockerfile

# Use Python image as base
FROM python:3.9-slim

# Install build tools (including gcc) and netcat-openbsd
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    netcat-openbsd \
 && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Define Python dependencies inline and install them
RUN pip install --no-cache-dir \
    fastapi==0.110.1 \
    pydantic==2.6.4 \
    bcrypt==4.1.3 \
    SQLAlchemy==2.0.29 \
    psycopg2-binary==2.9.9 \
    uvicorn==0.29.0 \
    python-multipart==0.0.9 \
    dnspython==2.6.1 \
    email-validator==2.1.1 \
    pyjwt==2.8.0

# Copy the rest of the application
COPY . .

# Expose port 8000
EXPOSE 8000

# Start the backend server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
