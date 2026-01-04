-- Script de inicialización de base de datos MySQL para Construnaval
-- Ejecutar este script en tu servidor MySQL local

CREATE DATABASE IF NOT EXISTS construnaval;
USE construnaval;

-- Tabla de Barcos
CREATE TABLE IF NOT EXISTS Barcos (
    id_barco INT AUTO_INCREMENT PRIMARY KEY,
    codigo_humano VARCHAR(50),
    nombre VARCHAR(255) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    tonelaje_inicial DECIMAL(10, 2),
    estado ENUM('Activo', 'Desguazado', 'Pausado') DEFAULT 'Activo',
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Trabajadores
CREATE TABLE IF NOT EXISTS Trabajadores (
    id_trabajador INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT,
    puesto VARCHAR(100) NOT NULL,
    salario DECIMAL(10, 2) NOT NULL,
    fecha_contratacion DATE NOT NULL
);

-- Tabla de Inventario de Materiales
CREATE TABLE IF NOT EXISTS Inventario_Materiales (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    nombre_material VARCHAR(255) NOT NULL,
    tipo_material ENUM('Consumible Producción', 'EPI', 'Suministro') NOT NULL,
    unidad_medida VARCHAR(50) NOT NULL,
    stock_actual DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock_minimo DECIMAL(10, 2) NOT NULL DEFAULT 0,
    fecha_ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Nueva tabla para gestión de semanas por barco
CREATE TABLE IF NOT EXISTS Semanas_Barco (
    id_semana INT AUTO_INCREMENT PRIMARY KEY,
    id_barco INT NOT NULL,
    numero_semana INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_barco) REFERENCES Barcos(id_barco) ON DELETE CASCADE,
    UNIQUE KEY unique_barco_semana (id_barco, numero_semana)
);

-- Nueva tabla para notas asociadas a semanas
CREATE TABLE IF NOT EXISTS Notas_Semana (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    id_semana INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_nota DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_semana) REFERENCES Semanas_Barco(id_semana) ON DELETE CASCADE
);

-- Tabla de Materiales Consumidos ahora relacionada con semanas
CREATE TABLE IF NOT EXISTS Materiales_Consumidos (
    id_consumo INT AUTO_INCREMENT PRIMARY KEY,
    id_semana INT NOT NULL,
    id_material INT NOT NULL,
    fecha_registro DATE NOT NULL,
    cantidad_consumida DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_semana) REFERENCES Semanas_Barco(id_semana) ON DELETE CASCADE,
    FOREIGN KEY (id_material) REFERENCES Inventario_Materiales(id_material) ON DELETE CASCADE
);

-- Tabla de Materiales Obtenidos
CREATE TABLE IF NOT EXISTS Materiales_Obtenidos (
    id_obtencion INT AUTO_INCREMENT PRIMARY KEY,
    id_barco INT NOT NULL,
    nombre_material VARCHAR(255) NOT NULL,
    fecha_registro DATE NOT NULL,
    cantidad_obtenida DECIMAL(10, 2) NOT NULL,
    unidad_medida VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_barco) REFERENCES Barcos(id_barco) ON DELETE CASCADE
);

-- Tabla de Asignación de Personal ahora relacionada con semanas
CREATE TABLE IF NOT EXISTS Semana_Personal (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_semana INT NOT NULL,
    id_trabajador INT NOT NULL,
    FOREIGN KEY (id_semana) REFERENCES Semanas_Barco(id_semana) ON DELETE CASCADE,
    FOREIGN KEY (id_trabajador) REFERENCES Trabajadores(id_trabajador) ON DELETE CASCADE,
    UNIQUE KEY unique_semana_trabajador (id_semana, id_trabajador)
);

-- Tabla de Ventas y Salidas
DROP TABLE IF EXISTS Detalles_Venta;
DROP TABLE IF EXISTS Ventas_Salidas;

CREATE TABLE IF NOT EXISTS Ventas_Salidas (
    id_salida INT AUTO_INCREMENT PRIMARY KEY,
    numero_guia VARCHAR(50) UNIQUE NOT NULL,
    acto_inspeccion VARCHAR(50) NOT NULL,
    codigo_control VARCHAR(50) NOT NULL,
    fecha_salida DATETIME NOT NULL,
    nombre_comprador VARCHAR(255) NOT NULL,
    destino_ubicacion TEXT NOT NULL,
    placa_gandola VARCHAR(20),
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    empresa_solicitante VARCHAR(255),
    rif VARCHAR(20),
    conductor_nombre VARCHAR(255),
    conductor_ci VARCHAR(20),
    tractor_marca VARCHAR(100),
    tractor_modelo VARCHAR(100),
    tractor_color VARCHAR(50),
    tractor_placa VARCHAR(20),
    batea_modelo VARCHAR(100),
    batea_color VARCHAR(50),
    batea_placa VARCHAR(20),
    origen_direccion TEXT,
    destino_direccion TEXT,
    fecha_validez_inicio DATE,
    fecha_validez_fin DATE,
    modo_venta ENUM('From Inventory', 'Direct Sale') DEFAULT 'From Inventory'
);

-- Nueva tabla para line items de ventas (múltiples materiales por venta)
CREATE TABLE IF NOT EXISTS Detalles_Venta (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_salida INT NOT NULL,
    id_material INT NULL,
    cantidad_material DECIMAL(10, 2) NULL,
    descripcion_material TEXT,
    peso DECIMAL(10, 2),
    unidad_medida VARCHAR(50),
    FOREIGN KEY (id_salida) REFERENCES Ventas_Salidas(id_salida) ON DELETE CASCADE,
    FOREIGN KEY (id_material) REFERENCES Inventario_Materiales(id_material) ON DELETE CASCADE
);

-- Nueva tabla para múltiples códigos por barco
CREATE TABLE IF NOT EXISTS Codigos_Barco (
    id_codigo INT AUTO_INCREMENT PRIMARY KEY,
    id_barco INT NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_barco) REFERENCES Barcos(id_barco) ON DELETE CASCADE,
    UNIQUE KEY unique_codigo (codigo)
);

-- Datos de ejemplo
INSERT INTO Barcos (codigo_humano, nombre, fecha_ingreso, tonelaje_inicial, estado) VALUES
('BRC-001', 'Carguero Atlántico', '2024-01-15', 5000.00, 'Activo'),
('BRC-002', 'Petrolero del Norte', '2024-03-20', 8500.00, 'Activo'),
('BRC-003', 'Buque Mercante', '2023-11-05', 3200.00, 'Desguazado');

INSERT INTO Trabajadores (cedula, nombre, apellido, correo, telefono, direccion, puesto, salario, fecha_contratacion) VALUES
('V-12345678', 'Carlos', 'Rodríguez', 'carlos.rodriguez@construnaval.com', '+58 412-1234567', 'Av. Principal, Puerto La Cruz', 'Supervisor de Desguace', 1500.00, '2020-05-10'),
('V-23456789', 'María', 'González', 'maria.gonzalez@construnaval.com', '+58 424-2345678', 'Calle 5, Barcelona', 'Operador de Corte', 1200.00, '2021-03-15'),
('V-34567890', 'José', 'Martínez', 'jose.martinez@construnaval.com', '+58 414-3456789', 'Urbanización El Puerto, Lechería', 'Soldador', 1300.00, '2019-08-20'),
('V-45678901', 'Ana', 'López', 'ana.lopez@construnaval.com', '+58 426-4567890', 'Sector Industrial, Puerto La Cruz', 'Técnico de Seguridad', 1400.00, '2022-01-10');

INSERT INTO Inventario_Materiales (nombre_material, tipo_material, unidad_medida, stock_actual, stock_minimo) VALUES
('Oxígeno Industrial', 'Consumible Producción', 'm³', 450.00, 100.00),
('Propano', 'Consumible Producción', 'L', 320.00, 80.00),
('Guantes de Seguridad', 'EPI', 'Par', 150.00, 50.00),
('Cascos de Protección', 'EPI', 'Unidad', 45.00, 20.00),
('Discos de Corte', 'Consumible Producción', 'Unidad', 200.00, 50.00);

-- Datos de ejemplo para semanas
INSERT INTO Semanas_Barco (id_barco, numero_semana, fecha_inicio, fecha_fin) VALUES
(1, 1, '2024-01-15', '2024-01-21'),
(1, 2, '2024-01-22', '2024-01-28'),
(2, 1, '2024-03-20', '2024-03-26');

-- Datos de ejemplo para consumos por semana
INSERT INTO Materiales_Consumidos (id_semana, id_material, fecha_registro, cantidad_consumida) VALUES
(1, 1, '2024-01-16', 25.50),
(1, 2, '2024-01-17', 18.00),
(2, 1, '2024-01-23', 32.00),
(2, 5, '2024-01-24', 15.00);

-- Datos de ejemplo para personal por semana
INSERT INTO Semana_Personal (id_semana, id_trabajador) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 3),
(3, 4);

INSERT INTO Materiales_Obtenidos (id_barco, nombre_material, fecha_registro, cantidad_obtenida, unidad_medida) VALUES
(1, 'Acero Naval', '2024-01-18', 1250.00, 'Kg'),
(1, 'Cobre', '2024-01-19', 85.50, 'Kg'),
(2, 'Acero Naval', '2024-03-22', 2100.00, 'Kg'),
(2, 'Aluminio', '2024-03-23', 320.00, 'Kg'),
(3, 'Acero Naval', '2024-12-15', 1800.00, 'Kg');

-- Datos de ejemplo para nuevas ventas y salidas
INSERT INTO Ventas_Salidas (numero_guia, acto_inspeccion, codigo_control, fecha_salida, nombre_comprador, destino_ubicacion, placa_gandola, total, empresa_solicitante, rif, conductor_nombre, conductor_ci, tractor_marca, tractor_modelo, tractor_color, tractor_placa, batea_modelo, batea_color, batea_placa, origen_direccion, destino_direccion, fecha_validez_inicio, fecha_validez_fin, modo_venta) VALUES
('GU-2025-001', 'inspec01', 'contr01', '2025-01-11 10:30:00', 'Siderúrgica del Este C.A.', 'Zona Industrial, Valencia', 'ABC-123', 15000.00, 'Empresa X', 'V123456789', 'Juan Pérez', 'V-98765432', 'Ford', 'F-150', 'Rojo', 'XYZ-789', 'Chevrolet', 'Blanco', 'LMN-456', 'Av. Principal, Puerto La Cruz', 'Calle 5, Barcelona', '2025-01-01', '2025-01-31', 'From Inventory'),
('GU-2025-002', 'inspec02', 'contr02', '2025-01-12 14:15:00', 'Metales Reciclados S.A.', 'Av. Industrial, Maracay', 'DEF-456', 8500.00, 'Empresa Y', 'V876543210', 'Ana García', 'V-012345678', 'Toyota', 'Tacoma', 'Negro', 'UVW-012', 'Honda', 'Amarillo', 'QRS-345', 'Urbanización El Puerto, Lechería', 'Sector Industrial, Puerto La Cruz', '2025-01-02', '2025-02-01', 'Direct Sale');

-- Datos de ejemplo para detalles de ventas
INSERT INTO Detalles_Venta (id_salida, id_material, cantidad_material, descripcion_material, peso, unidad_medida) VALUES
(1, 1, 5000.00, 'Oxígeno Industrial para producción', 4500.00, 'm³'),
(1, 2, 250.00, 'Propano para corte', 250.00, 'L'),
(2, NULL, NULL, 'Material adquirido directamente', 1800.00, 'Kg');
