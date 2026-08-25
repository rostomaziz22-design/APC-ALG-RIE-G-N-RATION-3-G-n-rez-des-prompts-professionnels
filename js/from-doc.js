(function () {
    let currentFile = null;
    let extractedText = '';
    const dropzone = document.getElementById('docDropzone');
    const fileInput = document.getElementById('docFileInput');
    const browseBtn = document.getElementById('docBrowseBtn');
    const fileInfo = document.getElementById('docFileInfo');
    const fileName = document.getElementById('docFileName');
    const fileSize = document.getElementById('docFileSize');
    const removeBtn = document.getElementById('docRemoveFile');
    const extractedTextEl = document.getElementById('docExtractedText');
    const generateBtn = document.getElementById('docGenerateBtn');
    const phaseOptions = document.getElementById('docPhaseOptions');
    const phaseCheckbox = document.getElementById('docPhaseCheckbox');
    ['dragenter', 'dragover'].forEach(ev => {
        dropzone.addEventListener(ev, (e) => { e.preventDefault();
            dropzone.style.borderColor = 'var(--accent)';
            dropzone.style.background = 'var(--accent)08'; });
    });
    ['dragleave', 'drop'].forEach(ev => {
        dropzone.addEventListener(ev, (e) => { e.preventDefault();
            dropzone.style.borderColor = '';
            dropzone.style.background = ''; });
    });
    dropzone.addEventListener('drop', (e) => {
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    });
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) handleFile(fileInput.files[0]);
    });
    removeBtn.addEventListener('click', () => {
        currentFile = null;
        extractedText = '';
        fileInfo.style.display = 'none';
        phaseOptions.style.display = 'none';
        generateBtn.disabled = true;
        fileInput.value = '';
    });
    async function handleFile(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['txt', 'docx'].includes(ext)) {
            showToast('❌ Format non supporté. Utilisez TXT ou DOCX.');
            return;
        }
        currentFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = (file.size / 1024).toFixed(1) + ' Ko';
        fileInfo.style.display = 'block';
        phaseOptions.style.display = 'block';
        generateBtn.disabled = true;
        try {
            const text = await extractText(file, ext);
            extractedText = text;
            extractedTextEl.textContent = text;
            extractedTextEl.style.display = 'block';
            generateBtn.disabled = false;
            showToast('✅ Document chargé — ' + text.length + ' caractères extraits');
        } catch (e) {
            showToast('❌ Erreur de lecture : ' + e.message);
        }
    }
    async function extractText(file, ext) {
        if (ext === 'txt') {
            return await file.text();
        }
        if (ext === 'docx') {
            if (typeof mammoth === 'undefined') throw new Error('Mammoth.js non chargé');
            const buf = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: buf });
            return result.value || '';
        }
        throw new Error('Format non supporté');
    }
    generateBtn.addEventListener('click', async () => {
        if (!extractedText) {
            showToast('❌ Aucun texte extrait.');
            return;
        }
        const lang = localStorage.getItem('lang') || 'fr';
        const langName = lang === 'fr' ? 'français' : lang === 'en' ? 'english' : 'arabe';
        const maxChars = 3000;
        const docText = extractedText.length > maxChars ? extractedText.slice(0, maxChars) + '\n...[suite tronquée]' : extractedText;
        let prompt = `Tu es un expert pédagogique APC (Approche Par Compétences). À partir du document suivant, génère UNE PRÉSENTATION COMPLÈTE de 5 À 10 SLIDES.
Document :
${docText}
RÈGLES :
1. Extrais les idées principales et structure-les en 5 à 10 slides logiques
2. Chaque slide doit avoir un titre clair et un contenu concis
3. Utilise le format suivant pour les tableaux : | Colonne1 | Colonne2 |
4. Pour les listes, commence par • ou -
5. CHAQUE slide doit avoir un "image_prompt" qui décrit TOUT LE CONTENU du slide (titre + sous-titres + points clés), pas seulement le titre. L'image_prompt doit décrire une scène visuelle cohérente avec le sujet du slide (ex: si le slide parle de comptabilité, image_prompt = "accountant reviewing financial statements in an office, calculator and ledger on desk, professional setting"). L'image doit résumer visuellement l'ENSEMBLE du slide.
FORMAT JSON :
{"slides":[{"title":"Titre du slide","image_prompt":"prompt for image generation","content":["### Sous-titre","Description détaillée...","• Point clé 1","• Point clé 2","| Tableau | ligne |"]}]}
- Génère en ${langName}
- SORS UNIQUEMENT le JSON valide, sans aucun autre texte
- IMPORTANT : au moins 5 slides`;
        if (phaseCheckbox.checked) {
            const phaseRules = {
                fr: `\n\nSTRUCTURE PAR PHASES APC OBLIGATOIRE :
Organise les slides en suivant LES 5 PHASES APC ci-dessous dans cet ordre EXACT. Chaque phase doit contenir au moins 1 slide.

1. CONTEXTUALISATION — Mise en situation professionnelle
2. DÉSTABILISATION — Situation problème
3. CONSTRUCTION — Acquisition des ressources et pratique
4. INTÉGRATION — Synthèse et réinvestissement
5. TRANSFERT — Nouveau contexte professionnel

RÈGLES :
- Le titre de CHAQUE slide doit commencer par le nom de la phase suivi de « — » (ex: « Contextualisation — Présentation de la compétence »)
- Chaque phase doit inclure une « Situation » concrète tirée du document (situation professionnelle, problème, apprentissage, intégration ou transfert)
- Adapte le contenu du document source aux 5 phases : répartis les idées extraites dans les phases correspondantes
- Si le document est court, tu peux faire 1 slide par phase (5 slides min). Si le document est riche, fais 2 slides pour certaines phases.`,
                en: `\n\nMANDATORY APC PHASE STRUCTURE :
Organize the slides following THE 5 APC PHASES below in this EXACT order. Each phase must contain at least 1 slide.

1. CONTEXTUALIZATION — Professional situation setting
2. DESTABILIZATION — Problem situation
3. CONSTRUCTION — Resource acquisition and practice
4. INTEGRATION — Synthesis and reinvestment
5. TRANSFER — New professional context

RULES :
- The title of EACH slide must start with the phase name followed by « — » (e.g. « Contextualization — Competency presentation »)
- Each phase must include a concrete « Situation » drawn from the document (professional situation, problem, learning, integration or transfer)
- Adapt the source document content to the 5 phases: distribute the extracted ideas into the corresponding phases
- If the document is short, do 1 slide per phase (5 slides min). If the document is rich, do 2 slides for some phases.`,
                ar: `\n\nهيكل مراحل APC الإلزامي :
قم بتنظيم الشرائح وفق مراحل APC الخمس أدناه بهذا الترتيب بالضبط. يجب أن تحتوي كل مرحلة على شريحة واحدة على الأقل.

1. السياق — وضع الموقف المهني
2. زعزعة الاستقرار — وضع المشكلة
3. البناء — اكتساب الموارد والممارسة
4. التكامل — التركيب وإعادة الاستثمار
5. النقل — سياق مهني جديد

القواعد :
- يجب أن يبدأ عنوان كل شريحة باسم المرحلة متبوعًا بـ « — » (مثال: « السياق — عرض الكفاءة »)
- يجب أن تتضمن كل مرحلة « موقفًا » ملموسًا مستمدًا من المستند (موقف مهني، مشكلة، تعلم، تكامل أو نقل)
- قم بتكييف محتوى المستند المصدر مع المراحل الخمس: وزع الأفكار المستخلصة في المراحل المقابلة
- إذا كان المستند قصيرًا، اكتب شريحة واحدة لكل مرحلة (5 شرائح كحد أدنى). إذا كان المستند غنيًا، اكتب شريحتين لبعض المراحل.`
            };
            prompt += phaseRules[lang] || phaseRules.fr;
        }
        const sysPrompt = `Tu es un expert pédagogique en Approche Par Compétences (APC), spécialiste en ingénierie de formation et en conception de contenus pédagogiques de haute qualité. Tu conçois des présentations professionnelles, riches et structurées, au niveau d'un formateur expert.

RÈGLES DE QUALITÉ :
- Chaque slide doit avoir un contenu SUBSTANTIEL : pas de phrases vagues ou génériques
- Utilise un langage professionnel, précis et technique propre au domaine traité
- Structure le contenu de façon claire et progressive : sous-titres, listes à puces, tableaux si pertinent
- Les exemples doivent être concrets, réalistes et directement applicables
- Le contenu doit être PÉDAGOGIQUEMENT PERTINENT : il doit enseigner quelque chose au lecteur
- Évite le remplissage : chaque ligne doit apporter une information utile
- Adapte le nombre de slides (entre 5 et 10) à la richesse du document source : plus le document est riche, plus tu génères de slides

Le JSON retourné doit être parfaitement valide et bien formé.

⚠️ PRÉSENTATION OFFICIELLE DE LA PLATEFORME (si le document ou la question concerne la plateforme APC Algérie GÉNÉRATION 3, utilise UNIQUEMENT cette définition) : plateforme numérique intelligente dédiée à la conception, la génération et le développement de ressources pédagogiques et de documents de formation (RMC, PF, PE, RES, ROP-M) pour le secteur de la formation et de l'enseignement professionnels. L'IA au service de l'Approche Par Compétences (APC). Conçue et développée par Aziz Mohamed Rostom. Ce n'est PAS une plateforme d'apprentissage pour les apprenants : c'est un outil de conception pour les formateurs et les établissements.`;
        const msgs = [
            { role: 'system', content: sysPrompt.trim() },
            { role: 'user', content: prompt }
        ];
        let fullResponse = '';
        const startTime = Date.now();
        const modal = document.getElementById('gammaModal');
        const loadingText = document.getElementById('loadingText');
        const loadingSub = document.getElementById('loadingSub');
        if (loadingText) loadingText.textContent = '📄 Génération de la présentation...';
        if (loadingSub) loadingSub.textContent = 'Analyse du document et structuration des slides...';
        modal.classList.add('open');
        renderGammaSlides();
        let msgIndex = 0;
        const msgInterval = setInterval(() => {
            const el = document.getElementById('loadingText');
            if (el) {
                const msgs = ['📄 Analyse du document...', '🎨 Création des slides...', '✏️ Rédaction du contenu...', '🖼️ Préparation des images...'];
                msgIndex = (msgIndex + 1) % msgs.length;
                const sub = document.getElementById('loadingSub');
                if (sub) sub.textContent = `⏱ ${Math.round((Date.now() - startTime) / 1000)}s — ${msgs[msgIndex]}`;
                el.textContent = msgs[msgIndex];
            }
        }, 2800);
        try {
            await callAI(msgs, (chunk) => { fullResponse += chunk; }, (modelId) => {
                const sub = document.getElementById('loadingSub');
                const m = MODEL_MAP[modelId];
                if (sub && m) sub.textContent = `⏱ ${Math.round((Date.now() - startTime) / 1000)}s — Modèle ${m.model}`;
            });
            clearInterval(msgInterval);
            let jsonStr = fullResponse.trim();
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
                if (end === -1) throw new Error("Le modèle n'a pas retourné de JSON valide.");
                jsonStr = jsonStr.slice(start, end + 1).replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
                gammaData = JSON.parse(jsonStr);
            }
            gammaIndex = 0;
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
                s.content = content;
            });
            localStorage.setItem('gammaData', JSON.stringify(gammaData));
            renderGammaSlides();
            generateAllImages(gammaData.slides).then(urls => {
                console.log('generateAllImages returned:', urls);
                urls.forEach((url, i) => {
                    if (gammaData?.slides[i]) {
                        gammaData.slides[i].image_url = url;
                        console.log(`Slide ${i} image_url:`, url);
                    }
                });
                urls.forEach((url, i) => {
                    if (url && gammaData?.slides[i]) {
                        saveGeneratedImage({
                            prompt: gammaData.slides[i].image_prompt || gammaData.slides[i].title || '',
                            image_url: url,
                            visibility: 'public',
                            tags: ['presentation', gammaData.slides[i].title || '']
                        });
                    }
                });
                const el = document.getElementById('loadingText');
                if (el) el.textContent = "🖼️ Images prêtes !";
                renderGammaSlides();
            });
            showToast('✅ Présentation générée avec ' + gammaData.slides.length + ' slides');
        } catch (err) {
            clearInterval(msgInterval);
            const el = document.getElementById('loadingText');
            const sub = document.getElementById('loadingSub');
            if (el) el.textContent = "❌ Aucun fournisseur IA disponible";
            if (sub) sub.textContent = "Tous les quotas gratuits sont épuisés (Gemini, Groq, OpenRouter). Attends la réinitialisation (~24h) ou ajoute une clé API payante dans ⚙️ Paramètres.";
            console.error(err);
        }
    });
})();