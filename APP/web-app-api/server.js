require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Groq = require("groq-sdk");
const { OAuth2Client } = require('google-auth-library');

// Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Auth Middleware
let authMiddleware;
try {
  authMiddleware = require("./middleware/auth");
} catch (e) {
  authMiddleware = require("./auth");
}

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function saveMsg(pool, { userId, sessionId, role, content }) {
  await pool.query(
    "INSERT INTO coach_messages (session_id, user_id, role, content) VALUES ($1,$2,$3,$4)",
    [sessionId, userId, role, content]
  );
}

app.get("/", (req, res) => { 
  res.json({ 
    status: "Server çalışıyor! ✅",
    endpoints: {
      auth: ["/register", "/login", "/auth/google"],
      profile: ["/profile/:user_id", "/profile"],
      ai: ["/get-ai-advice"],
      coach: ["/coach/start", "/coach/reply", "/coach/history/:sessionId", "/coach/sessions"],
      roadmap: ["/roadmap", "/roadmap/generate", "/roadmap/levelup", "/roadmap/reset"],
      notes: ["/notes"]
    }
  }); 
});

// --- 1. AUTH ---
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validasyon
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tüm alanları doldur!" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: "Şifre en az 6 karakter olmalı!" });
    }
    
    const checkUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Bu email kayıtlı!" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, hashedPassword]);
    res.json({ message: "Kayıt başarılı!" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validasyon
    if (!email || !password) {
      return res.status(400).json({ message: "Email ve şifre gerekli!" });
    }
    
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Email bulunamadı" });
    }
    
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Şifre yanlış" });
    }
    
    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Giriş başarılı!", token, userId: user.rows[0].id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Google OAuth Login
app.post("/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Google token'ı doğrula
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    
    // Kullanıcı var mı kontrol et
    let user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (user.rows.length === 0) {
      // Yeni kullanıcı oluştur
      const result = await pool.query(
        "INSERT INTO users (name, email, password, google_id) VALUES ($1, $2, $3, $4) RETURNING id",
        [name, email, 'google_oauth', googleId]
      );
      user = await pool.query("SELECT * FROM users WHERE id = $1", [result.rows[0].id]);
    }
    
    // JWT token oluştur
    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Google ile giriş başarılı!", token, userId: user.rows[0].id });
    
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Google ile giriş başarısız" });
  }
});

// --- 2. PROFİL ---
app.get("/profile/:user_id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users_profiles WHERE user_id = $1", [req.params.user_id]);
    if (result.rows.length === 0) return res.json({ hasProfile: false });
    res.json({ hasProfile: true, profile: result.rows[0] });
  } catch (err) { res.status(500).json({ message: "Profil hatası" }); }
});

app.post("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { age, city, is_student, grade, university, uni_type, department, is_working, sector, position, interests, study_hours } = req.body;
    const existing = await pool.query("SELECT id FROM users_profiles WHERE user_id = $1", [userId]);
    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE users_profiles SET age=$1, city=$2, is_student=$3, grade=$4, university=$5, uni_type=$6, department=$7, is_working=$8, sector=$9, position=$10, interests=$11, study_hours=$12 WHERE user_id=$13`,
        [age, city, is_student, grade, university, uni_type, department, is_working, sector, position, interests, study_hours, userId]
      );
    } else {
      await pool.query(
        `INSERT INTO users_profiles (user_id, age, city, is_student, grade, university, uni_type, department, is_working, sector, position, interests, study_hours) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [userId, age, city, is_student, grade, university, uni_type, department, is_working, sector, position, interests, study_hours]
      );
    }
    res.json({ success: true, message: "Profil kaydedildi" });
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

// --- 3. AI TAVSİYESİ ---
app.post("/get-ai-advice", authMiddleware, async (req, res) => {
  try {
    const userProfile = req.body;
    const userId = req.userId;
    const past = await pool.query("SELECT advice FROM ai_advices WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3", [userId]);
    const pastAdviceText = past.rows.map(r => r.advice).join("\n");
    
    const messages = [
        { role: "system", content: "Sen kıdemli bir kariyer koçusun. Asla soru sorma. Doğrudan, maddeler halinde, somut tavsiyeler ver. Türkçe konuş." },
        { role: "user", content: `Bölüm: ${userProfile.department}. Hedef: ${userProfile.interests}. Bana somut yol haritası ver. Tekrar etme: ${pastAdviceText}` }
    ];

    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.3,
    });
    const adviceText = chat.choices[0]?.message?.content || "Hedefinden vazgeçme!";
    await pool.query("INSERT INTO ai_advices (user_id, advice) VALUES ($1, $2)", [userId, adviceText]);
    res.json({ advice: adviceText });
  } catch (err) { res.json({ advice: "AI şu an meşgul." }); }
});

// --- 4. CHAT SİSTEMİ ---
const SYSTEM_PROMPT = `
Sen "KariyerAsistanı" adında kıdemli bir mentörsün.
KURALLAR:
1. KESİNLİKLE "Bunu mu demek istediniz?", "Hangi konuda?" gibi karşı sorular sorma. Kullanıcı ne dediyse doğrudan cevap ver.
2. Kullanıcı "Siber güvenlik projesi" derse; "Chatbot kullan" deme. "Python ile Port Tarayıcı yaz", "Keylogger yap", "Wireshark ile paket analizi yap" gibi TEKNİK ve SOMUT proje fikirleri ver.
3. Asla İngilizce kelime kullanma (Experience -> Deneyim, Background -> Geçmiş).
4. Kullanıcı "Soru sorma" dediyse sadece bilgi ver, konuyu kapat.
5. Cevapların kısa paragraflar ve maddeler halinde olsun. Okunabilir olsun.
`;

app.post("/coach/start", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const profRes = await pool.query("SELECT * FROM users_profiles WHERE user_id = $1", [userId]);
    const p = profRes.rows[0] || {};
    const s = await pool.query("INSERT INTO coach_sessions (user_id, state, title) VALUES ($1, 'active', 'Yeni Sohbet') RETURNING id", [userId]);
    const sessionId = s.rows[0].id;
    
    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Kullanıcının HEDEFİ: ${p.interests}. Merhaba de ve doğrudan bir ipucu ver.` }
    ];

    const chat = await groq.chat.completions.create({ model: "llama-3.3-70b-versatile", messages: messages, temperature: 0.4 });
    const msg = chat.choices[0]?.message?.content;
    await saveMsg(pool, { userId, sessionId, role: "assistant", content: msg });
    res.json({ sessionId, message: msg });
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

app.post("/coach/reply", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { sessionId, userMessage } = req.body;
    await saveMsg(pool, { userId, sessionId, role: "user", content: userMessage });
    
    await pool.query("UPDATE coach_sessions SET created_at = NOW() WHERE id = $1", [sessionId]);

    const historyRes = await pool.query("SELECT role, content FROM coach_messages WHERE session_id = $1 ORDER BY id ASC LIMIT 15", [sessionId]);
    const messages = historyRes.rows.map(m => ({ role: m.role, content: m.content }));
    messages.unshift({ role: "system", content: SYSTEM_PROMPT });
    
    const chat = await groq.chat.completions.create({ model: "llama-3.3-70b-versatile", messages: messages, temperature: 0.3 });
    const reply = chat.choices[0]?.message?.content;
    await saveMsg(pool, { userId, sessionId, role: "assistant", content: reply });
    res.json({ message: reply });
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

app.delete("/coach/sessions/:id", authMiddleware, async (req, res) => {
    try {
        await pool.query("DELETE FROM coach_messages WHERE session_id = $1", [req.params.id]);
        await pool.query("DELETE FROM coach_sessions WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: "Silinemedi" }); }
});

app.put("/coach/sessions/:id", authMiddleware, async (req, res) => {
    try {
        const { title } = req.body;
        await pool.query("UPDATE coach_sessions SET title = $1 WHERE id = $2 AND user_id = $3", [title, req.params.id, req.userId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: "Güncellenemedi" }); }
});

app.get("/coach/history/:sessionId", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT role, content FROM coach_messages WHERE session_id = $1 ORDER BY id ASC", [req.params.sessionId]);
    res.json({ messages: result.rows });
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

app.get("/coach/sessions", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, title FROM coach_sessions WHERE user_id = $1 ORDER BY created_at DESC", [req.userId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

// --- 5. ROADMAP (HATA KORUMALI VERSİYON) ---
app.post("/roadmap/generate", authMiddleware, async (req, res) => {
  const userId = req.userId;
  let currentLevel = 1;

  try {
    const profRes = await pool.query("SELECT * FROM users_profiles WHERE user_id = $1", [userId]);
    const p = profRes.rows[0];

    // Eğer profil yoksa hata dön ama JSON formatında dön
    if (!p) return res.json({ success: false, message: "Lütfen önce 'Profilim' sekmesinden hedefini kaydet!" });

    const userGoal = (p.interests && p.interests.length > 2) ? p.interests : "Genel Başarı";
    currentLevel = p.current_level || 1;
    
    if (currentLevel > 5) return res.json({ success: true, finished: true, message: "Tebrikler! Hedefine ulaştın." });

    const isExamMode = userGoal.toLowerCase().match(/yks|tyt|ayt|kpss|dgs|lgs|ales|ydt|sınav|üniversite|hazırlık|kazanmak|okumak/);
    
    let specificPrompt = "";
    let forbiddenWords = "";

    // Seviye Mantığı
    if (currentLevel === 1) {
        specificPrompt = "Bu aşama: 'TEMEL ATMA'. Konuları öğrenmek, kaynak seçmek ve program yapmakla ilgili görevler ver.";
        forbiddenWords = "ASLA 'CV hazırla', 'LinkedIn', 'İş başvurusu', 'Staj' deme.";
    } else if (currentLevel === 2) {
        specificPrompt = "Bu aşama: 'PRATİK'. Soru çözmek, kod yazmak, tekrar yapmakla ilgili somut görevler ver.";
        forbiddenWords = "ASLA 'CV', 'Özgeçmiş', 'Ağ kurma' deme.";
    } else if (currentLevel === 3) {
        specificPrompt = isExamMode ? "Bu aşama: 'ZORLANMA'. Branş denemeleri çözmek." : "Bu aşama: 'PROJE'. Somut proje bitirmek.";
        forbiddenWords = "ASLA 'Temel bilgi', 'Araştır' deme.";
    } else if (currentLevel === 4) {
        specificPrompt = isExamMode ? "Bu aşama: 'SINAV PROVASI'. Genel denemeler." : "Bu aşama: 'PORTFOLYO'. GitHub, CV hazırlama.";
        forbiddenWords = ""; 
    } else {
        specificPrompt = "Bu aşama: 'FİNAL'. Son dokunuşlar ve ustalık.";
        forbiddenWords = "ASLA 'Öğren', 'Araştır' deme. 'Uygula', 'Yarat' de.";
    }

    const messages = [
        { 
            role: "system", 
            content: `Sen dünyanın en iyi koçusun. Hedef: ${userGoal}. Seviye: ${currentLevel}. 
            GÖREV: Bu seviye için 5 adet ÇOK SOMUT, KISA ve NET görev yaz.
            ${specificPrompt}
            YASAKLAR: ${forbiddenWords}
            ÇIKTI FORMATI: Sadece saf JSON Array ver. Başka hiçbir şey yazma. Örn: ["Günde 50 soru çöz", "X konusunu bitir"]` 
        }
    ];

    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.3, 
    });

    let content = chat.choices[0]?.message?.content || "[]";
    // AI bazen JSON dışında yazı da yazar, onu temizleyelim:
    const match = content.match(/\[[\s\S]*?\]/);
    if (match) { content = match[0]; }
    
    let tasks = [];
    try {
        tasks = JSON.parse(content);
        // Bazen string array yerine obje array dönebilir, düzeltelim:
        if (tasks.length > 0 && typeof tasks[0] === 'object') { 
            tasks = tasks.map(t => Object.values(t)[0] || "Görev"); 
        }
    } catch (e) {
        console.log("JSON Parse Hatası:", e);
        // Yedek görevler (AI hata verirse bunlar çıkar)
        tasks = ["Hedefine odaklan ve çalış", "Eksik konularını belirle", "Pratik yap", "Kendini test et", "Planını güncelle"];
    }

    await pool.query("DELETE FROM roadmap_items WHERE user_id = $1", [userId]);
    for (const task of tasks) {
      // Görev boş string olmasın
      if(task && typeof task === 'string' && task.trim() !== "") {
          await pool.query("INSERT INTO roadmap_items (user_id, task) VALUES ($1, $2)", [userId, String(task)]);
      }
    }

    const newRoadmap = await pool.query("SELECT * FROM roadmap_items WHERE user_id = $1 ORDER BY id ASC", [userId]);
    res.json({ success: true, message: `Seviye ${currentLevel} planı hazır!`, roadmap: newRoadmap.rows, currentLevel: currentLevel });

  } catch (err) {
    console.error("Roadmap Server Hatası:", err);
    // Frontend'in donmaması için mutlaka bir cevap dönüyoruz:
    res.json({ success: false, message: "Sunucuda bir hata oluştu, lütfen tekrar dene." });
  }
});

app.get("/roadmap", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM roadmap_items WHERE user_id = $1 ORDER BY id ASC", [req.userId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

app.put("/roadmap/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("UPDATE roadmap_items SET is_completed = $1 WHERE id = $2 AND user_id = $3", [req.body.is_completed, req.params.id, req.userId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

app.post("/roadmap/levelup", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const checkTasks = await pool.query("SELECT count(*) FROM roadmap_items WHERE user_id = $1 AND is_completed = false", [userId]);
    if (parseInt(checkTasks.rows[0].count) > 0) return res.status(400).json({ message: "Önce tüm görevleri bitir!" });

    await pool.query("UPDATE users_profiles SET current_level = COALESCE(current_level, 1) + 1 WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM roadmap_items WHERE user_id = $1", [userId]);
    const newLevelRes = await pool.query("SELECT current_level FROM users_profiles WHERE user_id = $1", [userId]);
    res.json({ success: true, newLevel: newLevelRes.rows[0].current_level, message: "Tebrikler! Seviye Atladın!" });
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

app.post("/roadmap/reset", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    await pool.query("UPDATE users_profiles SET current_level = 1 WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM roadmap_items WHERE user_id = $1", [userId]);
    res.json({ success: true, message: "Sıfırlandı!" });
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

app.get("/roadmap/level", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT current_level FROM users_profiles WHERE user_id = $1", [req.userId]);
    res.json({ level: result.rows[0]?.current_level || 1 });
  } catch (err) { res.status(500).json({ level: 1 }); }
});

// --- NOTLAR ---
app.get("/notes", authMiddleware, async (req, res) => {
  try {
    // 🔥 NOTLARI EN YENİDEN ESKİYE SIRALA
    const result = await pool.query("SELECT * FROM notes WHERE user_id = $1 ORDER BY id DESC", [req.userId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

app.post("/notes", authMiddleware, async (req, res) => {
  try {
    await pool.query("INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3)", [req.userId, req.body.title, req.body.content]);
    const result = await pool.query("SELECT * FROM notes WHERE user_id = $1 ORDER BY id DESC", [req.userId]);
    res.json({ success: true, notes: result.rows });
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

app.delete("/notes/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: "Hata" }); }
});

app.listen(5000, () => { console.log("Server 5000 portunda çalışıyor... 🚀"); });