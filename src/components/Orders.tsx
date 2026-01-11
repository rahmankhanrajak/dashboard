import { useGetOrdersQuery } from '../store/authApi';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { data: orders, isLoading } = useGetOrdersQuery();

  if (isLoading) return <p>Loading orders...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders?.map(order => (
            <tr key={order.id} className="border-t">
              <td>{order.id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.status}</td>
              <td>₹{order.total}</td>
              <td>
                <Link to={`/orders/${order.id}`} className="text-blue-600">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
