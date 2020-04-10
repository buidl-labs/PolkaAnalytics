import React, { useState } from 'react'
import {
    Link as RouterLink,
    BrowserRouter as Router,
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom'
import { Heading, Text, Link, Box } from '@chakra-ui/core'

import 'react-vertical-timeline-component/style.min.css'

import Guide from './Guide'

export default function GuidesList() {
    const [guidesList, setGuidesList] = useState([])

    // TODO: take API url from env variable
    fetch(`https://my-json-server.typicode.com/am1e/sample-api/guidesList`)
        .then((resp) => resp.json())
        .then((guides) => {
            setGuidesList(guides)
        })

    let match = useRouteMatch()
    let rows = []
    let srows = []
    for (let i = 0; i < guidesList.length; i++) {
        rows.push(
            <div key={guidesList[i].id}>
                <Link
                    as={RouterLink}
                    to={`${match.url}/guides/${guidesList[i].id}`}
                >
                    <Box className='card' mt={8} p={8}>
                        <Heading as='h3' size='lg'>
                            {guidesList[i].heading}
                        </Heading>
                        <Text my={4}>{guidesList[i].shorttext}</Text>
                    </Box>
                </Link>
            </div>
        )
        srows.push(
            <Route
                key={guidesList[i].id}
                exact
                path={`${match.path}/guides/${guidesList[i].id}`}
            >
                <Guide
                    id={guidesList[i].id}
                    heading={guidesList[i].heading}
                    text={guidesList[i].text}
                />
            </Route>
        )
    }
    return (
        <Router>
            <div>
                <Switch>{srows}</Switch>
                <div>{rows}</div>
            </div>
        </Router>
    )
}
