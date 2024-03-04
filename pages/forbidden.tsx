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
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';


export default function Forbbidden() {
    const router = useRouter()

    return <>
        <div
            className="p-10
                flex items-center 
                bg-[#edf1f4]
                flex-col
                gap-[16px]
                min-h-full
                justify-center
                flex-2
            "
        >
            <div

                className="min-w-[992px] bg-white p-[16px] flex justify center items-center gap-[16px]"
            >
                <div
                    className="w-[300px] h-[300px] flex justify-center items-center"
                >
                    <GppMaybeIcon
                        className='text-8xl'
                        sx={{
                            fontSize: '14rem'
                        }}
                        color='error'


                    ></GppMaybeIcon>

                </div>
                <div>
                    <h2>
                        Die Administrationsoberfläche kann lediglich von Administratoren einer Schule aufgerufen werden. Bitte loggen Sie sich mit dem Personenkontext eines Adminstrators einer Schule ein.

                    </h2>
                    <div
                        className='flex justify-center'
                    >
                        <Button
                            variant='contained'
                            className='w-[300px]'
                            onClick={() => {
                                router.push('/signIn')
                            }
                            }
                        >
                            Zurück zum Login
                        </Button>
                    </div>
                </div>


            </div>
            
        </div>
    </>


}