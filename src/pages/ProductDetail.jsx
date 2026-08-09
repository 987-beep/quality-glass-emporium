import React, { useState, useEffect } from 'react';
import { apiFetch, getAssetUrl } from '../api';

export function ProductDetail({ product, onAddToCart, onOpenFrameStudio, setActivePage }) {
  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      apiFetch(`/api/reviews/${product.id}`)
        .then(res => res.json())
        .then(data => setReviews(data))
        .catch(() => {});
    }
  }, [product]);

  if (!product) return null;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    apiFetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        customerName: newReview.name || 'Verified Buyer',
        rating: newReview.rating,
        comment: newReview.comment
      })
    })
      .then(res => res.json())
      .then(added => {
        setReviews([added, ...reviews]);
        setNewReview({ name: '', rating: 5, comment: '' });
        setReviewSubmitted(true);
      })
      .catch(() => {});
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      quantity,
      selectedSize
    });
  };

  return (
    <div className="bg-background text-on-background py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-on-surface-variant mb-6">
        <button onClick={() => setActivePage('home')} className="hover:text-primary">Home</button>
        <span>/</span>
        <button onClick={() => setActivePage('collection')} className="hover:text-primary">Catalog</button>
        <span>/</span>
        <span className="text-on-surface line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 overflow-hidden rounded border border-outline-variant bg-surface-container-high relative">
            <img
              src={getAssetUrl(selectedImage)}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded overflow-hidden border transition-all ${
                    selectedImage === imgUrl ? 'border-primary ring-2 ring-primary/40' : 'border-outline-variant opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getAssetUrl(imgUrl)}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Specifications & Purchasing Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-label-bold uppercase text-primary tracking-widest">
              {product.categoryId.replace('-', ' ')}
            </span>
            <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface mt-1">
              {product.name}
            </h1>

            <div className="flex items-center space-x-3 mt-2 text-xs">
              <div className="flex items-center text-amber-400">
                <span className="material-symbols-outlined text-sm font-fill">star</span>
                <span className="font-semibold text-on-surface ml-1">{product.rating}</span>
              </div>
              <span className="text-on-surface-variant">• {product.reviewsCount} Customer Reviews</span>
              <span className="text-emerald-400 font-semibold">• Stock: {product.stock} units available</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 py-3 border-y border-outline-variant/60">
            <span className="font-headline font-bold text-3xl text-primary">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-on-surface-variant/60 line-through">₹{product.originalPrice}</span>
            )}
            <span className="text-xs text-primary font-semibold">Inclusive of all GST taxes</span>
          </div>

          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="text-xs uppercase font-label-bold text-on-surface block mb-2">Select Dimension / Format</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-2 rounded text-xs border transition-all ${
                      selectedSize === sz ? 'bg-primary text-on-primary font-bold border-primary' : 'bg-surface-container-high text-on-surface border-outline-variant hover:border-primary/60'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Adjuster */}
          <div className="flex items-center space-x-4">
            <label className="text-xs uppercase font-label-bold text-on-surface">Quantity:</label>
            <div className="flex items-center border border-outline-variant bg-surface-container-high rounded text-xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-on-surface hover:text-primary"
              >
                -
              </button>
              <span className="px-3 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1.5 text-on-surface hover:text-primary"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-4">
            {product.isFrame ? (
              <button
                onClick={() => onOpenFrameStudio(product)}
                className="bg-primary text-on-primary font-headline font-bold text-xs uppercase px-8 py-4 rounded hover:bg-primary-fixed transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-base">palette</span>
                <span>Customize in Frame Studio</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-primary text-on-primary font-headline font-bold text-xs uppercase px-8 py-4 rounded hover:bg-primary-fixed transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-base">shopping_cart</span>
                <span>Add to Cart (₹{product.price * quantity})</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Customer Reviews & Moderated Feedback */}
      <div className="mt-16 pt-10 border-t border-outline-variant">
        <h2 className="font-headline font-bold text-xl text-on-surface mb-6">Customer Reviews & Ratings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-on-surface-variant italic">No reviews yet for this product. Be the first to share your feedback!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-surface-container-low border border-outline-variant p-4 rounded text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-on-surface">{rev.customerName}</span>
                    <span className="text-[10px] text-on-surface-variant">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-xs font-fill">star</span>
                    ))}
                  </div>
                  <p className="text-on-surface-variant leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Submit Review Form */}
          <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant p-6 rounded text-xs space-y-4">
            <h3 className="font-headline font-bold text-sm text-primary uppercase">Write a Customer Review</h3>
            
            {reviewSubmitted && (
              <div className="bg-primary/10 border border-primary text-primary p-3 rounded">
                Thank you! Your review has been submitted successfully.
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-on-surface mb-1 font-semibold">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priyesh Sharma"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface mb-1 font-semibold">Rating (1 to 5 Stars)</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Great Quality)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Below Expectation)</option>
                  <option value={1}>⭐ (1 - Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface mb-1 font-semibold">Review Comment</label>
                <textarea
                  rows={3}
                  placeholder="Describe frame finish, glass quality, or print sharpness..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-surface-container-high border border-outline-variant text-on-surface p-2 rounded focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-headline font-bold uppercase py-2.5 rounded hover:bg-primary-fixed transition-all"
              >
                Submit Review
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  );
}
