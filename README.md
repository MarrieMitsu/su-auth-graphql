# SU-AUTH-GRAPHQL

Server for user authentication

## Description

Trying to apply my knowledge of Authentication and GraphQL in this simple application, I know its kinda Boilerplate

## Usage

```bash
# Install dependencies
yarn

# Setup .env

# Database migration
# Setup typeorm config file 'ormconfig.[format]' 

# Without synchronize option or on Production
# In production you should turn it 'false'
yarn typeorm migration:generate -- -n InitialMigrationsName

yarn typeorm migration:run

# Otherwise its auto synch with your db

# Development
yarn watch

yarn dev

# Production
yarn build

yarn serve
```

## Graphql Endpoints

```bash
http://localhost:4000/graphql
```

## API Endpoints

```bash
POST: /api/auth/refresh_token
- header: { authorization: token }
```

## Authors

MarrieMitsu | Isnainromadhoni

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Project status
#### On progress