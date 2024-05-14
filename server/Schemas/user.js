const z = require("zod");

const emailSchema = z.custom((value) => {
    if (!value.endsWith("@hku.hk") && !value.endsWith("@connect.hku.hk")) {
        throw new Error("Invalid email address");
    }
    return value;
    }
);

// const userSchema = z.object({
//     firstname: z.string().min(3).max(32),
//     lastname: z.string().min(3).max(32),
//     email: emailSchema,
// });

const studentProfileSchema = z.object({
    email: emailSchema,
    password: z.string().min(8).max(8),
    firstname: z.string().min(3).max(32),
    lastname: z.string().min(3).max(32),
    date_of_birth: z.string().min(3).max(32),
    firstMajor: z.string().min(3).max(32),
    secondMajor: z.optional(z.string().min(0).max(32)),
    minor: z.optional(z.string().min(0).max(32)),
    profile_image: z.optional(z.string()),
    year_of_study: z.string().min(3).max(32),
    nickname: z.string().min(3).max(32),
});

const studentProfileSchema2 = z.object({
  secondMajor: z.optional(z.string().min(0).max(32)),
  minor: z.optional(z.string().min(0).max(32)),
  profile_image: z.optional(z.string()),
  nickname: z.string().min(3).max(32),
});

module.exports = { emailSchema, studentProfileSchema, studentProfileSchema2 };