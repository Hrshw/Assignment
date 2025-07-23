"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown, LayoutDashboard, Video, Camera, AlertTriangle, Users } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Cameras", href: "/cameras", icon: Video },
    { name: "Scenes", href: "/scenes", icon: Camera },
    { name: "Incidents", href: "/incidents", icon: AlertTriangle },
    { name: "Users", href: "/users", icon: Users },
  ]

  return (
    <header className="bg-[#1E293B] border-b border-gray-700">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="#" className="flex items-center gap-2 text-lg font-semibold text-white" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span>MANDLACX</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#334155] hover:text-white",
                  pathname === item.href ? "bg-[#334155] text-white" : "text-gray-400"
                )}
                prefetch={false}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-[#1E293B]" />
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">V</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-white">Vhammed Alhas</div>
            <div className="text-xs text-gray-400">has@mandlac.com</div>
          </div>
          <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
        </div>
      </div>
    </header>
  )
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
