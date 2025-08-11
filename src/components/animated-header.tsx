
"use client"

import React from 'react'
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from '@/lib/utils';
import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { VocalForgeLogo } from './vocal-forge-logo';
import { Button } from './ui/button';
import { User } from 'lucide-react';
import Link from 'next/link';

export function AnimatedHeader() {
  const { toggleSidebar } = useSidebar();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  })

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-sm"
      )}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex items-center gap-2.5">
          <VocalForgeLogo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold">VocalForge</span>
        </div>
        
        <div className="flex items-center md:hidden">
            <SidebarTrigger />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
            </Button>
        </div>
      </div>
    </motion.header>
  )
}
