export function calculateVolume (
    length: number,
    width: number,
    thickness: number,
) {
    return (length * width * thickness)/1000;
}

export function calculateWeight (
    volume: number,
    density: number
) {
    return (volume * density)/1000;
}

export function calculateCost (
    weight: number,
    price: number
) {
    return (weight) * price;
}

export function calculateProcessCost(
    milling: number,
    turning: number,
    grinding: number,
    edm: number,
    wirecut: number,
    hardening: number,
    plating: number,
    others: number
) {
    const fix = (val: any) =>
        Number(String(val).trim().replace(",", "."));

    return (
        fix(milling) * 15 +
        fix(turning) * 15 +
        fix(grinding) * 15 +
        fix(edm) * 27 +
        fix(wirecut) * 27 +
        fix(hardening) * 30 +
        fix(plating) * 20 +
        fix(others)
    );
    //return (milling*15) + (turning*15) + (grinding*15) + (edm*27) + (wirecut*27) + (hardening*30) + (plating*20) + others
}

export function totalPrice(
    materialCost: number,
    processCost:  number,
    qty: number,
) {
    return (
        (materialCost + processCost ) * qty
    )
}