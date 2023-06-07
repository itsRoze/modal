import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { classNames } from "@modal/common";
import { BookOpenCheck, ChevronsLeft, ChevronsRight, Home } from "lucide-react";

import styles from "./AppLayout.module.css";
import Header from "./Header";

export interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FC<IAppLayout> = ({ children }) => {
  const [collapsed, setSidebarCollapsed] = useState(false);
  const [showMobileMenu, setMobileMenu] = useState(true);
  return (
    <>
      <Header
        onMenuButtonClick={() => {
          setMobileMenu((prev) => {
            setSidebarCollapsed(prev);
            return !prev;
          });
        }}
      />
      <main
        className={classNames(
          styles.main ?? "",
          collapsed
            ? "lg:grid-cols-sidebar-collapsed grid-cols-sidebar-mobile-collapsed"
            : "grid-cols-sidebar",
          "transition-[grid-template-columns] duration-300 ease-in-out",
        )}
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setSidebarCollapsed}
          shown={showMobileMenu}
        />
        {children}
      </main>
    </>
  );
};

export default AppLayout;

interface ISidebar {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  shown: boolean;
}

const Sidebar: React.FC<ISidebar> = ({ collapsed, setCollapsed, shown }) => {
  const Icon = collapsed ? ChevronsRight : ChevronsLeft;

  return (
    <div
      id="sidebar"
      className={cn({
        "pb-4": true,
        "h-full": true,
        "fixed lg:static lg:translate-x-0": true,
        "transition-all duration-300 ease-in-out": true,
        "-translate-x-full": !shown,
        "w-screen lg:w-[300px]": !collapsed,
        "lg:w-16": collapsed,
      })}
    >
      <div
        id="sidebar-container"
        className={cn({
          "z-20 rounded-r-3xl border-r border-gray-100 bg-gray-50 shadow-[2px_1px_8px_rgba(0,0,0,0.25)]":
            true,
          "h-full": true,
        })}
      >
        <div className="flex h-full flex-col justify-between">
          {/* Button */}
          <div
            className={cn({
              "hidden items-center lg:flex ": true,
              "justify-between p-4": !collapsed,
              "justify-center py-4": collapsed,
            })}
          >
            {!collapsed && <span className="whitespace-nowrap"></span>}
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className={cn({
                "grid place-content-center": true, // position
                "hover:bg-gray-200": true, // colors
                "h-10 w-10 rounded-full": true, // shape
              })}
            >
              <Icon size={24} />
            </button>
          </div>
          {/* Menu */}
          <nav
            className={cn({
              "flex-grow": true,
              "opacity-0": collapsed,
              "transition-opacity delay-0 duration-0": true,
              "opacity-100": !collapsed,
            })}
          >
            {/* Search bar */}
            <div className="flex justify-center">
              <Input
                type="text"
                className="w-64 max-w-full border-gray-300 bg-white shadow-sm"
                placeholder="🔎 Search"
              />
            </div>
            <ul className="my-2 flex flex-col items-stretch gap-2">
              <li
                key={1}
                className={cn({
                  "flex hover:bg-slate-200": true,
                  "transition-colors duration-300": true,
                  "mx-3 gap-4 rounded-md p-2": !collapsed,
                  "mx-3 h-10 w-10 rounded-full p-2": collapsed,
                })}
              >
                <Link href="/app" className="flex w-full items-center gap-2">
                  <Home size={24} className="text-fuchsia-600" />
                  Dashboard
                </Link>
              </li>
              <li
                key={2}
                className={cn({
                  "flex hover:bg-slate-200": true,
                  "transition-colors duration-300": true,
                  "mx-3 gap-4 rounded-md p-2": !collapsed,
                  "mx-3 h-10 w-10 rounded-full p-2": collapsed,
                })}
              >
                <Link href="/app/history" className="flex w-full gap-2">
                  <BookOpenCheck size={24} className="text-green-600" />
                  History
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};
