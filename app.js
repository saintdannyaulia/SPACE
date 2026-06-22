// ═══════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════
function escHtml(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function escAttr(s){return String(s||'').replace(/'/g,"\\'");}

// ═══════════════════════════════════════════════
// CLOCK
// ═══════════════════════════════════════════════
function updateClock(){
  const now=new Date();
  const h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
  // digital
  document.getElementById('clock-digital').textContent=
    String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  // date
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('clock-date').textContent=days[now.getDay()]+', '+months[now.getMonth()]+' '+now.getDate();
  // analog
  const hDeg=(h%12)*30+(m*0.5);
  const mDeg=m*6+(s*0.1);
  const sDeg=s*6;
  document.getElementById('hand-h').style.transform=`translateX(-50%) rotate(${hDeg}deg)`;
  document.getElementById('hand-m').style.transform=`translateX(-50%) rotate(${mDeg}deg)`;
  document.getElementById('hand-s').style.transform=`translateX(-50%) rotate(${sDeg}deg)`;
}
setInterval(updateClock,1000);
updateClock();

// ═══════════════════════════════════════════════
// SIDEBAR EXPAND/COLLAPSE
// ═══════════════════════════════════════════════
function toggleSidebar(){
  sidebarExpanded=!sidebarExpanded;
  document.getElementById('sidebar').classList.toggle('expanded',sidebarExpanded);
  document.getElementById('main').style.marginRight=sidebarExpanded?'var(--sidebar-expanded)':'var(--sidebar-w)';
  // banner right margin
  const banner=document.getElementById('announcement-banner');
  banner.style.right=sidebarExpanded?'var(--sidebar-expanded)':'var(--sidebar-w)';
  if(settingsOpen){
    const p=document.getElementById('settings-panel');
    p.style.right=sidebarExpanded?'calc(var(--sidebar-expanded) + 8px)':'calc(var(--sidebar-w) + 8px)';
  }
}

// ═══════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════
function goTo(pageId){
  if(pageId==='admin-dashboard'&&!adminSession){showToast('Please login as admin first.');return;}
  document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
  const pg=document.getElementById(pageId);
  if(pg) pg.classList.remove('hidden');
  const map={home:'home','profile-list':'profile','profile-detail':'profile',gallery:'gallery',contact:'contact','admin-dashboard':'admin'};
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const nav=document.querySelector(`.nav-item[data-page="${map[pageId]}"]`);
  if(nav) nav.classList.add('active');
  // keep admin item active while on dashboard
  if(pageId==='admin-dashboard') document.getElementById('nav-adminlogin').classList.add('active');
  if(settingsOpen) toggleSettings();
  if(pageId==='admin-dashboard') loadAdminDashboard();
  // track nav click (non-admin)
  if(!adminSession){
    const labels={home:'Home',gallery:'Gallery','profile-list':'Profile',contact:'Contact'};
    if(labels[pageId]) logActivity('Nav Click', labels[pageId]);
  }
}

// ═══════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════
function toggleSettings(){
  settingsOpen=!settingsOpen;
  const p=document.getElementById('settings-panel');
  p.style.right=sidebarExpanded?'calc(var(--sidebar-expanded) + 8px)':'calc(var(--sidebar-w) + 8px)';
  p.classList.toggle('open',settingsOpen);
}
function switchTab(n,el){
  document.querySelectorAll('.s-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.s-pane').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('pane-'+n).classList.add('active');
}
function setTheme(t,el){
  document.body.setAttribute('data-theme',t);
  document.querySelectorAll('.theme-swatch').forEach(s=>s.classList.remove('active'));
  el.querySelector('.theme-swatch').classList.add('active');
}
function detectSeason(){
  const m=new Date().getMonth()+1;
  if(m>=3&&m<=5) return 'spring';
  if(m>=6&&m<=8) return 'summer';
  if(m>=9&&m<=11) return 'autumn';
  return 'winter';
}
function setSeason(s,el){
  currentSeason=s;
  document.querySelectorAll('#season-opts .s-opt').forEach(e=>e.classList.remove('active'));
  if(el) el.classList.add('active');
  startParticles();
}
function setBg(m,el){
  bgMode=m;
  document.querySelectorAll('#pane-bg .s-opt').forEach(e=>e.classList.remove('active'));
  if(el) el.classList.add('active');
  document.getElementById('bg-image').style.display='none';
  document.getElementById('bg-video').style.display='none';
}
function setLang(l,el){
  document.body.setAttribute('data-lang',l);
  document.querySelectorAll('#pane-lang .s-opt').forEach(e=>e.classList.remove('active'));
  if(el) el.classList.add('active');
}
function handleBgUpload(e){
  const file=e.target.files[0];if(!file)return;
  const url=URL.createObjectURL(file);
  const isVid=file.type.startsWith('video/');
  document.getElementById('bg-image').style.display='none';
  document.getElementById('bg-video').style.display='none';
  bgMode='upload';
  document.querySelectorAll('#pane-bg .s-opt').forEach(s=>s.classList.remove('active'));
  if(isVid){const v=document.getElementById('bg-video');v.src=url;v.style.display='block';}
  else{const i=document.getElementById('bg-image');i.src=url;i.style.display='block';}
  document.getElementById('bg-upload-label').textContent='Loaded: '+file.name;
  document.getElementById('bg-upload-label').style.display='block';
  showToast('Background uploaded!',true);
}
document.addEventListener('click',e=>{
  if(settingsOpen&&!document.getElementById('settings-panel').contains(e.target)&&!document.getElementById('nav-settings').contains(e.target)){
    settingsOpen=false;document.getElementById('settings-panel').classList.remove('open');
  }
});

// ═══════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════
let toastT;
function showToast(msg,ok=false){
  const t=document.getElementById('toast');
  t.textContent=(ok?'✓ ':'')+msg;
  t.style.borderColor=ok?'var(--green)':'var(--border2)';
  t.classList.add('show');
  clearTimeout(toastT);
  toastT=setTimeout(()=>t.classList.remove('show'),3000);
}

// ═══════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}

// ═══════════════════════════════════════════════
// MUSIC ENGINE — HTML5 Audio (real playback)
// ═══════════════════════════════════════════════
let TRACKS=[]; // {name, artist, genre, duration, url, blobUrl}
let audioEl=null;        // single HTMLAudioElement reused
let currentTrack=-1, isPlaying=false;
let _pendingAudioFile=null; // FileReader result waiting for addTrack()

// Allowed MIME types for audio upload
const AUDIO_MIME_WHITELIST=['audio/mpeg','audio/mp3','audio/wav','audio/wave','audio/ogg','audio/flac','audio/x-flac','audio/aac','audio/mp4'];
const AUDIO_MAX_MB=50;

function getAudioEl(){
  if(!audioEl){
    audioEl=new Audio();
    audioEl.volume=0.7;
    audioEl.addEventListener('ended',()=>{ isPlaying=false; nextTrack(); });
    audioEl.addEventListener('timeupdate', onAudioTimeUpdate);
    audioEl.addEventListener('loadedmetadata', onAudioMeta);
    audioEl.addEventListener('error', onAudioError);
  }
  return audioEl;
}

function fmtTime(s){
  if(!isFinite(s)||s<0) return'0:00';
  const m=Math.floor(s/60),sec=Math.floor(s%60);
  return`${m}:${sec.toString().padStart(2,'0')}`;
}

function onAudioTimeUpdate(){
  const a=getAudioEl();
  const fill=document.getElementById('music-progress-fill');
  const cur=document.getElementById('music-cur-time');
  if(fill&&a.duration>0) fill.style.width=(a.currentTime/a.duration*100)+'%';
  if(cur) cur.textContent=fmtTime(a.currentTime);
}

function onAudioMeta(){
  const a=getAudioEl();
  const dur=document.getElementById('music-dur-time');
  if(dur) dur.textContent=fmtTime(a.duration);
  // also update track duration in list
  if(currentTrack>=0&&TRACKS[currentTrack]){
    TRACKS[currentTrack].duration=fmtTime(a.duration);
    renderTracks();
  }
  document.getElementById('music-progress-wrap').style.display='block';
}

function onAudioError(){
  showToast('Gagal memutar audio. Format tidak didukung atau file rusak.');
  isPlaying=false;
  setPlayIcon(false);
  document.getElementById('music-wave').classList.remove('wave-playing');
  document.getElementById('music-status-label').textContent='Error';
}

function seekTrack(e){
  const a=getAudioEl();
  if(!a.duration) return;
  const bar=document.getElementById('music-progress-bar');
  const rect=bar.getBoundingClientRect();
  const pct=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
  a.currentTime=pct*a.duration;
}

function setVolume(v){
  getAudioEl().volume=parseFloat(v);
}

function renderTracks(){
  const el=document.getElementById('track-list');
  if(!el) return;
  if(!TRACKS.length){
    el.innerHTML='<p style="color:var(--text3);font-size:12px;padding:8px 0;">Belum ada lagu. '+(adminSession?'Upload lagu di bawah.':'')+'</p>';
    return;
  }
  el.innerHTML=TRACKS.map((t,i)=>`
    <div class="music-track ${i===currentTrack?'playing':''}" onclick="selectTrack(${i})">
      <div class="track-dot"></div>
      <div class="track-info">
        <div class="track-name">${escHtml(t.name)}</div>
        <div class="track-artist">${escHtml(t.artist)}${t.genre?' · '+escHtml(t.genre):''}</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <div class="track-dur">${escHtml(t.duration||'—')}</div>
        ${adminSession?`<button data-rm="${i}" class="track-rm-btn" style="background:rgba(248,113,113,.15);border:1px solid rgba(248,113,113,.3);color:var(--red);border-radius:50%;width:18px;height:18px;font-size:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;" title="Hapus">✕</button>`:''}
      </div>
    </div>`).join('');
  // attach remove listeners
  el.querySelectorAll('.track-rm-btn').forEach(btn=>{
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      removeTrack(parseInt(this.dataset.rm));
    });
  });
}

function selectTrack(i){
  if(i<0||i>=TRACKS.length) return;
  const t=TRACKS[i];
  if(!t.blobUrl&&!t.url){ showToast('Tidak ada file audio untuk lagu ini.'); return; }
  currentTrack=i;
  const a=getAudioEl();
  a.pause();
  a.src=t.blobUrl||t.url;
  a.load();
  a.play().then(()=>{
    isPlaying=true;
    document.getElementById('music-wave').classList.add('wave-playing');
    setPlayIcon(true);
    document.getElementById('music-status-label').textContent='Playing: '+t.name;
    document.getElementById('bar-track-name').textContent=t.name;
    document.getElementById('bar-track-artist').textContent=t.artist;
    showMusicBar(6000);
    renderTracks();
  }).catch(err=>{
    console.warn('Audio play error:',err);
    onAudioError();
  });
}

function prevTrack(){
  if(!TRACKS.length) return;
  if(currentTrack<=0) selectTrack(TRACKS.length-1);
  else selectTrack(currentTrack-1);
}

function nextTrack(){
  if(!TRACKS.length) return;
  selectTrack((currentTrack+1)%TRACKS.length);
}

function setPlayIcon(playing){
  const path=playing?'M6 19h4V5H6v14zm8-14v14h4V5h-4z':'M5 3l14 9-14 9V3z';
  ['global-play-icon','bar-play-icon'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.setAttribute('d',path);
  });
}

function togglePlay(){
  if(!TRACKS.length){ showToast('Belum ada lagu di tracklist.'); return; }
  if(currentTrack<0){ selectTrack(0); return; }
  const a=getAudioEl();
  if(isPlaying){
    a.pause();
    isPlaying=false;
    document.getElementById('music-wave').classList.remove('wave-playing');
    setPlayIcon(false);
    document.getElementById('music-status-label').textContent='Paused';
  } else {
    if(!a.src||a.src===window.location.href){ selectTrack(currentTrack); return; }
    a.play().then(()=>{
      isPlaying=true;
      document.getElementById('music-wave').classList.add('wave-playing');
      setPlayIcon(true);
      document.getElementById('music-status-label').textContent='Playing: '+TRACKS[currentTrack].name;
    }).catch(onAudioError);
  }
  showMusicBar(4000);
}

function removeTrack(i){
  if(i<0||i>=TRACKS.length) return;
  if(!confirm('Hapus "'+TRACKS[i].name+'" dari tracklist?')) return;
  // revoke blob URL to free memory
  if(TRACKS[i].blobUrl) URL.revokeObjectURL(TRACKS[i].blobUrl);
  if(currentTrack===i){
    getAudioEl().pause();
    currentTrack=-1; isPlaying=false;
    setPlayIcon(false);
    document.getElementById('music-wave').classList.remove('wave-playing');
    document.getElementById('music-status-label').textContent='Stopped';
    document.getElementById('music-progress-wrap').style.display='none';
  } else if(currentTrack>i){
    currentTrack--;
  }
  TRACKS.splice(i,1);
  renderTracks();
  showToast('Lagu dihapus.',true);
}

// ─── Upload handling ───────────────────────────
function onAudioFileChosen(e){
  const file=e.target.files[0];
  if(!file){ _pendingAudioFile=null; return; }
  // Validate MIME
  if(!AUDIO_MIME_WHITELIST.includes(file.type)&&!file.type.startsWith('audio/')){
    showToast('Format tidak didukung. Gunakan MP3, WAV, OGG, FLAC, atau AAC.');
    e.target.value='';_pendingAudioFile=null;return;
  }
  // Validate size (50 MB)
  if(file.size>AUDIO_MAX_MB*1024*1024){
    showToast(`File terlalu besar. Maksimum ${AUDIO_MAX_MB} MB.`);
    e.target.value='';_pendingAudioFile=null;return;
  }
  _pendingAudioFile=file;
  // Auto-fill name from filename if empty
  const nameEl=document.getElementById('tr-name');
  if(nameEl&&!nameEl.value.trim()){
    nameEl.value=file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');
  }
  document.getElementById('tr-audio-text').textContent='✓ '+file.name;
}

function addTrack(){
  if(!adminSession){ showToast('Admin only.'); return; }
  if(!_pendingAudioFile){ showToast('Pilih file audio terlebih dahulu.'); return; }
  const name=(document.getElementById('tr-name').value.trim()||_pendingAudioFile.name.replace(/\.[^.]+$/,''));
  const artist=document.getElementById('tr-artist').value.trim()||'Unknown Artist';
  const genre=document.getElementById('tr-genre').value.trim();
  const blobUrl=URL.createObjectURL(_pendingAudioFile);
  TRACKS.push({name,artist,genre,duration:'—',blobUrl});
  renderTracks();
  // Reset form
  _pendingAudioFile=null;
  document.getElementById('tr-audio-file').value='';
  document.getElementById('tr-audio-text').textContent='Pilih file audio (mp3, wav, ogg, flac)';
  ['tr-name','tr-artist','tr-genre'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  showToast('"'+name+'" ditambahkan ke tracklist! 🎵',true);
}

// ═══════════════════════════════════════════════
// VISITOR TRACKING (non-admin, stored in sessionStorage + memory)
// ═══════════════════════════════════════════════
let activityLog = [];     // [{ts, ip, page, action, ua_short}]
let visitCount = 0;
let visitorIP = '—';

async function fetchVisitorIP(){
  if(adminSession) return; // don't track admin
  try{
    const r = await fetch('https://api.ipify.org?format=json');
    const d = await r.json();
    visitorIP = d.ip || '—';
  }catch{ visitorIP = 'unknown'; }
}

function logActivity(action, detail=''){
  if(adminSession) return; // don't log admin actions
  const entry = {
    ts: new Date().toISOString(),
    ip: visitorIP,
    action,
    detail,
    ua: navigator.userAgent.slice(0,60)
  };
  activityLog.unshift(entry);
  if(activityLog.length > 200) activityLog.pop();
  // persist in sessionStorage
  try{ sessionStorage.setItem('av_log', JSON.stringify(activityLog)); }catch{}
}

function initTracking(){
  // restore log from session
  try{
    const saved = sessionStorage.getItem('av_log');
    if(saved) activityLog = JSON.parse(saved);
    visitCount = parseInt(sessionStorage.getItem('av_visits')||'0') + 1;
    sessionStorage.setItem('av_visits', String(visitCount));
  }catch{}
  fetchVisitorIP();
  // log initial page visit
  setTimeout(()=>logActivity('Page Visit', 'Site loaded'), 800);
}

function clearActivityLog(){
  activityLog=[];
  try{sessionStorage.removeItem('av_log');}catch{}
  renderActivityLog();
  showToast('Activity log cleared.',true);
}

function renderActivityLog(){
  const wrap = document.getElementById('activity-log-wrap');
  if(!wrap) return;
  if(!activityLog.length){
    wrap.innerHTML='<p style="color:var(--text3);font-size:13px;padding:16px 0;">No activity recorded yet.</p>';
    return;
  }
  wrap.innerHTML = activityLog.map(e=>{
    const t = new Date(e.ts);
    const ts = isNaN(t.getTime()) ? '—' : t.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}) + ' · ' + t.toLocaleDateString('en-GB',{day:'numeric',month:'short'});
    return `<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:10px;font-size:12px;">
      <div style="flex-shrink:0;width:7px;height:7px;border-radius:50%;background:var(--accent);margin-top:4px;"></div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:3px;">
          <span style="font-weight:600;color:var(--text);">${escHtml(e.action)}</span>
          ${e.detail?`<span style="color:var(--text2);">${escHtml(e.detail)}</span>`:''}
        </div>
        <div style="display:flex;gap:14px;flex-wrap:wrap;">
          <span style="color:var(--accent);font-family:monospace;font-size:11px;">IP: ${escHtml(e.ip)}</span>
          <span style="color:var(--text3);font-size:10px;">${ts}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderAnalyticsStats(){
  const el = document.getElementById('analytics-stats');
  if(!el) return;
  const totalVisits = parseInt(sessionStorage.getItem('av_visits')||'1');
  const uniqueIPs = [...new Set(activityLog.map(e=>e.ip).filter(ip=>ip&&ip!=='—'))].length;
  const clickActions = activityLog.filter(e=>e.action==='Nav Click'||e.action==='Gallery Click'||e.action==='Profile Click').length;
  el.innerHTML = `
    <div class="stat-card"><div class="stat-num" style="color:var(--accent2)">${totalVisits}</div><div class="stat-label">Page Visits</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--accent)">${uniqueIPs||'—'}</div><div class="stat-label">Unique IPs</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--accent2)">${galleryItems.length}</div><div class="stat-label">Gallery Items</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--gold)">${clickActions}</div><div class="stat-label">Click Events</div></div>
  `;
}

// ═══════════════════════════════════════════════
// ADMIN AUTH
// ═══════════════════════════════════════════════
function handleAdminBtn(){
  if(adminSession) goTo('admin-dashboard');
  else openModal('login-modal');
}
// ─── Login rate-limit state ────────────────────
let _loginAttempts=0, _loginLockedUntil=0;
const LOGIN_MAX_ATTEMPTS=5, LOGIN_LOCKOUT_MS=60*1000; // 5 tries, 1 min lockout

async function doLogin(){
  // Rate limit check
  if(Date.now()<_loginLockedUntil){
    const secs=Math.ceil((_loginLockedUntil-Date.now())/1000);
    document.getElementById('login-err').textContent=`Terlalu banyak percobaan. Coba lagi dalam ${secs} detik.`;
    document.getElementById('login-err').classList.add('show');
    return;
  }
  const userRaw=document.getElementById('login-user').value.trim();
  const pass=document.getElementById('login-pass').value;
  const err=document.getElementById('login-err');
  err.classList.remove('show');
  // Input validation
  if(!userRaw||!pass){err.textContent='Isi semua kolom.';err.classList.add('show');return;}
  if(userRaw.length>64||pass.length>128){err.textContent='Input terlalu panjang.';err.classList.add('show');return;}
  // Sanitise: username must be alphanum/underscore only (prevent injection)
  const user=userRaw.replace(/[^a-zA-Z0-9_]/g,'');
  if(!user){err.textContent='Username tidak valid.';err.classList.add('show');return;}
  if(!isSupaOk()){
    if(user==='admin'&&pass==='Admin@2024') { _loginAttempts=0; onLoginSuccess(user); }
    else { _loginAttempts++; _checkLockout(err); }
    return;
  }
  try{
    const hash=await sha256(pass);
    // Use body filter with eq operator — safe from injection since hash is hex only
    const rows=await supa.get('admins',`select=id,username&username=eq.${encodeURIComponent(user)}&password_hash=eq.${hash}`);
    if(rows&&rows.length>0){ _loginAttempts=0; onLoginSuccess(rows[0].username); }
    else{ _loginAttempts++; _checkLockout(err); }
  }catch(e){ err.textContent='Error: '+String(e.message).slice(0,80); err.classList.add('show'); }
}

function _checkLockout(err){
  if(_loginAttempts>=LOGIN_MAX_ATTEMPTS){
    _loginLockedUntil=Date.now()+LOGIN_LOCKOUT_MS;
    err.textContent='Terlalu banyak percobaan. Akun terkunci 60 detik.';
  } else {
    err.textContent=`Kredensial salah. (${LOGIN_MAX_ATTEMPTS-_loginAttempts} percobaan tersisa)`;
  }
  err.classList.add('show');
}
function onLoginSuccess(username){
  adminSession={username};
  closeModal('login-modal');
  // Morph sidebar item: label → Dashboard, icon → shield
  document.getElementById('admin-nav-label').textContent='Dashboard';
  document.getElementById('nav-adminlogin').setAttribute('data-page','admin');
  document.getElementById('icon-pre-login').style.display='none';
  document.getElementById('icon-post-login').style.display='block';
  document.getElementById('nav-adminlogin').classList.add('active');
  document.getElementById('login-pass').value='';
  document.body.classList.add('admin-mode');
  const addTrackSec=document.getElementById('add-track-section');
  if(addTrackSec) addTrackSec.style.display='block';
  renderTracks(); // re-render to show remove buttons
  if(document.getElementById('admin-session-label'))
    document.getElementById('admin-session-label').textContent='Logged in as '+username;
  showToast('Welcome, '+username+'! 👋',true);
  goTo('admin-dashboard');
}
function adminLogout(){
  adminSession=null;
  _loginAttempts=0; // reset rate limit on logout
  document.getElementById('admin-nav-label').textContent='Admin';
  document.getElementById('nav-adminlogin').setAttribute('data-page','');
  document.getElementById('icon-pre-login').style.display='block';
  document.getElementById('icon-post-login').style.display='none';
  document.getElementById('nav-adminlogin').classList.remove('active');
  document.body.classList.remove('admin-mode');
  const addTrackSec=document.getElementById('add-track-section');
  if(addTrackSec) addTrackSec.style.display='none';
  renderTracks(); // re-render without remove buttons
  // Clear any sensitive fields
  document.getElementById('login-pass').value='';
  goTo('home');
  showToast('Logged out.',true);
}

// ═══════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════
async function loadGallery(){
  if(!isSupaOk()){galleryItems=[...DEFAULT_GALLERY];renderGallery();return;}
  try{const r=await supa.get('gallery_items','select=*&order=date_updated.desc');galleryItems=r&&r.length?r:[...DEFAULT_GALLERY];}
  catch{galleryItems=[...DEFAULT_GALLERY];}
  renderGallery();
}
function getSF(){
  let items=(galleryFilter==='all'?[...galleryItems]:galleryItems.filter(i=>(i.category||i.cat)===galleryFilter));
  if(gallerySort==='date-desc') items.sort((a,b)=>new Date(b.date_updated)-new Date(a.date_updated));
  else if(gallerySort==='date-asc') items.sort((a,b)=>new Date(a.date_updated)-new Date(b.date_updated));
  else items.sort((a,b)=>a.title.localeCompare(b.title));
  return items;
}
function renderGallery(targetId='gallery-grid'){
  const items=getSF();
  const el=document.getElementById(targetId);
  if(!el)return;
  el.innerHTML=items.map(item=>{
    const cat=item.category||item.cat||'—';
    const d=new Date(item.date_updated||item.created_at);
    const ds=isNaN(d.getTime())?'—':d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
    const safeId=String(item.id).replace(/'/g,"\\'");
    return`<div class="gallery-item" data-cat="${cat}" data-id="${escHtml(String(item.id))}" onclick="handleGalleryClick(event,'${safeId}')">
      <div class="gallery-thumb" style="background:${item.bg_color||'#1a1a2e'};">
        ${item.image_data?`<img src="${item.image_data}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" alt="${escHtml(item.title)}">`:`<span style="font-size:56px;">${item.emoji||'🎨'}</span>`}
        <div class="gallery-overlay">
          <span>View Work</span>
          ${adminSession?`<button class="gallery-del-btn" data-del-id="${escHtml(String(item.id))}">🗑 Delete</button>`:''}
        </div>
      </div>
      <div class="gallery-info">
        <div class="gallery-title">${escHtml(item.title)}</div>
        <div class="gallery-meta">${escHtml(item.artist)} · ${cat}</div>
        <div class="gallery-date-badge">Updated ${ds}</div>
      </div>
    </div>`;
  }).join('')||'<p style="color:var(--text3);padding:24px;font-size:14px;">No items found.</p>';

  // Attach delete listeners after render (avoids inline-onclick propagation issues)
  el.querySelectorAll('.gallery-del-btn').forEach(btn=>{
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      e.preventDefault();
      deleteArtwork(this.dataset.delId,e);
    });
  });
}

function handleGalleryClick(e,id){
  // Don't open view if a delete button was clicked
  if(e.target.classList.contains('gallery-del-btn')) return;
  openViewWork(id);
}

function openViewWork(id){
  const item=galleryItems.find(x=>String(x.id)===String(id));
  if(!item)return;
  if(!adminSession) logActivity('Gallery Click', item.title);
  const cat=item.category||item.cat||'—';
  const d=new Date(item.date_updated||item.created_at);
  const ds=isNaN(d.getTime())?'—':d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
  // set image area bg
  document.getElementById('vw-image-area').style.background=item.bg_color||'#1a1a2e';
  const img=document.getElementById('vw-img');
  const emoji=document.getElementById('vw-emoji');
  if(item.image_data){img.src=item.image_data;img.style.display='block';emoji.style.display='none';}
  else{img.style.display='none';img.src='';emoji.textContent=item.emoji||'🎨';emoji.style.display='block';}
  document.getElementById('vw-title').textContent=item.title;
  document.getElementById('vw-artist').textContent='by '+item.artist;
  document.getElementById('vw-cat-badge').textContent=cat;
  document.getElementById('vw-desc').textContent=item.description||'No description provided.';
  document.getElementById('vw-date').textContent='Updated '+ds;
  openModal('view-work-modal');
}
function filterGallery(cat,el){galleryFilter=cat;document.querySelectorAll('.gallery-filter').forEach(f=>f.classList.remove('active'));el.classList.add('active');renderGallery();}
function sortGallery(val){gallerySort=val;renderGallery();}
function openAddArtwork(){
  if(!adminSession){showToast('Admin access required.');return;}
  // reset form
  ['aw-title','aw-artist','aw-emoji','aw-bg','aw-desc'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('aw-cat').value='illustration';
  clearArtworkImage();
  document.getElementById('aw-err').classList.remove('show');
  openModal('artwork-modal');
}
let artworkImageData = null; // base64 data URL of uploaded image

const IMG_MIME_WHITELIST=['image/jpeg','image/png','image/webp','image/gif','image/avif'];
const IMG_MAX_MB=5;

function handleArtworkImageUpload(e){
  const file=e.target.files[0];if(!file)return;
  // Validate MIME
  if(!IMG_MIME_WHITELIST.includes(file.type)){
    showToast('Format gambar tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.');
    e.target.value='';return;
  }
  // Validate size
  if(file.size>IMG_MAX_MB*1024*1024){
    showToast(`Gambar terlalu besar. Maksimum ${IMG_MAX_MB} MB.`);
    e.target.value='';return;
  }
  const reader=new FileReader();
  reader.onload=function(ev){
    // Double-check data URL starts with safe image prefix
    const result=ev.target.result;
    if(!result.startsWith('data:image/')){
      showToast('File tidak valid.'); e.target.value=''; return;
    }
    artworkImageData=result;
    document.getElementById('aw-image-preview').src=artworkImageData;
    document.getElementById('aw-image-preview-wrap').style.display='block';
    document.getElementById('aw-upload-text').textContent=escHtml(file.name).slice(0,40);
  };
  reader.readAsDataURL(file);
}

function clearArtworkImage(){
  artworkImageData=null;
  document.getElementById('aw-image-input').value='';
  document.getElementById('aw-image-preview-wrap').style.display='none';
  document.getElementById('aw-upload-text').textContent='Click to upload image';
}

// Sanitize background color to hex/named CSS only (prevent CSS injection)
function sanitizeBgColor(val){
  const v=(val||'').trim();
  if(/^#[0-9a-fA-F]{3,8}$/.test(v)) return v;
  if(/^[a-zA-Z]+$/.test(v)) return v; // named CSS colors
  return '#1a1a2e';
}

async function submitArtwork(){
  if(!adminSession){showToast('Admin only.');return;}
  const title=document.getElementById('aw-title').value.trim().slice(0,100);
  const artist=document.getElementById('aw-artist').value.trim().slice(0,100);
  const cat=document.getElementById('aw-cat').value;
  const emoji=document.getElementById('aw-emoji').value.trim().slice(0,4)||'🎨';
  const bg=sanitizeBgColor(document.getElementById('aw-bg').value);
  const desc=document.getElementById('aw-desc').value.trim().slice(0,1000);
  const errEl=document.getElementById('aw-err');
  if(!title||!artist){errEl.textContent='Judul dan artis wajib diisi.';errEl.classList.add('show');return;}
  errEl.classList.remove('show');
  const ni={title,artist,category:cat,cat,emoji,bg_color:bg,description:desc,image_data:artworkImageData||null,date_updated:new Date().toISOString()};
  if(isSupaOk()){try{const r=await supa.post('gallery_items',ni);if(r&&r[0])ni.id=r[0].id;}catch(e){errEl.textContent='Gagal menyimpan: '+String(e.message).slice(0,60);errEl.classList.add('show');return;}}
  else ni.id='loc-'+Date.now();
  galleryItems.unshift(ni);
  renderGallery();
  if(document.getElementById('admin-gallery-grid')) renderGallery('admin-gallery-grid');
  closeModal('artwork-modal');
  showToast('Karya ditambahkan!',true);
  ['aw-title','aw-artist','aw-emoji','aw-bg','aw-desc'].forEach(id=>document.getElementById(id).value='');
  clearArtworkImage();
  if(adminSession) updateAdminStats();
}
async function deleteArtwork(id,e){
  if(e){e.stopPropagation();e.preventDefault();}
  if(!confirm('Hapus karya ini?')) return;
  if(isSupaOk()&&!String(id).startsWith('loc-')){
    try{await supa.del('gallery_items',`id=eq.${id}`);}
    catch(er){showToast('Delete gagal: '+er.message);return;}
  }
  galleryItems=galleryItems.filter(i=>String(i.id)!==String(id));
  renderGallery();
  const adminGrid=document.getElementById('admin-gallery-grid');
  if(adminGrid) renderGallery('admin-gallery-grid');
  showToast('Karya dihapus.',true);
  if(adminSession) updateAdminStats();
}

// ═══════════════════════════════════════════════
// ANNOUNCEMENT SYSTEM — Supabase backed
// ═══════════════════════════════════════════════
let announcements = [];
let activeAnnouncement = null;

async function loadAnnouncements(){
  if(isSupaOk()){
    try{
      const rows=await supa.get('announcements','select=*&order=published_at.desc');
      announcements=rows||[];
      activeAnnouncement=announcements.find(a=>a.active)||null;
      return;
    }catch(e){console.warn('Ann load err:',e);}
  }
  // fallback sessionStorage
  try{
    const s=sessionStorage.getItem('av_announcements');
    if(s) announcements=JSON.parse(s);
    const a=sessionStorage.getItem('av_active_announcement');
    if(a) activeAnnouncement=JSON.parse(a);
  }catch{}
}

async function saveAnnouncement(ann){
  if(isSupaOk()){
    try{
      if(ann.id&&!String(ann.id).startsWith('ann-')){
        await supa.patch('announcements',`id=eq.${ann.id}`,ann);
      } else {
        const created=ann.id;
        const toSave={title:ann.title,message:ann.message,published_at:ann.published_at,active:ann.active};
        const r=await supa.post('announcements',toSave);
        if(r&&r[0]) ann.id=r[0].id;
      }
    }catch(e){console.warn('Ann save err:',e);}
  }
  // always mirror to sessionStorage as fallback
  try{
    sessionStorage.setItem('av_announcements',JSON.stringify(announcements));
    if(activeAnnouncement) sessionStorage.setItem('av_active_announcement',JSON.stringify(activeAnnouncement));
    else sessionStorage.removeItem('av_active_announcement');
  }catch{}
}

async function deactivateAllAnnouncements(){
  if(isSupaOk()){
    try{ await supa.req('/announcements?active=eq.true',{method:'PATCH',body:JSON.stringify({active:false}),headers:{'Prefer':'return=minimal'}}); }catch{}
  }
}

async function publishAnnouncement(){
  const title=document.getElementById('ann-title-input').value.trim();
  const msg=document.getElementById('ann-msg-input').value.trim();
  if(!title||!msg){showToast('Judul dan pesan wajib diisi.');return;}
  await deactivateAllAnnouncements();
  announcements.forEach(a=>a.active=false);
  const ann={id:'ann-'+Date.now(),title,message:msg,published_at:new Date().toISOString(),active:true};
  announcements.unshift(ann);
  activeAnnouncement=ann;
  await saveAnnouncement(ann);
  showBannerForVisitor(ann);
  renderAnnouncementList();
  document.getElementById('ann-title-input').value='';
  document.getElementById('ann-msg-input').value='';
  showToast('Pengumuman dipublikasikan! 📢',true);
}

async function clearActiveAnnouncement(){
  await deactivateAllAnnouncements();
  activeAnnouncement=null;
  announcements.forEach(a=>a.active=false);
  try{sessionStorage.removeItem('av_active_announcement');}catch{}
  hideBanner();
  renderAnnouncementList();
  showToast('Pengumuman aktif dihapus.',true);
}

async function activateAnnouncement(id){
  await deactivateAllAnnouncements();
  announcements.forEach(a=>a.active=false);
  const ann=announcements.find(a=>String(a.id)===String(id));
  if(!ann)return;
  ann.active=true;
  activeAnnouncement=ann;
  if(isSupaOk()&&!String(id).startsWith('ann-')){
    try{await supa.patch('announcements',`id=eq.${id}`,{active:true});}catch{}
  }
  try{sessionStorage.setItem('av_active_announcement',JSON.stringify(ann));}catch{}
  showBannerForVisitor(ann);
  renderAnnouncementList();
  showToast('Pengumuman diaktifkan!',true);
}

async function deleteAnnouncement(id){
  if(!confirm('Hapus pengumuman ini?'))return;
  if(activeAnnouncement&&String(activeAnnouncement.id)===String(id)){activeAnnouncement=null;hideBanner();}
  if(isSupaOk()&&!String(id).startsWith('ann-')){
    try{await supa.del('announcements',`id=eq.${id}`);}catch{}
  }
  announcements=announcements.filter(a=>String(a.id)!==String(id));
  try{sessionStorage.setItem('av_announcements',JSON.stringify(announcements));}catch{}
  renderAnnouncementList();
  showToast('Pengumuman dihapus.',true);
}

function renderAnnouncementList(){
  const wrap=document.getElementById('ann-list-wrap');
  if(!wrap)return;
  if(!announcements.length){wrap.innerHTML='<p style="color:var(--text3);font-size:13px;padding:8px 0;">Belum ada pengumuman.</p>';return;}
  wrap.innerHTML=announcements.map(ann=>{
    const t=new Date(ann.published_at);
    const ts=isNaN(t.getTime())?'—':t.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})+' '+t.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    return`<div class="ann-card ${ann.active?'active-ann':''}">
      <div class="ann-card-body">
        <div class="ann-card-title">${escHtml(ann.title)} ${ann.active?'<span style="font-size:9px;background:var(--accent);color:var(--bg);padding:2px 8px;border-radius:50px;letter-spacing:.06em;margin-left:6px;">AKTIF</span>':''}</div>
        <div class="ann-card-msg">${escHtml(ann.message)}</div>
        <div class="ann-card-meta">📅 ${ts}</div>
      </div>
      <div class="ann-card-actions">
        ${!ann.active?`<button class="btn btn-gold btn-sm" onclick="activateAnnouncement('${escAttr(String(ann.id))}')">Aktifkan</button>`:''}
        <button class="btn btn-danger btn-sm" onclick="deleteAnnouncement('${escAttr(String(ann.id))}')">Hapus</button>
      </div>
    </div>`;
  }).join('');
}

function showBannerForVisitor(ann){
  document.getElementById('ann-banner-text').innerHTML=`<strong>${escHtml(ann.title)}:</strong> ${escHtml(ann.message)}`;
  document.getElementById('announcement-banner').classList.add('show');
  document.body.classList.add('has-announcement');
}

function hideBanner(){
  document.getElementById('announcement-banner').classList.remove('show');
  document.body.classList.remove('has-announcement');
}

function dismissAnnouncement(){
  hideBanner();
  try{sessionStorage.setItem('av_ann_dismissed', activeAnnouncement?String(activeAnnouncement.id):'');}catch{}
}

async function initAnnouncements(){
  await loadAnnouncements();
  if(!activeAnnouncement)return;
  try{
    const dismissed=sessionStorage.getItem('av_ann_dismissed');
    if(dismissed===String(activeAnnouncement.id))return;
  }catch{}
  setTimeout(()=>showBannerForVisitor(activeAnnouncement), 1200);
}
async function submitContact(e){
  e.preventDefault();
  const btn=document.getElementById('cf-submit');
  // Basic validation
  const nameRaw=document.getElementById('cf-name').value.trim();
  const emailRaw=document.getElementById('cf-email').value.trim();
  const subjectRaw=document.getElementById('cf-subject').value.trim();
  const bodyRaw=document.getElementById('cf-body').value.trim();
  if(!nameRaw||!emailRaw||!subjectRaw||!bodyRaw){ showToast('Semua kolom wajib diisi.'); return; }
  if(nameRaw.length>100||subjectRaw.length>200||bodyRaw.length>5000){
    showToast('Input terlalu panjang.'); return;
  }
  // Email format check (basic)
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)){ showToast('Format email tidak valid.'); return; }
  btn.textContent='Sending…';btn.disabled=true;
  const data={
    sender_name:nameRaw.slice(0,100),
    sender_email:emailRaw.slice(0,200),
    subject:subjectRaw.slice(0,200),
    body:bodyRaw.slice(0,5000),
    is_read:false,
    created_at:new Date().toISOString()
  };
  const local={...data,id:'loc-'+Date.now()};
  if(isSupaOk()){
    try{
      const r=await supa.post('messages',{sender_name:data.sender_name,sender_email:data.sender_email,subject:data.subject,body:data.body,is_read:false});
      if(r&&r[0]) local.id=r[0].id;
    }catch(er){
      console.warn('Message save failed:',er);
    }
  }
  messages.unshift(local);
  const unread=messages.filter(m=>!m.is_read).length;
  document.getElementById('contact-dot').classList.toggle('show',unread>0);
  document.getElementById('admin-nav-badge').classList.toggle('show',unread>0);
  btn.innerHTML='<span class="en-text">✓ Sent!</span><span class="id-text">✓ Terkirim!</span><span class="ja-text">✓ 送信完了!</span>';
  btn.style.background='var(--accent2)';
  document.getElementById('contact-form').reset();
  setTimeout(()=>{btn.innerHTML='<span class="en-text">Send Message →</span><span class="id-text">Kirim Pesan →</span><span class="ja-text">送信する →</span>';btn.style.background='';btn.disabled=false;},3000);
}

// ═══════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════
async function loadAdminDashboard(){
  await Promise.all([loadMessages(), loadAnnouncements()]);
  updateAdminStats();
  renderGallery('admin-gallery-grid');
  renderAnalyticsStats();
  renderActivityLog();
  renderAnnouncementList();
  renderAdminGreeting();
}

function renderAdminGreeting(){
  const now=new Date();
  const hour=now.getHours();
  const day=now.getDay(); // 0=Sun
  const dayNum=now.getDate();
  const months=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const dayNames=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const greetings=[
    {g:'✨ Selamat pagi, Admin!',q:'Hari baru, kanvas baru. Kreativitas dimulai dari langkah pertama.',e:'🌅'},
    {g:'🎨 Selamat pagi, kreator!',q:'Seni terbaik lahir dari semangat pagi yang tak padam.',e:'☕'},
    {g:'🌿 Pagi yang segar!',q:'Setiap karya besar dimulai dari satu goresan penuh keyakinan.',e:'🌿'},
    {g:'⚡ Energi pagi, siap berkarya!',q:'Dunia menunggu karya-karya indah yang akan kamu hadirkan.',e:'⚡'},
    {g:'🌸 Pagi yang penuh inspirasi!',q:'Jadikan hari ini lebih bermakna dengan kreasi yang menyentuh hati.',e:'🌸'},
  ];
  const afternoonGreets=[
    {g:'☀️ Selamat siang, Admin!',q:'Tetap semangat — siang hari adalah waktu produktivitas terbaik.',e:'☀️'},
    {g:'🎵 Siang yang penuh nada!',q:'Karya-karya indah tidak mengenal batas waktu.',e:'🎵'},
    {g:'🌟 Terus berkarya!',q:'Setiap detail kecil yang kamu perhatikan membuat perbedaan besar.',e:'🌟'},
  ];
  const eveningGreets=[
    {g:'🌙 Selamat malam, Admin!',q:'Malam adalah saat terbaik untuk merefleksikan karya dan merencanakan yang lebih indah.',e:'🌙'},
    {g:'✨ Malam yang kreatif!',q:'Biarkan ketenangan malam menginspirasi ide-ide luar biasa.',e:'✨'},
    {g:'🎭 Waktu beristirahat dan berkreasi!',q:'Seniman terbaik tahu kapan harus berhenti dan kapan harus kembali berkarya.',e:'🎭'},
  ];
  let pool;
  if(hour>=5&&hour<12) pool=greetings;
  else if(hour>=12&&hour<18) pool=afternoonGreets;
  else pool=eveningGreets;
  // Pick based on day of week so it changes daily
  const pick=pool[day%pool.length];
  const dateStr=`${dayNames[day]}, ${dayNum} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const gEl=document.getElementById('greeting-text');
  const qEl=document.getElementById('greeting-quote');
  const dEl=document.getElementById('greeting-date');
  const eEl=document.getElementById('greeting-emoji');
  if(gEl) gEl.textContent=pick.g;
  if(qEl) qEl.textContent='"'+pick.q+'"';
  if(dEl) dEl.textContent=dateStr;
  if(eEl) eEl.textContent=pick.e;
}
function updateAdminStats(){
  const unread=messages.filter(m=>!m.is_read).length;
  const replied=messages.filter(m=>m.reply_body).length;
  const msr=document.getElementById('msg-stats-row');
  if(msr) msr.innerHTML=`
    <div class="stat-card"><div class="stat-num">${messages.length}</div><div class="stat-label">Total Pesan</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--red)">${unread}</div><div class="stat-label">Belum Dibaca</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--green)">${replied}</div><div class="stat-label">Sudah Dibalas</div></div>
  `;
  document.getElementById('contact-dot').classList.toggle('show',unread>0);
  document.getElementById('admin-nav-badge').classList.toggle('show',unread>0);
}
async function loadMessages(){
  if(isSupaOk()){try{messages=await supa.get('messages','select=*&order=created_at.desc')||[];}catch(e){console.warn(e);}}
  renderMessages();
}
function renderMessages(){
  const wrap=document.getElementById('msg-list-wrap');
  if(!messages.length){wrap.innerHTML='<p style="color:var(--text3);font-size:14px;padding:24px 0;">No messages yet.</p>';return;}
  wrap.innerHTML='<div class="msg-list">'+messages.map(m=>{
    const t=new Date(m.created_at);
    const ts=isNaN(t.getTime())?'—':t.toLocaleDateString('en-GB',{day:'numeric',month:'short'})+' '+t.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    return`<div class="msg-card ${m.is_read?'':'unread'}" onclick="openMessage('${String(m.id).replace(/'/g,"\\'")}')">
      <div class="msg-card-header"><div><div class="msg-from">${escHtml(m.sender_name)}</div><div class="msg-email">${escHtml(m.sender_email)}</div></div><div class="msg-time">${ts}</div></div>
      <div class="msg-subject">${escHtml(m.subject)}</div>
      <div class="msg-preview">${escHtml(m.body)}</div>
      <div class="msg-badges">
        ${m.is_read?'<span class="badge badge-read">Read</span>':'<span class="badge badge-unread">New</span>'}
        ${m.reply_body?'<span class="badge badge-replied">Replied</span>':''}
      </div></div>`;
  }).join('')+'</div>';
}
async function openMessage(id){
  const m=messages.find(x=>String(x.id)===String(id));if(!m)return;
  if(!m.is_read){
    m.is_read=true;
    if(isSupaOk()&&!String(id).startsWith('loc-')) supa.patch('messages',`id=eq.${id}`,{is_read:true}).catch(()=>{});
    renderMessages();updateAdminStats();
  }
  const t=new Date(m.created_at);const ts=isNaN(t.getTime())?'—':t.toLocaleString();
  const safeId=String(id);
  document.getElementById('msg-modal-content').innerHTML=`
    <h3 class="modal-title" style="font-size:22px;">${escHtml(m.subject)}</h3>
    <p class="modal-sub">From: <strong>${escHtml(m.sender_name)}</strong> &lt;${escHtml(m.sender_email)}&gt;<br>${ts}</p>
    <div class="msg-detail-body">${escHtml(m.body)}</div>
    ${m.reply_body?`<div style="margin-top:12px;padding:14px;background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.2);border-radius:12px;font-size:13px;color:var(--green);">✓ Balasan terakhir: <em>${escHtml(m.reply_body)}</em></div>`:''}
    <div class="msg-reply-area">
      <span class="msg-reply-label" style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;display:block;">Balas ke ${escHtml(m.sender_name)}</span>
      <textarea class="field-input" id="reply-textarea" style="min-height:90px;resize:none;border-radius:10px;width:100%;" placeholder="Tulis balasan...">${escHtml(m.reply_body||'')}</textarea>
      <div class="modal-actions" style="margin-top:12px;">
        <button class="btn btn-primary" id="send-reply-btn"
          data-id="${escHtml(safeId)}"
          data-email="${escHtml(m.sender_email)}"
          data-name="${escHtml(m.sender_name)}"
          data-subject="${escHtml(m.subject)}">
          ✉️ Kirim via Email
        </button>
        <button class="btn btn-secondary" onclick="closeModal('msg-modal')">Tutup</button>
      </div>
      <p style="font-size:10px;color:var(--text3);margin-top:8px;line-height:1.6;">Klik "Kirim via Email" untuk membuka klien email dengan balasan siap kirim ke <strong>${escHtml(m.sender_email)}</strong>.</p>
    </div>`;
  // Attach reply button listener after DOM insert
  document.getElementById('send-reply-btn').addEventListener('click',function(){
    const btn=this;
    sendReply(btn.dataset.id, btn.dataset.email, btn.dataset.name, btn.dataset.subject);
  });
  openModal('msg-modal');
}

async function sendReply(id,email,name,subject){
  const bodyEl=document.getElementById('reply-textarea');
  if(!bodyEl)return;
  const body=bodyEl.value.trim();
  if(!body){showToast('Tulis balasan terlebih dahulu.');return;}
  const m=messages.find(x=>String(x.id)===String(id));
  if(m) m.reply_body=body;
  if(isSupaOk()&&!String(id).startsWith('loc-')){
    supa.patch('messages',`id=eq.${id}`,{reply_body:body,replied_at:new Date().toISOString()}).catch(()=>{});
  }
  renderMessages();updateAdminStats();
  const fullBody=`Halo ${name},\n\n${body}\n\nSalam,\nArtisVerse Team\nhello@artisverse.art`;
  const mailto=`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Re: '+subject)}&body=${encodeURIComponent(fullBody)}`;
  window.open(mailto,'_blank');
  closeModal('msg-modal');
  showToast('Email siap dikirim di klien email Anda! ✉️',true);
}
function switchAdminTab(name,el){
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.admin-pane').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('apane-'+name).classList.add('active');
  if(name==='gallery-mgmt') renderGallery('admin-gallery-grid');
  if(name==='analytics'){ renderAnalyticsStats(); renderActivityLog(); }
  if(name==='messages'){ renderMessages(); updateAdminStats(); }
  if(name==='announcement'){ renderAnnouncementList(); }
}

// ═══════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════
function renderArtists(){
  document.getElementById('artists-grid').innerHTML=ARTISTS.map(a=>`
    <div class="artist-card" onclick="showProfile('${a.id}')" style="--ac-glow:${a.color}22">
      <div class="artist-avatar"><div class="artist-avatar-inner" style="background:${a.color}22;color:${a.color};">${a.initials}</div></div>
      <div class="artist-name">${a.name}</div><div class="artist-handle">${a.handle}</div>
      <div class="artist-role">${a.role}</div>
      <div class="artist-tags">${a.tags.map(t=>`<span class="artist-tag">${t}</span>`).join('')}</div>
    </div>`).join('');
}
function showProfile(id){
  logActivity('Profile Click', id);
  const a=ARTISTS.find(x=>x.id===id);if(!a)return;
  const gm={'#b89fff':'1a0840,0a0520','#7dd4fc':'0a2840,001520','#f0abfc':'380040,1a0025','#e8c97a':'3a2800,1a1000','#34d399':'003020,001510','#fb7185':'420012,200008'};
  const g=(gm[a.color]||'1a1a2e,0a0a1a').split(',');
  document.getElementById('profile-detail-content').innerHTML=`
    <div class="profile-detail-wrap">
      <div class="profile-topbar"><div class="profile-back" onclick="goTo('profile-list')"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>Back to Artists</div></div>
      <div class="profile-hero">
        <div class="profile-hero-bg" style="background:linear-gradient(135deg,#${g[0]} 0%,#${g[1]} 100%);"></div>
        <div class="profile-hero-grad"></div>
        <div class="profile-hero-content">
          <div class="profile-big-avatar" style="border-color:${a.color}"><div class="artist-avatar-inner" style="background:${a.color}22;color:${a.color};font-size:36px;">${a.initials}</div></div>
          <div class="profile-hero-name">${a.name}</div><div class="profile-hero-nick">${a.handle}</div>
        </div>
      </div>
      <div class="profile-body">
        <p class="profile-bio">"${a.bio}"</p>
        <div class="profile-status-grid">
          <div class="status-item"><div class="status-key">Occupation</div><div class="status-val">${a.occupation}</div></div>
          <div class="status-item"><div class="status-key">Birthday</div><div class="status-val">${a.birthday}</div></div>
          <div class="status-item"><div class="status-key">Age</div><div class="status-val">${a.age}</div></div>
        </div>
        <div class="profile-likes-label">Likes</div>
        <div class="likes-grid">${a.likes.map(l=>`<div class="like-item"><span class="like-icon">${l.icon}</span>${l.label}</div>`).join('')}</div>
        <div class="profile-sns">
          <a class="sns-btn" href="#" style="border-color:${a.color}44;color:${a.color};"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.76l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          <a class="sns-btn" href="#" style="border-color:${a.color}44;color:${a.color};"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
        </div>
      </div>
    </div>`;
  goTo('profile-detail');
}

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  canvas=document.getElementById('bg-canvas');ctx=canvas.getContext('2d');
  // Modal overlay click-outside-to-close
  document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');}));
  // Login on Enter key
  document.getElementById('login-pass').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
  window.addEventListener('resize',()=>{resizeCanvas();});
  resizeCanvas();drawBg();
  renderArtists();loadGallery();renderTracks();
  initTracking();
  initAnnouncements(); // async — runs in background
  // Auto-detect season
  const autoSeason=detectSeason();
  currentSeason=autoSeason;
  document.getElementById('season-auto-label').textContent=autoSeason.charAt(0).toUpperCase()+autoSeason.slice(1);
  const autoEl=document.querySelector(`#season-opts .s-opt:nth-child(${['spring','summer','autumn','winter'].indexOf(autoSeason)+1})`);
  if(autoEl) autoEl.classList.add('active');
  startParticles();
});
