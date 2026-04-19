"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Repeat } from "lucide-react"
import {
  LayoutDashboard,
  Sparkles,
  Search,
  Send,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { supabase } from "@/lib/supabaseClient"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/skills", label: "My Skills", icon: Sparkles },
  { href: "/dashboard/explore", label: "Explore", icon: Search },
  { href: "/dashboard/requests", label: "Requests", icon: Send },
  { href: "/dashboard/sessions", label: "Sessions", icon: Calendar },
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquare },
]

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [userData, setUserData] = useState<any>(null)

  // ✅ LOAD USER
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "User"

      const image =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        ""

      setUserData({
        name,
        email: user.email,
        image,
      })
    }

    loadUser()
  }, [])

  // ✅ LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0 border-r-[#E2E8F0]">

        {/* HEADER */}
        <SheetHeader className="flex h-16 flex-row items-center gap-2.5 border-b border-[#E2E8F0] px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <Repeat className="h-5 w-5 text-white" />
          </div>
          <SheetTitle className="text-xl font-bold bg-gradient-to-r from-[#6366F1] to-[#A855F7] bg-clip-text text-transparent">
            SkillSwap
          </SheetTitle>
        </SheetHeader>

        {/* NAV */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  isActive
                    ? "bg-[#EAF4FF] text-[#6366F1]"
                    : "text-muted-foreground hover:bg-[#EAF4FF]/50 hover:text-[#6366F1]"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* USER SECTION */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#E2E8F0] p-4">

          <div className="flex items-center gap-3">

            <Avatar className="h-10 w-10">
              <AvatarImage
                src={userData?.image}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>
                {userData?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userData?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userData?.email}
              </p>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="mt-3 flex gap-2">

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 justify-start"
              onClick={() => {
                router.push("/dashboard/settings")
                onOpenChange(false)
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </Button>

          </div>

        </div>

      </SheetContent>
    </Sheet>
  )
}