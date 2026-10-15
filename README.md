# TBD3 — DISCOR S.R.L. (PostgreSQL 16+)

Presentación interactiva moderna desarrollada en **HTML5, Vanilla CSS3 y JavaScript** para la defensa del laboratorio de bases de datos empresariales: **Construcción de Objetos DDL y Diccionario de Datos**, caso práctico **Distribuidora Comercial Andina del Oriente S.R.L. (DISCOR)** sobre **PostgreSQL 16+ / 18**.

---

## 🚀 Cómo Visualizar la Presentación

No se requieren dependencias, compiladores ni servidores complejos. Puedes abrir directamente en tu navegador:

- **[index.html](index.html)**: Presentación interactiva principal (10 diapositivas).
- **[presentacion_discor_postgresql.html](presentacion_discor_postgresql.html)**: Archivo específico del caso DISCOR.
- **[.agents/skills/web-presentations/examples/demo-presentation.html](.agents/skills/web-presentations/examples/demo-presentation.html)**: Diapositivas de demostración del motor web.

---

## ✨ Características Técnicas de la Presentación

1. **Auto-escalado Reactivo 16:9**: Resolución base vectorial de `1920x1080` que se adapta fluidamente a cualquier pantalla, monitor o proyector.
2. **Modo Oscuro y Modo Claro**: Alterna temas en tiempo real pulsando la tecla <kbd>T</kbd> o con el botón **☀️ / 🌙** (con persistencia en `localStorage`).
3. **Animaciones por Pasos (*Fragments*)**: Revelación secuencial de tarjetas, viñetas y bloques de código con la barra espaciadora o flechas.
4. **Organizador Visual de Diapositivas (*Slide Sorter*)**: Vista en cuadrícula interactiva accesible con la tecla <kbd>O</kbd>.
5. **Notas del Presentador (*Speaker Notes*)**: Guion de exposición integrado pulsando la tecla <kbd>N</kbd>.
6. **Exportación a PDF**: Integrado con reglas CSS `@media print` para exportar en alta fidelidad con <kbd>Ctrl</kbd> + <kbd>P</kbd>.

---

## ⌨️ Atajos de Teclado

| Tecla | Acción |
| :--- | :--- |
| <kbd>→</kbd> / <kbd>Espacio</kbd> / <kbd>AvPág</kbd> | Siguiente elemento / diapositiva |
| <kbd>←</kbd> / <kbd>RePág</kbd> | Elemento anterior / diapositiva |
| <kbd>T</kbd> | Alternar entre Modo Claro y Modo Oscuro |
| <kbd>O</kbd> | Abrir / Cerrar el Organizador de diapositivas en cuadrícula |
| <kbd>N</kbd> | Mostrar / Ocultar notas del orador |
| <kbd>F</kbd> | Alternar Pantalla Completa |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Primera / Última diapositiva |
| <kbd>?</kbd> | Abrir ventana de ayuda |
| <kbd>Esc</kbd> | Cerrar ventanas modales y paneles |

---

## 📂 Estructura del Repositorio

```text
TBD3/
├── index.html                                        # Presentación interactiva principal
├── presentacion_discor_postgresql.html              # Copia dedicada de la presentación DISCOR
├── README.md                                         # Documentación del proyecto
└── .agents/
    └── skills/
        └── web-presentations/                        # Skill oficial de Antigravity
            ├── SKILL.md                              # Guía y directrices del agente
            ├── resources/
            │   ├── slides.css                        # Estilos CSS (temas, animaciones, 16:9)
            │   ├── slides.js                         # Motor de eventos, teclado y fragments
            │   └── template.html                     # Plantilla base para nuevas presentaciones
            └── examples/
                └── demo-presentation.html            # Demostración del motor de diapositivas
```

---

## 🏛️ Contenido del Caso DISCOR S.R.L.

- **Esquema Dedicado**: `comercial` en PostgreSQL 16+ (codificación UTF-8).
- **Entidades Normalizadas (3FN)**: `categorias`, `proveedores`, `productos`, `clientes`, `pedidos`, `detalle_pedidos`.
- **Generadores Numéricos**: 6 secuencias independientes con CACHE y sincronización formal vía `ALTER SEQUENCE ... OWNED BY`, incluyendo secuencia fiscal correlativa `seq_nro_factura` con `NO CYCLE`.
- **Integridad de Dominio**: Restricciones declarativas `CHECK` para control de costos, precios, existencias no negativas, segmentos y consistencia matemática.
- **Indexación Inteligente**: Índices compuestos B-Tree sobre Foreign Keys e índice parcial especializado `idx_productos_bajo_stock ... WHERE activo = TRUE` para alertas inmediatas.
- **Diccionario de Datos**: Auditoría cruzada entre `information_schema` y `pg_catalog`, enriquecida con `COMMENT ON` y consolidada en la vista `vw_diccionario_datos`.
