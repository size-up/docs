FROM nginx:1.23-alpine

WORKDIR /usr/share/nginx/html

COPY build .

# By default, nginx expose port 80
# EXPOSE 80