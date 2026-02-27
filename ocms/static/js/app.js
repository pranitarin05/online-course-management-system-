(function(){
  // When served from Django, use relative API paths
  const API_BASE = '/api';

  // Utilities
  function qs(sel, el=document){return el.querySelector(sel)}
  function qsa(sel, el=document){return Array.from(el.querySelectorAll(sel))}

  // Mobile nav toggle
  const navToggle = qs('#nav-toggle');
  const navLinks = qs('#navLinks');
  navToggle?.addEventListener('click', ()=>navLinks?.classList.toggle('show'));
  qsa('.nav-links a').forEach(a=>a.addEventListener('click', ()=>navLinks?.classList.remove('show')));

  // Smooth scroll for internal links
  qsa('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(!href || href==='#') return;
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // Scroll reveal
  const revealEls = qsa('.reveal, .feature-card, .project-item, .card.glass');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{if(ent.isIntersecting){ent.target.classList.add('visible');}});
  },{threshold:0.08});
  revealEls.forEach(el=>observer.observe(el));

  // Carousel
  const track = qs('#testimonialsTrack');
  const prevBtn = qs('.carousel-btn.prev');
  const nextBtn = qs('.carousel-btn.next');
  let carouselIndex = 0;
  function renderTestimonials(data){
    if(!track) return;
    track.innerHTML = '';
    data.forEach((t,i)=>{
      const item = document.createElement('div');item.className='carousel-item reveal';
      item.innerHTML = `<p>"${t.text || t.comment || 'Great course!'}"</p><strong>- ${t.author || (t.user && t.user.username) || 'Learner'}</strong>`;
      track.appendChild(item);
    });
  }
  function carouselNext(){if(!track) return; carouselIndex++; if(carouselIndex>track.children.length-1) carouselIndex=0; track.scrollTo({left:track.children[carouselIndex].offsetLeft,behavior:'smooth'});}
  function carouselPrev(){if(!track) return; carouselIndex--; if(carouselIndex<0) carouselIndex=track.children.length-1; track.scrollTo({left:track.children[carouselIndex].offsetLeft,behavior:'smooth'});}
  prevBtn?.addEventListener('click', carouselPrev);
  nextBtn?.addEventListener('click', carouselNext);

  // --- AUTH / TOKEN STORAGE ---
  function saveTokens(tokens){localStorage.setItem('ocms_tokens', JSON.stringify(tokens))}
  function loadTokens(){try{return JSON.parse(localStorage.getItem('ocms_tokens')||'null')}catch(e){return null}}
  function clearTokens(){localStorage.removeItem('ocms_tokens')}

  async function refreshAccess(){
    const tokens = loadTokens();
    if(!tokens?.refresh) return false;
    try{
      const res = await fetch(`${API_BASE}/token/refresh/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refresh:tokens.refresh})});
      if(!res.ok) throw new Error('refresh failed');
      const j = await res.json();
      const newTokens = {access:j.access, refresh: tokens.refresh};
      saveTokens(newTokens);
      return true;
    }catch(e){clearTokens();return false}
  }

  async function authorizedFetch(path, opts={}){
    const tokens = loadTokens();
    opts.headers = opts.headers || {};
    if(tokens?.access) opts.headers['Authorization'] = `Bearer ${tokens.access}`;
    let res = await fetch(path, opts);
    if(res.status===401){
      const ok = await refreshAccess();
      if(ok){ const tokens2 = loadTokens(); opts.headers['Authorization'] = `Bearer ${tokens2.access}`; res = await fetch(path, opts); }
    }
    return res;
  }

  // Contact form validation & submit
  const contactForm = qs('#contactForm');
  const formMsg = qs('#formMsg');
  contactForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    formMsg.textContent='';
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const message = qs('#message').value.trim();
    if(name.length<2){formMsg.textContent='Please enter your name.';return}
    if(!/^\S+@\S+\.\S+$/.test(email)){formMsg.textContent='Please enter a valid email.';return}
    if(message.length<10){formMsg.textContent='Message too short.';return}

    formMsg.textContent='Sending…';
    try{
      const res = await authorizedFetch(`${API_BASE}/enrollments/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,message})});
      if(res.status===401){formMsg.textContent='Please login to submit the form.';return}
      if(!res.ok){formMsg.textContent='Unable to send message.';return}
      formMsg.textContent='Message sent — thank you!';contactForm.reset();
    }catch(err){formMsg.textContent='Unable to send message.'}
  });

  // API client functions
  async function getJSON(path){
    try{const res = await authorizedFetch(path); if(!res.ok) return null; return await res.json()}catch(e){return null}
  }

  // Render courses
  async function loadCourses(){
    const data = await getJSON(`${API_BASE}/courses/`);
    const grid = qs('#coursesGrid');
    if(!grid) return;
    grid.innerHTML='';
    if(!data){grid.innerHTML='<p class="muted">No courses found.</p>';return}
    const courses = data.results || data;
    if(!courses || courses.length===0){grid.innerHTML='<p class="muted">No courses found.</p>';return}
    courses.forEach(c=>{
      const item = document.createElement('article');item.className='project-item reveal card glass';
      item.innerHTML = `<img src="/static/assets/cover-sample.jpg" alt="${c.title||'Course'}"><div class="project-overlay"><h3>${c.title||'Untitled'}</h3><p>${(c.description||'').slice(0,120)}</p><a class="btn ghost" href="/course/${c.id}/">View</a></div>`;
      grid.appendChild(item);
    })
    const stat = qs('#stat-courses');
    if(stat) stat.textContent = (data.count !== undefined) ? data.count : courses.length;
  }

  // Load stats and testimonials
  async function loadStatsAndTestimonials(){
    const reviewsData = await getJSON(`${API_BASE}/reviews/`);
    if(reviewsData){
      const reviews = reviewsData.results || reviewsData;
      const reviewStat = qs('#stat-reviews');
      if(reviewStat) reviewStat.textContent = (reviewsData.count!==undefined)?reviewsData.count: (reviews.length||0);
      const t = (reviews||[]).map(r=>({text:r.body||r.comment||r.text || r.review || 'Excellent', author: r.user?.username || r.name || 'Student'}));
      renderTestimonials(t);
    }
    const studentStat = qs('#stat-students');
    if(studentStat) studentStat.textContent = Math.floor(Math.random()*1500)+200;
  }

  // Init
  document.addEventListener('DOMContentLoaded', ()=>{
    const year = document.getElementById('year');
    if(year) year.textContent = new Date().getFullYear();
    qsa('.feature-card').forEach(el=>el.classList.add('reveal'));
    loadCourses();
    loadStatsAndTestimonials();
    if(track) setInterval(carouselNext, 4500);
  });

  // --- Login Modal & UI ---
  const btnLogin = qs('#btnLogin');
  const loginModal = qs('#loginModal');
  const closeModal = qs('#closeModal');
  const loginForm = qs('#loginForm');
  const loginMsg = qs('#loginMsg');
  const btnLogout = qs('#btnLogout');
  const userMenu = qs('#userMenu');

  function showAuthUI(){
    const tokens = loadTokens();
    if(tokens?.access){ 
      if(btnLogin) btnLogin.style.display='none'; 
      if(userMenu) userMenu.style.display='flex'; 
      const un = qs('#userName');
      if(un) un.textContent='Account'; 
    }
    else{ 
      if(btnLogin) btnLogin.style.display='inline-block'; 
      if(userMenu) userMenu.style.display='none'; 
    }
  }

  btnLogin?.addEventListener('click', ()=>{ loginModal?.setAttribute('aria-hidden','false'); });
  closeModal?.addEventListener('click', ()=>{ loginModal?.setAttribute('aria-hidden','true'); });
  loginForm?.addEventListener('submit', async (e)=>{
    e.preventDefault(); 
    if(loginMsg) loginMsg.textContent='';
    const username = qs('#loginUser').value.trim();
    const password = qs('#loginPass').value.trim();
    if(!username || !password){if(loginMsg) loginMsg.textContent='Enter credentials';return}
    if(loginMsg) loginMsg.textContent='Signing in…';
    try{
      const res = await fetch(`${API_BASE}/token/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
      if(!res.ok){if(loginMsg) loginMsg.textContent='Invalid credentials';return}
      const j = await res.json();
      saveTokens({access:j.access, refresh:j.refresh});
      if(loginMsg) loginMsg.textContent='Signed in';
      loginModal?.setAttribute('aria-hidden','true');
      showAuthUI();
      loadCourses(); loadStatsAndTestimonials();
    }catch(err){if(loginMsg) loginMsg.textContent='Sign in error'}
  });

  btnLogout?.addEventListener('click', ()=>{ clearTokens(); showAuthUI(); });

  // --- Register Modal & UI ---
  const btnRegister = qs('#btnRegister');
  const registerModal = qs('#registerModal');
  const closeRegisterModal = qs('#closeRegisterModal');
  const registerForm = qs('#registerForm');
  const registerMsg = qs('#registerMsg');

  btnRegister?.addEventListener('click', ()=>{ registerModal?.setAttribute('aria-hidden','false'); });
  closeRegisterModal?.addEventListener('click', ()=>{ registerModal?.setAttribute('aria-hidden','true'); });

  registerForm?.addEventListener('submit', async (e)=>{
    e.preventDefault(); 
    if(registerMsg) registerMsg.textContent='';
    const username = qs('#regUser').value.trim();
    const email = qs('#regEmail').value.trim();
    const password = qs('#regPass').value.trim();
    const role = qs('#regRole').value;
    const phone = qs('#regPhone').value.trim();

    if(!username || !email || !password){if(registerMsg) registerMsg.textContent='Fill all required fields';return}
    if(registerMsg) registerMsg.textContent='Creating account…';
    try{
      const res = await fetch(`${API_BASE}/register/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,email,password,role,phone})});
      if(!res.ok){const err = await res.json(); if(registerMsg) registerMsg.textContent=err.error||'Registration failed';return}
      if(registerMsg) registerMsg.textContent='Account created! Signing in…';
      const loginRes = await fetch(`${API_BASE}/token/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
      if(!loginRes.ok){if(registerMsg) registerMsg.textContent='Account created. Please log in.';registerModal?.setAttribute('aria-hidden','true');loginModal?.setAttribute('aria-hidden','false');return}
      const j = await loginRes.json();
      saveTokens({access:j.access, refresh:j.refresh});
      registerModal?.setAttribute('aria-hidden','true');
      showAuthUI();
      loadCourses(); loadStatsAndTestimonials();
    }catch(err){if(registerMsg) registerMsg.textContent='Sign up error'}
  });

  showAuthUI();

})();
