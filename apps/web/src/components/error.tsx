import Link from "next/link";
import { inter } from "@/utils/fonts";
import { ChevronRight } from "lucide-react";

import MailTo from "./mailto";

interface IError {
  code?: number;
  message?: string;
}

const ErrorPage: React.FC<IError> = ({
  code = 404,
  message = "Oops! Something went wrong",
}) => {
  return (
    <main
      className={`h-screen w-screen ${inter.variable} flex flex-col justify-center px-10 font-sans`}
    >
      <header className="">
        <h1 className="text-5xl font-[100] text-gray-600 md:text-7xl">
          {code}
        </h1>
        <h2 className="text-2xl font-light text-gray-600">{message}</h2>
        <h2 className="py-4 text-lg text-gray-600">
          But don&apos;t worry, we can get out of here
        </h2>
      </header>
      <Link href="/" className="flex items-center font-bold hover:underline">
        <ChevronRight strokeWidth={3} size={18} /> Go to homepage
      </Link>
      <Link
        href="/login"
        className="flex items-center font-bold hover:underline"
      >
        <ChevronRight strokeWidth={3} size={18} /> Go to Login
      </Link>
      <div className="flex items-center font-bold hover:underline">
        <ChevronRight strokeWidth={3} size={18} />
        <MailTo email="contact@codestache.com" subject="Modal App - Support">
          Contact support
        </MailTo>
      </div>
    </main>
  );
};

export default ErrorPage;
