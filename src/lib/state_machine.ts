import { setup, assign } from 'xstate';
import { UserProfile, KnowledgeBase, SlotState } from '@/types';
import { KNOWLEDGE_BASE } from './knowledge_base';

export interface AppContext {
    userProfile: UserProfile | null;
    userStory: string;
    activeDimensionId: string | null;
    slots: SlotState[]; // Flattened list of active slots to fill
}

export type AppEvent =
    | { type: 'SUBMIT_PROFILE'; profile: UserProfile }
    | { type: 'SUBMIT_STORY'; story: string }
    | { type: 'DIMENSION_DETECTED'; dimensionId: string; extractedInfo: Partial<Record<string, string>> }
    | { type: 'SLOT_FILLED'; key: string; value: string }
    | { type: 'ALL_SLOTS_FILLED' }
    | { type: 'SWITCH_DIMENSION'; dimensionId?: string }
    | { type: 'RESET' };

export const appMachine = setup({
    types: {
        context: {} as AppContext,
        events: {} as AppEvent,
    },
    actions: {
        setProfile: assign({
            userProfile: ({ event }) => (event.type === 'SUBMIT_PROFILE' ? event.profile : null)
        }),
        setStory: assign({
            userStory: ({ event }) => (event.type === 'SUBMIT_STORY' ? event.story : '')
        }),
        initializeSlots: assign({
            activeDimensionId: ({ event }) => (event.type === 'DIMENSION_DETECTED' ? event.dimensionId : null),
            // Initialize slots from the KB for the detected dimension
            slots: ({ event }) => {
                if (event.type !== 'DIMENSION_DETECTED') return [];
                const dim = KNOWLEDGE_BASE[event.dimensionId];
                if (!dim) return [];
                // Map extracted info if any (mock logic for now)
                return dim.slots.map(s => ({
                    ...s,
                    value: event.extractedInfo[s.key] || undefined,
                    is_filled: !!event.extractedInfo[s.key]
                }));
            }
        }),
        updateSlot: assign({
            slots: ({ context, event }) => {
                if (event.type !== 'SLOT_FILLED') return context.slots;
                return context.slots.map(s =>
                    s.key === event.key ? { ...s, value: event.value, is_filled: true } : s
                );
            }
        })
    }
}).createMachine({
    id: 'baziApp',
    initial: 'idle',
    context: {
        userProfile: null,
        userStory: '',
        activeDimensionId: null,
        slots: []
    },
    states: {
        idle: {
            on: {
                SUBMIT_PROFILE: {
                    target: 'listening_story',
                    actions: 'setProfile'
                }
            }
        },
        listening_story: {
            on: {
                SUBMIT_STORY: {
                    target: 'analyzing_intent',
                    actions: 'setStory'
                }
            }
        },
        analyzing_intent: {
            // This state will trigger the Side Effect to call LLM Analysis
            // For now, we wait for an external event to confirm detection
            on: {
                DIMENSION_DETECTED: {
                    target: 'inquiry_loop',
                    actions: 'initializeSlots'
                }
            }
        },
        inquiry_loop: {
            initial: 'checking_slots',
            states: {
                checking_slots: {
                    always: [
                        { target: '#baziApp.generating_report', guard: ({ context }) => context.slots.every(s => s.is_filled) },
                        { target: 'asking' }
                    ]
                },
                asking: {
                    // AI generates a question based on the first empty slot
                    on: {
                        SLOT_FILLED: {
                            target: 'checking_slots',
                            actions: 'updateSlot'
                        }
                    }
                }
            }
        },
        generating_report: {
            on: {
                SWITCH_DIMENSION: {
                    target: 'listening_story',
                    actions: assign({
                        userStory: '',
                        activeDimensionId: null,
                        slots: []
                    })
                },
                RESET: {
                    target: 'idle',
                    actions: assign({
                        userProfile: null,
                        userStory: '',
                        activeDimensionId: null,
                        slots: []
                    })
                }
            }
        }
    }
});
