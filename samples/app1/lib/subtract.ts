
export function subtract(...nums: number[]) {
    return nums.reduce((a, b) => a - b, nums[0]);
}