import Image from 'next/image';

export default function Home() {
  return (
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
            Contributor Hub
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Discover open source projects that match your skills and interests with Waterloti. We analyze your resume to suggest projects tailored for you, making it easier to start contributing to meaningful and relevant open source projects.
          </p>
          <span className="mr-2 mt-4 inline-flex items-center rounded-md bg-blue-400/10 px-1 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
            Coming Soon
          </span>

        </section>
      </div>
    </main>
  );
}
