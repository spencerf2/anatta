const ShopifyClient = require('./shopifyClient');

class ProductSearch {
  constructor() {
    this.client = new ShopifyClient();
  }

  async searchProducts(productName, options = {}) {
    const { productLimit = 30, variantLimit = 100, usePagination = true } = options;
  
    const queryWithPagination = `
      query ($query: String!, $cursor: String, $first: Int!, $variantsFirst: Int!) {
        products(first: $first, after: $cursor, query: $query) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              title
              variants(first: $variantsFirst) {
                edges {
                  node {
                    title
                    price
                  }
                }
              }
            }
          }
        }
      }
    `;

    const queryWithoutPagination = `
      query ($query: String!, $first: Int!, $variantsFirst: Int!) {
        products(first: $first, query: $query) {
          edges {
            node {
              title
              variants(first: $variantsFirst) {
                edges {
                  node {
                    title
                    price
                  }
                }
              }
            }
          }
        }
      }
    `;
  
    let allVariants = [];
    let hasNextPage = true;
    let cursor = null;
    let pageCount = 0;
  
    const effectiveProductLimit = Math.min(productLimit, 250);  // Shopify's max is 250
    const effectiveVariantLimit = Math.min(variantLimit, 100);  // Shopify's max is 100
  
    // Decide which query to use based on the `usePagination` flag
    const query = usePagination ? queryWithPagination : queryWithoutPagination;
  
    while (hasNextPage && (usePagination || pageCount === 0)) {
      pageCount++;
      console.log(`Fetching page ${pageCount}: productsPerPage=${effectiveProductLimit}, variantsPerProduct=${effectiveVariantLimit}`);

      // Build the variables
      const variables = usePagination
        ? {
            query: productName,
            cursor: cursor,
            first: effectiveProductLimit,
            variantsFirst: effectiveVariantLimit
          }
        : {
            query: productName,
            first: effectiveProductLimit,
            variantsFirst: effectiveVariantLimit
          };

      // Execute query
      const data = await this.client.fetchGraphQL(query, variables);
      const productsData = data.products;
  
      productsData.edges.forEach((productEdge) => {
        const product = productEdge.node;
        product.variants.edges.forEach((variantEdge) => {
          allVariants.push({
            productTitle: product.title,
            variantTitle: variantEdge.node.title,
            price: parseFloat(variantEdge.node.price),
          });
        });
      });
  
      if (usePagination) {
        hasNextPage = productsData.pageInfo.hasNextPage;
        cursor = productsData.pageInfo.endCursor;
        console.log(`Page ${pageCount} fetched: hasNextPage=${hasNextPage}`);
      } else {
        hasNextPage = false;  // No pagination, so stop after the first request
      }
    }
  
    return {
      variants: this.sortVariants(allVariants),
      hasMore: hasNextPage,
      pagesFetched: pageCount
    };
  }

  sortVariants(variants) {
    return variants.sort((a, b) => {
      if (a.price !== b.price) {
        return a.price - b.price;
      } else {
        const productComparison = a.productTitle.localeCompare(b.productTitle);
        if (productComparison !== 0) {
          return productComparison;
        } else {
          return a.variantTitle.localeCompare(b.variantTitle);
        }
      }
    });
  }
}

module.exports = ProductSearch;
