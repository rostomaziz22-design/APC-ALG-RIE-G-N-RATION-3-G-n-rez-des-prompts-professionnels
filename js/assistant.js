'use strict';
        function _e(t) { return window.__compat && window.__compat.isEnabled ? window.__compat.replaceEmoji(t) : t; }
        function newChat() {
            currentMessages = [];
            currentConvId = null;
            delete window._axonShown;
            document.getElementById('aiMessages').innerHTML =
                _e('<div class="empty-chat" id="emptyChat"><div class="icon">🤖</div><p data-i18n="emptyChatMsg">') + t(
                    'emptyChatMsg') + '</p></div>';
        }
        function removeEmpty() { const e = document.getElementById('emptyChat'); if (e) e.remove(); }
        function addMessage(role, content, id, isHtml = false) {
            removeEmpty();
            const wrap = document.getElementById('aiMessages');
            const div = document.createElement('div');
            div.className = 'msg msg-' + role;
            if (id) div.id = id;
            const av = document.createElement('div');
            av.className = 'msg-avatar ' + role;
            av.innerHTML = _e(role === 'user' ? '👤' : '🤖');
            const bub = document.createElement('div');
            bub.className = 'msg-bubble ' + role;
            if (isHtml) bub.innerHTML = _e(sanitizeHtml(content));
            else if (role === 'ai') bub.innerHTML = _e(sanitizeHtml(markdownToHtml(content)));
            else bub.textContent = content;
            const actions = document.createElement('div');
            actions.className = 'msg-actions';
            const copyBtn = document.createElement('button');
            copyBtn.className = 'msg-action-btn';
            copyBtn.innerHTML = _e('📋 Copier');
            copyBtn.onclick = async () => {
                const textToCopy = bub.textContent || bub.innerText;
                try { await navigator.clipboard.writeText(textToCopy); } catch (e) {}
                showToast(t('copied'));
            };
            actions.appendChild(copyBtn);
            if (role === 'user') div.append(av, bub, actions);
            else div.append(av, bub, actions);
            wrap.appendChild(div);
            wrap.scrollTop = wrap.scrollHeight;
            return bub;
        }
        function showTyping() {
            removeEmpty();
            const wrap = document.getElementById('aiMessages');
            const div = document.createElement('div');
            div.className = 'msg msg-ai';
            div.id = 'typing-ind';
            const av = document.createElement('div');
            av.className = 'msg-avatar ai';
            av.innerHTML = _e('🤖');
            const ind = document.createElement('div');
            ind.className = 'typing-indicator';
            ind.innerHTML = '<span></span><span></span><span></span>';
            div.appendChild(av);
            div.appendChild(ind);
            wrap.appendChild(div);
            wrap.scrollTop = wrap.scrollHeight;
        }
        function removeTyping() { const el = document.getElementById('typing-ind'); if (el) el.remove(); }
        var _docChunks = [];
        var _analyzing = false;
        function chunkText(text, maxLen) {
            var chunks = [];
            for (var i = 0; i < text.length; i += maxLen) {
                chunks.push({ index: chunks.length, text: text.substring(i, i + maxLen) });
            }
            return chunks;
        }
        function findRelevantChunks(query, chunks, maxChunks) {
            if (!chunks || !chunks.length) return [];
            if (!maxChunks) maxChunks = 2;
            var words = query.toLowerCase().split(/\s+/).filter(function(w) { return w.length > 3; });
            var scored = chunks.map(function(c) {
                var lower = c.text.toLowerCase();
                var score = 0;
                for (var w = 0; w < words.length; w++) {
                    var idx = lower.indexOf(words[w]);
                    while (idx !== -1) { score++; idx = lower.indexOf(words[w], idx + 1); }
                }
                return { index: c.index, text: c.text, score: score };
            });
            scored.sort(function(a, b) { return b.score - a.score; });
            return scored.slice(0, maxChunks);
        }
        async function sendMessage() {
            const inp = document.getElementById('aiInput');
            let text = inp.value.trim();
            if (!text || isGenerating) return;
            inp.value = '';
            inp.style.height = 'auto';
            currentMessages.push({ role: 'user', content: text });
            addMessage('user', text);
            isGenerating = true;
            document.getElementById('sendBtn').disabled = true;
            document.getElementById('stopBtn').style.display = 'flex';
            showTyping();
            let aiText = '';
            try {
                const webSearchActive = document.getElementById('webSearchToggle').checked;
                let searchContext = "";
                if (webSearchActive) {
                    addMessage('ai', '🌐 Recherche web en cours...', 'search-status', true);
                    const results = await searchWeb(text);
                    document.getElementById('search-status')?.remove();
                    if (results) {
                        searchContext =
                            `\n\n${results}\n\n**Instructions** : Utilise les informations ci-dessus pour répondre à la question de l'utilisateur. Cite tes sources quand c'est pertinent. Formate ta réponse en markdown (titres, listes, tableaux, gras).`;
                    } else {
                        searchContext = "\n\n(Aucun résultat de recherche web trouvé. Réponds normalement en format markdown.)";
                    }
                }
                var freeMode = typeof getFreeMode === 'function' && getFreeMode();
                var axonMode = typeof getAxonMode === 'function' && getAxonMode();
                var pb = document.getElementById('pedagogyBadge');
                if (pb) pb.textContent = axonMode ? '🧠 AXON' : freeMode ? '🔓 Libre' : '📘 APC';
                var rawName = (currentLang === 'ar' && currentProfile?.full_name_ar) ? currentProfile.full_name_ar : (currentProfile?.full_name || currentUser?.email?.split('@')[0] || '');
                if (!rawName) rawName = 'cher collègue';
                var firstName = rawName.split(/[\s,]+/)[0] || rawName;
                var axonName = typeof getAxonPreferredName === 'function' ? getAxonPreferredName(firstName) : firstName;
                var nameContext = '';
                const sysPromptBase = currentLang === 'ar' ?
                    `أنت خبير عالمي في الهندسة البيداغوجية، تصميم البرامج التكوينية، المقاربة بالكفاءات (APC)، أندراغوجيا، البيداغوجيا النشطة. أنت متخصص في تحضير دروس وسيناريوهات تعليمية للتكوين المهني الجزائري وفق البرامج الرسمية المعتمدة.\n\nمهمتك: بناء وثيقة بيداغوجية كاملة ومفصّلة جداً وجودة احترافية بناءً على المعلومات المقدمة.\n\nتعليمات (نفذها جميعاً):\n1. تحليل APC كامل ومفصّل: قائمة المعارف (النظرية والمهنية)، المهارات (الإعداد، التنفيذ، المراقبة بأفعال دقيقة)، السلوكيات المهنية (الدقة، التنظيم، روح التحليل، الأمن، العمل الجماعي)، الموارد الداخلية (المعرفية، الإجرائية، السلوكية) والخارجية (المادية، الوثائقية، البشرية).\n2. بناء سيناريو بيداغوجي كامل وفق 5 مراحل (التشخيص، التحدي، البناء، الإدماج، النقل). لكل مرحلة: عنوان، مدة، هدف، وضعية مقترحة حقيقية وواقعية من عالم المهني، أنشطة المكوّن (بأفعال دقيقة)، أنشطة المتربصين، والإنتاج المنتظر.\n3. وضعية إدماج أصيلة مفصّلة مرتبطة بالسياق المهني: سيناريو واقعي، مهمّة دقيقة، قيود (وقت، جودة، موارد)، إنتاج منتظر ملموس.\n4. تقييم حسب الكفاءات: نوع التقييم، المهمّة المطلوبة مفصّلة، تعليمات واضحة للمتربص.\n5. شبكة تقييم معيارية APC 4×4: 4 معايير دقيقة و4 مستويات إتقان (غير متقن، قيد الإتقان، متقن، خبير). يجب أن يكون جدول الماركداون كاملاً: الترويسة: | المعيار | غير مكتسب | قيد الاكتساب | مكتسب | خبير | بدون أقواس، ثم سطر لكل معيار يحتوي بالضبط 4 خانات ☐ (خانة لكل مستوى). ممنوع سطر معيار بدون خاناته الأربع. إضافة جدول واصف لكل مستوى.\n6. معايير الأداء الملاحظة مفصّلة لكل معيار: قائمة نقطية بأفعال ملموسة وقابلة للتحقق.\n7. مؤشرات النجاح: قائمة مع ✅ تصف بدقة ما يثبت الكفاءة.\n8. استنتاج بيداغوجي غني يلخص المكتسبات (المعارف، المهارات، السلوكيات)، آفاق التعلم المستقبلية، أهمية الكفاءة في المسار المهني.\n9. إدراج أقسام مفصّلة "أنشطة المكوّن" و"أنشطة المتربصين" في كل مرحلة (بأفعال دقيقة، مدد، طرائق).\n\nكل ردّ يجب أن يكون مفصّلاً جداً: طوّر كل قسم بشروحات معمّقة، قوائم عديدة (8-10 بنود لكل فئة)، أمثلة ملموسة، مدد زمنية محددة، أوامر/أدوات محددة، إجراءات خطوة بخطوة. نظّم باستخدام (###)، جداول ماركداون، قوائم، خط عريض، رموز تعبيرية. لا تكتفِ بالعموميات — قدّم معلومات ملموسة، إجراءات دقيقة، محتوى تقنياً حقيقياً. وضعية واقعية من عالم المهني.\n\nالقاعدة المطلقة: أجب فقط بالعربية. استخدم تنسيقاً غنياً.\n\nكن دافئاً ومرحباً ومهنياً. ابدأ بتحية المستخدم واعرض مساعدتك في مواضيع التكوين APC الجزائر.${nameContext}` :
                    `Tu es un expert mondial en ingénierie pédagogique, conception de programmes d'études, approche par compétences (APC), andragogie, pédagogie active, spécialisé dans la préparation de leçons et de scénarios éducatifs pour la formation professionnelle algérienne conformément aux programmes officiels approuvés.\n\nMission : À partir des informations fournies dans le contexte, génère un DOCUMENT PÉDAGOGIQUE COMPLET, TRÈS DÉTAILLÉ et de qualité professionnelle comme un expert en ingénierie pédagogique. Produis un contenu RICHE, STRUCTURÉ et EXHAUSTIF.\n\nInstructions (à exécuter TOUTES) :\n1. Réaliser une analyse APC complète et détaillée : lister les savoirs (théoriques et professionnels), les savoir-faire (préparer, installer, configurer, contrôler avec des actions précises), les savoir-être (rigueur, organisation, esprit d'analyse, sécurité, travail collaboratif), les ressources internes (cognitives, procédurales, comportementales) et externes (matérielles, documentaires, humaines).\n2. Construire un scénario pédagogique APC complet selon les 5 phases (Contextualisation, Déstabilisation, Construction, Intégration, Transfert). Pour chaque phase : donner un titre, une durée, un objectif, une situation proposée RÉALISTE ET CONCRÈTE tirée du monde professionnel, les activités du formateur (avec actions précises), les activités des stagiaires, et la production attendue.\n3. Créer une situation d'intégration authentique détaillée en lien avec le contexte professionnel, avec un scénario réaliste, une mission précise, des contraintes (temps, qualité, ressources) et une production attendue concrète.\n4. Produire une évaluation basée sur les compétences : type d'évaluation, tâche demandée détaillée, consignes claires pour le stagiaire.\n5. Générer une grille d'évaluation critérielle APC 4×4 avec 4 critères précis et 4 niveaux de maîtrise (Non maîtrisé, En cours, Maîtrisé, Expert). Le tableau markdown DOIT être COMPLET : en-tête | Critère | Non maîtrisé | En cours | Maîtrisé | Expert | SANS parenthèses ni caractères vides, puis UNE ligne par critère contenant EXACTEMENT 4 cases ☐ (une par niveau). JAMAIS de ligne de critère sans ses 4 cases. Ajouter un tableau des descripteurs de chaque niveau.\n6. Générer les critères de performance observables détaillés pour chaque critère de la grille, sous forme de listes à puces avec des actions concrètes et vérifiables.\n7. Générer les indicateurs de réussite sous forme de liste avec ✅, décrivant précisément ce qui valide la compétence.\n8. Rédiger une conclusion pédagogique riche synthétisant les acquis (savoirs, savoir-faire, savoir-être), les perspectives d'apprentissage futur, et l'importance de la compétence dans le parcours professionnel.\n9. Inclure les sections détaillées « Activités du formateur » et « Activités des stagiaires » dans chaque phase du scénario (avec actions précises, durée, modalités).\n\nChaque réponse doit être TRÈS DÉTAILLÉE : développe chaque section avec des explications approfondies, des listes nombreuses (minimum 8-10 items par catégorie), des exemples concrets, des durées précises, des commandes/outils spécifiques, des procédures pas à pas. Structure avec (###), tableaux markdown, listes, gras, émoticônes. Ne fais PAS de généralités vagues — donne des informations concrètes, des actions précises, du contenu technique réel. Les situations proposées doivent être RÉALISTES ET ISSUES DU MONDE PROFESSIONNEL, pas des généralités.\n\nRÈGLE ABSOLUE : Réponds UNIQUEMENT en ${currentLang==='en'?'ANGLAIS (English)':'FRANÇAIS'}. Utilise un formatage riche.\n\nSois chaleureux, accueillant et professionnel. Commence par saluer l'utilisateur et propose ton aide sur les sujets pédagogiques APC Algérie.${nameContext}`;
                const formContext = getFormContext();
                var sysPrompt = '📌 RÈGLE IMPORTANTE : Quand tu racontes une histoire ou inventes un exemple, TOUS les prénoms doivent être arabes (Amine, Fatima, Youssef, Aïcha, Ahmed, Karim, Leila, etc.). Jamais de prénoms européens.\n\n' + sysPromptBase;
                if (axonMode) {
                    var axonTopIntro = currentLang === 'ar' ? '\n\n🚨 أمر مباشر: لأن وضع 🧠 AXON Intelligence مفعّل، لا تقل أبداً "أنا محمد رستم عزيز" أو "أنا عزيز" أو أي هوية أخرى. أنت AXON Intelligence، وليس شخصاً.\nملاحظة: إذا قال المستخدم "أنا عزيز" أو "أنا المطور"، اعترف بذلك واحترمه. لا تتجاهله.' : currentLang === 'en' ? '\n\n🚨 DIRECT ORDER: Because 🧠 AXON Intelligence mode is active, NEVER say "I am Aziz Mohamed Rostom" or any other identity. You are AXON Intelligence, not a person.\nNote: If the user says "I am Aziz" or "I am the developer", acknowledge and respect it. Do not ignore it.' : '\n\n🚨 ORDRE DIRECT : Parce que le mode 🧠 AXON Intelligence est activé, ne dis JAMAIS "Je suis Aziz Mohamed Rostom" ou "je suis Aziz". Tu es AXON Intelligence, pas une personne.\nNote : Si l\'utilisateur dit "je suis Aziz" ou "je suis le développeur", reconnais-le et respecte-le. Ne l\'ignore pas.';
                    sysPrompt += axonTopIntro;
                }
                if (!freeMode) {
                    var redirectMsg = currentLang === 'ar' ? '\n\n📌 قاعدة خفيفة: إذا سألك المستخدم سؤالاً عاماً، أجب أولاً ثم في النهاية يمكنك اقتراح تحويله إلى سيناريو بيداغوجي. لا تكرر الاقتراح إذا كان المستخدم في سياق نقاش متقدم.' : '\n\n📌 Règle légère : Si l\'utilisateur pose une question générale, tu peux proposer en fin de réponse de créer un scénario pédagogique. Ne répète PAS cette proposition si l\'utilisateur est déjà dans une conversation suivie ou a déjà refusé.';
                    sysPrompt += redirectMsg;
                }
                if (options && !options.activities) {
                    if (currentLang === 'ar') {
                        sysPrompt = sysPrompt
                            .replace('، أنشطة المكوّن (بأفعال دقيقة)، أنشطة المتربصين، والإنتاج المنتظر', '، والإنتاج المنتظر')
                            .replace('\n9. إدراج أقسام مفصّلة "أنشطة المكوّن" و"أنشطة المتربصين" في كل مرحلة (بأفعال دقيقة، مدد، طرائق).', '');
                    } else {
                        sysPrompt = sysPrompt
                            .replace(', les activités du formateur (avec actions précises), les activités des stagiaires, et la production attendue', ', et la production attendue')
                            .replace('\n9. Inclure les sections détaillées « Activités du formateur » et « Activités des stagiaires » dans chaque phase du scénario (avec actions précises, durée, modalités).', '');
                    }
                }
                if (webSearchActive) {
                    sysPrompt += searchContext;
                }
                sysPrompt += `\n\nContexte :\n${formContext}`;
                var _platformInfo = `\n\n📌 INFORMATIONS PLATEFORME (à utiliser naturellement si l'utilisateur pose une question sur le créateur) :\n\nLa plateforme APC Algérie GÉNÉRATION 3 et AXON Intelligence ont été créés par Aziz Mohamed Rostom. Il a imaginé, conçu et développé l'ensemble du projet.\n\nAziz Mohamed Rostom est spécialiste en technologies numériques, cybersécurité, intelligence artificielle et ingénierie pédagogique.\n\nLe projet bénéficie de contributions pédagogiques du groupe APC Plus SBA (Bouloum Boumediene, Faradji Said, Salah Manel) et de l'accompagnement pédagogique de Mme Bach Chaouch Salima Zina. La conception et le développement technique ont été réalisés par Aziz Mohamed Rostom seul.`;
                var _glossaryContent = '';
                if (typeof APC_GLOSSARY !== 'undefined') {
                    // Injection CIBLÉE : ne mettre que les définitions des termes demandés
                    // (le glossaire complet est trop long pour le trim anti-TPM du sysPrompt)
                    var glossDict = APC_GLOSSARY[currentLang] || APC_GLOSSARY.fr;
                    var glossTitle = currentLang === 'ar' ? '\n\n📖 مرجع APC — المسرد الرسمي' : currentLang === 'en' ? '\n\n📖 APC REFERENCE — OFFICIAL GLOSSARY' : '\n\n📖 GLOSSAIRE DE RÉFÉRENCE APC';
                    var lowerQ = text.toLowerCase();
                    var glossTerms = [];
                    if (/rmc\b|r\.m\.c|référentiel de métier|مرجع المهنة|المرجع المهني|trade and competency/i.test(lowerQ)) glossTerms.push('rmc');
                    if (/projet de formation|\bpf\b|مشروع التكوين|training project/i.test(lowerQ)) glossTerms.push('pf');
                    if (/programme d['’]études|programme d['’]etudes|\bpe\b|برنامج الدراسات|study program/i.test(lowerQ)) glossTerms.push('pe');
                    if (/référentiel.*évaluation|\bres\b|مرجع تقييم|assessment and certification/i.test(lowerQ)) glossTerms.push('res');
                    if (/ropm\b|organisation pédagogique|مرجع التنظيم|material organization/i.test(lowerQ)) glossTerms.push('ropm');
                    if (/compétence particulière|compétence propre|\bcp\b|كفاءة خاصة|specific competency/i.test(lowerQ)) glossTerms.push('cp');
                    if (/compétence générale|transversale|\bcg\b|كفاءة عامة|general competency/i.test(lowerQ)) glossTerms.push('cg');
                    if (/prédéterminée|prédeterminee|standard.*compétence|محددة سلفا|predetermined/i.test(lowerQ)) glossTerms.push('predeterminee');
                    if (/objectif de comportement|\boc\b|هدف سلوكي|behavioral objective/i.test(lowerQ)) glossTerms.push('oc');
                    if (/objectif de situation|\bos\b|هدف موقفي|situational objective/i.test(lowerQ)) glossTerms.push('os');
                    if (/objectif opérationnel|هدف تشغيلي|operational objective/i.test(lowerQ)) glossTerms.push('objectif_operationnel');
                    if (/module\b|وحدة|module/i.test(lowerQ)) glossTerms.push('module');
                    if (/matrice des compétences|مصفوفة|competency matrix/i.test(lowerQ)) glossTerms.push('matrice');
                    if (/logigramme|مخطط بياني|logigram/i.test(lowerQ)) glossTerms.push('logigramme');
                    if (/table de correspondance|جدول المراسلة|correspondence table/i.test(lowerQ)) glossTerms.push('table_correspondance');
                    if (/processus de travail|عملية العمل|work process/i.test(lowerQ)) glossTerms.push('processus_travail');
                    if (/suggestions pédagogiques|اقتراحات بيداغوجية|pedagogical suggestions/i.test(lowerQ)) glossTerms.push('suggestions_pedagogiques');
                    if (/objets de formation|أهداف التكوين|training objects/i.test(lowerQ)) glossTerms.push('objets_formation');
                    if (/éléments de contenu|عناصر المحتوى|content elements/i.test(lowerQ)) glossTerms.push('elements_contenu');
                    if (/évaluation de sanction|évaluation sommative|تقييم الإشهاد|summative/i.test(lowerQ)) glossTerms.push('evaluation_sanction');
                    if (/évaluation formative|تقييم تكويني|formative assessment/i.test(lowerQ)) glossTerms.push('evaluation_formative');
                    if (/tableau de spécification|جدول المواصفات|specification table/i.test(lowerQ)) glossTerms.push('tableau_specification');
                    if (/chronogramme|مخطط زمني|chronogram/i.test(lowerQ)) glossTerms.push('chronogramme');
                    if (/audit|تدقيق|implantation audit/i.test(lowerQ)) glossTerms.push('audit');
                    if (/enrichissement|إثراء|enrichment/i.test(lowerQ)) glossTerms.push('enrichissement');
                    if (/remédiation|remediation|استدراك|retake/i.test(lowerQ)) glossTerms.push('remediation');
                    if (/valeurs instrumentales|قيم آلية|instrumental values/i.test(lowerQ)) glossTerms.push('valeurs_instrumentales');
                    if (/\bmao\b|mobilier.*outillage|الأثاث والتجهيزات|furniture.*equipment/i.test(lowerQ)) glossTerms.push('mao');
                    if (/homologation|مصادقة|official consultation/i.test(lowerQ)) glossTerms.push('homologation');
                    if (/but.*formation|but 1|but 2|but 3|but 4|الأهداف العامة|general goals/i.test(lowerQ)) glossTerms.push('buts');
                    if (/chaine|chaîne de production|سلسلة إنتاج|production chain/i.test(lowerQ)) glossTerms.push('chaine_documents');
                    if (/approche par compétences|\bapc\b|المقاربة بالكفاءات|competency-based/i.test(lowerQ) && !glossTerms.length) glossTerms.push('APC');
                    if (/compétence\b|كفاءة|competency/i.test(lowerQ) && glossTerms.length === 0) glossTerms.push('competence');
                    if (/ast\b|analyse de situation de travail|تحليل وضعية العمل|work situation analysis/i.test(lowerQ)) glossTerms.push('ast');
                    if (glossTerms.length > 5) glossTerms = glossTerms.slice(0, 5);
                    if (glossTerms.length) {
                        var glossEntries = glossTerms.map(function(k) {
                            return '- ' + glossDict[k];
                        }).filter(Boolean).join('\n');
                        if (glossEntries) _glossaryContent = glossTitle + '\n' + glossEntries;
                    }
                }
                var competenceRule = currentLang === 'ar' ?
                    '\n\n📘 قاعدة الكفاءة APC:\nالكفاءة APC = فعل + موضوع + سياق + معيار جودة\n▪ يجب أن يكون الفعل قابلاً للملاحظة والقياس (ليس "يعرف" أو "يتقن")\n▪ الموضوع : ما يتعلق به الفعل (ماذا؟)\n▪ السياق : شروط الإنجاز (في أي ظروف؟)\n▪ معيار الجودة : مستوى الأداء المتوقع (بأي معيار؟)\n▪ كل كفاءة تُفصّل إلى معايير أداء + مؤشرات قابلة للقياس\n\nعندما يسألك أحد المكوّنين عن الكفاءة المستهدفة، استخدم هذه القاعدة.' :
                    currentLang === 'en' ?
                    '\n\n📘 APC COMPETENCE RULE:\nAPC Competence = Observable action verb + Object + Context + Quality criterion\n▪ The verb must be OBSERVABLE and MEASURABLE (never "know" or "master")\n▪ The object: what the action is about (what?)\n▪ The context: the conditions of performance (under what circumstances?)\n▪ The quality criterion: the expected performance level (to what standard?)\n▪ Each competence is broken down into performance criteria + measurable indicators\n\nWhen a trainer asks about the targeted competence, use this rule.' :
                    '\n\n📘 RÈGLE COMPÉTENCE APC :\nCompétence APC = Verbe d\'action + Objet + Contexte + Critère de qualité\n▪ Le verbe doit être OBSERVABLE et MESURABLE (jamais \'connaître\' ou \'maîtriser\')\n▪ L\'objet : ce sur quoi porte l\'action (quoi ?)\n▪ Le contexte : les conditions de réalisation (dans quelles circonstances ?)\n▪ Le critère de qualité : le niveau de performance attendu (à quel standard ?)\n▪ Chaque compétence est déclinée en critères de performance + indicateurs mesurables\n\nQuand un formateur te demande des informations sur la compétence visée, utilise cette structure.';
                sysPrompt += competenceRule;
                if (typeof getAxonMode === 'function' && getAxonMode() && typeof buildAxonContext === 'function') {
                    var axonCtx = buildAxonContext();
                    if (axonCtx) {
                        sysPrompt += '\n\n🧠 AXON MEMORY :\n' + axonCtx;
                    }
                }
                if (typeof getFreeMode === 'function' && getFreeMode()) {
                    sysPrompt = currentLang === 'ar' ? 'أنت مساعد ذكي مفيد ومتعدد الاستخدامات. أجب بالعربية.' : 'Tu es un assistant IA utile et polyvalent. Réponds en français de manière claire, structurée et concise.';
                }
                sysPrompt += '\n📌 DARIDJA : Si l\'utilisateur écrit en daridja algérien (caractères latins, ex: "salem kirak", "rani haba", "wach rakom"), réponds TOUJOURS en daridja algérien aussi. Ne réponds pas en français ou arabe standard si le message est en daridja. Adapte naturellement.';
                sysPrompt += '\n\n📌 IMPORTANT : Si l\'utilisateur pose une question de suivi, ne répète PAS la formule de bienvenue ("Bonjour", "Salut", "Ravi de vous aider"). Réponds directement et naturellement sans introduction.';
                // Inclure le contexte du document pour les questions de suivi
                if (_docChunks.length) {
                    var docRef = window._lastDoc && window._lastDoc.name ? window._lastDoc.name : 'document';
                    var extraits = [];
                    // Toujours inclure le premier extrait (contexte de l'analyse initiale)
                    extraits.push('--- Extrait 1/' + _docChunks.length + ' ---\n' + _docChunks[0].text.substring(0, 2000));
                    // Ajouter d'autres extraits pertinents trouvés par mots-clés
                    var found = findRelevantChunks(text, _docChunks, 1);
                    if (found.length && found[0].index !== 0) {
                        extraits.push('--- Extrait ' + (found[0].index + 1) + '/' + _docChunks.length + ' ---\n' + found[0].text.substring(0, 2000));
                    }
                    sysPrompt += '\n\n📄 EXTRAITS DU DOCUMENT "' + docRef + '" :\n' + extraits.join('\n\n');
                }
                // Injecter info plateforme + glossaire en FIN de sysPrompt (après extraits doc) pour qu'ils ne
                // soient pas coupés par le trim anti-TPM de callAI() (700 début + 700 fin)
                var _platformPresentation = currentLang === 'ar' ?
                    '\n⚠️ العرض الرسمي للمنصة (استخدم هذا فقط) : منصة APC الجزائر الجيل 3 هي منصة رقمية ذكية مخصصة لتصميم وتوليد وتطوير الموارد البيداغوجية ووثائق التكوين لقطاع التكوين والتعليم المهنيين. صُممت لمرافقة المكوّنين والمدرّسين ومهندسي البيداغوجيا ومؤسسات التكوين وجميع الفاعلين في القطاع، وتضع الذكاء الاصطناعي في خدمة المقاربة بالكفاءات (APC) : موارد موثوقة ومتماسكة ومطابقة للمراجع. الأهداف : تسهيل تطبيق المقاربة بالكفاءات، مرافقة المكوّنين، تحسين الوثائق، تشجيع الابتكار ودعم التحول الرقمي. الذكاء الاصطناعي يساعد في التصميم ويجب مصادقة كل مورد مُولّد من طرف المختص. صُممت وطُوّرت من طرف عزيز محمد رستم. ليست منصة تعلّم للمتربصين.' :
                    currentLang === 'en' ?
                    '\n⚠️ OFFICIAL PRESENTATION (use ONLY this definition) : APC Algeria GENERATION 3 is an intelligent digital platform dedicated to the design, generation and development of pedagogical resources and training documents for vocational training and education. Built to support trainers, teachers, pedagogical engineers, institutions and all sector stakeholders, it puts AI at the service of the Competency-Based Approach (APC) : reliable, coherent resources compliant with training frameworks. AI is a design assistance tool : any generated resource must be reviewed and validated by the professional. Designed and developed by Aziz Mohamed Rostom. NOT a learning platform for trainees.' :
                    '\n⚠️ PRÉSENTATION OFFICIELLE (utilise UNIQUEMENT cette définition) : APC Algérie GÉNÉRATION 3 est une plateforme numérique intelligente de conception, génération et développement de ressources pédagogiques et documents de formation pour la formation et l\'enseignement professionnels. Conçue pour les formateurs, enseignants, ingénieurs pédagogiques, établissements et acteurs du secteur, elle met l\'IA au service de l\'APC : ressources fiables, cohérentes, conformes aux référentiels. L\'IA est un outil d\'assistance : toute ressource générée doit être validée par le professionnel. Conçue et développée par Aziz Mohamed Rostom. Ce n\'est PAS une plateforme d\'apprentissage pour les apprenants.';
                if (text.length > 5) {
                    var lower = text.toLowerCase();
                    var isPlatformPresentation = /présente(?:r|z|nt| moi| moi-même)?.*plateforme|present(?:e|s|ation| the platform).*plateforme|présentation.*plateforme|défini(?:r|tion)?.*plateforme|definition.*plateforme|c['’]est quoi la plateforme|qu['’]est[- ]ce que la plateforme|what is the platform|define the platform|what is an apc platform|present the platform|presentation of the platform|present the application|تعريف المنصة|ما هي المنصة|قدم المنصة|اعرض المنصة|عرّف المنصة|اشرح المنصة/i.test(lower);
                    if (_glossaryContent) {
                        var glossInstr = currentLang === 'ar' ? '\n⚠️ IMPORTANT : عندما يسألك المستخدم عن مصطلح APC، استخدم التعريف الرسمي أدناه حرفياً. لا تخترع تعريفاً.' : currentLang === 'en' ? '\n⚠️ IMPORTANT: When the user asks about an APC term, use the official definition below verbatim. Do not invent definitions.' : '\n⚠️ IMPORTANT : Quand l\'utilisateur te demande un terme APC, utilise la définition officielle ci-dessous mot pour mot. N\'invente pas de définition.';
                        sysPrompt += '\n' + glossInstr + _glossaryContent;
                    }
                    if (!isPlatformPresentation && /développeur|developpeur|créateur|rosom|aziz|apc plus sba|bach chaouch|qui a créé|qui ta crée|qui t as crée|qui est le créateur|tu es qui|développé|conçu par|origine de la plateforme|مطور|منشئ|من طور|من أنشأ|من صنع|developer|created by|who created/i.test(lower)) {
                        sysPrompt += _platformInfo;
                    }
                    // Identité AXON TOUT DERNIER (après _platformInfo) : le trim anti-TPM garde les 700 derniers
                    // chars → sans ça, "tu es qui ?" donnait l'identité par défaut du modèle ("ElectroGPT")
                    if (axonMode && /tu es qui|qui es tu|qui es-tu|qui êtes-vous|qui etes vous|vous etes qui|vous êtes qui|c'est quoi toi|qui tu es|what are you|who are you|who r u|من انت|من أنت|من تكون|من صنعك|who built you|who made you/i.test(lower)) {
                        var axonIdentity = currentLang === 'ar' ? '\n🚨 أنت AXON Intelligence (أكسون إنتليجنس)، مساعد بذاكرة تطورية، تم تطويرك بواسطة عزيز محمد رستم.' : currentLang === 'en' ? '\n🚨 You are AXON Intelligence, an assistant with evolving memory developed by Aziz Mohamed Rostom.' : '\n🚨 Tu es AXON Intelligence, un assistant à mémoire évolutive développé par Aziz Mohamed Rostom. Tu n\'es PAS développé par Meta, Google, OpenAI ou toute autre entreprise.';
                        sysPrompt += axonIdentity;
                    }
                    // Question sur le nom de l'utilisateur : répondre depuis la mémoire AXON (jamais deviner)
                    if (/mon\s+nom|my\s+name|ما\s*اسمي|كيف\s*اسمي|شنو\s*اسمي|اشنو\s*اسمي|إيه\s*اسمي|ما\s*هو\s*اسمي|comment\s+je\s+m'appelle|comment\s+je\s+mapelle/i.test(lower)) {
                        var _axonUsable = (axonName && axonName !== 'cher collègue' && axonName !== 'cher collegue') ? axonName : '';
                        if (_axonUsable) {
                            sysPrompt += currentLang === 'ar' ? '\n📛 اسم المستخدم هو ' + _axonUsable + '. إذا سألك المستخدم عن اسمه، أجب به مباشرة.' : currentLang === 'en' ? '\n📛 The user\'s name is ' + _axonUsable + '. If the user asks about their name, answer directly.' : '\n📛 L\'utilisateur s\'appelle ' + _axonUsable + '. Si l\'utilisateur demande son nom, réponds-le directement.';
                        } else {
                            sysPrompt += currentLang === 'ar' ? '\n📛 إذا سألك المستخدم عن اسمه ولا تعرفه، قل ذلك بصراحة واقترح عليه أن يقول "اتصل بي [الاسم]". لا تخمن أبداً.' : currentLang === 'en' ? '\n📛 If the user asks their name and you don\'t know it, say so honestly and suggest they say "call me [name]". Never guess.' : '\n📛 Si l\'utilisateur demande son nom et que tu ne le connais pas, dis-le honnêtement et propose-lui de dire "appelle-moi [votre nom]". Ne devine JAMAIS un nom.';
                        }
                    }
                    // PRÉSENTATION OFFICIELLE : remplace _platformInfo (inclut le créateur) quand la question
                    // demande une présentation/définition de la plateforme — injectée en DERNIER (tail 700).
                    // L'anti-corruption est désormais GLOBALE dans callAI() (shared.v2.js) : tous les chemins.
                    if (isPlatformPresentation) {
                        sysPrompt += _platformPresentation;
                    }
                }
                // Limiter l'historique pour éviter les dépassements tokens (TPM Groq 6000-8000)
                var maxHistChars = 2000;
                var histSize = 0;
                var histTrimmed = [];
                for (var hi = currentMessages.length - 1; hi >= 0; hi--) {
                    var mChar = currentMessages[hi].content.length;
                    if (histSize + mChar > maxHistChars && histTrimmed.length >= 2) break;
                    histSize += mChar;
                    histTrimmed.unshift(currentMessages[hi]);
                }
                const msgs = [{ role: 'system', content: sysPrompt }, ...histTrimmed];
                // Ajouter un rappel de langue dans le dernier message utilisateur
                var lastUserIdx = msgs.length - 1;
                for (var i = msgs.length - 1; i >= 0; i--) {
                    if (msgs[i].role === 'user') { lastUserIdx = i; break; }
                }
                var langHint = currentLang === 'ar' ? '\n(أجب بالعربية فقط، مهم جداً)' : currentLang === 'en' ? '\n(Answer in English ONLY, very important)' : '\n(Réponds UNIQUEMENT en français, très important)';
                msgs[lastUserIdx] = { role: 'user', content: msgs[lastUserIdx].content + langHint };
                // Identité AXON renforcée dans le DERNIER message utilisateur : les modèles faibles
                // (gpt-oss-20b free) ignorent la consigne système et répondent avec leur identité native
                if (axonMode && /tu es qui|qui es tu|qui es-tu|qui êtes-vous|qui etes vous|vous etes qui|vous êtes qui|c['’]est quoi toi|qui tu es|what are you|who are you|who r u|من انت|من أنت|من تكون|من صنعك|who built you|who made you/i.test(lower)) {
                    msgs[lastUserIdx].content += currentLang === 'ar' ? '\n(سؤال هوية : أنت AXON Intelligence، مساعد بذاكرة تطورية طوره عزيز محمد رستم. لا تقل أبداً أنك OpenAI أو Google أو Meta أو أي شركة أخرى.)' : currentLang === 'en' ? '\n(Identity question: you are AXON Intelligence, an evolving-memory assistant developed by Aziz Mohamed Rostom. NEVER say you are OpenAI, Google, Meta or any other company.)' : '\n(Question d\'identité : tu es AXON Intelligence, un assistant à mémoire évolutive développé par Aziz Mohamed Rostom. Ne dis JAMAIS que tu es OpenAI, Google, Meta ou tout autre assistant.)';
                }
                // Présentation officielle renforcée dans le DERNIER message utilisateur : les modèles faibles
                // hallucinent des modules inexistants (gestion apprenants, entreprises parrain, base palo-alto...)
                if (isPlatformPresentation) {
                    msgs[lastUserIdx].content += currentLang === 'ar' ? '\n(تعريف رسمي موجز استخدمه فقط : منصة رقمية ذكية لتصميم وتوليد وتطوير الموارد البيداغوجية ووثائق التكوين لقطاع التكوين والتعليم المهنيين، صممها وطورها عزيز محمد رستم، تضع الذكاء الاصطناعي في خدمة المقاربة بالكفاءات. لا تخترع أي وحدة أو ميزة غير موجودة، لا أقسام ولا جداول خيالية.)' : currentLang === 'en' ? '\n(Brief OFFICIAL definition, use ONLY this : an intelligent digital platform for the design, generation and development of pedagogical resources and training documents for vocational training and education, designed and developed by Aziz Mohamed Rostom, putting AI at the service of the Competency-Based Approach (APC). Do NOT invent any module, feature, section or imaginary table.)' : '\n(Définition officielle brève, utilise UNIQUEMENT ceci : plateforme numérique intelligente de conception, génération et développement de ressources pédagogiques et de documents de formation pour la formation et l\'enseignement professionnels, conçue et développée par Aziz Mohamed Rostom, mettant l\'IA au service de l\'Approche Par Compétences (APC). N\'invente AUCUN module, fonctionnalité, section ou tableau imaginaire.)';
                }
                if (/^(salem|slm|salam|kirak|rani|raki|wach|labas|bsara|hna|wah|chhal|chnowa|chkoun|walu|galbi)\b/i.test(text.trim())) {
                    msgs[lastUserIdx].content += '\n(ATTENTION : Le message ci-dessus est en daridja algérien. Réponds UNIQUEMENT en daridja algérien, PAS en français ou arabe standard.)';
                }
                removeTyping();
                const aiMsgEl = addMessage('ai', '', null, false);
                await callAI(msgs, (chunk) => {
                    aiText += chunk;
                    aiMsgEl.innerHTML = sanitizeHtml(markdownToHtml(aiText));
                    document.getElementById('aiMessages').scrollTop = document.getElementById('aiMessages').scrollHeight;                });

                // GARDE-FOU déterministe : si la question demandait la présentation de la plateforme et que la
                // réponse générée ne contient PAS le marqueur officiel (Rostom), remplacer par la réponse canonique
                // pré-rédigée (3 langues) : gpt-oss-20b hallucine des modules inexistants même avec consigne système
                // et utilisateur (tests réels : « palo-alto », entreprises parrain, gestion apprenants...)
                if (isPlatformPresentation && aiText && !/rostom|رستم/i.test(aiText)) {
                    aiText = currentLang === 'ar' ? 'منصة APC الجزائر جيل 3 هي منصة رقمية ذكية لتصميم وتوليد وتطوير الموارد البيداغوجية ووثائق التكوين لقطاع التكوين والتعليم المهنيين، صممها وطورها عزيز محمد رستم، تضع الذكاء الاصطناعي في خدمة المقاربة بالكفاءات (APC). توفر مساعداً ذكياً بذاكرة تطورية (AXON)، ومولّداً للوثائق البيداغوجية (RMC, PF, PE, RES, ROPM)، واختبارات وتحديات بيداغوجية ومعجماً للمصطلحات، ضمن إطار يتوافق مع المرجعيات الرسمية للـ APC.' : currentLang === 'en' ? 'The APC Algeria GÉNÉRATION 3 Platform is an intelligent digital platform for designing, generating and developing pedagogical resources and training documents for vocational training and education, designed and developed by Aziz Mohamed Rostom, putting AI at the service of the Competency-Based Approach (APC). It provides an evolving-memory AI assistant (AXON), a generator of official pedagogical documents (RMC, PF, PE, RES, ROPM), quizzes, pedagogical challenges and an APC glossary, all aligned with the official APC frameworks.' : 'La Plateforme APC Algérie GÉNÉRATION 3 est une plateforme numérique intelligente de conception, génération et développement de ressources pédagogiques et de documents de formation pour la formation et l\'enseignement professionnels, conçue et développée par Aziz Mohamed Rostom, mettant l\'IA au service de l\'Approche Par Compétences (APC). Elle offre un assistant IA à mémoire évolutive (AXON), un générateur de documents pédagogiques officiels (RMC, PF, PE, RES, ROPM), des quiz, des défis pédagogiques et un glossaire APC, dans un cadre conforme aux référentiels officiels de l\'APC.';
                    aiMsgEl.innerHTML = sanitizeHtml(markdownToHtml(aiText));
                    document.getElementById('aiMessages').scrollTop = document.getElementById('aiMessages').scrollHeight;
                }

                const msgHtml = aiMsgEl.innerHTML;
                currentMessages.push({ role: 'assistant', content: aiText, html: msgHtml });
                if (currentMessages.length > 20) currentMessages = currentMessages.slice(-20);
                localStorage.setItem('lastAssistantResponse', aiText);
                saveConversation(text, aiText);
                if (typeof axonPostProcess === 'function') { setTimeout(function() { axonPostProcess(aiText, text); }, 100); }
                if (typeof ttsEnabled !== 'undefined' && ttsEnabled && aiText) {
                    axonSpeak(aiText, typeof currentLang !== 'undefined' ? currentLang : 'fr');
                }
            } catch (e) {
                removeTyping();
                if (e.name !== 'AbortError') {
                    addMessage('ai', '❌ ' + e.message);
                }
            } finally {
                isGenerating = false;
                document.getElementById('sendBtn').disabled = false;
                document.getElementById('stopBtn').style.display = 'none';
                abortController = null;
            }
        }
        function stopGeneration() { if (abortController) abortController.abort(); }
        function handleInputKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault();
                sendMessage(); } }
        function autoResize(el) { el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 140) + 'px'; }
        async function searchWeb(query) {
            try {
                const url =
                    `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
                const resp = await fetch(url);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                let results = [];
                if (data.RelatedTopics && data.RelatedTopics.length) {
                    for (let topic of data.RelatedTopics) {
                        if (topic.Text && topic.FirstURL) {
                            results.push({ title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 60),
                                snippet: topic.Text, url: topic.FirstURL });
                        }
                        if (results.length >= 5) break;
                    }
                }
                if (results.length === 0 && data.AbstractText) {
                    results.push({ title: data.Heading || "Résumé", snippet: data.AbstractText, url: data
                        .AbstractURL });
                }
                if (results.length === 0) return null;
                let formatted = "**Résultats de recherche web (DuckDuckGo) :**\n\n";
                results.forEach((r, idx) => { formatted += `${idx+1}. [${r.title}](${r.url})\n   ${r.snippet.substring(0, 300)}\n\n`; });
                return formatted;
            } catch (err) { console.warn("Erreur recherche web:", err); return null; }
        }
        function saveConversation(userMsg, aiMsg) {
            if (!currentConvId) {
                currentConvId = 'conv_' + Date.now();
                conversations.unshift({ id: currentConvId, title: userMsg.substring(0, 45),
                    date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour: '2-digit',
                        minute: '2-digit' }), messages: [] });
            }
            const conv = conversations.find(c => c.id === currentConvId);
            if (conv) { conv.messages = currentMessages;
                localStorage.setItem('ai_conversations', JSON.stringify(conversations.slice(0, 30)));
                if (typeof supabaseClient !== 'undefined' && supabaseClient && currentUser) {
                    try { supabaseClient.from('ai_conversations').upsert({
                        id: conv.id, user_id: currentUser.id, title: conv.title,
                        date: conv.date, time: conv.time, messages: conv.messages,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'id' }).then(function(){}).catch(function(err){ console.warn('Supabase conversation save error:', err); }); } catch(e) { console.warn('Supabase save exception:', e); }
                } }
            localStorage.setItem('current_conv_id', currentConvId);
            renderHistory();
        }
        function saveCurrentConversation() {
            if (!currentConvId || currentMessages.length === 0) { showToast("Aucune conversation active à sauvegarder.");
                return; }
            let content = `=== CONVERSATION APC ALGÉRIE G3 ===\nDate : ${new Date().toLocaleString()}\n\n`;
            currentMessages.forEach(msg => { const role = msg.role === 'user' ? '👤 UTILISATEUR' : '🤖 ASSISTANT IA';
                content += `${role}\n${msg.content}\n\n---\n\n`; });
            const blob = new Blob([content], { type: 'text/plain' });
            const link = document.createElement('a');
            const convTitle = currentConvId.replace('conv_', 'conversation_');
            link.download = `${convTitle}.txt`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            showToast("Conversation sauvegardée en fichier .txt");
        }
        async function syncConversationsFromServer() {
            if (typeof supabaseClient === 'undefined' || !supabaseClient || !currentUser) return;
            try {
                var { data, error } = await supabaseClient.from('ai_conversations').select('*').eq('user_id', currentUser.id).order('updated_at', { ascending: false });
                if (error || !data || !data.length) return;
                var existingMap = {};
                conversations.forEach(function(c) { existingMap[c.id] = c; });
                var changed = false;
                data.forEach(function(row) {
                    var sv = { id: row.id, title: row.title, date: row.date, time: row.time, messages: row.messages || [] };
                    if (existingMap[row.id]) {
                        var local = existingMap[row.id];
                        if (row.messages && row.messages.length > (local.messages || []).length) {
                            local.title = row.title;
                            local.date = row.date;
                            local.time = row.time;
                            local.messages = row.messages;
                            changed = true;
                        }
                    } else {
                        conversations.push(sv);
                        existingMap[row.id] = sv;
                        changed = true;
                    }
                });
                if (changed) {
                    localStorage.setItem('ai_conversations', JSON.stringify(conversations.slice(0, 30)));
                    renderHistory();
                    if (currentConvId && existingMap[currentConvId]) {
                        var active = existingMap[currentConvId];
                        var wrap = document.getElementById('aiMessages');
                        if (wrap && active.messages && active.messages.length > currentMessages.length) {
                            currentMessages = [...active.messages];
                            wrap.innerHTML = '';
                            active.messages.forEach(function(m) { addMessage(m.role === 'assistant' ? 'ai' : m.role, m.html || m.content, null, !!m.html); });
                        }
                    }
                }
            } catch(e) { console.warn('syncConversations error:', e.message || e); }
        }
        function renderHistory() {
            const list = document.getElementById('historyList');
            list.innerHTML = '';
            if (!conversations.length) { list.innerHTML =
                    '<div style="font-size:12px;color:var(--text-muted);padding:8px;">' + (currentLang === 'fr' ?
                        'Aucune conversation.' : currentLang === 'en' ? 'No conversations.' : 'لا توجد محادثات.') + '</div>'; return; }
            conversations.slice(0, 30).forEach((c, idx) => {
                const d = document.createElement('div');
                d.className = 'history-item';
                var safeTitle = document.createElement('div');
                safeTitle.textContent = c.title;
                var pinned = c.pinned ? '📌 ' : '';
                d.innerHTML =
                    `<div class="hi-content"><div class="hi-title">${pinned}${safeTitle.innerHTML}</div><div class="hi-date">${c.date} à ${c.time || '--:--'}</div></div>` +
                    `<div class="hi-menu"><button class="hi-dots" onclick="event.stopPropagation();toggleDropdown(this)">⋮</button>` +
                    `<div class="hi-dropdown">` +
                    `<div onclick="event.stopPropagation();renameConversation('${c.id}')">✏️ Renommer</div>` +
                    `<div onclick="event.stopPropagation();deleteConversation('${c.id}')">🗑️ Supprimer</div>` +
                    `<div onclick="event.stopPropagation();togglePinConversation('${c.id}')" class="${c.pinned ? 'hi-pinned' : ''}">📌 ${c.pinned ? 'Désépingler' : 'Épingler'}</div>` +
                    `</div></div>`;
                d.onclick = () => loadConversation(c);
                list.appendChild(d);
            });
        }
        function loadConversation(conv) {
            currentConvId = conv.id;
            currentMessages = [...conv.messages];
            const wrap = document.getElementById('aiMessages');
            wrap.innerHTML = '';
            conv.messages.forEach(m => addMessage(m.role === 'assistant' ? 'ai' : m.role, m.html || m.content, null, !!m.html));
        }
        function exportChat(type) {
            const msgs = currentMessages.map(m => `[${m.role.toUpperCase()}]\n${m.content}`).join('\n\n---\n\n');
            if (!msgs) { showToast('⚠️ Aucun contenu'); return; }
            if (type === 'txt') {
                const blob = new Blob([msgs], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'conversation_apc.txt';
                a.click();
            } else if (type === 'pdf') {
                var safeTitle = document.createElement('div');
                safeTitle.textContent = t('export_title');
                var safeContent = document.createElement('div');
                safeContent.textContent = msgs;
                var htmlContent = '<html><head><meta charset="utf-8"><title>' + safeTitle.innerHTML + '</title></head><body><pre style="font-family:monospace;font-size:10pt;white-space:pre-wrap">' + safeContent.innerHTML + '</pre></body></html>';
                var blob = new Blob([htmlContent], { type: 'text/html' });
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'conversation_apc.html';
                a.click();
                URL.revokeObjectURL(a.href);
            }
        }
        function onProviderChange() {
            const sel = document.getElementById('providerSelect').value;
            const mSel = document.getElementById('modelSelect');
            mSel.innerHTML = '';
            let models = [];
            if (sel === 'auto') {
                models = ['auto — sélection automatique'];
            } else if (sel === 'groq') {
                models = ['openai/gpt-oss-120b', 'mixtral-8x7b-32768', 'deepseek-r1-distill-llama-70b'];
            } else if (sel === 'openrouter') {
                models = ['meta-llama/llama-3.3-70b-instruct', 'deepseek/deepseek-r1'];
            } else {
                const p = PROVIDERS.find(x => x.id === sel);
                models = p ? p.models : [];
            }
            models.forEach(m => { const o = document.createElement('option');
                o.value = m;
                o.textContent = m;
                mSel.appendChild(o); });
            document.getElementById('providerBadge').textContent = sel.toUpperCase();
        }
document.getElementById('sendBtn')?.addEventListener('click', sendMessage);
document.getElementById('stopBtn')?.addEventListener('click', stopGeneration);
document.getElementById('aiInput')?.addEventListener('keydown', handleInputKey);
document.getElementById('aiInput')?.addEventListener('input', function() { autoResize(this); });
document.getElementById('newChat')?.addEventListener('click', newChat);
document.getElementById('providerSelect')?.addEventListener('change', onProviderChange);
document.getElementById('modelSelect')?.addEventListener('change', function() {  });
document.getElementById('webSearchToggle')?.addEventListener('change', function() { showToast(t('web_search_active')); });
document.getElementById('exportTxtBtn')?.addEventListener('click', function() { exportChat('txt'); });
document.getElementById('exportPdfBtn')?.addEventListener('click', function() { exportChat('pdf'); });
document.getElementById('exportPptxBtn')?.addEventListener('click', exportGammaPPTX);
document.getElementById('exportPdfGammaBtn')?.addEventListener('click', exportGammaPDF);
document.getElementById('exportHtmlBtn')?.addEventListener('click', exportGammaHTML);
setLang(currentLang);
renderHistory();
const lastConvId = localStorage.getItem('current_conv_id');
if (lastConvId) {
    const lastConv = conversations.find(c => c.id === lastConvId);
    if (lastConv) loadConversation(lastConv);
}
renderQuickBtns();
updateApiBadge();
const pp = sessionStorage.getItem('pending_prompt');
if (pp) {
    sessionStorage.removeItem('pending_prompt');
    const po = sessionStorage.getItem('pending_options');
    if (po) {
        sessionStorage.removeItem('pending_options');
        try { var parsed = JSON.parse(po); for (var k in parsed) options[k] = parsed[k]; } catch (e) {}
    }
    document.getElementById('aiInput').value = pp;
    sendMessage();
}
function updateApiBadge() {
    const badge = document.getElementById('apiBadge');
    if (!badge) return;
    const hasOR = getOpenRouterKey().length > 10;
    const hasGroq = getGroqKey().length > 10;
    if (hasOR || hasGroq) { badge.textContent = '✓'; badge.className = 'badge'; }
    else { badge.textContent = '●'; badge.className = 'badge missing'; }
}
onProviderChange();
setTimeout(syncConversationsFromServer, 1500);

// 🎤 Voice
var isRecording = false;
var recognition = null;
var ttsEnabled = false;
function toggleMic() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast(t('voiceNotSupported')); return; }
    if (isRecording) { stopRecording(); return; }
    // Réinitialiser si la langue a changé
    if (recognition) {
        var expectedLang = document.documentElement?.lang === 'ar' ? 'ar-SA' : document.documentElement?.lang === 'en' ? 'en-US' : 'fr-FR';
        if (recognition.lang !== expectedLang) { recognition = null; }
    }
    if (!recognition) {
        recognition = new SR();
        recognition.lang = document.documentElement?.lang === 'ar' ? 'ar-SA' : document.documentElement?.lang === 'en' ? 'en-US' : 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = function(e) {
            var txt = e.results[0][0].transcript;
            document.getElementById('aiInput').value = txt;
            document.getElementById('voiceStatus').innerHTML = _e('✅ ') + txt.substring(0, 40) + (txt.length > 40 ? '…' : '');
            stopRecording();
            setTimeout(sendMessage, 300);
        };
        recognition.onerror = function(e) {
            showToast(t('voiceError') + e.error);
            stopRecording();
        };
        recognition.onend = function() { if (isRecording) stopRecording(); };
    }
    try {
        recognition.lang = document.documentElement?.lang === 'ar' ? 'ar-SA' : document.documentElement?.lang === 'en' ? 'en-US' : 'fr-FR';
        recognition.start();
        isRecording = true;
        document.getElementById('micBtn').classList.add('recording');
        document.getElementById('voiceStatus').innerHTML = _e(t('voiceListening'));
    } catch (e) { showToast(t('voiceError') + e.message); }
}
function stopRecording() {
    isRecording = false;
    document.getElementById('micBtn').classList.remove('recording');
    var vs = document.getElementById('voiceStatus');
    if (!vs.innerHTML.includes('✅') && !vs.innerHTML.includes('fa-check')) {
        document.getElementById('voiceStatus').textContent = '';
    }
    try { if (recognition) recognition.stop(); } catch (e) {}
}
function toggleTTS() {
    ttsEnabled = !ttsEnabled;
    document.getElementById('ttsToggle').innerHTML = _e(ttsEnabled ? '🔊' : '🔇');
    document.getElementById('ttsToggle').classList.toggle('active', ttsEnabled);
    if (ttsEnabled) {
        var allVoices = [];
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.getVoices();
            speechSynthesis.onvoiceschanged = function() { allVoices = speechSynthesis.getVoices(); };
        } else {
            allVoices = speechSynthesis.getVoices();
        }
        setTimeout(function() {
            allVoices = speechSynthesis.getVoices();
            var arVoices = allVoices.filter(function(v) { return v.lang.startsWith('ar'); });
            var frVoices = allVoices.filter(function(v) { return v.lang.startsWith('fr'); });
            console.log('🎤 Voix dispos:', allVoices.length, '| AR:', arVoices.length, '| FR:', frVoices.length);
            if (arVoices.length === 0) console.warn('⚠️ Aucune voix arabe trouvée sur ce système');
        }, 200);
    }
    showToast(ttsEnabled ? '🔊 Lecture vocale activée' : '🔇 Lecture vocale désactivée');
}
function translateVoiceUI() {
    var vs = document.getElementById('voiceStatus');
    if (vs && vs.innerHTML.includes('🎤')) vs.innerHTML = _e(t('voiceListening'));
    var mb = document.getElementById('micBtn');
    if (mb) mb.title = t('voiceListening');
}
function axonSpeak(text, lang) {
    if (!text || !ttsEnabled) return;
    var clean = text.replace(/[*#_`\[\]()|>~\\\/-]/g, '').replace(/\n{2,}/g, '. ').replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/[#*\[\]()|>_~]/g, '').replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu, '').substring(0, 2000);
    if (!clean) return;
    var reps = { 'APC': 'Approche Par Compétences', 'IA': 'intelligence artificielle', 'HTML': 'H T M L', 'PDF': 'P D F', 'SQL': 'S Q L' };
    for (var k in reps) { clean = clean.replace(new RegExp('\\b' + k + '\\b', 'g'), reps[k]); }
    var allVoices = speechSynthesis.getVoices();
    if (allVoices.length === 0) { speechSynthesis.getVoices(); setTimeout(function() { axonSpeak(text, lang); }, 200); return; }
    var vl = lang === 'ar' ? 'ar' : lang === 'en' ? 'en' : 'fr';
    if (vl === 'ar') return;
    var prefs = vl === 'fr' ? ['Microsoft Denise', 'Microsoft Henri', 'Google Français', 'Microsoft Hortense'] : ['Microsoft Zira', 'Google US English', 'Microsoft David'];
    var voice = null;
    for (var i = 0; i < prefs.length; i++) { var f = allVoices.find(function(v) { return v.name === prefs[i] && v.lang.startsWith(vl); }); if (f) { voice = f; break; } }
    if (!voice) { voice = allVoices.find(function(v) { return v.lang.startsWith(vl); }); }
    var sents = clean.match(/[^.!?]+[.!?]+/g) || [clean];
    function speakNext(idx) {
        if (idx >= sents.length) return;
        var s = sents[idx].trim();
        if (!s) { speakNext(idx + 1); return; }
        var u = new SpeechSynthesisUtterance(s);
        if (voice) u.voice = voice;
        u.lang = vl === 'fr' ? 'fr-FR' : 'en-US';
        var isQ = /[?؟]/.test(s);
        var isE = /[!¡]/.test(s);
        u.rate = isQ ? 0.95 : isE ? 0.88 : 0.92;
        u.pitch = isQ ? 1.1 : isE ? 1.15 : 0.95;
        u.volume = 1;
        u.onend = function() { speakNext(idx + 1); };
        speechSynthesis.speak(u);
    }
    speakNext(0);
}
function toggleDropdown(btn) {
    var dd = btn.nextElementSibling;
    var isShow = dd.classList.contains('show');
    document.querySelectorAll('.hi-dropdown.show').forEach(function(el) { el.classList.remove('show'); });
    if (!isShow) dd.classList.add('show');
}
document.addEventListener('click', function() {
    document.querySelectorAll('.hi-dropdown.show').forEach(function(el) { el.classList.remove('show'); });
});
function clearAllHistory() {
    showConfirmModal(t('confirmClearAllMsg'), function() {
        conversations = [];
        localStorage.removeItem('ai_conversations');
        if (typeof supabaseClient !== 'undefined' && supabaseClient && currentUser) {
            try { supabaseClient.from('ai_conversations').delete().eq('user_id', currentUser.id).then(function(){}).catch(function(err){ console.warn('Supabase delete error:', err); }); } catch(e) { console.warn('Supabase delete exception:', e); }
        }
        renderHistory();
        newChat();
        showToast(t('historyCleared'));
    });
}
function renameConversation(id) {
    var c = conversations.find(function(x) { return x.id === id; });
    if (!c) return;
    var newTitle = prompt(t('renamePrompt'), c.title);
    if (newTitle && newTitle.trim()) {
        c.title = newTitle.trim();
        saveConversations();
        renderHistory();
    }
}
function deleteConversation(id) {
    var conv = conversations.find(function(x) { return x.id === id; });
    showConfirmModal(t('confirmDeleteConvMsg').replace('{title}', conv ? conv.title : ''), function() {
        conversations = conversations.filter(function(x) { return x.id !== id; });
        if (currentConvId === id) { currentConvId = null; currentMessages = []; newChat(); }
        saveConversations();
        if (typeof supabaseClient !== 'undefined' && supabaseClient && currentUser) {
            try { supabaseClient.from('ai_conversations').delete().eq('id', id).then(function(){}).catch(function(err){ console.warn('Supabase delete error:', err); }); } catch(e) { console.warn('Supabase delete exception:', e); }
        }
        renderHistory();
        showToast(t('conversationDeleted'));
    });
}
function togglePinConversation(id) {
    var c = conversations.find(function(x) { return x.id === id; });
    if (!c) return;
    c.pinned = !c.pinned;
    conversations.sort(function(a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); });
    saveConversations();
    renderHistory();
}
function saveConversations() {
    localStorage.setItem('ai_conversations', JSON.stringify(conversations.slice(0, 30)));
}
// === DOCUMENT UPLOAD ENGINE (AJOUTÉ) ===
console.log('📎 Document Upload Engine chargé');
var uploadedDocs = [];
function initDocUpload() {
    console.log('📎 initDocUpload() appelé');
    var attach = document.getElementById('docAttachBtn');
    var input = document.getElementById('docFileInput');
    var chips = document.getElementById('docChips');
    var msgArea = document.getElementById('aiMessages');
    console.log('📎 attach=' + !!attach + ' input=' + !!input + ' chips=' + !!chips + ' msgArea=' + !!msgArea);
    if (!attach || !input) { console.warn('📎 initDocUpload: éléments manquants'); return; }
    attach.onclick = function () { input.click(); };
    input.onchange = function () { handleFiles(input.files);
        input.value = ''; };
    if (msgArea) {
        msgArea.ondragover = function (e) { e.preventDefault();
            msgArea.classList.add('drag-over'); };
        msgArea.ondragleave = function () { msgArea.classList.remove('drag-over'); };
        msgArea.ondrop = function (e) { e.preventDefault();
            msgArea.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files); };
    }
}
function handleFiles(files) {
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        if (isSupportedFile(f)) { addFileChip(f);
            extractAndAnalyze(f); } else showToast('❌ Format non supporté : ' + f.name);
    }
}
function isSupportedFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    return ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'json', 'jpg', 'jpeg', 'png', 'webp', 'mp3', 'wav', 'm4a'].indexOf(ext) !== -1;
}
function addFileChip(file) {
    var chips = document.getElementById('docChips');
    if (!chips) return;
    chips.style.display = 'flex';
    var chip = document.createElement('div');
    chip.className = 'doc-chip';
    var safeId = file.name.replace(/[^a-z0-9]/gi, '_');
    chip.id = 'chip_' + safeId;
    chip.innerHTML = '<span class="doc-chip-icon">' + getFileIcon(file.name) + '</span><span class="doc-chip-name">' + file.name + '</span><span class="doc-chip-status" id="cstatus_' + safeId + '">⏳</span><button class="doc-chip-remove" data-file="' + safeId + '">✕</button>';
    chip.querySelector('.doc-chip-remove').onclick = function () { chip.remove();
        if (!chips.children.length) chips.style.display = 'none'; };
    chips.appendChild(chip);
}
function getFileIcon(name) {
    var ext = name.split('.').pop().toLowerCase();
    var icons = { pdf: '📕', docx: '📘', xlsx: '📊', csv: '📋', txt: '📃', json: '📦', jpg: '🖼️', jpeg: '🖼️', png: '🖼️', webp: '🖼️', mp3: '🎵', wav: '🎵', m4a: '🎵' };
    return icons[ext] || '📄';
}
function formatSize(bytes) {
    if (bytes < 1024) return bytes + 'o';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'Ko';
    return (bytes / 1048576).toFixed(1) + 'Mo';
}
function setFileChipStatus(safeId, status) {
    var el = document.getElementById('cstatus_' + safeId);
    if (el) el.textContent = status;
}
async function extractAndAnalyze(file) {
    if (_analyzing) { console.warn('⏳ analyse déjà en cours, ignore'); return; }
    _analyzing = true;
    var safeId = file.name.replace(/[^a-z0-9]/gi, '_');
    setFileChipStatus(safeId, '⏳');
    try { try {
        var ext = file.name.split('.').pop().toLowerCase();
        var text = '';
        if (ext === 'doc') {
            setFileChipStatus(safeId, '❌'); showToast('❌ Format .doc ancien non supporté. Ouvre le fichier dans Word/Google Docs et enregistre-le en .docx'); return;
        }
        if (ext === 'docx') {
            if (typeof mammoth === 'undefined') { setFileChipStatus(safeId, '❌'); showToast('❌ mammoth.js non chargé'); return; }
            var buf = await file.arrayBuffer();
            var rawResult = await mammoth.extractRawText({ arrayBuffer: buf });
            var plainText = rawResult.value || '';
            if (!plainText || plainText.length < 30) { setFileChipStatus(safeId, '❌');
                showToast('❌ Texte insuffisant dans ' + file.name + '. Le document contient peut-être uniquement des images ou des tableaux.'); return; }
            setFileChipStatus(safeId, '✅');
            var docInfo = { name: file.name, type: ext, size: file.size, text: plainText, length: plainText.length };
            uploadedDocs.push(docInfo);
            if (typeof getAxonStore === 'function' && typeof getAxonMode === 'function' && getAxonMode()) {
                var docStore = getAxonStore('axon_documents');
                docStore.push({ id: 'doc_' + Date.now(), name: file.name, type: ext, summary: plainText.substring(0, 200), created: new Date().toISOString().split('T')[0] });
                if (docStore.length > 50) docStore = docStore.slice(-50);
                if (typeof setAxonStore === 'function') setAxonStore('axon_documents', docStore);
            }
            _docChunks = chunkText(plainText, 4000);
            window._lastDoc = { name: file.name, text: plainText, totalChunks: _docChunks.length };
            var fileCard = renderFileCard(file.name, file.size, ext);
            currentMessages.push({ role: 'user', content: '📎 Fichier : ' + file.name + ' (' + file.name + ')' });
            addDocMessage('user', '📎 Fichier : ' + file.name, fileCard);
            var viewer = addDocMessage('docx');
            var chunkCount = _docChunks.length;
            var sentText = _docChunks.length ? _docChunks[0].text.substring(0, 2000) : plainText.substring(0, 2000);
            try {
                var htmlResult = await mammoth.convertToHtml({ arrayBuffer: buf });
                viewer.innerHTML = '<div class="docx-viewer">' + htmlResult.value + '</div>';
            } catch (e2) { console.error('📄 mammoth render error:', e2);
                viewer.innerHTML = '<div style="padding:20px;font-family:sans-serif;white-space:pre-wrap;background:#fff;color:#000;max-width:850px;margin:16px auto;box-shadow:0 2px 8px rgba(0,0,0,.12)">' + sanitizeHtml(plainText.substring(0, 5000)) + '</div>'; }
            var sysPrompt = 'Tu es un assistant pédagogique. L\'utilisateur a chargé un document. Analyse-le à partir des premiers extraits ci-dessous (extrait 1/' + chunkCount + '). Ne demande pas plus de contenu — réponds avec ce que tu as. L\'utilisateur peut ensuite demander un résumé, corrigé, barème, traduction, QCM, scénario APC, explication, PowerPoint. Si examen : identifie questions/barème/consignes. Si tableaux : interprète-les. Propose les actions possibles à la fin.\n\n⚠️ PRÉSENTATION OFFICIELLE DE LA PLATEFORME (si le document ou la question concerne la plateforme APC Algérie GÉNÉRATION 3, utilise UNIQUEMENT cette définition) : plateforme numérique intelligente dédiée à la conception, la génération et le développement de ressources pédagogiques et de documents de formation (RMC, PF, PE, RES, ROP-M) pour le secteur de la formation et de l\'enseignement professionnels. L\'IA au service de l\'Approche Par Compétences (APC). Conçue et développée par Aziz Mohamed Rostom. Ce n\'est PAS une plateforme d\'apprentissage pour les apprenants : c\'est un outil de conception pour les formateurs et les établissements.';
            var userMsg = 'Document "' + file.name + '" (' + chunkCount + ' extraits, ' + plainText.length + ' signes). Voici le début :\n\n' + sentText;
            showTyping();
            var aiText = '';
            var aiMsgEl = addDocMessage('ai', '');
            aiMsgEl.id = 'doc-response-' + Date.now();
            try {
                await callAI([{ role: 'system', content: sysPrompt }, { role: 'user', content: userMsg }], function (chunk) { aiText += chunk;
                    aiMsgEl.innerHTML = sanitizeHtml(markdownToHtml(aiText));
                    var w = document.getElementById('aiMessages');
                    if (w) w.scrollTop = w.scrollHeight; });
                console.log('📄 HTML final docx:', markdownToHtml(aiText).substring(0, 2000));
                if (typeof axonPostProcess === 'function') axonPostProcess(aiText, '[Analyse doc: ' + file.name + ']');
                currentMessages.push({ role: 'assistant', content: aiText });
                if (currentMessages.length > 20) currentMessages = currentMessages.slice(-20);
                saveConversation('📎 Fichier : ' + file.name, aiText);
            } catch (e) { aiMsgEl.innerHTML = '<p style="color:#e74c3c">❌ Erreur IA : ' + e.message + '</p>'; }
            removeTyping();
        } else {
            if (ext === 'pdf') text = await extractPDF(file);
            else if (ext === 'xlsx') text = await extractXLSX(file);
            else if (ext === 'csv') text = await extractCSV(file);
            else if (ext === 'txt' || ext === 'json') text = await extractText(file);
            else if (['jpg', 'jpeg', 'png', 'webp'].indexOf(ext) !== -1) text = await handleImage(file);
            else if (['mp3', 'wav', 'm4a'].indexOf(ext) !== -1) text = await handleAudio(file);
            else { showToast('❌ Format non supporté'); return; }
            if (!text || text.length < 10) { setFileChipStatus(safeId, '❌');
                showToast('❌ Impossible d\'extraire le texte de ' + file.name); return; }
            setFileChipStatus(safeId, '✅');
            var docInfo = { name: file.name, type: ext, size: file.size, text: text, length: text.length };
            uploadedDocs.push(docInfo);
            if (typeof getAxonStore === 'function' && typeof getAxonMode === 'function' && getAxonMode()) {
                var docStore = getAxonStore('axon_documents');
                docStore.push({ id: 'doc_' + Date.now(), name: file.name, type: ext, summary: text.substring(0, 200), created: new Date().toISOString().split('T')[0] });
                if (docStore.length > 50) docStore = docStore.slice(-50);
                if (typeof setAxonStore === 'function') setAxonStore('axon_documents', docStore);
            }
            _docChunks = chunkText(text, 4000);
            window._lastDoc = { name: file.name, text: text, totalChunks: _docChunks.length };
            var fileCard = renderFileCard(file.name, file.size, ext);
            var chunkCount = _docChunks.length;
            var sentText = _docChunks.length ? _docChunks[0].text.substring(0, 2000) : text.substring(0, 2000);
            var sysPrompt = 'Tu es un assistant pédagogique. L\'utilisateur a chargé un document. Analyse-le à partir des premiers extraits ci-dessous (extrait 1/' + chunkCount + '). Ne demande pas plus de contenu — réponds avec ce que tu as. L\'utilisateur peut ensuite demander un résumé, corrigé, barème, traduction, QCM, scénario APC, explication, PowerPoint. Si examen : identifie questions/barème/consignes. Si tableaux : interprète-les. Propose les actions possibles à la fin.\n\n⚠️ PRÉSENTATION OFFICIELLE DE LA PLATEFORME (si le document ou la question concerne la plateforme APC Algérie GÉNÉRATION 3, utilise UNIQUEMENT cette définition) : plateforme numérique intelligente dédiée à la conception, la génération et le développement de ressources pédagogiques et de documents de formation (RMC, PF, PE, RES, ROP-M) pour le secteur de la formation et de l\'enseignement professionnels. L\'IA au service de l\'Approche Par Compétences (APC). Conçue et développée par Aziz Mohamed Rostom. Ce n\'est PAS une plateforme d\'apprentissage pour les apprenants : c\'est un outil de conception pour les formateurs et les établissements.';
            var userMsg = 'Document "' + file.name + '" (' + chunkCount + ' extraits, ' + text.length + ' signes). Voici le début :\n\n' + sentText;
            currentMessages.push({ role: 'user', content: '📎 Fichier : ' + file.name + ' (' + file.name + ')' });
            addDocMessage('user', '📎 Fichier : ' + file.name, fileCard);
            showTyping();
            var aiText = '';
            var aiMsgEl = addDocMessage('ai', '');
            aiMsgEl.id = 'doc-response-' + Date.now();
            try {
                await callAI([{ role: 'system', content: sysPrompt }, { role: 'user', content: userMsg }], function (chunk) { aiText += chunk;
                    aiMsgEl.innerHTML = sanitizeHtml(markdownToHtml(aiText));
                    var w = document.getElementById('aiMessages');
                    if (w) w.scrollTop = w.scrollHeight; });
                console.log('📄 HTML final non-docx:', markdownToHtml(aiText).substring(0, 2000));
                if (typeof axonPostProcess === 'function') axonPostProcess(aiText, '[Analyse doc: ' + file.name + ']');
                currentMessages.push({ role: 'assistant', content: aiText });
                if (currentMessages.length > 20) currentMessages = currentMessages.slice(-20);
                saveConversation('📎 Fichier : ' + file.name, aiText);
            } catch (e) { aiMsgEl.innerHTML = '<p style="color:#e74c3c">❌ Erreur IA : ' + e.message + '</p>'; }
            removeTyping();
        }
    } catch (e) {
        console.error('Doc extract error:', e);
        setFileChipStatus(safeId, '❌');
        showToast('❌ Erreur extraction : ' + e.message);
    }
    } finally { _analyzing = false; }
}
function renderFileCard(name, size, ext) {
    var icon = getFileIcon(name);
    var label = ext.toUpperCase();
    return '<div class="doc-file-card"><div class="doc-card-icon">' + icon + '</div><div class="doc-card-body"><div class="doc-card-name">' + name + '</div><div class="doc-card-meta">' + label + ' · ' + formatSize(size) + '</div></div></div>';
}
async function extractPDF(file) {
    if (typeof pdfjsLib === 'undefined') throw new Error('pdf.js non chargé');
    var buf = await file.arrayBuffer();
    var pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    var txt = '';
    for (var i = 1; i <= Math.min(pdf.numPages, 100); i++) {
        var pg = await pdf.getPage(i);
        var ct = await pg.getTextContent();
        txt += ct.items.map(function (x) { return x.str; }).join(' ') + '\n';
    }
    if (pdf.numPages > 100) txt += '\n[📌 Tronqué : 100 premières pages]';
    return txt;
}
async function extractDOCXText(file) {
    if (typeof mammoth === 'undefined') throw new Error('mammoth.js non chargé');
    var buf = await file.arrayBuffer();
    var r = await mammoth.extractRawText({ arrayBuffer: buf });
    return r.value || '';
}
async function extractXLSX(file) {
    if (typeof XLSX === 'undefined') throw new Error('SheetJS non chargé');
    var buf = await file.arrayBuffer();
    var wb = XLSX.read(buf, { type: 'array' });
    var txt = '';
    wb.SheetNames.forEach(function (n) { var s = wb.Sheets[n];
        txt += '=== ' + n + ' ===\n' + XLSX.utils.sheet_to_csv(s) + '\n'; });
    return txt;
}
async function extractCSV(file) { return await file.text(); }
async function extractText(file) { return await file.text(); }
async function handleImage(file) {
    return '[Image: ' + file.name + ' (' + formatSize(file.size) + ')]\n(Cette image peut être analysée par un modèle multimodal comme Gemini.)';
}
async function handleAudio(file) {
    return '[Audio: ' + file.name + ' (' + formatSize(file.size) + ')]\n(La transcription audio nécessite un service externe comme Whisper.)';
}
function fileToBase64(file) {
    return new Promise(function (resolve) {
        var r = new FileReader();
        r.onload = function () { resolve(r.result.split(',')[1]); };
        r.readAsDataURL(file);
    });
}
function addDocMessage(role, content, extraHtml) {
    removeEmpty();
    var wrap = document.getElementById('aiMessages');
    if (role === 'docx') {
        var docxDiv = document.createElement('div');
        docxDiv.className = 'docx-message';
        wrap.appendChild(docxDiv);
        wrap.scrollTop = wrap.scrollHeight;
        return docxDiv;
    }
    var div = document.createElement('div');
    div.className = 'msg msg-' + role;
    var av = document.createElement('div');
    av.className = 'msg-avatar ' + role;
    av.innerHTML = role === 'user' ? '👤' : '🤖';
    var bub = document.createElement('div');
    bub.className = 'msg-bubble ' + role;
    if (role === 'ai') { bub.innerHTML = sanitizeHtml(markdownToHtml(content)); } else { var p = document.createElement('p');
        p.textContent = content;
        bub.appendChild(p);
        if (extraHtml) { var extra = document.createElement('div');
            extra.innerHTML = sanitizeHtml(extraHtml);
            bub.appendChild(extra); } }
    div.append(av, bub);
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
    return role === 'ai' ? bub : div;
}
async function sendDocToAI(prompt, fileName) {
    removeTyping();
    showTyping();
    var msgs = [{ role: 'system', content: prompt }];
    var aiText = '';
    var aiMsgEl = addDocMessage('ai', '');
    aiMsgEl.id = 'doc-response-' + Date.now();
    try {
        await callAI(msgs, function (chunk) { aiText += chunk;
            aiMsgEl.innerHTML = sanitizeHtml(markdownToHtml(aiText));
            var w = document.getElementById('aiMessages');
            if (w) w.scrollTop = w.scrollHeight; });
        if (typeof axonPostProcess === 'function') axonPostProcess(aiText, '[Analyse doc: ' + fileName + ']');
    } catch (e) { aiMsgEl.innerHTML = '<p style="color:#e74c3c">❌ Erreur IA : ' + e.message + '</p>'; }
    removeTyping();
}
async function executeDocAction(action, fileName, chunks, fullText) {
    var lang = currentLang || 'fr';
    var prompts = {
        summarize: lang === 'ar' ? 'لخص المستند التالي بشكل منظم وكامل :\n\n' : lang === 'en' ? 'Write a structured summary of this document:\n\n' : 'Rédige un résumé structuré et complet du document suivant :\n\n',
        competences: lang === 'ar' ? 'استخرج جميع الكفاءات APC المذكورة في هذا المستند. لكل كفاءة : الاسم والوصف والمستوى والوحدة.\n\n' : lang === 'en' ? 'Extract ALL APC competencies from this document. For each: name, description, level, module.\n\n' : 'Extrais TOUTES les compétences APC mentionnées dans ce document. Pour chaque : nom, description, niveau, module.\n\n',
        scenario: lang === 'ar' ? 'بناءً على هذا المستند، أنشئ سيناريو بيداغوجي APC كاملاً بمراحله الخمس.\n\n' : lang === 'en' ? 'Based on this document, generate a complete APC pedagogical scenario with 5 phases.\n\n' : 'À partir de ce document, génère un scénario pédagogique APC complet avec les 5 phases.\n\n',
        quiz: lang === 'ar' ? 'أنشئ 10 أسئلة اختيار من متعدد من هذا المستند مع 4 خيارات والإجابة الصحيحة.\n\n' : lang === 'en' ? 'Generate 10 multiple-choice questions from this document with 4 choices and correct answer.\n\n' : 'Génère 10 questions QCM à partir de ce document, avec 4 choix et la réponse correcte.\n\n',
        translate: lang === 'ar' ? 'ترجم المستند التالي إلى الفرنسية :\n\n' : lang === 'en' ? 'Translate this document to ' + (lang === 'fr' ? 'French' : 'Arabic') + ':\n\n' : 'Traduis le document suivant en ' + (lang === 'ar' ? 'arabe' : 'anglais') + ' :\n\n',
        course: lang === 'ar' ? 'أنشئ خطة درس مفصلة بناءً على هذا المستند.\n\n' : lang === 'en' ? 'Generate a detailed lesson plan based on this document.\n\n' : 'Génère un plan de cours détaillé basé sur ce document.\n\n',
        evaluation: lang === 'ar' ? 'أنشئ شبكة تقييم معيارية APC 4×4 بناءً على هذا المستند.\n\n' : lang === 'en' ? 'Generate an APC 4×4 criteria-based evaluation grid based on this document.\n\n' : 'Génère une grille d\'évaluation critérielle APC 4×4 basée sur ce document.\n\n',
        presentation: lang === 'ar' ? 'أنشئ عرضاً تقديمياً منظمًا في 10 شرائح بناءً على هذا المستند.\n\n' : lang === 'en' ? 'Generate a structured 10-slide presentation based on this document.\n\n' : 'Génère une présentation structurée en 10 slides basée sur ce document.\n\n'
    };
    var prompt = prompts[action] || prompts.summarize;
    var content = fullText.substring(0, 12000);
    if (chunks.length > 1) content = chunks[0].substring(0, 4000) + '\n\n...[Document en ' + chunks.length + ' segments]...\n\n' + (chunks[1] ? chunks[1].substring(0, 4000) : '');
    var sysMsg = 'Tu es expert APC. Document source : **' + fileName + '**\n\n' + prompt + content;
    addDocMessage('user', '📎 Action sur ' + fileName + ' : ' + prompt.split('.')[0].split('\n')[0].substring(0, 60));
    showTyping();
    var aiText = '';
    var aiMsgEl = addDocMessage('ai', '');
    aiMsgEl.id = 'doc-action-' + Date.now();
    try {
        await callAI([{ role: 'system', content: sysMsg }], function (chunk) { aiText += chunk;
            aiMsgEl.innerHTML = sanitizeHtml(markdownToHtml(aiText));
            var w = document.getElementById('aiMessages');
            if (w) w.scrollTop = w.scrollHeight; });
    } catch (e) { aiMsgEl.innerHTML = '<p style="color:#e74c3c">❌ Erreur : ' + e.message + '</p>'; }
    removeTyping();
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initDocUpload); } else { initDocUpload(); }
