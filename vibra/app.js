'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n>=1e6?(n/1e6).toFixed(1).replace('.0','')+' M':n>=1e4?Math.round(n/1e3)+' mil':n>=1e3?(n/1e3).toFixed(1).replace('.0','')+' mil':String(n);
const P={home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',play:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M10 8.5v7l6-3.5z"/>',plus:'<path d="M12 6v12M6 12h12"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.8a3.3 3.3 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.5 3.6 5.2"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.2-6.5 8-6.5s7 2.5 8 6.5"/>',heart:'<path d="M12 20.5s-7.5-4.6-9.3-9.3C1.3 7.4 3.7 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.5 0 5.9 3.4 4.5 7.2-1.8 4.7-9.3 9.3-9.3 9.3z"/>',send:'<path d="M21 3 10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>',comment:'<path d="M20.5 11.5a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-4.5A8.5 8.5 0 1 1 20.5 11.5z"/>',bookmark:'<path d="M6 3.5h12v17l-6-4.2-6 4.2z"/>',share:'<path d="M14 4l7 7-7 7v-4c-5 0-8.5 1.5-11 5 1-5 4-10 11-11z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',chat:'<path d="M12 3c5 0 9 3.6 9 8s-4 8-9 8c-1 0-2-.1-2.9-.4L4 20l1.3-3.7C3.9 14.9 3 13 3 11c0-4.4 4-8 9-8z"/>',vol:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',mute:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m16 9 5 6M21 9l-5 6"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',back:'<path d="M15 5l-7 7 7 7"/>',like:'<path d="M7 10v11H3V10zM7 10l4-7c1.7 0 2.8 1.2 2.5 3L13 9h6a2 2 0 0 1 2 2.3l-1.3 7.5A2.5 2.5 0 0 1 17.2 21H7"/>',pause:'<path d="M8 5v14l11-7z"/>',grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'};
const ic=(n,fill)=>`<svg viewBox="0 0 24 24" fill="${fill||'none'}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;

const U={
 u1:['Lucía Fernández','lucia.fz','a64'],u2:['Diego Ramírez','diegor','a65'],u3:['Sofía Benítez','sofi.bnz','a91'],u4:['Mateo Giménez','mateo.gz','a203'],
 u5:['Valentina Ortiz','vale.ortiz','a237'],u6:['Carlos Duarte','carlitos.d','a338'],u7:['Ana Cocina','ana.cocina','a342'],u8:['Javi Viajes','javi.viajes','a433'],
 u9:['Camila Fit','cami.fit','a447'],u10:['Pablo Foto','pablo.foto','a453'],u11:['Martina Arte','marti.art','a494'],u12:['Lucas Vera','lucasvera','a659']};
const img=n=>`img/${n}.jpg`;
const uName=id=>id==='me'?S.profile.name:U[id][0];
const uHandle=id=>id==='me'?S.profile.handle:U[id][1];
const uAv=id=>id==='me'?(S.profile.avatar||img('a823')):img(U[id][2]);

const KEY='vibra_demo_v1';
const S=Object.assign({react:{},saved:{},follow:{u2:1,u5:1},comments:{},myPosts:[],myStory:[],joined:{g2:1},going:{},seen:{},votes:{},chats:{},read:{},notifSeen:0,welcome:0,vlike:{},vsaved:{},
 profile:{name:'Tu Nombre',handle:'tu_usuario',bio:'Probando Vibra ✨\nFotos, videos y amigos en un solo lugar.',avatar:''}},JSON.parse(localStorage.getItem(KEY)||'{}'));
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Memoria del navegador llena: borra alguna publicación')}}

const POSTS=[
 {id:'p1',u:'u1',t:'2 h',type:'photo',imgs:['p1011'],text:'Domingo de lago y cero cobertura 🛶 ¿Quién se apunta la próxima? #findesemana #naturaleza',likes:1284,cm:46,sh:12,loc:'Lago Escondido'},
 {id:'p2',u:'u4',t:'3 h',type:'color',bg:'linear-gradient(135deg,#7b2ff7,#f107a3)',text:'Si pudieras viajar mañana a cualquier lugar del mundo, ¿a dónde irías? 🌍👇',likes:342,cm:128,sh:9},
 {id:'p3',u:'u8',t:'5 h',type:'carousel',imgs:['p1015','p1050','p1018','p1036'],text:'Resumen de 10 días por la costa y la montaña. Desliza 👉 #viajes #mochilero',likes:5320,cm:211,sh:87,loc:'Ruta del Norte'},
 {id:'p4',u:'u7',t:'6 h',type:'poll',text:'Para el directo del jueves… ¿qué cocinamos? 👩‍🍳',opts:['Tarta de fresas 🍓','Pasta casera 🍝','Empanadas 🥟'],base:[412,268,530],likes:190,cm:34,sh:4,group:'Recetas fáciles'},
 {id:'p5',u:'u10',t:'8 h',type:'photo',imgs:['p1024'],text:'1/2000 s y un poco de suerte 🦅 #fotografia #fauna',likes:9870,cm:302,sh:140},
 {id:'ad',type:'market'},
 {id:'p6',u:'u3',t:'10 h',type:'photo',imgs:['p1025'],text:'Así amaneció hoy el jefe de la casa 🐶☁️',likes:22140,cm:870,sh:1300},
 {id:'p7',u:'u2',t:'12 h',type:'text',text:'Hoy cumplo 1 año con mi emprendimiento 🎉 Gracias a todos los que compartieron, recomendaron y confiaron. ¡Esto recién empieza!',likes:768,cm:154,sh:21},
 {id:'p8',u:'u11',t:'1 d',type:'carousel',imgs:['p152','p110','p1016'],text:'Paleta de colores para mi próximo cuadro 🎨 ¿Cuál os gusta más? #arte',likes:2311,cm:97,sh:33},
 {id:'p9',u:'u9',t:'1 d',type:'photo',imgs:['p177'],text:'Ruta de 14 km ✅ Lo difícil no es subir, es levantarse temprano 😅 #fit #senderismo',likes:3410,cm:120,sh:40,group:'Senderismo y montaña'},
 {id:'p10',u:'u6',t:'2 d',type:'photo',imgs:['p164'],text:'Paseo por el canal. Sin filtro 💙',likes:1530,cm:44,sh:8,loc:'Casco antiguo'},
];
const STORIES=[
 {u:'u5',items:[['p1019','Tormenta llegando ⛈️'],['p1044','']],t:'1 h'},
 {u:'u1',items:[['p1012','Domingo de libro 📖'],['p1055','']],t:'2 h'},
 {u:'u8',items:[['p1040','¡Qué castillo! 🏰'],['p1043',''],['p1039','💦']],t:'4 h'},
 {u:'u7',items:[['p1080','Fresas para la tarta 🍓']],t:'5 h'},
 {u:'u3',items:[['p1062','Modo domingo 😴']],t:'6 h'},
 {u:'u12',items:[['p1047','Ciudad']],t:'8 h'},
 {u:'u9',items:[['p1035','Llegamos 🌈']],t:'9 h'},
 {u:'u10',items:[['p1074','Mirada 🦁'],['p1084','']],t:'11 h'},
];
const VIDEOS=[
 {id:'v1',u:'u12',src:'v1',cap:'Cuando el GPS te dice "gire a la derecha" 😂 #humor #parati',mus:'Sonido original · lucasvera',likes:128400,cm:2210,sh:5400,cr:'Sintel © Blender Foundation (CC BY)'},
 {id:'v4',u:'u6',src:'v4',cap:'POV: llegas al trabajo un lunes a las 8:00 🎯 #pov #lunes',mus:'Epic Mode · Remix',likes:89300,cm:1500,sh:2100,cr:'Tears of Steel © Blender Foundation (CC BY)'},
 {id:'v3',u:'u3',src:'v3',cap:'Mi cara cuando dicen que hay reunión que pudo ser un correo 🐰',mus:'Bunny Beat · sofi.bnz',likes:402000,cm:8800,sh:31000,cr:'Big Buck Bunny © Blender Foundation (CC BY)'},
 {id:'v2',u:'u8',src:'v2',cap:'Desierto infinito 🏜️ Guarda este destino para tu próximo viaje #viajes',mus:'Desert Wind · Lo-fi',likes:56700,cm:640,sh:3900,cr:'Sintel © Blender Foundation (CC BY)'},
 {id:'v5',u:'u2',src:'v5',cap:'Tutorial: cómo poner cara de "lo tengo todo bajo control" 🤖 #tutorial',mus:'Sonido original · diegor',likes:23100,cm:410,sh:800,cr:'Tears of Steel © Blender Foundation (CC BY)'},
 {id:'v6',u:'u11',src:'v6',cap:'Trend del día: ¿te atreves? Dúo conmigo 👇 #reto #dúo',mus:'Trend 2026 · Viral',likes:310500,cm:12000,sh:44000,cr:'Tears of Steel © Blender Foundation (CC BY)'},
];
const GROUPS=[
 {id:'g1',n:'Recetas fáciles',m:'48,2 mil miembros',img:'p1080',d:'12 publicaciones nuevas hoy'},
 {id:'g2',n:'Senderismo y montaña',m:'21,7 mil miembros',img:'p177',d:'Salida grupal este sábado'},
 {id:'g3',n:'Fotografía de naturaleza',m:'93,1 mil miembros',img:'p1024',d:'Concurso semanal abierto'},
 {id:'g4',n:'Amantes de los perros 🐶',m:'130 mil miembros',img:'p1025',d:'Adopciones y consejos'},
 {id:'g5',n:'Viajeros low cost',m:'64,5 mil miembros',img:'p1015',d:'Ofertas de vuelos cada día'},
];
const MARKET=[
 {id:'m1',n:'Bicicleta de montaña',p:'180 €',img:'p1018',l:'a 2 km',u:'u9'},{id:'m2',n:'Cafetera de goteo + molinillo',p:'45 €',img:'p1060',l:'a 4 km',u:'u7'},
 {id:'m3',n:'Kayak inflable 2 personas',p:'120 €',img:'p1011',l:'a 7 km',u:'u1'},{id:'m4',n:'Cuadro pintado a mano',p:'60 €',img:'p152',l:'a 3 km',u:'u11'},
 {id:'m5',n:'Cámara réflex + objetivo',p:'350 €',img:'p1027',l:'a 5 km',u:'u10'},{id:'m6',n:'Manta de lana artesanal',p:'25 €',img:'p1062',l:'a 1 km',u:'u3'},
];
const EVENTS=[
 {id:'e1',d:'14',mo:'NOV',n:'Ruta al amanecer · Grupo Senderismo',w:'Sáb 06:30 · Sierra Norte',g:212},
 {id:'e2',d:'20',mo:'NOV',n:'Taller de fotografía con el móvil',w:'Jue 19:00 · Online (en vivo)',g:1340},
 {id:'e3',d:'29',mo:'NOV',n:'Mercadillo de segunda mano',w:'Dom 10:00 · Plaza Mayor',g:860},
];
const CHATS=[
 {id:'c1',u:'u1',msgs:[['u1','¡Holaa! ¿Viste mi historia del lago? 😍']],un:1},
 {id:'c2',u:'u7',msgs:[['me','¿Me pasas la receta de la tarta?'],['u7','¡Claro! La subo esta noche en el grupo 🍓']],un:1},
 {id:'c3',u:'u9',msgs:[['u9','¿Sigue en venta la bici? 🚲']],un:1},
 {id:'c4',u:'u4',msgs:[['u4','Jajaja buenísimo el video 😂'],['me','¿A que sí? 🤣']],un:0},
];
const REPLIES=['¡Jajaja sí! 😂','Me encanta 😍','¡Dale! Hablamos luego 🙌','¿En serio? 😮','Genial, gracias 💜','Te lo paso ahora mismo 👍','¡Qué buena idea!'];
const RX=[['👍','Me gusta'],['❤️','Me encanta'],['😂','Me divierte'],['😮','Me asombra'],['😢','Me entristece'],['😡','Me enoja']];
const CMTS=[['u2','¡Increíble! 🔥'],['u5','Necesito ir ya mismo 😍'],['u9','Qué buena foto 👏'],['u12','Jajaja me encanta'],['u3','Guardado para después 📌'],['u6','👏👏👏']];

/* ---------- utils ---------- */
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200)}
function hashtags(s){return esc(s).replace(/#([\wáéíóúñü]+)/gi,'<span class="ht">#$1</span>')}
function openSheet(html,opts={}){$('#sheetBody').innerHTML=html;$('#sheet').classList.toggle('full',!!opts.full);document.body.classList.add('sheet');opts.mount&&opts.mount($('#sheetBody'))}
function closeSheet(){document.body.classList.remove('sheet');sheetClose&&sheetClose();sheetClose=null}
let sheetClose=null;
$('#sheetBg').onclick=closeSheet;
function head(t,left){return `<div class="sh-h">${left?`<button class="ib" data-x="back">${ic('back')}</button>`:'<span style="width:34px"></span>'}<div class="t">${t}</div><button class="ib" data-x="close">${ic('x')}</button></div>`}
$('#sheet').addEventListener('click',e=>{const b=e.target.closest('[data-x]');if(!b)return;if(b.dataset.x==='close')closeSheet();else if(b.dataset.x==='back'&&backFn)backFn()});
let backFn=null;
function resizeImg(file,max=900){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.78))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}
function pickImage(){return new Promise(res=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=async()=>{if(i.files[0])res(await resizeImg(i.files[0]))};i.click()})}
const srcOf=x=>x.startsWith('data:')?x:img(x);

/* ---------- nav ---------- */
let tab='inicio';
$$('[data-ic]').forEach(i=>i.innerHTML=ic(i.dataset.ic));
$('[data-act=search]').innerHTML=ic('search');$('[data-act=notifs]').insertAdjacentHTML('afterbegin',ic('bell'));$('[data-act=chats]').insertAdjacentHTML('afterbegin',ic('chat'));
$('#nav').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tab==='crear')return openCreate();go(b.dataset.tab)};
$('#top').onclick=e=>{const b=e.target.closest('[data-act]');if(!b)return;({search:openSearch,notifs:openNotifs,chats:openChats})[b.dataset.act]()};
function go(t){tab=t;$$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));document.body.classList.toggle('dark',t==='videos');stopVideos();const v=$('#view');v.scrollTop=0;
 ({inicio:renderFeed,videos:renderVideos,comunidad:renderCom,perfil:renderProfile})[t]();updateBadges()}
function updateBadges(){const n=CHATS.filter(c=>c.un&&!S.read[c.id]).length;$('#chatBadge').textContent=n||'';$('#notifDot').classList.toggle('off',!!S.notifSeen)}

/* ---------- feed ---------- */
function rxSummary(p){const r=S.react[p.id];const em=r?['👍','❤️',r]:['👍','❤️','😂'];const n=p.likes+(r?1:0);return `<span class="rx"><em>${[...new Set(em)].slice(0,3).join('')}</em>${r?'Tú y '+fmt(p.likes)+' más':fmt(n)}</span>`}
function postHTML(p){
 if(p.type==='market'){const m=MARKET[1];return `<div class="post"><div class="ph"><img class="av" src="${img('p1060')}"><div class="who"><b>Marketplace cerca de ti</b><small>Sugerido · Comunidad</small></div></div><div class="sponsor"><img src="${img(m.img)}"><div><small>${m.l}</small><b>${m.p}</b>${m.n}<br><button class="btn sm blue" style="margin-top:8px" data-mk="${m.id}">Ver artículo</button></div></div></div>`}
 const mine=p.u==='me';const c=(S.comments[p.id]||[]).length;
 let body='';
 if(p.type==='color')body=`<div class="colorpost" style="background:${p.bg}">${esc(p.text)}</div>`;
 else if(p.text)body=`<div class="ptext">${hashtags(p.text)}</div>`;
 if(p.type==='photo'||p.type==='carousel'){const many=p.imgs.length>1;body+=`<div class="media" data-dbl="${p.id}"><div class="${many?'carousel':''}">${p.imgs.map(x=>`<img src="${srcOf(x)}" loading="lazy" alt="">`).join('')}</div>${many?`<span class="cnt">1/${p.imgs.length}</span>`:''}<span class="burst">❤️</span></div>`}
 if(p.type==='poll'){const v=S.votes[p.id];const tot=p.base.reduce((a,b)=>a+b,0)+(v!=null?1:0);body+=`<div class="poll">${p.opts.map((o,i)=>{const n=p.base[i]+(v===i?1:0);const pc=Math.round(n*100/tot);return `<button data-vote="${p.id}:${i}"><i class="bar" style="width:${v!=null?pc:0}%"></i><span>${esc(o)}${v===i?' ✓':''}</span>${v!=null?`<b class="pct">${pc}%</b>`:''}</button>`}).join('')}<small>${fmt(tot)} votos · ${v!=null?'Gracias por votar':'Toca una opción para votar'}</small></div>`}
 const r=S.react[p.id];const rl=r?RX.find(x=>x[0]===r):null;
 return `<div class="post" id="post-${p.id}"><div class="ph"><img class="av" src="${uAv(p.u)}" alt=""><div class="who"><b>${esc(uName(p.u))}</b>${p.group?` ▸ <span class="tag">${esc(p.group)}</span>`:''}<small>${p.t}${p.loc?' · 📍 '+esc(p.loc):''} · 🌎</small></div>${mine?`<button class="follow" data-del="${p.id}">Borrar</button>`:`<button class="follow ${S.follow[p.u]?'on':''}" data-fol="${p.u}">${S.follow[p.u]?'Siguiendo':'Seguir'}</button>`}</div>${body}
 <div class="stats">${rxSummary(p)}<span>${fmt(p.cm+c)} comentarios · ${fmt(p.sh)} veces compartido</span></div>
 <div class="acts"><button class="like ${r?'on':''}" data-like="${p.id}">${r&&r!=='👍'?`<span style="font-size:19px">${r}</span>`:ic(r?'like':'like')}<span>${rl?rl[1]:'Me gusta'}</span></button><button data-cm="${p.id}">${ic('comment')}<span>Comentar</span></button><button data-sh="${p.id}">${ic('share')}<span>Compartir</span></button><button class="${S.saved[p.id]?'saved':''}" data-sv="${p.id}" style="flex:.55">${ic('bookmark')}</button></div></div>`}
const allPosts=()=>[...S.myPosts,...POSTS];
let feedFilter='para';
function renderFeed(){
 const st=STORIES.map((s,i)=>`<button class="story" data-story="${i}"><div class="ring ${S.seen[s.u]?'seen':''}"><img src="${uAv(s.u)}" alt=""></div><span>${esc(uHandle(s.u))}</span></button>`).join('');
 let list=allPosts();if(feedFilter==='sig')list=list.filter(p=>p.u==='me'||S.follow[p.u]);if(feedFilter==='grp')list=list.filter(p=>p.group);
 $('#view').innerHTML=`<div class="stories"><button class="story" data-mystory><div class="ring ${S.myStory.length?'':'seen'}"><img src="${uAv('me')}" alt=""><span class="add">+</span></div><span>Tu historia</span></button><button class="story" data-live><div class="ring"><img src="v/v4.jpg"><span class="live">EN VIVO</span></div><span>carlitos.d</span></button>${st}</div>
 ${S.welcome?'':`<div class="welcome"><button class="x" data-welcome>×</button><b>👋 Bienvenido a Vibra (demo)</b><br>Muro y grupos como Facebook · historias y fotos como Instagram · videos deslizables como TikTok. <br>Prueba: <b>doble toque</b> en una foto ❤️, <b>mantén pulsado</b> “Me gusta” para reaccionar y abre <b>Videos</b> abajo.</div>`}
 <div class="chips"><button class="chip ${feedFilter==='para'?'on':''}" data-ff="para">✨ Para ti</button><button class="chip ${feedFilter==='sig'?'on':''}" data-ff="sig">Siguiendo</button><button class="chip ${feedFilter==='grp'?'on':''}" data-ff="grp">Grupos</button><button class="chip" data-tabgo="videos">▶ Videos</button><button class="chip" data-tabgo="comunidad">🛍️ Marketplace</button></div>
 <div class="compose"><img class="av" src="${uAv('me')}"><button class="fake" data-compose>¿Qué estás pensando?</button><button class="ib" data-compose="photo" title="Foto">🖼️</button></div>
 ${list.map(postHTML).join('')||'<div class="empty">Aún no hay publicaciones aquí. ¡Sigue a más gente!</div>'}<div class="empty">Ya viste todo por hoy 🎉</div>`;
 const v=$('#view');v.querySelector('.stories').scrollLeft=0;
 $$('.carousel',v).forEach(c=>c.addEventListener('scroll',()=>{const n=Math.round(c.scrollLeft/c.clientWidth)+1;const cnt=c.parentNode.querySelector('.cnt');if(cnt)cnt.textContent=n+'/'+c.children.length},{passive:true}));
}
const findPost=id=>allPosts().find(p=>p.id===id);
function rerenderPost(id){const el=$('#post-'+id);if(el){const sc=el.querySelector('.carousel')?.scrollLeft;el.outerHTML=postHTML(findPost(id));if(sc){const c=$('#post-'+id+' .carousel');c.scrollLeft=sc}}}
function setReact(id,e){if(S.react[id]===e||e===null)delete S.react[id];else S.react[id]=e;save();rerenderPost(id)}
function heartBurst(media){const b=media.querySelector('.burst');b.classList.remove('go');void b.offsetWidth;b.classList.add('go')}

// long-press reactions + double tap
let lp,lpFired=false,lastTap={};
document.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-like]');if(!b)return;lpFired=false;lp=setTimeout(()=>{lpFired=true;showRx(b)},430)});
['pointerup','pointercancel','pointerleave'].forEach(ev=>document.addEventListener(ev,()=>clearTimeout(lp)));
document.addEventListener('contextmenu',e=>{if(e.target.closest('[data-like],.media'))e.preventDefault()});
function showRx(b){$$('.rxbar').forEach(x=>x.remove());const bar=document.createElement('div');bar.className='rxbar';bar.innerHTML=RX.map(r=>`<button data-rx="${r[0]}" title="${r[1]}">${r[0]}</button>`).join('');b.closest('.acts').style.position='relative';b.closest('.acts').appendChild(bar);bar.dataset.id=b.dataset.like;if(navigator.vibrate)navigator.vibrate(15)}

$('#view').addEventListener('click',async e=>{
 const t=e.target;let b;
 if(b=t.closest('[data-rx]')){const id=b.parentNode.dataset.id;setReact(id,b.dataset.rx);b.parentNode.remove();return}
 $$('.rxbar').forEach(x=>x.remove());
 if(b=t.closest('[data-like]')){if(lpFired){lpFired=false;return}setReact(b.dataset.like,S.react[b.dataset.like]?null:'👍');return}
 if(b=t.closest('[data-dbl]')){const id=b.dataset.dbl,now=Date.now();if(now-(lastTap[id]||0)<320){heartBurst(b);if(S.react[id]!=='❤️'){S.react[id]='❤️';save();setTimeout(()=>rerenderPost(id),650)}lastTap[id]=0}else lastTap[id]=now;return}
 if(b=t.closest('[data-cm]'))return openComments(b.dataset.cm);
 if(b=t.closest('[data-sh]'))return openShare(b.dataset.sh);
 if(b=t.closest('[data-sv]')){const id=b.dataset.sv;S.saved[id]=S.saved[id]?0:1;save();rerenderPost(id);toast(S.saved[id]?'Guardado en tu colección 📌':'Quitado de guardados');return}
 if(b=t.closest('[data-fol]')){const u=b.dataset.fol;S.follow[u]=S.follow[u]?0:1;save();$$(`[data-fol=${u}]`).forEach(x=>{x.classList.toggle('on',!!S.follow[u]);x.textContent=S.follow[u]?'Siguiendo':'Seguir'});return}
 if(b=t.closest('[data-del]')){if(confirm('¿Borrar esta publicación?')){S.myPosts=S.myPosts.filter(p=>p.id!==b.dataset.del);save();tab==='perfil'?renderProfile():renderFeed()}return}
 if(b=t.closest('[data-vote]')){const[id,i]=b.dataset.vote.split(':');S.votes[id]=S.votes[id]==+i?undefined:+i;save();rerenderPost(id);return}
 if(b=t.closest('[data-story]'))return openStory(+b.dataset.story);
 if(t.closest('[data-mystory]'))return S.myStory.length?openStory(-1):createStory();
 if(t.closest('[data-live]'))return openLive();
 if(t.closest('[data-welcome]')){S.welcome=1;save();t.closest('.welcome').remove();return}
 if(b=t.closest('[data-ff]')){feedFilter=b.dataset.ff;renderFeed();return}
 if(b=t.closest('[data-tabgo]')){if(b.dataset.tabgo==='comunidad')comTab='mk';go(b.dataset.tabgo);return}
 if(b=t.closest('[data-compose]'))return openComposer(b.dataset.compose==='photo');
 if(b=t.closest('[data-mk]'))return openMarket(b.dataset.mk);
 if(b=t.closest('[data-join]')){const g=b.dataset.join;S.joined[g]=S.joined[g]?0:1;save();b.className='btn sm '+(S.joined[g]?'':'blue');b.textContent=S.joined[g]?'✓ Unido':'Unirse';toast(S.joined[g]?'Te uniste al grupo 🎉':'Saliste del grupo');return}
 if(b=t.closest('[data-go]')){const ev=b.dataset.go;S.going[ev]=S.going[ev]?0:1;save();b.className='btn sm '+(S.going[ev]?'':'pri');b.textContent=S.going[ev]?'★ Me interesa':'Me interesa';return}
 if(b=t.closest('[data-seg]')){comTab=b.dataset.seg;renderCom();return}
 if(b=t.closest('[data-ptab]')){profTab=b.dataset.ptab;renderProfile();return}
 if(b=t.closest('[data-edit]'))return openEditProfile();
 if(b=t.closest('[data-openpost]'))return openPostSheet(b.dataset.openpost);
 if(b=t.closest('[data-openvid]')){startVid=b.dataset.openvid;go('videos');return}
 if(b=t.closest('[data-sharelink]'))return shareApp();
});

/* ---------- comments / share ---------- */
function commentsFor(id){const seed=CMTS.filter((_,i)=>(id.charCodeAt(id.length-1)+i)%2===0).slice(0,3);return [...seed.map(c=>({u:c[0],t:c[1],w:'1 h'})),...(S.comments[id]||[])]}
function openComments(id){
 const draw=()=>{const cs=commentsFor(id);return `${head(fmt(((findPost(id)||VIDEOS.find(v=>v.id===id)||{}).cm||0)+(S.comments[id]||[]).length)+' comentarios')}<div class="sh-c" id="cml">${cs.map(c=>`<div class="cm"><img class="av sm" src="${uAv(c.u)}"><div><b>${esc(uHandle(c.u))}</b> ${esc(c.t)}<small>${c.w} · Responder</small></div><div class="lk">${ic('heart')}</div></div>`).join('')}</div><div class="emojis">${['❤️','🙌','🔥','👏','😢','😍','😮','😂'].map(e=>`<button data-em="${e}">${e}</button>`).join('')}</div><form class="inbar"><img class="av sm" src="${uAv('me')}"><input placeholder="Añade un comentario…" maxlength="300"><button class="snd">Publicar</button></form>`};
 openSheet(draw(),{mount:root=>{root.style.height='70dvh';const f=$('form',root),inp=$('input',root);
  root.onclick=e=>{const b=e.target.closest('[data-em]');if(b){inp.value+=b.dataset.em;inp.focus()}};
  f.onsubmit=e=>{e.preventDefault();const v=inp.value.trim();if(!v)return;(S.comments[id]=S.comments[id]||[]).push({u:'me',t:v,w:'Ahora'});save();root.innerHTML=draw();openComments(id);if(findPost(id))rerenderPost(id);toast('Comentario publicado')}}});
}
function openShare(id){
 const url=location.href.split('#')[0];const txt=encodeURIComponent('Mira esto en Vibra 👉 '+url);
 openSheet(`${head('Compartir')}<div class="sharegrid">
 <button data-s="wa"><i style="background:#25d366">💬</i>WhatsApp</button><button data-s="story"><i style="background:var(--g)">＋</i>Tu historia</button><button data-s="feed"><i style="background:var(--blue)">↻</i>Compartir ahora</button><button data-s="copy"><i style="background:#6b7280">🔗</i>Copiar enlace</button>
 <button data-s="msg"><i style="background:#7b2ff7">✉️</i>Enviar por chat</button><button data-s="grp"><i style="background:#ff7a18">👥</i>En un grupo</button><button data-s="more"><i style="background:#111">⋯</i>Más</button></div>`,{mount:root=>root.onclick=async e=>{const b=e.target.closest('[data-s]');if(!b)return;const s=b.dataset.s;
  if(s==='wa')window.open('https://wa.me/?text='+txt,'_blank');
  else if(s==='copy'){try{await navigator.clipboard.writeText(url);toast('Enlace copiado')}catch(_){toast(url)}}
  else if(s==='more'){if(navigator.share)navigator.share({title:'Vibra',url}).catch(()=>{});else toast('Tu navegador no admite compartir')}
  else if(s==='story'){const p=findPost(id);const im=p&&p.imgs?p.imgs[0]:(VIDEOS.find(v=>v.id===id)?'v/'+id+'.jpg':'p1019');S.myStory.push([im,'Compartido 🔁']);save();toast('Añadido a tu historia');if(tab==='inicio')renderFeed()}
  else toast({feed:'Compartido en tu muro ✅',msg:'Enviado a Lucía 💬',grp:'Compartido en "Viajeros low cost" 👥'}[s]);
  closeSheet()}});
}
function shareApp(){const url=location.href.split('#')[0];if(navigator.share)navigator.share({title:'Vibra (demo)',text:'Prueba esta demo: Facebook + Instagram + TikTok en una sola app',url}).catch(()=>{});else window.open('https://wa.me/?text='+encodeURIComponent('Prueba esta demo 👉 '+url),'_blank')}

/* ---------- stories ---------- */
let stTimer=null;
function openStory(i){
 const list=STORIES.map(s=>({u:s.u,items:s.items,t:s.t}));if(S.myStory.length)list.unshift({u:'me',items:S.myStory,t:'Ahora'});
 let si=i===-1?0:i+(S.myStory.length?1:0),ii=0,start=0,paused=false,elapsed=0;const DUR=5000;const ov=$('#overlay');
 const close=()=>{cancelAnimationFrame(stTimer);ov.classList.remove('on');ov.innerHTML='';if(tab==='inicio')renderFeed()};
 function show(){const s=list[si];if(!s)return close();S.seen[s.u]=1;save();const it=s.items[ii];const liked=S.react['st-'+s.u+ii];
  ov.innerHTML=`<img class="st-img" src="${it[0].startsWith('data:')||it[0].startsWith('v/')?it[0]:img(it[0])}"><div class="st-bars">${s.items.map((_,k)=>`<i><b style="width:${k<ii?100:0}%"></b></i>`).join('')}</div>
  <div class="st-head"><img class="av sm" src="${uAv(s.u)}"><b>${esc(uHandle(s.u))}</b><small>${s.t}</small><button class="x" data-c>${ic('x')}</button></div>${it[1]?`<div class="st-txt">${esc(it[1])}</div>`:''}
  <div class="st-tap l" data-p></div><div class="st-tap r" data-n></div>
  <form class="st-foot">${s.u==='me'?`<button type="button" class="btn sm" data-addst style="font-size:14px">＋ Añadir</button><span style="color:#fff;font-size:13px;flex:1">👁 ${12+ii*7} visualizaciones</span>`:`<input placeholder="Responder a ${esc(uHandle(s.u))}…"><button type="button" class="h ${liked?'on':''}" data-h>${ic('heart')}</button><button type="button" data-q="😂">😂</button><button type="button" data-q="🔥">🔥</button>`}</form>`;
  elapsed=0;start=performance.now();paused=false;tick()}
 function tick(){cancelAnimationFrame(stTimer);const bar=ov.querySelectorAll('.st-bars b')[ii];stTimer=requestAnimationFrame(function f(now){if(!paused){const p=Math.min(1,(elapsed+now-start)/DUR);if(bar)bar.style.width=p*100+'%';if(p>=1)return next()}stTimer=requestAnimationFrame(f)})}
 function next(){const s=list[si];if(ii<s.items.length-1)ii++;else{si++;ii=0}show()}
 function prev(){if(ii>0)ii--;else if(si>0){si--;ii=0}show()}
 function pause(){if(!paused){paused=true;elapsed+=performance.now()-start}}
 function resume(){if(paused){paused=false;start=performance.now()}}
 ov.onclick=e=>{const t=e.target;if(t.closest('[data-c]'))return close();if(t.closest('[data-n]'))return next();if(t.closest('[data-p]'))return prev();
  if(t.closest('[data-h]')){const k='st-'+list[si].u+ii;S.react[k]=S.react[k]?0:1;save();t.closest('[data-h]').classList.toggle('on');return}
  if(t.closest('[data-q]')){toast('Reacción enviada '+t.closest('[data-q]').dataset.q);return}
  if(t.closest('[data-addst]')){close();createStory();return}};
 ov.onfocusin=pause;ov.onfocusout=resume;
 ov.onsubmit=e=>{e.preventDefault();const inp=$('input',ov);if(inp.value.trim()){toast('Mensaje enviado a '+uHandle(list[si].u)+' 💬');inp.value='';inp.blur()}};
 ov.classList.add('on');show();
}
async function createStory(){openSheet(`${head('Crear historia')}<div class="opts"><button data-o="pick"><i>🖼️</i><div>Subir foto<small>Elige una foto de tu galería</small></div></button><button data-o="txt"><i style="background:var(--g);color:#fff">Aa</i><div>Solo texto<small>Fondo de color con tu frase</small></div></button></div>`,{mount:r=>r.onclick=async e=>{const b=e.target.closest('[data-o]');if(!b)return;
 if(b.dataset.o==='pick'){const d=await pickImage();const cap=prompt('Texto para la historia (opcional)')||'';S.myStory.push([d,cap])}else{const cap=prompt('Escribe tu frase');if(!cap)return;S.myStory.push([textCard(cap),''])}
 save();closeSheet();toast('Historia publicada ✨ (24 h)');if(tab==='inicio')renderFeed()}})}
function textCard(t){const c=document.createElement('canvas');c.width=540;c.height=960;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,540,960);g.addColorStop(0,'#ff2d78');g.addColorStop(.5,'#ff7a18');g.addColorStop(1,'#7b2ff7');x.fillStyle=g;x.fillRect(0,0,540,960);x.fillStyle='#fff';x.font='bold 44px sans-serif';x.textAlign='center';const w=t.split(' ');let line='',y=420,lines=[];w.forEach(z=>{if(x.measureText(line+z).width>440){lines.push(line);line=''}line+=z+' '});lines.push(line);y=480-lines.length*28;lines.forEach(l=>{x.fillText(l.trim(),270,y);y+=58});return c.toDataURL('image/jpeg',.8)}

/* ---------- live ---------- */
function openLive(){
 const ov=$('#overlay');let n=1243;const names=Object.keys(U);const msgs=['¡Hola desde Madrid! 👋','🔥🔥🔥','Saludos!!','¿Qué cámara usas?','Jajaja 😂','Te sigo desde hace años 💜','¡Increíble!','👏👏','Primera vez en un directo 😍','Saluda a mi madre 🙈'];
 ov.innerHTML=`<video class="st-img" src="v/v4.mp4" autoplay muted loop playsinline></video><div class="st-head"><img class="av sm" src="${uAv('u6')}"><b>carlitos.d</b><span class="live-tag">EN VIVO</span><span class="live-v" id="lvn">👁 ${fmt(n)}</span><button class="x" data-c>${ic('x')}</button></div><div class="live-cm" id="lcm"></div><div class="hearts" id="lh"></div>
 <form class="st-foot"><input placeholder="Comenta…"><button type="button" data-g title="Regalo">🎁</button><button type="button" class="h" data-h>${ic('heart')}</button></form>`;
 ov.classList.add('on');const cm=$('#lcm'),hs=$('#lh');
 const add=(u,m)=>{const d=document.createElement('div');d.innerHTML=`<b>${esc(uHandle(u))}</b>${esc(m)}`;cm.appendChild(d);if(cm.children.length>14)cm.firstChild.remove()};
 const heart=()=>{const s=document.createElement('span');s.textContent=['❤️','💜','💖','🧡','💗'][Math.random()*5|0];s.style.setProperty('--dx',(Math.random()*60-30)+'px');hs.appendChild(s);setTimeout(()=>s.remove(),2200)};
 const iv=setInterval(()=>{add(names[Math.random()*names.length|0],msgs[Math.random()*msgs.length|0]);n+=Math.random()*20-6|0;$('#lvn').textContent='👁 '+fmt(n);if(Math.random()<.6)heart()},1100);
 ov.onclick=e=>{const t=e.target;if(t.closest('[data-c]')){clearInterval(iv);ov.classList.remove('on');ov.innerHTML='';return}
  if(t.closest('[data-h]')){for(let i=0;i<3;i++)setTimeout(heart,i*120);return}
  if(t.closest('[data-g]')){const g=document.createElement('div');g.className='gift';g.innerHTML=`<img class="av sm" src="${uAv('me')}"><div><b>${esc(uHandle('me'))}</b><br>envió una 🌹 Rosa</div>`;ov.appendChild(g);setTimeout(()=>g.remove(),2600);return}};
 ov.onsubmit=e=>{e.preventDefault();const i=$('input',ov);if(i.value.trim()){add('me',i.value.trim());i.value=''}};
}

/* ---------- videos ---------- */
let muted=true,startVid=null,io=null;
function stopVideos(){$$('video').forEach(v=>v.pause());io&&io.disconnect()}
function renderVideos(){
 const v=$('#view');let order=[...VIDEOS];if(startVid){const k=order.findIndex(x=>x.id===startVid);order=[...order.slice(k),...order.slice(0,k)];startVid=null}
 v.innerHTML=`<div class="vfeed" id="vf">${[...order,...order].map((x,i)=>{const lk=S.vlike[x.id];const cm=(S.comments[x.id]||[]).length;return `<section class="vitem" data-vid="${x.id}"><video src="v/${x.src}.mp4" poster="v/${x.src}.jpg" loop playsinline muted preload="${i<2?'auto':'none'}"></video><div class="shade"></div><div class="paused">${ic('pause')}</div><span class="burst">❤️</span><div class="credit">${esc(x.cr)}</div>
 <div class="rail"><button class="me" data-vfol="${x.u}"><img src="${uAv(x.u)}"><i class="${S.follow[x.u]?'ok':''}">${S.follow[x.u]?'✓':'+'}</i></button><button class="${lk?'on':''}" data-vl="${x.id}">${ic('heart')}<span>${fmt(x.likes+(lk?1:0))}</span></button><button data-cm="${x.id}">${ic('comment')}<span>${fmt(x.cm+cm)}</span></button><button class="${S.vsaved[x.id]?'sv':''}" data-vs="${x.id}">${ic('bookmark')}<span>Guardar</span></button><button data-sh="${x.id}">${ic('share')}<span>${fmt(x.sh)}</span></button><div class="disc" style="background-image:url(${uAv(x.u)})"></div></div>
 <div class="vinfo"><b>@${esc(uHandle(x.u))}</b><div>${hashtags(x.cap)}</div><div class="mus"><span>♪ ${esc(x.mus)}</span></div></div><div class="prog"><i></i></div></section>`}).join('')}</div>
 <div class="vtabs"><button class="live" data-live>LIVE</button><span>Siguiendo</span><b>Para ti</b></div><button class="vsound" id="vsnd">${ic(muted?'mute':'vol')}</button>`;
 const vf=$('#vf');
 io=new IntersectionObserver(es=>es.forEach(en=>{const vid=en.target.querySelector('video');if(en.isIntersecting&&en.intersectionRatio>.6){vid.muted=muted;vid.preload='auto';vid.currentTime=0;vid.play().catch(()=>{muted=true;vid.muted=true;vid.play().catch(()=>{})});en.target.classList.remove('isp');const nx=en.target.nextElementSibling;if(nx)nx.querySelector('video').preload='auto'}else{vid.pause()}}),{root:vf,threshold:[0,.6,1]});
 $$('.vitem',vf).forEach(s=>{io.observe(s);const vid=s.querySelector('video'),pr=s.querySelector('.prog i');vid.addEventListener('timeupdate',()=>{pr.style.width=(vid.currentTime/vid.duration*100||0)+'%'})});
 $('#vsnd').onclick=()=>{muted=!muted;$('#vsnd').innerHTML=ic(muted?'mute':'vol');$$('video',vf).forEach(x=>x.muted=muted);toast(muted?'Sonido desactivado':'Sonido activado 🔊')};
 let tapT=null,last=0;
 vf.onclick=e=>{const t=e.target;let b;const sec=t.closest('.vitem');
  if(b=t.closest('[data-vl]')){const id=b.dataset.vl;S.vlike[id]=S.vlike[id]?0:1;save();refreshRail(id);return}
  if(b=t.closest('[data-vs]')){const id=b.dataset.vs;S.vsaved[id]=S.vsaved[id]?0:1;save();refreshRail(id);toast(S.vsaved[id]?'Video guardado ⭐':'Quitado de guardados');return}
  if(b=t.closest('[data-vfol]')){const u=b.dataset.vfol;S.follow[u]=1;save();$$(`[data-vfol=${u}] i`,vf).forEach(i=>{i.className='ok';i.textContent='✓'});toast('Ahora sigues a @'+uHandle(u));return}
  if(t.closest('.rail,.vinfo')&&!t.closest('.vinfo'))return;
  if(!sec)return;const now=Date.now();
  if(now-last<300){clearTimeout(tapT);last=0;const id=sec.dataset.vid;heartBurst(sec);if(!S.vlike[id]){S.vlike[id]=1;save();refreshRail(id)}return}
  last=now;tapT=setTimeout(()=>{const vid=sec.querySelector('video');if(vid.paused){vid.play();sec.classList.remove('isp')}else{vid.pause();sec.classList.add('isp')}},300)};
 function refreshRail(id){const x=VIDEOS.find(v=>v.id===id);$$(`[data-vl=${id}]`,vf).forEach(b=>{b.classList.toggle('on',!!S.vlike[id]);b.querySelector('span').textContent=fmt(x.likes+(S.vlike[id]?1:0))});$$(`[data-vs=${id}]`,vf).forEach(b=>b.classList.toggle('sv',!!S.vsaved[id]))}
}

/* ---------- comunidad ---------- */
let comTab='grp';
function renderCom(){
 let c='';
 if(comTab==='grp')c=`<div class="sec"><h3>Tus grupos y sugerencias</h3>${GROUPS.map(g=>`<div class="group"><img src="${img(g.img)}"><div><b>${esc(g.n)}</b><small>${g.m} · ${g.d}</small></div><button class="btn sm ${S.joined[g.id]?'':'blue'}" data-join="${g.id}">${S.joined[g.id]?'✓ Unido':'Unirse'}</button></div>`).join('')}</div>
  <div class="sec"><h3>Publicaciones de grupos</h3></div>${POSTS.filter(p=>p.group).map(postHTML).join('')}`;
 if(comTab==='mk')c=`<div class="sec"><h3>Marketplace · Cerca de ti</h3><div class="mk">${MARKET.map(m=>`<button class="it" data-mk="${m.id}"><img src="${img(m.img)}" loading="lazy"><div><b>${m.p}</b>${esc(m.n)}<br><small>📍 ${m.l}</small></div></button>`).join('')}</div></div>`;
 if(comTab==='ev')c=`<div class="sec"><h3>Eventos para ti</h3>${EVENTS.map(ev=>`<div class="ev"><div class="date">${ev.d}<small>${ev.mo}</small></div><div class="t"><b>${esc(ev.n)}</b><small>${ev.w} · ${fmt(ev.g+(S.going[ev.id]?1:0))} interesados</small></div><button class="btn sm ${S.going[ev.id]?'':'pri'}" data-go="${ev.id}">${S.going[ev.id]?'★ Me interesa':'Me interesa'}</button></div>`).join('')}</div>`;
 $('#view').innerHTML=`<div class="seg"><button class="${comTab==='grp'?'on':''}" data-seg="grp">👥 Grupos</button><button class="${comTab==='mk'?'on':''}" data-seg="mk">🛍️ Marketplace</button><button class="${comTab==='ev'?'on':''}" data-seg="ev">📅 Eventos</button></div>${c}`;
}
function openMarket(id){const m=MARKET.find(x=>x.id===id);openSheet(`${head('Marketplace')}<div class="sh-c" style="padding:0"><img src="${img(m.img)}" style="width:100%;aspect-ratio:1.3;object-fit:cover"><div style="padding:14px"><h2 style="font-size:20px">${esc(m.n)}</h2><b style="font-size:22px;color:var(--acc)">${m.p}</b><p style="color:var(--mut);margin:6px 0 14px">📍 ${m.l} · Publicado hace 3 días · Buen estado</p><div class="ph" style="padding:0 0 14px"><img class="av" src="${uAv(m.u)}"><div class="who"><b>${esc(uName(m.u))}</b><small>⭐ 4,9 · Responde en 1 h</small></div></div><button class="btn blue full" data-ask>💬 “Hola, ¿sigue disponible?”</button></div></div>`,{mount:r=>{const a=$('[data-ask]',r);a.onclick=()=>{const ch=chatFor(m.u);ch.msgs.push(['me','Hola, ¿sigue disponible el artículo "'+m.n+'"?']);persistChats();closeSheet();setTimeout(()=>openChat(ch.id,true),280)}}})}

/* ---------- create ---------- */
function openCreate(){openSheet(`${head('Crear')}<div class="opts">
 <button data-o="post"><i>📝</i><div>Publicación<small>Texto, foto o fondo de color · Muro</small></div></button>
 <button data-o="photo"><i>🖼️</i><div>Foto<small>Comparte una imagen con tus seguidores</small></div></button>
 <button data-o="story"><i style="background:var(--g);color:#fff">◎</i><div>Historia<small>Desaparece en 24 horas</small></div></button>
 <button data-o="video"><i>🎬</i><div>Video corto<small>Graba o sube un clip vertical</small></div></button>
 <button data-o="live"><i style="background:#ff1f4b;color:#fff">●</i><div>Transmitir en vivo<small>Mira cómo se ve un directo</small></div></button>
 <button data-o="sell"><i>🏷️</i><div>Vender en Marketplace<small>Publica un artículo con precio</small></div></button></div>`,{mount:r=>r.onclick=e=>{const b=e.target.closest('[data-o]');if(!b)return;const o=b.dataset.o;
 if(o==='post')openComposer(false);else if(o==='photo')openComposer(true);else if(o==='story')createStory();else if(o==='live'){closeSheet();openLive()}
 else if(o==='video'){closeSheet();toast('En la demo los videos son de ejemplo. La app real permitirá grabar y editar 🎬')}else{closeSheet();toast('Disponible en la versión completa 🏷️')}}})}
const BGS=['','linear-gradient(135deg,#7b2ff7,#f107a3)','linear-gradient(135deg,#ff7a18,#ff2d78)','linear-gradient(135deg,#00c6ff,#0072ff)','linear-gradient(135deg,#11998e,#38ef7d)','#111'];
function openComposer(withPhoto){let bg='',im=null;
 const draw=()=>`${head('Crear publicación')}<div class="sh-c"><div class="ph" style="padding:0 0 10px"><img class="av" src="${uAv('me')}"><div class="who"><b>${esc(uName('me'))}</b><small>🌎 Público</small></div><button class="btn pri sm" data-pub>Publicar</button></div>
 <textarea class="big" placeholder="¿Qué estás pensando?" maxlength="500" style="${bg&&!im?`background:${bg};color:#fff;font-weight:800;text-align:center;border-radius:12px;padding:30px 14px;font-size:22px`:''}"></textarea>
 ${im?'':`<div class="colors">${BGS.map((b,i)=>`<button data-bg="${i}" class="${b===bg?'on':''}" style="background:${b||'#fff'}">${b?'':'Aa'}</button>`).join('')}</div>`}
 <div class="prev">${im?`<img src="${im}"><button class="btn sm" data-rmimg style="margin-top:6px">Quitar foto</button>`:''}</div>
 <div class="opts" style="margin:10px -14px 0"><button data-addimg><i>🖼️</i><div>Foto<small>Desde tu galería o cámara</small></div></button></div></div>`;
 const mount=r=>{const ta=$('textarea',r);
  r.onclick=async e=>{const b=e.target;const keep=ta.value;
   if(b.closest('[data-bg]')){bg=BGS[+b.closest('[data-bg]').dataset.bg];r.innerHTML=draw();mount(r);$('textarea',r).value=keep;return}
   if(b.closest('[data-addimg]')){im=await pickImage();bg='';r.innerHTML=draw();mount(r);$('textarea',r).value=keep;return}
   if(b.closest('[data-rmimg]')){im=null;r.innerHTML=draw();mount(r);$('textarea',r).value=keep;return}
   if(b.closest('[data-pub]')){const t=ta.value.trim();if(!t&&!im)return toast('Escribe algo o añade una foto');
    const p={id:'my'+Date.now(),u:'me',t:'Ahora',text:t,likes:0,cm:0,sh:0};if(im){p.type='photo';p.imgs=[im]}else if(bg){p.type='color';p.bg=bg}else p.type='text';
    S.myPosts.unshift(p);save();closeSheet();feedFilter='para';go('inicio');toast('¡Publicado! 🎉')}}};
 openSheet(draw(),{full:true,mount});
 if(withPhoto)pickImage().then(d=>{im=d;const r=$('#sheetBody');const keep=$('textarea',r)?.value||'';r.innerHTML=draw();mount(r);$('textarea',r).value=keep})}

/* ---------- profile ---------- */
let profTab='posts';
function renderProfile(){const my=S.myPosts;const pr=S.profile;
 const nPosts=my.length;const fol=Object.values(S.follow).filter(Boolean).length;
 let grid='';
 if(profTab==='posts')grid=my.length?`<div class="grid">${my.map(p=>`<button data-openpost="${p.id}">${p.imgs?`<img src="${srcOf(p.imgs[0])}">`:`<div class="tx" style="background:${p.bg||'linear-gradient(135deg,#999,#555)'}">${esc(p.text.slice(0,60))}</div>`}</button>`).join('')}</div>`:`<div class="empty">📷<br><b>Aún no publicaste nada</b><br>Toca el botón <b>＋</b> para crear tu primera publicación.</div>`;
 if(profTab==='vids'){const vs=VIDEOS.filter(v=>S.vlike[v.id]);grid=vs.length?`<div class="grid tall">${vs.map(v=>`<button data-openvid="${v.id}"><img src="v/${v.src}.jpg"><span class="vv">▶ ${fmt(v.likes+1)}</span></button>`).join('')}</div>`:'<div class="empty">❤️ Los videos que te gusten aparecerán aquí.</div>'}
 if(profTab==='saved'){const ps=allPosts().filter(p=>S.saved[p.id]&&p.imgs),vs=VIDEOS.filter(v=>S.vsaved[v.id]);grid=(ps.length||vs.length)?`<div class="grid">${ps.map(p=>`<button data-openpost="${p.id}"><img src="${srcOf(p.imgs[0])}"></button>`).join('')}${vs.map(v=>`<button data-openvid="${v.id}"><img src="v/${v.src}.jpg"><span class="vv">▶</span></button>`).join('')}</div>`:'<div class="empty">📌 Guarda fotos y videos con el icono de marcador.</div>'}
 $('#view').innerHTML=`<div class="prof"><div class="row"><div class="ring" style="width:92px;height:92px;flex:none"><img src="${uAv('me')}"></div><div class="nums"><div><b>${nPosts}</b>Publicaciones</div><div><b>${fmt(128+nPosts*3)}</b>Seguidores</div><div><b>${fol}</b>Seguidos</div></div></div>
 <h2>${esc(pr.name)} <small style="color:var(--mut);font-weight:400">@${esc(pr.handle)}</small></h2><p>${esc(pr.bio)}</p>
 <div class="btns"><button class="btn" data-edit>Editar perfil</button><button class="btn" data-sharelink>Compartir perfil</button></div></div>
 <div class="hl">${[['p1015','Viajes'],['p1080','Comida'],['p1025','Mascotas'],['p177','Rutas'],['p164','Ciudad']].map(h=>`<div><img src="${img(h[0])}"><br>${h[1]}</div>`).join('')}</div>
 <div class="ptabs"><button class="${profTab==='posts'?'on':''}" data-ptab="posts">▦ Publicaciones</button><button class="${profTab==='vids'?'on':''}" data-ptab="vids">▶ Me gusta</button><button class="${profTab==='saved'?'on':''}" data-ptab="saved">🔖 Guardado</button></div>${grid}
 <div class="empty" style="font-size:12px">Demo de Vibra · Tus publicaciones se guardan solo en este móvil.<br>Videos de ejemplo: Blender Foundation (CC BY). Fotos: Unsplash vía Picsum.<br><button class="btn sm" style="margin-top:10px" onclick="if(confirm('¿Borrar todos los datos de la demo?')){localStorage.removeItem('${KEY}');location.reload()}">Reiniciar demo</button></div>`}
function openEditProfile(){const p=S.profile;let av=p.avatar;openSheet(`${head('Editar perfil')}<div class="sh-c"><div style="text-align:center;margin-bottom:14px"><img class="av lg" id="eav" src="${uAv('me')}"><br><button class="btn sm" data-av style="margin-top:8px">Cambiar foto</button></div>
 <label class="field">Nombre<input id="en" value="${esc(p.name)}" maxlength="40"></label><label class="field">Usuario<input id="eh" value="${esc(p.handle)}" maxlength="24"></label><label class="field">Biografía<textarea id="eb" rows="3" maxlength="150">${esc(p.bio)}</textarea></label><button class="btn pri full" data-save>Guardar</button></div>`,{mount:r=>r.onclick=async e=>{
 if(e.target.closest('[data-av]')){av=await pickImage();$('#eav').src=av}
 if(e.target.closest('[data-save]')){S.profile={name:$('#en').value.trim()||'Tu Nombre',handle:($('#eh').value.trim()||'tu_usuario').replace(/[^\w.]/g,''),bio:$('#eb').value,avatar:av};save();closeSheet();renderProfile();toast('Perfil actualizado')}}})}
function openPostSheet(id){const p=findPost(id);openSheet(`${head('Publicación')}<div style="overflow-y:auto">${postHTML(p)}</div>`,{mount:r=>{r.onclick=e=>{const b=e.target.closest('[data-cm],[data-sh],[data-del]');if(!b)return;closeSheet();setTimeout(()=>{if(b.dataset.cm)openComments(id);else if(b.dataset.sh)openShare(id);else if(b.dataset.del){S.myPosts=S.myPosts.filter(x=>x.id!==id);save();renderProfile()}},260)}}})}

/* ---------- chats ---------- */
function persistChats(){S.chats={};CHATS.forEach(c=>S.chats[c.id]=c.msgs);save()}
CHATS.forEach(c=>{if(S.chats[c.id])c.msgs=S.chats[c.id]});
Object.keys(S.chats).forEach(k=>{if(!CHATS.find(c=>c.id===k))CHATS.push({id:k,u:k.slice(2),msgs:S.chats[k],un:0})});
function chatFor(u){let c=CHATS.find(x=>x.u===u);if(!c){c={id:'c-'+u,u,msgs:[],un:0};CHATS.unshift(c)}return c}
function openChats(){backFn=null;openSheet(`${head('Mensajes')}<div class="sh-c" style="padding:8px 0"><div style="padding:0 14px 8px"><input class="srch" placeholder="Buscar en mensajes"></div>
 <div class="stories" style="padding-top:4px">${['u1','u3','u5','u9','u12'].map(u=>`<button class="story" data-nc="${u}"><div class="ring seen" style="width:58px;height:58px"><img src="${uAv(u)}"></div><span>${esc(uName(u).split(' ')[0])}</span></button>`).join('')}</div>
 ${CHATS.map(c=>{const l=c.msgs[c.msgs.length-1]||['','Nuevo chat'];const un=c.un&&!S.read[c.id];return `<button class="chatl ${un?'unread':''}" data-ch="${c.id}"><img class="av" src="${uAv(c.u)}" style="width:52px;height:52px"><div><b>${esc(uName(c.u))}</b><small>${l[0]==='me'?'Tú: ':''}${esc(l[1])}</small></div>${un?'<span class="u"></span>':''}</button>`}).join('')}</div>`,{full:true,mount:r=>r.onclick=e=>{const b=e.target.closest('[data-ch],[data-nc]');if(!b)return;openChat(b.dataset.ch||chatFor(b.dataset.nc).id)}})}
function openChat(id,auto){const c=CHATS.find(x=>x.id===id);S.read[id]=1;save();updateBadges();backFn=openChats;
 openSheet(`${head(`<span style="display:inline-flex;align-items:center;gap:8px"><img class="av sm" src="${uAv(c.u)}">${esc(uName(c.u))}</span>`,1)}<div class="msgs" id="msgs">${c.msgs.map(m=>`<div class="msg ${m[0]==='me'?'me':''}">${esc(m[1])}</div>`).join('')}</div><div class="typing" id="typ"></div><form class="inbar"><button type="button" class="ib" data-cam style="width:36px;height:36px">📷</button><input placeholder="Mensaje…" maxlength="500"><button class="snd">Enviar</button></form>`,{full:true,mount:r=>{
 const box=$('#msgs',r),inp=$('input',r);box.scrollTop=1e9;
 const reply=()=>{$('#typ').textContent=uName(c.u).split(' ')[0]+' está escribiendo…';setTimeout(()=>{const t=REPLIES[Math.random()*REPLIES.length|0];c.msgs.push([c.u,t]);persistChats();if($('#msgs')){$('#typ').textContent='';box.insertAdjacentHTML('beforeend',`<div class="msg">${esc(t)}</div>`);box.scrollTop=1e9}},1500)};
 $('form',r).onsubmit=e=>{e.preventDefault();const t=inp.value.trim();if(!t)return;c.msgs.push(['me',t]);persistChats();box.insertAdjacentHTML('beforeend',`<div class="msg me">${esc(t)}</div>`);inp.value='';box.scrollTop=1e9;reply()};
 $('[data-cam]',r).onclick=()=>toast('Envío de fotos: disponible en la versión completa');
 if(auto)reply()}})}

/* ---------- notifs & search ---------- */
function openNotifs(){S.notifSeen=1;save();updateBadges();const N=[['u3','le encantó tu foto ❤️','p1025',1],['u9','empezó a seguirte.','',1],['u7','te mencionó en <b>Recetas fáciles</b>: “@tu_usuario mira esta tarta”','p1080',1],['u12','publicó un video nuevo 🎬','v/v1.jpg',0],['u1','reaccionó 😂 a tu comentario','',0],['u8','y 12 personas más comentaron en una publicación que sigues','p1015',0],['u5','compartió una historia nueva','',0]];
 openSheet(`${head('Notificaciones')}<div class="sh-c"><b>Nuevas</b>${N.map(n=>`<div class="notif ${n[3]?'new':''}"><img class="av" src="${uAv(n[0])}"><div><b>${esc(uHandle(n[0]))}</b> ${n[1]} <small>· ${n[3]?'2 h':'1 d'}</small></div>${n[2]?`<img class="th" src="${n[2].startsWith('v/')?n[2]:img(n[2])}">`:n[1].includes('seguirte')?`<button class="btn sm blue" onclick="this.textContent='Siguiendo';this.className='btn sm'">Seguir</button>`:''}</div>`).join('')}</div>`)}
function openSearch(){const tiles=[...POSTS.filter(p=>p.imgs).flatMap(p=>p.imgs.map(i=>({i,p:p.id}))),...VIDEOS.map(v=>({v}))].sort((a,b)=>(a.i||a.v.id).localeCompare(b.i||b.v.id));
 openSheet(`${head('Explorar')}<div class="sh-c" style="padding:10px 0 0"><div style="padding:0 14px 10px"><input class="srch" id="sq" placeholder="Buscar personas, #hashtags, grupos…"></div><div id="sr"></div><div class="grid" id="sg">${tiles.map(t=>t.v?`<button data-sv2="${t.v.id}"><img src="v/${t.v.src}.jpg"><span class="vv">▶ ${fmt(t.v.likes)}</span></button>`:`<button data-sp="${t.p}"><img src="${img(t.i)}" loading="lazy"></button>`).join('')}</div></div>`,{full:true,mount:r=>{
 $('#sq').oninput=e=>{const q=e.target.value.toLowerCase().trim();$('#sg').style.display=q?'none':'';if(!q){$('#sr').innerHTML='';return}
  const us=Object.keys(U).filter(u=>(U[u][0]+U[u][1]).toLowerCase().includes(q.replace('@','')));const gs=GROUPS.filter(g=>g.n.toLowerCase().includes(q));const hs=[...new Set(allPosts().concat(VIDEOS.map(v=>({text:v.cap}))).flatMap(p=>(p.text||'').match(/#[\wáéíóúñü]+/gi)||[]))].filter(h=>h.toLowerCase().includes(q.replace('#','')));
  $('#sr').innerHTML=[...us.map(u=>`<div class="chatl"><img class="av" src="${uAv(u)}"><div><b>${esc(U[u][1])}</b><small>${esc(U[u][0])}</small></div><button class="follow ${S.follow[u]?'on':''}" data-f2="${u}">${S.follow[u]?'Siguiendo':'Seguir'}</button></div>`),...gs.map(g=>`<div class="chatl"><img class="av" src="${img(g.img)}" style="border-radius:10px"><div><b>${esc(g.n)}</b><small>Grupo · ${g.m}</small></div></div>`),...hs.map(h=>`<div class="chatl"><span class="av" style="display:grid;place-items:center;font-weight:800;font-size:20px">#</span><div><b>${esc(h)}</b><small>Hashtag</small></div></div>`)].join('')||'<div class="empty">Sin resultados</div>'};
 r.onclick=e=>{let b;if(b=e.target.closest('[data-f2]')){const u=b.dataset.f2;S.follow[u]=S.follow[u]?0:1;save();b.classList.toggle('on');b.textContent=S.follow[u]?'Siguiendo':'Seguir';return}
  if(b=e.target.closest('[data-sv2]')){closeSheet();startVid=b.dataset.sv2;go('videos');return}
  if(b=e.target.closest('[data-sp]')){const id=b.dataset.sp;closeSheet();if(tab!=='inicio')go('inicio');feedFilter='para';renderFeed();setTimeout(()=>$('#post-'+id)?.scrollIntoView({behavior:'smooth'}),100)}}}})}

go('inicio');
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
