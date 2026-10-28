(async()=>{const $=i=>document.getElementById(i);let D;
try{D=await(await fetch("database/jebel-ali-data.json")).json()}catch(e){$("list").textContent="Data unavailable offline";return}
if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js");
const cats=Object.keys(D).filter(k=>!["meta","dubai_streets","transport"].includes(k));let cat=cats[1],view="explore",type="All",fav=[];
try{fav=JSON.parse(localStorage.getItem("fav")||"[]")}catch(e){}
const save=()=>{try{localStorage.setItem("fav",JSON.stringify(fav))}catch(e){}};
const all=cats.concat("transport").flatMap(c=>D[c]);const q=()=>$("q").value.toLowerCase().split(/\s+/).filter(Boolean);
const hit=i=>q().every(w=>JSON.stringify(i).toLowerCase().includes(w));
const map=n=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(n+" Dubai");
const card=i=>`<div class="card" data-n="${i.name.replace(/"/g,"")}"><span class="badge">${i.tags[0]}</span><h3>${i.name}</h3><small>${i.area}</small><p>${i.desc}</p></div>`;
function pills(){$("pills").innerHTML=cats.map(c=>`<button class="${c==cat?"on":""}" data-c="${c}">${c.replace(/_/g," ")}</button>`).join("");}
function draw(){document.querySelectorAll("section").forEach(s=>s.hidden=s.id!="v-"+view);document.querySelectorAll("footer button").forEach(b=>b.classList.toggle("on",b.dataset.v==view));
const src=q().length?all:D[cat];$("list").innerHTML=src.filter(hit).map(card).join("")||"Nothing found";$("tlist").innerHTML=D.transport.filter(hit).map(card).join("");
$("slist").innerHTML=all.filter(i=>fav.includes(i.name)).map(card).join("")||"<p class='note'>Tap a card, then Save.</p>";
const ts=["All","E","D","L","Salik free"];$("sf").innerHTML=ts.map(t=>`<button class="${t==type?"on":""}" data-t="${t}">${t=="E"?"E-Highways":t=="D"?"D-Roads":t=="L"?"Jebel Ali Local":t}</button>`).join("");
$("st").innerHTML=D.dubai_streets.filter(s=>(type=="All"||s.type==type||(type=="Salik free"&&s.salik_free))&&hit(s)).map(s=>`<div class="card"><span class="badge ${s.salik_free?"":"no"}">${s.salik_free?"Salik free":"Salik gates"}</span> <b>${s.code}</b><h3>${s.name}</h3><p>${s.desc}</p></div>`).join("")}
document.body.onclick=e=>{const t=e.target,c=t.closest("[data-c]"),tt=t.closest("[data-t]"),v=t.closest("[data-v]"),cd=t.closest(".card[data-n]");
if(c){cat=c.dataset.c;pills();draw();return}if(tt){type=tt.dataset.t;draw();return}if(v){view=v.dataset.v;draw();scrollTo(0,0);return}
if(t.id=="x"||t.id=="sheet"){$("sheet").hidden=true;return}
if(t.dataset.f){const n=t.dataset.f;fav=fav.includes(n)?fav.filter(x=>x!=n):fav.concat(n);save();t.textContent=fav.includes(n)?"Saved":"Save";draw();return}
if(cd){const i=all.find(x=>x.name==cd.dataset.n);if(!i)return;$("sb").innerHTML=`<span class="badge">${i.tags[0]}</span><h2>${i.name}</h2><p>${i.desc}</p><p><b>Area:</b> ${i.area}</p><p><b>Hours:</b> ${i.hours}</p><p><b>Transit:</b> ${i.transit||"See Transit tab"}</p><a class="b" target="_blank" rel="noopener" href="${map(i.name)}">Open in Maps</a><button data-f="${i.name.replace(/"/g,"")}">${fav.includes(i.name)?"Saved":"Save"}</button>`;$("sheet").hidden=false}};
$("q").oninput=draw;$("th").onclick=()=>document.body.classList.toggle("light");
const fare=()=>$("out").textContent="AED "+(+$("z").value*+$("c").value).toFixed(2);$("z").onchange=$("c").onchange=fare;fare();
const sal=()=>$("so").textContent="AED "+(+$("sp").value*(+$("sn").value||0)).toFixed(2);$("sp").onchange=$("sn").oninput=sal;sal();
$("ios").hidden=!(/iphone|ipad/i.test(navigator.userAgent)&&!navigator.standalone);pills();draw()})();