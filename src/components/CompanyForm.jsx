import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function CompanyForm({ company, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    contactNumber: "",
    address: "",
    webSite: "",
    industry: "",
    type: "",
    size: "",
    recruiters: "",
    logo: null,
    logoPreview: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        email: company.email || "",
        contactNumber: company.contactNumber || "",
        address: company.address || "",
        webSite: company.webSite || "",
        industry: company.industry || "",
        type: company.type || "",
        size: company.size || "",
        recruiters: company.recruiters?.map(r => r.email).join(", ") || "",
        logo: null,
        logoPreview: company.logo || null
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file,
        logoPreview: URL.createObjectURL(file)
      }));
      // Clear error when user selects a file
      if (errors.logo) {
        setErrors(prev => ({
          ...prev,
          logo: ""
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.description.trim()) newErrors.description = "La descripción es requerida";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "El número de contacto es requerido";
    if (!formData.address.trim()) newErrors.address = "La dirección es requerida";
    if (!formData.industry) newErrors.industry = "La industria es requerida";
    if (!formData.type) newErrors.type = "El tipo es requerido";
    if (!formData.size) newErrors.size = "El tamaño es requerido";

    if (!company && !formData.logo) newErrors.logo = "El logo es requerido";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor corrija los errores en el formulario");
      return;
    }
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("email", formData.email);
    data.append("contactNumber", formData.contactNumber);
    data.append("address", formData.address);
    data.append("webSite", formData.webSite);
    data.append("industry", formData.industry);
    data.append("type", formData.type);
    data.append("size", formData.size);
    data.append("recruiters", formData.recruiters);
    
    if (formData.logo) {
      data.append("logo", formData.logo);
    }
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la Empresa *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email de la Empresa *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Teléfono de Contacto *</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className={errors.contactNumber ? "border-red-500" : ""}
          />
          {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="webSite">Sitio Web</Label>
          <Input
            id="webSite"
            name="webSite"
            value={formData.webSite}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recruiters">Emails de Reclutadores (Opcional)</Label>
          <Input
            id="recruiters"
            name="recruiters"
            type="email"
            value={formData.recruiters}
            onChange={handleChange}
            placeholder="email1@empresa.com, email2@empresa.com"
            className={errors.recruiters ? "border-red-500" : ""}
          />
          {errors.recruiters && <p className="text-red-500 text-sm">{errors.recruiters}</p>}
          <p className="text-gray-500 text-xs">Separe múltiples emails con comas</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Dirección *</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industria *</Label>
          <Select 
            name="industry" 
            value={formData.industry} 
            onValueChange={(value) => {
              setFormData(prev => ({...prev, industry: value}));
              if (errors.industry) {
                setErrors(prev => ({...prev, industry: ""}));
              }
            }}
          >
            <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccione una industria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technology">Tecnología</SelectItem>
              <SelectItem value="Health">Salud</SelectItem>
              <SelectItem value="Education">Educación</SelectItem>
              <SelectItem value="Finance">Finanzas</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Manufacturing">Manufactura</SelectItem>
              <SelectItem value="Hospitality">Hospitalidad</SelectItem>
              <SelectItem value="Construction">Construcción</SelectItem>
              <SelectItem value="Others">Otros</SelectItem>
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Empresa *</Label>
          <Select 
            name="type" 
            value={formData.type} 
            onValueChange={(value) => {
              setFormData(prev => ({...prev, type: value}));
              if (errors.type) {
                setErrors(prev => ({...prev, type: ""}));
              }
            }}
          >
            <SelectTrigger className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccione un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Startup">Startup</SelectItem>
              <SelectItem value="SME">Pyme</SelectItem>
              <SelectItem value="Corporation">Corporación</SelectItem>
              <SelectItem value="Non-Profit">Sin fines de lucro</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Tamaño de la Empresa *</Label>
          <Select 
            name="size" 
            value={formData.size} 
            onValueChange={(value) => {
              setFormData(prev => ({...prev, size: value}));
              if (errors.size) {
                setErrors(prev => ({...prev, size: ""}));
              }
            }}
          >
            <SelectTrigger className={errors.size ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccione un tamaño" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Small">Pequeña</SelectItem>
              <SelectItem value="Medium">Mediana</SelectItem>
              <SelectItem value="Large">Grande</SelectItem>
            </SelectContent>
          </Select>
          {errors.size && <p className="text-red-500 text-sm">{errors.size}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Logo de la Empresa *</Label>
          <Input
            id="logo"
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={errors.logo ? "border-red-500" : ""}
          />
          {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
          {formData.logoPreview && (
            <div className="mt-2">
              <img 
                src={formData.logoPreview} 
                alt="Vista previa del logo" 
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {company ? "Actualizar Empresa" : "Crear Empresa"}
        </Button>
      </div>
    </form>
  );
}
