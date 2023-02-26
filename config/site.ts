import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
    docs: string
    repo: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Conway Game of Life",
  description:
    "Conway Game of Life",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/abdnahid_",
    github: "https://github.com/nahid18",
    docs: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
    repo: "https://github.com/nahid18/conway-ts",
  },
}
