<script>
  export let lang='en';
  $: es = lang === 'es';
  const t = (en, mx) => es ? mx : en;
</script>
<svelte:head>
  <title>{t('CartaPress | MACS internal menu studio','CartaPress | Estudio interno de menús MACS')}</title>
  <meta name="description" content={t('Private MACS menu design workbench for approved client projects.','Herramienta privada de MACS para crear menús de clientes autorizados.')}/>
  <meta name="robots" content="noindex, nofollow, noarchive"/>
</svelte:head>
<svelte:options accessors={true}/>
<div class="shell" lang={es?'es-MX':'en'}>
  <header class="masthead">
    <a class="wordmark" href={es?'/es':'/'} aria-label="CartaPress Studio">CARTA<span>PRESS</span><small> / MACS</small></a>
    <div class="top-links"><span class="internal">{t('INTERNAL WORKBENCH','HERRAMIENTA INTERNA')}</span><nav aria-label={t('Language','Idioma')}><a href="/" aria-current={!es?'page':undefined}>EN</a><span>/</span><a href="/es" aria-current={es?'page':undefined}>ES</a></nav></div>
  </header>
  <main>
    <section class="hero" aria-labelledby="heading">
      <div class="copy">
        <span class="eyebrow">{t('MACS · CLIENT PRODUCTION','MACS · PRODUCCIÓN PARA CLIENTES')}</span>
        <h1 id="heading">{t('Better menus.','Menús que')}<br/><em>{t('Less busywork.','sí se antojan.')}</em></h1>
        <p>{t('A private studio for turning a client’s real dishes and prices into menu proofs, editable files and digital versions. No marketplace listings, public checkout or client data shared through a storefront.','Un estudio privado para convertir los platillos y precios de tus clientes en pruebas de diseño, archivos editables y menús digitales. Sin tienda pública ni ventas por plataformas.')}</p>
        <a class="primary" href={es?'/es/studio':'/studio'}>{t('Open the menu studio','Abrir el estudio de menús')} <span aria-hidden="true">↗</span></a>
        <div class="owner-note">{t('Authorized MACS team use · Client sign-off required before final delivery','Uso exclusivo del equipo MACS · La entrega final requiere aprobación del cliente')}</div>
      </div>
      <div class="visual" aria-label={t('Photograph of original printed menu concepts on a restaurant table','Fotografía de diseños de menús sobre una mesa de restaurante')}></div>
    </section>
    <section class="workflow" aria-labelledby="flow-heading">
      <div class="heading"><span>{t('THE PRODUCTION ROUTE','EL PROCESO')}</span><h2 id="flow-heading">{t('From dishes to the table.','De los platillos a la mesa.')}</h2></div>
      <div class="route">
        <div><span>01</span><h3>{t('Collect','Recopilar')}</h3><p>{t('Use the customer-approved dish list, prices, logo and print requirements.','Usa los platillos, precios, logotipo y medidas autorizados por el cliente.')}</p></div>
        <div><span>02</span><h3>{t('Design and proof','Diseñar y revisar')}</h3><p>{t('Choose a visual direction, generate the editable proof and check spelling and prices.','Elige un estilo, genera la prueba y revisa nombres, precios y ortografía.')}</p></div>
        <div><span>03</span><h3>{t('Approve and hand off','Aprobar y entregar')}</h3><p>{t('Get explicit approval and verify the printer specifications before client delivery.','Obtén la aprobación y verifica las especificaciones de impresión antes de entregar.')}</p></div>
      </div>
    </section>
    <section class="details" aria-labelledby="scope-heading"><div><span>{t('WHAT THIS IS','QUÉ ES')}</span><h2 id="scope-heading">{t('A tool behind the service.','La herramienta detrás del servicio.')}</h2></div><p>{t('MACS sells and manages the client relationship directly. CartaPress prepares the design files. A local MCP handles private agent workflows; the browser editor makes draft previews. Payment, CRM and client fulfillment are separate, and must be verified before being called automated.','MACS vende y atiende directamente a cada cliente. CartaPress prepara los archivos de diseño. El MCP local organiza el trabajo de agentes y el editor web genera pruebas. Cobros, CRM y entregas son procesos separados que requieren verificación.')}</p></section>
  </main>
  <footer><span>© 2026 CARTAPRESS · MACS</span><span>{t('Private production tool · Versioned source and approval gates','Herramienta interna · Código versionado y aprobaciones')}</span></footer>
</div>
<style>
  :global(body){margin:0;background:#f6f2e7;color:#24392c;font-family:'DM Sans',system-ui,sans-serif}
  :global(*){box-sizing:border-box}
  :global(a:focus-visible){outline:3px solid #c47447;outline-offset:4px}
  .shell{min-width:0;overflow-wrap:break-word}.masthead{height:84px;padding:0 clamp(18px,6vw,110px);display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d5d1c5;background:#faf8f2}
  .wordmark{font-weight:800;font-size:20px;letter-spacing:-.7px;text-decoration:none;color:#213a2c}.wordmark span{color:#b56243}.wordmark small{font-size:11px;letter-spacing:1.1px;margin-left:7px}.top-links{display:flex;gap:28px;align-items:center}.internal,.eyebrow,.workflow .heading>span,.details>div>span{font:700 11px/1.6 'Space Mono',monospace;letter-spacing:1.5px}.internal{color:#776e60}.top-links nav{display:flex;gap:9px;align-items:center}.top-links a{padding:12px 6px;min-height:44px;display:flex;align-items:center;color:#344d39;text-decoration:none;font-size:13px}.top-links a[aria-current='page']{text-decoration:underline;text-underline-offset:5px;color:#b56243}
  .hero{min-height:clamp(590px,77vh,880px);display:grid;grid-template-columns:54% 46%;background:#1a2d22;color:#fff;isolation:isolate}
  .copy{z-index:1;align-self:center;padding:65px clamp(22px,8vw,135px);max-width:900px}.eyebrow{color:#e7ba94}.copy h1{font:400 clamp(58px,6.9vw,106px)/.99 'DM Serif Display',Georgia,serif;letter-spacing:-2px;margin:24px 0}.copy h1 em{font-weight:400;color:#edc59d}.copy p{color:#e5e5d8;font-size:clamp(16px,1.3vw,19px);line-height:1.65;max-width:560px}.primary{display:inline-flex;align-items:center;gap:28px;text-decoration:none;background:#f3e5ca;color:#24392c;font-weight:700;padding:19px 25px;min-height:54px;margin-top:18px}.primary:hover{background:white}.owner-note{font-size:12px;color:#cfd4c7;margin-top:27px;line-height:1.55;max-width:440px}
  .visual{background-image:linear-gradient(90deg,#1a2d2240,#1a2d2200),url('/images/menu-table-hero.webp');background-size:cover;background-position:65% center}
  .workflow{padding:clamp(58px,8vw,115px) clamp(20px,8vw,120px)}.heading{max-width:860px}.workflow .heading>span,.details>div>span{color:#a55438}.workflow h2,.details h2{font:400 clamp(37px,4.5vw,64px)/1.08 'DM Serif Display',Georgia,serif;letter-spacing:-1.3px;margin:15px 0 38px}
  .route{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;border-top:1px solid #b9c2b4}.route>div{padding:25px 28px 10px 0;margin-right:25px;border-right:1px solid #c6c9bd}.route>div:last-child{border-right:0}.route span{font:700 13px 'Space Mono',monospace;color:#a55438}.route h3{font:400 32px Georgia,serif;margin:20px 0 9px}.route p{line-height:1.7;font-size:16px;color:#556153;max-width:315px}
  .details{background:#e7e2d5;padding:clamp(48px,7vw,90px) clamp(20px,8vw,120px);display:grid;grid-template-columns:1fr 1fr;gap:60px}.details p{font-size:17px;line-height:1.85;color:#475347;margin:25px 0 0}
  footer{padding:24px clamp(20px,8vw,120px);font-size:11px;letter-spacing:.5px;display:flex;justify-content:space-between;gap:30px}
  @media(max-width:850px){.hero{grid-template-columns:1fr;display:flex;flex-direction:column-reverse}.visual{height:42svh;min-height:255px;background-position:center}.copy{align-self:auto;padding:44px 6% 70px}.copy h1{font-size:clamp(48px,11vw,78px)}.workflow,.details{padding-left:6%;padding-right:6%}.details{grid-template-columns:1fr;gap:4px}.details p{margin:0}.route{grid-template-columns:1fr}.route>div{border-right:0;border-bottom:1px solid #b9c2b4;padding:22px 0}.route>div:last-child{border-bottom:0}}
  @media(max-width:390px){.masthead{padding:0 15px;height:76px}.wordmark{font-size:17px}.wordmark small{font-size:9px;margin-left:3px}.internal{display:none}.top-links{gap:8px}.copy{padding:32px 6% 55px}.copy h1{font-size:clamp(45px,11.5vw,58px)}.owner-note{line-height:1.5}footer{flex-direction:column;gap:8px}}
</style>