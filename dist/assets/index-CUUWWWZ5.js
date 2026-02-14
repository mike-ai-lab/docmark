var xs=Object.defineProperty;var ks=(k,t,o)=>t in k?xs(k,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):k[t]=o;var re=(k,t,o)=>ks(k,typeof t!="symbol"?t+"":t,o);import*as ie from"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))s(c);new MutationObserver(c=>{for(const a of c)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function o(c){const a={};return c.integrity&&(a.integrity=c.integrity),c.referrerPolicy&&(a.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?a.credentials="include":c.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(c){if(c.ep)return;c.ep=!0;const a=o(c);fetch(c.href,a)}})();const Ve=class Ve{};re(Ve,"localStorage",window.localStorage),re(Ve,"sessionStorage",window.sessionStorage),re(Ve,"createKey",function(t,o){return this.getMD5Hash([t,o].join("-"))}),re(Ve,"getItem",function(t,o){var s=this.createKey(t,o),c=JSON.parse(sessionStorage.getItem(s))||JSON.parse(localStorage.getItem(s));if(c){var a=c.value,u=Number(c.expire),p=new Date().getTime();if(u){if(u>p)return a;deleteItem(t,o)}else return a}}),re(Ve,"setItem",function(t,o,s,c){var a={namespace:t,key:o,value:s};c?(a.expire=c.getTime(),localStorage.setItem(this.createKey(t,o),JSON.stringify(a))):sessionStorage.setItem(this.createKey(t,o),JSON.stringify(a))}),re(Ve,"deleteItem",function(t,o){sessionStorage.removeItem(this.createKey(t,o)),localStorage.removeItem(this.createKey(t,o))}),re(Ve,"getInstance",function(t){return{getItem:function(o){return Ve.getItem(t,o)},setItem:function(o,s,c){Ve.setItem(t,o,s,c)},deleteItem:function(o){Ve.deleteItem(t,o)}}}),re(Ve,"getMD5Hash",function(t){var o=new Array(0,3614090360,3905402710,606105819,3250441966,4118548399,1200080426,2821735955,4249261313,1770035416,2336552879,4294925233,2304563134,1804603682,4254626195,2792965006,1236535329,4129170786,3225465664,643717713,3921069994,3593408605,38016083,3634488961,3889429448,568446438,3275163606,4107603335,1163531501,2850285829,4243563512,1735328473,2368359562,4294588738,2272392833,1839030562,4259657740,2763975236,1272893353,4139469664,3200236656,681279174,3936430074,3572445317,76029189,3654602809,3873151461,530742520,3299628645,4096336452,1126891415,2878612391,4237533241,1700485571,2399980690,4293915773,2240044497,1873313359,4264355552,2734768916,1309151649,4149444226,3174756917,718787259,3951481745),s=new Array(new Array(0,7,1),new Array(1,12,2),new Array(2,17,3),new Array(3,22,4),new Array(4,7,5),new Array(5,12,6),new Array(6,17,7),new Array(7,22,8),new Array(8,7,9),new Array(9,12,10),new Array(10,17,11),new Array(11,22,12),new Array(12,7,13),new Array(13,12,14),new Array(14,17,15),new Array(15,22,16)),c=new Array(new Array(1,5,17),new Array(6,9,18),new Array(11,14,19),new Array(0,20,20),new Array(5,5,21),new Array(10,9,22),new Array(15,14,23),new Array(4,20,24),new Array(9,5,25),new Array(14,9,26),new Array(3,14,27),new Array(8,20,28),new Array(13,5,29),new Array(2,9,30),new Array(7,14,31),new Array(12,20,32)),a=new Array(new Array(5,4,33),new Array(8,11,34),new Array(11,16,35),new Array(14,23,36),new Array(1,4,37),new Array(4,11,38),new Array(7,16,39),new Array(10,23,40),new Array(13,4,41),new Array(0,11,42),new Array(3,16,43),new Array(6,23,44),new Array(9,4,45),new Array(12,11,46),new Array(15,16,47),new Array(2,23,48)),u=new Array(new Array(0,6,49),new Array(7,10,50),new Array(14,15,51),new Array(5,21,52),new Array(12,6,53),new Array(3,10,54),new Array(10,15,55),new Array(1,21,56),new Array(8,6,57),new Array(15,10,58),new Array(6,15,59),new Array(13,21,60),new Array(4,6,61),new Array(11,10,62),new Array(2,15,63),new Array(9,21,64));function p(X,Y,ne){return X&Y|~X&ne}function E(X,Y,ne){return X&ne|Y&~ne}function f(X,Y,ne){return X^Y^ne}function L(X,Y,ne){return Y^(X|~ne)}var B=new Array(new Array(p,s),new Array(E,c),new Array(f,a),new Array(L,u));function F(X){return String.fromCharCode(X&255)+String.fromCharCode(X>>>8&255)+String.fromCharCode(X>>>16&255)+String.fromCharCode(X>>>24&255)}function V(X){for(;X<0;)X+=4294967296;for(;X>4294967295;)X-=4294967296;return X}function ae(X,Y,ne,J,be){var Ce,x,S,I,C,v,b,_,$;Ce=J[0],x=J[1],S=J[2],I=J[3],C=be[0],v=be[1],b=be[2],$=ne(Y[x],Y[S],Y[I]),_=Y[Ce]+$+X[C]+o[b],_=V(_),_=_<<v|_>>>32-v,_+=Y[x],Y[Ce]=V(_)}function te(X){var Y,ne,J,be,Ce,x,S,I,C,v,b,_,$;if(J=new Array(1732584193,4023233417,2562383102,271733878),Ce=X.length,x=Ce&63,S=x<56?56-x:120-x,S>0)for(X+="",v=0;v<S-1;v++)X+="\0";for(X+=F(Ce*8),X+=F(0),Ce+=S+8,Y=new Array(0,1,2,3),ne=new Array(16),be=new Array(4),_=0;_<Ce;_+=64){for(v=0,b=_;v<16;v++,b+=4)ne[v]=X.charCodeAt(b)|X.charCodeAt(b+1)<<8|X.charCodeAt(b+2)<<16|X.charCodeAt(b+3)<<24;for(v=0;v<4;v++)be[v]=J[v];for(v=0;v<4;v++)for(I=B[v][0],C=B[v][1],b=0;b<16;b++)ae(ne,be,I,Y,C[b]),$=Y[0],Y[0]=Y[3],Y[3]=Y[2],Y[2]=Y[1],Y[1]=$;for(v=0;v<4;v++)J[v]+=be[v],J[v]=V(J[v])}return F(J[0])+F(J[1])+F(J[2])+F(J[3])}function Le(X){var Y,ne,J,be;for(be=te(X),ne="",Y=0;Y<16;Y++)J=be.charCodeAt(Y),ne+="0123456789abcdef".charAt(J>>4&15),ne+="0123456789abcdef".charAt(J&15);return ne}return Le(t)});let ve=Ve;function mo(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}let Ct=mo();function mi(k){Ct=k}const an={exec:()=>null};function ue(k,t=""){let o=typeof k=="string"?k:k.source;const s={replace:(c,a)=>{let u=typeof a=="string"?a:a.source;return u=u.replace(De.caret,"$1"),o=o.replace(c,u),s},getRegex:()=>new RegExp(o,t)};return s}const De={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:k=>new RegExp(`^( {0,3}${k})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:k=>new RegExp(`^ {0,${Math.min(3,k-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:k=>new RegExp(`^ {0,${Math.min(3,k-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:k=>new RegExp(`^ {0,${Math.min(3,k-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:k=>new RegExp(`^ {0,${Math.min(3,k-1)}}#`),htmlBeginRegex:k=>new RegExp(`^ {0,${Math.min(3,k-1)}}<(?:[a-z].*>|!--)`,"i")},ws=/^(?:[ \t]*(?:\n|$))+/,Es=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ls=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,cn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ss=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,ho=/(?:[*+-]|\d{1,9}[.)])/,hi=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,fi=ue(hi).replace(/bull/g,ho).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ts=ue(hi).replace(/bull/g,ho).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),fo=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Cs=/^[^\n]+/,bo=/(?!\s*\])(?:\\.|[^\[\]\\])+/,As=ue(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",bo).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Is=ue(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,ho).getRegex(),Hn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",yo=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,_s=ue("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",yo).replace("tag",Hn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),bi=ue(fo).replace("hr",cn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Hn).getRegex(),$s=ue(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",bi).getRegex(),vo={blockquote:$s,code:Es,def:As,fences:Ls,heading:Ss,hr:cn,html:_s,lheading:fi,list:Is,newline:ws,paragraph:bi,table:an,text:Cs},ti=ue("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",cn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Hn).getRegex(),Ms={...vo,lheading:Ts,table:ti,paragraph:ue(fo).replace("hr",cn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ti).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Hn).getRegex()},Bs={...vo,html:ue(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",yo).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:an,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ue(fo).replace("hr",cn).replace("heading",` *#{1,6} *[^
]`).replace("lheading",fi).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Rs=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ds=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,yi=/^( {2,}|\\)\n(?!\s*$)/,Ps=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,zn=/[\p{P}\p{S}]/u,xo=/[\s\p{P}\p{S}]/u,vi=/[^\s\p{P}\p{S}]/u,Ns=ue(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,xo).getRegex(),xi=/(?!~)[\p{P}\p{S}]/u,Os=/(?!~)[\s\p{P}\p{S}]/u,Hs=/(?:[^\s\p{P}\p{S}]|~)/u,zs=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,ki=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Fs=ue(ki,"u").replace(/punct/g,zn).getRegex(),Ws=ue(ki,"u").replace(/punct/g,xi).getRegex(),wi="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",qs=ue(wi,"gu").replace(/notPunctSpace/g,vi).replace(/punctSpace/g,xo).replace(/punct/g,zn).getRegex(),Us=ue(wi,"gu").replace(/notPunctSpace/g,Hs).replace(/punctSpace/g,Os).replace(/punct/g,xi).getRegex(),Vs=ue("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,vi).replace(/punctSpace/g,xo).replace(/punct/g,zn).getRegex(),js=ue(/\\(punct)/,"gu").replace(/punct/g,zn).getRegex(),Gs=ue(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ys=ue(yo).replace("(?:-->|$)","-->").getRegex(),Ks=ue("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ys).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Pn=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Xs=ue(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",Pn).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Ei=ue(/^!?\[(label)\]\[(ref)\]/).replace("label",Pn).replace("ref",bo).getRegex(),Li=ue(/^!?\[(ref)\](?:\[\])?/).replace("ref",bo).getRegex(),Zs=ue("reflink|nolink(?!\\()","g").replace("reflink",Ei).replace("nolink",Li).getRegex(),ko={_backpedal:an,anyPunctuation:js,autolink:Gs,blockSkip:zs,br:yi,code:Ds,del:an,emStrongLDelim:Fs,emStrongRDelimAst:qs,emStrongRDelimUnd:Vs,escape:Rs,link:Xs,nolink:Li,punctuation:Ns,reflink:Ei,reflinkSearch:Zs,tag:Ks,text:Ps,url:an},Js={...ko,link:ue(/^!?\[(label)\]\((.*?)\)/).replace("label",Pn).getRegex(),reflink:ue(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Pn).getRegex()},co={...ko,emStrongRDelimAst:Us,emStrongLDelim:Ws,url:ue(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Qs={...co,br:ue(yi).replace("{2,}","*").getRegex(),text:ue(co.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Mn={normal:vo,gfm:Ms,pedantic:Bs},Qt={normal:ko,gfm:co,breaks:Qs,pedantic:Js},er={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ni=k=>er[k];function lt(k,t){if(t){if(De.escapeTest.test(k))return k.replace(De.escapeReplace,ni)}else if(De.escapeTestNoEncode.test(k))return k.replace(De.escapeReplaceNoEncode,ni);return k}function oi(k){try{k=encodeURI(k).replace(De.percentDecode,"%")}catch{return null}return k}function ii(k,t){var a;const o=k.replace(De.findPipe,(u,p,E)=>{let f=!1,L=p;for(;--L>=0&&E[L]==="\\";)f=!f;return f?"|":" |"}),s=o.split(De.splitPipe);let c=0;if(s[0].trim()||s.shift(),s.length>0&&!((a=s.at(-1))!=null&&a.trim())&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;c<s.length;c++)s[c]=s[c].trim().replace(De.slashPipe,"|");return s}function en(k,t,o){const s=k.length;if(s===0)return"";let c=0;for(;c<s&&k.charAt(s-c-1)===t;)c++;return k.slice(0,s-c)}function tr(k,t){if(k.indexOf(t[1])===-1)return-1;let o=0;for(let s=0;s<k.length;s++)if(k[s]==="\\")s++;else if(k[s]===t[0])o++;else if(k[s]===t[1]&&(o--,o<0))return s;return-1}function si(k,t,o,s,c){const a=t.href,u=t.title||null,p=k[1].replace(c.other.outputLinkReplace,"$1");if(k[0].charAt(0)!=="!"){s.state.inLink=!0;const E={type:"link",raw:o,href:a,title:u,text:p,tokens:s.inlineTokens(p)};return s.state.inLink=!1,E}return{type:"image",raw:o,href:a,title:u,text:p}}function nr(k,t,o){const s=k.match(o.other.indentCodeCompensation);if(s===null)return t;const c=s[1];return t.split(`
`).map(a=>{const u=a.match(o.other.beginningSpace);if(u===null)return a;const[p]=u;return p.length>=c.length?a.slice(c.length):a}).join(`
`)}class Nn{constructor(t){re(this,"options");re(this,"rules");re(this,"lexer");this.options=t||Ct}space(t){const o=this.rules.block.newline.exec(t);if(o&&o[0].length>0)return{type:"space",raw:o[0]}}code(t){const o=this.rules.block.code.exec(t);if(o){const s=o[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:o[0],codeBlockStyle:"indented",text:this.options.pedantic?s:en(s,`
`)}}}fences(t){const o=this.rules.block.fences.exec(t);if(o){const s=o[0],c=nr(s,o[3]||"",this.rules);return{type:"code",raw:s,lang:o[2]?o[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):o[2],text:c}}}heading(t){const o=this.rules.block.heading.exec(t);if(o){let s=o[2].trim();if(this.rules.other.endingHash.test(s)){const c=en(s,"#");(this.options.pedantic||!c||this.rules.other.endingSpaceChar.test(c))&&(s=c.trim())}return{type:"heading",raw:o[0],depth:o[1].length,text:s,tokens:this.lexer.inline(s)}}}hr(t){const o=this.rules.block.hr.exec(t);if(o)return{type:"hr",raw:en(o[0],`
`)}}blockquote(t){const o=this.rules.block.blockquote.exec(t);if(o){let s=en(o[0],`
`).split(`
`),c="",a="";const u=[];for(;s.length>0;){let p=!1;const E=[];let f;for(f=0;f<s.length;f++)if(this.rules.other.blockquoteStart.test(s[f]))E.push(s[f]),p=!0;else if(!p)E.push(s[f]);else break;s=s.slice(f);const L=E.join(`
`),B=L.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");c=c?`${c}
${L}`:L,a=a?`${a}
${B}`:B;const F=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(B,u,!0),this.lexer.state.top=F,s.length===0)break;const V=u.at(-1);if((V==null?void 0:V.type)==="code")break;if((V==null?void 0:V.type)==="blockquote"){const ae=V,te=ae.raw+`
`+s.join(`
`),Le=this.blockquote(te);u[u.length-1]=Le,c=c.substring(0,c.length-ae.raw.length)+Le.raw,a=a.substring(0,a.length-ae.text.length)+Le.text;break}else if((V==null?void 0:V.type)==="list"){const ae=V,te=ae.raw+`
`+s.join(`
`),Le=this.list(te);u[u.length-1]=Le,c=c.substring(0,c.length-V.raw.length)+Le.raw,a=a.substring(0,a.length-ae.raw.length)+Le.raw,s=te.substring(u.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:c,tokens:u,text:a}}}list(t){let o=this.rules.block.list.exec(t);if(o){let s=o[1].trim();const c=s.length>1,a={type:"list",raw:"",ordered:c,start:c?+s.slice(0,-1):"",loose:!1,items:[]};s=c?`\\d{1,9}\\${s.slice(-1)}`:`\\${s}`,this.options.pedantic&&(s=c?s:"[*+-]");const u=this.rules.other.listItemRegex(s);let p=!1;for(;t;){let f=!1,L="",B="";if(!(o=u.exec(t))||this.rules.block.hr.test(t))break;L=o[0],t=t.substring(L.length);let F=o[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,Y=>" ".repeat(3*Y.length)),V=t.split(`
`,1)[0],ae=!F.trim(),te=0;if(this.options.pedantic?(te=2,B=F.trimStart()):ae?te=o[1].length+1:(te=o[2].search(this.rules.other.nonSpaceChar),te=te>4?1:te,B=F.slice(te),te+=o[1].length),ae&&this.rules.other.blankLine.test(V)&&(L+=V+`
`,t=t.substring(V.length+1),f=!0),!f){const Y=this.rules.other.nextBulletRegex(te),ne=this.rules.other.hrRegex(te),J=this.rules.other.fencesBeginRegex(te),be=this.rules.other.headingBeginRegex(te),Ce=this.rules.other.htmlBeginRegex(te);for(;t;){const x=t.split(`
`,1)[0];let S;if(V=x,this.options.pedantic?(V=V.replace(this.rules.other.listReplaceNesting,"  "),S=V):S=V.replace(this.rules.other.tabCharGlobal,"    "),J.test(V)||be.test(V)||Ce.test(V)||Y.test(V)||ne.test(V))break;if(S.search(this.rules.other.nonSpaceChar)>=te||!V.trim())B+=`
`+S.slice(te);else{if(ae||F.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||J.test(F)||be.test(F)||ne.test(F))break;B+=`
`+V}!ae&&!V.trim()&&(ae=!0),L+=x+`
`,t=t.substring(x.length+1),F=S.slice(te)}}a.loose||(p?a.loose=!0:this.rules.other.doubleBlankLine.test(L)&&(p=!0));let Le=null,X;this.options.gfm&&(Le=this.rules.other.listIsTask.exec(B),Le&&(X=Le[0]!=="[ ] ",B=B.replace(this.rules.other.listReplaceTask,""))),a.items.push({type:"list_item",raw:L,task:!!Le,checked:X,loose:!1,text:B,tokens:[]}),a.raw+=L}const E=a.items.at(-1);if(E)E.raw=E.raw.trimEnd(),E.text=E.text.trimEnd();else return;a.raw=a.raw.trimEnd();for(let f=0;f<a.items.length;f++)if(this.lexer.state.top=!1,a.items[f].tokens=this.lexer.blockTokens(a.items[f].text,[]),!a.loose){const L=a.items[f].tokens.filter(F=>F.type==="space"),B=L.length>0&&L.some(F=>this.rules.other.anyLine.test(F.raw));a.loose=B}if(a.loose)for(let f=0;f<a.items.length;f++)a.items[f].loose=!0;return a}}html(t){const o=this.rules.block.html.exec(t);if(o)return{type:"html",block:!0,raw:o[0],pre:o[1]==="pre"||o[1]==="script"||o[1]==="style",text:o[0]}}def(t){const o=this.rules.block.def.exec(t);if(o){const s=o[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),c=o[2]?o[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",a=o[3]?o[3].substring(1,o[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):o[3];return{type:"def",tag:s,raw:o[0],href:c,title:a}}}table(t){var p;const o=this.rules.block.table.exec(t);if(!o||!this.rules.other.tableDelimiter.test(o[2]))return;const s=ii(o[1]),c=o[2].replace(this.rules.other.tableAlignChars,"").split("|"),a=(p=o[3])!=null&&p.trim()?o[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],u={type:"table",raw:o[0],header:[],align:[],rows:[]};if(s.length===c.length){for(const E of c)this.rules.other.tableAlignRight.test(E)?u.align.push("right"):this.rules.other.tableAlignCenter.test(E)?u.align.push("center"):this.rules.other.tableAlignLeft.test(E)?u.align.push("left"):u.align.push(null);for(let E=0;E<s.length;E++)u.header.push({text:s[E],tokens:this.lexer.inline(s[E]),header:!0,align:u.align[E]});for(const E of a)u.rows.push(ii(E,u.header.length).map((f,L)=>({text:f,tokens:this.lexer.inline(f),header:!1,align:u.align[L]})));return u}}lheading(t){const o=this.rules.block.lheading.exec(t);if(o)return{type:"heading",raw:o[0],depth:o[2].charAt(0)==="="?1:2,text:o[1],tokens:this.lexer.inline(o[1])}}paragraph(t){const o=this.rules.block.paragraph.exec(t);if(o){const s=o[1].charAt(o[1].length-1)===`
`?o[1].slice(0,-1):o[1];return{type:"paragraph",raw:o[0],text:s,tokens:this.lexer.inline(s)}}}text(t){const o=this.rules.block.text.exec(t);if(o)return{type:"text",raw:o[0],text:o[0],tokens:this.lexer.inline(o[0])}}escape(t){const o=this.rules.inline.escape.exec(t);if(o)return{type:"escape",raw:o[0],text:o[1]}}tag(t){const o=this.rules.inline.tag.exec(t);if(o)return!this.lexer.state.inLink&&this.rules.other.startATag.test(o[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(o[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(o[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(o[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:o[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:o[0]}}link(t){const o=this.rules.inline.link.exec(t);if(o){const s=o[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(s)){if(!this.rules.other.endAngleBracket.test(s))return;const u=en(s.slice(0,-1),"\\");if((s.length-u.length)%2===0)return}else{const u=tr(o[2],"()");if(u>-1){const E=(o[0].indexOf("!")===0?5:4)+o[1].length+u;o[2]=o[2].substring(0,u),o[0]=o[0].substring(0,E).trim(),o[3]=""}}let c=o[2],a="";if(this.options.pedantic){const u=this.rules.other.pedanticHrefTitle.exec(c);u&&(c=u[1],a=u[3])}else a=o[3]?o[3].slice(1,-1):"";return c=c.trim(),this.rules.other.startAngleBracket.test(c)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(s)?c=c.slice(1):c=c.slice(1,-1)),si(o,{href:c&&c.replace(this.rules.inline.anyPunctuation,"$1"),title:a&&a.replace(this.rules.inline.anyPunctuation,"$1")},o[0],this.lexer,this.rules)}}reflink(t,o){let s;if((s=this.rules.inline.reflink.exec(t))||(s=this.rules.inline.nolink.exec(t))){const c=(s[2]||s[1]).replace(this.rules.other.multipleSpaceGlobal," "),a=o[c.toLowerCase()];if(!a){const u=s[0].charAt(0);return{type:"text",raw:u,text:u}}return si(s,a,s[0],this.lexer,this.rules)}}emStrong(t,o,s=""){let c=this.rules.inline.emStrongLDelim.exec(t);if(!c||c[3]&&s.match(this.rules.other.unicodeAlphaNumeric))return;if(!(c[1]||c[2]||"")||!s||this.rules.inline.punctuation.exec(s)){const u=[...c[0]].length-1;let p,E,f=u,L=0;const B=c[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(B.lastIndex=0,o=o.slice(-1*t.length+u);(c=B.exec(o))!=null;){if(p=c[1]||c[2]||c[3]||c[4]||c[5]||c[6],!p)continue;if(E=[...p].length,c[3]||c[4]){f+=E;continue}else if((c[5]||c[6])&&u%3&&!((u+E)%3)){L+=E;continue}if(f-=E,f>0)continue;E=Math.min(E,E+f+L);const F=[...c[0]][0].length,V=t.slice(0,u+c.index+F+E);if(Math.min(u,E)%2){const te=V.slice(1,-1);return{type:"em",raw:V,text:te,tokens:this.lexer.inlineTokens(te)}}const ae=V.slice(2,-2);return{type:"strong",raw:V,text:ae,tokens:this.lexer.inlineTokens(ae)}}}}codespan(t){const o=this.rules.inline.code.exec(t);if(o){let s=o[2].replace(this.rules.other.newLineCharGlobal," ");const c=this.rules.other.nonSpaceChar.test(s),a=this.rules.other.startingSpaceChar.test(s)&&this.rules.other.endingSpaceChar.test(s);return c&&a&&(s=s.substring(1,s.length-1)),{type:"codespan",raw:o[0],text:s}}}br(t){const o=this.rules.inline.br.exec(t);if(o)return{type:"br",raw:o[0]}}del(t){const o=this.rules.inline.del.exec(t);if(o)return{type:"del",raw:o[0],text:o[2],tokens:this.lexer.inlineTokens(o[2])}}autolink(t){const o=this.rules.inline.autolink.exec(t);if(o){let s,c;return o[2]==="@"?(s=o[1],c="mailto:"+s):(s=o[1],c=s),{type:"link",raw:o[0],text:s,href:c,tokens:[{type:"text",raw:s,text:s}]}}}url(t){var s;let o;if(o=this.rules.inline.url.exec(t)){let c,a;if(o[2]==="@")c=o[0],a="mailto:"+c;else{let u;do u=o[0],o[0]=((s=this.rules.inline._backpedal.exec(o[0]))==null?void 0:s[0])??"";while(u!==o[0]);c=o[0],o[1]==="www."?a="http://"+o[0]:a=o[0]}return{type:"link",raw:o[0],text:c,href:a,tokens:[{type:"text",raw:c,text:c}]}}}inlineText(t){const o=this.rules.inline.text.exec(t);if(o){const s=this.lexer.state.inRawBlock;return{type:"text",raw:o[0],text:o[0],escaped:s}}}}class Ze{constructor(t){re(this,"tokens");re(this,"options");re(this,"state");re(this,"tokenizer");re(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Ct,this.options.tokenizer=this.options.tokenizer||new Nn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const o={other:De,block:Mn.normal,inline:Qt.normal};this.options.pedantic?(o.block=Mn.pedantic,o.inline=Qt.pedantic):this.options.gfm&&(o.block=Mn.gfm,this.options.breaks?o.inline=Qt.breaks:o.inline=Qt.gfm),this.tokenizer.rules=o}static get rules(){return{block:Mn,inline:Qt}}static lex(t,o){return new Ze(o).lex(t)}static lexInline(t,o){return new Ze(o).inlineTokens(t)}lex(t){t=t.replace(De.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let o=0;o<this.inlineQueue.length;o++){const s=this.inlineQueue[o];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,o=[],s=!1){var c,a,u;for(this.options.pedantic&&(t=t.replace(De.tabCharGlobal,"    ").replace(De.spaceLine,""));t;){let p;if((a=(c=this.options.extensions)==null?void 0:c.block)!=null&&a.some(f=>(p=f.call({lexer:this},t,o))?(t=t.substring(p.raw.length),o.push(p),!0):!1))continue;if(p=this.tokenizer.space(t)){t=t.substring(p.raw.length);const f=o.at(-1);p.raw.length===1&&f!==void 0?f.raw+=`
`:o.push(p);continue}if(p=this.tokenizer.code(t)){t=t.substring(p.raw.length);const f=o.at(-1);(f==null?void 0:f.type)==="paragraph"||(f==null?void 0:f.type)==="text"?(f.raw+=`
`+p.raw,f.text+=`
`+p.text,this.inlineQueue.at(-1).src=f.text):o.push(p);continue}if(p=this.tokenizer.fences(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.heading(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.hr(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.blockquote(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.list(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.html(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.def(t)){t=t.substring(p.raw.length);const f=o.at(-1);(f==null?void 0:f.type)==="paragraph"||(f==null?void 0:f.type)==="text"?(f.raw+=`
`+p.raw,f.text+=`
`+p.raw,this.inlineQueue.at(-1).src=f.text):this.tokens.links[p.tag]||(this.tokens.links[p.tag]={href:p.href,title:p.title});continue}if(p=this.tokenizer.table(t)){t=t.substring(p.raw.length),o.push(p);continue}if(p=this.tokenizer.lheading(t)){t=t.substring(p.raw.length),o.push(p);continue}let E=t;if((u=this.options.extensions)!=null&&u.startBlock){let f=1/0;const L=t.slice(1);let B;this.options.extensions.startBlock.forEach(F=>{B=F.call({lexer:this},L),typeof B=="number"&&B>=0&&(f=Math.min(f,B))}),f<1/0&&f>=0&&(E=t.substring(0,f+1))}if(this.state.top&&(p=this.tokenizer.paragraph(E))){const f=o.at(-1);s&&(f==null?void 0:f.type)==="paragraph"?(f.raw+=`
`+p.raw,f.text+=`
`+p.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=f.text):o.push(p),s=E.length!==t.length,t=t.substring(p.raw.length);continue}if(p=this.tokenizer.text(t)){t=t.substring(p.raw.length);const f=o.at(-1);(f==null?void 0:f.type)==="text"?(f.raw+=`
`+p.raw,f.text+=`
`+p.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=f.text):o.push(p);continue}if(t){const f="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(f);break}else throw new Error(f)}}return this.state.top=!0,o}inline(t,o=[]){return this.inlineQueue.push({src:t,tokens:o}),o}inlineTokens(t,o=[]){var p,E,f;let s=t,c=null;if(this.tokens.links){const L=Object.keys(this.tokens.links);if(L.length>0)for(;(c=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)L.includes(c[0].slice(c[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,c.index)+"["+"a".repeat(c[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(c=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)s=s.slice(0,c.index)+"["+"a".repeat(c[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(c=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,c.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a=!1,u="";for(;t;){a||(u=""),a=!1;let L;if((E=(p=this.options.extensions)==null?void 0:p.inline)!=null&&E.some(F=>(L=F.call({lexer:this},t,o))?(t=t.substring(L.raw.length),o.push(L),!0):!1))continue;if(L=this.tokenizer.escape(t)){t=t.substring(L.raw.length),o.push(L);continue}if(L=this.tokenizer.tag(t)){t=t.substring(L.raw.length),o.push(L);continue}if(L=this.tokenizer.link(t)){t=t.substring(L.raw.length),o.push(L);continue}if(L=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(L.raw.length);const F=o.at(-1);L.type==="text"&&(F==null?void 0:F.type)==="text"?(F.raw+=L.raw,F.text+=L.text):o.push(L);continue}if(L=this.tokenizer.emStrong(t,s,u)){t=t.substring(L.raw.length),o.push(L);continue}if(L=this.tokenizer.codespan(t)){t=t.substring(L.raw.length),o.push(L);continue}if(L=this.tokenizer.br(t)){t=t.substring(L.raw.length),o.push(L);continue}if(L=this.tokenizer.del(t)){t=t.substring(L.raw.length),o.push(L);continue}if(L=this.tokenizer.autolink(t)){t=t.substring(L.raw.length),o.push(L);continue}if(!this.state.inLink&&(L=this.tokenizer.url(t))){t=t.substring(L.raw.length),o.push(L);continue}let B=t;if((f=this.options.extensions)!=null&&f.startInline){let F=1/0;const V=t.slice(1);let ae;this.options.extensions.startInline.forEach(te=>{ae=te.call({lexer:this},V),typeof ae=="number"&&ae>=0&&(F=Math.min(F,ae))}),F<1/0&&F>=0&&(B=t.substring(0,F+1))}if(L=this.tokenizer.inlineText(B)){t=t.substring(L.raw.length),L.raw.slice(-1)!=="_"&&(u=L.raw.slice(-1)),a=!0;const F=o.at(-1);(F==null?void 0:F.type)==="text"?(F.raw+=L.raw,F.text+=L.text):o.push(L);continue}if(t){const F="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(F);break}else throw new Error(F)}}return o}}class On{constructor(t){re(this,"options");re(this,"parser");this.options=t||Ct}space(t){return""}code({text:t,lang:o,escaped:s}){var u;const c=(u=(o||"").match(De.notSpaceStart))==null?void 0:u[0],a=t.replace(De.endingNewline,"")+`
`;return c?'<pre><code class="language-'+lt(c)+'">'+(s?a:lt(a,!0))+`</code></pre>
`:"<pre><code>"+(s?a:lt(a,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:o}){return`<h${o}>${this.parser.parseInline(t)}</h${o}>
`}hr(t){return`<hr>
`}list(t){const o=t.ordered,s=t.start;let c="";for(let p=0;p<t.items.length;p++){const E=t.items[p];c+=this.listitem(E)}const a=o?"ol":"ul",u=o&&s!==1?' start="'+s+'"':"";return"<"+a+u+`>
`+c+"</"+a+`>
`}listitem(t){var s;let o="";if(t.task){const c=this.checkbox({checked:!!t.checked});t.loose?((s=t.tokens[0])==null?void 0:s.type)==="paragraph"?(t.tokens[0].text=c+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=c+" "+lt(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:c+" ",text:c+" ",escaped:!0}):o+=c+" "}return o+=this.parser.parse(t.tokens,!!t.loose),`<li>${o}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let o="",s="";for(let a=0;a<t.header.length;a++)s+=this.tablecell(t.header[a]);o+=this.tablerow({text:s});let c="";for(let a=0;a<t.rows.length;a++){const u=t.rows[a];s="";for(let p=0;p<u.length;p++)s+=this.tablecell(u[p]);c+=this.tablerow({text:s})}return c&&(c=`<tbody>${c}</tbody>`),`<table>
<thead>
`+o+`</thead>
`+c+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){const o=this.parser.parseInline(t.tokens),s=t.header?"th":"td";return(t.align?`<${s} align="${t.align}">`:`<${s}>`)+o+`</${s}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${lt(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:o,tokens:s}){const c=this.parser.parseInline(s),a=oi(t);if(a===null)return c;t=a;let u='<a href="'+t+'"';return o&&(u+=' title="'+lt(o)+'"'),u+=">"+c+"</a>",u}image({href:t,title:o,text:s}){const c=oi(t);if(c===null)return lt(s);t=c;let a=`<img src="${t}" alt="${s}"`;return o&&(a+=` title="${lt(o)}"`),a+=">",a}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:lt(t.text)}}class wo{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}}class Je{constructor(t){re(this,"options");re(this,"renderer");re(this,"textRenderer");this.options=t||Ct,this.options.renderer=this.options.renderer||new On,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new wo}static parse(t,o){return new Je(o).parse(t)}static parseInline(t,o){return new Je(o).parseInline(t)}parse(t,o=!0){var c,a;let s="";for(let u=0;u<t.length;u++){const p=t[u];if((a=(c=this.options.extensions)==null?void 0:c.renderers)!=null&&a[p.type]){const f=p,L=this.options.extensions.renderers[f.type].call({parser:this},f);if(L!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(f.type)){s+=L||"";continue}}const E=p;switch(E.type){case"space":{s+=this.renderer.space(E);continue}case"hr":{s+=this.renderer.hr(E);continue}case"heading":{s+=this.renderer.heading(E);continue}case"code":{s+=this.renderer.code(E);continue}case"table":{s+=this.renderer.table(E);continue}case"blockquote":{s+=this.renderer.blockquote(E);continue}case"list":{s+=this.renderer.list(E);continue}case"html":{s+=this.renderer.html(E);continue}case"paragraph":{s+=this.renderer.paragraph(E);continue}case"text":{let f=E,L=this.renderer.text(f);for(;u+1<t.length&&t[u+1].type==="text";)f=t[++u],L+=`
`+this.renderer.text(f);o?s+=this.renderer.paragraph({type:"paragraph",raw:L,text:L,tokens:[{type:"text",raw:L,text:L,escaped:!0}]}):s+=L;continue}default:{const f='Token with "'+E.type+'" type was not found.';if(this.options.silent)return console.error(f),"";throw new Error(f)}}}return s}parseInline(t,o=this.renderer){var c,a;let s="";for(let u=0;u<t.length;u++){const p=t[u];if((a=(c=this.options.extensions)==null?void 0:c.renderers)!=null&&a[p.type]){const f=this.options.extensions.renderers[p.type].call({parser:this},p);if(f!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(p.type)){s+=f||"";continue}}const E=p;switch(E.type){case"escape":{s+=o.text(E);break}case"html":{s+=o.html(E);break}case"link":{s+=o.link(E);break}case"image":{s+=o.image(E);break}case"strong":{s+=o.strong(E);break}case"em":{s+=o.em(E);break}case"codespan":{s+=o.codespan(E);break}case"br":{s+=o.br(E);break}case"del":{s+=o.del(E);break}case"text":{s+=o.text(E);break}default:{const f='Token with "'+E.type+'" type was not found.';if(this.options.silent)return console.error(f),"";throw new Error(f)}}}return s}}class ln{constructor(t){re(this,"options");re(this,"block");this.options=t||Ct}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?Ze.lex:Ze.lexInline}provideParser(){return this.block?Je.parse:Je.parseInline}}re(ln,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));class or{constructor(...t){re(this,"defaults",mo());re(this,"options",this.setOptions);re(this,"parse",this.parseMarkdown(!0));re(this,"parseInline",this.parseMarkdown(!1));re(this,"Parser",Je);re(this,"Renderer",On);re(this,"TextRenderer",wo);re(this,"Lexer",Ze);re(this,"Tokenizer",Nn);re(this,"Hooks",ln);this.use(...t)}walkTokens(t,o){var c,a;let s=[];for(const u of t)switch(s=s.concat(o.call(this,u)),u.type){case"table":{const p=u;for(const E of p.header)s=s.concat(this.walkTokens(E.tokens,o));for(const E of p.rows)for(const f of E)s=s.concat(this.walkTokens(f.tokens,o));break}case"list":{const p=u;s=s.concat(this.walkTokens(p.items,o));break}default:{const p=u;(a=(c=this.defaults.extensions)==null?void 0:c.childTokens)!=null&&a[p.type]?this.defaults.extensions.childTokens[p.type].forEach(E=>{const f=p[E].flat(1/0);s=s.concat(this.walkTokens(f,o))}):p.tokens&&(s=s.concat(this.walkTokens(p.tokens,o)))}}return s}use(...t){const o=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(s=>{const c={...s};if(c.async=this.defaults.async||c.async||!1,s.extensions&&(s.extensions.forEach(a=>{if(!a.name)throw new Error("extension name required");if("renderer"in a){const u=o.renderers[a.name];u?o.renderers[a.name]=function(...p){let E=a.renderer.apply(this,p);return E===!1&&(E=u.apply(this,p)),E}:o.renderers[a.name]=a.renderer}if("tokenizer"in a){if(!a.level||a.level!=="block"&&a.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const u=o[a.level];u?u.unshift(a.tokenizer):o[a.level]=[a.tokenizer],a.start&&(a.level==="block"?o.startBlock?o.startBlock.push(a.start):o.startBlock=[a.start]:a.level==="inline"&&(o.startInline?o.startInline.push(a.start):o.startInline=[a.start]))}"childTokens"in a&&a.childTokens&&(o.childTokens[a.name]=a.childTokens)}),c.extensions=o),s.renderer){const a=this.defaults.renderer||new On(this.defaults);for(const u in s.renderer){if(!(u in a))throw new Error(`renderer '${u}' does not exist`);if(["options","parser"].includes(u))continue;const p=u,E=s.renderer[p],f=a[p];a[p]=(...L)=>{let B=E.apply(a,L);return B===!1&&(B=f.apply(a,L)),B||""}}c.renderer=a}if(s.tokenizer){const a=this.defaults.tokenizer||new Nn(this.defaults);for(const u in s.tokenizer){if(!(u in a))throw new Error(`tokenizer '${u}' does not exist`);if(["options","rules","lexer"].includes(u))continue;const p=u,E=s.tokenizer[p],f=a[p];a[p]=(...L)=>{let B=E.apply(a,L);return B===!1&&(B=f.apply(a,L)),B}}c.tokenizer=a}if(s.hooks){const a=this.defaults.hooks||new ln;for(const u in s.hooks){if(!(u in a))throw new Error(`hook '${u}' does not exist`);if(["options","block"].includes(u))continue;const p=u,E=s.hooks[p],f=a[p];ln.passThroughHooks.has(u)?a[p]=L=>{if(this.defaults.async)return Promise.resolve(E.call(a,L)).then(F=>f.call(a,F));const B=E.call(a,L);return f.call(a,B)}:a[p]=(...L)=>{let B=E.apply(a,L);return B===!1&&(B=f.apply(a,L)),B}}c.hooks=a}if(s.walkTokens){const a=this.defaults.walkTokens,u=s.walkTokens;c.walkTokens=function(p){let E=[];return E.push(u.call(this,p)),a&&(E=E.concat(a.call(this,p))),E}}this.defaults={...this.defaults,...c}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,o){return Ze.lex(t,o??this.defaults)}parser(t,o){return Je.parse(t,o??this.defaults)}parseMarkdown(t){return(s,c)=>{const a={...c},u={...this.defaults,...a},p=this.onError(!!u.silent,!!u.async);if(this.defaults.async===!0&&a.async===!1)return p(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof s>"u"||s===null)return p(new Error("marked(): input parameter is undefined or null"));if(typeof s!="string")return p(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(s)+", string expected"));u.hooks&&(u.hooks.options=u,u.hooks.block=t);const E=u.hooks?u.hooks.provideLexer():t?Ze.lex:Ze.lexInline,f=u.hooks?u.hooks.provideParser():t?Je.parse:Je.parseInline;if(u.async)return Promise.resolve(u.hooks?u.hooks.preprocess(s):s).then(L=>E(L,u)).then(L=>u.hooks?u.hooks.processAllTokens(L):L).then(L=>u.walkTokens?Promise.all(this.walkTokens(L,u.walkTokens)).then(()=>L):L).then(L=>f(L,u)).then(L=>u.hooks?u.hooks.postprocess(L):L).catch(p);try{u.hooks&&(s=u.hooks.preprocess(s));let L=E(s,u);u.hooks&&(L=u.hooks.processAllTokens(L)),u.walkTokens&&this.walkTokens(L,u.walkTokens);let B=f(L,u);return u.hooks&&(B=u.hooks.postprocess(B)),B}catch(L){return p(L)}}}onError(t,o){return s=>{if(s.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const c="<p>An error occurred:</p><pre>"+lt(s.message+"",!0)+"</pre>";return o?Promise.resolve(c):c}if(o)return Promise.reject(s);throw s}}}const Tt=new or;function le(k,t){return Tt.parse(k,t)}le.options=le.setOptions=function(k){return Tt.setOptions(k),le.defaults=Tt.defaults,mi(le.defaults),le};le.getDefaults=mo;le.defaults=Ct;le.use=function(...k){return Tt.use(...k),le.defaults=Tt.defaults,mi(le.defaults),le};le.walkTokens=function(k,t){return Tt.walkTokens(k,t)};le.parseInline=Tt.parseInline;le.Parser=Je;le.parser=Je.parse;le.Renderer=On;le.TextRenderer=wo;le.Lexer=Ze;le.lexer=Ze.lex;le.Tokenizer=Nn;le.Hooks=ln;le.parse=le;le.options;le.setOptions;le.use;le.walkTokens;le.parseInline;Je.parse;Ze.lex;/*! @license DOMPurify 3.3.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.1/LICENSE */const{entries:Si,setPrototypeOf:ri,isFrozen:ir,getPrototypeOf:sr,getOwnPropertyDescriptor:rr}=Object;let{freeze:Pe,seal:Qe,create:uo}=Object,{apply:po,construct:go}=typeof Reflect<"u"&&Reflect;Pe||(Pe=function(t){return t});Qe||(Qe=function(t){return t});po||(po=function(t,o){for(var s=arguments.length,c=new Array(s>2?s-2:0),a=2;a<s;a++)c[a-2]=arguments[a];return t.apply(o,c)});go||(go=function(t){for(var o=arguments.length,s=new Array(o>1?o-1:0),c=1;c<o;c++)s[c-1]=arguments[c];return new t(...s)});const Bn=Ne(Array.prototype.forEach),ar=Ne(Array.prototype.lastIndexOf),ai=Ne(Array.prototype.pop),tn=Ne(Array.prototype.push),lr=Ne(Array.prototype.splice),Dn=Ne(String.prototype.toLowerCase),no=Ne(String.prototype.toString),oo=Ne(String.prototype.match),nn=Ne(String.prototype.replace),cr=Ne(String.prototype.indexOf),dr=Ne(String.prototype.trim),it=Ne(Object.prototype.hasOwnProperty),Re=Ne(RegExp.prototype.test),on=ur(TypeError);function Ne(k){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var o=arguments.length,s=new Array(o>1?o-1:0),c=1;c<o;c++)s[c-1]=arguments[c];return po(k,t,s)}}function ur(k){return function(){for(var t=arguments.length,o=new Array(t),s=0;s<t;s++)o[s]=arguments[s];return go(k,o)}}function ee(k,t){let o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Dn;ri&&ri(k,null);let s=t.length;for(;s--;){let c=t[s];if(typeof c=="string"){const a=o(c);a!==c&&(ir(t)||(t[s]=a),c=a)}k[c]=!0}return k}function pr(k){for(let t=0;t<k.length;t++)it(k,t)||(k[t]=null);return k}function ct(k){const t=uo(null);for(const[o,s]of Si(k))it(k,o)&&(Array.isArray(s)?t[o]=pr(s):s&&typeof s=="object"&&s.constructor===Object?t[o]=ct(s):t[o]=s);return t}function sn(k,t){for(;k!==null;){const s=rr(k,t);if(s){if(s.get)return Ne(s.get);if(typeof s.value=="function")return Ne(s.value)}k=sr(k)}function o(){return null}return o}const li=Pe(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),io=Pe(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),so=Pe(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),gr=Pe(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),ro=Pe(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),mr=Pe(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),ci=Pe(["#text"]),di=Pe(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),ao=Pe(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),ui=Pe(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Rn=Pe(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),hr=Qe(/\{\{[\w\W]*|[\w\W]*\}\}/gm),fr=Qe(/<%[\w\W]*|[\w\W]*%>/gm),br=Qe(/\$\{[\w\W]*/gm),yr=Qe(/^data-[\-\w.\u00B7-\uFFFF]+$/),vr=Qe(/^aria-[\-\w]+$/),Ti=Qe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),xr=Qe(/^(?:\w+script|data):/i),kr=Qe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ci=Qe(/^html$/i),wr=Qe(/^[a-z][.\w]*(-[.\w]+)+$/i);var pi=Object.freeze({__proto__:null,ARIA_ATTR:vr,ATTR_WHITESPACE:kr,CUSTOM_ELEMENT:wr,DATA_ATTR:yr,DOCTYPE_NAME:Ci,ERB_EXPR:fr,IS_ALLOWED_URI:Ti,IS_SCRIPT_OR_DATA:xr,MUSTACHE_EXPR:hr,TMPLIT_EXPR:br});const rn={element:1,text:3,progressingInstruction:7,comment:8,document:9},Er=function(){return typeof window>"u"?null:window},Lr=function(t,o){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const c="data-tt-policy-suffix";o&&o.hasAttribute(c)&&(s=o.getAttribute(c));const a="dompurify"+(s?"#"+s:"");try{return t.createPolicy(a,{createHTML(u){return u},createScriptURL(u){return u}})}catch{return console.warn("TrustedTypes policy "+a+" could not be created."),null}},gi=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Ai(){let k=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Er();const t=W=>Ai(W);if(t.version="3.3.1",t.removed=[],!k||!k.document||k.document.nodeType!==rn.document||!k.Element)return t.isSupported=!1,t;let{document:o}=k;const s=o,c=s.currentScript,{DocumentFragment:a,HTMLTemplateElement:u,Node:p,Element:E,NodeFilter:f,NamedNodeMap:L=k.NamedNodeMap||k.MozNamedAttrMap,HTMLFormElement:B,DOMParser:F,trustedTypes:V}=k,ae=E.prototype,te=sn(ae,"cloneNode"),Le=sn(ae,"remove"),X=sn(ae,"nextSibling"),Y=sn(ae,"childNodes"),ne=sn(ae,"parentNode");if(typeof u=="function"){const W=o.createElement("template");W.content&&W.content.ownerDocument&&(o=W.content.ownerDocument)}let J,be="";const{implementation:Ce,createNodeIterator:x,createDocumentFragment:S,getElementsByTagName:I}=o,{importNode:C}=s;let v=gi();t.isSupported=typeof Si=="function"&&typeof ne=="function"&&Ce&&Ce.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:b,ERB_EXPR:_,TMPLIT_EXPR:$,DATA_ATTR:D,ARIA_ATTR:q,IS_SCRIPT_OR_DATA:Z,ATTR_WHITESPACE:oe,CUSTOM_ELEMENT:xe}=pi;let{IS_ALLOWED_URI:z}=pi,Q=null;const H=ee({},[...li,...io,...so,...ro,...ci]);let K=null;const Oe=ee({},[...di,...ao,...ui,...Rn]);let ce=Object.seal(uo(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),we=null,At=null;const st=Object.seal(uo(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let It=!0,dt=!0,vt=!1,xt=!0,et=!1,rt=!0,U=!1,pe=!1,me=!1,se=!1,Ee=!1,tt=!1,Ot=!0,dn=!1;const Fn="user-content-";let Ht=!0,gt=!1,mt={},ze=null;const zt=ee({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let un=null;const Ft=ee({},["audio","video","img","source","image","track"]);let Wt=null;const qt=ee({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),_t="http://www.w3.org/1998/Math/MathML",$t="http://www.w3.org/2000/svg",je="http://www.w3.org/1999/xhtml";let ht=je,Mt=!1,Ut=null;const Wn=ee({},[_t,$t,je],no);let Bt=ee({},["mi","mo","mn","ms","mtext"]),Rt=ee({},["annotation-xml"]);const qn=ee({},["title","style","font","a","script"]);let kt=null;const Un=["application/xhtml+xml","text/html"],Vn="text/html";let Se=null,ft=null;const jn=o.createElement("form"),pn=function(d){return d instanceof RegExp||d instanceof Function},Vt=function(){let d=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(ft&&ft===d)){if((!d||typeof d!="object")&&(d={}),d=ct(d),kt=Un.indexOf(d.PARSER_MEDIA_TYPE)===-1?Vn:d.PARSER_MEDIA_TYPE,Se=kt==="application/xhtml+xml"?no:Dn,Q=it(d,"ALLOWED_TAGS")?ee({},d.ALLOWED_TAGS,Se):H,K=it(d,"ALLOWED_ATTR")?ee({},d.ALLOWED_ATTR,Se):Oe,Ut=it(d,"ALLOWED_NAMESPACES")?ee({},d.ALLOWED_NAMESPACES,no):Wn,Wt=it(d,"ADD_URI_SAFE_ATTR")?ee(ct(qt),d.ADD_URI_SAFE_ATTR,Se):qt,un=it(d,"ADD_DATA_URI_TAGS")?ee(ct(Ft),d.ADD_DATA_URI_TAGS,Se):Ft,ze=it(d,"FORBID_CONTENTS")?ee({},d.FORBID_CONTENTS,Se):zt,we=it(d,"FORBID_TAGS")?ee({},d.FORBID_TAGS,Se):ct({}),At=it(d,"FORBID_ATTR")?ee({},d.FORBID_ATTR,Se):ct({}),mt=it(d,"USE_PROFILES")?d.USE_PROFILES:!1,It=d.ALLOW_ARIA_ATTR!==!1,dt=d.ALLOW_DATA_ATTR!==!1,vt=d.ALLOW_UNKNOWN_PROTOCOLS||!1,xt=d.ALLOW_SELF_CLOSE_IN_ATTR!==!1,et=d.SAFE_FOR_TEMPLATES||!1,rt=d.SAFE_FOR_XML!==!1,U=d.WHOLE_DOCUMENT||!1,se=d.RETURN_DOM||!1,Ee=d.RETURN_DOM_FRAGMENT||!1,tt=d.RETURN_TRUSTED_TYPE||!1,me=d.FORCE_BODY||!1,Ot=d.SANITIZE_DOM!==!1,dn=d.SANITIZE_NAMED_PROPS||!1,Ht=d.KEEP_CONTENT!==!1,gt=d.IN_PLACE||!1,z=d.ALLOWED_URI_REGEXP||Ti,ht=d.NAMESPACE||je,Bt=d.MATHML_TEXT_INTEGRATION_POINTS||Bt,Rt=d.HTML_INTEGRATION_POINTS||Rt,ce=d.CUSTOM_ELEMENT_HANDLING||{},d.CUSTOM_ELEMENT_HANDLING&&pn(d.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(ce.tagNameCheck=d.CUSTOM_ELEMENT_HANDLING.tagNameCheck),d.CUSTOM_ELEMENT_HANDLING&&pn(d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(ce.attributeNameCheck=d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),d.CUSTOM_ELEMENT_HANDLING&&typeof d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(ce.allowCustomizedBuiltInElements=d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),et&&(dt=!1),Ee&&(se=!0),mt&&(Q=ee({},ci),K=[],mt.html===!0&&(ee(Q,li),ee(K,di)),mt.svg===!0&&(ee(Q,io),ee(K,ao),ee(K,Rn)),mt.svgFilters===!0&&(ee(Q,so),ee(K,ao),ee(K,Rn)),mt.mathMl===!0&&(ee(Q,ro),ee(K,ui),ee(K,Rn))),d.ADD_TAGS&&(typeof d.ADD_TAGS=="function"?st.tagCheck=d.ADD_TAGS:(Q===H&&(Q=ct(Q)),ee(Q,d.ADD_TAGS,Se))),d.ADD_ATTR&&(typeof d.ADD_ATTR=="function"?st.attributeCheck=d.ADD_ATTR:(K===Oe&&(K=ct(K)),ee(K,d.ADD_ATTR,Se))),d.ADD_URI_SAFE_ATTR&&ee(Wt,d.ADD_URI_SAFE_ATTR,Se),d.FORBID_CONTENTS&&(ze===zt&&(ze=ct(ze)),ee(ze,d.FORBID_CONTENTS,Se)),d.ADD_FORBID_CONTENTS&&(ze===zt&&(ze=ct(ze)),ee(ze,d.ADD_FORBID_CONTENTS,Se)),Ht&&(Q["#text"]=!0),U&&ee(Q,["html","head","body"]),Q.table&&(ee(Q,["tbody"]),delete we.tbody),d.TRUSTED_TYPES_POLICY){if(typeof d.TRUSTED_TYPES_POLICY.createHTML!="function")throw on('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof d.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw on('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');J=d.TRUSTED_TYPES_POLICY,be=J.createHTML("")}else J===void 0&&(J=Lr(V,c)),J!==null&&typeof be=="string"&&(be=J.createHTML(""));Pe&&Pe(d),ft=d}},wt=ee({},[...io,...so,...gr]),bt=ee({},[...ro,...mr]),Et=function(d){let A=ne(d);(!A||!A.tagName)&&(A={namespaceURI:ht,tagName:"template"});const O=Dn(d.tagName),fe=Dn(A.tagName);return Ut[d.namespaceURI]?d.namespaceURI===$t?A.namespaceURI===je?O==="svg":A.namespaceURI===_t?O==="svg"&&(fe==="annotation-xml"||Bt[fe]):!!wt[O]:d.namespaceURI===_t?A.namespaceURI===je?O==="math":A.namespaceURI===$t?O==="math"&&Rt[fe]:!!bt[O]:d.namespaceURI===je?A.namespaceURI===$t&&!Rt[fe]||A.namespaceURI===_t&&!Bt[fe]?!1:!bt[O]&&(qn[O]||!wt[O]):!!(kt==="application/xhtml+xml"&&Ut[d.namespaceURI]):!1},Ge=function(d){tn(t.removed,{element:d});try{ne(d).removeChild(d)}catch{Le(d)}},at=function(d,A){try{tn(t.removed,{attribute:A.getAttributeNode(d),from:A})}catch{tn(t.removed,{attribute:null,from:A})}if(A.removeAttribute(d),d==="is")if(se||Ee)try{Ge(A)}catch{}else try{A.setAttribute(d,"")}catch{}},Ae=function(d){let A=null,O=null;if(me)d="<remove></remove>"+d;else{const ye=oo(d,/^[\r\n\t ]+/);O=ye&&ye[0]}kt==="application/xhtml+xml"&&ht===je&&(d='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+d+"</body></html>");const fe=J?J.createHTML(d):d;if(ht===je)try{A=new F().parseFromString(fe,kt)}catch{}if(!A||!A.documentElement){A=Ce.createDocument(ht,"template",null);try{A.documentElement.innerHTML=Mt?be:fe}catch{}}const Te=A.body||A.documentElement;return d&&O&&Te.insertBefore(o.createTextNode(O),Te.childNodes[0]||null),ht===je?I.call(A,U?"html":"body")[0]:U?A.documentElement:Te},gn=function(d){return x.call(d.ownerDocument||d,d,f.SHOW_ELEMENT|f.SHOW_COMMENT|f.SHOW_TEXT|f.SHOW_PROCESSING_INSTRUCTION|f.SHOW_CDATA_SECTION,null)},jt=function(d){return d instanceof B&&(typeof d.nodeName!="string"||typeof d.textContent!="string"||typeof d.removeChild!="function"||!(d.attributes instanceof L)||typeof d.removeAttribute!="function"||typeof d.setAttribute!="function"||typeof d.namespaceURI!="string"||typeof d.insertBefore!="function"||typeof d.hasChildNodes!="function")},mn=function(d){return typeof p=="function"&&d instanceof p};function nt(W,d,A){Bn(W,O=>{O.call(t,d,A,ft)})}const hn=function(d){let A=null;if(nt(v.beforeSanitizeElements,d,null),jt(d))return Ge(d),!0;const O=Se(d.nodeName);if(nt(v.uponSanitizeElement,d,{tagName:O,allowedTags:Q}),rt&&d.hasChildNodes()&&!mn(d.firstElementChild)&&Re(/<[/\w!]/g,d.innerHTML)&&Re(/<[/\w!]/g,d.textContent)||d.nodeType===rn.progressingInstruction||rt&&d.nodeType===rn.comment&&Re(/<[/\w]/g,d.data))return Ge(d),!0;if(!(st.tagCheck instanceof Function&&st.tagCheck(O))&&(!Q[O]||we[O])){if(!we[O]&&bn(O)&&(ce.tagNameCheck instanceof RegExp&&Re(ce.tagNameCheck,O)||ce.tagNameCheck instanceof Function&&ce.tagNameCheck(O)))return!1;if(Ht&&!ze[O]){const fe=ne(d)||d.parentNode,Te=Y(d)||d.childNodes;if(Te&&fe){const ye=Te.length;for(let Be=ye-1;Be>=0;--Be){const Fe=te(Te[Be],!0);Fe.__removalCount=(d.__removalCount||0)+1,fe.insertBefore(Fe,X(d))}}}return Ge(d),!0}return d instanceof E&&!Et(d)||(O==="noscript"||O==="noembed"||O==="noframes")&&Re(/<\/no(script|embed|frames)/i,d.innerHTML)?(Ge(d),!0):(et&&d.nodeType===rn.text&&(A=d.textContent,Bn([b,_,$],fe=>{A=nn(A,fe," ")}),d.textContent!==A&&(tn(t.removed,{element:d.cloneNode()}),d.textContent=A)),nt(v.afterSanitizeElements,d,null),!1)},fn=function(d,A,O){if(Ot&&(A==="id"||A==="name")&&(O in o||O in jn))return!1;if(!(dt&&!At[A]&&Re(D,A))){if(!(It&&Re(q,A))){if(!(st.attributeCheck instanceof Function&&st.attributeCheck(A,d))){if(!K[A]||At[A]){if(!(bn(d)&&(ce.tagNameCheck instanceof RegExp&&Re(ce.tagNameCheck,d)||ce.tagNameCheck instanceof Function&&ce.tagNameCheck(d))&&(ce.attributeNameCheck instanceof RegExp&&Re(ce.attributeNameCheck,A)||ce.attributeNameCheck instanceof Function&&ce.attributeNameCheck(A,d))||A==="is"&&ce.allowCustomizedBuiltInElements&&(ce.tagNameCheck instanceof RegExp&&Re(ce.tagNameCheck,O)||ce.tagNameCheck instanceof Function&&ce.tagNameCheck(O))))return!1}else if(!Wt[A]){if(!Re(z,nn(O,oe,""))){if(!((A==="src"||A==="xlink:href"||A==="href")&&d!=="script"&&cr(O,"data:")===0&&un[d])){if(!(vt&&!Re(Z,nn(O,oe,"")))){if(O)return!1}}}}}}}return!0},bn=function(d){return d!=="annotation-xml"&&oo(d,xe)},yn=function(d){nt(v.beforeSanitizeAttributes,d,null);const{attributes:A}=d;if(!A||jt(d))return;const O={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:K,forceKeepAttr:void 0};let fe=A.length;for(;fe--;){const Te=A[fe],{name:ye,namespaceURI:Be,value:Fe}=Te,yt=Se(ye),Ye=Fe;let Ie=ye==="value"?Ye:dr(Ye);if(O.attrName=yt,O.attrValue=Ie,O.keepAttr=!0,O.forceKeepAttr=void 0,nt(v.uponSanitizeAttribute,d,O),Ie=O.attrValue,dn&&(yt==="id"||yt==="name")&&(at(ye,d),Ie=Fn+Ie),rt&&Re(/((--!?|])>)|<\/(style|title|textarea)/i,Ie)){at(ye,d);continue}if(yt==="attributename"&&oo(Ie,"href")){at(ye,d);continue}if(O.forceKeepAttr)continue;if(!O.keepAttr){at(ye,d);continue}if(!xt&&Re(/\/>/i,Ie)){at(ye,d);continue}et&&Bn([b,_,$],xn=>{Ie=nn(Ie,xn," ")});const vn=Se(d.nodeName);if(!fn(vn,yt,Ie)){at(ye,d);continue}if(J&&typeof V=="object"&&typeof V.getAttributeType=="function"&&!Be)switch(V.getAttributeType(vn,yt)){case"TrustedHTML":{Ie=J.createHTML(Ie);break}case"TrustedScriptURL":{Ie=J.createScriptURL(Ie);break}}if(Ie!==Ye)try{Be?d.setAttributeNS(Be,ye,Ie):d.setAttribute(ye,Ie),jt(d)?Ge(d):ai(t.removed)}catch{at(ye,d)}}nt(v.afterSanitizeAttributes,d,null)},Gt=function W(d){let A=null;const O=gn(d);for(nt(v.beforeSanitizeShadowDOM,d,null);A=O.nextNode();)nt(v.uponSanitizeShadowNode,A,null),hn(A),yn(A),A.content instanceof a&&W(A.content);nt(v.afterSanitizeShadowDOM,d,null)};return t.sanitize=function(W){let d=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},A=null,O=null,fe=null,Te=null;if(Mt=!W,Mt&&(W="<!-->"),typeof W!="string"&&!mn(W))if(typeof W.toString=="function"){if(W=W.toString(),typeof W!="string")throw on("dirty is not a string, aborting")}else throw on("toString is not a function");if(!t.isSupported)return W;if(pe||Vt(d),t.removed=[],typeof W=="string"&&(gt=!1),gt){if(W.nodeName){const Fe=Se(W.nodeName);if(!Q[Fe]||we[Fe])throw on("root node is forbidden and cannot be sanitized in-place")}}else if(W instanceof p)A=Ae("<!---->"),O=A.ownerDocument.importNode(W,!0),O.nodeType===rn.element&&O.nodeName==="BODY"||O.nodeName==="HTML"?A=O:A.appendChild(O);else{if(!se&&!et&&!U&&W.indexOf("<")===-1)return J&&tt?J.createHTML(W):W;if(A=Ae(W),!A)return se?null:tt?be:""}A&&me&&Ge(A.firstChild);const ye=gn(gt?W:A);for(;fe=ye.nextNode();)hn(fe),yn(fe),fe.content instanceof a&&Gt(fe.content);if(gt)return W;if(se){if(Ee)for(Te=S.call(A.ownerDocument);A.firstChild;)Te.appendChild(A.firstChild);else Te=A;return(K.shadowroot||K.shadowrootmode)&&(Te=C.call(s,Te,!0)),Te}let Be=U?A.outerHTML:A.innerHTML;return U&&Q["!doctype"]&&A.ownerDocument&&A.ownerDocument.doctype&&A.ownerDocument.doctype.name&&Re(Ci,A.ownerDocument.doctype.name)&&(Be="<!DOCTYPE "+A.ownerDocument.doctype.name+`>
`+Be),et&&Bn([b,_,$],Fe=>{Be=nn(Be,Fe," ")}),J&&tt?J.createHTML(Be):Be},t.setConfig=function(){let W=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Vt(W),pe=!0},t.clearConfig=function(){ft=null,pe=!1},t.isValidAttribute=function(W,d,A){ft||Vt({});const O=Se(W),fe=Se(d);return fn(O,fe,A)},t.addHook=function(W,d){typeof d=="function"&&tn(v[W],d)},t.removeHook=function(W,d){if(d!==void 0){const A=ar(v[W],d);return A===-1?void 0:lr(v[W],A,1)[0]}return ai(v[W])},t.removeHooks=function(W){v[W]=[]},t.removeAllHooks=function(){v=gi()},t}var lo=Ai();function Sr(k,t,o){let s=!1,c="docked";const a=()=>{if(!s)return;const S=k.getModel(),C=S.getValue().split(`
`),v=[],b=new Set,_=z=>{const Q=[];let H="",K=!1;for(let Oe=0;Oe<z.length;Oe++){const ce=z[Oe];ce==="`"?(K=!K,H+=ce):ce==="|"&&!K?(Q.push(H),H=""):H+=ce}return Q.push(H),Q.filter(Oe=>Oe.trim())};let $=!1,D=[],q=null,Z=null,oe=!1,xe=0;if(C.forEach((z,Q)=>{const H=Q+1,K=z.trim();if(K.startsWith("```")&&($?(D.pop(),$=!1):(D.push(H),$=!0)),$&&!K.startsWith("```"))return;const Oe=/^(\*{3,}|-{3,}|_{3,})$/.test(K);if(K.match(/^[\*\-_]{3,}$/)){const U=K[0];K.split("").every(me=>me===U||me===" ")||v.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:z.length+1,message:"Horizontal rule format: Use consistent characters (e.g., ---, ***, or ___)",source:"markdown-validator"})}if(Q>0){const U=C[Q-1].trim();/^#{1,6}\s/.test(U)&&K&&!K.startsWith("#")&&!Oe&&v.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:1,message:"Missing blank line after heading: Add blank line for better readability",source:"markdown-validator"})}if(Q>0&&K.includes("|")){const U=C[Q-1].trim(),pe=/^(\d+\.|\*|\+|-)\s/.test(U),me=/^\|.*\|/.test(K);pe&&me&&v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:1,message:"List-table conflict: Add blank line between list and table",source:"markdown-validator"})}const ce=z.match(/^(#{1,6})([^\s#])/);ce&&(v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:ce[1].length+2,message:'Header missing space: Add space after # (e.g., "# Heading")',source:"markdown-validator"}),b.add(H)),z.match(/^#{7,}/)&&(v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:z.length+1,message:"Invalid header: Markdown only supports h1-h6 (use # to ######)",source:"markdown-validator"}),b.add(H));const we=/!\[([^\]]*)\]\(([^)]*)\)/g;if(/!\[.*\([^)]*$/.test(z)&&!we.test(z))v.push({severity:t.MarkerSeverity.Error,startLineNumber:H,startColumn:z.indexOf("![")+1,endLineNumber:H,endColumn:z.length+1,message:"Broken image syntax: Missing closing bracket ] or parenthesis )",source:"markdown-validator"}),b.add(H);else{const U=z.match(/!\[([^\]]*)\]\(\s*\)/);if(U){const me=z.indexOf(U[0])+1;v.push({severity:t.MarkerSeverity.Error,startLineNumber:H,startColumn:me,endLineNumber:H,endColumn:me+U[0].length,message:"Empty image URL: Add image source (e.g., ![Alt](image.png))",source:"markdown-validator"}),b.add(H)}const pe=z.match(/!\[\]\(([^)]+)\)/);if(pe&&!b.has(H)){const me=z.indexOf(pe[0])+1;v.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:me,endLineNumber:H,endColumn:me+pe[0].length,message:"Empty alt text: Add description for accessibility (e.g., ![Logo](url))",source:"markdown-validator"})}}const st=/\[([^\]]+)\]\(([^)]+)\)/g;if(/\[[^\]]*\([^)]*$/.test(z)&&!st.test(z)&&!b.has(H)){const U=z.lastIndexOf("[");z.indexOf("(",U)>-1&&(v.push({severity:t.MarkerSeverity.Error,startLineNumber:H,startColumn:U+1,endLineNumber:H,endColumn:z.length+1,message:"Broken link syntax: Missing closing bracket ] or parenthesis )",source:"markdown-validator"}),b.add(H))}const dt=z.match(/\[\]\(\s*\)/);if(dt&&!b.has(H)){const U=z.indexOf(dt[0])+1;v.push({severity:t.MarkerSeverity.Error,startLineNumber:H,startColumn:U,endLineNumber:H,endColumn:U+dt[0].length,message:"Empty link: Add text and URL (e.g., [Click here](url))",source:"markdown-validator"})}if(!Oe){const U=z.match(/\*\*/g);if(U&&U.length%2!==0){const pe=z.lastIndexOf("**");v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:pe+1,endLineNumber:H,endColumn:z.length+1,message:"Unclosed bold: Add closing ** (e.g., **bold text**)",source:"markdown-validator"})}}if(!Oe){const U=(z.match(/\*/g)||[]).length,pe=(z.match(/\*\*/g)||[]).length,me=U-pe*2;if(me%2!==0&&me>0){let se=-1;for(let Ee=z.length-1;Ee>=0;Ee--)if(z[Ee]==="*"&&!(Ee>0&&z[Ee-1]==="*"||Ee<z.length-1&&z[Ee+1]==="*")){se=Ee;break}se!==-1&&v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:se+1,endLineNumber:H,endColumn:z.length+1,message:"Unclosed italic: Add closing * (e.g., *italic text*)",source:"markdown-validator"})}}const vt=z.match(new RegExp("(?<!`)`(?!`)","g"));if(vt&&vt.length%2!==0){const U=z.lastIndexOf("`");z[U+1]!=="`"&&z[U-1]!=="`"&&v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:U+1,endLineNumber:H,endColumn:z.length+1,message:"Unclosed inline code: Add closing ` (e.g., `code`)",source:"markdown-validator"})}const xt=z.match(/^(>+)([^\s>])/);xt&&v.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:xt[1].length+2,message:'Blockquote missing space: Add space after > (e.g., "> Quote")',source:"markdown-validator"});const et=K.match(/^([-+*])\s/);if(et){const U=et[1];U!=="-"&&(q||q===null)&&v.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:3,message:"Mixed list markers: Use consistent marker (-)",source:"markdown-validator"}),q=U,Z=null}else if(K.match(/^\d+\.\s/)){const U=K.match(/^(\d+)\.\s/);if(U){const pe=parseInt(U[1]);Z!==null&&pe!==Z+1&&pe!==1&&v.push({severity:t.MarkerSeverity.Info,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:U[0].length,message:`List numbering skip: Expected ${Z+1}, got ${pe}`,source:"markdown-validator"}),Z=pe,q=null}}else K&&!K.startsWith(">")&&!K.startsWith("#")&&(q=null,Z=null);if(K.includes("|")){const U=_(K);if(/^[\s:-]+$/.test(U.join(""))){/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/.test(K)||v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:z.length+1,message:"Malformed table separator: Use format | --- | --- | with spaces",source:"markdown-validator"});const se=Q>0?C[Q-1].trim():"";if(!se.includes("|"))v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:z.length+1,message:"Table separator without header: Add header row above",source:"markdown-validator"});else{const Ee=_(se).length,tt=U.length;tt!==Ee&&v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:z.length+1,message:`Table separator column mismatch: Expected ${Ee} columns, got ${tt}`,source:"markdown-validator"}),xe=Ee,oe=!0}}else if(oe&&xe>0){const me=Q<C.length-1?C[Q+1].trim():"";me&&/^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/.test(me)?(oe=!1,xe=0):U.length!==xe&&v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:1,endLineNumber:H,endColumn:z.length+1,message:`Table column mismatch: Expected ${xe} columns, got ${U.length}`,source:"markdown-validator"})}}else oe&&K&&(oe=!1,xe=0);const rt=z.match(/<(\w+)(?:\s[^>]*)?>(?!.*<\/\1>)/g);rt&&rt.forEach(U=>{const pe=U.match(/<(\w+)/)[1];if(!["img","br","hr","input","meta","link"].includes(pe.toLowerCase())){const me=z.indexOf(U);v.push({severity:t.MarkerSeverity.Warning,startLineNumber:H,startColumn:me+1,endLineNumber:H,endColumn:me+U.length+1,message:`Unclosed HTML tag: <${pe}> (add </${pe}>)`,source:"markdown-validator"})}})}),D.length>0){const z=D[D.length-1];v.push({severity:t.MarkerSeverity.Error,startLineNumber:z,startColumn:1,endLineNumber:z,endColumn:C[z-1].length+1,message:"Unclosed code block: Add closing ``` on a new line",source:"markdown-validator"})}t.editor.setModelMarkers(S,"markdown-validator",v)};let u;k.onDidChangeModelContent(()=>{s&&(clearTimeout(u),u=setTimeout(a,500))}),k._validateMarkdown=a,k._setValidationEnabled=S=>{s=S,S?a():t.editor.setModelMarkers(k.getModel(),"markdown-validator",[])};let p=null,E=0,f=[],L=[];const B=()=>{const S=document.createElement("div");return S.className="vw-wizard-container wizard-docked",S.innerHTML=`
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
            `,document.body.appendChild(S),S},F=(S,I)=>{let C=null,v="";if(console.log("[generateFix] Message:",S.message),console.log("[generateFix] Line:",I),S.message.includes("Header missing space")){const b=I.match(/^(#{1,6})([^\s#].+)/);b&&(C=b[1]+" "+b[2],v="Add space after #",console.log("[generateFix] Header fix:",C))}else if(S.message.includes("Invalid header")){const b=I.match(/^(#{7,})(.+)/);b&&(C="###### "+b[2].trim(),v="Convert to h6 (maximum level)")}else if(S.message.includes("Blockquote missing space")){const b=I.match(/^(>+)([^\s>].+)/);b&&(C=b[1]+" "+b[2],v="Add space after >")}else if(S.message.includes("Mixed list markers")){const b=I.match(/^(\s*)([+*-])(\s*.+)/);if(b){const _=b[1],$=b[3].trimStart();C=_+"- "+$,v="Standardize to - marker"}}else if(S.message.includes("Table column mismatch")){const b=S.message.match(/Expected (\d+) columns, got (\d+)/);if(b){const _=parseInt(b[1]),$=parseInt(b[2]);if($<_){const D=_-$,q=I.trimEnd().replace(/\|$/,"").trimEnd(),Z=" | "+Array(D).fill('<span style="color:red">COL_FIX!</span>').join(" | ");C=q+Z+" |",v=`Add ${D} missing column(s)`}else{const D=I.split("|"),q=I.trimStart().startsWith("|"),Z=I.trimEnd().endsWith("|");let oe=D.map(xe=>xe.trim()).filter(xe=>xe!=="");oe=oe.slice(0,_),q&&Z?C="| "+oe.join(" | ")+" |":q?C="| "+oe.join(" | "):Z?C=oe.join(" | ")+" |":C=oe.join(" | "),v=`Remove ${$-_} extra column(s)`}}}else if(S.message.includes("Horizontal rule format"))C="---",v="Standardize to ---";else if(S.message.includes("Malformed table separator")){const b=S.startLineNumber,_=k.getModel(),$=b>1?_.getLineContent(b-1).trim():"";if($.includes("|")){const D=$.split("|").filter(q=>q.trim()).length;C="| "+Array(D).fill("---").join(" | ")+" |",v=`Fix separator to match ${D} columns`}else{const D=(I.match(/\|/g)||[]).length,q=Math.max(3,D-1);C="| "+Array(q).fill("---").join(" | ")+" |",v="Fix table separator format"}}else if(S.message.includes("Table separator column mismatch")){const b=S.message.match(/Expected (\d+) columns/);if(b){const _=parseInt(b[1]);C="| "+Array(_).fill("---").join(" | ")+" |",v=`Update separator to match ${_} columns`}}else if(S.message.includes("Empty alt text"))C=I.replace(/!\[\]/,"![Image description]"),v="Add placeholder alt text";else if(S.message.includes("Unclosed HTML tag")){const b=S.message.match(/Unclosed HTML tag: <(\w+)>/);if(b){const _=b[1];C=I+`</${_}>`,v=`Add closing </${_}>`}}else if(S.message.includes("List numbering skip")){const b=S.message.match(/Expected (\d+)/);if(b){const _=b[1];C=I.replace(/^(\s*)\d+\./,`$1${_}.`),v=`Change to ${_}.`}}else if(S.message.includes("Unclosed inline code")){const b=I.trimEnd();b.match(/\[.*`[^\]]*\]/)?C=b.replace(/\]/,"`]"):b.endsWith("|")?C=b.replace(/\s*\|$/,"`|"):C=I+"`",v="Add closing backtick"}else if(S.message.includes("Unclosed bold")){const b=I.trimEnd(),_=I.lastIndexOf("**");let $=b.length;const D=b.match(/\s+\|/);if(D){const q=b.indexOf(D[0]);q>_&&($=q)}C=b.substring(0,$)+"**"+b.substring($),v="Add closing **"}else if(S.message.includes("Unclosed italic")){const b=I.trimEnd();let _=-1;for(let $=b.length-1;$>=0;$--)if(b[$]==="*"&&!($>0&&b[$-1]==="*"||$<b.length-1&&b[$+1]==="*")){_=$;break}if(_!==-1){let $=b.length;const D=b.match(/\s+\|/);if(D){const q=b.indexOf(D[0]);q>_&&($=q)}C=b.substring(0,$)+"*"+b.substring($),v="Add closing *"}}else if(S.message.includes("Missing blank line after heading"))C="__INSERT_BLANK_LINE__",v="Insert blank line above";else if(S.message.includes("List-table conflict"))C="__INSERT_BLANK_LINE__",v="Insert blank line above";else if(S.message.includes("Unclosed code block"))C=I+"\n```",v="Add closing ``` on new line";else if(S.message.includes("Broken image syntax")){console.log("[generateFix] Broken image - testing regex");let b=/!\[([^\]]*)\]\s*\(.*$/,_=I.match(b);if(_||(b=/!\[([^\(]*)\(.*$/,_=I.match(b)),console.log("[generateFix] Broken image match:",_),_){const $=_[1].trim();C=I.replace(b,`![${$}](IMAGE_URL_FIX!)`),v="Add missing brackets/parenthesis and placeholder URL",console.log("[generateFix] Broken image fix:",C)}}else if(S.message.includes("Broken link syntax")){console.log("[generateFix] Broken link - Line:",I),console.log("[generateFix] Marker startColumn:",S.startColumn);const b=I.lastIndexOf("[");if(b!==-1){const _=I.substring(0,b),$=I.substring(b);console.log("[generateFix] Before broken link:",_),console.log("[generateFix] Broken link part:",$);let D=$.match(/^\[([^\]]+)\]\s*\(/);if(D){const q=D[1].trim();C=_+`[${q}](URL_FIX!)`,v="Add missing closing parenthesis and placeholder URL",console.log("[generateFix] Pattern 1 - Fix:",C)}else if(D=$.match(/^\[([^\[\(]+)\(/),D){const q=D[1].trim();C=_+`[${q}](URL_FIX!)`,v="Add missing bracket and parenthesis with placeholder URL",console.log("[generateFix] Pattern 2 - Fix:",C)}else if(D=$.match(/^\[([^\]]+)$/),D){const q=D[1].trim();C=_+`[${q}](URL_FIX!)`,v="Complete link with closing bracket, parenthesis and URL",console.log("[generateFix] Pattern 3 - Fix:",C)}}}else S.message.includes("Empty image URL")?(C=I.replace(/!\[([^\]]*)\]\(\s*\)/,"![$1](image.png)"),v="Add placeholder image URL"):S.message.includes("Empty link")&&(I.includes("[]()")?(C=I.replace(/\[\]\(\s*\)/,"[Link text](url)"),v="Add link text and URL"):(C=I.replace(/\[([^\]]+)\]\(\s*\)/,"[$1](url)"),v="Add URL"));return{suggestedFix:C,fixDescription:v}},V=(S,I)=>{const C=k.getModel();let v=C.getLineContent(S),b=[];console.log("[applyMultiple] Line",S,"- Markers:",I.length),console.log("[applyMultiple] BEFORE:",v);const _=["Header missing space","Invalid header","Blockquote missing space","Mixed list markers","Broken image syntax","Broken link syntax","Empty image URL","Empty link","Empty alt text","Unclosed bold","Unclosed italic","Unclosed inline code"],$=I.sort((Z,oe)=>{const xe=_.findIndex(Q=>Z.message.includes(Q)),z=_.findIndex(Q=>oe.message.includes(Q));return(xe===-1?999:xe)-(z===-1?999:z)});console.log("[applyMultiple] Sorted markers:",$.map(Z=>Z.message));const D=$.filter(Z=>Z.message.includes("Missing blank line after heading")||Z.message.includes("List-table conflict")),q=$.filter(Z=>!Z.message.includes("Missing blank line after heading")&&!Z.message.includes("List-table conflict"));for(const Z of q){const{suggestedFix:oe,fixDescription:xe}=F(Z,v);oe&&oe!=="__INSERT_BLANK_LINE__"&&(console.log("[applyMultiple] Applying:",xe),console.log("[applyMultiple] From:",v),console.log("[applyMultiple] To:",oe),v=oe,b.push(xe))}if(console.log("[applyMultiple] AFTER:",v),v!==C.getLineContent(S)){const Z=new t.Range(S,1,S,C.getLineContent(S).length+1);k.executeEdits("validation-fix-multiple",[{range:Z,text:v}])}return D.length>0&&(ae(S),b.push("Insert blank line above")),{fixed:b.length>0,description:b.join(", ")}},ae=S=>{console.log(`[insertBlankLineAbove] Called for line ${S}`);const I=k.getModel();if(S>1){const b=I.getLineContent(S-1);if(console.log(`[insertBlankLineAbove] Previous line (${S-1}): "${b}"`),b.trim()===""){console.log("[insertBlankLineAbove] Previous line is blank, skipping");return}}console.log(`[insertBlankLineAbove] Inserting blank line before line ${S}`);const C=new t.Range(S,1,S,1),v=I.getLineContent(S);console.log(`[insertBlankLineAbove] Current line content: "${v}"`),console.log(`[insertBlankLineAbove] Range: (${S}, 1, ${S}, 1)`),k.executeEdits("insert-blank-line",[{range:C,text:`
`}]),setTimeout(()=>{const b=I.getLineContent(S),_=I.getLineContent(S+1);console.log(`[insertBlankLineAbove] After edit - Line ${S}: "${b}"`),console.log(`[insertBlankLineAbove] After edit - Line ${S+1}: "${_}"`)},100)},te=S=>{if(!p||c!=="inline")return;const I=k.getTopForLineNumber(S),C=k.getOption(t.editor.EditorOption.lineHeight),v=k.getScrollTop(),_=k.getDomNode().getBoundingClientRect(),$=_.top+(I-v)+C,D=_.left+10,q=_.width-20;p.style.top=`${$}px`,p.style.left=`${D}px`,p.style.maxWidth=`${q}px`},Le=()=>{c=c==="docked"?"inline":"docked",X()},X=()=>{p&&(c==="docked"?(p.className="vw-wizard-container wizard-docked",p.style.top="",p.style.left="",p.style.maxWidth="",p.parentElement!==document.body&&document.body.appendChild(p)):(p.className="vw-wizard-container wizard-inline",f[E]&&te(f[E].marker.startLineNumber)))},Y=(S,I)=>{const C={error:"rgba(239, 68, 68, 0.2)",fixed:"rgba(34, 197, 94, 0.2)",skipped:"rgba(59, 130, 246, 0.2)"},v={range:new t.Range(S,1,S,1),options:{isWholeLine:!0,className:`validation-line-${I}`,glyphMarginClassName:`validation-glyph-${I}`,overviewRuler:{color:C[I],position:t.editor.OverviewRulerLane.Left},minimap:{color:C[I],position:t.editor.MinimapPosition.Inline}}};L=k.deltaDecorations(L,[v])},ne=S=>{if(S<0||S>=f.length)return;E=S;const I=f[S];k.getModel(),k.revealLineInCenter(I.marker.startLineNumber),k.setPosition({lineNumber:I.marker.startLineNumber,column:I.marker.startColumn}),I.state==="pending"&&Y(I.marker.startLineNumber,"error");const C=p.querySelector(".vw-state-indicator"),v=p.querySelector(".vw-counter-badge"),b=p.querySelector(".vw-issue-content"),_=p.querySelector(".vw-btn-apply"),$=p.querySelector(".vw-btn-apply-all"),D=p.querySelector(".vw-btn-prev"),q=p.querySelector(".vw-btn-next");if(v.textContent=`${S+1}/${f.length}`,I.state==="fixed")C.className="vw-state-indicator vw-state-fixed",b.innerHTML=`<strong>Fixed:</strong> ${I.marker.message}`,_.disabled=!0,_.style.opacity="0.3";else if(I.state==="skipped")C.className="vw-state-indicator vw-state-error",b.innerHTML=`<strong>Skipped:</strong> ${I.marker.message}`,_.disabled=!0,_.style.opacity="0.3";else if(C.className="vw-state-indicator vw-state-error",I.suggestedFix){const oe=I.suggestedFix.length>50?I.suggestedFix.substring(0,50)+"...":I.suggestedFix;b.innerHTML=`${I.marker.message} → <code>${oe}</code>`,_.disabled=!1,_.style.opacity="1"}else b.innerHTML=`${I.marker.message} <em>(no auto-fix)</em>`,_.disabled=!0,_.style.opacity="0.3";S===0?(D.classList.add("disabled"),D.disabled=!0):(D.classList.remove("disabled"),D.disabled=!1),S===f.length-1?(q.classList.add("disabled"),q.disabled=!0):(q.classList.remove("disabled"),q.disabled=!1);const Z=f.some(oe=>oe.state==="pending"&&oe.suggestedFix);$.disabled=!Z,$.style.opacity=Z?"1":"0.3",c==="inline"&&te(I.marker.startLineNumber)},J=()=>{const S=f[E];if(!S||!S.suggestedFix||S.state!=="pending")return;const I=k.getModel(),C=S.marker.startLineNumber,v=I.getLineContent(C);if(S.suggestedFix==="__INSERT_BLANK_LINE__")console.log("[applyCurrentFix] Blank line insertion detected for line",C),ae(C);else{const _=new t.Range(C,1,C,v.length+1);k.executeEdits("validation-fix",[{range:_,text:S.suggestedFix}])}S.state="fixed",Y(C,"fixed");const b=f.findIndex((_,$)=>$>E&&_.state==="pending");if(b!==-1)console.log("[applyCurrentFix] Moving to next pending issue at index:",b),ne(b);else if(f.every($=>$.state!=="pending")){const $=f.filter(Z=>Z.state==="fixed").length,D=f.filter(Z=>Z.state==="skipped").length;x();let q=`Validation complete! Fixed ${$} issue${$!==1?"s":""}`;D>0&&(q+=`, skipped ${D}`),q+=" Ô£ö",o(q)}else ne(E)},be=()=>{k.getModel();let S=0,I=0;const C=10,v=()=>{I++,console.log("[applyAll] ========== ITERATION",I,"==========");const b=new Map;if(f.forEach(($,D)=>{if($.state==="pending"&&$.suggestedFix){const q=$.marker.startLineNumber;b.has(q)||b.set(q,[]),b.get(q).push({issue:$,index:D})}}),console.log("[applyAll] Issues by line:",b.size),console.log("[applyAll] Line numbers:",Array.from(b.keys())),b.size===0){x(),S>0?(console.log("[applyAll] Ô£ô COMPLETE - Fixed",S,"issues"),o(`Excellent! All ${S} fixes applied Ô£ö`)):o("No issues found to fix!");return}const _=Array.from(b.keys()).sort(($,D)=>D-$);console.log("[applyAll] Processing lines (bottom to top):",_),_.forEach($=>{const D=b.get($),q=D.map(oe=>oe.issue.marker);console.log("[applyAll] Processing line",$),V($,q).fixed?(D.forEach(({issue:oe})=>{oe.state="fixed"}),Y($,"fixed"),S+=D.length,console.log("[applyAll] Ô£ô Fixed line",$,"-",D.length,"issues")):console.log("[applyAll] Ô£ù Failed to fix line",$)}),console.log("[applyAll] Total fixed so far:",S),I<C?setTimeout(()=>{console.log("[applyAll] Re-validating..."),f=[],a();const $=f.filter(D=>D.state==="pending"&&D.suggestedFix);console.log("[applyAll] New pending issues:",$.length),$.length>0?(console.log("[applyAll] Continuing to next iteration..."),v()):(x(),console.log("[applyAll] Ô£ô ALL DONE - Fixed",S,"issues total"),o(`Excellent! All ${S} fixes applied Ô£ö`))},150):(x(),console.log("[applyAll] ÔÜá Max iterations reached"),o(`Applied ${S} fixes! Some issues may remain.`))};v()},Ce=()=>{const S=f[E];if(!S||S.state!=="pending")return;S.state="skipped",Y(S.marker.startLineNumber,"skipped");const I=f.findIndex((C,v)=>v>E&&C.state==="pending");I!==-1?ne(I):f.every(v=>v.state!=="pending")?(x(),o("Wizard complete! Review the highlighted changes.")):ne(E)},x=()=>{p&&(p.classList.add("hiding"),setTimeout(()=>{p&&(p.remove(),p=null)},200)),c="docked",setTimeout(()=>{L=k.deltaDecorations(L,[])},5e3),f=[],E=0};k._interactiveFixWizard=async()=>{const S=k.getModel(),C=t.editor.getModelMarkers({resource:S.uri}).filter(v=>v.source==="markdown-validator");if(C.length===0){o("No validation issues found!");return}x(),f=C.map(v=>{const b=S.getLineContent(v.startLineNumber),{suggestedFix:_,fixDescription:$}=F(v,b);return{marker:v,suggestedFix:_,fixDescription:$,state:"pending"}}),c="docked",p=B(),p.querySelector(".vw-btn-mode").addEventListener("click",Le),p.querySelector(".vw-btn-apply").addEventListener("click",J),p.querySelector(".vw-btn-apply-all").addEventListener("click",be),p.querySelector(".vw-btn-skip").addEventListener("click",Ce),p.querySelector(".vw-btn-close").addEventListener("click",x),p.querySelector(".vw-btn-prev").addEventListener("click",()=>{E>0&&ne(E-1)}),p.querySelector(".vw-btn-next").addEventListener("click",()=>{E<f.length-1&&ne(E+1)}),k.onDidScrollChange(()=>{p&&f[E]&&c==="inline"&&te(f[E].marker.startLineNumber)}),ne(0)},k._exportValidationErrors=()=>{const S=k.getModel(),C=t.editor.getModelMarkers({resource:S.uri}).filter(D=>D.source==="markdown-validator");if(C.length===0)return"No validation errors found.";let v=`# Markdown Validation Report

`;v+=`Total Issues: ${C.length}

`;const b=C.filter(D=>D.severity===t.MarkerSeverity.Error),_=C.filter(D=>D.severity===t.MarkerSeverity.Warning),$=C.filter(D=>D.severity===t.MarkerSeverity.Info);return b.length>0&&(v+=`## Errors (${b.length})

`,b.forEach((D,q)=>{const Z=S.getLineContent(D.startLineNumber);v+=`${q+1}. **Line ${D.startLineNumber}**: ${D.message}
`,v+=`   \`\`\`
   ${Z}
   \`\`\`

`})),_.length>0&&(v+=`## Warnings (${_.length})

`,_.forEach((D,q)=>{const Z=S.getLineContent(D.startLineNumber);v+=`${q+1}. **Line ${D.startLineNumber}**: ${D.message}
`,v+=`   \`\`\`
   ${Z}
   \`\`\`

`})),$.length>0&&(v+=`## Info (${$.length})

`,$.forEach((D,q)=>{const Z=S.getLineContent(D.startLineNumber);v+=`${q+1}. **Line ${D.startLineNumber}**: ${D.message}
`,v+=`   \`\`\`
   ${Z}
   \`\`\`

`})),v},k.addCommand(t.KeyMod.CtrlCmd|t.KeyMod.Shift|t.KeyCode.KeyV,()=>{if(!s){console.log("Validation not enabled");return}const S=k._exportValidationErrors();navigator.clipboard.writeText(S).then(()=>{console.log("Validation report copied to clipboard")}).catch(I=>{console.error("Failed to copy validation report:",I)})})}const Tr=()=>{let k=!1,t=!1,o=!1,s="web",c=100,a={width:21,height:29.7,marginTop:4.5,marginBottom:2.54,marginLeft:2.54,marginRight:1.47},u=null,p=[],E=-1;const f=50;let L=!1;const B="com.markdownlivepreview",F="last_state",V="scroll_bar_settings",ae="cursor_sync_settings",te="theme_settings",Le="style_settings",X="flip_panels_settings",Y="vertical_layout_settings",ne="pdf_font_settings",J="helper_messages_settings",be="toc_settings",Ce="validation_settings";let x;const S=()=>{if(!x)return;const e=x.getValue(),n=e.split(`
`),r=e.trim()?e.trim().split(/\s+/).length:0;document.getElementById("status-word-count").textContent=r,document.getElementById("status-char-count").textContent=e.length,document.getElementById("status-line-count").textContent=n.length;const i=Math.ceil(r/200);document.getElementById("status-reading-time").textContent=i+" min";const l=Math.max(1,Math.ceil(r/500));document.getElementById("status-pdf-pages").textContent="~"+l},I=e=>{E<p.length-1&&(p=p.slice(0,E+1)),p.push(e),p.length>f?p.shift():E++},C=()=>{if(E>0){L=!0,E--;const e=p[E],r=x.getModel().getFullModelRange();return x.executeEdits("undo-operation",[{range:r,text:e}]),L=!1,Ae(`Undo successful! (${E+1}/${p.length} states)`),!0}else return Ae("Nothing to undo!"),!1},v=()=>{if(E<p.length-1){L=!0,E++;const e=p[E],r=x.getModel().getFullModelRange();return x.executeEdits("redo-operation",[{range:r,text:e}]),L=!1,Ae(`Redo successful! (${E+1}/${p.length} states)`),!0}else return Ae("Nothing to redo!"),!1};let b={h1:10,h2:10,h3:10,h4:10,paragraph:8,list:8,blockquote:8,code:8,table:8,fontFamily:"helvetica",tableBorders:"horizontal",tableBorderWeight:.15,tableBorderColor:"#d0d0d0",tableHeaderBg:"#fafafa",tableHeaderColor:"#000000"};const _=`# Markdown syntax guide

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
`;self.MonacoEnvironment={getWorker(e,n){return new Proxy({},{get:()=>()=>{}})}},ie.editor.defineTheme("custom-light",{base:"vs",inherit:!0,rules:[],colors:{"editor.background":"#f7f7f7","editor.selectionBackground":"#add6ff","editor.lineHighlightBackground":"#f7f7f7"}}),ie.editor.defineTheme("custom-dark",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":"#1A1A1A","editor.selectionBackground":"#add6ff","editor.lineHighlightBackground":"#1A1A1A"}});let $=()=>(x=ie.editor.create(document.querySelector("#editor"),{fontSize:14,language:"markdown",minimap:{enabled:!1},scrollBeyondLastLine:!1,automaticLayout:!0,scrollbar:{vertical:"visible",horizontal:"visible",verticalScrollbarSize:10,horizontalScrollbarSize:10,useShadows:!1},wordWrap:"on",hover:{enabled:!0},quickSuggestions:{other:!0,comments:!1,strings:!1},suggestOnTriggerCharacters:!0,acceptSuggestionOnCommitCharacter:!1,acceptSuggestionOnEnter:"on",tabCompletion:"on",wordBasedSuggestions:"off",folding:!1}),ie.languages.registerCompletionItemProvider("markdown",{triggerCharacters:["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],provideCompletionItems:(e,n,r,i)=>new Promise((l,g)=>{setTimeout(()=>{const h=e.getValueInRange({startLineNumber:n.lineNumber,startColumn:1,endLineNumber:n.lineNumber,endColumn:n.column}).match(/\b(\w{2,})$/);if(!h){l({suggestions:[]});return}const y=h[1],T=e.getValue().match(/\b\w{3,}\b/g)||[],R=[...new Set(T)].filter(N=>N.toLowerCase().startsWith(y.toLowerCase())&&N.toLowerCase()!==y.toLowerCase()).slice(0,5);if(R.length===0){l({suggestions:[]});return}const j=R.map((N,P)=>({label:N,kind:ie.languages.CompletionItemKind.Text,insertText:N,range:{startLineNumber:n.lineNumber,startColumn:n.column-y.length,endLineNumber:n.lineNumber,endColumn:n.column}}));l({suggestions:j})},50)})}),x.onDidChangeModelContent(()=>{x.getValue()!=_;let e=x.getValue();xe(e),Pi(e),Te&&Lo(),S()}),Sr(x,ie,Ae),x),D=e=>{const n=/^---\s*\n([\s\S]*?)\n---\s*\n/,r=e.match(n);if(!r)return{metadata:null,content:e};const i=r[1],l=e.slice(r[0].length),g={};return i.split(`
`).forEach(h=>{const y=h.indexOf(":");if(y>0){const w=h.slice(0,y).trim(),T=h.slice(y+1).trim();g[w]=T}}),{metadata:g,content:l}};const q=e=>{const n=document.createElement("div");n.style.visibility="hidden",n.style.position="absolute",n.style.top="-9999px",n.style.width=a.width+"cm",document.body.appendChild(n);const r=document.createElement("div");r.className="markdown-body";const i=a.width-a.marginLeft-a.marginRight;r.style.width=i+"cm",r.style.padding="0",r.style.margin="0",r.innerHTML=e,n.appendChild(r);const l=(a.height-a.marginTop-a.marginBottom)*37.795275591,g=[],m=Array.from(r.children);let h=[],y=0;if(m.forEach((w,T)=>{const M=document.createElement("div");M.className="markdown-body",M.style.width=i+"cm",M.style.padding="0",M.style.margin="0",M.appendChild(w.cloneNode(!0)),n.innerHTML="",n.appendChild(M);const R=M.offsetHeight;if(y+R>l&&h.length>0){const j=document.createElement("div");h.forEach(N=>j.appendChild(N)),g.push(j.innerHTML),h=[w.cloneNode(!0)],y=R}else h.push(w.cloneNode(!0)),y+=R}),h.length>0){const w=document.createElement("div");h.forEach(T=>w.appendChild(T)),g.push(w.innerHTML)}return document.body.removeChild(n),g.length?g:[e]},Z=()=>{const e=document.querySelector("#output");if(!e)return;const n=e.innerHTML,r=q(n),i=document.createElement("div");i.className="paper-pages-container",r.forEach((l,g)=>{const m=document.createElement("div");m.className="a4-page",m.style.width=a.width+"cm",m.style.minHeight=a.height+"cm",m.style.padding=`${a.marginTop}cm ${a.marginRight}cm ${a.marginBottom}cm ${a.marginLeft}cm`,m.innerHTML=`<div class="markdown-body">${l}</div>`,i.appendChild(m)}),e.innerHTML="",e.appendChild(i),oe()},oe=()=>{const e=document.querySelector(".paper-pages-container"),n=document.querySelector(".paper-zoom-label");if(e){const r=c/100;e.style.transform=`scale(${r})`}n&&(n.textContent=`${c}%`)};let xe=e=>{const{metadata:n,content:r}=D(e);le.setOptions({headerIds:!1,mangle:!1,breaks:!0,gfm:!0,pedantic:!1,smartLists:!0,smartypants:!1,highlight:function(T,M){if(typeof window.hljs>"u")return console.warn("highlight.js not loaded"),T;if(M&&window.hljs.getLanguage(M))try{return window.hljs.highlight(T,{language:M}).value}catch(R){return console.error("Highlight error:",R),T}try{return window.hljs.highlightAuto(T).value}catch(R){return console.error("Auto-highlight error:",R),T}}});let i=le.parse(e),l=lo.sanitize(i,{ADD_ATTR:["class"],ADD_TAGS:["span"]});const g=document.createElement("div");g.innerHTML=l;const m=e.split(`
`),h=Array.from(g.children);let y=0;h.forEach(T=>{const M=T.tagName.toLowerCase();let R=null;const j=T.textContent.trim();for(let N=y;N<m.length;N++){const P=m[N].trim();if(P){if(M==="h1"&&P.startsWith("# ")&&!P.startsWith("##")){const G=P.substring(2).trim();if(j===G){R=N+1,y=N+1;break}}else if(M==="h2"&&P.startsWith("## ")&&!P.startsWith("###")){const G=P.substring(3).trim();if(j===G){R=N+1,y=N+1;break}}else if(M==="h3"&&P.startsWith("### ")&&!P.startsWith("####")){const G=P.substring(4).trim();if(j===G){R=N+1,y=N+1;break}}else if(M==="h4"&&P.startsWith("#### ")&&!P.startsWith("#####")){const G=P.substring(5).trim();if(j===G){R=N+1,y=N+1;break}}else if(M==="h5"&&P.startsWith("##### ")&&!P.startsWith("######")){const G=P.substring(6).trim();if(j===G){R=N+1,y=N+1;break}}else if(M==="h6"&&P.startsWith("###### ")){const G=P.substring(7).trim();if(j===G){R=N+1,y=N+1;break}}else if(M==="ul"&&(P.startsWith("* ")||P.startsWith("- ")||P.startsWith("+ "))){R=N+1,y=N+1;break}else if(M==="ol"&&/^\d+\.\s/.test(P)){R=N+1,y=N+1;break}else if(M==="blockquote"&&P.startsWith(">")){R=N+1,y=N+1;break}else if(M==="pre"&&P.startsWith("```")){R=N+1,y=N+1;break}else if(M==="table"&&P.includes("|")){R=N+1,y=N+1;break}else if(M==="hr"&&(P==="---"||P==="***"||P==="___")){R=N+1,y=N+1;break}else if(M==="p")if(T.querySelector("img")){if(P.startsWith("![")){R=N+1,y=N+1;break}}else{const de=j.replace(/[*_`[\]()]/g,"").substring(0,20).trim(),ke=P.replace(/[*_`[\]()]/g,"").substring(0,20).trim();if(ke&&de.toLowerCase().startsWith(ke.toLowerCase())){R=N+1,y=N+1;break}}}}R&&T.setAttribute("data-source-line",R)});let w=g.innerHTML;if(n){if(n.title||n.date){const T=n.title||"Document",M=n.date||new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});w=`<h1>${T}</h1>
<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">${M}</div>
<hr>`+w}if(n["footer-left"]||n["footer-right"]){const T=n["footer-left"]||"",M=n["footer-right"]||"",R=n.date||new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),j=`<hr class="metadata-footer-separator" style="margin-top: 40px;">
<div class="metadata-footer" style="display: flex; justify-content: space-between; margin-top: 20px;">
  <div>
    <strong>${T}</strong><br>
    <span style="color: #666;">${n.title||"Document"}</span>
  </div>
  <div style="text-align: right;">
    <strong>${M}</strong><br>
    <span style="color: #666;">${R}</span>
  </div>
</div>`;w=w+j}}document.querySelector("#output").innerHTML=w,s==="paper"&&Z(),Ye&&Eo()},z=e=>{if(!t)return;const n=document.querySelector("#output");if(!n)return;const r=n.querySelector(".cursor-highlight");r&&r.classList.remove("cursor-highlight");const i=n.querySelectorAll("[data-source-line]");let l=null,g=1/0;const m=5;if(i.forEach(h=>{const y=parseInt(h.getAttribute("data-source-line")),w=Math.abs(y-e);y===e?(l=h,g=0):w<g&&w<=m&&(g=w,l=h)}),l&&g<=m){l.classList.add("cursor-highlight");const h=l.getBoundingClientRect(),y=document.querySelector("#preview");if(y){const w=y.getBoundingClientRect();h.top>=w.top&&h.bottom<=w.bottom||l.scrollIntoView({behavior:"smooth",block:"center"})}}},Q=e=>{if(!t)return;let n=e;for(;n&&!n.hasAttribute("data-source-line");)if(n=n.parentElement,n&&n.id==="output")return;if(n&&n.hasAttribute("data-source-line")){const r=parseInt(n.getAttribute("data-source-line"));x&&r&&(x.setPosition({lineNumber:r,column:1}),x.revealLineInCenter(r),x.focus(),z(r))}};window.syncCursorToPreview=z,window.syncCursorToEditor=Q;let H=()=>{I(x.getValue()),x.setValue(""),x.focus(),Ae("Editor cleared! Use <strong>Undo</strong> to restore.")},K=()=>{const e=x.getValue();if(!e||e.trim()==="")return;const n=At(e);if(e===n){Ae("Your markdown is already <strong>beautifully formatted</strong>!");return}ce(e,n)};const Oe=(e,n)=>{const r=e.split(/(\s+)/),i=n.split(/(\s+)/),l=Array(r.length+1).fill(null).map(()=>Array(i.length+1).fill(0));for(let y=1;y<=r.length;y++)for(let w=1;w<=i.length;w++)r[y-1]===i[w-1]?l[y][w]=l[y-1][w-1]+1:l[y][w]=Math.max(l[y-1][w],l[y][w-1]);const g=[];let m=r.length,h=i.length;for(;m>0||h>0;)m>0&&h>0&&r[m-1]===i[h-1]?(g.unshift({type:"common",text:r[m-1]}),m--,h--):h>0&&(m===0||l[m][h-1]>=l[m-1][h])?(g.unshift({type:"added",text:i[h-1]}),h--):m>0&&(g.unshift({type:"removed",text:r[m-1]}),m--);return g};let ce=(e,n)=>{const r=document.documentElement.getAttribute("data-theme")==="dark",i=r?{bg:"#1e1e1e",text:"#e0e0e0",border:"#333",contextText:"#999",addedBg:"#1a3d1a",addedText:"#7ee87e",removedBg:"#3d1a1a",removedText:"#ff7b7b",separatorBg:"#2a2a2a",separatorText:"#888",buttonBg:"#2a2a2a",buttonBorder:"#444",buttonText:"#e0e0e0"}:{bg:"white",text:"black",border:"#ddd",contextText:"#666",addedBg:"#e6ffed",addedText:"#22863a",removedBg:"#ffeef0",removedText:"#d73a49",separatorBg:"#f0f0f0",separatorText:"#666",buttonBg:"white",buttonBorder:"#ddd",buttonText:"black"},l=document.getElementById("editor-wrapper"),g=document.getElementById("editor"),m=document.createElement("div");m.id="diff-editor-container",m.style.cssText="width: 100%; height: 100%; position: relative; display: flex; flex-direction: column;";const h=document.createElement("style");h.textContent=`
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
        `,m.appendChild(h);const y=document.createElement("div");y.style.cssText=`
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
        `;const w=document.createElement("div");w.style.cssText=`
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        `,w.innerHTML=`
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
        `,m.appendChild(y);const T=document.createElement("div");T.style.cssText=`flex: 1; overflow-y: auto; background: ${i.bg};`,m.appendChild(T),g.style.display="none",l.appendChild(m),xe(n);const M=e.split(`
`),R=n.split(`
`),j=[];let N=0,P=0,G=0;const de=Math.max(M.length,R.length),ke=2,$e=new Set;for(let ge=0;ge<de;ge++)if(M[ge]!==R[ge]){$e.add(ge);for(let _e=Math.max(0,ge-ke);_e<=Math.min(de-1,ge+ke);_e++)$e.add(_e)}const qe=Array.from($e).sort((ge,_e)=>ge-_e);let Xe=[];for(let ge=0;ge<qe.length;ge++){const _e=qe[ge];Xe.length===0||_e===Xe[Xe.length-1]+1?Xe.push(_e):(j.push(Xe),Xe=[_e])}Xe.length>0&&j.push(Xe);let Ue='<div style="font-family: monospace; font-size: 13px; line-height: 1.5;">';j.forEach((ge,_e)=>{_e>0&&(Ue+=`<div style="padding: 8px 16px; background: ${i.separatorBg}; color: ${i.separatorText}; border-top: 1px solid ${i.border}; border-bottom: 1px solid ${i.border}; margin: 8px 0;">...</div>`),ge.forEach(He=>{const Me=M[He],ot=R[He],St=He+1;if(Me===ot)Ue+=`<div style="padding: 2px 16px; background: transparent; color: ${i.contextText};">
                        <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.contextText};">${St}</span>
                        <span style="color: ${i.contextText}; margin-right: 8px;"> </span>
                        ${we(Me||"")}
                    </div>`;else if(N++,Me!==void 0&&ot!==void 0){const $n=Oe(Me,ot);let Nt="";$n.forEach(pt=>{pt.type==="removed"?(Nt+=`<span style="background: ${i.removedBg}; color: ${i.removedText}; text-decoration: line-through;">${we(pt.text)}</span>`,G++):pt.type==="common"&&(Nt+=we(pt.text))});let Jt="";$n.forEach(pt=>{pt.type==="added"?(Jt+=`<span style="background: ${i.addedBg}; color: ${i.addedText}; font-weight: 500;">${we(pt.text)}</span>`,P++):pt.type==="common"&&(Jt+=we(pt.text))}),Ue+=`<div style="padding: 2px 16px; background: ${i.removedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.removedText};">${St}</span>
                            <span style="color: ${i.removedText}; margin-right: 8px;">-</span>
                            ${Nt}
                        </div>`,Ue+=`<div style="padding: 2px 16px; background: ${i.addedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.addedText};">${St}</span>
                            <span style="color: ${i.addedText}; margin-right: 8px;">+</span>
                            ${Jt}
                        </div>`}else Me!==void 0?(G++,Ue+=`<div style="padding: 2px 16px; background: ${i.removedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.removedText};">${St}</span>
                            <span style="color: ${i.removedText}; margin-right: 8px;">-</span>
                            <span style="color: ${i.removedText}; text-decoration: line-through;">${we(Me)}</span>
                        </div>`):ot!==void 0&&(P++,Ue+=`<div style="padding: 2px 16px; background: ${i.addedBg};">
                            <span style="display: inline-block; width: 40px; text-align: right; margin-right: 16px; color: ${i.addedText};">${St}</span>
                            <span style="color: ${i.addedText}; margin-right: 8px;">+</span>
                            <span style="color: ${i.addedText}; font-weight: 500;">${we(ot)}</span>
                        </div>`)})}),Ue+="</div>",y.innerHTML=`
            <div style="display: flex; gap: 12px; align-items: center; flex-shrink: 0;">
                <span style="font-weight: 600; color: ${i.text}; white-space: nowrap;">Beautify Changes</span>
                <span style="color: ${i.addedText}; white-space: nowrap; font-size: 12px;">+${P}</span>
                <span style="color: ${i.removedText}; white-space: nowrap; font-size: 12px;">-${G}</span>
                <span style="color: ${i.contextText}; white-space: nowrap; font-size: 12px;">${N} lines</span>
            </div>
        `,y.appendChild(w),T.innerHTML=Ue;const Zt=j.map(ge=>ge.map(_e=>{const He=M[_e],Me=R[_e];return He===Me?"  "+(He||""):He!==void 0&&Me!==void 0?"- "+He+`
+ `+Me:He!==void 0?"- "+He:"+ "+Me}).join(`
`)).join(`
...
`);document.getElementById("diff-copy-btn").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(Zt);const ge=document.getElementById("diff-copy-btn"),_e=ge.style.background,He=ge.style.color;ge.style.background="#28a745",ge.style.color="white",setTimeout(()=>{ge.style.background=_e,ge.style.color=He},1500)}catch{Ae("Failed to copy to clipboard")}}),document.getElementById("diff-apply-btn").addEventListener("click",()=>{I(x.getValue());const _e=x.getModel().getFullModelRange();x.executeEdits("beautify-apply",[{range:_e,text:n}]),m.remove(),g.style.display="block",x.focus(),Ae("Changes <strong>applied</strong>! Your markdown has been beautified. Use <strong>Undo</strong> to revert.")}),document.getElementById("diff-discard-btn").addEventListener("click",()=>{m.remove(),g.style.display="block",xe(e),x.focus(),Ae("Changes <strong>discarded</strong>. Your original markdown is unchanged.")})};const we=e=>{const n=document.createElement("div");return n.textContent=e,n.innerHTML};let At=e=>{if(!e)return"";const n=e.split(`
`),r=[];let i=0,l="start";const g=()=>{r.length>0&&r[r.length-1]!==""&&r.push("")},m=h=>{const y=h.map(T=>T.trim().replace(/^\||\|$/g,"").split("|").map(M=>M.trim())),w=[];return y.forEach(T=>{T.forEach((M,R)=>{w[R]=Math.max(w[R]||0,M.length)})}),y.map((T,M)=>{const R=T.every(N=>/^[ \-:]+$/.test(N));return"| "+T.map((N,P)=>{if(R){const G=N.startsWith(":"),de=N.endsWith(":");return(G?":":"")+"-".repeat(Math.max(3,w[P]-(G?1:0)-(de?1:0)))+(de?":":"")}return N.padEnd(w[P]," ")}).join(" | ")+" |"}).join(`
`)};for(;i<n.length;){let h=n[i],y=h.trim();const w=h.match(/^(\s*)/),T=w?w[1]:"";if(i===0&&y==="---"){for(r.push(y),i++;i<n.length&&n[i].trim()!=="---";)r.push(n[i]),i++;i<n.length&&r.push("---"),l="yaml",i++;continue}if(y.startsWith("```")){for(g(),r.push(y),i++;i<n.length&&!n[i].trim().startsWith("```");)r.push(n[i]),i++;i<n.length&&r.push(n[i].trim()),l="code-end",i++;continue}if(y.startsWith(">")){const P=y.substring(1).trim();r.push(`${T}> ${P}`),l="blockquote",i++;continue}if(y.startsWith("|")&&T===""){g();let P=[];for(;i<n.length&&n[i].trim().startsWith("|");)P.push(n[i]),i++;r.push(m(P)),l="table";continue}const M=y.match(/^(#{1,6})\s*(.*)/);if(M&&T===""){g();let P=M[2].replace(/\s+#*$/,"").trim();P=P.replace(/^(\d+)\.(\S)/,"$1. $2"),r.push(`${M[1]} ${P}`),l="header",i++;continue}const R=y.match(/^(\d+)\.\s+([A-Z].*)/);if(R&&T===""&&l!=="list"){g();const P=R[1],G=R[2];r.push(`### ${P}. ${G}`),l="header",i++;continue}const j=h.match(/^(\s*)([*+-]|\d+\.)\s+(.*)$/);if(j){l!=="list"&&l!=="start"&&T===""&&g();let P=j[1],G=j[2],de=j[3].trim();P.length>0&&console.log("[BEAUTIFY] Preserving list indent:",P.length,"spaces for:",de.substring(0,30)),["+","*"].includes(G)&&(G="-"),de=de.replace(/^([A-Za-z][A-Za-z0-9\s]*):(\S)/,"$1: $2"),P=P.replace(/\t/g,"    "),r.push(`${P}${G} ${de}`),l="list",i++;continue}if(/^[-*_]{3,}$/.test(y)&&T===""){g(),r.push("---"),l="hr",i++;continue}if(y===""){l!=="empty"&&l!=="start"&&(r.push(""),l="empty"),i++;continue}["header","hr","code-end","table"].includes(l)&&T===""&&g();let N=y.replace(/^([A-Za-z][A-Za-z0-9\s]*):(\S)/,"$1: $2");T?r.push(`${T}${N}`):r.push(N),l="text",i++}return r.join(`
`).trim()},st=async()=>{try{const e=await navigator.clipboard.readText();if(e){const n=x.getPosition();x.executeEdits("",[{range:new ie.Range(n.lineNumber,n.column,n.lineNumber,n.column),text:e}]),x.focus()}}catch{window.alert("Failed to read clipboard. Please make sure you have granted clipboard permissions.")}},It=e=>{x.setValue(e),x.revealPosition({lineNumber:1,column:1}),x.focus()},dt=e=>{let n=document.querySelector("#sync-scroll-checkbox");n.checked=e,k=e,n.addEventListener("change",r=>{let i=r.currentTarget.checked;k=i,Hi(i)})},vt=e=>{let n=document.querySelector("#sync-cursor-checkbox");n.checked=e,t=e,n.addEventListener("change",r=>{let i=r.currentTarget.checked;if(t=i,Fi(i),!i){const l=document.querySelector("#output");if(l){const g=l.querySelector(".cursor-highlight");g&&g.classList.remove("cursor-highlight")}}})},xt=e=>{let n=document.querySelector("#helper-messages-checkbox");n&&(n.checked=e,Et=e,n.addEventListener("change",r=>{let i=r.currentTarget.checked;at(i)}))},et=()=>{let e=document.querySelector("#style-tooltips-checkbox");if(!e)return;const n=localStorage.getItem("com.markdownlivepreview.style_tooltips_disabled")==="true";e.checked=!n,e.addEventListener("change",r=>{if(r.target.checked){localStorage.removeItem("com.markdownlivepreview.style_tooltips_disabled");const i=document.querySelector("#style-selector");i&&(i.value,setTimeout(()=>{const l=new Event("change");i.dispatchEvent(l)},100))}else localStorage.setItem("com.markdownlivepreview.style_tooltips_disabled","true")})};const rt="css/github-markdown-light.css?v=1.12.0",U="css/github-markdown-dark_dimmed.css?v=1.12.0",pe="css/gitbook-style.css?v=1.12.0",me="css/vscode-style.css?v=1.12.0";let se="github",Ee=(e,n=se)=>{const r=document.getElementById("gh-markdown-link");if(!r){const l=document.createElement("link");l.id="gh-markdown-link",l.rel="stylesheet",l.href=tt(e,n),document.head.appendChild(l);return}const i=tt(e,n);r.getAttribute("href")!==i&&r.setAttribute("href",i)},tt=(e,n)=>n==="gitbook"?pe:n==="vscode"?me:e?U:rt,Ot=e=>{document.documentElement.setAttribute("data-theme",e?"dark":"light");const n=document.getElementById("hljs-light-theme"),r=document.getElementById("hljs-dark-theme");n&&r&&(n.disabled=e,r.disabled=!e)},dn=e=>{let n=document.querySelector("#theme-checkbox");n&&(n.checked=e,Ot(e),ie&&ie.editor&&typeof ie.editor.setTheme=="function"&&ie.editor.setTheme(e?"custom-dark":"custom-light"),Ee(e,se),n.addEventListener("change",r=>{let i=r.currentTarget.checked;Ot(i),Wi(i),Ee(i,se),ie&&ie.editor&&typeof ie.editor.setTheme=="function"&&ie.editor.setTheme(i?"custom-dark":"custom-light")}))},Fn=e=>{let n=document.querySelector("#style-selector");if(!n)return;se=e,n.value=se;const r={github:{name:"GitHub Style",description:"Traditional, balanced, professional",fonts:"Helvetica (Sans-serif)",textSize:"11pt body, 20pt H1",features:"Full table borders, gray header backgrounds",bestFor:"Documentation, README files, general content"},gitbook:{name:"GitBook Style",description:"Modern, clean, book-like",fonts:"Helvetica (Sans-serif)",textSize:"10pt body, 18pt H1",features:"Horizontal table borders, minimal styling",bestFor:"Books, guides, long-form documentation"},vscode:{name:"VS Code Style",description:"Compact, technical, code-focused",fonts:"Courier (Monospace)",textSize:"8pt body, 12pt H1",features:"Minimal borders, tight spacing",bestFor:"Technical docs, code-heavy content"}};localStorage.getItem("com.markdownlivepreview.style_tooltips_disabled");const i=g=>{if(localStorage.getItem("com.markdownlivepreview.style_tooltips_disabled")==="true")return;const h=r[g];if(!h)return;const y=document.querySelector(".style-info-tooltip");y&&y.remove();const w=document.createElement("div");w.className="style-info-tooltip";const T=document.documentElement.getAttribute("data-theme")==="dark",M=T?"#1e1e1e":"#ffffff",R=T?"#e0e0e0":"#333333",j=T?"#404040":"#ddd",N=T?"#a0a0a0":"#666666";w.innerHTML=`
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <strong style="font-size: 14px; color: ${R};">${h.name}</strong>
                    <button id="close-style-tooltip" style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; margin-left: 10px; color: ${R};">×</button>
                </div>
                <p style="margin: 4px 0; font-size: 12px; color: ${N};">${h.description}</p>
                <div style="margin-top: 8px; font-size: 11px; line-height: 1.6; color: ${R};">
                    <div><strong>Fonts:</strong> ${h.fonts}</div>
                    <div><strong>Text Size:</strong> ${h.textSize}</div>
                    <div><strong>Features:</strong> ${h.features}</div>
                    <div style="margin-top: 4px; color: ${N};"><em>Best for: ${h.bestFor}</em></div>
                </div>
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid ${j};">
                    <label style="font-size: 11px; cursor: pointer; display: flex; align-items: center; color: ${R};">
                        <input type="checkbox" id="never-show-style-tooltips" style="margin-right: 6px; cursor: pointer;">
                        Don't show again
                    </label>
                </div>
            `,w.style.cssText=`
                position: fixed;
                top: 60px;
                left: 20px;
                background: ${M};
                border: 1px solid ${j};
                border-radius: 8px;
                padding: 12px 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,${T?"0.5":"0.15"});
                z-index: 10000;
                max-width: 320px;
                animation: slideIn 0.3s ease-out;
            `,document.body.appendChild(w);let P=!1,G=null;const de=()=>{G=setTimeout(()=>{P||(w.style.animation="slideOut 0.3s ease-out",setTimeout(()=>w.remove(),300))},2e3)},ke=()=>{G&&(clearTimeout(G),G=null)};de(),w.addEventListener("mouseenter",()=>{ke()}),w.addEventListener("mouseleave",()=>{P||de()}),w.addEventListener("mousedown",()=>{P=!0,ke()}),w.addEventListener("mouseup",()=>{P=!1}),document.getElementById("close-style-tooltip").addEventListener("click",$e=>{$e.stopPropagation(),ke(),w.style.animation="slideOut 0.3s ease-out",setTimeout(()=>w.remove(),300)}),document.getElementById("never-show-style-tooltips").addEventListener("change",$e=>{if($e.target.checked){localStorage.setItem("com.markdownlivepreview.style_tooltips_disabled","true");const qe=document.querySelector("#style-tooltips-checkbox");qe&&(qe.checked=!1),ke(),w.style.animation="slideOut 0.3s ease-out",setTimeout(()=>w.remove(),300)}})},l=document.documentElement.getAttribute("data-theme")==="dark";Ee(l,se),setTimeout(()=>{i(se)},500),n.addEventListener("change",g=>{se=g.target.value,Ui(se);const m=document.documentElement.getAttribute("data-theme")==="dark";Ee(m,se),i(se)})},Ht=e=>{let n=document.querySelector("#flip-panels-checkbox");n&&(n.checked=e,gt(e),n.addEventListener("change",r=>{let i=r.currentTarget.checked;gt(i),ji(i)}))},gt=e=>{const n=document.querySelector("#container");e?n.classList.add("flipped"):n.classList.remove("flipped")},mt=e=>{let n=document.querySelector("#vertical-layout-checkbox");n&&(n.checked=e,ze(e),n.addEventListener("change",r=>{let i=r.currentTarget.checked;ze(i),Yi(i),x&&setTimeout(()=>{x.layout()},350)}))},ze=e=>{const n=document.querySelector("#container");e?n.classList.add("vertical"):n.classList.remove("vertical")},zt=(e,n,r)=>{navigator.clipboard.writeText(e).then(()=>{n()},()=>{})},un=()=>{let e=document.querySelector("#copy-button a");e.innerHTML="Copied!",setTimeout(()=>{e.innerHTML="Copy"},1e3)},Ft=async(e,n)=>{let r;e==="gitbook"?r=pe:e==="vscode"?r=me:r=n?U:rt;try{const i=await fetch(r);if(!i.ok)throw new Error(`Failed to load CSS: ${i.status}`);return await i.text()}catch(i){return console.error("Failed to load CSS for export",i),""}},Wt=async()=>{const e=document.querySelector("#output");if(!e)return;const n=document.documentElement.getAttribute("data-theme")==="dark",r=await Ft(se,n);let i="";se==="gitbook"?i=`
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
            `:se==="vscode"?i=`
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
            `;const l=`<!DOCTYPE html>
<html lang="en" data-theme="${n?"dark":"light"}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown - ${se.charAt(0).toUpperCase()+se.slice(1)} Style</title>
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
</html>`,g=new Blob([l],{type:"text/html"}),m=URL.createObjectURL(g),h=document.createElement("a");h.href=m;const y=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5),w=se.charAt(0).toUpperCase()+se.slice(1),T=n?"Dark":"Light";h.download=`DocMark_${w}_${T}_${y}.html`,document.body.appendChild(h),h.click(),document.body.removeChild(h),URL.revokeObjectURL(m),wt(`HTML exported successfully (${w} - ${T} mode)`,"success")},qt=async()=>{console.log("🚀 [PUPPETEER PDF EXPORT] Starting export...");const e=document.querySelector("#output");if(!e){alert("No content to export");return}try{console.log("[PDF Export] Using Puppeteer server at localhost:3000"),$t("Generating PDF...");const r=Mo().margins||{top:20,right:20,bottom:20,left:20};console.log("[PDF Export] Using margins:",r);const i=await _t(e),l=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5),m=`DocMark_${se.charAt(0).toUpperCase()+se.slice(1)}_${l}.pdf`,h=await fetch("http://localhost:3000/generate-pdf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({html:i,filename:m,margins:r})});if(!h.ok)throw new Error("PDF generation failed");const y=await h.blob(),w=window.URL.createObjectURL(y),T=document.createElement("a");T.href=w,T.download=m,document.body.appendChild(T),T.click(),document.body.removeChild(T),window.URL.revokeObjectURL(w),je(),console.log("[PDF Export] Success!")}catch(n){console.error("[PDF Export] Failed:",n),je(),n.message.includes("Failed to fetch")?alert(`PDF server not running!

Please start it with:
node pdf-server.js`):alert("PDF export failed: "+n.message)}},_t=async e=>{console.log("[PDF Export] Collecting HTML and CSS for Puppeteer...");const n=document.getElementById("gh-markdown-link");let r="";if(n&&n.href){console.log("[PDF Export] Fetching CSS from:",n.href);try{r=await(await fetch(n.href)).text(),console.log("[PDF Export] CSS fetched successfully, length:",r.length)}catch(m){console.error("[PDF Export] Failed to fetch CSS:",m)}}let i="";return document.querySelectorAll("style").forEach(m=>{i+=m.textContent+`
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
        
        /* Print-specific styles */
        @media print {
            body {
                margin: 0;
                padding: 0;
                background: white !important;
            }
            
            .markdown-body {
                max-width: 100% !important;
                padding: 0 !important;
            }
            
            /* Paper layout styles - width calculated by server based on margins */
            .paper-container {
                max-width: 100% !important;
                width: 100% !important;  /* Let Puppeteer handle width based on margins */
                margin: 0 auto !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                background: white !important;
                break-after: page;
                break-inside: avoid;
            }
            
            .paper-container:last-child {
                break-after: auto;
            }
            
            /* Footer positioning - force to bottom of last page */
            [data-pdf-footer="true"] {
                display: block;
                margin-top: auto;
                padding-top: 20px;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            /* Ensure last page has flex layout for footer positioning */
            .paper-container:last-child,
            body > div:last-child {
                display: flex;
                flex-direction: column;
                min-height: 100%;
            }
            
            .paper-container:last-child [data-pdf-footer="true"],
            body > div:last-child [data-pdf-footer="true"] {
                margin-top: auto;
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
</html>`},$t=e=>{const n=document.getElementById("pdf-loading-indicator");n&&n.remove();const r=document.createElement("div");r.id="pdf-loading-indicator",r.innerHTML=`
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
        `,document.body.appendChild(r)},je=()=>{const e=document.getElementById("pdf-loading-indicator");e&&e.remove()},ht=()=>{try{let e=localStorage.getItem(B+"."+ne);if(e){let n=JSON.parse(e);b={...b,...n}}}catch(e){console.error("Failed to load PDF settings",e)}},Mt=()=>{if(document.getElementById("pdf-settings-panel")){document.getElementById("pdf-settings-panel").remove();return}(()=>{try{const i=localStorage.getItem(B+".pdf_templates");return i?JSON.parse(i):{}}catch{return{}}})();const n=document.createElement("div");n.id="pdf-settings-panel",n.style.cssText=`
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
        `,document.body.appendChild(n);const r=(i,l)=>{b[i]=l,savePdfSettings()};["h1","h2","h3","h4","paragraph","list","blockquote","code","table"].forEach(i=>{const l=document.getElementById(`pdf-${i}`);l.addEventListener("change",()=>r(i,parseInt(l.value)||8))}),document.getElementById("pdf-font-family").addEventListener("change",i=>{r("fontFamily",i.target.value)}),document.getElementById("pdf-table-borders").addEventListener("change",i=>{r("tableBorders",i.target.value)}),document.getElementById("pdf-border-weight").addEventListener("change",i=>{r("tableBorderWeight",parseFloat(i.target.value)||.1)}),document.getElementById("pdf-border-color").addEventListener("change",i=>{r("tableBorderColor",i.target.value)}),document.getElementById("pdf-header-bg").addEventListener("change",i=>{r("tableHeaderBg",i.target.value)}),document.getElementById("pdf-header-color").addEventListener("change",i=>{r("tableHeaderColor",i.target.value)}),document.getElementById("pdf-reset-btn").addEventListener("click",()=>{b={h1:10,h2:10,h3:10,h4:10,paragraph:8,list:8,blockquote:8,code:8,table:8,fontFamily:"helvetica",tableBorders:"horizontal",tableBorderWeight:.1,tableBorderColor:"#cccccc",tableHeaderBg:"#f0f0f0",tableHeaderColor:"#000000"},savePdfSettings(),n.remove(),Mt()}),document.getElementById("pdf-export-now-btn").addEventListener("click",()=>{qt()}),document.getElementById("pdf-close-panel").addEventListener("click",()=>{n.remove()})},Ut=()=>{document.querySelector("#clear-button").addEventListener("click",e=>{e.preventDefault(),H()})},Wn=()=>{document.querySelector("#paste-button").addEventListener("click",e=>{e.preventDefault(),st()})},Bt=e=>{document.querySelector("#copy-button").addEventListener("click",n=>{n.preventDefault();let r=e.getValue();zt(r,()=>{un()})})},Rt=()=>{const e=document.querySelector("#export-pdf-link");e&&e.addEventListener("click",n=>{n.preventDefault(),qt()})},qn=()=>{const e=document.querySelector("#export-html-link");e&&e.addEventListener("click",n=>{n.preventDefault(),Wt()})},kt=e=>{const n=document.querySelector("#export-md-button");n&&n.addEventListener("click",()=>{if(!e)return;const r=e.getValue();let i="document";const l=r.match(/^---\s*\ntitle:\s*(.+?)\s*\n/m);if(l)i=l[1].trim().replace(/[^a-z0-9]/gi,"_").toLowerCase();else{const T=r.match(/^#\s+(.+)$/m);T&&(i=T[1].trim().replace(/[^a-z0-9]/gi,"_").toLowerCase())}const g=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5),m=`${i}_docmark_${g}.md`,h=new Blob([r],{type:"text/markdown;charset=utf-8"}),y=URL.createObjectURL(h),w=document.createElement("a");w.href=y,w.download=m,document.body.appendChild(w),w.click(),document.body.removeChild(w),URL.revokeObjectURL(y),wt(`Markdown exported: ${m}`,"success")})},Un=e=>{const n=document.querySelector("#import-md-button"),r=document.querySelector("#import-md-input");n&&r&&(n.addEventListener("click",()=>{r.click()}),r.addEventListener("change",i=>{const l=i.target.files[0];if(l){const g=new FileReader;g.onload=m=>{const h=m.target.result;if(e){I(e.getValue());const w=e.getModel().getFullModelRange();e.executeEdits("import-markdown",[{range:w,text:h}]),wt(`Imported: ${l.name}`,"success"),Ae("File imported! Use <strong>Undo</strong> to restore previous content.")}},g.onerror=()=>{wt("Failed to read file","error")},g.readAsText(l)}i.target.value=""}))},Vn=()=>{let e=document.querySelector("#pdf-settings-link");e&&e.addEventListener("click",n=>{n.preventDefault(),Mt()})},Se=()=>{const e=document.querySelector("#undo-button");e&&e.addEventListener("click",n=>{n.preventDefault(),x&&(C(),x.focus())})},ft=()=>{const e=document.querySelector("#redo-button");e&&e.addEventListener("click",n=>{n.preventDefault(),x&&(v(),x.focus())})},jn=()=>{const e=document.querySelector("#beautify-button");e&&e.addEventListener("click",n=>{n.preventDefault(),K()})},pn=()=>{const e=document.querySelector("#print-pdf-link");e&&e.addEventListener("click",async n=>{n.preventDefault(),await Vt()})},Vt=async()=>{const e=document.querySelector("#output");if(!e)return;const n=document.documentElement.getAttribute("data-theme")==="dark",r=await Ft(se,n),i=`<!DOCTYPE html>
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
</html>`,l=window.open("","_blank");l.document.write(i),l.document.close()},wt=(e,n="info")=>{const r=document.createElement("div");r.className=`toast-notification ${n}`,r.textContent=e,document.body.appendChild(r),setTimeout(()=>{r.classList.add("hiding"),setTimeout(()=>{document.body.removeChild(r)},300)},2500)},bt=!1,Et=!0;const Ge=()=>(Et=ve.getItem(B,J)!==!1,Et),at=e=>{const n=new Date(2099,1,1);ve.setItem(B,J,e,n),Et=e};let Ae=e=>{bt=!0;const n=document.querySelector(".mofu-head"),r=document.querySelector(".mofu-face-features"),i=document.querySelector(".mofu-smile");if(n&&r&&(n.style.transform="",r.style.transform="",n.classList.add("mofu-attention"),i&&(i.style.width="10px",i.style.height="5px",i.style.borderWidth="2px"),setTimeout(()=>{n.classList.remove("mofu-attention")},600)),!Et){setTimeout(()=>{bt=!1,i&&(i.style.width="7px",i.style.height="3.5px",i.style.borderWidth="1.5px")},2e3);return}const l=document.querySelector(".mofu-helper-bubble");l&&l.remove();const g=document.createElement("div");g.className="mofu-helper-bubble",g.innerHTML=`
            <div class="mofu-helper-message">${e}</div>
            <label class="mofu-helper-footer">
                <input type="checkbox" id="mofu-dont-show-again">
                <span>Don't show again</span>
            </label>
        `,document.body.appendChild(g);const m=g.querySelector("#mofu-dont-show-again");m&&m.addEventListener("change",h=>{h.target.checked&&(at(!1),g.classList.add("hiding"),setTimeout(()=>{g.parentNode&&document.body.removeChild(g),bt=!1,i&&(i.style.width="7px",i.style.height="3.5px",i.style.borderWidth="1.5px")},200))}),setTimeout(()=>{g.parentNode&&(g.classList.add("hiding"),setTimeout(()=>{g.parentNode&&document.body.removeChild(g),bt=!1,i&&(i.style.width="7px",i.style.height="3.5px",i.style.borderWidth="1.5px")},200))},5e3)},gn=()=>{const e=document.querySelector("#insert-header-button");e&&e.addEventListener("click",n=>{n.preventDefault(),fn(),Ae("I've added a <strong>header template</strong> for you! Replace the placeholders with your actual information.")})},jt=()=>{const e=document.querySelector("#insert-footer-button");e&&e.addEventListener("click",n=>{n.preventDefault(),bn(),Ae("I've added a <strong>footer template</strong> for you! Replace the placeholders with your actual information.")})},mn=()=>{const e=document.querySelector("#insert-break-button");e&&e.addEventListener("click",n=>{n.preventDefault(),fe(),Ae("I've inserted a <strong>page break</strong>! This will create a new page in your PDF export.")})},nt=()=>{const e=document.querySelector("#insert-image-button");e&&e.addEventListener("click",n=>{n.preventDefault(),hn()})},hn=()=>{const e=prompt("Enter image width (in pixels, e.g., 300):","300");if(!e)return;const n=prompt("Enter image height (in pixels, leave empty for auto):",""),r=n?` height="${n}"`:"",i=`
<img src="https://via.placeholder.com/${e}x${n||"200"}?text=Your+Image" width="${e}"${r}>

`;x.getModel();const l=x.getPosition();x.executeEdits("insert-image",[{range:new ie.Range(l.lineNumber,l.column,l.lineNumber,l.column),text:i}]),setTimeout(()=>{const g=l.lineNumber+1,m=i.indexOf('src="')+5,h=i.indexOf('"',m);x.setSelection(new ie.Selection(g,m,g,h)),x.revealLineInCenter(g),x.focus()},50),Ae(`I've added an <strong>image placeholder</strong> (${e}x${n||"auto"})! Replace the URL with your image link.`)},fn=()=>{const n=`# Document Title

<div style="text-align: right; margin-top: -40px; margin-bottom: 20px; color: #666; font-size: 0.9em;">${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>

---

`,l=x.getModel().getValue().split(`
`);let g=1,m=1;if(l[0]&&l[0].trim()==="---"){for(let h=1;h<l.length;h++)if(l[h].trim()==="---"){g=h+2;break}}x.executeEdits("insert-header",[{range:new ie.Range(g,m,g,m),text:n}]),setTimeout(()=>{x.setSelection(new ie.Selection(g,3,g,17)),x.focus()},50)},bn=()=>{const n=`

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
`,r=x.getModel(),i=r.getLineCount(),l=r.getLineContent(i),g=i,m=l.length+1;x.executeEdits("insert-footer",[{range:new ie.Range(g,m,g,m),text:n}]);const h=i+6;setTimeout(()=>{x.setSelection(new ie.Selection(h,13,h,22)),x.revealLineInCenter(h),x.focus()},50)},yn=()=>{const e=document.querySelectorAll(".dropdown");e.forEach(n=>{const r=n.querySelector(".dropdown-content");if(!r)return;let i=!1,l=null;n.addEventListener("mouseenter",()=>{clearTimeout(l),i=!0,r.style.display="block"}),r.addEventListener("mouseenter",()=>{clearTimeout(l),i=!0});const g=()=>{l=setTimeout(()=>{i&&(i=!1,r.style.display="none")},150)};n.addEventListener("mouseleave",m=>{const h=n.getBoundingClientRect();(m.clientX<h.left||m.clientX>h.right||m.clientY<h.top||m.clientY>h.bottom)&&g()}),r.addEventListener("mouseleave",m=>{const h=r.getBoundingClientRect();(m.clientX<h.left||m.clientX>h.right||m.clientY<h.top||m.clientY>h.bottom)&&g()}),n.addEventListener("click",m=>{m.target.closest(".dropdown-content")||(clearTimeout(l),i=!i,r.style.display=i?"block":"none")})}),document.addEventListener("click",n=>{n.target.closest(".dropdown")||e.forEach(r=>{const i=r.querySelector(".dropdown-content");i&&(i.style.display="none")})})},Gt=!1,W=()=>{const e=document.querySelector("#cheatsheet-button");if(!e)return;e.addEventListener("click",r=>{r.preventDefault(),d()});const n=document.querySelector("#cheatsheet-close-btn");n&&n.addEventListener("click",()=>{d()}),A()},d=()=>{Gt=!Gt;const e=document.querySelector("#cheatsheet-panel"),n=document.querySelector("#cheatsheet-divider"),r=document.querySelector("#container");Gt?(e.classList.remove("hidden"),n.classList.remove("hidden"),r.classList.add("cheatsheet-visible")):(e.classList.add("hidden"),n.classList.add("hidden"),r.classList.remove("cheatsheet-visible")),x&&setTimeout(()=>{x.layout()},350)},A=()=>{const e=document.querySelector("#cheatsheet-content");if(!e)return;const n=[{section:"Headers",items:[{title:"H1 Header",code:"# Header 1",type:"header"},{title:"H2 Header",code:"## Header 2",type:"header"},{title:"H3 Header",code:"### Header 3",type:"header"}]},{section:"Text Formatting",items:[{title:"Bold",code:"**bold text**",type:"inline"},{title:"Italic",code:"*italic text*",type:"inline"},{title:"Bold + Italic",code:"***bold and italic***",type:"inline"},{title:"Strikethrough",code:"~~strikethrough~~",type:"inline"},{title:"Inline Code",code:"`code`",type:"inline"}]},{section:"Lists",items:[{title:"Unordered List",code:`* Item 1
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
                <h4>${i.section}</h4>`,i.items.forEach((l,g)=>{const m=`cheat-${i.section.replace(/\s/g,"-")}-${g}`;r+=`
                <div class="cheatsheet-item">
                    <div class="cheatsheet-item-header">
                        <span class="cheatsheet-item-title">${l.title}</span>
                        <div class="cheatsheet-item-actions">
                            <button class="cheatsheet-insert-btn" data-code="${m}" data-type="${l.type}">Insert</button>
                            <button class="cheatsheet-copy-btn" data-code="${m}">Copy</button>
                        </div>
                    </div>
                    <div class="cheatsheet-code" id="${m}">${l.code.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
                </div>`}),r+="</div>"}),e.innerHTML=r,e.querySelectorAll(".cheatsheet-insert-btn").forEach(i=>{i.addEventListener("click",l=>{const g=l.target.getAttribute("data-code"),m=l.target.getAttribute("data-type"),y=document.getElementById(g).textContent;O(y,m),l.target.textContent="Inserted!",l.target.classList.add("inserted"),setTimeout(()=>{l.target.textContent="Insert",l.target.classList.remove("inserted")},1500)})}),e.querySelectorAll(".cheatsheet-copy-btn").forEach(i=>{i.addEventListener("click",l=>{const g=l.target.getAttribute("data-code"),h=document.getElementById(g).textContent;navigator.clipboard.writeText(h).then(()=>{l.target.textContent="Copied!",l.target.classList.add("copied"),setTimeout(()=>{l.target.textContent="Copy",l.target.classList.remove("copied")},2e3)}).catch(()=>{l.target.textContent="Failed",setTimeout(()=>{l.target.textContent="Copy"},2e3)})})})},O=(e,n)=>{if(!x)return;const r=x.getPosition(),i=x.getModel(),l=i.getLineContent(r.lineNumber),g=l.length,m=l.trim()==="",h=r.column===1,y=r.column>g;let w=e,T=r;if(n==="yaml"?(r.lineNumber!==1||!h)&&(T=new ie.Position(1,1),(i.getLineCount()>1||!m)&&(w=e+`

`)):n==="block"?m?w=e+`

`:y?w=`

`+e+`

`:h?w=e+`

`:(T=new ie.Position(r.lineNumber,g+1),w=`

`+e+`

`):n==="header"?m?w=e+`

`:y?w=`

`+e+`

`:h?w=e+`

`:(T=new ie.Position(r.lineNumber,g+1),w=`

`+e+`

`):n==="inline"&&(w=e),x.executeEdits("insert-syntax",[{range:new ie.Range(T.lineNumber,T.column,T.lineNumber,T.column),text:w}]),n==="inline")if(e.includes("text")||e.includes("Link")||e.includes("Alt")){const M=new ie.Position(T.lineNumber,T.column+e.indexOf("text")>-1?e.indexOf("text"):e.indexOf("Link")>-1?e.indexOf("Link"):e.indexOf("Alt")>-1?e.indexOf("Alt"):0);x.setPosition(M)}else x.setPosition(new ie.Position(T.lineNumber,T.column+e.length));else{w.split(`
`);const M=T.lineNumber+(w.startsWith(`

`)?2:0);x.setPosition(new ie.Position(M,1))}x.focus()},fe=()=>{const e=x.getModel(),n=x.getPosition(),r=e.getLineContent(n.lineNumber);let i=n.lineNumber,l=1,g="";r.trim()!==""?(i=n.lineNumber+1,g=`
<div style="page-break-after: always;"></div>

`):g=`<div style="page-break-after: always;"></div>

`,x.executeEdits("insert-break",[{range:new ie.Range(i,l,i,l),text:g}]);const m=i+(r.trim()!==""?3:2);setTimeout(()=>{x.setPosition({lineNumber:m,column:1}),x.focus()},50)},Te=!1,ye=[],Be=()=>{const e=document.querySelector("#toc-checkbox");if(!e)return;const n=Ki();n!=null&&n!==!1&&(o=n,e.checked=n,setTimeout(()=>{n&&Fe()},500)),e.addEventListener("change",i=>{o=i.currentTarget.checked,So(o),Fe()});const r=document.querySelector("#toc-close-btn");r&&r.addEventListener("click",()=>{o=!1,e.checked=!1,So(!1),Fe()})},Fe=()=>{Te=o;const e=document.querySelector("#toc-panel"),n=document.querySelector("#container");Te?(e.classList.remove("hidden"),n.classList.add("toc-visible"),Lo()):(e.classList.add("hidden"),n.classList.remove("toc-visible")),x&&setTimeout(()=>{x.layout()},350)},yt=()=>{const e=document.querySelector("#validation-checkbox"),n=document.querySelector("#export-validation-link");if(!e)return;const r=Mi();r!=null&&(e.checked=r,x&&x._setValidationEnabled&&x._setValidationEnabled(r),n&&(n.style.display=r?"block":"none")),e.addEventListener("change",i=>{const l=i.currentTarget.checked;Bi(l),x&&x._setValidationEnabled&&x._setValidationEnabled(l),n&&(n.style.display=l?"block":"none")})},Ye=!1;const Ie="edit_mode",vn=()=>ve.getItem(B,Ie)===!0,xn=e=>{ve.setItem(B,Ie,e)};let Ii=()=>{const e=document.querySelector("#edit-mode-checkbox");e&&(Ye=vn(),e.checked=Ye,Ye&&document.documentElement.classList.add("edit-mode-active"),e.addEventListener("change",n=>{Ye=n.currentTarget.checked,xn(Ye),Ye?(document.documentElement.classList.add("edit-mode-active"),Eo()):(document.documentElement.classList.remove("edit-mode-active"),$i())}))},Gn=null;window.TurndownService&&(Gn=new window.TurndownService({headingStyle:"atx",bulletListMarker:"-",codeBlockStyle:"fenced"}));const _i=e=>{if(!Gn||!x)return;const n=e.getAttribute("data-source-line");if(!n)return;const r=parseInt(n,10);if(isNaN(r))return;const i=e.innerHTML;let l=Gn.turndown(i);const g=e.tagName.toLowerCase();if(g.match(/^h[1-6]$/)){const T=parseInt(g[1],10),M="#".repeat(T);l.startsWith(M)||(l=`${M} ${l}`)}g==="blockquote"&&(l=l.split(`
`).map(M=>M.startsWith(">")?M:`> ${M}`).join(`
`));const m=x.getModel();if(!m)return;const h=m.getLineContent(r),w={range:new ie.Range(r,1,r,h.length+1),text:l};m.pushEditOperations([],[w],()=>null)},Eo=()=>{const e=document.querySelector("#output");if(!e)return;e.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, blockquote").forEach(r=>{r.setAttribute("contenteditable","true");const i=l=>{_i(l.target)};r._editModeInputHandler=i,r.addEventListener("input",i),r.setAttribute("data-original-html",r.innerHTML)})},$i=()=>{const e=document.querySelector("#output");if(!e)return;e.querySelectorAll('[contenteditable="true"]').forEach(r=>{r.removeAttribute("contenteditable"),r.removeAttribute("data-original-html"),r._editModeInputHandler&&(r.removeEventListener("input",r._editModeInputHandler),delete r._editModeInputHandler)})};let Mi=()=>{let e=ve.getItem(B,Ce);return e===null?!0:e},Bi=e=>{let n=new Date(2099,1,1);ve.setItem(B,Ce,e,n)},Ri=()=>{const n=(x?x.getValue():"").split(`
`),r=[];let i=!1,l=!1;return n.forEach((g,m)=>{if(m===0&&g.trim()==="---"){l=!0;return}if(l&&g.trim()==="---"){l=!1;return}if(l)return;if(g.trim().startsWith("```")){i=!i;return}if(i)return;const y=g.replace(/\r$/,"").match(/^(#{1,6})\s*(.+)$/);if(y){const w=y[1].length,T=y[2].trim();if(!T)return;const M=T.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");r.push({level:w,text:T,id:M,line:m+1})}}),r},Lo=()=>{if(!Te)return;const e=document.querySelector("#toc-content");if(!e)return;if(ye=Ri(),ye.length===0){e.innerHTML='<div class="toc-empty">No headings found in document</div>';return}const n=l=>{const g={children:[],level:0},m=[g];return l.forEach(h=>{const y={...h,children:[]};for(;m.length>1&&m[m.length-1].level>=h.level;)m.pop();m[m.length-1].children.push(y),m.push(y)}),g.children},r=(l,g=0)=>{if(!l||l.length===0)return"";let m='<ul class="toc-tree-list">';return l.forEach(h=>{const y=h.children&&h.children.length>0,w=y?`<button class="toc-collapse-btn" data-collapsed="false" aria-label="Collapse">
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
                        ${w}
                        <a href="#" class="toc-link" data-line="${h.line}" data-id="${h.id}">
                            ${h.text}
                        </a>
                    </div>`,y&&(m+=`<div class="toc-children">${r(h.children,h.level)}</div>`),m+="</li>"}),m+="</ul>",m},i=n(ye);e.innerHTML=r(i),e.querySelectorAll(".toc-link").forEach(l=>{l.addEventListener("click",g=>{g.preventDefault();const m=parseInt(g.target.getAttribute("data-line"));x&&m&&(x.setPosition({lineNumber:m,column:1}),x.revealLineInCenter(m),x.focus(),e.querySelectorAll(".toc-link").forEach(h=>h.classList.remove("active")),g.target.classList.add("active"))})}),e.querySelectorAll(".toc-collapse-btn").forEach(l=>{l.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation();const m=l.getAttribute("data-collapsed")==="true",y=l.closest(".toc-tree-item").querySelector(":scope > .toc-children"),w=l.querySelector(".toc-icon-minus"),T=l.querySelector(".toc-icon-plus");m?(l.setAttribute("data-collapsed","false"),y.style.maxHeight=y.scrollHeight+"px",w.style.display="block",T.style.display="none",setTimeout(()=>{l.getAttribute("data-collapsed")==="false"&&(y.style.maxHeight="none")},300)):(y.style.maxHeight=y.scrollHeight+"px",y.offsetHeight,y.style.maxHeight="0",l.setAttribute("data-collapsed","true"),w.style.display="none",T.style.display="block")})})},Di=()=>ve.getItem(B,F),Pi=e=>{let n=new Date(2099,1,1);ve.setItem(B,F,e,n)},Ni=()=>ve.getItem(B,V),Oi=()=>{let e=ve.getItem(B,te);if(e==null)try{const n=localStorage.getItem("com.markdownlivepreview_theme");if(n==="dark")return!0;if(n==="light")return!1}catch{}return e},Hi=e=>{let n=new Date(2099,1,1);ve.setItem(B,V,e,n)},zi=()=>ve.getItem(B,ae),Fi=e=>{let n=new Date(2099,1,1);ve.setItem(B,ae,e,n)},Wi=e=>{let n=new Date(2099,1,1);ve.setItem(B,te,e,n);try{localStorage.setItem("com.markdownlivepreview_theme",e?"dark":"light")}catch{}},qi=()=>ve.getItem(B,Le)||"github",Ui=e=>{let n=new Date(2099,1,1);ve.setItem(B,Le,e,n);try{localStorage.setItem("com.markdownlivepreview.style_settings",e)}catch{}},Vi=()=>ve.getItem(B,X)||!1,ji=e=>{let n=new Date(2099,1,1);ve.setItem(B,X,e,n)},Gi=()=>ve.getItem(B,Y)||!1,Yi=e=>{let n=new Date(2099,1,1);ve.setItem(B,Y,e,n)},Ki=()=>ve.getItem(B,be)||!1,So=e=>{let n=new Date(2099,1,1);ve.setItem(B,be,e,n)},Xi=()=>{let e=.5,n=.5;const r=document.getElementById("split-divider"),i=document.getElementById("edit"),l=document.getElementById("preview"),g=document.getElementById("container");if(!r||!i||!l)return;const m=()=>g.classList.contains("vertical"),h=()=>g.classList.contains("flipped"),y=()=>g.getBoundingClientRect().width,w=()=>g.getBoundingClientRect().height;r.addEventListener("mouseenter",()=>{r.classList.add("hover")}),r.addEventListener("mouseleave",()=>{r.classList.remove("hover")}),r.addEventListener("mousedown",T=>{T.preventDefault();const M=r.getBoundingClientRect(),R=g.getBoundingClientRect(),j=m();let N,P,G;j?(h()?P=l.offsetHeight:P=i.offsetHeight,G=M.top-R.top):(h()?N=l.offsetWidth:N=i.offsetWidth,G=M.left-R.left),u={divider:r,leftPane:h()?l:i,rightPane:h()?i:l,container:g,lastLeftRatio:e,lastTopRatio:n,isVertical:j,isFlipped:h(),getAvailableWidth:y,getAvailableHeight:w,initialLeftWidth:N||0,initialTopHeight:P||0,initialDividerX:j?0:G,initialDividerY:j?G:0},document.body.classList.add("dragging"),r.classList.add("active"),u.isVertical?document.body.style.cursor="row-resize":document.body.style.cursor="col-resize"}),r.addEventListener("dblclick",()=>{if(m()){const T=w(),M=r.offsetHeight,R=(T-M)/2;i.style.height=R+"px",l.style.height=R+"px",i.style.width="",l.style.width=""}else{const T=y(),M=r.offsetWidth,R=(T-M)/2;i.style.width=R+"px",l.style.width=R+"px",i.style.height="",l.style.height=""}})},Zi=()=>{let e=300;const n=document.getElementById("cheatsheet-divider"),r=document.querySelector(".cheatsheet-pane"),i=document.getElementById("container");if(!n||!r)return;const l=()=>i.getBoundingClientRect().width;n.addEventListener("mouseenter",()=>{n.classList.add("hover")}),n.addEventListener("mouseleave",()=>{n.classList.remove("hover")}),n.addEventListener("mousedown",g=>{g.preventDefault();const m=n.getBoundingClientRect(),h=i.getBoundingClientRect(),y=r.offsetWidth;u={divider:n,leftPane:r,rightPane:null,container:i,lastLeftRatio:e/l(),lastTopRatio:0,isVertical:!1,isFlipped:!1,getAvailableWidth:l,getAvailableHeight:()=>0,initialLeftWidth:y,initialDividerX:m.left-h.left},document.body.classList.add("dragging"),n.classList.add("active"),document.body.style.cursor="col-resize"})},To=Di();x=$(),window.editor=x,It(To||_),I(x.getValue()),x.addCommand(ie.KeyMod.CtrlCmd|ie.KeyCode.KeyZ,()=>{C()}),x.addCommand(ie.KeyMod.CtrlCmd|ie.KeyMod.Shift|ie.KeyCode.KeyZ,()=>{v()}),x.addCommand(ie.KeyMod.CtrlCmd|ie.KeyCode.KeyY,()=>{v()});let Co;x.onDidChangeModelContent(()=>{L||(clearTimeout(Co),Co=setTimeout(()=>{const e=x.getValue();(p.length===0||p[E]!==e)&&I(e)},300))}),Ut(),Wn(),Bt(x),Se(),ft(),jn(),Rt(),pn(),qn(),kt(x),Un(x),Vn(),gn(),jt(),nt(),mn(),yn(),W(),Be(),yt(),Ii();const Ao=document.querySelector("#autofix-validation-link"),Io=document.querySelector("#export-validation-link");Ao?Ao.addEventListener("click",e=>{e.preventDefault(),console.log("[DEBUG] Autofix link clicked");const n=document.querySelector("#validation-checkbox");n&&!n.checked&&(n.checked=!0,n.dispatchEvent(new Event("change")),console.log("[DEBUG] Validation auto-enabled")),console.log("[DEBUG] Editor exists:",!!x),console.log("[DEBUG] _interactiveFixWizard exists:",!!(x&&x._interactiveFixWizard)),x&&x._interactiveFixWizard?(console.log("[DEBUG] Calling _interactiveFixWizard"),x._interactiveFixWizard()):console.error("[DEBUG] Cannot call _interactiveFixWizard - editor or function not available")}):console.error("[DEBUG] Autofix link not found in DOM"),Io&&Io.addEventListener("click",e=>{if(e.preventDefault(),console.log("[DEBUG] Export validation link clicked"),x&&x._exportValidationErrors){const n=x._exportValidationErrors();navigator.clipboard.writeText(n).then(()=>{Ae("Validation report copied to clipboard!")}).catch(r=>{console.error("Failed to copy:",r),Ae("Failed to copy report")})}}),setTimeout(()=>{const e=document.querySelector("#validation-checkbox"),n=document.querySelector("#export-validation-link");e&&e.checked&&n&&(n.style.display="block")},100),ht();let Ji=Ni()||!1;dt(Ji);let kn=zi();kn==null&&(kn=!0),vt(kn);let Dt=localStorage.getItem("com.markdownlivepreview.word_wrap");Dt===null?Dt=!0:Dt=Dt==="true";const Yn=document.querySelector("#word-wrap-checkbox");Yn&&(Yn.checked=Dt,x.updateOptions({wordWrap:Dt?"on":"off"}),Yn.addEventListener("change",e=>{const n=e.currentTarget.checked;x.updateOptions({wordWrap:n?"on":"off"}),localStorage.setItem("com.markdownlivepreview.word_wrap",n)}));let Qi=Ge();xt(Qi),et();let Yt=Oi();document.getElementById("status-pdf-estimate").addEventListener("click",()=>{const e=parseInt(document.getElementById("status-word-count").textContent),n=Math.max(1,Math.ceil(e/500)),r=`PDF Page Estimate

Based on approximately 500 words per page:
${e} words ≈ ${n} page${n!==1?"s":""}

Note: Actual page count may vary based on:
• Font size and family
• Line height
• Images and tables
• Margins and spacing`;alert(r)}),S();const _o="paper_layout_settings",$o="page_setup_settings",es=()=>{try{const e=localStorage.getItem(`${B}.${_o}`);if(e){const n=JSON.parse(e);s=n.layout||"web",c=n.zoom||100}}catch(e){console.error("Failed to load paper layout settings:",e)}},Mo=()=>{try{const e=localStorage.getItem(`${B}.${$o}`);e&&(a=JSON.parse(e))}catch(e){console.error("Failed to load page setup settings:",e)}return{pageSize:"A4",pageOrientation:"portrait",margins:{top:(a.marginTop||2.54)*10,right:(a.marginRight||2.54)*10,bottom:(a.marginBottom||2.54)*10,left:(a.marginLeft||2.54)*10}}},ts=()=>{try{localStorage.setItem(`${B}.${$o}`,JSON.stringify(a))}catch(e){console.error("Failed to save page setup settings:",e)}},Kt=()=>{try{const e={layout:s,zoom:c};localStorage.setItem(`${B}.${_o}`,JSON.stringify(e))}catch(e){console.error("Failed to save paper layout settings:",e)}},Kn=()=>{const e=document.querySelector(".preview-pane"),n=document.querySelector(".paper-controls"),r=document.getElementById("status-layout-mode");if(s==="paper"?(e&&e.classList.add("paper-layout"),n&&n.classList.add("visible"),r&&(r.textContent="Paper Layout")):(e&&e.classList.remove("paper-layout"),n&&n.classList.remove("visible"),r&&(r.textContent="Web Layout")),x){const i=x.getValue();xe(i)}},ns=()=>{c<200&&(c+=10,oe(),Kt())},os=()=>{c>50&&(c-=10,oe(),Kt())},is=()=>{const e=document.querySelector(".preview-pane");if(!e)return;const n=e.clientWidth,r=a.width*37.795275591,l=(n-40)/r*100;c=Math.max(50,Math.min(200,Math.round(l))),oe(),Kt()},ss=()=>{c=100,oe(),Kt()},rs=()=>{s=s==="web"?"paper":"web",Kt(),Kn()},as=()=>{const e=document.getElementById("page-setup-modal");e&&(document.getElementById("page-width").value=a.width,document.getElementById("page-height").value=a.height,document.getElementById("margin-top").value=a.marginTop,document.getElementById("margin-bottom").value=a.marginBottom,document.getElementById("margin-left").value=a.marginLeft,document.getElementById("margin-right").value=a.marginRight,e.classList.add("visible"))},wn=()=>{const e=document.getElementById("page-setup-modal");e&&e.classList.remove("visible")},ls=()=>{a.width=parseFloat(document.getElementById("page-width").value)||21,a.height=parseFloat(document.getElementById("page-height").value)||29.7,a.marginTop=parseFloat(document.getElementById("margin-top").value)||4.5,a.marginBottom=parseFloat(document.getElementById("margin-bottom").value)||2.54,a.marginLeft=parseFloat(document.getElementById("margin-left").value)||2.54,a.marginRight=parseFloat(document.getElementById("margin-right").value)||1.47,ts(),wn(),s==="paper"&&Kn()},cs=()=>{const e=document.querySelector('.status-item[title="Layout mode"]');e&&(e.classList.add("clickable"),e.addEventListener("click",rs),e.title="Click to toggle between Web and Paper layout"),document.body.insertAdjacentHTML("beforeend",`
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
        `),document.getElementById("paper-zoom-in").addEventListener("click",ns),document.getElementById("paper-zoom-out").addEventListener("click",os),document.getElementById("paper-fit-width").addEventListener("click",is),document.getElementById("paper-reset-zoom").addEventListener("click",ss),document.getElementById("paper-page-setup").addEventListener("click",as)};setTimeout(()=>{es(),Mo(),cs(),document.body.insertAdjacentHTML("beforeend",`
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
        `),document.getElementById("page-setup-close-btn").addEventListener("click",wn),document.getElementById("page-setup-cancel-btn").addEventListener("click",wn),document.getElementById("page-setup-save-btn").addEventListener("click",ls),document.getElementById("page-setup-modal").addEventListener("click",n=>{n.target.id==="page-setup-modal"&&wn()}),Kn()},100);const Bo="versions",Ro="autosave_config",Do=15;let he=[],Xn=null,Ke={enabled:!0,intervalMinutes:10};const ds=()=>{try{const e=localStorage.getItem(`${B}.${Bo}`);e&&(he=JSON.parse(e),he.forEach(n=>n.timestamp=new Date(n.timestamp)),Xt())}catch(e){console.error("Failed to load versions:",e),he=[]}},us=()=>{try{const e=localStorage.getItem(`${B}.${Ro}`);e&&(Ke=JSON.parse(e))}catch(e){console.error("Failed to load autosave config:",e)}},ps=()=>{try{localStorage.setItem(`${B}.${Ro}`,JSON.stringify(Ke))}catch(e){console.error("Failed to save autosave config:",e)}},Zn=()=>{try{localStorage.setItem(`${B}.${Bo}`,JSON.stringify(he))}catch(e){console.error("Failed to save versions:",e)}},En=()=>{const e=x.getValue();if(he.length>0&&he[0].content===e){console.log("No changes detected, skipping version save");return}const n=e.trim()?e.trim().split(/\s+/).length:0,r=new Date,i={id:Date.now(),content:e,timestamp:r,words:n,preview:e.substring(0,100)+(e.length>100?"...":""),title:""};console.log("Saving version:",{id:i.id,contentLength:e.length,preview:i.preview,totalVersions:he.length+1}),he.unshift(i),he.length>Do&&(he=he.slice(0,Do)),Zn(),Xt(),S(),In(),Jn()},ut=e=>{const r=new Date-e,i=Math.floor(r/6e4),l=Math.floor(r/36e5),g=Math.floor(r/864e5);return i<1?"Just now":i<60?`${i} min ago`:l<24?`${l} hour${l>1?"s":""} ago`:g<7?`${g} day${g>1?"s":""} ago`:e.toLocaleDateString()+" "+e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},Jn=()=>{const e=document.getElementById("status-save-indicator");if(e)if(he.length>0){const n=he[0],r=ut(n.timestamp);e.textContent=`Saved ${r}`}else e.textContent="Not saved"},Xt=(e="")=>{const n=document.getElementById("version-history-list"),r=document.getElementById("status-versions-count"),i=document.getElementById("total-versions-display");if(r&&(r.textContent=he.length),i&&(i.textContent=he.length),!n)return;if(he.length===0){n.innerHTML='<p class="version-empty-state">No versions saved yet. Versions are auto-saved every 10 minutes.</p>';return}const l=e.trim()===""?he:he.filter(g=>{const m=g.title||"",h=ut(g.timestamp),y=g.preview||"",w=e.toLowerCase();return m.toLowerCase().includes(w)||h.toLowerCase().includes(w)||y.toLowerCase().includes(w)});if(l.length===0){n.innerHTML='<p class="version-empty-state">No versions match your search.</p>';return}n.innerHTML=l.map(g=>`
            <div class="version-item" data-version-id="${g.id}">
                <div class="version-header">
                    <div class="version-title-container">
                        ${g.title?`<input type="text" class="version-title-input" value="${we(g.title)}" data-version-id="${g.id}" />`:`<input type="text" class="version-title-input" placeholder="${ut(g.timestamp)}" data-version-id="${g.id}" />`}
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
                <div class="version-preview">${we(g.preview)}</div>
                <div class="version-actions">
                    <button class="version-btn" onclick="window.previewVersion(${g.id})">Preview</button>
                    <button class="version-btn" onclick="window.compareVersion(${g.id})">Compare</button>
                    <button class="version-btn restore" onclick="window.restoreVersion(${g.id})">Restore</button>
                    <button class="version-btn" onclick="window.deleteVersion(${g.id})">Delete</button>
                </div>
            </div>
        `).join("")};window.restoreVersion=e=>{const n=he.find(r=>r.id===e);if(n){x.setValue(n.content),Sn();const r=document.getElementById("version-history-panel");r&&r.classList.remove("visible")}};let Ln=null;const gs=(e,n,r)=>{const i=document.getElementById("confirm-dialog"),l=document.getElementById("confirm-dialog-title"),g=document.getElementById("confirm-dialog-message");l&&(l.textContent=e),g&&(g.textContent=n),Ln=r,i&&i.classList.add("visible")},Qn=()=>{const e=document.getElementById("confirm-dialog");e&&e.classList.remove("visible"),Ln=null};window.deleteVersion=e=>{gs("Delete Version","Are you sure you want to delete this version? This action cannot be undone.",()=>{he=he.filter(n=>n.id!==e),Zn(),Xt(),S(),In(),Qn()})},window.saveVersionTitle=e=>{const n=document.querySelector(`.version-title-input[data-version-id="${e}"]`);if(!n)return;const r=he.find(l=>l.id===e);if(!r)return;const i=n.value.trim();r.title=i,Zn(),Xt()},window.previewVersion=e=>{const n=he.find(y=>y.id===e);if(!n)return;const r=document.getElementById("version-modal-title"),i=document.getElementById("version-modal-body"),l=document.getElementById("version-modal-restore-btn"),g=document.getElementById("version-modal-toggle-btn");let m=!1;const h=()=>{const y=n.title||ut(n.timestamp);if(r&&(r.innerHTML=`
                    <div style="font-size: 16px; font-weight: 600; color: inherit;">${y}</div>
                    <div style="font-size: 12px; color: #64748b; font-weight: normal; margin-top: 4px;">
                        ${n.words} words • ${Math.ceil(n.words/500)} pages • Saved ${ut(n.timestamp)}
                    </div>
                `),g&&(g.style.display="block",g.textContent=m?"Show Formatted":"Show Raw",g.onclick=()=>{m=!m,h()}),i)if(m)i.innerHTML=`
                        <pre style="margin: 0; padding: 20px; font-family: 'Courier New', monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word;" class="raw-markdown-view">${we(n.content)}</pre>
                    `;else{const w=le.parse(n.content),T=lo.sanitize(w);i.innerHTML=`
                        <div class="markdown-body" style="padding: 20px;">
                            ${T}
                        </div>
                    `}};h(),l&&(l.style.display="block",l.onclick=()=>{window.restoreVersion(e)}),Oo()},window.compareVersion=e=>{const n=he.find(M=>M.id===e);if(!n)return;const r=x.getValue(),i=n.content,l=r.trim()?r.trim().split(/\s+/).length:0;console.log("Comparing versions:",{versionId:e,currentLength:r.length,versionLength:i.length,areSame:r===i,currentPreview:r.substring(0,50),versionPreview:i.substring(0,50)});const g=document.getElementById("version-modal-title"),m=document.getElementById("version-modal-body"),h=document.getElementById("version-modal-restore-btn"),y=document.getElementById("version-modal-toggle-btn");let w=!1;const T=()=>{const M=n.title||ut(n.timestamp);if(g&&(g.innerHTML=`
                    <div style="font-size: 16px; font-weight: 600; color: inherit;">Compare: ${M}</div>
                    <div style="display: flex; gap: 20px; font-size: 12px; color: #64748b; font-weight: normal; margin-top: 4px;">
                        <span>Current: ${l} words • ${Math.ceil(l/500)} pages</span>
                        <span>Version: ${n.words} words • ${Math.ceil(n.words/500)} pages • Saved ${ut(n.timestamp)}</span>
                    </div>
                `),y&&(y.style.display="block",y.textContent=w?"Show Formatted":"Show Raw Diff",y.onclick=()=>{w=!w,T()}),m)if(w)m.innerHTML=`
                        <div class="version-compare-view">
                            <div class="compare-pane">
                                <div class="compare-pane-header">Current Version</div>
                                <pre class="compare-pane-content raw-markdown-view" style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 16px;">${Po(r,i,"current")}</pre>
                            </div>
                            <div class="compare-pane">
                                <div class="compare-pane-header">Saved Version</div>
                                <pre class="compare-pane-content raw-markdown-view" style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 16px;">${Po(i,r,"version")}</pre>
                            </div>
                        </div>
                    `;else{const R=r.split(`
`),j=i.split(`
`),N=No(R,j),P=new Set,G=new Set;let de=0,ke=0,$e=0;for(;de<R.length||ke<j.length;)$e<N.length&&de<R.length&&ke<j.length&&R[de]===N[$e]&&j[ke]===N[$e]?(de++,ke++,$e++):de<R.length&&($e>=N.length||R[de]!==N[$e])?(P.add(de),de++):ke<j.length&&(G.add(ke),ke++);const qe=(Zt,ge,_e)=>{const He=Zt.split(`
`);let Me="",ot=!1;const St=_e?"diff-added-block":"diff-removed-block";He.forEach((Nt,Jt)=>{ge.has(Jt)?(ot||(Me+=`<div class="${St}">`,ot=!0),Me+=Nt+`
`):(ot&&(Me+="</div>",ot=!1),Me+=Nt+`
`)}),ot&&(Me+="</div>");const $n=le.parse(Me);return lo.sanitize($n)},Xe=qe(r,P,!0),Ue=qe(i,G,!1);m.innerHTML=`
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
                                    ${Ue}
                                </div>
                            </div>
                        </div>
                    `}};T(),h&&(h.style.display="block",h.onclick=()=>{window.restoreVersion(e)}),Oo()};const Po=(e,n,r)=>{const i=e.split(`
`),l=n.split(`
`),g=No(i,l);let m="",h=0,y=0,w=0;for(;h<i.length||y<l.length;)w<g.length&&h<i.length&&y<l.length&&i[h]===g[w]&&l[y]===g[w]?(m+=we(i[h])+`
`,h++,y++,w++):r==="current"?h<i.length&&(w>=g.length||i[h]!==g[w])?(m+=`<span class="diff-added">${we(i[h])}</span>
`,h++):y++:y<l.length&&(w>=g.length||l[y]!==g[w])?(m+=`<span class="diff-removed">${we(l[y])}</span>
`,y++):h++;return m||we(r==="current"?e:n)},No=(e,n)=>{const r=e.length,i=n.length,l=Array(r+1).fill(null).map(()=>Array(i+1).fill(0));for(let y=1;y<=r;y++)for(let w=1;w<=i;w++)e[y-1]===n[w-1]?l[y][w]=l[y-1][w-1]+1:l[y][w]=Math.max(l[y-1][w],l[y][w-1]);const g=[];let m=r,h=i;for(;m>0&&h>0;)e[m-1]===n[h-1]?(g.unshift(e[m-1]),m--,h--):l[m-1][h]>l[m][h-1]?m--:h--;return g},Oo=()=>{const e=document.getElementById("version-modal");e&&e.classList.add("visible")},Sn=()=>{const e=document.getElementById("version-modal"),n=document.getElementById("version-modal-restore-btn");e&&e.classList.remove("visible"),n&&(n.style.display="none")},Tn=document.getElementById("version-history-panel"),Ho=document.getElementById("version-history-close-btn"),zo=document.getElementById("status-versions");zo&&zo.addEventListener("click",()=>{Tn&&Tn.classList.toggle("visible")}),Ho&&Ho.addEventListener("click",()=>{Tn&&Tn.classList.remove("visible")});const Lt=document.getElementById("autosave-modal"),Fo=document.getElementById("version-settings-btn"),Wo=document.getElementById("autosave-modal-close-btn"),qo=document.getElementById("autosave-cancel-btn"),Uo=document.getElementById("autosave-save-btn"),Cn=document.getElementById("autosave-enabled-toggle"),Pt=document.getElementById("autosave-custom-minutes"),ms=()=>{Cn&&(Cn.checked=Ke.enabled),Pt&&(Pt.value=Ke.intervalMinutes),document.querySelectorAll(".interval-btn").forEach(e=>{parseInt(e.dataset.minutes)===Ke.intervalMinutes?e.classList.add("active"):e.classList.remove("active")}),Lt&&Lt.classList.add("visible")},An=()=>{Lt&&Lt.classList.remove("visible")},hs=()=>{Ke.enabled=Cn?Cn.checked:!0;const e=Pt?parseInt(Pt.value):null;if(e&&e>=1)Ke.intervalMinutes=e;else{const n=document.querySelector(".interval-btn.active");n&&(Ke.intervalMinutes=parseInt(n.dataset.minutes))}ps(),Zo(),An()};Fo&&Fo.addEventListener("click",ms),Wo&&Wo.addEventListener("click",An),qo&&qo.addEventListener("click",An),Uo&&Uo.addEventListener("click",hs),document.querySelectorAll(".interval-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".interval-btn").forEach(n=>n.classList.remove("active")),e.classList.add("active"),Pt&&(Pt.value="")})}),Lt&&Lt.addEventListener("click",e=>{e.target===Lt&&An()});const eo=document.getElementById("confirm-dialog"),Vo=document.getElementById("confirm-cancel-btn"),jo=document.getElementById("confirm-confirm-btn");Vo&&Vo.addEventListener("click",Qn),jo&&jo.addEventListener("click",()=>{Ln&&Ln()}),eo&&eo.addEventListener("click",e=>{e.target===eo&&Qn()}),document.addEventListener("click",e=>{if(e.target.closest(".version-save-title-btn")){const n=e.target.closest(".version-save-title-btn"),r=parseInt(n.dataset.versionId);window.saveVersionTitle(r)}});const Go=document.getElementById("save-version-now-btn");Go&&Go.addEventListener("click",()=>{En()});const Yo=document.getElementById("version-search-box");Yo&&Yo.addEventListener("input",e=>{Xt(e.target.value)});const Ko=document.getElementById("version-modal-close-btn"),Xo=document.getElementById("version-modal-cancel-btn"),to=document.getElementById("version-modal");Ko&&Ko.addEventListener("click",Sn),Xo&&Xo.addEventListener("click",Sn),to&&to.addEventListener("click",e=>{e.target===to&&Sn()});const Zo=()=>{if(Xn&&clearInterval(Xn),!Ke.enabled){In();return}const e=Ke.intervalMinutes*60*1e3;Xn=setInterval(()=>{En()},e),In()},In=()=>{const e=document.getElementById("status-versions");if(!e)return;let n=["Version History",""];if(Ke.enabled)if(n.push("Autosave: Enabled"),n.push(`Interval: ${Ke.intervalMinutes} minutes`),he.length>0){const r=he[0],i=ut(r.timestamp);n.push(`Last saved: ${i}`)}else n.push("No versions saved yet");else n.push("Autosave: Disabled"),n.push('Save manually using "Save Version Now"');e.setAttribute("title",n.join(`
`))};ds(),us(),Zo(),setTimeout(()=>{he.length===0&&En()},2e3),Yt==="true"||Yt===!0?Yt=!0:Yt=!1;let fs=qi();Fn(fs);let bs=Vi();Ht(bs);let ys=Gi();mt(ys),dn(Yt),Xi(),Zi(),document.addEventListener("mousemove",e=>{if(u)if(e.preventDefault(),u.container.getBoundingClientRect(),u.divider.offsetWidth,u.isVertical){const n=u.getAvailableHeight(),r=u.container.getBoundingClientRect(),i=u.divider.offsetHeight,g=e.clientY-r.top-u.initialDividerY;let m=u.initialTopHeight+g;const h=100,y=n-h-i;m=Math.max(h,Math.min(m,y)),u.isFlipped,u.leftPane.style.height=m+"px",u.rightPane.style.height=n-m-i+"px",u.lastTopRatio=m/(n-i)}else{const n=u.getAvailableWidth(),r=u.container.getBoundingClientRect(),i=u.divider.offsetWidth,l=e.clientX-r.left,g=l-u.initialDividerX;let m=u.initialLeftWidth+g;const h=100,y=n-h-i;if(m=Math.max(h,Math.min(m,y)),u.divider.id==="cheatsheet-divider"){const M=n-l-i,R=Math.max(250,Math.min(M,600));u.leftPane.style.width=R+"px";const j=document.getElementById("split-divider"),N=j?j.offsetWidth:5,P=n-R-i,G=document.getElementById("edit"),de=document.getElementById("preview");if(G&&de){const ke=G.offsetWidth,$e=de.offsetWidth,qe=ke+$e+N;if(qe>0){const Xe=ke/qe,Ue=(P-N)*Xe,Zt=P-N-Ue;G.style.width=Ue+"px",de.style.width=Zt+"px"}}u.lastLeftRatio=R/n}else u.isFlipped,u.leftPane.style.width=m+"px",u.rightPane.style.width=n-m-i+"px",u.lastLeftRatio=m/(n-i)}}),document.addEventListener("mouseup",()=>{u&&(u.divider.classList.remove("active"),u.divider.classList.remove("hover"),document.body.style.cursor="default",document.body.classList.remove("dragging"),document.body.style.userSelect="",u=null)}),x.onDidChangeCursorPosition(e=>{const n=e.position.lineNumber;z(n)});const We=document.querySelector("#preview");if(We){We.addEventListener("click",m=>{if(Ye){let h=m.target;for(;h&&h!==We;){if(h.hasAttribute("contenteditable")&&h.getAttribute("contenteditable")==="true")return;h=h.parentElement}}Q(m.target)});let e=!1,n=!1,r=null,i=null,l=null,g=null;x.onDidScrollChange(m=>{n||!k||(e=!0,clearTimeout(r),l&&cancelAnimationFrame(l),l=requestAnimationFrame(()=>{try{const h=x.getVisibleRanges();if(h&&h.length>0){const y=h[0].startLineNumber,w=document.querySelector(`[data-source-line="${y}"]`);if(w){const T=We.getBoundingClientRect(),R=w.getBoundingClientRect().top-T.top+We.scrollTop;We.scrollTo({top:R,behavior:"auto"})}else{const T=m.scrollTop,M=m.scrollHeight,R=x.getLayoutInfo().height,j=M-R,N=j>0?T/j:0,P=(We.scrollHeight-We.clientHeight)*N;We.scrollTo({top:P,behavior:"auto"})}}}catch(h){console.error("Scroll sync error:",h)}l=null}),r=setTimeout(()=>{e=!1},200))}),We.addEventListener("scroll",()=>{e||!k||(n=!0,clearTimeout(i),g&&cancelAnimationFrame(g),g=requestAnimationFrame(()=>{const m=We.scrollTop,h=We.scrollHeight,y=We.clientHeight,w=h-y,T=w>0?m/w:0,M=x.getScrollHeight(),R=x.getLayoutInfo().height,N=(M-R)*T;x.setScrollTop(N),g=null}),i=setTimeout(()=>{n=!1},200))})}(()=>{const e=document.getElementById("mofu-nav-trigger"),n=document.getElementById("mofu-canvas"),r=document.getElementById("mofu-features"),i=document.getElementById("mofu-mouth");if(!e||!n||!r||!i)return;let l=!1;const g=()=>{l||(l=!0,n.style.transform="",r.style.transform="",i.classList.add("mofu-mouth-o"),n.classList.add("mofu-jumping"),setTimeout(()=>{n.classList.remove("mofu-jumping"),setTimeout(()=>{n.classList.add("mofu-jumping"),setTimeout(()=>{n.classList.remove("mofu-jumping"),i.classList.remove("mofu-mouth-o"),l=!1},800)},100)},800))},m=()=>{l||(l=!0,n.classList.add("mofu-spinning"),n.classList.add("mofu-copied"),setTimeout(()=>{n.classList.remove("mofu-spinning")},600),setTimeout(()=>{n.classList.remove("mofu-copied"),l=!1},1500))};document.addEventListener("mousemove",M=>{if(l||bt)return;const R=n.getBoundingClientRect(),j=R.left+R.width/2,N=R.top+R.height/2,P=(M.clientX-j)/(window.innerWidth/2),G=(M.clientY-N)/(window.innerHeight/2),de=P*8,ke=G*5,$e=P*15,qe=G*-10;n.style.transform=`rotateX(${qe}deg) rotateY(${$e}deg)`,r.style.transform=`translate3d(${de}px, ${ke}px, 0)`}),e.addEventListener("click",()=>{l||(l=!0,n.style.transform="",r.style.transform="",n.classList.add("mofu-jumping"),setTimeout(()=>{n.classList.remove("mofu-jumping"),l=!1},800))});const h=document.querySelector("#export-button"),y=document.querySelector("#export-html-button");h&&h.addEventListener("click",()=>{setTimeout(g,100)}),y&&y.addEventListener("click",()=>{setTimeout(g,100)});const w=document.querySelector("#copy-button");w&&w.addEventListener("click",()=>{setTimeout(m,100)}),document.addEventListener("copy",M=>{document.activeElement&&document.activeElement.closest("#editor")&&setTimeout(m,100)});const T=document.getElementById("status-save-indicator");T&&(T.style.userSelect="none",T.style.webkitUserSelect="none",T.style.cursor="pointer",T.title="Double-click to save version now",T.addEventListener("dblclick",M=>{M.preventDefault(),M.stopPropagation(),En()}),T.addEventListener("mousedown",M=>{M.preventDefault()}),Jn(),setInterval(Jn,3e5))})();const _n=document.getElementById("settings-panel"),Jo=document.getElementById("settings-button"),Qo=document.querySelectorAll(".settings-tab"),vs=document.querySelectorAll(".settings-tab-content");Jo&&Jo.addEventListener("click",()=>{_n.classList.add("visible")});const ei=()=>{_n.classList.remove("visible")};_n.querySelector(".settings-panel-overlay").addEventListener("click",ei),document.addEventListener("keydown",e=>{e.key==="Escape"&&_n.classList.contains("visible")&&ei()}),Qo.forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.tab;Qo.forEach(r=>r.classList.remove("active")),e.classList.add("active"),vs.forEach(r=>{r.dataset.tabContent===n?r.classList.add("active"):r.classList.remove("active")})})})};window.addEventListener("load",()=>{Tr()});
