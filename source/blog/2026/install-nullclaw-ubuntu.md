---
title: How to Install and Configure Nullclaw on Ubuntu
author: "arizmuajianisan"
pubDatetime: 2026-03-04
description: A comprehensive step-by-step tutorial to install and configure Nullclaw AI assistant on Ubuntu Linux, including Zig setup, dependencies, and Telegram integration.
featured: false
draft: false
tags:
  - tutorial
  - linux
  - ai
  - nullclaw
  - ubuntu
---

## Introduction

**Nullclaw** is a powerful AI assistant that runs locally on your machine, giving you control over your data while providing intelligent automation and conversation capabilities. Unlike cloud-only assistants, Nullclaw operates from your own workspace, integrates with messaging platforms like Telegram, and can execute system tasks.

After struggling with the official documentation and finding scattered information online, I've compiled this comprehensive guide to help you install and configure Nullclaw on Ubuntu Linux from scratch.

## Prerequisites

Before we begin, ensure you have:

- Ubuntu 20.04 or later (tested on Ubuntu 24.04)
- A stable internet connection
- Sudo/administrator access
- About 500MB free disk space
- Basic familiarity with the terminal

## System Specifications

This tutorial was tested on the following setup:

| Component        | Specification              |
| ---------------- | -------------------------- |
| **OS**           | Ubuntu 24.04 LTS           |
| **Kernel**       | 6.17.0-14-generic          |
| **Architecture** | x86_64 (64-bit)            |
| **Zig Version**  | 0.15.2                     |
| **Disk Space**   | 25GB (recommended minimum) |

## Step 1: Update Your System

Start by updating your system packages to ensure you have the latest security patches and dependencies:

```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Install Essential Dependencies

Nullclaw requires several development tools and libraries. Install them all at once:

```bash
sudo apt install -y \
    curl \
    wget \
    git \
    build-essential \
    ca-certificates \
    gnupg \
    lsb-release \
    unzip \
    libsqlite3-dev
```

**Note:** The `libsqlite3-dev` package is crucial for Nullclaw's memory functionality. Without it, the build process will fail.

## Step 3: Install Zig Programming Language

Nullclaw is written in Zig, so we need to install the Zig compiler first.

### Option A: Install from Official Releases (Recommended)

Download and install Zig version 0.15.2:

```bash
# Download Zig 0.15.2 for Linux x86_64
curl https://ziglang.org/download/0.15.2/zig-linux-x86_64-0.15.2.tar.xz -o zig.tar.xz

# Extract the archive
tar -xf zig.tar.xz

# Move to system directory
sudo mv zig-linux-x86_64-0.15.2/ /usr/local/zig

# Create symbolic link for easy access
sudo ln -s /usr/local/zig/zig /usr/local/bin/zig

# Verify installation
zig version
```

You should see output like:

```
0.15.2
```

### Option B: Install via Snap (Alternative)

If you prefer using Snap:

```bash
sudo snap install zig --classic
```

However, note that Snap version may differ from the official releases, which could cause compatibility issues.

### Clean Up

Remove the downloaded archive to save space:

```bash
rm zig.tar.xz
```

## Step 4: Clone Nullclaw Repository

Now let's get the Nullclaw source code:

```bash
# Clone the repository
git clone https://github.com/nullclaw/nullclaw.git

# Enter the directory
cd nullclaw
```

## Step 5: Build Nullclaw

Compile Nullclaw with optimized settings for production use:

```bash
# Build with release optimization (smaller binary)
zig build -Doptimize=ReleaseSmall
```

This process may take a few minutes. The compiled binary will be created in `zig-out/bin/nullclaw`.

### Verify the Build

Check the compiled binary:

```bash
ls -lh zig-out/bin/nullclaw
```

You should see something like:

```
-rwxr-xr-x 1 user user 3.1M Mar  4 06:06 zig-out/bin/nullclaw
```

### Optional: Run Tests

To ensure everything is working correctly, you can run the test suite:

```bash
zig build test --summary all
```

## Step 6: Install Nullclaw System-wide

Move the compiled binary to a system directory for easy access:

```bash
# Copy binary to /usr/local/bin
sudo cp zig-out/bin/nullclaw /usr/local/bin/nullclaw

# Make it executable (if not already)
sudo chmod +x /usr/local/bin/nullclaw

# Verify installation
nullclaw --version
```

## Step 7: Initialize Nullclaw Configuration

Now let's set up Nullclaw with the interactive onboarding process:

```bash
nullclaw onboard --interactive
```

The onboarding wizard will ask you several questions:

### Workspace Setup

1. **Workspace Directory:** Press Enter to accept the default (`~/.nullclaw/workspace`)
   - This is where Nullclaw will store your files and projects

### LLM Provider Configuration

2. **AI Provider:** Select your preferred LLM provider
   n - Common options: OpenAI, Anthropic, Z.ai, etc.
   - You'll need to provide your API key

### Channel Configuration

3. **Messaging Channels:** Configure how you want to interact with Nullclaw
   - **Telegram:** Most popular choice for mobile access
   - **Discord:** For server/community integration
   - **CLI:** For local terminal interaction

### Example: Telegram Bot Setup

If you choose Telegram, you'll need:

1. Create a bot via [@BotFather](https://t.me/BotFather) on Telegram
2. Copy the bot token
3. Provide your Telegram user ID (get it from [@userinfobot](https://t.me/userinfobot))

The configuration will be saved in `~/.nullclaw/config.json`.

## Step 8: Verify Configuration

Check your configuration file:

```bash
cat ~/.nullclaw/config.json
```

Key sections to verify:

### Models Section

```json
"models": {
  "providers": {
    "z.ai": {
      "api_key": "your-api-key-here"
    }
  }
}
```

### Channels Section (Telegram Example)

```json
"channels": {
  "telegram": {
    "accounts": {
      "default": {
        "bot_token": "your-bot-token",
        "allow_from": ["your-telegram-user-id"]
      }
    }
  }
}
```

## Step 9: Start Nullclaw

You can now start Nullclaw in different ways:

### As a Background Service (Recommended)

```bash
nullclaw daemon
```

This will start Nullclaw in the background and keep it running.

### Foreground Mode (for debugging)

```bash
nullclaw run
```

### Using CLI

```bash
nullclaw chat
```

## Step 10: Test Your Setup

### Test via Telegram

1. Open your Telegram bot
2. Send a message like "Hello" or "What can you do?"
3. You should receive a response from Nullclaw

### Test via CLI

```bash
echo "Hello Nullclaw" | nullclaw chat
```

## Configuration Files Overview

After installation, Nullclaw creates several important files:

| File                            | Purpose                               |
| ------------------------------- | ------------------------------------- |
| `~/.nullclaw/config.json`       | Main configuration file               |
| `~/.nullclaw/daemon_state.json` | Daemon runtime state                  |
| `~/.nullclaw/workspace/`        | Your workspace for files and projects |
| `~/.nullclaw/state/`            | Internal state management             |

## Common Issues and Solutions

### Issue 1: Build Fails with SQLite Error

**Problem:** Build fails complaining about missing SQLite libraries.

**Solution:** Install SQLite development headers:

```bash
sudo apt install libsqlite3-dev
```

Then rebuild:

```bash
zig build -Doptimize=ReleaseSmall
```

### Issue 2: Zig Command Not Found

**Problem:** After installing Zig, the command is not recognized.

**Solution:** Verify the symbolic link:

```bash
ls -la /usr/local/bin/zig
```

If it doesn't exist, recreate it:

```bash
sudo ln -s /usr/local/zig/zig /usr/local/bin/zig
```

### Issue 3: Permission Denied When Running

**Problem:** Can't execute nullclaw binary.

**Solution:** Make it executable:

```bash
sudo chmod +x /usr/local/bin/nullclaw
```

### Issue 4: Telegram Bot Not Responding

**Problem:** Telegram bot receives messages but doesn't respond.

**Solution:** Check that:

1. Your Telegram user ID is correctly added to `allow_from` in config
2. The bot token is correct and hasn't been regenerated
3. The Nullclaw daemon is running

### Issue 5: API Key Errors

**Problem:** Nullclaw complains about invalid API keys.

**Solution:** Verify your API key in `~/.nullclaw/config.json`:

```bash
cat ~/.nullclaw/config.json | grep -A 5 "api_key"
```

Make sure there are no extra spaces or quotes around the key.

## Advanced Configuration

### Enabling Memory Features

Nullclaw has powerful memory capabilities. Configure them in `config.json`:

```json
"memory": {
  "profile": "custom",
  "backend": "memory",
  "auto_save": true,
  "search": {
    "enabled": true
  }
}
```

### Setting Up Autonomy Levels

Control how much autonomy Nullclaw has:

```json
"autonomy": {
  "level": "full",
  "workspace_only": true,
  "max_actions_per_hour": 50,
  "require_approval_for_medium_risk": false,
  "block_high_risk_commands": true
}
```

### Configuring Schedulers

Enable task scheduling:

```json
"scheduler": {
  "enabled": true,
  "max_tasks": 64,
  "max_concurrent": 4
}
```

## Updating Nullclaw

To update to the latest version:

```bash
# Pull latest changes
cd ~/nullclaw
git pull

# Rebuild
zig build -Doptimize=ReleaseSmall

# Reinstall
sudo cp zig-out/bin/nullclaw /usr/local/bin/nullclaw

# Restart daemon
nullclaw daemon restart
```

## Uninstalling Nullclaw

If you need to remove Nullclaw completely:

```bash
# Stop daemon
nullclaw daemon stop

# Remove binary
sudo rm /usr/local/bin/nullclaw

# Remove configuration and data (careful!)
rm -rf ~/.nullclaw

# Remove source code
rm -rf ~/nullclaw
```

## Next Steps

Now that Nullclaw is installed and running, here are some things to explore:

1. **Workspace Management:** Create projects and organize files in `~/.nullclaw/workspace`
2. **Skills:** Install additional skills for extended functionality
3. **Memory:** Configure long-term memory for better context retention
4. **Automation:** Set up scheduled tasks and cron jobs
5. **Channels:** Add more messaging platforms (Discord, Slack, etc.)

## Resources

- [Nullclaw GitHub Repository](https://github.com/nullclaw/nullclaw)
- [Zig Programming Language](https://ziglang.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## Conclusion

Installing Nullclaw on Ubuntu might seem complex at first, but once you understand the components—Zig, build process, and configuration—it becomes straightforward. The key is to ensure all dependencies are installed before building and to carefully configure your messaging channels.

With Nullclaw running locally, you have a powerful AI assistant that respects your privacy and integrates seamlessly with your workflow. Happy automating!

---
