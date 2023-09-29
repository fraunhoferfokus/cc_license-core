import axios from "axios"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { Button } from "@mui/material"

export default function Imprint() {

    const impressum_url = process.env.NEXT_PUBLIC_IMPRESSUM_URL

    return <>
        {
            impressum_url === '/imprint' && <div
                className="p-10 flex items-center 
                bg-[#edf1f4]
                flex-col
                gap-[16px]
            "
            >
                <div

                    className="min-w-[992px] bg-white p-[16px]"
                >
                    <h2
                        className="text-[#2d7592] "
                    >
                        Imprint
                    </h2>

                    <p>
                        The Fraunhofer Institute for Open Communication Systems FOKUS

                    </p>

                    <p>
                        Kaiserin-Augusta-Allee 31
                        <br />
                        10589 Berlin
                        <br />
                        Phone +49 30 3463-7000
                        <br />
                        info@fokus.fraunhofer.de
                    </p>

                    <p>
                        is a constituent entity of the Fraunhofer Gesellschaft, and as such has no separate legal status.
                    </p>

                    <p>
                        Fraunhofer-Gesellschaft
                        <br />
                        zur Förderung der angewandten Forschung e.V.
                        <br />
                        Hansastraße 27 c
                        <br />
                        80686 München
                        <br />
                        www.fraunhofer.de
                    </p>


                </div>


                <div

                    className="min-w-[992px] bg-white p-[16px] w-[970px]"
                >
                    <p><strong>VAT Identification Number in accordance with §27 a </strong><strong>VAT Tax Act:</strong><br />DE 129515865</p>

                    <p><strong>Court of jurisdiction</strong><br />Amtsgericht  München (district court)<br />Registered nonprofit association <br />Registration no. VR 4461</p>

                    <p><strong>Responsible editor:</strong><br /><a href="mailto:webmaster@fokus.fraunhofer.de">webmaster</a></p>



                    <p><b>Executive Board</b></p>

                    <p><b>Prof. Dr.-Ing. Holger Hanselka</b> | President<span
                        className="bg-[transparent]"
                    ><br /></span><span
                        className="bg-[transparent]"
                    ><b>Prof. Dr. Axel Müller-Groeling</b> | Member&nbsp;</span>of the executive board<span ><br /></span><span
                        className="bg-[transparent]"
                    ><b>Ass. jur. Elisabeth Ewen</b> | Member&nbsp;</span>of the executive board<span
                        className="bg-[transparent]"
                    ><br /></span><span
                        className="bg-[transparent]"
                    ><b>Dr. Sandra Krey</b> | Member&nbsp;</span>of the executive board</p>

                </div>


                <div
                    className="max-w-[992px] bg-white p-[16px]"

                >

                    <p><strong><strong>Usage Rights<br /></strong></strong>Copyright © by<br />Fraunhofer-Gesellschaft<strong><strong></strong></strong></p>
                    <p>All rights reserved. </p>
                    <p>All copyright for this Web site are owned in full by the Fraunhofer-Gesellschaft. </p>
                    <p>Permission  is granted to download or print material published on this site for  personal use only. Its use for any other purpose, and in particular its  commercial use or distribution, are strictly forbidden in the absence of  prior written approval. Please address your requests for approval to:</p>
                    <p>Fraunhofer Institute for Open Communication Systems FOKUS<br />Kaiserin-Augusta-Allee 31<br />10589 Berlin<br />Phone +49 30 3463-7000 </p>
                    <p>Notwithstanding  this requirement, material may be downloaded or printed for use in  connection with press reports on the activities of the  Fraunhofer-Gesellschaft and its constituent institutes, on condition  that the following terms are complied with:</p>
                    <p>No alterations may be  made to pictorial content, with the exception of framing modifications  to emphasize the central motif. The source must be quoted and two free  reference copies must be sent to the above-mentioned address. Such usage  is free of charge.</p>


                </div>



                <div
                    className="max-w-[992px] bg-white p-[16px]"

                >
                    <a ></a>
                    <div><p><strong><strong>Disclaimer<br /></strong></strong>We  cannot assume any liability for the content of external pages. Solely  the operators of those linked pages are responsible for their content.<strong><strong></strong></strong></p>
                        <p>We  make every reasonable effort to ensure that the content of this Web  site is kept up to date, and that it is accurate and complete.  Nevertheless, the possibility of errors cannot be entirely ruled out. We  do not give any warranty in respect of the timeliness, accuracy or  completeness of material published on this Web site, and disclaim all  liability for (material or non-material) loss or damage incurred by  third parties arising from the use of content obtained from the Web  site.</p>
                        <p>Registered trademarks and proprietary names, and copyrighted  text and images, are not generally indicated as such on our Web pages.  But the absence of such indications in no way implies that these names,  images or text belong to the public domain in the context of trademark  or copyright law.</p></div>
                </div>
            </div>
        }

    </>


}