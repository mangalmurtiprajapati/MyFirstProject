"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="space-y-8">
        <div className="flex justify-start">
            <Button asChild variant="outline">
                <Link href="/home">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
          <CardDescription>Last Updated: {date}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-6 text-muted-foreground">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">1. Agreement to Terms</h3>
                <p>
                  By using our application, VocalForge, you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the application. We may modify the Terms at any time, and such modifications shall be effective immediately upon posting of the modified Terms.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">2. Use of the Service</h3>
                <p>
                  VocalForge provides an AI-powered platform for voice cloning and generation. You agree to use the service in compliance with all applicable laws and regulations. You are responsible for all content generated and activities that occur under your account.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">3. User Conduct</h3>
                <p>
                  You agree not to use the service to create any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. You may not use the voices of others without their explicit consent. Misuse of the service may result in termination of your account.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">4. Intellectual Property</h3>
                <p>
                  The service and its original content, features, and functionality are and will remain the exclusive property of VocalForge and its licensors. You retain ownership of the content you create, but you grant us a license to use it to operate and improve the service.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">5. Termination</h3>
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">6. Disclaimer</h3>
                <p>
                    The service is provided on an "AS IS" and "AS AVAILABLE" basis. Use of the service is at your own risk. We do not warrant that the service will be uninterrupted, secure, or error-free.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">7. Contact Us</h3>
                <p>
                  If you have any questions about these Terms, please contact us at: support@vocalforge.com
                </p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
