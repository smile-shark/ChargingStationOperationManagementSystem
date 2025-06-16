import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Navbar() {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  
  const navItems = [
    { path: "/", name: "首页" },
    { path: "/monitor", name: "实时监控" },
    { 
      path: "/station-pile", 
      name: "站桩管理",
      children: [
        { path: "/station-pile/stations", name: "充电站管理" },
        { path: "/station-pile/piles", name: "充电桩管理" }
      ]
    },
{ 
      path: "/operation", 
      name: "运营管理",
      children: [
        { path: "/operation/cards", name: "充电卡管理" },
        { path: "/operation/reservations", name: "预约管理" },
        { path: "/operation/customers", name: "客户管理" },
        { path: "/operation/vehicles", name: "车辆管理" },
        { path: "/operation/fee-rules", name: "计费规则" }
      ]
    },
    { path: "/orders", 
      name: "订单管理",
      children: [
        { path: "/orders/charges", name: "充电记录" },
        { path: "/orders/transactions", name: "交易流水" },
        { path: "/orders/recharges", name: "充值记录" }
      ]
    },

    { 
      path: "/alarm", 
      name: "报警管理",
      children: [
        { path: "/alarm/settings", name: "报警设置" },
        { path: "/alarm/messages", name: "报警消息" }
      ]
    },
    { 
      path: "/maintenance", 
      name: "运维管理",
      children: [
        { path: "/maintenance/tasks", name: "任务管理" },
        { path: "/maintenance/staff", name: "运维人员" }
      ]
    },
    { 
      path: "/reports", 
      name: "分析报表",
      children: [
        { path: "/reports/operation", name: "运营分析" },
        { path: "/reports/fault", name: "故障分析" },
        { path: "/reports/energy", name: "能耗报表" },
        { path: "/reports/financial", name: "财务报表" }
      ]
    },

  ];

  const toggleMenu = (path: string) => {
    setExpandedMenu(expandedMenu === path ? null : path);
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
      (path === '/operation' && location.pathname.startsWith('/operation'));
  };

  return (
    <nav className="bg-white shadow-md fixed left-0 top-0 bottom-0 w-56 z-50 border-r border-gray-200">
      <div className="p-4 h-full flex flex-col">
        <div className="mb-8 px-2 py-4 text-xl font-bold text-gray-800 border-b border-gray-200">
          充电运营系统
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.path}>
              <Link
                to={item.path}
                onClick={(e) => {
                  if (item.children) {
                    e.preventDefault();
                    toggleMenu(item.path);
                  }
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium",
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span>{item.name}</span>
                {item.children && (
                  <i className={`fas fa-chevron-${expandedMenu === item.path ? 'up' : 'down'} text-xs`}></i>
                )}
              </Link>
              {item.children && expandedMenu === item.path && (
                <div className="ml-4 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={cn(
                        "block px-4 py-2 rounded-lg text-sm",
                        location.pathname === child.path
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}