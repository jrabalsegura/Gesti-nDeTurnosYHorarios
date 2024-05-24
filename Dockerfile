FROM node:18-alpine
WORKDIR '/app'
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE 4014
CMD ["npm", "start"]