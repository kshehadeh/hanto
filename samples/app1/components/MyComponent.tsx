import React, {useState, useEffect, PropsWithChildren, ReactElement} from 'react';
import { addAndSubtract } from '../lib/math';

export const i = 0, j = 1;
const priv = "test";

export function MyComponent(props: PropsWithChildren<{index: number}>): ReactElement {    
    const [count, setCount] = useState(0);

    useEffect(() => {        
        setCount(addAndSubtract(count, props.index))
    },[count])

    return <div>{count}{props.children}</div>;
}

function myFunction() {
    return 0;
}

class MyClass {
    private _count: number = 0;

    constructor() {
        console.log('test');
    }

    public get count(): number {
        return 0;
    }

    public set count(value: number) {
        console.log(value);
    }

    protected getValue() {
        return 0;
    }
}

export class MyComponentClass extends React.Component<{index: number}, {count: number}> {
    constructor(props: any) {
        super(props);
        this.state = {
            count: 0
        }
    }

    render() {
        return <div>{this.state.count}</div>;
    }
}


export default MyClass;
