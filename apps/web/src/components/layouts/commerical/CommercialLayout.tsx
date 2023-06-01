import Head from "next/head";
import Link from "next/link";
import { inter } from "@/utils/fonts";

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
        <SiteNavigation />
        <div className="flex h-full w-full flex-1 flex-col">{children}</div>
        <footer className="flex items-end justify-center pb-4 pt-8">
          <Link href="/">© Roze 🌹 {new Date().getFullYear()}</Link>
        </footer>
      </main>
    </>
  );
};

export default CommercialLayout;
