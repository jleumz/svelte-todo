FROM node:15

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

# running in container on port 8080.
# port forwarding from docker container to local machine
#  -p 5000:8080 
EXPOSE 8080

CMD ["npm", "start"]