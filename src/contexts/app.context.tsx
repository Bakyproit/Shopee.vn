import { createContext, useState } from 'react'
import { ExtendedPurchase } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessTokenToLS, getProfileFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  extendedPurchases: ExtendedPurchase[]
  setExtendedPurChases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
}

const initalAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenToLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurChases: () => null
}

export const AppContext = createContext<AppContextInterface>(initalAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initalAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initalAppContext.profile)
  const [extendedPurchases, setExtendedPurChases] = useState<ExtendedPurchase[]>(
    initalAppContext.extendedPurchases
  )

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendedPurchases,
        setExtendedPurChases
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
