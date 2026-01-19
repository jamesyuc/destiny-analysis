"use client";

import { useMachine } from '@xstate/react';
import { appMachine } from '@/lib/state_machine';
import { InfoForm } from '@/components/InfoForm';
import { StoryInput } from '@/components/StoryInput';
import { ReportView } from '@/components/ReportView'; // Import
import { DimensionTransition } from '@/components/DimensionTransition'; // Import
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { SlotState } from '@/types';

export default function Home() {
  const [state, send] = useMachine(appMachine);

  // Local state for chat UI in Inquiry Loop
  const [chatHistory, setChatHistory] = useState<{ role: 'ai' | 'user', content: string }[]>([]);
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationRound, setConversationRound] = useState(0);
  const [lastUserReply, setLastUserReply] = useState<string>('');
  const [generationError, setGenerationError] = useState(false);

  // Progress calculation
  const MIN_ROUNDS = 4; // Should match prompts.tse for Dimension Intro
  // UI State for Dimension Intro
  const [showDimensionIntro, setShowDimensionIntro] = useState(false);
  const [introDimensionId, setIntroDimensionId] = useState<string | null>(null);

  // Ref to prevent duplicate question generation
  const isAskingRef = useRef(false);

  // Report State
  const [reportContent, setReportContent] = useState<string>('');

  // Derive simple boolean states for conditional rendering
  const isIdle = state.matches('idle');
  const isListeningStory = state.matches('listening_story');
  const isAnalyzing = state.matches('analyzing_intent');
  const isInquiryLoop = state.matches('inquiry_loop');
  const isGenerating = state.matches('generating_report');

  // MOCK MODE TOGGLE - set to false for production
  const IS_MOCK_MODE = false;
  const DEV_SHORTCUTS = false; // Set to true to enable dev shortcuts for UI debugging

  // Dev function: Jump directly to chat UI
  const devJumpToChat = () => {
    // Set up mock profile with correct UserProfile fields
    send({ type: 'SUBMIT_PROFILE', profile: { birthYear: '1990', birthMonth: '05', birthDay: '15', birthHour: '11', gender: 'male' } });
    setTimeout(() => {
      send({ type: 'SUBMIT_STORY', story: '我想了解我的事业发展方向' });
      setTimeout(() => {
        send({ type: 'DIMENSION_DETECTED', dimensionId: 'career', extractedInfo: {} });
        setChatHistory([
          { role: 'user', content: '我想了解我的事业发展方向，最近工作压力很大。' },
          { role: 'ai', content: '感应到阁下的气息...似乎与【事业】之局有关。且让贫道为您细细推演。' }
        ]);
      }, 100);
    }, 100);
  };

  // Dev function: Jump directly to report view
  const devJumpToReport = () => {
    send({ type: 'SUBMIT_PROFILE', profile: { birthYear: '1990', birthMonth: '05', birthDay: '15', birthHour: '11', gender: 'male' } });
    setTimeout(() => {
      send({ type: 'SUBMIT_STORY', story: '测试用故事' });
      setTimeout(() => {
        send({ type: 'DIMENSION_DETECTED', dimensionId: 'career', extractedInfo: {} });
        // Fill all slots to trigger report generation
        setTimeout(() => {
          send({ type: 'SLOT_FILLED', key: 'industry_overview', value: '互联网' });
          setTimeout(() => {
            send({ type: 'SLOT_FILLED', key: 'specific_concern', value: '职业发展' });
            setTimeout(() => {
              send({ type: 'SLOT_FILLED', key: 'timeline', value: '近期' });
            }, 50);
          }, 50);
        }, 100);
      }, 100);
    }, 100);
  };

  const handleDimensionSelectMock = async (story: string) => {
    send({ type: 'SUBMIT_STORY', story });

    if (IS_MOCK_MODE) {
      setTimeout(() => {
        const mockDim = 'career';
        send({
          type: 'DIMENSION_DETECTED',
          dimensionId: mockDim,
          extractedInfo: {}
        });
        // Add initial user message only (matching production behavior)
        setChatHistory(prev => [
          ...prev,
          { role: 'user', content: story }
        ]);
        // Reset asking lock to allow first question
        isAskingRef.current = false;
      }, 800);
      return;
    }

    try {
      const res = await fetch('/api/classify-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story })
      });
      const data = await res.json();

      if (data.dimensionId) {
        // Trigger Visual Transition
        setIntroDimensionId(data.dimensionId);
        setShowDimensionIntro(true);

        // Delay state update until transition finishes? 
        // Or update state but hide chat UI behind the transition overlay.
        // Let's update state immediately, but the overlay will cover it.
        send({
          type: 'DIMENSION_DETECTED',
          dimensionId: data.dimensionId,
          extractedInfo: data.extractedInfo || {}
        });

        // Add initial user message only, AI will ask first question via useEffect
        setChatHistory(prev => [
          ...prev,
          { role: 'user', content: story }
        ]);
        // Reset asking lock to allow first question
        isAskingRef.current = false;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Effect: Generate Report when entering final state
  useEffect(() => {
    if (isGenerating && !reportContent) {
      if (IS_MOCK_MODE) {
        setTimeout(() => {
          setReportContent(`
# 天机乾坤 · 事业篇

## 命盘总纲
君之八字，**火旺土燥**，势如烈火烹油。虽有凌云壮志，奈何时运未至，如困龙在渊。

## 关键因子解析
*   **日元**：[甲木]，生于[午月]，木火通明，但也易成灰烬。
*   **喜用**：水/木，以水润局，以木助身。

## 流年运势
> 2026 丙午年：火势更旺，需防急躁冒进。

建议阁下 **静心修身，待时而动**。切勿在今年进行重大的投资或转行。

*(此为UI测试样本数据)*
            `);
        }, 1500);
        return;
      }
      const fetchReport = async () => {
        setGenerationError(false);
        setReportContent('> 正在连接天机，推演命盘中... 请稍候（约需 5-10 秒）');

        let timeoutId: NodeJS.Timeout;
        const controller = new AbortController();

        try {
          // Timeout protection (120s) for report generation
          timeoutId = setTimeout(() => {
            if (!reportContent) {
              controller.abort();
              setGenerationError(true);
            }
          }, 120000);

          const res = await fetch('/api/generate-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              profile: state.context.userProfile,
              slots: state.context.slots,
              dimensionId: state.context.activeDimensionId
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!res.ok) throw new Error(res.statusText);

          // Handle streaming response
          if (res.body) {
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              accumulated += decoder.decode(value, { stream: true });
              setReportContent(accumulated);
            }
          } else {
            // Fallback for non-streaming response
            const text = await res.text();
            setReportContent(text);
          }
        } catch (e: any) {
          if (e.name === 'AbortError') {
            console.error("Report generation timed out");
          } else {
            console.error("Report Gen Error", e);
          }
          setGenerationError(true);
        } finally {
          if (timeoutId!) clearTimeout(timeoutId);
        }
      };
      fetchReport();
    }
  }, [isGenerating, state.matches('generating_report'), state.context, IS_MOCK_MODE]);

  // Effect: Asking Questions
  useEffect(() => {
    // Use ref to prevent duplicate calls
    if (isAskingRef.current) return;

    if (state.matches({ inquiry_loop: 'asking' }) && !isProcessing) {
      const missingSlot = state.context.slots.find(s => !s.is_filled);
      const filledCount = state.context.slots.filter(s => s.is_filled).length;

      if (missingSlot) {
        // Set lock immediately
        isAskingRef.current = true;

        if (IS_MOCK_MODE) {
          setIsProcessing(true);
          setTimeout(() => {
            const mockReplies = [
              "我能感受到您的困惑。关于您的行业，能告诉我您目前从事的具体领域吗？",
              "这确实是很重要的信息。那在当下的职场环境中，您最大的焦虑是什么呢？",
              "谢谢您的分享。接下来您有什么变动的打算吗，比如跳槽或转行？"
            ];
            const q = mockReplies[conversationRound % mockReplies.length];

            setAiQuestion(q);
            setChatHistory(prev => [...prev, { role: 'ai', content: q }]);
            // Don't increment here - increment when user replies
            setIsProcessing(false);
          }, 1000);
          return;
        }

        const generateQuestion = async () => {
          setIsProcessing(true);
          try {
            const res = await fetch('/api/generate-question', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                missingSlot,
                context: state.context.userStory,
                completedSlotsCount: filledCount,
                conversationRound,
                lastUserReply,
                filledSlots: state.context.slots.filter(s => s.is_filled).map(s => ({
                  key: s.key,
                  description: s.description,
                  value: s.value
                }))
              })
            });
            const data = await res.json();

            if (data.question === 'SKIP') {
              // SKIP: fill slot and reset lock to trigger next question
              send({ type: 'SLOT_FILLED', key: missingSlot.key, value: 'N/A (Skipped by AI)' });
              isAskingRef.current = false;
            } else if (data.wantsToSwitch) {
              // AI detected user wants to switch - just show the message guiding to button
              // No auto-switch, let user click the button themselves
              setAiQuestion(data.question);
              setChatHistory(prev => [...prev, { role: 'ai', content: data.question }]);
            } else {
              setAiQuestion(data.question);
              setChatHistory(prev => [...prev, { role: 'ai', content: data.question }]);
              // Don't increment here - increment when user replies
              // Keep lock on - waiting for user reply
            }
          } catch (e) {
            console.error(e);
            isAskingRef.current = false;
          } finally {
            setIsProcessing(false);
          }
        };
        generateQuestion();
      }
    }
  }, [state.value, state.context.slots, isProcessing, state.context.userStory, IS_MOCK_MODE, send, conversationRound, lastUserReply]);

  // Handle User Input
  const handleInquiryReply = async (reply: string) => {
    setChatHistory(prev => [...prev, { role: 'user', content: reply }]);
    setLastUserReply(reply); // Track for next question generation
    setConversationRound(prev => prev + 1); // Increment round when user replies

    // Reset asking lock to allow next question after user replies
    isAskingRef.current = false;

    const missingSlot = state.context.slots.find(s => !s.is_filled);
    if (!missingSlot) return;

    setIsProcessing(true);

    if (IS_MOCK_MODE) {
      setTimeout(() => {
        // Mock: always fill slot in mock mode
        send({ type: 'SLOT_FILLED', key: missingSlot.key, value: reply });
        setIsProcessing(false);
      }, 800);
      return;
    }

    try {
      const res = await fetch('/api/extract-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotKey: missingSlot.key,
          userReply: reply,
          questionIntent: missingSlot.question_intent
        })
      });
      const data = await res.json();

      if (data.extractedValue && !data.isOffTopic) {
        // Successfully extracted info

        // Critical Fix: Don't finish too early
        // If this is the LAST slot, check if we reached min rounds (4)
        // If not, don't fill the slot yet - let AI ask more deepening questions
        const remainingSlots = state.context.slots.filter(s => !s.is_filled).length;
        const MIN_ROUNDS = 4; // Must match prompts.ts

        if (remainingSlots <= 1 && conversationRound < MIN_ROUNDS) {
          console.log(`Info extracted but min rounds not reached (${conversationRound}/${MIN_ROUNDS}). Keeping slot open.`);
          // Do NOT send SLOT_FILLED. 
          // The useEffect will trigger again, AI will see the same missing slot + lastUserReply
          // and GENERATE_QUESTION_PROMPT logic will cause it to ask a follow-up/deepening question
        } else {
          send({ type: 'SLOT_FILLED', key: missingSlot.key, value: data.extractedValue });
        }

      } else if (data.isOffTopic || data.needsGuidance) {
        // User went off-topic, don't fill slot - next question will provide guidance
        console.log('User reply off-topic, will provide guidance in next question');
      } else {
        // Fallback: use raw reply
        // Also apply the min round check here
        const remainingSlots = state.context.slots.filter(s => !s.is_filled).length;
        if (remainingSlots <= 1 && conversationRound < 4) {
          console.log("Fallback reply but min rounds not reached. Keeping slot open.");
        } else {
          send({ type: 'SLOT_FILLED', key: missingSlot.key, value: reply });
        }
      }

    } catch (e) {
      console.error(e);
      // On error, fill with raw reply to prevent getting stuck
      // Unless it's the last slot and we're too early
      const remainingSlots = state.context.slots.filter(s => !s.is_filled).length;
      if (remainingSlots <= 1 && conversationRound < 4) {
        console.log("Error fallback but min rounds not reached.");
      } else {
        send({ type: 'SLOT_FILLED', key: missingSlot.key, value: reply });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle switching dimension from Report View or topic switch
  const handleRestart = (targetDimId?: string) => {
    if (!targetDimId) {
      // Full reset
      window.location.reload();
      return;
    }

    // Get Chinese label for the new dimension
    const dimLabels: Record<string, string> = {
      career: '事业', wealth: '财运', relationships: '感情',
      health: '健康', living: '居住'
    };
    const newDimLabel = dimLabels[targetDimId] || '命盘';

    // Preserve the original story but reset chat for new topic
    const originalStory = state.context.userStory || '';

    // Add a transition message to chat history
    setChatHistory(prev => [
      ...prev,
      { role: 'ai', content: `好的，那我们来聊聊${newDimLabel}方面的事。` }
    ]);

    setReportContent('');
    setConversationRound(0);
    setLastUserReply('');
    setIntroDimensionId(targetDimId);
    setShowDimensionIntro(true);

    // Reset asking lock
    isAskingRef.current = false;

    // Switch dimension with preserved context
    send({
      type: 'DIMENSION_DETECTED',
      dimensionId: targetDimId,
      extractedInfo: {}
    });
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-2 xs:p-3 sm:p-4 relative overflow-hidden bg-[url('/bg-grain.png')]">

      {/* Dimension Transition Overlay */}
      <AnimatePresence>
        {showDimensionIntro && introDimensionId && (
          <DimensionTransition
            dimensionId={introDimensionId}
            onComplete={() => setShowDimensionIntro(false)}
          />
        )}
      </AnimatePresence>

      {/* Background Decor (Orb) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">

        {/* Phase 1: Idle / Landing -> Info Form */}
        {isIdle && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col items-center z-10 px-4"
          >
            {/* Dev Shortcuts Panel - only shown in dev mode */}
            {DEV_SHORTCUTS && (
              <div className="absolute top-4 right-4 flex gap-2 z-50">
                <button
                  onClick={devJumpToChat}
                  className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors shadow-lg"
                >
                  🔧 Chat UI
                </button>
                <button
                  onClick={devJumpToReport}
                  className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg"
                >
                  🔧 Report UI
                </button>
              </div>
            )}

            {/* Main Title */}
            <div className="text-center mb-6">
              <h1 className="text-5xl font-serif mb-2" style={{
                background: 'linear-gradient(135deg, #fde68a, #f59e0b, #d97706)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(245,158,11,0.3)'
              }}>
                八 <span style={{ fontSize: '0.7em' }}>☯</span> 字
              </h1>
              <p className="text-amber-500/50 font-serif tracking-[0.5em] text-xs uppercase">
                DESTINY ANALYSIS
              </p>
            </div>
            <InfoForm onSubmit={(profile) => send({ type: 'SUBMIT_PROFILE', profile })} />
          </motion.div>
        )}


        {/* Phase 2: Story Input Only (Before Inquiry) */}
        {(isListeningStory || isAnalyzing) && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="w-full z-10"
          >
            <StoryInput
              onSubmit={handleDimensionSelectMock}
              isAnalyzing={isAnalyzing}
            />
          </motion.div>
        )}

        {/* Phase 3: Inquiry Loop (Chat Interface) */}
        {isInquiryLoop && (
          <motion.div
            key="inquiry"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl h-[100dvh] sm:h-[85vh] flex flex-col z-10 relative"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Chat Container with scroll styling */}
            <div className="chat-container flex-1 flex flex-col rounded-2xl overflow-hidden">

              {/* Header / Progress */}
              <div className="relative px-4 sm:px-6 py-3 sm:py-5 border-b border-amber-500/20">
                {/* Decorative line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-amber-900/30 animate-pulse-ring shrink-0">
                      <span className="text-amber-400 text-base sm:text-lg">☯</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="text-lg sm:text-xl font-serif tracking-widest"
                          style={{
                            background: 'linear-gradient(90deg, #fde68a, #d4af37)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {{
                            career: '事业', wealth: '财运', relationships: '感情',
                            health: '健康', living: '居住'
                          }[state.context.activeDimensionId || 'career'] || '命盘'} 之局
                        </h3>
                        {/* Switch Topic Button - next to title */}
                        <button
                          onClick={() => {
                            const dims = ['career', 'wealth', 'relationships', 'health', 'living'];
                            const currentDim = state.context.activeDimensionId;
                            const otherDims = dims.filter(d => d !== currentDim);
                            const labels: Record<string, string> = {
                              career: '事业', wealth: '财运', relationships: '感情',
                              health: '健康', living: '居住'
                            };
                            const choice = prompt(`想换个话题？\n\n1. ${labels[otherDims[0]]}\n2. ${labels[otherDims[1]]}\n3. ${labels[otherDims[2]]}\n4. ${labels[otherDims[3]]}\n\n输入数字 1-4:`);
                            if (choice && ['1', '2', '3', '4'].includes(choice)) {
                              handleRestart(otherDims[parseInt(choice) - 1]);
                            }
                          }}
                          className="text-xs px-3 py-1 rounded-full transition-all duration-300 hover:scale-105"
                          style={{
                            background: 'rgba(245,158,11,0.15)',
                            border: '1px solid rgba(245,158,11,0.4)',
                            color: 'rgb(251, 191, 36)'
                          }}
                        >
                          🔄 换话题
                        </button>
                      </div>
                      <p className="text-[10px] sm:text-xs text-amber-500/50 tracking-wider">天机推演中...</p>
                    </div>
                  </div>

                  {/* Progress indicator - hidden on very small screens */}
                  <div className="hidden sm:block text-right">
                    <div className="text-xs text-gray-500 mb-1 opacity-70">命盘解析</div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600/60 to-amber-400/60 transition-all duration-1000 rounded-full"
                          style={{
                            width: `${Math.min(30 + conversationRound * 15, 90)}%`,
                            boxShadow: '0 0 8px rgba(245, 158, 11, 0.3)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 space-y-4 sm:space-y-6">
                {chatHistory.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* AI Avatar */}
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-900/80 to-amber-800/60 border border-amber-500/40 flex items-center justify-center mr-2 sm:mr-3 mt-1 shrink-0 shadow-lg">
                        <span className="text-amber-400 text-xs sm:text-sm font-serif font-bold">道</span>
                      </div>
                    )}

                    <div className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-5 rounded-2xl text-sm sm:text-[15px] leading-relaxed relative ${msg.role === 'user' ? 'bubble-user rounded-br-sm' : 'bubble-ai rounded-bl-sm'}`}>
                      {msg.content}
                      {/* Decorative corner for AI */}
                      {msg.role === 'ai' && (
                        <>
                          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/40 rounded-tl" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/20 rounded-br" />
                        </>
                      )}
                    </div>

                    {/* User Avatar */}
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-900/80 to-purple-800/60 border border-purple-500/40 flex items-center justify-center ml-2 sm:ml-3 mt-1 shrink-0 shadow-lg">
                        <span className="text-purple-300 text-xs sm:text-sm">👤</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isProcessing && (
                  <div className="flex justify-start items-center gap-2 ml-10 sm:ml-14">
                    <div className="flex gap-1.5 p-3 px-5 rounded-full bg-amber-900/30 border border-amber-500/20">
                      <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <span className="text-xs text-amber-500/50 font-serif">推演中...</span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t border-amber-500/10 bg-black/30">
                <div className="relative">
                  <input
                    className="w-full bg-black/50 border-2 border-amber-500/20 rounded-full pl-4 sm:pl-6 pr-14 sm:pr-16 py-3 sm:py-4 text-sm sm:text-base text-amber-100 focus:outline-none focus:border-amber-500/50 focus:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all placeholder-amber-900/50 font-serif tracking-wide"
                    placeholder="请输入您的回应..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleInquiryReply(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 flex items-center justify-center text-black font-bold text-lg sm:text-xl hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg hover:shadow-amber-500/30 active:scale-95"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="请输入您的回应..."]') as HTMLInputElement;
                      if (input?.value.trim()) {
                        handleInquiryReply(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    ↑
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 4: Final Report */}
        {isGenerating && (
          <motion.div
            key="report"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full z-10"
          >
            {state.matches('generating_report') && !generationError && (
              <ReportView
                reportContent={reportContent}
                activeDimensionId={state.context.activeDimensionId || undefined}
                onRestart={(dim) => {
                  if (dim) {
                    send({ type: 'SWITCH_DIMENSION', dimensionId: dim });
                  } else {
                    window.location.reload();
                  }
                }}
              />
            )}

            {state.matches('generating_report') && generationError && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <div className="text-amber-500/80 text-xl font-serif mb-4">推演过程中断</div>
                <p className="text-gray-400 mb-8 max-w-md">天机晦涩，连接似乎出现了一些波动。请尝试重新建立连接。</p>
                <button
                  onClick={() => {
                    setGenerationError(false);
                    // Re-trigger effect by toggling a dummy state or just calling fetchReport logic if refactored
                    // Simplest way: reload for now or go back state. 
                    // Better: Manually trigger the fetch again component-side?
                    // The effect depends on state.matches('generating_report').
                    // To re-trigger, we can just unmount/remount or force update.
                    // Actually, since I removed reportContent from dep array of effect, 
                    // I can just force re-run by setting reportContent to '' inside the effect logic?
                    // Wait, the effect runs ONCE when entering the state.
                    // To retry, we might need a manual retry function outside useEffect.
                    window.location.reload(); // Simplest robust retry for prototype
                  }}
                  className="px-8 py-3 bg-amber-600/20 border border-amber-500/50 rounded-lg text-amber-500 hover:bg-amber-600/30 transition-all"
                >
                  重新尝试
                </button>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}
