import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, Users, QrCode, ClipboardList, Settings, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function HoverableSidebar({ children }: { children?: React.ReactNode }) {
  const { setOpen } = useSidebar();
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="text-sidebar-foreground"
    >
      {children}
    </Sidebar>
  );
}

export default function ClinicSidebar() {
  const { pathname } = useLocation();
  return (
    <HoverableSidebar>
      <SidebarHeader className="px-2">
        <SidebarGroupLabel className="text-xs text-muted-foreground">
          Navigation
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/clinic"}
                  tooltip="Dashboard"
                >
                  <Link to="/clinic" className="text-muted-foreground">
                    <Home className="text-muted-foreground" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname.startsWith("/clinic/patients") ||
                    pathname.startsWith("/clinic/search")
                  }
                  tooltip="Patients"
                >
                  <Link to="/clinic/patients" className="text-muted-foreground">
                    <Users className="text-muted-foreground" />
                    <span>Patients</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/clinic/scan")}
                  tooltip="Scan QR"
                >
                  <Link to="/clinic/scan" className="text-muted-foreground">
                    <QrCode className="text-muted-foreground" />
                    <span>Scan QR</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/clinic/tests")}
                  tooltip="Tests"
                >
                  <Link to="/clinic/tests" className="text-muted-foreground">
                    <ClipboardList className="text-muted-foreground" />
                    <span>Tests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/clinic/website")}
                  tooltip="Website Builder"
                >
                  <Link to="/clinic/website" className="text-muted-foreground">
                    <Globe className="text-muted-foreground" />
                    <span>Website</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/clinic/settings")}
                  tooltip="Settings"
                >
                  <Link to="/clinic/settings" className="text-muted-foreground">
                    <Settings className="text-muted-foreground" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </HoverableSidebar>
  );
}
