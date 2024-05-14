const z = require("zod");

const validateQuizOptions = (value, ctx) => {
  // Check for duplicate elements
  if (value.length !== new Set(value).size) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Options contain duplicate elements.",
    });
  }
  // Check for empty array
  if (value.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Options cannot be less than 2.",
    });
  }
};

const validateModelAnswer = (data) =>
  data.quizOptions.includes(data.quizModelAnswer);

const quizOptionsSchema = z
    .array(z.string())
    .superRefine(validateQuizOptions);

const quizValidation = z
  .object({
    chatRoomId: z.string(),
    quizImage: z.optional(z.string()),
    quizQuestion: z.string(),
    quizOptions: quizOptionsSchema,
    quizModelAnswer: z.string(),
    quizTopics: z.array(z.string()),
    end_date: z.string(),
  })
  .refine(validateModelAnswer, {
    message: "Model answer must be one of the options.",
  });

const quizValidation2 = z
  .object({
    quizId: z.string(),
    quizImage: z.optional(z.string()),
    quizQuestion: z.string(),
    quizOptions: quizOptionsSchema,
    quizModelAnswer: z.string(),
    quizTopics: z.array(z.string()),
    end_date: z.string(),
  })
  .refine(validateModelAnswer, {
    message: "Model answer must be one of the options.",
  });
    
module.exports = { quizValidation, quizValidation2};