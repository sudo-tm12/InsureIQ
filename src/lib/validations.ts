import { z } from 'zod'

export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid SA phone number')
    .max(15, 'Please enter a valid SA phone number'),
  loanType: z.enum(['vehicle', 'home', 'personal', 'business', 'other'], {
    error: 'Please select a loan type',
  }),
  loanAmount: z.string().min(1, 'Please enter an approximate loan amount'),
  message: z.string().max(500).optional(),
  consent: z.literal(true, {
    error: 'You must consent to proceed',
  }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
