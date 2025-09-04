
// Utility: storage keys
const LS = {
  likes: 'aa_likes',
  bookmarks: 'aa_bookmarks'
};
const $$ = s => document.querySelector(s);
const $$$ = s => Array.from(document.querySelectorAll(s));

function getStore(key){ try{ return JSON.parse(localStorage.getItem(key)||'{}'); }catch(e){ return {}; } }
function setStore(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

async function loadPosts(){
  const res = await fetch('assets/posts.json');
  const data = await res.json();
  return data;
}

function renderCards(container, posts){
  const likes = getStore(LS.likes);
  const bookmarks = getStore(LS.bookmarks);
  container.innerHTML = posts.map(p => {
    const liked = !!likes[p.id];
    const saved = !!bookmarks[p.id];
    const likeCount = p.likes + (liked ? 1 : 0);
    return `
      <article class="card post" data-id="${p.id}" data-title="${p.title.toLowerCase()}" data-tags="${(p.tags||[]).join(',').toLowerCase()}">
        <img src="assets/images/${p.image}" alt="">
        <div class="card-body">
          <h3 class="h6">${p.title}</h3>
          <p class="note">${p.description||''}</p>
          <div class="toolbar">
            <button class="iconbtn btn-like ${liked ? 'active' : ''}" data-id="${p.id}" aria-pressed="${liked}">
              <span class="fa fa-heart"></span> <span>Like</span>
              <span class="like-count">(${likeCount})</span>
            </button>
            <button class="iconbtn btn-save ${saved ? 'active' : ''}" data-id="${p.id}" aria-pressed="${saved}">
              <span class="fa fa-bookmark"></span> <span>Save</span>
            </button>
            ${(p.tags||[]).slice(0,2).map(t=>`<span class="badge">${t}</span>`).join('')}
          </div>
        </div>
      </article>
    `;
  }).join('');
  bindCardEvents(container);
}

function bindCardEvents(container){
  container.addEventListener('click', (e)=>{
    const likeBtn = e.target.closest('.btn-like');
    const saveBtn = e.target.closest('.btn-save');
    if(likeBtn){
      const id = likeBtn.getAttribute('data-id');
      const likes = getStore(LS.likes);
      likes[id] = !likes[id];
      setStore(LS.likes, likes);
      // update UI
      const card = likeBtn.closest('.post');
      const baseCount = parseInt(card.querySelector('.like-count').textContent.replace(/\D/g,'')) || 0;
      likeBtn.classList.toggle('active');
      const liked = likeBtn.classList.contains('active');
      const orig = parseInt(card.getAttribute('data-likebase')||'0');
      const pId = parseInt(id, 10);
      // Recompute from posts.json baseline
      fetch('assets/posts.json').then(r=>r.json()).then(data=>{
        const p = data.find(x=>x.id===pId);
        const count = (p?.likes||0) + (liked?1:0);
        card.querySelector('.like-count').textContent = `(${count})`;
      });
    }
    if(saveBtn){
      const id = saveBtn.getAttribute('data-id');
      const bm = getStore(LS.bookmarks);
      bm[id] = !bm[id];
      setStore(LS.bookmarks, bm);
      saveBtn.classList.toggle('active');
    }
  }, { once:false });
}

function filterPosts(query){
  const q = (query||'').trim().toLowerCase();
  $$$('.post').forEach(card => {
    const title = card.getAttribute('data-title');
    const tags = card.getAttribute('data-tags');
    const show = !q || title.includes(q) || tags.includes(q);
    card.style.display = show ? '' : 'none';
  });
}

// Map setup: requires your Mapbox access token. Put it in window.MAPBOX_TOKEN
async function initMap(containerId){
  if(!window.mapboxgl){
    console.warn('Mapbox GL JS not loaded');
    return;
  }
  if(!window.MAPBOX_TOKEN){
    const el = document.getElementById(containerId);
    el.innerHTML = '<div class="d-flex h-100 w-100 align-items-center justify-content-center text-muted">Set <code>window.MAPBOX_TOKEN</code> in <code>assets/js/config.js</code> to show the map.</div>';
    return;
  }
  mapboxgl.accessToken = window.MAPBOX_TOKEN;
  const map = new mapboxgl.Map({
    container: containerId,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [13.404954, 52.520008],
    zoom: 4
  });
  const posts = await loadPosts();
  posts.forEach(p=>{
    if(typeof p.lng === 'number' && typeof p.lat === 'number'){
      const el = document.createElement('div');
      el.style.width = '20px'; el.style.height = '20px';
      el.style.borderRadius = '50%'; el.style.background = 'var(--brand)';
      new mapboxgl.Marker(el).setLngLat([p.lng, p.lat]).setPopup(new mapboxgl.Popup().setHTML(`<strong>${p.title}</strong><br>${p.description||''}`)).addTo(map);
    }
  });
}

window.addEventListener('DOMContentLoaded', async ()=>{
  const list = $$('#posts-list');
  if(list){
    const data = await loadPosts();
    renderCards(list, data);
  }
  const search = $$('#search');
  if(search){
    search.addEventListener('input', (e)=> filterPosts(e.target.value));
  }
  const mapEl = $$('#map');
  if(mapEl){
    initMap('map');
  }
});
