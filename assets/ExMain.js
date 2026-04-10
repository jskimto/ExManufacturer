/* ── CURSOR ───────────────────────────── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
function animRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing);}
animRing();
document.querySelectorAll('a,button,.service-card,.cert-card,.phase-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.width='16px';cur.style.height='16px';ring.style.width='52px';ring.style.height='52px';ring.style.opacity='0.3';});
  el.addEventListener('mouseleave',()=>{cur.style.width='10px';cur.style.height='10px';ring.style.width='36px';ring.style.height='36px';ring.style.opacity='0.5';});
});
if(window.matchMedia('(pointer:coarse)').matches){cur.style.display='none';ring.style.display='none';}

/* ── NAV SCROLL ───────────────────────── */
const nav=document.getElementById('mainNav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20));

/* ── MOBILE MENU ─────────────────────── */
function toggleMenu(){
  const m=document.getElementById('mobileMenu');
  const h=document.getElementById('hamburger');
  m.classList.toggle('open');
  h.classList.toggle('open');
}

/* ── LANGUAGE SWITCHER ────────────────── */
let currentLang='ja';
function setLang(lang){
  currentLang=lang;
  document.body.setAttribute('data-lang',lang);
  document.getElementById('btnJa').classList.toggle('active',lang==='ja');
  document.getElementById('btnKr').classList.toggle('active',lang==='kr');

  /* static DOM elements with data-ja / data-kr */
  document.querySelectorAll('[data-ja][data-kr]').forEach(el=>{
    const val=lang==='kr'?el.getAttribute('data-kr'):el.getAttribute('data-ja');
    if(!val)return;
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){el.placeholder=val;}
    else if(el.tagName==='OPTION'){el.textContent=val;}
    else{el.innerHTML=val;}
  });
  document.querySelectorAll('[data-placeholder-ja][data-placeholder-kr]').forEach(el=>{
    el.placeholder=lang==='kr'?el.getAttribute('data-placeholder-kr'):el.getAttribute('data-placeholder-ja');
  });

  /* dynamically generated table — rebuild with current language */
  filterTable();

  /* count label */
  const countEl=document.getElementById('mfrCount');
  if(countEl){
    const n=document.querySelectorAll('#mfrTbody tr').length;
    countEl.textContent=lang==='kr'?`총 ${n}개사 표시 중`:`全${n}社表示中`;
  }
}

/* ── SCROLL REVEAL ────────────────────── */
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');}});
},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ── COUNTER ANIMATION ────────────────── */
function animateCounter(el,target,suffix=''){
  const dur=1800;const start=performance.now();
  function step(now){
    const t=Math.min((now-start)/dur,1);
    const ease=1-Math.pow(1-t,3);
    el.innerHTML=Math.round(ease*target)+'<span>'+suffix+'</span>';
    if(t<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statsObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const items=e.target.querySelectorAll('.stat-num');
      const data=[[50,'+'],[12,'+'],[35,'+'],[2026,'']];
      items.forEach((el,i)=>{el.innerHTML='0<span>'+data[i][1]+'</span>';animateCounter(el,data[i][0],data[i][1]);});
      statsObs.disconnect();
    }
  });
},{threshold:0.3});
const statsEl=document.querySelector('.stats');
if(statsEl)statsObs.observe(statsEl);

/* ── MANUFACTURERS TABLE DATA ─────────── */
const MFR_DATA = [
  {ja:'日機装株式会社',                             kr:'닛키소 주식회사',                              items_ja:'キャンドモータ（各種・高融点型含む）',             items_kr:'캔드 모터（각종·고융점형 포함）',                   count:70, opp:['IECEx','ATEX','KCs']},
  {ja:'株式会社帝国電機製作所',                      kr:'주식회사 데이코쿠덴키 제작소',                 items_ja:'キャンドモータ（各種・LPガス用含む）',              items_kr:'캔드 모터（각종·LP가스용 포함）',                    count:65, opp:['IECEx','ATEX','KCs']},
  {ja:'日本ギア工業株式会社',                        kr:'니혼 기어 공업 주식회사',                      items_ja:'バルブコントロール、リミットスイッチ',              items_kr:'밸브 컨트롤, 리밋 스위치',                           count:90, opp:['IECEx','ATEX','KCs']},
  {ja:'株式会社宮木電機製作所',                      kr:'주식회사 미야키 전기 제작소',                  items_ja:'制御箱、操作スイッチ、電磁開閉器、変圧器、配線用遮断器等', items_kr:'제어함, 조작 스위치, 전자 개폐기, 변압기, 배선용 차단기 등', count:55, opp:['IECEx','ATEX','KCs']},
  {ja:'株式会社戸上電機製作所',                      kr:'주식회사 도가미 전기 제작소',                  items_ja:'コントロールスイッチ、押ボタンスイッチ、電磁開閉器、配線用遮断器等', items_kr:'컨트롤 스위치, 푸시버튼 스위치, 전자 개폐기, 배선용 차단기 등', count:38, opp:['IECEx','ATEX']},
  {ja:'IDEC株式会社',                               kr:'IDEC 주식회사',                               items_ja:'制御盤、操作盤、コントロールボックス、配線用遮断器、変圧器等', items_kr:'제어반, 조작반, 컨트롤 박스, 배선용 차단기, 변압기 등', count:14, opp:['ATEX','KCs']},
  {ja:'伊東電機株式会社 茨城工場',                   kr:'이토 전기 주식회사 이바라키 공장',             items_ja:'メータースタンド、メーターボックス、分電盤、コントロールボックス等', items_kr:'미터 스탠드, 미터 박스, 분전반, 컨트롤 박스 등', count:22, opp:['IECEx','ATEX','KCs']},
  {ja:'シンフォニアテクノロジー株式会社 豊橋製作所',  kr:'신포니아 테크놀로지 주식회사 도요하시 제작소', items_ja:'振動供給機用電磁駆動部、振動機器用誘導電動機',       items_kr:'진동 공급기용 전자 구동부, 진동기기용 유도 전동기',      count:18, opp:['IECEx','ATEX']},
  {ja:'助川電気工業株式会社',                        kr:'스케가와 전기공업 주식회사',                   items_ja:'熱電対、白金測温抵抗体、多対式シース型熱電対',      items_kr:'열전대, 백금 측온저항체, 다대식 시스형 열전대',          count:17, opp:['IECEx','ATEX','KCs']},
  {ja:'株式会社チノー',                              kr:'주식회사 치노',                                items_ja:'熱電対、白金測温抵抗体',                           items_kr:'열전대, 백금 측온저항체',                             count:10, opp:['IECEx','ATEX','KCs']},
  {ja:'株式会社岡崎製作所',                          kr:'주식회사 오카자키 제작소',                     items_ja:'熱電対、白金測温抵抗体',                           items_kr:'열전대, 백금 측온저항체',                             count:10, opp:['IECEx','ATEX','KCs']},
  {ja:'長野計器株式会社',                            kr:'나가노 계기 주식회사',                         items_ja:'圧力スイッチ、圧力発信器',                         items_kr:'압력 스위치, 압력 발신기',                            count:13, opp:['IECEx','ATEX','KCs']},
  {ja:'株式会社三井三池製作所',                      kr:'주식회사 미이케 제작소',                       items_ja:'三相かご形誘導電動機、ミキサ用電動機',              items_kr:'3상 농형 유도 전동기, 믹서용 전동기',                   count:13, opp:['IECEx','ATEX']},
  {ja:'金子産業株式会社',                            kr:'가네코 산업 주식회사',                         items_ja:'電磁弁用電磁石、液面位置指示計、液面計用白熱電灯',  items_kr:'전자 밸브용 전자석, 액면 위치 지시계, 액면계용 백열등',  count:8,  opp:['IECEx','ATEX','KCs']},
  {ja:'西部電機株式会社',                            kr:'세이부 전기 주식회사',                         items_ja:'バルブコントロール',                               items_kr:'밸브 컨트롤',                                        count:13, opp:['IECEx','ATEX','KCs']},
  {ja:'三明電機株式会社',                            kr:'산메이 전기 주식회사',                         items_ja:'電磁弁用電磁石',                                  items_kr:'전자 밸브용 전자석',                                  count:5,  opp:['IECEx','ATEX','KCs']},
  {ja:'大西電機工業株式会社',                        kr:'오니시 전기공업 주식회사',                     items_ja:'軸流送風機用誘導電動機（移動用含む）',              items_kr:'축류 송풍기용 유도 전동기（이동용 포함）',               count:8,  opp:['IECEx','ATEX']},
  {ja:'株式会社東邦製作所',                          kr:'주식회사 도호 제작소',                         items_ja:'電磁弁用電磁石、フロートスイッチ、ガストーチ管制箱', items_kr:'전자 밸브용 전자석, 플로트 스위치, 가스토치 관제함',    count:11, opp:['IECEx','ATEX','KCs']},
  {ja:'株式会社鷺宮製作所',                          kr:'주식회사 사기노미야 제작소',                   items_ja:'電磁弁用電磁石、フロースイッチ',                   items_kr:'전자 밸브용 전자석, 플로우 스위치',                    count:4,  opp:['IECEx','ATEX','KCs']},
  {ja:'東京計装株式会社',                            kr:'도쿄 계장 주식회사',                           items_ja:'液面警報発信部、液面計用駆動部',                   items_kr:'액면 경보 발신부, 액면계용 구동부',                    count:4,  opp:['IECEx','ATEX','KCs']},
  {ja:'旭サナック株式会社',                          kr:'아사히 사낙 주식회사',                         items_ja:'ペイントヒータ',                                  items_kr:'페인트 히터',                                        count:3,  opp:['IECEx','ATEX']},
  {ja:'テラルクリタ株式会社',                        kr:'테라루 쿠리타 주식회사',                       items_ja:'圧力扇、換気扇用誘導電動機',                       items_kr:'압력 팬, 환기팬용 유도 전동기',                        count:5,  opp:['IECEx','ATEX']},
  {ja:'株式会社坂本電機製作所',                      kr:'주식회사 사카모토 전기 제작소',                items_ja:'押釦開閉器（各種）、コントロールボックス、スイッチボックス', items_kr:'푸시버튼 개폐기（각종）, 컨트롤 박스, 스위치 박스', count:6,  opp:['IECEx','ATEX']},
  {ja:'新コスモス電機株式会社',                      kr:'신코스모스 전기 주식회사',                     items_ja:'可燃性ガス警報器用検知部（吸引式）',                items_kr:'가연성 가스 경보기용 검지부（흡인식）',                  count:2,  opp:['IECEx','KCs']},
  {ja:'株式会社昭栄',                                kr:'주식회사 쇼에이',                              items_ja:'誘導電動機（移動用含む）、直流電動機、開閉器',      items_kr:'유도 전동기（이동용 포함）, 직류 전동기, 개폐기',        count:4,  opp:['IECEx','ATEX']},
  {ja:'ビーエヌ精機株式会社',                        kr:'BN세이키 주식회사',                            items_ja:'電磁弁用電磁石',                                  items_kr:'전자 밸브용 전자석',                                  count:3,  opp:['IECEx','ATEX','KCs']},
  {ja:'三菱電機株式会社 名古屋製作所',               kr:'미쓰비시 전기 주식회사 나고야 제작소',         items_ja:'電磁粒子形パウダークラッチ',                       items_kr:'전자 분체형 파우더 클러치',                            count:2,  opp:['IECEx','ATEX']},
  {ja:'春日電機株式会社',                            kr:'가스가 전기 주식회사',                         items_ja:'静電気除去装置用電極、静電気除去装置（電極を除く）', items_kr:'정전기 제거 장치용 전극, 정전기 제거 장치（전극 제외）',count:2,  opp:['IECEx']},
  {ja:'株式会社荏原製作所',                          kr:'주식회사 에바라 제작소',                       items_ja:'キャンドモータ',                                  items_kr:'캔드 모터',                                          count:2,  opp:['IECEx','ATEX']},
  {ja:'島田電機株式会社',                            kr:'시마다 전기 주식회사',                         items_ja:'配線用遮断器',                                    items_kr:'배선용 차단기',                                       count:2,  opp:['IECEx','ATEX']},
  {ja:'大黒屋ホールディングス株式会社',              kr:'다이코쿠야 홀딩스 주식회사',                   items_ja:'コンセント形さし込接続器、白熱電灯（移動灯）',      items_kr:'콘센트형 삽입 접속기, 백열등（이동등）',                count:2,  opp:['IECEx']},
  {ja:'株式会社タツノ',                              kr:'주식회사 타츠노',                              items_ja:'ガソリン計量機用制御箱・発信機',                   items_kr:'가솔린 계량기용 제어함·발신기',                        count:2,  opp:['IECEx','ATEX']},
  {ja:'株式会社コーギケン',                          kr:'주식회사 코기켄',                              items_ja:'液面制御装置',                                    items_kr:'액면 제어 장치',                                      count:2,  opp:['IECEx','KCs']},
  {ja:'株式会社和興計測',                            kr:'주식회사 와코 계측',                           items_ja:'液面位置指示計',                                  items_kr:'액면 위치 지시계',                                    count:2,  opp:['IECEx','ATEX','KCs']},
  {ja:'日本アスコ株式会社',                          kr:'니혼 아스코 주식회사',                         items_ja:'電磁弁用電磁石',                                  items_kr:'전자 밸브용 전자석',                                  count:2,  opp:['IECEx','ATEX','KCs']},
  {ja:'株式会社東科精機',                            kr:'주식회사 도카 세이키',                         items_ja:'可燃性ガス警報器用検知部（拡散式・吸引式）',        items_kr:'가연성 가스 경보기용 검지부（확산식·흡인식）',           count:2,  opp:['IECEx','KCs']},
  {ja:'株式会社中村電機製作所',                      kr:'주식회사 나카무라 전기 제작소',                items_ja:'操作盤',                                          items_kr:'조작반',                                             count:2,  opp:['IECEx','ATEX']},
  {ja:'神鋼電機株式会社',                            kr:'신코 전기 주식회사',                           items_ja:'三相かご形誘導電動機',                             items_kr:'3상 농형 유도 전동기',                                count:1,  opp:['IECEx','ATEX']},
  {ja:'シンフォニアテクノロジー株式会社 電子精機本部 伊勢製作所', kr:'신포니아 테크놀로지 주식회사 이세 제작소', items_ja:'振動電動機、振動機器用誘導電動機', items_kr:'진동 전동기, 진동기기용 유도 전동기', count:3, opp:['IECEx','ATEX']},
  {ja:'星和電機株式会社',                            kr:'호시와 전기 주식회사',                         items_ja:'配線用遮断器',                                    items_kr:'배선용 차단기',                                       count:1,  opp:['IECEx','ATEX']},
  {ja:'株式会社鈴木セード製造所',                    kr:'주식회사 스즈키 세이드 제조소',                items_ja:'コンセント形さし込接続器',                         items_kr:'콘센트형 삽입 접속기',                                count:1,  opp:['IECEx']},
  {ja:'株式会社村上精機工作所',                      kr:'주식회사 무라카미 정기 공작소',                items_ja:'振動電動機',                                      items_kr:'진동 전동기',                                        count:1,  opp:['IECEx']},
  {ja:'株式会社桜川ポンプ製作所',                    kr:'주식회사 사쿠라가와 펌프 제작소',              items_ja:'水中ポンプ用三相かご形誘導電動機（移動用）',        items_kr:'수중 펌프용 3상 농형 유도 전동기（이동용）',            count:1,  opp:['IECEx','ATEX']},
  {ja:'株式会社小野測器',                            kr:'주식회사 오노 소키',                           items_ja:'電磁式回転速度検出器',                             items_kr:'전자식 회전속도 검출기',                              count:1,  opp:['IECEx','ATEX']},
  {ja:'株式会社大洋バルブ製作所',                    kr:'주식회사 다이요 밸브 제작소',                  items_ja:'リードスイッチ',                                  items_kr:'리드 스위치',                                        count:1,  opp:['IECEx','KCs']},
  {ja:'昭和機器工業株式会社',                        kr:'쇼와 기기공업 주식회사',                       items_ja:'液面計',                                          items_kr:'액면계',                                             count:1,  opp:['IECEx','KCs']},
  {ja:'株式会社オーバル 横浜事業所',                 kr:'주식회사 오발 요코하마 사업소',                items_ja:'弁開度指示計',                                    items_kr:'밸브 개도 지시계',                                    count:1,  opp:['IECEx','ATEX','KCs']},
  {ja:'光音電波株式会社',                            kr:'코인 전파 주식회사',                           items_ja:'指令用電話機',                                    items_kr:'지령용 전화기',                                       count:1,  opp:['IECEx']},
  {ja:'日本電音株式会社',                            kr:'니혼 덴온 주식회사',                           items_ja:'ホーンスピーカ',                                  items_kr:'혼 스피커',                                          count:1,  opp:['IECEx']},
  {ja:'アクト電機工業株式会社',                      kr:'아크토 전기공업 주식회사',                     items_ja:'圧力スイッチ',                                    items_kr:'압력 스위치',                                        count:1,  opp:['IECEx','ATEX','KCs']},
  {ja:'横河電機株式会社',          kr:'요코가와 전기 주식회사',         items_ja:'圧力・流量・温度計器（HART／FF対応）',   items_kr:'압력·유량·온도 계측기(HART/FF 대응)',   count:1,  opp:['IECEx・ATEX']},
  {ja:'アズビル株式会社',                  kr:'아즈빌 주식회사',             items_ja:'リミットスイッチ、調節弁、センサ類',                        items_kr:'리미트 스위치, 조절 밸브, 센서류',       count:1,  opp:['IECEx・ATEX・NEPSI・KOSHA']},
  {ja:'富士電機株式会社',                  kr:'후지 전기 주식회사',             items_ja:'高圧三相かご形防爆誘導電動機',                        items_kr:'고압 삼상 농형 방폭 유도전동기',       count:1,  opp:['IECEx・ATEX']},
  {ja:'株式会社中村電機製作所',                  kr:'주식회사 나카무라 전기제작소',             items_ja:'操作盤、制御機器',                        items_kr:'조작반, 제어기기',       count:1,  opp:['IECEx・ATEX']},
  {ja:'日本アスコ株式会社  （ASCOグループ）',                  kr:'일본 아스코 주식회사(ASCO 그룹)',             items_ja:'電磁弁（各種）',                        items_kr:'전자밸브(각종)',       count:1,  opp:['IECEx']},
  {ja:'日本ゴア株式会社（W.L. Gore）',                  kr:'일본 고어 주식회사(W.L. Gore)',             items_ja:'ポリベント（通気部材）',                        items_kr:'폴리벤트(통기 부품)',       count:1,  opp:['IECEx・ATEX']},
  {ja:'新コスモス電機株式会社',                  kr:'신코스모스 전기 주식회사',             items_ja:'（一部）可燃性ガス検知器',                        items_kr:'(일부) 가연성 가스 검지기',       count:1,  opp:['TIIS＋IECEx']},
  {ja:'理研計器株式会社',                  kr:'리켄 계기 주식회사',             items_ja:'（一部）ガス検知器',                        items_kr:'(일부) 가스 검지기',       count:1,  opp:['TIIS＋IECEx']},
  {ja:'IDEC株式会社',                  kr:'IDEC 주식회사',             items_ja:'（一部）制御機器、操作盤',                        items_kr:'(일부) 제어기기, 조작반',       count:1,  opp:['TIIS＋IECEx']},
];

const oppColor={IECEx:'pill-iecex',ATEX:'pill-atex',KCs:'pill-kcs'};

function buildRows(data){
  const lang=currentLang;
  return data.map((d,i)=>`<tr>
    <td style="color:var(--text-soft);font-size:0.8rem;text-align:center;">${i+1}</td>
    <td class="mfr-name">${lang==='kr'?d.kr:d.ja}</td>
    <td style="font-size:0.82rem;color:var(--text-mid);">${lang==='kr'?d.items_kr:d.items_ja}</td>
    <td style="text-align:center;font-weight:600;color:var(--navy);font-size:0.95rem;">${d.count}</td>
    <td><span class="cert-pill pill-tiis">TIIS</span></td>
    <td>${d.opp.map(o=>`<span class="cert-pill ${oppColor[o]}">${o}</span>`).join('')}</td>
  </tr>`).join('');
}

const tbody=document.getElementById('mfrTbody');
const countEl=document.getElementById('mfrCount');
const noResult=document.getElementById('mfrNoResult');
if(tbody){tbody.innerHTML=buildRows(MFR_DATA);}
if(countEl){countEl.textContent=`全${MFR_DATA.length}社表示中`;}

function filterTable(){
  const lang=currentLang;
  const q=(document.getElementById('mfrSearch')?document.getElementById('mfrSearch').value:'').toLowerCase();
  const cat=document.getElementById('mfrCategory')?document.getElementById('mfrCategory').value:'';
  const filtered=MFR_DATA.filter(d=>{
    const name=lang==='kr'?d.kr:d.ja;
    const items=lang==='kr'?d.items_kr:d.items_ja;
    const matchQ=!q||name.toLowerCase().includes(q)||items.toLowerCase().includes(q)||d.ja.toLowerCase().includes(q);
    const matchCat=!cat||d.items_ja.includes(cat);
    return matchQ&&matchCat;
  });
  if(tbody){tbody.innerHTML=buildRows(filtered);}
  const n=filtered.length;
  if(countEl){countEl.textContent=lang==='kr'?`총 ${n}개사 표시 중`:`${n}社表示中`;}
  const wrap=document.querySelector('.mfr-table-wrap');
  if(noResult){noResult.style.display=n===0?'block':'none';}
  if(wrap){wrap.style.display=n===0?'none':'block';}
}

/* ── FORM ─────────────────────────────── */
function handleSubmit(e){
  e.preventDefault();
  const btn=e.target.querySelector('.form-submit');
  btn.textContent=currentLang==='kr'?'전송 중...':'送信中...';
  btn.disabled=true;
  setTimeout(()=>{
    const msg=document.getElementById('formMsg');
    msg.style.display='block';
    msg.textContent=currentLang==='kr'?'✓ 전송되었습니다. 담당자가 연락드리겠습니다.':'✓ 送信しました。担当者よりご連絡いたします。';
    btn.textContent=currentLang==='kr'?'전송 완료 ✓':'送信完了 ✓';
  },1200);
}
