import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Waterloti</title>
        <meta name="description" content="Waterloti Open Source Contributor Hub for discovering open source projects that match your skills and interests." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="flex flex-col items-center justify-center">
          <Image
            className="relative"
            src="/waterloti.png"
            alt="Waterloti Logo"
            width={180}
            height={37}
            priority
          />
          <section className="flex flex-col items-center justify-center text-center pt-6 md:py-10">
            <h1 className="text-3xl max-w-[980px] pb-3  font-extrabold leading-tight tracking-tighter md:text-4xl">
              Waterloti Open Source<br className="hidden sm:inline" />
              {' '}Contributor Hub
            </h1>

            <p className="max-w-[700px] text-lg text-muted-foreground">

              Discover open source projects that match your skills and interests with Waterloti. We analyze your resume to suggest projects tailored to you, making it easier to start contributing to meaningful and relevant open source projects.
              <span className="ml-2 inline-flex items-center rounded-md bg-blue-400/10 px-1 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
                Coming Soon
              </span>
            </p>
            <div className="flex flex-col items-center justify-center pt-6 md:pt-10">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "outline" })}
              >
                Github
              </Link>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
