(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  // Theme
  const themeBtn = $('#themeBtn');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme')||'light';
  root.setAttribute('data-theme', savedTheme);
  themeBtn.onclick = () => {
    const t = root.getAttribute('data-theme')==='light'?'dark':'light';
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  };

  // Default categories
  const defaultCategories = {
    "الأدب والقصص": {icon:"📖", grad:"secondary", filters:["قصير","كلاسيكي","سردي"]},
    "الفكر والفلسفة": {icon:"💡", grad:"secondary", filters:["فلسفة","تأملات","معرفة"]},
    "العلم والمعرفة": {icon:"🧪", grad:"primary", filters:["تبسيط علمي","تاريخ علم","عقل"]},
    "التكنولوجيا والمستقبل": {icon:"💻", grad:"primary", filters:["تقنية","مستقبل","ابتكار"]},
    "الحكم والاقتباسات": {icon:"✨", grad:"secondary", filters:["اقتباسات","حكمة","ملهم"]},
    "قصص للمتعة": {icon:"🎨", grad:"accent", filters:["أطفال","فتيان","بوليسية","شبابية"]},
    "English Classics": {icon:"🌐", grad:"primary", filters:["Short","Classic","Adventure"]}
  };

  // Seed books
  const seedBooks = [
    {id:"b-hayy", title:"حي بن يقظان", author:"ابن طفيل", category:"الفكر والفلسفة", lang:"ar", duration:50, pages:96, tags:["فلسفة","قصة","معرفة"], summary:"قصة إنسان نشأ منفردًا يكتشف بالعقل والحس قوانين الطبيعة ومعنى الوجود، ثم يلتقي المجتمع ليقارن بين المعرفة الفطرية والدين الاجتماعي.", quote:"من تأمّل في الكون بانفتاح، قاده النظر إلى معنى يتجاوز الأشياء.", cover_url:""},
    {id:"b-ghufran", title:"رسالة الغفران (مختارات)", author:"أبو العلاء المعري", category:"الأدب والقصص", lang:"ar", duration:60, pages:120, tags:["كلاسيكي","سردي"], summary:"رحلة أدبية تخييلية في العالم الآخر، تمزج النقد والسخرية واللغة الشعرية.", quote:"اللغة طريقٌ إلى المعنى، لكنها لا تحيط به.", cover_url:""},
    {id:"b-alf", title:"ألف ليلة وليلة (حكايات مختارة)", author:"مجهول", category:"الأدب والقصص", lang:"ar", duration:55, pages:140, tags:["سردي","كلاسيكي"], summary:"مختارات من حكايات شهرزاد المدهشة، بخيالٍ واسع وحِكَم مبثوثة.", quote:"الحكاية جسرٌ بين الخيال والحكمة.", cover_url:""},
    {id:"b-kalila", title:"كليلة ودمنة (مختارات)", author:"ابن المقفّع", category:"قصص للمتعة", lang:"ar", duration:25, pages:80, tags:["أطفال","حكمة"], summary:"حكايات على ألسنة الحيوان تُعلّم بالحكاية والرمز.", quote:"الحكمة تطرق القلب عبر قصةٍ لطيفة.", cover_url:""},
    {id:"b-medit", title:"التأملات (مختارات)", author:"Marcus Aurelius", category:"الفكر والفلسفة", lang:"en", duration:40, pages:110, tags:["تأملات","رواقية"], summary:"مختارات من تأملات الإمبراطور الفيلسوف حول النفس والفضيلة والطمأنينة.", quote:"اضبط نفسك والزمن يلين.", cover_url:""},
    {id:"b-origin", title:"أصل الأنواع (ملخّص مبسّط)", author:"Charles Darwin", category:"العلم والمعرفة", lang:"en", duration:45, pages:130, tags:["تبسيط علمي","تاريخ علم"], summary:"ملخص مبسّط لنظرية الانتقاء الطبيعي وأمثلتها.", quote:"التغيّر الصغير يصنع أثرًا كبيرًا عبر الزمن.", cover_url:""},
    {id:"b-faraday", title:"عن الكهرباء والضوء (محاضرات)", author:"Michael Faraday", category:"العلم والمعرفة", lang:"en", duration:30, pages:90, tags:["تبسيط علمي","فيزياء"], summary:"محاضرات مبسطة تكشف جمال الظواهر الكهربائية والبصرية.", quote:"العلم دهشةٌ منظمة.", cover_url:""},
    {id:"b-sherlock", title:"مغامرات شرلوك هولمز (مختارات)", author:"Arthur Conan Doyle", category:"قصص للمتعة", lang:"en", duration:45, pages:105, tags:["بوليسية","ممتع"], summary:"مختارات قصيرة من قضايا هولمز وواتسون المليئة بالدهشة.", quote:"في التفاصيل تكمن الحقيقة.", cover_url:""},
    {id:"b-treasure", title:"جزيرة الكنز (ملخّص)", author:"R. L. Stevenson", category:"قصص للمتعة", lang:"en", duration:35, pages:95, tags:["فتيان","مغامرة"], summary:"رحلة البحث عن كنزٍ تحفّها المخاطر والصداقة.", quote:"الشجاعة تُكتشف في الطريق.", cover_url:""},
    {id:"b-time", title:"The Time Machine", author:"H. G. Wells", category:"English Classics", lang:"en", duration:40, pages:110, tags:["Classic","Sci-Fi"], summary:"رحلة عبر الزمن تكشف وجوه الحضارة والإنسان.", quote:"الزمن مرآةٌ لنا لا نحب أن نحدّق فيها طويلًا.", cover_url:""},
    {id:"b-pride", title:"Pride and Prejudice (Highlights)", author:"Jane Austen", category:"English Classics", lang:"en", duration:50, pages:140, tags:["Classic","Society"], summary:"مقتطفات تسلط الضوء على العلاقات والطبائع البشرية.", quote:"القلوب تفهم ما تعجز العبارات عنه.", cover_url:""},
    {id:"b-metam", title:"The Metamorphosis", author:"Franz Kafka", category:"English Classics", lang:"en", duration:35, pages:90, tags:["Classic","Absurd"], summary:"تحوّل غريب يفتح أسئلة حول الذات والعائلة.", quote:"أحيانًا يُوقظك الغريب فيك.", cover_url:""}
  ];

  const defaultDB = {
    version:2,
    settings:{theme: localStorage.getItem('theme')||'light'},
    categories: defaultCategories,
    books: seedBooks,
    progress: {},
    library:{ favorites:[], later:[], downloads:[] },
    stats:{ finished:0, minutes:0, byCat:{}, streak:0, lastRead: null },
    quizzes:{
      "b-hayy":[
        {q:"ما محور رحلة حي بن يقظان؟", a:["المال","اكتشاف المعرفة بالعقل","السفر"], c:1},
        {q:"ما العائق عند لقائه المجتمع؟", a:["اللغة","الغذاء","الطقس"], c:0},
        {q:"بنية النص أقرب إلى؟", a:["تاريخي","قصصي-فلسفي","علمي تجريبي"], c:1}
      ]
    },
    texts:{
      "b-hayy":"ينشأ حي منفردًا في جزيرةٍ منعزلة، فيتعلم بالملاحظة كيف تعمل الكائنات من حوله...",
      "b-sherlock":"يقصّ واتسون واحدة من قضايا هولمز حيث تقود ملاحظةٌ صغيرة إلى كشف لغزٍ كبير..."
    },
    notes:{} // { bookId: [ {id, text, pos(0..1|null), ts} ] }
  };

  const DBKEY = 'smartPocketLibDB';
  let db = JSON.parse(localStorage.getItem(DBKEY)||'null');
  if(!db){ db = JSON.parse(JSON.stringify(defaultDB)); saveDB(); }
  if(!db.categories) db.categories = JSON.parse(JSON.stringify(defaultDB.categories));
  if(!db.notes) db.notes = {};

  // Helpers
  const saveDB = ()=> localStorage.setItem(DBKEY, JSON.stringify(db));
  const fmtMin = m => (m>=60? (Math.round(m/6)/10+" س"): (m+"د"));
  const getBook = id => db.books.find(b=>b.id===id);
  const catGrad = g => g==='primary'?'bg-primary':(g==='accent'?'bg-accent':'bg-secondary');
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const newId = (prefix='b')=> `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`;
  const fmtDate = ts => new Date(ts).toLocaleString('ar-EG', {hour12:false});
  const escapeHTML = s => s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));

  // Views
  const views = {
    home: $('#view-home'),
    sections: $('#view-sections'),
    category: $('#view-category'),
    book: $('#view-book'),
    reader: $('#view-reader'),
    done: $('#view-done'),
    library: $('#view-library'),
    profile: $('#view-profile'),
    admin: $('#view-admin'),
    editor: $('#view-editor')
  };
  const tabs = $$('.tab');
  let stack = ['home'];
  const goto = (v)=>{ Object.values(views).forEach(el=>el.classList.remove('active')); views[v].classList.add('active');
                      tabs.forEach(t=>t.classList.toggle('active', t.dataset.tab===v));
                      if(stack.at(-1)!==v) stack.push(v); window.scrollTo({top:0,behavior:'smooth'}); };

  // Home
  function renderHome(){
    const homeCats = $('#homeCats'); homeCats.innerHTML='';
    Object.entries(db.categories).forEach(([name,conf])=>{
      const count = db.books.filter(b=>b.category===name).length;
      const div = document.createElement('div');
      div.className = `cat ${catGrad(conf.grad)}`;
      div.innerHTML = `<div>${conf.icon} ${name}</div><small>${count} كتاب</small>`;
      div.onclick=()=>openCategory(name);
      homeCats.appendChild(div);
    });
    const progIds = Object.entries(db.progress).filter(([id,p])=>p.progress>0 && p.progress<1).map(([id])=>id);
    const continueBlock = $('#continueBlock');
    if(progIds.length){
      continueBlock.style.display='block';
      const list = $('#continueList'); list.innerHTML='';
      progIds.slice(0,3).forEach(id=>{ const b = getBook(id); if(b) list.appendChild(bookCard(b)); });
    } else { continueBlock.style.display='none'; }
    const latestRow = $('#latestRow'); latestRow.innerHTML='';
    db.books.slice(-6).forEach(b=>{
      const conf = db.categories[b.category]||{grad:'primary',icon:'📘'};
      const el = document.createElement('div');
      el.style.flex='0 0 auto';
      el.innerHTML = `
        <div class="smallCover ${catGrad(conf.grad)}" data-id="${b.id}">
          ${b.cover_url?`<img src="${b.cover_url}" alt="cover">`:`${b.title[0]||'•'}`}
        </div>
        <div style="max-width:110px;font-size:12px;margin-top:4px">${b.title}</div>`;
      el.querySelector('.smallCover').onclick=()=>openBook(b.id);
      latestRow.appendChild(el);
    });
  }

  function bookCard(b){
    const conf = db.categories[b.category]||{grad:'primary',icon:'📘'};
    const wrap = document.createElement('div');
    wrap.className='bookCard';
    wrap.onclick = (e)=>{ if(e.target.closest('button')) return; openBook(b.id); };
    const prog = db.progress[b.id]?.progress||0;
    wrap.innerHTML=`
      <div class="cover ${catGrad(conf.grad)}">
        ${b.cover_url?`<img src="${b.cover_url}" alt="cover">`:`<div style="font-size:26px">${b.title[0]||'•'}</div>`}
        <div class="progressRing" style="--p:${Math.round(prog*100)}"></div>
        <div class="badge">⏱️ ${fmtMin(b.duration)}</div>
      </div>
      <div class="meta">
        <div class="title">${b.title}</div>
        <div class="author">${b.author}</div>
        <div class="chips">
          <div class="chip">${b.category}</div>
          ${(b.tags||[]).slice(0,2).map(t=>`<div class="chip">${t}</div>`).join('')}
        </div>
        <div class="actions">
          <button class="btn primary" data-id="${b.id}" data-action="read">📖 قراءة</button>
          <button class="btn" data-id="${b.id}" data-action="listen">🎧 ملخص</button>
        </div>
      </div>
    `;
    wrap.querySelector('[data-action="read"]').onclick = (e)=>{ e.stopPropagation(); openBook(b.id,true); };
    wrap.querySelector('[data-action="listen"]').onclick = (e)=>{ e.stopPropagation(); openAudio(b.id); };
    return wrap;
  }

  function renderSections(){
    const grid = $('#sectionsGrid'); grid.innerHTML='';
    Object.entries(db.categories).forEach(([name,conf])=>{
      const count = db.books.filter(b=>b.category===name).length;
      const d = document.createElement('div');
      d.className=`cat ${catGrad(conf.grad)}`;
      d.innerHTML=`<div>${conf.icon} ${name}</div><small>${count} كتاب</small>`;
      d.onclick=()=>openCategory(name);
      grid.appendChild(d);
    });
  }

  function openCategory(name){
    $('#catTitle').textContent = name;
    const conf = db.categories[name] || {icon:'📘',grad:'primary',filters:[]};
    const filtersWrap = $('#catFilters'); filtersWrap.innerHTML='';
    const all = ['الكل', ...conf.filters];
    let activeFilter = 'الكل';
    all.forEach(f=>{
      const c = document.createElement('div');
      c.className='pill'+(f===activeFilter?' active':'');
      c.textContent = f;
      c.onclick = ()=>{ activeFilter=f; renderList(); filtersWrap.querySelectorAll('.pill').forEach(p=>p.classList.toggle('active', p.textContent===f)); };
      filtersWrap.appendChild(c);
    });
    const list = $('#catList'); list.innerHTML='';
    function renderList(){
      list.innerHTML='';
      let books = db.books.filter(b=>b.category===name);
      if(activeFilter!=='الكل'){ books = books.filter(b=>(b.tags||[]).includes(activeFilter)); }
      if(!books.length){ list.innerHTML = `<div class="empty">لا توجد عناوين ضمن هذا الفلتر.</div>`; return; }
      books.forEach(b=> list.appendChild(bookCard(b)));
    }
    renderList();
    goto('category');
  }

  function openBook(id, directToReader=false){
    const b = getBook(id);
    if(!b) return;
    const conf = db.categories[b.category]||{grad:'primary',icon:'📘'};
    $('#bookTitleTop').textContent = b.title;
    const prog = db.progress[b.id]?.progress||0;
    const det = $('#bookDetail');
    const heroBG = b.cover_url? `background-image:url('${b.cover_url}')` : '';
    det.innerHTML = `
      <div class="hero ${catGrad(conf.grad)}" style="${heroBG}">
        <div class="overlay"></div>
        <div class="big">${b.title}</div>
        <div class="badgeCat">${conf.icon} ${b.category}</div>
      </div>
      <div class="hstack" style="justify-content:space-between">
        <div style="font-weight:800">${b.title}</div>
        <div class="hstack">
          <button class="iconbtn" id="editBookBtn" title="تحرير">✏️</button>
          <button class="iconbtn" id="favBtn" title="مفضلة">${db.library.favorites.includes(b.id)?'★':'☆'}</button>
        </div>
      </div>
      <div style="color:var(--muted);margin-top:-4px">${b.author}</div>
      <div class="kicker" style="margin-top:10px">الملخص</div>
      <div>${b.summary}</div>
      <div class="kicker">بيانات</div>
      <div class="statline">
        <div class="stat">الصفحات: ${b.pages}</div>
        <div class="stat">⏱️ ${fmtMin(b.duration)}</div>
        <div class="stat">اللغة: ${b.lang==='ar'?'عربية':'English'}</div>
        <div class="stat">التقدّم: ${Math.round(prog*100)}%</div>
      </div>
      <div class="actions" style="margin-top:10px">
        <button class="btn primary" id="startRead">ابدأ القراءة</button>
        <button class="btn" id="listenBtn">🎧 استمع للملخص</button>
      </div>
      <div class="actions" style="margin-top:6px">
        <button class="btn" id="addLib">${db.library.later.includes(b.id)?'✔️ مُضاف لاحقًا':'➕ للقراءة لاحقًا'}</button>
        <button class="btn" id="shareQ">↗️ شارك اقتباس</button>
      </div>
      <div class="quote">✨ "${b.quote}"</div>

      <div class="divider"></div>
      <div class="kicker">الملاحظات</div>
      <div class="form">
        <div class="field"><textarea id="noteText" placeholder="اكتب ملاحظتك هنا..."></textarea></div>
        <div class="field">
          <label>اربط الملاحظة بنسبة التقدّم (اختياري)</label>
          <input type="range" id="notePos" min="0" max="100" step="5" value="${Math.round(prog*100)}"/>
          <div style="color:var(--muted);font-size:12px">النسبة: <span id="notePosLbl">${Math.round(prog*100)}%</span></div>
        </div>
        <div class="hstack" style="gap:8px">
          <button class="btn primary" id="addNoteBtn">➕ إضافة ملاحظة</button>
          <button class="btn" id="goReaderFromNotes">الذهاب للقارئ</button>
        </div>
      </div>
      <div id="notesList"></div>

      <div class="divider"></div>
      <div class="kicker">عناوين مشابهة</div>
      <div class="row" id="similarRow"></div>
    `;
    // Similar
    const sim = db.books.filter(x=>x.category===b.category && x.id!==b.id).slice(0,6);
    const simRow = $('#similarRow'); simRow.innerHTML='';
    sim.forEach(s=>{
      const cconf = db.categories[s.category]||{grad:'primary'};
      const div = document.createElement('div');
      div.innerHTML = `<div class="smallCover ${catGrad(cconf.grad)}" data-id="${s.id}">${s.cover_url?`<img src="${s.cover_url}"/>`:(s.title[0]||'•')}</div><div style="max-width:110px;font-size:12px;margin-top:4px">${s.title}</div>`;
      div.querySelector('.smallCover').onclick=()=>openBook(s.id);
      simRow.appendChild(div);
    });

    // Buttons
    $('#editBookBtn').onclick = ()=> openEditor(b.id);
    $('#favBtn').onclick = ()=>{ toggleFav(b.id); openBook(b.id); };
    $('#addLib').onclick = ()=>{ toggleLater(b.id); openBook(b.id); };
    $('#shareQ').onclick = async ()=>{ try{ await navigator.clipboard.writeText(`"${b.quote}" — ${b.title}`); alert('تم نسخ الاقتباس ✔️'); }catch{ alert('تعذّر النسخ.'); } };
    $('#listenBtn').onclick = ()=> openAudio(b.id);
    $('#startRead').onclick = ()=> openReader(b.id);

    const pos = $('#notePos'); const posLbl = $('#notePosLbl');
    pos.oninput = ()=> posLbl.textContent = pos.value+'%';
    $('#goReaderFromNotes').onclick = ()=> openReader(b.id);
    $('#addNoteBtn').onclick = ()=>{
      const txt = $('#noteText').value.trim();
      if(!txt){ alert('اكتب الملاحظة أولًا.'); return; }
      const p = Number($('#notePos').value)/100;
      addNote(b.id, txt, isNaN(p)?null:p);
      $('#noteText').value=''; renderBookNotes(b.id);
      alert('تمت إضافة الملاحظة ✔️');
    };

    renderBookNotes(b.id);
    goto('book');
    if(directToReader) openReader(b.id);
  }

  function renderBookNotes(bookId){
    const wrap = $('#notesList'); wrap.innerHTML='';
    const notes = (db.notes[bookId]||[]).slice().sort((a,b)=>b.ts-a.ts);
    if(!notes.length){ wrap.innerHTML = `<div class="empty">لا توجد ملاحظات بعد.</div>`; return; }
    notes.forEach(n=>{
      const div = document.createElement('div');
      div.className='noteItem';
      div.innerHTML = `
        <div>${escapeHTML(n.text).replace(/\n/g,'<br>')}</div>
        <div class="noteMeta">📌 ${n.pos!=null? Math.round(n.pos*100)+'%':'بدون نسبة'} • 🕒 ${fmtDate(n.ts)}</div>
        <div class="hstack" style="gap:8px;margin-top:6px">
          <button class="btn" data-action="edit">✏️ تعديل</button>
          <button class="btn" data-action="jump">📖 إلى القارئ</button>
          <button class="btn" data-action="copy">📋 نسخ</button>
          <button class="btn danger" data-action="del">🗑️ حذف</button>
        </div>
      `;
      div.querySelector('[data-action="edit"]').onclick = ()=>{
        const nt = prompt('حرّر الملاحظة:', n.text);
        if(nt!=null){ editNote(bookId, n.id, nt); renderBookNotes(bookId); }
      };
      div.querySelector('[data-action="jump"]').onclick = ()=>{
        if(n.pos!=null){ setProgress(bookId, n.pos); }
        openReader(bookId);
      };
      div.querySelector('[data-action="copy"]').onclick = ()=>{ navigator.clipboard.writeText(n.text).then(()=>alert('نُسخت الملاحظة ✔️')); };
      div.querySelector('[data-action="del"]').onclick = ()=>{ if(confirm('حذف هذه الملاحظة؟')){ deleteNote(bookId, n.id); renderBookNotes(bookId); renderLibrary(); } };
      wrap.appendChild(div);
    });
  }

  function addNote(bookId, text, pos=null){
    if(!db.notes[bookId]) db.notes[bookId]=[];
    db.notes[bookId].push({id:newId('n'), text, pos, ts: Date.now()});
    saveDB();
  }
  function editNote(bookId, noteId, text){
    const arr=db.notes[bookId]||[]; const n=arr.find(x=>x.id===noteId); if(!n) return;
    n.text = text; n.ts = Date.now(); saveDB();
  }
  function deleteNote(bookId, noteId){
    const arr=db.notes[bookId]||[]; const i=arr.findIndex(x=>x.id===noteId); if(i>=0){ arr.splice(i,1); saveDB(); }
  }

  function toggleFav(id){
    const i = db.library.favorites.indexOf(id);
    if(i>=0) db.library.favorites.splice(i,1); else db.library.favorites.push(id);
    saveDB();
  }
  function toggleLater(id){
    const i = db.library.later.indexOf(id);
    if(i>=0) db.library.later.splice(i,1); else db.library.later.push(id);
    saveDB();
  }

  function openReader(id){
    const b = getBook(id); if(!b) return;
    $('#readTitle').textContent = b.title;
    const pb = db.progress[id]?.progress||0;
    const text = db.texts[id] || (b.summary + '\n\n' + 'هذا نص معاينة للقارئ. يمكنك تمديده لاحقًا.');
    $('#readerBox').innerHTML = `
      <div class="readTop">
        <div class="hstack" style="gap:6px">
          <div class="chip">${b.category}</div>
          <div class="chip">⏱️ ${fmtMin(b.duration)}</div>
        </div>
        <div class="spacer"></div>
        <div style="color:var(--muted);font-size:13px">التقدّم: <b id="readProgLbl">${Math.round(pb*100)}%</b></div>
      </div>
      <div class="progressBar"><div id="readProgBar" style="width:${pb*100}%"></div></div>
      <div class="readBox" id="readContent" style="min-height:40vh;white-space:pre-wrap">${text}</div>
      <div class="actions">
        <button class="btn" id="minus10">-10%</button>
        <button class="btn primary" id="plus10">+10%</button>
        <button class="btn" id="finish">إنهاء الكتاب</button>
      </div>
    `;
    $('#minus10').onclick = ()=>{ setProgress(id, clamp(pb - 0.1,0,1)); openReader(id); };
    $('#plus10').onclick = ()=>{ setProgress(id, clamp((db.progress[id]?.progress||0)+0.1,0,1)); openReader(id); };
    $('#finish').onclick = ()=>{ finishBook(id); openDone(id); };
    goto('reader');
  }

  function setProgress(id, p){
    const b = getBook(id); if(!b) return;
    const cur = db.progress[id]?.progress||0;
    const delta = Math.max(0,p-cur);
    const minutesDelta = Math.round(delta * b.duration);
    if(!db.progress[id]) db.progress[id]={progress:0, minutes:0, startedAt:new Date().toISOString()};
    db.progress[id].progress = p;
    db.progress[id].minutes += minutesDelta;
    db.stats.minutes += minutesDelta;
    db.stats.byCat[b.category] = (db.stats.byCat[b.category]||0) + minutesDelta;
    updateStreak();
    saveDB();
  }
  function finishBook(id){
    setProgress(id,1);
    if(!db.progress[id].finishedAt){
      db.progress[id].finishedAt=new Date().toISOString();
      db.stats.finished += 1;
      const cat = getBook(id).category;
      if(cat==="الفكر والفلسفة") db.achv_philo = true;
      if(cat==="العلم والمعرفة") db.achv_science = true;
      if(cat==="قصص للمتعة") db.achv_fun = true;
      saveDB();
    }
  }
  function updateStreak(){
    const today = new Date().toISOString().slice(0,10);
    const last = db.stats.lastRead;
    if(!last){ db.stats.lastRead = today; db.stats.streak = 1; return; }
    if(last===today) return;
    const d1 = new Date(last), d2=new Date(today);
    const diffDays = Math.round((d2 - d1)/86400000);
    db.stats.streak = (diffDays===1)? db.stats.streak+1 : 1;
    db.stats.lastRead = today;
  }

  function openDone(id){
    const b = getBook(id);
    const quiz = (db.quizzes||{})[id]||[];
    const box = $('#completionBox');
    box.innerHTML = `
      <div class="hstack" style="gap:8px">
        <div class="chip">✅ أنهيت: ${b.title}</div>
        <div class="chip">التصنيف: ${b.category}</div>
      </div>
      <div class="kicker">الملخص الذكي ✨</div>
      <ul style="margin-top:-4px">
        <li>أفكار رئيسية: ${b.summary.split(/[.،]/).slice(0,3).join('،')}.</li>
        <li>اقتباس بارز: “${b.quote}”.</li>
        <li>مدة القراءة: ${fmtMin(b.duration)} — الصفحات: ${b.pages}.</li>
        <li>للتوسّع: عناوين مشابهة في نفس القسم.</li>
      </ul>
      <div class="kicker">Quiz قصير</div>
      <div id="quizBox"></div>
      <div class="actions" style="margin-top:8px">
        <button class="btn" onclick="navigator.clipboard.writeText('أنهيت '+${JSON.stringify(b.title)}+' 🎉')">📝 شارك</button>
        <button class="btn primary" onclick="app.openCategory('${b.category}')">اكتشف مشابه</button>
      </div>
    `;
    const qb = $('#quizBox');
    if(!quiz.length){ qb.innerHTML = '<div class="empty">لا يوجد Quiz لهذا العنوان.</div>'; }
    else {
      quiz.forEach((q,i)=>{
        const div=document.createElement('div'); div.style.margin='8px 0';
        div.innerHTML = `<div style="font-weight:700">${i+1}) ${q.q}</div>
          <div class="hstack" style="margin-top:6px;gap:6px;flex-wrap:wrap">
            ${q.a.map((opt,ix)=>`<button class="btn" data-i="${ix}">${String.fromCharCode(0x41+ix)}) ${opt}</button>`).join('')}
          </div>
          <div class="chips" style="margin-top:6px"></div>`;
        const chips = div.querySelector('.chips');
        div.querySelectorAll('button').forEach(btn=>{
          btn.onclick=()=>{ const ix = +btn.dataset.i; chips.innerHTML = ix===q.c? `<div class="chip" style="background:#DCFCE7;color:#065F46">✔ إجابة صحيحة</div>`:
                                                                                       `<div class="chip" style="background:#FEE2E2;color:#991B1B">✖ إجابة خاطئة</div>`; };
        });
        qb.appendChild(div);
      });
    }
    goto('done');
  }

  function renderLibrary(){
    const wrap = $('#libLists'); wrap.innerHTML='';
    const sections = [
      {title:'المفضلة', ids: db.library.favorites},
      {title:'لاحقًا', ids: db.library.later},
      {title:'قيد القراءة', ids: Object.entries(db.progress).filter(([id,p])=>p.progress>0 && p.progress<1).map(([id])=>id)},
      {title:'منتهية', ids: Object.entries(db.progress).filter(([id,p])=>p.progress===1).map(([id])=>id)}
    ];
    sections.forEach(sec=>{
      const div = document.createElement('div');
      div.innerHTML = `<div class="kicker">${sec.title}</div>`;
      if(!sec.ids.length){ div.innerHTML += `<div class="empty">لا يوجد عناصر.</div>`; }
      else {
        sec.ids.forEach(id=>{ const b=getBook(id); if(b) div.appendChild(bookCard(b)); });
      }
      wrap.appendChild(div);
    });

    // Notes aggregator
    const notesWrap = $('#notesAll'); notesWrap.innerHTML='';
    const all = Object.entries(db.notes).flatMap(([bookId, arr])=> (arr||[]).map(n=>({bookId, ...n})));
    if(!all.length){ notesWrap.innerHTML = `<div class="empty">لا توجد ملاحظات بعد.</div>`; return; }
    all.sort((a,b)=>b.ts-a.ts);
    all.forEach(n=>{
      const b = getBook(n.bookId); if(!b) return;
      const item = document.createElement('div');
      item.className='noteItem';
      item.innerHTML = `
        <div style="font-weight:700">${b.title}</div>
        <div style="margin-top:6px">${escapeHTML(n.text).slice(0,220)}${n.text.length>220?'…':''}</div>
        <div class="noteMeta">📌 ${n.pos!=null? Math.round(n.pos*100)+'%':'بدون نسبة'} • 🕒 ${fmtDate(n.ts)}</div>
        <div class="hstack" style="gap:8px;margin-top:6px">
          <button class="btn" data-action="open">فتح الكتاب</button>
          <button class="btn" data-action="reader">📖 فتح القارئ</button>
          <button class="btn danger" data-action="del">🗑️ حذف</button>
        </div>
      `;
      item.querySelector('[data-action="open"]').onclick = ()=> openBook(b.id);
      item.querySelector('[data-action="reader"]').onclick = ()=>{
        if(n.pos!=null) setProgress(b.id, n.pos);
        openReader(b.id);
      };
      item.querySelector('[data-action="del"]').onclick = ()=>{
        if(confirm('حذف هذه الملاحظة؟')){ deleteNote(b.id, n.id); renderLibrary(); }
      };
      notesWrap.appendChild(item);
    });
  }

  function renderProfile(){
    $('#statBooks').textContent = db.stats.finished;
    $('#statHours').textContent = (Math.round(db.stats.minutes/6)/10) || 0;
    const tc = $('#topCats'); tc.innerHTML='';
    const pairs = Object.entries(db.stats.byCat||{});
    if(!pairs.length){ tc.innerHTML = '<div class="chip">—</div>'; }
    else {
      const total = pairs.reduce((a,[,m])=>a+m,0)||1;
      pairs.sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([cat,m])=>{
        const pct = Math.round((m/total)*100);
        const c = document.createElement('div');
        c.className='chip';
        c.textContent = `${cat} ${pct}%`;
        tc.appendChild(c);
      });
    }
    const achv = $('#achievements'); achv.innerHTML='';
    const items = [
      db.achv_philo && '🏆 قارئ الفلسفة',
      db.achv_science && '🏆 مستكشف العلوم',
      db.stats.streak>=3 && `🔥 سلسلة ${db.stats.streak} أيام`
    ].filter(Boolean);
    if(!items.length){ achv.innerHTML='<div class="empty">ابدأ القراءة لتحصيل الأوسمة 🎯</div>'; }
    else { items.forEach(t=>{ const a=document.createElement('div'); a.className='a'; a.textContent=t; achv.appendChild(a); }); }
  }

  // Search
  $('#searchInput').addEventListener('keydown', e=>{
    if(e.key==='Enter'){
      const q = e.target.value.trim();
      if(!q) return;
      const res = db.books.filter(b=> b.title.includes(q) || b.author.includes(q) || (b.tags||[]).some(t=>t.includes(q)));
      if(!res.length){ alert('لا نتائج للبحث.'); return; }
      $('#catTitle').textContent = `نتائج البحث: “${q}”`;
      $('#catFilters').innerHTML='';
      const list = $('#catList'); list.innerHTML='';
      res.forEach(b=> list.appendChild(bookCard(b)));
      goto('category');
    }
  });

  // Tabs
  $$('.tab').forEach(t=> t.onclick = ()=>{
    const tab = t.dataset.tab;
    goto(tab);
    if(tab==='home') renderHome();
    if(tab==='sections') renderSections();
    if(tab==='library') renderLibrary();
    if(tab==='profile') renderProfile();
  });

  // Back
  document.body.addEventListener('click', e=>{
    const el = e.target.closest('[data-action="back"]');
    if(el){
      stack.pop(); const v = stack.pop() || 'home';
      goto(v);
      if(v==='home') renderHome();
      if(v==='library') renderLibrary();
      if(v==='profile') renderProfile();
      if(v==='sections') renderSections();
    }
  });

  // Audio (simulated)
  let audioTimer=null, audioSec=0, audioLen=300, audioBook=null, audioSpeed=1;
  function openAudio(id){
    const b = getBook(id); audioBook=b; audioSec=0; audioLen=(b.duration>=45?300:180);
    $('#audioTitle').textContent = `ملخص: ${b.title}`;
    $('#audioProg').style.width='0%'; $('#audioTime').textContent = `00:00 / ${fmtTime(audioLen)}`;
    $('#audioSpeed').onclick = ()=>{ audioSpeed = audioSpeed===1?1.5: (audioSpeed===1.5?2:1); $('#audioSpeed').textContent=audioSpeed+'x'; };
    $('#audioPlay').onclick = ()=>{ if(audioTimer) return; audioTimer=setInterval(()=>{ audioSec+=1*audioSpeed; if(audioSec>=audioLen){ clearInterval(audioTimer); audioTimer=null; audioSec=audioLen; } syncAudioUI(); }, 1000); };
    $('#audioPause').onclick = ()=>{ if(audioTimer){ clearInterval(audioTimer); audioTimer=null; } };
    $('#audioReset').onclick = ()=>{ audioSec=0; syncAudioUI(); };
    $('#audioSheet').classList.add('active');
  }
  function fmtTime(s){ const m=Math.floor(s/60), ss=Math.floor(s%60).toString().padStart(2,'0'); return `${m.toString().padStart(2,'0')}:${ss}`; }
  function syncAudioUI(){
    const pct = Math.min(100, Math.round((audioSec/audioLen)*100));
    $('#audioProg').style.width = pct+'%';
    $('#audioTime').textContent = `${fmtTime(audioSec)} / ${fmtTime(audioLen)}`;
  }
  document.body.addEventListener('click', e=>{
    const el = e.target.closest('[data-action="close-sheet"]');
    if(el){ if(audioTimer){ clearInterval(audioTimer); audioTimer=null; } $('#audioSheet').classList.remove('active'); }
  });

  // Admin wiring
  $('#manageBtn').onclick = ()=> openAdmin();
  $('#addBookBtn')?.addEventListener('click', ()=> openEditor(null));
  $('#exportBooksBtn')?.addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(db.books,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='books.json'; a.click(); URL.revokeObjectURL(a.href);
  });
  $('#importBooksBtn')?.addEventListener('click', ()=> $('#importBooksFile').click());
  $('#importBooksFile')?.addEventListener('change', async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    try{
      const arr = JSON.parse(await f.text());
      if(!Array.isArray(arr)) throw new Error('ملف غير صالح');
      arr.forEach(b=>{
        if(!b.id) b.id = newId('b');
        const i = db.books.findIndex(x=>x.id===b.id);
        if(i>=0) db.books[i]=b; else db.books.push(b);
        if(b.category && !db.categories[b.category]) db.categories[b.category]={icon:'📘',grad:'primary',filters:[]};
      });
      saveDB(); alert('تم استيراد الكتب ✔️'); renderAdminList();
    }catch{ alert('فشل الاستيراد'); }
  });
  $('#adminSearch')?.addEventListener('input', ()=> renderAdminList());

  function openAdmin(){ renderAdminList(); goto('admin'); }
  function renderAdminList(){
    const q = ($('#adminSearch')?.value||'').trim();
    const list = $('#adminList'); list.innerHTML='';
    let items = db.books.slice().sort((a,b)=> a.title.localeCompare(b.title,'ar'));
    if(q) items = items.filter(b=> b.title.includes(q) || b.author.includes(q) || (b.tags||[]).some(t=>t.includes(q)) || b.category.includes(q));
    if(!items.length){ list.innerHTML='<div class="empty">لا يوجد نتائج.</div>'; return; }
    items.forEach(b=>{
      const row = document.createElement('div');
      row.className='adminItem';
      row.innerHTML = `
        <div class="smallCover ${catGrad((db.categories[b.category]||{}).grad||'primary')}" style="width:64px;height:96px">
          ${b.cover_url?`<img src="${b.cover_url}"/>`:(b.title[0]||'•')}
        </div>
        <div style="flex:1">
          <div class="title" style="font-size:15px">${b.title}</div>
          <div class="author">${b.author} • ${b.category} • ⏱️ ${fmtMin(b.duration)}</div>
        </div>
        <div class="tools">
          <button class="iconbtn" title="تحرير">✏️</button>
          <button class="iconbtn" title="حذف">🗑️</button>
        </div>`;
      row.querySelectorAll('.iconbtn')[0].onclick = ()=> openEditor(b.id);
      row.querySelectorAll('.iconbtn')[1].onclick = ()=> { if(confirm('حذف هذا الكتاب وجميع بياناته؟')){ deleteBook(b.id); renderAdminList(); } };
      list.appendChild(row);
    });
  }

  let editingId = null;
  function refreshCatsDatalist(){
    const dl = $('#catsList'); dl.innerHTML='';
    Object.keys(db.categories).forEach(name=>{
      const opt = document.createElement('option'); opt.value=name; dl.appendChild(opt);
    });
  }
  function openEditor(id){
    editingId = id;
    refreshCatsDatalist();
    const isNew = !id;
    $('#editorTitle').textContent = isNew? 'إضافة كتاب' : 'تحرير كتاب';
    $('#deleteBookBtn').style.display = isNew? 'none':'inline-block';
    $('#exportOneBtn').style.display = isNew? 'none':'inline-block';
    const f = {
      id: $('#f-id'), title: $('#f-title'), author: $('#f-author'), category: $('#f-category'),
      lang: $('#f-lang'), duration: $('#f-duration'), pages: $('#f-pages'), tags: $('#f-tags'),
      cover: $('#f-cover'), summary: $('#f-summary'), quote: $('#f-quote'),
      content: $('#f-content'), audiolen: $('#f-audiolen')
    };
    if(isNew){
      f.id.value = newId('b'); f.title.value=''; f.author.value=''; f.category.value='';
      f.lang.value='ar'; f.duration.value=''; f.pages.value=''; f.tags.value='';
      f.cover.value=''; f.summary.value=''; f.quote.value=''; f.content.value=''; f.audiolen.value='';
    } else {
      const b = getBook(id);
      f.id.value = b.id; f.title.value=b.title; f.author.value=b.author;
      f.category.value=b.category; f.lang.value=b.lang||'ar';
      f.duration.value=b.duration||0; f.pages.value=b.pages||0;
      f.tags.value=(b.tags||[]).join(', ');
      f.cover.value=b.cover_url||''; f.summary.value=b.summary||''; f.quote.value=b.quote||'';
      f.content.value=(db.texts||{})[b.id]||''; f.audiolen.value='';
    }
    $('#saveBookBtn').onclick = ()=>{
      const book = {
        id: f.id.value.trim(),
        title: f.title.value.trim(),
        author: f.author.value.trim(),
        category: f.category.value.trim()||'عام',
        lang: f.lang.value,
        duration: Number(f.duration.value)||0,
        pages: Number(f.pages.value)||0,
        tags: (f.tags.value||'').split(',').map(s=>s.trim()).filter(Boolean),
        cover_url: f.cover.value.trim(),
        summary: f.summary.value.trim(),
        quote: f.quote.value.trim()
      };
      if(!book.title || !book.author || !book.duration || !book.pages){ alert('أكمل الحقول الأساسية.'); return; }
      if(!db.categories[book.category]) db.categories[book.category] = {icon:'📘',grad:'primary',filters:[]};
      const i = db.books.findIndex(x=>x.id===book.id);
      if(i>=0) db.books[i]=book; else db.books.push(book);
      const content = f.content.value.trim(); if(content){ db.texts[book.id]=content; } else { delete db.texts[book.id]; }
      saveDB(); alert('تم الحفظ ✔️'); openBook(book.id);
    };
    $('#cancelEditBtn').onclick = ()=> { stack.pop(); const v = stack.pop()||'admin'; goto(v); if(v==='admin') renderAdminList(); };
    $('#deleteBookBtn').onclick = ()=> { if(confirm('حذف هذا الكتاب وجميع بياناته؟')){ deleteBook(f.id.value); goto('admin'); renderAdminList(); } };
    $('#exportOneBtn').onclick = ()=>{
      const b = getBook(f.id.value); const blob = new Blob([JSON.stringify(b,null,2)], {type:'application/json'});
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download=`book-${b.id}.json`; a.click(); URL.revokeObjectURL(a.href);
    };
    goto('editor');
  }

  function deleteBook(id){
    const i = db.books.findIndex(b=>b.id===id);
    if(i<0) return;
    db.books.splice(i,1);
    delete db.progress[id];
    if(db.notes[id]) delete db.notes[id];
    if(db.texts[id]) delete db.texts[id];
    if(db.quizzes && db.quizzes[id]) delete db.quizzes[id];
    db.library.favorites = db.library.favorites.filter(x=>x!==id);
    db.library.later = db.library.later.filter(x=>x!==id);
    db.library.downloads = db.library.downloads.filter(x=>x!==id);
    saveDB();
  }

  // Profile actions: export/import/reset
  $('#exportBtn').onclick = ()=>{
    const blob = new Blob([JSON.stringify(db,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='smart-pocket-db.json'; a.click(); URL.revokeObjectURL(a.href);
  };
  $('#importBtn').onclick = ()=> $('#importFile').click();
  $('#importFile').onchange = async (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const txt = await f.text();
    try{ const obj=JSON.parse(txt); db=obj; saveDB(); alert('تم الاستيراد ✔️'); init(); }
    catch{ alert('ملف غير صالح'); }
  };
  $('#resetBtn').onclick = ()=>{
    if(confirm('هل تريد إعادة ضبط التطبيق؟ سيتم حذف بياناتك المحلية.')){
      localStorage.removeItem(DBKEY); db = JSON.parse(JSON.stringify(defaultDB)); saveDB(); init(); alert('تمت إعادة الضبط.');
    }
  };

  window.app = { openCategory, openBook };

  function init(){ renderHome(); renderSections(); renderLibrary(); renderProfile(); }
  init();

  // PWA: register SW only on https or localhost
  if ('serviceWorker' in navigator) {
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (isSecure) {
      navigator.serviceWorker.register('./sw.js').catch(()=>{});
    }
  }
})();