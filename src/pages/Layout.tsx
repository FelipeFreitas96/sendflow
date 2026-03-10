import React from "react";
import {
  MessageSquare,
  Link as LinkIcon,
  LogOut,
  Menu as MenuIcon,
  LayoutDashboard,
  Info,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";
import { Button } from "../components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "../components/sheet";
import { Separator } from "../components/separator";
import { cn } from "../lib/utils";

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItems = [
    { text: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { text: "Conexões", icon: LinkIcon, path: "/connections" },
    { text: "Mensagens", icon: MessageSquare, path: "/messages" },
    { text: "Sobre", icon: Info, path: "/about" },
  ];

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col gap-1 p-2">
      {menuItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path === "/connections" &&
            location.pathname.startsWith("/connections"));
        return (
          <Button
            key={item.text}
            variant="ghost"
            className={cn(
              "justify-start gap-4 h-11 px-4",
              isActive
                ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-bold"
                : "text-muted-foreground font-medium",
            )}
            onClick={() => {
              navigate(item.path);
              onItemClick?.();
            }}
          >
            <item.icon size={20} className={isActive ? "text-primary" : ""} />
            {item.text}
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <header className="sm:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-white/10 z-40 flex items-center px-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/5"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[240px] p-0 border-r border-white/10 bg-background"
          >
            <SheetHeader className="p-6 text-left">
              <SheetTitle className="text-primary font-black tracking-widest font-exo">
                SendFlow
              </SheetTitle>
            </SheetHeader>
            <Separator className="bg-white/10" />
            <div className="flex flex-col h-[calc(100vh-80px)]">
              <div className="flex-1">
                <NavItems onItemClick={() => setMobileOpen(false)} />
              </div>
              <div className="p-2 border-t border-white/10">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-4 h-11 px-4 text-muted-foreground"
                  onClick={logout}
                >
                  <LogOut size={20} />
                  Sair
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <span className="ml-4 font-black tracking-widest text-primary font-exo uppercase text-sm">
          SendFlow
        </span>
      </header>

      <aside className="hidden sm:flex flex-col w-[240px] fixed h-screen border-r border-white/10">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-widest text-primary font-exo">
            SendFlow
          </h1>
        </div>
        <Separator className="bg-white/10" />
        <div className="flex-1 overflow-y-auto">
          <NavItems />
        </div>
        <div className="p-2 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 h-11 px-4 text-muted-foreground"
            onClick={logout}
          >
            <LogOut size={20} />
            Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1 sm:ml-[240px] pt-20 p-4 sm:pt-10 sm:p-10 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
