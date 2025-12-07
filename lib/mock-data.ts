// Mock data para desarrollo - basado en la estructura de la base de datos MySQL

export interface Barco {
  id_barco: number
  codigo_humano: string
  nombre: string
  fecha_ingreso: string
  tonelaje_inicial: number | null
  estado: "Activo" | "Desguazado" | "Pausado"
  fecha_modificacion: string
}

export interface Trabajador {
  id_trabajador: number
  cedula: string
  nombre: string
  apellido: string
  correo: string | null
  telefono: string | null
  direccion: string | null
  puesto: string
  salario: number
  fecha_contratacion: string
}

export interface InventarioMaterial {
  id_material: number
  nombre_material: string
  tipo_material: "Consumible Producción" | "EPI" | "Suministro"
  unidad_medida: string
  stock_actual: number
  stock_minimo: number
  fecha_ultima_actualizacion: string
}

export interface MaterialConsumido {
  id_consumo: number
  id_barco: number
  id_material: number
  fecha_registro: string
  cantidad_consumida: number
  unidad_medida: string
}

export interface MaterialObtenido {
  id_obtencion: number
  id_barco: number
  nombre_material: string
  fecha_registro: string
  cantidad_obtenida: number
  unidad_medida: string
}

export interface BarcoPersonal {
  id_asignacion: number
  id_barco: number
  id_trabajador: number
  fecha_inicio: string
  fecha_fin: string | null
}

export interface VentaSalida {
  id_salida: number
  numero_guia: string
  fecha_salida: string
  nombre_material: string
  cantidad_material: number
  unidad_medida: string
  nombre_comprador: string
  destino_ubicacion: string
  placa_gandola: string | null
}

// Datos mock
export const barcosData: Barco[] = [
  {
    id_barco: 1,
    codigo_humano: "BRC-001",
    nombre: "Carguero Atlántico",
    fecha_ingreso: "2024-01-15",
    tonelaje_inicial: 5000,
    estado: "Activo",
    fecha_modificacion: "2025-01-10",
  },
  {
    id_barco: 2,
    codigo_humano: "BRC-002",
    nombre: "Petrolero del Norte",
    fecha_ingreso: "2024-03-20",
    tonelaje_inicial: 8500,
    estado: "Activo",
    fecha_modificacion: "2025-01-12",
  },
  {
    id_barco: 3,
    codigo_humano: "BRC-003",
    nombre: "Buque Mercante",
    fecha_ingreso: "2023-11-05",
    tonelaje_inicial: 3200,
    estado: "Desguazado",
    fecha_modificacion: "2024-12-20",
  },
]

export const trabajadoresData: Trabajador[] = [
  {
    id_trabajador: 1,
    cedula: "V-12345678",
    nombre: "Carlos",
    apellido: "Rodríguez",
    correo: "carlos.rodriguez@construnaval.com",
    telefono: "+58 412-1234567",
    direccion: "Av. Principal, Puerto La Cruz",
    puesto: "Supervisor de Desguace",
    salario: 1500.0,
    fecha_contratacion: "2020-05-10",
  },
  {
    id_trabajador: 2,
    cedula: "V-23456789",
    nombre: "María",
    apellido: "González",
    correo: "maria.gonzalez@construnaval.com",
    telefono: "+58 424-2345678",
    direccion: "Calle 5, Barcelona",
    puesto: "Operador de Corte",
    salario: 1200.0,
    fecha_contratacion: "2021-03-15",
  },
  {
    id_trabajador: 3,
    cedula: "V-34567890",
    nombre: "José",
    apellido: "Martínez",
    correo: "jose.martinez@construnaval.com",
    telefono: "+58 414-3456789",
    direccion: "Urbanización El Puerto, Lechería",
    puesto: "Soldador",
    salario: 1300.0,
    fecha_contratacion: "2019-08-20",
  },
  {
    id_trabajador: 4,
    cedula: "V-45678901",
    nombre: "Ana",
    apellido: "López",
    correo: "ana.lopez@construnaval.com",
    telefono: "+58 426-4567890",
    direccion: "Sector Industrial, Puerto La Cruz",
    puesto: "Técnico de Seguridad",
    salario: 1400.0,
    fecha_contratacion: "2022-01-10",
  },
]

export const inventarioMaterialesData: InventarioMaterial[] = [
  {
    id_material: 1,
    nombre_material: "Oxígeno Industrial",
    tipo_material: "Consumible Producción",
    unidad_medida: "m³",
    stock_actual: 450.0,
    stock_minimo: 100.0,
    fecha_ultima_actualizacion: "2025-01-13",
  },
  {
    id_material: 2,
    nombre_material: "Propano",
    tipo_material: "Consumible Producción",
    unidad_medida: "L",
    stock_actual: 320.0,
    stock_minimo: 80.0,
    fecha_ultima_actualizacion: "2025-01-13",
  },
  {
    id_material: 3,
    nombre_material: "Guantes de Seguridad",
    tipo_material: "EPI",
    unidad_medida: "Par",
    stock_actual: 150.0,
    stock_minimo: 50.0,
    fecha_ultima_actualizacion: "2025-01-12",
  },
  {
    id_material: 4,
    nombre_material: "Cascos de Protección",
    tipo_material: "EPI",
    unidad_medida: "Unidad",
    stock_actual: 45.0,
    stock_minimo: 20.0,
    fecha_ultima_actualizacion: "2025-01-10",
  },
  {
    id_material: 5,
    nombre_material: "Discos de Corte",
    tipo_material: "Consumible Producción",
    unidad_medida: "Unidad",
    stock_actual: 200.0,
    stock_minimo: 50.0,
    fecha_ultima_actualizacion: "2025-01-13",
  },
]

export const materialesConsumidosData: MaterialConsumido[] = [
  {
    id_consumo: 1,
    id_barco: 1,
    id_material: 1,
    fecha_registro: "2025-01-10",
    cantidad_consumida: 25.5,
    unidad_medida: "m³",
  },
  {
    id_consumo: 2,
    id_barco: 1,
    id_material: 2,
    fecha_registro: "2025-01-10",
    cantidad_consumida: 18.0,
    unidad_medida: "L",
  },
  {
    id_consumo: 3,
    id_barco: 2,
    id_material: 1,
    fecha_registro: "2025-01-12",
    cantidad_consumida: 32.0,
    unidad_medida: "m³",
  },
  {
    id_consumo: 4,
    id_barco: 2,
    id_material: 5,
    fecha_registro: "2025-01-12",
    cantidad_consumida: 15.0,
    unidad_medida: "Unidad",
  },
]

export const materialesObtenidosData: MaterialObtenido[] = [
  {
    id_obtencion: 1,
    id_barco: 1,
    nombre_material: "Acero Naval",
    fecha_registro: "2025-01-10",
    cantidad_obtenida: 1250.0,
    unidad_medida: "Kg",
  },
  {
    id_obtencion: 2,
    id_barco: 1,
    nombre_material: "Cobre",
    fecha_registro: "2025-01-10",
    cantidad_obtenida: 85.5,
    unidad_medida: "Kg",
  },
  {
    id_obtencion: 3,
    id_barco: 2,
    nombre_material: "Acero Naval",
    fecha_registro: "2025-01-12",
    cantidad_obtenida: 2100.0,
    unidad_medida: "Kg",
  },
  {
    id_obtencion: 4,
    id_barco: 2,
    nombre_material: "Aluminio",
    fecha_registro: "2025-01-12",
    cantidad_obtenida: 320.0,
    unidad_medida: "Kg",
  },
  {
    id_obtencion: 5,
    id_barco: 3,
    nombre_material: "Acero Naval",
    fecha_registro: "2024-12-15",
    cantidad_obtenida: 1800.0,
    unidad_medida: "Kg",
  },
]

export const barcoPersonalData: BarcoPersonal[] = [
  {
    id_asignacion: 1,
    id_barco: 1,
    id_trabajador: 1,
    fecha_inicio: "2024-01-15",
    fecha_fin: null,
  },
  {
    id_asignacion: 2,
    id_barco: 1,
    id_trabajador: 2,
    fecha_inicio: "2024-01-15",
    fecha_fin: null,
  },
  {
    id_asignacion: 3,
    id_barco: 2,
    id_trabajador: 3,
    fecha_inicio: "2024-03-20",
    fecha_fin: null,
  },
  {
    id_asignacion: 4,
    id_barco: 2,
    id_trabajador: 4,
    fecha_inicio: "2024-03-20",
    fecha_fin: null,
  },
  {
    id_asignacion: 5,
    id_barco: 3,
    id_trabajador: 1,
    fecha_inicio: "2023-11-05",
    fecha_fin: "2024-12-20",
  },
]

export const ventasSalidasData: VentaSalida[] = [
  {
    id_salida: 1,
    numero_guia: "GU-2025-001",
    fecha_salida: "2025-01-11T10:30:00",
    nombre_material: "Acero Naval",
    cantidad_material: 5000.0,
    unidad_medida: "Kg",
    nombre_comprador: "Siderúrgica del Este C.A.",
    destino_ubicacion: "Zona Industrial, Valencia",
    placa_gandola: "ABC-123",
  },
  {
    id_salida: 2,
    numero_guia: "GU-2025-002",
    fecha_salida: "2025-01-12T14:15:00",
    nombre_material: "Cobre",
    cantidad_material: 250.0,
    unidad_medida: "Kg",
    nombre_comprador: "Metales Reciclados S.A.",
    destino_ubicacion: "Av. Industrial, Maracay",
    placa_gandola: "DEF-456",
  },
  {
    id_salida: 3,
    numero_guia: "GU-2025-003",
    fecha_salida: "2025-01-13T09:00:00",
    nombre_material: "Aluminio",
    cantidad_material: 800.0,
    unidad_medida: "Kg",
    nombre_comprador: "Aluminio Industrial C.A.",
    destino_ubicacion: "Zona Franca, Puerto Cabello",
    placa_gandola: "GHI-789",
  },
]
