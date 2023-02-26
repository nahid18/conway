import { SiteHeader } from "@/components/site-header"
import HeadComponent from "./seo"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <HeadComponent />
      <SiteHeader />
      <main>{children}</main>
    </>
  )
}
