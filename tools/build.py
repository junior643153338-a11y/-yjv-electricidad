import os, json, shutil, html
from datetime import date

OUT = os.path.expanduser("~/electricista/site")
BASE = os.environ.get("BASE", "")
DOMAIN = os.environ.get("DOMAIN", "https://yjv-electricista-madrid.netlify.app") + BASE
BRAND = "YJV Electricidad"
PHONE_DISPLAY = "643 153 338"
PHONE_TEL = "+34643153338"
WA = "34643153338"
TODAY = date.today().isoformat()

CSS = r"""
:root{--bg:#0b1220;--bg2:#111a2e;--card:#16213a;--y:#ffc400;--y2:#ffdb4d;--t:#e8edf7;--m:#a9b4c9;--ok:#25d366;--r:14px}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;background:var(--bg);color:var(--t);line-height:1.6;font-size:17px}
a{color:var(--y)}
img,svg{max-width:100%}
.wrap{max-width:1140px;margin:0 auto;padding:0 20px}
header.top{position:sticky;top:0;z-index:50;background:rgba(11,18,32,.92);backdrop-filter:blur(8px);border-bottom:1px solid #1e2a44}
.nav{display:flex;align-items:center;justify-content:space-between;height:66px;gap:12px}
.logo{display:flex;align-items:center;gap:10px;color:var(--t);text-decoration:none;font-weight:800;font-size:1.15rem;letter-spacing:.2px}
.logo svg{width:36px;height:36px}
.logo span b{color:var(--y)}
.menu{display:flex;gap:22px;align-items:center}
.menu a{color:var(--t);text-decoration:none;font-weight:600;font-size:.95rem}
.menu a:hover{color:var(--y)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 22px;border-radius:999px;font-weight:800;text-decoration:none;border:0;cursor:pointer;font-size:1rem;transition:transform .15s,box-shadow .15s}
.btn:hover{transform:translateY(-2px)}
.btn-y{background:var(--y);color:#111;box-shadow:0 6px 22px rgba(255,196,0,.28)}
.btn-wa{background:var(--ok);color:#fff;box-shadow:0 6px 22px rgba(37,211,102,.25)}
.btn-o{background:transparent;color:var(--t);border:2px solid #34446a}
.btn svg{width:20px;height:20px}
.call-sm{padding:9px 16px;font-size:.92rem}
@media(max-width:860px){.menu a:not(.btn){display:none}}
.logo span,.btn{white-space:nowrap}
@media(max-width:700px){.menu .call-sm{display:none}}
.hero{position:relative;overflow:hidden;padding:72px 0 64px;background:radial-gradient(1000px 500px at 85% -10%,rgba(255,196,0,.18),transparent 60%),linear-gradient(180deg,#0b1220,#0e1729)}
.hero .grid{display:grid;grid-template-columns:1.15fr .85fr;gap:40px;align-items:center}
.badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,196,0,.12);color:var(--y2);border:1px solid rgba(255,196,0,.35);padding:6px 14px;border-radius:999px;font-size:.88rem;font-weight:700;margin-bottom:18px}
.dot{width:8px;height:8px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 4px rgba(37,211,102,.2)}
h1{font-size:clamp(2rem,4.6vw,3.25rem);line-height:1.12;font-weight:900;letter-spacing:-.5px;margin-bottom:16px}
h1 em{font-style:normal;color:var(--y)}
.lead{color:var(--m);font-size:1.13rem;max-width:620px;margin-bottom:28px}
.cta{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:26px}
.ticks{display:flex;flex-wrap:wrap;gap:10px 22px;list-style:none;color:var(--t);font-weight:600;font-size:.95rem}
.ticks li::before{content:"✔";color:var(--y);margin-right:8px}
.hero-art{display:flex;justify-content:center}
@media(max-width:900px){.hero .grid{grid-template-columns:1fr}.hero-art{display:none}}
.hero-art svg{width:100%;max-width:420px;filter:drop-shadow(0 20px 50px rgba(255,196,0,.18))}
section{padding:70px 0}
.alt{background:var(--bg2)}
h2{font-size:clamp(1.6rem,3.2vw,2.3rem);line-height:1.2;font-weight:900;margin-bottom:12px;letter-spacing:-.3px}
h2 em{font-style:normal;color:var(--y)}
.sub{color:var(--m);max-width:700px;margin-bottom:36px}
.center{text-align:center}.center .sub{margin-left:auto;margin-right:auto}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}@media(max-width:900px){.cards{grid-template-columns:1fr 1fr}}@media(max-width:600px){.cards{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid #22304f;border-radius:var(--r);padding:26px;transition:border-color .2s,transform .2s;display:flex;flex-direction:column}
.card:hover{border-color:rgba(255,196,0,.55);transform:translateY(-3px)}
.card .ic{width:52px;height:52px;border-radius:12px;background:rgba(255,196,0,.12);display:grid;place-items:center;margin-bottom:16px}
.card .ic svg{width:28px;height:28px;stroke:var(--y);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.card h3{font-size:1.18rem;margin-bottom:8px}
.card p{color:var(--m);font-size:.97rem;flex:1}
.card a.more{margin-top:14px;font-weight:700;text-decoration:none}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;counter-reset:s}
.step{background:var(--card);border-radius:var(--r);padding:24px;border:1px solid #22304f;position:relative}
.step::before{counter-increment:s;content:counter(s);position:absolute;top:-16px;left:22px;width:36px;height:36px;border-radius:50%;background:var(--y);color:#111;font-weight:900;display:grid;place-items:center}
.step h3{margin:10px 0 6px;font-size:1.08rem}.step p{color:var(--m);font-size:.95rem}
.why{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}@media(max-width:900px){.why{grid-template-columns:1fr 1fr}}@media(max-width:600px){.why{grid-template-columns:1fr}}
.why>div{display:flex;gap:14px;align-items:flex-start;background:var(--card);padding:20px;border-radius:var(--r);border:1px solid #22304f}
.why b{display:block;margin-bottom:4px}.why p{color:var(--m);font-size:.95rem}
.why .ic{width:44px;height:44px;border-radius:10px;background:rgba(255,196,0,.12);display:grid;place-items:center;flex:none}.why .ic svg{width:24px;height:24px;stroke:var(--y);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.zones{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.zones a,.zones span{background:var(--card);border:1px solid #2a3a5e;color:var(--t);padding:9px 16px;border-radius:999px;text-decoration:none;font-weight:600;font-size:.95rem}
.zones a:hover{border-color:var(--y);color:var(--y)}
.urg{background:linear-gradient(135deg,#ffc400,#ffaa00);color:#111;border-radius:20px;padding:36px;display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between}
.urg h2{color:#111;margin:0}.urg p{font-weight:600;max-width:600px}
.urg .btn-d{background:#111;color:#fff}
form.f{background:var(--card);border:1px solid #22304f;border-radius:20px;padding:28px;display:grid;gap:14px}
.f label{font-weight:700;font-size:.93rem;display:block;margin-bottom:6px}
.f input,.f select,.f textarea{width:100%;padding:13px 14px;border-radius:10px;border:1px solid #2f3f63;background:#0e1729;color:var(--t);font-size:1rem;font-family:inherit}
.f input:focus,.f select:focus,.f textarea:focus{outline:2px solid var(--y);border-color:transparent}
.f .row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:600px){.f .row{grid-template-columns:1fr}}
.f small{color:var(--m)}
.contact{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:start}
@media(max-width:860px){.contact{grid-template-columns:1fr}}
.cinfo{display:grid;gap:14px}
.cinfo>a,.cinfo>div{display:flex;gap:14px;align-items:center;background:var(--card);border:1px solid #22304f;border-radius:var(--r);padding:18px;text-decoration:none;color:var(--t)}
.cinfo svg{width:26px;height:26px;flex:none}
.cinfo b{display:block}.cinfo span{color:var(--m);font-size:.93rem}
details{background:var(--card);border:1px solid #22304f;border-radius:var(--r);padding:18px 20px;margin-bottom:12px}
summary{cursor:pointer;font-weight:700;list-style:none;display:flex;justify-content:space-between;gap:12px}
summary::after{content:"+";color:var(--y);font-size:1.4rem;line-height:1}
details[open] summary::after{content:"–"}
details p{color:var(--m);margin-top:10px}
.content{max-width:820px}
.content h2{margin-top:34px}.content p,.content li{color:#cdd6e6;margin-bottom:12px}
.content ul,.content ol{padding-left:22px}
.crumbs{font-size:.9rem;color:var(--m);margin-bottom:16px}.crumbs a{color:var(--m)}
footer{background:#070c17;padding:46px 0 90px;color:var(--m);font-size:.93rem;border-top:1px solid #1a2540}
.fgrid{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:28px}
@media(max-width:760px){.fgrid{grid-template-columns:1fr}}
footer h4{color:var(--t);margin-bottom:10px}
footer ul{list-style:none}footer li{margin-bottom:6px}
footer a{color:var(--m);text-decoration:none}footer a:hover{color:var(--y)}
.copy{border-top:1px solid #1a2540;margin-top:28px;padding-top:18px}
.wa-float{position:fixed;left:18px;bottom:18px;z-index:60;width:60px;height:60px;border-radius:50%;background:var(--ok);display:grid;place-items:center;box-shadow:0 8px 26px rgba(0,0,0,.4);animation:pulse 2.4s infinite}
.wa-float svg{width:32px;height:32px;fill:#fff}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(37,211,102,.55)}70%{box-shadow:0 0 0 16px rgba(37,211,102,0)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}}
.mbar{display:none}
@media(max-width:700px){.mbar{display:grid;grid-template-columns:1fr 1fr;position:fixed;bottom:0;left:0;right:0;z-index:55}.mbar a{padding:15px;text-align:center;font-weight:800;text-decoration:none}.mbar .c{background:var(--y);color:#111}.mbar .w{background:var(--ok);color:#fff}.wa-float{display:none}footer{padding-bottom:110px}}
"""

WA_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.5.7 4.8 1.9 6.8L3 29l6.8-2.1c1.9 1 4 1.6 6.2 1.6 7 0 12.7-5.7 12.7-12.7C28.7 8.6 23 3 16 3zm0 23.2c-2 0-3.9-.6-5.6-1.6l-.4-.2-4 1.2 1.3-3.9-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.3 9.8 10.1 5.2 16 5.2s10.6 4.7 10.6 10.4S21.9 26.2 16 26.2zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.7 5 .8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>'
PH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>'
LOGO_SVG = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#ffc400"/><path d="M36 6 14 36h14l-4 22 26-32H35z" fill="#111"/></svg>'
HERO_SVG = '''<svg viewBox="0 0 400 400" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffdb4d"/><stop offset="1" stop-color="#ff9f00"/></linearGradient></defs>
<circle cx="200" cy="200" r="170" fill="#16213a" stroke="#2a3a5e" stroke-width="3"/>
<circle cx="200" cy="200" r="128" fill="none" stroke="#ffc400" stroke-opacity=".25" stroke-width="2" stroke-dasharray="6 10"/>
<path d="M222 70 132 214h60l-20 116 98-156h-62z" fill="url(#g)"/>
<g stroke="#ffc400" stroke-width="5" stroke-linecap="round"><path d="M70 120l24 12M60 200h28M70 280l24-12M330 120l-24 12M340 200h-28M330 280l-24-12"/></g></svg>'''

ICONS = {
 "bolt":'<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
 "alert":'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
 "panel":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7v4M11 7v4M15 7v4M7 15h10"/>',
 "home":'<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
 "bulb":'<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
 "car":'<path d="M5 17h14M6 17v2M18 17v2M4 13l2-6h12l2 6v4H4z"/><path d="M8 13h.01M16 13h.01"/>',
 "plug":'<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
 "euro":'<path d="M18 7a7 7 0 1 0 0 10M4 10h10M4 14h10"/>',
 "sparkle":'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
 "doc":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
 "pin":'<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
 "shield":'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
}
def icon(n): return f'<svg viewBox="0 0 24 24">{ICONS[n]}</svg>'

SERVICES = [
 dict(slug="electricista-urgente-madrid", guide="por-que-salta-el-diferencial", icon="alert", short="Urgencias y averías",
  title="Electricista urgente en Madrid | Averías y apagones",
  h1="Electricista <em>urgente</em> en Madrid",
  desc="¿Se ha ido la luz o salta el diferencial? Electricista urgente en Madrid y alrededores: localizamos la avería y la reparamos con seguridad.",
  card="Se va la luz, salta el diferencial o un enchufe no funciona. Localizamos la avería y la reparamos rápido y con seguridad.",
  body=[("Averías eléctricas que solucionamos","ul",["Apagones totales o parciales en la vivienda o el local","El diferencial o el magnetotérmico salta y no se puede subir","Enchufes, interruptores o puntos de luz que no funcionan","Cables recalentados, chispas u olor a quemado","Cortocircuitos tras una tormenta, una fuga de agua o una obra"]),
        ("Qué hacer mientras llegamos","ul",["Si huele a quemado o ves chispas, baja el interruptor general del cuadro","No toques cables ni aparatos mojados","Desenchufa los electrodomésticos de la zona afectada","Escríbenos por WhatsApp con una foto del cuadro eléctrico: nos ayuda a llevar el material correcto"]),
        ("Cómo trabajamos","p","Te respondemos lo antes posible, te damos una idea del coste antes de empezar y, una vez en casa, buscamos el origen del fallo con aparatos de medida. No cambiamos piezas a ciegas: reparamos la causa para que la avería no se repita.")],
  faq=[("¿Cuánto cuesta un electricista urgente?","Depende de la avería, el horario y el material. Antes de ir te damos una estimación por teléfono o WhatsApp para que no haya sorpresas."),
       ("¿Por qué salta el diferencial?","Normalmente por un aparato o un circuito con fuga a tierra (humedad, un electrodoméstico averiado o un cable dañado). Lo localizamos desconectando circuitos y midiendo el aislamiento.")]),
 dict(slug="instalaciones-electricas-madrid", guide="cuando-renovar-la-instalacion-electrica", icon="home", short="Instalaciones y reformas",
  title="Instalaciones eléctricas en Madrid | Reformas de pisos",
  h1="Instalaciones eléctricas y <em>reformas</em> en Madrid",
  desc="Instalación eléctrica nueva o renovación completa en pisos, casas y locales de Madrid: cableado, enchufes, puntos de luz y circuitos. Presupuesto gratis.",
  card="Instalación nueva o renovación completa en pisos, casas y locales: cableado, enchufes, puntos de luz y circuitos.",
  body=[("Qué incluye","ul",["Renovación completa de la instalación eléctrica de pisos antiguos","Instalación eléctrica en reformas de cocina y baño","Nuevos enchufes, puntos de luz, interruptores y conmutados","Circuitos independientes para horno, vitrocerámica, aire acondicionado o termo","Instalaciones para locales comerciales y oficinas"]),
        ("¿Cuándo conviene renovar la instalación?","p","Si tu vivienda tiene más de 30 años, los enchufes no tienen toma de tierra, saltan los automáticos cuando enciendes varios aparatos o sigues teniendo fusibles de rosca, es momento de renovar. Una instalación actualizada es más segura y te permite usar los electrodomésticos actuales sin problemas."),
        ("Trabajo limpio y ordenado","p","Planificamos el trabajo contigo, protegemos suelos y muebles y dejamos todo recogido al terminar. Te explicamos qué hemos hecho y cómo queda el cuadro eléctrico.")],
  faq=[("¿Cuánto tarda renovar la instalación de un piso?","En un piso estándar suele llevar varios días, según el tamaño y si se hace con obra o aprovechando tubos existentes. Te damos el plazo exacto en el presupuesto."),
       ("¿Hay que hacer obra?","No siempre. Muchas veces se puede recablear por los tubos existentes o con canaleta decorativa. Lo valoramos en la visita.")]),
 dict(slug="cuadros-electricos-madrid", guide="senales-cambiar-cuadro-electrico", icon="panel", short="Cuadros eléctricos",
  title="Cambio de cuadro eléctrico en Madrid | Diferenciales",
  h1="Cambio y reparación de <em>cuadros eléctricos</em> en Madrid",
  desc="Cambio de cuadro eléctrico, diferenciales y magnetotérmicos en Madrid. Sustituimos fusibles antiguos y separamos circuitos. Presupuesto gratis.",
  card="Sustitución de cuadros antiguos, diferenciales y automáticos. Protecciones adecuadas para cada circuito.",
  body=[("Servicios de cuadro eléctrico","ul",["Sustitución de cuadros antiguos con fusibles por cuadros modernos","Instalación o cambio de diferenciales y magnetotérmicos","Separación de circuitos para que no salte todo a la vez","Protección contra sobretensiones","Revisión y reapriete de conexiones para evitar calentamientos"]),
        ("Señales de que tu cuadro necesita un cambio","ul",["Todavía tiene fusibles de porcelana o de rosca","No tiene interruptor diferencial","Salta con frecuencia o notas los mecanismos calientes","Has añadido aparatos potentes (aire acondicionado, placa de inducción, coche eléctrico)"])],
  faq=[("¿Qué es el diferencial y por qué es tan importante?","Es el dispositivo que corta la corriente si detecta una fuga, por ejemplo cuando una persona toca algo con tensión. Es la protección principal contra electrocuciones."),
       ("¿Se queda la casa sin luz mucho tiempo?","El cambio de un cuadro suele hacerse en unas horas. Te avisamos antes para que lo organices.")]),
 dict(slug="iluminacion-led-madrid", guide="elegir-iluminacion-led-casa", icon="bulb", short="Iluminación LED",
  title="Instalación de iluminación LED en Madrid",
  h1="Instalación de <em>iluminación LED</em> en Madrid",
  desc="Focos empotrados, tiras LED, lámparas y luz exterior en Madrid. Una iluminación bonita y eficiente que baja tu factura de luz.",
  card="Focos empotrados, tiras LED, lámparas y luz exterior. Más luz, mejor ambiente y menos gasto.",
  body=[("Qué instalamos","ul",["Focos LED empotrados en falso techo","Tiras LED en cocinas, techos y muebles","Lámparas, apliques y ventiladores de techo","Iluminación exterior, terrazas y jardines","Sensores de movimiento y reguladores de intensidad"]),
        ("Ventajas del LED","p","Las luces LED consumen mucho menos que las bombillas tradicionales y duran años. Además, eligiendo bien la temperatura de color y la posición de cada punto de luz, tu casa o tu negocio ganan mucho en aspecto.")],
  faq=[("¿Se pueden poner focos sin falso techo?","Sí, hay opciones de superficie y carriles. Te proponemos la mejor según tu techo."),
       ("¿Cambiar a LED ahorra de verdad?","Sí, el consumo en iluminación baja de forma notable frente a halógenos o incandescentes.")]),
 dict(slug="punto-de-recarga-coche-electrico-madrid", guide="cargador-coche-electrico-garaje-comunitario", icon="car", short="Cargador coche eléctrico",
  title="Instalar cargador de coche eléctrico en Madrid",
  h1="Instalación de <em>cargador de coche eléctrico</em> en Madrid",
  desc="Instalamos puntos de recarga para coche eléctrico en garajes de chalets y comunidades de Madrid. Te asesoramos sobre potencia y modelo de cargador.",
  card="Puntos de recarga en garajes particulares y comunitarios. Asesoramiento sobre potencia y modelo.",
  body=[("Cómo lo hacemos","ul",["Estudiamos tu instalación y la potencia contratada","Te recomendamos el cargador adecuado para tu coche","Instalamos un circuito exclusivo con sus protecciones","Configuramos el cargador y comprobamos que funciona correctamente"]),
        ("Garajes comunitarios","p","En un garaje de comunidad solo necesitas comunicarlo a la comunidad de propietarios. Te ayudamos a planificar el recorrido del cable desde tu contador hasta tu plaza.")],
  faq=[("¿Necesito subir la potencia contratada?","Depende de tu consumo y del cargador. Muchas veces basta con un cargador con gestión de potencia. Lo revisamos sin compromiso."),
       ("¿Cuánto tarda la instalación?","Normalmente se realiza en una jornada, según la distancia y el tipo de garaje.")]),
 dict(slug="enchufes-y-puntos-de-luz-madrid", guide="por-que-salta-el-diferencial", icon="plug", short="Enchufes y puntos de luz",
  title="Enchufes y puntos de luz en Madrid | Pequeños trabajos",
  h1="Enchufes, interruptores y <em>pequeños trabajos</em> eléctricos en Madrid",
  desc="¿Un enchufe nuevo, mover un punto de luz o colgar una lámpara? Electricista en Madrid para pequeños trabajos eléctricos, rápido y con precio claro.",
  card="Añadir o mover enchufes, colgar lámparas, cambiar mecanismos, timbres y portero.",
  body=[("Trabajos habituales","ul",["Añadir o mover enchufes e interruptores","Colgar lámparas, apliques y ventiladores","Cambiar mecanismos antiguos por modernos","Instalar enchufes USB, de exterior o para el televisor","Timbres, porteros y videoporteros"]),
        ("Agrupa trabajos y ahorra","p","Si tienes varias cosas pendientes, envíanos una lista por WhatsApp y las hacemos en la misma visita.")],
  faq=[("¿Hacéis trabajos pequeños?","Sí. Muchos clientes nos llaman para un solo enchufe o una lámpara. Te damos precio antes de ir."),
       ("¿Puedo mandar fotos para el presupuesto?","Claro, por WhatsApp. Con unas fotos normalmente podemos darte una estimación.")]),
]

CITIES = [
 ("electricista-madrid-capital","Madrid capital","Carabanchel, Latina, Usera, Arganzuela, Villaverde, Puente de Vallecas, Centro y resto de distritos",
  "En Madrid capital trabajamos mucho en pisos de edificios con años, donde todavía es habitual encontrar enchufes sin toma de tierra, cuadros con muy pocos circuitos o un cableado que no está pensado para la placa de inducción, el aire acondicionado o el termo eléctrico de hoy. También atendemos locales comerciales, oficinas y comunidades de vecinos (portales, escaleras y garajes)."),
 ("electricista-getafe","Getafe","Getafe centro, Sector III, Juan de la Cierva, Las Margaritas, El Bercial, Perales del Río y Los Molinos",
  "En Getafe conviven pisos de los barrios de toda la vida, como Las Margaritas o Juan de la Cierva, con viviendas más nuevas en El Bercial o Los Molinos y con locales y naves de sus polígonos. En los pisos antiguos lo más habitual es renovar la instalación o el cuadro; en las viviendas nuevas, iluminación LED, enchufes extra y cargadores en el garaje."),
 ("electricista-leganes","Leganés","Leganés centro, Zarzaquemada, San Nicasio, El Carrascal, La Fortuna, Arroyo Culebro y Valdepelayo",
  "Buena parte de los pisos de Zarzaquemada, San Nicasio o La Fortuna se construyeron hace décadas, así que muchas llamadas en Leganés son para cambiar el cuadro, añadir circuitos o resolver un diferencial que salta. En zonas más recientes como Arroyo Culebro o Valdepelayo son más frecuentes la iluminación LED y los puntos de recarga en garaje comunitario."),
 ("electricista-alcorcon","Alcorcón","Alcorcón centro, Parque Lisboa, Parque Oeste, Ensanche Sur, San José de Valderas y Campodón",
  "En Alcorcón hay dos realidades: los bloques de San José de Valderas, Parque Lisboa o el centro, donde muchas instalaciones piden una actualización, y las viviendas del Ensanche Sur o los chalets de Campodón, donde nos piden más iluminación, enchufes para terraza y jardín o cargador para el coche."),
 ("electricista-mostoles","Móstoles","Móstoles centro, Parque Coimbra, Estoril, El Soto, Villafontana y PAU 4",
  "En Móstoles atendemos desde pisos del centro, Estoril o El Soto, con instalaciones de hace años que necesitan más circuitos y protecciones, hasta viviendas nuevas del PAU 4 y chalets de Parque Coimbra, donde son habituales la iluminación exterior, la domótica sencilla y los puntos de recarga."),
 ("electricista-fuenlabrada","Fuenlabrada","Fuenlabrada centro, Loranca, El Naranjo, La Avanzada, Parque Miraflores y Hospital",
  "Fuenlabrada combina barrios residenciales consolidados como El Naranjo o La Avanzada, zonas más nuevas como Loranca y una gran actividad comercial e industrial. Por eso trabajamos tanto en viviendas (averías, cuadros, enchufes) como en locales y naves que necesitan ampliar circuitos o mejorar la iluminación."),
 ("electricista-parla","Parla","Parla centro, Parla Este y alrededores",
  "En Parla trabajamos en los pisos del centro, donde suele tocar revisar el cuadro y añadir circuitos para los electrodomésticos actuales, y en las promociones más nuevas de Parla Este, con muchos garajes comunitarios en los que cada vez se piden más cargadores para coche eléctrico."),
 ("electricista-pinto","Pinto","Pinto centro, La Tenería y urbanizaciones cercanas",
  "En Pinto atendemos pisos del casco urbano y también adosados y chalets, donde los trabajos más frecuentes son la iluminación de jardín y fachada, los enchufes exteriores estancos, los circuitos para piscina o trastero y la instalación de cargadores en el garaje."),
 ("electricista-valdemoro","Valdemoro","Valdemoro centro, El Restón y urbanizaciones cercanas",
  "En Valdemoro conviven el casco antiguo con barrios y urbanizaciones más recientes como El Restón. Nos llaman para averías y diferenciales que saltan, para ampliar la instalación al reformar cocina o baño y, cada vez más, para poner un punto de recarga en casa."),
]


GUIDE_DATE = "2026-10-05"
GUIDES = [
 dict(slug="por-que-salta-el-diferencial", service="electricista-urgente-madrid",
  title="¿Por qué salta el diferencial? Causas y qué hacer",
  desc="El diferencial salta y no sube: causas comunes (humedad, un aparato, un cable dañado), cómo encontrar el circuito culpable y cuándo llamar.",
  intro="Que salte el diferencial es una de las averías más comunes en casa. No es un fallo del diferencial: es su trabajo. Corta la corriente cuando detecta que parte de ella se escapa a tierra, algo que puede acabar en una descarga para una persona.",
  sections=[
   ("Causas más habituales","ul",["Un electrodoméstico con una fuga: lavadora, lavavajillas, horno, termo o frigorífico son los sospechosos más frecuentes","Humedad o agua en una caja de enchufe, en una luz de exterior o tras una fuga del vecino de arriba","Un cable pelado o pinzado, a veces tras colgar un cuadro o hacer una pequeña obra","Tormentas o subidas de tensión","Un diferencial viejo o muy sensible que necesita sustitución"]),
   ("Cómo encontrar al culpable paso a paso","ol",["Baja todos los automáticos (los interruptores pequeños) del cuadro","Sube el diferencial. Si no aguanta ni con todo bajado, la avería está en la instalación general: llama a un electricista","Si aguanta, ve subiendo los automáticos de uno en uno. El que hace saltar el diferencial es el circuito con el problema","Deja ese circuito bajado, desenchufa todos los aparatos de esa zona y vuelve a probar. Si ahora aguanta, enchúfalos de uno en uno hasta dar con el aparato"]),
   ("Cuándo no debes seguir probando","p","Si huele a quemado, ves chispas, hay agua cerca del cuadro o de un enchufe, o el diferencial salta nada más subirlo con todo desconectado, no insistas. Deja el general bajado y llama a un electricista: ahí hace falta medir el aislamiento de la instalación con el aparato adecuado."),
   ("Cómo lo resolvemos","p","Localizamos el circuito y el punto exacto de la fuga con medidas de aislamiento, reparamos la causa (caja con humedad, cable dañado o aparato averiado) y, si el cuadro es antiguo, te explicamos si conviene separar circuitos para que una avería no deje toda la casa sin luz.")]),
 dict(slug="senales-cambiar-cuadro-electrico", service="cuadros-electricos-madrid",
  title="Cuándo cambiar el cuadro eléctrico: 7 señales claras",
  desc="Fusibles de rosca, sin diferencial, saltos frecuentes o aparatos nuevos potentes: las señales de que tu cuadro eléctrico se ha quedado pequeño o inseguro.",
  intro="El cuadro eléctrico es el centro de seguridad de tu casa. Si se ha quedado antiguo, no solo es incómodo (salta a menudo), sino que puede no protegerte bien ante una fuga o un cortocircuito.",
  sections=[
   ("7 señales de que toca cambiarlo","ol",["Todavía tiene fusibles de porcelana o de rosca en lugar de automáticos","No tiene interruptor diferencial","Salta con frecuencia cuando enciendes el horno, la placa o el aire a la vez","Todo está en uno o dos circuitos: si falla algo, se queda toda la casa sin luz","Notas los mecanismos calientes, oyes zumbidos o ves marcas oscuras","Has añadido aparatos potentes: inducción, aire acondicionado, termo eléctrico o coche eléctrico","Vas a reformar la cocina, el baño o toda la vivienda"]),
   ("Qué incluye un cambio de cuadro","ul",["Caja nueva con espacio para crecer","Interruptor general y diferencial (o varios, según los circuitos)","Un automático para cada circuito: alumbrado, enchufes, cocina, horno, lavadora, baño, aire acondicionado…","Etiquetado de cada circuito para que sepas qué corta cada interruptor","Comprobación del funcionamiento del diferencial"]),
   ("¿Cuánto se tarda?","p","En una vivienda normal, el cambio del cuadro suele hacerse en unas horas. Si además hay que crear circuitos nuevos o pasar cables, te damos el plazo en el presupuesto. Con unas fotos del cuadro actual por WhatsApp podemos darte una primera estimación.")]),
 dict(slug="cuando-renovar-la-instalacion-electrica", service="instalaciones-electricas-madrid",
  title="¿Cuándo renovar la instalación eléctrica de un piso antiguo?",
  desc="Enchufes sin toma de tierra, cables de tela, automáticos que saltan: cuándo renovar la instalación eléctrica de un piso y cómo hacerlo sin obra.",
  intro="Muchos pisos de Madrid y alrededores tienen instalaciones pensadas para una nevera, una lavadora y poco más. Hoy usamos inducción, horno, aire acondicionado, secadora y muchos cargadores a la vez, y la instalación antigua se queda corta.",
  sections=[
   ("Señales de que tu instalación está anticuada","ul",["Enchufes de dos agujeros, sin toma de tierra","Cables de tela o rígidos y oscurecidos en cajas y mecanismos","Regletas por toda la casa porque faltan enchufes","Automáticos que saltan al usar varios aparatos","Luces que parpadean o bajan al encender un electrodoméstico"]),
   ("¿Hace falta obra?","p","No siempre. Muchas veces se puede recablear aprovechando los tubos existentes, y donde no hay tubo se puede usar canaleta decorativa. Si vas a reformar, es el mejor momento para dejar la instalación nueva por dentro de las paredes."),
   ("Qué ganas al renovarla","ul",["Seguridad: toma de tierra en todos los enchufes y protecciones adecuadas","Comodidad: enchufes donde los necesitas y circuitos que no saltan","Preparación para el futuro: aire acondicionado, inducción o cargador del coche","Más valor si vendes o alquilas la vivienda"]),
   ("Cómo trabajamos","p","Visitamos la vivienda, revisamos el cuadro y los circuitos y te proponemos qué renovar ya y qué puede esperar. El presupuesto es cerrado y por escrito, para que sepas qué vas a pagar antes de empezar.")]),
 dict(slug="cargador-coche-electrico-garaje-comunitario", service="punto-de-recarga-coche-electrico-madrid",
  title="Cargador de coche eléctrico en garaje comunitario: pasos",
  desc="Cómo instalar un punto de recarga en la plaza de un garaje comunitario: comunicación a la comunidad, recorrido del cable, potencia y tipo de cargador.",
  intro="Cada vez más vecinos quieren cargar el coche en su plaza de garaje. La buena noticia: en un garaje comunitario no necesitas el voto de la comunidad para instalar tu propio punto de recarga.",
  sections=[
   ("1. Comunícalo a la comunidad","p","La Ley de Propiedad Horizontal permite instalar un punto de recarga para uso privado en tu plaza con solo comunicarlo previamente a la comunidad (al presidente o al administrador). El coste de la instalación y de la luz que consumas corre de tu cuenta."),
   ("2. Estudiamos el recorrido","p","Lo más habitual es llevar un circuito nuevo desde tu contador, en el cuarto de contadores, hasta tu plaza. Revisamos la distancia, por dónde pasar el cable (bandeja o tubo) y cómo dejarlo protegido y ordenado."),
   ("3. Potencia y tipo de cargador","ul",["Revisamos tu potencia contratada y tu consumo habitual","Un cargador con gestión de potencia evita, muchas veces, tener que subir la potencia","Te recomendamos un modelo compatible con tu coche y con la potencia que puedes usar","Si cargas de noche, puede compensarte una tarifa con discriminación horaria"]),
   ("4. Instalación y prueba","p","Instalamos el circuito exclusivo con sus protecciones según la ITC-BT-52 del Reglamento Electrotécnico de Baja Tensión, montamos y configuramos el cargador y hacemos una carga de prueba contigo. Normalmente se hace en una jornada.")]),
 dict(slug="elegir-iluminacion-led-casa", service="iluminacion-led-madrid",
  title="Cómo elegir la iluminación LED de casa: guía sencilla",
  desc="Luz cálida o fría, cuántos lúmenes, focos empotrados o tiras LED: claves para elegir la iluminación LED de cada estancia y ahorrar en la factura.",
  intro="Cambiar a LED baja el consumo de la iluminación y, bien elegido, mejora mucho el aspecto de la casa. La clave está en elegir el tono de luz y la cantidad adecuada para cada estancia.",
  sections=[
   ("Temperatura de color: cálida, neutra o fría","ul",["Luz cálida (en torno a 2700-3000 K): salón y dormitorios, ambiente acogedor","Luz neutra (en torno a 4000 K): cocina, baño y zonas de trabajo","Luz fría (5000 K o más): garajes, trasteros y talleres"]),
   ("Fíjate en los lúmenes, no en los vatios","p","Los vatios indican lo que consume la bombilla; los lúmenes, cuánta luz da. Para comparar bombillas LED mira siempre los lúmenes y elige el mismo tono en toda una estancia para que no quede una luz de cada color."),
   ("Qué tipo de luminaria poner","ul",["Focos empotrados: ideales en falso techo de cocinas, pasillos y baños","Tiras LED: bajo muebles de cocina, techos indirectos o cabeceros","Carriles y focos de superficie: si no tienes falso techo","Luz exterior con sensor: terrazas, jardines y entradas"]),
   ("Te lo dejamos hecho","p","Te ayudamos a decidir dónde colocar cada punto de luz, instalamos reguladores o sensores si quieres y dejamos todo conectado y probado.")]),
]

GENERAL_FAQ = [
 ("¿El presupuesto tiene coste?","No. Te damos presupuesto sin compromiso. Para trabajos sencillos, con unas fotos por WhatsApp suele bastar."),
 ("¿En qué zonas trabajáis?","En Madrid capital y alrededores: Getafe, Leganés, Alcorcón, Móstoles, Fuenlabrada, Parla, Pinto, Valdemoro y otros municipios cercanos. Si estás en otra zona, pregúntanos."),
 ("¿Atendéis urgencias?","Sí. Si tienes una avería, llámanos o escríbenos por WhatsApp y te diremos cuándo podemos ir lo antes posible."),
 ("¿Los trabajos tienen garantía?","Sí, todos los trabajos y materiales que instalamos tienen garantía. Si algo falla por nuestra instalación, volvemos sin coste."),
 ("¿Cómo puedo pagar?","Te indicamos las formas de pago al darte el presupuesto. Siempre entregamos factura del trabajo."),
]

def fit_title(t, limit=60):
    full = f"{t} | {BRAND}"
    return full if len(full) <= limit else t

def check_meta(title, desc, path):
    if len(title) > 62 or len(desc) > 158: print("AVISO meta larga:", path, len(title), len(desc))

def guide_cards():
    return "".join(f'<article class="card"><div class="ic">{icon("doc")}</div><h3>{html.escape(g["title"])}</h3><p>{html.escape(g["desc"])}</p><a class="more" href="/consejos/{g["slug"]}/">Leer →</a></article>' for g in GUIDES)

def wa_link(text): 
    from urllib.parse import quote
    return f"https://wa.me/{WA}?text={quote(text)}"

def head(title, desc, path, extra_ld=None):
    check_meta(title, desc, path)
    url = DOMAIN + path
    ld = {"@context":"https://schema.org","@type":"Electrician","@id":DOMAIN+"/#negocio","name":BRAND,"url":DOMAIN+"/",
          "telephone":PHONE_TEL,"image":DOMAIN+"/og-image.jpg","logo":DOMAIN+"/icon-512.png","priceRange":"€€",
          "areaServed":[{"@type":"City","name":c[1].replace(" capital","")} for c in CITIES],
          "address":{"@type":"PostalAddress","addressLocality":"Madrid","addressRegion":"Comunidad de Madrid","addressCountry":"ES"},
          "makesOffer":[{"@type":"Offer","itemOffered":{"@type":"Service","name":s["short"]}} for s in SERVICES]}
    lds = [ld] + (extra_ld or [])
    ldtxt = "\n".join(f'<script type="application/ld+json">{json.dumps(x,ensure_ascii=False)}</script>' for x in lds)
    return f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#0b1220">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:locale" content="es_ES"><meta property="og:site_name" content="YJV Electricidad">
<meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{DOMAIN}/og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="YJV Electricidad, electricista en Madrid y alrededores">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{html.escape(title)}"><meta name="twitter:description" content="{html.escape(desc)}"><meta name="twitter:image" content="{DOMAIN}/og-image.jpg">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-48.png" sizes="48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest">
<link rel="stylesheet" href="/styles.css">
{ldtxt}
</head>
<body>
<header class="top"><div class="wrap nav">
<a class="logo" href="/" aria-label="{BRAND} inicio">{LOGO_SVG}<span>YJV <b>Electricidad</b></span></a>
<nav class="menu"><a href="/#servicios">Servicios</a><a href="/#zonas">Zonas</a><a href="/consejos/">Consejos</a><a href="/#preguntas">Preguntas</a><a href="/#contacto">Contacto</a>
<a class="btn btn-y call-sm" href="tel:{PHONE_TEL}">{PH_SVG}{PHONE_DISPLAY}</a></nav>
</div></header>
<main>
"""

def foot():
    sv = "".join(f'<li><a href="/{s["slug"]}/">{s["short"]}</a></li>' for s in SERVICES)
    zs = "".join(f'<li><a href="/{c[0]}/">Electricista en {c[1]}</a></li>' for c in CITIES)
    gs = "".join(f'<li><a href="/consejos/{g["slug"]}/">{g["title"].split(":")[0].split("?")[0].strip("¿")}</a></li>' for g in GUIDES)
    return f"""</main>
<footer><div class="wrap">
<div class="fgrid">
<div><a class="logo" href="/">{LOGO_SVG}<span>YJV <b>Electricidad</b></span></a>
<p style="margin-top:12px">Electricista en Madrid y alrededores. Averías, instalaciones, cuadros eléctricos, iluminación y puntos de recarga. Presupuesto sin compromiso.</p>
<p style="margin-top:12px"><a href="tel:{PHONE_TEL}">Tel. {PHONE_DISPLAY}</a> · <a href="https://wa.me/{WA}">WhatsApp</a></p></div>
<div><h4>Servicios</h4><ul>{sv}</ul></div>
<div><h4>Zonas</h4><ul>{zs}</ul></div>
<div><h4><a href="/consejos/">Consejos</a></h4><ul>{gs}</ul></div>
</div>
<div class="copy">© {date.today().year} {BRAND} · <a href="/privacidad/">Privacidad y aviso legal</a></div>
</div></footer>
<a class="wa-float" href="{wa_link('Hola, necesito un electricista.')}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">{WA_SVG}</a>
<div class="mbar"><a class="c" href="tel:{PHONE_TEL}">Llamar ahora</a><a class="w" href="{wa_link('Hola, necesito un electricista.')}" target="_blank" rel="noopener">WhatsApp</a></div>
<script>
document.querySelectorAll('form.f').forEach(function(f){{f.addEventListener('submit',function(e){{e.preventDefault();
var d=new FormData(f),t='Hola, quiero pedir presupuesto de electricista.%0A';
t+='*Nombre:* '+encodeURIComponent(d.get('nombre')||'')+'%0A';
t+='*Zona:* '+encodeURIComponent(d.get('zona')||'')+'%0A';
t+='*Servicio:* '+encodeURIComponent(d.get('servicio')||'')+'%0A';
t+='*Urgencia:* '+encodeURIComponent(d.get('urgencia')||'')+'%0A';
t+='*Detalle:* '+encodeURIComponent(d.get('detalle')||'');
window.open('https://wa.me/{WA}?text='+t,'_blank');}});}});
if('serviceWorker' in navigator){{navigator.serviceWorker.register('/sw.js');}}
</script>
</body></html>"""

def form(default_zone=""):
    so = "".join(f"<option>{s['short']}</option>" for s in SERVICES) + "<option>Otro trabajo</option>"
    zo = "".join(f"<option{' selected' if c[1]==default_zone else ''}>{c[1]}</option>" for c in CITIES) + "<option>Otra zona</option>"
    return f"""<form class="f" id="presupuesto" aria-label="Pedir presupuesto">
<h3 style="font-size:1.35rem">Pide tu presupuesto gratis</h3>
<small>Rellena y se abrirá WhatsApp con tu mensaje listo para enviar.</small>
<div class="row"><div><label for="n">Nombre</label><input id="n" name="nombre" required autocomplete="name" placeholder="Tu nombre"></div>
<div><label for="z">Zona</label><select id="z" name="zona">{zo}</select></div></div>
<div class="row"><div><label for="s">Servicio</label><select id="s" name="servicio">{so}</select></div>
<div><label for="u">¿Es urgente?</label><select id="u" name="urgencia"><option>Sí, es urgente</option><option selected>Esta semana</option><option>Sin prisa, quiero presupuesto</option></select></div></div>
<div><label for="d">Cuéntanos qué necesitas</label><textarea id="d" name="detalle" rows="4" placeholder="Ej.: salta el diferencial al encender el horno"></textarea></div>
<button class="btn btn-wa" type="submit">{WA_SVG}Enviar por WhatsApp</button>
</form>"""

def contact_block(zone=""):
    return f"""<section id="contacto"><div class="wrap contact">
<div><h2>¿Hablamos? <em>Te respondemos rápido</em></h2>
<p class="sub">Llama, escribe por WhatsApp o rellena el formulario. Cuéntanos qué pasa y, si puedes, envía una foto: así llegamos con el material adecuado.</p>
<div class="cinfo">
<a href="tel:{PHONE_TEL}"><span style="color:var(--y)">{PH_SVG}</span><div><b>{PHONE_DISPLAY}</b><span>Llamada directa</span></div></a>
<a href="{wa_link('Hola, necesito un electricista.')}" target="_blank" rel="noopener"><span style="fill:var(--ok)">{WA_SVG}</span><div><b>WhatsApp</b><span>Envía fotos de la avería</span></div></a>
<div><span style="color:var(--y)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg></span><div><b>Madrid y alrededores</b><span>Getafe, Leganés, Alcorcón, Móstoles, Fuenlabrada, Parla, Pinto, Valdemoro…</span></div></div>
</div></div>
{form(zone)}
</div></section>"""

def faq_html(items):
    return "".join(f"<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>" for q,a in items)

def faq_ld(items):
    return {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in items]}

def crumbs_ld(name, path):
    return {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Inicio","item":DOMAIN+"/"},
        {"@type":"ListItem","position":2,"name":name,"item":DOMAIN+path}]}

def service_cards():
    return "".join(f'<article class="card"><div class="ic">{icon(s["icon"])}</div><h3>{s["short"]}</h3><p>{s["card"]}</p><a class="more" href="/{s["slug"]}/">Ver más →</a></article>' for s in SERVICES)

def zones():
    return "".join(f'<a href="/{c[0]}/">{c[1]}</a>' for c in CITIES)

STEPS = """<div class="steps">
<div class="step"><h3>Nos cuentas qué pasa</h3><p>Por teléfono o WhatsApp. Si puedes, mándanos una foto o un vídeo corto.</p></div>
<div class="step"><h3>Presupuesto claro</h3><p>Te decimos el precio antes de empezar. Sin compromiso y sin letra pequeña.</p></div>
<div class="step"><h3>Trabajo seguro</h3><p>Reparamos o instalamos con material de calidad, cumpliendo la normativa (REBT).</p></div>
<div class="step"><h3>Garantía y factura</h3><p>Comprobamos que todo funciona, dejamos limpio y te damos factura con garantía.</p></div>
</div>"""

def why(): return f"""<div class="why">
<div><span class="ic">{icon("bolt")}</span><div><b>Respuesta rápida</b><p>Contestamos enseguida y priorizamos las urgencias.</p></div></div>
<div><span class="ic">{icon("euro")}</span><div><b>Precio cerrado</b><p>Sabes lo que vas a pagar antes de empezar.</p></div></div>
<div><span class="ic">{icon("shield")}</span><div><b>Seguridad ante todo</b><p>Instalaciones según el Reglamento Electrotécnico de Baja Tensión.</p></div></div>
<div><span class="ic">{icon("sparkle")}</span><div><b>Limpios y puntuales</b><p>Protegemos tu casa y dejamos todo recogido.</p></div></div>
<div><span class="ic">{icon("doc")}</span><div><b>Factura y garantía</b><p>Todos los trabajos con factura y garantía.</p></div></div>
<div><span class="ic">{icon("pin")}</span><div><b>Cerca de ti</b><p>Madrid capital y alrededores.</p></div></div>
</div>"""

def urg():
    return f"""<section style="padding-top:0"><div class="wrap"><div class="urg">
<div><h2>¿Se ha ido la luz? ¿Salta el diferencial?</h2><p>No te arriesgues. Llámanos ahora y te ayudamos a solucionarlo de forma segura.</p></div>
<div class="cta" style="margin:0"><a class="btn btn-d" href="tel:{PHONE_TEL}">{PH_SVG}Llamar ahora</a></div>
</div></div></section>"""

def rebase(content):
    return content.replace('href="/', f'href="{BASE}/').replace("register('/sw.js')", f"register('{BASE}/sw.js')")

def write(path, content):
    content = rebase(content)
    p = os.path.join(OUT, path.strip("/"), "index.html") if path.endswith("/") and path != "/" else os.path.join(OUT, "index.html" if path=="/" else path.strip("/"))
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p,"w",encoding="utf-8").write(content)

def build():
    if os.path.exists(OUT): shutil.rmtree(OUT)
    os.makedirs(OUT)
    open(os.path.join(OUT,"styles.css"),"w").write(CSS.strip())
    pages = ["/"]
    # Home
    title = "Electricista en Madrid y alrededores | YJV Electricidad"
    desc = "Electricista en Madrid, Getafe, Leganés, Alcorcón, Móstoles y alrededores: averías urgentes, instalaciones, cuadros, LED y cargadores. Presupuesto gratis."
    h = head(title, desc, "/", [faq_ld(GENERAL_FAQ), {"@context":"https://schema.org","@type":"WebSite","name":BRAND,"url":DOMAIN+"/","inLanguage":"es-ES","publisher":{"@id":DOMAIN+"/#negocio"}}])
    h += f"""<section class="hero"><div class="wrap grid"><div>
<span class="badge"><span class="dot"></span>Atendemos urgencias en Madrid y alrededores</span>
<h1>Tu <em>electricista</em> de confianza en Madrid</h1>
<p class="lead">Averías, instalaciones nuevas, cuadros eléctricos, iluminación LED y cargadores para coche eléctrico. Trabajo seguro, precio claro antes de empezar y garantía en todo lo que hacemos.</p>
<div class="cta"><a class="btn btn-y" href="tel:{PHONE_TEL}">{PH_SVG}Llamar {PHONE_DISPLAY}</a>
<a class="btn btn-wa" href="{wa_link('Hola, necesito un electricista.')}" target="_blank" rel="noopener">{WA_SVG}WhatsApp</a>
<a class="btn btn-o" href="#presupuesto">Presupuesto gratis</a></div>
<ul class="ticks"><li>Presupuesto sin compromiso</li><li>Factura y garantía</li><li>Normativa REBT</li></ul>
</div><div class="hero-art">{HERO_SVG}</div></div></section>
<section id="servicios" class="alt"><div class="wrap center">
<h2>Servicios de <em>electricidad</em></h2><p class="sub">Desde un enchufe que no funciona hasta la instalación completa de tu vivienda o negocio.</p>
<div class="cards" style="text-align:left">{service_cards()}</div></div></section>
<section><div class="wrap center"><h2>Así de <em>fácil</em></h2><p class="sub">Un proceso claro, sin sorpresas.</p>{STEPS}</div></section>
{urg()}
<section class="alt"><div class="wrap center"><h2>¿Por qué elegir <em>YJV Electricidad</em>?</h2><p class="sub">Lo que nos piden nuestros clientes: que llegue rápido, que lo deje bien y que el precio sea el que se dijo.</p><div style="text-align:left">{why()}</div></div></section>
<section id="zonas"><div class="wrap center"><h2>Electricista <em>cerca de ti</em></h2><p class="sub">Trabajamos en Madrid capital y alrededores.</p><div class="zones">{zones()}</div></div></section>
<section><div class="wrap center"><h2>Consejos de <em>electricista</em></h2><p class="sub">Guías claras para entender tu instalación y saber cuándo llamar a un profesional.</p><div class="cards" style="text-align:left">{guide_cards()}</div><p style="margin-top:22px"><a class="btn btn-o" href="/consejos/">Ver todos los consejos</a></p></div></section>
<section id="preguntas" class="alt"><div class="wrap content" style="margin:0 auto"><h2 class="center" style="margin-top:0">Preguntas <em>frecuentes</em></h2><div style="margin-top:24px">{faq_html(GENERAL_FAQ)}</div></div></section>
{contact_block()}
"""
    write("/", h + foot())
    # Services
    for s in SERVICES:
        path = f"/{s['slug']}/"; pages.append(path)
        faqs = s["faq"] + GENERAL_FAQ[:2]
        h = head(fit_title(s["title"]), s["desc"], path, [faq_ld(faqs), crumbs_ld(s["short"], path),
             {"@context":"https://schema.org","@type":"Service","name":s["short"],"serviceType":s["short"],"provider":{"@id":DOMAIN+"/#negocio"},"areaServed":"Madrid"}])
        body = ""
        for t, kind, c in s["body"]:
            body += f"<h2>{t}</h2>" + ("<ul>"+"".join(f"<li>{x}</li>" for x in c)+"</ul>" if kind=="ul" else f"<p>{c}</p>")
        others = "".join(f'<a href="/{o["slug"]}/">{o["short"]}</a>' for o in SERVICES if o is not s)
        h += f"""<section class="hero" style="padding:54px 0 44px"><div class="wrap"><div class="crumbs"><a href="/">Inicio</a> › {s['short']}</div>
<h1>{s['h1']}</h1><p class="lead">{s['desc']}</p>
<div class="cta"><a class="btn btn-y" href="tel:{PHONE_TEL}">{PH_SVG}Llamar {PHONE_DISPLAY}</a>
<a class="btn btn-wa" href="{wa_link('Hola, necesito: '+s['short'])}" target="_blank" rel="noopener">{WA_SVG}WhatsApp</a></div></div></section>
<section><div class="wrap content">{body}
<h2>Preguntas frecuentes</h2>{faq_html(faqs)}
<h2>Zonas donde trabajamos</h2><div class="zones" style="justify-content:flex-start">{zones()}</div>
<h2>Te puede interesar</h2><p><a href="/consejos/{s['guide']}/">{html.escape(next(g["title"] for g in GUIDES if g["slug"]==s["guide"]))} →</a></p>
<h2>Otros servicios</h2><div class="zones" style="justify-content:flex-start">{others}</div>
</div></section>
{urg()}
{contact_block()}"""
        write(path, h + foot())
    # Cities
    for slug, name, barrios, local in CITIES:
        path = f"/{slug}/"; pages.append(path)
        nm = name.replace(" capital","")
        title = fit_title(f"Electricista en {name} | Averías e instalaciones")
        desc = f"Electricista en {nm}: averías urgentes, instalaciones, cambio de cuadro, LED y cargadores de coche eléctrico. Presupuesto gratis. Tel. {PHONE_DISPLAY}."
        faqs = [(f"¿Tenéis electricista disponible en {nm}?", f"Sí, trabajamos de forma habitual en {nm}. Llámanos o escríbenos y te decimos cuándo podemos ir."),
                (f"¿Cuánto cuesta un electricista en {nm}?", "Depende del trabajo. Te damos el precio antes de empezar; para trabajos sencillos, con unas fotos por WhatsApp suele bastar.")] + GENERAL_FAQ[2:4]
        h = head(title, desc, path, [faq_ld(faqs), crumbs_ld(f"Electricista en {name}", path)])
        h += f"""<section class="hero" style="padding:54px 0 44px"><div class="wrap"><div class="crumbs"><a href="/">Inicio</a> › Electricista en {name}</div>
<span class="badge"><span class="dot"></span>Servicio en {nm}</span>
<h1>Electricista en <em>{name}</em></h1>
<p class="lead">¿Buscas un electricista en {nm}? Reparamos averías, renovamos instalaciones, cambiamos cuadros eléctricos e instalamos iluminación y cargadores. Precio claro y trabajo con garantía.</p>
<div class="cta"><a class="btn btn-y" href="tel:{PHONE_TEL}">{PH_SVG}Llamar {PHONE_DISPLAY}</a>
<a class="btn btn-wa" href="{wa_link('Hola, necesito un electricista en '+nm+'.')}" target="_blank" rel="noopener">{WA_SVG}WhatsApp</a></div></div></section>
<section class="alt"><div class="wrap"><h2>Servicios de electricista en <em>{nm}</em></h2><p class="sub">Todo lo que necesitas para la instalación eléctrica de tu casa, comunidad o negocio en {nm}.</p><div class="cards">{service_cards()}</div></div></section>
<section><div class="wrap content"><h2>Trabajos de electricidad en {nm}</h2><p>{local}</p>
<h2>Barrios y zonas de {nm}</h2><p>Damos servicio en {barrios}.</p>
<h2>¿Por qué un electricista cercano?</h2><p>Al trabajar a diario en {nm} y alrededores podemos llegar antes, conocemos el tipo de instalaciones de la zona y, si surge cualquier cosa después, volvemos sin complicaciones.</p>
<h2>Preguntas frecuentes</h2>{faq_html(faqs)}
<h2>Consejos útiles</h2><ul>{"".join(f'<li><a href="/consejos/{g["slug"]}/">{html.escape(g["title"])}</a></li>' for g in GUIDES[:3])}</ul>
<h2>Otras zonas</h2><div class="zones" style="justify-content:flex-start">{"".join(f'<a href="/{c[0]}/">{c[1]}</a>' for c in CITIES if c[0]!=slug)}</div></div></section>
{urg()}
{contact_block(name)}"""
        write(path, h + foot())
    # Guides
    path = "/consejos/"; pages.append(path)
    h = head(fit_title("Consejos de electricista en Madrid"), "Guías sencillas sobre tu instalación eléctrica: diferencial que salta, cuadro eléctrico, renovar la instalación, cargador de coche e iluminación LED.", path,
             [crumbs_ld("Consejos", path)])
    h += f"""<section class="hero" style="padding:54px 0 44px"><div class="wrap"><div class="crumbs"><a href="/">Inicio</a> › Consejos</div>
<h1>Consejos de <em>electricista</em></h1><p class="lead">Guías claras para entender tu instalación, resolver lo sencillo con seguridad y saber cuándo llamar a un profesional.</p></div></section>
<section class="alt"><div class="wrap"><div class="cards">{guide_cards()}</div></div></section>
{urg()}
{contact_block()}"""
    write(path, h + foot())
    for g in GUIDES:
        path = f"/consejos/{g['slug']}/"; pages.append(path)
        svc = next(x for x in SERVICES if x["slug"]==g["service"])
        art = {"@context":"https://schema.org","@type":"Article","headline":g["title"],"description":g["desc"],"inLanguage":"es-ES",
               "datePublished":GUIDE_DATE,"dateModified":GUIDE_DATE,"mainEntityOfPage":DOMAIN+path,"image":DOMAIN+"/og-image.jpg",
               "author":{"@id":DOMAIN+"/#negocio"},"publisher":{"@id":DOMAIN+"/#negocio"}}
        bc = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
              {"@type":"ListItem","position":1,"name":"Inicio","item":DOMAIN+"/"},
              {"@type":"ListItem","position":2,"name":"Consejos","item":DOMAIN+"/consejos/"},
              {"@type":"ListItem","position":3,"name":g["title"],"item":DOMAIN+path}]}
        h = head(fit_title(g["title"]), g["desc"], path, [art, bc]).replace('<meta property="og:type" content="website">','<meta property="og:type" content="article">')
        body = ""
        for t, kind, c in g["sections"]:
            body += f"<h2>{t}</h2>" + (f"<{kind}>"+"".join(f"<li>{x}</li>" for x in c)+f"</{kind}>" if kind in ("ul","ol") else f"<p>{c}</p>")
        others = "".join(f'<li><a href="/consejos/{o["slug"]}/">{html.escape(o["title"])}</a></li>' for o in GUIDES if o is not g)
        h += f"""<section class="hero" style="padding:54px 0 44px"><div class="wrap content"><div class="crumbs"><a href="/">Inicio</a> › <a href="/consejos/">Consejos</a> › {html.escape(g['title'])}</div>
<h1>{html.escape(g['title'])}</h1><p class="lead">{g['intro']}</p></div></section>
<section><div class="wrap content">{body}
<h2>¿Necesitas ayuda?</h2><p>Si prefieres que lo revise un profesional, mira nuestro servicio de <a href="/{svc['slug']}/">{svc['short'].lower()}</a> o llámanos al <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>. Trabajamos en Madrid y alrededores.</p>
<h2>Más consejos</h2><ul>{others}</ul>
</div></section>
{urg()}
{contact_block()}"""
        write(path, h + foot())
    # Privacy
    path="/privacidad/"
    h = head(f"Privacidad y aviso legal | {BRAND}", f"Política de privacidad y aviso legal de {BRAND}.", path)
    h += f"""<section><div class="wrap content"><div class="crumbs"><a href="/">Inicio</a> › Privacidad</div><h1>Privacidad y aviso legal</h1>
<h2>Responsable</h2><p>{BRAND}, electricista en Madrid. Contacto: teléfono y WhatsApp {PHONE_DISPLAY}.</p>
<h2>Qué datos tratamos</h2><p>Solo los datos que tú nos envías voluntariamente por teléfono o WhatsApp (nombre, zona y descripción del trabajo) para responder a tu solicitud y preparar tu presupuesto.</p>
<h2>Formulario</h2><p>El formulario de esta web no guarda datos en ningún servidor: simplemente prepara un mensaje que tú decides enviar por WhatsApp.</p>
<h2>Conservación y derechos</h2><p>Conservamos tus datos el tiempo necesario para atender tu solicitud y cumplir obligaciones legales (por ejemplo, facturación). Puedes pedir acceso, rectificación o supresión escribiéndonos al {PHONE_DISPLAY}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>
<h2>Cookies</h2><p>Esta web no usa cookies de seguimiento ni publicidad.</p>
</div></section>"""
    write(path, h + foot())
    # 404
    h = head(f"Página no encontrada | {BRAND}", "Página no encontrada.", "/404.html")
    h = h.replace('<link rel="canonical"', '<meta name="robots" content="noindex"><link rel="canonical"')
    h += f"""<section class="hero"><div class="wrap center"><h1>Esta página <em>no existe</em></h1><p class="lead" style="margin:0 auto 24px">Pero tu electricista sí. Vuelve al inicio o llámanos.</p>
<div class="cta" style="justify-content:center"><a class="btn btn-y" href="/">Ir al inicio</a><a class="btn btn-o" href="tel:{PHONE_TEL}">Llamar {PHONE_DISPLAY}</a></div></div></section>"""
    open(os.path.join(OUT,"404.html"),"w").write(rebase(h+foot()))
    pages.append("/privacidad/")
    # SEO files
    open(os.path.join(OUT,"robots.txt"),"w").write(f"User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n")
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
        f"  <url><loc>{DOMAIN}{p}</loc><lastmod>{TODAY}</lastmod><priority>{'1.0' if p=='/' else '0.8'}</priority></url>\n" for p in pages) + "</urlset>\n"
    open(os.path.join(OUT,"sitemap.xml"),"w").write(sm)
    open(os.path.join(OUT,"favicon.svg"),"w").write(LOGO_SVG.replace('aria-hidden="true"','xmlns="http://www.w3.org/2000/svg"'))
    open(os.path.join(OUT,"manifest.webmanifest"),"w").write(json.dumps({"name":BRAND+" · Electricista Madrid","short_name":"YJV Electricidad","start_url":BASE+"/","display":"standalone","background_color":"#0b1220","theme_color":"#0b1220","lang":"es",
        "icons":[{"src":BASE+"/icon-192.png","sizes":"192x192","type":"image/png"},{"src":BASE+"/icon-512.png","sizes":"512x512","type":"image/png"},{"src":BASE+"/icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},ensure_ascii=False))
    open(os.path.join(OUT,".nojekyll"),"w").write("")
    open(os.path.join(OUT,"sw.js"),"w").write(f"const B='{BASE}';" + """const C='yjv-elec-v2';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll([B+'/',B+'/styles.css',B+'/favicon.svg'])))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});
""")
    open(os.path.join(OUT,"_headers"),"w").write("/manifest.webmanifest\n  Content-Type: application/manifest+json\n/styles.css\n  Cache-Control: public, max-age=86400\n")
    images()
    print("pages:", pages)

def images():
    from PIL import Image, ImageDraw, ImageFont
    def logo(size, pad=0):
        im = Image.new("RGBA",(size,size),(0,0,0,0)); d = ImageDraw.Draw(im)
        r = int(size*14/64) if pad==0 else 0
        d.rounded_rectangle([0,0,size-1,size-1], radius=r, fill="#ffc400")
        s = size/64
        pts=[(36,6),(14,36),(28,36),(24,58),(50,26),(35,26)]
        if pad: c=size/2; pts=[(c+(x-32)*0.75, c+(y-32)*0.75) for x,y in pts]; d.polygon([(x*s if False else x*s/ (1) , y*s) for x,y in []] or [(x*s,y*s) for x,y in pts], fill="#111")
        else: d.polygon([(x*s,y*s) for x,y in pts], fill="#111")
        return im
    for n,sz in [("favicon-48.png",48),("apple-touch-icon.png",180),("icon-192.png",192),("icon-512.png",512)]:
        im = logo(sz); 
        if n=="apple-touch-icon.png":
            bg = Image.new("RGB",(sz,sz),"#ffc400"); bg.paste(im,(0,0),im); im=bg
        im.save(os.path.join(OUT,n))
    W,H=1200,630
    og = Image.new("RGB",(W,H),"#0b1220"); d=ImageDraw.Draw(og)
    for i in range(H):
        a=i/H; d.line([(0,i),(W,i)], fill=(int(11+5*a),int(18+8*a),int(32+12*a)))
    d.ellipse([820,-200,1400,380], fill="#2a2410")
    L = logo(220); og.paste(L,(900,205),L)
    fb = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; fr="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    d.text((70,90),"YJV Electricidad",font=ImageFont.truetype(fb,40),fill="#ffc400")
    d.text((70,160),"Electricista",font=ImageFont.truetype(fb,84),fill="#ffffff")
    d.text((70,262),"en Madrid y alrededores",font=ImageFont.truetype(fb,58),fill="#ffffff")
    d.text((70,370),"Urgencias · Instalaciones · Cuadros · LED",font=ImageFont.truetype(fr,34),fill="#a9b4c9")
    d.rounded_rectangle([70,450,560,535],radius=44,fill="#ffc400")
    d.text((110,468),"Tel. "+PHONE_DISPLAY,font=ImageFont.truetype(fb,42),fill="#111")
    og.save(os.path.join(OUT,"og-image.jpg"),quality=88)

build()
