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
          message: 'A senha precisa ter um número ' + val,
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
          message: 'A senha precisa ter uma letra minúscula',
          fatal: true
        });
      }
      if (regexUpperCase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra maiúscula',
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
          message: 'A senha precisa ter uma letra minúscula',
          fatal: true
        });
      }
      if (regexUpperCase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha precisa ter uma letra maiúscula',
          fatal: true
        });
      }
    })
});

export const schemaUserAdminUsername = z.object({
  username: z
    .string()
    .refine(
      (val) => !/[^.-\w]/g.test(val),
      'Nome de login não pode ter caracteres especiais'
    )
});

export const schemaUserAdminName = z.object({
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
  })
});

export const schemaUserAdminEmail = z.object({
  email: z.string().email('Insira um e-mail válido')
});

export const schemaUserAdminRole = z.object({
  role: z.string()
});

export type FormAddUserAdmin = z.infer<typeof schemaAddUserAdmin>;
export type FormUserAdminUsername = z.infer<typeof schemaUserAdminUsername>;
export type FormUserAdminName = z.infer<typeof schemaUserAdminName>;
export type FormUserAdminEmail = z.infer<typeof schemaUserAdminEmail>;
export type FormUserAdminRole = z.infer<typeof schemaUserAdminRole>;
export type FormAlterPassword = z.infer<typeof schemaAlterPassword>;
