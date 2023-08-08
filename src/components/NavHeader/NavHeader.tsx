import { Link } from 'react-router-dom'
import path from 'src/contants/path'
import Popover from '../Popover'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQueryClient } from 'react-query'
import authApi from 'src/apis/auth.api'
import { purchasesStatus } from 'src/contants/purchase'

export default function NavHeader() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext)
  const queryClient = useQueryClient()

  //logout
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      //remove query
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }
  return (
    <div className='flex justify-between'>
      <div className='flex ml-5'>
        <Link
          to='https://banhang.shopee.vn/'
          className=' capitalize hover:text-white/70 flex items-center text-sm'
        >
          <span className='hover:fill-white/70'>Kênh người bán</span>
        </Link>
        <Link to='' className='mx-2 capitalize hover:text-white/70 flex items-center text-sm'>
          <span>Tải ứng dụng</span>
        </Link>
        <Link to='' className='mx-2 capitalize hover:text-white/70 flex items-center text-sm'>
          <span>Kết nối</span>
        </Link>
      </div>
      <div className='flex'>
        <Link to='' className=' capitalize hover:text-white/70 flex items-center text-sm'>
          <svg
            viewBox='3 2.5 14 14'
            x={16}
            y={16}
            className='h-4 w-4 mr-1 fill-white hover:fill-white/70'
          >
            <path d='m17 15.6-.6-1.2-.6-1.2v-7.3c0-.2 0-.4-.1-.6-.3-1.2-1.4-2.2-2.7-2.2h-1c-.3-.7-1.1-1.2-2.1-1.2s-1.8.5-2.1 1.3h-.8c-1.5 0-2.8 1.2-2.8 2.7v7.2l-1.2 2.5-.2.4h14.4zm-12.2-.8.1-.2.5-1v-.1-7.6c0-.8.7-1.5 1.5-1.5h6.1c.8 0 1.5.7 1.5 1.5v7.5.1l.6 1.2h-10.3z' />
            <path d='m10 18c1 0 1.9-.6 2.3-1.4h-4.6c.4.9 1.3 1.4 2.3 1.4z' />
          </svg>
          <span className='hover:fill-white/70'>Thông Báo</span>
        </Link>
        <Link
          to='https://help.shopee.vn/portal'
          className='mx-2 capitalize hover:text-white/70 flex items-center text-sm'
        >
          <svg
            height={16}
            viewBox='0 0 16 16'
            width={16}
            className='h-4 w-4 mr-1 fill-white hover:fill-white/70'
          >
            <g fill='none' fillRule='evenodd' transform='translate(1)'>
              <circle cx={7} cy={8} r={7} stroke='currentColor' />
              <path
                fill='currentColor'
                d='m6.871 3.992c-.814 0-1.452.231-1.914.704-.462.462-.693 1.089-.693 1.892h1.155c0-.484.099-.858.297-1.122.22-.319.583-.473 1.078-.473.396 0 .715.11.935.33.209.22.319.517.319.902 0 .286-.11.55-.308.803l-.187.209c-.682.605-1.1 1.056-1.243 1.364-.154.286-.22.638-.22 1.045v.187h1.177v-.187c0-.264.055-.506.176-.726.099-.198.253-.396.462-.572.517-.451.825-.737.924-.858.275-.352.418-.803.418-1.342 0-.66-.22-1.188-.66-1.573-.44-.396-1.012-.583-1.716-.583zm-.198 6.435c-.22 0-.418.066-.572.22-.154.143-.231.33-.231.561 0 .22.077.407.231.561s.352.231.572.231.418-.077.572-.22c.154-.154.242-.341.242-.572s-.077-.418-.231-.561c-.154-.154-.352-.22-.583-.22z'
              />
            </g>
          </svg>
          <span> Hỗ trợ</span>
        </Link>
        <Popover
          className='cursos-pointer flex items-center py-1 hover:text-white/70'
          renderPopover={
            <div className='relative rounded-sm  border-gray-200 bg-white shadow-md'>
              <div className='flex flex-col py-2 pl-3 pr-28'>
                <button className='px-3 py-2 hover:text-orange'>Tiếng việt</button>
                <button className='mt-2 px-3 py-2 hover:text-orange'>English</button>
              </div>
            </div>
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
            />
          </svg>
          <span className='mx-1 text-sm'>Tiếng việt</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
          </svg>
        </Popover>
        {!isAuthenticated && (
          <div className='flex items-center'>
            <Link to={path.register} className='mx-3 capitalize hover:text-white/70 text-sm'>
              Đăng Ký
            </Link>
            <div className='h-4 border-r-[1px] border-r-white/40'></div>
            <Link to={path.login} className='mx-3 capitalize hover:text-white/70 text-sm'>
              Đăng Nhập
            </Link>
          </div>
        )}
        {isAuthenticated && (
          <Popover
            className='flex items-center py-1 hover:text-white/70 cursor-pointer ml-3'
            renderPopover={
              <div className='relative rounded-sm  border-gray-200 bg-white shadow-md'>
                <Link
                  to={path.profile}
                  className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  Tài khoản của tôi
                </Link>
                <Link
                  to='/'
                  className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  Đơn mua
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  Đăng xuất
                </button>
              </div>
            }
          >
            <div className='w-5 h-5 mr-2 flex-shrink-0'>
              <img
                src='data:image/jpeg;base64,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'
                alt='avatar'
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <div className='text-sm'>{profile?.email}</div>
          </Popover>
        )}
      </div>
    </div>
  )
}
