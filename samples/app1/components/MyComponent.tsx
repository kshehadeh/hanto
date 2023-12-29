import {useState, useEffect, PropsWithChildren, ReactElement} from 'react';
import { sum } from '../lib/utils';

export const i = 0, j = 1;
const priv = "test";

export function MyComponent(props: PropsWithChildren<{index: number}>): ReactElement {    
    const [count, setCount] = useState(0);

    useEffect(() => {        
        setCount(sum(count, props.index))
    },[count])

    return <div>{count}{props.children}</div>;
}
