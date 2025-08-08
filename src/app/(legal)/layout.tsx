import * as React from 'react'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container relative py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        {children}
      </div>
    </div>
  )
}
