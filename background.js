// ═══════════════════════════════════════════════
// MUSIC — notify bar fades in 6s then hides
// ═══════════════════════════════════════════════
function showMusicBar(fadeDuration=6000){
  const bar=document.getElementById('music-bar');
  bar.classList.remove('hiding');
  bar.classList.add('show');
  clearTimeout(musicBarTimer);
  musicBarTimer=setTimeout(()=>{
    bar.classList.add('hiding');
    setTimeout(()=>bar.classList.remove('show','hiding'),500);
  },fadeDuration);
}

// ═══════════════════════════════════════════════
// BACKGROUND CANVAS
// ═══════════════════════════════════════════════
let canvas, ctx;
let bgParts=[],waveOff=0,geoAngle=0,auroraPts=[];
function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;initBgParts();}
function initBgParts(){
  bgParts=Array.from({length:70},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*2.2+.5,a:Math.random(),twinkle:Math.random()}));
  auroraPts=Array.from({length:6},(_,i)=>({x:canvas.width*i/5,y:canvas.height*.4+Math.random()*100-50,vy:(Math.random()-.5)*.5}));
}
function getAccent(){
  const t=document.body.getAttribute('data-theme');
  return{musical:'#c89fff',eco:'#6dcf82',playful:'#ff78c8',luxury:'#e8c860',math:'#00c8ff',tech:'#00ff96'}[t]||'#b89fff';
}
function drawBg(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(bgMode==='upload'){requestAnimationFrame(drawBg);return;}
  const ac=getAccent();
  switch(bgMode){
    case 'particles':
      bgParts.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;
        if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=ac+(Math.floor(p.a*45+15).toString(16).padStart(2,'0'));ctx.fill();
      });
      for(let i=0;i<bgParts.length;i++)for(let j=i+1;j<bgParts.length;j++){
        const dx=bgParts[i].x-bgParts[j].x,dy=bgParts[i].y-bgParts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<130){ctx.beginPath();ctx.moveTo(bgParts[i].x,bgParts[i].y);ctx.lineTo(bgParts[j].x,bgParts[j].y);
          ctx.strokeStyle=ac+(Math.floor((1-d/130)*20).toString(16).padStart(2,'0'));ctx.lineWidth=.5;ctx.stroke();}
      }
      break;
    case 'waves':
      waveOff+=.008;
      for(let w=0;w<5;w++){
        ctx.beginPath();
        for(let x=0;x<=canvas.width;x+=4){const y=canvas.height*(.25+w*.15)+Math.sin(x/180+waveOff+w*.7)*45;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.strokeStyle=ac+(Math.floor(18-w*3).toString(16).padStart(2,'0'));ctx.lineWidth=1;ctx.stroke();
      }
      break;
    case 'grid':
      ctx.strokeStyle=ac+'1a';ctx.lineWidth=.6;
      const sp=60;
      for(let x=0;x<canvas.width;x+=sp){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
      for(let y=0;y<canvas.height;y+=sp){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
      break;
    case 'aurora':
      auroraPts.forEach(p=>{p.y+=p.vy;if(p.y<canvas.height*.2||p.y>canvas.height*.7)p.vy*=-1;});
      for(let l=0;l<3;l++){
        const grad=ctx.createLinearGradient(0,0,canvas.width,0);
        grad.addColorStop(0,'transparent');grad.addColorStop(.3,ac+'25');grad.addColorStop(.7,ac+'18');grad.addColorStop(1,'transparent');
        ctx.beginPath();ctx.moveTo(0,canvas.height*.5);
        for(let i=0;i<auroraPts.length;i++){const p=auroraPts[i];ctx.bezierCurveTo(p.x-100,p.y+l*30,p.x+100,p.y-l*20,p.x,p.y+l*15);}
        ctx.lineTo(canvas.width,canvas.height);ctx.lineTo(0,canvas.height);ctx.closePath();
        ctx.fillStyle=grad;ctx.fill();
      }
      break;
    case 'stars':
      bgParts.forEach(p=>{
        p.twinkle=(Math.sin(Date.now()/1000+p.a*10)+1)/2;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r*.8,0,Math.PI*2);
        ctx.fillStyle=ac+(Math.floor(p.twinkle*80+20).toString(16).padStart(2,'0'));ctx.fill();
      });
      break;
    case 'noise':
      const imageData=ctx.createImageData(canvas.width,canvas.height);
      const col=parseInt(ac.slice(1),16);
      const cr=(col>>16)&255,cg=(col>>8)&255,cb=col&255;
      for(let i=0;i<imageData.data.length;i+=4){
        const v=Math.random()*15;
        imageData.data[i]=cr*.1*v;imageData.data[i+1]=cg*.1*v;imageData.data[i+2]=cb*.1*v;imageData.data[i+3]=v*3;
      }
      ctx.putImageData(imageData,0,0);
      break;
    case 'geo':
      geoAngle+=.003;
      const cx2=canvas.width/2,cy2=canvas.height/2;
      for(let r=80;r<Math.max(canvas.width,canvas.height);r+=90){
        ctx.beginPath();
        for(let s=0;s<6;s++){
          const a=geoAngle+(s*Math.PI/3);
          const x=cx2+r*Math.cos(a),y=cy2+r*Math.sin(a);
          s===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.closePath();ctx.strokeStyle=ac+(Math.floor(Math.max(0,(1-r/700)*30)).toString(16).padStart(2,'0'));
        ctx.lineWidth=.8;ctx.stroke();
      }
      break;
  }
  requestAnimationFrame(drawBg);
}

// ═══════════════════════════════════════════════
// SEASONAL PARTICLES
// ═══════════════════════════════════════════════
let sParticles=[],sFrame;
function startParticles(){
  cancelAnimationFrame(sFrame);
  document.getElementById('particle-overlay').innerHTML='';sParticles=[];
  const cfg={spring:{e:'🌸',n:20,s:.8},summer:{e:'✨',n:16,s:.5},autumn:{e:'🍂',n:22,s:1.2},winter:{e:'❄',n:25,s:.6}}[currentSeason];
  if(!cfg)return;
  for(let i=0;i<cfg.n;i++){
    const el=document.createElement('div');el.className='particle';
    el.style.cssText=`font-size:${Math.random()*16+10}px;left:${Math.random()*100}%;top:${-Math.random()*200}px;opacity:${Math.random()*.7+.3};`;
    el.textContent=cfg.e;document.getElementById('particle-overlay').appendChild(el);
    sParticles.push({el,x:parseFloat(el.style.left),y:parseFloat(el.style.top),spd:cfg.s*(Math.random()*.8+.6),drift:(Math.random()-.5)*.5});
  }
  animateSeason();
}
function animateSeason(){
  sParticles.forEach(p=>{p.y+=p.spd;p.x+=p.drift;if(p.y>window.innerHeight+50){p.y=-30;p.x=Math.random()*100;}p.el.style.top=p.y+'px';p.el.style.left=p.x+'%';});
  sFrame=requestAnimationFrame(animateSeason);
}
