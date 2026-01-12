import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  usePayOrderMutation,
} from '../store/authApi';

interface ProductImageMap {
  [key: number]: string;
}

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = Number(id);

  const { data: order, isLoading, refetch } = useGetOrderByIdQuery(orderId);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();

  const [imageMap, setImageMap] = useState<ProductImageMap>({});

  useEffect(() => {
    const loadImages = async () => {
      const res = await fetch('https://dummyjson.com/products?limit=100');
      const data = await res.json();

      const map: ProductImageMap = {};
      data.products.forEach((p: any) => {
        map[p.id] = p.thumbnail;
      });
      setImageMap(map);
    };
    loadImages();
  }, []);

  if (isLoading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found</p>;

  const canCancel = order.status === 'PENDING' || order.status === 'PAID';
  const canPay = order.status === 'PENDING';

  const handleCancel = async () => {
    if (!confirm("Cancel this order?")) return;
    await cancelOrder(orderId).unwrap();
    refetch();
  };

  const handlePay = async () => {
    if (!confirm("Proceed to payment?")) return;
    await payOrder(orderId).unwrap();
    refetch();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/orders')}
        className="mb-4 text-indigo-600 hover:underline"
      >
        ← Back to Orders
      </button>

      <h2 className="text-2xl font-bold mb-2">Order #{order.id}</h2>
      <p>Status: <b>{order.status}</b></p>
      <p className="mb-4">Total: ₹{order.total}</p>

      <h3 className="font-semibold mb-2">Items</h3>

      <div className="space-y-3">
        {order.items.map(item => (
          <div key={item.id} className="flex items-center gap-4 border-b pb-2">
            {imageMap[item.productId] && (
              <img
                src={imageMap[item.productId]}
                className="w-14 h-14 object-cover rounded"
                alt={item.title}
              />
            )}
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">
                ₹{item.price} × {item.qty}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        {canPay && (
          <button
            onClick={handlePay}
            disabled={isPaying}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {isPaying ? "Processing..." : "Pay Now"}
          </button>
        )}

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>

      {order.status === 'PAID' && (
        <p className="mt-4 text-green-600 font-semibold">Payment Successful</p>
      )}
      {order.status === 'CANCELLED' && (
        <p className="mt-4 text-red-600 font-semibold">Order Cancelled</p>
      )}
    </div>
  );
};

export default OrderDetails;
