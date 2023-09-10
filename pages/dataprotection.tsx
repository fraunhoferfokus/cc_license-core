import axios from "axios"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { Button } from "@mui/material"

export default function Dataprotection() {


    return <>
        <div
            className="p-2
            bg-[#edf1f4]
            flex-col
            flex
            justify-center
            items-center
            "
        >
            <div
                className="max-w-[992px] bg-white p-[16px]"

            >
                <span><h2>Datenschutzinformation</h2>
                    <h2>- [Fraunhofer FOKUS] -</h2>

                    <p>
                        Bitte beachten Sie, dass es sich bei dieser Webseite um eine Entwicklung in dem noch laufenden Forschungsprojekt mit dem Titel „Control &amp; Connect“ handelt. Da Inhalte und Komponenten von verschiedenen Partner-Institutionen des Forschungsprojektes betrieben werden, können spezielle datenschutzrelevante Ausführungen einzelner Komponenten und Inhalte möglicherweise abweichen. Sofern dies der Fall ist, gibt es einen gesonderten Datenschutzhinweis für die jeweiligen Komponenten und Inhalte.    </p>

                    <p>
                        Die Mittel für das Projekt werden vom Bundesministerium für Bildung und Forschung im Rahmen der Initiative Nationale Bildungsplattform bereitsgestellt. Zwischen den Kooperationspartnern liegt einen Kooperationsvertrag vor. Die Kooperationspartner in diesem Projekt sind:
                    </p>
                    <ul>
                        <li>Verband Bildungsmedien Service GmbH, Berlin</li>
                        <li>Fraunhofer-Institut für offene Kommunikationssysteme FOKUS, Berlin</li>
                        <li>Landesinitiative n-21 e. V.: Schulen in Niedersachsen online e. V., Hannover</li>
                    </ul>

                    <p>
                        Im Rahmen der Nutzung dieser Webseite werden personenbezogene Daten von Ihnen durch uns als den für die Datenverarbeitung Verantwortlichen verarbeitet und für die Dauer gespeichert, die zur Erfüllung der festgelegten Zwecke und gesetzlicher Verpflichtungen erforderlich ist. Im Folgenden informieren wir Sie darüber, um welche Daten es sich dabei handelt, auf welche Weise sie verarbeitet werden und welche Rechte Ihnen diesbezüglich zustehen.
                    </p>

                    <p>
                        Personenbezogene Daten sind gemäß Art. 4 Nr. 1 Datenschutzgrundverordnung (DSGVO) alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen.
                    </p>

                    <p>
                        <strong>1. Name und Kontaktdaten des für die Verarbeitung Verantwortlichen sowie des betrieblichen Datenschutzbeauftragten</strong>
                    </p>

                    <p>Diese Datenschutzinformation gilt für die Datenverarbeitung auf unserer Projektwebseite

                        {/* whitespace */}
                        &nbsp;
                        <a href="https://controlconnect.fokus.fraunhofer.de/"
                            className="text-[#2d7592] text-underline"
                        >
                            https://controlconnect.fokus.fraunhofer.de/</a> und allen Unterseiten durch den Verantwortlichen:
                    </p>

                    <p>
                        Fraunhofer-Gesellschaft
                        <br />zur Förderung der angewandten Forschung e.V.
                        <br />
                        <br /> Hansastraße 27 c,
                        <br /> 80686 München
                    </p>

                    <p>
                        Der Datenschutzbeauftragte von Fraunhofer ist unter der o.g. Anschrift, zu Hd. Datenschutzbeauftragter bzw. unter datenschutz@zv.fraunhofer.de
                        erreichbar.
                    </p>

                    <p>
                        Sie können sich jederzeit bei Fragen zum Datenschutzrecht oder Ihren Betroffenenrechten direkt an unseren Datenschutzbeauftragten
                        wenden.
                    </p>

                    <p>
                        <strong>2. Verarbeitung personenbezogener Daten und Zwecke der Verarbeitung</strong>
                    </p>

                    <p>
                        <strong>a) Beim Besuch der Webseite</strong>
                    </p>

                    <p>
                        Wenn Sie unsere Webseiten besuchen, speichern die Webserver unserer Webseite temporär jeden Zugriff Ihres Endgerätes in einer
                        Protokolldatei. Folgende Daten werden erfasst und bis zur automatisierten Löschung gespeichert:
                    </p>

                    <ul>
                        <li>IP-Adresse des anfragenden Rechners</li>
                        <li>Datum und Uhrzeit des Zugriffs</li>
                        <li>Name und URL der abgerufenen Daten</li>
                        <li>Übertragene Datenmenge Meldung, ob der Abruf erfolgreich war</li>
                        <li>Verwendeter Browser- und Betriebssystem</li>
                        <li>Name des Internet-Zugangs-Providers</li>
                        <li>Webseite, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                        <li>Aktivitätsdaten der Lernenden in Form von xAPI Learning Records</li>
                    </ul>

                    <p>
                        Die Verarbeitung dieser Daten erfolgt zu folgenden Zwecken
                    </p>

                    <ol>
                        <li>Ermöglichung der Nutzung der Webseite (Verbindungsaufbau)</li>
                        <li>Administration der Netzinfrastruktur</li>
                        <li>Angemessene technisch-organisatorische Maßnahmen zur IT-System- und Informationssicherheit unter Berücksichtigung des
                            Stands der Technik</li>
                        <li>Gewährleistung der Nutzerfreundlichkeit der Nutzung</li>
                        <li>Optimierung des Internetangebotes</li>
                        <li>Erprobung von KI-Funktionen im Rahmen dieser Studie</li>
                    </ol>

                    <p>
                        Rechtsgrundlagen für die vorstehenden Verarbeitungen sind
                    </p>

                    <ul>
                        <li>für die Verarbeitung für den Besuch der Webseiten nach den Nummern 1-2 Art. 6 Abs. 1 S.1 lit. b (Erforderlichkeit für
                            die Erfüllung des Webseiten-Nutzungsvertragsverhältnisses),</li>
                        <li>für die Verarbeitungen nach Nummer 3 Art. 6 Abs. 1 S.1 lit. c DSGVO (rechtliche Verpflichtung zur Umsetzung technisch-organisatorischer
                            Maßnahmen zur Sicherung der Datenverarbeitung nach Art. 32 DSGVO) und Art. 6 Abs. 1 S.1 lit. f DSGVO (berechtigte
                            Interessen zur Datenverarbeitung für die Netz- und Informationssicherheit) sowie für</li>
                        <li>die Verarbeitungen nach den Nummern 4-5 Art. 6 Abs. 1 S.1 lit. f DSGVO (berechtigte Interessen). Die berechtigten Interessen
                            unserer Datenverarbeitung bestehen darin, unser Angebot nutzerfreundlich zu gestalten und zu optimieren.</li>
                        <li>für die Verarbeitung nach Nummer 6 Art. 6 Abs. 1 S.1 lit. a DSGVO (Einwilligung zu der Verarbeitung). </li>
                        <li>Die vorstehend genannten Daten werden nach einer definierten Zeit vom Webserver automatisiert gelöscht, die 30 Tage beträgt.
                            Sofern Daten zu Zwecken nach Nummern 2-5 länger verarbeitet werden, erfolgt die Anonymisierung oder Löschung, wenn
                            die Speicherung für den jeweiligen Zweck nicht mehr erforderlich ist.</li>
                    </ul>

                    <p>
                        Darüber hinaus setzen wir beim Besuch unserer Website Cookies sowie Analysedienste ein. Nähere Erläuterungen dazu erhalten
                        Sie unter den Ziffer 4 und 5 dieser Datenschutzinformation.
                    </p>

                    <p><strong>b) Datenverarbeitung im Projektkontext</strong></p>

                    <p>
                        Die Verarbeitung der Daten findet auf Basis der expliziten Einwilligung nach Art. 6 Abs. 1 S.1 lit. a DSGVO (Einwilligung zu der Verarbeitung) statt. Dafür werden Aktivitätsdaten durch Interaktion mit Elementen der Webseite erzeugt und persistiert. Diese beinhalten Beschreibungen der Nutzenden, welche sich über einen schulischen Anmeldedienst authentifizieren, der Aktion und des Elements (bspw. der Lizenz oder des lizenzierten Angebots), auf das sich die Aktion bezieht. Diese Aktivitätsdaten werden im Anschluss an server-basierte Dienste des Verantwortlichen zur Speicherung weitergeleitet. Pseudonymisierte Daten werden nur zu zwecken des Abrufs lizenzierter Angebote an den jeweiligen Anbieter übertragen.
                    </p>

                    <p>
                        <strong>c) Bei Anmeldung für Veranstaltungen</strong>
                    </p>

                    <p>
                        <strong>Allgemeiner Hinweis</strong>
                    </p>

                    <p>
                        Wir bieten regelmäßig Veranstaltungen verschiedenster Art über unsere Webseite an, für die Sie sich online anmelden können.
                    </p>

                    <p>
                        Im Rahmen der Anmeldung für eine Veranstaltung müssen einige Pflichtangaben getätigt werden. Dazu gehören
                    </p>

                    <ul>
                        <li>Vor- und Nachname</li>
                        <li>E-Mail-Adresse</li>
                    </ul>

                    <p>
                        Etwaige weitere Pflichtangaben sind als solche gekennzeichnet (z.B. mittels *). Zudem können oftmals freiwillig weitere Angaben
                        getätigt werden.
                    </p>

                    <p>
                        Die Verarbeitung der Pflichtangaben erfolgt, um Sie als Teilnehmer der Veranstaltung identifizieren zu können, zur Reservierung
                        des Teilnahmeplatzes sowie um den Vertrag über die Teilnahme mit Ihnen zu begründen bzw. umzusetzen und Sie vor, während
                        und im Anschluss an die Veranstaltung mit Informationen zu der Veranstaltung zu versorgen, die Ihnen eine optimale Teilnahme
                        ermöglichen sollen und uns die Planung und Gewährleistung eines reibungslosen Ablaufs ermöglicht. Die Angabe der freiwilligen
                        Daten ermöglichen uns, die Veranstaltung interessen- und altersgerecht planen und durchführen zu können.
                    </p>

                    <p>
                        Die Datenverarbeitung erfolgt auf Anfrage der interessierten Teilnehmer und ist nach Art. 6 Abs. 1 S. 1 lit. b DSGVO zu den
                        genannten Zwecken für die Erfüllung des Teilnehmervertrages und den vorvertraglichen Maßnahmen erforderlich.
                    </p>

                    <p>
                        Die für die Veranstaltung von uns erhobenen personenbezogenen Daten werden bis zum Ablauf von 6 Monaten von uns gespeichert,
                        soweit Sie nicht in eine darüber hinausgehende Speicherung nach Art. 6 Abs. 1 S. 1 lit. a DSGVO eingewilligt haben.
                    </p>

                    <p>
                        <strong>d) Bei Nutzung von Kontaktformularen</strong>
                    </p>

                    <p>
                        Wir bieten Ihnen die Möglichkeit, mit uns über ein auf der Webseite bereitgestelltes Formular Kontakt aufzunehmen. Dabei
                        sind die folgenden Angaben als Pflichtangaben erforderlich:
                    </p>

                    <ul>
                        <li>Anrede</li>
                        <li>Vor- und Nachname und</li>
                        <li>E-Mail-Adresse.</li>
                    </ul>

                    <p>
                        Ihre Daten benötigen wir, um festzustellen von wem die Anfrage stammt und um diese beantworten und bearbeiten zu können.
                    </p>

                    <p>
                        Die Datenverarbeitung erfolgt auf Ihre Anfrage hin und ist im Rahmen der Beantwortung einer Kontaktanfrage auf unsere berechtigten
                        Interessen gem. Art. 6 Abs. 1 S. 1 lit. f DSGVO gestützt.
                    </p>

                    <p>
                        Die für die Benutzung des Kontaktformulars von uns erhobenen personenbezogenen Daten werden nach Erledigung der von Ihnen
                        gestellten Anfrage automatisch gelöscht.
                    </p>

                    <p>
                        Sofern sie über ein Benutzerkonto auf der Webseite verfügen und bereits angemeldet sind, werden Ihre Daten automatisch übermittelt
                        ohne, dass Sie diese gesondert eingeben müssen.
                    </p>

                    <p>
                        <strong>3. Weitergabe von personenbezogenen Daten</strong>
                    </p>

                    <p>
                        Außer in den zuvor genannten Fällen einer Verarbeitung im Auftrag (Anmeldung für Veranstaltungen) geben wir Ihre personenbezogenen
                        Daten nur an Dritte, d.h. andere natürliche oder juristische Personen außer Ihnen (der betroffenen Person), dem Verantwortlichen
                        oder dem Auftragsverarbeiter und deren zur Datenverarbeitung befugten Mitarbeiter weiter, wenn:
                    </p>

                    <ul>
                        <li>Sie gem. Art. 6 Abs. 1 S. 1 lit. a DSGVO Ihre ausdrückliche Einwilligung dazu erteilt haben;</li>
                        <li>dies gem. Art. 6 Abs. 1 S. 1 lit. b DSGVO für die Erfüllung eines Vertrages mit Ihnen erforderlich ist,</li>
                        <ul>
                            <li>Weitergabe an Versandunternehmen zum Zwecke der Lieferung der von Ihnen bestellten Ware,</li>
                            <li>Weitergabe von Zahlungsdaten an Zahlungsdienstleister bzw. Kreditinstitute, um einen Zahlungsvorgang durchzuführen;</li>
                        </ul>
                        <li>für den Fall, dass für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht, bspw.
                            an Finanz- oder Strafverfolgungsbehörden;</li>
                        <li>die Weitergabe ist nach Art. 6 Abs. 1 S. 1 lit. f DSGVO zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
                            erforderlich und es besteht kein Grund zur Annahme, dass Sie ein überwiegendes schutzwürdiges Interesse an der Nichtweitergabe
                            Ihrer Daten haben; eine solche Weitergabe kann bspw. im Falle von Angriffen auf unsere IT-Systeme an staatliche Einrichtungen
                            und Strafverfolgungsbehörden erfolgen.</li>
                    </ul>

                    <p>Die weitergegebenen Daten dürfen von dem Dritten ausschließlich zu den genannten Zwecken verwendet werden.</p>

                    <p>
                        Wenn Sie sich für eine Veranstaltung angemeldet haben, kann es im Rahmen der Vertragserfüllung erforderlich sein, dass Ihre
                        personenbezogenen Daten an einen externen Veranstalter übermittelt werden müssen. Im Zusammenhang mit einer Veranstaltungsanmeldung
                        werden Sie darüber informiert, wer Veranstalter ist und ob es sich dabei um einen externen Veranstalter handelt. Dieser
                        wird personenbezogenen Daten im Rahmen der Veranstaltung und insbesondere zur Teilnehmerverwaltung verarbeiten.
                    </p>

                    <p>
                        Eine Übermittlung von personenbezogenen Daten an ein Drittland (außerhalb der EU) oder eine internationale Organisation ist
                        ausgeschlossen.
                    </p>

                    <p>
                        <strong>4. Cookies</strong>
                    </p>

                    <p>
                        Wir setzen auf unserer Seite Cookies ein, die für den Betrieb der Webseite technisch notwendig sind. Die verwendeten Standards (allen voran IMS LTI in Version 1.1) zur Kommunikation mit Anbietern von Lerninhalten und -diensten, setzen die Nutzung von Cookies zwangsweise voraus. Hierbei handelt es sich um kleine Dateien, die Ihr Browser automatisch erstellt und die auf Ihrem Endgerät (Laptop, Tablet, Smartphone o.ä.) gespeichert werden, wenn Sie unsere Seite besuchen. Cookies richten auf Ihrem Endgerät keinen Schaden an, enthalten keine Viren, Trojaner oder sonstige Schadsoftware.
                    </p>

                    <p>
                        In dem Cookie werden Informationen abgelegt, die sich jeweils im Zusammenhang mit dem spezifisch eingesetzten Endgerät ergeben.
                        Dies bedeutet jedoch nicht, dass wir dadurch unmittelbar Kenntnis von Ihrer Identität erhalten.
                    </p>

                    <p>
                        Der Einsatz von Cookies dient dazu, die Inhalte darzustellen und Dienste anzubinden. So setzen wir sogenannte Session-Cookies ein, um die Sitzungssteuerung zu ermöglichen, bspw. Formulareingaben während der Sitzung zu speichern. Session-Cookies werden spätestens mit dem Schließen Ihres Webbrowsers gelöscht.
                    </p>

                    <p>
                        Zum anderen setzen wir Cookies ein, um die Nutzung unserer Website statistisch zu erfassen und zum Zwecke der Optimierung unseres Angebotes für Sie auszuwerten (siehe Ziffer 5). Diese Cookies ermöglichen es uns, bei einem erneuten Besuch unserer Seite automatisch zu erkennen, dass Sie bereits bei uns waren. Diese Cookies werden nach einer jeweils definierten Zeit automatisch gelöscht.
                    </p>

                    <p>
                        Die Verarbeitung personenbezogener Daten im Rahmen technisch notwendiger Cookies beruht auf unserem berechtigten Interesse an der Erbringung unserer, von Ihnen ausdrücklich gewünschten Webdienste (Art. 6 Abs. 1 S. 1 lit. f DSGVO ggf. i.V.m. Art. 95 DSGVO, Art. 5 Abs. 3 RL 2002/58/EG)
                    </p>

                    <p>
                        Die meisten Browser akzeptieren Cookies automatisch. Sie können Ihren Browser jedoch so konfigurieren, dass keine Cookies
                        auf Ihrem Computer gespeichert werden oder stets ein Hinweis erscheint, bevor ein neuer Cookie angelegt wird. Die vollständige
                        Deaktivierung von Cookies kann jedoch dazu führen, dass Sie nicht alle Funktionen unserer Website nutzen können.
                    </p>

                    <p>
                        <strong>5. Webanalyse/Tracking</strong>
                    </p>

                    <p>
                        <strong>a) Matomo </strong>
                    </p>

                    <p>
                        Wir setzen auf unserer Webseite den Open-Source-Dienst
                        &nbsp;
                        <a
                            className="text-[#2d7592] text-underline"

                            href="https://matomo.org/">Matomo von InnoCraft Ltd</a> aus Neuseeland ein, um das Nutzerverhalten bei Besuch unserer Seite zu analysieren und unsere
                        Seite und deren Inhalte entsprechend darauf basierend zu optimieren. Dabei erhalten wir keine Informationen, die Sie
                        unmittelbar identifizieren.
                    </p>

                    <p>
                        Im Zusammenhang mit dem Einsatz von Matomo werden Cookies eingesetzt, die eine statistische Analyse der Nutzung dieser Website
                        durch Ihre Besuche ermöglichen. In dem Cookie werden Informationen – einschließlich personenbezogener Informationen -zu
                        Ihrem Besucherverhalten abgelegt und unter Verwendung eines Pseudonyms in einem Nutzungsprofil zum Zwecke der Analyse
                        verarbeitet. Da Matomo auf unseren eigenen Server gehostet wird, ist für die Analyse eine Verarbeitung durch Dritte nicht
                        erforderlich.
                    </p>

                    <p>
                        Die dabei gewonnenen Daten werden ohne Ihre gesondert erteilte Zustimmung nicht benutzt, um Sie persönlich zu identifizieren
                        und die Daten werden nicht mit personenbezogenen Daten über Sie als Träger des Pseudonyms zusammengeführt.
                    </p>

                    <p>
                        Soweit IP-Adressen erhoben werden, werden diese unverzüglich nach Erhebung durch Löschen des letzten Nummernblocks anonymisiert.
                        Weitere personenbezogene Daten in dem Cookie werden nach 60 Tagen gelöscht.
                    </p>

                    <p>
                        Die Datenverarbeitung erfolgt auf Grund unseres berechtigten Interesses gemäß Art. 6 Abs.1 lit. f DSGVO an der Optimierung
                        unseres Online-Angebotes und unseres Webauftritts.
                    </p>

                    <p>
                        <strong>6. Betroffenenrechte</strong>
                    </p>

                    <p>
                        Sie haben das Recht:
                    </p>

                    <ul>
                        <li>gemäß Art. 7 Abs. 3 DSGVO Ihre einmal erteilte Einwilligung jederzeit gegenüber uns zu widerrufen. Dies hat zur Folge,
                            dass wir die Datenverarbeitung, die auf dieser Einwilligung beruhte, für die Zukunft nicht mehr fortführen dürfen;</li>
                        <li>gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen. Insbesondere können
                            Sie Auskunft über die Verarbeitungszwecke, die Kategorie der personenbezogenen Daten, die Kategorien von Empfängern,
                            gegenüber denen Ihre Daten offengelegt wurden oder werden, die geplante Speicherdauer, das Bestehen eines Rechts
                            auf Berichtigung, Löschung, Einschränkung der Verarbeitung oder Widerspruch, das Bestehen eines Beschwerderechts,
                            die Herkunft ihrer Daten, sofern diese nicht bei uns erhoben wurden, sowie über das Bestehen einer automatisierten
                            Entscheidungsfindung einschließlich Profiling und ggf. aussagekräftigen Informationen zu deren Einzelheiten verlangen;</li>
                        <li>gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten personenbezogenen
                            Daten zu verlangen;</li>
                        <li>gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen, soweit nicht die Verarbeitung
                            zur Ausübung des Rechts auf freie Meinungsäußerung und Information, zur Erfüllung einer rechtlichen Verpflichtung,
                            aus Gründen des öffentlichen Interesses oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
                            erforderlich ist;</li>
                        <li>gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, soweit die Richtigkeit
                            der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig ist, Sie aber deren Löschung ablehnen und wir
                            die Daten nicht mehr benötigen, Sie jedoch diese zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
                            benötigen oder Sie gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung eingelegt haben;</li>
                        <li>gemäß Art. 20 DSGVO Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen
                            und maschinenlesebaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu verlangen und</li>
                        <li>gemäß Art. 77 DSGVO sich bei einer Aufsichtsbehörde zu beschweren. In der Regel können Sie sich hierfür an die Aufsichtsbehörde
                            ihres üblichen Aufenthaltsortes oder Arbeitsplatzes oder unseres Unternehmenssitzes wenden.</li>
                    </ul>

                    <br />

                    <div>
                        <p>
                            <strong>Information über Ihr Widerspruchsrecht nach Art. 21 DSGVO</strong>
                        </p>

                        <p>
                            Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender
                            personenbezogener Daten, die aufgrund von Artikel 6 Absatz 1 Buchstabe e DSGVO (Datenverarbeitung im öffentlichen
                            Interesse) und Artikel 6 Absatz 1 Buchstabe f DSGVO (Datenverarbeitung auf der Grundlage einer Interessenabwägung)
                            erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmung gestütztes Profiling von Artikel 4 Nr.
                            4 DSGVO.
                        </p>

                        <p>Legen Sie Widerspruch ein, werden wir Ihre personenbezogenen Daten nicht mehr verarbeiten, es sei denn, wir können zwingende
                            schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder
                            die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.</p>
                        <p>
                            Sofern sich Ihr Widerspruch gegen eine Verarbeitung von Daten zum Zwecke der Direktwerbung richtet, so werden wir die Verarbeitung
                            umgehend einstellen. In diesem Fall ist die Angabe einer besonderen Situation nicht erforderlich. Dies gilt auch
                            für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.
                        </p>

                        <p>
                            Möchten Sie von Ihrem Widerspruchsrecht Gebrauch machen, genügt eine E-Mail an datenschutz@zv.fraunhofer.de.
                        </p>
                    </div>

                    <br />

                    <p>
                        <strong>
                            7. Datensicherheit
                        </strong>
                    </p>

                    <p>
                        Alle von Ihnen persönlich übermittelten Daten werden mit dem allgemein üblichen und sicheren Standard TLS (Transport Layer
                        Security) verschlüsselt übertragen. TLS ist ein sicherer und erprobter Standard, der z.B. auch beim Onlinebanking Verwendung
                        findet. Sie erkennen eine sichere TLS-Verbindung unter anderem an dem angehängten s am http (also https://..) in der
                        Adressleiste Ihres Browsers oder am Schloss-Symbol im unteren Bereich Ihres Browsers.
                    </p>

                    <p>
                        Wir bedienen uns im Übrigen geeigneter technischer und organisatorischer Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige
                        oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder gegen den unbefugten Zugriff
                        Dritter zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.
                    </p>

                    <p>
                        <strong>
                            8. Aktualität und Änderung dieser Datenschutzinformation
                        </strong>
                    </p>

                    <p>
                        Diese Datenschutzinformation ist aktuell gültig und hat den Stand [September 2023].
                    </p>

                    <p>
                        Durch die Weiterentwicklung unserer Webseite und Angebote darüber oder aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzinformation zu ändern. Die jeweils aktuelle Datenschutzinformation kann jederzeit auf der Webseite unter
                        <a href="https://controlconnect.fokus.fraunhofer.de/">https://controlconnect.fokus.fraunhofer.de/</a> von Ihnen abgerufen und ausgedruckt werden.
                    </p>

                    <p>
                        <strong>
                            9. Salvatorische Klausel
                        </strong>
                    </p>

                    <p>
                        Sollten einzelne Bestimmungen dieser Datenschutzerklärung ganz oder in Teilen unwirksam oder undurchführbar sein oder werden,
                        berührt dies nicht die Wirksamkeit der übrigen Bestimmungen. Entsprechendes gilt im Fall von Lücken.
                    </p>

                    <center>
                        Zuletzt geändert: Donnerstag, 07. September 2023, 12:00
                    </center>
                    <p></p></span>

            </div>

        </div>


    </>


}