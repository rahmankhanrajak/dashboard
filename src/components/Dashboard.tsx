import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../store/authApi';
import { logout as logoutAction } from '../store/authSlice';
import type { RootState } from '../store/store';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const capitalizeFirst = (value?: string) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : 'User';

  const getInitials = (name?: string, email?: string) =>
    (name || email || 'U').charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-slate-800 text-white shadow-lg">
        <div className="px-6 py-6 text-2xl font-semibold">MyApp</div>

        <nav className="space-y-1">
          <a className="flex items-center gap-3 bg-slate-700 px-6 py-3 border-l-4 border-blue-500">
            🏠 Dashboard
          </a>
          <a className="flex items-center gap-3 px-6 py-3 hover:bg-slate-700 transition">
            📊 Analytics
          </a>
          <a className="flex items-center gap-3 px-6 py-3 hover:bg-slate-700 transition">
            ⚙️ Settings
          </a>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between bg-white px-8 py-4 shadow">
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 rounded-full  px-4 py-2 hover:shadow transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                {getInitials(user?.name, user?.email)}
              </div>

              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium text-slate-800">
                  {capitalizeFirst(user?.name)}
                </div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>

            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg z-50">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {capitalizeFirst(user?.name)}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-gray-100 disabled:opacity-60"
                >
                  🚪 {isLoading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="rounded-lg bg-white p-8 shadow">
            <h2 className="text-xl font-semibold text-slate-800">
              Welcome back, {capitalizeFirst(user?.name || user?.email)}!
            </h2>
            <p className="mt-2 text-gray-600">
              This is your dashboard. You can manage your account and view your
              data here.
            </p>
          </div>
        </main>
      </div>

      {showProfileMenu && (
        <div
          onClick={() => setShowProfileMenu(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </div>
  );
}

export default Dashboard;
