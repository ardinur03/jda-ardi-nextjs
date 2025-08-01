"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  FolderKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/redux/provider";
import AuthProvider from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { Inter, Manrope } from 'next/font/google';
import { cn } from "@/lib/utils";

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Manrope({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-headline',
});

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/project-request", label: "Project Request", icon: FolderKanban },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

   React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === 'authenticated' && session.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
    }
  }, [status, session, router]);

  const getBreadcrumbItems = () => {
    const pathParts = pathname.split('/').filter(part => part);
    const items = [{ href: '/dashboard', label: 'Dashboard', isCurrent: pathname === '/dashboard' }];
    
    if (pathParts.length > 1) {
        const currentPath = `/${pathParts.join('/')}`;
        const currentLabel = pathParts[pathParts.length - 1]
                                .split('-')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
        
        if (currentPath !== '/dashboard') {
             items.push({ href: currentPath, label: currentLabel, isCurrent: true });
        }
    }
    
    return items;
  }

  const user = session?.user;
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'M';

  if (status === 'loading' || !user) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4 bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }

  return (
     <html lang="en" suppressHydrationWarning>
        <body className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}>
            <AuthProvider>
                <ReduxProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <SidebarProvider>
                            <Sidebar>
                                <SidebarHeader className="p-4">
                                  <Logo />
                                </SidebarHeader>
                                <SidebarContent className="p-2">
                                  <SidebarMenu>
                                      {navItems.map((item) => {
                                          const Icon = item.icon;
                                          return (
                                              <SidebarMenuItem key={item.href}>
                                                  <Link href={item.href}>
                                                      <SidebarMenuButton isActive={pathname === item.href} className="w-full">
                                                          <Icon className="h-5 w-5" />
                                                          <span className="text-base">{item.label}</span>
                                                      </SidebarMenuButton>
                                                  </Link>
                                              </SidebarMenuItem>
                                          )
                                      })}
                                  </SidebarMenu>
                                </SidebarContent>
                            </Sidebar>
                            <SidebarInset>
                                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
                                    <SidebarTrigger className="md:hidden">
                                        <LayoutDashboard/>
                                    </SidebarTrigger>
                                    <Breadcrumb items={getBreadcrumbItems()} className="hidden md:flex" />
                                    <div className="relative ml-auto flex-1 md:grow-0">
                                    </div>
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                                        <Avatar>
                                            <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                                            <AvatarFallback>{initials}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => signOut()}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </header>
                                <main className="flex-1 p-6">
                                    {children}
                                </main>
                            </SidebarInset>
                        </SidebarProvider>
                        <Toaster />
                    </ThemeProvider>
                </ReduxProvider>
            </AuthProvider>
        </body>
    </html>
  );
}
