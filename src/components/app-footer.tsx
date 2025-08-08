
import Link from "next/link";
import { VocalForgeLogo } from "./vocal-forge-logo";

export function AppFooter() {
    return (
        <footer className="border-t">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <VocalForgeLogo />
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by your AI assistant. The source code is available on GitHub.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/terms" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Terms of Service
                    </Link>
                    <Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}
