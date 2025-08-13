
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
})

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    // Simulate API call to send reset link
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${values.email}, you will receive an email with reset instructions.`,
      })
    }, 1000)
  }

  if (submitted) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Check Your Email</CardTitle>
                <CardDescription>
                    A password reset link has been sent to the email address you provided, if it exists in our system.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href="/auth/login">Back to Login</Link>
                </Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
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
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
            </Button>
            <Button asChild variant="link">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
