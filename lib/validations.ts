import { z } from "zod";

// Validação para cadastro (com senha, caso use no futuro)
export const cadastroSchema = z
  .object({
    nome: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
    email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
    telefone: z
      .string()
      .min(14, "Telefone é obrigatório") 
      .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato inválido. Use (XX) XXXXX-XXXX"),
    senha: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "A senha precisa de uma letra minúscula, uma maiúscula e um número",
      ),
    confirmarSenha: z.string().min(1, "A confirmação de senha é obrigatória"),
    // Enum corrigido para refletir apenas os planos existentes
    plano: z.enum(["basico", "essencial_mensal", "aprova_mensal"], {
      errorMap: () => ({ message: "Por favor, selecione um plano." })
    }),
    aceitaTermos: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos de uso para continuar.",
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

// Validação para login (sem alterações)
export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
  lembrarMe: z.boolean().optional(),
});

// Validação para o fluxo de cadastro atual (sem senha)
export const cadastroSemSenhaSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("E-mail inválido."),
  telefone: z.string().min(14, "O número de telefone parece inválido."),
  plano: z.string().min(1, "Você deve selecionar um plano."),
  aceitaTermos: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de uso para continuar.",
  }),
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CadastroSemSenhaFormData = z.infer<typeof cadastroSemSenhaSchema>;