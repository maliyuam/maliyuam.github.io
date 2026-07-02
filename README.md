# Muhammad Aliyu — Personal Site

Personal website of **Muhammad Aliyu**, PhD Researcher at KU Leuven & Utrecht University
studying entrepreneurial ecosystems, innovation networks, and founder mobility.

Live at [maliyuam.github.io](https://maliyuam.github.io).

## Design

Dark editorial design system — no frameworks, no build step, deploys straight to GitHub Pages.

- **Typography:** Inter (UI), Instrument Serif italic (display accents), JetBrains Mono (labels & data)
- **Signature visual:** a live network-constellation canvas in the hero — nodes, proximity edges,
  and pulses travelling along links, echoing the research theme of ecosystem connectivity
- **Motion:** scroll-triggered reveals (IntersectionObserver), count-up stats, logo & testimonial
  marquees, pointer-tracked card spotlights — all respecting `prefers-reduced-motion`
- **Accessibility:** semantic landmarks, skip link, keyboard-visible focus rings, `aria-current`
  navigation, WCAG-conscious contrast

## Structure

```
index.html                  Home — hero, affiliations, stats, research, projects, testimonials
research.html               Research agenda + publications
projects.html               Project portfolio
experience.html             Timeline, education, awards & media
work-with-me.html           Collaboration pillars, engagement options, FAQ
projects/                   Project case studies
assets/css/style.css        Entire design system (tokens → components → animation)
assets/js/main.js           All interactions (vanilla JS, dependency-free)
```

## Local preview

Any static server works:

```bash
npx serve .
```

## Contact

- **LinkedIn:** [linkedin.com/in/maliyuam](https://www.linkedin.com/in/maliyuam)
- **Email:** muhammad.aliyu@kuleuven.be
