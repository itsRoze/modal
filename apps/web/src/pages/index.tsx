import { anybody } from "@/utils/fonts";
import { type NextPageWithLayout } from "./_app";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import Image from "next/image";

const Home: NextPageWithLayout = () => {
  return (
    <article className="flex flex-col xs:items-center">
      <section
        className={`${anybody.variable} font-mono  md:space-y-8 space-y-4 relative`}
      >
        <h1 className="md:text-7xl text-3xl">
          Task management <br /> simplified.
        </h1>
        <Underline />
        <Hero />
        <h1 className="md:text-7xl text-3xl">
          Workflow <br /> streamlined.
        </h1>
        <h2 className="font-light md:text-3xl text-base md:w-80 w-36">
          An app designed around simplicity. Don&apos;t be burdened with complex
          configuration.
        </h2>
      </section>
      <section>
        <ScreenShot />
      </section>
    </article>
  );
};

const ScreenShot = () => {
  return (
    <div className="relative">
      <Image
        src={"/images/blur.png"}
        alt="screenshot of app"
        width={1440}
        height={843}
        className="w-screen h-auto"
      />
      <Image
        src={"/images/app-screenshot.png"}
        alt="screenshot of app"
        width={1755}
        height={1294}
        className="absolute top-36 left-0 right-0 mx-auto h-auto w-2/3"
      />
      <div className="absolute bottom-0 w-screen h-32 bg-white flex justify-center items-center">
        <h3
          className={`{anybody.variable} font-mono line-clamp-2 text-center font-light w-1/3 md:text-4xl text-base`}
        >
          Organize all your projects in a single dashboard
        </h3>
      </div>
    </div>
  );
};

const Underline = () => {
  return (
    <Image
      src="/images/underline.svg"
      alt="underline beneath simplified"
      width={610}
      height={22}
      className="absolute top-[3rem] md:top-[6.25rem] left-0 w-1/2 md:w-7/12 h-auto"
    />
  );
};

const Hero = () => {
  return (
    <Image
      src="/images/hero.svg"
      alt="hero image"
      width={334}
      height={359}
      className="absolute top-[3.5rem] md:top-[6.75rem] md:left-80 left-36 w-40 h-auto md:w-fit"
    />
  );
};

Home.getLayout = (page) => {
  return <CommercialLayout>{page}</CommercialLayout>;
};

export default Home;
