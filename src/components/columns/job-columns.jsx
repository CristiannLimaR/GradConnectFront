import { ArrowUpDown, MoreHorizontal, Briefcase, Building2, MapPin, Calendar, Euro, Wifi, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const jobColumns = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Oferta
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const job = row.original
      return (
        <div>
          <div className="text-sm font-medium text-gray-900 flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
            {job.title}
          </div>
          <div className="text-sm text-gray-500">
            {job.description?.substring(0, 60)}...
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "company",
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
      const company = row.getValue("company")
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{company}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "salary",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Euro className="mr-2 h-4 w-4" />
          Salario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const salary = row.getValue("salary")
      return (
        <div className="text-sm font-medium">
          €{salary?.toLocaleString('es-ES')}
        </div>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Modalidad",
    cell: ({ row }) => {
      const location = row.getValue("location")
      const locationLabels = {
        'Remoto': 'Remoto',
        'Presencial': 'Presencial',
        'Hibrido': 'Híbrido'
      }
      return (
        <div className="capitalize">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            location === 'Remoto' ? 'bg-green-100 text-green-800' :
            location === 'Presencial' ? 'bg-blue-100 text-blue-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {locationLabels[location] || location}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "modality",
    header: "Tipo",
    cell: ({ row }) => {
      const modality = row.getValue("modality")
      const modalityLabels = {
        'Tiempo Completo': 'Full Time',
        'Medio Tiempo': 'Part Time',
        'Freelance': 'Freelance'
      }
      return (
        <div className="capitalize">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            modality === 'Tiempo Completo' ? 'bg-blue-100 text-blue-800' :
            modality === 'Medio Tiempo' ? 'bg-green-100 text-green-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {modalityLabels[modality] || modality}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "ubication",
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
      const ubication = row.getValue("ubication")
      return (
        <div className="text-sm flex items-center">
          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
          {ubication}
        </div>
      )
    },
  },
  {
    accessorKey: "applications",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Users className="mr-2 h-4 w-4" />
          Aplicaciones
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applications = row.getValue("applications")
      return (
        <div className="text-sm text-center font-medium">
          {applications?.length || 0}
        </div>
      )
    },
  },
  {
    accessorKey: "closingDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Fecha límite
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("closingDate"))
      const today = new Date()
      const isExpired = date < today
      return (
        <div className={`text-sm ${isExpired ? 'text-red-600 font-medium' : ''}`}>
          {date.toLocaleDateString('es-ES')}
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
            status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const job = row.original

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
              onClick={() => navigator.clipboard.writeText(job.id.toString())}
            >
              Copiar ID de oferta
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalles completos</DropdownMenuItem>
            <DropdownMenuItem>Editar oferta</DropdownMenuItem>
            <DropdownMenuItem>Ver aplicaciones ({job.applications?.length || 0})</DropdownMenuItem>
            <DropdownMenuItem>Ver requisitos</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              {job.status ? 'Desactivar' : 'Activar'} oferta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 