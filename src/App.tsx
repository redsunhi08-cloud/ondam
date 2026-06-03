import React, { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, Compass, Moon, CreditCard, ChevronRight, Menu, X, 
  Calendar, Clock, User, Phone, CheckCircle2, Star, BookOpen, MessageSquare, History, ArrowRight
} from 'lucide-react';
import { TarotRoom } from './components/TarotRoom';
import { BookingForm } from './components/BookingForm';
import { ReviewList } from './components/ReviewList';
import { Booking, CardReading } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'tarot' | 'my-bookings'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedMenu, setPreselectedMenu] = useState<string | undefined>(undefined);
  
  // Storage states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [readingHistory, setReadingHistory] = useState<CardReading[]>([]);

  // Load bookings and reading history from localStorage on load
  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem('ondam_bookings');
      if (savedBookings) setBookings(JSON.parse(savedBookings));
      
      const savedHistory = localStorage.getItem('ondam_readings');
      if (savedHistory) setReadingHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error("Error loading localStorage:", e);
    }
  }, []);

  const handleBookingSuccess = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('ondam_bookings', JSON.stringify(updated));
  };

  const handleSaveReading = (newReading: CardReading) => {
    const updated = [newReading, ...readingHistory];
    setReadingHistory(updated);
    localStorage.setItem('ondam_readings', JSON.stringify(updated));
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm("예약을 정말로 취소하시겠습니까?")) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem('ondam_bookings', JSON.stringify(updated));
    }
  };

  const triggerBookingWithMenu = (menuName: string) => {
    setPreselectedMenu(menuName);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-primary flex flex-col font-sans transition-all duration-300">
      
      {/* 1. Header (Navbar) */}
      <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border/60">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          <button 
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 focus:outline-none"
          >
            <span className="font-manrope font-extrabold text-sm tracking-widest text-primary uppercase">
              ONDAM TAROT
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-brand-muted uppercase">
            <button 
              onClick={() => setActiveTab('home')}
              className={`hover:text-primary transition-colors pb-1 border-b-2 ${
                activeTab === 'home' ? 'text-primary border-gold' : 'border-transparent'
              }`}
            >
              온담 소개 (Home)
            </button>
            <button 
              onClick={() => setActiveTab('tarot')}
              className={`hover:text-primary transition-colors pb-1 border-b-2 flex items-center gap-1 ${
                activeTab === 'tarot' ? 'text-primary border-gold' : 'border-transparent'
              }`}
            >
              <Sparkles className="w-3 h-3 text-gold" />
              AI 타로 (Read Tarot)
            </button>
            <button 
              onClick={() => setActiveTab('my-bookings')}
              className={`hover:text-primary transition-colors pb-1 border-b-2 flex items-center gap-1 relative ${
                activeTab === 'my-bookings' ? 'text-primary border-gold' : 'border-transparent'
              }`}
            >
              나의 예약 ({bookings.length})
              {bookings.length > 0 && (
                <span className="absolute -top-1.5 -right-3 w-1.5 h-1.5 bg-gold rounded-full"></span>
              )}
            </button>
          </nav>

          {/* Booking Trigger on Desktop header */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => {
                setPreselectedMenu(undefined);
                setIsBookingOpen(true);
              }}
              id="header-btn-booking"
              className="bg-primary hover:bg-primary-deep text-white text-[11px] font-bold px-4 py-2 rounded-full transition-all duration-300"
            >
              상담 예약하기
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:text-gold transition-colors focus:outline-none"
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-bg max-w-5xl mx-auto px-4 py-4 border-t border-brand-border space-y-4 text-center animate-fade-in">
            <div className="flex flex-col gap-3 font-semibold text-xs tracking-wider uppercase text-brand-muted">
              <button 
                onClick={() => {
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 rounded-xl transition duration-200 ${
                  activeTab === 'home' ? 'bg-secondary-container text-primary font-bold' : ''
                }`}
              >
                온담 소개
              </button>
              <button 
                onClick={() => {
                  setActiveTab('tarot');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 rounded-xl transition duration-200 flex items-center justify-center gap-1 ${
                  activeTab === 'tarot' ? 'bg-secondary-container text-primary font-bold' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                AI 타로 해석
              </button>
              <button 
                onClick={() => {
                  setActiveTab('my-bookings');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2 rounded-xl transition duration-200 ${
                  activeTab === 'my-bookings' ? 'bg-secondary-container text-primary font-bold' : ''
                }`}
              >
                나의 예약 정보 ({bookings.length})
              </button>
            </div>
            
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setPreselectedMenu(undefined);
                setIsBookingOpen(true);
              }}
              className="w-full bg-primary text-white text-xs font-bold py-2.5 rounded-xl block"
            >
              실시간 예약창 열기
            </button>
          </div>
        )}
      </header>

      {/* 2. Main Content Tab Views */}
      <main className="flex-1 w-full relative">
        
        {/* TAB 1: Home/Landing Page (Exact matching screenshots) */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-20">
            
            {/* Hero / Landing Top Header Banner */}
            <section className="relative overflow-hidden bg-gradient-to-b from-brand-light to-brand-bg pt-12 pb-16 px-4">
              <div className="max-w-xl mx-auto text-center space-y-5">
                
                <span className="inline-block bg-[#eee5db] text-primary-container text-[11px] font-bold tracking-widest px-4 py-1.5 rounded-full uppercase">
                  HEALING & WISDOM
                </span>
                
                <h1 className="text-3xl md:text-4xl font-extrabold font-manrope text-primary tracking-tight leading-tight uppercase">
                  당신의 마음을 따뜻하게<br />
                  읽어드립니다
                </h1>
                
                <p className="text-brand-muted text-xs md:text-sm font-medium leading-relaxed max-w-sm mx-auto">
                  지금, 당신이 가장 궁금한 그 마음<br />
                  온담타로에서 부드럽게 풀어드립니다
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setPreselectedMenu(undefined);
                      setIsBookingOpen(true);
                    }}
                    id="hero-booking-cta"
                    className="w-full max-w-xs bg-primary hover:bg-primary-deep text-white font-semibold py-3.5 px-6 rounded-2xl transition duration-300 shadow-md transform hover:scale-[1.01]"
                  >
                    지금 타로 상담 예약하기
                  </button>
                  <span className="block text-[11px] text-brand-muted mt-3 font-medium">
                    ✔ 온라인 리딩 • 전화 상담 • 네이버 예약 가능
                  </span>
                </div>
              </div>
            </section>

            {/* AI Callout Banner: Draws users to do the Interactive card reading! */}
            <section className="max-w-2xl mx-auto px-4">
              <div className="bg-brand-card border border-brand-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-xl pointer-events-none"></div>
                <div className="space-y-1.5 text-center md:text-left">
                  <span className="text-[10px] font-bold text-gold tracking-widest uppercase block">FREE INTERACTIVE EXPERIENCES</span>
                  <h4 className="text-lg font-bold font-manrope text-primary">온담 AI 힐러와의 실시간 타로 대화</h4>
                  <p className="text-brand-muted text-xs max-w-sm leading-relaxed">
                    복잡한 가입 없이 지금 품고 계시는 질문을 적어 즉석에서 3장의 카드를 뽑고 해석을 즉석 수령하세요.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('tarot')}
                  className="bg-primary hover:bg-primary-deep text-white text-xs font-semibold py-3 px-5 rounded-xl transition duration-200 flex items-center gap-1 whitespace-nowrap shadow-xs"
                >
                  <span>AI 타로방 입장</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </button>
              </div>
            </section>

            {/* Special Services (온담타로만의 특별한 서비스) */}
            <section className="max-w-2xl mx-auto px-4 space-y-8">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold font-manrope tracking-tight text-primary">
                  온담타로만의 특별한 서비스
                </h3>
                <div className="w-10 h-0.5 bg-primary mx-auto mt-2.5 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. 연애 흐름 분석 */}
                <div className="bg-white border border-brand-border rounded-2xl p-5 md:p-6 transition duration-200">
                  <div className="w-11 h-11 bg-brand-light border border-brand-border rounded-xl flex items-center justify-center text-primary mb-4 shadow-xxs">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-xs font-bold text-primary tracking-widest uppercase mb-1">연애 흐름 분석</h4>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    현재의 연애 기류와 다가올 변화를 세밀하게 살핍니다.
                  </p>
                </div>

                {/* 2. 상대방 속마음 리딩 */}
                <div className="bg-white border border-brand-border rounded-2xl p-5 md:p-6 transition duration-200">
                  <div className="w-11 h-11 bg-brand-light border border-brand-border rounded-xl flex items-center justify-center text-primary mb-4 shadow-xxs">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-xs font-bold text-primary tracking-widest uppercase mb-1">상대방 속마음 리딩</h4>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    말하지 못한 진심과 숨겨진 감정의 결을 읽어드립니다.
                  </p>
                </div>

                {/* 3. 진로 방향성 제시 */}
                <div className="bg-white border border-brand-border rounded-2xl p-5 md:p-6 transition duration-200">
                  <div className="w-11 h-11 bg-brand-light border border-brand-border rounded-xl flex items-center justify-center text-primary mb-4 shadow-xxs">
                    <Compass className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-xs font-bold text-primary tracking-widest uppercase mb-1">진로 방향성 제시</h4>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    나아가야 할 길에 대한 확신과 시기적 조언을 제시합니다.
                  </p>
                </div>

                {/* 4. 금전 흐름 체크 */}
                <div className="bg-white border border-brand-border rounded-2xl p-5 md:p-6 transition duration-200">
                  <div className="w-11 h-11 bg-brand-light border border-brand-border rounded-xl flex items-center justify-center text-primary mb-4 shadow-xxs">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-xs font-bold text-primary tracking-widest uppercase mb-1">금전 흐름 체크</h4>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    재물운의 흐름과 투자, 결정에 대한 지혜를 나눕니다.
                  </p>
                </div>

              </div>
            </section>

            {/* Main Booking Catalog Column (상담 메뉴) */}
            <section className="max-w-2xl mx-auto px-4 space-y-6">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold font-manrope tracking-tight text-primary">
                  상담 메뉴
                </h3>
                <div className="w-10 h-0.5 bg-primary mx-auto mt-2.5 rounded-full"></div>
              </div>

              <div className="bg-white border border-brand-border rounded-3xl p-6 md:p-8 space-y-8 shadow-xs">
                
                {/* 질문형 상담 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full block"></span>
                    <h4 className="text-sm font-extrabold text-primary tracking-tight font-manrope">질문형 상담</h4>
                  </div>
                  <div className="divide-y divide-brand-border/60">
                    <div className="flex justify-between items-center py-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-primary block">1개 질문 리딩</span>
                        <span className="text-[10px] text-brand-muted block">간단하지만 정확하게 하나의 고민 타파</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-manrope text-sm text-primary">10,000원</span>
                        <button 
                          onClick={() => triggerBookingWithMenu("1개 질문 리딩")}
                          className="px-3 py-1.5 border border-brand-border hover:border-gold hover:bg-brand-light text-[10px] font-bold rounded-lg uppercase transition-all duration-200 text-brand-muted hover:text-primary"
                        >
                          예약
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-primary block">종합 3개 질문 리딩</span>
                        <span className="text-[10px] text-brand-muted block">복복잡한 운명의 가교를 해소하는 조언 모둠</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-manrope text-sm text-primary">25,000원</span>
                        <button 
                          onClick={() => triggerBookingWithMenu("종합 3개 질문 리딩")}
                          className="px-3 py-1.5 border border-brand-border hover:border-gold hover:bg-brand-light text-[10px] font-bold rounded-lg uppercase transition-all duration-200 text-brand-muted hover:text-primary"
                        >
                          예약
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 시간제 상담 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full block"></span>
                    <h4 className="text-sm font-extrabold text-primary tracking-tight font-manrope">시간제 상담</h4>
                  </div>
                  <div className="divide-y divide-brand-border/60">
                    
                    <div className="flex justify-between items-center py-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-primary block">심층 상담 10분</span>
                        <span className="text-[10px] text-brand-muted block">메이저 카드를 가동하여 빠른 의지 파악</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-manrope text-sm text-primary">15,000원</span>
                        <button 
                          onClick={() => triggerBookingWithMenu("심층 상담 10분")}
                          className="px-3 py-1.5 border border-brand-border hover:border-gold hover:bg-brand-light text-[10px] font-bold rounded-lg uppercase transition-all duration-200 text-brand-muted hover:text-primary"
                        >
                          예약
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-primary block">집중 상담 20분</span>
                        <span className="text-[10px] text-brand-muted block">심도 깊은 1:1 라이브 해석과 고민 융해</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-manrope text-sm text-primary">28,000원</span>
                        <button 
                          onClick={() => triggerBookingWithMenu("집중 상담 20분")}
                          className="px-3 py-1.5 border border-brand-border hover:border-gold hover:bg-brand-light text-[10px] font-bold rounded-lg uppercase transition-all duration-200 text-brand-muted hover:text-primary"
                        >
                          예약
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-primary block">마음 치유 30분</span>
                        <span className="text-[10px] text-brand-muted block">온담의 모든 역량을 동원한 웰니스 성찰 상담</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-manrope text-sm text-primary">40,000원</span>
                        <button 
                          onClick={() => triggerBookingWithMenu("마음 치유 30분")}
                          className="px-3 py-1.5 border border-brand-border hover:border-gold hover:bg-brand-light text-[10px] font-bold rounded-lg uppercase transition-all duration-200 text-brand-muted hover:text-primary"
                        >
                          예약
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* Photographic Image Banner matching the screenshot */}
            <section className="w-full">
              <div className="max-w-2xl mx-auto px-4">
                <div className="w-full h-56 rounded-3xl overflow-hidden shadow-md relative border border-brand-border">
                  <img 
                    src="https://images.unsplash.com/photo-1594951498114-1e52fc8d447f?q=80&w=800" 
                    alt="Aesthetic Rider-Waite Tarot Cards" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
              </div>
            </section>

            {/* Testimonials Review List */}
            <section className="max-w-2xl mx-auto px-4">
              <ReviewList />
            </section>

          </div>
        )}

        {/* TAB 2: AI Tarot Reading Room */}
        {activeTab === 'tarot' && (
          <section className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <TarotRoom onSaveReading={handleSaveReading} />
          </section>
        )}

        {/* TAB 3: My Bookings & Histories Dashboard (User persisted storage panel) */}
        {activeTab === 'my-bookings' && (
          <section className="max-w-2xl mx-auto px-4 py-8 md:py-12 space-y-8 font-sans">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold font-manrope tracking-tight text-primary">나의 온담 치유 다이어리</h3>
              <p className="text-brand-muted text-xs mt-1">이전에 진행하신 예약 목록과 진행하신 AI 타로 카드가 안전하게 보관됩니다.</p>
              <div className="w-10 h-0.5 bg-primary mx-auto mt-2.5 rounded-full"></div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <h4 className="text-sm font-extrabold text-primary uppercase">예약하신 리딩 상담 현황 ({bookings.length})</h4>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-white border border-brand-border rounded-2xl p-8 text-center space-y-3">
                  <p className="text-xs text-brand-muted leading-relaxed">아직 등록된 예약 상담이 없습니다. 온담 홈에서 나를 위한 상담을 신청해보세요.</p>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="bg-primary text-white text-xs font-semibold py-2 px-4 rounded-xl inline-block"
                  >
                    메뉴 둘러보기
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="bg-white border border-brand-border rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gold/30 transition duration-200">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-secondary-container text-primary px-2.5 py-0.5 rounded-md font-mono">{b.id}</span>
                          <span className="text-xs font-bold text-primary">{b.menuItem}</span>
                        </div>
                        <p className="text-xs text-brand-muted">신청자: {b.customerName} 님 • 예약시각: {b.date} • {b.timeSlot}</p>
                        {b.notes && <p className="text-[11px] text-brand-muted italic mt-0.5">내용: "{b.notes}"</p>}
                      </div>
                      <div className="flex flex-col md:items-end justify-between w-full md:w-auto gap-2">
                        <span className="text-sm font-extrabold text-gold font-manrope">{b.price}</span>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold bg-[#edf7ed] text-[#1e4620] px-2.5 py-1 rounded-md">예약확정</span>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="text-[10px] text-brand-muted hover:text-red-500 font-medium underline px-1"
                          >
                            예약 취소
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Custom Readings List */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gold fill-current" />
                <h4 className="text-sm font-extrabold text-primary uppercase">지난 AI 타로 읽기 기록 ({readingHistory.length})</h4>
              </div>

              {readingHistory.length === 0 ? (
                <div className="bg-white border border-brand-border rounded-2xl p-8 text-center text-xs text-brand-muted">
                  아직 뽑으신 AI 타로 카드가 없습니다. 상단 메뉴의 "AI 타로"에 들러보세요.
                </div>
              ) : (
                <div className="space-y-4">
                  {readingHistory.map((h) => (
                    <div key={h.id} className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-gold font-bold block">{h.id}</span>
                          <h5 className="text-xs font-bold text-primary font-manrope">“{h.question}”</h5>
                        </div>
                        <span className="text-[10px] text-brand-muted bg-white border border-brand-border px-2 py-0.5 rounded-md font-semibold">{h.category}</span>
                      </div>

                      {/* Drawn cards recall */}
                      <div className="flex gap-2 justify-center max-w-xs mx-auto py-2 bg-white rounded-xl border border-brand-border">
                        {h.drawnCards.map((dc, index) => (
                          <div key={index} className="text-center flex flex-col items-center">
                            <span className="text-[8px] text-gold font-bold block">카드 {index + 1}</span>
                            <span className="text-[10px] font-semibold text-primary">{dc.card.name}</span>
                            <span className="text-[8px] text-brand-muted">({dc.isReversed ? '역' : '정'})</span>
                          </div>
                        ))}
                      </div>

                      <details className="group">
                        <summary className="text-xs font-bold text-primary hover:text-gold cursor-pointer flex items-center justify-between py-1 outline-none select-none">
                          <span>이전 리딩 해석 다시보기</span>
                          <ChevronRight className="w-4 h-4 transform group-open:rotate-90 transition-transform text-brand-muted" />
                        </summary>
                        <div className="p-3 bg-white border border-brand-border rounded-xl text-xs text-brand-muted mt-2 max-h-60 overflow-y-auto">
                          {h.interpretation}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* 3. conversion callout button & Footer background matching screen */}
      <footer className="footer bg-primary text-white mt-auto font-sans pb-10">
        
        {/* Footer Accent/Call to Action container identical to screenshot */}
        <div className="bg-primary-deep text-center py-16 px-4 border-b border-white/5 space-y-6">
          <div className="max-w-md mx-auto space-y-3">
            <h4 className="text-md md:text-lg font-bold tracking-tight">
              지금 고민하고 있는 그 문제,<br />
              혼자 끌어안지 마세요.
            </h4>
            <p className="text-[11px] text-[#e9c2a8] leading-relaxed max-w-xs mx-auto font-medium">
              온담타로가 따뜻하고 현실적인 리딩으로<br />
              함께하겠습니다.
            </p>
          </div>

          <button 
            onClick={() => {
              setPreselectedMenu(undefined);
              setIsBookingOpen(true);
            }}
            id="footer-btn-conversion-booking"
            className="w-full max-w-xs bg-white text-primary font-bold py-3 px-6 rounded-full text-xs hover:bg-brand-bg transition duration-300 shadow-md"
          >
            네이버 예약 바로가기
          </button>
        </div>

        {/* Operational / Company footer details (matching screenshot) */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-10 text-center space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black tracking-widest text-white font-manrope">ONDAM TAROT</span>
              
              <div className="flex justify-center gap-6 text-[10px] text-[#e9c2a8] font-bold uppercase tracking-wider">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-200">INSTAGRAM</a>
                <a href="https://blog.naver.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-200">NAVER BLOG</a>
                <a href="https://pf.kakao.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-200">KAKAOTALK</a>
              </div>

              <div className="text-[10px] text-[#e9c2a8] hover:text-white transition duration-200">
                <a href="#" className="underline">PRIVACY POLICY</a>
              </div>
            </div>

            <div className="text-[10px] text-white/60 space-y-1.5 leading-relaxed max-w-sm mx-auto">
              <p>상호: 온담타로 | 상담시간: 오전 10시 - 오후 10시 (연중무휴)</p>
              <p>© 2024 Ondam Tarot. Healing & Wisdom.</p>
            </div>
        </div>
      </footer>

      {/* 4. Booking Dialog Overlay (Modal popup sheet) */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-brand-bg rounded-3xl p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-brand-border relative">
            <BookingForm 
              onClose={() => setIsBookingOpen(false)} 
              onBookingSuccess={handleBookingSuccess}
              initialMenu={preselectedMenu}
            />
          </div>
        </div>
      )}

    </div>
  );
}
