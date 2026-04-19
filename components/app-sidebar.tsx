"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  LayoutDashboard,
  Sparkles,
  Search,
  Send,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Repeat,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/skills", label: "My Skills", icon: Sparkles },
  { href: "/dashboard/explore", label: "Explore", icon: Search },
  { href: "/dashboard/requests", label: "Requests", icon: Send },
  { href: "/dashboard/sessions", label: "Sessions", icon: Calendar },
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquare },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User"

      const email = user.email

      const image =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        user.identities?.[0]?.identity_data?.avatar_url ||
        ""

      setUserData({ name, email, image })
    }

    loadUser()
  }, [router])

  if (!userData) return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-[#060D1E] flex flex-col z-50 shadow-soft-lg">

      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Repeat className="mr-2 text-primary" />
        <span className="font-extrabold text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]">SkillSwap</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/") // ✅ FIX active highlight

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-medium border-l-4 border-primary shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom User */}
      <div className="border-t border-border p-4 bg-[#0A1128]">

        <div className="flex items-center gap-3">
          <Avatar className="ring-2 ring-primary/20">
            <AvatarImage
              src={userData.image}
              referrerPolicy="no-referrer" // ✅ FIX Google image
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {userData.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{userData.name}</p>
            <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-2">

          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/dashboard/settings")}
            className="flex-1 border-border bg-[#060D1E] hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>

          <Button size="sm" variant="destructive" onClick={handleLogout} className="px-3">
            <LogOut className="h-4 w-4" />
          </Button>

        </div>

      </div>
    </aside>
  )
}