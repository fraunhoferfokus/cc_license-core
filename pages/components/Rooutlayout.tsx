"use client"

import { useEffect, useRef, useState } from 'react';


import { usePathname, useRouter } from 'next/navigation'
import { PolicyWithMetadata } from '../../zustand/licenseDefinitionSlice';
import { useStore } from '../../zustand/store';
import { toBILO } from '../../helper/helper';
import { Policy } from 'license_manager';
import LogoutIcon from '@mui/icons-material/Logout'


const wait = (time: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, time)
    })
}

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }
) {

    const view = usePathname()
    const router = useRouter()
    const {
        fetchDashboard,
        fetchLicenseAssignments,
        users,
        fetchUsersAndGroups,
        fetchLicenseDefinitionsV2,
        fetchMyself,
        myself,
        modalProps,
        setModalProps
    } = useStore(state => state)
    const [pickedLicenses, setPickedLicenses] = useState<PolicyWithMetadata[]>([])
    // const [view, setView] = useState('dashboard')
    // const router = useRouter()
    const [pickedSelect, setPickedSelect] = useState('placeholder')
    // let constraints = pickedLicenses ? (pickedLicenses![0]!.action![0].refinement as Constraint[]) : null

    let pickedLicense: (Policy & { metadata: any }) | null = pickedLicenses ? pickedLicenses[0] as any : null
    let bilo = toBILO(pickedLicense!)
    const autoC = useRef(null);




    useEffect(() => {
        fetchDashboard()

        // fetchLicenseAssignments()

        // const interval = setInterval(() => {
        //   console.log('fetching license assignments')
        //   fetchLicenseAssignments()
        // }, 1000 * 5)
        return () => {
            // clearInterval(interval)
        }
    }, [])

    let me = users.find((user) => {
        return user.id === myself?.pid
    })

    const org = myself?.personenkontexte[0]?.organisation

    return (
        <>
            <div className="flex h-full w-full">
                <div className="flex max-w-[280px] h-full">
                    <div className='mt-[20px] flex-1 flex flex-col w-[280px]'>
                        {/* border bottom with E0E0EB 1px*/}
                        <div className='uppertPart flex-1'>


                            <div className='organization flex justify-center mt-[40px] flex-col items-center'>
                                <div>
                                    <img
                                        src='/sanis.svg'
                                        width={60}
                                    ></img>



                                </div>
                                <label className='mt-[3px] font-bold text-xs'>
                                    {org?.name}
                                </label>
                            </div>

                            <div
                                className='Dashboardbutton flex items-center mt-[40px] ml-[13px] mr-[13px] rounded-[10px] h-[40px] cursor-pointer '

                                style={{ backgroundColor: view === '/dashboard' ? '#F0F0F9' : 'white' }}
                                onClick={() => {
                                    router.push('/dashboard')

                                }
                                    //  setView('dashboard')
                                }
                            >
                                <img
                                    className='ml-[7px]'
                                    src='/dashboardIcon.svg'
                                    width={20}
                                >
                                </img>

                                <label
                                    className='ml-[4px] text-[#585867] font-bold text-[15px] cursor-pointer'

                                >
                                    DASHBOARD
                                </label>

                            </div>

                            <div
                                className='Medienicons mt-[17px] pl-[13px]'
                            >
                                <label className='text-[#404045] font-bold text-[12px] text-opacity-[0.6]'>
                                    MEDIEN
                                </label>
                                <div
                                    className='mt-[20px] flex items-center'
                                    onClick={() => {
                                        // router.push('/dashboard')
                                        // setLicenseModal(true)
                                        // setToastProps('Lizenz importiert', 'success', 10000)
                                    }}

                                >

                                    <div
                                        className='h-[20px] w-[20px] ml-[5px] cursor-pointer'
                                    >
                                        <img
                                            src='/plusicon.svg'

                                            width={20}
                                            height={20}
                                        />
                                    </div>
                                    <label
                                        className='ml-[7px] font-bold text-[15px] text-[#585867] cursor-pointer'
                                        onClick={() => {
                                            setModalProps({
                                                open: true
                                            })
                                        }}
                                    >
                                        LIZENZ IMPORTIEREN
                                    </label>

                                </div>

                                <div
                                    className='mt-[30px] flex items-center cursor-pointer h-[40px] rounded-[10px]'
                                    style={{ backgroundColor: view === 'lizenz-zuweisen' ? '#F0F0F9' : 'white' }}
                                    onClick={() => {
                                        router.push('/lizenz-zuweisen')

                                        // setView('assignment')
                                    }

                                    }
                                >

                                    <img
                                        src='/usericon.svg'
                                        className='ml-[5px]'
                                        width={20}
                                        height={20}
                                    >
                                    </img>
                                    <label
                                        className='ml-[7px] font-bold text-[15px] text-[#585867] cursor-pointer'
                                    >
                                        LIZENZ ZUWEISEN
                                    </label>

                                </div>

                                <div
                                    className='mt-[30px] flex items-center cursor-pointer h-[40px] rounded-[10px]'
                                    style={{ backgroundColor: view === '/medien' ? '#F0F0F9' : 'white' }}
                                    onClick={() => {
                                        router.push('/medien')

                                        // setView('media')
                                    }}
                                >
                                    <img
                                        src='/medienicon.svg'
                                        className='ml-[5px]'
                                        width={20}
                                        height={20}
                                    >
                                    </img>
                                    <label
                                        className='ml-[7px] font-bold text-[15px] text-[#585867] cursor-pointer'
                                    >
                                        MEDIEN
                                    </label>

                                </div>

                                <div
                                    className='mt-[30px] flex items-center cursor-pointer h-[40px] rounded-[10px]'
                                    style={{ backgroundColor: view === '/lizenzen' ? '#F0F0F9' : 'white' }}
                                    onClick={() => {
                                        router.push('/lizenzen')
                                        // setView('licenses')
                                    }}
                                >
                                    <img
                                        src='/lizenzübersichticon.svg'
                                        className='ml-[5px]'
                                        width={20}
                                        height={20}
                                    >
                                    </img>
                                    <label
                                        className='ml-[7px] font-bold text-[15px] text-[#585867] cursor-pointer'
                                    >
                                        LIZENZ ÜBERSICHT
                                    </label>

                                </div>



                            </div>

                            <div className='Rechtliches mt-[70px]'>
                                <label
                                    className='text-[#404045] font-bold text-[12px] pl-[13px] text-opacity-[0.6]'
                                >RECHTLICHES
                                </label>
                                <div
                                    className='ml-[25px] text-xs text-[#585867] mt-[10px]'
                                >
                                    <a href={process.env.NEXT_PUBLIC_IMPRESSUM_URL}>

                                        Impressum
                                    </a>
                                    &nbsp;
                                    |
                                    &nbsp;
                                    <a href={process.env.NEXT_PUBLIC_DATENSCHUTZ_URL}>
                                        Datenschutz
                                    </a>
                                </div>

                            </div>
                        </div>
                        <div className='lowerPart h-[60px] mb-[43px] ml-[17px] flex items-center'>
                            <img
                                src='/userdummyicon.svg'
                                width={57}
                                height={57}
                            >
                            </img>
                            <div className='details ml-[16px]'>
                                <div
                                    className='flex p-[5px]'
                                >

                                    <label
                                        className='font-bold text-[15px] text-[#585867]'
                                    >
                                        {me?.email}
                                    </label>
                                    <LogoutIcon
                                        onClick={async () => {
                                            window.location.href = `${process.env.NEXT_PUBLIC_SELF_URL}/logout`
                                        }}
                                        className='cursor-pointer'
                                    ></LogoutIcon>
                                </div>
                                <br>
                                </br>
                                <label
                                    className='text-[12px] text-[#585867] text-opacity-[0.6]'
                                >
                                    {me?.role}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-grow bg-[#F0F0F9] pl-[26px] pt-[50px] h-full flex flex-col pr-[26px] pb-[26px] relative">
                    {/* <ToastMessage /> */}
                    {children}
                </div>
            </div>
            {/* <AddLicenseModal open={modalProps.open} setOpen={(value: boolean) => {
                    setModalProps({
                        open: value
                    })
                }} /> */}
        </>





    )
}
