import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { Box, Modal, Paper, Typography } from '@mui/material'
import { RequestContext } from 'next/dist/server/base-server'
import { useState } from 'react'
import { Transition } from 'react-transition-group'
import { requireSession } from './auth-mw/auth'
import AddLicenseModal from './components/AddLicenseModal'

export default function Home({ user }: { user: any }) {

  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false);



  return (
    <>
      <div className={`w-full h-full bg-[#e7ebef] p-[5%] flex flex-col gap-[10%]
         ${open ? 'blur-3xl' : ''}
         `}>

        <div className='flex flex-col gap-2 flex-1 min-h-0'>
          <div className='flex gap-5'>
            <Paper className="basis-[50%] p-4 text-center">
              Verfügbare Lermittel
            </Paper>
            <Paper className="basis-[50%] invisible">
            </Paper>
          </div>

          <div className='flex gap-5 min-h-0
          '>
            <Paper className="basis-[50%] p-[2%] 
            grid grid-cols-[repeat(auto-fill,100px)]
            grid-rows-[repeat(auto-fill,100px)]
              overflow-scroll
             gap-2">

              <Box
                sx={
                  {
                    backgroundColor: 'white',
                    height: '100px',
                    width: '100px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #e7ebef',
                  }
                }
                onClick={() => setOpen(true)}
              >
                <AddOutlinedIcon
                  sx={
                    {
                      color: "#DAE2F3",
                      fontSize: '100px',
                      cursor: 'pointer',
                    }
                  }
                >

                </AddOutlinedIcon>

              </Box>

           

              <AddLicenseModal open={open} setOpen={setOpen} />

            </Paper>

            <Paper className="basis-[50%] p-[2%]">
              2
            </Paper>
          </div>

        </div>

        <div className='flex flex-col gap-2 flex-1'>
          <div className='flex gap-5'>
            <Paper className="basis-[50%] p-4  border-box text-center">
              Zuweisung Verwalten
            </Paper>
            <Paper className="basis-[50%] invisible">
            </Paper>
          </div>

          <div className='flex gap-5 h-full'>
            <Paper className="basis-[50%] p-[2%]">
              1
            </Paper>
            <Paper className="basis-[50%] p-[2%]">
              2
            </Paper>
          </div>

        </div>

      </div>
    </>
    // <Core>

    // </Core>
  )
}

export async function getServerSideProps(context: RequestContext) {
  return requireSession(context).then((props) => {
    console.log({ props })
    // fetch users with axios
    // axios.get('http://localhost:3000/api/users').then((res) => {
    //   console.log(res.data)
    // })
    return props

  })
}
