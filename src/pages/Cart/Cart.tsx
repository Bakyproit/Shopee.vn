import { produce } from 'immer'
import { keyBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/contants/path'
import { purchasesStatus } from 'src/contants/purchase'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import Product from '../ProductList/Components/Product'

interface ExtendedPurchase extends Purchase {
  disabled: boolean
  checked: boolean
}

export default function Cart() {
  const [extendedPurchases, setExtendedPurChases] = useState<ExtendedPurchase[]>([])
  //api them gio hang
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })
  // api update
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  //api delete
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  //api mua san pham
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-right',
        autoClose: 1000
      })
    }
  })
  // api productList
  const queryConfig = useQueryConfig()
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProduct(queryConfig as ProductListConfig)
    },
    staleTime: 3 * 60 * 1000
  })
  const purchasesInCart = purchasesInCartData?.data.data
  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)
  const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked)
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasePrice = checkedPurchases.reduce((result, current) => {
    return result + current.product.price * current.buy_count
  }, 0)
  const totalCheckedPurchaseSavingPrice = checkedPurchases.reduce((result, current) => {
    return (
      result + (current.product.price_before_discount - current.product.price) * current.buy_count
    )
  }, 0)
  //them thanh phan object
  useEffect(() => {
    setExtendedPurChases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      // console.log(extendedPurchasesObject)
      return (
        purchasesInCart?.map((purchases) => ({
          ...purchases,
          disabled: false,
          checked: Boolean(extendedPurchasesObject[purchases._id]?.checked)
        })) || []
      )
    })
  }, [purchasesInCart])

  // handle check
  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurChases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }
  // handle check all
  const handleCheckAll = () => {
    setExtendedPurChases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }
  //handle buycount
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurChases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }
  //truyen buycount
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurChases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }
  //handle delete
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseId])
  }
  // handle xoa nhieu items
  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchaseIds)
  }
  //handle mua san pham
  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            {/* tieu de */}
            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className='h-5 w-5 accent-oranges'
                      checked={isAllChecked}
                      onChange={handleCheckAll}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid text-center grid-cols-5'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            {/* tieu de */}
            {/* san pham */}
            {extendedPurchases.length > 0 && (
              <div className='my-3 rounded-sm bg-white p-5 shadow'>
                {extendedPurchases?.map((purchase, index) => (
                  <div
                    className='mb-5 first:mt-0 items-center grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500'
                    key={purchase._id}
                  >
                    <div className='col-span-6'>
                      <div className='flex'>
                        <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                          <input
                            type='checkbox'
                            className='h-5 w-5 accent-oranges'
                            checked={purchase.checked}
                            onChange={handleChecked(index)}
                          />
                        </div>
                        <div className='flex-grow'>
                          <div className='flex'>
                            <Link
                              to={`${path.home}${generateNameId({
                                name: purchase.product.name,
                                id: purchase.product._id
                              })}`}
                              className='h-20 w-20 flex-shrink-0'
                            >
                              <img src={purchase.product.image} alt={purchase.product.name} />
                            </Link>
                            <div className='flex-grow px-2 pt-1 pb-2'>
                              <Link
                                to={`${path.home}${generateNameId({
                                  name: purchase.product.name,
                                  id: purchase.product._id
                                })}`}
                                className='line-clamp-2 text-left ml-1'
                              >
                                {purchase.product.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-6'>
                      <div className='grid text-center grid-cols-5'>
                        <div className='col-span-2'>
                          <div className='flex items-center justify-center'>
                            <span className='text-gray-500 line-through'>
                              ₫{formatCurrency(purchase.product.price_before_discount)}
                            </span>
                            <span className='ml-3 text-black'>
                              ₫{formatCurrency(purchase.product.price)}
                            </span>
                          </div>
                        </div>
                        <div className='col-span-1'>
                          <QuantityController
                            max={purchase.product.quantity}
                            value={purchase.buy_count}
                            classNameWrapper='flex items-center'
                            onIncrease={(value) =>
                              handleQuantity(index, value, value <= purchase.product.quantity)
                            }
                            onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                            onType={handleTypeQuantity(index)}
                            onFocusOut={(value) =>
                              handleQuantity(
                                index,
                                value,
                                value >= 1 &&
                                  value <= purchase.product.quantity &&
                                  value !== (purchasesInCart as Purchase[])[index].buy_count
                              )
                            }
                            disabled={purchase.disabled}
                          />
                        </div>
                        <div className='col-span-1'>
                          <span className='ml-3 text-oranges'>
                            ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                          </span>
                        </div>
                        <div className='col-span-1'>
                          <button
                            onClick={handleDelete(index)}
                            className='bg-none text-black transition-color hover:text-oranges'
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* san pham */}
          </div>
        </div>
        {/* Thanh toan */}
        <div className='sticky bottom-0 mt-10 px-9 z-10 flex flex-col sm:flex-row sm:items-center rounded-sm bg-white p-5 shadow border border-gray-100'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input
                type='checkbox'
                className='h-5 w-5 accent-oranges'
                checked={isAllChecked}
                onChange={handleCheckAll}
              />
            </div>
            <button className='mx-3 border-none bb-none' onClick={handleCheckAll}>
              Chọn tất cả({extendedPurchases.length})
            </button>
            <button onClick={handleDeleteManyPurchases} className='mx-3 border-none bb-none'>
              Xóa
            </button>
          </div>
          <div className='sm:ml-auto flex flex-col sm:flex-row sm:mt-0 sm:items-center'>
            <div className=''>
              <div className='flex items-center sm:justify-end'>
                <div className=''>Tổng thanh toán({checkedPurchasesCount} sản phẩm ) :</div>
                <div className='ml-2 text-2xl text-oranges'>
                  đ{formatCurrency(totalCheckedPurchasePrice)}
                </div>
              </div>
              <div className='flex items-center sm:justify-end text-sm'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-oranges'>
                  đ{formatCurrency(totalCheckedPurchaseSavingPrice)}
                </div>
              </div>
            </div>
            <Button
              onClick={handleBuyPurchases}
              disabled={buyProductsMutation.isLoading}
              className='h-10 w-52 sm:ml-4 mt-5 sm:mt-0 leading-10 text-center uppercase rounded-sm bg-oranges text-white text-sm hover:opacity-80 flex justify-center items-center'
            >
              Mua hàng
            </Button>
          </div>
        </div>
        {/* Thanh toan */}
        {/* Có thể bạn cũng thích */}
        <div className='mt-8'>
          <div className='uppercase text-gray-400'>Có thể bạn cũng thích</div>
          {productData && (
            <div className='mt-6 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5  xl:grid-cols-5'>
              {productData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Có thể bạn cũng thích */}
      </div>
    </div>
  )
}
