import React from 'react';
import { User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useAuthStore from "../shared/stores/authStore";
import useLogin from "../shared/hooks/useLogin";

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogin();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
              <span className="font-semibold text-gray-900">JobSearch</span>
            </div>
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
                <NavigationMenuItem>
                  <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Find Jobs</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/applied-saved-jobs" className="text-gray-700 hover:text-blue-600 font-medium">Guardados/Aplicados</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/mensajes" className="text-gray-700 hover:text-blue-600 font-medium">Mensajes</Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="p-0 rounded-full w-10 h-10 flex items-center justify-center">
                    <Avatar>
                      {user.profilePhoto ? (
                        <AvatarImage src={user.profilePhoto} alt="Foto de perfil" />
                      ) : (
                        <AvatarFallback>
                          <User className="w-5 h-5 text-gray-600" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/user-profile')}>
                    Ver perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => navigate('/login')}>Iniciar sesión</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 