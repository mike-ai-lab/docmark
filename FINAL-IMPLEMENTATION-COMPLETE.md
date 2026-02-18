331 results - 17 files

ai-assistant-mockup.html:
   19              background: #f8fafc;
   20:             color: #1e293b;
   21              font-size: 14px;

   35              font-size: 13px;
   36:             color: #1e293b;
   37          }

   87              background: #ffffff;
   88:             color: #1e293b;
   89          }

  107              background: #e2e8f0;
  108:             color: #1e293b;
  109          }

  162              background: #ffffff;
  163:             color: #1e293b;
  164              padding: 16px 20px;

  174              font-weight: 600;
  175:             color: #1e293b;
  176          }

  194              background: #e2e8f0;
  195:             color: #1e293b;
  196          }

  223              background: #ffffff;
  224:             color: #1e293b;
  225              cursor: pointer;

  262              border-color: #cbd5e1;
  263:             color: #1e293b;
  264          }

  302              background: #ffffff;
  303:             color: #1e293b;
  304              padding: 16px 20px;

  313              font-weight: 600;
  314:             color: #1e293b;
  315          }

  350              background: #e2e8f0;
  351:             color: #1e293b;
  352          }

  422              max-height: 120px;
  423:             color: #1e293b;
  424          }

  454              transform: translateX(-50%);
  455:             background: #1e293b;
  456              color: #ffffff;

  522              background: #ffffff;
  523:             color: #1e293b;
  524              padding: 20px 24px;

  573              font-family: 'Inter', sans-serif;
  574:             color: #1e293b;
  575          }

  778                          <label>Default Provider</label>
  779:                         <select style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #1e293b;">
  780                              <option>OpenAI (GPT-4)</option>

bidirectional-edit-realtime.html:
  23              background-color: var(--bg-main);
  24:             color: #1e293b;
  25              overflow: hidden;

DARK-MODE-BACKGROUND-FIX-COMPLETE.md:
   3  ## Issue Found
   4: The preview panel and paper layout were showing dark blue backgrounds (#0f172a and #1e293b) in dark mode instead of a light grey.
   5  

   9  - `#0f172a` (very dark blue)
  10: - `#1e293b` (dark slate blue)
  11  

  97  ✅ Consistent appearance: Both web and paper layouts match
  98: ✅ No more dark blue colors (#0f172a, #1e293b) on preview panels
  99  

FINAL-DARK-BLUE-FIX-COMPLETE.md:
   3  ## Issue Identified
   4: The paper layout pages were showing dark blue background (#1e293b) in dark mode instead of white.
   5  
   6  ## Root Cause
   7: The `.paper-page` CSS class had a dark mode override setting the background to #1e293b (dark slate blue).
   8  
   9  ## Solution Applied
  10: Changed the `.paper-page` dark mode background from #1e293b to #ffffff (white).
  11  

  18  [data-theme="dark"] .paper-page {
  19:   background: #1e293b;
  20    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);

  31  ✅ Paper layout pages now have white background in dark mode
  32: ✅ No more dark blue (#1e293b) on paper pages
  33  ✅ Consistent with light mode appearance

  43  
  44: All dark blue colors (#0f172a, #1e293b) have been removed from preview and paper layout backgrounds!

HTML-EDITOR-INTEGRATION-PLAN.md:
  96  - Background Light: #ffffff
  97: - Background Dark: #1e293b
  98  - Border: #e2e8f0
  99: - Text: #1e293b (light) / #f8fafc (dark)
  100  - Accent: #3b82f6

New Session.md:
  182  
  183: The scrollbar track background is still `#1e293b` in dark mode (which is the original dark color). I only changed the scrollbar thumb (the part you drag) from blue to grey.
  184  

  257  this :#0f172a
  258: and this :#1e293b are the two colors applied!!! still there applied on the preview panel bg and paper!!!
  259  

  263  
  264: I understand! Those dark blue colors (#0f172a and #1e293b) are being applied to the preview panel background in dark mode. Let me find and fix them:
  265  
  266: I see the issue! The dark mode preview panel background is set to #1e293b. Let me find where the preview panel background is set in dark mode:
  267  

  289  
  290: I found and removed the dark blue colors! The issue was that the dark mode preview panel backgrounds were set to dark blue colors (#1E1E1E, #0f172a, #1e293b).
  291  

  315  
  316: I see the issue now! Looking at your screenshot, the paper layout background is still showing dark blue/navy (#1e293b or similar). The problem is that the paper layout is using a different container. Let me search for where the paper page itself is styled:
  317  
  318: FOUND IT! Line 5768 - the `.paper-page` in dark mode is set to `#1e293b` (dark blue)! That's the actual page background. Let me fix it:
  319  

  327  
  328: I found the culprit! The `.paper-page` element in dark mode was set to `#1e293b` (dark blue). That's the actual page background you were seeing.
  329  
  330  **Fixed:**
  331: - Changed `.paper-page` dark mode background from `#1e293b` to `#ffffff` (white)
  332  

  372  
  373: The table headers in paper layout dark mode were set to `#0f172a` (dark blue). I changed them to `#f8fafc` (light grey) with dark text `#1e293b`.
  374  

  397  **Dark Mode is now properly dark:**
  398: - ✅ Preview panel background: #1e293b (dark)
  399: - ✅ Paper layout wrapper background: #1e293b (dark)
  400  - ✅ Paper pages background: #0f172a (very dark)

  419  
  420: ✅ **FIXED!** Changed paper page background from #0f172a (dark navy blue) to #1e293b (dark grey). Now it should look properly dark without that blue tint!
  421  

  433  
  434: FOUND IT! There are TWO conflicting `.paper-page` dark mode styles! Line 2958 has it set to #fefefe (white) and line 5766 has it set to #1e293b. The first one is probably winning! Let me fix the first one:
  435  

  445  1. Line 2958 had it set to #fefefe (WHITE) - this was overriding!
  446: 2. Line 5766 had it set to #1e293b (dark)
  447  
  448: I changed the first one to #1e293b so now both are consistent and dark. The navy blue should be gone now!
  449  

  454  these are still in the app, find them, they are in the modal that opens when users click on the generate contents! they might be affecting the ui!!!
  455: #1e293b
  456  #0f172a

  473  I found and replaced all the dark blue colors in the AI modal:
  474: - `#1e293b` → `#1a1a1a` (proper dark grey)
  475  - `#0f172a` → `#1a1a1a` (proper dark grey)

PAPER-LAYOUT-IMPLEMENTATION.md:
  180  - Dark background (#0f172a)
  181: - Dark pages (#1e293b)
  182  - Adjusted shadows for dark mode

PASTE-THIS-NOW.md:
  110  
  111: <div style="padding: 30px; background-color: #1e293b; color: white; text-align: center; border-radius: 12px; margin: 20px 0;">
  112    <h2 style="margin: 0 0 10px 0;">🎊 Congratulations!</h2>

style.css:
    60    font-size: 13px;
    61:   color: #1e293b;
    62    box-shadow: 0 1px 3px rgba(0,0,0,0.05);

    69  header a:link, header a:hover, header a:visited, header a:active {
    70:   color: #1e293b;
    71  }

   140    font-weight: 600;
   141:   color: #1e293b;
   142    margin: 0;

   162    background: #f1f5f9;
   163:   color: #1e293b;
   164  }

   248  [data-theme="dark"] .paste-dialog {
   249:   background: #1e293b;
   250  }

   305    --m-size: 40px;
   306:   --m-stroke: #1e293b;
   307    display: flex;

   365    height: 6px;
   366:   background: #1e293b;
   367    border-radius: 50%;

   374    height: 3.5px;
   375:   border: 1.5px solid #1e293b;
   376    border-top: none;

   384    height: 8px !important;
   385:   border: 1.5px solid #1e293b !important;
   386    border-radius: 50% !important;

   436  [data-theme="dark"] .mofu-header-widget {
   437:   --m-stroke: #1e293b;
   438  }

   507    background: #ffffff;
   508:   color: #1e293b;
   509    box-shadow: 0 1px 3px rgba(0,0,0,0.1);

   566    background: #f1f5f9;
   567:   color: #1e293b;
   568  }

   582    background: #f8fafc;
   583:   color: #1e293b;
   584    border: 1px solid #e2e8f0;

   643  [data-theme="dark"] .icon-button:hover {
   644:   background-color: #1e293b;
   645    color: #60a5fa;

  1407    font-weight: 700;
  1408:   color: #1e293b;
  1409    text-transform: uppercase;

  1431    background: #f1f5f9;
  1432:   color: #1e293b;
  1433  }

  1725    font-weight: 700;
  1726:   color: #1e293b;
  1727    text-transform: uppercase;

  1749    background: #f1f5f9;
  1750:   color: #1e293b;
  1751  }

  2032    background: #ffffff;
  2033:   color: #1e293b;
  2034    padding: 12px 20px;

  2093    background: #ffffff;
  2094:   color: #1e293b;
  2095    padding: 14px 18px;

  2697      background: #f1f5f9;
  2698:     color: #1e293b;
  2699  }

  2740      font-weight: 500;
  2741:     color: #1e293b;
  2742  }

  3086      font-weight: 700;
  3087:     color: #1e293b;
  3088      text-transform: uppercase;

  3109      background: #ffffff;
  3110:     color: #1e293b;
  3111      transition: all 0.2s;

  3184      background: #f1f5f9;
  3185:     color: #1e293b;
  3186  }

  3484      font-weight: 600;
  3485:     color: #1e293b;
  3486  }

  3509      background: #f1f5f9;
  3510:     color: #1e293b;
  3511  }

  3556      font-size: 14px;
  3557:     color: #1e293b;
  3558  }

  3628      font-size: 13px;
  3629:     color: #1e293b;
  3630  }

  3733      font-weight: 600;
  3734:     color: #1e293b;
  3735  }

  3856      font-weight: 700;
  3857:     color: #1e293b;
  3858      margin: 0;

  3882      background: #f1f5f9;
  3883:     color: #1e293b;
  3884  }

  3949      background: #f8fafc;
  3950:     color: #1e293b;
  3951  }

  4562    font-size: 13px;
  4563:   color: #1e293b;
  4564    transition: background 0.15s ease;

  4658    font-weight: 600;
  4659:   color: #1e293b;
  4660    margin: 0;

  4682    background: #e2e8f0;
  4683:   color: #1e293b;
  4684  }

  4748    font-size: 13px;
  4749:   color: #1e293b;
  4750    background: #ffffff;

  4829  [data-theme="dark"] .inspector-pane {
  4830:   background: #1e293b;
  4831    border-left-color: #334155;

  5355    background: #f1f5f9;
  5356:   color: #1e293b;
  5357  }

  5391  .paper-mode-toggle {
  5392:   background: #1e293b;
  5393    color: white;

  5452    background: #f8fafc;
  5453:   color: #1e293b;
  5454  }

  5556    line-height: 1.6;
  5557:   color: #1e293b;
  5558  }

  5701  [data-theme="dark"] .paper-page {
  5702:   background: #1e293b;
  5703    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);

test-ai-core.html:
  21          h1 {
  22:             color: #1e293b;
  23              margin-bottom: 20px;

  43          pre {
  44:             background: #1e293b;
  45              color: #e2e8f0;

dist\assets\index-BMJW429w.css:
  1: ⟪ 515 characters skipped ⟫e}img{border:none}header{display:flex;justify-content:space-between;align-items:center;padding:0 16px;width:100%;height:60px;background-color:#fff;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b;box-shadow:0 1px 3px #0000000d;position:relative;overflow:hidden;z-index:100;box-sizing:border-box}header a:link,header a:hover,header a:visited,header a:active{color:#1e293b}header a:hover{text-decoration:none;opacity:.7}.header-left{display:flex;align-items:center;gap:12px;min-width:180px;flex-shrink:0}.brand{font-size:16px;font-weight:800;letter-spacing:-.5px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.brand a{background:linear-gradient(135deg,#2563eb,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.paste-dialog-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;display:flex;align-items:center;justify-content:center;z-index:10000;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}.paste-dialog{background:#fff;border-radius:12px;box-shadow:0 20px 60px #0000004d;max-width:600px;width:90%;max-height:80vh;display:flex;flex-direction:column;overflow:hidden}.paste-dialog-header{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid #e2e8f0}.paste-dialog-header h3{font-size:18px;font-weight:600;color:#1e293b;margin:0}.paste-dialog-close{background:none;border:none;font-size:28px;color:#64748b;cursor:pointer;padding:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:all .2s}.paste-dialog-close:hover{background:#f1f5f9;color:#1e293b}.paste-dialog-body{padding:24px;overflow-y:auto;flex:1}.paste-dialog-body p{margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6}.paste-preview{margin-top:16px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden}.paste-preview-label{background:#f8fafc;padding:8px 12px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px}.paste-preview-content{padding:16px;max-height:200px;overflow-y:auto;font-size:13px;line-height:1.6;color:#334155;background:#fff}.paste-dialog-footer{display:flex;gap:12px;padding:20px 24px;border-top:1px solid #e2e8f0;background:#f8fafc}.paste-btn{flex:1;padding:10px 16px;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;font-family:inherit}.paste-btn-primary{background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff}.paste-btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 12px #2563eb4d}.paste-btn-secondary{background:#fff;color:#475569;border:1px solid #e2e8f0}.paste-btn-secondary:hover{background:#f8fafc;border-color:#cbd5e1}[data-theme=dark] .paste-dialog{background:#1e293b}[data-theme=dark] .paste-dialog-header{border-bottom-color:#334155}[data-theme=dark] .paste-dialog-header h3{color:#f1f5f9}[data-theme=dark] .paste-dialog-close{color:#94a3b8}[data-theme=dark] .paste-dialog-close:hover{background:#334155;color:#f1f5f9}[data-theme=dark] .paste-dialog-body p{color:#cbd5e1}[data-theme=dark] .paste-preview{border-color:#334155}[data-theme=dark] .paste-preview-label{background:#0f172a;color:#94a3b8}[data-theme=dark] .paste-preview-content{background:#0f172a;color:#e2e8f0}[data-theme=dark] .paste-dialog-footer{border-top-color:#334155;background:#0f172a}[data-theme=dark] .paste-btn-secondary{background:#334155;color:#e2e8f0;border-color:#475569}[data-theme=dark] .paste-btn-secondary:hover{background:#475569;border-color:#64748b}.mofu-header-widget{--m-size: 40px;--m-stroke: #1e293b;display:flex;align-items:center;cursor:pointer;position:relative;padding:4px;perspective:2000px;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;z-index:1001}.mofu-head{width:var(--m-size);height:var(--m-size);border:2.5px solid #e2e8f0;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff,#f8fafc 50%,#e8eef5);display:flex;align-items:center;justify-content:center;position:relative;overflow:visible;transition:transform .2s cubic-bezier(.2,0,.2,1),box-shadow .3s ease;box-shadow:0 4px 12px #00000026,inset -2px -2px 8px #0000001a,inset 2px 2px 8px #ffffffe6;backface-visibility:hidden;transform-style:preserve-3d}.mofu-head:hover{box-shadow:0 6px 20px #0003,inset -2px -2px 10px #0000001f,inset 2px 2px 10px #fff;transform:scale(1.05)}.mofu-face-features{display:flex;flex-direction:column;align-items:center;transition:transform .15s ease-out;will-change:transform;transform-style:preserve-3d;position:relative;z-index:1}.mofu-eyes-row{display:flex;gap:8px;margin-bottom:2px}.mofu-dot{width:4px;height:6px;background:#1e293b;border-radius:50%;animation:mofu-blink-small 4s infinite ease-in-out;transition:transform .2s ease}.mofu-smile{width:7px;height:3.5px;border:1.5px solid #1e293b;border-top:none;border-radius:0 0 10px 10px;transition:all .2s ease}.mofu-mouth-o{width:6px!important;height:8px!important;border:1.5px solid #1e293b!important;border-radius:50%!important}.mofu-copied{border-color:#e2e8f0!important;background:radial-gradient(circle at 30% 30%,#fff,#f8fafc 50%,#e8eef5)!important;box-shadow:0 6px 20px #3b82f680,inset -2px -2px 8px #3b82f633,inset 2px 2px 8px #ffffffe6!important}@keyframes mofu-complex-jump{0%{transform:translateZ(0) rotate(0) scale(1)}15%{transform:translate3d(0,8px,0) rotate(0) scale(1.2,.7)}45%{transform:translate3d(0,-40px,0) rotate(180deg) scale(.9,1.1)}75%{transform:translateZ(0) rotate(360deg) scale(1.1,.9)}to{transform:translateZ(0) rotate(360deg) scale(1)}}.mofu-jumping{animation:mofu-complex-jump .8s cubic-bezier(.45,0,.55,1) forwards}@keyframes mofu-spin{0%{transform:rotateY(0) scale(1)}50%{transform:rotateY(180deg) scale(1.05)}to{transform:rotateY(360deg) scale(1)}}.mofu-spinning{animation:mofu-spin .6s ease-in-out}@keyframes mofu-deep-breath{0%{transform:scale(1)}50%{transform:scale(1.15)}to{transform:scale(1)}}.mofu-breathing{animation:mofu-deep-breath .6s ease-in-out}@keyframes mofu-blink-small{0%,90%,to{transform:scaleY(1)}95%{transform:scaleY(.1)}}[data-theme=dark] .mofu-header-widget{--m-stroke: #1e293b}[data-theme=dark] .mofu-head{background:radial-gradient(circle at 30% 30%,#fff,#f8fafc 50%,#e8eef5);border-color:#e2e8f0;box-shadow:0 4px 12px #0006,inset -2px -2px 8px #0000001a,inset 2px 2px 8px #ffffffe6}[data-theme=dark] .mofu-head:hover{box-shadow:0 6px 20px #00000080,inset -2px -2px 10px #0000001f,inset 2px 2px 10px #fff}.header-center{display:flex;gap:12px;align-items:center;flex:1;justify-content:center;overflow-x:auto;overflow-y:hidden;padding:0 8px;min-width:0;scrollbar-width:none;-ms-overflow-style:none}.header-center::-webkit-scrollbar{display:none}.button-group{display:flex;gap:2px;background:#f1f5f9;padding:4px;border-radius:10px;flex-shrink:0}.btn-item{padding:8px 16px;border-radius:8px;cursor:pointer;transition:all .2s ease;white-space:nowrap;position:relative;font-weight:500;font-size:12px;color:#475569}.btn-item.icon-btn{padding:8px 10px;display:flex;align-items:center;justify-content:center}.btn-item.icon-btn svg{display:block}.btn-item:hover{background:#fff;color:#1e293b;box-shadow:0 1px 3px #0000001a}.btn-item a{display:block}.dropdown{position:relative}.dropdown-content{display:none;position:absolute;top:100%;left:0;margin-top:8px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 10px 40px #00000026;min-width:200px;z-index:1000;padding:8px}.dropdown:after{content:"";position:absolute;top:100%;left:0;right:0;height:10px;background:transparent}.dropdown:hover .dropdown-content,.dropdown-content:hover{display:block}.dropdown-content a,.dropdown-content .dropdown-item{display:block;padding:10px 14px;color:#475569;text-decoration:none;transition:all .2s ease;white-space:nowrap;cursor:pointer;border-radius:8px;font-size:13px}.dropdown-content a:hover{background:#f1f5f9;color:#1e293b}.dropdown-content .dropdown-item{display:flex;align-items:center;gap:8px}.dropdown-content .dropdown-item input[type=checkbox]{cursor:pointer;margin:0}.dropdown-content .dropdown-item select{background:#f8fafc;color:#1e293b;border:1px solid #e2e8f0;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;flex:1;font-weight:500}.dropdown-content .dropdown-item select:hover{background:#f1f5f9;border-color:#cbd5e1}.dropdown-content .dropdown-item label{display:flex;align-items:center;gap:8px;width:100%;cursor:pointer}.header-right{display:flex;align-items:center;gap:8px;min-width:180px;justify-content:flex-end;flex-shrink:0}.icon-button{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;background-color:transparent;border-radius:6px;cursor:pointer;transition:all .2s ease;color:#64748b}.icon-button:hover{background-color:#f1f5f9;color:#2563eb}.icon-button:active{transform:scale(.95)}[data-theme=dark] .icon-button{color:#94a3b8}[data-theme=dark] .icon-button:hover{background-color:#1e293b;color:#60a5fa}#import-html-button:hover{background-color:#fef3c7;color:#f59e0b}#import-css-button:hover{background-color:#dbeafe;color:#3b82f6}[data-theme=dark] #import-html-button:hover{background-color:#422006;color:#fbbf24}[data-theme=dark] #import-css-button:hover{background-color:#1e3a8a;color:#60a5fa}.controls-group{display:flex;gap:12px;align-items:center}.control-item{display:flex;align-items:center;gap:6px;cursor:pointer;white-space:nowrap;font-size:12px}.control-item input[type=checkbox]{cursor:pointer;margin:0}.control-item select{background:#ffffff1a;color:#fff;border:1px solid rgba(255,255,255,.2);padding:3px 8px;border-radius:4px;cursor:pointer;font-size:12px}.control-item select:hover{background:#ffffff26}#github{padding:0}#github img{display:block;width:20px;height:20px;opacity:.9;transition:opacity .2s ease}#github a:hover img{opacity:1}footer{padding:8px;bottom:0;left:0;width:100%;background-color:#fff;color:#fff;text-align:center;justify-content:center;align-⟪ 10929 characters skipped ⟫;border-bottom:1px solid #e2e8f0;background:var(--bg-color, white);flex-shrink:0;width:100%;box-sizing:border-box;height:60px}.cheatsheet-panel-header h3{margin:0;font-size:13px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:.5px}.cheatsheet-close{background:none;border:none;font-size:24px;cursor:pointer;padding:0;width:32px;height:32px;line-height:24px;border-radius:8px;transition:all .2s;color:#64748b;display:flex;align-items:center;justify-content:center}.cheatsheet-close:hover{background:#f1f5f9;color:#1e293b}.cheatsheet-panel-content{overflow-y:auto;overflow-x:hidden;padding:15px 20px;flex:1;scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.3) transparent;width:100%;box-sizing:border-box}.cheatsheet-panel-content::-webkit-scrollbar{width:10px}.cheatsheet-panel-content::-webkit-scrollbar-track{background:transparent}.cheatsheet-panel-content::-webkit-scrollbar-thumb{background-color:#0000004d;border-radius:5px;border:2px solid transparent;background-clip:padding-box}.cheatsheet-panel-content::-webkit-scrollbar-thumb:hover{background-color:#00000080}.cheatsheet-section{margin-bottom:24px}.cheatsheet-section h4{margin:0 0 12px;font-size:13px;font-weight:600;color:#666;border-bottom:1px solid #eee;padding-bottom:6px;text-transform:uppercase;letter-spacing:.5px}.cheatsheet-item{margin-bottom:12px;background:#00000008;border-radius:6px;padding:10px;border:1px solid rgba(0,0,0,.05);width:100%;box-sizing:border-box}.cheatsheet-item-header{display:flex;justify-content:space-between;align-ite⟪ 1365 characters skipped ⟫ta-theme=dark] .cheatsheet-item-title{color:#ccc}[data-theme=dark] .cheatsheet-code{background:#ffffff14;border-color:#ffffff1a;color:#e6edf3}[data-theme=dark] #preview.column{scrollbar-color:#60a5fa #1e293b}[data-theme=dark] #preview.column::-webkit-scrollbar{background:#1e293b}[data-theme=dark] #preview.column::-webkit-scrollbar-track{background:#1e293b;border-radius:8px}[data-theme=dark] #preview.column::-webkit-scrollbar-thumb{background-color:#60a5fa;border:3px solid #1e293b}[data-theme=dark] #preview.column::-webkit-scrollbar-thumb:hover{background-color:#3b82f6}[data-theme=dark] .cheatsheet-panel-content{scrollbar-color:rgba(255,255,255,.3) transparent}[data-theme=dark] .cheatsheet-panel-content::-webkit-scrollbar-thumb{background-color:#ffffff4d}[data-theme=dark] .cheatsheet-panel-content::-webkit-scrollbar-thumb:hover{background-color:#ffffff80}.split-container.cheatsheet-visible .editor-pane{width:35%}.split-container.cheatsheet-visible .preview-pane{width:calc(65% - 300px)}.split-container.vertical .cheatsheet-pane{position:fixed;right:0;top:60px;bottom:0;height:auto;width:300px;z-index:50;box-shadow:-2px 0 8px #00000026}.split-container:not(.vertical) .cheatsheet-pane{position:relative;top:auto;bottom:auto;right:auto;height:100%;box-shadow:none}.split-container.vertical .cheatsheet-divider{display:none}.split-container.vertical.cheatsheet-visible .editor-pane,.split-container.vertical.cheatsheet-visible .preview-pane{width:calc(100% - 300px)⟪ 821 characters skipped ⟫px 20px;border-bottom:1px solid #e2e8f0;background:var(--bg-color, white);flex-shrink:0;width:100%;box-sizing:border-box;height:60px}.toc-panel-header h3{margin:0;font-size:13px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:.5px}.toc-close{background:none;border:none;font-size:24px;cursor:pointer;padding:0;width:32px;height:32px;line-height:24px;border-radius:8px;transition:all .2s;color:#64748b;display:flex;align-items:center;justify-content:center}.toc-close:hover{background:#f1f5f9;color:#1e293b}.toc-panel-content{overflow-y:auto;overflow-x:hidden;padding:15px 20px;flex:1;scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.3) transparent;width:100%;box-sizing:border-box}.toc-panel-content::-webkit-scrollbar{width:10px}.toc-panel-content::-webkit-scrollbar-track{background:transparent}.toc-panel-content::-webkit-scrollbar-thumb{background-color:#0000004d;border-radius:5px;border:2px solid transparent;background-clip:padding-box}.toc-panel-content::-webkit-scrollbar-thumb:hover{background-color:#00000080}.toc-tree-list{list-style:none;padding:0;margin:0}.toc-tree-item{margin:0;padding:0}.toc-item-row{display:flex;align-items:center;gap:4px}.toc-collapse-btn{flex-shrink:0;width:18px;height:18px;padding:0;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:3px;transition:background-color .2s ease;color:#64748b}.toc-collapse-btn:hover{background:#0000000d;color:#2563eb}.toc-collapse-btn svg{display:block}.toc-s⟪ 2828 characters skipped ⟫le-element>.scrollbar.vertical{width:10px!important}.monaco-scrollable-element>.scrollbar.horizontal{height:10px!important}.toast-notification{position:fixed;top:80px;right:24px;background:#fff;color:#1e293b;padding:12px 20px;border-radius:10px;box-shadow:0 4px 12px #00000026;font-size:13px;font-weight:500;z-index:10000;animation:slideInRight .3s ease-out;border-left:4px solid #3b82f6;display:flex;align-items:center;gap:10px;min-width:200px}.toast-notification.success{border-left-color:#10b981}.toast-notification.info{border-left-color:#3b82f6}@keyframes slideInRight{0%{transform:translate(400px);opacity:0}to{transform:translate(0);opacity:1}}@keyframes slideOutRight{0%{transform:translate(0);opacity:1}to{transform:translate(400px);opacity:0}}.toast-notification.hiding{animation:slideOutRight .3s ease-in forwards}[data-theme=dark] .toast-notification{background:#2d2d2d;color:#e2e8f0;box-shadow:0 4px 12px #00000080}.mofu-helper-bubble{position:fixed;top:70px;left:80px;background:#fff;color:#1e293b;padding:14px 18px;border-radius:12px;box-shadow:0 6px 20px #00000026;font-size:13px;line-height:1.5;z-index:10001;max-width:320px;animation:bubblePopIn .3s cubic-bezier(.68,-.55,.265,1.55);border:2px solid #e2e8f0}.mofu-helper-bubble:before{content:"";position:absolute;top:8px;left:-10px;width:0;height:0;border-style:solid;border-width:8px 10px 8px 0;border-color:transparent #e2e8f0 transparent transparent}.mofu-helper-bubble:after{content:"";position:absolute;top:10px;left:-7px;width:0;height:0;border-style:solid;border-width:6px 8px 6px 0;border-color:transparent #ffffff transparent transparent}.mofu-helper-message{margin-bottom:10px}.mofu-helper-footer{display:flex;align-items:center;gap:6px;padding-top:8px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;cursor:pointer;-webkit-user-select:none;user-select:none}.mofu-helper-footer:hover{color:#3b82f6}.mofu-helper-footer input[type=checkbox]{cursor:pointer;margin:0}@keyframes bubblePopIn{0%{transform:scale(.3) transl⟪ 7849 characters skipped ⟫-left:auto}.status-item{display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:4px;transition:all .2s ease;cursor:default;white-space:nowrap}.status-item:hover{background:#f1f5f9;color:#1e293b}[data-theme=dark] .status-item:hover{background:#2d2d2d;color:#e2e8f0}.status-item.clickable{cursor:pointer}.status-item.clickable:active{transform:scale(.95)}.status-separator{width:1px;height:16px;background:#e2e8f0;margin:0 4px}[data-theme=dark] .status-separator{background:#2d2d2d}.status-icon{width:14px;height:14px;display:flex;align-items:center;justify-content:center}.status-icon svg{width:100%;height:100%;stroke:currentColor}.status-value{font-weight:500;color:#1e293b}[data-theme=dark] .status-value{color:#e2e8f0}.status-label{color:#94a3b8;font-size:11px}#status-save-indicator{cursor:pointer;transition:color .2s;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}#status-save-indicator:hover{color:#3b82f6}#status-save-indicator:active{color:#2563eb}[data-theme=dark] .status-label{color:#64748b}[data-theme=dark] #status-save-indicator:hover{color:#60a5fa}[data-theme=dark] #status-save-indicator:active{color:#3b82f6}#container{margin-bottom:28px}.preview-pane.paper-layout{display:flex;justify-content:center;align-items:flex-start;overflow-x:auto;overflow-y:auto;min-width:0}.preview-pane.paper-layout #preview-wrapper .markdown-body{background:transparent!important}#output.paper-layout-active{width:var(--paper-width, 21cm);min-height:var(--paper-height, 29.7cm);margin:0 auto;padding:var(--paper-margin-top, 2cm) var(--paper-margin-right, 2cm) var(--paper-margin-bottom, 2cm) var(--paper-margin-left, 2cm);backgroun⟪ 4301 characters skipped ⟫8f0;display:flex;justify-content:space-between;align-items:center}[data-theme=dark] .version-history-header{border-bottom-color:#2d2d2d}.version-history-header h3{font-size:13px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:.5px;margin:0}[data-theme=dark] .version-history-header h3{color:#e2e8f0}.version-history-header-actions{display:flex;gap:8px;align-items:center}.version-search-box{width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;background:#fff;color:#1e293b;transition:all .2s;margin-bottom:12px}.version-search-box:focus{outline:none;border-color:#94a3b8;background:#f8fafc}.version-search-box::placeholder{color:#94a3b8}[data-theme=dark] .version-search-box{background:#1e1e1e;border-color:#3d3d3d;color:#e2e8f0}[data-theme=dark] .version-search-box:focus{border-color:#6b7280;background:#2d2d2d}[data-theme=dark] .version-search-box::placeholder{color:#64748b}.version-settings-btn{background:none;border:none;cursor:pointer;padding:6px;border-radius:6px;transition:all .2s;opacity:.7;display:flex;align-items:center;justify-content:center;color:#64748b}.version-settings-btn:hover{background:#f1f5f9;opacity:1}[data-theme=dark] .version-settings-btn{color:#94a3b8}[data-theme=dark] .version-settings-btn:hover{background:#3d3d3d}.version-history-close{background:none;border:none;font-size:24px;cursor:pointer;padding:0;width:32px;height:32px;border-radius:8px;transition:all .2s;color:#64748b;display:flex;align-items:center;justify-content:center}.version-history-close:hover{background:#f1f5f9;color:#1e293b}[data-theme=dark] .version-history-close:hover{background:#3d3d3d;color:#e2e8f0}.version-history-actions{padding:12px 20px;border-bottom:1px solid #e2e8f0;display:flex;flex-direction:column;gap:8px}[data-theme=dark] .version-history-actions{border-bottom-color:#2d2d2d}.version-info{font-size:11px;color:#64748b;text-align:center;padding:8px 0}[data-theme=dark] .version-info{color:#94a3b8}.version-action-btn{padding:8px 12px;border:none;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;transition:all .2s ease;text-align:center;background:#3b82f6;color:#fff}.version-action-btn:hover{background:#2563eb}.version-history-list{flex:1;overflow-y:auto;padding:12px 20px}.version-empty-state{color:#94a3b8;font-size:12px;text-align:center;padding:20px}.version-item{padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;cursor:pointer;transition:all .2s ease}.version-item:hover{background:#f1f5f9;border-color:#cbd5e1}[data-theme=dark] .ver⟪ 2935 characters skipped ⟫play:flex;justify-content:space-between;align-items:center}[data-theme=dark] .autosave-modal-header{border-bottom-color:#2d2d2d}.autosave-modal-header h3{margin:0;font-size:16px;font-weight:600;color:#1e293b}[data-theme=dark] .autosave-modal-header h3{color:#e2e8f0}.autosave-modal-close{background:none;border:none;font-size:28px;cursor:pointer;color:#64748b;padding:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:all .2s}.autosave-modal-close:hover{background:#f1f5f9;color:#1e293b}[data-theme=dark] .autosave-modal-close:hover{background:#3d3d3d;color:#e2e8f0}.autosave-modal-body{padding:24px}.autosave-setting{margin-bottom:24px}.autosave-setting:last-child{margin-bottom:0}.autosave-setting>label{display:block;font-size:13px;font-weight:600;color:#475569;margin-bottom:12px}[data-theme=dark] .autosave-setting>label{color:#cbd5e1}.autosave-toggle{display:flex;align-items:center;gap:12px;cursor:pointer}.autosave-toggle input[type=checkbox]{width:20px;height:20px;cursor:pointer}.autosave-toggle span{font-size:14px;color:#1e293b}[data-theme=dark] .autosave-toggle span{color:#e2e8f0}.autosave-interval-options{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px}.interval-btn{padding:10px;border:2px solid #e2e8f0;border-radius:8px;background:#fff;color:#475569;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s}.interval-btn:hover{border-color:#cbd5e1;background:#f8fafc}.interval-btn.active{border-color:#3b82f6;background:#eff6ff;color:#2563eb}[data-theme=dark] .interval-btn{background:#2d2d2d;border-color:#3d3d3d;color:#cbd5e1}[data-theme=dark] .interval-btn:hover{background:#3d3d3d;border-color:#4d4d4d}[data-theme=dark] .interval-btn.active{border-color:#3b82f6;background:#1e3a5f;color:#60a5fa}.autosave-custom-interval{display:flex;align-items:center;gap:12px}.autosave-custom-interval label{font-size:13px;color:#64748b;white-space:nowrap}.autosave-custom-interval input{flex:1;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;color:#1e293b}[data-theme=dark] .autosave-custom-interval input{background:#2d2d2d;border-color:#3d3d3d;color:#e2e8f0}.autosave-modal-footer{padding:16px 24px;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:12px}[data-theme=dark] .autosave-modal-footer{border-top-color:#2d2d2d}.autosave-btn-cancel,.autosave-btn-save{padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}.autosave-btn-cancel{background:#fff;border:1px solid #e2e8f0;color:#475569}.autosave-btn-cancel:hover{background:#f8fafc}.autosave-btn-save{background:#3b82f6;border:none;color:#fff}.autosave-btn-save:hover{background:#2563eb}[data-theme=dark] .autosave-btn-cancel{background:#2d2d2d;border-color:#3d3d3d;color:#cbd5e1}[data-theme=dark] .autosave-btn-cancel:hover{background:#3d3d3d}.confirm-dialog{position:fixed;top:0;left:0;right:0;bottom:0;background:#000000b3;display:none;align-items:center;justify-content:center;z-index:1002;padding:20px}.confirm-dialog.visible{display:flex}.confirm-dialog-content{background:#fff;border-radius:12px;max-width:400px;width:100%;box-shadow:0 10px 40px #0000004d}[data-theme=dark] .confirm-dialog-content{background:#1e1e1e}.confirm-dialog-header{padding:20px 24px;border-bottom:1px solid #e2e8f0}[data-theme=dark] .confirm-dialog-header{border-bottom-color:#2d2d2d}.confirm-dialog-header h3{margin:0;font-size:16px;font-weight:600;color:#1e293b}[data-theme=dark] .confirm-dialog-header h3{color:#e2e8f0}.confirm-dialog-body{padding:24px}.confirm-dialog-body p{margin:0;font-size:14px;color:#475569;line-height:1.6}[data-theme=dark] .confirm-dialog-body p{color:#cbd5e1}.confirm-dialog-footer{padding:16px 24px;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:12px}[data-theme=dark] .confirm-dialog-footer{border-top-color:#2d2d2d}.confirm-btn-cancel,.confirm-btn-confirm{padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}.confirm-btn-cancel{background:#fff;border:1px solid #e2e8f0;color:#475569}.confirm-btn-cancel:hover{background:#f8fafc}.confirm-btn-confirm{background:#ef4444;border:none;color:#fff}.confirm-btn-confirm:hover{background:#dc2626}[data-theme=dark] .confirm-btn-cancel{background:#2d2d2d;border-color:#3d3d3d;color:#cbd5e1}[data-theme=dark] .confirm-btn-cancel:hover{background:#3d3d3d}.version-modal{position:fixed;top:0;left:0;right:0;bottom:0⟪ 433 characters skipped ⟫#e2e8f0;display:flex;justify-content:space-between;align-items:center}[data-theme=dark] .version-modal-header{border-bottom-color:#2d2d2d}.version-modal-header h3{font-size:16px;font-weight:700;color:#1e293b;margin:0}[data-theme=dark] .version-modal-header h3{color:#e2e8f0}.version-modal-close{background:none;border:none;font-size:28px;cursor:pointer;color:#64748b;padding:0;width:36px;height:36px;border-radius:8px;transition:all .2s;display:flex;align-items:center;justify-content:center}.version-modal-close:hover{background:#f1f5f9;color:#1e293b}[data-theme=dark] .version-modal-close:hover{background:#3d3d3d;color:#e2e8f0}.version-modal-body{flex:1;overflow-y:auto;padding:24px}.version-compare-view{display:grid;grid-template-columns:1fr 1fr;gap:20px;height:100%}.compare-pane{border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;display:flex;flex-direction:column}[data-theme=dark] .compare-pane{border-color:#2d2d2d}.compare-pane-header{padding:12px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#475569}[data-theme=dark] .compare-pane-header{background:#2d2d2d;border-bottom-color:#3d3d3d;color:#94a3b8}.compare-pane-content{flex:1;padding:16px;overflow-y:auto;background:#fff;font-family:Courier New,monospace;font-size:13px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word}[data-theme=dark] .compare-pane-content{background:#0d1117;color:#e6edf3}.raw-markdown-view{background:#f8fafc;color:#1e293b}[data-theme=dark] .raw-markdown-view{background:#0d1117;color:#e6edf3}.diff-added-block{background:#f0ffc7;border-left:4px solid #cdd926;padding:8px 12px;margin:8px 0;border-radius:4px}[data-theme=dark] .diff-added-block{background:#2d3319;border-left-color:#cdd926}.diff-removed-block{background:#ffe5e5;border-left:4px solid #d92f26;padding:8px 12px;margin:8px 0;border-radius:4px}[data-theme=dark] .diff-removed-block{background:#3d1a19;border-left-color:#d92f26}.edit-mode-active .markdown-body>*{outline:none;border-left:3px solid transparent;padding-left:15px;margin-left:-18px;transition:all .15s ease-out;position:relative}.edit-mode-active .markdown-body>*:hover{border-left-color:#cbd5e1;background:#cbd5e11a}.edit-mode-active .markdown-body>*:focus{background:#2563eb0d;border-left-color:#3b82f6;outline:none}[data-theme=dark].edit-mode-active .markdown-body>*:hover{border-left-color:#475569;background:#4755691a}[data-theme=dark].edit-mode-active .markdown-body>*:focus{backgroun⟪ 7432 characters skipped ⟫-width:180px;z-index:10000;display:none}.media-context-menu.active{display:block}.media-context-menu-item{padding:8px 16px;cursor:pointer;display:flex;align-items:center;gap:10px;font-size:13px;color:#1e293b;transition:background .15s ease}.media-context-menu-item:hover{background:#f1f5f9}.media-context-menu-item.disabled{opacity:.5;cursor:not-allowed;pointer-events:none}.media-context-menu-item svg{width:16px;height:16px;stroke:currentColor;flex-shrink:0}.media-context-menu-separator{height:1px;background:#e2e8f0;margin:4px 0}[data-theme=dark] .media-context-menu{background:#2d2d2d;border-color:#3d3d3d}[data-theme=dark] .media-context-menu-item{color:#94a3b8}[data-theme=dark] .media-context-menu-item:hover{background:#3d3d3d;color:#e2e8f0}[data-theme=dark] .media-context-menu-separator{background:#3d3d3d}.preview-pane img.media-selected,.preview-pane video.media-selected{outline:2px solid #3b82f6;outline-offset:2px;border-radius:4px}.inspector-pane{background:#fff;border-left:1px solid #e2e8f0;display:flex;flex-direction:column;overflow:hidden}.inspector-pane.hidden{flex-basis:0!important;width:0!important;min-width:0!important;border:none!important;overflow:hidden!important}.inspector-divider{cursor:col-resize}.inspector-divider.hidden{flex-basis:0!important;width:0!important;display:none!important}.inspector-panel-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e2e8f0;background:#f8fafc;flex-shrink:0}.inspector-panel-header h3{font-size:14px;font-weight:600;color:#1e293b;margin:0;text-transform:uppercase;letter-spacing:.5px}.inspector-close{width:28px;height:28px;border:none;background:transparent;color:#64748b;font-size:24px;line-height:1;cursor:pointer;border-radius:4px;transition:all .2s;display:flex;align-items:center;justify-content:center}.inspector-close:hover{background:#e2e8f0;color:#1e293b}.inspector-empty{text-align:center;color:#94a3b8;font-size:13px;padding:40px 20px;font-style:italic}.inspector-section{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px}.inspector-section-header{font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e2e8f0}.inspector-field label{display:block;font-size:11px;font-weight:600;color:#64748b;margin-bottom:4px;text-transform:uppercase;letter-spacing:.3px}.inspector-field input,.inspector-field select{width:100%;padding:6px 8px;border:1px solid #cbd5e1;border-radius:4px;font-size:13px;color:#1e293b;background:#fff;transition:all .2s}.inspector-field input:focus,.inspector-field select:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px #3b82f61a}.inspector-field input[type=color]{height:36px;padding:2px;cursor:pointer}.inspector-field input[readonly]{background:#f1f5f9;color:#64748b;cursor:not-allowed}.inspector-action-btn{width:100%;padding:10px;border:1px solid #cbd5e1;background:#fff;color:#475569;font-size:12px;font-weight:600;border-radius:4px;cursor:pointer;transition:all .2s;margin-bottom:8px}.inspector-action-btn:last-child{margin-bottom:0}.inspector-action-btn:hover{background:#f8fafc;border-color:#94a3b8}.inspector-action-btn.inspector-action-primary{background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;border-color:#2563eb}.inspector-action-btn.inspector-action-primary:hover{transform:translateY(-1px);box-shadow:0 4px 12px #2563eb4d}.inspector-action-btn.inspector-action-danger{background:#fff;color:#dc2626;border-color:#fca5a5}.inspector-action-btn.inspector-action-danger:hover{background:#fef2f2;border-color:#dc2626}#inspector-toggle-button{display:none}#inspector-toggle-button.active{background:#dbeafe;color:#2563eb}[data-theme=dark] .inspector-pane{background:#1e293b;border-left-color:#334155}[data-theme=dark] .inspector-panel-header{background:#0f172a;border-bottom-color:#334155}[data-theme=dark] .inspector-panel-header h3{color:#f1f5f9}[data-theme=dark] .inspector-close{color:#94a3b8}[data-theme=dark] .inspector-close:hover{background:#334155;color:#f1f5f9}[data-theme=dark] .inspector-empty{color:#64748b}[data-theme=dark] .inspector-section{background:#0f172a;border-color:#334155}[data-theme=dark] .inspector-section-header{color:#cbd5e1;border-bottom-color:#334155}[data-theme=dark] .inspector-field label{color:#94a3b8}[data-theme=dark] .inspector-field input,[data-theme=dark] .inspector-field select{background:#0f172a;border-color:#475569;color:#f1f5f9}[data-theme=dark] .inspector-field input:focus,[data-theme=dark] .inspector-field select:focus{border-color:#60a5fa;box-shadow:0 0 0 3px #60a5fa1a}[data-theme=dark] .inspector-field input[readonly]{background:#0f172a;color:#64748b}[data-theme=dark] .inspector-action-btn{background:#0f172a;b⟪ 5418 characters skipped ⟫ign-items:center;justify-content:center;background:transparent;border:none;cursor:pointer;transition:all .15s ease;color:#64748b;border-radius:6px}.paper-control-btn-sm:hover{background:#f1f5f9;color:#1e293b}.paper-control-btn-sm:active{transform:scale(.95)}.paper-control-btn-sm:disabled{opacity:.3;cursor:not-allowed}.paper-zoom-display{font-size:11px;font-weight:600;color:#475569;min-width:42px;text-align:center}.paper-controls-divider{width:1px;height:20px;background:#e2e8f0}.paper-page-info{font-size:11px;font-weight:600;color:#64748b;min-width:48px;text-align:center}.paper-mode-toggle{background:#1e293b;color:#fff;padding:6px 12px;border-radius:16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;border:none;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .15s ease}.paper-mode-toggle:hover{background:#0f172a}.paper-mode-toggle:active{transform:scale(.98)}.paper-mode-toggle.pagination-mode{background:#2563eb}.paper-mode-toggle.pagination-mode:hover{background:#1d4ed8}[data-theme=dark] .paper-controls-bar{background:#1e1e1ef2;border-color:#ffffff1a}[data-theme=dark] .paper-control-btn-sm{color:#64748b}[data-theme=dark] .paper-control-btn-sm:hover{background:#334155;color:#e2e8f0}[data-theme=dark] .paper-zoom-display{color:#94a3b8}[data-theme=dark] .paper-controls-divider{background:#334155}[data-theme=dark] .paper-page-info{color:#64748b}[data-theme=dark] .paper-mode-toggle{background:#f8fafc;color:#1e293b}[data-theme=dark] .paper-mode-toggle:hover{background:#fff}[data-theme=dark] .paper-mode-toggle.pagination-mode{background:#3b82f6;color:#fff}[data-theme=dark] .paper-mode-toggle.pagination-mode:hover{background:#2563eb}#preview-wrapper.paper-layout-active{background:#cbd5e1;padding:100px 40px 40px;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;box-sizing:border-box}#output.paper-layout-active{max-width:none;width:auto;margin:0;padding:0;background:transparent}#paper-scaler{transform-origin:top center;transition:transform .05s linear;display:flex;justify-content:center;width:100%;box-sizing:border-box;padding-bottom:40px}.paper-stack{display:flex;flex-direction:column;gap:30px;margin:0;padding:0}.paper-page{width:794px;min-height:1123px;background:#fff;box-shadow:0 20px 25px -5px #0003;margin:0 auto;padding:80px;box-sizing:border-box;position:relative;overflow:hidden;page-break-after:always;page-break-inside:av⟪ 330 characters skipped ⟫{position:absolute;bottom:40px;left:0;right:0;text-align:center;font-size:11px;color:#94a3b8;font-weight:500}.paper-content{width:100%;height:100%;overflow:hidden;font-size:14px;line-height:1.6;color:#1e293b}.paper-content h1,.paper-content h2,.paper-content h3,.paper-content h4,.paper-content h5,.paper-content h6{margin-top:0;margin-bottom:16px;font-weight:600;line-height:1.25;page-break-after:avoid}.paper-content h1{font-size:2em}.paper-content h2{font-size:1.5em}.paper-content h3{font-size:1.25em}.paper-content h4{font-size:1em}.paper-content h5{font-size:.875em}.paper-content h6{font-size:.85em}.paper-content p{margin:0 0 16px;line-height:1.6}.paper-content ul,.paper-content ol{margin:0 0 16px;padding-left:2em}.paper-content li{margin-bottom:4px}.paper-content pre{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:16px;overflow-x:auto;margin:0 0 16px;page-break-inside:avoid}.paper-content code{background:#f8fafc;padding:2px 6px;border-radius:3px;font-size:.9em;font-family:Courier New,monospace}.paper-content pre code{background:none;padding:0}.paper-content blockquote{border-left:4px solid #e2e8f0;padding-left:16px;margin:0 0 16px;color:#64748b;font-style:ita⟪ 714 characters skipped ⟫ontrols-bar,.no-print{display:none!important}#paper-scaler{transform:none!important}}[data-theme=dark] #preview-wrapper.paper-layout-active{background:#0f172a}[data-theme=dark] .paper-page{background:#1e293b;box-shadow:0 20px 25px -5px #00000080}[data-theme=dark] .paper-content{color:#e2e8f0}[data-theme=dark] .paper-content pre{background:#0f172a;border-color:#334155}[data-theme=dark] .paper-content code{background:#0f172a}[data-theme=dark] .paper-content blockquote{border-left-color:#334155;color:#94a3b8}[data-theme=dark] .paper-content table th,[data-theme=dark] .paper-content table td{border-color:#334155}[data-theme=dark] .paper-content table th{background:#0f172a}[data-theme=dark] .paper-content hr{border-top-color:#334155}[data-theme=dark] .paper-page-number{color:#64748b}.inspector-pane{background:var(--editor-bg);border-left:1px solid var(--border-color);display:flex;flex-direction:column;overflow:hidden;width:320px;min-width:320px;max-width:320px}.inspector-pane.hidden{display:none}.inspector-panel-header{padding:12px 16px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;background:var(--editor-bg)}.inspector-panel-h⟪ 14777 characters skipped ⟫ckground:#3d3d3d;border-color:#444}.ai-modal-btn-primary{background:#007acc;color:#fff}.ai-modal-btn-primary:hover{background:#0098ff;transform:translateY(-1px)}[data-theme=dark] .ai-modal{background:#1e293b}[data-theme=dark] .ai-modal-header{border-bottom-color:#334155}[data-theme=dark] .ai-modal-header h3{color:#f1f5f9}[data-theme=dark] .ai-modal-close{background:#334155;color:#94a3b8}[data-theme=dark] .ai-modal-close:hover{background:#475569;color:#f1f5f9}[data-theme=dark] .ai-modal-body label{color:#cbd5e1}[data-theme=dark] .ai-modal-input{background:#0f172a;border-color:#334155;color:#e2e8f0}[data-theme=dark] .ai-modal-input:focus{border-color:#3b82f6}[data-theme=dark] .ai-modal-footer{border-top-color:#334155;background:#0f172a}[data-theme=dark] .ai-modal-btn-cancel{background:#334155;color:#e2e8f0;border-color:#475569}[data-theme=dark] .ai-modal-btn-cancel:hover{background:#475569;border-color:#64748b}.ai-chat-pane{width:400px;background:#1e1e1e;border-left:1px solid #333333;display:flex;flex-direction:column;height:100%}.ai-chat-pane.hidden{display:none}.ai-chat-header{background:#1e1e1e;color:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:cen

dist\css\ai-assistant.css:
  461  [data-theme="dark"] .ai-modal {
  462:     background: #1e293b;
  463  }

dist\css\style.css:
    60    font-size: 13px;
    61:   color: #1e293b;
    62    box-shadow: 0 1px 3px rgba(0,0,0,0.05);

    69  header a:link, header a:hover, header a:visited, header a:active {
    70:   color: #1e293b;
    71  }

   140    font-weight: 600;
   141:   color: #1e293b;
   142    margin: 0;

   162    background: #f1f5f9;
   163:   color: #1e293b;
   164  }

   248  [data-theme="dark"] .paste-dialog {
   249:   background: #1e293b;
   250  }

   305    --m-size: 40px;
   306:   --m-stroke: #1e293b;
   307    display: flex;

   365    height: 6px;
   366:   background: #1e293b;
   367    border-radius: 50%;

   374    height: 3.5px;
   375:   border: 1.5px solid #1e293b;
   376    border-top: none;

   384    height: 8px !important;
   385:   border: 1.5px solid #1e293b !important;
   386    border-radius: 50% !important;

   436  [data-theme="dark"] .mofu-header-widget {
   437:   --m-stroke: #1e293b;
   438  }

   507    background: #ffffff;
   508:   color: #1e293b;
   509    box-shadow: 0 1px 3px rgba(0,0,0,0.1);

   566    background: #f1f5f9;
   567:   color: #1e293b;
   568  }

   582    background: #f8fafc;
   583:   color: #1e293b;
   584    border: 1px solid #e2e8f0;

   643  [data-theme="dark"] .icon-button:hover {
   644:   background-color: #1e293b;
   645    color: #60a5fa;

  1410    font-weight: 700;
  1411:   color: #1e293b;
  1412    text-transform: uppercase;

  1434    background: #f1f5f9;
  1435:   color: #1e293b;
  1436  }

  1606  [data-theme="dark"] #preview.column {
  1607:   scrollbar-color: #60a5fa #1e293b;
  1608  }

  1610  [data-theme="dark"] #preview.column::-webkit-scrollbar {
  1611:   background: #1e293b;
  1612  }

  1614  [data-theme="dark"] #preview.column::-webkit-scrollbar-track {
  1615:   background: #1e293b;
  1616    border-radius: 8px;

  1620    background-color: #60a5fa;
  1621:   border: 3px solid #1e293b;
  1622  }

  1738    font-weight: 700;
  1739:   color: #1e293b;
  1740    text-transform: uppercase;

  1762    background: #f1f5f9;
  1763:   color: #1e293b;
  1764  }

  2045    background: #ffffff;
  2046:   color: #1e293b;
  2047    padding: 12px 20px;

  2106    background: #ffffff;
  2107:   color: #1e293b;
  2108    padding: 14px 18px;

  2710      background: #f1f5f9;
  2711:     color: #1e293b;
  2712  }

  2753      font-weight: 500;
  2754:     color: #1e293b;
  2755  }

  3100      font-weight: 700;
  3101:     color: #1e293b;
  3102      text-transform: uppercase;

  3123      background: #ffffff;
  3124:     color: #1e293b;
  3125      transition: all 0.2s;

  3198      background: #f1f5f9;
  3199:     color: #1e293b;
  3200  }

  3498      font-weight: 600;
  3499:     color: #1e293b;
  3500  }

  3523      background: #f1f5f9;
  3524:     color: #1e293b;
  3525  }

  3570      font-size: 14px;
  3571:     color: #1e293b;
  3572  }

  3642      font-size: 13px;
  3643:     color: #1e293b;
  3644  }

  3747      font-weight: 600;
  3748:     color: #1e293b;
  3749  }

  3870      font-weight: 700;
  3871:     color: #1e293b;
  3872      margin: 0;

  3896      background: #f1f5f9;
  3897:     color: #1e293b;
  3898  }

  3963      background: #f8fafc;
  3964:     color: #1e293b;
  3965  }

  4576    font-size: 13px;
  4577:   color: #1e293b;
  4578    transition: background 0.15s ease;

  4672    font-weight: 600;
  4673:   color: #1e293b;
  4674    margin: 0;

  4696    background: #e2e8f0;
  4697:   color: #1e293b;
  4698  }

  4762    font-size: 13px;
  4763:   color: #1e293b;
  4764    background: #ffffff;

  4843  [data-theme="dark"] .inspector-pane {
  4844:   background: #1e293b;
  4845    border-left-color: #334155;

  5369    background: #f1f5f9;
  5370:   color: #1e293b;
  5371  }

  5405  .paper-mode-toggle {
  5406:   background: #1e293b;
  5407    color: white;

  5466    background: #f8fafc;
  5467:   color: #1e293b;
  5468  }

  5579    line-height: 1.6;
  5580:   color: #1e293b;
  5581  }

  5724  [data-theme="dark"] .paper-page {
  5725:   background: #1e293b;
  5726    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);

dist\css\style.css.backup:
    60    font-size: 13px;
    61:   color: #1e293b;
    62    box-shadow: 0 1px 3px rgba(0,0,0,0.05);

    69  header a:link, header a:hover, header a:visited, header a:active {
    70:   color: #1e293b;
    71  }

   140    font-weight: 600;
   141:   color: #1e293b;
   142    margin: 0;

   162    background: #f1f5f9;
   163:   color: #1e293b;
   164  }

   248  [data-theme="dark"] .paste-dialog {
   249:   background: #1e293b;
   250  }

   305    --m-size: 40px;
   306:   --m-stroke: #1e293b;
   307    display: flex;

   365    height: 6px;
   366:   background: #1e293b;
   367    border-radius: 50%;

   374    height: 3.5px;
   375:   border: 1.5px solid #1e293b;
   376    border-top: none;

   384    height: 8px !important;
   385:   border: 1.5px solid #1e293b !important;
   386    border-radius: 50% !important;

   436  [data-theme="dark"] .mofu-header-widget {
   437:   --m-stroke: #1e293b;
   438  }

   507    background: #ffffff;
   508:   color: #1e293b;
   509    box-shadow: 0 1px 3px rgba(0,0,0,0.1);

   566    background: #f1f5f9;
   567:   color: #1e293b;
   568  }

   582    background: #f8fafc;
   583:   color: #1e293b;
   584    border: 1px solid #e2e8f0;

   643  [data-theme="dark"] .icon-button:hover {
   644:   background-color: #1e293b;
   645    color: #60a5fa;

  1536    font-weight: 700;
  1537:   color: #1e293b;
  1538    text-transform: uppercase;

  1560    background: #f1f5f9;
  1561:   color: #1e293b;
  1562  }

  1854    font-weight: 700;
  1855:   color: #1e293b;
  1856    text-transform: uppercase;

  1878    background: #f1f5f9;
  1879:   color: #1e293b;
  1880  }

  2161    background: #ffffff;
  2162:   color: #1e293b;
  2163    padding: 12px 20px;

  2222    background: #ffffff;
  2223:   color: #1e293b;
  2224    padding: 14px 18px;

  2826      background: #f1f5f9;
  2827:     color: #1e293b;
  2828  }

  2869      font-weight: 500;
  2870:     color: #1e293b;
  2871  }

  3204      font-weight: 700;
  3205:     color: #1e293b;
  3206      text-transform: uppercase;

  3227      background: #ffffff;
  3228:     color: #1e293b;
  3229      transition: all 0.2s;

  3302      background: #f1f5f9;
  3303:     color: #1e293b;
  3304  }

  3602      font-weight: 600;
  3603:     color: #1e293b;
  3604  }

  3627      background: #f1f5f9;
  3628:     color: #1e293b;
  3629  }

  3674      font-size: 14px;
  3675:     color: #1e293b;
  3676  }

  3746      font-size: 13px;
  3747:     color: #1e293b;
  3748  }

  3851      font-weight: 600;
  3852:     color: #1e293b;
  3853  }

  3974      font-weight: 700;
  3975:     color: #1e293b;
  3976      margin: 0;

  4000      background: #f1f5f9;
  4001:     color: #1e293b;
  4002  }

  4067      background: #f8fafc;
  4068:     color: #1e293b;
  4069  }

  4472      font-weight: 600;
  4473:     color: #1e293b;
  4474  }

  4495      background: #f1f5f9;
  4496:     color: #1e293b;
  4497  }

  4555      font-size: 14px;
  4556:     color: #1e293b;
  4557      background: #ffffff;

  4893    font-size: 13px;
  4894:   color: #1e293b;
  4895    transition: background 0.15s ease;

  4989    font-weight: 600;
  4990:   color: #1e293b;
  4991    margin: 0;

  5013    background: #e2e8f0;
  5014:   color: #1e293b;
  5015  }

  5079    font-size: 13px;
  5080:   color: #1e293b;
  5081    background: #ffffff;

  5160  [data-theme="dark"] .inspector-pane {
  5161:   background: #1e293b;
  5162    border-left-color: #334155;

public\css\ai-assistant.css:
    36      background: #ffffff;
    37:     color: #1e293b;
    38      padding: 16px 20px;

    48      font-weight: 600;
    49:     color: #1e293b;
    50      margin: 0;

    70      background: #e2e8f0;
    71:     color: #1e293b;
    72  }

   103      background: #ffffff;
   104:     color: #1e293b;
   105      cursor: pointer;

   150      border-color: #cbd5e1;
   151:     color: #1e293b;
   152  }

   249      transform: translateX(-50%);
   250:     background: #1e293b;
   251      color: #ffffff;

   446      font-weight: 600;
   447:     color: #1e293b;
   448      margin: 0;

   468      background: #e2e8f0;
   469:     color: #1e293b;
   470  }

   491      font-family: 'Inter', sans-serif;
   492:     color: #1e293b;
   493      resize: vertical;

   621      background: #ffffff;
   622:     color: #1e293b;
   623      padding: 16px 20px;

   633      font-weight: 600;
   634:     color: #1e293b;
   635      margin: 0;

   674      background: #e2e8f0;
   675:     color: #1e293b;
   676  }

   774      max-height: 120px;
   775:     color: #1e293b;
   776      background: #ffffff;

   925      background: #ffffff;
   926:     color: #1e293b;
   927      font-family: 'Monaco', 'Menlo', monospace;

   949      background: #e2e8f0;
   950:     color: #1e293b;
   951  }

   993      font-weight: 600;
   994:     color: #1e293b;
   995      background: #ffffff;

  1159      background: #e2e8f0;
  1160:     color: #1e293b;
  1161      border-color: #cbd5e1;

public\css\style.css:
    60    font-size: 13px;
    61:   color: #1e293b;
    62    box-shadow: 0 1px 3px rgba(0,0,0,0.05);

    69  header a:link, header a:hover, header a:visited, header a:active {
    70:   color: #1e293b;
    71  }

   140    font-weight: 600;
   141:   color: #1e293b;
   142    margin: 0;

   162    background: #f1f5f9;
   163:   color: #1e293b;
   164  }

   305    --m-size: 40px;
   306:   --m-stroke: #1e293b;
   307    display: flex;

   365    height: 6px;
   366:   background: #1e293b;
   367    border-radius: 50%;

   374    height: 3.5px;
   375:   border: 1.5px solid #1e293b;
   376    border-top: none;

   384    height: 8px !important;
   385:   border: 1.5px solid #1e293b !important;
   386    border-radius: 50% !important;

   507    background: #ffffff;
   508:   color: #1e293b;
   509    box-shadow: 0 1px 3px rgba(0,0,0,0.1);

   566    background: #f1f5f9;
   567:   color: #1e293b;
   568  }

   582    background: #f8fafc;
   583:   color: #1e293b;
   584    border: 1px solid #e2e8f0;

  1410    font-weight: 700;
  1411:   color: #1e293b;
  1412    text-transform: uppercase;

  1434    background: #f1f5f9;
  1435:   color: #1e293b;
  1436  }

  1738    font-weight: 700;
  1739:   color: #1e293b;
  1740    text-transform: uppercase;

  1762    background: #f1f5f9;
  1763:   color: #1e293b;
  1764  }

  2045    background: #ffffff;
  2046:   color: #1e293b;
  2047    padding: 12px 20px;

  2106    background: #ffffff;
  2107:   color: #1e293b;
  2108    padding: 14px 18px;

  2710      background: #f1f5f9;
  2711:     color: #1e293b;
  2712  }

  2753      font-weight: 500;
  2754:     color: #1e293b;
  2755  }

  3100      font-weight: 700;
  3101:     color: #1e293b;
  3102      text-transform: uppercase;

  3123      background: #ffffff;
  3124:     color: #1e293b;
  3125      transition: all 0.2s;

  3198      background: #f1f5f9;
  3199:     color: #1e293b;
  3200  }

  3498      font-weight: 600;
  3499:     color: #1e293b;
  3500  }

  3523      background: #f1f5f9;
  3524:     color: #1e293b;
  3525  }

  3570      font-size: 14px;
  3571:     color: #1e293b;
  3572  }

  3642      font-size: 13px;
  3643:     color: #1e293b;
  3644  }

  3747      font-weight: 600;
  3748:     color: #1e293b;
  3749  }

  3870      font-weight: 700;
  3871:     color: #1e293b;
  3872      margin: 0;

  3896      background: #f1f5f9;
  3897:     color: #1e293b;
  3898  }

  3963      background: #f8fafc;
  3964:     color: #1e293b;
  3965  }

  4576    font-size: 13px;
  4577:   color: #1e293b;
  4578    transition: background 0.15s ease;

  4672    font-weight: 600;
  4673:   color: #1e293b;
  4674    margin: 0;

  4696    background: #e2e8f0;
  4697:   color: #1e293b;
  4698  }

  4762    font-size: 13px;
  4763:   color: #1e293b;
  4764    background: #ffffff;

  5369    background: #f1f5f9;
  5370:   color: #1e293b;
  5371  }

  5602    line-height: 1.6;
  5603:   color: #1e293b;
  5604  }

  5743  [data-theme="dark"] #preview-wrapper.paper-layout-active {
  5744:   background: #1e293b;
  5745:   scrollbar-color: #6b7280 #1e293b;
  5746  }

  5748  [data-theme="dark"] #preview-wrapper.paper-layout-active::-webkit-scrollbar {
  5749:   background: #1e293b;
  5750  }

  5752  [data-theme="dark"] #preview-wrapper.paper-layout-active::-webkit-scrollbar-track {
  5753:   background: #1e293b;
  5754    border-radius: 8px;

  5758    background-color: #6b7280;
  5759:   border: 3px solid #1e293b;
  5760  }

  5766  [data-theme="dark"] .paper-page {
  5767:   background: #1e293b;
  5768    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);

public\css\style.css.backup:
    60    font-size: 13px;
    61:   color: #1e293b;
    62    box-shadow: 0 1px 3px rgba(0,0,0,0.05);

    69  header a:link, header a:hover, header a:visited, header a:active {
    70:   color: #1e293b;
    71  }

   140    font-weight: 600;
   141:   color: #1e293b;
   142    margin: 0;

   162    background: #f1f5f9;
   163:   color: #1e293b;
   164  }

   248  [data-theme="dark"] .paste-dialog {
   249:   background: #1e293b;
   250  }

   305    --m-size: 40px;
   306:   --m-stroke: #1e293b;
   307    display: flex;

   365    height: 6px;
   366:   background: #1e293b;
   367    border-radius: 50%;

   374    height: 3.5px;
   375:   border: 1.5px solid #1e293b;
   376    border-top: none;

   384    height: 8px !important;
   385:   border: 1.5px solid #1e293b !important;
   386    border-radius: 50% !important;

   436  [data-theme="dark"] .mofu-header-widget {
   437:   --m-stroke: #1e293b;
   438  }

   507    background: #ffffff;
   508:   color: #1e293b;
   509    box-shadow: 0 1px 3px rgba(0,0,0,0.1);

   566    background: #f1f5f9;
   567:   color: #1e293b;
   568  }

   582    background: #f8fafc;
   583:   color: #1e293b;
   584    border: 1px solid #e2e8f0;

   643  [data-theme="dark"] .icon-button:hover {
   644:   background-color: #1e293b;
   645    color: #60a5fa;

  1536    font-weight: 700;
  1537:   color: #1e293b;
  1538    text-transform: uppercase;

  1560    background: #f1f5f9;
  1561:   color: #1e293b;
  1562  }

  1854    font-weight: 700;
  1855:   color: #1e293b;
  1856    text-transform: uppercase;

  1878    background: #f1f5f9;
  1879:   color: #1e293b;
  1880  }

  2161    background: #ffffff;
  2162:   color: #1e293b;
  2163    padding: 12px 20px;

  2222    background: #ffffff;
  2223:   color: #1e293b;
  2224    padding: 14px 18px;

  2826      background: #f1f5f9;
  2827:     color: #1e293b;
  2828  }

  2869      font-weight: 500;
  2870:     color: #1e293b;
  2871  }

  3204      font-weight: 700;
  3205:     color: #1e293b;
  3206      text-transform: uppercase;

  3227      background: #ffffff;
  3228:     color: #1e293b;
  3229      transition: all 0.2s;

  3302      background: #f1f5f9;
  3303:     color: #1e293b;
  3304  }

  3602      font-weight: 600;
  3603:     color: #1e293b;
  3604  }

  3627      background: #f1f5f9;
  3628:     color: #1e293b;
  3629  }

  3674      font-size: 14px;
  3675:     color: #1e293b;
  3676  }

  3746      font-size: 13px;
  3747:     color: #1e293b;
  3748  }

  3851      font-weight: 600;
  3852:     color: #1e293b;
  3853  }

  3974      font-weight: 700;
  3975:     color: #1e293b;
  3976      margin: 0;

  4000      background: #f1f5f9;
  4001:     color: #1e293b;
  4002  }

  4067      background: #f8fafc;
  4068:     color: #1e293b;
  4069  }

  4472      font-weight: 600;
  4473:     color: #1e293b;
  4474  }

  4495      background: #f1f5f9;
  4496:     color: #1e293b;
  4497  }

  4555      font-size: 14px;
  4556:     color: #1e293b;
  4557      background: #ffffff;

  4893    font-size: 13px;
  4894:   color: #1e293b;
  4895    transition: background 0.15s ease;

  4989    font-weight: 600;
  4990:   color: #1e293b;
  4991    margin: 0;

  5013    background: #e2e8f0;
  5014:   color: #1e293b;
  5015  }

  5079    font-size: 13px;
  5080:   color: #1e293b;
  5081    background: #ffffff;

  5160  [data-theme="dark"] .inspector-pane {
  5161:   background: #1e293b;
  5162    border-left-color: #334155;
