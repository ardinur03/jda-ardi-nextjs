"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard', isCurrent: true },
  ];

  if (status === "loading") {
    return (
      <main className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center bg-background py-16 sm:py-24">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </main>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
     return (
        <main className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center bg-background py-16 sm:py-24">
            <p>You must be logged in to view this page.</p>
        </main>
     )
  }
  
  const user = session.user;
  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <main className="w-full bg-background py-16 sm:py-24">
         <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.image || ''} alt={user.name || ''} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
                        <CardDescription>Welcome back to your dashboard.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
