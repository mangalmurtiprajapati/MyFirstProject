
import { VocalForgeLogo } from '@/components/vocal-forge-logo'
import Link from 'next/link'
import * as React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
            <Link href="/home" className="flex items-center gap-2 text-foreground">
                <VocalForgeLogo className="h-8 w-8 text-primary" />
                <span className="text-xl font-semibold">VocalForge</span>
            </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
