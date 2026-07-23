---
title: "Create Custom Shortcuts in Windows Terminal"
author: "arizmuajianisan"
pubDatetime: 2026-04-06T01:10:00Z
description: "Step-by-step guide to creating custom shortcuts in Windows Terminal for faster workflows"
featured: true
draft: false
tags:
  - terminal
  - windows
  - powershell
  - productivity
  - shortcuts
---

# Creating Custom Shortcuts in Windows Terminal

## Introduction

As a developer, you likely rely on keyboard navigation for efficiency. Minimizing mouse usage streamlines your workflow by keeping your hands on the keys.

I use Windows Terminal daily to execute commands, but long or repetitive ones—like SSH connections or Docker stack management—can slow me down. To address this, I've created custom shortcuts (aliases and batch scripts) that drastically improve my productivity.

These shortcuts handle SSH access, Docker operations, system controls, file listings, and Git commands. Below, I'll walk you through each one.

## SSH Shortcuts

Managing multiple VMs requires remembering usernames, IPs, and ports—tedious and error-prone. A simple batch script solves this.

Create `connect-ssh.bat` in a directory like `D:\bin\` and add:

```bash
@echo off
setlocal

:: Define servers here
if "%1"=="" goto usage

if "%1"=="vm1" set SSH_CMD=ssh raspi01@192.168.147.91
if "%1"=="vm2" set SSH_CMD=ssh -p 224 dev@localhost
if "%1"=="vm3" set SSH_CMD=ssh -i C:\\Users\\Ariz.Muajianisan\\.ssh\\arizmuajianisan arizmuajianisan@34.61.28.179

:: Add more servers as needed

:: Run SSH command if defined
if defined SSH_CMD (
    %SSH_CMD%
) else (
    echo Unknown server: %1
    goto usage
)

exit /b

:usage
echo Usage: %0 [server-name]
echo Available servers:
echo   vm1
echo   vm2
echo   vm3
exit /b
```

Then add this to the `$PROFILE`

```bash
# SSH

function sshConnect {
    param ([string]$vm)
    & "D:\bin\ssh-connect.bat" $vm
}
Set-Alias shc sshConnect
```

Now, connect with a single alias: `shc vm1`. No more memorizing credentials—just intuitive server names.

## Docker Management

I've defined two PowerShell aliases for Docker Compose stacks.

For starting in detached mode:

```powershell
function dockerComposeUpDetach {
    docker compose up -d
}
Set-Alias dup dockerComposeUpDetach
```

For stopping (with optional volume removal):

```powershell
function dockerComposeDownRemVolume {
    docker compose down @args
}
Set-Alias ddown dockerComposeDownRemVolume
```

Run `dup` to start, or `ddown -v` to stop and remove volumes. Simple and flexible.

## System Operations

Built-in commands like `shutdown` work, but they're verbose. My aliases make them snappier.

Instant shutdown: `mati`

```powershell
function fastShutdown {
    shutdown /s /f /t 1
}
Set-Alias mati fastShutdown
```

Quick restart: `restart`

```powershell
function fastRestart {
    shutdown /r /f /t 1
}
Set-Alias restart fastRestart
```

## Enhanced File Listings

PowerShell's `ls` lacks human-readable sizes by default. My `lsh` (list with sizes) and `lshd` (directories only) fix that, with optional sorting (`-s`).

Example `lsh` output:

```
Name                 Size      Mode  LastWriteTime
----                 ----      ----  -------------
.astro               -         d---- 2/26/2026 12:31:46 AM
.github              -         d---- 11/22/2025 4:04:00 AM
...
package-lock.json    381.30 KB -a--- 12/9/2025 3:40:28 PM
```

`lshd` shows directory sizes:

```
Name         Size
----         ----
node_modules 844.18 MB
dist         6.51 MB
...
```

Full functions (add to your profile):

```powershell
function lsh {
    param([switch]$d, [switch]$s)
    $items = Get-ChildItem
    if ($s) {
        $items = $items | Sort-Object @{
            Expression = {
                if ($_.PSIsContainer -and $d) {
                    (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
                } else {
                    $_.Length
                }
            }
        } -Descending
    }
    $items | Select-Object Name, @{
        Name = "Size"; Expression = {
            if ($_.PSIsContainer) {
                if ($d) {
                    $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
                    if ($size -ge 1GB) { "{0:N2} GB" -f ($size / 1GB) }
                    elseif ($size -ge 1MB) { "{0:N2} MB" -f ($size / 1MB) }
                    elseif ($size -ge 1KB) { "{0:N2} KB" -f ($size / 1KB) }
                    else { "$size B" }
                } else { "-" }
            } else {
                $len = $_.Length
                if ($len -ge 1GB) { "{0:N2} GB" -f ($len / 1GB) }
                elseif ($len -ge 1MB) { "{0:N2} MB" -f ($len / 1MB) }
                elseif ($len -ge 1KB) { "{0:N2} KB" -f ($len / 1KB) }
                else { "$len B" }
            }
        }
    }, Mode, LastWriteTime
}

function lshd {
    Get-ChildItem -Directory | ForEach-Object {
        $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
        [PSCustomObject]@{
            Name = $_.Name
            Size = if ($size -ge 1GB) { "{0:N2} GB" -f ($size / 1GB) }
                   elseif ($size -ge 1MB) { "{0:N2} MB" -f ($size / 1MB) }
                   elseif ($size -ge 1KB) { "{0:N2} KB" -f ($size / 1KB) }
                   else { "$size B" }
        }
    } | Sort-Object { [double]($_.Size -replace '[^0-9.]') } -Descending
}
```

## Git Shortcuts

Frequent Git commands deserve aliases too.

`stats` for status:

```powershell
function GitStatus { git status }
Set-Alias stats GitStatus
```

`commit` for commits:

```powershell
function GitCommit { git commit }
Set-Alias commit GitCommit
```

## Complete Setup

Add all aliases to your PowerShell profile for persistence. Edit it with:

```powershell
nano $PROFILE
```

Paste this complete script:

```powershell
# Custom Listing Functions (lsh / lshd)
function lsh { ... }  # (Insert full lsh function from above)
function lshd { ... } # (Insert full lshd function from above)

# SSH
function sshConnect { param ([string]$vm); & "D:\\bin\\ssh-connect.bat" $vm }
Set-Alias shc sshConnect

# Docker
function dockerComposeUpDetach { docker compose up -d }
Set-Alias dup dockerComposeUpDetach
function dockerComposeDownRemVolume { docker compose down @args }
Set-Alias ddown dockerComposeDownRemVolume

# OS
function fastShutdown { shutdown /s /f /t 1 }
Set-Alias mati fastShutdown
function fastRestart { shutdown /r /f /t 1 }
Set-Alias restart fastRestart

# Git
function GitStatus { git status }
Set-Alias stats GitStatus
function GitCommit { git commit }
Set-Alias commit GitCommit
```

Reload with `. $PROFILE`. You're set!

## Final Notes

These shortcuts are tailored for Windows PowerShell in Terminal. Adapt for Linux/macOS (e.g., Bash aliases or Zsh). Test thoroughly, especially SSH and shutdown commands.
