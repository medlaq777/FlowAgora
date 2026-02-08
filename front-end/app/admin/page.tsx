export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Events</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
           <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Reservations</h3>
           <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">--</p>
        </div>
        {/* Add more stats */}
      </div>
      
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">Welcome Admin</h2>
        <p className="text-blue-600 dark:text-blue-300">
          Select an option from the sidebar to manage events and reservations.
        </p>
      </div>
    </div>
  );
}
