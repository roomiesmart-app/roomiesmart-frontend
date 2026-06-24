# Etapa 1: Construcción (Node.js)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 👇 INYECCIÓN DE LA VARIABLE PARA REACT/VITE 👇
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

ARG VITE_AUTH_REDIRECT_URI
ENV VITE_AUTH_REDIRECT_URI=$VITE_AUTH_REDIRECT_URI

RUN npm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
# Copia los archivos compilados de React (Vite suele dejarlos en dist/)
COPY --from=build /app/dist /usr/share/nginx/html
# Copia tu configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]