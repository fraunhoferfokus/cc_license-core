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
import { hexToRGBA } from "../../helper/hextoRGBA"


export default function FunctionButton({ infoText, buttonTitle, iconPath: iconPath, callback, color, clicked, disableInfo }: {
    infoText: string, buttonTitle: string, iconPath: string, color: string, clicked?: boolean, disableInfo?: boolean,
    callback: (() => Promise<void>) | (() => void)
}) {

    // if color is hex
    if (color[0] === '#') {
        if (!clicked) { color = hexToRGBA(color, 0.5) } else {
            color = hexToRGBA(color, 1)
        }
    }

    return (
        <>
            <div className="w-[372px] mr-[23px] h-[118px]">

                <div className={`flex items-center h-[58px] bg-opacity-[50%] rounded-[10px] cursor-pointer`}
                    style={{
                        backgroundColor: color,


                    }}
                    onClick={() => callback()}
                >
                    <div className={`IconContainer w-[40px] h-[40px] flex items-center justify-center ml-[10px] rounded-[10px]`}
                        style={{
                            backgroundColor: color
                        }}

                    >
                        <img src={iconPath} alt=""
                            width={30}
                            height={30}
                        />
                    </div>
                    <p className="ml-[13px] font-bold text-[24px] "
                    >
                        {buttonTitle}
                    </p>
                </div>

                {!disableInfo &&
                    <div className="flex items-center justify text-center">
                        <img
                            src={'/infoicon.svg'}
                            width={18}
                            height={18}
                        />


                        <p
                            className="mt-[10px] text-[#404045] text-[15px] ml-[10px]"
                        >
                            {infoText}

                        </p>
                    </div>
                }
            </div>
        </>
    )
}