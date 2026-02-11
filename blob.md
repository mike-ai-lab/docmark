<!-- 
  INTEGRATION STEPS for Muhamad:
  1. This component now reacts to 'copy' events and 'click' events.
  2. The speech bubble appears automatically for specific reactions.
-->

<style>
    .mofu-header-widget {
        --m-size: 45px;
        --m-stroke: #0f172a;
        --m-accent: #3b82f6;
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;
        padding: 5px;
        perspective: 2000px;
        user-select: none;
    }

    /* Speech Bubble */
    .mofu-bubble {
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%) scale(0);
        background: var(--m-stroke);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        pointer-events: none;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 20;
    }
    .mofu-bubble.active { transform: translateX(-50%) scale(1); }
    .mofu-bubble::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid var(--m-stroke);
    }

    .mofu-head {
        width: var(--m-size);
        height: var(--m-size);
        border: 3px solid var(--m-stroke);
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1), border-color 0.3s;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        transform-style: preserve-3d;
    }

    .mofu-face-features {
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 0.15s ease-out;
    }

    .mofu-eyes-row {
        display: flex;
        gap: 10px;
        margin-bottom: 2px;
        transition: transform 0.3s ease;
    }

    .mofu-dot {
        width: 5px;
        height: 7px;
        background: var(--m-stroke);
        border-radius: 50%;
        animation: mofu-blink-small 4s infinite ease-in-out;
    }

    .mofu-smile {
        width: 8px;
        height: 4px;
        border: 1.5px solid var(--m-stroke);
        border-top: none;
        border-radius: 0 0 10px 10px;
        transition: all 0.3s ease;
    }

    /* Jump Animation */
    @keyframes mofu-complex-jump {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1, 1); }
        15% { transform: translate3d(0, 8px, 0) rotate(0deg) scale(1.2, 0.7); }
        45% { transform: translate3d(0, -40px, 0) rotate(180deg) scale(0.9, 1.1); }
        75% { transform: translate3d(0, 0, 0) rotate(360deg) scale(1.1, 0.9); }
        100% { transform: translate3d(0, 0, 0) rotate(360deg) scale(1, 1); }
    }
    .mofu-jumping { animation: mofu-complex-jump 0.8s cubic-bezier(0.45, 0, 0.55, 1) forwards; }

    /* Deep Breath Animation (for copy) */
    @keyframes mofu-breath {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); border-color: var(--m-accent); }
    }
    .mofu-breathing { animation: mofu-breath 0.8s ease-in-out; }

    @keyframes mofu-blink-small {
        0%, 90%, 100% { transform: scaleY(1); }
        95% { transform: scaleY(0.1); }
    }
</style>

<div class="mofu-header-widget" id="mofu-nav-trigger">
    <div class="mofu-bubble" id="mofu-text">Ouuu😍</div>
    <div class="mofu-head" id="mofu-canvas">
        <div class="mofu-face-features" id="mofu-features">
            <div class="mofu-eyes-row" id="mofu-eyes-cont">
                <div class="mofu-dot"></div>
                <div class="mofu-dot"></div>
            </div>
            <div class="mofu-smile" id="mofu-mouth"></div>
        </div>
    </div>
</div>

<script>
    (function() {
        const mofu = document.getElementById('mofu-nav-trigger');
        const canvas = document.getElementById('mofu-canvas');
        const features = document.getElementById('mofu-features');
        const bubble = document.getElementById('mofu-text');
        const mouth = document.getElementById('mofu-mouth');
        const eyesCont = document.getElementById('mofu-eyes-cont');
        let isAnimating = false;

        const showReaction = (text, duration = 1500) => {
            bubble.innerText = text;
            bubble.classList.add('active');
            setTimeout(() => bubble.classList.remove('active'), duration);
        };

        // 1. Mouse Tracking
        document.addEventListener('mousemove', (e) => {
            if (isAnimating) return;
            const rect = canvas.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
            const dy = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
            canvas.style.transform = `rotateX(${dy * -10}deg) rotateY(${dx * 15}deg)`;
            features.style.transform = `translate3d(${dx * 8}px, ${dy * 5}px, 0)`;
        });

        // 2. Click Reaction (Export/Joy)
        mofu.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            canvas.style.transform = '';
            features.style.transform = '';
            
            canvas.classList.add('mofu-jumping');
            showReaction("Ouuu😍");
            
            // "O" mouth shape
            mouth.style.borderRadius = "50%";
            mouth.style.height = "8px";

            setTimeout(() => {
                canvas.classList.remove('mofu-jumping');
                mouth.style.borderRadius = "0 0 10px 10px";
                mouth.style.height = "4px";
                isAnimating = false;
            }, 800);
        });

        // 3. Copy Reaction (Deep Breath/Focus)
        document.addEventListener('copy', () => {
            if (isAnimating) return;
            isAnimating = true;
            
            canvas.classList.add('mofu-breathing');
            showReaction("Got it! 📝", 1000);
            
            // Eye expansion during breath
            eyesCont.style.transform = "scale(1.2)";
            
            setTimeout(() => {
                canvas.classList.remove('mofu-breathing');
                eyesCont.style.transform = "scale(1)";
                isAnimating = false;
            }, 800);
        });
    })();
</script>