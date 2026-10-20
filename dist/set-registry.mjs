import {enumerateSets,browseOrder} from './library-engine.mjs?v=sets-2';
export const setKey=ids=>[...ids].sort((a,b)=>a-b).join(':');
export function createRegistry(cards,saved={}){
 const valid=new Set(cards.map(c=>c.id)),defaults=browseOrder(enumerateSets(cards),[...new Set(cards.flatMap(c=>c.visual))]);
 let removed=new Set(Array.isArray(saved?.removed)?saved.removed:[]),custom=[];
 const isTrio=ids=>Array.isArray(ids)&&ids.length===3&&new Set(ids).size===3&&ids.every(id=>valid.has(id));
 for(const s of Array.isArray(saved?.custom)?saved.custom:[])if(isTrio(s?.ids)&&!custom.some(x=>setKey(x.ids)===setKey(s.ids))&&!defaults.some(x=>setKey(x.ids)===setKey(s.ids)))custom.push({ids:s.ids,tags:['custom']});
 function all(){return [...custom,...defaults].filter(s=>!removed.has(setKey(s.ids))).map(s=>({...s,key:setKey(s.ids)}));}
 return {all,snapshot:()=>({removed:[...removed],custom}),add(ids){if(!isTrio(ids))return false;const key=setKey(ids);if(all().some(s=>s.key===key))return false;removed.delete(key);if(!defaults.some(s=>setKey(s.ids)===key)&&!custom.some(s=>setKey(s.ids)===key))custom.unshift({ids:[...ids],tags:['custom']});return true;},remove(key){if(!all().some(s=>s.key===key))return false;removed.add(key);return true;},undoRemove(key){removed.delete(key);}};
}
