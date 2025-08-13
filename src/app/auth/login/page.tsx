
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
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
})

const getStoredUser = (email: string) => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem(`user_${email}`);
    return storedUser ? JSON.parse(storedUser) : null;
}

export default function LoginPage() {
  const { login } = useAppContext()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    
    // Simulate API call and credential validation
    setTimeout(() => {
      const storedUser = getStoredUser(values.email);
      
      if (storedUser && storedUser.password === values.password) {
          const userProfile = {
            name: storedUser.name,
            email: storedUser.email,
            avatar: `https://placehold.co/100x100.png`,
            initials: storedUser.name.substring(0,2).toUpperCase(),
            bio: "Logged in user."
          }
          login(userProfile)
          toast({
            title: "Login Successful!",
            description: "Welcome back!",
          })
      } else {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
        })
      }
      setLoading(false)
    }, 1000)
  }

  const handleGuestLogin = () => {
    login({
        name: "Guest User",
        email: "",
        avatar: "",
        initials: "G",
        bio: "Exploring in Guest Mode."
    });
    toast({
        title: "Logged in as Guest",
        description: "You are browsing as a guest. History and favorites will not be saved."
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="text-right">
                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                    <Link href="/auth/forgot-password">Forgot Password?</Link>
                </Button>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
            </Button>
            
            <div className="relative w-full">
                <Separator className="my-2" />
                <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">OR</p>
            </div>

            <div className="w-full grid grid-cols-2 gap-2">
                <Button variant="outline" disabled>Continue w/ Google</Button>
                <Button variant="outline" disabled>Continue w/ Facebook</Button>
            </div>
            <Button variant="secondary" className="w-full" onClick={handleGuestLogin}>Continue as Guest</Button>

            <p className="text-sm text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Button asChild variant="link" className="p-0 h-auto">
                <Link href="/auth/register">Register</Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
