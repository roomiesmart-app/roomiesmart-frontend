# ==========================================
# Etapa 1: Construcción (Node.js / React)
# ==========================================
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# 👇 INYECCIÓN DE VARIABLES BASE 👇
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 👇 INYECCIÓN DE VARIABLES DE KINDE 👇
ARG VITE_KINDE_CLIENT_ID
ENV VITE_KINDE_CLIENT_ID=$VITE_KINDE_CLIENT_ID

ARG VITE_KINDE_ISSUER_URL
ENV VITE_KINDE_ISSUER_URL=$VITE_KINDE_ISSUER_URL

ARG VITE_KINDE_SITE_URL
ENV VITE_KINDE_SITE_URL=$VITE_KINDE_SITE_URL

ARG VITE_KINDE_POST_LOGIN_REDIRECT_URL
ENV VITE_KINDE_POST_LOGIN_REDIRECT_URL=$VITE_KINDE_POST_LOGIN_REDIRECT_URL

ARG VITE_KINDE_POST_LOGOUT_REDIRECT_URL
ENV VITE_KINDE_POST_LOGOUT_REDIRECT_URL=$VITE_KINDE_POST_LOGOUT_REDIRECT_URL

# 👇 INYECCIÓN DE VARIABLES DE SUPABASE (subida de fotos) 👇
ARG VITE_SUPABASE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL

ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

ARG VITE_SUPABASE_BUCKET
ENV VITE_SUPABASE_BUCKET=$VITE_SUPABASE_BUCKET

# Compilar el proyecto
RUN npm run build

# ==========================================
# Etapa 2: Servidor Web (Nginx)
# ==========================================
FROM nginx:alpine

# Copiar los archivos compilados de Vite (dist/) al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para el tráfico web
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]