(function(){
  'use strict';
  var DAYS = [-1,0,1,2,3,4,5,6];
  var CONTENT_TYPES = ['YT 브랜디드','YT PPL','YT 쇼츠','YT 쇼츠 PPL','IG 릴스 브랜디드','IG 릴스 PPL','IG 피드 브랜디드','IG 스토리','X 브랜디드','TT 브랜디드','YT 쇼츠+IG 릴스','YT 쇼츠+IG 릴스+TT 브랜디드'];
  window._fbV15 = window._fbV15 || {month:'0', platform:'0', channel:'0', type:'0', creatorIndex:null, tab:'summary', expanded:{}};

  function $(id){ return document.getElementById(id); }
  function esc(v){ return String(v==null?'':v).replace(/[&<>'"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];}); }
  function clean(v){ var x=String(v==null?'':v).trim(); return (x && x !== '-') ? x : ''; }
  function num(v){ if(typeof window.toNum==='function') return window.toNum(v); var n=Number(String(v==null?'':v).replace(/[^0-9.\-]/g,'')); return isFinite(n)?n:0; }
  function fmtN(v){ v=num(v); return v ? Math.round(v).toLocaleString('ko-KR') : '-'; }
  function fmtN0(v){ return Math.round(num(v)||0).toLocaleString('ko-KR'); }
  function fmtW(v){ v=num(v); return v ? '₩'+Math.round(v).toLocaleString('ko-KR') : '-'; }
  function fmtP(v, digit){ return (isFinite(v) && Math.abs(v)>0) ? Number(v).toFixed(digit==null?1:digit)+'%' : '-'; }
  function pad2(n){ return String(n).padStart(2,'0'); }
  function iso(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
  function addDays(ds, off){ var d = ds ? new Date(ds) : new Date(NaN); if(isNaN(d.getTime())) return ''; d.setDate(d.getDate()+off); return iso(d); }
  function koDate(ds){ if(!ds) return '-'; var m=String(ds).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if(!m) return ds; return Number(m[2])+'월 '+Number(m[3])+'일'; }
  function dayLabel(r,d){ return koDate(addDays(r && r.uploadDate, d)); }
  function currentIso(){ return iso(new Date()); }
  function creatorIndex(r){ return (window.creators||[]).indexOf(r); }
  function dayKey(ci,d){ return ci + '_d' + d; }
  function ensureDay(r, ci, d){ if(!r._fbData) r._fbData={}; var k=dayKey(ci,d); if(!r._fbData[k]){ var suffix='_d'+d; var legacyKey=Object.keys(r._fbData).find(function(x){return String(x).slice(-suffix.length)===suffix;}); if(legacyKey) r._fbData[k]=r._fbData[legacyKey]; } if(!r._fbData[k]) r._fbData[k]={view:0,comment:0,like:0,click:0,productLike:0,sales:0,revenue:0,total:0,rankAll:0,rankCat:0,_itemData:{}}; if(!r._fbData[k]._itemData) r._fbData[k]._itemData={}; return r._fbData[k]; }
  function activeDays(r){ var today=currentIso(); return DAYS.filter(function(d){ var ds=addDays(r && r.uploadDate, d); return ds && ds <= today; }); }
  function norm(v){ return String(v==null?'':v).trim().toLowerCase().replace(/\s+/g,''); }
  function normPlatform(v){ var x=String(v==null?'':v).trim(); var k=x.toLowerCase().replace(/\s+/g,''); if(k==='musinsa'||x==='무신사')return '무신사'; if(k==='29cm'||x==='29CM')return '29CM'; if(k==='store'||k==='자사몰')return '자사몰'; if(k==='offline'||x==='오프라인')return 'Offline'; if(x==='발매'||k==='release')return '발매'; return x; }
  function itemUid(it, platform){ it=it||{}; var u=clean(it.uid||it.UID||it['UID']); if(u) return u; var pk=normPlatform(platform); if(pk==='무신사') return clean(it.musinsaUid||it.musinsaUID||it['무신사 UID']||it['무신사UID']); if(pk==='29CM') return clean(it.cmUid||it.cmUID||it['29CM UID']||it['29CMUID']||it['29cmUid']); if(pk==='자사몰') return clean(it.storeUid||it.storeUID||it['자사몰 UID']||it['자사몰UID']); return ''; }
  function itemCode(it){ return clean((it||{}).code||(it||{}).productCode||(it||{})['상품코드']||(it||{})['상품 코드']); }
  function itemName(it){ return clean((it||{}).name||(it||{}).productName||(it||{}).product||(it||{})['상품명']||(it||{})['제품명']); }
  function itemColor(it){ return clean((it||{}).color||(it||{})['컬러']||(it||{}).option||(it||{})['색상']); }
  function fallbackItemKey(it, platform){ var u=itemUid(it, platform); if(u) return 'uid:'+norm(platform)+'|'+norm(u); var c=itemCode(it); if(c) return 'code:'+norm(platform)+'|'+norm(c); return 'name:'+norm(platform)+'|'+norm(itemName(it)); }
  function itemKey(it, platform){ try{ if(typeof window.fbFeedbackAutoItemKey==='function') return window.fbFeedbackAutoItemKey(it, platform); }catch(e){} return fallbackItemKey(it, platform); }
  function getItemData(day, it, platform){ var data=(day && day._itemData)||{}; var k=itemKey(it, platform); var f=fallbackItemKey(it, platform); var u=itemUid(it, platform); var byUid=u ? 'uid:'+norm(platform)+'|'+norm(u) : ''; return data[k] || data[f] || (byUid?data[byUid]:null) || {}; }
  function ensureItemData(day, it, platform){ if(!day._itemData) day._itemData={}; var k=itemKey(it,platform); if(!day._itemData[k]) day._itemData[k]={}; return day._itemData[k]; }
  function itemsOf(r){ return ((r && r.items)||[]).filter(function(it){ return it && (itemUid(it,r.platform)||itemCode(it)||itemName(it)); }); }
  function isIndividualLink(r){ return clean(r&&r.linkType)==='개별'; }
  function costOf(r){ return num(r && r.cost1) + num(r && r.cost2); }
  function dayMetrics(r, ci, d){ var day=ensureDay(r,ci,d); var items=itemsOf(r); var sales=0, revenue=0, productLike=0, itemClick=0; items.forEach(function(it){ var id=getItemData(day,it,r.platform); sales += num(id.sales); revenue += num(id.revenue); productLike += num(id.productLike); itemClick += num(id.click); }); if(!sales) sales=num(day.sales); if(!revenue) revenue=num(day.revenue); if(!productLike) productLike=num(day.productLike); var total=num(day.total); var click=isIndividualLink(r)?itemClick:num(day.click); var view=num(day.view); var cost=costOf(r); return {day:day, view:view, like:num(day.like), comment:num(day.comment), click:click, ctr:view?click/view*100:0, productLike:productLike, sales:sales, revenue:revenue, total:total, delta:null, cvr:click?sales/click*100:0, share:total?revenue/total*100:0, roas:cost?revenue/cost*100:0}; }
  function creatorTotals(r, ci){ var t={view:0,like:0,comment:0,click:0,productLike:0,sales:0,revenue:0,total:0}; function entered(v){return v!=null&&String(v).trim()!==''&&num(v)!==0;} activeDays(r).forEach(function(d){ var m=dayMetrics(r,ci,d); if(entered(m.view)) t.view=m.view; if(entered(m.like)) t.like=m.like; if(entered(m.comment)) t.comment=m.comment; if(entered(m.productLike)) t.productLike=m.productLike; t.click+=m.click; t.sales+=m.sales; t.revenue+=m.revenue; if(m.total) t.total=Math.max(t.total,m.total); }); var cost=costOf(r); t.ctr=t.view?t.click/t.view*100:0; t.roas=cost?t.revenue/cost*100:0; return t; }
  function deltaHtml(r,ci,d){ var idx=DAYS.indexOf(d); if(idx<=0) return '<span class="fb-v15-delta-neutral">-</span>'; var prev=dayMetrics(r,ci,DAYS[idx-1]).revenue; var now=dayMetrics(r,ci,d).revenue; if(!prev) return '<span class="fb-v15-delta-neutral">-</span>'; var v=(now-prev)/prev*100; if(v>0) return '<span class="fb-v15-delta-up">+'+v.toFixed(1)+'%</span>'; if(v<0) return '<span class="fb-v15-delta-down">'+v.toFixed(1)+'%</span>'; return '<span class="fb-v15-delta-neutral">0.0%</span>'; }
  function chBadge(ch){ var c=String(ch||''); var cls=c==='Instagram'?'fb-v15-badge-ig':c==='Youtube'?'fb-v15-badge-yt':c==='Tiktok'?'fb-v15-badge-tt':'fb-v15-badge-x'; var short={Instagram:'IG',Youtube:'YT',Tiktok:'TT',X:'X'}[c]||c||'-'; return '<span class="fb-v15-badge '+cls+'">'+esc(short)+'</span>'; }
  function feedbackPlatformColor(p){
    var key=normPlatform(p||'선택')||'선택';
    var map=(window.LIST_PLATFORM_COLOR)||{
      '선택':{bg:'#F3F4F6',color:'#6B7280'},
      '무신사':{bg:'#DBEAFE',color:'#1E40AF'},
      '29CM':{bg:'#EDE9FE',color:'#5B21B6'},
      '자사몰':{bg:'#DCFCE7',color:'#166534'},
      'Offline':{bg:'#FEF3C7',color:'#92400E'},
      '발매':{bg:'#FFE4E6',color:'#BE123C'}
    };
    return map[key] || map['선택'];
  }
  function platformBadge(p){
    var key=normPlatform(p||'선택')||'선택';
    var c=feedbackPlatformColor(key);
    return '<span class="fb-v15-badge fb-v15-badge-platform" style="background:'+c.bg+';color:'+c.color+';">'+esc(key||'-')+'</span>';
  }
  function setActiveBtns(selector, value){ document.querySelectorAll(selector).forEach(function(b){ b.classList.toggle('active', String(b.getAttribute('data-v'))===String(value)); }); }

  function buildFeedbackShell(){
    var pg=$('pg-feedback'); if(!pg) return;
    var cur=window._fbV15||{};
    pg.innerHTML = '<div id="fb-sheet-sync-bar" style="display:none;background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-md);padding:8px 14px;margin-bottom:10px;font-size:11px;align-items:center;gap:8px;"><span id="fb-sync-dot" style="width:7px;height:7px;border-radius:50%;background:#2d8c5a;display:inline-block;"></span><span id="fb-sync-msg">Google Sheets 연동 준비 중...</span><span style="color:var(--color-text-tertiary);margin-left:auto;" id="fb-sync-time"></span></div>'+
      '<div class="slicer-box" id="ff-v15-filter">'+
        '<div class="slicer-group"><div class="slicer-label">월 선택</div><div class="slicer-chips" id="ff-month-btns">'+['전체','1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'].map(function(x,i){return '<button class="ff-mbtn '+(String(i)===String(cur.month||'0')?'active':'')+'" data-v="'+i+'" onclick="ffV15SetMonth('+i+')">'+x+'</button>';}).join('')+'</div></div>'+
        '<div style="width:.5px;background:var(--color-border-tertiary);align-self:stretch"></div>'+
        '<div class="slicer-group"><div class="slicer-label">플랫폼 구분</div><div class="slicer-chips" id="ff-plt-btns">'+['전체','무신사','29CM','자사몰','Offline','발매'].map(function(x,i){var v=i===0?'0':x;return '<button class="ov-pbtn '+(String(v)===String(cur.platform||'0')?'active':'')+'" data-v="'+esc(v)+'" onclick="ffV15SetPlatform(\''+esc(v)+'\')">'+x+'</button>';}).join('')+'</div></div>'+
        '<div style="width:.5px;background:var(--color-border-tertiary);align-self:stretch"></div>'+
        '<div class="slicer-group"><div class="slicer-label">채널 구분</div><div class="slicer-chips" id="ff-ch-btns">'+['전체','Instagram','Youtube','Tiktok','X'].map(function(x,i){var v=i===0?'0':x;return '<button class="ff-sbtn '+(String(v)===String(cur.channel||'0')?'active':'')+'" data-v="'+esc(v)+'" onclick="ffV15SetChannel(\''+esc(v)+'\')">'+x+'</button>';}).join('')+'</div></div>'+
        '<div style="width:.5px;background:var(--color-border-tertiary);align-self:stretch"></div>'+
        '<div class="slicer-group"><div class="slicer-label">크리에이터 검색</div><input type="text" id="ff-name" class="ff-v15-search" placeholder="크리에이터 검색..." oninput="applyFeedbackFilter()"></div>'+
        '<div style="width:.5px;background:var(--color-border-tertiary);align-self:stretch"></div>'+
        '<div class="slicer-group"><div class="slicer-label">콘텐츠 유형</div><select id="ff-type" class="ff-v15-select" onchange="applyFeedbackFilter()"><option value="0">콘텐츠 유형 전체</option>'+CONTENT_TYPES.map(function(t){return '<option value="'+esc(t)+'">'+esc(t)+'</option>';}).join('')+'</select></div>'+
        '<div class="ff-v15-actions"><button class="ff-v15-btn" onclick="fbAutoFillSales()">↻ 판매 자동 기입</button></div>'+
      '</div>'+
      '<div id="ff-row" style="display:none;"><select id="ff-month">'+['전체','1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'].map(function(x,i){return '<option value="'+i+'" '+(String(i)===String(cur.month||'0')?'selected':'')+'>'+x+'</option>';}).join('')+'</select><select id="ff-plt">'+['전체','무신사','29CM','자사몰','Offline','발매'].map(function(x,i){var v=i===0?'0':x;return '<option value="'+esc(v)+'" '+(String(v)===String(cur.platform||'0')?'selected':'')+'>'+x+'</option>';}).join('')+'</select><select id="ff-ch">'+['전체','Instagram','Youtube','Tiktok','X'].map(function(x,i){var v=i===0?'0':x;return '<option value="'+esc(v)+'" '+(String(v)===String(cur.channel||'0')?'selected':'')+'>'+x+'</option>';}).join('')+'</select><input id="ff-code" value=""></div>'+
      '<div id="fb-scroll-top" style="overflow-x:auto;overflow-y:hidden;height:12px;margin-bottom:2px;"><div id="fb-scroll-inner" style="height:1px;"></div></div>'+
      '<div id="fb-v15-tbl-wrap" class="tbl-wrap"><table class="fb-v15-main" id="fb-v15-main"><thead style="position:sticky;top:0;z-index:5;"><tr><th>크리에이터</th><th>팔로워</th><th>채널</th><th>콘텐츠 유형</th><th>진행 방식</th><th>광고 비용</th><th>2차활용</th><th>활용 비용</th><th>업로드 일자</th><th>플랫폼</th><th>누적 조회수</th><th>누적 좋아요</th><th>누적 댓글 수</th><th>링크 클릭</th><th>CTR</th><th>상품 좋아요</th><th>판매 수량</th><th>매출</th><th>ROAS</th></tr></thead><tbody id="feedback-body"></tbody></table></div>';
    if(!$('fb-v15-modal')){
      var modal=document.createElement('div'); modal.id='fb-v15-modal'; modal.onclick=function(e){ if(e.target && e.target.id==='fb-v15-modal') window.fbV15CloseModal(); };
      modal.innerHTML='<div class="fb-v15-shell"><div class="fb-v15-header"><div class="fb-v15-title-row"><div class="fb-v15-title" id="fb-v15-title">-</div><div class="fb-v15-meta" id="fb-v15-meta"></div></div><div class="fb-v15-actions"><button class="fb-v15-small-btn" onclick="fbV15SaveModal()">입력값 저장</button><button class="fb-v15-close" onclick="fbV15CloseModal()">×</button></div></div><div class="fb-v15-tabs" id="fb-v15-tabs"></div><div class="fb-v15-body" id="fb-v15-body"></div></div>';
      document.body.appendChild(modal);
    }
  }

  window.ffV15SetMonth=function(m){ window._fbV15.month=String(m); var sel=$('ff-month'); if(sel) sel.value=String(m); setActiveBtns('#ff-month-btns .ff-mbtn',m); window.applyFeedbackFilter&&window.applyFeedbackFilter(); };
  window.ffV15SetPlatform=function(p){ window._fbV15.platform=String(p); var sel=$('ff-plt'); if(sel) sel.value=String(p); setActiveBtns('#ff-plt-btns .ov-pbtn',p); window.applyFeedbackFilter&&window.applyFeedbackFilter(); };
  window.ffV15SetChannel=function(ch){ window._fbV15.channel=String(ch); var sel=$('ff-ch'); if(sel) sel.value=String(ch); setActiveBtns('#ff-ch-btns .ff-sbtn',ch); window.applyFeedbackFilter&&window.applyFeedbackFilter(); };

  window.renderFeedbackRows=function(list){
    var body=$('feedback-body'); if(!body) return;
    list=(list||[]).filter(function(r){ return r && r.checked===true; });
    if(!list.length){ body.innerHTML='<tr><td colspan="19" class="fb-v15-empty">표시할 Feedback 데이터가 없습니다.</td></tr>'; syncScroll(); return; }
    body.innerHTML=list.map(function(r){ var ci=creatorIndex(r); var t=creatorTotals(r,ci); return '<tr class="fb-v15-row" onclick="fbV15OpenModal('+ci+')">'+
      '<td><div class="fb-v15-name">'+esc(r.name||'-')+'</div></td>'+ '<td>'+esc(r.followers||'-')+'</td>'+ '<td>'+chBadge(r.ch)+'</td>'+ '<td>'+esc(r.contentType||'-')+'</td>'+ '<td>'+esc(r.collab||r.progress||'-')+'</td>'+ '<td>'+fmtW(r.cost1)+'</td>'+ '<td>'+esc(r.sec||'-')+'</td>'+ '<td>'+fmtW(r.cost2)+'</td>'+ '<td>'+koDate(r.uploadDate)+'</td>'+ '<td>'+platformBadge(r.platform)+'</td>'+ '<td>'+fmtN0(t.view)+'</td>'+ '<td>'+fmtN0(t.like)+'</td>'+ '<td>'+fmtN0(t.comment)+'</td>'+ '<td>'+fmtN0(t.click)+'</td>'+ '<td>'+fmtP(t.ctr,1)+'</td>'+ '<td>'+fmtN0(t.productLike)+'</td>'+ '<td>'+fmtN0(t.sales)+'</td>'+ '<td>'+fmtW(t.revenue)+'</td>'+ '<td>'+fmtP(t.roas,0)+'</td></tr>'; }).join('');
    syncScroll();
  };

  function syncScroll(){ var wrap=$('fb-v15-tbl-wrap'), top=$('fb-scroll-top'), inner=$('fb-scroll-inner'), tbl=$('fb-v15-main'); if(wrap&&top&&inner&&tbl){ setTimeout(function(){ inner.style.width=tbl.offsetWidth+'px'; },0); top.onscroll=function(){wrap.scrollLeft=top.scrollLeft;}; wrap.onscroll=function(){top.scrollLeft=wrap.scrollLeft;}; } }

  window.applyFeedbackFilter=function(){
    buildFeedbackShell();
    var s=window._fbV15||{};
    s.month=String(($('ff-month')&&$('ff-month').value)||s.month||'0');
    s.platform=String(($('ff-plt')&&$('ff-plt').value)||s.platform||'0');
    s.channel=String(($('ff-ch')&&$('ff-ch').value)||s.channel||'0');
    s.type=String(($('ff-type')&&$('ff-type').value)||s.type||'0');
    var nm=String(($('ff-name')&&$('ff-name').value)||'').toLowerCase();
    var rows=(window.creators||[]).filter(function(r){
      if(!r || r.checked!==true) return false;
      if(s.month && s.month!=='0'){ var d=r.uploadDate?new Date(r.uploadDate):null; var m=d&&!isNaN(d.getTime())?d.getMonth()+1:0; if(m!==Number(s.month)) return false; }
      if(s.platform && s.platform!=='0' && normPlatform(r.platform)!==normPlatform(s.platform)) return false;
      if(s.channel && s.channel!=='0' && String(r.ch||'')!==s.channel) return false;
      if(s.type && s.type!=='0' && String(r.contentType||'')!==s.type) return false;
      if(nm && String(r.name||'').toLowerCase().indexOf(nm)===-1) return false;
      return true;
    }).sort(function(a,b){ var at=a.uploadDate?new Date(a.uploadDate).getTime():Infinity; var bt=b.uploadDate?new Date(b.uploadDate).getTime():Infinity; at=isNaN(at)?Infinity:at; bt=isNaN(bt)?Infinity:bt; if(at!==bt) return at-bt; return ((a._order!=null?a._order:creatorIndex(a))-(b._order!=null?b._order:creatorIndex(b))); });
    window.renderFeedbackRows(rows);
  };

  window.fbV15OpenModal=function(ci){ window._fbV15.creatorIndex=ci; window._fbV15.tab='summary'; window._fbV15.expanded={}; var modal=$('fb-v15-modal'); if(modal) modal.classList.add('open'); renderModal(); };
  window.fbV15CloseModal=function(){ var modal=$('fb-v15-modal'); if(modal) modal.classList.remove('open'); };
  window.fbV15SaveModal=function(){ if(typeof window.fbSaveCreators==='function') window.fbSaveCreators(); alert('입력값을 저장했어요.'); };
  function fbV15ContentLinkButton(r){ var has=!!String((r&&r.uploadLink)||'').trim(); return '<button type="button" class="fb-v15-content-link-btn '+(has?'has-link':'')+'" onclick="fbV15HandleContentLink()">'+(has?'콘텐츠 보러 가기':'업로드 링크')+'</button>'+(has?' <button type="button" class="fb-v15-content-link-edit-btn" onclick="fbV15EditContentLink()">수정</button>':''); }
  window.fbV15HandleContentLink=function(){ var ci=window._fbV15&&window._fbV15.creatorIndex; var r=(window.creators||[])[ci]; if(!r) return; var cur=String(r.uploadLink||'').trim(); if(cur){ window.open(cur,'_blank','noopener'); return; } fbV15EditContentLink(); };
  window.fbV15EditContentLink=function(){ var ci=window._fbV15&&window._fbV15.creatorIndex; var r=(window.creators||[])[ci]; if(!r) return; var cur=String(r.uploadLink||'').trim(); var url=prompt('['+(r.name||'-')+'] 업로드 링크를 입력해주세요.\n(비워두면 링크가 삭제돼요)',cur); if(url===null) return; r.uploadLink=String(url||'').trim(); fbSaveCreators&&fbSaveCreators(); renderModal(); window.applyFeedbackFilter&&window.applyFeedbackFilter(); };
  function renderModal(){ var ci=window._fbV15.creatorIndex; var r=(window.creators||[])[ci]; if(!r) return; $('fb-v15-title').textContent=r.name||'-'; $('fb-v15-meta').innerHTML='<span class="fb-v15-badge fb-v15-badge-warn">'+esc(koDate(r.uploadDate))+'</span> '+chBadge(r.ch)+' <span class="fb-v15-badge fb-v15-badge-soft">'+esc(r.contentType||'-')+'</span> <span class="fb-v15-badge fb-v15-badge-soft">'+esc(r.collab||'-')+'</span> '+platformBadge(r.platform)+' <span class="fb-v15-badge fb-v15-badge-soft">셀렉 상품 '+itemsOf(r).length+'개</span> '+fbV15ContentLinkButton(r); var tabs=['summary'].concat(DAYS.map(function(d){return 'd'+d;})); $('fb-v15-tabs').innerHTML=tabs.map(function(t){ var label=t==='summary'?'요약':dayLabel(r,Number(t.slice(1))); return '<button class="fb-v15-tab '+(window._fbV15.tab===t?'active':'')+'" data-tab="'+t+'" onclick="fbV15SetTab(\''+t+'\')">'+esc(label)+'</button>'; }).join(''); renderModalBody(); }
  window.fbV15SetTab=function(t){ window._fbV15.tab=t; document.querySelectorAll('#fb-v15-tabs .fb-v15-tab').forEach(function(btn){ btn.classList.toggle('active',btn.getAttribute('data-tab')===t); }); renderModalBody(); };
  function renderModalBody(){ var ci=window._fbV15.creatorIndex; var r=(window.creators||[])[ci]; if(!r) return; if(window._fbV15.tab==='summary') renderSummary(r,ci); else renderDay(r,ci,Number(window._fbV15.tab.slice(1))); }
  function detailRows(r,ci,d,colspan){ var m=dayMetrics(r,ci,d); var day=m.day; var items=itemsOf(r); var individual=isIndividualLink(r); var rows=items.map(function(it,idx){ var data=getItemData(day,it,r.platform); var sales=num(data.sales); var rev=num(data.revenue); var share=m.total&&rev?rev/m.total*100:0; var itemClick=individual?num(data.click):m.click; var cvr=itemClick&&sales?sales/itemClick*100:0; var clickCell=individual?'<td>'+fmtN0(data.click)+'</td>':(idx===0?'<td rowspan="'+Math.max(items.length,1)+'">'+fmtN0(m.click)+'</td>':''); return '<tr><td>'+esc(itemUid(it,r.platform)||'-')+'</td><td>'+esc(itemCode(it)||'-')+'</td><td class="fb-v15-product-name">'+esc(itemName(it)||'-')+'</td><td>'+esc(itemColor(it)||'-')+'</td>'+clickCell+'<td>'+fmtN0(data.productLike)+'</td><td>'+fmtN0(sales)+'</td><td>'+fmtW(rev)+'</td><td>'+fmtP(cvr,1)+'</td><td>'+fmtP(share,1)+'</td></tr>'; }).join(''); return '<tr class="fb-v15-detail-row"><td colspan="'+colspan+'"><div class="fb-v15-detail-box"><table class="fb-v15-mini"><thead><tr><th>UID</th><th>상품 코드</th><th>상품명</th><th>컬러</th><th>링크 클릭</th><th>상품 좋아요</th><th>판매 수량</th><th>매출</th><th>CVR</th><th>매출 비중</th></tr></thead><tbody>'+rows+'</tbody></table></div></td></tr>'; }
  window.fbV15ToggleSummaryDay=function(d){ var ex=window._fbV15.expanded||{}; ex[d]=!ex[d]; window._fbV15.expanded=ex; var ci=window._fbV15.creatorIndex; renderSummary((window.creators||[])[ci],ci); };
  function renderSummary(r,ci){
    var t=creatorTotals(r,ci);
    var ttl={view:0,like:0,comment:0,productLike:0,click:0,sales:0,revenue:0,total:0};
    DAYS.forEach(function(d){
      var m=dayMetrics(r,ci,d);
      ttl.view=Math.max(ttl.view,num(m.view));
      ttl.like=Math.max(ttl.like,num(m.like));
      ttl.comment=Math.max(ttl.comment,num(m.comment));
      ttl.productLike=Math.max(ttl.productLike,num(m.productLike));
      if(d!==-1){
        ttl.click+=num(m.click);
        ttl.sales+=num(m.sales);
        ttl.revenue+=num(m.revenue);
        ttl.total+=num(m.total);
      }
    });
    ttl.ctr=ttl.view?ttl.click/ttl.view*100:0;
    ttl.cvr=ttl.click?ttl.sales/ttl.click*100:0;
    ttl.share=ttl.total?ttl.revenue/ttl.total*100:0;
    var ttlCost=costOf(r);
    ttl.roas=ttlCost?ttl.revenue/ttlCost*100:0;

    var rows=DAYS.map(function(d){
      var m=dayMetrics(r,ci,d);
      var open=!!(window._fbV15.expanded||{})[d];
      var row='<tr class="fb-v15-summary-day" onclick="fbV15ToggleSummaryDay('+d+')"><td><span class="fb-v15-toggle">'+(open?'−':'+')+'</span><span class="fb-v15-date-chip">'+esc(dayLabel(r,d))+'</span></td><td>'+fmtN0(m.view)+'</td><td>'+fmtN0(m.like)+'</td><td>'+fmtN0(m.comment)+'</td><td>'+fmtN0(m.click)+'</td><td>'+fmtP(m.ctr,1)+'</td><td>'+fmtN0(m.productLike)+'</td><td>'+fmtN0(m.sales)+'</td><td>'+fmtW(m.revenue)+'</td><td>'+deltaHtml(r,ci,d)+'</td><td>'+fmtP(m.cvr,1)+'</td><td>'+fmtW(m.total)+'</td><td>'+fmtP(m.share,1)+'</td><td>'+fmtP(m.roas,0)+'</td></tr>';
      return row+(open?detailRows(r,ci,d,14):'');
    }).join('');
    rows+='<tr class="fb-v15-summary-ttl"><td>TTL</td><td>'+fmtN0(ttl.view)+'</td><td>'+fmtN0(ttl.like)+'</td><td>'+fmtN0(ttl.comment)+'</td><td>'+fmtN0(ttl.click)+'</td><td>'+fmtP(ttl.ctr,1)+'</td><td>'+fmtN0(ttl.productLike)+'</td><td>'+fmtN0(ttl.sales)+'</td><td>'+fmtW(ttl.revenue)+'</td><td>-</td><td>'+fmtP(ttl.cvr,1)+'</td><td>'+fmtW(ttl.total)+'</td><td>'+fmtP(ttl.share,1)+'</td><td>'+fmtP(ttl.roas,0)+'</td></tr>';

    var productItems=itemsOf(r);
    var productDays=activeDays(r);
    var individual=isIndividualLink(r);
    var creatorClickTotal=0;
    productDays.forEach(function(d){
      if(d!==-1) creatorClickTotal+=num(dayMetrics(r,ci,d).click);
    });

    var productData=productItems.map(function(it){
      var out={item:it,click:0,productLike:0,sales:0,revenue:0};
      productDays.forEach(function(d){
        var m=dayMetrics(r,ci,d);
        var data=getItemData(m.day,it,r.platform)||{};
        var hasLike=Object.prototype.hasOwnProperty.call(data,'productLike')&&String(data.productLike==null?'':data.productLike).trim()!=='';
        if(hasLike) out.productLike=num(data.productLike);
        if(d!==-1){
          out.sales+=num(data.sales);
          out.revenue+=num(data.revenue);
          if(individual) out.click+=num(data.click);
        }
      });
      if(productItems.length===1){
        productDays.forEach(function(d){
          var m=dayMetrics(r,ci,d);
          var data=getItemData(m.day,it,r.platform)||{};
          if(!Object.prototype.hasOwnProperty.call(data,'productLike')&&num(m.productLike)) out.productLike=num(m.productLike);
          if(d!==-1){
            if(!Object.prototype.hasOwnProperty.call(data,'sales')&&num(m.sales)) out.sales=num(m.sales);
            if(!Object.prototype.hasOwnProperty.call(data,'revenue')&&num(m.revenue)) out.revenue=num(m.revenue);
          }
        });
      }
      if(!individual) out.click=creatorClickTotal;
      return out;
    });

    var productRevenueTotal=productData.reduce(function(s,x){return s+num(x.revenue);},0);
    var productSalesTotal=productData.reduce(function(s,x){return s+num(x.sales);},0);
    var productLikeTotal=productData.reduce(function(s,x){return s+num(x.productLike);},0);
    var productClickTotal=individual?productData.reduce(function(s,x){return s+num(x.click);},0):creatorClickTotal;

    var productRows=productData.map(function(x){
      var cvr=x.click?x.sales/x.click*100:0;
      var share=productRevenueTotal?x.revenue/productRevenueTotal*100:0;
      return '<tr><td>'+esc(itemUid(x.item,r.platform)||'-')+'</td><td>'+esc(itemCode(x.item)||'-')+'</td><td class="fb-v15-product-name">'+esc(itemName(x.item)||'-')+'</td><td>'+esc(itemColor(x.item)||'-')+'</td><td>'+fmtN0(x.click)+'</td><td>'+fmtN0(x.productLike)+'</td><td>'+fmtN0(x.sales)+'</td><td>'+fmtW(x.revenue)+'</td><td>'+fmtP(cvr,1)+'</td><td>'+fmtP(share,1)+'</td></tr>';
    }).join('');
    if(!productRows){
      productRows='<tr><td colspan="10" style="padding:18px;text-align:center;color:var(--color-text-tertiary);">List 탭에 연결된 노출 상품이 없습니다.</td></tr>';
    }
    var productCvr=productClickTotal?productSalesTotal/productClickTotal*100:0;
    productRows+='<tr class="fb-v15-summary-ttl"><td colspan="4">TTL</td><td>'+fmtN0(productClickTotal)+'</td><td>'+fmtN0(productLikeTotal)+'</td><td>'+fmtN0(productSalesTotal)+'</td><td>'+fmtW(productRevenueTotal)+'</td><td>'+fmtP(productCvr,1)+'</td><td>'+(productRevenueTotal?fmtP(100,1):'-')+'</td></tr>';

    $('fb-v15-body').innerHTML='<div class="fb-v15-summary-grid"><div class="fb-v15-card"><div class="fb-v15-card-label">누적 조회수</div><div class="fb-v15-card-val">'+fmtN0(t.view)+'</div></div><div class="fb-v15-card"><div class="fb-v15-card-label">누적 좋아요</div><div class="fb-v15-card-val">'+fmtN0(t.like)+'</div></div><div class="fb-v15-card"><div class="fb-v15-card-label">누적 댓글 수</div><div class="fb-v15-card-val">'+fmtN0(t.comment)+'</div></div><div class="fb-v15-card"><div class="fb-v15-card-label">링크 클릭</div><div class="fb-v15-card-val">'+fmtN0(t.click)+'</div></div><div class="fb-v15-card"><div class="fb-v15-card-label">판매 수량</div><div class="fb-v15-card-val">'+fmtN0(t.sales)+'</div></div><div class="fb-v15-card"><div class="fb-v15-card-label">매출</div><div class="fb-v15-card-val">'+fmtW(t.revenue)+'</div></div><div class="fb-v15-card"><div class="fb-v15-card-label">ROAS</div><div class="fb-v15-card-val">'+fmtP(t.roas,0)+'</div></div></div>'+
      '<div class="fb-v15-panel"><div class="fb-v15-panel-title">기준일별 성과 요약</div><table class="fb-v15-mini"><thead><tr><th>기준일</th><th>조회수</th><th>좋아요</th><th>댓글</th><th>링크 클릭</th><th>CTR</th><th>상품 좋아요</th><th>판매</th><th>매출</th><th>매출 증감</th><th>CVR</th><th>총매출</th><th>매출 비중</th><th>ROAS</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      '<div class="fb-v15-panel"><div class="fb-v15-panel-title">상품 별 성과 요약</div><div class="tbl-wrap" style="border:none;padding:0;"><table class="fb-v15-mini"><thead><tr><th>UID</th><th>상품 코드</th><th>브랜드숍</th><th>컬러</th><th>링크 클릭</th><th>상품 좋아요</th><th>판매 수량</th><th>매출</th><th>CVR</th><th>매출 비중</th></tr></thead><tbody>'+productRows+'</tbody></table></div></div>';
  }
  function directCell(r,ci,d,field,readonly){ var m=dayMetrics(r,ci,d); var val=m.day[field]||0; if(readonly) return '<td><span class="fb-v15-readonly">-</span></td>'; return '<td><span class="fb-v15-editable" ondblclick="fbV15StartEdit(this,'+ci+','+d+',\''+field+'\')">'+fmtN0(val)+'</span></td>'; }
  window.fbV15StartEdit=function(el,ci,d,field){ if(!el || el.querySelector('input')) return; var r=(window.creators||[])[ci]; var day=ensureDay(r,ci,d); var input=document.createElement('input'); input.className='fb-v15-input'; input.type='text'; input.value=String(num(day[field])); el.textContent=''; el.appendChild(input); input.focus(); input.select(); function commit(){ day[field]=num(input.value); if(field==='click'&&typeof window.fbCaptureLinkClicks==='function') window.fbCaptureLinkClicks(); if(typeof window.fbSaveCreators==='function') window.fbSaveCreators(); renderModalBody(); window.applyFeedbackFilter&&window.applyFeedbackFilter(); } input.addEventListener('blur',commit,{once:true}); input.addEventListener('keydown',function(e){ if(e.key==='Enter') input.blur(); if(e.key==='Escape') renderModalBody(); }); };
  window.fbV15StartItemClick=function(el,ci,d,itemIndex){ if(!el || el.querySelector('input')) return; var r=(window.creators||[])[ci]; var it=itemsOf(r)[itemIndex]; if(!r||!it) return; var day=ensureDay(r,ci,d); var data=ensureItemData(day,it,r.platform); var input=document.createElement('input'); input.className='fb-v15-input'; input.type='text'; input.value=String(num(data.click)); el.textContent=''; el.appendChild(input); input.focus(); input.select(); function commit(){ data.click=num(input.value); if(typeof window.fbCaptureLinkClicks==='function') window.fbCaptureLinkClicks(); if(typeof window.fbSaveCreators==='function') window.fbSaveCreators(); renderModalBody(); window.applyFeedbackFilter&&window.applyFeedbackFilter(); } input.addEventListener('blur',commit,{once:true}); input.addEventListener('keydown',function(e){ if(e.key==='Enter') input.blur(); if(e.key==='Escape') renderModalBody(); }); };
  function renderDay(r,ci,d){ var m=dayMetrics(r,ci,d); var readonly=d===-1; var cost=costOf(r); var individual=isIndividualLink(r); var roasDisplay=readonly?'-':fmtP(m.roas,0); var clickTop=readonly?'<span class="fb-v15-readonly">-</span>':'<span class="fb-v15-calc">'+fmtN0(m.click)+'</span>'; var metricHtml='<div class="fb-v15-metric-grid"><div class="fb-v15-metric-cell"><div class="fb-v15-metric-label">조회수</div><div class="fb-v15-metric-val">'+directCell(r,ci,d,'view',readonly).replace(/^<td>|<\/td>$/g,'')+'</div></div><div class="fb-v15-metric-cell"><div class="fb-v15-metric-label">좋아요</div><div class="fb-v15-metric-val">'+directCell(r,ci,d,'like',readonly).replace(/^<td>|<\/td>$/g,'')+'</div></div><div class="fb-v15-metric-cell"><div class="fb-v15-metric-label">댓글</div><div class="fb-v15-metric-val">'+directCell(r,ci,d,'comment',readonly).replace(/^<td>|<\/td>$/g,'')+'</div></div><div class="fb-v15-metric-cell"><div class="fb-v15-metric-label">링크 클릭</div><div class="fb-v15-metric-val">'+clickTop+'</div></div><div class="fb-v15-metric-cell"><div class="fb-v15-metric-label">CTR</div><div class="fb-v15-metric-val"><span class="fb-v15-calc">'+(readonly?'-':fmtP(m.ctr,1))+'</span></div></div><div class="fb-v15-metric-cell"><div class="fb-v15-metric-label">ROAS</div><div class="fb-v15-metric-val"><span class="fb-v15-calc">'+roasDisplay+'</span></div></div></div>'; var items=itemsOf(r); var rows=items.map(function(it,idx){ var data=getItemData(m.day,it,r.platform); var sales=num(data.sales), rev=num(data.revenue); var share=m.total&&rev?rev/m.total*100:0; var itemClick=individual?num(data.click):m.click; var cvr=itemClick&&sales?sales/itemClick*100:0; var itemRoas=cost&&rev?rev/cost*100:0; var clickCell;if(individual){ clickCell='<td><span class="'+(readonly?'fb-v15-readonly':'fb-v15-editable')+'" '+(readonly?'':'ondblclick="fbV15StartItemClick(this,'+ci+','+d+','+idx+')"')+'>'+(readonly?'-':fmtN0(data.click))+'</span></td>'; }else{ clickCell=idx===0?'<td rowspan="'+Math.max(items.length,1)+'"><span class="'+(readonly?'fb-v15-readonly':'fb-v15-editable')+'" '+(readonly?'':'ondblclick="fbV15StartEdit(this,'+ci+','+d+',\'click\')"')+'>'+(readonly?'-':fmtN0(m.click))+'</span></td>':''; } return '<tr><td>'+esc(itemUid(it,r.platform)||'-')+'</td><td>'+esc(itemCode(it)||'-')+'</td><td class="fb-v15-product-name">'+esc(itemName(it)||'-')+'</td><td>'+esc(itemColor(it)||'-')+'</td>'+clickCell+'<td class="fb-v15-auto">'+fmtN0(data.productLike)+'</td><td class="fb-v15-auto">'+fmtN0(sales)+'</td><td class="fb-v15-auto">'+fmtW(rev)+'</td><td>'+fmtP(cvr,1)+'</td><td class="fb-v15-auto">'+fmtW(m.total)+'</td><td>'+fmtP(share,1)+'</td><td>'+(readonly?'-':fmtP(itemRoas,0))+'</td></tr>'; }).join(''); $('fb-v15-body').innerHTML=metricHtml+'<div class="fb-v15-panel"><div class="fb-v15-panel-title">상세 내역</div><div class="tbl-wrap" style="border:none;padding:0;"><table class="fb-v15-mini"><thead><tr><th>UID</th><th>상품 코드</th><th>상품명</th><th>컬러</th><th>링크 클릭</th><th>상품 좋아요</th><th>판매 수량</th><th>매출</th><th>CVR</th><th>총 매출</th><th>매출 비중</th><th>ROAS</th></tr></thead><tbody>'+rows+'<tr class="fb-v15-ttl-row"><td colspan="4">TTL</td><td>'+fmtN0(m.click)+'</td><td>'+fmtN0(m.productLike)+'</td><td>'+fmtN0(m.sales)+'</td><td>'+fmtW(m.revenue)+'</td><td>'+fmtP(m.cvr,1)+'</td><td>'+fmtW(m.total)+'</td><td>'+fmtP(m.share,1)+'</td><td>'+roasDisplay+'</td></tr></tbody></table></div></div>'; }


  function boot(){ buildFeedbackShell(); window.applyFeedbackFilter&&window.applyFeedbackFilter(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot,0); }); else setTimeout(boot,0);
})();
