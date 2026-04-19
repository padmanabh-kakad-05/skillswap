"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Users, CalendarCheck, Star, Activity, ArrowDownToLine, ArrowUpRight, Zap, Target } from "lucide-react"

export default function DashboardClient() {
  const [stats, setStats] = useState({
    skills: 0,
    sessions: 0,
    rating: 0,
    active: 0,
    requestsReceived: 0,
    requestsSent: 0,
    hoursGained: 0,
    successRate: 0
  })

  const loadData = async (userId: string) => {
    const { data: skills } = await supabase
      .from("skills")
      .select("id")
      .eq("user_id", userId)

    const { data: sessions } = await supabase
      .from("sessions")
      .select("status")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)

    const { data: feedback } = await supabase
      .from("feedback")
      .select("rating")
      .eq("receiver_id", userId)
      
    const { data: requestsRecv } = await supabase
      .from("requests")
      .select("id")
      .eq("receiver_id", userId)
      
    const { data: requestsSent } = await supabase
      .from("requests")
      .select("id")
      .eq("sender_id", userId)

    const avg =
      feedback?.length
        ? feedback.reduce((a, b) => a + b.rating, 0) / feedback.length
        : 0
        
    const completedSessions = sessions?.filter(s => s.status === "completed").length || 0
    const totalSessions = sessions?.length || 0
    const successRatio = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

    setStats({
      skills: skills?.length || 0,
      sessions: completedSessions,
      active: sessions?.filter(s => s.status === "scheduled").length || 0,
      rating: Number(avg.toFixed(1)),
      requestsReceived: requestsRecv?.length || 0,
      requestsSent: requestsSent?.length || 0,
      hoursGained: completedSessions * 1.5, // 1.5 hrs estimated per session
      successRate: successRatio
    })
  }

  useEffect(() => {
    let channel: any

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await loadData(user.id)

      // Realtime subscription for stats update
      const uniqueId = typeof window !== 'undefined' ? window.crypto.randomUUID() : Math.random().toString()
      channel = supabase.channel(`dashboard-stats-${uniqueId}`)
      
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "skills", filter: `user_id=eq.${user.id}` },
        () => loadData(user.id)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sessions" },
        () => loadData(user.id)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "requests" },
        () => loadData(user.id)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback", filter: `receiver_id=eq.${user.id}` },
        () => loadData(user.id)
      )
      .subscribe()
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2" style={{ textShadow: '0 0 10px rgba(0, 229, 255, 0.3)' }}>Dashboard</h1>
        <p className="text-primary/80 font-medium">Welcome back to the grid. Here is your platform overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Row 1 */}
        <Card className="card-premium border-l-4 border-l-primary group">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-primary transition-colors">Total Skills Offered</p>
              <p className="text-3xl font-bold text-white shadow-primary drop-shadow-md">{stats.skills}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all group-hover:scale-110">
              <Users size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium border-l-4 border-l-emerald-400 group">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-emerald-400 transition-colors">Active Swaps</p>
              <p className="text-3xl font-bold text-white drop-shadow-md">{stats.active}</p>
            </div>
            <div className="h-12 w-12 bg-emerald-400/10 rounded-full flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400/20 transition-all group-hover:scale-110">
              <Activity size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium border-l-4 border-l-secondary group">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-secondary transition-colors">Sessions Completed</p>
              <p className="text-3xl font-bold text-white drop-shadow-md">{stats.sessions}</p>
            </div>
            <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-all group-hover:scale-110">
              <CalendarCheck size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium border-l-4 border-l-yellow-400 group">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-yellow-400 transition-colors">Average Rating</p>
              <p className="text-3xl font-bold text-white drop-shadow-md">{stats.rating}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400/20 transition-all group-hover:scale-110">
              <Star size={24} />
            </div>
          </CardContent>
        </Card>

        {/* Row 2 */}
        <Card className="card-premium border-l-4 border-l-cyan-500 group">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-cyan-500 transition-colors">Requests Received</p>
              <p className="text-3xl font-bold text-white drop-shadow-md">{stats.requestsReceived}</p>
            </div>
            <div className="h-12 w-12 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500/20 transition-all group-hover:scale-110">
              <ArrowDownToLine size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium border-l-4 border-l-accent group">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-accent transition-colors">Requests Sent</p>
              <p className="text-3xl font-bold text-white drop-shadow-md">{stats.requestsSent}</p>
            </div>
            <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center text-accent group-hover:bg-accent/20 transition-all group-hover:scale-110">
              <ArrowUpRight size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium border-l-4 border-l-orange-500 group">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-orange-500 transition-colors">Skill Hours Exchanged</p>
              <p className="text-3xl font-bold text-white drop-shadow-md">{stats.hoursGained}h</p>
            </div>
            <div className="h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 group-hover:bg-orange-500/20 transition-all group-hover:scale-110">
              <Zap size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium border-l-4 border-l-indigo-400 group">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-indigo-400 transition-colors">Success Rate</p>
              <p className="text-3xl font-bold text-white drop-shadow-md">{stats.successRate}%</p>
            </div>
            <div className="h-12 w-12 bg-indigo-400/10 rounded-full flex items-center justify-center text-indigo-400 group-hover:bg-indigo-400/20 transition-all group-hover:scale-110">
              <Target size={24} />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}