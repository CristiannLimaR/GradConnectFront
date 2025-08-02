import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { X } from "lucide-react";

export default function EnterpriseForm({ initialData = {}, onSubmit, onCancel, title = "Formulario de empresa" }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    contactNumber: "",
    address: "",
    socialMediaLinks: "",
    webSite: "",
    size: "",
    industry: "",
    type: "",
    recruiters: [],
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => {
        const isSame =
          prev.name === (initialData.name || "") &&
          prev.description === (initialData.description || "") &&
          prev.email === (initialData.email || "") &&
          prev.contactNumber === (initialData.contactNumber || "") &&
          prev.address === (initialData.address || "") &&
          prev.socialMediaLinks === (initialData.socialMediaLinks || "") &&
          prev.webSite === (initialData.webSite || "") &&
          prev.size === (initialData.size || "") &&
          prev.industry === (initialData.industry || "") &&
          prev.type === (initialData.type || "");

        const recruitersList = Array.isArray(initialData.recruiters)
          ? initialData.recruiters
              .map((r) =>
                typeof r === "string"
                  ? r
                  : typeof r === "object" && r.email
                  ? r.email
                  : ""
              )
              .filter(Boolean)
          : typeof initialData.recruiters === "string"
          ? initialData.recruiters
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        if (isSame) return prev;

        return {
          name: initialData.name || "",
          description: initialData.description || "",
          email: initialData.email || "",
          contactNumber: initialData.contactNumber || "",
          address: initialData.address || "",
          socialMediaLinks: initialData.socialMediaLinks || "",
          webSite: initialData.webSite || "",
          size: initialData.size || "",
          industry: initialData.industry || "",
          type: initialData.type || "",
          recruiters: recruitersList,
        };
      });
    }
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recruiters = Array.isArray(formData.recruiters)
      ? formData.recruiters
      : typeof formData.recruiters === "string"
      ? formData.recruiters
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    await onSubmit({ ...formData, recruiters });
  };

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label>Nombre de la empresa</Label>
          <Input type="text" value={formData.name} onChange={handleChange("name")} />
        </div>
        <div>
          <Label>Descripción</Label>
          <Textarea value={formData.description} onChange={handleChange("description")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={handleChange("email")} />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input type="tel" value={formData.contactNumber} onChange={handleChange("contactNumber")} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tamaño</Label>
            <select className="select select-bordered text-white" value={formData.size} onChange={handleChange("size")}>
              <option value="">Seleccione un tamaño</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
          <div>
            <Label>Tipo</Label>
            <select className="select select-bordered text-white" value={formData.type} onChange={handleChange("type")}>
              <option value="">Seleccione un tipo</option>
              <option value="Startup">Startup</option>
              <option value="SME">SME</option>
              <option value="Corporation">Corporation</option>
              <option value="Non-Profit">Non-Profit</option>
            </select>
          </div>
        </div>
        <div>
          <Label>Ubicación</Label>
          <Input type="text" value={formData.address} onChange={handleChange("address")} />
        </div>
        <div>
          <Label>Redes Sociales</Label>
          <Textarea value={formData.socialMediaLinks} onChange={handleChange("socialMediaLinks")} rows={3} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Sitio web</Label>
            <Input type="url" value={formData.webSite} onChange={handleChange("webSite")} />
          </div>
          <div>
            <Label>Industria</Label>
            <select className="select select-bordered text-white" value={formData.industry} onChange={handleChange("industry")}>
              <option value="">Seleccione una industria</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Construction">Construction</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <Label>Reclutadores (uno por línea)</Label>
            <Textarea
              rows={4}
              value={formData.recruiters.join("\n")}
              onChange={(e) => {
                const text = e.target.value;
                const lines = text
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line !== "");
                setFormData((prev) => ({ ...prev, recruiters: lines }));
              }}
              placeholder="correo1@ejemplo.com&#10;correo2@ejemplo.com"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit">Guardar</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </>
  );
}