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
import { Expand } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Link, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

export default function Help() {
    const [selected, setSelected] = useState('')
    const [filter, setFilter] = useState('')
    const ref: any = React.useRef(null)


    const setSelectedSection = async (argument: string, delay: number = 500, waitBeforeClose: number = 100) => {
        await new Promise((resolve, reject) => setTimeout(() => {
            resolve(true)
        }, waitBeforeClose))
        const element = ref.current
        const section = element.querySelector('#' + argument)
        selected !== argument ? setSelected(argument) : setSelected('')
        await new Promise((resolve, reject) => setTimeout(() => {
            resolve(true)
        }, delay))

        section.scrollIntoView({
            behavior: 'smooth'
        })
    }

    return <>
        <div
            className="p-10 flex items-center 
                bg-[#edf1f4]
                flex-col
                gap-[16px]
                min-h-[100%]
            "
        >
            <div

                className="w-[992px] max-w-[992px] bg-white p-[16px] "
            >
                <h2
                    className="text-[#2d7592] "
                >
                    Benutzerhandbuch
                </h2>
                <Typography>
                    In diesem Handbuch wird die Benutzung der Lizenzmanagementkomponente beschrieben. Diese Komponente dient als Bindeglied zwischen verschiedenen Komponenten in der Lizenzinfrastruktur. Sie ist für das  Importieren von bestehenden Lizenzdefinitionen, darstellen von externen Nutzern bzw. Gruppen, Anzeigen des bestehenden Lizenzangebots zuständig,  um daraufhin eine Lizenzzuweisung ausgehend von den bereits importierten Lizenzangebots und den abgefragten Nutzern, vorzunehmen  . Die Use Cases der Komponente können sich in drei wesentliche Bereiche zusammenfassen:
                    <br />

                    &ensp;
                    <Link
                        onClick={() => setSelectedSection('import')}
                    >

                        - Import von Lizenzinformationen
                    </Link>
                    <br />
                    &ensp;
                    <Link
                        onClick={() => setSelectedSection('assignment')}
                    >
                        - Zuweisung von Lizenzen an Nutzer
                    </Link>
                    <br />
                    &ensp;
                    <Link
                        onClick={() => setSelectedSection('licenses')}
                    >
                        - Anzeigen von Lizenzen
                    </Link>
                    <br />
                    &ensp;
                    <Link
                        onClick={() => setSelectedSection('media')}
                    >
                        - Anzeigen von Medien
                    </Link>
                </Typography>
                <br />


                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={['Lizenz zuweisen', 'Lizenzen importieren', 'Anzeige von Medien','Anzeige von Lizenzen', ].filter((item) =>
                        item.toLowerCase().includes(filter.toLowerCase())
                    )}
                    renderInput={(params) => <TextField {...params} label="Filter"
                    />}
                    onInputChange={(event, value) => {
                        setFilter(value)
                    }}

                />



            </div>

            <div
                className="w-[992px] max-w-[992px] flex flex-col gap-[6px]"

                ref={ref}
                style={{
                    display: ''
                }}
            >
                <Accordion
                    id='import'
                    expanded={selected === 'import'}
                    style={{
                        display: 'Lizenzen importieren'.toLowerCase().includes(filter.toLowerCase()) ? '' : 'none'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<Expand />}
                        aria-controls="panel1a-content"
                        onClick={() => setSelectedSection('import', 500, 100)}

                        id="panel1a-header"
                    >
                        <Typography
                            className='text-blue-500'
                        >
                            Lizenzen importieren
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography

                        >
                            <strong>
                                1)
                            </strong>
                            &nbsp;
                            Um Lizenzen importieren zu können ist es zunächst nötig entweder in der Seitennavigation auf den Reiter "LIZENZ IMPORTIEREN" zu klicken oder in der Dashboard-Ansicht unter den Funktionen auf den Button "Lizenzen importieren" zu klicken, wie im folgenden Bild veranschaulicht wird.

                        </Typography>
                        <br />
                        <img
                            src="/import.png"
                            alt="Lizenzen importieren"
                            className="w-[100%]"
                        />
                        <br />
                        <br />
                        <Typography>
                            <strong>
                                2)
                            </strong>
                            &nbsp;
                            Nach dem Klicken des Buttons öffnet sich ein Overlay, in dem man in ein Eingabefeld eine Abholnummer eingeben kann, um ein Lizenzpaket abzurufen, das mehrere Lizenzen beinhaltet. Für den Rahmen der
                            Erprobung wird das folgende Lizenzpaket zur Verfügung gestellt:
                            &nbsp;
                            <strong>
                                WES-5gg-2Oi-jZF
                            </strong>
                            <br />

                            Anschließend muss man auf den Button "Lizenz importieren" klicken, wie im folgenden Bild dargestellt.

                        </Typography>
                        <br />
                        <img
                            src="/import_overlay.png"
                            alt="Lizenzen importieren"
                            className="w-[100%]"
                        />
                        <br />
                        <br />
                        <Typography>
                            <strong>
                                3)
                            </strong>
                            &nbsp;
                            Bei erfolgreicher Importierung werden die Medien, die aus den importierten Lizenzen hervorgehen, angezeigt.
                        </Typography>
                        <br />
                        <img
                            src="/import_success.png"
                            alt="Lizenzen importieren"
                            className="w-[100%]"
                        />
                        <br />
                        <br />

                        <Typography>
                            <strong>
                                4)
                            </strong>
                            &nbsp;
                            Die importierten Lizenzen können in tabelarischer Ansicht auch in der Funktion

                            &nbsp;
                            <Link
                                onClick={() => {
                                    setSelectedSection('licenses', 500, 100)
                                }}
                            >
                                Anzeige von Lizenzen
                            </Link>
                            &nbsp;

                            eingesehen werden.


                        </Typography>




                    </AccordionDetails>
                </Accordion>

                <Accordion
                    id='assignment'
                    expanded={selected === 'assignment'}
                    style={{
                        display: 'Lizenz zuweisen'.toLowerCase().includes(filter.toLowerCase()) ? '' : 'none'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<Expand />}
                        aria-controls="panel2a-content"
                        onClick={() => setSelectedSection('assignment', 500, 100)}
                        id="panel2a-header"
                    >
                        <Typography
                            className='text-blue-500'
                        >Lizenzen zuweisen</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography

                        >
                            <strong>
                                1)
                            </strong>
                            &nbsp;
                            Eine Lizenzzuweisung erfordert, dass zunächst Lizenzen importiert durch den Schritt
                            &nbsp;
                            <Link
                                onClick={() => setSelectedSection('import', 500, 100)}
                            >
                                Lizenzen importieren
                            </Link>
                            &nbsp;
                            importiert worden sind. Anschließend kann man durch die Dashboard Ansicht auf den Button "Lizenzen zuweisen" klicken, wie im folgenden Bild dargestellt.

                            <br />
                            <img
                                src="/assignment.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />

                            <strong>
                                2)
                            </strong>
                            &nbsp;
                            Anschließend ist die Lizenzzuweisungsansicht verfügbar, wie im unteren Bild zu sehen.
                            Es sind drei Arten von Lizenzzuweisungen möglich:
                            <br />
                            &ensp;
                            <strong>
                                Einzellizenz:
                            </strong>
                            &nbsp;
                            Hierbei werden eine oder mehrere Einzellizenzen an einen oder mehrere Nutzer zugewiesen.
                            <br />
                            &ensp;
                            <strong>
                                Volumenlizenz:
                            </strong>
                            &nbsp;
                            Ähnlich wie bei der Einzellizenz werden hier eine oder mehrere Volumenlizenzen an einen oder mehrere Nutzer zugewiesen. Der Unterschied besteht darin, dass technisch die zugewiesen Lizenzen den gleichen Lizenzschlüssel aufweisen.
                            <br />

                            &ensp;
                            <strong>
                                Gruppenlizenz:
                            </strong>
                            &nbsp;
                            Hierbei werden eine oder mehrere Gruppenlizenzen an eine Gruppe oder mehrere Gruppen zugewiesen.
                            <br />
                            In der Erprobung werden lediglich Einzellizenzen verwendet, weshalb Einzellizenz standardmäßig ausgewählt ist.

                            <img
                                src="/assignment_view.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />

                            <strong>
                                3) Filter-, Bätter- und Sortierfunktionalität
                            </strong>
                            <br></br>
                            &nbsp;
                            In der Lizenzzuweisungsansicht ist es möglich die Schüler einer Organisation nach Namen oder der Gruppenzughörigkeit zu filtern. Die Filterfunktionalität ist in den zwei Textfeldern dargestellt. Es kann über die Pfeiltasten am unteren Rand der Tabelle geblättert werden und die Anzahl der Dokumente beschränkt werden, die in der Tabellenansicht pro Seite angezeigt werden sollen. Die Sortierfunktionalität ist über die Pfeiltasten in der Tabellenüberschrift dargestellt. Diese Funktionalitäten werden in den folgenden Bild dargestellt.
                            <br />
                            <img
                                src="/assignment_filter.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />



                            <strong>
                                4)
                            </strong>
                            &nbsp;
                            Im nächsten Schritt kann man über die Checkboxen in der Tabelle einen oder mehrere Nutzer auswählen, für die man eine Lizenzzuweisung vornehmen möchte. Der Button unten rechts sollte nun blaulich sein, um darzustellen, dass man kann den nächsten Schritt durchführen kann. Dieser muss geklickt werden:
                            <br />
                            <img
                                src="/assignment_pick_user.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />


                            <strong>
                                5)
                            </strong>
                            &nbsp;
                            Im letzen Schritt wird angezeigt für welche(n) Nutzer und Medium die Zuweisung erfolgt und es kann eine Zuweisung vorgenommen werden:
                            <br />
                            <img
                                src="/assignment_pick_assign.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />
                        </Typography>
                    </AccordionDetails>
                </Accordion>


                <Accordion
                    id='media'
                    expanded={selected === 'media'}
                    style={{
                        display: 'Anzeige von Lizenzen'.toLowerCase().includes(filter.toLowerCase()) ? '' : 'none'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<Expand />}
                        aria-controls="panel2a-content"
                        onClick={() => setSelectedSection('media')}
                        id="panel2a-header"
                    >
                        <Typography
                            className='text-blue-500'
                        >Anzeige von Medien</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>

                            <strong>
                                1)
                            </strong>
                            &nbsp;
                            Im ersten Schritt muss entweder über die Dashboardansicht auf das Icon "Medien" geklickt werden oder in der Seitennavigation auf den Reiter "Medien" geklickt werden, wie im folgenden Bild dargestellt:
                            <br />
                            <img
                                src="/media_view.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />


                            <strong>
                                2)
                            </strong>
                            &nbsp;
                            Anschließend gelangt man zu einer Tabellenansicht, wo man auf den entsprechenden Eintrag klicken kann:
                            <br />
                            <img
                                src="/media.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />


                            <strong>
                                3)
                            </strong>
                            &nbsp;
                            Das Klicken führt dann zu einer Ansicht wo das Medium mit den entsprechenden Metadaten angezeigt wird. Die zugehörige Lizenz kann anschließend ausgewählt werden:
                            <br />
                            <img
                                src="/media_book.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />

                            <strong>
                                4)
                            </strong>
                            &nbsp;
                            Nach der Auswahl der entsprechenden Lizenz wird angezeigt welche Nutzer diese Lizenz zugewiesen sind. Diese Lizenzen kann auch wieder entzogen werden, wie im folgenden Beispiel dargestellt:
                            <br />
                            <img
                                src="/media_book_last.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    id='licenses'
                    expanded={selected === 'licenses'}
                    style={{
                        display: 'Anzeige von Lizenzen'.toLowerCase().includes(filter.toLowerCase()) ? '' : 'none'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<Expand />}
                        aria-controls="panel2a-content"
                        onClick={() => setSelectedSection('licenses', 1000, 100)}
                        id="panel2a-header"
                    >
                        <Typography
                            className='text-blue-500'
                        >Anzeige von Lizenzen</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <strong>
                                1)
                            </strong>
                            &nbsp;
                            Im ersten Schritt muss entweder über die Dashboardansicht auf das Icon "Lizenz Übersicht" geklickt werden oder in der Seitennavigation auf den Reiter "Lizenz Übersicht" geklickt werden, wie im folgenden Bild dargestellt:
                            <br />
                            <img
                                src="/licenses_view.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />


                            <strong>
                                2)
                            </strong>
                            &nbsp;
                            Anschließend gelangt man zu einer Tabellenansicht, wo man eine entsprechende Lizenz auswählen kann. Man ist in der Lage durch die Textfelder die entsprechende Lizenz zu filter oder durch die Pfeiltasten am unteren Rand der Tabelle zu blättern. Die Sortierfunktionalität ist über die Pfeiltasten in der Tabellenüberschrift dargestellt. Diese Funktionalitäten werden in den folgenden Bild dargestellt:
                            <br />
                            <img
                                src="/licenses_first.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />

                            <strong>
                                3)
                            </strong>
                            &nbsp;
                            Das Klicken führt dann zu einer Ansicht wo das Medium mit den entsprechenden Metadaten angezeigt wird. Die zugehörige Lizenz kann anschließend ausgewählt werden:
                            <br />
                            <img
                                src="/media_book.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />

                            <strong>
                                4)
                            </strong>
                            &nbsp;
                            Nach der Auswahl der entsprechenden Lizenz wird angezeigt welche Nutzer diese Lizenz zugewiesen sind. Diese Lizenzen kann auch wieder entzogen werden, wie im folgenden Beispiel dargestellt:
                            <br />
                            <img
                                src="/media_book_last.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />
                            <br />

                        </Typography>
                    </AccordionDetails>
                </Accordion>

            </div>
        </div>
    </>


}