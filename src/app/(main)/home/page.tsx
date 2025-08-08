import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center p-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Welcome to VocalForge
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Your premier AI-powered solution for voice cloning and generation. Create unique synthetic voices or clone existing ones with unparalleled realism.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/workspace">
              <Mic className="mr-2" />
              Go to Workspace
            </Link>
          </Button>
          <Button asChild variant="link" size="lg">
            <a href="#">Learn more <span aria-hidden="true">→</span></a>
          </Button>
        </div>
      </div>
    </div>
  )
}
