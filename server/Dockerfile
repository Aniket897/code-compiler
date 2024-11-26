# Start with the latest Ubuntu image
FROM ubuntu:latest

# Set environment variables to prevent prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update and install Python and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    nodejs \
    npm \
    && apt-get clean

# Verify installations
RUN python3 --version && pip3 --version && node --version && npm --version

# Set the working directory in the container
WORKDIR /code

