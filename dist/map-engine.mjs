export const SIZE={width:2400,height:1800,cardWidth:128,cardHeight:140};
const clamp=(v,max)=>Math.max(0,Math.min(max,v));
export const edgeKey=(a,b)=>[a,b].sort((x,y)=>x-y).join(':');
export function cleanMap(value,ids){const allowed=new Set(ids),seen=new Set(),nodes=[];for(const n of Array.isArray(value?.nodes)?value.nodes:[]){if(!n||!allowed.has(n.id)||seen.has(n.id)||!Number.isFinite(n.x)||!Number.isFinite(n.y))continue;seen.add(n.id);nodes.push({id:n.id,x:clamp(n.x,SIZE.width-SIZE.cardWidth),y:clamp(n.y,SIZE.height-SIZE.cardHeight)});}const links=new Set(),edges=[];for(const e of Array.isArray(value?.edges)?value.edges:[]){if(!e||e.a===e.b||!seen.has(e.a)||!seen.has(e.b))continue;const key=edgeKey(e.a,e.b);if(links.has(key))continue;links.add(key);edges.push({a:e.a,b:e.b,...(typeof e.note==='string'&&e.note?{note:e.note.slice(0,160)}:{})});}return {nodes,edges};}
export function moveNode(state,id,x,y){return {...state,nodes:state.nodes.map(n=>n.id===id?{...n,x:clamp(x,SIZE.width-SIZE.cardWidth),y:clamp(y,SIZE.height-SIZE.cardHeight)}:n)};}
export function connectNodes(state,a,b){if(a===b||!state.nodes.some(n=>n.id===a)||!state.nodes.some(n=>n.id===b)||state.edges.some(e=>edgeKey(e.a,e.b)===edgeKey(a,b)))return state;return {...state,edges:[...state.edges,{a,b}]};}
export function removeNode(state,id){return {nodes:state.nodes.filter(n=>n.id!==id),edges:state.edges.filter(e=>e.a!==id&&e.b!==id)};}
export function removeEdge(state,key){return {...state,edges:state.edges.filter(e=>edgeKey(e.a,e.b)!==key)};}

export function updateNote(state,key,note){return {...state,edges:state.edges.map(e=>edgeKey(e.a,e.b)===key?{...e,note:String(note).slice(0,160)}:e)};}
