import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItem {
  question: string
  answer: string
}

export interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {items.map(({ question, answer }, i) => (
        <details
          key={i}
          className="group bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 1px 8px rgba(11,45,120,0.05)' }}
        >
          <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer font-body font-semibold text-[16px] text-brand-navy select-none">
            <span>{question}</span>
            <ChevronDown
              className="accordion-chevron w-5 h-5 text-brand-muted"
              aria-hidden="true"
            />
          </summary>
          <div className="px-6 pb-6 border-t border-brand-border pt-4">
            <p className="text-brand-muted text-[15px] font-body leading-relaxed">{answer}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
