"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Video, CheckCircle2 } from "lucide-react"

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [scheduleData, setScheduleData] = useState<{ [key: string]: { date: string, time: string } }>({})

  const fetchData = async (userId: string) => {
    try {
      const { data: sess, error } = await supabase
        .from("sessions")
        .select(`
          *,
          request:requests(skill_id)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false })

      if (error || !sess) {
        setSessions([])
        setLoading(false)
        return
      }

      if (sess.length === 0) {
        setSessions([])
        setLoading(false)
        return
      }

      // Fetch all involved users
      const userIds = [...new Set(sess.flatMap(s => [s.sender_id, s.receiver_id]))]
      const { data: users } = await supabase.from("users").select("*").in("id", userIds)

      // Fetch skills from requests
      const skillIds = [...new Set(sess.map(s => s.request?.skill_id).filter(Boolean))]
      let skills: any[] = []
      if (skillIds.length > 0) {
        const { data: sk } = await supabase.from("skills").select("*").in("id", skillIds)
        if (sk) skills = sk
      }

      const merged = sess.map(s => {
        const partnerId = s.sender_id === userId ? s.receiver_id : s.sender_id
        return {
          ...s,
          partner: users?.find(u => u.id === partnerId),
          skill: skills?.find(sk => sk.id === s.request?.skill_id),
        }
      })

      setSessions(merged)
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
      setCurrentUser(user)

      await fetchData(user.id)

      const uniqueId = typeof window !== 'undefined' ? window.crypto.randomUUID() : Math.random().toString()
      channel = supabase.channel(`sessions-live-${uniqueId}`)

      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions"
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

  const handleSchedule = async (sessionId: string, partnerId: string) => {
    const data = scheduleData[sessionId]
    if (!data || !data.date || !data.time) {
      alert("Please select both date and time")
      return
    }

    try {
      await supabase
        .from("sessions")
        .update({
          session_date: data.date,
          time_slot: data.time,
          status: "scheduled"
        })
        .eq("id", sessionId)

      await supabase.from("notifications").insert({
        user_id: partnerId,
        title: "Session Scheduled",
        message: `A session has been scheduled for ${data.date} at ${data.time}.`,
      })
      
      // Clear schedule form for this session
      setScheduleData(prev => ({ ...prev, [sessionId]: { date: "", time: "" } }))

    } catch (error) {
      console.error("Failed to schedule", error)
    }
  }

  const handleStatusComplete = async (sessionId: string) => {
    try {
      await supabase
        .from("sessions")
        .update({ status: "completed" })
        .eq("id", sessionId)
    } catch (error) {
      console.error("Failed to complete session", error)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sessions</h1>
        <p className="text-muted-foreground mt-1">Manage and schedule your active skill exchanges.</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <Card className="card-premium border-dashed border-2">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No active sessions</h3>
            <p className="text-muted-foreground text-sm max-w-md mt-2">
              Accept a request or wait for someone to accept yours to start a skill exchange session.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sessions.map(s => (
            <Card key={s.id} className="card-premium overflow-hidden">
              <div className={`h-2 w-full ${s.status === 'scheduled' ? 'bg-primary' : s.status === 'completed' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-8 justify-between">
                  
                  {/* Left Side: Partner Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-14 w-14 border-2 border-primary/10">
                      <AvatarImage src={s.partner?.avatar_url} />
                      <AvatarFallback className="bg-primary/5 text-primary text-xl">
                        {s.partner?.name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-foreground truncate">
                          {s.partner?.name || "Unknown User"}
                        </h3>
                        <Badge variant="outline" className={
                          s.status === "scheduled" ? "text-primary bg-primary/10 border-primary/20" : 
                          s.status === "completed" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : 
                          "text-yellow-600 bg-yellow-50 border-yellow-200"
                        }>
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Skill: <span className="font-medium text-foreground">{s.skill?.name || "Unknown"}</span>
                      </p>
                      
                      {s.status !== "pending" && s.session_date && s.time_slot && (
                        <div className="flex flex-wrap gap-4 mt-4 bg-muted/50 p-3 rounded-lg border">
                          <div className="flex items-center text-sm font-medium">
                            <Calendar className="mr-2 h-4 w-4 text-primary" />
                            {s.session_date}
                          </div>
                          <div className="flex items-center text-sm font-medium">
                            <Clock className="mr-2 h-4 w-4 text-primary" />
                            {s.time_slot}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Actions based on status */}
                  <div className="flex-1 flex flex-col justify-center min-w-[300px]">
                    {s.status === "pending" && (
                      <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                        <h4 className="text-sm font-medium mb-2 w-full">Schedule this session</h4>
                        <div className="flex gap-3">
                          <div className="flex-1 space-y-1">
                            <Label htmlFor={`date-${s.id}`} className="text-xs">Date</Label>
                            <Input 
                              id={`date-${s.id}`}
                              type="date" 
                              value={scheduleData[s.id]?.date || ""}
                              onChange={(e) => setScheduleData(prev => ({...prev, [s.id]: { ...prev[s.id], date: e.target.value }}))}
                              className="bg-white"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Label htmlFor={`time-${s.id}`} className="text-xs">Time</Label>
                            <select 
                              id={`time-${s.id}`}
                              value={scheduleData[s.id]?.time || ""}
                              onChange={(e) => setScheduleData(prev => ({...prev, [s.id]: { ...prev[s.id], time: e.target.value }}))}
                              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="" disabled>Select time</option>
                              <option value="09:00 AM">09:00 AM</option>
                              <option value="09:30 AM">09:30 AM</option>
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="10:30 AM">10:30 AM</option>
                              <option value="11:00 AM">11:00 AM</option>
                              <option value="11:30 AM">11:30 AM</option>
                              <option value="12:00 PM">12:00 PM</option>
                              <option value="12:30 PM">12:30 PM</option>
                              <option value="01:00 PM">01:00 PM</option>
                              <option value="01:30 PM">01:30 PM</option>
                              <option value="02:00 PM">02:00 PM</option>
                              <option value="02:30 PM">02:30 PM</option>
                              <option value="03:00 PM">03:00 PM</option>
                              <option value="03:30 PM">03:30 PM</option>
                              <option value="04:00 PM">04:00 PM</option>
                              <option value="04:30 PM">04:30 PM</option>
                              <option value="05:00 PM">05:00 PM</option>
                              <option value="05:30 PM">05:30 PM</option>
                              <option value="06:00 PM">06:00 PM</option>
                              <option value="06:30 PM">06:30 PM</option>
                              <option value="07:00 PM">07:00 PM</option>
                              <option value="07:30 PM">07:30 PM</option>
                              <option value="08:00 PM">08:00 PM</option>
                            </select>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-2" 
                          onClick={() => handleSchedule(s.id, s.partner?.id)}
                        >
                          <Calendar className="mr-2 h-4 w-4" /> Schedule Session
                        </Button>
                      </div>
                    )}
                    
                    {s.status === "scheduled" && (
                      <div className="flex flex-col gap-3 justify-center h-full">
                        <Button className="w-full gradient-primary text-white border-0">
                          <Video className="mr-2 h-4 w-4" /> Join Video Call
                        </Button>
                        <Button variant="outline" className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleStatusComplete(s.id)}>
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
                        </Button>
                      </div>
                    )}

                    {s.status === "completed" && (
                      <div className="h-full flex items-center justify-center bg-emerald-50 rounded-xl border border-emerald-100 p-4 text-emerald-700 font-medium">
                        <CheckCircle2 className="mr-2 h-5 w-5" /> Session Completed Successfully
                      </div>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}