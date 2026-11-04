const $=s=>document.querySelector(s),LS=localStorage;
const T={vi:{title:"Chùa Online",nHome:"Chánh điện",nLib:"Kinh tạng",nMed:"Thiền",nCal:"Lịch âm",offer:"Thắp hương",bell:"Thỉnh chuông",fish:"Gõ mõ",count:"Số lần gõ mõ",search:"Tìm kinh (tên, nội dung)…",start:"Bắt đầu",stop:"Dừng",medNote:"Chuông báo lúc bắt đầu và kết thúc.",remind:"Bật nhắc mùng 1 / rằm",offered:"Nén hương đã thắp. Nguyện an lành.",today:"Hôm nay",lunar:"Âm lịch",m1:"Mùng 1",r:"Rằm",bms:"Đánh dấu",last:"Đọc tiếp",noVi:"Chưa có bản tiếng Việt cho kinh này.",viNote:"Bản dịch tiếng Việt tải trực tiếp từ SuttaCentral (cần mạng), bản quyền thuộc dịch giả.",loading:"Đang tải…",wd:["CN","T2","T3","T4","T5","T6","T7"],nOk:"Đã bật nhắc (khi mở app vào ngày mùng 1/rằm).",nNo:"Trình duyệt không cho phép thông báo."},
en:{title:"Pagoda Online",nHome:"Shrine",nLib:"Sutras",nMed:"Meditate",nCal:"Lunar",offer:"Offer incense",bell:"Ring bell",fish:"Wooden fish",count:"Wooden fish strikes",search:"Search sutras (title, text)…",start:"Start",stop:"Stop",medNote:"A bell sounds at start and end.",remind:"Enable new/full moon reminders",offered:"Incense offered. May all beings be well.",today:"Today",lunar:"Lunar",m1:"New moon (1st)",r:"Full moon (15th)",bms:"Bookmarks",last:"Continue",noVi:"No Vietnamese translation for this text.",viNote:"Vietnamese translation is loaded live from SuttaCentral (online); copyright belongs to the translator.",loading:"Loading…",wd:["Su","Mo","Tu","We","Th","Fr","Sa"],nOk:"Reminders on (shown when opening the app on lunar 1st/15th).",nNo:"Notifications not permitted."}};
let L=LS.lang||"vi",S=[],cur=null;const t=k=>T[L][k];
function i18n(){document.documentElement.lang=L;$("#lang").textContent=L=="vi"?"EN":"VI";document.querySelectorAll("[data-i]").forEach(e=>e.textContent=t(e.dataset.i));document.querySelectorAll("[data-ph]").forEach(e=>e.placeholder=t(e.dataset.ph));renderToday();renderCal();renderList()}
$("#lang").onclick=()=>{L=LS.lang=L=="vi"?"en":"vi";i18n()};
function show(v){document.querySelectorAll(".view").forEach(s=>s.hidden=s.id!=v)}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>show(b.dataset.v));
// Audio (synthesised, no recordings)
let AC;const ac=()=>AC||(AC=new (window.AudioContext||window.webkitAudioContext)());
function bell(){const c=ac(),n=c.currentTime;[220,440,550,660,880].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=f*(1+i*0.003);g.gain.setValueAtTime(0.25/(i+1),n);g.gain.exponentialRampToValueAtTime(0.0001,n+6-i*0.8);o.connect(g).connect(c.destination);o.start(n);o.stop(n+6)})}
function fish(){const c=ac(),n=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type="triangle";o.frequency.setValueAtTime(900,n);o.frequency.exponentialRampToValueAtTime(500,n+0.08);g.gain.setValueAtTime(0.6,n);g.gain.exponentialRampToValueAtTime(0.001,n+0.15);o.connect(g).connect(c.destination);o.start(n);o.stop(n+0.2);
 $("#fishN").textContent=LS.fish=(+LS.fish||0)+1}
$("#bell").onclick=bell;$("#fish").onclick=fish;$("#fishN").textContent=LS.fish||0;
$("#offer").onclick=()=>{$("#incense").classList.add("on");$("#offerMsg").textContent=t("offered");bell();setTimeout(()=>$("#incense").classList.remove("on"),60000)};
// Library
fetch("data/suttas.json").then(r=>r.json()).then(d=>{S=d;renderList();if(LS.last&&location.hash=="")0});
function renderList(){const q=($("#q").value||"").toLowerCase().trim(),ul=$("#list");if(!ul)return;ul.innerHTML="";
 const bm=JSON.parse(LS.bm||"[]");$("#bm").innerHTML=(LS.last?`${t("last")}: <a href="#" data-u="${LS.last}">${LS.last}</a> · `:"")+(bm.length?t("bms")+": "+bm.map(u=>`<a href="#" data-u="${u}">${u}</a>`).join(", "):"");
 $("#bm").querySelectorAll("a").forEach(a=>a.onclick=e=>{e.preventDefault();open(a.dataset.u)});
 S.filter(s=>!q||(s.uid+s.title+s.pali+s.blurb).toLowerCase().includes(q)||s.segments.some(x=>x[2].toLowerCase().includes(q))).forEach(s=>{const li=document.createElement("li");li.innerHTML=`<b>${s.uid.toUpperCase()} · ${s.title}</b> <i>(${s.pali})</i><small>${s.blurb}</small>`;li.onclick=()=>open(s.uid);ul.appendChild(li)})}
$("#q").oninput=renderList;
let fs=+LS.fs||18;const setFs=()=>document.documentElement.style.setProperty("--fs",fs+"px");setFs();
$("#fp").onclick=()=>{fs=Math.min(30,fs+2);LS.fs=fs;setFs()};$("#fm").onclick=()=>{fs=Math.max(12,fs-2);LS.fs=fs;setFs()};
if(LS.night==1)document.body.classList.add("night");$("#night").onclick=()=>LS.night=+document.body.classList.toggle("night");
$("#mode").value=LS.mode||"both";$("#mode").onchange=()=>{LS.mode=$("#mode").value;render()};
$("#mark").onclick=()=>{let b=JSON.parse(LS.bm||"[]");b=b.includes(cur.uid)?b.filter(x=>x!=cur.uid):[...b,cur.uid];LS.bm=JSON.stringify(b);$("#mark").style.opacity=b.includes(cur.uid)?1:.5};
$("#back").onclick=()=>{show("lib");renderList()};
function esc(s){return s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[c])}
function open(u){cur=S.find(s=>s.uid==u);if(!cur)return;LS.last=u;show("read");$("#mark").style.opacity=JSON.parse(LS.bm||"[]").includes(u)?1:.5;render();
 const y=+LS["pos_"+u]||0;setTimeout(()=>scrollTo(0,y),50)}
addEventListener("scroll",()=>{if(cur&&!$("#read").hidden)LS["pos_"+cur.uid]=scrollY});
async function render(){const m=$("#mode").value,el=$("#text");
 if(m=="vi"){if(!cur.vi){el.innerHTML=`<p>${t("noVi")}</p>`;return}el.textContent=t("loading");
  try{const d=await (await fetch(`https://suttacentral.net/api/suttas/${cur.uid}/minh_chau?lang=vi`)).json();const doc=new DOMParser().parseFromString(d.translation.text,"text/html");
   doc.querySelectorAll("script,style,meta").forEach(x=>x.remove());el.innerHTML=`<p class="muted">${t("viNote")} — ${esc(d.translation.author||"")} · <a href="https://suttacentral.net/${cur.uid}/vi/minh_chau" target="_blank" rel="noopener">SuttaCentral</a></p>`+doc.body.innerHTML}catch(e){el.innerHTML=`<p>Offline / error.</p>`}return}
 el.innerHTML=`<p class="muted">Pāli: Mahāsaṅgīti (CC0) · English: Bhikkhu Sujato (CC0) · <a href="https://suttacentral.net/${cur.uid}/en/sujato" target="_blank" rel="noopener">SuttaCentral</a></p>`+cur.segments.map(([k,p,e])=>`<div class="p">${m!="en"&&p?`<div class="pl">${esc(p)}</div>`:""}${m!="pli"&&e?`<div>${esc(e)}</div>`:""}</div>`).join("")}
// Meditation
let mins=10,left=600,tid=null;const fmt=s=>`${String(F(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`,F=Math.floor;
document.querySelectorAll(".m").forEach(b=>b.onclick=()=>{if(tid)return;mins=+b.dataset.m;left=mins*60;$("#tdisp").textContent=fmt(left)});
$("#tstart").onclick=()=>{if(tid)return;bell();tid=setInterval(()=>{left--;$("#tdisp").textContent=fmt(left);if(left<=0){clearInterval(tid);tid=null;bell();setTimeout(bell,2500);left=mins*60}},1000)};
$("#tstop").onclick=()=>{clearInterval(tid);tid=null;left=mins*60;$("#tdisp").textContent=fmt(left)};
// Calendar
let cm=new Date();cm.setDate(1);
function renderToday(){const n=new Date(),l=Lunar.conv(n.getDate(),n.getMonth()+1,n.getFullYear());$("#today").innerHTML=`<b>${t("today")}</b>: ${n.toLocaleDateString(L=="vi"?"vi-VN":"en-GB")} · ${t("lunar")}: ${l.d}/${l.m}${l.leap?" (nhuận)":""}/${l.y}${l.d==1?" · "+t("m1"):l.d==15?" · "+t("r"):""}`;
 if(LS.notify==1&&(l.d==1||l.d==15)&&LS.notified!=n.toDateString()&&window.Notification&&Notification.permission=="granted"){new Notification("Pagoda Online",{body:l.d==1?t("m1"):t("r")});LS.notified=n.toDateString()}}
function renderCal(){const y=cm.getFullYear(),m=cm.getMonth(),g=$("#grid");$("#mlabel").textContent=`${m+1}/${y}`;g.innerHTML=t("wd").map(w=>`<div><b>${w}</b></div>`).join("");
 for(let i=0;i<cm.getDay();i++)g.innerHTML+="<div></div>";const days=new Date(y,m+1,0).getDate(),td=new Date();
 for(let d=1;d<=days;d++){const l=Lunar.conv(d,m+1,y),hl=l.d==1||l.d==15,isT=td.getFullYear()==y&&td.getMonth()==m&&td.getDate()==d;g.innerHTML+=`<div class="${hl?"hl":""} ${isT?"td":""}">${d}<div class="lu">${l.d==1?l.d+"/"+l.m:l.d}</div></div>`}}
$("#pm").onclick=()=>{cm.setMonth(cm.getMonth()-1);renderCal()};$("#nm").onclick=()=>{cm.setMonth(cm.getMonth()+1);renderCal()};
$("#notif").onclick=async()=>{if(!window.Notification){$("#nmsg").textContent=t("nNo");return}const p=await Notification.requestPermission();if(p=="granted"){LS.notify=1;$("#nmsg").textContent=t("nOk")}else $("#nmsg").textContent=t("nNo")};
i18n();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js");
