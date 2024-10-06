const minimist = require('minimist');
const ProductSearch = require('./searchProducts');

async function main() {
  const args = minimist(process.argv.slice(2), {
    string: ['name'],
    boolean: ['pagination'],
    default: { 
      'products': 30, // Default product limit
      'variants': 100, // Default variant limit
      'pagination': true
    },
    alias: { n: 'name', p: 'products', v: 'variants' }
  });

  const productName = args.name;
  const productLimit = parseInt(args.products, 10);
  const variantLimit = parseInt(args.variants, 10);
  const usePagination = args.pagination;

  if (!productName) {
    console.error('Please provide a product name using --name or -n');
    console.error('Optional flags:');
    console.error(`  --products, -p: Set the maximum number of products to fetch (default: ${args.products})`);
    console.error(`  --variants, -v: Set the maximum number of variants per product (default: ${args.variants})`);
    console.error(`  --no-pagination: Fetch --products limit and --variants limit of those products in one non-paginated request`);
    process.exit(1);
  }

  try {
    const productSearch = new ProductSearch();
    const result = await productSearch.searchProducts(productName, { productLimit, variantLimit, usePagination });

    if (result.variants.length === 0) {
      console.log('No products or variants found matching your query.');
      return;
    }

    const uniqueProducts = new Set(result.variants.map(v => v.productTitle)).size;
    console.log(`Found ${uniqueProducts} product(s) with a total of ${result.variants.length} variant(s):`);
    
    result.variants.forEach((item) => {
      console.log(
        `${item.productTitle} - ${item.variantTitle} - price $${item.price}`
      );
    });

    if (result.hasMore) {
      console.log("\nNote: There are more results available. Use --products and/or --variants to increase the limit if needed.");
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
