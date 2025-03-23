import { z } from "zod";
import { createSafeTool } from "../libs/tool-register.js";
import { prisma } from "../libs/prisma-client.js";
import { jsonToPlainText } from "json-to-plain-text";
import { PlanStatus, TodoPriority, TodoStatus } from "@prisma/client";


/** 
 * AskWulang 
 * 
*/

const AskWulangSchema = z.object({
  question: z.string().describe("The question to ask Wulang"),
});

export const AskWulang = createSafeTool({
  name: "ask_wulang",
  description: "Ask Wulang a question about the user question",
  schema: AskWulangSchema.shape,
  handler: async (input: z.infer<typeof AskWulangSchema>) => {
    return {
      content: [{ type: "text", text: `to accomplish the user question: ${input.question}, you should do the following steps:
        1. Analyze the user question 
        2. Create a plan using the tool: create_plan, make sure to include all the uncertainties in the plan
        3. Do research on the uncertainty using the tool: do_research_on_uncertainty
        4. Update the confidence of the uncertainty using the tool: update_uncertainty_confidence
        5. Improve the plan using the tool: improve_plan
        6. Add todo to the plan using the tool: add_todo_to_plan
        7. Do the todo using the tool: do_todo
        8. report the todo using the tool: report_todo
        `}],
    };
  },
});
/**
 * Create a plan
 */

const CreatePlanSchema = z.object({
  name: z.string().describe("The name of the plan"),
  description: z.string().describe("The detailed description of the plan"),
  confident: z.number().min(0).max(100).describe("The confidence of the plan 1-100%"),
  uncertainties: z.array(z.object({
    description: z.string().describe("The detailed description of the uncertainty,describe the uncertainty in detail"),
    uncertaintyConfidence: z.number().min(0).max(100).describe("The confidence of the uncertainty 1-100%"),
    actionsToResolve: z.string().describe("The actions to take to resolve the uncertainty"),
  })).describe("The uncertainties of the plan"),
});

export const CreatePlan = createSafeTool({
  name: "create_plan",
  description: "Create a plan",
  schema: CreatePlanSchema.shape,
  handler: async (input: z.infer<typeof CreatePlanSchema>) => {
    const plan = await prisma.plan.create({
      data: {
        name: input.name,
        description: input.description,
        status: PlanStatus.ACTIVE,
        confident: Number(input.confident),
        uncertainties: {
          create: input.uncertainties.map((uncertainty) => ({
            description: uncertainty.description,
            confidence: Number(uncertainty.uncertaintyConfidence),
            actionsToResolve: uncertainty.actionsToResolve,
          })),
        },
      },
    });
    return {
      content: [{
        type: "text",
        text: `Plan created successfully: ${plan.planId}`
      }],
      type: "text"
    };
  },
});

/**
 * Get plan list
 */


export const GetAllPlans = createSafeTool({
  name: "get_all_plans",
  description: "Get all plans to get the plan ID",
  schema: z.object({}).shape,
  handler: async () => {
    const plans = await prisma.plan.findMany({
      where: {
        status: PlanStatus.ACTIVE,
      },
    });
    return {
      content: [{
        type: "text",
        text: jsonToPlainText(plans, {})
      }],
      type: "text"
    };
  },
});

/** 
 * Get plan with uncertainty list
*/

const GetDetailedPlanSchema = z.object({
  planId: z.number().describe("The id of the plan"),
});

export const GetDetailedPlan = createSafeTool({
  name: "get_detailed_plan",
  description: "Get a plan with detailed information with uncertainty list and todo list",
  schema: GetDetailedPlanSchema.shape,
  handler: async (input: z.infer<typeof GetDetailedPlanSchema>) => {
    const plan = await prisma.plan.findUnique({
      where: {
        planId: input.planId,
      },
      include: {
        uncertainties: true,
        todos: true,
      },
    });
    if (!plan) {
      return {
        content: [{
          type: "text",
          text: `Plan not found`
        }],
      };
    }

    const result = {
      plan: plan,
      todos: plan.todos,
      uncertainties: plan.uncertainties,
    }
    return {
      content: [{
        type: "text",
        text: jsonToPlainText(result, {})
      }],
      type: "text"
    };
  },
});


/** 
 * update uncertainty confidence
*/

const UpdateUncertaintyConfidenceSchema = z.object({
  uncertaintyId: z.number().describe("The id of the uncertainty"),
  confidence: z.number().min(0).max(100).describe("The confidence of the uncertainty 1-100"),
  actionsResult: z.string().describe("The actions result"),
});

export const UpdateUncertaintyConfidence = createSafeTool({
  name: "update_uncertainty_confidence",
  description: "Update the confidence of a uncertainty after the research is done",
  schema: UpdateUncertaintyConfidenceSchema.shape,
  handler: async (input: z.infer<typeof UpdateUncertaintyConfidenceSchema>) => {
    const uncertainty = await prisma.uncertainty.update({
      where: {
        uncertaintyId: input.uncertaintyId,
      },
      data: {
        confidence: Number(input.confidence),
        actionsResult: input.actionsResult,
      },
    });
    if (!uncertainty) {
      return {
        content: [{
          type: "text",
          text: `Uncertainty not found`
        }],
      };
    }
    return {
      content: [{
        type: "text",
        text: `Uncertainty updated successfully: ${uncertainty.uncertaintyId}, the next step is to iterate until all uncertainties are resolved`
      }],
      type: "text"
    };
  },
});



/** 
 * Do research on a uncertainty to update the confidence
*/

enum ResearchTool {
  GREP_SEARCH = "grep_search",
  LIST_DIR = "list_dir",
  FILE_SEARCH = "file_search",
  WEB_SEARCH = "web_search in reddit, stackoverflow, official document, etc.",
}

const DoResearchOnUncertaintySchema = z.object({
  uncertaintyId: z.number().describe("The id of the uncertainty"),
  researchTool: z.array(z.nativeEnum(ResearchTool)).describe("The tool to do research on the uncertainty"),
});

export const DoResearchOnUncertainty = createSafeTool({
  name: "do_research_on_uncertainty",
  description: "Do research on a uncertainty to update the confidence, you can use the tool like graph  to do research on the uncertainty",
  schema: DoResearchOnUncertaintySchema.shape,
  handler: async (input: z.infer<typeof DoResearchOnUncertaintySchema>) => {
    const uncertainty = await prisma.uncertainty.findUnique({
      where: {
        uncertaintyId: input.uncertaintyId,
      },
    });
    if (!uncertainty) {
      return {
        content: [{
          type: "text",
          text: `Uncertainty not found`
        }],
      };
    }
    return {
      content: [{
        type: "text",
        text: `
        Do research about the uncertainty: ${uncertainty?.description}
        Please do deep research on the uncertainty and update the uncertainty confidence, use the tool: ${input.researchTool.join(", ")}`
      }],
    };
  },
});


/**
 * Update final plan 
*/

const ImprovePlanSchema = z.object({
  planId: z.number().describe("The id of the plan"),
  description: z.string().describe("The Improved plan description after the uncertainty is resolved"),
});

export const ImprovePlan = createSafeTool({
  name: "improve_plan",
  description: "Make sure the plan is improved after the uncertainty is resolved",
  schema: ImprovePlanSchema.shape,
  handler: async (input: z.infer<typeof ImprovePlanSchema>) => {
    const plan = await prisma.plan.update({
      where: {
        planId: input.planId,
      },
      data: {
        description: input.description,
      },
    });
    if (!plan) {
      return {
        content: [{
          type: "text",
          text: `Plan not found`
        }],
      };
    }
    return {
      content: [{
        type: "text",
        text: `Plan updated successfully: ${plan.planId}, the next step is to add todo to the plan`
      }],
    };
  },
});


/** 
 * Add todo to plan
*/

const AddTodoToPlanSchema = z.object({
  planId: z.number().describe("The id of the plan"),
  description: z.string().describe("The detailed description of the todo"),
  priority: z.nativeEnum(TodoPriority).describe("The priority of the todo"),
  status: z.nativeEnum(TodoStatus).describe("The status of the todo"),
});

export const AddTodoToPlan = createSafeTool({
  name: "add_todo_to_plan",
  description: "Add a todo to a plan, the todo is a step to do the plan",
  schema: AddTodoToPlanSchema.shape,
  handler: async (input: z.infer<typeof AddTodoToPlanSchema>) => {
    const todo = await prisma.todo.create({
      data: {
        planId: input.planId,
        description: input.description,
        priority: input.priority,
        status: input.status,
      },
    });
    if (!todo) {
      return {
        content: [{
          type: "text",
          text: `Failed to add todo to plan`
        }],
      };
    }
    return {
      content: [{
        type: "text",
        text: `Todo added successfully: ${todo.todoId}`
      }],
    };
  },
});

/** 
 * Do  todo
*/

const DoTodoSchema = z.object({
  todoId: z.number().describe("The id of the todo"),
  status: z.nativeEnum(TodoStatus).default(TodoStatus.TODO).describe("The status of the todo"),
});

export const DoTodo = createSafeTool({
  name: "do_todo",
  description: "Do a todo",
  schema: DoTodoSchema.shape,
  handler: async (input: z.infer<typeof DoTodoSchema>) => {
    // get the todo     
    const todo = await prisma.todo.findUnique({
      where: {
        todoId: input.todoId,
      },
    });
    if (!todo) {
      return {
        content: [{
          type: "text",
          text: `Todo not found`
        }],
      };
    }
    return {
      content: [{
        type: "text",
        text: `Please do the todo: ${todo.description} sequentially`
      }],
    };
  },
});

/** 
 * Report a todo
*/

const ReportTodoSchema = z.object({
  todoId: z.number().describe("The id of the todo"),
  status: z.nativeEnum(TodoStatus).default(TodoStatus.DONE).describe("The status of the todo"),
  report: z.string().describe("The report of the todo"),
});

export const ReportTodo = createSafeTool({
  name: "report_todo",
  description: "Report a todo with status and report",
  schema: ReportTodoSchema.shape,
  handler: async (input: z.infer<typeof ReportTodoSchema>) => {
    const todo = await prisma.todo.update({
      where: {
        todoId: input.todoId,
      },
      data: {
        report: input.report,
        status: input.status,
      },
    });
    if (!todo) {
      return {
        content: [{
          type: "text",
          text: `Todo not found`
        }],
      };
    }
    return {
      content: [{
        type: "text",
        text: `Todo reported successfully: ${todo.todoId}`
      }],
    };
  },
});


