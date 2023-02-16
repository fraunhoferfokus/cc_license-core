import { Autocomplete, Button, Paper, TextField } from "@mui/material";
import { LicenseDefinitionModel } from "license_manager";
import { useEffect, useRef, useState } from "react";
import { useStore } from "../../zustand/store";


export default function LaunchPage(props: any,) {
    const { licenseDefinitions, fetchLicenseDefinitions, fetchLicenseAssignments, users, fetchUsersAndGroups: fetchUsers, groups,
        licenseAssignments
    } = useStore(state => state)


    const parentPickedLicenses = props.pickedLicenses


    const [user, setUser] = useState<any>(null)
    const userAssignments = licenseAssignments.filter((assignment) => {
        const permissions = assignment.permissions!
        if (permissions![0].assignee === user?.id) {
            return true
        }
    })

    const [pickedUserLicense, setPickedUserLicense] = useState<LicenseDefinitionModel | null>(null)
    const licenseDefinition = licenseDefinitions.flat(10).find((license) => license.policyid === pickedUserLicense?.inheritfrom)
    const ref = useRef(null)



    useEffect(() => {

        const ass = userAssignments.find((assignment) => {
            return parentPickedLicenses?.find((license: LicenseDefinitionModel) => {
                return license.policyid === assignment.inheritfrom
            })
        })


        setPickedUserLicense(ass || null)


    }, [parentPickedLicenses])

    useEffect(() => {


        const foundLicenses = licenseDefinitions.find((licenseArr) => {
            return licenseArr.find((license) => {
                return license.policyid === pickedUserLicense?.inheritfrom
            })
        })

        props.setPickedLicenses(
            foundLicenses
        )

        console.log('heh')

    }, [pickedUserLicense])


    return (<>
        <Paper className="basis-[50%] p-[1%] flex flex-col  overflow-scroll">
            <Autocomplete
                options={users?.map((user: any) => { return { label: user.email, value: user.id } })}
                className='w-[100%]'
                //@ts-ignore
                renderInput={(params) => <TextField {...params} label="Users" variant="outlined" />
                }
                onChange={(e, choices) => {
                    
                    setUser(users?.find((user) => user.id === choices?.value))
                    if(!pickedUserLicense) props.setPickedLicenses(null)
                     setPickedUserLicense(null)
                    
                    //@ts-ignore
                    ref.current?.src = 'about:blank'
                    
                }}
            />
            <Paper className="basis-[50%] p-[2%] 
            grid grid-cols-[repeat(auto-fill,100px)]
            grid-rows-[repeat(auto-fill,100px)]
              overflow-scroll
              flex-1
             gap-2">
                {userAssignments?.map((el: LicenseDefinitionModel, i) => {


                    const ele: any = licenseDefinitions.flat(10).find((license) => license.policyid === el.inheritfrom)
                    const metadata = ele?.metadata
                    return (
                        <div
                            key={el.policyid}
                            style={
                                {
                                    borderBottom: pickedUserLicense?.policyid === el?.policyid ? '2px solid #3f51b5' : 'none',

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
                                    width: '90px',
                                    height: '90px',
                                    border: '1px solid #e7ebef',
                                    position: 'relative',
                                    backgroundImage: `url(${metadata?.annotation[1].description.value})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center center',
                                    backgroundSize: 'contain',
                                    opacity: pickedUserLicense?.policyid === el.policyid ? 1 : 0.5,
                                }
                            }
                            className="hover:opacity-100 transition-all duration-300 cursor-pointer"
                            onClick={() => {

                                if (pickedUserLicense === el) {
                                    setPickedUserLicense(null)
                                } else {
                                    setPickedUserLicense(el)


                                }

                            }}
                        >


                            </Paper></div>

                    )


                })}






            </Paper>

            <form target="iframe" method="POST"
                action={`${process.env.NEXT_PUBLIC_SELF_URL}/launch/mgmt`}
            >
                <Button
                    className="mt-2"
                    variant="contained"
                    disabled={!pickedUserLicense}
                    type="submit"
                    onClick={() => {
                        setTimeout((() => {
                            fetchLicenseAssignments()
                        }), 800)

                    }}
                >
                    Launch
                </Button>
                <input type="hidden" name="userID" value={user?.id} />
                <input type="hidden" name="licenseDefinitionID" value={licenseDefinition?.policyid} />
            </form>

        </Paper>
        <Paper className="basis-[50%] p-[2%] flex flex-row justify-center items-center overflow-scroll">
            <iframe className="w-full h-full" ref={ref}
                name="iframe"

            >

            </iframe>
        </Paper>
    </>)
}