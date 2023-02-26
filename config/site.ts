import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
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
    {
      title: "Game",
      href: "/game",
    }
  ],
  links: {
    twitter: "https://twitter.com/abdnahid_",
    github: "https://github.com/nahid18",
    repo: "https://github.com/nahid18/conway",
  },
}
