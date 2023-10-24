import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from "react";




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
    highlightOnHover,
    triggerSetBoxFunction,
    checkBoxDisabledMessage,
    isLoading,
    loadingAmount
}: any

) {
    const [filtered_rows, set_filtered_rows] = useState<any[]>([])
    const [paginated_rows, set_paginated_rows] = useState<any[]>([])
    const [pickedIdentifiers, setPickedIdentifiers] = useState<any[]>([])
    const [highlightedEntry, setHighlightedEntry] = useState<any>(null)
    let [page, setPage] = useState(0)
    let [entriesPerPage, setEntriesPerPage] = useState(0)

    useEffect(() => {
        if (trigger) {
            setTrigger(false)
            const filteredRows = filterFunction(data)
            set_filtered_rows(filteredRows)
            if (triggerSetBoxFunction) {
                const selectedUserIds = triggerSetBoxFunction(pickedIdentifiers, setPickedIdentifiers)
                setPickedIdentifiers(selectedUserIds)
            }
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

    useEffect(() => {
        setEntriesPerPage(100)
        if (filterFunction) {
            set_filtered_rows(filterFunction(data))
        } else {


            set_filtered_rows(data)
        }
        set_paginated_rows(filtered_rows.slice(page * entriesPerPage, page * entriesPerPage + entriesPerPage))
    }, [data])

    const tableRows =
        isLoading ?
            <>
                {Array(loadingAmount || 20).fill(0).map(() => {
                    return <TableRow>
                        {
                            Array(checkbox ? header.length + 1 : header.length).fill(0).map(() => {
                                return <TableCell
                                    align="left"
                                    sx={{
                                        padding: '5px',
                                        fontWeight: 600,
                                        height: 40,
                                        backgroundColor: headerBackgroundColor ? headerBackgroundColor : "#EEF7FE",
                                    }}

                                >
                                    <div>
                                        <div className="animate-pulse h-[20px] bg-gray-300 rounded"></div>
                                    </div>
                                </TableCell>
                            })
                        }

                    </TableRow>
                })}
            </>
            :

            paginated_rows.map((row) => (
                <TableRow


                    key={row[identifier]}
                    sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: highlightedEntry === row?.[identifier] && pickedColor ? pickedColor :
                            entryBackgroundColor ? entryBackgroundColor : "inherit",
                        '&:hover': {
                            backgroundColor: highlightOnHover ? "#e0e0e0" : "inherit"
                        }

                    }}
                    className="max-h-[50px] cursor-pointer"
                    onClick={() => {
                        if (row[identifier] === highlightedEntry) {
                            setHighlightedEntry(null)
                        } else {
                            setHighlightedEntry(row[identifier])
                        }
                    }}


                // style={{ height: '50px', maxHeight: '50px' }}
                >
                    {checkbox &&
                        <TableCell
                            sx={{
                                padding: '5px',
                                height: 40,
                                width: "40px",
                                maxHeight: 40,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Checkbox
                                className="p-[0px] h-[15px] w-[15px] ml-[10px]"
                                checked={
                                    pickedIdentifiers.includes(row[identifier]) ? true : false
                                        ||
                                        (checkBoxCheckedFunction && checkBoxCheckedFunction(row[identifier])) ? true : false
                                }
                                disabled={
                                    singleCheckBox && pickedIdentifiers.length > 0 && !pickedIdentifiers.includes(row[identifier]) ? true : false
                                        ||
                                        checkBoxDisabledFunction && checkBoxDisabledFunction(row[identifier]) ? true : false

                                }
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        setPickedIdentifiers([...pickedIdentifiers, row[identifier]])
                                    } else {
                                        setPickedIdentifiers(pickedIdentifiers.filter((id: string) => id !== row[identifier]))
                                    }
                                }}
                            />
                            {
                                checkBoxDisabledFunction && checkBoxDisabledFunction(row[identifier]) && checkBoxDisabledMessage ?
                                    <Tooltip title={checkBoxDisabledMessage} placement="top">
                                        <GppMaybeIcon
                                            color='warning'
                                        ></GppMaybeIcon>
                                    </Tooltip> : <></>

                            }

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
                                    maxHeight: 40,
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
            <div className="flex flex-col flex-1 overflow-hidden bg-transparent             
            ">

                <TableContainer component={Paper}
                    className="flex-1"
                    sx={{
                        backgroundColor: 'transparent',
                    }}

                >
                    <Table sx={{
                        backgroundColor: 'transparent',

                    }}


                        aria-label="simple table"
                        size="small"
                        stickyHeader={true}

                    >
                        <TableHead
                        >
                            <TableRow

                            >
                                {checkbox && <TableCell
                                    align="left"
                                    sx={{
                                        height: 40,
                                        fontWeight: 600,
                                        marginRight: 16,
                                        backgroundColor: headerBackgroundColor ? headerBackgroundColor : "#EEF7FE",
                                        // boxSizing: 'content-box',
                                    }}
                                >
                                    {/* Checkbox */}
                                </TableCell>}

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
                                                    height: 40,
                                                    backgroundColor: headerBackgroundColor ? headerBackgroundColor : "#EEF7FE",
                                                }}

                                            >
                                                <label>
                                                    {label}
                                                </label>
                                                <img
                                                    className="ml-[5px] cursor-pointer"
                                                    src="/sort.svg"
                                                    onClick={() => {
                                                        // sort filterd rows
                                                        let attribute = id
                                                        const sorted_rows = filtered_rows.sort((a, b) => {
                                                            return a[id].localeCompare(b[id])
                                                        })

                                                        set_filtered_rows(
                                                            [...sorted_rows]
                                                        )

                                                    }}
                                                >
                                                </img>
                                            </TableCell>
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
                    <div className="pagination flex self-center mt-[10px] mb-[15px]
                    text-[12px] text-[rgba(0,0,0,0.6)] justify-center items-center
                    ">
                        <div
                            className=""
                        >
                            <span
                                className="mr-[10px] "
                            >
                                Rows per page:
                            </span>
                            <select
                                onChange={(e) => {
                                    setEntriesPerPage(parseInt(e.target.value))
                                }}

                            >
                                <option>50</option>
                                <option
                                    selected={entriesPerPage === 100}
                                >100</option>
                                <option>500</option>
                                <option>1000</option>
                                {/* <option>25</option> */}
                            </select>
                        </div>
                        <div
                            className="ml-[20px] mr-[20px] font-bold"

                        >
                            {page * entriesPerPage + 1}- {page * entriesPerPage + entriesPerPage} of {filtered_rows.length}
                        </div>
                        <div>
                            <img
                                src="/previous.svg"
                                className="cursor-pointer mr-[20px]"
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