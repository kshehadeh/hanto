
export function sum(...nums:number[]) {
    return nums.reduce((a, b) => a + b, 0);
}
