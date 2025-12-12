import { GoogleGenerativeAI } from "@google/generative-ai";
// ⚠️ 중요: 여기서 초기화하지 마세요! (에러 원인)
// const openai = new OpenAI(...);  <-- 지우세요

const SYSTEM_PROMPT = `
# Role
당신은 'Computational Materials Science Lab'의 지능형 시뮬레이션 어시스턴트입니다. 
사용자의 자연어 요청을 해석하여 시뮬레이션 코드(Backend)에 전달할 **JSON 파라미터**를 생성하세요.

# Capabilities (Simulation Models)
## 1. Grain Shrinkage (결정립 수축 및 성장)
- simulation_type: "grain_shrinkage"
- im (int): 격자 크기 (100~512).
- nnn_ed (int): 시간 스텝 (500~5000).
- driv (float): 구동력 (0.01~1.0).
- mobility (float): 결정립계 이동도 (0.5~5.0). 기본값 1.0.
- gb_energy (float): 계면 에너지 (0.5~2.0). 기본값 1.0.
- init_radius (float): 초기 입자 반지름 (10.0~50.0).
- noise_level (float): 열적 노이즈 강도 (0.0~0.1). 0이 아니면 표면이 거칠어짐.
- aniso_strength (float): 이방성 강도 (0.0~0.5). 0이면 원형, 값이 크면 각진 모양(사각형/육각형).
- symmetry_mode (int): 대칭성 모드 (4 또는 6). aniso_strength > 0 일 때 작동.

## 2. Dendrite Growth (수지상 성장)
# ... (기존 유지)

# Response Rules
1. 반드시 유효한 JSON 포맷으로만 응답할 것.
2. Markdown block(\`\`\`)을 사용하지 말 것.

# Example Output JSON
{
  "simulation_type": "grain_shrinkage",
  "params": {
    "im": 200,
    "nnn_ed": 3000,
    "mobility": 2.0,
    "aniso_strength": 0.3,
    "symmetry_mode": 6
  },
  "reasoning": "육각형 모양으로 수축하는 결정립을 시뮬레이션하기 위해 6회 대칭 이방성을 적용했습니다."
}
`;

export default async function handler(req, res) {
  // POST 요청 확인
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // API Key 확인
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY가 환경변수에 없습니다.");
    return res.status(500).json({ error: "Server Configuration Error" });
  }

  try {
    const { message } = req.body;
    
    // Gemini 모델 초기화
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite", 
      generationConfig: { responseMimeType: "application/json" }
    });

    // 실행
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser Request: ${message}`);
    const response = await result.response;
    const text = response.text();

    // 결과 반환
    const jsonResult = JSON.parse(text);
    return res.status(200).json(jsonResult);

  } catch (error) {
    console.error("🔥 Gemini Error:", error);
    return res.status(500).json({ error: "AI Processing Failed", details: error.message });
  }
}