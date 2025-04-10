# ---- Step 1: Build React app ----
  FROM node:22 AS build

  WORKDIR /src
  
  COPY package*.json ./
  RUN npm install
  
  COPY . .
  RUN npm run build
  
  
  # ---- Step 2: Serve with Nginx ----
  FROM nginx:alpine
  
  # Copy built React app from previous stage
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  COPY --from=build /src/build /usr/share/nginx/html
  
  EXPOSE 80
  
  CMD ["nginx", "-g", "daemon off;"]