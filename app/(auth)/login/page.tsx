"use client"

import { useState } from "react"
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="bg-surface-gray text-foreground min-h-screen flex items-center justify-center">
      {/* Hero background */}
      <div className="bg-login-hero fixed inset-0 z-0" aria-hidden="true" />

      <main className="relative z-10 w-full max-w-[440px] px-4 md:px-0">
        {/* Glass card */}
        <div className="flex flex-col items-center rounded-xl border border-outline-variant/30 bg-background/95 p-10 shadow-2xl backdrop-blur-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0vtodrQ--hqaJfs_34rs2jaW4HAs958YAehHJ7zkRVWfNmhCHZ4ZaT6aLtWlwCBhtK7VIXE0XwwC3KzB816S_dzpQvPsZWwohObvO6cBloP2xbKTNccSidiBk33R4h-24QZ4aMHOE0aCO58HGwxeqRk5jKwuxreeMagP4Pzj4rBvBI8LHfWn0jTEd0g7CYX3LfwqxyFYGVdw243p9r72Me2s2vwmZxfiQ_iNVMfWujbsxSoEz78_619W4ea9WTGjGk_D7UUIIX1c"
              alt="ABC LAB NET Logo"
              className="mx-auto mb-4 h-24 w-24 object-contain transition-transform duration-500 hover:scale-105"
            />
            <h1 className="text-2xl font-semibold tracking-tight text-primary">
              ABC LAB NET
            </h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-on-surface-variant">
              Store Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Email / Username */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-on-surface-variant"
              >
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-transparent bg-surface-input pl-10 focus-visible:ring-primary/20"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium uppercase tracking-wider text-on-surface-variant"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-primary transition-colors hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-transparent bg-surface-input pl-10 pr-12 focus-visible:ring-primary/20"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(!!v)}
              />
              <Label
                htmlFor="remember"
                className="cursor-pointer select-none text-sm text-on-surface-variant"
              >
                Remember this device
              </Label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="group w-full bg-primary py-6 text-base font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary-container active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
              {!loading && (
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 w-full border-t border-outline-variant pt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Internal System Access Only.{" "}
              <a
                href="#"
                className="font-semibold text-primary hover:underline"
              >
                Support Hub
              </a>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-4 text-primary-foreground/80">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">
              Secure AES-256 Login
            </span>
          </div>
          <div className="h-1 w-1 rounded-full bg-primary-foreground/50" />
          <div className="flex items-center gap-1.5">
            <Terminal className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider">
              v2.4.0-Enterprise
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
