import * as yup from 'yup'

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

export const schema = yup
  .object({
    email: yup
      .string()
      .required('Email là bắt buộc')
      .email('Email không đúng định dạng')
      .min(5, 'Độ dài từ 5-160 ký tự')
      .max(160, 'Độ dài từ 5-160 ký tự'),
    password: yup
      .string()
      .required('Password là bắt buộc')
      .min(6, 'Độ dài từ 6-160 ký tự')
      .max(160, 'Độ dài từ 6-160 ký tự'),
    confirm_password: yup
      .string()
      .required('Nhập lại password là bắt buộc')
      .min(6, 'Độ dài từ 6-160 ký tự')
      .max(160, 'Độ dài từ 6-160 ký tự')
      .oneOf([yup.ref('password')], 'Nhập lại password không khớp'),
    price_min: yup
      .string()
      .test({
        name: 'price-not-allowed',
        message: 'Gía không phù hợp',
        test: testPriceMinMax
      })
      .required(),
    price_max: yup
      .string()
      .test({
        name: 'price-not-allowed',
        message: 'Gía không phù hợp',
        test: testPriceMinMax
      })
      .required(),
    name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
  })
  .required()

export type Schema = yup.InferType<typeof schema>
