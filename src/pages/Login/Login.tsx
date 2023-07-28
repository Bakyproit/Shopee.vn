import { yupResolver } from '@hookform/resolvers/yup'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'
import { ErrorRespone } from 'src/types/utils.type'
import { Schema, schema } from 'src/utils/rule'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorRespone<FormData>>(error)) {
          const formData = error.response?.data.data
          if (formData) {
            Object.keys(formData).forEach((key) => {
              setError(key as keyof FormData, {
                message: formData[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-oranges bg-bglogin bg-contain bg-no-repeat bg-center'>
      <div className='container h-img'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12  lg:pr-5'>
          <div className='lg:col-span-2 lg:col-start-4 '>
            <form className='p-10 mt-10  rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                name='email'
                type='email'
                className='mt-8'
                register={register}
                placeholder='Email'
                errorMessage={errors.email?.message}
              />
              <Input
                name='password'
                type='password'
                className='mt-2'
                register={register}
                placeholder='Password'
                errorMessage={errors.password?.message}
              />
              <div className='mt-3'>
                <Button
                  disabled={loginMutation.isLoading}
                  isLoading={loginMutation.isLoading}
                  type='submit'
                  className='h-10 leading-10 w-full text-center uppercase rounded-sm bg-oranges text-white text-sm hover:opacity-80 flex justify-center items-center'
                >
                  Đăng nhập
                </Button>
              </div>
              <div className=' mt-8 flex items-center justify-center'>
                <span className='text-gray-300'>Bạn chưa đã có tài khoản ? </span>
                <Link to='/register' className='text-red-400 ml-1'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
