# Overview

1. `app.js`: The main entry point of the application. It parses command-line arguments and orchestrates the product search process.
2. `searchProducts.js`: Contains the `ProductSearch` class, which handles the logic for searching products using the Shopify Admin GraphQL.
3. `shopifyClient.js`: Provides a reusable Shopify API client for making authenticated requests to the Shopify Admin GraphQL API.

# Setup

### Create environment.
```bash
# Make new directory
mkdir anatta
# Change to the new directory
cd anatta
# Create environment dotfile
touch .env
```

### Add the following to .env and replace with your values:
```bash
SHOP_DOMAIN='your-store.myshopify.com'
ADMIN_TOKEN='yourAdminToken'
```

### Install dependencies:
```bash
# Installs axios, minimist, and dotenv
npm install
```

### Search for products using the title
```bash
# Change to the app's directory
cd SearchApp

# Defaults
#  - pagination: true
#  - product limit: 30
#  - variant limit: 100

node app.js --name shirt

# No pagination
node app.js -n a --no-pagination

# Example limiting number of products and variants fetched per page
node app.js --name "a" --products 1 --variants 1

# Example limiting number of products and variants fetched and only making 1 request
node app.js --n "a" -p 1 -v 1 --no-pagination
```