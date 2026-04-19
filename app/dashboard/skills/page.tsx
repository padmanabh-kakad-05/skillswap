"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Plus, Pencil, Trash2, Filter } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { supabase } from "@/lib/supabaseClient"

export default function SkillsPage() {
  const router = useRouter()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [skills, setSkills] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "",
  })

  // ✅ LOAD USER + SKILLS
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      setUser(user)

      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error) setSkills(data || [])

      setLoading(false)
    }

    loadData()
  }, [router])

  // ✅ ADD SKILL (FIXED)
  const handleAddSkill = async () => {
    if (!newSkill.name || !newSkill.level) {
      alert("Please fill all fields")
      return
    }

    const { data, error } = await supabase
      .from("skills")
      .insert([
        {
          name: newSkill.name,     // ✅ FIXED
          level: newSkill.level,   // ✅ FIXED
          user_id: user.id,
        },
      ])
      .select()

    if (error) {
      console.log(error) // 🔥 DEBUG
      alert("Error adding skill")
      return
    }

    setSkills((prev) => [data[0], ...prev])
    setNewSkill({ name: "", level: "" })
    setIsAddOpen(false)
  }

  // ✅ DELETE SKILL
  const handleDeleteSkill = async (id: string) => {
    const confirmDelete = window.confirm("Delete this skill?")
    if (!confirmDelete) return

    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error deleting skill")
      return
    }

    setSkills((prev) => prev.filter((s) => s.id !== id))
  }

  // ✅ LOADING
  if (loading) return <p className="p-6">Loading skills...</p>

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">My Skills</h1>
          <p className="text-muted-foreground">Manage your skills</p>
        </div>

        {/* ADD */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Skill</DialogTitle>
              <DialogDescription>Add a new skill</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">

              <Input
                placeholder="Skill name"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
              />

              <Select
                onValueChange={(value) =>
                  setNewSkill({ ...newSkill, level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

            </div>

            <DialogFooter>
              <Button onClick={handleAddSkill}>Add Skill</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH */}
      <div className="flex gap-4">
        <Input placeholder="Search skills..." />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* LIST */}
      <div className="grid gap-4 md:grid-cols-2">

        {skills.length === 0 && (
          <p className="text-muted-foreground">
            No skills added yet
          </p>
        )}

        {skills.map((skill) => (
          <Card key={skill.id}>
            <CardContent className="p-4">

              <div className="flex justify-between">

                <div>
                  <h3 className="font-semibold">
                    {skill.name} {/* ✅ FIXED */}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {skill.level} {/* ✅ FIXED */}
                  </p>
                </div>

                <div className="flex gap-2">

                  <Button size="icon" variant="ghost" disabled>
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteSkill(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}