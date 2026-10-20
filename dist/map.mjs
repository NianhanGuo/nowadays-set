import {edgeKey} from './map-engine.mjs?v=sets-2';
const KEY='nowadays-line-map-v1', $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountMap(cards){
 const ids=new Set(cards.map(c=>c.id));let edges=[],history=[],drag=null,keyboardSource=null;
 try{const saved=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(saved)){const seen=new Set();edges=saved.filter(e=>{if(!e||!ids.has(e.a)||!ids.has(e.b)||e.a===e.b||seen.has(edgeKey(e.a,e.b)))return false;seen.add(edgeKey(e.a,e.b));return true;}).map(({a,b})=>({a,b}));}}catch{}
 $('line-images').innerHTML=cards.map(c=>`<button class="line-card" data-line-card="${c.id}" aria-label="Connect ${esc(c.title)}" aria-pressed="false"><img src="${c.image}" alt="${esc(c.title)}" draggable="false"></button>`).join('');
 const point=id=>{const r=$('line-images').querySelector(`[data-line-card="${id}"]`).getBoundingClientRect(),b=$('line-map').getBoundingClientRect();return {x:r.left-b.left+r.width/2,y:r.top-b.top+r.height/2};};
 function lines(){const svg=$('line-edges');svg.setAttribute('viewBox',`0 0 ${$('line-map').clientWidth} ${$('line-map').clientHeight}`);svg.innerHTML=edges.map(e=>{const a=point(e.a),b=point(e.b);return `<g data-edge="${edgeKey(e.a,e.b)}" role="button" tabindex="0" aria-label="Remove connection"><line class="line-hit" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/><line class="line-visible" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/></g>`;}).join('')+(drag?`<line class="line-draft" x1="${point(drag.id).x}" y1="${point(drag.id).y}" x2="${drag.x}" y2="${drag.y}"/>`:'');$('map-count').textContent=`${edges.length} link${edges.length===1?'':'s'}`;$('map-undo').disabled=!history.length;$('map-clear').disabled=!edges.length;}
 function commit(next){history.push(edges.map(e=>({...e})));if(history.length>60)history.shift();edges=next;persist();lines();}
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(edges));$('map-status').textContent='';}catch{$('map-status').textContent='Browser storage unavailable';}}
 function connect(a,b){if(a===b||edges.some(e=>edgeKey(e.a,e.b)===edgeKey(a,b)))return;commit([...edges,{a,b}]);}
 function unselect(){keyboardSource=null;$('line-images').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));}
 $('line-images').onpointerdown=e=>{const c=e.target.closest('[data-line-card]');if(!c||e.button!==0)return;e.preventDefault();unselect();const b=$('line-map').getBoundingClientRect();drag={id:+c.dataset.lineCard,x:e.clientX-b.left,y:e.clientY-b.top};$('line-images').setPointerCapture(e.pointerId);lines();};
 $('line-images').onpointermove=e=>{if(!drag)return;const b=$('line-map').getBoundingClientRect();drag.x=e.clientX-b.left;drag.y=e.clientY-b.top;lines();};
 $('line-images').onpointerup=e=>{if(!drag)return;const id=drag.id,target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-line-card]');drag=null;if(target)connect(id,+target.dataset.lineCard);lines();};$('line-images').onpointercancel=()=>{drag=null;lines();};
 $('line-images').onkeydown=e=>{if(e.key==='Escape'){unselect();drag=null;lines();return;}if(!['Enter',' '].includes(e.key))return;const b=e.target.closest('[data-line-card]');if(!b)return;e.preventDefault();const id=+b.dataset.lineCard;if(keyboardSource===null){keyboardSource=id;b.setAttribute('aria-pressed','true');}else{connect(keyboardSource,id);unselect();}};
 function remove(e){const g=e.target.closest('[data-edge]');if(g)commit(edges.filter(x=>edgeKey(x.a,x.b)!==g.dataset.edge));}
 $('line-edges').onclick=remove;$('line-edges').onkeydown=e=>{if(['Enter',' ','Delete','Backspace'].includes(e.key)){e.preventDefault();remove(e);}};
 $('map-undo').onclick=()=>{if(history.length){edges=history.pop();persist();lines();}};$('map-clear').onclick=()=>{if(edges.length)commit([]);};new ResizeObserver(()=>{if(!$('map-view').hidden)lines();}).observe($('line-map'));
 return {show:()=>requestAnimationFrame(lines)};
}
