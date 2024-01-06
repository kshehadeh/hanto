import { add } from './add';
import { subtract } from './subtract';

export function addAndSubtract(...nums: number[]) {
    return subtract(add(...nums), ...nums);
}
