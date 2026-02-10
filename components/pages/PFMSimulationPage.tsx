'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Cpu,
  Settings as SettingsIcon,
  Play,
  Pause,
  Square,
  RefreshCw,
  Check,
  AlertCircle,
  Download,
  Upload,
  Zap,
  Activity,
  Terminal,
  CircleDot,
} from 'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ElementConfig {
  name: string;
  weight: number;
}

interface SimulationParams {
  alloyBase: string;
  nComponents: number;
  elements: ElementConfig[];
  coolRate: number;
  undercooling: number;
  tempGrad: number;
  dimension: '2D' | '3D';
  gridX: number;
  gridY: number;
  gridZ: number;
  dx: number;
  interfaceWidth: number;
  sigmaSL: number;
  sigmaSS: number;
  nGrains: number;
  nperiod: number;
  critdf: number;
}

interface AutoFilledParam {
  name: string;
  value: string;
  reason: string;
}

interface ParsedResponse {
  autofilled: AutoFilledParam[];
  config: any;
}

// ============================================
// CONSTANTS
// ============================================

const API_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_PFM_LLM_URL || 'https://pfm.cmsl-kookmin.com')
  : 'https://pfm.cmsl-kookmin.com';

const DEFAULT_PARAMS: SimulationParams = {
  alloyBase: 'AL',
  nComponents: 2,
  elements: [{ name: 'SI', weight: 5.0 }],
  coolRate: -10.0,
  undercooling: 5.0,
  tempGrad: 5000.0,
  dimension: '2D',
  gridX: 500,
  gridY: 1,
  gridZ: 500,
  dx: 3e-8,
  interfaceWidth: 3.0,
  sigmaSL: 0.17,
  sigmaSS: 0.30,
  nGrains: 10,
  nperiod: 20000,
  critdf: 6.5e6,
};

const EXAMPLE_PROMPTS = [
  'Al-Si 7% 합금 응고 시뮬레이션',
  'Al-5%Mg 합금 등축정 응고',
  '3D Al-Si-Cu 삼원계 시뮬레이션',
  'What parameters do I need for dendritic growth?',
];

const PRESETS: Record<string, Partial<SimulationParams>> = {
  '선택 안함': {},
  'Al-Si 유텍틱 (7% Si)': {
    alloyBase: 'AL',
    elements: [{ name: 'SI', weight: 7.0 }],
    coolRate: -10.0,
    undercooling: 5.0,
  },
  'Al-Mg 고용체 (5% Mg)': {
    alloyBase: 'AL',
    elements: [{ name: 'MG', weight: 5.0 }],
    coolRate: -20.0,
    undercooling: 3.0,
  },
  'Al-Cu 석출 (4% Cu)': {
    alloyBase: 'AL',
    elements: [{ name: 'CU', weight: 4.0 }],
    coolRate: -50.0,
    undercooling: 8.0,
  },
  'Al-Si-Mg (7% Si, 0.5% Mg)': {
    alloyBase: 'AL',
    nComponents: 3,
    elements: [
      { name: 'SI', weight: 7.0 },
      { name: 'MG', weight: 0.5 },
    ],
    coolRate: -15.0,
    dimension: '3D',
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function validateParams(params: SimulationParams): string[] {
  const errors: string[] = [];

  if (params.coolRate >= 0) {
    errors.push('냉각 속도는 음수여야 합니다 (냉각 방향 표시)');
  }

  const totalWeight = params.elements.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight <= 0) {
    errors.push('최소 하나의 용질 원소가 필요합니다');
  }
  if (totalWeight > 100) {
    errors.push('전체 용질 농도는 100%를 초과할 수 없습니다');
  }

  if (params.gridX <= 0 || params.gridZ <= 0) {
    errors.push('그리드 크기는 양수여야 합니다');
  }

  if (params.dimension === '3D' && params.gridY <= 0) {
    errors.push('3D 시뮬레이션에서 gridY는 양수여야 합니다');
  }

  if (params.dx <= 0) {
    errors.push('격자 간격(dx)은 양수여야 합니다');
  }

  if (params.interfaceWidth <= 0) {
    errors.push('계면 두께는 양수여야 합니다');
  }

  if (params.nGrains <= 0) {
    errors.push('결정립 수는 양수여야 합니다');
  }

  return errors;
}

function parseLLMResponse(text: string): ParsedResponse {
  const autofilled: AutoFilledParam[] = [];

  if (text.includes('[AUTO-FILLED PARAMETERS]')) {
    const section = text.split('[CONFIGURATION]')[0].split('[AUTO-FILLED PARAMETERS]')[1] || '';
    const lines = section.split('\n');
    for (const line of lines) {
      const match = line.match(/-\s*(\w+):\s*(.+?)\s*\((.+?)\)/);
      if (match) {
        autofilled.push({
          name: match[1],
          value: match[2].trim(),
          reason: match[3].trim(),
        });
      }
    }
  }

  let config = null;
  if (text.includes('[CONFIGURATION]')) {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        config = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error('Failed to parse config JSON:', e);
      }
    }
  }

  return { autofilled, config };
}

async function sendChatMessage(message: string, history: Message[]): Promise<string> {
  const response = await fetch(`${API_URL}/router/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      session_id: null,
      model: 'default',
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat API failed: ${response.status}`);
  }

  const data = await response.json();
  return data.response || data.choices?.[0]?.message?.content || 'No response';
}

async function startSimulation(
  prompt: string,
  autoVisualize: boolean = false,
  waitForCompletion: boolean = false
): Promise<{ pipeline_id: string; simulation_id: string }> {
  const response = await fetch(`${API_URL}/api/v1/pipeline/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      auto_visualize: autoVisualize,
      wait_for_completion: waitForCompletion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Simulation start failed: ${response.status}`);
  }

  return response.json();
}

async function getPipelineStatus(pipelineId: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/v1/pipeline/${pipelineId}`);

  if (!response.ok) {
    throw new Error(`Pipeline status failed: ${response.status}`);
  }

  return response.json();
}

async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_URL}/api/v1/health`);

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function PFMSimulationPage() {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Parameter state
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('선택 안함');

  // Simulation state
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentPipelineId, setCurrentPipelineId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('Initializing...');
  const [eta, setEta] = useState<string>('--:--');

  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingConfig, setPendingConfig] = useState<any>(null);
  const [autofilledParams, setAutofilledParams] = useState<AutoFilledParam[]>([]);

  // Settings state
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [serverInfo, setServerInfo] = useState<any>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState('chat');

  // Refs
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Effects
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const errors = validateParams(params);
    setValidationErrors(errors);
  }, [params]);

  useEffect(() => {
    checkServerHealth();
  }, []);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Handlers
  const checkServerHealth = async () => {
    setServerStatus('checking');
    try {
      const health = await checkHealth();
      setServerStatus('online');
      setServerInfo(health);
    } catch (error) {
      setServerStatus('offline');
      setServerInfo(null);
    }
  };

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || chatInput.trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messageToSend, messages);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Parse response for auto-filled parameters
      const parsed = parseLLMResponse(response);

      if (parsed.autofilled.length > 0 && parsed.config) {
        setAutofilledParams(parsed.autofilled);
        setPendingConfig(parsed.config);
        setShowConfirmation(true);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAutoFill = () => {
    if (pendingConfig) {
      // Apply config to params
      setParams((prev) => ({ ...prev, ...pendingConfig }));
      setActiveTab('params');
    }
    setShowConfirmation(false);
    setPendingConfig(null);
    setAutofilledParams([]);
  };

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = PRESETS[presetName];
    if (preset && Object.keys(preset).length > 0) {
      setParams((prev) => ({ ...prev, ...preset }));
    }
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(params, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pfm-simulation-params.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendToChat = () => {
    const summary = `Configure simulation: ${params.alloyBase} base, ${params.elements.map(e => `${e.weight}% ${e.name}`).join(', ')}, ${params.dimension}, cooling rate ${params.coolRate} K/s`;
    handleSendMessage(summary);
    setActiveTab('chat');
  };

  const handleRunSimulation = async () => {
    const prompt = chatInput.trim() || `Run simulation with current parameters`;

    setSimulationStatus('running');
    setProgress(0);
    setLogs(['Starting simulation pipeline...']);
    setCurrentStep('Initializing...');

    try {
      const result = await startSimulation(prompt, false, false);
      setCurrentPipelineId(result.pipeline_id);
      setLogs((prev) => [...prev, `Pipeline started: ${result.pipeline_id}`]);

      // Start polling
      pollIntervalRef.current = setInterval(() => {
        pollPipelineStatus(result.pipeline_id);
      }, 2000);
    } catch (error) {
      setSimulationStatus('error');
      setLogs((prev) => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  };

  const pollPipelineStatus = async (pipelineId: string) => {
    try {
      const status = await getPipelineStatus(pipelineId);

      // Update progress
      if (status.progress !== undefined) {
        setProgress(status.progress);
      }

      // Update step
      if (status.current_step) {
        setCurrentStep(status.current_step);
      }

      // Update logs
      if (status.logs && Array.isArray(status.logs)) {
        setLogs(status.logs.slice(-8));
      }

      // Update ETA
      if (status.eta) {
        setEta(status.eta);
      }

      // Check completion
      if (status.status === 'completed') {
        setSimulationStatus('completed');
        setProgress(100);
        setCurrentStep('Completed');
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      } else if (status.status === 'error' || status.status === 'failed') {
        setSimulationStatus('error');
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  const handleStopSimulation = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setSimulationStatus('idle');
    setProgress(0);
    setCurrentStep('Stopped');
    setLogs((prev) => [...prev, 'Simulation stopped by user']);
  };

  const updateElement = (index: number, field: 'name' | 'weight', value: string | number) => {
    const newElements = [...params.elements];
    newElements[index] = { ...newElements[index], [field]: value };
    setParams({ ...params, elements: newElements });
  };

  const addElement = () => {
    setParams({
      ...params,
      nComponents: params.nComponents + 1,
      elements: [...params.elements, { name: '', weight: 0 }],
    });
  };

  const removeElement = (index: number) => {
    const newElements = params.elements.filter((_, i) => i !== index);
    setParams({
      ...params,
      nComponents: Math.max(2, params.nComponents - 1),
      elements: newElements,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-neutral-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                PFM SIMULATION
              </h1>
              <p className="text-sm md:text-base text-zinc-400 font-mono">
                PHASE-FIELD MODELING · NATURAL LANGUAGE INTERFACE
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-green-500 animate-pulse' : serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`} />
              <span className="text-xs font-mono text-zinc-500 hidden md:inline">
                {serverStatus === 'online' ? 'ONLINE' : serverStatus === 'offline' ? 'OFFLINE' : 'CHECKING'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-zinc-900/50 border border-zinc-800 p-1 mb-8">
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600 data-[state=active]:text-white font-mono text-xs md:text-sm"
            >
              <Bot className="w-4 h-4 mr-2" />
              LLM 대화
            </TabsTrigger>
            <TabsTrigger
              value="params"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600 data-[state=active]:text-white font-mono text-xs md:text-sm"
            >
              <Cpu className="w-4 h-4 mr-2" />
              파라미터
            </TabsTrigger>
            <TabsTrigger
              value="run"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600 data-[state=active]:text-white font-mono text-xs md:text-sm"
            >
              <Play className="w-4 h-4 mr-2" />
              실행
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600 data-[state=active]:text-white font-mono text-xs md:text-sm"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              설정
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Chat */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800 shadow-2xl backdrop-blur">
              <CardHeader className="border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Sparkles className="w-5 h-5 text-orange-400" />
                      LLM 대화 인터페이스
                    </CardTitle>
                    <CardDescription className="mt-2 text-zinc-400 font-mono text-xs">
                      자연어로 시뮬레이션 조건을 설명하면 LLM이 자동으로 파라미터를 생성합니다
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Example Prompts */}
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
                  <Label className="text-xs font-mono text-zinc-400 mb-3 block">EXAMPLE PROMPTS</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {EXAMPLE_PROMPTS.map((prompt, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendMessage(prompt)}
                        disabled={isLoading}
                        className="justify-start text-left h-auto py-2 px-3 bg-zinc-800/50 hover:bg-orange-600/20 hover:border-orange-600 hover:text-orange-400 border-zinc-700 text-xs font-mono transition-all duration-200"
                      >
                        <Zap className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{prompt}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="h-[400px] p-6" ref={chatScrollRef}>
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-12">
                        <Bot className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                        <p className="text-zinc-500 font-mono text-sm">
                          대화를 시작하세요...
                        </p>
                      </div>
                    )}

                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700'
                              : 'bg-gradient-to-br from-zinc-900 to-black border border-zinc-800'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
                            {msg.content}
                          </p>
                          <p className="text-xs text-zinc-600 mt-2 font-mono">
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>

                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-zinc-300" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-lg p-4">
                          <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/30">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="예: Al-Si 7% 합금의 등축정 응고 시뮬레이션을 하고 싶어요..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isLoading}
                      className="flex-1 min-h-[80px] bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono text-sm resize-none"
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={isLoading || !chatInput.trim()}
                      size="lg"
                      className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold px-6"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            {showConfirmation && (
              <Card className="bg-gradient-to-br from-orange-950/50 to-amber-950/50 border-orange-800 shadow-2xl backdrop-blur">
                <CardHeader className="border-b border-orange-800/50">
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <AlertCircle className="w-5 h-5" />
                    자동 생성된 파라미터 확인
                  </CardTitle>
                  <CardDescription className="text-orange-300/70 font-mono text-xs">
                    LLM이 다음 파라미터를 자동으로 설정했습니다. 확인 후 적용하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {autofilledParams.map((param, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 border border-orange-800/50 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-bold text-orange-300 font-mono">{param.name}</span>
                          <span className="text-orange-400 font-mono text-sm">{param.value}</span>
                        </div>
                        <p className="text-xs text-orange-300/70 font-mono">{param.reason}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleConfirmAutoFill}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      파라미터 탭으로 적용
                    </Button>
                    <Button
                      onClick={() => setShowConfirmation(false)}
                      variant="outline"
                      className="border-orange-800 text-orange-400 hover:bg-orange-900/20"
                    >
                      취소
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 2: Parameters */}
          <TabsContent value="params" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800 shadow-2xl backdrop-blur">
              <CardHeader className="border-b border-zinc-800">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Cpu className="w-5 h-5 text-orange-400" />
                      시뮬레이션 파라미터 설정
                    </CardTitle>
                    <CardDescription className="mt-2 text-zinc-400 font-mono text-xs">
                      상세 파라미터를 직접 조정하거나 프리셋을 선택하세요
                    </CardDescription>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSendToChat}
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 hover:border-orange-600 hover:text-orange-400 font-mono text-xs"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      채팅으로 전송
                    </Button>
                    <Button
                      onClick={handleExportJSON}
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 hover:border-orange-600 hover:text-orange-400 font-mono text-xs"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      JSON 내보내기
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Preset Selector */}
                <div className="mb-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <Label className="text-xs font-mono text-zinc-400 mb-3 block">PRESET CONFIGURATIONS</Label>
                  <Select value={selectedPreset} onValueChange={handlePresetChange}>
                    <SelectTrigger className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {Object.keys(PRESETS).map((presetName) => (
                        <SelectItem key={presetName} value={presetName} className="font-mono">
                          {presetName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <Alert variant="destructive" className="mb-6 bg-red-950/50 border-red-900">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-mono">검증 오류</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-xs">
                        {validationErrors.map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Parameters Accordion */}
                <Accordion type="multiple" defaultValue={['alloy', 'process', 'domain']} className="space-y-2">
                  {/* Alloy System */}
                  <AccordionItem value="alloy" className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30">
                    <AccordionTrigger className="px-6 py-4 hover:bg-zinc-800/30 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <CircleDot className="w-4 h-4 text-orange-400" />
                        합금 시스템
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 space-y-4 bg-zinc-900/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Base Element</Label>
                          <Input
                            value={params.alloyBase}
                            onChange={(e) => setParams({ ...params, alloyBase: e.target.value.toUpperCase() })}
                            placeholder="AL"
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Number of Components</Label>
                          <Input
                            type="number"
                            value={params.nComponents}
                            onChange={(e) => setParams({ ...params, nComponents: parseInt(e.target.value) || 2 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-xs font-mono text-zinc-400">Solute Elements (wt%)</Label>
                          <Button
                            onClick={addElement}
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-zinc-700 hover:border-orange-600 hover:text-orange-400 font-mono"
                          >
                            + 원소 추가
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {params.elements.map((element, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-zinc-800/30 p-3 rounded border border-zinc-800">
                              <Input
                                value={element.name}
                                onChange={(e) => updateElement(idx, 'name', e.target.value.toUpperCase())}
                                placeholder="SI"
                                className="flex-1 bg-zinc-900/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono text-sm"
                              />
                              <Input
                                type="number"
                                step="0.1"
                                value={element.weight}
                                onChange={(e) => updateElement(idx, 'weight', parseFloat(e.target.value) || 0)}
                                placeholder="5.0"
                                className="w-24 bg-zinc-900/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono text-sm"
                              />
                              <span className="text-xs text-zinc-500 font-mono">wt%</span>
                              {params.elements.length > 1 && (
                                <Button
                                  onClick={() => removeElement(idx)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                                >
                                  ×
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Process Conditions */}
                  <AccordionItem value="process" className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30">
                    <AccordionTrigger className="px-6 py-4 hover:bg-zinc-800/30 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-orange-400" />
                        공정 조건
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 space-y-4 bg-zinc-900/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Cooling Rate (K/s)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={params.coolRate}
                            onChange={(e) => setParams({ ...params, coolRate: parseFloat(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Undercooling (K)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={params.undercooling}
                            onChange={(e) => setParams({ ...params, undercooling: parseFloat(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Temp. Gradient (K/m)</Label>
                          <Input
                            type="number"
                            step="100"
                            value={params.tempGrad}
                            onChange={(e) => setParams({ ...params, tempGrad: parseFloat(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Domain Settings */}
                  <AccordionItem value="domain" className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30">
                    <AccordionTrigger className="px-6 py-4 hover:bg-zinc-800/30 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-orange-400" />
                        도메인 설정
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 space-y-4 bg-zinc-900/50">
                      <div className="flex items-center gap-4 mb-4">
                        <Label className="text-xs font-mono text-zinc-400">Dimension</Label>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={params.dimension === '2D' ? 'default' : 'outline'}
                            onClick={() => setParams({ ...params, dimension: '2D', gridY: 1 })}
                            className={params.dimension === '2D' ? 'bg-gradient-to-r from-orange-600 to-amber-600' : 'border-zinc-700 hover:border-orange-600'}
                          >
                            2D
                          </Button>
                          <Button
                            size="sm"
                            variant={params.dimension === '3D' ? 'default' : 'outline'}
                            onClick={() => setParams({ ...params, dimension: '3D', gridY: 500 })}
                            className={params.dimension === '3D' ? 'bg-gradient-to-r from-orange-600 to-amber-600' : 'border-zinc-700 hover:border-orange-600'}
                          >
                            3D
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Grid X</Label>
                          <Input
                            type="number"
                            value={params.gridX}
                            onChange={(e) => setParams({ ...params, gridX: parseInt(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Grid Y</Label>
                          <Input
                            type="number"
                            value={params.gridY}
                            onChange={(e) => setParams({ ...params, gridY: parseInt(e.target.value) || 0 })}
                            disabled={params.dimension === '2D'}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono disabled:opacity-50"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Grid Z</Label>
                          <Input
                            type="number"
                            value={params.gridZ}
                            onChange={(e) => setParams({ ...params, gridZ: parseInt(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">dx (m)</Label>
                          <Input
                            type="number"
                            step="1e-9"
                            value={params.dx}
                            onChange={(e) => setParams({ ...params, dx: parseFloat(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Phase-Field Parameters */}
                  <AccordionItem value="phase-field" className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30">
                    <AccordionTrigger className="px-6 py-4 hover:bg-zinc-800/30 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        위상장 파라미터
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 space-y-4 bg-zinc-900/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Interface Width</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={params.interfaceWidth}
                            onChange={(e) => setParams({ ...params, interfaceWidth: parseFloat(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">σ_SL (J/m²)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={params.sigmaSL}
                            onChange={(e) => setParams({ ...params, sigmaSL: parseFloat(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">σ_SS (J/m²)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={params.sigmaSS}
                            onChange={(e) => setParams({ ...params, sigmaSS: parseFloat(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Nucleation Settings */}
                  <AccordionItem value="nucleation" className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30">
                    <AccordionTrigger className="px-6 py-4 hover:bg-zinc-800/30 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <CircleDot className="w-4 h-4 text-orange-400" />
                        핵생성 설정
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 space-y-4 bg-zinc-900/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Grain Count</Label>
                          <Input
                            type="number"
                            value={params.nGrains}
                            onChange={(e) => setParams({ ...params, nGrains: parseInt(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Period (steps)</Label>
                          <Input
                            type="number"
                            value={params.nperiod}
                            onChange={(e) => setParams({ ...params, nperiod: parseInt(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-mono text-zinc-400 mb-2 block">Critical ΔF</Label>
                          <Input
                            type="number"
                            step="1e5"
                            value={params.critdf}
                            onChange={(e) => setParams({ ...params, critdf: parseFloat(e.target.value) || 0 })}
                            className="bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Run Simulation */}
          <TabsContent value="run" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800 shadow-2xl backdrop-blur">
              <CardHeader className="border-b border-zinc-800">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Play className="w-5 h-5 text-orange-400" />
                  시뮬레이션 실행
                </CardTitle>
                <CardDescription className="mt-2 text-zinc-400 font-mono text-xs">
                  자연어 프롬프트를 입력하거나 현재 파라미터로 시뮬레이션을 실행하세요
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Input Prompt */}
                <div className="mb-6">
                  <Label className="text-xs font-mono text-zinc-400 mb-3 block">SIMULATION PROMPT</Label>
                  <Textarea
                    placeholder="예: Al-7%Si 합금의 등축정 응고를 냉각속도 10 K/s로 시뮬레이션"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={simulationStatus === 'running'}
                    className="min-h-[100px] bg-zinc-800/50 border-zinc-700 focus:border-orange-600 focus:ring-orange-600/20 font-mono text-sm"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex gap-3 mb-6">
                  {simulationStatus === 'idle' || simulationStatus === 'completed' || simulationStatus === 'error' ? (
                    <Button
                      onClick={handleRunSimulation}
                      disabled={validationErrors.length > 0}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold h-12"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      시뮬레이션 시작
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleStopSimulation}
                        variant="destructive"
                        className="flex-1 h-12 font-bold"
                      >
                        <Square className="w-5 h-5 mr-2" />
                        중지
                      </Button>
                    </>
                  )}

                  <Button
                    onClick={() => {
                      setSimulationStatus('idle');
                      setProgress(0);
                      setLogs([]);
                    }}
                    variant="outline"
                    className="border-zinc-700 hover:border-orange-600 hover:text-orange-400"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                </div>

                {/* Progress Display */}
                {simulationStatus !== 'idle' && (
                  <div className="space-y-6">
                    {/* Status Indicator */}
                    <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        simulationStatus === 'running' ? 'bg-orange-500 animate-pulse' :
                        simulationStatus === 'completed' ? 'bg-green-500' :
                        simulationStatus === 'error' ? 'bg-red-500' : 'bg-zinc-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-mono text-sm font-bold text-zinc-300">
                          {simulationStatus === 'running' ? 'RUNNING' :
                           simulationStatus === 'completed' ? 'COMPLETED' :
                           simulationStatus === 'error' ? 'ERROR' : 'IDLE'}
                        </p>
                        <p className="font-mono text-xs text-zinc-500">{currentStep}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs text-zinc-500">ETA</p>
                        <p className="font-mono text-sm font-bold text-orange-400">{eta}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-mono text-zinc-400">PROGRESS</Label>
                        <span className="text-xs font-mono font-bold text-orange-400">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={progress}
                        className="h-3 bg-zinc-800/50 border border-zinc-700"
                      />
                    </div>

                    {/* Logs */}
                    <div>
                      <Label className="text-xs font-mono text-zinc-400 mb-3 block">SYSTEM LOG</Label>
                      <div className="bg-black/50 border border-zinc-800 rounded-lg p-4 h-[200px] overflow-y-auto font-mono text-xs">
                        {logs.map((log, idx) => (
                          <div key={idx} className="text-green-400 mb-1">
                            <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span> {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Idle State */}
                {simulationStatus === 'idle' && (
                  <div className="text-center py-12">
                    <Terminal className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                    <p className="text-zinc-500 font-mono text-sm">
                      시뮬레이션 실행 준비 완료
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800 shadow-2xl backdrop-blur">
              <CardHeader className="border-b border-zinc-800">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <SettingsIcon className="w-5 h-5 text-orange-400" />
                  시스템 설정
                </CardTitle>
                <CardDescription className="mt-2 text-zinc-400 font-mono text-xs">
                  서버 연결 상태 및 시스템 정보
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Server Status */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-mono text-zinc-400 mb-3 block">SERVER CONNECTION</Label>
                    <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                      <div className={`w-4 h-4 rounded-full ${
                        serverStatus === 'online' ? 'bg-green-500 animate-pulse' :
                        serverStatus === 'offline' ? 'bg-red-500' :
                        'bg-yellow-500 animate-pulse'
                      }`} />
                      <div className="flex-1">
                        <p className="font-mono text-sm font-bold text-zinc-300">
                          {serverStatus === 'online' ? 'ONLINE' :
                           serverStatus === 'offline' ? 'OFFLINE' :
                           'CHECKING...'}
                        </p>
                        <p className="font-mono text-xs text-zinc-500 mt-1">{API_URL}</p>
                      </div>
                      <Button
                        onClick={checkServerHealth}
                        size="sm"
                        variant="outline"
                        className="border-zinc-700 hover:border-orange-600 hover:text-orange-400 font-mono text-xs"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        재확인
                      </Button>
                    </div>
                  </div>

                  {/* Server Info */}
                  {serverInfo && (
                    <div>
                      <Label className="text-xs font-mono text-zinc-400 mb-3 block">SERVER INFORMATION</Label>
                      <div className="bg-black/50 border border-zinc-800 rounded-lg p-4 font-mono text-xs">
                        <pre className="text-green-400 whitespace-pre-wrap">
                          {JSON.stringify(serverInfo, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* API Endpoints */}
                  <div>
                    <Label className="text-xs font-mono text-zinc-400 mb-3 block">API ENDPOINTS</Label>
                    <div className="space-y-2">
                      {[
                        { method: 'POST', path: '/router/chat', desc: 'Chat with LLM' },
                        { method: 'POST', path: '/api/v1/pipeline/start', desc: 'Start simulation' },
                        { method: 'GET', path: '/api/v1/pipeline/{id}', desc: 'Get pipeline status' },
                        { method: 'GET', path: '/api/v1/health', desc: 'Health check' },
                      ].map((endpoint, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-900/30 border border-zinc-800 rounded">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            endpoint.method === 'POST' ? 'bg-orange-600/20 text-orange-400' : 'bg-blue-600/20 text-blue-400'
                          }`}>
                            {endpoint.method}
                          </span>
                          <span className="flex-1 font-mono text-sm text-zinc-300">{endpoint.path}</span>
                          <span className="text-xs text-zinc-500">{endpoint.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 bg-black/40 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-xs font-mono text-zinc-600">
            COMPUTATIONAL MATERIALS SCIENCE LAB · KOOKMIN UNIVERSITY · PFM SIMULATION ENGINE v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
