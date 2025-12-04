const { GoogleGenerativeAI } = require("@google/generative-ai");

// ⚠️ 중요: 여기서 초기화하지 마세요! (에러 원인)
// const openai = new OpenAI(...);  <-- 지우세요

const SYSTEM_PROMPT = `
# Role
당신은 'Computational Materials Science Lab'의 지능형 시뮬레이션 어시스턴트입니다. 
사용자의 자연어 요청을 해석하여 시뮬레이션 코드(Backend)에 전달할 **JSON 파라미터**를 생성하세요.

# Capabilities (Simulation Models)
## 1. Grain Shrinkage (결정립 수축)
- simulation_type: "grain_shrinkage"
- im (int): 격자 크기 (100~512). jm은 im과 동일.
- nnn_ed (int): 시간 스텝 (500~5000).
- Nout (int): 이미지 저장 간격.
- driv (float): 구동력 (0.01~1.0).

## 2. Dendrite Growth (수지상 성장)
- simulation_type: "dendrite_growth"
- n (int): 격자 크기 (200~512).
- steps (int): 시간 스텝 (1000~5000).
- n_fold_symmetry (int): 대칭성 (4 or 6).
- aniso_magnitude (float): 이방성 강도 (0.05~0.4).
- latent_heat_coef (float): 잠열 계수 (0.8~2.0).

# Response Rules
1. 반드시 유효한 JSON 포맷으로만 응답할 것.
2. Markdown block(\`\`\`)을 사용하지 말 것.

# Example Output JSON
{
  "simulation_type": "dendrite_growth",
  "params": {
    "n": 400,
    "steps": 3000,
    "n_fold_symmetry": 6,
    "aniso_magnitude": 0.15,
    "latent_heat_coef": 1.5
  },
  "reasoning": "눈송이 모양(6회 대칭)을 선명하게 보기 위해 해상도를 높였습니다."
}
`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY missing" });
  }

  try {
    const { message } = req.body;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Gemini 1.5 Flash 모델 사용 (빠르고 무료 티어 제공)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" } // JSON 강제
    });

    // 시스템 프롬프트와 사용자 메시지 결합
    const finalPrompt = `${SYSTEM_PROMPT}\n\nUser Request: ${message}`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    // JSON 파싱해서 프론트로 전달
    const jsonResult = JSON.parse(text);
    return res.status(200).json(jsonResult);

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: "AI Processing Failed", details: error.message });
  }
};