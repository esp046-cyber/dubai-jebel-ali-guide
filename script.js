(async()=>{const $=i=>document.getElementById(i);let D;
try{D=window.__D||await(await fetch("database/jebel-ali-data.json")).json()}catch(e){$("list").textContent="Data unavailable offline";return}
if("serviceWorker"in navigator&&location.protocol!="file:")navigator.serviceWorker.register("service-worker.js").catch(()=>{});
const SP=window.__D?"":"assets/icons.svg",ic=n=>`<svg class="ic"><use href="${SP}#i-${n}"/></svg>`;
const R=[["churches","Churches","church"],["malls","Malls","mall"],["restaurants","Food","dining"],["gyms","Gyms","gym"],["markets","Markets","market"],["study_masteral","Master's","cap"],["study_pmp","PMP","badge"],["jogging_walking_bike","Jog & Bike","bike"],["other_places","Places","beach"],["car_repair","Car & RTA","car"],["government_civic","Gov & Visa","gov"],["markets_technical","Hardware & Tech","gear"],["other_parts","Areas","pin"],["dubai_streets","Roads","highway"]];
let cat="churches",view="explore",type="All roads",fav=[];try{fav=JSON.parse(localStorage.getItem("fav")||"[]")}catch(e){}
const save=()=>{try{localStorage.setItem("fav",JSON.stringify(fav))}catch(e){}};
const all=R.filter(r=>r[0]!="dubai_streets").flatMap(r=>D[r[0]]).concat(D.transport);
const words=()=>$("q").value.toLowerCase().split(/\s+/).filter(Boolean),hit=i=>words().every(w=>JSON.stringify(i).toLowerCase().includes(w));
const isI=/iphone|ipad|macintosh/i.test(navigator.userAgent),mapU=n=>(isI?"https://maps.apple.com/?q=":"https://www.google.com/maps/search/?api=1&query=")+encodeURIComponent(n+" Dubai");
const hue=i=>i.hue??[...i.tags[0]].reduce((a,c)=>a+c.charCodeAt(0),0)*37%360,esc=s=>String(s).replace(/"/g,"");
const metro=i=>{const m=(i.transit||"").match(/([A-Z][A-Za-z.' ]*? Metro)/);return m?m[1]:""};
const card=i=>`<div class="card" style="--h:${hue(i)}" data-n="${esc(i.name)}"><div class="top"><span class="badge">${i.tags[0]}</span>${metro(i)?`<span class="mp">🚇 ${metro(i)}</span>`:""}</div><h3>${i.name}</h3><p>${i.desc}</p><div class="act"><button data-d="${esc(i.name)}">Details</button><a target="_blank" rel="noopener" href="${mapU(i.name)}">Map</a><button data-f="${esc(i.name)}" aria-label="Save">${fav.includes(i.name)?"⭐":"☆"}</button></div></div>`;
function pills(){$("pills").innerHTML=R.map(r=>`<button class="cat-pill ${(view=="roads"?r[0]=="dubai_streets":view=="explore"&&r[0]==cat)?"active on":""}" data-c="${r[0]}">${ic(r[2])}${r[1]}</button>`).join("")}
function draw(){document.querySelectorAll("section").forEach(s=>s.hidden=s.id!="v-"+view);document.querySelectorAll("footer button").forEach(b=>b.classList.toggle("on",b.dataset.v==view));pills();
$("list").innerHTML=(words().length?all:D[cat]).filter(hit).map(card).join("")||"<p class='note'>Nothing found</p>";document.querySelectorAll("#v-transit .big").forEach(c=>c.hidden=words().length>0);$("tlist").innerHTML=D.transport.filter(hit).map(card).join("");
$("slist").innerHTML=all.filter(i=>fav.includes(i.name)&&hit(i)).map(card).join("")||"<p class='note'>Tap the star on a card to save it here.</p>";
$("sf").innerHTML=["All roads","E","D","L","Salik free"].map(t=>`<button class="road-pill ${t==type?"on":""}" data-t="${t}">${t=="E"?"E-Highways":t=="D"?"D-Roads":t=="L"?"Jebel Ali Local":t}</button>`).join("");
$("st").innerHTML=D.dubai_streets.filter(s=>(type=="All roads"||s.type==type||(type=="Salik free"&&s.salik_free))&&hit(s)).map(s=>`<div class="card" style="--h:${s.salik_free?160:30}"><div class="top"><span class="badge ${s.salik_free?"":"no"}">${s.salik_free?"Salik free":"Salik gates"}</span><span class="mp">${s.code}</span></div><h3>${s.name}</h3><p>${s.desc}</p></div>`).join("")}
const row=(e,l,v)=>v?`<div class="row"><span>${e}</span><div><b>${l}</b>${v}</div></div>`:"";
function sheet(n){const i=all.find(x=>x.name==n);if(!i)return;$("sb").innerHTML=`<span class="badge" style="--h:${hue(i)}">${i.tags[0]}</span><h2>${i.name}</h2><p>${i.desc}</p>${row("📍","Area",i.area)}${row("⏰","Hours",i.hours)}${row("🚇","Transit",i.transit)}${row("💡","Resident tip",i.tip)}<div class="two"><a target="_blank" rel="noopener" href="${mapU(i.name)}">🗺️ Open in Maps</a><button data-f="${esc(i.name)}">${fav.includes(i.name)?"⭐ Saved":"☆ Save to Favorites"}</button></div>`;$("sheet").hidden=false}
const ST=D.meta.stations,A=["Jabal Ali (R38)","Ibn Battuta (R39)","Energy (R40)","Danube (R41)","Life Pharmacy (R42)"],B=["The Gardens (R70)","Discovery Gardens (R71)","Al Furjan (R72)","Jumeirah Golf Estates (R73)","DIP (R74)","Expo 2020 (R76)"];
const node=(n,x,y,c,la)=>`<g data-s="${n}"><circle cx="${x}" cy="${y}" r="18" fill="transparent"/><circle cx="${x}" cy="${y}" r="8" fill="var(--bg)" stroke="${c}" stroke-width="4"/><text x="${la=="e"?x-16:x+16}" y="${y+4}" text-anchor="${la=="e"?"end":"start"}">${n.replace(/ \(R\d+\)/,"").replace("Jumeirah Golf Estates","JGE").replace("Discovery Gardens","Discovery Gdns")} <tspan opacity=".6">${(n.match(/R\d+/)||[""])[0]}</tspan></text></g>`;
$("map").innerHTML=`<text x="200" y="16" text-anchor="middle" opacity=".6">to Centrepoint / Rashidiya</text><path d="M200 22V50" stroke="#D4AF37" stroke-width="6"/><path d="M200 50L150 90V300" stroke="#D4AF37" stroke-width="6" fill="none" stroke-linejoin="round"/><path d="M200 50L250 90V355" stroke="#10B981" stroke-width="6" fill="none" stroke-linejoin="round"/>
<rect x="60" y="372" width="12" height="12" rx="3" fill="#D4AF37"/><text x="78" y="383">Life Pharmacy branch</text><rect x="220" y="372" width="12" height="12" rx="3" fill="#10B981"/><text x="238" y="383">Expo 2020 branch</text>`+
`<g data-s="Jabal Ali (R38)"><circle cx="200" cy="50" r="20" fill="transparent"/><circle cx="200" cy="50" r="12" fill="#fff" stroke="#0B132B" stroke-width="4"/><text x="222" y="46">Jabal Ali <tspan opacity=".6">R38</tspan></text></g>`+
A.slice(1).map((n,k)=>node(n,150,120+k*60,"#D4AF37","e")).join("")+B.map((n,k)=>node(n,250,120+k*47,"#10B981","w")).join("");
document.body.onclick=e=>{const t=e.target,g=k=>t.closest("["+k+"]");let el;
if(el=g("data-s")){$("sb").innerHTML=`<h2>${el.dataset.s}</h2>${row("🚇","What's here",ST[el.dataset.s])}`;$("sheet").hidden=false;return}
if(el=g("data-c")){document.querySelectorAll(".cat-pill").forEach(p=>p.classList.remove("active","on"));$("q").value="";scrollTo(0,0);if(el.dataset.c=="dubai_streets")view="roads";else{cat=el.dataset.c;view="explore"}draw();return}
if(el=g("data-t")){type=el.dataset.t;draw();return}
if(el=g("data-f")){const n=el.dataset.f;fav=fav.includes(n)?fav.filter(x=>x!=n):fav.concat(n);save();if(!$("sheet").hidden)sheet(n);draw();return}
if(el=g("data-d")){sheet(el.dataset.d);return}
if(g("data-v")){view=g("data-v").dataset.v;$("q").value="";draw();scrollTo(0,0);return}
if(t.id=="x"||t.id=="sheet"){$("sheet").hidden=true;return}
if(t.closest("a"))return;if(el=g("data-n")){sheet(el.dataset.n)}};
$("q").oninput=draw;$("th").onclick=()=>document.body.classList.toggle("light");
const fare=()=>$("out").textContent="AED "+(+$("z").value*+$("c").value).toFixed(2);$("z").onchange=$("c").onchange=fare;fare();
const sal=()=>$("so").textContent="AED "+(+$("sp").value*(+$("sn").value||0)).toFixed(2);$("sp").onchange=$("sn").oninput=sal;sal();
function salik(){const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Dubai",weekday:"short",hour:"numeric",hour12:false}).formatToParts(new Date()),h=+p.find(x=>x.type=="hour").value%24,d=p.find(x=>x.type=="weekday").value;let r,c;
if(h>=1&&h<6){r="Free now (until 6 AM)";c="#10B981"}else if(d!="Sun"&&((h>=6&&h<10)||(h>=16&&h<20))){r="Peak rate now";c="#ef4444"}else{r="Off-peak rate now";c="#f59e0b"}$("dot").style.background=c;$("sal").parentElement.title=r}
salik();setInterval(salik,60000);$("ios").hidden=!(/iphone|ipad/i.test(navigator.userAgent)&&!navigator.standalone);draw()})();