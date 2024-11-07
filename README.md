# Task Management REST API - Express.js, TypeScript, MySQL

### Make database migration
```bash
# Install DBmate
sudo curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
sudo chmod +x /usr/local/bin/dbmate

# Start migration
dbmate new <migration-name>
dbmate up
dbmate down

# Dump
dbmate dump

# Restore
dbmate load
```