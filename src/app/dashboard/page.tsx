"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

export default function MemberDashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  const user = session.user;
  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();


  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Member Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard, {user.name}!</p>
      </div>
       <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-3xl font-bold">{user.name} (Member)</CardTitle>
                    <CardDescription>This is your personal dashboard area.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            </CardContent>
        </Card>
    </>
  );
}
