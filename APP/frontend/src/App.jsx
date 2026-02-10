import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import { API_URL } from "./config";
import { useWindowSize } from "./hooks/useWindowSize";
import ThemeToggle from "./components/ThemeToggle";
import ConfirmModal from "./components/ConfirmModal";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { apiCall, logger } from "./utils/api";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_ENABLED = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your_google_client_id_here';

function App() {
  const { width: windowWidth } = useWindowSize();
  const [showNotesModal, setShowNotesModal] = useState(false);
  
  const [notesSearchQuery, setNotesSearchQuery] = useState("");
  const [showOlderNotes, setShowOlderNotes] = useState(false);
  const [view, setView] = useState("landing");
  const [activeTab, setActiveTab] = useState("profile");
  
  const [mobileAiMode, setMobileAiMode] = useState("advice"); // mobilde varsayılan: tavsiye modu
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState(null);
  const [authData, setAuthData] = useState({ name: "", email: "", password: "" });
  const [aiMode, setAiMode] = useState("advice"); // büyük ekran modu
  const [profile, setProfile] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [selectedNote, setSelectedNote] = useState(null);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // arama için
  const [roadmap, setRoadmap] = useState([]);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  // Arama filtrelemesi – TAM BURAYA
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(notesSearchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(notesSearchQuery.toLowerCase())
  );
  const [aiAdvice, setAiAdvice] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [coachSessionId, setCoachSessionId] = useState(null);
  const [coachMessages, setCoachMessages] = useState([]);
  const [coachInput, setCoachInput] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal state'leri
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: 'confirm', // 'confirm' veya 'prompt'
    title: '',
    message: '',
    onConfirm: () => {},
    inputValue: '',
    inputPlaceholder: '',
  });

  // Loading state'leri
  const [loadingStates, setLoadingStates] = useState({
    notes: false,
    addNote: false,
    deleteNote: false,
  });

  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const alarmSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  
  // Timer arka plan özelleştirme
  const [timerBackground, setTimerBackground] = useState(() => {
    return localStorage.getItem('timerBackground') || 'gradient';
  });
  const [customColor, setCustomColor] = useState(() => {
    return localStorage.getItem('timerCustomColor') || '#667eea';
  });
  const [showBgSelector, setShowBgSelector] = useState(false);
  const [showImageSubmenu, setShowImageSubmenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Timer arka plan değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('timerBackground', timerBackground);
  }, [timerBackground]);
  
  // Özel renk değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('timerCustomColor', customColor);
  }, [customColor]);
  
  // ESC tuşu ile tam ekrandan çık
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);
  
  const gradientOptions = [
    { id: "gradient", name: "Mor Gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: "blue", name: "Mavi Gradient", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { id: "green", name: "Yeşil Gradient", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
    { id: "sunset", name: "Gün Batımı", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    { id: "ocean", name: "Okyanus", value: "linear-gradient(135deg, #2e3192 0%, #1bffff 100%)" },
  ];
  
  const imageOptions = [
    { id: "forest", name: "🌲 Orman", value: "/timer-backgrounds/forest.png" },
    { id: "mountain", name: "⛰️ Dağ", value: "/timer-backgrounds/mountain.png" },
    { id: "library", name: "📚 Kütüphane", value: "/timer-backgrounds/library.png" },
    { id: "space", name: "🌌 Uzay", value: "/timer-backgrounds/space.png" },
  ];

  const [formData, setFormData] = useState({
    age: "",
    city: "",
    is_student: "false",
    grade: "",
    university: "",
    uni_type: "",
    department: "",
    is_working: "false",
    sector: "",
    position: "",
    interests: "",
    study_hours: "",
  });

  // NOT MANTIĞI
  const sortedNotes = [...notes].reverse();
  const recentNotes = sortedNotes.slice(0, 3);
  const olderNotes = sortedNotes.slice(3);
  
  const isExamMode = (formData.interests || "")
    .toLowerCase()
    .match(/yks|tyt|ayt|kpss|dgs|lgs|ales|ydt|sınav|üniversite|hazırlık|kazanmak|okumak/);
  const completedCount = roadmap.filter((i) => i.is_completed).length;
  const progress = roadmap.length === 0 ? 0 : Math.round((completedCount / roadmap.length) * 100);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [coachMessages]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // TIMER EFFECT
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      alarmSound.play();
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(breakTime * 60);
        showToast("🔔 Mola Vakti!");
      } else {
        setIsBreak(false);
        setTimeLeft(focusTime * 60);
        showToast("💪 Ders Vakti!");
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, isBreak, breakTime, focusTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleTimerStart = () => setTimerActive(!timerActive);
  const handleTimerReset = () => {
    setTimerActive(false);
    setIsBreak(false);
    setTimeLeft(focusTime * 60);
  };
  const updateFocusTime = (val) => {
    setFocusTime(val);
    if (!timerActive && !isBreak) setTimeLeft(val * 60);
  };
  const updateBreakTime = (val) => {
    setBreakTime(val);
    if (!timerActive && isBreak) setTimeLeft(val * 60);
  };

  // Sayfa yüklendiğinde token kontrol et
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Token varsa kullanıcı giriş yapmış, dashboard'a git
      setView("dashboard");
      // Token'dan userId çıkar (basit yöntem)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.userId);
        checkProfile(payload.userId);
      } catch (error) {
        // Token bozuksa temizle
        logger.error('Token parse error:', error);
        localStorage.removeItem("token");
        setView("landing");
      }
    } else {
      // Token yoksa landing sayfasında kal
      setView("landing");
    }
  }, []);

  // Modal helper fonksiyonları
  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const showPrompt = (title, placeholder, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      type: 'prompt',
      title,
      message: '',
      inputValue: '',
      inputPlaceholder: placeholder,
      onConfirm: (value) => {
        if (value && value.trim()) {
          onConfirm(value);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const fetchNotes = async () => {
    setLoadingStates(prev => ({ ...prev, notes: true }));
    const result = await apiCall("/notes");
    
    if (result.success) {
      setNotes(Array.isArray(result.data) ? result.data : []);
    } else {
      showToast(`❌ ${result.error}`);
      setNotes([]);
    }
    
    setLoadingStates(prev => ({ ...prev, notes: false }));
  };

  const addNote = async () => {
    if (!newNote.title.trim()) {
      showToast("⚠️ Başlık yazmalısın!");
      return;
    }
    
    setLoadingStates(prev => ({ ...prev, addNote: true }));
    const result = await apiCall("/notes", "POST", newNote);
    
    if (result.success) {
      fetchNotes();
      setNewNote({ title: "", content: "" });
      showToast("Not Eklendi! ✅");
    } else {
      showToast(`❌ ${result.error}`);
    }
    
    setLoadingStates(prev => ({ ...prev, addNote: false }));
  };

  const deleteNote = async (e, id) => {
    e.stopPropagation();
    
    showConfirm(
      "Not Sil",
      "Bu notu silmek istediğine emin misin?",
      async () => {
        setLoadingStates(prev => ({ ...prev, deleteNote: true }));
        const result = await apiCall(`/notes/${id}`, "DELETE");
        
        if (result.success) {
          setNotes(notes.filter((n) => n.id !== id));
          showToast("Not Silindi 🗑️");
          if (selectedNote && selectedNote.id === id) {
            setSelectedNote(null);
          }
        } else {
          showToast(`❌ ${result.error}`);
        }
        
        setLoadingStates(prev => ({ ...prev, deleteNote: false }));
      }
    );
  };

  const fetchSessions = async () => {
    const result = await apiCall("/coach/sessions");
    if (result.success) {
      setSessions(result.data || []);
    } else {
      setSessions([]);
    }
  };

  const loadSession = async (sid) => {
    setCoachSessionId(sid);
    const result = await apiCall(`/coach/history/${sid}`);
    if (result.success) {
      setCoachMessages(result.data.messages || []);
    } else {
      showToast(`❌ ${result.error}`);
    }
  };

  const startNewChat = async () => {
    setCoachLoading(true);
    const result = await apiCall("/coach/start", "POST", { userName: authData.name });
    
    if (result.success) {
      setCoachSessionId(result.data.sessionId);
      setCoachMessages([{ role: "assistant", content: result.data.message }]);
      fetchSessions();
    } else {
      showToast(`❌ ${result.error}`);
    }
    
    setCoachLoading(false);
  };

  const sendCoachReply = async () => {
    if (!coachInput.trim()) return;
    
    const txt = coachInput;
    setCoachMessages((p) => [...p, { role: "user", content: txt }]);
    setCoachInput("");
    setCoachLoading(true);
    
    const result = await apiCall("/coach/reply", "POST", {
      sessionId: coachSessionId,
      userMessage: txt,
    });
    
    if (result.success) {
      setCoachMessages((p) => [...p, { role: "assistant", content: result.data.message }]);
      fetchSessions();
    } else {
      showToast(`❌ ${result.error}`);
    }
    
    setCoachLoading(false);
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    
    showConfirm(
      "Sohbet Sil",
      "Bu sohbeti silmek istediğine emin misin?",
      async () => {
        const result = await apiCall(`/coach/sessions/${id}`, "DELETE");
        
        if (result.success) {
          fetchSessions();
          if (coachSessionId === id) {
            setCoachSessionId(null);
            setCoachMessages([]);
          }
          showToast("Sohbet silindi.");
        } else {
          showToast(`❌ ${result.error}`);
        }
        
        setActiveMenuId(null);
      }
    );
  };

  const handleRenameSession = async (e, id) => {
    e.stopPropagation();
    
    showPrompt(
      "Sohbet Adını Değiştir",
      "Yeni sohbet adı...",
      async (newTitle) => {
        const result = await apiCall(`/coach/sessions/${id}`, "PUT", { title: newTitle });
        
        if (result.success) {
          fetchSessions();
          showToast("İsim güncellendi.");
        } else {
          showToast(`❌ ${result.error}`);
        }
        
        setActiveMenuId(null);
      }
    );
  };

  const fetchRoadmap = async () => {
    const result = await apiCall("/roadmap");
    if (result.success) {
      setRoadmap(result.data || []);
    }
    
    const levelResult = await apiCall("/roadmap/level");
    if (levelResult.success) {
      setCurrentLevel(levelResult.data?.level || 1);
    }
  };

  const generateRoadmap = async () => {
    setRoadmapLoading(true);
    try {
      const result = await apiCall("/roadmap/generate", "POST");
      
      if (!result.success) {
        showToast(`❌ ${result.error}`);
        return;
      }
      
      if (result.data.finished) {
        showToast(result.data.message);
        fetchRoadmap();
      } else if (result.data.roadmap) {
        setRoadmap(result.data.roadmap);
        showToast("Plan Oluşturuldu! 🚀");
      } else if (result.data.message) {
        showToast(result.data.message);
      }
    } catch (error) {
      logger.error("Plan hatası:", error);
      showToast("Bir sorun oluştu.");
    } finally {
      setRoadmapLoading(false);
    }
  };

  const toggleTask = async (id, status) => {
    setRoadmap(roadmap.map((i) => (i.id === id ? { ...i, is_completed: !status } : i)));
    await apiCall(`/roadmap/${id}`, "PUT", { is_completed: !status });
  };

  const handleLevelUp = async () => {
    const result = await apiCall("/roadmap/levelup", "POST");
    
    if (result.success && result.data.success) {
      showToast(result.data.message);
      setCurrentLevel(result.data.newLevel);
      generateRoadmap();
    } else {
      showToast(result.data?.message || result.error || "Hata oluştu.");
    }
  };

  const resetRoadmap = async () => {
    showConfirm(
      "Yol Haritasını Sıfırla",
      "Tüm ilerleme kaybedilecek. Emin misin?",
      async () => {
        const result = await apiCall("/roadmap/reset", "POST");
        
        if (result.success) {
          setCurrentLevel(1);
          setRoadmap([]);
          setActiveTab("profile");
          showToast("Sıfırlandı 🔄");
        } else {
          showToast(`❌ ${result.error}`);
        }
      }
    );
  };

  const checkProfile = async (id) => {
    const result = await apiCall(`/profile/${id}`);
    
    if (result.success && result.data.hasProfile) {
      setProfile(result.data.profile);
      setFormData(result.data.profile);
      setView("dashboard");
    } else {
      setProfile(null);
      setView("dashboard");
      setActiveTab("profile");
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const result = await apiCall("/profile", "POST", formData);
    
    if (result.success && result.data.success) {
      showToast("Profil Kaydedildi! ✅");
      setProfile(formData);
      setActiveTab("advice");
    } else {
      showToast(`❌ ${result.error || 'Profil kaydedilemedi'}`);
    }
  };

  const askAI = async () => {
    if (!profile) {
      showToast("Önce profili doldur!");
      setActiveTab("profile");
      return;
    }
    
    setLoadingAI(true);
    const result = await apiCall("/get-ai-advice", "POST", profile);
    
    if (result.success) {
      setAiAdvice(result.data.advice);
    } else {
      showToast(`❌ ${result.error}`);
    }
    
    setLoadingAI(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!authData.email || !authData.password) {
      setMessage("⚠️ Email ve şifre gerekli!");
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authData),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setUserId(data.userId);
        checkProfile(data.userId);
        showToast("Giriş başarılı! 🎉");
        setMessage("");
      } else {
        // Kullanıcı dostu hata mesajları
        if (data.message === "Email bulunamadı") {
          setMessage("❌ Bu email ile kayıtlı kullanıcı bulunamadı. Önce kayıt ol!");
        } else if (data.message === "Şifre yanlış") {
          setMessage("❌ Şifre yanlış! Tekrar dene.");
        } else {
          setMessage("❌ " + (data.message || "Giriş başarısız"));
        }
      }
    } catch (error) {
      logger.error("Login error:", error);
      setMessage("⚠️ Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar dene.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!authData.name || !authData.email || !authData.password) {
      setMessage("⚠️ Tüm alanları doldur!");
      return;
    }
    
    if (authData.password.length < 6) {
      setMessage("⚠️ Şifre en az 6 karakter olmalı!");
      return;
    }
    
    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authData.email)) {
      setMessage("⚠️ Geçerli bir email adresi gir!");
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authData),
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast("Kayıt başarılı! Şimdi giriş yapabilirsin 🎉");
        setView("login");
        setMessage("✅ Kayıt başarılı! Şimdi giriş yap.");
        setAuthData({ name: "", email: "", password: "" });
      } else {
        // Kullanıcı dostu hata mesajları
        if (data.message === "Bu email kayıtlı!") {
          setMessage("❌ Bu email zaten kullanılıyor. Giriş yap veya başka email kullan.");
        } else {
          setMessage("❌ " + (data.message || "Kayıt başarısız"));
        }
      }
    } catch (error) {
      logger.error("Register error:", error);
      setMessage("⚠️ Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar dene.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setUserId(data.userId);
        checkProfile(data.userId);
        showToast("Google ile giriş başarılı! 🎉");
      } else {
        setMessage(data.message || "Google ile giriş başarısız");
      }
    } catch (error) {
      logger.error("Google login error:", error);
      setMessage("⚠️ Bağlantı hatası. Lütfen tekrar dene.");
    }
  };

  useEffect(() => {
    if (userId) {
      if (activeTab === "notes") fetchNotes();
      if (activeTab === "advice") fetchSessions();
      if (activeTab === "roadmap") fetchRoadmap();
    }
  }, [activeTab, userId]);

  if (view === "landing") {
    return (
      <>
        <ThemeToggle />
        <div className="landing-container">
          <div className="landing-content">
            <h1 className="hero-title">Kariyerini Yapay Zeka ile Planla</h1>
            <p className="hero-subtitle">
              Hedeflerine ulaşmak için kişiselleştirilmiş yol haritası, AI koçluk ve 
              üretkenlik araçlarıyla kariyerini bir üst seviyeye taşı
            </p>
            
            <button className="start-btn" onClick={() => setView("login")}>
              Ücretsiz Başla 🚀
            </button>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: "10px" }}>
              Kredi kartı gerekmez • 2 dakikada kurulum
            </p>

            {/* Özellikler */}
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h3>AI Kariyer Koçu</h3>
                <p>Yapay zeka destekli kişiselleştirilmiş kariyer tavsiyeleri ve interaktif sohbet</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3>Akıllı Yol Haritası</h3>
                <p>Hedeflerine göre AI tarafından oluşturulan öğrenme yolu ve seviye sistemi</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3>Not Defteri</h3>
                <p>Kariyer yolculuğunu belgele, notlarını organize et ve kolayca ara</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⏱️</div>
                <h3>Focus Timer</h3>
                <p>Pomodoro tekniği ile üretkenliğini artır, özelleştirilebilir temalar</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>İlerleme Takibi</h3>
                <p>Hedeflerini görselleştir, başarılarını kutla, motivasyonunu koru</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>Kişiselleştirme</h3>
                <p>Light, Dark ve Autumn temaları ile kendi tarzını yarat</p>
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: "60px", textAlign: "center" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Kariyerinde Bir Sonraki Adımı At</h2>
              <button className="start-btn" onClick={() => setView("login")}>
                Hemen Başla →
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (view === "login" || view === "register") {
    return (
      <>
        <ThemeToggle />
        <div className="login-wrapper">
        <div className="login-container">
          <h2>{view === "login" ? "Giriş Yap" : "Kayıt Ol"}</h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
              className={`primary-btn ${view === "login" ? "" : "outline"}`}
              onClick={() => setView("login")}
              style={{ opacity: view === "login" ? 1 : 0.5 }}
            >
              Giriş
            </button>
            <button
              className={`primary-btn ${view === "register" ? "" : "outline"}`}
              onClick={() => setView("register")}
              style={{ opacity: view === "register" ? 1 : 0.5 }}
            >
              Kayıt
            </button>
          </div>
          <form
            onSubmit={view === "register" ? handleRegister : handleLogin}
            className="input-group"
          >
            {view === "register" && (
              <input
                placeholder="Adın"
                onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
              />
            )}
            <input
              placeholder="Email"
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Şifre"
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            />
            <button className="primary-btn">{view === "login" ? "Giriş" : "Kayıt Ol"}</button>
          </form>
          
          {/* Google ile Giriş - Sadece Client ID varsa göster */}
          {GOOGLE_ENABLED && (
            <div style={{ margin: "20px 0", textAlign: "center" }}>
              <p style={{ color: "#718096", marginBottom: "10px" }}>veya</p>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  setMessage("Google ile giriş başarısız");
                }}
                text={view === "login" ? "signin_with" : "signup_with"}
                shape="rectangular"
                theme="outline"
                size="large"
                width="100%"
              />
            </div>
          )}
          
          {/* Hata/Başarı Mesajı */}
          {message && (
            <div 
              className={
                message.includes("✅") ? "success-message" : 
                message.includes("⚠️") ? "warning-message" : 
                "error-message"
              }
            >
              {message}
            </div>
          )}
          
          <p onClick={() => setView("landing")} style={{ cursor: "pointer", color: "#718096", marginTop: "15px" }}>
            ← Geri
          </p>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      {activeTab !== "focus" && <ThemeToggle />}
      
      {/* Confirm/Prompt Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        inputValue={confirmModal.inputValue}
        onInputChange={(value) => setConfirmModal(prev => ({ ...prev, inputValue: value }))}
        inputPlaceholder={confirmModal.inputPlaceholder}
      />
      
      <div className="dashboard-wrapper">
      {notification && (
        <div className="toast-notification">
          <span>{notification}</span>
        </div>
      )}

      {selectedNote && (
        <div className="modal-overlay" onClick={() => setSelectedNote(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selectedNote.title}</h2>
            <div className="modal-body">{selectedNote.content}</div>
            <button className="close-modal-btn" onClick={() => setSelectedNote(null)}>
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP Sidebar */}
      <aside className="sidebar-panel" style={{ display: windowWidth >= 768 ? "flex" : "none" }}>
        <div className="sidebar-title">KariyerAsistanı</div>
        <div className="sidebar-menu">
          <div
            className={`nav-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab("profile")}
            aria-label="Profil sayfasına git"
            aria-current={activeTab === "profile" ? "page" : undefined}
          >
            👤 Profilim
          </div>
          <div
            className={`nav-btn ${activeTab === "advice" ? "active" : ""}`}
            onClick={() => setActiveTab("advice")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab("advice")}
            aria-label="AI Koç sayfasına git"
            aria-current={activeTab === "advice" ? "page" : undefined}
          >
            🤖 AI Koç
          </div>
          <div
            className={`nav-btn ${activeTab === "roadmap" ? "active" : ""}`}
            onClick={() => setActiveTab("roadmap")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab("roadmap")}
            aria-label="Yol Haritası sayfasına git"
            aria-current={activeTab === "roadmap" ? "page" : undefined}
          >
            🗺️ Yol Haritası
          </div>
          <div
            className={`nav-btn ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab("notes")}
            aria-label="Not Defteri sayfasına git"
            aria-current={activeTab === "notes" ? "page" : undefined}
          >
            📝 Not Defteri
          </div>
          <div
            className={`nav-btn ${activeTab === "focus" ? "active" : ""}`}
            onClick={() => setActiveTab("focus")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab("focus")}
            aria-label="Focus Modu sayfasına git"
            aria-current={activeTab === "focus" ? "page" : undefined}
          >
            ⏱️ Focus Modu
          </div>
        </div>

        
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="primary-btn"
          style={{
            marginTop: "auto",
            background: "#fed7d7",
            color: "#c53030",
            border: "1px solid #feb2b2",
          }}
        >
          Çıkış
        </button>
      </aside>

      <main className="main-content">
        <div className="content-card">
          {activeTab === "profile" && (
            <>
              <h2>Profil Bilgileri</h2>
              <form onSubmit={saveProfile} className="profile-grid">
                <input
                  name="age"
                  value={formData.age}
                  placeholder="Yaş"
                  onChange={handleChange}
                  type="number"
                  min="10"
                  max="100"
                  required
                  aria-label="Yaşınızı girin"
                />
                <input
                  name="city"
                  value={formData.city}
                  placeholder="Şehir"
                  onChange={handleChange}
                  required
                  aria-label="Şehir adını girin"
                />
                <select 
                  name="is_student" 
                  value={formData.is_student} 
                  onChange={handleChange}
                  aria-label="Öğrenci durumunuzu seçin"
                >
                  <option value="false">Öğrenci misin? (Hayır)</option>
                  <option value="true">Öğrenciyim (Evet)</option>
                </select>
                <input
                  name="grade"
                  value={formData.grade}
                  placeholder="Sınıf / Dönem"
                  onChange={handleChange}
                  aria-label="Sınıf veya dönem bilgisi"
                />
                <input
                  name="university"
                  value={formData.university}
                  placeholder="Üniversite"
                  onChange={handleChange}
                  aria-label="Üniversite adı"
                />
                <input
                  name="uni_type"
                  value={formData.uni_type}
                  placeholder="Bölüm Tipi"
                  onChange={handleChange}
                  aria-label="Bölüm tipi"
                />
                <input
                  name="department"
                  value={formData.department}
                  placeholder="Bölüm"
                  onChange={handleChange}
                  aria-label="Bölüm adı"
                />
                <select 
                  name="is_working" 
                  value={formData.is_working} 
                  onChange={handleChange}
                  aria-label="Çalışma durumunuzu seçin"
                >
                  <option value="false">Çalışıyor musun? (Hayır)</option>
                  <option value="true">Çalışıyorum (Evet)</option>
                </select>
                <input
                  name="sector"
                  value={formData.sector}
                  placeholder="Sektör"
                  onChange={handleChange}
                  aria-label="Çalıştığınız sektör"
                />
                <input
                  name="position"
                  value={formData.position}
                  placeholder="Pozisyon"
                  onChange={handleChange}
                  aria-label="Pozisyon bilgisi"
                />
                <input
                  name="study_hours"
                  value={formData.study_hours}
                  type="number"
                  placeholder="Günlük Çalışma Saati"
                  onChange={handleChange}
                  min="0"
                  max="24"
                  step="0.5"
                  required
                  aria-label="Günlük çalışma saati (0-24 arası)"
                />
                <div style={{ gridColumn: "span 2" }}>
                  <label htmlFor="interests">🎯 ANA HEDEFİN NEDİR?</label>
                  <textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    placeholder="Hedefin..."
                    onChange={handleChange}
                    required
                    minLength="10"
                    maxLength="500"
                    aria-label="Ana hedefinizi yazın (10-500 karakter)"
                  />
                </div>
                <button 
                  type="submit" 
                  className="primary-btn" 
                  style={{ gridColumn: "span 2" }}
                  aria-label="Profil bilgilerini kaydet"
                >
                  Güncelle ✅
                </button>
              </form>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="primary-btn logout-btn"
                style={{
                  marginTop: "0.39rem",
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                }}
              >
                Çıkış Yap
              </button>
            </>
          )}

          {activeTab === "advice" && (
  <>
    <h2>🤖 AI Kariyer Koçu</h2>
    <div className="coach-grid">
      <div className="advice-column">
        {/* Büyük ekran: iki buton yan yana */}
        <div className="ai-mode-buttons desktop-buttons">
          <button
            onClick={() => setAiMode("advice")}
            className={`ai-mode-btn ${aiMode === "advice" ? "active" : ""}`}
          >
            ✨ Analiz & Tavsiye Al
          </button>
          <button
            onClick={() => setAiMode("chat")}
            className={`ai-mode-btn ${aiMode === "chat" ? "active" : ""}`}
          >
            💬 Sohbet Et
          </button>
        </div>

        {/* Mobil: tek buton + toggle */}
        <div className="ai-mode-buttons mobile-buttons">
          <div className="mobile-toggle">
            <button
              onClick={() => setMobileAiMode("advice")}
              className={`toggle-btn ${mobileAiMode === "advice" ? "active" : ""}`}
            >
              Analiz & Tavsiye
            </button>
            <button
              onClick={() => setMobileAiMode("chat")}
              className={`toggle-btn ${mobileAiMode === "chat" ? "active" : ""}`}
            >
              Sohbet Et
            </button>
          </div>
        </div>

        {/* İçerik – büyük ekranda aiMode, mobilde mobileAiMode'a göre göster */}
        {(windowWidth > 768 ? aiMode : mobileAiMode) === "advice" && (
          <>
            <button onClick={askAI} className="primary-btn action-btn">
              Şimdi Analiz & Tavsiye Al
            </button>
            <div className="ai-advice-box">
              {loadingAI ? (
                <p>Analiz yapılıyor...</p>
              ) : aiAdvice ? (
                <ReactMarkdown>{aiAdvice}</ReactMarkdown>
              ) : (
                <p style={{ color: "#647794", textAlign: "center" }}>
                  Henüz analiz almadın. Yukarıdaki butona bas.
                </p>
              )}
            </div>
          </>
        )}

        {(windowWidth > 768 ? aiMode : mobileAiMode) === "chat" && (
          <div className="chat-column">
            {/* sohbet sidebar + mesaj alanı – mevcut kodun aynı kalıyor */}
            {/* MOBİL HAMBURGER BUTONU */}
<button
  className="mobile-chat-hamburger"
  onClick={() => setIsChatSidebarOpen(!isChatSidebarOpen)}
>
  {isChatSidebarOpen ? "✕" : "☰"}
</button>

{/* Sohbet Sidebar – mobil'de slide-in */}
<div className={`chat-sidebar ${isChatSidebarOpen ? "open" : ""}`}>
  {/* Arama kutusu */}
  <div className="sidebar-search">
    <input
      type="text"
      placeholder="Sohbet ara..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  {/* Yeni Sohbet butonu */}
  <button
    onClick={() => {
      startNewChat();
      setIsChatSidebarOpen(false);
    }}
    className="primary-btn new-chat-btn"
  >
    + Yeni Sohbet
  </button>

  {/* Filtreli sohbet listesi */}
  {sessions
    .filter((s) =>
      (s.title || "Sohbet")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .map((s) => (
      <div
        key={s.id}
        className="session-item"
        onClick={() => {
          loadSession(s.id);
          setIsChatSidebarOpen(false);
        }}
      >
        <span
          className="session-title"
          style={{
            color: coachSessionId === s.id ? "#667eea" : "#333",
            fontWeight: coachSessionId === s.id ? "bold" : "normal",
          }}
        >
          {s.title || "Sohbet"}
        </span>
        <button
          className="session-menu-btn"
          onClick={(e) => {
            e.stopPropagation();
            setActiveMenuId(activeMenuId === s.id ? null : s.id);
          }}
        >
          ...
        </button>
        {activeMenuId === s.id && (
          <div className="session-dropdown">
            <button onClick={(e) => handleRenameSession(e, s.id)}>
              ✏️ Adlandır
            </button>
            <button
              className="delete-btn"
              onClick={(e) => handleDeleteSession(e, s.id)}
            >
              🗑️ Sil
            </button>
          </div>
        )}
      </div>
    ))}
</div>

            <div className="chat-main">
              <div className="messages-area">
                {coachMessages.map((msg, idx) => (
                  <div key={idx} className={`bubble ${msg.role}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ))}
                {coachLoading && (
                  <div style={{ padding: "10px", fontStyle: "italic", color: "#a0aec0" }}>
                    Yazıyor...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-zone">
                <input
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  placeholder="Mesaj yaz..."
                  style={{ flex: 1 }}
                  onKeyDown={(e) => e.key === "Enter" && sendCoachReply()}
                  disabled={coachLoading}
                />
                <button
                  onClick={sendCoachReply}
                  className="primary-btn"
                  style={{ width: "auto", minWidth: "48px" }}
                  disabled={coachLoading}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
)}

          {activeTab === "roadmap" && (
            <>
              {currentLevel > 5 ? (
                <div className="congratulations-container">
                  <h1 className="congratulations-title">TEBRİKLER! 🎓</h1>
                  <h3>"{formData.interests}" hedefine ulaştın.</h3>
                  <div className="congratulations-box">
                    <p className="congratulations-text">
                      🎉 Tüm aşamaları tamamladın!
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
                    <button
                      onClick={resetRoadmap}
                      className="primary-btn reset-btn"
                      style={{ width: "auto" }}
                    >
                      🔄 Yeni Hedef Belirle
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2>
                    {isExamMode ? "🎓 Sınav Hazırlık" : "🚀 Kariyer Yolu"} - Seviye {currentLevel}
                  </h2>
                  <div
                    className="progress-container"
                  >
                    <div className="progress-header">
                      <span>İlerleme</span>
                      <span>%{progress}</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${progress}%`
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", marginBottom: "15px" }}>
                    {roadmap.length === 0 ? (
                      <button
                        onClick={generateRoadmap}
                        className="primary-btn"
                        style={{ width: "auto" }}
                        disabled={roadmapLoading}
                      >
                        ✨ Plan Oluştur
                      </button>
                    ) : (
                      progress === 100 && (
                        <button
                          onClick={handleLevelUp}
                          className="primary-btn"
                          style={{ width: "auto", background: "orange" }}
                        >
                          🏆 Seviye Atla
                        </button>
                      )
                    )}
                    {roadmap.length > 0 && (
                      <button
                        onClick={resetRoadmap}
                        style={{
                          marginLeft: "10px",
                          background: "transparent",
                          border: "none",
                          color: "red",
                          cursor: "pointer",
                        }}
                      >
                        Sıfırla
                      </button>
                    )}
                  </div>
                  <div className="roadmap-list">
                    {roadmap.length === 0 && !roadmapLoading && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px",
                          color: "#a0aec0",
                          border: "2px dashed #e2e8f0",
                          borderRadius: "15px",
                        }}
                      >
                        <p>📭 Bu seviye için henüz görev atanmadı.</p>
                        <p>Yukarıdaki butona basarak yapay zekadan plan iste.</p>
                      </div>
                    )}
                    {roadmap.map((item) => (
                      <div
                        key={item.id}
                        className={`roadmap-item ${item.is_completed ? "done" : ""}`}
                        onClick={() => toggleTask(item.id, item.is_completed)}
                      >
                        <span style={{ marginRight: "10px" }}>
                          {item.is_completed ? "✓" : "○"}
                        </span>
                        {item.task}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "notes" && (
  <>
    <h2>📝 Not Defteri</h2>

    {/* Yeni not oluşturma kutusu */}
    <div className="create-note-box">
      <input
        placeholder="📌 Başlık"
        value={newNote.title}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        style={{ marginBottom: "10px" }}
      />
      <textarea
        placeholder="✍️ Detayları buraya yaz..."
        style={{ minHeight: "80px" }}
        value={newNote.content}
        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
      />
      <button
        onClick={addNote}
        className="primary-btn"
        style={{ marginTop: "10px", width: "140px" }}
      >
        + Ekle
      </button>
    </div>

    {/* Notları Göster Butonu */}
    <button
      className="open-notes-modal-btn"
      onClick={() => setShowNotesModal(true)}
    >
      Notları Görüntüle ({notes.length} adet)
    </button>

    {/* MODAL - Not Listesi */}
    {showNotesModal && (
      <div className="modal-overlay" onClick={() => setShowNotesModal(false)}>
        <div className="modal-content notes-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Tüm Notlarım</h3>
            <button className="close-modal-btn" onClick={() => setShowNotesModal(false)}>
              ×
            </button>
          </div>

          {/* Arama Alanı */}
          <div className="modal-search">
            <input
              type="text"
              placeholder="Not ara (başlık veya içerik)..."
              value={notesSearchQuery}
              onChange={(e) => setNotesSearchQuery(e.target.value)}
              className="notes-search-input"
            />
          </div>

          {/* Scroll'lu not listesi */}
          <div className="notes-modal-list">
            {filteredNotes.length === 0 ? (
              <p className="no-notes">Aramanıza uygun not bulunamadı 😔</p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="note-card modal-note-card"
                  onClick={() => {
                    setSelectedNote(note);
                    setShowNotesModal(false); // seçince modalı kapat
                  }}
                >
                  <h4>{note.title}</h4>
                  <p>{note.content}</p>
                  <button
                    className="delete-note-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // kart tıklanmasın
                      deleteNote(e, note.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )}
  </>
)}

          {activeTab === "focus" && (
            <div
              className={`focus-wrapper ${timerActive ? "timer-active" : ""} ${
                isBreak ? "break-active" : ""
              } ${isFullscreen ? "fullscreen-mode" : ""}`}
              style={{
                background: timerBackground === "custom" 
                  ? customColor 
                  : imageOptions.find(img => img.id === timerBackground)
                    ? `url(${imageOptions.find(img => img.id === timerBackground).value}) center/cover`
                    : gradientOptions.find(grad => grad.id === timerBackground)?.value || gradientOptions[0].value,
                transition: "background 0.5s ease"
              }}
            >
              {/* Sağ Üst Butonlar */}
              <div style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                zIndex: 10
              }}>
                {/* Theme Toggle */}
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "50%",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                }}>
                  <ThemeToggle />
                </div>
                
                {/* Arka Plan Seçici Butonu */}
                <button
                  onClick={() => setShowBgSelector(!showBgSelector)}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: "45px",
                    height: "45px",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                  🎨
                </button>
                
                {/* Tam Ekran Butonu */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: "45px",
                    height: "45px",
                    fontSize: "1.3rem",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  title="Tam Ekran"
                >
                  ⛶
                </button>
              </div>

              {/* Arka Plan Seçici Panel */}
              {showBgSelector && (
                <>
                  {/* Overlay - dışarı tıklayınca kapat */}
                  <div
                    onClick={() => setShowBgSelector(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(0,0,0,0.3)",
                      zIndex: 99
                    }}
                  />
                  
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: "75px",
                      right: "20px",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "15px",
                      padding: "20px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                      maxWidth: "300px",
                      maxHeight: "70vh",
                      overflowY: "auto",
                      zIndex: 100
                    }}
                  >
                  <h3 style={{ margin: "0 0 15px 0", color: "#2d3748", fontSize: "1.1rem" }}>
                    Arka Plan Seç
                  </h3>
                  
                  <div style={{ display: "grid", gap: "10px" }}>
                    {/* Gradient Seçenekleri */}
                    <h4 style={{ margin: "10px 0 8px 0", color: "#4a5568", fontSize: "0.9rem", fontWeight: "600" }}>
                      🎨 Renkler
                    </h4>
                    {gradientOptions.map((grad) => (
                      <button
                        key={grad.id}
                        onClick={() => {
                          setTimerBackground(grad.id);
                          setShowBgSelector(false);
                          setShowImageSubmenu(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: timerBackground === grad.id ? "3px solid #667eea" : "2px solid #e2e8f0",
                          borderRadius: "10px",
                          background: grad.value,
                          color: "white",
                          cursor: "pointer",
                          fontWeight: timerBackground === grad.id ? "bold" : "normal",
                          transition: "all 0.2s",
                          fontSize: "0.9rem",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
                        }}
                        onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
                        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                      >
                        {grad.name}
                      </button>
                    ))}

                    {/* Görseller - Toggle Butonu */}
                    <button
                      onClick={() => setShowImageSubmenu(!showImageSubmenu)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        background: "#f7fafc",
                        color: "#2d3748",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s"
                      }}
                    >
                      <span>🖼️ Görseller</span>
                      <span>{showImageSubmenu ? "▼" : "▶"}</span>
                    </button>
                    
                    {/* Görsel Seçenekleri - Sadece açıksa göster */}
                    {showImageSubmenu && (
                      <div style={{ display: "grid", gap: "10px", marginTop: "5px" }}>
                        {imageOptions.map((img) => (
                          <button
                            key={img.id}
                            onClick={() => {
                              setTimerBackground(img.id);
                              setShowBgSelector(false);
                              setShowImageSubmenu(false);
                            }}
                            style={{
                              width: "100%",
                              padding: "12px",
                              border: timerBackground === img.id ? "3px solid #667eea" : "2px solid #e2e8f0",
                              borderRadius: "10px",
                              background: `url(${img.value}) center/cover`,
                              color: "white",
                              cursor: "pointer",
                              fontWeight: timerBackground === img.id ? "bold" : "normal",
                              transition: "all 0.2s",
                              fontSize: "0.9rem",
                              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                              minHeight: "50px"
                            }}
                            onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
                            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                          >
                            {img.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Özel Renk Seçici */}
                    <h4 style={{ margin: "15px 0 8px 0", color: "#4a5568", fontSize: "0.9rem", fontWeight: "600" }}>
                      🌈 Özel Renk
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => {
                          setCustomColor(e.target.value);
                          setTimerBackground("custom");
                        }}
                        style={{
                          width: "100%",
                          height: "45px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowBgSelector(false);
                    }}
                    style={{
                      width: "100%",
                      marginTop: "15px",
                      padding: "10px",
                      background: "#e2e8f0",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "#2d3748"
                    }}
                  >
                    Kapat
                  </button>
                </div>
                </>
              )}

              <h2 style={{ color: isBreak ? "#48bb78" : "white", textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                {isBreak ? "☕ MOLA VAKTİ" : "⚡ DERS VAKTİ"}
              </h2>
              <div className="timer-display" style={{ color: "white", textShadow: "3px 3px 6px rgba(0,0,0,0.4)" }}>
                {formatTime(timeLeft)}
              </div>
              <div className="timer-inputs">
                <div className="timer-input-group">
                  <label>Ders Süresi (dk)</label>
                  <input
                    type="number"
                    value={focusTime}
                    onChange={(e) => updateFocusTime(Number(e.target.value))}
                  />
                </div>
                <div className="timer-input-group">
                  <label>Mola Süresi (dk)</label>
                  <input
                    type="number"
                    value={breakTime}
                    onChange={(e) => updateBreakTime(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="timer-controls">
                <button
                  className={`timer-btn ${timerActive ? "btn-stop" : "btn-start"}`}
                  onClick={handleTimerStart}
                >
                  {timerActive ? "Durdur" : "Başlat"}
                </button>
                <button className="timer-btn btn-reset" onClick={handleTimerReset}>
                  Sıfırla
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MOBİL BOTTOM NAV */}
      <nav className="bottom-nav">
        {[
          { id: "profile", icon: "👤", label: "Profil" },
          { id: "advice", icon: "🤖", label: "Koç" },
          { id: "roadmap", icon: "🗺️", label: "Yol" },
          { id: "notes", icon: "📝", label: "Notlar" },
          { id: "focus", icon: "⏱️", label: "Focus" },
        ].map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
    </>
  );
}

export default function AppWithGoogleAuth() {
  // Eğer Google Client ID varsa OAuth Provider ile wrap et
  if (GOOGLE_ENABLED) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    );
  }
  
  // Yoksa direkt App'i döndür
  return <App />;
}