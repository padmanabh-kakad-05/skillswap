"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ SIGNUP
  const handleSignup = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name, // ✅ important for navbar/sidebar
        },
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    // ✅ INSERT INTO USERS TABLE
    if (data.user) {
      const { error: insertError } = await supabase.from("users").upsert({
        id: data.user.id,
        name: name,
        email: email,
        avatar_url: data.user.user_metadata?.avatar_url || "",
      }, { onConflict: 'id' }) // Handle duplicate rapid inserts gracefully
    }

    // ✅ CHECK FOR EMAIL VERIFICATION REQUIREMENT
    if (data.user && !data.session) {
      alert("Success! Please check your email inbox to verify your account before logging in.")
      router.push("/login")
      return
    }

    router.push("/dashboard")
  }

  // ✅ GOOGLE LOGIN (FIXED)
  const handleGoogle = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setErrorMsg("Google signup failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#040914] relative overflow-hidden p-4">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-secondary/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10 card-premium p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white" style={{ textShadow: '0 0 10px rgba(0, 229, 255, 0.3)' }}>Create Account</h2>
          <p className="text-muted-foreground mt-2">Join the ultimate SkillSwap network</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Full Name</label>
            <Input
              placeholder="Your grid handle"
              className="bg-[#0A1128] border-border text-white focus-visible:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Email</label>
            <Input
              type="email"
              placeholder="name@example.com"
              className="bg-[#0A1128] border-border text-white focus-visible:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Password</label>
            <Input
              type="password"
              placeholder="Minimum 6 characters"
              className="bg-[#0A1128] border-border text-white focus-visible:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="text-destructive text-sm font-medium text-center">{errorMsg}</p>}

          <Button className="w-full gradient-primary text-black font-extrabold shadow-soft" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </Button>

          <div className="text-center text-sm text-muted-foreground py-2 border-b border-border/50 relative">
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 bg-[#0C152B] px-2 text-xs uppercase tracking-widest text-[#00E5FF]">Or</span>
          </div>

          <div className="pt-2">
            <Button type="button" onClick={handleGoogle} className="w-full border-border bg-[#040914] hover:bg-primary/10 hover:text-primary text-white border" disabled={loading}>
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Continue with Google
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <a href="/login" className="text-primary hover:text-secondary transition-colors font-medium">Log in</a>
        </div>
      </div>
    </div>
  )
}