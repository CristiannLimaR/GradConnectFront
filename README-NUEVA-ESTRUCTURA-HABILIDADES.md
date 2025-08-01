# Nueva Estructura de Habilidades - Frontend

## Resumen de Cambios

La implementación del frontend ha sido actualizada para trabajar con la nueva estructura de habilidades donde:

1. **Habilidades Globales**: Todas las habilidades están en la colección `skills` con categorías
2. **Habilidades de Usuario**: Los usuarios tienen un array `skills` que referencia habilidades globales con su nivel personal
3. **Autocompletado**: Búsqueda en tiempo real de habilidades globales
4. **Gestión Administrativa**: Panel para administradores para gestionar habilidades globales

## Componentes Principales

### 1. SkillSelector (`/components/SkillSelector.jsx`)

Componente reutilizable para seleccionar habilidades con autocompletado.

**Características:**
- Búsqueda en tiempo real con debounce
- Filtrado de habilidades ya seleccionadas
- Selección de nivel (Principiante, Intermedio, Avanzado)
- Interfaz intuitiva con dropdown
- Manejo de estados de carga

**Props:**
```javascript
{
  userId: string,                    // ID del usuario
  onSkillAdded: (skill) => void,    // Callback cuando se agrega habilidad
  onSkillRemoved: (skill) => void,  // Callback cuando se elimina habilidad
  selectedSkills: Array,            // Habilidades ya seleccionadas
  className: string                 // Clases CSS adicionales
}
```

**Uso:**
```javascript
<SkillSelector
  userId={user._id}
  selectedSkills={userSkills}
  onSkillAdded={handleSkillAdded}
  onSkillRemoved={handleSkillRemoved}
/>
```

### 2. SkillsSection (`/components/UserProfile/SkillsSection.jsx`)

Componente para mostrar y gestionar habilidades del usuario en su perfil.

**Características:**
- Vista de habilidades con información completa
- Modal para editar habilidades usando SkillSelector
- Resumen de habilidades por nivel
- Estados de carga y error
- Integración con el store de autenticación

**Funcionalidades:**
- Carga automática de habilidades del usuario
- Actualización en tiempo real del store
- Visualización con badges de categoría y nivel
- Estadísticas de habilidades

### 3. AdminSkillManager (`/components/AdminSkillManager.jsx`)

Panel administrativo para gestionar habilidades globales.

**Características:**
- CRUD completo de habilidades globales
- Filtros por categoría y búsqueda
- Importación masiva de habilidades via JSON
- Estadísticas de habilidades
- Interfaz intuitiva para administradores

**Funcionalidades:**
- Crear nuevas habilidades globales
- Editar habilidades existentes
- Eliminar habilidades
- Importar habilidades en lote
- Filtros y búsqueda avanzada
- Estadísticas detalladas

## Hooks Actualizados

### useSkills (`/shared/hooks/useSkills.js`)

Hook actualizado con todas las funciones necesarias para la nueva estructura.

**Funciones Disponibles:**

#### Para Usuarios:
- `fetchUserSkills(userId)` - Obtener habilidades de un usuario
- `addSkillToUser(userId, skillData)` - Agregar habilidad a usuario
- `updateUserSkillLevel(userId, skillId, skillData)` - Actualizar nivel de habilidad
- `removeSkillFromUser(userId, skillId)` - Eliminar habilidad de usuario
- `searchSkills(query, category)` - Buscar habilidades globales

#### Para Administradores:
- `fetchAllGlobalSkills()` - Obtener todas las habilidades globales
- `fetchSkillsByCategory(category)` - Obtener habilidades por categoría
- `fetchGlobalSkillById(skillId)` - Obtener habilidad por ID
- `createSkill(skillData)` - Crear habilidad global
- `updateSkill(skillId, skillData)` - Actualizar habilidad global
- `removeSkill(skillId)` - Eliminar habilidad global
- `importSkills(skillsData)` - Importar habilidades en lote

## API Actualizada

### Funciones de API (`/service/api.js`)

Todas las funciones han sido actualizadas para trabajar con la nueva estructura:

#### Rutas de Usuario:
- `getUserSkills(userId)` - GET `/users/:id/skills`
- `addUserSkill(userId, skillData)` - POST `/users/:id/skills`
- `updateUserSkill(userId, skillId, skillData)` - PUT `/users/:id/skills/:skillId`
- `deleteUserSkill(userId, skillId)` - DELETE `/users/:id/skills/:skillId`
- `searchGlobalSkills(query, category)` - GET `/users/search-skills`

#### Rutas de Skills Globales:
- `getAllGlobalSkills()` - GET `/skills/global`
- `getSkillsByCategory(category)` - GET `/skills/category/:category`
- `getGlobalSkillById(skillId)` - GET `/skills/:skillId`
- `createGlobalSkill(skillData)` - POST `/skills/global`
- `updateGlobalSkill(skillId, skillData)` - PUT `/skills/:skillId`
- `deleteGlobalSkill(skillId)` - DELETE `/skills/:skillId`
- `bulkImportSkills(skillsData)` - POST `/skills/bulk-import`

## Estructura de Datos

### Habilidad Global (Skill)
```javascript
{
  _id: ObjectId,
  nameSkill: String,        // Nombre único de la habilidad
  levelSkill: String,       // BEGINNER, INTERMEDIATE, ADVANCED
  category: String,         // TECHNICAL, ARCHITECTURE, FINANCE, SALES, HEALTH, OTHER
  status: Boolean,          // true/false
  createdAt: Date,
  updatedAt: Date
}
```

### Habilidad de Usuario (UserSkill)
```javascript
{
  _id: ObjectId,
  skillId: {               // Referencia poblada a la habilidad global
    _id: ObjectId,
    nameSkill: String,
    levelSkill: String,
    category: String
  },
  levelSkill: String,       // Nivel personal del usuario
  addedAt: Date            // Fecha cuando se agregó
}
```

## Categorías Disponibles

- `TECHNICAL` - Habilidades técnicas (programación, herramientas)
- `ARCHITECTURE` - Habilidades de arquitectura y diseño
- `FINANCE` - Habilidades financieras y contables
- `SALES` - Habilidades de ventas y CRM
- `HEALTH` - Habilidades del sector salud
- `OTHER` - Otras habilidades

## Niveles de Habilidad

- `BEGINNER` - Principiante
- `INTERMEDIATE` - Intermedio
- `ADVANCED` - Avanzado

## Ejemplos de Uso

### 1. Agregar Habilidad a Usuario
```javascript
const { addSkillToUser } = useSkills();

const handleAddSkill = async () => {
  const skillData = {
    skillId: "507f1f77bcf86cd799439011",
    levelSkill: "INTERMEDIATE"
  };
  
  const result = await addSkillToUser(userId, skillData);
  if (result) {
    console.log('Habilidad agregada:', result);
  }
};
```

### 2. Buscar Habilidades Globales
```javascript
const { searchSkills } = useSkills();

const handleSearch = async () => {
  const results = await searchSkills('javascript', 'TECHNICAL');
  console.log('Resultados:', results);
};
```

### 3. Cargar Habilidades de Usuario
```javascript
const { fetchUserSkills } = useSkills();

const loadUserSkills = async () => {
  const skills = await fetchUserSkills(userId);
  if (skills) {
    setUserSkills(skills);
  }
};
```

## Integración con el Store

El componente `SkillsSection` actualiza automáticamente el store de autenticación cuando se modifican las habilidades:

```javascript
const setAuthUser = useAuthStore((state) => state.updateUser);

const handleSkillAdded = (newSkill) => {
  setUserSkills(prev => [...prev, newSkill]);
  setAuthUser({ ...user, skills: [...userSkills, newSkill] });
};
```

## Características de UX

### 1. Autocompletado Inteligente
- Búsqueda en tiempo real con debounce de 300ms
- Filtrado automático de habilidades ya seleccionadas
- Dropdown con información de categoría y nivel por defecto

### 2. Estados de Carga
- Indicadores visuales durante operaciones
- Mensajes de error y éxito con toast
- Estados deshabilitados durante operaciones

### 3. Validaciones
- Validación de campos requeridos
- Verificación de formato JSON para importación
- Confirmación para operaciones destructivas

### 4. Responsive Design
- Interfaz adaptativa para móviles y desktop
- Modales con scroll para contenido largo
- Grid layouts responsivos

## Migración

Para migrar desde la estructura anterior:

1. **Actualizar imports** en componentes que usen habilidades
2. **Reemplazar funciones** del hook useSkills
3. **Actualizar estructura de datos** en el store
4. **Modificar componentes** para usar la nueva estructura
5. **Probar funcionalidad** de búsqueda y gestión

## Notas Importantes

- Todas las rutas requieren autenticación JWT
- Las operaciones de administración requieren rol de admin
- Los usuarios pueden tener diferentes niveles para la misma habilidad global
- Las habilidades globales son únicas por `nameSkill`
- El populate automático incluye información completa de la habilidad global 