---
name: web-presentations
description: >-
  Crea, diseña y anima presentaciones interactivas estilo PowerPoint o Keynote
  utilizando HTML5, CSS3 moderno y Vanilla JavaScript. Activa esta skill cuando el
  usuario solicite diapositivas web (slide decks), presentaciones animadas, pitch decks,
  transiciones de diapositivas, animaciones por pasos (fragments) o exportación a PDF.
---

# Web Presentations Skill (HTML + CSS + JavaScript)

Esta skill proporciona las directrices de arquitectura, diseño, transiciones y controles para crear presentaciones web interactivas de calidad profesional, estilo PowerPoint / Keynote, sin dependencias pesadas, usando únicamente **HTML5 semántico, Vanilla CSS y JavaScript**.

---

## Capacidades Incluidas

1. **Relación de aspecto 16:9 adaptativa**: Escalado automático vectorial (`1920x1080` base) para verse impecable en cualquier resolución, proyector o pantalla táctil sin barras de scroll accidentales.
2. **Animaciones por pasos (*Fragments*)**: Revelación progresiva de elementos (viñetas, tarjetas, gráficos) en cada pulsación antes de avanzar a la siguiente diapositiva, igual que las animaciones de PowerPoint.
3. **Múltiples transiciones de diapositiva**:
   - `slide`: Desplazamiento horizontal fluido con curvas cúbicas.
   - `fade`: Desvanecimiento elegante y suave.
   - `zoom`: Acercamiento y alejamiento con profundidad 3D.
   - `flip`: Rotación 3D estilo cubo o tarjeta.
4. **Controles completos e interactivos**:
   - Teclado: Flechas izquierda/derecha, Barra espaciadora, RePág/AvPág, Inicio/Fin.
   - Tecla `F`: Modo pantalla completa (*Fullscreen*).
   - Tecla `O`: Vista general / Organizador de diapositivas (*Slide Sorter Grid*).
   - Tecla `N`: Panel de notas del orador (*Presenter Notes*).
   - Tecla `H` o `?`: Ayuda con atajos de teclado.
   - Gestos táctiles (*Swipe* izquierda/derecha en móviles/tablets).
   - Barra de progreso superior y contador de diapositivas interactivo.
5. **Diseño Visual de Alto Impacto**:
   - Modo oscuro premium (*Dark theme*) con glassmorphism, orbes de luz y sombras sutiles.
   - Tipografía moderna cargada vía Google Fonts (`Outfit` e `Inter`).
   - Múltiples layouts predefinidos: Portada, Comparativa 2 columnas, Grid de métricas/KPIs, Línea de tiempo, Citas de impacto y Cierre con llamada a la acción (CTA).
6. **Exportación a PDF lista para imprimir**:
   - Reglas `@media print` optimizadas con `@page { size: landscape; margin: 0; }` para guardar toda la presentación en PDF limpio con `Ctrl + P`.

---

## Estructura de Archivos de la Skill

```text
.agents/skills/web-presentations/
├── SKILL.md                          # Este archivo de instrucciones
├── resources/
│   ├── slides.css                    # Hoja de estilos con variables, layouts y animaciones
│   ├── slides.js                     # Motor de diapositivas (navegación, fragments, pantalla completa)
│   └── template.html                 # Plantilla base lista para clonar
└── examples/
    └── demo-presentation.html       # Presentación completa de demostración con 7 diapositivas
```

---

## Flujo de Trabajo para Crear una Presentación

Al crear una presentación para el usuario:

### 1. Definir el Esquema y Propósito
- Identifica el número de diapositivas, tema principal, audiencia y paleta de colores.
- Planifica la narrativa:
  - **Slide 1**: Título, subtítulo de impacto y autor/badge.
  - **Slide 2-3**: Problema y solución (tarjetas comparativas o split layout).
  - **Slide 4**: Métricas clave o características (layout de cards 3-4 columnas con animación paso a paso).
  - **Slide 5**: Hoja de ruta (roadmap) o arquitectura técnica.
  - **Slide 6**: Demostración, código o caso de éxito / cita.
  - **Slide 7**: Conclusiones, preguntas y llamada a la acción (CTA).

### 2. Estructura HTML de una Diapositiva
Cada diapositiva es un elemento `<section class="slide" data-transition="...">`:

```html
<section class="slide" data-slide="1" data-transition="slide">
  <div class="slide-content">
    <span class="badge">Novedad</span>
    <h1 class="gradient-text">Título de la Diapositiva</h1>
    <p class="subtitle">Subtítulo explicativo breve y legible.</p>

    <!-- Elementos con animación por pasos (fragments) -->
    <div class="card-grid">
      <div class="card fragment" data-step="1">
        <h3>Punto 1</h3>
        <p>Aparece en el primer clic.</p>
      </div>
      <div class="card fragment" data-step="2">
        <h3>Punto 2</h3>
        <p>Aparece en el segundo clic.</p>
      </div>
    </div>
  </div>

  <!-- Notas del presentador (ocultas en pantalla principal) -->
  <aside class="speaker-notes">
    Explicar aquí los puntos clave y métricas para el orador.
  </aside>
</section>
```

### 3. Clases de Animación y Efectos (CSS)
Utiliza las clases utilitarias definidas en `slides.css`:
- `.fragment`: El elemento se mantiene oculto u opaco hasta que el usuario avanza.
- `.gradient-text`: Aplica gradiente de color al texto con brillo sutil.
- `.glass-card`: Fondo translúcido con efecto desenfoque `backdrop-filter: blur(16px)` y borde brillante.
- `.badge`: Etiqueta pequeña flotante para categorías o estados.
- `.metric-number`: Tipografía grande para números y KPIs con acento de color.

---

## Atajos de Teclado del Motor

| Tecla | Acción |
| :--- | :--- |
| `→` / `Espacio` / `AvPág` | Siguiente paso / siguiente diapositiva |
| `←` / `RePág` | Paso anterior / diapositiva anterior |
| `Inicio` (`Home`) | Ir a la primera diapositiva |
| `Fin` (`End`) | Ir a la última diapositiva |
| `F` | Alternar Pantalla Completa (*Fullscreen*) |
| `O` | Alternar Vista General (*Slide Sorter / Grid Overview*) |
| `N` | Mostrar / Ocultar Notas del Orador |
| `H` o `?` | Abrir ventana de ayuda de atajos |
| `Escape` | Cerrar vista general, notas o ayuda |

---

## Recursos Incluidos

- [Plantilla Base (template.html)](./resources/template.html)
- [Estilos Principales (slides.css)](./resources/slides.css)
- [Motor JavaScript (slides.js)](./resources/slides.js)
- [Ejemplo Completo (demo-presentation.html)](./examples/demo-presentation.html)
