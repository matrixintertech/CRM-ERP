
<!-- Server Command -->

<!-- Setup -->

Project upload / clone
docker/.env.production create
docker compose up
Host Nginx (crm.domain.com & api-crm.domain.com)
SSL (Let's Encrypt)
Auto deployment (optional)

<!-- End -->






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

  //migration example
  docker compose -f docker/docker-compose.yml exec backend npx prisma migrate dev --name add-project-category

  //for install packages
  
  docker compose -f docker/docker-compose.yml exec admin npm install react-otp-input


  <!-- VPS Migrations -->
  git pull

docker compose build

docker compose run --rm backend npx prisma migrate deploy

docker compose up -d

<!-- test -->