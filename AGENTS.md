# Règles

- Si l'utilisateur demande de revenir à la version originale, restaurer TOUS les fichiers depuis le backup : `D:\platform APC IMAGES\ver 10077 save historique sur supabase`
- Copier `*.html` → `D:\platform APC\`
- Copier `js\*.js` → `D:\platform APC\js\`
- **Quand tu mets à jour un fichier, AJOUTE seulement à la fin. Ne modifie JAMAIS le contenu existant (sauf si le contenu existant a un bug ou que je te le demande explicitement).**
- **`mjr2`** : mettre à jour `AGENTS.md` et `RAPPORT_PLATEFORME.md` en AJOUTANT les modifications de la session en cours à la fin. Ne JAMAIS modifier le contenu existant.
- **`mjr3`** : APRÈS chaque correction/modification, incrémenter `APP_VERSION` dans `js/shared.v2.js` (ex: 1.1.1 → 1.1.2) pour que la bannière "APC Algérie GÉNÉRATION 3 a été mise à jour" s'affiche.
- **`mjr4` (modèles vs code)** : une demande de changement de MODÈLES ne touche QUE la configuration des modèles — `MODEL_MAP`, `PROVIDERS`, `FALLBACK_ORDER`, `groqModels`, clés i18n des modèles, blocs radio des pages HTML. JAMAIS le code applicatif (prompts, parsing, logique, timeouts, UI). Inversement, un changement de CODE ne modifie jamais les modèles.

# Résumé du projet

## Système de compatibilité emoji → Font Awesome

### Problème
- Windows 7 n'a pas la police `Segoe UI Emoji` → les emoji s'affichent en carrés
- Windows 10/11, Mac, Android, iOS → emoji natifs parfaits

### Solution : `js/compat.js`
Détection automatique + fallback Font Awesome à l'exécution.

**Fonctionnement :**
1. Au chargement, détecte si polices emoji existent via `canvas.measureText`
2. Si absentes → mode compat : tous les emoji remplacés par des icônes FA
3. Mapping ~60 emoji → FA (✅→fa-check, 🤖→fa-robot, etc.)
4. Option manuelle dans **Paramètres → Mode icônes** (Auto/Moderne/Compatible)

### Bannière "Mode de compatibilité activé"
- S'affiche UNE SEULE FOIS sur le premier chargement (clé `apc_banner_v2` dans localStorage)
- Marquée automatiquement, pas besoin de cliquer
- Ne réapparaît pas après navigation entre pages

### Cache-busting
- Toutes les pages : `src="js/compat.js?v=2"`

## Suppression des URL dans la barre d'état
- Tous les `<a href="page.html">` (nav + cartes d'accueil) → `<a onclick="goTo('page.html')">` sans `href`
- Plus d'URL visible au survol dans la barre du navigateur

## Animation de déconnexion (`signOut`)
- Son original retrouvé (3s → revert)
- Animation : écran noir + message "À bientôt" + barre défilante drapeau algérien → redirection login.html après 3s

## Fichier son `sounds/startup.mp3`
- Extrait de `mp3/Neural Gate Start.mp3` (0s → 10s)
- Était intégré dans `loading.html` avec fondu progressif → retiré sur demande

## `loading.html` — Animation de démarrage
3 écrans séquentiels :
1. **S1** Graphe cardio SVG + texte "Assistant APC Algérie G3" (couleurs drapeau algérien)
2. **S2** Logo MFEP + nom ministère + sous-titre
3. **S3** "Chargement..."
- Transitions CSS (opacity, scale, cover)
- Durée variable selon mobile/desktop
- Redirige vers `index.html` à la fin

## Restauration
- Backup : `D:\platform APC IMAGES\ver 10077 save historique sur supabase`
- Contient la version originale complète (`.html` + `js/*.js`)

## Notes techniques
- SPA-like avec `goTo(url)` dans `shared.v2.js`
- `setLang()` utilise `innerHTML` si compat actif
- `assistant.js` helper `_e(t)` pour compat
- `signOut()` dans `supabase.js` avec animation 3s

## Session 02/07/2026 — Nettoyage UI, page À propos, vocal, guide

### Bug bouton "Continuer" (pause)
- **Cause :** `_createOverlay()` créait des overlays en doublon → multiples `id="__breakOverlay"` empilés
- **Fix :** Ajout de `if (document.getElementById(id)) existing.remove()` dans `_createOverlay()` → `shared.v2.js`

### Page À propos — Refonte du contenu (FR/AR/EN)
- Objectifs réduits de 10 à 6, plus percutants
- Rôles ajoutés aux membres du groupe (conception, contribution pédagogique)
- Nouvelles sections : Clause de responsabilité, Version 3.0, Mentions légales
- Nom harmonisé : "Mohamed Rostom Aziz" dans les 3 langues

### Suppression de la signature du header
- Retiré `<div class="signature" data-i18n="headerSig">` de 6 fichiers HTML
- `headerSig` vidé dans l'objet T (FR/AR/EN) de `shared.v2.js` et `shared.js`
- Footer allégé : nom personnel retiré, remplacé par "APC Algérie GÉNÉRATION 3 — Formateur 2.0"
- Copyright discret injecté par JS en 3 langues

### Guide (aide.html) — Mention reconnaissance vocale
- Ajout d'un point "🎙️ Utilisez la reconnaissance vocale..." dans les 3 langues

### Fix changement de langue
- `assistant.js` : textes vocaux hardcodés → `t('voiceListening')`, `t('voiceNotSupported')`, `t('voiceError')`
- `translateVoiceUI()` ajoutée pour mettre à jour l'interface vocale instantanément
- Appelée depuis `setLang()` dans `shared.v2.js`
- `renderGuide()` ajouté dans `setLang()` pour que le guide change de langue sans refresh

### Glossaire APC — Contexte système Assistant IA
- `js/apc-glossary.js` créé : 35 termes APC officiels (FR/AR/EN) — RMC, PF, PE, RES, ROPM, OC, OS, Cp, Cg, etc.
- Chargé dans `assistant.html` avant `assistant.js`
- Injecté dans `sysPrompt` avec instruction explicite d'utiliser les définitions officielles
- L'Assistant IA répond désormais avec la terminologie officielle algérienne de l'APC
- `APP_VERSION` 1.0.1 → 1.1.0 (bannière mise à jour)
- `AGENTS.md` : ajout règle `mjr2` (`RAPPORT_PLATEFORME.md` mis à jour aussi)

## Session 02/07/2026 — Système Challenges (Gamification)

### Nouveaux fichiers
- `challenges.html` — Nouvelle page complète : création depuis Assistant IA, création manuelle, éditeur, liste des challenges publiés, mode apprenant
- `js/challenges.js` — Logique complète (~950 lignes) : génération IA des challenges, équipes, rounds/questions, distribution participants, classement en direct

### Nouvelles tables Supabase (dans supabase-schema.sql)
- `challenges` — Définition des challenges (type, thème, config, statut)
- `challenge_teams` — Équipes avec nom, couleur
- `challenge_participants` — Participants (pattern quiz_access_codes) avec team_id, score
- `challenge_rounds` — Épreuves avec questions QCM
- `challenge_submissions` — Soumissions et scores

### Traductions (objet T : FR/AR/EN)
- `tab_challenge` dans la navigation
- ~80 clés de traduction pour toute l'interface (challenge assistant, manuel, config, distribution, classement, mode apprenant)

### Navigation
- Lien `challenges.html` ajouté dans le drawer et nav-links de TOUS les HTML (10 pages)
- Bouton "🎮 Challenge" ajouté dans `assistant.html` à côté de "Générer Quiz"

### Session 02/07/2026 (suite) — Fix historique Assistant IA + SQL
- **Bouton ☰ mobile** ajouté dans la toolbar de `assistant.html` pour ouvrir l'historique sur ≤768px
- **Overlay** semi-transparent pour fermer la sidebar mobile en cliquant à côté
- **CSS overlay** déplacé hors du media query pour ne pas déformer le layout desktop (bug critique)
- **Table `ai_conversations`** ajoutée dans `supabase-schema.sql` avec RLS (manquait — l'upsert échouait silencieusement)
- **Erreurs Supabase** visibles dans la console (`.catch(function(){})` → `console.warn`)
- **Choix du nombre d'équipes** : config modal Assistant IA + dropdown manuel (2-5 équipes)

### Fonctionnalités
- **Création depuis Assistant IA :** IA analyse la conversation → génère équipes, rounds, questions QCM automatiquement
- **Création manuelle :** choix du type (groupes/individuel/tournoi), nombre d'équipes, thème
- **Éditeur :** modification des équipes, rounds, questions ; régénération IA par round
- **Distribution :** import CSV, ajout manuel, répartition IA dans les équipes (pattern identique à quiz_access_codes)
- **Classement en direct :** barres de score, médailles 🥇🥈🥉
- **Mode apprenant :** entrée par code, passage des rounds, feedback immédiat, score cumulé
- **Règle de test :** Avant chaque retour à l'utilisateur, tester TOUTES les fonctionnalités existantes et nouvelles pour vérifier qu'elles fonctionnent (pas de régression, pas de bugs).

## Session 02/07/2026 (suite) — Distribution quiz-like + Fix création + Règle test

### Distribution challenge alignée sur quiz
- Modal de distribution repensée : import CSV/XLSX, téléchargement modèle CSV+XLSX, file picker
- Ajout manuel avec Spécialité + Groupe (comme quiz)
- Filtres par Spécialité et Groupe dans le tableau
- Tableau complet : N°, Nom FR, AR, Email, Spécialité, Groupe, Équipe, Code, QR, Statut, Actions
- QR code via api.qrserver.com pour chaque participant
- Bouton "📧 Envoyer tout" pour EmailJS
- Compteur filtré/total
- Nouvelles clés de traduction (FR/AR/EN) : specialty, group, allSpecialties, allGroups, sendAll, importBtn, emailMsg, yourCode, yourLink

### Bug "Créer le challenge" fixé
- `createManualChallenge()` : `colors` → `teamColors` (variable non définie)

### Refactoring distribution
- Nouvelle variable `challengeDistribCurrentId` au lieu de `currentChallengeId`
- `challengeDistribEditTeam`, `challengeDistribAutoAssignTeams` utilisent `challengeDistribCurrentId`
- `challengeDistribDeleteRow` appelle `challengeUpdateFilters()`
- `challengeDistribSendAll` : `d` chargé depuis le localStorage avant usage

### Robustesse JSON AI
- Gestion des blocs markdown ```json ... ``` dans la réponse
- Nettoyage des virgules traînantes dans les tableaux/objets avant `JSON.parse()`

## Session 02/07/2026 (fin) — Système de Gamification complet

### Nouvelle section "Système de Gamification" (Section 5)
- `challenges.html` : nouvelle card avec `id="gamificationCard"` et `renderGamificationDashboard()`
- Dashboard en grille 2 colonnes : XP/Niveau, Streak/Stats, Badges, Missions quotidiennes, Hall of Fame
- Types de challenges affichés avec badges visuels
- Récompenses listées

### Système XP / Niveaux
- 8 niveaux : Débutant (0) → Apprenti (100) → Intermédiaire (250) → Confirmé (500) → Avancé (1000) → Expert (2000) → Maître (4000) → Légende (8000)
- Barre de progression XP avec % et XP restant
- Notification à chaque passage de niveau

### Système de Badges (14 badges)
- Déblocage automatique selon conditions (10 challenges, 5 victoires, streaks 7j/30j, etc.)
- Affichage dans une grille avec icônes, verrouillés/déverrouillés
- Notification toast à chaque nouveau badge

### Système de Séries (Streaks)
- Compteur quotidien avec détection de date
- Meilleure série conservée
- Reset si jour sauté

### Missions quotidiennes
- Suivi des complétions (1 challenge / 3 challenges / série de connexion)
- Reset automatique chaque jour

### Hall of Fame
- Top 10 des meilleurs joueurs avec XP et date
- Stocké dans `localStorage.gamification_data`

### Traductions
- ~70 nouvelles clés FR/AR/EN ajoutées dans `shared.v2.js`
- Toute l'interface gamification traduite

### Correction JSON AI
- Extraction depuis blocs markdown + nettoyage virgules traînantes

## Session 03/07/2026 — Jeu Défense Orbitale (standalone) + Voix TTS + Comics

### Nouveaux fichiers
- `challenge-game.html` — Mini-jeu standalone "Défense Orbitale" avec Canvas (étoiles, Terre améliorée, Lune, météorite, bouclier hexagonique, satellites), Web Audio API, 3 langues, 7 questions par défaut APC
- `comic-intro.svg` — Image bande dessinée : alerte impact, Terre menacée, bulles de dialogue
- `comic-victory.svg` — Image bande dessinée : Terre sauve, bouclier brillant, météorite détruite
- `comic-defeat.svg` — Image bande dessinée : Terre impactée, cratère, fissures, fumée

### Navigation
- Onglet "🚀 Jeu Défense" ajouté dans la barre de navigation sur les 10 pages HTML

### Voix TTS (Web Speech API)
- `speakIntro()` lit le texte d'intro dans la langue courante (FR/AR/EN)
- Sélection voix féminine prioritaire (Zira, Sara, Amelie, Hortense, Samantha, Karen, Google, female)
- Fallback : première voix disponible de la bonne langue
- Débit `rate=0.85`, pitch neutre
- **Audio ducking** : `duckMusic(0.05)` baisse la musique à 5% pendant la parole, `restoreMusic()` la remonte progressivement

### Images comics
- 3 images SVG insérées dans les overlays intro/win/lose avec `opacity:0.18` en arrière-plan
- Visibles semi-transparentes derrière le texte et les stats

### Intégration Challenges → Jeu
- `challenge-game.html` : menu avec sélecteur dropdown listant tous les challenges localStorage
- Info contextuelle affichée : thème, spécialité, nombre de questions
- `playChallengeInGame(id)` dans `challenges.js` : sauvegarde `challengeGameCurrentId` + `challengeGameLang` → navigation vers le jeu
- Bouton 🚀 Jouer ajouté dans chaque carte de challenge publié + zone de publication
- Auto-sélection du challenge au chargement du jeu si `challengeGameCurrentId` présent

### Qualité
- Terre améliorée : océan 4 stops, 11 continents, ombrage 3D, nuages animés, 28 villes lumineuses, atmosphère 4 anneaux, fissures
- Particules, shockwaves, étoiles filantes, secousses caméra
- Intro cinématique avec briefing traduit
- `applyI18N()` mise à jour pour le sélecteur de challenge

## Session 03/07/2026 — Fix Pause bien-être (reset inter-jour)

### Bug
- `break_total` en localStorage n'était jamais réinitialisé entre les jours
- Un utilisateur qui travaillait hier (ex: 1h40) et se reconnectait aujourd'hui voyait la notification "Pause bien-être" immédiatement

### Cause
- `checkBreakReminder()` dans `shared.v2.js` ligne 123 : `if (elapsed < 600000) totalMs += elapsed;` → si gap > 10min, le temps n'était pas ajouté, mais `totalMs` restait inchangé (avec le cumul des jours précédents)

### Fix
- Ajout d'un `else { totalMs = 0; }` → quand l'utilisateur revient après une vraie pause >10min, le compteur est remis à zéro pour la nouvelle session

## Session 03/07/2026 — Affichage compétences visées dans liste conversations Challenges

### Problème
- Dans `challenges.html` Section 1 (Créer depuis l'Assistant IA), la liste des conversations n'affichait pas les compétences visées
- L'utilisateur ne pouvait pas savoir quelle compétence chaque conversation ciblait sans cliquer dessus
- La fonction `_extractCompetence()` avait des patterns trop imprécis et ne filtrait pas la valeur par défaut "—"

### Fix
- `loadChallengeAssistantSection()` dans `challenges.js` : extraction de la compétence pour chaque conversation + affichage en badge `🎯 compétence` dans la ligne date
- `_extractCompetence()` : ajout de patterns avec préfixe `- ` pour correspondre au format exact du prompt généré, ajout du filtre `val !== '—'` pour ignorer les champs vides
- `_extractCompetence()` : ajout de fallback patterns pour conversations libres (hors générateur) : extraction depuis "sur la compétence X", "thème : X", "crée un challenge sur X", etc. (FR/AR/EN)
- `_extractCompetences()` : nouvelle fonction qui retourne un tableau de TOUTES les compétences distinctes trouvées dans une conversation (au lieu d'une seule)
- `loadChallengeAssistantSection()` : affiche désormais TOUS les badges compétence par conversation
- `openChallengeFromConversation()` / `openChallengeGeneratorFromAssistant()` : si plusieurs compétences détectées → affiche un sélecteur pour choisir laquelle utiliser pour le challenge
- Nouvelles clés de traduction : `challengeSelectCompetence` (FR/AR/EN)
- `_extractCompetences()` et `_extractCompetence()` déplacées de `challenges.js` vers `shared.v2.js` (accessibles depuis toutes les pages)
- `quiz.html` Section 2 : affichage des badges compétences + sélecteur de compétence si plusieurs détectées
- `renderChallengePublishArea()` : ajout du bouton "📤 Distribuer par email" ouvrant `openChallengeDistribModal()` (comme dans la liste des challenges publiés)

## Session 03/07/2026 — Jeu Défense Orbitale autonome + Distribution + Son + PDF + i18n

### Indépendance totale jeu/challenges
- Suppression du sélecteur de challenge legacy (`challengeSelector`, `legacyChallengePanel`, `toggleLegacyChallenge`)
- Suppression des fonctions `populateChallengeSelector()`, `showChallengeInfo()`, `getSelectedChallengeId()`
- Suppression du code auto-sélection (`challengeGameCurrentId`, paramètre `?challenge=`)
- Suppression des i18n keys `btnPlay`, `btnQuitGame`, `toggleLegacyChallenge`, `lblSelectChallenge`
- `startRun()` ne dépend plus du sélecteur

### Synchronisation compétences
- `_extractCompetences()` dans le jeu remplacé par la version exacte de `shared.v2.js` (patterns primaires + fallback + gammaData)
- Les compétences listées sont désormais identiques Quiz/Challenge/Jeu

### Son
- `Audio.sfx()` auto-initialise le contexte audio (`init()`) si `ctx` est null
- Le son fonctionne dès le premier clic sans `ensureAudio()` préalable

### Publication + Distribution
- Nouveau bouton `📤 Publier le jeu` visible en permanence dans le panneau de config
- `publishGame()` : génération IA → sauvegarde → QR + PIN → modale de distribution
- `shared.v2.js` chargé avant `challenges.js` pour fournir les globaux (`t()`, `showToast()`, `_createOverlay()`, `esc()`)
- Liens QR copiés pointent vers `challenge-game.html?challenge_pin=PIN`
- PIN auto-load depuis l'URL `?challenge_pin=` au chargement

### PDF + Téléchargements
- Bouton `📄 PDF` : ouvre une page imprimable avec QR + PIN + lien + bouton Imprimer/PDF
- Bouton `⬇ QR` : télécharge le QR code en PNG (400x400)
- Bouton `⬇ PIN` : télécharge un fichier `.txt` avec le PIN et le lien

### En-tête jeu
- `menuEyebrow` : "APC Algérie GÉNÉRATION 3" (FR/AR), "APC Algeria GENERATION 3" (EN)
- `gameTitle` : "🚀 DÉFENSE ORBITALE" (FR), "🚀 الدفاع المداري" (AR), "🚀 ORBITAL DEFENSE" (EN)
- `gameSub` : traductions FR/AR/EN complètes

### Fix langue
- Suppression de la clé `challengeGameLang` (prioritaire sur `lang`)
- Le jeu utilise désormais la même clé `lang` que le reste de la plateforme

## Session 03/07/2026 — Explication difficultés + mjr2

### Question utilisateur
- Demande : expliquer la différence entre Facile/Moyen/Difficile dans le jeu
- Réponse : le niveau filtre les questions par `diff`, modifie la vitesse de la météorite, le score/XP gagné et les dégâts/gains du bouclier

## Session 03/07/2026 — Fix mobile responsive jeu Défense Orbitale

### Problèmes identifiés
- Délai 300ms au tap sur mobile (pas de `touch-action`)
- Boutons trop petits pour le tactile (< 44px)
- Menu panel débordait sur écrans < 360px
- Panneau questions trop grand sur petit écran
- HUD (barre bouclier, scores) illisible sur mobile

### Corrections
- `touch-action:manipulation` + `-webkit-tap-highlight-color:transparent` sur `<body>`
- `min-height:44px` sur tous les `.btn` et `.choice-btn` (norme tactile)
- `@media(max-width:400px)` : `.menu-panel` padding réduit, `min-width:0`
- `@media(max-width:400px)` : `#qPanel` padding réduit, `#qText` font-size 15px
- `@media(max-width:400px)` : `.hud-value` 14px, `.hud-label` 7px, `.shield-bar-wrap` 100px

## Session 04/07/2026 — Fix Terre cachée + bulles comics + cross-device jeu

### Fix Terre cachée par les questions sur mobile
- **Problème :** `ey=H*0.92` plaçait la Terre trop bas → cachée par `#qPanel` sur smartphone
- **Fix :** `ey=H*(W<600?0.55:0.92)` → sur mobile (<600px), Terre centrée à 55% de hauteur, visible au-dessus du panneau

### Fix bulles comics sur portrait
- **Problème :** `object-fit:cover` cropait les bulles des BD SVG (800×500 paysage) sur écran portrait
- **Fix :** `@media (max-aspect-ratio: 800/500){.cine-comic-bg{object-position:left center;}}` → l'image reste en cover mais cadrée à gauche pour montrer les bulles

### Fix favicon 404
- Création `favicon.ico` (SVG) dans la racine pour stopper l'erreur 404

### Cross-device : jeu publiable → l'apprenant joue direct
- **Problème :** `publishGame()` stockait les données (compétence, difficulté, questions) uniquement dans `localStorage` du formateur → l'apprenant ouvrant le lien QR voyait les champs vides
- **Fix URL params :** le lien généré (QR/boutons copie/download/PDF/distrib) inclut `&comp=...&diff=N&count=N` dans l'URL
- **Helper `_gameLink(d)` :** fonction centralisée pour générer le lien complet avec PIN + config
- **Auto-start apprenant :** à l'ouverture, si les params `challenge_pin`, `comp`, `diff`, `count` sont dans l'URL → le jeu démarre DIRECTEMENT via `generateAndRunGame()`, l'apprenant ne voit pas le menu ni la config
- **Bug `raw` fixé :** `btnDistribChallenge` utilisait `JSON.parse(raw)` avec `raw` non défini → référence error attrapée silencieusement

### Bouton Envoyer individuel dans distribution challenge
- **Problème :** le modal de distribution (tableau des participants) n'avait qu'un bouton "Envoyer tout" ; impossible d'envoyer à un seul participant
- **Fix tableau :** colonne Actions amendée : si email valide et statut ≠ 'sent', un bouton 📧 par participant s'affiche avant le bouton 🗑
- **Fix fonction :** `challengeDistribSendOne(idx)` créée (après `challengeDistribSendAll`) : valide participant, vérifie EmailJS, envoie via `emailjs.send()`, met à jour le statut et la table, affiche toast de confirmation

### Terre petite en haut + Lune visible sur smartphone
- **Problème :** `ey=H*(W<600?0.55:0.92), er=min(W,H)*0.42` → sur mobile la Terre prenait 42% de l'écran au milieu, cachant une partie du jeu et de la Lune
- **Fix :** `isMobile=W<600` → `ey=H*0.22` (1/5 haut), `er=min(W,H)*0.26` (1/4 taille), `mY=ey+sin(mA)*(er*0.8)` (orbite Lune circulaire sans offset haut). La Terre devient un petit astre lointain en haut, la Lune orbite visiblement, la météorite arrive du coin supérieur droit, et le panneau de questions reste en bas sans obstruction.

### PIN : l'apprenant doit taper le code manuellement (plus d'auto-fill URL)
- **Problème :** le champ PIN était pré-rempli via `pi.value=aPin` depuis l'URL → l'apprenant n'avait pas à taper le code, ce qui contournait l'authentification
- **Fix :** suppression de `pi.value=aPin` → le champ PIN reste vide ; l'apprenant doit taper le code reçu du formateur. Si le PIN tapé ne correspond pas à celui dans l'URL → message d'erreur. Le champ est juste surligné (cyan) pour indiquer où taper.

### Terre très petite sur smartphone (vue lointaine)
- **Problème :** `er=min(W,H)*0.34` était trop gros → la Terre prenait trop de place
- **Fix :** `er=min(W,H)*0.20, ey=H*0.50` → la Terre est un petit astre lointain au milieu de l'écran, dégageant la vue pour la météorite et le panneau de questions

### Images haute qualité (remplacement dessins Canvas)
- **Problème :** la Terre, Lune, météorite et satellites étaient dessinés procéduralement en Canvas (gradients + ellipses simples) → aspect basique
- **Fix :** création de 4 SVG haute qualité dans `img/` :
  - `img/earth.svg` : océan dégradé, continents détaillés (Amériques, Europe, Afrique, Asie, Océanie), nuages, villes lumineuses, ombre terminator, highlight
  - `img/moon.svg` : surface grise dégradée, cratères de 3 tailles (grands/moyens/petits), texture speckle
  - `img/meteor.svg` : roche irrégulière avec fissures, lueur de feu externe, highlight, core glow
  - `img/satellite.svg` : panneaux solaires (lignes de cellules), corps détaillé, antenne, capteur, LED clignotantes
- **Code :** remplacement du `svgToImg()` inline par `new Image()` depuis fichiers. `drawScene()` utilise `drawImage()` pour chaque élément. Conservation des fissures, de l'atmosphère, de la teinte mood et des animations procédurales.
- **Fix fluidité (lord)** : les SVG étaient re-rasterisés à chaque frame par le Canvas → lenteur. Solution : `cacheImg()` qui pré-rend chaque SVG une fois dans un `<canvas>` offscreen dès le chargement, puis `drawImage()` utilise le canvas bitmap caché au lieu du SVG brut. Suppression des filtres SVG (`feGaussianBlur`) et animations `<animate>` dans les SVG pour accélérer le pré-rendu.

### Effets visuels max (qualité jeu réel)
- **Fond spatial ++** : 275 étoiles (au lieu de 184) avec 7 teintes + 4 couches de profondeur ; étoiles filantes plus fréquentes (1.2-4.2s), colorées (HSL), avec glow tip ; 4 nébuleuses animées
- **Météorite ++** : traînée 18 segments (au lieu de 10) avec dégradé feu/fumée ; 5 débris rocheux en rotation avec sous-éclats ; lueur externe pulsante ; 6 particules de feu orbitales ; particules de fumée/feu spawnées en temps réel (0.4 par frame)
- **Terre animée** : nuages semi-transparents animés (dérive lente) ; villes scintillantes avec twinkle sinusoidal (28 points lumineux) ; calque superposé à l'image SVG
- **Bouclier ++** : halo externe lumineux ; arc principal avec glow ; grille hexagonale animée (taille variable selon charge) ; étincelles aléatoires spawnées sur la surface du bouclier

### Sauvegarde formateur + suppression Publication
- **Problème :** le bouton "Publier" ouvrait un panneau séparé avec QR/PIN/Downloads, et la publication était mélangée à la distribution
- **Fix :** remplacement du bouton `btnPublishGame` → `btnSaveGame` ("💾 Sauvegarder"). La sauvegarde génère les questions + PIN, puis affiche le résultat (PIN, QR, Copier, Distribuer) directement **dans le panneau de config**, sans panneau publication séparé
- **Suppression** du `gamePublishPanel` (panneau dédié) et des boutons `btnDownloadPin`, `btnPrintPDF`, `btnDownloadQR` superflus
- **`saveGame()`** remplace `publishGame()` : génération AI + stockage localStorage + affichage inline via `showSaveResult(d)`
- **Restauration** au chargement : si une sauvegarde existe, `showSaveResult(d)` rétablit l'affichage

### Multi-sauvegardes (plusieurs configurations formateur)
- **Problème :** une seule sauvegarde écrasait la précédente (`setItem` sur la même clé)
- **Fix :** système de multi-sauvegardes avec `GAME_SAVES_KEY` (tableau JSON). Chaque sauvegarde a un `id` unique, stocke competence, difficulté, questionCount, PIN, rounds, date
- **Fonctions :** `loadSaves()`, `saveSaves(arr)`, `renderSaveList()` affiche la liste dans le menu, `loadSave(idx)` charge une sauvegarde, `deleteSave(idx)` la supprime
- **UI :** bloc "📂 Parties sauvegardées" avec chaque entrée affichant competence, PIN, difficulté, nb questions, date + boutons 🚀 Jouer et 🗑 Supprimer
- **PIN unique :** `generatePin()` + vérification d'unicité parmi les sauvegardes existantes

### Bouton Admin ajouté
- **Problème :** l'admin ne voyait pas d'onglet Admin dans le jeu
- **Fix :** ajout du bouton `btnAdminPanel` (⚙️ Admin) à côté du bouton Retour dans le menu → lien vers `admin.html`
- **Visibilité admin seulement** : `supabase.js` stocke `isAdmin=true/false` dans localStorage via `currentProfile?.role === 'admin'`. Le jeu cache le bouton si `isAdmin !== 'true'` ou si mode apprenant.

### Assistant IA : information créateur plateforme
- **Problème :** les formateurs demandent "qui a créé la plateforme ?" → l'IA n'avait pas cette information
- **Fix :** ajout d'un bloc `📌 INFORMATION PLATEFORME` dans le system prompt de l'assistant (`assistant.js`). Contient : créateur (Aziz Mohamed Rostom, spécialités, vision), groupe APC Plus SBA, accompagnement pédagogique (Mme Bach Chaouch Salima Zina), liste des membres contributeurs. L'IA répond avec ces précisions quand un formateur pose la question.

### Fix bannière mise à jour
- **Problème :** `checkVersionNotification()` utilisait `currentLang` (déclaré en `let` ligne 2131) → en début de script la variable était en TDZ ; la bannière ne s'affichait pas correctement
- **Fix :** fallback `localStorage.getItem('lang')` + `APP_VERSION` bumpée à `1.1.1` pour forcer l'affichage

### Règle mjr3 — version bump automatique
- **Ajout :** règle `mjr3` dans AGENTS.md — après chaque correction, incrémenter `APP_VERSION` dans `shared.v2.js` pour que la bannière "APC Algérie GÉNÉRATION 3 a été mise à jour" s'affiche
- **Version bump :** `1.1.1` → `1.1.2` (application de la règle)

### Création jeu "Fais pousser ta plante" (`challenge-plant.html`)
- **Concept :** l'apprenant fait pousser une plante en répondant aux questions. Bonne réponse = arrosage + croissance, mauvaise = perte d'eau + flétrissement
- **7 stades :** 🌰 Graine → 🌱 Germination → 🌿 Jeune pousse → 🍀 Petite plante → 🌳 Plante adulte → 🌸 Floraison → 🌺 Fleur magnifique (victoire)
- **5 gouttes d'eau :** chaque erreur enlève une goutte → 🥀 plante sèche à zéro
- **Récompenses :** 🌸 Blanche (70%) / 🌹 Rose (80%) / 🌻 Tournesol (90%) / 🌺 Orchidée (100%)
- **Mêmes features :** multi-save PIN/QR/Distribution, compétence + génération IA, TTS 3 langues, mode apprenant, badges
- **Assets SVG :** `img/plant-pot.svg`, `plant-stage0-6.svg`, `plant-water.svg`, `plant-butterfly.svg`, `plant-bee.svg`
- **Navigation :** ajout de `tab_game2` dans `shared.v2.js` (FR/AR/EN) + lien dans les 10 pages HTML
- **Version bump :** `1.1.2` → `1.1.3`

### Animations eau + floraison + croissance (`challenge-plant.html`)
- **Pluie (`spawnRain`)** : à chaque bonne réponse, 8-12 gouttes tombent du ciel sur la plante avec traînée + splash
- **Croissance fluide (`stageTrans`)** : transition en fondu (`globalAlpha` lerp) entre l'ancien et le nouveau stade
- **Floraison (`bloomPct`)** : pétales animés qui s'ouvrent progressivement autour de la fleur (8 pétales rotatifs, scale 0.9→1)
- **calcPotPos()** : helper pour éviter la duplication des calculs de position du pot
- **Version bump :** `1.1.6` → `1.1.7`

## Session 05/07/2026 — Profile overlay close button removed, replaced by logout

### Problème
- Le bouton ✕ de la modale "Complétez votre profil" permettait de fermer l'overlay sans remplir les informations obligatoires
- L'utilisateur pouvait contourner la complétion du profil et utiliser la plateforme sans nom arabe ni spécialité

### Fix
- `index.html` : remplacement du bouton `×` (`modal-close`) par un bouton "Se déconnecter" qui appelle `signOut()`
- L'utilisateur ne peut plus fermer l'overlay sans remplir les champs — seule option : enregistrer ou se déconnecter
- **Version bump :** `1.1.7` → `1.1.8`

## Session 05/07/2026 — Journal d'activité utilisateur (admin)

### Nouvelle table Supabase
- `user_activity_log` : stocke les événements login, logout, profile_update avec user_id, session_id, details JSONB, created_at
- RLS : insert propre user, select propre user (admin bypass via service_role key)

### Modifications `js/supabase.js`
- `logActivity(eventType, extra)` : insert dans la table `user_activity_log` (fire-and-forget)
- `signIn()` : génère un `session_id` stocké en sessionStorage + log 'login'
- `signOut()` : log 'logout' avec le session_id + nettoie sessionStorage
- `saveProfileCompletion()` : log 'profile_update' avec les champs modifiés (avant → après)

### Nouvelle section admin (`admin.html`)
- Carte "📊 Journal d'Activité" avec tableau : Utilisateur, Événement (🔓/🔒/✏️), Date/Heure, Détails
- Statistiques par utilisateur : nombre de connexions, déconnexions, mises à jour, dernière connexion
- Appel automatique au chargement de la page admin
- **Version bump :** `1.1.8` → `1.2.0`

## Session 05/07/2026 — Sauvegardes des jeux sur Supabase + filtrage par compte

### Problèmes
- Les parties sauvegardées restaient en localStorage → visibles par tout utilisateur sur le même appareil
- En changeant de compte, on voyait les sauvegardes de l'autre
- Les sauvegardes n'étaient pas persistées sur le cloud

### Solutions
- Nouvelle table `game_saves` dans Supabase (user_id, game_type, save_data JSONB)
- `saveSaves()` : sauvegarde localStorage + delete+insert Supabase (cloud)
- `syncSavesFromServer()` : au chargement, remplace localStorage par les données Supabase si disponibles
- Appelée au démarrage des deux jeux
- Filtrage des sauvegardes affichées par `trainer_id === sb_user_id` (compte actif)
- Même logique appliquée à `challenge-game.html` (Défense Orbitale)
- **Version bump :** `1.2.0` → `1.2.1`

### Nouvelles tables / colonnes Supabase créées durant cette session
- `user_activity_log` — journalisation login/logout/profile_update (admin)
- `competence_flowers` — ajout colonne `trainer_id UUID REFERENCES profiles(id)`
- `game_saves` — sauvegardes cloud des jeux (plant, defense)

### Règle pour les futurs jeux
- Tout nouveau jeu doit utiliser le même système que les jeux existants :
  - `GAME_SAVES_KEY` + `loadSaves()` / `saveSaves()` avec sync Supabase (table `game_saves`)
  - `syncSavesFromServer()` au démarrage
  - Filtrage des sauvegardes par `trainer_id` via `sb_user_id`
  - Jardin des compétences filtré par `trainer_id` (table `competence_flowers`)
  - Distribution PIN/QR/EmailJS
  - Canvas + Web Audio + TTS 3 langues

### Retiré de `admin.html`
- Carte "🌺 Jardin des compétences" retirée (HTML + fonctions JS `loadAdminGarden()`)
- Le jardin est déjà présent dans `challenge-plant.html`

### Filtrage par formateur
- `challenge-plant.html` : la requête du jardin filtre désormais par `trainer_id` → chaque formateur voit uniquement les fleurs de ses propres apprenants
- `supabase.js` : stocke `sb_user_id` dans localStorage pour que le jeu puisse récupérer l'ID du formateur connecté

### Problème
- Le bouton ✕ de la modale "Complétez votre profil" permettait de fermer l'overlay sans remplir les informations obligatoires
- L'utilisateur pouvait contourner la complétion du profil et utiliser la plateforme sans nom arabe ni spécialité

### Fix
- `index.html` : remplacement du bouton `×` (`modal-close`) par un bouton "Se déconnecter" qui appelle `signOut()`
- L'utilisateur ne peut plus fermer l'overlay sans remplir les champs — seule option : enregistrer ou se déconnecter
- **Version bump :** `1.1.7` → `1.1.8`

### Onglet unique Jeux (`games.html`)
- **Création `games.html`** : page hub listant tous les jeux (Défense Orbitale + Fais pousser ta plante) avec cartes visuelles
- **Navigation simplifiée** : remplacement des onglets individuels `tab_game` + `tab_game2` par un seul `tab_games` → `games.html` dans les 10 pages
- **Bouton Retour jeu** : `challenge-game.html` et `challenge-plant.html` → retour vers `games.html`
- **i18n** : ajout de `tab_games` dans `shared.v2.js` (🎮 Jeux / 🎮 الألعاب / 🎮 Games)
- **Version bump :** `1.1.3` → `1.1.4`

## Session 05/07/2026 — Ajout jeu Cartes du Savoir + games hub

### Nouveau jeu : challenge-cards.html
- **Création `challenge-cards.html`** : jeu "Défi des Cartes du Savoir" avec flip animation 0.2s, 4 réponses, cartes spéciales (⭐💎🎁⏱), pile réussites, HUD, 3 langues, save/load Supabase, PIN/QR/Distribution, `trainer_id` filtering
- **Même pattern** que `challenge-plant.html` et `challenge-game.html` : `GAME_SAVES_KEY`, `loadSaves()`/`saveSaves()` avec sync Supabase (`game_saves`), `syncSavesFromServer()`, filtrage par `trainer_id`
- **SQL** : ajout `'cards'` dans le CHECK de `game_saves.game_type`
- **`games.html`** : ajout de la carte "🃏 Cartes du Savoir" avec i18n (FR/AR/EN), tags Mémoire/Réflexes/QCM
- **Version bump :** `1.2.1` → `1.2.2`

### Fix : apostrophes mal échappées dans challenge-cards.html
- **Bug** : les apostrophes françaises (`t'attend`, `l'empiler`, `qu'est-ce`, `s'évalue`, etc.) étaient échappées avec `\\'` (double backslash) au lieu de `\'` (simple backslash), causant `SyntaxError: Unexpected identifier`
- **Correction** : `replaceAll('\\\\'', '\\'')` — transforme tous les doubles backslash+quote en single backslash+quote dans tout le fichier
- **Version bump :** `1.2.2` → `1.2.3`

### Thème visuel + questions par compétence (challenge-cards.html)
- **CSS** : nouveau thème violet/or sombre avec orbes flottantes animées en background, glow borders, card shine animation, boutons purple gradient, backdrop-filter blur, transitions améliorées (cubic-bezier spring)
- **Nouvelles animations** : `shineBorder` (bordure arc-en-ciel), `cardPulse` (pulsation icône), `trophyBounce` (trophée résultat), `orbFloat` (orbes fond), `overlayPulse` (intro overlay)
- **Questions taggées** : chaque question du fallback a désormais un tableau `tags` (ex: `['APC','compétence','définition']`) permettant le filtrage par compétence
- **Filtrage amélioré** : `loadQuestions()` filtre par tags + recherche regex dans le texte, avec décomposition en termes
- **Extraction compétences** : `_extractCompetences()` + `loadCompetenceList()` extraient les compétences des conversations Assistant IA et les affichent en badges cliquables sous le champ compétence
- **Génération IA Groq** : si une clé Groq est configurée et une compétence spécifique saisie, `generateQuestionsWithAI()` appelle l'API Groq pour générer des questions sur mesure
- **`generateQuestionsForCompetence()`** : essaie d'abord l'IA, fallback sur les questions locales
- **Version bump :** `1.2.3` → `1.3.0`

### Fond image + trophée SVG (challenge-cards.html)
- **Fond** : remplacement des orbes floues par des cartes à jouer flottantes (🂠🃏) en opacité 4% avec animation `bgCardFloat` (oscillation verticale + rotation), sur dégradés radiaux subtils (purple/gold/cyan)
- **Trophée SVG** : création d'un trophée vectoriel (coupe, anses, étoile, base) avec classes `gold`/`silver`/`bronze` selon le score ; remplace l'emoji texte `🏆`
- **Animations** : `trophyBounce` rebond, ombre `drop-shadow` dorée
- **Version bump :** `1.3.0` → `1.3.1`

### Blocage mauvaise réponse → auto-advance (challenge-cards.html)
- **Problème** : quand l'utilisateur choisissait une mauvaise réponse, la carte tremblait et des boutons "Réessayer"/"Passer" bloquaient la progression
- **Fix** : suppression des boutons retry/skip ; après une mauvaise réponse, la bonne réponse est surlignée, puis après 1.2s la carte suivante s'affiche automatiquement (comportement comme les autres jeux)
- **Version bump :** `1.3.1` → `1.3.2`

### Questions par compétence + affichage compétence (challenge-cards.html)
- **Génération IA** : `generateQuestionsForCompetence()` renforcée — essaie Groq avec le thème saisi, fallback clair via toast "Questions locales pour 'compétence'"
- **Affichage compétence** : ajoutée dans l'écran intro (`introComp`), la HUD (`hudComp`) et l'écran résultat
- **i18n** : clé `introComp` ajoutée en FR/AR/EN
- **Version bump :** `1.3.2` → `1.3.3`

### Questions Windows/IT + matching insensible à la casse (challenge-cards.html)
- **Banque élargie** : 20 questions ajoutées sur Windows 11 (installation, configuration, réseau, sécurité, TPM, BIOS, sauvegarde, RAM, NTFS, etc.) avec tags correspondants
- **`_matchCompTags()`** : matching insensible à la casse + sous-chaîne 4+ caractères (ex: "installer" matche "installation", "windows" matche "Windows")
- **`loadQuestions()`** : si aucune question locale ne correspond à la compétence → toast warning + questions mélangées aléatoirement ; tri aléatoire final
- **Modèle Groq** : `llama-3.3-70b-versatile` → `llama-3.1-8b-instant` (plus fiable)
- **Version bump :** `1.3.3` → `1.3.4`

### Fix _sb undefined dans challenge-game.html
- **Bug** : `_sb` était utilisé dans `saveSaves()` et `syncSavesFromServer()` mais jamais déclaré → `ReferenceError: _sb is not defined`
- **Fix** : ajout de `var _SB_URL`, `_SB_KEY`, `_sb=null` et `_initSB()` / `_initSB()` avant `generatePin()`
- **Version bump :** `1.3.4` → `1.3.5`

### Fix API keys non fonctionnelles + admin
- **Problème** : `migrateKey()` déplaçait les clés du localStorage vers sessionStorage (perdu à la fermeture du tab) puis supprimait les clés du localStorage ; validation trop stricte (`startsWith('gsk_')`, `startsWith('sk-or-v1-')`) rejetait les clés valides sans message
- **Fix `shared.v2.js`** : suppression de `migrateKey()` ; les getters lisent toutes les anciennes clés (`gq_key` → `groq_key` → `groq_api_key`) ; les setters acceptent toute clé > 5 caractères (pas de validation de format)
- **Fix `challenge-cards.html`** : `localStorage.getItem('groq_key')` remplacé par `_getGroqKey()` qui lit `gq_key` puis `groq_key` puis `groq_api_key`
- **Fix `challenge-game.html` + `challenge-plant.html`** : fallback `gq_key` → `groq_key` → `groq_api_key` pour la lecture de la clé Groq
- **Version bump :** `1.3.5` → `1.3.6`

### Fix CSP bloquant les API (admin.html + login.html + challenge-cards.html)
- **Problème** : `connect-src` trop restrictif dans les CSP des pages — bloquait les connexions vers OpenRouter, Groq, Gemini, EmailJS
- **Fix** : ajout de `https://openrouter.ai https://api.groq.com https://generativelanguage.googleapis.com https://api.emailjs.com` dans le `connect-src` de `admin.html`, `login.html`, `challenge-cards.html`
- **Version bump :** `1.3.6` → `1.3.7`

## Session 06/07/2026 — Fix logActivity non bloquant + .gitignore GitHub

### Bug : logActivity('login') jamais enregistré
- **Problème :** `signIn()` appelait `logActivity('login')` **sans `await`**. La page naviguait vers `loading.html` 200ms plus tard, tuant la requête HTTP avant son envoi. Les connexions depuis d'autres machines ne laissaient aucune trace.
- **Fix :** ajout de `await` devant `logActivity('login', ...)` dans `signIn()`.

### Bug : logActivity('logout') jamais enregistré
- **Problème :** `signOut()` faisait `await supabaseClient.auth.signOut()` + `currentUser = null` AVANT d'appeler `logActivity('logout')`. Le guard `if (!currentUser) return;` dans `logActivity()` stoppait l'enregistrement.
- **Fix :** déplacement de `logActivity('logout')` AVANT `auth.signOut()` et `currentUser = null`.

### Bug : logActivity('profile_update') rendait page blanche
- **Problème :** `saveProfileCompletion()` était une fonction synchrone avec callback `.then()`. L'ajout de `await` dans le callback (non-async) aurait causé une SyntaxError.
- **Fix :** fonction convertie en `async/await`, remplacement de `.then()` par `await`.

### .gitignore pour publication GitHub
- Création de `.gitignore` excluant : `_*`, `*.bak`, `*.docx`, `*.txt`, `inx/`
- Liste des fichiers à publier fournie (25+ fichiers racine, 6 dossiers : css/, js/, img/, sounds/, mp3/)

### Version bump
- `APP_VERSION` : `1.3.8` → `1.3.9`

---

## Session 06/07/2026 — Fix quiz.html : chaînes multi-lignes cassées par le formateur + nettoyage global

### Problème
Le fichier `quiz.html` avait été minifié/formaté de façon à SPLITTER des chaînes JavaScript sur plusieurs lignes. Des tags HTML (`<span>`, `<strong>`, `<br>`, `<div>`, `<img>`) apparaissaient au début de lignes, HORS des délimiteurs de chaîne (`'...'`). Le moteur JS interprétait ces tags comme des opérateurs de comparaison (`<`, `>`), produisant des expressions NaN silencieuses à la place du HTML attendu.

**Conséquence** : SyntaxError dans le bloc <script> principal → TOUTES les fonctions du bloc étaient indisponibles. Les sections `loadSavedPresentations`, `loadDistribLists`, `loadPublishedQuizzes`, `renderLearnerQ` affichaient un HTML tronqué ou incorrect.

### Fix : Rewrite du script block principal
Le grand bloc `<script>` (block 10, ~104k chars) contenait ~60 lignes avec des retours à la ligne au milieu de chaînes JS. Solution :
1. **Corrections manuelles** des 4 fonctions les plus visibles (innerHTML multi-lignes fusionnés en une seule ligne)
2. **Nettoyage automatique** : suppression de TOUS les retours à la ligne dans le script block principal (remplacement CRLF/LF → espace, puis collapse des espaces multiples)

### Fonctions JS corrigées
- `loadSavedPresentations()` — carte présentation avec bouton Quiz
- `loadDistribLists()` — section "Mes distributions"
- `renderQuizList()` (dans `loadPublishedQuizzes`) — liste quiz publiés
- `renderLearnerQ()` — options de réponse mode apprenant
- `quitQuiz()` — template HTML document.write (nouvelle fenêtre goodbye)
- `finishLearner()` — section review (✅/❌ réponses)
- `showQuizStats()` — template HTML modal statistiques
- `exportStatsPDF()` — template HTML export PDF

### Version bump
- `APP_VERSION` : `1.3.8` → `1.3.9`

## Session 06/07/2026 (suite) — Fix `//` comments dans quiz.html (restauration depuis ver 10093)

### Problème
Le fichier `quiz.html` avait été restauré depuis `ver 10077` (trop ancien, sans la nav jeux). La version `ver 10093` contient tout le contenu mais a le script block sur UNE SEULE ligne (14851 chars), avec `//` en début de ligne commentant TOUT le code JS.

### Fix
- **Base** : `D:\platform APC IMAGES\ver 10093 - Copie (2)\quiz.html` (604 lignes, nav jeux, EmailJS, toutes les fonctions)
- **Conversion des `//` comments** en `/* */` (block comments) via script Node.js :
  - Détecte chaque `// comment` suivi de 4+ espaces + mot-clé JS (`var`, `if`, `function`, `document`, etc.)
  - Remplace `// comment` par `/* comment */` sans ajouter de lignes
  - Structure originale préservée (toujours 604 lignes)
  - Syntaxe JS valide ✅

### Fichiers concernés
- `quiz.html` — ver 10093 + `//` → `/* */`
- `AGENTS.md` — mise à jour session

### Version bump
- `APP_VERSION` : `1.3.9` → `1.4.0`

## Session 08/08/2026 — Remplacement Llama 4 Scout 17B (décommissionné par Groq le 17/07/2026)

### Contexte
- Groq a décommissionné meta-llama/llama-4-scout-17b-16e-instruct (17 juillet 2026) et recommande GPT OSS 120B / Qwen3.6 27B comme remplaçants.
- Consigne utilisateur : NE TOUCHER QUE LES MODÈLES — prompts, identité, présentation et tout le reste INTACTS.

### Changements (fichiers)
- js/shared.v2.js :
  - MODEL_MAP groq-scout : meta-llama/llama-4-scout-17b-16e-instruct → openai/gpt-oss-120b (remplaçant officiel recommandé par Groq)
  - MODEL_MAP llama4-scout-free : meta-llama/llama-4-scout-17b-16e-instruct:free → openai/gpt-oss-20b:free (remplaçant free OpenRouter, famille GPT OSS)
  - PROVIDERS openrouter models : scout:free retiré → openai/gpt-oss-20b:free
  - PROVIDERS groq models : scout retiré (doublon gpt-oss-120b éliminé)
  - i18n 3 langues (FR/AR/EN) : modelGroqScout → "☐ GPT OSS 120B (Groq)", modelLlama4ScoutFree → "☐ GPT OSS 20B (OpenRouter free/مجاني)"
  - Clés internes groq-scout / llama4-scout-free et FALLBACK_ORDER conservées telles quelles (renommer casserait les radios UI)
- 10 fichiers HTML (about, admin, aide, aide-cles-api, assistant, challenges, from-doc, generator, index, quiz) : libellés par défaut <span data-i18n="modelGroqScout"> et modelLlama4ScoutFree mis à jour (GPT OSS 120B / GPT OSS 20B)
- admin.html.bak NON touché (backup)

### Non ajouté (décision)
- Modèles OpenRouter payants (Kimi K3, KAT-Coder-Pro/Air V2.5) et routeur openrouter/auto-beta : NON ajoutés — payants, aucun crédit, risque de coût ; la rotation reste 100% free. Le routeur auto-beta peut router vers des modèles payants sans contrôle de coût.

### Version bump
- APP_VERSION : 1.4.0 → 1.4.1 (règle mjr3)

### Fix 413 TPM Groq + slugs OpenRouter retirés (v1.4.2)
Log utilisateur : cascade d'échecs — groq-fast/groq-scout HTTP 413 (Requested 14263 tokens > TPM free 6000/8000), deepseek-v3:free et openrouter/owl-alpha invalides (retirés d'OpenRouter). Réponse à la question « pourquoi ? il échoue mon crédit » : CE N'EST PAS le crédit — ce sont les QUOTAS GRATUITS : TPM Groq par minute très bas (6000 llama-3.1-8b / 8000 gpt-oss-120b) et modèles OpenRouter free retirés.

Fixes (`js/shared.v2.js`, copiés/étendus du projet principal) :
1. **Trim anti-TPM dans `callAI()`** (manquait dans la copie) : sysPrompt coupé à 700+700 si > 1400 chars ; historique limité à ~2500 chars (méthode du projet principal validée).
2. **Troncature des questions géantes** (nouveau) : dernier message utilisateur > 2500 chars → 1000 début + 1000 fin + marqueur de troncature (garde les ordres renforcés ajoutés en fin de message). 14263 → ~2600 tokens max.
3. **Slugs OpenRouter validés EN DIRECT via l'API** (GET /api/v1/models avec la clé or_key de l'utilisateur) — liste réelle des :free d'août 2026 :
   - `deepseek-v3-free` : `nvidia/llama-3.1-nemotron-super-49b-v1:free` (invalide) → `nvidia/nemotron-3-super-120b-a12b:free` ✓
   - `owl-alpha` : `openrouter/owl-alpha` (404 no endpoints) → `nvidia/nemotron-nano-9b-v2:free` ✓
   - `llama4-scout-free` : `openai/gpt-oss-20b:free` ✓ (déjà valide)
   - Liste PROVIDERS openrouter alignée sur ces slugs.
4. Labels i18n FR/AR/EN + libellés HTML (10 pages) : « Nemotron 3 Super 120B (OpenRouter free/مجاني) », « Nemotron Nano 9B (OpenRouter free/مجاني) ».

### Version bump
- `APP_VERSION` : `1.4.1` → `1.4.2`


### Fix lenteur + 413 résiduel : budgets TPM serrés + garde-fou absolu (v1.4.3)
Log utilisateur : lenteur + cascade — gemini-flash/gemini-pro 429 (quota libre quotidien épuisé, limit:0, reset ~minuit — pas un bug code), groq-llama/groq-fast/groq-scout 413 « Requested 8845/8882 > TPM free 6000/8000 ». Le trim v1.4.2 était bien chargé (numéros de ligne 2357/2453 vérifiés == fichier actuel) mais le budget 1400+2500+2045 ≈ 5900 chars dépassait encore les TPM minuscules, surtout avec un texte arabe dense (tokenizer ~1.5 token/char) et les questions géantes collées (mails entiers).

Fixes (`js/shared.v2.js`) :
1. Budgets resserrés dans callAI : sysPrompt 600+600 (si >1200), question tronquée à 600+600 (si >1200), historique ≤1200 chars → payload ≤ ~3600 chars.
2. **GARDE-FOU absolu dans callProvider** (tous providers, avant construction du body) : payload final ≤ ~3400 chars — messages non-sys tronqués individuellement à 600+600 si >1200, puis conservés depuis le plus récent jusqu'à 2200 chars (sys conservé en tête). 3400 chars ≈ 5100 tokens max même en arabe dense → sous TPM 6000.
3. Diagnostics console ajoutés : « 📏 [trim] payload ≈ N chars » (callAI) et « 🛡️ [garde-fou] payload final ≈ N chars » (callProvider) → le prochain log montre la taille réellement envoyée ; si le 413 revient avec un payload > 3400 chars, c'est que le navigateur sert un fichier en cache (Ctrl+F5 impératif).
4. Lenteur expliquée : 5 tentatives échouées (429 Gemini ×2 + 413 Groq ×3) avant toute réponse possible → chaque échec coûte 1-3 s ; désormais le payload est sous toutes les limites et la réponse arrive au 1er ou 2e modèle.

### Version bump
- `APP_VERSION` : `1.4.2` → `1.4.3`


### Cooldown intelligent des modèles — routeur anti-lenteur (v1.4.4)
Log : lenteur = tentatives répétées vers des modèles voués à l'échec (Gemini 429 daily ×2, Groq 413 ×3) + retry bloquant (sleep jusqu'à 30 s sur 429 dans callModel). Analyse validée : cooldown deadUntil + skip immédiat + suppression des attentes = gain principal.

Implémentation (`js/shared.v2.js`) :
1. **Cooldown persisté par raison** : `_markModelDead(modelKey, msg)` avec failureReason différencié :
   - 429 daily / `limit: 0` / `quota exceeded` / `RESOURCE_EXHAUSTED` (cas Gemini quotidien) → jusqu'à fin de jour + 10 min (reset minuit)
   - 429 avec `retry in Ns` → now + clamp(N+5, 10 s..300 s)
   - 429 sans retry → 5 min ; 413 → 60 s ; 401/403 → 15 min ; 400/404 (modèle retiré) → fin de jour ; 5xx → 3 min ; défaut → 5 min
   - Cap global : jamais au-delà de fin de jour + 10 min
   - Persistance localStorage avec clé **journalière** `axon_dead_YYYY-M-D` → purge automatique à minuit + `_clearDeadModels()` appelé à chaque sauvegarde de clé (or/gq/gm) — le rechargement de page ne fait pas oublier un cooldown.
2. **callModel simplifié** : skip immédiat si `Date.now() < deadMap[modelKey].until` (throw 'en cooldown → skip'), **retry-attente 429 SUPPRIMÉ** (plus aucun sleep dans le chemin normal), échec → `_markModelDead` + rethrow → la boucle callAI passe au modèle suivant instantanément.
3. **Toast discret** : « 🚫 <modèle> indisponible (<raison>) → bascule auto, réessai HH:MM » (1 seule fois par entrée en cooldown, via showToast) + console.warn détaillé.
4. `extractRetryDelay` devenu code mort (conservé, inoffensif).
5. AbortError (arrêt manuel) : rethrow sans marquage — pas de cooldown sur arrêt utilisateur.

Effet attendu : plus de 429/413 répétés par message → réponse au 1er ou 2e modèle fonctionnel → temps de réponse divisé par ~3-5. Gemini reste bloqué jusqu'à minuit (quota daily limit:0) — aucune tentative inutile.

### Version bump
- `APP_VERSION` : `1.4.3` → `1.4.4`

### Indicateur de réflexion dans le champ de saisie (v1.4.5)
Demande utilisateur : « ajoute un indice de réflexion en input ». Pendant la génération IA, afficher dans la zone de saisie (sous le textarea) un petit indicateur animé « 🤔 Réflexion... » avec spinner rotatif, masqué sinon.

Implémentation :
- `assistant.html` : `<div id="reflectInd" class="ai-reflect">` (spinner + `<span id="reflectText">`) inséré sous `.ai-input-wrap`, avec `<style>` `.ai-reflect` + `@keyframes aiRot` (spinner 12 px, rotation 0.7 s). Texte par défaut FR.
- `assistant.js` :
  - `sendMessage` : après `showTyping()`, affiche l'indicateur (`display:flex`) avec libellé selon langue : FR « 🤔 Réflexion... », AR « 🤔 تفكير... », EN « 🤔 Thinking... ».
  - `finally` (fin de génération réussie OU erreur) : masque l'indicateur.
- Le typing-indicator existant (bulles IA) est conservé — l'indicateur saisi est un complément visible même si la zone des bulles est scrollée.

### Version bump
- `APP_VERSION` : `1.4.4` → `1.4.5`

### Indicateur de réflexion dans la bulle IA (v1.4.5) — VERSION CORRIGÉE
Demande : « je veux trouver 🤔 Réflexion... à côté du 🤖 pendant l'analyse ». Résultat final = bulle typing affichée pendant TOUTE la génération, à côté de l'avatar.

Changements (définitifs) :
- js/assistant.js :
  - showTyping() : bulle contient 🤔 Réflexion... (libellé 3 langues) suivi des 3 points animés, AVANT l'avatar 🤖.
  - sendMessage : le emoveTyping() initial (avant ddMessage('ai', ...)) est SUPPRIMÉ → la bulle reste visible pendant tout callAI (pendant l'analyse), pas seulement 1 fraction de seconde.
  - inally : emoveTyping() = la bulle est retirée à la FIN de la réponse (succès) ; catch conserve son emoveTyping() (erreur).
- css/style.css : nouvelle règle .typing-indicator .typing-text (texte 13 px, color muted, width/height auto pour ne pas hériter du style "boulet" 8x8 des points).
- Rollback de #reflectInd (ancien bandeau/input) : élément HTML supprimé de ssistant.html, code JS associé retiré (_ri/_ri2), méta-diagnostic console mis à jour.
- Verdict utilisateur : ✅ fonctionne bien.

### Versions précédentes (v1.4.5) — ne pas re-appliquer
- ESSAI 1 : <div id=reflectInd> sous l'input (spinner + texte) → retiré sur demande (voulait sur le « tableau output »).
- ESSAI 2 : bandeau #reflectInd au-dessus de #aiMessages (visible en permanence) → retiré, l'utilisateur veut la bulle "à côté du 🤖".

### Modale Paramètres IA complétée (v1.4.6)
Demande : « je n'ai pas trouvé cette partie » — l'utilisateur ne trouvait que clés+modèles dans Paramètres de l'assistant ; il voulait EmailJS, Mode icônes, Mode libre et AXON comme sur l'index.

Ajouts (assistant.html modale + css + js) :
- Section 📧 EmailJS — Envoi d'invitations (Public Key / Service ID / Template ID / Clé API privée + boutons 🔍 Tester / ⚙️ Créer le template) — récupérée de la copie index.html (même HTML, ids identiques).
- Section Mode icônes (radio compatChoice Auto/Moderne/Compatible) — sauvée dans le handler modalSaveBtn existant via __compat.setSetting.
- Toggles 🔓 Mode libre (tous sujets) et 🧠 AXON Intelligence (mémoire évolutive) — logique JS portée : getFreeMode/setFreeMode/free_mode + getAxonMode/setAxonMode/axon_mode (localStorage, à l'identique du projet principal), câbler ft/at change.
- CSS : .free-mode-row / .free-mode-label / free-mode-label input[checkbox] ajoutés à css/style.css.
- Placement : fin du model-selector, juste avant le btn-row Enregistrer/Effacer/Annuler.
- Le reste (clés, modèles, verification API, EmailJS save/load/testEmailJS/createEmailJSTemplate/) existait déjà (loadKeysIntoModal + modalSaveBtn gèrent or/gq/gm/emailjs/compat).
- SYNTY défaut : node --check OK (shared.v2 + assistant).
- APP_VERSION : 1.4.5 -> 1.4.6.

### AXON Intelligence fonctionnel dans l'assistant (v1.4.7)
Demande : « qui es AXON ? » renvoyait une réponse générique (« aucune référence à AXON ») — la copie n'injectait AUCUNE identité AXON dans le prompt ni n'arbitrait les modes libre/AXON du projet principal.

Correction js/assistant.js (vers sendMessage) :
- Récupération des modes : reeMode = window.getFreeMode(), xonMode = window.getAxonMode() (les getters ont été créés en v1.4.6 dans shared.v2.js).
- Si xonMode : injection 🚨 ORDRE DIRECT (ARN/EN/EN/AR) : ne jamais se présenter comme Aziz/Rostom ; c'est AXON Intelligence (machine), pas une personne.
- Si !freeMode : injection 📌 règle légère — proposer un scénario pédagogique en fin de réponse pour une question générale.
- **Identité renforcée dans le DERNIER message utilisateur** (comme le langHint) quand la question matche une question d'identité (qui es-tu, who are you, من أنت, etc.) : « tu es AXON Intelligence, à mémoire évolutive, développé par Aziz Mohamed Rostom. Ne dis JAMAIS que tu es OpenAI/Google/Meta. » — évite la troncature par le trim sysPrompt et corrige le biais identité native des modèles.
- Badge pedagogyBadge (🧠 AXON / 🔓 Libre / 📘 APC) ABSENT dans la copie — laissé de côté (optionnel).
- node --check OK — APP_VERSION 1.4.6 → 1.4.7.

### Badge de mode dans la barre IA (v1.4.8)
Demande : « si j'active AXON je dois trouver l'icône IA : 🧠 AXON » — badge de mode dans la toolbar de l'assistant.

Ajout :
- ssistant.html : <span id="pedagogyBadge" class="provider-badge">📘 APC</span> inséré à côté de #providerBadge (dégradé violet, couleur #fff).
- js/shared.v2.js : window.updateModeBadge() → affiche 🧠 AXON si getAxonMode(), sinon 🔓 Libre si getFreeMode(), sinon 📘 APC. Appelé au chargement (updateModeBadge() après l'init) et à chaque changement des toggles #freeModeToggle / #axonToggle (faisant désormais setXxxMode() + updateModeBadge()).
- node --check OK — APP_VERSION 1.4.7 → 1.4.8.

Attente : la barre IA de l'assistant affiche désormais 🧠 AXON quand le toggle AXON est coché, 🔓 Libre en mode libre, 📘 APC par défaut — en temps réel au toggle (sans reload).

### Mémoire évolutive AXON (Supabase + local) portée dans la copie (v1.4.9)
Demande : « il a une mémoire évolutive avec Supabase qui stocke et aussi localhost… rappelle-moi mon nom ». La copie n'avait QUE les toggles, aucune persistance/mémoire AXON.

Port depuis « D:\platform APC » (principd) :
- js/shared.v2.js : bloc AXON mémoire complet inséré après updateModeBadge() :
  - initAxonMemory() (7 stores : axon_user/conversation/knowledge/corrections/documents/statistics/cache)
  - Supabase sync : _axonSyncQueue/_axonSyncFlush/_axonSyncEnqueue + initAxonSupabase() (récupère mémoire distante au login, migre le local, met en file d'attente), table xon_memory
  - getAxonStore/setAxonStore (localStorage + enqueue Supabase)
  - buildAxonContext() → contexte mémoire injecté dans le prompt (utilisateur, connaissances, corrections)
  - axonPostProcess() : moteur décision (nom préféré « appelle-moi X », préférences « je préfère », corrections, connaissance APC) + stats — GARDE la question « rappelle moi mon nom » (ne stocke pas l'attendu comme un nom)
  - window.getAxonPreferredName()
  - initAxonMemory() + waitUser→initAxonSupabase() au chargement
  - Remove duplicated get/setAxonMode (déjà présents) avant insertion.
- js/assistant.js :
  - userName prioritairement mémoire AXON (getAxonPreferredName()) sinon profil
  - sysPrompt += nameContext (été inutilisé avant)
  - injection AXON MEMORY : buildAxonContext() quand axonMode
  - après réponse : setTimeout(axonPostProcess(aiText, text), 100)
- supabase-schema.sql : ajouté le bloc #22 (table axon_memory + RLS + policies + index) — à appliquer dans la console SQL Supabase une fois.
- node --check shared.v2 + assistant OK.
- APP_VERSION 1.4.8 → 1.4.9.

## Session 16/08/2026 — Fix admin.html + tracking trainer_id + profil utilisateur + reset admin

### Fix SyntaxError admin.html
- **Cause :** script inline reformaté cassé — chaînes JS multi-lignes, tags HTML hors délimiteurs de chaîne
- **Fix :** 5 chaînes multi-lignes en single quotes converties en template literals (backticks) + reformatage complet du script inline (38836 bytes) → passe `node --check` et `new vm.Script()`

### Tracking `trainer_id` pour le Jardin des fleurs (per-trainer)
- **Problème :** toutes les fleurs de `competence_flowers` avaient `trainer_id = NULL` — le device de l'apprenant ne recevait jamais l'ID du formateur (stocké seulement dans le localStorage du formateur)
- **Fix `challenge-plant.html`** :
  - `showSaveResult()` + `_gameLink()` : ajout du paramètre `t_id` dans les URLs de jeu
  - Mode apprenant : parsing de `t_id` depuis l'URL → `localStorage.plant_trainer_id`
  - Soumission fleur : `trainer_id` lu dans l'ordre : `GAME_PUBLISH_KEY` → `plant_trainer_id` (localStorage) → paramètre URL `t_id`
- **Fix `js/challenges.js`** :
  - `challengeDistribGenerate()` + `challengeDistribAddSingleRow()` : ajout de `t_id` aux liens de distribution
  - `initChallengeLearnerMode()` : parsing + stockage de `t_id`
- **Jardin admin (`admin.html` `loadAdminGarden()`)** : filtre par `trainer_id` RETIRÉ temporairement — toutes les fleurs existantes ont `trainer_id = NULL`, le filtre rendait le jardin vide pour tous. Les NOUVELLES fleurs (via liens corrigés avec `t_id`) auront le bon `trainer_id` → réactiver le filtre `trainer_id.eq.currentUser.id` une fois les données corrigées

### Modification du profil par l'utilisateur (self-service)
- **`js/supabase.js`** :
  - `openEditProfile()` : pré-remplit le modal `#profileOverlay` avec `full_name`, `full_name_ar`, `specialite` actuels, titre → « Modifier mon profil »
  - `saveProfileCompletion()` étendu : sauvegarde `full_name` + `full_name_ar` + `specialite` en une seule requête, puis `updateAuthUI()`
- **`index.html`** : bouton « 👤 Modifier mon profil » dans le drawer + champ `#profileFullName` (Nom complet) ajouté au modal `#profileOverlay` + bouton de fermeture ✕
- **`admin.html`** : bouton « 👤 Modifier mon profil » dans le drawer + copie du modal `#profileOverlay` avec champ `full_name`

### Réinitialisation des infos utilisateur (Admin)
- **`admin.html`** :
  - Nouvelle colonne avec bouton 🔄 (titre « Réinitialiser les informations ») dans le tableau des utilisateurs
  - `resetUserInfo(id, email)` : confirmation → PATCH `profiles` (full_name, full_name_ar, specialite = '') + PUT auth user_metadata = {} — le rôle et l'email sont conservés
  - `colspan` des lignes vides/erreurs : 5 → 7

### SQL / Base de données
- `supabase-schema.sql` : bloc migration ajouté en fin de fichier — `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name_ar TEXT;` et `specialite TEXT;` (colonnes utilisées par le code mais absentes du CREATE TABLE d'origine)
- Les colonnes `full_name_ar`/`specialite` existent déjà en base (ajoutées manuellement) — le bloc est idempotent (IF NOT EXISTS)

### Version bump
- `APP_VERSION` : `1.5.8` → `1.5.9` (règle mjr3)

## Session 16/08/2026 — Migration modèles Groq (décommissionnement Llama 3.1 8B Instant)

- Contexte : Groq décommissionne `llama-3.1-8b-instant` le 16/08/2026 (mails Groq reçus) ; remplacement recommandé : `openai/gpt-oss-20b`.
- Règle respectée : AUCUNE modification du prompt ni du code — uniquement les **noms de modèles** remplacés.
- Fixs :
  - `js/shared.v2.js` l.2007 : liste des modèles Groq de l'UI — `llama-3.1-8b-instant` → `openai/gpt-oss-20b`
  - `js/shared.v2.js` l.2017 : preset `groq-fast` — `llama-3.1-8b-instant` → `openai/gpt-oss-20b`
  - `challenge-cards.html` l.484 : appel direct Groq — `model:'llama-3.1-8b-instant'` → `'openai/gpt-oss-20b'`
- NON modifié (vérifié) : `FALLBACK_ORDER` l.2029 (noms de presets, pas de modèles), `groqModels` l.2381 (presets), commentaire TPM l.2526 (historique 6000 TPM laissé intact), `js/shared.js` (ancien : gpt-oss-120b/mixtral/deepseek-r1-distill — aucun modèle retiré), journaux historiques.
- Vérifié : `node --check` `js/shared.v2.js` OK ; **0 occurrence** de `llama-3.1-8b-instant` restante dans le code (seule la doc/historique en parle).
- mjr3 : `APP_VERSION` `1.5.9` → `1.6.0`.

## Session 16/08/2026 — Portage « 🔍 Vérifier la compétence » (générateur de prompt)

- Contexte : la copie de travail (v1.6.0) n'avait pas le bouton « 🔍 Vérifier la compétence » pourtant présent dans la version de référence `D:\platform APC IMAGES\ver 100116 ver nouveau model envoyé par email` (v1.7.8).
- Ajouts (AUCUN code existant modifié, prompts intacts) :
  - `generator.html` : bouton `#checkCompetenceBtn` + div `#competenceResult` après la textarea « Compétence visée » (copie de la 100116)
  - `js/shared.v2.js` : clés i18n `checkCompetence` FR/AR/EN (près de `prompt_competence`) + handler click (copie exacte 100116 l.3893-3910 — utilise `callAI` sans modèle en dur, messages trilingues)
  - `css/style.css` : bloc `.comp-check-result` / `.comp-msg` (loading/error/normal) ajouté à la fin du fichier
- mjr3 : `APP_VERSION` `1.6.0` → `1.6.1`.

## Session 16/08/2026 — Portage « 🔍 Vérifier la compétence » (générateur de prompt)

- Contexte : la copie de travail (v1.6.0) n'avait pas le bouton « 🔍 Vérifier la compétence » pourtant présent dans la version de référence `D:\platform APC IMAGES\ver 100116 ver nouveau model envoyé par email` (v1.7.8).
- Ajouts (AUCUN code existant modifié, prompts intacts) :
  - `generator.html` : bouton `#checkCompetenceBtn` + div `#competenceResult` après la textarea « Compétence visée » (copie de la 100116)
  - `js/shared.v2.js` : clés i18n `checkCompetence` FR/AR/EN (près de `prompt_competence`) + handler click (copie exacte 100116 l.3893-3910 — utilise `callAI` sans modèle en dur, messages trilingues)
  - `css/style.css` : bloc `.comp-check-result` / `.comp-msg` (loading/error/normal) ajouté à la fin du fichier
- mjr3 : `APP_VERSION` `1.6.0` → `1.6.1`.
- Vérifié : `node --check` `js/shared.v2.js` OK.

## Session 16/08/2026 — Portage des nouveaux modèles (réf. `ver 100116` v1.7.8)

- Contexte : la version de référence `ver 100116` (v1.7.8) contient les modèles recommandés par les emails Groq/OpenRouter : `groq-qwen` (Qwen3.6 27B Groq) + 5 nouveaux free OpenRouter. Règle respectée : AUCUN prompt ni code modifié — uniquement les modèles (les anciens presets retirés, les nouveaux ajoutés).
- `js/shared.v2.js` :
  - MODEL_MAP : supprimé `groq-scout`, `llama3.3-free`, `llama32-free`, `hermes405b-free`, `deepseek-v3-free`, `owl-alpha`, `llama4-scout-free` ; ajouté `groq-qwen` (`qwen/qwen3.6-27b`), `or-nemotron-super-free`, `or-gemma4-free` (`google/gemma-4-31b-it:free`), `or-gptoss20b-free`, `or-ling3-free` (`inclusionai/ling-3.0-flash:free`), `or-nemotron-nano-free` (`nvidia/nemotron-3-nano-30b-a3b:free`)
  - `groq-fast` CONSERVÉ = `openai/gpt-oss-20b` (fix décommissionnement Llama 3.1 8B — la 100116 pointait encore vers llama-3.1-8b-instant, volontairement pas repris)
  - PROVIDERS : liste Groq + `qwen/qwen3.6-27b` ; liste OpenRouter : `nemotron-nano-9b-v2:free` retiré, ajouté `google/gemma-4-31b-it:free` + `inclusionai/ling-3.0-flash:free`
  - FALLBACK_ORDER : `['gemini-flash','groq-llama','gemini-pro','groq-fast','groq-qwen','or-nemotron-super-free','or-gemma4-free','or-gptoss20b-free','or-ling3-free','or-nemotron-nano-free']`
  - `groqModels` : `['groq-llama','groq-fast','groq-qwen']`
  - i18n FR/AR/EN : clés `modelGroqQwen`, `modelNemotronSuperFree`, `modelGemma4Free`, `modelGptOss20bFree`, `modelLing3Free`, `modelNemotronNanoFree` ajoutées ; 6 anciennes clés retirées
- 10 fichiers HTML (about, admin, aide, aide-cles-api, assistant, challenges, from-doc, generator, index, quiz) : radios `modelChoice` mises à jour (6 anciens retirés, 6 nouveaux ajoutés, libellés alignés 100116)
- NON modifié (vérifié) : `js/shared.js` (ancien, `llama3.3-free` conservé — précédent), prompts, `challenge-cards.html` (déjà fixé), journaux historiques.
- Vérifié : `node --check` OK ; 0 occurrence des anciens presets dans le code ; 10/10 pages avec les 6 nouveaux radios.
- mjr3 : `APP_VERSION` `1.6.1` → `1.6.2`.

## Session 16/08/2026 — Fix : l'IA ignore le prompt généré (demande d'infos / mauvais sujet)

- Symptômes rapportés (page assistant, prompt généré collé) :
  1. L'IA répond « j'ai besoin des informations suivantes » (intitulé compétence, durée, public, supports...) alors que TOUTES ces infos sont dans le prompt.
  2. L'IA répond sur un sujet différent (climatisation au lieu de comptabilité) — contamination par la mémoire AXON.
- Cause racine : double troncature anti-TPM détruisant le prompt généré (~3000 chars) :
  - `callAI` l.2366 : dernier message > 1200 chars → coupé à 600+600 → la section « Contexte de la formation » (spécialité, module, compétence, durée, stagiaires...) disparaît au milieu.
  - `callProvider` l.2489 : même coupe 600+600 + budget total 2200 chars.
  - Sans le contexte, l'IA redemande les infos (réponse 1) puis retombe sur la mémoire AXON (réponse 2).
- Fix (`js/shared.v2.js`) :
  - Coupe par message : 1200 (600+600) → **8000 (3000+5000)** — le prompt généré passe INTACT, la coupe ne s'applique qu'aux documents collés géants.
  - Budget payload : 1200/2200 → **4800 chars** — le dernier message utilisateur est toujours ajouté en ENTIER (l'historique seul est élagué).
  - Aucun risque 413 supplémentaire : `max_tokens` Groq s'ajuste automatiquement (input + max_tokens = constante ~4200 < 6000 TPM).
- Vérifié : `node --check` OK + test simulé (prompt 1400-3000 chars : intact, « Contexte de la formation » + consignes 1-9 présents).
- mjr3 : `APP_VERSION` `1.6.2` → `1.6.3`.

## Session 16/08/2026 — Fix : réponse IA tronquée (grille 4×4, indicateurs, conclusion manquants)

- Symptôme rapporté : la réponse s'arrête en plein milieu (à « Tâche demandée » de l'évaluation) — la grille d'évaluation 4×4, les critères de performance, les indicateurs ✅ et la conclusion ne sont JAMAIS générés, alors que le prompt le demande.
- Cause racine : `max_tokens` Groq trop restrictif. La copie actuelle calculait `floor(TPM × 0.55) − input − 200` → pour un prompt de ~2900 chars + sysPrompt, ~3300 tokens de sortie ≈ 10 000 chars seulement — le document complet fait ~15-20 000 chars → troncature nette.
- Comparaison `ver 100113 daridja` : elle envoyait `max_tokens: 8192` FIXE pour Groq → réponses complètes (mais 413 TPM possibles).
- Fix (`js/shared.v2.js` callProvider, bloc Groq) :
  - `max_tokens = max(2048, min(8192, floor(TPM × 0.85) − input − 200))` → gpt-oss-120b (TPM 8000) : ~5256 tokens ≈ 16 800 chars de sortie ; gpt-oss-20b/qwen (TPM 6000) : ~3556 tokens ≈ 11 400 chars.
  - Requested = input + max_tokens ≈ 85 % TPM − 200 < TPM → JAMAIS de 413 par taille ; si la fenêtre roulante Used est haute → 429 → cooldown intelligent + fallback (déjà gérés).
  - Regex TPM : `llama-3.1-8b-instant|openai/gpt-oss-20b|qwen/qwen3.6-27b` → 6000 (gpt-oss-20b et qwen avaient faussement 8000 avant).
- Vérifié : `node --check` OK + simulation (gpt-oss-120b : sortie ≈ 16 800 chars, Requested 6600 < 8000).
- mjr3 : `APP_VERSION` `1.6.3` → `1.6.4`.
- Vérifié : `node --check` `js/shared.v2.js` OK.

## Session 16/08/2026 — Fix : balise `<br>` affichée en texte littéral dans les tableaux

- Symptôme rapporté : dans la réponse IA (tableau Catégorie/Éléments — savoirs théoriques, savoir-faire, etc.), la balise `<br>` de l'IA s'affiche en texte brut « <br> » au lieu d'un saut de ligne.
- Cause racine : `markdownToHtml` (`js/shared.v2.js` l.2055) échappe `<` → `&lt;` AVANT le traitement des tableaux → le `<br>` que l'IA met dans les cellules devient du texte littéral `&lt;br&gt;`.
- Fix (`js/shared.v2.js` `markdownToHtml`) :
  - AVANT l'échappement `&<>` : les `<br>` (et variantes `<br/>`, `<BR>`...) sont protégés par un placeholder `@@BR@@` (regex `<\s*br\s*\/?>/gi`).
  - APRÈS la conversion `\n → <br>` (fin de fonction) : le placeholder est restauré en vraie balise `<br>` — rendue correctement dans les cellules de tableaux ET hors tableaux (survit à `sanitizeHtml`, qui ne retire que script/iframe/on*).
- Vérifié : `node --check` OK + test simulé Node (tableau pipes avec `<br>` dans les cellules → `<td>... <br>...` réels, 0 occurrence `&lt;br&gt;`, hors tableau aussi OK).
- mjr3 : `APP_VERSION` `1.6.4` → `1.6.5`.

## Session 16/08/2026 — Fix : message « Aucun fournisseur IA disponible » trompeur (génération présentation)

- Symptôme rapporté : « ❌ Aucun fournisseur IA disponible / Tous les quotas gratuits sont épuisés (Gemini, Groq, OpenRouter)... » lors d'une génération de présentation — message affiché alors que la cause réelle pouvait être différente (clé API manquante, 404 modèle inexistant, 429 ponctuel).
- Cause racine : les `catch` de la génération de présentation (gamma) AVALAIENT l'erreur réelle (`console.error` seul) et affichaient toujours le message générique « quotas épuisés » → diagnostic impossible.
- Fix :
  - `js/shared.v2.js` (catch gamma, anciennement l.2831) : affiche maintenant l'ERREUR RÉELLE (`err.message` — ex. « Clé API manquante pour Gemini », « HTTP 404: model not found », « HTTP 429: ... ») ; le rappel « Quotas gratuits épuisés / ajoutez une clé payante » n'est ajouté QUE si l'erreur est bien liée aux quotas (regex 429|daily|quota|limit|épuis|exhausted|RESOURCE_EXHAUSTED).
  - `js/from-doc.js` (catch l.259) : même correctif (variante sans `__compat`).
- Vérifié : `node --check` OK (les deux fichiers).
- mjr3 : `APP_VERSION` `1.6.5` → `1.6.6`.

## Session 16/08/2026 — Fix : « Le modèle n'a pas retourné de JSON valide » (génération présentation)

- Contexte : après le fix v1.6.6 (erreur réelle affichée), le vrai diagnostic est apparu : « Le modèle n'a pas retourné de JSON valide. » lors de la génération de présentation (gamma).
- Cause racine probable : réponse TRONQUÉE — max_tokens Groq 85 % TPM (v1.6.4) ≈ 10-15k chars pour une présentation 16 slides TRÈS détaillée (15-20k chars) → le JSON est coupé avant l'accolade fermante → `end === -1` → message d'erreur. Le prompt gamma exige du JSON pur (l.2734 « SORTIE : UNIQUEMENT le JSON valide ») et la réponse n'est jamais complétée.
- Fix (`js/shared.v2.js` + `js/from-doc.js`) :
  - Nouveau helper partagé `window.parseGammaJson(fullResponse, opts)` (défini avant `generateGammaPresentation`) : extraction robuste — fences markdown ```` ```json ```` supprimées, bloc `{...}` équilibré isolé, virgules finales nettoyées (comportement conservé).
  - **CONTINUATION AUTOMATIQUE** : si le JSON est incomplet (accolades non équilibrées) ou invalide, le modèle reçoit « Continue EXACTLY from where the JSON stopped... » avec les 1500 derniers caractères → la suite est APPENDUE à `fullResponse` → re-parsing (jusqu'à 3 essais / 2 continuations, fallback de modèle actif via `callAI`).
  - Erreurs diagnostiques : « Début de réponse : « ... » » si aucun `{` (réponse vide/texte), « Fin de réponse : « … » » après 3 essais (troncature confirmée).
  - Les deux sites de parsing (shared.v2.js gamma + from-doc.js) appellent le helper ; l'UI `loadingSub` affiche « Suite JSON (modèle) » pendant les continuations.
- Vérifié : `node --check` OK (2 fichiers) + simulation Node (JSON tronqué au milieu d'une chaîne → 1 continuation → 2 slides parsés intacts).
- mjr3 : `APP_VERSION` `1.6.6` → `1.6.7`.

## Session 16/08/2026 — Fix : présentation toujours invalide après continuations — RETRY gros budget (comparaison ver 100113)

- Symptôme : « Le modèle n'a pas retourné de JSON valide après 3 essais » — même après 2 continuations, la réponse finit par « … ] } ] » (JSON jamais complet).
- COMPARAISON `ver 100113 daridja` (demandée par l'utilisateur) : elle envoie `max_tokens: 8192` FIXE pour Groq (shared.v2.js l.2436) → Requested = input + 8192 > TPM gratuits (6000/8000) → 413 SYSTÉMATIQUE → fallback immédiat vers Gemini/OpenRouter (8192 de sortie ≈ 25k chars) qui complètent le JSON. C'est pour cela que les présentations marchaient chez elle.
- Notre version (v1.6.4) : max_tokens 85 % TPM évite le 413 mais Groq RÉUSSIT en tronquant (~10-14k chars < ~22k chars d'une présentation 16 slides) → JSON invalide SANS jamais basculer vers un autre fournisseur (pas d'erreur → pas de fallback).
- Fix (`js/shared.v2.js` + `js/from-doc.js`) :
  - Nouveau helper `window.generateGammaJson(msgs, opts)` (partagé) : génère le JSON via `callAI` ; si le JSON est invalide (message contenant « JSON » → troncature), RETRY automatique sur modèles à GROS budget de sortie : `gemini-flash` → `or-nemotron-super-free` → `gemini-pro` (8192 tokens ≈ 25k chars). Les erreurs quotas/clés ne déclenchent PAS le retry (propagées directement).
  - `callAI` (chemin forceProvider) : `forceModel` est maintenant résolu via `MODEL_MAP` (clé → nom API réel) — avant, la clé passait telle quelle au fournisseur (ou 'auto'/models[0]).
  - Les deux générateurs (gamma + from-doc) appellent `generateGammaJson` ; continuations `parseGammaJson` conservées (1er niveau de récupération).
- Vérifié : `node --check` OK (2 fichiers) + simulation Node du flux complet : auto (tronqué) → 2 continuations ratées (garbage) → retry forceProvider=gemini forceModel=gemini-flash → 2 slides complets.
- mjr3 : `APP_VERSION` `1.6.7` → `1.6.8`.

## Session 16/08/2026 — Fix : modèles Gemini retirés par Google + slug OpenRouter invalide (comparaison ver 10093)

- Symptôme : le retry gros budget (v1.6.8) remontait `HTTP 404: This model models/gemini-2.5-pro is no longer available to new users` (recommandation Google : Interactions API).
- COMPARAISON `ver 10093 - Copie (3)` (demandée) : config Gemini IDENTIQUE à la nôtre (`gemini-flash` → `gemini-2.0-flash`, `gemini-pro` → `gemini-2.5-pro`, PROVIDERS `["gemini-2.5-flash","gemini-2.5-pro","gemini-1.5-flash"]`) — la 10093 aurait le même bug, RIEN à porter.
- Recherche web (dép. Google Gemini API 2026) : `gemini-2.0-flash` DÉPRÉCIÉ → remplacement `gemini-3.6-flash` ; `gemini-2.5-pro` restreint aux utilisateurs ayant déjà utilisé les 2.5 (arrêt officiel 16/10/2026) → remplacement `gemini-3.1-pro-preview` ; `gemini-1.5-flash` déprécié. `generateContent`/`:streamGenerateContent` TOUJOURS supporté → PAS de migration Interactions API nécessaire, seuls les NOMS changent.
- Fix modèles Gemini (`js/shared.v2.js`) :
  - MODEL_MAP : `gemini-flash` → `gemini-3.6-flash` ; `gemini-pro` → `gemini-3.1-pro-preview`.
  - PROVIDERS gemini models : `["gemini-3.6-flash", "gemini-3.1-pro-preview", "gemini-3.5-flash-lite"]` (noms 2.5/1.5 retirés).
- Découverte supplémentaire (API publique OpenRouter) : `inclusionai/ling-3.0-flash:free` N'EXISTE PAS (seul `inclusionai/ling-3.0-flash` payant ; aucune variante ling `:free`) → le modèle porté de la 100116 404 systématiquement chaque jour (cooldown « fin de jour »). RETIRÉ partout : MODEL_MAP, PROVIDERS openrouter, FALLBACK_ORDER, i18n FR/AR/EN (clé `modelLing3Free`), radios `modelChoice` des 10 pages HTML (about, admin, aide, aide-cles-api, assistant, challenges, from-doc, generator, index, quiz) — vérifié 0 occurrence restante hors journaux .md. Les autres slugs :free validés OK sur l'API OpenRouter (nemotron-3-super, gemma-4-31b-it, gpt-oss-20b, nemotron-3-nano).
- Vérifié : `node --check` OK ; radios generator.html = référence 100116 − ling ; 0 occurrence `or-ling3` dans le code.
- mjr3 : `APP_VERSION` `1.6.8` → `1.6.9`.

## Session 16/08/2026 — REVERT des helpers JSON (v1.6.7/v1.6.8) + purge cooldowns obsolètes (demande utilisateur)

- Contexte : l'utilisateur a demandé de « revenir à la version avant ». Symptômes observés dans la console :
  - `Modèle gemini-flash en cooldown [400/404] → réessai 00:10` — les cooldowns 400/404 de la JOURNÉE (créés par les ANCIENS noms gemini-2.0-flash/2.5-pro) sont stockés par CLÉ de modèle (`gemini-flash`) et bloquent les NOUVEAUX noms (gemini-3.6-flash) jusqu'à minuit+10 min.
  - Groq saturé : `429 - Limit 8000, Used 7973` (fenêtre roulante consommée par les tests) → tous les modèles morts/429 en même temps.
  - « 1 / 0 » = modal vide (renderGammaSlides avant génération, gammaData=null) — PAS un bug nouveau.
- Décision : REVERT des changements v1.6.7/v1.6.8 de la génération présentation (comportement v1.6.6) :
  - Supprimé `window.parseGammaJson` (continuation « Continue EXACTLY... ») et `window.generateGammaJson` (retry gros budget + forceProvider/forceModel).
  - `generateGammaPresentation` (shared.v2.js) et from-doc.js : blocs de parsing ORIGINAUX restaurés (`JSON.parse` + extraction `{...}` équilibré + erreur « Le modèle n'a pas retourné de JSON valide. »).
  - `callAI` chemin forceProvider : ligne originale restaurée (`modelSel || p.models[0]`, sans résolution MODEL_MAP).
- CONSERVÉ (fixes validés indépendants, révoquer = 404 garantis) : v1.6.6 (erreur RÉELLE affichée au lieu du message générique), v1.6.9 (gemini-flash → gemini-3.6-flash, gemini-pro → gemini-3.1-pro-preview, or-ling3-free retiré).
- AJOUT : `checkVersionNotification` purge désormais les clés `axon_dead_*` (cooldowns modèle) quand `app_version` change → les cooldowns obsolètes d'une config modèle précédente ne bloquent plus la nouvelle (le bump 1.7.0 effacera les entrées « réessai 00:10 »).
- Vérifié : `node --check` OK (2 fichiers) ; 0 occurrence `parseGammaJson`/`generateGammaJson`/« Suite JSON »/« Continue EXACTLY ».
- mjr3 : `APP_VERSION` `1.6.9` → `1.7.0`.

## Session 16/08/2026 — PORTAGE MODÈLES depuis référence « ver 100117 16.08.2026 reprise changement du modeles » (demande utilisateur)

- Référence : `D:\platform APC IMAGES\ver 100117   16.08.2026 reprise changement du  modeles` (v1.5.9) — config modèles = finale souhaitée par l'utilisateur. Consigne : « change que les nouveaux modelés » — ne toucher QUE la config modèles, rien d'autre.
- DÉCISION UTILISATEUR (question posée) : GARDER les noms Gemini 2026 vérifiés (gemini-3.6-flash / gemini-3.1-pro-preview) au lieu de la référence (gemini-2.0-flash DÉFUNCT 01/06/2026 → 404 garanti ; gemini-2.5-pro fermeture 16/10/2026). Vérifié sur ai.google.dev/gemini-api/docs/deprecations (16/08/2026).
- Porté depuis la référence :
  - `groq-fast` → `llama-3.1-8b-instant` (était gpt-oss-20b) ; ajout `groq-scout` → `openai/gpt-oss-120b` (comme groq-llama) ; retrait `groq-qwen` (qwen3.6-27b) — GROQ limité à `[gpt-oss-120b, llama-3.1-8b-instant]` dans PROVIDERS.
  - OpenRouter free : `llama32-free` (llama-3.2-3b-instruct:free), `hermes405b-free` (hermes-3-llama-3.1-405b:free), `owl-alpha` (nemotron-nano-9b-v2:free — remplace or-nemotron-nano-free/nano-30b), `llama4-scout-free` (gpt-oss-20b:free), `deepseek-v3-free` (nemotron-3-super-120b-a12b:free) + `llama3.3-free` (non radio). Retrait `or-gemma4-free` (gemma-4-31b-it:free).
  - PROVIDERS.openrouter : gemma-4-31b-it:free → nemotron-nano-9b-v2:free.
  - FALLBACK_ORDER = `['gemini-flash','groq-llama','gemini-pro','groq-fast','groq-scout','deepseek-v3-free','owl-alpha','llama4-scout-free']` ; groqModels = `['groq-llama','groq-fast','groq-scout']`.
  - i18n FR/AR/EN : 12 clés modèles (modelGroqScout, modelLlama32Free, modelHermes405bFree, modelDeepseekV3Free, modelOwlAlpha, modelLlama4ScoutFree) ; libellés Gemini 2026 (3.6 Flash / 3.1 Pro) ; geminiKeyHint mis à jour 3.6/3.1.
  - 10 pages HTML (about, admin, aide, aide-cles-api, assistant, challenges, from-doc, generator, index, quiz) : bloc radios = 12 valeurs référence, script PowerShell regex (indentation préservée par page).
- Vérifié : `node --check` OK ; 0 occurrence des anciennes clés (groq-qwen, or-gemma4, or-gptoss20b, or-nemotron*, qwen3.6, gemma-4-31b, nano-30b) hors .md ; 6 radios × 10 pages OK.
- mjr3 : `APP_VERSION` `1.7.0` → `1.8.0`.

## Session 16/08/2026 — LOGS DE DIAGNOSTIC callAI (réponse IA « pend » silencieusement)

- Symptôme (logs utilisateur ×3) : `garde-fou` puis PLUS RIEN — aucun « Modèle échoué » ni cooldown. Cause probable : le fetch vers gemini-3.6-flash (1er de FALLBACK_ORDER) est EN VOL ou PENDU sans aucun log → l'utilisateur ne voit rien pendant les 120 s de timeout, puis abandonne avant le fallback.
- Ajouts diagnostics dans callAI/callProvider (shared.v2.js) :
  - `🎯 [callAI] essai <key> → provider/model ...` (début d'essai, après check cooldown)
  - `⏱️ [callAI] timeout 120s → abandon du modèle <model>` (callback du setTimeout)
  - `✅ [callAI] <model> : réponse reçue (stream)` (premier chunk)
  - `🏁 [callAI] <model> : stream terminé` (fin du flux)
- Prochain test : Ctrl+F5 (purge cooldowns) → envoyer une question → si `🎯 essai gemini-flash` reste le dernier log → fetch pendu (réseau DNS/firewall vers generativelanguage.googleapis.com) ; vérifier onglet Network (statut de la requête). 
- mjr3 : `APP_VERSION` `1.8.0` → `1.8.1`.

## Session 16/08/2026 — TIMEOUT DE CONNEXION 25s (réponse IA qui pendait : « ça marchait avant »)

- Diagnostic confirmé par les logs : `🎯 essai gemini-flash → gemini/gemini-3.6-flash` puis `garde-fou` puis RIEN (ni ⏱️ ni échec) → le fetch vers Gemini PENDAIT (réseau vers generativelanguage.googleapis.com lent/bloqué chez l'utilisateur). « Ça marchait avant » = AVANT, gemini-flash était sauté (cooldown 404 des anciens noms) et c'est llama3.3 (OpenRouter) qui répondait.
- Fix (shared.v2.js callProvider/callModel) :
  - **Connect timeout 25 s** : si aucune réponse HTTP après 25 s → abort + `_markModelDead('timeout réseau')` (cooldown 5 min, raison « autre ») + fallback immédiat → Groq/llama3.3 répondent comme avant.
  - Stream timeout 120 s conservé (réponses longues 8k tokens) ; distinction via `_abortReason` ('connect-timeout'/'stream-timeout' vs arrêt manuel sans raison).
  - `let timeoutId` déplacé hors du try (bug de scope finally corrigé au passage).
- Test : Ctrl+F5 → question → les logs 🎯→⏱️(25s)→🚫 gemini→✅ llama3.3 doivent montrer la chaîne.
- mjr3 : `APP_VERSION` `1.8.1` → `1.8.2`.

## Session 16/08/2026 — RÉPONSE GEMINI VIDE : `🏁 stream terminé` SANS `✅ réponse reçue`

- Logs utilisateur : `🎯 essai gemini-flash` → `garde-fou` → `🏁 gemini-3.6-flash : stream terminé` MAIS AUCUN `✅ réponse reçue` → la connexion marche désormais (le timeout 25 s a réglé la pendaison) mais le stream livre ZÉRO contenu (blocage sécurité / thinking / parsing parts).
- Fix (shared.v2.js callProvider) :
  - Parsing Gemini : TOUTES les `parts` concaténées (`parts.filter(x => !x.thought).map(x => x.text)` avec repli sur le texte de pensée si rien d'autre) au lieu de `parts[0].text`.
  - `generationConfig.thinkingConfig = { thinkingBudget: 0 }` : désactive le mode pensée de gemini-3.6-flash (il pouvait consommer les 8192 tokens sans produire de texte).
  - Réponse VIDE → log `⚠️ réponse VIDE — dernier chunk: <json>` (diagnostic finishReason/candidates) + throw → cooldown 5 min + fallback llama3.3 (plus jamais de réponse muette).
- Test : Ctrl+F5 → question → si `✅ réponse reçue` + texte → résolu ; sinon le `⚠️ dernier chunk` donnera la cause exacte (SAFETY, MAX_TOKENS...).
- mjr3 : `APP_VERSION` `1.8.2` → `1.8.3`.

## Session 16/08/2026 — GAMMA : `thinkingConfig` retiré (400) + parsing JSON robuste (politique = celle de l'Assistant)

- Logs utilisateur : chat OK via groq-llama (✅ réponses) MAIS `POST gemini-3.6-flash:streamGenerateContent → 400 INVALID_ARGUMENT` = causé par `thinkingConfig: { thinkingBudget: 0 }` ajouté en 1.8.3 (argument invalide pour gemini-3.6-flash) → cooldown [400/404] jusqu'à 00:10 → Gemini mort toute la journée.
- Présentation (gamma) : politique DÉJÀ identique à l'Assistant (même callAI/fallback) — l'utilisateur demande de la conserver. Échec réel : gemini indisponible (400) → groq-oss-120b répond mais max_tokens=4097 (TPM 8000×0.85) TRONQUE le JSON 16 slides → « Le modèle n'a pas retourné de JSON valide ».
- Fix :
  - `thinkingConfig` RETIRÉ (gemini-3.6-flash redevient fonctionnel, maxOutputTokens 8192 → complète le JSON comme avant).
  - Parsing gamma renforcé : fences markdown ```json``` supprimées ; si accolades déséquilibrées (JSON tronqué) → réparation : suppression virgules de queue + fermeture automatique des `[` puis `{` restants ; échec final → log `⚠️ [gamma] JSON irréparable — réponse brute (600)` (diagnostic) + message propre.
- Test : Ctrl+F5 → générer présentation → gemini-3.6-flash doit reprendre (8192 tokens, JSON complet) ; si groq seul → réparation tronqué tentée.
- mjr3 : `APP_VERSION` `1.8.3` → `1.8.4`.

## Session 16/08/2026 — GAMMA : logique de présentation de « ver 24 rapide » appliquée (demande utilisateur)

- Décision utilisateur : « Appliquer sa logique à D:\platform APC » — logique présentation de `D:\platform APC IMAGES\ver 24 rapide` (qui marchait) ; la logique de l'ASSISTANT est conservée telle quelle.
- Logique ver 24 rapide appliquée à generateGammaPresentation (shared.v2.js) :
  - PROMPT COMPACT 15 slides (structure obligatoire 15 items : Scénario APC, Analyse tableau S/SF/SE, Ressources, Situation Pro, Phases 1-5, Évaluation, Critères, Grille 4×4, Indicateurs, Conclusion) + « SORTIE : UNIQUEMENT le JSON valide, sans texte avant/après » — remplace l'ancien prompt 16 slides TRÈS DÉTAILLÉ (5000 chars) qui saturait le budget Groq (input 2503 tok → max_tokens 4097 → JSON tronqué).
  - `msgs = [{ role: 'system', content: prompt }]` (comme ver 24, était 'user').
  - `callAI(..., 'groq', 'groq-llama')` : GROQ FORCÉ (mini-fallback interne groq-llama → groq-fast → groq-scout) — fini le passage par Gemini (réponse vide) avant d'arriver à Groq.
  - Parsing robuste conservé (fences + réparation tronqué + log réponse brute — sur-ensemble du parsing simple de ver 24) ; vérif clé Groq conservée (ver 24 vérifiait OpenRouter par erreur — non repris).
- Vérifié : `node --check` OK ; 0 occurrence du prompt 16 slides ; nouvelle logique présente (15 slides, system, groq forcé).
- Test : Ctrl+F5 → assistant → Générer présentation → Groq gpt-oss-120b (input court → max_tokens ≈ 5900 → JSON 15 slides complet).
- mjr3 : `APP_VERSION` `1.8.4` → `1.8.5`.

# Session du 16/08/2026 — règle mjr4 (modèles vs code)

- Demande utilisateur : « on ne change que le modèle si on ne change pas le code » → nouvelle règle **mjr4** ajoutée dans la section # Règles : un changement de MODÈLES ne touche QUE la configuration des modèles (MODEL_MAP, PROVIDERS, FALLBACK_ORDER, groqModels, i18n modèles, radios HTML) — JAMAIS le code applicatif (prompts, parsing, logique) ; inversement, un changement de code ne touche pas les modèles.
- Aucun changement de code ni de modèles dans cette session (mise à jour .md uniquement) → pas de bump APP_VERSION.

## Session 28/10/2026 — PRÉSENTATION : IMAGES MANQUANTES SUR CERTAINES SLIDES (quota pollinations 402)

- Symptôme utilisateur : « générer présentation : les images parfois ne se génèrent pas sur toutes les slides ». Analyse demandée d'abord (« ne change rien, voir analyse et propose »), puis application de la recommandation (A file séquentielle + B clé facultative + C repli Commons + E 6 images + F robustesse).
- Cause RACINE mesurée en direct (pas supposée) : l'API image gratuite pollinations.ai n'autorise qu'UNE image toutes les 45 s par adresse IP ; au-delà → HTTP 402 avec en-tête `Retry-After` (18 s mesuré). Tests : 1 image = 200 `image/jpeg` en ~4,7 s ; 6 en parallèle = 6×402 ; immédiat / +15 s = 402 ; après ~45-60 s = 200. Doc officielle : « One at a time, at least 45 seconds apart ».
- Aggravations côté code : `generateImage()` ne faisait AUCUNE requête (il fabriquait seulement une URL) → aucun échec détecté, le `timeout(8 s)` et la boucle `attempt` étaient du code mort ; les 15 `<img>` étaient demandés d'un coup par le navigateur ; seed aléatoire + changement de modèle au retry (cassait le cache `immutable`) ; `Retry-After` jamais lu ; paramètres obsolètes (`model=flux`/`flux-schnell` ignorés → modèle unique `sana`, 768×768 max, `nolicense=1` inutile).
- Correctif (AJOUT SEUL — les anciennes fonctions restent définies mais ne sont plus appelées) : module `APC_IMG` en fin de `js/shared.v2.js`, qui remplace `generateImage`, `generateAllImages`, `retrySlideImage`.
  - File d'attente SÉQUENTIELLE via `fetch` + blob (CORS `*`, `Retry-After` exposé) : 1 image / 45 s, respect de `Retry-After`, 3 essais.
  - Clé Pollinations facultative (⚙️ Paramètres → `pol_key`) : `https://gen.pollinations.ai/image/...` + `Authorization: Bearer` (préflight vérifié : `Access-Control-Allow-Headers: authorization`) → plus de quota par IP, blob URL gardée en mémoire (`image_source='pollkey'`).
  - Repli automatique Wikimedia Commons (gratuit, sans quota) → aucune slide vide.
  - 6 images IA par défaut (réglable 4/6/8/10/15) réparties régulièrement (`pickIndices`) + complément Commons pour les autres slides.
  - Seed figé par hachage du prompt (`seedOf`) → même URL = même image = cache Pollinations instantané et gratuit ; paramètres morts supprimés.
  - Statut visible 🖼️ « Image 3/6 » + barre de progression ; sauvegarde de `gammaData` après CHAQUE image.
- Correctifs annexes : export PPTX (largeur du texte 12.33 seulement si l'image a réellement été récupérée → plus de colonne vide ; `urlToBase64` timeout 5 s → 30 s, en-tête Authorization pour gen.pollinations.ai, rejet des réponses non-OK) ; banque d'images : seules les images IA sont enregistrées (`image_source !== 'commons'`, dans `shared.v2.js` ET `from-doc.js`) ; persistance de `gammaData` dans le `.then` de `generateGammaPresentation`.
- Vérifié : `node --check` OK sur `js/shared.v2.js` et `js/from-doc.js` ; banc d'essai isolé (VM) — scénario A (IA + Commons) : 2 images IA + 1 Commons, sources correctes, `gammaData` persisté ; scénario B (IA en échec) : 3/3 reconstruites via Commons ; scénario C (tout en échec) : 0 image, aucun plantage, tableau vide retourné.
- Test navigateur : Ctrl+F5 → générer une présentation → pastille 🖼️ en bas à droite ; sans clé ≈ 45 s par image IA puis repli Commons (≈ 3-5 min au total), avec clé quasi immédiat.
- mjr3 : `APP_VERSION` `1.8.5` → `1.8.6`.
## Session 28/10/2026 — « ÇA GÉNÈRE AUCUNE IMAGE » : CSP `connect-src` bloquait `fetch` (v1.8.7 → 1.8.9)

- Symptôme : après le correctif v1.8.6, **plus aucune image** dans les présentations (0/15).
- Diagnostic dans le navigateur (site déployé, console + `evaluate`) : `fetch('https://image.pollinations.ai/...')` → `TypeError: Failed to fetch`, idem `commons.wikimedia.org`. Cause : la balise `<meta http-equiv="Content-Security-Policy">` de 6 pages (`index`, `login`, `admin`, `admin-sessions`, `challenges`, `challenge-cards`) limitait `connect-src` à Supabase/OpenRouter/Groq/Gemini/EmailJS. L'ancien code posait des `<img src>` (autorisés par `img-src 'self' data: https:`), le nouveau pipeline passe par `fetch` → bloqué. **Vérifié aussi que le dépôt consulté par l'utilisateur est le PRIVÉ** `APC-ALG-RIE-G-N-RATION-3-G-n-rez-` (celui relié à Vercel), et non le public `...-des-prompts-professionnels` : les deux sont désormais synchronisés.
- v1.8.7 — CSP : ajout de `https://image.pollinations.ai`, `https://gen.pollinations.ai`, `https://commons.wikimedia.org`, `https://upload.wikimedia.org` dans `connect-src` des 6 pages (1 ligne par fichier). Sécurité dans `tryFree` : si `fetch` échoue 2 fois avec status 0 (CSP/réseau, ex. HTML en cache), bascule automatique en mode `<img>` direct (comportement d'avant) au lieu de 0 image ; la clé Pollinations est alors ignorée (un `<img>` ne peut pas envoyer `Authorization`).
- v1.8.8 — repli Commons : les requêtes en français ne renvoyaient **aucun** résultat (« maintenance informatique » → 0, « vocational training » → 8). Ajout d'un dictionnaire FR→EN des mots métier, de requêtes génériques tournantes (`vocational training`, `classroom`, `workshop tools`, `computer lab`, `students learning`, …) et d'une déduplication (`S.used`) : chaque slide reçoit une image différente.
- v1.8.9 — qualité Commons : les résultats contenaient des pages de livres `.djvu`, des PDF et des SVG (affichés comme des scans). Ajout de l'opérateur `filetype:bitmap` dans `gsrsearch` + filtre mime strict `image/jpeg|png|webp` → 100 % d'images exploitables (même pour les requêtes en français).
- Vérification réelle (Chromium, site déployé) : `fetch` Pollinations = 200 en 3,3 s ; Commons EN = 12/12 utilisables ; pipeline complet sur 5 slides factices = **5/5 images, 5 distinctes, 8,9 s** (1 IA + 4 Commons). `node --check` OK ; banc d'essai 4 scénarios (A/B/C/D) OK, dont D « requêtes FR à 0 résultat → repli EN » = 3/3 images distinctes.
- Push : dépôt **privé** (Vercel) `cf75527` → `5c53a3a` → `e7d0c97` ; dépôt **public** `b39b0ff` → `f5d3a13` → `efddec5`. Les deux dépôts sont au même contenu.
- mjr3 : `APP_VERSION` `1.8.6` → `1.8.7` → `1.8.8` → `1.8.9`.
## Session 28/10/2026 — IMAGES : « doit correspondre au CONTENU du texte, pas seulement au titre » (v1.9.0 → 1.9.6)

- Demande utilisateur : « corrige les images doit correspondre au contenu de texte pas que sur le titre de diapo ». Objectif : que chaque image illustre ce que dit la diapo, et non son seul titre.
- v1.9.0 — les mots-clés viennent maintenant du CONTENU (contenu prioritaire sur le titre), avec une liste de mots vides FR/EN et les verbes de consigne (`réaliser`, `vérifier`, `analyser`…) écartés (ils ne décrivent aucune image). Prompt IA = `image_prompt` + titre + mots-clés du contenu ; requêtes Wikimedia = mots du contenu. Dictionnaire FR→EN enrichi (diagnostic, panne, câblage, disjoncteur, chantier, atelier, soudure, topographie…).
- v1.9.1 — Commons applique un ET implicite : mesuré `electrical panel circuit breaker` = 6 résultats contre `wiring multimeter manual equipment` = 0. Requêtes raccourcies à 4 mots (FR), 3 puis 2 mots (EN).
- v1.9.2 — les mots pédagogiques abstraits (`savoirs`, `critères`, `grille`, `évaluation`…) ne représentent rien : ajoutés aux mots vides, seuls les mots concrets pilotent l'image.
- v1.9.3 — priorité à l'article **Wikipédia** du mot-clé (bien plus pertinent qu'une recherche plein texte Commons) : « Multimètre » → `Digital_Multimeter_Aka.jpg`, « Disjoncteur » → `Circuit_breaker_2_pole_on_DIN_rail.JPG`. CSP `connect-src` : ajout de `fr.wikipedia.org` / `en.wikipedia.org` dans les 6 pages.
- v1.9.4 — pertinence resserrée (3 défauts constatés en direct : « conformité » → logo du Conseil constitutionnel, « normes » → schéma « Hiérarchie des normes », « respect » → peinture) :
  - filtre de noms de fichiers (logo, blason, armoirie, drapeau, sceau, diagramme, schéma, organigramme, carte, graphique, `.svg`) ;
  - contrôle de SUJET : le nom du fichier doit citer le mot-clé ou sa traduction anglaise (rejette « Ulysses preparations » pour « technicien ») ;
  - l'article Wikipédia exact n'est plus remplacé par une recherche floue s'il n'a pas de photo correcte ;
  - en recherche, le titre doit être le mot-clé exact ou « mot-clé (précision) » (« Chantier (bâtiment) » oui, « Réseau social » non — v1.9.6) ;
  - note des fichiers : nombre de mots du sujet cités, bonus photo `.jpg/.webp`, malus `.png` (souvent un schéma) ;
  - mots « méta » écartés (conformité, délais, normes, respect, tolérance…) ; `sécurité` → `safety helmet`, `mesure` → `measuring instrument` ;
  - **cache localStorage + budget de 26 appels + arrêt dès qu'une requête donne un fichier pertinent** : avant, 9 requêtes étaient lancées par diapo et Wikimedia répondait `429 (You are making too many requests)` → les dernières diapos n'avaient plus d'image. Une pause de 1,5 s + une nouvelle tentative est faite sur 429.
- v1.9.5 — le titre repasse en tête des mots-clés (les titres creux « Analyse des savoirs », « Grille critériée » sont neutralisés par les mots vides, donc seuls les titres porteurs — « Topographie », « Techniques de soudure » — orientent la recherche) et les requêtes mot à mot n'utilisent plus de mot français brut (« station » → gare de Chicago, « commande » → souffleuse).
- v1.9.6 — fichiers `.svg.png` refusés, traductions vagues (`management`, `network`, `security`…) retirées des requêtes, titre Wikipédia strict.
- Mesures réelles (Chromium, site déployé, 1 image IA + complément Commons) :
  - diapos électricité (5) : `Digital_Multimeter_Aka.jpg`, `High-voltage_wiring`, `Wiring_in_wet_rooms`, `Circuit_breaker_2_pole_on_DIN_rail` → 5/5 en 4,9 s ;
  - diapos métiers (5) : `Hand_Hygiene`, `Wiring_in_wet_rooms`, `Surveying_prism_and_total_station`, `Kerosene_inventory_stock_levels` → 5/5 en 6,8 s.
  - Avant correctif : logos et schémas hors sujet, et 1 diapo sur 4 sans image.
- Note technique : Wikimedia limite par identifiant client — Node/curl (`User-Agent` technique) reçoivent `429`, le navigateur reçoit `200`. Les essais de pertinence doivent donc se faire dans le navigateur.
- Push : dépôt **privé** (Vercel) `9f6e113` → `6979861` ; dépôt **public** `c2fe219` → `081a5d3` (même contenu).
- mjr3 : `APP_VERSION` `1.8.9` → `1.9.0` → `1.9.1` → `1.9.2` → `1.9.3` → `1.9.4` → `1.9.5` → `1.9.6`.

## État du schéma Supabase — `supabase-schema.sql` (vérifié v1.9.6)

- Fichier unique de référence : `supabase-schema.sql` (racine). À exécuter en entier dans **Supabase → SQL Editor**.
- **23 tables** : `profiles`, `specialities`, `modules`, `competences`, `courses`, `scenarios`, `presentations`, `generated_images`, `prompts_examples`, `course_favorites`, `quizzes`, `quiz_attempts`, `quiz_access_codes`, `competence_flowers`, `challenges`, `challenge_teams`, `challenge_participants`, `challenge_rounds`, `challenge_submissions`, `ai_conversations`, `user_activity_log`, `game_saves`, `axon_memory`. RLS **activée sur les 23** (69 policies).
- **Mise à jour 28/10/2026** :
  - section 25 (nouvelle) — pipeline d'images v1.8.6 → v1.9.6 : colonne `generated_images.source` (`ia` par défaut, `pollkey` avec clé API ; **les images Commons/Wikipédia ne sont jamais enregistrées dans la banque**), index `idx_images_created`, `idx_images_visibility`, `idx_presentations_created` ;
  - le script est désormais **ré-exécutable sans erreur** : `DROP POLICY IF EXISTS` avant chaque `CREATE POLICY`, `DROP CONSTRAINT IF EXISTS` avant `unique_quiz_code` et `unique_challenge_code` ;
  - correction d'un défaut historique : `competence_flowers` référençait `challenge_participants` et `challenges` **avant** leur création → la table n'était pas créée au 1er passage. Les 2 colonnes (`participant_id`, `challenge_id`) sont maintenant ajoutées en section 17bis, après les tables référencées ;
  - numérotation des sections corrigée (deux « 22 » → 22 et 23).
- **Validation réelle** (PostgreSQL 17.11 local, base vierge + schéma `auth` de substitution) : 1re passe = **0 erreur**, 2e passe = **0 erreur**, 23 tables créées, RLS partout, 69 policies, clés étrangères de `competence_flowers` présentes.
- Règle : toute évolution du schéma s'ajoute **en fin de fichier**, en section idempotente, et se reporte dans `AGENTS.md` + `RAPPORT_PLATEFORME.md`.
