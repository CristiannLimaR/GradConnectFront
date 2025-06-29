import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthorization from '../shared/hooks/useAuthorization';

const AccessDenied = ({ requiredRole, currentRole }) => {
  const navigate = useNavigate();
  const { isCandidate, isRecruiter, isAdmin } = useAuthorization();

  const getRedirectPath = () => {
    if (isCandidate()) return '/user-profile';
    if (isRecruiter()) return '/empresa-dashboard';
    if (isAdmin()) return '/admin';
    return '/';
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'CANDIDATE':
        return 'Candidato';
      case 'RECRUITER':
        return 'Reclutador';
      case 'GRADCONNECT':
        return 'Administrador';
      default:
        return role;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Acceso Denegado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center text-yellow-600 mb-4">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Permisos Insuficientes</span>
          </div>
          
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
          
          {requiredRole && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Rol requerido:</span> {getRoleDisplayName(requiredRole)}
              </p>
              {currentRole && (
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Tu rol:</span> {getRoleDisplayName(currentRole)}
                </p>
              )}
            </div>
          )}
          
          <div className="flex flex-col gap-2 pt-4">
            <Button 
              onClick={() => navigate(getRedirectPath())}
              className="w-full"
            >
              Ir a mi página principal
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Volver al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied; 