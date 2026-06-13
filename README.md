# Regula Nexus

## Overview

This website is a dynamic adaptation of the rules of Ultimate Frisbee. It displays the United States Club ruleset (USAU) and the US pro leagues (PUL, UFA, WUL). 

Features:
* Rules can be pinned for cross referencing.
* The table of contents is always visible for fast navigation.
* Supports many rulesets all on one site, not as PDFs.
* Mobile-friendly. The site has different designs optimized for mobile and desktop.
* Dark mode
* Ability to show and hide annotations. 
* Each rule is a link that can be shared. 
* Static webpage. No tracking or ads. 

View the site at: https://afbcary.github.io/regula_nexus/


## Development
### Using Python UV

* [Install UV](https://docs.astral.sh/uv/getting-started/installation/)
* [Install Python](https://docs.astral.sh/uv/guides/install-python/)

### Scrape the rules
From ./python dir:

```bash
$ uv run scrape_usau_rules.py
```

This script scrapes https://usaultimate.org/rules/ and generates ./src/rules.json.

### Install NVM, Node, and NPM 

https://github.com/nvm-sh/nvm

```bash
$ nvm install node
```

```bash
$ sudo apt install npm
```

### Install dependencies

```bash
$ npm install
```

### Run the React Next project

```bash
$ npm run dev
```

Open http://localhost:3000.

### Deployment

The site uses Github Pages with an action to deploy upon merging to the main branch.