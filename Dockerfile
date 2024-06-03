# Use the official Node.js image from the Docker Hub
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy local code to the container image
COPY . .

# Run the web service on container startup
CMD [ "node", "server.js" ]

# Inform Docker that the container is listening on the specified port
EXPOSE 3000

# Serve the app at this port
ENV PORT 3000
