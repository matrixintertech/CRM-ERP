<!-- Server Command -->

<!-- Setup -->

Project upload / clone
docker/.env.production create
docker compose up
Host Nginx (crm.domain.com & api-crm.domain.com)
SSL (Let's Encrypt)
Auto deployment (optional)

<!-- End -->

<!-- VPS -->

cd /var/www/CRM-ERP
git pull origin main

cd docker

<!-- check latest migration server -->
ls -la backend/prisma/migrations

<!-- After know migration recreate backend -->
docker compose \
  --env-file .env.production \
  -f docker-compose.prod.yml \
  up -d --build --force-recreate backend

  <!-- After check status -->
  docker compose \
  --env-file .env.production \
  -f docker-compose.prod.yml \
  exec backend \
  npx prisma migrate status

  <!-- after deploy -->
  docker compose \
  --env-file .env.production \
  -f docker-compose.prod.yml \
  exec backend \
  npx prisma migrate deploy
  

docker compose \
 --env-file .env.production \
 -f docker-compose.prod.yml \
 up -d --build backend

after verify
docker ps
docker logs --tail 100 matrix-crm-prod-backend

docker compose \
 --env-file docker/.env.production \
 -f docker/docker-compose.prod.yml \
 up --build -d

docker compose \
 --env-file docker/.env.production \
 -f docker/docker-compose.prod.yml \
 exec backend npx prisma migrate deploy

docker compose \
 --env-file docker/.env.production \
 -f docker/docker-compose.prod.yml \
 exec backend npx prisma db seed

docker compose \
 --env-file docker/.env.production \
 -f docker/docker-compose.prod.yml \
 logs -f

  <!-- Local Dev -->

docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.yml up -d

docker compose -f docker/docker-compose.yml up --build backend
docker compose -f docker/docker-compose.yml up --build -d admin

for log
docker compose -f docker/docker-compose.yml logs -f backend

//format

docker compose -f docker/docker-compose.yml exec backend npx prisma format

//validate
docker compose -f docker/docker-compose.yml exec backend npx prisma format

//fresh build
docker compose -f docker/docker-compose.yml build --no-cache

//Start
docker compose -f docker/docker-compose.yml up -d

//Local New Migration
docker compose -f docker/docker-compose.yml exec backend npx prisma migrate deploy

//Local Seed
docker compose -f docker/docker-compose.yml exec backend npx prisma db seed

//migration example
docker compose -f docker/docker-compose.yml exec backend npx prisma migrate dev --name add-project-category

docker compose -f docker/docker-compose.yml exec backend npx prisma generate

//for install packages

docker compose -f docker/docker-compose.yml exec admin npm install react-otp-input

  <!-- db seed -->

docker compose exec backend npx prisma db seed

  <!-- VPS Migrations -->

git pull

docker compose build

docker compose run --rm backend npx prisma migrate deploy

docker compose up -d

<!-- test -->

<!-- VPS migration -->

cd /var/www/CRM-ERP/docker

docker compose \
 --env-file .env.production \
 -f docker-compose.prod.yml \
 exec backend \
 npx prisma migrate deploy

  <!-- Check Status -->

docker compose \
 --env-file .env.production \
 -f docker-compose.prod.yml \
 exec backend \
 npx prisma migrate status

  <!-- Seed Command -->

docker compose \
 --env-file .env.production \
 -f docker-compose.prod.yml \
 exec backend \
 node dist/prisma/seed.js

  <!-- backend restart -->

docker compose \
 --env-file .env.production \
 -f docker-compose.prod.yml \
 restart backend


 //update env

 nano docker/.env.production
 ctrl+O
 enter
 ctrl+x
