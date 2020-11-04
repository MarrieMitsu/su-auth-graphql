# SU-AUTH-GRAPHQL

Server for user authentication

## Description

Trying to apply my knowledge of Authentication and GraphQL in this simple application

## Usage

```bash
# Install dependencies
yarn

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

## Authors

MarrieMitsu | Isnainromadhoni

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Project status
#### On progress