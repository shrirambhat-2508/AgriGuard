import React from "react"

interface SectionHeaderProps {
  title: string
  action?: React.ReactNode
}

export default function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-display font-semibold text-[15px] text-charcoal">
        {title}
      </h2>
      {action && <div>{action}</div>}
    </div>
  )
}
