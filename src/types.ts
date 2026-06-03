export interface TarotCard {
  id: number;
  name: string;
  englishName: string;
  meaningUpright: string;
  meaningReversed: string;
  imageUrl: string;
  keywords: string[];
}

export interface Booking {
  id: string;
  customerName: string;
  phoneNumber: string;
  date: string;
  timeSlot: string;
  menuItem: string;
  price: string;
  notes?: string;
  status: 'pending' | 'confirmed';
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  menuItem: string;
  date: string;
}

export interface CardReading {
  id: string;
  date: string;
  category: string;
  question: string;
  drawnCards: {
    card: TarotCard;
    isReversed: boolean;
  }[];
  interpretation: string;
}

export const TAROT_DECK: TarotCard[] = [
  {
    id: 0,
    name: "광대",
    englishName: "The Fool",
    meaningUpright: "새로운 시작, 모험, 무한한 가능성, 자유, 순수함",
    meaningReversed: "무모함, 부주의, 위험한 도전, 방향 상실, 무책임",
    imageUrl: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=600",
    keywords: ["시작", "자유", "모험", "신선함"]
  },
  {
    id: 1,
    name: "마법사",
    englishName: "The Magician",
    meaningUpright: "재능, 의지력, 창조적 능력, 소통, 주도적인 실행",
    meaningReversed: "재능 낭비, 기만, 조작, 계획 부족, 실천력 결여",
    imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=600",
    keywords: ["창조", "기술", "실행력", "의지"]
  },
  {
    id: 2,
    name: "여사제",
    englishName: "The High Priestess",
    meaningUpright: "직관, 무의식, 지혜, 학문과 비밀, 내면의 신뢰",
    meaningReversed: "침묵 오해, 비밀 유출, 겉치레, 현실 도피, 직관 소홀",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600",
    keywords: ["직관", "비밀", "지혜", "신비"]
  },
  {
    id: 3,
    name: "여황제",
    englishName: "The Empress",
    meaningUpright: "풍요, 모성애, 창조, 자연과 조화, 예술적 성취",
    meaningReversed: "창의력 고갈, 과잉 보호, 무질서, 의존성, 불만족",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600",
    keywords: ["풍요", "모성", "자연", "결실"]
  },
  {
    id: 4,
    name: "황제",
    englishName: "The Emperor",
    meaningUpright: "권위, 통제력, 안정성, 리더십, 강한 책임감",
    meaningReversed: "폭정, 지배욕, 융통성 없음, 권력 부작용, 통제 상실",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600",
    keywords: ["권위", "통제", "보호", "안정"]
  },
  {
    id: 5,
    name: "교황",
    englishName: "The Hierophant",
    meaningUpright: "영적 인도, 스승, 관습과 전통, 교육, 동맹과 자비",
    meaningReversed: "도그마, 완고함, 반항심, 비전통적 사상, 조언의 오류",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600",
    keywords: ["가르침", "전통", "영지", "자비"]
  },
  {
    id: 6,
    name: "연인",
    englishName: "The Lovers",
    meaningUpright: "사랑, 아름다운 조화, 올바른 선택, 매력, 파트너십",
    meaningReversed: "불화, 관계 단절, 잘못된 선택, 변심, 갈등 유발",
    imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600",
    keywords: ["사랑", "선택", "파트너십", "매력"]
  },
  {
    id: 7,
    name: "전차",
    englishName: "The Chariot",
    meaningUpright: "승리, 통제와 전진, 의지, 장애 극복, 빠른 속도",
    meaningReversed: "통제 불능, 방향 상실, 무리한 질주, 사기 저하, 지연",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600",
    keywords: ["승리", "전진", "돌파", "속도"]
  },
  {
    id: 8,
    name: "힘",
    englishName: "Strength",
    meaningUpright: "내적인 힘, 인내심, 상냥한 통제, 용기, 열정의 극복",
    meaningReversed: "자신감 부족, 힘의 과시, 약점 노출, 충동적 성향",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=600",
    keywords: ["용기", "인내", "내면의 힘", "조율"]
  },
  {
    id: 9,
    name: "은둔자",
    englishName: "The Hermit",
    meaningUpright: "내면의 고독, 명상, 고찰과 탐구, 철학, 영적 스승",
    meaningReversed: "지나친 고립, 사회성 결여, 쓸데없는 고집, 현실 부적응",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600",
    keywords: ["성찰", "탐구", "침묵", "고독"]
  },
  {
    id: 10,
    name: "운명의 수레바퀴",
    englishName: "Wheel of Fortune",
    meaningUpright: "운명적인 변화, 인생의 전환점, 행운, 우연, 인과응보",
    meaningReversed: "악재, 나쁜 운명의 장난, 통제 불가 변화, 불운, 완고한 저항",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600",
    keywords: ["전환점", "운명", "행운", "기회"]
  },
  {
    id: 11,
    name: "정의",
    englishName: "Justice",
    meaningUpright: "공정함, 균형, 판단, 성실한 진실, 법적 판결",
    meaningReversed: "불합리, 편견, 지나친 엄격함, 부정직, 미해결 갈등",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600",
    keywords: ["균형", "공정", "판단", "인과"]
  },
  {
    id: 12,
    name: "매달린 사람",
    englishName: "The Hanged Man",
    meaningUpright: "희생, 새로운 시각, 정체기, 내려놓음, 인내와 성찰",
    meaningReversed: "헛된 희생, 무력함, 답보 상태, 시각의 왜곡, 저항적 태도",
    imageUrl: "https://images.unsplash.com/photo-1494253109108-2e30c049369b?q=80&w=600",
    keywords: ["희생", "관점 전환", "정지", "인내"]
  },
  {
    id: 13,
    name: "죽음",
    englishName: "Death",
    meaningUpright: "끝과 종결, 피할 수 없는 변화, 새로운 탄생, 청산",
    meaningReversed: "변화에 대한 두려움, 정체, 미련, 고통의 장기화, 악순환",
    imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600",
    keywords: ["종결", "새로운 탄생", "변천", "해방"]
  },
  {
    id: 14,
    name: "절제",
    meaningUpright: "조화와 균형, 감정 통제, 치유와 타협, 인내와 적응",
    meaningReversed: "불균형, 갈등 유발, 무절제, 대인관계 트러블, 과잉행동",
    englishName: "Temperance",
    imageUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=600",
    keywords: ["조화", "정화", "치유", "적응"]
  },
  {
    id: 15,
    name: "악마",
    englishName: "The Devil",
    meaningUpright: "속박, 물질적 집착, 중독, 강렬한 유혹, 도피 불가",
    meaningReversed: "집착에서 해방, 자각과 각성, 극복, 속박 해제, 단호한 거부",
    imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600",
    keywords: ["유혹", "집착", "속박", "물질주의"]
  },
  {
    id: 16,
    name: "탑",
    englishName: "The Tower",
    meaningUpright: "갑작스러운 붕괴, 청산과 변화, 진실 규명, 환상 극복",
    meaningReversed: "서서히 다가오는 재앙, 붕괴 모면, 고난 속 경고, 도망 불가",
    imageUrl: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=600",
    keywords: ["충격", "붕괴", "혁명", "각성"]
  },
  {
    id: 17,
    name: "별",
    englishName: "The Star",
    meaningUpright: "희망, 영감, 믿음, 내면의 고요, 긍정적인 전망",
    meaningReversed: "실망, 영감 고갈, 비관주의, 기대 상실, 불안감 증대",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600",
    keywords: ["희망", "영감", "고요", "비전"]
  },
  {
    id: 18,
    name: "달",
    englishName: "The Moon",
    meaningUpright: "서늘한 비현실성, 두려움과 불안, 기만, 잠재의식, 비밀스런 진리",
    meaningReversed: "오해 극복, 진실 규명, 두려움 해소, 현실 자각, 안개 걷힘",
    imageUrl: "https://images.unsplash.com/photo-1532690653126-5315f6470836?q=80&w=600",
    keywords: ["불안", "의혹", "무의식", "환영"]
  },
  {
    id: 19,
    name: "태양",
    englishName: "The Sun",
    meaningUpright: "기쁨, 성공, 활력과 건강, 순수한 열정, 축하할 인생",
    meaningReversed: "일시적 슬럼프, 흐린 보람, 지연된 승리, 실망감 유발",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600",
    keywords: ["성공", "기쁨", "활력", "명석함"]
  },
  {
    id: 20,
    name: "심판",
    englishName: "Judgement",
    meaningUpright: "부활과 각성, 도덕적 해방, 명예로운 결론, 재도전 기회",
    meaningReversed: "지연된 깨달음, 과거에 집착, 결정 지연, 후회 가득한 한탄",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600",
    keywords: ["부활", "결론", "각성", "재도전"]
  },
  {
    id: 21,
    name: "세계",
    englishName: "The World",
    meaningUpright: "완성과 통합, 조화로운 성취, 긴 여정의 결실, 축복과 여행",
    meaningReversed: "미완성 상태, 도정의 정체, 조기 단념, 보람 없는 수고",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
    keywords: ["완성", "조화", "성공", "세계화"]
  }
];
