'use strict';
// Glossaire de référence APC — Contexte algérien de la Formation Professionnelle
// Utilisé comme contexte système dans l'Assistant IA (assistant.js)
const APC_GLOSSARY = {
    fr: `RÉFÉRENCE APC — GLOSSAIRE OFFICIEL (contexte algérien) :

- Approche Par Compétences (APC) : Approche curriculaire définissant les compétences requises pour un métier, transposées en formation. 5 documents : RMC, PF, PE, RES, ROPM.
- Compétence : Pouvoir d'agir/de réussir/de progresser fondé sur savoirs, habiletés, attitudes. Se décline en Cp, Cg, compétences prédéterminées.
- Compétence Particulière (Cp) : Liée aux tâches du RMC. Cœur opérationnel du programme. Atteinte du But 1.
- Compétence Générale (Cg / Transversale) : Transférable à d'autres situations. Buts 2, 3, 4 (intégration, évolution, mobilité).
- Compétence Prédéterminée : Commune à tous les programmes (Se situer au regard du métier, Exploiter l'outil informatique, Rechercher un emploi, S'intégrer au milieu de travail).
- RMC (Référentiel Métier et Compétences) : Carte d'identité du métier. Partie 1 : description du métier, Partie 2 : compétences. Issu de l'AST.
- PF (Projet de Formation) : Structure du programme : buts, liste des compétences, matrice, table de correspondance. Validé par homologation.
- PE (Programme d'Études) : Colonne vertébrale. Objectifs opérationnels (OC/OS), modules, suggestions pédagogiques, logigramme.
- RES (Référentiel Évaluation Sanction) : Encadrement de l'évaluation. 3 instruments : Tableau de spécification, Description de l'épreuve, Fiche d'évaluation.
- ROPM (Référentiel Organisation Pédagogique Matérielle) : Ressources matérielles, organisation, RH, MAO, aménagement.
- Objectif Opérationnel : Traduit la compétence en objectifs. 2 types : comportement (OC) et situation (OS).
- Objectif de Comportement (OC) : Actions observables, résultats mesurables. Évaluation par épreuve pratique.
- Objectif de Situation (OS) : Dimensions socioaffectives (expression, créativité, autonomie). Évaluation en 3 phases.
- Module : Subdivision autonome du programme. Un module = une compétence. MQ (qualifiant) / MC (complémentaire).
- Matrice des Compétences : Tableau visualisant l'ensemble du projet. Vérifie couverture sans redondance ni lacune.
- Logigramme des Compétences : Représentation schématique de la séquence d'acquisition. Préalables, parallélismes.
- Table de Correspondance : Adéquation entre besoins (AST) et réponses (PF). Lien RMC → PF.
- Processus de Travail : 4-6 étapes ordonnées, commune aux tâches du métier. Identifié dans le RMC.
- Suggestions Pédagogiques : Accompagnent chaque objectif. Démarche spécifique, évaluation formative, enrichissement, objets de formation, éléments de contenu.
- Objets de Formation : Apprentissages essentiels pour la compétence. Point de départ de la planification (pas le plan de cours).
- Éléments de Contenu : Indices sur l'étendue/limites des objets. Thèmes larges, substantifs.
- Évaluation Sanction (sommative) : Fin de module. Critérielle, dichotomique (réussite/échec), multidimensionnelle. 5-10% du temps.
- Évaluation Formative : En cours de module. Guide le stagiaire. Incluse dans le temps du programme.
- Tableau de Spécification : Objets d'évaluation, indicateurs, critères, points, seuil, règle de verdict.
- Chronogramme : Ordre d'acquisition + répartition temporelle. Respecte matrice, logigramme, durées.
- Audit (d'implantation) : État des ressources matérielles pour implanter un programme. Basé sur le ROPM.
- Enrichissement : Activités pour stagiaires avancés. Resserre les conditions et critères. Dans les limites de la compétence.
- Remédiation et Reprise : Droit du stagiaire en échec. Gérée par le Dispositif national d'évaluation.
- Valeurs Instrumentales : Rigueur (fidélité), cohérence (validité), transparence, faisabilité.
- MAO (Mobilier, Appareillage, Outillage) : Catégorisation des ressources matérielles (Cat. 1-5). Base du ROPM.
- Homologation : Consultation officielle du PF avant rédaction du PE.
- Buts généraux FP : But 1 (efficacité métier), But 2 (intégration pro), But 3 (évolution), But 4 (mobilité).
- AST (Analyse de Situation de Travail) : Point de départ de la conception. Alimente le RMC.`,

    ar: `مرجع APC — المسرد الرسمي (السياق الجزائري) :

- المقاربة بالكفاءات (APC) : منهج مناهجي يحدد الكفاءات المطلوبة لمهنة وينقلها إلى التكوين. 5 وثائق : RMC, PF, PE, RES, ROPM.
- الكفاءة : القدرة على العمل / النجاح / التقدم بناءً على المعارف والمهارات والسلوكيات. تنقسم إلى Cp، Cg، وكفاءات محددة سلفاً.
- الكفاءة الخاصة (Cp) : مرتبطة بمهام RMC. جوهر البرنامج التشغيلي. تحقيق الهدف 1.
- الكفاءة العامة (Cg / عرضية) : قابلة للنقل إلى مواقف أخرى. الأهداف 2، 3، 4 (الإدماج، التطور، التنقل).
- الكفاءة المحددة سلفاً : مشتركة بين جميع البرامج (يحدد موقعه من المهنة، يستخدم الإعلام الآلي، يبحث عن عمل، يندمج في الوسط المهني).
- RMC (مرجع المهنة والكفاءات) : بطاقة تعريف المهنة. الجزء 1 : وصف المهنة، الجزء 2 : الكفاءات. ناتج عن AST.
- PF (مشروع التكوين) : هيكل البرنامج : الأهداف، قائمة الكفاءات، المصفوفة، جدول المراسلة. يُصدق بالمصادقة الرسمية.
- PE (برنامج الدراسات) : العمود الفقري. أهداف تشغيلية (OC/OS)، وحدات، اقتراحات بيداغوجية، مخطط بياني.
- RES (مرجع تقييم الإشهاد) : تأطير التقييم. 3 أدوات : جدول المواصفات، وصف الاختبار، بطاقة التقييم.
- ROPM (مرجع التنظيم البيداغوجي والمادي) : الموارد المادية، التنظيم، الموارد البشرية، MAO، تهيئة الفضاءات.
- الهدف التشغيلي : يترجم الكفاءة إلى أهداف. نوعان : سلوكي (OC) وموقفي (OS).
- الهدف السلوكي (OC) : أفعال قابلة للملاحظة، نتائج قابلة للقياس. تقييم باختبار تطبيقي.
- الهدف الموقفي (OS) : الأبعاد الاجتماعية الوجدانية (التعبير، الإبداع، الاستقلالية). تقييم في 3 مراحل.
- الوحدة (Module) : تقسيم مستقل للبرنامج. وحدة = كفاءة واحدة. MQ (مؤهلة) / MC (مكملة).
- مصفوفة الكفاءات : جدول يصور المشروع كاملاً. يتحقق من التغطية دون تكرار أو نقص.
- المخطط البياني للكفاءات : تمثيل تخطيطي لتسلسل الاكتساب. السابقات، التوازيات.
- جدول المراسلة : الملاءمة بين الاحتياجات (AST) والإجابات (PF). الربط بين RMC ← PF.
- عملية العمل : 4-6 خطوات مرتبة زمنياً، مشتركة بين مهام المهنة. تُحدد في RMC.
- الاقتراحات البيداغوجية : ترافق كل هدف. منهجية خاصة، تقييم تكويني، إثراء، أهداف التكوين، عناصر المحتوى.
- أهداف التكوين : التعلمات الأساسية للكفاءة. نقطة انطلاق التخطيط (وليست خطة الدرس).
- عناصر المحتوى : مؤشرات على نطاق / حدود الأهداف. مواضيع واسعة، أسماء.
- تقييم الإشهاد (الختامي) : نهاية الوحدة. معياري، ثنائي (نجاح / رسوب)، متعدد الأبعاد. 5-10% من الوقت.
- التقييم التكويني : أثناء الوحدة. يوجه المتعلم. ضمن وقت البرنامج.
- جدول المواصفات : أهداف التقييم، المؤشرات، المعايير، النقاط، عتبة النجاح، قاعدة الحكم.
- المخطط الزمني (Chronogramme) : ترتيب الاكتساب + التوزيع الزمني. يحترم المصفوفة، المخطط البياني، المدد.
- التدقيق (للتطبيق) : حالة الموارد المادية لتطبيق برنامج. مبني على ROPM.
- الإثراء : أنشطة للمتقدمين. يضيق شروط الإنجاز والمعايير. ضمن حدود الكفاءة.
- المعالجة والاستدراك : حق المتعلم في حالة الرسوب. يديره الجهاز الوطني لتقييم التعلمات.
- القيم الآلية للتقييم : الدقة (الثبات)، الاتساق (الصدق)، الشفافية، قابلية الإنجاز.
- MAO (الأثاث والتجهيزات والأدوات) : تصنيف الموارد المادية (الأصناف 1-5). أساس ROPM.
- المصادقة الرسمية (Homologation) : استشارة رسمية لـ PF قبل كتابة PE.
- الأهداف العامة للتكوين المهني : الهدف 1 (فعالية المهنة)، الهدف 2 (الإدماج المهني)، الهدف 3 (التطور)، الهدف 4 (التنقل).
- AST (تحليل وضعية العمل) : نقطة انطلاق التصميم. يغذي RMC.`,

    en: `APC REFERENCE — OFFICIAL GLOSSARY (Algerian context) :

- Competency-Based Approach (CBA/APC) : Curricular approach defining competencies required for a trade, transposed into training. 5 documents: RMC, PF, PE, RES, ROPM.
- Competency : Power to act/succeed/progress based on knowledge, skills, attitudes. Divided into Cp, Cg, predetermined competencies.
- Specific Competency (Cp) : Linked to RMC tasks. Operational core of the program. Achieves Goal 1.
- General Competency (Cg / Transversal) : Transferable to other situations. Goals 2, 3, 4 (integration, evolution, mobility).
- Predetermined Competency : Common to all programs (Situate oneself regarding the trade, Use IT tools, Search for a job, Integrate into the workplace).
- RMC (Trade and Competency Framework) : Detailed identity card of the trade. Part 1: trade description, Part 2: competencies. Derived from WSA.
- PF (Training Project) : Program structure: goals, competency list, matrix, correspondence table. Validated by official consultation.
- PE (Study Program) : Backbone. Operational objectives (OC/OS), modules, pedagogical suggestions, logigram.
- RES (Assessment and Certification Framework) : Assessment guidelines. 3 tools: Specification table, Test description, Evaluation sheet.
- ROPM (Pedagogical and Material Organization Framework) : Material resources, organization, HR, MAO, facility layout.
- Operational Objective : Translates competency into objectives. 2 types: behavioral (OC) and situational (OS).
- Behavioral Objective (OC) : Observable actions, measurable results. Assessed by practical test.
- Situational Objective (OS) : Socio-affective dimensions (expression, creativity, autonomy). 3-phase assessment.
- Module : Autonomous subdivision of the program. One module = one competency. MQ (qualifying) / MC (complementary).
- Competency Matrix : Table visualizing the entire project. Checks coverage without redundancy or gaps.
- Competency Logigram : Schematic representation of acquisition sequence. Prerequisites, parallelisms.
- Correspondence Table : Adequacy between needs (WSA) and responses (PF). Links RMC → PF.
- Work Process : 4-6 ordered steps, common to trade tasks. Identified in the RMC.
- Pedagogical Suggestions : Accompany each objective. Specific approach, formative assessment, enrichment, training objects, content elements.
- Training Objects : Essential learning for the competency. Planning starting point (not the lesson plan).
- Content Elements : Indicators of scope/limits of objects. Broad themes, nouns.
- Summative Assessment : End of module. Criterion-referenced, dichotomous (pass/fail), multidimensional. 5-10% of time.
- Formative Assessment : During the module. Guides the learner. Included in program time.
- Specification Table : Assessment objects, indicators, criteria, points, success threshold, verdict rule.
- Chronogram : Acquisition order + time distribution. Respects matrix, logigram, durations.
- Implantation Audit : Assessment of material resources to implement a program. Based on ROPM.
- Enrichment : Activities for advanced learners. Tightens conditions and criteria. Within competency limits.
- Remediation and Retake : Learner's right in case of failure. Managed by the National Assessment System.
- Instrumental Values : Rigor (reliability), coherence (validity), transparency, feasibility.
- MAO (Furniture, Equipment, Tools) : Material resources categorization (Cat. 1-5). ROPM basis.
- Official Consultation (Homologation) : Formal consultation of PF before writing the PE.
- General FP Goals : Goal 1 (trade efficiency), Goal 2 (professional integration), Goal 3 (evolution), Goal 4 (mobility).
- WSA (Work Situation Analysis) : Design starting point. Feeds the RMC.`
};