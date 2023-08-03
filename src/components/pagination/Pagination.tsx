import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/contants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  page_size: number
}
const RANGE = 2

export default function Pagination({ queryConfig, page_size }: Props) {
  const page = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span className='h-8 w-10 px-3 py-2  mx-2' key={index}>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotafter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span className='h-8 w-10 px-3 py-2  mx-2 ' key={index}>
            ...
          </span>
        )
      }
      return null
    }
    return Array(page_size)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (
          page <= RANGE * 2 + 1 &&
          pageNumber > page + RANGE &&
          pageNumber < page_size - RANGE + 1
        ) {
          return renderDotafter(index)
        } else if (page > RANGE * 2 + 1 && page < page_size - RANGE * 2) {
          if (pageNumber > RANGE && pageNumber < page - RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < page_size - RANGE + 1) {
            return renderDotafter(index)
          }
        } else if (
          page >= page_size - RANGE * 2 &&
          pageNumber > RANGE &&
          pageNumber < page - RANGE
        ) {
          return renderDotBefore(index)
        }

        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            className={classNames(
              'rounded mx-2 flex h-8 w-10 cursor-pointer items-center justify-center',
              {
                'bg-oranges text-white': pageNumber === page,
                'border-transparent': pageNumber !== page
              }
            )}
            key={index}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <div className='flex flex-wrap my-6 justify-center'>
      {page === 1 ? (
        <span className='bg-white/40 h-8 w-10 cursor-not-allowed rounded px-3 py-2 shadow-sm mx-2 border'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-4 w-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
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
          className='bg-white h-8 w-10 rounded px-3 py-2 shadow-sm mx-2 border'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-4 w-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </Link>
      )}
      {renderPagination()}
      {page === page_size ? (
        <span className='bg-white/60 h-8 w-10 cursor-not-allowed rounded px-3 py-2 shadow-sm mx-2 border'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-4 w-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
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
          className='bg-white/60 h-8 w-10 rounded px-3 py-2 shadow-sm mx-2 border'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-4 w-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </Link>
      )}
    </div>
  )
}
