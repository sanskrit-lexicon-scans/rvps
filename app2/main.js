function makelink(indexobj,txt) {
 let href = window.location.href;
 let base = href.replace(/app2.*$/,'');
 let ipage = indexobj.ipage
 let newhref = `${base}app2/?${ipage}`;
 let html = `<a class="nppage" href="${newhref}"><span class="nppage">${txt}</span></a>`;
 return html;
}

function display_ipage_id(indexes) {
 [indexprev,indexcur,indexnext] = indexes;
 let prevlink = makelink(indexprev,'<');
 let nextlink = makelink(indexnext,'>');
 let ipage = indexcur['ipage'];
 let html = `<p>${prevlink} <span class="nppage">Page ${ipage}</span> ${nextlink}</p>`;
 let elt = document.getElementById('ipageid');
 elt.innerHTML = html;
}

function get_pdfpage_from_index(indexobj) {
 let vp = indexobj['vp'];
 let pdf = `rvps${vp}.pdf`;
 return pdf;
}

function get_ipage_html(indexcur) {
 let html = null;
 if (indexcur == null) {return html;}
 let pdfcur = get_pdfpage_from_index(indexcur);
 let urlcur = `../pdfpages/${pdfcur}`;
 let android = ` <a href='${urlcur}' style='position:relative; left:100px;'>Click to load pdf</a>`;
 let imageElt = `<object id='servepdf' type='application/pdf' data='${urlcur}' 
              style='width: 98%; height:98%'> ${android} </object>`;
 return imageElt;
}

function display_ipage_html(indexes) {
 display_ipage_id(indexes);
 let html = get_ipage_html(indexes[1]);
 let elt=document.getElementById('ipage');
 elt.innerHTML = html;
}

function get_indexobjs_from_ipage(ipage) {
 let icur = -1;
 for (let i=0; i < indexdata.length; i++ ) {
  if (indexdata[i].ipage == ipage) {
   icur = i;
   break;
  }
 }
 let prevobj, curobj, nextobj;
 if (icur == -1) {
  prevobj = indexdata[0];
  curobj = indexdata[0];
  nextobj = indexdata[1];
 } else {
  curobj = indexdata[icur];
  if (icur <= 0) {
   prevobj = curobj;
  } else {
   prevobj = indexdata[icur - 1];
  }
  let inext = icur + 1;
  if (inext < indexdata.length) {
   nextobj = indexdata[inext];
  } else {
   nextobj = curobj;
  }
 }
 return [prevobj,curobj,nextobj];
}

function get_ipage_from_url() {
 let href = window.location.href;
 let url = new URL(href);
 let search = url.search;
 let defaultval = 1;
 let x = search.match(/^[?]([0-9]+)$/);
 if (x == null) {
  return defaultval;
 }
 return parseInt(x[1]);
}

function display_ipage_url() {
 let url_ipage = get_ipage_from_url();
 let indexobjs = get_indexobjs_from_ipage(url_ipage);
 display_ipage_html(indexobjs);
}

document.getElementsByTagName("BODY")[0].onload = display_ipage_url;
