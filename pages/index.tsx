import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <Layout>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Simulate & Have Fun
          </h1>
          <p className="max-w-[700px] text-md text-slate-700 dark:text-slate-400 sm:text-xl">
            The Game of Life, also known simply as Life, where one interacts with the Game of Life by creating an initial configuration and observing how it evolves.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href={'/game'}
            className={buttonVariants({ size: "lg" })}
          >
            Launch the Game
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.repo}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Source Code
          </Link>
        </div>
      </section>
    </Layout>
  )
}
