import React, { useState } from 'react';
import { Star, MessageSquare, Award, PenTool, Sparkles, Send } from 'lucide-react';
import { Review } from '../types';

export const ReviewList: React.FC = () => {
  // Hardcoded initial reviews identical to the screenshot!
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "REV-1",
      name: "김**",
      rating: 5,
      comment: "진짜 속마음 맞아서 소름 돋았어요. 고민하던 지점을 정확히 짚어주셔서 놀랐습니다.",
      menuItem: "상대방 속마음 리딩",
      date: "2026-06-01"
    },
    {
      id: "REV-2",
      name: "이**",
      rating: 5,
      comment: "막막했는데 방향이 보였어요. 현실적인 해결책까지 말씀해주셔서 마음이 편해졌네요.",
      menuItem: "진로 방향성 제시",
      date: "2026-05-30"
    },
    {
      id: "REV-3",
      name: "박**",
      rating: 5,
      comment: "위로받는 느낌이라 또 올 것 같아요. 따뜻한 말씀 하나하나가 큰 힘이 되었습니다.",
      menuItem: "마음 치유 30분",
      date: "2026-05-28"
    }
  ]);

  const [newComment, setNewComment] = useState("");
  const [newName, setNewName] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [selectedConsult, setSelectedConsult] = useState("종합 3개 질문 리딩");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) {
      alert("이름과 후기 내용을 모두 작성해주세요.");
      return;
    }

    const nameFormatting = (): string => {
      const trimmed = newName.trim();
      if (trimmed.length <= 1) return trimmed + "*";
      if (trimmed.length === 2) return trimmed[0] + "*";
      return trimmed[0] + "**" + (trimmed[trimmed.length - 1] === "님" ? "" : "님");
    };

    const review: Review = {
      id: `REV-${Date.now()}`,
      name: nameFormatting(),
      rating: newRating,
      comment: newComment,
      menuItem: selectedConsult,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([review, ...reviews]);
    setNewComment("");
    setNewName("");
    setNewRating(5);
    setIsFormOpen(false);
  };

  return (
    <div id="reviews-section" className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold font-manrope tracking-tight text-primary flex items-center justify-center gap-2">
          상담 후 남겨주신 이야기
        </h3>
        <p className="text-brand-muted text-xs tracking-wider mt-1.5 font-sans font-medium">
          온담타로가 제안하는 마음의 쉼표
        </p>
        <div className="w-12 h-0.5 bg-gold mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
        {reviews.map((rev) => (
          <div 
            key={rev.id} 
            className="bg-brand-card hover:bg-white border border-brand-border hover:border-gold/30 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-0.5 shadow-xs"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < rev.rating 
                        ? "text-gold fill-current" 
                        : "text-brand-border"
                    }`} 
                  />
                ))}
              </div>
              <span className="text-xs text-brand-muted bg-brand-light pb-0.5 px-2.5 py-0.5 rounded-full border border-brand-border">
                {rev.menuItem}
              </span>
            </div>
            
            <p className="text-primary text-sm md:text-md font-sans font-medium leading-relaxed mb-3">
              “{rev.comment}”
            </p>
            
            <div className="flex justify-between items-center text-xs text-brand-muted font-sans font-medium">
              <span>— {rev.name.endsWith("님") ? rev.name : `${rev.name}님`}</span>
              <span>{rev.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Drawer Trigger */}
      <div className="max-w-md mx-auto text-center pt-3">
        {!isFormOpen ? (
          <button
            onClick={() => setIsFormOpen(true)}
            id="btn-open-review-form"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary border border-brand-border hover:border-gold/50 bg-white px-5 py-2.5 rounded-full transition-all duration-300 hover:bg-brand-light shadow-xs"
          >
            <PenTool className="w-3.5 h-3.5 text-gold" />
            <span>나의 치유 후기 들려주기</span>
          </button>
        ) : (
          <form 
            onSubmit={handleSubmitReview}
            className="bg-white border border-brand-border rounded-2xl p-5 text-left shadow-sm space-y-4 animate-fade-in"
          >
            <div className="flex justify-between items-center pb-2 border-b border-brand-border">
              <h4 className="text-sm font-bold text-primary flex items-center gap-1.5 font-manrope">
                <Sparkles className="w-4 h-4 text-gold" /> 치유 후기 작성
              </h4>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-brand-muted hover:text-primary underline"
              >
                취소
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase block mb-1">성함 / 닉네임</label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-brand-light border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase block mb-1">상담 종류</label>
                <select
                  value={selectedConsult}
                  onChange={(e) => setSelectedConsult(e.target.value)}
                  className="w-full text-xs p-2.5 bg-brand-light border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="1개 질문 리딩">1개 질문 리딩</option>
                  <option value="종합 3개 질문 리딩">종합 3개 질문 리딩</option>
                  <option value="심층 상담 10분">심층 상담 10분</option>
                  <option value="집중 상담 20분">집중 상담 20분</option>
                  <option value="마음 치유 30분">마음 치유 30분</option>
                  <option value="AI 타로 3카드 리딩">AI 타로 3카드 리딩</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-muted uppercase block mb-1">상담 만족도</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= newRating ? "text-gold fill-current" : "text-brand-border"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-muted uppercase block mb-1">정성스러운 후기 한 줄</label>
              <textarea
                required
                rows={3}
                placeholder="온담타로가 드린 마음의 해석이 어떠셨나요? 따뜻했던 순간을 다른 seeker들과 공유해보세요."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full text-xs p-3 bg-brand-light border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-gold resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-deep text-white font-medium py-3 rounded-xl transition duration-300 text-xs flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>후기 저장 및 등록</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default ReviewList;
