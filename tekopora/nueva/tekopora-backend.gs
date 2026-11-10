/* Tekopora — base de datos en Google Sheets + avisos por Gmail.
   Pegar en Extensiones > Apps Script de una hoja de cálculo nueva,
   ejecutar «configurar» una vez y publicar como aplicación web. */

var WEB = 'https://junior643153338-a11y.github.io/-yjv-electricidad/tekopora/nueva/';
var MAX_TECNICOS = 3;
var HOJAS = {
  Pedidos: ['id', 'fecha', 'servicio', 'trabajo', 'detalle', 'ciudad', 'barrio', 'cuando', 'nombre', 'whatsapp', 'estado'],
  Tecnicos: ['id', 'fecha', 'nombre', 'whatsapp', 'email', 'rubros', 'ciudades', 'estado', 'token'],
  Accesos: ['fecha', 'pedido', 'tecnico_id', 'tecnico']
};

function configurar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(HOJAS).forEach(function (n) {
    var sh = ss.getSheetByName(n) || ss.insertSheet(n);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HOJAS[n]);
      sh.getRange(1, 1, 1, HOJAS[n].length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
  });
  var h1 = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (h1 && h1.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(h1);
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty('ADMIN_KEY')) p.setProperty('ADMIN_KEY', Utilities.getUuid().replace(/-/g, ''));
  p.setProperty('ADMIN_EMAIL', Session.getEffectiveUser().getEmail());
  MailApp.sendEmail(p.getProperty('ADMIN_EMAIL'), 'Tekopora: base de datos lista',
    'Todo listo. Ahora publicá el script: Implementar > Nueva implementación > Aplicación web.');
}

function doPost(e) {
  var r;
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.web) return json({ ok: false, error: 'spam' });
    var f = { pedido: nuevoPedido, registro: registro, login: login, pedidos: listar, tomar: tomar }[d.a];
    r = f ? f(d) : { ok: false, error: 'accion' };
  } catch (err) {
    r = { ok: false, error: String(err) };
  }
  return json(r);
}

function doGet(e) {
  var q = e.parameter || {};
  if (q.a === 'aprobar' || q.a === 'rechazar') return html(aprobar(q));
  return json({ ok: true, app: 'tekopora' });
}

/* ---------- acciones ---------- */

function nuevoPedido(d) {
  var p = limpio(d, ['servicio', 'trabajo', 'detalle', 'ciudad', 'barrio', 'cuando', 'nombre', 'whatsapp']);
  if (!p.servicio || !p.ciudad || !p.nombre || !p.whatsapp) return { ok: false, error: 'faltan datos' };
  var id = 'TK-' + Date.now().toString(36).slice(-5).toUpperCase();
  hoja('Pedidos').appendRow([id, new Date(), p.servicio, p.trabajo, p.detalle, p.ciudad, p.barrio, p.cuando, p.nombre, "'" + p.whatsapp, 'nuevo']);
  var txt = p.servicio + (p.trabajo ? ' - ' + p.trabajo : '') + '\n' + p.detalle + '\n' + p.ciudad + (p.barrio ? ', ' + p.barrio : '') + '\nCuándo: ' + p.cuando;
  correo(admin(), 'Nuevo pedido ' + id + ': ' + p.servicio + ' en ' + p.ciudad,
    txt + '\n\nCliente: ' + p.nombre + ' - ' + p.whatsapp);
  filas('Tecnicos').forEach(function (t) {
    if (t.estado === 'aprobado' && coincide(t, p.servicio, p.ciudad) && t.email) {
      correo(t.email, 'Nuevo trabajo en ' + p.ciudad + ': ' + p.servicio,
        'Hola ' + t.nombre + ',\n\nHay un pedido nuevo en tu zona:\n\n' + txt +
        '\n\nEntrá para ver los datos del cliente (solo los primeros ' + MAX_TECNICOS + ' profesionales):\n' + WEB + 'pro.html#t=' + t.token +
        '\n\nTekopora');
    }
  });
  return { ok: true, id: id };
}

function registro(d) {
  var t = limpio(d, ['nombre', 'whatsapp', 'email']);
  t.email = t.email.toLowerCase();
  var rubros = lista(d.rubros), ciudades = lista(d.ciudades);
  if (!t.nombre || !t.whatsapp || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t.email) || !rubros.length || !ciudades.length)
    return { ok: false, error: 'faltan datos' };
  var ya = buscarTecnico('email', t.email);
  if (ya) return { ok: true, estado: ya.estado };
  var id = 'P-' + Date.now().toString(36).slice(-6).toUpperCase();
  hoja('Tecnicos').appendRow([id, new Date(), t.nombre, "'" + t.whatsapp, t.email, rubros.join(', '), ciudades.join(', '), 'pendiente', '']);
  var base = ScriptApp.getService().getUrl() + '?id=' + id + '&k=' + key();
  correo(admin(), 'Nuevo profesional: ' + t.nombre,
    t.nombre + '\nWhatsApp: ' + t.whatsapp + '\nCorreo: ' + t.email + '\nRubros: ' + rubros.join(', ') + '\nCiudades: ' + ciudades.join(', ') +
    '\n\nAPROBAR: ' + base + '&a=aprobar\n\nRechazar: ' + base + '&a=rechazar');
  return { ok: true, estado: 'pendiente' };
}

function login(d) {
  var t = buscarTecnico('email', String(d.email || '').trim().toLowerCase());
  if (!t) return { ok: false, error: 'noexiste' };
  if (t.estado !== 'aprobado') return { ok: false, error: t.estado };
  correo(t.email, 'Tu acceso a Tekopora', 'Hola ' + t.nombre + ',\n\nEntrá a tus pedidos con este enlace:\n' + WEB + 'pro.html#t=' + t.token + '\n\nNo lo compartas: es tu llave personal.\n\nTekopora');
  return { ok: true };
}

function listar(d) {
  var t = porToken(d.t);
  if (!t) return { ok: false, error: 'token' };
  var acc = filas('Accesos'), limite = Date.now() - 45 * 864e5;
  var out = filas('Pedidos').filter(function (p) {
    return p.estado !== 'cerrado' && new Date(p.fecha).getTime() > limite && coincide(t, p.servicio, p.ciudad);
  }).reverse().slice(0, 50).map(function (p) {
    var mios = acc.filter(function (a) { return a.pedido === p.id; });
    return vista(p, mios, t);
  });
  return { ok: true, tecnico: { nombre: t.nombre, rubros: t.rubros, ciudades: t.ciudades }, pedidos: out };
}

function tomar(d) {
  var t = porToken(d.t);
  if (!t) return { ok: false, error: 'token' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var p = filas('Pedidos').filter(function (x) { return x.id === d.id; })[0];
    if (!p || !coincide(t, p.servicio, p.ciudad)) return { ok: false, error: 'pedido' };
    var acc = filas('Accesos').filter(function (a) { return a.pedido === p.id; });
    var yo = acc.some(function (a) { return a.tecnico_id === t.id; });
    if (!yo) {
      if (acc.length >= MAX_TECNICOS) return { ok: false, error: 'lleno' };
      hoja('Accesos').appendRow([new Date(), p.id, t.id, t.nombre]);
      acc.push({ pedido: p.id, tecnico_id: t.id });
      correo(admin(), t.nombre + ' tomó el pedido ' + p.id, p.servicio + ' en ' + p.ciudad + ' (' + acc.length + '/' + MAX_TECNICOS + ')');
    }
    return { ok: true, pedido: vista(p, acc, t) };
  } finally {
    lock.releaseLock();
  }
}

function aprobar(q) {
  if (q.k !== key()) return 'Enlace no válido.';
  var sh = hoja('Tecnicos'), v = sh.getDataRange().getValues(), H = v[0];
  for (var i = 1; i < v.length; i++) {
    if (v[i][0] !== q.id) continue;
    var t = obj(H, v[i]);
    if (q.a === 'rechazar') {
      sh.getRange(i + 1, H.indexOf('estado') + 1).setValue('rechazado');
      return t.nombre + ' quedó rechazado.';
    }
    var token = t.token || Utilities.getUuid().replace(/-/g, '');
    sh.getRange(i + 1, H.indexOf('estado') + 1).setValue('aprobado');
    sh.getRange(i + 1, H.indexOf('token') + 1).setValue(token);
    correo(t.email, '¡Ya estás en Tekopora!', 'Hola ' + t.nombre + ',\n\nTu registro fue aprobado. Te vamos a avisar por correo cada vez que haya un pedido de ' + t.rubros + ' en ' + t.ciudades + '.\n\nEntrá a ver los pedidos:\n' + WEB + 'pro.html#t=' + token + '\n\nTekopora');
    return '✅ ' + t.nombre + ' aprobado. Ya le mandamos su acceso por correo.';
  }
  return 'No encontré ese profesional.';
}

/* ---------- ayudas ---------- */

function vista(p, acc, t) {
  var yo = acc.some(function (a) { return a.tecnico_id === t.id; });
  var v = { id: p.id, fecha: new Date(p.fecha).getTime(), servicio: p.servicio, trabajo: p.trabajo, detalle: p.detalle,
    ciudad: p.ciudad, cuando: p.cuando, tomados: acc.length, max: MAX_TECNICOS, mio: yo };
  if (yo) { v.nombre = p.nombre; v.whatsapp = String(p.whatsapp); v.barrio = p.barrio; }
  return v;
}
function coincide(t, servicio, ciudad) {
  return lista(t.rubros).indexOf(servicio) >= 0 && lista(t.ciudades).indexOf(ciudad) >= 0;
}
function porToken(tok) {
  if (!tok || String(tok).length < 20) return null;
  var t = buscarTecnico('token', String(tok));
  return t && t.estado === 'aprobado' ? t : null;
}
function buscarTecnico(campo, valor) {
  return filas('Tecnicos').filter(function (t) { return String(t[campo]).toLowerCase() === String(valor).toLowerCase() && valor; })[0];
}
function hoja(n) { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(n); }
function filas(n) {
  var v = hoja(n).getDataRange().getValues(), H = v.shift();
  return v.map(function (r) { return obj(H, r); });
}
function obj(H, r) { var o = {}; H.forEach(function (h, i) { o[h] = r[i]; }); return o; }
function lista(x) { return (Array.isArray(x) ? x : String(x || '').split(',')).map(function (s) { return String(s).trim(); }).filter(String); }
function limpio(d, campos) {
  var o = {};
  campos.forEach(function (c) { o[c] = String(d[c] || '').replace(/^[=+\-@]+/, '').trim().slice(0, 600); });
  return o;
}
function admin() { return PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL'); }
function key() { return PropertiesService.getScriptProperties().getProperty('ADMIN_KEY'); }
function correo(a, asunto, cuerpo) { try { MailApp.sendEmail(a, asunto, cuerpo, { name: 'Tekopora' }); } catch (e) {} }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function html(msg) {
  return HtmlService.createHtmlOutput('<meta name="viewport" content="width=device-width,initial-scale=1"><div style="font-family:sans-serif;padding:40px 20px;text-align:center;font-size:20px">' + msg + '</div>');
}
