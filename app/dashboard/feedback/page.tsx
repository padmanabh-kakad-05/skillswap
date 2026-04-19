"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function FeedbackPage() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(true)

  // ✅ LOAD USER + DATA
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      setUser(user)

      const { data: fb } = await supabase
        .from("feedback")
        .select("*")
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false })

      const { data: usersData } = await supabase
        .from("users")
        .select("*")

      setFeedbacks(fb || [])
      setUsers(usersData || [])
      setLoading(false)
    }

    loadData()
  }, [router])

  // ✅ SUBMIT FEEDBACK
  const handleSubmit = async () => {
    if (!selectedUser || !comment || !user) {
      alert("Please fill all fields")
      return
    }

    const { error } = await supabase.from("feedback").insert([
      {
        sender_id: user.id,
        receiver_id: selectedUser,
        rating: Number(rating),
        comment: comment.trim(),
        session_id: null, // optional
      },
    ])

    if (error) {
      console.error(error)
      alert(error.message)
    } else {
      alert("Feedback submitted!")

      // reset form
      setComment("")
      setSelectedUser("")
      setRating(5)

      // refresh feedback list
      const { data } = await supabase
        .from("feedback")
        .select("*")
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false })

      setFeedbacks(data || [])
    }
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Feedback</h1>

      {/* ================= RECEIVED ================= */}
      <div>
        <h2 className="font-medium mb-3">Received Feedback</h2>

        {feedbacks.length === 0 && (
          <p className="text-muted-foreground">No feedback yet</p>
        )}

        <div className="grid gap-4">
          {feedbacks.map((fb) => {
            const sender = users.find((u) => u.id === fb.sender_id)

            return (
              <Card key={fb.id}>
                <CardContent className="p-4 flex gap-3">
                  <Avatar>
                    <AvatarImage src={sender?.avatar_url} />
                    <AvatarFallback>
                      {sender?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">
                      {sender?.name || "User"}
                    </p>

                    <p className="text-sm">
                      Rating: ⭐ {fb.rating}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {fb.comment}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ================= WRITE ================= */}
      <div className="space-y-3">
        <h2 className="font-medium">Write Feedback</h2>

        <select
          className="border p-2 rounded w-full"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select user</option>

          {users
            .filter((u) => u.id !== user?.id)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
        </select>

        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />

        <Textarea
          placeholder="Write feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button onClick={handleSubmit}>
          Submit Feedback
        </Button>
      </div>
    </div>
  )
}