# First stage is to build the application
FROM oven/bun:1-alpine AS build

# Define working directory
WORKDIR /app

# Copy all content into the first stage
COPY ./ ./

# Install app dependencies
RUN bun install --production --frozen-lockfile

# Build the application
RUN bun run build

# Second stage is to build the application image
FROM nginx:1.25-alpine as application

WORKDIR /usr/share/nginx/html

# Copy the build files from the first stage
COPY --from=build /app/build ./

RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx:nginx

# By default, nginx expose port 80
# EXPOSE 80