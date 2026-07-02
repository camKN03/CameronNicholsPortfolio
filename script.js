(function(){
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = !window.matchMedia || window.matchMedia('(pointer:fine)').matches;

  /* live Zulu clock */
  var el=document.getElementById('clock');
  if(el){
    function pad(n){return String(n).padStart(2,'0');}
    function tick(){var d=new Date();el.textContent=pad(d.getUTCHours())+':'+pad(d.getUTCMinutes())+':'+pad(d.getUTCSeconds())+' Z';}
    tick();setInterval(tick,1000);
  }

  /* mobile nav */
  var btn=document.getElementById('menuBtn'), scrim=document.getElementById('scrim');
  function closeNav(){document.body.classList.remove('nav-open');}
  if(btn){btn.addEventListener('click',function(){document.body.classList.toggle('nav-open');});}
  if(scrim){scrim.addEventListener('click',closeNav);}
  document.querySelectorAll('#railnav a').forEach(function(a){a.addEventListener('click',closeNav);});

  /* inject live SIGNAL equalizer into the status bar */
  var sbRight=document.querySelector('.statusbar .sb-right');
  if(sbRight){
    var sig=document.createElement('span');
    sig.className='sb-hide';
    sig.innerHTML='<b>SIGNAL</b> <span class="sig"><i></i><i></i><i></i><i></i></span>';
    sbRight.insertBefore(sig, sbRight.firstChild);
  }

  /* hero boot sequence: type a short init log, settle on final line */
  var line=document.querySelector('.hero-line');
  if(line){
    var cur=line.querySelector('.cursor') || document.createElement('span');
    cur.className='cursor';
    var steps=['> establishing uplink','> operator file loaded','> focus locked'];
    if(rm){
      line.textContent=''; line.appendChild(document.createTextNode('> focus locked')); line.appendChild(cur);
    } else {
      var txt=document.createElement('span'); line.textContent=''; line.appendChild(txt); line.appendChild(cur);
      var si=0, ci=0;
      function type(){
        var s=steps[si];
        if(ci<=s.length){ txt.textContent=s.slice(0,ci); ci++; setTimeout(type,26); }
        else if(si<steps.length-1){ si++; ci=0; setTimeout(type,620); }
      }
      setTimeout(type,320);
    }
  }

  /* hero targeting reticle (desktop, motion allowed) */
  var hero=document.querySelector('.hero');
  if(hero && fine && !rm){
    var r=document.createElement('div'); r.id='reticle';
    r.innerHTML='<div class="rx"></div><div class="ry"></div><div class="rbox"></div><div class="rc"></div>';
    hero.appendChild(r);
    var rx=r.querySelector('.rx'), ry=r.querySelector('.ry'), rb=r.querySelector('.rbox'), rc=r.querySelector('.rc');
    var raf=null, px=0, py=0, vis=false;
    function draw(){
      raf=null;
      rx.style.top=py+'px'; ry.style.left=px+'px';
      rb.style.left=px+'px'; rb.style.top=py+'px';
      rc.style.left=px+'px'; rc.style.top=py+'px';
      rc.textContent='TRK '+String(Math.round(px)).padStart(4,'0')+' : '+String(Math.round(py)).padStart(4,'0');
    }
    hero.addEventListener('mousemove',function(e){
      var b=hero.getBoundingClientRect(); px=e.clientX-b.left; py=e.clientY-b.top;
      if(!vis){vis=true; r.style.opacity='1';}
      if(!raf) raf=requestAnimationFrame(draw);
    });
    hero.addEventListener('mouseleave',function(){vis=false; r.style.opacity='0';});
  }

  /* active-section highlight is per-page (multi-page site); handled by 'active' class in markup */
})();
