import { Autocomplete, Button, Paper, TextField } from "@mui/material";
import { LicenseDefinitionModel } from "license_manager";
import { useRef, useState } from "react";
import { useStore } from "../zustand/store";


export default function LaunchPage(props: any) {
    const { licenseDefinitions, fetchLicenseDefinitions, fetchLicenseAssignments, users, fetchUsers, groups,
        licenseAssignments
    } = useStore(state => state)



    const [user, setUser] = useState<any>(null)
    const userAssignments = licenseAssignments.filter((assignment) => {
        const permissions = assignment.permissions!
        if (permissions![0].assignee === user?.id) {
            return true
        }
    })


    const [pickedLicense, setPickedLicense] = useState<LicenseDefinitionModel | null>(null)
    const licenseDefinition = licenseDefinitions.flat(10).find((license) => license.policyid === pickedLicense?.inheritfrom)
    const ref = useRef(null)

    return (<>
        <Paper className="basis-[50%] p-[2%] flex flex-col  overflow-scroll">
            <Autocomplete
                options={users?.map((user: any) => { return { label: user.email, value: user.id } })}
                className='w-[100%] p-2'
                //@ts-ignore
                renderInput={(params) => <TextField {...params} label="Users" variant="outlined" />
                }
                onChange={(e, choices) => {
                    setUser(users?.find((user) => user.id === choices?.value))
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
                                    borderBottom: pickedLicense?.policyid === el?.policyid ? '2px solid #3f51b5' : 'none',

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
                                    backgroundImage: `url(${metadata.annotation[1].description.value})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center center',
                                    backgroundSize: 'contain',
                                    opacity: pickedLicense?.policyid === el.policyid ? 1 : 0.5,
                                }
                            }
                            className="hover:opacity-100 transition-all duration-300 cursor-pointer"
                            onClick={() => {

                                if (pickedLicense === el) {
                                    setPickedLicense(null)
                                } else {
                                    setPickedLicense(el)
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
                    disabled={!pickedLicense}
                    type="submit"
                    onClick={() => {
                        setTimeout((()=>{
                            fetchLicenseAssignments()
                        }),800)
                        
                    }}
                >
                    Launch
                </Button>
                <input type="hidden" name="userID" value={user?.id} />
                <input type="hidden" name="licenseDefinitionID" value={licenseDefinition?.policyid} />
            </form>

        </Paper>
        <Paper className="basis-[50%] p-[5%] flex flex-row justify-center items-center overflow-scroll">
            <iframe className="w-full h-full" ref={ref}
                name="iframe"

            >

            </iframe>
        </Paper>
    </>)
}