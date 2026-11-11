import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const isMexicanSpanish = event.url.pathname === '/es' || event.url.pathname.startsWith('/es/');
  return resolve(event, {
    transformPageChunk: ({ html }) => isMexicanSpanish ? html.replace('<html lang="en">', '<html lang="es-MX">') : html
  });
};
