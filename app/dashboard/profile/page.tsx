"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    bio: "",
    image: "",
  })

  // ✅ LOAD FROM AUTH (MAIN SOURCE)
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      setProfile({
        id: user.id,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "",
        email: user.email || "",
        bio: user.user_metadata?.bio || "",
        image:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          "",
      })
    }

    loadProfile()
  }, [router])

  const handleChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  // ✅ IMAGE UPLOAD (COMPRESSED)
  const handleImageUpload = (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event: any) => {
      const img = new Image()
      img.src = event.target.result

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        const MAX_WIDTH = 200
        const scale = MAX_WIDTH / img.width

        canvas.width = MAX_WIDTH
        canvas.height = img.height * scale

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

        const compressed = canvas.toDataURL("image/jpeg", 0.6)

        setProfile((prev) => ({
          ...prev,
          image: compressed,
        }))
      }
    }

    reader.readAsDataURL(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // ✅ SAVE (AUTH + DB SYNC)
  const handleSave = async () => {
    // 🔥 1. UPDATE AUTH (MOST IMPORTANT)
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: profile.name,
        avatar_url: profile.image,
        bio: profile.bio,
      },
    })

    if (authError) {
      alert("Error updating profile")
      return
    }

    // 🔥 2. OPTIONAL: UPDATE DB (for future use)
    await supabase.from("users").upsert({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      avatar_url: profile.image,
    })

    alert("Profile updated successfully!")

    // 🔄 refresh UI
    window.location.reload()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2" style={{ textShadow: '0 0 10px rgba(0, 229, 255, 0.3)' }}>Profile</h1>
        <p className="text-muted-foreground font-medium">Manage your public persona and how others see you on the grid.</p>
      </div>

      <div className="card-premium p-8 max-w-2xl space-y-6">

        {/* IMAGE */}
        <div className="flex items-center gap-6 pb-4 border-b border-border">
          <div className="h-24 w-24 rounded-full bg-[#040914] border-4 border-primary/30 overflow-hidden shadow-soft flex items-center justify-center shrink-0">
            {profile.image ? (
              <img
                src={profile.image}
                alt="profile"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-primary/50 font-bold text-2xl">{profile.name[0]?.toUpperCase() || "?"}</span>
            )}
          </div>

          <div>
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all rounded-lg font-medium text-sm shadow-sm"
            >
              Upload Photo
            </button>
            <p className="text-xs text-muted-foreground mt-2">Recommended: Square format, max 2MB.</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* NAME */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Grid Handle"
            value={profile.name}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-[#040914] px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-all"
          />
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Email Address</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="flex h-10 w-full rounded-md border border-input bg-[#0A1128] px-3 py-2 text-sm text-muted-foreground cursor-not-allowed opacity-70"
          />
        </div>

        {/* BIO */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Bio</label>
          <textarea
            name="bio"
            placeholder="Tell the network about yourself..."
            value={profile.bio}
            onChange={handleChange}
            rows={4}
            className="flex w-full rounded-md border border-input bg-[#040914] px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-all resize-none"
          />
        </div>

        {/* SAVE */}
        <div className="pt-4 mt-4 border-t border-border">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-2.5 gradient-primary text-black font-extrabold rounded-md shadow-soft shadow-primary/20 hover:shadow-primary/40 transition-all border-0 tracking-wide"
          >
            Save Profile
          </button>
        </div>

      </div>
    </div>
  )
}