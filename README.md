# SU-AUTH-GRAPHQL

Server for user authentication

## Description

Trying to apply my knowledge of Authentication and GraphQL in this simple application, I know its kinda Boilerplate

### Feature

* Login &check;
* Register &check;
* Forgot Password &check;
* Reset Password &check;
* Change Password &check;
* Update Profile &check;
* Upload Profile Picture &cross;
* Delete Account &check;

## Usage

### Manual setup
```bash
# Install dependencies
pnpm

# Setup .env

# Database migration
# Setup typeorm config file 'ormconfig.[format]' 

# Without synchronize option or on Production
# In production you should turn it 'false'
pnpm typeorm migration:generate -- -n InitialMigrationsName

pnpm typeorm migration:run

# Otherwise its auto synch with your db

# Development
pnpm watch

pnpm dev

# Production
pnpm build

pnpm serve
```

For the default SMTP service I use [Mailhog](https://github.com/mailhog/MailHog)

### Using Docker

## Graphql Endpoints

```bash
http://localhost:4000/graphql
```

## API Endpoints

```bash
GET: /api/auth/refresh_token
- header: { authorization: token }
```

## Authors

MarrieMitsu | Isnainromadhoni

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Project status
#### On progress