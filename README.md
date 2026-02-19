# Poggio Lab Website
Official Website.

# Install

Install uv (Python package manager)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```


Install npm (see https://nodejs.org/en/download if not using mac)
```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v # Should print "v24.13.1".

# Verify npm version:
npm -v # Should print "11.8.0".
```

Then enter a directory you want to store the local copy of the website in and run:
```bash
git clone git@github.com:Poggio-Lab/Poggio-Lab.github.io.git

cd Poggio-Lab.github.io

npm install

uv pip install -r requirements.txt

```

# Run the website locally

```bash
cd Poggio-Lab.github.io

npm run dev
```

# Make a new blog post:

1. `git pull`
2. Resolve any merge conflicts
3. Write the blog post in `content/blogs/[blog-name]/index.md`
4. Run `uv run gen.py`
5. Move the generated blog.svg to `content/blogs/[blog-name]/blog.svg`
6. `git add .`
7. `git commit -m "Added new blog post [blog-name]"`
8. `git push`

