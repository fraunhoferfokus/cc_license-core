import { Divider, Link, MenuItem, MenuList, Paper } from "@mui/material"
import { useState } from "react"
import FunctionButton from "./Buttons/FunctionButton"


export default function Dashboardview({ setLicenseModal, setView }: { setLicenseModal: any, setView: any }) {

    const [users, setUsers] = useState([])



    return (
        <>
            <label
                className="text-[#404045] font-bold text-[28px]"
            >Dashboard</label>

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
                    callback={async() => {
                        setLicenseModal(true)
                    }}
                    color="#F0B3AB"
                />

                <FunctionButton
                    infoText={'Medienlizenzen im Lizenzmanager zuweisen'}
                    buttonTitle={'Lizenzen zuweisen'}
                    iconPath={'/usericon.svg'}
                    callback={() => {
                        setView('assignment')
                    }}
                    color="#EAF3F8"
                />

                <FunctionButton
                    infoText={'Lizenzierte Medien im Lizenzmanager anzeigen und durchsuchen'}
                    buttonTitle={'Medien'}
                    iconPath={'/medienicon.svg'}
                    callback={() => {
                        setView('media')
                    }}
                    color="#B7DEB0"
                />

                <FunctionButton
                    infoText={'Medienlizenzen im Lizenzmanager anzeigen, suchen und entziehen'}
                    buttonTitle={'Lizenz Übersicht'}
                    iconPath={'/lizenzübersichticon.svg'}
                    callback={() => {
                        setView('licenses')
                    }}
                    color="#FFEED7"
                />

                {/* <div className="w-[372px]">

                    <div className="flex items-center h-[58px] bg-[#FFEED7] bg-opacity-[50%] rounded-[10px] cursor-pointer">
                        <div className="IconContainer w-[40px] h-[40px] flex items-center justify-center
                         bg-[#FFEED7]
                         ml-[10px]
                            rounded-[10px]
                        ">
                            <img src="/lizenzübersichticon.svg" alt=""
                                width={30}
                                height={30}
                            />
                        </div>
                        <p className="ml-[13px] font-bold text-[24px] "
                        >
                            Lizenz Übersicht
                        </p>
                    </div>

                    <div className="flex items-center justify-center text-center">
                        <img
                            src="/infoicon.svg"
                            width={18}
                            height={18}
                        />
                        <p
                            className="mt-[10px] text-[#404045] text-[15px] ml-[10px]"
                        >
                            Medien Lizenzen im Lizenzmanager anzeigen, suchen und entziehen
                        </p>
                    </div>


                </div> */}

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



        </>
    )
}