import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const mexicanSpanish = event.url.pathname === '/es' || event.url.pathname.startsWith('/es/');
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => mexicanSpanish ? html.replace('<html lang="en">', '<html lang="es-MX">') : html
  });
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
};
