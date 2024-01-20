FROM node:alpine AS development
WORKDIR /app
RUN npm i -g pnpm
ENV NODE_ENV development
COPY package.json /app/
COPY pnpm-lock.yaml /app/
RUN pnpm install
COPY . .
EXPOSE 4000
EXPOSE 9229
CMD ["pnpm" , "run", "start:dev"]
FROM node:18-alpine AS production
WORKDIR /app
RUN npm i -g pnpm
COPY package.json /app/
COPY pnpm-lock.yaml /app/
RUN pnpm install
COPY . . 
RUN pnpm run build
EXPOSE 4000
CMD ["pnpm" , "run", "start:prod"]
