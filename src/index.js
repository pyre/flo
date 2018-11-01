// external imports
import ReactDOM from 'react-dom'
import React, { useState } from 'react'
import { PrimaryButton } from 'quark-web'

const HelloWorld = () => {
    const [state, setState] = useState(0)

    return <PrimaryButton onClick={() => setState(state + 1)}>{state}</PrimaryButton>
}

ReactDOM.render(<HelloWorld />, document.getElementById('app'))
