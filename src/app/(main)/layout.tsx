import * as React from 'react'

export default function MainAreaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="container relative py-6">{children}</div>
}
