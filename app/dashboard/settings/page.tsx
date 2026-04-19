"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const router = useRouter()

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // ✅ LOAD DATA
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    loadUser()
  }, [router])

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e: any) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  // ✅ HANDLE SWITCH
  const handleToggle = (key: string, value: boolean) => {
    setProfile({
      ...profile,
      [key]: value,
    })
  }

  // ✅ SAVE
  const handleSave = async () => {
    const { error } = await supabase
      .from("users")
      .update({
        name: profile.name,
        notifications_enabled: profile.notifications_enabled,
        is_public: profile.is_public,
      })
      .eq("id", profile.id)

    if (error) {
      console.error(error)
      alert("Error saving settings")
    } else {
      alert("Settings updated successfully!")
    }
  }

  // ✅ DELETE ACCOUNT
  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure? This cannot be undone.")
    if (!confirmDelete) return

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", profile.id)

    if (error) {
      alert("Error deleting account")
    } else {
      await supabase.auth.signOut()
      router.push("/login")
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2" style={{ textShadow: '0 0 10px rgba(0, 229, 255, 0.3)' }}>Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your personal profile and system configurations.</p>
      </div>

      {/* ================= PROFILE ================= */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Profile Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">

          <div className="space-y-2">
            <Label className="text-muted-foreground">Name</Label>
            <Input
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
              className="bg-[#040914] border-border text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Email</Label>
            <Input value={profile.email} disabled className="bg-muted border-border cursor-not-allowed opacity-70" />
          </div>

          <Button
            onClick={handleSave}
            className="gradient-primary text-black font-semibold border-0 shadow-soft"
          >
            Save Changes
          </Button>

        </CardContent>
      </Card>

      {/* ================= ACCOUNT ================= */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-xl text-secondary">Account Preferences</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
            <Label className="font-medium text-white">Email Notifications</Label>
            <Switch
              checked={profile.notifications_enabled || false}
              onCheckedChange={(val) =>
                handleToggle("notifications_enabled", val)
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
            <Label className="font-medium text-white">Public Profile</Label>
            <Switch
              checked={profile.is_public || false}
              onCheckedChange={(val) =>
                handleToggle("is_public", val)
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>

        </CardContent>
      </Card>

      {/* ================= SECURITY ================= */}
      <Card className="card-premium border border-destructive/30">
        <CardHeader>
          <CardTitle className="text-xl text-destructive font-bold">Danger Zone</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 border-t border-destructive/20 mt-4">

          <Button
            variant="outline"
            onClick={() => alert("Use Supabase reset password")}
          >
            Change Password
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete Account
          </Button>

        </CardContent>
      </Card>

    </div>
  )
}