const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

class ShopifyClient {
  constructor() {
    this.shopDomain = process.env.SHOP_DOMAIN;
    this.adminToken = process.env.ADMIN_TOKEN;
    this.apiVersion = process.env.API_VERSION || '2024-10'; // Default to current
  }

async fetchGraphQL(query, variables) {
    try {
      const response = await axios.post(
        `https://${this.shopDomain}/admin/api/${this.apiVersion}/graphql.json`,
        {
          query,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': this.adminToken,
          },
        }
      );

      if (response.data.errors) {
        console.error('GraphQL Errors:', response.data.errors);
        throw new Error('GraphQL query failed');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }
}

module.exports = ShopifyClient;