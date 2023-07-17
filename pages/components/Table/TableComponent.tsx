import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { max } from "moment"
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
    checkBoxCheckedFunction,
    checkBoxDisabledFunction,
    pickedColor,
    onChangeClickedRow,
    entryBackgroundColor,
    headerBackgroundColor,
}: any

) {

    const [filtered_rows, set_filtered_rows] = useState<any[]>(data)
    const [paginated_rows, set_paginated_rows] = useState<any[]>(data)
    const [pickedIdentifiers, setPickedIdentifiers] = useState<any[]>([])

    const [highlightedEntry, setHighlightedEntry] = useState<any>(null)


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
        if (onChangeClickedRow) onChangeClickedRow(highlightedEntry)
    }, [highlightedEntry])


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
            sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: highlightedEntry === row[identifier] && pickedColor ? pickedColor :
                    entryBackgroundColor ? entryBackgroundColor : "inherit"

            }}
            className="max-h-[50px] cursor-pointer"
            onClick={() => setHighlightedEntry(row[identifier])}


        // style={{ height: '50px', maxHeight: '50px' }}
        >
            {checkbox &&
                <TableCell
                    sx={{
                        padding: '5px',
                        height: 50,
                        width: "50px",
                        maxHeight: 50,
                    }}

                >
                    <Checkbox
                        checked={
                            pickedIdentifiers.includes(row[identifier])
                            ||
                            checkBoxCheckedFunction && checkBoxCheckedFunction(row[identifier])
                        }
                        disabled={
                            singleCheckBox && pickedIdentifiers.length > 0 && !pickedIdentifiers.includes(row[identifier])
                            ||
                            checkBoxDisabledFunction && checkBoxDisabledFunction(row[identifier])

                        }
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

            {header.map(({ label, id }: any) => {

                let header_item = header.find((item: any) => item.id === id)
                if (header_item?.disabled) return (<></>)

                return (
                    <TableCell align="left"
                        className="overflow-hidden"
                        sx={{
                            padding: "5px",
                            maxHeight: 50,
                            height: 40,
                            // backgroundColor: entryBackgroundColor ? entryBackgroundColor : "inherit",
                            backgroundColor: 'none'
                            // textWrap: 'nowrap',
                        }}
                    >
                        {row[id]}

                    </TableCell>
                )


            })}
        </TableRow>
    ))



    return (
        <>
            <div className="flex flex-col flex-1 overflow-hidden">

                <TableContainer component={Paper}
                    className="flex-1 bg-transparent"

                >
                    <Table sx={{
                        minWidth: 650,


                    }}
                        className="bg-transparent"

                        aria-label="simple table"
                        size="small"
                        stickyHeader={true}

                    >
                        <TableHead>
                            <TableRow
                                className=""

                            >
                                {checkbox && <TableCell
                                    align="left"
                                    sx={{
                                        height: 40,
                                        padding: '10px',
                                        fontWeight: 600,
                                        marginRight: 16,
                                        backgroundColor: headerBackgroundColor ? headerBackgroundColor : "white",
                                        // boxSizing: 'content-box',
                                    }}
                                >Checkbox</TableCell>}

                                {
                                    header.map(({ label, id }: any) => {
                                        let header_item = header.find((item: any) => item.id === id)
                                        if (header_item?.disabled) return (<></>)

                                        return (
                                            <TableCell
                                                align="left"
                                                sx={{
                                                    padding: '5px',
                                                    fontWeight: 600,
                                                    height: 52,
                                                    backgroundColor: headerBackgroundColor ? headerBackgroundColor : "white",
                                                }}

                                            >{label}</TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody
                            className="bg-transparent"
                        >
                            {tableRows}
                        </TableBody>
                    </Table>
                </TableContainer>

                {!disableFooter &&
                    <div className="pagination flex self-center mt-[10px] mb-[15px]">
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