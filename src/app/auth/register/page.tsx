
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { useAppContext } from "@/components/app-provider"
import { useToast } from "@/hooks/use-toast"
import { useState, useMemo } from "react"
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  humanVerification: z.boolean().refine(val => val === true, { message: "Please verify you are human." }),
})

const getStoredUser = (email: string) => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem(`user_${email}`);
    return storedUser ? JSON.parse(storedUser) : null;
}

const storeUser = (values: z.infer<typeof formSchema>) => {
    if (typeof window === 'undefined') return;
    const { name, email, password } = values;
    localStorage.setItem(`user_${email}`, JSON.stringify({ name, email, password }));
}

const PasswordStrengthIndicator = ({ password = "" }) => {
    const strength = useMemo(() => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        return score;
    }, [password]);

    const strengthLabel = ["", "Very Weak", "Weak", "Medium", "Strong", "Very Strong"][strength];
    const strengthColor = [
        "bg-transparent",
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-400",
        "bg-green-500"
    ][strength];

    const checks = [
        { label: "At least 8 characters", valid: password.length >= 8 },
        { label: "Contains a lowercase letter", valid: /[a-z]/.test(password) },
        { label: "Contains an uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "Contains a number", valid: /\d/.test(password) },
        { label: "Contains a special character", valid: /[^a-zA-Z0-9]/.test(password) },
    ]

    return (
        <div className="space-y-2">
            <Progress value={strength * 20} className={cn("h-2 transition-all", strengthColor)} />
            <p className="text-sm font-semibold">{strengthLabel}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {checks.map(check => (
                    <div key={check.label} className="flex items-center text-xs gap-2">
                        {check.valid ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                        <span className={cn(check.valid ? "text-foreground" : "text-muted-foreground")}>{check.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function RegisterPage() {
  const { login } = useAppContext()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      humanVerification: false,
    },
    mode: "onChange",
  })
  
  const password = form.watch("password");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    setTimeout(() => {
      // Check if user already exists
      if (getStoredUser(values.email)) {
          toast({
              variant: "destructive",
              title: "Registration Failed",
              description: "An account with this email already exists. Please log in.",
          });
          setLoading(false);
          return;
      }

      // Store user details in localStorage
      storeUser(values);

      const userProfile = {
        name: values.name,
        email: values.email,
        avatar: `https://placehold.co/100x100.png`,
        initials: values.name.substring(0,2).toUpperCase(),
        bio: "Newly registered user."
      }
      login(userProfile)
      toast({
        title: "Registration Successful!",
        description: "Welcome to VocalForge!",
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Join VocalForge to start creating unique voices.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                   <FormControl>
                    <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                        <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <PasswordStrengthIndicator password={password} />

             <FormField
              control={form.control}
              name="humanVerification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Verify you are human
                    </FormLabel>
                  </div>
                   <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button asChild variant="link" className="p-0 h-auto">
                <Link href="/auth/login">Log In</Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

    