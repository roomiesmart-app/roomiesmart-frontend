# Informe técnico: tarjetas vacías en el Dashboard de Finanzas

**Componente afectado:** `src/contexts/finances/pages/FinanceDashboardPage.tsx`
**Servicio relacionado:** `src/contexts/finances/services/finances.service.ts`
**Síntoma reportado:** las tarjetas "Presupuesto", "Debes", "Te deben" y "Disponible real" mostraban `---` de forma permanente.

## 1. Causa raíz

El dashboard depende de dos fuentes de datos independientes:

1. `GET /api/expenses/:departmentId` → gastos del departamento (ya modelado correctamente).
2. `GET /api/v1/identity/me` → perfil del usuario logueado, del cual se obtienen `id`, `departmentId` y el **presupuesto inicial**, ya que este dato no forma parte del endpoint de gastos.

El bug estaba en cómo se leía la respuesta del perfil (`FinanceDashboardPage.tsx`, línea 18 original):

```ts
setPresupuestoMensual(userProfile.monthlyBudget || 0);
```

El campo `monthlyBudget` **no existe en ningún modelo de datos del proyecto**. El modelo real del perfil del usuario (`src/contexts/identity-profile/models/Profile.ts`) define el presupuesto como:

```ts
budget?: number;                       // presupuesto plano, capturado en el registro
financial: { budgetRange: { min, max } } // rango definido en el onboarding financiero
```

Como `userProfile.monthlyBudget` siempre era `undefined`, el fallback `|| 0` dejaba `presupuestoMensual` en `0` de forma silenciosa (sin error visible), lo que forzaba a `'---'` tanto en "Presupuesto" como en "Disponible real" (esta última depende de que el presupuesto sea `> 0`).

### Por qué también fallaban "Debes" y "Te deben"

Esas dos tarjetas dependen de `data`, que se llena únicamente si `loadDashboard()` se ejecuta. Esa función tiene una guarda:

```ts
if (!departmentId || !dbUserId) return;
```

`departmentId` y `dbUserId` provienen de la **misma** respuesta de `/api/v1/identity/me`. Cualquier fallo o desajuste en esa llamada (error de red, 401, o forma de respuesta distinta a la esperada) dejaba ambos valores vacíos, y el `catch` solo hacía `console.error` sin exponer nada en la UI. Resultado: las 4 tarjetas quedaban en `---` en cascada a partir de un único punto de falla, sin ninguna señal visible para el usuario ni en consola de producción.

## 2. Lógica de cálculo (verificada, no requirió cambios)

La lógica matemática en `finances.service.ts` ya estaba correctamente implementada y se mantuvo sin modificaciones:

- **Gasto total del departamento:** `houseTotal += expense.amount` sobre todos los gastos devueltos por `/api/expenses/:departmentId`.
- **Te deben:** para cada gasto donde `payerId === currentUserId`, se suma `amount - (amount / TOTAL_ROOMIES)` (la fracción que corresponde a los demás roomies).
- **Debes:** para cada gasto donde `payerId` pertenece a otro roomie, se suma `amount / TOTAL_ROOMIES` (la fracción que le corresponde pagar al usuario logueado).
- **Disponible real:** `presupuestoInicial - youOwe + owedToYou` (presupuesto menos lo que debe, más lo que le deben).

> Nota fuera de alcance: `TOTAL_ROOMIES` está hardcodeado en `4`. Si el número real de roomies del departamento varía, los montos de "Debes"/"Te deben" serán aproximados. Se recomienda que el backend exponga el número de integrantes del departamento (o derivarlo de los `payerDetails` únicos) en una futura iteración.

## 3. Corrección aplicada

En `FinanceDashboardPage.tsx`:

1. Se reemplazó la lectura de `userProfile.monthlyBudget` por una cadena de fallback que respeta el modelo real del perfil:
   ```ts
   const presupuestoInicial =
     userProfile.budget ??
     userProfile.financial?.budgetRange?.max ??
     userProfile.monthlyBudget ??
     0;
   ```
2. Se añadió estado de error (`profileError`) visible en la UI cuando `/api/v1/identity/me` falla o no trae `id`/`departmentId`, en lugar de fallar en silencio hacia `---`.
3. Se detiene el estado de "Sincronizando..." (`setLoading(false)`) cuando el perfil no puede resolverse, para no dejar la vista cargando indefinidamente.

## 4. Recomendación de seguimiento

Centralizar `id`, `departmentId` y `budget` del usuario logueado en un contexto/estado global (hoy se piden de forma ad-hoc dentro de `FinanceDashboardPage` y se pierden al navegar a otra ruta), en lugar de que cada página que los necesite repita la llamada a `/api/v1/identity/me`.
