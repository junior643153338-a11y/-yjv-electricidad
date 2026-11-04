(function(){
  var b=document.querySelector('.burger'),m=document.getElementById('menu');
  if(b){b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú');});}
  var y=document.getElementById('y');if(y)y.textContent=new Date().getFullYear();
  document.querySelectorAll('form[data-quote]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();var ok=true,err=f.querySelector('.form-err');
      f.querySelectorAll('[required]').forEach(function(el){var bad=!el.value.trim();el.classList.toggle('bad',bad);if(bad&&ok){el.focus();}if(bad)ok=false;});
      err.hidden=ok;if(!ok)return;
      var d=new FormData(f),t='Hola Génesis, quiero solicitar un presupuesto.\n\n'+
        '*Nombre:* '+d.get('nombre')+'\n*Teléfono:* '+d.get('telefono')+'\n*Ciudad/Zona:* '+d.get('zona')+
        '\n*Servicio:* '+d.get('servicio')+(d.get('mensaje')?'\n*Mensaje:* '+d.get('mensaje'):'');
      window.open('https://wa.me/'+window.GENESIS_WA+'?text='+encodeURIComponent(t),'_blank','noopener');
    });
    f.addEventListener('input',function(e){if(e.target.value.trim())e.target.classList.remove('bad');});
  });
  var ba=document.querySelector('.ba');
  if(ba){var r=ba.querySelector('input');r.addEventListener('input',function(){ba.style.setProperty('--pos',r.value+'%');});}
  var fs=document.querySelectorAll('[data-f]');
  fs.forEach(function(c){c.addEventListener('click',function(){
    fs.forEach(function(x){x.classList.toggle('on',x===c);});
    document.querySelectorAll('.tile').forEach(function(t){t.hidden=!(c.dataset.f==='all'||t.dataset.cat===c.dataset.f);});
  });});
  
})();

(function(){
  var t=document.querySelector('.top');function sc(){t&&t.classList.toggle('scrolled',scrollY>10);}sc();addEventListener('scroll',sc,{passive:true});
  var m=document.getElementById('menu'),b=document.querySelector('.burger');
  if(m)m.addEventListener('click',function(e){if(e.target.closest('a')&&m.classList.contains('open')){m.classList.remove('open');b&&b.setAttribute('aria-expanded','false');}});
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var els=document.querySelectorAll('.sec .h2,.sec .sub,.why,.scard,.pcard,.svc,.split>*,.tile,.faq details,.tldr,.cbox,.qform');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el,i){if(el.closest('.hero'))return;el.classList.add('rv');el.style.transitionDelay=(i%4)*70+'ms';io.observe(el);});
})();
