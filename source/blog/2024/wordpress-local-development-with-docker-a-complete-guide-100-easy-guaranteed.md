---
title: "WordPress Local Development with Docker: A Complete Guide! 100% Easy Guaranteed"
author: "Arizmuajianisan"
pubDatetime: 2024-12-23T03:42:51Z
description: "How to Run WordPress on Your Local Machine for Development with the Power of Docker"
featured: false
draft: false
tags:
  - docker
  - wordpress
---

How to Run WordPress on Your Local Machine for Development with the Power of Docker

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Why Use Docker for Local WordPress Development?](#why-use-docker-for-local-wordpress-development)
- [How to Set Up WordPress With Docker](#how-to-set-up-wordpress-with-docker)
  - [Prerequisites](#prerequisites)
  - [Step to Perform](#step-to-perform)
  - [Stopping the Services](#stopping-the-services)
- [Moving from Local Development to Production](#moving-from-local-development-to-production)
  - [⚠WARNING⚠](#warning)
- [Migration Steps](#migration-steps)
  - [Managing Password Securely](#managing-password-securely)
    - [For Windows Users](#for-windows-users)
    - [For Linux/Mac Users](#for-linuxmac-users)
- [Conclusion](#conclusion)

## Why Use Docker for Local WordPress Development?

As a developer, I once faced the challenge of building a WordPress website directly on a VPS. Making edits directly on the server was cumbersome, risky, and time-consuming. This experience drove me to find a better solution: setting up a local development environment. With Docker, I discovered a powerful and streamlined way to achieve this. I could test, tweak, and perfect the site by building locally before deploying it to the VPS.

You can also use Cloudflare Tunnel to expose your local WordPress site to the internet securely. This is especially useful for sharing progress with clients or collaborators without deploying to a live server. For more details, you can check out the documentation: [Exposing Your Local Apps to the Internet \[SAFELY!\] — Cloudflare Tunnel \[2024\]](https://arzlabserver.my.id/exposing-your-local-apps-to-the-internet-safely-cloudflare-tunnel-2024/).

## How to Set Up WordPress With Docker

### Prerequisites

- Docker and Docker Compose are installed on your machine. Check their official documentation for do this: [Docker](https://docs.docker.com/engine/install/ubuntu/).

- Basic understanding of Docker commands and YAML configuration.

### Step to Perform

1\. Clone the Repository

```bash
git clone https://github.com/arizmuajianisan/docker-wordpress-mysql-phpmyadmin.git
cd docker-wordpress-mysql-phpmyadmin
```

2\. Setup the .env

- Rename the `.env.EXAMPLE` file to `.env`

- Open the `.env` file and configure the following variables with your values:
  - `MYSQL_DB_NAME`: Your desired database name.
  - `MYSQL_USER`: Your MySQL username.
  - `MYSQL_ROOT_PASSWORD`: Your MySQL root password.
  - `MYSQL_PASSWORD`: Your MySQL user password.
  - `PORT_WORDPRESS`: The port for accessing WordPress.
  - `PORT_MYSQL`: The port for accessing the MySQL
  - `PORT_PHPMYADMIN`: The port for accessing phpMyAdmin.
  - `NAME_WORDPRESS`, `NABE_DB`, `NAME_PHPMYADMIN`: Container names for the respective services.

3\. Create a Docker Network to ensure smooth communication between services:

```bash
docker network create your-network-name --subnet 10.0.1.0/24
```

Update your `docker-compose.yml` file to use the newly created network:

```bash
networks:
  default:
    name: your-network-name
    external: true
    driver: bridge
```

4\. Run **Docker Compose** Start all services:

```bash
docker-compose up -d
```

5\. Access Your Services

- WordPress: [http://localhost:8080](http://localhost:8080)

- phpMyAdmin: [http://localhost:8082](http://localhost:8082)

### Stopping the Services

To stop the running containers:

```
docker-compose down
```

```bash
docker-compose down
```

## Moving from Local Development to Production

### ⚠WARNING⚠

Before migrating, ensure WordPress is installed and configured on your production server.

## Migration Steps

1. **On the Development Site:**
   - Install the **UpdraftPlus: WP Backup & Migration Plugin**.
   - Use UpdraftPlus to create a full backup, including:
     - Database
     - Plugins
     - Themes
     - Uploads
     - Other files
   - Download the backup files.

2. **Transfer to the Production Server:**
   - Copy the backup files to your production server using a secure method (e.g., SCP or FTP).

3. **On the Production Site:**
   - Install UpdraftPlus.
   - Upload the backup files.
   - Restore the site using the plugin’s interface.
   - Log in with the credentials from your development site.

### Managing Password Securely

The repository includes utility scripts for managing MySQL passwords securely.

#### For Windows Users

- `generate_root_password.bat`: Generates a secure MySQL root password.

- `generate_user_password.bat`: Generates a secure MySQL user password.

To use these scripts:

1. Double-click the desired `.bat` file.

2. The script will:
   - Generate a random password using OpenSSL.
   - Update the `.env` file with the new password.
   - Display the password in the console.

3. Press any key to close the window.

#### For Linux/Mac Users

- `generate_root_password.sh`: Generates a secure MySQL root password.

To use the script:

1\. Make it executable (first time only):

```bash
chmod +x generate_root_password.sh
```

2\. Run the script:

```bash
./generate_root_password.sh
```

3\. The script will:

- Generate a random password using OpenSSL.

- Update the `.env` file with the new password.

- Display the password in the console.

## Conclusion

By using Docker, you can streamline your WordPress development workflow, ensuring efficiency and reducing risks. This approach lets you perfect your website locally before deploying it to production.
