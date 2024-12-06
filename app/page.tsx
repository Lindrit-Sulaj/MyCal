import Link from "next/link";

import Navbar from "@/components/navbar";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/ui/dot-pattern";
import { Rocket } from "lucide-react";

// font-[family-name:var(--font-geist-sans)]

export default async function Home() {
  return (
    <main>
      <div className="relative">
        <Navbar />
        <section className="px-4 md:px-8">
          <div className="max-w-screen-xl mx-auto pb-32 pt-20">
            <h1 className="text-2xl font-medium md:text-3xl lg:text-5xl lg:leading-[3rem] xl:text-6xl xl:leading-[4.2rem] tracking-tight max-w-2xl">Online appointment system for all service based industries</h1>
            <p className="max-w-xl text-foreground/90 mt-4">Easily schedule, manage and track appointments — all in one place. MyCal ensures that booking is quick, easy, and accessible anytime, from any device.</p>
            <div className="mt-4">
              <Button variant="cta" size="lg">
                <Rocket /> Get Early Access
              </Button>
            </div>
          </div>
        </section>
        <DotPattern
          width={20}
          height={20}
          className="fill-neutral-300 dark:fill-neutral-800 -z-10" />
      </div>
    </main>
  );
}
