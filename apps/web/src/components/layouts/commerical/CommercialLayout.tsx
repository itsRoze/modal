import Head from "next/head";
import Link from "next/link";
import { inter } from "@/utils/fonts";
import { Info } from "lucide-react";

import SiteNavigation from "./SiteNavigation";

interface ICommericalLayout {
  children: React.ReactNode;
}

const CommercialLayout: React.FC<ICommericalLayout> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Modal | Task Manager</title>
        <meta
          name="description"
          content="Modal | The Last Task Manager You'll Ever Use"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <main
        className={`${inter.variable} flex min-h-screen flex-col font-sans`}
      >
        <div className="flex w-full justify-center px-1 py-2 lg:px-0">
          <div className="flex w-full items-center justify-center rounded-md bg-orange-200 py-2 text-sm text-gray-600 lg:w-1/2 lg:text-base">
            <Info size={16} className="mr-2" />
            <p>
              Modal has been sunset &{" "}
              <a
                target="_blank"
                href="https://github.com/itsRoze/modal"
                className="underline underline-offset-4"
              >
                open-sourced
              </a>
            </p>
          </div>
        </div>
        <SiteNavigation />
        <div className="flex h-full w-full flex-1 flex-col">{children}</div>
        <footer className="flex flex-col items-center justify-end pb-4 pt-8 text-sm">
          <p>Made with ❤️ </p>
          <Link href="/">© Code Stache LLC {new Date().getFullYear()}</Link>
        </footer>
      </main>
    </>
  );
};

export default CommercialLayout;
