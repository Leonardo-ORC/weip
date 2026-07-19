import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { WeipMark } from "@/components/layout/weip-mark";
import { APP_NAV_FOOTER, APP_NAV_SECTIONS } from "@/constants/app-navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Sidebar collapsible="icon" className="border-r border-hairline">
      <div className="flex h-16 items-center gap-2 border-b border-hairline px-4">
        <Link to="/app/dashboard" className="flex items-center text-foreground" aria-label="Home">
          {collapsed ? (
            <span className="grid h-8 w-8 place-items-center rounded-full border border-hairline text-[11px] font-medium">
              W
            </span>
          ) : (
            <WeipMark />
          )}
        </Link>
      </div>

      <SidebarContent className="px-2">
        {APP_NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.title}>
            {!collapsed && section.title ? (
              <SidebarGroupLabel className="px-2 font-mono text-[10px] uppercase tracking-[0.22em]">
                {section.title}
              </SidebarGroupLabel>
            ) : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={cn("gap-3 rounded-lg", active && "bg-secondary text-foreground")}
                      >
                        <Link to={item.to as never}>
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge ? (
                            <span className="ml-auto rounded-full border border-hairline px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                              {item.badge}
                            </span>
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        <SidebarSeparator />
        <SidebarMenu>
          {APP_NAV_FOOTER.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton asChild tooltip={item.label} isActive={isActive(item.to)}>
                <Link to={item.to as never}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
