/* -----------------------------------------------------------------------------
 *  Copyright (c) 2023, Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, version 3.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program. If not, see <https://www.gnu.org/licenses/>.   
 *
 *  No Patent Rights, Trademark Rights and/or other Intellectual Property 
 *  Rights other than the rights under this license are granted. 
 *  All other rights reserved.
 *
 *  For any other rights, a separate agreement needs to be closed.
 * 
 *  For more information please contact:   
 *  Fraunhofer FOKUS
 *  Kaiserin-Augusta-Allee 31
 *  10589 Berlin, Germany 
 *  https://www.fokus.fraunhofer.de/go/fame
 *  famecontact@fokus.fraunhofer.de
 * -----------------------------------------------------------------------------
 */
import { useRouter } from 'next/navigation'
import { useStore } from '../zustand/store'
import FunctionButton from './components/FunctionButton'
import RootLayout from './components/Rooutlayout'

export default function Dashboardview() {
    const router = useRouter()
    const [myself, setModalProps] = useStore(state => [state.myself, state.setModalProps])
    const org = myself?.personenkontexte[0]?.organisation



    return (
        < RootLayout>
            <div
                className="flex justify-between"
            >
                <label
                    className="text-[#404045] font-bold text-[28px]"
                >
                    Dashboard
                </label>
                <div>
                    <div
                        className="h-[35px] bg-[rgba(0,0,0,0.06)] h-[41px] flex items-center 
                        justify-center text-[16px] mb-[3px]"
                    >
                        <label

                        >
                            {
                                org?.name
                            }
                        </label>
                    </div>
                    <div
                        className="text-[rgba(0,0,0,0.6)] text-[12px]"
                    >
                        Die Schule, für die eine Zuweisung erfolgt
                    </div>
                </div>
            </div>

            <p
                className="mt-[67px] font-bold text-[#404045] text-[20px]"
            >
                1. Wählen Sie eine Funktion:
            </p>

            <div className="Funktionen flex items-center flex-wrap">

                <FunctionButton
                    infoText={'Medienlizenzen in den Lizenzmanager importieren'}
                    buttonTitle={'Lizenzen importieren'}
                    iconPath={'/plusicon.svg'}
                    callback={async () => {
                        setModalProps({ open: true })

                    }}
                    color="#F0B3AB"
                />

                <FunctionButton
                    infoText={'Medienlizenzen im Lizenzmanager zuweisen'}
                    buttonTitle={'Lizenzen zuweisen'}
                    iconPath={'/usericon.svg'}
                    callback={() => {
                        router.push('/lizenz-zuweisen')
                    }}
                    color="#EAF3F8"
                />

                <FunctionButton
                    infoText={'Lizenzierte Medien im Lizenzmanager anzeigen und durchsuchen'}
                    buttonTitle={'Medien'}
                    iconPath={'/medienicon.svg'}
                    callback={() => {
                        router.push('/medien')
                    }}
                    color="#B7DEB0"
                />

                <FunctionButton
                    infoText={'Medienlizenzen im Lizenzmanager anzeigen, suchen und entziehen'}
                    buttonTitle={'Lizenz Übersicht'}
                    iconPath={'/lizenzübersichticon.svg'}
                    callback={() => {
                        router.push('/lizenzen')
                    }}
                    color="#FFEED7"
                />


            </div>


            <p
                className="mt-[90px] font-bold text-[#404045] text-[20px]"
            >
                2. Helpdesk: Anleitung & Hilfe
            </p>

            <div className="Helps mt-[28px] flex ">

                <div className="flex flex-col justify-center items-center mr-[50px] ">
                    <div
                        className="w-[70px] h-[70px] bg-[#48AAF0] bg-opacity-[40%] rounded-[10px] flex justify-center items-center cursor-pointer"
                        onClick={() => {
                            router.push('/help')
                            // router.push('/help')
                        }}
                    >
                        <img
                            src="/questionicon.svg"
                            height={50}
                            width={50}

                        >
                        </img>
                    </div>
                    <p
                        className="text-[15px] text-[#585867]"
                    >
                        Anleitung ansehen
                    </p>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <div
                        className="w-[70px] h-[70px] bg-[#48AAF0] bg-opacity-[40%] rounded-[10px] flex justify-center items-center cursor-pointer"
                    >
                        <img
                            src="/chaticon.svg"
                            height={50}
                            width={50}
                        >
                        </img>
                    </div>
                    <p
                        className="text-[15px] text-[#585867]"
                    >
                        FAQ                    </p>
                </div>

            </div>



        </RootLayout>
    )
}