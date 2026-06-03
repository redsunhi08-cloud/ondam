import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API endpoint for health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", time: new Date().toISOString() });
  });

  // API endpoint for tarot interactive reading
  app.post("/api/tarot/read", async (req, res) => {
    const { category, question, drawnCards } = req.body;

    if (!question || !drawnCards || !Array.isArray(drawnCards)) {
      return res.status(400).json({ error: "Missing required fields: question and drawnCards" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isApiKeyConfigured = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

    // Card descriptions to feed into the prompt
    let cardsText = drawnCards.map((dc: any, index: number) => {
      const positionName = index === 0 ? "첫 번째 카드 (과거/원인)" : index === 1 ? "두 번째 카드 (현재/상황)" : "세 번째 카드 (미래/조언)";
      return `- ${positionName}: ${dc.name} (${dc.englishName}) - 방향: ${dc.isReversed ? "역방향 (Reversed)" : "정방향 (Upright)"}
  * 키워드: ${dc.keywords?.join(", ") || ""}
  * 기본 의미: ${dc.isReversed ? dc.meaningReversed : dc.meaningUpright}`;
    }).join("\n\n");

    const categoryTranslate: { [key: string]: string } = {
      love: "연애 흐름 분석 (Love & Relationship)",
      mind: "상대방 속마음 리딩 (Deconstruct Hidden Emotions)",
      career: "진로 방향성 제시 (Career & Goals Selection)",
      finance: "금전 흐름 체크 (Wealth & Finance Wealthiness)"
    };

    const categoryName = categoryTranslate[category] || "종합 운세 상담 (General Guidance)";

    const promptText = `온담타로(ONDAM TAROT)의 메인 힐러로서 질문자에게 따뜻하고 위로와 공감이 되는 깊이 있는 타로 리딩을 제공해 주세요. 
귀하는 내담자의 마음을 깊이 읽고, 현실적이면서도 따뜻한 치유의 솔루션을 제공하는 것으로 정평이 나 있습니다.

[세션 정보]
상담 카테고리: ${categoryName}
질문자의 질문: "${question}"

[뽑은 카드 정보]
${cardsText}

[리딩 작성 규칙]
1. 존댓말을 사용하여 매우 조근조근하고 따뜻한 어조로 작성해 주세요. (예: "~합니다", "~이지요", "~일 것입니다")
2. 질문자의 고민을 깊이 나누며 어깨를 가볍게 해주는 위로의 시작 멘트를 적어주세요.
3. 3장의 카드를 각각 하나씩 세밀하게 해석해 주세요. 
   - 정방향/역방향의 뉘앙스를 질문에 알맞게 녹여 비유와 조언을 섞어 주셔야 합니다.
   - 각 카드 해석 끝에 질문자가 한 걸음 나아갈 수 있는 구체적인 가이드를 제공하세요.
4. 마지막으로 종합적인 '온담타로의 조언 요약(Healing Insight)'을 통하여 마음이 편안해지는 마무리 멘트를 건네주세요.
5. 가독성을 위해 마크다운(Markdown)을 사용하여 소제목(###), 문단 나누기, 굵은 글씨(**) 등을 적절하게 섞어 가독성이 뛰어난 예쁜 글로 작성해주세요.
6. 전문적인 용어를 너무 난무하기보다는, 가슴에 와 닿는 일상적인 단어와 부드러운 화법을 지향하세요.`;

    if (isApiKeyConfigured) {
      try {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            temperature: 0.8,
            topP: 0.95,
          }
        });

        const interpretationMarkdown = response.text || "타로를 리딩하는 과정에서 부드러운 바람이 불어왔습니다. 리딩을 다시 시도해주세요.";
        return res.json({
          success: true,
          source: "gemini",
          interpretation: interpretationMarkdown
        });

      } catch (err: any) {
        console.error("Gemini API Error:", err);
        // Fallback to local template processing if the API fails
        return res.json({
          success: true,
          source: "local-fallback",
          interpretation: generateLocalInterpretation(question, categoryName, drawnCards)
        });
      }
    } else {
      // Local Interpretation Fallback
      return res.json({
        success: true,
        source: "local-mock",
        interpretation: generateLocalInterpretation(question, categoryName, drawnCards)
      });
    }
  });

  // Serve static files in production or hook up Vite in development
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`[ONDAM TAROT Server] Listening on http://localhost:${port} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

function generateLocalInterpretation(question: string, categoryName: string, drawnCards: any[]): string {
  const card1 = drawnCards[0];
  const card2 = drawnCards[1];
  const card3 = drawnCards[2];

  return `### 🌱 온담타로가 당신의 마음을 따뜻하게 읽어드립니다

지금 던져주신 질문인 **"${question}"**에 대해 마음의 결을 모아 깊은 시선으로 우주를 바라봅니다. 
현재 API 설정이 오프라인 상태이지만, 온담의 내장 가이드가 이 카드를 정성껏 분석하여 당신만을 위한 치유의 메시지를 선사해 드릴게요.

---

### 1. 과거의 속삭임: **${card1.name} (${card1.englishName})** - ${card1.isReversed ? "역방향" : "정방향"}
* **키워드**: ${card1.keywords?.join(", ") || ""}
* **마음의 고아**: 과거 혹은 현재의 원인 지점에는 '${card1.name}'가 나타났습니다. 이 카드는 이전에 당신이 **${card1.isReversed ? card1.meaningReversed : card1.meaningUpright}**라는 상태에 깊이 관여해 왔음을 속삭이고 있습니다. 
* **온담의 시선**: 어쩌면 마음에 쌓아둔 응어리나 기억이 오늘날 당신의 걸음을 다소 더디게 한 원인이 되었던 것 같습니다. 그 시절의 당신을 기꺼이 안아주세요. 그것은 틀린 길이 아닌 성숙의 과정이었습니다.

---

### 2. 현재의 파동: **${card2.name} (${card2.englishName})** - ${card2.isReversed ? "역방향" : "정방향"}
* **키워드**: ${card2.keywords?.join(", ") || ""}
* **마음의 고아**: 지금 당신이 마주하고 있는 이 상황의 열쇠는 '${card2.name}'가 품고 있습니다. 현재 이 카드는 **${card2.isReversed ? card2.meaningReversed : card2.meaningUpright}**라는 운명적 파동으로 작용하고 있습니다.
* **온담의 시선**: 눈앞의 문제나 고민이 너무나 버겁게 느껴질 수도 있겠지만, 이 카드는 당신 내면에 이미 대처할 수 있는 원숙함과 열정이 숨 쉬고 있음을 환기시킵니다. 서두를 필요는 전혀 없어요. 당신만의 호흡을 유지하는 것만으로 충분히 가치 있는 흐름입니다.

---

### 3. 미래의 조언: **${card3.name} (${card3.englishName})** - ${card3.isReversed ? "역방향" : "정방향"}
* **키워드**: ${card3.keywords?.join(", ") || ""}
* **마음의 고아**: 조금 더 나아간 미래와 조언의 자리에는 '${card3.name}'가 빛나고 있습니다. 이 카드가 전하는 메시지는 **${card3.isReversed ? card3.meaningReversed : card3.meaningUpright}**로의 전개와 조율입니다.
* **온담의 시선**: 앞으로 가야 할 길에 대해 보다 대범해져도 좋습니다. 스스로가 그어둔 한계선을 지우고 나아갈 때, 비로소 새로운 변화가 시작될 테니까요. 흐름은 당신을 돕고 있습니다.

---

### ✨ 온담타로의 조언 요약 (Healing Insight)
이번 **"${categoryName}"** 세션에서 나타난 가장 중요한 통찰은, **결국 주체적인 치유와 변화의 칼자루는 당신의 고운 마음에 쥐어져 있다는 것**입니다. 그동안의 괴로움은 바람처럼 흘려보내고, 새롭게 틔울 희망의 새싹만을 귀하게 간직하세요. 

온담타로는 늘 이곳에서 따뜻하고 편안한 향기로 당신의 길을 밝혀두겠습니다. 🌿`;
}

startServer();
