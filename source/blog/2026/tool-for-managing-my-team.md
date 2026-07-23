---
title: "Leantime: Tool for Managing My Team"
author: "arizmuajianisan"
pubDatetime: 2026-02-25T12:27:00Z
description: "Self-hosted project management tool for managing my team"
featured: false
draft: false
tags:
  - leantime
  - docker
  - project-management
  - self-hosted
---

# How I Used to Manage My Team

My company used to be pretty old-school. Managers or team leaders would hand out tasks and track everything in Excel. Yep, Excel. We’d stash the files on an internal network drive, and everyone had to go in and check them manually.

The big issue? Managers rarely had a clear picture of what was going on because the info was scattered. The team had to dig into the file themselves, and managers were always bugging people for status updates.

I really needed a tool that would let me see project progress in real-time and make assigning tasks a breeze.

I also wanted one single spot for all our project info—stuff like standard docs, code documentation, and whatever else we needed.

I used to use Notion, so why didn’t we just go with that? Honestly, I wanted something simpler. Heavy hitters like Notion, Slack, and Jira just felt like overkill for what we actually needed. Plus, I wanted to keep costs down. Since I already have a solid infrastructure in place, going the self-hosted route felt like a no-brainer.

## Enter Leantime

After digging around a bit, I stumbled across Leantime. It’s an open-source, self-hosted project management tool that you can toss right onto your local server. It packs some really solid features, too—like task management, full project tracking, and even a kanban board.

## Setting It Up

I went with Docker to get Leantime up and running, and I’m going to show you how I did it. First off, make sure you’ve got Docker and Docker Compose installed. If you don’t, grab them here: [Docker Installation](https://docs.docker.com/get-docker/)

Once that’s sorted, just follow the official docs to get it installed: [Leantime Installation](https://docs.leantime.io/installation/docker)

## The Verdict

Since we started using Leantime, tracking progress and handing out tasks has been ridiculously easy. It’s been a massive help for me because I can finally keep an eye on what everyone is up to without being annoying. And honestly? It’s boosted team morale. There’s something super satisfying about actually seeing your progress move forward on a board.

If you’re a manager or team lead, I highly recommend checking this tool out.
