-- =====================================================================
-- UNIVERSIDAD MARIANO GÁLVEZ DE GUATEMALA · PROGRAMACIÓN II
-- Examen Final: Reportes en PDF y Excel
-- Base de datos: finalB  (Ferretería)
-- Ejecutar completo en MySQL Workbench (Ctrl + Shift + Enter)
-- =====================================================================

DROP DATABASE IF EXISTS finalB;
CREATE DATABASE finalB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE finalB;

-- ---------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------
CREATE TABLE categoria (
  ID_CATEGORIA INT NOT NULL AUTO_INCREMENT,
  ESTADO       TINYINT(1) DEFAULT 1,
  NOMBRE       VARCHAR(65),
  DESCRIPCION  VARCHAR(65),
  PRIMARY KEY (ID_CATEGORIA)
);

CREATE TABLE articulo (
  ID_ARTICULO  INT NOT NULL AUTO_INCREMENT,
  ESTADO       TINYINT(1) DEFAULT 1,
  NOMBRE       VARCHAR(65),
  MARCA        VARCHAR(65),
  PRECIO       DECIMAL(10,2),
  STOCK        INT,
  ID_CATEGORIA INT,
  PRIMARY KEY (ID_ARTICULO),
  CONSTRAINT FK_ARTICULO_CATEGORIA FOREIGN KEY (ID_CATEGORIA)
    REFERENCES categoria (ID_CATEGORIA)
);

CREATE TABLE cliente (
  ID_CLIENTE     INT NOT NULL AUTO_INCREMENT,
  ESTADO         TINYINT(1) DEFAULT 1,
  NOMBRE         VARCHAR(85),
  APELLIDO       VARCHAR(85),
  NIT            VARCHAR(15),
  TELEFONO       VARCHAR(25),
  FECHA_REGISTRO DATETIME,
  PRIMARY KEY (ID_CLIENTE)
);

CREATE TABLE factura (
  ID_FACTURA     INT NOT NULL AUTO_INCREMENT,
  ESTADO         TINYINT(1) DEFAULT 1,
  FECHA_FACTURA  DATETIME,
  ESTADO_FACTURA TINYINT(1) DEFAULT 0,
  TOTAL          DECIMAL(10,2),
  ID_CLIENTE     INT,
  PRIMARY KEY (ID_FACTURA),
  CONSTRAINT FK_FACTURA_CLIENTE FOREIGN KEY (ID_CLIENTE)
    REFERENCES cliente (ID_CLIENTE)
);

CREATE TABLE factura_detalle (
  ID_FACTURA_DETALLE INT NOT NULL AUTO_INCREMENT,
  CANTIDAD           INT,
  PRECIO_UNITARIO    DECIMAL(10,2),
  SUBTOTAL           DECIMAL(10,2),
  ID_FACTURA         INT,
  ID_ARTICULO        INT,
  PRIMARY KEY (ID_FACTURA_DETALLE),
  CONSTRAINT FK_DETALLE_FACTURA FOREIGN KEY (ID_FACTURA)
    REFERENCES factura (ID_FACTURA),
  CONSTRAINT FK_DETALLE_ARTICULO FOREIGN KEY (ID_ARTICULO)
    REFERENCES articulo (ID_ARTICULO)
);

-- ---------------------------------------------------------------------
-- Datos
-- ---------------------------------------------------------------------

-- Categorías (la 8 está anulada: ESTADO = 0)
INSERT INTO categoria (ESTADO, NOMBRE, DESCRIPCION) VALUES
  (1, 'Herramientas Manuales', 'Martillos, desarmadores, llaves y alicates'),
  (1, 'Herramientas Eléctricas', 'Taladros, pulidoras y sierras eléctricas'),
  (1, 'Plomería', 'Tubos, llaves de paso y accesorios'),
  (1, 'Electricidad', 'Cables, tomacorrientes e iluminación'),
  (1, 'Pinturas', 'Pinturas, brochas y rodillos'),
  (1, 'Tornillería', 'Tornillos, clavos, pernos y anclas'),
  (1, 'Jardinería', 'Mangueras, palas y herramientas de jardín'),
  (0, 'Seguridad Industrial', 'Guantes, cascos y lentes de protección');

-- Artículos (los ids 9 y 25 están anulados: ESTADO = 0)
INSERT INTO articulo (ESTADO, NOMBRE, MARCA, PRECIO, STOCK, ID_CATEGORIA) VALUES
  (1, 'Martillo de Uña 16 oz', 'Truper', 65.00, 40, 1),
  (1, 'Juego de Desarmadores 6 piezas', 'Stanley', 89.50, 25, 1),
  (1, 'Llave Ajustable 10 pulgadas', 'Truper', 72.00, 18, 1),
  (1, 'Alicate Universal 8 pulgadas', 'Pretul', 48.75, 30, 1),
  (1, 'Cinta Métrica 5 m', 'Stanley', 39.00, 55, 1),
  (1, 'Taladro Percutor 1/2', 'Black+Decker', 545.00, 8, 2),
  (1, 'Pulidora Angular 4 1/2', 'DeWalt', 689.00, 5, 2),
  (1, 'Sierra Circular 7 1/4', 'Makita', 1250.00, 3, 2),
  (0, 'Atornillador Inalámbrico', 'Bosch', 799.00, 6, 2),
  (1, 'Tubo PVC 1/2 x 6 m', 'Durman', 32.50, 120, 3),
  (1, 'Llave de Paso 1/2', 'Foset', 58.00, 45, 3),
  (1, 'Codo PVC 90° 1/2', 'Durman', 3.75, 300, 3),
  (1, 'Pegamento PVC 1/4 gal', 'Tangit', 95.00, 22, 3),
  (1, 'Cable THHN #12 (metro)', 'Phelps Dodge', 6.50, 500, 4),
  (1, 'Tomacorriente Doble', 'Leviton', 24.00, 80, 4),
  (1, 'Foco LED 12 W', 'Philips', 28.00, 150, 4),
  (1, 'Interruptor Sencillo', 'Leviton', 19.50, 90, 4),
  (1, 'Pintura Látex Blanco 1 gal', 'Sherwin-Williams', 185.00, 35, 5),
  (1, 'Brocha 3 pulgadas', 'Truper', 22.00, 60, 5),
  (1, 'Rodillo 9 pulgadas', 'Pretul', 45.00, 28, 5),
  (1, 'Thinner 1 litro', 'Celco', 38.00, 4, 5),
  (1, 'Tornillo Gypsum 1 1/4 (caja 100)', 'Fiero', 35.00, 70, 6),
  (1, 'Clavo de Acero 2 1/2 (libra)', 'Fiero', 18.00, 9, 6),
  (1, 'Ancla Plástica 1/4 (bolsa 50)', 'Fischer', 25.50, 2, 6),
  (0, 'Perno Hexagonal 3/8 x 2', 'Fiero', 4.25, 200, 6),
  (1, 'Manguera de Jardín 15 m', 'Truper', 149.00, 12, 7),
  (1, 'Pala Cuadrada', 'Truper', 115.00, 7, 7),
  (1, 'Tijera para Podar', 'Pretul', 79.00, 15, 7),
  (1, 'Rastrillo 14 dientes', 'Truper', 68.00, 1, 7),
  (1, 'Guantes de Cuero', 'Truper', 42.00, 50, 8);

-- Clientes (el 13 está anulado: ESTADO = 0)
INSERT INTO cliente (ESTADO, NOMBRE, APELLIDO, NIT, TELEFONO, FECHA_REGISTRO) VALUES
  (1, 'Roberto', 'Aguilar', '4521367-8', '5521-8844', '2026-01-10 09:15:00'),
  (1, 'Patricia', 'Barrios', '6632145-2', '4433-1290', '2026-01-28 11:40:00'),
  (1, 'Fernando', 'Cifuentes', '3389021-K', '5566-2310', '2026-02-07 15:20:00'),
  (1, 'Claudia', 'Díaz', '7745123-6', '3322-4567', '2026-02-21 10:05:00'),
  (1, 'Héctor', 'Estrada', '2214589-3', '5544-7781', '2026-03-09 16:30:00'),
  (1, 'Mónica', 'Figueroa', '8890234-1', '4455-0098', '2026-03-27 08:45:00'),
  (1, 'Diego', 'Girón', '5567812-4', '5599-3412', '2026-04-11 13:55:00'),
  (1, 'Andrea', 'Juárez', '9912345-7', '3344-8876', '2026-04-29 17:10:00'),
  (1, 'Óscar', 'Lemus', '1123987-5', '5511-6543', '2026-05-16 09:35:00'),
  (1, 'Karla', 'Monterroso', '6678543-9', '4477-2109', '2026-06-02 12:20:00'),
  (1, 'Javier', 'Navarro', '4432198-0', '5588-9087', '2026-06-24 14:45:00'),
  (1, 'Rosa', 'Orellana', '3345678-2', '3399-1234', '2026-07-08 10:50:00'),
  (0, 'Sergio', 'Paz', '7789012-6', '5533-4567', '2026-08-19 15:15:00');

-- Facturas (las facturas 5 y 16 están anuladas: ESTADO = 0)
INSERT INTO factura (ESTADO, FECHA_FACTURA, ESTADO_FACTURA, TOTAL, ID_CLIENTE) VALUES
  (1, '2026-08-04 08:10:00', 1, 168.00, 7),
  (1, '2026-08-04 12:30:00', 1, 282.00, 11),
  (1, '2026-08-05 15:53:00', 1, 3949.50, 5),
  (1, '2026-08-07 09:30:00', 1, 828.00, 8),
  (0, '2026-08-16 13:23:00', 1, 380.00, 7),
  (1, '2026-08-17 16:08:00', 1, 11.25, 7),
  (1, '2026-08-24 08:44:00', 1, 296.00, 5),
  (1, '2026-09-08 14:14:00', 1, 1436.50, 3),
  (1, '2026-09-17 09:54:00', 1, 185.00, 8),
  (1, '2026-09-18 11:46:00', 1, 19.50, 7),
  (1, '2026-09-22 11:40:00', 1, 221.00, 5),
  (1, '2026-09-25 11:56:00', 1, 63.00, 2),
  (1, '2026-09-25 12:29:00', 1, 25.50, 11),
  (1, '2026-09-28 08:02:00', 1, 1167.00, 6),
  (1, '2026-10-01 15:18:00', 1, 380.00, 5),
  (0, '2026-10-14 09:57:00', 1, 521.00, 6),
  (1, '2026-10-15 08:23:00', 1, 376.25, 8),
  (1, '2026-10-15 13:53:00', 1, 144.00, 11),
  (1, '2026-10-18 08:09:00', 1, 445.50, 12),
  (1, '2026-10-20 09:29:00', 1, 290.00, 12),
  (1, '2026-10-27 08:26:00', 1, 925.00, 1);

-- Detalle de facturas (SUBTOTAL = CANTIDAD * PRECIO_UNITARIO)
INSERT INTO factura_detalle (CANTIDAD, PRECIO_UNITARIO, SUBTOTAL, ID_FACTURA, ID_ARTICULO) VALUES
  (4, 42.00, 168.00, 1, 30),
  (1, 45.00, 45.00, 2, 20),
  (3, 79.00, 237.00, 2, 28),
  (2, 48.75, 97.50, 3, 4),
  (3, 1250.00, 3750.00, 3, 8),
  (4, 25.50, 102.00, 3, 24),
  (4, 32.50, 130.00, 4, 10),
  (4, 149.00, 596.00, 4, 26),
  (4, 25.50, 102.00, 4, 24),
  (1, 185.00, 185.00, 5, 18),
  (3, 65.00, 195.00, 5, 1),
  (3, 3.75, 11.25, 6, 12),
  (4, 39.00, 156.00, 7, 5),
  (2, 22.00, 44.00, 7, 19),
  (4, 24.00, 96.00, 7, 15),
  (2, 689.00, 1378.00, 8, 7),
  (3, 19.50, 58.50, 8, 17),
  (1, 185.00, 185.00, 9, 18),
  (3, 6.50, 19.50, 10, 14),
  (2, 72.00, 144.00, 11, 3),
  (1, 38.00, 38.00, 11, 21),
  (1, 39.00, 39.00, 11, 5),
  (1, 24.00, 24.00, 12, 15),
  (1, 39.00, 39.00, 12, 5),
  (1, 25.50, 25.50, 13, 24),
  (5, 185.00, 925.00, 14, 18),
  (4, 25.50, 102.00, 14, 24),
  (5, 28.00, 140.00, 14, 16),
  (4, 95.00, 380.00, 15, 13),
  (5, 79.00, 395.00, 16, 28),
  (3, 42.00, 126.00, 16, 30),
  (2, 115.00, 230.00, 17, 27),
  (3, 48.75, 146.25, 17, 4),
  (2, 72.00, 144.00, 18, 3),
  (4, 65.00, 260.00, 19, 1),
  (5, 19.50, 97.50, 19, 17),
  (4, 22.00, 88.00, 19, 19),
  (5, 58.00, 290.00, 20, 11),
  (5, 185.00, 925.00, 21, 18);

-- ---------------------------------------------------------------------
-- Verificación rápida
-- ---------------------------------------------------------------------
SELECT 'categoria' AS tabla, COUNT(*) AS registros FROM categoria
UNION ALL SELECT 'articulo', COUNT(*) FROM articulo
UNION ALL SELECT 'cliente', COUNT(*) FROM cliente
UNION ALL SELECT 'factura', COUNT(*) FROM factura
UNION ALL SELECT 'factura_detalle', COUNT(*) FROM factura_detalle;
