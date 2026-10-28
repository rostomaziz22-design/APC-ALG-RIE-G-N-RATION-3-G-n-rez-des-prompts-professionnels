'use strict'; console.log('✅ shared.v2.js CHARGÉ');
        const APP_VERSION = '1.9.5';
        function checkVersionNotification() {
            var saved = localStorage.getItem('app_version');
            if (saved !== APP_VERSION) {
                // Purge des cooldowns « modèle mort » de l'ancienne version : ils sont stockés par CLÉ de
                // modèle (ex. 'gemini-flash') et restent valides jusqu'à minuit — si les noms d'API ont
                // changé (ex. gemini-2.5-pro → gemini-3.1-pro-preview), les nouveaux noms seraient bloqués
                // à tort jusqu'à 00:10. Un bump de version = configuration modèle possiblement changée → reset.
                try {
                    Object.keys(localStorage).forEach(function(k) { if (k.indexOf('axon_dead_') === 0) localStorage.removeItem(k); });
                } catch (e) {}
                var ver = APP_VERSION;
                var cl = (typeof currentLang !== 'undefined' ? currentLang : null) || localStorage.getItem('lang') || 'fr';
                var msg = cl === 'fr' ? 'APC Algérie GÉNÉRATION 3 a été mise à jour.' : cl === 'ar' ? 'تم تحديث APC Algérie GÉNÉRATION 3.' : 'APC Algérie GÉNÉRATION 3 has been updated.';
                var okLabel = cl === 'fr' ? 'OK' : cl === 'ar' ? 'حسناً' : 'OK';
                var banner = document.createElement('div');
                banner.id = '__updateBanner';
                banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:10000;background:linear-gradient(135deg,#1B5E20,#2E7D32);color:#fff;padding:14px 20px;text-align:center;font-size:14px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,.3);transform:translateY(-100%);transition:transform .5s ease;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;';
                banner.innerHTML = '<span style="font-size:18px;">🎉</span> <span>' + msg + '</span> <button id="__updateBtn" style="background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);color:#fff;padding:6px 18px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;">' + okLabel + '</button>';
                document.body.appendChild(banner);
                document.getElementById('__updateBtn').addEventListener('click', function() {
                    banner.style.transform = 'translateY(-100%)';
                    setTimeout(function() { banner.remove(); }, 500);
                    localStorage.setItem('app_version', ver);
                });
                setTimeout(function() { banner.style.transform = 'translateY(0)'; }, 100);
            }
        }
        function _breakMsg(path) {
            var m = { fr: { title: '🧘 Pause bien-être', body: 'Vous travaillez depuis un moment. Une courte pause peut améliorer votre concentration et votre productivité.', btn_break: '☕ Faire une pause', btn_later: '⏰ Me le rappeler dans 15 min', btn_continue: '▶ Continuer', tips: ['✔ Buvez un verre d\'eau.', '✔ Étirez-vous pendant 2 minutes.', '✔ Regardez au loin pendant 20 secondes.', '✔ Respirez profondément.'], timer_label: '☕ Pause en cours', timer_note: 'Nous vous attendons.', timer_resume: 'Reprendre', late_title: '🌙 Il se fait tard', late_body: 'Vous travaillez depuis plusieurs heures. Pensez à sauvegarder vos travaux et à vous reposer.', late_btn: 'Je vais me reposer', stat_title: '📊 Aujourd\'hui', stat_study: 'Temps de travail', stat_breaks: 'Pauses prises', stat_avg: 'Temps moyen avant pause', welcome_back: '👋 Bon retour !', welcome_msg: 'Prêt à continuer votre travail ?', min: 'min', today: "Aujourd'hui" }, ar: { title: '🧘 استراحة', body: 'أنت تعمل منذ فترة. قسط قصير من الراحة يمكن أن يحسن تركيزك وإنتاجيتك.', btn_break: '☕ خذ استراحة', btn_later: '⏰ ذكرني بعد 15 دقيقة', btn_continue: '▶ متابعة', tips: ['✔ اشرب كوباً من الماء.', '✔ تمدد لمدة دقيقتين.', '✔ انظر إلى البعيد لمدة 20 ثانية.', '✔ تنفس بعمق.'], timer_label: '☕ الاستراحة', timer_note: 'نحن في انتظارك.', timer_resume: 'العودة', late_title: '🌙 قد تأخر الوقت', late_body: 'أنت تعمل منذ عدة ساعات. تذكر حفظ عملك وأخذ قسط من الراحة.', late_btn: 'سأستريح', stat_title: '📊 اليوم', stat_study: 'وقت العمل', stat_breaks: 'الاستراحات', stat_avg: 'متوسط الوقت قبل الاستراحة', welcome_back: '👋 مرحباً بعودتك !', welcome_msg: 'هل أنت مستعد لمواصلة عملك ؟', min: 'دقيقة', today: 'اليوم' }, en: { title: '🧘 Wellness Break', body: 'You have been working for a while. A short break can improve your focus and productivity.', btn_break: '☕ Take a break', btn_later: '⏰ Remind in 15 min', btn_continue: '▶ Continue', tips: ['✔ Drink a glass of water.', '✔ Stretch for 2 minutes.', '✔ Look into the distance for 20 seconds.', '✔ Breathe deeply.'], timer_label: '☕ Break in progress', timer_note: 'We will be waiting.', timer_resume: 'Resume', late_title: '🌙 It is getting late', late_body: 'You have been working for several hours. Save your work and get some rest.', late_btn: 'I will rest', stat_title: '📊 Today', stat_study: 'Work time', stat_breaks: 'Breaks taken', stat_avg: 'Avg time before break', welcome_back: '👋 Welcome back !', welcome_msg: 'Ready to continue your work ?', min: 'min', today: 'Today' } };
            var l = currentLang === 'ar' ? 'ar' : currentLang === 'en' ? 'en' : 'fr';
            var keys = path.split('.');
            var v = m[l];
            for (var i = 0; i < keys.length; i++) v = v[keys[i]];
            var r = v || '';
            if (window.__compat && window.__compat.isEnabled) r = window.__compat.replaceEmoji(r);
            return r;
        }
        function _formatDuration(ms) {
            var h = Math.floor(ms / 3600000);
            var m = Math.floor((ms % 3600000) / 60000);
            if (h > 0) return h + 'h ' + m + _breakMsg('min');
            return m + ' ' + _breakMsg('min');
        }
        function _closeOverlay(id) {
            var el = document.getElementById(id);
            if (el) { el.style.opacity = '0'; setTimeout(function() { el.remove(); }, 400); }
        }
        function _createOverlay(id, innerHtml) {
            var existing = document.getElementById(id);
            if (existing) existing.remove();
            var o = document.createElement('div');
            o.id = id;
            o.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .4s;backdrop-filter:blur(4px);';
            if (window.__compat && window.__compat.isEnabled) innerHtml = window.__compat.replaceEmoji(innerHtml);
            o.innerHTML = innerHtml;
            document.body.appendChild(o);
            setTimeout(function() { o.style.opacity = '1'; }, 10);
            return o;
        }
        function showBreakTimer() {
            _closeOverlay('__breakOverlay');
            var totalSec = 300;
            var remaining = totalSec;
            var cardStyle = 'background:var(--surface,#1e1e2a);color:var(--text,#eee);border-radius:20px;padding:36px 32px;max-width:380px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5);';
            var html = '<div style="' + cardStyle + '">'
                + '<div style="font-size:40px;margin-bottom:12px;">☕</div>'
                + '<h2 style="margin:0 0 8px;font-size:1.1rem;">' + _breakMsg('timer_label') + '</h2>'
                + '<div style="font-size:42px;font-weight:700;margin:16px 0;font-variant-numeric:tabular-nums;" id="__timerDisplay">05:00</div>'
                + '<div style="font-size:.8rem;color:var(--text-muted,#999);margin-bottom:8px;">' + _breakMsg('timer_note') + '</div>'
                + '<ul style="text-align:left;font-size:.82rem;color:var(--text,#ccc);line-height:1.8;padding:0;list-style:none;margin:16px 0 20px;">';
            var tips = _breakMsg('tips');
            if (typeof tips === 'string') tips = tips.split('|');
            for (var ti = 0; ti < tips.length; ti++) html += '<li>' + tips[ti] + '</li>';
            html += '</ul><button id="__resumeBtn" onclick="__breakResume()" style="background:linear-gradient(135deg,#1B5E20,#2E7D32);color:#fff;border:none;padding:12px 36px;border-radius:30px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(27,94,50,.4);">' + _breakMsg('timer_resume') + '</button></div>';
            var o = _createOverlay('__breakTimer', html);
            window.__breakInterval = setInterval(function() {
                remaining--;
                if (remaining < 0) remaining = 0;
                var m = String(Math.floor(remaining / 60)).padStart(2, '0');
                var s = String(remaining % 60).padStart(2, '0');
                var d = document.getElementById('__timerDisplay');
                if (d) d.textContent = m + ':' + s;
                if (remaining <= 0) clearInterval(window.__breakInterval);
            }, 1000);
        }
        function __breakLateClose() { _closeOverlay('__breakOverlay'); localStorage.setItem('break_total','0'); localStorage.setItem('break_last_shown',String(Date.now())); }
        function __breakDoLater() { _closeOverlay('__breakOverlay'); localStorage.setItem('break_snooze',String(Date.now()+900000)); }
        function __breakDoContinue() { var n=Date.now(); _closeOverlay('__breakOverlay'); localStorage.setItem('break_last_shown',String(n)); localStorage.setItem('break_snooze',String(n+600000)); }
        function __breakResume() { clearInterval(window.__breakInterval); _closeOverlay('__breakTimer'); var n=Date.now(); localStorage.setItem('break_total','0'); localStorage.setItem('break_last_shown',String(n)); var c=parseInt(localStorage.getItem('break_count')||'0',10); localStorage.setItem('break_count',String(c+1)); }
        function showBreakOverlay() {
            var now = Date.now();
            var hr = new Date().getHours();
            if (hr >= 22 || hr < 5) {
                var cardStyle = 'background:var(--surface,#1e1e2a);color:var(--text,#eee);border-radius:20px;padding:36px 32px;max-width:400px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5);';
                var html = '<div style="' + cardStyle + '">'
                    + '<div style="font-size:44px;margin-bottom:12px;">🌙</div>'
                    + '<h2 style="margin:0 0 12px;font-size:1.15rem;line-height:1.5;">' + _breakMsg('late_title') + '</h2>'
                    + '<p style="font-size:.85rem;color:var(--text-muted,#999);margin-bottom:24px;line-height:1.6;">' + _breakMsg('late_body') + '</p>'
                    + '<button id="__breakLateBtn" onclick="__breakLateClose()" style="background:linear-gradient(135deg,#1B5E20,#2E7D32);color:#fff;border:none;padding:12px 32px;border-radius:30px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(27,94,50,.4);">' + _breakMsg('late_btn') + '</button>'
                    + '</div>';
                var o = _createOverlay('__breakOverlay', html);

                return;
            }
            var totalMs = parseInt(localStorage.getItem('break_total') || '0', 10);
            var totalMin = Math.floor(totalMs / 60000);
            var cardStyle = 'background:var(--surface,#1e1e2a);color:var(--text,#eee);border-radius:20px;padding:36px 32px;max-width:420px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5);';
            var html = '<div style="' + cardStyle + '">'
                + '<div style="font-size:42px;margin-bottom:12px;">🧘</div>'
                + '<h2 style="margin:0 0 8px;font-size:1.15rem;line-height:1.5;">' + _breakMsg('title') + '</h2>'
                + '<p style="font-size:.82rem;color:var(--text-muted,#999);margin-bottom:6px;line-height:1.6;">' + _breakMsg('body') + '</p>'
                + '<p style="font-size:.75rem;color:var(--accent,#4CAF50);margin-bottom:18px;font-weight:600;">⏱ ' + _formatDuration(totalMs) + ' ' + _breakMsg('today') + '</p>'
                + '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'
                + '<button id="__breakBtn" onclick="showBreakTimer()" style="background:linear-gradient(135deg,#1B5E20,#2E7D32);color:#fff;border:none;padding:10px 22px;border-radius:30px;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(27,94,50,.4);">' + _breakMsg('btn_break') + '</button>'
                + '<button id="__laterBtn" onclick="__breakDoLater()" style="background:transparent;color:var(--text,#eee);border:1px solid var(--border,#444);padding:10px 22px;border-radius:30px;font-size:13px;font-weight:500;cursor:pointer;">' + _breakMsg('btn_later') + '</button>'
                + '<button id="__continueBtn" onclick="__breakDoContinue()" style="background:transparent;color:var(--text-muted,#999);border:none;padding:10px 18px;border-radius:30px;font-size:13px;cursor:pointer;">' + _breakMsg('btn_continue') + '</button>'
                + '</div></div>';
            var o = _createOverlay('__breakOverlay', html);
        }
        function checkBreakReminder() {
            var now = Date.now();
            var snooze = parseInt(localStorage.getItem('break_snooze') || '0', 10);
            if (now < snooze) return;
            var totalMs = parseInt(localStorage.getItem('break_total') || '0', 10);
            var lastVisit = parseInt(localStorage.getItem('break_last_visit') || '0', 10);
            var lastShown = parseInt(localStorage.getItem('break_last_shown') || '0', 10);
            if (lastVisit > 0) {
                var elapsed = now - lastVisit;
                if (elapsed < 600000) totalMs += elapsed;
                else totalMs = 0;
            }
            localStorage.setItem('break_last_visit', String(now));
            localStorage.setItem('break_total', String(totalMs));
            var threshold = 5400000;
            var cooldown = 1800000;
            if (totalMs >= threshold && now - lastShown > cooldown) showBreakOverlay();
        }
        function updateBreakStats() {
            var el = document.getElementById('__breakStats');
            if (!el) return;
            var totalMs = parseInt(localStorage.getItem('break_total') || '0', 10);
            var count = parseInt(localStorage.getItem('break_count') || '0', 10);
            var avg = count > 0 ? Math.round(totalMs / count / 60000) : '--';
            el.innerHTML = '<strong>' + _breakMsg('stat_title') + '</strong><br>'
                + _breakMsg('stat_study') + ' : ' + _formatDuration(totalMs) + '<br>'
                + _breakMsg('stat_breaks') + ' : ' + count + '<br>'
                + _breakMsg('stat_avg') + ' : ' + avg + ' ' + _breakMsg('min');
        }
        const T = {
            fr: {
                headerTitle: "APC ALGÉRIE <span>GÉNÉRATION 3</span>",
                ministere: "Ministère de la Formation et de l'Enseignement Professionnels",
                headerSub: "Formateur 2.0 – Assistant intelligent de conception pédagogique APC",
                headerDesc: "Générez des prompts professionnels pour ChatGPT, Claude, Gemini et Copilot afin de concevoir vos scénarios pédagogiques selon l'Approche Par Compétences.",
                headerSig: "",
                tab_home: "🏠 Accueil",
                tab_generator: "📝 Générateur de Prompts",
                tab_assistant: "🤖 Assistant IA",
                tab_about: "ℹ️ À propos",
                tab_guide: "📖 Guide complet",
                tab_fromdoc: "📄 Document → Présentation",
                tab_help: "❓ Aide Clés API",
                tab_admin: "⚙️ Admin",
                tab_quiz: "🎯 Quiz",
                tab_game: "🚀 Jeu Défense",
                tab_game2: "🌱 Jeu Plante",
                tab_games: "🎮 Jeux",
                tab_challenge: "🎮 Challenges",
                sec1Title: "Identité & mission de l'IA",
                roleLabel: "Rôle",
                roleHint: "📌 Exemple : Tu es un formateur expert en APC Algérie.",
                missionLabel: "Que doit faire ?",
                missionHint: "📌 Exemple : Construire un scénario pédagogique complet selon l'APC Algérie.",
                sec2Title: "Informations de formation",
                specialiteLabel: "Spécialité",
                moduleLabel: "Module",
                competenceLabel: "Compétence visée",
                niveauLabel: "Niveau",
                anneeLabel: "Année",
                dureeLabel: "Durée",
                nbStagLabel: "Stagiaires",
                espaceLabel: "Espace pédagogique",
                ressourcesLabel: "Ressources disponibles",
                contexteLabel: "Contexte professionnel",
                difficultesLabel: "Difficultés prévues",
                sec3Title: "Exemples d'assistants APC",
                examplesNotice: "⚠️ Cliquez sur une carte pour remplir TOUS les champs (rôle, mission, formation, AST)",
                sec4Title: "Options pédagogiques APC",
                astToggleLabel: "🔷 Utiliser AST (Analyse de situation de travail)",
                astMetierLabel: "Métier (AST)",
                astExtraitLabel: "Extrait AST",
                liveBadge: "EN DIRECT",
                btnCopy: "Copier",
                btnSendAI: "→ Envoyer à l'IA",
                btnReset: "Réinitialiser",
                saveCourseBtn: "💾 Sauvegarder le cours",
                savePresentationBtn: "💾 Sauvegarder la présentation",
                btnGamma: "🎨 Générer présentation",
                docGenerate: "🎨 Générer la présentation",
                newChat: "＋ Nouvelle conversation",
                quickAPC: "⚡ Raccourcis APC",
                historyLabel: "📂 Historique",
                providerLabel: "Fournisseur IA :",
                aiInputPlaceholder: "Écrivez votre message ou demandez un contenu APC...",
                emptyChatMsg: "Posez une question ou utilisez un raccourci APC pour commencer.",
                footerText: "APC Algérie GÉNÉRATION 3 — Formateur 2.0",
                themeLight: "☀️ Mode clair",
                themeDark: "🌙 Mode sombre",
                opt_analyse: "📋 Analyse APC",
                opt_scenario: "📐 Scénario APC (5 phases)",
                opt_integration: "🔗 Situation d'intégration",
                opt_evaluation: "✅ Évaluation",
                opt_grille: "📊 Grille critérielle 4×4",
                opt_criteres: "🎯 Critères de performance",
                opt_indicateurs: "📌 Indicateurs",
                opt_conclusion: "📝 Conclusion",
                opt_activities: "👥 Activités formateur/stagiaire",
                quick_scenario: "📐 Créer un scénario APC complet",
                quick_eval: "✅ Générer une évaluation APC",
                quick_fiche: "📄 Créer une fiche pédagogique",
                quick_integration: "🔗 Situation d'intégration",
                quick_grille: "📊 Grille critérielle APC 4×4",
                quick_cours: "📚 Cours complet APC",
                prompt_role: "Rôle",
                prompt_mission: "Mission",
                prompt_context: "Contexte de la formation",
                prompt_specialite: "Spécialité",
                prompt_module: "Module",
                prompt_competence: "Compétence visée",
                checkCompetence: "🔍 Vérifier la compétence",
                prompt_niveau: "Niveau",
                prompt_annee: "Année",
                prompt_duree: "Durée",
                prompt_stagiaires: "Stagiaires",
                prompt_espace: "Espace pédagogique",
                prompt_ressources: "Ressources",
                prompt_contexte: "Contexte professionnel",
                prompt_difficultes: "Difficultés prévues",
                prompt_ast: "AST (Analyse de situation de travail)",
                prompt_consignes: "Consignes pour l'IA",
                prompt_langue: "Langue de sortie",
                c1: "Réaliser une analyse APC complète et détaillée : lister les savoirs (théoriques et professionnels), les savoir-faire (préparer, installer, configurer, contrôler avec des actions précises), les savoir-être (rigueur, organisation, esprit d'analyse, sécurité, travail collaboratif), les ressources internes (cognitives, procédurales, comportementales) et externes (matérielles, documentaires, humaines).",
                c2: "Construire un scénario pédagogique APC complet selon les 5 phases (Contextualisation, Déstabilisation, Construction, Intégration, Transfert). Pour chaque phase : donner un titre, une durée, un objectif, une situation proposée, les activités du formateur, les activités des stagiaires, et la production attendue.",
                c3: "Créer une situation d'intégration authentique détaillée en lien avec le contexte professionnel, avec un scénario réaliste, une mission précise, des contraintes (temps, qualité, ressources) et une production attendue concrète.",
                c4: "Produire une évaluation basée sur les compétences : type d'évaluation, tâche demandée détaillée, consignes claires pour le stagiaire.",
                c5: "Générer une grille d'évaluation critérielle APC 4×4 avec 4 critères précis et 4 niveaux de maîtrise (Non maîtrisé, En cours, Maîtrisé, Expert). Présenter le tableau markdown avec ☐ pour chaque case. Ajouter un tableau des descripteurs de chaque niveau.",
                c6: "Générer les critères de performance observables détaillés pour chaque critère de la grille, sous forme de listes à puces avec des actions concrètes et vérifiables.",
                c7: "Générer les indicateurs de réussite sous forme de liste avec ✅, décrivant précisément ce qui valide la compétence.",
                c8: "Rédiger une conclusion pédagogique riche synthétisant les acquis (savoirs, savoir-faire, savoir-être), les perspectives d'apprentissage futur, et l'importance de la compétence dans le parcours professionnel.",
                c9: "Inclure les sections détaillées « Activités du formateur » et « Activités des stagiaires » dans chaque phase du scénario (avec actions précises, durée, modalités).",
                no_option: "Aucune option sélectionnée.",
                no_api_key: "⚠️ Aucune clé API configurée pour ce fournisseur.",
                copied: "✅ Copié !",
                export_title: "APC Algérie G3 – Conversation IA",
                web_search_active: "🌐 Recherche web activée - résultats intégrés",
                settingsLabel: "Paramètres",
                changePwdLabel: "Changer mot de passe",
                settingsTitle: "Paramètres IA",
                settingsDesc: "Configurez vos clés API et choisissez le modèle par défaut.",
                openrouterKeyLabel: "🔑 Clé API OpenRouter",
                openrouterKeyHint: "Pour utiliser DeepSeek, Llama 3.3 via OpenRouter.",
                geminiKeyLabel: "✦ Clé API Google Gemini",
                geminiKeyHint: "Pour utiliser Gemini 3.6 Flash / 3.1 Pro (gratuit).",
                emailjsLabel: "📧 EmailJS — Envoi d'invitations",
                emailjsHint: "Créez un compte gratuit sur emailjs.com → connectez votre email → copiez vos clés ici.",
                groqKeyLabel: "⚡ Clé API Groq",
                groqKeyHint: "Pour utiliser les modèles Groq (GPT OSS, Mixtral, DeepSeek).",
                verifyBtn: "Vérifier",
                modelSelection: "Modèle à utiliser",
                modelAuto: "☑ Auto (Gemini → Groq → OpenRouter)",
                modelGeminiFlash: "☐ Gemini 3.6 Flash",
                modelGeminiPro: "☐ Gemini 3.1 Pro (Preview)",
                modelV3: "☐ DeepSeek V3 (OpenRouter)",
                modelR1: "☐ DeepSeek R1 (OpenRouter)",
                modelLlama: "☐ Llama 3.3 70B (OpenRouter)",
                modelGroqLlama: "☐ GPT OSS 120B (Groq)",
                modelGroqScout: "☐ GPT OSS 120B (Groq)",
                modelLlama32Free: "☐ Llama 3.2 3B (OpenRouter free)",
                modelHermes405bFree: "☐ Hermes 3 405B (OpenRouter free)",
                modelDeepseekV3Free: "☐ Nemotron 3 Super 120B (OpenRouter free)",
                modelOwlAlpha: "☐ Nemotron Nano 9B (OpenRouter free)",
                modelLlama4ScoutFree: "☐ GPT OSS 20B (OpenRouter free)",
                saveBtn: "Enregistrer",
                clearBtn: "Effacer tout",
                cancelBtn: "Annuler",
                closeBtn: "Fermer",
                apiSaved: "✅ Clés API enregistrées !",
                apiCleared: "🗑 Clés effacées.",
                apiInvalid: "⚠️ Clé invalide.",
                keyValid: "✅ Clé valide !",
                keyInvalid: "❌ Clé invalide ou erreur réseau.",
                checkingKey: "🔍 Vérification en cours...",
                compatLabel: "Mode icônes",
                compatHint: "Détecte automatiquement si vos icônes s'affichent correctement et bascule vers une version compatible si nécessaire.",
                compatAuto: "Auto (recommandé)",
                compatModern: "Moderne",
                compatCompat: "Compatible",
                landing_title: "Assistant APC Algérie G3",
                landing_desc: "Plateforme intelligente de conception pédagogique basée sur l'Approche Par Compétences (APC). Générez des prompts, dialoguez avec l'IA, créez des présentations interactives.",
                card_generator_title: "Générateur de Prompts",
                card_assistant_title: "Assistant IA",
                card_fromdoc_title: "Document → Présentation",
                card_about_title: "À propos",
                card_generator_desc: "Créez des prompts professionnels APC",
                card_assistant_desc: "Dialoguez avec l'IA pédagogique",
                card_fromdoc_desc: "Générez des slides depuis un document",
                card_about_desc: "Découvrez la plateforme",
                card_vision_title: "Notre Vision",
                card_vision_desc: "Les objectifs du ministère",
                quizTitle: "📝 Créer un Quiz depuis une présentation",
                quizNoPresentation: "Aucune présentation sauvegardée. Générez d'abord une présentation.",
                quizHint: "💡 Vous pouvez aussi générer un quiz depuis la fenêtre de présentation interactive → bouton 🎯 Générer Quiz",
                quizPublishedTitle: "📋 Quiz publiés",
                quizPassTitle: "🎯 Passer un Quiz",
                quizPassDesc: "Entrez le code du quiz pour commencer.",
                quizCodePH: "Code du quiz",
                quizStartBtn: "🚀 Démarrer",
                learnerHeaderTitle: "APC Algérie GÉNÉRATION 3",
                untitledPres: "Présentation sans titre",
                slidesCount: "slides",
                distribBtn: "📤 Distribuer",
                statsBtn: "📊 Stats",
                statsTitle: "📊 Statistiques du quiz",
                statsNoData: "Aucune tentative enregistrée pour ce quiz.",
                statsAvg: "Moyenne",
                statsBest: "Meilleur",
                statsWorst: "Plus faible",
                statsAttempts: "Tentatives",
                statsAttemptsLabel: "tentative(s) enregistrée(s)",
                statsClose: "Fermer",
                statsExportPDF: "📄 Export PDF",
                statsExportNoData: "Aucune donnée à exporter.",
                statsBadgesTitle: "🏅 Badges gagnés :",
                statsExpert: "Expert",
                statsMaitrise: "Maîtrisé",
                statsEnCours: "En cours",
                statsNonMaitrise: "Non maîtrisé",
                pdfName: "Nom",
                pdfSpecialite: "Spécialité",
                pdfGroupe: "Groupe",
                pdfScore: "Score",
                pdfLevel: "Niveau",
                pdfGeneratedBy: "Généré par APC Algérie G3 - Quiz",
                deleteQuizConfirm: "Supprimer ce quiz ?",
                quizDeleted: "🗑 Quiz supprimé.",
                noQuizFound: "⚠️ Aucune présentation trouvée.",
                invalidPres: "⚠️ Présentation invalide.",
                quizGeneratorTitle: "🎯 Générateur de Quiz",
                quizTitleLabel: "📌 Titre :",
                quizGenerateBtn: "🤖 Générer les questions avec l'IA",
                quizGenerateDesc: "L'IA analysera chaque diapositive et proposera des questions QCM",
                quizEditDesc: "Modifiez les questions, sélectionnez 1 par diapositive, définissez les bonnes réponses.",
                quizQuestionsLabel: "📝 Questions :",
                quizMin10: "min 10",
                quizTimePerQuestion: "⏱ Temps/question :",
                quizSecondsHint: "secondes (0 = pas de limite)",
                quizPublishBtn: "🔗 Générer le lien / QR",
                quizCloseBtn: "Fermer",
                quizNoData: "Aucune donnée de quiz.",
                badgeManual: "Manuelle",
                badgeAI: "IA",
                quizAskMoreBtn: "🤖 + Demander plus de questions à l'IA",
                quizPublishedBadge: "🔗 Quiz publié !",
                quizDataLink: "📦 Lien données embarquées",
                quizSelectedLabel: "sélectionnée",
                quizGenerateFirst: "⚠️ Générez d'abord une présentation.",
                quizClickBelow: "Cliquez ci-dessous pour générer des questions.",
                quizQuestionsCount: "questions",
                quizDesc: "Générez des quiz pédagogiques et partagez-les avec vos apprenants via QR code.",
                quizCodeLabel: "Code :",
                drawerMenu: "☰ Menu",
                drawerLang: "Langue :",
                errGeneric: "❌ Erreur: ",
                emptyCode: "⚠️ Entrez le code du quiz.",
                quizNotFound: "❌ Quiz introuvable.",
                quizPinLabel: "🔑 Code de sécurité",
                quizAttemptsLabel: "🔁 Tentatives max :",
                quizAttemptsHint: "0 = illimité",
                quizFromAssistantTitle: "🎯 Créer un Quiz depuis l'Assistant IA",
                quizAssistantBtn: "🤖 Générer un Quiz avec l'IA",
                quizAssistantNoResponse: "Aucune réponse de l'Assistant IA trouvée. Dialoguez d'abord avec l'Assistant.",
                quizFromAssistantDesc: "Générez un quiz directement depuis la dernière réponse de l'Assistant IA",
                voiceListening: "🎤 Écoute...",
                voiceNotSupported: "⚠️ Reconnaissance vocale non supportée par ce navigateur.",
                voiceError: "⚠️ Erreur reconnaissance : ",
                challengeDesc: "Créez des challenges pédagogiques, compétitions entre équipes, et suivez les classements en direct.",
                challengeFromAssistantTitle: "🎮 Créer un Challenge depuis l'Assistant IA",
                challengeAssistantBtn: "🎮 Générer un Challenge avec l'IA",
                challengeAssistantNoResponse: "Aucune réponse de l'Assistant IA trouvée. Dialoguez d'abord avec l'Assistant.",
                challengeFromAssistantDesc: "Choisissez une conversation Assistant IA ci-dessous ou utilisez la dernière réponse. L'IA crée les équipes, les épreuves et les questions automatiquement.",
                challengeManualTitle: "✏️ Créer un Challenge manuellement",
                challengePublishedTitle: "📋 Challenges publiés",
                challengeConfigTitle: "⚙️ Configurer le challenge",
                challengeTitleLabel: "Titre du challenge",
                challengeThemeLabel: "Thème",
                challengeThemePlaceholder: "Ex: Réseaux, Sécurité, Programmation",
                challengeThemeHint: "💡 Laissez vide pour que l'IA détermine le thème automatiquement.",
                challengeTypeLabel: "Type",
                challengeTypeGroup: "Par groupes",
                challengeTypeIndividual: "Individuel",
                challengeTypeTournament: "Tournoi",
                challengeType_group: "👥 Groupes",
                challengeType_team: "👤 Individuel",
                challengeType_tournament: "🏆 Tournoi",
                challengeTeamsLabel: "Équipes",
                challengeTeamsCountLabel: "Nombre d'équipes",
                challengeTeamsAuto: "Aléatoire par l'IA",
                challengeTeamsManual: "Manuel",
                challengeRoundsLabel: "Nombre d'épreuves",
                challengeDurationLabel: "Temps limité",
                challengeNoLimit: "Pas de limite",
                challengeMinutes: "min",
                challengeGenerateBtn: "🎮 Générer le challenge",
                challengeNew: "Nouveau challenge",
                challengeRound: "Round",
                challengeRounds: "Rounds",
                challengeQuestions: "questions",
                challengeQuestion: "question",
                challengeEditBtn: "Modifier",
                challengeRegenBtn: "Régénérer IA",
                challengeAddRound: "Ajouter un round",
                challengeAddQuestion: "Ajouter une question",
                challengePublishBtn: "📤 Publier le challenge",
                challengeGenerating: "Génération du challenge...",
                challengeGeneratingDesc: "L'IA crée les questions et critères. Veuillez patienter...",
                challengeNoData: "Aucun challenge en cours. Créez-en un depuis l'Assistant ou manuellement.",
                challengeSelectCompetence: "🎯 Choisissez une compétence",
                challengeNoRounds: "Ajoutez au moins une épreuve avant de publier.",
                challengeDeleteConfirm: "Supprimer ce challenge définitivement ?",
                challengeDeleted: "🗑 Challenge et toutes ses données supprimés.",
                challengeCodeLabel: "Code :",
                challengeRankingBtn: "🏆 Classement",
                challengeRankingTitle: "Classement en direct",
                challengePoints: "pts",
                challengeMembers: "membres",
                challengeNoParticipants: "Aucun participant pour le moment.",
                challengeTeam: "Équipe",
                challengeTeamA: "Équipe Alpha",
                challengeTeamB: "Équipe Beta",
                challengeTeamC: "Équipe Gamma",
                challengeTeamD: "Équipe Delta",
                challengeTeamE: "Équipe Epsilon",
                challengeCorrect: "Bonne réponse !",
                challengeCorrectLabel: "Réponse correcte :",
                challengeIncorrect: "Mauvaise réponse",
                challengeCorrectAnswer: "Réponse correcte",
                challengeSubmitBtn: "Soumettre",
                challengeSelectAnswer: "Sélectionnez d'abord une réponse.",
                challengeRoundComplete: "Round terminé !",
                challengeThanks: "Merci d'avoir participé ! Continuez à progresser.",
                challengeBackBtn: "🔙 Retour au challenge",
                challengeWelcome: "Bienvenue",
                challengeLearner: "Participant",
                challengeCodeInvalid: "Code de challenge invalide ou expiré.",
                challengeNoQuestions: "Aucune question dans ce round.",
                challengeNewRound: "Nouveau round",
                challengeNewQuestion: "Nouvelle question",
                challengeOptionA: "Option A",
                challengeOptionB: "Option B",
                challengeOptionC: "Option C",
                challengeOptionD: "Option D",
                challengeEditTeamPrompt: "Nouveau nom de l'équipe :",
                challengeEditQuestionPrompt: "Nouveau texte de la question :",
                challengeEditOptionsPrompt: "Nouvelles options (séparées par |) :",
                challengeEditCorrectPrompt: "Index de la réponse correcte",
                challengeDistribTitle: "Distribution du challenge",
                challengeDistribImportLabel: "📥 Coller une liste (CSV)",
                challengeDistribPlaceholder: "nom_fr,nom_ar,email,spécialité,groupe&#10;Ahmed Ben Ali,أحمد,ahmed@gmail.com,Informatique,Groupe A&#10;Sarah,سارة,,Réseaux,",
                challengeDistribGenerateBtn: "⚡ Générer les accès",
                challengeDistribTemplateBtn: "📥 Télécharger modèle",
                challengeDistribNameFr: "Nom (FR)",
                challengeDistribNameAr: "Nom (AR)",
                challengeDistribEmail: "Email",
                challengeDistribAddBtn: "➕ Ajouter",
                challengeDistribTeamLabel: "Équipe",
                challengeDistribAutoTeam: "Auto (aléatoire)",
                challengeDistribAutoTeamBtn: "🤖 Répartir automatiquement",
                challengeDistribStatus: "Statut",
                challengeDistribEmpty: "Aucun participant. Ajoutez-en ci-dessus.",
                challengeDistribDeleteConfirm: "Supprimer ce participant ?",
                challengeDistribTeamPrompt: "Assigner à l'équipe",
                challengeDistribSpecialty: "Spécialité",
                challengeDistribGroup: "Groupe",
                challengeDistribAllSpecialties: "Toutes spécialités",
                challengeDistribAllGroups: "Tous groupes",
                challengeDistribSendAll: "📧 Envoyer tout",
                challengeDistribImportBtn: "📄 Importer CSV/XLSX",
                challengeDistribEmailMsg: "Vous êtes invité à participer à un challenge pédagogique.",
                challengeDistribYourCode: "Votre code d'accès",
                challengeDistribYourLink: "Votre lien",
                challengeObjectiveLabel: "Type d'objectif",
                challengeCriteriaTitle: "Critères de performance",
                challengeCriteriaWeight: "Poids en % (ex: 20)",
                challengeCriteriaPrompt: "Nom du critère de performance (FR):",
                challengeCriteriaEditPrompt: "Modifier le critère (FR):",
                challengeCriteriaWeightEdit: "Poids en %:",
                challengeCriteriaDeleteConfirm: "Supprimer ce critère ?",
                challengeIndicatorPrompt: "Indicateur de réussite (FR) — laisser vide pour terminer:",
                challengeNoCriteria: "Aucun critère défini. Ajoutez-en ci-dessous.",
                challengeAddCriterion: "➕ Ajouter un critère",
                challengePublicPin: "🔑 Code d'accès public",
                challengePublicPinDesc: "Partagez ce code ou QR avec les apprenants. Aucun email requis.",
                challengeEnterName: "Votre nom",
                challengeJoinBtn: "🎮 Rejoindre le challenge",
                challengeAutoAssign: "Équipe attribuée automatiquement",
                challengeResultsTitle: "📊 Rapporter les résultats",
                challengeResultsHint: "Saisissez une note sur 100 pour chaque équipe/critère, ou laissez l'IA calculer automatiquement.",
                challengeResultsBtn: "📊 Résultats",
                btnPlay: "🎮 Jouer",
                challengeResultsAuto: "🤖 Saisie automatique (IA)",
                challengeResultsCalc: "📊 Calculer le classement",
                challengeResultsRanking: "Classement final",
                challengeResultsRewards: "Récompenses",
                challengeTotalScore: "Total",
                challengeSpecialtyLabel: "Spécialité",
                challengeSpecialtyPlaceholder: "Ex: Informatique, Soudure, Cuisine...",
                challengeObjQuiz: "Répondre à un quiz",
                challengeObjPractical: "Réaliser une activité pratique",
                challengeObjProblem: "Résoudre un problème",
                challengeObjInstall: "Installer un système",
                challengeObjNetwork: "Configurer un réseau",
                challengeObjRepair: "Réparer une panne",
                challengeObjDiagnose: "Diagnostiquer une erreur",
                challengeObjDocument: "Concevoir un document",
                challengeObjProject: "Réaliser un projet",
                challengeObjPresent: "Présenter une solution",
                gamificationTitle: "🏆 Système de Gamification",
                gamificationXp: "Points d'Expérience (XP)",
                gamificationLevel: "Niveau",
                gamificationBadges: "🎖 Badges débloqués",
                gamificationStreak: "🔥 Séries",
                gamificationStreakCurrent: "Série actuelle",
                gamificationStreakBest: "Meilleure série",
                gamificationStats: "📊 Statistiques",
                gamificationChallengesDone: "Défis réalisés",
                gamificationChallengesWon: "Défis gagnés",
                gamificationChallengesLost: "Défis perdus",
                gamificationSuccessRate: "Taux de réussite",
                gamificationNextLevel: "Prochain niveau",
                gamificationXpToNext: "XP requis",
                gamificationLeaderboard: "🏆 Classements",
                gamificationLeaderboardIndividual: "Individuel",
                gamificationLeaderboardTeams: "Équipes",
                gamificationLeaderboardWeekly: "Hebdomadaire",
                gamificationLeaderboardMonthly: "Mensuel",
                gamificationRewards: "🎁 Récompenses",
                gamificationCertificates: "📜 Certificats",
                gamificationNoBadges: "Aucun badge débloqué pour le moment.",
                gamificationBadgeWindows: "Expert Windows",
                gamificationBadgeLinux: "Expert Linux",
                gamificationBadgeNetwork: "Expert Réseau",
                gamificationBadgeSecurity: "Expert Cybersécurité",
                gamificationBadgeAPC: "Expert APC",
                gamificationBadgeTroubleshoot: "Roi du dépannage",
                gamificationBadgeDiagnostic: "Maître du diagnostic",
                gamificationBadgeSpeed: "Champion du temps",
                gamificationBadgeTeamwork: "Travail d'équipe",
                gamificationBadgeProblemSolving: "Résolution de problèmes",
                gamificationBadgeNoErrors: "Sans erreur",
                gamificationBadgeActive: "Participation active",
                gamificationBadgeInnovation: "Innovation",
                gamificationBadgePerseverance: "Persévérance",
                gamificationLevelBeginner: "Débutant",
                gamificationLevelApprentice: "Apprenti",
                gamificationLevelIntermediate: "Intermédiaire",
                gamificationLevelAdvanced: "Confirmé",
                gamificationLevelExpert: "Avancé",
                gamificationLevelMaster: "Expert",
                gamificationLevelLegend: "Maître",
                gamificationLevelSupreme: "Légende",
                gamificationChallengeTypes: "🎮 Types de Challenges",
                gamificationChallengeTypeIndividual: "Individuel",
                gamificationChallengeTypeTeam: "Par équipes",
                gamificationChallengeTypeGroup: "Entre groupes",
                gamificationChallengeTypeTournament: "Tournoi",
                gamificationChallengeTypeTimed: "Chronométré",
                gamificationChallengeTypeCompetence: "Par compétence",
                gamificationChallengeTypeCaseStudy: "Étude de cas",
                gamificationChallengeTypeEscape: "Escape Game",
                gamificationChallengeTypeWorkshop: "Atelier pratique",
                gamificationXpBreakdown: "Détail des XP",
                gamificationXpCorrect: "Bonne réponse",
                gamificationXpSpeed: "Rapidité",
                gamificationXpTeamwork: "Travail en équipe",
                gamificationXpStreak: "Série de victoires",
                gamificationXpBonus: "Bonus sans erreur",
                gamificationXpParticipation: "Participation",
                gamificationDailyMissions: "📅 Missions quotidiennes",
                gamificationDailyComplete1: "Répondre à 1 challenge",
                gamificationDailyComplete3: "Répondre à 3 challenges",
                gamificationDailyPerfect: "Sans erreur",
                gamificationDailyStreak: "Série de connexion",
                gamificationWeeklyMissions: "📅 Missions hebdomadaires",
                gamificationWeeklyWin: "Gagner 3 challenges",
                gamificationWeeklyPoints: "Obtenir 500 XP",
                gamificationWeeklyTeamwork: "Participer en équipe",
                gamificationHallOfFame: "🏛 Hall of Fame",
                gamificationHallOfFameEmpty: "Aucun champion encore. Lancez-vous !",
                challengeHint: "💡 Générez un challenge directement depuis la dernière réponse de l'Assistant IA. L'IA crée les équipes, les épreuves et les questions automatiquement.",
            },
            ar: {
                headerTitle: "APC الجزائر <span>الجيل 3</span>",
                ministere: "وزارة التكوين والتعليم المهنيين",
                headerSub: "المكوِّن 2.0 – المساعد الذكي لتصميم السيناريوهات البيداغوجية",
                headerDesc: "أنشئ بروم‌بتات احترافية لـ ChatGPT وClaude وGemini لتصميم سيناريوهاتك وفق المقاربة بالكفاءات.",
                headerSig: "",
                tab_home: "🏠 الرئيسية",
                tab_generator: "📝 مولّد البرومبتات",
                tab_assistant: "🤖 المساعد الذكي",
                tab_about: "ℹ️ حول المنصة",
                tab_guide: "📖 الدليل الكامل",
                tab_fromdoc: "📄 مستند → عرض تقديمي",
                tab_help: "❓ المساعدة مفاتيح API",
                tab_admin: "⚙️ الإدارة",
                tab_quiz: "🎯 الاختبار",
                tab_game: "🚀 لعبة الدفاع",
                tab_game2: "🌱 لعبة النبات",
                tab_games: "🎮 الألعاب",
                tab_challenge: "🎮 التحديات",
                sec1Title: "هوية ومهمة الذكاء الاصطناعي",
                roleLabel: "الدور",
                roleHint: "📌 مثال: أنت خبير تكوين في APC الجزائر.",
                missionLabel: "ماذا يجب أن يفعل؟",
                missionHint: "📌 مثال: بناء سيناريو بيداغوجي كامل وفق APC الجزائر.",
                sec2Title: "معلومات التكوين",
                specialiteLabel: "التخصص",
                moduleLabel: "الوحدة",
                competenceLabel: "الكفاءة المستهدفة",
                niveauLabel: "المستوى",
                anneeLabel: "السنة",
                dureeLabel: "المدة",
                nbStagLabel: "المتربصون",
                espaceLabel: "الفضاء البيداغوجي",
                ressourcesLabel: "الموارد المتاحة",
                contexteLabel: "السياق المهني",
                difficultesLabel: "الصعوبات المتوقعة",
                sec3Title: "نماذج مساعدي APC",
                examplesNotice: "⚠️ اضغط على بطاقة لملء جميع الحقول (الدور، المهمة، التكوين، AST)",
                sec4Title: "خيارات بيداغوجية APC",
                astToggleLabel: "🔷 استخدام AST (تحليل وضعية العمل)",
                astMetierLabel: "المهنة (AST)",
                astExtraitLabel: "مقتطف AST",
                liveBadge: "مباشر",
                btnCopy: "نسخ",
                btnSendAI: "→ إرسال للذكاء",
                btnReset: "إعادة تعيين",
                saveCourseBtn: "💾 حفظ الدرس",
                savePresentationBtn: "💾 حفظ العرض",
                btnGamma: "🎨 توليد عرض تقديمي",
                docGenerate: "🎨 توليد العرض التقديمي",
                newChat: "＋ محادثة جديدة",
                quickAPC: "⚡ اختصارات APC",
                historyLabel: "📂 السجل",
                providerLabel: "مزود الذكاء :",
                aiInputPlaceholder: "اكتب رسالتك أو اطلب محتوى APC...",
                emptyChatMsg: "اطرح سؤالاً أو استخدم اختصار APC للبدء.",
                footerText: "APC Algérie GÉNÉRATION 3 — المكوِّن 2.0",
                themeLight: "☀️ وضع فاتح",
                themeDark: "🌙 الوضع الداكن",
                opt_analyse: "📋 تحليل APC",
                opt_scenario: "📐 سيناريو APC (5 مراحل)",
                opt_integration: "🔗 وضعية الإدماج",
                opt_evaluation: "✅ التقييم",
                opt_grille: "📊 شبكة معيارية 4×4",
                opt_criteres: "🎯 معايير الأداء",
                opt_indicateurs: "📌 المؤشرات",
                opt_conclusion: "📝 خاتمة",
                opt_activities: "👥 أنشطة المكوّن والمتدرّب",
                quick_scenario: "📐 إنشاء سيناريو APC كامل",
                quick_eval: "✅ توليد تقييم APC",
                quick_fiche: "📄 إنشاء بطاقة بيداغوجية",
                quick_integration: "🔗 وضعية الإدماج",
                quick_grille: "📊 شبكة معيارية APC 4×4",
                quick_cours: "📚 درس كامل APC",
                prompt_role: "الدور",
                prompt_mission: "المهمة",
                prompt_context: "سياق التكوين",
                prompt_specialite: "التخصص",
                prompt_module: "الوحدة",
                prompt_competence: "الكفاءة المستهدفة",
                checkCompetence: "🔍 التحقق من الكفاءة",
                prompt_niveau: "المستوى",
                prompt_annee: "السنة",
                prompt_duree: "المدة",
                prompt_stagiaires: "المتربصون",
                prompt_espace: "الفضاء البيداغوجي",
                prompt_ressources: "الموارد",
                prompt_contexte: "السياق المهني",
                prompt_difficultes: "الصعوبات المتوقعة",
                prompt_ast: "AST (تحليل وضعية العمل)",
                prompt_consignes: "تعليمات الذكاء",
                prompt_langue: "لغة المخرجات",
                c1: "إجراء تحليل APC كامل ومفصّل: سرد المعارف (النظرية والمهنية)، المهارات (تحضير، تثبيت، تهيئة، مراقبة بإجراءات دقيقة)، السلوكيات (الدقة، التنظيم، الروح التحليلية، السلامة، العمل الجماعي)، الموارد الداخلية (المعرفية، الإجرائية، السلوكية) والخارجية (المادية، الوثائقية، البشرية).",
                c2: "بناء سيناريو بيداغوجي APC كامل وفق المراحل الخمس (السياق، زعزعة التوازن، البناء، الإدماج، النقل). لكل مرحلة: عنوان، مدة زمنية، هدف، وضعية مقترحة، أنشطة المكوّن، أنشطة المتدرّب، والإنتاج المتوقع.",
                c3: "إنشاء وضعية إدماج أصيلة مفصّلة مرتبطة بالسياق المهني، مع سيناريو واقعي ومهمة محددة وقيود (وقت، جودة، موارد) وإنتاج متوقع ملموس.",
                c4: "إنتاج تقييم مبني على الكفاءات: نوع التقييم، المهمة المطلوبة مفصّلة، تعليمات واضحة للمتدرّب.",
                c5: "توليد شبكة تقييم معيارية APC 4×4 مع 4 معايير محددة و4 مستويات إتقان (غير مكتسب، قيد الاكتساب، مكتسب، خبير). عرض جدول ماركداون مع ☐ لكل خانة. إضافة جدول وصفي لكل مستوى.",
                c6: "توليد معايير أداء قابلة للملاحظة مفصّلة لكل معيار من الشبكة، على شكل قوائم نقطية بإجراءات ملموسة وقابلة للتحقق.",
                c7: "توليد مؤشرات النجاح على شكل قائمة مع ✅، تصف بدقة ما يثبت اكتساب الكفاءة.",
                c8: "كتابة خاتمة بيداغوجية غنية تلخّص المكتسبات (معارف، مهارات، سلوكيات)، آفاق التعلم المستقبلية، وأهمية الكفاءة في المسار المهني.",
                c9: "تضمين الأقسام المفصّلة «أنشطة المكوّن» و«أنشطة المتدرّب» في كل مرحلة من السيناريو (بإجراءات دقيقة، مدّة زمنية، طرائق).",
                no_option: "لم يتم اختيار أي خيار.",
                no_api_key: "⚠️ لا توجد مفتاح API لهذا المزود.",
                copied: "✅ تم النسخ!",
                export_title: "APC الجزائر G3 – محادثة الذكاء",
                web_search_active: "🌐 بحث الويب مفعّل - النتائج مضمنة",
                settingsLabel: "الإعدادات",
                changePwdLabel: "تغيير كلمة المرور",
                settingsTitle: "إعدادات الذكاء",
                settingsDesc: "قم بتكوين مفاتيح API واختر النموذج الافتراضي.",
                openrouterKeyLabel: "🔑 مفتاح API OpenRouter",
                openrouterKeyHint: "لاستخدام DeepSeek، Llama 3.3 عبر OpenRouter.",
                geminiKeyLabel: "✦ مفتاح API Google Gemini",
                geminiKeyHint: "لاستخدام Gemini 3.6 Flash / 3.1 Pro (مجاني).",
                emailjsLabel: "📧 EmailJS — إرسال الدعوات",
                emailjsHint: "أنشئ حسابًا مجانيًا على emailjs.com → وصّل بريدك الإلكتروني → انسخ مفاتيحك هنا.",
                groqKeyLabel: "⚡ مفتاح API Groq",
                groqKeyHint: "لاستخدام نماذج Groq (GPT OSS، Mixtral، DeepSeek).",
                verifyBtn: "تحقق",
                modelSelection: "النموذج المستخدم",
                modelAuto: "☑ تلقائي (Gemini → Groq → OpenRouter)",
                modelGeminiFlash: "☐ Gemini 3.6 Flash",
                modelGeminiPro: "☐ Gemini 3.1 Pro (Preview)",
                modelV3: "☐ DeepSeek V3 (OpenRouter)",
                modelR1: "☐ DeepSeek R1 (OpenRouter)",
                modelLlama: "☐ Llama 3.3 70B (OpenRouter)",
                modelGroqLlama: "☐ GPT OSS 120B (Groq)",
                modelGroqScout: "☐ GPT OSS 120B (Groq)",
                modelLlama32Free: "☐ Llama 3.2 3B (OpenRouter مجاني)",
                modelHermes405bFree: "☐ Hermes 3 405B (OpenRouter مجاني)",
                modelDeepseekV3Free: "☐ Nemotron 3 Super 120B (OpenRouter مجاني)",
                modelOwlAlpha: "☐ Nemotron Nano 9B (OpenRouter مجاني)",
                modelLlama4ScoutFree: "☐ GPT OSS 20B (OpenRouter مجاني)",
                saveBtn: "حفظ",
                clearBtn: "حذف الكل",
                cancelBtn: "إلغاء",
                closeBtn: "إغلاق",
                apiSaved: "✅ تم حفظ المفاتيح!",
                apiCleared: "🗑 تم حذف المفاتيح.",
                apiInvalid: "⚠️ مفتاح غير صالح.",
                keyValid: "✅ المفتاح صحيح!",
                keyInvalid: "❌ مفتاح غير صالح أو خطأ في الشبكة.",
                checkingKey: "🔍 جارٍ التحقق...",
                compatLabel: "وضع الأيقونات",
                compatHint: "يكتشف تلقائياً ما إذا كانت أيقوناتك تظهر بشكل صحيح ويحول إلى نسخة متوافقة إذا لزم الأمر.",
                compatAuto: "تلقائي (موصى به)",
                compatModern: "حديث",
                compatCompat: "متوافق",
                landing_title: "مساعد APC الجزائر G3",
                landing_desc: "منصة ذكية لتصميم السيناريوهات البيداغوجية وفق المقاربة بالكفاءات (APC). أنشئ برومبتات، تحاور مع الذكاء الاصطناعي، وأنشئ عروضاً تفاعلية.",
                card_generator_title: "مولّد البرومبتات",
                card_assistant_title: "المساعد الذكي",
                card_fromdoc_title: "مستند → عرض تقديمي",
                card_about_title: "حول المنصة",
                card_generator_desc: "أنشئ برومبتات APC احترافية",
                card_assistant_desc: "تحاور مع الذكاء الاصطناعي التربوي",
                card_fromdoc_desc: "أنشئ شرائح من مستند",
                card_about_desc: "اكتشف المنصة",
                card_vision_title: "رؤيتنا",
                card_vision_desc: "أهداف الوزارة",
                quizTitle: "📝 إنشاء اختبار من عرض تقديمي",
                quizNoPresentation: "لا يوجد عرض تقديمي محفوظ. قم بإنشاء عرض أولاً.",
                quizHint: "💡 يمكنك أيضًا إنشاء اختبار من نافذة العرض التفاعلي ← زر 🎯 إنشاء اختبار",
                quizPublishedTitle: "📋 الاختبارات المنشورة",
                quizPassTitle: "🎯 إجراء اختبار",
                quizPassDesc: "أدخل رمز الاختبار للبدء.",
                quizCodePH: "رمز الاختبار",
                quizStartBtn: "🚀 ابدأ",
                learnerHeaderTitle: "APC الجزائر الجيل 3",
                untitledPres: "عرض تقديمي بدون عنوان",
                slidesCount: "شريحة",
                distribBtn: "📤 توزيع",
                statsBtn: "📊 إحصائيات",
                statsTitle: "📊 إحصائيات الاختبار",
                statsNoData: "لا توجد أي محاولة مسجلة لهذا الاختبار.",
                statsAvg: "المتوسط",
                statsBest: "الأفضل",
                statsWorst: "الأدنى",
                statsAttempts: "المحاولات",
                statsAttemptsLabel: "محاولة مسجلة",
                statsClose: "إغلاق",
                statsExportPDF: "📄 تصدير PDF",
                statsExportNoData: "لا توجد بيانات للتصدير.",                statsBadgesTitle: "🏅 الشارات المكتسبة :",
                statsExpert: "خبير",
                statsMaitrise: "متقن",
                statsEnCours: "قيد التقدم",
                statsNonMaitrise: "غير متقن",
                pdfName: "الاسم",
                pdfSpecialite: "التخصص",
                pdfGroupe: "المجموعة",
                pdfScore: "النتيجة",
                pdfLevel: "المستوى",
                pdfGeneratedBy: "منشأ بواسطة APC الجزائر G3 - اختبار",
                deleteQuizConfirm: "حذف هذا الاختبار؟",
                quizDeleted: "🗑 تم حذف الاختبار.",
                noQuizFound: "⚠️ لم يتم العثور على عرض تقديمي.",
                invalidPres: "⚠️ عرض تقديمي غير صالح.",
                quizGeneratorTitle: "🎯 مولّد الاختبارات",
                quizTitleLabel: "📌 العنوان :",
                quizGenerateBtn: "🤖 توليد الأسئلة بالذكاء الاصطناعي",
                quizGenerateDesc: "سيحلل الذكاء الاصطناعي كل شريحة ويقترح أسئلة اختيار من متعدد",
                quizEditDesc: "عدّل الأسئلة، اختر 1 لكل شريحة، حدّد الإجابات الصحيحة.",
                quizQuestionsLabel: "📝 الأسئلة :",
                quizMin10: "10 كحد أدنى",
                quizTimePerQuestion: "⏱ الوقت/سؤال :",
                quizSecondsHint: "ثوانٍ (0 = بدون حد)",
                quizPublishBtn: "🔗 إنشاء الرابط / QR",
                quizCloseBtn: "إغلاق",
                quizNoData: "لا توجد بيانات اختبار.",
                badgeManual: "يدوي",
                badgeAI: "ذكاء اصطناعي",
                quizAskMoreBtn: "🤖 + طلب المزيد من الأسئلة من الذكاء",
                quizPublishedBadge: "🔗 تم نشر الاختبار!",
                quizDataLink: "📦 رابط البيانات المضمنة",
                quizSelectedLabel: "محدد",
                quizGenerateFirst: "⚠️ قم بإنشاء عرض تقديمي أولاً.",
                quizClickBelow: "انقر أدناه لتوليد الأسئلة.",
                quizQuestionsCount: "أسئلة",
                quizDesc: "أنشئ اختبارات بيداغوجية وشاركها مع متعلميك عبر رمز QR.",
                quizCodeLabel: "الرمز :",
                drawerMenu: "☰ القائمة",
                drawerLang: "اللغة :",
                errGeneric: "❌ خطأ: ",
                emptyCode: "⚠️ أدخل رمز الاختبار.",
                quizNotFound: "❌ الاختبار غير موجود.",
                quizPinLabel: "🔑 رمز الأمان",
                quizAttemptsLabel: "🔁 الحد الأقصى للمحاولات :",
                quizAttemptsHint: "0 = غير محدود",
                quizFromAssistantTitle: "🎯 إنشاء اختبار من المساعد الذكي",
                quizAssistantBtn: "🤖 إنشاء اختبار بالذكاء الاصطناعي",
                quizAssistantNoResponse: "لم يتم العثور على رد من المساعد الذكي. تحدث أولاً مع المساعد.",
                quizFromAssistantDesc: "قم بإنشاء اختبار مباشرة من آخر رد للمساعد الذكي",
                voiceListening: "🎤 الاستماع...",
                voiceNotSupported: "⚠️ التعرف الصوتي غير مدعوم من هذا المتصفح.",
                voiceError: "⚠️ خطأ في التعرف الصوتي : ",
                challengeDesc: "أنشئ تحديات بيداغوجية، منافسات بين الفرق، وتابع الترتيب المباشر.",
                challengeFromAssistantTitle: "🎮 إنشاء تحدي من المساعد الذكي",
                challengeAssistantBtn: "🎮 إنشاء تحدي بالذكاء الاصطناعي",
                challengeAssistantNoResponse: "لم يتم العثور على رد من المساعد الذكي. تحدث أولاً مع المساعد.",
                challengeFromAssistantDesc: "اختر محادثة من المساعد الذكي أدناه أو استخدم آخر رد. يقوم الذكاء الاصطناعي بإنشاء الفرق والجولات والأسئلة تلقائياً.",
                challengeManualTitle: "✏️ إنشاء تحدي يدوياً",
                challengePublishedTitle: "📋 التحديات المنشورة",
                challengeConfigTitle: "⚙️ إعداد التحدي",
                challengeTitleLabel: "عنوان التحدي",
                challengeThemeLabel: "الموضوع",
                challengeThemePlaceholder: "مثال: شبكات، أمن، برمجة",
                challengeThemeHint: "💡 اتركه فارغاً ليحدد الذكاء الاصطناعي الموضوع تلقائياً.",
                challengeTypeLabel: "النوع",
                challengeTypeGroup: "مجموعات",
                challengeTypeIndividual: "فردي",
                challengeTypeTournament: "بطولة",
                challengeType_group: "👥 مجموعات",
                challengeType_team: "👤 فردي",
                challengeType_tournament: "🏆 بطولة",
                challengeTeamsLabel: "الفرق",
                challengeTeamsCountLabel: "عدد الفرق",
                challengeTeamsAuto: "عشوائي بواسطة الذكاء الاصطناعي",
                challengeTeamsManual: "يدوي",
                challengeRoundsLabel: "عدد الجولات",
                challengeDurationLabel: "الوقت المحدد",
                challengeNoLimit: "بدون حد",
                challengeMinutes: "دقيقة",
                challengeGenerateBtn: "🎮 إنشاء التحدي",
                challengeNew: "تحدي جديد",
                challengeRound: "جولة",
                challengeRounds: "جولات",
                challengeQuestions: "أسئلة",
                challengeQuestion: "سؤال",
                challengeEditBtn: "تعديل",
                challengeRegenBtn: "إعادة إنشاء بالذكاء الاصطناعي",
                challengeAddRound: "إضافة جولة",
                challengeAddQuestion: "إضافة سؤال",
                challengePublishBtn: "📤 نشر التحدي",
                challengeGenerating: "جاري إنشاء التحدي...",
                challengeGeneratingDesc: "الذكاء الاصطناعي يصمم الأسئلة والمعايير. الرجاء الانتظار...",
                challengeNoData: "لا يوجد تحدي قيد الإنشاء. أنشئ واحداً من المساعد الذكي أو يدوياً.",
                challengeSelectCompetence: "🎯 اختر كفاءة",
                challengeNoRounds: "أضف جولة واحدة على الأقل قبل النشر.",
                challengeDeleteConfirm: "حذف هذا التحدي نهائياً؟",
                challengeDeleted: "🗑 تم حذف التحدي وجميع بياناته.",
                challengeCodeLabel: "الرمز:",
                challengeRankingBtn: "🏆 الترتيب",
                challengeRankingTitle: "الترتيب المباشر",
                challengePoints: "نقطة",
                challengeMembers: "أعضاء",
                challengeNoParticipants: "لا يوجد مشاركون حالياً.",
                challengeTeam: "فريق",
                challengeTeamA: "فريق ألفا",
                challengeTeamB: "فريق بيتا",
                challengeTeamC: "فريق جاما",
                challengeTeamD: "فريق دلتا",
                challengeTeamE: "فريق إبسيلون",
                challengeCorrect: "إجابة صحيحة!",
                challengeCorrectLabel: "الإجابة الصحيحة:",
                challengeIncorrect: "إجابة خاطئة",
                challengeCorrectAnswer: "الإجابة الصحيحة",
                challengeSubmitBtn: "تسليم",
                challengeSelectAnswer: "اختر إجابة أولاً.",
                challengeRoundComplete: "انتهت الجولة!",
                challengeThanks: "شكراً لمشاركتك! واصل التقدم.",
                challengeBackBtn: "🔙 العودة إلى التحدي",
                challengeWelcome: "مرحباً",
                challengeLearner: "مشارك",
                challengeCodeInvalid: "رمز التحدي غير صالح أو منتهي الصلاحية.",
                challengeNoQuestions: "لا توجد أسئلة في هذه الجولة.",
                challengeNewRound: "جولة جديدة",
                challengeNewQuestion: "سؤال جديد",
                challengeOptionA: "خيار أ",
                challengeOptionB: "خيار ب",
                challengeOptionC: "خيار ج",
                challengeOptionD: "خيار د",
                challengeEditTeamPrompt: "الاسم الجديد للفريق:",
                challengeEditQuestionPrompt: "نص السؤال الجديد:",
                challengeEditOptionsPrompt: "الخيارات الجديدة (مفصولة بـ |):",
                challengeEditCorrectPrompt: "رقم الإجابة الصحيحة",
                challengeDistribTitle: "توزيع التحدي",
                challengeDistribImportLabel: "📥 لصق قائمة (CSV)",
                challengeDistribPlaceholder: "الاسم_فر,الاسم_عر,البريد,التخصص,المجموعة&#10;أحمد بن علي,أحمد,ahmed@gmail.com,إعلام آلي,مجموعة أ&#10;سارة,سارة,,شبكات,",
                challengeDistribGenerateBtn: "⚡ إنشاء الوصول",
                challengeDistribTemplateBtn: "📥 تحميل النموذج",
                challengeDistribNameFr: "الاسم (FR)",
                challengeDistribNameAr: "الاسم (AR)",
                challengeDistribEmail: "البريد",
                challengeDistribAddBtn: "➕ إضافة",
                challengeDistribTeamLabel: "الفريق",
                challengeDistribAutoTeam: "تلقائي (عشوائي)",
                challengeDistribAutoTeamBtn: "🤖 توزيع تلقائياً",
                challengeDistribStatus: "الحالة",
                challengeDistribEmpty: "لا يوجد مشاركون. أضفهم أعلاه.",
                challengeDistribDeleteConfirm: "حذف هذا المشارك؟",
                challengeDistribTeamPrompt: "تعيين إلى الفريق",
                challengeDistribSpecialty: "التخصص",
                challengeDistribGroup: "المجموعة",
                challengeDistribAllSpecialties: "جميع التخصصات",
                challengeDistribAllGroups: "جميع المجموعات",
                challengeDistribSendAll: "📧 إرسال الكل",
                challengeDistribImportBtn: "📄 استيراد CSV/XLSX",
                challengeDistribEmailMsg: "تمت دعوتك للمشاركة في تحدي بيداغوجي.",
                challengeDistribYourCode: "رمز الوصول الخاص بك",
                challengeDistribYourLink: "رابطك",
                challengeObjectiveLabel: "نوع الهدف",
                challengeCriteriaTitle: "معايير الأداء",
                challengeCriteriaWeight: "الوزن بـ % (مثال: 20)",
                challengeCriteriaPrompt: "اسم معيار الأداء (بالعربية):",
                challengeCriteriaEditPrompt: "تعديل المعيار:",
                challengeCriteriaWeightEdit: "الوزن بـ %:",
                challengeCriteriaDeleteConfirm: "حذف هذا المعيار؟",
                challengeIndicatorPrompt: "مؤشر النجاح — اترك فارغاً للإنهاء:",
                challengeNoCriteria: "لا توجد معايير. أضفها أدناه.",
                challengeAddCriterion: "➕ إضافة معيار",
                challengePublicPin: "🔑 رمز الوصول العام",
                challengePublicPinDesc: "شارك هذا الرمز أو رمز الاستجابة السريعة مع المتعلمين. لا حاجة للبريد الإلكتروني.",
                challengeEnterName: "اسمك",
                challengeJoinBtn: "🎮 الانضمام إلى التحدي",
                challengeAutoAssign: "تم تعيين الفريق تلقائياً",
                challengeResultsTitle: "📊 الإبلاغ عن النتائج",
                challengeResultsHint: "أدخل درجة من 100 لكل فريق/معيار، أو دع الذكاء الاصطناعي يحسب تلقائياً.",
                challengeResultsBtn: "📊 النتائج",
                btnPlay: "🎮 العب",
                challengeResultsAuto: "🤖 إدخال تلقائي (IA)",
                challengeResultsCalc: "📊 حساب الترتيب",
                challengeResultsRanking: "الترتيب النهائي",
                challengeResultsRewards: "المكافآت",
                challengeTotalScore: "المجموع",
                challengeSpecialtyLabel: "التخصص",
                challengeSpecialtyPlaceholder: "مثال: إعلام آلي، لحام، طبخ...",
                challengeObjQuiz: "الإجابة على اختبار",
                challengeObjPractical: "القيام بنشاط عملي",
                challengeObjProblem: "حل مشكلة",
                challengeObjInstall: "تثبيت نظام",
                challengeObjNetwork: "تكوين شبكة",
                challengeObjRepair: "إصلاح عطل",
                challengeObjDiagnose: "تشخيص خطأ",
                challengeObjDocument: "تصميم وثيقة",
                challengeObjProject: "إنجاز مشروع",
                challengeObjPresent: "تقديم حل",
                gamificationTitle: "🏆 نظام التحديات والمكافآت",
                gamificationXp: "نقاط الخبرة (XP)",
                gamificationLevel: "المستوى",
                gamificationBadges: "🎖 الشارات المفتوحة",
                gamificationStreak: "🔥 السلاسل",
                gamificationStreakCurrent: "السلسلة الحالية",
                gamificationStreakBest: "أفضل سلسلة",
                gamificationStats: "📊 الإحصائيات",
                gamificationChallengesDone: "التحديات المنجزة",
                gamificationChallengesWon: "التحديات التي ربحتها",
                gamificationChallengesLost: "التحديات التي خسرتها",
                gamificationSuccessRate: "نسبة النجاح",
                gamificationNextLevel: "المستوى التالي",
                gamificationXpToNext: "XP المطلوب",
                gamificationLeaderboard: "🏆 الترتيب",
                gamificationLeaderboardIndividual: "فردي",
                gamificationLeaderboardTeams: "فرق",
                gamificationLeaderboardWeekly: "أسبوعي",
                gamificationLeaderboardMonthly: "شهري",
                gamificationRewards: "🎁 المكافآت",
                gamificationCertificates: "📜 الشهادات",
                gamificationNoBadges: "لا توجد شارات مفتوحة بعد.",
                gamificationBadgeWindows: "خبير ويندوز",
                gamificationBadgeLinux: "خبير لينكس",
                gamificationBadgeNetwork: "خبير شبكات",
                gamificationBadgeSecurity: "خبير أمن سيبراني",
                gamificationBadgeAPC: "خبير APC",
                gamificationBadgeTroubleshoot: "ملك الصيانة",
                gamificationBadgeDiagnostic: "سيد التشخيص",
                gamificationBadgeSpeed: "بطل السرعة",
                gamificationBadgeTeamwork: "العمل الجماعي",
                gamificationBadgeProblemSolving: "حل المشكلات",
                gamificationBadgeNoErrors: "بدون أخطاء",
                gamificationBadgeActive: "مشاركة نشطة",
                gamificationBadgeInnovation: "ابتكار",
                gamificationBadgePerseverance: "مثابرة",
                gamificationLevelBeginner: "مبتدئ",
                gamificationLevelApprentice: "متدرب",
                gamificationLevelIntermediate: "متوسط",
                gamificationLevelAdvanced: "متقدم",
                gamificationLevelExpert: "خبير",
                gamificationLevelMaster: "محترف",
                gamificationLevelLegend: "أسطورة",
                gamificationLevelSupreme: "أسطورة عليا",
                gamificationChallengeTypes: "🎮 أنواع التحديات",
                gamificationChallengeTypeIndividual: "فردي",
                gamificationChallengeTypeTeam: "فرق",
                gamificationChallengeTypeGroup: "بين المجموعات",
                gamificationChallengeTypeTournament: "بطولة",
                gamificationChallengeTypeTimed: "مؤقت",
                gamificationChallengeTypeCompetence: "بالكفاءة",
                gamificationChallengeTypeCaseStudy: "دراسة حالة",
                gamificationChallengeTypeEscape: "لعبة الهروب",
                gamificationChallengeTypeWorkshop: "ورشة تطبيقية",
                gamificationXpBreakdown: "تفصيل XP",
                gamificationXpCorrect: "إجابة صحيحة",
                gamificationXpSpeed: "سرعة",
                gamificationXpTeamwork: "عمل جماعي",
                gamificationXpStreak: "سلسلة انتصارات",
                gamificationXpBonus: "مكافأة بدون أخطاء",
                gamificationXpParticipation: "مشاركة",
                gamificationDailyMissions: "📅 المهام اليومية",
                gamificationDailyComplete1: "إكمال تحدي واحد",
                gamificationDailyComplete3: "إكمال 3 تحديات",
                gamificationDailyPerfect: "بدون أخطاء",
                gamificationDailyStreak: "سلسلة الاتصال",
                gamificationWeeklyMissions: "📅 المهام الأسبوعية",
                gamificationWeeklyWin: "ربح 3 تحديات",
                gamificationWeeklyPoints: "الحصول على 500 XP",
                gamificationWeeklyTeamwork: "المشاركة في فريق",
                gamificationHallOfFame: "🏛 قاعة الشهرة",
                gamificationHallOfFameEmpty: "لا يوجد أبطال بعد. ابدأ الآن!",
                challengeHint: "💡 قم بإنشاء تحدي مباشرة من آخر رد للمساعد الذكي. يقوم الذكاء الاصطناعي بإنشاء الفرق والجولات والأسئلة تلقائياً.",
            },
            en: {
                headerTitle: "APC ALGERIA <span>GENERATION 3</span>",
                ministere: "Ministry of Vocational Training and Education",
                headerSub: "Trainer 2.0 – Intelligent APC instructional design assistant",
                headerDesc: "Generate professional prompts for ChatGPT, Claude, Gemini and Copilot to design your competency-based training scenarios.",
                headerSig: "",
                tab_home: "🏠 Home",
                tab_generator: "📝 Prompt Generator",
                tab_assistant: "🤖 AI Assistant",
                tab_about: "ℹ️ About",
                tab_guide: "📖 Complete guide",
                tab_fromdoc: "📄 Document → Presentation",
                tab_help: "❓ API Keys Help",
                tab_admin: "⚙️ Admin",
                tab_quiz: "🎯 Quiz",
                tab_game: "🚀 Defense Game",
                tab_game2: "🌱 Plant Game",
                tab_games: "🎮 Games",
                tab_challenge: "🎮 Challenges",
                sec1Title: "AI Identity & Mission",
                roleLabel: "Role",
                roleHint: "📌 Example: You are an expert trainer in APC Algeria.",
                missionLabel: "What should it do?",
                missionHint: "📌 Example: Build a complete pedagogical scenario according to APC Algeria.",
                sec2Title: "Training Information",
                specialiteLabel: "Specialty",
                moduleLabel: "Module",
                competenceLabel: "Target Competency",
                niveauLabel: "Level",
                anneeLabel: "Year",
                dureeLabel: "Duration",
                nbStagLabel: "Trainees",
                espaceLabel: "Learning Space",
                ressourcesLabel: "Available Resources",
                contexteLabel: "Professional Context",
                difficultesLabel: "Expected Difficulties",
                sec3Title: "APC Assistant Examples",
                examplesNotice: "⚠️ Click a card to fill ALL fields (role, mission, training, AST)",
                sec4Title: "APC Pedagogical Options",
                astToggleLabel: "🔷 Use AST (Work Situation Analysis)",
                astMetierLabel: "Occupation (AST)",
                astExtraitLabel: "AST Excerpt",
                liveBadge: "LIVE",
                btnCopy: "Copy",
                btnSendAI: "→ Send to AI",
                btnReset: "Reset",
                saveCourseBtn: "💾 Save Course",
                savePresentationBtn: "💾 Save Presentation",
                btnGamma: "🎨 Generate Presentation",
                docGenerate: "🎨 Generate the Presentation",
                newChat: "＋ New Conversation",
                quickAPC: "⚡ APC Shortcuts",
                historyLabel: "📂 History",
                providerLabel: "AI Provider:",
                aiInputPlaceholder: "Type your message or request APC content...",
                emptyChatMsg: "Ask a question or use an APC shortcut to start.",
                footerText: "APC Algeria GENERATION 3 — Trainer 2.0",
                themeLight: "☀️ Light mode",
                themeDark: "🌙 Dark mode",
                opt_analyse: "📋 APC Analysis",
                opt_scenario: "📐 APC Scenario (5 phases)",
                opt_integration: "🔗 Integration Situation",
                opt_evaluation: "✅ Evaluation",
                opt_grille: "📊 Criterion Grid 4×4",
                opt_criteres: "🎯 Performance Criteria",
                opt_indicateurs: "📌 Indicators",
                opt_conclusion: "📝 Conclusion",
                opt_activities: "👥 Trainer/Trainee activities",
                quick_scenario: "📐 Create a complete APC scenario",
                quick_eval: "✅ Generate an APC evaluation",
                quick_fiche: "📄 Create a pedagogical sheet",
                quick_integration: "🔗 Integration Situation",
                quick_grille: "📊 APC Criterion Grid 4×4",
                quick_cours: "📚 Complete APC lesson",
                prompt_role: "Role",
                prompt_mission: "Mission",
                prompt_context: "Training Context",
                prompt_specialite: "Specialty",
                prompt_module: "Module",
                prompt_competence: "Target Competency",
                checkCompetence: "🔍 Check competency",
                prompt_niveau: "Level",
                prompt_annee: "Year",
                prompt_duree: "Duration",
                prompt_stagiaires: "Trainees",
                prompt_espace: "Learning Space",
                prompt_ressources: "Resources",
                prompt_contexte: "Professional Context",
                prompt_difficultes: "Expected Difficulties",
                prompt_ast: "AST (Work Situation Analysis)",
                prompt_consignes: "AI Instructions",
                prompt_langue: "Output Language",
                c1: "Perform a detailed and complete APC analysis: list knowledge (theoretical and professional), skills (prepare, install, configure, control with precise actions), attitudes (rigor, organization, analytical thinking, safety, collaboration), internal resources (cognitive, procedural, behavioral) and external resources (material, documentary, human).",
                c2: "Build a complete APC pedagogical scenario according to the 5 phases (Contextualization, Destabilization, Construction, Integration, Transfer). For each phase provide: title, duration, objective, proposed situation, trainer activities, trainee activities, and expected production.",
                c3: "Create a detailed authentic integration situation linked to the professional context, with a realistic scenario, precise mission, constraints (time, quality, resources) and concrete expected production.",
                c4: "Produce a competency-based evaluation: assessment type, detailed task description, clear instructions for the trainee.",
                c5: "Generate a 4×4 APC criterion-referenced evaluation grid with 4 specific criteria and 4 mastery levels (Not mastered, In progress, Mastered, Expert). Present the markdown table with ☐ for each cell. Add a descriptor table for each level.",
                c6: "Generate detailed observable performance criteria for each grid criterion, as bullet lists with concrete and verifiable actions.",
                c7: "Generate success indicators as a list with ✅, describing precisely what validates the competency.",
                c8: "Write a rich pedagogical conclusion synthesizing achievements (knowledge, skills, attitudes), future learning perspectives, and the importance of the competency in the professional career path.",
                c9: "Include detailed «Trainer activities» and «Trainee activities» sections in each phase of the scenario (with precise actions, duration, methods).",
                no_option: "No option selected.",
                no_api_key: "⚠️ No API key configured for this provider.",
                copied: "✅ Copied!",
                export_title: "APC Algeria G3 – AI Conversation",
                web_search_active: "🌐 Web search enabled - results integrated",
                settingsLabel: "Settings",
                changePwdLabel: "Change password",
                settingsTitle: "AI Settings",
                settingsDesc: "Configure your API keys and choose the default model.",
                openrouterKeyLabel: "🔑 OpenRouter API Key",
                openrouterKeyHint: "To use DeepSeek, Llama 3.3 via OpenRouter.",
                geminiKeyLabel: "✦ Google Gemini API Key",
                geminiKeyHint: "To use Gemini 3.6 Flash / 3.1 Pro (free).",
                emailjsLabel: "📧 EmailJS — Send invitations",
                emailjsHint: "Create a free account at emailjs.com → connect your email → paste your keys here.",
                groqKeyLabel: "⚡ Groq API Key",
                groqKeyHint: "To use Groq models (GPT OSS, Mixtral, DeepSeek).",
                verifyBtn: "Verify",
                modelSelection: "Model to use",
                modelAuto: "☑ Auto (Gemini → Groq → OpenRouter)",
                modelGeminiFlash: "☐ Gemini 3.6 Flash",
                modelGeminiPro: "☐ Gemini 3.1 Pro (Preview)",
                modelV3: "☐ DeepSeek V3 (OpenRouter)",
                modelR1: "☐ DeepSeek R1 (OpenRouter)",
                modelLlama: "☐ Llama 3.3 70B (OpenRouter)",
                modelGroqLlama: "☐ GPT OSS 120B (Groq)",
                modelGroqScout: "☐ GPT OSS 120B (Groq)",
                modelLlama32Free: "☐ Llama 3.2 3B (OpenRouter free)",
                modelHermes405bFree: "☐ Hermes 3 405B (OpenRouter free)",
                modelDeepseekV3Free: "☐ Nemotron 3 Super 120B (OpenRouter free)",
                modelOwlAlpha: "☐ Nemotron Nano 9B (OpenRouter free)",
                modelLlama4ScoutFree: "☐ GPT OSS 20B (OpenRouter free)",
                saveBtn: "Save",
                clearBtn: "Clear all",
                cancelBtn: "Cancel",
                closeBtn: "Close",
                apiSaved: "✅ API keys saved!",
                apiCleared: "🗑 Keys cleared.",
                apiInvalid: "⚠️ Invalid key.",
                keyValid: "✅ Valid key!",
                keyInvalid: "❌ Invalid key or network error.",
                checkingKey: "🔍 Checking...",
                compatLabel: "Icons mode",
                compatHint: "Automatically detects if your icons display correctly and switches to a compatible version if needed.",
                compatAuto: "Auto (recommended)",
                compatModern: "Modern",
                compatCompat: "Compatible",
                landing_title: "APC Algeria G3 Assistant",
                landing_desc: "Smart instructional design platform based on the Competency-Based Approach (APC). Generate prompts, chat with AI, create interactive presentations.",
                card_generator_title: "Prompt Generator",
                card_assistant_title: "AI Assistant",
                card_fromdoc_title: "Document → Presentation",
                card_about_title: "About",
                card_generator_desc: "Create professional APC prompts",
                card_assistant_desc: "Chat with the pedagogical AI",
                card_fromdoc_desc: "Generate slides from a document",
                card_about_desc: "Discover the platform",
                card_vision_title: "Our Vision",
                card_vision_desc: "Ministry objectives",
                quizTitle: "📝 Create Quiz from a Presentation",
                quizNoPresentation: "No saved presentations. Generate a presentation first.",
                quizHint: "💡 You can also generate a quiz from the interactive presentation window → 🎯 Generate Quiz button",
                quizPublishedTitle: "📋 Published Quizzes",
                quizPassTitle: "🎯 Take a Quiz",
                quizPassDesc: "Enter the quiz code to start.",
                quizCodePH: "Quiz code",
                quizStartBtn: "🚀 Start",
                learnerHeaderTitle: "APC Algeria GENERATION 3",
                untitledPres: "Untitled Presentation",
                slidesCount: "slides",
                distribBtn: "📤 Distribute",
                statsBtn: "📊 Stats",
                statsTitle: "📊 Quiz Statistics",
                statsNoData: "No attempts recorded for this quiz.",
                statsAvg: "Average",
                statsBest: "Best",
                statsWorst: "Worst",
                statsAttempts: "Attempts",
                statsAttemptsLabel: "attempt(s) recorded",
                statsClose: "Close",
                statsExportPDF: "📄 Export PDF",
                statsExportNoData: "No data to export.",
                statsBadgesTitle: "🏅 Earned badges:",
                statsExpert: "Expert",
                statsMaitrise: "Mastered",
                statsEnCours: "In progress",
                statsNonMaitrise: "Not mastered",
                pdfName: "Name",
                pdfSpecialite: "Speciality",
                pdfGroupe: "Group",
                pdfScore: "Score",
                pdfLevel: "Level",
                pdfGeneratedBy: "Generated by APC Algeria G3 - Quiz",
                deleteQuizConfirm: "Delete this quiz?",
                quizDeleted: "🗑 Quiz deleted.",
                noQuizFound: "⚠️ No presentation found.",
                invalidPres: "⚠️ Invalid presentation.",
                quizGeneratorTitle: "🎯 Quiz Generator",
                quizTitleLabel: "📌 Title :",
                quizGenerateBtn: "🤖 Generate questions with AI",
                quizGenerateDesc: "AI will analyze each slide and propose MCQ questions",
                quizEditDesc: "Edit questions, select 1 per slide, set correct answers.",
                quizQuestionsLabel: "📝 Questions :",
                quizMin10: "min 10",
                quizTimePerQuestion: "⏱ Time/question :",
                quizSecondsHint: "seconds (0 = no limit)",
                quizPublishBtn: "🔗 Generate link / QR",
                quizCloseBtn: "Close",
                quizNoData: "No quiz data.",
                badgeManual: "Manual",
                badgeAI: "AI",
                quizAskMoreBtn: "🤖 + Ask for more questions from AI",
                quizPublishedBadge: "🔗 Quiz published!",
                quizDataLink: "📦 Embedded data link",
                quizSelectedLabel: "selected",
                quizGenerateFirst: "⚠️ Generate a presentation first.",
                quizClickBelow: "Click below to generate questions.",
                quizQuestionsCount: "questions",
                quizDesc: "Generate pedagogical quizzes and share them with your learners via QR code.",
                quizCodeLabel: "Code:",
                drawerMenu: "☰ Menu",
                drawerLang: "Language:",
                errGeneric: "❌ Error: ",
                emptyCode: "⚠️ Enter the quiz code.",
                quizNotFound: "❌ Quiz not found.",
                quizPinLabel: "🔑 Security code",
                quizAttemptsLabel: "🔁 Max attempts :",
                quizAttemptsHint: "0 = unlimited",
                quizFromAssistantTitle: "🎯 Create Quiz from AI Assistant",
                quizAssistantBtn: "🤖 Generate Quiz with AI",
                quizAssistantNoResponse: "No AI Assistant response found. Chat with the Assistant first.",
                quizFromAssistantDesc: "Generate a quiz directly from the last AI Assistant response",
                voiceListening: "🎤 Listening...",
                voiceNotSupported: "⚠️ Voice recognition not supported by this browser.",
                voiceError: "⚠️ Voice recognition error: ",
                challengeDesc: "Create pedagogical challenges, team competitions, and track live leaderboards.",
                challengeFromAssistantTitle: "🎮 Create Challenge from AI Assistant",
                challengeAssistantBtn: "🎮 Generate Challenge with AI",
                challengeAssistantNoResponse: "No AI Assistant response found. Chat with the Assistant first.",
                challengeFromAssistantDesc: "Choose an Assistant IA conversation below or use the last response. The AI creates teams, rounds and questions automatically.",
                challengeManualTitle: "✏️ Create Challenge manually",
                challengePublishedTitle: "📋 Published Challenges",
                challengeConfigTitle: "⚙️ Configure challenge",
                challengeTitleLabel: "Challenge title",
                challengeThemeLabel: "Theme",
                challengeThemePlaceholder: "Ex: Networks, Security, Programming",
                challengeThemeHint: "💡 Leave empty for AI to determine the theme automatically.",
                challengeTypeLabel: "Type",
                challengeTypeGroup: "Groups",
                challengeTypeIndividual: "Individual",
                challengeTypeTournament: "Tournament",
                challengeType_group: "👥 Groups",
                challengeType_team: "👤 Individual",
                challengeType_tournament: "🏆 Tournament",
                challengeTeamsLabel: "Teams",
                challengeTeamsCountLabel: "Number of teams",
                challengeTeamsAuto: "Random by AI",
                challengeTeamsManual: "Manual",
                challengeRoundsLabel: "Number of rounds",
                challengeDurationLabel: "Time limit",
                challengeNoLimit: "No limit",
                challengeMinutes: "min",
                challengeGenerateBtn: "🎮 Generate challenge",
                challengeNew: "New challenge",
                challengeRound: "Round",
                challengeRounds: "Rounds",
                challengeQuestions: "questions",
                challengeQuestion: "question",
                challengeEditBtn: "Edit",
                challengeRegenBtn: "Regenerate AI",
                challengeAddRound: "Add round",
                challengeAddQuestion: "Add question",
                challengePublishBtn: "📤 Publish challenge",
                challengeGenerating: "Generating challenge...",
                challengeGeneratingDesc: "AI is creating questions and criteria. Please wait...",
                challengeNoData: "No challenge in progress. Create one from the Assistant or manually.",
                challengeSelectCompetence: "🎯 Select a competency",
                challengeNoRounds: "Add at least one round before publishing.",
                challengeDeleteConfirm: "Delete this challenge permanently?",
                challengeDeleted: "🗑 Challenge and all its data deleted.",
                challengeCodeLabel: "Code:",
                challengeRankingBtn: "🏆 Leaderboard",
                challengeRankingTitle: "Live leaderboard",
                challengePoints: "pts",
                challengeMembers: "members",
                challengeNoParticipants: "No participants yet.",
                challengeTeam: "Team",
                challengeTeamA: "Team Alpha",
                challengeTeamB: "Team Beta",
                challengeTeamC: "Team Gamma",
                challengeTeamD: "Team Delta",
                challengeTeamE: "Team Epsilon",
                challengeCorrect: "Correct answer!",
                challengeCorrectLabel: "Correct answer:",
                challengeIncorrect: "Wrong answer",
                challengeCorrectAnswer: "Correct answer",
                challengeSubmitBtn: "Submit",
                challengeSelectAnswer: "Select an answer first.",
                challengeRoundComplete: "Round complete!",
                challengeThanks: "Thank you for participating! Keep improving.",
                challengeBackBtn: "🔙 Back to challenge",
                challengeWelcome: "Welcome",
                challengeLearner: "Participant",
                challengeCodeInvalid: "Invalid or expired challenge code.",
                challengeNoQuestions: "No questions in this round.",
                challengeNewRound: "New round",
                challengeNewQuestion: "New question",
                challengeOptionA: "Option A",
                challengeOptionB: "Option B",
                challengeOptionC: "Option C",
                challengeOptionD: "Option D",
                challengeEditTeamPrompt: "New team name:",
                challengeEditQuestionPrompt: "New question text:",
                challengeEditOptionsPrompt: "New options (separated by |):",
                challengeEditCorrectPrompt: "Correct answer index",
                challengeDistribTitle: "Challenge distribution",
                challengeDistribImportLabel: "📥 Paste list (CSV)",
                challengeDistribPlaceholder: "name_fr,name_ar,email,specialty,group&#10;Ahmed Ben Ali,أحمد,ahmed@gmail.com,IT,Group A&#10;Sarah,سارة,,Networks,",
                challengeDistribGenerateBtn: "⚡ Generate access",
                challengeDistribTemplateBtn: "📥 Download template",
                challengeDistribNameFr: "Name (FR)",
                challengeDistribNameAr: "Name (AR)",
                challengeDistribEmail: "Email",
                challengeDistribAddBtn: "➕ Add",
                challengeDistribTeamLabel: "Team",
                challengeDistribAutoTeam: "Auto (random)",
                challengeDistribAutoTeamBtn: "🤖 Auto-assign",
                challengeDistribStatus: "Status",
                challengeDistribEmpty: "No participants. Add them above.",
                challengeDistribDeleteConfirm: "Delete this participant?",
                challengeDistribTeamPrompt: "Assign to team",
                challengeDistribSpecialty: "Specialty",
                challengeDistribGroup: "Group",
                challengeDistribAllSpecialties: "All specialties",
                challengeDistribAllGroups: "All groups",
                challengeDistribSendAll: "📧 Send all",
                challengeDistribImportBtn: "📄 Import CSV/XLSX",
                challengeDistribEmailMsg: "You are invited to participate in a pedagogical challenge.",
                challengeDistribYourCode: "Your access code",
                challengeDistribYourLink: "Your link",
                challengeObjectiveLabel: "Objective Type",
                challengeCriteriaTitle: "Performance Criteria",
                challengeCriteriaWeight: "Weight in % (ex: 20)",
                challengeCriteriaPrompt: "Criteria name (EN):",
                challengeCriteriaEditPrompt: "Edit criteria:",
                challengeCriteriaWeightEdit: "Weight in %:",
                challengeCriteriaDeleteConfirm: "Delete this criteria?",
                challengeIndicatorPrompt: "Success indicator — leave empty to finish:",
                challengeNoCriteria: "No criteria defined. Add them below.",
                challengeAddCriterion: "➕ Add a criterion",
                challengePublicPin: "🔑 Public access code",
                challengePublicPinDesc: "Share this code or QR with learners. No email required.",
                challengeEnterName: "Your name",
                challengeJoinBtn: "🎮 Join the challenge",
                challengeAutoAssign: "Team auto-assigned",
                challengeResultsTitle: "📊 Report Results",
                challengeResultsHint: "Enter a score out of 100 for each team/criterion, or let AI calculate automatically.",
                challengeResultsBtn: "📊 Results",
                btnPlay: "🎮 Play",
                challengeResultsAuto: "🤖 Auto-fill (AI)",
                challengeResultsCalc: "📊 Calculate ranking",
                challengeResultsRanking: "Final ranking",
                challengeResultsRewards: "Rewards",
                challengeTotalScore: "Total",
                challengeSpecialtyLabel: "Specialty",
                challengeSpecialtyPlaceholder: "Ex: IT, Welding, Cooking...",
                challengeObjQuiz: "Answer a quiz",
                challengeObjPractical: "Perform a practical activity",
                challengeObjProblem: "Solve a problem",
                challengeObjInstall: "Install a system",
                challengeObjNetwork: "Configure a network",
                challengeObjRepair: "Repair a failure",
                challengeObjDiagnose: "Diagnose an error",
                challengeObjDocument: "Design a document",
                challengeObjProject: "Complete a project",
                challengeObjPresent: "Present a solution",
                gamificationTitle: "🏆 Gamification System",
                gamificationXp: "Experience Points (XP)",
                gamificationLevel: "Level",
                gamificationBadges: "🎖 Badges unlocked",
                gamificationStreak: "🔥 Streaks",
                gamificationStreakCurrent: "Current streak",
                gamificationStreakBest: "Best streak",
                gamificationStats: "📊 Statistics",
                gamificationChallengesDone: "Challenges completed",
                gamificationChallengesWon: "Challenges won",
                gamificationChallengesLost: "Challenges lost",
                gamificationSuccessRate: "Success rate",
                gamificationNextLevel: "Next level",
                gamificationXpToNext: "XP required",
                gamificationLeaderboard: "🏆 Leaderboards",
                gamificationLeaderboardIndividual: "Individual",
                gamificationLeaderboardTeams: "Teams",
                gamificationLeaderboardWeekly: "Weekly",
                gamificationLeaderboardMonthly: "Monthly",
                gamificationRewards: "🎁 Rewards",
                gamificationCertificates: "📜 Certificates",
                gamificationNoBadges: "No badges unlocked yet.",
                gamificationBadgeWindows: "Windows Expert",
                gamificationBadgeLinux: "Linux Expert",
                gamificationBadgeNetwork: "Network Expert",
                gamificationBadgeSecurity: "Cybersecurity Expert",
                gamificationBadgeAPC: "APC Expert",
                gamificationBadgeTroubleshoot: "Troubleshooting King",
                gamificationBadgeDiagnostic: "Diagnostic Master",
                gamificationBadgeSpeed: "Speed Champion",
                gamificationBadgeTeamwork: "Teamwork",
                gamificationBadgeProblemSolving: "Problem Solving",
                gamificationBadgeNoErrors: "No Errors",
                gamificationBadgeActive: "Active Participation",
                gamificationBadgeInnovation: "Innovation",
                gamificationBadgePerseverance: "Perseverance",
                gamificationLevelBeginner: "Beginner",
                gamificationLevelApprentice: "Apprentice",
                gamificationLevelIntermediate: "Intermediate",
                gamificationLevelAdvanced: "Advanced",
                gamificationLevelExpert: "Expert",
                gamificationLevelMaster: "Master",
                gamificationLevelLegend: "Legend",
                gamificationLevelSupreme: "Supreme Legend",
                gamificationChallengeTypes: "🎮 Challenge Types",
                gamificationChallengeTypeIndividual: "Individual",
                gamificationChallengeTypeTeam: "Team",
                gamificationChallengeTypeGroup: "Between groups",
                gamificationChallengeTypeTournament: "Tournament",
                gamificationChallengeTypeTimed: "Timed",
                gamificationChallengeTypeCompetence: "By competence",
                gamificationChallengeTypeCaseStudy: "Case study",
                gamificationChallengeTypeEscape: "Escape Game",
                gamificationChallengeTypeWorkshop: "Workshop",
                gamificationXpBreakdown: "XP Breakdown",
                gamificationXpCorrect: "Correct answer",
                gamificationXpSpeed: "Speed",
                gamificationXpTeamwork: "Teamwork",
                gamificationXpStreak: "Win streak",
                gamificationXpBonus: "No-error bonus",
                gamificationXpParticipation: "Participation",
                gamificationDailyMissions: "📅 Daily missions",
                gamificationDailyComplete1: "Complete 1 challenge",
                gamificationDailyComplete3: "Complete 3 challenges",
                gamificationDailyPerfect: "No errors",
                gamificationDailyStreak: "Login streak",
                gamificationWeeklyMissions: "📅 Weekly missions",
                gamificationWeeklyWin: "Win 3 challenges",
                gamificationWeeklyPoints: "Earn 500 XP",
                gamificationWeeklyTeamwork: "Participate in a team",
                gamificationHallOfFame: "🏛 Hall of Fame",
                gamificationHallOfFameEmpty: "No champions yet. Get started!",
                challengeHint: "💡 Generate a challenge directly from the last AI Assistant response. The AI creates teams, rounds and questions automatically.",
            }
        };
        const aboutFR = `\
<h1>📚 À propos de la plateforme</h1>\
<p class="about-sub">APC Algérie GÉNÉRATION 3</p>\
<h2>Notre mission</h2>\
<p>APC Algérie GÉNÉRATION 3 est une plateforme numérique intelligente dédiée à la conception, à la génération et au développement de ressources pédagogiques et de documents de formation destinés au secteur de la formation et de l'enseignement professionnels.</p>\
<p>Conçue pour accompagner les formateurs, les enseignants, les ingénieurs pédagogiques, les établissements de formation et l'ensemble des acteurs de la formation et de l'enseignement professionnels, la plateforme met la puissance de l'intelligence artificielle au service de l'Approche Par Compétences (APC).</p>\
<p>Elle permet de produire rapidement des ressources pédagogiques fiables, cohérentes et conformes aux référentiels de formation, tout en réduisant le temps consacré à leur conception et en améliorant leur qualité.</p>\
<p>Notre ambition est d'accompagner la modernisation de la formation et de l'enseignement professionnels en proposant des solutions innovantes, performantes et adaptées aux besoins du terrain.</p>\
<h2>Nos objectifs</h2>\
<ul>\
<li>Faciliter la mise en œuvre de l'Approche Par Compétences (APC).</li>\
<li>Accompagner les formateurs dans la conception de ressources pédagogiques de qualité.</li>\
<li>Optimiser la préparation des activités pédagogiques et la production de documents de formation.</li>\
<li>Favoriser l'innovation pédagogique grâce aux technologies de l'intelligence artificielle.</li>\
<li>Soutenir la transformation numérique du secteur de la formation et de l'enseignement professionnels.</li>\
<li>Contribuer au développement des compétences des apprenants et à l'amélioration continue des pratiques pédagogiques.</li>\
</ul>\
<h2>Nos solutions</h2>\
<p>La plateforme met à disposition une nouvelle génération d'outils d'intelligence artificielle permettant de générer, concevoir et développer notamment :</p>\
<ul>\
<li>Scénarios pédagogiques.</li>\
<li>Plans et programmes de formation.</li>\
<li>Séquences pédagogiques.</li>\
<li>Documents de formation.</li>\
<li>Supports de cours.</li>\
<li>Situations d'apprentissage.</li>\
<li>Situations d'évaluation.</li>\
<li>Travaux pratiques (TP).</li>\
<li>Travaux dirigés (TD).</li>\
<li>Quiz techniques.</li>\
<li>Évaluations diagnostiques, formatives et sommatives.</li>\
<li>Présentations professionnelles.</li>\
<li>Guides pédagogiques.</li>\
<li>Grilles d'évaluation.</li>\
<li>Documents administratifs.</li>\
<li>Documents techniques.</li>\
<li>Ressources pédagogiques conformes aux exigences de l'Approche Par Compétences.</li>\
</ul>\
<p>Chaque document est élaboré selon les meilleures pratiques de l'ingénierie pédagogique et répond aux exigences de la formation et de l'enseignement professionnels.</p>\
<h2>Notre engagement</h2>\
<p>L'Approche Par Compétences constitue le fondement pédagogique de l'ensemble des outils développés au sein de la plateforme.</p>\
<p>Toutes les ressources générées sont conçues conformément :</p>\
<ul>\
<li>aux principes de l'Approche Par Compétences (APC) ;</li>\
<li>aux référentiels de formation ;</li>\
<li>aux exigences de la formation et de l'enseignement professionnels ;</li>\
<li>aux meilleures pratiques de l'ingénierie pédagogique ;</li>\
<li>aux technologies les plus récentes de l'intelligence artificielle.</li>\
</ul>\
<p>L'intelligence artificielle est utilisée comme un outil d'assistance destiné à accompagner les formateurs dans leur travail, à améliorer la qualité des productions pédagogiques et à renforcer le développement des compétences.</p>\
<h2>Concepteur et développeur</h2>\
<p>La plateforme APC Algérie GÉNÉRATION 3 a été imaginée, conçue et développée par <strong>Aziz Mohamed Rostom</strong>.</p>\
<p>Spécialiste des technologies numériques, de la cybersécurité, de l'intelligence artificielle et de l'ingénierie pédagogique, il met son expertise au service de la modernisation de la formation et de l'enseignement professionnels.</p>\
<p>Son ambition est de proposer des solutions innovantes permettant de rapprocher les technologies numériques des pratiques pédagogiques afin d'améliorer durablement la qualité de la formation.</p>\
<h2>Groupe APC Plus SBA</h2>\
<p>Le projet est porté avec la contribution du groupe <strong>APC Plus SBA</strong> (Approche Par Compétences Plus Sidi Bel Abbès).</p>\
<p>Ce groupe réunit des professionnels de la formation, des ingénieurs pédagogiques et des spécialistes engagés dans le développement de l'Approche Par Compétences ainsi que dans l'amélioration continue de la qualité de la formation et de l'enseignement professionnels.</p>\
<p><strong>Membres du groupe</strong></p>\
<ul>\
<li><strong>Mohamed Rostom Aziz</strong> — Conception, développement et coordination du projet</li>\
<li><strong>Bouloum Boumediene</strong> — Contribution pédagogique</li>\
<li><strong>Faradji Said</strong> — Contribution pédagogique</li>\
<li><strong>Salah Manel</strong> — Contribution pédagogique</li>\
</ul>\
<h3>Leur contribution</h3>\
<p>Les membres du groupe APC Plus SBA ont contribué activement au développement de la plateforme à travers :</p>\
<ul>\
<li>l'orientation pédagogique générale du projet ;</li>\
<li>l'identification des besoins des établissements de formation ;</li>\
<li>la validation pédagogique des contenus générés par l'intelligence artificielle ;</li>\
<li>l'intégration des principes de l'Approche Par Compétences ;</li>\
<li>l'amélioration continue des fonctionnalités pédagogiques ;</li>\
<li>l'optimisation de l'expérience utilisateur ;</li>\
<li>le conseil et l'accompagnement dans le développement des outils pédagogiques ;</li>\
<li>la promotion de l'innovation pédagogique et de la transformation numérique.</li>\
</ul>\
<p>Cette collaboration permet d'associer expertise pédagogique, innovation technologique et intelligence artificielle afin de proposer un environnement performant répondant aux besoins de la formation et de l'enseignement professionnels.</p>\
<h2>Accompagnement pédagogique</h2>\
<p>La plateforme bénéficie également de l'expertise et de l'accompagnement de <strong>Mme Bach Chaouch Salima Zina</strong>, experte en pédagogie.</p>\
<p>Son accompagnement contribue à garantir la qualité scientifique et pédagogique des ressources produites, leur cohérence ainsi que leur conformité avec les principes de l'Approche Par Compétences.</p>\
<h2>Soutien institutionnel</h2>\
<p>Le projet APC Algérie GÉNÉRATION 3 bénéficie du soutien et de l'accompagnement de <strong>M. Khalili Adel</strong>, Directeur de la Formation et de l'Enseignement de la wilaya de Sidi Bel Abbès.</p>\
<p>Par sa confiance, son engagement et son soutien à l'innovation pédagogique, il accompagne le développement de cette initiative dédiée à la modernisation de la formation et de l'enseignement professionnels grâce aux technologies numériques et à l'intelligence artificielle.</p>\
<p>L'équipe d'APC Algérie GÉNÉRATION 3 lui exprime sa profonde gratitude pour son soutien, sa confiance et son accompagnement dans la réalisation de ce projet.</p>\
<h2>Remerciements</h2>\
<p>L'équipe de <strong>APC Algérie GÉNÉRATION 3</strong> exprime sa profonde gratitude à <strong>M. Nedjari Mohamed</strong>, Sous-Directeur des Ressources Humaines au Ministère de la Formation et de l'Enseignement Professionnels, pour l'intérêt qu'il porte à cette initiative, ainsi que pour sa disponibilité, ses précieux conseils et ses encouragements.</p>\
<p>Nos remerciements s'adressent également à l'ensemble des responsables, directeurs centraux, sous-directeurs, chefs de service, cadres et personnels du Ministère de la Formation et de l'Enseignement Professionnels, pour leur engagement quotidien en faveur du développement et de la modernisation de la formation et de l'enseignement professionnels.</p>\
<p>Nous adressons enfin nos sincères remerciements à toutes les personnes qui, par leur confiance, leur soutien ou leurs contributions, accompagnent le développement de cette plateforme.</p>\
<h2>Notre vision</h2>\
<p>Nous sommes convaincus que l'avenir de la formation et de l'enseignement professionnels repose sur la complémentarité entre l'expertise humaine, l'innovation pédagogique et l'intelligence artificielle.</p>\
<p>Notre vision est de faire de APC Algérie GÉNÉRATION 3 une plateforme de référence en matière de conception pédagogique, d'ingénierie de formation et de transformation numérique, en proposant des solutions intelligentes qui accompagnent durablement les formateurs, les établissements de formation et les professionnels du secteur.</p>\
<p>Nous développons des outils innovants qui facilitent la conception pédagogique, améliorent la qualité des ressources de formation et contribuent au développement des compétences dans un environnement en constante évolution.</p>\
<h2>Notre devise</h2>\
<p><em>Former aujourd'hui les compétences de demain grâce à l'Approche Par Compétences, à l'innovation pédagogique et à l'intelligence artificielle.</em></p>\
<p>APC Algérie GÉNÉRATION 3 est bien plus qu'une plateforme numérique : c'est une initiative dédiée à la modernisation de la formation et de l'enseignement professionnels, qui associe l'expertise humaine, l'innovation pédagogique et les technologies de l'intelligence artificielle afin d'accompagner les professionnels dans la conception de ressources pédagogiques de qualité et le développement des compétences de demain.</p>\
<h2>Clause de responsabilité</h2>\
<p>Les contenus générés par APC Algérie GÉNÉRATION 3 constituent une aide à la conception pédagogique. Ils sont destinés à assister les professionnels de la formation dans leurs activités de conception, sans se substituer à leur expertise. Toute ressource produite doit être relue, adaptée et validée par l'utilisateur avant toute utilisation officielle, afin de garantir sa conformité aux référentiels, aux exigences réglementaires et au contexte pédagogique concerné.</p>\
<h2>Version</h2>\
<p><strong>APC Algérie GÉNÉRATION 3</strong><br>Formateur 2.0<br>Version 3.0 — 2026</p>\
<h2>Mentions légales</h2>\
<p>© 2026 APC Algérie GÉNÉRATION 3.<br>Conception et développement : Mohamed Rostom Aziz.<br>Avec la contribution du Groupe APC Plus SBA.<br>Tous droits réservés.</p>`;
        const aboutAR = `\
<h1>📚 حول المنصة</h1>\
<p class="about-sub">APC Algérie GÉNÉRATION 3</p>\
<h2>رسالتنا</h2>\
<p>APC Algérie GÉNÉRATION 3 هي منصة رقمية ذكية متخصصة في تصميم وتوليد وتطوير الموارد البيداغوجية والوثائق التكوينية الموجهة لقطاع التكوين والتعليم المهني.</p>\
<p>صُممت المنصة لمرافقة المكوّنين، والأساتذة، وخبراء الهندسة البيداغوجية، ومؤسسات التكوين، وجميع الفاعلين في قطاع التكوين والتعليم المهني، من خلال توظيف أحدث تقنيات الذكاء الاصطناعي لخدمة المقاربة بالكفاءات (APC).</p>\
<p>وتُمكّن المنصة من إنتاج موارد بيداغوجية ووثائق تكوينية احترافية بسرعة وكفاءة، مع ضمان جودتها، ودقتها، وتناسقها، وتوافقها مع البرامج والمراجع المعتمدة في قطاع التكوين والتعليم المهني.</p>\
<p>وتهدف المنصة إلى المساهمة في تحديث منظومة التكوين والتعليم المهني من خلال توفير حلول رقمية مبتكرة تستجيب لاحتياجات المكوّنين والمؤسسات التكوينية.</p>\
<h2>أهدافنا</h2>\
<ul>\
<li>تسهيل تطبيق المقاربة بالكفاءات (APC).</li>\
<li>مرافقة المكوّنين في تصميم الموارد البيداغوجية عالية الجودة.</li>\
<li>تحسين إعداد الأنشطة البيداغوجية وإنتاج وثائق التكوين.</li>\
<li>دعم الابتكار البيداغوجي من خلال تقنيات الذكاء الاصطناعي.</li>\
<li>المساهمة في التحول الرقمي لقطاع التكوين والتعليم المهني.</li>\
<li>المساهمة في تطوير كفاءات المتعلمين والتحسين المستمر للممارسات البيداغوجية.</li>\
</ul>\
<h2>حلولنا</h2>\
<p>توفر المنصة مجموعة متكاملة من أدوات الذكاء الاصطناعي المتخصصة في إنشاء وتطوير مختلف الوثائق والموارد البيداغوجية، من بينها:</p>\
<ul>\
<li>السيناريوهات البيداغوجية.</li>\
<li>مخططات وبرامج التكوين.</li>\
<li>التسلسلات التعليمية.</li>\
<li>الوثائق التكوينية.</li>\
<li>الدروس والدعائم البيداغوجية.</li>\
<li>وضعيات التعلم.</li>\
<li>وضعيات التقييم.</li>\
<li>الأعمال التطبيقية (TP).</li>\
<li>الأعمال الموجهة (TD).</li>\
<li>الاختبارات التقنية (Quiz).</li>\
<li>التقييمات التشخيصية والتكوينية والختامية.</li>\
<li>العروض التقديمية الاحترافية.</li>\
<li>الأدلة البيداغوجية.</li>\
<li>شبكات ومعايير التقييم.</li>\
<li>الوثائق الإدارية.</li>\
<li>الوثائق التقنية.</li>\
<li>مختلف الموارد البيداغوجية المتوافقة مع المقاربة بالكفاءات.</li>\
</ul>\
<p>وتُعد جميع الوثائق وفق أحدث الممارسات البيداغوجية، بما يضمن جودتها وقابليتها للتطبيق مباشرة في مؤسسات التكوين.</p>\
<h2>التزامنا</h2>\
<p>تُعد المقاربة بالكفاءات (APC) الركيزة الأساسية التي تستند إليها جميع الأدوات والخدمات التي توفرها المنصة.</p>\
<p>وتلتزم المنصة بإنتاج محتوى بيداغوجي يتوافق مع:</p>\
<ul>\
<li>مبادئ المقاربة بالكفاءات (APC).</li>\
<li>البرامج والمراجع الرسمية للتكوين.</li>\
<li>متطلبات قطاع التكوين والتعليم المهني.</li>\
<li>أحدث الممارسات في الهندسة البيداغوجية.</li>\
<li>أحدث تقنيات الذكاء الاصطناعي.</li>\
</ul>\
<p>ويُستخدم الذكاء الاصطناعي بوصفه أداةً مساعدةً للمكوّن، تسهم في تحسين جودة الإنتاج البيداغوجي، وتوفير الوقت، ودعم تنمية الكفاءات، دون أن يحل محل الخبرة البشرية.</p>\
<h2>المصمم والمطور</h2>\
<p>تم تصور وتصميم وتطوير منصة APC Algérie GÉNÉRATION 3 من طرف <strong>عزيز محمد رستم</strong>.</p>\
<p>وهو متخصص في التقنيات الرقمية، والأمن السيبراني، والذكاء الاصطناعي، والهندسة البيداغوجية، ويضع خبراته في خدمة تطوير قطاع التكوين والتعليم المهني.</p>\
<p>وينطلق هذا المشروع من رؤية تهدف إلى توظيف التكنولوجيا الحديثة لدعم المكوّنين، وتحسين جودة الموارد البيداغوجية، والمساهمة في تطوير منظومة التكوين.</p>\
<h2>مجموعة APC Plus SBA</h2>\
<p>يُنجز هذا المشروع بالتعاون مع مجموعة <strong>APC Plus SBA</strong> (المقاربة بالكفاءات – سيدي بلعباس).</p>\
<p>وتضم المجموعة نخبة من المكوّنين، وخبراء الهندسة البيداغوجية، والمتخصصين في التكوين والتعليم المهني، الذين يجمعهم هدف مشترك يتمثل في تطوير الممارسات البيداغوجية، وتعزيز جودة التكوين، ودعم الابتكار.</p>\
<p><strong>أعضاء المجموعة</strong></p>\
<ul>\
<li><strong>محمد رستم عزيز</strong> — التصميم والتطوير وتنسيق المشروع</li>\
<li><strong>بولوم بومدين</strong> — المساهمة البيداغوجية</li>\
<li><strong>فرادجي سعيد</strong> — المساهمة البيداغوجية</li>\
<li><strong>صلاح منال</strong> — المساهمة البيداغوجية</li>\
</ul>\
<h3>مساهمة أعضاء المجموعة</h3>\
<p>ساهم أعضاء مجموعة APC Plus SBA بفعالية في تطوير المنصة من خلال:</p>\
<ul>\
<li>المساهمة في التوجيه البيداغوجي العام للمشروع.</li>\
<li>تحديد احتياجات المكوّنين ومؤسسات التكوين.</li>\
<li>مراجعة واعتماد المحتويات التي ينتجها الذكاء الاصطناعي.</li>\
<li>ضمان توافق الأدوات مع مبادئ المقاربة بالكفاءات.</li>\
<li>تطوير وتحسين الوظائف البيداغوجية للمنصة.</li>\
<li>تحسين تجربة المستخدم.</li>\
<li>تقديم الاستشارة والمرافقة أثناء تطوير المنصة.</li>\
<li>دعم الابتكار البيداغوجي والتحول الرقمي في قطاع التكوين والتعليم المهني.</li>\
</ul>\
<p>وقد أثمر هذا التعاون عن منصة تجمع بين الخبرة البيداغوجية، والابتكار الرقمي، وتقنيات الذكاء الاصطناعي، بما يلبي احتياجات قطاع التكوين والتعليم المهني.</p>\
<h2>المرافقة البيداغوجية</h2>\
<p>تحظى المنصة كذلك بالمرافقة العلمية والبيداغوجية للأستاذة <strong>باخ شعوش سليمة زينة</strong>، الخبيرة في البيداغوجيا.</p>\
<p>وتسهم خبرتها في ضمان الجودة العلمية والبيداغوجية للموارد المنتجة، وتعزيز انسجامها، وضمان توافقها مع مبادئ المقاربة بالكفاءات.</p>\
<h2>الدعم المؤسسي</h2>\
<p>يحظى مشروع APC Algérie GÉNÉRATION 3 بالدعم والمرافقة من طرف السيد <strong>خليلي عادل</strong>، مدير التكوين والتعليم لولاية سيدي بلعباس.</p>\
<p>وكان لثقته، ودعمه، وتشجيعه المستمر، دورٌ مهم في إنجاح هذا المشروع، الذي يهدف إلى تحديث قطاع التكوين والتعليم المهني من خلال توظيف التقنيات الرقمية والذكاء الاصطناعي.</p>\
<p>وتتقدم إدارة APC Algérie GÉNÉRATION 3 بخالص عبارات الشكر والتقدير للسيد خليلي عادل على دعمه، ومرافقته، وثقته في هذا المشروع، وإيمانه بأهمية الابتكار في خدمة التكوين والتعليم المهني.</p>\
<h2>الشكر والتقدير</h2>\
<p>تتقدم أسرة <strong>APC Algérie GÉNÉRATION 3</strong> بخالص الشكر والتقدير إلى <strong>السيد ندجاري محمد</strong>، نائب مدير الموارد البشرية بوزارة التكوين والتعليم المهنيين، على اهتمامه بهذه المبادرة، وعلى ما قدمه من دعم، وتوجيهات قيّمة، وتشجيع مستمر.</p>\
<p>كما نتوجه بجزيل الشكر إلى جميع المسؤولين، والمديرين المركزيين، ونواب المديرين، ورؤساء المصالح، والإطارات، وموظفي وزارة التكوين والتعليم المهنيين، تقديراً لجهودهم المتواصلة وإسهاماتهم في تطوير وعصرنة قطاع التكوين والتعليم المهنيين.</p>\
<p>ونتقدم كذلك بخالص الامتنان إلى كل من ساهم، من قريب أو من بعيد، في دعم وتطوير هذه المنصة، سواءً من خلال ثقته، أو تشجيعه، أو مساهماته، إيماناً منه بأهمية الابتكار والارتقاء بمنظومة التكوين والتعليم المهنيين.</p>\
<h2>رؤيتنا</h2>\
<p>نؤمن بأن مستقبل التكوين والتعليم المهني يقوم على التكامل بين الخبرة البشرية، والابتكار البيداغوجي، والذكاء الاصطناعي.</p>\
<p>وتتمثل رؤيتنا في أن تصبح APC Algérie GÉNÉRATION 3 منصة مرجعية في مجال الهندسة البيداغوجية، وتصميم الموارد التكوينية، والتحول الرقمي، من خلال تقديم حلول ذكية تساعد المكوّنين ومؤسسات التكوين على تطوير ممارساتهم، والارتقاء بجودة التكوين، وتعزيز تنمية الكفاءات.</p>\
<p>ونسعى إلى تطوير أدوات مبتكرة تُسهّل تصميم الوثائق التكوينية، وتدعم جودة الموارد البيداغوجية، وتواكب التحولات المتسارعة التي يشهدها قطاع التكوين والتعليم المهني.</p>\
<h2>شعارنا</h2>\
<p><em>نُعِدُّ اليوم كفاءات الغد، من خلال المقاربة بالكفاءات، والابتكار البيداغوجي، والذكاء الاصطناعي.</em></p>\
<p>APC Algérie GÉNÉRATION 3 ليست مجرد منصة رقمية، بل مبادرة وطنية تسعى إلى دعم وتطوير قطاع التكوين والتعليم المهني، من خلال الجمع بين الخبرة البشرية، والتميز البيداغوجي، وتقنيات الذكاء الاصطناعي، للمساهمة في بناء منظومة تكوينية حديثة، مبتكرة، ومستدامة.</p>\
<h2>إخلاء المسؤولية</h2>\
<p>تُشكّل المحتويات التي تُنتجها APC Algérie GÉNÉRATION 3 مساعدة في التصميم البيداغوجي. وهي مخصصة لمساعدة مهنيي التكوين في أنشطتهم التصميمية، دون أن تحل محل خبرتهم. يجب مراجعة كل مورد منتج وتكييفه والتحقق من صحته من قبل المستخدم قبل أي استخدام رسمي، لضمان مطابقته للمراجع والمتطلبات التنظيمية والسياق البيداغوجي المعني.</p>\
<h2>الإصدار</h2>\
<p><strong>APC Algérie GÉNÉRATION 3</strong><br>Formateur 2.0<br>الإصدار 3.0 — 2026</p>\
<h2>الإشعار القانوني</h2>\
<p>© 2026 APC Algérie GÉNÉRATION 3.<br>التصميم والتطوير : محمد رستم عزيز.<br>بمساهمة مجموعة APC Plus SBA.<br>جميع الحقوق محفوظة.</p>`;
        const aboutEN = `\
<h1>📚 About the Platform</h1>\
<p class="about-sub">APC Algeria GENERATION 3</p>\
<h2>Our Mission</h2>\
<p>APC Algeria GENERATION 3 is an intelligent digital platform dedicated to the design, generation, and development of pedagogical resources and training documents for the vocational training and education sector.</p>\
<p>Designed to support trainers, teachers, instructional engineers, training institutions, and all stakeholders in vocational training and education, the platform harnesses the power of artificial intelligence in service of the Competency-Based Approach (CBA / APC).</p>\
<p>It enables the rapid production of reliable, coherent pedagogical resources that comply with training standards, while reducing design time and improving quality.</p>\
<p>Our ambition is to support the modernization of vocational training and education by offering innovative, high-performance solutions adapted to field needs.</p>\
<h2>Our Objectives</h2>\
<ul>\
<li>Facilitate the implementation of the Competency-Based Approach (CBA / APC).</li>\
<li>Support trainers in the design of quality pedagogical resources.</li>\
<li>Optimize the preparation of pedagogical activities and training document production.</li>\
<li>Promote pedagogical innovation through artificial intelligence technologies.</li>\
<li>Support the digital transformation of the vocational training and education sector.</li>\
<li>Contribute to learners' skills development and continuous improvement of pedagogical practices.</li>\
</ul>\
<h2>Our Solutions</h2>\
<p>The platform offers a new generation of artificial intelligence tools to generate, design, and develop:</p>\
<ul>\
<li>Pedagogical scenarios.</li>\
<li>Training plans and programs.</li>\
<li>Learning sequences.</li>\
<li>Training documents.</li>\
<li>Course materials.</li>\
<li>Learning situations.</li>\
<li>Assessment situations.</li>\
<li>Practical work (TP).</li>\
<li>Tutorials (TD).</li>\
<li>Technical quizzes.</li>\
<li>Diagnostic, formative, and summative assessments.</li>\
<li>Professional presentations.</li>\
<li>Pedagogical guides.</li>\
<li>Evaluation rubrics.</li>\
<li>Administrative documents.</li>\
<li>Technical documents.</li>\
<li>Pedagogical resources compliant with the Competency-Based Approach requirements.</li>\
</ul>\
<p>Each document is developed according to the best practices of instructional engineering and meets the requirements of vocational training and education.</p>\
<h2>Our Commitment</h2>\
<p>The Competency-Based Approach is the pedagogical foundation of all tools developed within the platform.</p>\
<p>All generated resources are designed in accordance with:</p>\
<ul>\
<li>the principles of the Competency-Based Approach (CBA / APC);</li>\
<li>training standards and frameworks;</li>\
<li>the requirements of vocational training and education;</li>\
<li>the best practices of instructional engineering;</li>\
<li>the latest artificial intelligence technologies.</li>\
</ul>\
<p>Artificial intelligence is used as an assistive tool to support trainers in their work, improve the quality of pedagogical productions, and enhance skills development.</p>\
<h2>Designer and Developer</h2>\
<p>The APC Algeria GENERATION 3 platform was imagined, designed, and developed by <strong>Aziz Mohamed Rostom</strong>.</p>\
<p>A specialist in digital technologies, cybersecurity, artificial intelligence, and instructional engineering, he puts his expertise at the service of modernizing vocational training and education.</p>\
<p>His ambition is to offer innovative solutions that bridge digital technologies and pedagogical practices to sustainably improve training quality.</p>\
<h2>Groupe APC Plus SBA</h2>\
<p>The project is carried out with the contribution of the <strong>APC Plus SBA</strong> group (Approche Par Compétences Plus Sidi Bel Abbès).</p>\
<p>This group brings together training professionals, instructional engineers, and specialists committed to developing the Competency-Based Approach and continuously improving the quality of vocational training and education.</p>\
<p><strong>Group members</strong></p>\
<ul>\
<li><strong>Mohamed Rostom Aziz</strong> — Design, development and project coordination</li>\
<li><strong>Bouloum Boumediene</strong> — Pedagogical contribution</li>\
<li><strong>Faradji Said</strong> — Pedagogical contribution</li>\
<li><strong>Salah Manel</strong> — Pedagogical contribution</li>\
</ul>\
<h3>Their contribution</h3>\
<p>The members of Groupe APC Plus SBA actively contributed to the platform's development through:</p>\
<ul>\
<li>general pedagogical orientation of the project;</li>\
<li>identification of training institutions' needs;</li>\
<li>pedagogical validation of AI-generated content;</li>\
<li>integration of Competency-Based Approach principles;</li>\
<li>continuous improvement of pedagogical features;</li>\
<li>user experience optimization;</li>\
<li>advice and support in developing pedagogical tools;</li>\
<li>promotion of pedagogical innovation and digital transformation.</li>\
</ul>\
<p>This collaboration combines pedagogical expertise, technological innovation, and artificial intelligence to offer a high-performance environment meeting the needs of vocational training and education.</p>\
<h2>Pedagogical Support</h2>\
<p>The platform also benefits from the expertise and support of <strong>Mrs. Bach Chaouch Salima Zina</strong>, a pedagogy expert.</p>\
<p>Her guidance helps ensure the scientific and pedagogical quality of the resources produced, their coherence, and their compliance with the principles of the Competency-Based Approach.</p>\
<h2>Institutional Support</h2>\
<p>The APC Algeria GENERATION 3 project benefits from the support and accompaniment of <strong>Mr. Khalili Adel</strong>, Director of Training and Education for the wilaya of Sidi Bel Abbès.</p>\
<p>Through his trust, commitment, and support for pedagogical innovation, he accompanies the development of this initiative dedicated to modernizing vocational training and education through digital technologies and artificial intelligence.</p>\
<p>The APC Algeria GENERATION 3 team expresses its deep gratitude for his support, trust, and guidance in realizing this project.</p>\
<h2>Acknowledgements</h2>\
<p>The <strong>APC Algérie GÉNÉRATION 3</strong> team extends its sincere gratitude to <strong>Mr. Nedjari Mohamed</strong>, Deputy Director of Human Resources at the Ministry of Vocational Training and Education, for his interest in this initiative, as well as for his availability, valuable guidance, and continuous encouragement.</p>\
<p>We also express our appreciation to all senior officials, central directors, deputy directors, heads of departments, executives, and staff members of the Ministry of Vocational Training and Education for their dedication and ongoing commitment to the development and modernization of the vocational training and education sector.</p>\
<p>Finally, we extend our heartfelt thanks to everyone who has contributed to the growth and development of this platform through their trust, support, encouragement, or valuable contributions.</p>\
<h2>Our Vision</h2>\
<p>We are convinced that the future of vocational training and education lies in the complementarity between human expertise, pedagogical innovation, and artificial intelligence.</p>\
<p>Our vision is to make APC Algeria GENERATION 3 a reference platform for instructional design, training engineering, and digital transformation, by offering intelligent solutions that sustainably support trainers, training institutions, and sector professionals.</p>\
<p>We develop innovative tools that facilitate instructional design, improve the quality of training resources, and contribute to skills development in a constantly evolving environment.</p>\
<h2>Our Motto</h2>\
<p><em>Training today's skills for tomorrow, through the Competency-Based Approach, pedagogical innovation, and artificial intelligence.</em></p>\
<p>APC Algeria GENERATION 3 is much more than a digital platform: it is an initiative dedicated to modernizing vocational training and education, combining human expertise, pedagogical innovation, and artificial intelligence technologies to support professionals in designing quality pedagogical resources and developing tomorrow's skills.</p>\
<h2>Disclaimer</h2>\
<p>The content generated by APC Algeria GENERATION 3 is a pedagogical design aid. It is intended to assist training professionals in their design activities, without replacing their expertise. Any resource produced must be reviewed, adapted, and validated by the user before any official use, to ensure its compliance with standards, regulatory requirements, and the pedagogical context concerned.</p>\
<h2>Version</h2>\
<p><strong>APC Algeria GENERATION 3</strong><br>Formateur 2.0<br>Version 3.0 — 2026</p>\
<h2>Legal Notice</h2>\
<p>© 2026 APC Algeria GENERATION 3.<br>Design and development: Mohamed Rostom Aziz.<br>With the contribution of Groupe APC Plus SBA.<br>All rights reserved.</p>`;
        function renderAboutContent() {
            const el = document.getElementById('aboutContent');
            if (el) el.innerHTML = currentLang === 'ar' ? aboutAR : currentLang === 'en' ? aboutEN : aboutFR;
        }
        const THEMES = {
            blue: { name: "Dégradé bleu", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80",
                style: "linear-gradient(135deg, rgba(10,42,68,0.85), rgba(15,58,92,0.85))" },
            nature: { name: "Nature", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
                style: "linear-gradient(135deg, rgba(27,94,32,0.85), rgba(15,58,92,0.85))" },
            tech: { name: "Technologie", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80",
                style: "linear-gradient(135deg, rgba(13,17,23,0.9), rgba(0,119,204,0.8))" },
            archi: { name: "Architecture", url: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1920&q=80",
                style: "linear-gradient(135deg, rgba(30,30,30,0.85), rgba(60,60,60,0.85))" },
            elegant: { name: "Élégant", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
                style: "linear-gradient(135deg, rgba(120,80,50,0.85), rgba(200,150,100,0.85))" }
        };
        let currentTheme = 'blue';
        document.getElementById('themeSelector')?.addEventListener('click', function(e) {
            if (e.target.classList.contains('theme-btn')) {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentTheme = e.target.dataset.theme;
            }
        });
        function stripBOM(s) { return s ? s.replace(/^\ufeff/, '').trim() : ''; }
        function getOpenRouterKey() { return stripBOM(localStorage.getItem('or_key') || localStorage.getItem('openrouter_api_key') || ''); }
        function setOpenRouterKey(key) {
            const cleaned = key ? stripBOM(key) : '';
            if (cleaned && cleaned.length > 5) localStorage.setItem('or_key', cleaned);
            else { localStorage.removeItem('or_key'); localStorage.removeItem('openrouter_api_key'); }
            _clearDeadModels();
            updateApiBadge();
        }
        function getGroqKey() { return stripBOM(localStorage.getItem('gq_key') || localStorage.getItem('groq_key') || localStorage.getItem('groq_api_key') || ''); }
        function setGroqKey(key) {
            const cleaned = key ? stripBOM(key) : '';
            if (cleaned && cleaned.length > 5) localStorage.setItem('gq_key', cleaned);
            else { localStorage.removeItem('gq_key'); localStorage.removeItem('groq_key'); localStorage.removeItem('groq_api_key'); }
            _clearDeadModels();
            updateApiBadge();
        }
        function getGeminiKey() { return stripBOM(localStorage.getItem('gm_key') || localStorage.getItem('gemini_api_key') || ''); }
        function setGeminiKey(key) {
            const cleaned = key ? stripBOM(key) : '';
            if (cleaned && cleaned.length > 5) localStorage.setItem('gm_key', cleaned);
            else { localStorage.removeItem('gm_key'); localStorage.removeItem('gemini_api_key'); }
            _clearDeadModels();
            updateApiBadge();
        }
        // ===== Cooldown intelligent des modèles (v1.4.4) =====
        // Un modèle en 429/413/401... est marqué indisponible (deadUntil) → skip immédiat dans les boucles,
        // AUCUNE attente bloquante. Persisté dans localStorage avec clé JOURNALIÈRE (purge automatique à minuit).
        function _deadModelsKey() {
            var d = new Date();
            return 'axon_dead_' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        }
        function _modelDisplayName(modelKey) {
            try {
                var m = MODEL_MAP[modelKey];
                return m ? (m.provider + '/' + m.model) : modelKey;
            } catch (e) { return modelKey; }
        }
        function _markModelDead(modelKey, msg) {
            try {
                msg = msg || '';
                var key = _deadModelsKey();
                var deadMap = JSON.parse(localStorage.getItem(key) || '{}');
                var wasDead = deadMap[modelKey] && Date.now() < deadMap[modelKey];
                var now = Date.now();
                var eod = new Date(); eod.setHours(24, 0, 0, 0);
                var until, reason = 'unknown';
                if (/per\s*day|daily|TPD|tokens per day/i.test(msg)) {
                    until = eod.getTime() + 10 * 60 * 1000; reason = '429_daily';
                } else if (/limit:\s*0|quota exceeded|RESOURCE_EXHAUSTED/i.test(msg)) {
                    until = eod.getTime() + 10 * 60 * 1000; reason = '429_daily';
                } else if (msg.includes('429')) {
                    var m429 = msg.match(/retry\s+in\s+(\d+(?:\.\d+)?)\s*s/i);
                    until = m429 ? Math.min(now + (Math.max(parseInt(m429[1], 10) + 5, 10)) * 1000, now + 300 * 1000) : now + 300 * 1000;
                    reason = '429';
                } else if (/413|Request too large|Content Too Large/i.test(msg)) {
                    until = now + 60 * 1000; reason = '413';
                } else if (/401|403|unauthorized|forbidden/i.test(msg)) {
                    until = now + 15 * 60 * 1000; reason = '401/403';
                } else if (/400|404|not a valid model|no endpoints|model[^\n]*not found/i.test(msg)) {
                    until = eod.getTime() + 10 * 60 * 1000; reason = '400/404';
                } else if (/50[0-9]|52[0-9]|internal server|bad gateway|service unavailable/i.test(msg)) {
                    until = now + 3 * 60 * 1000; reason = '5xx';
                } else {
                    until = now + 5 * 60 * 1000; reason = 'autre';
                }
                until = Math.min(until, eod.getTime() + 10 * 60 * 1000);
                deadMap[modelKey] = { until: until, reason: reason, lastError: msg.substring(0, 300), lastFailure: now };
                localStorage.setItem(key, JSON.stringify(deadMap));
                if (!wasDead) {
                    var t = new Date(until);
                    var hh = ('0' + t.getHours()).slice(-2), mm = ('0' + t.getMinutes()).slice(-2);
                    console.warn('🚫 ' + _modelDisplayName(modelKey) + ' [' + reason + '] → skip jusqu\'à ' + hh + ':' + mm);
                    try { if (typeof showToast === 'function') showToast('🚫 ' + _modelDisplayName(modelKey) + ' indisponible (' + reason + ') → bascule auto, réessai ' + hh + ':' + mm); } catch (e2) {}
                }
            } catch (e) {}
        }
        function _clearDeadModels() {
            try { localStorage.removeItem(_deadModelsKey()); } catch (e) {}
        }
function updateApiBadge() {
    const badge = document.getElementById('apiBadge');
    if (!badge) return;
    const hasOR = getOpenRouterKey().length > 10;
    const hasGroq = getGroqKey().length > 10;
    const hasGemini = getGeminiKey().length > 5;
    if (hasOR || hasGroq || hasGemini) { badge.textContent = '✓'; badge.className = 'badge'; }
    else { badge.textContent = '●'; badge.className = 'badge missing'; }
}
function getEmailJSConfig() { try { return JSON.parse(localStorage.getItem('emailjs_config') || '{}'); } catch(e) { return {}; } }
function saveEmailJSConfig(pk, sid, tid, ak) { try { localStorage.setItem('emailjs_config', JSON.stringify({ publicKey: stripBOM(pk||'').trim(), serviceId: stripBOM(sid||'').trim(), templateId: stripBOM(tid||'').trim(), apiKey: stripBOM(ak||'').trim() })); } catch(e) {} }
function loadEmailJSConfigToUI() {
    var cfg = getEmailJSConfig();
    if (cfg.publicKey) { var el = document.getElementById('emailjsPublicKey'); if (el) el.value = cfg.publicKey; }
    if (cfg.serviceId) { var el = document.getElementById('emailjsServiceId'); if (el) el.value = cfg.serviceId; }
    if (cfg.templateId) { var el = document.getElementById('emailjsTemplateId'); if (el) el.value = cfg.templateId; }
    if (cfg.apiKey) { var el = document.getElementById('emailjsApiKey'); if (el) el.value = cfg.apiKey; }
}
function loadEmailJS(callback) {
    if (typeof emailjs !== 'undefined') { if (callback) callback(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = callback || function() {};
    s.onerror = function() { showToast('❌ Impossible de charger EmailJS.'); };
    document.head.appendChild(s);
}
function testEmailJS() {
    var cfg = getEmailJSConfig();
    var pk = stripBOM(document.getElementById('emailjsPublicKey').value).trim() || cfg.publicKey;
    var sid = stripBOM(document.getElementById('emailjsServiceId').value).trim() || cfg.serviceId;
    var tid = stripBOM(document.getElementById('emailjsTemplateId').value).trim() || cfg.templateId;
    if (!pk || !sid || !tid) { showToast('❌ Configurez Public Key, Service ID et Template ID dans Paramètres.'); return; }
    saveEmailJSConfig(pk, sid, tid);
    console.log('EmailJS test - pk:', pk.substring(0,6)+'...', 'sid:', sid, 'tid:', tid);
    var el = document.getElementById('emailjsTestResult');
    el.textContent = '⏳ Test...';
    loadEmailJS(function() {
        emailjs.init(pk);
        emailjs.send(sid, tid, { to_name: 'Test', from_name: 'Test', message: 'Test EmailJS', to_email: 'test@test.com', quiz_name: 'Test', code: 'ABC123', link: window.location.href, qr_url: '' })
            .then(function() { el.textContent = '✅ OK'; showToast('✅ EmailJS fonctionne ! Vérifiez votre boîte email.'); })
            .catch(function(err) { var msg = err.text || err.message || JSON.stringify(err); el.textContent = '❌ ' + msg; console.error('EmailJS test error:', err); showToast('❌ ' + msg); });
    });
}
function createEmailJSTemplate() {
    var cfg = getEmailJSConfig();
    var pk = stripBOM(document.getElementById('emailjsPublicKey')?.value || '').trim() || cfg.publicKey;
    var sid = stripBOM(document.getElementById('emailjsServiceId')?.value || '').trim() || cfg.serviceId;
    var ak = stripBOM(document.getElementById('emailjsApiKey')?.value || '').trim() || cfg.apiKey || '';
    if (!pk || !sid) { showToast('❌ Remplissez d\'abord Public Key et Service ID.'); return; }
    if (!ak) { showToast('❌ Collez votre clé API privée EmailJS (Account → API Keys).'); return; }
    var el = document.getElementById('emailjsTestResult');
    el.textContent = '⏳ Création du template...';
    var templateContent = 'Bonjour {{to_name}},<br><br>{{message}}<br><br><div style="background:#f5f5f5;padding:16px;border-radius:8px;text-align:center;margin:16px 0;"><strong style="font-size:18px;">Code d\'accès : {{code}}</strong><br><br><a href="{{link}}" style="background:#1B5E20;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">Accéder au quiz</a></div><br><small>Lien direct : {{link}}</small><br><br>{{from_name}}';
    var body = JSON.stringify({
        name: 'APC Algérie G3 - Distribution',
        subject: '🎯 Quiz : {{quiz_name}} - Code d\'accès',
        content: templateContent,
        toField: '{{to_email}}',
        fromName: '{{from_name}}',
        isCopyToSender: false,
        isIncludeReplyTo: false,
        variables: ['to_name', 'from_name', 'message', 'to_email', 'quiz_name', 'code', 'link', 'qr_url']
    });
    fetch('https://api.emailjs.com/api/v1.0/templates', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + ak, 'Content-Type': 'application/json' },
        body: body
    }).then(function(r) {
        if (!r.ok) return r.text().then(function(t) { throw new Error(t || 'Erreur ' + r.status); });
        return r.json();
    }).then(function(data) {
        var tid = data.template_id || data.id || '';
        if (tid) {
            document.getElementById('emailjsTemplateId').value = tid;
            saveEmailJSConfig(pk, sid, tid);
            el.textContent = '✅ Template créé : ' + tid;
            showToast('✅ Template EmailJS créé automatiquement !');
        } else {
            el.textContent = '✅ Template créé, mais ID introuvable. Vérifiez EmailJS.';
        }
    }).catch(function(err) {
        el.textContent = '❌ ' + (err.message || err);
        showToast('❌ Erreur : ' + (err.message || err));
        console.error('EmailJS template creation error:', err);
    });
}
        async function verifyKey(url, key) {
            try {
                const resp = await fetch(url, { headers: { 'Authorization': 'Bearer ' + key } });
                return resp.ok;
            } catch (e) { return false; }
        }
        const PROVIDERS = [
            { id: "openai", name: "OpenAI", icon: "🤖", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
                apiKeyName: "OPENAI_API_KEY", url: "https://api.openai.com/v1/chat/completions" },
            { id: "anthropic", name: "Anthropic Claude", icon: "⚡", models: ["claude-sonnet-4-6", "claude-opus-4-6",
                    "claude-haiku-4-5-20251001"
                ], apiKeyName: "ANTHROPIC_API_KEY", url: "https://api.anthropic.com/v1/messages" },
            { id: "gemini", name: "Google Gemini", icon: "✦", models: ["gemini-3.6-flash", "gemini-3.1-pro-preview",
                    "gemini-3.5-flash-lite"
                ], apiKeyName: "GEMINI_API_KEY", url: "https://generativelanguage.googleapis.com/v1beta/models" },
            { id: "openrouter", name: "OpenRouter", icon: "🔀", models: ["deepseek/deepseek-v3",
                    "deepseek/deepseek-r1", "meta-llama/llama-3.3-70b-instruct",
                    "nvidia/nemotron-3-super-120b-a12b:free", "nvidia/nemotron-nano-9b-v2:free",
                    "openai/gpt-oss-20b:free"
                ], apiKeyName: "OPENROUTER_API_KEY", url: "https://openrouter.ai/api/v1/chat/completions" },
            { id: "groq", name: "Groq", icon: "⚡", models: ["openai/gpt-oss-120b", "llama-3.1-8b-instant"
                ], apiKeyName: "GROQ_API_KEY", url: "https://api.groq.com/openai/v1/chat/completions" },
            { id: "ollama", name: "Ollama (local)", icon: "🏠", models: ["llama3", "mistral", "qwen2", "deepseek-r1",
                    "gemma"
                ], apiKeyName: "OLLAMA_URL", url: "http://localhost:11434/api/chat" },
        ];
        const MODEL_MAP = {
            'gemini-flash': { provider: 'gemini', model: 'gemini-3.6-flash' },
            'gemini-pro': { provider: 'gemini', model: 'gemini-3.1-pro-preview' },
            'groq-llama': { provider: 'groq', model: 'openai/gpt-oss-120b' },
            'groq-fast': { provider: 'groq', model: 'llama-3.1-8b-instant' },
            'groq-scout': { provider: 'groq', model: 'openai/gpt-oss-120b' },
            'deepseek-v3': { provider: 'openrouter', model: 'deepseek/deepseek-v3' },
            'deepseek-r1': { provider: 'openrouter', model: 'deepseek/deepseek-r1' },
            'llama3.3': { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct' },
            'llama3.3-free': { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct:free' },
            'llama32-free': { provider: 'openrouter', model: 'meta-llama/llama-3.2-3b-instruct:free' },
            'hermes405b-free': { provider: 'openrouter', model: 'nousresearch/hermes-3-llama-3.1-405b:free' },
            'deepseek-v3-free': { provider: 'openrouter', model: 'nvidia/nemotron-3-super-120b-a12b:free' },
            'owl-alpha': { provider: 'openrouter', model: 'nvidia/nemotron-nano-9b-v2:free' },
            'llama4-scout-free': { provider: 'openrouter', model: 'openai/gpt-oss-20b:free' },
        };
        const FALLBACK_ORDER = ['gemini-flash', 'groq-llama', 'gemini-pro', 'groq-fast', 'groq-scout', 'deepseek-v3-free', 'owl-alpha', 'llama4-scout-free'];
        function getApiKey(name) {
            if (name === 'OPENROUTER_API_KEY') return getOpenRouterKey();
            if (name === 'GROQ_API_KEY') return getGroqKey();
            if (name === 'GEMINI_API_KEY') return getGeminiKey();
            return localStorage.getItem('apikey_' + name) || '';
        }
        function markdownToHtml(md) {
            if (!md) return '';
            // Convert tab-separated tables (AI often outputs these instead of markdown pipes)
            md = md.replace(/(?:^|\n)([^\n]+(?:\t[^\t]+)+)\n((?:[^\n]+\t[^\n]+\n?)+)/g, (m, hdr, bdy) => {
                const hc = hdr.split('\t').map(c => c.trim());
                const rows = bdy.trim().split('\n').map(l => l.split('\t').map(c => c.trim()));
                if (hc.length < 2) return m;
                let tbl = '\n| ' + hc.join(' | ') + ' |\n|' + hc.map(() => '---').join('|') + '|\n';
                rows.forEach(r => {
                    while (r.length < hc.length) r.push('');
                    tbl += '| ' + r.map(c => c || '☐').join(' | ') + ' |\n';
                });
                return tbl;
            });
            let lines = md.split('\n');
            lines = lines.map(line => line.replace(/^(\d+\.\s+)/, '').replace(/^(\d+\.\d+\.\s+)/, ''));
            md = lines.join('\n');
            // Protéger les <br> de l'IA AVANT l'échappement : sinon ils deviennent du texte littéral
            // « &lt;br&gt; » dans les cellules de tableaux markdown (règles de lettrage, savoir-faire...).
            md = md.replace(/<\s*br\s*\/?>/gi, '@@BR@@');
            let html = md.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;'; return m; });
            html = html.replace(/^#### (.*$)/gm, '$1');
            html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
            html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
            html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
            html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
            html = html.replace(/^[\*\-] (.*$)/gm, '<li>$1</li>');
            html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
            html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
            html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
            html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
            const tableRegex = /(?:^|\n)(\|.*\|)\n(?:\|[-: |]+\|\n)?((?:\|.*\|\n?)+)/g;
            html = html.replace(tableRegex, (match, headerRow, bodyRows) => {
                const parseRow = (row) => row.split('|').filter(c => c.trim() !== '').map(c => c.trim());
                const headers = parseRow(headerRow);
                const rows = bodyRows.trim().split('\n').map(r => parseRow(r));
                let tableHtml = '<table><thead><tr>';
                headers.forEach(h => tableHtml += `<th>${h}</th>`);
                tableHtml += '</tr></thead><tbody>';
                rows.forEach(row => { tableHtml += '<tr>';
                    row.forEach(cell => tableHtml += `<td>${cell}</td>`);
                    tableHtml += '</tr>'; });
                tableHtml += '</tbody></table>';
                const parser = new DOMParser();
                const doc = parser.parseFromString(tableHtml, 'text/html');
                doc.querySelectorAll('td, th').forEach(cell => {
                    cell.innerHTML = cell.innerHTML.replace(/☐/g, '<input type="checkbox" class="apc-checkbox" onclick="this.checked=!this.checked">');
                    cell.innerHTML = cell.innerHTML.replace(/☑/g, '<input type="checkbox" class="apc-checkbox" checked onclick="return false">');
                });
                tableHtml = doc.body.innerHTML;
                return tableHtml;
            });
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(m, text, url) {
                url = url.replace(/javascript\s*:/gi, 'blocked:');
                return '<a href="' + url.replace(/"/g, '&quot;') + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
            });
            html = html.replace(/\n\n/g, '</p><p>');
            html = html.replace(/\n/g, '<br>');
            html = html.replace(/@@BR@@/g, '<br>');
            if (!html.startsWith('<')) html = '<p>' + html + '</p>';
            html = html.replace(/<p><\/p>/g, '');
            return html;
        }
        function sanitizeHtml(dirty) {
            var tmp = document.createElement('div');
            tmp.innerHTML = dirty;
            var scripts = tmp.querySelectorAll('script');
            scripts.forEach(function(s) { s.remove(); });
            var iframes = tmp.querySelectorAll('iframe');
            iframes.forEach(function(f) { f.remove(); });
            var all = tmp.querySelectorAll('*');
            all.forEach(function(el) {
                var attrs = el.attributes;
                for (var i = attrs.length - 1; i >= 0; i--) {
                    var name = attrs[i].name;
                    if (name.startsWith('on')) { el.removeAttribute(name); }
                }
            });
            var links = tmp.querySelectorAll('a[href*="javascript:"]');
            links.forEach(function(l) { l.href = '#'; });
            return tmp.innerHTML;
        }
        function _extractCompetences(text) {
            if (!text) return [];
            var seen = {}, result = [];
            var patterns = [
                /-\s*(?:compétence visée|competence visee|compétence|competence)\s*:\s*([^\n]+)/gi,
                /(?:compétence visée|competence visee|compétence|competence)\s*:\s*([^\n]+)/gi,
                /-\s*(?:target competency|competency)\s*:\s*([^\n]+)/gi,
                /(?:target competency|competency)\s*:\s*([^\n]+)/gi,
                /-\s*(?:الكفاءة المستهدفة|الكفاءة)\s*:\s*([^\n]+)/gi,
                /(?:الكفاءة المستهدفة|الكفاءة)\s*:\s*([^\n]+)/gi
            ];
            for (var pi = 0; pi < patterns.length; pi++) {
                var re = new RegExp(patterns[pi].source, 'gi'), m;
                while ((m = re.exec(text)) !== null) {
                    if (m[1] && m[1].trim().length > 3) {
                        var val = m[1].trim().replace(/^["'\-—\s\*_]+|["'\-—\s\*_]+$/g, '').replace(/\*+/g, '').replace(/_+/g, '');
                        if (val.length > 3 && val !== '—' && !seen[val]) { seen[val] = true; result.push(val); }
                    }
                }
            }
            var fallbackPatterns = [
                /(?:sur la compétence|sur le thème|sur le sujet|thème\s*:|sujet\s*:|au sujet de|concernant)\s+["“]?([^"”\n]{4,60})["”]?/gi,
                /(?:compétence|competence|skill)\s+["“]?([^"”\n]{4,60})["”]?/gi,
                /(?:about|regarding|concerning|topic\s*:)\s+["“]?([^"”\n]{4,60})["”]?/gi,
                /(?:حول|موضوع|بخصوص|الكفاءة)\s+["“]?([^"”\n]{4,60})["”]?/gi,
                /génère?\s+(?:un\s+)?(?:challenge|quiz|scénario|scenario|cours|séquence)\s+(?:sur|de|pour|about)\s+["“]?([^"”\n]{4,60})["”]?/gi,
                /cr[éeé]e?\s+(?:un\s+)?(?:challenge|quiz|scénario|scenario|cours)\s+(?:sur|de|pour|about)\s+["“]?([^"”\n]{4,60})["”]?/gi
            ];
            for (var fi = 0; fi < fallbackPatterns.length; fi++) {
                var fre = new RegExp(fallbackPatterns[fi].source, 'gi'), fm;
                while ((fm = fre.exec(text)) !== null) {
                    if (fm[1] && fm[1].trim().length > 3) {
                        var fv = fm[1].trim().replace(/^["'\-—\s\*_]+|["'\-—\s\*_]+$/g, '').replace(/\*+/g, '').replace(/_+/g, '');
                        if (fv.length > 3 && fv !== '—' && !seen[fv]) { seen[fv] = true; result.push(fv); }
                    }
                }
            }
            if (result.length === 0) { try { var g = JSON.parse(localStorage.getItem('gammaData') || '{}'); if (g && g.title && g.title.length > 3) result.push(g.title); } catch(e) {} }
            return result;
        }
        function _extractCompetence(text) { var list = _extractCompetences(text); return list.length > 0 ? list[list.length - 1] : ''; }
        function getFormContext() {
            const spec = document.getElementById('specialite')?.value?.trim() || 'Non spécifiée';
            const module = document.getElementById('module')?.value?.trim() || 'Non spécifié';
            const niveau = document.getElementById('niveau')?.value?.trim() || 'Non spécifié';
            const competence = document.getElementById('competence')?.value?.trim() || 'Non spécifiée';
            const duree = document.getElementById('duree')?.value?.trim() || 'Non spécifiée';
            const stagiaires = document.getElementById('stagiaires')?.value?.trim() || 'Non spécifié';
            const espace = document.getElementById('espace')?.value?.trim() || 'Non spécifié';
            const ressources = document.getElementById('ressources')?.value?.trim() || 'Non spécifiées';
            const contexte = document.getElementById('contexte')?.value?.trim() || 'Non spécifié';
            const difficultes = document.getElementById('difficultes')?.value?.trim() || 'Non spécifiées';
            const astMetier = document.getElementById('astMetier')?.value?.trim() || '';
            const astExtrait = document.getElementById('astExtrait')?.value?.trim() || '';
            let astText = '';
            if (astMetier || astExtrait) astText =
                `\n- **AST (Analyse de Situation de Travail)** :\n  - Métier : ${astMetier || 'Non spécifié'}\n  - Extrait : ${astExtrait || 'Non spécifié'}`;
            let optionsText = '';
            OPT_IDS.forEach(id => {
                if (!options[id]) return;
                const el = document.getElementById('opt_' + id);
                if (el && el.value.trim()) optionsText += `\n- ${t('prompt_consignes')} - ${t(OPTS.find(o=>o.id===id).k)} : ${el.value.trim()}`;
            });
            return `- Spécialité : ${spec}\n- Module : ${module}\n- Compétence visée : ${competence}\n- Niveau : ${niveau}\n- Durée : ${duree}\n- Nombre de stagiaires : ${stagiaires}\n- Espace pédagogique : ${espace}\n- Ressources : ${ressources}\n- Contexte professionnel : ${contexte}\n- Difficultés prévues : ${difficultes}${astText}${optionsText}`;
        }
        function t(k) { var v = (T[currentLang] && T[currentLang][k]) || T.fr[k] || k; if (window.__compat && window.__compat.isEnabled) v = window.__compat.replaceEmoji(v); return v; }
        let currentLang = localStorage.getItem('lang') || 'fr';
        if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');
        let isDark = localStorage.getItem('theme') === 'dark';
        let selectedExample = null;
        let options = { analyse: false, scenario: false, integration: false, evaluation: false, grille: false,
            criteres: false, indicateurs: false, conclusion: false, activities: true };
        let conversations = JSON.parse(localStorage.getItem('ai_conversations') || '[]');
        let currentConvId = null;
        let isGenerating = false;
        let abortController = null;
        let _abortReason = null;
        let currentMessages = [];
        let usedModel = '';
        const LOADING_MSGS = [
            "🎯 Analyse du contenu pédagogique...",
            "📚 Génération de la structure des slides...",
            "✍️ Rédaction du contenu pédagogique...",
            "⏳ Génération en cours (30-60 secondes)...",
            "🚀 Finalisation de la présentation..."
        ];
        let gammaData = null;
        let gammaIndex = 0;
        let gammaTheme = 'ocean';
        const GAMMA_THEMES = {
            ocean: { name: "Océan", bg: "linear-gradient(135deg, #0A2B44, #1E5A7A)", card: "#FFFFFF", text: "#152C3E", accent: "#0077CC", title: "#0A3A6B" },
            sunset: { name: "Coucher soleil", bg: "linear-gradient(135deg, #FF6B6B, #FFD93D)", card: "#FFFFFF", text: "#3D1C1C", accent: "#FF6B6B", title: "#5C2E2E" },
            midnight: { name: "Minuit", bg: "linear-gradient(135deg, #0B1120, #1C2A3E)", card: "#1C2A3E", text: "#E2E8F0", accent: "#38BDF8", title: "#38BDF8" },
            emerald: { name: "Émeraude", bg: "linear-gradient(135deg, #064E3B, #10B981)", card: "#FFFFFF", text: "#152C3E", accent: "#059669", title: "#064E3B" },
            royal: { name: "Royal", bg: "linear-gradient(135deg, #4C1D95, #8B5CF6)", card: "#FFFFFF", text: "#2D1B69", accent: "#7C3AED", title: "#4C1D95" },
            cyber: { name: "Cyber", bg: "linear-gradient(135deg, #0D0D0D, #1A1A2E)", card: "#1A1A2E", text: "#E0E0E0", accent: "#00FFAA", title: "#00FFAA" },
            slate: { name: "Ardoise", bg: "linear-gradient(135deg, #1E293B, #334155)", card: "#1E293B", text: "#F1F5F9", accent: "#60A5FA", title: "#93C5FD" },
            graphite: { name: "Graphite", bg: "linear-gradient(135deg, #111111, #2D2D2D)", card: "#1C1C1C", text: "#D4D4D4", accent: "#A855F7", title: "#C084FC" },
            obsidian: { name: "Obsidienne", bg: "linear-gradient(135deg, #0F0F0F, #1B1B2F)", card: "#161625", text: "#C4C4D0", accent: "#F97316", title: "#FB923C" }
        };
        let examples = null;
        const FALLBACK_EXAMPLES = [{ icon: "💻", name_fr: "Informatique APC", name_ar: "إعلام آلي APC",
                role_fr: "Vous êtes un expert mondial en ingénierie pédagogique, conception de programmes d'études, approche par compétences (APC), andragogie, pédagogie active, et vous vous spécialisez dans la préparation de leçons et de scénarios éducatifs pour la formation professionnelle algérienne conformément aux programmes officiels approuvés.",
                role_ar: "أنت خبير عالمي في الهندسة البيداغوجية، وتصميم المناهج الدراسية، والمقاربة بالكفاءات (APC)، وأندراغوجيا، والبيداغوجيا النشطة، وتتخصص في إعداد الدروس والسيناريوهات التعليمية للتكوين المهني الجزائري وفقاً للبرامج الرسمية المعتمدة.",
                mission_fr: "Construire un scénario pédagogique complet pour l'installation de Windows 11 selon l'APC Algérie.",
                mission_ar: "بناء سيناريو بيداغوجي كامل لتثبيت Windows 11 وفق APC الجزائر.",
                specialite_fr: "Techniques de l'Informatique", specialite_ar: "تقنيات الإعلام الآلي",
                module_fr: "Systèmes d'exploitation", module_ar: "أنظمة التشغيل",
                competence_fr: "Installer et configurer Windows 11 sur un poste de travail.",
                competence_ar: "تثبيت وضبط Windows 11 على محطة عمل.",
                niveau_fr: "Technicien Supérieur", niveau_ar: "تقني سامٍ", annee_fr: "1ère année", annee_ar: "السنة الأولى",
                duree_fr: "4 heures", duree_ar: "4 ساعات", stagiaires: "20",
                espace_fr: "Laboratoire informatique", espace_ar: "مخبر الإعلام الآلي",
                ressources_fr: "20 PC, Data Show, Clé USB bootable, ISO Windows 11",
                ressources_ar: "20 حاسوب، داتاشو، مفتاح USB، نسخة ISO Windows 11",
                contexte_fr: "Préparation des postes informatiques d'une entreprise avant leur mise en service.",
                contexte_ar: "تجهيز حواسيب المؤسسة قبل الشروع في العمل.",
                difficultes_fr: "Mauvaise maîtrise du BIOS, erreurs de partitionnement, gestion des pilotes",
                difficultes_ar: "ضعف في التعامل مع BIOS، أخطاء في تقسيم القرص، إدارة المشغلات",
                astMetier_fr: "Technicien Supérieur en Informatique (Administrateur systèmes et réseaux)",
                astMetier_ar: "تقني سامٍ في الإعلام الآلي (مسؤول الأنظمة والشبكات)",
                astExtrait_fr: "Installer et configurer un poste client Windows ; diagnostiquer les pannes matérielles ; sécuriser l'accès.",
                astExtrait_ar: "تثبيت وضبط محطة عميل Windows؛ تشخيص الأعطال المادية؛ تأمين الوصول."
            },
            { icon: "⚡", name_fr: "Soudure APC", name_ar: "لحام APC",
                role_fr: "Tu es un formateur expert en soudure industrielle et en APC.",
                role_ar: "أنت مكوِّن خبير في اللحام الصناعي وAPC.",
                mission_fr: "Construire une séance pratique sur la soudure à l'arc selon l'APC Algérie.",
                mission_ar: "بناء حصة تطبيقية حول اللحام بالقوس الكهربائي وفق APC الجزائر.",
                specialite_fr: "Soudure à l'arc électrique", specialite_ar: "اللحام بالقوس الكهربائي",
                module_fr: "Soudure à l'arc", module_ar: "اللحام بالقوس",
                competence_fr: "Réaliser une soudure bout à bout à l'arc sur acier carbone.",
                competence_ar: "إنجاز لحام وجهاً لوجه بالقوس الكهربائي على فولاذ كربوني.",
                niveau_fr: "Ouvrier Qualifié", niveau_ar: "عامل مؤهل", annee_fr: "1ère année", annee_ar: "السنة الأولى",
                duree_fr: "6 heures", duree_ar: "6 ساعات", stagiaires: "12",
                espace_fr: "Atelier de soudure", espace_ar: "ورشة اللحام",
                ressources_fr: "Poste à souder, électrodes E6013, masque, gants, tôles acier 5mm",
                ressources_ar: "منضدة لحام، أقطاب E6013، قناع، قفازات، صفائح فولاذ 5 مم",
                contexte_fr: "Fabrication d'une structure métallique pour un chantier naval.",
                contexte_ar: "تصنيع هيكل معدني لورشة بناء سفن.",
                difficultes_fr: "Mauvaise gestion de l'arc, défauts de pénétration, manque de stabilité",
                difficultes_ar: "سوء التحكم في القوس، عيوب في الاختراق، عدم الاستقرار",
                astMetier_fr: "Ouvrier Qualifié en soudure", astMetier_ar: "عامل مؤهل في اللحام",
                astExtrait_fr: "Réaliser des soudures bout à bout ; contrôler la qualité visuelle ; respecter les règles de sécurité.",
                astExtrait_ar: "إنجاز لحام وجهاً لوجه؛ مراقبة الجودة البصرية؛ احترام قواعد السلامة."
            },
            { icon: "🍳", name_fr: "Cuisine APC", name_ar: "طبخ APC",
                role_fr: "Tu es expert en restauration pour collectivités, formateur selon APC Algérie.",
                role_ar: "أنت خبير في التغذية الجماعية، مكوِّن وفق APC الجزائر.",
                mission_fr: "Générer l'analyse du métier et le scénario pour stagiaires débutants en Technicien Cuisine.",
                mission_ar: "توليد تحليل المهنة والسيناريو للمتربصين المبتدئين في تقني طبخ.",
                specialite_fr: "Cuisine", specialite_ar: "الطبخ",
                module_fr: "Cuisine et HACCP", module_ar: "الطبخ وHACCP",
                competence_fr: "Préparer un menu complet selon les normes HACCP pour 20 couverts.",
                competence_ar: "تحضير قائمة طعام كاملة وفق معايير HACCP لـ 20 شخصاً.",
                niveau_fr: "Technicien", niveau_ar: "تقني", annee_fr: "1ère année", annee_ar: "السنة الأولى",
                duree_fr: "8 heures", duree_ar: "8 ساعات", stagiaires: "15",
                espace_fr: "Cuisine pédagogique", espace_ar: "مطبخ بيداغوجي",
                ressources_fr: "Matériel de cuisine professionnel, denrées, fiches techniques, thermomètre",
                ressources_ar: "معدات مطبخ مهنية، مواد غذائية، بطاقات تقنية، ميزان حرارة",
                contexte_fr: "Service restauration collective dans un centre de formation.",
                contexte_ar: "خدمة مطعم جماعي في مركز تكوين.",
                difficultes_fr: "Gestion des temps, respect des températures, traçabilité HACCP",
                difficultes_ar: "إدارة الوقت، احترام درجات الحرارة، تتبع HACCP",
                astMetier_fr: "Technicien supérieur en restauration collective",
                astMetier_ar: "تقني سامٍ في التغذية الجماعية",
                astExtrait_fr: "Appliquer les principes HACCP, préparer des plats en respectant les DLC, organiser le poste de travail.",
                astExtrait_ar: "تطبيق مبادئ HACCP، تحضير الأطباق مع احترام تواريخ الصلاحية، تنظيم محطة العمل."
            },
            { icon: "📊", name_fr: "Comptabilité APC", name_ar: "محاسبة APC",
                role_fr: "Tu es un formateur expert en comptabilité et gestion.",
                role_ar: "أنت مكوِّن خبير في المحاسبة والتسيير.",
                mission_fr: "Construire un scénario d'apprentissage pour l'enregistrement comptable selon l'APC Algérie.",
                mission_ar: "بناء سيناريو تعليمي للتسجيل المحاسبي وفق APC الجزائر.",
                specialite_fr: "Comptabilité et Gestion", specialite_ar: "المحاسبة والتسيير",
                module_fr: "Comptabilité générale", module_ar: "المحاسبة العامة",
                competence_fr: "Enregistrer les opérations comptables courantes (achats, ventes, trésorerie).",
                competence_ar: "تسجيل العمليات المحاسبية الجارية (مشتريات، مبيعات، خزينة).",
                niveau_fr: "Technicien", niveau_ar: "تقني", annee_fr: "1ère année", annee_ar: "السنة الأولى",
                duree_fr: "5 heures", duree_ar: "5 ساعات", stagiaires: "18",
                espace_fr: "Salle informatique", espace_ar: "قاعة الإعلام الآلي",
                ressources_fr: "PC, logiciel SAGE, journaux, factures",
                ressources_ar: "حواسيب، برنامج SAGE، دفاتر يومية، فواتير",
                contexte_fr: "Tenue de la comptabilité d'une PME de négoce.",
                contexte_ar: "مسك محاسبة مؤسسة صغيرة تجارية.",
                difficultes_fr: "Code général de comptabilité, lettrage, rapprochement bancaire",
                difficultes_ar: "المخطط المحاسبي العام، الترخيم، التسوية البنكية",
                astMetier_fr: "Technicien comptable", astMetier_ar: "تقني محاسبة",
                astExtrait_fr: "Saisir les pièces comptables, lettrer les comptes, établir les balances.",
                astExtrait_ar: "إدخال الوثائق المحاسبية، ترخيم الحسابات، إعداد ميزان المراجعة."
            },
            { icon: "🌍", name_fr: "Anglais Pro APC", name_ar: "إنجليزية مهنية APC",
                role_fr: "Tu es un formateur expert en anglais professionnel.",
                role_ar: "أنت مكوِّن خبير في الإنجليزية المهنية.",
                mission_fr: "Construire un scénario pour l'accueil client en anglais selon l'APC Algérie.",
                mission_ar: "بناء سيناريو لاستقبال الزبون بالإنجليزية وفق APC الجزائر.",
                specialite_fr: "Anglais Professionnel", specialite_ar: "الإنجليزية المهنية",
                module_fr: "Anglais des affaires", module_ar: "إنجليزية الأعمال",
                competence_fr: "Accueillir et orienter un client étranger en anglais.",
                competence_ar: "استقبال وتوجيه زبون أجنبي بالإنجليزية.",
                niveau_fr: "Technicien", niveau_ar: "تقني", annee_fr: "2ème année", annee_ar: "السنة الثانية",
                duree_fr: "3 heures", duree_ar: "3 ساعات", stagiaires: "12",
                espace_fr: "Salle de langue", espace_ar: "قاعة اللغات",
                ressources_fr: "Audio, vidéo, fiches de dialogues, casques",
                ressources_ar: "صوتيات، فيديو، بطاقات حوار، سماعات",
                contexte_fr: "Réceptionniste dans un hôtel international.",
                contexte_ar: "موظف استقبال في فندق دولي.",
                difficultes_fr: "Prononciation, compréhension orale, formules de politesse",
                difficultes_ar: "النطق، الفهم الشفهي، عبارات المجاملة",
                astMetier_fr: "Technicien en tourisme et hôtellerie", astMetier_ar: "تقني في السياحة والفندقة",
                astExtrait_fr: "Accueillir des clients anglophones, répondre aux demandes d'orientation, gérer les réservations par téléphone.",
                astExtrait_ar: "استقبال زبائن ناطقين بالإنجليزية، الرد على طلبات التوجيه، إدارة الحجوزات هاتفياً."
            }
        ];
        if (!examples) examples = FALLBACK_EXAMPLES;
        async function loadExamplesFromDB() {
            try {
                if (typeof getPromptExamples === 'function') {
                    const dbExs = await getPromptExamples();
                    if (dbExs && dbExs.length > 0) {
                        examples = dbExs;
                        renderExamples();
                    }
                }
            } catch (e) { console.warn('loadExamplesFromDB fallback:', e); }
        }
        const QUICK_KEYS = ['quick_scenario', 'quick_eval', 'quick_fiche', 'quick_integration', 'quick_grille',
            'quick_cours'
        ];
        const OPTS = [{ id: 'analyse', k: 'opt_analyse' }, { id: 'scenario', k: 'opt_scenario' }, { id: 'integration',
                k: 'opt_integration' }, { id: 'evaluation', k: 'opt_evaluation' }, { id: 'grille', k: 'opt_grille' },
            { id: 'criteres', k: 'opt_criteres' }, { id: 'indicateurs', k: 'opt_indicateurs' },
            { id: 'conclusion', k: 'opt_conclusion' }, { id: 'activities', k: 'opt_activities' }
        ];
        const OPT_CKEYS = ['c1','c2','c3','c4','c5','c6','c7','c8','c9'];
        const OPT_IDS = ['analyse','scenario','integration','evaluation','grille','criteres','indicateurs','conclusion','activities'];
        async function callAI(messages, onChunk, onModelChange, forceProvider = null, forceModel = null) {
            // Règle anti-TPM (copiée du projet principal) : trim du sysPrompt 700+700 et de l'historique ~2500
            // caractères — sinon Groq free (TPM 6000-8000) répond HTTP 413 (Request too large) au-delà de ~8000 tokens
            var sysIdx = messages.findIndex(function(m) { return m.role === 'system'; });
            var sysMsg = sysIdx !== -1 ? messages.splice(sysIdx, 1)[0] : null;
            // Le glossaire officiel APC est placé en FIN de sysPrompt (assistant.js) : la troncature garde
            // 600 chars début + 2200 chars fin → la définition officielle (OC, OS, RMC...) survit toujours au trim.
            if (sysMsg && sysMsg.content.length > 3400) {
                sysMsg.content = sysMsg.content.substring(0, 600) + '\n\n[...]\n\n' + sysMsg.content.substring(sysMsg.content.length - 2200);
            }
            var lastU = messages[messages.length - 1];
            // Le prompt généré (générateur) fait ~3000 chars : il doit passer INTACT — la coupe ne s'applique
            // qu'au-delà de 8000 chars (pages de documents collés). Sinon le « Contexte de la formation »
            // (spécialité, module, compétence, durée...) est détruit → l'IA redemande les infos.
            if (lastU && lastU.role === 'user' && lastU.content.length > 8000) {
                lastU.content = lastU.content.substring(0, 3000) + '\n[...] (texte tronqué pour les quotas TPM gratuits) ' + lastU.content.substring(lastU.content.length - 5000);
            }
            var totalChars = sysMsg ? sysMsg.content.length : 0;
            var trimmed = [];
            for (var i = messages.length - 1; i >= 0; i--) {
                var added = totalChars + messages[i].content.length;
                if (added > 4800 && trimmed.length >= 1) break;
                totalChars = added;
                trimmed.unshift(messages[i]);
            }
            messages = sysMsg ? [sysMsg].concat(trimmed) : trimmed;
            console.log('📏 [trim] payload ≈ ' + totalChars + ' chars / ' + messages.length + ' messages (sysPrompt=' + (sysMsg ? sysMsg.content.length : 0) + ')');
            const provSel = forceProvider || document.getElementById('providerSelect')?.value || 'auto';
            const modelSel = forceModel || document.getElementById('modelSelect')?.value || 'auto';
            let selectedModelChoice = getSelectedModel();
            if (forceProvider === 'groq') {
                const groqModels = ['groq-llama', 'groq-fast', 'groq-scout'];
                for (const m of groqModels) {
                    try {
                        return await callModel(m, messages, onChunk, onModelChange);
                    } catch (e) {
                        console.warn(`Groq ${m} échoué:`, e);
                        continue;
                    }
                }
                throw new Error('Tous les modèles Groq ont échoué');
            }
            if (forceProvider === 'openrouter') {
                const orModels = ['llama3.3'];
                for (const m of orModels) {
                    try {
                        return await callModel(m, messages, onChunk, onModelChange);
                    } catch (e) {
                        console.warn(`OpenRouter ${m} échoué:`, e);
                        continue;
                    }
                }
                throw new Error('Tous les modèles OpenRouter ont échoué');
            }
            if (provSel === 'auto') {
                let modelsToTry = [];
                if (selectedModelChoice !== 'auto') {
                    modelsToTry = [selectedModelChoice];
                }
                for (const m of FALLBACK_ORDER) {
                    if (!modelsToTry.includes(m)) modelsToTry.push(m);
                }
                let lastError = null;
                for (const m of modelsToTry) {
                    try {
                        return await callModel(m, messages, onChunk, onModelChange);
                    } catch (e) {
                        lastError = e;
                        console.warn(`Modèle ${m} échoué:`, e.message);
                        continue;
                    }
                }
                throw new Error(`❌ Aucun fournisseur IA disponible. Vérifiez vos clés API (Gemini, Groq, OpenRouter) dans ⚙️ Paramètres. Dernière erreur: ${lastError?.message || 'inconnue'}`);
            }
            const p = PROVIDERS.find(x => x.id === provSel);
            if (!p) throw new Error('Fournisseur introuvable');
            const key = getApiKey(p.apiKeyName);
            if (!key && p.id !== 'ollama') throw new Error(t('no_api_key'));
            return await callProvider(p, modelSel || p.models[0], messages, onChunk);
        }
        function extractRetryDelay(errMsg) {
            if (/per\s*day|daily/i.test(errMsg)) return null;
            const m = errMsg.match(/(?:retry|again)\s+in\s+(\d+)(?:m(\d+))?/i);
            if (m) {
                let sec = parseInt(m[1]);
                if (m[2]) sec = sec * 60 + parseInt(m[2]);
                if (sec > 60) return null;
                return Math.min(sec + 2, 30);
            }
            return null;
        }
        async function callModel(modelKey, messages, onChunk, onModelChange) {
            const mapping = MODEL_MAP[modelKey];
            if (!mapping) throw new Error(`Modèle ${modelKey} non reconnu`);
            const provider = PROVIDERS.find(p => p.id === mapping.provider);
            if (!provider) throw new Error(`Fournisseur ${mapping.provider} introuvable`);
            const key = getApiKey(provider.apiKeyName);
            if (!key && provider.id !== 'ollama') {
                throw new Error(`Clé API manquante pour ${provider.name}`);
            }
            var deadMap = null;
            try { deadMap = JSON.parse(localStorage.getItem(_deadModelsKey()) || '{}'); } catch (e) { deadMap = {}; }
            if (deadMap && deadMap[modelKey] && deadMap[modelKey].until && Date.now() < deadMap[modelKey].until) {
                var dt = new Date(deadMap[modelKey].until);
                var dh = ('0' + dt.getHours()).slice(-2), dm = ('0' + dt.getMinutes()).slice(-2);
                throw new Error('Modèle ' + modelKey + ' en cooldown [' + (deadMap[modelKey].reason || '?') + '] → skip immédiat, réessai ' + dh + ':' + dm);
            }
            if (onModelChange) onModelChange(modelKey);
            console.log('🎯 [callAI] essai ' + modelKey + ' → ' + mapping.provider + '/' + mapping.model + ' ...');
            messages = messages.map(m => {
                const clean = { role: m.role, content: m.content };
                if (m.name) clean.name = m.name;
                return clean;
            });
            try {
                return await callProvider(provider, mapping.model, messages, onChunk);
            } catch (e) {
                if (e && (e.name === 'AbortError' || /aborted|AbortError|signal is aborted/i.test(e.message || ''))) {
                    if (_abortReason === 'connect-timeout' || _abortReason === 'stream-timeout') {
                        _abortReason = null;
                        _markModelDead(modelKey, 'timeout réseau (pas de réponse)');
                        throw new Error('Modèle ' + modelKey + ' : réponse trop lente (timeout réseau)');
                    }
                    _abortReason = null;
                    throw new Error('Génération interrompue (arrêt manuel)');
                }
                _markModelDead(modelKey, e.message || '');
                throw e;
            }
        }
        async function callProvider(p, model, messages, onChunk) {
            const localAbort = new AbortController();
            abortController = localAbort;
            const key = getApiKey(p.apiKeyName);
            let url = p.url,
                headers = { 'Content-Type': 'application/json' },
                body;
            // GARDE-FOU absolu anti-413 : payload total ≤ ~4800 chars (TPM gratuits Groq 6000-8000 / min)
            // Le dernier message utilisateur (prompt généré ~3000 chars) est TOUJOURS ajouté en entier :
            // seule l'HISTORIQUE est élaguée au-delà du budget. max_tokens Groq s'ajuste automatiquement
            // (input + max_tokens = constante) → aucun risque 413 supplémentaire.
            var _sysG = null, _nonSys = [];
            for (var _j = 0; _j < messages.length; _j++) {
                if (messages[_j].role === 'system') _sysG = messages[_j]; else _nonSys.push(messages[_j]);
            }
            for (var _l = 0; _l < _nonSys.length; _l++) {
                if (_nonSys[_l].content.length > 8000) {
                    _nonSys[_l] = { role: _nonSys[_l].role, content: _nonSys[_l].content.substring(0, 3000) + '\n[...] ' + _nonSys[_l].content.substring(_nonSys[_l].content.length - 5000) };
                }
            }
            var _tot2 = _sysG ? _sysG.content.length : 0, _cut2 = [];
            for (var _k = _nonSys.length - 1; _k >= 0; _k--) {
                var _a2 = _tot2 + _nonSys[_k].content.length;
                if (_a2 > 4800 && _cut2.length >= 1) break;
                _tot2 = _a2;
                _cut2.unshift(_nonSys[_k]);
            }
            messages = _sysG ? [_sysG].concat(_cut2) : _cut2;
            console.log('🛡️ [garde-fou] payload final ≈ ' + _tot2 + ' chars / ' + messages.length + ' messages');
            if (p.id === 'anthropic') {
                headers['x-api-key'] = key;
                headers['anthropic-version'] = '2023-06-01';
                headers['anthropic-beta'] = 'messages-2023-06-01';
                const sys = messages.find(m => m.role === 'system');
                const msgs = messages.filter(m => m.role !== 'system');
                body = JSON.stringify({ model, max_tokens: 8192, stream: true, system: sys ? sys.content : undefined,
                    messages: msgs });
            } else if (p.id === 'gemini') {
                url = `${p.url}/${model}:streamGenerateContent?key=${key}`;
                const sysMsg = messages.find(m => m.role === 'system');
                const contents = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ?
                        'model' : 'user', parts: [{ text: m.content }] }));
                const bodyObj = { contents, generationConfig: { maxOutputTokens: 8192 } };
                if (sysMsg) bodyObj.systemInstruction = { parts: [{ text: sysMsg.content }] };
                body = JSON.stringify(bodyObj);
            } else if (p.id === 'ollama') {
                body = JSON.stringify({ model, messages, stream: true });
            } else {
                if (key) headers['Authorization'] = 'Bearer ' + key;
                if (p.id === 'openrouter') {
                    headers['HTTP-Referer'] = 'https://apc-algerie.dz';
                    headers['X-Title'] = 'APC Algérie G3';
                }
                if (p.id === 'groq') {
                    headers['Authorization'] = 'Bearer ' + key;
                    // 413/429 Groq = input + max_tokens vs TPM gratuits (gpt-oss-120b: 8000, autres: 6000),
                    // avec fenêtre roulante : Used (déjà consommé sur 60 s) + Requested > limit → 429.
                    // max_tokens GÉNÉREUX (85 % de la limite − input) : les documents pédagogiques longs
                    // (grille 4×4 + critères + indicateurs + conclusion ≈ 15-20k chars) doivent passer ENTIERS.
                    // Requested = input + max_tokens ≈ 85 % TPM − 200 < TPM → jamais de 413 par taille ;
                    // si la fenêtre roulante Used est haute → 429 → cooldown intelligent + fallback (géré).
                    var _tpm = /llama-3\.1-8b-instant|openai\/gpt-oss-20b|qwen\/qwen3\.6-27b/.test(model) ? 6000 : 8000;
                    var _inTok = Math.ceil((_sysG ? _sysG.content.length : 0) / 3.2);
                    for (var _m = 0; _m < messages.length; _m++) if (messages[_m].role !== 'system') _inTok += Math.ceil(messages[_m].content.length / 3.2);
                    var _maxTok = Math.max(2048, Math.min(8192, Math.floor(_tpm * 0.85) - _inTok - 200));
                    console.log('🔧 [groq] TPM=' + _tpm + ' input≈' + _inTok + ' → max_tokens=' + _maxTok);
                    body = JSON.stringify({ model, messages, stream: true, max_tokens: _maxTok, temperature: 0.7 });
                } else {
                    body = JSON.stringify({ model, messages, stream: true, max_tokens: 8192, temperature: 0.7 });
                }
            }
            let timeoutId = null;
            const connectTimer = setTimeout(() => {
                console.warn('⏱️ [callAI] connexion lente (>25s, aucune réponse HTTP) → abandon du modèle ' + model);
                _abortReason = 'connect-timeout';
                localAbort.abort();
            }, 25000);
            try {
                const resp = await fetch(url, { method: 'POST', headers, body, signal: localAbort.signal });
                clearTimeout(connectTimer);
                if (!resp.ok) {
                    const errText = await resp.text();
                    if (p.id === 'groq' && (resp.status === 401 || resp.status === 429 || resp.status === 403)) {
                        throw new Error(`GROQ_ERROR: ${resp.status} - ${errText}`);
                    }
                    throw new Error(`HTTP ${resp.status}: ${errText}`);
                }
                timeoutId = setTimeout(() => {
                    console.warn('⏱️ [callAI] timeout 120s (stream) → abandon du modèle ' + model);
                    _abortReason = 'stream-timeout';
                    localAbort.abort();
                }, 120000);
                const reader = resp.body.getReader();
                const decoder = new TextDecoder();
                let buf = '', _firstChunk = true, _lastJson = null;
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buf += decoder.decode(value, { stream: true });
                    const lines = buf.split('\n');
                    buf = lines.pop();
                    for (const line of lines) {
                        if (!line.trim() || line === 'data: [DONE]') continue;
                        const data = line.startsWith('data: ') ? line.slice(6) : line;
                        try {
                            const j = JSON.parse(data);
                            _lastJson = j;
                            let chunk = '';
                            if (p.id === 'anthropic' && j.type === 'content_block_delta') chunk = j.delta?.text || '';
                            else if (p.id === 'gemini') {
                                const parts = j.candidates?.[0]?.content?.parts || [];
                                chunk = parts.filter(x => !x.thought).map(x => x.text || '').join('') || parts.map(x => x.text || '').join('');
                            } else if (p.id === 'ollama') chunk = j.message?.content || '';
                            else chunk = j.choices?.[0]?.delta?.content || '';
                            if (chunk) { if (_firstChunk) { _firstChunk = false; console.log('✅ [callAI] ' + model + ' : réponse reçue (stream)'); } onChunk(chunk); }
                        } catch (e) {}
                    }
                }
                if (_firstChunk) {
                    console.warn('⚠️ [callAI] ' + model + ' : réponse VIDE (aucun contenu) — dernier chunk: ' + JSON.stringify(_lastJson || null).slice(0, 600));
                    throw new Error('Réponse vide du modèle ' + model + ' (bloquée par le fournisseur)');
                }
                console.log('🏁 [callAI] ' + model + ' : stream terminé');
            } finally {
                clearTimeout(connectTimer);
                clearTimeout(timeoutId);
                if (abortController === localAbort) abortController = null;
            }
        }
        async function generateImage(prompt, fallback) {
            try {
                const base = prompt || "Educational concept illustration, modern style, clean, professional";
                const suffix = fallback ? ", simple educational illustration, flat design, clean" : ", educational illustration, clean, professional";
                const full = base + suffix;
                const encoded = encodeURIComponent(full);
                const seed = Math.floor(Math.random() * 99999);
                const model = fallback ? 'flux-schnell' : 'flux';
                return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&model=${model}&seed=${seed}&nolicense=1`;
            } catch (e) {
                return `https://image.pollinations.ai/prompt/${encodeURIComponent("Educational illustration, clean, professional")}?width=800&height=600&seed=${Math.floor(Math.random()*99999)}&nolicense=1`;
            }
        }
        function slideImagePrompt(s) {
            if (s.image_prompt) return s.image_prompt;
            const items = Array.isArray(s.content) ? s.content.filter(l => l && !l.startsWith('|')).join('. ') : '';
            const truncated = items.length > 500 ? items.slice(0, 500) : items;
            return truncated ? `${s.title}: ${truncated}` : `${s.title} - educational illustration`;
        }
        async function generateAllImages(slides) {
            const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
            return Promise.all(slides.map(async (s) => {
                for (let attempt = 0; attempt < 2; attempt++) {
                    const prompt = attempt === 0
                        ? slideImagePrompt(s)
                        : `${s.title} - simple educational illustration`;
                    try {
                        return await Promise.race([generateImage(prompt, attempt > 0), timeout(8000)]);
                    } catch (e) { continue; }
                }
                return '';
            }));
        }
        function updatePresoButtonLabel() {
            const el = document.getElementById('presoBtnLabel');
            if (el) el.innerHTML = t('btnGamma');
        }
        function restoreGammaData() {
            const saved = localStorage.getItem('gammaData');
            if (saved) {
                try { gammaData = JSON.parse(saved); } catch (e) { gammaData = null; }
            }
            updatePresoButtonLabel();
        }
        function generateGammaFromAssistant() {
            const lastAiMsg = [...currentMessages].reverse().find(m => m.role === 'assistant');
            if (lastAiMsg) {
                generateGammaPresentation(lastAiMsg.content);
            } else {
                showToast("💡 Envoyez d'abord un message à l'assistant IA, puis cliquez sur Générer présentation.");
            }
        }
        function generateQuizFromAssistant() {
            if (quizPublishedId) {
                try {
                    var existing = JSON.parse(localStorage.getItem('quiz_' + quizPublishedId));
                    if (existing) {
                        openQuizGenerator();
                        return;
                    }
                } catch(e) {}
                quizPublishedId = null;
            }
            const lastAiMsg = [...currentMessages].reverse().find(m => m.role === 'assistant');
            if (!lastAiMsg) {
                showToast("💡 Envoyez d'abord un message à l'assistant IA, puis cliquez sur Générer Quiz.");
                return;
            }
            gammaData = {
                slides: [{
                    title: "Contenu de l'assistant",
                    content: [lastAiMsg.content]
                }]
            };
            localStorage.setItem('gammaData', JSON.stringify(gammaData));
            openQuizGenerator();
        }
        async function generateGammaPresentation(promptText) {
            const subject = promptText || buildPrompt() || "Présentation APC Algérie Génération 3";
            const gKey = getGroqKey();
            if (!gKey || gKey.length < 10) {
                showToast("⚠️ Veuillez configurer une clé Groq dans les paramètres (⚡ Groq).");
                return;
            }
            const lang = currentLang === 'fr' ? 'français' : currentLang === 'en' ? 'english' : 'arabe';
            const prompt = `Tu es un expert en scénarios pédagogiques APC Algérie. Génère une présentation de 15 slides en JSON.

CONTEXTE PÉDAGOGIQUE :
${subject}

STRUCTURE DES SLIDES (obligatoire) :
1. Scénario Pédagogique APC — spécialité, module, niveau, compétence, durée, formateur, public
2. Analyse APC — tableau | Savoirs | Savoir-faire | Savoir-être |
3. Ressources — tableau | Internes | Externes |
4. Situation Professionnelle de Référence — contexte métier, mission, tâches
5. Phase 1 Contextualisation — objectif, activité formateur, activité stagiaires, production, durée
6. Phase 2 Déstabilisation — situation-problème, questions, activités, difficultés, durée
7. Phase 3 Construction Partie 1 — 3 activités avec étapes
8. Phase 3 Construction Partie 2 — 2 activités, méthodes pédagogiques, durée
9. Phase 4 Intégration — situation d'intégration, mission, 7 tâches, production, durée
10. Phase 5 Transfert — nouvelle situation, tâches stagiaire, durée
11. Évaluation Par Compétences — tâche, conditions, type
12. Critères de Performance — 10 critères observables
13. Grille Critérielle 4×4 — tableau | Critères | Non maîtrisé | En cours | Maîtrisé | Expert |
14. Indicateurs de Réussite — 10 indicateurs
15. Conclusion Pédagogique — synthèse des acquis, compétences, perspective

FORMAT JSON ATTENDU : {"slides":[{"title":"Titre","image_prompt":"prompt pour image illustrative","content":["ligne1","ligne2","| tableau |"]}]}
- Les lignes commençant et finissant par | seront rendues en tableau
- Contenu CONCRET et adapté au contexte fourni
- Génère en ${lang}
- SORTIE : UNIQUEMENT le JSON valide, sans texte avant/après`
            gammaData = null;
            localStorage.removeItem('gammaData');
            showToast("Génération de la présentation en cours...");
            const msgs = [{ role: 'system', content: prompt }];
            let fullResponse = '';
            const startTime = Date.now();
            let msgIndex = 0;
            const msgInterval = setInterval(() => {
                const el = document.getElementById('loadingText');
                if (el) { msgIndex = (msgIndex + 1) % LOADING_MSGS.length;
                    const elapsed = Math.round((Date.now() - startTime) / 1000);
                    const sub = document.getElementById('loadingSub');
                    if (sub) {
                        var subMsg = `⏱ ${elapsed}s écoulées — Génération en cours`;
                        if (window.__compat && window.__compat.isEnabled) sub.innerHTML = window.__compat.replaceEmoji(subMsg);
                        else sub.textContent = subMsg;
                    }
                    var loadMsg = LOADING_MSGS[msgIndex];
                    if (window.__compat && window.__compat.isEnabled) el.innerHTML = window.__compat.replaceEmoji(loadMsg);
                    else el.textContent = loadMsg; }
            }, 2800);
            try {
                document.getElementById('gammaModal').classList.add('open');
                renderGammaSlides();
                await callAI(msgs, (chunk) => { fullResponse += chunk; }, (modelId) => {
                    const loadingSub = document.getElementById('loadingSub');
                    const m = MODEL_MAP[modelId];
                    if (loadingSub && m) { var lt = `⏱ ${Math.round((Date.now() - startTime) / 1000)}s écoulées — Modèle ${m.model}`; if (window.__compat && window.__compat.isEnabled) loadingSub.innerHTML = window.__compat.replaceEmoji(lt); else loadingSub.textContent = lt; }
                }, 'groq', 'groq-llama');
                clearInterval(msgInterval);
                let jsonStr = fullResponse.trim();
                jsonStr = jsonStr.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
                try {
                    gammaData = JSON.parse(jsonStr);
                } catch (e) {
                    const start = jsonStr.indexOf('{');
                    if (start === -1) throw new Error("Le modèle n'a pas retourné de JSON valide.");
                    let depth = 0, end = -1;
                    for (let i = start; i < jsonStr.length; i++) {
                        if (jsonStr[i] === '{') depth++;
                        else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
                    }
                    let candidate = end !== -1 ? jsonStr.slice(start, end + 1) : null;
                    if (!candidate) {
                        // JSON TRONQUÉ (max_tokens atteint) : réparation — on ferme les { et [ restants
                        candidate = jsonStr.slice(start).replace(/,\s*([}\]])/g, '$1').replace(/,\s*$/, '');
                        let dO = 0, dA = 0;
                        for (let i = 0; i < candidate.length; i++) {
                            if (candidate[i] === '{') dO++;
                            else if (candidate[i] === '}') dO--;
                            else if (candidate[i] === '[') dA++;
                            else if (candidate[i] === ']') dA--;
                        }
                        candidate = candidate + ']'.repeat(Math.max(dA, 0)) + '}'.repeat(Math.max(dO, 0));
                    }
                    candidate = candidate.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
                    try {
                        gammaData = JSON.parse(candidate);
                    } catch (e2) {
                        console.warn('⚠️ [gamma] JSON irréparable — réponse brute (600):', fullResponse.slice(0, 600));
                        throw new Error("Le modèle n'a pas retourné de JSON valide.");
                    }
                }
                gammaIndex = 0;
                console.log('gammaData keys:', Object.keys(gammaData), JSON.stringify(gammaData).slice(0, 300));
                if (!gammaData.slides) {
                    for (const key of Object.keys(gammaData)) {
                        const v = gammaData[key];
                        if (Array.isArray(v) && v.length > 0 && v[0].title) {
                            gammaData = { slides: v };
                            break;
                        }
                        if (typeof v === 'object' && v !== null && v.slides) {
                            gammaData = { slides: v.slides };
                            break;
                        }
                    }
                }
                if (!gammaData.slides) throw new Error("Structure JSON invalide: slides[] introuvable");
                gammaData.slides.forEach(s => {
                    const content = [];
                    for (const [key, val] of Object.entries(s)) {
                        if (['title', 'image_url', 'image_prompt'].includes(key)) continue;
                        if (typeof val === 'string' && val.trim()) content.push(val.trim());
                        else if (Array.isArray(val)) val.forEach(v => content.push(String(v)));
                        else if (typeof val === 'object' && val !== null) {
                            Object.values(val).forEach(v => {
                                const str = Array.isArray(v) ? v.join('\n') : String(v);
                                if (str.trim()) content.push(str.trim());
                            });
                        }
                    }
                    s.content = content.length > 0 ? content : [];
                });
                localStorage.setItem('gammaData', JSON.stringify(gammaData));
                renderGammaSlides();
                showToast("✅ Présentation générée ! Les images se chargent...");
                generateAllImages(gammaData.slides).then(urls => {
                    urls.forEach((url, i) => { if (gammaData?.slides[i]) gammaData.slides[i].image_url = url; });
                    urls.forEach((url, i) => {
                        // v1.8.6 : on n'enregistre dans la banque que les images réellement
                        // générées par l'IA (les vignettes Commons ne polluent plus la banque)
                        if (url && gammaData?.slides[i] && gammaData.slides[i].image_source !== 'commons') {
                            saveGeneratedImage({
                                prompt: gammaData.slides[i].image_prompt || gammaData.slides[i].title || '',
                                image_url: url,
                                visibility: 'public',
                                tags: ['presentation', gammaData.slides[i].title || '']
                            });
                        }
                    });
                    // v1.8.6 : persistance des URLs arrivées pendant la file d'attente
                    try { if (gammaData) localStorage.setItem('gammaData', JSON.stringify(gammaData)); } catch (e) {}
                    const loadingEl = document.getElementById('loadingText');
                    if (loadingEl) { var li = "🖼️ Images prêtes !"; if (window.__compat && window.__compat.isEnabled) loadingEl.innerHTML = window.__compat.replaceEmoji(li); else loadingEl.textContent = li; }
                    renderGammaSlides();
                });
            } catch (err) {
                clearInterval(msgInterval);
                const el = document.getElementById('loadingText');
                const sub = document.getElementById('loadingSub');
                // Affiche l'ERREUR RÉELLE (clé manquante, 404 modèle, 429 quota...) au lieu du
                // message générique « quotas épuisés » qui masquait le vrai diagnostic.
                const realErr = (err && err.message) ? String(err.message) : String(err || 'Erreur inconnue');
                if (el) { var err1 = "❌ Échec de la génération de la présentation"; if (window.__compat && window.__compat.isEnabled) el.innerHTML = window.__compat.replaceEmoji(err1); else el.textContent = err1; }
                if (sub) { var err2 = realErr + (/(429|per\s*day|daily|quota|limit|épuis|exhausted|RESOURCE_EXHAUSTED)/i.test(realErr) ? " — Quotas gratuits épuisés (réinitialisation ~24h) ou ajoutez une clé API payante dans ⚙️ Paramètres." : ''); if (window.__compat && window.__compat.isEnabled) sub.innerHTML = window.__compat.replaceEmoji(err2); else sub.textContent = err2; }
                console.error(err);
            }
        }
        function setGammaTheme(key) {
            gammaTheme = key;
            document.querySelectorAll('#gammaThemeBar .theme-btn').forEach(b => b.classList.remove('active'));
            const btn = document.querySelector(`#gammaThemeBar .theme-btn[data-theme="${key}"]`);
            if (btn) btn.classList.add('active');
            if (gammaData) renderGammaSlides();
        }
        function renderSlideContent(items, textColor) {
            if (!items) items = [];
            if (typeof items === 'string') items = items.split('\n').filter(Boolean);
            if (!Array.isArray(items)) items = [];
            let html = '';
            let tableRows = [];
            function esc(t) { return t.replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
            function inlineMd(t) {
                return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code style="background:'+textColor+'18;padding:1px 4px;border-radius:3px;font-size:0.85em;">$1</code>');
            }
            function flushTable() {
                if (tableRows.length === 0) return;
                function replaceCheckboxes(cell) {
                    return cell.replace(/☐/g, '<input type="checkbox" class="apc-checkbox" onclick="this.checked=!this.checked">').replace(/☑/g, '<input type="checkbox" class="apc-checkbox" checked onclick="return false">');
                }
                const headerCells = tableRows[0].split('|').filter(c => c.trim()).map(c => c.trim());
                let dataStart = 1;
                if (tableRows.length > 1 && tableRows[1].includes('---')) dataStart = 2;
                html += '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;margin:6px 0;">';
                if (headerCells.length > 0) {
                    html += '<thead><tr>';
                    headerCells.forEach(h => {
                        html += `<th style="border:1px solid ${textColor}44;padding:4px 6px;background:${textColor}15;font-weight:600;text-align:left;font-size:0.78rem;">${replaceCheckboxes(esc(h))}</th>`;
                    });
                    html += '</tr></thead>';
                }
                html += '<tbody>';
                for (let i = dataStart; i < tableRows.length; i++) {
                    const cells = tableRows[i].split('|').filter(c => c.trim()).map(c => c.trim());
                    html += '<tr>';
                    cells.forEach(c => {
                        html += `<td style="border:1px solid ${textColor}44;padding:4px 6px;font-size:0.78rem;">${replaceCheckboxes(esc(c))}</td>`;
                    });
                    html += '</tr>';
                }
                html += '</tbody></table>';
                tableRows = [];
            }
            items.forEach(p => {
                const lines = p.split('\n');
                lines.forEach(line => {
                    const trimmed = line.trim();
                    if (!trimmed) return;
                    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                        tableRows.push(line);
                    } else {
                        flushTable();
                        if (/^#{1,4}\s/.test(trimmed)) {
                            var level = trimmed.match(/^#+/)[0].length;
                            var title = inlineMd(esc(trimmed.replace(/^#+\s*/, '')));
                            if (/phase\s*\d|Phase\s*\d|PHASE\s*\d|المرحلة/i.test(trimmed)) {
                                var accent = textColor;
                                html += '<div style="color:'+accent+';font-weight:700;font-size:'+(level<=2?'1.05rem':'0.95rem')+';padding:8px 0 4px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid '+accent+'44;margin-bottom:6px;">'+title+'</div>';
                            } else if (level <= 2) {
                                html += '<div style="color:'+textColor+';font-weight:700;font-size:1rem;padding:6px 0 2px;">'+title+'</div>';
                            } else {
                                html += '<div style="color:'+textColor+';font-weight:600;font-size:0.92rem;padding:5px 0 2px;">'+title+'</div>';
                            }
                        } else if (/^---/.test(trimmed)) {
                            html += '<hr style="border:none;border-top:1px solid '+textColor+'33;margin:8px 0;">';
                        } else if (/^\[\s*x?\s*\]\s*/i.test(trimmed)) {
                            var checked = /\[\s*x\s*\]/i.test(trimmed);
                            var label = esc(trimmed.replace(/\[\s*x?\s*\]\s*/i, ''));
                            html += '<div style="padding:2px 0;font-size:0.88rem;"><input type="checkbox" '+(checked?'checked':'')+' onclick="this.checked=!this.checked" style="margin-right:6px;">'+inlineMd(label)+'</div>';
                        } else {
                            html += '<div style="color:'+textColor+';padding:3px 0;font-size:0.88rem;line-height:1.55;">'+inlineMd(esc(trimmed))+'</div>';
                        }
                    }
                });
            });
            flushTable();
            return html;
        }
        function renderGammaSlides() {
            const container = document.getElementById('gammaSlides');
            if (!gammaData || !gammaData.slides || gammaData.slides.length === 0) {
                container.innerHTML = `
                    <div class="preso-loading">
                        <div class="loading-brain">🧠</div>
                        <div class="spinner"></div>
                        <div class="loading-text" id="loadingText">🎯 Analyse du contenu (v2)...</div>
                        <div class="loading-sub" id="loadingSub">Génération en cours</div>
                        <div class="loading-bar"><div class="loading-bar-fill"></div></div>
                        <div class="loading-tip">💡 Chaque slide est conçue avec soin pour un apprentissage optimal</div>
                    </div>`;
                return;
            }
            const t = GAMMA_THEMES[gammaTheme] || GAMMA_THEMES.ocean;
            const slides = gammaData.slides;
            const total = slides.length;
            document.getElementById('gammaCounter').textContent = `${gammaIndex+1} / ${total}`;
            document.getElementById('gammaPrev').style.display = gammaIndex === 0 ? 'none' : 'inline-flex';
            document.getElementById('gammaNext').style.display = gammaIndex === total - 1 ? 'none' : 'inline-flex';
            let html = '';
            slides.forEach((s, idx) => {
                const isCurrent = idx === gammaIndex;
                const hasImg = !!s.image_url;
                const isLeft = idx % 2 === 0;
                const imageHtml = hasImg
                    ? `<div class="gamma-img-wrap">
                        <img class="slide-image" src="${(typeof apcDisplayUrl === 'function' ? apcDisplayUrl(s.image_url) : s.image_url)}" alt="${s.title}" loading="lazy">
                        <div class="gamma-img-placeholder">🖼️</div>
                        <div class="gamma-img-err">
                             <span>⚠️ Images momentanément indisponibles</span>
                             <button class="btn btn-secondary" onclick="retrySlideImage(${idx})" style="font-size:11px;padding:4px 12px;">🔄 Réessayer</button>
                             <button class="btn btn-secondary" onclick="openImageSearch(${idx})" style="font-size:11px;padding:4px 12px;">🌐 Chercher sur le web</button>
                        </div>
                       </div>`
                     : `<div class="gamma-img-wrap no-img">
                         <span>Aucune image</span>
                         <button class="gamma-img-search btn-icon-sm" data-idx="${idx}" onclick="openImageSearch(${idx})" title="Rechercher une image sur le web">🌐</button>
                         <button class="gamma-img-search btn-icon-sm" data-idx="${idx}" onclick="gammaIndex=${idx};openGammaImageBank()" title="Choisir depuis la banque d'images">🖼️</button>
                        </div>`;
                html += `
                    <div class="preso-slide" data-idx="${idx}" style="${isCurrent ? '' : 'display:none;'}background:${t.card};color:${t.text};border-color:${t.accent}33;">
                        <div style="background:${t.bg};margin:-24px -28px 16px;padding:16px 24px;border-radius:16px 16px 0 0;">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span style="background:rgba(255,255,255,0.2);color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${idx+1}</span>
                                <h3 style="color:#fff;margin:0;border:none;padding:0;font-size:1.15rem;">${s.title}</h3>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:${hasImg ? '1fr 1fr' : '1fr'};gap:16px;align-items:start;">
                            <div style="margin:0;padding:0;">
                                ${renderSlideContent(s.content, t.text)}
                            </div>
                            ${hasImg ? imageHtml : ''}
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
            container.querySelectorAll('.gamma-img-wrap .slide-image').forEach(img => {
                img.onload = () => { img.style.opacity = '1'; img.parentElement.classList.add('loaded'); };
                img.onerror = () => { img.parentElement.classList.add('loaded'); img.parentElement.classList.add('error'); };
                if (img.complete && img.naturalWidth > 0) {
                    img.style.opacity = '1';
                    img.parentElement.classList.add('loaded');
                }
            });
            const searchBox = document.getElementById('gammaImageSearch');
            if (searchBox) searchBox.style.display = 'none';
            ensureGammaBankUI();
        }
        document.getElementById('gammaPrev')?.addEventListener('click', () => {
            if (gammaIndex > 0) { gammaIndex--;
                renderGammaSlides(); }
        });
        document.getElementById('gammaNext')?.addEventListener('click', () => {
            if (gammaData && gammaIndex < gammaData.slides.length - 1) { gammaIndex++;
                renderGammaSlides(); }
        });
        document.getElementById('gammaModalClose')?.addEventListener('click', () => {
            document.getElementById('gammaModal').classList.remove('open');
        });
        let searchSlideIdx = -1;
        function openImageSearch(idx) {
            searchSlideIdx = idx;
            const box = document.getElementById('gammaImageSearch');
            const input = document.getElementById('gammaSearchInput');
            const results = document.getElementById('gammaSearchResults');
            if (!box) return;
            box.style.display = 'block';
            input.value = gammaData.slides[idx].title;
            input.focus();
            results.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:12px;">🔍 Tapez votre recherche</div>';
        }
        async function searchWebImages() {
            const input = document.getElementById('gammaSearchInput');
            const results = document.getElementById('gammaSearchResults');
            const query = input.value.trim();
            if (!query) return;
            results.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:12px;"><div class="spinner" style="width:20px;height:20px;margin:0 auto 8px;"></div>Recherche en cours...</div>';
            try {
                const searchTerm = encodeURIComponent(query);
                const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url|mime&iiurlwidth=400&format=json&origin=*`;
                const resp = await fetch(commonsUrl);
                const data = await resp.json();
                const pages = data.query ? Object.values(data.query.pages) : [];
                const imgUrls = [];
                for (const p of pages) {
                    const mime = p.imageinfo && p.imageinfo[0] ? (p.imageinfo[0].mime || '') : '';
                    const url = p.imageinfo && p.imageinfo[0] ? (p.imageinfo[0].thumburl || p.imageinfo[0].url) : '';
                    if (url && !mime.includes('svg') && !mime.includes('tiff') && !mime.includes('xcf')) {
                        imgUrls.push(url);
                    }
                }
                if (imgUrls.length === 0) throw new Error("Aucune image trouvée");
                results.innerHTML = imgUrls.map((u, i) =>
                    `<img src="${u}" class="search-result-img" onclick="setSearchImage('${u.replace(/'/g, "\\'")}')" loading="lazy">`
                ).join('');
            } catch (e) {
                results.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:12px;">❌ ${e.message}. <button class="btn" onclick="searchWebImages()" style="margin-top:8px;">Réessayer</button></div>`;
            }
        }
        function setSearchImage(url) {
            if (searchSlideIdx < 0 || !gammaData) return;
            gammaData.slides[searchSlideIdx].image_url = url;
            document.getElementById('gammaImageSearch').style.display = 'none';
            renderGammaSlides();
        }
        function ensureGammaBankUI() {
            if (document.getElementById('gammaImageBank')) return;
            var exportBar = document.querySelector('.preso-export');
            if (!exportBar) return;
            var btn = document.createElement('button');
            btn.className = 'btn btn-secondary';
            btn.innerHTML = window.__compat && window.__compat.isEnabled ? window.__compat.replaceEmoji('🖼️ Banque d\'images') : '🖼️ Banque d\'images';
            btn.onclick = openGammaImageBank;
            btn.style.cssText = 'font-size:12px;';
            exportBar.appendChild(btn);
            var panel = document.createElement('div');
            panel.className = 'gamma-image-search';
            panel.id = 'gammaImageBank';
            panel.innerHTML = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">'
                + '<span style="font-weight:600;font-size:13px;">🖼️ Banque d\'images partagées</span>'
                + '<button class="btn-icon-sm" onclick="document.getElementById(\'gammaImageBank\').style.display=\'none\'" style="position:static;margin-left:auto;background:var(--border);color:var(--text);">✕</button>'
                + '</div>'
                + '<div class="gamma-search-results" id="gammaBankResults" style="max-height:300px;"><div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:20px;">Chargement...</div></div>';
            var content = document.getElementById('gammaContent');
            if (content) content.appendChild(panel);
        }
        function openGammaImageBank() {
            ensureGammaBankUI();
            document.getElementById('gammaImageSearch').style.display = 'none';
            var panel = document.getElementById('gammaImageBank');
            panel.style.display = 'block';
            loadGammaImageBank();
        }
        async function loadGammaImageBank() {
            var container = document.getElementById('gammaBankResults');
            if (!container) return;
            var data = await getGeneratedImages({ limit: 100 });
            if (!data || data.length === 0) {
                container.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:20px;">📭 Aucune image dans la banque. Générez d\'abord une présentation.</div>';
                return;
            }
            container.innerHTML = '';
            data.forEach(function(img) {
                var div = document.createElement('div');
                div.className = 'search-result-img';
                div.style.cssText = 'cursor:pointer;border:2px solid transparent;border-radius:8px;overflow:hidden;transition:all .15s;';
                var el = document.createElement('img');
                el.src = img.image_url;
                el.style.cssText = 'width:100%;aspect-ratio:1;object-fit:cover;display:block;';
                el.onerror = function() { this.style.display = 'none'; };
                el.title = img.prompt || '';
                div.appendChild(el);
                div.onclick = function() { useBankImage(img.image_url); };
                div.onmouseenter = function() { this.style.borderColor = 'var(--accent)'; };
                div.onmouseleave = function() { this.style.borderColor = 'transparent'; };
                container.appendChild(div);
            });
        }
        function useBankImage(url) {
            if (!gammaData || gammaIndex < 0 || !gammaData.slides[gammaIndex]) return;
            gammaData.slides[gammaIndex].image_url = url;
            document.getElementById('gammaImageBank').style.display = 'none';
            renderGammaSlides();
            showToast('✅ Image ajoutée au slide depuis la banque');
        }
        async function retrySlideImage(idx) {
            if (!gammaData || !gammaData.slides[idx]) return;
            const s = gammaData.slides[idx];
            for (let attempt = 0; attempt < 2; attempt++) {
                const prompt = attempt === 0 ? slideImagePrompt(s) : `${s.title} - simple educational illustration`;
                try {
                    const url = await generateImage(prompt, attempt > 0);
                    s.image_url = url; renderGammaSlides(); return;
                } catch (e) { continue; }
            }
            s.image_url = '';
            renderGammaSlides();
        }
        async function regenerateAllImages() {
            if (!gammaData || !gammaData.slides || !gammaData.slides[gammaIndex]) return;
            retrySlideImage(gammaIndex);
        }
        async function saveGammaPresentation() {
            if (!gammaData || !gammaData.slides || gammaData.slides.length === 0) {
                showToast("⚠️ Aucune présentation à sauvegarder."); return;
            }
            try {
                const result = await savePresentation({
                    title: gammaData.title || 'Présentation sans titre',
                    slides: gammaData,
                    source_course_id: null
                });
                showToast('✅ Présentation sauvegardée !');
            } catch (e) {
                showToast('❌ ' + e.message);
            }
        }
        document.getElementById('gammaSearchBtn')?.addEventListener('click', searchWebImages);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.getElementById('gammaImageSearch')?.style.display !== 'none' && document.activeElement === document.getElementById('gammaSearchInput')) {
                searchWebImages();
            }
        });
        function exportGammaPDF() {
            if (!gammaData || !gammaData.slides || gammaData.slides.length === 0) {
                showToast("⚠️ Aucune présentation à exporter.");
                return;
            }
            showToast("📄 Génération du PDF en cours...");
            const t = GAMMA_THEMES[gammaTheme] || GAMMA_THEMES.ocean;
            let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${gammaData.title}</title>
            <style>
                @media print { body { padding: 10mm; } }
                body { font-family: 'Inter', sans-serif; background: #fff; padding: 30px; margin: 0; }
                .slide { background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 30px 36px; max-width: 900px; margin: 0 auto 24px; page-break-inside: avoid; }
                .slide-header { background: ${t.bg}; margin: -30px -36px 16px; padding: 16px 24px; border-radius: 16px 16px 0 0; }
                .slide-header h2 { color: #fff; margin: 0; font-size: 1.3rem; }
                ul { list-style: none; padding: 0; margin: 0; }
                li { padding: 6px 0 6px 24px; position: relative; font-size: 0.95rem; color: ${t.text}; line-height: 1.5; }
                li::before { content: "▹"; position: absolute; left: 0; color: ${t.accent}; font-weight: 700; }
                .slide-footer { margin-top: 16px; font-size: 0.75rem; color: #999; text-align: right; border-top: 1px solid #eee; padding-top: 8px; }
                h1 { text-align: center; font-size: 1.8rem; color: ${t.title}; margin: 20px 0 30px; }
            </style></head><body>
                <h1>${gammaData.title}</h1>
                ${gammaData.slides.map((s, i) => `
                    <div class="slide">
                        <div class="slide-header"><h2>${i+1}. ${s.title}</h2></div>
                        <ul>${s.content.map(p => `<li>${p}</li>`).join('')}</ul>
                        <div class="slide-footer">APC Algérie GÉNÉRATION 3</div>
                    </div>
                `).join('')}
            </body></html>`;
            const w = window.open('', '_blank');
            if (!w) { showToast("❌ Autorisez les popups pour exporter le PDF."); return; }
            w.document.write(html);
            w.document.close();
            w.focus();
            setTimeout(() => { w.print(); }, 500);
            showToast("✅ Choisissez « Enregistrer au format PDF » dans l'imprimante.");
        }
        function exportGammaHTML() {
            if (!gammaData) return;
            let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${gammaData.title}</title><style>
                body { font-family: 'Inter', sans-serif; background: #f5f7fb; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
                .slide { background: white; border-radius: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); padding: 40px 50px; max-width: 900px; width: 100%; margin-bottom: 30px; }
                h1 { font-size: 2.5rem; margin-bottom: 20px; color: #0A3A6B; }
                h2 { font-size: 1.8rem; color: #0A3A6B; border-bottom: 3px solid #0077CC; padding-bottom: 10px; }
                ul { list-style: none; padding: 0; }
                li { padding: 8px 0 8px 28px; position: relative; font-size: 1.1rem; }
                li::before { content: "▹"; position: absolute; left: 0; color: #0077CC; font-weight: 700; }
                .image-container { margin-top: 16px; border-radius: 12px; overflow: hidden; background: #eef2f5; }
                .image-container img { width: 100%; height: auto; max-height: 400px; object-fit: contain; }
                .footer { text-align: center; margin-top: 30px; color: #5B7A99; }
                @media (max-width: 600px) { .slide { padding: 20px; } h1 { font-size: 1.8rem; } }
            </style></head><body>
                <h1>${gammaData.title}</h1>
                ${gammaData.slides.map((s, i) => `
                    <div class="slide">
                        <h2>${s.title}</h2>
                        <ul>${s.content.map(p => `<li>${p}</li>`).join('')}</ul>
                        ${s.image_url ? `<div class="image-container"><img src="${s.image_url}" alt="${s.title}" loading="lazy"></div>` : ''}
                    </div>
                `).join('')}
                <div class="footer">Généré par APC Algérie G3</div>
            </body></html>`;
            const blob = new Blob([html], { type: 'text/html' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `presentation_${Date.now()}.html`;
            a.click();
        }
        async function urlToBase64(url) {
            try {
                // v1.8.6 : timeout 5s → 30s (une génération d'image prend 4-8 s) et en-tête
                // Authorization pour les images produites avec une clé Pollinations.
                var _h = {};
                if (url && url.indexOf('gen.pollinations.ai') > -1) {
                    var _pk = '';
                    try { _pk = String(localStorage.getItem('pol_key') || '').trim(); } catch (e) {}
                    if (_pk) _h.Authorization = 'Bearer ' + _pk;
                }
                const resp = await fetch(url, { headers: _h, signal: AbortSignal.timeout(30000) });
                if (!resp.ok) return null;
                const blob = await resp.blob();
                if (!blob || blob.size < 500) return null;
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            } catch (e) { return null; }
        }
        async function exportGammaPPTX() {
            if (!gammaData || !gammaData.slides || gammaData.slides.length === 0) {
                showToast("Aucune présentation à exporter.");
                return;
            }
            if (typeof PptxGenJS === 'undefined') {
                showToast("⚠️ Bibliothèque PPTX non chargée. Vérifiez votre connexion.");
                return;
            }
            showToast("📊 Préparation du PPTX...");
            const t = GAMMA_THEMES[gammaTheme] || GAMMA_THEMES.ocean;
            const pptx = new PptxGenJS();
            pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
            pptx.layout = 'WIDE';
            const bgColor = t.bg.match(/#[0-9A-Fa-f]{6}/)?.[0] || '0A3A6B';
            const imageCache = {};
            const urls = gammaData.slides.map(s => s.image_url).filter(Boolean);
            if (urls.length) {
                await Promise.all(urls.map(async (url) => {
                    imageCache[url] = await urlToBase64(url);
                }));
            }
            const titleSlide = pptx.addSlide();
            titleSlide.background = { color: bgColor };
            titleSlide.addText(gammaData.title || "Présentation APC", {
                x: 1, y: 2, w: 11.33, h: 1.5,
                fontSize: 36, color: 'FFFFFF', bold: true, align: 'center',
                fontFace: 'Arial'
            });
            titleSlide.addText("APC Algérie G3 - Présentation pédagogique", {
                x: 1, y: 3.8, w: 11.33, h: 0.8,
                fontSize: 18, color: 'CCCCCC', align: 'center'
            });
            titleSlide.addText(`Généré le ${new Date().toLocaleDateString()}`, {
                x: 1, y: 4.8, w: 11.33, h: 0.6,
                fontSize: 14, color: 'AAAAAA', align: 'center'
            });
            gammaData.slides.forEach((slide, i) => {
                const s = pptx.addSlide();
                s.background = { color: t.card === '#1C2A3E' ? bgColor : 'FFFFFF' };
                s.addText(slide.title, {
                    x: 0.5, y: 0.3, w: 12.33, h: 0.8,
                    fontSize: 26, color: bgColor, bold: true
                });
                s.addShape(pptx.ShapeType.rect, {
                    x: 0.5, y: 1.1, w: 12.33, h: 0.05,
                    fill: { color: t.accent.replace('#','') }
                });
                const bulletText = slide.content.map(p => ({
                    text: p, options: { fontSize: 15, color: t.text.replace('#',''), bullet: true, paraSpaceAfter: 8 }
                }));
                // v1.8.6 : la colonne image n'est réservée QUE si l'image a réellement été récupérée
                const _pptxHasImg = !!(slide.image_url && imageCache[slide.image_url]);
                s.addText(bulletText, {
                    x: 0.5, y: 1.4, w: _pptxHasImg ? 6.5 : 12.33, h: 5.2,
                    valign: 'top'
                });
                if (_pptxHasImg) {
                    try {
                        s.addImage({
                            path: imageCache[slide.image_url],
                            x: 7.5, y: 1.4, w: 5.3, h: 5.2,
                            sizing: { type: 'contain', w: 5.3, h: 5.2 }
                        });
                    } catch (e) { console.warn("Image skip PPTX:", e); }
                }
                s.addText(`Slide ${i+1}/${gammaData.slides.length}`, {
                    x: 0.5, y: 7, w: 12.33, h: 0.4,
                    fontSize: 10, color: '999999', align: 'right'
                });
            });
            pptx.writeFile({ fileName: `presentation_apc_${Date.now()}.pptx` })
                .then(() => showToast("✅ Présentation PPTX téléchargée !"))
                .catch(e => showToast("❌ Erreur export PPTX: " + e.message));
        }
        function generateSlidesClean() { showToast("Génération slides simplifiée"); }
        async function exportToPPTX() { showToast("Export PPTX simplifié"); }
        async function exportToPDF() {
            if (!gammaData || !gammaData.slides || gammaData.slides.length === 0) {
                showToast("⚠️ Aucune présentation à exporter.");
                return;
            }
            exportGammaPDF();
        }
        function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
        let toastTimer;
        function showToast(msg) {
            let t = document.getElementById('__toast');
            if (!t) {
                t = document.createElement('div');
                t.id = '__toast';
                t.style.cssText =
                    'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);background:#1B5E20;color:white;padding:10px 22px;border-radius:100px;font-size:13px;font-weight:600;box-shadow:0 6px 24px rgba(0,0,0,.25);transition:transform .3s ease,opacity .3s;opacity:0;z-index:9999;';
                document.body.appendChild(t);
            }
            var toastMsg = msg;
            if (window.__compat && window.__compat.isEnabled) toastMsg = window.__compat.replaceEmoji(toastMsg);
            t.innerHTML = toastMsg;
            clearTimeout(toastTimer);
            setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(0)';
                t.style.opacity = '1'; }, 10);
            toastTimer = setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(80px)';
                t.style.opacity = '0'; }, 2600);
        }
        function applyTheme() {
            document.body?.classList.toggle('dark', isDark);
            const themeLabel = document.getElementById('themeLabel');
            if (themeLabel) {
                if (window.__compat && window.__compat.isEnabled) themeLabel.innerHTML = isDark ? t('themeLight') : t('themeDark');
                else themeLabel.textContent = isDark ? t('themeLight') : t('themeDark');
            }
        }
        window.toggleDrawer = function() {
            var d = document.getElementById('drawer');
            var o = document.getElementById('drawerOverlay');
            if (!d || !o) return;
            var open = !d.classList.contains('open');
            d.classList.toggle('open', open);
            o.classList.toggle('open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };
        window.closeDrawer = function() {
            var d = document.getElementById('drawer');
            var o = document.getElementById('drawerOverlay');
            if (d) d.classList.remove('open');
            if (o) o.classList.remove('open');
            document.body.style.overflow = '';
        };
        window.toggleTheme = function() {
            isDark = !isDark;
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
applyTheme();
        };
        function setLang(lang) {
            currentLang = lang;
            localStorage.setItem('lang', lang);
            const isAr = lang === 'ar';
            document.documentElement?.setAttribute('lang', lang);
            document.documentElement?.setAttribute('dir', isAr ? 'rtl' : 'ltr');
            document.body?.setAttribute('dir', isAr ? 'rtl' : 'ltr');
            document.getElementById('btnFR')?.classList.toggle('active-lang', lang === 'fr');
            document.getElementById('btnAR')?.classList.toggle('active-lang', lang === 'ar');
            document.getElementById('btnEN')?.classList.toggle('active-lang', lang === 'en');
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const k = el.getAttribute('data-i18n');
                if (T[lang][k] !== undefined) {
                    var v = T[lang][k];
                    if (window.__compat && window.__compat.isEnabled) { el.innerHTML = window.__compat.replaceEmoji(v); }
                    else { el.textContent = v; }
                }
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const k = el.getAttribute('data-i18n-placeholder');
                if (T[lang][k]) el.placeholder = T[lang][k];
            });
            var tl = document.getElementById('themeLabel');
            if (tl) {
                if (window.__compat && window.__compat.isEnabled) tl.innerHTML = isDark ? t('themeLight') : t('themeDark');
                else tl.textContent = isDark ? t('themeLight') : t('themeDark');
            }
            updatePresoButtonLabel();
            renderExamples();
            renderOptions();
            renderQuickBtns();
            if (typeof renderHelp === 'function') renderHelp();
            document.querySelectorAll('.signature').forEach(function(sig) {
                if (!sig.textContent.includes('👥')) return;
                sig.innerHTML = sig.textContent.replace('👥', '<span class="sig-trigger" style="cursor:pointer;display:inline-block;transition:transform 0.2s;position:relative;">👥</span>');
            });
            if (typeof translateQuizUI === 'function') translateQuizUI();
            updatePrompt();
            updateApiBadge();
            renderAboutContent();
            if (typeof updateAuthUI === 'function') updateAuthUI();
            if (typeof translateVoiceUI === 'function') translateVoiceUI();
            if (typeof renderGuide === 'function') renderGuide();
        }
        function renderExamples() {
            const g = document.getElementById('examplesGrid');
            if (!g) return;
            g.innerHTML = '';
            const src = examples || FALLBACK_EXAMPLES;
            src.forEach((ex, i) => {
                const useFr = currentLang === 'fr' || currentLang === 'en';
                const name = useFr ? ex.name_fr : ex.name_ar;
                const spec = useFr ? ex.specialite_fr : ex.specialite_ar;
                const comp = useFr ? ex.competence_fr : ex.competence_ar;
                const niv = useFr ? ex.niveau_fr : ex.niveau_ar;
                const d = document.createElement('div');
                d.className = 'ex-card' + (selectedExample === i ? ' selected' : '');
                d.innerHTML =
                    `<div class="ex-icon">${ex.icon}</div><div class="ex-title">${name}</div><div class="ex-detail">${spec}</div><div class="ex-detail">${comp.substring(0,52)}…</div><div class="ex-badge">${niv}</div><div class="ex-hint">👆 ${useFr?'Click to fill all fields':'اضغط لملء كل الحقول'}</div>`;
                d.onclick = () => fillExample(ex, i);
                g.appendChild(d);
            });
        }
        function fillExample(ex, idx) {
            selectedExample = idx;
            const useFr = currentLang === 'fr' || currentLang === 'en';
            const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
            set('roleIA', useFr ? ex.role_fr : ex.role_ar);
            set('missionIA', useFr ? ex.mission_fr : ex.mission_ar);
            set('specialite', useFr ? ex.specialite_fr : ex.specialite_ar);
            set('module', useFr ? ex.module_fr : ex.module_ar);
            set('competence', useFr ? ex.competence_fr : ex.competence_ar);
            set('niveau', useFr ? ex.niveau_fr : ex.niveau_ar);
            set('annee', useFr ? ex.annee_fr : ex.annee_ar);
            set('duree', useFr ? ex.duree_fr : ex.duree_ar);
            set('stagiaires', ex.stagiaires);
            set('espace', useFr ? ex.espace_fr : ex.espace_ar);
            set('ressources', useFr ? ex.ressources_fr : ex.ressources_ar);
            set('contexte', useFr ? ex.contexte_fr : ex.contexte_ar);
            set('difficultes', useFr ? ex.difficultes_fr : ex.difficultes_ar);
            const hasAST = ex.astMetier_fr || ex.astMetier_ar;
            document.getElementById('astToggle').checked = !!hasAST;
            document.getElementById('astPanel').classList.toggle('visible', !!hasAST);
            if (hasAST) { set('astMetier', useFr ? ex.astMetier_fr : ex.astMetier_ar);
                set('astExtrait', useFr ? ex.astExtrait_fr : ex.astExtrait_ar); }
            renderExamples();
            updatePrompt();
        }
        function renderOptions() {
            const w = document.getElementById('optionsWrap');
            if (!w) return;
            w.innerHTML = '';
            OPTS.forEach((o, idx) => {
                const lbl = document.createElement('label');
                lbl.className = 'opt-chip' + (options[o.id] ? ' on' : '');
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = options[o.id];
                cb.onchange = e => {
                    options[o.id] = e.target.checked;
                    lbl.classList.toggle('on', e.target.checked);
                    syncDynamicFields();
                    updatePrompt();
                    if (typeof saveFormState === 'function') saveFormState();
                };
                const dot = document.createElement('span');
                dot.className = 'chip-dot';
                const sp = document.createElement('span');
                if (window.__compat && window.__compat.isEnabled) sp.innerHTML = t(o.k);
                else sp.textContent = t(o.k);
                lbl.appendChild(cb);
                lbl.appendChild(dot);
                lbl.appendChild(sp);
                w.appendChild(lbl);
            });
            syncDynamicFields();
        }
        function syncDynamicFields() {
            const container = document.getElementById('dynamicOptionsContainer');
            if (!container) return;
            const vals = {};
            OPT_IDS.forEach(id => {
                const el = document.getElementById('opt_' + id);
                if (el) vals[id] = el.value;
            });
            container.innerHTML = '';
            OPT_IDS.forEach((id, idx) => {
                if (!options[id]) return;
                const div = document.createElement('div');
                div.className = 'form-group';
                div.id = 'dynGroup_' + id;
                const lbl = document.createElement('label');
                var lblText = '✏️ ' + t(OPTS[idx].k);
                if (window.__compat && window.__compat.isEnabled) lbl.innerHTML = window.__compat.replaceEmoji(lblText);
                else lbl.textContent = lblText;
                const ta = document.createElement('textarea');
                ta.id = 'opt_' + id;
                ta.rows = 2;
                ta.value = vals[id] !== undefined ? vals[id] : t(OPT_CKEYS[idx]);
                ta.oninput = function() { updatePrompt(); if (typeof saveFormState === 'function') saveFormState(); };
                div.appendChild(lbl);
                div.appendChild(ta);
                container.appendChild(div);
            });
        }
        const astToggle = document.getElementById('astToggle');
        if (astToggle) astToggle.onchange = function() {
            document.getElementById('astPanel')?.classList.toggle('visible', this.checked);
            updatePrompt();
            if (typeof saveFormState === 'function') saveFormState();
        };
        function renderQuickBtns() {
            const w = document.getElementById('quickBtns');
            if (!w) return;
            w.innerHTML = '';
            QUICK_KEYS.forEach(k => {
                const b = document.createElement('button');
                b.className = 'apc-quick-btn';
                if (window.__compat && window.__compat.isEnabled) b.innerHTML = t(k);
                else b.textContent = t(k);
                b.onclick = () => {
                    const ctx = getFormContext();
                    const prompts = {
                        quick_scenario: `Crée un scénario pédagogique APC complet selon les 5 phases (Contextualisation, Déstabilisation, Construction, Intégration, Transfert) en tableau professionnel.\n\n${ctx}`,
                        quick_eval: `Génère une évaluation APC basée sur les compétences avec critères et indicateurs en tableau.\n\n${ctx}`,
                        quick_fiche: `Crée une fiche pédagogique APC complète avec objectifs, déroulement et évaluation.\n\n${ctx}`,
                        quick_integration: `Crée une situation d'intégration authentique et contextualisée pour l'APC Algérie.\n\n${ctx}`,
                        quick_grille: `Étape 1 : analyse le contexte de formation ci-dessous.\nÉtape 2 : génère UNIQUEMENT le tableau markdown ci-dessous en remplaçant (critère 1-4) par les vrais critères adaptés au contexte. STRICTEMENT AUCUN texte avant ni après le tableau.\n\n| Critère | Non maîtrisé | En cours | Maîtrisé | Expert |\n|---------|--------------|----------|----------|--------|\n| (critère 1) | ☐ | ☐ | ☐ | ☐ |\n| (critère 2) | ☐ | ☐ | ☐ | ☐ |\n| (critère 3) | ☐ | ☐ | ☐ | ☐ |\n| (critère 4) | ☐ | ☐ | ☐ | ☐ |\n\n${ctx}`,
                        quick_cours: `Crée un cours complet APC avec introduction, développement, exemples, exercices et évaluation.\n\n${ctx}`,
                    };
                    const arPrompts = {
                        quick_scenario: `أنشئ سيناريو بيداغوجياً APC كاملاً وفق المراحل الخمس (السياق، زعزعة التوازن، البناء، الإدماج، النقل) في جدول احترافي.\n\n${ctx}`,
                        quick_eval: `أنشئ تقييماً APC مبنياً على الكفاءات مع معايير ومؤشرات في جدول.\n\n${ctx}`,
                        quick_fiche: `أنشئ بطاقة بيداغوجية APC كاملة مع الأهداف والسير والتقييم.\n\n${ctx}`,
                        quick_integration: `أنشئ وضعية إدماج أصيلة ومسيَّقة للـ APC الجزائري.\n\n${ctx}`,
                        quick_grille: `الخطوة 1 : حلل سياق التكوين أدناه.\nالخطوة 2 : أخرِج فقط جدول الماركداون أدناه مع استبدال (معيار 1-4) بالمعايير الحقيقية المتناسبة مع السياق. ممنوع إضافة أي نص قبل أو بعد الجدول.\n\n| المعيار | غير مكتسب | قيد الاكتساب | مكتسب | خبير |\n|---------|-----------|-------------|--------|------|\n| (معيار 1) | ☐ | ☐ | ☐ | ☐ |\n| (معيار 2) | ☐ | ☐ | ☐ | ☐ |\n| (معيار 3) | ☐ | ☐ | ☐ | ☐ |\n| (معيار 4) | ☐ | ☐ | ☐ | ☐ |\n\n${ctx}`,
                        quick_cours: `أنشئ درساً كاملاً APC مع مدخل وتطوير وأمثلة وتمارين وتقييم.\n\n${ctx}`,
                    };
                    const msg = currentLang === 'ar' ? arPrompts[k] : prompts[k];
                    document.getElementById('aiInput').value = msg;
                    sendMessage();
                };
                w.appendChild(b);
            });
        }
        function gv(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
        function buildPrompt() {
            const role = gv('roleIA'),
                mission = gv('missionIA'),
                spec = gv('specialite'),
                mod = gv('module'),
                comp = gv('competence'),
                niv = gv('niveau'),
                ann = gv('annee'),
                dur = gv('duree'),
                stag = gv('stagiaires'),
                esp = gv('espace'),
                res = gv('ressources'),
                ctx = gv('contexte'),
                diff = gv('difficultes');
            const hasContent = [role, mission, spec, mod, comp, niv].some(v => v.length > 0);
            if (!hasContent) return currentLang === 'fr' ? '← Remplissez les champs pour générer votre prompt APC…' :
                currentLang === 'en' ? '← Fill in the fields to generate your APC prompt…' :
                '← أَدخِل البيانات لتوليد البرومبت APC…';
            let ast = '';
            const astTog = document.getElementById('astToggle');
            if (astTog.checked) {
                const am = gv('astMetier'),
                    ae = gv('astExtrait');
                if (am || ae) ast =
                    `\n${t('prompt_ast')} :\n${am ? '- '+t('prompt_ast_metier'||'Métier')+' : '+am+'\n' : ''}${ae ? ae+'\n' : ''}`;
            }
            const consignes = [];
            OPT_IDS.forEach((id, idx) => {
                if (!options[id]) return;
                const el = document.getElementById('opt_' + id);
                const txt = el ? el.value.trim() : t(OPT_CKEYS[idx]);
                consignes.push((consignes.length + 1) + '. ' + txt);
            });
            if (options.hasOwnProperty('activities') && !options.activities) {
                var excludeAct = currentLang === 'fr' ? '⚠️ IMPORTANT : Ne PAS inclure les sections "Activités du formateur" et "Activités des stagiaires".' :
                    currentLang === 'ar' ? '⚠️ هام جداً: لا تَضمُن أقسام "أنشطة المكوّن" و "أنشطة المتدرّب".' :
                    '⚠️ IMPORTANT: Do NOT include "Trainer activities" and "Trainee activities" sections.';
                consignes.push((consignes.length + 1) + '. ' + excludeAct);
            }
            const cons = consignes.length ? consignes.join('\n') : t('no_option');
            var actPhrase = (options.activities !== false) ?
                (currentLang === 'fr' ? ', des activités formateur/stagiaire' :
                    currentLang === 'en' ? ', trainer/trainee activities' :
                    '، وأنشطة للمكوّن والمتدرب') : '';
            var formatSuffix = currentLang === 'fr' ?
                (options.activities !== false ?
                    ' Chaque section DOIT commencer par un titre (### Titre : ...) et inclure les sous-sections ### Objectif, ### Situation proposée, ### Activités du formateur, ### Activités des stagiaires, ### Production attendue.' :
                    ' Chaque section DOIT commencer par un titre (### Titre : ...) et inclure les sous-sections ### Objectif, ### Situation proposée, ### Production attendue.') :
                currentLang === 'en' ?
                (options.activities !== false ?
                    ' Each section MUST start with a title (### Title: ...) and include the subsections ### Objective, ### Proposed situation, ### Trainer activities, ### Trainee activities, ### Expected production.' :
                    ' Each section MUST start with a title (### Title: ...) and include the subsections ### Objective, ### Proposed situation, ### Expected production.') :
                (options.activities !== false ?
                    ' يجب أن يبدأ كل قسم بعنوان (### العنوان: ...) ويتضمن الأقسام الفرعية ### الهدف، ### الوضعية المقترحة، ### أنشطة المكوّن، ### أنشطة المتدرّب، ### الإنتاج المنتظر.' :
                    ' يجب أن يبدأ كل قسم بعنوان (### العنوان: ...) ويتضمن الأقسام الفرعية ### الهدف، ### الوضعية المقترحة، ### الإنتاج المنتظر.');
            const header = currentLang === 'fr' ?
                'Tu es un formateur expert en APC Algérie. À partir des informations ci-dessous, génère un DOCUMENT PÉDAGOGIQUE COMPLET, TRÈS DÉTAILLÉ et de qualité professionnelle comme un expert en ingénierie pédagogique. Tu dois produire un contenu RICHE, STRUCTURÉ et EXHAUSTIF, organisé en sections avec titres (###), sous-titres, tableaux markdown, listes, gras, et émoticônes pertinentes. Chaque section doit être développée en profondeur avec des explications, des durées' + actPhrase + ', des productions attendues et des exemples concrets.' + formatSuffix :
                currentLang === 'en' ?
                'You are an expert APC Algeria trainer. Based on the information below, generate a COMPLETE, VERY DETAILED, professional-quality PEDAGOGICAL DOCUMENT like an instructional design expert. Produce RICH, STRUCTURED and EXHAUSTIVE content organized in sections with titles (###), subtitles, markdown tables, lists, bold, and relevant emojis. Each section must be developed in depth with explanations, durations' + actPhrase + ', expected productions, and concrete examples.' + formatSuffix :
                'أنت خبير تكوين في APC الجزائر. بناءً على المعلومات أدناه، أنشئ وثيقة بيداغوجية كاملة ومفصّلة جداً وبجودة مهنية مثل خبير في الهندسة البيداغوجية. يجب أن تنتج محتوى غنياً ومنظماً وشاملاً، مقسماً إلى أقسام بعناوين (###) وعناوين فرعية وجداول ماركداون وقوائم وخط عريض ورموز تعبيرية مناسبة. يجب تطوير كل قسم بعمق مع شروحات ومدد زمنية' + actPhrase + ' وإنتاجات متوقعة وأمثلة ملموسة.' + formatSuffix;
            return `${header}\n\n${t('prompt_role')} : ${role||'—'}\n${t('prompt_mission')} : ${mission||'—'}\n${t('prompt_langue')} : ${currentLang==='fr'?'Français':currentLang==='en'?'English':'العربية'}\n\n${t('prompt_context')} :\n- ${t('prompt_specialite')} : ${spec||'—'}\n- ${t('prompt_module')} : ${mod||'—'}\n- ${t('prompt_competence')} : ${comp||'—'}\n- ${t('prompt_niveau')} : ${niv||'—'} (${ann||'—'})\n- ${t('prompt_duree')} : ${dur||'—'} | ${t('prompt_stagiaires')} : ${stag||'—'}\n- ${t('prompt_espace')} : ${esp||'—'}\n- ${t('prompt_ressources')} : ${res||'—'}\n- ${t('prompt_contexte')} : ${ctx||'—'}\n- ${t('prompt_difficultes')} : ${diff||'—'}\n${ast}\n${t('prompt_consignes')} :\n${cons}`;
        }
        function updatePrompt() { const el = document.getElementById('promptPreview'); if (el) el.textContent = buildPrompt(); }
        function loadKeysIntoModal() {
            document.getElementById('openrouterApiKeyInput').value = getOpenRouterKey();
            document.getElementById('groqApiKeyInput').value = getGroqKey();
            const geminiInput = document.getElementById('geminiApiKeyInput');
            if (geminiInput) geminiInput.value = getGeminiKey();
            loadEmailJSConfigToUI();
            if (window.__compat) {
                var compatVal = window.__compat.getSetting();
                document.querySelectorAll('input[name="compatChoice"]').forEach(function(r) { r.checked = r.value === compatVal; });
            }
        }
        const modal = document.getElementById('settingsModal');
        document.getElementById('modalCloseBtn')?.addEventListener('click', () => modal?.classList.remove('open'));
        document.getElementById('modalCancelBtn')?.addEventListener('click', () => modal?.classList.remove('open'));
        modal?.addEventListener('click', (e) => { if (e.target === modal) modal?.classList.remove('open'); });
        document.getElementById('modalSaveBtn')?.addEventListener('click', () => {
            const orKey = document.getElementById('openrouterApiKeyInput').value.trim();
            const groqKey = document.getElementById('groqApiKeyInput').value.trim();
            const geminiKey = document.getElementById('geminiApiKeyInput')?.value.trim() || '';
            setOpenRouterKey(orKey);
            setGroqKey(groqKey);
            setGeminiKey(geminiKey);
            const pk = document.getElementById('emailjsPublicKey')?.value.trim();
            const sid = document.getElementById('emailjsServiceId')?.value.trim();
            const tid = document.getElementById('emailjsTemplateId')?.value.trim();
            const ak = document.getElementById('emailjsApiKey')?.value.trim();
            if (pk || sid || tid) {
                try { localStorage.setItem('emailjs_config', JSON.stringify({ publicKey: pk || '', serviceId: sid || '', templateId: tid || '', apiKey: ak || '' })); } catch(e) {}
            }
            var compatChoice = document.querySelector('input[name="compatChoice"]:checked');
            if (compatChoice && window.__compat) window.__compat.setSetting(compatChoice.value);
            showToast(t('apiSaved'));
            modal?.classList.remove('open');
        });
        document.getElementById('modalClearBtn')?.addEventListener('click', () => {
            if (!confirm(currentLang === 'fr' ? 'Effacer toutes les clés ?' : currentLang === 'en' ? 'Clear all keys?' : 'حذف جميع المفاتيح؟')) return;
            setOpenRouterKey('');
            setGroqKey('');
            setGeminiKey('');
            document.getElementById('openrouterApiKeyInput').value = '';
            document.getElementById('groqApiKeyInput').value = '';
            const geminiInput = document.getElementById('geminiApiKeyInput');
            if (geminiInput) geminiInput.value = '';
            showToast(t('apiCleared'));
            modal?.classList.remove('open');
        });
        document.getElementById('verifyORKeyBtn')?.addEventListener('click', async () => {
            const key = stripBOM(document.getElementById('openrouterApiKeyInput').value);
            const el = document.getElementById('verifyORResult');
            if (!key) { el.innerHTML = t('apiInvalid');
                el.className = 'verify-result error'; return; }
            el.innerHTML = t('checkingKey');
            el.className = 'verify-result loading';
            const valid = await verifyKey('https://openrouter.ai/api/v1/auth/key', key);
            el.textContent = valid ? t('keyValid') : t('keyInvalid');
            el.className = valid ? 'verify-result success' : 'verify-result error';
        });
        document.getElementById('verifyGroqKeyBtn')?.addEventListener('click', async () => {
            const key = stripBOM(document.getElementById('groqApiKeyInput').value);
            const el = document.getElementById('verifyGroqResult');
            if (!key) { el.innerHTML = t('apiInvalid');
                el.className = 'verify-result error'; return; }
            el.innerHTML = t('checkingKey');
            el.className = 'verify-result loading';
            const valid = await verifyKey('https://api.groq.com/openai/v1/models', key);
            el.textContent = valid ? t('keyValid') : t('keyInvalid');
            el.className = valid ? 'verify-result success' : 'verify-result error';
        });
        document.getElementById('verifyGeminiKeyBtn')?.addEventListener('click', async () => {
            const key = stripBOM(document.getElementById('geminiApiKeyInput').value);
            const el = document.getElementById('verifyGeminiResult');
            if (!key) { el.innerHTML = t('apiInvalid');
                el.className = 'verify-result error'; return; }
            el.innerHTML = t('checkingKey');
            el.className = 'verify-result loading';
            try {
                const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(key));
                el.textContent = resp.ok ? t('keyValid') : t('keyInvalid');
                el.className = resp.ok ? 'verify-result success' : 'verify-result error';
            } catch (e) {
                el.innerHTML = t('keyInvalid');
                el.className = 'verify-result error';
            }
        });
        function getSelectedModel() {
            const r = document.querySelectorAll('input[name="modelChoice"]');
            for (let rb of r)
                if (rb.checked) return rb.value;
            return 'auto';
        }
        function setSelectedModel(val) {
            const r = document.querySelectorAll('input[name="modelChoice"]');
            for (let rb of r)
                if (rb.value === val) rb.checked = true;
        }
        setSelectedModel(localStorage.getItem('model_choice') || 'auto');
        document.querySelectorAll('input[name="modelChoice"]').forEach(r =>
            r.addEventListener('change', () => localStorage.setItem('model_choice', r.value))
        );
        window.getFreeMode = function() { return localStorage.getItem('free_mode') === 'true'; };
        window.setFreeMode = function(val) { localStorage.setItem('free_mode', val ? 'true' : 'false'); };
        window.updateModeBadge = function() {
            var pb = document.getElementById('pedagogyBadge');
            if (pb) pb.textContent = getAxonMode() ? '🧠 AXON' : getFreeMode() ? '🔓 Libre' : '📘 APC';
        };
        var ft = document.getElementById('freeModeToggle');
        if (ft) { ft.checked = getFreeMode(); ft.addEventListener('change', function() { setFreeMode(this.checked); updateModeBadge(); }); }
        window.getAxonMode = function() { return localStorage.getItem('axon_mode') === 'true'; };
        window.setAxonMode = function(val) { localStorage.setItem('axon_mode', val ? 'true' : 'false'); };
        var at = document.getElementById('axonToggle');
        if (at) { at.checked = getAxonMode(); at.addEventListener('change', function() { setAxonMode(this.checked); updateModeBadge(); }); }
        updateModeBadge();
        window.initAxonMemory = function() {
            var stores = ['axon_user','axon_conversation','axon_knowledge','axon_corrections','axon_documents','axon_statistics','axon_cache'];
            stores.forEach(function(s) { if (!localStorage.getItem(s)) localStorage.setItem(s, JSON.stringify([])); });
            // Purge des faux noms stockés par les versions précédentes ("mon", "nom", "moi", "de", "ziz"...)
            try {
                var u = JSON.parse(localStorage.getItem('axon_user') || '[]');
                var u2 = u.filter(function(x) { return !(x && x.name && /^(mon|nom|moi|ton|ta|tes|votre|vos|vôtre|mien|your|my|name|his|her|their|de|du|des|le|la|les|un|une|toi|deux|trois|ziz)$/i.test(x.name.trim())); });
                // Purge des noms à 1re lettre minuscule (corruption du replace v1.5.3 : "ziz Mohamed Rostom", "de..." )
                u2 = u2.filter(function(x) { return !(x && x.name && /^[a-zà-ÿ]/.test(x.name.trim()) && x.name.trim().length > 1); });
                if (u2.length !== u.length) localStorage.setItem('axon_user', JSON.stringify(u2));
            } catch(e) {}
        };
        window.        _axonValidName = function(n) {
            if (!(n && typeof n === 'string' && n.trim())) return false;
            if (/^(mon|nom|moi|ton|ta|tes|votre|vos|vôtre|mien|your|my|name|his|her|their|de|du|des|le|la|les|un|une|toi|deux|trois)$/i.test(n.trim())) return false;
            // Un nom latin doit commencer par une MAJUSCULE (rejette "ziz Mohamed Rostom").
            // Les noms arabes (lettres uniquement arabes) sont toujours acceptés.
            if (/[A-Za-zÀ-ÿ]/.test(n) && !/^[A-ZÀ-Ü]/.test(n.trim())) return false;
            return true;
        };
        // Nettoyage d'un nom brut capturé ("de mon nom complet" → vire mots vides et fragments)
        window._axonCleanName = function(n) {
            if (!n) return '';
            n = n.replace(/^(de\s+|mon\s+|mes\s+|ton\s+|ton\s+nom\s+|de\s+mon\s+|mon\s+nom\s+|nom\s+(complet\s+)?|c['’]est\s+|est\s+|عني\s+|اسمي\s+|الكامل\s+)+/i, '');
            n = n.replace(/[\s:=\-–—،,.;]+$/g, '').trim();
            n = n.replace(/\s{2,}/g, ' ');
            if (!_axonValidName(n)) return '';
            if (n.split(/\s+/).length > 6) n = n.split(/\s+/).slice(0, 6).join(' ');
            return n;
        };
        // --- AXON Supabase sync ---
        window._axonSyncQueue = {};
        window._axonSyncTimer = null;
        window._axonSyncFlush = async function() {
            if (typeof supabaseClient === 'undefined' || !supabaseClient || !currentUser) { window._axonSyncQueue = {}; return; }
            var queue = window._axonSyncQueue;
            window._axonSyncQueue = {};
            var keys = Object.keys(queue);
            for (var i = 0; i < keys.length; i++) {
                var entry = queue[keys[i]];
                try {
                    var existing = await supabaseClient.from('axon_memory').select('id').eq('user_id', currentUser.id).eq('store_type', entry.store_type).eq('memory_key', entry.memory_key).maybeSingle();
                    if (existing.data) {
                        await supabaseClient.from('axon_memory').update({ memory_value: entry.memory_value, updated_at: new Date().toISOString(), last_used_at: new Date().toISOString(), use_count: entry.use_count, confidence: entry.confidence, utility: entry.utility, tags: entry.tags }).eq('id', existing.data.id);
                    } else {
                        await supabaseClient.from('axon_memory').insert({ user_id: currentUser.id, store_type: entry.store_type, memory_key: entry.memory_key, memory_value: entry.memory_value, tags: entry.tags || [], confidence: entry.confidence || 50, utility: entry.utility || 50, use_count: entry.use_count || 0 });
                    }
                } catch(e) { console.warn('AXON sync err:', e); }
            }
        };
        window._axonSyncEnqueue = function(store_type, memory_key, memory_value, extras) {
            window._axonSyncQueue[store_type+':'+memory_key] = { store_type: store_type, memory_key: memory_key, memory_value: memory_value, tags: extras?.tags || [], confidence: extras?.confidence || 50, utility: extras?.utility || 50, use_count: extras?.use_count || 0 };
            if (window._axonSyncTimer) clearTimeout(window._axonSyncTimer);
            window._axonSyncTimer = setTimeout(window._axonSyncFlush, 2000);
        };
        window.initAxonSupabase = async function() {
            if (typeof supabaseClient === 'undefined' || !supabaseClient || !currentUser) return;
            try {
                var { data } = await supabaseClient.from('axon_memory').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
                if (data && data.length) {
                    var grouped = {};
                    data.forEach(function(row) {
                        if (!grouped[row.store_type]) grouped[row.store_type] = [];
                        grouped[row.store_type].push({ id: row.memory_key, content: row.memory_value, tags: row.tags, confidence: row.confidence, utility: row.utility, use_count: row.use_count, created: row.created_at, last_used: row.last_used_at, lifecycle: row.lifecycle_status });
                    });
                    Object.keys(grouped).forEach(function(st) {
                        var localKey = 'axon_' + st;
                        var existing = JSON.parse(localStorage.getItem(localKey) || '[]');
                        grouped[st].forEach(function(item) {
                            var dup = existing.some(function(e) { return e.id === item.id || (e.content && item.content && JSON.stringify(e.content) === JSON.stringify(item.content)); });
                            if (!dup) existing.push(item);
                        });
                        localStorage.setItem(localKey, JSON.stringify(existing));
                    });
                }
                // Migration: push localStorage data not yet in Supabase
                var stores = ['axon_user','axon_knowledge','axon_corrections','axon_documents','axon_statistics','axon_cache','axon_conversation'];
                stores.forEach(function(localKey) {
                    var localData = JSON.parse(localStorage.getItem(localKey) || '[]');
                    if (!localData.length) return;
                    var sbName = localKey.replace('axon_', '');
                    var existingKeys = {};
                    if (data && data.length) {
                        data.forEach(function(row) {
                            if (row.store_type === sbName) existingKeys[row.memory_key] = true;
                        });
                    }
                    localData.forEach(function(item) {
                        var key = item.id || 'entry_' + Date.now();
                        if (!existingKeys[key]) {
                            window._axonSyncEnqueue(sbName, key, item.content || item, { tags: item.tags || [], confidence: item.confidence || 50, utility: item.utility || 50, use_count: item.use_count || 0 });
                        }
                    });
                });
                // Flush queued syncs
                if (window._axonSyncTimer) clearTimeout(window._axonSyncTimer);
                setTimeout(window._axonSyncFlush, 500);
            } catch(e) { console.warn('AXON supabase init:', e); }
        };
        window.getAxonStore = function(name) { try { return JSON.parse(localStorage.getItem(name)) || []; } catch(e) { return []; } };
        window.setAxonStore = function(name, data) {
            localStorage.setItem(name, JSON.stringify(data));
            var sbName = name.replace('axon_', '');
            if (['user','knowledge','corrections','documents','statistics','cache','conversation'].indexOf(sbName) !== -1 && currentUser) {
                var latest = data.length ? data[data.length-1] : null;
                if (latest) {
                    var extras = { tags: latest.tags || [], confidence: latest.confidence || 50, utility: latest.utility || 50, use_count: latest.use_count || 0 };
                    window._axonSyncEnqueue(sbName, latest.id || 'entry_'+Date.now(), latest.content || latest, extras);
                }
            }
        };
        window.buildAxonContext = function() {
            var ctx = '', lang = document.documentElement?.lang || 'fr';
            ctx += (lang === 'ar' ? '🧠 أنا مساعد AXON Intelligence بذاكرة تطورية. أتذكر تفضيلاتك وتصحيحاتك ومعارفك السابقة.' : lang === 'en' ? '🧠 I am AXON Intelligence with evolving memory. I remember your preferences, corrections, and past knowledge.' : '🧠 Je suis AXON Intelligence à mémoire évolutive. Je me souviens de vos préférences, corrections et connaissances passées.') + '\n';
            var user = getAxonStore('axon_user');
            if (user.length) {
                var u = user[user.length-1];
                var uname = _axonValidName(u.name) ? u.name : '—';
                ctx += (lang === 'ar' ? '👤 المستخدم: ' : lang === 'en' ? '👤 User: ' : '👤 Utilisateur : ') + uname + ' | ' + (lang === 'ar' ? 'اختصاص: ' : lang === 'en' ? 'Speciality: ' : 'Spécialité : ') + (u.speciality||'—') + '\n';
            }
            var k = getAxonStore('axon_knowledge');
            if (k.length) {
                ctx += (lang === 'ar' ? '\n📚 المعرفة المخزنة :\n' : lang === 'en' ? '\n📚 Stored knowledge :\n' : '\n📚 Connaissances stockées :\n');
                k.slice(-5).forEach(function(item) {
                    ctx += '• [' + (item.type||'info') + '] ' + (item.title||item.content||'').substring(0,100) + '\n';
                });
            }
            var c = getAxonStore('axon_corrections');
            if (c.length) {
                ctx += (lang === 'ar' ? '\n🔄 التصحيحات السابقة :\n' : lang === 'en' ? '\n🔄 Past corrections :\n' : '\n🔄 Corrections précédentes :\n');
                c.slice(-3).forEach(function(cor) {
                    ctx += '• ' + (lang === 'ar' ? 'من' : lang === 'en' ? 'from ' : 'de ') + (cor.old||'') + ' → ' + (cor.new||'') + (cor.reason ? ' (' + cor.reason + ')' : '') + '\n';
                });
            }
            return ctx;
        };
        window.axonPostProcess = function(aiText, userText) {
            if (!getAxonMode()) return;
            var lang = document.documentElement?.lang || 'fr';
            // Moteur de décision (⑥)
            var decisions = decisionEngine(userText);
            // Nom préféré (ne PAS déclencher si l'utilisateur DEMANDE son nom : "rappelle moi de mon nom complet" ≠ "appelle-moi X")
            var nameQuestion = /(rappelle[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|rappelle[\w-]*\s+moi\s+.{0,15}nom\s+complet|dis[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|dit[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|donne[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|c['’]est quoi mon nom|quel est mon nom|what('|i)?s\s+my\s+(full\s+)?name|what\s+is\s+my\s+(full\s+)?name|ما\s*اسمي|كيف\s*اسمي|شنو\s*اسمي|اشنو\s*اسمي|إيه\s*اسمي|ما\s*هو\s*اسمي)/i.test(userText);
            // Nom COMPLET — capture par GROUPE (groupe 1 = nom, la 1re lettre n'est plus mangée par le replace)
            // "mon nom complet est X" / "je m'appelle X" / "my full name is X" / "اسمي الكامل X" / "mon prénom X"
            var newName = null;
            if (!nameQuestion) {
                var nMatch = userText.match(/(?:mon\s+nom\s+(?:complet\s+)?(?:est|c['’]est|:|هو|هي)?\s*|je\s+m['’]appelle\s+|my\s+(?:full\s+)?name\s+is\s+|اسمي\s+(?:الكامل\s+)?|أنا\s+اسمي\s+|mon\s+prénom\s+(?:est\s+)?)([A-ZÀ-ÿ\u0600-\u06FF][A-Za-zÀ-ÿ\u0600-\u06FF'’\-\s]{2,59})/i);
                // Correction explicite : "corrige c'est X pas Y" / "cé Aziz pas ziz" / "c'est X et non Y"
                var fixMatch = userText.match(/(?:corrige[\w\s]{0,25}?)?(?:cé|c['’]est|c'est)\s+([A-ZÀ-ÿ][A-Za-zÀ-ÿ'’\-]{1,40})(?:\s+(?:pas|non|et\s+pas|et\s+non)\s+\S+)/i);
                // "appelle-moi X" / "call me X" / "ادعني X" / "نادني X"
                var nameMatch = userText.match(/(?:appelle[\w-]*\s*moi|call\s+me|ادعني|نادني)\s+([A-ZÀ-ÿ\u0600-\u06FF][A-Za-zÀ-ÿ\u0600-\u06FF'’\-\s]{1,59})/i);
                if (nMatch) newName = nMatch[1].trim();
                else if (fixMatch) newName = fixMatch[1].trim();
                else if (nameMatch) newName = nameMatch[1].trim();
            }
            if (newName) {
                var userStore = getAxonStore('axon_user');
                var current = userStore.length ? userStore[userStore.length-1] : {};
                var cleaned = _axonCleanName(newName);
                if (cleaned) {
                    current.name = cleaned;
                    current.speciality = document.getElementById('specialite')?.value || current.speciality || '';
                    userStore.push(current);
                    setAxonStore('axon_user', userStore);
                }
            }
            // Préférences
            var prefs = [];
            var pMatch = userText.match(/(je préfère|j'aime|je veux|je utilise|I prefer|I like|I use|أفضل|أحب|أستخدم|أستعمل)\s*(.+)/i);
            if (pMatch) {
                var userStore = getAxonStore('axon_user');
                var current = userStore.length ? userStore[userStore.length-1] : {};
                current.name = current.name || document.getElementById('roleIA')?.value || '';
                current.speciality = document.getElementById('specialite')?.value || current.speciality || '';
                var pKey = 'pref_' + Date.now();
                current[pKey] = pMatch[2].trim().substring(0,100);
                userStore.push(current);
                setAxonStore('axon_user', userStore);
                prefs.push(pMatch[2].trim());
            }
            // Corrections
            var cMatch = userText.match(/(non|faux|pas|error|wrong|خطأ|لا|غلط|تصحيح)\s*(.+?)(\d+\s*(h|heure|min|jour|%)|officiel|officielle|officiel|officiel|document)/i);
            if (cMatch) {
                var corStore = getAxonStore('axon_corrections');
                var oldVal = aiText.match(/\d+\s*(h|heure|min|jour)/);
                corStore.push({ old: oldVal ? oldVal[0] : '?', new: cMatch[2].trim().substring(0,50), reason: cMatch[0].substring(0,60), confidence: 70, created: new Date().toISOString().split('T')[0] });
                corStore.sort(function(a,b) { return b.confidence - a.confidence; });
                if (corStore.length > 50) corStore = corStore.slice(0,50);
                setAxonStore('axon_corrections', corStore);
            }
            // Connaissances (règles APC, définitions)
            var kMatch = userText.match(/(compétence|compétence|compétence|APC|règle|rule|قاعدة|كفاءة)\s*[:=]\s*(.+)/i);
            if (kMatch && userText.length > 20) {
                var kStore = getAxonStore('axon_knowledge');
                var exists = kStore.some(function(item) { return item.content && item.content.indexOf(kMatch[2].trim().substring(0,30)) !== -1; });
                if (!exists) {
                    kStore.push({ id:'k_'+Date.now(), type:'rule', category:'APC', title: kMatch[2].trim().substring(0,60), content: kMatch[2].trim().substring(0,200), source:'conversation', confidence:85, created: new Date().toISOString().split('T')[0], last_used: new Date().toISOString().split('T')[0], use_count:1 });
                    if (kStore.length > 200) kStore = kStore.slice(-200);
                    setAxonStore('axon_knowledge', kStore);
                } else {
                    kStore.forEach(function(item) { if (item.content && item.content.indexOf(kMatch[2].trim().substring(0,30)) !== -1) { item.last_used = new Date().toISOString().split('T')[0]; item.use_count = (item.use_count||0)+1; } });
                    setAxonStore('axon_knowledge', kStore);
                }
            }
            // Statistiques
            var statsStore = getAxonStore('axon_statistics');
            statsStore.push({ event:'response', date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().split(' ')[0], userMsgLen: userText.length, aiMsgLen: aiText.length });
            if (statsStore.length > 1000) statsStore = statsStore.slice(-1000);
            setAxonStore('axon_statistics', statsStore);
        };
        // ⑥ Moteur de décision
        window.decisionEngine = function(userText) {
            var d = [];
            if (!/(rappelle[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|rappelle[\w-]*\s+moi\s+.{0,15}nom\s+complet|dis[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|dit[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|donne[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|c['’]est quoi mon nom|quel est mon nom|what('|i)?s\s+my\s+(full\s+)?name|what\s+is\s+my\s+(full\s+)?name|ما\s*اسمي|كيف\s*اسمي|شنو\s*اسمي|اشنو\s*اسمي|إيه\s*اسمي|ما\s*هو\s*اسمي)/i.test(userText) && /(appelle[\w-]*\s*moi|call\s+me|اسمي|ادعني|نادني)/i.test(userText)) d.push({ action:'update_name', priority:95 });
            if (/(non|faux|pas|error|wrong|خطأ|لا|غلط|تصحيح)/i.test(userText)) d.push({ action:'correct', priority:85 });
            if (/(je préfère|j'aime|je veux|I prefer|I like|I use|أفضل|أحب|أستخدم)/i.test(userText)) d.push({ action:'store_preference', priority:75 });
            if (/(compétence|compétence|APC|règle|rule|قاعدة|كفاءة)\s*[:=]/i.test(userText) && userText.length > 20) d.push({ action:'learn_knowledge', priority:65 });
            if (/(souviens-toi|remember|retiens|تذكر|احفظ)/i.test(userText)) d.push({ action:'store_fact', priority:90 });
            d.sort(function(a,b) { return b.priority - a.priority; });
            return d;
        };
        // ⑦ Moteur de qualité
        window.axonQualityScore = function(store, item) {
            var score = 50;
            if (item.source === 'explicit') score += 20;
            else if (item.source === 'correction') score += 25;
            else if (item.source === 'document') score += 15;
            else if (item.source === 'conversation') score += 10;
            var uc = item.use_count || 0;
            score += Math.min(uc * 5, 25);
            if (item.last_used) {
                var days = Math.floor((Date.now() - new Date(item.last_used).getTime()) / 86400000);
                if (days < 7) score += 10;
                else if (days < 30) score += 5;
            }
            return Math.min(Math.max(score, 0), 100);
        };
        // ⑧ Gestionnaire mémoire
        window.axonCleanMemory = function() {
            var stores = ['axon_user','axon_conversation','axon_knowledge','axon_corrections','axon_documents','axon_statistics','axon_cache'];
            stores.forEach(function(s) {
                var data = getAxonStore(s);
                if (!data || !data.length) return;
                var now = Date.now();
                if (s !== 'axon_user' && s !== 'axon_statistics') {
                    data = data.filter(function(item) {
                        if (!item.created) return true;
                        var age = Math.floor((now - new Date(item.created).getTime()) / 86400000);
                        return age <= 90;
                    });
                }
                if (s === 'axon_knowledge') {
                    data = data.filter(function(item) {
                        return axonQualityScore(s, item) >= 20;
                    });
                    data.sort(function(a,b) { return axonQualityScore(s, b) - axonQualityScore(s, a); });
                }
                setAxonStore(s, data);
            });
        };
        // ⑨ Index des connaissances
        window.axonKnowledgeManager = {
            add: function(item) {
                var kStore = getAxonStore('axon_knowledge');
                var exists = kStore.some(function(i) { return i.content && item.content && i.content.indexOf(item.content.substring(0,30)) !== -1; });
                if (exists) {
                    kStore.forEach(function(i) { if (i.content && item.content && i.content.indexOf(item.content.substring(0,30)) !== -1) { i.last_used = new Date().toISOString().split('T')[0]; i.use_count = (i.use_count||0)+1; i.confidence = axonQualityScore('axon_knowledge', i); i.utility = Math.min(Math.max((i.use_count||0)*8,10),100); } });
                } else {
                    item.id = 'k_'+Date.now();
                    item.created = new Date().toISOString().split('T')[0];
                    item.last_used = item.created;
                    item.use_count = 1;
                    item.confidence = axonQualityScore('axon_knowledge', item);
                    item.utility = 50;
                    kStore.push(item);
                    if (kStore.length > 200) kStore = kStore.slice(-200);
                }
                setAxonStore('axon_knowledge', kStore);
            },
            search: function(query) {
                var kStore = getAxonStore('axon_knowledge');
                var q = query.toLowerCase();
                return kStore.filter(function(item) {
                    return (item.title && item.title.toLowerCase().indexOf(q) !== -1) || (item.content && item.content.toLowerCase().indexOf(q) !== -1) || (item.tags && item.tags.some(function(t) { return t.toLowerCase().indexOf(q) !== -1; }));
                });
            },
            lifecycle: function(item) {
                if (!item.last_used) return 'new';
                var days = Math.floor((Date.now() - new Date(item.last_used).getTime()) / 86400000);
                if (days > 60) return 'archived';
                if (days > 30) return 'stale';
                if ((item.use_count||0) > 10) return 'core';
                return 'active';
            }
        };
        // Nom préféré (vérifie mémoire AXON avant le profil)
        window.getAxonPreferredName = function(fallback) {
            var userStore = getAxonStore('axon_user');
            for (var i = userStore.length - 1; i >= 0; i--) {
                if (userStore[i].name && _axonValidName(userStore[i].name)) return userStore[i].name;
            }
            return fallback || '';
        };
        initAxonMemory();
        var cb = document.getElementById('checkCompetenceBtn');
        if (cb) {
            cb.addEventListener('click', async function() {
                var el = document.getElementById('competence');
                var val = el?.value?.trim();
                var res = document.getElementById('competenceResult');
                var lang = document.documentElement?.lang || 'fr';
                if (!val) { res.innerHTML = '<span class="comp-msg error">' + (lang === 'ar' ? 'الرجاء إدخال كفاءة.' : lang === 'en' ? 'Please enter a competency.' : 'Veuillez saisir une compétence.') + '</span>'; return; }
                res.innerHTML = '<span class="comp-msg loading">🔍 ' + (lang === 'ar' ? 'تحليل قيد التنفيذ...' : lang === 'en' ? 'Analyzing...' : 'Analyse en cours...') + '</span>';
                try {
                    var lang = document.documentElement?.lang || 'fr';
                    var prompt = lang === 'ar' ? 'أنت خبير في صياغة كفاءات APC. حلل هذه الكفاءة بالتفصيل: "' + val + '". القاعدة: فعل قابل للملاحظة + موضوع + سياق + معيار جودة. اشرح ما ينقص أو ما يمكن تحسينه، ثم اقترح صيغة مصححة. أجب بدون عنوان كبير.' : lang === 'en' ? 'You are an expert in writing APC competencies. Analyze in detail: "' + val + '". Rule: Observable action verb + Object + Context + Quality criterion. Explain what is missing or can be improved, then suggest a corrected version. Answer without headings.' : 'Tu es un expert en rédaction de compétences APC. Analyse en détail : "' + val + '". Règle : Verbe d\'action observable + Objet + Contexte + Critère de qualité. Explique ce qui manque ou peut être amélioré, puis propose une formulation corrigée. Réponds sans titre ni en-tête.';
                    var msgs = [{ role: 'system', content: (lang === 'ar' ? 'أنت خبير في APC والتربية. أجب بالعربية.' : lang === 'en' ? 'You are an expert in APC and pedagogy. Answer in English.' : 'Tu es un expert en APC et en pédagogie. Réponds en français.') }, { role: 'user', content: prompt }];
                    var full = '';
                    await callAI(msgs, function(chunk) { full += chunk; res.innerHTML = '<span class="comp-msg">' + sanitizeHtml(markdownToHtml(full)) + '</span>'; }, null);
                } catch(e) { res.innerHTML = '<span class="comp-msg error">' + (lang === 'ar' ? 'خطأ: ' : lang === 'en' ? 'Error: ' : 'Erreur : ') + e.message + '</span>'; }
            });
        }
        (function _axonWaitUser() {
            if (typeof currentUser !== 'undefined' && currentUser && typeof initAxonSupabase === 'function') {
                // 🔐 Isolement multi-comptes : le localStorage appartient au user_id qui l'a peuplé.
                // Si un AUTRE compte se connecte sur ce navigateur, on vide les stores axon_* AVANT
                // la fusion/migration Supabase (sinon le nom/mémoire du compte précédent fuiterait
                // dans la mémoire Supabase du nouveau compte).
                try {
                    var owner = localStorage.getItem('axon_owner');
                    if (owner !== currentUser.id) {
                        var allAxon = ['axon_user','axon_conversation','axon_knowledge','axon_corrections','axon_documents','axon_statistics','axon_cache'];
                        allAxon.forEach(function(k) { localStorage.removeItem(k); });
                        localStorage.setItem('axon_owner', currentUser.id);
                    }
                } catch(e) {}
                initAxonSupabase();
            }
            else { setTimeout(_axonWaitUser, 500); }
        })();
restoreGammaData();
loadExamplesFromDB();
window.addEventListener('beforeunload', function() {
    if (gammaData) localStorage.setItem('gammaData', JSON.stringify(gammaData));
});
const themeBar = document.getElementById('gammaThemeBar');
if (themeBar) {
    Object.entries(GAMMA_THEMES).forEach(([k, v]) => {
        const btn = document.createElement('button');
        btn.className = 'theme-btn' + (gammaTheme === k ? ' active' : '');
        btn.dataset.theme = k;
        btn.textContent = v.name;
        btn.onclick = () => setGammaTheme(k);
        themeBar.appendChild(btn);
    });
}
applyTheme();

// Network overlay system — reusable animated graph
(function() {
    var overlay, canvas, ctx, animId, nodes, particles, connections, w, h, cx, cy;
    var currentData = null;

    var teamColors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6b9d','#c44dff'];
    var visionColors = ['#00d2ff','#7b2ff7','#ff6b6b','#00e676','#ffab00','#ff4081'];

    var teamData = {
        titleFR: '👥 Groupe APC Plus SBA',
        titleAR: '👥 مجموعة APC Plus SBA',
        nodes: [
            { nameFR: 'Aziz Mohamed Rostom', nameAR: 'محمد رستم عزيز' },
            { nameFR: 'Bouloum Boumediene', nameAR: 'بلولوم بومدين' },
            { nameFR: 'Faradji Said', nameAR: 'فرادجي سعيد' },
            { nameFR: 'Salah Manel', nameAR: 'صلاح منال' }
        ],
        colors: teamColors
    };

    var visionData = {
        titleFR: '🎯 Notre Vision',
        titleAR: '🎯 رؤيتنا',
        nodes: [
            {
                nameFR: 'Développement du secteur',
                nameAR: 'تطوير القطاع',
                descFR: 'Moderniser et renforcer le secteur de la formation professionnelle',
                descAR: 'تحديث وتعزيز قطاع التكوين المهني'
            },
            {
                nameFR: 'Confort des formateurs',
                nameAR: 'راحة المكونين',
                descFR: 'Offrir un environnement de travail optimal et des outils modernes',
                descAR: 'توفير بيئة عمل مثالية وأدوات حديثة'
            },
            {
                nameFR: 'Économie algérienne',
                nameAR: 'الاقتصاد الجزائري',
                descFR: 'Contribuer à la croissance économique par une main-d\'œuvre qualifiée',
                descAR: 'المساهمة في النمو الاقتصادي عبر يد عاملة مؤهلة'
            },
            {
                nameFR: 'Compétences professionnelles',
                nameAR: 'كفاءات محترفة',
                descFR: 'Former des professionnels compétents adaptés au marché du travail',
                descAR: 'تكوين محترفين أكفاء يتوافقون مع سوق العمل'
            }
        ],
        colors: visionColors
    };

    function showNetworkOverlay(data) {
        if (document.getElementById('networkOverlay')) return;
        currentData = data;
        overlay = document.createElement('div');
        overlay.id = 'networkOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.8s;';
        var closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'position:absolute;top:20px;right:30px;background:rgba(255,255,255,0.1);border:none;color:#fff;font-size:2rem;cursor:pointer;width:50px;height:50px;border-radius:50%;z-index:10;';
        closeBtn.addEventListener('click', closeNetwork);
        canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
        overlay.appendChild(canvas);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
        ctx = canvas.getContext('2d');
        resize();
        initNodes(data);
        animate();
        requestAnimationFrame(function() { overlay.style.opacity = '1'; });
    }

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        cx = w / 2; cy = h / 2;
    }

    function initNodes(data) {
        nodes = []; particles = []; connections = [];
        var lang = currentLang || 'fr';
        var items = data.nodes;
        var radius = Math.min(w, h) * 0.32;
        for (var i = 0; i < items.length; i++) {
            var angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
            nodes.push({
                nameFR: items[i].nameFR,
                nameAR: items[i].nameAR,
                descFR: items[i].descFR || '',
                descAR: items[i].descAR || '',
                x: cx, y: cy,
                tx: cx + Math.cos(angle) * radius, ty: cy + Math.sin(angle) * radius,
                color: data.colors[i % data.colors.length],
                angle: angle, dist: radius,
                phase: Math.random() * Math.PI * 2, animProgress: 0
            });
        }
        var titleFR = data.titleFR || 'Titre';
        var titleAR = data.titleAR || titleFR;
        nodes.push({ nameFR: titleFR, nameAR: titleAR, x: cx, y: cy, tx: cx, ty: cy, color: '#ffffff', angle: 0, dist: 0, phase: 0, animProgress: 1, isCenter: true });
        for (var j = 0; j < nodes.length; j++)
            for (var k = j + 1; k < nodes.length; k++)
                if (nodes[j].isCenter || nodes[k].isCenter) connections.push({ a: j, b: k });
        for (var p = 0; p < 80; p++) particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6, size: Math.random() * 2 + 0.5, alpha: Math.random() * 0.5 + 0.1 });
    }

    // ANIMATION ORIGINALE (retour)
    function animate() {
        var time = Date.now() / 1000;
        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);

        // Particles
        particles.forEach(function(p) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + (p.alpha * 0.3) + ')'; ctx.fill();
        });

        // Update nodes
        nodes.forEach(function(node) {
            if (node.isCenter) { node.x += (node.tx - node.x) * 0.03; node.y += (node.ty - node.y) * 0.03; return; }
            node.animProgress = Math.min(node.animProgress + 0.012, 1);
            var tx = cx + Math.cos(node.angle + time * 0.15) * node.dist;
            var ty = cy + Math.sin(node.angle + time * 0.15) * node.dist;
            node.tx = tx; node.ty = ty;
            node.x += (tx - node.x) * 0.035; node.y += (ty - node.y) * 0.035;
        });

        // Connections
        connections.forEach(function(conn) {
            var a = nodes[conn.a], b = nodes[conn.b];
            if (!a || !b) return;
            var dx = b.x - a.x, dy = b.y - a.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 5) return;
            var alpha = Math.min(b.animProgress, a.animProgress) * 0.3;
            // Line
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')'; ctx.lineWidth = 1; ctx.stroke();
            // Flowing dot
            var flow = (time * 0.5) % 1;
            ctx.beginPath(); ctx.arc(a.x + dx * flow, a.y + dy * flow, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 0.8) + ')'; ctx.fill();
        });

        // Draw nodes
        nodes.forEach(function(node) {
            if (node.isCenter) {
                ctx.font = 'bold ' + Math.round(Math.min(w, h) * 0.025) + 'px "Segoe UI",sans-serif';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(255,255,255,0.3)'; ctx.shadowBlur = 20;
                ctx.fillText(currentLang === 'ar' ? node.nameAR : node.nameFR, cx, cy); ctx.shadowBlur = 0;
                return;
            }
            var ap = node.animProgress;
            if (ap < 0.01) return;
            var pulse = 1 + Math.sin(time * 2 + node.phase) * 0.15;
            var r = (12 + Math.sin(time + node.phase) * 3) * (0.5 + ap * 0.5);
            // Glow
            var gr = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4 * pulse);
            gr.addColorStop(0, node.color + '33'); gr.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(node.x, node.y, r * 4 * pulse, 0, Math.PI * 2); ctx.fill();
            // Core
            var gd = ctx.createRadialGradient(node.x - r * 0.3, node.y - r * 0.3, 0, node.x, node.y, r * pulse);
            gd.addColorStop(0, '#fff'); gd.addColorStop(0.3, node.color); gd.addColorStop(1, node.color);
            ctx.shadowColor = node.color; ctx.shadowBlur = r * pulse;
            ctx.fillStyle = gd; ctx.beginPath(); ctx.arc(node.x, node.y, r * pulse, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // Labels (taille agrandie 0.024)
            var fs = Math.round(Math.min(w, h) * 0.024);
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8;
            var ly = node.y + r * pulse + 8;
            ctx.font = '600 ' + fs + 'px "Segoe UI",sans-serif';
            ctx.fillText(currentLang === 'ar' ? node.nameAR : node.nameFR, node.x, ly);
            ctx.shadowBlur = 0;
            var desc = currentLang === 'ar' ? node.descAR : node.descFR;
            if (desc) {
                ctx.font = fs * 0.55 + 'px "Segoe UI",sans-serif';
                ctx.fillStyle = 'rgba(255,255,255,0.45)';
                ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 4;
                ctx.fillText(desc, node.x, ly + fs + 2);
                ctx.shadowBlur = 0;
                ctx.font = fs * 0.5 + 'px "Segoe UI",sans-serif';
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.fillText(currentLang === 'ar' ? node.nameFR : node.nameAR, node.x, ly + fs * 2 + 4);
            } else {
                ctx.font = fs * 0.65 + 'px "Segoe UI",sans-serif';
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8;
                ctx.fillText(currentLang === 'ar' ? node.nameFR : node.nameAR, node.x, ly + fs + 4);
                ctx.shadowBlur = 0;
            }
        });
        animId = requestAnimationFrame(animate);
    }

    function closeNetwork() {
        if (animId) cancelAnimationFrame(animId);
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        overlay = null; canvas = null; ctx = null; currentData = null;
    }

    // Expose globally
    window.showTeamNetwork = function() { showNetworkOverlay(teamData); };
    window.showVisionNetwork = function() { showNetworkOverlay(visionData); };

    // Event delegation: detect click on .sig-trigger (👥 in footer)
    document.addEventListener('click', function(e) {
        var t = e.target;
        if (t.classList && t.classList.contains('sig-trigger')) {
            showTeamNetwork();
        }
        if (t.classList && t.classList.contains('vision-trigger')) {
            showVisionNetwork();
        }
    });
    document.addEventListener('mouseover', function(e) {
        var t = e.target;
        if (t.classList && (t.classList.contains('sig-trigger') || t.classList.contains('vision-trigger'))) {
            t.style.transform = 'scale(1.3)';
        }
    });
    document.addEventListener('mouseout', function(e) {
        var t = e.target;
        if (t.classList && (t.classList.contains('sig-trigger') || t.classList.contains('vision-trigger'))) {
            t.style.transform = 'scale(1)';
        }
    });
    window.addEventListener('resize', function() { if (canvas) resize(); });
})();

// ===== QUIZ SYSTEM =====
let quizEditData = null; // { slides: [{ slideTitle, questions: [{id,text,options,correctIndex,manual,selected}] }] }
let quizPublishedId = null;

function getQuizUrl(id) {
    var base = window.location.origin;
    if (!base || base === 'null' || base === 'file://') {
        var path = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        return path + 'quiz.html#code=' + id;
    }
    return base + '/quiz.html#code=' + id;
}

function ensureQuizUI() {
    if (document.getElementById('quizBtnInjected')) return;
    var bar = document.querySelector('.preso-export');
    if (!bar) return;
    var btn = document.createElement('button');
    btn.id = 'quizBtnInjected';
    btn.className = 'btn btn-secondary';
    btn.innerHTML = window.__compat && window.__compat.isEnabled ? window.__compat.replaceEmoji('🎯 Générer Quiz') : '🎯 Générer Quiz';
    btn.style.cssText = 'font-size:12px;background:linear-gradient(135deg,#7C3AED,#A855F7);color:#fff;border:none;';
    btn.onclick = openQuizGenerator;
    bar.appendChild(btn);
}
// Call ensureQuizUI after render
var origRender = renderGammaSlides;
renderGammaSlides = function() {
    origRender.apply(this, arguments);
    setTimeout(ensureQuizUI, 100);
};

function fixSlideTitle(title) {
    var map = {
        'Scénario Pédagogique APC': 'Présentation de la compétence',
        'Scénario pédagogique APC': 'Présentation de la compétence',
        'Analyse APC complète': 'Ce qu\'il faut connaître',
        'Analyse APC': 'Ce qu\'il faut connaître',
        'Ressources': 'Outils et ressources',
        'Situation Professionnelle de Référence': 'Le métier et ses missions',
        'Situation professionnelle de référence': 'Le métier et ses missions',
        'Phase 1 : Contextualisation': 'Mise en situation',
        'Phase 1: Contextualisation': 'Mise en situation',
        'Phase 1 Contextualisation': 'Mise en situation',
        'Phase 2 : Déstabilisation': 'Problème à résoudre',
        'Phase 2: Déstabilisation': 'Problème à résoudre',
        'Phase 2 Déstabilisation': 'Problème à résoudre',
        'Phase 3 : Construction Partie 1': 'Passons à la pratique (1/2)',
        'Phase 3: Construction Partie 1': 'Passons à la pratique (1/2)',
        'Phase 3 Construction Partie 1': 'Passons à la pratique (1/2)',
        'Phase 3 : Construction Partie 2': 'Passons à la pratique (2/2)',
        'Phase 3: Construction Partie 2': 'Passons à la pratique (2/2)',
        'Phase 3 Construction Partie 2': 'Passons à la pratique (2/2)',
        'Phase 4 : Intégration': 'Mission : cas pratique',
        'Phase 4: Intégration': 'Mission : cas pratique',
        'Phase 4 Intégration': 'Mission : cas pratique',
        'Phase 5 : Transfert': 'Nouveau défi',
        'Phase 5: Transfert': 'Nouveau défi',
        'Phase 5 Transfert': 'Nouveau défi',
        'Évaluation Par Compétences': 'Évaluation pratique',
        'Évaluation par compétences': 'Évaluation pratique',
        'Critères de Performance Observables': 'Ce qui sera observé',
        'Critères de performance observables': 'Ce qui sera observé',
        'Critères de Performance': 'Ce qui sera observé',
        'Grille Critérielle APC 4×4': 'Barème d\'évaluation',
        'Grille Critérielle APC 4x4': 'Barème d\'évaluation',
        'Grille critérielle APC 4×4': 'Barème d\'évaluation',
        'Grille Critérielle 4×4': 'Barème d\'évaluation',
        'Indicateurs de Réussite': 'Objectifs atteints ?',
        'Indicateurs de réussite': 'Objectifs atteints ?',
        'Conclusion Pédagogique': 'Ce que vous avez appris',
        'Conclusion pédagogique': 'Ce que vous avez appris'
    };
    return map[title] || title;
}

function openQuizGenerator(savedTimer, savedAttempts) {
    if (!gammaData || !gammaData.slides || gammaData.slides.length === 0) {
        showToast(t('quizGenerateFirst'));
        return;
    }
    var existing = document.getElementById('quizGeneratorModal');
    if (existing) existing.remove();
    var modal = document.createElement('div');
    modal.className = 'modal-overlay quiz-modal open';
    modal.id = 'quizGeneratorModal';
    var hasQuizData = quizEditData && quizEditData.slides && quizEditData.slides.length > 0;
    var compVal = (quizEditData?.competence || document.getElementById('competence')?.value?.trim() || gammaData?.title || '');
    var defaultTitle = quizEditData?.title || (compVal ? 'Quiz sur ' + compVal : '');
    modal.innerHTML = '<div class="modal" style="max-width:900px;">'
        + '<button class="modal-close" onclick="this.closest(\'.modal-overlay\').remove()">&times;</button>'
        + '<h2>' + t('quizGeneratorTitle') + '</h2>'
        + '<div class="quiz-title-config" style="margin-bottom:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'
        + '<label style="font-size:0.82rem;font-weight:600;color:var(--text-muted);">' + t('quizTitleLabel') + '</label>'
        + '<input type="text" id="quizTitleInput" value="' + esc(defaultTitle) + '" style="flex:1;min-width:200px;padding:8px 12px;border:1px solid var(--border);border-radius:8px;background:var(--surface-elev);color:var(--text);font-size:0.9rem;">'
        + '</div>'
        + '<div class="quiz-timer-config" style="margin-bottom:12px;padding:12px;background:var(--surface-elev);border-radius:12px;border:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap;">'
        + '<label style="font-size:0.82rem;font-weight:600;color:var(--text-muted);">' + t('quizQuestionsLabel') + '</label>'
        + '<input type="number" id="quizQuestionCount" min="10" max="50" value="' + Math.max(10, gammaData.slides.length) + '" style="width:70px;padding:6px 10px;font-size:0.85rem;">'
        + '<span style="font-size:0.78rem;color:var(--text-muted);">' + t('quizMin10') + '</span>'
        + '<span style="width:1px;height:24px;background:var(--border);margin:0 4px;"></span>'
        + '<label style="font-size:0.82rem;font-weight:600;color:var(--text-muted);">' + t('quizTimePerQuestion') + '</label>'
        + '<input type="number" id="quizTimeLimit" min="0" max="3600" value="' + (savedTimer || '0') + '" style="width:80px;padding:6px 10px;font-size:0.85rem;">'
        + '<span style="font-size:0.78rem;color:var(--text-muted);">' + t('quizSecondsHint') + '</span>'
        + '<span style="width:1px;height:24px;background:var(--border);margin:0 4px;"></span>'
        + '<label style="font-size:0.82rem;font-weight:600;color:var(--text-muted);">' + t('quizAttemptsLabel') + '</label>'
        + '<input type="number" id="quizMaxAttempts" min="0" max="99" value="' + (savedAttempts || '0') + '" style="width:70px;padding:6px 10px;font-size:0.85rem;">'
        + '<span style="font-size:0.78rem;color:var(--text-muted);">' + t('quizAttemptsHint') + '</span>'
        + '</div>'
        + '<p class="desc">' + (hasQuizData ? t('quizEditDesc') : t('quizClickBelow')) + '</p>'
        + '<div id="quizEditorContainer" class="quiz-editor">'
        + (hasQuizData ? renderQuizEditor() : '<div style="text-align:center;padding:40px;"><button class="btn btn-primary" onclick="generateQuizQuestions()" style="font-size:16px;padding:14px 32px;">' + t('quizGenerateBtn') + '</button><p style="margin-top:12px;color:var(--text-muted);font-size:0.85rem;">' + t('quizGenerateDesc') + '</p></div>')
        + '</div>'
        + '<div id="quizPublishArea" class="quiz-publish' + (quizPublishedId ? ' open' : '') + '">'
        + (quizPublishedId ? renderPublishArea() : '')
        + '</div>'
        + '<div class="btn-row" style="margin-top:16px;">'
        + (hasQuizData ? '<button class="btn btn-primary" onclick="publishQuiz()">' + t('quizPublishBtn') + '</button>' : '')
        + '<button class="btn btn-secondary" onclick="this.closest(\'.modal-overlay\').remove()">' + t('quizCloseBtn') + '</button>'
        + '</div>'
        + '</div>';
    document.body.appendChild(modal);
}

function renderQuizEditor() {
    if (!quizEditData || !quizEditData.slides) return '<p>' + t('quizNoData') + '</p>';
    var html = '';
    quizEditData.slides.forEach(function(sg, si) {
        var selectedCount = sg.questions.filter(function(q) { return q.selected; }).length;
        html += '<div class="quiz-slide-group">'
            + '<h4><span class="q-sg-num">' + (si+1) + '</span>' + fixSlideTitle(sg.slideTitle) + ' <span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;">(' + selectedCount + '/1 ' + t('quizSelectedLabel') + ')</span></h4>';
        sg.questions.forEach(function(q, qi) {
            var letters = ['A','B','C','D'];
            html += '<div class="quiz-question-row' + (q.selected ? ' selected' : '') + '" data-si="' + si + '" data-qi="' + qi + '">'
                + '<input type="checkbox" class="qq-check" ' + (q.selected ? 'checked' : '') + ' onchange="toggleQuizQuestion(' + si + ',' + qi + ',this.checked)" ' + (selectedCount >= 1 && !q.selected ? 'disabled' : '') + '>'
                + '<div class="qq-body">'
                + '<div class="qq-text">' + q.text + ' <span class="qq-badge ' + (q.manual ? 'manual' : 'auto') + '">' + (q.manual ? t('badgeManual') : t('badgeAI')) + '</span></div>'
                + '<div class="qq-options">';
            q.options.forEach(function(opt, oi) {
                var isCorrect = q.correctIndex === oi;
                html += '<label class="qq-opt' + (isCorrect ? ' correct' : '') + '">'
                    + '<input type="radio" name="correct_' + si + '_' + qi + '" value="' + oi + '" ' + (isCorrect ? 'checked' : '') + ' onchange="setQuizCorrect(' + si + ',' + qi + ',' + oi + ')">'
                    + '<span>' + letters[oi] + '. ' + opt + (isCorrect ? ' ✅' : '') + '</span>'
                    + '</label>';
            });
            html += '</div></div></div>';
        });
        html += '</div>';
    });
    html += '<div class="quiz-manual-area">'
        + '<button class="quiz-manual-toggle" onclick="requestMoreQuestions()" style="background:linear-gradient(135deg,#7C3AED,#A855F7);color:#fff;border:none;">' + t('quizAskMoreBtn') + '</button>'
        + '<button class="quiz-manual-toggle" onclick="toggleManualForm()" style="margin-left:8px;">＋ Ajouter une question manuelle</button>'
        + '<div class="quiz-manual-form" id="quizManualForm">'
        + '<input type="text" id="qmSlideSelect" placeholder="Numéro du slide (1-' + quizEditData.slides.length + ')" style="width:100%;">'
        + '<textarea id="qmText" rows="2" placeholder="Texte de la question"></textarea>'
        + '<div class="manual-options">'
        + '<input type="text" id="qmOptA" placeholder="Option A">'
        + '<input type="text" id="qmOptB" placeholder="Option B">'
        + '<input type="text" id="qmOptC" placeholder="Option C">'
        + '<input type="text" id="qmOptD" placeholder="Option D">'
        + '</div>'
        + '<div style="display:flex;align-items:center;gap:10px;margin-top:8px;"><label style="font-size:0.82rem;">Bonne réponse :</label>'
        + '<select id="qmCorrect" style="border:1px solid var(--border);border-radius:8px;padding:6px 12px;background:var(--surface-elev);color:var(--text);">'
        + '<option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option>'
        + '</select></div>'
        + '<button class="btn btn-primary" onclick="addManualQuestion()" style="margin-top:10px;">➕ Ajouter</button>'
        + '</div></div>';
    return html;
}

function renderPublishArea() {
    var quizUrl = getQuizUrl(quizPublishedId);
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem('quiz_' + quizPublishedId)); } catch(e) {}
    var pin = (stored && stored.pin) || '----';
    var qrImg = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(quizUrl);
    return '<div class="qp-title">' + t('quizPublishedBadge') + '</div>'
        + '<div style="text-align:center;margin:12px 0;padding:12px;background:var(--accent-glow);border-radius:12px;border:2px dashed var(--accent);">'
        + '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">' + t('quizPinLabel') + '</div>'
        + '<div style="font-size:2.2rem;font-weight:800;letter-spacing:6px;color:var(--accent);font-family:monospace;">' + pin + '</div>'
        + '</div>'
        + '<div class="qp-link" id="quizPublishLink">' + quizUrl + '</div>'
        + '<img class="qp-qr" src="' + qrImg + '" alt="QR Code" loading="lazy">'
        + '<div class="qp-actions">'
        + '<button class="btn btn-primary" onclick="copyQuizLink()">📋 Copier le lien</button>'
        + '<button class="btn btn-secondary" onclick="window.open(\'' + quizUrl + '\',\'_blank\')">🌐 Ouvrir</button>'
        + '<button class="btn btn-secondary" onclick="downloadQR()">📥 Télécharger QR</button>'
        + '</div>';
}

async function generateQuizQuestions() {
    if (!gammaData || !gammaData.slides) return;
    showToast('🤖 Génération des questions en cours...');
    var container = document.getElementById('quizEditorContainer');
    if (container) container.innerHTML = '<div class="preso-loading"><div class="loading-brain">🎮</div><div class="loading-text">Préparation du défi Quiz...</div><div class="loading-sub">L\'IA conçoit des questions pour valider votre compétence</div><div class="spinner" style="display:inline-block;width:36px;height:36px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite;margin-top:16px;"></div></div>';
    var slides = gammaData.slides;
    var compEl = document.getElementById('competence');
    var competence = compEl && compEl.value.trim() ? compEl.value.trim() : (gammaData?.title || '');
    if (!competence) {
        var saved = localStorage.getItem('lastAssistantResponse') || '';
        var m = saved.match(/comp[ée]tence[^:]*:\s*([^\n]+)/i);
        if (m) competence = m[1].trim();
    }
    var numQuestions = Math.max(10, parseInt(document.getElementById('quizQuestionCount')?.value) || slides.length);
    var assistantDoc = localStorage.getItem('lastAssistantResponse') || '';
    var contextContent = '';
    if (assistantDoc && assistantDoc.length > 200) {
        contextContent = assistantDoc.length > 6000 ? assistantDoc.slice(0, 6000) + '\n...' : assistantDoc;
    } else {
        contextContent = slides.map(function(s, i) {
            var items = (s.content || []).map(function(c) { return '    • ' + c; }).join('\n');
            return '  Slide ' + (i+1) + ' : ' + (s.title || 'Sans titre') + '\n' + items;
        }).join('\n');
    }
    var promptParts = {
        fr: {
            intro: 'Génère un QCM technique pour des stagiaires.',
            subject: 'SUJET',
            content: 'CONTENU PÉDAGOGIQUE DE RÉFÉRENCE',
            generate: 'Génère EXACTEMENT {n} questions. Chaque question doit être basée UNIQUEMENT sur le contenu ci-dessus.',
            practical: 'Chaque question doit être une question PRATIQUE et PRÉCISE sur le sujet technique.',
            slideTitle: 'Le titre de chaque rubrique (slideTitle) doit être un sous-sujet technique du domaine.',
            forbidden: 'INTERDICTION FORMELLE de ces mots : contextualisation, déstabilisation, intégration, transfert, critères de performance, grille critérielle, niveaux de maîtrise, indicateurs de réussite, évaluation, phase, objectif de la phase, remédiation, acquis, réinvestir, savoirs, attitudes.',
            format: '4 options par question, 1 seule correcte. Index 0-3.\nFormat JSON: {"slides":[{"slideTitle":"Sous-sujet technique","questions":[{"text":"Question?","options":["A","B","C","D"],"correctIndex":0}]}]}',
            output: 'Génère en français.\nSORS UNIQUEMENT le JSON valide.'
        },
        en: {
            intro: 'Generate a technical quiz for trainees.',
            subject: 'SUBJECT',
            content: 'REFERENCE PEDAGOGICAL CONTENT',
            generate: 'Generate EXACTLY {n} questions. Each question must be based ONLY on the content above.',
            practical: 'Each question must be a PRACTICAL and PRECISE question about the technical subject.',
            slideTitle: 'The title of each section (slideTitle) must be a technical sub-topic of the domain.',
            forbidden: 'STRICTLY FORBIDDEN words: contextualization, destabilization, integration, transfer, performance criteria, competency grid, mastery levels, success indicators, evaluation, phase, phase objective, remediation, acquired, reinvest, knowledge, attitudes.',
            format: '4 options per question, 1 correct. Index 0-3.\nJSON format: {"slides":[{"slideTitle":"Technical sub-topic","questions":[{"text":"Question?","options":["A","B","C","D"],"correctIndex":0}]}]}',
            output: 'Generate in English.\nOUTPUT ONLY valid JSON.'
        },
        ar: {
            intro: 'قم بإنشاء اختبار تقني للمتدربين.',
            subject: 'الموضوع',
            content: 'المحتوى التربوي المرجعي',
            generate: 'قم بإنشاء {n} سؤال بالضبط. يجب أن يعتمد كل سؤال فقط على المحتوى أعلاه.',
            practical: 'يجب أن يكون كل سؤال عمليًا ودقيقًا حول الموضوع التقني.',
            slideTitle: 'يجب أن يكون عنوان كل قسم (slideTitle) موضوعًا فرعيًا تقنيًا للمجال.',
            forbidden: 'ممنوع منعًا باتًا هذه الكلمات: السياق، زعزعة الاستقرار، التكامل، النقل، معايير الأداء، شبكة المعايير، مستويات الإتقان، مؤشرات النجاح، التقييم، المرحلة، هدف المرحلة، المعالجة، المكتسبات، إعادة الاستثمار، المعارف، الاتجاهات.',
            format: '4 خيارات لكل سؤال، إجابة واحدة صحيحة. الفهرس 0-3.\nتنسيق JSON: {"slides":[{"slideTitle":"موضوع فرعي تقني","questions":[{"text":"سؤال؟","options":["أ","ب","ج","د"],"correctIndex":0}]}]}',
            output: 'قم بالإنشاء باللغة العربية.\nأخرج فقط JSON صالح.'
        }
    };
    var p = promptParts[currentLang] || promptParts.fr;
    var prompt = p.intro + '\n\n'
        + p.subject + ' : "' + competence + '"\n\n'
        + p.content + ' :\n' + contextContent + '\n\n'
        + p.generate.replace('{n}', numQuestions) + '\n'
        + p.practical + '\n'
        + p.slideTitle + '\n\n'
        + p.forbidden + '\n\n'
        + p.format + '\n'
        + p.output;
    async function attemptGeneration(retries) {
        var sysPrompt = "Tu es un expert en évaluation pédagogique et en conception de QCM technique de haute qualité. Tu conçois des questions qui testent la COMPRÉHENSION RÉELLE et la CAPACITÉ D'APPLICATION, pas la mémorisation.\n\nRÈGLES DE QUALITÉ :\n- Chaque question doit être PRATIQUE et SITUATIONNELLE : confronte l'apprenant à un cas concret, un diagnostic, une décision ou une action à prendre\n- Les 4 options doivent être TOUTES plausibles, mais une seule correcte. Les distracteurs doivent refléter des erreurs ou confusions RÉELLES que ferait un apprenant\n- Évite les questions trop faciles ou trop évidentes : privilégie le raisonnement et l'analyse\n- Les questions doivent couvrir différents aspects du sujet : concepts fondamentaux, procédures, bonnes pratiques, cas particuliers\n- Le titre de chaque rubrique (slideTitle) doit être un sous-sujet technique précis du domaine\n- Le JSON retourné doit être parfaitement valide et bien formé";
        var msgs = [
            { role: 'system', content: sysPrompt },
            { role: 'user', content: prompt }
        ];
        var fullResponse = '';
        try {
            await callAI(msgs, function(chunk) { fullResponse += chunk; }, function() {});
            var jsonStr = fullResponse.trim();
            var start = jsonStr.indexOf('{');
            if (start === -1) throw new Error('JSON introuvable');
            var depth = 0, end = -1;
            for (var i = start; i < jsonStr.length; i++) {
                if (jsonStr[i] === '{') depth++;
                else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
            }
            if (end === -1) throw new Error('JSON mal formé');
            jsonStr = jsonStr.slice(start, end + 1);
            var data = JSON.parse(jsonStr);
            if (!data.slides) throw new Error('Pas de slides dans la réponse');
            competence = compEl && compEl.value.trim() ? compEl.value.trim() : (gammaData?.title || '');
            var titleInput = document.getElementById('quizTitleInput');
            var quizTitle = titleInput ? titleInput.value.trim() : (quizEditData?.title || competence || '');
            quizEditData = { slides: [], competence: competence, title: quizTitle };
            function flattenQuestions(sg, offset) {
                return (sg.questions || []).map(function(q, qi) {
                    return {
                        id: 'q_' + qi + '_' + Date.now(),
                        text: q.text || 'Question',
                        options: q.options && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
                        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
                        manual: false,
                        selected: true
                    };
                });
            }
            var allFlat = [];
            data.slides.forEach(function(sg) {
                allFlat = allFlat.concat(flattenQuestions(sg));
            });
            var savedTimer = document.getElementById('quizTimeLimit')?.value || '0';
            var savedAttempts = document.getElementById('quizMaxAttempts')?.value || '0';
            var totalQs = allFlat.length;
            if (totalQs < numQuestions && retries > 0) {
                var need = numQuestions - totalQs;
                showToast('🔁 L\'IA a fourni ' + totalQs + ' questions, re-génération de ' + need + ' supplémentaires...');
                var newPrompt = p.intro + '\n\n'
                    + p.subject + ' : "' + competence + '"\n\n'
                    + p.content + ' :\n' + contextContent + '\n\n'
                    + 'Génère EXACTEMENT ' + need + ' questions supplémentaires basées UNIQUEMENT sur le contenu ci-dessus.\n'
                    + p.practical + '\n'
                    + p.forbidden + '\n\n'
                    + p.format + '\n'
                    + p.output;
                var msgs2 = [{ role: 'user', content: newPrompt }];
                var resp2 = '';
                await callAI(msgs2, function(chunk) { resp2 += chunk; }, function() {});
                var json2 = resp2.trim();
                var s2 = json2.indexOf('{');
                var d2 = 0, e2 = -1;
                for (var i2 = s2; i2 < json2.length; i2++) { if (json2[i2] === '{') d2++; else if (json2[i2] === '}') { d2--; if (d2 === 0) { e2 = i2; break; } } }
                json2 = json2.slice(s2, e2 + 1);
                var data2 = JSON.parse(json2);
                if (data2.questions && Array.isArray(data2.questions)) {
                    data2.questions.forEach(function(qq) {
                        allFlat.push({ id: 'q_ai2_' + Date.now() + '_' + allFlat.length, text: qq.text || 'Question', options: qq.options && qq.options.length === 4 ? qq.options : ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: typeof qq.correctIndex === 'number' ? qq.correctIndex : 0, manual: false, selected: true });
                    });
                } else if (data2.slides && Array.isArray(data2.slides)) {
                    data2.slides.forEach(function(sg) {
                        (sg.questions || []).forEach(function(qq) {
                            allFlat.push({ id: 'q_ai2_' + Date.now() + '_' + allFlat.length, text: qq.text || 'Question', options: qq.options && qq.options.length === 4 ? qq.options : ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: typeof qq.correctIndex === 'number' ? qq.correctIndex : 0, manual: false, selected: true });
                        });
                    });
                }
            }
            allFlat.forEach(function(q, idx) {
                quizEditData.slides.push({
                    slideTitle: 'Q' + (idx + 1),
                    questions: [q]
                });
            });
            document.getElementById('quizGeneratorModal')?.remove();
            openQuizGenerator(savedTimer, savedAttempts);
            var finalTotal = quizEditData.slides.length;
            showToast('✅ ' + finalTotal + ' questions générées !' + (finalTotal < numQuestions ? ' (' + numQuestions + ' demandé, ' + finalTotal + ' reçu)' : ''));
        } catch (e) {
            if (retries > 0) {
                showToast('🔄 Retry génération... (' + retries + ' essai(s) restant)');
                return attemptGeneration(retries - 1);
            }
            throw e;
        }
    }
    try {
        await attemptGeneration(2);
    } catch (e) {
        console.error(e);
        if (container) container.innerHTML = '<div style="text-align:center;padding:20px;color:#FF6B6B;">❌ Erreur: ' + e.message + '<br><button class="btn btn-primary" onclick="generateQuizQuestions()" style="margin-top:12px;">🔄 Réessayer</button></div>';
        showToast('❌ Erreur de génération: ' + e.message);
    }
}

async function requestMoreQuestions() {
    var competence = quizEditData?.competence || gammaData?.title || '';
    if (!competence) { showToast('⚠️ Aucune compétence définie.'); return; }
    var n = parseInt(prompt('Combien de questions supplémentaires ?', '5')) || 5;
    if (n < 1) return;
    showToast('🤖 Génération de ' + n + ' questions...');
    var lang = currentLang === 'fr' ? 'français' : currentLang === 'en' ? 'english' : 'arabe';
    var prompt = 'Génère ' + n + ' nouvelles questions QCM sur le sujet : "' + competence + '".\n\n'
        + 'Chaque question doit être technique et précise, pas pédagogique.\n'
        + 'Chaque question est indépendante (pas de slideTitle, juste une question avec ses 4 options).\n'
        + 'Format JSON: {"questions":[{"text":"Q?","options":["A","B","C","D"],"correctIndex":0}]}\n'
        + 'Génère en ' + lang + '.\nSORS UNIQUEMENT le JSON valide.';
    var msgs = [{ role: 'user', content: prompt }];
    var fullResponse = '';
    try {
        await callAI(msgs, function(chunk) { fullResponse += chunk; }, function() {});
        var jsonStr = fullResponse.trim();
        var start = jsonStr.indexOf('{');
        if (start === -1) throw new Error('JSON introuvable');
        var depth = 0, end = -1;
        for (var i = start; i < jsonStr.length; i++) {
            if (jsonStr[i] === '{') depth++;
            else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
        }
        if (end === -1) throw new Error('JSON mal formé');
        jsonStr = jsonStr.slice(start, end + 1);
        var data = JSON.parse(jsonStr);
        var newQs = data.questions || [];
        if (newQs.length === 0) throw new Error('Aucune question générée');
        newQs.forEach(function(q, idx) {
            var slideIdx = quizEditData.slides.length;
            var newSlide = {
                slideTitle: competence.substring(0, 40) + ' (' + (idx+1) + ')',
                questions: [{
                    id: 'q_ai_' + Date.now() + '_' + idx,
                    text: q.text || 'Question',
                    options: q.options && q.options.length === 4 ? q.options : ['A', 'B', 'C', 'D'],
                    correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
                    manual: false,
                    selected: true
                }]
            };
            quizEditData.slides.push(newSlide);
        });
        var container = document.getElementById('quizEditorContainer');
        if (container) container.innerHTML = renderQuizEditor();
        updatePublishState();
        showToast('✅ ' + newQs.length + ' questions ajoutées !');
    } catch (e) {
        console.error(e);
        showToast('❌ Erreur: ' + e.message);
    }
}

function toggleQuizQuestion(si, qi, checked) {
    if (!quizEditData || !quizEditData.slides[si]) return;
    var q = quizEditData.slides[si].questions[qi];
    if (!q) return;
    var selected = quizEditData.slides[si].questions.filter(function(q) { return q.selected; });
    if (checked && selected.length >= 1) {
        showToast('⚠️ Maximum 1 question par slide (format Kahoot).');
        return;
    }
    q.selected = checked;
    // Refresh editor
    var container = document.getElementById('quizEditorContainer');
    if (container) container.innerHTML = renderQuizEditor();
    updatePublishState();
}

function setQuizCorrect(si, qi, oi) {
    if (!quizEditData || !quizEditData.slides[si]) return;
    quizEditData.slides[si].questions[qi].correctIndex = oi;
}

function toggleManualForm() {
    var form = document.getElementById('quizManualForm');
    if (form) form.classList.toggle('open');
}

function addManualQuestion() {
    var slideIdx = parseInt(document.getElementById('qmSlideSelect')?.value) - 1;
    if (isNaN(slideIdx) || slideIdx < 0 || slideIdx >= quizEditData.slides.length) {
        showToast('⚠️ Numéro de slide invalide (1-' + quizEditData.slides.length + ')');
        return;
    }
    var text = document.getElementById('qmText')?.value?.trim();
    if (!text) { showToast('⚠️ Entrez le texte de la question.'); return; }
    var opts = [
        document.getElementById('qmOptA')?.value?.trim() || 'Option A',
        document.getElementById('qmOptB')?.value?.trim() || 'Option B',
        document.getElementById('qmOptC')?.value?.trim() || 'Option C',
        document.getElementById('qmOptD')?.value?.trim() || 'Option D'
    ];
    var correct = parseInt(document.getElementById('qmCorrect')?.value || '0');
    var q = {
        id: 'q_manual_' + Date.now(),
        text: text,
        options: opts,
        correctIndex: correct,
        manual: true,
        selected: true
    };
    // Check if already 1 selected
    var selected = quizEditData.slides[slideIdx].questions.filter(function(q) { return q.selected; });
    if (selected.length >= 1) {
        showToast('⚠️ Ce slide a déjà 1 question sélectionnée.');
        return;
    }
    quizEditData.slides[slideIdx].questions.push(q);
    // Clear form
    ['qmText','qmOptA','qmOptB','qmOptC','qmOptD'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('qmCorrect').value = '0';
    var container = document.getElementById('quizEditorContainer');
    if (container) container.innerHTML = renderQuizEditor();
    updatePublishState();
    showToast('✅ Question manuelle ajoutée au slide ' + (slideIdx+1));
}

function updatePublishState() {
    if (!quizEditData) return;
    var totalSelected = 0;
    quizEditData.slides.forEach(function(sg) {
        totalSelected += sg.questions.filter(function(q) { return q.selected; }).length;
    });
    var publishBtn = document.querySelector('#quizGeneratorModal .btn-row .btn-primary');
    if (publishBtn) {
        var pbText = totalSelected > 0 ? t('quizPublishBtn') + ' (' + totalSelected + ' ' + t('quizQuestionsCount') + ')' : t('quizPublishBtn');
        if (window.__compat && window.__compat.isEnabled) publishBtn.innerHTML = pbText;
        else publishBtn.textContent = pbText;
    }
}

function publishQuiz() {
    if (!quizEditData) return;
    var timeLimit = parseInt(document.getElementById('quizTimeLimit')?.value) || 0;
    var maxAttempts = parseInt(document.getElementById('quizMaxAttempts')?.value) || 0;
    var quizTitle = (document.getElementById('quizTitleInput')?.value || quizEditData?.title || (quizEditData?.competence || gammaData?.title ? 'Quiz sur ' + (quizEditData?.competence || gammaData?.title) : '')).trim();
    if (!quizTitle) quizTitle = quizEditData?.competence || gammaData?.title || 'Quiz';
    // Check if updating an existing quiz
    var existingQuiz = null;
    if (quizPublishedId) {
        try { var eRaw = localStorage.getItem('quiz_' + quizPublishedId); if (eRaw) existingQuiz = JSON.parse(eRaw); } catch(e) {}
    }
    var quizId = existingQuiz ? existingQuiz.id : (Date.now() + '_' + Math.random().toString(36).slice(2, 6));
    var pin = existingQuiz ? String(existingQuiz.pin) : String(Math.floor(1000 + Math.random() * 9000));
    var quiz = {
        id: quizId,
        title: quizTitle,
        competence: quizEditData.competence || '',
        date: new Date().toISOString(),
        timeLimit: timeLimit,
        maxAttempts: maxAttempts,
        pin: pin,
        user_id: currentUser?.id || null,
        slides: []
    };
    var totalSelected = 0;
    quizEditData.slides.forEach(function(sg) {
        var selected = sg.questions.filter(function(q) { return q.selected; });
        if (selected.length > 0) {
            totalSelected += selected.length;
            quiz.slides.push({
                slideTitle: fixSlideTitle(sg.slideTitle),
                questions: selected.map(function(q) { return { id: q.id, text: q.text, options: q.options, correctIndex: q.correctIndex, manual: q.manual }; })
            });
        }
    });
    if (totalSelected === 0) { showToast('⚠️ Sélectionnez au moins 1 question.'); return; }
    try {
        localStorage.setItem('quiz_' + quizId, JSON.stringify(quiz));
    } catch (e) {
        showToast('❌ Erreur de sauvegarde. Trop de données ?');
        return;
    }
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        supabaseClient.from('quizzes').upsert({ id: quizId, user_id: currentUser?.id || null, title: quizTitle, data: quiz }, { onConflict: 'id' }).then(function(resp) {
            if (resp.error) console.warn('Supabase quiz save:', resp.error.message);
        }).catch(function(err) { console.warn('Supabase quiz save error:', err); });
    }
    quizPublishedId = quizId;
    var area = document.getElementById('quizPublishArea');
    if (area) {
        area.innerHTML = renderPublishArea();
        area.classList.add('open');
    }
    showToast(existingQuiz ? '✅ Quiz mis à jour ! ' + totalSelected + ' questions — lien et PIN inchangés.' : '✅ Quiz publié ! ' + totalSelected + ' questions — lien et QR prêts !');
    // Refresh published quizzes list if on quiz page
    if (typeof loadPublishedQuizzes === 'function') loadPublishedQuizzes();
}

function copyQuizLink() {
    var el = document.getElementById('quizPublishLink');
    if (!el) return;
    var text = el.textContent;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() { showToast('📋 Lien copié !'); });
    } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('📋 Lien copié !');
    }
}

function downloadQR() {
    var img = document.querySelector('.qp-qr');
    if (!img) return;
    var a = document.createElement('a');
    a.href = img.src;
    a.download = 'quiz_qr_' + quizPublishedId + '.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Re-render helper: ensure quiz button is present after slide change
(function() {
    var origGammaNext = document.getElementById('gammaNext')?.click;
    var origGammaPrev = document.getElementById('gammaPrev')?.click;
    document.addEventListener('click', function(e) {
        if (e.target.closest('#gammaNext') || e.target.closest('#gammaPrev')) {
            setTimeout(ensureQuizUI, 50);
        }
    });
})();

// page transition helpers
function goTo(url) {
    var c = document.querySelector('.container') || document.body;
    c.classList.remove('page-enter');
    c.classList.add('page-exit');
    setTimeout(function() { window.location.href = url; }, 250);
}
document.addEventListener('click', function(e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || a.hasAttribute('download') || a.target === '_blank') return;
    e.preventDefault();
    goTo(href);
});
// Compatibility mode init
if (window.__compat) { (function() { try { window.__compat.init(); document.getElementById('apcCompatBannerClose')?.addEventListener('click', function(){ document.getElementById('apcCompatBanner').style.display='none'; }); } catch(e) { console.warn('Compat init:', e); } })(); }
// apply entry animation
(function() {
    var c = document.querySelector('.container');
    if (c) { c.classList.add('page-enter'); }
})();
setLang(currentLang);
setTimeout(checkVersionNotification, 500);
setTimeout(checkBreakReminder, 800);
setInterval(checkBreakReminder, 300000);
// Fallback émoji Windows 7 : utiliser la police système au lieu de Twemoji (CDN lourd)
(function(){var d=document.createElement('style');d.textContent='body{font-family:"Segoe UI","Segoe UI Emoji","Segoe UI Symbol",system-ui,sans-serif}';document.head.appendChild(d);})();
// Footer copyright discret (3 langues)
setTimeout(function(){
    var f = document.querySelector('footer');
    if (f && !f.querySelector('.__apcCopy')) {
        var p = document.createElement('p');
        p.className = '__apcCopy';
        p.style.cssText = 'margin-top:12px;font-size:.75rem;color:var(--text-muted,#777);text-align:center;';
        p.textContent = currentLang === 'ar'
            ? '© 2026 APC Algérie GÉNÉRATION 3 — جميع الحقوق محفوظة.'
            : currentLang === 'en'
            ? '© 2026 APC Algeria GENERATION 3 — All rights reserved.'
            : '© 2026 APC Algérie GÉNÉRATION 3 — Tous droits réservés.';
        f.appendChild(p);
    }
}, 500);

/* ============================================================================
   APC v1.8.6 — PIPELINE D'IMAGES DES PRÉSENTATIONS
   Correctif « les images ne se génèrent pas sur toutes les slides »
   ----------------------------------------------------------------------------
   CAUSE (mesurée) : l'API d'images gratuite (pollinations.ai) autorise
   1 image toutes les 45 s par adresse IP ; au-delà elle répond HTTP 402.
   L'ancien code ne faisait AUCUNE requête (il fabriquait seulement une URL) :
   aucun échec n'était détecté, aucun réessai, aucune attente → 15 slides
   demandées d'un coup = la plupart des images manquantes.

   CE MODULE (ajouté, rien n'est supprimé) :
   1. file d'attente SÉQUENTIELLE respectant le quota + l'en-tête Retry-After ;
   2. clé Pollinations facultative (⚙️ Paramètres) → plus de quota par IP ;
   3. repli automatique sur Wikimedia Commons (gratuit, sans quota) pour
      qu'aucune slide ne reste sans image ;
   4. nombre d'images IA réglable (6 par défaut) pour un rendu complet rapide ;
   5. statut visible (🖼️ 3/6) + sauvegarde progressive des URLs.
   ============================================================================ */
(function () {
    'use strict';
    if (window.APC_IMG && window.APC_IMG.version) return;

    var K = { key: 'pol_key', model: 'pol_model', count: 'apc_img_count', fill: 'apc_img_fill' };
    var CFG = {
        gapFree: 46000,     // quota gratuit Pollinations : 1 image / 45 s / IP
        gapKey: 1500,       // avec clé personnelle : aucune limite par IP
        timeout: 90000,     // une génération prend 4-8 s ; marge large (réseau lent)
        attemptsFree: 3,
        defaultCount: 6
    };
    var S = { version: '1.9.5', token: 0, busy: false, lastFree: 0, blobs: {}, netFail: 0, blocked: false, used: {}, genCursor: 0,
              wmDown: false, wmCalls: 0, wmCache: {} };
    /* v1.9.4 : cache + budget des appels Wikimedia. Sans ça, une présentation de
       10 diapos enchaîne ~40 requêtes et l'API finit par répondre 429
       (« You are making too many requests ») : plus aucune image trouvée. */
    try { var _wc = JSON.parse(localStorage.getItem('apc_wm_cache') || '{}'); if (_wc && typeof _wc === 'object') S.wmCache = _wc; } catch (e) {}
    function wmCacheGet(k) { return Object.prototype.hasOwnProperty.call(S.wmCache, k) ? S.wmCache[k] : null; }
    function wmCacheSet(k, v) {
        if (Object.keys(S.wmCache).length > 240) S.wmCache = {};
        S.wmCache[k] = v;
        try { localStorage.setItem('apc_wm_cache', JSON.stringify(S.wmCache)); } catch (e) {}
    }
    function wmBudget() {
        if (S.wmDown) return false;
        if (S.wmCalls >= 26) return false;
        S.wmCalls++;
        return true;
    }

    /* ---------------- utilitaires ---------------- */
    function lsGet(k, d) { try { var v = localStorage.getItem(k); return (v === null || v === '') ? d : v; } catch (e) { return d; } }
    function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    function L(fr, ar, en) { var l = lsGet('lang', 'fr'); return l === 'ar' ? ar : (l === 'en' ? en : fr); }
    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function getKey() { return String(lsGet(K.key, '')).trim(); }
    function getCount() {
        var n = parseInt(lsGet(K.count, String(CFG.defaultCount)), 10);
        if (!n || n < 1) n = CFG.defaultCount;
        return Math.max(1, Math.min(n, 20));
    }
    function getFill() { return lsGet(K.fill, '1') !== '0'; }
    function seedOf(txt) {
        txt = String(txt || '');
        var h = 2166136261;
        for (var i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
        return Math.abs(h) % 99991;
    }

    /* ---------------- statut visible (bas droite) ---------------- */
    function ensureUI() {
        var el = document.getElementById('apcImgProg');
        if (el) return el;
        el = document.createElement('div');
        el.id = 'apcImgProg';
        el.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9600;min-width:220px;max-width:320px;'
            + 'background:rgba(12,22,34,.94);color:#fff;border:1px solid rgba(120,200,255,.35);border-radius:12px;'
            + 'padding:10px 12px;font-size:12px;line-height:1.4;box-shadow:0 8px 28px rgba(0,0,0,.45);display:none;';
        el.innerHTML = '<div style="display:flex;align-items:center;gap:8px;">'
            + '<span style="font-size:15px;">🖼️</span><span id="apcImgProgTxt" style="flex:1;">—</span></div>'
            + '<div style="height:4px;background:rgba(255,255,255,.15);border-radius:3px;margin-top:8px;overflow:hidden;">'
            + '<div id="apcImgProgBar" style="height:100%;width:0%;background:linear-gradient(90deg,#39a0ff,#7ce0a3);transition:width .4s ease;"></div></div>';
        document.body.appendChild(el);
        return el;
    }
    function setProgress(txt, pct) {
        var el = ensureUI();
        var t = document.getElementById('apcImgProgTxt');
        var b = document.getElementById('apcImgProgBar');
        el.style.display = 'block';
        if (t) t.textContent = txt;
        if (b && typeof pct === 'number') b.style.width = Math.max(0, Math.min(100, Math.round(pct * 100))) + '%';
    }
    function hideProgressLater(ms) {
        setTimeout(function () { var el = document.getElementById('apcImgProg'); if (el) el.style.display = 'none'; }, ms || 5000);
    }

    /* ---------------- URLs ---------------- */
    function freeUrl(prompt, seed) {
        // API gratuite : un seul modèle, 768 px max, 1 image / 45 s / IP.
        // Pas de model= ni nolicense= : ces paramètres sont ignorés depuis 2026.
        return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt)
            + '?width=768&height=576&seed=' + seed;
    }
    function keyUrl(prompt, seed) {
        var model = lsGet(K.model, 'black-forest-labs/flux.1-schnell');
        return 'https://gen.pollinations.ai/image/' + encodeURIComponent(prompt)
            + '?model=' + encodeURIComponent(model) + '&seed=' + seed + '&width=1024&height=768';
    }

    /* ---------------- requête unique (détection réelle des échecs) ---------------- */
    async function grab(urlStr, useKey) {
        var ctrl = null, timer = null;
        try { ctrl = new AbortController(); } catch (e) {}
        if (ctrl) timer = setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, CFG.timeout);
        var headers = {};
        if (useKey) { var k = getKey(); if (k) headers.Authorization = 'Bearer ' + k; }
        try {
            var r = await fetch(urlStr, {
                headers: headers,
                signal: ctrl ? ctrl.signal : undefined,
                mode: 'cors',
                credentials: 'omit'
            });
            var blob = r.ok ? await r.blob() : null;
            var ra = parseInt(r.headers.get('Retry-After') || '0', 10) || 0;
            return { ok: r.ok, status: r.status, blob: blob, retryAfter: ra };
        } catch (e) {
            return { ok: false, status: 0, blob: null, retryAfter: 0, error: e && e.message };
        } finally {
            if (timer) clearTimeout(timer);
        }
    }

    /* ---------------- voie 1 : API gratuite (séquencée + Retry-After) ---------------- */
    async function tryFree(prompt, seed) {
        var urlStr = freeUrl(prompt, seed);
        // v1.8.7 : si fetch est bloqué (CSP ou réseau), on cesse de vérifier et on laisse
        // le navigateur charger l'image par <img src="…"> — c'est autorisé par img-src https:
        if (S.blocked) return urlStr;
        for (var i = 0; i < CFG.attemptsFree; i++) {
            var wait = (S.lastFree + CFG.gapFree) - Date.now();
            if (wait > 0) await sleep(wait);
            var r = await grab(urlStr, false);
            S.lastFree = Date.now();
            if (r.ok && r.blob && r.blob.size > 800) return urlStr;

            if (r.status === 402 || r.status === 429) {
                var ra = r.retryAfter ? r.retryAfter * 1000 : CFG.gapFree;
                if (ra < 8000) ra = CFG.gapFree;            // Retry-After incohérent → marge normale
                S.lastFree = Date.now() + ra - CFG.gapFree; // le prochain tour attendra « ra »
                console.warn('🖼️ [images] quota gratuit atteint (402) → nouvelle tentative dans ' + Math.round(ra / 1000) + ' s');
            } else if (r.status === 0) {
                S.netFail++;
                if (S.netFail >= 2) {
                    S.blocked = true;
                    console.warn('🖼️ [images] fetch bloqué (CSP/réseau) → bascule en mode <img> direct, les images se chargeront seules');
                    return urlStr;
                }
                console.warn('🖼️ [images] réseau indisponible → nouvel essai dans 2 s');
                await sleep(2000);
            } else {
                console.warn('🖼️ [images] échec HTTP ' + r.status + ' : ' + urlStr.slice(0, 120));
                break;
            }
        }
        return '';
    }

    /* ---------------- voie 2 : clé Pollinations (aucun quota IP) ---------------- */
    async function tryKey(prompt, seed) {
        var urlStr = keyUrl(prompt, seed);
        var wait = (S.lastKey + CFG.gapKey) - Date.now();
        if (wait > 0) await sleep(wait);
        var r = await grab(urlStr, true);
        S.lastKey = Date.now();
        if (r.ok && r.blob && r.blob.size > 800) {
            try { S.blobs[urlStr] = URL.createObjectURL(r.blob); } catch (e) {}
            return urlStr;
        }
        console.warn('🖼️ [images] clé Pollinations refusée (HTTP ' + r.status + ') → repli sur l\'API gratuite');
        return '';
    }
    S.lastKey = 0;

    /* ---------------- voie 3 : repli Wikimedia Commons ---------------- */
    function commonsQuery(s) {
        var kw = keywords(s, 4);   // v1.9.1 : Commons fait un ET implicite → 4 mots maximum
        return kw.join(' ').replace(/\s+/g, ' ').slice(0, 140).trim();
    }
    // v1.8.8 : Wikimedia Commons ne trouve RIEN pour les requêtes en français
    // (« maintenance informatique » → 0 résultat, « vocational training » → 8).
    // On traduit donc les mots-clés métier FR → EN, puis on complète par des
    // requêtes génériques tournantes : chaque slide reçoit une image différente.
    var FR_EN = {
        'scenario': 'scenario', 'pedagogique': 'teaching', 'formation': 'training', 'apprentissage': 'learning',
        'evaluation': 'assessment', 'savoir': 'knowledge', 'competence': 'competence', 'atelier': 'workshop',
        'maintenance': 'maintenance', 'informatique': 'computer', 'ordinateur': 'computer', 'reseau': 'network',
        'securite': 'safety helmet', 'electricite': 'electricity', 'electrique': 'electrical', 'mecanique': 'mechanical',
        'soudure': 'welding', 'plomberie': 'plumbing', 'construction': 'construction', 'batiment': 'building',
        'froid': 'refrigeration', 'climatisation': 'air conditioning', 'automatisme': 'automation',
        'robotique': 'robotics', 'energie': 'energy', 'solaire': 'solar', 'mesure': 'measuring instrument',
        'outillage': 'tools', 'machine': 'machine', 'etudiant': 'student', 'apprenant': 'learner',
        'formateur': 'trainer', 'classe': 'classroom', 'projet': 'project', 'groupe': 'group', 'grille': 'grid',
        'critere': 'criteria', 'indicateur': 'indicator', 'ressource': 'resource', 'situation': 'situation',
        'professionnel': 'professional', 'professionnelle': 'professional', 'sante': 'health',
        'agriculture': 'agriculture', 'transport': 'transport', 'logistique': 'logistics', 'commerce': 'business',
        'gestion': 'management', 'documentation': 'documentation', 'schema': 'diagram', 'analyse': 'analysis',
        'objectif': 'objective', 'phase': 'phase', 'activite': 'activity', 'exercice': 'exercise',
        'conclusion': 'conclusion', 'introduction': 'introduction', 'presentation': 'presentation',
        'diagnostic': 'diagnosis', 'panne': 'breakdown', 'pannes': 'breakdown', 'cablage': 'wiring',
        'moteur': 'engine', 'capteur': 'sensor', 'actionneur': 'actuator', 'hydraulique': 'hydraulics',
        'pneumatique': 'pneumatics', 'usinage': 'machining', 'fraisage': 'milling', 'tournage': 'lathe',
        'chaudronnerie': 'metalwork', 'menuiserie': 'carpentry', 'coiffure': 'hairdressing',
        'cuisine': 'cooking', 'restauration': 'catering', 'vente': 'sales', 'comptabilite': 'accounting',
        'marketing': 'marketing', 'secretariat': 'office', 'communication': 'communication',
        'dessin': 'drawing', 'topographie': 'surveying', 'maconnerie': 'masonry', 'coffrage': 'formwork',
        'ferraillage': 'reinforcement', 'peinture': 'painting', 'isolation': 'insulation',
        'chauffage': 'heating', 'ventilation': 'ventilation', 'sanitaire': 'plumbing', 'eau': 'water',
        'assainissement': 'sanitation', 'electrotechnique': 'electrotechnics', 'programmation': 'programming',
        'donnees': 'data', 'cybersecurite': 'cybersecurity', 'prevention': 'prevention', 'risque': 'risk',
        'qualite': 'quality', 'norme': 'standard', 'incendie': 'fire', 'secours': 'rescue',
        'hygiene': 'hygiene', 'irrigation': 'irrigation', 'elevage': 'livestock', 'environnement': 'environment',
        'dechets': 'waste', 'recyclage': 'recycling', 'magasinage': 'warehouse', 'approvisionnement': 'supply',
        'tourisme': 'tourism', 'hotellerie': 'hospitality', 'entreprise': 'company', 'client': 'customer',
        'equipe': 'team', 'reunion': 'meeting', 'planning': 'planning', 'budget': 'budget', 'stock': 'inventory',
        'diagnostiquer': 'diagnosis', 'isoler': 'insulation', 'remplacer': 'replacement', 'circuit': 'circuit',
        'disjoncteur': 'circuit breaker', 'tableau': 'panel', 'technicien': 'technician', 'technique': 'technical',
        'normes': 'standards', 'conformite': 'compliance', 'delais': 'deadline', 'chantier': 'worksite',
        'proprete': 'cleanliness', 'rangement': 'storage', 'controle': 'inspection', 'isolement': 'insulation',
        'tension': 'voltage', 'multimetre': 'multimeter', 'schema': 'diagram', 'schemas': 'diagram',
        'notice': 'manual', 'equipements': 'equipment', 'protection': 'protection', 'individuelle': 'personal',
        'savoirs': 'knowledge', 'savoiretre': 'soft skills', 'savoirfaire': 'skills', 'criteree': 'criteria',
        'criteres': 'criteria', 'cable': 'cable', 'cables': 'cable', 'moteur': 'motor', 'pompe': 'pump',
        'vanne': 'valve', 'reservoir': 'tank', 'chaudiere': 'boiler', 'compresseur': 'compressor',
        'poste': 'station', 'reseau': 'network', 'serveur': 'server', 'logiciel': 'software',
        'materiel': 'hardware', 'fichier': 'file', 'sauvegarde': 'backup', 'virus': 'virus'
    };
    function deaccent(t) {
        t = String(t || '').toLowerCase();
        try { t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
        return t;
    }
    /* v1.9.0 : les images doivent refléter le CONTENU de la diapo, pas seulement son titre.
       On extrait donc les mots porteurs du contenu (les plus significatifs d'abord),
       en écartant les mots vides et les verbes de consigne sans valeur visuelle. */
    var STOP_FR = {
        les: 1, des: 1, une: 1, aux: 1, avec: 1, pour: 1, dans: 1, sur: 1, par: 1, plus: 1, est: 1, sont: 1,
        etre: 1, avoir: 1, fait: 1, faire: 1, cette: 1, ces: 1, son: 1, ses: 1, leur: 1, leurs: 1, qui: 1,
        que: 1, dont: 1, comme: 1, entre: 1, sans: 1, sous: 1, vers: 1, tout: 1, tous: 1, toute: 1,
        toutes: 1, ainsi: 1, chaque: 1, lors: 1, afin: 1, aussi: 1, tres: 1, bien: 1, peu: 1, meme: 1,
        autres: 1, alors: 1, donc: 1, car: 1, elle: 1, ils: 1, nous: 1, vous: 1, pas: 1, peut: 1, doivent: 1,
        doit: 1, permet: 1, permettre: 1, utiliser: 1, realise: 1, realiser: 1, effectuer: 1, respecter: 1,
        verifier: 1, identifier: 1, analyser: 1, definir: 1, citer: 1, decrire: 1, expliquer: 1, justifier: 1,
        proposer: 1, choisir: 1, preparer: 1, organiser: 1, controler: 1, mesurer: 1, calculer: 1, appliquer: 1,
        assurer: 1, mettre: 1, prendre: 1, donner: 1, selon: 1, partie: 1, parties: 1, ligne: 1, lignes: 1,
        page: 1, slide: 1, texte: 1, point: 1, points: 1, exemple: 1, exemples: 1, the: 1, and: 1, for: 1,
        with: 1, from: 1, this: 1, that: 1, are: 1, was: 1, were: 1,
        /* v1.9.2 : mots pédagogiques abstraits — ils ne décrivent aucune image et
           détournent la recherche (ils donnaient « knowledge », « criteria »…). */
        savoirs: 1, savoirfaire: 1, savoiretre: 1, competence: 1, competences: 1, objectif: 1, objectifs: 1,
        critere: 1, criteres: 1, criteree: 1, grille: 1, indicateur: 1, indicateurs: 1, ressource: 1,
        ressources: 1, situation: 1, deroulement: 1, duree: 1, modalite: 1, modalites: 1, evaluation: 1,
        analyse: 1, synthese: 1, conclusion: 1, introduction: 1, presentation: 1, contenu: 1, chapitre: 1,
        seance: 1, sequence: 1, methodologie: 1, activite: 1, exercice: 1, production: 1, attendu: 1,
        attendus: 1, indicateurs2: 1, prealable: 1, prerequis: 1, duree2: 1,
        /* v1.9.4 : mots « méta » de la grille d'évaluation — aucune photo ne les
           représente (« conformité » donnait un logo, « standards » un schéma). */
        conformite: 1, conformites: 1, delai: 1, delais: 1, respect: 1, respects: 1,
        norme: 1, normes: 1, standard: 1, standards: 1, exigence: 1, exigences: 1,
        prescription: 1, prescriptions: 1, tolerance: 1, tolerances: 1, critere2: 1,
        pertinence: 1, coherence: 1, exactitude: 1, precision: 1, qualite2: 1, soin: 1
    };
    function rawWords(s) {
        var contentTxt = '', titleTxt = (s && s.title) ? String(s.title) : '';
        if (s && Array.isArray(s.content)) contentTxt = s.content.join(' ');
        else if (s && typeof s.content === 'string') contentTxt = s.content;
        var clean = function (t) {
            return String(t).replace(/[#*|>\[\]`_~:(),.;!?«»"'\/\\]/g, ' ').replace(/\s+/g, ' ').trim();
        };
        // v1.9.4 : le titre passe en tête — mais les titres creux (« Analyse des
        // savoirs », « Grille critériée ») sont neutralisés par STOP_FR, donc seuls
        // les titres porteurs de sens (« Topographie », « Techniques de soudure »)
        // orientent la recherche, en plus du contenu.
        return clean(titleTxt + ' ' + contentTxt);
    }
    function keywords(s, max) {
        var words = rawWords(s).split(' '), out = [], seen = {};
        for (var i = 0; i < words.length && out.length < max; i++) {
            // v1.9.3 : on conserve l'orthographe d'origine (accents) pour Wikipédia/Commons
            var orig = words[i].replace(/[^0-9A-Za-zÀ-ÿ'-]/g, '');
            var key = deaccent(orig).replace(/[^a-z0-9]/g, '');
            if (key.length < 4 || STOP_FR[key] || seen[key] || /^[0-9]+$/.test(key)) continue;
            seen[key] = 1; out.push(orig);
        }
        return out;
    }
    function enQuery(s, max) {
        max = max || 3;            // v1.9.1 : 3 mots = requête précise (au-delà, Commons renvoie 0)
        var words = keywords(s, 30), out = [], seen = {};
        for (var i = 0; i < words.length && out.length < max; i++) {
            var e = FR_EN[deaccent(words[i]).replace(/[^a-z0-9]/g, '')];
            if (!e) continue;
            e.split(' ').forEach(function (x) { if (!seen[x] && out.length < max) { seen[x] = 1; out.push(x); } });
        }
        return out.join(' ').slice(0, 90).trim();
    }
    /* v1.9.3 : l'image de l'article Wikipédia correspondant au mot-clé du contenu
       est bien plus pertinente qu'une recherche plein texte sur Commons
       (« Multimètre » → photo de multimètre, « Disjoncteur » → disjoncteur).
       v1.9.4 : on n'accepte plus n'importe quelle image d'article —
         • les logos, armoiries, diagrammes, schémas et cartes sont écartés
           (« conformité » renvoyait le logo du Conseil constitutionnel,
            « normes » le schéma « Hiérarchie des normes ») ;
         • en recherche, le titre de l'article doit reprendre le mot-clé ;
         • si l'article exact existe mais n'a pas de photo correcte, on ne
           bascule pas sur une recherche floue : on passe au mot-clé suivant. */
    var BAD_TOKENS = {
        logo: 1, logos: 1, logotype: 1, icon: 1, icons: 1, icone: 1, icones: 1, pictogram: 1, pictogramme: 1,
        blason: 1, armoiries: 1, armoirie: 1, coat: 1, arms: 1, flag: 1, flags: 1, drapeau: 1, seal: 1, sceau: 1,
        emblem: 1, embleme: 1, signature: 1, stamp: 1, timbre: 1, banner: 1, bandeau: 1,
        diagram: 1, diagrams: 1, diagramme: 1, diagrammes: 1, schema: 1, schemas: 1, schematic: 1,
        hierarchie: 1, hierarchy: 1, organigramme: 1, flowchart: 1,
        map: 1, maps: 1, carte: 1, cartes: 1, graph: 1, graphs: 1, graphique: 1, chart: 1, charts: 1, courbe: 1
    };
    function fileTokens(src) {
        var name = String(src || '').split('?')[0].split('/').pop();
        try { name = decodeURIComponent(name); } catch (e) {}
        name = name.replace(/^\d+px-/, '').replace(/\.[a-z0-9]+$/i, '');
        return deaccent(name).split(/[^a-z0-9]+/).filter(function (t) { return t.length > 2; });
    }
    function isBadImage(src) {
        if (!src) return true;
        if (/\.svg(\?|$)/i.test(src)) return true;
        var t = fileTokens(src);
        for (var i = 0; i < t.length; i++) if (BAD_TOKENS[t[i]]) return true;
        return false;
    }
    function wmFetch(u, ms) {
        var opt = (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) ? { signal: AbortSignal.timeout(ms || 6000) } : undefined;
        return fetch(u, opt).then(function (r) {
            if (r.status !== 429 && r.status !== 403) return r;
            // petite pause puis une seule nouvelle tentative avant d'abandonner
            return new Promise(function (res) { setTimeout(res, 1500); }).then(function () {
                var o2 = (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) ? { signal: AbortSignal.timeout(ms || 6000) } : undefined;
                return fetch(u, o2);
            });
        }).catch(function () { return null; });
    }
    function getJson(u) {
        return wmFetch(u, 6000).then(function (r) {
            if (!r) return null;                                   // incident réseau ponctuel
            if (r.status === 429 || r.status === 403) { S.wmDown = true; return null; }
            return r.ok ? r.json() : null;
        }).catch(function () { return null; });
    }
    /* v1.9.4 : contrôle de SUJET — le nom du fichier doit citer le mot-clé
       (ou sa traduction anglaise). Sans ça, l'article « Respect » renvoyait
       une peinture et l'article « Technicien » une gravure de l'Odyssée. */
    function subjectTokens(s, extra) {
        var out = {}, add = function (t) {
            t = deaccent(t).replace(/[^a-z0-9]/g, '');
            if (t.length >= 4) out[t] = 1;
        };
        keywords(s, 8).forEach(function (w) {
            add(w);
            var e = FR_EN[deaccent(w).replace(/[^a-z0-9]/g, '')];
            if (e) String(e).split(' ').forEach(add);
        });
        if (extra) String(extra).split(/[^A-Za-z0-9]+/).forEach(add);
        return out;
    }
    function matchesSubject(src, subj) {
        if (!subj) return true;
        var t = fileTokens(src);
        for (var i = 0; i < t.length; i++) {
            if (subj[t[i]]) return true;
            for (var k in subj) {
                if (t[i].length >= 5 && k.length >= 5 && (t[i].indexOf(k) === 0 || k.indexOf(t[i]) === 0)) return true;
            }
        }
        return false;
    }
    /* v1.9.4 : note d'un fichier — plus il cite de mots du sujet, mieux c'est ;
       les photos (.jpg/.webp) passent avant les PNG, souvent des schémas. */
    function imgScore(u, subj) {
        var t = fileTokens(u), hits = 0;
        for (var i = 0; i < t.length; i++) {
            var hit = !!subj[t[i]];
            if (!hit) {
                for (var k in subj) {
                    if (t[i].length >= 5 && k.length >= 5 && (t[i].indexOf(k) === 0 || k.indexOf(t[i]) === 0)) { hit = true; break; }
                }
            }
            if (hit) hits++;
        }
        if (!hits) return 0;
        var s = hits;
        if (/\.(jpe?g|webp)(\?|$)/i.test(u)) s += 1;
        if (/\.png(\?|$)/i.test(u)) s -= 0.5;
        return s;
    }
    function pageImages(d, subj) {
        var pages = (d && d.query && d.query.pages) ? Object.values(d.query.pages) : [], out = [];
        for (var i = 0; i < pages.length; i++) {
            var p = pages[i] || {};
            if (p.missing !== undefined) continue;                              // page inexistante
            if (p.pageprops && p.pageprops.disambiguation !== undefined) continue; // page d'homonymie
            var im = p.thumbnail || p.original;
            if (!im || !im.source || !/^https:\/\//.test(im.source)) continue;
            if (isBadImage(im.source)) continue;
            if (!matchesSubject(im.source, subj)) continue;
            out.push({ title: String(p.title || ''), src: im.source });
        }
        return out;
    }
    async function wikiImage(q, subj) {
        subj = subj || subjectTokens({ content: [q] });
        var ck = 'w:' + q, hit = wmCacheGet(ck);
        if (hit !== null) return hit;
        if (!wmBudget()) return '';
        var found = '';
        // 1) article portant exactement ce titre (ou une redirection) : le plus fiable
        var exact = 'https://fr.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(q)
            + '&redirects=1&prop=pageimages|pageprops&piprop=thumbnail&pithumbsize=1024&format=json&origin=*';
        var d = await getJson(exact);
        if (d && d.query && d.query.pages) {
            var all = Object.values(d.query.pages);
            var exists = false;
            for (var i = 0; i < all.length; i++) if (all[i] && all[i].missing === undefined) exists = true;
            if (exists) {
                var ex = pageImages(d, subj);
                found = ex.length ? ex[0].src : '';   // article réel : pas de repli sur une recherche floue
                wmCacheSet(ck, found);
                return found;
            }
        }
        // 2) sinon recherche, mais seulement sur un titre qui reprend le mot-clé
        var key = deaccent(q).replace(/[^a-z0-9]/g, '');
        if (key.length < 4 || S.wmDown || !wmBudget()) { wmCacheSet(ck, ''); return ''; }
        var search = 'https://fr.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(q)
            + '&gsrlimit=5&prop=pageimages|pageprops&piprop=thumbnail&pithumbsize=1024&format=json&origin=*';
        var cands = pageImages(await getJson(search), subj);
        for (var c = 0; c < cands.length; c++) {
            var t = deaccent(cands[c].title).replace(/[^a-z0-9]/g, '');
            if (t && (t.indexOf(key) === 0 || key.indexOf(t) === 0)) { found = cands[c].src; break; }
        }
        wmCacheSet(ck, found);
        return found;
    }
    var GENERIC_Q = ['vocational training', 'classroom', 'workshop tools', 'computer lab', 'students learning',
        'training workshop', 'technical drawing', 'electrical engineering', 'maintenance'];
    /* v1.9.4 : mots anglais trop vagues pour servir de requête à eux seuls. */
    var GENERIC_EN = {
        security: 1, safety: 1, measurement: 1, control: 1, inspection: 1, management: 1,
        quality: 1, production: 1, training: 1, learning: 1, knowledge: 1, skills: 1, data: 1,
        service: 1, system: 1, equipment: 1, technology: 1, communication: 1, information: 1,
        energy: 1, power: 1, work: 1, time: 1, team: 1, company: 1, professional: 1, situation: 1,
        criteria: 1, assessment: 1, competence: 1, resource: 1, project: 1, group: 1, classroom: 1
    };
    // v1.8.9 : Wikimedia accepte « filetype:bitmap » → 100 % d'images exploitables
    // (avant : pages de livres .djvu, PDF, SVG… affichées comme des scans)
    function isBadMime(m) { return !/^image\/(jpeg|png|webp)$/i.test(String(m || '')); }
    async function commonsSearch(q) {
        var ck = 'c:' + q;
        var hit = wmCacheGet(ck);
        if (hit !== null) return hit;
        var empty = [];
        if (!wmBudget()) return empty;
        var u = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search'
            + '&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap')
            + '&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url|mime&iiurlwidth=1024&format=json&origin=*';
        var r = await wmFetch(u, 20000);
        if (!r) return empty;
        if (r.status === 429 || r.status === 403) { S.wmDown = true; return empty; }
        if (!r.ok) return empty;
        var d = await r.json();
        var pages = (d && d.query && d.query.pages) ? Object.values(d.query.pages) : [];
        var out = [];
        for (var i = 0; i < pages.length; i++) {
            var ii = pages[i].imageinfo && pages[i].imageinfo[0];
            if (!ii || isBadMime(ii.mime)) continue;
            var url = ii.thumburl || ii.url;
            if (!url || !/^https:\/\//.test(url)) continue;
            if (isBadImage(url)) continue;
            out.push(url);
        }
        wmCacheSet(ck, out);
        return out;
    }
    async function tryCommons(s) {
        try {
            var tries = [], seenQ = {};
            function add(q) { q = String(q || '').trim(); var k = q.toLowerCase(); if (q && !seenQ[k]) { seenQ[k] = 1; tries.push(q); } }
            var subj = subjectTokens(s);
            // 1) Wikipédia : l'article correspondant au mot-clé du contenu (le plus pertinent)
            var KWs = keywords(s, 6);
            for (var w = 0; w < KWs.length && w < 2 && !S.wmDown; w++) {
                var wi = await wikiImage(KWs[w], subj);
                if (wi && !S.used[wi]) {
                    S.used[wi] = 1;
                    console.log('🖼️ [images] Wikipédia ← « ' + KWs[w] + ' »');
                    return wi;
                }
            }
            // 2) Wikimedia Commons : un mot concret à la fois (le plus susceptible de
            //    tomber sur une photo du sujet), puis 3 et 2 mots, puis génériques
            var kwsAll = keywords(s, 8);
            for (var q1 = 0; q1 < kwsAll.length && q1 < 4; q1++) {
                var one = deaccent(kwsAll[q1]).replace(/[^a-z0-9]/g, '');
                var tr = FR_EN[one];
                if (!tr) continue;     // v1.9.4 : jamais de mot français brut (« station » → gare)
                // les traductions trop vagues (« security », « measurement ») ramènent
                // n'importe quoi : on ne les interroge pas seules
                var parts2 = tr.split(' '), vague = true;
                for (var z = 0; z < parts2.length; z++) if (!GENERIC_EN[parts2[z]]) { vague = false; break; }
                if (!vague) add(tr);
            }
            add(commonsQuery(s));
            add(enQuery(s, 3));
            add(enQuery(s, 2));
            for (var g = 0; g < 2; g++) add(GENERIC_Q[(g + (S.genCursor || 0)) % GENERIC_Q.length]);
            S.genCursor = (S.genCursor || 0) + 1;
            // 2a) dès qu'une requête donne un fichier qui parle vraiment du sujet, on s'arrête
            //     (avant, on interrogeait les 9 requêtes d'un coup → budget épuisé avant la
            //      dernière diapo, qui restait sans image)
            for (var t = 0; t < tries.length; t++) {
                if (S.wmDown) break;
                var urls = await commonsSearch(tries[t]);
                var pick = '', bestScore = 0.6;
                for (var i = 0; i < urls.length; i++) {
                    if (S.used[urls[i]]) continue;
                    var sc = imgScore(urls[i], subj);
                    if (sc > bestScore) { bestScore = sc; pick = urls[i]; }
                }
                if (pick) {
                    S.used[pick] = 1;
                    console.log('🖼️ [images] Wikimedia Commons ← « ' + tries[t] + ' »');
                    return pick;
                }
            }
            // 3) dernier recours : la pertinence n'est plus garantie, mais la slide reste illustrée
            for (var t2 = 0; t2 < tries.length; t2++) {
                var u2 = await commonsSearch(tries[t2]);
                for (var j = 0; j < u2.length; j++) {
                    if (S.used[u2[j]]) continue;
                    S.used[u2[j]] = 1;
                    console.log('🖼️ [images] Wikimedia Commons (large) ← « ' + tries[t2] + ' »');
                    return u2[j];
                }
            }
            return '';
        } catch (e) { return ''; }
    }

    /* ---------------- répartition des slides illustrées par l'IA ---------------- */
    function pickIndices(len, n) {
        n = Math.max(1, Math.min(n, len));
        var out = [];
        if (n === 1) return [0];
        for (var i = 0; i < n; i++) {
            var v = Math.round(i * (len - 1) / (n - 1));
            if (out.indexOf(v) === -1) out.push(v);
        }
        return out;
    }
    function buildPrompt(s) {
        var title = (s && s.title) ? String(s.title) : '';
        var kw = keywords(s, 14);          // mots issus du CONTENU de la diapo
        var model = '';
        try { model = String((s && s.image_prompt) || '').trim(); } catch (e) {}
        var parts = [];
        if (model) parts.push(model.slice(0, 190));
        if (title) parts.push(title);
        if (kw.length) parts.push(kw.join(', '));
        var base = parts.join('. ').slice(0, 430);
        if (!base) base = 'illustration pedagogique';
        return base + ', educational illustration, clean, professional, no text';
    }

    /* ---------------- persistance / rendu ---------------- */
    function persist() {
        try { if (typeof gammaData !== 'undefined' && gammaData) localStorage.setItem('gammaData', JSON.stringify(gammaData)); } catch (e) {}
    }
    function safeRender() {
        try { if (typeof renderGammaSlides === 'function') renderGammaSlides(); } catch (e) {}
    }
    function apcDisplayUrl(urlStr) {
        if (!urlStr) return '';
        return S.blobs[urlStr] ? S.blobs[urlStr] : urlStr;
    }

    /* ---------------- une image (clé → gratuit → Commons) ---------------- */
    async function oneImage(s) {
        var prompt = buildPrompt(s);
        var seed = seedOf(prompt);
        // v1.8.7 : en mode <img> direct (fetch bloqué), la clé est inutilisable
        // (un <img> ne peut pas envoyer l'en-tête Authorization) → on passe au gratuit
        if (getKey() && !S.blocked) {
            var ku = await tryKey(prompt, seed);
            if (ku) return { url: ku, source: 'pollkey' };
        }
        var fu = await tryFree(prompt, seed);
        if (fu) return { url: fu, source: 'pollinations' };
        var cu = await tryCommons(s);
        if (cu) return { url: cu, source: 'commons' };
        return null;
    }

    /* ---------------- file d'attente principale ---------------- */
    async function runPipeline(slides) {
        slides = slides || [];
        if (!slides.length) return [];
        S.wmDown = false; S.wmCalls = 0;   // v1.9.4 : nouveau budget Wikimedia à chaque présentation
        var tok = ++S.token;
        S.busy = true;
        var out = slides.map(function () { return ''; });
        var idx = pickIndices(slides.length, getCount());
        var fill = getFill();
        var total = idx.length + (fill ? Math.max(0, slides.length - idx.length) : 0);
        var done = 0;
        try {
            for (var k = 0; k < idx.length; k++) {
                if (tok !== S.token) return out;
                var s = slides[idx[k]];
                if (!s) continue;
                setProgress(L('Image ' + (done + 1) + '/' + total + ' — ' + (getKey() ? 'génération…' : 'génération (≈45 s entre chaque)…'),
                    'الصورة ' + (done + 1) + '/' + total + ' — جارٍ الإنشاء…',
                    'Image ' + (done + 1) + '/' + total + ' — generating…'), done / Math.max(1, total));
                var res = await oneImage(s);
                if (tok !== S.token) return out;
                if (res) {
                    s.image_url = res.url;
                    s.image_source = res.source;
                    out[idx[k]] = res.url;
                    persist();
                    safeRender();
                }
                done++;
            }
            if (fill) {
                for (var j = 0; j < slides.length; j++) {
                    if (tok !== S.token) return out;
                    var sl = slides[j];
                    if (!sl || sl.image_url) continue;
                    setProgress(L('Image ' + (done + 1) + '/' + total + ' — complément (Wikimedia Commons)…',
                        'الصورة ' + (done + 1) + '/' + total + ' — استكمال بصور ويكيميديا…',
                        'Image ' + (done + 1) + '/' + total + ' — Wikimedia Commons…'), done / Math.max(1, total));
                    var cu = await tryCommons(sl);
                    if (cu) {
                        sl.image_url = cu;
                        sl.image_source = 'commons';
                        out[j] = cu;
                        persist();
                        safeRender();
                    }
                    done++;
                }
            }
            if (tok === S.token) {
                var nb = out.filter(Boolean).length;
                setProgress(L('✅ ' + nb + '/' + slides.length + ' slides illustrées',
                    '✅ ' + nb + '/' + slides.length + ' شريحة مصوّرة',
                    '✅ ' + nb + '/' + slides.length + ' illustrated slides'), 1);
                hideProgressLater(4500);
            }
            return out;
        } finally {
            if (tok === S.token) S.busy = false;
        }
    }

    /* ---------------- rechargement des images générées avec une clé ---------------- */
    async function apcRestoreGenImages() {
        try {
            if (typeof gammaData === 'undefined' || !gammaData || !Array.isArray(gammaData.slides)) return;
            if (!getKey()) return;
            var need = gammaData.slides.filter(function (s) { return s && s.image_source === 'pollkey' && s.image_url && !S.blobs[s.image_url]; });
            for (var i = 0; i < need.length; i++) {
                var s = need[i];
                var r = await grab(s.image_url, true);
                if (r.ok && r.blob) { try { S.blobs[s.image_url] = URL.createObjectURL(r.blob); safeRender(); } catch (e) {} }
                await sleep(1200);
            }
        } catch (e) {}
    }

    /* ---------------- réglages (⚙️ Paramètres) ---------------- */
    function injectSettings() {
        if (!document.getElementById('modalSaveBtn')) return;
        if (document.getElementById('pollinationsKeyInput')) { syncSettings(); return; }
        var anchor = document.getElementById('geminiApiKeyInput');
        var group = (anchor && anchor.closest) ? anchor.closest('.field-group') : null;
        if (!group || !group.parentNode) return;
        var div = document.createElement('div');
        div.className = 'field-group';
        div.id = 'apcImgSettings';
        var counts = [4, 6, 8, 10, 15];
        div.innerHTML =
            '<label>🖼️ ' + L('Clé API Pollinations (images)', 'مفتاح Pollinations للصور', 'Pollinations API key (images)') + '</label>'
            + '<div class="hint">' + L(
                'Facultatif. Sans clé : 1 image toutes les 45 s (limite gratuite) — avec une clé (enter.pollinations.ai) : illimité, sans logo.',
                'اختياري. بدون مفتاح: صورة كل 45 ثانية. مع مفتاح: بلا حدود وبدون شعار.',
                'Optional. Without a key: 1 image every 45 s (free limit) — with a key (enter.pollinations.ai): unlimited, no logo.') + '</div>'
            + '<input type="text" id="pollinationsKeyInput" placeholder="sk_...">'
            + '<div style="margin-top:10px;display:flex;gap:14px;flex-wrap:wrap;align-items:center;font-size:12px;">'
            + '<label style="display:flex;align-items:center;gap:6px;">'
            + L('Images IA par présentation', 'صور لكل عرض', 'AI images per deck') + ' '
            + '<select id="apcImgCountSelect" style="padding:3px 6px;">'
            + counts.map(function (v) { return '<option value="' + v + '">' + v + '</option>'; }).join('')
            + '</select></label>'
            + '<label style="display:flex;align-items:center;gap:6px;">'
            + '<input type="checkbox" id="apcImgFillChk"> '
            + L('Compléter avec Wikimedia Commons', 'إكمال بصور ويكيميديا', 'Fill with Wikimedia Commons')
            + '</label></div>';
        group.parentNode.insertBefore(div, group.nextSibling);
        syncSettings();
        var btn = document.getElementById('modalSaveBtn');
        if (btn) btn.addEventListener('click', saveSettings);
    }
    function syncSettings() {
        var k = document.getElementById('pollinationsKeyInput'); if (k) k.value = String(lsGet(K.key, ''));
        var c = document.getElementById('apcImgCountSelect'); if (c) c.value = String(getCount());
        var f = document.getElementById('apcImgFillChk'); if (f) f.checked = getFill();
    }
    function saveSettings() {
        var k = document.getElementById('pollinationsKeyInput'); if (k) lsSet(K.key, k.value.trim());
        var c = document.getElementById('apcImgCountSelect'); if (c) lsSet(K.count, c.value);
        var f = document.getElementById('apcImgFillChk'); if (f) lsSet(K.fill, f.checked ? '1' : '0');
    }
    var _origLoadKeys = window.loadKeysIntoModal;
    window.loadKeysIntoModal = function () {
        try { if (typeof _origLoadKeys === 'function') _origLoadKeys(); } catch (e) {}
        try { injectSettings(); } catch (e) {}
    };
    setTimeout(function () { try { injectSettings(); } catch (e) {} }, 700);

    /* ---------------- API publique + remplacement des fonctions d'origine ---------------- */
    window.APC_IMG = {
        version: S.version,
        run: runPipeline,
        displayUrl: apcDisplayUrl,
        blobs: S.blobs,
        getCount: getCount,
        setCount: function (n) { lsSet(K.count, String(n)); },
        restore: apcRestoreGenImages
    };
    window.apcDisplayUrl = apcDisplayUrl;

    // Les fonctions d'origine restent définies (aucune suppression) : elles ne sont
    // simplement plus appelées — on leur substitue la version séquencée.
    generateImage = function (prompt) { return freeUrl(prompt, seedOf(prompt)); };
    generateAllImages = function (slides) { return runPipeline(slides || []); };
    retrySlideImage = async function (idx) {
        try {
            if (typeof gammaData === 'undefined' || !gammaData || !gammaData.slides || !gammaData.slides[idx]) return;
            var s = gammaData.slides[idx];
            setProgress(L('Nouvelle image…', 'صورة جديدة…', 'New image…'), 0.15);
            var res = await oneImage(s);
            if (res) {
                s.image_url = res.url;
                s.image_source = res.source;
                setProgress(L('✅ Image ajoutée', '✅ تمت إضافة الصورة', '✅ Image added'), 1);
            } else {
                setProgress(L('⚠️ Aucune image disponible pour l\'instant', '⚠️ لا توجد صورة متاحة الآن', '⚠️ No image available right now'), 1);
            }
            persist();
            safeRender();
            hideProgressLater(3500);
        } catch (e) { console.warn('🖼️ [images] retrySlideImage:', e && e.message); }
    };

    // Premier rendu après chargement : résout les images générées avec une clé
    setTimeout(function () {
        try { if (typeof gammaData !== 'undefined' && gammaData && gammaData.slides) { safeRender(); apcRestoreGenImages(); } } catch (e) {}
    }, 1500);

    console.log('🖼️ [APC_IMG] pipeline images v' + S.version + ' actif — '
        + (getKey() ? 'clé Pollinations détectée (aucun quota IP)' : 'mode gratuit : 1 image / 45 s par IP')
        + ' · ' + getCount() + ' images IA + ' + (getFill() ? 'complément Commons' : 'pas de complément'));
})();