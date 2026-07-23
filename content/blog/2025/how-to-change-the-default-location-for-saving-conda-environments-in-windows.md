---
title: "How to Change Conda Env Location on Windows"
author: "arizmuajianisan"
pubDatetime: 2025-02-11T15:22:00Z
description: "How to change the default location for saving environment Conda in Windows"
featured: false
draft: false
tags:
  - conda
  - python
ogImage: "/images/conda-image.jpg"
---

How to change the default location for saving environment Conda in Windows

![Anaconda Image](/images/conda-image.jpg)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction - Why Should Change?](#introduction---why-should-change)
- [Why Change the Default Env Location?](#why-change-the-default-env-location)
- [Why Not Use Venv?](#why-not-use-venv)
- [How To Change the Location ENV Conda](#how-to-change-the-location-env-conda)
- [Step 1: Locate and Edit the .condarc](#step-1-locate-and-edit-the-condarc)
- [Step 2: Add New Environment Directories](#step-2-add-new-environment-directories)
- [How to Create a New Environment in a New Location](#how-to-create-a-new-environment-in-a-new-location)
- [Step 3: Create a New Env](#step-3-create-a-new-env)
- [Activating New Env](#activating-new-env)
- [Remove The Env](#remove-the-env)
- [Conclusion](#conclusion)

## Introduction - Why Should Change?

[Anaconda](https://www.anaconda.com/download) is a popular open-source distribution of Python and R programming languages, specifically designed for data science, machine learning, and scientific computing. It comes with a powerful package manager called**[Conda](https://docs.conda.io/)**, which simplifies the process of creating, managing, and switching between virtual environments. Virtual environments are isolated spaces where you can install specific versions of Python and libraries without affecting your system-wide setup.

However, one common issue Anaconda users face is the**default location for saving environments**. By default, Conda stores environments on the system drive (usually C:), which can quickly consume valuable disk space—especially if you work with multiple environments for testing, development, or different projects. If your system drive is running out of space, moving or adding a new location for Conda environments can be a lifesaver.

In this guide, I’ll show you how to change the default location for Conda environments in Windows and add a new directory to store your environments on another drive.

## Why Change the Default Env Location?

The primary reason to change the default location is**disk space management**. If your system drive (C:) is running low on storage, moving your Conda environments to another drive with more free space can help. This is particularly useful if you:

- Work with multiple environments for different projects.

- Use large libraries or datasets that take up significant space.

- Want to keep your system drive clean and optimized.

I faced this issue myself when my C: drive was nearly full due to numerous Conda environments. Even after cleaning up unused environments, the space consumption was still significant. That’s when I decided to explore how to move or add a new location for Conda environments.

## Why Not Use Venv?

Before diving into Conda, I considered using Python’s built-in**venv**module to create virtual environments. However, I quickly realized that venv has limitations, especially when working with multiple Python versions. With venv, you need to install the specific Python version on your system before creating an environment, which adds unnecessary complexity.

Conda, on the other hand, allows you to specify the Python version directly when creating an environment, without needing to pre-install it. This makes Conda a more flexible and user-friendly option for managing environments. However, I still needed a way to move or add a new location for Conda environments to free up space on my system drive.

## How To Change the Location ENV Conda

To change the default location for Conda environments, you’ll need to modify the**.condarc**file. This file contains configuration settings for Conda, including the directories where environments are stored.

## Step 1: Locate and Edit the .condarc

1. Open your file explorer and navigate to your home directory (usually `C:\Users\YourUsername`).

2. Look for a file named `.condarc`. If it doesn’t exist, you can create one.

3. Open the `.condarc` file in a text editor (e.g., Notepad or VS Code).

## Step 2: Add New Environment Directories

In the `.condarc` file, add the following lines to specify the default and new environment directories:

```
envs_dirs:
  - C:\Users\YourUsername\Anaconda3\envs  # Default location
  - D:\anaconda-envs  # New location
```

In this example:

- `C:\Users\YourUsername\Anaconda3\envs` is the default location where Conda stores environments.

- `D:\anaconda-envs`is the new directory on another drive where you want to store environments.

**Note:**Make sure to create the new directory (e.g.,`D:\anaconda-envs`) before editing the`.condarc`file.

## How to Create a New Environment in a New Location

Once you’ve added the new directory to the`.condarc`file, you can create environments in the new location using the`conda create`command with the`-p`(prefix) option.

## Step 3: Create a New Env

To create a new environment in the new location, use the following command:

```
conda create -p D:\anaconda-envs\env-demo python=3.9
```

Here’s what each part of the command does:

- `conda create`: The basic command to create a new environment.

- `-p D:\anaconda-envs\env-demo`: Specifies the path where the new environment will be created.

- `python=3.9`: Specifies the Python version for the environment.

**Note:** Unlike the default `conda create -n env-name` command, the `-p` option allows you to specify the exact path for the environment.

## Activating New Env

To activate the environment, use the`conda activate`a command followed by the full path to the environment:

```
conda activate D:\anaconda-envs\env-demo
```

Or, you just activate using the name of env like this, since the new env is recognized on the `conda env list`:

```
conda activate env-demo
```

Once activated, you’ll see the environment name in your terminal prompt, indicating that the environment is active.

## Remove The Env

Removing the env with a custom prefix is slightly different from the normal way to remove the conda env. Usually, we can use this to remove the Conda env:

```
conda remove -n test_env --all
```

But, to remove the environment with a custom location, we can do this:

```
conda env remove -p your/custom/path/env
```

## Conclusion

Managing disk space is crucial when working with multiple Conda environments, especially if your system drive is running low on storage. By adding a new location for Conda environments, you can keep your system drive clean and organized while taking advantage of Conda’s powerful environment management features.

Anaconda and Conda are incredibly versatile tools for data scientists, developers, and anyone working with Python. Whether you’re testing different library versions or working on multiple projects, Conda makes it easy to create and manage isolated environments without worrying about conflicts.

Now that you know how to change the default location for Conda environments, you can optimize your workflow and make the most of your available storage. Happy coding!
