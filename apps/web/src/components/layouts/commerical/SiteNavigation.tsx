import { motion } from "framer-motion";
import { classNames } from "@modal/common";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
    <nav className="w-full mx-auto">
      <div className="flex h-16 items-center justify-start">
        {/* Full Menu*/}
        <div className="w-full hidden md:block">
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link href="/">
                <Image
                  src="/images/Logo.png"
                  alt="Modal Logo"
                  width={1025}
                  height={237}
                  className="w-36 h-auto"
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
                    "cursor-pointer p-1 text-base font-light text-gray-600 md:text-lg",
                    pathname === link.href
                      ? "underline underline-offset-4"
                      : "hover:underline hover:underline-offset-4"
                  )}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="bg-logo shadow-md hover:opacity-75 hover:bg-logo">
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
          <div className="w-28 h-auto">
            <Image
              src="/images/Logo.png"
              alt="Modal logo"
              width={1025}
              height={237}
            />
          </div>
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
      <ul className="space-y-1 pt-2 pb-3">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={classNames(
                "block px-3 py-2 text-base font-light text-gray-600 md:text-2xl",
                pathname === link.href ? "underline underline-offset-4" : ""
              )}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.name}
            </Link>
          </li>
        ))}
        <Button
          size={"sm"}
          className="mx-3 bg-logo shadow-md hover:opacity-75 hover:bg-logo"
        >
          Get Started
        </Button>
      </ul>
    </div>
  );
};

export default SiteNavigation;
