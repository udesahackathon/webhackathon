# HackUDESA landing

Landing estática simple para publicar rápido en Vercel.

## Qué editar primero

Abrí [site.js](/Users/athinasalim/hackudesa/webhackathon/site.js) y cambiá:

- `eventDate`
- `eventLocation`
- `register`
- `instagram`
- `contactEmail`
- `sponsorDeck`

Si quieren cambiar textos largos, también están centralizados ahí.

## Preview local

Como es un sitio estático, pueden abrir `index.html` directo en el navegador o
levantar un server simple. Por ejemplo:

```bash
npx serve .
```

## Deploy en Vercel

1. Suban este repo a GitHub.
2. Entren a Vercel y hagan `Add New Project`.
3. Importen el repo.
4. Como no hay framework ni build step, Vercel lo publica directo.

## Qué les conviene definir mañana

- Nombre final del evento
- Fecha y duración
- Lugar
- Formulario de inscripción
- Mail o Instagram de contacto
- Si van a mostrar sponsors confirmados o solo "partners soon"
