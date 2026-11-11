'use strict';
const categoryOrder={half_intro:0,intro:1,framework:2,detail:3};
const grouped=new Map();
for(const row of window.ATLAS_DATA.slice().sort((a,b)=>categoryOrder[a.category]-categoryOrder[b.category]||Number(b.publication_type==='journal')-Number(a.publication_type==='journal')||b.year-a.year||a.title.localeCompare(b.title))){
 row.title=row.title.replace('$${\\text {VLScene}}^{++}$$','VLScene++').replace('B$$^{3}$$CT','B³CT');
 if(!grouped.has(row.paper_url))grouped.set(row.paper_url,[]);
 grouped.get(row.paper_url).push(row);
}
const rows=[];
let remaining=true;
while(remaining){remaining=false;for(const group of grouped.values())if(group.length){rows.push(group.shift());remaining=true;}}
const $=id=>document.getElementById(id);
const labels={half_intro:'首页半栏 Intro',framework:'整体框架',detail:'模块细节',intro:'结构对照'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let favorites=new Set();
try{const saved=JSON.parse(localStorage.getItem('module-atlas-favorites')||'[]');if(Array.isArray(saved))favorites=new Set(saved.filter(id=>rows.some(r=>r.id===id)));}catch{}
let category='',scope='',onlyFavorites=false,filtered=[],current=-1,zoom=1,baseWidth=0,baseHeight=0,opener=null;
const image=$('fullImage');
const journalCount=rows.filter(r=>r.publication_type==='journal').length;
const recentCount=rows.filter(r=>r.recent_12_months).length;
$('summary').textContent=`${rows.length} 张图 / ${journalCount} 张期刊图 / 近一年已核验 ${recentCount} 张`;
$('journalCount').textContent=journalCount;
$('recentCount').textContent=recentCount;
$('newCount').textContent=rows.filter(r=>r.is_new).length;
$('total').textContent=rows.length;
for(const key of Object.keys(labels))$(key+'Count').textContent=rows.filter(r=>r.category===key).length;
for(const v of [...new Set(rows.map(r=>r.venue))].sort())$('venue').add(new Option(v,v));
for(const y of [...new Set(rows.map(r=>r.year))].sort().reverse())$('year').add(new Option(y,y));
function render(){
 const q=$('search').value.trim().toLowerCase();
 filtered=rows.filter(r=>(!scope||(scope==='journal'&&r.publication_type==='journal')||(scope==='recent'&&r.recent_12_months)||(scope==='new'&&r.is_new))&&(!category||r.category===category)&&(!onlyFavorites||favorites.has(r.id))&&(!$('venue').value||r.venue===$('venue').value)&&(!$('year').value||String(r.year)===$('year').value)&&(!q||[r.title,r.topic,r.caption,r.id,r.venue].join(' ').toLowerCase().includes(q)));
 $('favCount').textContent=favorites.size;$('resultCount').textContent=`${filtered.length} / ${rows.length} 张`;
 $('sectionTitle').textContent=(onlyFavorites?'我的收藏 · ':'')+(scope==='journal'?'期刊 · ':scope==='recent'?'近一年 · ':scope==='new'?'2026 论文 · ':'')+(labels[category]||'全部图形');
 $('empty').hidden=filtered.length!==0;
 $('grid').innerHTML=filtered.map((r,i)=>{
  const picture=r.image
   ? `<button class="picture" data-open="${i}" aria-label="放大查看 ${esc(r.title)} 图 ${esc(r.figure_number)}"><img src="${esc(r.thumbnail)}" loading="${i<6?'eager':'lazy'}" decoding="async" alt="${esc(r.title)} 模块图"><span class="view-hint">放大查看 ↗</span></button>`
   : `<a class="picture placeholder" href="${esc(r.paper_url)}" target="_blank" rel="noopener" aria-label="打开 ${esc(r.title)} 的论文来源"><span class="placeholder-index">${esc(r.venue)} ${r.year} / FIG. ${esc(r.figure_number)}</span><span class="placeholder-motif" aria-hidden="true"><i></i><b></b><i></i></span><span class="placeholder-cta">查看论文来源 ↗</span></a>`;
  return `<article class="card" style="animation-delay:${Math.min(i,9)*20}ms">${picture}<div class="card-info"><div class="card-label">${r.is_new?'<span class="new-badge">2026</span>':''}<span class="venue">${esc(r.venue)} ${r.year}</span><span>FIG. ${esc(r.figure_number)} · ${labels[r.category]}</span></div><h3 class="card-title" title="${esc(r.title)}">${esc(r.title)}</h3><div class="card-bottom"><span>${r.publication_type==='journal'?'期刊 · ':''}${r.width_px} × ${r.height_px}${r.dpi?' · '+r.dpi+' DPI':''}</span><button class="star" data-favorite="${esc(r.id)}" aria-label="${favorites.has(r.id)?'取消收藏':'收藏'} ${esc(r.title)}" aria-pressed="${favorites.has(r.id)}">${favorites.has(r.id)?'★':'☆'}</button></div></div></article>`;
 }).join('');
}
function toggleFavorite(id){favorites.has(id)?favorites.delete(id):favorites.add(id);try{localStorage.setItem('module-atlas-favorites',JSON.stringify([...favorites]));}catch{} }
function setScope(value){scope=value;for(const [id,key] of [['allScope',''],['journalScope','journal'],['recentScope','recent'],['newScope','new']])$(id).setAttribute('aria-pressed',String(value===key));}
function reset(){category='';setScope('');onlyFavorites=false;$('search').value='';$('venue').value='';$('year').value='';document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===''));$('favorites').setAttribute('aria-pressed','false');render();}
for(const [id,key] of [['allScope',''],['journalScope','journal'],['recentScope','recent'],['newScope','new']])$(id).addEventListener('click',()=>{setScope(key);render();});
$('categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('active',x===b));render();});
$('favorites').addEventListener('click',()=>{onlyFavorites=!onlyFavorites;$('favorites').setAttribute('aria-pressed',String(onlyFavorites));render();});
for(const id of ['search','venue','year'])$(id).addEventListener('input',render);
for(const id of ['reset','emptyReset'])$(id).addEventListener('click',reset);
for(const id of ['large','compact'])$(id).addEventListener('click',()=>{$('grid').classList.toggle('large',id==='large');$('large').setAttribute('aria-pressed',String(id==='large'));$('compact').setAttribute('aria-pressed',String(id==='compact'));});
$('grid').addEventListener('click',e=>{const fav=e.target.closest('[data-favorite]');if(fav){const id=fav.dataset.favorite;toggleFavorite(id);render();return;}const open=e.target.closest('[data-open]');if(open){opener=open;openViewer(Number(open.dataset.open));}});
function updateZoom(){if(!baseWidth)return;image.style.width=Math.round(baseWidth*zoom)+'px';image.style.height=Math.round(baseHeight*zoom)+'px';$('zoomLevel').textContent=Math.round(zoom*100)+'%';$('zoomOut').disabled=zoom<=.5;$('zoomIn').disabled=zoom>=5;}
function fitImage(){if(!image.naturalWidth)return;const s=$('stage');const factor=Math.min((s.clientWidth-48)/image.naturalWidth,(s.clientHeight-48)/image.naturalHeight,1);baseWidth=image.naturalWidth*factor;baseHeight=image.naturalHeight*factor;zoom=1;updateZoom();s.scrollTo(0,0);}
image.addEventListener('load',()=>{$('imageState').textContent='';image.style.visibility='visible';fitImage();});
image.addEventListener('error',()=>{$('imageState').textContent='图片加载失败，请点击“原图”重试。';});
function openViewer(index){
 current=index;const r=filtered[current];if(!r)return;
 if(!$('viewer').open){$('viewer').showModal();document.body.classList.add('viewing');}
 $('viewerTitle').textContent=r.title;$('viewerPosition').textContent=`${index+1} / ${filtered.length}`;$('imageMeta').textContent=`${r.venue} ${r.year} · FIG. ${r.figure_number} · ${r.width_px} × ${r.height_px}`;
 $('download').href=r.image;$('download').download=r.id+'.png';$('original').href=r.image;$('paper').href=r.paper_url;
 $('sourceVersion').textContent=r.source_version?`图源版本：${r.source_version}`:'';
 $('viewerFavorite').textContent=favorites.has(r.id)?'★ 已收藏':'☆ 收藏';$('viewerFavorite').setAttribute('aria-pressed',String(favorites.has(r.id)));
 $('prev').disabled=index===0;$('next').disabled=index===filtered.length-1;
 baseWidth=0;zoom=1;$('zoomLevel').textContent='100%';image.style.visibility='hidden';$('imageState').textContent='正在加载高清图…';image.alt=r.title+' 图 '+r.figure_number;image.src=r.image;
}
$('closeViewer').addEventListener('click',()=>$('viewer').close());
$('viewer').addEventListener('close',()=>{document.body.classList.remove('viewing');const id=filtered[current]?.id;render();const button=[...document.querySelectorAll('[data-open]')].find(b=>filtered[Number(b.dataset.open)]?.id===id);(button||$('search')).focus({preventScroll:true});});
$('prev').addEventListener('click',()=>{if(current>0)openViewer(current-1);});
$('next').addEventListener('click',()=>{if(current<filtered.length-1)openViewer(current+1);});
$('zoomIn').addEventListener('click',()=>{zoom=Math.min(5,zoom+.25);updateZoom();});
$('zoomOut').addEventListener('click',()=>{zoom=Math.max(.5,zoom-.25);updateZoom();});
$('fit').addEventListener('click',fitImage);
$('viewerFavorite').addEventListener('click',()=>{const r=filtered[current];toggleFavorite(r.id);$('viewerFavorite').textContent=favorites.has(r.id)?'★ 已收藏':'☆ 收藏';$('viewerFavorite').setAttribute('aria-pressed',String(favorites.has(r.id)));});
$('viewer').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&current>0){e.preventDefault();openViewer(current-1);}if(e.key==='ArrowRight'&&current<filtered.length-1){e.preventDefault();openViewer(current+1);}if(e.key==='+'||e.key==='=')$('zoomIn').click();if(e.key==='-')$('zoomOut').click();});
window.addEventListener('resize',()=>{if($('viewer').open)fitImage();});
const initialCategory=new URLSearchParams(window.location.search).get('category');
if(initialCategory&&labels[initialCategory]){
 category=initialCategory;
 document.querySelectorAll('[data-category]').forEach(button=>button.classList.toggle('active',button.dataset.category===category));
}
render();
