import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {enumerateSets,connectedImages,pairConnections,browseOrder} from '../dist/library-engine.mjs';
import {sharedTags} from '../dist/engine.mjs';
import {updateNote,cleanMap,connectNodes,edgeKey} from '../dist/map-engine.mjs';
const {cards}=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url))),sets=enumerateSets(cards),byId=new Map(cards.map(c=>[c.id,c]));
let count=0;for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++)for(let k=j+1;k<cards.length;k++)if(sharedTags([cards[i],cards[j],cards[k]]).length)count++;
assert.equal(sets.length,count);assert.equal(new Set(sets.map(s=>[...s.ids].sort().join(':'))).size,count);
for(const s of sets)assert.deepEqual(s.tags,sharedTags(s.ids.map(id=>byId.get(id))));
for(const c of cards){const peers=connectedImages(c,cards);assert(!peers.some(p=>p.card.id===c.id));for(const p of peers){assert.deepEqual(p.tags,pairConnections(c,p.card));assert(connectedImages(p.card,cards).some(p=>p.card.id===c.id));}}
const initial={nodes:[{id:1,x:0,y:0},{id:2,x:20,y:30}],edges:[]},map=connectNodes(initial,1,2),noted=updateNote(map,edgeKey(1,2),'Both feel like a frame.');assert.equal(map.edges[0].note,undefined);assert.equal(cleanMap(JSON.parse(JSON.stringify(noted)),[1,2]).edges[0].note,'Both feel like a frame.');assert.equal(updateNote(noted,'1:2','x'.repeat(300)).edges[0].note.length,160);
console.log(`PASS: all ${count} unique valid sets, symmetric image connections, custom notes persist and remain independent of game rules.`);

const mixed=browseOrder(sets,[...new Set(sets.flatMap(s=>s.tags))]);assert.equal(mixed.length,sets.length);assert.equal(new Set(mixed.map(s=>s.ids.join(':'))).size,sets.length);assert(new Set(mixed.slice(0,8).map(s=>s.tags[0])).size>=6);
