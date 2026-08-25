'use strict';
        const T = {
            fr: {
                headerTitle: "APC ALGÉRIE <span>GÉNÉRATION 3</span>",
                ministere: "Ministère de la Formation et de l'Enseignement Professionnels",
                headerSub: "Formateur 2.0 – Assistant intelligent de conception pédagogique APC",
                headerDesc: "Générez des prompts professionnels pour ChatGPT, Claude, Gemini et Copilot afin de concevoir vos scénarios pédagogiques selon l'Approche Par Compétences.",
                headerSig: "",
                tab_generator: "📝 Générateur de Prompts",
                tab_assistant: "🤖 Assistant IA",
                tab_about: "ℹ️ À propos",
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
                btnGamma: "🎨 Générer présentation",
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
                c1: "Réaliser une analyse APC complète (savoirs, savoir-faire, savoir-être, ressources internes/externes).",
                c2: "Construire un scénario pédagogique APC selon les 5 phases (Contextualisation, Déstabilisation, Construction, Intégration, Transfert).",
                c3: "Créer une situation d'intégration authentique en lien avec le contexte professionnel.",
                c4: "Produire une évaluation basée sur les compétences.",
                c5: "Générer une grille critérielle APC 4×4 (quatre critères × quatre niveaux de maîtrise : Non maîtrisé, En cours, Maîtrisé, Expert) avec des cases à cocher ☐ pour chaque niveau.",
                c6: "Générer les critères de performance observables.",
                c7: "Générer les indicateurs de réussite.",
                c8: "Rédiger une conclusion pédagogique synthétisant les acquis et perspectives.",
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
                groqKeyLabel: "⚡ Clé API Groq",
                groqKeyHint: "Pour utiliser les modèles Groq (GPT OSS, Mixtral, DeepSeek).",
                verifyBtn: "Vérifier",
                modelSelection: "Modèle à utiliser",
                modelAuto: "☑ Auto (Groq → OpenRouter)",
                modelV3: "☐ DeepSeek V3 (OpenRouter)",
                modelR1: "☐ DeepSeek R1 (OpenRouter)",
                modelLlama: "☐ Llama 3.3 70B (OpenRouter)",
                modelGroqLlama: "☐ GPT OSS 120B (Groq)",
                modelGroqMixtral: "☐ Mixtral 8x7B (Groq)",
                modelGroqDeepseek: "☐ DeepSeek R1 (Groq)",
                saveBtn: "Enregistrer",
                clearBtn: "Effacer tout",
                cancelBtn: "Annuler",
                apiSaved: "✅ Clés API enregistrées !",
                apiCleared: "🗑 Clés effacées.",
                apiInvalid: "⚠️ Clé invalide.",
                keyValid: "✅ Clé valide !",
                keyInvalid: "❌ Clé invalide ou erreur réseau.",
                checkingKey: "🔍 Vérification en cours...",
            },
            ar: {
                headerTitle: "APC الجزائر <span>الجيل 3</span>",
                ministere: "وزارة التكوين والتعليم المهنيين",
                headerSub: "المكوِّن 2.0 – المساعد الذكي لتصميم السيناريوهات البيداغوجية",
                headerDesc: "أنشئ بروم‌بتات احترافية لـ ChatGPT وClaude وGemini لتصميم سيناريوهاتك وفق المقاربة بالكفاءات.",
                headerSig: "",
                tab_generator: "📝 مولّد البرومبتات",
                tab_assistant: "🤖 المساعد الذكي",
                tab_about: "ℹ️ حول المنصة",
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
                btnGamma: "🎨 توليد عرض تقديمي",
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
                c1: "إجراء تحليل APC كامل (المعارف، المهارات، السلوكيات، الموارد الداخلية والخارجية).",
                c2: "بناء سيناريو بيداغوجي APC وفق المراحل الخمس (السياق، زعزعة التوازن، البناء، الإدماج، النقل).",
                c3: "إنشاء وضعية إدماج أصيلة مرتبطة بالسياق المهني.",
                c4: "إنتاج تقييم مبني على الكفاءات.",
                c5: "توليد شبكة معيارية APC 4×4 (أربعة معايير × أربعة مستويات إتقان: غير مكتسب، قيد الاكتساب، مكتسب، خبير) مع مربعات اختيار ☐ لكل مستوى.",
                c6: "توليد معايير الأداء القابلة للملاحظة.",
                c7: "توليد مؤشرات النجاح.",
                c8: "كتابة خاتمة بيداغوجية تلخّص المكتسبات والآفاق.",
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
                groqKeyLabel: "⚡ مفتاح API Groq",
                groqKeyHint: "لاستخدام نماذج Groq (GPT OSS، Mixtral، DeepSeek).",
                verifyBtn: "تحقق",
                modelSelection: "النموذج المستخدم",
                modelAuto: "☑ تلقائي (Groq → OpenRouter)",
                modelV3: "☐ DeepSeek V3 (OpenRouter)",
                modelR1: "☐ DeepSeek R1 (OpenRouter)",
                modelLlama: "☐ Llama 3.3 70B (OpenRouter)",
                modelGroqLlama: "☐ GPT OSS 120B (Groq)",
                modelGroqMixtral: "☐ Mixtral 8x7B (Groq)",
                modelGroqDeepseek: "☐ DeepSeek R1 (Groq)",
                saveBtn: "حفظ",
                clearBtn: "حذف الكل",
                cancelBtn: "إلغاء",
                apiSaved: "✅ تم حفظ المفاتيح!",
                apiCleared: "🗑 تم حذف المفاتيح.",
                apiInvalid: "⚠️ مفتاح غير صالح.",
                keyValid: "✅ المفتاح صحيح!",
                keyInvalid: "❌ مفتاح غير صالح أو خطأ في الشبكة.",
                checkingKey: "🔍 جارٍ التحقق...",
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
<li>Accompagner les formateurs dans la conception et le développement de ressources pédagogiques de qualité.</li>\
<li>Générer rapidement des documents de formation professionnels.</li>\
<li>Optimiser le temps consacré à la préparation des activités pédagogiques.</li>\
<li>Améliorer la qualité des apprentissages et des dispositifs de formation.</li>\
<li>Favoriser l'innovation pédagogique grâce aux technologies de l'intelligence artificielle.</li>\
<li>Soutenir la transformation numérique du secteur de la formation et de l'enseignement professionnels.</li>\
<li>Mettre à disposition des outils intelligents, modernes et accessibles.</li>\
<li>Contribuer au développement des compétences des apprenants.</li>\
<li>Encourager l'amélioration continue des pratiques pédagogiques.</li>\
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
<li>Aziz Mohamed Rostom</li>\
<li>Bouloum Boumediene</li>\
<li>Faradji Said</li>\
<li>Salah Manel</li>\
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
<h2>Notre vision</h2>\
<p>Nous sommes convaincus que l'avenir de la formation et de l'enseignement professionnels repose sur la complémentarité entre l'expertise humaine, l'innovation pédagogique et l'intelligence artificielle.</p>\
<p>Notre vision est de faire de APC Algérie GÉNÉRATION 3 une plateforme de référence en matière de conception pédagogique, d'ingénierie de formation et de transformation numérique, en proposant des solutions intelligentes qui accompagnent durablement les formateurs, les établissements de formation et les professionnels du secteur.</p>\
<p>Nous développons des outils innovants qui facilitent la conception pédagogique, améliorent la qualité des ressources de formation et contribuent au développement des compétences dans un environnement en constante évolution.</p>\
<h2>Notre devise</h2>\
<p><em>Former aujourd'hui les compétences de demain grâce à l'Approche Par Compétences, à l'innovation pédagogique et à l'intelligence artificielle.</em></p>\
<p>APC Algérie GÉNÉRATION 3 est bien plus qu'une plateforme numérique : c'est une initiative dédiée à la modernisation de la formation et de l'enseignement professionnels, qui associe l'expertise humaine, l'innovation pédagogique et les technologies de l'intelligence artificielle afin d'accompagner les professionnels dans la conception de ressources pédagogiques de qualité et le développement des compétences de demain.</p>`;
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
<li>مرافقة المكوّنين في تصميم وإعداد وتطوير الموارد البيداغوجية.</li>\
<li>إنتاج الوثائق التكوينية بجودة عالية وفي وقت قياسي.</li>\
<li>تقليص الوقت والجهد المبذولين في إعداد الأنشطة والوثائق البيداغوجية.</li>\
<li>تحسين جودة التكوين ومخرجات التعلم.</li>\
<li>دعم الابتكار البيداغوجي من خلال تقنيات الذكاء الاصطناعي.</li>\
<li>المساهمة في التحول الرقمي لقطاع التكوين والتعليم المهني.</li>\
<li>توفير أدوات ذكية وحديثة وسهلة الاستخدام.</li>\
<li>المساهمة في تطوير كفاءات المتعلمين.</li>\
<li>دعم التحسين المستمر للممارسات البيداغوجية.</li>\
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
<li>عزيز محمد رستم</li>\
<li>بولوم بومدين</li>\
<li>فرادجي سعيد</li>\
<li>صلاح منال</li>\
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
<h2>رؤيتنا</h2>\
<p>نؤمن بأن مستقبل التكوين والتعليم المهني يقوم على التكامل بين الخبرة البشرية، والابتكار البيداغوجي، والذكاء الاصطناعي.</p>\
<p>وتتمثل رؤيتنا في أن تصبح APC Algérie GÉNÉRATION 3 منصة مرجعية في مجال الهندسة البيداغوجية، وتصميم الموارد التكوينية، والتحول الرقمي، من خلال تقديم حلول ذكية تساعد المكوّنين ومؤسسات التكوين على تطوير ممارساتهم، والارتقاء بجودة التكوين، وتعزيز تنمية الكفاءات.</p>\
<p>ونسعى إلى تطوير أدوات مبتكرة تُسهّل تصميم الوثائق التكوينية، وتدعم جودة الموارد البيداغوجية، وتواكب التحولات المتسارعة التي يشهدها قطاع التكوين والتعليم المهني.</p>\
<h2>شعارنا</h2>\
<p><em>نُعِدُّ اليوم كفاءات الغد، من خلال المقاربة بالكفاءات، والابتكار البيداغوجي، والذكاء الاصطناعي.</em></p>\
<p>APC Algérie GÉNÉRATION 3 ليست مجرد منصة رقمية، بل مبادرة وطنية تسعى إلى دعم وتطوير قطاع التكوين والتعليم المهني، من خلال الجمع بين الخبرة البشرية، والتميز البيداغوجي، وتقنيات الذكاء الاصطناعي، للمساهمة في بناء منظومة تكوينية حديثة، مبتكرة، ومستدامة.</p>`;
        function renderAboutContent() {
            const el = document.getElementById('aboutContent');
            if (el) el.innerHTML = currentLang === 'ar' ? aboutAR : aboutFR;
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
        function migrateKey(oldKey, newKey) {
            var val = localStorage.getItem(oldKey);
            if (val && !sessionStorage.getItem(newKey)) {
                sessionStorage.setItem(newKey, val);
            }
            localStorage.removeItem(oldKey);
        }
        migrateKey('openrouter_api_key', 'or_key');
        migrateKey('groq_api_key', 'gq_key');
        migrateKey('gemini_api_key', 'gm_key');
        function getOpenRouterKey() { return (sessionStorage.getItem('or_key') || '').trim(); }
        function setOpenRouterKey(key) {
            const cleaned = key ? key.trim() : '';
            if (cleaned && cleaned.length > 10 && cleaned.startsWith('sk-or-v1-')) sessionStorage.setItem('or_key',
                cleaned);
            else sessionStorage.removeItem('or_key');
            updateApiBadge();
        }
        function getGroqKey() { return (sessionStorage.getItem('gq_key') || '').trim(); }
        function setGroqKey(key) {
            const cleaned = key ? key.trim() : '';
            if (cleaned && cleaned.length > 10 && cleaned.startsWith('gsk_')) sessionStorage.setItem('gq_key', cleaned);
            else sessionStorage.removeItem('gq_key');
            updateApiBadge();
        }
function updateApiBadge() {}
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
            { id: "gemini", name: "Google Gemini", icon: "✦", models: ["gemini-1.5-pro", "gemini-1.5-flash",
                    "gemini-pro"
                ], apiKeyName: "GEMINI_API_KEY", url: "https://generativelanguage.googleapis.com/v1beta/models" },
            { id: "openrouter", name: "OpenRouter", icon: "🔀", models: ["deepseek/deepseek-v3",
                    "deepseek/deepseek-r1", "meta-llama/llama-3.3-70b-instruct"
                ], apiKeyName: "OPENROUTER_API_KEY", url: "https://openrouter.ai/api/v1/chat/completions" },
            { id: "groq", name: "Groq", icon: "⚡", models: ["openai/gpt-oss-120b", "mixtral-8x7b-32768",
                    "deepseek-r1-distill-llama-70b"
                ], apiKeyName: "GROQ_API_KEY", url: "https://api.groq.com/openai/v1/chat/completions" },
            { id: "ollama", name: "Ollama (local)", icon: "🏠", models: ["llama3", "mistral", "qwen2", "deepseek-r1",
                    "gemma"
                ], apiKeyName: "OLLAMA_URL", url: "http://localhost:11434/api/chat" },
        ];
        const MODEL_MAP = {
            'groq-llama': { provider: 'groq', model: 'openai/gpt-oss-120b' },
            'groq-mixtral': { provider: 'groq', model: 'mixtral-8x7b-32768' },
            'groq-deepseek': { provider: 'groq', model: 'deepseek-r1-distill-llama-70b' },
            'deepseek-v3': { provider: 'openrouter', model: 'deepseek/deepseek-v3' },
            'deepseek-r1': { provider: 'openrouter', model: 'deepseek/deepseek-r1' },
            'llama3.3': { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct' },
            'llama3.3-free': { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct:free' },
        };
        const FALLBACK_ORDER = ['groq-llama', 'groq-mixtral', 'groq-deepseek', 'deepseek-v3', 'deepseek-r1', 'llama3.3'];
        function getApiKey(name) {
            if (name === 'OPENROUTER_API_KEY') return getOpenRouterKey();
            if (name === 'GROQ_API_KEY') return getGroqKey();
            return localStorage.getItem('apikey_' + name) || '';
        }
        function markdownToHtml(md) {
            if (!md) return '';
            let lines = md.split('\n');
            lines = lines.map(line => line.replace(/^(\d+\.\s+)/, '').replace(/^(\d+\.\d+\.\s+)/, ''));
            md = lines.join('\n');
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
            const tableRegex = /\n(\|.*\|)\n\|[-: |]+\|\n((?:\|.*\|\n?)+)/g;
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
                return tableHtml;
            });
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(m, text, url) {
                url = url.replace(/javascript\s*:/gi, 'blocked:');
                return '<a href="' + url.replace(/"/g, '&quot;') + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
            });
            html = html.replace(/\n\n/g, '</p><p>');
            html = html.replace(/\n/g, '<br>');
            if (!html.startsWith('<')) html = '<p>' + html + '</p>';
            html = html.replace(/<p><\/p>/g, '');
            return html;
        }
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
        function t(k) { return (T[currentLang] && T[currentLang][k]) || T.fr[k] || k; }
        let currentLang = localStorage.getItem('lang') || 'fr';
        if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');
        let isDark = localStorage.getItem('theme') === 'dark';
        let selectedExample = null;
        let options = { analyse: false, scenario: false, integration: false, evaluation: false, grille: false,
            criteres: false, indicateurs: false, conclusion: false };
        let conversations = JSON.parse(sessionStorage.getItem('ai_conversations') || '[]');
        let currentConvId = null;
        let isGenerating = false;
        let abortController = null;
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
        const EXAMPLES = [{ icon: "💻", name_fr: "Informatique APC", name_ar: "إعلام آلي APC",
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
        const QUICK_KEYS = ['quick_scenario', 'quick_eval', 'quick_fiche', 'quick_integration', 'quick_grille',
            'quick_cours'
        ];
        const OPTS = [{ id: 'analyse', k: 'opt_analyse' }, { id: 'scenario', k: 'opt_scenario' }, { id: 'integration',
                k: 'opt_integration' }, { id: 'evaluation', k: 'opt_evaluation' }, { id: 'grille', k: 'opt_grille' },
            { id: 'criteres', k: 'opt_criteres' }, { id: 'indicateurs', k: 'opt_indicateurs' },
            { id: 'conclusion', k: 'opt_conclusion' }
        ];
        const OPT_CKEYS = ['c1','c2','c3','c4','c5','c6','c7','c8'];
        const OPT_IDS = ['analyse','scenario','integration','evaluation','grille','criteres','indicateurs','conclusion'];
        async function callAI(messages, onChunk, onModelChange, forceProvider = null, forceModel = null) {
            const provSel = forceProvider || document.getElementById('providerSelect').value;
            const modelSel = forceModel || document.getElementById('modelSelect').value;
            let selectedModelChoice = getSelectedModel();
            if (forceProvider === 'groq') {
                const groqModels = ['groq-llama', 'groq-mixtral', 'groq-deepseek'];
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
                throw new Error(`Tous les modèles ont échoué. Dernière erreur: ${lastError?.message || 'inconnue'}`);
            }
            const p = PROVIDERS.find(x => x.id === provSel);
            if (!p) throw new Error('Fournisseur introuvable');
            const key = getApiKey(p.apiKeyName);
            if (!key && p.id !== 'ollama') throw new Error(t('no_api_key'));
            return await callProvider(p, modelSel || p.models[0], messages, onChunk);
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
            if (onModelChange) onModelChange(modelKey);
            return await callProvider(provider, mapping.model, messages, onChunk);
        }
        async function callProvider(p, model, messages, onChunk) {
            abortController = new AbortController();
            const key = getApiKey(p.apiKeyName);
            let url = p.url,
                headers = { 'Content-Type': 'application/json' },
                body;
            if (p.id === 'anthropic') {
                headers['x-api-key'] = key;
                headers['anthropic-version'] = '2023-06-01';
                headers['anthropic-beta'] = 'messages-2023-06-01';
                const sys = messages.find(m => m.role === 'system');
                const msgs = messages.filter(m => m.role !== 'system');
                body = JSON.stringify({ model, max_tokens: 4096, stream: true, system: sys ? sys.content : undefined,
                    messages: msgs });
            } else if (p.id === 'gemini') {
                url = `${p.url}/${model}:streamGenerateContent?key=${key}`;
                const contents = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ?
                        'model' : 'user', parts: [{ text: m.content }] }));
                body = JSON.stringify({ contents, generationConfig: { maxOutputTokens: 4096 } });
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
                }
                body = JSON.stringify({ model, messages, stream: true, max_tokens: 4096, temperature: 0.7 });
            }
            const timeoutId = setTimeout(() => {
                if (abortController) abortController.abort();
            }, 120000);
            const resp = await fetch(url, { method: 'POST', headers, body, signal: abortController.signal });
            clearTimeout(timeoutId);
            if (!resp.ok) {
                const errText = await resp.text();
                if (p.id === 'groq' && (resp.status === 401 || resp.status === 429 || resp.status === 403)) {
                    throw new Error(`GROQ_ERROR: ${resp.status} - ${errText}`);
                }
                throw new Error(`HTTP ${resp.status}: ${errText}`);
            }
            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let buf = '';
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
                        let chunk = '';
                        if (p.id === 'anthropic' && j.type === 'content_block_delta') chunk = j.delta?.text || '';
                        else if (p.id === 'gemini') chunk = j.candidates?.[0]?.content?.parts?.[0]?.text || '';
                        else if (p.id === 'ollama') chunk = j.message?.content || '';
                        else chunk = j.choices?.[0]?.delta?.content || '';
                        if (chunk) onChunk(chunk);
                    } catch (e) {}
                }
            }
        }
        async function generateImage(prompt, fallback) {
            try {
                const base = prompt || "Educational concept illustration, modern style, clean, professional";
                const suffix = fallback ? ", simple educational illustration, flat design, clean" : ", educational illustration, clean, professional";
                const full = base + suffix;
                const encoded = encodeURIComponent(full);
                const seed = Math.floor(Math.random() * 99999);
                return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&model=flux&seed=${seed}&nolicense=1`;
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
                        const url = await Promise.race([generateImage(prompt, attempt > 0), timeout(8000)]);
                        if (url) return url;
                    } catch (e) { continue; }
                }
                return '';
            }));
        }
        function updatePresoButtonLabel() {}
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
        async function generateGammaPresentation(promptText) {
            const subject = promptText || buildPrompt() || "Présentation APC Algérie Génération 3";
            const gKey = getGroqKey();
            if (!gKey || gKey.length < 10) {
                showToast("⚠️ Veuillez configurer une clé Groq dans les paramètres (⚡ Groq).");
                return;
            }
            const lang = currentLang === 'fr' ? 'français' : 'arabe';
            const prompt = `Tu es un expert en scénarios pédagogiques APC Algérie. Génère une présentation de 15 slides en JSON.
CONTEXTE PÉDAGOGIQUE :
${subject}
STRUCTURE DES SLIDES (obligatoire) :
1. Présentation de la compétence — spécialité, module, niveau, compétence, durée, formateur, public
2. Ce qu'il faut connaître — tableau | Connaissances | Compétences pratiques | Attitudes pro |
3. Outils et ressources — tableau | Savoirs personnels | Matériel |
4. Le métier et ses missions — contexte métier, mission, tâches
5. Mise en situation — objectif, activités, production, durée
6. Problème à résoudre — situation-problème, questions, activités, durée
7. Passons à la pratique (1/2) — 3 activités avec étapes
8. Passons à la pratique (2/2) — 2 activités, méthodes, durée
9. Mission : cas pratique — situation authentique, mission, production, durée
10. Nouveau défi — nouvelle situation, tâches, durée
11. Évaluation pratique — tâche, conditions, type
12. Ce qui sera observé — 10 critères observables
13. Barème d'évaluation — tableau | Critères | Non maîtrisé | En cours | Maîtrisé | Expert |
14. Objectifs atteints ? — 10 indicateurs
15. Ce que vous avez appris — synthèse des acquis, compétences, perspective
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
                    if (sub) sub.textContent = `⏱ ${elapsed}s écoulées`;
                    el.textContent = LOADING_MSGS[msgIndex]; }
            }, 2800);
            try {
                document.getElementById('gammaModal').classList.add('open');
                renderGammaSlides();
                const groqModels = ['groq-llama', 'groq-mixtral', 'groq-deepseek'];
                let groqOk = false;
                for (const gm of groqModels) {
                    try {
                        await callModel(gm, msgs, (chunk) => { fullResponse += chunk; });
                        groqOk = true;
                        break;
                    } catch (e) { console.warn(`Groq ${gm} échoué:`, e); }
                }
                if (!groqOk) throw new Error('Tous les modèles Groq ont échoué');
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
                    jsonStr = jsonStr.slice(start, end + 1);
                    jsonStr = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
                    gammaData = JSON.parse(jsonStr);
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
                        if (url && gammaData?.slides[i]) {
                            saveGeneratedImage({
                                prompt: gammaData.slides[i].image_prompt || gammaData.slides[i].title || '',
                                image_url: url,
                                visibility: 'public',
                                tags: ['presentation', gammaData.slides[i].title || '']
                            });
                        }
                    });
                    const loadingEl = document.getElementById('loadingText');
                    if (loadingEl) loadingEl.textContent = "🖼️ Images prêtes !";
                    renderGammaSlides();
                });
            } catch (err) {
                clearInterval(msgInterval);
                showToast("❌ Erreur : " + err.message);
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
            function flushTable() {
                if (tableRows.length === 0) return;
                const headerCells = tableRows[0].split('|').filter(c => c.trim()).map(c => c.trim());
                let dataStart = 1;
                if (tableRows.length > 1 && tableRows[1].includes('---')) dataStart = 2;
                html += '<table style="width:100%;border-collapse:collapse;font-size:0.82rem;margin:6px 0;">';
                if (headerCells.length > 0) {
                    html += '<thead><tr>';
                    headerCells.forEach(h => {
                        html += `<th style="border:1px solid ${textColor}44;padding:4px 6px;background:${textColor}15;font-weight:600;text-align:left;font-size:0.78rem;">${h}</th>`;
                    });
                    html += '</tr></thead>';
                }
                html += '<tbody>';
                for (let i = dataStart; i < tableRows.length; i++) {
                    const cells = tableRows[i].split('|').filter(c => c.trim()).map(c => c.trim());
                    html += '<tr>';
                    cells.forEach(c => {
                        html += `<td style="border:1px solid ${textColor}44;padding:4px 6px;font-size:0.78rem;">${c}</td>`;
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
                    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                        tableRows.push(line);
                    } else {
                        flushTable();
                        if (trimmed) html += `<li style="color:${textColor};padding:3px 0 3px 20px;font-size:0.88rem;">${line}</li>`;
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
                        <div class="loading-text" id="loadingText">🎯 Analyse du contenu pédagogique...</div>
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
                        <img class="slide-image" src="${s.image_url}" alt="${s.title}" loading="lazy">
                        <div class="gamma-img-placeholder">🖼️</div>
                        <div class="gamma-img-err">
                            <span>⚠️ Échec chargement</span>
                            <button class="btn btn-secondary" onclick="retrySlideImage(${idx})" style="font-size:11px;padding:4px 12px;">🔄 Réessayer</button>
                        </div>
                        <button class="gamma-img-search btn-icon-sm" data-idx="${idx}" onclick="openImageSearch(${idx})" title="Rechercher une image sur le web">🌐</button>
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
            if (typeof ensureGammaBankUI === 'function') ensureGammaBankUI();
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
        async function retrySlideImage(idx) {
            if (!gammaData || !gammaData.slides[idx]) return;
            const s = gammaData.slides[idx];
            const url = await generateImage(slideImagePrompt(s), true);
            s.image_url = url;
            renderGammaSlides();
        }
        async function regenerateAllImages() {
            if (!gammaData || !gammaData.slides || !gammaData.slides[gammaIndex]) return;
            retrySlideImage(gammaIndex);
        }
        function ensureGammaBankUI() {
            if (document.getElementById('gammaImageBank')) return;
            var exportBar = document.querySelector('.preso-export');
            if (!exportBar) return;
            var btn = document.createElement('button');
            btn.className = 'btn btn-secondary';
            btn.textContent = '🖼️ Banque d\'images';
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
            let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${gammaData.title}</title><style>
                body { font-family: 'Inter', sans-serif; background: #fff; padding: 30px; }
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
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            wrapper.style.position = 'fixed';
            wrapper.style.left = '-9999px';
            wrapper.style.top = '0';
            document.body.appendChild(wrapper);
            html2pdf().set({ margin: [10, 10, 10, 10], filename: `presentation_${Date.now()}.pdf`, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(wrapper).save().then(() => { document.body.removeChild(wrapper); showToast("✅ PDF téléchargé !"); }).catch(e => { document.body.removeChild(wrapper); showToast("❌ Erreur PDF: " + e.message); });
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
                const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
                const blob = await resp.blob();
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
                s.addText(bulletText, {
                    x: 0.5, y: 1.4, w: slide.image_url ? 6.5 : 12.33, h: 5.2,
                    valign: 'top'
                });
                if (slide.image_url && imageCache[slide.image_url]) {
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
            t.textContent = msg;
            clearTimeout(toastTimer);
            setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(0)';
                t.style.opacity = '1'; }, 10);
            toastTimer = setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(80px)';
                t.style.opacity = '0'; }, 2600);
        }
        function applyTheme() {
            document.body?.classList.toggle('dark', isDark);
            const themeLabel = document.getElementById('themeLabel');
            if (themeLabel) themeLabel.textContent = isDark ? t('themeLight') : t('themeDark');
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
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const k = el.getAttribute('data-i18n');
                if (T[lang][k] !== undefined) el.textContent = T[lang][k];
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const k = el.getAttribute('data-i18n-placeholder');
                if (T[lang][k]) el.placeholder = T[lang][k];
            });
            document.getElementById('themeLabel').textContent = isDark ? t('themeLight') : t('themeDark');
            updatePresoButtonLabel();
            renderExamples();
            renderOptions();
            renderQuickBtns();
            updatePrompt();
            updateApiBadge();
            renderAboutContent();
            if (typeof updateAuthUI === 'function') updateAuthUI();
        }
        function renderExamples() {
            const g = document.getElementById('examplesGrid');
            if (!g) return;
            g.innerHTML = '';
            EXAMPLES.forEach((ex, i) => {
                const isFr = currentLang === 'fr';
                const name = isFr ? ex.name_fr : ex.name_ar;
                const spec = isFr ? ex.specialite_fr : ex.specialite_ar;
                const comp = isFr ? ex.competence_fr : ex.competence_ar;
                const niv = isFr ? ex.niveau_fr : ex.niveau_ar;
                const d = document.createElement('div');
                d.className = 'ex-card' + (selectedExample === i ? ' selected' : '');
                d.innerHTML =
                    `<div class="ex-icon">${ex.icon}</div><div class="ex-title">${name}</div><div class="ex-detail">${spec}</div><div class="ex-detail">${comp.substring(0,52)}…</div><div class="ex-badge">${niv}</div><div class="ex-hint">👆 ${isFr?'Cliquer pour tout remplir':'اضغط لملء كل الحقول'}</div>`;
                d.onclick = () => fillExample(ex, i);
                g.appendChild(d);
            });
        }
        function fillExample(ex, idx) {
            selectedExample = idx;
            const isFr = currentLang === 'fr';
            const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
            set('roleIA', isFr ? ex.role_fr : ex.role_ar);
            set('missionIA', isFr ? ex.mission_fr : ex.mission_ar);
            set('specialite', isFr ? ex.specialite_fr : ex.specialite_ar);
            set('module', isFr ? ex.module_fr : ex.module_ar);
            set('competence', isFr ? ex.competence_fr : ex.competence_ar);
            set('niveau', isFr ? ex.niveau_fr : ex.niveau_ar);
            set('annee', isFr ? ex.annee_fr : ex.annee_ar);
            set('duree', isFr ? ex.duree_fr : ex.duree_ar);
            set('stagiaires', ex.stagiaires);
            set('espace', isFr ? ex.espace_fr : ex.espace_ar);
            set('ressources', isFr ? ex.ressources_fr : ex.ressources_ar);
            set('contexte', isFr ? ex.contexte_fr : ex.contexte_ar);
            set('difficultes', isFr ? ex.difficultes_fr : ex.difficultes_ar);
            const hasAST = ex.astMetier_fr || ex.astMetier_ar;
            document.getElementById('astToggle').checked = !!hasAST;
            document.getElementById('astPanel').classList.toggle('visible', !!hasAST);
            if (hasAST) { set('astMetier', isFr ? ex.astMetier_fr : ex.astMetier_ar);
                set('astExtrait', isFr ? ex.astExtrait_fr : ex.astExtrait_ar); }
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
                sp.textContent = t(o.k);
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
                lbl.textContent = '✏️ ' + t(OPTS[idx].k);
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
                b.textContent = t(k);
                b.onclick = () => {
                    const ctx = getFormContext();
                    const prompts = {
                        quick_scenario: `Crée un scénario pédagogique APC complet selon les 5 phases (Contextualisation, Déstabilisation, Construction, Intégration, Transfert) en tableau professionnel.\n\n${ctx}`,
                        quick_eval: `Génère une évaluation APC basée sur les compétences avec critères et indicateurs en tableau.\n\n${ctx}`,
                        quick_fiche: `Crée une fiche pédagogique APC complète avec objectifs, déroulement et évaluation.\n\n${ctx}`,
                        quick_integration: `Crée une situation d'intégration authentique et contextualisée pour l'APC Algérie.\n\n${ctx}`,
                        quick_grille: `Génère une grille critérielle APC 4×4 avec les critères spécifiques à la formation suivante. Utilise la structure de tableau ci-dessous et remplace les exemples par les vrais critères.\n\nExemple de structure :\n| Critère | Non maîtrisé | En cours | Maîtrisé | Expert |\n|---------|--------------|----------|----------|--------|\n| Exemple critère 1 | ☐ | ☐ | ☐ | ☐ |\n| Exemple critère 2 | ☐ | ☐ | ☐ | ☐ |\n| Exemple critère 3 | ☐ | ☐ | ☐ | ☐ |\n| Exemple critère 4 | ☐ | ☐ | ☐ | ☐ |\n\n${ctx}`,
                        quick_cours: `Crée un cours complet APC avec introduction, développement, exemples, exercices et évaluation.\n\n${ctx}`,
                    };
                    const arPrompts = {
                        quick_scenario: `أنشئ سيناريو بيداغوجياً APC كاملاً وفق المراحل الخمس (السياق، زعزعة التوازن، البناء، الإدماج، النقل) في جدول احترافي.\n\n${ctx}`,
                        quick_eval: `أنشئ تقييماً APC مبنياً على الكفاءات مع معايير ومؤشرات في جدول.\n\n${ctx}`,
                        quick_fiche: `أنشئ بطاقة بيداغوجية APC كاملة مع الأهداف والسير والتقييم.\n\n${ctx}`,
                        quick_integration: `أنشئ وضعية إدماج أصيلة ومسيَّقة للـ APC الجزائري.\n\n${ctx}`,
                        quick_grille: `أنشئ شبكة معيارية APC 4×4 مع المعايير الخاصة بالتكوين التالي. استخدم هيكل الجدول أدناه واستبدل الأمثلة بالمعايير الحقيقية.\n\nمثال للهيكل :\n| المعيار | غير مكتسب | قيد الاكتساب | مكتسب | خبير |\n|---------|-----------|-------------|--------|------|\n| مثال معيار 1 | ☐ | ☐ | ☐ | ☐ |\n| مثال معيار 2 | ☐ | ☐ | ☐ | ☐ |\n| مثال معيار 3 | ☐ | ☐ | ☐ | ☐ |\n| مثال معيار 4 | ☐ | ☐ | ☐ | ☐ |\n\n${ctx}`,
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
            const cons = consignes.length ? consignes.join('\n') : t('no_option');
            return `${t('prompt_role')} : ${role||'—'}\n${t('prompt_mission')} : ${mission||'—'}\n${t('prompt_langue')} : ${currentLang==='fr'?'Français':'العربية'}\n\n${t('prompt_context')} :\n- ${t('prompt_specialite')} : ${spec||'—'}\n- ${t('prompt_module')} : ${mod||'—'}\n- ${t('prompt_competence')} : ${comp||'—'}\n- ${t('prompt_niveau')} : ${niv||'—'} (${ann||'—'})\n- ${t('prompt_duree')} : ${dur||'—'} | ${t('prompt_stagiaires')} : ${stag||'—'}\n- ${t('prompt_espace')} : ${esp||'—'}\n- ${t('prompt_ressources')} : ${res||'—'}\n- ${t('prompt_contexte')} : ${ctx||'—'}\n- ${t('prompt_difficultes')} : ${diff||'—'}\n${ast}\n${t('prompt_consignes')} :\n${cons}`;
        }
        function updatePrompt() { const el = document.getElementById('promptPreview'); if (el) el.textContent = buildPrompt(); }
        function loadKeysIntoModal() {
            document.getElementById('openrouterApiKeyInput').value = getOpenRouterKey();
            document.getElementById('groqApiKeyInput').value = getGroqKey();
        }
        const modal = document.getElementById('settingsModal');
        document.getElementById('modalCloseBtn')?.addEventListener('click', () => modal?.classList.remove('open'));
        document.getElementById('modalCancelBtn')?.addEventListener('click', () => modal?.classList.remove('open'));
        modal?.addEventListener('click', (e) => { if (e.target === modal) modal?.classList.remove('open'); });
        document.getElementById('modalSaveBtn')?.addEventListener('click', () => {
            const orKey = document.getElementById('openrouterApiKeyInput').value.trim();
            const groqKey = document.getElementById('groqApiKeyInput').value.trim();
            setOpenRouterKey(orKey);
            setGroqKey(groqKey);
            showToast(t('apiSaved'));
            modal?.classList.remove('open');
        });
        document.getElementById('modalClearBtn')?.addEventListener('click', () => {
            if (!confirm(currentLang === 'fr' ? 'Effacer toutes les clés ?' : 'حذف جميع المفاتيح؟')) return;
            setOpenRouterKey('');
            setGroqKey('');
            document.getElementById('openrouterApiKeyInput').value = '';
            document.getElementById('groqApiKeyInput').value = '';
            showToast(t('apiCleared'));
            modal?.classList.remove('open');
        });
        document.getElementById('verifyORKeyBtn')?.addEventListener('click', async () => {
            const key = document.getElementById('openrouterApiKeyInput').value.trim();
            const el = document.getElementById('verifyORResult');
            if (!key) { el.textContent = t('apiInvalid');
                el.className = 'verify-result error'; return; }
            el.textContent = t('checkingKey');
            el.className = 'verify-result loading';
            const valid = await verifyKey('https://openrouter.ai/api/v1/auth/key', key);
            el.textContent = valid ? t('keyValid') : t('keyInvalid');
            el.className = valid ? 'verify-result success' : 'verify-result error';
        });
        document.getElementById('verifyGroqKeyBtn')?.addEventListener('click', async () => {
            const key = document.getElementById('groqApiKeyInput').value.trim();
            const el = document.getElementById('verifyGroqResult');
            if (!key) { el.textContent = t('apiInvalid');
                el.className = 'verify-result error'; return; }
            el.textContent = t('checkingKey');
            el.className = 'verify-result loading';
            const valid = await verifyKey('https://api.groq.com/openai/v1/models', key);
            el.textContent = valid ? t('keyValid') : t('keyInvalid');
            el.className = valid ? 'verify-result success' : 'verify-result error';
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
restoreGammaData();
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