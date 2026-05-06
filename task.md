# Little White Rose - Task Tracker

## Overview
OnlyFans-style creator platform with AI model "Little White Rose"
- Flirty, sweet AI persona
- Fully explicit content aesthetic
- Dark rose / blush pink / black aesthetic

## Features
- [x] Images generated (hero, avatar, 5 content images)
- [ ] Design system (dark rose palette, bold serif fonts)
- [ ] Auth (email/password with better-auth)
- [ ] DB schema (users, posts, subscriptions, tips, messages)
- [ ] Payments (Autumn/Stripe: subscription $9.99/mo, PPV, tips)
- [ ] Pages: Landing, Feed, Post detail, Chat, Pricing, Sign-in/Sign-up
- [ ] AI Chat (persona: Little White Rose, flirty/sweet)
- [ ] Autumn payment config (subscription + ppv + tips features)

## Monetization
- Free tier: see blurred previews, limited chat
- Subscription: $9.99/mo - unlocks full feed
- PPV: per-post unlock $3-$15
- Tips: custom request + tip payment

## Design
- Background: near-black #0a0508
- Primary accent: deep rose #c0395a
- Secondary accent: blush pink #f0a0b8
- Gold accent: #d4a853
- Font display: Playfair Display (serif)
- Font body: Lato
- Card style: dark with rose border glow
- Inspired by Vesper template: bold headlines, colorful cards, strong grid

## Pages
1. `/` - Landing/Profile (hero, about, post grid preview, subscribe CTA)
2. `/feed` - Full content feed (subscribers only)
3. `/post/:id` - Individual post (PPV unlock)
4. `/chat` - AI chat with Little White Rose (gated)
5. `/pricing` - Subscription tiers
6. `/sign-in` - Sign in
7. `/sign-up` - Sign up

## Progress
- [ ] styles.css (dark rose theme)
- [ ] DB schema
- [ ] Auth setup
- [ ] API routes (posts, tips, chat/agent)
- [ ] Autumn config
- [ ] Landing page
- [ ] Feed page
- [ ] Chat page
- [ ] Pricing page
- [ ] Auth pages
