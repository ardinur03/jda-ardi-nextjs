
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

export default function MemberSettingsPage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  
  const [name, setName] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }
      
      // Update the session with new user data
      await update({ user: { name }});
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully. Please logout and login again to apply the changes.",
      });

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and website settings.</p>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </form>
        </CardContent>
       </Card>

       <Card className="mt-8">
        <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Adjust the website's appearance.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle">Light/Dark Mode</Label>
                <ThemeToggle />
            </div>
        </CardContent>
       </Card>
    </>
  );
}
