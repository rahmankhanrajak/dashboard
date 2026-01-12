import { useGetOrdersQuery } from '../store/authApi';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();

  const { data: orders, isLoading } = useGetOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  if (isLoading) return <div className="text-center mt-10">Loading orders...</div>;

  const statusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'PAID':
        return 'bg-blue-100 text-blue-700';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-700';
      case 'DELIVERED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 text-indigo-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Order ID</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Total</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(order => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">#{order.id}</td>
                <td className="p-4 text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4 font-semibold">₹{order.total}</td>
                <td className="p-4 text-right">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    View Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            You have not placed any orders yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
