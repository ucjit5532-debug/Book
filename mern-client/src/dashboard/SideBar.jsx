import { NavLink } from "react-router";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiOutlineCloudUpload,
  HiShoppingBag,
  HiSupport,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

import userImg from "../assets/profile.jpg"


const SideBar = () => {
  const menuItems = [
    [HiChartPie, "Dashboard", "/admin/dashboard"],
    [HiOutlineCloudUpload, "Upload Books", "/admin/dashboard/upload"],
    [HiInbox, "Manage Books", "/admin/dashboard/manage"],
    [HiUser, "Users"],
    [HiShoppingBag, "Products"],
    [HiArrowSmRight, "Sign In","/signIn"],
    [HiTable, "Sign Up" , "/siginOut"],
  ];

  return (
    <aside className="min-h-screen w-full shrink-0 bg-gradient-to-b from-blue-100 via-sky-100 to-blue-200 p-4 md:w-64">
      <div className="mb-5 flex items-center gap-3 px-3 py-2">
        <img src={userImg} alt="" className="h-8 w-8 rounded-full object-cover " />
        <span className="text-lg font-semibold text-gray-900">Admin</span>
      </div>

      <nav aria-label="Sidebar navigation">
        <ul className="space-y-1">
          {menuItems.map(([Icon, label, to]) => (
            <li key={label}>
              {to ? (
                <NavLink
                  end={label === "Dashboard"}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 ${
                      isActive
                        ? "bg-blue-200 font-semibold text-gray-900"
                        : "text-gray-700 hover:bg-blue-200"
                    }`
                  }
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  <span>{label}</span>
                </NavLink>
              ) : (
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-200"
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  <span>{label}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
        <ul className="mt-5 space-y-1 border-t border-blue-200 pt-5">
          {[
            [HiChartPie, "Upgrade to Pro"],
            [HiViewBoards, "Documentation"],
            [HiSupport, "Help"],
          ].map(([Icon, label]) => (
            <li key={label}>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-200"
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar;