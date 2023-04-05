FROM node:latest
RUN mkdir -p /app
COPY package*.json /app/
RUN npm install
COPY . /app/
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "serve"]