# Use a Node.js base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Electron application
RUN npm run build

# Install a lightweight X server to run Electron
RUN apt-get update && \
    apt-get install -y \
    libgtkextra-dev libgconf2-dev libnss3 libasound2 xvfb

# Run the Electron app using Xvfb to create a virtual display
CMD ["xvfb-run", "npm", "start"]
