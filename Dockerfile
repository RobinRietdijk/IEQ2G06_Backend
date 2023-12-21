# Use an official Node.js runtime as the base image
FROM node:latest AS builder

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install --no-package-lock

# Copy the source code to the working directory
COPY . .

# Build the application using Babel
RUN npm run build

# Runtime stage with Ubuntu base image
FROM ubuntu:latest

# Set up Node.js environment
RUN apt-get update && \
    apt-get install -y curl software-properties-common && \
    curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

COPY --from=builder /src/package*.json ./
COPY --from=builder /src/dist/ ./dist
COPY --from=builder /src/public/ ./public
COPY --from=builder /src/socket-admin/ ./socket-admin

# Install Chromium
RUN if [ "$(uname -m)" = "x86_64" ]; then \
        apt-get install -y chromium-browser; \
    else \
        apt-get install -y chromium; \
    fi && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN npm install --only=production

ARG GPTAPIKEY
ENV GPTAPIKEY=$GPTAPIKEY

EXPOSE 3000

CMD ["npm", "start"]