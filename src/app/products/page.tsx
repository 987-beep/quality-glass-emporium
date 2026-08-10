import Link from 'next/link';
import { StoreService } from '@/lib/services/store-service';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search, sort } = searchParams;
  const categories = await StoreService.getCategories();
  const products = await StoreService.getProducts({
    categorySlug: category,
    search,
    sort
  });

  const activeCategory = categories.find(c => c.slug === category);

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 space-y-8">
      {/* Catalog Title */}
      <div>
        <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-primary dark:text-primary-fixed">
          {activeCategory ? activeCategory.name : 'Collections Catalog'}
        </h1>
        <p className="font-body-lg text-sm md:text-base text-on-surface-variant mt-2">
          {activeCategory
            ? activeCategory.description
            : 'Browse our complete range of handcrafted picture frames, museum glass, acrylic sheets, and custom framing options.'}
        </p>
      </div>

      {/* Category Filter Chips & Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/30 pb-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-full font-caption text-xs transition-all ${
              !category
                ? 'bg-secondary text-white font-bold shadow-sm'
                : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant'
            }`}
          >
            All Products ({products.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}${sort ? `&sort=${sort}` : ''}`}
              className={`px-4 py-2 rounded-full font-caption text-xs transition-all ${
                category === cat.slug
                  ? 'bg-secondary text-white font-bold shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-label-md text-on-surface-variant">
          <span>Sort By:</span>
          <form method="GET" action="/products" className="inline-block">
            {category && <input type="hidden" name="category" value={category} />}
            {search && <input type="hidden" name="search" value={search} />}
            <select
              name="sort"
              defaultValue={sort || 'featured'}
              className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 outline-none focus:border-secondary text-on-surface cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </form>
        </div>
      </div>

      {/* Search Result Feedback */}
      {search && (
        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 text-sm text-on-surface flex justify-between items-center">
          <span>
            Showing search results for &ldquo;<strong>{search}</strong>&rdquo;
          </span>
          <Link href="/products" className="text-secondary font-bold hover:underline text-xs">
            Clear Search
          </Link>
        </div>
      )}

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter-desktop">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4 bg-surface-container-low rounded-2xl border border-outline-variant/20">
          <p className="font-headline-md text-lg text-on-surface-variant">No products found matching your search criteria.</p>
          <Link
            href="/products"
            className="inline-block bg-secondary text-white px-6 py-2.5 rounded-lg font-label-md text-sm hover:bg-secondary/90"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
}
