import { sortBy, order as orderConstant } from 'src/contants/product'
import { QueryConfig } from '../ProductList'
import classNames from 'classnames'
import { ProductListConfig } from 'src/types/product.type'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/contants/path'
import { omit } from 'lodash'

interface Props {
  queryConfig: QueryConfig
  page_size: number
}

export default function xSortProductList({ queryConfig, page_size }: Props) {
  const page = Number(queryConfig.page)
  const { sort_by = sortBy.view, order } = queryConfig
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate()
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  return (
    <div className='py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames('h-9 px-4 capitalizes rounded-sm text-s text-center', {
              'bg-oranges text-white hover:bg-oranges/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-9 px-4 capitalizes rounded-sm text-s text-center', {
              'bg-oranges text-white hover:bg-oranges/80': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-9 px-4 capitalizes rounded-sm text-s text-center', {
              'bg-oranges text-white hover:bg-oranges/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </button>
          <select
            className={classNames(
              'h-9 px-4 capitalize outline-none text-sm rounded-sm bg-white  hover:bg-slate-100 text-left',
              {
                'text-oranges': isActiveSortBy(sortBy.price),
                'text-black': !isActiveSortBy(sortBy.price)
              }
            )}
            value={order || ''}
            onChange={(event) =>
              handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)
            }
          >
            <option value='' disabled className='py-3'>
              Giá
            </option>
            <option value={orderConstant.asc} className='py-3'>
              Giá : Thấp đến cao{' '}
            </option>
            <option value={orderConstant.desc} className='py-3'>
              Giá : Cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-oranges'>{page}</span>
            <span>/{page_size}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='bg-white/60 h-9 w-9 rounded p-2 shadow-sm border cursor-not-allowed bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-4 w-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5L8.25 12l7.5-7.5'
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='bg-white/60 h-9 w-9 rounded p-2 shadow-sm border'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-4 w-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5L8.25 12l7.5-7.5'
                  />
                </svg>
              </Link>
            )}
            {page === page_size ? (
              <span className='bg-white/60 h-9 w-9 rounded p-2 shadow-sm border cursor-not-allowed bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-4 w-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='bg-white/60 h-9 w-9 rounded p-2 shadow-sm border'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-4 w-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
