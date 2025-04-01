FROM node:18

WORKDIR /Users/eugenebilyy/Desktop/work/chat-backend

COPY package*.json ./

RUN npm install


COPY . .

RUN npm run build

CMD ["npm", "start"]