import React from "react"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-16 gap-4">
      <div className="w-20 h-20 rounded-3xl bg-brand-pale flex items-center justify-center text-4xl">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="font-display font-bold text-[20px] text-charcoal">
          {title}
        </h3>
        <p className="text-[15px] text-muted leading-relaxed">{description}</p>
      </div>
      {action && <div className="w-full mt-2">{action}</div>}
    </div>
  )
}
