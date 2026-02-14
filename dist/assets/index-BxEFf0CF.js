var ys=Object.defineProperty;var vs=(k,t,o)=>t in k?ys(k,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):k[t]=o;var ae=(k,t,o)=>vs(k,typeof t!="symbol"?t+"":t,o);import*as se from"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const d of c.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function o(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(l){if(l.ep)return;l.ep=!0;const c=o(l);fetch(l.href,c)}})();const qe=class qe{};ae(qe,"localStorage",window.localStorage),ae(qe,"sessionStorage",window.sessionStorage),ae(qe,"createKey",function(t,o){return this.getMD5Hash([t,o].join("-"))}),ae(qe,"getItem",function(t,o){var s=this.createKey(t,o),l=JSON.parse(sessionStorage.getItem(s))||JSON.parse(localStorage.getItem(s));if(l){var c=l.value,d=Number(l.expire),p=new Date().getTime();if(d){if(d>p)return c;deleteItem(t,o)}else return c}}),ae(qe,"setItem",function(t,o,s,l){var c={namespace:t,key:o,value:s};l?(c.expire=l.getTime(),localStorage.setItem(this.createKey(t,o),JSON.stringify(c))):sessionStorage.setItem(this.createKey(t,o),JSON.stringify(c))}),ae(qe,"deleteItem",function(t,o){sessionStorage.removeItem(this.createKey(t,o)),localStorage.removeItem(this.createKey(t,o))}),ae(qe,"getInstance",function(t){return{getItem:function(o){return qe.getItem(t,o)},setItem:function(o,s,l){qe.setItem(t,o,s,l)},deleteItem:function(o){qe.deleteItem(t,o)}}}),ae(qe,"getMD5Hash",function(t){var o=new Array(0,3614090360,3905402710,606105819,3250441966,4118548399,1200080426,2821735955,4249261313,1770035416,2336552879,4294925233,2304563134,1804603682,4254626195,2792965006,1236535329,4129170786,3225465664,643717713,3921069994,3593408605,38016083,3634488961,3889429448,568446438,3275163606,4107603335,1163531501,2850285829,4243563512,1735328473,2368359562,4294588738,2272392833,1839030562,4259657740,2763975236,1272893353,4139469664,3200236656,681279174,3936430074,3572445317,76029189,3654602809,3873151461,530742520,3299628645,4096336452,1126891415,2878612391,4237533241,1700485571,2399980690,4293915773,2240044497,1873313359,4264355552,2734768916,1309151649,4149444226,3174756917,718787259,3951481745),s=new Array(new Array(0,7,1),new Array(1,12,2),new Array(2,17,3),new Array(3,22,4),new Array(4,7,5),new Array(5,12,6),new Array(6,17,7),new Array(7,22,8),new Array(8,7,9),new Array(9,12,10),new Array(10,17,11),new Array(11,22,12),new Array(12,7,13),new Array(13,12,14),new Array(14,17,15),new Array(15,22,16)),l=new Array(new Array(1,5,17),new Array(6,9,18),new Array(11,14,19),new Array(0,20,20),new Array(5,5,21),new Array(10,9,22),new Array(15,14,23),new Array(4,20,24),new Array(9,5,25),new Array(14,9,26),new Array(3,14,27),new Array(8,20,28),new Array(13,5,29),new Array(2,9,30),new Array(7,14,31),new Array(12,20,32)),c=new Array(new Array(5,4,33),new Array(8,11,34),new Array(11,16,35),new Array(14,23,36),new Array(1,4,37),new Array(4,11,38),new Array(7,16,39),new Array(10,23,40),new Array(13,4,41),new Array(0,11,42),new Array(3,16,43),new Array(6,23,44),new Array(9,4,45),new Array(12,11,46),new Array(15,16,47),new Array(2,23,48)),d=new Array(new Array(0,6,49),new Array(7,10,50),new Array(14,15,51),new Array(5,21,52),new Array(12,6,53),new Array(3,10,54),new Array(10,15,55),new Array(1,21,56),new Array(8,6,57),new Array(15,10,58),new Array(6,15,59),new Array(13,21,60),new Array(4,6,61),new Array(11,10,62),new Array(2,15,63),new Array(9,21,64));function p(J,X,ie){return J&X|~J&ie}function w(J,X,ie){return J&ie|X&~ie}function f(J,X,ie){return J^X^ie}function E(J,X,ie){return X^(J|~ie)}var M=new Array(new Array(p,s),new Array(w,l),new Array(f,c),new Array(E,d));function W(J){return String.fromCharCode(J&255)+String.fromCharCode(J>>>8&255)+String.fromCharCode(J>>>16&255)+String.fromCharCode(J>>>24&255)}function j(J){for(;J<0;)J+=4294967296;for(;J>4294967295;)J-=4294967296;return J}function le(J,X,ie,Q,ye){var Te,x,S,I,C,y,b,_,$;Te=Q[0],x=Q[1],S=Q[2],I=Q[3],C=ye[0],y=ye[1],b=ye[2],$=ie(X[x],X[S],X[I]),_=X[Te]+$+J[C]+o[b],_=j(_),_=_<<y|_>>>32-y,_+=X[x],X[Te]=j(_)}function oe(J){var X,ie,Q,ye,Te,x,S,I,C,y,b,_,$;if(Q=new Array(1732584193,4023233417,2562383102,271733878),Te=J.length,x=Te&63,S=x<56?56-x:120-x,S>0)for(J+="",y=0;y<S-1;y++)J+="\0";for(J+=W(Te*8),J+=W(0),Te+=S+8,X=new Array(0,1,2,3),ie=new Array(16),ye=new Array(4),_=0;_<Te;_+=64){for(y=0,b=_;y<16;y++,b+=4)ie[y]=J.charCodeAt(b)|J.charCodeAt(b+1)<<8|J.charCodeAt(b+2)<<16|J.charCodeAt(b+3)<<24;for(y=0;y<4;y++)ye[y]=Q[y];for(y=0;y<4;y++)for(I=M[y][0],C=M[y][1],b=0;b<16;b++)le(ie,ye,I,X,C[b]),$=X[0],X[0]=X[3],X[3]=X[2],X[2]=X[1],X[1]=$;for(y=0;y<4;y++)Q[y]+=ye[y],Q[y]=j(Q[y])}return W(Q[0])+W(Q[1])+W(Q[2])+W(Q[3])}function we(J){var X,ie,Q,ye;for(ye=oe(J),ie="",X=0;X<16;X++)Q=ye.charCodeAt(X),ie+="0123456789abcdef".charAt(Q>>4&15),ie+="0123456789abcdef".charAt(Q&15);return ie}return we(t)});let xe=qe;function go(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}let Ct=go();function gi(k){Ct=k}const on={exec:()=>null};function ue(k,t=""){let o=typeof k=="string"?k:k.source;const s={replace:(l,c)=>{let d=typeof c=="string"?c:c.source;return d=d.replace(Pe.caret,"$1"),o=o.replace(l,d),s},getRegex:()=>new RegExp(o,t)};return s}const Pe={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:k=>new RegExp(`^( {0,3}${k})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:k=>new RegExp(`^ {0,${Math.min(3,k-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:k=>new RegExp(`^ {0,${Math.min(3,k-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:k=>new RegExp(`^ {0,${Math.min(3,k-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:k=>new RegExp(`^ {0,${Math.min(3,k-1)}}#`),htmlBeginRegex:k=>new RegExp(`^ {0,${Math.min(3,k-1)}}<(?:[a-z].*>|!--)`,"i")},xs=/^(?:[ \t]*(?:\n|$))+/,ks=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ws=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,rn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ls=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,mo=/(?:[*+-]|\d{1,9}[.)])/,mi=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,hi=ue(mi).replace(/bull/g,mo).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Es=ue(mi).replace(/bull/g,mo).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),ho=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ss=/^[^\n]+/,fo=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Ts=ue(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",fo).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Cs=ue(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,mo).getRegex(),Fn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",bo=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,As=ue("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",bo).replace("tag",Fn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),fi=ue(ho).replace("hr",rn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Fn).getRegex(),Is=ue(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",fi).getRegex(),yo={blockquote:Is,code:ks,def:Ts,fences:ws,heading:Ls,hr:rn,html:As,lheading:hi,list:Cs,newline:xs,paragraph:fi,table:on,text:Ss},ei=ue("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",rn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Fn).getRegex(),_s={...yo,lheading:Es,table:ei,paragraph:ue(ho).replace("hr",rn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ei).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Fn).getRegex()},$s={...yo,html:ue(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",bo).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:on,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ue(ho).replace("hr",rn).replace("heading",` *#{1,6} *[^
]`).replace("lheading",hi).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ms=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Bs=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,bi=/^( {2,}|\\)\n(?!\s*$)/,Rs=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Wn=/[\p{P}\p{S}]/u,vo=/[\s\p{P}\p{S}]/u,yi=/[^\s\p{P}\p{S}]/u,Ds=ue(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,vo).getRegex(),vi=/(?!~)[\p{P}\p{S}]/u,Ps=/(?!~)[\s\p{P}\p{S}]/u,Ns=/(?:[^\s\p{P}\p{S}]|~)/u,Os=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,xi=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,zs=ue(xi,"u").replace(/punct/g,Wn).getRegex(),Hs=ue(xi,"u").replace(/punct/g,vi).getRegex(),ki="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Fs=ue(ki,"gu").replace(/notPunctSpace/g,yi).replace(/punctSpace/g,vo).replace(/punct/g,Wn).getRegex(),Ws=ue(ki,"gu").replace(/notPunctSpace/g,Ns).replace(/punctSpace/g,Ps).replace(/punct/g,vi).getRegex(),qs=ue("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,yi).replace(/punctSpace/g,vo).replace(/punct/g,Wn).getRegex(),Us=ue(/\\(punct)/,"gu").replace(/punct/g,Wn).getRegex(),Vs=ue(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),js=ue(bo).replace("(?:-->|$)","-->").getRegex(),Gs=ue("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",js).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),On=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Ys=ue(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",On).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),wi=ue(/^!?\[(label)\]\[(ref)\]/).replace("label",On).replace("ref",fo).getRegex(),Li=ue(/^!?\[(ref)\](?:\[\])?/).replace("ref",fo).getRegex(),Ks=ue("reflink|nolink(?!\\()","g").replace("reflink",wi).replace("nolink",Li).getRegex(),xo={_backpedal:on,anyPunctuation:Us,autolink:Vs,blockSkip:Os,br:bi,code:Bs,del:on,emStrongLDelim:zs,emStrongRDelimAst:Fs,emStrongRDelimUnd:qs,escape:Ms,link:Ys,nolink:Li,punctuation:Ds,reflink:wi,reflinkSearch:Ks,tag:Gs,text:Rs,url:on},Xs={...xo,link:ue(/^!?\[(label)\]\((.*?)\)/).replace("label",On).getRegex(),reflink:ue(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",On).getRegex()},lo={...xo,emStrongRDelimAst:Ws,emStrongLDelim:Hs,url:ue(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Zs={...lo,br:ue(bi).replace("{2,}","*").getRegex(),text:ue(lo.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Rn={normal:yo,gfm:_s,pedantic:$s},Xt={normal:xo,gfm:lo,breaks:Zs,pedantic:Xs},Js={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ti=k=>Js[k];function it(k,t){if(t){if(Pe.escapeTest.test(k))return k.replace(Pe.escapeReplace,ti)}else if(Pe.escapeTestNoEncode.test(k))return k.replace(Pe.escapeReplaceNoEncode,ti);return k}function ni(k){try{k=encodeURI(k).replace(Pe.percentDecode,"%")}catch{return null}return k}function oi(k,t){var c;const o=k.replace(Pe.findPipe,(d,p,w)=>{let f=!1,E=p;for(;--E>=0&&w[E]==="\\";)f=!f;return f?"|":" |"}),s=o.split(Pe.splitPipe);let l=0;if(s[0].trim()||s.shift(),s.length>0&&!((c=s.at(-1))!=null&&c.trim())&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;l<s.length;l++)s[l]=s[l].trim().replace(Pe.slashPipe,"|");return s}function Zt(k,t,o){const s=k.length;if(s===0)return"";let l=0;for(;l<s&&k.charAt(s-l-1)===t;)l++;return k.slice(0,s-l)}function Qs(k,t){if(k.indexOf(t[1])===-1)return-1;let o=0;for(let s=0;s<k.length;s++)if(k[s]==="\\")s++;else if(k[s]===t[0])o++;else if(k[s]===t[1]&&(o--,o<0))return s;return-1}function ii(k,t,o,s,l){const c=t.href,d=t.title||null,p=k[1].replace(l.other.outputLinkReplace,"$1");if(k[0].charAt(0)!=="!"){s.state.inLink=!0;const w={type:"link",raw:o,href:c,title:d,text:p,tokens:s.inlineTokens(p)};return s.state.inLink=!1,w}return{type:"image",raw:o,href:c,title:d,text:p}}function er(k,t,o){const s=k.match(o.other.indentCodeCompensation);if(s===null)return t;const l=s[1];return t.split(`
`).map(c=>{const d=c.match(o.other.beginningSpace);if(d===null)return c;const[p]=d;return p.length>=l.length?c.slice(l.length):c}).join(`
`)}class zn{constructor(t){ae(this,"options");ae(this,"rules");ae(this,"lexer");this.options=t||Ct}space(t){const o=this.rules.block.newline.exec(t);if(o&&o[0].length>0)return{type:"space",raw:o[0]}}code(t){const o=this.rules.block.code.exec(t);if(o){const s=o[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:o[0],codeBlockStyle:"indented",text:this.options.pedantic?s:Zt(s,`
`)}}}fences(t){const o=this.rules.block.fences.exec(t);if(o){const s=o[0],l=er(s,o[3]||"",this.rules);return{type:"code",raw:s,lang:o[2]?o[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):o[2],text:l}}}heading(t){const o=this.rules.block.heading.exec(t);if(o){let s=o[2].trim();if(this.rules.other.endingHash.test(s)){const l=Zt(s,"#");(this.options.pedantic||!l||this.rules.other.endingSpaceChar.test(l))&&(s=l.trim())}return{type:"heading",raw:o[0],depth:o[1].length,text:s,tokens:this.lexer.inline(s)}}}hr(t){const o=this.rules.block.hr.exec(t);if(o)return{type:"hr",raw:Zt(o[0],`
`)}}blockquote(t){const o=this.rules.block.blockquote.exec(t);if(o){let s=Zt(o[0],`
`).split(`
`),l="",c="";const d=[];for(;s.length>0;){let p=!1;const w=[];let f;for(f=0;f<s.length;f++)if(this.rules.other.blockquoteStart.test(s[f]))w.push(s[f]),p=!0;else if(!p)w.push(s[f]);else break;s=s.slice(f);const E=w.join(`
`),M=E.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");l=l?`${l}
${E}`:E,c=c?`${c}
${M}`:M;const W=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(M,d,!0),this.lexer.state.top=W,s.length===0)break;const j=d.at(-1);if((j==null?void 0:j.type)==="code")break;if((j==null?void 0:j.type)==="blockquote"){const le=j,oe=le.raw+`
`+s.join(`
`),we=this.blockquote(oe);d[d.length-1]=we,l=l.substring(0,l.length-le.raw.length)+we.raw,c=c.substring(0,c.length-le.text.length)+we.text;break}else if((j==null?void 0:j.type)==="list"){const le=j,oe=le.raw+`
`+s.join(`
`),we=this.list(oe);d[d.length-1]=we,l=l.substring(0,l.length-j.raw.length)+we.raw,c=c.substring(0,c.length-le.raw.length)+we.raw,s=oe.substring(d.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:l,tokens:d,text:c}}}list(t){let o=this.rules.block.list.exec(t);if(o){let s=o[1].trim();const l=s.length>1,c={type:"list",raw:"",ordered:l,start:l?+s.slice(0,-1):"",loose:!1,items:[]};s=l?`\\d{1,9}\\${s.slice(-1)}`:`\\${s}`,this.options.pedantic&&(s=l?s:"[*+-]");const d=this.rules.other.listItemRegex(s);let p=!1;for(;t;){let f=!1,E="",M="";if(!(o=d.exec(t))||this.rules.block.hr.test(t))break;E=o[0],t=t.substring(E.length);let W=o[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,X=>" ".repeat(3*X.length)),j=t.split(`
`,1)[0],le=!W.trim(),oe=0;if(this.options.pedantic?(oe=2,M=W.trimStart()):le?oe=o[1].length+1:(oe=o[2].search(this.rules.other.nonSpaceChar),oe=oe>4?1:oe,M=W.slice(oe),oe+=o[1].length),le&&this.rules.other.blankLine.test(j)&&(E+=j+`
`,t=t.substring(j.length+1),f=!0),!f){const X=this.rules.other.nextBulletRegex(oe),ie=this.rules.other.hrRegex(oe),Q=this.rules.other.fencesBeginRegex(oe),ye=this.rules.other.headingBeginRegex(oe),Te=this.rules.other.htmlBeginRegex(oe);for(;t;){const x=t.split(`
`,1)[0];let S;if(j=x,this.options.pedantic?(j=j.replace(this.rules.other.listReplaceNesting,"  "),S=j):S=j.replace(this.rules.other.tabCharGlobal,"    "),Q.test(j)||ye.test(j)||Te.test(j)||X.test(j)||ie.test(j))break;if(S.search(this.rules.other.nonSpaceChar)>=oe||!j.trim())M+=`
`+S.slice(oe);else{if(le||W.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||Q.test(W)||ye.test(W)||ie.test(W))break;M+=`
`+j}!le&&!j.trim()&&(le=!0),E+=x+`
`,t=t.substring(x.length+1),W=S.slice(oe)}}c.loose||(p?c.loose=!0:this.rules.other.doubleBlankLine.test(E)&&(p=!0));let we=null,J;this.options.gfm&&(we=this.rules.other.listIsTask.exec(M),we&&(J=we[0]!=="[ ] ",M=M.replace(this.rules.other.listReplaceTask,""))),c.items.push({type:"list_item",raw:E,task:!!we,checked:J,loose:!1,text:M,tokens:[]}),c.raw+=E}const w=c.items.at(-1);if(w)w.raw=w.raw.trimEnd(),w.text=w.text.trimEnd();else return;c.raw=c.raw.trimEnd();for(let f=0;f<c.items.length;f++)if(this.lexer.state.top=!1,c.items[f].tokens=this.lexer.blockTokens(c.items[f].text,[]),!c.loose){const E=c.items[f].tokens.filter(W=>W.type==="space"),M=E.length>0&&E.some(W=>this.rules.other.anyLine.test(W.raw));c.loose=M}if(c.loose)for(let f=0;f<c.items.length;f++)c.items[f].loose=!0;return c}}html(t){const o=this.rules.block.html.exec(t);if(o)return{type:"html",block:!0,raw:o[0],pre:o[1]==="pre"||o[1]==="script"||o[1]==="style",text:o[0]}}def(t){const o=this.rules.block.def.exec(t);if(o){const s=o[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),l=o[2]?o[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",c=o[3]?o[3].substring(1,o[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):o[3];return{type:"def",tag:s,raw:o[0],href:l,title:c}}}table(t){var p;const o=this.rules.block.table.exec(t);if(!o||!this.rules.other.tableDelimiter.test(o[2]))return;const s=oi(o[1]),l=o[2].replace(this.rules.other.tableAlignChars,"").split("|"),c=(p=o[3])!=null&&p.trim()?o[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],d={type:"table",raw:o[0],header:[],align:[],rows:[]};if(s.length===l.length){for(const w of l)this.rules.other.tableAlignRight.test(w)?d.align.push("right"):this.rules.other.tableAlignCenter.test(w)?d.align.push("center"):this.rules.other.tableAlignLeft.test(w)?d.align.push("left"):d.align.push(null);for(let w=0;w<s.length;w++)d.header.push({text:s[w],tokens:this.lexer.inline(s[w]),header:!0,align:d.align[w]});for(const w of c)d.rows.push(oi(w,d.header.length).map((f,E)=>({text:f,tokens:this.lexer.inline(f),header:!1,align:d.align[E]})));return d}}lheading(t){const o=this.rules.block.lheading.exec(t);if(o)return{type:"heading",raw:o[0],depth:o[2].charAt(0)==="="?1:2,text:o[1],tokens:this.lexer.inline(o[1])}}paragraph(t){const o=this.rules.block.paragraph.exec(t);if(o){const s=o[1].charAt(o[1].length-1)===`
`?o[1].slice(0,-1):o[1];return{type:"paragraph",raw:o[0],text:s,tokens:this.lexer.inline(s)}}}text(t){const o=this.rules.block.text.exec(t);if(o)return{type:"text",raw:o[0],text:o[0],tokens:this.lexer.inline(o[0])}}escape(t){const o=this.rules.inline.escape.exec(t);if(o)return{type:"escape",raw:o[0],text:o[1]}}tag(t){const o=this.rules.inline.tag.exec(t);if(o)return!this.lexer.state.inLink&&this.rules.other.startATag.test(o[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(o[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(o[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(o[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:o[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:o[0]}}link(t){const o=this.rules.inline.link.exec(t);if(o){const s=o[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(s)){if(!this.rules.other.endAngleBracket.test(s))return;const d=Zt(s.slice(0,-1),"\\");if((s.length-d.length)%2===0)return}else{const d=Qs(o[2],"()");if(d>-1){const w=(o[0].indexOf("!")===0?5:4)+o[1].length+d;o[2]=o[2].substring(0,d),o[0]=o[0].substring(0,w).trim(),o[3]=""}}let l=o[2],c="";if(this.options.pedantic){const d=this.rules.other.pedanticHrefTitle.exec(l);d&&(l=d[1],c=d[3])}else c=o[3]?o[3].slice(1,-1):"";return l=l.trim(),this.rules.other.startAngleBracket.test(l)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(s)?l=l.slice(1):l=l.slice(1,-1)),ii(o,{href:l&&l.replace(this.rules.inline.anyPunctuation,"$1"),title:c&&c.replace(this.rules.inline.anyPunctuation,"$1")},o[0],this.lexer,this.rules)}}reflink(t,o){let s;if((s=this.rules.inline.reflink.exec(t))||(s=this.rules.inline.nolink.exec(t))){const l=(s[2]||s[1]).replace(this.rules.other.multipleSpaceGlobal," "),c=o[l.toLowerCase()];if(!c){const d=s[0].charAt(0);return{type:"text",raw:d,text:d}}return ii(s,c,s[0],this.lexer,this.rules)}}emStrong(t,o,s=""){let l=this.rules.inline.emStrongLDelim.exec(t);if(!l||l[3]&&s.match(this.rules.other.unicodeAlphaNumeric))return;if(!(l[1]||l[2]||"")||!s||this.rules.inline.punctuation.exec(s)){const d=[...l[0]].length-1;let p,w,f=d,E=0;const M=l[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(M.lastIndex=0,o=o.slice(-1*t.length+d);(l=M.exec(o))!=null;){if(p=l[1]||l[2]||l[3]||l[4]||l[5]||l[6],!p)continue;if(w=[...p].length,l[3]||l[4]){f+=w;continue}else if((l[5]||l[6])&&d%3&&!((d+w)%3)){E+=w;continue}if(f-=w,f>0)continue;w=Math.min(w,w+f+E);const W=[...l[0]][0].length,j=t.slice(0,d+l.index+W+w);if(Math.min(d,w)%2){const oe=j.slice(1,-1);return{type:"em",raw:j,text:oe,tokens:this.lexer.inlineTokens(oe)}}const le=j.slice(2,-2);return{type:"strong",raw:j,text:le,tokens:this.lexer.inlineTokens(le)}}}}codespan(t){const o=this.rules.inline.code.exec(t);if(o){let s=o[2].replace(this.rules.other.newLineCharGlobal," ");const l=this.rules.other.nonSpaceChar.test(s),c=this.rules.other.startingSpaceChar.test(s)&&this.rules.other.endingSpaceChar.test(s);return l&&c&&(s=s.substring(1,s.length-1)),{type:"codespan",raw:o[0],text:s}}}br(t){const o=this.rules.inline.br.exec(t);if(o)return{type:"br",raw:o[0]}}del(t){const o=this.rules.inline.del.exec(t);if(o)return{type:"del",raw:o[0],text:o[2],tokens:this.lexer.inlineTokens(o[2])}}autolink(t){const o=this.rules.inline.autolink.exec(t);if(o){let s,l;return o[2]==="@"?(s=o[1],l="mailto:"+s):(s=o[1],l=s),{type:"link",raw:o[0],text:s,href:l,tokens:[{type:"text",raw:s,text:s}]}}}url(t){var s;let o;if(o=this.rules.inline.url.exec(t)){let l,c;if(o[2]==="@")l=o[0],c="mailto:"+l;else{let d;do d=o[0],o[0]=((s=this.rules.inline._backpedal.exec(o[0]))==null?void 0:s[0])??"";while(d!==o[0]);l=o[0],o[1]==="www."?c="http://"+o[0]:c=o[0]}return{type:"link",raw:o[0],text:l,href:c,tokens:[{type:"text",raw:l,text:l}]}}}inlineText(t){const o=this.rules.inline.text.exec(t);if(o){const s=this.lexer.state.inRawBlock;return{type:"text",raw:o[0],text:o[0],escaped:s}}}}class Ke{constructor(t){ae(this,"tokens");ae(this,"options");ae(this,"state");ae(this,"tokenizer");ae(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Ct,this.options.tokenizer=this.options.tokenizer||new zn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const o={other:Pe,block:Rn.normal,inline:Xt.normal};this.options.pedantic?(o.block=Rn.pedantic,o.inline=Xt.pedantic):this.options.gfm&&(o.block=Rn.gfm,this.options.breaks?o.inline=Xt.breaks:o.inline=Xt.gfm),this.tokenizer.rules=o}static get rules(){return{block:Rn,inline:Xt}}static lex(t,o){return new Ke(o).lex(t)}static lexInline(t,o){return new Ke(o).inlineTokens(t)}lex(t){t=t.replace(Pe.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let o=0;o<this.inlineQueue.length;o++){const s=this.inlineQueue[o];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,o=[],s=!1){var l,c,d;for(this.options.pedantic&&(t=t.replace(Pe.tabCharGlobal,"    ").replace(Pe.spaceLine,""));t;){let p;if((c=(l=this.options.extensions)==null?void 0:l.block)!=null&&c.some(f=>(p=f.call({lexer:this},t,o))?(t=t.substring(p.raw.length),o.push(p),!0):!1))continue;if(p=this.tokenizer.space(t)){t=t.substring(p.raw.length);const f=o.at(-1);p.raw.length===1&&f!==void 0?f.raw+=`
`:o.push(p);continue}if(p=this.tokenizer.code(t)){t=t.substring(p.raw.length);const f=o.at(-1);(f==null?void 0:f.type)==="paragraph"||(f==null?void 0:f.type)==="text"?(f.raw+=`
`+p.raw,f.text+=`
`+p.text,this.inlineQueue.at(-1).src=f.text):o.push(p);continue}if(p=this.tokenizer.fences(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.heading(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.hr(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.blockquote(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.list(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.html(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.def(t)){t=t.substring(p.raw.length);const f=o.at(-1);(f==null?void 0:f.type)==="paragraph"||(f==null?void 0:f.type)==="text"?(f.raw+=`
`+p.raw,f.text+=`
`+p.raw,this.inlineQueue.at(-1).src=f.text):this.tokens.links[p.tag]||(this.tokens.links[p.tag]={href:p.href,title:p.title});continue}if(p=this.tokenizer.table(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.lheading(t)){t=t.substring(p.raw.length),o.push(p);continue}let w=t;if((d=this.options.extensions)!=null&&d.startBlock){let f=1/0;const E=t.slice(1);let M;this.options.extensions.startBlock.forEach(W=>{M=W.call({lexer:this},E),typeof M=="number"&&M>=0&&(f=Math.min(f,M))}),f<1/0&&f>=0&&(w=t.substring(0,f+1))}if(this.state.top&&(p=this.tokenizer.paragraph(w))){const f=o.at(-1);s&&(f==null?void 0:f.type)==="paragraph"?(f.raw+=`
`+p.raw,f.text+=`
`+p.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=f.text):o.push(p),s=w.length!==t.length,t=t.substring(p.raw.length);continue}if(p=this.tokenizer.text(t)){t=t.substring(p.raw.length);const f=o.at(-1);(f==null?void 0:f.type)==="text"?(f.raw+=`
`+p.raw,f.text+=`
`+p.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=f.text):o.push(p);continue}if(t){const f="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(f);break}else throw new Error(f)}}return this.state.top=!0,o}inline(t,o=[]){return this.inlineQueue.push({src:t,tokens:o}),o}inlineTokens(t,o=[]){var p,w,f;let s=t,l=null;if(this.tokens.links){const E=Object.keys(this.tokens.links);if(E.length>0)for(;(l=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)E.includes(l[0].slice(l[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,l.index)+"["+"a".repeat(l[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(l=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)s=s.slice(0,l.index)+"["+"a".repeat(l[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(l=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,l.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let c=!1,d="";for(;t;){c||(d=""),c=!1;let E;if((w=(p=this.options.extensions)==null?void 0:p.inline)!=null&&w.some(W=>(E=W.call({lexer:this},t,o))?(t=t.substring(E.raw.length),o.push(E),!0):!1))continue;if(E=this.tokenizer.escape(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.tag(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.link(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(E.raw.length);const W=o.at(-1);E.type==="text"&&(W==null?void 0:W.type)==="text"?(W.raw+=E.raw,W.text+=E.text):o.push(E);continue}if(E=this.tokenizer.emStrong(t,s,d)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.codespan(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.br(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.del(t)){t=t.substring(E.raw.length),o.push(E);continue}if(E=this.tokenizer.autolink(t)){t=t.substring(E.raw.length),o.push(E);continue}if(!this.state.inLink&&(E=this.tokenizer.url(t))){t=t.substring(E.raw.length),o.push(E);continue}let M=t;if((f=this.options.extensions)!=null&&f.startInline){let W=1/0;const j=t.slice(1);let le;this.options.extensions.startInline.forEach(oe=>{le=oe.call({lexer:this},j),typeof le=="number"&&le>=0&&(W=Math.min(W,le))}),W<1/0&&W>=0&&(M=t.substring(0,W+1))}if(E=this.tokenizer.inlineText(M)){t=t.substring(E.raw.length),E.raw.slice(-1)!=="_"&&(d=E.raw.slice(-1)),c=!0;const W=o.at(-1);(W==null?void 0:W.type)==="text"?(W.raw+=E.raw,W.text+=E.text):o.push(E);continue}if(t){const W="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(W);break}else throw new Error(W)}}return o}}class Hn{constructor(t){ae(this,"options");ae(this,"parser");this.options=t||Ct}space(t){return""}code({text:t,lang:o,escaped:s}){var d;const l=(d=(o||"").match(Pe.notSpaceStart))==null?void 0:d[0],c=t.replace(Pe.endingNewline,"")+`
`;return l?'<pre><code class="language-'+it(l)+'">'+(s?c:it(c,!0))+`</code></pre>
`:"<pre><code>"+(s?c:it(c,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:o}){return`<h${o}>${this.parser.parseInline(t)}</h${o}>
`}hr(t){return`<hr>
`}list(t){const o=t.ordered,s=t.start;let l="";for(let p=0;p<t.items.length;p++){const w=t.items[p];l+=this.listitem(w)}const c=o?"ol":"ul",d=o&&s!==1?' start="'+s+'"':"";return"<"+c+d+`>
`+l+"</"+c+`>
`}listitem(t){var s;let o="";if(t.task){const l=this.checkbox({checked:!!t.checked});t.loose?((s=t.tokens[0])==null?void 0:s.type)==="paragraph"?(t.tokens[0].text=l+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=l+" "+it(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:l+" ",text:l+" ",escaped:!0}):o+=l+" "}return o+=this.parser.parse(t.tokens,!!t.loose),`<li>${o}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let o="",s="";for(let c=0;c<t.header.length;c++)s+=this.tablecell(t.header[c]);o+=this.tablerow({text:s});let l="";for(let c=0;c<t.rows.length;c++){const d=t.rows[c];s="";for(let p=0;p<d.length;p++)s+=this.tablecell(d[p]);l+=this.tablerow({text:s})}return l&&(l=`<tbody>${l}</tbody>`),`<table>
<thead>
`+o+`</thead>
`+l+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){const o=this.parser.parseInline(t.tokens),s=t.header?"th":"td";return(t.align?`<${s} align="${t.align}">`:`<${s}>`)+o+`</${s}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${it(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:o,tokens:s}){const l=this.parser.parseInline(s),c=ni(t);if(c===null)return l;t=c;let d='<a href="'+t+'"';return o&&(d+=' title="'+it(o)+'"'),d+=">"+l+"</a>",d}image({href:t,title:o,text:s}){const l=ni(t);if(l===null)return it(s);t=l;let c=`<img src="${t}" alt="${s}"`;return o&&(c+=` title="${it(o)}"`),c+=">",c}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:it(t.text)}}class ko{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}}class Xe{constructor(t){ae(this,"options");ae(this,"renderer");ae(this,"textRenderer");this.options=t||Ct,this.options.renderer=this.options.renderer||new Hn,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ko}static parse(t,o){return new Xe(o).parse(t)}static parseInline(t,o){return new Xe(o).parseInline(t)}parse(t,o=!0){var l,c;let s="";for(let d=0;d<t.length;d++){const p=t[d];if((c=(l=this.options.extensions)==null?void 0:l.renderers)!=null&&c[p.type]){const f=p,E=this.options.extensions.renderers[f.type].call({parser:this},f);if(E!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(f.type)){s+=E||"";continue}}const w=p;switch(w.type){case"space":{s+=this.renderer.space(w);continue}case"hr":{s+=this.renderer.hr(w);continue}case"heading":{s+=this.renderer.heading(w);continue}case"code":{s+=this.renderer.code(w);continue}case"table":{s+=this.renderer.table(w);continue}case"blockquote":{s+=this.renderer.blockquote(w);continue}case"list":{s+=this.renderer.list(w);continue}case"html":{s+=this.renderer.html(w);continue}case"paragraph":{s+=this.renderer.paragraph(w);continue}case"text":{let f=w,E=this.renderer.text(f);for(;d+1<t.length&&t[d+1].type==="text";)f=t[++d],E+=`
`+this.renderer.text(f);o?s+=this.renderer.paragraph({type:"paragraph",raw:E,text:E,tokens:[{type:"text",raw:E,text:E,escaped:!0}]}):s+=E;continue}default:{const f='Token with "'+w.type+'" type was not found.';if(this.options.silent)return console.error(f),"";throw new Error(f)}}}return s}parseInline(t,o=this.renderer){var l,c;let s="";for(let d=0;d<t.length;d++){const p=t[d];if((c=(l=this.options.extensions)==null?void 0:l.renderers)!=null&&c[p.type]){const f=this.options.extensions.renderers[p.type].call({parser:this},p);if(f!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(p.type)){s+=f||"";continue}}const w=p;switch(w.type){case"escape":{s+=o.text(w);break}case"html":{s+=o.html(w);break}case"link":{s+=o.link(w);break}case"image":{s+=o.image(w);break}case"strong":{s+=o.strong(w);break}case"em":{s+=o.em(w);break}case"codespan":{s+=o.codespan(w);break}case"br":{s+=o.br(w);break}case"del":{s+=o.del(w);break}case"text":{s+=o.text(w);break}default:{const f='Token with "'+w.type+'" type was not found.';if(this.options.silent)return console.error(f),"";throw new Error(f)}}}return s}}class sn{constructor(t){ae(this,"options");ae(this,"block");this.options=t||Ct}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?Ke.lex:Ke.lexInline}provideParser(){return this.block?Xe.parse:Xe.parseInline}}ae(sn,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));class tr{constructor(...t){ae(this,"defaults",go());ae(this,"options",this.setOptions);ae(this,"parse",this.parseMarkdown(!0));ae(this,"parseInline",this.parseMarkdown(!1));ae(this,"Parser",Xe);ae(this,"Renderer",Hn);ae(this,"TextRenderer",ko);ae(this,"Lexer",Ke);ae(this,"Tokenizer",zn);ae(this,"Hooks",sn);this.use(...t)}walkTokens(t,o){var l,c;let s=[];for(const d of t)switch(s=s.concat(o.call(this,d)),d.type){case"table":{const p=d;for(const w of p.header)s=s.concat(this.walkTokens(w.tokens,o));for(const w of p.rows)for(const f of w)s=s.concat(this.walkTokens(f.tokens,o));break}case"list":{const p=d;s=s.concat(this.walkTokens(p.items,o));break}default:{const p=d;(c=(l=this.defaults.extensions)==null?void 0:l.childTokens)!=null&&c[p.type]?this.defaults.extensions.childTokens[p.type].forEach(w=>{const f=p[w].flat(1/0);s=s.concat(this.walkTokens(f,o))}):p.tokens&&(s=s.concat(this.walkTokens(p.tokens,o)))}}return s}use(...t){const o=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(s=>{const l={...s};if(l.async=this.defaults.async||l.async||!1,s.extensions&&(s.extensions.forEach(c=>{if(!c.name)throw new Error("extension name required");if("renderer"in c){const d=o.renderers[c.name];d?o.renderers[c.name]=function(...p){let w=c.renderer.apply(this,p);return w===!1&&(w=d.apply(this,p)),w}:o.renderers[c.name]=c.renderer}if("tokenizer"in c){if(!c.level||c.level!=="block"&&c.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const d=o[c.level];d?d.unshift(c.tokenizer):o[c.level]=[c.tokenizer],c.start&&(c.level==="block"?o.startBlock?o.startBlock.push(c.start):o.startBlock=[c.start]:c.level==="inline"&&(o.startInline?o.startInline.push(c.start):o.startInline=[c.start]))}"childTokens"in c&&c.childTokens&&(o.childTokens[c.name]=c.childTokens)}),l.extensions=o),s.renderer){const c=this.defaults.renderer||new Hn(this.defaults);for(const d in s.renderer){if(!(d in c))throw new Error(`renderer '${d}' does not exist`);if(["options","parser"].includes(d))continue;const p=d,w=s.renderer[p],f=c[p];c[p]=(...E)=>{let M=w.apply(c,E);return M===!1&&(M=f.apply(c,E)),M||""}}l.renderer=c}if(s.tokenizer){const c=this.defaults.tokenizer||new zn(this.defaults);for(const d in s.tokenizer){if(!(d in c))throw new Error(`tokenizer '${d}' does not exist`);if(["options","rules","lexer"].includes(d))continue;const p=d,w=s.tokenizer[p],f=c[p];c[p]=(...E)=>{let M=w.apply(c,E);return M===!1&&(M=f.apply(c,E)),M}}l.tokenizer=c}if(s.hooks){const c=this.defaults.hooks||new sn;for(const d in s.hooks){if(!(d in c))throw new Error(`hook '${d}' does not exist`);if(["options","block"].includes(d))continue;const p=d,w=s.hooks[p],f=c[p];sn.passThroughHooks.has(d)?c[p]=E=>{if(this.defaults.async)return Promise.resolve(w.call(c,E)).then(W=>f.call(c,W));const M=w.call(c,E);return f.call(c,M)}:c[p]=(...E)=>{let M=w.apply(c,E);return M===!1&&(M=f.apply(c,E)),M}}l.hooks=c}if(s.walkTokens){const c=this.defaults.walkTokens,d=s.walkTokens;l.walkTokens=function(p){let w=[];return w.push(d.call(this,p)),c&&(w=w.concat(c.call(this,p))),w}}this.defaults={...this.defaults,...l}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,o){return Ke.lex(t,o??this.defaults)}parser(t,o){return Xe.parse(t,o??this.defaults)}parseMarkdown(t){return(s,l)=>{const c={...l},d={...this.defaults,...c},p=this.onError(!!d.silent,!!d.async);if(this.defaults.async===!0&&c.async===!1)return p(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof s>"u"||s===null)return p(new Error("marked(): input parameter is undefined or null"));if(typeof s!="string")return p(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(s)+", string expected"));d.hooks&&(d.hooks.options=d,d.hooks.block=t);const w=d.hooks?d.hooks.provideLexer():t?Ke.lex:Ke.lexInline,f=d.hooks?d.hooks.provideParser():t?Xe.parse:Xe.parseInline;if(d.async)return Promise.resolve(d.hooks?d.hooks.preprocess(s):s).then(E=>w(E,d)).then(E=>d.hooks?d.hooks.processAllTokens(E):E).then(E=>d.walkTokens?Promise.all(this.walkTokens(E,d.walkTokens)).then(()=>E):E).then(E=>f(E,d)).then(E=>d.hooks?d.hooks.postprocess(E):E).catch(p);try{d.hooks&&(s=d.hooks.preprocess(s));let E=w(s,d);d.hooks&&(E=d.hooks.processAllTokens(E)),d.walkTokens&&this.walkTokens(E,d.walkTokens);let M=f(E,d);return d.hooks&&(M=d.hooks.postprocess(M)),M}catch(E){return p(E)}}}onError(t,o){return s=>{if(s.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const l="<p>An error occurred:</p><pre>"+it(s.message+"",!0)+"</pre>";return o?Promise.resolve(l):l}if(o)return Promise.reject(s);throw s}}}const Tt=new tr;function ce(k,t){return Tt.parse(k,t)}ce.options=ce.setOptions=function(k){return Tt.setOptions(k),ce.defaults=Tt.defaults,gi(ce.defaults),ce};ce.getDefaults=go;ce.defaults=Ct;ce.use=function(...k){return Tt.use(...k),ce.defaults=Tt.defaults,gi(ce.defaults),ce};ce.walkTokens=function(k,t){return Tt.walkTokens(k,t)};ce.parseInline=Tt.parseInline;ce.Parser=Xe;ce.parser=Xe.parse;ce.Renderer=Hn;ce.TextRenderer=ko;ce.Lexer=Ke;ce.lexer=Ke.lex;ce.Tokenizer=zn;ce.Hooks=sn;ce.parse=ce;ce.options;ce.setOptions;ce.use;ce.walkTokens;ce.parseInline;Xe.parse;Ke.lex;/*! @license DOMPurify 3.3.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.1/LICENSE */const{entries:Ei,setPrototypeOf:si,isFrozen:nr,getPrototypeOf:or,getOwnPropertyDescriptor:ir}=Object;let{freeze:Ne,seal:Ze,create:co}=Object,{apply:uo,construct:po}=typeof Reflect<"u"&&Reflect;Ne||(Ne=function(t){return t});Ze||(Ze=function(t){return t});uo||(uo=function(t,o){for(var s=arguments.length,l=new Array(s>2?s-2:0),c=2;c<s;c++)l[c-2]=arguments[c];return t.apply(o,l)});po||(po=function(t){for(var o=arguments.length,s=new Array(o>1?o-1:0),l=1;l<o;l++)s[l-1]=arguments[l];return new t(...s)});const Dn=Oe(Array.prototype.forEach),sr=Oe(Array.prototype.lastIndexOf),ri=Oe(Array.prototype.pop),Jt=Oe(Array.prototype.push),rr=Oe(Array.prototype.splice),Nn=Oe(String.prototype.toLowerCase),to=Oe(String.prototype.toString),no=Oe(String.prototype.match),Qt=Oe(String.prototype.replace),ar=Oe(String.prototype.indexOf),lr=Oe(String.prototype.trim),et=Oe(Object.prototype.hasOwnProperty),De=Oe(RegExp.prototype.test),en=cr(TypeError);function Oe(k){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var o=arguments.length,s=new Array(o>1?o-1:0),l=1;l<o;l++)s[l-1]=arguments[l];return uo(k,t,s)}}function cr(k){return function(){for(var t=arguments.length,o=new Array(t),s=0;s<t;s++)o[s]=arguments[s];return po(k,o)}}function ne(k,t){let o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Nn;si&&si(k,null);let s=t.length;for(;s--;){let l=t[s];if(typeof l=="string"){const c=o(l);c!==l&&(nr(t)||(t[s]=c),l=c)}k[l]=!0}return k}function dr(k){for(let t=0;t<k.length;t++)et(k,t)||(k[t]=null);return k}function st(k){const t=co(null);for(const[o,s]of Ei(k))et(k,o)&&(Array.isArray(s)?t[o]=dr(s):s&&typeof s=="object"&&s.constructor===Object?t[o]=st(s):t[o]=s);return t}function tn(k,t){for(;k!==null;){const s=ir(k,t);if(s){if(s.get)return Oe(s.get);if(typeof s.value=="function")return Oe(s.value)}k=or(k)}function o(){return null}return o}const ai=Ne(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),oo=Ne(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),io=Ne(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),ur=Ne(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),so=Ne(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),pr=Ne(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),li=Ne(["#text"]),ci=Ne(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),ro=Ne(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),di=Ne(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Pn=Ne(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),gr=Ze(/\{\{[\w\W]*|[\w\W]*\}\}/gm),mr=Ze(/<%[\w\W]*|[\w\W]*%>/gm),hr=Ze(/\$\{[\w\W]*/gm),fr=Ze(/^data-[\-\w.\u00B7-\uFFFF]+$/),br=Ze(/^aria-[\-\w]+$/),Si=Ze(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),yr=Ze(/^(?:\w+script|data):/i),vr=Ze(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ti=Ze(/^html$/i),xr=Ze(/^[a-z][.\w]*(-[.\w]+)+$/i);var ui=Object.freeze({__proto__:null,ARIA_ATTR:br,ATTR_WHITESPACE:vr,CUSTOM_ELEMENT:xr,DATA_ATTR:fr,DOCTYPE_NAME:Ti,ERB_EXPR:mr,IS_ALLOWED_URI:Si,IS_SCRIPT_OR_DATA:yr,MUSTACHE_EXPR:gr,TMPLIT_EXPR:hr});const nn={element:1,text:3,progressingInstruction:7,comment:8,document:9},kr=function(){return typeof window>"u"?null:window},wr=function(t,o){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const l="data-tt-policy-suffix";o&&o.hasAttribute(l)&&(s=o.getAttribute(l));const c="dompurify"+(s?"#"+s:"");try{return t.createPolicy(c,{createHTML(d){return d},createScriptURL(d){return d}})}catch{return console.warn("TrustedTypes policy "+c+" could not be created."),null}},pi=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Ci(){let k=arguments.length>0&&arguments[0]!==void 0?arguments[0]:kr();const t=U=>Ci(U);if(t.version="3.3.1",t.removed=[],!k||!k.document||k.document.nodeType!==nn.document||!k.Element)return t.isSupported=!1,t;let{document:o}=k;const s=o,l=s.currentScript,{DocumentFragment:c,HTMLTemplateElement:d,Node:p,Element:w,NodeFilter:f,NamedNodeMap:E=k.NamedNodeMap||k.MozNamedAttrMap,HTMLFormElement:M,DOMParser:W,trustedTypes:j}=k,le=w.prototype,oe=tn(le,"cloneNode"),we=tn(le,"remove"),J=tn(le,"nextSibling"),X=tn(le,"childNodes"),ie=tn(le,"parentNode");if(typeof d=="function"){const U=o.createElement("template");U.content&&U.content.ownerDocument&&(o=U.content.ownerDocument)}let Q,ye="";const{implementation:Te,createNodeIterator:x,createDocumentFragment:S,getElementsByTagName:I}=o,{importNode:C}=s;let y=pi();t.isSupported=typeof Ei=="function"&&typeof ie=="function"&&Te&&Te.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:b,ERB_EXPR:_,TMPLIT_EXPR:$,DATA_ATTR:B,ARIA_ATTR:H,IS_SCRIPT_OR_DATA:K,ATTR_WHITESPACE:re,CUSTOM_ELEMENT:Le}=ui;let{IS_ALLOWED_URI:q}=ui,te=null;const z=ne({},[...ai,...oo,...io,...so,...li]);let Z=null;const fe=ne({},[...ci,...ro,...di,...Pn]);let de=Object.seal(co(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),rt=null,vt=null;const tt=Object.seal(co(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Nt=!0,at=!0,xt=!1,gt=!0,Ue=!1,nt=!0,V=!1,Y=!1,pe=!1,Be=!1,Ce=!1,ot=!1,an=!0,ln=!1;const cn="user-content-";let Ot=!0,mt=!1,ht={},Ve=null;const At=ne({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let dn=null;const zt=ne({},["audio","video","img","source","image","track"]);let Ht=null;const un=ne({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),kt="http://www.w3.org/1998/Math/MathML",It="http://www.w3.org/2000/svg",je="http://www.w3.org/1999/xhtml";let ft=je,Ft=!1,Wt=null;const qn=ne({},[kt,It,je],to);let _t=ne({},["mi","mo","mn","ms","mtext"]),$t=ne({},["annotation-xml"]);const Un=ne({},["title","style","font","a","script"]);let wt=null;const Vn=["application/xhtml+xml","text/html"],jn="text/html";let Ee=null,bt=null;const Gn=o.createElement("form"),Lt=function(u){return u instanceof RegExp||u instanceof Function},lt=function(){let u=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(bt&&bt===u)){if((!u||typeof u!="object")&&(u={}),u=st(u),wt=Vn.indexOf(u.PARSER_MEDIA_TYPE)===-1?jn:u.PARSER_MEDIA_TYPE,Ee=wt==="application/xhtml+xml"?to:Nn,te=et(u,"ALLOWED_TAGS")?ne({},u.ALLOWED_TAGS,Ee):z,Z=et(u,"ALLOWED_ATTR")?ne({},u.ALLOWED_ATTR,Ee):fe,Wt=et(u,"ALLOWED_NAMESPACES")?ne({},u.ALLOWED_NAMESPACES,to):qn,Ht=et(u,"ADD_URI_SAFE_ATTR")?ne(st(un),u.ADD_URI_SAFE_ATTR,Ee):un,dn=et(u,"ADD_DATA_URI_TAGS")?ne(st(zt),u.ADD_DATA_URI_TAGS,Ee):zt,Ve=et(u,"FORBID_CONTENTS")?ne({},u.FORBID_CONTENTS,Ee):At,rt=et(u,"FORBID_TAGS")?ne({},u.FORBID_TAGS,Ee):st({}),vt=et(u,"FORBID_ATTR")?ne({},u.FORBID_ATTR,Ee):st({}),ht=et(u,"USE_PROFILES")?u.USE_PROFILES:!1,Nt=u.ALLOW_ARIA_ATTR!==!1,at=u.ALLOW_DATA_ATTR!==!1,xt=u.ALLOW_UNKNOWN_PROTOCOLS||!1,gt=u.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ue=u.SAFE_FOR_TEMPLATES||!1,nt=u.SAFE_FOR_XML!==!1,V=u.WHOLE_DOCUMENT||!1,Be=u.RETURN_DOM||!1,Ce=u.RETURN_DOM_FRAGMENT||!1,ot=u.RETURN_TRUSTED_TYPE||!1,pe=u.FORCE_BODY||!1,an=u.SANITIZE_DOM!==!1,ln=u.SANITIZE_NAMED_PROPS||!1,Ot=u.KEEP_CONTENT!==!1,mt=u.IN_PLACE||!1,q=u.ALLOWED_URI_REGEXP||Si,ft=u.NAMESPACE||je,_t=u.MATHML_TEXT_INTEGRATION_POINTS||_t,$t=u.HTML_INTEGRATION_POINTS||$t,de=u.CUSTOM_ELEMENT_HANDLING||{},u.CUSTOM_ELEMENT_HANDLING&&Lt(u.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(de.tagNameCheck=u.CUSTOM_ELEMENT_HANDLING.tagNameCheck),u.CUSTOM_ELEMENT_HANDLING&&Lt(u.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(de.attributeNameCheck=u.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),u.CUSTOM_ELEMENT_HANDLING&&typeof u.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(de.allowCustomizedBuiltInElements=u.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Ue&&(at=!1),Ce&&(Be=!0),ht&&(te=ne({},li),Z=[],ht.html===!0&&(ne(te,ai),ne(Z,ci)),ht.svg===!0&&(ne(te,oo),ne(Z,ro),ne(Z,Pn)),ht.svgFilters===!0&&(ne(te,io),ne(Z,ro),ne(Z,Pn)),ht.mathMl===!0&&(ne(te,so),ne(Z,di),ne(Z,Pn))),u.ADD_TAGS&&(typeof u.ADD_TAGS=="function"?tt.tagCheck=u.ADD_TAGS:(te===z&&(te=st(te)),ne(te,u.ADD_TAGS,Ee))),u.ADD_ATTR&&(typeof u.ADD_ATTR=="function"?tt.attributeCheck=u.ADD_ATTR:(Z===fe&&(Z=st(Z)),ne(Z,u.ADD_ATTR,Ee))),u.ADD_URI_SAFE_ATTR&&ne(Ht,u.ADD_URI_SAFE_ATTR,Ee),u.FORBID_CONTENTS&&(Ve===At&&(Ve=st(Ve)),ne(Ve,u.FORBID_CONTENTS,Ee)),u.ADD_FORBID_CONTENTS&&(Ve===At&&(Ve=st(Ve)),ne(Ve,u.ADD_FORBID_CONTENTS,Ee)),Ot&&(te["#text"]=!0),V&&ne(te,["html","head","body"]),te.table&&(ne(te,["tbody"]),delete rt.tbody),u.TRUSTED_TYPES_POLICY){if(typeof u.TRUSTED_TYPES_POLICY.createHTML!="function")throw en('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof u.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw en('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');Q=u.TRUSTED_TYPES_POLICY,ye=Q.createHTML("")}else Q===void 0&&(Q=wr(j,l)),Q!==null&&typeof ye=="string"&&(ye=Q.createHTML(""));Ne&&Ne(u),bt=u}},yt=ne({},[...oo,...io,...ur]),pn=ne({},[...so,...pr]),gn=function(u){let A=ie(u);(!A||!A.tagName)&&(A={namespaceURI:ft,tagName:"template"});const N=Nn(u.tagName),me=Nn(A.tagName);return Wt[u.namespaceURI]?u.namespaceURI===It?A.namespaceURI===je?N==="svg":A.namespaceURI===kt?N==="svg"&&(me==="annotation-xml"||_t[me]):!!yt[N]:u.namespaceURI===kt?A.namespaceURI===je?N==="math":A.namespaceURI===It?N==="math"&&$t[me]:!!pn[N]:u.namespaceURI===je?A.namespaceURI===It&&!$t[me]||A.namespaceURI===kt&&!_t[me]?!1:!pn[N]&&(Un[N]||!yt[N]):!!(wt==="application/xhtml+xml"&&Wt[u.namespaceURI]):!1},ge=function(u){Jt(t.removed,{element:u});try{ie(u).removeChild(u)}catch{we(u)}},ct=function(u,A){try{Jt(t.removed,{attribute:A.getAttributeNode(u),from:A})}catch{Jt(t.removed,{attribute:null,from:A})}if(A.removeAttribute(u),u==="is")if(Be||Ce)try{ge(A)}catch{}else try{A.setAttribute(u,"")}catch{}},mn=function(u){let A=null,N=null;if(pe)u="<remove></remove>"+u;else{const ve=no(u,/^[\r\n\t ]+/);N=ve&&ve[0]}wt==="application/xhtml+xml"&&ft===je&&(u='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+u+"</body></html>");const me=Q?Q.createHTML(u):u;if(ft===je)try{A=new W().parseFromString(me,wt)}catch{}if(!A||!A.documentElement){A=Te.createDocument(ft,"template",null);try{A.documentElement.innerHTML=Ft?ye:me}catch{}}const _e=A.body||A.documentElement;return u&&N&&_e.insertBefore(o.createTextNode(N),_e.childNodes[0]||null),ft===je?I.call(A,V?"html":"body")[0]:V?A.documentElement:_e},hn=function(u){return x.call(u.ownerDocument||u,u,f.SHOW_ELEMENT|f.SHOW_COMMENT|f.SHOW_TEXT|f.SHOW_PROCESSING_INSTRUCTION|f.SHOW_CDATA_SECTION,null)},qt=function(u){return u instanceof M&&(typeof u.nodeName!="string"||typeof u.textContent!="string"||typeof u.removeChild!="function"||!(u.attributes instanceof E)||typeof u.removeAttribute!="function"||typeof u.setAttribute!="function"||typeof u.namespaceURI!="string"||typeof u.insertBefore!="function"||typeof u.hasChildNodes!="function")},fn=function(u){return typeof p=="function"&&u instanceof p};function Je(U,u,A){Dn(U,N=>{N.call(t,u,A,bt)})}const bn=function(u){let A=null;if(Je(y.beforeSanitizeElements,u,null),qt(u))return ge(u),!0;const N=Ee(u.nodeName);if(Je(y.uponSanitizeElement,u,{tagName:N,allowedTags:te}),nt&&u.hasChildNodes()&&!fn(u.firstElementChild)&&De(/<[/\w!]/g,u.innerHTML)&&De(/<[/\w!]/g,u.textContent)||u.nodeType===nn.progressingInstruction||nt&&u.nodeType===nn.comment&&De(/<[/\w]/g,u.data))return ge(u),!0;if(!(tt.tagCheck instanceof Function&&tt.tagCheck(N))&&(!te[N]||rt[N])){if(!rt[N]&&Mt(N)&&(de.tagNameCheck instanceof RegExp&&De(de.tagNameCheck,N)||de.tagNameCheck instanceof Function&&de.tagNameCheck(N)))return!1;if(Ot&&!Ve[N]){const me=ie(u)||u.parentNode,_e=X(u)||u.childNodes;if(_e&&me){const ve=_e.length;for(let Re=ve-1;Re>=0;--Re){const $e=oe(_e[Re],!0);$e.__removalCount=(u.__removalCount||0)+1,me.insertBefore($e,J(u))}}}return ge(u),!0}return u instanceof w&&!gn(u)||(N==="noscript"||N==="noembed"||N==="noframes")&&De(/<\/no(script|embed|frames)/i,u.innerHTML)?(ge(u),!0):(Ue&&u.nodeType===nn.text&&(A=u.textContent,Dn([b,_,$],me=>{A=Qt(A,me," ")}),u.textContent!==A&&(Jt(t.removed,{element:u.cloneNode()}),u.textContent=A)),Je(y.afterSanitizeElements,u,null),!1)},yn=function(u,A,N){if(an&&(A==="id"||A==="name")&&(N in o||N in Gn))return!1;if(!(at&&!vt[A]&&De(B,A))){if(!(Nt&&De(H,A))){if(!(tt.attributeCheck instanceof Function&&tt.attributeCheck(A,u))){if(!Z[A]||vt[A]){if(!(Mt(u)&&(de.tagNameCheck instanceof RegExp&&De(de.tagNameCheck,u)||de.tagNameCheck instanceof Function&&de.tagNameCheck(u))&&(de.attributeNameCheck instanceof RegExp&&De(de.attributeNameCheck,A)||de.attributeNameCheck instanceof Function&&de.attributeNameCheck(A,u))||A==="is"&&de.allowCustomizedBuiltInElements&&(de.tagNameCheck instanceof RegExp&&De(de.tagNameCheck,N)||de.tagNameCheck instanceof Function&&de.tagNameCheck(N))))return!1}else if(!Ht[A]){if(!De(q,Qt(N,re,""))){if(!((A==="src"||A==="xlink:href"||A==="href")&&u!=="script"&&ar(N,"data:")===0&&dn[u])){if(!(xt&&!De(K,Qt(N,re,"")))){if(N)return!1}}}}}}}return!0},Mt=function(u){return u!=="annotation-xml"&&no(u,Le)},vn=function(u){Je(y.beforeSanitizeAttributes,u,null);const{attributes:A}=u;if(!A||qt(u))return;const N={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:Z,forceKeepAttr:void 0};let me=A.length;for(;me--;){const _e=A[me],{name:ve,namespaceURI:Re,value:$e}=_e,dt=Ee(ve),Ut=$e;let Ie=ve==="value"?Ut:lr(Ut);if(N.attrName=dt,N.attrValue=Ie,N.keepAttr=!0,N.forceKeepAttr=void 0,Je(y.uponSanitizeAttribute,u,N),Ie=N.attrValue,ln&&(dt==="id"||dt==="name")&&(ct(ve,u),Ie=cn+Ie),nt&&De(/((--!?|])>)|<\/(style|title|textarea)/i,Ie)){ct(ve,u);continue}if(dt==="attributename"&&no(Ie,"href")){ct(ve,u);continue}if(N.forceKeepAttr)continue;if(!N.keepAttr){ct(ve,u);continue}if(!gt&&De(/\/>/i,Ie)){ct(ve,u);continue}Ue&&Dn([b,_,$],Bt=>{Ie=Qt(Ie,Bt," ")});const kn=Ee(u.nodeName);if(!yn(kn,dt,Ie)){ct(ve,u);continue}if(Q&&typeof j=="object"&&typeof j.getAttributeType=="function"&&!Re)switch(j.getAttributeType(kn,dt)){case"TrustedHTML":{Ie=Q.createHTML(Ie);break}case"TrustedScriptURL":{Ie=Q.createScriptURL(Ie);break}}if(Ie!==Ut)try{Re?u.setAttributeNS(Re,ve,Ie):u.setAttribute(ve,Ie),qt(u)?ge(u):ri(t.removed)}catch{ct(ve,u)}}Je(y.afterSanitizeAttributes,u,null)},xn=function U(u){let A=null;const N=hn(u);for(Je(y.beforeSanitizeShadowDOM,u,null);A=N.nextNode();)Je(y.uponSanitizeShadowNode,A,null),bn(A),vn(A),A.content instanceof c&&U(A.content);Je(y.afterSanitizeShadowDOM,u,null)};return t.sanitize=function(U){let u=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},A=null,N=null,me=null,_e=null;if(Ft=!U,Ft&&(U="<!-->"),typeof U!="string"&&!fn(U))if(typeof U.toString=="function"){if(U=U.toString(),typeof U!="string")throw en("dirty is not a string, aborting")}else throw en("toString is not a function");if(!t.isSupported)return U;if(Y||lt(u),t.removed=[],typeof U=="string"&&(mt=!1),mt){if(U.nodeName){const $e=Ee(U.nodeName);if(!te[$e]||rt[$e])throw en("root node is forbidden and cannot be sanitized in-place")}}else if(U instanceof p)A=mn("<!---->"),N=A.ownerDocument.importNode(U,!0),N.nodeType===nn.element&&N.nodeName==="BODY"||N.nodeName==="HTML"?A=N:A.appendChild(N);else{if(!Be&&!Ue&&!V&&U.indexOf("<")===-1)return Q&&ot?Q.createHTML(U):U;if(A=mn(U),!A)return Be?null:ot?ye:""}A&&pe&&ge(A.firstChild);const ve=hn(mt?U:A);for(;me=ve.nextNode();)bn(me),vn(me),me.content instanceof c&&xn(me.content);if(mt)return U;if(Be){if(Ce)for(_e=S.call(A.ownerDocument);A.firstChild;)_e.appendChild(A.firstChild);else _e=A;return(Z.shadowroot||Z.shadowrootmode)&&(_e=C.call(s,_e,!0)),_e}let Re=V?A.outerHTML:A.innerHTML;return V&&te["!doctype"]&&A.ownerDocument&&A.ownerDocument.doctype&&A.ownerDocument.doctype.name&&De(Ti,A.ownerDocument.doctype.name)&&(Re="<!DOCTYPE "+A.ownerDocument.doctype.name+`>
`+Re),Ue&&Dn([b,_,$],$e=>{Re=Qt(Re,$e," ")}),Q&&ot?Q.createHTML(Re):Re},t.setConfig=function(){let U=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};lt(U),Y=!0},t.clearConfig=function(){bt=null,Y=!1},t.isValidAttribute=function(U,u,A){bt||lt({});const N=Ee(U),me=Ee(u);return yn(N,me,A)},t.addHook=function(U,u){typeof u=="function"&&Jt(y[U],u)},t.removeHook=function(U,u){if(u!==void 0){const A=sr(y[U],u);return A===-1?void 0:rr(y[U],A,1)[0]}return ri(y[U])},t.removeHooks=function(U){y[U]=[]},t.removeAllHooks=function(){y=pi()},t}var ao=Ci();function Lr(k,t,o){let s=!1,l="docked";const c=()=>{if(!s)return;const S=k.getModel(),C=S.getValue().split(`
`),y=[],b=new Set,_=q=>{const te=[];let z="",Z=!1;for(let fe=0;fe<q.length;fe++){const de=q[fe];de==="`"?(Z=!Z,z+=de):de==="|"&&!Z?(te.push(z),z=""):z+=de}return te.push(z),te.filter(fe=>fe.trim())};let $=!1,B=[],H=null,K=null,re=!1,Le=0;if(C.forEach((q,te)=>{const z=te+1,Z=q.trim();if(Z.startsWith("```")&&($?(B.pop(),$=!1):(B.push(z),$=!0)),$&&!Z.startsWith("```"))return;const fe=/^(\*{3,}|-{3,}|_{3,})$/.test(Z);if(Z.match(/^[\*\-_]{3,}$/)){const V=Z[0];Z.split("").every(pe=>pe===V||pe===" ")||y.push({severity:t.MarkerSeverity.Info,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:q.length+1,message:"Horizontal rule format: Use consistent characters (e.g., ---, ***, or ___)",source:"markdown-validator"})}if(te>0){const V=C[te-1].trim();/^#{1,6}\s/.test(V)&&Z&&!Z.startsWith("#")&&!fe&&y.push({severity:t.MarkerSeverity.Info,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:1,message:"Missing blank line after heading: Add blank line for better readability",source:"markdown-validator"})}if(te>0&&Z.includes("|")){const V=C[te-1].trim(),Y=/^(\d+\.|\*|\+|-)\s/.test(V),pe=/^\|.*\|/.test(Z);Y&&pe&&y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:1,message:"List-table conflict: Add blank line between list and table",source:"markdown-validator"})}const de=q.match(/^(#{1,6})([^\s#])/);de&&(y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:de[1].length+2,message:'Header missing space: Add space after # (e.g., "# Heading")',source:"markdown-validator"}),b.add(z)),q.match(/^#{7,}/)&&(y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:q.length+1,message:"Invalid header: Markdown only supports h1-h6 (use # to ######)",source:"markdown-validator"}),b.add(z));const rt=/!\[([^\]]*)\]\(([^)]*)\)/g;if(/!\[.*\([^)]*$/.test(q)&&!rt.test(q))y.push({severity:t.MarkerSeverity.Error,startLineNumber:z,startColumn:q.indexOf("![")+1,endLineNumber:z,endColumn:q.length+1,message:"Broken image syntax: Missing closing bracket ] or parenthesis )",source:"markdown-validator"}),b.add(z);else{const V=q.match(/!\[([^\]]*)\]\(\s*\)/);if(V){const pe=q.indexOf(V[0])+1;y.push({severity:t.MarkerSeverity.Error,startLineNumber:z,startColumn:pe,endLineNumber:z,endColumn:pe+V[0].length,message:"Empty image URL: Add image source (e.g., ![Alt](image.png))",source:"markdown-validator"}),b.add(z)}const Y=q.match(/!\[\]\(([^)]+)\)/);if(Y&&!b.has(z)){const pe=q.indexOf(Y[0])+1;y.push({severity:t.MarkerSeverity.Info,startLineNumber:z,startColumn:pe,endLineNumber:z,endColumn:pe+Y[0].length,message:"Empty alt text: Add description for accessibility (e.g., ![Logo](url))",source:"markdown-validator"})}}const tt=/\[([^\]]+)\]\(([^)]+)\)/g;if(/\[[^\]]*\([^)]*$/.test(q)&&!tt.test(q)&&!b.has(z)){const V=q.lastIndexOf("[");q.indexOf("(",V)>-1&&(y.push({severity:t.MarkerSeverity.Error,startLineNumber:z,startColumn:V+1,endLineNumber:z,endColumn:q.length+1,message:"Broken link syntax: Missing closing bracket ] or parenthesis )",source:"markdown-validator"}),b.add(z))}const at=q.match(/\[\]\(\s*\)/);if(at&&!b.has(z)){const V=q.indexOf(at[0])+1;y.push({severity:t.MarkerSeverity.Error,startLineNumber:z,startColumn:V,endLineNumber:z,endColumn:V+at[0].length,message:"Empty link: Add text and URL (e.g., [Click here](url))",source:"markdown-validator"})}if(!fe){const V=q.match(/\*\*/g);if(V&&V.length%2!==0){const Y=q.lastIndexOf("**");y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:Y+1,endLineNumber:z,endColumn:q.length+1,message:"Unclosed bold: Add closing ** (e.g., **bold text**)",source:"markdown-validator"})}}if(!fe){const V=(q.match(/\*/g)||[]).length,Y=(q.match(/\*\*/g)||[]).length,pe=V-Y*2;if(pe%2!==0&&pe>0){let Be=-1;for(let Ce=q.length-1;Ce>=0;Ce--)if(q[Ce]==="*"&&!(Ce>0&&q[Ce-1]==="*"||Ce<q.length-1&&q[Ce+1]==="*")){Be=Ce;break}Be!==-1&&y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:Be+1,endLineNumber:z,endColumn:q.length+1,message:"Unclosed italic: Add closing * (e.g., *italic text*)",source:"markdown-validator"})}}const xt=q.match(new RegExp("(?<!`)`(?!`)","g"));if(xt&&xt.length%2!==0){const V=q.lastIndexOf("`");q[V+1]!=="`"&&q[V-1]!=="`"&&y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:V+1,endLineNumber:z,endColumn:q.length+1,message:"Unclosed inline code: Add closing ` (e.g., `code`)",source:"markdown-validator"})}const gt=q.match(/^(>+)([^\s>])/);gt&&y.push({severity:t.MarkerSeverity.Info,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:gt[1].length+2,message:'Blockquote missing space: Add space after > (e.g., "> Quote")',source:"markdown-validator"});const Ue=Z.match(/^([-+*])\s/);if(Ue){const V=Ue[1];V!=="-"&&(H||H===null)&&y.push({severity:t.MarkerSeverity.Info,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:3,message:"Mixed list markers: Use consistent marker (-)",source:"markdown-validator"}),H=V,K=null}else if(Z.match(/^\d+\.\s/)){const V=Z.match(/^(\d+)\.\s/);if(V){const Y=parseInt(V[1]);K!==null&&Y!==K+1&&Y!==1&&y.push({severity:t.MarkerSeverity.Info,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:V[0].length,message:`List numbering skip: Expected ${K+1}, got ${Y}`,source:"markdown-validator"}),K=Y,H=null}}else Z&&!Z.startsWith(">")&&!Z.startsWith("#")&&(H=null,K=null);if(Z.includes("|")){const V=_(Z);if(/^[\s:-]+$/.test(V.join(""))){/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/.test(Z)||y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:q.length+1,message:"Malformed table separator: Use format | --- | --- | with spaces",source:"markdown-validator"});const Be=te>0?C[te-1].trim():"";if(!Be.includes("|"))y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:q.length+1,message:"Table separator without header: Add header row above",source:"markdown-validator"});else{const Ce=_(Be).length,ot=V.length;ot!==Ce&&y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:q.length+1,message:`Table separator column mismatch: Expected ${Ce} columns, got ${ot}`,source:"markdown-validator"}),Le=Ce,re=!0}}else if(re&&Le>0){const pe=te<C.length-1?C[te+1].trim():"";pe&&/^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/.test(pe)?(re=!1,Le=0):V.length!==Le&&y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:q.length+1,message:`Table column mismatch: Expected ${Le} columns, got ${V.length}`,source:"markdown-validator"})}}else re&&Z&&(re=!1,Le=0);const nt=q.match(/<(\w+)(?:\s[^>]*)?>(?!.*<\/\1>)/g);nt&&nt.forEach(V=>{const Y=V.match(/<(\w+)/)[1];if(!["img","br","hr","input","meta","link"].includes(Y.toLowerCase())){const pe=q.indexOf(V);y.push({severity:t.MarkerSeverity.Warning,startLineNumber:z,startColumn:pe+1,endLineNumber:z,endColumn:pe+V.length+1,message:`Unclosed HTML tag: <${Y}> (add </${Y}>)`,source:"markdown-validator"})}})}),B.length>0){const q=B[B.length-1];y.push({severity:t.MarkerSeverity.Error,startLineNumber:q,startColumn:1,endLineNumber:q,endColumn:C[q-1].length+1,message:"Unclosed code block: Add closing ``` on a new line",source:"markdown-validator"})}t.editor.setModelMarkers(S,"markdown-validator",y)};let d;k.onDidChangeModelContent(()=>{s&&(clearTimeout(d),d=setTimeout(c,500))}),k._validateMarkdown=c,k._setValidationEnabled=S=>{s=S,S?c():t.editor.setModelMarkers(k.getModel(),"markdown-validator",[])};let p=null,w=0,f=[],E=[];const M=()=>{const S=document.createElement("div");return S.className="vw-wizard-container wizard-docked",S.innerHTML=`
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
            `,document.body.appendChild(S),S},W=(S,I)=>{let C=null,y="";if(console.log("[generateFix] Message:",S.message),console.log("[generateFix] Line:",I),S.message.includes("Header missing space")){const b=I.match(/^(#{1,6})([^\s#].+)/);b&&(C=b[1]+" "+b[2],y="Add space after #",console.log("[generateFix] Header fix:",C))}else if(S.message.includes("Invalid header")){const b=I.match(/^(#{7,})(.+)/);b&&(C="###### "+b[2].trim(),y="Convert to h6 (maximum level)")}else if(S.message.includes("Blockquote missing space")){const b=I.match(/^(>+)([^\s>].+)/);b&&(C=b[1]+" "+b[2],y="Add space after >")}else if(S.message.includes("Mixed list markers")){const b=I.match(/^(\s*)([+*-])(\s*.+)/);if(b){const _=b[1],$=b[3].trimStart();C=_+"- "+$,y="Standardize to - marker"}}else if(S.message.includes("Table column mismatch")){const b=S.message.match(/Expected (\d+) columns, got (\d+)/);if(b){const _=parseInt(b[1]),$=parseInt(b[2]);if($<_){const B=_-$,H=I.trimEnd().replace(/\|$/,"").trimEnd(),K=" | "+Array(B).fill('<span style="color:red">COL_FIX!</span>').join(" | ");C=H+K+" |",y=`Add ${B} missing column(s)`}else{const B=I.split("|"),H=I.trimStart().startsWith("|"),K=I.trimEnd().endsWith("|");let re=B.map(Le=>Le.trim()).filter(Le=>Le!=="");re=re.slice(0,_),H&&K?C="| "+re.join(" | ")+" |":H?C="| "+re.join(" | "):K?C=re.join(" | ")+" |":C=re.join(" | "),y=`Remove ${$-_} extra column(s)`}}}else if(S.message.includes("Horizontal rule format"))C="---",y="Standardize to ---";else if(S.message.includes("Malformed table separator")){const b=S.startLineNumber,_=k.getModel(),$=b>1?_.getLineContent(b-1).trim():"";if($.includes("|")){const B=$.split("|").filter(H=>H.trim()).length;C="| "+Array(B).fill("---").join(" | ")+" |",y=`Fix separator to match ${B} columns`}else{const B=(I.match(/\|/g)||[]).length,H=Math.max(3,B-1);C="| "+Array(H).fill("---").join(" | ")+" |",y="Fix table separator format"}}else if(S.message.includes("Table separator column mismatch")){const b=S.message.match(/Expected (\d+) columns/);if(b){const _=parseInt(b[1]);C="| "+Array(_).fill("---").join(" | ")+" |",y=`Update separator to match ${_} columns`}}else if(S.message.includes("Empty alt text"))C=I.replace(/!\[\]/,"![Image description]"),y="Add placeholder alt text";else if(S.message.includes("Unclosed HTML tag")){const b=S.message.match(/Unclosed HTML tag: <(\w+)>/);if(b){const _=b[1];C=I+`</${_}>`,y=`Add closing </${_}>`}}else if(S.message.includes("List numbering skip")){const b=S.message.match(/Expected (\d+)/);if(b){const _=b[1];C=I.replace(/^(\s*)\d+\./,`$1${_}.`),y=`Change to ${_}.`}}else if(S.message.includes("Unclosed inline code")){const b=I.trimEnd();b.match(/\[.*`[^\]]*\]/)?C=b.replace(/\]/,"`]"):b.endsWith("|")?C=b.replace(/\s*\|$/,"`|"):C=I+"`",y="Add closing backtick"}else if(S.message.includes("Unclosed bold")){const b=I.trimEnd(),_=I.lastIndexOf("**");let $=b.length;const B=b.match(/\s+\|/);if(B){const H=b.indexOf(B[0]);H>_&&($=H)}C=b.substring(0,$)+"**"+b.substring($),y="Add closing **"}else if(S.message.includes("Unclosed italic")){const b=I.trimEnd();let _=-1;for(let $=b.length-1;$>=0;$--)if(b[$]==="*"&&!($>0&&b[$-1]==="*"||$<b.length-1&&b[$+1]==="*")){_=$;break}if(_!==-1){let $=b.length;const B=b.match(/\s+\|/);if(B){const H=b.indexOf(B[0]);H>_&&($=H)}C=b.substring(0,$)+"*"+b.substring($),y="Add closing *"}}else if(S.message.includes("Missing blank line after heading"))C="__INSERT_BLANK_LINE__",y="Insert blank line above";else if(S.message.includes("List-table conflict"))C="__INSERT_BLANK_LINE__",y="Insert blank line above";else if(S.message.includes("Unclosed code block"))C=I+"\n```",y="Add closing ``` on new line";else if(S.message.includes("Broken image syntax")){console.log("[generateFix] Broken image - testing regex");let b=/!\[([^\]]*)\]\s*\(.*$/,_=I.match(b);if(_||(b=/!\[([^\(]*)\(.*$/,_=I.match(b)),console.log("[generateFix] Broken image match:",_),_){const $=_[1].trim();C=I.replace(b,`![${$}](IMAGE_URL_FIX!)`),y="Add missing brackets/parenthesis and placeholder URL",console.log("[generateFix] Broken image fix:",C)}}else if(S.message.includes("Broken link syntax")){console.log("[generateFix] Broken link - Line:",I),console.log("[generateFix] Marker startColumn:",S.startColumn);const b=I.lastIndexOf("[");if(b!==-1){const _=I.substring(0,b),$=I.substring(b);console.log("[generateFix] Before broken link:",_),console.log("[generateFix] Broken link part:",$);let B=$.match(/^\[([^\]]+)\]\s*\(/);if(B){const H=B[1].trim();C=_+`[${H}](URL_FIX!)`,y="Add missing closing parenthesis and placeholder URL",console.log("[generateFix] Pattern 1 - Fix:",C)}else if(B=$.match(/^\[([^\[\(]+)\(/),B){const H=B[1].trim();C=_+`[${H}](URL_FIX!)`,y="Add missing bracket and parenthesis with placeholder URL",console.log("[generateFix] Pattern 2 - Fix:",C)}else if(B=$.match(/^\[([^\]]+)$/),B){const H=B[1].trim();C=_+`[${H}](URL_FIX!)`,y="Complete link with closing bracket, parenthesis and URL",console.log("[generateFix] Pattern 3 - Fix:",C)}}}else S.message.includes("Empty image URL")?(C=I.replace(/!\[([^\]]*)\]\(\s*\)/,"![$1](image.png)"),y="Add placeholder image URL"):S.message.includes("Empty link")&&(I.includes("[]()")?(C=I.replace(/\[\]\(\s*\)/,"[Link text](url)"),y="Add link text and URL"):(C=I.replace(/\[([^\]]+)\]\(\s*\)/,"[$1](url)"),y="Add URL"));return{suggestedFix:C,fixDescription:y}},j=(S,I)=>{const C=k.getModel();let y=C.getLineContent(S),b=[];console.log("[applyMultiple] Line",S,"- Markers:",I.length),console.log("[applyMultiple] BEFORE:",y);const _=["Header missing space","Invalid header","Blockquote missing space","Mixed list markers","Broken image syntax","Broken link syntax","Empty image URL","Empty link","Empty alt text","Unclosed bold","Unclosed italic","Unclosed inline code"],$=I.sort((K,re)=>{const Le=_.findIndex(te=>K.message.includes(te)),q=_.findIndex(te=>re.message.includes(te));return(Le===-1?999:Le)-(q===-1?999:q)});console.log("[applyMultiple] Sorted markers:",$.map(K=>K.message));const B=$.filter(K=>K.message.includes("Missing blank line after heading")||K.message.includes("List-table conflict")),H=$.filter(K=>!K.message.includes("Missing blank line after heading")&&!K.message.includes("List-table conflict"));for(const K of H){const{suggestedFix:re,fixDescription:Le}=W(K,y);re&&re!=="__INSERT_BLANK_LINE__"&&(console.log("[applyMultiple] Applying:",Le),console.log("[applyMultiple] From:",y),console.log("[applyMultiple] To:",re),y=re,b.push(Le))}if(console.log("[applyMultiple] AFTER:",y),y!==C.getLineContent(S)){const K=new t.Range(S,1,S,C.getLineContent(S).length+1);k.executeEdits("validation-fix-multiple",[{range:K,text:y}])}return B.length>0&&(le(S),b.push("Insert blank line above")),{fixed:b.length>0,description:b.join(", ")}},le=S=>{console.log(`[insertBlankLineAbove] Called for line ${S}`);const I=k.getModel();if(S>1){const b=I.getLineContent(S-1);if(console.log(`[insertBlankLineAbove] Previous line (${S-1}): "${b}"`),b.trim()===""){console.log("[insertBlankLineAbove] Previous line is blank, skipping");return}}console.log(`[insertBlankLineAbove] Inserting blank line before line ${S}`);const C=new t.Range(S,1,S,1),y=I.getLineContent(S);console.log(`[insertBlankLineAbove] Current line content: "${y}"`),console.log(`[insertBlankLineAbove] Range: (${S}, 1, ${S}, 1)`),k.executeEdits("insert-blank-line",[{range:C,text:`
`}]),setTimeout(()=>{const b=I.getLineContent(S),_=I.getLineContent(S+1);console.log(`[insertBlankLineAbove] After edit - Line ${S}: "${b}"`),console.log(`[insertBlankLineAbove] After edit - Line ${S+1}: "${_}"`)},100)},oe=S=>{if(!p||l!=="inline")return;const I=k.getTopForLineNumber(S),C=k.getOption(t.editor.EditorOption.lineHeight),y=k.getScrollTop(),_=k.getDomNode().getBoundingClientRect(),$=_.top+(I-y)+C,B=_.left+10,H=_.width-20;p.style.top=`${$}px`,p.style.left=`${B}px`,p.style.maxWidth=`${H}px`},we=()=>{l=l==="docked"?"inline":"docked",J()},J=()=>{p&&(l==="docked"?(p.className="vw-wizard-container wizard-docked",p.style.top="",p.style.left="",p.style.maxWidth="",p.parentElement!==document.body&&document.body.appendChild(p)):(p.className="vw-wizard-container wizard-inline",f[w]&&oe(f[w].marker.startLineNumber)))},X=(S,I)=>{const C={error:"rgba(239, 68, 68, 0.2)",fixed:"rgba(34, 197, 94, 0.2)",skipped:"rgba(59, 130, 246, 0.2)"},y={range:new t.Range(S,1,S,1),options:{isWholeLine:!0,className:`validation-line-${I}`,glyphMarginClassName:`validation-glyph-${I}`,overviewRuler:{color:C[I],position:t.editor.OverviewRulerLane.Left},minimap:{color:C[I],position:t.editor.MinimapPosition.Inline}}};E=k.deltaDecorations(E,[y])},ie=S=>{if(S<0||S>=f.length)return;w=S;const I=f[S];k.getModel(),k.revealLineInCenter(I.marker.startLineNumber),k.setPosition({lineNumber:I.marker.startLineNumber,column:I.marker.startColumn}),I.state==="pending"&&X(I.marker.startLineNumber,"error");const C=p.querySelector(".vw-state-indicator"),y=p.querySelector(".vw-counter-badge"),b=p.querySelector(".vw-issue-content"),_=p.querySelector(".vw-btn-apply"),$=p.querySelector(".vw-btn-apply-all"),B=p.querySelector(".vw-btn-prev"),H=p.querySelector(".vw-btn-next");if(y.textContent=`${S+1}/${f.length}`,I.state==="fixed")C.className="vw-state-indicator vw-state-fixed",b.innerHTML=`<strong>Fixed:</strong> ${I.marker.message}`,_.disabled=!0,_.style.opacity="0.3";else if(I.state==="skipped")C.className="vw-state-indicator vw-state-error",b.innerHTML=`<strong>Skipped:</strong> ${I.marker.message}`,_.disabled=!0,_.style.opacity="0.3";else if(C.className="vw-state-indicator vw-state-error",I.suggestedFix){const re=I.suggestedFix.length>50?I.suggestedFix.substring(0,50)+"...":I.suggestedFix;b.innerHTML=`${I.marker.message} → <code>${re}</code>`,_.disabled=!1,_.style.opacity="1"}else b.innerHTML=`${I.marker.message} <em>(no auto-fix)</em>`,_.disabled=!0,_.style.opacity="0.3";S===0?(B.classList.add("disabled"),B.disabled=!0):(B.classList.remove("disabled"),B.disabled=!1),S===f.length-1?(H.classList.add("disabled"),H.disabled=!0):(H.classList.remove("disabled"),H.disabled=!1);const K=f.some(re=>re.state==="pending"&&re.suggestedFix);$.disabled=!K,$.style.opacity=K?"1":"0.3",l==="inline"&&oe(I.marker.startLineNumber)},Q=()=>{const S=f[w];if(!S||!S.suggestedFix||S.state!=="pending")return;const I=k.getModel(),C=S.marker.startLineNumber,y=I.getLineContent(C);if(S.suggestedFix==="__INSERT_BLANK_LINE__")console.log("[applyCurrentFix] Blank line insertion detected for line",C),le(C);else{const _=new t.Range(C,1,C,y.length+1);k.executeEdits("validation-fix",[{range:_,text:S.suggestedFix}])}S.state="fixed",X(C,"fixed");const b=f.findIndex((_,$)=>$>w&&_.state==="pending");if(b!==-1)console.log("[applyCurrentFix] Moving to next pending issue at index:",b),ie(b);else if(f.every($=>$.state!=="pending")){const $=f.filter(K=>K.state==="fixed").length,B=f.filter(K=>K.state==="skipped").length;x();let H=`Validation complete! Fixed ${$} issue${$!==1?"s":""}`;B>0&&(H+=`, skipped ${B}`),H+=" Ô£ö",o(H)}else ie(w)},ye=()=>{k.getModel();let S=0,I=0;const C=10,y=()=>{I++,console.log("[applyAll] ========== ITERATION",I,"==========");const b=new Map;if(f.forEach(($,B)=>{if($.state==="pending"&&$.suggestedFix){const H=$.marker.startLineNumber;b.has(H)||b.set(H,[]),b.get(H).push({issue:$,index:B})}}),console.log("[applyAll] Issues by line:",b.size),console.log("[applyAll] Line numbers:",Array.from(b.keys())),b.size===0){x(),S>0?(console.log("[applyAll] Ô£ô COMPLETE - Fixed",S,"issues"),o(`Excellent! All ${S} fixes applied Ô£ö`)):o("No issues found to fix!");return}const _=Array.from(b.keys()).sort(($,B)=>B-$);console.log("[applyAll] Processing lines (bottom to top):",_),_.forEach($=>{const B=b.get($),H=B.map(re=>re.issue.marker);console.log("[applyAll] Processing line",$),j($,H).fixed?(B.forEach(({issue:re})=>{re.state="fixed"}),X($,"fixed"),S+=B.length,console.log("[applyAll] Ô£ô Fixed line",$,"-",B.length,"issues")):console.log("[applyAll] Ô£ù Failed to fix line",$)}),console.log("[applyAll] Total fixed so far:",S),I<C?setTimeout(()=>{console.log("[applyAll] Re-validating..."),f=[],c();const $=f.filter(B=>B.state==="pending"&&B.suggestedFix);console.log("[applyAll] New pending issues:",$.length),$.length>0?(console.log("[applyAll] Continuing to next iteration..."),y()):(x(),console.log("[applyAll] Ô£ô ALL DONE - Fixed",S,"issues total"),o(`Excellent! All ${S} fixes applied Ô£ö`))},150):(x(),console.log("[applyAll] ÔÜá Max iterations reached"),o(`Applied ${S} fixes! Some issues may remain.`))};y()},Te=()=>{const S=f[w];if(!S||S.state!=="pending")return;S.state="skipped",X(S.marker.startLineNumber,"skipped");const I=f.findIndex((C,y)=>y>w&&C.state==="pending");I!==-1?ie(I):f.every(y=>y.state!=="pending")?(x(),o("Wizard complete! Review the highlighted changes.")):ie(w)},x=()=>{p&&(p.classList.add("hiding"),setTimeout(()=>{p&&(p.remove(),p=null)},200)),l="docked",setTimeout(()=>{E=k.deltaDecorations(E,[])},5e3),f=[],w=0};k._interactiveFixWizard=async()=>{const S=k.getModel(),C=t.editor.getModelMarkers({resource:S.uri}).filter(y=>y.source==="markdown-validator");if(C.length===0){o("No validation issues found!");return}x(),f=C.map(y=>{const b=S.getLineContent(y.startLineNumber),{suggestedFix:_,fixDescription:$}=W(y,b);return{marker:y,suggestedFix:_,fixDescription:$,state:"pending"}}),l="docked",p=M(),p.querySelector(".vw-btn-mode").addEventListener("click",we),p.querySelector(".vw-btn-apply").addEventListener("click",Q),p.querySelector(".vw-btn-apply-all").addEventListener("click",ye),p.querySelector(".vw-btn-skip").addEventListener("click",Te),p.querySelector(".vw-btn-close").addEventListener("click",x),p.querySelector(".vw-btn-prev").addEventListener("click",()=>{w>0&&ie(w-1)}),p.querySelector(".vw-btn-next").addEventListener("click",()=>{w<f.length-1&&ie(w+1)}),k.onDidScrollChange(()=>{p&&f[w]&&l==="inline"&&oe(f[w].marker.startLineNumber)}),ie(0)},k._exportValidationErrors=()=>{const S=k.getModel(),C=t.editor.getModelMarkers({resource:S.uri}).filter(B=>B.source==="markdown-validator");if(C.length===0)return"No validation errors found.";let y=`# Markdown Validation Report

`;y+=`Total Issues: ${C.length}

`;const b=C.filter(B=>B.severity===t.MarkerSeverity.Error),_=C.filter(B=>B.severity===t.MarkerSeverity.Warning),$=C.filter(B=>B.severity===t.MarkerSeverity.Info);return b.length>0&&(y+=`## Errors (${b.length})

`,b.forEach((B,H)=>{const K=S.getLineContent(B.startLineNumber);y+=`${H+1}. **Line ${B.startLineNumber}**: ${B.message}
`,y+=`   \`\`\`
   ${K}
   \`\`\`

`})),_.length>0&&(y+=`## Warnings (${_.length})

`,_.forEach((B,H)=>{const K=S.getLineContent(B.startLineNumber);y+=`${H+1}. **Line ${B.startLineNumber}**: ${B.message}
`,y+=`   \`\`\`
   ${K}
   \`\`\`

`})),$.length>0&&(y+=`## Info (${$.length})

`,$.forEach((B,H)=>{const K=S.getLineContent(B.startLineNumber);y+=`${H+1}. **Line ${B.startLineNumber}**: ${B.message}
`,y+=`   \`\`\`
   ${K}
   \`\`\`

`})),y},k.addCommand(t.KeyMod.CtrlCmd|t.KeyMod.Shift|t.KeyCode.KeyV,()=>{if(!s){console.log("Validation not enabled");return}const S=k._exportValidationErrors();navigator.clipboard.writeText(S).then(()=>{console.log("Validation report copied to clipboard")}).catch(I=>{console.error("Failed to copy validation report:",I)})})}const Er=()=>{let k=!1,t=!1,o=!1,s="web",l=100,c={width:21,height:29.7,marginTop:4.5,marginBottom:2.54,marginLeft:2.54,marginRight:1.47},d=null,p=[],w=-1;const f=50;let E=!1;const M="com.markdownlivepreview",W="last_state",j="scroll_bar_settings",le="cursor_sync_settings",oe="theme_settings",we="style_settings",J="flip_panels_settings",X="vertical_layout_settings",ie="pdf_font_settings",Q="helper_messages_settings",ye="toc_settings",Te="validation_settings";let x;const S=()=>{if(!x)return;const e=x.getValue(),n=e.split(`
`),r=e.trim()?e.trim().split(/\s+/).length:0;document.getElementById("status-word-count").textContent=r,document.getElementById("status-char-count").textContent=e.length,document.getElementById("status-line-count").textContent=n.length;const i=Math.ceil(r/200);document.getElementById("status-reading-time").textContent=i+" min";const a=Math.max(1,Math.ceil(r/500));document.getElementById("status-pdf-pages").textContent="~"+a},I=e=>{w<p.length-1&&(p=p.slice(0,w+1)),p.push(e),p.length>f?p.shift():w++},C=()=>{if(w>0){E=!0,w--;const e=p[w],r=x.getModel().getFullModelRange();return x.executeEdits("undo-operation",[{range:r,text:e}]),E=!1,ge(`Undo successful! (${w+1}/${p.length} states)`),!0}else return ge("Nothing to undo!"),!1},y=()=>{if(w<p.length-1){E=!0,w++;const e=p[w],r=x.getModel().getFullModelRange();return x.executeEdits("redo-operation",[{range:r,text:e}]),E=!1,ge(`Redo successful! (${w+1}/${p.length} states)`),!0}else return ge("Nothing to redo!"),!1};let b={h1:10,h2:10,h3:10,h4:10,paragraph:8,list:8,blockquote:8,code:8,table:8,fontFamily:"helvetica",tableBorders:"horizontal",tableBorderWeight:.15,tableBorderColor:"#d0d0d0",tableHeaderBg:"#fafafa",tableHeaderColor:"#000000"};const _=`# Markdown syntax guide

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
`;self.MonacoEnvironment={getWorker(e,n){return new Proxy({},{get:()=>()=>{}})}},se.editor.defineTheme("custom-light",{base:"vs",inherit:!0,rules:[],colors:{"editor.background":"#f7f7f7","editor.selectionBackground":"#add6ff","editor.lineHighlightBackground":"#f7f7f7"}}),se.editor.defineTheme("custom-dark",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":"#1A1A1A","editor.selectionBackground":"#add6ff","editor.lineHighlightBackground":"#1A1A1A"}});let $=()=>(x=se.editor.create(document.querySelector("#editor"),{fontSize:14,language:"markdown",minimap:{enabled:!1},scrollBeyondLastLine:!1,automaticLayout:!0,scrollbar:{vertical:"visible",horizontal:"visible",verticalScrollbarSize:10,horizontalScrollbarSize:10,useShadows:!1},wordWrap:"on",hover:{enabled:!0},quickSuggestions:{other:!0,comments:!1,strings:!1},suggestOnTriggerCharacters:!0,acceptSuggestionOnCommitCharacter:!1,acceptSuggestionOnEnter:"on",tabCompletion:"on",wordBasedSuggestions:"off",folding:!1}),se.languages.registerCompletionItemProvider("markdown",{triggerCharacters:["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],provideCompletionItems:(e,n,r,i)=>new Promise((a,g)=>{setTimeout(()=>{const h=e.getValueInRange({startLineNumber:n.lineNumber,startColumn:1,endLineNumber:n.lineNumber,endColumn:n.column}).match(/\b(\w{2,})$/);if(!h){a({suggestions:[]});return}const v=h[1],T=e.getValue().match(/\b\w{3,}\b/g)||[],D=[...new Set(T)].filter(G=>G.toLowerCase().startsWith(v.toLowerCase())&&G.toLowerCase()!==v.toLowerCase()).slice(0,5);if(D.length===0){a({suggestions:[]});return}const F=D.map((G,R)=>({label:G,kind:se.languages.CompletionItemKind.Text,insertText:G,range:{startLineNumber:n.lineNumber,startColumn:n.column-v.length,endLineNumber:n.lineNumber,endColumn:n.column}}));a({suggestions:F})},50)})}),x.onDidChangeModelContent(()=>{x.getValue()!=_;let e=x.getValue();K(e),Ri(e),N&&Lo(),S()}),Lr(x,se,ge),x),B=e=>{const n=/^---\s*\n([\s\S]*?)\n---\s*\n/,r=e.match(n);if(!r)return{metadata:null,content:e};const i=r[1],a=e.slice(r[0].length),g={};return i.split(`
`).forEach(h=>{const v=h.indexOf(":");if(v>0){const L=h.slice(0,v).trim(),T=h.slice(v+1).trim();g[L]=T}}),{metadata:g,content:a}};const H=()=>{const e=document.querySelector("#output"),n=document.querySelector(".paper-zoom-label");if(e&&e.classList.contains("paper-layout-active")){const r=l/100;e.style.setProperty("--paper-zoom",r)}n&&(n.textContent=`${l}%`)};let K=e=>{const{metadata:n,content:r}=B(e);ce.setOptions({headerIds:!1,mangle:!1,breaks:!0,gfm:!0,pedantic:!1,smartLists:!0,smartypants:!1,highlight:function(P,D){if(typeof window.hljs>"u")return console.warn("highlight.js not loaded"),P;if(D&&window.hljs.getLanguage(D))try{return window.hljs.highlight(P,{language:D}).value}catch(F){return console.error("Highlight error:",F),P}try{return window.hljs.highlightAuto(P).value}catch(F){return console.error("Auto-highlight error:",F),P}}});let i=ce.parse(e),a=ao.sanitize(i,{ADD_ATTR:["class"],ADD_TAGS:["span"]});const g=document.createElement("div");g.innerHTML=a;const m=e.split(`
`),h=Array.from(g.children);let v=0;h.forEach(P=>{const D=P.tagName.toLowerCase();let F=null;const G=P.textContent.trim();for(let R=v;R<m.length;R++){const O=m[R].trim();if(O){if(D==="h1"&&O.startsWith("# ")&&!O.startsWith("##")){const ee=O.substring(2).trim();if(G===ee){F=R+1,v=R+1;break}}else if(D==="h2"&&O.startsWith("## ")&&!O.startsWith("###")){const ee=O.substring(3).trim();if(G===ee){F=R+1,v=R+1;break}}else if(D==="h3"&&O.startsWith("### ")&&!O.startsWith("####")){const ee=O.substring(4).trim();if(G===ee){F=R+1,v=R+1;break}}else if(D==="h4"&&O.startsWith("#### ")&&!O.startsWith("#####")){const ee=O.substring(5).trim();if(G===ee){F=R+1,v=R+1;break}}else if(D==="h5"&&O.startsWith("##### ")&&!O.startsWith("######")){const ee=O.substring(6).trim();if(G===ee){F=R+1,v=R+1;break}}else if(D==="h6"&&O.startsWith("###### ")){const ee=O.substring(7).trim();if(G===ee){F=R+1,v=R+1;break}}else if(D==="ul"&&(O.startsWith("* ")||O.startsWith("- ")||O.startsWith("+ "))){F=R+1,v=R+1;break}else if(D==="ol"&&/^\d+\.\s/.test(O)){F=R+1,v=R+1;break}else if(D==="blockquote"&&O.startsWith(">")){F=R+1,v=R+1;break}else if(D==="pre"&&O.startsWith("```")){F=R+1,v=R+1;break}else if(D==="table"&&O.includes("|")){F=R+1,v=R+1;break}else if(D==="hr"&&(O==="---"||O==="***"||O==="___")){F=R+1,v=R+1;break}else if(D==="p")if(P.querySelector("img")){if(O.startsWith("![")){F=R+1,v=R+1;break}}else{const ke=G.replace(/[*_`[\]()]/g,"").substring(0,20).trim(),Se=O.replace(/[*_`[\]()]/g,"").substring(0,20).trim();if(Se&&ke.toLowerCase().startsWith(Se.toLowerCase())){F=R+1,v=R+1;break}}}}F&&P.setAttribute("data-source-line",F)});let L=g.innerHTML;if(n){if(n.title||n.date){const P=n.title||"Document",D=n.date||new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});L=`<h1>${P}</h1>
<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">${D}</div>
<hr>`+L}if(n["footer-left"]||n["footer-right"]){const P=n["footer-left"]||"",D=n["footer-right"]||"",F=n.date||new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),G=`<hr class="metadata-footer-separator" style="margin-top: 40px;">
<div class="metadata-footer" style="display: flex; justify-content: space-between; margin-top: 20px;">
  <div>
    <strong>${P}</strong><br>
    <span style="color: #666;">${n.title||"Document"}</span>
  </div>
  <div style="text-align: right;">
    <strong>${D}</strong><br>
    <span style="color: #666;">${F}</span>
  </div>
</div>`;L=L+G}}document.querySelector("#output").innerHTML=L;const T=document.querySelector("#output");s==="paper"&&T?T.classList.contains("paper-layout-active")||(T.classList.add("paper-layout-active"),H()):T&&T.classList.remove("paper-layout-active"),$e&&wo()},re=e=>{if(!t)return;const n=document.querySelector("#output");if(!n)return;const r=n.querySelector(".cursor-highlight");r&&r.classList.remove("cursor-highlight");const i=n.querySelectorAll("[data-source-line]");let a=null,g=1/0;const m=5;if(i.forEach(h=>{const v=parseInt(h.getAttribute("data-source-line")),L=Math.abs(v-e);v===e?(a=h,g=0):L<g&&L<=m&&(g=L,a=h)}),a&&g<=m){a.classList.add("cursor-highlight");const h=a.getBoundingClientRect(),v=document.querySelector("#preview");if(v){const L=v.getBoundingClientRect();h.top>=L.top&&h.bottom<=L.bottom||a.scrollIntoView({behavior:"smooth",block:"center"})}}},Le=e=>{if(!t)return;let n=e;for(;n&&!n.hasAttribute("data-source-line");)if(n=n.parentElement,n&&n.id==="output")return;if(n&&n.hasAttribute("data-source-line")){const r=parseInt(n.getAttribute("data-source-line"));x&&r&&(x.setPosition({lineNumber:r,column:1}),x.revealLineInCenter(r),x.focus(),re(r))}};window.syncCursorToPreview=re,window.syncCursorToEditor=Le;let q=()=>{I(x.getValue()),x.setValue(""),x.focus(),ge("Editor cleared! Use <strong>Undo</strong> to restore.")},te=()=>{const e=x.getValue();if(!e||e.trim()==="")return;const n=de(e);if(e===n){ge("Your markdown is already <strong>beautifully formatted</strong>!");return}Z(e,n)};const z=(e,n)=>{const r=e.split(/(\s+)/),i=n.split(/(\s+)/),a=Array(r.length+1).fill(null).map(()=>Array(i.length+1).fill(0));for(let v=1;v<=r.length;v++)for(let L=1;L<=i.length;L++)r[v-1]===i[L-1]?a[v][L]=a[v-1][L-1]+1:a[v][L]=Math.max(a[v-1][L],a[v][L-1]);const g=[];let m=r.length,h=i.length;for(;m>0||h>0;)m>0&&h>0&&r[m-1]===i[h-1]?(g.unshift({type:"common",text:r[m-1]}),m--,h--):h>0&&(m===0||a[m][h-1]>=a[m-1][h])?(g.unshift({type:"added",text:i[h-1]}),h--):m>0&&(g.unshift({type:"removed",text:r[m-1]}),m--);return g};let Z=(e,n)=>{const r=document.documentElement.getAttribute("data-theme")==="dark",i=r?{bg:"#1e1e1e",text:"#e0e0e0",border:"#333",contextText:"#999",addedBg:"#1a3d1a",addedText:"#7ee87e",removedBg:"#3d1a1a",removedText:"#ff7b7b",separatorBg:"#2a2a2a",separatorText:"#888",buttonBg:"#2a2a2a",buttonBorder:"#444",buttonText:"#e0e0e0"}:{bg:"white",text:"black",border:"#ddd",contextText:"#666",addedBg:"#e6ffed",addedText:"#22863a",removedBg:"#ffeef0",removedText:"#d73a49",separatorBg:"#f0f0f0",separatorText:"#666",buttonBg:"white",buttonBorder:"#ddd",buttonText:"black"},a=document.getElementById("editor-wrapper"),g=document.getElementById("editor"),m=document.createElement("div");m.id="diff-editor-container",m.style.cssText="width: 100%; height: 100%; position: relative; display: flex; flex-direction: column;";const h=document.createElement("style");h.textContent=`
            #diff-editor-container ::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            #diff-editor-container ::-webkit-scrollbar-track {
                background: ${i.bg};
            }
            #diff-editor-container ::-webkit-scrollbar-thumb {
                background: ${r?"#444":"#ccc"};
                border-radius: 6px;
            }
            #diff-editor-container ::-webkit-scrollbar-thumb:hover {
                background: ${r?"#555":"#999"};
            }
            #diff-editor-container {
                scrollbar-width: thin;
                scrollbar-color: ${r?"#444 #1e1e1e":"#ccc #ffffff"};
            }
        `,m.appendChild(h);const v=document.createElement("div");v.style.cssText=`
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
        `;const L=document.createElement("div");L.style.cssText=`
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        `,L.innerHTML=`
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
        `,m.appendChild(v);const T=document.createElement("div");T.style.cssText=`flex: 1; overflow-y: auto; background: ${i.bg};`,m.appendChild(T),g.style.display="none",a.appendChild(m),K(n);const P=e.split(`
`),D=n.split(`
`),F=[];let G=0,R=0,O=0;const ee=Math.max(P.length,D.length),ke=2,Se=new Set;for(let he=0;he<ee;he++)if(P[he]!==D[he]){Se.add(he);for(let Ae=Math.max(0,he-ke);Ae<=Math.min(ee-1,he+ke);Ae++)Se.add(Ae)}const Fe=Array.from(Se).sort((he,Ae)=>he-Ae);let Ye=[];for(let he=0;he<Fe.length;he++){const Ae=Fe[he];Ye.length===0||Ae===Ye[Ye.length-1]+1?Ye.push(Ae):(F.push(Ye),Ye=[Ae])}Ye.length>0&&F.push(Ye);let We='<div style="font-family: monospace; font-size: 13px; line-height: 1.5;">';F.forEach((he,Ae)=>{Ae>0&&(We+=`<div style="padding: 8px 16px; background: ${i.separatorBg}; color: ${i.separatorText}; border-top: 1px solid ${i.border}; border-bottom: 1px solid ${i.border}; margin: 8px 0;">...</div>`),he.forEach(ze=>{const Me=P[ze],Qe=D[ze],St=ze+1;if(Me===Qe)We+=`<div style="padding: 2px 16px; background: transparent; color: ${i.contextText};">
                        <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.contextText};">${St}</span>
                        <span style="color: ${i.contextText}; margin-right: 8px;"> </span>
                        ${fe(Me||"")}
                    </div>`;else if(G++,Me!==void 0&&Qe!==void 0){const Bn=z(Me,Qe);let Pt="";Bn.forEach(pt=>{pt.type==="removed"?(Pt+=`<span style="background: ${i.removedBg}; color: ${i.removedText}; text-decoration: line-through;">${fe(pt.text)}</span>`,O++):pt.type==="common"&&(Pt+=fe(pt.text))});let Kt="";Bn.forEach(pt=>{pt.type==="added"?(Kt+=`<span style="background: ${i.addedBg}; color: ${i.addedText}; font-weight: 500;">${fe(pt.text)}</span>`,R++):pt.type==="common"&&(Kt+=fe(pt.text))}),We+=`<div style="padding: 2px 16px; background: ${i.removedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.removedText};">${St}</span>
                            <span style="color: ${i.removedText}; margin-right: 8px;">-</span>
                            ${Pt}
                        </div>`,We+=`<div style="padding: 2px 16px; background: ${i.addedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.addedText};">${St}</span>
                            <span style="color: ${i.addedText}; margin-right: 8px;">+</span>
                            ${Kt}
                        </div>`}else Me!==void 0?(O++,We+=`<div style="padding: 2px 16px; background: ${i.removedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.removedText};">${St}</span>
                            <span style="color: ${i.removedText}; margin-right: 8px;">-</span>
                            <span style="color: ${i.removedText}; text-decoration: line-through;">${fe(Me)}</span>
                        </div>`):Qe!==void 0&&(R++,We+=`<div style="padding: 2px 16px; background: ${i.addedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.addedText};">${St}</span>
                            <span style="color: ${i.addedText}; margin-right: 8px;">+</span>
                            <span style="color: ${i.addedText}; font-weight: 500;">${fe(Qe)}</span>
                        </div>`)})}),We+="</div>",v.innerHTML=`
            <div style="display: flex; gap: 12px; align-items: center; flex-shrink: 0;">
                <span style="font-weight: 600; color: ${i.text}; white-space: nowrap;">Beautify Changes</span>
                <span style="color: ${i.addedText}; white-space: nowrap; font-size: 12px;">+${R}</span>
                <span style="color: ${i.removedText}; white-space: nowrap; font-size: 12px;">-${O}</span>
                <span style="color: ${i.contextText}; white-space: nowrap; font-size: 12px;">${G} lines</span>
            </div>
        `,v.appendChild(L),T.innerHTML=We;const Yt=F.map(he=>he.map(Ae=>{const ze=P[Ae],Me=D[Ae];return ze===Me?"  "+(ze||""):ze!==void 0&&Me!==void 0?"- "+ze+`
+ `+Me:ze!==void 0?"- "+ze:"+ "+Me}).join(`
`)).join(`
...
`);document.getElementById("diff-copy-btn").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(Yt);const he=document.getElementById("diff-copy-btn"),Ae=he.style.background,ze=he.style.color;he.style.background="#28a745",he.style.color="white",setTimeout(()=>{he.style.background=Ae,he.style.color=ze},1500)}catch{ge("Failed to copy to clipboard")}}),document.getElementById("diff-apply-btn").addEventListener("click",()=>{I(x.getValue());const Ae=x.getModel().getFullModelRange();x.executeEdits("beautify-apply",[{range:Ae,text:n}]),m.remove(),g.style.display="block",x.focus(),ge("Changes <strong>applied</strong>! Your markdown has been beautified. Use <strong>Undo</strong> to revert.")}),document.getElementById("diff-discard-btn").addEventListener("click",()=>{m.remove(),g.style.display="block",K(e),x.focus(),ge("Changes <strong>discarded</strong>. Your original markdown is unchanged.")})};const fe=e=>{const n=document.createElement("div");return n.textContent=e,n.innerHTML};let de=e=>{if(!e)return"";const n=e.split(`
`),r=[];let i=0,a="start";const g=()=>{r.length>0&&r[r.length-1]!==""&&r.push("")},m=h=>{const v=h.map(T=>T.trim().replace(/^\||\|$/g,"").split("|").map(P=>P.trim())),L=[];return v.forEach(T=>{T.forEach((P,D)=>{L[D]=Math.max(L[D]||0,P.length)})}),v.map((T,P)=>{const D=T.every(G=>/^[ \-:]+$/.test(G));return"| "+T.map((G,R)=>{if(D){const O=G.startsWith(":"),ee=G.endsWith(":");return(O?":":"")+"-".repeat(Math.max(3,L[R]-(O?1:0)-(ee?1:0)))+(ee?":":"")}return G.padEnd(L[R]," ")}).join(" | ")+" |"}).join(`
`)};for(;i<n.length;){let h=n[i],v=h.trim();const L=h.match(/^(\s*)/),T=L?L[1]:"";if(i===0&&v==="---"){for(r.push(v),i++;i<n.length&&n[i].trim()!=="---";)r.push(n[i]),i++;i<n.length&&r.push("---"),a="yaml",i++;continue}if(v.startsWith("```")){for(g(),r.push(v),i++;i<n.length&&!n[i].trim().startsWith("```");)r.push(n[i]),i++;i<n.length&&r.push(n[i].trim()),a="code-end",i++;continue}if(v.startsWith(">")){const R=v.substring(1).trim();r.push(`${T}> ${R}`),a="blockquote",i++;continue}if(v.startsWith("|")&&T===""){g();let R=[];for(;i<n.length&&n[i].trim().startsWith("|");)R.push(n[i]),i++;r.push(m(R)),a="table";continue}const P=v.match(/^(#{1,6})\s*(.*)/);if(P&&T===""){g();let R=P[2].replace(/\s+#*$/,"").trim();R=R.replace(/^(\d+)\.(\S)/,"$1. $2"),r.push(`${P[1]} ${R}`),a="header",i++;continue}const D=v.match(/^(\d+)\.\s+([A-Z].*)/);if(D&&T===""&&a!=="list"){g();const R=D[1],O=D[2];r.push(`### ${R}. ${O}`),a="header",i++;continue}const F=h.match(/^(\s*)([*+-]|\d+\.)\s+(.*)$/);if(F){a!=="list"&&a!=="start"&&T===""&&g();let R=F[1],O=F[2],ee=F[3].trim();R.length>0&&console.log("[BEAUTIFY] Preserving list indent:",R.length,"spaces for:",ee.substring(0,30)),["+","*"].includes(O)&&(O="-"),ee=ee.replace(/^([A-Za-z][A-Za-z0-9\s]*):(\S)/,"$1: $2"),R=R.replace(/\t/g,"    "),r.push(`${R}${O} ${ee}`),a="list",i++;continue}if(/^[-*_]{3,}$/.test(v)&&T===""){g(),r.push("---"),a="hr",i++;continue}if(v===""){a!=="empty"&&a!=="start"&&(r.push(""),a="empty"),i++;continue}["header","hr","code-end","table"].includes(a)&&T===""&&g();let G=v.replace(/^([A-Za-z][A-Za-z0-9\s]*):(\S)/,"$1: $2");T?r.push(`${T}${G}`):r.push(G),a="text",i++}return r.join(`
`).trim()},rt=async()=>{try{const e=await navigator.clipboard.readText();if(e){const n=x.getPosition();x.executeEdits("",[{range:new se.Range(n.lineNumber,n.column,n.lineNumber,n.column),text:e}]),x.focus()}}catch{window.alert("Failed to read clipboard. Please make sure you have granted clipboard permissions.")}},vt=e=>{x.setValue(e),x.revealPosition({lineNumber:1,column:1}),x.focus()},tt=e=>{let n=document.querySelector("#sync-scroll-checkbox");n.checked=e,k=e,n.addEventListener("change",r=>{let i=r.currentTarget.checked;k=i,Ni(i)})},Nt=e=>{let n=document.querySelector("#sync-cursor-checkbox");n.checked=e,t=e,n.addEventListener("change",r=>{let i=r.currentTarget.checked;if(t=i,zi(i),!i){const a=document.querySelector("#output");if(a){const g=a.querySelector(".cursor-highlight");g&&g.classList.remove("cursor-highlight")}}})},at=e=>{let n=document.querySelector("#helper-messages-checkbox");n&&(n.checked=e,yt=e,n.addEventListener("change",r=>{let i=r.currentTarget.checked;gn(i)}))},xt=()=>{let e=document.querySelector("#style-tooltips-checkbox");if(!e)return;const n=localStorage.getItem("com.markdownlivepreview.style_tooltips_disabled")==="true";e.checked=!n,e.addEventListener("change",r=>{if(r.target.checked){localStorage.removeItem("com.markdownlivepreview.style_tooltips_disabled");const i=document.querySelector("#style-selector");i&&(i.value,setTimeout(()=>{const a=new Event("change");i.dispatchEvent(a)},100))}else localStorage.setItem("com.markdownlivepreview.style_tooltips_disabled","true")})};const gt="css/github-markdown-light.css?v=1.12.0",Ue="css/github-markdown-dark_dimmed.css?v=1.12.0",nt="css/gitbook-style.css?v=1.12.0",V="css/vscode-style.css?v=1.12.0";let Y="github",pe=(e,n=Y)=>{const r=document.getElementById("gh-markdown-link");if(!r){const a=document.createElement("link");a.id="gh-markdown-link",a.rel="stylesheet",a.href=Be(e,n),document.head.appendChild(a);return}const i=Be(e,n);r.getAttribute("href")!==i&&r.setAttribute("href",i)},Be=(e,n)=>n==="gitbook"?nt:n==="vscode"?V:e?Ue:gt,Ce=e=>{document.documentElement.setAttribute("data-theme",e?"dark":"light");const n=document.getElementById("hljs-light-theme"),r=document.getElementById("hljs-dark-theme");n&&r&&(n.disabled=e,r.disabled=!e)},ot=e=>{let n=document.querySelector("#theme-checkbox");n&&(n.checked=e,Ce(e),se&&se.editor&&typeof se.editor.setTheme=="function"&&se.editor.setTheme(e?"custom-dark":"custom-light"),pe(e,Y),n.addEventListener("change",r=>{let i=r.currentTarget.checked;Ce(i),Hi(i),pe(i,Y),se&&se.editor&&typeof se.editor.setTheme=="function"&&se.editor.setTheme(i?"custom-dark":"custom-light")}))},an=e=>{let n=document.querySelector("#style-selector");if(!n)return;Y=e,n.value=Y;const r={github:{name:"GitHub Style",description:"Traditional, balanced, professional",fonts:"Helvetica (Sans-serif)",textSize:"11pt body, 20pt H1",features:"Full table borders, gray header backgrounds",bestFor:"Documentation, README files, general content"},gitbook:{name:"GitBook Style",description:"Modern, clean, book-like",fonts:"Helvetica (Sans-serif)",textSize:"10pt body, 18pt H1",features:"Horizontal table borders, minimal styling",bestFor:"Books, guides, long-form documentation"},vscode:{name:"VS Code Style",description:"Compact, technical, code-focused",fonts:"Courier (Monospace)",textSize:"8pt body, 12pt H1",features:"Minimal borders, tight spacing",bestFor:"Technical docs, code-heavy content"}};localStorage.getItem("com.markdownlivepreview.style_tooltips_disabled");const i=g=>{if(localStorage.getItem("com.markdownlivepreview.style_tooltips_disabled")==="true")return;const h=r[g];if(!h)return;const v=document.querySelector(".style-info-tooltip");v&&v.remove();const L=document.createElement("div");L.className="style-info-tooltip";const T=document.documentElement.getAttribute("data-theme")==="dark",P=T?"#1e1e1e":"#ffffff",D=T?"#e0e0e0":"#333333",F=T?"#404040":"#ddd",G=T?"#a0a0a0":"#666666";L.innerHTML=`
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <strong style="font-size: 14px; color: ${D};">${h.name}</strong>
                    <button id="close-style-tooltip" style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; margin-left: 10px; color: ${D};">×</button>
                </div>
                <p style="margin: 4px 0; font-size: 12px; color: ${G};">${h.description}</p>
                <div style="margin-top: 8px; font-size: 11px; line-height: 1.6; color: ${D};">
                    <div><strong>Fonts:</strong> ${h.fonts}</div>
                    <div><strong>Text Size:</strong> ${h.textSize}</div>
                    <div><strong>Features:</strong> ${h.features}</div>
                    <div style="margin-top: 4px; color: ${G};"><em>Best for: ${h.bestFor}</em></div>
                </div>
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid ${F};">
                    <label style="font-size: 11px; cursor: pointer; display: flex; align-items: center; color: ${D};">
                        <input type="checkbox" id="never-show-style-tooltips" style="margin-right: 6px; cursor: pointer;">
                        Don't show again
                    </label>
                </div>
            `,L.style.cssText=`
                position: fixed;
                top: 60px;
                left: 20px;
                background: ${P};
                border: 1px solid ${F};
                border-radius: 8px;
                padding: 12px 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,${T?"0.5":"0.15"});
                z-index: 10000;
                max-width: 320px;
                animation: slideIn 0.3s ease-out;
            `,document.body.appendChild(L);let R=!1,O=null;const ee=()=>{O=setTimeout(()=>{R||(L.style.animation="slideOut 0.3s ease-out",setTimeout(()=>L.remove(),300))},2e3)},ke=()=>{O&&(clearTimeout(O),O=null)};ee(),L.addEventListener("mouseenter",()=>{ke()}),L.addEventListener("mouseleave",()=>{R||ee()}),L.addEventListener("mousedown",()=>{R=!0,ke()}),L.addEventListener("mouseup",()=>{R=!1}),document.getElementById("close-style-tooltip").addEventListener("click",Se=>{Se.stopPropagation(),ke(),L.style.animation="slideOut 0.3s ease-out",setTimeout(()=>L.remove(),300)}),document.getElementById("never-show-style-tooltips").addEventListener("change",Se=>{if(Se.target.checked){localStorage.setItem("com.markdownlivepreview.style_tooltips_disabled","true");const Fe=document.querySelector("#style-tooltips-checkbox");Fe&&(Fe.checked=!1),ke(),L.style.animation="slideOut 0.3s ease-out",setTimeout(()=>L.remove(),300)}})},a=document.documentElement.getAttribute("data-theme")==="dark";pe(a,Y),setTimeout(()=>{i(Y)},500),n.addEventListener("change",g=>{Y=g.target.value,Wi(Y);const m=document.documentElement.getAttribute("data-theme")==="dark";pe(m,Y),i(Y)})},ln=e=>{let n=document.querySelector("#flip-panels-checkbox");n&&(n.checked=e,cn(e),n.addEventListener("change",r=>{let i=r.currentTarget.checked;cn(i),Ui(i)}))},cn=e=>{const n=document.querySelector("#container");e?n.classList.add("flipped"):n.classList.remove("flipped")},Ot=e=>{let n=document.querySelector("#vertical-layout-checkbox");n&&(n.checked=e,mt(e),n.addEventListener("change",r=>{let i=r.currentTarget.checked;mt(i),ji(i),x&&setTimeout(()=>{x.layout()},350)}))},mt=e=>{const n=document.querySelector("#container");e?n.classList.add("vertical"):n.classList.remove("vertical")},ht=(e,n,r)=>{navigator.clipboard.writeText(e).then(()=>{n()},()=>{})},Ve=()=>{let e=document.querySelector("#copy-button a");e.innerHTML="Copied!",setTimeout(()=>{e.innerHTML="Copy"},1e3)},At=async(e,n)=>{let r;e==="gitbook"?r=nt:e==="vscode"?r=V:r=n?Ue:gt;try{const i=await fetch(r);if(!i.ok)throw new Error(`Failed to load CSS: ${i.status}`);return await i.text()}catch(i){return console.error("Failed to load CSS for export",i),""}},dn=async()=>{const e=document.querySelector("#output");if(!e)return;const n=document.documentElement.getAttribute("data-theme")==="dark",r=await At(Y,n);let i="";Y==="gitbook"?i=`
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
            `:Y==="vscode"?i=`
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
    <title>Exported Markdown - ${Y.charAt(0).toUpperCase()+Y.slice(1)} Style</title>
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
        ${r}
    </style>
</head>
<body>
    <div class="paper-container">
        <div class="markdown-body">
            ${e.innerHTML}
        </div>
    </div>
</body>
</html>`,g=new Blob([a],{type:"text/html"}),m=URL.createObjectURL(g),h=document.createElement("a");h.href=m;const v=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5),L=Y.charAt(0).toUpperCase()+Y.slice(1),T=n?"Dark":"Light";h.download=`DocMark_${L}_${T}_${v}.html`,document.body.appendChild(h),h.click(),document.body.removeChild(h),URL.revokeObjectURL(m),Lt(`HTML exported successfully (${L} - ${T} mode)`,"success")},zt=async()=>{console.log("🚀 [PUPPETEER PDF EXPORT] Starting export...");const e=document.querySelector("#output");if(!e){alert("No content to export");return}try{console.log("[PDF Export] Using Puppeteer server at localhost:3000"),un("Generating PDF...");const r=$o().margins||{top:20,right:20,bottom:20,left:20};console.log("[PDF Export] Using margins:",r);const i=await Ht(e),a=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5),m=`DocMark_${Y.charAt(0).toUpperCase()+Y.slice(1)}_${a}.pdf`,h=await fetch("http://localhost:3000/generate-pdf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({html:i,filename:m,margins:r})});if(!h.ok)throw new Error("PDF generation failed");const v=await h.blob(),L=window.URL.createObjectURL(v),T=document.createElement("a");T.href=L,T.download=m,document.body.appendChild(T),T.click(),document.body.removeChild(T),window.URL.revokeObjectURL(L),kt(),console.log("[PDF Export] Success!")}catch(n){console.error("[PDF Export] Failed:",n),kt(),n.message.includes("Failed to fetch")?alert(`PDF server not running!

Please start it with:
node pdf-server.js`):alert("PDF export failed: "+n.message)}},Ht=async e=>{console.log("[PDF Export] Collecting HTML and CSS for Puppeteer...");const n=document.getElementById("gh-markdown-link");let r="";if(n&&n.href){console.log("[PDF Export] Fetching CSS from:",n.href);try{r=await(await fetch(n.href)).text(),console.log("[PDF Export] CSS fetched successfully, length:",r.length)}catch(m){console.error("[PDF Export] Failed to fetch CSS:",m)}}let i="";return document.querySelectorAll("style").forEach(m=>{i+=m.textContent+`
`}),`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        /* Markdown body styles */
        ${r}
        
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
</html>`},un=e=>{const n=document.getElementById("pdf-loading-indicator");n&&n.remove();const r=document.createElement("div");r.id="pdf-loading-indicator",r.innerHTML=`
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
        `,document.body.appendChild(r)},kt=()=>{const e=document.getElementById("pdf-loading-indicator");e&&e.remove()},It=()=>{try{let e=localStorage.getItem(M+"."+ie);if(e){let n=JSON.parse(e);b={...b,...n}}}catch(e){console.error("Failed to load PDF settings",e)}},je=()=>{if(document.getElementById("pdf-settings-panel")){document.getElementById("pdf-settings-panel").remove();return}(()=>{try{const i=localStorage.getItem(M+".pdf_templates");return i?JSON.parse(i):{}}catch{return{}}})();const n=document.createElement("div");n.id="pdf-settings-panel",n.style.cssText=`
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
                        <option value="helvetica" ${b.fontFamily==="helvetica"?"selected":""}>Helvetica (Sans-serif)</option>
                        <option value="times" ${b.fontFamily==="times"?"selected":""}>Times (Serif)</option>
                        <option value="courier" ${b.fontFamily==="courier"?"selected":""}>Courier (Monospace)</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #666;">Font Sizes (pt)</h4>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H1 Heading:</span>
                        <input type="number" id="pdf-h1" min="6" max="32" value="${b.h1}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H2 Heading:</span>
                        <input type="number" id="pdf-h2" min="6" max="32" value="${b.h2}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H3 Heading:</span>
                        <input type="number" id="pdf-h3" min="6" max="32" value="${b.h3}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>H4-H6 Heading:</span>
                        <input type="number" id="pdf-h4" min="6" max="32" value="${b.h4}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Paragraph:</span>
                        <input type="number" id="pdf-paragraph" min="6" max="32" value="${b.paragraph}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>List:</span>
                        <input type="number" id="pdf-list" min="6" max="32" value="${b.list}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Blockquote:</span>
                        <input type="number" id="pdf-blockquote" min="6" max="32" value="${b.blockquote}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Code:</span>
                        <input type="number" id="pdf-code" min="6" max="32" value="${b.code}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
                        <span>Table:</span>
                        <input type="number" id="pdf-table" min="6" max="32" value="${b.table}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #666;">Table Styling</h4>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Borders:</span>
                        <select id="pdf-table-borders" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: var(--bg-color, white); color: var(--text-color, black);">
                            <option value="all" ${b.tableBorders==="all"?"selected":""}>All Borders</option>
                            <option value="horizontal" ${b.tableBorders==="horizontal"?"selected":""}>Horizontal Only</option>
                            <option value="none" ${b.tableBorders==="none"?"selected":""}>No Borders</option>
                        </select>
                    </label>
                    
                    <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 12px;">
                        <span>Border Weight:</span>
                        <input type="number" id="pdf-border-weight" min="0.1" max="2" step="0.1" value="${b.tableBorderWeight}" style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 3px;">
                    </label>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Border Color:</span>
                        <input type="color" id="pdf-border-color" value="${b.tableBorderColor}" style="width: 100%; height: 32px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    </label>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Header Background:</span>
                        <input type="color" id="pdf-header-bg" value="${b.tableHeaderBg}" style="width: 100%; height: 32px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    </label>
                    
                    <label style="display: block; margin-bottom: 10px; font-size: 12px;">
                        <span style="display: block; margin-bottom: 4px;">Header Text Color:</span>
                        <input type="color" id="pdf-header-color" value="${b.tableHeaderColor}" style="width: 100%; height: 32px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    </label>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button id="pdf-reset-btn" style="flex: 1; padding: 8px; cursor: pointer; border: 1px solid #ddd; border-radius: 4px; background: var(--bg-color, white); color: var(--text-color, black);">Reset</button>
                    <button id="pdf-export-now-btn" style="flex: 1; padding: 8px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px; font-weight: 500;">Export PDF</button>
                </div>
                
                <p style="margin: 15px 0 0 0; font-size: 11px; color: #999; text-align: center;">Changes save automatically</p>
            </div>
        `,document.body.appendChild(n);const r=(i,a)=>{b[i]=a,savePdfSettings()};["h1","h2","h3","h4","paragraph","list","blockquote","code","table"].forEach(i=>{const a=document.getElementById(`pdf-${i}`);a.addEventListener("change",()=>r(i,parseInt(a.value)||8))}),document.getElementById("pdf-font-family").addEventListener("change",i=>{r("fontFamily",i.target.value)}),document.getElementById("pdf-table-borders").addEventListener("change",i=>{r("tableBorders",i.target.value)}),document.getElementById("pdf-border-weight").addEventListener("change",i=>{r("tableBorderWeight",parseFloat(i.target.value)||.1)}),document.getElementById("pdf-border-color").addEventListener("change",i=>{r("tableBorderColor",i.target.value)}),document.getElementById("pdf-header-bg").addEventListener("change",i=>{r("tableHeaderBg",i.target.value)}),document.getElementById("pdf-header-color").addEventListener("change",i=>{r("tableHeaderColor",i.target.value)}),document.getElementById("pdf-reset-btn").addEventListener("click",()=>{b={h1:10,h2:10,h3:10,h4:10,paragraph:8,list:8,blockquote:8,code:8,table:8,fontFamily:"helvetica",tableBorders:"horizontal",tableBorderWeight:.1,tableBorderColor:"#cccccc",tableHeaderBg:"#f0f0f0",tableHeaderColor:"#000000"},savePdfSettings(),n.remove(),je()}),document.getElementById("pdf-export-now-btn").addEventListener("click",()=>{zt()}),document.getElementById("pdf-close-panel").addEventListener("click",()=>{n.remove()})},ft=()=>{document.querySelector("#clear-button").addEventListener("click",e=>{e.preventDefault(),q()})},Ft=()=>{document.querySelector("#paste-button").addEventListener("click",e=>{e.preventDefault(),rt()})},Wt=e=>{document.querySelector("#copy-button").addEventListener("click",n=>{n.preventDefault();let r=e.getValue();ht(r,()=>{Ve()})})},qn=()=>{const e=document.querySelector("#export-pdf-link");e&&e.addEventListener("click",n=>{n.preventDefault(),zt()})},_t=()=>{const e=document.querySelector("#export-html-link");e&&e.addEventListener("click",n=>{n.preventDefault(),dn()})},$t=e=>{const n=document.querySelector("#export-md-button");n&&n.addEventListener("click",()=>{if(!e)return;const r=e.getValue();let i="document";const a=r.match(/^---\s*\ntitle:\s*(.+?)\s*\n/m);if(a)i=a[1].trim().replace(/[^a-z0-9]/gi,"_").toLowerCase();else{const T=r.match(/^#\s+(.+)$/m);T&&(i=T[1].trim().replace(/[^a-z0-9]/gi,"_").toLowerCase())}const g=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5),m=`${i}_docmark_${g}.md`,h=new Blob([r],{type:"text/markdown;charset=utf-8"}),v=URL.createObjectURL(h),L=document.createElement("a");L.href=v,L.download=m,document.body.appendChild(L),L.click(),document.body.removeChild(L),URL.revokeObjectURL(v),Lt(`Markdown exported: ${m}`,"success")})},Un=e=>{const n=document.querySelector("#import-md-button"),r=document.querySelector("#import-md-input");n&&r&&(n.addEventListener("click",()=>{r.click()}),r.addEventListener("change",i=>{const a=i.target.files[0];if(a){const g=new FileReader;g.onload=m=>{const h=m.target.result;if(e){I(e.getValue());const L=e.getModel().getFullModelRange();e.executeEdits("import-markdown",[{range:L,text:h}]),Lt(`Imported: ${a.name}`,"success"),ge("File imported! Use <strong>Undo</strong> to restore previous content.")}},g.onerror=()=>{Lt("Failed to read file","error")},g.readAsText(a)}i.target.value=""}))},wt=()=>{let e=document.querySelector("#pdf-settings-link");e&&e.addEventListener("click",n=>{n.preventDefault(),je()})},Vn=()=>{const e=document.querySelector("#undo-button");e&&e.addEventListener("click",n=>{n.preventDefault(),x&&(C(),x.focus())})},jn=()=>{const e=document.querySelector("#redo-button");e&&e.addEventListener("click",n=>{n.preventDefault(),x&&(y(),x.focus())})},Ee=()=>{const e=document.querySelector("#beautify-button");e&&e.addEventListener("click",n=>{n.preventDefault(),te()})},bt=()=>{const e=document.querySelector("#print-pdf-link");e&&e.addEventListener("click",async n=>{n.preventDefault(),await Gn()})},Gn=async()=>{const e=document.querySelector("#output");if(!e)return;const n=document.documentElement.getAttribute("data-theme")==="dark",r=await At(Y,n),i=`<!DOCTYPE html>
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
        ${r}
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
</html>`,a=window.open("","_blank");a.document.write(i),a.document.close()},Lt=(e,n="info")=>{const r=document.createElement("div");r.className=`toast-notification ${n}`,r.textContent=e,document.body.appendChild(r),setTimeout(()=>{r.classList.add("hiding"),setTimeout(()=>{document.body.removeChild(r)},300)},2500)},lt=!1,yt=!0;const pn=()=>(yt=xe.getItem(M,Q)!==!1,yt),gn=e=>{const n=new Date(2099,1,1);xe.setItem(M,Q,e,n),yt=e};let ge=e=>{lt=!0;const n=document.querySelector(".mofu-head"),r=document.querySelector(".mofu-face-features"),i=document.querySelector(".mofu-smile");if(n&&r&&(n.style.transform="",r.style.transform="",n.classList.add("mofu-attention"),i&&(i.style.width="10px",i.style.height="5px",i.style.borderWidth="2px"),setTimeout(()=>{n.classList.remove("mofu-attention")},600)),!yt){setTimeout(()=>{lt=!1,i&&(i.style.width="7px",i.style.height="3.5px",i.style.borderWidth="1.5px")},2e3);return}const a=document.querySelector(".mofu-helper-bubble");a&&a.remove();const g=document.createElement("div");g.className="mofu-helper-bubble",g.innerHTML=`
            <div class="mofu-helper-message">${e}</div>
            <label class="mofu-helper-footer">
                <input type="checkbox" id="mofu-dont-show-again">
                <span>Don't show again</span>
            </label>
        `,document.body.appendChild(g);const m=g.querySelector("#mofu-dont-show-again");m&&m.addEventListener("change",h=>{h.target.checked&&(gn(!1),g.classList.add("hiding"),setTimeout(()=>{g.parentNode&&document.body.removeChild(g),lt=!1,i&&(i.style.width="7px",i.style.height="3.5px",i.style.borderWidth="1.5px")},200))}),setTimeout(()=>{g.parentNode&&(g.classList.add("hiding"),setTimeout(()=>{g.parentNode&&document.body.removeChild(g),lt=!1,i&&(i.style.width="7px",i.style.height="3.5px",i.style.borderWidth="1.5px")},200))},5e3)},ct=()=>{const e=document.querySelector("#insert-header-button");e&&e.addEventListener("click",n=>{n.preventDefault(),Je(),ge("I've added a <strong>header template</strong> for you! Replace the placeholders with your actual information.")})},mn=()=>{const e=document.querySelector("#insert-footer-button");e&&e.addEventListener("click",n=>{n.preventDefault(),bn(),ge("I've added a <strong>footer template</strong> for you! Replace the placeholders with your actual information.")})},hn=()=>{const e=document.querySelector("#insert-break-button");e&&e.addEventListener("click",n=>{n.preventDefault(),A(),ge("I've inserted a <strong>page break</strong>! This will create a new page in your PDF export.")})},qt=()=>{const e=document.querySelector("#insert-image-button");e&&e.addEventListener("click",n=>{n.preventDefault(),fn()})},fn=()=>{const e=prompt("Enter image width (in pixels, e.g., 300):","300");if(!e)return;const n=prompt("Enter image height (in pixels, leave empty for auto):",""),r=n?` height="${n}"`:"",i=`
<img src="https://via.placeholder.com/${e}x${n||"200"}?text=Your+Image" width="${e}"${r}>

`;x.getModel();const a=x.getPosition();x.executeEdits("insert-image",[{range:new se.Range(a.lineNumber,a.column,a.lineNumber,a.column),text:i}]),setTimeout(()=>{const g=a.lineNumber+1,m=i.indexOf('src="')+5,h=i.indexOf('"',m);x.setSelection(new se.Selection(g,m,g,h)),x.revealLineInCenter(g),x.focus()},50),ge(`I've added an <strong>image placeholder</strong> (${e}x${n||"auto"})! Replace the URL with your image link.`)},Je=()=>{const n=`# Document Title

<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>

---

`,a=x.getModel().getValue().split(`
`);let g=1,m=1;if(a[0]&&a[0].trim()==="---"){for(let h=1;h<a.length;h++)if(a[h].trim()==="---"){g=h+2;break}}x.executeEdits("insert-header",[{range:new se.Range(g,m,g,m),text:n}]),setTimeout(()=>{x.setSelection(new se.Selection(g,3,g,17)),x.focus()},50)},bn=()=>{const n=`

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
`,r=x.getModel(),i=r.getLineCount(),a=r.getLineContent(i),g=i,m=a.length+1;x.executeEdits("insert-footer",[{range:new se.Range(g,m,g,m),text:n}]);const h=i+6;setTimeout(()=>{x.setSelection(new se.Selection(h,13,h,22)),x.revealLineInCenter(h),x.focus()},50)},yn=()=>{const e=document.querySelectorAll(".dropdown");e.forEach(n=>{const r=n.querySelector(".dropdown-content");if(!r)return;let i=!1,a=null;n.addEventListener("mouseenter",()=>{clearTimeout(a),i=!0,r.style.display="block"}),r.addEventListener("mouseenter",()=>{clearTimeout(a),i=!0});const g=()=>{a=setTimeout(()=>{i&&(i=!1,r.style.display="none")},150)};n.addEventListener("mouseleave",m=>{const h=n.getBoundingClientRect();(m.clientX<h.left||m.clientX>h.right||m.clientY<h.top||m.clientY>h.bottom)&&g()}),r.addEventListener("mouseleave",m=>{const h=r.getBoundingClientRect();(m.clientX<h.left||m.clientX>h.right||m.clientY<h.top||m.clientY>h.bottom)&&g()}),n.addEventListener("click",m=>{m.target.closest(".dropdown-content")||(clearTimeout(a),i=!i,r.style.display=i?"block":"none")})}),document.addEventListener("click",n=>{n.target.closest(".dropdown")||e.forEach(r=>{const i=r.querySelector(".dropdown-content");i&&(i.style.display="none")})})},Mt=!1,vn=()=>{const e=document.querySelector("#cheatsheet-button");if(!e)return;e.addEventListener("click",r=>{r.preventDefault(),xn()});const n=document.querySelector("#cheatsheet-close-btn");n&&n.addEventListener("click",()=>{xn()}),U()},xn=()=>{Mt=!Mt;const e=document.querySelector("#cheatsheet-panel"),n=document.querySelector("#cheatsheet-divider"),r=document.querySelector("#container");Mt?(e.classList.remove("hidden"),n.classList.remove("hidden"),r.classList.add("cheatsheet-visible")):(e.classList.add("hidden"),n.classList.add("hidden"),r.classList.remove("cheatsheet-visible")),x&&setTimeout(()=>{x.layout()},350)},U=()=>{const e=document.querySelector("#cheatsheet-content");if(!e)return;const n=[{section:"Headers",items:[{title:"H1 Header",code:"# Header 1",type:"header"},{title:"H2 Header",code:"## Header 2",type:"header"},{title:"H3 Header",code:"### Header 3",type:"header"}]},{section:"Text Formatting",items:[{title:"Bold",code:"**bold text**",type:"inline"},{title:"Italic",code:"*italic text*",type:"inline"},{title:"Bold + Italic",code:"***bold and italic***",type:"inline"},{title:"Strikethrough",code:"~~strikethrough~~",type:"inline"},{title:"Inline Code",code:"`code`",type:"inline"}]},{section:"Lists",items:[{title:"Unordered List",code:`* Item 1
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
---`,type:"yaml"}]}];let r="";n.forEach(i=>{r+=`<div class="cheatsheet-section">
                <h4>${i.section}</h4>`,i.items.forEach((a,g)=>{const m=`cheat-${i.section.replace(/\s/g,"-")}-${g}`;r+=`
                <div class="cheatsheet-item">
                    <div class="cheatsheet-item-header">
                        <span class="cheatsheet-item-title">${a.title}</span>
                        <div class="cheatsheet-item-actions">
                            <button class="cheatsheet-insert-btn" data-code="${m}" data-type="${a.type}">Insert</button>
                            <button class="cheatsheet-copy-btn" data-code="${m}">Copy</button>
                        </div>
                    </div>
                    <div class="cheatsheet-code" id="${m}">${a.code.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
                </div>`}),r+="</div>"}),e.innerHTML=r,e.querySelectorAll(".cheatsheet-insert-btn").forEach(i=>{i.addEventListener("click",a=>{const g=a.target.getAttribute("data-code"),m=a.target.getAttribute("data-type"),v=document.getElementById(g).textContent;u(v,m),a.target.textContent="Inserted!",a.target.classList.add("inserted"),setTimeout(()=>{a.target.textContent="Insert",a.target.classList.remove("inserted")},1500)})}),e.querySelectorAll(".cheatsheet-copy-btn").forEach(i=>{i.addEventListener("click",a=>{const g=a.target.getAttribute("data-code"),h=document.getElementById(g).textContent;navigator.clipboard.writeText(h).then(()=>{a.target.textContent="Copied!",a.target.classList.add("copied"),setTimeout(()=>{a.target.textContent="Copy",a.target.classList.remove("copied")},2e3)}).catch(()=>{a.target.textContent="Failed",setTimeout(()=>{a.target.textContent="Copy"},2e3)})})})},u=(e,n)=>{if(!x)return;const r=x.getPosition(),i=x.getModel(),a=i.getLineContent(r.lineNumber),g=a.length,m=a.trim()==="",h=r.column===1,v=r.column>g;let L=e,T=r;if(n==="yaml"?(r.lineNumber!==1||!h)&&(T=new se.Position(1,1),(i.getLineCount()>1||!m)&&(L=e+`

`)):n==="block"?m?L=e+`

`:v?L=`

`+e+`

`:h?L=e+`

`:(T=new se.Position(r.lineNumber,g+1),L=`

`+e+`

`):n==="header"?m?L=e+`

`:v?L=`

`+e+`

`:h?L=e+`

`:(T=new se.Position(r.lineNumber,g+1),L=`

`+e+`

`):n==="inline"&&(L=e),x.executeEdits("insert-syntax",[{range:new se.Range(T.lineNumber,T.column,T.lineNumber,T.column),text:L}]),n==="inline")if(e.includes("text")||e.includes("Link")||e.includes("Alt")){const P=new se.Position(T.lineNumber,T.column+e.indexOf("text")>-1?e.indexOf("text"):e.indexOf("Link")>-1?e.indexOf("Link"):e.indexOf("Alt")>-1?e.indexOf("Alt"):0);x.setPosition(P)}else x.setPosition(new se.Position(T.lineNumber,T.column+e.length));else{L.split(`
`);const P=T.lineNumber+(L.startsWith(`

`)?2:0);x.setPosition(new se.Position(P,1))}x.focus()},A=()=>{const e=x.getModel(),n=x.getPosition(),r=e.getLineContent(n.lineNumber);let i=n.lineNumber,a=1,g="";r.trim()!==""?(i=n.lineNumber+1,g=`
<div style="page-break-after: always;"></div>

`):g=`<div style="page-break-after: always;"></div>

`,x.executeEdits("insert-break",[{range:new se.Range(i,a,i,a),text:g}]);const m=i+(r.trim()!==""?3:2);setTimeout(()=>{x.setPosition({lineNumber:m,column:1}),x.focus()},50)},N=!1,me=[],_e=()=>{const e=document.querySelector("#toc-checkbox");if(!e)return;const n=Gi();n!=null&&n!==!1&&(o=n,e.checked=n,setTimeout(()=>{n&&ve()},500)),e.addEventListener("change",i=>{o=i.currentTarget.checked,Eo(o),ve()});const r=document.querySelector("#toc-close-btn");r&&r.addEventListener("click",()=>{o=!1,e.checked=!1,Eo(!1),ve()})},ve=()=>{N=o;const e=document.querySelector("#toc-panel"),n=document.querySelector("#container");N?(e.classList.remove("hidden"),n.classList.add("toc-visible"),Lo()):(e.classList.add("hidden"),n.classList.remove("toc-visible")),x&&setTimeout(()=>{x.layout()},350)},Re=()=>{const e=document.querySelector("#validation-checkbox"),n=document.querySelector("#export-validation-link");if(!e)return;const r=_i();r!=null&&(e.checked=r,x&&x._setValidationEnabled&&x._setValidationEnabled(r),n&&(n.style.display=r?"block":"none")),e.addEventListener("change",i=>{const a=i.currentTarget.checked;$i(a),x&&x._setValidationEnabled&&x._setValidationEnabled(a),n&&(n.style.display=a?"block":"none")})},$e=!1;const dt="edit_mode",Ut=()=>xe.getItem(M,dt)===!0,Ie=e=>{xe.setItem(M,dt,e)};let kn=()=>{const e=document.querySelector("#edit-mode-checkbox");e&&($e=Ut(),e.checked=$e,$e&&document.documentElement.classList.add("edit-mode-active"),e.addEventListener("change",n=>{$e=n.currentTarget.checked,Ie($e),$e?(document.documentElement.classList.add("edit-mode-active"),wo()):(document.documentElement.classList.remove("edit-mode-active"),Ii())}))},Bt=null;window.TurndownService&&(Bt=new window.TurndownService({headingStyle:"atx",bulletListMarker:"-",codeBlockStyle:"fenced"}));const Ai=e=>{if(!Bt||!x)return;const n=e.getAttribute("data-source-line");if(!n)return;const r=parseInt(n,10);if(isNaN(r))return;const i=e.innerHTML;let a=Bt.turndown(i);const g=e.tagName.toLowerCase();if(g.match(/^h[1-6]$/)){const T=parseInt(g[1],10),P="#".repeat(T);a.startsWith(P)||(a=`${P} ${a}`)}g==="blockquote"&&(a=a.split(`
`).map(P=>P.startsWith(">")?P:`> ${P}`).join(`
`));const m=x.getModel();if(!m)return;const h=m.getLineContent(r),L={range:new se.Range(r,1,r,h.length+1),text:a};m.pushEditOperations([],[L],()=>null)},wo=()=>{const e=document.querySelector("#output");if(!e)return;e.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, blockquote").forEach(r=>{r.setAttribute("contenteditable","true");const i=a=>{Ai(a.target)};r._editModeInputHandler=i,r.addEventListener("input",i),r.setAttribute("data-original-html",r.innerHTML)})},Ii=()=>{const e=document.querySelector("#output");if(!e)return;e.querySelectorAll('[contenteditable="true"]').forEach(r=>{r.removeAttribute("contenteditable"),r.removeAttribute("data-original-html"),r._editModeInputHandler&&(r.removeEventListener("input",r._editModeInputHandler),delete r._editModeInputHandler)})};let _i=()=>{let e=xe.getItem(M,Te);return e===null?!0:e},$i=e=>{let n=new Date(2099,1,1);xe.setItem(M,Te,e,n)},Mi=()=>{const n=(x?x.getValue():"").split(`
`),r=[];let i=!1,a=!1;return n.forEach((g,m)=>{if(m===0&&g.trim()==="---"){a=!0;return}if(a&&g.trim()==="---"){a=!1;return}if(a)return;if(g.trim().startsWith("```")){i=!i;return}if(i)return;const v=g.replace(/\r$/,"").match(/^(#{1,6})\s*(.+)$/);if(v){const L=v[1].length,T=v[2].trim();if(!T)return;const P=T.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");r.push({level:L,text:T,id:P,line:m+1})}}),r},Lo=()=>{if(!N)return;const e=document.querySelector("#toc-content");if(!e)return;if(me=Mi(),me.length===0){e.innerHTML='<div class="toc-empty">No headings found in document</div>';return}const n=a=>{const g={children:[],level:0},m=[g];return a.forEach(h=>{const v={...h,children:[]};for(;m.length>1&&m[m.length-1].level>=h.level;)m.pop();m[m.length-1].children.push(v),m.push(v)}),g.children},r=(a,g=0)=>{if(!a||a.length===0)return"";let m='<ul class="toc-tree-list">';return a.forEach(h=>{const v=h.children&&h.children.length>0,L=v?`<button class="toc-collapse-btn" data-collapsed="false" aria-label="Collapse">
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toc-icon toc-icon-minus">
                           <circle cx="12" cy="12" r="10"></circle>
                           <line x1="8" y1="12" x2="16" y2="12"></line>
                         </svg>
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toc-icon toc-icon-plus" style="display: none;">
                           <circle cx="12" cy="12" r="10"></circle>
                           <line x1="12" y1="8" x2="12" y2="16"></line>
                           <line x1="8" y1="12" x2="16" y2="12"></line>
                         </svg>
                       </button>`:'<span class="toc-spacer"></span>';m+=`<li class="toc-tree-item toc-h${h.level}" data-level="${h.level}">
                    <div class="toc-item-row">
                        ${L}
                        <a href="#" class="toc-link" data-line="${h.line}" data-id="${h.id}">
                            ${h.text}
                        </a>
                    </div>`,v&&(m+=`<div class="toc-children">${r(h.children,h.level)}</div>`),m+="</li>"}),m+="</ul>",m},i=n(me);e.innerHTML=r(i),e.querySelectorAll(".toc-link").forEach(a=>{a.addEventListener("click",g=>{g.preventDefault();const m=parseInt(g.target.getAttribute("data-line"));x&&m&&(x.setPosition({lineNumber:m,column:1}),x.revealLineInCenter(m),x.focus(),e.querySelectorAll(".toc-link").forEach(h=>h.classList.remove("active")),g.target.classList.add("active"))})}),e.querySelectorAll(".toc-collapse-btn").forEach(a=>{a.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation();const m=a.getAttribute("data-collapsed")==="true",v=a.closest(".toc-tree-item").querySelector(":scope > .toc-children"),L=a.querySelector(".toc-icon-minus"),T=a.querySelector(".toc-icon-plus");m?(a.setAttribute("data-collapsed","false"),v.style.maxHeight=v.scrollHeight+"px",L.style.display="block",T.style.display="none",setTimeout(()=>{a.getAttribute("data-collapsed")==="false"&&(v.style.maxHeight="none")},300)):(v.style.maxHeight=v.scrollHeight+"px",v.offsetHeight,v.style.maxHeight="0",a.setAttribute("data-collapsed","true"),L.style.display="none",T.style.display="block")})})},Bi=()=>xe.getItem(M,W),Ri=e=>{let n=new Date(2099,1,1);xe.setItem(M,W,e,n)},Di=()=>xe.getItem(M,j),Pi=()=>{let e=xe.getItem(M,oe);if(e==null)try{const n=localStorage.getItem("com.markdownlivepreview_theme");if(n==="dark")return!0;if(n==="light")return!1}catch{}return e},Ni=e=>{let n=new Date(2099,1,1);xe.setItem(M,j,e,n)},Oi=()=>xe.getItem(M,le),zi=e=>{let n=new Date(2099,1,1);xe.setItem(M,le,e,n)},Hi=e=>{let n=new Date(2099,1,1);xe.setItem(M,oe,e,n);try{localStorage.setItem("com.markdownlivepreview_theme",e?"dark":"light")}catch{}},Fi=()=>xe.getItem(M,we)||"github",Wi=e=>{let n=new Date(2099,1,1);xe.setItem(M,we,e,n);try{localStorage.setItem("com.markdownlivepreview.style_settings",e)}catch{}},qi=()=>xe.getItem(M,J)||!1,Ui=e=>{let n=new Date(2099,1,1);xe.setItem(M,J,e,n)},Vi=()=>xe.getItem(M,X)||!1,ji=e=>{let n=new Date(2099,1,1);xe.setItem(M,X,e,n)},Gi=()=>xe.getItem(M,ye)||!1,Eo=e=>{let n=new Date(2099,1,1);xe.setItem(M,ye,e,n)},Yi=()=>{let e=.5,n=.5;const r=document.getElementById("split-divider"),i=document.getElementById("edit"),a=document.getElementById("preview"),g=document.getElementById("container");if(!r||!i||!a)return;const m=()=>g.classList.contains("vertical"),h=()=>g.classList.contains("flipped"),v=()=>g.getBoundingClientRect().width,L=()=>g.getBoundingClientRect().height;r.addEventListener("mouseenter",()=>{r.classList.add("hover")}),r.addEventListener("mouseleave",()=>{r.classList.remove("hover")}),r.addEventListener("mousedown",T=>{T.preventDefault();const P=r.getBoundingClientRect(),D=g.getBoundingClientRect(),F=m();let G,R,O;F?(h()?R=a.offsetHeight:R=i.offsetHeight,O=P.top-D.top):(h()?G=a.offsetWidth:G=i.offsetWidth,O=P.left-D.left),d={divider:r,leftPane:h()?a:i,rightPane:h()?i:a,container:g,lastLeftRatio:e,lastTopRatio:n,isVertical:F,isFlipped:h(),getAvailableWidth:v,getAvailableHeight:L,initialLeftWidth:G||0,initialTopHeight:R||0,initialDividerX:F?0:O,initialDividerY:F?O:0},document.body.classList.add("dragging"),r.classList.add("active"),d.isVertical?document.body.style.cursor="row-resize":document.body.style.cursor="col-resize"}),r.addEventListener("dblclick",()=>{if(m()){const T=L(),P=r.offsetHeight,D=(T-P)/2;i.style.height=D+"px",a.style.height=D+"px",i.style.width="",a.style.width=""}else{const T=v(),P=r.offsetWidth,D=(T-P)/2;i.style.width=D+"px",a.style.width=D+"px",i.style.height="",a.style.height=""}})},Ki=()=>{let e=300;const n=document.getElementById("cheatsheet-divider"),r=document.querySelector(".cheatsheet-pane"),i=document.getElementById("container");if(!n||!r)return;const a=()=>i.getBoundingClientRect().width;n.addEventListener("mouseenter",()=>{n.classList.add("hover")}),n.addEventListener("mouseleave",()=>{n.classList.remove("hover")}),n.addEventListener("mousedown",g=>{g.preventDefault();const m=n.getBoundingClientRect(),h=i.getBoundingClientRect(),v=r.offsetWidth;d={divider:n,leftPane:r,rightPane:null,container:i,lastLeftRatio:e/a(),lastTopRatio:0,isVertical:!1,isFlipped:!1,getAvailableWidth:a,getAvailableHeight:()=>0,initialLeftWidth:v,initialDividerX:m.left-h.left},document.body.classList.add("dragging"),n.classList.add("active"),document.body.style.cursor="col-resize"})},So=Bi();x=$(),window.editor=x,vt(So||_),I(x.getValue()),x.addCommand(se.KeyMod.CtrlCmd|se.KeyCode.KeyZ,()=>{C()}),x.addCommand(se.KeyMod.CtrlCmd|se.KeyMod.Shift|se.KeyCode.KeyZ,()=>{y()}),x.addCommand(se.KeyMod.CtrlCmd|se.KeyCode.KeyY,()=>{y()});let To;x.onDidChangeModelContent(()=>{E||(clearTimeout(To),To=setTimeout(()=>{const e=x.getValue();(p.length===0||p[w]!==e)&&I(e)},300))}),ft(),Ft(),Wt(x),Vn(),jn(),Ee(),qn(),bt(),_t(),$t(x),Un(x),wt(),ct(),mn(),qt(),hn(),yn(),vn(),_e(),Re(),kn();const Co=document.querySelector("#autofix-validation-link"),Ao=document.querySelector("#export-validation-link");Co?Co.addEventListener("click",e=>{e.preventDefault(),console.log("[DEBUG] Autofix link clicked");const n=document.querySelector("#validation-checkbox");n&&!n.checked&&(n.checked=!0,n.dispatchEvent(new Event("change")),console.log("[DEBUG] Validation auto-enabled")),console.log("[DEBUG] Editor exists:",!!x),console.log("[DEBUG] _interactiveFixWizard exists:",!!(x&&x._interactiveFixWizard)),x&&x._interactiveFixWizard?(console.log("[DEBUG] Calling _interactiveFixWizard"),x._interactiveFixWizard()):console.error("[DEBUG] Cannot call _interactiveFixWizard - editor or function not available")}):console.error("[DEBUG] Autofix link not found in DOM"),Ao&&Ao.addEventListener("click",e=>{if(e.preventDefault(),console.log("[DEBUG] Export validation link clicked"),x&&x._exportValidationErrors){const n=x._exportValidationErrors();navigator.clipboard.writeText(n).then(()=>{ge("Validation report copied to clipboard!")}).catch(r=>{console.error("Failed to copy:",r),ge("Failed to copy report")})}}),setTimeout(()=>{const e=document.querySelector("#validation-checkbox"),n=document.querySelector("#export-validation-link");e&&e.checked&&n&&(n.style.display="block")},100),It();let Xi=Di()||!1;tt(Xi);let wn=Oi();wn==null&&(wn=!0),Nt(wn);let Rt=localStorage.getItem("com.markdownlivepreview.word_wrap");Rt===null?Rt=!0:Rt=Rt==="true";const Yn=document.querySelector("#word-wrap-checkbox");Yn&&(Yn.checked=Rt,x.updateOptions({wordWrap:Rt?"on":"off"}),Yn.addEventListener("change",e=>{const n=e.currentTarget.checked;x.updateOptions({wordWrap:n?"on":"off"}),localStorage.setItem("com.markdownlivepreview.word_wrap",n)}));let Zi=pn();at(Zi),xt();let Vt=Pi();document.getElementById("status-pdf-estimate").addEventListener("click",()=>{const e=parseInt(document.getElementById("status-word-count").textContent),n=Math.max(1,Math.ceil(e/500)),r=`PDF Page Estimate

Based on approximately 500 words per page:
${e} words ≈ ${n} page${n!==1?"s":""}

Note: Actual page count may vary based on:
• Font size and family
• Line height
• Images and tables
• Margins and spacing`;alert(r)}),S();const Io="paper_layout_settings",_o="page_setup_settings",Ji=()=>{try{const e=localStorage.getItem(`${M}.${Io}`);if(e){const n=JSON.parse(e);s=n.layout||"web",l=n.zoom||100}}catch(e){console.error("Failed to load paper layout settings:",e)}},$o=()=>{try{const e=localStorage.getItem(`${M}.${_o}`);e&&(c=JSON.parse(e))}catch(e){console.error("Failed to load page setup settings:",e)}return{pageSize:"A4",pageOrientation:"portrait",margins:{top:(c.marginTop||2.54)*10,right:(c.marginRight||2.54)*10,bottom:(c.marginBottom||2.54)*10,left:(c.marginLeft||2.54)*10}}},Qi=()=>{try{localStorage.setItem(`${M}.${_o}`,JSON.stringify(c))}catch(e){console.error("Failed to save page setup settings:",e)}},jt=()=>{try{const e={layout:s,zoom:l};localStorage.setItem(`${M}.${Io}`,JSON.stringify(e))}catch(e){console.error("Failed to save paper layout settings:",e)}},Ln=()=>{const e=document.querySelector(".preview-pane"),n=document.querySelector(".paper-controls"),r=document.getElementById("status-layout-mode"),i=document.querySelector("#output");if(s==="paper"?(e&&e.classList.add("paper-layout"),n&&n.classList.add("visible"),r&&(r.textContent="Paper Layout"),i&&(i.classList.add("paper-layout-active"),H())):(e&&e.classList.remove("paper-layout"),n&&n.classList.remove("visible"),r&&(r.textContent="Web Layout"),i&&i.classList.remove("paper-layout-active")),x){const a=x.getValue();K(a)}},es=()=>{l<200&&(l+=10,H(),jt())},ts=()=>{l>50&&(l-=10,H(),jt())},ns=()=>{const e=document.querySelector(".preview-pane");if(!e)return;const n=e.clientWidth,r=c.width*37.795275591,a=(n-40)/r*100;l=Math.max(50,Math.min(200,Math.round(a))),H(),jt()},os=()=>{l=100,H(),jt()},is=()=>{s=s==="web"?"paper":"web",jt(),Ln()},ss=()=>{const e=document.getElementById("page-setup-modal");e&&(document.getElementById("page-width").value=c.width,document.getElementById("page-height").value=c.height,document.getElementById("margin-top").value=c.marginTop,document.getElementById("margin-bottom").value=c.marginBottom,document.getElementById("margin-left").value=c.marginLeft,document.getElementById("margin-right").value=c.marginRight,e.classList.add("visible"))},En=()=>{const e=document.getElementById("page-setup-modal");e&&e.classList.remove("visible")},rs=()=>{c.width=parseFloat(document.getElementById("page-width").value)||21,c.height=parseFloat(document.getElementById("page-height").value)||29.7,c.marginTop=parseFloat(document.getElementById("margin-top").value)||4.5,c.marginBottom=parseFloat(document.getElementById("margin-bottom").value)||2.54,c.marginLeft=parseFloat(document.getElementById("margin-left").value)||2.54,c.marginRight=parseFloat(document.getElementById("margin-right").value)||1.47,Qi(),En(),s==="paper"&&Ln()},as=()=>{const e=document.querySelector('.status-item[title="Layout mode"]');e&&(e.classList.add("clickable"),e.addEventListener("click",is),e.title="Click to toggle between Web and Paper layout"),document.body.insertAdjacentHTML("beforeend",`
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
        `),document.getElementById("paper-zoom-in").addEventListener("click",es),document.getElementById("paper-zoom-out").addEventListener("click",ts),document.getElementById("paper-fit-width").addEventListener("click",ns),document.getElementById("paper-reset-zoom").addEventListener("click",os),document.getElementById("paper-page-setup").addEventListener("click",ss)};setTimeout(()=>{Ji(),$o(),as(),Ln(),document.body.insertAdjacentHTML("beforeend",`
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
        `),document.getElementById("page-setup-close-btn").addEventListener("click",En),document.getElementById("page-setup-cancel-btn").addEventListener("click",En),document.getElementById("page-setup-save-btn").addEventListener("click",rs),document.getElementById("page-setup-modal").addEventListener("click",n=>{n.target.id==="page-setup-modal"&&En()}),Ln()},100);const Mo="versions",Bo="autosave_config",Ro=15;let be=[],Kn=null,Ge={enabled:!0,intervalMinutes:10};const ls=()=>{try{const e=localStorage.getItem(`${M}.${Mo}`);e&&(be=JSON.parse(e),be.forEach(n=>n.timestamp=new Date(n.timestamp)),Gt())}catch(e){console.error("Failed to load versions:",e),be=[]}},cs=()=>{try{const e=localStorage.getItem(`${M}.${Bo}`);e&&(Ge=JSON.parse(e))}catch(e){console.error("Failed to load autosave config:",e)}},ds=()=>{try{localStorage.setItem(`${M}.${Bo}`,JSON.stringify(Ge))}catch(e){console.error("Failed to save autosave config:",e)}},Xn=()=>{try{localStorage.setItem(`${M}.${Mo}`,JSON.stringify(be))}catch(e){console.error("Failed to save versions:",e)}},Sn=()=>{const e=x.getValue();if(be.length>0&&be[0].content===e){console.log("No changes detected, skipping version save");return}const n=e.trim()?e.trim().split(/\s+/).length:0,r=new Date,i={id:Date.now(),content:e,timestamp:r,words:n,preview:e.substring(0,100)+(e.length>100?"...":""),title:""};console.log("Saving version:",{id:i.id,contentLength:e.length,preview:i.preview,totalVersions:be.length+1}),be.unshift(i),be.length>Ro&&(be=be.slice(0,Ro)),Xn(),Gt(),S(),$n(),Zn()},ut=e=>{const r=new Date-e,i=Math.floor(r/6e4),a=Math.floor(r/36e5),g=Math.floor(r/864e5);return i<1?"Just now":i<60?`${i} min ago`:a<24?`${a} hour${a>1?"s":""} ago`:g<7?`${g} day${g>1?"s":""} ago`:e.toLocaleDateString()+" "+e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},Zn=()=>{const e=document.getElementById("status-save-indicator");if(e)if(be.length>0){const n=be[0],r=ut(n.timestamp);e.textContent=`Saved ${r}`}else e.textContent="Not saved"},Gt=(e="")=>{const n=document.getElementById("version-history-list"),r=document.getElementById("status-versions-count"),i=document.getElementById("total-versions-display");if(r&&(r.textContent=be.length),i&&(i.textContent=be.length),!n)return;if(be.length===0){n.innerHTML='<p class="version-empty-state">No versions saved yet. Versions are auto-saved every 10 minutes.</p>';return}const a=e.trim()===""?be:be.filter(g=>{const m=g.title||"",h=ut(g.timestamp),v=g.preview||"",L=e.toLowerCase();return m.toLowerCase().includes(L)||h.toLowerCase().includes(L)||v.toLowerCase().includes(L)});if(a.length===0){n.innerHTML='<p class="version-empty-state">No versions match your search.</p>';return}n.innerHTML=a.map(g=>`
            <div class="version-item" data-version-id="${g.id}">
                <div class="version-header">
                    <div class="version-title-container">
                        ${g.title?`<input type="text" class="version-title-input" value="${fe(g.title)}" data-version-id="${g.id}" />`:`<input type="text" class="version-title-input" placeholder="${ut(g.timestamp)}" data-version-id="${g.id}" />`}
                        <button class="version-save-title-btn" data-version-id="${g.id}" title="Save title">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                ${g.title?"":`<div class="version-timestamp-small">${ut(g.timestamp)}</div>`}
                <div class="version-meta">
                    <span>${g.words} words</span>
                    <span>${Math.ceil(g.words/500)} pages</span>
                </div>
                <div class="version-preview">${fe(g.preview)}</div>
                <div class="version-actions">
                    <button class="version-btn" onclick="window.previewVersion(${g.id})">Preview</button>
                    <button class="version-btn" onclick="window.compareVersion(${g.id})">Compare</button>
                    <button class="version-btn restore" onclick="window.restoreVersion(${g.id})">Restore</button>
                    <button class="version-btn" onclick="window.deleteVersion(${g.id})">Delete</button>
                </div>
            </div>
        `).join("")};window.restoreVersion=e=>{const n=be.find(r=>r.id===e);if(n){x.setValue(n.content),Cn();const r=document.getElementById("version-history-panel");r&&r.classList.remove("visible")}};let Tn=null;const us=(e,n,r)=>{const i=document.getElementById("confirm-dialog"),a=document.getElementById("confirm-dialog-title"),g=document.getElementById("confirm-dialog-message");a&&(a.textContent=e),g&&(g.textContent=n),Tn=r,i&&i.classList.add("visible")},Jn=()=>{const e=document.getElementById("confirm-dialog");e&&e.classList.remove("visible"),Tn=null};window.deleteVersion=e=>{us("Delete Version","Are you sure you want to delete this version? This action cannot be undone.",()=>{be=be.filter(n=>n.id!==e),Xn(),Gt(),S(),$n(),Jn()})},window.saveVersionTitle=e=>{const n=document.querySelector(`.version-title-input[data-version-id="${e}"]`);if(!n)return;const r=be.find(a=>a.id===e);if(!r)return;const i=n.value.trim();r.title=i,Xn(),Gt()},window.previewVersion=e=>{const n=be.find(v=>v.id===e);if(!n)return;const r=document.getElementById("version-modal-title"),i=document.getElementById("version-modal-body"),a=document.getElementById("version-modal-restore-btn"),g=document.getElementById("version-modal-toggle-btn");let m=!1;const h=()=>{const v=n.title||ut(n.timestamp);if(r&&(r.innerHTML=`
                    <div style="font-size: 16px; font-weight: 600; color: inherit;">${v}</div>
                    <div style="font-size: 12px; color: #64748b; font-weight: normal; margin-top: 4px;">
                        ${n.words} words • ${Math.ceil(n.words/500)} pages • Saved ${ut(n.timestamp)}
                    </div>
                `),g&&(g.style.display="block",g.textContent=m?"Show Formatted":"Show Raw",g.onclick=()=>{m=!m,h()}),i)if(m)i.innerHTML=`
                        <pre style="margin: 0; padding: 20px; font-family: 'Courier New', monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word;" class="raw-markdown-view">${fe(n.content)}</pre>
                    `;else{const L=ce.parse(n.content),T=ao.sanitize(L);i.innerHTML=`
                        <div class="markdown-body" style="padding: 20px;">
                            ${T}
                        </div>
                    `}};h(),a&&(a.style.display="block",a.onclick=()=>{window.restoreVersion(e)}),No()},window.compareVersion=e=>{const n=be.find(P=>P.id===e);if(!n)return;const r=x.getValue(),i=n.content,a=r.trim()?r.trim().split(/\s+/).length:0;console.log("Comparing versions:",{versionId:e,currentLength:r.length,versionLength:i.length,areSame:r===i,currentPreview:r.substring(0,50),versionPreview:i.substring(0,50)});const g=document.getElementById("version-modal-title"),m=document.getElementById("version-modal-body"),h=document.getElementById("version-modal-restore-btn"),v=document.getElementById("version-modal-toggle-btn");let L=!1;const T=()=>{const P=n.title||ut(n.timestamp);if(g&&(g.innerHTML=`
                    <div style="font-size: 16px; font-weight: 600; color: inherit;">Compare: ${P}</div>
                    <div style="display: flex; gap: 20px; font-size: 12px; color: #64748b; font-weight: normal; margin-top: 4px;">
                        <span>Current: ${a} words • ${Math.ceil(a/500)} pages</span>
                        <span>Version: ${n.words} words • ${Math.ceil(n.words/500)} pages • Saved ${ut(n.timestamp)}</span>
                    </div>
                `),v&&(v.style.display="block",v.textContent=L?"Show Formatted":"Show Raw Diff",v.onclick=()=>{L=!L,T()}),m)if(L)m.innerHTML=`
                        <div class="version-compare-view">
                            <div class="compare-pane">
                                <div class="compare-pane-header">Current Version</div>
                                <pre class="compare-pane-content raw-markdown-view" style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 16px;">${Do(r,i,"current")}</pre>
                            </div>
                            <div class="compare-pane">
                                <div class="compare-pane-header">Saved Version</div>
                                <pre class="compare-pane-content raw-markdown-view" style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 16px;">${Do(i,r,"version")}</pre>
                            </div>
                        </div>
                    `;else{const D=r.split(`
`),F=i.split(`
`),G=Po(D,F),R=new Set,O=new Set;let ee=0,ke=0,Se=0;for(;ee<D.length||ke<F.length;)Se<G.length&&ee<D.length&&ke<F.length&&D[ee]===G[Se]&&F[ke]===G[Se]?(ee++,ke++,Se++):ee<D.length&&(Se>=G.length||D[ee]!==G[Se])?(R.add(ee),ee++):ke<F.length&&(O.add(ke),ke++);const Fe=(Yt,he,Ae)=>{const ze=Yt.split(`
`);let Me="",Qe=!1;const St=Ae?"diff-added-block":"diff-removed-block";ze.forEach((Pt,Kt)=>{he.has(Kt)?(Qe||(Me+=`<div class="${St}">`,Qe=!0),Me+=Pt+`
`):(Qe&&(Me+="</div>",Qe=!1),Me+=Pt+`
`)}),Qe&&(Me+="</div>");const Bn=ce.parse(Me);return ao.sanitize(Bn)},Ye=Fe(r,R,!0),We=Fe(i,O,!1);m.innerHTML=`
                        <div class="version-compare-view">
                            <div class="compare-pane">
                                <div class="compare-pane-header">Current Version</div>
                                <div class="compare-pane-content markdown-body" style="padding: 16px;">
                                    ${Ye}
                                </div>
                            </div>
                            <div class="compare-pane">
                                <div class="compare-pane-header">Saved Version</div>
                                <div class="compare-pane-content markdown-body" style="padding: 16px;">
                                    ${We}
                                </div>
                            </div>
                        </div>
                    `}};T(),h&&(h.style.display="block",h.onclick=()=>{window.restoreVersion(e)}),No()};const Do=(e,n,r)=>{const i=e.split(`
`),a=n.split(`
`),g=Po(i,a);let m="",h=0,v=0,L=0;for(;h<i.length||v<a.length;)L<g.length&&h<i.length&&v<a.length&&i[h]===g[L]&&a[v]===g[L]?(m+=fe(i[h])+`
`,h++,v++,L++):r==="current"?h<i.length&&(L>=g.length||i[h]!==g[L])?(m+=`<span class="diff-added">${fe(i[h])}</span>
`,h++):v++:v<a.length&&(L>=g.length||a[v]!==g[L])?(m+=`<span class="diff-removed">${fe(a[v])}</span>
`,v++):h++;return m||fe(r==="current"?e:n)},Po=(e,n)=>{const r=e.length,i=n.length,a=Array(r+1).fill(null).map(()=>Array(i+1).fill(0));for(let v=1;v<=r;v++)for(let L=1;L<=i;L++)e[v-1]===n[L-1]?a[v][L]=a[v-1][L-1]+1:a[v][L]=Math.max(a[v-1][L],a[v][L-1]);const g=[];let m=r,h=i;for(;m>0&&h>0;)e[m-1]===n[h-1]?(g.unshift(e[m-1]),m--,h--):a[m-1][h]>a[m][h-1]?m--:h--;return g},No=()=>{const e=document.getElementById("version-modal");e&&e.classList.add("visible")},Cn=()=>{const e=document.getElementById("version-modal"),n=document.getElementById("version-modal-restore-btn");e&&e.classList.remove("visible"),n&&(n.style.display="none")},An=document.getElementById("version-history-panel"),Oo=document.getElementById("version-history-close-btn"),zo=document.getElementById("status-versions");zo&&zo.addEventListener("click",()=>{An&&An.classList.toggle("visible")}),Oo&&Oo.addEventListener("click",()=>{An&&An.classList.remove("visible")});const Et=document.getElementById("autosave-modal"),Ho=document.getElementById("version-settings-btn"),Fo=document.getElementById("autosave-modal-close-btn"),Wo=document.getElementById("autosave-cancel-btn"),qo=document.getElementById("autosave-save-btn"),In=document.getElementById("autosave-enabled-toggle"),Dt=document.getElementById("autosave-custom-minutes"),ps=()=>{In&&(In.checked=Ge.enabled),Dt&&(Dt.value=Ge.intervalMinutes),document.querySelectorAll(".interval-btn").forEach(e=>{parseInt(e.dataset.minutes)===Ge.intervalMinutes?e.classList.add("active"):e.classList.remove("active")}),Et&&Et.classList.add("visible")},_n=()=>{Et&&Et.classList.remove("visible")},gs=()=>{Ge.enabled=In?In.checked:!0;const e=Dt?parseInt(Dt.value):null;if(e&&e>=1)Ge.intervalMinutes=e;else{const n=document.querySelector(".interval-btn.active");n&&(Ge.intervalMinutes=parseInt(n.dataset.minutes))}ds(),Xo(),_n()};Ho&&Ho.addEventListener("click",ps),Fo&&Fo.addEventListener("click",_n),Wo&&Wo.addEventListener("click",_n),qo&&qo.addEventListener("click",gs),document.querySelectorAll(".interval-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".interval-btn").forEach(n=>n.classList.remove("active")),e.classList.add("active"),Dt&&(Dt.value="")})}),Et&&Et.addEventListener("click",e=>{e.target===Et&&_n()});const Qn=document.getElementById("confirm-dialog"),Uo=document.getElementById("confirm-cancel-btn"),Vo=document.getElementById("confirm-confirm-btn");Uo&&Uo.addEventListener("click",Jn),Vo&&Vo.addEventListener("click",()=>{Tn&&Tn()}),Qn&&Qn.addEventListener("click",e=>{e.target===Qn&&Jn()}),document.addEventListener("click",e=>{if(e.target.closest(".version-save-title-btn")){const n=e.target.closest(".version-save-title-btn"),r=parseInt(n.dataset.versionId);window.saveVersionTitle(r)}});const jo=document.getElementById("save-version-now-btn");jo&&jo.addEventListener("click",()=>{Sn()});const Go=document.getElementById("version-search-box");Go&&Go.addEventListener("input",e=>{Gt(e.target.value)});const Yo=document.getElementById("version-modal-close-btn"),Ko=document.getElementById("version-modal-cancel-btn"),eo=document.getElementById("version-modal");Yo&&Yo.addEventListener("click",Cn),Ko&&Ko.addEventListener("click",Cn),eo&&eo.addEventListener("click",e=>{e.target===eo&&Cn()});const Xo=()=>{if(Kn&&clearInterval(Kn),!Ge.enabled){$n();return}const e=Ge.intervalMinutes*60*1e3;Kn=setInterval(()=>{Sn()},e),$n()},$n=()=>{const e=document.getElementById("status-versions");if(!e)return;let n=["Version History",""];if(Ge.enabled)if(n.push("Autosave: Enabled"),n.push(`Interval: ${Ge.intervalMinutes} minutes`),be.length>0){const r=be[0],i=ut(r.timestamp);n.push(`Last saved: ${i}`)}else n.push("No versions saved yet");else n.push("Autosave: Disabled"),n.push('Save manually using "Save Version Now"');e.setAttribute("title",n.join(`
`))};ls(),cs(),Xo(),setTimeout(()=>{be.length===0&&Sn()},2e3),Vt==="true"||Vt===!0?Vt=!0:Vt=!1;let ms=Fi();an(ms);let hs=qi();ln(hs);let fs=Vi();Ot(fs),ot(Vt),Yi(),Ki(),document.addEventListener("mousemove",e=>{if(d)if(e.preventDefault(),d.container.getBoundingClientRect(),d.divider.offsetWidth,d.isVertical){const n=d.getAvailableHeight(),r=d.container.getBoundingClientRect(),i=d.divider.offsetHeight,g=e.clientY-r.top-d.initialDividerY;let m=d.initialTopHeight+g;const h=100,v=n-h-i;m=Math.max(h,Math.min(m,v)),d.isFlipped,d.leftPane.style.height=m+"px",d.rightPane.style.height=n-m-i+"px",d.lastTopRatio=m/(n-i)}else{const n=d.getAvailableWidth(),r=d.container.getBoundingClientRect(),i=d.divider.offsetWidth,a=e.clientX-r.left,g=a-d.initialDividerX;let m=d.initialLeftWidth+g;const h=100,v=n-h-i;if(m=Math.max(h,Math.min(m,v)),d.divider.id==="cheatsheet-divider"){const P=n-a-i,D=Math.max(250,Math.min(P,600));d.leftPane.style.width=D+"px";const F=document.getElementById("split-divider"),G=F?F.offsetWidth:5,R=n-D-i,O=document.getElementById("edit"),ee=document.getElementById("preview");if(O&&ee){const ke=O.offsetWidth,Se=ee.offsetWidth,Fe=ke+Se+G;if(Fe>0){const Ye=ke/Fe,We=(R-G)*Ye,Yt=R-G-We;O.style.width=We+"px",ee.style.width=Yt+"px"}}d.lastLeftRatio=D/n}else d.isFlipped,d.leftPane.style.width=m+"px",d.rightPane.style.width=n-m-i+"px",d.lastLeftRatio=m/(n-i)}}),document.addEventListener("mouseup",()=>{d&&(d.divider.classList.remove("active"),d.divider.classList.remove("hover"),document.body.style.cursor="default",document.body.classList.remove("dragging"),document.body.style.userSelect="",d=null)}),x.onDidChangeCursorPosition(e=>{const n=e.position.lineNumber;re(n)});const He=document.querySelector("#preview");if(He){He.addEventListener("click",m=>{if($e){let h=m.target;for(;h&&h!==He;){if(h.hasAttribute("contenteditable")&&h.getAttribute("contenteditable")==="true")return;h=h.parentElement}}Le(m.target)});let e=!1,n=!1,r=null,i=null,a=null,g=null;x.onDidScrollChange(m=>{n||!k||(e=!0,clearTimeout(r),a&&cancelAnimationFrame(a),a=requestAnimationFrame(()=>{try{const h=x.getVisibleRanges();if(h&&h.length>0){const v=h[0].startLineNumber,L=document.querySelector(`[data-source-line="${v}"]`);if(L){const T=He.getBoundingClientRect(),D=L.getBoundingClientRect().top-T.top+He.scrollTop;He.scrollTo({top:D,behavior:"auto"})}else{const T=m.scrollTop,P=m.scrollHeight,D=x.getLayoutInfo().height,F=P-D,G=F>0?T/F:0,R=(He.scrollHeight-He.clientHeight)*G;He.scrollTo({top:R,behavior:"auto"})}}}catch(h){console.error("Scroll sync error:",h)}a=null}),r=setTimeout(()=>{e=!1},200))}),He.addEventListener("scroll",()=>{e||!k||(n=!0,clearTimeout(i),g&&cancelAnimationFrame(g),g=requestAnimationFrame(()=>{const m=He.scrollTop,h=He.scrollHeight,v=He.clientHeight,L=h-v,T=L>0?m/L:0,P=x.getScrollHeight(),D=x.getLayoutInfo().height,G=(P-D)*T;x.setScrollTop(G),g=null}),i=setTimeout(()=>{n=!1},200))})}(()=>{const e=document.getElementById("mofu-nav-trigger"),n=document.getElementById("mofu-canvas"),r=document.getElementById("mofu-features"),i=document.getElementById("mofu-mouth");if(!e||!n||!r||!i)return;let a=!1;const g=()=>{a||(a=!0,n.style.transform="",r.style.transform="",i.classList.add("mofu-mouth-o"),n.classList.add("mofu-jumping"),setTimeout(()=>{n.classList.remove("mofu-jumping"),setTimeout(()=>{n.classList.add("mofu-jumping"),setTimeout(()=>{n.classList.remove("mofu-jumping"),i.classList.remove("mofu-mouth-o"),a=!1},800)},100)},800))},m=()=>{a||(a=!0,n.classList.add("mofu-spinning"),n.classList.add("mofu-copied"),setTimeout(()=>{n.classList.remove("mofu-spinning")},600),setTimeout(()=>{n.classList.remove("mofu-copied"),a=!1},1500))};document.addEventListener("mousemove",P=>{if(a||lt)return;const D=n.getBoundingClientRect(),F=D.left+D.width/2,G=D.top+D.height/2,R=(P.clientX-F)/(window.innerWidth/2),O=(P.clientY-G)/(window.innerHeight/2),ee=R*8,ke=O*5,Se=R*15,Fe=O*-10;n.style.transform=`rotateX(${Fe}deg) rotateY(${Se}deg)`,r.style.transform=`translate3d(${ee}px, ${ke}px, 0)`}),e.addEventListener("click",()=>{a||(a=!0,n.style.transform="",r.style.transform="",n.classList.add("mofu-jumping"),setTimeout(()=>{n.classList.remove("mofu-jumping"),a=!1},800))});const h=document.querySelector("#export-button"),v=document.querySelector("#export-html-button");h&&h.addEventListener("click",()=>{setTimeout(g,100)}),v&&v.addEventListener("click",()=>{setTimeout(g,100)});const L=document.querySelector("#copy-button");L&&L.addEventListener("click",()=>{setTimeout(m,100)}),document.addEventListener("copy",P=>{document.activeElement&&document.activeElement.closest("#editor")&&setTimeout(m,100)});const T=document.getElementById("status-save-indicator");T&&(T.style.userSelect="none",T.style.webkitUserSelect="none",T.style.cursor="pointer",T.title="Double-click to save version now",T.addEventListener("dblclick",P=>{P.preventDefault(),P.stopPropagation(),Sn()}),T.addEventListener("mousedown",P=>{P.preventDefault()}),Zn(),setInterval(Zn,3e5))})();const Mn=document.getElementById("settings-panel"),Zo=document.getElementById("settings-button"),Jo=document.querySelectorAll(".settings-tab"),bs=document.querySelectorAll(".settings-tab-content");Zo&&Zo.addEventListener("click",()=>{Mn.classList.add("visible")});const Qo=()=>{Mn.classList.remove("visible")};Mn.querySelector(".settings-panel-overlay").addEventListener("click",Qo),document.addEventListener("keydown",e=>{e.key==="Escape"&&Mn.classList.contains("visible")&&Qo()}),Jo.forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.tab;Jo.forEach(r=>r.classList.remove("active")),e.classList.add("active"),bs.forEach(r=>{r.dataset.tabContent===n?r.classList.add("active"):r.classList.remove("active")})})})};window.addEventListener("load",()=>{Er()});
