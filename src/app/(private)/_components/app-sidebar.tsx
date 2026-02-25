'use client';
import { Calendar1Icon, Home, LogOut, Stethoscope, Users2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Agendamentos',
    url: '/agendamentos',
    icon: Calendar1Icon,
  },
  {
    title: 'Médicos',
    url: '/medicos',
    icon: Stethoscope,
  },
  {
    title: 'Pacientes',
    url: '/pacientes',
    icon: Users2Icon,
  },
];

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const session = authClient.useSession();

  const clinicName = session?.data?.user?.clinic?.name;
  const userEmail = session?.data?.user.email;

  async function handleSignOut() {
    await authClient.signOut();
    router.push('/login');
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center border-b border-border p-2 mt-2 relative">
        <Image
          alt="Logo da plataforma Time to Book"
          src="/logo_clinica_3d.webp"
          width={150}
          height={150}
        />
        <SidebarTrigger
          className="absolute -bottom-5 -right-5 hidden sm:flex! items-center justify-center rounded-full size-10"
          variant="default"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2">Menu principal</SidebarGroupLabel>
          <SidebarGroupContent>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center w-full" size="lg">
                  <Avatar className="flex items-center justify-center">
                    <AvatarFallback className="w-6 h-6">
                      <Users2Icon />
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-sm font-medium">{clinicName}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <p className="text-xs text-muted-foreground px-2">{userEmail}</p>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="w-full flex items-center justify-center"
                  onClick={handleSignOut}
                  variant="destructive"
                >
                  <span>Sair</span>
                  <LogOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
