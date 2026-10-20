import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {sharedTags,findTrio,deal,advance} from '../dist/engine.mjs';
const {cards,tags}=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url)));
assert.equal(cards.length,24);assert.equal(Object.keys(tags).length,9);assert.equal(cards.filter(c=>c.channels.includes('Unexpected')).length,17);
assert.equal(new Set(cards.map(c=>c.id)).size,24);
for(const c of cards){assert(!c.preview);assert(!('theme' in c));assert(c.visual.length);assert.equal(new Set(c.visual).size,c.visual.length);assert(existsSync(new URL('../dist/'+c.image,import.meta.url)));for(const t of c.visual)assert(tags[t]);}
for(const t of Object.keys(tags))assert(cards.filter(c=>c.visual.includes(t)).length>=3);
const pick=ids=>ids.map(id=>cards.find(c=>c.id===id));
assert(sharedTags(pick([50646533,50646609,50646605])).includes('stacked'));
assert(sharedTags(pick([50646590,50646610,50646616])).includes('curves'));
assert(sharedTags(pick([50463000,50462990,50463002])).includes('frames'));
assert.equal(sharedTags(pick([50646610,50646526,50646614])).length,0);
assert.equal(sharedTags([cards[0],cards[0],cards[0]]).length,0);
assert.deepEqual(sharedTags([{id:1,visual:['a'],theme:['same']},{id:2,visual:['b'],theme:['same']},{id:3,visual:['c'],theme:['same']}]),[]);
assert.deepEqual(new Set(sharedTags(pick([50646533,50646609,50646605]))),new Set(['stacked','grid']));
let seed=34677;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
function hasTwoDistinctTrios(board){for(let i=0;i<board.length;i++)for(let j=i+1;j<board.length;j++)for(let k=j+1;k<board.length;k++){const a=[board[i],board[j],board[k]],links=sharedTags(a),rest=board.filter(c=>!a.includes(c));if(links.some(t=>findTrio(rest,t)))return true;}return false;}
for(let round=0;round<200;round++){
 let d=deal(cards,random),collected=new Set(),turns=0;assert(hasTwoDistinctTrios(d.board));assert(d.board.filter(c=>c.channels.includes('Unexpected')).length>=8);
 while(d.playable){const trio=findTrio(d.board).cards;for(const c of trio){assert(!collected.has(c.id));collected.add(c.id);}d=advance(d.board,d.remaining,trio);assert(++turns<=8);const left=[...d.board,...d.remaining];assert.equal(new Set(left.map(c=>c.id)).size,left.length);assert.equal(left.length+collected.size,24);for(const c of left)assert(!collected.has(c.id));if(d.playable)assert(findTrio(d.board));}
 assert.equal(findTrio([...d.board,...d.remaining]),null);
}
assert.throws(()=>advance(cards.slice(0,12),cards.slice(12),pick([50646590,50646610,50646616])),/Invalid/);
console.log('PASS: 24 image cards, 17 Unexpected, 9 visual-only links, multiple links, 2 opening matches, 200 complete games, no duplicates or dead-board loops.');
