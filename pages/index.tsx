import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { Box, Divider, MenuItem, Modal, Paper, Select, Typography } from '@mui/material'
import { RequestContext } from 'next/dist/server/base-server'
import { useEffect, useState } from 'react'
import { Transition } from 'react-transition-group'
import { useStore } from './zustand/store';
import { requireSession } from './auth-mw/auth'
import AddLicenseModal from './components/AddLicenseModal'
import { toBILO } from './helper/helper'

export default function Home({ user }: { user: any }) {

  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false);
  const { licenseDefinitions, fetchLicenseDefinitions } = useStore(state => state)
  const [pickedLicense, setPickedLicense] = useState<any>(null)

  let constraints = pickedLicense?.permissions[0]?.constraints



  let bilo = toBILO(pickedLicense)

  useEffect(() => {
    fetchLicenseDefinitions()
  }, [])

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

              {licenseDefinitions.map((el, i) => {
                const ele = el[0]
                const metadata = ele.metadata
                return (
                  <div
                    style={
                      {
                        borderBottom: pickedLicense?.policyid === ele.policyid ? '2px solid #3f51b5' : 'none',

                      }
                    }
                    className="flex justify-center items-center"
                  >

                    <Paper
                      sx={
                        {
                          backgroundColor: 'white',
                          borderRadius: '10px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '90px',
                          height: '90px',
                          border: '1px solid #e7ebef',
                          position: 'relative',
                          backgroundImage: `url(${metadata.annotation[1].description.value})`,
                          opacity: pickedLicense?.policyid === ele.policyid ? 1 : 0.5,
                        }
                      }
                      className="hover:opacity-100 transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setPickedLicense(ele)
                      }}
                    >


                    </Paper>
                  </div>

                )

              })}



              <AddLicenseModal open={open} setOpen={setOpen} />

            </Paper>

            <Paper className="basis-[50%] p-[2%] overflow-scroll">

              <h1>{pickedLicense?.metadata.general?.title?.value}</h1>
              <div>Product ID: <b>{pickedLicense?.permissions[0].target}</b></div>

              <div>Anzahl: <b>{constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/count').rightoperand}</b></div>

              <div>Lizenztyp: <b>{constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/purpose').rightoperand}</b></div>

              <div>
                Aktivierung (von):<b> {constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime' && item.operator === 'http://www.w3.org/ns/odrl/2/gteq').rightoperand}</b>
              </div>

              <div>
                Aktivierung (bis):   <b>{constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime' && item.operator === 'http://www.w3.org/ns/odrl/2/lteq').rightoperand}</b>
              </div>

              <div>
                Gültigskeitsdauer: <b>{constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/elapsedTime').rightoperand}</b>
              </div>
              {
                constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/recipient') &&

                <div
                >Sonderlizenz:
                  <b>
                    {" " + constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/recipient').rightoperand}
                  </b>
                </div>
              }

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
              <Select defaultValue={'nutzer'}>
                <MenuItem value={'nutzer'} selected={
                  bilo.lizenzTyp !== 'Gruppenlizenz' && true}>Nutzer</MenuItem>
                <MenuItem value={'gruppe'}>Gruppe</MenuItem>

              </Select>
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


