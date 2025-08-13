
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
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export default function RegisterPage() {
  const { login } = useAppContext()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    // Simulate API call for registration
    setTimeout(() => {
      // In a real app, you would create the user in your database.
      // Here we'll just log them in immediately.
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
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
