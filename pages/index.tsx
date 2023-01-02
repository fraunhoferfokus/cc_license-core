import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { Autocomplete, Box, MenuItem, Paper, Select, TextField } from '@mui/material'
import { RequestContext } from 'next/dist/server/base-server'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { isTemplateExpression } from 'typescript'
import { requireSession } from './auth-mw/auth'
import AddLicenseModal from './components/AddLicenseModal'
import LicenseAssignmentGroup from './components/LicenseAssigmentGroup'
import LicenseAssignmentUser from './components/LicenseAssignmentUser'
import { toBILO } from './helper/helper'
import { useStore } from './zustand/store'


export default dynamic(() => Promise.resolve(Home), {
  ssr: false
})


function Home({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const { licenseDefinitions, fetchLicenseDefinitions, fetchLicenseAssignments, users, fetchUsers, groups,
    licenseAssignments
  } = useStore(state => state)
  const [pickedLicenses, setPickedLicenses] = useState<any>(null)

  const [pickedSelect, setPickedSelect] = useState('placeholder')
  const [selectedUsers, setSelectedUsers] = useState<any>(users)
  const [selectedGroups, setSelectedGroups] = useState<any>(groups)

  let constraints = pickedLicenses ? pickedLicenses[0]?.permissions[0]?.constraints : null

  let pickedLicense = pickedLicenses ? pickedLicenses[0] : null
  let bilo = toBILO(pickedLicense)
  const currentlyAssignedAmount =
    bilo.lizenzTyp === 'Einzellizenz' || bilo.lizenzTyp === 'Gruppenlizenz' ?
      licenseAssignments?.filter((item) => item.inheritfrom! === pickedLicense?._id).length
      :
      pickedLicenses?.filter((license: any) => licenseAssignments.find((assignment) => assignment.inheritfrom === license.policyid)).length

  const autoC = useRef(null);


  useEffect(() => {
    fetchLicenseDefinitions()
    fetchUsers()
    fetchLicenseAssignments()

  }, [])

  useEffect(() => {
    // @ts-ignore
    const ref: any = autoC.current
    const cross = ref.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
    if (cross) {
      cross.click()
    }



  }, [pickedSelect])


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

          <div className='flex gap-5 min-h-0 flex-1
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
                    key={ele.policyid}
                    style={
                      {
                        borderBottom: pickedLicense?.policyid === ele.policyid ? '2px solid #3f51b5' : 'none',

                      }
                    }
                    className="flex justify-center items-center"
                  ><Paper
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
                      setPickedLicenses(el)

                    }}
                  >


                    </Paper></div>

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

        <div className='flex flex-col gap-2 flex-1 min-h-0'>
          <div className='flex gap-5'>
            <Paper className="basis-[50%] p-4  border-box text-center">
              Zuweisung Verwalten
            </Paper>
            <Paper className="basis-[50%] p-2 flex flex-row justify-between">
              <p>
                Currently Assigned:
                <b>
                  {currentlyAssignedAmount}
                </b>
              </p>
              <p>
                Still available: <b>

                  {bilo.lizenzanzahl && bilo.lizenzanzahl - currentlyAssignedAmount}
                </b>
              </p>

              <p>
                Activated:
                <b>

                  {/* {bilo.lizenzanzahl && bilo.lizenzanzahl - currentlyAssignedAmount} */}
                </b>
              </p>

            </Paper>
          </div>

          <div className='flex gap-5 min-h-0 flex-1'>
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

                  disabled={bilo.lizenzTyp === 'Gruppenlizenz'}
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
                  console.log(value.length)
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
                      setSelectedUsers(groups)
                    } else {
                      setSelectedGroups(value.map((item: any) => ({ email: item.label, id: item.value })))

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
                  pickedLicense={pickedLicenses}
                  bilo={bilo}
                />
              }

              {pickedSelect === 'group' &&
                <LicenseAssignmentGroup
                  filteredGroups={selectedGroups}
                />
              }
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
    // fetch users with axios
    // axios.get('http://localhost:3000/api/users').then((res) => {
    // })
    return props

  })
}



