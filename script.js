const myContents = [
    {
        type: "cs2",
        title: "Pro player Gameplay on tournament",
        subtitle: "Channel: JoJos (Pro POV gameplay)",
        link: "https://www.youtube.com/watch?v=YqHEjCXx318",
        image: "https://img.youtube.com/vi/YqHEjCXx318/maxresdefault.jpg"
    },
    {
        type: "ut",
        title: "Old school Gameplay",
        subtitle: "Old School Gameplay (Jojos)",
        link: "https://www.youtube.com/watch?v=Z64lDruoAlw",
        image: "https://img.youtube.com/vi/Z64lDruoAlw/maxresdefault.jpg"
    }
];

// --- 1. FAUX CHARGEMENT DU TERMINAL (BOOTEUR SYSTEME) ---
// --- 1. FAUX CHARGEMENT AVEC BOUTON D'ENTRÉE (DÉBLOCAGE AUDIO AUTO) ---
function runSystemLoader() {
    const progress = document.getElementById("load-progress");
    const percentText = document.getElementById("load-percentage");
    const loaderScreen = document.getElementById("loader-screen");
    const mainContent = document.getElementById("main-content");
    const loaderContent = document.querySelector(".loader-content");
    
    let count = 0;
    const speed = 15; // Un poil plus rapide pour pas faire attendre

    const loadingInterval = setInterval(() => {
        count += Math.floor(Math.random() * 4) + 1;
        if(count > 100) count = 100;
        
        progress.style.width = count + "%";
        percentText.innerText = count + "%";
        
        if(count === 100) {
            clearInterval(loadingInterval);
            
            // Au lieu de fermer direct, on transforme le texte pour inviter à cliquer
            setTimeout(() => {
                percentText.style.display = "none";
                document.querySelector(".loader-bar-container").style.display = "none";
                
                // On crée le bouton d'entrée cyber
                const enterBtn = document.createElement("div");
                enterBtn.className = "cyber-enter-btn";
                enterBtn.innerText = "[ PRESS ANYWHERE TO ENTER SYSTEM ]";
                loaderContent.appendChild(enterBtn);
                
                // Dès qu'on clique N'IMPORTE OÙ sur l'écran de chargement
                loaderScreen.addEventListener('click', () => {
                    // 1. On initialise direct l'AudioContext sur CE clic (le navigateur adore ça)
                    window.myAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    playClickSound(); // Joue le petit bruit de validation GMod immédiat !
                    
                    // 2. On fait disparaître le loader
                    loaderScreen.style.opacity = "0";
                    loaderScreen.style.visibility = "hidden";
                    mainContent.classList.add("visible");
                    
                    // 3. On lance l'effet texte
                    runGlitchEffect();
                });
            }, 300);
        }
    }, speed);
}

// --- 2. RETRO SOUND DESIGN (ADOUCI & CORRIGÉ) ---
function playTechBeep() {
    try {
        if (!window.myAudioCtx) {
            window.myAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (window.myAudioCtx.state === 'suspended') {
            window.myAudioCtx.resume();
        }
        const oscillator = window.myAudioCtx.createOscillator();
        const gainNode = window.myAudioCtx.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(120, window.myAudioCtx.currentTime);
        
        // VOLUME AUGMENTÉ : Passé de 0.08 à 0.25 pour le survol
        gainNode.gain.setValueAtTime(0.25, window.myAudioCtx.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.00001, window.myAudioCtx.currentTime + 0.02);
        
        oscillator.connect(gainNode);
        gainNode.connect(window.myAudioCtx.destination);
        oscillator.start();
        oscillator.stop(window.myAudioCtx.currentTime + 0.02);
    } catch(e) {}
}

function playClickSound() {
    try {
        const oscillator = window.myAudioCtx.createOscillator();
        const gainNode = window.myAudioCtx.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(180, window.myAudioCtx.currentTime);
        
        // VOLUME AUGMENTÉ : Passé de 0.1 à 0.30 pour le clic
        gainNode.gain.setValueAtTime(0.30, window.myAudioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, window.myAudioCtx.currentTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(window.myAudioCtx.destination);
        oscillator.start();
        oscillator.stop(window.myAudioCtx.currentTime + 0.05);
    } catch(e) {}
}

function initAudioFX() {
    const targets = document.querySelectorAll('.link-btn, .content-card');
    targets.forEach(el => {
        el.addEventListener('mouseenter', playTechBeep);
        el.addEventListener('click', playClickSound);
    });
}

// --- 3. EFFET HOLOGRAMME 3D (TILT EFFET MAISON) ---
function init3DTilt() {
    const cards = document.querySelectorAll('.central-panel, .content-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardX = e.clientX - cardRect.left;
            const cardY = e.clientY - cardRect.top;
            
            const xRotation = -((cardY - cardRect.height / 2) / cardRect.height) * 15; // Max 15 degrés
            const yRotation = ((cardX - cardRect.width / 2) / cardRect.width) * 15;
            
            card.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    });
}

// --- 4. DIGITAL MATRIX RAIN ---
function initDigitalRain() {
    const canvas = document.getElementById("digital-rain");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const charSize = 14; const columns = canvas.width / charSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(3, 3, 6, 0.1)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 242, 254, 0.12)"; ctx.font = charSize + "px monospace";
        for (let i = 0; i < drops.length; i++) {
            const text = Math.random() > 0.5 ? "0" : "1";
            ctx.fillText(text, i * charSize, drops[i] * charSize);
            if (drops[i] * charSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 45);
}

// --- 5. GLITCH DE TEXTE ---
function runGlitchEffect() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const target = document.getElementById("username");
    if(!target) return;
    let iterations = 0; const originalValue = target.dataset.value;
    const interval = setInterval(() => {
        target.innerText = originalValue.split("").map((letter, index) => {
            if(index < iterations) return originalValue[index];
            return letters[Math.floor(Math.random() * letters.length)];
        }).join("");
        if(iterations >= originalValue.length) clearInterval(interval);
        iterations += 1 / 3;
    }, 30);
}

// --- 6. AFFICHAGE DES CARTES ---
function displayContent() {
    const grid = document.getElementById('content-grid');
    if(!grid) return; grid.innerHTML = ""; 
    myContents.forEach(item => {
        const card = document.createElement('a'); card.href = item.link; card.target = "_blank"; card.className = `content-card card-${item.type}`;
        card.innerHTML = `
            <div class="thumbnail-placeholder" style="background-image: url('${item.image}'); background-size: cover; background-position: center;">
                <span class="play-btn"><i class="fa-solid fa-play"></i></span>
            </div>
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.subtitle}</p>
            </div>`;
        grid.appendChild(card);
    });
}

// Lancement global au chargement
window.onload = function() {
    displayContent();
    runSystemLoader(); 
    initDigitalRain();
    initAudioFX();
    init3DTilt(); 
    checkServerStatus(); // <--- AJOUTE CETTE LIGNE ICI !
};
window.onresize = function() {
    const canvas = document.getElementById("digital-rain");
    if(canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
};
// --- 7. VÉRIFICATION AUTOMATIQUE DU STATUT DU SERVEUR ---
function checkServerStatus() {
    const statusBadge = document.getElementById("server-status");
    if (!statusBadge) return;

    // Remplace par ton IP publique et le PORT où tourne ton serveur (ex: 127.0.0.1:27015)
    // Pour un test local sur ton PC, tu peux mettre "http://localhost:PORT"
    const serverUrl = "http://TON_IP_PUBLIQUE:PORT_DE_TON_SERVEUR"; 

    // On tente de contacter le serveur avec un "fetch"
    // mode: 'no-cors' permet de tester si le port est ouvert sans bloquer la sécurité du navigateur
    fetch(serverUrl, { mode: 'no-cors', timeout: 3000 })
        .then(() => {
            // Si le serveur répond (même une erreur, cela veut dire que le PC/Port est ouvert)
            statusBadge.innerText = "ONLINE";
            statusBadge.classList.remove("offline");
        })
        .catch(() => {
            // Si le fetch échoue (PC éteint, port fermé, pas de connexion)
            statusBadge.innerText = "OFFLINE";
            statusBadge.classList.add("offline");
        });
}
