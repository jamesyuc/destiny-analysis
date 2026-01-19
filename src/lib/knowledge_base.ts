import { KnowledgeBase } from "@/types";

export const KNOWLEDGE_BASE: KnowledgeBase = {
    career: {
        id: "career",
        label: "事业学业",
        description: "分析职场发展、学业考试、创业机会与贵人运",
        slots: [
            {
                key: "current_status",
                question_intent: "现状（顺境/逆境/瓶颈）",
                description: "目前的工作或学业状态，是否顺利，是否存在想离职/放弃的念头"
            },
            {
                key: "career_or_study",
                question_intent: "是工作还是学业",
                description: "用户关心的是职场工作还是升学考试、考公考研"
            },
            {
                key: "industry_trends",
                question_intent: "行业与环境因素",
                description: "所处行业/学校的发展前景，公司/学校是否稳定"
            },
            {
                key: "authority_relation",
                question_intent: "与上级/老师的关系",
                description: "与老板、领导、导师的相处情况，是否有贵人运或被压制"
            },
            {
                key: "peer_relation",
                question_intent: "同事/同学关系",
                description: "与同事或同学相处如何，是否有竞争压力或小人干扰"
            },
            {
                key: "career_goals",
                question_intent: "未来变动意向",
                description: "是否有明确的跳槽、转行、创业或升学计划"
            }
        ]
    },
    relationships: {
        id: "relationships",
        label: "情感家庭",
        description: "分析感情状态、婚姻关系、子女缘分与亲子关系",
        slots: [
            {
                key: "relationship_status",
                question_intent: "现有感情状态",
                description: "单身、暧昧、恋爱中、已婚或离异"
            },
            {
                key: "core_conflict",
                question_intent: "核心矛盾点",
                description: "目前面临的最大障碍（如性格不合、家庭反对、异地、信任问题等）"
            },
            {
                key: "partner_traits",
                question_intent: "对象特征/择偶标准",
                description: "对方的性格、能力，或者你理想中的伴侣特质"
            },
            {
                key: "family_pressure",
                question_intent: "家庭压力",
                description: "是否有来自父母的催婚、干涉或经济方面的压力"
            },
            {
                key: "children_topic",
                question_intent: "子女相关",
                description: "是否关心生育时机、子女教育或亲子关系问题"
            }
        ]
    },
    wealth: {
        id: "wealth",
        label: "财富运势",
        description: "分析正财偏财、投资理财、破财风险与财务规划",
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
            },
            {
                key: "investment_interest",
                question_intent: "投资意向",
                description: "是否有股票、基金、房产等投资计划或经历"
            },
            {
                key: "wealth_goals",
                question_intent: "财务目标",
                description: "近期有什么大额支出计划，如买房、买车、结婚等"
            }
        ]
    },
    health: {
        id: "health",
        label: "身心健康",
        description: "分析身体健康、心理状态、体质特征与养生建议",
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
                description: "是否有焦虑、压力大、失眠、抑郁等心理健康问题"
            },
            {
                key: "work_life_balance",
                question_intent: "工作生活平衡",
                description: "是否经常加班熬夜，工作压力是否影响健康"
            },
            {
                key: "health_goals",
                question_intent: "健康目标或担忧",
                description: "最想解决的健康问题是什么，有什么具体担心"
            }
        ]
    },
    living: {
        id: "living",
        label: "居住环境",
        description: "分析居住风水、搬迁时机、置业规划与环境选择",
        slots: [
            {
                key: "current_living",
                question_intent: "现在的居住情况",
                description: "目前住的是租房还是自有房产，独居还是与家人同住"
            },
            {
                key: "living_concerns",
                question_intent: "居住方面的困扰",
                description: "是否有噪音、邻里关系、采光通风、风水等问题"
            },
            {
                key: "relocation_plans",
                question_intent: "搬迁或置业计划",
                description: "是否有搬家、买房、装修的打算，时间节点"
            },
            {
                key: "location_preference",
                question_intent: "地理位置偏好",
                description: "倾向于哪个城市或区域，考虑因素是什么"
            },
            {
                key: "ideal_environment",
                question_intent: "理想居住环境",
                description: "喜欢什么样的居住环境，城市还是郊区，高层还是别墅"
            }
        ]
    }
};
