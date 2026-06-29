# Testing_Framework

Proyecto académico desarrollado para la evaluación **Expansión y Síntesis de Testing Avanzado**.

El objetivo del proyecto es implementar y validar diferentes técnicas de testing avanzado usando TypeScript, Jasmine, fast-check, StrykerJS, c8 y GitHub Actions.

## Contenido del proyecto

El proyecto incluye:

* Mini-framework híbrido basado en Jasmine.
* Pruebas de integración automática.
* Mocking avanzado con espías personalizados.
* Generación de pruebas basada en tipos.
* Pruebas avanzadas para búsqueda binaria.
* Property-based testing.
* Contract testing.
* Mutation testing.
* Métricas avanzadas de calidad.
* Pruebas combinatorias priorizadas por riesgo.
* Flujo codeless representado mediante JSON.
* Modelo predictivo de confiabilidad.
* Pipeline integral con GitHub Actions.

## Estructura principal

```text
src/framework        Mini-framework híbrido
src/negocio          Caso práctico de pedidos
src/algoritmos       Búsqueda binaria y contratos
src/metricas         Métricas avanzadas de calidad
src/combinatorio     Generación y priorización combinatoria
src/codeless         Validación de flujo codeless
src/confiabilidad    Modelos predictivos de confiabilidad
spec                 Pruebas automatizadas
scripts              Scripts para reportes y métricas
config               Datos de entrada para los modelos
.github/workflows    Pipeline integral de GitHub Actions
```

## Instalación

Para instalar las dependencias del proyecto:

```powershell
npm.cmd install
```

## Ejecución de pruebas

Para ejecutar todas las pruebas automatizadas:

```powershell
npm.cmd test
```

Resultado esperado:

```text
35 specs, 0 failures
```

## Validación de TypeScript

Para validar que el código TypeScript no tenga errores de compilación:

```powershell
npx.cmd tsc --noEmit
```

## Cobertura de pruebas

Para generar el reporte de cobertura:

```powershell
npm.cmd run test:coverage
```

## Mutation testing

Para ejecutar mutation testing con StrykerJS:

```powershell
npm.cmd run test:mutation
```

## Métricas avanzadas

Complejidad ciclomática por prueba:

```powershell
npm.cmd run metricas:complejidad
```

Detección de pruebas inestables:

```powershell
npm.cmd run metricas:estabilidad
```

Análisis de tiempo de ejecución:

```powershell
npm.cmd run metricas:tiempo
```

Relación entre cobertura y defectos detectados:

```powershell
npm.cmd run metricas:cobertura-defectos
```

## Pruebas combinatorias

Para generar los casos combinatorios priorizados por riesgo:

```powershell
npm.cmd run combinatorio:generar
```

El sistema genera combinaciones de escenarios de pedido y las clasifica según su nivel de riesgo.

## Modelo predictivo de confiabilidad

Para generar el reporte del modelo de confiabilidad:

```powershell
npm.cmd run confiabilidad:reporte
```

Para ejecutar el modelo predictivo personalizado:

```powershell
npm.cmd run confiabilidad:personalizado
```

Este modelo utiliza datos históricos, métricas de complejidad, patrones de uso, enfoque logarítmico y simulación estocástica básica para generar predicciones integradas por módulo.

## Pipeline de GitHub Actions

El proyecto incluye un pipeline integral ubicado en:

```text
.github/workflows/testing-integral.yml
```

El pipeline se ejecuta automáticamente cuando se realiza un `push` o `pull request` hacia la rama `main`.

También puede ejecutarse manualmente desde GitHub:

```text
Actions > Pipeline de Testing Integral > Run workflow
```

El pipeline ejecuta:

* Validación de TypeScript.
* Pruebas Jasmine.
* Cobertura con c8.
* Generación de casos combinatorios.
* Métricas avanzadas.
* Reporte de confiabilidad.
* Mutation testing con StrykerJS.
* Publicación de reportes como artefactos.

## Estado esperado del proyecto

Antes de subir cambios al repositorio se recomienda ejecutar:

```powershell
npm.cmd test
```

y luego verificar el estado de Git:

```powershell
git status
```

El estado esperado es:

```text
nothing to commit, working tree clean
```

## Repositorio

Repositorio del proyecto:

```text
https://github.com/Armando2t/Testing_Framework
```
