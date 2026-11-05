'use strict';
/* AccesoPRL demo — todo en el navegador (localStorage). */
const KEY='accesoprl_demo_v1';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=d=>{const x=new Date(d);x.setMinutes(x.getMinutes()-x.getTimezoneOffset());return x.toISOString().slice(0,10)};
const TODAY=iso(new Date());
const addDays=(n,base)=>{const d=base?new Date(base+'T12:00'):new Date();d.setDate(d.getDate()+n);return iso(d)};
const addMonths=(base,n)=>{const d=new Date(base+'T12:00');d.setMonth(d.getMonth()+n);return iso(d)};
const fd=s=>s?new Date(s+'T12:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}):'—';
const fdt=s=>new Date(s).toLocaleString('es-ES',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
const hm=s=>new Date(s).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
const uid=p=>p+Math.random().toString(36).slice(2,8);
const COLORS=['#1b6ca8','#0f766e','#b45309','#7c3aed','#be123c','#4d7c0f'];

const DOC_EMP=[
 {k:'rc',n:'Seguro de Responsabilidad Civil + recibo',cad:true,kw:/responsabilidad civil|p[oó]liza/i,m:12},
 {k:'ss',n:'Certificado al corriente con la Seguridad Social',cad:true,kw:/seguridad social|tesorer[ií]a general/i,m:6},
 {k:'aeat',n:'Certificado al corriente con Hacienda',cad:true,kw:/agencia tributaria|hacienda|obligaciones tributarias/i,m:12},
 {k:'rnt',n:'RNT / TC2 (relación nominal de trabajadores)',cad:true,kw:/relaci[oó]n nominal|\bRNT\b|\bTC2\b/i,m:1},
 {k:'er',n:'Evaluación de riesgos de los trabajos',cad:false,kw:/evaluaci[oó]n de riesgos/i},
 {k:'mp',n:'Modalidad preventiva (concierto con SPA)',cad:true,kw:/servicio de prevenci[oó]n ajeno|modalidad preventiva|concierto/i,m:12},
];
const DOC_TRA=[
 {k:'dni',n:'DNI / NIE',cad:true,kw:/documento nacional de identidad|\bDNI\b|\bNIE\b/i,m:120},
 {k:'form',n:'Formación PRL del puesto (art. 19 LPRL)',cad:false,kw:/formaci[oó]n[\s\S]{0,60}(prevenci[oó]n|riesgos laborales)|art[ií]culo 19/i},
 {k:'apt',n:'Certificado de aptitud médica',cad:true,kw:/aptitud|\bapto\b|vigilancia de la salud|reconocimiento m[eé]dico/i,m:12},
 {k:'epi',n:'Registro de entrega de EPIs',cad:false,kw:/equipos de protecci[oó]n individual|\bEPIs?\b/i},
 {k:'info',n:'Acuse de información de riesgos del centro',cad:false,kw:/informaci[oó]n[\s\S]{0,40}riesgos|acuse/i},
];
const RIESGOS=[
 {k:'general',n:'Mantenimiento / servicios generales',alto:false,docs:[]},
 {k:'altura',n:'Trabajos en altura',alto:true,docs:[{k:'f_altura',n:'Formación trabajos en altura',kw:/altura/i}]},
 {k:'electrico',n:'Riesgo eléctrico',alto:true,docs:[{k:'rd614',n:'Cualificación riesgo eléctrico (RD 614/2001)',kw:/614\/2001|riesgo el[eé]ctrico/i}]},
 {k:'confinado',n:'Espacios confinados',alto:true,docs:[{k:'f_conf',n:'Formación espacios confinados',kw:/confinad/i}]},
 {k:'caliente',n:'Trabajos en caliente (soldadura, corte)',alto:true,docs:[{k:'f_cal',n:'Formación trabajos en caliente',kw:/soldadura|en caliente/i}]},
 {k:'maquinaria',n:'Carretillas / plataformas elevadoras',alto:false,docs:[{k:'carnet',n:'Formación operador carretilla / PEMP',kw:/carretilla|plataforma elevadora|PEMP/i}]},
 {k:'obra',n:'Obra de construcción',alto:false,docs:[{k:'tpc',n:'Tarjeta Profesional de la Construcción (TPC)',kw:/tarjeta profesional de la construcci[oó]n|\bTPC\b/i}],emp:[{k:'rea',n:'Inscripción en el REA',kw:/registro de empresas acreditadas|\bREA\b/i}]},
];
const ALLDOC={};[...DOC_EMP,...DOC_TRA].forEach(d=>ALLDOC[d.k]=d);RIESGOS.forEach(r=>{r.docs.forEach(d=>ALLDOC[d.k]=d);(r.emp||[]).forEach(d=>ALLDOC[d.k]=d)});
const docName=k=>ALLDOC[k]?.n||k;
const ESTADOS={pendiente:['Nueva','info'],analizando:['IA revisando','ai'],subsanar:['Falta documentación','warn'],revision:['Revisión técnica','ai'],aprobada:['Aprobada','ok'],rechazada:['Rechazada','bad'],finalizada:['Finalizada','gray']};

/* ---------- datos demo ---------- */
function seed(){
 const centros=[{id:'c1',nombre:'Planta Getafe · Logística',dir:'Av. de la Industria 12, Getafe'},{id:'c2',nombre:'Oficinas Madrid · Castellana',dir:'P.º de la Castellana 95, Madrid'},{id:'c3',nombre:'Almacén Alcorcón',dir:'C/ Hierro 4, Alcorcón'}];
 const empresas=[
  {id:'e1',nombre:'Montajes Eléctricos Sur SL',cif:'B86543210',contacto:'Luis Pardo',email:'prl@montajessur.es',tel:'611 222 333'},
  {id:'e2',nombre:'Climatización Rivas SL',cif:'B12345674',contacto:'Ana Gil',email:'admin@climarivas.es',tel:'622 333 444'},
  {id:'e3',nombre:'Limpiezas Brillo SA',cif:'A28123456',contacto:'Marta Ruiz',email:'calidad@brillo.es',tel:'633 444 555'},
  {id:'e4',nombre:'Andamios Centro SL',cif:'B87654321',contacto:'Jorge León',email:'obras@andamioscentro.es',tel:'644 555 666'},
 ];
 const trabajadores=[
  {id:'t1',empresaId:'e1',nombre:'Carlos Méndez Ortiz',dni:'12345678Z',puesto:'Oficial electricista'},
  {id:'t2',empresaId:'e1',nombre:'Iván Torres Gómez',dni:'23456789D',puesto:'Ayudante electricista'},
  {id:'t3',empresaId:'e2',nombre:'Pedro Sanz Lara',dni:'34567890V',puesto:'Técnico frigorista'},
  {id:'t4',empresaId:'e2',nombre:'Rubén Díaz Mora',dni:'45678901G',puesto:'Ayudante'},
  {id:'t5',empresaId:'e3',nombre:'Lucía Fernández Ruiz',dni:'56789012B',puesto:'Limpiadora'},
  {id:'t6',empresaId:'e3',nombre:'Rosa Martín Vega',dni:'67890123N',puesto:'Limpiadora'},
  {id:'t7',empresaId:'e4',nombre:'Óscar Navarro Gil',dni:'78901234X',puesto:'Montador de andamios'},
  {id:'t8',empresaId:'e4',nombre:'Diego Romero Paz',dni:'89012345E',puesto:'Montador de andamios'},
 ];
 const docs=[];const add=(owner,k,cad,extra={})=>docs.push({id:uid('d'),owner,tipo:k,archivo:k+'_'+owner+'.pdf',caduca:ALLDOC[k].cad===false?null:cad,estado:'valido',por:'ia',conf:'alta',subido:addDays(-40)+'T09:00',...extra});
 empresas.forEach(e=>DOC_EMP.forEach(d=>add(e.id,d.k,addDays(120+Math.floor(Math.random()*200)))));
 trabajadores.forEach(t=>DOC_TRA.forEach(d=>add(t.id,d.k,addDays(150+Math.floor(Math.random()*300)))));
 ['t1','t2'].forEach(t=>add(t,'rd614',null));['t3','t4'].forEach(t=>add(t,'f_altura',null));['t7','t8'].forEach(t=>{add(t,'f_altura',null);add(t,'tpc',addDays(900))});add('e4','rea',addDays(500));
 // problemas realistas
 docs.find(d=>d.owner==='e3'&&d.tipo==='rc').caduca=addDays(9);
 const a4=docs.find(d=>d.owner==='t4'&&d.tipo==='apt');docs.splice(docs.indexOf(a4),1);
 docs.find(d=>d.owner==='t6'&&d.tipo==='form').estado='pendiente';docs.find(d=>d.owner==='t6'&&d.tipo==='form').por=null;docs.find(d=>d.owner==='t6'&&d.tipo==='form').nota='Foto escaneada: la IA no puede leerla con seguridad';
 const sol=(id,emp,centro,d1,d2,trab,riesgos,trabajo,estado,horas)=>({id,codigo:'ACC-'+(1000+parseInt(id.slice(1))),empresaId:emp,centroId:centro,desde:d1,hasta:d2,horario:'08:00 – 17:00',trabajo,riesgos,trabajadores:trab,estado,creada:new Date(Date.now()-horas*3600e3).toISOString(),hist:[]});
 const solicitudes=[
  sol('s1','e1','c1',TODAY,addDays(3),['t1','t2'],['electrico'],'Revisión y ampliación del cuadro eléctrico general de la nave 2','pendiente',20),
  sol('s2','e2','c2',addDays(1),addDays(2),['t3','t4'],['altura'],'Mantenimiento de máquinas de climatización en cubierta','pendiente',6),
  sol('s3','e3','c2',TODAY,addDays(60),['t5','t6'],['general'],'Servicio de limpieza de oficinas (contrato trimestral)','pendiente',30),
  sol('s4','e4','c1',addDays(2),addDays(9),['t7','t8'],['altura','obra'],'Montaje de andamio para reparación de fachada','pendiente',2),
  sol('s6','e1','c1',addDays(-1),addDays(1),['t1','t2'],['general'],'Mantenimiento preventivo de alumbrado exterior','pendiente',48),
  sol('s5','e1','c3',addDays(-20),addDays(-18),['t1'],['general'],'Sustitución de luminarias del almacén','pendiente',24*22),
 ];
 return {v:1,cfg:{autoValidar:true,autoAprobar:true,altoRiesgoManual:true,avisosCaducidad:true,diasAviso:30},centros,empresas,trabajadores,docs,solicitudes,mensajes:[],log:[],accesos:[],user:null};
}
let S=null;
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.v===1)return s}catch(e){}const s=seed();S=s;runAI(true);save(s);return s}
function save(s=S){localStorage.setItem(KEY,JSON.stringify(s))}
const emp=id=>S.empresas.find(e=>e.id===id);
const tra=id=>S.trabajadores.find(t=>t.id===id);
const cen=id=>S.centros.find(c=>c.id===id);
const ownerName=o=>o.startsWith('e')?emp(o)?.nombre:tra(o)?.nombre;
const ownerEmp=o=>o.startsWith('e')?o:tra(o)?.empresaId;
function log(texto,min=0,auto=true,ref=null){S.log.unshift({id:uid('l'),fecha:new Date().toISOString(),texto,auto,min,ref});S.log=S.log.slice(0,300)}
function notify(empresaId,asunto,texto,ref){S.mensajes.unshift({id:uid('m'),empresaId,fecha:new Date().toISOString(),asunto,texto,leido:false,ref})}
function toast(t,ai){const el=document.createElement('div');el.className='toast'+(ai?' ai':'');el.innerHTML=t;$('#toasts').appendChild(el);setTimeout(()=>el.remove(),4200)}

/* ---------- estado de documentos ---------- */
function lastDoc(owner,k){return S.docs.filter(d=>d.owner===owner&&d.tipo===k).sort((a,b)=>b.subido.localeCompare(a.subido))[0]}
function docSt(owner,k,hasta){
 const d=lastDoc(owner,k);
 if(!d)return{st:'falta',txt:'No aportado',c:'bad'};
 if(d.estado==='rechazado')return{st:'rechazado',txt:'Rechazado',c:'bad',d};
 if(d.estado==='pendiente')return{st:'pendiente',txt:'Pendiente de revisar',c:'ai',d};
 if(d.caduca&&d.caduca<TODAY)return{st:'caducado',txt:'Caducado el '+fd(d.caduca),c:'bad',d};
 if(d.caduca&&hasta&&d.caduca<hasta)return{st:'caduca_antes',txt:'Caduca antes de terminar ('+fd(d.caduca)+')',c:'bad',d};
 if(d.caduca&&d.caduca<addDays(S.cfg.diasAviso))return{st:'por_caducar',txt:'Válido · caduca '+fd(d.caduca),c:'warn',d};
 return{st:'valido',txt:d.caduca?'Válido hasta '+fd(d.caduca):'Válido',c:'ok',d};
}
const OKST=['valido','por_caducar'];
function reqs(s){
 const r=[];const rs=RIESGOS.filter(x=>s.riesgos.includes(x.k));
 DOC_EMP.forEach(d=>r.push({owner:s.empresaId,k:d.k}));rs.forEach(x=>(x.emp||[]).forEach(d=>r.push({owner:s.empresaId,k:d.k})));
 s.trabajadores.forEach(t=>{DOC_TRA.forEach(d=>r.push({owner:t,k:d.k}));rs.forEach(x=>x.docs.forEach(d=>r.push({owner:t,k:d.k})))});
 return r.map(x=>({...x,...docSt(x.owner,x.k,s.hasta)}));
}
function check(s){const items=reqs(s);return{items,bloq:items.filter(i=>['falta','rechazado','caducado','caduca_antes'].includes(i.st)),pend:items.filter(i=>i.st==='pendiente'),ok:items.filter(i=>OKST.includes(i.st)).length,total:items.length}}
const isAlto=s=>RIESGOS.some(r=>r.alto&&s.riesgos.includes(r.k));

/* ---------- MOTOR IA ---------- */
function runAI(silent){
 let acts=0;
 S.solicitudes.forEach(s=>{
  if(['aprobada','finalizada'].includes(s.estado)&&s.hasta<TODAY){if(s.estado!=='finalizada'){s.estado='finalizada';s.hist.push(h('IA','Trabajos terminados: solicitud cerrada automáticamente'))}return}
  if(!['pendiente','subsanar','revision','analizando'].includes(s.estado))return;
  if(s.hasta<TODAY){s.estado='finalizada';s.hist.push(h('IA','Fechas vencidas sin completar: cerrada'));return}
  const c=check(s);const e=emp(s.empresaId);
  if(c.bloq.length){
   const key=c.bloq.map(i=>i.owner+i.k+i.st).join('|');
   if(s.estado!=='subsanar'||s.reqKey!==key){
    s.estado='subsanar';s.reqKey=key;
    const lista=c.bloq.map(i=>'• '+docName(i.k)+' — '+ownerName(i.owner)+' ('+i.txt.toLowerCase()+')').join('\n');
    s.hist.push(h('IA','Revisados '+c.total+' documentos. Faltan o no son válidos '+c.bloq.length+'. Requerimiento enviado a la empresa.'));
    notify(e.id,'Falta documentación para '+s.codigo,'Hola '+e.contacto+',\n\nPara autorizar el acceso a '+cen(s.centroId).nombre+' ('+fd(s.desde)+' – '+fd(s.hasta)+') necesitamos:\n'+lista+'\n\nPuede subirlos desde la app. En cuanto estén, la solicitud se revisará automáticamente.\n\nUn saludo,\nDepartamento de PRL',s.id);
    log('Requerida documentación a '+e.nombre+' ('+s.codigo+'): '+c.bloq.length+' documento(s)',8,true,s.id);acts++;
   }
   return;
  }
  if(c.pend.length){if(s.estado!=='revision'||s.motivoRev!=='docs'){s.estado='revision';s.motivoRev='docs';s.hist.push(h('IA',c.pend.length+' documento(s) dudoso(s): necesita tu confirmación'));log(s.codigo+': la IA pide tu confirmación en '+c.pend.length+' documento(s) dudoso(s)',5,true,s.id);acts++}return}
  if(isAlto(s)&&S.cfg.altoRiesgoManual){if(s.estado!=='revision'||s.motivoRev!=='alto'){s.estado='revision';s.motivoRev='alto';s.hist.push(h('IA','Documentación completa y válida ('+c.total+'/'+c.total+'). Trabajo de alto riesgo: queda pendiente de tu visto bueno.'));log(s.codigo+' ('+e.nombre+'): documentación 100% correcta, falta tu OK por ser de alto riesgo',10,true,s.id);acts++}return}
  if(S.cfg.autoAprobar){approve(s,'IA');acts++}
  else if(s.estado!=='revision'){s.estado='revision';s.motivoRev='manual';s.hist.push(h('IA','Documentación completa. Aprobación automática desactivada.'))}
 });
 if(S.cfg.avisosCaducidad){
  S.docs.forEach(d=>{if(d.estado==='valido'&&d.caduca&&d.caduca>=TODAY&&d.caduca<addDays(S.cfg.diasAviso)&&!d.avisado&&lastDoc(d.owner,d.tipo)===d){
   d.avisado=true;const e=emp(ownerEmp(d.owner));
   notify(e.id,'Documento a punto de caducar','Hola '+e.contacto+',\n\nEl documento "'+docName(d.tipo)+'" de '+ownerName(d.owner)+' caduca el '+fd(d.caduca)+'. Súbalo renovado para no perder el acceso.\n\nDepartamento de PRL');
   log('Aviso de caducidad enviado a '+e.nombre+': '+docName(d.tipo)+' ('+fd(d.caduca)+')',4);acts++}});
 }
 save();if(acts&&!silent)toast('🤖 La IA ha hecho '+acts+' tarea(s) sola',true);return acts;
}
function h(quien,texto){return{fecha:new Date().toISOString(),quien,texto}}
function approve(s,quien){
 s.estado='aprobada';s.aprobada=new Date().toISOString();s.aprobadaPor=quien;const e=emp(s.empresaId);
 s.hist.push(h(quien,quien==='IA'?'Documentación completa y válida ('+check(s).total+' docs). Acceso aprobado y añadido a la lista de portería.':'Acceso aprobado por el técnico PRL.'));
 notify(e.id,'Acceso aprobado: '+s.codigo,'Hola '+e.contacto+',\n\nSu acceso a '+cen(s.centroId).nombre+' del '+fd(s.desde)+' al '+fd(s.hasta)+' está APROBADO.\nCódigo de acceso: '+s.codigo+' (QR disponible en la app). Enseñadlo en portería junto al DNI.\n\nDepartamento de PRL',s.id);
 log((quien==='IA'?'Aprobado automáticamente ':'Aprobado ')+s.codigo+' · '+e.nombre,quien==='IA'?15:0,quien==='IA',s.id);
}

/* ---------- lectura IA de documentos ---------- */
const MESES={enero:1,febrero:2,marzo:3,abril:4,mayo:5,junio:6,julio:7,agosto:8,septiembre:9,setiembre:9,octubre:10,noviembre:11,diciembre:12};
function findDates(t){const out=[];let m;const r1=/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/g;while(m=r1.exec(t))out.push({i:m.index,d:`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`});
 const r2=/(\d{1,2}) de (\w+) de (\d{4})/gi;while(m=r2.exec(t)){const mm=MESES[m[2].toLowerCase()];if(mm)out.push({i:m.index,d:`${m[3]}-${String(mm).padStart(2,'0')}-${m[1].padStart(2,'0')}`})}
 return out.filter(x=>!isNaN(new Date(x.d)))}
function analyze(text,owner,k){
 const steps=[];const def=ALLDOC[k];const t=text.replace(/\s+/g,' ');
 if(t.trim().length<30){return{estado:'pendiente',conf:'baja',steps:[['⚠️','No hay texto legible (documento escaneado o foto). En la demo se deja para tu revisión; la versión real lo lee con IA de visión.']],nota:'Escaneo/foto: requiere confirmación'}}
 steps.push(['📄','Leídas '+t.split(' ').length+' palabras del documento']);
 let tipoOk=def.kw.test(t);let otro=null;
 if(!tipoOk){for(const kk in ALLDOC){if(ALLDOC[kk].kw.test(t)){otro=kk;break}}}
 if(tipoOk)steps.push(['✅','Tipo de documento reconocido: '+def.n]);
 else return{estado:'rechazado',conf:'alta',steps:[...steps,['❌',otro?'Parece un "'+docName(otro)+'", no un "'+def.n+'"':'No se reconoce como "'+def.n+'"']],motivo:otro?'Documento equivocado: se ha subido "'+docName(otro)+'"':'No corresponde al documento pedido'};
 const isEmp=owner.startsWith('e');const ref=isEmp?emp(owner).cif:tra(owner).dni;
 const ids=(t.toUpperCase().match(isEmp?/\b[A-HJ-NP-SUVW]-?\d{7}[0-9A-J]\b/g:/\b(\d{8}-?[A-Z]|[XYZ]\d{7}[A-Z])\b/g)||[]).map(x=>x.replace('-',''));
 let conf='alta';
 if(ids.length){if(ids.includes(ref))steps.push(['✅',(isEmp?'CIF ':'DNI ')+ref+' coincide con '+ownerName(owner)]);
  else return{estado:'rechazado',conf:'alta',steps:[...steps,['❌','El documento es de '+ids[0]+', no de '+ownerName(owner)+' ('+ref+')']],motivo:'El documento pertenece a otra '+(isEmp?'empresa':'persona')+' ('+ids[0]+')'}}
 else{conf='media';steps.push(['➖','No aparece '+(isEmp?'CIF':'DNI')+' en el documento; se comprueba por nombre']);
  const ap=ownerName(owner).split(' ')[0];if(new RegExp(ap,'i').test(t))steps.push(['✅','El nombre "'+ap+'" aparece en el documento']);else{conf='baja';steps.push(['⚠️','No aparece el nombre del titular'])}}
 let caduca=null;
 if(def.cad){const ds=findDates(t);const kwr=/(v[aá]lid[oa]? hasta|vencimiento|caduca|caducidad|vigencia|validez hasta|fecha de fin)/ig;let best=null,m;
  while(m=kwr.exec(t)){const near=ds.filter(x=>x.i>m.index&&x.i-m.index<60)[0];if(near){best=near.d;break}}
  if(best){caduca=best;steps.push(['📅','Fecha de caducidad encontrada: '+fd(caduca)])}
  else if(ds.length){const em=ds.map(x=>x.d).sort().pop();caduca=addMonths(em,def.m||12);steps.push(['📅','Fecha de emisión '+fd(em)+' → validez habitual '+(def.m||12)+' mes(es): caduca '+fd(caduca)]);if(conf==='alta')conf='media'}
  else{steps.push(['⚠️','No se encuentra ninguna fecha']);return{estado:'pendiente',conf:'baja',steps,nota:'Sin fecha de caducidad legible'}}
  if(caduca<TODAY)return{estado:'rechazado',conf:'alta',steps:[...steps,['❌','El documento está caducado']],motivo:'Documento caducado el '+fd(caduca),caduca};
 }
 if(conf==='baja')return{estado:'pendiente',conf,steps:[...steps,['🟣','Hay dudas: te lo deja para confirmar']],nota:'Dudas en la lectura',caduca};
 if(!S.cfg.autoValidar)return{estado:'pendiente',conf,steps:[...steps,['🟣','Validación automática desactivada en Ajustes']],caduca};
 steps.push(['🤖','Validado automáticamente (confianza '+conf+')']);
 return{estado:'valido',conf,steps,caduca};
}
function sampleText(owner,k,kind){
 const def=ALLDOC[k];const isEmp=owner.startsWith('e');const o=isEmp?emp(owner):tra(owner);
 let id=isEmp?o.cif:o.dni,name=o.nombre;
 if(kind==='otro'){id=isEmp?'B99887766':'99887766K';name=isEmp?'Reformas Ejemplo SL':'Antonio Pérez López'}
 const venc=kind==='caducado'?addDays(-15):addDays(300);const dd=x=>x.split('-').reverse().join('/');
 const title={rc:'PÓLIZA DE SEGURO DE RESPONSABILIDAD CIVIL',ss:'CERTIFICADO DE ESTAR AL CORRIENTE - TESORERÍA GENERAL DE LA SEGURIDAD SOCIAL',aeat:'AGENCIA TRIBUTARIA - Certificado de estar al corriente de obligaciones tributarias',rnt:'RELACIÓN NOMINAL DE TRABAJADORES (RNT)',er:'EVALUACIÓN DE RIESGOS LABORALES',mp:'CONCIERTO CON SERVICIO DE PREVENCIÓN AJENO - modalidad preventiva',dni:'DOCUMENTO NACIONAL DE IDENTIDAD',form:'CERTIFICADO DE FORMACIÓN EN PREVENCIÓN DE RIESGOS LABORALES (artículo 19 LPRL)',apt:'VIGILANCIA DE LA SALUD - Certificado de aptitud: APTO',epi:'REGISTRO DE ENTREGA DE EQUIPOS DE PROTECCIÓN INDIVIDUAL (EPIs)',info:'ACUSE DE RECIBO - Información de riesgos del centro de trabajo',f_altura:'Certificado curso trabajos en altura',rd614:'Formación riesgo eléctrico RD 614/2001 - trabajador cualificado',f_conf:'Curso espacios confinados',f_cal:'Curso trabajos en caliente y soldadura',carnet:'Formación operador de carretilla elevadora y PEMP',tpc:'Tarjeta Profesional de la Construcción TPC',rea:'Registro de Empresas Acreditadas REA'}[k]||def.n;
 return `${title}\nTitular: ${name}  ${isEmp?'CIF':'DNI'}: ${id}\nFecha de emisión: ${dd(addDays(-30))}\n${def.cad?'Válido hasta: '+dd(venc):''}\nFirmado digitalmente.`;
}
async function pdfText(file){
 if(!window.pdfjsLib)return'';pdfjsLib.GlobalWorkerOptions.workerSrc='pdf.worker.min.js';
 const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;let t='';
 for(let i=1;i<=Math.min(pdf.numPages,5);i++){const p=await pdf.getPage(i);const c=await p.getTextContent();t+=c.items.map(x=>x.str).join(' ')+'\n'}return t;
}

/* ---------- router / layout ---------- */
const NAV={
 tecnico:[['#/panel','📊','Panel'],['#/solicitudes','📋','Solicitudes','att'],['#/ia','🤖','Asistente IA'],['#/empresas','🏢','Empresas'],['#/ajustes','⚙️','Ajustes']],
 contrata:[['#/c/inicio','🏠','Inicio'],['#/c/nueva','➕','Nueva solicitud'],['#/c/docs','📁','Documentos','faltan'],['#/c/mensajes','✉️','Mensajes','unread']],
 porteria:[['#/p/hoy','🚪','Hoy'],['#/p/buscar','🔎','Comprobar'],['#/p/registro','🕒','Registro']],
};
function counts(){const u=S.user||{};return{att:S.solicitudes.filter(s=>s.estado==='revision').length,unread:S.mensajes.filter(m=>m.empresaId===u.empresaId&&!m.leido).length,faltan:u.empresaId?misFaltan(u.empresaId).length:0}}
function misFaltan(eid){const set=new Map();S.solicitudes.filter(s=>s.empresaId===eid&&s.estado==='subsanar').forEach(s=>check(s).bloq.forEach(i=>set.set(i.owner+i.k,i)));return[...set.values()]}
function render(){
 const r=location.hash||'#/';
 if(!S.user){$('#app').innerHTML=loginView();return}
 const role=S.user.role;const nav=NAV[role];if(r==='#/'||!r.startsWith('#/'))return go(nav[0][0]);
 const cn=counts();
 const navHtml=cls=>`<nav class="${cls}">${nav.map(([h,i,t,c])=>`<a href="${h}" class="${r.startsWith(h)||(h==='#/solicitudes'&&r.startsWith('#/s/'))||(h==='#/empresas'&&r.startsWith('#/e/'))?'on':''}"><span class="ic">${i}</span>${t}${c&&cn[c]?`<span class="cnt">${cn[c]}</span>`:''}</a>`).join('')}</nav>`;
 const who=role==='tecnico'?'Técnico/a PRL · Cliente':role==='contrata'?esc(emp(S.user.empresaId).nombre):'Portería · '+esc(cen(S.user.centroId).nombre);
 let body='';try{body=view(r)}catch(e){console.error(e);body='<div class="card">Error: '+esc(e.message)+'</div>'}
 $('#app').innerHTML=`<header class="top"><div class="logo"><span class="sh">🛡️</span>AccesoPRL</div><div class="who">${who}</div><button class="out" onclick="A.logout()">Salir</button></header><div class="layout">${navHtml('side')}<main>${body}</main></div>${navHtml('bottom')}`;
 window.scrollTo(0,0);if(r.startsWith('#/ia'))setTimeout(()=>{const c=$('.chat');if(c)c.scrollTop=1e6},0);
}
function go(h){location.hash=h}
window.addEventListener('hashchange',render);
function view(r){
 const p=r.slice(2).split('/');
 switch(p[0]){
  case 'panel':return vPanel();case 'solicitudes':return vSolicitudes(p[1]);case 's':return vSol(p[1]);case 'empresas':return vEmpresas();case 'e':return vEmpresa(p[1]);case 'ajustes':return vAjustes();case 'ia':return vIA();case 'actividad':return vActividad();
  case 'c':return({inicio:vCInicio,nueva:vCNueva,docs:vCDocs,mensajes:vCMensajes,s:()=>vCSol(p[2])}[p[1]]||vCInicio)();
  case 'p':return({hoy:vPHoy,buscar:()=>vPBuscar(p[2]),registro:vPRegistro}[p[1]]||vPHoy)();
 }return'<div class="card">Página no encontrada</div>';
}
function loginView(){
 return `<div class="login"><div class="box"><div class="logo" style="color:var(--p);font-size:24px"><span class="sh" style="background:var(--p);color:#fff">🛡️</span>AccesoPRL</div>
 <p class="mut" style="margin:8px 0 4px">Gestión de accesos de contratistas (CAE) con IA. La IA revisa la documentación PRL, pide lo que falta, aprueba y prepara la lista de portería.</p>
 <p style="font-weight:700;margin:16px 0 0">Entrar como:</p>
 <button class="role" onclick="A.login('tecnico')"><span class="ri">👩‍💼</span><span><b>Técnico/a PRL del cliente</b><br><span class="mut">Revisa solo lo que la IA marca como dudoso</span></span></button>
 <button class="role" onclick="A.loginEmp()"><span class="ri">🦺</span><span><b>Empresa contratista</b><br><span class="mut">Pide accesos y sube documentos</span></span></button>
 <button class="role" onclick="A.login('porteria')"><span class="ri">🚪</span><span><b>Portería / vigilante</b><br><span class="mut">Lista de autorizados de hoy, entradas y salidas</span></span></button>
 <p class="mut" style="font-size:12px;margin-top:16px">Demo de prueba: los datos son ficticios y se guardan solo en este navegador.</p></div></div>`;
}

/* ---------- vistas técnico ---------- */
const pill=(st)=>{const [t,c]=ESTADOS[st]||[st,'gray'];return`<span class="pill ${c}">${t}</span>`};
const avatar=(name,i)=>`<div class="av" style="background:${COLORS[i%COLORS.length]}">${esc(name.split(' ').map(x=>x[0]).slice(0,2).join(''))}</div>`;
const eIdx=id=>S.empresas.findIndex(e=>e.id===id);
function solRow(s,base='#/s/'){const e=emp(s.empresaId);const c=check(s);
 const extra=s.estado==='subsanar'?`<span class="pill warn">${c.bloq.length} pendiente(s)</span>`:s.estado==='revision'?`<span class="pill ai">${s.motivoRev==='alto'?'Alto riesgo: tu OK':'Doc. dudoso'}</span>`:'';
 return`<a class="it" href="${base}${s.id}">${avatar(e.nombre,eIdx(e.id))}<div style="flex:1;min-width:0"><div class="t">${esc(e.nombre)} <span class="mut">· ${s.codigo}</span></div><div class="s">${esc(cen(s.centroId).nombre)} · ${fd(s.desde)} → ${fd(s.hasta)} · ${s.trabajadores.length} trab.</div><div class="row" style="margin-top:4px">${pill(s.estado)} ${extra}</div></div><span class="mut">›</span></a>`}
function todayLog(){return S.log.filter(l=>l.fecha.slice(0,10)===TODAY)}
function vPanel(){
 const att=S.solicitudes.filter(s=>s.estado==='revision');const esp=S.solicitudes.filter(s=>s.estado==='subsanar');
 const hoy=activasHoy();const enPlanta=S.accesos.filter(a=>!a.salida&&a.entrada.slice(0,10)===TODAY).length;
 const tl=S.log.filter(l=>l.auto);const min=tl.reduce((a,l)=>a+l.min,0);
 const cad=S.docs.filter(d=>d.estado==='valido'&&d.caduca&&d.caduca>=TODAY&&d.caduca<addDays(S.cfg.diasAviso)&&lastDoc(d.owner,d.tipo)===d);
 return`<h1>Hola 👋</h1>
 <div class="grid g4" style="margin-bottom:14px">
 <a class="kpi ai" href="#/actividad"><b>${tl.length}</b><span>tareas hechas por la IA · ~${Math.round(min/60*10)/10} h ahorradas</span></a>
 <a class="kpi" href="#/solicitudes/att"><b style="color:var(--ai)">${att.length}</b><span>necesitan tu decisión</span></a>
 <a class="kpi" href="#/solicitudes/esp"><b style="color:var(--warn)">${esp.length}</b><span>esperando documentos de la empresa</span></a>
 <a class="kpi" href="#/solicitudes/ok"><b style="color:var(--ok)">${hoy.length}</b><span>accesos autorizados hoy · ${enPlanta} dentro</span></a></div>
 <div class="grid g2"><div>
 <div class="card"><h2>🟣 Requiere tu atención</h2>${att.length?`<div class="list">${att.map(s=>solRow(s)).join('')}</div>`:`<div class="empty">Nada pendiente. La IA lo tiene todo al día ✅</div>`}</div>
 <div class="card"><h2>⏳ Esperando a la empresa</h2><p class="mut" style="margin-top:-4px">La IA ya les ha pedido lo que falta y revisará en cuanto lo suban.</p>${esp.length?`<div class="list">${esp.map(s=>solRow(s)).join('')}</div>`:'<div class="empty">Ninguna</div>'}</div>
 </div><div>
 <div class="card"><div class="row"><h2 class="sp">🤖 Lo que ha hecho la IA</h2><a href="#/actividad" class="mut">Ver todo</a></div><div class="log">${S.log.slice(0,7).map(logRow).join('')||'<div class="empty">Sin actividad</div>'}</div></div>
 <div class="card"><h2>📅 Caducan en ${S.cfg.diasAviso} días (${cad.length})</h2>${cad.length?cad.map(d=>`<div class="row" style="padding:6px 0;border-bottom:1px solid var(--line)"><span class="sp"><b>${esc(docName(d.tipo))}</b><br><span class="mut">${esc(ownerName(d.owner))}</span></span><span class="pill warn">${fd(d.caduca)}</span></div>`).join('')+'<p class="mut">La IA ya ha avisado a las empresas.</p>':'<div class="empty">Ninguno</div>'}</div>
 <button class="btn ai block" onclick="A.reanalizar()">🤖 Pedir a la IA que revise todo ahora</button>
 </div></div>`;
}
const logRow=l=>`<div class="e"><span class="when">${fdt(l.fecha)}</span><span>${l.auto?'🤖 ':'👤 '}${l.ref?`<a href="#/s/${l.ref}">${esc(l.texto)}</a>`:esc(l.texto)}</span></div>`;
function vActividad(){return`<h1>Actividad</h1><div class="card log">${S.log.map(logRow).join('')}</div>`}
function vSolicitudes(f='att'){
 const F={att:['Tu decisión',s=>s.estado==='revision'],esp:['Esperando empresa',s=>s.estado==='subsanar'],ok:['Aprobadas',s=>s.estado==='aprobada'],fin:['Cerradas',s=>['finalizada','rechazada'].includes(s.estado)],all:['Todas',()=>true]};
 const list=S.solicitudes.filter(F[f]?.[1]||(()=>true)).sort((a,b)=>b.creada.localeCompare(a.creada));
 return`<h1>Solicitudes de acceso</h1><div class="tabs">${Object.entries(F).map(([k,[t,fn]])=>`<button class="${k===f?'on':''}" onclick="go('#/solicitudes/${k}')">${t} (${S.solicitudes.filter(fn).length})</button>`).join('')}</div>
 <div class="card list">${list.map(s=>solRow(s)).join('')||'<div class="empty">No hay solicitudes aquí</div>'}</div>`;
}
function docTable(s,canAct){
 const c=check(s);const groups={};c.items.forEach(i=>(groups[i.owner]=groups[i.owner]||[]).push(i));
 return Object.entries(groups).map(([o,its])=>{const ok=its.every(i=>OKST.includes(i.st));
 return`<div class="card"><div class="row"><h3 class="sp">${o.startsWith('e')?'🏢':'👷'} ${esc(ownerName(o))}${o.startsWith('t')?` <span class="mut">· ${esc(tra(o).dni)} · ${esc(tra(o).puesto)}</span>`:''}</h3>${ok?'<span class="pill ok">Todo OK</span>':''}</div>
 <div class="tw"><table>${its.map(i=>`<tr><td>${esc(docName(i.k))}${i.d?.nota?`<div class="mut">🟣 ${esc(i.d.nota)}</div>`:''}${i.d?.motivo?`<div class="mut" style="color:var(--bad)">${esc(i.d.motivo)}</div>`:''}${i.d?.por==='ia'&&OKST.includes(i.st)?`<div class="mut">🤖 Validado por IA${i.d.conf?' · confianza '+i.d.conf:''}</div>`:''}${i.d?.por==='tecnico'?'<div class="mut">👤 Validado por técnico</div>':''}</td><td style="text-align:right"><span class="pill ${i.c}">${i.txt}</span>${canAct&&i.st==='pendiente'?`<div class="row" style="justify-content:flex-end;margin-top:6px"><button class="btn sm ok" onclick="A.valDoc('${i.d.id}',1)">Validar</button><button class="btn sm bad" onclick="A.valDoc('${i.d.id}',0)">Rechazar</button></div>`:''}${!canAct&&['falta','rechazado','caducado','caduca_antes'].includes(i.st)?`<div style="margin-top:6px"><button class="btn sm" onclick="A.upload('${o}','${i.k}')">Subir</button></div>`:''}</td></tr>`).join('')}</table></div></div>`}).join('');
}
function vSol(id){
 const s=S.solicitudes.find(x=>x.id===id);if(!s)return'<div class="card">No existe</div>';const e=emp(s.empresaId);const c=check(s);
 const rs=RIESGOS.filter(r=>s.riesgos.includes(r.k));
 let ai='';
 if(s.estado==='revision')ai=s.motivoRev==='alto'?`La documentación está <b>completa y válida (${c.ok}/${c.total})</b>. Como es un trabajo de <b>alto riesgo</b> (${rs.filter(r=>r.alto).map(r=>r.n.toLowerCase()).join(', ')}), te dejo la decisión final. Recomendación: <b>aprobar</b> y recordar el permiso de trabajo / recurso preventivo.`:`Hay <b>${c.pend.length} documento(s)</b> que no he podido leer con seguridad. Revísalos abajo; el resto (${c.ok}/${c.total}) está correcto.`;
 else if(s.estado==='subsanar')ai=`Faltan o no son válidos <b>${c.bloq.length}</b> de ${c.total} documentos. Ya he enviado el requerimiento a ${esc(e.contacto)} (${esc(e.email)}). Cuando los suban, los leo y apruebo si todo está bien.`;
 else if(s.estado==='aprobada')ai=`Aprobada${s.aprobadaPor==='IA'?' automáticamente':''}. Los ${s.trabajadores.length} trabajadores están en la lista de portería del ${fd(s.desde)} al ${fd(s.hasta)}.`;
 return`<a href="#/solicitudes" class="mut">‹ Solicitudes</a><div class="row" style="margin:6px 0 12px"><h1 class="sp" style="margin:0">${s.codigo}</h1>${pill(s.estado)}</div>
 ${ai?`<div class="aibox"><h3>🤖 Resumen de la IA</h3><div>${ai}</div></div>`:''}
 ${s.estado==='revision'?`<div class="row" style="margin-bottom:14px"><button class="btn ok" onclick="A.aprobar('${s.id}')" ${c.bloq.length||c.pend.length?'disabled':''}>✔ Aprobar acceso</button><button class="btn bad" onclick="A.rechazar('${s.id}')">✖ Denegar</button><button class="btn sec" onclick="A.pedir('${s.id}')">✉ Pedir algo a la empresa</button></div>`:''}
 ${s.estado==='subsanar'?`<div class="row" style="margin-bottom:14px"><button class="btn sec" onclick="A.pedir('${s.id}')">✉ Escribir a la empresa</button><button class="btn bad" onclick="A.rechazar('${s.id}')">✖ Denegar</button></div>`:''}
 <div class="card"><div class="grid g2"><div><span class="mut">Empresa</span><br><a href="#/e/${e.id}"><b>${esc(e.nombre)}</b></a><br><span class="mut">${esc(e.cif)} · ${esc(e.contacto)} · ${esc(e.tel)}</span></div><div><span class="mut">Centro y fechas</span><br><b>${esc(cen(s.centroId).nombre)}</b><br><span class="mut">${fd(s.desde)} → ${fd(s.hasta)} · ${esc(s.horario)}</span></div></div>
 <p style="margin:12px 0 6px"><span class="mut">Trabajo:</span> ${esc(s.trabajo)}</p><div class="row">${rs.map(r=>`<span class="pill ${r.alto?'bad':'gray'}">${r.alto?'⚠ ':''}${esc(r.n)}</span>`).join('')}</div>
 <div style="margin-top:12px"><div class="mut">Documentación ${c.ok}/${c.total}</div><div style="height:8px;background:#eef1f4;border-radius:9px;overflow:hidden;margin-top:4px"><div style="height:100%;width:${Math.round(c.ok/c.total*100)}%;background:${c.ok===c.total?'var(--ok)':'var(--p2)'}"></div></div></div></div>
 ${docTable(s,true)}
 <div class="card"><h3>Historial</h3><div class="log">${s.hist.slice().reverse().map(x=>`<div class="e"><span class="when">${fdt(x.fecha)}</span><span>${x.quien==='IA'?'🤖':'👤'} ${esc(x.texto)}</span></div>`).join('')}</div></div>`;
}
function empSemaforo(e){const owners=[e.id,...S.trabajadores.filter(t=>t.empresaId===e.id).map(t=>t.id)];let bad=0,warn=0,pend=0;
 owners.forEach(o=>(o.startsWith('e')?DOC_EMP:DOC_TRA).forEach(d=>{const st=docSt(o,d.k).st;if(['falta','rechazado','caducado'].includes(st))bad++;else if(st==='por_caducar')warn++;else if(st==='pendiente')pend++}));return{bad,warn,pend}}
function vEmpresas(){return`<h1>Empresas contratistas</h1><div class="card list">${S.empresas.map((e,i)=>{const s=empSemaforo(e);const n=S.trabajadores.filter(t=>t.empresaId===e.id).length;return`<a class="it" href="#/e/${e.id}">${avatar(e.nombre,i)}<div style="flex:1"><div class="t">${esc(e.nombre)}</div><div class="s">${esc(e.cif)} · ${n} trabajadores</div></div>${s.bad?`<span class="pill bad">${s.bad} mal</span>`:''}${s.warn?`<span class="pill warn">${s.warn} caduca</span>`:''}${s.pend?`<span class="pill ai">${s.pend} dudoso</span>`:''}${!s.bad&&!s.warn&&!s.pend?'<span class="pill ok">Al día</span>':''}</a>`}).join('')}</div>`}
function ownerDocsCard(o,canUpload,canAct){const list=o.startsWith('e')?DOC_EMP:DOC_TRA;const extra=[...new Set(S.docs.filter(d=>d.owner===o).map(d=>d.tipo))].filter(k=>!list.some(d=>d.k===k));
 return`<div class="card"><h3>${o.startsWith('e')?'🏢':'👷'} ${esc(ownerName(o))}${o.startsWith('t')?` <span class="mut">· ${esc(tra(o).dni)}</span>`:''}</h3><div class="tw"><table>${[...list.map(d=>d.k),...extra].map(k=>{const st=docSt(o,k);return`<tr><td>${esc(docName(k))}${st.d?.motivo?`<div class="mut" style="color:var(--bad)">${esc(st.d.motivo)}</div>`:''}${st.d?.nota&&st.st==='pendiente'?`<div class="mut">🟣 ${esc(st.d.nota)}</div>`:''}</td><td style="text-align:right"><span class="pill ${st.c}">${st.txt}</span>${canAct&&st.st==='pendiente'?`<div class="row" style="justify-content:flex-end;margin-top:6px"><button class="btn sm ok" onclick="A.valDoc('${st.d.id}',1)">Validar</button><button class="btn sm bad" onclick="A.valDoc('${st.d.id}',0)">Rechazar</button></div>`:''}${canUpload?`<div style="margin-top:6px"><button class="btn sm ${st.st==='valido'?'ghost':''}" onclick="A.upload('${o}','${k}')">${st.d?'Renovar':'Subir'}</button></div>`:''}</td></tr>`}).join('')}</table></div></div>`}
function vEmpresa(id){const e=emp(id);const ts=S.trabajadores.filter(t=>t.empresaId===id);const sols=S.solicitudes.filter(s=>s.empresaId===id);
 return`<a href="#/empresas" class="mut">‹ Empresas</a><h1>${esc(e.nombre)}</h1><div class="card"><span class="mut">${esc(e.cif)} · ${esc(e.contacto)} · ${esc(e.email)} · ${esc(e.tel)}</span></div>
 <div class="card list"><h3>Solicitudes</h3>${sols.map(s=>solRow(s)).join('')||'<div class="empty">Ninguna</div>'}</div>${ownerDocsCard(id,false,true)}${ts.map(t=>ownerDocsCard(t.id,false,true)).join('')}`}
function vAjustes(){const sw=(k,t,d)=>`<label class="switch"><input type="checkbox" ${S.cfg[k]?'checked':''} onchange="A.cfg('${k}',this.checked)"><span><b>${t}</b><br><span class="mut" style="font-weight:400">${d}</span></span></label>`;
 return`<h1>Ajustes de la IA</h1><div class="card">
 ${sw('autoValidar','La IA valida documentos sola','Si el documento es el correcto, es del titular y está en fecha, queda validado sin que lo mires.')}
 ${sw('autoAprobar','La IA aprueba accesos sola','Si la empresa y todos sus trabajadores tienen todo válido para las fechas pedidas.')}
 ${sw('altoRiesgoManual','Los trabajos de alto riesgo los apruebo yo','Altura, eléctrico, espacios confinados y en caliente: la IA lo deja listo, tú das el OK final.')}
 ${sw('avisosCaducidad','Avisos automáticos de caducidad','La IA escribe a la empresa antes de que caduque un documento.')}
 <label>Días de antelación del aviso</label><input type="number" min="5" max="90" value="${S.cfg.diasAviso}" onchange="A.cfg('diasAviso',+this.value)"></div>
 <div class="card"><h3>Centros de trabajo</h3>${S.centros.map(c=>`<div style="padding:6px 0"><b>${esc(c.nombre)}</b><br><span class="mut">${esc(c.dir)}</span></div>`).join('')}</div>
 <div class="card"><h3>Sobre la IA de esta demo</h3><p class="mut">En la demo, la IA funciona en tu navegador: lee el texto de los PDF, reconoce el tipo de documento, fechas y DNI/CIF, y aplica las reglas de CAE (RD 171/2004). En la versión real se conecta a un modelo de IA (por ejemplo Claude) que lee también fotos y escaneos, envía los correos de verdad y avisa por WhatsApp.</p>
 <button class="btn bad" onclick="A.reset()">Reiniciar datos de la demo</button></div>`}

/* ---------- asistente IA ---------- */
let CHAT=[{b:1,t:'Hola, soy tu asistente de PRL. Pregúntame lo que quieras sobre accesos, empresas o documentos. También puedo redactar avisos.'}];
function vIA(){return`<h1>🤖 Asistente IA</h1><div class="card" style="background:#faf7ff"><div class="chat">${CHAT.map(m=>`<div class="msg ${m.b?'b':'u'}">${m.h||esc(m.t)}</div>`).join('')}</div>
 <div class="chips">${['¿Qué tengo pendiente?','¿Quién entra hoy?','¿Qué documentos caducan?','Resumen de Climatización Rivas','Redacta un aviso a Limpiezas Brillo'].map(q=>`<button onclick="A.ask(this.textContent)">${q}</button>`).join('')}</div>
 <form class="row" onsubmit="event.preventDefault();A.ask(this.q.value)"><input name="q" placeholder="Escribe tu pregunta…" autocomplete="off" style="flex:1"><button class="btn ai">Enviar</button></form></div>`}
function findEmp(q){const n=q.toLowerCase();return S.empresas.find(e=>e.nombre.toLowerCase().split(/\s+/).filter(w=>w.length>3&&!['sl','sa'].includes(w)).some(w=>n.includes(w)))}
function answer(q){
 const n=q.toLowerCase();const e=findEmp(q);
 if(/redact|aviso|correo|email|escrib/.test(n)&&e){const items=[];[e.id,...S.trabajadores.filter(t=>t.empresaId===e.id).map(t=>t.id)].forEach(o=>(o.startsWith('e')?DOC_EMP:DOC_TRA).forEach(d=>{const st=docSt(o,d.k);if(st.st!=='valido')items.push('• '+d.n+' — '+ownerName(o)+' ('+st.txt.toLowerCase()+')')}));
  const txt=items.length?`Hola ${e.contacto},\n\nRevisando la documentación de ${e.nombre} para la coordinación de actividades empresariales, necesitamos que actualicéis:\n${items.join('\n')}\n\nPodéis subirlo desde la app AccesoPRL. Gracias.\n\nDepartamento de PRL`:`Hola ${e.contacto},\n\nOs confirmamos que toda la documentación de ${e.nombre} está al día. Gracias por vuestra colaboración.\n\nDepartamento de PRL`;
  return{t:'Aquí tienes el borrador:\n\n'+txt,act:{label:'✉ Enviar a '+e.email,fn:`A.sendDraft('${e.id}')`,txt}}}
 if(e){const s=empSemaforo(e);const sols=S.solicitudes.filter(x=>x.empresaId===e.id&&!['finalizada','rechazada'].includes(x.estado));
  return{t:`${e.nombre} (${e.cif})\n• ${S.trabajadores.filter(t=>t.empresaId===e.id).length} trabajadores\n• Documentos: ${s.bad} mal o faltan, ${s.warn} a punto de caducar, ${s.pend} dudosos\n• Solicitudes abiertas: ${sols.map(x=>x.codigo+' ('+ESTADOS[x.estado][0].toLowerCase()+')').join(', ')||'ninguna'}\n${s.bad?'\nTe recomiendo escribirles: di "redacta un aviso a '+e.nombre.split(' ')[0]+'".':'\nTodo en orden.'}`}}
 if(/hoy|entra|porter|dentro/.test(n)){const a=activasHoy();return{t:a.length?'Autorizados hoy:\n'+a.map(s=>`• ${emp(s.empresaId).nombre} (${s.codigo}) en ${cen(s.centroId).nombre}: ${s.trabajadores.map(t=>tra(t).nombre).join(', ')}`).join('\n'):'Hoy no hay accesos autorizados.'}}
 if(/caduc|venc/.test(n)){const l=S.docs.filter(d=>lastDoc(d.owner,d.tipo)===d&&d.caduca&&d.caduca<addDays(S.cfg.diasAviso)).sort((a,b)=>a.caduca.localeCompare(b.caduca));return{t:l.length?'Caducados o a punto de caducar:\n'+l.map(d=>`• ${docName(d.tipo)} — ${ownerName(d.owner)}: ${d.caduca<TODAY?'CADUCADO':'caduca'} ${fd(d.caduca)}`).join('\n')+'\n\nYa he avisado a las empresas de los que caducan pronto.':'No hay documentos caducados ni que caduquen en '+S.cfg.diasAviso+' días.'}}
 if(/pendiente|tengo|hacer|atenci|resumen|qu[eé] hay/.test(n)){const r=S.solicitudes.filter(s=>s.estado==='revision'),w=S.solicitudes.filter(s=>s.estado==='subsanar');
  return{t:`Tu decisión (${r.length}):\n${r.map(s=>`• ${s.codigo} ${emp(s.empresaId).nombre} — ${s.motivoRev==='alto'?'alto riesgo, documentación OK, recomiendo aprobar':'documento dudoso que revisar'}`).join('\n')||'• Nada'}\n\nEsperando a la empresa (${w.length}):\n${w.map(s=>`• ${s.codigo} ${emp(s.empresaId).nombre} — faltan ${check(s).bloq.length} doc.`).join('\n')||'• Nada'}\n\nLa IA lleva ${S.log.filter(l=>l.auto).length} tareas hechas sola.`}}
 if(/qu[eé] (documentos|papeles)|requisit|pide|necesit/.test(n))return{t:'Para cada acceso pido:\nEmpresa: '+DOC_EMP.map(d=>d.n).join('; ')+'.\nCada trabajador: '+DOC_TRA.map(d=>d.n).join('; ')+'.\nY según el riesgo: altura, eléctrico (RD 614/2001), espacios confinados, en caliente, carretillas/PEMP, obra (TPC y REA).'};
 return{t:'Puedo ayudarte con:\n• "¿Qué tengo pendiente?"\n• "¿Quién entra hoy?"\n• "¿Qué documentos caducan?"\n• "Resumen de <empresa>"\n• "Redacta un aviso a <empresa>"\n• "¿Qué documentos pides?"'};
}
function activasHoy(cid){return S.solicitudes.filter(s=>s.estado==='aprobada'&&s.desde<=TODAY&&s.hasta>=TODAY&&(!cid||s.centroId===cid))}

/* ---------- vistas contratista ---------- */
function vCInicio(){const eid=S.user.empresaId;const sols=S.solicitudes.filter(s=>s.empresaId===eid).sort((a,b)=>b.creada.localeCompare(a.creada));const f=misFaltan(eid);
 return`<h1>${esc(emp(eid).nombre)}</h1>${f.length?`<div class="aibox"><h3>🤖 Te falta ${f.length} documento(s)</h3>${f.map(i=>`<div class="row" style="padding:5px 0"><span class="sp">${esc(docName(i.k))}<br><span class="mut">${esc(ownerName(i.owner))} · ${i.txt}</span></span><button class="btn sm" onclick="A.upload('${i.owner}','${i.k}')">Subir</button></div>`).join('')}<p class="mut" style="margin-bottom:0">Al subirlos, la IA los lee al momento y, si están bien, aprueba tu acceso.</p></div>`:''}
 <a class="btn block" href="#/c/nueva" style="margin-bottom:14px">➕ Nueva solicitud de acceso</a>
 <div class="card list"><h3>Mis solicitudes</h3>${sols.map(s=>solRow(s,'#/c/s/')).join('')||'<div class="empty">Aún no hay solicitudes</div>'}</div>`}
function vCSol(id){const s=S.solicitudes.find(x=>x.id===id);if(!s)return'';const c=check(s);
 return`<a href="#/c/inicio" class="mut">‹ Inicio</a><div class="row" style="margin:6px 0 12px"><h1 class="sp" style="margin:0">${s.codigo}</h1>${pill(s.estado)}</div>
 ${s.estado==='aprobada'?`<div class="card" style="text-align:center"><h2>Pase de acceso</h2><div class="qr" id="qr">${qrSvg(s.codigo)}</div><div class="big">${s.codigo}</div><p class="mut">${esc(cen(s.centroId).nombre)}<br>${fd(s.desde)} → ${fd(s.hasta)} · ${esc(s.horario)}</p><p>${s.trabajadores.map(t=>esc(tra(t).nombre)).join('<br>')}</p><p class="mut">Enseñad este QR y el DNI en portería.</p></div>`:''}
 ${s.estado==='subsanar'?`<div class="aibox"><h3>🤖 Falta documentación</h3>Sube los documentos marcados en rojo. La IA los revisa al momento.</div>`:''}
 ${s.estado==='revision'?`<div class="aibox"><h3>🤖 En revisión técnica</h3>${s.motivoRev==='alto'?'Toda tu documentación está correcta. Al ser un trabajo de alto riesgo, el técnico PRL dará el OK final.':'Algún documento necesita confirmación del técnico PRL.'}</div>`:''}
 <div class="card"><b>${esc(cen(s.centroId).nombre)}</b><br><span class="mut">${fd(s.desde)} → ${fd(s.hasta)}</span><p style="margin:8px 0 0">${esc(s.trabajo)}</p><p class="mut">Documentación ${c.ok}/${c.total}</p></div>${docTable(s,false)}`}
function qrSvg(t){if(!window.qrcode)return'';const q=qrcode(0,'M');q.addData(t);q.make();return q.createSvgTag({cellSize:5,margin:2,scalable:true})}
let NW={};
function vCNueva(){const eid=S.user.empresaId;const ts=S.trabajadores.filter(t=>t.empresaId===eid);
 return`<h1>Nueva solicitud de acceso</h1><form class="card" onsubmit="event.preventDefault();A.crear(this)">
 <label>Centro de trabajo</label><select name="centro">${S.centros.map(c=>`<option value="${c.id}">${esc(c.nombre)}</option>`).join('')}</select>
 <div class="grid g2"><div><label>Desde</label><input type="date" name="desde" value="${addDays(1)}" min="${TODAY}" required></div><div><label>Hasta</label><input type="date" name="hasta" value="${addDays(3)}" min="${TODAY}" required></div></div>
 <label>Horario</label><input name="horario" value="08:00 – 17:00">
 <label>Descripción del trabajo</label><textarea name="trabajo" required placeholder="Ej.: Revisión de equipos de climatización en cubierta"></textarea>
 <label>Tipo de trabajo / riesgos</label>${RIESGOS.map(r=>`<label class="chk"><input type="checkbox" name="r" value="${r.k}" ${r.k==='general'?'checked':''}> ${esc(r.n)} ${r.alto?'<span class="pill bad">alto riesgo</span>':''}</label>`).join('')}
 <label>Trabajadores que entrarán</label>${ts.map(t=>`<label class="chk"><input type="checkbox" name="t" value="${t.id}" checked> ${esc(t.nombre)} <span class="mut">· ${esc(t.dni)}</span></label>`).join('')}
 <button type="button" class="btn ghost sm" style="margin:6px 0" onclick="A.addTrab()">+ Añadir trabajador</button>
 <div style="margin-top:14px"><button class="btn block">Enviar solicitud</button><p class="mut" style="text-align:center">La IA la revisa en segundos.</p></div></form>`}
function vCDocs(){const eid=S.user.empresaId;return`<h1>Documentación</h1><p class="mut">Sube cada documento una vez: sirve para todas tus solicitudes. La IA avisa antes de que caduque.</p>${ownerDocsCard(eid,true)}${S.trabajadores.filter(t=>t.empresaId===eid).map(t=>ownerDocsCard(t.id,true)).join('')}<button class="btn ghost block" onclick="A.addTrab()">+ Añadir trabajador</button>`}
function vCMensajes(){const eid=S.user.empresaId;const ms=S.mensajes.filter(m=>m.empresaId===eid);setTimeout(()=>{let ch=0;ms.forEach(m=>{if(!m.leido){m.leido=true;ch=1}});if(ch)save()},500);
 return`<h1>Mensajes</h1><p class="mut">También se envían por email a ${esc(emp(eid).email)}.</p>${ms.map(m=>`<div class="card"><div class="row"><b class="sp">${m.leido?'':'🔵 '}${esc(m.asunto)}</b><span class="mut">${fdt(m.fecha)}</span></div><div style="white-space:pre-wrap;margin-top:8px;font-size:14px">${esc(m.texto)}</div>${m.ref?`<a class="btn sm sec" style="margin-top:8px" href="#/c/s/${m.ref}">Ver solicitud</a>`:''}</div>`).join('')||'<div class="card empty">Sin mensajes</div>'}`}

/* ---------- vistas portería ---------- */
function workerNow(s,tid){const its=[...DOC_TRA.map(d=>d.k),...RIESGOS.filter(r=>s.riesgos.includes(r.k)).flatMap(r=>r.docs.map(d=>d.k))].map(k=>({k,...docSt(tid,k)}));const bad=its.filter(i=>!OKST.includes(i.st));const ebad=DOC_EMP.map(d=>({k:d.k,...docSt(s.empresaId,d.k)})).filter(i=>!OKST.includes(i.st));return[...ebad,...bad]}
function dentro(sid,tid){return S.accesos.find(a=>a.sid===sid&&a.tid===tid&&!a.salida)}
function vPHoy(){const cid=S.user.centroId;const a=activasHoy(cid);
 return`<h1>Autorizados hoy</h1><div class="row" style="margin-bottom:10px"><select onchange="A.centro(this.value)" style="max-width:320px">${S.centros.map(c=>`<option value="${c.id}" ${c.id===cid?'selected':''}>${esc(c.nombre)}</option>`).join('')}</select><span class="mut">${fd(TODAY)}</span></div>
 <div class="aibox" style="padding:10px 14px"><span>🤖 Lista generada sola por la IA con las solicitudes aprobadas. Se comprueban los documentos en tiempo real al fichar.</span></div>
 ${a.map(s=>`<div class="card"><div class="row"><h3 class="sp">${esc(emp(s.empresaId).nombre)}</h3><span class="pill info">${s.codigo}</span></div><p class="mut" style="margin:-4px 0 8px">${esc(s.trabajo)} · ${esc(s.horario)}</p>${s.trabajadores.map(t=>workerRow(s,t)).join('')}</div>`).join('')||'<div class="card empty">Hoy no hay accesos autorizados en este centro</div>'}`}
function workerRow(s,t){const w=tra(t);const bad=workerNow(s,t);const d=dentro(s.id,t);
 return`<div class="row" style="padding:8px 0;border-top:1px solid var(--line)"><span class="sp"><b>${esc(w.nombre)}</b><br><span class="mut">${esc(w.dni)} · ${esc(w.puesto)}</span>${bad.length?`<br><span class="pill bad">⚠ ${esc(docName(bad[0].k))}: ${bad[0].txt.toLowerCase()}</span>`:''}</span>${d?`<span class="pill ok">Dentro desde ${hm(d.entrada)}</span><button class="btn sm sec" onclick="A.salida('${s.id}','${t}')">Salida</button>`:`<button class="btn sm ok" ${bad.length?'disabled':''} onclick="A.entrada('${s.id}','${t}')">Entrada</button>`}</div>`}
function vPBuscar(q){q=decodeURIComponent(q||'');let res='';
 if(q){const Q=q.toUpperCase().replace(/[\s-]/g,'');const sByCode=S.solicitudes.find(s=>s.codigo.replace('-','')===Q);const w=S.trabajadores.find(t=>t.dni===Q);
  if(sByCode){const ok=sByCode.estado==='aprobada'&&sByCode.desde<=TODAY&&sByCode.hasta>=TODAY;res=`<div class="verdict ${ok?'ok':'bad'}">${ok?'✔ PASE VÁLIDO HOY':'✖ PASE NO VÁLIDO HOY'}<small>${esc(emp(sByCode.empresaId).nombre)} · ${sByCode.codigo} · ${ESTADOS[sByCode.estado][0]} · ${fd(sByCode.desde)} → ${fd(sByCode.hasta)}</small></div>${ok?`<div class="card">${sByCode.trabajadores.map(t=>workerRow(sByCode,t)).join('')}</div>`:''}`}
  else if(w){const s=activasHoy().find(x=>x.trabajadores.includes(w.id));const bad=s?workerNow(s,w.id):[];const ok=s&&!bad.length;
   res=`<div class="verdict ${ok?'ok':'bad'}">${ok?'✔ AUTORIZADO':'✖ NO AUTORIZADO'}<small>${esc(w.nombre)} · ${esc(emp(w.empresaId).nombre)}<br>${!s?'No tiene ningún acceso aprobado para hoy':bad.length?esc(docName(bad[0].k))+': '+bad[0].txt.toLowerCase():esc(cen(s.centroId).nombre)+' · '+s.codigo}</small></div>${s?`<div class="card">${workerRow(s,w.id)}</div>`:''}`}
  else res=`<div class="verdict bad">✖ NO ENCONTRADO<small>No hay ningún trabajador ni pase con "${esc(q)}"</small></div>`}
 const ex=activasHoy()[0];
 return`<h1>Comprobar acceso</h1><form class="card" onsubmit="event.preventDefault();go('#/p/buscar/'+encodeURIComponent(this.q.value.trim()))"><label>DNI/NIE del trabajador o código del pase</label><div class="row"><input name="q" value="${esc(q)}" placeholder="Ej.: 12345678Z o ACC-1001" style="flex:1" autocapitalize="characters"><button class="btn">Comprobar</button></div>
 ${ex?`<p class="mut">Prueba: <a href="#/p/buscar/${tra(ex.trabajadores[0]).dni}">${tra(ex.trabajadores[0]).dni}</a> · <a href="#/p/buscar/${ex.codigo}">${ex.codigo}</a> · <a href="#/p/buscar/45678901G">45678901G</a></p>`:''}</form>${res}`}
function vPRegistro(){const l=S.accesos.slice().sort((a,b)=>b.entrada.localeCompare(a.entrada));
 return`<h1>Registro de entradas y salidas</h1><div class="row" style="margin-bottom:10px"><button class="btn sec sm" onclick="A.csv()">⬇ Descargar Excel (CSV)</button></div><div class="card tw"><table><tr><th>Trabajador</th><th>Empresa</th><th>Entrada</th><th>Salida</th></tr>${l.map(a=>`<tr><td>${esc(tra(a.tid).nombre)}</td><td>${esc(emp(tra(a.tid).empresaId).nombre)}</td><td>${fdt(a.entrada)}</td><td>${a.salida?fdt(a.salida):'<span class="pill ok">Dentro</span>'}</td></tr>`).join('')||'<tr><td colspan="4" class="empty">Sin registros todavía</td></tr>'}</table></div>`}

/* ---------- acciones ---------- */
function modal(html){$('#modalBox').innerHTML=html;$('#modal').classList.remove('hidden')}
function closeModal(){$('#modal').classList.add('hidden')}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
const A={
 login(role,empresaId){S.user={role,empresaId,centroId:'c1'};save();location.hash='';render()},
 loginEmp(){modal(`<h2>¿Qué empresa eres?</h2><p class="mut">Demo: elige una empresa de ejemplo.</p>${S.empresas.map(e=>`<button class="role" onclick="closeModal();A.login('contrata','${e.id}')"><span class="ri">🦺</span><span><b>${esc(e.nombre)}</b><br><span class="mut">${esc(e.cif)}</span></span></button>`).join('')}`)},
 logout(){S.user=null;save();location.hash='';render()},
 reanalizar(){const n=runAI(true);toast(n?'🤖 La IA ha hecho '+n+' tarea(s)':'🤖 Revisado: todo está al día',true);render()},
 cfg(k,v){S.cfg[k]=v;log('Ajuste cambiado: '+k+' = '+v,0,false);S.docs.forEach(d=>{if(k==='diasAviso')d.avisado=false});runAI();render()},
 reset(){if(confirm('¿Borrar todos los cambios y volver a los datos de ejemplo?')){localStorage.removeItem(KEY);S=load();CHAT=CHAT.slice(0,1);location.hash='';render()}},
 valDoc(id,ok){const d=S.docs.find(x=>x.id===id);if(ok){d.estado='valido';d.por='tecnico';d.nota=null;if(ALLDOC[d.tipo].cad&&!d.caduca){const c=prompt('Fecha de caducidad (AAAA-MM-DD)',addDays(365));if(!c)return;d.caduca=c}log('Validado manualmente: '+docName(d.tipo)+' de '+ownerName(d.owner),0,false)}
  else{const m=prompt('Motivo del rechazo (se envía a la empresa)','Documento ilegible, por favor súbalo en PDF');if(m===null)return;d.estado='rechazado';d.motivo=m;d.por='tecnico';log('Rechazado: '+docName(d.tipo)+' de '+ownerName(d.owner)+' — '+m,0,false)}
  runAI();render()},
 aprobar(id){const s=S.solicitudes.find(x=>x.id===id);approve(s,'Técnico PRL');save();toast('✔ Aprobado. Empresa avisada y portería actualizada');render()},
 rechazar(id){const m=prompt('Motivo de la denegación (se envía a la empresa)');if(m===null)return;const s=S.solicitudes.find(x=>x.id===id);s.estado='rechazada';s.hist.push(h('Técnico PRL','Denegada: '+m));notify(s.empresaId,'Acceso denegado: '+s.codigo,'Su solicitud ha sido denegada.\nMotivo: '+m+'\n\nDepartamento de PRL',s.id);log('Denegado '+s.codigo+': '+m,0,false,s.id);save();render()},
 pedir(id){const s=S.solicitudes.find(x=>x.id===id);const e=emp(s.empresaId);const c=check(s);
  const sug=c.bloq.length?'Por favor, aportad: '+c.bloq.map(i=>docName(i.k)+' ('+ownerName(i.owner)+')').join(', ')+'.':isAlto(s)?'Por favor, enviad el permiso de trabajo y el nombre del recurso preventivo presente durante los trabajos.':'';
  modal(`<h2>Mensaje a ${esc(e.nombre)}</h2><p class="mut">🤖 Borrador preparado por la IA. Se envía a ${esc(e.email)}.</p><textarea id="pm" style="min-height:140px">Hola ${esc(e.contacto)},\n\nSobre la solicitud ${s.codigo}: ${esc(sug)}\n\nGracias.\nDepartamento de PRL</textarea><div class="row" style="margin-top:12px"><button class="btn" onclick="A.enviar('${s.id}')">Enviar</button><button class="btn ghost" onclick="closeModal()">Cancelar</button></div>`)},
 enviar(id){const s=S.solicitudes.find(x=>x.id===id);notify(s.empresaId,'Sobre su solicitud '+s.codigo,$('#pm').value,s.id);s.hist.push(h('Técnico PRL','Mensaje enviado a la empresa'));log('Mensaje enviado a '+emp(s.empresaId).nombre,0,false,s.id);save();closeModal();toast('✉ Enviado a '+emp(s.empresaId).email);render()},
 ask(q){if(!q||!q.trim())return;CHAT.push({t:q});const a=answer(q);CHAT.push({b:1,t:a.t,h:esc(a.t)+(a.act?`<div style="margin-top:8px"><button class="btn sm ai" onclick="${a.act.fn}">${esc(a.act.label)}</button></div>`:'')});A._draft=a.act?.txt;render()},
 sendDraft(eid){notify(eid,'Documentación PRL',A._draft);log('Aviso enviado a '+emp(eid).nombre+' (redactado por la IA)',6,true);save();CHAT.push({b:1,t:'✉ Enviado a '+emp(eid).email+'.'});render()},
 entrada(sid,tid){S.accesos.push({id:uid('a'),sid,tid,entrada:new Date().toISOString()});save();toast('✔ Entrada registrada: '+tra(tid).nombre);render()},
 salida(sid,tid){dentro(sid,tid).salida=new Date().toISOString();save();toast('Salida registrada');render()},
 centro(c){S.user.centroId=c;save();render()},
 csv(){const rows=[['Trabajador','DNI','Empresa','Solicitud','Entrada','Salida']].concat(S.accesos.map(a=>{const t=tra(a.tid);return[t.nombre,t.dni,emp(t.empresaId).nombre,S.solicitudes.find(s=>s.id===a.sid)?.codigo,a.entrada,a.salida||'']}));
  const b=new Blob(['\ufeff'+rows.map(r=>r.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(';')).join('\n')],{type:'text/csv'});const u=URL.createObjectURL(b);const l=document.createElement('a');l.href=u;l.download='registro-accesos-'+TODAY+'.csv';l.click()},
 addTrab(){modal(`<h2>Añadir trabajador</h2><form onsubmit="event.preventDefault();A.saveTrab(this)"><label>Nombre y apellidos</label><input name="n" required><label>DNI / NIE</label><input name="d" required pattern="[0-9XYZxyz][0-9]{7}[A-Za-z]" placeholder="12345678Z"><label>Puesto</label><input name="p" value="Operario"><div class="row" style="margin-top:12px"><button class="btn">Guardar</button><button type="button" class="btn ghost" onclick="closeModal()">Cancelar</button></div></form>`)},
 saveTrab(f){S.trabajadores.push({id:uid('t'),empresaId:S.user.empresaId,nombre:f.n.value.trim(),dni:f.d.value.trim().toUpperCase(),puesto:f.p.value.trim()});save();closeModal();toast('Trabajador añadido. Sube sus documentos en "Documentos".');render()},
 crear(f){const r=[...f.querySelectorAll('[name=r]:checked')].map(x=>x.value);const t=[...f.querySelectorAll('[name=t]:checked')].map(x=>x.value);
  if(!t.length)return alert('Elige al menos un trabajador');if(f.hasta.value<f.desde.value)return alert('La fecha "hasta" es anterior a "desde"');
  const n=S.solicitudes.length+1;const s={id:'s'+Date.now(),codigo:'ACC-'+(1000+n),empresaId:S.user.empresaId,centroId:f.centro.value,desde:f.desde.value,hasta:f.hasta.value,horario:f.horario.value,trabajo:f.trabajo.value,riesgos:r.length?r:['general'],trabajadores:t,estado:'pendiente',creada:new Date().toISOString(),hist:[h('Empresa','Solicitud creada')]};
  S.solicitudes.push(s);log('Nueva solicitud '+s.codigo+' de '+emp(s.empresaId).nombre,0,false,s.id);save();
  modal(`<div style="text-align:center;padding:20px"><div class="spin" style="width:36px;height:36px;border-width:4px"></div><h2 style="margin-top:14px">🤖 La IA está revisando tu solicitud…</h2><p class="mut">Comprobando ${check(s).total} documentos de la empresa y de ${t.length} trabajador(es)</p></div>`);
  setTimeout(()=>{runAI(true);closeModal();const st=s.estado;toast(st==='aprobada'?'✔ ¡Aprobada al momento! Ya tienes tu QR':st==='subsanar'?'🤖 Falta documentación: mira la lista':'🤖 Documentación OK. Pendiente del OK del técnico PRL',true);go('#/c/s/'+s.id)},1600)},
 upload(o,k){const def=ALLDOC[k];
  modal(`<h2>Subir: ${esc(def.n)}</h2><p class="mut">${esc(ownerName(o))}</p><label>Archivo (PDF)</label><input type="file" id="uf" accept=".pdf,image/*">
  <button class="btn ai block" style="margin-top:12px" onclick="A.doUpload('${o}','${k}')">🤖 Subir y que la IA lo revise</button>
  <div class="card" style="margin-top:14px;background:#faf7ff"><b>¿No tienes un PDF a mano?</b><p class="mut" style="margin:4px 0 8px">Prueba la IA con documentos de ejemplo:</p><div class="row"><button class="btn sm ok" onclick="A.doUpload('${o}','${k}','ok')">Documento correcto</button><button class="btn sm sec" onclick="A.doUpload('${o}','${k}','caducado')">Caducado</button><button class="btn sm sec" onclick="A.doUpload('${o}','${k}','otro')">De otra persona</button><button class="btn sm sec" onclick="A.doUpload('${o}','${k}','foto')">Foto borrosa</button></div></div><div id="ures"></div>`)},
 async doUpload(o,k,sample){let text='',name;
  if(sample){text=sample==='foto'?'':sampleText(o,k,sample);name='ejemplo_'+k+(sample==='foto'?'.jpg':'.pdf')}
  else{const f=$('#uf').files[0];if(!f)return alert('Elige un archivo');name=f.name;$('#ures').innerHTML='<p><span class="spin"></span> Leyendo el documento…</p>';
   if(/pdf$/i.test(f.name)||f.type==='application/pdf'){try{text=await pdfText(f)}catch(e){text=''}}}
  $('#ures').innerHTML='<div class="aibox" style="margin-top:12px"><span class="spin"></span> La IA está leyendo el documento…</div>';
  await new Promise(r=>setTimeout(r,1100));
  const a=analyze(text,o,k);
  const d={id:uid('d'),owner:o,tipo:k,archivo:name,caduca:a.caduca||null,estado:a.estado,por:a.estado==='pendiente'?null:'ia',conf:a.conf,motivo:a.motivo||null,nota:a.nota||null,subido:new Date().toISOString()};S.docs.push(d);
  log('Documento leído por IA: '+docName(k)+' de '+ownerName(o)+' → '+(a.estado==='valido'?'validado':a.estado==='rechazado'?'rechazado ('+a.motivo+')':'dudoso, para tu revisión'),a.estado==='pendiente'?1:5);
  if(a.estado==='rechazado')notify(ownerEmp(o),'Documento rechazado por la IA',docName(k)+' de '+ownerName(o)+': '+a.motivo+'.\nPor favor, suba el documento correcto.');
  const before=S.solicitudes.map(s=>s.estado).join();runAI(true);const changed=S.solicitudes.filter(s=>s.empresaId===ownerEmp(o)&&s.estado==='aprobada'&&s.aprobadaPor==='IA'&&s.aprobada>d.subido);
  $('#ures').innerHTML=`<div class="aibox" style="margin-top:12px"><h3>🤖 Resultado de la IA</h3>${a.steps.map(([i,t])=>`<div class="aistep"><i>${i}</i><span>${esc(t)}</span></div>`).join('')}<div style="margin-top:8px">${a.estado==='valido'?'<span class="pill ok">VALIDADO</span>':a.estado==='rechazado'?'<span class="pill bad">RECHAZADO</span>':'<span class="pill ai">PENDIENTE DEL TÉCNICO</span>'}</div>${changed.length?`<p><b>🎉 ${changed.map(s=>s.codigo).join(', ')} aprobada automáticamente.</b></p>`:''}</div><button class="btn block" style="margin-top:10px" onclick="closeModal();render()">Hecho</button>`;
 },
};
window.A=A;window.go=go;window.closeModal=closeModal;window.render=render;
S=load();runAI(true);render();
