
export default function TableofContents() {


    const sections = [
        {
            id: '#/',
            title: 'Einleitung'
        },
        {
            id: 2,
            title: 'Chapter 1: Basics',
            subsections: [
                { id: '2.1', title: 'Topic 1' },
                { id: '2.2', title: 'Topic 2' },
            ]
        },
        {
            id: 3,
            title: 'Chapter 2: Advanced Topics',
            subsections: [
                { id: '3.1', title: 'Advanced Topic 1' },
                { id: '3.2', title: 'Advanced Topic 2' },
            ]
        },
    ]

    return <>
    </>


}