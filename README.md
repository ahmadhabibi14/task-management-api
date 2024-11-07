# Task Management REST API - Express.js, TypeScript, MySQL

## How to Setup and Run project ?

### 1. Pull docker-compose
```bash
docker-compose up -d
```

### 2. Make database migration

```bash
# Install DBmate
sudo curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
sudo chmod +x /usr/local/bin/dbmate

# Start migration
dbmate new <migration-name>
dbmate up
dbmate down

# Dump schema
dbmate dump
# or
make db-dump

# Restore schema
dbmate load
```

### 3. Install Node.js Dependencies
```bash
npm install
# or
pnpm install
```

### 4. Run project (development)
```bash
pnpm dev
```

### 5. Build and run project (production)
```bash
# Build
pnpm build

# Start
pnpm start
```

The API Docs (Swagger) is available at path `/docs`