# RAPPORT COMPLET — APC Algérie GÉNÉRATION 3

## Point de sauvegarde pour reprise (Opencode / tout assistant)

**Date :** 30/06/2026  
**Créateur :** AZIZ Mohamed Rostom (rostomaziz22@gmail.com)  
**URL production :** https://apc-algerie.vercel.app  
**Supabase :** https://zheglrzqzwopcfsdbztc.supabase.co  
**Dossier racine :** `D:\platform APC`

---

## 1. STRUCTURE DES FICHIERS

```
D:\platform APC\
├── index.html          → Accueil / Landing (page principale)
├── generator.html      → Générateur de prompts APC
├── assistant.html      → Assistant IA conversationnel
├── games.html        → Hub des jeux (Défense Orbitale + Fais pousser ta plante)
├── from-doc.html    → Document → Présentation
├── quiz.html           → Quiz (création, passage, stats, distribution)
├── about.html          → À propos
├── aide.html           → Guide complet A→Z (auto-contenu, objet GUIDE en 3 langues)
├── aide-cles-api.html  → Guide détaillé des clés API
├── login.html          → Page de connexion
├── admin.html          → Administration
├── loading.html        → Page de chargement
├── seed-examples.html  → Page de seed d'exemples de prompts
├── challenge-game.html → Mini-jeu "Défense Orbitale" (Canvas, Web Audio, 3 langues)
├── challenge-plant.html → Mini-jeu "Fais pousser ta plante" (Canvas, Web Audio, 3 langues)
├── comic-intro.svg     → Image bande dessinée intro (météorite + Terre)
├── comic-victory.svg   → Image bande dessinée victoire
├── comic-defeat.svg    → Image bande dessinée défaite
├── supabase-schema.sql → Schéma SQL Supabase complet
├── RAPPORT_PLATEFORME.md  → Ce rapport complet
├── Template Excel.txt  → Modèle Excel
├── _quiz_*.js, _test_*.js → Fichiers temporaires (ne pas toucher)
├── AGENTS.md          → Résumé de session + règles de restauration
├── supabase-schema.sql → Schéma SQL Supabase complet
├── sounds/            → Sons (startup.mp3)
├── mp3/               → Fichiers audio source (Neural Gate Start.mp3)
├── css/
│   └── style.css      → Style global
├── js/
│   ├── shared.v2.js   → Cœur de l'application (~3750 lignes)
│   ├── compat.js      → Système compatibilité émoji → FA (créé)
│   ├── supabase.js    → Client Supabase (auth, CRUD)
│   ├── shared.js      → Version précédente
│   ├── generator.js   → Logique générateur de prompts
│   ├── assistant.js   → Logique assistant IA (~438 lignes)
│   ├── from-doc.js    → Logique doc→présentation
│   └── about.js       → Logic page à propos
└── inx/               → (Indéfini)
```

---

## 2. ARCHITECTURE TECHNIQUE

### 2.1 Hébergement
- **Frontend :** Vercel (statique, déploiement automatique depuis git)
- **Backend :** Aucun serveur backend — tout est client-side
- **Base de données :** Supabase (PostgreSQL)
- **Email :** EmailJS (service tiers, côté client)
- **IA :** Appels API directs aux fournisseurs (Gemini, Groq, OpenRouter)

### 2.2 Dépendances externes
- **Supabase JS SDK** (`supabase.js`) — chargé via CDN ou build
- **EmailJS SDK** (`@emailjs/browser@4`) — chargé dynamiquement via CDN
- **Aucune autre dépendance** — pas de framework JS, pas de bundler

### 2.3 Langues
La plateforme supporte 3 langues (FR, AR, EN) via `data-i18n` et des constantes dans `shared.v2.js` :
- `currentLang = localStorage.getItem('lang') || 'fr'`
- Le fichier `aide.html` contient son propre moteur de rendu (objet `GUIDE`)
- Le fichier `about.html` utilise `aboutFR/aboutAR/aboutEN` puis `renderAboutContent()`
- Les traductions sont dans l'objet `T` (FR/AR/EN) de `shared.v2.js`

### 2.4 Thème
- Mode sombre/clair : `localStorage.getItem('theme')`
- Par défaut : dark
- Changement via bouton dans le menu

---

## 3. BASE DE DONNÉES (Supabase)

### 3.1 Tables

| Table | Description | RLS |
|-------|-------------|-----|
| `profiles` | Profils utilisateurs (extension auth.users) | Oui |
| `specialities` | Référentiel des spécialités | Oui |
| `modules` | Modules par spécialité | Oui |
| `competences` | Compétences par module | Oui |
| `courses` | Cours sauvegardés | Oui |
| `scenarios` | Scénarios pédagogiques | Oui |
| `presentations` | Présentations Gamma | Oui |
| `generated_images` | Images générées | Oui |
| `prompts_examples` | Exemples de prompts (admin) | Oui |
| `course_favorites` | Favoris des cours | Oui |
| `quizzes` | Quiz publiés (cross-device) | Oui |
| `quiz_attempts` | Tentatives de quiz | Oui |
| `quiz_access_codes` | Codes d'accès individuels | Oui |
| `ai_conversations` | Historique des conversations Assistant IA (cross-device) | Oui |
| `challenges` | Définition des challenges gamification | Oui |
| `challenge_teams` | Équipes par challenge | Oui |
| `challenge_participants` | Participants (distribution) | Oui |
| `challenge_rounds` | Épreuves / rounds | Oui |
| `challenge_submissions` | Soumissions et scores | Oui |

### 3.2 Schéma complet (supabase-schema.sql)

#### `profiles`
```sql
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
full_name TEXT, role TEXT DEFAULT 'formateur' CHECK (role IN ('formateur','inspecteur','admin')),
avatar_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
-- colonnes ajoutées manuellement : full_name_ar TEXT, specialite TEXT
```

#### `specialities`
```sql
id BIGSERIAL PRIMARY KEY, code TEXT UNIQUE NOT NULL,
name TEXT NOT NULL, name_ar TEXT, description TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `modules`
```sql
id BIGSERIAL PRIMARY KEY, speciality_id BIGINT REFERENCES specialities(id) ON DELETE CASCADE,
code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, name_ar TEXT, coefficient REAL DEFAULT 1
```

#### `competences`
```sql
id BIGSERIAL PRIMARY KEY, module_id BIGINT REFERENCES modules(id) ON DELETE CASCADE,
code TEXT NOT NULL, description TEXT NOT NULL, description_ar TEXT,
UNIQUE(module_id, code)
```

#### `courses`
```sql
id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
speciality_id BIGINT REFERENCES specialities(id), module_id BIGINT REFERENCES modules(id),
competence_id BIGINT REFERENCES competences(id), title TEXT NOT NULL, content JSONB,
visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public','private')),
tags TEXT[] DEFAULT '{}'
```

#### `scenarios`
```sql
id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
speciality_id BIGINT REFERENCES specialities(id), module_id BIGINT REFERENCES modules(id),
competence_id BIGINT REFERENCES competences(id), title TEXT NOT NULL, content JSONB
```

#### `presentations`
```sql
id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
source_course_id BIGINT REFERENCES courses(id), title TEXT NOT NULL, slides JSONB
```

#### `generated_images`
```sql
id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
course_id BIGINT REFERENCES courses(id), prompt TEXT NOT NULL,
image_url TEXT NOT NULL, tags TEXT[] DEFAULT '{}',
visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public','private'))
```

#### `prompts_examples`
```sql
id BIGSERIAL PRIMARY KEY, icon TEXT DEFAULT '📝',
name_fr TEXT NOT NULL, name_ar TEXT NOT NULL,
role_fr TEXT NOT NULL, role_ar TEXT NOT NULL,
mission_fr TEXT NOT NULL, mission_ar TEXT NOT NULL,
specialite_fr TEXT NOT NULL, specialite_ar TEXT NOT NULL,
module_fr TEXT NOT NULL, module_ar TEXT NOT NULL,
competence_fr TEXT NOT NULL, competence_ar TEXT NOT NULL,
niveau_fr TEXT NOT NULL, niveau_ar TEXT NOT NULL,
annee_fr TEXT DEFAULT '', annee_ar TEXT DEFAULT '',
duree_fr TEXT DEFAULT '', duree_ar TEXT DEFAULT '',
stagiaires TEXT DEFAULT '',
espace_fr TEXT DEFAULT '', espace_ar TEXT DEFAULT '',
ressources_fr TEXT DEFAULT '', ressources_ar TEXT DEFAULT '',
contexte_fr TEXT DEFAULT '', contexte_ar TEXT DEFAULT '',
difficultes_fr TEXT DEFAULT '', difficultes_ar TEXT DEFAULT '',
astMetier_fr TEXT DEFAULT '', astMetier_ar TEXT DEFAULT '',
astExtrait_fr TEXT DEFAULT '', astExtrait_ar TEXT DEFAULT '',
sort_order INTEGER DEFAULT 0, active BOOLEAN DEFAULT true
```

#### `course_favorites`
```sql
id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
UNIQUE(user_id, course_id)
```

#### `quizzes`
```sql
id TEXT PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
title TEXT NOT NULL DEFAULT 'Quiz', data JSONB NOT NULL
-- RLS : select public, insert public, update owner
```

#### `quiz_attempts`
```sql
id BIGSERIAL PRIMARY KEY, quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
-- RLS : select public, insert public
```

#### `quiz_access_codes`
```sql
id BIGSERIAL PRIMARY KEY, quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
student_name_fr TEXT DEFAULT '', student_name_ar TEXT DEFAULT '',
email TEXT DEFAULT '', specialty TEXT DEFAULT '', groupe TEXT DEFAULT '',
code TEXT NOT NULL, link TEXT NOT NULL,
status TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','used','expired')),
trainer_name TEXT DEFAULT '', trainer_email TEXT DEFAULT ''
-- UNIQUE(quiz_id, code)
```

#### `ai_conversations`
```sql
id TEXT PRIMARY KEY,
user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
title TEXT NOT NULL DEFAULT '',
date TEXT DEFAULT '', time TEXT DEFAULT '',
messages JSONB DEFAULT '[]',
updated_at TIMESTAMPTZ DEFAULT NOW()
-- RLS : select own, insert own, update own
```

### 3.3 Comptes admin
- Email : `rostomaziz22@gmail.com`
- Rôle : `admin`
- UUID connu : `2055e800-7b4e-4068-8e1e-dc1b7ac488d5`
- Pour confirmer l'email : `UPDATE auth.users SET email_confirmed_at = now() WHERE email = '...'`
- Pour réinitialiser le mot de passe : `UPDATE auth.users SET encrypted_password = crypt('NouveauMdp', gen_salt('bf')) WHERE email = '...'`

---

## 4. COMPOSANTS ET FONCTIONNALITÉS

### 4.1 Navigation
- **Drawer latéral** : menu hamburger avec liens vers toutes les pages, sélecteur de langue
- **Barre de navigation** : dans le header de chaque page
- **Pied de page** : footer avec crédits
- **Navigation pages** : `goTo(url)` avec animation `page-exit` / `page-enter` (0.25s)
- **Interception des clics sur les liens** : le script intercepte tous les `<a>` pour transition fluide

### 4.2 Authentification (Supabase Auth)
- `signUp(email, password, fullName)` → crée user + profile
- `signIn(email, password)` → connecte + charge profil
- `signOut()` → animation déconnexion (barre colorée RGB Algerie) → redirection login.html
- `resetPassword(email)` → email de réinitialisation
- `updatePassword(newPassword)` → changement mot de passe
- `changePassword()` → dans modal paramètres (vérifie ancien + nouveau)
- `setRememberMe(bool)` → si false, déconnexion auto dans un nouvel onglet
- **Remember Me OFF** : si `localStorage.rm === '0'` ET nouveau tab → signOut immédiat
- **Profil incomplet** : si `full_name_ar` ou `specialite` manque → overlay de complétion

### 4.3 Générateur de Prompts (`generator.html`)
- Sections : Identité IA, Infos formation, Exemples APC, Options pédagogiques
- Champs : Rôle, Mission, Spécialité, Module, Compétence, Niveau, Année, Durée, Stagiaires, Espace, Ressources, Contexte, Difficultés, AST (Métier + Extrait)
- Options APC cochables : Analyse, Scénario 5 phases, Intégration, Évaluation, Grille 4×4, Critères, Indicateurs, Conclusion, Activités
- Boutons : Copier, Envoyer à l'IA, Réinitialiser, Sauvegarder, Générer présentation
- Cartes d'exemples (depuis Supabase `prompts_examples` ou fallback intégré)

### 4.4 Assistant IA (`assistant.html`)
- Conversation avec historique persistant (localStorage `ai_conversations` + Supabase table `ai_conversations` cross-device)
- Limité aux 30 dernières conversations (slice au save + au render)
- Raccourcis APC : Scénario, Évaluation, Fiche, Intégration, Grille, Cours
- Sélection de fournisseur IA : Auto, Gemini, OpenRouter, Groq, OpenAI, Anthropic, Ollama
- Streaming des réponses
- Export conversation (.txt)
- Web search intégré (DuckDuckGo)
- Sync Supabase : `saveConversation()` upsert la conversation sur Supabase en fire-and-forget ; `syncConversationsFromServer()` fusionne au démarrage+1.5s

### 4.5 Document → Présentation (`from-doc.html`)
- Génération de présentation Gamma à partir d'un document texte
- Utilise un prompt spécialisé pour structurer en slides
- Thèmes Gamma disponibles : Ocean, Sunset, Midnight, Emerald, Royal, Cyber, Slate, Graphite, Obsidian

### 4.6 Système de Présentation Gamma (intégré dans shared.v2.js)
- Génération IA → JSON `{slides: [{title, content, image_prompt, image_url}]}`
- 15 slides structurés selon les 5 phases APC
- Images générées via Pollinations.ai (free)
- Navigation slides avec GammaSlider
- QR code pour le quiz lié

### 4.7 Quiz (`quiz.html`)
- **Création :** Depuis une présentation Gamma → sélection 1 question/slide → génération IA
- **Création depuis Assistant IA :** Nouvelle section 2 « 🎯 Créer un Quiz depuis l'Assistant IA » → utilise `lastAssistantResponse` (localStorage) comme source → génère un gammaData synthétique → `openQuizGenerator()`
- **Types de questions :** QCM (4 choix par défaut)
- **Publication :** Génération lien + QR code
- **Distribution :** Formulaire avec noms (FR/AR), email, spécialité, groupe → génère codes d'accès individuels → envoi EmailJS
- **Mode apprenant :** Entrée par code → passage du quiz → soumission → enregistrement
- **Statistiques :** Moyenne, meilleur, plus faible, badges (Expert/Maîtrisé/En cours/Non maîtrisé)
- **Export PDF :** des résultats
- **Stockage :** localStorage (`quiz_{id}`) + Supabase table `quizzes` (cross-device). `loadPublishedQuizzes()` charge depuis localStorage puis fusionne depuis Supabase. `deleteQuiz()` supprime sur les deux.
- **EmailJS :** Template avec variables `to_name, from_name, message, to_email, quiz_name, code, link, qr_url`

### 4.8 À propos (`about.html`)
- Sections : Mission, Objectifs, Solutions, Engagement, Concepteur, Groupe APC Plus SBA, Accompagnement, Soutien institutionnel, Remerciements, Vision
- 3 langues via constantes `aboutFR` / `aboutAR` / `aboutEN` dans shared.v2.js
- Fonction `renderAboutContent()`

### 4.9 Guide Complet (`aide.html`)
- Page autonome avec objet `GUIDE` en 3 langues (FR/AR/EN)
- Fonction `renderGuide()` qui génère le HTML
- Sections : Clés API, Générateur de prompts, Assistant IA, Document→Présentation, Quiz, Paramètres (avec mention du système de pause)
- Chaque section explique POURQUOI remplir chaque champ

### 4.10 Guide Clés API (`aide-cles-api.html`)
- Guide détaillé pour obtenir les clés : OpenRouter, Google Gemini, Groq, EmailJS
- Liens directs vers les sites

### 4.11 Challenges (`challenges.html`)
- **Création depuis Assistant IA :** Bouton Section 1 → config modal → IA génère équipes, rounds, questions
- **Création manuelle :** Formulaire Section 2 → type (groupes/individuel/tournoi), nombre d'équipes, thème
- **Éditeur intégré :** Modification des équipes (noms), rounds, questions ; régénération IA par round
- **Distribution :** Import CSV, ajout manuel, répartition aléatoire des équipes (pattern identique à `quiz_access_codes`)
- **Classement en direct :** Scores par équipe, barres de progression, médailles 🥇🥈🥉
- **Mode apprenant :** Entrée par code `?challenge_code=XXXXXX` → passage des rounds QCM → feedback immédiat → score cumulé
- **Stockage :** localStorage (`challenge_*`, `challenge_*_distrib`) + Supabase tables `challenges`, `challenge_teams`, `challenge_rounds`, `challenge_participants`
- **Traitement IA :** Prompt spécialisé pour générer un challenge structuré (équipes + rounds + questions QCM) depuis le contenu de l'Assistant

### 4.12 Mini-jeu "Défense Orbitale" (`challenge-game.html`)
- **Jeu standalone** : fonctionne en double-clic (questions APC par défaut) ou depuis la plateforme (compétence + génération IA)
- **Indépendant des challenges** : configuration propre (compétence, difficulté, nb questions), génération IA via Groq, publication PIN + QR + distribution
- **Canvas animé** : fond étoilé avec nébuleuses, Terre détaillée (océan, 11 continents, nuages, villes lumineuses, atmosphère), Lune orbitale, météorite avec traînée de feu
- **Bouclier hexagonal** : grille hexagonique animée, dégradé selon l'état (cyan → rouge)
- **Particules et effets** : étincelles, éclats, shockwaves, étoiles filantes, secousses caméra, flash d'impact
- **Distribution** : QR code + PIN + lien copiable + CSV/XLSX/manuel + EmailJS via `openChallengeDistribModal()`
- **PDF export** : page imprimable avec QR + PIN + lien + bouton Imprimer/PDF
- **Download** : QR (PNG 400x400), PIN (fichier .txt)
- **Audio** : Web Audio API avec musique procédurale (calme/héroïque/tense) et effets sonores (laser, impact, explosion, correct/wrong, victoire/défaite)
- **Audio ducking** : la musique baisse automatiquement pendant la narration TTS
- **TTS (voix)** : Web Speech API, lit l'intro en FR/AR/EN, sélection voix féminine, débit 0.85
- **Images comics** : 3 SVG en arrière-plan des overlays (intro, victoire, défaite)
- **Intro cinématique** : briefing avec le scénario, le rôle du joueur, et la compétence visée du challenge
- **3 langues** : FR/AR/EN pour toute l'interface
- **Scores, streaks, niveaux, badges** : XP gagné en jeu, badges (star, shield, rocket, crown)
- **Intégration challenges** : dropdown en menu pour sélectionner un challenge publié ; bouton 🚀 Jouer dans les cartes challenges
- **Navigation** : onglet "🚀 Jeu Défense" dans le drawer et la barre de navigation

### 4.13 Mini-jeu "Fais pousser ta plante" (`challenge-plant.html`)
- **Même architecture** que Défense Orbitale : standalone, Canvas, Web Audio, TTS, 3 langues (FR/AR/EN)
- **Principe :** plante en pot au centre du canvas. Bonne réponse = arrosage + croissance. Mauvaise = perte d'eau + flétrissement
- **7 stades de croissance :** 🌰 Graine → 🌱 Germination → 🌿 Jeune pousse → 🍀 Petite plante → 🌳 Plante adulte → 🌸 Floraison → 🌺 Fleur magnifique
- **5 gouttes d'eau :** chaque erreur enlève 20% ; à 0% → 🥀 plante sèche (défaite)
- **Récompenses :** 🌸 Blanche (≥70%) / 🌹 Rose (≥80%) / 🌻 Tournesol (≥90%) / 🌺 Orchidée (100%)
- **Mêmes features :** multi-save PIN/QR/Distribution, compétence + génération IA Groq, mode apprenant, badges (star/leaf/drop/flower)
- **Effets visuels :** ciel dégradé, nuages, arc-en-ciel (série ≥5), papillons, abeilles, herbe animée, particules (feuilles, gouttes), shockwaves vertes
- **Audio :** musique calme/nature, SFX eau/croissance/fleur/papillon
- **Assets SVG :** `img/plant-pot.svg`, `plant-stage0-6.svg`, `plant-water.svg`, `plant-butterfly.svg`, `plant-bee.svg`

### 4.14 Hub des jeux (`games.html`)
- **Page unique** listant tous les jeux disponibles avec cartes visuelles (icône, titre, description, tags)
- **Navigation simplifiée :** un seul onglet "🎮 Jeux" dans le drawer et navbar, remplace les deux onglets individuels
- **Bouton Retour :** les deux jeux redirigent vers `games.html`
- **i18n :** clé `tab_games` dans `shared.v2.js` (FR/AR/EN) + page autonome avec ses propres traductions

### 4.15 Paramètres IA (modal dans index.html, quiz.html)
- Config : OpenRouter (or_key), Gemini (gm_key), Groq (gq_key)
- EmailJS : Public Key, Service ID, Template ID, API Key (privée)
- Vérification des clés API
- Sélection du modèle par défaut
- Changement de mot de passe

---

## 5. SYSTÈME EMAILJS

### 5.1 Configuration
```javascript
// Stockage dans localStorage
{ publicKey, serviceId, templateId, apiKey }
// Fonctions :
getEmailJSConfig() → parse localStorage
saveEmailJSConfig(pk, sid, tid, ak) → sauvegarde
loadEmailJSConfigToUI() → remplit les champs
```

### 5.2 Test
```javascript
testEmailJS() → charge SDK → init → send → résultat
```

### 5.3 Création automatique de template
```javascript
createEmailJSTemplate() → POST https://api.emailjs.com/api/v1.0/templates
  Headers: Authorization: Bearer <apiKey>
  Body: template avec variables to_name, from_name, message, to_email, quiz_name, code, link, qr_url
  → Remplit automatiquement le Template ID
```

### 5.4 Distribution des quiz
```javascript
sendEmailJSInvitation(link, to_email, to_name, quiz_name, code)
sendBulkEmails() → envoie par lots aux étudiants
```

---

## 6. SYSTÈME MULTI-IA

### 6.1 Fournisseurs supportés

| Fournisseur | Clé API | URL | Modèles |
|------------|---------|-----|---------|
| **Gemini** | `gm_key` | `https://generativelanguage.googleapis.com/v1beta/models` | 2.0 Flash, 2.5 Pro |
| **Groq** | `gq_key` | `https://api.groq.com/openai/v1/chat/completions` | GPT OSS 120B, Llama 3.1, Llama 4 Scout |
| **OpenRouter** | `or_key` | `https://openrouter.ai/api/v1/chat/completions` | DeepSeek V3/R1, Llama 3.3, Hermes 405B, Owl Alpha, Llama 4 Scout |
| **OpenAI** | `OPENAI_API_KEY` | `https://api.openai.com/v1/chat/completions` | GPT-4o, GPT-4o-mini |
| **Anthropic** | `ANTHROPIC_API_KEY` | `https://api.anthropic.com/v1/messages` | Claude Sonnet, Opus, Haiku |
| **Ollama** | `OLLAMA_URL` | `http://localhost:11434/api/chat` | Local |

### 6.2 Ordre de fallback (mode Auto)
```
gemini-flash → groq-llama → gemini-pro → groq-fast → groq-scout
→ deepseek-v3-free → owl-alpha → llama4-scout-free
```

### 6.3 Fonction callAI
```javascript
callAI(messages, onChunk, onModelChange, forceProvider, forceModel)
  → try tous les modèles du fallback
  → gère les rate limits (retry avec délai)
  → 120s timeout
  → streaming des réponses
```

### 6.4 Génération d'images (Pollinations.ai, gratuit)
```javascript
generateImage(prompt, fallback)
  → URL: https://image.pollinations.ai/prompt/{encoded}?width=800&height=600&model={flux|flux-schnell}&seed={random}
```

---

## 7. SYSTÈME DE PAUSE BIEN-ÊTRE

**Fichier :** `shared.v2.js` (lignes 22-136)

### 7.1 Fonctions
- `_breakMsg(path)` → traductions FR/AR/EN
- `_formatDuration(ms)` → affichage temps
- `_closeOverlay(id)` → fermeture avec animation 0.4s
- `_createOverlay(id, html)` → création overlay modal
- `showBreakTimer()` → timer de 5 min avec conseils
- `showBreakOverlay()` → overlay principal avec 3 boutons
- `__breakLateClose()`, `__breakDoLater()`, `__breakDoContinue()`, `__breakResume()` → handlers onclick
- `checkBreakReminder()` → vérification périodique
- `updateBreakStats()` → stats dans le footer

### 7.2 Seuils
- **90 min** de travail cumulé → notification
- **30 min** de cooldown entre notifications
- **15 min** snooze (bouton "Me le rappeler")
- **10 min** snooze (bouton "Continuer")
- **22h-5h** : message spécial "Il se fait tard"

### 7.3 Stockage localStorage
- `break_total` → temps cumulé (ms)
- `break_last_visit` → dernière visite
- `break_last_shown` → dernière notification
- `break_snooze` → prochain rappel
- `break_count` → nombre de pauses prises

### 7.4 Lancement
```javascript
setTimeout(checkBreakReminder, 800);
setInterval(checkBreakReminder, 300000); // toutes les 5 min
```

---

## 8. SYSTÈME DE MISE À JOUR

### 8.1 Version
```javascript
const APP_VERSION = '1.0.1'; // À incrémenter AVANT chaque push GitHub
```

### 8.2 Fonction
```javascript
checkVersionNotification() → compare localStorage('app_version') avec APP_VERSION
  → si différent : bannière verte avec 🎉 + bouton OK
  → stocke nouvelle version dans localStorage
```

---

## 9. LOCALSTORAGE / SESSIONSTORAGE

### 9.1 Clés localStorage importantes
| Clé | Usage |
|-----|-------|
| `lang` | Langue (fr, ar, en) |
| `theme` | dark/light |
| `app_version` | Version pour notification mise à jour |
| `or_key` | Clé API OpenRouter |
| `gm_key` | Clé API Google Gemini |
| `gq_key` | Clé API Groq |
| `emailjs_config` | Config EmailJS (JSON) |
| `gammaData` | Données de présentation Gamma |
| `lastAssistantResponse` | Dernière réponse de l'Assistant IA |
| `ai_conversations` | Historique conversations IA (persistant, cross-session) |
| `current_conv_id` | ID conversation active |
| `quiz_*` | Quiz publié |
| `challenge_*` | Challenge publié (avec rounds, équipes, critères) |
| `challenge_*_distrib` | Distribution d'un challenge |
| `break_*` | Données pause bien-être |
| `rm` | Remember Me |

### 9.2 Clés sessionStorage importantes
| Clé | Usage |
|-----|-------|
| `generator_form` | Formulaire générateur |
| `pending_prompt` | Prompt en attente |
| `pending_options` | Options en attente |
| `rm_ok` | Flag remember me |

---

## 10. FICHIERS JS DÉTAILLÉS

### 10.1 `shared.v2.js` (~3701 lignes)

**Structure générale :**
```
Lignes 1-21    : APP_VERSION, checkVersionNotification(), migration clés
Lignes 22-48   : _breakMsg, _formatDuration, _closeOverlay, _createOverlay
Lignes 49-74   : showBreakTimer()
Lignes 75-78   : Helper functions (onclick handlers)
Lignes 79-108  : showBreakOverlay()
Lignes 109-136 : checkBreakReminder(), updateBreakStats()
Lignes 137-805 : Objet T (traductions FR/AR/EN) — ajout clés quizFromAssistantTitle, quizAssistantBtn, quizAssistantNoResponse, quizFromAssistantDesc
Lignes 807-1103: aboutFR, aboutAR, aboutEN (contenu HTML)
Lignes 1104-1160: renderAboutContent(), THEMES, clés API
Lignes 1161-1245: EmailJS (get/save/load/test/createTemplate)
Lignes 1253-1289: PROVIDERS, MODEL_MAP, FALLBACK_ORDER
Lignes 1290-1361: getApiKey, markdownToHtml, sanitizeHtml
Lignes 1378-1401: getFormContext()
Lignes 1402-1403: t(), currentLang
Lignes 1404-1570: options, exemples, QUICK_KEYS, OPTS, conversations (depuis localStorage désormais)
Lignes 1572-1745: callAI, callModel, callProvider (streaming IA)
Lignes 1746-1778: generateImage, slideImagePrompt, generateAllImages
Lignes 1779-1976: Gamma (generateGammaPresentation, slider, rendering)
Lignes 1977-     : Rendering slides, quiz functions, distribution, etc.
```

### 10.2 `supabase.js` (434 lignes)

**Fonctions principales :**
- `initSupabase()` → initialise client, checkSession
- `checkSession()` → vérifie session, remember me
- `signUp()`, `signIn()`, `signOut()`, `resetPassword()`, `updatePassword()`, `changePassword()`
- `loadProfile()`, `updateAuthUI()`, `checkProfileCompletion()`, `saveProfileCompletion()`
- `saveCourse()`, `updateCourse()`, `deleteCourse()`, `getCourses()`, `getCourse()`
- `saveScenario()`, `getScenarios()`
- `savePresentation()`, `getPresentations()`
- `saveGeneratedImage()`, `getGeneratedImages()`
- `toggleFavorite()`, `getFavorites()`, `isFavorite()`
- `getSpecialities()`, `getModules()`, `getCompetences()`
- `getPromptExamples()`, `savePromptExample()`, `updatePromptExample()`, `deletePromptExample()`
- **Tables utilisées par les quiz :** `quizzes`, `quiz_attempts`, `quiz_access_codes`
- **Table utilisée par l'assistant :** `ai_conversations` (upsert dans `saveConversation()` + sync dans `syncConversationsFromServer()`)

### 10.3 Autres JS
- `generator.js` → logique du générateur de prompts
- `assistant.js` → logique de l'assistant IA conversationnel
- `from-doc.js` → logique document → présentation
- `about.js` → logique page à propos
- `shared.js` → ancienne version (garder pour compatibilité)

---

## 11. PAGES HTML — DÉTAIL PAR PAGE

### 11.1 index.html (Accueil)
- Hero avec titre, sous-titre, badges
- Cards : Générateur, Assistant, Document→Présentation, À propos
- Footer avec crédits
- Drawer navigation + header
- Bouton paramètres (modal avec clés API)
- Bannière de mise à jour (générée par JS)
- Badge API dans header

### 11.2 generator.html (Générateur de prompts)
- Formulaire complet avec tous les champs
- Cartes d'exemples (5 exemples intégrés, chargement Supabase)
- Options APC à cocher
- Zone de prompt généré
- Boutons : Copier, Envoyer IA, Réinitialiser, Sauvegarder
- Modal Gamma (présentation)

### 11.3 assistant.html (Assistant IA)
- Zone de chat avec historique (localStorage + Supabase cross-device)
- Raccourcis APC (6 boutons)
- Sélecteur de fournisseur IA
- Input message avec bouton envoyer
- Nouvelle conversation, export (.txt)
- Modal Gamma + bouton Générer Quiz
- **Historique persistant :** `sessionStorage` → `localStorage` + sync Supabase
- **Limite :** 30 conversations max (save + render)
- **Mobile :** Sidebar transformée en tiroir coulissant (≤768px) avec bouton ☰ dans la toolbar ; overlay semi-transparent pour fermer ; support RTL pour l'arabe

### 11.4 from-doc.html (Document → Présentation)
- Zone de texte pour coller le document
- Bouton générer présentation
- Modal Gamma

### 11.5 quiz.html (Quiz)
- Sections : Créer depuis présentation (Section 1), Créer depuis Assistant IA (Section 2), Quiz publiés (Section 3), Distributions (Section 4), Passer un quiz (mode apprenant)
- **Création depuis Assistant IA :** Nouvelle section avec aperçu de `lastAssistantResponse` + bouton « Générer un Quiz avec l'IA » → `openQuizGeneratorFromAssistant()` crée un gammaData synthétique
- **Quiz cross-device :** `loadPublishedQuizzes()` scan localStorage puis fusionne depuis Supabase table `quizzes` ; `deleteQuiz()` supprime sur les deux
- Générateur : sélection présentation/assistant → génération IA questions → édition → publication
- Publication : lien + QR code → distribution EmailJS
- Stats : moyennes, badges, export PDF
- Mode apprenant : code → quiz → soumission → résultat

### 11.6 about.html (À propos)
- Contenu généré par JS (aboutFR/aboutAR/aboutEN)
- Pas de i18n classique

### 11.7 aide.html (Guide complet)
- Page autonome avec rendu JS
- Objet GUIDE avec intro + sections en FR/AR/EN
- Fonction renderGuide() pour le rendu

### 11.8 aide-cles-api.html (Guide clés API)
- Sections : OpenRouter, Gemini, Groq, EmailJS
- Lien retour vers guide.html

### 11.9 login.html (Connexion)
- Formulaire email + mot de passe
- Lien inscription
- Lien réinitialisation

### 11.10 admin.html (Administration)
- Réservé aux utilisateurs avec role='admin'
- Gestion des exemples de prompts (CRUD)
- Visibilité : `.nav-admin-link` affiché seulement si admin

---

## 12. SÉCURITÉ

- **Supabase RLS activée** sur toutes les tables
- **Clés API stockées en localStorage** (pas de backend pour les cacher)
- **EmailJS API Key privée** stockée en localStorage (utilisation locale uniquement)
- **Sanitization HTML** : fonction `sanitizeHtml()` retire les scripts et handlers `on*` du contenu IA
- **Protection XSS** : `stripBOM()`, vérifications de format de clés
- **Aucun backend** : tout est client-side, pas d'injection serveur possible
- **Password** : minimum 8 car, 1 majuscule, 1 chiffre, 1 caractère spécial

---

## 13. NOTES DE DÉVELOPPEMENT

### 13.1 `APP_VERSION`
- Incrémenter `APP_VERSION` dans `shared.v2.js:2` **avant chaque push GitHub**
- La bannière de mise à jour s'affiche une seule fois par version

### 13.2 EmailJS — Création automatique de template
- Nécessite la **clé API privée** (Account → API Keys)
- Template ID auto-rempli après création
- Variables du template : `to_name, from_name, message, to_email, quiz_name, code, link, qr_url`

### 13.3 Base de données
- Pour ajouter `quiz_access_codes` avec l'ancien schéma : utiliser `ALTER TABLE ADD COLUMN IF NOT EXISTS`
- Contrainte UNIQUE(quiz_id, code) — supprimer les doublons avant avec `DELETE FROM quiz_access_codes a WHERE a.id NOT IN (SELECT MAX(id) FROM quiz_access_codes GROUP BY quiz_id, code)`

### 13.4 Règles impératives
- **NE PAS modifier les prompts IA** présents dans les fichiers (aucun changement, correction ou ajout)
- **NE PAS modifier la structure globale** des pages existantes
- **TOUJOURS vérifier les 3 langues (FR, AR, EN)** avant toute modification — ne jamais changer, corriger ou ajouter du contenu dans une seule langue sans mettre à jour les deux autres
- **NE JAMAIS modifier un fichier sans vérifier les 3 langues** — les objets `T` (traductions), `GUIDE`, `aboutFR/aboutAR/aboutEN` doivent toujours rester synchronisés
- **TOUJOURS AMÉLIORER** le code, la structure ou le contenu dès qu'une opportunité d'amélioration est détectée, sans jamais casser les fonctionnalités existantes
- **TOUJOURS DÉMONTRER** les modifications proposées avant de les appliquer — attendre le `oui` ou `non` du développeur pour chaque changement
- Le fichier `aide.html` contient son propre moteur de rendu (`renderGuide()`) et ne dépend pas du système i18n de `shared.v2.js`
- Les fichiers temporaires `_quiz_*.js`, `_test_*.js` sont des sauvegardes — ne pas toucher

### 13.5 Déploiement Vercel
- Projet lié à un dépôt GitHub
- Push → déploiement automatique
- `APP_VERSION` doit être incrémenté avant le push pour la notification
- Pages statiques, pas de build nécessaire

---

## 14. PROBLÈMES CONNUS ET SOLUTIONS

| Problème | Solution |
|----------|----------|
| Boutons pause ne fonctionnent pas | Rafraîchir la page (cache) ; les `onclick` inline sont en place depuis le fix |
| Bannière mise à jour ne s'affiche pas | Incrémenter `APP_VERSION` dans shared.v2.js |
| EmailJS template creation fail | Vérifier la clé API privée (Bearer token, pas Public Key) |
| Quiz doublons access_codes | Exécuter la suppression des doublons puis ajouter UNIQUE contrainte |
| Images Gamma lentes | Pollinations.ai peut prendre 5-10s par image ; les images sont chargées en async |
| Quotas IA épuisés (429) | Attendre ~24h pour réinitialisation des comptes gratuits ou ajouter clé payante |

---

## 15. HISTORIQUE DES MODIFICATIONS RÉCENTES

| Date | Modification |
|------|-------------|
| 02/07/2026 | Rapport AGENTS.md et RAPPORT_PLATEFORME.md mis à jour |
| 02/07/2026 | `loading.html` : nettoyage (son retiré, code audio supprimé) |
| 02/07/2026 | Extraction `startup.mp3` depuis `Neural Gate Start.mp3` (0→10s, puis 53→56s, puis 0→10s) |
| 02/07/2026 | Génération sons originaux (style PS1, moderne pédagogique) → remplacés par extrait MP3 |
| 02/07/2026 | Création `sounds/` dossier, génération startup_sound.wav personnalisé |
| 02/07/2026 | `supabase.js` `signOut()` : animation 3s revert (était passé à 1.5s) |
| 02/07/2026 | Nav : tous les `<a href="page.html">` → `<a onclick="goTo('page.html')">` (plus d'URL dans barre d'état) |
| 02/07/2026 | `compat.js` : bannière unique auto (clé `apc_banner_v2`), cache-busting `?v=2` |
| 02/07/2026 | `shared.v2.js` : restants `textContent` émojis → `innerHTML` + compat (🖼️, 🎯) |
| 02/07/2026 | `assistant.js` : helper `_e(t)` + `innerHTML` pour avatars/boutons/statuts (compat mode) |
| 02/07/2026 | `compat.js` : détection police emoji canvas, mapping ~60 émojis, paramètre mode icônes |
| 02/07/2026 | `shared.v2.js` : `t()`, `setLang()`, `showToast()` compat mode ; font-family "Segoe UI Emoji" |
| 02/07/2026 | Toutes les pages : Font Awesome CDN + `compat.js` + bandeau |
| 02/07/2026 | Restauration fichiers originaux depuis backup `ver 10077 save historique sur supabase` |
| 01/07/2026 | Assistant IA mobile : sidebar en tiroir coulissant + bouton ☰ + overlay (comme ChatGPT) |
| 01/07/2026 | Correction sync conversations : mise à jour des conversations existantes depuis Supabase (cross-device) |
| 01/07/2026 | Historique assistant : sessionStorage → localStorage (persistant) |
| 01/07/2026 | Sauvegarde conversations assistant sur Supabase table `ai_conversations` + sync cross-device |
| 01/07/2026 | Correction mise en forme historique : role 'assistant' → 'ai' dans loadConversation (classes CSS) |
| 01/07/2026 | Limite historique : 30 conversations max (save + render) |
| 01/07/2026 | Nouvelle section Quiz « depuis l'Assistant IA » avec bouton + aperçu + traductions FR/AR/EN |
| 01/07/2026 | Quiz cross-device : loadPublishedQuizzes() fusionne localStorage + Supabase ; deleteQuiz() synchro |
| 30/06/2026 | Fix boutons pause (addEventListener → onclick inline) |
| 30/06/2026 | APP_VERSION 1.0.0 → 1.0.1 |
| Juin 2026 | Guide complet aide.html + navigation |
| Juin 2026 | Système pause bien-être |
| Juin 2026 | Notification mise à jour |
| Juin 2026 | Remerciements page about |
| Juin 2026 | EmailJS création auto template |
| Juin 2026 | Quiz distribution + access_codes |
| 02/07/2026 | `shared.v2.js` `_createOverlay()` : fix doublons overlays (bouton Continuer pause) |
| 02/07/2026 | Page À propos : objectifs 10→6, rôles membres, clause responsabilité, version, mentions légales (FR/AR/EN) |
| 02/07/2026 | Header : signature `headerSig` supprimée de 6 HTML + objet T (FR/AR/EN) |
| 02/07/2026 | Footer : texte allégé (nom retiré), copyright 3 langues injecté par JS |
| 02/07/2026 | `aide.html` : mention reconnaissance vocale ajoutée au guide (FR/AR/EN) |
| 02/07/2026 | `assistant.js` : textes vocaux traduits via `t()`, ajout `translateVoiceUI()` |
| 02/07/2026 | `setLang()` : appel de `translateVoiceUI()` + `renderGuide()` pour changement de langue instantané |
| 02/07/2026 | `js/apc-glossary.js` créé : glossaire 35 termes APC (FR/AR/EN) injecté dans le sysPrompt de l'Assistant IA |
| 02/07/2026 | `assistant.js` : instruction explicite d'utiliser les définitions officielles du glossaire pour les termes APC |
| 02/07/2026 | `AGENTS.md` : ajout de la règle `mjr2` pour mise à jour automatique des 2 fichiers |
| 02/07/2026 | `APP_VERSION` 1.0.1 → 1.1.0 (bannière de mise à jour) |
| 02/07/2026 | **Système Challenges** : nouvelle page `challenges.html`, logique `js/challenges.js`, 5 tables Supabase, ~80 traductions FR/AR/EN, navigation mise à jour sur 10 pages, bouton Challenge dans `assistant.html` |
| 02/07/2026 | Fix historique Assistant IA : bouton ☰ mobile, overlay sidebar, CSS overlay hors media query |
| 02/07/2026 | `supabase-schema.sql` : ajout table `ai_conversations` (manquante — upsert échouait silencieusement) + logging erreurs |
| 02/07/2026 | Challenges : choix du nombre d'équipes (2-5) dans config modal et création manuelle |
| 02/07/2026 | Distribution challenge alignée sur quiz : import CSV/XLSX, filtres Spécialité/Groupe, QR code, EmailJS, compteur |
| 02/07/2026 | Bug `createManualChallenge()` fixé : `colors` → `teamColors` (bouton Créer le challenge ne marchait pas) |
| 02/07/2026 | Refactoring distribution : `challengeDistribCurrentId`, `challengeUpdateFilters()` après suppression, `d` chargé avant usage dans sendAll |
| 02/07/2026 | **Règle ajoutée** : tester TOUTES les fonctionnalités (existantes + nouvelles) avant chaque retour utilisateur |
| 02/07/2026 | **Système Gamification** : Section 5 dans challenges.html, dashboard XP/Niveaux/Badges/Streaks/Missions/Hall of Fame |
| 02/07/2026 | Système XP : 8 niveaux (0→8000 XP), barre progression, notification passage niveau |
| 02/07/2026 | Système Badges : 14 badges avec déblocage automatique, grille verrouillés/déverrouillés |
| 02/07/2026 | Système Streaks : compteur quotidien avec détection date, meilleure série conservée |
| 02/07/2026 | Missions quotidiennes : suivi complétions, reset auto journalier |
| 02/07/2026 | Hall of Fame : top 10 avec XP et date |
| 02/07/2026 | ~70 nouvelles clés traduction FR/AR/EN pour gamification |
| 02/07/2026 | Robustesse JSON AI : extraction depuis blocs markdown + nettoyage virgules traînantes |
| 03/07/2026 | **Création `challenge-game.html`** : mini-jeu standalone "Défense Orbitale" avec Canvas (Terre, Lune, météorite, bouclier hexagonal), Web Audio API, 3 langues, particules/shockwaves/stars |
| 03/07/2026 | **Création `comic-intro.svg`, `comic-victory.svg`, `comic-defeat.svg`** : images bande dessinée en SVG affichées en arrière-plan des overlays (intro, victoire, défaite) |
| 03/07/2026 | **TTS (Web Speech API)** : voix féminine FR/AR/EN pour l'intro, sélection intelligente, audio ducking (musique baisse pendant la parole) |
| 03/07/2026 | **Intégration Challenges → Jeu** : dropdown de sélection de challenge dans le menu du jeu, bouton 🚀 Jouer dans les cartes challenges + zone publication |
| 03/07/2026 | **Navigation** : onglet "🚀 Jeu Défense" ajouté dans la barre de nav des 10 pages HTML |
| 03/07/2026 | `playChallengeInGame()` dans challenges.js : setItem `challengeGameCurrentId` + `challengeGameLang` avant navigation |
| 03/07/2026 | **Earth améliorée** : océan 4 stops, 11 continents, ombrage 3D, nuages animés, 28 villes, atmosphère 4 anneaux, fissures |
| 03/07/2026 | **Fix Pause bien-être** : reset `break_total` quand gap > 10 min (évite notification au retour après une journée) |
| 03/07/2026 | **Fix Challenges + Quiz** : `_extractCompetences()` dans `shared.v2.js`, badges compétences dans Challenges et Quiz Section 2, sélecteur de compétence si multiples |
| 03/07/2026 | **Fix Challenges** : bouton Distribuer par email ajouté dans la zone de publication (QR + email comme le Quiz) |
| 03/07/2026 | **Jeu autonome** : suppression dépendance challenges (sélecteur legacy, btnPlay, challengeGameCurrentId), fonctions obsolètes retirées |
| 03/07/2026 | **Compétences synchronisées** : `_extractCompetences()` du jeu aligné sur `shared.v2.js` (patterns identiques Quiz/Challenge/Jeu) |
| 03/07/2026 | **Son auto-init** : `Audio.sfx()` initialise le contexte audio automatiquement au premier clic |
| 03/07/2026 | **Publication jeu** : bouton Publier + QR/PIN + distribution (CSV/XLSX/manuel/EmailJS) via `openChallengeDistribModal()` |
| 03/07/2026 | **Fix distribution** : `shared.v2.js` chargé avant `challenges.js` pour fournir globaux (`t()`, `showToast()`, `_createOverlay()`) |
| 03/07/2026 | **PDF + Downloads** : boutons 📄 PDF (page imprimable QR+PIN+lien), ⬇ QR (PNG), ⬇ PIN (TXT) |
| 03/07/2026 | **En-tête jeu** : `menuEyebrow` = nom plateforme, `gameTitle` = "🚀 DÉFENSE ORBITALE", `gameSub` traduit FR/AR/EN |
| 03/07/2026 | **Fix langue** : suppression `challengeGameLang`, le jeu utilise la clé `lang` commune à toute la plateforme |
| 03/07/2026 | **Difficultés expliquées** : Facile (diff=1, lent, -22 bouclier) / Moyen (diff=1-2, moyen, -26) / Difficile (diff=1-3, rapide, -30) avec gains proportionnels (score/XP/bouclier) |
| 03/07/2026 | **Fix mobile responsive** : `touch-action:manipulation`, boutons 44px min-height, menu/qpanel/hud responsifs ≤400px |
| 04/07/2026 | **Fix Terre cachée** : `ey=H*(W<600?0.55:0.92)` sur mobile |
| 04/07/2026 | **Fix bulles comics portrait** : `object-position:left center` sur écran ≤ ratio 8:5 |
| 04/07/2026 | **Création `favicon.ico`** (SVG) dans la racine |
| 04/07/2026 | **Cross-device jeu** : config (comp/diff/count) dans l'URL du QR/lien via `_gameLink()` |
| 04/07/2026 | **Auto-start apprenant** : détection params URL + `generateAndRunGame()` direct, sans menu |
| 04/07/2026 | **Fix `raw` bug** : `btnDistribChallenge` référence error |
| 04/07/2026 | **Bouton Envoyer individuel dans distribution challenge** : colonne Actions avec 📧 par participant (si email valide + non envoyé) + fonction `challengeDistribSendOne(idx)` |
| 04/07/2026 | **Terre petite en haut + Lune visible sur smartphone** : `ey=H*0.22`, `er=min(W,H)*0.26`, orbite Lune circulaire (`mY=ey+sin(mA)*(er*0.8)`) — Terre réduite et placée en haut, Lune orbite visible, météorite arrive du coin supérieur droit |
| 04/07/2026 | **PIN manuel apprenant** : suppression `pi.value=aPin` — le champ PIN n'est plus pré-rempli, l'apprenant doit taper le code reçu du formateur |
| 04/07/2026 | **Terre très petite au milieu sur mobile** : `er=min(W,H)*0.20, ey=H*0.50` — la Terre est un petit astre lointain centré |
| 04/07/2026 | **Images haute qualité** : création `img/earth.svg`, `moon.svg`, `meteor.svg`, `satellite.svg` — rendu via `drawImage()` dans `drawScene()` |
| 04/07/2026 | **Fix fluidité (lord)** : `cacheImg()` pré-rend les SVG en bitmap offscreen au chargement ; filtres SVG et animations supprimés |
| 04/07/2026 | **Effets visuels max** : fond 275 étoiles/4 couches + étoiles filantes colorées + 4 nébuleuses ; traînée météorite 18 segments + 5 débris + lueur + 6 feux orbitaux + particules fumée/feu temps réel ; Terre avec nuages animés + 28 villes scintillantes ; bouclier avec halo + grille hexagonale animée + étincelles |
| 04/07/2026 | **Sauvegarde formateur** : bouton "💾 Sauvegarder" remplace "Publier" ; résultat (PIN/QR/Copier/Distribuer) affiché inline dans le panneau de config ; panneau publication séparé supprimé |
| 04/07/2026 | **Multi-sauvegardes** : `GAME_SAVES_KEY` (tableau JSON) ; chaque sauvegarde stocke competence/difficulté/nb questions/PIN/rounds/date ; liste dans le menu avec boutons Jouer/Supprimer |
| 04/07/2026 | **Bouton Admin** : ajout de `btnAdminPanel` (⚙️ Admin) dans le menu du jeu → lien vers `admin.html` — visible uniquement si `isAdmin=true` dans localStorage |
| 04/07/2026 | **Règle ajoutée** : `mjr3` — après chaque correction, incrémenter `APP_VERSION` dans `shared.v2.js` pour déclencher la bannière de mise à jour |
| 04/07/2026 | **Version bump** : `APP_VERSION` 1.1.1 → 1.1.2 (application règle mjr3 après ajout de la règle) |
| 04/07/2026 | **Nouveau jeu** : création `challenge-plant.html` — "Fais pousser ta plante" avec 7 stades de croissance, 5 gouttes d'eau, Canvas/Web Audio/TTS 3 langues, multi-save PIN/QR/Distribution |
| 04/07/2026 | **Assets SVG plante** : création `img/plant-pot.svg`, `plant-stage0-6.svg`, `plant-water.svg`, `plant-butterfly.svg`, `plant-bee.svg` |
| 04/07/2026 | **Navigation plante** : ajout `tab_game2` dans `shared.v2.js` (🌱 Jeu Plante / لعبة النبات / Plant Game) + lien dans les 10 pages HTML |
| 04/07/2026 | **Version bump** : `APP_VERSION` 1.1.2 → 1.1.3 |
| 04/07/2026 | **Hub jeux** : création `games.html` — page unique listant tous les jeux, navigation simplifiée (un seul onglet `tab_games`), bouton Retour pointant vers `games.html` |
| 04/07/2026 | **Version bump** : `APP_VERSION` 1.1.3 → 1.1.4 |
| 04/07/2026 | **Taille pot réduite** : potScale 0.003/0.0042 → 0.0022/0.0028 |
| 04/07/2026 | **Gouttes d'eau améliorées** : rendu Canvas pur (dégradé radial, forme larme, highlight, glow bleu actif / gris inactif) + indicateur texte HUD 💧💧💧💧💧 |
| 04/07/2026 | **Animations ajoutées** : pluie (`spawnRain` gouttes qui tombent), croissance fluide (`stageTrans` fondu entre stades), floraison (`bloomPct` pétales animés) |
| 04/07/2026 | **Version bump** : `APP_VERSION` 1.1.6 → 1.1.7 |
| 05/07/2026 | `index.html` : bouton fermeture ✕ profil → bouton "Se déconnecter" ; l'utilisateur ne peut plus ignorer la complétion du profil |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.1.7 → 1.1.8 |
| 05/07/2026 | Nouvelle table `user_activity_log` (Supabase) : journalisation login/logout/profile_update |
| 05/07/2026 | `supabase.js` : `logActivity()`, logging dans `signIn()`, `signOut()`, `saveProfileCompletion()` |
| 05/07/2026 | `admin.html` : nouvelle carte "📊 Journal d'Activité" avec tableau + stats par utilisateur |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.1.8 → 1.2.0 |
| 05/07/2026 | `admin.html` : carte "🌺 Jardin des compétences" retirée (déjà dans challenge-plant.html) |
| 05/07/2026 | `challenge-plant.html` : jardin filtré par `trainer_id` → chaque formateur voit ses apprenants |
| 05/07/2026 | `supabase.js` : stockage `sb_user_id` dans localStorage pour filtrage jardin |
| 05/07/2026 | Nouvelle table `game_saves` (Supabase) : sauvegardes cloud des jeux |
| 05/07/2026 | `challenge-plant.html` + `challenge-game.html` : `saveSaves()` sync Supabase, `syncSavesFromServer()` au démarrage |
| 05/07/2026 | Filtrage des parties sauvegardées par `trainer_id` → chaque compte voit ses propres sauvegardes |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.2.0 → 1.2.1 |
| 05/07/2026 | SQL : création table `user_activity_log`, table `game_saves`, colonne `trainer_id` sur `competence_flowers` |
| 05/07/2026 | **Création `challenge-cards.html`** : nouveau jeu "Défi des Cartes du Savoir" (flip 0.2s, 4 réponses, cartes spéciales ⭐💎🎁⏱, pile réussites, HUD, 3 langues) |
| 05/07/2026 | `challenge-cards.html` : sauvegardes cloud Supabase (`game_saves`), filtrage `trainer_id`, distribution PIN/QR/EmailJS |
| 05/07/2026 | `games.html` : ajout de la carte "🃏 Cartes du Savoir" avec i18n FR/AR/EN |
| 05/07/2026 | SQL : ajout `'cards'` au CHECK `game_saves.game_type` (→ `IN ('plant','defense','cards')`) |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.2.1 → 1.2.2 |
| 05/07/2026 | Fix `challenge-cards.html` : apostrophes mal échappées (`\\'` → `\'`) corrigées dans toutes les chaînes JS — résout `SyntaxError: Unexpected identifier 'attend'` |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.2.2 → 1.2.3 |
| 05/07/2026 | `challenge-cards.html` : nouveau thème violet/or sombre, orbes flottantes animées, glow borders, shine animation, boutons purple gradient |
| 05/07/2026 | `challenge-cards.html` : questions taggées (`tags[]`) + filtrage par compétence (mots-clés + regex) |
| 05/07/2026 | `challenge-cards.html` : `_extractCompetences()` + `loadCompetenceList()` badges cliquables depuis conversations Assistant IA |
| 05/07/2026 | `challenge-cards.html` : génération IA Groq (`generateQuestionsWithAI()`) pour questions sur mesure par compétence |
| 05/07/2026 | `challenge-cards.html` : `generateQuestionsForCompetence()` essaie IA puis fallback local |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.2.3 → 1.3.0 |
| 05/07/2026 | `challenge-cards.html` : fond avec cartes flottantes (🂠🃏) animées + dégradés radiaux |
| 05/07/2026 | `challenge-cards.html` : trophée SVG vectoriel (gold/silver/bronze) avec animations |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.3.0 → 1.3.1 |
| 05/07/2026 | `challenge-cards.html` : suppression boutons retry/skip — mauvaise réponse surligne la bonne puis passe à la suivante après 1.2s |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.3.1 → 1.3.2 |
| 05/07/2026 | `challenge-cards.html` : génération IA Groq améliorée avec fallback toast + affichage compétence dans intro, HUD et résultat |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.3.2 → 1.3.3 |
| 05/07/2026 | `challenge-cards.html` : 20 questions Windows 11 + `_matchCompTags()` insensible à la casse + fallback toast si aucune question locale |
| 05/07/2026 | `challenge-cards.html` : modèle Groq changé pour `llama-3.1-8b-instant` (plus fiable) |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.3.3 → 1.3.4 |
| 05/07/2026 | Fix `challenge-game.html` : `_sb` non défini — ajout `_SB_URL`, `_SB_KEY`, `_sb=null`, `_initSB()` avant `generatePin()` |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.3.4 → 1.3.5 |
| 05/07/2026 | Fix clés API : `migrateKey()` supprimée, getters lisent toutes les anciennes clés, setters acceptent toute clé > 5 chars |
| 05/07/2026 | Fix `challenge-cards.html` : `_getGroqKey()` lit `gq_key`→`groq_key`→`groq_api_key` |
| 05/07/2026 | Fix `challenge-game.html` + `challenge-plant.html` : fallback lecture clé Groq |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.3.5 → 1.3.6 |
| 05/07/2026 | Fix CSP : `connect-src` élargi sur `admin.html`, `login.html`, `challenge-cards.html` (OpenRouter, Groq, Gemini, EmailJS) |
| 05/07/2026 | **Version bump** : `APP_VERSION` 1.3.6 → 1.3.7 |
| 06/07/2026 | `supabase.js` : fix `logActivity('login')` — ajout `await` pour éviter que la navigation ne tue la requête |
| 06/07/2026 | `supabase.js` : fix `logActivity('logout')` — déplacé avant `auth.signOut()` et `currentUser = null` |
| 06/07/2026 | `supabase.js` : fix `logActivity('profile_update')` — `saveProfileCompletion()` convertie en `async/await` |
| 06/07/2026 | Création `.gitignore` (exclut `_*`, `*.bak`, `*.docx`, `*.txt`, `inx/`) — préparation GitHub |
| 06/07/2026 | Création `.gitignore` (exclut `_*`, `*.bak`, `*.docx`, `*.txt`, `inx/`) — préparation GitHub |
| 06/07/2026 | `quiz.html` : fix `loadSavedPresentations()` — chaînes innerHTML multi-lignes fusionnées (carte présentation absente) |
| 06/07/2026 | `quiz.html` : fix `loadDistribLists()` — chaînes innerHTML multi-lignes fusionnées (section distributions invisible) |
| 06/07/2026 | `quiz.html` : fix `renderQuizList()` — chaînes innerHTML multi-lignes fusionnées (liste quiz publiés vide) |
| 06/07/2026 | `quiz.html` : fix `renderLearnerQ()` — tag `<span class="qto-text">` hors string JS (options réponse sans texte) |
| 06/07/2026 | `quiz.html` : fix `quitQuiz()` + `finishLearner()` + `showQuizStats()` + `exportStatsPDF()` — chaînes multi-lignes |
| 06/07/2026 | `quiz.html` : nettoyage global du bloc `<script>` principal — suppression de TOUS les retours à la ligne dans les 104k chars du JavaScript (CRLF → espace) pour éliminer tous les SyntaxError potentiels |
| 06/07/2026 | **Version bump** : `APP_VERSION` 1.3.8 → 1.3.9 |
| 08/08/2026 | **Remplacement Llama 4 Scout 17B (v1.4.1)** : Groq décommissionne le modèle (17/07/2026), remplaçants officiels GPT OSS 120B / Qwen3.6 27B. MODEL_MAP : groq-scout → openai/gpt-oss-120b, llama4-scout-free → openai/gpt-oss-20b:free ; listes PROVIDERS nettoyées ; labels i18n FR/AR/EN + libellés HTML (10 pages) mis à jour. Clés internes + FALLBACK_ORDER inchangés. Modèles payants OpenRouter (Kimi K3, KAT-Coder) et routeur auto-beta NON ajoutés (payants, risque de coût). Prompts/identité/présentation intacts. |
| 08/08/2026 | **Version bump** : APP_VERSION 1.4.0 → 1.4.1 |
| 08/08/2026 | **Fix 413 TPM Groq + slugs OpenRouter retirés (v1.4.2)** : 413 = quota TPM GRATUIT par minute (6000/8000), pas le crédit. Ajout du trim anti-TPM dans callAI (sysPrompt 700+700, historique ~2500 chars — manquait dans la copie) + troncature des questions géantes (1000+1000). Slugs validés en live via API OpenRouter : deepseek-v3-free → nvidia/nemotron-3-super-120b-a12b:free, owl-alpha → nvidia/nemotron-nano-9b-v2:free. Labels i18n + HTML mis à jour |
| 08/08/2026 | **Version bump** : APP_VERSION 1.4.1 → 1.4.2 |
| 08/08/2026 | **Fix lenteur + 413 résiduel (v1.4.3)** : budgets TPM serrés (sysPrompt 600+600, question 600+600, historique ≤1200) + GARDE-FOU absolu dans callProvider (payload ≤ ~3400 chars ≈ 5100 tokens max même en arabe dense) + diagnostics console (📏 trim / 🛡️ garde-fou). Gemini 429 = quota libre quotidien (limit 0, reset ~minuit), pas un bug |
| 08/08/2026 | **Version bump** : APP_VERSION 1.4.2 → 1.4.3 |
| 08/08/2026 | **Cooldown intelligent (v1.4.4)** : _markModelDead par raison (429 daily→minuit, 429 retry→clamp 10-300s, 413→60s, 401/403→15min, 400/404→fin de jour, 5xx→3min), persistance localStorage clé journalière (purge auto minuit + au save des clés), skip immédiat dans callModel, retry bloquant 429 SUPPRIMÉ, toast 'modèle indisponible → bascule auto'. Fin des 429/413 répétés : réponse au 1er modèle valide |
| 08/08/2026 | **Version bump** : APP_VERSION 1.4.3 → 1.4.4 |
| 08/08/2026 | **Indicateur de réflexion dans la saisie (v1.4.5)** : #reflectInd (spinner + « 🤔 Réflexion... » 3 langues) sous le textarea, visible pendant la génération, masqué dans le finally |
| 08/08/2026 | **Version bump** : APP_VERSION 1.4.4 → 1.4.5 |
| 08/08/2026 | Mémoire évolutive AXON (v1.4.9) : stores localStorage + sync Supabase (table axon_memory), buildAxonContext, postProcess décision, nom préféré |
| 08/08/2026 | **Fix 413 TPM Groq structurel (v1.5.0)** : max_tokens 8192→4096 POUR GROQ UNIQUEMENT (OpenRouter/Gemini gardent 8192, limites élevées). Cause racine : le quota TPM gratuit Groq (6000/8000) compte input + max_tokens prévu → chaque requête à 8192 = ~8595 attendus > limite = 413 systématique + lenteurs fallbacks. À 4096+~400 ≈ 4400 < 6000 : zéro 413. Vos réponses Groq tronquaient déjà à ~8k très souvent, aucune perte réelle. |
| 16/08/2026 | **Fix SyntaxError `admin.html`** : script inline reformaté — 5 chaînes multi-lignes en single quotes converties en template literals (backticks) ; passe `node --check` + `new vm.Script()` |
| 16/08/2026 | **Tracking `trainer_id` Jardin des fleurs** : ajout paramètre `t_id` dans les URLs de jeu (`challenge-plant.html` : `showSaveResult()`, `_gameLink()` ; `challenges.js` : `challengeDistribGenerate()`, `challengeDistribAddSingleRow()`) ; parsing `t_id` en mode apprenant → `plant_trainer_id` (localStorage) ; soumission fleur : `GAME_PUBLISH_KEY` → `plant_trainer_id` → URL `t_id`. Problème : toutes les fleurs existantes ont `trainer_id = NULL` → filtre jardin admin RETIRÉ temporairement ; réactiver `trainer_id.eq.currentUser.id` après création de nouvelles fleurs |
| 16/08/2026 | **Profil utilisateur self-service** : `supabase.js` — `openEditProfile()` (pré-remplit le modal, titre « Modifier mon profil ») + `saveProfileCompletion()` étendu (`full_name` + `full_name_ar` + `specialite`, puis `updateAuthUI()`) ; `index.html` + `admin.html` — bouton drawer « 👤 Modifier mon profil » + champ `#profileFullName` dans `#profileOverlay` + bouton fermeture ✕ |
| 16/08/2026 | **Reset infos utilisateur (Admin)** : `admin.html` — nouvelle colonne 🔄 dans le tableau utilisateurs, fonction `resetUserInfo(id, email)` : PATCH `profiles` (full_name/full_name_ar/specialite = '') + PUT auth `user_metadata` = {} (rôle + email conservés) ; `colspan` 5 → 7 |
| 16/08/2026 | **SQL** : `supabase-schema.sql` — bloc migration idempotent en fin de fichier (`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name_ar TEXT;` / `specialite TEXT;`) |
| 16/08/2026 | **Version bump** : `APP_VERSION` 1.5.8 → 1.5.9 (règle mjr3) |
| 16/08/2026 | **Migration modèles Groq (décommissionnement Llama 3.1 8B Instant)** : js/shared.v2.js — liste UI l.2007 + preset groq-fast l.2017 : llama-3.1-8b-instant → openai/gpt-oss-20b ; challenge-cards.html l.484 : appel direct Groq → openai/gpt-oss-20b. Aucun changement de prompt ni de code (seuls les noms de modèles remplacés) ; FALLBACK_ORDER/presets/commentaire TPM inchangés. Vérifié : 
ode --check OK, 0 occurrence restante dans le code |
| 16/08/2026 | **Version bump** : APP_VERSION 1.5.9 → 1.6.0 (règle mjr3) |
| 16/08/2026 | **Portage « 🔍 Vérifier la compétence » (générateur de prompt)** : ajout bouton `#checkCompetenceBtn` + `#competenceResult` dans `generator.html` (après la textarea Compétence visée), clés i18n `checkCompetence` FR/AR/EN + handler click dans `js/shared.v2.js` (copie de la version de référence `ver 100116` v1.7.8 — utilise `callAI` sans modèle en dur, messages trilingues), CSS `.comp-check-result`/`.comp-msg` ajouté en fin de `css/style.css`. Aucun prompt ni code existant modifié. Vérifié : `node --check` OK |
| 16/08/2026 | **Version bump** : APP_VERSION 1.6.0 → 1.6.1 (règle mjr3) |
| 16/08/2026 | **Portage des nouveaux modèles (réf. `ver 100116` v1.7.8)** : MODEL_MAP — retirés groq-scout/llama3.3-free/llama32-free/hermes405b-free/deepseek-v3-free/owl-alpha/llama4-scout-free, ajoutés groq-qwen (qwen/qwen3.6-27b) + or-nemotron-super-free + or-gemma4-free (google/gemma-4-31b-it:free) + or-gptoss20b-free + or-ling3-free (inclusionai/ling-3.0-flash:free) + or-nemotron-nano-free (nvidia/nemotron-3-nano-30b-a3b:free) ; groq-fast conservé = openai/gpt-oss-20b (fix décommissionnement) ; PROVIDERS Groq + qwen/qwen3.6-27b, OpenRouter −nemotron-nano-9b-v2:free +gemma-4-31b-it +ling-3.0-flash ; FALLBACK_ORDER et groqModels mis à jour ; i18n FR/AR/EN — 6 clés nouvelles, 6 anciennes retirées ; radios modelChoice mises à jour sur les 10 pages HTML. Aucun prompt ni code modifié. Vérifié : node --check OK, 0 ancien preset restant, 10/10 pages OK |
| 16/08/2026 | **Version bump** : APP_VERSION 1.6.1 → 1.6.2 (règle mjr3) |
| 16/08/2026 | **Fix IA ignore le prompt généré** : double troncature anti-TPM détruisait le « Contexte de la formation » du prompt généré (~3000 chars) → l'IA redemandait les infos puis répondait un mauvais sujet (contamination mémoire AXON). `js/shared.v2.js` : coupe par message 1200(600+600) → 8000(3000+5000) ; budget payload 1200/2200 → 4800 (dernier message utilisateur toujours envoyé en entier, seul l'historique est élagué). max_tokens Groq s'ajuste automatiquement (input+max_tokens = constante) → aucun risque 413. Vérifié : node --check OK + test simulé |
| 16/08/2026 | **Version bump** : APP_VERSION 1.6.2 → 1.6.3 (règle mjr3) |
| 16/08/2026 | **Fix réponse IA tronquée** : max_tokens Groq trop restrictif (55 % TPM − input ≈ 3300 tokens ≈ 10k chars) → le document pédagogique complet (grille 4×4, critères, indicateurs ✅, conclusion) était coupé à l'évaluation. Réf. 100113 : max_tokens 8192 fixe. Fix : max_tokens = max(2048, min(8192, floor(TPM×0.85) − input − 200)) → gpt-oss-120b ≈ 5256 tokens ≈ 16 800 chars ; Requested ≈ 85 % TPM − 200 < TPM → jamais 413 par taille (429 fenêtre roulante → cooldown + fallback gérés). Regex TPM corrigée (gpt-oss-20b + qwen3.6-27b = 6000, faussement 8000 avant). Vérifié : node --check + simulation |
| 16/08/2026 | **Version bump** : APP_VERSION 1.6.3 → 1.6.4 (règle mjr3) |
| 16/08/2026 | **Fix balise `<br>` affichée en texte littéral** : `markdownToHtml` (js/shared.v2.js) échappait `<` → `&lt;` AVANT le traitement des tableaux → le `<br>` de l'IA dans les cellules devenait du texte brut. Fix : protection par placeholder `@@BR@@` avant l'échappement (regex `<\s*br\s*\/?>/gi`) puis restauration en vraie balise `<br>` après la conversion `\n → <br>` — rendu correct dans les cellules de tableaux ET hors tableaux (survit à sanitizeHtml). Vérifié : node --check OK + test simulé (0 occurrence `&lt;br&gt;`) |
| 16/08/2026 | **Version bump** : APP_VERSION 1.6.4 → 1.6.5 (règle mjr3) |
| 16/08/2026 | **Fix message « Aucun fournisseur IA disponible » trompeur (génération présentation)** : les catch gamma (js/shared.v2.js + js/from-doc.js) avalaient l'erreur réelle et affichaient toujours « quotas gratuits épuisés » même pour une clé manquante ou un modèle 404. Fix : affichage de l'erreur RÉELLE (err.message — clé manquante, HTTP 404/429...) + rappel quota uniquement si l'erreur est liée aux quotas (regex 429/daily/quota/limit/épuis/exhausted/RESOURCE_EXHAUSTED). Vérifié : node --check OK (2 fichiers) |
| 16/08/2026 | **Version bump** : APP_VERSION 1.6.5 → 1.6.6 (règle mjr3) |
| 16/08/2026 | **Fix « Le modèle n'a pas retourné de JSON valide » (génération présentation)** : cause = réponse TRONQUÉE (max_tokens Groq 85 % TPM ≈ 10-15k chars vs 16 slides denses ≈ 15-20k chars → JSON coupé avant l'accolade fermante). Fix : helper partagé `window.parseGammaJson` (shared.v2.js + from-doc.js) — fences markdown supprimées, bloc `{...}` équilibré isolé, et CONTINUATION AUTOMATIQUE : si JSON incomplet/invalide → « Continue EXACTLY from where the JSON stopped » + 1500 derniers chars → suite APPENDUE → re-parsing (3 essais, fallback de modèle actif). Erreurs diagnostiques (début/fin de réponse). Vérifié : node --check OK + simulation (JSON tronqué → 1 continuation → slides intacts) |
| 16/08/2026 | **Version bump** : APP_VERSION 1.6.6 → 1.6.7 (règle mjr3) |
| 16/08/2026 | **Fix présentation « JSON invalide » persistant — RETRY gros budget (comparaison ver 100113)** : la 100113 envoie max_tokens 8192 FIXE Groq → 413 systématique → fallback immédiat Gemini/OpenRouter (8192 ≈ 25k chars) qui complétaient le JSON. Notre v1.6.4 évite le 413 mais Groq tronque (~10-14k chars < ~22k nécessaires) → JSON invalide sans bascule. Fix : nouveau helper `window.generateGammaJson` (shared.v2.js + from-doc.js) — si JSON invalide (troncature), retry automatique sur `gemini-flash` → `or-nemotron-super-free` → `gemini-pro` (8192 tokens ≈ 25k chars) ; erreurs quotas/clés propagées sans retry. callAI : forceModel résolu via MODEL_MAP (clé → nom API réel). Vérifié : node --check OK + simulation flux complet (auto tronqué → continuations ratées → retry gemini-flash → 2 slides complets) |
| 16/08/2026 | **Version bump** : APP_VERSION 1.6.7 → 1.6.8 (règle mjr3) |
| 16/08/2026 | **Fix modèles Gemini retirés par Google + slug OpenRouter invalide (comp. ver 10093)** : 10093 = MÊME config obsolète (gemini-2.0-flash / gemini-2.5-pro) → rien à porter. Dép. Google 2026 : 2.0-flash → gemini-3.6-flash ; 2.5-pro restreint (arrêt 16/10/2026) → gemini-3.1-pro-preview ; generateContent toujours supporté (pas de migration Interactions API). MODEL_MAP + PROVIDERS gemini mis à jour. API OpenRouter vérifiée : `inclusionai/ling-3.0-flash:free` N'EXISTE PAS (ling = payant uniquement) → or-ling3-free 404 quotidien → RETIRÉ partout (MODEL_MAP, PROVIDERS, FALLBACK_ORDER, i18n FR/AR/EN, radios des 10 pages HTML) ; 4 autres slugs :free validés. Vérifié : node --check OK, 0 occurrence hors .md |
| 16/08/2026 | **Version bump** : APP_VERSION 1.6.8 → 1.6.9 (règle mjr3) |
| 16/08/2026 | **REVERT helpers JSON présentation (v1.6.7/v1.6.8) + purge cooldowns obsolètes (demande utilisateur)** : retour au comportement v1.6.6 — parsing JSON simple (`JSON.parse` + extraction `{...}` équilibré + erreur claire) ; `parseGammaJson` (continuation) et `generateGammaJson` (retry gros budget) SUPPRIMÉS ; callAI forceProvider restauré. Conservé : v1.6.6 (erreur réelle affichée) + v1.6.9 (gemini-3.6-flash / gemini-3.1-pro-preview / ling retiré — fixes validés). Cause des symptômes console : cooldowns 400/404 stockés par CLÉ de modèle bloquaient les nouveaux noms jusqu'à 00:10 + Groq TPM saturé (Used 7973/8000) ; « 1/0 » = modal vide (renderGammaSlides avant génération), pas un bug. AJOUT : `checkVersionNotification` purge les clés `axon_dead_*` au changement de version → le bump 1.7.0 efface les cooldowns obsolètes. Vérifié : node --check OK (2 fichiers), 0 occurrence des helpers |
| 16/08/2026 | **Version bump** : APP_VERSION 1.6.9 → 1.7.0 (règle mjr3) |
| 16/08/2026 | **Portage modèles depuis référence « ver 100117 16.08.2026 reprise changement du modeles »** (demande utilisateur — « change que les nouveaux modelés ») : groq-fast → llama-3.1-8b-instant ; ajout groq-scout (gpt-oss-120b) ; retrait groq-qwen ; OpenRouter free = llama32-free (llama-3.2-3b), hermes405b-free (hermes-3-405b), owl-alpha (nemotron-nano-9b-v2), llama4-scout-free (gpt-oss-20b), deepseek-v3-free (nemotron-3-super-120b), llama3.3-free ; retrait or-gemma4-free (gemma-4-31b-it). FALLBACK_ORDER + groqModels alignés. i18n FR/AR/EN 12 clés modèles. 10 pages HTML : bloc radios 12 valeurs. DÉCISION UTILISATEUR : noms Gemini 2026 conservés (gemini-3.6-flash / gemini-3.1-pro-preview — la référence contient 2.0-flash DÉFUNCT 01/06/2026 → 404 garanti et 2.5-pro fermé 16/10/2026, vérifié sur la doc Google). Vérifié : node --check OK, 0 ancienne clé restante, 6 radios × 10 pages |
| 16/08/2026 | **Version bump** : APP_VERSION 1.7.0 → 1.8.0 (règle mjr3) |
| 16/08/2026 | **Logs de diagnostic callAI** (réponse IA « pend » sans rien loguer — observé 3×) : ajout de 4 logs — essai modèle (🎯), timeout 120s (⏱️), premier chunk reçu (✅), fin de stream (🏁). Permet de distinguer : fetch pendu vers Gemini (aucun log après garde-fou) vs erreur réseau (échoué logué) vs réponse reçue |
| 16/08/2026 | **Version bump** : APP_VERSION 1.8.0 → 1.8.1 (règle mjr3) |
| 16/08/2026 | **Timeout de connexion 25s anti-pendaison** : le fetch Gemini pendait chez l'utilisateur (aucune réponse HTTP) — diagnostic : log 🎯 essai gemini-flash puis silence. « Ça marchait avant » car gemini était sauté (cooldown 404) et llama3.3 répondait. Fix : connect timeout 25s → abort + cooldown 5 min + fallback immédiat (Groq/llama3.3) ; stream timeout 120s conservé ; distinction arrêt manuel vs timeout via _abortReason ; bug de scope timeoutId/finally corrigé |
| 16/08/2026 | **Version bump** : APP_VERSION 1.8.1 → 1.8.2 (règle mjr3) |
| 16/08/2026 | **Réponse Gemini vide (stream terminé sans contenu)** : la connexion fonctionne (fix timeout 25s) mais zéro chunk reçu. Fix : parsing de TOUTES les parts Gemini (avec repli pensée) au lieu de parts[0].text ; thinkingConfig thinkingBudget:0 (le mode pensée pouvait consommer les 8192 tokens sans texte) ; réponse vide → log dernier chunk (diagnostic SAFETY/MAX_TOKENS) + cooldown 5 min + fallback llama3.3 |
| 16/08/2026 | **Version bump** : APP_VERSION 1.8.2 → 1.8.3 (règle mjr3) |
| 16/08/2026 | **Gamma : thinkingConfig retiré + parsing JSON robuste** : le 400 INVALID_ARGUMENT de gemini-3.6-flash venait de thinkingConfig:thinkingBudget:0 (1.8.3) → retiré. Échec présentation : gemini mort → groq-oss-120b (max_tokens 4097) tronquait le JSON 16 slides. Politique modèles = IDENTIQUE à l'Assistant (même callAI/fallback, conservé comme demandé). Parsing : fences json supprimées, réparation JSON tronqué (fermeture auto des [ ] { } restants), diagnostic réponse brute logué en cas d'échec |
| 16/08/2026 | **Version bump** : APP_VERSION 1.8.3 → 1.8.4 (règle mjr3) |
| 16/08/2026 | **Gamma : logique de « ver 24 rapide » appliquée** (décision utilisateur, logique Assistant conservée) : prompt compact 15 slides (STRUCTURE obligatoire) + rôle system + GROQ FORCÉ (groq-llama → groq-fast → groq-scout) ; ancien prompt 16 slides de 5000 chars supprimé (saturait le budget Groq → JSON tronqué → « JSON valide » impossible). Parsing robuste conservé. Vérifié : node --check OK, 0 ancien prompt |
| 16/08/2026 | **Version bump** : APP_VERSION 1.8.4 → 1.8.5 (règle mjr3) |
| 16/08/2026 | **Nouvelle règle mjr4 (modèles vs code)** : un changement de MODÈLES ne touche QUE la config modèles (MODEL_MAP, PROVIDERS, FALLBACK_ORDER, groqModels, i18n modèles, radios HTML), jamais le code applicatif ; un changement de code ne touche jamais les modèles. Ajoutée dans les Règles d'AGENTS.md. Aucun bump de version (mise à jour .md uniquement) |
| 28/10/2026 | **Fix images manquantes sur certaines slides (présentation)** : cause mesurée = l'API image gratuite pollinations.ai limite à 1 image / 45 s par IP (au-delà HTTP 402 + `Retry-After`), alors que l'app demandait 15 images d'un coup et que `generateImage()` ne faisait aucune requête (aucun échec détecté, retry mort, seed aléatoire cassant le cache). Fix : module `APC_IMG` en AJOUT en fin de `js/shared.v2.js` — file séquentielle fetch+blob avec respect de `Retry-After`, clé Pollinations facultative (`gen.pollinations.ai` + Bearer), repli automatique Wikimedia Commons (aucune slide vide), 6 images IA par défaut (réglable 4/6/8/10/15), seed figé par hachage du prompt (cache `immutable`), statut 🖼️ n/6 + persistance `gammaData` après chaque image. Vérifié : `node --check` OK + banc d'essai VM 3 scénarios (IA+Commons, IA en échec→Commons 3/3, tout en échec→0 image sans plantage) |
| 28/10/2026 | **Version bump** : APP_VERSION 1.8.5 → 1.8.6 (règle mjr3) |
| 28/10/2026 | **Fix PPTX slide à moitié vide + banque polluée** : `urlToBase64` timeout 5 s → 30 s (+ en-tête Authorization pour gen.pollinations.ai, rejet des réponses non-OK/trop petites) ; la colonne image n'est réservée que si le base64 a réellement été obtenu (`_pptxHasImg`, texte 12.33 sinon) ; `saveGeneratedImage` limité aux images IA (`image_source !== 'commons'`, dans `shared.v2.js` et `from-doc.js`) ; `gammaData` persisté aussi dans le `.then` de `generateGammaPresentation` || 28/10/2026 | **« Aucune image » après v1.8.6 — CSP bloquait fetch** : la balise CSP des 6 pages (`index`, `login`, `admin`, `admin-sessions`, `challenges`, `challenge-cards`) n'autorisait pas `connect-src` vers image.pollinations.ai / commons.wikimedia.org → `fetch` renvoyait `Failed to fetch` et le pipeline retournait 0 image (l'ancien code passait par `<img>` autorisé par `img-src https:`). Fix : ajout des 4 domaines dans `connect-src` + repli automatique en mode `<img>` direct si fetch reste bloqué (HTML en cache). Vérifié dans Chromium sur le site déployé (fetch 200 en 3,3 s) |
| 28/10/2026 | **Version bump** : APP_VERSION 1.8.6 → 1.8.7 (règle mjr3) |
| 28/10/2026 | **Commons ne trouvait rien en français** : « maintenance informatique » → 0 résultat (« vocational training » → 8). Fix : dictionnaire FR→EN des mots métier (scénario→teaching, informatique→computer, évaluation→assessment…), requêtes génériques tournantes et déduplication des URLs — chaque slide reçoit une image différente. Vérifié : pipeline 5 slides = 5/5 images distinctes en 8,9 s |
| 28/10/2026 | **Version bump** : APP_VERSION 1.8.7 → 1.8.8 (règle mjr3) |
| 28/10/2026 | **Commons renvoyait des scans (.djvu/PDF/SVG)** : ajout de l'opérateur `filetype:bitmap` + filtre mime strict `image/jpeg|png|webp` → 100 % d'images exploitables (mesuré : 10/10 bitmap contre 8/10 sans filtre) |
| 28/10/2026 | **Version bump** : APP_VERSION 1.8.8 → 1.8.9 (règle mjr3) |
| 28/10/2026 | **Synchronisation des deux dépôts** : le dépôt utilisé par l'utilisateur et relié à Vercel est le PRIVÉ `APC-ALG-RIE-G-N-RATION-3-G-n-rez-` (le public `...-des-prompts-professionnels` est un miroir). Correctifs poussés sur les deux : privé `e7d0c97`, public `efddec5` || 28/10/2026 | **Images = contenu de la diapo, plus le titre seul** : extraction des mots porteurs du CONTENU (mots vides FR/EN + verbes de consigne écartés), dictionnaire FR→EN enrichi (diagnostic, panne, câblage, disjoncteur, chantier, soudure, topographie…). Prompt IA = `image_prompt` + titre + mots du contenu ; requêtes Wikimedia = mots du contenu |
| 28/10/2026 | **Version bump** : APP_VERSION 1.8.9 → 1.9.0 (règle mjr3) |
| 28/10/2026 | **Commons = ET implicite** : mesuré `electrical panel circuit breaker` = 6 résultats, `wiring multimeter manual equipment` = 0. Requêtes raccourcies à 4 mots FR puis 3 et 2 mots EN |
| 28/10/2026 | **Version bump** : APP_VERSION 1.9.0 → 1.9.1 (règle mjr3) |
| 28/10/2026 | **Mots pédagogiques abstraits écartés** (`savoirs`, `critères`, `grille`, `évaluation`…) : ils donnaient « knowledge » / « criteria » → images sans rapport |
| 28/10/2026 | **Version bump** : APP_VERSION 1.9.1 → 1.9.2 (règle mjr3) |
| 28/10/2026 | **Priorité à l'article Wikipédia** du mot-clé avant Commons (« Multimètre » → `Digital_Multimeter_Aka.jpg`, « Disjoncteur » → `Circuit_breaker_2_pole_on_DIN_rail.JPG`) + CSP `connect-src` : `fr.wikipedia.org`, `en.wikipedia.org` dans les 6 pages |
| 28/10/2026 | **Version bump** : APP_VERSION 1.9.2 → 1.9.3 (règle mjr3) |
| 28/10/2026 | **Rejet des images hors sujet** (constaté en direct : « conformité » → logo du Conseil constitutionnel, « normes » → schéma « Hiérarchie des normes », « respect » → peinture) : filtre de noms (logo/blason/schéma/carte/`.svg`), contrôle de sujet (le fichier doit citer le mot-clé ou sa traduction), titre Wikipédia strict, note photo `.jpg` > `.png`, mots « méta » écartés, `sécurité`→`safety helmet`, `mesure`→`measuring instrument` |
| 28/10/2026 | **Wikimedia 429 → diapos sans image** : 9 requêtes par diapo saturaient l'API. Fix : cache `localStorage`, budget de 26 appels, arrêt dès qu'une requête donne un fichier pertinent, pause 1,5 s + une nouvelle tentative sur 429. Mesure : 5 diapos = 5/5 images en 4,9 s |
| 28/10/2026 | **Version bump** : APP_VERSION 1.9.3 → 1.9.4 (règle mjr3) |
| 28/10/2026 | **Titre porteur + traductions fiables** : le titre repasse en tête (les titres creux sont neutralisés par les mots vides), plus de mot français brut en requête (« station » → gare de Chicago, « commande » → souffleuse) |
| 28/10/2026 | **Version bump** : APP_VERSION 1.9.4 → 1.9.5 (règle mjr3) |
| 28/10/2026 | **Titre Wikipédia exact ou « mot-clé (précision) »** (« Réseau social » écarté), `.svg.png` refusés, `management`/`network`/`security` retirés des requêtes. Mesure diapos métiers : 5/5 images en 6,8 s |
| 28/10/2026 | **Version bump** : APP_VERSION 1.9.5 → 1.9.6 (règle mjr3) |
| 28/10/2026 | **Note** : Wikimedia limite par identifiant client — Node/curl reçoivent 429, le navigateur 200 → les essais de pertinence se font dans le navigateur. Dépôts synchronisés : privé `6979861`, public `081a5d3` |
| 28/10/2026 | **Schéma Supabase remis à jour et rendu ré-exécutable** (`supabase-schema.sql`) : section 25 « pipeline d'images v1.8.6 → v1.9.6 » (colonne `generated_images.source`, index `idx_images_created` / `idx_images_visibility` / `idx_presentations_created`) ; `DROP POLICY IF EXISTS` avant les 69 `CREATE POLICY` ; `DROP CONSTRAINT IF EXISTS` avant `unique_quiz_code` et `unique_challenge_code` ; correction du défaut historique `competence_flowers` (FK vers `challenge_participants` / `challenges` créées après → table absente au 1er passage, colonnes déplacées en section 17bis) ; numérotation des sections corrigée (deux « 22 »). Fichier `supabase-schema.sql` désormais versionné dans les deux dépôts |
| 28/10/2026 | **Validation du schéma sur PostgreSQL 17.11 local** (base vierge + schéma `auth` de substitution) : 1re passe = 0 erreur, 2e passe = 0 erreur, 23 tables, RLS sur les 23, 69 policies, clés étrangères de `competence_flowers` présentes. Aucun changement de code applicatif → pas de bump de version |
