# WMS API

## Getting Started

### localhost

#### Prerequisites

- Node v20
- MySQL v8.0
- Redis v7.0

#### Setup

```sh
  # Can using with npm without pnpm
  npm install -g dotenv-cli # not required unless run on localhost
  # Install dependencies
  pnpm install
  cp .env.example .env.local # This file should be modify
  prisma:generate
  pnpm prisma:migrate:local # init database
  pnpm start:local
```

#### Run app

```sh
  pnpm start:local
  # API: localhost:${PORT}
  # API Documentation: localhost:${PORT}/api/:version?/docs. E.g: localhost:8334/api/v1.0/docs
```

### Docker (recommend)

#### Prerequisites

- Docker
- Docker compose

#### Run on docker with docker-compose

```sh
  docker-compose -f ./.docker/docker-compose.dev.yml up -d --build
  # API: localhost:${PORT}
  # API Documentation: localhost:${PORT}/api/:version?/docs. E.g: localhost:8334/api/v1.0/docs
```
