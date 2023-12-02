# Use an official Node.js runtime as the base image
FROM node:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the source code to the working directory
COPY . .

# Build the application using Babel
RUN npm run build

# Use a smaller image for running the application
FROM node:alpine 

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /src/package*.json ./
COPY --from=builder /src/dist/ ./dist
COPY --from=builder /src/public/ ./public
COPY --from=builder /src/socket-admin/ ./socket-admin

# Install only production dependencies
RUN npm install --only=production

# Set the GPTAPIKEY secret as an environment variable during build
ARG GPTAPIKEY
ENV GPTAPIKEY=$GPTAPIKEY

# Expose the port your application is running on (replace with your port)
EXPOSE 3000

# Define the command to start your application
CMD ["npm", "start"]
