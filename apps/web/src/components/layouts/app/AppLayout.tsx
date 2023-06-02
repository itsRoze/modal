import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { classNames } from "@modal/common";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

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
      className={cn({
        "z-20 bg-indigo-700 text-zinc-50": true,
        "transition-all duration-300 ease-in-out": true,
        "fixed lg:static lg:translate-x-0": true,
        "w-screen lg:w-[300px]": !collapsed,
        "lg:w-16": collapsed,
        "-translate-x-full": !shown,
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
              "hover:bg-indigo-800 ": true, // colors
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
          <ul className="my-2 flex flex-col items-stretch gap-2">
            <li
              key={1}
              className={cn({
                "flex text-indigo-100 hover:bg-indigo-900": true,
                "transition-colors duration-300": true,
                "mx-3 gap-4 rounded-md p-2": !collapsed,
                "mx-3 h-10 w-10 rounded-full p-2": collapsed,
              })}
            >
              <Link href="#" className="flex gap-2">
                Link 1
              </Link>
            </li>
            <li
              key={2}
              className={cn({
                "flex text-indigo-100 hover:bg-indigo-900": true,
                "transition-colors duration-300": true,
                "mx-3 gap-4 rounded-md p-2": !collapsed,
                "mx-3 h-10 w-10 rounded-full p-2": collapsed,
              })}
            >
              <Link href="#" className="flex gap-2">
                Link 2
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
