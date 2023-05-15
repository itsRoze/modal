import Head from "next/head";
import SiteNavigation from "./SiteNavigation";
import Link from "next/link";
import { inter } from "@/utils/fonts";

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
        className={`${inter.variable} font-sans flex min-h-screen flex-col`}
      >
        <SiteNavigation />
        <div className="w-full">{children}</div>
        <footer className="flex flex-grow items-end justify-center py-8">
          <Link href="/">© Roze 🌹 {new Date().getFullYear()}</Link>
        </footer>
      </main>
    </>
  );
};

export default CommercialLayout;