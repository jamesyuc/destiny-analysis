import { KnowledgeBase } from "@/types";

export const KNOWLEDGE_BASE: KnowledgeBase = {
    career: {
        id: "career",
        label: "事业前程",
        description: "分析职场发展、创业机会与职业瓶颈",
        slots: [
            {
                key: "current_status",
                question_intent: "现状（顺境/逆境/瓶颈）",
                description: "目前的工作状态，是否顺利，是否存在想离职的念头"
            },
            {
                key: "industry_trends",
                question_intent: "行业与环境因素",
                description: "所处行业的发展前景，公司是否稳定"
            },
            {
                key: "authority_relation",
                question_intent: "与上级/权威的关系",
                description: "与老板、领导的相处情况，是否有贵人运或被压制"
            },
            {
                key: "career_goals",
                question_intent: "未来变动意向",
                description: "是否有明确的跳槽、转行或创业计划"
            }
        ]
    },
    relationships: {
        id: "relationships",
        label: "情感婚姻",
        description: "分析感情状态、正缘特征与核心矛盾",
        slots: [
            {
                key: "relationship_status",
                question_intent: "现有感情状态",
                description: "单身、暧昧、恋爱中、已婚或离异"
            },
            {
                key: "core_conflict",
                question_intent: "核心矛盾点",
                description: "目前面临的最大障碍（如性格不合、家庭反对、异地等）"
            },
            {
                key: "partner_traits",
                question_intent: "对象特征/择偶标准",
                description: "对方的性格、能力，或者你理想中的伴侣特质"
            }
        ]
    },
    wealth: {
        id: "wealth",
        label: "财富运势",
        description: "分析正财偏财、破财风险与理财能力",
        slots: [
            {
                key: "income_source",
                question_intent: "主要收入来源",
                description: "是靠工资（正财）还是投资/副业（偏财）"
            },
            {
                key: "financial_risk",
                question_intent: "风险与负债",
                description: "是否有借贷压力、投资亏损或被骗经历"
            },
            {
                key: "spending_habits",
                question_intent: "消费与储蓄",
                description: "是否存得住钱，平时消费观念如何"
            }
        ]
    },
    health: {
        id: "health",
        label: "身体健康",
        description: "分析健康隐患、体质特征与养生建议",
        slots: [
            {
                key: "current_symptoms",
                question_intent: "现有症状或困扰",
                description: "目前身体有什么不适、慢性病或亚健康状态"
            },
            {
                key: "lifestyle_habits",
                question_intent: "生活作息习惯",
                description: "睡眠质量、饮食规律、运动频率等日常习惯"
            },
            {
                key: "mental_state",
                question_intent: "精神与情绪状态",
                description: "是否有焦虑、压力大、失眠等心理健康问题"
            },
            {
                key: "health_goals",
                question_intent: "健康目标或担忧",
                description: "最想解决的健康问题是什么，有什么担心"
            }
        ]
    },
    living: {
        id: "living",
        label: "居住环境",
        description: "分析居住风水、搬迁时机与环境选择",
        slots: [
            {
                key: "current_living",
                question_intent: "现在的居住情况",
                description: "目前住的是租房还是自有房产，环境如何"
            },
            {
                key: "living_concerns",
                question_intent: "居住方面的困扰",
                description: "是否有噪音、邻里关系、采光通风等问题"
            },
            {
                key: "relocation_plans",
                question_intent: "搬迁或置业计划",
                description: "是否有搬家、买房、装修的打算"
            },
            {
                key: "ideal_environment",
                question_intent: "理想居住环境",
                description: "喜欢什么样的居住环境，城市还是郊区，高层还是别墅"
            }
        ]
    }
};
