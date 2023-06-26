import { Autocomplete, Box, Button, Divider, Link, MenuItem, MenuList, Paper, Select, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useStore } from '../../zustand/store'
import { PolicyWithMetadata } from "../../zustand/licenseDefinitionSlice";
import { toBILO } from "../../helper/helper";
import { Policy } from "license_manager";
import { ActionObject, Constraint } from "license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import AddLicenseModal from "./AddLicenseModal";
import LicenseAssignmentUser from "./LicenseAssignmentUser";
import LicenseAssignmentGroup from "./LicenseAssigmentGroup";
import NotificationPage from "./NotificationPage";


export default function LizenzZuweisung({setLicenseModal, setView}: {setLicenseModal: any, setView: any}) {

    const {
        licenseDefinitions,
        fetchLicenseAssignments,
        users,
        fetchUsersAndGroups: fetchUsers,
        groups,
        setNotification,
        notification,
        fetchLicenseDefinitionsV2,

        licenseAssignments
    } = useStore(state => state)
    const [pickedLicenses, setPickedLicenses] = useState<PolicyWithMetadata[]>([])

    console.log({ pickedLicenses })

    const [pickedSelect, setPickedSelect] = useState('placeholder')
    const [selectedUsers, setSelectedUsers] = useState<any>(users)
    const [selectedGroups, setSelectedGroups] = useState<any>([])

    // let constraints = pickedLicenses ? (pickedLicenses![0]!.action![0].refinement as Constraint[]) : null

    let pickedLicense: (Policy & { metadata: any }) | null = pickedLicenses ? pickedLicenses[0] as any : null
    let bilo = toBILO(pickedLicense!)
    const currentlyAssignedAmount =
        bilo?.lizenztyp === 'Einzellizenz' ?
            licenseAssignments?.filter((item) => item.inheritFrom! === pickedLicense?._id).length
            :
            bilo?.lizenztyp === 'Gruppenlizenz' ? licenseAssignments?.filter((item) =>
                item.inheritFrom! === pickedLicense?._id
                &&
                ((item.action![0] as ActionObject).refinement as Constraint[]).find((item) => item.rightOperand === 'group')
            ).length :

                pickedLicenses?.filter((license: Policy) => licenseAssignments.find((assignment) => assignment.inheritFrom === license.uid)).length

    const autoC = useRef(null);


    const [page, setPage] = useState('assignment')
    useEffect(() => {
        fetchLicenseDefinitionsV2()
        fetchUsers()
        fetchLicenseAssignments()

        const interval = setInterval(() => {
            fetchLicenseAssignments()
        }, 1000 * 5)

        return () => {
            clearInterval(interval)
        }

    }, [])

    useEffect(() => {
        const ref: any = autoC.current
        const cross = ref?.getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
        if (cross) {
            cross.click()
        }
    }, [pickedSelect])

    useEffect(() => {
        if (bilo?.lizenztyp === 'Gruppenlizenz') setPickedSelect('group')
    }, [bilo])




    return (

        <>
            <div className={`w-full h-full bg-[#e7ebef] p-[2%] flex flex-col gap-[2%]
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
                                    onClick={() => setLicenseModal(true)}
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
                                        key={ele._id}
                                        style={
                                            {
                                                borderBottom: pickedLicense?._id === ele._id ? '2px solid #3f51b5' : 'none',
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
                                                backgroundImage: `url(${metadata?.annotation[1]?.description?.value})`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center center',
                                                backgroundSize: 'contain',
                                                opacity: pickedLicense?._id === ele._id ? 1 : 0.5,
                                            }
                                        }
                                        className="hover:opacity-100 transition-all duration-300 cursor-pointer"
                                        onClick={() => {

                                            if (pickedLicenses &&
                                                pickedLicenses[0] === ele
                                            ) {
                                                setPickedLicenses([])
                                            } else {
                                                setPickedLicenses(el)

                                            }
                                        }}
                                    >
                                        </Paper></div>
                                )
                            })}
                        </Paper>
                        <Paper className="basis-[50%] p-[2%] overflow-scroll flex flex-col">
                            <h1>{pickedLicense?.metadata?.general?.title?.value || 'Title'}</h1>
                            <div className='flex-1'>
                                <div>Product ID: <b>{pickedLicense?.target}</b></div>
                                <div>Anzahl: <b>{bilo?.lizenzanzahl}</b></div>
                                <div>Lizenztyp: <b>{bilo?.lizenztyp}</b></div>
                                <div>
                                    Aktivierung (von):<b> {bilo?.gueltigkeitsbeginn}</b>
                                </div>
                                <div>
                                    Aktivierung (bis):   <b>{bilo?.gueltigkeitsende}</b>
                                </div>
                                <div>
                                    Gültigskeitsdauer: <b>{bilo?.gueltigkeitsdauer}</b>
                                </div>
                                {/* {
                  constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/recipient') &&
                  <div
                  >Sonderlizenz:
                    <b>
                      {" " + bilo.sonderlizenz}
                    </b>
                  </div>
                } */}
                                <div>
                                    ID der Lizendefintion:   <b>{pickedLicense?._id}</b>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <Button variant="outlined"
                                    disabled={!pickedLicense}
                                    onClick={() => {
                                        setPage('notification')
                                        const constraints: Constraint[] = pickedLicense?.action![0]?.refinement || []
                                        let one = new Date(constraints.find((item) => item.uid === 'gueltigkeitsbeginn')!.rightOperand)
                                        let two = new Date(constraints.find((item) => item.uid === 'gueltigkeitsende')!.rightOperand)
                                        setNotification({
                                            product_id: bilo?.productid,
                                            license_type: bilo!.lizenztyp,
                                            count: bilo!.lizenzanzahl,
                                            elapsed_time: bilo!.gueltigkeitsdauer,
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
                            {/* <MenuItem value={'launch'}
              >
                Launch Test
              </MenuItem> */}
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
                                (bilo?.lizenztyp === 'Einzellizenz' ||
                                    bilo?.lizenztyp === 'Volumenlizenz'
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
                                            {!isNaN(bilo?.lizenzanzahl || 0) && bilo?.lizenzanzahl}
                                        </b>

                                    </p>
                            }
                            {
                                (bilo?.lizenztyp === 'Einzellizenz' ||
                                    bilo?.lizenztyp === 'Volumenlizenz'
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
                                                    const constraints = assignment.action![0].refinement
                                                    const isGroup = constraints!.find((item) => item.uid === 'lizenzart'

                                                    )
                                                    if (assignment.inheritFrom === pickedLicense?._id
                                                        && !isGroup) {
                                                        return true
                                                    }
                                                })

                                                return assignmentsForDefinition.filter((assignment) => {
                                                    // const constraints = assignment.action![0].refinement

                                                    // const hatDatum = constraints.find((item) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime' && item.operator === 'http://www.w3.org/ns/odrl/2/lteq')?.rightoperand


                                                    // if (hatDatum) {
                                                    //   const gueltigBis = new Date(hatDatum)
                                                    //   const pickedLicensePermissions = pickedLicense?.permissions[0]!
                                                    //   const underBoundDate = new Date()
                                                    //   const upperBoundDate = new Date(pickedLicensePermissions.constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime' && item.operator === 'http://www.w3.org/ns/odrl/2/lteq').rightoperand)

                                                    //   if (gueltigBis >= underBoundDate && gueltigBis <= upperBoundDate) {
                                                    //     return true
                                                    //   }
                                                    // }
                                                    return false
                                                }).length
                                            })()}
                                        </b>
                                    </p>
                            }
                            <p className='basis-[33%] text-center '
                                style={{
                                    color: bilo?.lizenztyp === 'Gruppenlizenz' ? 'grey' : '',
                                    opacity: bilo?.lizenztyp === 'Gruppenlizenz' ? '0.5' : '1.0'
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
                                            disabled={bilo?.lizenztyp === 'Gruppenlizenz'}
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
                        {/* {
              page === 'launch' &&
              <LaunchPage
                setPickedLicenses={setPickedLicenses}
                pickedLicenses={pickedLicenses}
              />
            } */}
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