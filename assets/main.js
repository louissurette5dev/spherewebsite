const toggle=document.querySelector('.menu'),nav=document.querySelector('.navlinks');function closeMenu(){nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if('IntersectionObserver'in window&&!reduced){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();const form=document.querySelector('#contact-form');
if(form){
  const requested=new URLSearchParams(location.search).get('service');
  if(requested&&Array.from(form.elements.service.options).some(o=>o.value===requested)) form.elements.service.value=requested;
  const status=document.querySelector('#form-status');
  const submit=form.querySelector('[type="submit"]');
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const endpoint=(form.dataset.formspreeEndpoint||'').trim();
    if(!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)){
      status.textContent='Online submissions are not configured yet. Please email info@spse.ca directly.';
      status.dataset.state='error';return;
    }
    submit.disabled=true;submit.textContent='Sending…';status.textContent='Sending your request…';status.dataset.state='pending';
    try{
      const data=new FormData(form);
      data.append('_subject','Sphere quote request: '+data.get('service'));
      const response=await fetch(endpoint,{method:'POST',body:data,headers:{'Accept':'application/json'}});
      const result=await response.json().catch(()=>({}));
      if(!response.ok){
        const details=Array.isArray(result.errors)?result.errors.map(item=>item.message).filter(Boolean).join(' '):'';
        throw new Error(details||'The form could not be sent. Please try again.');
      }
      form.reset();status.textContent='Thank you! Your request was submitted successfully. We’ll be in touch soon.';status.dataset.state='success';
    }catch(err){status.textContent=(err instanceof Error?err.message:'Unable to send your request.')+' You can also email info@spse.ca.';status.dataset.state='error';}
    finally{submit.disabled=false;submit.textContent='Send quote request';}
  });
}
// Image-only scroll reveal: image uncovers as the user scrolls, with subtle hover zoom.
(()=>{const section=document.querySelector('.hero-image-section');const photo=document.querySelector('.hero-image-reveal');if(!section||!photo)return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){photo.style.clipPath='none';photo.style.transform='none';return;}let scheduled=false;function update(){scheduled=false;const rect=section.getBoundingClientRect();const viewport=window.innerHeight||1;const progress=Math.max(0,Math.min(1,(viewport-rect.top)/(viewport+rect.height*.25)));const eased=1-Math.pow(1-progress,2);photo.style.clipPath=`inset(0 0 ${(100*(1-eased)).toFixed(2)}% 0)`;photo.style.transform=`scale(${(1.12-.12*eased).toFixed(4)})`;}function request(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request,{passive:true});request();})();
