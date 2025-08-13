
import * as React from 'react'
import { MainLayout } from '@/components/main-layout'

export default function MainAreaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainLayout>
        <div className="relative p-4 sm:p-6 lg:p-8">{children}</div>
    </MainLayout>
  )
}
