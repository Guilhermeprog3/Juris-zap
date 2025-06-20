import { z } from "zod"

// Validação para cadastro
export const cadastroSchema = z
  .object({
    nome: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
    email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
    telefone: z
      .string()
      .min(1, "Telefone é obrigatório")
      .regex(/^$$\d{2}$$\s\d{4,5}-\d{4}$/, "Formato: (11) 99999-9999"),
    senha: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número",
      ),
    confirmarSenha: z.string().min(1, "Confirmação de senha é obrigatória"),
    plano: z.enum(["basico", "estudante", "profissional"], {
      required_error: "Selecione um plano",
    }),
    aceitaTermos: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos de uso",
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas não coincidem",
    path: ["confirmarSenha"],
  })

// Validação para login
export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
  lembrarMe: z.boolean().optional(),
})

// Validação para pagamento com cartão
export const pagamentoCartaoSchema = z.object({
  nomeCartao: z
    .string()
    .min(2, "Nome no cartão é obrigatório")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
  numeroCartao: z
    .string()
    .min(1, "Número do cartão é obrigatório")
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Formato: 1234 5678 9012 3456"),
  validade: z
    .string()
    .min(1, "Validade é obrigatória")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato: MM/AA"),
  cvv: z
    .string()
    .min(3, "CVV deve ter 3 dígitos")
    .max(4, "CVV deve ter no máximo 4 dígitos")
    .regex(/^\d{3,4}$/, "CVV deve conter apenas números"),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato: 123.456.789-01"),
  endereco: z.object({
    cep: z
      .string()
      .min(1, "CEP é obrigatório")
      .regex(/^\d{5}-\d{3}$/, "Formato: 12345-678"),
    rua: z.string().min(1, "Endereço é obrigatório"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(1, "Bairro é obrigatório"),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    estado: z.string().min(2, "Estado é obrigatório").max(2, "Use a sigla do estado"),
  }),
})

export type CadastroFormData = z.infer<typeof cadastroSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type PagamentoCartaoFormData = z.infer<typeof pagamentoCartaoSchema>
