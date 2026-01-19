import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface TopBarProps {
  userName: string;
}

export function TopBar({ userName }: TopBarProps) {
  const handleLogout = () => {
    console.log("Logout clicked");
    // Lógica de logout aqui
  };

  const handleSettings = () => {
    console.log("Settings clicked");
    // Lógica de settings aqui
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-green-700">
          <span className="font-bold text-xl">SU</span>
          <span className="text-sm hidden md:block">Supply Unlimited</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User className="w-5 h-5" />
          <span className="hidden md:block">{userName}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSettings}
          className="p-2"
        >
          <Settings className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="p-2 text-red-600 hover:text-red-700"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
