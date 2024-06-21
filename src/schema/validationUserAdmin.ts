import { z } from 'zod';
import { validateName, validateIfNameHasNumber } from '../utils/validate';

export const schemaAddUserAdmin = z.object({
  username: z
    .string()
    .refine(
      (val) => !/[^.-\w]/g.test(val),
      'Nome de login não pode ter caracteres especiais'
    ),
  name: z.string().superRefine((val, ctx) => {
    if (validateName(val.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Coloque o seu nome completo!',
        fatal: true
      });
    }
    if (validateIfNameHasNumber(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nome não pode ter símbolos ou números',
        fatal: true
      });
    }
  }),
  email: z.string().email('Insira um e-mail válido'),
  role: z.string(),
  password: z
    .string()
    .min(8, 'A senha tem que ter ao menos 8 caracteres')
    .superRefine((val, ctx) => {
      const regexNumber = !/\d/.test(val);
      const regexLetter = !/\D/.test(val);
      const regexCaracter = !/\W/.test(val);
      const regexUpperCase = !/[A-Z]/g.test(val);
      const regexLowerCase = !/[a-z]/g.test(val);
      if (regexNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter um número',
          fatal: true
        });
      }
      if (regexLetter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra',
          fatal: true
        });
      }
      if (regexCaracter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter um caracter como @ !',
          fatal: true
        });
      }
      if (regexLowerCase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra maiúscula',
          fatal: true
        });
      }
      if (regexUpperCase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra minúscula',
          fatal: true
        });
      }
    })
});

export const schemaAlterPassword = z.object({
  password: z
    .string()
    .min(8, 'A senha tem que ter ao menos 8 caracteres')
    .superRefine((val, ctx) => {
      const regexNumber = !/\d/.test(val);
      const regexLetter = !/\D/.test(val);
      const regexCaracter = !/\W/.test(val);
      const regexUpperCase = !/[A-Z]/g.test(val);
      const regexLowerCase = !/[a-z]/g.test(val);
      if (regexNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter um número',
          fatal: true
        });
      }
      if (regexLetter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra',
          fatal: true
        });
      }
      if (regexCaracter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter um caracter como @ !',
          fatal: true
        });
      }
      if (regexLowerCase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra maiúscula',
          fatal: true
        });
      }
      if (regexUpperCase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra minúscula',
          fatal: true
        });
      }
    })
});

export const schemaUserAdminProfile = z.object({
  username: z
    .union([
      z
        .string()
        .refine(
          (val) => !/[^.-\w]/g.test(val),
          'Nome de login não pode ter caracteres especiais'
        ),
      z.string().min(4),
      z.string().length(0)
    ])
    .optional()
    .transform((e) => (e === '' ? undefined : e)),
  name: z
    .union([
      z.string().superRefine((val, ctx) => {
        if (validateName(val.trim())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Coloque o seu nome completo!',
            fatal: true
          });
        }
        if (validateIfNameHasNumber(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Nome não pode ter símbolos ou números',
            fatal: true
          });
        }
      }),
      z.string().min(4),
      z.string().length(0)
    ])
    .optional()
    .transform((e) => (e === '' ? undefined : e)),
  email: z
    .union([
      z.string().email('Insira um e-mail válido'),
      z.string().min(4),
      z.string().length(0)
    ])
    .optional()
    .transform((e) => (e === '' ? undefined : e))
});

export type FormAddUserAdmin = z.infer<typeof schemaAddUserAdmin>;
export type FormUserAdminProfile = z.infer<typeof schemaUserAdminProfile>;
export type FormAlterPassword = z.infer<typeof schemaAlterPassword>;
