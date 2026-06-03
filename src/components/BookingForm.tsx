import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, User, Phone, BookOpen, ChevronRight, X, Heart } from 'lucide-react';
import { Booking } from '../types';

interface BookingFormProps {
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
  initialMenu?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onClose, onBookingSuccess, initialMenu }) => {
  const menuItems = [
    { name: "1개 질문 리딩", price: "10,000원", category: "질문형 상담" },
    { name: "종합 3개 질문 리딩", price: "25,000원", category: "질문형 상담" },
    { name: "심층 상담 10분", price: "15,000원", category: "시간제 상담" },
    { name: "집중 상담 20분", price: "28,000원", category: "시간제 상담" },
    { name: "마음 치유 30분", price: "40,000원", category: "시간제 상담" },
  ];

  const timeSlots = [
    "오전 10:00", "오전 11:00", "오후 12:30", "오후 02:00", 
    "오후 03:30", "오후 05:00", "오후 06:30", "오후 08:00", "오후 09:30"
  ];

  // Form states
  const [selectedMenu, setSelectedMenu] = useState(
    initialMenu ? (menuItems.find(item => item.name === initialMenu) || menuItems[0]) : menuItems[0]
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Generate next 14 available days for booking
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const daysName = ["일", "월", "화", "수", "목", "금", "토"];

    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const isWeekend = nextDate.getDay() === 0; // Sun is weekend but 연중무휴 (year-round) open anyway
      
      dates.push({
        fullDate: nextDate.toISOString().split('T')[0],
        dayOfMonth: nextDate.getDate(),
        dayOfWeek: daysName[nextDate.getDay()],
        isToday: i === 0,
        month: nextDate.getMonth() + 1
      });
    }
    return dates;
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !selectedDate || !selectedTime) {
      alert("모든 필수 항목(이름, 연락처, 예약일자, 시간)을 기입해주세요.");
      return;
    }

    const newBooking: Booking = {
      id: "BK-" + Math.floor(100000 + Math.random() * 900000),
      customerName: name,
      phoneNumber: phone,
      date: selectedDate,
      timeSlot: selectedTime,
      menuItem: selectedMenu.name,
      price: selectedMenu.price,
      notes: question,
      status: 'confirmed'
    };

    onBookingSuccess(newBooking);
    setIsSuccess(true);
  };

  const dates = getAvailableDates();

  if (isSuccess) {
    return (
      <div id="booking-success-modal" className="text-center py-10 px-6 font-sans">
        <div className="w-20 h-20 bg-secondary-container rounded-full mx-auto flex items-center justify-center mb-6 ring-8 ring-brand-bg relative animate-bounce">
          <Heart className="w-10 h-10 text-primary fill-current" />
        </div>
        <h3 className="text-2xl font-bold text-primary font-manrope tracking-tight mb-2">상담 예약이 접수되었습니다!</h3>
        <p className="text-brand-muted text-sm max-w-sm mx-auto mb-6 leading-relaxed">
          Ondam Tarot 오프라인/온라인 실시간 상담 예약이 안전하게 처리되었습니다. 메인 카운터에서 배정받으신 일정을 도와드릴 예정입니다.
        </p>

        <div className="bg-brand-light border border-brand-border rounded-2xl p-5 mb-8 text-left max-w-md mx-auto space-y-3">
          <div className="flex justify-between text-xs border-b border-brand-border pb-2">
            <span className="text-brand-muted">예약번호</span>
            <span className="font-semibold text-primary font-mono">BK-SUCCESS</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">신청자</span>
            <span className="font-medium text-primary">{name} 님</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">선택 상담</span>
            <span className="font-medium text-primary font-manrope">{selectedMenu.category} • {selectedMenu.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">예약 일시</span>
            <span className="font-medium text-primary">{selectedDate} / {selectedTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">결제 예정 금액</span>
            <span className="font-bold text-gold font-manrope">{selectedMenu.price}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          id="btn-confirm-booking-success"
          className="w-full max-w-md bg-primary text-white font-medium py-3.5 rounded-xl hover:bg-primary-deep transition-all duration-300 shadow-md transform hover:scale-[1.01]"
        >
          확인 완료
        </button>
      </div>
    );
  }

  return (
    <div id="booking-form-drawer" className="font-sans text-primary">
      <div className="flex justify-between items-center mb-6 border-b border-brand-border pb-4">
        <div>
          <span className="text-xs font-semibold text-gold tracking-widest uppercase block mb-1">Reservation</span>
          <h3 className="text-xl font-bold font-manrope tracking-tight text-primary flex items-center gap-2">
            실시간 상담 예약
          </h3>
        </div>
        <button 
          onClick={onClose}
          aria-label="닫기"
          className="p-1 px-3 py-1.5 text-xs text-brand-muted hover:text-primary rounded-lg border border-brand-border hover:bg-brand-light transition duration-200"
        >
          뒤로가기
        </button>
      </div>

      <form onSubmit={handleBook} className="space-y-6">
        {/* Step 1: Menu Item Select */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold" />
            1. 상담 메뉴 선택 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedMenu(item)}
                className={`p-3.5 text-left rounded-xl border text-sm flex justify-between items-center transition-all duration-200 ${
                  selectedMenu.name === item.name
                    ? "border-gold bg-secondary-container ring-1 ring-gold shadow-xs"
                    : "border-brand-border bg-white hover:border-gold/60"
                }`}
              >
                <div>
                  <span className="text-xxs text-secondary block mb-0.5 opacity-80">{item.category}</span>
                  <span className="font-medium text-primary block">{item.name}</span>
                </div>
                <span className="font-bold text-gold font-manrope whitespace-nowrap">{item.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Date Selector */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold" />
            2. 상담 예약 날짜 선택 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {dates.map((d, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedDate(d.fullDate)}
                className={`flex-none snap-start w-16 p-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${
                  selectedDate === d.fullDate
                    ? "border-gold bg-primary text-white scale-102"
                    : "border-brand-border bg-white"
                }`}
              >
                <span className={`text-[11px] mb-1 uppercase font-medium ${
                  selectedDate === d.fullDate ? "text-white/80" : "text-brand-muted"
                }`}>
                  {d.month}월
                </span>
                <span className={`text-lg font-bold font-manrope ${
                  selectedDate === d.fullDate ? "text-white" : "text-primary"
                }`}>
                  {d.dayOfMonth}
                </span>
                <span className={`text-[11px] mt-1 ${
                  selectedDate === d.fullDate ? "text-gold/90" : "text-brand-muted"
                }`}>
                  ({d.dayOfWeek})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Time Slot Selector */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            3. 상담 시간 지정 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`p-2.5 text-xs rounded-xl border font-medium text-center transition-all duration-200 ${
                  selectedTime === time
                    ? "border-gold bg-primary text-white scale-102"
                    : "border-brand-border bg-white hover:border-gold/40 text-primary"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Contact Details */}
        <div className="space-y-3 bg-brand-light p-4 rounded-2xl border border-brand-border">
          <h4 className="text-xs font-bold text-gold tracking-wider uppercase mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> PERSONAL DETAILS
          </h4>
          
          <div className="space-y-3.5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={name}
                id="input-name"
                onChange={(e) => setName(e.target.value)}
                placeholder="예약자 성함 (실명 기재)"
                className="block w-full pl-10 pr-3 py-3 text-sm bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder:text-brand-muted/70"
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                <Phone className="h-4 w-4" />
              </span>
              <input
                type="tel"
                required
                id="input-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="연락처 (예: 010-1234-5678)"
                className="block w-full pl-10 pr-3 py-3 text-sm bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder:text-brand-muted/70"
              />
            </div>

            <div>
              <textarea
                id="input-question"
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="더 깊은 내면을 듣기 위해, 해결하려는 구체적인 성찰 질문이나 현재의 고민을 기재해주세요 (선택사항)"
                className="block w-full p-3 text-xs bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder:text-brand-muted/70 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing Banner & Book Button */}
        <div className="pt-2 border-t border-brand-border space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-secondary font-medium">최종 결제 금액 (현장 또는 가상계좌 입금)</span>
            <span className="text-xl font-extrabold text-gold font-manrope">{selectedMenu.price}</span>
          </div>

          <button
            type="submit"
            id="btn-submit-booking"
            className="w-full bg-primary text-white font-medium py-3.5 rounded-xl hover:bg-primary-deep transition-all duration-300 shadow-md flex items-center justify-center gap-2 transform active:scale-98"
          >
            <span>상담 상담 예약 완료하기</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-brand-muted leading-relaxed">
            * 예약 완료 후 10분 내로 예약 확정 문자 및 리딩 플랫폼 링크가 자동 발송됩니다. 연중무휴 오전 10시 ~ 오후 10시 운영됩니다.
          </p>
        </div>
      </form>
    </div>
  );
};
export default BookingForm;
