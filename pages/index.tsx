import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { Autocomplete, Box, Button, MenuItem, Paper, Select, TextField } from '@mui/material'
import { RequestContext } from 'next/dist/server/base-server'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { isTemplateExpression } from 'typescript'
import { requireSession } from '../auth-mw/auth'
import AddLicenseModal from './components/AddLicenseModal'
import LaunchPage from './components/LaunchPage'
import LicenseAssignmentGroup from './components/LicenseAssigmentGroup'
import LicenseAssignmentUser from './components/LicenseAssignmentUser'
import NotificationPage from './components/NotificationPage'
import { toBILO } from '../helper/helper'
import { useStore } from '../zustand/store'


export default dynamic(() => Promise.resolve(Home), {
  ssr: false
})


function Home({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const {
    licenseDefinitions,
    fetchLicenseDefinitions,
    fetchLicenseAssignments,
    users,
    fetchUsersAndGroups: fetchUsers,
    groups,
    setNotification,
    notification,
    fetchAccessToken,
    licenseAssignments
  } = useStore(state => state)
  const [pickedLicenses, setPickedLicenses] = useState<any>(null)

  const [pickedSelect, setPickedSelect] = useState('placeholder')
  const [selectedUsers, setSelectedUsers] = useState<any>(users)
  const [selectedGroups, setSelectedGroups] = useState<any>([])

  let constraints = pickedLicenses ? pickedLicenses[0]?.permissions[0]?.constraints : null

  let pickedLicense = pickedLicenses ? pickedLicenses[0] : null
  let bilo = toBILO(pickedLicense)
  const currentlyAssignedAmount =
    bilo.lizenztyp === 'Einzellizenz' ?
      licenseAssignments?.filter((item) => item.inheritfrom! === pickedLicense?._id).length
      :
      bilo.lizenztyp === 'Gruppenlizenz' ? licenseAssignments?.filter((item) => item.inheritfrom! === pickedLicense?._id &&
        item.permissions![0]!.constraints?.find((item) => item.name === 'http://www.w3.org/ns/odrl/2/recipient')
      ).length :

        pickedLicenses?.filter((license: any) => licenseAssignments.find((assignment) => assignment.inheritfrom === license.policyid)).length

  const autoC = useRef(null);


  const [page, setPage] = useState('assignment')
  useEffect(() => {

    fetchAccessToken().then((config: any) => {
      console.log({ config })
      fetchLicenseDefinitions()
      fetchUsers()
      fetchLicenseAssignments()

    })

    const interval = setInterval(() => {
      fetchLicenseAssignments()
    }, 1000 * 5)

    return () => {
      clearInterval(interval)
    }

  }, [])

  useEffect(() => {
    // @ts-ignore
    const ref: any = autoC.current
    const cross = ref?.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
    if (cross) {
      cross.click()
    }



  }, [pickedSelect])

  useEffect(() => {
    if (bilo.lizenztyp === 'Gruppenlizenz') setPickedSelect('group')
  }, [bilo])





  return (
    <>

      <div className={`w-full h-full bg-[#e7ebef] p-[2%] flex flex-col gap-[2%]
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

          <div className='flex gap-1 min-h-0 flex-1
          '>
            <Paper className="basis-[50%]
            grid grid-cols-[repeat(auto-fill,150px)]
            grid-rows-[repeat(auto-fill,150px)]
              overflow-scroll
              
             gap-2">

              <div className='flex justify-center items-center'>
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
              </div>

              {licenseDefinitions.map((el, i) => {
                const ele = el[0]
                const metadata = ele.metadata
                return (
                  <div
                    key={ele.policyid}
                    style={
                      {
                        borderBottom: pickedLicense?.policyid === ele.policyid ? '2px solid #3f51b5' : 'none',

                      }
                    }
                    className="flex justify-center items-center w-[150px] h-[150px]"
                  ><Paper
                    sx={
                      {
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '135px',
                        height: '135px',
                        border: '1px solid #e7ebef',
                        position: 'relative',
                        backgroundImage: `url(${metadata.annotation[1].description.value})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        backgroundSize: 'contain',
                        opacity: pickedLicense?.policyid === ele.policyid ? 1 : 0.5,
                      }
                    }
                    className="hover:opacity-100 transition-all duration-300 cursor-pointer"
                    onClick={() => {

                      if (pickedLicenses &&
                        pickedLicenses[0] === ele
                      ) {
                        setPickedLicenses(null)
                      } else {
                        setPickedLicenses(el)

                      }

                    }}
                  >


                    </Paper></div>

                )

              })}




              <AddLicenseModal open={open} setOpen={setOpen} />

            </Paper>

            <Paper className="basis-[50%] p-[2%] overflow-scroll flex flex-col">

              <h1>{pickedLicense?.metadata.general?.title?.value || 'Title'}</h1>
              <div className='flex-1'>
                <div>Product ID: <b>{pickedLicense?.permissions[0].target}</b></div>

                <div>Anzahl: <b>{bilo.lizenzanzahl}</b></div>

                <div>Lizenztyp: <b>{bilo.lizenztyp}</b></div>

                <div>
                  Aktivierung (von):<b> {bilo.gueltigkeitsbeginn}</b>
                </div>

                <div>
                  Aktivierung (bis):   <b>{bilo.gueltigkeitsende}</b>
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
                <div>
                  ID der Lizendefintion:   <b>{pickedLicense?.policyid}</b>
                </div>
              </div>

              <div className='flex justify-end'>
                <Button variant="outlined"
                  disabled={!pickedLicense}
                  onClick={() => {
                    setPage('notification')

                    const constraints = pickedLicense?.permissions[0].constraints

                    let one = new Date(constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime'
                      && item.operator === 'http://www.w3.org/ns/odrl/2/gteq'
                    ).rightoperand)

                    let two = new Date(constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime'
                      && item.operator === 'http://www.w3.org/ns/odrl/2/lteq'
                    ).rightoperand)


                    setNotification({
                      product_id: bilo.productid,
                      license_type: bilo.lizenztyp,
                      count: bilo.lizenzanzahl,
                      elapsed_time: bilo.gueltigkeitsdauer,
                      start_date: one,
                      end_date: two,
                    })

                  }}

                >Bedarf melden</Button>
              </div>

            </Paper>
          </div>

        </div>

        <div className='flex flex-col gap-2 flex-1 min-h-0'>
          <div className='flex gap-5'>
            <Select defaultValue={'assignment'} className='
              flex-1
              basis-[50%] p-4  border-box text-center flex justify-center items-center max-h-[60px]
              bg-white
              '

              onChange={(e) => {
                setPage(e.target.value)
              }}
            >

              <MenuItem value={'assignment'}

              >
                Zuweisung Verwalten
              </MenuItem>
              <MenuItem value={'launch'}
              >
                Launch Test
              </MenuItem>
              <MenuItem value={'notification'}
              >
                Bedarfsmeldung äußern
              </MenuItem>

            </Select>
            <Paper className="basis-[50%] p-2 flex flex-row max-h-[60px]"

              style={{
                visibility: page !== 'notification' ? 'visible' : 'hidden'
              }}
            >
              {
                (bilo.lizenztyp === 'Einzellizenz' ||
                  bilo.lizenztyp === 'Volumenlizenz'
                ) ?
                  <p className='basis-[33%] text-center'>
                    Derzeit zugewiesen:
                    <b>
                      {currentlyAssignedAmount}
                    </b>

                  </p> :
                  <p className='basis-[33%] text-center'>
                    Maximal aktive:
                    <b >
                      {!isNaN(bilo.lizenzanzahl) && bilo.lizenzanzahl}
                    </b>

                  </p>

              }

              {
                (bilo.lizenztyp === 'Einzellizenz' ||
                  bilo.lizenztyp === 'Volumenlizenz'
                ) ?
                  <p className='basis-[33%] text-center'>
                    Verfügbar:
                    <b>
                      {bilo.lizenzanzahl - currentlyAssignedAmount}
                    </b>
                  </p>
                  :
                  <p className='basis-[33%] text-center'>
                    Derzeit aktive:
                    <b>
                      {(() => {
                        const assignmentsForDefinition = licenseAssignments.filter((assignment) => {
                          const permissions = assignment.permissions![0]!
                          const isGroup = permissions.constraints!.find((item) => item.name === 'http://www.w3.org/ns/odrl/2/recipient')

                          if (assignment.inheritfrom === pickedLicense?.policyid
                            && !isGroup

                          ) {
                            return true
                          }
                        })

                        return assignmentsForDefinition.filter((assignment) => {
                          const permissions = assignment.permissions![0]!
                          const constraints = permissions.constraints!

                          const hatDatum = constraints.find((item) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime' && item.operator === 'http://www.w3.org/ns/odrl/2/lteq')?.rightoperand


                          if (hatDatum) {
                            const gueltigBis = new Date(hatDatum)
                            const pickedLicensePermissions = pickedLicense?.permissions[0]!
                            const underBoundDate = new Date()
                            const upperBoundDate = new Date(pickedLicensePermissions.constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime' && item.operator === 'http://www.w3.org/ns/odrl/2/lteq').rightoperand)

                            if (gueltigBis >= underBoundDate && gueltigBis <= upperBoundDate) {
                              return true
                            }
                          }


                          return false




                        }).length

                      })()}
                    </b>
                  </p>

              }

              <p className='basis-[33%] text-center '
                style={{
                  color: bilo.lizenztyp === 'Gruppenlizenz' ? 'grey' : '',
                  opacity: bilo.lizenztyp === 'Gruppenlizenz' ? '0.5' : '1.0'

                }}
              >
                Activated:
                <b>

                  {/* {bilo.lizenzanzahl && bilo.lizenzanzahl - currentlyAssignedAmount} */}
                </b>
              </p>

            </Paper>
          </div>



          <div className='flex gap-5 min-h-0 flex-1'>
            {page === 'assignment' &&
              <>
                <Paper className="basis-[50%] p-[2%] flex flex-row justify-center items-center overflow-scroll">


                  <Select
                    placeholder='Wählen Sie zunächst eine Lizenz aus ...'
                    disabled={!pickedLicense}
                    onChange={(e) => {
                      setPickedSelect(e.target.value)


                    }}
                    value={pickedSelect}



                  >
                    <MenuItem value={'user'}

                      disabled={bilo.lizenztyp === 'Gruppenlizenz'}
                    >
                      Nutzer
                    </MenuItem>
                    <MenuItem value={'group'}
                    >
                      Gruppe
                    </MenuItem>
                    <MenuItem value={'placeholder'}
                      disabled={true}
                      hidden={true}
                      className='hidden'
                    >
                      Wählen Sie zunächst eine Lizenz  aus ...
                    </MenuItem>

                  </Select>
                  <Autocomplete
                    className='w-[100%] p-2'
                    //@ts-ignore
                    multiple={true}
                    renderInput={(params) => <TextField {...params} label="Search" />}
                    ref={autoC}
                    options={
                      pickedSelect === 'user' ? users.map((user) => {
                        return { label: user.email, value: user.id }

                      }) : groups.map((group) => {
                        return { label: group.displayName, value: group.id }
                      }

                      )
                    }
                    onChange={(e, value) => {
                      if (pickedSelect === 'user') {
                        // if array empty
                        if (value.length === 0) {
                          setSelectedUsers(users)
                        } else {
                          setSelectedUsers(value.map((item: any) => ({ email: item.label, id: item.value })))
                        }
                      } if (pickedSelect === 'group') {
                        // if array empty
                        if (value.length === 0) {
                          setSelectedGroups([])
                        } else {
                          setSelectedGroups(value.map((item: any) => ({ displayName: item.label, id: item.value })))
                        }
                      }
                    }}
                  />









                </Paper>
                <Paper className="basis-[50%] p-[2%] flex flex-col min-h-0 overflow-scroll">
                  {pickedSelect === 'user' &&
                    <LicenseAssignmentUser
                      currentlyAssignedAmount={currentlyAssignedAmount}
                      selectedUsers={selectedUsers}
                      pickedLicenses={pickedLicenses}
                      bilo={bilo}
                    />
                  }

                  {pickedSelect === 'group' &&
                    <LicenseAssignmentGroup
                      currentlyAssignedAmount={currentlyAssignedAmount}
                      selectedGroups={selectedGroups}
                      pickedLicenses={pickedLicenses}
                      bilo={bilo}

                    />
                  }
                </Paper>
              </>

            }
            {
              page === 'launch' &&
              <LaunchPage
                setPickedLicenses={setPickedLicenses}
                pickedLicenses={pickedLicenses}
              />
            }
            {
              page === 'notification' &&
              <NotificationPage
              />
            }

          </div>

        </div>

      </div>

    </>
  )
}

export async function getServerSideProps(context: RequestContext) {
  return requireSession(context).then((props) => {
    // fetch users with axios
    // axios.get('http://localhost:3000/api/users').then((res) => {
    // })
    return props

  })
}



