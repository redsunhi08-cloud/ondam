import React, { useState } from 'react';
import { HelpCircle, RefreshCw, Send, Sparkles, Heart, Clock, Award, ShieldAlert, Compass } from 'lucide-react';
import { TAROT_DECK, TarotCard, CardReading } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface TarotRoomProps {
  onSaveReading: (reading: CardReading) => void;
}

export const TarotRoom: React.FC<TarotRoomProps> = ({ onSaveReading }) => {
  const [step, setStep] = useState<'info' | 'shuffle' | 'reveal' | 'reading'>('info');
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<'love' | 'mind' | 'career' | 'finance'>('love');
  
  // Shuffling & Selection state
  const [deck, setDeck] = useState<TarotCard[]>(TAROT_DECK);
  const [shuffling, setShuffling] = useState(false);
  const [drawnCards, setDrawnCards] = useState<{ card: TarotCard; isReversed: boolean }[]>([]);
  
  // Gemini AI Interpretation State
  const [loading, setLoading] = useState(false);
  const [readingResult, setReadingResult] = useState<string>('');
  const [followUps, setFollowUps] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [followInput, setFollowInput] = useState('');
  const [isAiAnswering, setIsAiAnswering] = useState(false);

  const categories = [
    { id: 'love', name: '연애 흐름 분석', icon: '❤️', desc: '현재의 연애 기류와 다가올 변화를 세밀히 살핍니다' },
    { id: 'mind', name: '상대방 속마음 리딩', icon: '🧠', desc: '말하지 못한 진심과 숨겨진 감정의 결을 정성스레 읽어드립니다' },
    { id: 'career', name: '진로 방향성 제시', icon: '🧭', desc: '나아가야 할 길에 대한 확신과 시기적 조언을 제시합니다' },
    { id: 'finance', name: '금전 흐름 체크', icon: '💰', desc: '재물운의 흐름과 투자, 결정에 대한 지혜를 나눕니다' }
  ] as const;

  const handleStartShuffle = () => {
    if (!question.trim()) {
      alert("현재 품고 계시는 질문이나 고민을 입력해 주세요.");
      return;
    }
    setStep('shuffle');
    setDrawnCards([]);
  };

  const runShuffle = () => {
    setShuffling(true);
    setTimeout(() => {
      // Elegant modern Fisher-Yates array shuffling
      const newDeck = [...TAROT_DECK];
      for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
      }
      setDeck(newDeck);
      setShuffling(false);
    }, 1200);
  };

  const handlePickCard = () => {
    if (shuffling) return;
    if (drawnCards.length >= 3) return;

    // Pick a card that hasn't been drawn yet
    const remainingCards = deck.filter(c => !drawnCards.some(dw => dw.card.id === c.id));
    if (remainingCards.length === 0) return;

    const randomIndex = Math.floor(Math.random() * remainingCards.length);
    const selectedCard = remainingCards[randomIndex];
    
    // Upright vs Reversed (20% reversed probability)
    const isReversed = Math.random() < 0.2;

    const newDraw = [...drawnCards, { card: selectedCard, isReversed }];
    setDrawnCards(newDraw);

    if (newDraw.length === 3) {
      setStep('reveal');
    }
  };

  const handleAskAI = async () => {
    setLoading(true);
    setStep('reading');
    
    try {
      const response = await fetch("/api/tarot/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          question,
          drawnCards: drawnCards.map(dc => ({
            name: dc.card.name,
            englishName: dc.card.englishName,
            isReversed: dc.isReversed,
            keywords: dc.card.keywords,
            meaningUpright: dc.card.meaningUpright,
            meaningReversed: dc.card.meaningReversed
          }))
        })
      });

      const data = await response.json();
      if (data.interpretation) {
        setReadingResult(data.interpretation);
        
        // Save to booking dashboard history
        onSaveReading({
          id: "RD-" + Date.now().toString().substring(6),
          date: new Date().toISOString().split('T')[0],
          category: categories.find(c => c.id === category)?.name || "",
          question,
          drawnCards,
          interpretation: data.interpretation
        });
      } else {
        setReadingResult("타로 카드의 결을 해석하는 도중 조그만 혼선이 있었습니다. 잠시 후 다시 시도해 주세요.");
      }
    } catch (e) {
      console.error(e);
      setReadingResult("죄송합니다. 서버 통신 오류가 발생했습니다. 잠시 후 다시 힐링을 연계해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followInput.trim() || isAiAnswering) return;

    const userMsg = followInput.trim();
    setFollowUps(prev => [...prev, { sender: 'user', text: userMsg }]);
    setFollowInput('');
    setIsAiAnswering(true);

    try {
      // Craft prompt for follow-up
      const response = await fetch("/api/tarot/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          question: `지속 질문: "${userMsg}" (이전 고민: "${question}")`,
          drawnCards: drawnCards.map(dc => ({
            name: dc.card.name,
            englishName: dc.card.englishName,
            isReversed: dc.isReversed,
            keywords: dc.card.keywords,
            meaningUpright: dc.card.meaningUpright,
            meaningReversed: dc.card.meaningReversed
          }))
        })
      });

      const data = await response.json();
      setFollowUps(prev => [...prev, { 
        sender: 'ai', 
        text: data.interpretation || "카드가 주는 영감이 침묵을 택한 듯하네요. 다시 질문해주시겠습니까?" 
      }]);
    } catch {
      setFollowUps(prev => [...prev, { 
        sender: 'ai', 
        text: "치유 주파수를 맞추는 데 실패했습니다. 통신 상황을 한 번만 봐주세요." 
      }]);
    } finally {
      setIsAiAnswering(false);
    }
  };

  const handleReset = () => {
    setStep('info');
    setQuestion('');
    setDrawnCards([]);
    setFollowUps([]);
    setReadingResult('');
  };

  return (
    <div id="tarot-room-container" className="bg-white border border-brand-border rounded-3xl p-6 md:p-8 shadow-xs max-w-4xl mx-auto font-sans relative overflow-hidden">
      
      {/* Decorative Gold Stars/Circles */}
      <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-gold/5 blur-xl pointer-events-none"></div>

      {step === 'info' && (
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center mb-1">
            <Sparkles className="w-6 h-6 text-gold animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-manrope text-primary tracking-tight">Ondam AI 3카드 타로 리딩</h3>
            <p className="text-brand-muted text-xs md:text-sm mt-1 max-w-md mx-auto leading-relaxed">
              온담타로가 엄선한 22장의 메이저 아르카나 카드를 직접 뽑아, 고민에 맞는 치유와 지혜의 해결책을 Gemini AI의 고운 목소리로 도출해 드립니다.
            </p>
          </div>

          {/* Select Category */}
          <div className="space-y-3 text-left max-w-md mx-auto">
            <label className="text-xs font-bold text-primary tracking-widest block uppercase">실천을 위한 리딩 카테고리</label>
            <div className="grid grid-cols-2 gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 text-left rounded-2xl border transition-all duration-300 ${
                    category === cat.id
                      ? "border-gold bg-secondary-container ring-1 ring-gold scale-102"
                      : "border-brand-border bg-brand-light hover:border-gold/30 hover:bg-white"
                  }`}
                >
                  <span className="text-lg mb-1 block">{cat.icon}</span>
                  <span className="font-semibold text-primary text-xs block">{cat.name}</span>
                  <span className="text-[10px] text-brand-muted block mt-0.5 leading-tight line-clamp-1">{cat.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Enter Question input */}
          <div className="space-y-2 text-left max-w-md mx-auto">
            <label className="text-xs font-bold text-primary tracking-widest block uppercase">당신의 고민 혹은 치유의 질문</label>
            <div className="relative">
              <textarea
                rows={3}
                required
                id="input-tarot-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 이번 상반기 이직운이 있을까요? 혹은 상대방을 향한 저의 소통 방식은 어떤가요?"
                className="w-full p-4 text-sm bg-brand-light rounded-2xl border border-brand-border focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder:text-brand-muted/70 resize-none font-sans"
              />
            </div>
            <p className="text-[10px] text-brand-muted text-right">
              최대한 진정성을 담아 상세하게 질문을 적을수록 카드의 기적이 더욱 정확해집니다.
            </p>
          </div>

          <button
            onClick={handleStartShuffle}
            id="btn-goto-tarot-shuffle"
            className="w-full max-w-md bg-primary hover:bg-primary-deep text-white font-medium py-3 rounded-2xl mt-4 transition duration-300 shadow-md transform hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-gold fill-current" />
            <span>타로 셔플하러 떠나기</span>
          </button>
        </div>
      )}

      {step === 'shuffle' && (
        <div className="text-center py-6 space-y-6">
          <div>
            <span className="text-[10px] font-bold text-gold tracking-widest uppercase block mb-1">Interactive Shuffle Room</span>
            <h3 className="text-xl font-bold text-primary font-manrope">정성스레 마음을 실어 카드를 섞어주세요</h3>
            <p className="text-brand-muted text-xs mt-1">이 마음의 고민에 대한 지혜의 3카드를 선택할 것입니다 ({drawnCards.length}/3 뽑음)</p>
          </div>

          {/* Simulated Tarot Pile with Shuffle Kinetics */}
          <div className="relative py-12 flex justify-center items-center h-48 max-w-md mx-auto bg-brand-light rounded-3xl border border-dashed border-brand-border">
            {shuffling ? (
              <div className="flex -space-x-12 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-20 h-32 bg-primary rounded-xl border-2 border-gold shadow-md transform rotate-12 origin-bottom transition duration-500"
                    style={{
                      transform: `rotate(${(i - 2.5) * 15}deg) translate(${shuffling ? (Math.sin(i) * 20) : 0}px, 0px)`
                    }}
                  >
                    {/* Mystic Back Design */}
                    <div className="w-full h-full rounded-lg bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container via-primary to-primary-deep p-2 flex items-center justify-center">
                      <div className="w-full h-full border border-gold/40 rounded-md flex items-center justify-center">
                        <StarWidget />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <button 
                type="button"
                onClick={handlePickCard}
                className="relative group focus:outline-none cursor-pointer"
              >
                {/* Visual Cards stack pile */}
                <div className="flex -space-x-10 hover:-space-x-8 transition-all duration-300">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-32 bg-primary rounded-xl border-2 border-gold shadow-md transform origin-bottom transition-all duration-300 group-hover:rotate-6"
                      style={{
                        transform: `rotate(${(i - 2) * 8}deg) translateY(${Math.abs(i - 2) * 6}px)`,
                        zIndex: 10 + i
                      }}
                    >
                      <div className="w-full h-full rounded-lg bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container via-primary to-primary-deep p-1 flex items-center justify-center">
                        <div className="w-full h-full border border-gold/40 rounded flex items-center justify-center">
                          {i === 2 && <StarWidget />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold bg-primary text-white py-1.5 px-4 rounded-full mt-2 group-hover:bg-gold transition duration-200 shadow-xs">
                  상단의 카드 더미를 클릭하여 1장씩 선택
                </div>
              </button>
            )}
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={runShuffle}
              disabled={shuffling}
              id="btn-shuffle-deck"
              className="px-5 py-2.5 rounded-xl border border-brand-border bg-white text-xs text-primary font-medium hover:border-gold hover:bg-brand-light transition duration-200 flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gold ${shuffling ? 'animate-spin' : ''}`} />
              <span>카드 다시 섞기</span>
            </button>
            
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-brand-border bg-white text-xs text-brand-muted hover:text-primary transition duration-200"
            >
              취소하기
            </button>
          </div>

          {/* Delineate drawn slots */}
          <div className="border-t border-brand-border pt-6">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">현재 나의 카드 드로우 상황</h4>
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {[0, 1, 2].map((slotIndex) => {
                const drawn = drawnCards[slotIndex];
                return (
                  <div 
                    key={slotIndex} 
                    className={`h-28 rounded-xl border flex flex-col items-center justify-center p-2 relative ${
                      drawn 
                        ? 'border-gold bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary-container to-white text-primary' 
                        : 'border-dashed border-brand-border bg-brand-light text-brand-muted'
                    }`}
                  >
                    {drawn ? (
                      <div className="text-center animate-pulse">
                        <span className="text-[10px] text-gold font-bold block">CARD {slotIndex + 1}</span>
                        <span className="text-xs font-semibold font-manrope line-clamp-1 block mt-1">{drawn.card.name}</span>
                        <span className="text-[9px] text-brand-muted block">{drawn.isReversed ? '역방향' : '정방향'}</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <HelpCircle className="w-5 h-5 mx-auto opacity-40 mb-1" />
                        <span className="text-[10px] block">카드 {slotIndex + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 'reveal' && (
        <div className="text-center py-6 space-y-6">
          <div>
            <span className="text-[10px] font-bold text-gold tracking-widest uppercase block mb-1">Reveal Insights</span>
            <h3 className="text-xl font-bold text-primary font-manrope">완벽하게 3장의 카드를 완성하셨습니다</h3>
            <p className="text-brand-muted text-xs mt-1">의문의 갈래에서 당신을 이끌어 줄 따뜻한 지혜입니다.</p>
          </div>

          {/* Grid Layout of Selected Cards with Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-2xl mx-auto my-6">
            {drawnCards.map((dc, idx) => {
              const position = idx === 0 ? "과거 • 시작" : idx === 1 ? "현재 • 상황" : "미래 • 조언";
              return (
                <div 
                  key={idx}
                  className="bg-brand-card border border-brand-border hover:border-gold/30 rounded-2xl p-4 transition-all duration-300 flex flex-col items-center text-center relative"
                >
                  <span className="text-[10px] font-bold text-gold tracking-widest uppercase bg-white/80 border border-brand-border px-3 py-1 rounded-full absolute -top-3.5">
                    {position}
                  </span>

                  {/* Elegant Hotlinked Image from Unsplash with Reversed visual representation! */}
                  <div className="w-full aspect-[2/3] max-w-[130px] rounded-xl overflow-hidden mt-2 relative border border-brand-border">
                    <img 
                      src={dc.card.imageUrl} 
                      alt={dc.card.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                        dc.isReversed ? 'rotate-180' : ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none"></div>
                  </div>

                  <h4 className="text-md font-bold text-primary font-manrope mt-4">
                    {dc.card.name} ({dc.card.englishName})
                  </h4>
                  
                  <span className="text-[11px] font-medium text-gold mt-1">
                    {dc.isReversed ? '역방향 (Reversed)' : '정방향 (Upright)'}
                  </span>

                  <p className="text-[11px] text-brand-muted mt-2 block leading-relaxed line-clamp-3">
                    {dc.isReversed ? dc.card.meaningReversed : dc.card.meaningUpright}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 max-w-md mx-auto space-y-3">
            <button
              onClick={handleAskAI}
              id="btn-trigger-ai-reading"
              className="w-full bg-primary hover:bg-primary-deep text-white font-medium py-3.5 rounded-2xl transition duration-300 shadow-md flex items-center justify-center gap-2 transform hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-gold fill-current" />
              <span>온담 AI 힐러에게 깊은 리딩 받기</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full text-xs text-brand-muted hover:text-primary transition duration-150 py-2.5 underline"
            >
              처음부터 다시 뽑기
            </button>
          </div>
        </div>
      )}

      {step === 'reading' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 px-4 space-y-6 animate-pulse">
              <div className="relative w-20 h-20 bg-secondary-container rounded-full mx-auto flex items-center justify-center ambient-glow">
                <Sparkles className="w-10 h-10 text-gold animate-spin" />
              </div>
              <div className="max-w-sm mx-auto space-y-3">
                <h4 className="text-lg font-bold text-primary font-manrope">온담에서 타로 주파수를 조율하는 중입니다</h4>
                <p className="text-brand-muted text-xs leading-relaxed">
                  질문자의 고민을 온담의 향기와 결합하여 우주의 소리를 따뜻하게 정리하고 있습니다. 10초 가량 소요됩니다...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Question Banner */}
              <div className="bg-brand-light border border-brand-border rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gold tracking-widest block uppercase">QUESTIONED IN ONDAM ROOM</span>
                  <h4 className="text-md font-bold text-primary font-manrope">“{question}”</h4>
                  <p className="text-xs text-brand-muted">카테고리: {categories.find(c => c.id === category)?.name}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="whitespace-nowrap px-4 py-2 border border-brand-border bg-white rounded-xl text-xs text-brand-muted hover:text-primary hover:bg-brand-light transition duration-150 font-medium"
                >
                  새로운 상담 시작
                </button>
              </div>

              {/* Display Drawn Cards small header row for context recall */}
              <div className="bg-white border border-brand-border rounded-2xl p-4">
                <h5 className="text-[10px] font-extrabold text-gold tracking-widest uppercase mb-3 text-center">선택한 카드 결</h5>
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                  {drawnCards.map((dw, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div className="w-10 aspect-[2/3] rounded-md overflow-hidden relative border border-brand-border">
                        <img 
                          src={dw.card.imageUrl} 
                          alt={dw.card.name} 
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover ${dw.isReversed ? 'rotate-180' : ''}`}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-primary mt-1 line-clamp-1">{dw.card.name}</span>
                      <span className="text-[8px] text-brand-muted">{dw.isReversed ? '역방향' : '정방향'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main AI Interpretation Container */}
              <div className="bg-brand-card border border-brand-border rounded-3xl p-6 md:p-8 relative">
                <div className="absolute top-4 right-4 text-xs font-bold text-gold uppercase tracking-widest flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-brand-border">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> 힐링 리딩 완료
                </div>

                <div id="ai-tarot-markdown-output" className="prose max-w-none pt-4">
                  <MarkdownRenderer content={readingResult} />
                </div>
              </div>

              {/* Interactive Follow-Up Chat Session */}
              <div className="bg-brand-light border border-brand-border rounded-3xl p-5 md:p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-primary font-manrope">더 깊이 물어보고 싶으신가요?</h4>
                  <p className="text-[11px] text-brand-muted mt-0.5">상담가가 드린 리딩 내용이나 카드에 관한 의문에 대해 추가로 대화해보세요.</p>
                </div>

                {/* Chat Feed */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {followUps.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-white border border-brand-border text-brand-muted rounded-bl-none'
                      }`}>
                        {msg.sender === 'ai' ? (
                          <div className="prose markdown-body">
                            <MarkdownRenderer content={msg.text} />
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>
                  ))}

                  {isAiAnswering && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-brand-border rounded-2xl rounded-bl-none p-3.5 max-w-[80%] text-xs text-brand-muted animate-pulse flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" />
                        <span>의문을 온담의 렌즈로 성찰하는 중입니다...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Follow up Chat Input bar */}
                <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
                  <input
                    type="text"
                    required
                    id="input-tarot-followup"
                    value={followInput}
                    onChange={(e) => setFollowInput(e.target.value)}
                    disabled={isAiAnswering}
                    placeholder="예: 과거 자리에 나온 마법사 역방향 카드가 주는 진짜 교훈은 뭘까요?"
                    className="flex-1 bg-white border border-brand-border rounded-xl text-xs p-3 focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    id="btn-submit-followup"
                    disabled={!followInput.trim() || isAiAnswering}
                    className="p-3 px-4 bg-primary text-white rounded-xl hover:bg-primary-deep transition-all duration-200 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Internal small decorative helper for card back designs
const StarWidget: React.FC = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    className="w-4 h-4 text-gold/60"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1} 
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.49 10.1c-.772-.565-.373-1.81.587-1.81H7.98a1 1 0 00.95-.69l1.519-4.674z" 
    />
  </svg>
);

export default TarotRoom;
