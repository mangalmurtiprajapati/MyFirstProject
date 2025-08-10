import * as React from 'react'
import { MainLayout } from '@/components/main-layout'

export default function MainAreaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainLayout>
        <div className="relative py-6">{children}</div>
    </MainLayout>
  )
}
