import { Outlet } from "@remix-run/react";

export default function Layout() {
  return (
    <>
      <main className="flex h-full w-full flex-col items-center justify-center">
        <Outlet />
      </main>
    </>
  );
}
