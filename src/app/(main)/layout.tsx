
import * as React from 'react'
import { MainLayout } from '@/components/main-layout'

export default function MainAreaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainLayout>
        <div className="relative py-6 px-4 sm:px-6 lg:px-8">{children}</div>
    </MainLayout>
  )
}
