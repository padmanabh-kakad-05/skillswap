"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchData = async (userId: string) => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (data) {
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.is_read).length) // assuming there might be an is_read property
    }
  }

  useEffect(() => {
    let channel: any

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await fetchData(user.id)

      const uniqueId = typeof window !== 'undefined' ? window.crypto.randomUUID() : Math.random().toString()
      channel = supabase.channel(`notif-live-${uniqueId}`)

      channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchData(user.id)
      )

      channel.subscribe()
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2 h-auto w-auto rounded-full hover:bg-muted">
          <Bell className="w-5 h-5 text-foreground" />
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 p-0 rounded-full bg-primary text-xs text-white">
              {notifications.length > 9 ? '9+' : notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72 p-0 rounded-xl overflow-hidden shadow-soft-lg mt-2" align="end">
        <div className="bg-primary px-4 py-3 text-primary-foreground">
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="border-b last:border-b-0 px-4 py-3 hover:bg-muted transition-colors text-sm">
                <p className="font-medium text-foreground">{n.title || "Notification"}</p>
                <p className="text-muted-foreground mt-1">{n.message}</p>
                <div className="text-[10px] text-muted-foreground mt-2">
                  {new Date(n.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}