"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "./app-sidebar";
import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { logout } from "@/lib/auth/client";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Take main tabs for bottom nav, avoiding disabled ones if possible, 
  // but we only have dashboard right now.
  const bottomNavItems = navigationItems.slice(0, 4); 

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[calc(4rem+env(safe-area-inset-bottom))] bg-card/90 backdrop-blur border-t border-border z-40 pb-[env(safe-area-inset-bottom)] flex items-center justify-around px-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.disabled) {
            return (
              <div 
                key={item.name} 
                className="flex flex-col items-center justify-center w-16 h-14 text-muted-foreground/40"
              >
                <item.icon className="size-5 mb-1" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-14 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="size-5 mb-1" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center justify-center w-16 h-14 transition-colors ${
            isMenuOpen ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Menu className="size-5 mb-1" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>

      {/* Full Screen Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-background animate-in slide-in-from-bottom-full duration-300 flex flex-col pt-16 pb-24 px-6 overflow-y-auto">
          <div className="flex-1 space-y-8 mt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account</h3>
              <div className="space-y-2">
                <Link 
                  href="/settings/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center w-full p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <User className="mr-3 size-5" />
                  Financial Profile
                </Link>
                <Link 
                  href="/settings/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center w-full p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <User className="mr-3 size-5 opacity-0" />
                  Account Settings
                </Link>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => logout()} 
            className="flex items-center justify-center w-full p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 mt-auto"
          >
            <LogOut className="mr-2 size-5" />
            Sign Out
          </button>
        </div>
      )}
    </>
  );
}
