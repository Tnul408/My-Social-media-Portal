// ================= CONFIGURATION API =================
const YT_API_KEY = "AIzaSyBePk6S-cPENbXedT01dGS3QL1c6iy-oo0";         // Colle ta clé API Google Cloud ici
const YT_CHANNEL_ID = "UCi7MICOBujlvvPTxEb10FUQ"; // Colle l'ID de ta chaîne ici (ex: UC...)
// =====================================================

let allArchives = [];
let activeQuickTag = "all";
let currentSearchQuery = "";
// On charge les favoris sauvegardés dans le navigateur, ou un tableau vide si aucun
let favoriteIds = JSON.parse(localStorage.getItem("cs_archive_favorites")) || [];

const mainSearch = document.getElementById("main-search");
const clearSearchBtn = document.getElementById("clear-search");
const archiveGrid = document.getElementById("archive-grid");
const resultsCount = document.getElementById("results-count");

function generateTagsFromTitle(title) {
    const tags = [];
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("2013")) tags.push("2013");
    if (lowerTitle.includes("2014")) tags.push("2014");
    if (lowerTitle.includes("pov")) tags.push("POV");
    if (lowerTitle.includes("katowice")) tags.push("EMS Katowice");

    if (lowerTitle.includes("dust2") || lowerTitle.includes("dust 2") || lowerTitle.includes("dust ii")) tags.push("de_dust2");
    if (lowerTitle.includes("inferno")) tags.push("de_inferno");
    if (lowerTitle.includes("mirage")) tags.push("de_mirage");
    if (lowerTitle.includes("nuke")) tags.push("de_nuke");
    if (lowerTitle.includes("train")) tags.push("de_train");
    if (lowerTitle.includes("cache")) tags.push("de_cache");

    const teams = ["nip", "fnatic", "virtus", "ldlc", "titan", "verygames", "navi", "ibuypower"];
    teams.forEach(team => {
        if (lowerTitle.includes(team)) tags.push(team.charAt(0).toUpperCase() + team.slice(1));
    });
    // Détection de l'étape du tournoi (Gère le français et l'anglais)
    if (lowerTitle.includes("grand final") || lowerTitle.includes(" finale") || lowerTitle.includes(" grand-final")) {
        tags.push("stage_final");
    } else if (lowerTitle.includes("semi") || lowerTitle.includes("demi")) {
        tags.push("stage_semi");
    } else if (lowerTitle.includes("quarter") || lowerTitle.includes("quart")) {
        tags.push("stage_quarter");
    } else if (lowerTitle.includes("8th") || lowerTitle.includes("8eme") || lowerTitle.includes("8ème") || lowerTitle.includes("ro16") || lowerTitle.includes("group")) {
        tags.push("stage_8th");
    }

    return tags;
}

async function fetchYouTubeArchives() {
    if (YT_API_KEY === "TA_CLE_API_YOUTUBE" || YT_CHANNEL_ID === "ID_DE_TA_CHAINE_YOUTUBE") {
        resultsCount.textContent = "[Erreur] : Veuillez configurer l'API Key et le Channel ID.";
        return;
    }

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${YT_CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`);
        const data = await response.json();

        if (!data.items) {
            resultsCount.textContent = "Aucune vidéo trouvée ou quota API dépassé.";
            return;
        }

       // Étape 2 : On transforme les données de YouTube pour les adapter à notre site
        allArchives = data.items.map(item => {
            const rawTitle = item.snippet.title;
            const rawDate = item.snippet.publishedAt; 
            
            // 1. DÉTECTION DE LA VRAIE DATE DU MATCH (Format AAAA-MM-JJ dans le titre)
            // Cette regex cherche 4 chiffres, un tiret, 2 chiffres, un tiret, 2 chiffres (ex: 2014-03-16)
            const dateMatch = rawTitle.match(/(\d{4}-\d{2}-\d{2})/);
            let matchDate = rawDate.split('T')[0]; // Par défaut, date d'upload si rien n'est trouvé
            let cleanTitle = rawTitle;

            if (dateMatch) {
                matchDate = dateMatch[1]; // On récupère la vraie date du match (ex: "2014-03-16")
                cleanTitle = cleanTitle.replace(dateMatch[0], "").trim(); // On l'enlève du titre pour faire propre
            }

            // 2. LOGIQUE ANTI-SPOILER (Déjà en place)
            let spoilerText = "Non spécifié";
            const spoilerMatch = cleanTitle.match(/\[(.*?)\]/);
            if (spoilerMatch) {
                spoilerText = spoilerMatch[1];
                cleanTitle = cleanTitle.replace(spoilerMatch[0], "").trim();
            }

            // Nettoyage des doubles espaces ou tirets isolés qui traînent après avoir enlevé la date
            cleanTitle = cleanTitle.replace(/^[\s\-_|]+|[\s\-_|]+$/g, "").trim();

            let tournamentName = "CS:GO Archive";
            if (rawTitle.toLowerCase().includes("katowice")) {
                tournamentName = "EMS Katowice 2014";
            } else if (rawTitle.toLowerCase().includes("cologne")) {
                tournamentName = "Cologne 2014";
            } else if (rawTitle.toLowerCase().includes("winter")) {
                tournamentName = "DreamHack Winter 2013";
            }

            return {
                id: item.id.videoId,
                title: cleanTitle,
                tournament: tournamentName,
                date: matchDate, // C'est maintenant la vraie date du match !
                tags: generateTagsFromTitle(rawTitle),
                spoiler: spoilerText
            };
        });

        filterArchives();

    } catch (error) {
        console.error("Erreur API YouTube:", error);
        resultsCount.textContent = "Impossible de charger les archives depuis YouTube.";
    }
}

function renderArchives(archives) {
    archiveGrid.innerHTML = "";
    
    if (archives.length === 0) {
        resultsCount.textContent = "Aucune archive trouvée pour cette sélection.";
        return;
    }
    
    resultsCount.textContent = `${archives.length} archive(s) trouvée(s)`;

    archives.forEach(item => {
        const card = document.createElement("div"); // Changé en div pour pas que le clic sur l'étoile ouvre YouTube
        card.className = "archive-item";

        const thumbnailUrl = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
        const isFav = favoriteIds.includes(item.id);

        const tagsHTML = item.tags.map(tag => {
            let displayTag = tag;
            if (tag === "de_dust2") displayTag = "Dust II";
            else if (tag.startsWith("de_")) displayTag = tag.replace("de_", "").charAt(0).toUpperCase() + tag.replace("de_", "").slice(1);
            return `<span class="inline-tag">${displayTag}</span>`;
        }).join("");

        card.innerHTML = `
            <div class="thumbnail-box">
                <img src="${thumbnailUrl}" alt="${item.title}" loading="lazy" onclick="window.open('https://www.youtube.com/watch?v=${item.id}', '_blank')">
                <button class="fav-btn ${isFav ? 'is-favorite' : ''}" onclick="toggleFavorite('${item.id}', this)" title="Ajouter aux favoris">
                    <i class="fa-${isFav ? 'solid' : 'regular'} fa-star"></i>
                </button>
            </div>
            <div class="item-meta">
                <h3 onclick="window.open('https://www.youtube.com/watch?v=${item.id}', '_blank')" style="cursor:pointer;">${item.title}</h3>
                <div class="item-details">${item.tournament} | ${item.date}</div>
                <div class="tags-box">${tagsHTML}</div>
                
                <div class="spoiler-box">
                    <span class="spoiler-label">Score / Vainqueur :</span>
                    <span class="spoiler-content" onclick="revealSpoiler(this)" title="Cliquez pour révéler">${item.spoiler}</span>
                </div>
            </div>
        `;
        archiveGrid.appendChild(card);
    });
}

// Gestion du clic sur l'étoile
function toggleFavorite(id, btnElement) {
    const index = favoriteIds.indexOf(id);
    const icon = btnElement.querySelector('i');
    
    if (index === -1) {
        favoriteIds.push(id);
        btnElement.classList.add('is-favorite');
        icon.className = "fa-solid fa-star";
    } else {
        favoriteIds.splice(index, 1);
        btnElement.classList.remove('is-favorite');
        icon.className = "fa-regular fa-star";
    }
    
    // Sauvegarde définitive dans le navigateur
    localStorage.setItem("cs_archive_favorites", JSON.stringify(favoriteIds));

    // Si on est actuellement dans l'onglet "Mes Favoris", on rafraîchit la liste en temps réel
    if (activeQuickTag === "favorites") {
        filterArchives();
    }
}

// Révèle le spoiler définitivement au clic
function revealSpoiler(element) {
    element.classList.toggle("revealed");
}

// 4. Moteur de filtrage global croisé et de tri
// 4. Moteur de filtrage global croisé et de tri
// 4. Moteur de filtrage global croisé et de tri
function filterArchives() {
    const selectedTournament = document.getElementById("filter-tournament").value;
    const selectedMap = document.getElementById("filter-map").value;
    const selectedSort = document.getElementById("filter-sort").value;
    const selectedStage = document.getElementById("filter-stage").value;

    // ETAPE A : On filtre les vidéos selon TOUS les critères
    let filtered = allArchives.filter(item => {
        // 1. Barre de recherche textuelle
        const matchesSearch = 
            item.title.toLowerCase().includes(currentSearchQuery) ||
            item.tags.some(tag => tag.toLowerCase().includes(currentSearchQuery));

        // 2. Boutons de filtres rapides
        let matchesQuickTag = false;
        if (activeQuickTag === "all") {
            matchesQuickTag = true;
        } else if (activeQuickTag === "favorites") {
            matchesQuickTag = favoriteIds.includes(item.id);
        } else if (activeQuickTag === "2014" || activeQuickTag === "2013") {
            matchesQuickTag = item.tags.includes(activeQuickTag);
        } else if (activeQuickTag.toLowerCase() === "pov") {
            matchesQuickTag = item.tags.some(tag => tag.toLowerCase() === "pov");
        } else {
            matchesQuickTag = item.tags.some(tag => tag.toLowerCase().trim() === activeQuickTag.toLowerCase().trim());
        }

        // 3. Menu déroulant Tournois
        let matchesTournament = (selectedTournament === "all") || (item.tournament === selectedTournament);

        // 4. Menu déroulant Maps
        let matchesMap = (selectedMap === "all") || item.tags.includes(selectedMap);

        // 5. Menu déroulant Étape du tournoi
        let matchesStage = false;
        if (selectedStage === "all") {
            matchesStage = true;
        } else {
            matchesStage = item.tags.includes(`stage_${selectedStage}`);
        }

        return matchesSearch && matchesQuickTag && matchesTournament && matchesMap && matchesStage;
    });

    // ETAPE B : On trie le résultat final par date ou alphabet (Correction du bug ici)
    if (selectedSort === "asc") {
        filtered.sort((a, b) => a.date.localeCompare(b.date)); // Du plus vieux au plus récent
    } else if (selectedSort === "desc") {
        filtered.sort((a, b) => b.date.localeCompare(a.date)); // Du plus récent au plus vieux
    } else if (selectedSort === "alpha") {
        filtered.sort((a, b) => a.title.localeCompare(b.title)); // Ordre alphabétique
    }

    // ETAPE C : On envoie le tableau final à l'affichage
    renderArchives(filtered);
}

function filterByQuickTag(tagValue) {
    activeQuickTag = tagValue;
    document.querySelectorAll(".filter-tag").forEach(btn => btn.classList.remove("active"));

    const clickedBtn = Array.from(document.querySelectorAll(".filter-tag")).find(btn => {
        const btnText = btn.textContent.trim().toLowerCase();
        if (tagValue === "all" && btnText === "tous") return true;
        if (tagValue === "favorites" && btnText.includes("favoris")) return true;
        if (tagValue.toLowerCase() === "pov" && btnText === "povs") return true;
        return btnText === tagValue.toLowerCase();
    });
    
    if (clickedBtn) clickedBtn.classList.add("active");
    filterArchives();
}

function handleAdvancedFilter() { filterArchives(); }

mainSearch.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value.toLowerCase().trim();
    clearSearchBtn.style.display = currentSearchQuery.length > 0 ? "block" : "none";
    filterArchives();
});

clearSearchBtn.addEventListener("click", () => {
    mainSearch.value = "";
    currentSearchQuery = "";
    clearSearchBtn.style.display = "none";
    mainSearch.focus();
    filterArchives();
});

document.addEventListener("DOMContentLoaded", () => { fetchYouTubeArchives(); });
// Fonction pour réinitialiser globalement l'interface et les filtres
function resetAllFilters() {
    // 1. Remise à zéro des variables de filtres
    currentSearchQuery = "";
    activeQuickTag = "all";

    // 2. Remise à zéro des éléments du DOM (Inputs et Selects)
    mainSearch.value = "";
    clearSearchBtn.style.display = "none";
    
    document.getElementById("filter-tournament").value = "all";
    document.getElementById("filter-map").value = "all";
    document.getElementById("filter-stage").value = "all";
    document.getElementById("filter-sort").value = "desc"; // Revient au tri par défaut

    // 3. Remise à zéro visuelle des boutons rapides (Active "Tous")
    document.querySelectorAll(".filter-tag").forEach(btn => btn.classList.remove("active"));
    const allBtn = Array.from(document.querySelectorAll(".filter-tag")).find(btn => btn.textContent.trim().toLowerCase() === "tous");
    if (allBtn) allBtn.classList.add("active");

    // 4. On relance le moteur de filtrage global
    filterArchives();
}
