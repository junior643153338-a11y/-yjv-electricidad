/* Configuración compartida de Tekopora */
// Pegar aquí la URL de la aplicación web de Apps Script (termina en /exec). Vacío = los pedidos van por WhatsApp.
const API='';
const WA='595987642351';
const CITIES=['Asunción','San Lorenzo','Luque','Fernando de la Mora','Lambaré','Mariano Roque Alonso','Ñemby','Capiatá','Limpio','Villa Elisa','San Antonio','Itauguá'];
const S=[
 {id:'aire',i:'❄️',n:'Aire acondicionado',d:'Instalación y service',k:'aire split climatizacion clima frio gas',o:['Instalar un aire nuevo','Limpieza / mantenimiento (service)','Reparación: no enfría o hace ruido','Carga de gas','Mover el aire de lugar']},
 {id:'electricista',i:'⚡',n:'Electricistas',d:'Instalaciones y averías',k:'electricidad luz cable tablero toma enchufe corto',o:['Corte de luz o avería','Instalación eléctrica nueva','Tablero o llaves térmicas','Tomas, luces y ventiladores de techo','Revisión general']},
 {id:'plomero',i:'🚿',n:'Plomeros',d:'Pérdidas y destapaciones',k:'plomeria agua caño perdida destapar cloaca baño termocalefon',o:['Pérdida de agua','Destapación de cañerías o cloaca','Instalar inodoro, pileta o ducha','Termocalefón','Instalación de agua nueva']},
 {id:'albanil',i:'🧱',n:'Albañiles',d:'Construcción y ampliaciones',k:'albañileria construccion obra muro pared revoque contrapiso',o:['Construir o ampliar','Levantar un muro','Revoque o contrapiso','Arreglos menores','Quincho o parrilla']},
 {id:'banho',i:'🛁',n:'Reforma de baño',d:'Baño completo o parcial',k:'reforma baño ducha azulejo sanitario',o:['Reforma completa del baño','Cambiar azulejos / pisos','Cambiar sanitarios','Cambiar bañera por ducha']},
 {id:'cocina',i:'🍳',n:'Reforma de cocina',d:'Muebles, mesadas y más',k:'reforma cocina mesada granito muebles',o:['Reforma completa de cocina','Cambiar mesada','Muebles de cocina','Revestimiento / azulejos']},
 {id:'reforma',i:'🏠',n:'Reformas de casa',d:'Integral o por ambientes',k:'reforma casa vivienda remodelacion',o:['Reforma integral','Reformar un ambiente','Cambiar pisos','Cielorraso / durlock']},
 {id:'pintor',i:'🎨',n:'Pintores',d:'Interior y exterior',k:'pintura pintar pared fachada',o:['Pintar interior','Pintar exterior / fachada','Pintar rejas o aberturas','Pintar un ambiente']},
 {id:'techo',i:'🏚️',n:'Techos y humedad',d:'Goteras e impermeabilización',k:'techo gotera humedad impermeabilizacion tejas membrana',o:['Goteras','Impermeabilizar techo o losa','Humedad en paredes','Techo nuevo o cambio de tejas']},
 {id:'jardinero',i:'🌿',n:'Jardineros',d:'Pasto, poda y mantenimiento',k:'jardin jardineria pasto poda arbol',o:['Corte de pasto','Poda de árboles','Mantenimiento mensual','Diseño de jardín']},
 {id:'limpieza',i:'🧽',n:'Limpieza',d:'Casas, oficinas, fin de obra',k:'limpieza limpiar casa oficina',o:['Limpieza de casa','Limpieza de fin de obra','Limpieza de oficina','Limpieza de tapizados / alfombras']},
 {id:'fletes',i:'🚚',n:'Fletes y mudanzas',d:'Dentro y fuera de la ciudad',k:'flete mudanza traslado camion',o:['Mudanza completa','Flete de pocas cosas','Traslado de muebles','Retiro de escombros']},
 {id:'herrero',i:'🔩',n:'Herreros',d:'Rejas, portones, estructuras',k:'herreria rejas porton soldadura metal',o:['Rejas','Portón (manual o automático)','Estructura metálica / tinglado','Reparación y soldadura']},
 {id:'carpintero',i:'🪚',n:'Carpinteros',d:'Muebles a medida',k:'carpinteria madera mueble placard puerta',o:['Muebles a medida','Placares','Puertas','Reparación de muebles']},
 {id:'cerrajero',i:'🔑',n:'Cerrajeros',d:'Aperturas y cerraduras',k:'cerrajeria llave cerradura puerta',o:['Me quedé afuera (apertura)','Cambiar cerradura','Copia de llaves','Cerradura de auto']},
 {id:'electro',i:'🧊',n:'Heladeras y lavarropas',d:'Reparación de electrodomésticos',k:'heladera lavarropas electrodomestico freezer microondas',o:['Heladera / freezer','Lavarropas','Cocina / horno','Otro electrodoméstico']},
 {id:'fumigacion',i:'🐜',n:'Fumigación',d:'Control de plagas',k:'fumigacion plagas cucarachas termitas ratas mosquitos',o:['Cucarachas / hormigas','Termitas','Roedores','Mosquitos / dengue']},
 {id:'piscina',i:'🏊',n:'Piscinas',d:'Construcción y mantenimiento',k:'piscina pileta',o:['Construir una piscina','Mantenimiento / limpieza','Reparar pérdidas','Bomba y filtro']},
 {id:'solar',i:'☀️',n:'Paneles solares',d:'Energía solar',k:'panel solar energia fotovoltaica',o:['Instalar paneles solares','Termotanque solar','Mantenimiento','Solo asesoramiento']},
 {id:'aberturas',i:'🪟',n:'Vidriería y aluminio',d:'Ventanas, mamparas',k:'vidrio aluminio ventana mampara blindex aberturas',o:['Ventanas de aluminio','Mampara de baño','Cambiar vidrios','Puertas de blindex']},
 {id:'seguridad',i:'📹',n:'Cámaras y alarmas',d:'Seguridad para tu casa',k:'camaras seguridad alarma cerco electrico',o:['Instalar cámaras','Alarma','Cerco eléctrico','Portero / videoportero']},
 {id:'otro',i:'🛠️',n:'Otro servicio',d:'Contanos qué necesitás',k:'otro varios',o:[]}
];
async function api(a,data){
  const r=await fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({a},data))});
  return r.json();
}
const telWa=t=>{let d=String(t).replace(/\D/g,'');if(d.startsWith('595'))return d;return '595'+d.replace(/^0/,'')};
