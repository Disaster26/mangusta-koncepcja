(function(){
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const zl=n=>Math.round(n).toLocaleString('pl-PL').replace(/ /g,' ')+' zł';

/* ---------- menu ---------- */
const ham=$('.ham'),panel=$('#panel');
function zamknij(){panel.classList.remove('otwarte');ham.setAttribute('aria-expanded','false')}
ham.addEventListener('click',()=>{const o=!panel.classList.contains('otwarte');panel.classList.toggle('otwarte',o);ham.setAttribute('aria-expanded',String(o))});
panel.addEventListener('click',e=>{if(e.target.closest('a'))zamknij()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')zamknij()});

/* ---------- dolny pasek dopiero po przewinięciu za przyciski hero ---------- */
(function(){
  const m=$('.mob'),t=$('.hero-cta');if(!m)return;
  if(!t||!('IntersectionObserver' in window)){m.classList.add('widac');return}
  new IntersectionObserver(w=>w.forEach(x=>m.classList.toggle('widac',!x.isIntersecting&&x.boundingClientRect.top<0)),{threshold:0}).observe(t);
})();

/* ---------- inspiracje ---------- */
const POZ=['ekonomiczny','standard','premium'];
const IK_PLUS='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg>',IK_OK='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8"/></svg>';
const KAT=[
  {id:'targi',n:'Targi i konferencje',t:'Gadżety na targi i konferencje',img:'kat-targi',alt:'Hala targowa ze stoiskami',o:'Coś dla każdego odwiedzającego stoisko i coś lepszego dla gości, z którymi naprawdę rozmawiasz.',p:[
    ['Smycze z nadrukiem','do identyfikatorów uczestników',0],
    ['Torby bawełniane','na materiały i katalogi z targów',0],
    ['Długopisy i notesy','dla odwiedzających stoisko',0],
    ['Bidony i kubki termiczne','dla kluczowych gości i prelegentów',1],
    ['Powerbanki z logo','nagroda w konkursie na stoisku',1]]},
  {id:'kontrahenci',n:'Dla kontrahentów',t:'Upominki dla klientów i kontrahentów',img:'kat-kontrahenci',alt:'Kubek, notes i długopis na biurku',o:'Rzeczy, które zostają na biurku klienta i przypominają o Twojej firmie każdego dnia.',p:[
    ['Notes w twardej oprawie z długopisem','na spotkanie lub do paczki z ofertą',1],
    ['Kubek termiczny w pudełku','do codziennego używania',1],
    ['Słodycze z logo','dodatek do każdej wysyłki',0],
    ['Galanteria skórzana','dla stałych, ważnych klientów',2],
    ['Pióro w etui z grawerem','na podpisanie umowy',2]]},
  {id:'swieta',n:'Święta',t:'Prezenty świąteczne',img:'kat-swieta',alt:'Złote pudełko prezentowe ze świątecznymi ozdobami',o:'Najlepiej zaplanować je jesienią: wtedy jest czas na projekt, znakowanie i spokojną wysyłkę.',p:[
    ['Kalendarze firmowe','ścienne i biurkowe na nowy rok',0],
    ['Słodycze reklamowe','czekoladki i pierniki z logo',0],
    ['Zestaw świąteczny w pudełku','kubek, herbata, słodycze, kartka',1],
    ['Koc i kubek z logo','ciepły prezent na zimę',1],
    ['Zestaw prezentowy premium','dla zarządu i kluczowych partnerów',2]]},
  {id:'eko',n:'Ekologiczne',t:'Gadżety ekologiczne',img:'kat-eko',alt:'Torba z papieru na jasnym tle',o:'Dla firm, które chcą pokazać, że myślą o środowisku, a nie tylko o tym mówią.',p:[
    ['Torby z bawełny lub juty','zamiast foliówek na wydarzeniach',0],
    ['Długopisy i ołówki z papieru lub bambusa','na konferencje i szkolenia',0],
    ['Notesy z papieru z recyklingu','dla uczestników i pracowników',0],
    ['Bidony wielorazowe','dla zespołu i gości',1],
    ['Zestawy z drewna i bambusa','upominek dla klientów',1]]},
  {id:'premium',n:'Premium',t:'Gadżety premium',img:'prem-portfele',alt:'Kolekcja skórzanych portfeli',o:'Dla osób, którym nie wręcza się długopisu. Liczy się materiał, wykończenie i opakowanie.',p:[
    ['Portfele i etui skórzane','z dyskretnym tłoczeniem logo',2],
    ['Pióra w eleganckim etui','z grawerem imienia',2],
    ['Scyzoryki i narzędzia wielofunkcyjne','prezent, który się przydaje',2],
    ['Teczki i organizery skórzane','dla zarządu i handlowców',2],
    ['Zestaw prezentowy dla zarządu','skomponowany pod konkretną osobę',2]]},
  {id:'akcje',n:'Akcje promocyjne',t:'Produkty na akcje promocyjne',img:'kat-akcje',alt:'Czapka, bidon i inne gadżety na niebieskim tle',o:'Duże nakłady, mocne kolory i marka, którą widać z daleka, także na zdjęciach z wydarzenia.',p:[
    ['Czapki z daszkiem','na plenerowe wydarzenia',0],
    ['Koszulki na wydarzenie','dla obsługi i uczestników',0],
    ['Smycze i opaski','dla gości i wolontariuszy',0],
    ['Parasole z logo','na deszczowe eventy i dla klientów',1],
    ['Leżaki i pufy z nadrukiem','strefa relaksu z Twoją marką',1]]}
];
const wybrane=new Map(); // klucz -> {n,kat}
let aktKat=KAT[0];
const chipy=$('.kat-chipy');
KAT.forEach((k,i)=>{const b=document.createElement('button');b.type='button';b.textContent=k.n;b.dataset.id=k.id;b.setAttribute('role','tab');b.setAttribute('aria-selected',i===0?'true':'false');b.addEventListener('click',()=>pokaz(k.id));chipy.appendChild(b)});
function pokaz(id){
  const k=KAT.find(x=>x.id===id)||KAT[0];aktKat=k;
  $$('.kat-chipy button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.id===k.id)));
  const img=$('#inspImg'),src='img/'+k.img+'.webp';if(!img.getAttribute('src').endsWith(k.img+'.webp')){img.classList.add('zmiana');const nowe=new Image();nowe.onload=nowe.onerror=()=>{img.src=src;img.alt=k.alt;requestAnimationFrame(()=>img.classList.remove('zmiana'))};nowe.src=src}else img.alt=k.alt;
  $('#inspTytul').textContent=k.t;$('#inspOpis').textContent=k.o;
  const ul=$('#pomysly');ul.innerHTML='';
  k.p.forEach(([n,z,p])=>{
    const key=k.id+'|'+n,jest=wybrane.has(key);
    const li=document.createElement('li');li.className='pomysl'+(jest?' wybrany':'');
    li.innerHTML=`<div><b></b><span></span><em class="poz${p===2?' p2':''}">${POZ[p]}</em></div><button type="button" class="dodaj"></button>`;
    li.querySelector('b').textContent=n;li.querySelector('span').textContent=z;
    const btn=li.querySelector('.dodaj');
    const ustaw=()=>{const on=wybrane.has(key);li.classList.toggle('wybrany',on);btn.innerHTML=on?IK_OK:IK_PLUS;btn.setAttribute('aria-label',(on?'Usuń z zapytania: ':'Dodaj do zapytania: ')+n);btn.setAttribute('aria-pressed',String(on))};
    btn.addEventListener('click',e=>{e.stopPropagation();if(wybrane.has(key))wybrane.delete(key);else wybrane.set(key,{n,kat:k.t});ustaw();odswiezListe();podsumuj()});
    li.addEventListener('click',()=>btn.click());
    ustaw();ul.appendChild(li);
  });
}
function odm(n){if(n===1)return'pomysł';const d=n%10,s=n%100;return(d>=2&&d<=4&&(s<12||s>14))?'pomysły':'pomysłów'}
function odswiezListe(){
  const n=wybrane.size;$('#listaIle').textContent=n;$('#listaSlowo').textContent=odm(n);
  const mi=$('#mobIle');mi.hidden=!n;mi.textContent=n;
}
// linki z oferty otwierające konkretną kategorię
$$('[data-kat]').forEach(a=>a.addEventListener('click',()=>pokaz(a.dataset.kat)));
pokaz('targi');

/* ---------- kreator zapytania ---------- */
const stan={};
const NAZWY={cel:'Co zamawiasz',ile:'Dla ilu osób',budzet:'Budżet na osobę',termin:'Termin',pomysl:'Pomysł'};
const KIER=[
  'długopisy, smycze, torby bawełniane, notesy, słodycze z logo',
  'kubki i kubki termiczne, bidony, notesy w twardej oprawie, koszulki, parasole',
  'zestawy powitalne w pudełku, bluzy i polary z haftem, termosy, głośniki i powerbanki',
  'galanteria skórzana, pióra w etui, zestawy prezentowe premium, markowe produkty'
];
$$('#krForm .chipy').forEach(g=>{
  g.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    const p=g.dataset.p,on=b.getAttribute('aria-pressed')!=='true';
    g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));
    if(on){b.setAttribute('aria-pressed','true');stan[p]=b}else delete stan[p];
    podsumuj();
  });
  g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));
});
// przycisk premium ustawia odpowiedzi
$$('a[data-cel]').forEach(a=>a.addEventListener('click',()=>{
  wybierz('cel',a.dataset.cel);wybierz('budzet',a.dataset.budzet);podsumuj();
}));
function wybierz(p,v){const g=$(`#krForm .chipy[data-p="${p}"]`);g.querySelectorAll('button').forEach(x=>{const on=x.dataset.v===v;x.setAttribute('aria-pressed',String(on));if(on)stan[p]=x})}

const termin=$('#termin'),elast=$('#terminElast');
(function(){const d=new Date();d.setDate(d.getDate()+1);termin.min=d.toISOString().slice(0,10)})();
function dniDo(){if(!termin.value)return null;const t=new Date(termin.value+'T12:00:00'),d=new Date();d.setHours(12,0,0,0);return Math.round((t-d)/864e5)}
function terminTxt(){
  if(termin.value){const [y,m,d]=termin.value.split('-');return `${d}.${m}.${y}`+(elast.checked?' (elastyczny)':'')}
  return elast.checked?'elastyczny':''
}
function terminInfo(){
  const n=dniDo(),el=$('#terminInfo');
  if(n===null){el.textContent='';return}
  const tyg=Math.floor(n/7);
  el.textContent=n<=0?'Wybierz datę w przyszłości.':`Do terminu zostało ${n} ${n===1?'dzień':'dni'}${tyg>=1?' (ok. '+tyg+' '+(tyg===1?'tydzień':(tyg%10>=2&&tyg%10<=4&&(tyg%100<12||tyg%100>14))?'tygodnie':'tygodni')+')':''}. Czas realizacji zależy od produktu i znakowania, potwierdzimy go w wycenie.`;
}
termin.addEventListener('input',()=>{terminInfo();podsumuj()});
elast.addEventListener('change',podsumuj);
$('#opis').addEventListener('input',podsumuj);

function podsumuj(){
  const ul=$('#podsLista');ul.innerHTML='';
  const wiersz=(k,v)=>{const li=document.createElement('li');li.innerHTML='<span></span><b></b>';li.firstChild.textContent=k;li.lastChild.textContent=v;ul.appendChild(li)};
  ['cel','ile','budzet'].forEach(p=>{if(stan[p])wiersz(NAZWY[p],stan[p].dataset.v)});
  const tt=terminTxt();if(tt)wiersz(NAZWY.termin,tt);
  if(stan.pomysl)wiersz(NAZWY.pomysl,stan.pomysl.dataset.v);
  // budżet łączny
  const bb=$('#podsBudzet');
  if(stan.ile&&stan.budzet){
    const a=+stan.ile.dataset.min,b=+stan.ile.dataset.max,c=+stan.budzet.dataset.min,d=+stan.budzet.dataset.max;
    const lo=a*c,hi=b*d;let kw;
    if(hi&&lo)kw=zl(lo)+' - '+zl(hi);
    else if(hi)kw='do '+zl(hi);
    else if(lo)kw='od '+zl(lo);
    else kw='od '+zl(c)+' / os.';
    $('#pbKwota').textContent=kw;
    const poz=+stan.budzet.dataset.poz;
    $('#pbPoziom').textContent='Poziom: '+POZ[poz]+' · '+stan.ile.dataset.v.toLowerCase()+' os. × '+stan.budzet.dataset.v.toLowerCase();
    bb.hidden=false;
  }else bb.hidden=true;
  // kierunki
  const kk=$('#podsKier');
  if(stan.budzet){const i=['Do 20 zł','20-50 zł','50-100 zł','Powyżej 100 zł'].indexOf(stan.budzet.dataset.v);
    let t=KIER[i];if(stan.cel&&stan.cel.dataset.v==='Odzież firmową')t=['koszulki z nadrukiem, czapki z daszkiem','koszulki z haftem lub DTF, czapki, polo','bluzy, polary, softshelle z haftem','kurtki i tekstylia premium z haftem'][i];
    $('#kierTxt').textContent=t.charAt(0).toUpperCase()+t.slice(1)+'.';kk.hidden=false}else kk.hidden=true;
  // inspiracje
  const pi=$('#podsInsp'),il=$('#inspLista');il.innerHTML='';
  wybrane.forEach(v=>{const li=document.createElement('li');li.textContent=v.n;il.appendChild(li)});
  pi.hidden=!wybrane.size;
  $('#podsPusto').hidden=!!(ul.children.length||wybrane.size);
}
podsumuj();

function trescZapytania(){
  const L=['Zapytanie ze strony www.mangusta.com.pl',''];
  ['cel','ile','budzet'].forEach(p=>{if(stan[p])L.push(NAZWY[p]+': '+stan[p].dataset.v)});
  const tt=terminTxt();if(tt)L.push('Termin: '+tt);
  if(stan.pomysl)L.push('Pomysł czy inspiracja: '+stan.pomysl.dataset.v);
  const op=$('#opis').value.trim();if(op)L.push('Opis: '+op);
  if(wybrane.size){L.push('','Pomysły z inspiracji:');wybrane.forEach(v=>L.push('- '+v.n+' ('+v.kat+')'))}
  L.push('','Kontakt: '+$('#imie').value.trim()+($('#firma').value.trim()?', '+$('#firma').value.trim():''));
  L.push('E-mail: '+$('#email').value.trim());
  if($('#tel').value.trim())L.push('Telefon: '+$('#tel').value.trim());
  return L.join('\n');
}
$('#krForm').addEventListener('submit',e=>{
  e.preventDefault();
  const bl=[],imie=$('#imie'),em=$('#email');
  [imie,em].forEach(x=>x.classList.remove('zle'));
  if(!stan.cel&&!wybrane.size&&!$('#opis').value.trim())bl.push('zaznacz, co chcesz zamówić');
  if(!imie.value.trim()){bl.push('podaj imię');imie.classList.add('zle')}
  if(!/^\S+@\S+\.\S+$/.test(em.value.trim())){bl.push('podaj poprawny e-mail');em.classList.add('zle')}
  if(!$('#zgoda').checked)bl.push('zaznacz zgodę na kontakt');
  $('#blad').textContent=bl.length?'Prawie gotowe: '+bl.join(', ')+'.':'';
  if(bl.length)return;
  $('#wyslaneTxt').textContent=trescZapytania();
  const w=$('#wyslane');w.hidden=false;w.focus({preventScroll:true});w.scrollIntoView({behavior:'smooth',block:'start'});
});
$('#kopiuj').addEventListener('click',async()=>{
  const b=$('#kopiuj'),t=$('#wyslaneTxt').textContent;
  try{await navigator.clipboard.writeText(t);b.textContent='Skopiowano'}catch(_){
    const r=document.createRange();r.selectNodeContents($('#wyslaneTxt'));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Zaznaczono, skopiuj Ctrl+C'}
  setTimeout(()=>b.textContent='Kopiuj treść zapytania',2200);
});
$('#noweZap').addEventListener('click',()=>{$('#wyslane').hidden=true;$('#krForm').scrollIntoView({behavior:'smooth',block:'start'})});
})();
