import Link from "next/link";

import Navbar from "@/components/navbar";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

// font-[family-name:var(--font-geist-sans)]

export default function Home() {
  return (
    <main>
      <Navbar />
      <section className="p-4">
        <div className="w-full pt-48 pb-36 rounded-xl relative border bg-neutral-50 dark:bg-neutral-950 dark:text-white px-4">
          <div className="z-10 relative flex flex-col items-center">
            <div className={cn("group rounded-full border border-white/5 bg-neutral-900 text-base text-white transition-all ease-in hover hover:cursor-pointer hover:bg-neutral-800")}>
              <AnimatedShinyText className="inline-flex text-neutral-300 items-center justify-center px-3 py-1 transition ease-out hover:duration-300">
                ✨ Introducing MyCal
              </AnimatedShinyText>
            </div>

            <h1 className="text-[27px] font-semibold tracking-tight md:text-4xl lg:text-5xl xl:text-6xl text-center mt-2 md:mt-4 xl:mt-6">An online appointment system <br className="hidden lg:block" /> made simple and seamless</h1>
            <p className="md:text-lg text-neutral-800 dark:text-neutral-300 max-w-xl text-center mt-2 md:mt-4 xl:mt-6">Effortlessly schedule, manage, and track appointments—all in one place. Our user-friendly platform ensures that booking is quick, easy, and accessible anytime, from any device.</p>
            <div className="flex items-center gap-4 mt-4 xl:mt-6">
              <Link href="/">
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
          </div>
          <GridPattern
            width={65}
            height={65}
            x={-1}
            y={-1}
            className={cn(
              "stroke-neutral-400/30 dark:stroke-neutral-700/30 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            )}
          />
        </div>
      </section>
    </main>
  );
}
