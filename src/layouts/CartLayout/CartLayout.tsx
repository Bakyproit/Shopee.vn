import React from 'react'
import CartHeader from 'src/components/CartHeader'
import Footer from 'src/components/Footer/Footer'

interface Props {
  children?: React.ReactNode
}
export default function CartLayout({ children }: Props) {
  return (
    <div className=''>
      <CartHeader />
      {children}
      <Footer />
    </div>
  )
}
 