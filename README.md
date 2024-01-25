## Finotech Task

Greeting. This guide will assist you in setting up and testing the application, which has been developed using Nest.js, TypeORM, PostgreSQL, Swagger, and Redis.

- **for running application**

```
  docker-compose up -d
```

OR

```
pnpm start:dev
```

- **for seeding data**

```
pnpm seed:run
```

- Visit the Swagger documentation at **http://localhost:5000/api-docs** to explore and test the API endpoints.

- Execute the following command to run the tests:

```
pnpm test
```
