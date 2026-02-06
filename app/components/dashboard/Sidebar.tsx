"use client";

import { LucideIcon, User, ShoppingBag, MapPin, Heart, Clock } from "lucide-react";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: any) => void;
};

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  { id: "overview", label: "Dashboard", icon: ShoppingBag },
  { id: "orders", label: "My Orders", icon: Clock },
  { id: "profile", label: "Profile Settings", icon: User },
  { id: "address", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
];

export default function DashboardSidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-24">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? "bg-black text-white shadow-lg shadow-black/10"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:scale-110 transition-transform"}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
