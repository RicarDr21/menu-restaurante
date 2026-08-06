# Menu Restaurante - Catalogo con EJS

Proyecto de laboratorio: sitio multipagina con motor de plantillas (EJS + Express).

## Requisitos cumplidos

- Datos: 4 platos con id unico, campo anidado (chef: nombre + especialidad) y campo numerico (precio)
- Layout compartido: header y footer reutilizados en listado y detalle via partials de EJS
- Listado: genera las tarjetas con un bucle forEach, cada una enlaza a su detalle
- Detalle con ruta dinamica: /plato/:id
- Condicional en la plantilla: segun el precio muestra "Recomendado", "Precio estandar" o "Plato premium"
- HTML5 semantico (header, main, section, article, footer) y Flexbox en el listado y el header

## Como correr el proyecto

npm install
node index.js

Abre http://localhost:3000
