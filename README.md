# Fútbol Stats Pro

Aplicación web en español para comparar equipos, consultar partidos por fecha y analizar últimos cinco partidos con API-Football.

## Requisitos
- Node.js 18 o superior.
- Una API key de API-Football: https://www.api-football.com/ (la cobertura y límites dependen del plan contratado).

## Instalación
1. Descomprime el proyecto.
2. Abre una terminal dentro de la carpeta `futbol-stats-pro`.
3. Ejecuta `npm install`.
4. Copia `.env.example` como `.env`.
5. Pega tu clave en `API_FOOTBALL_KEY` dentro de `.env`.
6. Ejecuta `npm start`.
7. Abre http://localhost:3000 en tu navegador.

La clave se guarda en el servidor y no se expone en el navegador.

## Datos y metodología
- Partidos, ligas, equipos y resultados: API-Football.
- Probabilidades 1X2: estimación heurística basada en puntos obtenidos en los últimos cinco partidos y una ventaja local fija. No es una predicción oficial ni un modelo calibrado.
- Corners, tiros a puerta, tarjetas y faltas: promedio de los últimos cinco partidos cuando el proveedor dispone de estadísticas.
- La proyección de corners mostrada es una referencia basada en promedios recientes, no una garantía.
- La disponibilidad de ligas, temporadas, estadísticas y predicciones oficiales depende del plan y cobertura de API-Football.

## Limitaciones de esta primera versión
- El análisis manual permite elegir equipos; la búsqueda de cruce próximo es una comprobación simple y puede no encontrar un partido futuro si el calendario aún no está publicado.
- Los datos de estadísticas pueden faltar para ciertas ligas o partidos.
- El cálculo de probabilidades es orientativo; para uso avanzado conviene añadir un modelo Poisson/Elo y validarlo con históricos.
