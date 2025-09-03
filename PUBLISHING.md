# Publishing PDFme Complete to NPM

This guide explains how to publish the `pdfme-complete` package to npm and use it in React projects.

## 📦 Publishing to NPM

### Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **NPM CLI**: Ensure npm is installed and you're logged in
3. **Package Ready**: Ensure the package builds successfully

### Step 1: Prepare for Publishing

```bash
# Navigate to the package directory
cd pdfme-complete

# Ensure all dependencies are installed
npm install

# Build the package
npm run build

# Verify build output
ls -la dist/
# Should show: cjs/, esm/, node/, types/
```

### Step 2: Update Package Information

Edit `package.json` for publishing:

```json
{
  "name": "pdfme-complete",
  "version": "1.0.0",
  "description": "Complete PDF generation, manipulation, and UI library - unified pdfme package",
  "keywords": ["pdf", "generator", "react", "nodejs", "forms", "designer"],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "homepage": "https://github.com/yourusername/pdfme-complete",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/pdfme-complete.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/pdfme-complete/issues"
  }
}
```

### Step 3: Create .npmignore

Create `.npmignore` to exclude unnecessary files:

```
# Source files
src/
examples/
docs/

# Development files
*.md
!README.md
.gitignore
.eslintrc*
.prettierrc*
tsconfig*.json
vite.config.js
rollup.config.js

# Build tools
fix-*.js
PUBLISHING.md

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*

# Dependencies
node_modules/

# Test files
test/
tests/
__tests__/
*.test.js
*.spec.js
```

### Step 4: Login to NPM

```bash
# Login to npm (if not already logged in)
npm login

# Verify login
npm whoami
```

### Step 5: Publish the Package

```bash
# Dry run to see what will be published
npm publish --dry-run

# Publish to npm
npm publish

# For scoped packages (optional)
npm publish --access public
```

### Step 6: Verify Publication

```bash
# Check if package is published
npm view pdfme-complete

# Install from npm to test
npm install pdfme-complete
```

## 🔄 Updating the Package

For future updates:

```bash
# Update version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Build and publish
npm run build
npm publish
```

## 📋 Pre-publish Checklist

- [ ] Package builds successfully (`npm run build`)
- [ ] All tests pass (if any)
- [ ] README.md is complete and accurate
- [ ] package.json has correct metadata
- [ ] .npmignore excludes unnecessary files
- [ ] Version number is updated
- [ ] You're logged into npm
- [ ] Package name is available on npm

## 🚨 Important Notes

1. **Package Name**: Ensure `pdfme-complete` is available on npm, or choose a different name
2. **Version**: Follow semantic versioning (semver)
3. **License**: Ensure you have rights to publish (check original pdfme licenses)
4. **Size**: Keep package size reasonable by excluding unnecessary files
5. **Testing**: Test the published package in a separate project before announcing

## 📊 Package Structure After Publishing

```
pdfme-complete/
├── dist/
│   ├── cjs/           # CommonJS build
│   ├── esm/           # ES Modules build (browser)
│   ├── node/          # Node.js specific build
│   └── types/         # TypeScript definitions
├── package.json       # Package metadata
└── README.md          # Documentation
```

The published package will automatically route imports based on environment:
- **Node.js**: Uses `dist/node/` (CommonJS)
- **React/Browser**: Uses `dist/esm/` (ES Modules with UI components)
- **Legacy**: Uses `dist/cjs/` (CommonJS)
