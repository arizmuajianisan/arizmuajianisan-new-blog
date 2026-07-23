---
title: Standard Deployment Architecture with Cloudflare Tunnel and Traefik
author: "arizmuajianisan"
pubDatetime: 2026-04-21
description: Learn the standard deployment architecture using Cloudflare Zero Trust Tunnel, Traefik reverse proxy, and Docker Compose for secure, zero-port apps.
featured: false
draft: false
tags:
  - Docker
  - Traefik
  - Cloudflare Tunnel
  - Reverse Proxy
  - Deployment
---

This standard deployment architecture uses Cloudflare Zero Trust Tunnel as the secure public entry point, Traefik as the global reverse proxy, and Docker Compose for app stacks. It keeps server inbound ports closed, enables dynamic service discovery, and supports monorepo or separate repo setups.

## Request Flow

When a user visits an app like gatepass.arzlabserver.my.id, Cloudflare receives the request and forwards it via the tunnel to the cloudflared connector on your server. The connector routes it to traefik:80 on the shared Docker network, where Traefik uses Docker labels and host/path rules to direct it to the right container.

This flow ensures no direct server exposure.

## Environment Model

Deploy one shared proxy stack per environment—separate servers for staging and production, each with its own Cloudflare tunnel, Traefik container, and proxy_network. This isolation makes deployments predictable and secure.

**Naming Conventions:**

- Production: `app.arzlabserver.my.id`
- Staging: `app-stg.arzlabserver.my.id`
- Docker network: `proxy_network`
- Proxy container: `traefik`
- Tunnel container: `cloudflared`

## Global Setup Steps

Start with these core components on every server.

1. Create the shared network:

   ```
   docker network create proxy_network
   ```

2. Run Cloudflare Tunnel:

   ````bash
   docker run -d \
     --name cloudflared \
     --network proxy_network \
     --restart unless-stopped \
     cloudflare/cloudflared:latest \
     tunnel --no-autoupdate run --token <YOUR_TUNNEL_TOKEN>
   ``` [hub.docker](https://hub.docker.com/r/zenkiet/traefik-tunnel-expose)

   ````

3. Deploy Traefik via `~/traefik/docker-compose.yml`:

   ```yaml
   name: global-proxy
   services:
     traefik:
       image: traefik:latest
       container_name: traefik
       restart: unless-stopped
       command:
         - "--api.insecure=false"
         - "--providers.docker=true"
         - "--providers.docker.exposedbydefault=false"
         - "--entrypoints.web.address=:80"
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock:ro
       networks:
         - proxy_network
   networks:
     proxy_network:
       external: true
   ```

   Run: `cd ~/traefik && docker compose up -d`

4. In Cloudflare Zero Trust, set public hostnames to `http://traefik:80` (not server IP).

## App Deployment Patterns

### Pattern A: Single Container App

Ideal for tools like Metabase—Traefik routes directly.

Example `docker-compose.yml`:

```yaml
name: metabase
services:
  metabase:
    image: metabase/metabase:latest
    container_name: metabase
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=proxy_network"
      - "traefik.http.routers.metabase.rule=Host(`test-meta.arzlabserver.my.id`)"
      - "traefik.http.routers.metabase.entrypoints=web"
      - "traefik.http.services.metabase.loadbalancer.server.port=3000"
    volumes:
      - metabase_data:/metabase-data
    networks:
      - proxy_network
volumes: metabase_data:
networks:
  proxy_network:
    external: true
```

Key: Match `loadbalancer.server.port` to app's internal port; no host port publishing.

### Pattern B: Monorepo with Internal Nginx

For single-repo frontend/backend, use app Nginx for /api vs / routing; Traefik handles hostname.

Nginx `nginx.conf` proxies /api/ to backend:5000 and / to frontend:3000.

Traefik labels on Nginx container point to its port 80.

### Separate Repositories

Frontend: Host rule for main domain.
Backend: Host + PathPrefix(`/api`); add StripPrefix middleware if backend expects clean paths.

Example backend labels:

```
- "traefik.http.routers.myapp-back.rule=Host(`app.arzlabserver.my.id`) && PathPrefix(`/api`)"
- "traefik.http.routers.myapp-back.middlewares=myapp-strip-api"
- "traefik.http.middlewares.myapp-strip-api.stripprefix.prefixes=/api"
```

Both join `proxy_network`.

## Deployment Checklist and Standards

- Create `proxy_network`, run cloudflared/Traefik, configure Cloudflare hostnames.
- Connect apps to network, add unique Traefik labels with internal ports.
- Rules: Unique names, specify `traefik.docker.network=proxy_network` for multi-net containers, distinct staging/prod hosts, no host ports.

## Troubleshooting Tips

Hostname resolves but app fails? Check Cloudflare points to `traefik:80`. Bad gateway? Verify internal port and network label.

Use monorepo+Nginx for self-contained apps; separate repos for independent cycles under one domain.

Ready to deploy? Follow the checklist for your first zero-trust stack.
