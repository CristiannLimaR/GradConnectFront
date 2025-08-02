import { ArrowUpDown, MoreHorizontal, Building2, Mail, MapPin, Globe, User, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export const companyColumns = ({ deleteEnterprise, onViewProfile, onEditCompany }) => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Empresa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{company.name}</div>
            <div className="text-sm text-gray-500">
              {company.description?.substring(0, 50)}...
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "website",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Globe className="mr-2 h-4 w-4" />
          Sitio Web
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const website = row.getValue("website")
      return (
        <div className="text-sm">
          {website ? (
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Globe className="w-3 h-3 mr-1" />
              Visitar sitio
            </a>
          ) : (
            <span className="text-gray-400">No disponible</span>
          )}
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
    accessorKey: "sector",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Briefcase className="mr-2 h-4 w-4" />
          Sector
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const sector = row.getValue("sector")
      return (
        <div className="text-sm">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {sector || 'No especificado'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "adminUser",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <User className="mr-2 h-4 w-4" />
          Administrador
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const adminUser = row.getValue("adminUser")
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {adminUser?.firstName} {adminUser?.lastName}
            </div>
            <div className="text-xs text-gray-500">
              {adminUser?.email}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const email = row.getValue("email")
      return (
        <div className="text-sm flex items-center">
          <Mail className="w-3 h-3 mr-1 text-gray-400" />
          {email}
        </div>
      )
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
            status === 'Activa' ? 'bg-green-100 text-green-800' :
            status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const company = row.original

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(company.id.toString())}
            >
              Copiar ID de empresa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewProfile(company)}>Ver perfil completo</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditCompany(company)}>
          Editar empresa
        </DropdownMenuItem>
            {company.status !== 'Activa' && (
              <DropdownMenuItem className="text-green-600">
                Verificar empresa
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-600"
              onClick={() => deleteEnterprise(company.id)}
            >
              {company.status === 'Inactiva' ? 'Reactivar' : 'Suspender'} empresa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 