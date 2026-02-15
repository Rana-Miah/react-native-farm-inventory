export function generateItemCode(code: string, incrementBy: number): string {
    const [right, left] = code.split("-")
    const increasedCode = (Number(left) + incrementBy)

    return `${right}-${increasedCode.toString().padStart(4, "0")}`
}
export function generateBarcode(code: string,) {
    let increasedCode = Number(code)
    return increasedCode++
}
