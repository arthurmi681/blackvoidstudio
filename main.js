/* ── CURSOR ── */
const cur=document.getElementById('cur');
const cur2=document.getElementById('cur2');
let mx=0,my=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
  cur2.style.left=mx+'px';cur2.style.top=my+'px';
});
document.querySelectorAll('a,button,[onclick]').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
});

/* ── PAGE NAVIGATION ── */
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=document.getElementById('page-'+id);
  if(pg){pg.classList.add('active');window.scrollTo(0,0);}
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const map={home:0,servicos:1,cases:2,sobre:3,contato:4};
  const btns=document.querySelectorAll('.nav-btn');
  if(map[id]!==undefined)btns[map[id]]?.classList.add('active');
  // Re-trigger reveal animations
  setTimeout(initReveal,100);
}

/* ── HEADER SCROLL ── */
const header=document.getElementById('mainHeader');
const btt=document.getElementById('backToTop');
window.addEventListener('scroll',()=>{
  if(window.scrollY>60)header.classList.add('scrolled');
  else header.classList.remove('scrolled');
  
  if(window.scrollY>500) btt.classList.add('show');
  else btt.classList.remove('show');

  // scroll progress
  const active=document.querySelector('.page.active');
  if(active){
    const total=active.scrollHeight-window.innerHeight;
    document.getElementById('scrollProg').style.width=(total>0?Math.min((window.scrollY/total)*100,100):0)+'%';
  }
},{passive:true});

/* ── REVEAL ON SCROLL ── */
function initReveal(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting)e.target.classList.add('in-view');
    });
  },{threshold:.1,rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('.reveal-up').forEach(el=>{
    el.classList.remove('in-view');
    obs.observe(el);
  });
}
initReveal();

/* ── COUNTER ANIMATION ── */
function animCount(el,target){
  let current=0;
  const duration=1500;
  const step=target/duration*16;
  const timer=setInterval(()=>{
    current=Math.min(current+step,target);
    el.textContent=Math.floor(current);
    if(current>=target)clearInterval(timer);
  },16);
}
const cntObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.cnt').forEach(c=>animCount(c,+c.dataset.target));
      cntObs.unobserve(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('.stats-strip').forEach(el=>cntObs.observe(el));

/* ── MOBILE MENU ── */
function toggleMenu(){
  const mobileNav = document.getElementById('navMobile');
  const backdrop = document.getElementById('navBackdrop');
  if (!mobileNav || !backdrop) return;
  const isOpen = mobileNav.classList.contains('open');
  mobileNav.classList.toggle('open', !isOpen);
  backdrop.classList.toggle('open', !isOpen);
}

/* ── FORM SUBMIT ── */
document.getElementById('contactForm').addEventListener('submit',function(e){
  e.preventDefault();
  const nome=this.querySelector('input[placeholder="João Silva"]').value.trim()||'Não informado';
  const empresa=this.querySelector('input[placeholder="Empresa LTDA"]').value.trim()||'Não informado';
  const email=this.querySelector('input[type="email"]').value.trim();
  const whatsapp=this.querySelector('input[type="tel"]').value.trim()||'Não informado';
  const tipo=this.querySelector('select').value||'Não informado';
  const msg=this.querySelector('textarea').value.trim();
  const subject=encodeURIComponent(`[Black Void Studio] ${nome} — ${tipo}`);
  const body=encodeURIComponent(`✦ NOVO PROJETO — BLACK VOID STUDIO ✦\n\nNome: ${nome}\nEmpresa: ${empresa}\nE-mail: ${email}\nWhatsApp: ${whatsapp}\nSegmento: ${tipo}\n\nProjeto:\n${msg}\n\n— ${new Date().toLocaleString('pt-BR')}`);
  /* FORM HANDLER DISABLED - EmailJS only */
  // EmailJS inline script takes over
});

/* ── TOAST ── */
function showToast(msg,accent=false){
  const c=document.getElementById('toast-container');
  const t=document.createElement('div');
  t.className='toast'+(accent?' accent':'');
  t.innerHTML='<div class="tdot"></div>'+msg;
  c.appendChild(t);
  setTimeout(()=>{
    t.style.transition='opacity .4s,transform .4s';
    t.style.opacity='0';t.style.transform='translateY(-8px)';
    setTimeout(()=>t.remove(),400);
  },3000);
}

function copyEmail(e, email) {
  e.preventDefault();
  navigator.clipboard.writeText(email).then(() => {
    showToast('E-mail copiado!', true);
  });
}

/* ── LOADER ── */
(function(){
  const bar=document.getElementById('loaderBar');
  const pct=document.getElementById('loaderPct');
  const status=document.getElementById('loaderStatus');
  const loader=document.getElementById('loader');
  const steps=[
    {p:15,s:'Iniciando sistemas...'},
    {p:35,s:'Carregando assets...'},
    {p:55,s:'Renderizando interface...'},
    {p:72,s:'Configurando animações...'},
    {p:88,s:'Aplicando identidade visual...'},
    {p:100,s:'Pronto.'}
  ];
  let idx=0;
  function tick(){
    if(idx>=steps.length){
      setTimeout(()=>{
        loader.classList.add('hide');
        document.body.style.overflow='';
        setTimeout(()=>{
          loader.style.display='none';
          document.getElementById('assistant-btn').classList.add('show');
          setTimeout(()=>showToast('Black Void Studio carregado',true),600);
          setTimeout(()=>showToast('Assistente disponível — precisa de ajuda?'),2000);
        },900);
      },400);
      return;
    }
    const step=steps[idx++];
    bar.style.transition='width '+(idx===1?.3:.5)+'s cubic-bezier(.16,1,.3,1)';
    bar.style.width=step.p+'%';
    pct.textContent=step.p+'%';
    status.textContent=step.s;
    setTimeout(tick,idx===steps.length?700:Math.random()*280+150);
  }
  document.body.style.overflow='hidden';
  setTimeout(tick,300);
})();

/* ── VOID ASSISTANT ── */
const SYSTEM=`Você é o Void Assistant, a inteligência central da Black Void Studio — uma empresa de engenharia de software de elite em São Paulo especializada em IA, SaaS, Sistemas Web, Cibersegurança e Infraestrutura Cloud.

Diretrizes de resposta:
- Tom: Futurista, minimalista, autoritário, mas caloroso e profissional.
- Missão: Comunicar que a Black Void resolve problemas tecnológicos complexos com soluções de ponta.
- Escopo: 
  1. IA: Agentes autônomos, integrações de LLM, automações.
  2. Software: SaaS escaláveis, ERP/CRM customizados, Aplicações Web de alta performance.
  3. Security & Infra: Auditorias de segurança (Pentest), Cloud (AWS), DevOps.
- Projetos em destaque: KIRA AI (Auto-Agent System) e JARVIS (Automação Corporativa).
- Contato: blackvoidev@gmail.com | @blackvoid.dev
- Chamada para ação: Incentive sempre o agendamento de um diagnóstico técnico ou solicitação de orçamento.

Seja direto e conciso (máx 2-3 parágrafos).`;

let chatHistory=[];
let assistantOpen=false;

function toggleAssistant(){
  const panel=document.getElementById('assistant-panel');
  assistantOpen=!assistantOpen;
  if(assistantOpen){
    panel.classList.add('open');
    document.querySelector('.assist-notif').style.display='none';
    if(chatHistory.length===0)addBotMsg('Olá! 👋 Sou o **Void Assistant**. Posso te ajudar a entender como a Black Void Studio pode transformar sua presença digital. O que você gostaria de saber?');
    setTimeout(()=>document.getElementById('assistInput').focus(),300);
  }else{panel.classList.remove('open');}
}

function addBotMsg(text){
  const c=document.getElementById('assistMsgs');
  const d=document.createElement('div');
  d.className='amsg bot';
  const f=text.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  d.innerHTML=`<div class="amsg-av">V</div><div class="abubble">${f}</div>`;
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}
function addUserMsg(text){
  const c=document.getElementById('assistMsgs');
  const d=document.createElement('div');
  d.className='amsg user';
  d.innerHTML=`<div class="abubble">${text}</div><div class="amsg-av">👤</div>`;
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}
function showTyping(){
  const c=document.getElementById('assistMsgs');
  const d=document.createElement('div');d.className='amsg bot';d.id='typingInd';
  d.innerHTML='<div class="amsg-av">V</div><div class="typing"><div class="tdot2"></div><div class="tdot2"></div><div class="tdot2"></div></div>';
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}
function removeTyping(){const t=document.getElementById('typingInd');if(t)t.remove();}

async function sendMessage(){
  const input=document.getElementById('assistInput');
  const text=input.value.trim();if(!text)return;
  input.value='';
  document.getElementById('assistSugs').style.display='none';
  addUserMsg(text);chatHistory.push({role:'user',content:text});
  showTyping();
  try{
    const groqKey = localStorage.getItem('grok_key') || '';
    if (!groqKey) {
      removeTyping();
      addBotMsg('Assistente IA temporariamente indisponível. Use WhatsApp para contato rápido.');
      return;
    }
    const res=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body:JSON.stringify({model:'llama3-70b-8192',messages:chatHistory.map(m => ({role: m.role === 'system' ? 'system' : m.role, content: m.content})),max_tokens:1000,temperature:0.7})
    });
    const data=await res.json();removeTyping();
    const reply=data.choices?.[0]?.message?.content||'Desculpe, tive um problema. Contate: blackvoidev@gmail.com';
    chatHistory.push({role:'assistant',content:reply});addBotMsg(reply);
  }catch(e){removeTyping();addBotMsg('Erro de conexão. Entre em contato: **blackvoidev@gmail.com**');}
}

function sendSuggestion(btn){
  document.getElementById('assistInput').value=btn.textContent.replace(/^.\s/,'');
  sendMessage();
}

/* ── SMOOTH SCROLL FOR ALL LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});

/* ── PARTICLES ── */
particlesJS('particles-js',{
  particles:{
    number:{value:55,density:{enable:true,value_area:1000}},
    color:{value:'#c8ff00'},
    shape:{type:'circle'},
    opacity:{value:.1,random:true,anim:{enable:true,speed:.7,opacity_min:.02,sync:false}},
    size:{value:2,random:true},
    line_linked:{enable:true,distance:150,color:'#c8ff00',opacity:.04,width:1},
    move:{enable:true,speed:.4,direction:'none',random:true,straight:false,out_mode:'out'}
  },
  interactivity:{
    detect_on:'canvas',
    events:{onhover:{enable:true,mode:'grab'},onclick:{enable:false},resize:true},
    modes:{grab:{distance:120,line_linked:{opacity:.15}}}
  },
  retina_detect:true
});
