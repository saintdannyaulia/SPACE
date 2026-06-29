// ═══════════════════════════════════════════════
// ⚙️ SUPABASE CONFIG
// ═══════════════════════════════════════════════
const SUPA_URL = 'YOUR_SUPABASE_URL';
const SUPA_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supa={
  async req(path,opts={}){
    const r=await fetch(SUPA_URL+'/rest/v1'+path,{
      headers:{
        'apikey':SUPA_KEY,
        'Authorization':'Bearer '+SUPA_KEY,
        'Content-Type':'application/json',
        ...opts.headers
      },...opts
    });
    if(!r.ok){const e=await r.json().catch(()=>({message:r.statusText}));throw new Error(e.message||r.statusText);}
    const t=await r.text();return t?JSON.parse(t):null;
  },
  get:(t,q='')=>supa.req('/'+t+(q?'?'+q:''),{headers:{'Prefer':'return=representation'}}),
  post:(t,b)=>supa.req('/'+t,{method:'POST',body:JSON.stringify(b),headers:{'Prefer':'return=representation'}}),
  patch:(t,q,b)=>supa.req('/'+t+'?'+q,{method:'PATCH',body:JSON.stringify(b),headers:{'Prefer':'return=minimal'}}),
  del:(t,q)=>supa.req('/'+t+'?'+q,{method:'DELETE',headers:{'Prefer':'return=minimal'}}),
};
const isSupaOk=()=>SUPA_URL!=='YOUR_SUPABASE_URL';
async function sha256(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}

// ═══════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════
let adminSession=null,galleryItems=[],messages=[];
let galleryFilter='all',gallerySort='date-desc';
let bgMode='particles',currentSeason='winter',settingsOpen=false,sidebarExpanded=false;
let musicBarTimer=null;

// ═══════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════
const ARTISTS=[
  {id:'aria',name:'Aria Yuki',handle:'@aria.yuki',role:'Illustrator & Concept Artist',tags:['illustration','character design','fantasy'],initials:'AY',bio:"Drawing worlds that don't exist yet, one brushstroke at a time.",occupation:'Illustrator',birthday:'03/22',age:'24',likes:[{icon:'🎨',label:'Painting'},{icon:'🌙',label:'Night Sky'},{icon:'🍵',label:'Matcha'}],color:'#b89fff'},
  {id:'kai',name:'Kai Mori',handle:'@kai.mori',role:'Music Composer & Producer',tags:['ambient','electronic','lofi'],initials:'KM',bio:'Weaving silence and sound into something that feels like home.',occupation:'Composer',birthday:'07/15',age:'27',likes:[{icon:'🎹',label:'Piano'},{icon:'🌊',label:'Ocean'},{icon:'🎧',label:'Music'}],color:'#7dd4fc'},
  {id:'sora',name:'Sora Hana',handle:'@sora.hana',role:'Digital Artist & Animator',tags:['animation','digital','motion'],initials:'SH',bio:'Every frame is a universe. I just give them life.',occupation:'Animator',birthday:'11/08',age:'22',likes:[{icon:'🌸',label:'Sakura'},{icon:'✨',label:'Stars'},{icon:'🍡',label:'Dango'}],color:'#f0abfc'},
  {id:'ren',name:'Ren Tsuki',handle:'@ren.tsuki',role:'Vocalist & Lyricist',tags:['vocals','songwriting','pop'],initials:'RT',bio:'Words are music. Music is words. I live between both.',occupation:'Vocalist',birthday:'01/30',age:'25',likes:[{icon:'🎤',label:'Singing'},{icon:'📝',label:'Writing'},{icon:'🌙',label:'Moonlight'}],color:'#e8c97a'},
  {id:'niko',name:'Niko Shiro',handle:'@niko.shiro',role:'Photographer & Visual Director',tags:['photography','art direction','film'],initials:'NS',bio:'Capturing the in-between moments no one remembers but everyone feels.',occupation:'Photographer',birthday:'09/05',age:'29',likes:[{icon:'📷',label:'Photo'},{icon:'☕',label:'Coffee'},{icon:'🗾',label:'Travel'}],color:'#34d399'},
  {id:'luna',name:'Luna Hoshi',handle:'@luna.hoshi',role:'Concept Designer & Worldbuilder',tags:['concept art','worldbuilding','lore'],initials:'LH',bio:"I build places that exist nowhere, for everyone who's ever felt nowhere.",occupation:'World Designer',birthday:'12/24',age:'26',likes:[{icon:'🌍',label:'Worldbuilding'},{icon:'📚',label:'Books'},{icon:'🍕',label:'Pizza'}],color:'#fb7185'},
];
const DEFAULT_GALLERY=[
  {id:'d1',title:'Lunar Dream',category:'illustration',artist:'Aria Yuki',emoji:'🌙',bg_color:'#1a1040',date_updated:'2024-11-20'},
  {id:'d2',title:'Ethereal Score',category:'music',artist:'Kai Mori',emoji:'🎵',bg_color:'#0a2040',date_updated:'2024-10-05'},
  {id:'d3',title:'Sakura Protocol',category:'illustration',artist:'Sora Hana',emoji:'🌸',bg_color:'#2a0830',date_updated:'2024-09-18'},
  {id:'d4',title:'Starfall Tee',category:'merchandise',artist:'Luna Hoshi',emoji:'👕',bg_color:'#1a1000',date_updated:'2024-11-30'},
  {id:'d5',title:'Celestial Form',category:'illustration',artist:'Aria Yuki',emoji:'🌠',bg_color:'#0a1520',date_updated:'2024-08-14'},
  {id:'d6',title:'Midnight Bloom',category:'illustration',artist:'Sora Hana',emoji:'🌺',bg_color:'#1a0020',date_updated:'2024-12-01'},
  {id:'d7',title:'Frequency EP',category:'music',artist:'Ren Tsuki',emoji:'🎤',bg_color:'#001020',date_updated:'2024-07-22'},
  {id:'d8',title:'Glass Pin Set',category:'merchandise',artist:'Niko Shiro',emoji:'📌',bg_color:'#001a10',date_updated:'2024-10-28'},
  {id:'d9',title:'Void Portrait',category:'illustration',artist:'Luna Hoshi',emoji:'🎭',bg_color:'#0f0010',date_updated:'2024-11-07'},
];
