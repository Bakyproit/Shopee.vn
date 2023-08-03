import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import ProductRating from 'src/components/ProductRating'
import QuantityController from 'src/components/QuantityController'
import { ProductListConfig, Product as ProductType } from 'src/types/product.type'
import { toast } from 'react-toastify'
import {
  formatCurrency,
  formatNumberToSocialStyle,
  getIdFromNameId,
  rateSale
} from 'src/utils/utils'
import Product from '../ProductList/Components/Product'
import purchaseApi from 'src/apis/purchase.api'
import { purchasesStatus } from 'src/contants/purchase'

type DataBody = {
  product_id: string
  buy_count: number
}

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const [buyCount, setBuyCount] = useState(1)
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  //goi api productDetail
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const product = productDetailData?.data.data

  const queryConfig: ProductListConfig = {
    limit: '20',
    page: '1',
    category: product?.category._id
  }
  // goi api productList
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProduct(queryConfig)
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })
  // console.log(productData?.data.data.products)
  //Add to cart
  const addToCartMutation = useMutation({
    mutationFn: (body: DataBody) => purchaseApi.addToCart(body)
  })

  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }
  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }
  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()

    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    //
    const { offsetX, offsetY } = event.nativeEvent
    const left = offsetX * (1 - naturalWidth / rect.width)
    const top = offsetY * (1 - naturalHeight / rect.height)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }
  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }
  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light'
          })
          queryClient.invalidateQueries({
            queryKey: ['purchases', { status: purchasesStatus.inCart }]
          })
        }
      }
    )
  }
  if (!product) return null
  // console.log(product)
  return (
    <div className='bg-gray-200 py-6'>
      {/* product detail */}
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            {/* left */}
            <div className='col-span-5'>
              <div
                className='relative w-full pt-[100%] shadow overflow-hidden cursor-zoom-in'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className='absolute top-0 left-0 pointer-events-none h-full w-full bg-white object-cover'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/3 z-10 h-9 w-5 -traslate-y-1/2 bg-black/20 text-white'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 19.5L8.25 12l7.5-7.5'
                    />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div
                      className='relative w-full pt-[100%]'
                      key={img}
                      onMouseEnter={() => chooseActive(img)}
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 h-full cursor-pointer w-full bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-oranges'></div>}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/3 z-10 h-9 w-5 -traslate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.25 4.5l7.5 7.5-7.5 7.5'
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* left */}
            {/* right */}
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-4 flex items-center'>
                <div className='flex items-center'>
                  <span className='span mr-1 border-b border-b-oranges text-oranges'>
                    {product.rating}
                  </span>
                  <ProductRating
                    rating={product.rating}
                    activeClassName='fill-oranges text-oranges h-4 w-4'
                    nonActiveClassname='h-4 w-4 fill-gray-300 text-gray-300'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <span className='span mr-1 border-b border-b-black text-black'>32</span>
                <span className='ml-1 text-gray-500'>Đánh giá</span>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <span>{formatNumberToSocialStyle(product.sold)}</span>
                <span className='ml-1 text-gray-500'>Đã bán</span>
              </div>
              {/* giá sản phâm*/}
              <div className='mt-4 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>
                  ₫{formatCurrency(product.price_before_discount)}
                </div>
                <div className='ml-3 text-3xl font-medium text-oranges'>
                  ₫{formatCurrency(product.price)}
                </div>
                <div className='ml-4 rounded-sm bg-oranges px-1 py-[2px] text-xs font-semibold  text-white'>
                  {rateSale(product.price_before_discount, product.price)} Giảm giá
                </div>
              </div>
              {/* Gía sản phẩm */}
              {/* Số lượng */}
              <div className='mt-4 flex items-center'>
                <div className='capitalize text-gray-500'> Số lượng</div>
                <QuantityController
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                />
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} Sản phẩm có sẵn</div>
              </div>
              {/* Số lượng */}
              {/* Thêm giỏ hàng */}
              <div className='mt-4 flex items-center'>
                <button
                  className='flex h-12 items-center justify-center rounded-sm border border-oranges bg-orange/10 px-5 capitalize text-oranges shadow-sm hover:bg-oranges/5'
                  onClick={addToCart}
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-oranges text-oranges'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line
                        fill='none'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        x1='7.5'
                        x2='10.5'
                        y1={7}
                        y2={7}
                      />
                      <line
                        fill='none'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        x1={9}
                        x2={9}
                        y1='8.5'
                        y2='5.5'
                      />
                    </g>
                  </svg>
                  Thêm vào giở hàng
                </button>
                <button className='ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-oranges px-5 bg-oranges capitalize text-white shadow-sm outline-none hover:bg-oranges/90'>
                  Mua ngay
                </button>
              </div>
              {/* Thêm giở hàng */}
            </div>
            {/* right */}
          </div>
        </div>
      </div>
      {/* product detail */}
      {/* chi tiết sản phẩm */}
      <div className='mt-8'>
        <div className='container'>
          <div className=' bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>
              Mô tả sản phẩm
            </div>
            <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
              {/* css */}
              <div
                className=''
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                  // DOMPurify.sanitize('js')
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* chi tiết sản phẩm */}
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>Có thể bạn cũng thích</div>
          {productData && (
            <div className='mt-6 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6'>
              {productData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
