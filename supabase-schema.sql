-- ============================================================
-- APC Algérie G3 - Schéma Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase (SQL Editor)
-- ------------------------------------------------------------
-- Version applicative de référence : 1.9.6 (28/10/2026)
-- Idempotent : ré-exécutable sans risque
--   (CREATE ... IF NOT EXISTS, ADD COLUMN IF NOT EXISTS et
--    DROP POLICY IF EXISTS avant chaque CREATE POLICY).
-- 23 tables + 2 sections de migration (24 et 25).
-- Journal des versions et des correctifs : AGENTS.md +
-- RAPPORT_PLATEFORME.md (racine du projet).
-- ============================================================

-- 1. Profiles (extension user_profiles)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'formateur' CHECK (role IN ('formateur', 'inspecteur', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Référentiel : Spécialités
CREATE TABLE IF NOT EXISTS specialities (
    id BIGSERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_ar TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE specialities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "specialities_read_all" ON specialities;
CREATE POLICY "specialities_read_all" ON specialities FOR SELECT USING (true);

-- 3. Référentiel : Modules
CREATE TABLE IF NOT EXISTS modules (
    id BIGSERIAL PRIMARY KEY,
    speciality_id BIGINT REFERENCES specialities(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_ar TEXT,
    coefficient REAL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "modules_read_all" ON modules;
CREATE POLICY "modules_read_all" ON modules FOR SELECT USING (true);

-- 4. Référentiel : Compétences
CREATE TABLE IF NOT EXISTS competences (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT REFERENCES modules(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    description_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, code)
);

ALTER TABLE competences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "competences_read_all" ON competences;
CREATE POLICY "competences_read_all" ON competences FOR SELECT USING (true);

-- 5. Cours
CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    speciality_id BIGINT REFERENCES specialities(id),
    module_id BIGINT REFERENCES modules(id),
    competence_id BIGINT REFERENCES competences(id),
    title TEXT NOT NULL,
    content JSONB,
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "courses_select" ON courses;
CREATE POLICY "courses_select" ON courses FOR SELECT USING (
    visibility = 'public' OR user_id = auth.uid()
);
DROP POLICY IF EXISTS "courses_insert" ON courses;
CREATE POLICY "courses_insert" ON courses FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "courses_update" ON courses;
CREATE POLICY "courses_update" ON courses FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "courses_delete" ON courses;
CREATE POLICY "courses_delete" ON courses FOR DELETE USING (auth.uid() = user_id);

-- 6. Scénarios pédagogiques
CREATE TABLE IF NOT EXISTS scenarios (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    speciality_id BIGINT REFERENCES specialities(id),
    module_id BIGINT REFERENCES modules(id),
    competence_id BIGINT REFERENCES competences(id),
    title TEXT NOT NULL,
    content JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scenarios_select" ON scenarios;
CREATE POLICY "scenarios_select" ON scenarios FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "scenarios_insert" ON scenarios;
CREATE POLICY "scenarios_insert" ON scenarios FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "scenarios_update" ON scenarios;
CREATE POLICY "scenarios_update" ON scenarios FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "scenarios_delete" ON scenarios;
CREATE POLICY "scenarios_delete" ON scenarios FOR DELETE USING (auth.uid() = user_id);

-- 7. Présentations (Gamma slides)
CREATE TABLE IF NOT EXISTS presentations (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    source_course_id BIGINT REFERENCES courses(id),
    title TEXT NOT NULL,
    slides JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "presentations_select" ON presentations;
CREATE POLICY "presentations_select" ON presentations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "presentations_insert" ON presentations;
CREATE POLICY "presentations_insert" ON presentations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "presentations_update" ON presentations;
CREATE POLICY "presentations_update" ON presentations FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "presentations_delete" ON presentations;
CREATE POLICY "presentations_delete" ON presentations FOR DELETE USING (auth.uid() = user_id);

-- 8. Images générées
CREATE TABLE IF NOT EXISTS generated_images (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES courses(id),
    prompt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "images_select" ON generated_images;
CREATE POLICY "images_select" ON generated_images FOR SELECT USING (
    visibility = 'public' OR user_id = auth.uid()
);
DROP POLICY IF EXISTS "images_insert" ON generated_images;
CREATE POLICY "images_insert" ON generated_images FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "images_delete" ON generated_images;
CREATE POLICY "images_delete" ON generated_images FOR DELETE USING (auth.uid() = user_id);

-- 9. Exemples de prompts (section 3 du générateur)
CREATE TABLE IF NOT EXISTS prompts_examples (
    id BIGSERIAL PRIMARY KEY,
    icon TEXT DEFAULT '📝',
    name_fr TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    role_fr TEXT NOT NULL,
    role_ar TEXT NOT NULL,
    mission_fr TEXT NOT NULL,
    mission_ar TEXT NOT NULL,
    specialite_fr TEXT NOT NULL,
    specialite_ar TEXT NOT NULL,
    module_fr TEXT NOT NULL,
    module_ar TEXT NOT NULL,
    competence_fr TEXT NOT NULL,
    competence_ar TEXT NOT NULL,
    niveau_fr TEXT NOT NULL,
    niveau_ar TEXT NOT NULL,
    annee_fr TEXT DEFAULT '',
    annee_ar TEXT DEFAULT '',
    duree_fr TEXT DEFAULT '',
    duree_ar TEXT DEFAULT '',
    stagiaires TEXT DEFAULT '',
    espace_fr TEXT DEFAULT '',
    espace_ar TEXT DEFAULT '',
    ressources_fr TEXT DEFAULT '',
    ressources_ar TEXT DEFAULT '',
    contexte_fr TEXT DEFAULT '',
    contexte_ar TEXT DEFAULT '',
    difficultes_fr TEXT DEFAULT '',
    difficultes_ar TEXT DEFAULT '',
    astMetier_fr TEXT DEFAULT '',
    astMetier_ar TEXT DEFAULT '',
    astExtrait_fr TEXT DEFAULT '',
    astExtrait_ar TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE prompts_examples ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "examples_select_all" ON prompts_examples;
CREATE POLICY "examples_select_all" ON prompts_examples FOR SELECT USING (true);
DROP POLICY IF EXISTS "examples_insert_admin" ON prompts_examples;
CREATE POLICY "examples_insert_admin" ON prompts_examples FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
DROP POLICY IF EXISTS "examples_update_admin" ON prompts_examples;
CREATE POLICY "examples_update_admin" ON prompts_examples FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
DROP POLICY IF EXISTS "examples_delete_admin" ON prompts_examples;
CREATE POLICY "examples_delete_admin" ON prompts_examples FOR DELETE USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- 10. Favoris des cours
CREATE TABLE IF NOT EXISTS course_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

ALTER TABLE course_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favs_select" ON course_favorites;
CREATE POLICY "favs_select" ON course_favorites FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "favs_insert" ON course_favorites;
CREATE POLICY "favs_insert" ON course_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "favs_delete" ON course_favorites;
CREATE POLICY "favs_delete" ON course_favorites FOR DELETE USING (auth.uid() = user_id);

-- 11. Quiz publiés (cross-device)
CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'Quiz',
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quizzes_select_public" ON quizzes;
CREATE POLICY "quizzes_select_public" ON quizzes FOR SELECT USING (true);
DROP POLICY IF EXISTS "quizzes_insert_public" ON quizzes;
CREATE POLICY "quizzes_insert_public" ON quizzes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "quizzes_update_owner" ON quizzes;
CREATE POLICY "quizzes_update_owner" ON quizzes FOR UPDATE USING (auth.uid() = user_id);

-- 12. Tentatives de quiz (cross-device)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id BIGSERIAL PRIMARY KEY,
    quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_attempts_select_public" ON quiz_attempts;
CREATE POLICY "quiz_attempts_select_public" ON quiz_attempts FOR SELECT USING (true);
DROP POLICY IF EXISTS "quiz_attempts_insert_public" ON quiz_attempts;
CREATE POLICY "quiz_attempts_insert_public" ON quiz_attempts FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_courses_user ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_module ON courses(module_id);
CREATE INDEX IF NOT EXISTS idx_courses_visibility ON courses(visibility);
CREATE INDEX IF NOT EXISTS idx_modules_speciality ON modules(speciality_id);
CREATE INDEX IF NOT EXISTS idx_competences_module ON competences(module_id);
CREATE INDEX IF NOT EXISTS idx_presentations_user ON presentations(user_id);
CREATE INDEX IF NOT EXISTS idx_images_user ON generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON course_favorites(user_id);

-- 13. Codes d'accès quiz (distribution individuelle)
-- Note: si la table existe déjà avec l'ancien schéma, exécutez d'abord :
--   ALTER TABLE quiz_access_codes ADD COLUMN IF NOT EXISTS student_name_fr TEXT DEFAULT '';
--   ALTER TABLE quiz_access_codes ADD COLUMN IF NOT EXISTS student_name_ar TEXT DEFAULT '';
--   ALTER TABLE quiz_access_codes ADD COLUMN IF NOT EXISTS specialty TEXT DEFAULT '';
--   ALTER TABLE quiz_access_codes ADD COLUMN IF NOT EXISTS groupe TEXT DEFAULT '';
--   ALTER TABLE quiz_access_codes ADD COLUMN IF NOT EXISTS trainer_name TEXT DEFAULT '';
--   ALTER TABLE quiz_access_codes ADD COLUMN IF NOT EXISTS trainer_email TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS quiz_access_codes (
    id BIGSERIAL PRIMARY KEY,
    quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_name_fr TEXT DEFAULT '',
    student_name_ar TEXT DEFAULT '',
    email TEXT DEFAULT '',
    specialty TEXT DEFAULT '',
    groupe TEXT DEFAULT '',
    code TEXT NOT NULL,
    link TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','used','expired')),
    trainer_name TEXT DEFAULT '',
    trainer_email TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quiz_access_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_access_codes_select_public" ON quiz_access_codes;
CREATE POLICY "quiz_access_codes_select_public" ON quiz_access_codes FOR SELECT USING (true);
DROP POLICY IF EXISTS "quiz_access_codes_insert_public" ON quiz_access_codes;
CREATE POLICY "quiz_access_codes_insert_public" ON quiz_access_codes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "quiz_access_codes_update_public" ON quiz_access_codes;
CREATE POLICY "quiz_access_codes_update_public" ON quiz_access_codes FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_access_codes_quiz ON quiz_access_codes(quiz_id);
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON quiz_access_codes(code);

-- Unique constraint on (quiz_id, code) to prevent duplicates from saveDistribData upsert
-- If duplicates exist, run this first:
--   DELETE FROM quiz_access_codes a WHERE a.id NOT IN (SELECT MAX(id) FROM quiz_access_codes GROUP BY quiz_id, code);
ALTER TABLE quiz_access_codes DROP CONSTRAINT IF EXISTS unique_quiz_code;
ALTER TABLE quiz_access_codes ADD CONSTRAINT unique_quiz_code UNIQUE (quiz_id, code);

-- 14. Fleurs du Jardin des compétences (challenge-plant)
--     Les colonnes participant_id / challenge_id sont ajoutées plus bas
--     (section 17bis) car challenge_participants et challenges sont créés après.
CREATE TABLE IF NOT EXISTS competence_flowers (
    id BIGSERIAL PRIMARY KEY,
    prenom TEXT NOT NULL DEFAULT '',
    nom TEXT NOT NULL DEFAULT '',
    competence TEXT NOT NULL DEFAULT '',
    specialite TEXT DEFAULT '',
    trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    score REAL DEFAULT 0,
    couleur_fleur TEXT DEFAULT '#ff88cc',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE competence_flowers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "flowers_insert_public" ON competence_flowers;
CREATE POLICY "flowers_insert_public" ON competence_flowers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "flowers_select_public" ON competence_flowers;
CREATE POLICY "flowers_select_public" ON competence_flowers FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_flowers_competence ON competence_flowers(competence);
CREATE INDEX IF NOT EXISTS idx_flowers_created ON competence_flowers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flowers_trainer ON competence_flowers(trainer_id);

-- ============================================================
-- 15. Challenges (gamification)
-- ============================================================

CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Challenge',
    type TEXT DEFAULT 'group' CHECK (type IN ('group','team','individual','tournament')),
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual','assistant')),
    theme TEXT DEFAULT '',
    speciality_id BIGINT REFERENCES specialities(id),
    module_id BIGINT REFERENCES modules(id),
    competence_id BIGINT REFERENCES competences(id),
    course_id BIGINT REFERENCES courses(id),
    config JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','closed')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "challenges_select_own" ON challenges;
CREATE POLICY "challenges_select_own" ON challenges FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "challenges_insert_own" ON challenges;
CREATE POLICY "challenges_insert_own" ON challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "challenges_update_own" ON challenges;
CREATE POLICY "challenges_update_own" ON challenges FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "challenges_delete_own" ON challenges;
CREATE POLICY "challenges_delete_own" ON challenges FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_challenges_user ON challenges(user_id);

-- 16. Équipes de challenge
CREATE TABLE IF NOT EXISTS challenge_teams (
    id BIGSERIAL PRIMARY KEY,
    challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_ar TEXT DEFAULT '',
    color TEXT DEFAULT '#0077CC',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE challenge_teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "challenge_teams_select" ON challenge_teams;
CREATE POLICY "challenge_teams_select" ON challenge_teams FOR SELECT USING (true);
DROP POLICY IF EXISTS "challenge_teams_insert" ON challenge_teams;
CREATE POLICY "challenge_teams_insert" ON challenge_teams FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM challenges WHERE id = challenge_id));
DROP POLICY IF EXISTS "challenge_teams_update" ON challenge_teams;
CREATE POLICY "challenge_teams_update" ON challenge_teams FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM challenges WHERE id = challenge_id));
DROP POLICY IF EXISTS "challenge_teams_delete" ON challenge_teams;
CREATE POLICY "challenge_teams_delete" ON challenge_teams FOR DELETE USING (auth.uid() IN (SELECT user_id FROM challenges WHERE id = challenge_id));

CREATE INDEX IF NOT EXISTS idx_teams_challenge ON challenge_teams(challenge_id);

-- 17. Participants au challenge (distribution, comme quiz_access_codes)
CREATE TABLE IF NOT EXISTS challenge_participants (
    id BIGSERIAL PRIMARY KEY,
    challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    team_id BIGINT REFERENCES challenge_teams(id) ON DELETE SET NULL,
    student_name_fr TEXT DEFAULT '',
    student_name_ar TEXT DEFAULT '',
    email TEXT DEFAULT '',
    specialty TEXT DEFAULT '',
    groupe TEXT DEFAULT '',
    code TEXT NOT NULL,
    link TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','used','expired')),
    score REAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "challenge_participants_select" ON challenge_participants;
CREATE POLICY "challenge_participants_select" ON challenge_participants FOR SELECT USING (true);
DROP POLICY IF EXISTS "challenge_participants_insert" ON challenge_participants;
CREATE POLICY "challenge_participants_insert" ON challenge_participants FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "challenge_participants_update" ON challenge_participants;
CREATE POLICY "challenge_participants_update" ON challenge_participants FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_participants_code ON challenge_participants(code);

ALTER TABLE challenge_participants DROP CONSTRAINT IF EXISTS unique_challenge_code;
ALTER TABLE challenge_participants ADD CONSTRAINT unique_challenge_code UNIQUE (challenge_id, code);

-- 17bis. Clés étrangères de competence_flowers (section 14) :
--        elles pointent vers des tables créées ici (challenge_participants)
--        et en section 15 (challenges) — d'où leur ajout après coup.
ALTER TABLE competence_flowers ADD COLUMN IF NOT EXISTS participant_id BIGINT REFERENCES challenge_participants(id) ON DELETE SET NULL;
ALTER TABLE competence_flowers ADD COLUMN IF NOT EXISTS challenge_id TEXT REFERENCES challenges(id) ON DELETE SET NULL;

-- 18. Épreuves / rounds du challenge
CREATE TABLE IF NOT EXISTS challenge_rounds (
    id BIGSERIAL PRIMARY KEY,
    challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Round',
    title_ar TEXT DEFAULT '',
    round_type TEXT DEFAULT 'quiz' CHECK (round_type IN ('quiz','practical','problem','case_study')),
    data JSONB DEFAULT '{}',
    max_score REAL DEFAULT 20,
    time_limit_seconds INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE challenge_rounds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "challenge_rounds_select" ON challenge_rounds;
CREATE POLICY "challenge_rounds_select" ON challenge_rounds FOR SELECT USING (true);
DROP POLICY IF EXISTS "challenge_rounds_insert" ON challenge_rounds;
CREATE POLICY "challenge_rounds_insert" ON challenge_rounds FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM challenges WHERE id = challenge_id));
DROP POLICY IF EXISTS "challenge_rounds_update" ON challenge_rounds;
CREATE POLICY "challenge_rounds_update" ON challenge_rounds FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM challenges WHERE id = challenge_id));
DROP POLICY IF EXISTS "challenge_rounds_delete" ON challenge_rounds;
CREATE POLICY "challenge_rounds_delete" ON challenge_rounds FOR DELETE USING (auth.uid() IN (SELECT user_id FROM challenges WHERE id = challenge_id));

CREATE INDEX IF NOT EXISTS idx_rounds_challenge ON challenge_rounds(challenge_id);

-- 19. Soumissions / résultats des participants
CREATE TABLE IF NOT EXISTS challenge_submissions (
    id BIGSERIAL PRIMARY KEY,
    round_id BIGINT NOT NULL REFERENCES challenge_rounds(id) ON DELETE CASCADE,
    participant_id BIGINT NOT NULL REFERENCES challenge_participants(id) ON DELETE CASCADE,
    team_id BIGINT REFERENCES challenge_teams(id) ON DELETE SET NULL,
    score REAL DEFAULT 0,
    data JSONB DEFAULT '{}',
    time_ms INTEGER DEFAULT 0,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "challenge_submissions_select" ON challenge_submissions;
CREATE POLICY "challenge_submissions_select" ON challenge_submissions FOR SELECT USING (true);
DROP POLICY IF EXISTS "challenge_submissions_insert" ON challenge_submissions;
CREATE POLICY "challenge_submissions_insert" ON challenge_submissions FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_submissions_round ON challenge_submissions(round_id);
CREATE INDEX IF NOT EXISTS idx_submissions_participant ON challenge_submissions(participant_id);

-- ============================================================
-- 20. Conversations Assistant IA (cross-device)
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    date TEXT DEFAULT '',
    time TEXT DEFAULT '',
    messages JSONB DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_conversations_select_own" ON ai_conversations;
CREATE POLICY "ai_conversations_select_own" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "ai_conversations_insert_own" ON ai_conversations;
CREATE POLICY "ai_conversations_insert_own" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "ai_conversations_update_own" ON ai_conversations;
CREATE POLICY "ai_conversations_update_own" ON ai_conversations FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "ai_conversations_delete_own" ON ai_conversations;
CREATE POLICY "ai_conversations_delete_own" ON ai_conversations FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON ai_conversations(user_id);

-- ============================================================
-- 21. Journal d'activité utilisateur (pour admin)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_activity_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('login', 'logout', 'profile_update')),
    session_id TEXT DEFAULT '',
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_log_insert_own" ON user_activity_log;
CREATE POLICY "activity_log_insert_own" ON user_activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "activity_log_select_own" ON user_activity_log;
CREATE POLICY "activity_log_select_own" ON user_activity_log FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_event ON user_activity_log(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_created ON user_activity_log(created_at DESC);

-- ============================================================
-- 22. Sauvegardes des jeux (multi-compte, cross-device)
-- ============================================================

CREATE TABLE IF NOT EXISTS game_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    game_type TEXT NOT NULL CHECK (game_type IN ('plant', 'defense', 'cards')),
    save_data JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "game_saves_select_own" ON game_saves;
CREATE POLICY "game_saves_select_own" ON game_saves FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "game_saves_insert_own" ON game_saves;
CREATE POLICY "game_saves_insert_own" ON game_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "game_saves_update_own" ON game_saves;
CREATE POLICY "game_saves_update_own" ON game_saves FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "game_saves_delete_own" ON game_saves;
CREATE POLICY "game_saves_delete_own" ON game_saves FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_game_saves_user ON game_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_type ON game_saves(game_type);

-- ============================================================
-- 23. AXON Intelligence Memory (persistante Supabase)
-- ============================================================

CREATE TABLE IF NOT EXISTS axon_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    store_type TEXT NOT NULL CHECK (store_type IN ('user','knowledge','corrections','documents','statistics','cache','conversation')),
    memory_key TEXT NOT NULL DEFAULT '',
    memory_value JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    confidence INT DEFAULT 50 CHECK (confidence >= 0 AND confidence <= 100),
    utility INT DEFAULT 50 CHECK (utility >= 0 AND utility <= 100),
    lifecycle_status TEXT DEFAULT 'active' CHECK (lifecycle_status IN ('active','stale','archived','core')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    use_count INT DEFAULT 0
);

ALTER TABLE axon_memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "axon_memory_select_own" ON axon_memory;
CREATE POLICY "axon_memory_select_own" ON axon_memory FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "axon_memory_insert_own" ON axon_memory;
CREATE POLICY "axon_memory_insert_own" ON axon_memory FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "axon_memory_update_own" ON axon_memory;
CREATE POLICY "axon_memory_update_own" ON axon_memory FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "axon_memory_delete_own" ON axon_memory;
CREATE POLICY "axon_memory_delete_own" ON axon_memory FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_axon_memory_user_store ON axon_memory(user_id, store_type);
CREATE INDEX IF NOT EXISTS idx_axon_memory_key ON axon_memory(memory_key);
CREATE INDEX IF NOT EXISTS idx_axon_memory_user ON axon_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_axon_memory_created ON axon_memory(created_at);

-- ============================================================
-- 24. Migration : colonnes profil utilisateur (session 16/08/2026)
-- Colonnes utilisées par le code (saveProfileCompletion, openEditProfile,
-- editUser admin) mais absentes du CREATE TABLE d'origine.
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name_ar TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialite TEXT;

-- ============================================================
-- 25. Migration : pipeline d'images des présentations (v1.8.6 → v1.9.6)
-- ------------------------------------------------------------------
-- Contexte (détail dans AGENTS.md, session 28/10/2026) :
--   • les images de slides sont générées par pollinations.ai (1 image /
--     45 s par IP), avec clé facultative (`image_source = 'pollkey'`),
--     puis complétées par l'article Wikipédia du mot-clé ou Wikimedia
--     Commons (`image_source = 'commons'`) ;
--   • la banque d'images ne contient QUE des images IA : le code n'appelle
--     `saveGeneratedImage()` que si `image_source !== 'commons'`
--     (dans js/shared.v2.js ET js/from-doc.js) ;
--   • les images des diapos sont stockées dans `presentations.slides`
--     (JSONB) sous la forme { image_url, image_source, image_prompt }.
-- Idempotent : peut être exécuté plusieurs fois sans erreur.
-- ============================================================

ALTER TABLE generated_images ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'ia';

COMMENT ON COLUMN generated_images.source IS 'Origine de l''image : ia (pollinations) ou pollkey (cle API). Les images Commons/Wikipedia ne sont jamais enregistrees dans la banque.';

CREATE INDEX IF NOT EXISTS idx_images_created ON generated_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_visibility ON generated_images(visibility);
CREATE INDEX IF NOT EXISTS idx_presentations_created ON presentations(created_at DESC);

-- ============================================================
-- Journal de ce fichier
--   16/08/2026  sections 1 → 24 : référentiels, cours, présentations, images,
--               quiz, fleurs de compétences, challenges, assistant IA,
--               journal d'activité, sauvegardes de jeux, AXON, profil.
--   28/10/2026  section 25 : pipeline d'images v1.8.6 → v1.9.6.
-- Toute évolution du schéma doit être AJOUTÉE EN FIN DE FICHIER, dans une
-- section idempotente (ADD COLUMN IF NOT EXISTS / CREATE INDEX IF NOT EXISTS),
-- et reportée dans AGENTS.md + RAPPORT_PLATEFORME.md.
-- ============================================================
