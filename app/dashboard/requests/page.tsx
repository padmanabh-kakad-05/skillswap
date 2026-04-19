"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Inbox } from "lucide-react"

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async (userId: string) => {
    try {
      const { data: reqs, error: reqErr } = await supabase
        .from("requests")
        .select("*")
        .eq("receiver_id", userId)
        .order("created_at", { ascending: false })

      if (reqErr || !reqs) {
        setRequests([])
        setLoading(false)
        return
      }

      if (reqs.length === 0) {
        setRequests([])
        setLoading(false)
        return
      }

      const userIds = [...new Set(reqs.map(r => r.sender_id))]
      const skillIds = [...new Set(reqs.map(r => r.skill_id))]

      const { data: users } = await supabase.from("users").select("*").in("id", userIds)
      const { data: skills } = await supabase.from("skills").select("*").in("id", skillIds)

      const merged = reqs.map(r => ({
        ...r,
        sender: users?.find(u => u.id === r.sender_id),
        skill: skills?.find(s => s.id === r.skill_id),
      }))

      setRequests(merged)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let channel: any

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await fetchData(user.id)

      const uniqueId = typeof window !== 'undefined' ? window.crypto.randomUUID() : Math.random().toString()
      channel = supabase.channel(`requests-live-${uniqueId}`)

      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
          filter: `receiver_id=eq.${user.id}`,
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

  const handle = async (req: any, status: string) => {
    // Keep previous state in case we need to rollback
    const previousState = [...requests]
    
    // Optimistic UI Update
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status } : r))

    try {
      const { data: updateData, error: updateError } = await supabase
        .from("requests")
        .update({ status })
        .eq("id", req.id)
        .select()

      if (updateError) {
        throw new Error(`Failed to update request: ${updateError.message}`)
      }

      // If the update succeeded without error but affected 0 rows, it's a silent RLS failure!
      if (!updateData || updateData.length === 0) {
        throw new Error("Row Level Security blocked the update. Check your Supabase 'requests' table UPDATE policies.")
      }

      if (status === "accepted") {
        const { error: sessionError } = await supabase.from("sessions").insert({
          sender_id: req.sender_id,
          receiver_id: req.receiver_id,
          request_id: req.id,
          status: "pending",
          session_date: new Date().toISOString().split('T')[0], // Provide fallback to satisfy DB NOT NULL constraint
          time_slot: "TBD" // Provide fallback 
        })

        if (sessionError) {
           throw new Error(`Failed to insert session: ${sessionError.message || JSON.stringify(sessionError)}. Check 'sessions' table INSERT policies!`)
        }

        await supabase.from("notifications").insert({
          user_id: req.sender_id,
          title: "Request Accepted",
          message: `${req.receiver_id ? "Your potential partner" : "Someone"} accepted your request for "${req.skill?.name || "the skill"}"! 🎉`,
        })
      } else if (status === "rejected") {
        await supabase.from("notifications").insert({
          user_id: req.sender_id,
          title: "Request Declined",
          message: `Your request was declined.`,
        })
      }
    } catch (err: any) {
      console.error("Error managing request", err)
      alert(err.message || "Failed to update request status. Check database permissions (RLS) in Supabase.")
      // Rollback optimistic update
      setRequests(previousState)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Requests</h1>
        <p className="text-muted-foreground mt-1">Manage incoming skill exchange requests.</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading requests...</p>
      ) : requests.length === 0 ? (
        <Card className="card-premium border-dashed border-2">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Inbox size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No requests yet</h3>
            <p className="text-muted-foreground text-sm">When someone wants to exchange skills with you, it will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map(r => (
            <Card key={r.id} className="card-premium flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarImage src={r.sender?.avatar_url} />
                  <AvatarFallback className="bg-primary/5 text-primary">
                    {r.sender?.name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {r.sender?.name || "Unknown User"}
                    <Badge variant="outline" className={r.status === "pending" ? "text-yellow-600 bg-yellow-50 border-yellow-200" : r.status === "accepted" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-slate-600 bg-slate-50 border-slate-200"}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Requested Skill: <span className="font-medium text-primary">{r.skill?.name || "Unknown Skill"}</span>
                  </p>
                </div>
              </div>

              {r.status === "pending" && (
                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <Button 
                    onClick={() => handle(r, "accepted")} 
                    className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="mr-2 h-4 w-4" /> Accept
                  </Button>
                  <Button 
                    onClick={() => handle(r, "rejected")} 
                    variant="outline" 
                    className="flex-1 md:flex-none text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}