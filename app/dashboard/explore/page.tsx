"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Search, Send, MapPin, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { supabase } from "@/lib/supabaseClient"

export default function ExplorePage() {
  const router = useRouter()

  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedSkill, setSelectedSkill] = useState<any>(null)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      setCurrentUser(user)

      const { data: skills } = await supabase
        .from("skills")
        .select("*")

      const otherSkills = (skills || []).filter(
        (s) => s.user_id !== user.id
      )

      if (otherSkills.length === 0) {
        setUsers([])
        setLoading(false)
        return
      }

      const userIds = [...new Set(otherSkills.map((s) => s.user_id))]

      const { data: profiles } = await supabase
        .from("users")
        .select("*")
        .in("id", userIds)

      const merged = (profiles || []).map((u) => ({
        id: u.id,
        name: u.name || "User",
        avatar: u.avatar_url || "",
        bio: u.bio || "Passionate about learning and sharing knowledge with others.",
        skills: otherSkills
          .filter((s) => s.user_id === u.id)
          .map((s) => ({
            id: s.id,
            name: s.name,
          })),
      }))

      setUsers(merged)
      setLoading(false)
    }

    loadData()
  }, [router])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skills.some((skill: any) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const handleSendRequest = async () => {
    if (!selectedUser || !currentUser || !selectedSkill) {
      alert("Please select a skill to request.")
      return
    }

    const { data: existing } = await supabase
      .from("requests")
      .select("*")
      .eq("sender_id", currentUser.id)
      .eq("receiver_id", selectedUser.id)
      .eq("skill_id", selectedSkill.id)
      .eq("status", "pending")

    if (existing && existing.length > 0) {
      alert("You have already sent a pending request for this skill.")
      return
    }

    const { error } = await supabase.from("requests").insert([
      {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        skill_id: selectedSkill.id,
        status: "pending",
      },
    ])

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    await supabase.from("notifications").insert([
      {
        user_id: selectedUser.id,
        title: "New Request",
        message: `${currentUser.user_metadata?.name || "Someone"} wants to learn "${selectedSkill.name}" from you.`,
      },
    ])

    setIsRequestOpen(false)
    setSelectedSkill(null)
    
    // Use a toast or minimal alert ideally in prod, but keeping alert per user baseline
    alert("Request sent successfully!")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Explore</h1>
        <p className="text-muted-foreground mt-1">
          Discover talented individuals and initiate skill exchanges.
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or specific skill..."
          className="pl-10 h-11 text-base rounded-xl border-border focus-visible:ring-primary shadow-sm bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {filteredUsers.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl bg-white/50">
            <p className="text-muted-foreground text-lg">No users found matching your search.</p>
          </div>
        )}

        {filteredUsers.map((user) => (
          <Card key={user.id} className="card-premium overflow-hidden flex flex-col group">
            <div className="h-16 bg-gradient-to-r from-primary/20 to-secondary/10 w-full" />
            <CardContent className="p-6 pt-0 flex-1 flex flex-col relative">
              <Avatar className="h-16 w-16 -mt-8 mb-4 border-4 border-white shadow-sm mx-auto">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary/5 text-primary text-xl font-medium">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="text-center mb-4 flex-1">
                <h3 className="font-semibold text-lg text-foreground line-clamp-1 hover:text-primary transition-colors cursor-pointer">{user.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {user.bio}
                </p>
              </div>

              <div className="mb-6 flex flex-wrap gap-2 justify-center">
                {user.skills.slice(0, 3).map((skill: any) => (
                  <Badge key={skill.id} variant="secondary" className="bg-secondary/5 text-secondary-foreground hover:bg-secondary/10 font-medium">
                    {skill.name}
                  </Badge>
                ))}
                {user.skills.length > 3 && (
                  <Badge variant="outline" className="text-muted-foreground">+ {user.skills.length - 3}</Badge>
                )}
              </div>

              <Button
                className="w-full mt-auto group-hover:bg-primary transition-colors"
                variant="outline"
                onClick={() => {
                  setSelectedUser(user)
                  setSelectedSkill(null)
                  setIsRequestOpen(true)
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                Request Exchange
              </Button>
            </CardContent>
          </Card>
        ))}

      </div>

      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Request Skill Exchange</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Which skill would you like to learn from <span className="font-semibold text-foreground">{selectedUser?.name}</span>?
            </DialogDescription>
          </DialogHeader>

          <div className="my-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Available Skills</h4>
            <div className="flex flex-wrap gap-2">
              {selectedUser?.skills.map((skill: any) => (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-4 py-2 rounded-full cursor-pointer transition-all border text-sm font-medium ${
                    selectedSkill?.id === skill.id
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                      : "bg-white text-foreground hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="sm:justify-between border-t pt-4">
            <Button variant="ghost" onClick={() => setIsRequestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendRequest} disabled={!selectedSkill} className="gradient-primary text-white border-0 shadow-md">
              Send Request <Send className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}