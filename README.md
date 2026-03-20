# OpenPI Website

Official website for the OpenPI project.

**Live site:** [https://openpi-mit.github.io](https://openpi-mit.github.io)

**Code:** [https://github.com/OpenPi-mit/OpenPI](https://github.com/OpenPi-mit/OpenPI)

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
git clone git@github.com:OpenPi-mit/OpenPi-mit.github.io.git
cd OpenPI.github.io
npm install
```

## Run the website locally

```bash
npm run dev
```

## Deployment

The site is automatically deployed to GitHub Pages on every push to `main` via GitHub Actions.
