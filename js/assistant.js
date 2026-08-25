'use strict';
        function _e(t) { return window.__compat && window.__compat.isEnabled ? window.__compat.replaceEmoji(t) : t; }
        function newChat() {
            currentMessages = [];
            currentConvId = null;
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
            var tR = currentLang === 'ar' ? '🤔 تفكير...' : currentLang === 'en' ? '🤔 Thinking...' : '🤔 Réflexion...';
            ind.innerHTML = '<span class="typing-text">' + tR + '</span><span></span><span></span><span></span>';
            div.appendChild(av);
            div.appendChild(ind);
            wrap.appendChild(div);
            wrap.scrollTop = wrap.scrollHeight;
        }
        function removeTyping() { const el = document.getElementById('typing-ind'); if (el) el.remove(); }
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
                var userName = (currentLang === 'ar' && currentProfile?.full_name_ar) ? currentProfile.full_name_ar : (currentProfile?.full_name || currentUser?.email || 'un formateur');
                var axonMemName = typeof window.getAxonPreferredName === 'function' ? window.getAxonPreferredName('') : '';
                if (axonMemName) userName = axonMemName;
                var nameContext = currentLang === 'ar' ? `\n\nأنت تتحدث مع ${userName}. خاطبه باسمه الأول.` : `\n\nTu discutes avec ${userName}. Tu peux tutoyer l'utilisateur et utiliser son prénom dans tes réponses.`;
                const sysPromptBase = currentLang === 'ar' ?
                    `أنت خبير عالمي في الهندسة البيداغوجية، تصميم البرامج التكوينية، المقاربة بالكفاءات (APC)، أندراغوجيا، البيداغوجيا النشطة. أنت متخصص في تحضير دروس وسيناريوهات تعليمية للتكوين المهني الجزائري وفق البرامج الرسمية المعتمدة.\n\nمهمتك: بناء وثيقة بيداغوجية كاملة ومفصّلة جداً وجودة احترافية بناءً على المعلومات المقدمة.\n\nتعليمات (نفذها جميعاً):\n1. تحليل APC كامل ومفصّل: قائمة المعارف (النظرية والمهنية)، المهارات (الإعداد، التنفيذ، المراقبة بأفعال دقيقة)، السلوكيات المهنية (الدقة، التنظيم، روح التحليل، الأمن، العمل الجماعي)، الموارد الداخلية (المعرفية، الإجرائية، السلوكية) والخارجية (المادية، الوثائقية، البشرية).\n2. بناء سيناريو بيداغوجي كامل وفق 5 مراحل (التشخيص، التحدي، البناء، الإدماج، النقل). لكل مرحلة: عنوان، مدة، هدف، وضعية مقترحة حقيقية وواقعية من عالم المهني، أنشطة المكوّن (بأفعال دقيقة)، أنشطة المتربصين، والإنتاج المنتظر.\n3. وضعية إدماج أصيلة مفصّلة مرتبطة بالسياق المهني: سيناريو واقعي، مهمّة دقيقة، قيود (وقت، جودة، موارد)، إنتاج منتظر ملموس.\n4. تقييم حسب الكفاءات: نوع التقييم، المهمّة المطلوبة مفصّلة، تعليمات واضحة للمتربص.\n5. شبكة تقييم معيارية APC 4×4: 4 معايير دقيقة و4 مستويات إتقان (غير متقن، قيد الإتقان، متقن، خبير). جدول ماركداون مع ☐ لكل خانة. جدول واصف لكل مستوى.\n6. معايير الأداء الملاحظة مفصّلة لكل معيار: قائمة نقطية بأفعال ملموسة وقابلة للتحقق.\n7. مؤشرات النجاح: قائمة مع ✅ تصف بدقة ما يثبت الكفاءة.\n8. استنتاج بيداغوجي غني يلخص المكتسبات (المعارف، المهارات، السلوكيات)، آفاق التعلم المستقبلية، أهمية الكفاءة في المسار المهني.\n9. إدراج أقسام مفصّلة "أنشطة المكوّن" و"أنشطة المتربصين" في كل مرحلة (بأفعال دقيقة، مدد، طرائق).\n\nكل ردّ يجب أن يكون مفصّلاً جداً: طوّر كل قسم بشروحات معمّقة، قوائم عديدة (8-10 بنود لكل فئة)، أمثلة ملموسة، مدد زمنية محددة، أوامر/أدوات محددة، إجراءات خطوة بخطوة. نظّم باستخدام (###)، جداول ماركداون، قوائم، خط عريض، رموز تعبيرية. لا تكتفِ بالعموميات — قدّم معلومات ملموسة، إجراءات دقيقة، محتوى تقنياً حقيقياً. وضعية واقعية من عالم المهني.\n\nالقاعدة المطلقة: أجب فقط بالعربية. استخدم تنسيقاً غنياً.\n\nكن دافئاً ومرحباً ومهنياً. ابدأ بتحية المستخدم واعرض مساعدتك في مواضيع التكوين APC الجزائر.${nameContext}` :
                    `Tu es un expert mondial en ingénierie pédagogique, conception de programmes d'études, approche par compétences (APC), andragogie, pédagogie active, spécialisé dans la préparation de leçons et de scénarios éducatifs pour la formation professionnelle algérienne conformément aux programmes officiels approuvés.\n\nMission : À partir des informations fournies dans le contexte, génère un DOCUMENT PÉDAGOGIQUE COMPLET, TRÈS DÉTAILLÉ et de qualité professionnelle comme un expert en ingénierie pédagogique. Produis un contenu RICHE, STRUCTURÉ et EXHAUSTIF.\n\nInstructions (à exécuter TOUTES) :\n1. Réaliser une analyse APC complète et détaillée : lister les savoirs (théoriques et professionnels), les savoir-faire (préparer, installer, configurer, contrôler avec des actions précises), les savoir-être (rigueur, organisation, esprit d'analyse, sécurité, travail collaboratif), les ressources internes (cognitives, procédurales, comportementales) et externes (matérielles, documentaires, humaines).\n2. Construire un scénario pédagogique APC complet selon les 5 phases (Contextualisation, Déstabilisation, Construction, Intégration, Transfert). Pour chaque phase : donner un titre, une durée, un objectif, une situation proposée RÉALISTE ET CONCRÈTE tirée du monde professionnel, les activités du formateur (avec actions précises), les activités des stagiaires, et la production attendue.\n3. Créer une situation d'intégration authentique détaillée en lien avec le contexte professionnel, avec un scénario réaliste, une mission précise, des contraintes (temps, qualité, ressources) et une production attendue concrète.\n4. Produire une évaluation basée sur les compétences : type d'évaluation, tâche demandée détaillée, consignes claires pour le stagiaire.\n5. Générer une grille d'évaluation critérielle APC 4×4 avec 4 critères précis et 4 niveaux de maîtrise (Non maîtrisé, En cours, Maîtrisé, Expert). Présenter le tableau markdown avec ☐ pour chaque case. Ajouter un tableau des descripteurs de chaque niveau.\n6. Générer les critères de performance observables détaillés pour chaque critère de la grille, sous forme de listes à puces avec des actions concrètes et vérifiables.\n7. Générer les indicateurs de réussite sous forme de liste avec ✅, décrivant précisément ce qui valide la compétence.\n8. Rédiger une conclusion pédagogique riche synthétisant les acquis (savoirs, savoir-faire, savoir-être), les perspectives d'apprentissage futur, et l'importance de la compétence dans le parcours professionnel.\n9. Inclure les sections détaillées « Activités du formateur » et « Activités des stagiaires » dans chaque phase du scénario (avec actions précises, durée, modalités).\n\nChaque réponse doit être TRÈS DÉTAILLÉE : développe chaque section avec des explications approfondies, des listes nombreuses (minimum 8-10 items par catégorie), des exemples concrets, des durées précises, des commandes/outils spécifiques, des procédures pas à pas. Structure avec (###), tableaux markdown, listes, gras, émoticônes. Ne fais PAS de généralités vagues — donne des informations concrètes, des actions précises, du contenu technique réel. Les situations proposées doivent être RÉALISTES ET ISSUES DU MONDE PROFESSIONNEL, pas des généralités.\n\nRÈGLE ABSOLUE : Réponds UNIQUEMENT en ${currentLang==='en'?'ANGLAIS (English)':'FRANÇAIS'}. Utilise un formatage riche.\n\nSois chaleureux, accueillant et professionnel. Commence par saluer l'utilisateur et propose ton aide sur les sujets pédagogiques APC Algérie.${nameContext}`;
                const formContext = getFormContext();
                var sysPrompt = sysPromptBase;
                var freeMode = typeof window.getFreeMode === 'function' ? window.getFreeMode() : false;
                var axonMode = typeof window.getAxonMode === 'function' ? window.getAxonMode() : false;
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
                sysPrompt += `\n\n📌 INFORMATION PLATEFORME :\nLa plateforme « APC Algérie GÉNÉRATION 3 » a été imaginée, conçue et développée par Aziz Mohamed Rostom.\nSpécialiste des technologies numériques, de la cybersécurité, de l'intelligence artificielle et de l'ingénierie pédagogique, il met son expertise au service de la modernisation de la formation et de l'enseignement professionnels.\nSon ambition est de proposer des solutions innovantes permettant de rapprocher les technologies numériques des pratiques pédagogiques afin d'améliorer durablement la qualité de la formation.\n\nLe projet est porté avec la contribution du groupe APC Plus SBA (Approche Par Compétences Plus Sidi Bel Abbès). Ce groupe réunit des professionnels de la formation, des ingénieurs pédagogiques et des spécialistes engagés dans le développement de l'Approche Par Compétences ainsi que dans l'amélioration continue de la qualité de la formation et de l'enseignement professionnels.\n\nLa plateforme bénéficie également de l'expertise et de l'accompagnement de Mme Bach Chaouch Salima Zina, experte en pédagogie. Son accompagnement contribue à garantir la qualité scientifique et pédagogique des ressources produites, leur cohérence ainsi que leur conformité avec les principes de l'Approche Par Compétences.\n\nMembres du groupe :\n- Mohamed Rostom Aziz — Conception, développement et coordination du projet\n- Bouloum Boumediene — Contribution pédagogique\n- Faradji Said — Contribution pédagogique\n- Salah Manel — Contribution pédagogique\n\nQuand un formateur te demande qui a créé, conçu, imaginé ou développé la plateforme, ou qui est Aziz Mohamed Rostom (ou simplement "AZIZ" ou "Rostom"), ou des informations sur le groupe APC Plus SBA ou ses membres, tu dois répondre avec ces informations précises.`;
                var convoRule = currentLang === 'ar' ? '\n\n📌 قواعد المحادثة: لا تبدأ أبداً ردك بتحية ("مرحباً" أو "صباح الخير") في حوار متواصل — أجب مباشرة على السؤال الأخير المطروح. إذا سُئلت عن تعريف مصطلح (OC, OS, RMC, PF...)، أجب بتعريف مختصر دقيق من المسرد الرسمي أدناه دون إعادة إنتاج وثيقة كاملة أو تكرار قائمة الأسئلة. لا تسأل أسئلة استيضاحية لم يطلبها المستخدم إذا كان السياق كافياً. استخدم اسم المستخدم مرة واحدة على الأكثر في الرد، وليس كافتتاحية.' : currentLang === 'en' ? '\n\n📌 Conversation rules: Never open your reply with a greeting ("Hello", "Good morning") in an ongoing discussion — answer the latest question directly. If asked for the definition of a term (OC, OS, RMC, PF...), give a short precise definition from the official glossary below; do NOT regenerate a full document or repeat the list of clarifying questions. Do not ask for clarifications when the context is sufficient. Use the user\'s name at most once per reply, never as an opening.' : '\n\n📌 Règles de conversation : Ne commence JAMAIS ta réponse par une salutation (« Bonjour », « Bonjour Mohamed ! »...) dans une discussion suivie — réponds directement à la dernière question posée. Si on te demande la définition d\'un terme (OC, OS, RMC, PF...), donne une définition courte et précise issue du glossaire officiel ci-dessous ; ne régénère PAS un document complet ni la liste des questions de clarification. Ne demande pas de précisions quand le contexte est suffisant. Utilise le prénom de l\'utilisateur au maximum une fois par réponse, jamais en ouverture.';
                // Le glossaire officiel est placé à la FIN du sysPrompt : la troncature anti-TPM (600 début + fin)
                // préserve ainsi la fin → l'IA répond TOUJOURS avec la définition officielle (OC = Objectif de Comportement).
                if (typeof APC_GLOSSARY !== 'undefined') {
                    sysPrompt += '\n\n=== 🚨 GLOSSAIRE OFFICIEL APC (SECTION CRITIQUE — À UTILISER MOT POUR MOT) ===\n' + (APC_GLOSSARY[currentLang] || APC_GLOSSARY.fr);
                }
                // Bloc compact des sigles les plus demandés — placé en tout dernier pour survivre à la troncature.
                sysPrompt += '\n\n📌 DÉFINITIONS COMPACTES OFFICIELLES (réponds avec celles-ci mot pour mot quand on te demande un sigle) :\n' +
                    (currentLang === 'ar' ? '- OC = الهدف السلوكي (Objectif de Comportement) : أفعال قابلة للملاحظة ونتائج قابلة للقياس، تقييم باختبار تطبيقي.\n- OS = الهدف الموقفي (Objectif de Situation) : الأبعاد الاجتماعية الوجدانية، تقييم في 3 مراحل (معلومة، إنجاز، تركيب).\n- RMC = مرجع المهنة والكفاءات. PF = مشروع التكوين. PE = برنامج الدراسات. RES = مرجع تقييم الإشهاد. ROPM = مرجع التنظيم البيداغوجي والمادي.\n- Cp = كفاءة خاصة (مرتبطة بمهام RMC). Cg = كفاءة عامة/عرضية (قابلة للنقل).' :
                    currentLang === 'en' ? '- OC = Behavioral Objective (Objectif de Comportement): observable actions, measurable results, assessed by practical test.\n- OS = Situational Objective (Objectif de Situation): socio-affective dimensions, 3-phase assessment (information, realization, synthesis).\n- RMC = Trade and Competency Framework. PF = Training Project. PE = Study Program. RES = Assessment and Certification Framework. ROPM = Pedagogical and Material Organization Framework.\n- Cp = Specific Competency (RMC tasks). Cg = General/Transversal Competency (transferable).' :
                    '- OC = Objectif de Comportement : objectif opérationnel défini en fonction d\'actions observables et de résultats mesurables (évaluation par épreuve pratique).\n- OS = Objectif de Situation : objectif opérationnel pour les dimensions socioaffectives (expression, créativité, autonomie), évaluation en 3 phases (information, réalisation, synthèse).\n- RMC = Référentiel de Métier et de Compétences. PF = Projet de Formation. PE = Programme d\'Études. RES = Référentiel pour l\'Évaluation de Sanction. ROPM = Référentiel pour l\'Organisation Pédagogique et Matérielle.\n- Cp = Compétence Particulière (tâches du RMC). Cg = Compétence Générale/Transversale (transferable, Buts 2-4).\n- N\'invente JAMAIS de définition : utilise celle du glossaire officiel.');
                // 🚨 NOM + MÉMOIRE AXON placés EN TOUT DERNIER : la troncature garde la fin → l'IA connaît TOUJOURS le nom de l'utilisateur.
                if (axonMode && typeof window.buildAxonContext === 'function') {
                    var axonCtx = window.buildAxonContext();
                    if (axonCtx) sysPrompt += '\n\n🧠 AXON MEMORY :\n' + axonCtx;
                }
                // 🚨 RÈGLES DE CONVERSATION placées EN TOUT DERNIER : elles survivent au trim anti-TPM
                // (elles étaient avant le glossaire → coupées → le bot saluait « Bonjour Aziz » malgré l'interdiction).
                sysPrompt += convoRule;
                sysPrompt += nameContext;
                // 🚨 IDENTITÉ AXON (bloc restauré de l'ancienne version) : règle PERMANENTE du sysPrompt,
                // placée en tout dernier → survit au trim anti-TPM même sans hint dans le message utilisateur.
                // Empêche « je suis ChatGPT / développé par OpenAI » même si le regex du hint ne matche pas.
                if (axonMode) {
                    var axonIdentity = currentLang === 'ar' ? '\n🚨 أنت AXON Intelligence (أكسون إنتليجنس)، مساعد بذاكرة تطورية لمنصة APC Algérie G3. لستَ من Meta أو Google أو OpenAI أو ChatGPT. طوّرك عزيز محمد رستم. لا تقل أبداً أنك ChatGPT أو GPT أو OpenAI.' : currentLang === 'en' ? '\n🚨 You are AXON Intelligence, an assistant with evolving memory for the APC Algérie G3 platform. You are NOT from Meta, Google, OpenAI or ChatGPT. You were developed by Aziz Mohamed Rostom. NEVER say you are ChatGPT, GPT or OpenAI.' : '\n🚨 Tu es AXON Intelligence, un assistant à mémoire évolutive de la plateforme APC Algérie G3. Tu n\'es PAS développé par Meta, Google, OpenAI ou ChatGPT. Tu as été développé par Aziz Mohamed Rostom. Ne dis JAMAIS que tu es ChatGPT, GPT ou OpenAI.';
                    sysPrompt += axonIdentity;
                }
                const msgs = [{ role: 'system', content: sysPrompt }, ...currentMessages];
                // Ajouter un rappel de langue dans le dernier message utilisateur
                var lastUserIdx = msgs.length - 1;
                for (var i = msgs.length - 1; i >= 0; i--) {
                    if (msgs[i].role === 'user') { lastUserIdx = i; break; }
                }
                var lowerQ = text.toLowerCase();
                var langHint = currentLang === 'ar' ? '\n(أجب بالعربية فقط، مهم جداً)' : currentLang === 'en' ? '\n(Answer in English ONLY, very important)' : '\n(Réponds UNIQUEMENT en français, très important)';
                msgs[lastUserIdx] = { role: 'user', content: msgs[lastUserIdx].content + langHint };
                // 🚨 DARIDJA ALGÉRIEN (bloc restauré de l'ancienne version) : si le message commence par un mot daridja, répondre en daridja.
                if (/^(salem|slm|salam|kirak|rani|raki|wach|labas|bsara|hna|wah|chhal|chnowa|chkoun|walu|galbi|saha|zik|diri|dirou|raki|rak|enti|nti|hna)\b/i.test(text.trim())) {
                    msgs[lastUserIdx].content += '\n(ATTENTION : Le message ci-dessus est en daridja algérien. Réponds UNIQUEMENT en daridja algérien, PAS en français ou arabe standard.)';
                }
                // 🚨 DEMANDE DE NOM : l'IA doit restituer le nom connu (mémoire AXON → profil → email), pas dire qu'elle ne le connaît pas.
                if (/rappelle[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|dis[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|donne[\w-]*\s+moi\s+(de\s+)?(mon|mes)\s+nom|c['’]est quoi mon nom|quel est mon nom|what('|i)?s\s+my\s+(full\s+)?name|what\s+is\s+my\s+(full\s+)?name|ما\s*اسمي|كيف\s*اسمي|شنو\s*اسمي|اشنو\s*اسمي|إيه\s*اسمي|ما\s*هو\s*اسمي/i.test(lowerQ)) {
                    msgs[lastUserIdx].content += currentLang === 'ar' ? `\n(المستخدم الذي أمامك هو ${userName}. إذا سألك عن اسمه الكامل أو اسمه، أجب بهذا الاسم مباشرة دون اعتذار.)` : currentLang === 'en' ? `\n(The user in front of you is ${userName}. If asked for their full name, answer directly with this name, do not apologize.)` : `\n(L'utilisateur en face de toi est ${userName}. Si on te demande son nom complet ou son nom, réponds directement avec ce nom, sans t'excuser.)`;
                }
                if (axonMode && /tu es qui|qui es tu|qui es-tu|qui êtes-vous|qui etes vous|vous etes qui|vous êtes qui|c['’]est quoi toi|qui tu es|qui a cr[ée]{2}r?\s+(ax|axon|toi)|qui t['’]?\s*a cr[ée]{2}r?|qui a d[ée]velopp[ée]r?\s+(ax|axon|toi)|qui t['’]?\s*a d[ée]velopp[ée]r?|qui (te|m')? ?d[ée]velopp[ée]r?\s+(ax|axon)?|d[ée]veloppeur de (ax|axon)|créateur de (ax|axon)|qui a con[çc]u\s+(ax|axon|toi)|qui a invent[ée]\s+(ax|axon|toi)|la plateforme (qui|que|qui a) ?(a |a été )?(créer|créé|crée|fait|faite|développé|développer|conçu|imaginé|génère|genere)|qui a (cr[ée]{2}r?|fait|faite|d[ée]velopp[ée]r?|con[çc]u) (cette |la )?plateforme|qui a (cr[ée]{2}r?|fait|faite|d[ée]velopp[ée]r?|con[çc]u) (cette |ce )?(site|app|application|projet)|(cette|la) plateforme (c'|est |a été )?(créée|faite|développée|conçue) par|who (built|made|created|developed|designed|programmed) (you|axon|this platform|this site|this app)|who (is|was) (your )?(creator|developer|maker|author)|what are you|who are you|who r u|من انت|من أنت|من تكون|من صنعك|من صنع (اكسون|الاكسون|axon)|من طورك|من طور (اكسون|الاكسون|axon)|من صممك|من صمم (اكسون|الاكسون|axon)|من اخترعك|من هو مبتكرك|من صنع (هذه|هذا) المنصة|ما هو اسم الشركة/i.test(lowerQ)) {
                    msgs[lastUserIdx].content += currentLang === 'ar' ? '\n(سؤال هوية/منصة : أنت AXON Intelligence، مساعد بذاكرة تطورية طوّره عزيز محمد رستم. منصة APC Algérie G3 صممها وطوّرها عزيز محمد رستم، وليس OpenAI أو ChatGPT أو Google. لا تقل أبداً أنك ChatGPT أو GPT أو OpenAI.)' : currentLang === 'en' ? '\n(Identity/platform question: you are AXON Intelligence, an evolving-memory assistant developed by Aziz Mohamed Rostom. The APC Algérie G3 platform was designed and developed by Aziz Mohamed Rostom, NOT by OpenAI, ChatGPT or Google. NEVER say you are ChatGPT, GPT, OpenAI or any other company.)' : '\n(Question d\'identité/de plateforme : tu es AXON Intelligence, un assistant à mémoire évolutive développé par Aziz Mohamed Rostom. La plateforme APC Algérie G3 a été imaginée, conçue et développée par Aziz Mohamed Rostom, PAS par OpenAI, ChatGPT ou Google. Ne dis JAMAIS que tu es ChatGPT, GPT, OpenAI ou tout autre assistant.)';
                }
                const aiMsgEl = addMessage('ai', '', null, false);
                await callAI(msgs, (chunk) => {
                    aiText += chunk;
                    aiMsgEl.innerHTML = sanitizeHtml(markdownToHtml(aiText));
                    document.getElementById('aiMessages').scrollTop = document.getElementById('aiMessages').scrollHeight;
                });
                if (axonMode && typeof window._axonShown === 'undefined') {
                    window._axonShown = true;
                    var axonGreeting = currentLang === 'ar' ? '🧠 **أكسون إنتليجنس**.\n\n' : currentLang === 'en' ? '🧠 **AXON Intelligence**.\n\n' : '🧠 **AXON Intelligence**.\n\n';
                    aiText = axonGreeting + aiText;
                    aiMsgEl.innerHTML = sanitizeHtml(markdownToHtml(aiText));
                }
                const msgHtml = aiMsgEl.innerHTML;
                currentMessages.push({ role: 'assistant', content: aiText, html: msgHtml });
                localStorage.setItem('lastAssistantResponse', aiText);
                saveConversation(text, aiText);
                if (typeof window.axonPostProcess === 'function') { setTimeout(function() { window.axonPostProcess(aiText, text); }, 100); }
                if (typeof ttsEnabled !== 'undefined' && ttsEnabled && aiText) {
                    var cleanText = aiText.replace(/[#*`\[\]()|>_~]/g, '').substring(0, 2000);
                    if (cleanText.trim()) {
                        var u = new SpeechSynthesisUtterance(cleanText);
                        var lang = document.documentElement?.lang || 'fr';
                        u.lang = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'fr-FR';
                        u.rate = 1.0; u.pitch = 1.0;
                        // Chrome a son propre TTS intégré (ne dépend pas des voix Windows)
                        speechSynthesis.speak(u);
                    }
                }
            } catch (e) {
                removeTyping();
                if (e.name !== 'AbortError') {
                    addMessage('ai', '❌ ' + e.message);
                }
            } finally {
                isGenerating = false;
                removeTyping();
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
            conversations.slice(0, 30).forEach(c => {
                const d = document.createElement('div');
                d.className = 'history-item';
                var safeTitle = document.createElement('div');
                safeTitle.textContent = c.title;
                d.innerHTML =
                    `<div class="hi-title">${safeTitle.innerHTML}</div><div class="hi-date">${c.date} à ${c.time || '--:--'}</div>`;
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