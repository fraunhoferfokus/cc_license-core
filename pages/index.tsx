import LogoutIcon from '@mui/icons-material/Logout'
import axios from 'axios'
import { Policy } from 'license_manager'
import { ActionObject, Constraint } from 'license_manager/dist/models/LicenseDefinition/LicenseDefinitionModel.2_2'
import { RequestContext } from 'next/dist/server/base-server'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { requireSession } from '../auth-mw/auth'
import { toBILO } from '../helper/helper'
import { PolicyWithMetadata } from '../zustand/licenseDefinitionSlice'
import { useStore } from '../zustand/store'
import AddLicenseModal from './components/AddLicenseModal'
import Dashboardview from './components/Dashboardview'
import LizenzZuweisungV2 from './components/LizenzZuweisungV2'
import Licenses from './components/LizenzÜbersicht'
import Medien from './components/Medien'
import { ToastMessage } from './components/toastMessage'


export default dynamic(() => Promise.resolve(Home), {
  ssr: false
})


function Home({ user }: { user: any }) {
  const [open, setLicenseModal] = useState(false);
  const {
    fetchLicenseAssignments,
    users,
    fetchUsersAndGroups: fetchUsers,
    fetchLicenseDefinitionsV2,
    fetchMyself,
    myself,
  } = useStore(state => state)
  const [pickedLicenses, setPickedLicenses] = useState<PolicyWithMetadata[]>([])
  const [view, setView] = useState('dashboard')
  const router = useRouter()
  const [pickedSelect, setPickedSelect] = useState('placeholder')
  // let constraints = pickedLicenses ? (pickedLicenses![0]!.action![0].refinement as Constraint[]) : null

  let pickedLicense: (Policy & { metadata: any }) | null = pickedLicenses ? pickedLicenses[0] as any : null
  let bilo = toBILO(pickedLicense!)
  const autoC = useRef(null);




  useEffect(() => {
    fetchLicenseDefinitionsV2()
    fetchUsers()
    fetchLicenseAssignments()
    fetchMyself()
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

                style={{ backgroundColor: view === 'dashboard' ? '#F0F0F9' : 'white' }}
                onClick={() => setView('dashboard')}
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
                    setLicenseModal(true)
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
                  // onClick={() => setLicenseModal(true)}
                  >
                    LIZENZ IMPORTIEREN
                  </label>

                </div>

                <div
                  className='mt-[30px] flex items-center cursor-pointer h-[40px] rounded-[10px]'
                  style={{ backgroundColor: view === 'assignment' ? '#F0F0F9' : 'white' }}
                  onClick={() => setView('assignment')}
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
                  style={{ backgroundColor: view === 'media' ? '#F0F0F9' : 'white' }}
                  onClick={() => setView('media')}
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
                  style={{ backgroundColor: view === 'licenses' ? '#F0F0F9' : 'white' }}
                  onClick={() => setView('licenses')}
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
                    onClick={async() => {
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
          <ToastMessage />

          {
            view === 'dashboard' &&
            <Dashboardview
              setLicenseModal={setLicenseModal}
              setView={setView}
            />
          }
          {
            view === 'assignment' &&
            <LizenzZuweisungV2
              setLicenseModal={setLicenseModal}
              setView={setView}
            />
          }

          {
            view === 'media' &&
            <Medien
              setLicenseModal={setLicenseModal}
            ></Medien>
          }

          {
            view === 'licenses' && <Licenses
              setView={setView}

            ></Licenses>
          }

        </div>
      </div>

      <AddLicenseModal open={open} setOpen={setLicenseModal} />


    </>

    // </>
  )
}

export async function getServerSideProps(context: RequestContext) {
  return requireSession(context).then((props) => {
    return props
  })
}



