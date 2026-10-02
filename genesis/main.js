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
