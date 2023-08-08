import { useForm } from 'react-hook-form'
import useQueryConfig from './useQueryConfig'
import { yupResolver } from '@hookform/resolvers/yup'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { omit } from 'lodash'
import { Schema, schema } from 'src/utils/rule'
import path from 'src/contants/path'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])
export default function useSearchProducts() {
  const queryConfig = useQueryConfig()
  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const navigate = useNavigate()
  //search
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  return { onSubmitSearch, register }
}
