FROM node

EXPOSE 8080

COPY . /app
WORKDIR /app
RUN npm install
CMD ["npm", "start"]