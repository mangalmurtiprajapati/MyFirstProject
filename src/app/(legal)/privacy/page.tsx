"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="space-y-8">
        <Button asChild variant="outline">
            <Link href="/home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
        </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <CardDescription>Last Updated: {date}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-6 text-muted-foreground">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">1. Introduction</h3>
                <p>
                  Welcome to VocalForge. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">2. Collection of Your Information</h3>
                <p>
                  We may collect information about you in a variety of ways. The information we may collect via the Application includes:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Application.
                  </li>
                  <li>
                    <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Application.
                  </li>
                   <li>
                    <strong>Generated Content:</strong> We collect and store the audio files you generate, the text prompts you provide, and any voices you clone or create. This data is essential for the core functionality of the service and to provide you with your history and favorites.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">3. Use of Your Information</h3>
                <p>
                  Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
                </p>
                 <ul className="list-disc space-y-2 pl-6">
                    <li>Create and manage your account.</li>
                    <li>Email you regarding your account or order.</li>
                    <li>Enable user-to-user communications.</li>
                    <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Application.</li>
                    <li>Generate a personal profile about you to make future visits to the Application more personalized.</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">4. Security of Your Information</h3>
                <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">5. Contact Us</h3>
                <p>
                  If you have questions or comments about this Privacy Policy, please contact us at: contact@vocalforge.com
                </p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
