# Evolution 1 Plan

## Context Documents

This evolution plan references the following context documents in the root directory:

### Background Information
- **[background_v6.md](./background_v6.md)** — Personas, how they're set, and display defaults
- **[research_findings_v5.md](./research_findings_v5.md)** — Query params and session flags impacting onboarding

### Onboarding Flows
- **[onboarding flows - account owner.md](./onboarding%20flows%20-%20account%20owner.md)** — Account owner signup flows organized by role and framework
- **[onboarding flows - invited teammate.md](./onboarding%20flows%20-%20invited%20teammate.md)** — Invited teammate flows (new vs existing users), persona and redirects

## Evolution Success Criteria
### primary success criteria
[ ] make it simple and easy to customize onboardings with query strings that trigger intercom popups and tours
[ ] lay the ground work for more advanced custom developed onboarding tools
[ ] simplest possible implementations
[ ] any novice human can read and understand the code
[ ] align any new code, or code that is touched with the "Code Complete" principles found in  ~/Development/vibe_research/agents/code_complete_reviewer/as laid out in code_complete_reviewer.md

### secondary success criteria

[ ] build documentation for developers and AI to make working with onboarding simplwe and easy
[ ] align any new code, or code that is touched with the "Code Complete" principles found in
[ ] create simple docmentation and abstractions that outline the current onboarding focus paths
[ ] stretch goal only: retire unused elements to some type of archive branch, in order to simplify maintenance


## Evolution Specification

We will define where different cases end up using a URL and query string

### Vanilla cases
  - Vanilla + CEO/Visionary + EOS 
        - detected by [how we'll figureit out]
        - end URL → "/today/dashboard[querystring TBD]"
  - Vanilla + Integrator + EOS 
        - detected by [how we'll figureit out]
        - end URL→ "/today/dashboard[querystring TBD]"
  - Vanilla + Coach + EOS 
        - detected by [how we'll figureit out]
        - end URL→ "/today/dashboard[querystring TBD]"

  ### Vision Builder
  - Vision Builder + CEO/Visionary + EOS 
        - this does not need modification, but document the current mechanism fully
        - TBD- might not gather role first
        - TBD - doesn't currently gather framework first (or does it?)
        - detected by [to be documented]
        - end URL→ "[URL][querystring TBD]"
