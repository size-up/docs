FROM nginx:alpine

COPY build /usr/share/nginx/html

# By default, nginx will expose the port 80