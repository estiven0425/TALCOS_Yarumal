CREATE DATABASE `talcos_yarumal`;

USE `talcos_yarumal`;

CREATE TABLE `perfiles` (
	`id_perfil` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`nombre_perfil` VARCHAR(250) NOT NULL,
	`icono_perfil` VARCHAR(1000) NOT NULL DEFAULT('uploads/icono_predeterminado.svg'),
	`actividad_perfil` BIT NOT NULL DEFAULT(1),
	`actualizacion_perfil` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_perfil`)
);
CREATE TABLE `molinos` (
	`id_molino` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`nombre_molino` VARCHAR(250) NOT NULL,
	`horometro_molino` BIGINT(100) NOT NULL,
	`actividad_molino` BIT NOT NULL DEFAULT(1),
	`actualizacion_molino` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_molino`)
);
CREATE TABLE `bultos` (
	`id_bulto` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`nombre_bulto` VARCHAR(250) NOT NULL,
	`capacidad_bulto` BIGINT(100) NOT NULL,
	`actividad_bulto` BIT NOT NULL DEFAULT(1),
	`actualizacion_bulto` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_bulto`)
);
CREATE TABLE `turnos` (
	`id_turno` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`nombre_turno` VARCHAR(250) NOT NULL,
	`inicio_turno` TIME NOT NULL,
	`fin_turno` TIME NOT NULL,
	`actividad_turno` BIT NOT NULL DEFAULT(1),
	`actualizacion_turno` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_turno`)
);
CREATE TABLE `referencias` (
	`id_referencia` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`nombre_referencia` VARCHAR(250) NOT NULL,
	`cantidad_referencia` DECIMAL(5,2) NOT NULL,
	`cliente_referencia` VARCHAR(250) NULL DEFAULT('No registrado'),
	`actividad_referencia` BIT NOT NULL DEFAULT(1),
	`actualizacion_referencia` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_referencia`)
);
CREATE TABLE `productos_rechazados` (
	`id_producto_rechazado` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`nombre_producto_rechazado` VARCHAR(250) NOT NULL,
	`cantidad_producto_rechazado` DECIMAL(5,2) NOT NULL,
	`retencion_producto_rechazado` DECIMAL(5,2) NOT NULL,
	`actividad_producto_rechazado` BIT NOT NULL DEFAULT(1),
	`actualizacion_producto_rechazado` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_producto_rechazado`)
);
CREATE TABLE `materias_primas` (
	`id_materia_prima` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`nombre_materia_prima` VARCHAR(250) NOT NULL,
	`cantidad_materia_prima`  DECIMAL(5,2) NOT NULL,
	`actividad_materia_prima` BIT NOT NULL DEFAULT(1),
	`actualizacion_materia_prima` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_materia_prima`)
);
CREATE TABLE `bob_cats` (
	`id_bob_cat` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`nombre_bob_cat` VARCHAR(250) NOT NULL,
	`actividad_bob_cat` BIT NOT NULL DEFAULT(1),
	`actualizacion_bob_cat` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_bob_cat`)
);
CREATE TABLE `usuarios` (
	`id_usuario` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`nombre_usuario` VARCHAR(250) NOT NULL,
	`documento_usuario` BIGINT(100) NOT NULL,
	`telefono_usuario` BIGINT(100) NOT NULL,
	`correo_usuario` VARCHAR(250) NULL DEFAULT('No aplica'),
	`contrato_usuario` BIGINT(100) NULL,
	`perfil_usuario` BIGINT(100) NOT NULL,
	`contrasena_usuario` VARCHAR(500) NOT NULL,
	`actividad_usuario` BIT NOT NULL DEFAULT(1),
	`actualizacion_usuario` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_usuario`),
	CONSTRAINT FOREIGN KEY(`perfil_usuario`) REFERENCES `perfiles`(`id_perfil`)
);
CREATE TABLE `informe_inicial` (
	`id_informe_inicial` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`titular_informe_inicial` BIGINT(100) NOT NULL,
	`fecha_informe_inicial` DATE NOT NULL,
	`hora_informe_inicial` TIME NOT NULL,
	`turno_informe_inicial` VARCHAR(250) NOT NULL,
	`bob_cat_informe_inicial` VARCHAR(250) NULL DEFAULT('No se registró'),
	`molino_informe_inicial` VARCHAR(250) NULL DEFAULT('No se registró'),
	`referencia_informe_inicial` VARCHAR(250) NULL DEFAULT('No se registró'),
	`bulto_informe_inicial` VARCHAR(250) NULL DEFAULT('No se registró'),
	`horometro_informe_inicial` BIGINT(100) NULL,
	`operador_informe_inicial` BIGINT(100) NULL,
	`carguero_informe_inicial` BIGINT(100) NULL,
	`mecanico_informe_inicial` BIGINT(100) NULL,
	`cdc_informe_inicial` BIGINT(100) NULL,
	`observacion_informe_inicial` VARCHAR(1000) NULL DEFAULT('No se registró'),
	`actividad_informe_inicial` BIT NOT NULL DEFAULT(1),
	`actualizacion_informe_inicial` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_informe_inicial`),
	CONSTRAINT FOREIGN KEY(`titular_informe_inicial`) REFERENCES `usuarios`(`id_usuario`),
	CONSTRAINT FOREIGN KEY(`operador_informe_inicial`) REFERENCES `usuarios`(`id_usuario`),
	CONSTRAINT FOREIGN KEY(`carguero_informe_inicial`) REFERENCES `usuarios`(`id_usuario`),
	CONSTRAINT FOREIGN KEY(`mecanico_informe_inicial`) REFERENCES `usuarios`(`id_usuario`),
	CONSTRAINT FOREIGN KEY(`cdc_informe_inicial`) REFERENCES `usuarios`(`id_usuario`)
);
CREATE TABLE `novedad` (
	`id_novedad` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`fecha_novedad` DATE NOT NULL,
	`hora_novedad` TIME NOT NULL,
	`turno_novedad` VARCHAR(250) NOT NULL,
	`tipo_novedad` VARCHAR(250) NOT NULL,
	`molino_novedad` VARCHAR(250) NULL,
	`referencia_novedad` VARCHAR(250) NULL DEFAULT('No se registró'),
	`bulto_novedad` VARCHAR(250) NULL DEFAULT('No se registró'),
	`operador_novedad` BIGINT(100) NULL,
	`bob_cat_novedad` VARCHAR(250) NULL DEFAULT('No se registró'),
	`carguero_novedad` BIGINT(100) NULL,
	`mecanico_novedad` BIGINT(100) NULL,
	`inicio_paro_novedad` TIME NULL,
	`fin_paro_novedad` TIME NULL,
	`horometro_inicio_paro_novedad` BIGINT(100) NULL,
	`horometro_fin_paro_novedad` BIGINT(100) NULL,
	`motivo_paro_novedad` VARCHAR(250) NULL DEFAULT('No se registró'),
	`observacion_novedad` VARCHAR(1000) NULL DEFAULT('No se registró'),
	`actividad_novedad` BIT NOT NULL DEFAULT(1),
	`actualizacion_novedad` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_novedad`),
	CONSTRAINT FOREIGN KEY(`operador_novedad`) REFERENCES `usuarios`(`id_usuario`),
	CONSTRAINT FOREIGN KEY(`carguero_novedad`) REFERENCES `usuarios`(`id_usuario`),
	CONSTRAINT FOREIGN KEY(`mecanico_novedad`) REFERENCES `usuarios`(`id_usuario`)
);
CREATE TABLE `control_calidad` (
	`id_control_calidad` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`fecha_control_calidad` DATE NOT NULL,
	`hora_control_calidad` TIME NOT NULL,
	`turno_control_calidad` VARCHAR(250) NOT NULL,
	`molino_control_calidad` VARCHAR(250) NOT NULL,
	`referencia_control_calidad` VARCHAR(250) NOT NULL,
	`bulto_control_calidad` VARCHAR(250) NOT NULL,
	`retencion_control_calidad` DECIMAL(5,2) NOT NULL,
	`rechazado_control_calidad` BIGINT(100) NOT NULL,
	`observacion_control_calidad` VARCHAR(1000) NULL DEFAULT('No se registró'),
	`actividad_control_calidad` BIT NOT NULL DEFAULT(1),
	`actualizacion_control_calidad` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_control_calidad`)
);
CREATE TABLE `informe_final` (
	`id_informe_final` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`fecha_informe_final` DATE NOT NULL,
	`hora_informe_final` TIME NOT NULL,
	`turno_informe_final` VARCHAR(250) NOT NULL,
	`molino_informe_final` VARCHAR(250) NOT NULL,
	`referencia_informe_final` VARCHAR(250) NOT NULL,
	`bulto_informe_final` VARCHAR(250) NOT NULL,
	`cantidad_informe_final` BIGINT(100) NOT NULL,
	`horometro_informe_final` BIGINT(100) NOT NULL,
	`observacion_informe_final` VARCHAR(1000) NULL DEFAULT('No se registró'),
	`actividad_informe_final` BIT NOT NULL DEFAULT(1),
	`actualizacion_informe_final` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_informe_final`)
);
CREATE TABLE `mensajes` (
	`id_mensaje` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`fecha_mensaje` DATE NOT NULL,
	`hora_mensaje` TIME NOT NULL,
	`texto_mensaje` VARCHAR(1000) NOT NULL,
	`emisor_mensaje` BIGINT(100) NOT NULL,
	`receptor_mensaje` BIGINT(100) NOT NULL,
	`actualizacion_mensaje` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_mensaje`),
	CONSTRAINT FOREIGN KEY(`emisor_mensaje`) REFERENCES `usuarios`(`id_usuario`),
	CONSTRAINT FOREIGN KEY(`receptor_mensaje`) REFERENCES `usuarios`(`id_usuario`)
);
CREATE TABLE `registros` (
	`id_registro` BIGINT(100) NOT NULL AUTO_INCREMENT,
	`fecha_registro` DATE NOT NULL,
	`titular_registro` BIGINT(100) NOT NULL,
	`proveedor_registro` BIGINT(100) NOT NULL,
	`mp_registro` VARCHAR(250) NOT NULL,
	`valor_mp_registro` BIGINT(100) NOT NULL,
	`valor_t_registro` BIGINT(100) NOT NULL,
	`peso_mp_registro` BIGINT(100) NOT NULL,
	`peso_neto_registro` BIGINT(100) NOT NULL,
	`observacion_registro` VARCHAR(1000) NULL DEFAULT('No se registró'),
	`actualizacion_registro` TIMESTAMP NOT NULL,
	CONSTRAINT PRIMARY KEY(`id_registro`),
	CONSTRAINT FOREIGN KEY(`titular_registro`) REFERENCES `usuarios`(`id_usuario`),
	CONSTRAINT FOREIGN KEY(`proveedor_registro`) REFERENCES `usuarios`(`id_usuario`)
);