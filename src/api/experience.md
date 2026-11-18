---
title: Experience
subtitle: Full work history, most recent first
experience:
  - company: Cue Quest
    logo:
      src: /assets/images/logos/cue-quest.webp
      width: 250
      height: 198
    roles:
      - title: Founder & Principal Engineer
        location: Brooklyn, New York
        remote: true
        type: Contract
        date:
          start: 2023-11-01
          end: null
        description: >
          Founded and built Cue Quest, a family of billiards apps, from concept to production—owning strategy, design, and full-stack engineering end to end across nearly 5,000 commits.

          - **Cue Quest app**: A match tracker and table finder for casual players. Log wins against friends, find the nearest billiards spot, and install it straight from the browser

          - **Shot Clock**: A tournament shot clock released on the App Store and Google Play in November 2026. A spare tablet becomes the display, the host runs it from their phone, and spectators watch live in the browser over Supabase Realtime

          - **Rack**: A venue product in pilot—table queue kiosk, reservations, and league blocks—sharing one Supabase project with the player app

          - **Architecture**: Next.js App Router, TypeScript, and Supabase, with Expo for native apps and type safety running from the database schema to the UI

          - **Quality**: Localized, accessible interfaces backed by Playwright end-to-end tests and Vitest unit coverage

        skills: [Next.js, Expo, TypeScript, Supabase, Playwright]

  - company: Present Day
    url: https://present.day
    logo:
      src: /assets/images/logos/presentday.svg
      width: 190
      height: 152
    roles:
      - title: Founder & Principal Engineer
        type: Studio
        date:
          start: 2017-04-01
          end: null
        location: Brooklyn, New York
        remote: true
        description: >
          My design and engineering studio. Clients hire it for design systems and full-stack product work; it also builds and runs its own apps and publishes open-source React packages.


          Earlier work spanned REST and GraphQL integrations and server-rendered apps built with Node, Express, Apollo, React, and Redux—including a major application for Paraguay's largest testing laboratory.

        engagements:
          - name: Assembled
            href: "#assembled"
            note: Senior Software Engineer on contract. Design system 2.0, navigation, and token migrations
            start: 2026-01-01
            end: 2026-09-01
          - name: Where Is Johnny
            href: https://whereisjohnny.com
            note: Trip tracker with a delayed public map and a private live link for family
            start: 2026-11-01
            end: 2026-11-01
          - name: Cue Quest Shot Clock
            note: Tournament shot clock for iOS and Android, released on the App Store Nov 2 and Google Play Nov 12, 2026
            links:
              - label: App Store
                href: https://apps.apple.com/us/app/cue-quest-shot-clock/id6824671081
              - label: Google Play
                href: https://play.google.com/store/apps/details?id=app.cuequest.shotclock
            start: 2026-08-01
            end: 2026-11-01
          - name: Rack
            note: In stealth. Software for billiards venues
            start: 2026-10-01
            end: null
          - name: Ola
            note: In stealth. Software to augment mental health medical staff
            start: 2026-09-01
            end: null
          - name: Pooltabl.es
            href: https://pooltabl.es
            note: Ongoing US marketplace for pool tables and directory of the pros who service them
            start: 2026-05-01
            end: null
          - name: Open source
            href: "/#open-source"
            note: Five React packages on npm—drawer, reveal-row, buzz, scroll-area, and carousel
            start: 2026-04-01
            end: null
          - name: Cue Quest
            href: "#cue-quest"
            note: The studio's own product. Match tracker and table finder for casual players
            start: 2023-11-01
            end: null
        skills: [Design Systems, React, Next.js, Node, Open Source]

  - company: Assembled
    logo:
      src: /assets/images/logos/assembled.svg
      width: 154
      height: 24
    roles:
      - title: Senior Software Engineer
        location: New York
        remote: true
        type: Contract
        showType: true
        date:
          start: 2026-01-01
          end: 2026-09-01
        description: >
          Contract engagement through Present Day. Primary driver of the Assemblage 2.0 design system migration inside a 10,000+ commit production codebase, ranking a top-5 contributor by commit volume. Built foundations, then personally migrated the product onto them rather than handing them off and hoping adoption followed.

          - **App Layout**: Designed and shipped the new App Layout component—a composable page shell (header, content, footer) with scroll-aware sticky headers that pin, collapse, and reveal a divider on scroll, toggleable header slots, and full-bleed or centered reading-column layouts—then migrated 30+ product surfaces onto it

          - **Navigation 2.0**: Shipped the GlobalNav rail end-to-end—foundational components, canonical primary nav IA, secondary accordion panel, collapse toggle with hover-intent expand, and a rollout notice for the opt-in flow

          - **Design token migration**: Wrote the codemods and a custom `no-legacy-tokens` ESLint rule that made the spacing, typography, and color migrations tractable—single PRs safely touching 500–680 files, with lint severity escalated from warning to error so the migration actually finished

          - **Agent schedule requests**: Rebuilt the request sheet into a modular, type-based structure with shared types and step builders, shipping a detail overlay that lets agents view, edit, and cancel time off, swaps, revisions, overtime, and VTO in one place

          - **Smart Fields**: Drove a complex feature from ambiguous designs and an incomplete backend to a clean, on-schedule launch, resolving open questions with design and backend engineering along the way

          - **Accessibility & mobile**: Fixed virtual keyboards obscuring option lists at the shared component layer, so every select and input flow inherited the improvement instead of taking N per-screen patches

        skills: [React, TypeScript, Design Systems, Codemods, Accessibility]

  - company: Delaware Water Disaster
    disabled: true
    logo:
      src: /assets/images/logos/delaware-water-disaster.webp
      width: 42
      height: 64
    roles:
      - title: Designer & Full-Stack Engineer
        location: Millsboro, Delaware
        remote: true
        type: Contract
        date:
          start: 2025-09-01
          end: 2025-11-01
        description: >
          Built and launched a content platform for Delaware Water Disaster, a public-interest initiative focused on water-related emergencies and community response. Contracted through Present Day.

          - **Full-Stack Development**: Owned architecture and development—Next.js, TypeScript, and Payload CMS on Postgres

          - **Content Management**: Modeled flexible collections with rich text editing and media management, so editors publish without engineering help

          - **Editorial Experience**: Built the editor interface with role-based permissions and site-wide search

          - **Performance & SEO**: Optimized load performance, search metadata, and accessibility
        skills:
          [
            "Next.js",
            "TypeScript",
            "Payload CMS",
            "Postgres",
            "Railway",
            "AWS S3",
            "Tailwind",
            "shadcn/ui",
            "Playwright",
            "Vitest",
            "Docker",
            "pnpm",
            "SEO",
            "Content Modeling",
            "Rich Text Editing",
            "Search",
            "Authentication",
            "Authorization",
            "Performance",
            "Migrations",
            "Resend",
            "Email Delivery",
          ]

  - company: Exponential.fi
    logo:
      src: /assets/images/logos/exponential.svg
      width: 601
      height: 76
    roles:
      - title: Lead Software Engineer
        location: San Francisco, California
        remote: true
        type: Full-time
        date:
          start: 2024-08-01
          end: 2025-08-01
        description: >
          Led front-end development for Exponential.fi's trading dashboard and portfolio experience, delivering a complete UI/UX overhaul of the core investment workflows.

          - **Product Development**: Redesigned and rebuilt the trading and portfolio interfaces

          - **Security & Auth**: Shipped MFA and email verification, and added Sentry error monitoring

          - **Performance**: Cut load times through data-fetching, SSR, and caching improvements

          - **Documentation**: Wrote the architecture and onboarding guides new engineers ramped up on

          - **Marketing**: Coordinated releases with product launches and built site-wide promotions

        skills: [React, Authentication, Performance, Sentry, Documentation]

  - company: Unqork
    logo:
      src: /assets/images/logos/unqork.svg
      width: 120
      height: 32
    roles:
      - title: Senior Software Engineer
        location: Manhattan, New York City
        remote: true
        type: Full-time
        date:
          start: 2020-01-01
          end: 2024-08-01
        description: >
          Founding member of the Platform UI team; interviewed and recruited several of its core engineers.


          Spearheaded development of the Unqork Design System (UQDS), which remains a core part of Unqork's platform.


          After UQDS shipped, moved to the Module Builder team to integrate the design system into component settings, contributing to 92 module definitions built on UQDS.


          Finished on the Experience Engineering team, building new components on the Runtime team's Vega engine.
        skills: [React, Design Systems, Module Development, Recruitment]
      - title: Software Engineer Contractor
        location: Manhattan, New York City
        remote: true
        type: Contract
        date:
          start: 2018-02-01
          end: 2020-01-01
        description: >
          Joined as an original member of the "Theme Team" before Unqork Digital Services existed, building 50+ custom themes and demos with the team.


          Created utility classes that let configurators make CSS changes without engineering support—a practice Unqork Digital adopted years later.


          Helped transition the Module/App Builder from v1 to v2; much of that work on design, styles, and behavior is still in use today.
        skills: [Angular, Theme Development, Utility Classes, Module Transition]

  - company: Joey
    disabled: true
    remote: true
    roles:
      - title: UX, Designer and Web Engineer
        type: Self-employed
        location: Bedstuy, Brooklyn, New York City
        remote: true
        date:
          start: 2009-11-01
          end: 2017-04-01
        description: >
          Managed and collaborated with a team of designers and developers, overseeing the creation of digital materials.


          Engaged in technical consulting and directed the design and development of brands and websites.


          Executed email marketing campaigns for clients like Carrot Creative, MTV, David's Bridal, Sotheby's, and Tambaran Tribal Art.


          Partnered with agencies such as White + Partners, KBGD, and Breensmith Advertising.


          Contributed to a variety of projects including the production of print and digital materials for annual reports, brochures, advertisements, logos, presentation binders, CD covers, websites, and interactive kiosks.
        skills:
          [
            Node,
            Communication,
            JavaScript,
            Node,
            Fullstack,
            Web Standards,
            Team Management,
            Technical Consulting,
            Email Marketing,
            Brand Development,
          ]

  - company: Adoptive
    hidden: true
    logo:
      src: /assets/images/logos/adoptive.webp
      width: 200
      height: 200
    remote: true
    roles:
      - title: UX, Lead Front-end Engineer
        location: Soho, New York City
        remote: true
        type: Full-time
        date:
          start: 2014-03-01
          end: 2016-08-01
        description: >
          Led front-end development on YaleMedicine.org and Bundoo.com, contributing to strategic planning and user experience design on both.


          Set and enforced the team's development standards—code style, linting, and Git branch management.


          Bundoo earned an honorable mention at the Webby Awards.


          Led the deployment of the Yale School of Medicine website, built with Gulp, Webpack, React, and PostCSS and integrated with a .NET back end.
        skills: [React, ".NET", UX Design, Development Standards]

  - company: Studiografica
    hidden: true
    logo:
      src: /assets/images/logos/sgc.svg
      width: 518
      height: 380
    remote: false
    roles:
      - title: UX, Tech Director, Lead Front-end Engineer
        location: SoHo, New York City
        type: Full-time
        date:
          start: 2011-01-01
          end: 2013-06-01
        description: >
          Oversaw all physical technology resources within the agency.


          Recruited, trained, and managed a diverse team of freelancers, both locally and internationally.


          Consulted on UI design, UX, and cross-browser/platform compatibility.


          Built progressively enhanced front ends across client projects.


          Worked with high-profile brands such as Ciroc Vodka, Macy's, Casio, W.W. Glass, and David's Bridal, as well as the Venture Development Center, contributing significantly to both client-facing and internal projects.
        skills: [Technology Management, Recruitment, UI/UX Consultancy, Progressive Enhancement]

  - company: David's Bridal
    hidden: true
    logo:
      src: /assets/images/logos/davids-bridal.svg
      width: 180
      height: 40
    location: Midtown, New York City
    remote: false
    roles:
      - title: Senior Designer / Front-end Engineer
        type: Full-time
        date:
          start: 2008-11-01
          end: 2011-04-01
        description: >
          Oversaw the design and development of email blasts, web banner advertisements, and features for web and email, as well as landing pages for one of the largest bridal retail stores in the country and its affiliate site, OurWeddingDay.


          Led the redesign of the corporate style guide, the main website, branding elements, the vendor control panel for logged-in users, and various content pages.


          Managed the relationship with an outsourced back-end development firm until late 2009. This collaboration continued until the company broadened its focus and created specialized roles for designers and developers.
        skills: [Email Marketing, Corporate Style Guide, Vendor Management]

  - company: Aquent
    logo:
      src: /assets/images/logos/aquent.svg
      width: 332
      height: 46
    location: Washington DC
    disabled: true
    roles:
      - title: Designer / Front-end Web Developer
        type: Full-time
        date:
          start: 2007-01-01
          end: 2008-10-01
  - company: TMP Worldwide
    logo: /assets/images/logos/tmp.svg
    disabled: true
    location: McLean, Virginia
    roles:
      - title: Designer
        type: Full-time
        date:
          start: 2008-01-01
          end: 2008-03-01
        description: >
          Assisted Creative Director and Art Director on an advertising campaign spanning web and print media for the Department of Defense Missile Defense Agency.
        skills:
          [
            Communication,
            JavaScript,
            Web Standards,
            Advertising Campaigns,
            Print Media,
          ]

  - company: National Crime Prevention Council
    logo:
      src: /assets/images/logos/ncpc.webp

    location: Washington, DC
    disabled: true
    roles:
      - title: Public/Media Relations, Program Associate
        type: Full-time
        date:
          start: 2007-07-01
          end: 2008-01-01
        description: >
          Responsible for all aspects of public/media relations including: leveraging the positive assets of the organization's brand icon, McGruff the Crime Dog®; foster non-traditional media and advertising opportunities for NCPC and conduct aggressive media outreach for the National Citizens' Crime Prevention Campaign; assist in the development process of production for television public service announcements; act as liaison between NCPC spokespeople and the mass media including major television networks, newspapers, and magazines; handle daily media inquiries, schedule television and phone interviews; prepare talking points, press releases, and media kits; and help promote NCPC story lines.
        skills:
          [
            Communication,
            Media Relations,
            Public Relations,
            Media Outreach,
            Press Releases,
          ]

      - title: Media Assistant
        type: Full-time
        date:
          start: 2004-06-01
          end: 2006-08-01
        description: >
          Maintained a full load of duties working right below the directors of three separate departments and fulfilled work with creativity and diligence. Reorganized and redesigned the Statistic Summary Report system so further maintenance was minimal. Organized email addresses for press releases to thousands of media personnel and other interested individuals/corporations. Critiqued and solved problems of editing source to sites that were maintained by proprietary management systems. Remained as a telecommuting intern developing web design and other freelance work during the school semester.
        skills:
          [
            Communication,
            Media Relations,
            Public Relations,
            Report System Design,
            Email Management,
          ]

  - company: Fishbowl Marketing
    remote: false
    hidden: true
    roles:
      - title: Production Designer / Engineer
        location: Alexandria, Virginia
        type: Full-time
        date:
          start: 2008-01-01
          end: 2008-12-01
        description: >
          Developed a high number of highly conceptual email campaign templates for restaurants in the United States and European markets.
        skills: [Email Marketing, Campaign Design]

  - company: Virginia Commonwealth University
    hidden: true
    logo:
      src: /assets/images/logos/vcu.svg
      width: 157
      height: 67
    roles:
      - title: Dev-Ops Engineer, Front-end Designer / Engineer
        location: Richmond, Virginia
        type: Full-time
        remote: true
        date:
          start: 2006-08-01
          end: 2007-05-01
        description: >
          Managed design, development, and hosting for the VCU speaker series website, Creating and Consuming Culture in the Digital Age. Collaborated with teams from Boing Boing and Wikipedia.


          Played a pivotal role in ensuring the website effectively represented the series' focus on digital technologies' impact on culture, humanities, and arts.


          This series was a collaboration between VCU's Department of English, School of Mass Communications, and the School of the Arts.
        skills: [Web Design, Hosting]
      - title: Art Director
        type: Full-time
        disabled: true
        date:
          start: 2006-06-01
          end: 2007-05-01
        description: >
          Worked closely with Creative Director on print concepts for Creating & Consuming Culture in the Digital Age, a collection of VCU-hosted speaker series.


          Oversaw the design, copywriting, and production of four posters, prominently displayed on campus, highlighting the series' exploration of digital technology's influence on contemporary culture and the arts.


          Coordinated with various departments within VCU to ensure the series' successful representation through visual media.
        skills: [Art Direction, Print Design]
---

My career has moved through design, front-end, and full-stack roles, always focused on blending technology and design into experiences people enjoy using.

Most recently I contracted at Assembled through Present Day, from January to September 2026, where I drove the Assemblage 2.0 design system migration across a large production codebase. I built the foundational components and then migrated the product onto them myself—page architecture, global navigation, and a token migration made tractable by codemods and a custom lint rule. Alongside the platform work, I shipped product features and fixed accessibility issues at the shared layer, so every surface inherited the improvement.

Earlier at Unqork, I was there from day one—helping build the Platform UI team and develop the Unqork Design System (UQDS), which became a cornerstone of the platform. I later integrated that system into component settings and built new components on the platform's Vega runtime engine.

Through Present Day, I've led full-stack development projects for over a decade, including a major application for Paraguay's largest testing laboratory—work that meant collaborating across time zones and cultures. The studio also builds its own products: Cue Quest, a billiards match tracker and table finder, and Cue Quest Shot Clock, released on the App Store and Google Play in November 2026.

At Adoptive, I led front-end work on YaleMedicine.org and Bundoo.com, the latter earning an honorable mention at the Webby Awards.

I'm passionate about communication, mentoring, and driving innovation. Whether it's through developing robust applications or enhancing user interfaces, I strive to create impactful and enjoyable digital experiences.
