'use strict'; console.log('✅ challenges.js CHARGÉ');
/* ===== CHALLENGE GLOBALS ===== */
var challengeEditData = null;
var challengeTeamsData = [];
var challengeRoundsData = [];
var challengeParticipantsData = [];
var currentChallengeId = null;

function initChallengePage() {
    populateChallengeObjectiveSelect('chManualObjective', 'chManualObjectiveCustom');
    loadChallengeAssistantSection();
    loadPublishedChallenges();
    renderGamificationDashboard();
}

/* ===== ASSISTANT IA → CHALLENGE ===== */
function loadChallengeAssistantSection() {
    var container = document.getElementById('assistantChallengeList');
    if (!container) return;
    var allConvs = [];
    try { allConvs = JSON.parse(localStorage.getItem('ai_conversations') || '[]'); } catch(e) {}
    var lastResp = localStorage.getItem('lastAssistantResponse');
    var hasConvs = allConvs.length > 0;
    var hasLast = lastResp && lastResp.length >= 50;
    if (hasConvs) {
        var html = '<div style="margin-bottom:8px;"><h4 style="font-size:0.85rem;margin:0 0 4px 0;color:var(--text);">📚 ' + t('challengeFromAssistantDesc') + '</h4></div>';
        allConvs.slice(0, 10).forEach(function(c, idx) {
            var preview = '';
            var msgs = c.messages || [];
            var lastAssistant = '';
            for (var i = msgs.length - 1; i >= 0; i--) { if (msgs[i].role === 'assistant') { lastAssistant = msgs[i].html || msgs[i].content || ''; break; } }
            var txt = lastAssistant.replace(/<[^>]*>/g, '');
            preview = txt.length > 100 ? txt.substring(0, 100) + '...' : txt;
                var combined = '';
                msgs.forEach(function(m) { var t = m.content || ''; if (t && m.role === 'user') combined += '\n' + t + '\n'; });
                var competences = _extractCompetences(combined);
            var bgColor = idx % 2 === 0 ? 'var(--surface-elev)' : 'transparent';
            html += '<div class="conv-item" onclick="openChallengeFromConversation(' + idx + ')" style="cursor:pointer;display:flex;align-items:center;gap:8px;padding:8px 12px;background:' + bgColor + ';border-radius:8px;border:1px solid var(--border);margin-bottom:4px;">'
                + '<span style="font-size:1.1rem;flex-shrink:0;">💬</span>'
                + '<div style="flex:1;min-width:0;">'
                + '<div style="font-size:0.78rem;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(c.title || 'Conversation') + '</div>'
                + '<div style="font-size:0.7rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(preview) + '</div>'
                + '<div style="font-size:0.65rem;color:var(--text-muted);display:flex;gap:4px;flex-wrap:wrap;align-items:center;">' + (c.date || '') + ' ' + (c.time || '') + competences.map(function(cp) { return '<span style="background:var(--accent-glow);color:var(--accent);padding:1px 8px;border-radius:10px;font-size:0.65rem;font-weight:600;">🎯 ' + esc(cp) + '</span>'; }).join('') + '</div>'
                + '</div>'
                + '<span style="font-size:0.75rem;color:var(--accent);flex-shrink:0;">🎮 ' + t('challengeAssistantBtn') + '</span>'
                + '</div>';
        });
        container.innerHTML = html;
    } else if (hasLast) {
        container.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--surface-elev);border-radius:12px;border:1px solid var(--border);flex-wrap:wrap;gap:8px;">'
            + '<div style="flex:1;min-width:0;">'
            + '<span style="font-size:0.78rem;color:var(--text-muted);display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">💬 "' + esc(lastResp.length > 120 ? lastResp.substring(0, 120) + '...' : lastResp) + '"</span>'
            + '</div>'
            + '<button class="btn btn-primary" onclick="openChallengeGeneratorFromAssistant()" style="font-size:11px;background:linear-gradient(135deg,#E65100,#FF8F00);flex-shrink:0;">🎮 ' + t('challengeAssistantBtn') + '</button></div>'
            + '<div style="margin-top:8px;padding:8px 12px;background:var(--accent-glow);border-radius:8px;border:1px solid var(--accent);">'
            + '<p style="font-size:0.78rem;color:var(--text-muted);margin:0;">' + t('challengeFromAssistantDesc') + '</p></div>';
    } else {
        container.innerHTML = '<div style="padding:12px 16px;background:var(--surface-elev);border-radius:12px;border:1px solid var(--border);">'
            + '<span style="font-size:0.85rem;color:var(--text-muted);">' + t('challengeAssistantNoResponse') + '</span></div>';
    }
}

function openChallengeFromConversation(convIdx) {
    try {
        var allConvs = JSON.parse(localStorage.getItem('ai_conversations') || '[]');
        var conv = allConvs[convIdx];
        if (!conv || !conv.messages || !conv.messages.length) { showToast(t('challengeAssistantNoResponse')); return; }
        var combined = '';
        conv.messages.forEach(function(m) {
            var txt = m.content || '';
            if (txt && m.role === 'user') combined += '\n' + txt + '\n';
        });
        if (combined.length < 50) { showToast(t('challengeAssistantNoResponse')); return; }
        var competences = _extractCompetences(combined);
        if (competences.length === 0) competences = [''];
        _pickCompetence(competences, function(chosen) {
            localStorage.setItem('lastAssistantResponse', combined);
            challengeEditData = {
                title: chosen ? '🎮 Challenge : ' + chosen : t('challengeFromAssistantTitle'),
                type: 'group',
                source: 'assistant',
                theme: chosen,
                config: { teamsAuto: true, roundsCount: 3, questionsPerRound: 5, timeLimit: 0 }
            };
            challengeTeamsData = [];
            challengeRoundsData = [];
            challengeParticipantsData = [];
            showChallengeConfigModal();
        });
    } catch(e) { showToast(t('errGeneric') + e.message); }
}

function _pickCompetence(competences, callback) {
    if (competences.length === 1) { callback(competences[0]); return; }
    var cardStyle = 'background:var(--surface,#1e1e2a);color:var(--text,#eee);border-radius:20px;padding:32px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.5);';
    var html = '<div style="' + cardStyle + '">'
        + '<div style="margin-bottom:20px;"><span style="font-size:28px;">🎯</span><h2 style="margin:8px 0 4px;font-size:1.1rem;">' + t('challengeSelectCompetence') + '</h2>'
        + '<p style="font-size:0.82rem;color:var(--text-muted);margin:0;">Plusieurs compétences trouvées dans cette conversation. Choisissez celle à utiliser.</p></div>';
    competences.forEach(function(c, idx) {
        html += '<div onclick="__pickCb(' + idx + ')" style="cursor:pointer;padding:12px 16px;margin-bottom:6px;background:var(--surface-elev);border-radius:12px;border:1px solid var(--border);font-size:0.85rem;display:flex;align-items:center;gap:10px;">'
            + '<span style="font-size:1.2rem;">🎯</span><span>' + esc(c) + '</span></div>';
    });
    html += '<div class="btn-row" style="margin-top:12px;"><button class="btn btn-secondary" onclick="_closeOverlay(\'__compPickOverlay\')">' + t('cancelBtn') + '</button></div></div>';
    window.__pickCb = function(idx) { _closeOverlay('__compPickOverlay'); callback(competences[idx]); };
    _createOverlay('__compPickOverlay', html);
}



function openChallengeGeneratorFromAssistant() {
    try {
        var lastResp = localStorage.getItem('lastAssistantResponse');
        if (!lastResp || lastResp.length < 50) {
            showToast(t('challengeAssistantNoResponse'));
            return;
        }
        var competences = _extractCompetences(lastResp);
        if (competences.length === 0) competences = [''];
        _pickCompetence(competences, function(chosen) {
            challengeEditData = {
                title: chosen ? '🎮 Challenge : ' + chosen : t('challengeFromAssistantTitle'),
                type: 'group',
                source: 'assistant',
                theme: chosen,
                config: { teamsAuto: true, roundsCount: 3, questionsPerRound: 5, timeLimit: 0 }
            };
            challengeTeamsData = [];
            challengeRoundsData = [];
            challengeParticipantsData = [];
            showChallengeConfigModal();
        });
    } catch(e) { showToast(t('errGeneric') + e.message); }
}

function showChallengeConfigModal() {
    _closeOverlay('__challengeConfigOverlay');
    var title = challengeEditData ? challengeEditData.title || t('challengeNew') : t('challengeNew');
    var type = challengeEditData ? challengeEditData.type : 'group';
    var cardStyle = 'background:var(--surface,#1e1e2a);color:var(--text,#eee);border-radius:20px;padding:32px;max-width:520px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.5);max-height:90vh;overflow-y:auto;';
    var html = '<div style="' + cardStyle + '">'
        + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><span style="font-size:28px;">🎮</span><h2 style="margin:0;font-size:1.2rem;">' + t('challengeConfigTitle') + '</h2></div>'
        + '<div class="field-group"><label>' + t('challengeTitleLabel') + '</label>'
        + '<input type="text" id="chCfgTitle" value="' + esc(title) + '" style="width:100%;padding:8px 12px;border:2px solid var(--border);border-radius:10px;font-size:.9rem;background:var(--bg);color:var(--text);box-sizing:border-box;"></div>'
        + '<div class="field-group"><label>' + t('challengeThemeLabel') + '</label>'
        + '<input type="text" id="chCfgTheme" value="' + esc(challengeEditData && challengeEditData.theme ? challengeEditData.theme : '') + '" placeholder="' + t('challengeThemePlaceholder') + '" style="width:100%;padding:8px 12px;border:2px solid var(--border);border-radius:10px;font-size:.9rem;background:var(--bg);color:var(--text);box-sizing:border-box;">'
        + '<div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">' + t('challengeThemeHint') + '</div></div>'
        + '<div class="field-group"><label>' + t('challengeSpecialtyLabel') + '</label>'
        + '<input type="text" id="chCfgSpecialty" value="' + esc(challengeEditData && challengeEditData.specialty ? challengeEditData.specialty : '') + '" placeholder="' + t('challengeSpecialtyPlaceholder') + '" style="width:100%;padding:8px 12px;border:2px solid var(--border);border-radius:10px;font-size:.9rem;background:var(--bg);color:var(--text);box-sizing:border-box;"></div>'
        + '<div class="field-group"><label>' + t('challengeObjectiveLabel') + '</label>'
        + '<select id="chCfgObjective" onchange="onChallengeObjectiveSelect(\'chCfgObjective\',\'chCfgObjectiveCustom\')" style="width:100%;padding:8px 12px;border:2px solid var(--border);border-radius:10px;font-size:.9rem;background:var(--bg);color:var(--text);"></select>'
        + '<input type="text" id="chCfgObjectiveCustom" placeholder="' + (currentLang === 'ar' ? 'اكتب هدفك المخصص...' : currentLang === 'en' ? 'Type your custom objective...' : 'Tapez votre objectif personnalisé...') + '" style="display:none;width:100%;padding:8px 12px;border:2px solid var(--accent);border-radius:10px;font-size:.9rem;background:var(--bg);color:var(--text);box-sizing:border-box;margin-top:6px;"></div>'
        + '<div class="field-group"><label>' + t('challengeTypeLabel') + '</label>'
        + '<select id="chCfgType" style="width:100%;padding:8px 12px;border:2px solid var(--border);border-radius:10px;font-size:.9rem;background:var(--bg);color:var(--text);">'
        + '<option value="group"' + (type==='group'?' selected':'') + '>👥 ' + t('challengeTypeGroup') + '</option>'
        + '<option value="team"' + (type==='team'?' selected':'') + '>👤 ' + t('challengeTypeIndividual') + '</option>'
        + '<option value="tournament"' + (type==='tournament'?' selected':'') + '>🏆 ' + t('challengeTypeTournament') + '</option>'
        + '</select></div>'
        + '<div class="field-group"><label>' + t('challengeTeamsLabel') + '</label>'
        + '<select id="chCfgTeamsMode" style="width:100%;padding:8px 12px;border:2px solid var(--border);border-radius:10px;font-size:.9rem;background:var(--bg);color:var(--text);">'
        + '<option value="auto">🤖 ' + t('challengeTeamsAuto') + '</option>'
        + '<option value="manual">✏️ ' + t('challengeTeamsManual') + '</option>'
        + '</select></div>'
        + '<div class="field-group"><label>' + t('challengeTeamsCountLabel') + '</label>'
        + '<select id="chCfgTeamsCount" style="width:100%;padding:8px 12px;border:2px solid var(--border);border-radius:10px;font-size:.9rem;background:var(--bg);color:var(--text);">'
        + '<option value="2">2 ' + t('challengeTeams') + '</option>'
        + '<option value="3" selected>3 ' + t('challengeTeams') + '</option>'
        + '<option value="4">4 ' + t('challengeTeams') + '</option>'
        + '<option value="5">5 ' + t('challengeTeams') + '</option>'
        + '</select></div>'
        + '<div class="field-group"><label>' + t('challengeRoundsLabel') + '</label>'
        + '<select id="chCfgRounds" style="width:100%;padding:8px 12px;border:2px solid var(--border);border-radius:10px;font-size:.9rem;background:var(--bg);color:var(--text);">'
        + '<option value="1">1 ' + t('challengeRound') + '</option>'
        + '<option value="2">2 ' + t('challengeRounds') + '</option>'
        + '<option value="3" selected>3 ' + t('challengeRounds') + '</option>'
        + '<option value="4">4 ' + t('challengeRounds') + '</option>'
        + '<option value="5">5 ' + t('challengeRounds') + '</option>'
        + '</select></div>'
        + '<div class="field-group"><label>' + t('challengeDurationLabel') + '</label>'
        + '<select id="chCfgDuration" style="width:100%;padding:8px 12px;border:2px solid var(--border);border-radius:10px;font-size:.9rem;background:var(--bg);color:var(--text);">'
        + '<option value="0">' + t('challengeNoLimit') + '</option>'
        + '<option value="300">5 ' + t('challengeMinutes') + '</option>'
        + '<option value="600">10 ' + t('challengeMinutes') + '</option>'
        + '<option value="900" selected>15 ' + t('challengeMinutes') + '</option>'
        + '<option value="1800">30 ' + t('challengeMinutes') + '</option>'
        + '<option value="3600">60 ' + t('challengeMinutes') + '</option>'
        + '</select></div>'
        + '<div class="btn-row" style="margin-top:20px;justify-content:flex-end;">'
        + '<button class="btn btn-secondary" onclick="_closeOverlay(\'__challengeConfigOverlay\')" style="font-size:13px;">' + t('cancelBtn') + '</button>'
        + '<button class="btn btn-primary" onclick="confirmChallengeConfig()" style="font-size:13px;background:linear-gradient(135deg,#E65100,#FF8F00);">🎮 ' + t('challengeGenerateBtn') + '</button></div></div>';
    _createOverlay('__challengeConfigOverlay', html);
    populateChallengeObjectiveSelect('chCfgObjective', 'chCfgObjectiveCustom');
    // Pre-select saved objective if editing
    if (challengeEditData && challengeEditData.objective) {
        var obj = challengeEditData.objective;
        var sel = document.getElementById('chCfgObjective');
        var inp = document.getElementById('chCfgObjectiveCustom');
        if (typeof obj === 'object' && obj.value) {
            var found = false;
            for (var i = 0; i < CHALLENGE_OBJECTIVES_LIBRARY.length; i++) {
                if (CHALLENGE_OBJECTIVES_LIBRARY[i].value === obj.value) {
                    sel.value = obj.value;
                    found = true;
                    break;
                }
            }
            if (!found) {
                // Custom or saved objective
                sel.value = '__custom__';
                if (inp) {
                    inp.value = obj[currentLang] || obj.fr || '';
                    inp.style.display = 'block';
                }
            }
        }
    }
}

function confirmChallengeConfig() {
    var title = document.getElementById('chCfgTitle').value.trim() || t('challengeNew');
    var theme = document.getElementById('chCfgTheme').value.trim();
    var specialty = document.getElementById('chCfgSpecialty').value.trim();
    var type = document.getElementById('chCfgType').value;
    var teamsMode = document.getElementById('chCfgTeamsMode').value;
    var teamsCount = parseInt(document.getElementById('chCfgTeamsCount')?.value) || 3;
    var rounds = parseInt(document.getElementById('chCfgRounds').value) || 3;
    var duration = parseInt(document.getElementById('chCfgDuration').value) || 0;
    if (!challengeEditData) challengeEditData = {};
    challengeEditData.title = title;
    challengeEditData.theme = theme;
    challengeEditData.specialty = specialty;
    var objectiveSelect = document.getElementById('chCfgObjective');
    var objectiveCustom = document.getElementById('chCfgObjectiveCustom');
    var objectiveVal = objectiveSelect ? objectiveSelect.value : '';
    var objectiveData = null;
    if (objectiveVal === '__custom__' || (objectiveCustom && objectiveCustom.style.display !== 'none' && objectiveCustom.value.trim())) {
        var customText = objectiveCustom ? objectiveCustom.value.trim() : '';
        if (customText) {
            var customId = 'custom_' + Date.now();
            objectiveData = { value: customId, icon: '🎯', fr: customText, ar: customText, en: customText };
        }
    } else if (objectiveVal.indexOf('__saved_') === 0) {
        var savedVal = objectiveVal.replace('__saved_', '').replace('__', '');
        var saved = getCustomObjectives();
        saved.forEach(function(o) { if (o.value === savedVal) objectiveData = { value: o.value, icon: o.icon, fr: o.fr, ar: o.ar, en: o.en }; });
    } else {
        CHALLENGE_OBJECTIVES_LIBRARY.forEach(function(o) { if (o.value === objectiveVal) objectiveData = { value: o.value, icon: o.icon, fr: o.fr, ar: o.ar, en: o.en }; });
    }
    if (!objectiveData) objectiveData = { value: objectiveVal, icon: '🎯', fr: objectiveVal, ar: objectiveVal, en: objectiveVal };
    challengeEditData.objective = objectiveData;
    challengeEditData.type = type;
    challengeEditData.config = challengeEditData.config || {};
    challengeEditData.config.teamsAuto = (teamsMode === 'auto');
    challengeEditData.config.teamsCount = teamsCount;
    challengeEditData.config.roundsCount = rounds;
    challengeEditData.config.timeLimit = duration;
    _closeOverlay('__challengeConfigOverlay');
    if (challengeEditData.source === 'assistant') {
        generateChallengeFromAssistant();
    } else {
        showToast('✅ Configuration enregistrée. Ajoutez les épreuves et participants.');
    }
}

async function generateChallengeFromAssistant() {
    // Afficher un écran de chargement
    var loadHtml = '<div style="background:var(--surface,#1e1e2a);color:var(--text,#eee);border-radius:20px;padding:40px;max-width:400px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5);">'
        + '<div style="font-size:48px;margin-bottom:16px;animation:spin 1.2s linear infinite;">🔄</div>'
        + '<h2 style="margin:0 0 8px;font-size:1.1rem;">' + t('challengeGenerating') + '</h2>'
        + '<p style="font-size:0.85rem;color:var(--text-muted,#999);margin:0;">' + t('challengeGeneratingDesc') + '</p>'
        + '<style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style></div>';
    _createOverlay('__challengeLoadingOverlay', loadHtml);
    showToast('🎮 Génération du challenge par l\'IA...');
    var theme = challengeEditData.theme || '';
    var roundsCount = challengeEditData.config.roundsCount || 3;

    // Équipes prédéfinies (pas besoin de les générer)
    var teamTemplates = [
        { name: 'Innovateurs', name_ar: 'المبتكرون', color: '#E65100' },
        { name: 'Stratèges', name_ar: 'الاستراتيجيون', color: '#1565C0' },
        { name: 'Pionniers', name_ar: 'الرواد', color: '#2E7D32' },
        { name: 'Experts', name_ar: 'الخبراء', color: '#6A1B9A' },
        { name: 'Visionnaires', name_ar: 'أصحاب الرؤى', color: '#C62828' }
    ];
    var numTeams = challengeEditData.type === 'group' ? (challengeEditData.config?.teamsCount || 3) : 0;
    challengeTeamsData = teamTemplates.slice(0, numTeams).map(function(t, idx) {
        return { name: t.name, name_ar: t.name_ar, color: t.color, sort_order: idx };
    });

    // Rounds vides (titres simples)
    challengeRoundsData = [];
    for (var r = 0; r < roundsCount; r++) {
        challengeRoundsData.push({
            title: 'Round ' + (r+1),
            title_ar: 'جولة ' + (r+1),
            title_en: 'Round ' + (r+1),
            round_type: 'quiz', max_score: 20, sort_order: r,
            questions: [], data: {}
        });
    }

    // Prompt court : uniquement les questions + critères, sans contexte pour éviter les limites API
    var qPerRound = 3;
    var prompt = 'Génère ' + (roundsCount * qPerRound) + ' questions QCM et 3 critères de performance (formation pro, thème: "' + theme + '").\n'
        + 'C\'EST UN QUIZ TECHNIQUE POUR LES STAGIAIRES : AUCUNE question sur la pédagogie ni la structure du document (durées des phases, scénario pédagogique, activités du formateur ou des stagiaires, grille critérielle, niveaux de maîtrise, indicateurs de réussite, évaluation, objectifs de phase, savoirs/savoir-faire/savoir-être, contextualisation, déstabilisation, intégration, transfert, remédiation, conclusion).\n'
        + 'TOUTES les questions doivent être TECHNIQUES sur le thème : procédures concrètes, outils, matériaux, calculs, normes, réglages, gestes professionnels, dépannage, vocabulaire technique du métier.\n'
        + 'Les critères de performance doivent être techniques et observables sur le métier (ex: précision, sécurité, conformité aux normes, temps de réalisation), PAS pédagogiques.\n'
        + 'Questions réparties en ' + roundsCount + ' rounds (' + qPerRound + '/round).\n'
        + 'JSON: {"rounds":[{"questions":[{"text":"Q?","options":["A","B","C","D"],"correctIndex":0}]}],"criteria":[{"fr":"Critère","weight":33}]}\n'
        + 'Langue: ' + currentLang + '. JSON UNIQUEMENT.';

    var msgs = [{ role: 'user', content: prompt }];
    var fullResponse = '';

    try {
        // Tentative avec modèle par défaut (laisse le fallback gérer automatiquement)
        await callAI(msgs, function(chunk) { fullResponse += chunk; }, function() {});
        var jsonStr = fullResponse.trim();
        var start = jsonStr.indexOf('{');
        if (start === -1) { var cb = jsonStr.indexOf('```'); if (cb !== -1) { jsonStr = jsonStr.substring(cb + 3); start = jsonStr.indexOf('{'); } }
        if (start === -1) throw new Error('JSON introuvable');
        var depth = 0, end = -1;
        for (var i = start; i < jsonStr.length; i++) { if (jsonStr[i] === '{') depth++; else if (jsonStr[i] === '}') { depth--; if (depth === 0) { end = i; break; } } }
        if (end === -1) throw new Error('JSON mal formé');
        jsonStr = jsonStr.slice(start, end + 1);
        try { var data = JSON.parse(jsonStr); }
        catch (e2) { jsonStr = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']'); try { var data = JSON.parse(jsonStr); } catch (e3) { throw new Error('JSON invalide: ' + e3.message); } }

        if (data.rounds && Array.isArray(data.rounds)) {
            data.rounds.forEach(function(aiRound, idx) {
                if (challengeRoundsData[idx] && aiRound.questions) {
                    challengeRoundsData[idx].questions = aiRound.questions.map(function(q, qi) {
                        return { id: 'rq_' + idx + '_' + qi, text: q.text || 'Question ' + (qi+1), options: q.options && q.options.length === 4 ? q.options : ['A','B','C','D'], correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0 };
                    });
                }
            });
        }

        // Extraire les critères de performance
        var criteriaKey = data.criteria || data.performanceCriteria;
        if (criteriaKey && Array.isArray(criteriaKey)) {
            challengeEditData.performanceCriteria = criteriaKey.map(function(c) {
                return {
                    fr: c.fr || c.label || '',
                    ar: c.ar || '',
                    en: c.en || '',
                    weight: c.weight || Math.round(100 / criteriaKey.length),
                    indicators: (c.indicators || []).map(function(ind) { return { fr: ind.fr || ind.label || '', ar: ind.ar || '', en: ind.en || '' }; })
                };
            });
        } else {
            challengeEditData.performanceCriteria = [];
        }
        showToast('✅ Challenge généré ! ' + challengeTeamsData.length + ' équipes, ' + challengeRoundsData.length + ' rounds.');
        document.getElementById('challengeEditorCard').style.display = 'block';
        renderChallengeEditor();

        var id = 'challenge_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        var pin = String(Math.floor(1000 + Math.random() * 9000));
        var now = new Date().toISOString();
        var challengeData = {
            id: id, user_id: currentUser ? currentUser.id : null,
            title: challengeEditData.title || t('challengeNew'),
            type: challengeEditData.type || 'group', source: challengeEditData.source || 'manual',
            theme: challengeEditData.theme || '', specialty: challengeEditData.specialty || '',
            objective: challengeEditData.objective || '',
            performanceCriteria: challengeEditData.performanceCriteria || [],
            config: JSON.stringify(challengeEditData.config || {}),
            status: 'active', pin: pin,
            teams: challengeTeamsData,
            rounds: challengeRoundsData.map(function(r) { return { title: r.title, title_ar: r.title_ar, round_type: r.round_type, max_score: r.max_score, sort_order: r.sort_order, questions: r.questions, data: r.data }; }),
            date: now, created_at: now
        };
        localStorage.setItem(id, JSON.stringify(challengeData));
        currentChallengeId = id;
        _closeOverlay('__challengeLoadingOverlay');
        loadPublishedChallenges();
        renderChallengePublishArea(id);
    } catch (e) {
        _closeOverlay('__challengeLoadingOverlay');
        showToast('❌ Erreur génération IA: ' + e.message);
        console.error('Challenge AI generation error:', e);
    }
}

/* ===== CHALLENGE EDITOR ===== */
function renderChallengeEditor() {
    var container = document.getElementById('challengeEditorContainer');
    if (!container) return;
    if (!challengeEditData) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">' + t('challengeNoData') + '</div>';
        return;
    }
    var title = challengeEditData.title || t('challengeNew');
    var html = '<div class="card">'
        + '<div class="section-head"><span class="section-num">🎮</span><strong>' + esc(title) + '</strong></div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">'
        + '<span class="badge" style="background:var(--accent-glow);color:var(--accent);padding:4px 12px;border-radius:20px;font-size:0.78rem;">' + t('challengeType_' + challengeEditData.type) + '</span>'
        + '<span class="badge" style="background:var(--accent-glow);color:var(--accent);padding:4px 12px;border-radius:20px;font-size:0.78rem;">' + challengeTeamsData.length + ' ' + t('challengeTeams') + '</span>'
        + '<span class="badge" style="background:var(--accent-glow);color:var(--accent);padding:4px 12px;border-radius:20px;font-size:0.78rem;">' + challengeRoundsData.length + ' ' + t('challengeRounds') + '</span>'
        + '</div>';
    // Teams section
    if (challengeEditData.type === 'group' || challengeEditData.type === 'tournament') {
        html += '<div style="margin-bottom:16px;"><h4 style="font-size:0.9rem;margin:0 0 8px;">👥 ' + t('challengeTeamsLabel') + '</h4>'
            + '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
        challengeTeamsData.forEach(function(t, idx) {
            html += '<div style="background:var(--surface-elev);border:1px solid ' + t.color + '44;border-radius:12px;padding:8px 14px;display:flex;align-items:center;gap:8px;font-size:0.82rem;">'
                + '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + t.color + ';"></span>'
                + esc(t.name)
                + '<button class="btn-icon-sm" onclick="editTeamName(' + idx + ')" style="font-size:10px;">✏️</button></div>';
        });
        html += '</div></div>';
    }
    // Rounds section
    html += '<div><h4 style="font-size:0.9rem;margin:0 0 8px;">📝 ' + t('challengeRoundsLabel') + '</h4>';
    challengeRoundsData.forEach(function(r, idx) {
        var qCount = (r.questions || []).length;
        html += '<div style="background:var(--surface-elev);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:8px;">'
            + '<div style="display:flex;justify-content:space-between;align-items:center;">'
            + '<div><strong style="font-size:0.85rem;">' + t('challengeRound') + ' ' + (idx+1) + ': ' + esc(r.title) + '</strong>'
            + '<br><span style="font-size:0.75rem;color:var(--text-muted);">' + qCount + ' ' + t('challengeQuestions') + ' • ' + r.max_score + ' pts</span></div>'
            + '<div style="display:flex;gap:4px;">'
            + '<button class="btn btn-secondary" onclick="editRoundQuestions(' + idx + ')" style="font-size:10px;padding:4px 10px;">✏️ ' + t('challengeEditBtn') + '</button>'
            + '<button class="btn btn-secondary" onclick="regenerateRound(' + idx + ')" style="font-size:10px;padding:4px 10px;">🔄 ' + t('challengeRegenBtn') + '</button>'
            + '</div></div></div>';
    });
    html += '</div></div>';
    // Performance criteria section
    html += '<div style="margin-top:16px;"><h4 style="font-size:0.9rem;margin:0 0 8px;">🎯 ' + t('challengeCriteriaTitle') + '</h4>'
        + '<div id="chCriteriaList">';
    var criteria = challengeEditData.performanceCriteria || [];
    if (criteria.length === 0) {
        html += '<div style="font-size:0.78rem;color:var(--text-muted);padding:8px;">' + t('challengeNoCriteria') + '</div>';
    } else {
        criteria.forEach(function(c, ci) {
            html += '<div style="background:var(--surface-elev);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:8px;">'
                + '<div style="display:flex;justify-content:space-between;align-items:center;">'
                + '<strong style="font-size:0.82rem;">' + (ci+1) + '. ' + esc(c.fr || c.en || '') + '</strong>'
                + '<span style="font-size:0.75rem;color:var(--text-muted);">' + c.weight + '%</span></div>';
            if (c.indicators && c.indicators.length > 0) {
                html += '<div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">📌 ';
                c.indicators.forEach(function(ind, ii) {
                    html += '<span style="background:var(--surface);padding:2px 8px;border-radius:8px;margin:2px;">' + esc(ind.fr || ind.en || '') + '</span> ';
                });
                html += '</div>';
            }
            html += '<div style="margin-top:6px;display:flex;gap:4px;">'
                + '<button class="btn btn-secondary" onclick="editCriterion(' + ci + ')" style="font-size:10px;padding:2px 8px;">✏️</button>'
                + '<button class="btn btn-danger" onclick="deleteCriterion(' + ci + ')" style="font-size:10px;padding:2px 8px;">🗑</button></div>'
                + '</div>';
        });
    }
    html += '</div>'
        + '<button class="btn btn-secondary" onclick="addCriterion()" style="font-size:11px;margin-top:4px;">➕ ' + t('challengeAddCriterion') + '</button></div>';
    // Action buttons
    html += '<div class="btn-row" style="justify-content:flex-end;margin-top:16px;">'
        + '<button class="btn btn-secondary" onclick="addChallengeRound()" style="font-size:12px;">➕ ' + t('challengeAddRound') + '</button>'
        + '<button class="btn btn-primary" onclick="publishChallenge()" style="font-size:13px;background:linear-gradient(135deg,#E65100,#FF8F00);">📤 ' + t('challengePublishBtn') + '</button></div>';
    container.innerHTML = html;
}

function editTeamName(idx) {
    var team = challengeTeamsData[idx];
    if (!team) return;
    var newName = prompt(t('challengeEditTeamPrompt'), team.name);
    if (newName && newName.trim()) {
        team.name = newName.trim();
        renderChallengeEditor();
    }
}

function editRoundQuestions(idx) {
    try {
        var round = challengeRoundsData[idx];
        if (!round) { showToast('❌ Round introuvable.'); return; }
        var questions = round.questions || [];
        _closeOverlay('__challengeRoundOverlay');
        var cardStyle = 'background:var(--surface,#1e1e2a);color:var(--text,#eee);border-radius:20px;padding:32px;max-width:600px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.5);max-height:90vh;overflow-y:auto;';
        var html = '<div style="' + cardStyle + '">'
            + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><span style="font-size:24px;">📝</span><h2 style="margin:0;font-size:1.1rem;">' + t('challengeRound') + ' ' + (idx+1) + ': ' + esc(round.title) + '</h2></div>';
        questions.forEach(function(q, qi) {
            html += '<div style="background:var(--surface-elev);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:8px;">'
                + '<div style="font-weight:600;font-size:0.82rem;margin-bottom:6px;">Q' + (qi+1) + ': ' + esc(q.text) + '</div>'
                + '<div style="font-size:0.78rem;color:var(--text-muted);">✅ ' + t('challengeCorrectLabel') + ' ' + esc(q.options && q.options[q.correctIndex] || '') + '</div>'
                + '<button class="btn btn-secondary" onclick="editSingleQuestion(' + idx + ',' + qi + ')" style="font-size:10px;padding:2px 8px;margin-top:4px;">✏️ ' + t('challengeEditBtn') + '</button>'
                + '</div>';
        });
        html += '<div class="btn-row" style="margin-top:16px;">'
            + '<button class="btn btn-secondary" onclick="addQuestionToRound(' + idx + ')" style="font-size:12px;">➕ ' + t('challengeAddQuestion') + '</button>'
            + '<button class="btn btn-secondary" onclick="regenerateRound(' + idx + ')" style="font-size:12px;">🔄 ' + t('challengeRegenBtn') + '</button>'
            + '<button class="btn btn-primary" onclick="_closeOverlay(\'__challengeRoundOverlay\')" style="font-size:12px;">' + t('closeBtn') + '</button></div></div>';
        _createOverlay('__challengeRoundOverlay', html);
    } catch(e) { showToast('❌ ' + (e.message || 'Erreur')); }
}

function editSingleQuestion(roundIdx, qIdx) {
    var round = challengeRoundsData[roundIdx];
    if (!round) return;
    var q = round.questions[qIdx];
    if (!q) return;
    var newText = prompt(t('challengeEditQuestionPrompt'), q.text);
    if (newText && newText.trim()) q.text = newText.trim();
    var newOptions = prompt(t('challengeEditOptionsPrompt'), q.options.join(' | '));
    if (newOptions && newOptions.trim()) {
        var parts = newOptions.split('|').map(function(s) { return s.trim(); });
        if (parts.length === 4) q.options = parts;
    }
    var newCorrect = prompt(t('challengeEditCorrectPrompt') + ' (0-3)', String(q.correctIndex));
    if (newCorrect !== null) {
        var ci = parseInt(newCorrect);
        if (ci >= 0 && ci <= 3) q.correctIndex = ci;
    }
    editRoundQuestions(roundIdx);
}

function addQuestionToRound(roundIdx) {
    var round = challengeRoundsData[roundIdx];
    if (!round) return;
    if (!round.questions) round.questions = [];
    round.questions.push({ id: 'rq_man_' + Date.now(), text: t('challengeNewQuestion'), options: [t('challengeOptionA'), t('challengeOptionB'), t('challengeOptionC'), t('challengeOptionD')], correctIndex: 0 });
    editRoundQuestions(roundIdx);
}

function addChallengeRound() {
    challengeRoundsData.push({ title: t('challengeNewRound'), title_ar: '', round_type: 'quiz', max_score: 20, sort_order: challengeRoundsData.length, questions: [], data: {} });
    renderChallengeEditor();
}

/* ===== PERFORMANCE CRITERIA MANAGEMENT ===== */
function addCriterion() {
    if (!challengeEditData.performanceCriteria) challengeEditData.performanceCriteria = [];
    var frText = prompt(t('challengeCriteriaPrompt') || 'Nom du critère (FR):');
    if (!frText || !frText.trim()) return;
    var weight = parseInt(prompt(t('challengeCriteriaWeight') || 'Poids en % (ex: 25):', '25'));
    if (isNaN(weight) || weight < 1) weight = 25;
    var indicators = [];
    var addInd = true;
    while (addInd) {
        var indFr = prompt(t('challengeIndicatorPrompt') || 'Indicateur de réussite (FR) — laisser vide pour terminer:');
        if (!indFr || !indFr.trim()) { addInd = false; break; }
        indicators.push({ fr: indFr.trim(), ar: '', en: '' });
    }
    challengeEditData.performanceCriteria.push({ fr: frText.trim(), ar: '', en: '', weight: weight, indicators: indicators });
    renderChallengeEditor();
    showToast('✅ Critère ajouté.');
}
function editCriterion(idx) {
    var c = challengeEditData.performanceCriteria[idx];
    if (!c) return;
    var newFr = prompt(t('challengeCriteriaEditPrompt') || 'Modifier le critère (FR):', c.fr);
    if (newFr && newFr.trim()) c.fr = newFr.trim();
    var newWeight = prompt(t('challengeCriteriaWeightEdit') || 'Poids en %:', String(c.weight));
    if (newWeight !== null) { var w = parseInt(newWeight); if (!isNaN(w) && w > 0) c.weight = w; }
    renderChallengeEditor();
    showToast('✅ Critère modifié.');
}
function deleteCriterion(idx) {
    showConfirmModal(t('challengeCriteriaDeleteConfirm') || 'Supprimer ce critère ?', function() {
    challengeEditData.performanceCriteria.splice(idx, 1);
    renderChallengeEditor();
    });
}
function getCriteriaTotalWeight() {
    var c = challengeEditData.performanceCriteria || [];
    var total = 0;
    c.forEach(function(x) { total += x.weight; });
    return total;
}

/* ===== PRACTICAL RESULTS REPORTING ===== */
function openChallengeResultsModal(id) {
    var raw = localStorage.getItem(id);
    if (!raw) { showToast('❌ Challenge introuvable.'); return; }
    var d = JSON.parse(raw);
    var criteria = d.performanceCriteria || [];
    if (criteria.length === 0) { showToast('❌ Aucun critère défini. Ajoutez des critères de performance d\'abord.'); return; }
    var teams = d.teams || [];
    if (teams.length === 0) { showToast('❌ Aucune équipe.'); return; }
    _closeOverlay('__challengeResultsOverlay');
    var cardStyle = 'background:var(--surface,#1e1e2a);color:var(--text,#eee);border-radius:20px;padding:32px;max-width:800px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.5);max-height:90vh;overflow-y:auto;';
    var html = '<div style="' + cardStyle + '">'
        + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;"><span style="font-size:28px;">📋</span><h2 style="margin:0;font-size:1.2rem;">' + t('challengeResultsTitle') + ' — ' + esc(d.title) + '</h2></div>'
        + '<p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:16px;">' + t('challengeResultsHint') + '</p>';
    // Table: rows=criteria, cols=teams, with inputs
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;">'
        + '<thead><tr><th style="text-align:left;padding:8px;border:1px solid var(--border);">' + t('challengeCriteriaTitle') + '</th>';
    teams.forEach(function(t, ti) {
        html += '<th style="text-align:center;padding:8px;border:1px solid var(--border);min-width:80px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + (t.color || '#999') + ';"></span> ' + esc(t.name) + '</th>';
    });
    html += '</tr></thead><tbody>';
    var totalScores = [];
    teams.forEach(function() { totalScores.push(0); });
    criteria.forEach(function(c, ci) {
        html += '<tr><td style="padding:8px;border:1px solid var(--border);font-weight:600;">' + esc(c.fr || c.en || '') + ' <span style="font-weight:400;color:var(--text-muted);">(' + c.weight + '%)</span></td>';
        teams.forEach(function(t, ti) {
            var valId = 'chR_' + id + '_c' + ci + '_t' + ti;
            html += '<td style="text-align:center;padding:8px;border:1px solid var(--border);"><input type="number" id="' + valId + '" min="0" max="100" value="" placeholder="0-100" style="width:70px;padding:4px 6px;border:1px solid var(--border);border-radius:6px;font-size:0.82rem;background:var(--bg);color:var(--text);text-align:center;"></td>';
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    // Auto-calculate button
    html += '<div class="btn-row" style="margin-top:16px;">'
        + '<button class="btn btn-secondary" onclick="autoFillChallengeResults(\'' + id + '\')" style="font-size:12px;">🤖 ' + t('challengeResultsAuto') + '</button>'
        + '<button class="btn btn-primary" onclick="calculateChallengeResults(\'' + id + '\')" style="font-size:13px;background:linear-gradient(135deg,#E65100,#FF8F00);">📊 ' + t('challengeResultsCalc') + '</button>'
        + '<button class="btn btn-secondary" onclick="_closeOverlay(\'__challengeResultsOverlay\')" style="font-size:12px;">' + t('closeBtn') + '</button></div>'
        + '<div id="chResultsOutput" style="margin-top:16px;"></div></div>';
    _createOverlay('__challengeResultsOverlay', html);
}
function autoFillChallengeResults(id) {
    var raw = localStorage.getItem(id);
    if (!raw) return;
    var d = JSON.parse(raw);
    var criteria = d.performanceCriteria || [];
    var teams = d.teams || [];
    criteria.forEach(function(c, ci) {
        teams.forEach(function(t, ti) {
            var valId = 'chR_' + id + '_c' + ci + '_t' + ti;
            var inp = document.getElementById(valId);
            if (inp) inp.value = Math.round(50 + Math.random() * 50); // AI simule des notes 50-100
        });
    });
    showToast('🤖 Notes simulées par l\'IA.');
}
function calculateChallengeResults(id) {
    var raw = localStorage.getItem(id);
    if (!raw) return;
    var d = JSON.parse(raw);
    var criteria = d.performanceCriteria || [];
    var teams = d.teams || [];
    if (teams.length === 0) { showToast('❌ Aucune équipe.'); return; }
    var output = document.getElementById('chResultsOutput');
    if (!output) return;
    var lang = currentLang || 'fr';
    var teamScores = [];
    teams.forEach(function(t, ti) {
        var total = 0;
        var details = [];
        criteria.forEach(function(c, ci) {
            var valId = 'chR_' + id + '_c' + ci + '_t' + ti;
            var inp = document.getElementById(valId);
            var score = inp ? (parseFloat(inp.value) || 0) : 0;
            var weighted = score * (c.weight / 100);
            total += weighted;
            details.push({ name: c.fr || c.en || '', score: score, weight: c.weight, weighted: Math.round(weighted * 10) / 10 });
        });
        teamScores.push({ team: t, total: Math.round(total * 10) / 10, details: details });
    });
    teamScores.sort(function(a, b) { return b.total - a.total; });
    var html = '<div style="background:var(--surface-elev);border:1px solid var(--border);border-radius:16px;padding:20px;">'
        + '<h3 style="margin:0 0 12px;font-size:1rem;">🏆 ' + t('challengeResultsRanking') + '</h3>';
    // Winner highlight
    if (teamScores.length > 0) {
        var winner = teamScores[0];
        html += '<div style="text-align:center;padding:16px;background:linear-gradient(135deg,#FFD70022,#FFA50022);border-radius:12px;margin-bottom:16px;">'
            + '<span style="font-size:48px;">🏆</span>'
            + '<h2 style="margin:4px 0;">' + esc(winner.team.name) + '</h2>'
            + '<div style="font-size:1.5rem;font-weight:700;color:#FFD700;">' + winner.total + ' / 100</div></div>';
    }
    // Table
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;">'
        + '<thead><tr><th style="text-align:left;padding:6px;border:1px solid var(--border);">' + t('challengeTeam') + '</th>';
    criteria.forEach(function(c) {
        html += '<th style="text-align:center;padding:6px;border:1px solid var(--border);">' + esc(c.fr || c.en || '') + '<br><span style="font-weight:400;">(' + c.weight + '%)</span></th>';
    });
    html += '<th style="text-align:center;padding:6px;border:1px solid var(--border);font-weight:700;">' + t('challengeTotalScore') + '</th></tr></thead><tbody>';
    teamScores.forEach(function(ts, rank) {
        var medals = ['🥇', '🥈', '🥉'];
        var rankLabel = rank < 3 ? medals[rank] : '#' + (rank + 1);
        html += '<tr style="background:' + (rank === 0 ? 'var(--surface-elev)' : '') + ';">'
            + '<td style="padding:6px;border:1px solid var(--border);">' + rankLabel + ' ' + esc(ts.team.name) + '</td>';
        ts.details.forEach(function(det) {
            html += '<td style="text-align:center;padding:6px;border:1px solid var(--border);">' + det.score + '<br><span style="font-size:0.7rem;color:var(--text-muted);">(' + det.weighted + ')</span></td>';
        });
        html += '<td style="text-align:center;padding:6px;border:1px solid var(--border);font-weight:700;font-size:1.1rem;">' + ts.total + '</td></tr>';
    });
    html += '</tbody></table>';
    // Rewards
    html += '<div style="margin-top:16px;padding:12px;background:var(--surface);border-radius:12px;">'
        + '<h4 style="margin:0 0 8px;font-size:0.85rem;">🎁 ' + t('challengeResultsRewards') + '</h4>';
    teamScores.forEach(function(ts, rank) {
        var xp = rank === 0 ? 100 : rank === 1 ? 60 : rank === 2 ? 40 : 20;
        html += '<div style="font-size:0.8rem;margin:2px 0;">' + esc(ts.team.name) + ' → <strong>+' + xp + ' XP</strong>'
            + (rank === 0 ? ' 🏆' : '') + '</div>';
    });
    // Track challenge completion for gamification (handles XP, streaks, badges)
    trackChallengeCompleted(true, Math.round(teamScores[0] ? teamScores[0].total : 0));
    html += '</div></div>';
    // Save results to challenge data
    d.results = teamScores.map(function(ts) { return { teamName: ts.team.name, total: ts.total, details: ts.details }; });
    localStorage.setItem(id, JSON.stringify(d));
    output.innerHTML = html;
    showToast('✅ Résultats calculés et sauvegardés !');
}

async function regenerateRound(idx) {
    var round = challengeRoundsData[idx];
    if (!round) return;
    showToast('🔄 Régénération du round ' + (idx+1) + '...');
    var lastResp = localStorage.getItem('lastAssistantResponse') || '';
    var theme = challengeEditData ? challengeEditData.theme || '' : '';
    var prompt = 'Génère 5 questions QCM techniques pour un challenge APC, pour des stagiaires.'
        + (theme ? '\nThème: ' + theme : '')
        + '\nC\'EST UN QUIZ TECHNIQUE POUR LES STAGIAIRES : AUCUNE question sur la pédagogie ni la structure du document (durées des phases, scénario pédagogique, activités du formateur ou des stagiaires, grille critérielle, niveaux de maîtrise, indicateurs, évaluation, objectifs de phase, savoirs/savoir-faire/savoir-être, contextualisation, déstabilisation, intégration, transfert, remédiation, conclusion).'
        + '\nTOUTES les questions doivent être TECHNIQUES sur le thème : procédures concrètes, outils, matériaux, calculs, normes, réglages, gestes professionnels, dépannage, vocabulaire technique du métier.'
        + '\nTitre du round: ' + round.title
        + '\n\nCONTENU:\n' + (lastResp.length > 4000 ? lastResp.slice(0, 4000) : lastResp)
        + '\n\nFormat JSON: {"questions":[{"text":"Question?","options":["A","B","C","D"],"correctIndex":0}]}'
        + '\nSORS UNIQUEMENT le JSON valide.';
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
        if (data.questions && Array.isArray(data.questions)) {
            round.questions = data.questions.map(function(q, qi) { return { id: 'rq_regen_' + idx + '_' + qi, text: q.text || 'Question', options: q.options && q.options.length === 4 ? q.options : ['Option A','Option B','Option C','Option D'], correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0 }; });
            showToast('✅ Round ' + (idx+1) + ' régénéré avec ' + round.questions.length + ' questions.');
            renderChallengeEditor();
        }
    } catch (e) {
        showToast('❌ Erreur: ' + e.message);
    }
}

/* ===== PUBLISH & SAVE ===== */
function publishChallenge() {
    if (!challengeEditData || challengeRoundsData.length === 0) {
        showToast('❌ ' + t('challengeNoRounds'));
        return;
    }
    var id = 'challenge_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    var now = new Date().toISOString();
    var pin = String(Math.floor(1000 + Math.random() * 9000));
    var challengeData = {
        id: id,
        user_id: currentUser ? currentUser.id : null,
        title: challengeEditData.title || t('challengeNew'),
        type: challengeEditData.type || 'group',
        source: challengeEditData.source || 'manual',
        theme: challengeEditData.theme || '',
        specialty: challengeEditData.specialty || '',
        objective: challengeEditData.objective || '',
        performanceCriteria: challengeEditData.performanceCriteria || [],
        config: JSON.stringify(challengeEditData.config || {}),
        status: 'active',
        pin: pin,
        teams: challengeTeamsData,
        rounds: challengeRoundsData.map(function(r) { return { title: r.title, title_ar: r.title_ar, round_type: r.round_type, max_score: r.max_score, sort_order: r.sort_order, questions: r.questions, data: r.data }; }),
        date: now,
        created_at: now
    };
    localStorage.setItem(id, JSON.stringify(challengeData));
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        supabaseClient.from('challenges').upsert({
            id: id,
            user_id: currentUser ? currentUser.id : null,
            title: challengeData.title,
            type: challengeData.type,
            source: challengeData.source,
            theme: challengeData.theme,
            config: challengeData.config,
            status: 'active'
        }).then(function(resp) {
            if (resp.error) console.warn('Supabase challenge save error:', resp.error.message);
        }).catch(function(err) { console.warn('Supabase save error:', err); });
        // Save rounds
        challengeRoundsData.forEach(function(r, idx) {
            supabaseClient.from('challenge_rounds').insert({
                challenge_id: id, title: r.title, title_ar: r.title_ar || '',
                round_type: r.round_type || 'quiz', max_score: r.max_score || 20,
                data: { questions: r.questions }, sort_order: idx
            }).then(function(resp) {
                if (resp.error) console.warn('Supabase round save error:', resp.error.message);
            }).catch(function(err) { console.warn('Supabase round error:', err); });
        });
        // Save teams
        challengeTeamsData.forEach(function(t, idx) {
            supabaseClient.from('challenge_teams').insert({
                challenge_id: id, name: t.name, name_ar: t.name_ar || '',
                color: t.color || '#0077CC', sort_order: idx
            }).then(function(resp) {
                if (resp.error) console.warn('Supabase team save error:', resp.error.message);
            }).catch(function(err) { console.warn('Supabase team error:', err); });
        });
    }
    currentChallengeId = id;
    showToast('🎮 Challenge "' + challengeData.title + '" publié !');
    loadPublishedChallenges();
    renderChallengeEditor();
    renderChallengePublishArea(id);
}
function playChallengeInGame(id) {
  if(!id)return;
  try{
    localStorage.setItem('challengeGameCurrentId', id);
    localStorage.setItem('challengeGameLang', currentLang || 'fr');
  }catch(e){}
  goTo('challenge-game.html');
}

function renderChallengePublishArea(id) {
    var raw = localStorage.getItem(id);
    if (!raw) return;
    var d = JSON.parse(raw);
    var pin = d.pin || '----';
    var link = window.location.origin + window.location.pathname + '?challenge_pin=' + pin;
    var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(link);
    var container = document.getElementById('challengeEditorContainer');
    if (!container) return;
    container.innerHTML += '<div style="margin-top:20px;padding:20px;background:var(--accent-glow);border-radius:16px;border:2px dashed var(--accent);text-align:center;">'
        + '<div style="font-size:0.85rem;font-weight:600;margin-bottom:8px;">' + t('challengePublicPin') + '</div>'
        + '<div style="font-size:2.5rem;font-weight:800;letter-spacing:8px;color:var(--accent);font-family:monospace;margin-bottom:8px;">' + pin + '</div>'
        + '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:12px;">' + t('challengePublicPinDesc') + '</div>'
        + '<div style="font-size:0.78rem;word-break:break-all;margin-bottom:8px;padding:8px;background:var(--surface-elev);border-radius:8px;">' + link + '</div>'
        + '<img src="' + qrUrl + '" alt="QR Code" style="width:180px;height:180px;border-radius:12px;margin-bottom:12px;">'
        + '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">'
        + '<button class="btn btn-primary" onclick="navigator.clipboard.writeText(\'' + link.replace(/'/g, "\\'") + '\').then(function(){showToast(\'📋 ' + t('btnCopy') + ' !\');});" style="font-size:12px;">📋 ' + t('btnCopy') + '</button>'
        + '<button class="btn btn-secondary" onclick="window.open(\'' + link + '\',\'_blank\')" style="font-size:12px;">🌐 ' + t('openBtn') + '</button>'
        + '<button class="btn btn-secondary" onclick="var a=document.createElement(\'a\');a.href=\'' + qrUrl + '\';a.download=\'challenge_qr_' + pin + '.png\';document.body.appendChild(a);a.click();document.body.removeChild(a);" style="font-size:12px;">📥 QR</button>'
        + '<button class="btn btn-primary" onclick="openChallengeDistribModal(\'' + id + '\')" style="font-size:12px;background:linear-gradient(135deg,#0EA5E9,#06B6D4);">📤 ' + t('challengeDistribSendAll') + '</button>'
        + '<button class="btn btn-primary" onclick="playChallengeInGame(\'' + id + '\')" style="font-size:12px;background:linear-gradient(135deg,#3dffa0,#06b67a);">🚀 ' + t('btnPlay') + '</button>'
        + '</div></div>';
}

function loadPublishedChallenges() {
    var container = document.getElementById('publishedChallengeList');
    var cards = document.getElementById('publishedChallengesCard');
    if (!container || !cards) return;
    var challengeKeys = [];
    for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.startsWith('challenge_')) {
            try {
                var raw = localStorage.getItem(k);
                var parsed = JSON.parse(raw);
                if (currentUser && parsed.user_id && parsed.user_id !== currentUser.id) continue;
                challengeKeys.push({ id: k, data: parsed });
            } catch(e) {}
        }
    }
    function renderList() {
        if (challengeKeys.length === 0) { cards.style.display = 'none'; return; }
        cards.style.display = 'block';
        container.innerHTML = '';
        challengeKeys.reverse().forEach(function(item) {
            var d = item.data;
            var totalQ = 0;
            if (d.rounds) d.rounds.forEach(function(r) { if (r.questions) totalQ += r.questions.length; });
            var link = window.location.origin + window.location.pathname + '?challenge=' + item.id;
            var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(link);
            var div = document.createElement('div');
            div.style.cssText = 'background:var(--surface-elev);border:1px solid var(--border);border-radius:16px;padding:16px;margin-bottom:12px;';
            div.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:start;gap:12px;flex-wrap:wrap;">'
                + '<div><strong style="font-size:0.9rem;">🎮 ' + esc(d.title) + '</strong>'
                + '<br><span style="font-size:0.75rem;color:var(--text-muted);">' + (d.teams ? d.teams.length : 0) + ' ' + t('challengeTeams') + ' • ' + (d.rounds ? d.rounds.length : 0) + ' ' + t('challengeRounds') + ' • ' + totalQ + ' ' + t('challengeQuestions')
                + (d.specialty ? ' • 📚 ' + esc(d.specialty) : '') + (d.objective ? ' • 🎯 ' + getObjectiveLabel(d.objective) : '') + '</span>'
                + (d.performanceCriteria && d.performanceCriteria.length > 0 ? '<br><span style="font-size:0.72rem;color:var(--text-muted);">🎯 ' + t('challengeCriteriaTitle') + ': ' + d.performanceCriteria.map(function(c) { return c.fr || c.en || ''; }).join(', ') + '</span>' : '')
                + '</div>'
                + '<div style="text-align:center;"><img src="' + qrUrl + '" alt="QR" style="width:80px;height:80px;border-radius:8px;"><br>'
                + '<button class="btn btn-secondary" onclick="navigator.clipboard.writeText(\'' + link.replace(/'/g, "\\'") + '\').then(function(){showToast(\'📋 ' + t('btnCopy') + ' !\');}).catch(function(){showToast(\'❌ Erreur copie\');});" style="font-size:10px;margin-top:4px;">' + t('btnCopy') + '</button>'
                + '<button class="btn btn-secondary" onclick="editChallenge(\'' + item.id + '\')" style="font-size:10px;margin-top:4px;">✏️</button>'
                + '<button class="btn btn-secondary" onclick="openChallengeResultsModal(\'' + item.id + '\')" style="font-size:10px;margin-top:4px;">📊 ' + t('challengeResultsBtn') + '</button>'
                + '<button class="btn btn-secondary" onclick="showChallengeLeaderboard(\'' + item.id + '\')" style="font-size:10px;margin-top:4px;">🏆 ' + t('challengeRankingBtn') + '</button>'
                + '<button class="btn btn-primary" onclick="openChallengeDistribModal(\'' + item.id + '\')" style="font-size:10px;margin-top:4px;background:linear-gradient(135deg,#0EA5E9,#06B6D4);">📤 ' + t('distribBtn') + '</button>'
                + '<button class="btn btn-primary" onclick="playChallengeInGame(\'' + item.id + '\')" style="font-size:10px;margin-top:4px;background:linear-gradient(135deg,#3dffa0,#06b67a);">🚀 ' + t('btnPlay') + '</button>'
                + '<button class="btn btn-danger" onclick="deleteChallenge(\'' + item.id + '\')" style="font-size:10px;margin-left:4px;">🗑</button></div></div>';
            container.appendChild(div);
        });
    }
    renderList();
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        supabaseClient.from('challenges').select('*').order('created_at', { ascending: false }).then(function(resp) {
            if (resp.error) return;
            resp.data.forEach(function(row) {
                if (!challengeKeys.some(function(k) { return k.id === row.id; })) {
                    challengeKeys.push({ id: row.id, data: row });
                }
            });
            renderList();
        }).catch(function() {});
    }
}

function editChallenge(id) {
    try {
        var raw = localStorage.getItem(id);
        if (!raw) { tryLoadFromSupabase(id); return; }
        var d = JSON.parse(raw);
        _applyChallengeData(d, d.teams || [], d.rounds || []);
    } catch(e) { showToast(t('errGeneric') + e.message); }
}
function tryLoadFromSupabase(id) {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) {
        showToast('❌ Challenge introuvable.');
        return;
    }
    supabaseClient.from('challenges').select('*, challenge_rounds(*), challenge_teams(*)').eq('id', id).single().then(function(resp) {
        if (resp.error || !resp.data) { showToast('❌ Challenge introuvable.'); return; }
        var d = resp.data;
        var teams = (d.challenge_teams || []).map(function(t) { return { name: t.name, name_ar: t.name_ar || '', color: t.color || '#0077CC', sort_order: t.sort_order || 0 }; });
        var rounds = (d.challenge_rounds || []).sort(function(a,b) { return (a.sort_order||0)-(b.sort_order||0); }).map(function(r) {
            var qData = typeof r.data === 'string' ? JSON.parse(r.data) : (r.data || {});
            return { title: r.title, title_ar: r.title_ar || '', round_type: r.round_type || 'quiz', max_score: r.max_score || 20, sort_order: r.sort_order || 0, questions: qData.questions || [], data: {} };
        });
        _applyChallengeData(d, teams, rounds);
    }).catch(function(err) { showToast('❌ Erreur chargement: ' + (err.message || '')); });
}
function _applyChallengeData(d, teams, rounds) {
    challengeEditData = { title: d.title, type: d.type, source: d.source || 'manual', theme: d.theme || '', specialty: d.specialty || '', objective: d.objective || '', performanceCriteria: d.performanceCriteria || [], config: typeof d.config === 'string' ? JSON.parse(d.config) : (d.config || {}) };
    challengeTeamsData = teams;
    challengeRoundsData = rounds;
    challengeParticipantsData = [];
    document.getElementById('challengeEditorCard').style.display = 'block';
    renderChallengeEditor();
    showToast('✏️ Modification du challenge "' + d.title + '"');
}

/* ===== OBJECTIVES LIBRARY (générique, toutes spécialités) ===== */
var CHALLENGE_OBJECTIVES_LIBRARY = [
    { value: 'quiz', icon: '📝', fr: 'Répondre à un quiz', ar: 'الإجابة على اختبار', en: 'Answer a quiz' },
    { value: 'practical', icon: '🔧', fr: 'Réaliser une activité pratique', ar: 'القيام بنشاط عملي', en: 'Perform a practical activity' },
    { value: 'problem', icon: '🧩', fr: 'Résoudre un problème', ar: 'حل مشكلة', en: 'Solve a problem' },
    { value: 'diagnostic', icon: '🔍', fr: 'Effectuer un diagnostic', ar: 'إجراء تشخيص', en: 'Perform a diagnostic' },
    { value: 'prepare_workstation', icon: '🛠️', fr: 'Préparer le poste de travail', ar: 'تحضير محطة العمل', en: 'Prepare the workstation' },
    { value: 'intervention', icon: '⚡', fr: 'Réaliser une intervention', ar: 'تنفيذ تدخل', en: 'Perform an intervention' },
    { value: 'design_solution', icon: '💡', fr: 'Concevoir une solution', ar: 'تصميم حل', en: 'Design a solution' },
    { value: 'project', icon: '📦', fr: 'Réaliser un projet', ar: 'إنجاز مشروع', en: 'Complete a project' },
    { value: 'produce_deliverable', icon: '📄', fr: 'Produire un livrable', ar: 'إنتاج تسليم', en: 'Produce a deliverable' },
    { value: 'present_solution', icon: '📊', fr: 'Présenter une solution', ar: 'تقديم حل', en: 'Present a solution' },
    { value: 'collaborate', icon: '👥', fr: 'Collaborer en équipe', ar: 'التعاون في فريق', en: 'Collaborate in a team' },
    { value: 'follow_procedures', icon: '📋', fr: 'Respecter les procédures', ar: 'اتباع الإجراءات', en: 'Follow procedures' },
    { value: 'safety', icon: '🛡️', fr: 'Respecter les règles de sécurité', ar: 'احترام قواعد السلامة', en: 'Follow safety rules' },
    { value: 'time_management', icon: '⏱️', fr: 'Gérer le temps', ar: 'إدارة الوقت', en: 'Manage time' },
    { value: 'quality_control', icon: '✅', fr: 'Contrôler la qualité du travail', ar: 'مراقبة جودة العمل', en: 'Check work quality' },
    { value: 'analyze_situation', icon: '🔎', fr: 'Analyser une situation', ar: 'تحليل وضعية', en: 'Analyze a situation' },
    { value: 'decision', icon: '🎯', fr: 'Prendre une décision', ar: 'اتخاذ قرار', en: 'Make a decision' },
    { value: 'communicate', icon: '🗣️', fr: 'Communiquer efficacement', ar: 'التواصل بفعالية', en: 'Communicate effectively' },
    { value: 'use_tools', icon: '🔧', fr: 'Utiliser les outils adaptés', ar: 'استخدام الأدوات المناسبة', en: 'Use appropriate tools' },
    { value: 'self_evaluate', icon: '🔄', fr: 'Évaluer et améliorer son travail', ar: 'تقييم وتحسين عمله', en: 'Evaluate and improve his work' }
];
var CHALLENGE_OBJECTIVES_CUSTOM_KEY = 'challenge_custom_objectives';
function getCustomObjectives() {
    try { return JSON.parse(localStorage.getItem(CHALLENGE_OBJECTIVES_CUSTOM_KEY) || '[]'); } catch(e) { return []; }
}
function saveCustomObjectives(list) {
    localStorage.setItem(CHALLENGE_OBJECTIVES_CUSTOM_KEY, JSON.stringify(list));
}
function populateChallengeObjectiveSelect(selectId, customInputId) {
    var sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '';
    CHALLENGE_OBJECTIVES_LIBRARY.forEach(function(o) {
        var opt = document.createElement('option');
        opt.value = o.value;
        opt.textContent = o.icon + ' ' + (currentLang === 'ar' ? o.ar : currentLang === 'en' ? o.en : o.fr);
        sel.appendChild(opt);
    });
    var sep = document.createElement('option');
    sep.disabled = true;
    sep.textContent = '──────────';
    sel.appendChild(sep);
    var customOpt = document.createElement('option');
    customOpt.value = '__custom__';
    customOpt.textContent = '✏️ ' + (currentLang === 'ar' ? 'تخصيص...' : currentLang === 'en' ? 'Customize...' : 'Personnaliser...');
    sel.appendChild(customOpt);
    var saved = getCustomObjectives();
    if (saved.length > 0) {
        var sep2 = document.createElement('option');
        sep2.disabled = true;
        sep2.textContent = '──────────';
        sel.appendChild(sep2);
        saved.forEach(function(o) {
            var opt = document.createElement('option');
            opt.value = '__saved_' + o.value + '__';
            opt.textContent = '💾 ' + (currentLang === 'ar' ? o.ar : currentLang === 'en' ? o.en : o.fr);
            sel.appendChild(opt);
        });
    }
}
function onChallengeObjectiveSelect(selectId, inputId) {
    var sel = document.getElementById(selectId);
    var inp = document.getElementById(inputId);
    if (!sel || !inp) return;
    if (sel.value === '__custom__') {
        inp.style.display = 'block';
        inp.value = '';
        inp.focus();
        return;
    }
    if (sel.value.indexOf('__saved_') === 0) {
        var savedVal = sel.value.replace('__saved_', '').replace('__', '');
        var saved = getCustomObjectives();
        var found = null;
        saved.forEach(function(o) { if (o.value === savedVal) found = o; });
        if (found) {
            inp.value = currentLang === 'ar' ? found.ar : currentLang === 'en' ? found.en : found.fr;
            inp.style.display = 'block';
            return;
        }
    }
    inp.style.display = 'none';
}
function getObjectiveLabel(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return t('challengeObj' + obj.charAt(0).toUpperCase() + obj.slice(1));
    if (typeof obj === 'object') return obj.icon + ' ' + (obj[currentLang] || obj.fr || obj.value || '');
    return obj;
}

function deleteChallenge(id) {
    showConfirmModal(t('challengeDeleteConfirm'), function() {
    localStorage.removeItem(id);
    localStorage.removeItem(id + '_distrib');
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        supabaseClient.from('challenges').delete().eq('id', id).then(function() {}).catch(function() {});
        supabaseClient.from('challenge_rounds').delete().eq('challenge_id', id).then(function() {}).catch(function() {});
        supabaseClient.from('challenge_teams').delete().eq('challenge_id', id).then(function() {}).catch(function() {});
        supabaseClient.from('challenge_participants').delete().eq('challenge_id', id).then(function() {}).catch(function() {});
    }
    // Reset editor state
    var card = document.getElementById('challengeEditorCard');
    if (card) card.style.display = 'none';
    challengeEditData = null;
    challengeTeamsData = [];
    challengeRoundsData = [];
    challengeParticipantsData = [];
    currentChallengeId = null;
    loadPublishedChallenges();
    showToast(t('challengeDeleted'));
    });
}

/* ===== DISTRIBUTION (comme quiz_access_codes) ===== */
var challengeDistribData = [];
var challengeDistribCurrentId = null;

function openChallengeDistribModal(challengeId) {
    var raw = localStorage.getItem(challengeId);
    if (!raw) { showToast('❌ Challenge introuvable.'); return; }
    var d = JSON.parse(raw);
    challengeDistribCurrentId = challengeId;
    challengeDistribData = [];
    var cardStyle = 'background:var(--surface,#1e1e2a);color:var(--text,#eee);border-radius:20px;padding:24px;max-width:1000px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.5);max-height:90vh;overflow-y:auto;';
    var html = '<div style="' + cardStyle + '">'
        + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;"><span style="font-size:24px;">📤</span><h2 style="margin:0;font-size:1.1rem;">' + t('challengeDistribTitle') + ' — ' + esc(d.title) + '</h2></div>'
        // Import section (comme quiz)
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">'
        + '<textarea id="chDistribInput" rows="4" style="flex:1;min-width:250px;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface-elev);color:var(--text);font-size:0.8rem;font-family:monospace;" placeholder="' + t('challengeDistribPlaceholder') + '"></textarea>'
        + '<div style="display:flex;flex-direction:column;gap:6px;">'
        + '<div style="display:flex;gap:4px;">'
        + '<button class="btn btn-secondary" onclick="challengeDistribDownloadTemplate(\'csv\')" style="font-size:11px;flex:1;">📥 CSV</button>'
        + '<button class="btn btn-secondary" onclick="challengeDistribDownloadTemplate(\'xlsx\')" style="font-size:11px;flex:1;">📥 XLSX</button>'
        + '</div>'
        + '<button class="btn btn-secondary" onclick="challengeDistribImportCSV()" style="font-size:11px;">📄 ' + t('challengeDistribImportBtn') + '</button>'
        + '<input type="file" id="chDistribCSVInput" accept=".csv,.txt,.xlsx,.xls" style="display:none;" onchange="challengeDistribHandleCSV(event)">'
        + '<button class="btn btn-primary" onclick="challengeDistribGenerate()" style="font-size:11px;">⚡ ' + t('challengeDistribGenerateBtn') + '</button>'
        + '<label style="font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="checkbox" id="chDistribAutoSendImport" checked> 📧 Auto</label>'
        + '</div></div>'
        // Manual add (comme quiz)
        + '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:12px;padding:10px;background:var(--surface-elev);border-radius:10px;border:1px solid var(--border);">'
        + '<input id="chDistribNameFr" placeholder="' + t('challengeDistribNameFr') + '" style="flex:1;min-width:100px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.8rem;background:var(--bg);color:var(--text);">'
        + '<input id="chDistribNameAr" placeholder="' + t('challengeDistribNameAr') + '" style="flex:1;min-width:100px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.8rem;background:var(--bg);color:var(--text);">'
        + '<input id="chDistribEmail" placeholder="' + t('challengeDistribEmail') + '" type="email" style="flex:1;min-width:120px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.8rem;background:var(--bg);color:var(--text);">'
        + '<input id="chDistribSpecialty" placeholder="' + t('challengeDistribSpecialty') + '" style="flex:1;min-width:100px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.8rem;background:var(--bg);color:var(--text);">'
        + '<input id="chDistribGroup" placeholder="' + t('challengeDistribGroup') + '" style="flex:1;min-width:80px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.8rem;background:var(--bg);color:var(--text);">'
        + '<button class="btn btn-primary" onclick="challengeDistribAddSingleRow()" style="font-size:11px;white-space:nowrap;" id="chDistribAddRowBtn">➕ ' + t('challengeDistribAddBtn') + '</button>'
        + '<label style="font-size:0.75rem;display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="checkbox" id="chDistribAutoSend" checked> 📧 Auto</label>'
        + '</div>'
        // Team assign
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">'
        + '<label style="font-size:0.78rem;">' + t('challengeDistribTeamLabel') + ':</label>'
        + '<select id="chDistribTeamSelect" style="padding:5px 8px;border-radius:6px;border:1px solid var(--border);font-size:0.78rem;background:var(--surface-elev);color:var(--text);"><option value="">— ' + t('challengeDistribAutoTeam') + ' —</option>';
    (d.teams || []).forEach(function(t, idx) {
        html += '<option value="' + idx + '">' + esc(t.name) + '</option>';
    });
    html += '</select>'
        + '<button class="btn btn-secondary" onclick="challengeDistribAutoAssignTeams()" style="font-size:11px;">🤖 ' + t('challengeDistribAutoTeamBtn') + '</button>'
        + '</div>'
        // Filters
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center;">'
        + '<select id="chDistribFilterSpecialty" style="padding:5px 8px;border-radius:6px;border:1px solid var(--border);font-size:0.75rem;background:var(--surface-elev);color:var(--text);" onchange="challengeRenderDistribTable()"><option value="">— ' + t('challengeDistribAllSpecialties') + ' —</option></select>'
        + '<select id="chDistribFilterGroup" style="padding:5px 8px;border-radius:6px;border:1px solid var(--border);font-size:0.75rem;background:var(--surface-elev);color:var(--text);" onchange="challengeRenderDistribTable()"><option value="">— ' + t('challengeDistribAllGroups') + ' —</option></select>'
        + '<span id="chDistribCount" style="font-size:0.75rem;color:var(--text-muted);margin-left:auto;"></span>'
        + '</div>'
        // Table
        + '<div style="overflow-x:auto;"><table id="chDistribTable" style="width:100%;border-collapse:collapse;font-size:0.78rem;">'
        + '<thead><tr style="background:var(--surface-elev);">'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:left;">N°</th>'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:left;">' + t('challengeDistribNameFr') + '</th>'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:left;">' + t('challengeDistribNameAr') + '</th>'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:left;">Email</th>'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:left;">' + t('challengeDistribSpecialty') + '</th>'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:left;">' + t('challengeDistribGroup') + '</th>'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:left;">' + t('challengeDistribTeamLabel') + '</th>'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:left;">Code</th>'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:center;">QR</th>'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:center;">' + t('challengeDistribStatus') + '</th>'
        + '<th style="padding:6px 8px;border:1px solid var(--border);text-align:center;">Actions</th>'
        + '</tr></thead><tbody id="chDistribTbody"></tbody></table></div>'
        + '<div id="chDistribEmpty" style="text-align:center;padding:32px;color:var(--text-muted);font-size:0.85rem;">' + t('challengeDistribEmpty') + '</div>'
        + '<div class="btn-row" style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">'
        + '<button class="btn btn-secondary" onclick="_closeOverlay(\'__challengeDistribOverlay\')" id="chDistribCloseBtn">' + t('closeBtn') + '</button>'
        + '<button class="btn btn-primary" onclick="challengeSaveDistrib(\'' + challengeId + '\')" style="font-size:12px;background:linear-gradient(135deg,#0EA5E9,#06B6D4);">💾 ' + t('saveBtn') + '</button>'
        + '<button class="btn btn-primary" onclick="challengeDistribSendAll()" id="chDistribSendAllBtn" style="background:linear-gradient(135deg,#0EA5E9,#06B6D4);font-size:11px;">📧 ' + t('challengeDistribSendAll') + '</button>'
        + '</div></div>';
    _createOverlay('__challengeDistribOverlay', html);
    try {
        var saved = localStorage.getItem(challengeId + '_distrib');
        if (saved) challengeDistribData = JSON.parse(saved);
    } catch(e) {}
    challengeRenderDistribTable();
}

function challengeDistribGenerate() {
    var input = document.getElementById('chDistribInput').value.trim();
    if (!input) { showToast('❌ Collez d\'abord une liste.'); return; }
    var lines = input.split('\n').map(function(l) { return l.trim(); }).filter(Boolean);
    var firstLine = lines[0] || '';
    var commaCount = (firstLine.match(/,/g) || []).length;
    var semiCount = (firstLine.match(/;/g) || []).length;
    var sep = semiCount > commaCount ? ';' : ',';
    var newEntries = [];
    lines.forEach(function(line) {
        var parts = line.split(sep);
        var nameFr = (parts[0] || '').trim();
        var nameAr = (parts[1] || '').trim();
        var email = (parts[2] || '').trim().toLowerCase();
        var specialty = (parts[3] || '').trim();
        var group = (parts[4] || '').trim();
        if (/^(nom_fr|nom_ar|name|email|spécialité|specialty|groupe|group)/i.test(nameFr)) return;
        if (!nameFr && !nameAr && !email) return;
        var code = challengeGenerateCode();
        var tId = '';
        try { var _dr = localStorage.getItem(challengeDistribCurrentId || ''); if (_dr) { var _dd = JSON.parse(_dr); tId = _dd.trainer_id || ''; } } catch (e) {}
        var link = window.location.origin + window.location.pathname + '?challenge_code=' + code + (tId ? '&t_id=' + encodeURIComponent(tId) : '');
        newEntries.push({ name_fr: nameFr, name_ar: nameAr, email: email, specialty: specialty, group: group, code: code, link: link, status: 'pending', team_id: null, score: 0 });
    });
    if (newEntries.length === 0) { showToast('❌ Aucune entrée valide.'); return; }
    challengeDistribData = challengeDistribData.concat(newEntries);
    challengeUpdateFilters();
    challengeRenderDistribTable();
    document.getElementById('chDistribInput').value = '';
    showToast('✅ ' + newEntries.length + ' participants ajoutés.');
}

function challengeDistribDownloadTemplate(type) {
    if (type === 'xlsx') {
        showToast('📥 Téléchargement XLSX...');
        var script = document.createElement('script');
        script.src = 'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js';
        script.onload = function() {
            var wb = XLSX.utils.book_new();
            var data = [['nom_fr', 'nom_ar', 'email', 'spécialité', 'groupe'], ['Etudiant1', 'طالب1', 'etudiant1@email.com', 'Informatique', 'Groupe A']];
            var ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, 'Participants');
            XLSX.writeFile(wb, 'template_challenge_participants.xlsx');
        };
        script.onerror = function() { showToast('⚠️ Erreur chargement XLSX.'); };
        document.body.appendChild(script);
        return;
    }
    var header = ['nom_fr', 'nom_ar', 'email', 'spécialité', 'groupe'];
    var csv = header.join(',') + '\n' + 'Etudiant1,طالب1,etudiant1@email.com,Informatique,Groupe A\nEtudiant2,طالب2,etudiant2@email.com,Réseaux,';
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'template_challenge_participants.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1000);
    showToast('📥 Modèle CSV téléchargé.');
}

function challengeDistribAddSingleRow() {
    var nameFr = document.getElementById('chDistribNameFr').value.trim();
    var nameAr = document.getElementById('chDistribNameAr').value.trim();
    var email = document.getElementById('chDistribEmail').value.trim();
    var specialty = document.getElementById('chDistribSpecialty').value.trim();
    var group = document.getElementById('chDistribGroup').value.trim();
    if (!nameFr && !email) { showToast('❌ Entrez au moins le nom.'); return; }
    var code = challengeGenerateCode();
    var tId = '';
    try { var _dr = localStorage.getItem(challengeDistribCurrentId || ''); if (_dr) { var _dd = JSON.parse(_dr); tId = _dd.trainer_id || ''; } } catch (e) {}
    var link = window.location.origin + window.location.pathname + '?challenge_code=' + code + (tId ? '&t_id=' + encodeURIComponent(tId) : '');
    challengeDistribData.push({ name_fr: nameFr, name_ar: nameAr, email: email, specialty: specialty, group: group, code: code, link: link, status: 'pending', team_id: null, score: 0 });
    challengeUpdateFilters();
    challengeRenderDistribTable();
    document.getElementById('chDistribNameFr').value = '';
    document.getElementById('chDistribNameAr').value = '';
    document.getElementById('chDistribEmail').value = '';
    document.getElementById('chDistribSpecialty').value = '';
    document.getElementById('chDistribGroup').value = '';
    showToast('✅ Participant ajouté.');
}

function challengeDistribImportCSV() {
    document.getElementById('chDistribCSVInput').click();
}

function challengeDistribHandleCSV(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        var text = e.target.result;
        if (file.name.match(/\.xlsx?$/i)) {
            try {
                var workbook = XLSX.read(text, { type: 'binary' });
                var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                var data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                var csvLines = data.map(function(row) { return row.join(','); }).join('\n');
                document.getElementById('chDistribInput').value = csvLines;
                challengeDistribGenerate();
            } catch(e2) { showToast('❌ Erreur lecture XLSX.'); }
            return;
        }
        document.getElementById('chDistribInput').value = text;
        challengeDistribGenerate();
    };
    if (file.name.match(/\.xlsx?$/i)) {
        reader.readAsBinaryString(file);
    } else {
        reader.readAsText(file);
    }
    event.target.value = '';
}

function challengeUpdateFilters() {
    var specialtyEl = document.getElementById('chDistribFilterSpecialty');
    var groupEl = document.getElementById('chDistribFilterGroup');
    if (!specialtyEl || !groupEl) return;
    var specialties = {};
    var groups = {};
    challengeDistribData.forEach(function(p) {
        if (p.specialty) specialties[p.specialty] = true;
        if (p.group) groups[p.group] = true;
    });
    var currentSpec = specialtyEl.value;
    var currentGrp = groupEl.value;
    specialtyEl.innerHTML = '<option value="">— ' + t('challengeDistribAllSpecialties') + ' —</option>';
    Object.keys(specialties).sort().forEach(function(s) {
        specialtyEl.innerHTML += '<option value="' + esc(s) + '"' + (s === currentSpec ? ' selected' : '') + '>' + esc(s) + '</option>';
    });
    groupEl.innerHTML = '<option value="">— ' + t('challengeDistribAllGroups') + ' —</option>';
    Object.keys(groups).sort().forEach(function(g) {
        groupEl.innerHTML += '<option value="' + esc(g) + '"' + (g === currentGrp ? ' selected' : '') + '>' + esc(g) + '</option>';
    });
}

function challengeDistribAutoAssignTeams() {
    var teamSelect = document.getElementById('chDistribTeamSelect');
    if (!teamSelect) return;
    var raw = localStorage.getItem(challengeDistribCurrentId || '');
    var d = raw ? JSON.parse(raw) : null;
    var teams = d ? (d.teams || []) : [];
    if (teams.length === 0) { showToast('❌ Aucune équipe définie.'); return; }
    var pending = challengeDistribData.filter(function(p) { return p.team_id === null; });
    if (pending.length === 0) { showToast('✅ Tous les participants ont déjà une équipe.'); return; }
    pending.forEach(function(p, idx) {
        p.team_id = idx % teams.length;
    });
    challengeRenderDistribTable();
    showToast('🤖 ' + pending.length + ' participants répartis en ' + teams.length + ' équipes.');
}

function challengeRenderDistribTable() {
    var tbody = document.getElementById('chDistribTbody');
    var emptyEl = document.getElementById('chDistribEmpty');
    var countEl = document.getElementById('chDistribCount');
    if (!tbody) return;
    var raw = localStorage.getItem(challengeDistribCurrentId || '');
    var d = raw ? JSON.parse(raw) : null;
    var teams = d ? (d.teams || []) : [];
    var specFilter = document.getElementById('chDistribFilterSpecialty')?.value || '';
    var grpFilter = document.getElementById('chDistribFilterGroup')?.value || '';
    var filtered = challengeDistribData.filter(function(p) {
        if (specFilter && p.specialty !== specFilter) return false;
        if (grpFilter && p.group !== grpFilter) return false;
        return true;
    });
    if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        if (countEl) countEl.textContent = '0 / ' + challengeDistribData.length;
        return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    var html = '';
    filtered.forEach(function(p, idx) {
        var realIdx = challengeDistribData.indexOf(p);
        var teamName = (p.team_id !== null && teams[p.team_id]) ? teams[p.team_id].name : '—';
        var teamColor = (p.team_id !== null && teams[p.team_id]) ? teams[p.team_id].color : '#999';
        var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=' + encodeURIComponent(p.link || p.code);
        html += '<tr style="border-bottom:1px solid var(--border);">'
            + '<td style="padding:6px 8px;">' + (idx + 1) + '</td>'
            + '<td style="padding:6px 8px;">' + esc(p.name_fr) + '</td>'
            + '<td style="padding:6px 8px;">' + esc(p.name_ar) + '</td>'
            + '<td style="padding:6px 8px;">' + esc(p.email) + '</td>'
            + '<td style="padding:6px 8px;">' + esc(p.specialty || '') + '</td>'
            + '<td style="padding:6px 8px;">' + esc(p.group || '') + '</td>'
            + '<td style="padding:6px 8px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + teamColor + ';margin-right:4px;"></span>' + esc(teamName)
            + ' <button class="btn-icon-sm" onclick="challengeDistribEditTeam(' + realIdx + ')" style="font-size:9px;padding:0 2px;">✏️</button></td>'
            + '<td style="padding:6px 8px;font-family:monospace;font-size:0.75rem;">' + esc(p.code) + '</td>'
            + '<td style="padding:6px 8px;text-align:center;"><a href="' + qrUrl + '" target="_blank"><img src="' + qrUrl + '" alt="QR" style="width:28px;height:28px;border-radius:4px;cursor:pointer;" title="' + esc(p.code) + '"></a></td>'
            + '<td style="padding:6px 8px;text-align:center;"><span style="font-size:0.72rem;padding:2px 6px;border-radius:4px;background:' + (p.status === 'sent' ? 'var(--success-bg,#1b5e20)' : 'var(--warning-bg,#e65100)') + ';color:#fff;">' + esc(p.status) + '</span></td>'
            + '<td style="padding:6px 8px;text-align:center;white-space:nowrap;">'
            + (p.email&&p.email.indexOf('@')>0?'<button class="btn-icon-sm" onclick="challengeDistribSendOne('+realIdx+')" style="font-size:9px;padding:2px 6px;background:linear-gradient(135deg,#0EA5E9,#06B6D4);color:#fff;border:none;border-radius:3px;cursor:pointer;" title="Envoyer">📧</button> ':'')
            + '<button class="btn-icon-sm" onclick="challengeDistribDeleteRow(' + realIdx + ')" style="font-size:9px;padding:2px 4px;" title="' + t('challengeDistribDeleteConfirm') + '">🗑</button>'
            + '</td></tr>';
    });
    tbody.innerHTML = html;
    if (countEl) countEl.textContent = filtered.length + ' / ' + challengeDistribData.length;
}

function challengeDistribEditTeam(idx) {
    var p = challengeDistribData[idx];
    if (!p) return;
    var raw = localStorage.getItem(challengeDistribCurrentId || '');
    var d = raw ? JSON.parse(raw) : null;
    var teams = d ? (d.teams || []) : [];
    var options = teams.map(function(t, i) { return '<option value="' + i + '"' + (p.team_id === i ? ' selected' : '') + '>' + esc(t.name) + '</option>'; }).join('');
    var newVal = prompt(t('challengeDistribTeamPrompt') + ':\n' + teams.map(function(t,i) { return i + ': ' + t.name; }).join('\n'), p.team_id !== null ? String(p.team_id) : '');
    if (newVal !== null) {
        var tid = parseInt(newVal);
        if (tid >= 0 && tid < teams.length) p.team_id = tid;
        challengeRenderDistribTable();
    }
}

function challengeDistribDeleteRow(idx) {
    showConfirmModal(t('challengeDistribDeleteConfirm'), function() {
    challengeDistribData.splice(idx, 1);
    challengeUpdateFilters();
    challengeRenderDistribTable();
    });
}

function challengeDistribSendAll() {
    var unsent = challengeDistribData.filter(function(p) { return p.email && p.email.indexOf('@') > 0; });
    if (unsent.length === 0) { showToast('✅ Aucun participant avec email.'); return; }
    var raw = localStorage.getItem(challengeDistribCurrentId || '');
    var d = raw ? JSON.parse(raw) : null;
    var cfg = getEmailJSConfig();
    if (!cfg.publicKey || !cfg.serviceId || !cfg.templateId) { showToast('📧 Configurez EmailJS dans les paramètres.'); return; }
    var sent = 0, failed = 0;
    loadEmailJS(function() {
        emailjs.init(cfg.publicKey);
        unsent.forEach(function(p) {
            emailjs.send(cfg.serviceId, cfg.templateId, {
                to_name: p.name_fr || p.name_ar || 'Participant',
                to_email: p.email,
                from_name: (typeof currentProfile !== 'undefined' && currentProfile?.full_name) || (typeof currentUser !== 'undefined' && currentUser?.email) || 'Formateur',
                message: t('challengeDistribEmailMsg') + '\n\n' + t('challengeDistribYourCode') + ': ' + p.code + '\n' + t('challengeDistribYourLink') + ': ' + p.link,
                code: p.code,
                link: p.link,
                qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(p.link),
                quiz_name: d ? d.title : 'Challenge'
            }).then(function() { p.status = 'sent'; sent++; challengeRenderDistribTable(); }).catch(function(err) { failed++; console.warn('EmailJS error:', err && (err.text || err.message || JSON.stringify(err))); })
            .finally(function() { if (sent + failed === unsent.length) showToast('📧 ' + sent + ' envoyé(s)' + (failed ? ', ' + failed + ' échec(s)' : '') + '.'); });
        });
    });
}

function challengeDistribSendOne(idx) {
    var p = challengeDistribData[idx];
    if (!p) return;
    if (!p.email || p.email.indexOf('@') < 0) { showToast('❌ Pas d\'email valide.'); return; }
    var raw = localStorage.getItem(challengeDistribCurrentId || '');
    var d = raw ? JSON.parse(raw) : null;
    var cfg = getEmailJSConfig();
    if (!cfg.publicKey || !cfg.serviceId || !cfg.templateId) { showToast('📧 Configurez EmailJS dans les paramètres.'); return; }
    loadEmailJS(function() {
        emailjs.init(cfg.publicKey);
        emailjs.send(cfg.serviceId, cfg.templateId, {
            to_name: p.name_fr || p.name_ar || 'Participant',
            to_email: p.email,
            from_name: (typeof currentProfile !== 'undefined' && currentProfile?.full_name) || (typeof currentUser !== 'undefined' && currentUser?.email) || 'Formateur',
            message: t('challengeDistribEmailMsg') + '\n\n' + t('challengeDistribYourCode') + ': ' + p.code + '\n' + t('challengeDistribYourLink') + ': ' + p.link,
            code: p.code,
            link: p.link,
            qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(p.link),
            quiz_name: d ? d.title : 'Challenge'
        }).then(function() {
            p.status = 'sent';
            challengeRenderDistribTable();
            showToast('📧 Envoyé à ' + (p.name_fr || p.name_ar || p.email) + '.');
        }).catch(function(err) {
            var msg = err && (err.text || err.message || JSON.stringify(err));
            console.warn('EmailJS error:', msg);
            showToast('❌ Erreur d\'envoi: ' + msg);
        });
    });
}

function challengeSaveDistrib(challengeId) {
    localStorage.setItem(challengeId + '_distrib', JSON.stringify(challengeDistribData));
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        // Upsert participants
        challengeDistribData.forEach(function(p) {
            supabaseClient.from('challenge_participants').upsert({
                challenge_id: challengeId, team_id: p.team_id,
                student_name_fr: p.name_fr || '', student_name_ar: p.name_ar || '',
                email: p.email || '', code: p.code, link: p.link, status: p.status || 'pending', score: p.score || 0
            }, { onConflict: 'challenge_id,code' }).then(function(resp) {
                if (resp.error) console.warn('Supabase participant save:', resp.error.message);
            }).catch(function(err) { console.warn('Supabase participant error:', err); });
        });
    }
    showToast('💾 Participants sauvegardés !');
}

function challengeGenerateCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = '';
    for (var i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    if (challengeDistribData.some(function(d) { return d.code === code; })) return challengeGenerateCode();
    return code;
}

/* ===== LEADERBOARD ===== */
function showChallengeLeaderboard(challengeId) {
    var raw = localStorage.getItem(challengeId);
    if (!raw) { showToast('❌ Challenge introuvable.'); return; }
    var d = JSON.parse(raw);
    var teams = d.teams || [];
    var rounds = d.rounds || [];
    var participants = [];
    try {
        var pRaw = localStorage.getItem(challengeId + '_distrib');
        if (pRaw) participants = JSON.parse(pRaw);
    } catch(e) {}
    // Calculate team scores
    var teamScores = {};
    teams.forEach(function(t, idx) { teamScores[idx] = { name: t.name, color: t.color, score: 0, count: 0 }; });
    participants.forEach(function(p) {
        if (p.team_id !== null && teamScores[p.team_id] !== undefined) {
            teamScores[p.team_id].score += p.score || 0;
            teamScores[p.team_id].count++;
        }
    });
    var sortedTeams = Object.keys(teamScores).map(function(k) { return { id: parseInt(k), ...teamScores[k] }; }).sort(function(a, b) { return b.score - a.score; });
    var cardStyle = 'background:var(--surface,#1e1e2a);color:var(--text,#eee);border-radius:20px;padding:28px;max-width:600px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.5);max-height:90vh;overflow-y:auto;';
    var html = '<div style="' + cardStyle + '">'
        + '<div style="text-align:center;margin-bottom:20px;"><span style="font-size:40px;">🏆</span>'
        + '<h2 style="margin:8px 0 4px;font-size:1.3rem;">' + esc(d.title) + '</h2>'
        + '<p style="font-size:0.82rem;color:var(--text-muted);margin:0;">' + t('challengeRankingTitle') + '</p></div>';
    if (sortedTeams.length === 0) {
        html += '<p style="text-align:center;color:var(--text-muted);padding:20px;">' + t('challengeNoParticipants') + '</p>';
    } else {
        sortedTeams.forEach(function(t, idx) {
            var medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx + 1);
            var barWidth = sortedTeams.length > 0 ? Math.round((t.score / Math.max(sortedTeams[0].score, 1)) * 100) : 0;
            html += '<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;margin-bottom:8px;background:var(--surface-elev);border-radius:12px;border-left:4px solid ' + t.color + ';">'
                + '<span style="font-size:1.3rem;font-weight:700;min-width:32px;">' + medal + '</span>'
                + '<div style="flex:1;"><div style="font-weight:600;font-size:0.9rem;">' + esc(t.name) + '</div>'
                + '<div style="display:flex;align-items:center;gap:8px;"><div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden;">'
                + '<div style="height:100%;width:' + barWidth + '%;background:linear-gradient(90deg,' + t.color + ',transparent);border-radius:4px;transition:width .5s;"></div></div>'
                + '<span style="font-weight:700;font-size:1rem;color:' + t.color + ';">' + t.score + ' ' + t('challengePoints') + '</span></div>'
                + '<span style="font-size:0.72rem;color:var(--text-muted);">' + t.count + ' ' + t('challengeMembers') + '</span></div></div>';
        });
    }
    html += '<div class="btn-row" style="margin-top:16px;">'
        + '<button class="btn btn-secondary" onclick="_closeOverlay(\'__challengeLeaderboardOverlay\')">' + t('closeBtn') + '</button></div></div>';
    _createOverlay('__challengeLeaderboardOverlay', html);
}

/* ===== STUDENT / LEARNER MODE ===== */
function initChallengeLearnerMode() {
    var params = new URLSearchParams(window.location.search);
    var code = params.get('challenge_code');
    var pin = params.get('challenge_pin');
    var tId = params.get('t_id');
    if (tId) { try { localStorage.setItem('plant_trainer_id', tId); } catch (e) {} }
    if (!code && !pin) return;
    document.body.classList.add('learner-mode', 'challenge-learner-mode');
    var container = document.getElementById('platformChrome');
    if (container) container.style.display = 'none';
    var learnerUI = document.getElementById('challengeLearnerUI');
    if (learnerUI) {
        learnerUI.style.display = 'flex';
        if (code) {
            loadChallengeForLearner(code);
        } else {
            showChallengePinEntry(pin);
        }
    }
}
function showChallengePinEntry(pin) {
    // Find challenge by public pin
    var challengeId = null;
    var d = null;
    for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.startsWith('challenge_') && !k.endsWith('_distrib')) {
            try {
                var parsed = JSON.parse(localStorage.getItem(k));
                if (parsed.pin === pin) {
                    challengeId = k;
                    d = parsed;
                    break;
                }
            } catch(e) {}
        }
    }
    if (!challengeId || !d) {
        document.getElementById('challengeLearnerContent').innerHTML = '<div class="learner-error"><div class="icon">😕</div><h2>' + t('challengeCodeInvalid') + '</h2></div>';
        return;
    }
    var html = '<div class="learner-header" style="background:linear-gradient(135deg,#E65100,#FF8F00);">'
        + '<div class="learner-header-title">🎮 ' + esc(d.title) + '</div></div>'
        + '<div class="learner-wrap"><div class="learner-card">'
        + '<div style="text-align:center;margin-bottom:20px;"><span style="font-size:48px;">🏆</span>'
        + '<h2 style="margin:8px 0 4px;">' + esc(d.title) + '</h2>'
        + '<p style="font-size:0.85rem;color:var(--text-muted);">' + t('challengePublicPinDesc') + '</p></div>'
        + '<div style="margin-bottom:16px;"><label style="font-size:0.85rem;display:block;margin-bottom:4px;">' + t('challengeEnterName') + '</label>'
        + '<input type="text" id="chPinName" placeholder="' + t('challengeEnterName') + '" style="width:100%;padding:10px 14px;font-size:1rem;border:2px solid var(--accent);border-radius:10px;background:var(--surface-elev);color:var(--text);box-sizing:border-box;"></div>'
        + '<button class="btn btn-primary" onclick="joinChallengeWithPin(\'' + challengeId + '\',\'' + pin + '\')" style="font-size:14px;padding:12px 32px;background:linear-gradient(135deg,#E65100,#FF8F00);width:100%;">' + t('challengeJoinBtn') + '</button>'
        + '</div></div>';
    document.getElementById('challengeLearnerContent').innerHTML = html;
}
function joinChallengeWithPin(challengeId, pin) {
    var name = document.getElementById('chPinName').value.trim();
    if (!name) { showToast('❌ ' + t('challengeEnterName')); return; }
    var raw = localStorage.getItem(challengeId);
    if (!raw) return;
    var d = JSON.parse(raw);
    // Auto-assign to team with fewest members
    var distKey = challengeId + '_distrib';
    var existing = [];
    try { existing = JSON.parse(localStorage.getItem(distKey)) || []; } catch(e) { existing = []; }
    var teamCounts = {};
    (d.teams || []).forEach(function(_, idx) { teamCounts[idx] = 0; });
    existing.forEach(function(p) { if (p.team_id !== null) teamCounts[p.team_id] = (teamCounts[p.team_id] || 0) + 1; });
    var bestTeam = 0, minCount = Infinity;
    for (var tid in teamCounts) {
        if (teamCounts[tid] < minCount) { minCount = teamCounts[tid]; bestTeam = parseInt(tid); }
    }
    var code = 'ch_' + Math.random().toString(36).slice(2, 6).toUpperCase();
    var link = window.location.origin + window.location.pathname + '?challenge_code=' + code;
    existing.push({ name_fr: name, name_ar: '', email: '', specialty: '', group: '', code: code, link: link, status: 'joined', team_id: bestTeam, score: 0 });
    localStorage.setItem(distKey, JSON.stringify(existing));
    // Reload in per-participant mode
    loadChallengeForLearner(code);
}

function loadChallengeForLearner(code) {
    // Find challenge with this code in localStorage
    var challengeId = null;
    var participant = null;
    for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.startsWith('challenge_') && k.endsWith('_distrib')) {
            try {
                var data = JSON.parse(localStorage.getItem(k));
                var found = data.find(function(p) { return p.code === code; });
                if (found) {
                    challengeId = k.replace('_distrib', '');
                    participant = found;
                    break;
                }
            } catch(e) {}
        }
    }
    if (!challengeId || !participant) {
        document.getElementById('challengeLearnerContent').innerHTML = '<div class="learner-error"><div class="icon">😕</div><h2>' + t('challengeCodeInvalid') + '</h2></div>';
        return;
    }
    var raw = localStorage.getItem(challengeId);
    if (!raw) { document.getElementById('challengeLearnerContent').innerHTML = '<div class="learner-error"><div class="icon">😕</div><h2>' + t('challengeCodeInvalid') + '</h2></div>'; return; }
    var d = JSON.parse(raw);
    var teamName = '—';
    if (participant.team_id !== null && d.teams && d.teams[participant.team_id]) {
        teamName = d.teams[participant.team_id].name;
    }
    var displayName = participant.name_fr || participant.name_ar || participant.email || t('challengeLearner');
    var html = '<div class="learner-header" style="background:linear-gradient(135deg,#E65100,#FF8F00);">'
        + '<div class="learner-header-title">🎮 ' + esc(d.title) + '</div></div>'
        + '<div class="learner-wrap"><div class="learner-card">'
        + '<div style="text-align:center;margin-bottom:20px;"><span style="font-size:48px;">🏆</span>'
        + '<h2 style="margin:8px 0 4px;">' + t('challengeWelcome') + ', ' + esc(displayName) + '</h2>'
        + '<p style="font-size:0.85rem;color:var(--text-muted);">' + t('challengeTeam') + ': <strong>' + esc(teamName) + '</strong></p></div>';
    // Rounds
    (d.rounds || []).forEach(function(r, idx) {
        var qCount = (r.questions || []).length;
        html += '<div style="background:var(--surface-elev);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px;cursor:pointer;" onclick="startChallengeRound(\'' + challengeId + '\',' + idx + ',\'' + code + '\')">'
            + '<div style="display:flex;justify-content:space-between;align-items:center;">'
            + '<div><strong>' + t('challengeRound') + ' ' + (idx+1) + ': ' + esc(r.title) + '</strong>'
            + '<br><span style="font-size:0.78rem;color:var(--text-muted);">' + qCount + ' ' + t('challengeQuestions') + ' • ' + r.max_score + ' pts</span></div>'
            + '<span style="font-size:20px;">➤</span></div></div>';
    });
    html += '</div></div>';
    document.getElementById('challengeLearnerContent').innerHTML = html;
}

function startChallengeRound(challengeId, roundIdx, code) {
    var raw = localStorage.getItem(challengeId);
    if (!raw) return;
    var d = JSON.parse(raw);
    var round = d.rounds[roundIdx];
    if (!round) return;
    var questions = round.questions || [];
    var container = document.getElementById('challengeLearnerContent');
    var html = '<div class="learner-header" style="background:linear-gradient(135deg,#E65100,#FF8F00);">'
        + '<div class="learner-header-title">🎮 ' + esc(d.title) + ' — ' + t('challengeRound') + ' ' + (roundIdx+1) + '</div></div>'
        + '<div class="learner-wrap"><div class="learner-card">';
    html += '<div class="qt-progress"><div class="qt-progress-bar"><div class="qt-progress-fill" style="width:' + (0/questions.length*100) + '%;"></div></div>'
        + '<span class="qt-progress-text">1/' + questions.length + '</span></div>';
    html += '<div id="chQuestionArea">';
    renderChallengeQuestion(html, questions, 0, challengeId, roundIdx, code);
    html = container.innerHTML; // placeholder - will be replaced by inline rendering
    container.innerHTML = '<div class="learner-header" style="background:linear-gradient(135deg,#E65100,#FF8F00);">'
        + '<div class="learner-header-title">🎮 ' + esc(d.title) + ' — ' + t('challengeRound') + ' ' + (roundIdx+1) + '</div></div>'
        + '<div class="learner-wrap"><div class="learner-card" id="chQuestionCard">'
        + '<div class="qt-progress"><div class="qt-progress-bar"><div class="qt-progress-fill" style="width:' + (1/questions.length*100) + '%;"></div></div>'
        + '<span class="qt-progress-text">1/' + questions.length + '</span></div>';
    if (questions.length > 0) {
        var q = questions[0];
        html += '<h3>' + esc(q.text) + '</h3>';
        q.options.forEach(function(opt, oi) {
            html += '<div class="qt-option" onclick="selectChallengeOption(this,' + oi + ')" data-idx="' + oi + '">'
                + '<span class="qto-letter">' + String.fromCharCode(65 + oi) + '</span>'
                + '<span class="qto-text">' + esc(opt) + '</span></div>';
        });
        html += '<div class="qt-nav"><button class="btn btn-secondary" onclick="submitChallengeAnswer(\'' + challengeId + '\',' + roundIdx + ',0,\'' + code + '\')" style="margin-left:auto;">' + t('challengeSubmitBtn') + '</button></div>';
    } else {
        html += '<p style="color:var(--text-muted);text-align:center;">' + t('challengeNoQuestions') + '</p>';
    }
    html += '</div></div>';
    container.innerHTML = html;
}

var challengeCurrentAnswers = {};

function selectChallengeOption(el, idx) {
    var parent = el.closest('.learner-card') || el.closest('#chQuestionCard');
    if (!parent) return;
    parent.querySelectorAll('.qt-option').forEach(function(o) { o.classList.remove('selected'); });
    el.classList.add('selected');
    challengeCurrentAnswers = { selected: idx };
}

function submitChallengeAnswer(challengeId, roundIdx, qIdx, code) {
    if (challengeCurrentAnswers.selected === undefined) {
        showToast('❌ ' + t('challengeSelectAnswer'));
        return;
    }
    var raw = localStorage.getItem(challengeId);
    if (!raw) return;
    var d = JSON.parse(raw);
    var round = d.rounds[roundIdx];
    if (!round) return;
    var q = round.questions[qIdx];
    if (!q) return;
    var isCorrect = challengeCurrentAnswers.selected === q.correctIndex;
    var totalQuestions = round.questions.length;
    var container = document.getElementById('challengeLearnerContent');
    // Update participant score in distrib data
    try {
        var pRaw = localStorage.getItem(challengeId + '_distrib');
        if (pRaw) {
            var pData = JSON.parse(pRaw);
            var p = pData.find(function(p) { return p.code === code; });
            if (p) {
                var pointsPerQ = Math.round(round.max_score / totalQuestions);
                if (isCorrect) p.score = (p.score || 0) + pointsPerQ;
                localStorage.setItem(challengeId + '_distrib', JSON.stringify(pData));
            }
        }
    } catch(e) {}
    var feedback = isCorrect
        ? '<div style="background:#1B5E20;color:#fff;padding:12px;border-radius:12px;margin:12px 0;text-align:center;">✅ ' + t('challengeCorrect') + ' +' + Math.round(round.max_score / totalQuestions) + ' ' + t('challengePoints') + '</div>'
        : '<div style="background:#C62828;color:#fff;padding:12px;border-radius:12px;margin:12px 0;text-align:center;">❌ ' + t('challengeIncorrect') + '. ' + t('challengeCorrectAnswer') + ': ' + esc(q.options[q.correctIndex]) + '</div>';
    if (qIdx + 1 < totalQuestions) {
        var nextQ = round.questions[qIdx + 1];
        var nextHtml = '<div class="learner-header" style="background:linear-gradient(135deg,#E65100,#FF8F00);">'
            + '<div class="learner-header-title">🎮 ' + esc(d.title) + ' — ' + t('challengeRound') + ' ' + (roundIdx+1) + '</div></div>'
            + '<div class="learner-wrap"><div class="learner-card" id="chQuestionCard">'
            + feedback
            + '<div class="qt-progress"><div class="qt-progress-bar"><div class="qt-progress-fill" style="width:' + ((qIdx+2)/totalQuestions*100) + '%;"></div></div>'
            + '<span class="qt-progress-text">' + (qIdx+2) + '/' + totalQuestions + '</span></div>'
            + '<h3>' + esc(nextQ.text) + '</h3>';
        nextQ.options.forEach(function(opt, oi) {
            nextHtml += '<div class="qt-option" onclick="selectChallengeOption(this,' + oi + ')" data-idx="' + oi + '">'
                + '<span class="qto-letter">' + String.fromCharCode(65 + oi) + '</span>'
                + '<span class="qto-text">' + esc(opt) + '</span></div>';
        });
        nextHtml += '<div class="qt-nav"><button class="btn btn-secondary" onclick="submitChallengeAnswer(\'' + challengeId + '\',' + roundIdx + ',' + (qIdx+1) + ',\'' + code + '\')" style="margin-left:auto;">' + t('challengeSubmitBtn') + '</button></div></div></div>';
        challengeCurrentAnswers = {};
        container.innerHTML = nextHtml;
    } else {
        // Round complete - show result
        var pScore = 0;
        try {
            var pRaw2 = localStorage.getItem(challengeId + '_distrib');
            if (pRaw2) {
                var pData2 = JSON.parse(pRaw2);
                var p2 = pData2.find(function(p) { return p.code === code; });
                if (p2) pScore = p2.score || 0;
            }
        } catch(e) {}
        container.innerHTML = '<div class="learner-header" style="background:linear-gradient(135deg,#E65100,#FF8F00);">'
            + '<div class="learner-header-title">🎮 ' + esc(d.title) + '</div></div>'
            + '<div class="learner-wrap"><div class="learner-card" style="text-align:center;">'
            + feedback
            + '<span style="font-size:64px;">🏆</span>'
            + '<h2>' + t('challengeRoundComplete') + '</h2>'
            + '<div class="qt-result"><div class="qr-score" style="font-size:3rem;">' + pScore + '</div>'
            + '<div class="qr-label">' + t('challengePoints') + '</div></div>'
            + '<p style="color:var(--text-muted);margin-top:12px;">' + t('challengeThanks') + '</p>'
            + '<button class="btn btn-primary" onclick="loadChallengeForLearner(\'' + code + '\')" style="margin-top:16px;background:linear-gradient(135deg,#E65100,#FF8F00);">🔙 ' + t('challengeBackBtn') + '</button></div></div>';
    }
}

/* ===== MANUAL CHALLENGE CREATION ===== */
function createManualChallenge() {
    var title = document.getElementById('chManualTitle').value.trim() || t('challengeNew');
    var theme = document.getElementById('chManualTheme').value.trim();
    var type = document.getElementById('chManualType').value;
    var specialty = document.getElementById('chManualSpecialty').value.trim();
    var objectiveSelect = document.getElementById('chManualObjective');
    var objectiveCustom = document.getElementById('chManualObjectiveCustom');
    var objectiveVal = objectiveSelect.value;
    var objectiveData = null;
    if (objectiveVal === '__custom__' || (objectiveCustom && objectiveCustom.style.display !== 'none' && objectiveCustom.value.trim())) {
        var customText = objectiveCustom ? objectiveCustom.value.trim() : '';
        if (customText) {
            var customId = 'custom_' + Date.now();
            objectiveData = { value: customId, icon: '🎯', fr: customText, ar: customText, en: customText };
        }
    } else if (objectiveVal.indexOf('__saved_') === 0) {
        var savedVal = objectiveVal.replace('__saved_', '').replace('__', '');
        var saved = getCustomObjectives();
        saved.forEach(function(o) { if (o.value === savedVal) objectiveData = { value: o.value, icon: o.icon, fr: o.fr, ar: o.ar, en: o.en }; });
    } else {
        CHALLENGE_OBJECTIVES_LIBRARY.forEach(function(o) { if (o.value === objectiveVal) objectiveData = { value: o.value, icon: o.icon, fr: o.fr, ar: o.ar, en: o.en }; });
    }
    if (!objectiveData) objectiveData = { value: objectiveVal, icon: '🎯', fr: objectiveVal, ar: objectiveVal, en: objectiveVal };
    var numTeams = parseInt(document.getElementById('chManualTeams').value) || 0;
    challengeEditData = { title: title, type: type, source: 'manual', theme: theme, specialty: specialty, objective: objectiveData, config: { teamsAuto: false, roundsCount: 3, timeLimit: 0 } };
    challengeTeamsData = [];
    challengeRoundsData = [];
    challengeParticipantsData = [];
    if (numTeams > 0 && (type === 'group' || type === 'tournament')) {
        var defaultNames = [t('challengeTeamA'), t('challengeTeamB'), t('challengeTeamC'), t('challengeTeamD'), t('challengeTeamE')];
        var teamColors = ['#E65100','#1565C0','#2E7D32','#6A1B9A','#C62828'];
        for (var i = 0; i < numTeams; i++) {
            challengeTeamsData.push({ name: defaultNames[i % defaultNames.length] || 'Équipe ' + (i+1), name_ar: '', color: teamColors[i % teamColors.length], sort_order: i });
        }
    }
    // Create 1 default round
    challengeRoundsData.push({ title: t('challengeRound') + ' 1', title_ar: '', round_type: 'quiz', max_score: 20, sort_order: 0, questions: [], data: {} });
    document.getElementById('challengeEditorCard').style.display = 'block';
    renderChallengeEditor();
    showToast('🎮 Challenge "' + title + '" créé ! Ajoutez des épreuves et des participants.');
}

/* ===== GAMIFICATION SYSTEM ===== */
var GAMIFICATION_LEVELS = [
    { level: 1, nameKey: 'gamificationLevelBeginner', xpRequired: 0 },
    { level: 2, nameKey: 'gamificationLevelApprentice', xpRequired: 100 },
    { level: 3, nameKey: 'gamificationLevelIntermediate', xpRequired: 250 },
    { level: 4, nameKey: 'gamificationLevelAdvanced', xpRequired: 500 },
    { level: 5, nameKey: 'gamificationLevelExpert', xpRequired: 1000 },
    { level: 6, nameKey: 'gamificationLevelMaster', xpRequired: 2000 },
    { level: 7, nameKey: 'gamificationLevelLegend', xpRequired: 4000 },
    { level: 8, nameKey: 'gamificationLevelSupreme', xpRequired: 8000 }
];
var GAMIFICATION_BADGES = [
    { id: 'windows', icon: '🪟', nameKey: 'gamificationBadgeWindows', condition: 'win 3 Windows challenges' },
    { id: 'linux', icon: '🐧', nameKey: 'gamificationBadgeLinux', condition: 'win 3 Linux challenges' },
    { id: 'network', icon: '🌐', nameKey: 'gamificationBadgeNetwork', condition: 'win 3 Network challenges' },
    { id: 'security', icon: '🔒', nameKey: 'gamificationBadgeSecurity', condition: 'win 3 Security challenges' },
    { id: 'apc', icon: '📘', nameKey: 'gamificationBadgeAPC', condition: 'complete 10 challenges' },
    { id: 'troubleshoot', icon: '🔧', nameKey: 'gamificationBadgeTroubleshoot', condition: 'solve 5 problems' },
    { id: 'diagnostic', icon: '🔍', nameKey: 'gamificationBadgeDiagnostic', condition: '100% accuracy 3 times' },
    { id: 'speed', icon: '⚡', nameKey: 'gamificationBadgeSpeed', condition: 'win 3 timed challenges' },
    { id: 'teamwork', icon: '👥', nameKey: 'gamificationBadgeTeamwork', condition: 'participate in 5 team challenges' },
    { id: 'problem_solving', icon: '🧩', nameKey: 'gamificationBadgeProblemSolving', condition: 'complete 5 challenges' },
    { id: 'no_errors', icon: '🎯', nameKey: 'gamificationBadgeNoErrors', condition: 'perfect score 3 times' },
    { id: 'active', icon: '📅', nameKey: 'gamificationBadgeActive', condition: '7-day streak' },
    { id: 'innovation', icon: '💡', nameKey: 'gamificationBadgeInnovation', condition: 'first place in a tournament' },
    { id: 'perseverance', icon: '💪', nameKey: 'gamificationBadgePerseverance', condition: '30-day streak' }
];

function getGamificationData() {
    try { return JSON.parse(localStorage.getItem('gamification_data') || '{}'); } catch(e) { return {}; }
}

function saveGamificationData(data) {
    localStorage.setItem('gamification_data', JSON.stringify(data));
}

function initGamificationData() {
    var d = getGamificationData();
    if (!d.xp) d.xp = 0;
    if (!d.badges) d.badges = [];
    if (!d.stats) d.stats = { done: 0, won: 0, lost: 0, totalScore: 0 };
    if (!d.streak) d.streak = { current: 0, best: 0, lastDate: null };
    if (!d.history) d.history = [];
    if (!d.missions) d.missions = { daily: {}, weekly: {}, lastDailyReset: '', lastWeeklyReset: '' };
    if (!d.hallOfFame) d.hallOfFame = [];
    saveGamificationData(d);
    return d;
}

function getLevel(xp) {
    var lvl = GAMIFICATION_LEVELS[0];
    for (var i = GAMIFICATION_LEVELS.length - 1; i >= 0; i--) {
        if (xp >= GAMIFICATION_LEVELS[i].xpRequired) { lvl = GAMIFICATION_LEVELS[i]; break; }
    }
    return lvl;
}

function getNextLevel(xp) {
    for (var i = 0; i < GAMIFICATION_LEVELS.length; i++) {
        if (xp < GAMIFICATION_LEVELS[i].xpRequired) return GAMIFICATION_LEVELS[i];
    }
    return null;
}

function addXP(amount) {
    var d = initGamificationData();
    var oldLvl = getLevel(d.xp).level;
    d.xp += amount;
    var newLvl = getLevel(d.xp).level;
    if (newLvl > oldLvl) showToast('🎉 ' + t('gamificationLevel') + ' ' + newLvl + ' ! ' + t(GAMIFICATION_LEVELS[newLvl-1].nameKey));
    saveGamificationData(d);
    if (document.getElementById('gamificationContent')) renderGamificationDashboard();
    return d;
}

function checkAndAwardBadges() {
    var d = initGamificationData();
    var newBadges = [];
    GAMIFICATION_BADGES.forEach(function(b) {
        if (d.badges.indexOf(b.id) !== -1) return;
        var earned = false;
        if (b.id === 'apc' && d.stats.done >= 10) earned = true;
        else if (b.id === 'problem_solving' && d.stats.done >= 5) earned = true;
        else if (b.id === 'teamwork' && d.stats.done >= 5) earned = true;
        else if (b.id === 'perseverance' && d.streak.best >= 30) earned = true;
        else if (b.id === 'active' && d.streak.best >= 7) earned = true;
        else if (b.id === 'speed' && d.stats.won >= 3) earned = true;
        if (earned) {
            d.badges.push(b.id);
            newBadges.push(b);
        }
    });
    if (newBadges.length > 0) {
        saveGamificationData(d);
        newBadges.forEach(function(b) { showToast('🎖 ' + t(b.nameKey) + ' !'); });
    }
    if (document.getElementById('gamificationContent')) renderGamificationDashboard();
}

function updateStreak() {
    var d = initGamificationData();
    var today = new Date().toISOString().slice(0, 10);
    if (d.streak.lastDate === today) return;
    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (d.streak.lastDate === yesterday) {
        d.streak.current++;
    } else if (d.streak.lastDate !== today) {
        d.streak.current = 1;
    }
    d.streak.lastDate = today;
    if (d.streak.current > d.streak.best) d.streak.best = d.streak.current;
    saveGamificationData(d);
}

function trackChallengeCompleted(won, score) {
    var d = initGamificationData();
    d.stats.done++;
    if (won) d.stats.won++; else d.stats.lost++;
    d.stats.totalScore += score || 0;
    saveGamificationData(d);
    updateStreak();
    var xpGain = (won ? 50 : 10) + Math.min(score || 0, 50);
    addXP(xpGain);
    checkAndAwardBadges();
}

function checkDailyMissions() {
    var d = initGamificationData();
    var today = new Date().toISOString().slice(0, 10);
    if (d.missions.lastDailyReset !== today) {
        d.missions.daily = {};
        d.missions.lastDailyReset = today;
    }
    var weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    var weekKey = weekStart.toISOString().slice(0, 10);
    if (d.missions.lastWeeklyReset !== weekKey) {
        d.missions.weekly = {};
        d.missions.lastWeeklyReset = weekKey;
    }
    saveGamificationData(d);
}

function renderGamificationDashboard() {
    var container = document.getElementById('gamificationContent');
    if (!container) return;
    var d = initGamificationData();
    checkDailyMissions();
    var lvl = getLevel(d.xp);
    var nextLvl = getNextLevel(d.xp);
    var xpInLevel = d.xp - lvl.xpRequired;
    var xpToNext = nextLvl ? nextLvl.xpRequired - lvl.xpRequired : 1;
    var progressPct = Math.min(100, Math.round((xpInLevel / xpToNext) * 100));
    var successRate = d.stats.done > 0 ? Math.round((d.stats.won / d.stats.done) * 100) : 0;
    var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">'
        // XP & Level card
        + '<div style="background:var(--surface-elev);border:1px solid var(--border);border-radius:16px;padding:16px;">'
        + '<h4 style="margin:0 0 8px;font-size:0.85rem;">⭐ ' + t('gamificationXp') + '</h4>'
        + '<div style="display:flex;align-items:center;gap:12px;">'
        + '<div style="font-size:2rem;font-weight:700;color:var(--accent);">' + lvl.level + '</div>'
        + '<div><div style="font-size:0.9rem;font-weight:600;">' + t(lvl.nameKey) + '</div>'
        + '<div style="font-size:0.72rem;color:var(--text-muted);">' + d.xp + ' XP</div></div></div>'
        + '<div style="margin-top:8px;height:8px;background:var(--border);border-radius:4px;overflow:hidden;">'
        + '<div style="height:100%;width:' + progressPct + '%;background:linear-gradient(90deg,#E65100,#FF8F00);border-radius:4px;transition:width .5s;"></div></div>'
        + '<div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;">' + progressPct + '% — ' + (nextLvl ? (xpToNext - xpInLevel) + ' XP → ' + t(nextLvl.nameKey) : t('gamificationLevelSupreme')) + '</div>'
        + '</div>'
        // Streak & Stats
        + '<div style="background:var(--surface-elev);border:1px solid var(--border);border-radius:16px;padding:16px;">'
        + '<h4 style="margin:0 0 8px;font-size:0.85rem;">🔥 ' + t('gamificationStreak') + '</h4>'
        + '<div style="display:flex;gap:16px;flex-wrap:wrap;">'
        + '<div><span style="font-size:1.5rem;font-weight:700;">' + d.streak.current + '</span><br><span style="font-size:0.7rem;color:var(--text-muted);">' + t('gamificationStreakCurrent') + '</span></div>'
        + '<div><span style="font-size:1.5rem;font-weight:700;">' + d.streak.best + '</span><br><span style="font-size:0.7rem;color:var(--text-muted);">' + t('gamificationStreakBest') + '</span></div>'
        + '<div><span style="font-size:1.5rem;font-weight:700;color:var(--accent);">' + successRate + '%</span><br><span style="font-size:0.7rem;color:var(--text-muted);">' + t('gamificationSuccessRate') + '</span></div>'
        + '</div>'
        + '<div style="margin-top:8px;display:flex;gap:12px;flex-wrap:wrap;font-size:0.75rem;color:var(--text-muted);">'
        + '<span>🎮 ' + d.stats.done + ' ' + t('gamificationChallengesDone') + '</span>'
        + '<span>✅ ' + d.stats.won + ' ' + t('gamificationChallengesWon') + '</span>'
        + '<span>❌ ' + d.stats.lost + ' ' + t('gamificationChallengesLost') + '</span>'
        + '</div></div>'
        // Badges
        + '<div style="background:var(--surface-elev);border:1px solid var(--border);border-radius:16px;padding:16px;">'
        + '<h4 style="margin:0 0 8px;font-size:0.85rem;">' + t('gamificationBadges') + ' (' + d.badges.length + '/' + GAMIFICATION_BADGES.length + ')</h4>'
        + '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    if (d.badges.length === 0) {
        html += '<span style="font-size:0.75rem;color:var(--text-muted);">' + t('gamificationNoBadges') + '</span>';
    } else {
        GAMIFICATION_BADGES.forEach(function(b) {
            var unlocked = d.badges.indexOf(b.id) !== -1;
            html += '<span style="display:inline-flex;align-items:center;gap:4px;font-size:0.75rem;padding:4px 8px;border-radius:8px;background:' + (unlocked ? 'var(--accent-glow)' : 'var(--border)') + ';border:1px solid ' + (unlocked ? 'var(--accent)' : 'transparent') + ';opacity:' + (unlocked ? '1' : '0.4') + ';cursor:default;" title="' + (unlocked ? '' : '🔒 ') + t(b.nameKey) + '">' + b.icon + ' ' + t(b.nameKey) + '</span>';
        });
    }
    html += '</div></div>'
        // Daily Missions
        + '<div style="background:var(--surface-elev);border:1px solid var(--border);border-radius:16px;padding:16px;">'
        + '<h4 style="margin:0 0 8px;font-size:0.85rem;">' + t('gamificationDailyMissions') + '</h4>'
        + '<div style="display:flex;flex-direction:column;gap:4px;font-size:0.75rem;">'
        + '<span>' + (d.stats.done >= 1 ? '✅' : '⬜') + ' ' + t('gamificationDailyComplete1') + '</span>'
        + '<span>' + (d.stats.done >= 3 ? '✅' : '⬜') + ' ' + t('gamificationDailyComplete3') + '</span>'
        + '<span>' + (d.streak.current >= 1 ? '✅' : '⬜') + ' ' + t('gamificationDailyStreak') + '</span>'
        + '</div></div>'
        // Hall of Fame
        + '<div style="grid-column:1/-1;background:var(--surface-elev);border:1px solid var(--border);border-radius:16px;padding:16px;">'
        + '<h4 style="margin:0 0 8px;font-size:0.85rem;">' + t('gamificationHallOfFame') + '</h4>';
    var hof = d.hallOfFame || [];
    if (hof.length === 0) {
        html += '<span style="font-size:0.75rem;color:var(--text-muted);">' + t('gamificationHallOfFameEmpty') + '</span>';
    } else {
        html += '<div style="display:flex;flex-direction:column;gap:4px;font-size:0.78rem;">';
        hof.slice(0, 10).forEach(function(e, idx) {
            var medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx + 1) + '.';
            html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 8px;background:' + (idx % 2 === 0 ? 'var(--bg)' : 'transparent') + ';border-radius:6px;">'
                + '<span>' + medal + '</span>'
                + '<span style="flex:1;">' + esc(e.name || '—') + '</span>'
                + '<span style="color:var(--accent);font-weight:600;">' + (e.xp || 0) + ' XP</span>'
                + '<span style="font-size:0.7rem;color:var(--text-muted);">' + (e.date || '') + '</span>'
                + '</div>';
        });
        html += '</div>';
    }
    html += '</div></div>'
        // Challenge Types showcase
        + '<div style="grid-column:1/-1;">'
        + '<h4 style="font-size:0.85rem;margin:8px 0;">' + t('gamificationChallengeTypes') + '</h4>'
        + '<div style="display:flex;flex-wrap:wrap;gap:6px;">'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">👤 ' + t('gamificationChallengeTypeIndividual') + '</span>'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">👥 ' + t('gamificationChallengeTypeTeam') + '</span>'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">🏫 ' + t('gamificationChallengeTypeGroup') + '</span>'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">🏆 ' + t('gamificationChallengeTypeTournament') + '</span>'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">⚡ ' + t('gamificationChallengeTypeTimed') + '</span>'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">🎯 ' + t('gamificationChallengeTypeCompetence') + '</span>'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">🔍 ' + t('gamificationChallengeTypeCaseStudy') + '</span>'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">🧩 ' + t('gamificationChallengeTypeEscape') + '</span>'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">🛠 ' + t('gamificationChallengeTypeWorkshop') + '</span>'
        + '</div></div>'
        // Rewards showcase
        + '<div style="grid-column:1/-1;">'
        + '<h4 style="font-size:0.85rem;margin:8px 0;">' + t('gamificationRewards') + '</h4>'
        + '<div style="display:flex;flex-wrap:wrap;gap:6px;">'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">🥇 ' + t('gamificationLeaderboardIndividual') + '</span>'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">📜 ' + t('gamificationCertificates') + '</span>'
        + '<span class="badge" style="padding:6px 12px;font-size:0.75rem;">🏆 ' + t('gamificationLeaderboard') + '</span>'
        + '</div></div>';
    container.innerHTML = html;
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('challengePage')) {
        initChallengePage();
    }
    initChallengeLearnerMode();
});
