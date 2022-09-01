FROM nginx:1.23.1-alpine

COPY build /usr/share/nginx/html

# By default, nginx will expose the port 80