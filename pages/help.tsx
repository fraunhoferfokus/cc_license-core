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
        console.log(section)
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
                    options={['Lizenz zuweisen', 'Lizenzen importieren', 'Anzeige von Lizenzen', 'Anzeige von Medien'].filter((item) =>
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
                    onClick={() => selected !== 'import' ? setSelected('import') : setSelected('')}
                    style={{
                        display: 'Lizenzen importieren'.toLowerCase().includes(filter.toLowerCase()) ? '' : 'none'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<Expand />}
                        aria-controls="panel1a-content"
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
                                WES-5gg-20i-jZF
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
                                    console.log('click')
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
                    onClick={() => selected !== 'assignment' ? setSelected('assignment') : setSelected('')}
                    style={{
                        display: 'Lizenz zuweisen'.toLowerCase().includes(filter.toLowerCase()) ? '' : 'none'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<Expand />}
                        aria-controls="panel2a-content"
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
                            Hierbei wird eine Lizenz an einen oder mehrere Nutzer zugewiesen.
                            <br />
                            &ensp;
                            <strong>
                                Volumenlizenz:
                            </strong>
                            &nbsp;
                            Ähnlich wie bei der Einzellizenz wird hier eine Lizenz an einen oder mehrere Nutzer zugewiesen. Der Unterschied besteht darin, dass technisch die zugewiesen Lizenzen den gleichen Lizenzschlüssel aufweisen.
                            <br />





                            <img
                                src="/assignment_view.png"
                                alt="Lizenzen importieren"
                                className="w-[100%]"
                            />
                            <br />

                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion
                    id='licenses'
                    expanded={selected === 'licenses'}
                    onClick={() => setSelectedSection('licenses', 1000, 100)}
                    style={{
                        display: 'Anzeige von Lizenzen'.toLowerCase().includes(filter.toLowerCase()) ? '' : 'none'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<Expand />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography
                            className='text-blue-500'
                        >Anzeige von Lizenzen</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion
                    id='media'
                    expanded={selected === 'media'}
                    onClick={() => setSelectedSection('media')}
                    style={{
                        display: 'Anzeige von Lizenzen'.toLowerCase().includes(filter.toLowerCase()) ? '' : 'none'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<Expand />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography
                            className='text-blue-500'
                        >Anzeige von Medien</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

            </div>
        </div>
    </>


}