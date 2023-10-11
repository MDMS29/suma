import {useContext} from 'react'
import { GlobalContext } from "../context/GlobalProvider"

const useGlobal = () => {
  return useContext (GlobalContext)
}

export default useGlobal