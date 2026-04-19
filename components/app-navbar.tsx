"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { NotificationDropdown } from "@/components/notification-dropdown"

export function AppNavbar() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      // ✅ NAME (handles Google + email users)
      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User"

      // ✅ IMAGE (Google FIX)
      const image =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        user.identities?.[0]?.identity_data?.avatar_url ||
        ""

      setUserData({
        name,
        email: user.email,
        image,
      })
    }

    loadUser()
  }, [router])

  if (!userData) return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="h-16 border-b border-border flex items-center px-6 bg-[#040914]/80 backdrop-blur-md sticky top-0 z-40 shadow-soft">

      {/* Search */}
      <Input placeholder="Search global network..." className="max-w-md bg-[#0A1128] border-border text-foreground focus-visible:ring-primary shadow-inner" />

      <div className="ml-auto flex items-center gap-4">

        {/* Notifications */}
        <NotificationDropdown />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none">
              <Avatar>
                <AvatarImage
                  src={userData.image}
                  referrerPolicy="no-referrer" // ✅ FIX Google image issue
                />
                <AvatarFallback>
                  {userData.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem disabled>
              {userData.email}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
            >
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
            >
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500"
            >
              Logout
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}