import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { classNames } from "@modal/common";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  { name: "Login", href: "/login" },
];

const SiteNavigation = () => {
  const router = useRouter();
  const pathname = router.pathname;

  const [openMenu, setMenu] = useState(false);

  return (
    <nav className="mx-auto w-full md:h-36 md:px-12 md:py-2 2xl:px-32">
      <div className="flex h-16 items-center justify-start">
        {/* Full Menu*/}
        <div className="hidden w-full md:block">
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link href="/">
                <Image
                  src="/images/Logo.png"
                  alt="Modal Logo"
                  width={1025}
                  height={237}
                  className="h-auto w-36 2xl:w-44"
                />
              </Link>
            </motion.div>
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target={link.name === "Resume" ? "_blank" : "_self"}
                  className={classNames(
                    "cursor-pointer p-1 text-base font-light text-gray-600 md:text-lg 2xl:text-2xl",
                    pathname === link.href
                      ? "underline underline-offset-4"
                      : "hover:underline hover:underline-offset-4",
                  )}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="bg-logo hover:bg-logo shadow-md hover:opacity-75 md:text-lg 2xl:text-2xl">
                Get Started
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between md:hidden">
          {/* Mobile Menu Button*/}
          <button onClick={() => setMenu((open) => !open)} className="mr-2">
            {openMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/">
            <Image
              src="/images/Logo.png"
              alt="Modal Logo"
              width={1025}
              height={237}
              className="h-auto w-28"
            />
          </Link>
        </div>
      </div>
      {/* Mobile Menu*/}
      {openMenu && <MobileMenu pathname={pathname} />}
    </nav>
  );
};

const MobileMenu = ({ pathname }: { pathname: string }) => {
  return (
    <div className="mb-4 border-b-2 border-b-stone-600 md:hidden">
      <ul className="space-y-1 pb-3 pt-2">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={classNames(
                "block px-3 py-2 text-base font-light text-gray-600 md:text-2xl",
                pathname === link.href ? "underline underline-offset-4" : "",
              )}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <Button
          size={"sm"}
          className="bg-logo hover:bg-logo mx-3 shadow-md hover:opacity-75"
        >
          Get Started
        </Button>
      </ul>
    </div>
  );
};

export default SiteNavigation;
