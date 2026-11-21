---
title: "BizTrip"
description: "A small web app I built to record my business trip expenses, so the report to finance is done without any drama."
weight: 0
tech:
  - Nuxt
  - TypeScript
  - Nuxt UI
  - Drizzle ORM
  - Neon Postgres
  - Cloudflare Workers
url: "https://biztrip.arzlabserver.my.id"
repo: "https://github.com/arizmuajianisan/biztrip"
image: "/images/showcase/biztrip/trip-overview.webp"
featured: true
draft: false
---

## The Story Behind It

This year, in August, I had a schedule to visit my company HQ in Japan. One week. It was not my first time, I have done this trip several times already, and every time there is one thing that keeps bugging me. Maybe it is not your issue, but for me it is a real headache.

When I come back to the office, I need to create an expense report for finance. I should attach every ticket and every piece of paper: hotel payment, train tickets, bus tickets. On top of that, I should separate my incentive (per diem) for things like dinner and souvenirs, because that one is not counted the same way.

And the worst part? Sometimes I forgot where the receipt is. Or I remember the receipt, but I forgot the price. So I end up revising my report again and again, several times, until finance is happy.

From that background I thought, what if I just record everything during the trip? Simple, right? Just take a picture or write a note.

Unfortunately, I already did that. And it still did not work. The photos were mixed with my other photos, the notes were scattered, and at the end of the trip I still had to put everything together from a messy pile. Still a headache.

Then the idea came. Why don't I just create an app for this specific issue?

So I created **BizTrip**.

## How It Works

The flow is simple. I create a trip, set the budget for each type of expense, and then every time I pay for something, I add it to the app right away. I can also take a picture of the receipt as evidence. Everything happens from my phone.

### Trips

![The trip list in BizTrip](/images/showcase/biztrip/trips.webp){.screenshot}

This is the first page. Every trip is listed here with the country, the dates, and how much budget is still remaining. One glance and I know where I am.

### Setting the Budget

![Editing the budget per category](/images/showcase/biztrip/edit-budgets.webp){.screenshot}

Before the trip starts, I set the allowance for each category, the same categories my finance team uses: Air Ticket, Taxi & Bus, Hotel Bill, Train Fee, Travel Procedure Expense, Travel Insurance, and Other.

Per Diem has its own place at the bottom. It is my personal budget, so it is tracked, but it is never part of the money I return to the company. This was exactly the part that always confused me when I did the report by hand.

### The Trip Overview

![Overview of a single trip](/images/showcase/biztrip/trip-overview.webp){.screenshot}

Inside a trip, I can see the remaining budget, the remaining per diem, and the most important one for me: how much I need to **return to the company** from my cash advance. No more calculating at my desk on the last day.

The big green **Add expense** button is always at the bottom, so it is easy to reach with one thumb while I am standing at the station.

### Adding an Expense

![Adding an expense with a receipt photo](/images/showcase/biztrip/edit-expense.webp){.screenshot}

This is the part I use the most. Amount, currency, category, date, and a short note, like "Hotel, Shin-Yokohama sta to Hirose Denki". Then I take a picture of the receipt and attach it. Done, back to my pocket.

It also supports other currencies. The exchange rate is saved together with the expense based on the date I spent it, so the total will not change later.

### The Report

![The report page, ready to print](/images/showcase/biztrip/report.webp){.screenshot}

After a week, I came back to the office, opened this page, and pressed the print button. That's it.

The report is grouped by category, showing the allowance, the actual spending, and what is left. Each expense also shows how many receipts are attached. There is a toggle to hide my per diem details, because the company copy doesn't need to know what I ate for dinner. 😄

![Settlement and receipts appendix](/images/showcase/biztrip/settlement.webp){.screenshot}

At the bottom there is the settlement: the cash advance, minus the reimbursable expenses, minus the per diem, and the final amount I need to return. It is also converted to IDR with the rate and the date written on it, so finance can see where the number comes from. After that, all the receipt photos are attached as an appendix.

Guess what? My report was accepted without any drama. First try. No revision.

## What's Next

Honestly, this app still needs a lot of improvement. For now, it is personal only, and very specific to business trips like mine. You also cannot try it yet, since there is no public sign-up. I plan to add **Sign in with Google**, so you can try it yourself.

Later, maybe I can make it more general, not only for business trips but as an expense recorder, or even a personal finance manager. Maybe?

If you have the same problem, or you have an idea to make this better, collaboration is very welcome. Feel free to check the repository and open an issue or a pull request.
