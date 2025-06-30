// user-columns.js
import { ArrowUpDown, MoreHorizontal, User, Mail, Calendar, MapPin, Phone, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function userColumns({ onEditClick, onToggleStatus }) {
  return [
    {
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Usuario
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              {user.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt={user.firstName} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {user.email}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => {
        const role = row.getValue("role")
        const roleLabels = {
          'CANDIDATE': 'Candidato',
          'RECRUITER': 'Reclutador',
          'GRADCONNECT': 'Admin'
        }
        return (
          <div className="capitalize">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              role === 'GRADCONNECT' ? 'bg-red-100 text-red-800' :
              role === 'RECRUITER' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {roleLabels[role] || role}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Ubicación
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const location = row.getValue("location")
        return (
          <div className="text-sm flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
            {location || 'No especificada'}
          </div>
        )
      },
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => {
        const phone = row.getValue("phone")
        return (
          <div className="text-sm flex items-center">
            <Phone className="w-3 h-3 mr-1 text-gray-400" />
            {phone || 'No especificado'}
          </div>
        )
      },
    },
    {
      accessorKey: "linkedinUrl",
      header: "LinkedIn",
      cell: ({ row }) => {
        const linkedinUrl = row.getValue("linkedinUrl")
        return (
          <div className="text-sm">
            {linkedinUrl ? (
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Linkedin className="w-3 h-3 mr-1" />
                Ver perfil
              </a>
            ) : (
              <span className="text-gray-400">No disponible</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "registrationDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Fecha de registro
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("registrationDate"))
        return <div className="text-sm">{date.toLocaleDateString('es-ES')}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <div className="capitalize">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {status ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        const handleToggleClick = () => {
          const action = user.status ? "desactivar" : "activar"
          if (window.confirm(`¿Estás seguro que deseas ${action} al usuario ${user.firstName} ${user.lastName}?`)) {
            onToggleStatus?.(user)
          }
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEditClick?.(user)}>
                Editar usuario
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={handleToggleClick}
              >
                {user.status ? "Desactivar" : "Activar"} usuario
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ]
}
