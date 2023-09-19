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