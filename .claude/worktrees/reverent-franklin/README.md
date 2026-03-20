# PoggioAI Website

Official website for the PoggioAI project.

**Live site:** [https://PoggioAI.github.io](https://PoggioAI.github.io)

**Code:** [https://github.com/PoggioAI/PoggioAI_MSc](https://github.com/PoggioAI/PoggioAI_MSc)

## Install

Install Node.js (see https://nodejs.org/en/download if not using Mac):
```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v
npm -v
```

Then clone and install:
```bash
git clone git@github.com:PoggioAI/PoggioAI.github.io.git
cd PoggioAI.github.io
npm install
```

## Run the website locally

```bash
npm run dev
```

## Deployment

The site is automatically deployed to GitHub Pages on every push to `main` via GitHub Actions.
