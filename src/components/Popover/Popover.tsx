import { FloatingPortal, Placement, arrow, offset, shift, useFloating } from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ElementType, useId, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initalOpen?: boolean
  placement?: Placement
}
export default function Popover({
  placement = 'bottom-end',
  children,
  className,
  renderPopover,
  as: Element = 'div',
  initalOpen
}: Props) {
  const [isOpen, setIsOpen] = useState(initalOpen || false)
  const arrowRef = useRef<HTMLElement>(null)
  const id = useId()
  const { x, y, refs, strategy, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })],
    placement: placement
  })

  const showPopover = () => {
    setIsOpen(true)
  }
  const hidePopover = () => {
    setIsOpen(false)
  }
  return (
    <Element className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal id={id}>
            <motion.div
              ref={refs.setFloating}
              style={{
                position: strategy,
                left: x ?? 0,
                top: y ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <span
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
                ref={arrowRef}
                className='border-[11px] border-x-transparent border-t-transparent border-b-gray-50 absolute translate-y-[-94%] z-10 '
              ></span>
              {renderPopover}
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </Element>
  )
}
