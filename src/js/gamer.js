let userPoints = 100, watchedVideos = 0, prizeModalPts = 0;

function scrollCarousel(id, dir) {
  const track = document.getElementById(id);
  const first = track.querySelector('.prize-card,.video-card');
  track.scrollBy({ left: dir * ((first ? first.offsetWidth : 200) + 16) * 2, behavior: 'smooth' });
}
['prizes','videos'].forEach(id => {
  const track = document.getElementById(id);
  let drag=false, sx, sl;
  track.addEventListener('mousedown', e=>{ drag=true; sx=e.pageX-track.offsetLeft; sl=track.scrollLeft; track.classList.add('grabbing'); });
  document.addEventListener('mouseup', ()=>{ drag=false; track.classList.remove('grabbing'); });
  track.addEventListener('mousemove', e=>{ if(!drag)return; e.preventDefault(); track.scrollLeft=sl-(e.pageX-track.offsetLeft-sx); });
  const dotsEl=document.getElementById(id+'-dots');
  const items=track.children;
  for(let i=0;i<items.length;i++){
    const d=document.createElement('div');
    d.className='scroll-dot'+(i===0?' active':'');
    d.onclick=()=>track.scrollTo({left:items[i].offsetLeft-track.offsetLeft,behavior:'smooth'});
    dotsEl.appendChild(d);
  }
  track.addEventListener('scroll',()=>{
    const dots=dotsEl.querySelectorAll('.scroll-dot');
    const idx=Math.round(track.scrollLeft/(track.offsetWidth||1)*(items.length/2));
    dots.forEach((d,i)=>d.classList.toggle('active',i===Math.min(idx,dots.length-1)));
  });
});

let videoTimer=null, videoProgress=0, videoSimDuration=25, isPlaying=false;
let currentVideoCard=null, currentVideoPts=0, videoCompleted=false, muted=false;

function openVideoModal(card) {
  clearInterval(videoTimer); isPlaying=false; videoProgress=0;

  currentVideoCard=card;
  currentVideoPts=parseInt(card.dataset.pts);
  videoCompleted=card.classList.contains('done');

  document.getElementById('vModalTitle').textContent=card.dataset.title;
  document.getElementById('vModalCat').textContent=card.dataset.cat;
  document.getElementById('vModalDur').innerHTML='<i class="bi bi-clock me-1"></i>'+card.dataset.dur;
  document.getElementById('vModalDesc').textContent=card.dataset.desc;
  document.getElementById('vModalThumb').src=card.dataset.thumb;
  document.getElementById('vModalPts').textContent='+'+currentVideoPts+' pts';

  document.getElementById('playerFill').style.width='0%';
  document.getElementById('earnFill').style.width='0%';
  document.getElementById('earnPct').textContent='0%';
  document.getElementById('playerCurrent').textContent='0:00';
  document.getElementById('playerTotal').textContent=card.dataset.dur;
  document.getElementById('bigPlayBtn').classList.remove('playing');
  document.getElementById('playPauseBtn').innerHTML='<i class="bi bi-play-fill"></i>';

  if(videoCompleted){
    document.getElementById('playerFill').style.width='100%';
    document.getElementById('earnFill').style.width='100%';
    document.getElementById('earnPct').textContent='100%';
    document.getElementById('playerCurrent').textContent=card.dataset.dur;
    document.getElementById('btnEarn').innerHTML='<i class="bi bi-check2-circle"></i> Já assistido';
    document.getElementById('btnEarn').disabled=true;
  } else {
    document.getElementById('btnEarn').innerHTML='<i class="bi bi-lock-fill"></i> Assista para ganhar pontos';
    document.getElementById('btnEarn').disabled=true;
  }

  document.getElementById('bufferingOverlay').style.display='flex';
  document.getElementById('playerOverlay').style.opacity='0';
  document.getElementById('videoModal').classList.add('show');

  setTimeout(()=>{
    document.getElementById('bufferingOverlay').style.display='none';
    document.getElementById('playerOverlay').style.opacity='1';
  }, 1200);
}

function startVideo() {
  document.getElementById('bigPlayBtn').classList.add('playing');
  isPlaying=true;
  document.getElementById('playPauseBtn').innerHTML='<i class="bi bi-pause-fill"></i>';
  runVideoTimer();
}

function togglePlay() {
  if(videoProgress>=videoSimDuration) return;
  if(!isPlaying){
    isPlaying=true;
    document.getElementById('playPauseBtn').innerHTML='<i class="bi bi-pause-fill"></i>';
    runVideoTimer();
  } else {
    isPlaying=false;
    document.getElementById('playPauseBtn').innerHTML='<i class="bi bi-play-fill"></i>';
    clearInterval(videoTimer);
  }
}

function toggleMute() {
  muted=!muted;
  document.getElementById('muteBtn').innerHTML=muted
    ?'<i class="bi bi-volume-mute-fill"></i>'
    :'<i class="bi bi-volume-up-fill"></i>';
}

function toggleFullscreen() {
  const el=document.getElementById('fakePlayer');
  if(!document.fullscreenElement){ el.requestFullscreen&&el.requestFullscreen(); }
  else { document.exitFullscreen&&document.exitFullscreen(); }
}

function runVideoTimer() {
  clearInterval(videoTimer);
  videoTimer=setInterval(()=>{
    videoProgress=Math.min(videoProgress+1, videoSimDuration);
    const pct=Math.round((videoProgress/videoSimDuration)*100);
    const secs=Math.floor((videoProgress/videoSimDuration)*parseDur(currentVideoCard.dataset.dur));
    const m=Math.floor(secs/60), s=secs%60;
    document.getElementById('playerFill').style.width=pct+'%';
    document.getElementById('earnFill').style.width=pct+'%';
    document.getElementById('earnPct').textContent=pct+'%';
    document.getElementById('playerCurrent').textContent=m+':'+(s<10?'0':'')+s;

    if(videoProgress>=videoSimDuration){
      clearInterval(videoTimer); isPlaying=false;
      document.getElementById('playPauseBtn').innerHTML='<i class="bi bi-play-fill"></i>';
      document.getElementById('playerCurrent').textContent=currentVideoCard.dataset.dur;
      if(!videoCompleted){
        document.getElementById('btnEarn').disabled=false;
        document.getElementById('btnEarn').innerHTML='<i class="bi bi-star-fill"></i> Ganhar +'+currentVideoPts+' pontos!';
        // pulse the button
        document.getElementById('btnEarn').style.animation='iconPulse 1.5s ease infinite';
      }
    }
  }, 180);
}

function parseDur(dur){
  const p=dur.split(':'); return parseInt(p[0])*60+parseInt(p[1]);
}

function seekVideo(e) {
  const bar=e.currentTarget;
  const pct=Math.max(0,Math.min(1,e.offsetX/bar.offsetWidth));
  videoProgress=Math.floor(pct*videoSimDuration);
  document.getElementById('playerFill').style.width=Math.round(pct*100)+'%';
  document.getElementById('earnFill').style.width=Math.round(pct*100)+'%';
  document.getElementById('earnPct').textContent=Math.round(pct*100)+'%';
}

function earnPoints() {
  if(videoCompleted) return;
  const btn=document.getElementById('btnEarn');
  btn.disabled=true; btn.style.animation='none';
  btn.innerHTML='<i class="bi bi-check2-circle"></i> Pontos adicionados!';
  videoCompleted=true;

  userPoints+=currentVideoPts; watchedVideos++;
  updatePointsDisplay();

  if(currentVideoCard){
    currentVideoCard.classList.add('done');
    const wb=currentVideoCard.querySelector('.watch-btn');
    wb.innerHTML='<i class="bi bi-check2-circle"></i> Assistido';
    wb.classList.add('watched');
    currentVideoCard.querySelector('.video-watched-badge').style.display='block';
  }
  showToast('+'+currentVideoPts+' pontos adicionados à sua conta! 🎉','success');
  setTimeout(()=>closeVideoModal(), 1400);
}

function closeVideoModal() {
  clearInterval(videoTimer); isPlaying=false;
  document.getElementById('videoModal').classList.remove('show');
}

function updatePointsDisplay() {
  const el=document.getElementById('navPoints');
  el.textContent=userPoints;
  el.classList.remove('pts-bounce');
  void el.offsetWidth;
  el.classList.add('pts-bounce');
  document.getElementById('statPts').textContent=userPoints;
  document.getElementById('statVideos').textContent=watchedVideos;
  const pct=Math.min((userPoints/1000)*100,100);
  document.getElementById('progressBar').style.width=pct+'%';
  document.getElementById('progressMeta').innerHTML=userPoints+' de <strong>1000 pts</strong>';
}

function openPrizeModal(name,pts,img,desc){
  document.getElementById('pModalTitle').textContent=name;
  document.getElementById('pModalPts').innerHTML='<i class="bi bi-star-fill me-1" style="color:var(--primary)"></i>'+pts+' pontos';
  document.getElementById('pModalImg').src=img;
  document.getElementById('pModalDesc').textContent=desc;
  prizeModalPts=parseInt(pts);
  document.getElementById('prizeModal').classList.add('show');
}
function confirmRedeem(){
  document.getElementById('prizeModal').classList.remove('show');
  const name=document.getElementById('pModalTitle').textContent;
  if(userPoints<prizeModalPts){ showToast('Pontos insuficientes! Precisa de '+prizeModalPts+' pts.','warning'); }
  else { userPoints-=prizeModalPts; updatePointsDisplay(); showToast(name+' resgatado com sucesso!','success'); }
}

// ===== TOAST =====
function showToast(msg,type){
  const c=document.getElementById('toastContainer');
  const cfg={
    success:{bg:'#EAF4FF',ibg:'rgba(83,170,255,0.15)',ic:'var(--primary-dark)',ii:'bi-check-circle-fill'},
    warning:{bg:'#FFFBEA',ibg:'rgba(255,193,7,0.15)',ic:'#92620A',ii:'bi-exclamation-circle-fill'}
  };
  const s=cfg[type]||cfg.success;
  const t=document.createElement('div');
  t.className='toast-custom'; t.style.background=s.bg;
  t.innerHTML=`<div class="toast-icon" style="background:${s.ibg};color:${s.ic}"><i class="bi ${s.ii}"></i></div><span style="flex:1">${msg}</span><span style="cursor:pointer;color:var(--text-muted);font-size:1.1rem;line-height:1" onclick="this.parentElement.remove()"><i class="bi bi-x"></i></span>`;
  c.appendChild(t);
  setTimeout(()=>{ t.style.transition='all 0.4s ease'; t.style.opacity='0'; t.style.transform='translateX(40px)'; setTimeout(()=>t.remove(),400); }, 4000);
}

setTimeout(()=>showToast('Bem-vindo de volta, Jose! 👋','success'), 700);