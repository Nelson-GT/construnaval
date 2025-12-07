# Construnaval - Sistema de Gestión Naval

Sistema de gestión para empresa de desguace naval con control de producción, inventario, ventas y trabajadores.

## Configuración de Base de Datos

### Requisitos Previos
- MySQL instalado localmente
- Node.js 18+ instalado

### Paso 1: Crear la Base de Datos

Ejecuta el script SQL desde la carpeta `scripts`:

\`\`\`bash
mysql -u root -p < scripts/init-database.sql
\`\`\`

O desde MySQL Workbench/phpMyAdmin, ejecuta el contenido del archivo `scripts/init-database.sql`.

### Paso 2: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=construnaval
\`\`\`

### Paso 3: Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### Paso 4: Ejecutar la Aplicación

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## Módulos del Sistema

### Módulo de Producción
- Registro de barcos con código único
- **Sistema de semanas manual**: Crea semanas de trabajo (7 días) y asigna personal
- Control de materiales consumidos por semana (oxígeno, propano, etc.)
- Registro de materiales obtenidos (acero, cobre, etc.)
- Historial completo por barco organizado por semanas
- **Descuento automático de inventario** al registrar consumos

### Módulo de Inventario
- Control de stock de consumibles
- Gestión de EPIs y herramientas
- Alertas de stock mínimo
- Búsqueda y edición de materiales
- Integración con módulo de producción para descuentos automáticos

### Módulo de Ventas
- Registro de salidas de gandolas
- Guías de despacho
- Control de compradores y destinos
- Búsqueda y edición de salidas

### Módulo de Trabajadores
- Gestión de personal
- Información de contacto y salarios
- Historial de asignaciones por semana
- Búsqueda y edición de trabajadores

## Características Principales

### Sistema de Semanas
- **Creación manual**: El operador define la fecha de inicio y el sistema calcula automáticamente 7 días
- **Asignación de personal**: Selecciona trabajadores al crear cada semana
- **Registro de consumos**: Añade materiales consumidos con fecha y cantidad
- **Descuento automático**: El stock se reduce automáticamente del inventario
- **Organización por tipo**: Los consumos se agrupan por tipo de material (Consumibles, EPIs, etc.)

### Funcionalidades CRUD Completas
- ✅ Crear, leer, actualizar registros en todos los módulos
- ✅ Búsqueda en tiempo real en todas las tablas
- ✅ Validación de datos y stock antes de operaciones
- ✅ Interfaz intuitiva con diálogos modales

## Tecnologías

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Base de Datos**: MySQL con relaciones optimizadas
- **UI Components**: shadcn/ui
- **Data Fetching**: SWR para caché y sincronización

## Notas Importantes

- El sistema usa MySQL local, asegúrate de tener el servicio corriendo
- Los colores corporativos azules están configurados en el tema
- Cada módulo es independiente pero comparte datos relacionados
- **Las semanas se crean manualmente** desde la página de detalle de cada barco
- **Los consumos de materiales se descuentan automáticamente** del inventario
- Solo se pueden registrar materiales que existan en el inventario
