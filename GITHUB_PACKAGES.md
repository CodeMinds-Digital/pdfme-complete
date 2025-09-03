# Publishing to GitHub Packages

This guide explains how to publish the `@codeminds-digital/pdfme-complete` package to GitHub Packages.

## 📦 Package Configuration

The package has been configured for GitHub Packages with:
- **Scoped name**: `@codeminds-digital/pdfme-complete`
- **Registry**: `https://npm.pkg.github.com`
- **Repository**: `https://github.com/CodeMinds-Digital/pdfme-complete.git`

## 🚀 Automated Publishing (Recommended)

### Via GitHub Releases
1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Create a new tag (e.g., `v1.0.0`)
4. Fill in release title and description
5. Click "Publish release"
6. The GitHub Action will automatically build and publish the package

### Via Manual Workflow Dispatch
1. Go to "Actions" tab in your GitHub repository
2. Select "Publish to GitHub Packages" workflow
3. Click "Run workflow"
4. Optionally specify a version number
5. Click "Run workflow" button

## 🔧 Manual Publishing

### Prerequisites
1. **GitHub Personal Access Token** with `write:packages` permission
2. **npm CLI** installed and configured

### Setup Authentication
```bash
# Create a personal access token at: https://github.com/settings/tokens
# Select scopes: write:packages, read:packages, repo

# Login to GitHub Packages
npm login --scope=@codeminds-digital --registry=https://npm.pkg.github.com

# When prompted:
# Username: your-github-username
# Password: your-personal-access-token
# Email: your-email@example.com
```

### Build and Publish
```bash
# Install dependencies
npm install

# Build the package
npm run build

# Verify build output
ls -la dist/
# Should show: cjs/, esm/, node/, types/

# Test what will be published
npm publish --dry-run

# Publish to GitHub Packages
npm publish
```

## 📋 Installation Instructions

### For Users Installing Your Package

#### Option 1: Using .npmrc (Recommended)
Create `.npmrc` in your project root:
```
@codeminds-digital:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:
```bash
npm install @codeminds-digital/pdfme-complete
```

#### Option 2: Direct Registry Specification
```bash
npm install @codeminds-digital/pdfme-complete --registry=https://npm.pkg.github.com
```

#### Option 3: Using npm config
```bash
npm config set @codeminds-digital:registry https://npm.pkg.github.com
npm install @codeminds-digital/pdfme-complete
```

## 🔍 Verification

### Check Package Publication
```bash
# View package info
npm view @codeminds-digital/pdfme-complete --registry=https://npm.pkg.github.com

# List all versions
npm view @codeminds-digital/pdfme-complete versions --json --registry=https://npm.pkg.github.com
```

### Test Installation
```bash
# Create test directory
mkdir test-install && cd test-install

# Initialize package.json
npm init -y

# Create .npmrc
echo "@codeminds-digital:registry=https://npm.pkg.github.com" > .npmrc

# Install your package
npm install @codeminds-digital/pdfme-complete
```

## 🔄 Updating Versions

### Semantic Versioning (Recommended)
```bash
# Patch version (0.0.1 -> 0.0.2) - Bug fixes
npm run version:patch

# Minor version (0.0.1 -> 0.1.0) - New features
npm run version:minor

# Major version (0.0.1 -> 1.0.0) - Breaking changes
npm run version:major

# Then build and publish
npm run build
npm publish
```

### Manual Version Update
Edit `package.json` and update the version field following semantic versioning:
- **0.0.x** - Initial development
- **0.x.0** - Pre-release versions
- **x.0.0** - Stable releases

```bash
npm run build
npm publish
```

## 🚨 Troubleshooting

### Common Issues

#### Authentication Error
```
npm ERR! 401 Unauthorized
```
**Solution**: Verify your GitHub token has `write:packages` permission and is correctly configured.

#### Package Already Exists
```
npm ERR! 403 Forbidden
```
**Solution**: Update the version number in `package.json` before publishing.

#### Build Errors
**Solution**: Ensure all dependencies are installed and the build completes successfully:
```bash
npm install
npm run build
```

### Getting Help
- Check the [GitHub Packages documentation](https://docs.github.com/en/packages)
- Verify your token permissions at: https://github.com/settings/tokens
- Check the Actions tab for workflow logs

## 📝 Notes

- GitHub Packages requires authentication even for public packages
- Users need a GitHub token with `read:packages` permission to install
- The package is automatically linked to your GitHub repository
- Package visibility follows your repository visibility settings
