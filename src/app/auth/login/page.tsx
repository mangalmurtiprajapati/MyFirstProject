
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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
})

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
      // In a real app, you'd verify credentials against a backend.
      // Here, we'll use hardcoded values for demonstration.
      if (values.email === "admin@example.com" && values.password === "password123") {
          const userProfile = {
            name: "Admin User",
            email: values.email,
            avatar: `https://placehold.co/100x100.png`,
            initials: "AU",
            bio: "Logged in administrator."
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
            <p className="text-sm text-muted-foreground">
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

    