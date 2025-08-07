
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultProfileValues: Partial<ProfileFormValues> = {
  username: "Alex Doe",
  email: "alex.doe@example.com",
}

const notificationsFormSchema = z.object({
    emailNotifications: z.boolean().default(false).optional(),
    pushNotifications: z.boolean().default(false).optional(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

const defaultNotificationValues: Partial<NotificationsFormValues> = {
    emailNotifications: true,
    pushNotifications: false,
}


export default function SettingsPage() {
  const { setTheme } = useTheme()

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultProfileValues,
    mode: "onChange",
  })

  const notificationsForm = useForm<NotificationsFormValues>({
      resolver: zodResolver(notificationsFormSchema),
      defaultValues: defaultNotificationValues,
  })

  function onProfileSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile updated!",
      description: "Your new profile information has been saved.",
    })
  }

  function onNotificationsSubmit(data: NotificationsFormValues) {
    toast({
        title: "Notification settings updated!",
        description: "Your preferences have been saved.",
    })
  }

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <div className="space-y-6">
        <Card>
            <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <FormField
                            control={profileForm.control}
                            name="username"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                <Input placeholder="Your username" {...field} />
                                </FormControl>
                                <FormDescription>
                                This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input type="email" placeholder="Your email" {...field} />
                                </FormControl>
                                <FormDescription>
                                    We will never share your email with anyone else.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Update profile</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
        
        <Card>
            <Form {...notificationsForm}>
                 <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage your notification preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={notificationsForm.control}
                            name="emailNotifications"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                        Email Notifications
                                        </FormLabel>
                                        <FormDescription>
                                        Receive emails about new features, and updates.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={notificationsForm.control}
                            name="pushNotifications"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                        Push Notifications
                                        </FormLabel>
                                        <FormDescription>
                                        Receive push notifications on your devices.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Update notifications</Button>
                    </CardFooter>
                 </form>
            </Form>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Select a theme for the application.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
                 <Button variant="outline" onClick={() => setTheme("light")} className="flex-1">
                    <Sun className="mr-2" /> Light
                </Button>
                <Button variant="outline" onClick={() => setTheme("dark")} className="flex-1">
                    <Moon className="mr-2" /> Dark
                </Button>
                <Button variant="outline" onClick={() => setTheme("system")} className="flex-1">
                    <Monitor className="mr-2" /> System
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
