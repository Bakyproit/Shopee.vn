import classNames from 'classnames'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import path from 'src/contants/path'
import { Category } from 'src/types/category.type'
import { QueryConfig } from '../../ProductList'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rule'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUnderfineField } from 'src/types/utils.type'
import RatingStars from '../RatingStars'
import { omit } from 'lodash'

interface Props {
  categories: Category[]
  queryConfig: QueryConfig
}

type FormData = NoUnderfineField<Pick<Schema, 'price_min' | 'price_max'>>
const priceSchema = schema.pick(['price_max', 'price_min'])

export default function AsideFilter({ categories, queryConfig }: Props) {
  const { category } = queryConfig
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })

  const navigate = useNavigate()
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])
      ).toString()
    })
  }
  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-oranges': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <ul>
        {categories.map((categoryItem) => (
          <li className='py-2 pl-2' key={categoryItem._id}>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  category: categoryItem._id
                }).toString()
              }}
              className={classNames('relative px-2', {
                'text-oranges font-semibold': category === categoryItem._id
              })}
            >
              {category === categoryItem._id && (
                <svg viewBox='0 0 4 7' className='absolute left-[-10px] top-1 h-2 w-2 fill-oranges'>
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
              )}
              {categoryItem.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link to={path.home} className='flex items-center mt-4 uppercase font-bold'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='my-5'>
        <div className=''>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ Từ'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                    classNameInput='h-8 px-2 w-full outline-none border text-xs border-gray-300 rounded-sm focus:border-gray-500 focus:shadow-sm'
                  />
                )
              }}
            />

            <div className='mx-2 mt-2 shrink-0'> - </div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ Đến'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                    classNameInput='h-8 px-2 w-full outline-none border text-xs border-gray-300 rounded-sm focus:border-gray-500 focus:shadow-sm'
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 text-red-600 text-sm min-h-[1.25rem] text-center'>
            {errors.price_min?.message}
          </div>
          <Button
            type='submit'
            className='w-full p-2 uppercase bg-oranges rounded-sm text-white text-sm hover:bg-oranges/80 flex justify-center items-center'
          >
            <p>Áp dụng</p>
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[1px] my-4' />
      <div className='text-sm'>Đánh giá</div>
      <RatingStars queryConfig={queryConfig} />
      <div className='bg-gray-300 h-[1px] my-4' />
      <Button
        onClick={handleRemoveAll}
        className='w-full py-2 px-2 uppercase bg-oranges rounded-sm text-white text-sm hover:bg-oranges/80 flex justify-center items-center'
      >
        <p>Xóa tất cả</p>
      </Button>
    </div>
  )
}
