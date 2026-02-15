var Ss=Object.defineProperty;var Ts=(w,t,o)=>t in w?Ss(w,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):w[t]=o;var ae=(w,t,o)=>Ts(w,typeof t!="symbol"?t+"":t,o);import*as te from"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const d of c.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function o(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(l){if(l.ep)return;l.ep=!0;const c=o(l);fetch(l.href,c)}})();const Ge=class Ge{};ae(Ge,"localStorage",window.localStorage),ae(Ge,"sessionStorage",window.sessionStorage),ae(Ge,"createKey",function(t,o){return this.getMD5Hash([t,o].join("-"))}),ae(Ge,"getItem",function(t,o){var r=this.createKey(t,o),l=JSON.parse(sessionStorage.getItem(r))||JSON.parse(localStorage.getItem(r));if(l){var c=l.value,d=Number(l.expire),p=new Date().getTime();if(d){if(d>p)return c;deleteItem(t,o)}else return c}}),ae(Ge,"setItem",function(t,o,r,l){var c={namespace:t,key:o,value:r};l?(c.expire=l.getTime(),localStorage.setItem(this.createKey(t,o),JSON.stringify(c))):sessionStorage.setItem(this.createKey(t,o),JSON.stringify(c))}),ae(Ge,"deleteItem",function(t,o){sessionStorage.removeItem(this.createKey(t,o)),localStorage.removeItem(this.createKey(t,o))}),ae(Ge,"getInstance",function(t){return{getItem:function(o){return Ge.getItem(t,o)},setItem:function(o,r,l){Ge.setItem(t,o,r,l)},deleteItem:function(o){Ge.deleteItem(t,o)}}}),ae(Ge,"getMD5Hash",function(t){var o=new Array(0,3614090360,3905402710,606105819,3250441966,4118548399,1200080426,2821735955,4249261313,1770035416,2336552879,4294925233,2304563134,1804603682,4254626195,2792965006,1236535329,4129170786,3225465664,643717713,3921069994,3593408605,38016083,3634488961,3889429448,568446438,3275163606,4107603335,1163531501,2850285829,4243563512,1735328473,2368359562,4294588738,2272392833,1839030562,4259657740,2763975236,1272893353,4139469664,3200236656,681279174,3936430074,3572445317,76029189,3654602809,3873151461,530742520,3299628645,4096336452,1126891415,2878612391,4237533241,1700485571,2399980690,4293915773,2240044497,1873313359,4264355552,2734768916,1309151649,4149444226,3174756917,718787259,3951481745),r=new Array(new Array(0,7,1),new Array(1,12,2),new Array(2,17,3),new Array(3,22,4),new Array(4,7,5),new Array(5,12,6),new Array(6,17,7),new Array(7,22,8),new Array(8,7,9),new Array(9,12,10),new Array(10,17,11),new Array(11,22,12),new Array(12,7,13),new Array(13,12,14),new Array(14,17,15),new Array(15,22,16)),l=new Array(new Array(1,5,17),new Array(6,9,18),new Array(11,14,19),new Array(0,20,20),new Array(5,5,21),new Array(10,9,22),new Array(15,14,23),new Array(4,20,24),new Array(9,5,25),new Array(14,9,26),new Array(3,14,27),new Array(8,20,28),new Array(13,5,29),new Array(2,9,30),new Array(7,14,31),new Array(12,20,32)),c=new Array(new Array(5,4,33),new Array(8,11,34),new Array(11,16,35),new Array(14,23,36),new Array(1,4,37),new Array(4,11,38),new Array(7,16,39),new Array(10,23,40),new Array(13,4,41),new Array(0,11,42),new Array(3,16,43),new Array(6,23,44),new Array(9,4,45),new Array(12,11,46),new Array(15,16,47),new Array(2,23,48)),d=new Array(new Array(0,6,49),new Array(7,10,50),new Array(14,15,51),new Array(5,21,52),new Array(12,6,53),new Array(3,10,54),new Array(10,15,55),new Array(1,21,56),new Array(8,6,57),new Array(15,10,58),new Array(6,15,59),new Array(13,21,60),new Array(4,6,61),new Array(11,10,62),new Array(2,15,63),new Array(9,21,64));function p(Q,X,se){return Q&X|~Q&se}function L(Q,X,se){return Q&se|X&~se}function b(Q,X,se){return Q^X^se}function E(Q,X,se){return X^(Q|~se)}var M=new Array(new Array(p,r),new Array(L,l),new Array(b,c),new Array(E,d));function U(Q){return String.fromCharCode(Q&255)+String.fromCharCode(Q>>>8&255)+String.fromCharCode(Q>>>16&255)+String.fromCharCode(Q>>>24&255)}function G(Q){for(;Q<0;)Q+=4294967296;for(;Q>4294967295;)Q-=4294967296;return Q}function le(Q,X,se,ee,ve){var Se,v,S,I,C,x,y,$,_;Se=ee[0],v=ee[1],S=ee[2],I=ee[3],C=ve[0],x=ve[1],y=ve[2],_=se(X[v],X[S],X[I]),$=X[Se]+_+Q[C]+o[y],$=G($),$=$<<x|$>>>32-x,$+=X[v],X[Se]=G($)}function ie(Q){var X,se,ee,ve,Se,v,S,I,C,x,y,$,_;if(ee=new Array(1732584193,4023233417,2562383102,271733878),Se=Q.length,v=Se&63,S=v<56?56-v:120-v,S>0)for(Q+="",x=0;x<S-1;x++)Q+="\0";for(Q+=U(Se*8),Q+=U(0),Se+=S+8,X=new Array(0,1,2,3),se=new Array(16),ve=new Array(4),$=0;$<Se;$+=64){for(x=0,y=$;x<16;x++,y+=4)se[x]=Q.charCodeAt(y)|Q.charCodeAt(y+1)<<8|Q.charCodeAt(y+2)<<16|Q.charCodeAt(y+3)<<24;for(x=0;x<4;x++)ve[x]=ee[x];for(x=0;x<4;x++)for(I=M[x][0],C=M[x][1],y=0;y<16;y++)le(se,ve,I,X,C[y]),_=X[0],X[0]=X[3],X[3]=X[2],X[2]=X[1],X[1]=_;for(x=0;x<4;x++)ee[x]+=ve[x],ee[x]=G(ee[x])}return U(ee[0])+U(ee[1])+U(ee[2])+U(ee[3])}function Le(Q){var X,se,ee,ve;for(ve=ie(Q),se="",X=0;X<16;X++)ee=ve.charCodeAt(X),se+="0123456789abcdef".charAt(ee>>4&15),se+="0123456789abcdef".charAt(ee&15);return se}return Le(t)});let xe=Ge;function ho(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}let At=ho();function bi(w){At=w}const ln={exec:()=>null};function pe(w,t=""){let o=typeof w=="string"?w:w.source;const r={replace:(l,c)=>{let d=typeof c=="string"?c:c.source;return d=d.replace(Ne.caret,"$1"),o=o.replace(l,d),r},getRegex:()=>new RegExp(o,t)};return r}const Ne={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:w=>new RegExp(`^( {0,3}${w})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:w=>new RegExp(`^ {0,${Math.min(3,w-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:w=>new RegExp(`^ {0,${Math.min(3,w-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:w=>new RegExp(`^ {0,${Math.min(3,w-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:w=>new RegExp(`^ {0,${Math.min(3,w-1)}}#`),htmlBeginRegex:w=>new RegExp(`^ {0,${Math.min(3,w-1)}}<(?:[a-z].*>|!--)`,"i")},Cs=/^(?:[ \t]*(?:\n|$))+/,As=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Is=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,dn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,$s=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,fo=/(?:[*+-]|\d{1,9}[.)])/,yi=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,vi=pe(yi).replace(/bull/g,fo).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),_s=pe(yi).replace(/bull/g,fo).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),bo=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ms=/^[^\n]+/,yo=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Rs=pe(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",yo).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Bs=pe(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,fo).getRegex(),Vn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",vo=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ds=pe("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",vo).replace("tag",Vn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),xi=pe(bo).replace("hr",dn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Vn).getRegex(),Ps=pe(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",xi).getRegex(),xo={blockquote:Ps,code:As,def:Rs,fences:Is,heading:$s,hr:dn,html:Ds,lheading:vi,list:Bs,newline:Cs,paragraph:xi,table:ln,text:Ms},ii=pe("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",dn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Vn).getRegex(),Ns={...xo,lheading:_s,table:ii,paragraph:pe(bo).replace("hr",dn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ii).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Vn).getRegex()},Os={...xo,html:pe(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",vo).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ln,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:pe(bo).replace("hr",dn).replace("heading",` *#{1,6} *[^
]`).replace("lheading",vi).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Fs=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,zs=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,wi=/^( {2,}|\\)\n(?!\s*$)/,Hs=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,jn=/[\p{P}\p{S}]/u,wo=/[\s\p{P}\p{S}]/u,ki=/[^\s\p{P}\p{S}]/u,Ws=pe(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,wo).getRegex(),Li=/(?!~)[\p{P}\p{S}]/u,qs=/(?!~)[\s\p{P}\p{S}]/u,Us=/(?:[^\s\p{P}\p{S}]|~)/u,Vs=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,Ei=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,js=pe(Ei,"u").replace(/punct/g,jn).getRegex(),Gs=pe(Ei,"u").replace(/punct/g,Li).getRegex(),Si="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ys=pe(Si,"gu").replace(/notPunctSpace/g,ki).replace(/punctSpace/g,wo).replace(/punct/g,jn).getRegex(),Ks=pe(Si,"gu").replace(/notPunctSpace/g,Us).replace(/punctSpace/g,qs).replace(/punct/g,Li).getRegex(),Xs=pe("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ki).replace(/punctSpace/g,wo).replace(/punct/g,jn).getRegex(),Zs=pe(/\\(punct)/,"gu").replace(/punct/g,jn).getRegex(),Js=pe(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Qs=pe(vo).replace("(?:-->|$)","-->").getRegex(),er=pe("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Qs).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Wn=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,tr=pe(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",Wn).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Ti=pe(/^!?\[(label)\]\[(ref)\]/).replace("label",Wn).replace("ref",yo).getRegex(),Ci=pe(/^!?\[(ref)\](?:\[\])?/).replace("ref",yo).getRegex(),nr=pe("reflink|nolink(?!\\()","g").replace("reflink",Ti).replace("nolink",Ci).getRegex(),ko={_backpedal:ln,anyPunctuation:Zs,autolink:Js,blockSkip:Vs,br:wi,code:zs,del:ln,emStrongLDelim:js,emStrongRDelimAst:Ys,emStrongRDelimUnd:Xs,escape:Fs,link:tr,nolink:Ci,punctuation:Ws,reflink:Ti,reflinkSearch:nr,tag:er,text:Hs,url:ln},or={...ko,link:pe(/^!?\[(label)\]\((.*?)\)/).replace("label",Wn).getRegex(),reflink:pe(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Wn).getRegex()},uo={...ko,emStrongRDelimAst:Ks,emStrongLDelim:Gs,url:pe(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},ir={...uo,br:pe(wi).replace("{2,}","*").getRegex(),text:pe(uo.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Nn={normal:xo,gfm:Ns,pedantic:Os},en={normal:ko,gfm:uo,breaks:ir,pedantic:or},sr={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},si=w=>sr[w];function at(w,t){if(t){if(Ne.escapeTest.test(w))return w.replace(Ne.escapeReplace,si)}else if(Ne.escapeTestNoEncode.test(w))return w.replace(Ne.escapeReplaceNoEncode,si);return w}function ri(w){try{w=encodeURI(w).replace(Ne.percentDecode,"%")}catch{return null}return w}function ai(w,t){var c;const o=w.replace(Ne.findPipe,(d,p,L)=>{let b=!1,E=p;for(;--E>=0&&L[E]==="\\";)b=!b;return b?"|":" |"}),r=o.split(Ne.splitPipe);let l=0;if(r[0].trim()||r.shift(),r.length>0&&!((c=r.at(-1))!=null&&c.trim())&&r.pop(),t)if(r.length>t)r.splice(t);else for(;r.length<t;)r.push("");for(;l<r.length;l++)r[l]=r[l].trim().replace(Ne.slashPipe,"|");return r}function tn(w,t,o){const r=w.length;if(r===0)return"";let l=0;for(;l<r&&w.charAt(r-l-1)===t;)l++;return w.slice(0,r-l)}function rr(w,t){if(w.indexOf(t[1])===-1)return-1;let o=0;for(let r=0;r<w.length;r++)if(w[r]==="\\")r++;else if(w[r]===t[0])o++;else if(w[r]===t[1]&&(o--,o<0))return r;return-1}function li(w,t,o,r,l){const c=t.href,d=t.title||null,p=w[1].replace(l.other.outputLinkReplace,"$1");if(w[0].charAt(0)!=="!"){r.state.inLink=!0;const L={type:"link",raw:o,href:c,title:d,text:p,tokens:r.inlineTokens(p)};return r.state.inLink=!1,L}return{type:"image",raw:o,href:c,title:d,text:p}}function ar(w,t,o){const r=w.match(o.other.indentCodeCompensation);if(r===null)return t;const l=r[1];return t.split(`
`).map(c=>{const d=c.match(o.other.beginningSpace);if(d===null)return c;const[p]=d;return p.length>=l.length?c.slice(l.length):c}).join(`
`)}class qn{constructor(t){ae(this,"options");ae(this,"rules");ae(this,"lexer");this.options=t||At}space(t){const o=this.rules.block.newline.exec(t);if(o&&o[0].length>0)return{type:"space",raw:o[0]}}code(t){const o=this.rules.block.code.exec(t);if(o){const r=o[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:o[0],codeBlockStyle:"indented",text:this.options.pedantic?r:tn(r,`
`)}}}fences(t){const o=this.rules.block.fences.exec(t);if(o){const r=o[0],l=ar(r,o[3]||"",this.rules);return{type:"code",raw:r,lang:o[2]?o[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):o[2],text:l}}}heading(t){const o=this.rules.block.heading.exec(t);if(o){let r=o[2].trim();if(this.rules.other.endingHash.test(r)){const l=tn(r,"#");(this.options.pedantic||!l||this.rules.other.endingSpaceChar.test(l))&&(r=l.trim())}return{type:"heading",raw:o[0],depth:o[1].length,text:r,tokens:this.lexer.inline(r)}}}hr(t){const o=this.rules.block.hr.exec(t);if(o)return{type:"hr",raw:tn(o[0],`
`)}}blockquote(t){const o=this.rules.block.blockquote.exec(t);if(o){let r=tn(o[0],`
`).split(`
`),l="",c="";const d=[];for(;r.length>0;){let p=!1;const L=[];let b;for(b=0;b<r.length;b++)if(this.rules.other.blockquoteStart.test(r[b]))L.push(r[b]),p=!0;else if(!p)L.push(r[b]);else break;r=r.slice(b);const E=L.join(`
`),M=E.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");l=l?`${l}
${E}`:E,c=c?`${c}
${M}`:M;const U=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(M,d,!0),this.lexer.state.top=U,r.length===0)break;const G=d.at(-1);if((G==null?void 0:G.type)==="code")break;if((G==null?void 0:G.type)==="blockquote"){const le=G,ie=le.raw+`
`+r.join(`
`),Le=this.blockquote(ie);d[d.length-1]=Le,l=l.substring(0,l.length-le.raw.length)+Le.raw,c=c.substring(0,c.length-le.text.length)+Le.text;break}else if((G==null?void 0:G.type)==="list"){const le=G,ie=le.raw+`
`+r.join(`
`),Le=this.list(ie);d[d.length-1]=Le,l=l.substring(0,l.length-G.raw.length)+Le.raw,c=c.substring(0,c.length-le.raw.length)+Le.raw,r=ie.substring(d.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:l,tokens:d,text:c}}}list(t){let o=this.rules.block.list.exec(t);if(o){let r=o[1].trim();const l=r.length>1,c={type:"list",raw:"",ordered:l,start:l?+r.slice(0,-1):"",loose:!1,items:[]};r=l?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=l?r:"[*+-]");const d=this.rules.other.listItemRegex(r);let p=!1;for(;t;){let b=!1,E="",M="";if(!(o=d.exec(t))||this.rules.block.hr.test(t))break;E=o[0],t=t.substring(E.length);let U=o[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,X=>" ".repeat(3*X.length)),G=t.split(`
`,1)[0],le=!U.trim(),ie=0;if(this.options.pedantic?(ie=2,M=U.trimStart()):le?ie=o[1].length+1:(ie=o[2].search(this.rules.other.nonSpaceChar),ie=ie>4?1:ie,M=U.slice(ie),ie+=o[1].length),le&&this.rules.other.blankLine.test(G)&&(E+=G+`
`,t=t.substring(G.length+1),b=!0),!b){const X=this.rules.other.nextBulletRegex(ie),se=this.rules.other.hrRegex(ie),ee=this.rules.other.fencesBeginRegex(ie),ve=this.rules.other.headingBeginRegex(ie),Se=this.rules.other.htmlBeginRegex(ie);for(;t;){const v=t.split(`
`,1)[0];let S;if(G=v,this.options.pedantic?(G=G.replace(this.rules.other.listReplaceNesting,"  "),S=G):S=G.replace(this.rules.other.tabCharGlobal,"    "),ee.test(G)||ve.test(G)||Se.test(G)||X.test(G)||se.test(G))break;if(S.search(this.rules.other.nonSpaceChar)>=ie||!G.trim())M+=`
`+S.slice(ie);else{if(le||U.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||ee.test(U)||ve.test(U)||se.test(U))break;M+=`
`+G}!le&&!G.trim()&&(le=!0),E+=v+`
`,t=t.substring(v.length+1),U=S.slice(ie)}}c.loose||(p?c.loose=!0:this.rules.other.doubleBlankLine.test(E)&&(p=!0));let Le=null,Q;this.options.gfm&&(Le=this.rules.other.listIsTask.exec(M),Le&&(Q=Le[0]!=="[ ] ",M=M.replace(this.rules.other.listReplaceTask,""))),c.items.push({type:"list_item",raw:E,task:!!Le,checked:Q,loose:!1,text:M,tokens:[]}),c.raw+=E}const L=c.items.at(-1);if(L)L.raw=L.raw.trimEnd(),L.text=L.text.trimEnd();else return;c.raw=c.raw.trimEnd();for(let b=0;b<c.items.length;b++)if(this.lexer.state.top=!1,c.items[b].tokens=this.lexer.blockTokens(c.items[b].text,[]),!c.loose){const E=c.items[b].tokens.filter(U=>U.type==="space"),M=E.length>0&&E.some(U=>this.rules.other.anyLine.test(U.raw));c.loose=M}if(c.loose)for(let b=0;b<c.items.length;b++)c.items[b].loose=!0;return c}}html(t){const o=this.rules.block.html.exec(t);if(o)return{type:"html",block:!0,raw:o[0],pre:o[1]==="pre"||o[1]==="script"||o[1]==="style",text:o[0]}}def(t){const o=this.rules.block.def.exec(t);if(o){const r=o[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),l=o[2]?o[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",c=o[3]?o[3].substring(1,o[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):o[3];return{type:"def",tag:r,raw:o[0],href:l,title:c}}}table(t){var p;const o=this.rules.block.table.exec(t);if(!o||!this.rules.other.tableDelimiter.test(o[2]))return;const r=ai(o[1]),l=o[2].replace(this.rules.other.tableAlignChars,"").split("|"),c=(p=o[3])!=null&&p.trim()?o[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],d={type:"table",raw:o[0],header:[],align:[],rows:[]};if(r.length===l.length){for(const L of l)this.rules.other.tableAlignRight.test(L)?d.align.push("right"):this.rules.other.tableAlignCenter.test(L)?d.align.push("center"):this.rules.other.tableAlignLeft.test(L)?d.align.push("left"):d.align.push(null);for(let L=0;L<r.length;L++)d.header.push({text:r[L],tokens:this.lexer.inline(r[L]),header:!0,align:d.align[L]});for(const L of c)d.rows.push(ai(L,d.header.length).map((b,E)=>({text:b,tokens:this.lexer.inline(b),header:!1,align:d.align[E]})));return d}}lheading(t){const o=this.rules.block.lheading.exec(t);if(o)return{type:"heading",raw:o[0],depth:o[2].charAt(0)==="="?1:2,text:o[1],tokens:this.lexer.inline(o[1])}}paragraph(t){const o=this.rules.block.paragraph.exec(t);if(o){const r=o[1].charAt(o[1].length-1)===`
`?o[1].slice(0,-1):o[1];return{type:"paragraph",raw:o[0],text:r,tokens:this.lexer.inline(r)}}}text(t){const o=this.rules.block.text.exec(t);if(o)return{type:"text",raw:o[0],text:o[0],tokens:this.lexer.inline(o[0])}}escape(t){const o=this.rules.inline.escape.exec(t);if(o)return{type:"escape",raw:o[0],text:o[1]}}tag(t){const o=this.rules.inline.tag.exec(t);if(o)return!this.lexer.state.inLink&&this.rules.other.startATag.test(o[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(o[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(o[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(o[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:o[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:o[0]}}link(t){const o=this.rules.inline.link.exec(t);if(o){const r=o[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;const d=tn(r.slice(0,-1),"\\");if((r.length-d.length)%2===0)return}else{const d=rr(o[2],"()");if(d>-1){const L=(o[0].indexOf("!")===0?5:4)+o[1].length+d;o[2]=o[2].substring(0,d),o[0]=o[0].substring(0,L).trim(),o[3]=""}}let l=o[2],c="";if(this.options.pedantic){const d=this.rules.other.pedanticHrefTitle.exec(l);d&&(l=d[1],c=d[3])}else c=o[3]?o[3].slice(1,-1):"";return l=l.trim(),this.rules.other.startAngleBracket.test(l)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?l=l.slice(1):l=l.slice(1,-1)),li(o,{href:l&&l.replace(this.rules.inline.anyPunctuation,"$1"),title:c&&c.replace(this.rules.inline.anyPunctuation,"$1")},o[0],this.lexer,this.rules)}}reflink(t,o){let r;if((r=this.rules.inline.reflink.exec(t))||(r=this.rules.inline.nolink.exec(t))){const l=(r[2]||r[1]).replace(this.rules.other.multipleSpaceGlobal," "),c=o[l.toLowerCase()];if(!c){const d=r[0].charAt(0);return{type:"text",raw:d,text:d}}return li(r,c,r[0],this.lexer,this.rules)}}emStrong(t,o,r=""){let l=this.rules.inline.emStrongLDelim.exec(t);if(!l||l[3]&&r.match(this.rules.other.unicodeAlphaNumeric))return;if(!(l[1]||l[2]||"")||!r||this.rules.inline.punctuation.exec(r)){const d=[...l[0]].length-1;let p,L,b=d,E=0;const M=l[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(M.lastIndex=0,o=o.slice(-1*t.length+d);(l=M.exec(o))!=null;){if(p=l[1]||l[2]||l[3]||l[4]||l[5]||l[6],!p)continue;if(L=[...p].length,l[3]||l[4]){b+=L;continue}else if((l[5]||l[6])&&d%3&&!((d+L)%3)){E+=L;continue}if(b-=L,b>0)continue;L=Math.min(L,L+b+E);const U=[...l[0]][0].length,G=t.slice(0,d+l.index+U+L);if(Math.min(d,L)%2){const ie=G.slice(1,-1);return{type:"em",raw:G,text:ie,tokens:this.lexer.inlineTokens(ie)}}const le=G.slice(2,-2);return{type:"strong",raw:G,text:le,tokens:this.lexer.inlineTokens(le)}}}}codespan(t){const o=this.rules.inline.code.exec(t);if(o){let r=o[2].replace(this.rules.other.newLineCharGlobal," ");const l=this.rules.other.nonSpaceChar.test(r),c=this.rules.other.startingSpaceChar.test(r)&&this.rules.other.endingSpaceChar.test(r);return l&&c&&(r=r.substring(1,r.length-1)),{type:"codespan",raw:o[0],text:r}}}br(t){const o=this.rules.inline.br.exec(t);if(o)return{type:"br",raw:o[0]}}del(t){const o=this.rules.inline.del.exec(t);if(o)return{type:"del",raw:o[0],text:o[2],tokens:this.lexer.inlineTokens(o[2])}}autolink(t){const o=this.rules.inline.autolink.exec(t);if(o){let r,l;return o[2]==="@"?(r=o[1],l="mailto:"+r):(r=o[1],l=r),{type:"link",raw:o[0],text:r,href:l,tokens:[{type:"text",raw:r,text:r}]}}}url(t){var r;let o;if(o=this.rules.inline.url.exec(t)){let l,c;if(o[2]==="@")l=o[0],c="mailto:"+l;else{let d;do d=o[0],o[0]=((r=this.rules.inline._backpedal.exec(o[0]))==null?void 0:r[0])??"";while(d!==o[0]);l=o[0],o[1]==="www."?c="http://"+o[0]:c=o[0]}return{type:"link",raw:o[0],text:l,href:c,tokens:[{type:"text",raw:l,text:l}]}}}inlineText(t){const o=this.rules.inline.text.exec(t);if(o){const r=this.lexer.state.inRawBlock;return{type:"text",raw:o[0],text:o[0],escaped:r}}}}class Ze{constructor(t){ae(this,"tokens");ae(this,"options");ae(this,"state");ae(this,"tokenizer");ae(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=t||At,this.options.tokenizer=this.options.tokenizer||new qn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const o={other:Ne,block:Nn.normal,inline:en.normal};this.options.pedantic?(o.block=Nn.pedantic,o.inline=en.pedantic):this.options.gfm&&(o.block=Nn.gfm,this.options.breaks?o.inline=en.breaks:o.inline=en.gfm),this.tokenizer.rules=o}static get rules(){return{block:Nn,inline:en}}static lex(t,o){return new Ze(o).lex(t)}static lexInline(t,o){return new Ze(o).inlineTokens(t)}lex(t){t=t.replace(Ne.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let o=0;o<this.inlineQueue.length;o++){const r=this.inlineQueue[o];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,o=[],r=!1){var l,c,d;for(this.options.pedantic&&(t=t.replace(Ne.tabCharGlobal,"    ").replace(Ne.spaceLine,""));t;){let p;if((c=(l=this.options.extensions)==null?void 0:l.block)!=null&&c.some(b=>(p=b.call({lexer:this},t,o))?(t=t.substring(p.raw.length),o.push(p),!0):!1))continue;if(p=this.tokenizer.space(t)){t=t.substring(p.raw.length);const b=o.at(-1);p.raw.length===1&&b!==void 0?b.raw+=`
`:o.push(p);continue}if(p=this.tokenizer.code(t)){t=t.substring(p.raw.length);const b=o.at(-1);(b==null?void 0:b.type)==="paragraph"||(b==null?void 0:b.type)==="text"?(b.raw+=`
`+p.raw,b.text+=`
`+p.text,this.inlineQueue.at(-1).src=b.text):o.push(p);continue}if(p=this.tokenizer.fences(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.heading(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.hr(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.blockquote(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.list(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.html(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.def(t)){t=t.substring(p.raw.length);const b=o.at(-1);(b==null?void 0:b.type)==="paragraph"||(b==null?void 0:b.type)==="text"?(b.raw+=`
`+p.raw,b.text+=`
`+p.raw,this.inlineQueue.at(-1).src=b.text):this.tokens.links[p.tag]||(this.tokens.links[p.tag]={href:p.href,title:p.title});continue}if(p=this.tokenizer.table(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.lheading(t)){t=t.substring(p.raw.length),o.push(p);continue}let L=t;if((d=this.options.extensions)!=null&&d.startBlock){let b=1/0;const E=t.slice(1);let M;this.options.extensions.startBlock.forEach(U=>{M=U.call({lexer:this},E),typeof M=="number"&&M>=0&&(b=Math.min(b,M))}),b<1/0&&b>=0&&(L=t.substring(0,b+1))}if(this.state.top&&(p=this.tokenizer.paragraph(L))){const b=o.at(-1);r&&(b==null?void 0:b.type)==="paragraph"?(b.raw+=`
`+p.raw,b.text+=`
`+p.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=b.text):o.push(p),r=L.length!==t.length,t=t.substring(p.raw.length);continue}if(p=this.tokenizer.text(t)){t=t.substring(p.raw.length);const b=o.at(-1);(b==null?void 0:b.type)==="text"?(b.raw+=`
`+p.raw,b.text+=`
`+p.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=b.text):o.push(p);continue}if(t){const b="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(b);break}else throw new Error(b)}}return this.state.top=!0,o}inline(t,o=[]){return this.inlineQueue.push({src:t,tokens:o}),o}inlineTokens(t,o=[]){var p,L,b;let r=t,l=null;if(this.tokens.links){const E=Object.keys(this.tokens.links);if(E.length>0)for(;(l=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)E.includes(l[0].slice(l[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,l.index)+"["+"a".repeat(l[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(l=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,l.index)+"["+"a".repeat(l[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(l=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,l.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let c=!1,d="";for(;t;){c||(d=""),c=!1;let E;if((L=(p=this.options.extensions)==null?void 0:p.inline)!=null&&L.some(U=>(E=U.call({lexer:this},t,o))?(t=t.substring(E.raw.length),o.push(E),!0):!1))continue;if(E=this.tokenizer.escape(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.tag(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.link(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(E.raw.length);const U=o.at(-1);E.type==="text"&&(U==null?void 0:U.type)==="text"?(U.raw+=E.raw,U.text+=E.text):o.push(E);continue}if(E=this.tokenizer.emStrong(t,r,d)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.codespan(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.br(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.del(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.autolink(t)){t=t.substring(E.raw.length),o.push(E);continue}if(!this.state.inLink&&(E=this.tokenizer.url(t))){t=t.substring(E.raw.length),o.push(E);continue}let M=t;if((b=this.options.extensions)!=null&&b.startInline){let U=1/0;const G=t.slice(1);let le;this.options.extensions.startInline.forEach(ie=>{le=ie.call({lexer:this},G),typeof le=="number"&&le>=0&&(U=Math.min(U,le))}),U<1/0&&U>=0&&(M=t.substring(0,U+1))}if(E=this.tokenizer.inlineText(M)){t=t.substring(E.raw.length),E.raw.slice(-1)!=="_"&&(d=E.raw.slice(-1)),c=!0;const U=o.at(-1);(U==null?void 0:U.type)==="text"?(U.raw+=E.raw,U.text+=E.text):o.push(E);continue}if(t){const U="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(U);break}else throw new Error(U)}}return o}}class Un{constructor(t){ae(this,"options");ae(this,"parser");this.options=t||At}space(t){return""}code({text:t,lang:o,escaped:r}){var d;const l=(d=(o||"").match(Ne.notSpaceStart))==null?void 0:d[0],c=t.replace(Ne.endingNewline,"")+`
`;return l?'<pre><code class="language-'+at(l)+'">'+(r?c:at(c,!0))+`</code></pre>
`:"<pre><code>"+(r?c:at(c,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:o}){return`<h${o}>${this.parser.parseInline(t)}</h${o}>
`}hr(t){return`<hr>
`}list(t){const o=t.ordered,r=t.start;let l="";for(let p=0;p<t.items.length;p++){const L=t.items[p];l+=this.listitem(L)}const c=o?"ol":"ul",d=o&&r!==1?' start="'+r+'"':"";return"<"+c+d+`>
`+l+"</"+c+`>
`}listitem(t){var r;let o="";if(t.task){const l=this.checkbox({checked:!!t.checked});t.loose?((r=t.tokens[0])==null?void 0:r.type)==="paragraph"?(t.tokens[0].text=l+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=l+" "+at(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:l+" ",text:l+" ",escaped:!0}):o+=l+" "}return o+=this.parser.parse(t.tokens,!!t.loose),`<li>${o}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let o="",r="";for(let c=0;c<t.header.length;c++)r+=this.tablecell(t.header[c]);o+=this.tablerow({text:r});let l="";for(let c=0;c<t.rows.length;c++){const d=t.rows[c];r="";for(let p=0;p<d.length;p++)r+=this.tablecell(d[p]);l+=this.tablerow({text:r})}return l&&(l=`<tbody>${l}</tbody>`),`<table>
<thead>
`+o+`</thead>
`+l+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){const o=this.parser.parseInline(t.tokens),r=t.header?"th":"td";return(t.align?`<${r} align="${t.align}">`:`<${r}>`)+o+`</${r}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${at(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:o,tokens:r}){const l=this.parser.parseInline(r),c=ri(t);if(c===null)return l;t=c;let d='<a href="'+t+'"';return o&&(d+=' title="'+at(o)+'"'),d+=">"+l+"</a>",d}image({href:t,title:o,text:r}){const l=ri(t);if(l===null)return at(r);t=l;let c=`<img src="${t}" alt="${r}"`;return o&&(c+=` title="${at(o)}"`),c+=">",c}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:at(t.text)}}class Lo{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}}class Je{constructor(t){ae(this,"options");ae(this,"renderer");ae(this,"textRenderer");this.options=t||At,this.options.renderer=this.options.renderer||new Un,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Lo}static parse(t,o){return new Je(o).parse(t)}static parseInline(t,o){return new Je(o).parseInline(t)}parse(t,o=!0){var l,c;let r="";for(let d=0;d<t.length;d++){const p=t[d];if((c=(l=this.options.extensions)==null?void 0:l.renderers)!=null&&c[p.type]){const b=p,E=this.options.extensions.renderers[b.type].call({parser:this},b);if(E!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(b.type)){r+=E||"";continue}}const L=p;switch(L.type){case"space":{r+=this.renderer.space(L);continue}case"hr":{r+=this.renderer.hr(L);continue}case"heading":{r+=this.renderer.heading(L);continue}case"code":{r+=this.renderer.code(L);continue}case"table":{r+=this.renderer.table(L);continue}case"blockquote":{r+=this.renderer.blockquote(L);continue}case"list":{r+=this.renderer.list(L);continue}case"html":{r+=this.renderer.html(L);continue}case"paragraph":{r+=this.renderer.paragraph(L);continue}case"text":{let b=L,E=this.renderer.text(b);for(;d+1<t.length&&t[d+1].type==="text";)b=t[++d],E+=`
`+this.renderer.text(b);o?r+=this.renderer.paragraph({type:"paragraph",raw:E,text:E,tokens:[{type:"text",raw:E,text:E,escaped:!0}]}):r+=E;continue}default:{const b='Token with "'+L.type+'" type was not found.';if(this.options.silent)return console.error(b),"";throw new Error(b)}}}return r}parseInline(t,o=this.renderer){var l,c;let r="";for(let d=0;d<t.length;d++){const p=t[d];if((c=(l=this.options.extensions)==null?void 0:l.renderers)!=null&&c[p.type]){const b=this.options.extensions.renderers[p.type].call({parser:this},p);if(b!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(p.type)){r+=b||"";continue}}const L=p;switch(L.type){case"escape":{r+=o.text(L);break}case"html":{r+=o.html(L);break}case"link":{r+=o.link(L);break}case"image":{r+=o.image(L);break}case"strong":{r+=o.strong(L);break}case"em":{r+=o.em(L);break}case"codespan":{r+=o.codespan(L);break}case"br":{r+=o.br(L);break}case"del":{r+=o.del(L);break}case"text":{r+=o.text(L);break}default:{const b='Token with "'+L.type+'" type was not found.';if(this.options.silent)return console.error(b),"";throw new Error(b)}}}return r}}class cn{constructor(t){ae(this,"options");ae(this,"block");this.options=t||At}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?Ze.lex:Ze.lexInline}provideParser(){return this.block?Je.parse:Je.parseInline}}ae(cn,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));class lr{constructor(...t){ae(this,"defaults",ho());ae(this,"options",this.setOptions);ae(this,"parse",this.parseMarkdown(!0));ae(this,"parseInline",this.parseMarkdown(!1));ae(this,"Parser",Je);ae(this,"Renderer",Un);ae(this,"TextRenderer",Lo);ae(this,"Lexer",Ze);ae(this,"Tokenizer",qn);ae(this,"Hooks",cn);this.use(...t)}walkTokens(t,o){var l,c;let r=[];for(const d of t)switch(r=r.concat(o.call(this,d)),d.type){case"table":{const p=d;for(const L of p.header)r=r.concat(this.walkTokens(L.tokens,o));for(const L of p.rows)for(const b of L)r=r.concat(this.walkTokens(b.tokens,o));break}case"list":{const p=d;r=r.concat(this.walkTokens(p.items,o));break}default:{const p=d;(c=(l=this.defaults.extensions)==null?void 0:l.childTokens)!=null&&c[p.type]?this.defaults.extensions.childTokens[p.type].forEach(L=>{const b=p[L].flat(1/0);r=r.concat(this.walkTokens(b,o))}):p.tokens&&(r=r.concat(this.walkTokens(p.tokens,o)))}}return r}use(...t){const o=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(r=>{const l={...r};if(l.async=this.defaults.async||l.async||!1,r.extensions&&(r.extensions.forEach(c=>{if(!c.name)throw new Error("extension name required");if("renderer"in c){const d=o.renderers[c.name];d?o.renderers[c.name]=function(...p){let L=c.renderer.apply(this,p);return L===!1&&(L=d.apply(this,p)),L}:o.renderers[c.name]=c.renderer}if("tokenizer"in c){if(!c.level||c.level!=="block"&&c.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const d=o[c.level];d?d.unshift(c.tokenizer):o[c.level]=[c.tokenizer],c.start&&(c.level==="block"?o.startBlock?o.startBlock.push(c.start):o.startBlock=[c.start]:c.level==="inline"&&(o.startInline?o.startInline.push(c.start):o.startInline=[c.start]))}"childTokens"in c&&c.childTokens&&(o.childTokens[c.name]=c.childTokens)}),l.extensions=o),r.renderer){const c=this.defaults.renderer||new Un(this.defaults);for(const d in r.renderer){if(!(d in c))throw new Error(`renderer '${d}' does not exist`);if(["options","parser"].includes(d))continue;const p=d,L=r.renderer[p],b=c[p];c[p]=(...E)=>{let M=L.apply(c,E);return M===!1&&(M=b.apply(c,E)),M||""}}l.renderer=c}if(r.tokenizer){const c=this.defaults.tokenizer||new qn(this.defaults);for(const d in r.tokenizer){if(!(d in c))throw new Error(`tokenizer '${d}' does not exist`);if(["options","rules","lexer"].includes(d))continue;const p=d,L=r.tokenizer[p],b=c[p];c[p]=(...E)=>{let M=L.apply(c,E);return M===!1&&(M=b.apply(c,E)),M}}l.tokenizer=c}if(r.hooks){const c=this.defaults.hooks||new cn;for(const d in r.hooks){if(!(d in c))throw new Error(`hook '${d}' does not exist`);if(["options","block"].includes(d))continue;const p=d,L=r.hooks[p],b=c[p];cn.passThroughHooks.has(d)?c[p]=E=>{if(this.defaults.async)return Promise.resolve(L.call(c,E)).then(U=>b.call(c,U));const M=L.call(c,E);return b.call(c,M)}:c[p]=(...E)=>{let M=L.apply(c,E);return M===!1&&(M=b.apply(c,E)),M}}l.hooks=c}if(r.walkTokens){const c=this.defaults.walkTokens,d=r.walkTokens;l.walkTokens=function(p){let L=[];return L.push(d.call(this,p)),c&&(L=L.concat(c.call(this,p))),L}}this.defaults={...this.defaults,...l}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,o){return Ze.lex(t,o??this.defaults)}parser(t,o){return Je.parse(t,o??this.defaults)}parseMarkdown(t){return(r,l)=>{const c={...l},d={...this.defaults,...c},p=this.onError(!!d.silent,!!d.async);if(this.defaults.async===!0&&c.async===!1)return p(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof r>"u"||r===null)return p(new Error("marked(): input parameter is undefined or null"));if(typeof r!="string")return p(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(r)+", string expected"));d.hooks&&(d.hooks.options=d,d.hooks.block=t);const L=d.hooks?d.hooks.provideLexer():t?Ze.lex:Ze.lexInline,b=d.hooks?d.hooks.provideParser():t?Je.parse:Je.parseInline;if(d.async)return Promise.resolve(d.hooks?d.hooks.preprocess(r):r).then(E=>L(E,d)).then(E=>d.hooks?d.hooks.processAllTokens(E):E).then(E=>d.walkTokens?Promise.all(this.walkTokens(E,d.walkTokens)).then(()=>E):E).then(E=>b(E,d)).then(E=>d.hooks?d.hooks.postprocess(E):E).catch(p);try{d.hooks&&(r=d.hooks.preprocess(r));let E=L(r,d);d.hooks&&(E=d.hooks.processAllTokens(E)),d.walkTokens&&this.walkTokens(E,d.walkTokens);let M=b(E,d);return d.hooks&&(M=d.hooks.postprocess(M)),M}catch(E){return p(E)}}}onError(t,o){return r=>{if(r.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const l="<p>An error occurred:</p><pre>"+at(r.message+"",!0)+"</pre>";return o?Promise.resolve(l):l}if(o)return Promise.reject(r);throw r}}}const Ct=new lr;function de(w,t){return Ct.parse(w,t)}de.options=de.setOptions=function(w){return Ct.setOptions(w),de.defaults=Ct.defaults,bi(de.defaults),de};de.getDefaults=ho;de.defaults=At;de.use=function(...w){return Ct.use(...w),de.defaults=Ct.defaults,bi(de.defaults),de};de.walkTokens=function(w,t){return Ct.walkTokens(w,t)};de.parseInline=Ct.parseInline;de.Parser=Je;de.parser=Je.parse;de.Renderer=Un;de.TextRenderer=Lo;de.Lexer=Ze;de.lexer=Ze.lex;de.Tokenizer=qn;de.Hooks=cn;de.parse=de;de.options;de.setOptions;de.use;de.walkTokens;de.parseInline;Je.parse;Ze.lex;/*! @license DOMPurify 3.3.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.1/LICENSE */const{entries:Ai,setPrototypeOf:ci,isFrozen:cr,getPrototypeOf:dr,getOwnPropertyDescriptor:ur}=Object;let{freeze:Oe,seal:Qe,create:po}=Object,{apply:go,construct:mo}=typeof Reflect<"u"&&Reflect;Oe||(Oe=function(t){return t});Qe||(Qe=function(t){return t});go||(go=function(t,o){for(var r=arguments.length,l=new Array(r>2?r-2:0),c=2;c<r;c++)l[c-2]=arguments[c];return t.apply(o,l)});mo||(mo=function(t){for(var o=arguments.length,r=new Array(o>1?o-1:0),l=1;l<o;l++)r[l-1]=arguments[l];return new t(...r)});const On=Fe(Array.prototype.forEach),pr=Fe(Array.prototype.lastIndexOf),di=Fe(Array.prototype.pop),nn=Fe(Array.prototype.push),gr=Fe(Array.prototype.splice),Hn=Fe(String.prototype.toLowerCase),io=Fe(String.prototype.toString),so=Fe(String.prototype.match),on=Fe(String.prototype.replace),mr=Fe(String.prototype.indexOf),hr=Fe(String.prototype.trim),rt=Fe(Object.prototype.hasOwnProperty),Pe=Fe(RegExp.prototype.test),sn=fr(TypeError);function Fe(w){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var o=arguments.length,r=new Array(o>1?o-1:0),l=1;l<o;l++)r[l-1]=arguments[l];return go(w,t,r)}}function fr(w){return function(){for(var t=arguments.length,o=new Array(t),r=0;r<t;r++)o[r]=arguments[r];return mo(w,o)}}function oe(w,t){let o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Hn;ci&&ci(w,null);let r=t.length;for(;r--;){let l=t[r];if(typeof l=="string"){const c=o(l);c!==l&&(cr(t)||(t[r]=c),l=c)}w[l]=!0}return w}function br(w){for(let t=0;t<w.length;t++)rt(w,t)||(w[t]=null);return w}function lt(w){const t=po(null);for(const[o,r]of Ai(w))rt(w,o)&&(Array.isArray(r)?t[o]=br(r):r&&typeof r=="object"&&r.constructor===Object?t[o]=lt(r):t[o]=r);return t}function rn(w,t){for(;w!==null;){const r=ur(w,t);if(r){if(r.get)return Fe(r.get);if(typeof r.value=="function")return Fe(r.value)}w=dr(w)}function o(){return null}return o}const ui=Oe(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),ro=Oe(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),ao=Oe(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),yr=Oe(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),lo=Oe(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),vr=Oe(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),pi=Oe(["#text"]),gi=Oe(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),co=Oe(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),mi=Oe(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Fn=Oe(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),xr=Qe(/\{\{[\w\W]*|[\w\W]*\}\}/gm),wr=Qe(/<%[\w\W]*|[\w\W]*%>/gm),kr=Qe(/\$\{[\w\W]*/gm),Lr=Qe(/^data-[\-\w.\u00B7-\uFFFF]+$/),Er=Qe(/^aria-[\-\w]+$/),Ii=Qe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Sr=Qe(/^(?:\w+script|data):/i),Tr=Qe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),$i=Qe(/^html$/i),Cr=Qe(/^[a-z][.\w]*(-[.\w]+)+$/i);var hi=Object.freeze({__proto__:null,ARIA_ATTR:Er,ATTR_WHITESPACE:Tr,CUSTOM_ELEMENT:Cr,DATA_ATTR:Lr,DOCTYPE_NAME:$i,ERB_EXPR:wr,IS_ALLOWED_URI:Ii,IS_SCRIPT_OR_DATA:Sr,MUSTACHE_EXPR:xr,TMPLIT_EXPR:kr});const an={element:1,text:3,progressingInstruction:7,comment:8,document:9},Ar=function(){return typeof window>"u"?null:window},Ir=function(t,o){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let r=null;const l="data-tt-policy-suffix";o&&o.hasAttribute(l)&&(r=o.getAttribute(l));const c="dompurify"+(r?"#"+r:"");try{return t.createPolicy(c,{createHTML(d){return d},createScriptURL(d){return d}})}catch{return console.warn("TrustedTypes policy "+c+" could not be created."),null}},fi=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function _i(){let w=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Ar();const t=V=>_i(V);if(t.version="3.3.1",t.removed=[],!w||!w.document||w.document.nodeType!==an.document||!w.Element)return t.isSupported=!1,t;let{document:o}=w;const r=o,l=r.currentScript,{DocumentFragment:c,HTMLTemplateElement:d,Node:p,Element:L,NodeFilter:b,NamedNodeMap:E=w.NamedNodeMap||w.MozNamedAttrMap,HTMLFormElement:M,DOMParser:U,trustedTypes:G}=w,le=L.prototype,ie=rn(le,"cloneNode"),Le=rn(le,"remove"),Q=rn(le,"nextSibling"),X=rn(le,"childNodes"),se=rn(le,"parentNode");if(typeof d=="function"){const V=o.createElement("template");V.content&&V.content.ownerDocument&&(o=V.content.ownerDocument)}let ee,ve="";const{implementation:Se,createNodeIterator:v,createDocumentFragment:S,getElementsByTagName:I}=o,{importNode:C}=r;let x=fi();t.isSupported=typeof Ai=="function"&&typeof se=="function"&&Se&&Se.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:y,ERB_EXPR:$,TMPLIT_EXPR:_,DATA_ATTR:B,ARIA_ATTR:j,IS_SCRIPT_OR_DATA:K,ATTR_WHITESPACE:re,CUSTOM_ELEMENT:we}=hi;let{IS_ALLOWED_URI:q}=hi,ne=null;const H=oe({},[...ui,...ro,...ao,...lo,...pi]);let Z=null;const ze=oe({},[...gi,...co,...mi,...Fn]);let J=Object.seal(po(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),ct=null,It=null;const He=Object.seal(po(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Ot=!0,dt=!0,mt=!1,vt=!0,et=!1,ut=!0,Y=!1,ge=!1,fe=!1,Me=!1,Te=!1,ue=!1,xt=!0,Ft=!1;const un="user-content-";let zt=!0,wt=!1,ht={},qe=null;const Ht=oe({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Wt=null;const pn=oe({},["audio","video","img","source","image","track"]);let qt=null;const Ut=oe({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),$t="http://www.w3.org/1998/Math/MathML",kt="http://www.w3.org/2000/svg",tt="http://www.w3.org/1999/xhtml";let ft=tt,_t=!1,Vt=null;const gn=oe({},[$t,kt,tt],io);let Mt=oe({},["mi","mo","mn","ms","mtext"]),Rt=oe({},["annotation-xml"]);const Gn=oe({},["title","style","font","a","script"]);let Lt=null;const Yn=["application/xhtml+xml","text/html"],Kn="text/html";let Ee=null,bt=null;const Xn=o.createElement("form"),mn=function(u){return u instanceof RegExp||u instanceof Function},jt=function(){let u=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(bt&&bt===u)){if((!u||typeof u!="object")&&(u={}),u=lt(u),Lt=Yn.indexOf(u.PARSER_MEDIA_TYPE)===-1?Kn:u.PARSER_MEDIA_TYPE,Ee=Lt==="application/xhtml+xml"?io:Hn,ne=rt(u,"ALLOWED_TAGS")?oe({},u.ALLOWED_TAGS,Ee):H,Z=rt(u,"ALLOWED_ATTR")?oe({},u.ALLOWED_ATTR,Ee):ze,Vt=rt(u,"ALLOWED_NAMESPACES")?oe({},u.ALLOWED_NAMESPACES,io):gn,qt=rt(u,"ADD_URI_SAFE_ATTR")?oe(lt(Ut),u.ADD_URI_SAFE_ATTR,Ee):Ut,Wt=rt(u,"ADD_DATA_URI_TAGS")?oe(lt(pn),u.ADD_DATA_URI_TAGS,Ee):pn,qe=rt(u,"FORBID_CONTENTS")?oe({},u.FORBID_CONTENTS,Ee):Ht,ct=rt(u,"FORBID_TAGS")?oe({},u.FORBID_TAGS,Ee):lt({}),It=rt(u,"FORBID_ATTR")?oe({},u.FORBID_ATTR,Ee):lt({}),ht=rt(u,"USE_PROFILES")?u.USE_PROFILES:!1,Ot=u.ALLOW_ARIA_ATTR!==!1,dt=u.ALLOW_DATA_ATTR!==!1,mt=u.ALLOW_UNKNOWN_PROTOCOLS||!1,vt=u.ALLOW_SELF_CLOSE_IN_ATTR!==!1,et=u.SAFE_FOR_TEMPLATES||!1,ut=u.SAFE_FOR_XML!==!1,Y=u.WHOLE_DOCUMENT||!1,Me=u.RETURN_DOM||!1,Te=u.RETURN_DOM_FRAGMENT||!1,ue=u.RETURN_TRUSTED_TYPE||!1,fe=u.FORCE_BODY||!1,xt=u.SANITIZE_DOM!==!1,Ft=u.SANITIZE_NAMED_PROPS||!1,zt=u.KEEP_CONTENT!==!1,wt=u.IN_PLACE||!1,q=u.ALLOWED_URI_REGEXP||Ii,ft=u.NAMESPACE||tt,Mt=u.MATHML_TEXT_INTEGRATION_POINTS||Mt,Rt=u.HTML_INTEGRATION_POINTS||Rt,J=u.CUSTOM_ELEMENT_HANDLING||{},u.CUSTOM_ELEMENT_HANDLING&&mn(u.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(J.tagNameCheck=u.CUSTOM_ELEMENT_HANDLING.tagNameCheck),u.CUSTOM_ELEMENT_HANDLING&&mn(u.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(J.attributeNameCheck=u.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),u.CUSTOM_ELEMENT_HANDLING&&typeof u.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(J.allowCustomizedBuiltInElements=u.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),et&&(dt=!1),Te&&(Me=!0),ht&&(ne=oe({},pi),Z=[],ht.html===!0&&(oe(ne,ui),oe(Z,gi)),ht.svg===!0&&(oe(ne,ro),oe(Z,co),oe(Z,Fn)),ht.svgFilters===!0&&(oe(ne,ao),oe(Z,co),oe(Z,Fn)),ht.mathMl===!0&&(oe(ne,lo),oe(Z,mi),oe(Z,Fn))),u.ADD_TAGS&&(typeof u.ADD_TAGS=="function"?He.tagCheck=u.ADD_TAGS:(ne===H&&(ne=lt(ne)),oe(ne,u.ADD_TAGS,Ee))),u.ADD_ATTR&&(typeof u.ADD_ATTR=="function"?He.attributeCheck=u.ADD_ATTR:(Z===ze&&(Z=lt(Z)),oe(Z,u.ADD_ATTR,Ee))),u.ADD_URI_SAFE_ATTR&&oe(qt,u.ADD_URI_SAFE_ATTR,Ee),u.FORBID_CONTENTS&&(qe===Ht&&(qe=lt(qe)),oe(qe,u.FORBID_CONTENTS,Ee)),u.ADD_FORBID_CONTENTS&&(qe===Ht&&(qe=lt(qe)),oe(qe,u.ADD_FORBID_CONTENTS,Ee)),zt&&(ne["#text"]=!0),Y&&oe(ne,["html","head","body"]),ne.table&&(oe(ne,["tbody"]),delete ct.tbody),u.TRUSTED_TYPES_POLICY){if(typeof u.TRUSTED_TYPES_POLICY.createHTML!="function")throw sn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof u.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw sn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');ee=u.TRUSTED_TYPES_POLICY,ve=ee.createHTML("")}else ee===void 0&&(ee=Ir(G,l)),ee!==null&&typeof ve=="string"&&(ve=ee.createHTML(""));Oe&&Oe(u),bt=u}},hn=oe({},[...ro,...ao,...yr]),fn=oe({},[...lo,...vr]),Ye=function(u){let A=se(u);(!A||!A.tagName)&&(A={namespaceURI:ft,tagName:"template"});const F=Hn(u.tagName),ye=Hn(A.tagName);return Vt[u.namespaceURI]?u.namespaceURI===kt?A.namespaceURI===tt?F==="svg":A.namespaceURI===$t?F==="svg"&&(ye==="annotation-xml"||Mt[ye]):!!hn[F]:u.namespaceURI===$t?A.namespaceURI===tt?F==="math":A.namespaceURI===kt?F==="math"&&Rt[ye]:!!fn[F]:u.namespaceURI===tt?A.namespaceURI===kt&&!Rt[ye]||A.namespaceURI===$t&&!Mt[ye]?!1:!fn[F]&&(Gn[F]||!hn[F]):!!(Lt==="application/xhtml+xml"&&Vt[u.namespaceURI]):!1},Re=function(u){nn(t.removed,{element:u});try{se(u).removeChild(u)}catch{Le(u)}},Ue=function(u,A){try{nn(t.removed,{attribute:A.getAttributeNode(u),from:A})}catch{nn(t.removed,{attribute:null,from:A})}if(A.removeAttribute(u),u==="is")if(Me||Te)try{Re(A)}catch{}else try{A.setAttribute(u,"")}catch{}},bn=function(u){let A=null,F=null;if(fe)u="<remove></remove>"+u;else{const ke=so(u,/^[\r\n\t ]+/);F=ke&&ke[0]}Lt==="application/xhtml+xml"&&ft===tt&&(u='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+u+"</body></html>");const ye=ee?ee.createHTML(u):u;if(ft===tt)try{A=new U().parseFromString(ye,Lt)}catch{}if(!A||!A.documentElement){A=Se.createDocument(ft,"template",null);try{A.documentElement.innerHTML=_t?ve:ye}catch{}}const Ie=A.body||A.documentElement;return u&&F&&Ie.insertBefore(o.createTextNode(F),Ie.childNodes[0]||null),ft===tt?I.call(A,Y?"html":"body")[0]:Y?A.documentElement:Ie},Gt=function(u){return v.call(u.ownerDocument||u,u,b.SHOW_ELEMENT|b.SHOW_COMMENT|b.SHOW_TEXT|b.SHOW_PROCESSING_INSTRUCTION|b.SHOW_CDATA_SECTION,null)},me=function(u){return u instanceof M&&(typeof u.nodeName!="string"||typeof u.textContent!="string"||typeof u.removeChild!="function"||!(u.attributes instanceof E)||typeof u.removeAttribute!="function"||typeof u.setAttribute!="function"||typeof u.namespaceURI!="string"||typeof u.insertBefore!="function"||typeof u.hasChildNodes!="function")},yn=function(u){return typeof p=="function"&&u instanceof p};function nt(V,u,A){On(V,F=>{F.call(t,u,A,bt)})}const vn=function(u){let A=null;if(nt(x.beforeSanitizeElements,u,null),me(u))return Re(u),!0;const F=Ee(u.nodeName);if(nt(x.uponSanitizeElement,u,{tagName:F,allowedTags:ne}),ut&&u.hasChildNodes()&&!yn(u.firstElementChild)&&Pe(/<[/\w!]/g,u.innerHTML)&&Pe(/<[/\w!]/g,u.textContent)||u.nodeType===an.progressingInstruction||ut&&u.nodeType===an.comment&&Pe(/<[/\w]/g,u.data))return Re(u),!0;if(!(He.tagCheck instanceof Function&&He.tagCheck(F))&&(!ne[F]||ct[F])){if(!ct[F]&&wn(F)&&(J.tagNameCheck instanceof RegExp&&Pe(J.tagNameCheck,F)||J.tagNameCheck instanceof Function&&J.tagNameCheck(F)))return!1;if(zt&&!qe[F]){const ye=se(u)||u.parentNode,Ie=X(u)||u.childNodes;if(Ie&&ye){const ke=Ie.length;for(let Be=ke-1;Be>=0;--Be){const ot=ie(Ie[Be],!0);ot.__removalCount=(u.__removalCount||0)+1,ye.insertBefore(ot,Q(u))}}}return Re(u),!0}return u instanceof L&&!Ye(u)||(F==="noscript"||F==="noembed"||F==="noframes")&&Pe(/<\/no(script|embed|frames)/i,u.innerHTML)?(Re(u),!0):(et&&u.nodeType===an.text&&(A=u.textContent,On([y,$,_],ye=>{A=on(A,ye," ")}),u.textContent!==A&&(nn(t.removed,{element:u.cloneNode()}),u.textContent=A)),nt(x.afterSanitizeElements,u,null),!1)},xn=function(u,A,F){if(xt&&(A==="id"||A==="name")&&(F in o||F in Xn))return!1;if(!(dt&&!It[A]&&Pe(B,A))){if(!(Ot&&Pe(j,A))){if(!(He.attributeCheck instanceof Function&&He.attributeCheck(A,u))){if(!Z[A]||It[A]){if(!(wn(u)&&(J.tagNameCheck instanceof RegExp&&Pe(J.tagNameCheck,u)||J.tagNameCheck instanceof Function&&J.tagNameCheck(u))&&(J.attributeNameCheck instanceof RegExp&&Pe(J.attributeNameCheck,A)||J.attributeNameCheck instanceof Function&&J.attributeNameCheck(A,u))||A==="is"&&J.allowCustomizedBuiltInElements&&(J.tagNameCheck instanceof RegExp&&Pe(J.tagNameCheck,F)||J.tagNameCheck instanceof Function&&J.tagNameCheck(F))))return!1}else if(!qt[A]){if(!Pe(q,on(F,re,""))){if(!((A==="src"||A==="xlink:href"||A==="href")&&u!=="script"&&mr(F,"data:")===0&&Wt[u])){if(!(mt&&!Pe(K,on(F,re,"")))){if(F)return!1}}}}}}}return!0},wn=function(u){return u!=="annotation-xml"&&so(u,we)},kn=function(u){nt(x.beforeSanitizeAttributes,u,null);const{attributes:A}=u;if(!A||me(u))return;const F={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:Z,forceKeepAttr:void 0};let ye=A.length;for(;ye--;){const Ie=A[ye],{name:ke,namespaceURI:Be,value:ot}=Ie,it=Ee(ke),Et=ot;let $e=ke==="value"?Et:hr(Et);if(F.attrName=it,F.attrValue=$e,F.keepAttr=!0,F.forceKeepAttr=void 0,nt(x.uponSanitizeAttribute,u,F),$e=F.attrValue,Ft&&(it==="id"||it==="name")&&(Ue(ke,u),$e=un+$e),ut&&Pe(/((--!?|])>)|<\/(style|title|textarea)/i,$e)){Ue(ke,u);continue}if(it==="attributename"&&so($e,"href")){Ue(ke,u);continue}if(F.forceKeepAttr)continue;if(!F.keepAttr){Ue(ke,u);continue}if(!vt&&Pe(/\/>/i,$e)){Ue(ke,u);continue}et&&On([y,$,_],En=>{$e=on($e,En," ")});const Bt=Ee(u.nodeName);if(!xn(Bt,it,$e)){Ue(ke,u);continue}if(ee&&typeof G=="object"&&typeof G.getAttributeType=="function"&&!Be)switch(G.getAttributeType(Bt,it)){case"TrustedHTML":{$e=ee.createHTML($e);break}case"TrustedScriptURL":{$e=ee.createScriptURL($e);break}}if($e!==Et)try{Be?u.setAttributeNS(Be,ke,$e):u.setAttribute(ke,$e),me(u)?Re(u):di(t.removed)}catch{Ue(ke,u)}}nt(x.afterSanitizeAttributes,u,null)},Ln=function V(u){let A=null;const F=Gt(u);for(nt(x.beforeSanitizeShadowDOM,u,null);A=F.nextNode();)nt(x.uponSanitizeShadowNode,A,null),vn(A),kn(A),A.content instanceof c&&V(A.content);nt(x.afterSanitizeShadowDOM,u,null)};return t.sanitize=function(V){let u=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},A=null,F=null,ye=null,Ie=null;if(_t=!V,_t&&(V="<!-->"),typeof V!="string"&&!yn(V))if(typeof V.toString=="function"){if(V=V.toString(),typeof V!="string")throw sn("dirty is not a string, aborting")}else throw sn("toString is not a function");if(!t.isSupported)return V;if(ge||jt(u),t.removed=[],typeof V=="string"&&(wt=!1),wt){if(V.nodeName){const ot=Ee(V.nodeName);if(!ne[ot]||ct[ot])throw sn("root node is forbidden and cannot be sanitized in-place")}}else if(V instanceof p)A=bn("<!---->"),F=A.ownerDocument.importNode(V,!0),F.nodeType===an.element&&F.nodeName==="BODY"||F.nodeName==="HTML"?A=F:A.appendChild(F);else{if(!Me&&!et&&!Y&&V.indexOf("<")===-1)return ee&&ue?ee.createHTML(V):V;if(A=bn(V),!A)return Me?null:ue?ve:""}A&&fe&&Re(A.firstChild);const ke=Gt(wt?V:A);for(;ye=ke.nextNode();)vn(ye),kn(ye),ye.content instanceof c&&Ln(ye.content);if(wt)return V;if(Me){if(Te)for(Ie=S.call(A.ownerDocument);A.firstChild;)Ie.appendChild(A.firstChild);else Ie=A;return(Z.shadowroot||Z.shadowrootmode)&&(Ie=C.call(r,Ie,!0)),Ie}let Be=Y?A.outerHTML:A.innerHTML;return Y&&ne["!doctype"]&&A.ownerDocument&&A.ownerDocument.doctype&&A.ownerDocument.doctype.name&&Pe($i,A.ownerDocument.doctype.name)&&(Be="<!DOCTYPE "+A.ownerDocument.doctype.name+`>
`+Be),et&&On([y,$,_],ot=>{Be=on(Be,ot," ")}),ee&&ue?ee.createHTML(Be):Be},t.setConfig=function(){let V=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};jt(V),ge=!0},t.clearConfig=function(){bt=null,ge=!1},t.isValidAttribute=function(V,u,A){bt||jt({});const F=Ee(V),ye=Ee(u);return xn(F,ye,A)},t.addHook=function(V,u){typeof u=="function"&&nn(x[V],u)},t.removeHook=function(V,u){if(u!==void 0){const A=pr(x[V],u);return A===-1?void 0:gr(x[V],A,1)[0]}return di(x[V])},t.removeHooks=function(V){x[V]=[]},t.removeAllHooks=function(){x=fi()},t}var zn=_i();function $r(w,t,o){let r=!1,l="docked";const c=()=>{if(!r)return;const S=w.getModel(),C=S.getValue().split(`
`),x=[],y=new Set,$=q=>{const ne=[];let H="",Z=!1;for(let ze=0;ze<q.length;ze++){const J=q[ze];J==="`"?(Z=!Z,H+=J):J==="|"&&!Z?(ne.push(H),H=""):H+=J}return ne.push(H),ne.filter(ze=>ze.trim())};let _=!1,B=[],j=null,K=null,re=!1,we=0;if(C.forEach((q,ne)=>{const H=ne+1,Z=q.trim();if(Z.startsWith("```")&&(_?(B.pop(),_=!1):(B.push(H),_=!0)),_&&!Z.startsWith("```"))return;const ze=/^(\*{3,}|-{3,}|_{3,})$/.test(Z);if(Z.match(/^[\*\-_]{3,}$/)){const Y=Z[0];Z.split("").every(fe=>fe===Y||fe===" ")||x.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:q.length+1,message:"Horizontal rule format: Use consistent characters (e.g., ---, ***, or ___)",source:"markdown-validator"})}if(ne>0){const Y=C[ne-1].trim();/^#{1,6}\s/.test(Y)&&Z&&!Z.startsWith("#")&&!ze&&x.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:1,message:"Missing blank line after heading: Add blank line for better readability",source:"markdown-validator"})}if(ne>0&&Z.includes("|")){const Y=C[ne-1].trim(),ge=/^(\d+\.|\*|\+|-)\s/.test(Y),fe=/^\|.*\|/.test(Z);ge&&fe&&x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:1,message:"List-table conflict: Add blank line between list and table",source:"markdown-validator"})}const J=q.match(/^(#{1,6})([^\s#])/);J&&(x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:J[1].length+2,message:'Header missing space: Add space after # (e.g., "# Heading")',source:"markdown-validator"}),y.add(H)),q.match(/^#{7,}/)&&(x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:q.length+1,message:"Invalid header: Markdown only supports h1-h6 (use # to ######)",source:"markdown-validator"}),y.add(H));const ct=/!\[([^\]]*)\]\(([^)]*)\)/g;if(/!\[.*\([^)]*$/.test(q)&&!ct.test(q))x.push({severity:t.MarkerSeverity.Error,startLineNumber:H,startColumn:q.indexOf("![")+1,endLineNumber:H,endColumn:q.length+1,message:"Broken image syntax: Missing closing bracket ] or parenthesis )",source:"markdown-validator"}),y.add(H);else{const Y=q.match(/!\[([^\]]*)\]\(\s*\)/);if(Y){const fe=q.indexOf(Y[0])+1;x.push({severity:t.MarkerSeverity.Error,startLineNumber:H,startColumn:fe,endLineNumber:H,endColumn:fe+Y[0].length,message:"Empty image URL: Add image source (e.g., ![Alt](image.png))",source:"markdown-validator"}),y.add(H)}const ge=q.match(/!\[\]\(([^)]+)\)/);if(ge&&!y.has(H)){const fe=q.indexOf(ge[0])+1;x.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:fe,endLineNumber:H,endColumn:fe+ge[0].length,message:"Empty alt text: Add description for accessibility (e.g., ![Logo](url))",source:"markdown-validator"})}}const He=/\[([^\]]+)\]\(([^)]+)\)/g;if(/\[[^\]]*\([^)]*$/.test(q)&&!He.test(q)&&!y.has(H)){const Y=q.lastIndexOf("[");q.indexOf("(",Y)>-1&&(x.push({severity:t.MarkerSeverity.Error,startLineNumber:H,startColumn:Y+1,endLineNumber:H,endColumn:q.length+1,message:"Broken link syntax: Missing closing bracket ] or parenthesis )",source:"markdown-validator"}),y.add(H))}const dt=q.match(/\[\]\(\s*\)/);if(dt&&!y.has(H)){const Y=q.indexOf(dt[0])+1;x.push({severity:t.MarkerSeverity.Error,startLineNumber:H,startColumn:Y,endLineNumber:H,endColumn:Y+dt[0].length,message:"Empty link: Add text and URL (e.g., [Click here](url))",source:"markdown-validator"})}if(!ze){const Y=q.match(/\*\*/g);if(Y&&Y.length%2!==0){const ge=q.lastIndexOf("**");x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:ge+1,endLineNumber:H,endColumn:q.length+1,message:"Unclosed bold: Add closing ** (e.g., **bold text**)",source:"markdown-validator"})}}if(!ze){const Y=(q.match(/\*/g)||[]).length,ge=(q.match(/\*\*/g)||[]).length,fe=Y-ge*2;if(fe%2!==0&&fe>0){let Me=-1;for(let Te=q.length-1;Te>=0;Te--)if(q[Te]==="*"&&!(Te>0&&q[Te-1]==="*"||Te<q.length-1&&q[Te+1]==="*")){Me=Te;break}Me!==-1&&x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:Me+1,endLineNumber:H,endColumn:q.length+1,message:"Unclosed italic: Add closing * (e.g., *italic text*)",source:"markdown-validator"})}}const mt=q.match(new RegExp("(?<!`)`(?!`)","g"));if(mt&&mt.length%2!==0){const Y=q.lastIndexOf("`");q[Y+1]!=="`"&&q[Y-1]!=="`"&&x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:Y+1,endLineNumber:H,endColumn:q.length+1,message:"Unclosed inline code: Add closing ` (e.g., `code`)",source:"markdown-validator"})}const vt=q.match(/^(>+)([^\s>])/);vt&&x.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:vt[1].length+2,message:'Blockquote missing space: Add space after > (e.g., "> Quote")',source:"markdown-validator"});const et=Z.match(/^([-+*])\s/);if(et){const Y=et[1];Y!=="-"&&(j||j===null)&&x.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:3,message:"Mixed list markers: Use consistent marker (-)",source:"markdown-validator"}),j=Y,K=null}else if(Z.match(/^\d+\.\s/)){const Y=Z.match(/^(\d+)\.\s/);if(Y){const ge=parseInt(Y[1]);K!==null&&ge!==K+1&&ge!==1&&x.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:Y[0].length,message:`List numbering skip: Expected ${K+1}, got ${ge}`,source:"markdown-validator"}),K=ge,j=null}}else Z&&!Z.startsWith(">")&&!Z.startsWith("#")&&(j=null,K=null);if(Z.includes("|")){const Y=$(Z);if(/^[\s:-]+$/.test(Y.join(""))){/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/.test(Z)||x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:q.length+1,message:"Malformed table separator: Use format | --- | --- | with spaces",source:"markdown-validator"});const Me=ne>0?C[ne-1].trim():"";if(!Me.includes("|"))x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:q.length+1,message:"Table separator without header: Add header row above",source:"markdown-validator"});else{const Te=$(Me).length,ue=Y.length;ue!==Te&&x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:q.length+1,message:`Table separator column mismatch: Expected ${Te} columns, got ${ue}`,source:"markdown-validator"}),we=Te,re=!0}}else if(re&&we>0){const fe=ne<C.length-1?C[ne+1].trim():"";fe&&/^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/.test(fe)?(re=!1,we=0):Y.length!==we&&x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:q.length+1,message:`Table column mismatch: Expected ${we} columns, got ${Y.length}`,source:"markdown-validator"})}}else re&&Z&&(re=!1,we=0);const ut=q.match(/<(\w+)(?:\s[^>]*)?>(?!.*<\/\1>)/g);ut&&ut.forEach(Y=>{const ge=Y.match(/<(\w+)/)[1];if(!["img","br","hr","input","meta","link"].includes(ge.toLowerCase())){const fe=q.indexOf(Y);x.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:fe+1,endLineNumber:H,endColumn:fe+Y.length+1,message:`Unclosed HTML tag: <${ge}> (add </${ge}>)`,source:"markdown-validator"})}})}),B.length>0){const q=B[B.length-1];x.push({severity:t.MarkerSeverity.Error,startLineNumber:q,startColumn:1,endLineNumber:q,endColumn:C[q-1].length+1,message:"Unclosed code block: Add closing ``` on a new line",source:"markdown-validator"})}t.editor.setModelMarkers(S,"markdown-validator",x)};let d;w.onDidChangeModelContent(()=>{r&&(clearTimeout(d),d=setTimeout(c,500))}),w._validateMarkdown=c,w._setValidationEnabled=S=>{r=S,S?c():t.editor.setModelMarkers(w.getModel(),"markdown-validator",[])};let p=null,L=0,b=[],E=[];const M=()=>{const S=document.createElement("div");return S.className="vw-wizard-container wizard-docked",S.innerHTML=`
                <div class="vw-state-indicator vw-state-error"></div>
                <span class="vw-counter-badge"></span>
                <div class="vw-divider"></div>
                <button class="vw-btn-icon vw-btn-mode" title="Toggle Docked/Inline Mode">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8h12M8 2v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <div class="vw-divider"></div>
                <div class="vw-issue-content"></div>
                <div class="vw-divider"></div>
                <button class="vw-btn-icon vw-btn-apply" title="Apply Fix">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="vw-btn-icon vw-btn-apply-all" title="Apply All">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M13 3L6 10L3 7M13 7L6 14L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="vw-btn-icon vw-btn-skip" title="Skip">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="vw-btn-icon vw-btn-close" title="Close">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <div class="vw-divider"></div>
                <button class="vw-nav-btn vw-btn-prev" title="Previous">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="vw-nav-btn vw-btn-next" title="Next">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `,document.body.appendChild(S),S},U=(S,I)=>{let C=null,x="";if(console.log("[generateFix] Message:",S.message),console.log("[generateFix] Line:",I),S.message.includes("Header missing space")){const y=I.match(/^(#{1,6})([^\s#].+)/);y&&(C=y[1]+" "+y[2],x="Add space after #",console.log("[generateFix] Header fix:",C))}else if(S.message.includes("Invalid header")){const y=I.match(/^(#{7,})(.+)/);y&&(C="###### "+y[2].trim(),x="Convert to h6 (maximum level)")}else if(S.message.includes("Blockquote missing space")){const y=I.match(/^(>+)([^\s>].+)/);y&&(C=y[1]+" "+y[2],x="Add space after >")}else if(S.message.includes("Mixed list markers")){const y=I.match(/^(\s*)([+*-])(\s*.+)/);if(y){const $=y[1],_=y[3].trimStart();C=$+"- "+_,x="Standardize to - marker"}}else if(S.message.includes("Table column mismatch")){const y=S.message.match(/Expected (\d+) columns, got (\d+)/);if(y){const $=parseInt(y[1]),_=parseInt(y[2]);if(_<$){const B=$-_,j=I.trimEnd().replace(/\|$/,"").trimEnd(),K=" | "+Array(B).fill('<span style="color:red">COL_FIX!</span>').join(" | ");C=j+K+" |",x=`Add ${B} missing column(s)`}else{const B=I.split("|"),j=I.trimStart().startsWith("|"),K=I.trimEnd().endsWith("|");let re=B.map(we=>we.trim()).filter(we=>we!=="");re=re.slice(0,$),j&&K?C="| "+re.join(" | ")+" |":j?C="| "+re.join(" | "):K?C=re.join(" | ")+" |":C=re.join(" | "),x=`Remove ${_-$} extra column(s)`}}}else if(S.message.includes("Horizontal rule format"))C="---",x="Standardize to ---";else if(S.message.includes("Malformed table separator")){const y=S.startLineNumber,$=w.getModel(),_=y>1?$.getLineContent(y-1).trim():"";if(_.includes("|")){const B=_.split("|").filter(j=>j.trim()).length;C="| "+Array(B).fill("---").join(" | ")+" |",x=`Fix separator to match ${B} columns`}else{const B=(I.match(/\|/g)||[]).length,j=Math.max(3,B-1);C="| "+Array(j).fill("---").join(" | ")+" |",x="Fix table separator format"}}else if(S.message.includes("Table separator column mismatch")){const y=S.message.match(/Expected (\d+) columns/);if(y){const $=parseInt(y[1]);C="| "+Array($).fill("---").join(" | ")+" |",x=`Update separator to match ${$} columns`}}else if(S.message.includes("Empty alt text"))C=I.replace(/!\[\]/,"![Image description]"),x="Add placeholder alt text";else if(S.message.includes("Unclosed HTML tag")){const y=S.message.match(/Unclosed HTML tag: <(\w+)>/);if(y){const $=y[1];C=I+`</${$}>`,x=`Add closing </${$}>`}}else if(S.message.includes("List numbering skip")){const y=S.message.match(/Expected (\d+)/);if(y){const $=y[1];C=I.replace(/^(\s*)\d+\./,`$1${$}.`),x=`Change to ${$}.`}}else if(S.message.includes("Unclosed inline code")){const y=I.trimEnd();y.match(/\[.*`[^\]]*\]/)?C=y.replace(/\]/,"`]"):y.endsWith("|")?C=y.replace(/\s*\|$/,"`|"):C=I+"`",x="Add closing backtick"}else if(S.message.includes("Unclosed bold")){const y=I.trimEnd(),$=I.lastIndexOf("**");let _=y.length;const B=y.match(/\s+\|/);if(B){const j=y.indexOf(B[0]);j>$&&(_=j)}C=y.substring(0,_)+"**"+y.substring(_),x="Add closing **"}else if(S.message.includes("Unclosed italic")){const y=I.trimEnd();let $=-1;for(let _=y.length-1;_>=0;_--)if(y[_]==="*"&&!(_>0&&y[_-1]==="*"||_<y.length-1&&y[_+1]==="*")){$=_;break}if($!==-1){let _=y.length;const B=y.match(/\s+\|/);if(B){const j=y.indexOf(B[0]);j>$&&(_=j)}C=y.substring(0,_)+"*"+y.substring(_),x="Add closing *"}}else if(S.message.includes("Missing blank line after heading"))C="__INSERT_BLANK_LINE__",x="Insert blank line above";else if(S.message.includes("List-table conflict"))C="__INSERT_BLANK_LINE__",x="Insert blank line above";else if(S.message.includes("Unclosed code block"))C=I+"\n```",x="Add closing ``` on new line";else if(S.message.includes("Broken image syntax")){console.log("[generateFix] Broken image - testing regex");let y=/!\[([^\]]*)\]\s*\(.*$/,$=I.match(y);if($||(y=/!\[([^\(]*)\(.*$/,$=I.match(y)),console.log("[generateFix] Broken image match:",$),$){const _=$[1].trim();C=I.replace(y,`![${_}](IMAGE_URL_FIX!)`),x="Add missing brackets/parenthesis and placeholder URL",console.log("[generateFix] Broken image fix:",C)}}else if(S.message.includes("Broken link syntax")){console.log("[generateFix] Broken link - Line:",I),console.log("[generateFix] Marker startColumn:",S.startColumn);const y=I.lastIndexOf("[");if(y!==-1){const $=I.substring(0,y),_=I.substring(y);console.log("[generateFix] Before broken link:",$),console.log("[generateFix] Broken link part:",_);let B=_.match(/^\[([^\]]+)\]\s*\(/);if(B){const j=B[1].trim();C=$+`[${j}](URL_FIX!)`,x="Add missing closing parenthesis and placeholder URL",console.log("[generateFix] Pattern 1 - Fix:",C)}else if(B=_.match(/^\[([^\[\(]+)\(/),B){const j=B[1].trim();C=$+`[${j}](URL_FIX!)`,x="Add missing bracket and parenthesis with placeholder URL",console.log("[generateFix] Pattern 2 - Fix:",C)}else if(B=_.match(/^\[([^\]]+)$/),B){const j=B[1].trim();C=$+`[${j}](URL_FIX!)`,x="Complete link with closing bracket, parenthesis and URL",console.log("[generateFix] Pattern 3 - Fix:",C)}}}else S.message.includes("Empty image URL")?(C=I.replace(/!\[([^\]]*)\]\(\s*\)/,"![$1](image.png)"),x="Add placeholder image URL"):S.message.includes("Empty link")&&(I.includes("[]()")?(C=I.replace(/\[\]\(\s*\)/,"[Link text](url)"),x="Add link text and URL"):(C=I.replace(/\[([^\]]+)\]\(\s*\)/,"[$1](url)"),x="Add URL"));return{suggestedFix:C,fixDescription:x}},G=(S,I)=>{const C=w.getModel();let x=C.getLineContent(S),y=[];console.log("[applyMultiple] Line",S,"- Markers:",I.length),console.log("[applyMultiple] BEFORE:",x);const $=["Header missing space","Invalid header","Blockquote missing space","Mixed list markers","Broken image syntax","Broken link syntax","Empty image URL","Empty link","Empty alt text","Unclosed bold","Unclosed italic","Unclosed inline code"],_=I.sort((K,re)=>{const we=$.findIndex(ne=>K.message.includes(ne)),q=$.findIndex(ne=>re.message.includes(ne));return(we===-1?999:we)-(q===-1?999:q)});console.log("[applyMultiple] Sorted markers:",_.map(K=>K.message));const B=_.filter(K=>K.message.includes("Missing blank line after heading")||K.message.includes("List-table conflict")),j=_.filter(K=>!K.message.includes("Missing blank line after heading")&&!K.message.includes("List-table conflict"));for(const K of j){const{suggestedFix:re,fixDescription:we}=U(K,x);re&&re!=="__INSERT_BLANK_LINE__"&&(console.log("[applyMultiple] Applying:",we),console.log("[applyMultiple] From:",x),console.log("[applyMultiple] To:",re),x=re,y.push(we))}if(console.log("[applyMultiple] AFTER:",x),x!==C.getLineContent(S)){const K=new t.Range(S,1,S,C.getLineContent(S).length+1);w.executeEdits("validation-fix-multiple",[{range:K,text:x}])}return B.length>0&&(le(S),y.push("Insert blank line above")),{fixed:y.length>0,description:y.join(", ")}},le=S=>{console.log(`[insertBlankLineAbove] Called for line ${S}`);const I=w.getModel();if(S>1){const y=I.getLineContent(S-1);if(console.log(`[insertBlankLineAbove] Previous line (${S-1}): "${y}"`),y.trim()===""){console.log("[insertBlankLineAbove] Previous line is blank, skipping");return}}console.log(`[insertBlankLineAbove] Inserting blank line before line ${S}`);const C=new t.Range(S,1,S,1),x=I.getLineContent(S);console.log(`[insertBlankLineAbove] Current line content: "${x}"`),console.log(`[insertBlankLineAbove] Range: (${S}, 1, ${S}, 1)`),w.executeEdits("insert-blank-line",[{range:C,text:`
`}]),setTimeout(()=>{const y=I.getLineContent(S),$=I.getLineContent(S+1);console.log(`[insertBlankLineAbove] After edit - Line ${S}: "${y}"`),console.log(`[insertBlankLineAbove] After edit - Line ${S+1}: "${$}"`)},100)},ie=S=>{if(!p||l!=="inline")return;const I=w.getTopForLineNumber(S),C=w.getOption(t.editor.EditorOption.lineHeight),x=w.getScrollTop(),$=w.getDomNode().getBoundingClientRect(),_=$.top+(I-x)+C,B=$.left+10,j=$.width-20;p.style.top=`${_}px`,p.style.left=`${B}px`,p.style.maxWidth=`${j}px`},Le=()=>{l=l==="docked"?"inline":"docked",Q()},Q=()=>{p&&(l==="docked"?(p.className="vw-wizard-container wizard-docked",p.style.top="",p.style.left="",p.style.maxWidth="",p.parentElement!==document.body&&document.body.appendChild(p)):(p.className="vw-wizard-container wizard-inline",b[L]&&ie(b[L].marker.startLineNumber)))},X=(S,I)=>{const C={error:"rgba(239, 68, 68, 0.2)",fixed:"rgba(34, 197, 94, 0.2)",skipped:"rgba(59, 130, 246, 0.2)"},x={range:new t.Range(S,1,S,1),options:{isWholeLine:!0,className:`validation-line-${I}`,glyphMarginClassName:`validation-glyph-${I}`,overviewRuler:{color:C[I],position:t.editor.OverviewRulerLane.Left},minimap:{color:C[I],position:t.editor.MinimapPosition.Inline}}};E=w.deltaDecorations(E,[x])},se=S=>{if(S<0||S>=b.length)return;L=S;const I=b[S];w.getModel(),w.revealLineInCenter(I.marker.startLineNumber),w.setPosition({lineNumber:I.marker.startLineNumber,column:I.marker.startColumn}),I.state==="pending"&&X(I.marker.startLineNumber,"error");const C=p.querySelector(".vw-state-indicator"),x=p.querySelector(".vw-counter-badge"),y=p.querySelector(".vw-issue-content"),$=p.querySelector(".vw-btn-apply"),_=p.querySelector(".vw-btn-apply-all"),B=p.querySelector(".vw-btn-prev"),j=p.querySelector(".vw-btn-next");if(x.textContent=`${S+1}/${b.length}`,I.state==="fixed")C.className="vw-state-indicator vw-state-fixed",y.innerHTML=`<strong>Fixed:</strong> ${I.marker.message}`,$.disabled=!0,$.style.opacity="0.3";else if(I.state==="skipped")C.className="vw-state-indicator vw-state-error",y.innerHTML=`<strong>Skipped:</strong> ${I.marker.message}`,$.disabled=!0,$.style.opacity="0.3";else if(C.className="vw-state-indicator vw-state-error",I.suggestedFix){const re=I.suggestedFix.length>50?I.suggestedFix.substring(0,50)+"...":I.suggestedFix;y.innerHTML=`${I.marker.message} → <code>${re}</code>`,$.disabled=!1,$.style.opacity="1"}else y.innerHTML=`${I.marker.message} <em>(no auto-fix)</em>`,$.disabled=!0,$.style.opacity="0.3";S===0?(B.classList.add("disabled"),B.disabled=!0):(B.classList.remove("disabled"),B.disabled=!1),S===b.length-1?(j.classList.add("disabled"),j.disabled=!0):(j.classList.remove("disabled"),j.disabled=!1);const K=b.some(re=>re.state==="pending"&&re.suggestedFix);_.disabled=!K,_.style.opacity=K?"1":"0.3",l==="inline"&&ie(I.marker.startLineNumber)},ee=()=>{const S=b[L];if(!S||!S.suggestedFix||S.state!=="pending")return;const I=w.getModel(),C=S.marker.startLineNumber,x=I.getLineContent(C);if(S.suggestedFix==="__INSERT_BLANK_LINE__")console.log("[applyCurrentFix] Blank line insertion detected for line",C),le(C);else{const $=new t.Range(C,1,C,x.length+1);w.executeEdits("validation-fix",[{range:$,text:S.suggestedFix}])}S.state="fixed",X(C,"fixed");const y=b.findIndex(($,_)=>_>L&&$.state==="pending");if(y!==-1)console.log("[applyCurrentFix] Moving to next pending issue at index:",y),se(y);else if(b.every(_=>_.state!=="pending")){const _=b.filter(K=>K.state==="fixed").length,B=b.filter(K=>K.state==="skipped").length;v();let j=`Validation complete! Fixed ${_} issue${_!==1?"s":""}`;B>0&&(j+=`, skipped ${B}`),j+=" Ô£ö",o(j)}else se(L)},ve=()=>{w.getModel();let S=0,I=0;const C=10,x=()=>{I++,console.log("[applyAll] ========== ITERATION",I,"==========");const y=new Map;if(b.forEach((_,B)=>{if(_.state==="pending"&&_.suggestedFix){const j=_.marker.startLineNumber;y.has(j)||y.set(j,[]),y.get(j).push({issue:_,index:B})}}),console.log("[applyAll] Issues by line:",y.size),console.log("[applyAll] Line numbers:",Array.from(y.keys())),y.size===0){v(),S>0?(console.log("[applyAll] Ô£ô COMPLETE - Fixed",S,"issues"),o(`Excellent! All ${S} fixes applied Ô£ö`)):o("No issues found to fix!");return}const $=Array.from(y.keys()).sort((_,B)=>B-_);console.log("[applyAll] Processing lines (bottom to top):",$),$.forEach(_=>{const B=y.get(_),j=B.map(re=>re.issue.marker);console.log("[applyAll] Processing line",_),G(_,j).fixed?(B.forEach(({issue:re})=>{re.state="fixed"}),X(_,"fixed"),S+=B.length,console.log("[applyAll] Ô£ô Fixed line",_,"-",B.length,"issues")):console.log("[applyAll] Ô£ù Failed to fix line",_)}),console.log("[applyAll] Total fixed so far:",S),I<C?setTimeout(()=>{console.log("[applyAll] Re-validating..."),b=[],c();const _=b.filter(B=>B.state==="pending"&&B.suggestedFix);console.log("[applyAll] New pending issues:",_.length),_.length>0?(console.log("[applyAll] Continuing to next iteration..."),x()):(v(),console.log("[applyAll] Ô£ô ALL DONE - Fixed",S,"issues total"),o(`Excellent! All ${S} fixes applied Ô£ö`))},150):(v(),console.log("[applyAll] ÔÜá Max iterations reached"),o(`Applied ${S} fixes! Some issues may remain.`))};x()},Se=()=>{const S=b[L];if(!S||S.state!=="pending")return;S.state="skipped",X(S.marker.startLineNumber,"skipped");const I=b.findIndex((C,x)=>x>L&&C.state==="pending");I!==-1?se(I):b.every(x=>x.state!=="pending")?(v(),o("Wizard complete! Review the highlighted changes.")):se(L)},v=()=>{p&&(p.classList.add("hiding"),setTimeout(()=>{p&&(p.remove(),p=null)},200)),l="docked",setTimeout(()=>{E=w.deltaDecorations(E,[])},5e3),b=[],L=0};w._interactiveFixWizard=async()=>{const S=w.getModel(),C=t.editor.getModelMarkers({resource:S.uri}).filter(x=>x.source==="markdown-validator");if(C.length===0){o("No validation issues found!");return}v(),b=C.map(x=>{const y=S.getLineContent(x.startLineNumber),{suggestedFix:$,fixDescription:_}=U(x,y);return{marker:x,suggestedFix:$,fixDescription:_,state:"pending"}}),l="docked",p=M(),p.querySelector(".vw-btn-mode").addEventListener("click",Le),p.querySelector(".vw-btn-apply").addEventListener("click",ee),p.querySelector(".vw-btn-apply-all").addEventListener("click",ve),p.querySelector(".vw-btn-skip").addEventListener("click",Se),p.querySelector(".vw-btn-close").addEventListener("click",v),p.querySelector(".vw-btn-prev").addEventListener("click",()=>{L>0&&se(L-1)}),p.querySelector(".vw-btn-next").addEventListener("click",()=>{L<b.length-1&&se(L+1)}),w.onDidScrollChange(()=>{p&&b[L]&&l==="inline"&&ie(b[L].marker.startLineNumber)}),se(0)},w._exportValidationErrors=()=>{const S=w.getModel(),C=t.editor.getModelMarkers({resource:S.uri}).filter(B=>B.source==="markdown-validator");if(C.length===0)return"No validation errors found.";let x=`# Markdown Validation Report

`;x+=`Total Issues: ${C.length}

`;const y=C.filter(B=>B.severity===t.MarkerSeverity.Error),$=C.filter(B=>B.severity===t.MarkerSeverity.Warning),_=C.filter(B=>B.severity===t.MarkerSeverity.Info);return y.length>0&&(x+=`## Errors (${y.length})

`,y.forEach((B,j)=>{const K=S.getLineContent(B.startLineNumber);x+=`${j+1}. **Line ${B.startLineNumber}**: ${B.message}
`,x+=`   \`\`\`
   ${K}
   \`\`\`

`})),$.length>0&&(x+=`## Warnings (${$.length})

`,$.forEach((B,j)=>{const K=S.getLineContent(B.startLineNumber);x+=`${j+1}. **Line ${B.startLineNumber}**: ${B.message}
`,x+=`   \`\`\`
   ${K}
   \`\`\`

`})),_.length>0&&(x+=`## Info (${_.length})

`,_.forEach((B,j)=>{const K=S.getLineContent(B.startLineNumber);x+=`${j+1}. **Line ${B.startLineNumber}**: ${B.message}
`,x+=`   \`\`\`
   ${K}
   \`\`\`

`})),x},w.addCommand(t.KeyMod.CtrlCmd|t.KeyMod.Shift|t.KeyCode.KeyV,()=>{if(!r){console.log("Validation not enabled");return}const S=w._exportValidationErrors();navigator.clipboard.writeText(S).then(()=>{console.log("Validation report copied to clipboard")}).catch(I=>{console.error("Failed to copy validation report:",I)})})}const _r=()=>{let w=!1,t=!1,o=!1,r="web",l=100,c={width:21,height:29.7,marginTop:4.5,marginBottom:2.54,marginLeft:2.54,marginRight:1.47},d=null,p=[],L=-1;const b=50;let E=!1;const M="com.markdownlivepreview",U="last_state",G="scroll_bar_settings",le="cursor_sync_settings",ie="theme_settings",Le="style_settings",Q="flip_panels_settings",X="vertical_layout_settings",se="pdf_font_settings",ee="helper_messages_settings",ve="toc_settings",Se="validation_settings";let v;const S=()=>{if(!v)return;const e=v.getValue(),n=e.split(`
`),s=e.trim()?e.trim().split(/\s+/).length:0;document.getElementById("status-word-count").textContent=s,document.getElementById("status-char-count").textContent=e.length,document.getElementById("status-line-count").textContent=n.length;const i=Math.ceil(s/200);document.getElementById("status-reading-time").textContent=i+" min";const a=Math.max(1,Math.ceil(s/500));document.getElementById("status-pdf-pages").textContent="~"+a},I=e=>{L<p.length-1&&(p=p.slice(0,L+1)),p.push(e),p.length>b?p.shift():L++},C=()=>{if(L>0){E=!0,L--;const e=p[L],s=v.getModel().getFullModelRange();return v.executeEdits("undo-operation",[{range:s,text:e}]),E=!1,me(`Undo successful! (${L+1}/${p.length} states)`),!0}else return me("Nothing to undo!"),!1},x=()=>{if(L<p.length-1){E=!0,L++;const e=p[L],s=v.getModel().getFullModelRange();return v.executeEdits("redo-operation",[{range:s,text:e}]),E=!1,me(`Redo successful! (${L+1}/${p.length} states)`),!0}else return me("Nothing to redo!"),!1};let y={h1:10,h2:10,h3:10,h4:10,paragraph:8,list:8,blockquote:8,code:8,table:8,fontFamily:"helvetica",tableBorders:"horizontal",tableBorderWeight:.15,tableBorderColor:"#d0d0d0",tableHeaderBg:"#fafafa",tableHeaderColor:"#000000"};const $=`# Markdown syntax guide

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b
    * Item 3a
    * Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Images

![This is an alt text.](/image/Markdown-mark.svg "This is a sample image.")

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

\`\`\`
let message = 'Hello world';
alert(message);
\`\`\`

## Inline code

This web site is using \`markedjs/marked\`.
`;self.MonacoEnvironment={getWorker(e,n){return new Proxy({},{get:()=>()=>{}})}},te.editor.defineTheme("custom-light",{base:"vs",inherit:!0,rules:[],colors:{"editor.background":"#f7f7f7","editor.selectionBackground":"#add6ff","editor.lineHighlightBackground":"#f7f7f7"}}),te.editor.defineTheme("custom-dark",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":"#1A1A1A","editor.selectionBackground":"#add6ff","editor.lineHighlightBackground":"#1A1A1A"}});let _=()=>(v=te.editor.create(document.querySelector("#editor"),{fontSize:14,language:"markdown",minimap:{enabled:!1},scrollBeyondLastLine:!1,automaticLayout:!0,scrollbar:{vertical:"visible",horizontal:"visible",verticalScrollbarSize:10,horizontalScrollbarSize:10,useShadows:!1},wordWrap:"on",hover:{enabled:!0},quickSuggestions:{other:!0,comments:!1,strings:!1},suggestOnTriggerCharacters:!0,acceptSuggestionOnCommitCharacter:!1,acceptSuggestionOnEnter:"on",tabCompletion:"on",wordBasedSuggestions:"off",folding:!0,showFoldingControls:"always",foldingStrategy:"auto",foldingHighlight:!0}),te.languages.registerCompletionItemProvider("markdown",{triggerCharacters:["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],provideCompletionItems:(e,n,s,i)=>new Promise((a,m)=>{setTimeout(()=>{const g=e.getValueInRange({startLineNumber:n.lineNumber,startColumn:1,endLineNumber:n.lineNumber,endColumn:n.column}).match(/\b(\w{2,})$/);if(!g){a({suggestions:[]});return}const k=g[1],T=e.getValue().match(/\b\w{3,}\b/g)||[],R=[...new Set(T)].filter(D=>D.toLowerCase().startsWith(k.toLowerCase())&&D.toLowerCase()!==k.toLowerCase()).slice(0,5);if(R.length===0){a({suggestions:[]});return}const N=R.map((D,z)=>({label:D,kind:te.languages.CompletionItemKind.Text,insertText:D,range:{startLineNumber:n.lineNumber,startColumn:n.column-k.length,endLineNumber:n.lineNumber,endColumn:n.column}}));a({suggestions:N})},50)})}),v.onDidChangeModelContent(()=>{v.getValue()!=$;let e=v.getValue();re(e),Hi(e),it&&To(),S()}),$r(v,te,me),B(v,te),v),B=(e,n)=>{n.languages.registerFoldingRangeProvider("markdown",{provideFoldingRanges:function(a,m,h){const g=[],k=a.getLineCount();for(let f=1;f<=k;f++){const P=a.getLineContent(f).trim();if(P==="<div>"||P.startsWith("<div>")&&P.endsWith(" >")){let R=f;for(let N=f+1;N<=k;N++)if(a.getLineContent(N).trim()==="</div>"){R=N;break}R>f&&g.push({start:f,end:R,kind:n.languages.FoldingRangeKind.Region})}}return g}});let s=()=>{const a=e.getModel();if(!a)return;const m=a.getLineCount(),h=[];for(let g=1;g<=m;g++)if(a.getLineContent(g).trim()==="<div>"&&g+1<=m){const f=a.getLineContent(g+1);(f.includes("data:image/")||f.includes("data:video/"))&&f.includes("base64,")&&h.push(g)}h.forEach(g=>{e.trigger("fold","editor.fold",{lineNumber:g})})};setTimeout(s,500);let i;e.onDidChangeModelContent(()=>{clearTimeout(i),i=setTimeout(s,1e3)})},j=e=>{const n=/^---\s*\n([\s\S]*?)\n---\s*\n/,s=e.match(n);if(!s)return{metadata:null,content:e};const i=s[1],a=e.slice(s[0].length),m={};return i.split(`
`).forEach(g=>{const k=g.indexOf(":");if(k>0){const f=g.slice(0,k).trim(),T=g.slice(k+1).trim();m[f]=T}}),{metadata:m,content:a}};const K=()=>{const e=document.querySelector("#output"),n=document.querySelector(".paper-zoom-label");if(e&&e.classList.contains("paper-layout-active")){const s=l/100;e.style.setProperty("--paper-zoom",s)}n&&(n.textContent=`${l}%`)};let re=e=>{const{metadata:n,content:s}=j(e);de.setOptions({headerIds:!1,mangle:!1,breaks:!0,gfm:!0,pedantic:!1,smartLists:!0,smartypants:!1,sanitize:!1,highlight:function(R,N){if(typeof window.hljs>"u")return console.warn("highlight.js not loaded"),R;if(N&&window.hljs.getLanguage(N))try{return window.hljs.highlight(R,{language:N}).value}catch(D){return console.error("Highlight error:",D),R}try{return window.hljs.highlightAuto(R).value}catch(D){return console.error("Auto-highlight error:",D),R}}});const i=s.replace(/\{%\s*hint\s+style="([^"]+)"\s*%\}([\s\S]*?)\{%\s*endhint\s*%\}/g,(R,N,D)=>{const z={info:{icon:"ℹ️",class:"hint-info",color:"#3b82f6"},warning:{icon:"⚠️",class:"hint-warning",color:"#f59e0b"},danger:{icon:"🚫",class:"hint-danger",color:"#ef4444"},success:{icon:"✅",class:"hint-success",color:"#10b981"},tip:{icon:"💡",class:"hint-tip",color:"#8b5cf6"}},O=z[N]||z.info,W=de.parseInline(D.trim());return`

<div class="gitbook-hint ${O.class}" data-hint-style="${N}"><span class="hint-icon">${O.icon}</span><div class="hint-content">${W}</div></div>

`});let a=de.parse(i),m=zn.sanitize(a,{ADD_ATTR:["class","style","data-hint-style","id","target","rel","href","src","alt","title"],ADD_TAGS:["span","div","strong","em","code","a","img","table","thead","tbody","tr","th","td","ul","ol","li","p","h1","h2","h3","h4","h5","h6","blockquote","pre","br","hr","section","article","aside","nav","header","footer","main","figure","figcaption","b","i","u","s","sub","sup","mark","small","del","ins","abbr","cite","q","dfn","time","var","samp","kbd","data","address","details","summary","dl","dt","dd"],ALLOW_DATA_ATTR:!0,KEEP_CONTENT:!0});const h=document.createElement("div");h.innerHTML=m;const g=e.split(`
`),k=Array.from(h.children);let f=0;k.forEach(R=>{const N=R.tagName.toLowerCase();let D=null;const z=R.textContent.trim();for(let O=f;O<g.length;O++){const W=g[O].trim();if(W){if(N==="h1"&&W.startsWith("# ")&&!W.startsWith("##")){const ce=W.substring(2).trim();if(z===ce){D=O+1,f=O+1;break}}else if(N==="h2"&&W.startsWith("## ")&&!W.startsWith("###")){const ce=W.substring(3).trim();if(z===ce){D=O+1,f=O+1;break}}else if(N==="h3"&&W.startsWith("### ")&&!W.startsWith("####")){const ce=W.substring(4).trim();if(z===ce){D=O+1,f=O+1;break}}else if(N==="h4"&&W.startsWith("#### ")&&!W.startsWith("#####")){const ce=W.substring(5).trim();if(z===ce){D=O+1,f=O+1;break}}else if(N==="h5"&&W.startsWith("##### ")&&!W.startsWith("######")){const ce=W.substring(6).trim();if(z===ce){D=O+1,f=O+1;break}}else if(N==="h6"&&W.startsWith("###### ")){const ce=W.substring(7).trim();if(z===ce){D=O+1,f=O+1;break}}else if(N==="ul"&&(W.startsWith("* ")||W.startsWith("- ")||W.startsWith("+ "))){D=O+1,f=O+1;break}else if(N==="ol"&&/^\d+\.\s/.test(W)){D=O+1,f=O+1;break}else if(N==="blockquote"&&W.startsWith(">")){D=O+1,f=O+1;break}else if(N==="pre"&&W.startsWith("```")){D=O+1,f=O+1;break}else if(N==="table"&&W.includes("|")){D=O+1,f=O+1;break}else if(N==="hr"&&(W==="---"||W==="***"||W==="___")){D=O+1,f=O+1;break}else if(N==="p")if(R.querySelector("img")){if(W.startsWith("![")){D=O+1,f=O+1;break}}else{const Ce=z.replace(/[*_`[\]()]/g,"").substring(0,20).trim(),De=W.replace(/[*_`[\]()]/g,"").substring(0,20).trim();if(De&&Ce.toLowerCase().startsWith(De.toLowerCase())){D=O+1,f=O+1;break}}}}D&&R.setAttribute("data-source-line",D)});let T=h.innerHTML;if(n){if(n.title||n.date){const R=n.title||"Document",N=n.date||new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});T=`<h1>${R}</h1>
<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">${N}</div>
<hr>`+T}if(n["footer-left"]||n["footer-right"]){const R=n["footer-left"]||"",N=n["footer-right"]||"",D=n.date||new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),z=`<hr class="metadata-footer-separator" style="margin-top: 40px;">
<div class="metadata-footer" style="display: flex; justify-content: space-between; margin-top: 20px;">
  <div>
    <strong>${R}</strong><br>
    <span style="color: #666;">${n.title||"Document"}</span>
  </div>
  <div style="text-align: right;">
    <strong>${N}</strong><br>
    <span style="color: #666;">${D}</span>
  </div>
</div>`;T=T+z}}document.querySelector("#output").innerHTML=T;const P=document.querySelector("#output");r==="paper"&&P?P.classList.contains("paper-layout-active")||(P.classList.add("paper-layout-active"),K()):P&&P.classList.remove("paper-layout-active"),yt&&So()},we=e=>{if(!t)return;const n=document.querySelector("#output");if(!n)return;const s=n.querySelector(".cursor-highlight");s&&s.classList.remove("cursor-highlight");const i=n.querySelectorAll("[data-source-line]");let a=null,m=1/0;const h=5;if(i.forEach(g=>{const k=parseInt(g.getAttribute("data-source-line")),f=Math.abs(k-e);k===e?(a=g,m=0):f<m&&f<=h&&(m=f,a=g)}),a&&m<=h){a.classList.add("cursor-highlight");const g=a.getBoundingClientRect(),k=document.querySelector("#preview");if(k){const f=k.getBoundingClientRect();g.top>=f.top&&g.bottom<=f.bottom||a.scrollIntoView({behavior:"smooth",block:"center"})}}},q=e=>{if(!t)return;let n=e;for(;n&&!n.hasAttribute("data-source-line");)if(n=n.parentElement,n&&n.id==="output")return;if(n&&n.hasAttribute("data-source-line")){const s=parseInt(n.getAttribute("data-source-line"));v&&s&&(v.setPosition({lineNumber:s,column:1}),v.revealLineInCenter(s),v.focus(),we(s))}};window.syncCursorToPreview=we,window.syncCursorToEditor=q;let ne=()=>{I(v.getValue()),v.setValue(""),v.focus(),me("Editor cleared! Use <strong>Undo</strong> to restore.")},H=()=>{const e=v.getValue();if(!e||e.trim()==="")return;const n=ct(e);if(e===n){me("Your markdown is already <strong>beautifully formatted</strong>!");return}ze(e,n)};const Z=(e,n)=>{const s=e.split(/(\s+)/),i=n.split(/(\s+)/),a=Array(s.length+1).fill(null).map(()=>Array(i.length+1).fill(0));for(let k=1;k<=s.length;k++)for(let f=1;f<=i.length;f++)s[k-1]===i[f-1]?a[k][f]=a[k-1][f-1]+1:a[k][f]=Math.max(a[k-1][f],a[k][f-1]);const m=[];let h=s.length,g=i.length;for(;h>0||g>0;)h>0&&g>0&&s[h-1]===i[g-1]?(m.unshift({type:"common",text:s[h-1]}),h--,g--):g>0&&(h===0||a[h][g-1]>=a[h-1][g])?(m.unshift({type:"added",text:i[g-1]}),g--):h>0&&(m.unshift({type:"removed",text:s[h-1]}),h--);return m};let ze=(e,n)=>{const s=document.documentElement.getAttribute("data-theme")==="dark",i=s?{bg:"#1e1e1e",text:"#e0e0e0",border:"#333",contextText:"#999",addedBg:"#1a3d1a",addedText:"#7ee87e",removedBg:"#3d1a1a",removedText:"#ff7b7b",separatorBg:"#2a2a2a",separatorText:"#888",buttonBg:"#2a2a2a",buttonBorder:"#444",buttonText:"#e0e0e0"}:{bg:"white",text:"black",border:"#ddd",contextText:"#666",addedBg:"#e6ffed",addedText:"#22863a",removedBg:"#ffeef0",removedText:"#d73a49",separatorBg:"#f0f0f0",separatorText:"#666",buttonBg:"white",buttonBorder:"#ddd",buttonText:"black"},a=document.getElementById("editor-wrapper"),m=document.getElementById("editor"),h=document.createElement("div");h.id="diff-editor-container",h.style.cssText="width: 100%; height: 100%; position: relative; display: flex; flex-direction: column;";const g=document.createElement("style");g.textContent=`
            #diff-editor-container ::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            #diff-editor-container ::-webkit-scrollbar-track {
                background: ${i.bg};
            }
            #diff-editor-container ::-webkit-scrollbar-thumb {
                background: ${s?"#444":"#ccc"};
                border-radius: 6px;
            }
            #diff-editor-container ::-webkit-scrollbar-thumb:hover {
                background: ${s?"#555":"#999"};
            }
            #diff-editor-container {
                scrollbar-width: thin;
                scrollbar-color: ${s?"#444 #1e1e1e":"#ccc #ffffff"};
            }
        `,h.appendChild(g);const k=document.createElement("div");k.style.cssText=`
            padding: 12px 16px;
            background: ${i.bg};
            border-bottom: 1px solid ${i.border};
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: ${i.text};
            gap: 16px;
            overflow-x: auto;
            overflow-y: hidden;
        `;const f=document.createElement("div");f.style.cssText=`
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        `,f.innerHTML=`
            <button id="diff-copy-btn" title="Copy Diff" style="
                height: 32px;
                padding: 0 12px;
                background: ${i.buttonBg};
                color: ${i.buttonText};
                border: 1px solid ${i.buttonBorder};
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                Copy
            </button>
            <button id="diff-discard-btn" title="Cancel" style="
                height: 32px;
                padding: 0 12px;
                background: ${i.buttonBg};
                color: ${i.buttonText};
                border: 1px solid ${i.buttonBorder};
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                </svg>
                Cancel
            </button>
            <button id="diff-apply-btn" title="Apply Changes" style="
                height: 32px;
                padding: 0 12px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                </svg>
                Apply Changes
            </button>
        `,h.appendChild(k);const T=document.createElement("div");T.style.cssText=`flex: 1; overflow-y: auto; background: ${i.bg};`,h.appendChild(T),m.style.display="none",a.appendChild(h),re(n);const P=e.split(`
`),R=n.split(`
`),N=[];let D=0,z=0,O=0;const W=Math.max(P.length,R.length),ce=2,Ce=new Set;for(let he=0;he<W;he++)if(P[he]!==R[he]){Ce.add(he);for(let Ae=Math.max(0,he-ce);Ae<=Math.min(W-1,he+ce);Ae++)Ce.add(Ae)}const De=Array.from(Ce).sort((he,Ae)=>he-Ae);let Xe=[];for(let he=0;he<De.length;he++){const Ae=De[he];Xe.length===0||Ae===Xe[Xe.length-1]+1?Xe.push(Ae):(N.push(Xe),Xe=[Ae])}Xe.length>0&&N.push(Xe);let je='<div style="font-family: monospace; font-size: 13px; line-height: 1.5;">';N.forEach((he,Ae)=>{Ae>0&&(je+=`<div style="padding: 8px 16px; background: ${i.separatorBg}; color: ${i.separatorText}; border-top: 1px solid ${i.border}; border-bottom: 1px solid ${i.border}; margin: 8px 0;">...</div>`),he.forEach(We=>{const _e=P[We],st=R[We],Tt=We+1;if(_e===st)je+=`<div style="padding: 2px 16px; background: transparent; color: ${i.contextText};">
                        <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.contextText};">${Tt}</span>
                        <span style="color: ${i.contextText}; margin-right: 8px;"> </span>
                        ${J(_e||"")}
                    </div>`;else if(D++,_e!==void 0&&st!==void 0){const Pn=Z(_e,st);let Nt="";Pn.forEach(gt=>{gt.type==="removed"?(Nt+=`<span style="background: ${i.removedBg}; color: ${i.removedText}; text-decoration: line-through;">${J(gt.text)}</span>`,O++):gt.type==="common"&&(Nt+=J(gt.text))});let Qt="";Pn.forEach(gt=>{gt.type==="added"?(Qt+=`<span style="background: ${i.addedBg}; color: ${i.addedText}; font-weight: 500;">${J(gt.text)}</span>`,z++):gt.type==="common"&&(Qt+=J(gt.text))}),je+=`<div style="padding: 2px 16px; background: ${i.removedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.removedText};">${Tt}</span>
                            <span style="color: ${i.removedText}; margin-right: 8px;">-</span>
                            ${Nt}
                        </div>`,je+=`<div style="padding: 2px 16px; background: ${i.addedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.addedText};">${Tt}</span>
                            <span style="color: ${i.addedText}; margin-right: 8px;">+</span>
                            ${Qt}
                        </div>`}else _e!==void 0?(O++,je+=`<div style="padding: 2px 16px; background: ${i.removedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.removedText};">${Tt}</span>
                            <span style="color: ${i.removedText}; margin-right: 8px;">-</span>
                            <span style="color: ${i.removedText}; text-decoration: line-through;">${J(_e)}</span>
                        </div>`):st!==void 0&&(z++,je+=`<div style="padding: 2px 16px; background: ${i.addedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.addedText};">${Tt}</span>
                            <span style="color: ${i.addedText}; margin-right: 8px;">+</span>
                            <span style="color: ${i.addedText}; font-weight: 500;">${J(st)}</span>
                        </div>`)})}),je+="</div>",k.innerHTML=`
            <div style="display: flex; gap: 12px; align-items: center; flex-shrink: 0;">
                <span style="font-weight: 600; color: ${i.text}; white-space: nowrap;">Beautify Changes</span>
                <span style="color: ${i.addedText}; white-space: nowrap; font-size: 12px;">+${z}</span>
                <span style="color: ${i.removedText}; white-space: nowrap; font-size: 12px;">-${O}</span>
                <span style="color: ${i.contextText}; white-space: nowrap; font-size: 12px;">${D} lines</span>
            </div>
        `,k.appendChild(f),T.innerHTML=je;const Jt=N.map(he=>he.map(Ae=>{const We=P[Ae],_e=R[Ae];return We===_e?"  "+(We||""):We!==void 0&&_e!==void 0?"- "+We+`
+ `+_e:We!==void 0?"- "+We:"+ "+_e}).join(`
`)).join(`
...
`);document.getElementById("diff-copy-btn").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(Jt);const he=document.getElementById("diff-copy-btn"),Ae=he.style.background,We=he.style.color;he.style.background="#28a745",he.style.color="white",setTimeout(()=>{he.style.background=Ae,he.style.color=We},1500)}catch{me("Failed to copy to clipboard")}}),document.getElementById("diff-apply-btn").addEventListener("click",()=>{I(v.getValue());const Ae=v.getModel().getFullModelRange();v.executeEdits("beautify-apply",[{range:Ae,text:n}]),h.remove(),m.style.display="block",v.focus(),me("Changes <strong>applied</strong>! Your markdown has been beautified. Use <strong>Undo</strong> to revert.")}),document.getElementById("diff-discard-btn").addEventListener("click",()=>{h.remove(),m.style.display="block",re(e),v.focus(),me("Changes <strong>discarded</strong>. Your original markdown is unchanged.")})};const J=e=>{const n=document.createElement("div");return n.textContent=e,n.innerHTML};let ct=e=>{if(!e)return"";const n=e.split(`
`),s=[];let i=0,a="start";const m=()=>{s.length>0&&s[s.length-1]!==""&&s.push("")},h=g=>{const k=g.map(T=>T.trim().replace(/^\||\|$/g,"").split("|").map(P=>P.trim())),f=[];return k.forEach(T=>{T.forEach((P,R)=>{f[R]=Math.max(f[R]||0,P.length)})}),k.map((T,P)=>{const R=T.every(D=>/^[ \-:]+$/.test(D));return"| "+T.map((D,z)=>{if(R){const O=D.startsWith(":"),W=D.endsWith(":");return(O?":":"")+"-".repeat(Math.max(3,f[z]-(O?1:0)-(W?1:0)))+(W?":":"")}return D.padEnd(f[z]," ")}).join(" | ")+" |"}).join(`
`)};for(;i<n.length;){let g=n[i],k=g.trim();const f=g.match(/^(\s*)/),T=f?f[1]:"";if(i===0&&k==="---"){for(s.push(k),i++;i<n.length&&n[i].trim()!=="---";)s.push(n[i]),i++;i<n.length&&s.push("---"),a="yaml",i++;continue}if(k.startsWith("```")){for(m(),s.push(k),i++;i<n.length&&!n[i].trim().startsWith("```");)s.push(n[i]),i++;i<n.length&&s.push(n[i].trim()),a="code-end",i++;continue}if(k.startsWith(">")){const z=k.substring(1).trim();s.push(`${T}> ${z}`),a="blockquote",i++;continue}if(k.startsWith("|")&&T===""){m();let z=[];for(;i<n.length&&n[i].trim().startsWith("|");)z.push(n[i]),i++;s.push(h(z)),a="table";continue}const P=k.match(/^(#{1,6})\s*(.*)/);if(P&&T===""){m();let z=P[2].replace(/\s+#*$/,"").trim();z=z.replace(/^(\d+)\.(\S)/,"$1. $2"),s.push(`${P[1]} ${z}`),a="header",i++;continue}const R=k.match(/^(\d+)\.\s+([A-Z].*)/);if(R&&T===""&&a!=="list"){m();const z=R[1],O=R[2];s.push(`### ${z}. ${O}`),a="header",i++;continue}const N=g.match(/^(\s*)([*+-]|\d+\.)\s+(.*)$/);if(N){a!=="list"&&a!=="start"&&T===""&&m();let z=N[1],O=N[2],W=N[3].trim();z.length>0&&console.log("[BEAUTIFY] Preserving list indent:",z.length,"spaces for:",W.substring(0,30)),["+","*"].includes(O)&&(O="-"),W=W.replace(/^([A-Za-z][A-Za-z0-9\s]*):(\S)/,"$1: $2"),z=z.replace(/\t/g,"    "),s.push(`${z}${O} ${W}`),a="list",i++;continue}if(/^[-*_]{3,}$/.test(k)&&T===""){m(),s.push("---"),a="hr",i++;continue}if(k===""){a!=="empty"&&a!=="start"&&(s.push(""),a="empty"),i++;continue}["header","hr","code-end","table"].includes(a)&&T===""&&m();let D=k.replace(/^([A-Za-z][A-Za-z0-9\s]*):(\S)/,"$1: $2");T?s.push(`${T}${D}`):s.push(D),a="text",i++}return s.join(`
`).trim()},It=async()=>{try{const e=await navigator.clipboard.read();let n=null,s=null;for(const i of e)i.types.includes("text/html")&&(n=await(await i.getType("text/html")).text()),i.types.includes("text/plain")&&(s=await(await i.getType("text/plain")).text());if(n&&Yt){const i=await dt(n,s);if(i==="cancel")return;if(i==="markdown"){const a=Yt.turndown(n);He(a),me("HTML converted to <strong>Markdown</strong>!")}else i==="html"?(He(n),me("Raw <strong>HTML</strong> inserted!")):i==="text"&&(He(s||n),me("Plain <strong>text</strong> inserted!"))}else{const i=s||await navigator.clipboard.readText();i&&He(i)}v.focus()}catch{try{const n=await navigator.clipboard.readText();n&&(He(n),v.focus())}catch{window.alert("Failed to read clipboard. Please make sure you have granted clipboard permissions.")}}};const He=e=>{const n=v.getPosition();v.executeEdits("",[{range:new te.Range(n.lineNumber,n.column,n.lineNumber,n.column),text:e}])},Ot=(e,n)=>{const s=n.replace(/\.svg$/i,"");let i=e.replace(/\r\n/g,"").replace(/\n/g,"").replace(/\r/g,"").replace(/>\s+</g,"><").trim();return`# ${s}

${i}`},dt=(e,n)=>new Promise(s=>{const i=document.createElement("div");i.className="paste-dialog-overlay",i.innerHTML=`
                <div class="paste-dialog">
                    <div class="paste-dialog-header">
                        <h3>Paste HTML Content</h3>
                        <button class="paste-dialog-close" id="paste-dialog-close">×</button>
                    </div>
                    <div class="paste-dialog-body">
                        <p>HTML content detected in clipboard. How would you like to paste it?</p>
                        <div class="paste-preview">
                            <div class="paste-preview-label">Preview:</div>
                            <div class="paste-preview-content">${zn.sanitize(e.substring(0,500))}</div>
                        </div>
                    </div>
                    <div class="paste-dialog-footer">
                        <button class="paste-btn paste-btn-secondary" id="paste-as-text">As Plain Text</button>
                        <button class="paste-btn paste-btn-primary" id="paste-as-markdown">Convert to Markdown</button>
                        <button class="paste-btn paste-btn-primary" id="paste-as-html">Keep as HTML</button>
                    </div>
                </div>
            `,document.body.appendChild(i);const a=()=>{document.body.removeChild(i)};i.querySelector("#paste-dialog-close").addEventListener("click",()=>{a(),s("cancel")}),i.querySelector("#paste-as-text").addEventListener("click",()=>{a(),s("text")}),i.querySelector("#paste-as-markdown").addEventListener("click",()=>{a(),s("markdown")}),i.querySelector("#paste-as-html").addEventListener("click",()=>{a(),s("html")}),i.addEventListener("click",m=>{m.target===i&&(a(),s("cancel"))})});let mt=e=>{v.setValue(e),v.revealPosition({lineNumber:1,column:1}),v.focus()},vt=e=>{let n=document.querySelector("#sync-scroll-checkbox");n.checked=e,w=e,n.addEventListener("change",s=>{let i=s.currentTarget.checked;w=i,Ui(i)})},et=e=>{let n=document.querySelector("#sync-cursor-checkbox");n.checked=e,t=e,n.addEventListener("change",s=>{let i=s.currentTarget.checked;if(t=i,ji(i),!i){const a=document.querySelector("#output");if(a){const m=a.querySelector(".cursor-highlight");m&&m.classList.remove("cursor-highlight")}}})},ut=e=>{let n=document.querySelector("#helper-messages-checkbox");n&&(n.checked=e,Ue=e,n.addEventListener("change",s=>{let i=s.currentTarget.checked;Gt(i)}))},Y=()=>{let e=document.querySelector("#style-tooltips-checkbox");if(!e)return;const n=localStorage.getItem("com.markdownlivepreview.style_tooltips_disabled")==="true";e.checked=!n,e.addEventListener("change",s=>{if(s.target.checked){localStorage.removeItem("com.markdownlivepreview.style_tooltips_disabled");const i=document.querySelector("#style-selector");i&&(i.value,setTimeout(()=>{const a=new Event("change");i.dispatchEvent(a)},100))}else localStorage.setItem("com.markdownlivepreview.style_tooltips_disabled","true")})};const ge="css/github-markdown-light.css?v=1.12.0",fe="css/github-markdown-dark_dimmed.css?v=1.12.0",Me="css/gitbook-style.css?v=1.12.0",Te="css/vscode-style.css?v=1.12.0";let ue="github",xt=(e,n=ue)=>{const s=document.getElementById("gh-markdown-link");if(!s){const a=document.createElement("link");a.id="gh-markdown-link",a.rel="stylesheet",a.href=Ft(e,n),document.head.appendChild(a);return}const i=Ft(e,n);s.getAttribute("href")!==i&&s.setAttribute("href",i)},Ft=(e,n)=>n==="gitbook"?Me:n==="vscode"?Te:e?fe:ge,un=e=>{document.documentElement.setAttribute("data-theme",e?"dark":"light");const n=document.getElementById("hljs-light-theme"),s=document.getElementById("hljs-dark-theme");n&&s&&(n.disabled=e,s.disabled=!e)},zt=e=>{let n=document.querySelector("#theme-checkbox");n&&(n.checked=e,un(e),te&&te.editor&&typeof te.editor.setTheme=="function"&&te.editor.setTheme(e?"custom-dark":"custom-light"),xt(e,ue),n.addEventListener("change",s=>{let i=s.currentTarget.checked;un(i),Gi(i),xt(i,ue),te&&te.editor&&typeof te.editor.setTheme=="function"&&te.editor.setTheme(i?"custom-dark":"custom-light")}))},wt=e=>{let n=document.querySelector("#style-selector");if(!n)return;ue=e,n.value=ue;const s={github:{name:"GitHub Style",description:"Traditional, balanced, professional",fonts:"Helvetica (Sans-serif)",textSize:"11pt body, 20pt H1",features:"Full table borders, gray header backgrounds",bestFor:"Documentation, README files, general content"},gitbook:{name:"GitBook Style",description:"Modern, clean, book-like",fonts:"Helvetica (Sans-serif)",textSize:"10pt body, 18pt H1",features:"Horizontal table borders, minimal styling",bestFor:"Books, guides, long-form documentation"},vscode:{name:"VS Code Style",description:"Compact, technical, code-focused",fonts:"Courier (Monospace)",textSize:"8pt body, 12pt H1",features:"Minimal borders, tight spacing",bestFor:"Technical docs, code-heavy content"}};localStorage.getItem("com.markdownlivepreview.style_tooltips_disabled");const i=m=>{if(localStorage.getItem("com.markdownlivepreview.style_tooltips_disabled")==="true")return;const g=s[m];if(!g)return;const k=document.querySelector(".style-info-tooltip");k&&k.remove();const f=document.createElement("div");f.className="style-info-tooltip";const T=document.documentElement.getAttribute("data-theme")==="dark",P=T?"#1e1e1e":"#ffffff",R=T?"#e0e0e0":"#333333",N=T?"#404040":"#ddd",D=T?"#a0a0a0":"#666666";f.innerHTML=`
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <strong style="font-size: 14px; color: ${R};">${g.name}</strong>
                    <button id="close-style-tooltip" style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; margin-left: 10px; color: ${R};">×</button>
                </div>
                <p style="margin: 4px 0; font-size: 12px; color: ${D};">${g.description}</p>
                <div style="margin-top: 8px; font-size: 11px; line-height: 1.6; color: ${R};">
                    <div><strong>Fonts:</strong> ${g.fonts}</div>
                    <div><strong>Text Size:</strong> ${g.textSize}</div>
                    <div><strong>Features:</strong> ${g.features}</div>
                    <div style="margin-top: 4px; color: ${D};"><em>Best for: ${g.bestFor}</em></div>
                </div>
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid ${N};">
                    <label style="font-size: 11px; cursor: pointer; display: flex; align-items: center; color: ${R};">
                        <input type="checkbox" id="never-show-style-tooltips" style="margin-right: 6px; cursor: pointer;">
                        Don't show again
                    </label>
                </div>
            `,f.style.cssText=`
                position: fixed;
                top: 60px;
                left: 20px;
                background: ${P};
                border: 1px solid ${N};
                border-radius: 8px;
                padding: 12px 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,${T?"0.5":"0.15"});
                z-index: 10000;
                max-width: 320px;
                animation: slideIn 0.3s ease-out;
            `,document.body.appendChild(f);let z=!1,O=null;const W=()=>{O=setTimeout(()=>{z||(f.style.animation="slideOut 0.3s ease-out",setTimeout(()=>f.remove(),300))},2e3)},ce=()=>{O&&(clearTimeout(O),O=null)};W(),f.addEventListener("mouseenter",()=>{ce()}),f.addEventListener("mouseleave",()=>{z||W()}),f.addEventListener("mousedown",()=>{z=!0,ce()}),f.addEventListener("mouseup",()=>{z=!1}),document.getElementById("close-style-tooltip").addEventListener("click",Ce=>{Ce.stopPropagation(),ce(),f.style.animation="slideOut 0.3s ease-out",setTimeout(()=>f.remove(),300)}),document.getElementById("never-show-style-tooltips").addEventListener("change",Ce=>{if(Ce.target.checked){localStorage.setItem("com.markdownlivepreview.style_tooltips_disabled","true");const De=document.querySelector("#style-tooltips-checkbox");De&&(De.checked=!1),ce(),f.style.animation="slideOut 0.3s ease-out",setTimeout(()=>f.remove(),300)}})},a=document.documentElement.getAttribute("data-theme")==="dark";xt(a,ue),setTimeout(()=>{i(ue)},500),n.addEventListener("change",m=>{ue=m.target.value,Ki(ue);const h=document.documentElement.getAttribute("data-theme")==="dark";xt(h,ue),i(ue)})},ht=e=>{let n=document.querySelector("#flip-panels-checkbox");n&&(n.checked=e,qe(e),n.addEventListener("change",s=>{let i=s.currentTarget.checked;qe(i),Zi(i)}))},qe=e=>{const n=document.querySelector("#container");e?n.classList.add("flipped"):n.classList.remove("flipped")},Ht=e=>{let n=document.querySelector("#vertical-layout-checkbox");n&&(n.checked=e,Wt(e),n.addEventListener("change",s=>{let i=s.currentTarget.checked;Wt(i),Qi(i),v&&setTimeout(()=>{v.layout()},350)}))},Wt=e=>{const n=document.querySelector("#container");e?n.classList.add("vertical"):n.classList.remove("vertical")},pn=(e,n,s)=>{navigator.clipboard.writeText(e).then(()=>{n()},()=>{})},qt=()=>{let e=document.querySelector("#copy-button a");e.innerHTML="Copied!",setTimeout(()=>{e.innerHTML="Copy"},1e3)},Ut=async(e,n)=>{let s;e==="gitbook"?s=Me:e==="vscode"?s=Te:s=n?fe:ge;try{const i=await fetch(s);if(!i.ok)throw new Error(`Failed to load CSS: ${i.status}`);return await i.text()}catch(i){return console.error("Failed to load CSS for export",i),""}},$t=async()=>{const e=document.querySelector("#output");if(!e)return;const n=document.documentElement.getAttribute("data-theme")==="dark",s=await Ut(ue,n);let i="";ue==="gitbook"?i=`
                body {
                    background-color: ${n?"#0d1117":"#f5f5f5"};
                    padding: 40px 20px;
                }
                .paper-container {
                    max-width: 860px;
                    margin: 0 auto;
                    background-color: ${n?"#1a1a1a":"#ffffff"};
                    padding: 50px 70px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, ${n?"0.5":"0.1"});
                    min-height: 100vh;
                }
                .markdown-body {
                    padding: 0;
                    background-color: transparent;
                }
            `:ue==="vscode"?i=`
                body {
                    background-color: ${n?"#1e1e1e":"#f3f3f3"};
                    padding: 40px 20px;
                }
                .paper-container {
                    max-width: 900px;
                    margin: 0 auto;
                    background-color: ${n?"#1e1e1e":"#ffffff"};
                    padding: 40px 50px;
                    box-shadow: 0 0 15px rgba(0, 0, 0, ${n?"0.4":"0.1"});
                    min-height: 100vh;
                    border: 1px solid ${n?"#3c3c3c":"#e1e4e8"};
                }
                .markdown-body {
                    padding: 0;
                    background-color: transparent;
                }
            `:i=`
                body {
                    background-color: ${n?"#0d1117":"#f6f8fa"};
                    padding: 40px 20px;
                    margin: 0;
                }
                .paper-container {
                    max-width: 980px;
                    margin: 0 auto;
                    background-color: ${n?"#0d1117":"#ffffff"};
                    padding: 40px 50px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, ${n?"0.3":"0.08"});
                    min-height: 100vh;
                    border: 1px solid ${n?"#30363d":"#d0d7de"};
                }
                .markdown-body {
                    padding: 0;
                    margin: 0;
                    background-color: transparent;
                    max-width: 100%;
                    width: 100%;
                }
            `;const a=`<!DOCTYPE html>
<html lang="en" data-theme="${n?"dark":"light"}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown - ${ue.charAt(0).toUpperCase()+ue.slice(1)} Style</title>
    <style>
        * {
            box-sizing: border-box;
        }
        ${i}
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            .paper-container {
                box-shadow: none;
                border: none;
                max-width: 100%;
            }
        }
        ${s}
    </style>
</head>
<body>
    <div class="paper-container">
        <div class="markdown-body">
            ${e.innerHTML}
        </div>
    </div>
</body>
</html>`,m=new Blob([a],{type:"text/html"}),h=URL.createObjectURL(m),g=document.createElement("a");g.href=h;const k=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5),f=ue.charAt(0).toUpperCase()+ue.slice(1),T=n?"Dark":"Light";g.download=`DocMark_${f}_${T}_${k}.html`,document.body.appendChild(g),g.click(),document.body.removeChild(g),URL.revokeObjectURL(h),Ye(`HTML exported successfully (${f} - ${T} mode)`,"success")},kt=async()=>{console.log("🚀 [PUPPETEER PDF EXPORT] Starting export...");const e=document.querySelector("#output");if(!e){alert("No content to export");return}try{console.log("[PDF Export] Using Puppeteer server at localhost:3000"),ft("Generating PDF...");const s=Bo().margins||{top:20,right:20,bottom:20,left:20};console.log("[PDF Export] Using margins:",s);const i=await tt(e),a=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5),h=`DocMark_${ue.charAt(0).toUpperCase()+ue.slice(1)}_${a}.pdf`,g=await fetch("http://localhost:3000/generate-pdf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({html:i,filename:h,margins:s})});if(!g.ok)throw new Error("PDF generation failed");const k=await g.blob(),f=window.URL.createObjectURL(k),T=document.createElement("a");T.href=f,T.download=h,document.body.appendChild(T),T.click(),document.body.removeChild(T),window.URL.revokeObjectURL(f),_t(),console.log("[PDF Export] Success!")}catch(n){console.error("[PDF Export] Failed:",n),_t(),n.message.includes("Failed to fetch")?alert(`PDF server not running!

Please start it with:
node pdf-server.js`):alert("PDF export failed: "+n.message)}},tt=async e=>{console.log("[PDF Export] Collecting HTML and CSS for Puppeteer...");const n=document.getElementById("gh-markdown-link");let s="";if(n&&n.href){console.log("[PDF Export] Fetching CSS from:",n.href);try{s=await(await fetch(n.href)).text(),console.log("[PDF Export] CSS fetched successfully, length:",s.length)}catch(h){console.error("[PDF Export] Failed to fetch CSS:",h)}}let i="";return document.querySelectorAll("style").forEach(h=>{i+=h.textContent+`
`}),`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        /* Markdown body styles */
        ${s}
        
        /* Inline styles from page */
        ${i}
        
        /* Print-specific resets */
        @media print {
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
            }
            
            /* Reset paper layout preview styles */
            #output {
                max-width: none !important;
                min-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                transform: none !important;
                background: white !important;
            }
            
            .markdown-body {
                padding: 0 !important;
                margin: 0 !important;
            }
            
            /* Footer positioning */
            [data-pdf-footer="true"] {
                display: block;
                margin-top: auto;
                padding-top: 20px;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            /* Avoid breaking inside these elements */
            h1, h2, h3, h4, h5, h6 {
                break-after: avoid;
                page-break-after: avoid;
            }
            
            p, ul, ol, table {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    ${e.innerHTML}
</body>
</html>`},ft=e=>{const n=document.getElementById("pdf-loading-indicator");n&&n.remove();const s=document.createElement("div");s.id="pdf-loading-indicator",s.innerHTML=`
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: rgba(0,0,0,0.5); z-index: 10000; 
                        display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 30px; border-radius: 8px; 
                            text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #333;">
                        ${e}
                    </div>
                    <div style="width: 40px; height: 40px; margin: 0 auto; 
                                border: 4px solid #f3f3f3; border-top: 4px solid #007bff; 
                                border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `,document.body.appendChild(s)},_t=()=>{const e=document.getElementById("pdf-loading-indicator");e&&e.remove()},Vt=()=>{try{let e=localStorage.getItem(M+"."+se);if(e){let n=JSON.parse(e);y={...y,...n}}}catch(e){console.error("Failed to load PDF settings",e)}},gn=()=>{if(document.getElementById("pdf-settings-panel")){document.getElementById("pdf-settings-panel").remove();return}(()=>{try{const i=localStorage.getItem(M+".pdf_templates");return i?JSON.parse(i):{}}catch{return{}}})();const n=document.createElement("div");n.id="pdf-settings-panel",n.style.cssText=`
            position: fixed;
            top: 60px;
            right: 20px;
            width: 320px;
            max-height: calc(100vh - 80px);
            background: var(--bg-color, white);
            color: var(--text-color, black);
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            overflow-y: auto;
            font-family: system-ui, -apple-system, sans-serif;
        `,n.innerHTML=`
            <div style="position: sticky; top: 0; background: var(--bg-color, white); padding: 15px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 16px;">PDF Export Settings</h3>
                <button id="pdf-close-panel" style="background: none; border: none; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px;">×</button>
            </div>
            
            <div style="padding: 15px;">
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #666;">Font Family</h4>
                    <select id="pdf-font-family" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: var(--bg-color, white); color: var(--text-color, black);">
                        <option value="helvetica" ${y.fontFamily==="helvetica"?"selected":""}>Helvetica (Sans-serif)</option>
                        <option value="times" ${y.fontFamily==="times"?"selected":""}>Times (Serif)</option>
                        <option value="courier" ${y.fontFamily==="courier"?"selected":""}>Courier (Monospace)</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #666;">Font Sizes (pt)</h4>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H1 Heading:</span>
                        <input type="number" id="pdf-h1" min="6" max="32" value="${y.h1}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H2 Heading:</span>
                        <input type="number" id="pdf-h2" min="6" max="32" value="${y.h2}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H3 Heading:</span>
                        <input type="number" id="pdf-h3" min="6" max="32" value="${y.h3}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H4-H6 Heading:</span>
                        <input type="number" id="pdf-h4" min="6" max="32" value="${y.h4}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Paragraph:</span>
                        <input type="number" id="pdf-paragraph" min="6" max="32" value="${y.paragraph}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>List:</span>
                        <input type="number" id="pdf-list" min="6" max="32" value="${y.list}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Blockquote:</span>
                        <input type="number" id="pdf-blockquote" min="6" max="32" value="${y.blockquote}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Code:</span>
                        <input type="number" id="pdf-code" min="6" max="32" value="${y.code}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Table:</span>
                        <input type="number" id="pdf-table" min="6" max="32" value="${y.table}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #666;">Table Styling</h4>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Borders:</span>
                        <select id="pdf-table-borders" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: var(--bg-color, white); color: var(--text-color, black);">
                            <option value="all" ${y.tableBorders==="all"?"selected":""}>All Borders</option>
                            <option value="horizontal" ${y.tableBorders==="horizontal"?"selected":""}>Horizontal Only</option>
                            <option value="none" ${y.tableBorders==="none"?"selected":""}>No Borders</option>
                        </select>
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 12px;">
                        <span>Border Weight:</span>
                        <input type="number" id="pdf-border-weight" min="0.1" max="2" step="0.1" value="${y.tableBorderWeight}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Border Color:</span>
                        <input type="color" id="pdf-border-color" value="${y.tableBorderColor}" style="width: 100%; height: 32px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    </label>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Header Background:</span>
                        <input type="color" id="pdf-header-bg" value="${y.tableHeaderBg}" style="width: 100%; height: 32px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    </label>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Header Text Color:</span>
                        <input type="color" id="pdf-header-color" value="${y.tableHeaderColor}" style="width: 100%; height: 32px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    </label>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button id="pdf-reset-btn" style="flex: 1; padding: 8px; cursor: pointer; border: 1px solid #ddd; border-radius: 4px; background: var(--bg-color, white); color: var(--text-color, black);">Reset</button>
                    <button id="pdf-export-now-btn" style="flex: 1; padding: 8px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px; font-weight: 500;">Export PDF</button>
                </div>
                
                <p style="margin: 15px 0 0 0; font-size: 11px; color: #999; text-align: center;">Changes save automatically</p>
            </div>
        `,document.body.appendChild(n);const s=(i,a)=>{y[i]=a,savePdfSettings()};["h1","h2","h3","h4","paragraph","list","blockquote","code","table"].forEach(i=>{const a=document.getElementById(`pdf-${i}`);a.addEventListener("change",()=>s(i,parseInt(a.value)||8))}),document.getElementById("pdf-font-family").addEventListener("change",i=>{s("fontFamily",i.target.value)}),document.getElementById("pdf-table-borders").addEventListener("change",i=>{s("tableBorders",i.target.value)}),document.getElementById("pdf-border-weight").addEventListener("change",i=>{s("tableBorderWeight",parseFloat(i.target.value)||.1)}),document.getElementById("pdf-border-color").addEventListener("change",i=>{s("tableBorderColor",i.target.value)}),document.getElementById("pdf-header-bg").addEventListener("change",i=>{s("tableHeaderBg",i.target.value)}),document.getElementById("pdf-header-color").addEventListener("change",i=>{s("tableHeaderColor",i.target.value)}),document.getElementById("pdf-reset-btn").addEventListener("click",()=>{y={h1:10,h2:10,h3:10,h4:10,paragraph:8,list:8,blockquote:8,code:8,table:8,fontFamily:"helvetica",tableBorders:"horizontal",tableBorderWeight:.1,tableBorderColor:"#cccccc",tableHeaderBg:"#f0f0f0",tableHeaderColor:"#000000"},savePdfSettings(),n.remove(),gn()}),document.getElementById("pdf-export-now-btn").addEventListener("click",()=>{kt()}),document.getElementById("pdf-close-panel").addEventListener("click",()=>{n.remove()})},Mt=()=>{document.querySelector("#clear-button").addEventListener("click",e=>{e.preventDefault(),ne()})},Rt=()=>{document.querySelector("#paste-button").addEventListener("click",e=>{e.preventDefault(),It()})},Gn=e=>{document.querySelector("#copy-button").addEventListener("click",n=>{n.preventDefault();let s=e.getValue();pn(s,()=>{qt()})})},Lt=()=>{const e=document.querySelector("#export-pdf-link");e&&e.addEventListener("click",n=>{n.preventDefault(),kt()})},Yn=()=>{const e=document.querySelector("#export-html-link");e&&e.addEventListener("click",n=>{n.preventDefault(),$t()})},Kn=e=>{const n=document.querySelector("#export-md-button");n&&n.addEventListener("click",()=>{if(!e)return;const s=e.getValue();let i="document";const a=s.match(/^---\s*\ntitle:\s*(.+?)\s*\n/m);if(a)i=a[1].trim().replace(/[^a-z0-9]/gi,"_").toLowerCase();else{const T=s.match(/^#\s+(.+)$/m);T&&(i=T[1].trim().replace(/[^a-z0-9]/gi,"_").toLowerCase())}const m=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5),h=`${i}_docmark_${m}.md`,g=new Blob([s],{type:"text/markdown;charset=utf-8"}),k=URL.createObjectURL(g),f=document.createElement("a");f.href=k,f.download=h,document.body.appendChild(f),f.click(),document.body.removeChild(f),URL.revokeObjectURL(k),Ye(`Markdown exported: ${h}`,"success")})},Ee=e=>{const n=document.querySelector("#import-md-button"),s=document.querySelector("#import-md-input");n&&s&&(n.addEventListener("click",()=>{s.click()}),s.addEventListener("change",i=>{const a=i.target.files[0];if(a){const m=[".jpg",".jpeg",".png",".gif",".webp",".bmp"],h=[".mp4",".webm",".ogg",".mov",".avi",".mkv"],g=a.name.toLowerCase(),k=m.some(T=>g.endsWith(T)),f=h.some(T=>g.endsWith(T));if(k||f){const T=new FileReader;T.onload=P=>{const R=P.target.result,N=a.name.replace(/\.[^/.]+$/,"");let D;if(k?D=`![${N}](${R})`:D=`<video controls style="max-width: 100%; height: auto;"><source src="${R}" type="${a.type}">Your browser does not support the video tag.</video>`,e){I(e.getValue());const z=e.getPosition();e.executeEdits("import-media",[{range:new te.Range(z.lineNumber,z.column,z.lineNumber,z.column),text:D}]);const O=k?"Image":"Video";Ye(`${O} embedded: ${a.name}`,"success"),me(`${O} converted to <strong>base64</strong> and embedded!`)}},T.onerror=()=>{Ye("Failed to read file","error")},T.readAsDataURL(a)}else{const T=new FileReader;T.onload=P=>{let R=P.target.result;if(a.name.toLowerCase().endsWith(".svg")?(R=Ot(R,a.name),Ye(`SVG converted: ${a.name}`,"success"),me("SVG file converted to <strong>single-line format</strong> for proper rendering!")):(Ye(`Imported: ${a.name}`,"success"),me("File imported! Use <strong>Undo</strong> to restore previous content.")),e){I(e.getValue());const D=e.getModel().getFullModelRange();e.executeEdits("import-markdown",[{range:D,text:R}])}},T.onerror=()=>{Ye("Failed to read file","error")},T.readAsText(a)}}i.target.value=""}))},bt=()=>{let e=document.querySelector("#pdf-settings-link");e&&e.addEventListener("click",n=>{n.preventDefault(),gn()})},Xn=()=>{const e=document.querySelector("#undo-button");e&&e.addEventListener("click",n=>{n.preventDefault(),v&&(C(),v.focus())})},mn=()=>{const e=document.querySelector("#redo-button");e&&e.addEventListener("click",n=>{n.preventDefault(),v&&(x(),v.focus())})},jt=()=>{const e=document.querySelector("#beautify-button");e&&e.addEventListener("click",n=>{n.preventDefault(),H()})},hn=()=>{const e=document.querySelector("#print-pdf-link");e&&e.addEventListener("click",async n=>{n.preventDefault(),await fn()})},fn=async()=>{const e=document.querySelector("#output");if(!e)return;const n=document.documentElement.getAttribute("data-theme")==="dark",s=await Ut(ue,n),i=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Preview</title>
    <style>
        @media print {
            @page {
                margin: 1cm;
            }
            body {
                margin: 0;
                padding: 0;
            }
        }
        body {
            margin: 0;
            padding: 20px;
            background-color: ${n?"#1E1E1E":"#ffffff"};
            color: ${n?"#e6edf3":"#24292f"};
        }
        .markdown-body {
            max-width: 900px;
            margin: 0 auto;
            color: ${n?"#e6edf3":"#24292f"};
        }
        ${s}
    </style>
</head>
<body>
    <div class="markdown-body">
        ${e.innerHTML}
    </div>
    <script>
        window.onload = function() {
            window.print();
        };
    <\/script>
</body>
</html>`,a=window.open("","_blank");a.document.write(i),a.document.close()},Ye=(e,n="info")=>{const s=document.createElement("div");s.className=`toast-notification ${n}`,s.textContent=e,document.body.appendChild(s),setTimeout(()=>{s.classList.add("hiding"),setTimeout(()=>{document.body.removeChild(s)},300)},2500)},Re=!1,Ue=!0;const bn=()=>(Ue=xe.getItem(M,ee)!==!1,Ue),Gt=e=>{const n=new Date(2099,1,1);xe.setItem(M,ee,e,n),Ue=e};let me=e=>{Re=!0;const n=document.querySelector(".mofu-head"),s=document.querySelector(".mofu-face-features"),i=document.querySelector(".mofu-smile");if(n&&s&&(n.style.transform="",s.style.transform="",n.classList.add("mofu-attention"),i&&(i.style.width="10px",i.style.height="5px",i.style.borderWidth="2px"),setTimeout(()=>{n.classList.remove("mofu-attention")},600)),!Ue){setTimeout(()=>{Re=!1,i&&(i.style.width="7px",i.style.height="3.5px",i.style.borderWidth="1.5px")},2e3);return}const a=document.querySelector(".mofu-helper-bubble");a&&a.remove();const m=document.createElement("div");m.className="mofu-helper-bubble",m.innerHTML=`
            <div class="mofu-helper-message">${e}</div>
            <label class="mofu-helper-footer">
                <input type="checkbox" id="mofu-dont-show-again">
                <span>Don't show again</span>
            </label>
        `,document.body.appendChild(m);const h=m.querySelector("#mofu-dont-show-again");h&&h.addEventListener("change",g=>{g.target.checked&&(Gt(!1),m.classList.add("hiding"),setTimeout(()=>{m.parentNode&&document.body.removeChild(m),Re=!1,i&&(i.style.width="7px",i.style.height="3.5px",i.style.borderWidth="1.5px")},200))}),setTimeout(()=>{m.parentNode&&(m.classList.add("hiding"),setTimeout(()=>{m.parentNode&&document.body.removeChild(m),Re=!1,i&&(i.style.width="7px",i.style.height="3.5px",i.style.borderWidth="1.5px")},200))},5e3)},yn=()=>{const e=document.querySelector("#insert-header-button");e&&e.addEventListener("click",n=>{n.preventDefault(),V(),me("I've added a <strong>header template</strong> for you! Replace the placeholders with your actual information.")})},nt=()=>{const e=document.querySelector("#insert-footer-button");e&&e.addEventListener("click",n=>{n.preventDefault(),u(),me("I've added a <strong>footer template</strong> for you! Replace the placeholders with your actual information.")})},vn=()=>{const e=document.querySelector("#insert-break-button");e&&e.addEventListener("click",n=>{n.preventDefault(),ot(),me("I've inserted a <strong>page break</strong>! This will create a new page in your PDF export.")})},xn=()=>{const e=document.querySelector("#insert-image-button");e&&e.addEventListener("click",n=>{n.preventDefault(),wn()})},wn=()=>{const e=prompt("Enter image width (in pixels, e.g., 300):","300");if(!e)return;const n=prompt("Enter image height (in pixels, leave empty for auto):",""),s=n?` height="${n}"`:"",i=`
<div>
<img src="https://via.placeholder.com/${e}x${n||"200"}?text=Your+Image" width="${e}"${s} /> >
</div>

`,a=v.getPosition(),m=a.lineNumber;v.executeEdits("insert-image",[{range:new te.Range(a.lineNumber,a.column,a.lineNumber,a.column),text:i}]),setTimeout(()=>{const h=v.getModel();h&&h.deltaDecorations([],[]),setTimeout(()=>{v.trigger("fold","editor.fold",{lineNumber:m+1})},100)},100),v.focus(),me("Image placeholder added! Replace the URL with your image link.")},kn=()=>{const e=document.querySelector("#insert-media-button"),n=document.querySelector("#insert-media-input");!e||!n||(e.addEventListener("click",s=>{s.preventDefault(),n.click()}),n.addEventListener("change",s=>{const i=s.target.files[0];if(!i)return;const a=[".jpg",".jpeg",".png",".gif",".webp",".bmp"],m=[".mp4",".webm",".ogg",".mov",".avi",".mkv"],h=i.name.toLowerCase(),g=a.some(T=>h.endsWith(T)),k=m.some(T=>h.endsWith(T));if(h.endsWith(".svg")){const T=new FileReader;T.onload=P=>{const N=P.target.result.replace(/\r\n/g,"").replace(/\n/g,"").replace(/\r/g,"").replace(/>\s+</g,"><").trim();Ln(N),Ye(`SVG embedded: ${i.name}`,"success"),me("SVG converted to <strong>single-line format</strong>!")},T.readAsText(i)}else if(g||k){const T=new FileReader;T.onload=P=>{const R=P.target.result,N=i.name.replace(/\.[^/.]+$/,"");let D;g?D=`
<div>
<img src="${R}" alt="${N}" style="max-width: 100%; height: auto;" />
</div>
`:D=`
<div>
<video controls style="max-width: 100%; height: auto;"><source src="${R}" type="${i.type}">Your browser does not support the video tag.</video>
</div>
`,Ln(D);const z=g?"Image":"Video";Ye(`${z} embedded: ${i.name}`,"success"),me(`${z} converted to <strong>base64</strong> and embedded!`),setTimeout(()=>{v.trigger("fold","editor.foldAll")},300)},T.readAsDataURL(i)}else Ye("Unsupported file format","error"),me("Please select an image, video, or SVG file.");s.target.value=""}))},Ln=e=>{const n=v.getPosition();v.executeEdits("insert-media",[{range:new te.Range(n.lineNumber,n.column,n.lineNumber,n.column),text:e}]),v.focus()},V=()=>{const n=`# Document Title

<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>

---

`,a=v.getModel().getValue().split(`
`);let m=1,h=1;if(a[0]&&a[0].trim()==="---"){for(let g=1;g<a.length;g++)if(a[g].trim()==="---"){m=g+2;break}}v.executeEdits("insert-header",[{range:new te.Range(m,h,m,h),text:n}]),setTimeout(()=>{v.setSelection(new te.Selection(m,3,m,17)),v.focus()},50)},u=()=>{const n=`

<div data-pdf-footer="true">

---

<div style="display: flex; justify-content: space-between; margin-top: 20px;">
  <div>
    <strong>SIGNATURE</strong><br>
    <span style="color: #666;">Document Name</span>
  </div>
  <div style="text-align: right;">
    <strong>CLIENT</strong><br>
    <span style="color: #666;">${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</span>
  </div>
</div>

</div>
`,s=v.getModel(),i=s.getLineCount(),a=s.getLineContent(i),m=i,h=a.length+1;v.executeEdits("insert-footer",[{range:new te.Range(m,h,m,h),text:n}]);const g=i+6;setTimeout(()=>{v.setSelection(new te.Selection(g,13,g,22)),v.revealLineInCenter(g),v.focus()},50)},A=()=>{const e=document.querySelectorAll(".dropdown");e.forEach(n=>{const s=n.querySelector(".dropdown-content");if(!s)return;let i=!1,a=null;n.addEventListener("mouseenter",()=>{clearTimeout(a),i=!0,s.style.display="block"}),s.addEventListener("mouseenter",()=>{clearTimeout(a),i=!0});const m=()=>{a=setTimeout(()=>{i&&(i=!1,s.style.display="none")},150)};n.addEventListener("mouseleave",h=>{const g=n.getBoundingClientRect();(h.clientX<g.left||h.clientX>g.right||h.clientY<g.top||h.clientY>g.bottom)&&m()}),s.addEventListener("mouseleave",h=>{const g=s.getBoundingClientRect();(h.clientX<g.left||h.clientX>g.right||h.clientY<g.top||h.clientY>g.bottom)&&m()}),n.addEventListener("click",h=>{h.target.closest(".dropdown-content")||(clearTimeout(a),i=!i,s.style.display=i?"block":"none")})}),document.addEventListener("click",n=>{n.target.closest(".dropdown")||e.forEach(s=>{const i=s.querySelector(".dropdown-content");i&&(i.style.display="none")})})},F=!1,ye=()=>{const e=document.querySelector("#cheatsheet-button");if(!e)return;e.addEventListener("click",s=>{s.preventDefault(),Ie()});const n=document.querySelector("#cheatsheet-close-btn");n&&n.addEventListener("click",()=>{Ie()}),ke()},Ie=()=>{F=!F;const e=document.querySelector("#cheatsheet-panel"),n=document.querySelector("#cheatsheet-divider"),s=document.querySelector("#container");F?(e.classList.remove("hidden"),n.classList.remove("hidden"),s.classList.add("cheatsheet-visible")):(e.classList.add("hidden"),n.classList.add("hidden"),s.classList.remove("cheatsheet-visible")),v&&setTimeout(()=>{v.layout()},350)},ke=()=>{const e=document.querySelector("#cheatsheet-content");if(!e)return;const n=[{section:"Headers",items:[{title:"H1 Header",code:"# Header 1",type:"header"},{title:"H2 Header",code:"## Header 2",type:"header"},{title:"H3 Header",code:"### Header 3",type:"header"}]},{section:"Text Formatting",items:[{title:"Bold",code:"**bold text**",type:"inline"},{title:"Italic",code:"*italic text*",type:"inline"},{title:"Bold + Italic",code:"***bold and italic***",type:"inline"},{title:"Strikethrough",code:"~~strikethrough~~",type:"inline"},{title:"Inline Code",code:"`code`",type:"inline"}]},{section:"Lists",items:[{title:"Unordered List",code:`* Item 1
* Item 2
  * Nested item`,type:"block"},{title:"Ordered List",code:`1. First item
2. Second item
3. Third item`,type:"block"},{title:"Task List",code:`- [ ] Unchecked
- [x] Checked`,type:"block"}]},{section:"Links & Images",items:[{title:"Link",code:"[Link Text](https://example.com)",type:"inline"},{title:"Image",code:"![Alt Text](image.jpg)",type:"inline"},{title:"Link with Title",code:'[Link](https://example.com "Title")',type:"inline"}]},{section:"Tables",items:[{title:"Basic Table",code:`| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |
| Cell 3 | Cell 4 |`,type:"block"},{title:"Aligned Table",code:`| Left | Center | Right |
| :--- | :---: | ---: |
| L | C | R |`,type:"block"}]},{section:"Code Blocks",items:[{title:"Code Block",code:"```\ncode here\n```",type:"block"},{title:"Code with Language",code:"```javascript\nconst x = 10;\n```",type:"block"}]},{section:"Quotes & Breaks",items:[{title:"Blockquote",code:`> This is a quote
> Multiple lines`,type:"block"},{title:"Horizontal Rule",code:"---",type:"block"},{title:"Line Break",code:`Line 1  
Line 2`,type:"inline"}]},{section:"Document Structure",items:[{title:"Header with Date",code:`# Document Title

<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">11 Feb 2026</div>

---`,type:"block"},{title:"Footer",code:`---

<div style="display: flex; justify-content: space-between; margin-top: 20px;">
  <div>
    <strong>SIGNATURE</strong><br>
    <span style="color: #666;">Document Name</span>
  </div>
  <div style="text-align: right;">
    <strong>CLIENT</strong><br>
    <span style="color: #666;">11 Feb 2026</span>
  </div>
</div>`,type:"block"}]},{section:"YAML Metadata",items:[{title:"Document Metadata",code:`---
title: Document Title
date: 11 Feb 2026
footer-left: SIGNATURE
footer-right: CLIENT
---`,type:"yaml"}]}];let s="";n.forEach(i=>{s+=`<div class="cheatsheet-section">
                <h4>${i.section}</h4>`,i.items.forEach((a,m)=>{const h=`cheat-${i.section.replace(/\s/g,"-")}-${m}`;s+=`
                <div class="cheatsheet-item">
                    <div class="cheatsheet-item-header">
                        <span class="cheatsheet-item-title">${a.title}</span>
                        <div class="cheatsheet-item-actions">
                            <button class="cheatsheet-insert-btn" data-code="${h}" data-type="${a.type}">Insert</button>
                            <button class="cheatsheet-copy-btn" data-code="${h}">Copy</button>
                        </div>
                    </div>
                    <div class="cheatsheet-code" id="${h}">${a.code.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
                </div>`}),s+="</div>"}),e.innerHTML=s,e.querySelectorAll(".cheatsheet-insert-btn").forEach(i=>{i.addEventListener("click",a=>{const m=a.target.getAttribute("data-code"),h=a.target.getAttribute("data-type"),k=document.getElementById(m).textContent;Be(k,h),a.target.textContent="Inserted!",a.target.classList.add("inserted"),setTimeout(()=>{a.target.textContent="Insert",a.target.classList.remove("inserted")},1500)})}),e.querySelectorAll(".cheatsheet-copy-btn").forEach(i=>{i.addEventListener("click",a=>{const m=a.target.getAttribute("data-code"),g=document.getElementById(m).textContent;navigator.clipboard.writeText(g).then(()=>{a.target.textContent="Copied!",a.target.classList.add("copied"),setTimeout(()=>{a.target.textContent="Copy",a.target.classList.remove("copied")},2e3)}).catch(()=>{a.target.textContent="Failed",setTimeout(()=>{a.target.textContent="Copy"},2e3)})})})},Be=(e,n)=>{if(!v)return;const s=v.getPosition(),i=v.getModel(),a=i.getLineContent(s.lineNumber),m=a.length,h=a.trim()==="",g=s.column===1,k=s.column>m;let f=e,T=s;if(n==="yaml"?(s.lineNumber!==1||!g)&&(T=new te.Position(1,1),(i.getLineCount()>1||!h)&&(f=e+`

`)):n==="block"?h?f=e+`

`:k?f=`

`+e+`

`:g?f=e+`

`:(T=new te.Position(s.lineNumber,m+1),f=`

`+e+`

`):n==="header"?h?f=e+`

`:k?f=`

`+e+`

`:g?f=e+`

`:(T=new te.Position(s.lineNumber,m+1),f=`

`+e+`

`):n==="inline"&&(f=e),v.executeEdits("insert-syntax",[{range:new te.Range(T.lineNumber,T.column,T.lineNumber,T.column),text:f}]),n==="inline")if(e.includes("text")||e.includes("Link")||e.includes("Alt")){const P=new te.Position(T.lineNumber,T.column+e.indexOf("text")>-1?e.indexOf("text"):e.indexOf("Link")>-1?e.indexOf("Link"):e.indexOf("Alt")>-1?e.indexOf("Alt"):0);v.setPosition(P)}else v.setPosition(new te.Position(T.lineNumber,T.column+e.length));else{f.split(`
`);const P=T.lineNumber+(f.startsWith(`

`)?2:0);v.setPosition(new te.Position(P,1))}v.focus()},ot=()=>{const e=v.getModel(),n=v.getPosition(),s=e.getLineContent(n.lineNumber);let i=n.lineNumber,a=1,m="";s.trim()!==""?(i=n.lineNumber+1,m=`
<div style="page-break-after: always;"></div>

`):m=`<div style="page-break-after: always;"></div>

`,v.executeEdits("insert-break",[{range:new te.Range(i,a,i,a),text:m}]);const h=i+(s.trim()!==""?3:2);setTimeout(()=>{v.setPosition({lineNumber:h,column:1}),v.focus()},50)},it=!1,Et=[],$e=()=>{const e=document.querySelector("#toc-checkbox");if(!e)return;const n=es();n!=null&&n!==!1&&(o=n,e.checked=n,setTimeout(()=>{n&&Bt()},500)),e.addEventListener("change",i=>{o=i.currentTarget.checked,Co(o),Bt()});const s=document.querySelector("#toc-close-btn");s&&s.addEventListener("click",()=>{o=!1,e.checked=!1,Co(!1),Bt()})},Bt=()=>{it=o;const e=document.querySelector("#toc-panel"),n=document.querySelector("#container");it?(e.classList.remove("hidden"),n.classList.add("toc-visible"),To()):(e.classList.add("hidden"),n.classList.remove("toc-visible")),v&&setTimeout(()=>{v.layout()},350)},En=()=>{const e=document.querySelector("#validation-checkbox"),n=document.querySelector("#export-validation-link");if(!e)return;const s=Ni();s!=null&&(e.checked=s,v&&v._setValidationEnabled&&v._setValidationEnabled(s),n&&(n.style.display=s?"block":"none")),e.addEventListener("change",i=>{const a=i.currentTarget.checked;Oi(a),v&&v._setValidationEnabled&&v._setValidationEnabled(a),n&&(n.style.display=a?"block":"none")})},yt=!1;const Eo="edit_mode",Mi=()=>xe.getItem(M,Eo)===!0,Ri=e=>{xe.setItem(M,Eo,e)};let Bi=()=>{const e=document.querySelector("#edit-mode-checkbox");e&&(yt=Mi(),e.checked=yt,yt&&document.documentElement.classList.add("edit-mode-active"),e.addEventListener("change",n=>{yt=n.currentTarget.checked,Ri(yt),yt?(document.documentElement.classList.add("edit-mode-active"),So()):(document.documentElement.classList.remove("edit-mode-active"),Pi())}))},Yt=null;window.TurndownService&&(Yt=new window.TurndownService({headingStyle:"atx",bulletListMarker:"-",codeBlockStyle:"fenced"}));const Di=e=>{if(!Yt||!v)return;const n=e.getAttribute("data-source-line");if(!n)return;const s=parseInt(n,10);if(isNaN(s))return;const i=e.innerHTML;let a=Yt.turndown(i);const m=e.tagName.toLowerCase();if(m.match(/^h[1-6]$/)){const T=parseInt(m[1],10),P="#".repeat(T);a.startsWith(P)||(a=`${P} ${a}`)}m==="blockquote"&&(a=a.split(`
`).map(P=>P.startsWith(">")?P:`> ${P}`).join(`
`));const h=v.getModel();if(!h)return;const g=h.getLineContent(s),f={range:new te.Range(s,1,s,g.length+1),text:a};h.pushEditOperations([],[f],()=>null)},So=()=>{const e=document.querySelector("#output");if(!e)return;e.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, blockquote").forEach(s=>{s.setAttribute("contenteditable","true");const i=a=>{Di(a.target)};s._editModeInputHandler=i,s.addEventListener("input",i),s.setAttribute("data-original-html",s.innerHTML)})},Pi=()=>{const e=document.querySelector("#output");if(!e)return;e.querySelectorAll('[contenteditable="true"]').forEach(s=>{s.removeAttribute("contenteditable"),s.removeAttribute("data-original-html"),s._editModeInputHandler&&(s.removeEventListener("input",s._editModeInputHandler),delete s._editModeInputHandler)})};let Ni=()=>{let e=xe.getItem(M,Se);return e===null?!0:e},Oi=e=>{let n=new Date(2099,1,1);xe.setItem(M,Se,e,n)},Fi=()=>{const n=(v?v.getValue():"").split(`
`),s=[];let i=!1,a=!1;return n.forEach((m,h)=>{if(h===0&&m.trim()==="---"){a=!0;return}if(a&&m.trim()==="---"){a=!1;return}if(a)return;if(m.trim().startsWith("```")){i=!i;return}if(i)return;const k=m.replace(/\r$/,"").match(/^(#{1,6})\s*(.+)$/);if(k){const f=k[1].length,T=k[2].trim();if(!T)return;const P=T.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");s.push({level:f,text:T,id:P,line:h+1})}}),s},To=()=>{if(!it)return;const e=document.querySelector("#toc-content");if(!e)return;if(Et=Fi(),Et.length===0){e.innerHTML='<div class="toc-empty">No headings found in document</div>';return}const n=a=>{const m={children:[],level:0},h=[m];return a.forEach(g=>{const k={...g,children:[]};for(;h.length>1&&h[h.length-1].level>=g.level;)h.pop();h[h.length-1].children.push(k),h.push(k)}),m.children},s=(a,m=0)=>{if(!a||a.length===0)return"";let h='<ul class="toc-tree-list">';return a.forEach(g=>{const k=g.children&&g.children.length>0,f=k?`<button class="toc-collapse-btn" data-collapsed="false" aria-label="Collapse">
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toc-icon toc-icon-minus">
                           <circle cx="12" cy="12" r="10"></circle>
                           <line x1="8" y1="12" x2="16" y2="12"></line>
                         </svg>
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toc-icon toc-icon-plus" style="display: none;">
                           <circle cx="12" cy="12" r="10"></circle>
                           <line x1="12" y1="8" x2="12" y2="16"></line>
                           <line x1="8" y1="12" x2="16" y2="12"></line>
                         </svg>
                       </button>`:'<span class="toc-spacer"></span>';h+=`<li class="toc-tree-item toc-h${g.level}" data-level="${g.level}">
                    <div class="toc-item-row">
                        ${f}
                        <a href="#" class="toc-link" data-line="${g.line}" data-id="${g.id}">
                            ${g.text}
                        </a>
                    </div>`,k&&(h+=`<div class="toc-children">${s(g.children,g.level)}</div>`),h+="</li>"}),h+="</ul>",h},i=n(Et);e.innerHTML=s(i),e.querySelectorAll(".toc-link").forEach(a=>{a.addEventListener("click",m=>{m.preventDefault();const h=parseInt(m.target.getAttribute("data-line"));v&&h&&(v.setPosition({lineNumber:h,column:1}),v.revealLineInCenter(h),v.focus(),e.querySelectorAll(".toc-link").forEach(g=>g.classList.remove("active")),m.target.classList.add("active"))})}),e.querySelectorAll(".toc-collapse-btn").forEach(a=>{a.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation();const h=a.getAttribute("data-collapsed")==="true",k=a.closest(".toc-tree-item").querySelector(":scope > .toc-children"),f=a.querySelector(".toc-icon-minus"),T=a.querySelector(".toc-icon-plus");h?(a.setAttribute("data-collapsed","false"),k.style.maxHeight=k.scrollHeight+"px",f.style.display="block",T.style.display="none",setTimeout(()=>{a.getAttribute("data-collapsed")==="false"&&(k.style.maxHeight="none")},300)):(k.style.maxHeight=k.scrollHeight+"px",k.offsetHeight,k.style.maxHeight="0",a.setAttribute("data-collapsed","true"),f.style.display="none",T.style.display="block")})})},zi=()=>xe.getItem(M,U),Hi=e=>{let n=new Date(2099,1,1);xe.setItem(M,U,e,n)},Wi=()=>xe.getItem(M,G),qi=()=>{let e=xe.getItem(M,ie);if(e==null)try{const n=localStorage.getItem("com.markdownlivepreview_theme");if(n==="dark")return!0;if(n==="light")return!1}catch{}return e},Ui=e=>{let n=new Date(2099,1,1);xe.setItem(M,G,e,n)},Vi=()=>xe.getItem(M,le),ji=e=>{let n=new Date(2099,1,1);xe.setItem(M,le,e,n)},Gi=e=>{let n=new Date(2099,1,1);xe.setItem(M,ie,e,n);try{localStorage.setItem("com.markdownlivepreview_theme",e?"dark":"light")}catch{}},Yi=()=>xe.getItem(M,Le)||"github",Ki=e=>{let n=new Date(2099,1,1);xe.setItem(M,Le,e,n);try{localStorage.setItem("com.markdownlivepreview.style_settings",e)}catch{}},Xi=()=>xe.getItem(M,Q)||!1,Zi=e=>{let n=new Date(2099,1,1);xe.setItem(M,Q,e,n)},Ji=()=>xe.getItem(M,X)||!1,Qi=e=>{let n=new Date(2099,1,1);xe.setItem(M,X,e,n)},es=()=>xe.getItem(M,ve)||!1,Co=e=>{let n=new Date(2099,1,1);xe.setItem(M,ve,e,n)},ts=()=>{let e=.5,n=.5;const s=document.getElementById("split-divider"),i=document.getElementById("edit"),a=document.getElementById("preview"),m=document.getElementById("container");if(!s||!i||!a)return;const h=()=>m.classList.contains("vertical"),g=()=>m.classList.contains("flipped"),k=()=>m.getBoundingClientRect().width,f=()=>m.getBoundingClientRect().height;s.addEventListener("mouseenter",()=>{s.classList.add("hover")}),s.addEventListener("mouseleave",()=>{s.classList.remove("hover")}),s.addEventListener("mousedown",T=>{T.preventDefault();const P=s.getBoundingClientRect(),R=m.getBoundingClientRect(),N=h();let D,z,O;N?(g()?z=a.offsetHeight:z=i.offsetHeight,O=P.top-R.top):(g()?D=a.offsetWidth:D=i.offsetWidth,O=P.left-R.left),d={divider:s,leftPane:g()?a:i,rightPane:g()?i:a,container:m,lastLeftRatio:e,lastTopRatio:n,isVertical:N,isFlipped:g(),getAvailableWidth:k,getAvailableHeight:f,initialLeftWidth:D||0,initialTopHeight:z||0,initialDividerX:N?0:O,initialDividerY:N?O:0},document.body.classList.add("dragging"),s.classList.add("active"),d.isVertical?document.body.style.cursor="row-resize":document.body.style.cursor="col-resize"}),s.addEventListener("dblclick",()=>{if(h()){const T=f(),P=s.offsetHeight,R=(T-P)/2;i.style.height=R+"px",a.style.height=R+"px",i.style.width="",a.style.width=""}else{const T=k(),P=s.offsetWidth,R=(T-P)/2;i.style.width=R+"px",a.style.width=R+"px",i.style.height="",a.style.height=""}})},ns=()=>{let e=300;const n=document.getElementById("cheatsheet-divider"),s=document.querySelector(".cheatsheet-pane"),i=document.getElementById("container");if(!n||!s)return;const a=()=>i.getBoundingClientRect().width;n.addEventListener("mouseenter",()=>{n.classList.add("hover")}),n.addEventListener("mouseleave",()=>{n.classList.remove("hover")}),n.addEventListener("mousedown",m=>{m.preventDefault();const h=n.getBoundingClientRect(),g=i.getBoundingClientRect(),k=s.offsetWidth;d={divider:n,leftPane:s,rightPane:null,container:i,lastLeftRatio:e/a(),lastTopRatio:0,isVertical:!1,isFlipped:!1,getAvailableWidth:a,getAvailableHeight:()=>0,initialLeftWidth:k,initialDividerX:h.left-g.left},document.body.classList.add("dragging"),n.classList.add("active"),document.body.style.cursor="col-resize"})},Ao=zi();v=_(),window.editor=v,mt(Ao||$),I(v.getValue()),v.addCommand(te.KeyMod.CtrlCmd|te.KeyCode.KeyZ,()=>{C()}),v.addCommand(te.KeyMod.CtrlCmd|te.KeyMod.Shift|te.KeyCode.KeyZ,()=>{x()}),v.addCommand(te.KeyMod.CtrlCmd|te.KeyCode.KeyY,()=>{x()});let Io;v.onDidChangeModelContent(()=>{E||(clearTimeout(Io),Io=setTimeout(()=>{const e=v.getValue();(p.length===0||p[L]!==e)&&I(e)},300))}),Mt(),Rt(),Gn(v),Xn(),mn(),jt(),Lt(),hn(),Yn(),Kn(v),Ee(v),bt(),yn(),nt(),xn(),kn(),vn(),A(),ye(),$e(),En(),Bi();const $o=document.querySelector("#autofix-validation-link"),_o=document.querySelector("#export-validation-link");$o?$o.addEventListener("click",e=>{e.preventDefault(),console.log("[DEBUG] Autofix link clicked");const n=document.querySelector("#validation-checkbox");n&&!n.checked&&(n.checked=!0,n.dispatchEvent(new Event("change")),console.log("[DEBUG] Validation auto-enabled")),console.log("[DEBUG] Editor exists:",!!v),console.log("[DEBUG] _interactiveFixWizard exists:",!!(v&&v._interactiveFixWizard)),v&&v._interactiveFixWizard?(console.log("[DEBUG] Calling _interactiveFixWizard"),v._interactiveFixWizard()):console.error("[DEBUG] Cannot call _interactiveFixWizard - editor or function not available")}):console.error("[DEBUG] Autofix link not found in DOM"),_o&&_o.addEventListener("click",e=>{if(e.preventDefault(),console.log("[DEBUG] Export validation link clicked"),v&&v._exportValidationErrors){const n=v._exportValidationErrors();navigator.clipboard.writeText(n).then(()=>{me("Validation report copied to clipboard!")}).catch(s=>{console.error("Failed to copy:",s),me("Failed to copy report")})}}),setTimeout(()=>{const e=document.querySelector("#validation-checkbox"),n=document.querySelector("#export-validation-link");e&&e.checked&&n&&(n.style.display="block")},100),Vt();let os=Wi()||!1;vt(os);let Sn=Vi();Sn==null&&(Sn=!0),et(Sn);let Dt=localStorage.getItem("com.markdownlivepreview.word_wrap");Dt===null?Dt=!0:Dt=Dt==="true";const Zn=document.querySelector("#word-wrap-checkbox");Zn&&(Zn.checked=Dt,v.updateOptions({wordWrap:Dt?"on":"off"}),Zn.addEventListener("change",e=>{const n=e.currentTarget.checked;v.updateOptions({wordWrap:n?"on":"off"}),localStorage.setItem("com.markdownlivepreview.word_wrap",n)}));let is=bn();ut(is),Y();let Kt=qi();document.getElementById("status-pdf-estimate").addEventListener("click",()=>{const e=parseInt(document.getElementById("status-word-count").textContent),n=Math.max(1,Math.ceil(e/500)),s=`PDF Page Estimate

Based on approximately 500 words per page:
${e} words ≈ ${n} page${n!==1?"s":""}

Note: Actual page count may vary based on:
• Font size and family
• Line height
• Images and tables
• Margins and spacing`;alert(s)}),S();const Mo="paper_layout_settings",Ro="page_setup_settings",ss=()=>{try{const e=localStorage.getItem(`${M}.${Mo}`);if(e){const n=JSON.parse(e);r=n.layout||"web",l=n.zoom||100}}catch(e){console.error("Failed to load paper layout settings:",e)}},Bo=()=>{try{const e=localStorage.getItem(`${M}.${Ro}`);e&&(c=JSON.parse(e))}catch(e){console.error("Failed to load page setup settings:",e)}return{pageSize:"A4",pageOrientation:"portrait",margins:{top:(c.marginTop||2.54)*10,right:(c.marginRight||2.54)*10,bottom:(c.marginBottom||2.54)*10,left:(c.marginLeft||2.54)*10}}},rs=()=>{try{localStorage.setItem(`${M}.${Ro}`,JSON.stringify(c))}catch(e){console.error("Failed to save page setup settings:",e)}},Xt=()=>{try{const e={layout:r,zoom:l};localStorage.setItem(`${M}.${Mo}`,JSON.stringify(e))}catch(e){console.error("Failed to save paper layout settings:",e)}},Tn=()=>{const e=document.querySelector(".preview-pane"),n=document.querySelector(".paper-controls"),s=document.getElementById("status-layout-mode"),i=document.querySelector("#output");if(r==="paper"?(e&&e.classList.add("paper-layout"),n&&n.classList.add("visible"),s&&(s.textContent="Paper Layout"),i&&(i.classList.add("paper-layout-active"),K())):(e&&e.classList.remove("paper-layout"),n&&n.classList.remove("visible"),s&&(s.textContent="Web Layout"),i&&i.classList.remove("paper-layout-active")),v){const a=v.getValue();re(a)}},as=()=>{l<200&&(l+=10,K(),Xt())},ls=()=>{l>50&&(l-=10,K(),Xt())},cs=()=>{const e=document.querySelector(".preview-pane");if(!e)return;const n=e.clientWidth,s=c.width*37.795275591,a=(n-40)/s*100;l=Math.max(50,Math.min(200,Math.round(a))),K(),Xt()},ds=()=>{l=100,K(),Xt()},us=()=>{r=r==="web"?"paper":"web",Xt(),Tn()},ps=()=>{const e=document.getElementById("page-setup-modal");e&&(document.getElementById("page-width").value=c.width,document.getElementById("page-height").value=c.height,document.getElementById("margin-top").value=c.marginTop,document.getElementById("margin-bottom").value=c.marginBottom,document.getElementById("margin-left").value=c.marginLeft,document.getElementById("margin-right").value=c.marginRight,e.classList.add("visible"))},Cn=()=>{const e=document.getElementById("page-setup-modal");e&&e.classList.remove("visible")},gs=()=>{c.width=parseFloat(document.getElementById("page-width").value)||21,c.height=parseFloat(document.getElementById("page-height").value)||29.7,c.marginTop=parseFloat(document.getElementById("margin-top").value)||4.5,c.marginBottom=parseFloat(document.getElementById("margin-bottom").value)||2.54,c.marginLeft=parseFloat(document.getElementById("margin-left").value)||2.54,c.marginRight=parseFloat(document.getElementById("margin-right").value)||1.47,rs(),Cn(),r==="paper"&&Tn()},ms=()=>{const e=document.querySelector('.status-item[title="Layout mode"]');e&&(e.classList.add("clickable"),e.addEventListener("click",us),e.title="Click to toggle between Web and Paper layout"),document.body.insertAdjacentHTML("beforeend",`
            <div class="paper-controls">
                <button class="paper-control-btn" id="paper-zoom-out" title="Zoom Out (-)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                </button>
                <button class="paper-control-btn" id="paper-zoom-in" title="Zoom In (+)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                </button>
                <div class="paper-zoom-label">100%</div>
                <div class="paper-control-separator"></div>
                <button class="paper-control-btn" id="paper-fit-width" title="Fit to Width">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="5 9 2 12 5 15"></polyline>
                        <polyline points="9 5 12 2 15 5"></polyline>
                        <polyline points="15 19 12 22 9 19"></polyline>
                        <polyline points="19 9 22 12 19 15"></polyline>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <line x1="12" y1="2" x2="12" y2="22"></line>
                    </svg>
                </button>
                <button class="paper-control-btn" id="paper-reset-zoom" title="Actual Size (100%)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                    </svg>
                </button>
                <div class="paper-control-separator"></div>
                <button class="paper-control-btn" id="paper-page-setup" title="Page Setup">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                </button>
            </div>
        `),document.getElementById("paper-zoom-in").addEventListener("click",as),document.getElementById("paper-zoom-out").addEventListener("click",ls),document.getElementById("paper-fit-width").addEventListener("click",cs),document.getElementById("paper-reset-zoom").addEventListener("click",ds),document.getElementById("paper-page-setup").addEventListener("click",ps)};setTimeout(()=>{ss(),Bo(),ms(),Tn(),document.body.insertAdjacentHTML("beforeend",`
            <div class="page-setup-modal" id="page-setup-modal">
                <div class="page-setup-modal-content">
                    <div class="page-setup-modal-header">
                        <h3>Page Setup</h3>
                        <button class="page-setup-modal-close" id="page-setup-close-btn">�</button>
                    </div>
                    <div class="page-setup-modal-body">
                        <div class="page-setup-section">
                            <label>Paper Size (cm)</label>
                            <div class="page-setup-row">
                                <div class="page-setup-field">
                                    <label>Width</label>
                                    <input type="number" id="page-width" step="0.1" min="10" max="50">
                                </div>
                                <div class="page-setup-field">
                                    <label>Height</label>
                                    <input type="number" id="page-height" step="0.1" min="10" max="50">
                                </div>
                            </div>
                        </div>
                        <div class="page-setup-section">
                            <label>Margins (cm)</label>
                            <div class="page-setup-row">
                                <div class="page-setup-field">
                                    <label>Top</label>
                                    <input type="number" id="margin-top" step="0.1" min="0" max="10">
                                </div>
                                <div class="page-setup-field">
                                    <label>Bottom</label>
                                    <input type="number" id="margin-bottom" step="0.1" min="0" max="10">
                                </div>
                            </div>
                            <div class="page-setup-row">
                                <div class="page-setup-field">
                                    <label>Left</label>
                                    <input type="number" id="margin-left" step="0.1" min="0" max="10">
                                </div>
                                <div class="page-setup-field">
                                    <label>Right</label>
                                    <input type="number" id="margin-right" step="0.1" min="0" max="10">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="page-setup-modal-footer">
                        <button class="page-setup-btn-cancel" id="page-setup-cancel-btn">Cancel</button>
                        <button class="page-setup-btn-save" id="page-setup-save-btn">Apply</button>
                    </div>
                </div>
            </div>
        `),document.getElementById("page-setup-close-btn").addEventListener("click",Cn),document.getElementById("page-setup-cancel-btn").addEventListener("click",Cn),document.getElementById("page-setup-save-btn").addEventListener("click",gs),document.getElementById("page-setup-modal").addEventListener("click",n=>{n.target.id==="page-setup-modal"&&Cn()}),Tn()},100);const Do="versions",Po="autosave_config",No=15;let be=[],Jn=null,Ke={enabled:!0,intervalMinutes:10};const hs=()=>{try{const e=localStorage.getItem(`${M}.${Do}`);e&&(be=JSON.parse(e),be.forEach(n=>n.timestamp=new Date(n.timestamp)),Zt())}catch(e){console.error("Failed to load versions:",e),be=[]}},fs=()=>{try{const e=localStorage.getItem(`${M}.${Po}`);e&&(Ke=JSON.parse(e))}catch(e){console.error("Failed to load autosave config:",e)}},bs=()=>{try{localStorage.setItem(`${M}.${Po}`,JSON.stringify(Ke))}catch(e){console.error("Failed to save autosave config:",e)}},Qn=()=>{try{localStorage.setItem(`${M}.${Do}`,JSON.stringify(be))}catch(e){console.error("Failed to save versions:",e)}},An=()=>{const e=v.getValue();if(be.length>0&&be[0].content===e){console.log("No changes detected, skipping version save");return}const n=e.trim()?e.trim().split(/\s+/).length:0,s=new Date,i={id:Date.now(),content:e,timestamp:s,words:n,preview:e.substring(0,100)+(e.length>100?"...":""),title:""};console.log("Saving version:",{id:i.id,contentLength:e.length,preview:i.preview,totalVersions:be.length+1}),be.unshift(i),be.length>No&&(be=be.slice(0,No)),Qn(),Zt(),S(),Bn(),eo()},pt=e=>{const s=new Date-e,i=Math.floor(s/6e4),a=Math.floor(s/36e5),m=Math.floor(s/864e5);return i<1?"Just now":i<60?`${i} min ago`:a<24?`${a} hour${a>1?"s":""} ago`:m<7?`${m} day${m>1?"s":""} ago`:e.toLocaleDateString()+" "+e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},eo=()=>{const e=document.getElementById("status-save-indicator");if(e)if(be.length>0){const n=be[0],s=pt(n.timestamp);e.textContent=`Saved ${s}`}else e.textContent="Not saved"},Zt=(e="")=>{const n=document.getElementById("version-history-list"),s=document.getElementById("status-versions-count"),i=document.getElementById("total-versions-display");if(s&&(s.textContent=be.length),i&&(i.textContent=be.length),!n)return;if(be.length===0){n.innerHTML='<p class="version-empty-state">No versions saved yet. Versions are auto-saved every 10 minutes.</p>';return}const a=e.trim()===""?be:be.filter(m=>{const h=m.title||"",g=pt(m.timestamp),k=m.preview||"",f=e.toLowerCase();return h.toLowerCase().includes(f)||g.toLowerCase().includes(f)||k.toLowerCase().includes(f)});if(a.length===0){n.innerHTML='<p class="version-empty-state">No versions match your search.</p>';return}n.innerHTML=a.map(m=>`
            <div class="version-item" data-version-id="${m.id}">
                <div class="version-header">
                    <div class="version-title-container">
                        ${m.title?`<input type="text" class="version-title-input" value="${J(m.title)}" data-version-id="${m.id}" />`:`<input type="text" class="version-title-input" placeholder="${pt(m.timestamp)}" data-version-id="${m.id}" />`}
                        <button class="version-save-title-btn" data-version-id="${m.id}" title="Save title">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                ${m.title?"":`<div class="version-timestamp-small">${pt(m.timestamp)}</div>`}
                <div class="version-meta">
                    <span>${m.words} words</span>
                    <span>${Math.ceil(m.words/500)} pages</span>
                </div>
                <div class="version-preview">${J(m.preview)}</div>
                <div class="version-actions">
                    <button class="version-btn" onclick="window.previewVersion(${m.id})">Preview</button>
                    <button class="version-btn" onclick="window.compareVersion(${m.id})">Compare</button>
                    <button class="version-btn restore" onclick="window.restoreVersion(${m.id})">Restore</button>
                    <button class="version-btn" onclick="window.deleteVersion(${m.id})">Delete</button>
                </div>
            </div>
        `).join("")};window.restoreVersion=e=>{const n=be.find(s=>s.id===e);if(n){v.setValue(n.content),$n();const s=document.getElementById("version-history-panel");s&&s.classList.remove("visible")}};let In=null;const ys=(e,n,s)=>{const i=document.getElementById("confirm-dialog"),a=document.getElementById("confirm-dialog-title"),m=document.getElementById("confirm-dialog-message");a&&(a.textContent=e),m&&(m.textContent=n),In=s,i&&i.classList.add("visible")},to=()=>{const e=document.getElementById("confirm-dialog");e&&e.classList.remove("visible"),In=null};window.deleteVersion=e=>{ys("Delete Version","Are you sure you want to delete this version? This action cannot be undone.",()=>{be=be.filter(n=>n.id!==e),Qn(),Zt(),S(),Bn(),to()})},window.saveVersionTitle=e=>{const n=document.querySelector(`.version-title-input[data-version-id="${e}"]`);if(!n)return;const s=be.find(a=>a.id===e);if(!s)return;const i=n.value.trim();s.title=i,Qn(),Zt()},window.previewVersion=e=>{const n=be.find(k=>k.id===e);if(!n)return;const s=document.getElementById("version-modal-title"),i=document.getElementById("version-modal-body"),a=document.getElementById("version-modal-restore-btn"),m=document.getElementById("version-modal-toggle-btn");let h=!1;const g=()=>{const k=n.title||pt(n.timestamp);if(s&&(s.innerHTML=`
                    <div style="font-size: 16px; font-weight: 600; color: inherit;">${k}</div>
                    <div style="font-size: 12px; color: #64748b; font-weight: normal; margin-top: 4px;">
                        ${n.words} words • ${Math.ceil(n.words/500)} pages • Saved ${pt(n.timestamp)}
                    </div>
                `),m&&(m.style.display="block",m.textContent=h?"Show Formatted":"Show Raw",m.onclick=()=>{h=!h,g()}),i)if(h)i.innerHTML=`
                        <pre style="margin: 0; padding: 20px; font-family: 'Courier New', monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word;" class="raw-markdown-view">${J(n.content)}</pre>
                    `;else{const f=de.parse(n.content),T=zn.sanitize(f);i.innerHTML=`
                        <div class="markdown-body" style="padding: 20px;">
                            ${T}
                        </div>
                    `}};g(),a&&(a.style.display="block",a.onclick=()=>{window.restoreVersion(e)}),zo()},window.compareVersion=e=>{const n=be.find(P=>P.id===e);if(!n)return;const s=v.getValue(),i=n.content,a=s.trim()?s.trim().split(/\s+/).length:0;console.log("Comparing versions:",{versionId:e,currentLength:s.length,versionLength:i.length,areSame:s===i,currentPreview:s.substring(0,50),versionPreview:i.substring(0,50)});const m=document.getElementById("version-modal-title"),h=document.getElementById("version-modal-body"),g=document.getElementById("version-modal-restore-btn"),k=document.getElementById("version-modal-toggle-btn");let f=!1;const T=()=>{const P=n.title||pt(n.timestamp);if(m&&(m.innerHTML=`
                    <div style="font-size: 16px; font-weight: 600; color: inherit;">Compare: ${P}</div>
                    <div style="display: flex; gap: 20px; font-size: 12px; color: #64748b; font-weight: normal; margin-top: 4px;">
                        <span>Current: ${a} words • ${Math.ceil(a/500)} pages</span>
                        <span>Version: ${n.words} words • ${Math.ceil(n.words/500)} pages • Saved ${pt(n.timestamp)}</span>
                    </div>
                `),k&&(k.style.display="block",k.textContent=f?"Show Formatted":"Show Raw Diff",k.onclick=()=>{f=!f,T()}),h)if(f)h.innerHTML=`
                        <div class="version-compare-view">
                            <div class="compare-pane">
                                <div class="compare-pane-header">Current Version</div>
                                <pre class="compare-pane-content raw-markdown-view" style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 16px;">${Oo(s,i,"current")}</pre>
                            </div>
                            <div class="compare-pane">
                                <div class="compare-pane-header">Saved Version</div>
                                <pre class="compare-pane-content raw-markdown-view" style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 16px;">${Oo(i,s,"version")}</pre>
                            </div>
                        </div>
                    `;else{const R=s.split(`
`),N=i.split(`
`),D=Fo(R,N),z=new Set,O=new Set;let W=0,ce=0,Ce=0;for(;W<R.length||ce<N.length;)Ce<D.length&&W<R.length&&ce<N.length&&R[W]===D[Ce]&&N[ce]===D[Ce]?(W++,ce++,Ce++):W<R.length&&(Ce>=D.length||R[W]!==D[Ce])?(z.add(W),W++):ce<N.length&&(O.add(ce),ce++);const De=(Jt,he,Ae)=>{const We=Jt.split(`
`);let _e="",st=!1;const Tt=Ae?"diff-added-block":"diff-removed-block";We.forEach((Nt,Qt)=>{he.has(Qt)?(st||(_e+=`<div class="${Tt}">`,st=!0),_e+=Nt+`
`):(st&&(_e+="</div>",st=!1),_e+=Nt+`
`)}),st&&(_e+="</div>");const Pn=de.parse(_e);return zn.sanitize(Pn)},Xe=De(s,z,!0),je=De(i,O,!1);h.innerHTML=`
                        <div class="version-compare-view">
                            <div class="compare-pane">
                                <div class="compare-pane-header">Current Version</div>
                                <div class="compare-pane-content markdown-body" style="padding: 16px;">
                                    ${Xe}
                                </div>
                            </div>
                            <div class="compare-pane">
                                <div class="compare-pane-header">Saved Version</div>
                                <div class="compare-pane-content markdown-body" style="padding: 16px;">
                                    ${je}
                                </div>
                            </div>
                        </div>
                    `}};T(),g&&(g.style.display="block",g.onclick=()=>{window.restoreVersion(e)}),zo()};const Oo=(e,n,s)=>{const i=e.split(`
`),a=n.split(`
`),m=Fo(i,a);let h="",g=0,k=0,f=0;for(;g<i.length||k<a.length;)f<m.length&&g<i.length&&k<a.length&&i[g]===m[f]&&a[k]===m[f]?(h+=J(i[g])+`
`,g++,k++,f++):s==="current"?g<i.length&&(f>=m.length||i[g]!==m[f])?(h+=`<span class="diff-added">${J(i[g])}</span>
`,g++):k++:k<a.length&&(f>=m.length||a[k]!==m[f])?(h+=`<span class="diff-removed">${J(a[k])}</span>
`,k++):g++;return h||J(s==="current"?e:n)},Fo=(e,n)=>{const s=e.length,i=n.length,a=Array(s+1).fill(null).map(()=>Array(i+1).fill(0));for(let k=1;k<=s;k++)for(let f=1;f<=i;f++)e[k-1]===n[f-1]?a[k][f]=a[k-1][f-1]+1:a[k][f]=Math.max(a[k-1][f],a[k][f-1]);const m=[];let h=s,g=i;for(;h>0&&g>0;)e[h-1]===n[g-1]?(m.unshift(e[h-1]),h--,g--):a[h-1][g]>a[h][g-1]?h--:g--;return m},zo=()=>{const e=document.getElementById("version-modal");e&&e.classList.add("visible")},$n=()=>{const e=document.getElementById("version-modal"),n=document.getElementById("version-modal-restore-btn");e&&e.classList.remove("visible"),n&&(n.style.display="none")},_n=document.getElementById("version-history-panel"),Ho=document.getElementById("version-history-close-btn"),Wo=document.getElementById("status-versions");Wo&&Wo.addEventListener("click",()=>{_n&&_n.classList.toggle("visible")}),Ho&&Ho.addEventListener("click",()=>{_n&&_n.classList.remove("visible")});const St=document.getElementById("autosave-modal"),qo=document.getElementById("version-settings-btn"),Uo=document.getElementById("autosave-modal-close-btn"),Vo=document.getElementById("autosave-cancel-btn"),jo=document.getElementById("autosave-save-btn"),Mn=document.getElementById("autosave-enabled-toggle"),Pt=document.getElementById("autosave-custom-minutes"),vs=()=>{Mn&&(Mn.checked=Ke.enabled),Pt&&(Pt.value=Ke.intervalMinutes),document.querySelectorAll(".interval-btn").forEach(e=>{parseInt(e.dataset.minutes)===Ke.intervalMinutes?e.classList.add("active"):e.classList.remove("active")}),St&&St.classList.add("visible")},Rn=()=>{St&&St.classList.remove("visible")},xs=()=>{Ke.enabled=Mn?Mn.checked:!0;const e=Pt?parseInt(Pt.value):null;if(e&&e>=1)Ke.intervalMinutes=e;else{const n=document.querySelector(".interval-btn.active");n&&(Ke.intervalMinutes=parseInt(n.dataset.minutes))}bs(),Qo(),Rn()};qo&&qo.addEventListener("click",vs),Uo&&Uo.addEventListener("click",Rn),Vo&&Vo.addEventListener("click",Rn),jo&&jo.addEventListener("click",xs),document.querySelectorAll(".interval-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".interval-btn").forEach(n=>n.classList.remove("active")),e.classList.add("active"),Pt&&(Pt.value="")})}),St&&St.addEventListener("click",e=>{e.target===St&&Rn()});const no=document.getElementById("confirm-dialog"),Go=document.getElementById("confirm-cancel-btn"),Yo=document.getElementById("confirm-confirm-btn");Go&&Go.addEventListener("click",to),Yo&&Yo.addEventListener("click",()=>{In&&In()}),no&&no.addEventListener("click",e=>{e.target===no&&to()}),document.addEventListener("click",e=>{if(e.target.closest(".version-save-title-btn")){const n=e.target.closest(".version-save-title-btn"),s=parseInt(n.dataset.versionId);window.saveVersionTitle(s)}});const Ko=document.getElementById("save-version-now-btn");Ko&&Ko.addEventListener("click",()=>{An()});const Xo=document.getElementById("version-search-box");Xo&&Xo.addEventListener("input",e=>{Zt(e.target.value)});const Zo=document.getElementById("version-modal-close-btn"),Jo=document.getElementById("version-modal-cancel-btn"),oo=document.getElementById("version-modal");Zo&&Zo.addEventListener("click",$n),Jo&&Jo.addEventListener("click",$n),oo&&oo.addEventListener("click",e=>{e.target===oo&&$n()});const Qo=()=>{if(Jn&&clearInterval(Jn),!Ke.enabled){Bn();return}const e=Ke.intervalMinutes*60*1e3;Jn=setInterval(()=>{An()},e),Bn()},Bn=()=>{const e=document.getElementById("status-versions");if(!e)return;let n=["Version History",""];if(Ke.enabled)if(n.push("Autosave: Enabled"),n.push(`Interval: ${Ke.intervalMinutes} minutes`),be.length>0){const s=be[0],i=pt(s.timestamp);n.push(`Last saved: ${i}`)}else n.push("No versions saved yet");else n.push("Autosave: Disabled"),n.push('Save manually using "Save Version Now"');e.setAttribute("title",n.join(`
`))};hs(),fs(),Qo(),setTimeout(()=>{be.length===0&&An()},2e3),Kt==="true"||Kt===!0?Kt=!0:Kt=!1;let ws=Yi();wt(ws);let ks=Xi();ht(ks);let Ls=Ji();Ht(Ls),zt(Kt),ts(),ns(),document.addEventListener("mousemove",e=>{if(d)if(e.preventDefault(),d.container.getBoundingClientRect(),d.divider.offsetWidth,d.isVertical){const n=d.getAvailableHeight(),s=d.container.getBoundingClientRect(),i=d.divider.offsetHeight,m=e.clientY-s.top-d.initialDividerY;let h=d.initialTopHeight+m;const g=100,k=n-g-i;h=Math.max(g,Math.min(h,k)),d.isFlipped,d.leftPane.style.height=h+"px",d.rightPane.style.height=n-h-i+"px",d.lastTopRatio=h/(n-i)}else{const n=d.getAvailableWidth(),s=d.container.getBoundingClientRect(),i=d.divider.offsetWidth,a=e.clientX-s.left,m=a-d.initialDividerX;let h=d.initialLeftWidth+m;const g=100,k=n-g-i;if(h=Math.max(g,Math.min(h,k)),d.divider.id==="cheatsheet-divider"){const P=n-a-i,R=Math.max(250,Math.min(P,600));d.leftPane.style.width=R+"px";const N=document.getElementById("split-divider"),D=N?N.offsetWidth:5,z=n-R-i,O=document.getElementById("edit"),W=document.getElementById("preview");if(O&&W){const ce=O.offsetWidth,Ce=W.offsetWidth,De=ce+Ce+D;if(De>0){const Xe=ce/De,je=(z-D)*Xe,Jt=z-D-je;O.style.width=je+"px",W.style.width=Jt+"px"}}d.lastLeftRatio=R/n}else d.isFlipped,d.leftPane.style.width=h+"px",d.rightPane.style.width=n-h-i+"px",d.lastLeftRatio=h/(n-i)}}),document.addEventListener("mouseup",()=>{d&&(d.divider.classList.remove("active"),d.divider.classList.remove("hover"),document.body.style.cursor="default",document.body.classList.remove("dragging"),document.body.style.userSelect="",d=null)}),v.onDidChangeCursorPosition(e=>{const n=e.position.lineNumber;we(n)});const Ve=document.querySelector("#preview");if(Ve){Ve.addEventListener("click",h=>{if(yt){let g=h.target;for(;g&&g!==Ve;){if(g.hasAttribute("contenteditable")&&g.getAttribute("contenteditable")==="true")return;g=g.parentElement}}q(h.target)});let e=!1,n=!1,s=null,i=null,a=null,m=null;v.onDidScrollChange(h=>{n||!w||(e=!0,clearTimeout(s),a&&cancelAnimationFrame(a),a=requestAnimationFrame(()=>{try{const g=v.getVisibleRanges();if(g&&g.length>0){const k=g[0].startLineNumber,f=document.querySelector(`[data-source-line="${k}"]`);if(f){const T=Ve.getBoundingClientRect(),R=f.getBoundingClientRect().top-T.top+Ve.scrollTop;Ve.scrollTo({top:R,behavior:"auto"})}else{const T=h.scrollTop,P=h.scrollHeight,R=v.getLayoutInfo().height,N=P-R,D=N>0?T/N:0,z=(Ve.scrollHeight-Ve.clientHeight)*D;Ve.scrollTo({top:z,behavior:"auto"})}}}catch(g){console.error("Scroll sync error:",g)}a=null}),s=setTimeout(()=>{e=!1},200))}),Ve.addEventListener("scroll",()=>{e||!w||(n=!0,clearTimeout(i),m&&cancelAnimationFrame(m),m=requestAnimationFrame(()=>{const h=Ve.scrollTop,g=Ve.scrollHeight,k=Ve.clientHeight,f=g-k,T=f>0?h/f:0,P=v.getScrollHeight(),R=v.getLayoutInfo().height,D=(P-R)*T;v.setScrollTop(D),m=null}),i=setTimeout(()=>{n=!1},200))})}(()=>{const e=document.getElementById("mofu-nav-trigger"),n=document.getElementById("mofu-canvas"),s=document.getElementById("mofu-features"),i=document.getElementById("mofu-mouth");if(!e||!n||!s||!i)return;let a=!1;const m=()=>{a||(a=!0,n.style.transform="",s.style.transform="",i.classList.add("mofu-mouth-o"),n.classList.add("mofu-jumping"),setTimeout(()=>{n.classList.remove("mofu-jumping"),setTimeout(()=>{n.classList.add("mofu-jumping"),setTimeout(()=>{n.classList.remove("mofu-jumping"),i.classList.remove("mofu-mouth-o"),a=!1},800)},100)},800))},h=()=>{a||(a=!0,n.classList.add("mofu-spinning"),n.classList.add("mofu-copied"),setTimeout(()=>{n.classList.remove("mofu-spinning")},600),setTimeout(()=>{n.classList.remove("mofu-copied"),a=!1},1500))};document.addEventListener("mousemove",P=>{if(a||Re)return;const R=n.getBoundingClientRect(),N=R.left+R.width/2,D=R.top+R.height/2,z=(P.clientX-N)/(window.innerWidth/2),O=(P.clientY-D)/(window.innerHeight/2),W=z*8,ce=O*5,Ce=z*15,De=O*-10;n.style.transform=`rotateX(${De}deg) rotateY(${Ce}deg)`,s.style.transform=`translate3d(${W}px, ${ce}px, 0)`}),e.addEventListener("click",()=>{a||(a=!0,n.style.transform="",s.style.transform="",n.classList.add("mofu-jumping"),setTimeout(()=>{n.classList.remove("mofu-jumping"),a=!1},800))});const g=document.querySelector("#export-button"),k=document.querySelector("#export-html-button");g&&g.addEventListener("click",()=>{setTimeout(m,100)}),k&&k.addEventListener("click",()=>{setTimeout(m,100)});const f=document.querySelector("#copy-button");f&&f.addEventListener("click",()=>{setTimeout(h,100)}),document.addEventListener("copy",P=>{document.activeElement&&document.activeElement.closest("#editor")&&setTimeout(h,100)});const T=document.getElementById("status-save-indicator");T&&(T.style.userSelect="none",T.style.webkitUserSelect="none",T.style.cursor="pointer",T.title="Double-click to save version now",T.addEventListener("dblclick",P=>{P.preventDefault(),P.stopPropagation(),An()}),T.addEventListener("mousedown",P=>{P.preventDefault()}),eo(),setInterval(eo,3e5))})();const Dn=document.getElementById("settings-panel"),ei=document.getElementById("settings-button"),ti=document.querySelectorAll(".settings-tab"),Es=document.querySelectorAll(".settings-tab-content");ei&&ei.addEventListener("click",()=>{Dn.classList.add("visible")});const ni=()=>{Dn.classList.remove("visible")};Dn.querySelector(".settings-panel-overlay").addEventListener("click",ni),document.addEventListener("keydown",e=>{e.key==="Escape"&&Dn.classList.contains("visible")&&ni()}),ti.forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.tab;ti.forEach(s=>s.classList.remove("active")),e.classList.add("active"),Es.forEach(s=>{s.dataset.tabContent===n?s.classList.add("active"):s.classList.remove("active")})})});const oi=document.getElementById("help-button");oi&&oi.addEventListener("click",()=>{window.open("/docs/index.html","_blank")})};window.addEventListener("load",()=>{_r()});
