# Use the official Playwright image — includes all browsers and OS dependencies pre-installed
FROM mcr.microsoft.com/playwright:v1.52.0-noble

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
# (only re-installs if package.json or package-lock.json change)
COPY package.json package-lock.json ./

# Install Node dependencies
RUN npm ci

# Copy the rest of the project source into the container
COPY . .

# Default command: run all Playwright tests
# Override at runtime with: docker run ... npx cucumber-js ...
CMD ["npx", "playwright", "test"]
