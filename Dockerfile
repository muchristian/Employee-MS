FROM node:14

WORKDIR /employeems

COPY ./ ./

CMD ["npm", "run", "dev"]