import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingCart,
  LogOut,
  Star,
  Loader2,
  AlertCircle,
  Plus,
  Minus,
  Search
} from 'lucide-react';

import {
  useLogoutMutation,
  useCreateOrderMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartQtyMutation,
  useRemoveFromCartMutation
} from '../store/authApi';

import { logout as logoutAction } from '../store/authSlice';
import type { RootState } from '../store/store';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
}

interface ProductsApiResponse {
  products: Product[];
}

type ViewType = 'products' | 'cart';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [logout, { isLoading }] = useLogoutMutation();
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();

  const { data: cartData, refetch: refetchCart } = useGetCartQuery();
  const [addToCartApi] = useAddToCartMutation();
  const [updateQtyApi] = useUpdateCartQtyMutation();
  const [removeFromCartApi] = useRemoveFromCartMutation();

  const cart = cartData?.items || [];

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [view, setView] = useState<ViewType>('products');

  const handlePurchase = async () => {
    try {
      await createOrder().unwrap();
      alert("Order placed done");
      refetchCart();
    } catch {
      alert("Order failed");
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products?limit=100');
        const data: ProductsApiResponse = await res.json();
        setProducts(data.products);
      } catch {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map(p => p.category))],
    [products]
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const filteredProducts = useMemo(() => {
    let data = products
      .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter(p =>
        selectedCategories.length === 0
          ? true
          : selectedCategories.includes(p.category)
      );

    switch (sortBy) {
      case 'price-low':
        return [...data].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...data].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...data].sort((a, b) => b.rating - a.rating);
      default:
        return data;
    }
  }, [products, search, selectedCategories, sortBy]);

  const addToCart = async (product: Product) => {
    await addToCartApi({
      productId: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      rating: product.rating,
      qty: 1,
    });
    refetchCart();
  };

  const increaseQty = async (productId: number, qty: number) => {
    await updateQtyApi({ productId, qty: qty + 1 });
    refetchCart();
  };

  const decreaseQty = async (productId: number, qty: number) => {
    if (qty === 1) {
      await removeFromCartApi(productId);
    } else {
      await updateQtyApi({ productId, qty: qty - 1 });
    }
    refetchCart();
  };

  const total = useMemo(
    () => cart.reduce((sum: number, item: any) => sum + item.price * item.qty, 0),
    [cart]
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600">
        <AlertCircle className="mr-2" /> {error}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="h-16 bg-white shadow flex items-center justify-between px-6">
        <div className="font-bold text-lg">E-Commerce</div>

        <div className="flex items-center gap-3 flex-1 max-w-lg mx-6">
          <Search size={18} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 p-2 border rounded"
          />
        </div>

        <div className="flex items-center gap-6">
          <div onClick={() => setView('cart')} className="relative cursor-pointer">
            <ShoppingCart />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </div>

          <span className="text-sm text-gray-600">{user?.name}</span>

          <button
            onClick={() => navigate('/orders')}
            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
          >
            My Orders
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            <LogOut size={16} className="inline mr-1" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-slate-900 text-white p-4 overflow-y-auto">
          <p className="text-sm text-gray-400 mb-2">Categories</p>
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2 text-sm mb-1">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span className="capitalize">{cat}</span>
            </label>
          ))}
          <p className="text-sm text-gray-400 mt-6 mb-2">Sort By</p>

<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value as 'default' | 'price-low' | 'price-high' | 'rating')}
  className="w-full p-2 rounded bg-slate-800"
>
  <option value="default">Default</option>
  <option value="price-low">Price ↑</option>
  <option value="price-high">Price ↓</option>
  <option value="rating">Rating</option>
</select>

        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {view === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-white rounded shadow p-4 flex flex-col">
                  <img src={p.thumbnail} className="h-40 w-full object-cover rounded mb-2" />
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{p.category}</p>
                  <p className="font-bold mt-auto">₹{p.price}</p>

                  <button
                    onClick={() => addToCart(p)}
                    className="mt-3 w-full bg-indigo-600 text-white py-2 rounded"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}

          

          {view === 'cart' && (
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
              <button
  onClick={() => setView('products')}
  className="mb-4 text-indigo-600 hover:underline flex items-center gap-1"
>
  ← Back to Products
</button>

              <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
{cart.map(item => {
  const productImage = products.find(p => p.id === item.productId)?.thumbnail;

  return (
    <div key={item.productId} className="flex items-center justify-between py-3 border-b">
      <div className="flex items-center gap-3">
        {productImage && (
          <img
            src={productImage}
            alt={item.title}
            className="w-14 h-14 object-cover rounded"
          />
        )}

        <div>
          <p className="font-semibold">{item.title}</p>
          <p className="text-sm text-gray-500">₹{item.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => decreaseQty(item.productId, item.qty)}>
          <Minus size={16} />
        </button>
        <span>{item.qty}</span>
        <button onClick={() => increaseQty(item.productId, item.qty)}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
})}

              <div className="mt-4 font-bold text-right">Total: ₹{total}</div>

              <button
                onClick={handlePurchase}
                disabled={isOrderLoading}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded"
              >
                {isOrderLoading ? "Placing Order..." : "Purchase"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductCatalog;
