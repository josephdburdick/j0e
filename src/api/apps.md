---
title: Shipped
subtitle: Apps people can open today—designed, built, and run through Present Day
apps:
  - name: Cue Quest Shot Clock
    screenshots:
      - src: ${basePath}/assets/images/shots/shot-clock-tablet.webp
        kind: tablet
        alt: "Shot Clock on a tablet: a ring of green notches around a 24-second count"
      - src: ${basePath}/assets/images/shots/shot-clock-mobile.webp
        kind: mobile
        alt: "The Shot Clock remote on a phone, with extension, pause, and reset buttons"
    featured: true
    demo: shot-clock
    icon: ${basePath}/assets/images/apps/cue-quest-shot-clock.webp
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
  - name: Cue Quest
    screenshots:
      - src: ${basePath}/assets/images/shots/cue-quest-feed.webp
        kind: mobile
        alt: "The Cue Quest feed: players confirming tables and stamping spots"
      - src: ${basePath}/assets/images/shots/cue-quest-matches.webp
        kind: mobile
        alt: "Cue Quest matches: start a match and see recent scores"
      - src: ${basePath}/assets/images/shots/cue-quest-passport.webp
        kind: mobile
        alt: "Joe's Pool Passport: 60 spots in 6 cities, with milestones in progress"
    icon: ${basePath}/assets/images/apps/cue-quest.webp
    tagline: Track every match. Find your table.
    description: >
      Log wins against friends and find your next billiards spot. A match
      tracker built for casual players, not leagues. It installs from the
      browser, with no app store in the way.
    status: Live · web app
    links:
      - url: https://app.cue.quest
        label: app.cue.quest
    tags: [Next.js, TypeScript, Supabase]
  - name: Pooltabl.es
    screenshots:
      - src: ${basePath}/assets/images/shots/pooltabl-es-desktop.webp
        kind: desktop
        alt: "The Pooltabl.es home page on desktop: buy, sell, move, and repair pool tables"
      - src: ${basePath}/assets/images/shots/pooltabl-es-mobile.webp
        kind: mobile
        alt: "The Pooltabl.es home page on a phone"
    icon: ${basePath}/assets/images/apps/pooltabl-es.webp
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
        alt: "Where Is Johnny on desktop: the route through Baja California with check-ins beside the trip feed"
      - src: ${basePath}/assets/images/shots/where-is-johnny-mobile.webp
        kind: mobile
        alt: "Where Is Johnny on a phone: the map zoomed to Baja California check-ins"
    icon: ${basePath}/assets/images/apps/where-is-johnny.webp
    tagline: A motorcycle trip you can follow.
    description: >
      One rider, New York City to wherever the road ends. The public map runs
      three days behind to keep him safe; his family gets a private link that
      shows where he is right now.
    status: Live
    links:
      - url: https://whereisjohnny.com
        label: whereisjohnny.com
    tags: [Vite, Cloudflare Workers, PWA, Maps]
stealth:
  - name: Rack
    note: Software for billiards venues
  - name: Ola
    note: A mental health clinic
---
