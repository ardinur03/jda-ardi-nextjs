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
  FolderKanban,
  MessageSquareQuote,
  LogOut,
  Loader2,
  User as UserIcon,
  Settings,
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


const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Manage Projects", icon: FolderKanban },
    { href: "/admin/testimonials", label: "Manage Testimonials", icon: MessageSquareQuote },   
    { href: "/admin/users", label: "Manage Users", icon: UserIcon },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
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
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You must be logged in to view this page.",
      });
      router.push("/login");
    } else if (status === 'authenticated' && session.user.role !== 'ADMIN') {
        toast({
            variant: "destructive",
            title: "Access Forbidden",
            description: "You do not have permission to view this page.",
        });
        router.push('/dashboard');
    }
  }, [status, session, router, toast]);

  const getBreadcrumbItems = () => {
    const pathParts = pathname.split('/').filter(part => part);
    const items: {href: string, label: string, isCurrent?: boolean}[] = [{ href: '/admin/dashboard', label: 'Admin' }];

    if (pathParts.length > 1) {
        const currentPath = `/${pathParts.join('/')}`;
        const currentLabel = pathParts[pathParts.length - 1]
                                .split('-')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
        
        if (currentPath !== '/admin/dashboard') {
             items.push({ href: currentPath, label: currentLabel, isCurrent: true });
        } else {
            items[0].isCurrent = true;
        }
    } else {
        items[0].isCurrent = true;
    }

    return items;
  }

  const user = session?.user;
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'A';

  if (status === 'loading' || !user) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="pt-7 items-center">
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-4 mt-4">
          <SidebarMenu>
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href}>
                            <SidebarMenuButton isActive={pathname.startsWith(item.href)} className="w-full">
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 pt-6 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
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
                <DropdownMenuItem asChild><Link href="/dashboard"><UserIcon className="mr-2 h-4 w-4"/> Member Dashboard</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:pt-10">
            {children}
        </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
