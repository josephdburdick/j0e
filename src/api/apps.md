---
title: Shipped
headline: Apps people can open today.
intro: >
  Designed, built, and run through Present Day. No team behind these, so every
  layer is mine.
apps:
  - name: Cue Quest Shot Clock
    featured: true
    screenshots:
      - src: ${basePath}/assets/images/shots/shot-clock-demo.webp
        kind: wide
        width: 2000
        height: 856
        alt: "Shot Clock on three devices at 26 seconds: the tablet display, the phone remote with pause and reset, and a spectator's phone with reaction buttons"
    tagline: The pool timer the whole room can watch.
    description: >
      Any spare tablet becomes the display. The person running the night
      controls it from the phone in their pocket, co-hosts can join in, and the
      crowd follows along live in their browser. It keeps counting if the wifi
      drops.
    status: App Store
    released: 2026-11-02
    links:
      - url: https://apps.apple.com/us/app/cue-quest-shot-clock/id6824671081
        label: Download on the App Store
        badge:
          light: ${basePath}/assets/images/badges/app-store-download-en-black.svg
          dark: ${basePath}/assets/images/badges/app-store-download-en-white.svg
    tags: [Expo, React Native, Supabase Realtime, i18n]
    modes:
      title: Three ways to run it
      items:
        - name: With spectators
          note: A phone in the crowd follows along and reacts.
        - name: Without spectators
          note: Just the display and the remote.
        - name: Standalone
          note: One phone is the clock and the controls.
      link:
        url: https://shotclock.cue.quest/demo
        label: Try the demo
  - name: Cue Quest
    screenshots:
      - src: ${basePath}/assets/images/shots/cue-quest-explore.webp
        kind: mobile
        width: 486
        height: 851
        alt: "Cue Quest explore view: a map of New York crowded with pool venue clusters, 475 places in view"
      - src: ${basePath}/assets/images/shots/cue-quest-profile.webp
        kind: mobile
        width: 486
        height: 851
        alt: "Joe's Cue Quest profile: Pool Passport with 60 spots in 6 cities, 98 check-ins, 1,052 contributions"
      - src: ${basePath}/assets/images/shots/cue-quest-matches.webp
        kind: mobile
        width: 486
        height: 851
        alt: "Cue Quest matches: 36 wins, 41 losses, and a list of recent 8-ball results"
    tagline: Track every match. Find your table.
    description: >
      Log wins against friends and find your next billiards spot. A match
      tracker built for casual players, not leagues. It installs from the
      browser, with no app store in the way.
    status: Live · web app · since 2023
    links:
      - url: https://cue.quest
        label: cue.quest
    tags: [Next.js, TypeScript, Supabase]
  - name: Pooltabl.es
    screenshots:
      - src: ${basePath}/assets/images/shots/pooltabl-es-city.webp
        kind: desktop
        width: 1440
        height: 900
        alt: "The Pooltabl.es New York City page: 13 service businesses on a map, with local guides below"
    tagline: Pool tables and the pros who move them, city by city.
    description: >
      A US marketplace for pool tables and a directory of the pros who move,
      install, and service them. Built as a static site with git as the
      database, and growing one metro at a time.
    status: Live · ongoing
    links:
      - url: https://pooltabl.es
        label: pooltabl.es
    tags: [Next.js, Cloudflare Pages, SEO]
  - name: Where Is Johnny
    screenshots:
      - src: ${basePath}/assets/images/shots/where-is-johnny-desktop.webp
        kind: desktop
        width: 1440
        height: 900
        alt: "Where Is Johnny on desktop: a globe with the route from New York to Baja California beside the trip feed"
      - src: ${basePath}/assets/images/shots/where-is-johnny-mobile.webp
        kind: mobile
        width: 780
        height: 1688
        alt: "Where Is Johnny on a phone: the globe, day 43, somewhere past Baja California"
    tagline: A motorcycle trip you can follow.
    description: >
      One rider, New York City to wherever the road ends. The public map runs
      a day behind to keep him safe; his family gets a private link that shows
      where he is right now.
    status: Live · Nov 2026
    links:
      - url: https://whereisjohnny.com
        label: whereisjohnny.com
    tags: [Vite, Cloudflare Workers, PWA, Maps]
upcoming:
  - stage: In stealth
    name: Rack
    note: Software for billiards venues
  - stage: In stealth
    name: Ola
    note: Software to augment mental health medical staff
  - stage: In progress
    name: OJO
    note: A phone for users unable to read
---
