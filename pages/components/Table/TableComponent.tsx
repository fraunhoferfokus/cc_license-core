import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"


export default function AssignmentTableContainer({
    filterFunction,
    data,
    trigger,
    setTrigger,
    identifier,
    checkbox,
    header,
    singleCheckBox,
    onChangeCheckBox,
    onChangeFilteredEntries,
    disableFooter,
}: any

) {

    const [filtered_rows, set_filtered_rows] = useState<any[]>(data)
    const [paginated_rows, set_paginated_rows] = useState<any[]>(data)
    const [pickedIdentifiers, setPickedIdentifiers] = useState<any[]>([])
    let [page, setPage] = useState(0)
    let [entriesPerPage, setEntriesPerPage] = useState(5)

    useEffect(() => {
        if (trigger) {
            setTrigger(false)
            const filteredRows = filterFunction(data)
            console.log({ filteredRows })
            set_filtered_rows(filteredRows)
        }
    }, [trigger]);


    useEffect(() => {
        if (onChangeFilteredEntries) onChangeFilteredEntries(filtered_rows)
    }, [filtered_rows])



    useEffect(() => {
        setPage(0)
        const rows = filtered_rows.slice(0, entriesPerPage)
        set_paginated_rows(rows)
    }, [entriesPerPage])


    useEffect(
        () => {
            set_paginated_rows(filtered_rows.slice(page * entriesPerPage, page * entriesPerPage + entriesPerPage))

        },

        [page, filtered_rows]
    )


    useEffect(() => {
        if (onChangeCheckBox) onChangeCheckBox(pickedIdentifiers)
    }, [pickedIdentifiers])


    const tableRows = paginated_rows.map((row) => (
        <TableRow
            key={row[identifier]}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            className="max-h-[50px]"
            style={{ height: '50px', maxHeight: '50px' }}
        >
            {checkbox &&
                <TableCell component="th" scope="row"
                    sx={{ padding: "10px", height: 50,
                    width: "50px"
                
                }}

                >
                    <Checkbox
                        checked={pickedIdentifiers.includes(row[identifier])}
                        disabled={singleCheckBox && pickedIdentifiers.length > 0 && !pickedIdentifiers.includes(row[identifier])}
                        onChange={(event) => {
                            if (event.target.checked) {
                                setPickedIdentifiers([...pickedIdentifiers, row[identifier]])
                            } else {
                                setPickedIdentifiers(pickedIdentifiers.filter((id: string) => id !== row[identifier]))
                            }
                        }}

                    />
                </TableCell>
            }

            {header.map(({ label, id }: any) => (
                <TableCell align="left"
                    sx={{ padding: "10px"}}
                >{row[id]}</TableCell>
            ))}
        </TableRow>
    ))



    return (
        <>
            <div className="flex flex-col flex-1">

                <TableContainer component={Paper}
                    className="flex-1 overflow-scroll"

                >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow
                            >
                                {checkbox && <TableCell
                                    sx={{ padding: "10px", height: 50 }}

                                >Checkbox</TableCell>}

                                {
                                    header.map(({ label, value }: any) => {
                                        return (
                                            <TableCell
                                                sx={{ padding: "10px", height: 50, width: "50px"}}

                                            >{label}</TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody
                            className="max-h-[50px] h-[50px]"
                        >
                            {tableRows}
                        </TableBody>
                    </Table>
                </TableContainer>

                {!disableFooter &&
                    <div className="pagination flex self-center mt-[30px] mb-[15px]">
                        <div>
                            <span
                                className="mr-[10px]"
                            >
                                Rows per page:
                            </span>
                            <select
                                onChange={(e) => {
                                    console.log(e.target.value)
                                    setEntriesPerPage(parseInt(e.target.value))
                                }}

                            >
                                <option>5</option>
                                <option>10</option>
                                <option>25</option>
                            </select>
                        </div>
                        <div
                            className="ml-[20px] mr-[20px]"

                        >
                            {page * entriesPerPage + 1}- {page * entriesPerPage + entriesPerPage} of {filtered_rows.length}
                        </div>
                        <div>
                            <img
                                src="/previous.svg"
                                className="cursor-pointer"
                                onClick={() => {

                                    if (page > 0) setPage(page - 1)
                                }}
                            />

                            <img
                                src="/next.svg"
                                className="cursor-pointer"
                                onClick={() => {

                                    if (page * entriesPerPage + entriesPerPage < filtered_rows.length) setPage(page + 1)
                                }}
                            />
                        </div>
                    </div>


                }

            </div>

        </>
    )
}