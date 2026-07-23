---
title: "Clean Your Downloads Folder!"
author: "arizmuajianisan"
pubDatetime: 2026-02-26T01:10:00Z
description: "A python script for cleaning your downloads folder"
featured: true
draft: false
tags:
  - python
  - downloads
  - organization
---

# The Issue

Actually, this is kind of embarrassing. Everytime I download something, it just goes to my Downloads folder. After a while, it just gets too big and I end up deleting files that I might need later. It's a real mess. Hard to find files when you need them.

So, I decided to write a python script to clean my downloads folder. At first, it just works for my personal use, but then I think why not share it with the world?

You can find it [here](https://arizmuajianisan.github.io/pikapika/)

## What is Pikapika?

“Pika Pika (ピカピカ)” is an onomatopoeia in Japanese, meaning “shiny” or “sparkly”. This project is mainly used to clean your folders of clutter and manage them efficiently. It automatically files items into category folders (Images, Documents, Archives, Installers, etc.) and optionally quarantines junk files such as partial downloads.

It works on Windows and Linux (macOS is not tested yet).

## How to Use

It's quite simple, just run this:

```bash
uvx pikapika-organizer --dry-run
```

This will tell you what files will be moved, without actually moving them. You can check what the others functions do by running:

```bash
uvx pikapika-organizer --help
```

I recommend you to run with `--dry-run` option first to see what it will do.

## Experience

Beside developing this tool, I also learn a lot when I deploy it to pypi. And this is my first apps that I deploy to pypi.
Before this, I see others have a interesting tools, and now I make one too.

## Conclusion

More detail you can check the repository [here](https://github.com/arizmuajianisan/pikapika)
