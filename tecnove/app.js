'use strict';
/* SitePass — demo (localStorage). Tecnove es la contrata; cada cliente pide su documentación. */
const KEY='tecnove_accesos_v1';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=d=>{const x=new Date(d);x.setMinutes(x.getMinutes()-x.getTimezoneOffset());return x.toISOString().slice(0,10)};
const TODAY=iso(new Date());
const addDays=(n,base)=>{const d=base?new Date(base+'T12:00'):new Date();d.setDate(d.getDate()+n);return iso(d)};
const addMonths=(base,n)=>{const d=new Date(base+'T12:00');d.setMonth(d.getMonth()+n);return iso(d)};
const fd=s=>s?new Date(s+'T12:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}):'—';
const fds=s=>s?new Date(s+'T12:00').toLocaleDateString('es-ES',{weekday:'short',day:'2-digit',month:'short'}):'—';
const fdt=s=>new Date(s).toLocaleString('es-ES',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
const uid=p=>p+Math.random().toString(36).slice(2,8);
const COLORS=['#0f70be','#0f766e','#b45309','#7c3aed','#be123c','#4d7c0f','#0b1a42'];
let S=null;

/* ---------- catálogo de documentos ---------- */
const CAT={
 e:[
  {k:'rc',n:'Seguro de Responsabilidad Civil + recibo',cad:true,m:12,kw:/responsabilidad civil|p[oó]liza/i},
  {k:'ss',n:'Certificado al corriente con la Seguridad Social',cad:true,m:1,kw:/seguridad social|tesorer[ií]a general/i},
  {k:'aeat',n:'Certificado al corriente con Hacienda',cad:true,m:12,kw:/agencia tributaria|hacienda|obligaciones tributarias/i},
  {k:'art43',n:'Certificado de contratistas (art. 43 LGT)',cad:true,m:12,kw:/contratistas y subcontratistas|art[ií]culo 43/i},
  {k:'rnt',n:'RNT / TC2 del último mes',cad:true,m:1,kw:/relaci[oó]n nominal|\bRNT\b|\bTC2\b/i},
  {k:'acc',n:'Seguro de accidentes de convenio',cad:true,m:12,kw:/seguro de accidentes|accidentes convenio/i},
  {k:'mp',n:'Modalidad preventiva (concierto con SPA)',cad:true,m:12,kw:/servicio de prevenci[oó]n ajeno|modalidad preventiva|concierto/i},
  {k:'er',n:'Evaluación de riesgos y planificación preventiva',cad:false,kw:/evaluaci[oó]n de riesgos/i},
  {k:'proc',n:'Procedimientos de trabajo (altura, RF, energía)',cad:false,kw:/procedimiento de trabajo|plan de seguridad/i},
  {k:'rea',n:'Inscripción en el REA',cad:true,m:36,kw:/registro de empresas acreditadas|\bREA\b/i},
  {k:'regtel',n:'Registro de empresa instaladora de telecomunicaciones',cad:false,kw:/instaladora de telecomunicaci|registro de empresas instaladoras/i},
  {k:'nda',n:'Acuerdo de confidencialidad firmado',cad:false,kw:/confidencialidad|\bNDA\b/i},
 ],
 t:[
  {k:'dni',n:'DNI / NIE',cad:true,m:120,kw:/documento nacional de identidad|\bDNI\b|\bNIE\b/i},
  {k:'form',n:'Formación PRL del puesto (art. 19 LPRL)',cad:false,kw:/formaci[oó]n[\s\S]{0,60}(prevenci[oó]n|riesgos laborales)|art[ií]culo 19/i},
  {k:'apt',n:'Certificado de aptitud médica',cad:true,m:12,kw:/aptitud|\bapto\b|vigilancia de la salud|reconocimiento m[eé]dico/i},
  {k:'epi',n:'Entrega de EPIs (incl. arnés)',cad:false,kw:/equipos de protecci[oó]n individual|\bEPIs?\b/i},
  {k:'altura',n:'Formación trabajos en altura (torres)',cad:true,m:60,kw:/altura/i},
  {k:'rescate',n:'Formación rescate en altura',cad:true,m:36,kw:/rescate/i},
  {k:'rf',n:'Formación riesgos de radiofrecuencia (RF)',cad:false,kw:/radiofrecuencia|campos electromagn[eé]ticos/i},
  {k:'rd614',n:'Riesgo eléctrico RD 614/2001 (cualificado)',cad:false,kw:/614\/2001|riesgo el[eé]ctrico/i},
  {k:'pemp',n:'Operador de plataforma elevadora (PEMP)',cad:true,m:60,kw:/plataforma elevadora|PEMP/i},
  {k:'conf',n:'Formación espacios confinados (arquetas)',cad:true,m:60,kw:/confinad/i},
  {k:'aux',n:'Primeros auxilios',cad:true,m:24,kw:/primeros auxilios/i},
  {k:'carnet',n:'Permiso de conducir (C para unidades móviles)',cad:true,m:120,kw:/permiso de conducci[oó]n|permiso de conducir|carnet de conducir/i},
 ],
 v:[
  {k:'pc',n:'Permiso de circulación',cad:false,kw:/permiso de circulaci[oó]n/i},
  {k:'itv',n:'ITV en vigor',cad:true,m:12,kw:/\bITV\b|inspecci[oó]n t[eé]cnica/i},
  {k:'seg',n:'Seguro del vehículo + recibo',cad:true,m:12,kw:/seguro|p[oó]liza/i},
 ],
};
const ALLDOC={};Object.entries(CAT).forEach(([g,l])=>l.forEach(d=>{d.g=g;ALLDOC[d.k]=d}));
const docName=k=>ALLDOC[k]?.n||k;
const PLAT=['e-gestiona','Email','Ctaima','Dokify','Nalanda','e-coordina','Portal propio'];
const TIPOS={operador:'📡 Operador / emplazamientos',evento:'🎪 Eventos',hospital:'🏥 Sanidad',datacenter:'🖥️ Data center',emergencias:'🚨 Emergencias',industria:'🏭 Industria'};
const EST={preparando:['IA preparando','ai'],faltan:['Faltan documentos','warn'],revisar:['Revisar documento','ai'],listo:['Listo para enviar','ai'],enviado:['Enviado al cliente','info'],concedido:['Acceso concedido','ok'],denegado:['Denegado','bad'],finalizado:['Finalizado','gray']};
function addClientCourse(c){if(c.curso){const k='cur_'+c.id;ALLDOC[k]={k,g:'t',n:'Curso de acogida de '+c.nombre,cad:true,m:12,kw:new RegExp(c.nombre.split(' ')[0],'i')};return k}}

/* ---------- datos demo ---------- */
function seed(){
 const empresa={id:'e1',nombre:'Tecnove Telecom',cif:'B00000000',dir:'Alcobendas (Madrid)',email:'prl@tecnove-demo.es'};
 const trabajadores=[
  {id:'t1',nombre:'Javier Morales Ruiz',dni:'12345678Z',puesto:'Técnico de radio (torres)',tel:'600 111 001'},
  {id:'t2',nombre:'Sergio Blanco Díaz',dni:'23456789D',puesto:'Técnico de radio (torres)',tel:'600 111 002'},
  {id:'t3',nombre:'Alberto Ramos Gil',dni:'34567890V',puesto:'Técnico de energía / grupos electrógenos',tel:'600 111 003'},
  {id:'t4',nombre:'Miguel Ángel Prieto',dni:'45678901G',puesto:'Conductor unidad móvil',tel:'600 111 004'},
  {id:'t5',nombre:'Laura Castillo Vera',dni:'56789012B',puesto:'Ingeniera de campo',tel:'600 111 005'},
  {id:'t6',nombre:'David Herrero Sanz',dni:'67890123N',puesto:'Técnico de climatización / enfriadoras',tel:'600 111 006'},
 ];
 const vehiculos=[{id:'v1',nombre:'Unidad móvil UM-01 (torre telescópica)',mat:'1234KLM'},{id:'v2',nombre:'Furgoneta taller F-03',mat:'5678JHG'}];
 const clientes=[
  {id:'c1',nombre:'Operadora Móvil Centro',tipo:'operador',plataforma:'Ctaima',antel:72,contacto:'Coordinación CAE',email:'cae@operadora-demo.es',curso:false,
   reqE:['rc','ss','aeat','art43','rnt','mp','er','proc'],reqT:['dni','form','apt','epi','altura','rescate','rf'],reqV:[],notas:'Subir a su plataforma Ctaima. Revisan en 48-72 h.'},
  {id:'c2',nombre:'Recinto Ferial Madrid',tipo:'evento',plataforma:'Email',antel:48,contacto:'Seguridad del recinto',email:'montajes@ferial-demo.es',curso:false,
   reqE:['rc','ss','aeat','rnt','acc'],reqT:['dni','form','epi'],reqV:['pc','itv','seg'],notas:'Piden lista de matrículas para el muelle de carga.'},
  {id:'c3',nombre:'Hospital Universitario Norte',tipo:'hospital',plataforma:'Dokify',antel:120,contacto:'Servicio de Prevención',email:'prl@hospital-demo.es',curso:true,
   reqE:['rc','ss','aeat','art43','rnt','mp','er'],reqT:['dni','form','apt','epi','rd614'],reqV:[],notas:'Curso de acogida online obligatorio para cada técnico.'},
  {id:'c4',nombre:'Data Center Alcobendas',tipo:'datacenter',plataforma:'Portal propio',antel:48,contacto:'Facility Manager',email:'access@dc-demo.es',curso:true,
   reqE:['rc','ss','aeat','nda'],reqT:['dni','form','rd614'],reqV:[],notas:'Acceso con DNI físico. NDA firmado por la empresa.'},
  {id:'c5',nombre:'Protección Civil Municipal',tipo:'emergencias',plataforma:'Email',antel:0,contacto:'Jefe de guardia',email:'guardia@pcivil-demo.es',curso:false,
   reqE:['rc','ss'],reqT:['dni','form','epi'],reqV:['itv','seg'],notas:'Emergencias: envío inmediato, sin antelación.'},
  {id:'c6',nombre:'Estadio Metropolitano · Conciertos',tipo:'evento',plataforma:'Nalanda',antel:72,contacto:'Producción',email:'produccion@estadio-demo.es',curso:false,
   reqE:['rc','ss','aeat','rnt','acc','er'],reqT:['dni','form','epi','altura','pemp'],reqV:['pc','itv','seg'],notas:'Montaje de cobertura temporal 4G/5G y WiFi en grada.'},
 ];
 clientes.push({id:'ct',nombre:'Telefónica · emplazamientos',tipo:'operador',plataforma:'e-gestiona',antel:48,contacto:'Coordinación de accesos',email:'accesos@telefonica-demo.es',curso:false,reqE:['rc','ss','aeat','rnt','er'],reqT:['dni','form','apt','epi'],reqV:[],notas:'Flujo real: correo del jefe de proyecto → ficha del emplazamiento → solicitud CAE en e-gestiona → el cliente pide la documentación.'});
 clientes.forEach(addClientCourse);
 const docs=[];const add=(owner,k,cad)=>docs.push({id:uid('d'),owner,tipo:k,archivo:k+'_'+owner+'.pdf',caduca:ALLDOC[k].cad?cad:null,estado:'valido',por:'ia',conf:'alta',subido:addDays(-40)+'T09:00'});
 const R=(a,b)=>addDays(a+Math.floor(Math.random()*(b-a)));
 CAT.e.forEach(d=>add('e1',d.k,R(90,300)));
 const tdocs={t1:['dni','form','apt','epi','altura','rescate','rf','aux'],t2:['dni','form','apt','epi','altura','rescate','aux'],t3:['dni','form','apt','epi','rd614','carnet','altura','pemp'],t4:['dni','form','apt','epi','carnet','pemp'],t5:['dni','form','apt','epi','rd614','rf','altura','rescate','cur_c4'],t6:['dni','form','apt','epi','rd614','conf']};
 Object.entries(tdocs).forEach(([t,l])=>l.forEach(k=>add(t,k,R(120,500))));
 ['v1','v2'].forEach(v=>CAT.v.forEach(d=>add(v,d.k,R(120,300))));
 // problemas realistas
 docs.find(d=>d.owner==='e1'&&d.tipo==='rnt').caduca=addDays(6);
 docs.find(d=>d.owner==='t2'&&d.tipo==='apt').caduca=addDays(-3);
 docs.find(d=>d.owner==='v1'&&d.tipo==='itv').caduca=addDays(12);
 const p=docs.find(d=>d.owner==='t4'&&d.tipo==='epi');p.estado='pendiente';p.por=null;p.nota='Foto del registro firmada: la IA no puede leerla con seguridad';
 const tr=(id,cli,sitio,d1,d2,tipo,trab,veh,desc,h)=>({id,codigo:'TR-'+(2400+parseInt(id.slice(1))),clienteId:cli,sitio,desde:d1,hasta:d2,tipo,trabajadores:trab,vehiculos:veh,descripcion:desc,estado:'preparando',creado:new Date(Date.now()-h*3600e3).toISOString(),hist:[]});
 const trabajos=[
  tr('j1','c1','Emplazamiento ALC-0231 (Alcobendas Norte)',addDays(4),addDays(4),'programado',['t1','t2'],[],'Mantenimiento preventivo de antenas y radioenlace',30),
  tr('j2','c2','Pabellón 8 · Feria tecnológica',addDays(5),addDays(8),'evento',['t3','t4'],['v1'],'Cobertura móvil temporal y grupo electrógeno de respaldo',20),
  tr('j3','c3','Edificio de consultas externas',addDays(9),addDays(10),'programado',['t5','t3'],[],'Ampliación del sistema de cobertura interior (DAS)',10),
  tr('j4','c4','Sala técnica 2',addDays(3),addDays(3),'programado',['t5'],[],'Integración de nodo y cableado de fibra',6),
  tr('j5','c6','Grada norte',addDays(-12),addDays(-10),'evento',['t1','t3'],['v1'],'Cobertura 5G concierto',24*15),
 ];
 const S0={v:2,emplazamientos:seedEmplaz(),correos:seedCorreos(),cfg:{autoValidar:true,autoEnviarEmail:true,avisosCaducidad:true,diasAviso:30,avisoTrabajadores:true},empresa,trabajadores,vehiculos,clientes,docs,trabajos,mensajes:[],log:[],user:null};
 // ejemplo ya en marcha: esperando respuesta del cliente
 const e3=S0.emplazamientos[2];S0.trabajos.push({id:'j6',codigo:'TR-2406',clienteId:'ct',sitio:'MAD0877 · '+e3.nombre,desde:addDays(10),hasta:addDays(10),tipo:'programado',trabajadores:['t5','t3'],vehiculos:[],descripcion:'Ampliación de la cobertura interior (DAS) en sótano -1',estado:'esperando',creado:new Date(Date.now()-26*3600e3).toISOString(),hist:[h('IA','Correo de Raúl Fernández leído'),h('Gestión','Solicitud CAE creada en e-gestiona: CAE-2026-01187')],flujo:{correo:'',de:'Raúl Fernández',cod:'MAD0877',riesgos:['elec'],horario:'22:00 – 6:00',caeReq:true,caeNum:'CAE-2026-01187',caeFecha:new Date(Date.now()-24*3600e3).toISOString()},emp:{...e3}});
 return S0;
}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.v===2){s.clientes.forEach(addClientCourse);return s}}catch(e){}S=seed();runAI(true);return S}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
const tra=id=>S.trabajadores.find(t=>t.id===id);
const veh=id=>S.vehiculos.find(v=>v.id===id);
const cli=id=>S.clientes.find(c=>c.id===id);
const ownerName=o=>o==='e1'?S.empresa.nombre:o.startsWith('t')?tra(o)?.nombre:veh(o)?.nombre;
const ownerIcon=o=>o==='e1'?'🏢':o.startsWith('t')?'👷':'🚚';
function log(texto,min=0,auto=true,ref=null){S.log.unshift({id:uid('l'),fecha:new Date().toISOString(),texto,auto,min,ref});S.log=S.log.slice(0,300)}
function notify(to,asunto,texto,ref){S.mensajes.unshift({id:uid('m'),to,fecha:new Date().toISOString(),asunto,texto,leido:false,ref})}
function toast(t,ai){const el=document.createElement('div');el.className='toast'+(ai?' ai':'');el.innerHTML=t;$('#toasts').appendChild(el);setTimeout(()=>el.remove(),4200)}
function h(quien,texto){return{fecha:new Date().toISOString(),quien,texto}}

/* ---------- estado de documentos ---------- */
function lastDoc(owner,k){return S.docs.filter(d=>d.owner===owner&&d.tipo===k).sort((a,b)=>b.subido.localeCompare(a.subido))[0]}
function docSt(owner,k,hasta){
 const d=lastDoc(owner,k);
 if(!d)return{st:'falta',txt:'No lo tenemos',c:'bad'};
 if(d.estado==='rechazado')return{st:'rechazado',txt:'Rechazado',c:'bad',d};
 if(d.estado==='pendiente')return{st:'pendiente',txt:'Dudoso: revisar',c:'ai',d};
 if(d.caduca&&d.caduca<TODAY)return{st:'caducado',txt:'Caducado el '+fd(d.caduca),c:'bad',d};
 if(d.caduca&&hasta&&d.caduca<hasta)return{st:'caduca_antes',txt:'Caduca antes del trabajo ('+fd(d.caduca)+')',c:'bad',d};
 if(d.caduca&&d.caduca<addDays(S.cfg.diasAviso))return{st:'por_caducar',txt:'Válido · caduca '+fd(d.caduca),c:'warn',d};
 return{st:'valido',txt:d.caduca?'Válido hasta '+fd(d.caduca):'Válido',c:'ok',d};
}
const OKST=['valido','por_caducar'],BAD=['falta','rechazado','caducado','caduca_antes'];
function reqsFor(c){return{e:c.reqE,t:[...c.reqT,...(c.curso?['cur_'+c.id]:[])],v:c.reqV}}
function check(j){const c=cli(j.clienteId);const r=j.req||reqsFor(c);const items=[];
 r.e.forEach(k=>items.push({owner:'e1',k}));j.trabajadores.forEach(t=>r.t.forEach(k=>items.push({owner:t,k})));j.vehiculos.forEach(v=>r.v.forEach(k=>items.push({owner:v,k})));
 const it=items.map(x=>({...x,...docSt(x.owner,x.k,j.hasta)}));
 return{items:it,bloq:it.filter(i=>BAD.includes(i.st)),pend:it.filter(i=>i.st==='pendiente'),ok:it.filter(i=>OKST.includes(i.st)).length,total:it.length}}
function aptitud(o,c,hasta){const r=reqsFor(c);const ks=o.startsWith('t')?r.t:o.startsWith('v')?r.v:r.e;const its=ks.map(k=>({k,...docSt(o,k,hasta)}));return{its,bad:its.filter(i=>!OKST.includes(i.st)),total:its.length}}
function limite(j){const c=cli(j.clienteId);const d=new Date(j.desde+'T08:00');d.setHours(d.getHours()-c.antel);return d}
function plazoTxt(j){if(!['preparando','faltan','revisar','listo'].includes(j.estado))return'';const c=cli(j.clienteId);if(!c.antel)return'<span class="pill bad">Inmediato</span>';const ms=limite(j)-Date.now();const hrs=Math.round(ms/36e5);
 if(ms<0)return'<span class="pill bad">⏰ Fuera de plazo</span>';if(hrs<24)return`<span class="pill bad">⏰ Enviar en ${hrs} h</span>`;return`<span class="pill gray">Enviar antes del ${fds(iso(limite(j)))}</span>`}

/* ---------- MOTOR IA ---------- */
function runAI(silent){
 let acts=0;
 S.trabajos.forEach(j=>{
  if(j.hasta<TODAY){if(j.estado!=='finalizado'){j.estado='finalizado';j.hist.push(h('IA','Trabajo terminado: archivado'))}return}
  if(!['preparando','faltan','revisar','listo'].includes(j.estado))return;
  const c=cli(j.clienteId);const k=check(j);
  if(k.bloq.length){
   const key=k.bloq.map(i=>i.owner+i.k+i.st).join('|');
   if(j.estado!=='faltan'||j.reqKey!==key){
    j.estado='faltan';j.reqKey=key;
    const porOwner={};k.bloq.forEach(i=>(porOwner[i.owner]=porOwner[i.owner]||[]).push(i));
    Object.entries(porOwner).forEach(([o,its])=>{if(o.startsWith('t')&&S.cfg.avisoTrabajadores){notify(o,'Te falta documentación para '+c.nombre,'Hola '+tra(o).nombre.split(' ')[0]+',\n\nPara el trabajo '+j.codigo+' en '+c.nombre+' ('+fds(j.desde)+') el cliente pide:\n'+its.map(i=>'• '+docName(i.k)+' ('+i.txt.toLowerCase()+')').join('\n')+'\n\nSúbelo desde la app (foto o PDF). La IA lo revisa al momento.\n\nPRL Tecnove',j.id)}});
    j.hist.push(h('IA','Cruzados los requisitos de '+c.nombre+' con '+k.total+' documentos: faltan '+k.bloq.length+'. Avisados los técnicos afectados.'));
    (()=>{const nt=Object.keys(porOwner).filter(o=>o.startsWith('t')).length;log(j.codigo+' ('+c.nombre+'): faltan '+k.bloq.length+' documento(s). '+(nt?'Avisados '+nt+' técnico(s)':'Son de la empresa o vehículos: te toca a ti'),10,true,j.id)})();acts++;
   }return}
  if(k.pend.length){if(j.estado!=='revisar'){j.estado='revisar';j.hist.push(h('IA',k.pend.length+' documento(s) dudoso(s): necesita tu confirmación'));log(j.codigo+': la IA pide tu confirmación en '+k.pend.length+' documento(s)',3,true,j.id);acts++}return}
  if(j.estado!=='listo'){j.estado='listo';j.hist.push(h('IA','Paquete de '+k.total+' documentos preparado según los requisitos de '+c.nombre+'.'));log(j.codigo+': paquete de '+k.total+' documentos preparado para '+c.nombre,20,true,j.id);acts++}
  if(c.plataforma==='Email'&&S.cfg.autoEnviarEmail&&!j.flujo){enviar(j,'IA');acts++}
 });
 if(S.cfg.avisosCaducidad){
  S.docs.forEach(d=>{if(d.estado==='valido'&&d.caduca&&d.caduca<addDays(S.cfg.diasAviso)&&!d.avisado&&lastDoc(d.owner,d.tipo)===d){
   d.avisado=true;const exp=d.caduca<TODAY;
   if(d.owner.startsWith('t'))notify(d.owner,(exp?'Documento caducado: ':'Renueva pronto: ')+docName(d.tipo),'Hola '+tra(d.owner).nombre.split(' ')[0]+',\n\nTu "'+docName(d.tipo)+'" '+(exp?'caducó':'caduca')+' el '+fd(d.caduca)+'. Súbelo renovado para que no te bloqueen el acceso a clientes.\n\nPRL Tecnove');
   log('Aviso de caducidad: '+docName(d.tipo)+' de '+ownerName(d.owner)+' ('+fd(d.caduca)+')',4);acts++}});
 }
 save();if(acts&&!silent)toast('🤖 La IA ha hecho '+acts+' tarea(s) sola',true);return acts;
}
function emailCliente(j){const c=cli(j.clienteId);const k=check(j);
 return`Asunto: Documentación de acceso ${j.codigo} – Tecnove Telecom – ${fd(j.desde)}\n\nBuenos días, ${c.contacto}:\n\nAdjuntamos la documentación CAE para el acceso a ${j.sitio} (${c.nombre}) del ${fd(j.desde)} al ${fd(j.hasta)}.\nTrabajo: ${j.descripcion}.\n\nPersonal:\n${j.trabajadores.map(t=>'• '+tra(t).nombre+' – DNI '+tra(t).dni+' – '+tra(t).puesto).join('\n')}${j.vehiculos.length?'\n\nVehículos:\n'+j.vehiculos.map(v=>'• '+veh(v).nombre+' – '+veh(v).mat).join('\n'):''}\n\nSe adjuntan ${k.total} documentos (empresa, trabajadores${j.vehiculos.length?' y vehículos':''}), todos vigentes durante los trabajos.\n\nQuedamos a su disposición.\nDepartamento de PRL · Tecnove Telecom`}
function enviar(j,quien){const c=cli(j.clienteId);j.estado='enviado';j.enviado=new Date().toISOString();
 j.hist.push(h(quien,c.plataforma==='Email'?'Paquete enviado por email a '+c.email:'Documentación subida a '+c.plataforma));
 log((quien==='IA'?'Enviado automáticamente ':'Enviado ')+j.codigo+' a '+c.nombre+(c.plataforma==='Email'?' ('+c.email+')':' vía '+c.plataforma),quien==='IA'?15:0,quien==='IA',j.id);
 j.trabajadores.forEach(t=>notify(t,'Documentación enviada: '+c.nombre,'Tu documentación para '+j.codigo+' ('+j.sitio+', '+fds(j.desde)+') ya está enviada al cliente. Te avisamos cuando confirmen el acceso.',j.id));
}

/* ---------- lectura IA de documentos ---------- */
const MESES={enero:1,febrero:2,marzo:3,abril:4,mayo:5,junio:6,julio:7,agosto:8,septiembre:9,setiembre:9,octubre:10,noviembre:11,diciembre:12};
function findDates(t){const out=[];let m;const r1=/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/g;while(m=r1.exec(t))out.push({i:m.index,d:`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`});
 const r2=/(\d{1,2}) de (\w+) de (\d{4})/gi;while(m=r2.exec(t)){const mm=MESES[m[2].toLowerCase()];if(mm)out.push({i:m.index,d:`${m[3]}-${String(mm).padStart(2,'0')}-${m[1].padStart(2,'0')}`})}
 return out.filter(x=>!isNaN(new Date(x.d)))}
function ownerRef(o){return o==='e1'?S.empresa.cif:o.startsWith('t')?tra(o).dni:veh(o).mat}
function analyze(text,owner,k){
 const steps=[];const def=ALLDOC[k];const t=text.replace(/\s+/g,' ');
 if(t.trim().length<30)return{estado:'pendiente',conf:'baja',steps:[['⚠️','Sin texto legible (foto o escaneo). En la demo queda para tu revisión; la versión real lo lee con IA de visión.']],nota:'Foto/escaneo: requiere confirmación'};
 steps.push(['📄','Leídas '+t.split(' ').length+' palabras del documento']);
 if(!def.kw.test(t)){let otro=null;for(const kk in ALLDOC){if(ALLDOC[kk].g===def.g&&ALLDOC[kk].kw.test(t)){otro=kk;break}}
  return{estado:'rechazado',conf:'alta',steps:[...steps,['❌',otro?'Parece "'+docName(otro)+'", no "'+def.n+'"':'No se reconoce como "'+def.n+'"']],motivo:otro?'Documento equivocado: es "'+docName(otro)+'"':'No corresponde al documento pedido'}}
 steps.push(['✅','Tipo reconocido: '+def.n]);
 const ref=ownerRef(owner);const g=owner==='e1'?'e':owner[0];
 const rx=g==='e'?/\b[A-HJ-NP-SUVW]-?\d{7}[0-9A-J]\b/g:g==='t'?/\b(\d{8}-?[A-Z]|[XYZ]\d{7}[A-Z])\b/g:/\b\d{4}\s?-?[B-DF-HJ-NP-TV-Z]{3}\b/g;
 const ids=(t.toUpperCase().match(rx)||[]).map(x=>x.replace(/[\s-]/g,''));let conf='alta';
 const lbl=g==='e'?'CIF':g==='t'?'DNI':'Matrícula';
 if(ids.length){if(ids.includes(ref))steps.push(['✅',lbl+' '+ref+' coincide con '+ownerName(owner)]);
  else return{estado:'rechazado',conf:'alta',steps:[...steps,['❌','Es de '+lbl+' '+ids[0]+', no de '+ownerName(owner)+' ('+ref+')']],motivo:'El documento es de otro titular ('+ids[0]+')'}}
 else{conf='media';steps.push(['➖','No aparece el '+lbl+'; se comprueba por nombre']);const w=ownerName(owner).split(' ')[0];if(new RegExp(w,'i').test(t))steps.push(['✅','Aparece "'+w+'"']);else{conf='baja';steps.push(['⚠️','No aparece el titular'])}}
 let caduca=null;
 if(def.cad){const ds=findDates(t);const kwr=/(v[aá]lid[oa]? hasta|vencimiento|caduca|caducidad|vigencia|validez hasta|fecha de fin|pr[oó]xima inspecci[oó]n)/ig;let best=null,m;
  while(m=kwr.exec(t)){const near=ds.filter(x=>x.i>m.index&&x.i-m.index<60)[0];if(near){best=near.d;break}}
  if(best){caduca=best;steps.push(['📅','Caducidad encontrada: '+fd(caduca)])}
  else if(ds.length){const em=ds.map(x=>x.d).sort().pop();caduca=addMonths(em,def.m||12);steps.push(['📅','Emitido '+fd(em)+' → validez habitual '+(def.m||12)+' mes(es): '+fd(caduca)]);if(conf==='alta')conf='media'}
  else{steps.push(['⚠️','No hay fechas']);return{estado:'pendiente',conf:'baja',steps,nota:'Sin fecha legible'}}
  if(caduca<TODAY)return{estado:'rechazado',conf:'alta',steps:[...steps,['❌','Está caducado']],motivo:'Caducado el '+fd(caduca),caduca}}
 if(conf==='baja')return{estado:'pendiente',conf,steps:[...steps,['🟣','Hay dudas: lo dejo para que lo confirmes']],nota:'Dudas en la lectura',caduca};
 if(!S.cfg.autoValidar)return{estado:'pendiente',conf,steps:[...steps,['🟣','Validación automática desactivada']],caduca};
 steps.push(['🤖','Validado automáticamente (confianza '+conf+')']);return{estado:'valido',conf,steps,caduca};
}
const TITLES={rc:'PÓLIZA DE SEGURO DE RESPONSABILIDAD CIVIL',ss:'TESORERÍA GENERAL DE LA SEGURIDAD SOCIAL - Certificado de estar al corriente',aeat:'AGENCIA TRIBUTARIA - Certificado de estar al corriente de obligaciones tributarias',art43:'Certificado para contratistas y subcontratistas (artículo 43 LGT)',rnt:'RELACIÓN NOMINAL DE TRABAJADORES (RNT)',acc:'Póliza de seguro de accidentes convenio',mp:'CONCIERTO CON SERVICIO DE PREVENCIÓN AJENO',er:'EVALUACIÓN DE RIESGOS LABORALES',proc:'PROCEDIMIENTO DE TRABAJO en altura y radiofrecuencia',rea:'Registro de Empresas Acreditadas REA',regtel:'Registro de empresas instaladoras de telecomunicación',nda:'Acuerdo de confidencialidad',dni:'DOCUMENTO NACIONAL DE IDENTIDAD',form:'CERTIFICADO DE FORMACIÓN EN PREVENCIÓN DE RIESGOS LABORALES (artículo 19)',apt:'VIGILANCIA DE LA SALUD - Certificado de aptitud: APTO',epi:'ENTREGA DE EQUIPOS DE PROTECCIÓN INDIVIDUAL (EPIs) - arnés anticaídas',altura:'Curso de trabajos en altura',rescate:'Curso de rescate en altura',rf:'Formación en riesgos de radiofrecuencia y campos electromagnéticos',rd614:'Formación riesgo eléctrico RD 614/2001',pemp:'Operador de plataforma elevadora móvil PEMP',conf:'Curso de espacios confinados',aux:'Curso de primeros auxilios',carnet:'Permiso de conducción clase C',pc:'PERMISO DE CIRCULACIÓN',itv:'INSPECCIÓN TÉCNICA DE VEHÍCULOS ITV favorable',seg:'Póliza de seguro del vehículo'};
function sampleText(owner,k,kind){
 const def=ALLDOC[k];let id=ownerRef(owner),name=ownerName(owner);
 if(kind==='otro'){id=owner==='e1'?'B99887766':owner.startsWith('t')?'99887766K':'9999ZZZ';name=owner.startsWith('v')?'Vehículo ajeno':'Antonio Pérez López'}
 const venc=kind==='caducado'?addDays(-15):addDays(300);const dd=x=>x.split('-').reverse().join('/');
 const title=TITLES[k]||('Certificado: '+def.n);
 return `${title}\nTitular: ${name}  ${owner==='e1'?'CIF':owner.startsWith('t')?'DNI':'Matrícula'}: ${id}\nFecha de emisión: ${dd(addDays(-30))}\n${def.cad?'Válido hasta: '+dd(venc):''}\nFirmado digitalmente.`;
}
async function pdfText(file){if(!window.pdfjsLib)return'';pdfjsLib.GlobalWorkerOptions.workerSrc='pdf.worker.min.js';
 const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;let t='';
 for(let i=1;i<=Math.min(pdf.numPages,5);i++){const p=await pdf.getPage(i);const c=await p.getTextContent();t+=c.items.map(x=>x.str).join(' ')+'\n'}return t}
function detectReqs(text){const f={e:[],t:[],v:[]};for(const k in ALLDOC){const d=ALLDOC[k];if(k.startsWith('cur_'))continue;if(d.kw.test(text))f[d.g].push(k)}
 if(/curso de acogida|formaci[oó]n (del|propia del) cliente|induction/i.test(text))f.curso=true;
 const m=text.match(/(\d+)\s*(h|horas)\b[^.]{0,30}(antelaci|antes)/i)||text.match(/(\d+)\s*d[ií]as?[^.]{0,30}(antelaci|antes)/i);if(m)f.antel=/d[ií]a/i.test(m[0])?+m[1]*24:+m[1];
 for(const p of PLAT)if(new RegExp(p,'i').test(text))f.plataforma=p;return f}

/* ---------- router / layout ---------- */
const NAV={
 gestor:[['#/entrada','📥','Correos','corr'],['#/panel','📊','Panel'],['#/trabajos','📋','Trabajos','att'],['#/emergencia','🚨','Emergencia'],['#/clientes','🏢','Clientes'],['#/equipo','👷','Equipo','dud']],
 tecnico:[['#/t/inicio','🏠','Mis trabajos'],['#/t/docs','📁','Mis papeles','faltan'],['#/t/mensajes','✉️','Avisos','unread'],['#/t/carnet','🪪','Acreditación']],
};
function counts(){const u=S.user||{};return{corr:S.correos.filter(m=>!m.hecho).length+S.trabajos.filter(j=>['emplaz','cae'].includes(j.estado)).length,att:S.trabajos.filter(j=>['listo','revisar'].includes(j.estado)).length,dud:S.docs.filter(d=>d.estado==='pendiente'&&lastDoc(d.owner,d.tipo)===d).length,unread:S.mensajes.filter(m=>m.to===u.tid&&!m.leido).length,faltan:u.tid?misFaltan(u.tid).length:0}}
function misFaltan(tid){const m=new Map();S.trabajos.filter(j=>j.trabajadores.includes(tid)&&['faltan','preparando'].includes(j.estado)).forEach(j=>check(j).bloq.filter(i=>i.owner===tid).forEach(i=>m.set(i.k,{...i,j})));return[...m.values()]}
function go(hh){location.hash=hh}
function render(){
 const r=location.hash||'#/';
 if(!S.user){$('#app').innerHTML=loginView();return}
 const nav=NAV[S.user.role];if(r==='#/'||!r.startsWith('#/'))return go(nav[0][0]);
 const cn=counts();const on=hh=>r.startsWith(hh)||(hh==='#/trabajos'&&r.startsWith('#/j/')&&!S.trabajos.find(j=>j.id===r.slice(4))?.flujo)||(hh==='#/entrada'&&r.startsWith('#/j/')&&S.trabajos.find(j=>j.id===r.slice(4))?.flujo)||(hh==='#/clientes'&&r.startsWith('#/c/'))||(hh==='#/equipo'&&r.startsWith('#/o/'));
 const navHtml=cls=>`<nav class="${cls}">${nav.map(([hh,i,t,c])=>`<a href="${hh}" class="${on(hh)?'on':''}"><span class="ic">${i}</span>${t}${c&&cn[c]?`<span class="cnt">${cn[c]}</span>`:''}</a>`).join('')}</nav>`;
 const who=S.user.role==='gestor'?'Gestión PRL':esc(tra(S.user.tid).nombre);
 let body='';try{body=view(r)}catch(e){console.error(e);body='<div class="card">Error: '+esc(e.message)+'</div>'}
 $('#app').innerHTML=`<header class="top"><div class="logo"><span class="sh">📡</span>SitePass</div><div class="who">${who}</div>${S.user.role==='gestor'?'<button class="gear" onclick="go(\'#/ajustes\')" aria-label="Ajustes">⚙️</button>':''}<button class="out" onclick="A.logout()">Salir</button></header><div class="layout">${navHtml('side')}<main>${body}</main></div>${navHtml('bottom')}${S.user.role==='gestor'&&!r.startsWith('#/ia')?'<button class="fab" onclick="go(\'#/ia\')" aria-label="Asistente IA">🤖</button>':''}`;
 window.scrollTo(0,0);if(r.startsWith('#/ia'))setTimeout(()=>{const c=$('.chat');if(c)c.scrollTop=1e6},0);
}
window.addEventListener('hashchange',render);
function view(r){const p=r.slice(2).split('/').map(decodeURIComponent);
 switch(p[0]){case'entrada':return vEntrada();case'panel':return vPanel();case'trabajos':return vTrabajos(p[1]);case'j':return vTrabajo(p[1]);case'nuevo':return vNuevo(p[1]);case'emergencia':return vEmergencia(p[1]);case'clientes':return vClientes();case'c':return vCliente(p[1]);case'equipo':return vEquipo(p[1]);case'o':return vOwner(p[1]);case'ajustes':return vAjustes();case'ia':return vIA();case'actividad':return vActividad();
  case't':return({inicio:vTInicio,docs:vTDocs,mensajes:vTMensajes,carnet:vTCarnet,j:()=>vTTrabajo(p[2])}[p[1]]||vTInicio)()}
 return'<div class="card">Página no encontrada</div>'}
function loginView(){return`<div class="login" style="background:linear-gradient(160deg,#0b1a42,#0f70be 60%,#7c3aed)"><div class="box"><div class="logo" style="color:var(--p);font-size:24px"><span class="sh" style="background:var(--p);color:#fff">📡</span>SitePass</div>
 <p class="mut" style="margin:8px 0 4px">Llega el correo del jefe de proyecto: la IA saca emplazamiento, trabajadores, riesgos y fechas, te prepara la solicitud CAE de e-gestiona y, cuando el cliente pide los papeles, los prepara. Cada cliente pide su documentación para dejar entrar a los técnicos. La IA sabe qué pide cada uno, prepara el paquete, avisa a cada técnico de lo que le falta y en una emergencia te dice quién puede ir ya.</p>
 <p style="font-weight:700;margin:16px 0 0">Entrar como:</p>
 <button class="role" onclick="A.login('gestor')"><span class="ri">👩‍💼</span><span><b>Gestión PRL / documentación</b><br><span class="mut">Clientes, requisitos, paquetes y emergencias</span></span></button>
 <button class="role" onclick="A.loginTec()"><span class="ri">👷</span><span><b>Técnico de campo</b><br><span class="mut">Ve qué le falta y sube sus papeles con una foto</span></span></button>
 <p class="mut" style="font-size:12px;margin-top:16px">Demo de prueba para Tecnove Telecom: clientes y datos ficticios, guardados solo en este navegador.</p></div></div>`}

/* ---------- vistas gestión ---------- */
const pill=st=>{const[t,c]=EST[st]||[st,'gray'];return`<span class="pill ${c}">${t}</span>`};
const avatar=(name,i)=>`<div class="av" style="background:${COLORS[i%COLORS.length]}">${esc(name.split(' ').map(x=>x[0]).slice(0,2).join(''))}</div>`;
const cIdx=id=>S.clientes.findIndex(c=>c.id===id);
function jRow(j,base='#/j/'){const c=cli(j.clienteId);const k=check(j);
 const extra=j.estado==='faltan'?`<span class="pill warn">${k.bloq.length} falta(n)</span>`:'';
 return`<a class="it" href="${base}${j.id}">${avatar(c.nombre,cIdx(c.id))}<div style="flex:1;min-width:0"><div class="t">${j.tipo==='emergencia'?'🚨 ':''}${esc(c.nombre)} <span class="mut">· ${j.codigo}</span></div><div class="s">${esc(j.sitio)} · ${fds(j.desde)}${j.hasta!==j.desde?' → '+fds(j.hasta):''} · ${j.trabajadores.length} téc.${j.vehiculos.length?' · '+j.vehiculos.length+' veh.':''}</div><div class="row" style="margin-top:4px">${pill(j.estado)} ${extra} ${plazoTxt(j)}</div></div><span class="mut">›</span></a>`}
const logRow=l=>`<div class="e"><span class="when">${fdt(l.fecha)}</span><span>${l.auto?'🤖 ':'👤 '}${l.ref?`<a href="#/j/${l.ref}">${esc(l.texto)}</a>`:esc(l.texto)}</span></div>`;
function vPanel(){
 const att=S.trabajos.filter(j=>['listo','revisar'].includes(j.estado));const fal=S.trabajos.filter(j=>j.estado==='faltan');const env=S.trabajos.filter(j=>j.estado==='enviado');
 const tl=S.log.filter(l=>l.auto);const min=tl.reduce((a,l)=>a+l.min,0);
 const cad=S.docs.filter(d=>d.estado==='valido'&&d.caduca&&d.caduca<addDays(S.cfg.diasAviso)&&lastDoc(d.owner,d.tipo)===d).sort((a,b)=>a.caduca.localeCompare(b.caduca));
 return`<h1>Hola 👋</h1>
 <div class="grid g4" style="margin-bottom:14px">
 <a class="kpi ai" href="#/actividad"><b>${tl.length}</b><span>tareas hechas por la IA · ~${Math.round(min/6)/10} h ahorradas</span></a>
 <a class="kpi" href="#/trabajos/att"><b style="color:var(--ai)">${att.length}</b><span>listos para enviar o revisar</span></a>
 <a class="kpi" href="#/trabajos/fal"><b style="color:var(--warn)">${fal.length}</b><span>esperando papeles de técnicos</span></a>
 <a class="kpi" href="#/entrada"><b style="color:var(--p2)">${S.correos.filter(m=>!m.hecho).length}</b><span>correos de jefes de proyecto sin procesar</span></a>
 <a class="kpi emerg" href="#/emergencia"><b>🚨</b><span>Emergencia: ¿quién puede ir ya?</span></a></div>
 <div class="grid g2"><div>
 <div class="card"><div class="row"><h2 class="sp">🟣 Te toca a ti</h2><a class="btn sm" href="#/nuevo">+ Trabajo</a></div>${att.length?`<div class="list">${att.map(j=>jRow(j)).join('')}</div>`:'<div class="empty">Nada pendiente ✅</div>'}</div>
 <div class="card"><h2>⏳ Esperando a los técnicos</h2><p class="mut" style="margin-top:-4px">La IA ya les ha avisado de lo que falta. Cuando lo suban, prepara el paquete sola.</p>${fal.length?`<div class="list">${fal.map(j=>jRow(j)).join('')}</div>`:'<div class="empty">Ninguno</div>'}</div>
 ${env.length?`<div class="card"><h2>📨 Enviados, esperando OK del cliente</h2><div class="list">${env.map(j=>jRow(j)).join('')}</div></div>`:''}
 </div><div>
 <div class="card"><div class="row"><h2 class="sp">🤖 Lo que ha hecho la IA</h2><a href="#/actividad" class="mut">Ver todo</a></div><div class="log">${S.log.slice(0,6).map(logRow).join('')||'<div class="empty">Sin actividad</div>'}</div></div>
 <div class="card"><h2>📅 Caducan pronto (${cad.length})</h2>${cad.map(d=>`<a class="row" href="#/o/${d.owner}" style="padding:6px 0;border-bottom:1px solid var(--line);text-decoration:none;color:inherit"><span class="sp"><b>${esc(docName(d.tipo))}</b><br><span class="mut">${ownerIcon(d.owner)} ${esc(ownerName(d.owner))}</span></span><span class="pill ${d.caduca<TODAY?'bad':'warn'}">${fd(d.caduca)}</span></a>`).join('')||'<div class="empty">Ninguno</div>'}${cad.length?'<p class="mut">La IA ya ha avisado a los técnicos.</p>':''}</div>
 <button class="btn ai block" onclick="A.reanalizar()">🤖 Que la IA revise todo ahora</button></div></div>`}
function vActividad(){return`<h1>Actividad de la IA</h1><div class="card log">${S.log.map(logRow).join('')}</div>`}
function vTrabajos(f='att'){
 const F={att:['Te toca',j=>['listo','revisar'].includes(j.estado)],fal:['Faltan papeles',j=>j.estado==='faltan'],env:['Enviados',j=>j.estado==='enviado'],ok:['Concedidos',j=>j.estado==='concedido'],fin:['Archivo',j=>['finalizado','denegado'].includes(j.estado)],all:['Todos',()=>true]};
 const list=S.trabajos.filter(F[f]?.[1]||(()=>true)).sort((a,b)=>a.desde.localeCompare(b.desde));
 return`<div class="row"><h1 class="sp">Trabajos</h1><a class="btn sm" href="#/nuevo">+ Nuevo trabajo</a></div><div class="tabs">${Object.entries(F).map(([k,[t,fn]])=>`<button class="${k===f?'on':''}" onclick="go('#/trabajos/${k}')">${t} (${S.trabajos.filter(fn).length})</button>`).join('')}</div><div class="card list">${list.map(j=>jRow(j)).join('')||'<div class="empty">No hay trabajos aquí</div>'}</div>`}
function checkTable(j,canAct,onlyOwner){
 const k=check(j);const g={};k.items.filter(i=>!onlyOwner||i.owner===onlyOwner).forEach(i=>(g[i.owner]=g[i.owner]||[]).push(i));
 return Object.entries(g).map(([o,its])=>`<div class="card"><div class="row"><h3 class="sp">${ownerIcon(o)} ${esc(ownerName(o))}${o.startsWith('t')?` <span class="mut">· ${esc(tra(o).puesto)}</span>`:o.startsWith('v')?` <span class="mut">· ${veh(o).mat}</span>`:''}</h3>${its.every(i=>OKST.includes(i.st))?'<span class="pill ok">Todo OK</span>':''}</div>
 <div class="tw"><table>${its.map(i=>docLine(o,i.k,i,canAct,!canAct)).join('')}</table></div></div>`).join('')}
function docLine(o,k,st,canAct,canUpload){return`<tr><td>${esc(docName(k))}${st.d?.nota&&st.st==='pendiente'?`<div class="mut">🟣 ${esc(st.d.nota)}</div>`:''}${st.d?.motivo&&st.st==='rechazado'?`<div class="mut" style="color:var(--bad)">${esc(st.d.motivo)}</div>`:''}${st.d&&OKST.includes(st.st)?`<div class="mut">${st.d.por==='ia'?'🤖 Validado por IA':'👤 Validado a mano'}</div>`:''}</td><td style="text-align:right"><span class="pill ${st.c}">${st.txt}</span>${canAct&&st.st==='pendiente'?`<div class="row" style="justify-content:flex-end;margin-top:6px"><button class="btn sm ok" onclick="A.valDoc('${st.d.id}',1)">Validar</button><button class="btn sm bad" onclick="A.valDoc('${st.d.id}',0)">Rechazar</button></div>`:''}${canUpload&&(BAD.includes(st.st)||st.st==='por_caducar'||canUpload==='all')?`<div style="margin-top:6px"><button class="btn sm ${OKST.includes(st.st)?'ghost':''}" onclick="A.upload('${o}','${k}')">${st.d?'Renovar':'Subir'}</button></div>`:''}${canAct&&BAD.includes(st.st)&&o.startsWith('t')?`<div style="margin-top:6px"><button class="btn sm sec" onclick="A.upload('${o}','${k}')">Subirlo yo</button></div>`:''}${canAct&&BAD.includes(st.st)&&!o.startsWith('t')?`<div style="margin-top:6px"><button class="btn sm" onclick="A.upload('${o}','${k}')">Subir</button></div>`:''}</td></tr>`}
function vTrabajo(id){
 const j=S.trabajos.find(x=>x.id===id);if(!j)return'<div class="card">No existe</div>';const c=cli(j.clienteId);const k=check(j);
 let ai='';
 if(j.estado==='faltan'){const tecs=[...new Set(k.bloq.filter(i=>i.owner.startsWith('t')).map(i=>tra(i.owner).nombre.split(' ')[0]))];const emp=k.bloq.filter(i=>!i.owner.startsWith('t'));
  ai=`${c.nombre} pide <b>${k.total}</b> documentos para este trabajo y faltan <b>${k.bloq.length}</b>. ${tecs.length?'Ya he avisado a '+tecs.join(', ')+'. ':''}${emp.length?'<br>⚠️ '+emp.length+' son de la empresa o de los vehículos: súbelos tú.':''}${alternativas(j)}`}
 else if(j.estado==='revisar')ai=`Todo está correcto salvo <b>${k.pend.length}</b> documento(s) que no he podido leer con seguridad. Confírmalos abajo y preparo el paquete.`;
 else if(j.estado==='listo')ai=`Paquete preparado: <b>${k.total} documentos</b>, todos vigentes hasta el final del trabajo. ${c.plataforma==='Email'?'Puedo enviarlo por email ahora.':'Este cliente usa <b>'+c.plataforma+'</b>: descarga el paquete y súbelo allí (en la versión real se puede conectar o automatizar).'}`;
 else if(j.estado==='enviado')ai=`Enviado el ${fdt(j.enviado)}. Cuando el cliente confirme, márcalo como concedido.`;
 else if(j.estado==='concedido')ai=`Acceso concedido. Los técnicos ya tienen el aviso${j.emp?' con la dirección, el mapa y las condiciones del sitio':''}.`;
 return`<a href="${j.flujo?'#/entrada':'#/trabajos'}" class="mut">‹ ${j.flujo?'Correos':'Trabajos'}</a><div class="row" style="margin:6px 0 12px"><h1 class="sp" style="margin:0">${j.tipo==='emergencia'?'🚨 ':''}${j.codigo}</h1>${pill(j.estado)}</div>
 ${j.flujo?flujoBox(j):''}${ai?`<div class="aibox"><h3>🤖 La IA dice</h3><div>${ai}</div></div>`:''}
 <div class="row" style="margin-bottom:14px">${j.estado==='listo'?`<button class="btn ok" onclick="A.enviar('${j.id}')">${c.plataforma==='Email'?'✉ Enviar al cliente':'✔ Marcar como subido a '+c.plataforma}</button><button class="btn sec" onclick="A.paquete('${j.id}')">📦 Ver paquete / email</button>`:''}
 ${j.estado==='enviado'?`<button class="btn ok" onclick="A.estado('${j.id}','concedido')">✔ El cliente ha dado acceso</button><button class="btn bad" onclick="A.estado('${j.id}','denegado')">✖ Lo ha denegado</button><button class="btn sec" onclick="A.paquete('${j.id}')">📦 Ver paquete</button>`:''}
 ${j.estado==='faltan'?`<button class="btn sec" onclick="A.recordar('${j.id}')">🔔 Recordar a los técnicos</button>`:''}</div>
 <div class="card"><div class="grid g2"><div><span class="mut">Cliente</span><br><a href="#/c/${c.id}"><b>${esc(c.nombre)}</b></a><br><span class="mut">${TIPOS[c.tipo]} · ${c.plataforma} · antelación ${c.antel?c.antel+' h':'inmediata'}</span></div><div><span class="mut">Dónde y cuándo</span><br><b>${esc(j.sitio)}</b><br><span class="mut">${fd(j.desde)}${j.hasta!==j.desde?' → '+fd(j.hasta):''}</span> ${plazoTxt(j)}</div></div>
 <p style="margin:12px 0 0"><span class="mut">Trabajo:</span> ${esc(j.descripcion)}</p>
 ${j.flujo&&!j.req?'':`<div style="margin-top:12px"><div class="mut">Documentación ${k.ok}/${k.total}</div><div style="height:8px;background:#eef1f4;border-radius:9px;overflow:hidden;margin-top:4px"><div style="height:100%;width:${Math.round(k.ok/k.total*100)}%;background:${k.ok===k.total?'var(--ok)':'var(--p2)'}"></div></div></div>`}</div>
 ${j.flujo&&!j.req?'':checkTable(j,true)}
 <div class="card"><h3>Historial</h3><div class="log">${j.hist.slice().reverse().map(x=>`<div class="e"><span class="when">${fdt(x.fecha)}</span><span>${x.quien==='IA'?'🤖':'👤'} ${esc(x.texto)}</span></div>`).join('')}</div></div>`}
function alternativas(j){const c=cli(j.clienteId);const k=check(j);const malos=[...new Set(k.bloq.filter(i=>i.owner.startsWith('t')).map(i=>i.owner))];if(!malos.length)return'';
 const alt=S.trabajadores.filter(t=>!j.trabajadores.includes(t.id)&&aptitud(t.id,c,j.hasta).bad.length===0);
 if(!alt.length)return'';return`<div style="margin-top:8px">💡 <b>Alternativa:</b> ${alt.map(t=>esc(t.nombre)).join(', ')} ${alt.length>1?'tienen':'tiene'} todo lo que pide ${esc(c.nombre)}. ${malos.map(m=>alt[0]?`<button class="btn sm ai" style="margin-top:6px" onclick="A.sustituir('${j.id}','${m}','${alt[0].id}')">Cambiar a ${esc(tra(m).nombre.split(' ')[0])} por ${esc(alt[0].nombre.split(' ')[0])}</button>`:'').join(' ')}</div>`}
function candidatos(c,hasta){return S.trabajadores.map(t=>({t,a:aptitud(t.id,c,hasta)})).sort((x,y)=>x.a.bad.length-y.a.bad.length)}
function vNuevo(cid){const c=cli(cid||'c1');
 return`<a href="#/trabajos" class="mut">‹ Trabajos</a><h1>Nuevo trabajo</h1><form class="card" onsubmit="event.preventDefault();A.crear(this,'programado')">
 <label>Cliente</label><select name="cli" onchange="go('#/nuevo/'+this.value)">${S.clientes.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${esc(x.nombre)}</option>`).join('')}</select>
 <p class="mut">Pide ${reqsFor(c).e.length} docs de empresa, ${reqsFor(c).t.length} por técnico${c.reqV.length?', '+c.reqV.length+' por vehículo':''} · ${c.plataforma} · antelación ${c.antel?c.antel+' h':'inmediata'}</p>
 <label>Lugar / emplazamiento</label><input name="sitio" required placeholder="Ej.: Emplazamiento MAD-1042">
 <div class="grid g2"><div><label>Desde</label><input type="date" name="desde" value="${addDays(5)}" required></div><div><label>Hasta</label><input type="date" name="hasta" value="${addDays(5)}" required></div></div>
 <label>Descripción</label><input name="desc" required placeholder="Ej.: Instalación de radioenlace">
 <label>Técnicos <span class="mut" style="font-weight:400">· 🤖 ordenados por la IA: primero los que cumplen todo</span></label>${candGrid(c,addDays(5))}
 ${S.vehiculos.length?`<label>Vehículos</label>${S.vehiculos.map(v=>{const a=aptitud(v.id,c,addDays(5));return`<label class="cand"><input type="checkbox" name="v" value="${v.id}"><span class="sp">${esc(v.nombre)} <span class="mut">· ${v.mat}</span></span>${c.reqV.length?(a.bad.length?`<span class="pill bad">Falta ${a.bad.length}</span>`:'<span class="pill ok">Apto</span>'):''}</label>`}).join('')}`:''}
 <button class="btn block" style="margin-top:14px">Crear y que la IA prepare la documentación</button></form>`}
function candGrid(c,hasta,preselect){return candidatos(c,hasta).map(({t,a},i)=>`<label class="cand"><input type="checkbox" name="t" value="${t.id}" ${preselect&&!a.bad.length&&i<preselect?'checked':''}><span class="sp"><b>${esc(t.nombre)}</b><br><span class="mut">${esc(t.puesto)}</span>${a.bad.length?`<br><span class="mut" style="color:var(--bad)">Le falta: ${a.bad.slice(0,2).map(b=>esc(docName(b.k))).join(', ')}${a.bad.length>2?'…':''}</span>`:''}</span>${a.bad.length?`<span class="pill bad">${a.total-a.bad.length}/${a.total}</span>`:'<span class="pill ok">✔ Puede ir</span>'}</label>`).join('')}
function vEmergencia(cid){const c=cid?cli(cid):null;
 if(!c)return`<h1>🚨 Emergencia</h1><div class="aibox"><h3>🤖 Elige el cliente</h3>Te digo al momento qué técnicos y vehículos cumplen todo lo que pide, preparo el paquete y lo envío.</div><div class="card list">${S.clientes.map((x,i)=>`<a class="it" href="#/emergencia/${x.id}">${avatar(x.nombre,i)}<div style="flex:1"><div class="t">${esc(x.nombre)}</div><div class="s">${TIPOS[x.tipo]} · ${candidatos(x,TODAY).filter(y=>!y.a.bad.length).length} técnicos pueden ir ya</div></div><span class="mut">›</span></a>`).join('')}</div>`;
 const ok=candidatos(c,TODAY).filter(x=>!x.a.bad.length);
 return`<a href="#/emergencia" class="mut">‹ Emergencia</a><h1>🚨 ${esc(c.nombre)}</h1><div class="aibox"><h3>🤖 ${ok.length} técnico(s) pueden ir ahora mismo</h3>Tienen todo lo que pide ${esc(c.nombre)} en vigor. Los he marcado; ajusta si quieres.</div>
 <form class="card" onsubmit="event.preventDefault();A.crear(this,'emergencia')"><input type="hidden" name="cli" value="${c.id}">
 <label>Lugar</label><input name="sitio" required placeholder="Ej.: Hospital de campaña / recinto"><label>Qué hay que hacer</label><input name="desc" value="Despliegue de unidad de contingencia (cobertura + energía)">
 <input type="hidden" name="desde" value="${TODAY}"><label>Hasta</label><input type="date" name="hasta" value="${addDays(1)}">
 <label>Técnicos</label>${candGrid(c,TODAY,2)}
 <label>Vehículos</label>${S.vehiculos.map(v=>{const a=aptitud(v.id,c,TODAY);return`<label class="cand"><input type="checkbox" name="v" value="${v.id}" ${!a.bad.length&&v.id==='v1'?'checked':''}><span class="sp">${esc(v.nombre)} <span class="mut">· ${v.mat}</span></span>${c.reqV.length?(a.bad.length?`<span class="pill bad">Falta ${a.bad.length}</span>`:'<span class="pill ok">Apto</span>'):''}</label>`}).join('')}
 <button class="btn bad block" style="margin-top:14px">🚨 Crear y enviar documentación ya</button></form>`}
function vClientes(){return`<div class="row"><h1 class="sp">Clientes</h1><button class="btn sm" onclick="A.nuevoCliente()">+ Cliente</button></div><div class="aibox" style="padding:10px 14px">🤖 Cada cliente tiene sus requisitos. Pega el email o PDF del cliente y la IA saca la lista sola.</div><div class="card list">${S.clientes.map((c,i)=>{const r=reqsFor(c);const ok=candidatos(c,TODAY).filter(x=>!x.a.bad.length).length;return`<a class="it" href="#/c/${c.id}">${avatar(c.nombre,i)}<div style="flex:1"><div class="t">${esc(c.nombre)}</div><div class="s">${TIPOS[c.tipo]} · ${c.plataforma} · ${r.e.length+r.t.length+r.v.length} requisitos</div></div><span class="pill ${ok?'ok':'bad'}">${ok}/${S.trabajadores.length} aptos</span></a>`}).join('')}</div>`}
function vCliente(id){const c=cli(id);const box=(g,list,sel)=>CAT[g].map(d=>`<label class="chk"><input type="checkbox" ${sel.includes(d.k)?'checked':''} onchange="A.req('${c.id}','${g}','${d.k}',this.checked)"> ${esc(d.n)}</label>`).join('');
 return`<a href="#/clientes" class="mut">‹ Clientes</a><h1>${esc(c.nombre)}</h1>
 <div class="card"><div class="grid g3"><div><label>Tipo</label><select onchange="A.cset('${c.id}','tipo',this.value)">${Object.entries(TIPOS).map(([k,v])=>`<option value="${k}" ${k===c.tipo?'selected':''}>${v}</option>`).join('')}</select></div><div><label>Cómo se envía</label><select onchange="A.cset('${c.id}','plataforma',this.value)">${PLAT.map(p=>`<option ${p===c.plataforma?'selected':''}>${p}</option>`).join('')}</select></div><div><label>Antelación (horas)</label><input type="number" value="${c.antel}" onchange="A.cset('${c.id}','antel',+this.value)"></div></div>
 <label>Email de contacto</label><input value="${esc(c.email)}" onchange="A.cset('${c.id}','email',this.value)"><label>Notas</label><input value="${esc(c.notas||'')}" onchange="A.cset('${c.id}','notas',this.value)"></div>
 <div class="aibox"><h3>🤖 Leer requisitos con IA</h3><p class="mut" style="margin-top:0">Pega aquí el email o el texto del PDF de requisitos del cliente (o sube el PDF) y marco solo los documentos que pide.</p><textarea id="rq" placeholder="Ej.: Para acceder deberán aportar seguro de RC, certificado de la Seguridad Social, TC2, formación en altura y aptitud médica de cada trabajador, ITV del vehículo... con 72 horas de antelación por Ctaima."></textarea><div class="row" style="margin-top:8px"><button class="btn ai" onclick="A.leerReq('${c.id}')">🤖 Detectar requisitos</button><input type="file" accept=".pdf" style="max-width:220px" onchange="A.leerReqPdf('${c.id}',this.files[0])"></div><div id="rqres"></div></div>
 <div class="card"><h3>🏢 Pide a la empresa</h3>${box('e',CAT.e,c.reqE)}</div>
 <div class="card"><h3>👷 Pide a cada técnico</h3>${box('t',CAT.t,c.reqT)}<label class="chk"><input type="checkbox" ${c.curso?'checked':''} onchange="A.cset('${c.id}','curso',this.checked)"> Curso de acogida propio del cliente</label></div>
 <div class="card"><h3>🚚 Pide a cada vehículo</h3>${box('v',CAT.v,c.reqV)}</div>
 <div class="card"><h3>¿Quién puede ir hoy?</h3>${candidatos(c,TODAY).map(({t,a})=>`<div class="row" style="padding:6px 0;border-bottom:1px solid var(--line)"><span class="sp">${esc(t.nombre)}${a.bad.length?`<br><span class="mut">Le falta: ${a.bad.map(b=>esc(docName(b.k))).join(', ')}</span>`:''}</span>${a.bad.length?`<span class="pill bad">${a.total-a.bad.length}/${a.total}</span>`:'<span class="pill ok">✔</span>'}</div>`).join('')}</div>`}
function vEquipo(tab='mx'){
 const tabs=`<div class="tabs"><button class="${tab==='mx'?'on':''}" onclick="go('#/equipo/mx')">Quién puede ir a cada cliente</button><button class="${tab==='list'?'on':''}" onclick="go('#/equipo/list')">Técnicos y vehículos</button></div>`;
 if(tab==='mx')return`<h1>Equipo</h1>${tabs}<div class="card tw"><table class="mx"><tr><th>Técnico</th>${S.clientes.map(c=>`<th title="${esc(c.nombre)}">${esc(c.nombre.split(' ').slice(0,2).join(' '))}</th>`).join('')}</tr>${S.trabajadores.map(t=>`<tr><td><a href="#/o/${t.id}">${esc(t.nombre.split(' ').slice(0,2).join(' '))}</a></td>${S.clientes.map(c=>{const a=aptitud(t.id,c);const w=a.its.some(i=>i.st==='por_caducar');return`<td><span class="dot ${a.bad.length?'bad':w?'warn':'ok'}" title="${a.bad.map(b=>docName(b.k)).join(', ')}">${a.bad.length?a.bad.length:'✔'}</span></td>`}).join('')}</tr>`).join('')}</table><p class="mut">✔ = cumple todo lo que pide ese cliente · número = documentos que le faltan</p></div>
 ${(()=>{const e=CAT.e.map(d=>({k:d.k,...docSt('e1',d.k)})).filter(x=>!OKST.includes(x.st)||x.st==='por_caducar');return e.length?`<div class="card"><h3>🏢 Documentos de Tecnove a revisar</h3><div class="tw"><table>${e.map(x=>docLine('e1',x.k,x,true,'all')).join('')}</table></div></div>`:''})()}`;
 return`<h1>Equipo</h1>${tabs}<div class="card list"><a class="it" href="#/o/e1">${avatar('Tecnove Telecom',6)}<div style="flex:1"><div class="t">Tecnove Telecom (empresa)</div><div class="s">${CAT.e.length} documentos</div></div>${semaf('e1')}</a>${S.trabajadores.map((t,i)=>`<a class="it" href="#/o/${t.id}">${avatar(t.nombre,i)}<div style="flex:1"><div class="t">${esc(t.nombre)}</div><div class="s">${esc(t.puesto)} · ${t.dni}</div></div>${semaf(t.id)}</a>`).join('')}${S.vehiculos.map(v=>`<a class="it" href="#/o/${v.id}"><div class="av" style="background:#475569">🚚</div><div style="flex:1"><div class="t">${esc(v.nombre)}</div><div class="s">${v.mat}</div></div>${semaf(v.id)}</a>`).join('')}</div><button class="btn ghost block" onclick="A.addTrab()">+ Añadir técnico</button>`}
function ownerKeys(o){const g=o==='e1'?'e':o[0];const base=CAT[g].map(d=>d.k);const extra=[...new Set(S.docs.filter(d=>d.owner===o).map(d=>d.tipo))].filter(k=>!base.includes(k));return{base,extra}}
function semaf(o){const{base,extra}=ownerKeys(o);const have=[...base,...extra].map(k=>docSt(o,k)).filter(s=>s.st!=='falta');const bad=have.filter(s=>BAD.includes(s.st)).length,w=have.filter(s=>s.st==='por_caducar').length,p=have.filter(s=>s.st==='pendiente').length;
 return(bad?`<span class="pill bad">${bad} caducado</span>`:'')+(w?`<span class="pill warn">${w} caduca</span>`:'')+(p?`<span class="pill ai">${p} dudoso</span>`:'')+(!bad&&!w&&!p?'<span class="pill ok">Al día</span>':'')}
function vOwner(o,asTec){const{base,extra}=ownerKeys(o);const keys=[...base,...extra];
 const has=keys.filter(k=>lastDoc(o,k)),no=keys.filter(k=>!lastDoc(o,k));
 return`${asTec?'':'<a href="#/equipo/list" class="mut">‹ Equipo</a>'}<h1>${ownerIcon(o)} ${esc(ownerName(o))}</h1>${o.startsWith('t')?`<p class="mut">${esc(tra(o).puesto)} · ${tra(o).dni} · ${tra(o).tel}</p>`:''}
 <div class="card"><h3>Documentos que tiene</h3><div class="tw"><table>${has.map(k=>docLine(o,k,docSt(o,k),!asTec,'all')).join('')||'<tr><td class="empty">Ninguno</td></tr>'}</table></div></div>
 <div class="card"><h3>Otros documentos (solo si algún cliente los pide)</h3><div class="tw"><table>${no.map(k=>`<tr><td>${esc(docName(k))}<div class="mut">Lo piden: ${S.clientes.filter(c=>Object.values(reqsFor(c)).flat().includes(k)).map(c=>esc(c.nombre)).join(', ')||'ningún cliente'}</div></td><td style="text-align:right"><button class="btn sm ghost" onclick="A.upload('${o}','${k}')">Subir</button></td></tr>`).join('')}</table></div></div>`}
function vAjustes(){const sw=(k,t,d)=>`<label class="switch"><input type="checkbox" ${S.cfg[k]?'checked':''} onchange="A.cfg('${k}',this.checked)"><span><b>${t}</b><br><span class="mut" style="font-weight:400">${d}</span></span></label>`;
 return`<h1>Ajustes de la IA</h1><div class="card">${sw('autoValidar','La IA valida documentos sola','Si es el documento correcto, del titular y en fecha, se valida sin que lo mires.')}${sw('avisoTrabajadores','La IA avisa a cada técnico de lo que le falta','Mensaje con la lista exacta (en la versión real, por WhatsApp).')}${sw('autoEnviarEmail','Envío automático a clientes por email','Cuando el paquete está completo y el cliente lo recibe por email, sale solo.')}${sw('avisosCaducidad','Avisos de caducidad','Antes de que caduque cualquier documento.')}<label>Días de antelación del aviso</label><input type="number" min="5" max="90" value="${S.cfg.diasAviso}" onchange="A.cfg('diasAviso',+this.value)"></div>
 <div class="card"><h3>Sobre la IA de esta demo</h3><p class="mut">La demo funciona entera en el navegador: lee el texto de los PDF (tipo de documento, fechas, DNI/CIF/matrícula), cruza los requisitos de cada cliente y prepara los paquetes. En la versión real se conecta a un modelo de IA (por ejemplo Claude) que lee también fotos y escaneos, envía emails y WhatsApp de verdad y puede subir documentos a plataformas como Ctaima, Dokify o Nalanda.</p><button class="btn bad" onclick="A.reset()">Reiniciar datos de la demo</button></div>`}

/* ---------- asistente ---------- */
let CHAT=[{b:1,t:'Hola, soy tu asistente de documentación. Pregúntame qué técnico puede ir a un cliente, qué falta o qué caduca, o pídeme que redacte un email.'}];
function vIA(){return`<h1>🤖 Asistente IA</h1><div class="card" style="background:#faf7ff"><div class="chat">${CHAT.map(m=>`<div class="msg ${m.b?'b':'u'}">${m.h||esc(m.t)}</div>`).join('')}</div>
 <div class="chips">${['¿Qué tengo pendiente?','¿Quién puede ir al Hospital?','¿Qué caduca este mes?','¿Qué le falta a Sergio?','Redacta el email para el Recinto Ferial'].map(q=>`<button onclick="A.ask(this.textContent)">${q}</button>`).join('')}</div>
 <form class="row" onsubmit="event.preventDefault();A.ask(this.q.value)"><input name="q" placeholder="Escribe tu pregunta…" autocomplete="off" style="flex:1"><button class="btn ai">Enviar</button></form></div>`}
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function findCli(q){const n=norm(q);return S.clientes.find(c=>norm(c.nombre).split(/[\s·]+/).filter(w=>w.length>3).some(w=>n.includes(w)))}
function findTra(q){const n=norm(q);return S.trabajadores.find(t=>norm(t.nombre).split(' ').filter(w=>w.length>2).some(w=>new RegExp('\\b'+w+'\\b').test(n)))}
function answer(q){const n=norm(q);const c=findCli(q),t=findTra(q);
 if(/redact|email|correo/.test(n)&&c){const j=S.trabajos.find(x=>x.clienteId===c.id&&!['finalizado','denegado'].includes(x.estado));if(!j)return{t:'No hay trabajos abiertos con '+c.nombre+'.'};const k=check(j);
  if(k.bloq.length)return{t:`El trabajo ${j.codigo} aún no está completo (faltan ${k.bloq.length}):\n${k.bloq.map(i=>'• '+docName(i.k)+' — '+ownerName(i.owner)).join('\n')}\n\nCuando esté, preparo el email. Borrador:\n\n`+emailCliente(j)};return{t:emailCliente(j)}}
 if(t&&/falta|necesit|papeles|document/.test(n)){const r=S.clientes.map(c=>({c,a:aptitud(t.id,c)}));return{t:`${t.nombre} (${t.puesto}):\n`+r.map(({c,a})=>`• ${c.nombre}: ${a.bad.length?'le falta '+a.bad.map(b=>docName(b.k)+' ('+b.txt.toLowerCase()+')').join(', '):'✔ puede ir'}`).join('\n')}}
 if(c&&/quien|puede|ir|apto|disponible|mandar|enviar/.test(n)){const l=candidatos(c,TODAY);return{t:`Para ${c.nombre}:\n✔ Pueden ir: ${l.filter(x=>!x.a.bad.length).map(x=>x.t.nombre).join(', ')||'nadie ahora mismo'}\n${l.filter(x=>x.a.bad.length).map(x=>`✖ ${x.t.nombre}: falta ${x.a.bad.map(b=>docName(b.k)).join(', ')}`).join('\n')}`}}
 if(c){const r=reqsFor(c);return{t:`${c.nombre} (${TIPOS[c.tipo]}) · ${c.plataforma} · antelación ${c.antel?c.antel+' h':'inmediata'}\nEmpresa: ${r.e.map(docName).join('; ')}\nCada técnico: ${r.t.map(docName).join('; ')}${r.v.length?'\nVehículos: '+r.v.map(docName).join('; '):''}${c.notas?'\nNota: '+c.notas:''}`}}
 if(/caduc|venc|renov/.test(n)){const l=S.docs.filter(d=>lastDoc(d.owner,d.tipo)===d&&d.caduca&&d.caduca<addDays(Math.max(30,S.cfg.diasAviso))).sort((a,b)=>a.caduca.localeCompare(b.caduca));return{t:l.length?'Caducados o a punto:\n'+l.map(d=>`• ${docName(d.tipo)} — ${ownerName(d.owner)}: ${d.caduca<TODAY?'CADUCADO':'caduca'} ${fd(d.caduca)}`).join('\n')+'\n\nLos técnicos ya están avisados.':'Nada caduca en los próximos 30 días.'}}
 if(/pendiente|tengo|hacer|resumen|hoy/.test(n)){const a=S.trabajos.filter(j=>['listo','revisar'].includes(j.estado)),f=S.trabajos.filter(j=>j.estado==='faltan');
  return{t:`Te toca (${a.length}):\n${a.map(j=>`• ${j.codigo} ${cli(j.clienteId).nombre} — ${j.estado==='listo'?'paquete listo, enviar/subir a '+cli(j.clienteId).plataforma:'confirmar documento dudoso'}`).join('\n')||'• Nada'}\n\nEsperando a técnicos (${f.length}):\n${f.map(j=>`• ${j.codigo} ${cli(j.clienteId).nombre} — faltan ${check(j).bloq.length}`).join('\n')||'• Nada'}\n\nLa IA lleva ${S.log.filter(l=>l.auto).length} tareas hechas.`}}
 return{t:'Prueba con:\n• "¿Qué tengo pendiente?"\n• "¿Quién puede ir al Data Center?"\n• "¿Qué le falta a Laura?"\n• "¿Qué caduca este mes?"\n• "¿Qué pide el Hospital?"\n• "Redacta el email para el Recinto Ferial"'}}

/* ---------- vistas técnico ---------- */
function vTInicio(){const tid=S.user.tid;const js=S.trabajos.filter(j=>j.trabajadores.includes(tid)).sort((a,b)=>a.desde.localeCompare(b.desde));const f=misFaltan(tid);
 return`<h1>Hola, ${esc(tra(tid).nombre.split(' ')[0])}</h1>${f.length?`<div class="aibox"><h3>🤖 Te falta ${f.length} documento(s)</h3>${f.map(i=>`<div class="row" style="padding:6px 0"><span class="sp">${esc(docName(i.k))}<br><span class="mut">Para ${esc(cli(i.j.clienteId).nombre)} · ${i.txt}</span></span><button class="btn sm" onclick="A.upload('${tid}','${i.k}')">📷 Subir</button></span></div>`).join('')}<p class="mut" style="margin-bottom:0">Haz una foto o sube el PDF. La IA lo revisa al momento.</p></div>`:'<div class="card" style="background:var(--okb);border-color:#bfe8cc">✅ Tienes todo lo necesario para tus próximos trabajos.</div>'}
 <div class="card list"><h3>Mis trabajos</h3>${js.filter(j=>j.estado!=='finalizado').map(j=>jRow(j,'#/t/j/')).join('')||'<div class="empty">No tienes trabajos asignados</div>'}</div>`}
function vTTrabajo(id){const j=S.trabajos.find(x=>x.id===id);const c=cli(j.clienteId);return`<a href="#/t/inicio" class="mut">‹ Mis trabajos</a><div class="row" style="margin:6px 0 12px"><h1 class="sp" style="margin:0">${j.codigo}</h1>${pill(j.estado)}</div><div class="card"><b>${esc(c.nombre)}</b><br>${esc(j.sitio)}<br><span class="mut">${fd(j.desde)}${j.hasta!==j.desde?' → '+fd(j.hasta):''}</span><p style="margin:8px 0 0">${esc(j.descripcion)}</p>${c.notas?`<p class="mut">ℹ️ ${esc(c.notas)}</p>`:''}</div>${checkTable(j,false,S.user.tid)}`}
function vTDocs(){return vOwner(S.user.tid,true)}
function vTMensajes(){const tid=S.user.tid;const ms=S.mensajes.filter(m=>m.to===tid);setTimeout(()=>{let ch=0;ms.forEach(m=>{if(!m.leido){m.leido=true;ch=1}});if(ch)save()},500);
 return`<h1>Avisos</h1><p class="mut">En la versión real te llegan también por WhatsApp.</p>${ms.map(m=>`<div class="card"><div class="row"><b class="sp">${m.leido?'':'🔵 '}${esc(m.asunto)}</b><span class="mut">${fdt(m.fecha)}</span></div><div style="white-space:pre-wrap;margin-top:8px;font-size:14px">${esc(m.texto)}</div>${m.ref?`<a class="btn sm sec" style="margin-top:8px" href="#/t/j/${m.ref}">Ver trabajo</a>`:''}</div>`).join('')||'<div class="card empty">Sin avisos</div>'}`}
function vTCarnet(){const t=tra(S.user.tid);const ok=CAT.t.map(d=>({k:d.k,...docSt(t.id,d.k)})).filter(x=>OKST.includes(x.st));const code='TECNOVE|'+t.dni+'|'+TODAY;
 return`<h1>Mi acreditación</h1><div class="card" style="text-align:center"><div class="big">${esc(t.nombre)}</div><p class="mut" style="margin:2px 0 8px">${esc(t.puesto)} · DNI ${t.dni}<br>Tecnove Telecom</p><div class="qr">${qrSvg(code)}</div><p class="mut">Enséñalo si te piden comprobar tu documentación en el acceso.</p></div><div class="card"><h3>Documentos en vigor (${ok.length})</h3>${ok.map(x=>`<div class="row" style="padding:5px 0;border-bottom:1px solid var(--line)"><span class="sp">${esc(docName(x.k))}</span><span class="pill ${x.c}">${x.d.caduca?fd(x.d.caduca):'✔'}</span></div>`).join('')}</div>`}
function qrSvg(t){if(!window.qrcode)return'';const q=qrcode(0,'M');q.addData(t);q.make();return q.createSvgTag({cellSize:5,margin:2,scalable:true})}

/* ---------- acciones ---------- */
function modal(html){$('#modalBox').innerHTML=html;$('#modal').classList.remove('hidden')}
function closeModal(){$('#modal').classList.add('hidden')}
const A={
 login(role,tid){S.user={role,tid};save();location.hash='';render()},
 loginTec(){modal(`<h2>¿Quién eres?</h2><p class="mut">Demo: elige un técnico.</p>${S.trabajadores.map(t=>`<button class="role" onclick="closeModal();A.login('tecnico','${t.id}')"><span class="ri">👷</span><span><b>${esc(t.nombre)}</b><br><span class="mut">${esc(t.puesto)}</span></span></button>`).join('')}`)},
 logout(){S.user=null;save();location.hash='';render()},
 reanalizar(){const n=runAI(true);toast(n?'🤖 La IA ha hecho '+n+' tarea(s)':'🤖 Revisado: todo al día',true);render()},
 cfg(k,v){S.cfg[k]=v;if(k==='diasAviso')S.docs.forEach(d=>d.avisado=false);runAI();render()},
 reset(){if(confirm('¿Borrar los cambios y volver a los datos de ejemplo?')){localStorage.removeItem(KEY);S=load();CHAT=CHAT.slice(0,1);location.hash='';render()}},
 valDoc(id,ok){const d=S.docs.find(x=>x.id===id);if(ok){if(ALLDOC[d.tipo].cad&&!d.caduca){const c=prompt('Fecha de caducidad (AAAA-MM-DD)',addDays(365));if(!c)return;d.caduca=c}d.estado='valido';d.por='gestor';d.nota=null;log('Validado a mano: '+docName(d.tipo)+' de '+ownerName(d.owner),0,false)}
  else{const m=prompt('Motivo del rechazo (se avisa al técnico)','No se lee bien, súbelo de nuevo');if(m===null)return;d.estado='rechazado';d.motivo=m;d.por='gestor';if(d.owner.startsWith('t'))notify(d.owner,'Documento rechazado',docName(d.tipo)+': '+m);log('Rechazado: '+docName(d.tipo)+' de '+ownerName(d.owner),0,false)}
  runAI();render()},
 enviar(id){const j=S.trabajos.find(x=>x.id===id);enviar(j,'Gestión');save();toast('✔ '+(cli(j.clienteId).plataforma==='Email'?'Enviado a '+cli(j.clienteId).email:'Marcado como subido'));render()},
 estado(id,st){const j=S.trabajos.find(x=>x.id===id);j.estado=st;j.hist.push(h('Gestión',st==='concedido'?'El cliente ha concedido el acceso':'El cliente ha denegado el acceso'));if(st==='concedido'&&j.emp)avisoAcceso(j);else j.trabajadores.forEach(t=>notify(t,(st==='concedido'?'✅ Acceso concedido: ':'❌ Acceso denegado: ')+cli(j.clienteId).nombre,j.codigo+' · '+j.sitio+' · '+fds(j.desde)+(st==='concedido'?'\nLleva tu DNI.':''),j.id));log(j.codigo+': '+(st==='concedido'?'acceso concedido':'denegado'),0,false,j.id);save();render()},
 recordar(id){const j=S.trabajos.find(x=>x.id===id);const k=check(j);const ts=[...new Set(k.bloq.map(i=>i.owner).filter(o=>o.startsWith('t')))];ts.forEach(t=>notify(t,'🔔 Recordatorio: '+cli(j.clienteId).nombre,'Aún te falta:\n'+k.bloq.filter(i=>i.owner===t).map(i=>'• '+docName(i.k)).join('\n'),j.id));log('Recordatorio a '+ts.length+' técnico(s) para '+j.codigo,2,true,j.id);save();toast('🔔 Recordatorio enviado a '+ts.length+' técnico(s)',true)},
 sustituir(id,from,to){const j=S.trabajos.find(x=>x.id===id);j.trabajadores=j.trabajadores.map(t=>t===from?to:t);j.hist.push(h('Gestión','Cambio de técnico: '+tra(from).nombre+' → '+tra(to).nombre+' (propuesto por la IA)'));notify(to,'Nuevo trabajo: '+cli(j.clienteId).nombre,j.codigo+' · '+j.sitio+' · '+fds(j.desde),j.id);log('Cambio de técnico en '+j.codigo+' sugerido por la IA',5,true,j.id);runAI();render()},
 paquete(id){const j=S.trabajos.find(x=>x.id===id);const k=check(j);const c=cli(j.clienteId);
  modal(`<h2>📦 Paquete para ${esc(c.nombre)}</h2><p class="mut">${k.total} documentos · ${c.plataforma}</p><div class="card" style="max-height:200px;overflow:auto">${k.items.map(i=>`<div class="mut">📄 ${esc(i.d?.archivo||'')} <span style="color:#0f172a">— ${esc(docName(i.k))} · ${esc(ownerName(i.owner))}</span></div>`).join('')}</div><label>Email preparado por la IA</label><textarea id="em" style="min-height:220px">${esc(emailCliente(j))}</textarea><div class="row" style="margin-top:10px"><button class="btn" onclick="navigator.clipboard.writeText($('#em').value);toast('Copiado')">Copiar email</button><button class="btn sec" onclick="A.descargarIndice('${j.id}')">⬇ Índice (Excel)</button><button class="btn ghost" onclick="closeModal()">Cerrar</button></div>`)},
 descargarIndice(id){const j=S.trabajos.find(x=>x.id===id);const k=check(j);const rows=[['Titular','Documento','Archivo','Caduca','Estado']].concat(k.items.map(i=>[ownerName(i.owner),docName(i.k),i.d?.archivo||'',i.d?.caduca||'',i.txt]));
  const b=new Blob(['\ufeff'+rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(';')).join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=j.codigo+'-documentacion.csv';a.click()},
 crear(f,tipo){const t=[...f.querySelectorAll('[name=t]:checked')].map(x=>x.value),v=[...f.querySelectorAll('[name=v]:checked')].map(x=>x.value);if(!t.length)return alert('Elige al menos un técnico');
  const c=cli(f.cli.value);const n=S.trabajos.length+1;const j={id:'j'+Date.now(),codigo:'TR-'+(2400+n),clienteId:c.id,sitio:f.sitio.value,desde:f.desde.value,hasta:f.hasta.value<f.desde.value?f.desde.value:f.hasta.value,tipo,trabajadores:t,vehiculos:v,descripcion:f.desc.value,estado:'preparando',creado:new Date().toISOString(),hist:[h('Gestión',tipo==='emergencia'?'🚨 Emergencia creada':'Trabajo creado')]};
  S.trabajos.push(j);if(tipo==='emergencia'){j.trabajadores.forEach(x=>notify(x,'🚨 EMERGENCIA: '+c.nombre,j.sitio+'\n'+j.descripcion+'\nSal en cuanto puedas.',j.id))}save();
  modal(`<div style="text-align:center;padding:20px"><div class="spin" style="width:36px;height:36px;border-width:4px"></div><h2 style="margin-top:14px">🤖 Cruzando requisitos de ${esc(c.nombre)}…</h2><p class="mut">${check(j).total} documentos de la empresa, ${t.length} técnico(s)${v.length?' y '+v.length+' vehículo(s)':''}</p></div>`);
  setTimeout(()=>{if(tipo==='emergencia'&&check(j).bloq.length===0&&check(j).pend.length===0){runAI(true);if(j.estado==='listo')enviar(j,'IA');save()}else runAI(true);closeModal();toast(j.estado==='enviado'?'✔ Documentación enviada a '+esc(c.nombre):j.estado==='listo'?'🤖 Paquete listo para enviar':j.estado==='faltan'?'🤖 Faltan documentos: técnicos avisados':'🤖 Revisa los documentos dudosos',true);go('#/j/'+j.id)},1500)},
 req(cid,g,k,on){const c=cli(cid);const key={e:'reqE',t:'reqT',v:'reqV'}[g];c[key]=on?[...new Set([...c[key],k])]:c[key].filter(x=>x!==k);recheck();save()},
 cset(cid,k,v){const c=cli(cid);c[k]=v;if(k==='curso')addClientCourse(c);recheck();save();if(k==='curso'||k==='tipo')render()},
 nuevoCliente(){const n=prompt('Nombre del cliente');if(!n)return;const c={id:'c'+Date.now(),nombre:n,tipo:'industria',plataforma:'Email',antel:48,contacto:'Responsable de accesos',email:'',curso:false,reqE:['rc','ss','aeat'],reqT:['dni','form','epi'],reqV:[],notas:''};S.clientes.push(c);save();go('#/c/'+c.id)},
 leerReq(cid,text){text=text??$('#rq').value;if(!text.trim())return alert('Pega primero el texto del cliente');const c=cli(cid);const f=detectReqs(text);
  c.reqE=f.e;c.reqT=f.t;c.reqV=f.v;if(f.curso){c.curso=true;addClientCourse(c)}if(f.antel!=null)c.antel=f.antel;if(f.plataforma)c.plataforma=f.plataforma;recheck();
  log('Requisitos de '+c.nombre+' leídos por la IA: '+(f.e.length+f.t.length+f.v.length)+' documentos',15);save();render();
  setTimeout(()=>{const r=$('#rqres');if(r)r.innerHTML=`<p><b>🤖 Detectados ${f.e.length+f.t.length+f.v.length} documentos</b>${f.antel!=null?' · antelación '+f.antel+' h':''}${f.plataforma?' · '+f.plataforma:''}. Revisa las casillas de abajo.</p>`},50)},
 async leerReqPdf(cid,file){if(!file)return;toast('🤖 Leyendo PDF…',true);let t='';try{t=await pdfText(file)}catch(e){}if(t.trim().length<20)return alert('No se ha podido leer texto de ese PDF (¿es un escaneo?). Pega el texto a mano.');A.leerReq(cid,t)},
 ask(q){if(!q||!q.trim())return;CHAT.push({t:q});CHAT.push({b:1,t:answer(q).t});render()},
 addTrab(){modal(`<h2>Añadir técnico</h2><form onsubmit="event.preventDefault();A.saveTrab(this)"><label>Nombre y apellidos</label><input name="n" required><label>DNI / NIE</label><input name="d" required pattern="[0-9XYZxyz][0-9]{7}[A-Za-z]" placeholder="12345678Z"><label>Puesto</label><input name="p" value="Técnico de telecomunicaciones"><div class="row" style="margin-top:12px"><button class="btn">Guardar</button><button type="button" class="btn ghost" onclick="closeModal()">Cancelar</button></div></form>`)},
 saveTrab(f){const t={id:'t'+Date.now(),nombre:f.n.value.trim(),dni:f.d.value.trim().toUpperCase(),puesto:f.p.value.trim(),tel:''};S.trabajadores.push(t);save();closeModal();toast('Técnico añadido');go('#/o/'+t.id)},
 upload(o,k){const def=ALLDOC[k];
  modal(`<h2>Subir: ${esc(def.n)}</h2><p class="mut">${ownerIcon(o)} ${esc(ownerName(o))}</p><label>Archivo (PDF o foto)</label><input type="file" id="uf" accept=".pdf,image/*">
  <button class="btn ai block" style="margin-top:12px" onclick="A.doUpload('${o}','${k}')">🤖 Subir y que la IA lo revise</button>
  <div class="card" style="margin-top:14px;background:#faf7ff"><b>¿No tienes un PDF a mano?</b><p class="mut" style="margin:4px 0 8px">Prueba la IA con documentos de ejemplo:</p><div class="row"><button class="btn sm ok" onclick="A.doUpload('${o}','${k}','ok')">Documento correcto</button><button class="btn sm sec" onclick="A.doUpload('${o}','${k}','caducado')">Caducado</button><button class="btn sm sec" onclick="A.doUpload('${o}','${k}','otro')">De otra persona</button><button class="btn sm sec" onclick="A.doUpload('${o}','${k}','foto')">Foto borrosa</button></div></div><div id="ures"></div>`)},
 async doUpload(o,k,sample){let text='',name;
  if(sample){text=sample==='foto'?'':sampleText(o,k,sample);name=k+'_'+o+(sample==='foto'?'.jpg':'.pdf')}
  else{const f=$('#uf').files[0];if(!f)return alert('Elige un archivo');name=f.name;if(/pdf$/i.test(f.name)||f.type==='application/pdf'){$('#ures').innerHTML='<p><span class="spin"></span> Leyendo…</p>';try{text=await pdfText(f)}catch(e){text=''}}}
  $('#ures').innerHTML='<div class="aibox" style="margin-top:12px"><span class="spin"></span> La IA está leyendo el documento…</div>';await new Promise(r=>setTimeout(r,1100));
  const a=analyze(text,o,k);const d={id:uid('d'),owner:o,tipo:k,archivo:name,caduca:a.caduca||null,estado:a.estado,por:a.estado==='pendiente'?null:'ia',conf:a.conf,motivo:a.motivo||null,nota:a.nota||null,subido:new Date().toISOString()};S.docs.push(d);
  log('IA leyó '+docName(k)+' de '+ownerName(o)+' → '+(a.estado==='valido'?'validado':a.estado==='rechazado'?'rechazado ('+a.motivo+')':'dudoso, para revisar'),a.estado==='pendiente'?1:5);
  const before=new Set(S.trabajos.filter(j=>['listo','enviado'].includes(j.estado)).map(j=>j.id));runAI(true);const nuevos=S.trabajos.filter(j=>['listo','enviado'].includes(j.estado)&&!before.has(j.id));
  $('#ures').innerHTML=`<div class="aibox" style="margin-top:12px"><h3>🤖 Resultado</h3>${a.steps.map(([i,t])=>`<div class="aistep"><i>${i}</i><span>${esc(t)}</span></div>`).join('')}<div style="margin-top:8px">${a.estado==='valido'?'<span class="pill ok">VALIDADO</span>':a.estado==='rechazado'?'<span class="pill bad">RECHAZADO</span>':'<span class="pill ai">LO REVISA PRL</span>'}</div>${nuevos.length?`<p><b>🎉 Ya está completa la documentación de ${nuevos.map(j=>j.codigo+' ('+esc(cli(j.clienteId).nombre)+')').join(', ')}${nuevos.some(j=>j.estado==='enviado')?' y se ha enviado al cliente':''}.</b></p>`:''}</div><button class="btn block" style="margin-top:10px" onclick="closeModal();render()">Hecho</button>`},
};
function recheck(){S.trabajos.forEach(j=>{if(['listo','faltan','revisar'].includes(j.estado)){j.estado='preparando';j.reqKey=null}});runAI(true)}

/* ---------- flujo real: email del jefe de proyecto → emplazamiento → CAE e-gestiona → respuesta cliente → paquete ---------- */
const RIESGOS=[
 {k:'altura',n:'Trabajos en altura',re:/altura|torre|azotea|m[aá]stil|cubierta/i,docs:['altura','rescate']},
 {k:'elec',n:'Riesgo eléctrico',re:/el[eé]ctric|tensi[oó]n|cuadro|energ[ií]a|rectificador/i,docs:['rd614']},
 {k:'rf',n:'Radiofrecuencia',re:/radiofrecuencia|\bRF\b|emisi[oó]n|campos electromagn/i,docs:['rf']},
 {k:'conf',n:'Espacios confinados',re:/confinad|arqueta|galer[ií]a/i,docs:['conf']},
 {k:'pemp',n:'Plataforma elevadora',re:/plataforma elevadora|PEMP|cesta|gr[uú]a/i,docs:['pemp']},
];
const FEST={correo:'Leer email',emplaz:'Consultar emplazamiento',cae:'Crear CAE en e-gestiona',esperando:'Esperando al cliente'};
Object.entries(FEST).forEach(([k,t])=>EST[k]=[t,k==='esperando'?'info':'warn']);
const PASOS=[['correo','📧','Email del jefe de proyecto'],['emplaz','📍','Emplazamiento (plataforma Telefónica)'],['cae','📝','Solicitud CAE en e-gestiona'],['esperando','📨','Respuesta del cliente'],['docs','📦','Documentación a enviar'],['fin','✅','Acceso']];
function pasoIdx(j){const s=j.estado;if(s==='correo')return 0;if(s==='emplaz')return 1;if(s==='cae')return 2;if(s==='esperando')return 3;if(['preparando','faltan','revisar','listo'].includes(s))return 4;if(s==='enviado')return 5;return 6}
function seedEmplaz(){return[
 {cod:'MAD0231',nombre:'Alcobendas Norte',tipo:'Azotea de edificio de oficinas',dir:'Av. de Bruselas 20, 28108 Alcobendas (Madrid)',lat:40.5372,lon:-3.6358,prop:'Comunidad de propietarios Edificio Bruselas',acceso:'Llave en conserjería. Avisar al presidente de la comunidad con 48 h. Acceso a cubierta por escalera de gato con línea de vida.',horario:'L-V 8:00-18:00',cae:true,riesgos:['altura','rf']},
 {cod:'MAD1042',nombre:'San Sebastián de los Reyes Polígono',tipo:'Torre de celosía 30 m',dir:'C/ Sierra de Guadarrama 14, 28703 San Sebastián de los Reyes',lat:40.5531,lon:-3.6105,prop:'Torre compartida (gestor de infraestructuras)',acceso:'Candado con código: pedirlo al centro de control antes de llegar. Vallado perimetral.',horario:'24 h',cae:false,riesgos:['altura','rf','elec']},
 {cod:'MAD0877',nombre:'Hospital Universitario Norte',tipo:'Cobertura interior (DAS) en sótano -1',dir:'Paseo de la Salud 1, 28034 Madrid',lat:40.4805,lon:-3.6890,prop:'Hospital Universitario Norte',acceso:'Presentarse en seguridad (puerta 3) con DNI. Acompañados por mantenimiento del hospital.',horario:'Noches 22:00-6:00',cae:true,riesgos:['elec']},
 {cod:'MAD2210',nombre:'Centro Comercial La Moraleja',tipo:'Azotea de centro comercial',dir:'Av. de Europa 13, 28108 Alcobendas',lat:40.5293,lon:-3.6467,prop:'Gerencia del centro comercial',acceso:'Muelle de carga, control de seguridad. Permiso de trabajo del centro.',horario:'L-S 7:00-10:00',cae:true,riesgos:['altura','rf']},
 {cod:'TOL0315',nombre:'Polán Rural',tipo:'Torre tubular en finca',dir:'Camino del Cerro s/n, 45161 Polán (Toledo)',lat:39.7915,lon:-4.1720,prop:'Finca privada (arrendamiento)',acceso:'Camino de tierra 2 km, recomendable 4x4. Llave en caja de seguridad.',horario:'Libre',cae:false,riesgos:['altura','elec']},
]}
const emp=cod=>S.emplazamientos.find(e=>e.cod===String(cod||'').toUpperCase().replace(/[\s-]/g,''));
const dmy=d=>d.split('-').reverse().join('/');
function seedCorreos(){const a=addDays(6),b=addDays(7),c=addDays(3);return[
 {id:'m1',de:'Raúl Fernández · Jefe de proyecto',fecha:new Date(Date.now()-40*60e3).toISOString(),asunto:'Acceso MAD0231 - cambio de antenas y radioenlace',texto:`Hola,\n\nNecesito acceso al emplazamiento MAD0231 para el cambio de antenas (swap) y la revisión del radioenlace.\n\nFechas: del ${dmy(a)} al ${dmy(b)}, de 8:00 a 18:00.\nTrabajadores: Javier Morales y Sergio Blanco.\nVehículo: furgoneta F-03.\nRiesgos: trabajos en altura en la azotea y exposición a radiofrecuencia (se pedirá corte de emisión).\n\nGracias,\nRaúl Fernández\nJefe de proyecto · Tecnove Telecom`},
 {id:'m2',de:'Marta Gil · Jefa de proyecto',fecha:new Date(Date.now()-15*60e3).toISOString(),asunto:'Acceso MAD1042 - revisión de energía',texto:`Buenos días,\n\nPor favor gestiona el acceso al emplazamiento MAD1042 el ${dmy(c)} de 9:00 a 14:00.\nTrabajo: revisión del rectificador y del cuadro eléctrico de la torre.\nVan Alberto Ramos y Laura Castillo.\nRiesgo eléctrico y trabajos en altura.\n\nUn saludo,\nMarta Gil`},
]}
function parseCorreo(text){
 const out={};const n=norm(text);
 const m=text.match(/\b([A-Z]{3}\s?-?\d{4})\b/)||text.match(/emplazamiento[:\s]+([A-Z0-9-]{4,12})/i);out.cod=m?m[1].toUpperCase().replace(/[\s-]/g,''):'';
 let ds=findDates(text).map(x=>x.d);if(!ds.length){let r=/(\d{1,2})\/(\d{1,2})(?!\/\d)/g,x;while(x=r.exec(text))ds.push(`${TODAY.slice(0,4)}-${x[2].padStart(2,'0')}-${x[1].padStart(2,'0')}`)}
 ds.sort();out.desde=ds[0]||addDays(5);out.hasta=ds[ds.length-1]||out.desde;
 const hm=text.match(/(\d{1,2}[:.]\d{2})\s*(?:a|-|hasta)\s*(\d{1,2}[:.]\d{2})/i);out.horario=hm?hm[1]+' – '+hm[2]:'';
 out.trabajadores=S.trabajadores.filter(t=>{const p=norm(t.nombre).split(' ');return n.includes(t.dni.toLowerCase())||(new RegExp('\\b'+p[0]+'\\b').test(n)&&p.slice(1).some(w=>w.length>3&&new RegExp('\\b'+w+'\\b').test(n)))}).map(t=>t.id);
 out.vehiculos=S.vehiculos.filter(v=>{const c=(v.nombre.match(/[A-Z]{1,2}-\d{2}/)||[])[0];return(c&&new RegExp(c.replace('-','[- ]?'),'i').test(text))||text.includes(v.mat)}).map(v=>v.id);
 out.riesgos=RIESGOS.filter(r=>r.re.test(text)).map(r=>r.k);
 const s=text.match(/asunto:[^\n]*?-\s*([^\n]+)/i)||text.match(/trabajos?(?: a realizar)?:\s*([^\n]+)/i)||text.match(/para (?:el |la |los |las )?([^.\n]{8,90})/i);out.desc=s?s[1].trim().replace(/\.$/,''):'';
 const f=text.match(/(?:saludos|gracias|un saludo|atentamente)[,.!]*\s*\n+\s*([^\n]+)/i);out.de=f?f[1].trim():'';
 return out}
function parseFicha(text,cod){const g=re=>{const m=text.match(re);return m?m[1].trim():''};const c=text.match(/(-?\d{1,2}[.,]\d{3,})\s*[,; ]\s*(-?\d{1,3}[.,]\d{3,})/);
 return{cod,nombre:g(/nombre[:\s]+([^\n]+)/i)||cod,tipo:g(/tipo[:\s]+([^\n]+)/i),dir:g(/direcci[oó]n[:\s]+([^\n]+)/i),lat:c?+c[1].replace(',','.'):null,lon:c?+c[2].replace(',','.'):null,prop:g(/(?:propietario|propiedad|titular)[:\s]+([^\n]+)/i),acceso:g(/(?:acceso|condiciones)[^:\n]*[:\s]+([^\n]+)/i)||text.slice(0,200),horario:g(/horario[:\s]+([^\n]+)/i),cae:/CAE|e-?gestiona|documentaci[oó]n/i.test(text)&&!/sin CAE|no (requiere|necesita|pide) (CAE|documentaci)/i.test(text),riesgos:RIESGOS.filter(r=>r.re.test(text)).map(r=>r.k),manual:true}}
function fichaEmp(e){if(!e)return'';const maps=e.lat!=null?`https://www.google.com/maps?q=${e.lat},${e.lon}`:'https://www.google.com/maps/search/'+encodeURIComponent(e.dir);
 return`<div class="card"><div class="row"><h3 class="sp" style="margin:0">📍 ${esc(e.cod)} · ${esc(e.nombre)}</h3><span class="pill ${e.cae?'warn':'ok'}">${e.cae?'Pide CAE':'Sin CAE'}</span></div>
 <p style="margin:8px 0 4px">${esc(e.dir)}</p>${e.lat!=null?`<p class="mut" style="margin:0">Coordenadas: ${e.lat}, ${e.lon}</p>`:''}<a class="btn sm sec" style="margin:8px 0" href="${maps}" target="_blank" rel="noopener">🗺️ Abrir en el mapa</a>
 <div class="grid g2"><div><span class="mut">Tipo</span><br>${esc(e.tipo||'—')}</div><div><span class="mut">Propiedad</span><br>${esc(e.prop||'—')}</div><div><span class="mut">Horario de acceso</span><br>${esc(e.horario||'—')}</div><div><span class="mut">Riesgos del sitio</span><br>${(e.riesgos||[]).map(k=>RIESGOS.find(r=>r.k===k).n).join(', ')||'—'}</div></div>
 <p style="margin:10px 0 0"><span class="mut">Condiciones de acceso:</span> ${esc(e.acceso||'—')}</p>${e.manual?'<p class="mut" style="font-size:12px">🤖 Leído del texto pegado de la plataforma.</p>':'<p class="mut" style="font-size:12px">Datos de ejemplo (en la real: los de la plataforma de Telefónica).</p>'}</div>`}
function riesgosJ(j){return[...new Set([...(j.flujo.riesgos||[]),...(j.emp?.riesgos||[])])]}
function docsProbables(j){return[...new Set(['dni','form','apt','epi',...riesgosJ(j).flatMap(k=>RIESGOS.find(r=>r.k===k).docs)])]}
function preCheck(j){const ks=docsProbables(j);return j.trabajadores.map(t=>({t,bad:ks.map(k=>({k,...docSt(t,k,j.hasta)})).filter(i=>!OKST.includes(i.st))})).filter(x=>x.bad.length)}
function caeCampos(j){const e=j.emp||{};return[
 ['Empresa contratista',S.empresa.nombre+' · CIF '+S.empresa.cif],['Código de emplazamiento',e.cod||j.flujo.cod],['Dirección',e.dir||''],['Fechas',fd(j.desde)+(j.hasta!==j.desde?' → '+fd(j.hasta):'')+(j.flujo.horario?' · '+j.flujo.horario:'')],
 ['Trabajos a realizar',j.descripcion],['Riesgos',riesgosJ(j).map(k=>RIESGOS.find(r=>r.k===k).n).join(', ')||'—'],
 ['Trabajadores',j.trabajadores.map(t=>tra(t).nombre+' (DNI '+tra(t).dni+')').join('; ')],['Vehículos',j.vehiculos.map(v=>veh(v).nombre+' '+veh(v).mat).join('; ')||'—'],
 ['Responsable / jefe de proyecto',j.flujo.de||'—']]}
function ejemploRespuesta(j){const ks=docsProbables(j);return`Buenos días,\n\nPara autorizar el acceso de Tecnove Telecom al emplazamiento ${j.emp?.cod||''} necesitamos la siguiente documentación:\n- Seguro de responsabilidad civil y último recibo\n- Certificado de estar al corriente con la Seguridad Social\n- Certificado de Hacienda\n- RNT / TC2 del último mes\n- Evaluación de riesgos del trabajo\nDe cada trabajador: DNI, formación PRL del puesto, certificado de aptitud médica y entrega de EPIs${ks.includes('altura')?', formación de trabajos en altura y rescate':''}${ks.includes('rd614')?', formación en riesgo eléctrico RD 614/2001':''}${ks.includes('rf')?', formación en radiofrecuencia':''}.${j.vehiculos.length?'\nDel vehículo: ITV y seguro.':''}\n\nEnviar con al menos 48 horas de antelación.\nUn saludo,\nCoordinación de accesos`}
function flujoBox(j){const pi=pasoIdx(j);const f=j.flujo;
 const steps=`<div class="steps">${PASOS.map(([k,i,t],x)=>`<div class="st ${x<pi?'done':x===pi?'now':''}"><span>${x<pi?'✔':i}</span>${t}</div>`).join('')}</div>`;
 let body='';const pc=['cae','esperando'].includes(j.estado)?preCheck(j):[];
 const pcHtml=pc.length?`<div class="aibox" style="margin-top:10px"><h3>🤖 Adelanto mientras contesta el cliente</h3><div>Por los riesgos (${riesgosJ(j).map(k=>RIESGOS.find(r=>r.k===k).n.toLowerCase()).join(', ')}) seguramente pedirán:<br>${pc.map(x=>`<b>${esc(tra(x.t).nombre)}</b>: le falta ${x.bad.map(b=>esc(docName(b.k))+' ('+b.txt.toLowerCase()+')').join(', ')}`).join('<br>')}</div>${f.preavisado?'<p class="mut">✔ Ya avisados</p>':`<button class="btn sm ai" style="margin-top:8px" onclick="A.preaviso('${j.id}')">Avisarles ya</button>`}</div>`:'';
 if(j.estado==='emplaz')body=`<p>🤖 No tengo el emplazamiento <b>${esc(f.cod||'(sin código)')}</b> en la lista. Búscalo en la plataforma de Telefónica y <b>pega aquí lo que aparece</b> (dirección, coordenadas, condiciones):</p><textarea id="fic" placeholder="Dirección: ...\nCoordenadas: 40.12345, -3.12345\nCondiciones de acceso: ...\nRequiere CAE: sí"></textarea><button class="btn ai" style="margin-top:8px" onclick="A.ficha('${j.id}')">🤖 Leer ficha</button>`;
 if(j.estado==='cae')body=`<p>🤖 El emplazamiento <b>pide documentación</b>. Te he preparado los datos para crear la solicitud CAE en <b>e-gestiona</b>: copia y pega.</p><div class="card" style="background:#fff;margin:8px 0">${caeCampos(j).map(([k,v],x)=>`<div class="row" style="border-bottom:1px solid var(--line);padding:6px 0"><span class="sp"><span class="mut">${k}</span><br><b id="cf${x}">${esc(v)}</b></span><button class="btn sm ghost" onclick="navigator.clipboard.writeText($('#cf${x}').innerText);toast('Copiado')">Copiar</button></div>`).join('')}</div><button class="btn sm sec" onclick="navigator.clipboard.writeText(caeCampos(S.trabajos.find(x=>x.id==='${j.id}')).map(r=>r.join(': ')).join('\\n'));toast('Copiado todo')">📋 Copiar todo</button>
  <label>Nº de solicitud que te da e-gestiona</label><div class="row"><input id="caenum" placeholder="Ej.: CAE-2026-01234" style="flex:1"><button class="btn ok" onclick="A.caeHecha('${j.id}')">✔ Solicitud creada</button></div>${pcHtml}`;
 if(j.estado==='esperando')body=`<p>📨 Solicitud CAE <b>${esc(f.caeNum||'')}</b> creada el ${fdt(f.caeFecha)}. Telefónica avisa al cliente y el cliente responde pidiendo los documentos de Tecnove.</p><p><b>Cuando llegue la respuesta, pégala aquí</b> (o sube el PDF) y la IA prepara todo:</p><textarea id="resp" style="min-height:140px" placeholder="Pega aquí el correo del cliente..."></textarea><div class="row" style="margin-top:8px"><button class="btn ai" onclick="A.respuesta('${j.id}')">🤖 Leer lo que piden</button><label class="btn sm ghost" style="cursor:pointer">📄 PDF<input type="file" accept="application/pdf" hidden onchange="A.respuestaPdf('${j.id}',this.files[0])"></label><button class="btn sm ghost" onclick="$('#resp').value=ejemploRespuesta(S.trabajos.find(x=>x.id==='${j.id}'))">Probar con un ejemplo</button></div>${pcHtml}`;
 if(f.respuesta&&pi>=4)body=`<p class="mut">📨 El cliente pidió ${(j.req.e.length+j.req.t.length+j.req.v.length)} tipos de documento (leídos por la IA de su correo). Abajo está todo cruzado.</p>`;
 if(j.estado==='concedido'&&!f.caeReq)body=`<p>✅ El emplazamiento <b>no pide CAE</b>: no hace falta e-gestiona. Ya he mandado a los técnicos la dirección, el mapa y las condiciones de acceso.</p>`;
 return`<div class="card">${steps}${body}</div>${fichaEmp(j.emp)}`}
function vEntrada(){const nuevos=S.correos.filter(m=>!m.hecho);const enCurso=S.trabajos.filter(j=>j.flujo&&['correo','emplaz','cae','esperando'].includes(j.estado));
 return`<h1>📥 Correos de los jefes de proyecto</h1><div class="aibox" style="padding:10px 14px">🤖 Le paso cada correo a la IA: saca el emplazamiento, los trabajadores, los riesgos y las fechas. Busca la ficha del sitio, te deja preparada la solicitud CAE y, cuando conteste el cliente, prepara la documentación.</div>
 <div class="card"><h2>Sin procesar (${nuevos.length})</h2>${nuevos.length?`<div class="list">${nuevos.map(m=>`<div class="it" style="display:block"><div class="row"><b class="sp">${esc(m.asunto)}</b><span class="mut">${fdt(m.fecha)}</span></div><div class="mut">${esc(m.de)}</div><details style="margin:6px 0"><summary class="mut">Ver correo</summary><pre style="white-space:pre-wrap;font:inherit;font-size:13px">${esc(m.texto)}</pre></details><button class="btn ai sm" onclick="A.procesar('${m.id}')">🤖 Que la IA lo procese</button></div>`).join('')}</div>`:'<div class="empty">Todo procesado ✅</div>'}</div>
 <div class="card"><h2>Pegar un correo nuevo</h2><textarea id="nuevoCorreo" style="min-height:120px" placeholder="Pega aquí el correo del jefe de proyecto (emplazamiento, trabajos, trabajadores, riesgos, fechas)"></textarea><button class="btn ai" style="margin-top:8px" onclick="A.procesar(null)">🤖 Procesar</button></div>
 <div class="card"><h2>En curso (${enCurso.length})</h2>${enCurso.length?`<div class="list">${enCurso.map(j=>jRow(j)).join('')}</div>`:'<div class="empty">Ninguno</div>'}</div>`}
const AF={
 procesar(id){let m=id?S.correos.find(x=>x.id===id):null;const text=m?('Asunto: '+m.asunto+'\n'+m.texto):$('#nuevoCorreo').value;if(!text.trim())return alert('Pega primero el correo');
  const p=parseCorreo(text);const e=emp(p.cod);const n=S.trabajos.length+1;
  const j={id:'j'+Date.now(),codigo:'TR-'+(2400+n),clienteId:'ct',sitio:(p.cod||'Emplazamiento')+(e?' · '+e.nombre:''),desde:p.desde,hasta:p.hasta<p.desde?p.desde:p.hasta,tipo:'programado',trabajadores:p.trabajadores,vehiculos:p.vehiculos,descripcion:p.desc||'Trabajo en emplazamiento',estado:'emplaz',creado:new Date().toISOString(),hist:[h('IA','Correo de '+(p.de||m?.de||'jefe de proyecto')+' leído: '+(p.cod||'sin código')+', '+p.trabajadores.length+' trabajador(es), '+p.riesgos.length+' riesgo(s)')],flujo:{correo:text,de:p.de||m?.de||'',cod:p.cod,riesgos:p.riesgos,horario:p.horario},emp:e?{...e}:null};
  if(m)m.hecho=true;S.trabajos.push(j);log(j.codigo+': correo leído ('+(p.cod||'?')+', '+p.trabajadores.map(t=>tra(t).nombre.split(' ')[0]).join(', ')+')',5,true,j.id);
  if(e){j.hist.push(h('IA','Ficha del emplazamiento '+e.cod+' consultada'));AF.trasFicha(j)}
  save();modal(`<div style="padding:6px"><h2>🤖 Esto es lo que he entendido</h2>${[['Emplazamiento',p.cod||'❓ no lo encuentro'],['Trabajo',j.descripcion],['Fechas',fd(j.desde)+(j.hasta!==j.desde?' → '+fd(j.hasta):'')+(p.horario?' · '+p.horario:'')],['Trabajadores',p.trabajadores.map(t=>tra(t).nombre).join(', ')||'❓ ninguno reconocido'],['Vehículos',p.vehiculos.map(v=>veh(v).nombre).join(', ')||'—'],['Riesgos',p.riesgos.map(k=>RIESGOS.find(r=>r.k===k).n).join(', ')||'—'],['Pide',p.de||'—']].map(([k,v])=>`<div style="padding:5px 0;border-bottom:1px solid var(--line)"><span class="mut">${k}</span><br><b>${esc(v)}</b></div>`).join('')}<p class="mut">${e?(e.cae?'📍 Sitio encontrado: pide CAE → te preparo e-gestiona.':'📍 Sitio encontrado: no pide CAE → técnicos avisados.'):'📍 No tengo la ficha de ese emplazamiento: pégala desde la plataforma.'}</p><button class="btn block" onclick="closeModal();go('#/j/${j.id}')">Continuar</button></div>`)},
 trasFicha(j){j.flujo.caeReq=!!j.emp.cae;
  if(j.emp.cae){j.estado='cae';j.hist.push(h('IA','El emplazamiento pide CAE: datos para e-gestiona preparados'));log(j.codigo+': datos para e-gestiona preparados',10,true,j.id)}
  else{j.estado='concedido';j.hist.push(h('IA','Sin CAE: técnicos avisados con dirección y condiciones'));avisoAcceso(j);log(j.codigo+': sin CAE, técnicos avisados con la ficha del sitio',5,true,j.id)}},
 ficha(id){const j=S.trabajos.find(x=>x.id===id);const t=$('#fic').value;if(t.trim().length<15)return alert('Pega la ficha del emplazamiento');j.emp=parseFicha(t,j.flujo.cod||'SITIO');S.emplazamientos.push({...j.emp});j.hist.push(h('IA','Ficha del emplazamiento leída del texto pegado'));AF.trasFicha(j);save();render()},
 caeHecha(id){const j=S.trabajos.find(x=>x.id===id);j.flujo.caeNum=$('#caenum').value.trim()||'(sin número)';j.flujo.caeFecha=new Date().toISOString();j.estado='esperando';j.hist.push(h('Gestión','Solicitud CAE creada en e-gestiona: '+j.flujo.caeNum));log(j.codigo+': CAE creada en e-gestiona',0,false,j.id);save();render()},
 preaviso(id){const j=S.trabajos.find(x=>x.id===id);preCheck(j).forEach(x=>notify(x.t,'Prepara documentación: '+j.sitio,'Hola '+tra(x.t).nombre.split(' ')[0]+',\n\nVas a '+j.sitio+' ('+fds(j.desde)+'). Es casi seguro que el cliente pida:\n'+x.bad.map(b=>'• '+docName(b.k)).join('\n')+'\n\nVe preparándolo y súbelo a la app.\n\nPRL Tecnove',j.id));j.flujo.preavisado=true;log(j.codigo+': técnicos avisados por adelantado',5,true,j.id);save();toast('🔔 Técnicos avisados',true);render()},
 respuesta(id,text){const j=S.trabajos.find(x=>x.id===id);text=text??$('#resp').value;if(!text.trim())return alert('Pega el correo del cliente');const f=detectReqs(text);if(!f.e.length&&!f.t.length&&!f.v.length)return alert('No he reconocido ningún documento en ese texto. Revísalo o pégalo completo.');
  j.req={e:f.e,t:f.t,v:j.vehiculos.length?f.v:[]};j.flujo.respuesta=text;j.estado='preparando';j.hist.push(h('IA','Respuesta del cliente leída: pide '+(f.e.length+f.t.length+f.v.length)+' tipos de documento'));log(j.codigo+': respuesta del cliente leída por la IA',15,true,j.id);runAI(true);save();
  toast(j.estado==='listo'?'🤖 Paquete listo para enviar':j.estado==='faltan'?'🤖 Faltan documentos: técnicos avisados':'🤖 Revisa los documentos dudosos',true);render()},
 async respuestaPdf(id,file){if(!file)return;let t='';try{t=await pdfText(file)}catch(e){}if(t.trim().length<20)return alert('No se ha podido leer ese PDF. Pega el texto.');AF.respuesta(id,t)},
};
Object.assign(A,AF);
function avisoAcceso(j){const e=j.emp;j.trabajadores.forEach(t=>notify(t,'✅ Acceso: '+j.sitio,j.codigo+' · '+fds(j.desde)+(j.flujo?.horario?' · '+j.flujo.horario:'')+'\n'+j.descripcion+(e?'\n\n📍 '+e.dir+(e.lat!=null?'\nMapa: https://www.google.com/maps?q='+e.lat+','+e.lon:'')+'\n🔑 '+e.acceso:'')+'\n\nLleva tu DNI.',j.id))}

$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
window.A=A;window.go=go;window.closeModal=closeModal;window.render=render;window.toast=toast;window.$=$;
S=load();runAI(true);render();
