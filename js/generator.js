'use strict';
        document.getElementById('copyBtn')?.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(buildPrompt()); } catch (e) {
                const ta = document.createElement('textarea');
                ta.value = buildPrompt();
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            showToast(t('copied'));
        });
        const FORM_IDS = ['roleIA','missionIA','specialite','module','competence','niveau','annee','duree','stagiaires','espace','ressources','contexte','difficultes','astMetier','astExtrait'];
        function saveFormState() {
            const vals = {};
            FORM_IDS.forEach(id => { const el = document.getElementById(id); if (el) vals[id] = el.value; });
            vals.astToggle = document.getElementById('astToggle')?.checked || false;
            vals.options = {};
            for (let k in options) vals.options[k] = options[k];
            sessionStorage.setItem('generator_form', JSON.stringify(vals));
        }
        function restoreFormState() {
            const saved = sessionStorage.getItem('generator_form');
            if (!saved) return;
            try {
                const vals = JSON.parse(saved);
                FORM_IDS.forEach(id => { const el = document.getElementById(id); if (el && vals[id] !== undefined) el.value = vals[id]; });
                if (vals.astToggle) { document.getElementById('astToggle').checked = true; document.getElementById('astPanel')?.classList.add('visible'); }
                if (vals.options) { for (let k in vals.options) options[k] = vals.options[k]; }
            } catch (e) {}
        }
        document.querySelectorAll('#roleIA, #missionIA, #specialite, #module, #competence, #niveau, #annee, #duree, #stagiaires, #espace, #ressources, #contexte, #difficultes, #astMetier, #astExtrait').forEach(el => {
            const orig = el.oninput;
            el.oninput = function(e) { if (orig) orig.call(this, e); saveFormState(); };
        });
        function exportHeader() {
            return currentLang === 'fr'
                ? '=== APC ALGÉRIE GÉNÉRATION 3 ===\nFormateur 2.0\nLe formateur augmenté par l\'IA\nAssistant intelligent de conception pédagogique selon l\'Approche Par Compétences (APC).\n\n'
                : currentLang === 'en' ? '=== APC ALGERIA GENERATION 3 ===\nTrainer 2.0 – Intelligent APC instructional design assistant\n\n'
                : '=== APC الجزائر الجيل 3 ===\nالمكوِّن 2.0 – المساعد الذكي لتصميم السيناريوهات البيداغوجية\n\n';
        }
        document.getElementById('txtBtn')?.addEventListener('click', () => {
            const content = exportHeader() + buildPrompt();
            const blob = new Blob([content], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'prompt_apc.txt';
            a.click();
        });
        document.getElementById('docBtn')?.addEventListener('click', () => {
            const content = exportHeader() + buildPrompt();
            const blob = new Blob(
                [`<html><body><pre style="font-size:11pt;font-family:Courier New">${esc(content)}</pre></body></html>`],
                { type: 'application/msword' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'prompt_apc.doc';
            a.click();
        });
        document.getElementById('pdfBtn')?.addEventListener('click', () => {
            const content = exportHeader() + buildPrompt();
            var safeContent = document.createElement('div');
            safeContent.textContent = content;
            var htmlContent = '<html><head><meta charset="utf-8"><title>APC Algérie G3 - Prompt</title></head><body><pre style="font-family:monospace;font-size:10pt">' + safeContent.innerHTML + '</pre></body></html>';
            var blob = new Blob([htmlContent], { type: 'text/html' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'prompt_apc.html';
            a.click();
            URL.revokeObjectURL(a.href);
        });
        document.getElementById('resetBtn')?.addEventListener('click', () => {
            showConfirmModal(currentLang === 'fr' ? 'Réinitialiser tous les champs ?' : currentLang === 'en' ? 'Reset all fields?' : 'إعادة تعيين جميع الحقول؟', function() {
            ['roleIA', 'missionIA', 'specialite', 'module', 'competence', 'niveau', 'annee', 'duree', 'stagiaires', 'espace',
                'ressources', 'contexte', 'difficultes', 'astMetier', 'astExtrait'
            ].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            for (let k in options) options[k] = false;
            document.getElementById('astToggle').checked = false;
            document.getElementById('astPanel').classList.remove('visible');
            selectedExample = null;
            document.getElementById('gammaSearchResults').innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:12px;">🔍 Tapez votre recherche</div>';
            renderOptions();
            renderExamples();
            updatePrompt();
            });
        });
        document.getElementById('sendToAIBtn')?.addEventListener('click', () => {
            const p = buildPrompt();
            if (p.includes('Remplissez les champs') || p.includes('أَدخِل البيانات')) {
                showToast("Veuillez d'abord remplir les champs pour générer un prompt.");
                return;
            }
            sessionStorage.setItem('pending_prompt', p);
            sessionStorage.setItem('pending_options', JSON.stringify(options));
            goTo('assistant.html');
        });
        document.getElementById('aboutBtn')?.addEventListener('click', () => {
            goTo('about.html');
        });
        document.getElementById('saveCourseBtn')?.addEventListener('click', async () => {
            const p = buildPrompt();
            if (p.includes('Remplissez les champs') || p.includes('أَدخِل البيانات')) {
                showToast("Veuillez d'abord remplir les champs.");
                return;
            }
            try {
                const data = {
                    speciality_id: document.getElementById('specialite')?.value || null,
                    module_id: document.getElementById('module')?.value || null,
                    competence_id: document.getElementById('competence')?.value || null,
                    title: 'Cours ' + (document.getElementById('module')?.value || 'Sans titre'),
                    content: { prompt: p, form: {} }
                };
                FORM_IDS.forEach(id => { const el = document.getElementById(id); if (el) data.content.form[id] = el.value; });
                const result = await saveCourse(data);
                showToast('✅ Cours sauvegardé !');
            } catch (e) {
                showToast('❌ ' + e.message);
            }
        });
restoreFormState();
setLang(currentLang);
renderExamples();
renderOptions();
updatePrompt();