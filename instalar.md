# Pasos para instalar el sistema:

## Asignar una IP estatica al equipo servidor
- obtener la dirección MAC (ipconfig /all)
- buscar y añadir en el router la dirección MAC a un IP estatica ("DHCP Server", "Static Lease", "Address Reservation" o "Reserva de Direcciones")
- agrear la MAC y la IP

## Abrir el Firewall
- ir a Firewall de Windows Defender con seguridad avanzada
- Reglas de entrada -> Nueva Regla
- Puertos locales específicos: 3000
- Permitir Conexión
- Aplicar a Privada, Público y Dominio
- Asignar nombre

## Para saber la arquitectura (x32, x64, x86)
- Explorador de archivos
- Este equipo (click derecho)
- Propiedades
- Tipo de Sistema

## requisitos
- npm
- node.js
- pm2 (npm install -g pm2)

#### Pasos:
- npm install
- npm install -g pm2
- npm run build
- pm2 start ecosystem.config.js
- pm2 list
- pm2 save