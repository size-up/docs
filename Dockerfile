# First stage is to build the application
FROM node:lts-alpine AS build

# Define working directory
WORKDIR /app

# Copy all content into the first stage
COPY ./ ./

# Install app dependencies
RUN yarn install --frozen-lockfile

# Build the application
RUN yarn run build

# Second stage is to build the application image
FROM nginx:1.23-alpine as application

WORKDIR /usr/share/nginx/html

# Copy the build files from the first stage
COPY --from=build /app/build ./

# By default, nginx expose port 80
# EXPOSE 80