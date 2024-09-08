FROM node:20.11.1 AS build

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
