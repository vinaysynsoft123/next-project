import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { 
      label: "Total Revenue", 
      value: "$45,231.89", 
      change: "+20.1%", 
      isPositive: true, 
      icon: TrendingUp,
      color: "blue" 
    },
    { 
      label: "Subscriptions", 
      value: "+2350", 
      change: "+180.1%", 
      isPositive: true, 
      icon: Users,
      color: "green" 
    },
    { 
      label: "Sales", 
      value: "+12,234", 
      change: "+19%", 
      isPositive: true, 
      icon: ShoppingCart,
      color: "purple" 
    },
    { 
      label: "Active Now", 
      value: "+573", 
      change: "+201 since last hour", 
      isPositive: true, 
      icon: Package,
      color: "orange" 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back to your administration panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity / Tables can go here */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-gray-500 text-sm">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 font-medium text-sm">#ORD-00{i}</td>
                    <td className="py-4 text-sm">Customer {i}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                        Paid
                      </span>
                    </td>
                    <td className="py-4 text-sm text-right font-bold text-gray-900">$120.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Products</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Package size={20} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Product Name {i}</p>
                  <p className="text-xs text-gray-500">234 sales this month</p>
                </div>
                <p className="text-sm font-bold text-blue-600">$45.00</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
