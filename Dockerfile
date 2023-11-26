# Use an official Node.js runtime as the base image
FROM node:latest as builder

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

COPY src/ ./src/

# Use a smaller image for running the application
FROM node:alpine 

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /src/package*.json ./
COPY --from=builder /src/ ./src/

# Set the GPTAPIKEY secret as an environment variable during build
ARG GPTAPIKEY
ENV GPTAPIKEY=$GPTAPIKEY

RUN echo "GPTAPIKEY=$GPTAPIKEY"

# Copy the rest of your application files
COPY src/ ./

# Expose the port your application is running on (replace with your port)
EXPOSE 3001

# Define the command to start your application
CMD ["npm", "start"]
