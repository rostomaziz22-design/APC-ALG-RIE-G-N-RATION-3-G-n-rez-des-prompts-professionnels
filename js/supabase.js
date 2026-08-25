'use strict'; console.log('✅ supabase.js CHARGÉ');
const SUPABASE_URL = 'https://zheglrzqzwopcfsdbztc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_fbnRXgRq0ipF-Y97PEZYCw_pheHamr7';
let supabaseClient = null;
let currentUser = null;
let currentProfile = null;
function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.warn('Supabase SDK non chargé');
        return;
    }
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    if (window.location.pathname.includes('login.html')) return;
    checkSession();
}
function showAppContent() {
    var loader = document.getElementById('app-loader');
    var content = document.getElementById('app-content');
    if (loader) loader.classList.add('hidden');
    if (content) content.classList.add('visible');
    setTimeout(checkProfileCompletion, 500);
}
function changePassword() {
    var oldPwd = document.getElementById('oldPassword').value;
    var newPwd1 = document.getElementById('newPassword1').value;
    var newPwd2 = document.getElementById('newPassword2').value;
    var el = document.getElementById('changePwdResult');
    var email = currentUser ? currentUser.email : null;
    if (!oldPwd || !newPwd1 || !newPwd2) {
        el.textContent = '❌ Veuillez remplir tous les champs.'; el.className = 'result-msg error'; el.style.display = 'block'; return;
    }
    if (newPwd1.length < 8 || !/[A-Z]/.test(newPwd1) || !/[0-9]/.test(newPwd1) || !/[^A-Za-z0-9]/.test(newPwd1)) {
        el.textContent = '❌ 8 caractères minimum, 1 majuscule, 1 chiffre, 1 caractère spécial requis.'; el.className = 'result-msg error'; el.style.display = 'block'; return;
    }
    if (newPwd1 !== newPwd2) {
        el.textContent = '❌ Les nouveaux mots de passe ne correspondent pas.'; el.className = 'result-msg error'; el.style.display = 'block'; return;
    }
    if (!supabaseClient || !email) { el.textContent = '❌ Vous devez être connecté.'; el.className = 'result-msg error'; el.style.display = 'block'; return; }
    el.textContent = '⏳ Vérification...'; el.className = 'result-msg info'; el.style.display = 'block';
    supabaseClient.auth.signInWithPassword({ email: email, password: oldPwd }).then(function(resp) {
        if (resp.error) {
            el.textContent = '❌ Ancien mot de passe incorrect.'; el.className = 'result-msg error'; return;
        }
        supabaseClient.auth.updateUser({ password: newPwd1 }).then(function(upd) {
            if (upd.error) {
                el.textContent = '❌ ' + upd.error.message; el.className = 'result-msg error'; return;
            }
            el.textContent = '✅ Mot de passe changé avec succès !'; el.className = 'result-msg success';
            document.getElementById('oldPassword').value = '';
            document.getElementById('newPassword1').value = '';
            document.getElementById('newPassword2').value = '';
            setTimeout(function() { document.getElementById('changePwdModal').classList.remove('open'); }, 1500);
        });
    });
}
function checkProfileCompletion() {
    if (!currentProfile) return;
    var missing = [];
    if (!currentProfile.full_name_ar) missing.push('Nom en arabe');
    if (!currentProfile.specialite) missing.push('Spécialité');
    if (missing.length === 0) return;
    var overlay = document.getElementById('profileOverlay');
    if (overlay) overlay.classList.add('open');
}
function openEditProfile() {
    var overlay = document.getElementById('profileOverlay');
    var title = overlay.querySelector('h2');
    var sub = overlay.querySelector('p');
    if (title) title.textContent = '👤 Modifier mon profil';
    if (sub) sub.style.display = 'none';
    var fn = document.getElementById('profileFullName');
    var na = document.getElementById('profileNameAr');
    var sp = document.getElementById('profileSpecialite');
    if (fn) fn.value = currentProfile?.full_name || '';
    if (na) na.value = currentProfile?.full_name_ar || '';
    if (sp) sp.value = currentProfile?.specialite || '';
    var el = document.getElementById('profileResult');
    if (el) { el.style.display = 'none'; el.textContent = ''; }
    overlay.querySelector('button')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    overlay.classList.add('open');
}
async function saveProfileCompletion() {
    var fullName = document.getElementById('profileFullName').value.trim();
    var nameAr = document.getElementById('profileNameAr').value.trim();
    var spec = document.getElementById('profileSpecialite').value.trim();
    var el = document.getElementById('profileResult');
    if (!fullName || !nameAr || !spec) {
        el.textContent = '❌ Veuillez remplir tous les champs.';
        el.style.display = 'block';
        return;
    }
    el.style.display = 'none';
    if (!supabaseClient || !currentUser) return;
    var resp = await supabaseClient.from('profiles').update({ full_name: fullName, full_name_ar: nameAr, specialite: spec }).eq('id', currentUser.id);
    if (resp.error) { el.textContent = '❌ ' + resp.error.message; el.style.display = 'block'; return; }
    var changed = {};
    if (currentProfile.full_name !== fullName) changed.full_name = { from: currentProfile.full_name, to: fullName };
    if (currentProfile.full_name_ar !== nameAr) changed.full_name_ar = { from: currentProfile.full_name_ar, to: nameAr };
    if (currentProfile.specialite !== spec) changed.specialite = { from: currentProfile.specialite, to: spec };
    currentProfile.full_name = fullName;
    currentProfile.full_name_ar = nameAr;
    currentProfile.specialite = spec;
    document.getElementById('profileOverlay').classList.remove('open');
    updateAuthUI();
    if (Object.keys(changed).length > 0) await logActivity('profile_update', { changes: changed });
}
function setRememberMe(val) {
    console.log('setRememberMe', val);
    if (val) {
        localStorage.removeItem('rm');
        sessionStorage.removeItem('rm_ok');
    } else {
        localStorage.setItem('rm', '0');
        sessionStorage.setItem('rm_ok', '1');
    }
    console.log('localStorage.rm:', localStorage.getItem('rm'));
    console.log('sessionStorage.rm_ok:', sessionStorage.getItem('rm_ok'));
}
async function checkSession() {
    if (!supabaseClient) return;
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (session?.user) {
        currentUser = session.user;
        await loadProfile();
        var rm = localStorage.getItem('rm');
        var rm_ok = sessionStorage.getItem('rm_ok');
        console.log('checkSession: session ok, rm=', rm, 'rm_ok=', rm_ok);
        if (rm === '0' && rm_ok !== '1') {
            console.log('checkSession: REMEMBER OFF + new tab → signOut');
            try {
                await supabaseClient.auth.signOut();
            } catch(e) { console.error('signOut error', e); }
            currentUser = null;
            currentProfile = null;
            window.location.href = 'login.html';
            return;
        }
    } else {
        console.log('checkSession: pas de session');
    }
    updateAuthUI();
    if (!currentUser) {
        var isLearnerQuiz = window.location.pathname.includes('quiz.html')
            && (window.location.href.match(/[?&]code=/) || window.location.hash.match(/code=/) || window.location.hash.match(/data=/));
        if (isLearnerQuiz) {
            document.documentElement.classList.add('lm');
            showAppContent();
            return;
        }
        window.location.href = 'login.html';
        return;
    }
    showAppContent();
}
async function signUp(email, password, fullName) {
    if (!supabaseClient) throw new Error('Supabase non initialisé');
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
        currentUser = data.user;
        await supabaseClient.from('profiles').insert({
            id: data.user.id,
            full_name: fullName || email.split('@')[0],
            role: 'formateur'
        });
        currentProfile = { full_name: fullName || email.split('@')[0], role: 'formateur' };
        updateAuthUI();
    }
    return data;
}
async function signIn(email, password) {
    if (!supabaseClient) throw new Error('Supabase non initialisé');
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
        currentUser = data.user;
        await loadProfile();
        updateAuthUI();
        var sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
        sessionStorage.setItem('session_id', sid);
        await logActivity('login', { session_id: sid });
    }
    return data;
}
async function signOut() {
    if (!supabaseClient) return;
    var nom = currentProfile?.full_name || currentUser?.email || '';
    var nomAr = currentProfile?.full_name_ar || '';
    var sid = sessionStorage.getItem('session_id') || '';
    await logActivity('logout', { session_id: sid });
    sessionStorage.removeItem('session_id');
    await supabaseClient.auth.signOut();
    currentUser = null;
    currentProfile = null;
    localStorage.removeItem('ai_conversations');
    localStorage.removeItem('current_conv_id');
    sessionStorage.removeItem('pending_prompt');
    sessionStorage.removeItem('pending_options');
    sessionStorage.removeItem('generator_form');
    localStorage.removeItem('gammaData');
    localStorage.removeItem('saved_pass');
    // 🔐 Isolement multi-comptes : vider la mémoire AXON locale du compte courant
    // (la vraie mémoire reste dans Supabase, rechargée au prochain login).
    ['axon_user','axon_conversation','axon_knowledge','axon_corrections','axon_documents','axon_statistics','axon_cache'].forEach(function(k) {
        localStorage.removeItem(k);
    });
    localStorage.removeItem('axon_owner');

    // Effet déconnexion : écran noir + message + barre colorée
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:99998;opacity:0;animation:fadeOverlayIn .3s ease forwards;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    var lang = localStorage.getItem('lang') || 'fr';
    if (lang === 'ar' && nomAr) nom = nomAr;
    var byeText = lang === 'ar' ? 'إلى اللقاء' : lang === 'en' ? 'See you soon' : 'À bientôt';
    var assistantText = lang === 'ar' ? 'مساعد الذكاء الاصطناعي البيداغوجي الخاص بك' : lang === 'en' ? 'Your AI Pedagogy Assistant' : 'Votre Assistant IA de pédagogie';
    var msg = document.createElement('div');
    msg.innerHTML = '<div style="font-size:.9rem;color:rgba(255,255,255,.5);margin-bottom:4px;">' + byeText + ' ' + nom + '</div><strong style="font-size:1.2rem;color:#fff;">' + assistantText + '</strong>';
    msg.style.cssText = 'font-family:Segoe UI,system-ui,sans-serif;letter-spacing:.3px;margin-bottom:24px;text-align:center;line-height:1.6;animation:fadeMsgIn .6s ease forwards;';
    var bar = document.createElement('div');
    bar.style.cssText = 'width:95%;height:4px;background:linear-gradient(90deg,#006233,#FFFFFF,#D21034,#006233,#FFFFFF,#D21034);background-size:300% 100%;animation:barOut 3s ease-in-out forwards;border-radius:2px;';
    var style = document.createElement('style');
    style.textContent = '@keyframes barOut{0%{background-position:0% 50%;opacity:1;width:95%}25%{background-position:100% 50%;opacity:1;width:95%}50%{background-position:200% 50%;opacity:1;width:95%}75%{opacity:1;width:95%}100%{background-position:300% 50%;opacity:0;width:0}}@keyframes fadeOverlayIn{to{opacity:1}}@keyframes fadeMsgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(style);
    overlay.appendChild(msg);
    overlay.appendChild(bar);
    document.body.appendChild(overlay);

    setTimeout(function() { window.location.href = 'login.html'; }, 3000);
}
async function resetPassword(email) {
    if (!supabaseClient) throw new Error('Supabase non initialisé');
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.href
    });
    if (error) throw error;
}
async function updatePassword(newPassword) {
    if (!supabaseClient) throw new Error('Supabase non initialisé');
    const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
    if (error) throw error;
}
async function loadProfile() {
    if (!supabaseClient || !currentUser) return;
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', currentUser.id).single();
    if (!error && data) currentProfile = data;
}
function updateAuthUI() {
    document.querySelectorAll('.auth-state').forEach(el => {
        if (currentUser) {
            const lang = document.documentElement?.lang || 'fr';
            const nomAr = currentProfile?.full_name_ar || '';
            const name = (lang === 'ar' && nomAr) ? nomAr : (currentProfile?.full_name || currentUser.email);
el.innerHTML = `<span class="auth-user">👤 ${name}</span> <button class="btn-icon" title="${lang === 'ar' ? 'تسجيل الخروج' : lang === 'en' ? 'Log out' : 'Déconnexion'}" onclick="signOut()">🚪</button>`;
        } else {
            el.innerHTML = '';
        }
    });
    document.querySelectorAll('.nav-admin-link').forEach(el => {
        el.style.display = currentProfile?.role === 'admin' ? '' : 'none';
    });
    localStorage.setItem('isAdmin', currentProfile?.role === 'admin' ? 'true' : 'false');
    if (currentUser) localStorage.setItem('sb_user_id', currentUser.id);
}
async function saveCourse(data) {
    if (!supabaseClient || !currentUser) throw new Error('Connectez-vous pour sauvegarder');
    const { data: result, error } = await supabaseClient.from('courses').insert({
        user_id: currentUser.id,
        speciality_id: data.speciality_id || null,
        module_id: data.module_id || null,
        competence_id: data.competence_id || null,
        title: data.title,
        content: data.content,
        visibility: data.visibility || 'public',
        tags: data.tags || []
    }).select().single();
    if (error) throw error;
    return result;
}
async function updateCourse(id, data) {
    if (!supabaseClient || !currentUser) throw new Error('Connectez-vous');
    const { error } = await supabaseClient.from('courses').update({
        title: data.title,
        content: data.content,
        visibility: data.visibility,
        tags: data.tags,
        updated_at: new Date().toISOString()
    }).eq('id', id).eq('user_id', currentUser.id);
    if (error) throw error;
}
async function deleteCourse(id) {
    if (!supabaseClient || !currentUser) throw new Error('Connectez-vous');
    const { error } = await supabaseClient.from('courses').delete().eq('id', id).eq('user_id', currentUser.id);
    if (error) throw error;
}
async function getCourses(filters = {}) {
    if (!supabaseClient) return [];
    let query = supabaseClient.from('courses').select('*, specialities(name), modules(name), competences(description), profiles(full_name)');
    if (filters.visibility === 'public' && !currentUser) {
        query = query.eq('visibility', 'public');
    } else if (currentUser) {
        query = query.or('visibility.eq.public,user_id.eq.' + currentUser.id.replace(/[^0-9a-f-]/gi, ''));
    } else {
        query = query.eq('visibility', 'public');
    }
    if (filters.speciality_id) query = query.eq('speciality_id', filters.speciality_id);
    if (filters.module_id) query = query.eq('module_id', filters.module_id);
    if (filters.competence_id) query = query.eq('competence_id', filters.competence_id);
    if (filters.search) query = query.ilike('title', `%${filters.search}%`);
    query = query.order('created_at', { ascending: false }).limit(filters.limit || 50);
    const { data, error } = await query;
    if (error) { console.error(error); return []; }
    return data;
}
async function getCourse(id) {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient.from('courses').select('*, specialities(name), modules(name), competences(description), profiles(full_name)').eq('id', id).single();
    if (error) { console.error(error); return null; }
    return data;
}
async function saveScenario(data) {
    if (!supabaseClient || !currentUser) throw new Error('Connectez-vous');
    const { data: result, error } = await supabaseClient.from('scenarios').insert({
        user_id: currentUser.id,
        speciality_id: data.speciality_id || null,
        module_id: data.module_id || null,
        competence_id: data.competence_id || null,
        title: data.title,
        content: data.content
    }).select().single();
    if (error) throw error;
    return result;
}
async function getScenarios() {
    if (!supabaseClient || !currentUser) return [];
    const { data, error } = await supabaseClient.from('scenarios').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data;
}
async function savePresentation(data) {
    if (!supabaseClient || !currentUser) throw new Error('Connectez-vous');
    const { data: result, error } = await supabaseClient.from('presentations').insert({
        user_id: currentUser.id,
        source_course_id: data.source_course_id || null,
        title: data.title,
        slides: data.slides
    }).select().single();
    if (error) throw error;
    return result;
}
async function getPresentations() {
    if (!supabaseClient || !currentUser) return [];
    const { data, error } = await supabaseClient.from('presentations').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data;
}
async function saveGeneratedImage(data) {
    if (!supabaseClient || !currentUser) return null;
    const { data: result, error } = await supabaseClient.from('generated_images').insert({
        user_id: currentUser.id,
        course_id: data.course_id || null,
        prompt: data.prompt,
        image_url: data.image_url,
        tags: data.tags || [],
        visibility: data.visibility || 'public'
    }).select().single();
    if (error) { console.error(error); return null; }
    return result;
}
async function getGeneratedImages(filters = {}) {
    if (!supabaseClient) return [];
    let query = supabaseClient.from('generated_images').select('*, profiles(full_name)');
    if (currentUser) {
        query = query.or('visibility.eq.public,user_id.eq.' + currentUser.id.replace(/[^0-9a-f-]/gi, ''));
    } else {
        query = query.eq('visibility', 'public');
    }
    query = query.order('created_at', { ascending: false }).limit(filters.limit || 50);
    const { data, error } = await query;
    if (error) { console.error(error); return []; }
    return data;
}
async function toggleFavorite(courseId) {
    if (!supabaseClient || !currentUser) throw new Error('Connectez-vous');
    const existing = await supabaseClient.from('course_favorites').select('id').eq('user_id', currentUser.id).eq('course_id', courseId).single();
    if (existing.data) {
        await supabaseClient.from('course_favorites').delete().eq('id', existing.data.id);
        return false;
    } else {
        await supabaseClient.from('course_favorites').insert({ user_id: currentUser.id, course_id: courseId });
        return true;
    }
}
async function getFavorites() {
    if (!supabaseClient || !currentUser) return [];
    const { data, error } = await supabaseClient.from('course_favorites').select('*, courses(*)').eq('user_id', currentUser.id);
    if (error) { console.error(error); return []; }
    return data;
}
async function isFavorite(courseId) {
    if (!supabaseClient || !currentUser) return false;
    const { data } = await supabaseClient.from('course_favorites').select('id').eq('user_id', currentUser.id).eq('course_id', courseId).maybeSingle();
    return !!data;
}
async function getSpecialities() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient.from('specialities').select('*').order('name');
    if (error) { console.error(error); return []; }
    return data;
}
async function getModules(specialityId) {
    if (!supabaseClient) return [];
    let query = supabaseClient.from('modules').select('*').order('name');
    if (specialityId) query = query.eq('speciality_id', specialityId);
    const { data, error } = await query;
    if (error) { console.error(error); return []; }
    return data;
}
async function getCompetences(moduleId) {
    if (!supabaseClient) return [];
    let query = supabaseClient.from('competences').select('*');
    if (moduleId) query = query.eq('module_id', moduleId);
    const { data, error } = await query;
    if (error) { console.error(error); return []; }
    return data;
}
async function getPromptExamples() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient.from('prompts_examples').select('*').eq('active', true).order('sort_order', { ascending: true }).order('id', { ascending: true });
    if (error) { console.error('getPromptExamples error:', error); return []; }
    return data || [];
}
async function savePromptExample(data) {
    if (!supabaseClient || !currentUser) throw new Error('Connectez-vous');
    const { data: result, error } = await supabaseClient.from('prompts_examples').insert({
        icon: data.icon || '📝',
        name_fr: data.name_fr, name_ar: data.name_ar,
        role_fr: data.role_fr, role_ar: data.role_ar,
        mission_fr: data.mission_fr, mission_ar: data.mission_ar,
        specialite_fr: data.specialite_fr, specialite_ar: data.specialite_ar,
        module_fr: data.module_fr, module_ar: data.module_ar,
        competence_fr: data.competence_fr, competence_ar: data.competence_ar,
        niveau_fr: data.niveau_fr, niveau_ar: data.niveau_ar,
        annee_fr: data.annee_fr || '', annee_ar: data.annee_ar || '',
        duree_fr: data.duree_fr || '', duree_ar: data.duree_ar || '',
        stagiaires: data.stagiaires || '',
        espace_fr: data.espace_fr || '', espace_ar: data.espace_ar || '',
        ressources_fr: data.ressources_fr || '', ressources_ar: data.ressources_ar || '',
        contexte_fr: data.contexte_fr || '', contexte_ar: data.contexte_ar || '',
        difficultes_fr: data.difficultes_fr || '', difficultes_ar: data.difficultes_ar || '',
        astMetier_fr: data.astMetier_fr || '', astMetier_ar: data.astMetier_ar || '',
        astExtrait_fr: data.astExtrait_fr || '', astExtrait_ar: data.astExtrait_ar || '',
        sort_order: data.sort_order || 0,
        active: data.active !== false
    }).select().single();
    if (error) throw error;
    return result;
}
async function updatePromptExample(id, data) {
    if (!supabaseClient || !currentUser) throw new Error('Connectez-vous');
    const { data: result, error } = await supabaseClient.from('prompts_examples').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
}
async function deletePromptExample(id) {
    if (!supabaseClient || !currentUser) throw new Error('Connectez-vous');
    const { error } = await supabaseClient.from('prompts_examples').delete().eq('id', id);
    if (error) throw error;
}
async function logActivity(eventType, extra) {
    if (!supabaseClient || !currentUser) return;
    try {
        var payload = { user_id: currentUser.id, event_type: eventType, details: extra || {} };
        if (extra && extra.session_id) { payload.session_id = extra.session_id; delete payload.details.session_id; }
        await supabaseClient.from('user_activity_log').insert(payload);
    } catch (e) { console.warn('logActivity error:', e); }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}