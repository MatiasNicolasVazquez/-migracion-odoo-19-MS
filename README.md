# Migración Odoo 17 → 19 · MacStation

App de control compartido para migrar los **30 módulos** de `web-macstation` de Odoo 17 a 19.

- Priorización P0–P3 por dependencias e impacto
- Plan de pruebas por módulo
- Estado compartido en tiempo real vía **Supabase**

## 1. Credenciales Supabase

1. Abrí tu proyecto en [supabase.com](https://supabase.com)
2. **Project Settings → API**
3. Copiá:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable** key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Pegá ambos en [`.env.local`](.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

En Vercel usá las mismas dos variables.

## 2. Crear tablas (una sola vez)

En el dashboard de Supabase → **SQL Editor** → New query, pegá y ejecutá en orden:

1. Contenido de [`supabase/migrations/001_migration_control.sql`](supabase/migrations/001_migration_control.sql) (tablas + RLS + Realtime)
2. Opcional: [`supabase/migrations/002_seed_modules.sql`](supabase/migrations/002_seed_modules.sql) — si no lo corrés, la app hace seed automático al abrir

## 3. Correr local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). Deberías ver “Supabase conectado”.

## 4. Deploy en Vercel

1. Subí el repo a GitHub
2. Importá en [Vercel](https://vercel.com)
3. En Environment Variables agregá las mismas dos keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy y compartí la URL con tu compañero

## Uso

- **Listado**: filtros por prioridad, categoría, estado; “Listos para probar” = deps custom ya en OK
- **Siguiente a probar**: atajos P0 desbloqueados
- **Detalle** (`/module/[id]`): checklist, notas, assignee, cambio de estado (Realtime)

## Prioridades

| Prioridad | Criterio |
|---|---|
| P0 | Camino crítico tienda + pagos + Safe |
| P1 | Tags/stock/account, Payway/Talo, zonas, FB feed |
| P2 | UX/SEO/analytics/pixels |
| P3 | `task_list`, módulo puente de valuation |

## Seguridad

RLS permite lectura/escritura anónima a propósito (herramienta interna de equipo). No publiques la URL si no querés que cualquiera con el link edite el progreso.
