# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Run stage
FROM nginx:alpine
# Copy the build output to nginx. Updated Angular puts it in dist/[project-name]/browser
COPY --from=build /app/dist/german-learning-app/browser /usr/share/nginx/html
# Copy custom nginx config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
