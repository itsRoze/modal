import CommercialLayout from '@/components/layouts/commerical/CommercialLayout';
import { anybody } from '@/utils/fonts';
import Image from 'next/image';
import { type NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <article className='flex flex-col 2xs:items-center bg-blur-screenshot bg-fixed bg-no-repeat bg-cover '>
        <section
          className={`${anybody.variable} font-mono md:space-y-8 flex flex-col 2xs:items-center space-y-4 w-full `}
        >
          <div className='relative md:space-y-4 space-y-2 mb-8 md:mb-28'>
            <h1 className='md:text-7xl text-3xl'>
              Task management <br /> simplified.
            </h1>
            <Underline />
            <Hero />
            <h1 className='md:text-7xl text-3xl'>
              Workflow <br /> streamlined.
            </h1>
            <h2 className='font-light md:text-3xl text-base md:w-80 w-40'>
              An app designed around simplicity. Don&apos;t be burdened with
              complex configuration.
            </h2>
          </div>
          <Screenshot />
        </section>
      </article>
      <article className='flex flex-col 2xs:items-center w-full justify-center bg-white'>
        <section
          className={`${anybody.variable} font-mono flex flex-col md:flex-row gap-4 mt-16 items-center md:items-start md:justify-center w-full md:px-6 2xl:px-28 md:pb-8`}
        >
          <div className='md:w-1/2 w-3/4 flex justify-center'>
            <div className='space-y-4'>
              <h3 className={`font-medium md:text-4xl`}>Priority Focused</h3>
              <p className='font-light text-sm md:text-2xl w-96'>
                Based on the Eisenhower method of time management
              </p>
            </div>
          </div>
          <div className='md:w-1/2 w-3/4  flex justify-center'>
            <div className='space-y-4'>
              <h3 className={`font-medium md:text-4xl`}>
                Organize with Spaces
              </h3>
              <p className='font-light text-sm md:text-2xl w-96'>
                Use spaces to group different projects and tasks with shared
                responsibilities (e.g. Work, Personal Life, Hobbies, etc)
              </p>
            </div>
          </div>
        </section>
      </article>
    </>
  );
};

const Screenshot = () => {
  return (
    <div className='relative w-full flex justify-center items-center'>
      <Image
        src={'/images/app-screenshot.png'}
        alt='screenshot of app'
        width={1755}
        height={1294}
        className='h-auto lg:w-2/3'
      />
      <div className='absolute bottom-0 w-full md:h-36 h-12 bg-white flex justify-center items-center'>
        <h3
          className={`{anybody.variable} pt-6 font-mono line-clamp-2 text-center font-light md:w-3/4 w-2/3 md:text-5xl text-lg`}
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
      src='/images/underline.svg'
      alt='underline beneath simplified'
      width={610}
      height={22}
      className='absolute top-[3.5rem] md:top-[7.25rem] left-0 w-1/2 md:w-7/12 h-auto'
    />
  );
};

const Hero = () => {
  return (
    <Image
      src='/images/hero.svg'
      alt='hero image'
      width={334}
      height={359}
      className='absolute top-[4rem] md:top-[8.5rem] md:left-[21rem] left-36 w-40 h-auto md:w-fit'
    />
  );
};

Home.getLayout = (page) => {
  return <CommercialLayout>{page}</CommercialLayout>;
};

export default Home;
