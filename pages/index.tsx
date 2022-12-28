import { Divider, MenuItem, MenuList, NativeSelect, Paper, Table } from '@mui/material'
import axios from 'axios'
import { RequestContext } from 'next/dist/server/base-server'
import { useEffect, useState } from 'react'
import { requireSession } from './auth-mw/auth'
import Core from './components/core'

export default function Home({ user }: { user: any }) {

  const [users, setUsers] = useState([])



  return (
    <Core>
      
    </Core>
  )
}

export async function getServerSideProps(context: RequestContext) {
  return requireSession(context).then((props) => {
    // fetch users with axios
    // axios.get('http://localhost:3000/api/users').then((res) => {
    //   console.log(res.data)
    // })
    return props

  })
}
