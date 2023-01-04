


export const toBILO = (license?: any) => {
    const constraints = license?.permissions[0].constraints

    let one = constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime'
        && item.operator === 'http://www.w3.org/ns/odrl/2/gteq'
    ).rightoperand

    let two = new Date(constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime'
        && item.operator === 'http://www.w3.org/ns/odrl/2/lteq'
    ).rightoperand)


    let gueltigkeitsbeginn = new Date(one)
    let gueltigkeitsende = new Date(two)
    let anzahl = constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/count').rightoperand

    return {
        sonderlizenz: constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/recipient')?.rightoperand,
        lizenzanzahl: anzahl ? parseInt(anzahl) : 0,
        gueltigkeitsbeginn:
            gueltigkeitsbeginn.getDate() ? gueltigkeitsbeginn.getDate() + '-' + (gueltigkeitsbeginn.getMonth() + 1) + '-' + gueltigkeitsbeginn.getFullYear() : '',
        gueltigkeitsende:
            gueltigkeitsende.getDate() ? gueltigkeitsende.getDate() + '-' + (gueltigkeitsende.getMonth() + 1) + '-' + gueltigkeitsende.getFullYear() : ''
        ,
        gueltigkeitsdauer: parseInt(constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/elapsedTime').rightoperand),
        nutzungssysteme: constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/product').rightoperand,
        lizenztyp: constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/purpose').rightoperand,
        kaufreferenz: constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime').rightoperand,
        productid: license?.permissions[0].target,
    }

}