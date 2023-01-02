


export const toBILO = (license?: any) => {
    const constraints = license?.permissions[0].constraints
    return {
        sonderlizenz: constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/recipient')?.rightoperand,
        lizenzanzahl: parseInt(constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/count').rightoperand),
        gueltigkeitsbeginn: constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime'
        && item.operator === 'http://www.w3.org/ns/odrl/2/gteq'
        ).rightoperand,
        gueltigkeitsende: constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime'
        && item.operator === 'http://www.w3.org/ns/odrl/2/lteq'
        ).rightoperand
        ,
        gueltigkeitsdauer: parseInt(constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/elapsedTime').rightoperand),
        nutzungssysteme: constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/product').rightoperand,
        lizenztyp: constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/purpose').rightoperand,
        kaufreferenz: constraints?.find((item: any) => item.name === 'http://www.w3.org/ns/odrl/2/dateTime').rightoperand,
        productid: license?.permissions[0].target,
    }

}