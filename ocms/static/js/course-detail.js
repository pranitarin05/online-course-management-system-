(function(){
  const API_BASE = '/api';

  // Utilities
  function qs(sel, el=document){return el.querySelector(sel)}
  function qsa(sel, el=document){return Array.from(el.querySelectorAll(sel))}

  // Auth
  function loadTokens(){try{return JSON.parse(localStorage.getItem('ocms_tokens')||'null')}catch(e){return null}}
  function clearTokens(){localStorage.removeItem('ocms_tokens')}

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

  // Get course ID from window variable (passed via template)
  const courseId = typeof COURSE_ID !== 'undefined' ? COURSE_ID : null;

  // Load course detail
  async function loadCourseDetail(){
    if(!courseId){
      const detailDiv = qs('#courseDetail');
      if(detailDiv) detailDiv.innerHTML='<p>No course selected.</p>';
      return;
    }
    const res = await authorizedFetch(`${API_BASE}/courses/${courseId}/`);
    if(!res.ok){
      const detailDiv = qs('#courseDetail');
      if(detailDiv) detailDiv.innerHTML='<p>Course not found.</p>';
      return;
    }
    const course = await res.json();
    const detailDiv = qs('#courseDetail');
    if(!detailDiv) return;
    detailDiv.className='course-detail-hero glass';
    detailDiv.innerHTML=`
      <img src="/static/assets/cover-sample.jpg" alt="${course.title}" style="width:100%;height:300px;object-fit:cover;border-radius:12px;margin-bottom:1rem;">
      <div>
        <h1>${course.title}</h1>
        <p class="section-sub">${course.description||'Premium course content'}</p>
        <div style="display:flex;gap:1rem;margin-top:1rem;">
          <button id="enrollBtn" class="btn primary">Enroll Now</button>
          <a href="/" class="btn ghost">Back</a>
        </div>
      </div>
    `;
    const enrollBtn = qs('#enrollBtn');
    if(enrollBtn){
      enrollBtn.addEventListener('click', async ()=>{
        enrollBtn.textContent='Enrolling…';
        try{
          const eres = await authorizedFetch(`${API_BASE}/enrollments/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({course:courseId})});
          if(eres.ok) enrollBtn.textContent='Enrolled!';
          else enrollBtn.textContent='Error enrolling';
        }catch(e){ enrollBtn.textContent='Error'; }
      });
    }

    document.title=`${course.title} — OCMS`;
  }

  // Load course reviews
  async function loadCourseReviews(){
    const res = await authorizedFetch(`${API_BASE}/reviews/?rating=5`);
    if(!res.ok) return;
    const data = await res.json();
    const reviews = data.results || data;
    const list = qs('#courseReviews');
    const norev = qs('#noReviews');
    if(!list || !norev) return;
    if(!reviews || reviews.length===0){
      norev.style.display='block';
      return;
    }
    list.innerHTML='';
    reviews.slice(0,5).forEach(r=>{
      const item = document.createElement('div');
      item.className='review-item glass reveal';
      item.innerHTML=`<div style="display:flex;justify-content:space-between;"><strong>${r.user?.username||'User'}</strong><span>${r.rating}★</span></div><p>${r.body||r.comment||r.text||r.review}</p>`;
      list.appendChild(item);
    });
  }

  // Review form submit
  const reviewForm = qs('#reviewForm');
  const reviewMsg = qs('#reviewMsg');
  reviewForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(reviewMsg) reviewMsg.textContent='';
    const rating = parseInt(qs('#rating').value);
    const text = qs('#reviewText').value.trim();
    if(rating<1 || rating>5 || text.length<10){
      if(reviewMsg) reviewMsg.textContent='Please fill all fields correctly';
      return;
    }
    if(reviewMsg) reviewMsg.textContent='Submitting…';
    try{
      const res = await authorizedFetch(`${API_BASE}/reviews/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({course:courseId, rating, body:text})});
      if(res.ok){
        if(reviewMsg) reviewMsg.textContent='Review posted!';
        reviewForm.reset();
        loadCourseReviews();
      }else if(reviewMsg) reviewMsg.textContent='Failed to post';
    }catch(e){if(reviewMsg) reviewMsg.textContent='Error'}
  });

  document.addEventListener('DOMContentLoaded', ()=>{
    const year = document.getElementById('year');
    if(year) year.textContent=new Date().getFullYear();
    loadCourseDetail();
    loadCourseReviews();
  });
})();
