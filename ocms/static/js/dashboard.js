(function(){
  const API_BASE = '/api';

  // Utilities
  function qs(sel, el=document){return el.querySelector(sel)}
  function qsa(sel, el=document){return Array.from(el.querySelectorAll(sel))}

  // Auth
  function loadTokens(){try{return JSON.parse(localStorage.getItem('ocms_tokens')||'null')}catch(e){return null}}
  function clearTokens(){localStorage.removeItem('ocms_tokens')}

  function redirectToLogin(){
    const tokens = loadTokens();
    if(!tokens?.access) window.location.href = '/';
  }

  async function authorizedFetch(path, opts={}){
    const tokens = loadTokens();
    opts.headers = opts.headers || {};
    if(tokens?.access) opts.headers['Authorization'] = `Bearer ${tokens.access}`;
    let res = await fetch(path, opts);
    if(res.status===401){
      clearTokens();
      window.location.href = '/';
    }
    return res;
  }

  // Mobile nav toggle
  const navToggle = qs('#nav-toggle');
  const navLinks = qs('#navLinks');
  navToggle?.addEventListener('click', ()=>navLinks?.classList.toggle('show'));
  qsa('.nav-links a').forEach(a=>a.addEventListener('click', ()=>navLinks?.classList.remove('show')));

  // Scroll reveal
  const revealEls = qsa('.reveal');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{if(ent.isIntersecting)ent.target.classList.add('visible')});
  },{threshold:0.08});
  revealEls.forEach(el=>observer.observe(el));

  // Logout
  const btnLogout = qs('#btnLogout');
  btnLogout?.addEventListener('click', ()=>{ clearTokens(); window.location.href = '/'; });

  // Load my enrollments
  async function loadMyEnrollments(){
    const res = await authorizedFetch(`${API_BASE}/enrollments/`);
    if(!res.ok) return;
    const data = await res.json();
    const enrollments = data.results || data;
    const grid = qs('#myCoursesGrid');
    if(!grid) return;
    grid.innerHTML='';
    if(!enrollments || enrollments.length===0){
      grid.innerHTML='<p class="muted">No enrolled courses yet.</p>';
      return;
    }
    enrollments.forEach(e=>{
      const item = document.createElement('article');
      item.className='project-item reveal card glass';
      const courseId = e.course?.id || e.course;
      item.innerHTML=`<img src="/static/assets/cover-sample.jpg" alt="Course"><div class="project-overlay"><h3>${e.course?.title||'Course'}</h3><p>Enrolled on ${new Date(e.created_at).toLocaleDateString()}</p><a class="btn ghost" href="/course/${courseId}/">View</a></div>`;
      grid.appendChild(item);
    });
  }

  // Load my reviews
  async function loadMyReviews(){
    const res = await authorizedFetch(`${API_BASE}/reviews/`);
    if(!res.ok) return;
    const data = await res.json();
    const reviews = data.results || data;
    const list = qs('#myReviewsList');
    if(!list) return;
    list.innerHTML='';
    if(!reviews || reviews.length===0){
      list.innerHTML='<p class="muted">No reviews yet.</p>';
      return;
    }
    reviews.forEach(r=>{
      const item = document.createElement('div');
      item.className='review-item glass reveal';
      item.innerHTML=`<div><strong>${r.course?.title||'Course'}</strong> - ${r.rating}★</div><p>${r.body||r.comment||r.text||r.review}</p>`;
      list.appendChild(item);
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    redirectToLogin();
    const year = document.getElementById('year');
    if(year) year.textContent=new Date().getFullYear();
    loadMyEnrollments();
    loadMyReviews();
  });
})();
