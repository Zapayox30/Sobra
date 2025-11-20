# Iconos PWA para SOBRA

## Iconos Necesarios

Para completar la configuración PWA, necesitas agregar los siguientes iconos a la carpeta `public/`:

### 1. icon-192.png (192x192 pixels)
- **Uso:** Android Chrome, App Drawer
- **Formato:** PNG con fondo sólido
- **Diseño:** Logo "SO$" con badge en gradiente morado-azul oscuro (#6B46C1 → #1E3A8A)

### 2. icon-512.png (512x512 pixels) 
- **Uso:** Android Chrome splash screen, App install prompt
- **Formato:** PNG con fondo sólido
- **Diseño:** Mismo diseño que icon-192 pero en mayor resolución

### 3. apple-touch-icon.png (180x180 pixels)
- **Uso:** iOS home screen
- **Formato:** PNG sin transparencia
- **Diseño:** Mismo badge "SO$" optimizado para iOS

## Cómo Generarlos

### Opción 1: Usar el Logo Existente
Si ya tienes un logo en la carpeta `public/`, puedes redimensionarlo usando:
- Photoshop / GIMP
- Online: https://realfavicongenerator.net/
- Online: https://www.favicon-generator.org/

### Opción 2: Crear desde Cero
1. Abre Figma, Canva o cualquier editor de imágenes
2. Crea un canvas de 512x512px
3. Fondo: Gradiente oscuro (#0f1115 o similar)
4. Añade el texto "SO$" en fuente bold, color blanco/gris claro
5. Opcional: Añade un borde redondeado o badge circular
6. Exporta en 512x512, 192x192, y 180x180

### Opción 3: Placeholder Temporal
Para desarrollo, puedes usar iconos placeholder:
```bash
# Si tienes ImageMagick instalado:
convert -size 192x192 xc:#6B46C1 -pointsize 80 -fill white -gravity center -annotate +0+0 "SO$" icon-192.png
convert -size 512x512 xc:#6B46C1 -pointsize 200 -fill white -gravity center -annotate +0+0 "SO$" icon-512.png
convert -size 180x180 xc:#6B46C1 -pointsize 70 -fill white -gravity center -annotate +0+0 "SO$" apple-touch-icon.png
```

## Directrices de Diseño

- **Colores de Marca:** Usar gradiente morado (#6B46C1) a azul oscuro (#1E3A8A)
- **Texto:** "SO$" en fuente bold, color blanco (#FFFFFF) o gris claro
- **Forma:** Redondeado, moderno, minimalista
- **Estilo:** Premium, confiable, financiero

## Verificación

Una vez agregados los iconos:
1. Ejecuta `npm run dev`
2. Abre Chrome DevTools > Application > Manifest
3. Verifica que los 3 iconos aparezcan en la lista
4. Prueba "Add to Home Screen" en un dispositivo móvil

## Estado Actual

- ✅ manifest.json creado
- ✅ Meta tags configurados en layout.tsx
- ⏳ Iconos pendientes de crear/agregar

**Nota:** Los iconos son necesarios para que la PWA funcione correctamente en dispositivos móviles.
