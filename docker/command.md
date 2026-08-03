
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

  for log
  docker compose -f docker/docker-compose.yml logs -f backend