import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../store/authApi';

const OrderDetails = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrderByIdQuery(Number(id));

  if (isLoading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>

      <p>Status: {order.status}</p>
      <p>Total: ₹{order.total}</p>

      <h3 className="mt-4 font-semibold">Items</h3>
      <ul>
        {order.items.map(item => (
          <li key={item.id}>
            {item.title} × {item.qty} — ₹{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;
