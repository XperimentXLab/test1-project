FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5173

EXPOSE 5173

CMD ["npm", "run", "dev"]