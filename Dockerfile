FROM node:latest

# Crea el directorio de trabajo
RUN mkdir -p /app

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo package.json y package-lock.json al contenedor
COPY package*.json /app/

# Instala las dependencias
RUN npm install

# Copia todos los archivos al contenedor
COPY . /app/

# Compila la aplicación de Vue.js
RUN npm run build

# Expone el puerto 8080
EXPOSE 8080

# Inicia la aplicación
CMD ["npm", "run", "serve"]