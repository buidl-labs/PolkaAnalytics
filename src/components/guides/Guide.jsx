import React, { useState } from 'react'

import 'react-vertical-timeline-component/style.min.css'

export default function Guide(props) {
    let steps = []
    let temp = []
    const [stepsArr, setStepsArr] = useState([])

    // TODO: take API url from env variable
    fetch(
        `https://my-json-server.typicode.com/am1e/sample-api/guidesList/${props.id}`
    )
        .then((resp) => resp.json())
        .then((guide) => {
            steps = guide.steps
            for (let i = 0; i < steps.length; i++) {
                temp.push(
                    <div>
                        Step {steps[i].id}: {steps[i].text}
                    </div>
                )
            }
        })
        .finally(() => {
            setStepsArr(temp)
        })

    return (
        <div>
            <h1>{props.heading}</h1>
            <p>{props.text}</p>
            Steps:
            {stepsArr}
        </div>
    )
}
