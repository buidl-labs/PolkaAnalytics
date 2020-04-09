import React, { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Heading, Text, Link, Icon, Box, Spinner } from '@chakra-ui/core'
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import LogEvent from '../LogEvent'
import Helmet from 'react-helmet'
// import guides from './guides.json'
import ReactHtmlParser from 'react-html-parser'
import axios from 'axios'

const contentStyle = {
  background: 'transparent',
  paddingTop: 0,
  borderRadius: 0,
}
const contentArrowStyle = {
  borderRight: '7px solid transparent',
}

const iconStyle = {
  background: '#319795',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}
export default function GuideGenerator(props) {
  const path = props.props.split('/').pop()
  const [guide, setGuide] = useState(null)

  useEffect(() => {
    const getGuide = async () => {
      const response = await axios
        .get('https://guides-server.herokuapp.com/guides/' + path)
        .then((res) => res.data)
      setGuide(await response)
    }
    getGuide()
  }, [])
  const description = (obj) => {
    const div = (
      <Text fontSize='2xl' textAlign='center' mb={16}>
        {obj.text}{' '}
        {!obj.link ? null : (
          <Link
            href={obj.link.href}
            color='teal.500'
            isExternal={{ ...obj.link.text.isExternal }}
          >
            {obj.link.text}
          </Link>
        )}
      </Text>
    )
    return div
  }

  const card = (obj) => {
    const card = (
      <VerticalTimelineElement
        key={obj.heading}
        contentStyle={contentStyle}
        contentArrowStyle={contentArrowStyle}
        icon={
          obj.icon !== 'custom' ? (
            <Heading as='h5' size='sm'>
              {obj.icon}
            </Heading>
          ) : (
            <Icon name='check' color='white' />
          )
        }
        iconStyle={
          obj.icon !== 'custom' ? iconStyle : { background: '#319795' }
        }
      >
        <Heading as='h3' size='lg'>
          {obj.heading}
        </Heading>
        {obj.text ? <Text>{ReactHtmlParser(obj.text)}</Text> : null}
        {obj.link ? (
          <Link as={RouterLink} to={obj.link.to} color='teal.500'>
            {obj.link.text}
          </Link>
        ) : null}
      </VerticalTimelineElement>
    )
    return card
  }
  return !guide ? (
    <Box
      display='flex'
      flexDirection='column'
      position='absolute'
      top='50%'
      left='50%'
      transform='translate(-50%, -50%)'
      alignSelf='center'
      justifyContent='center'
      textAlign='center'
      mt={-16}
      zIndex={-1}
    >
      <Spinner as='span' size='lg' alignSelf='center' />
      <Text
        mt={4}
        fontSize='xl'
        color='gray.500'
        textAlign='center'
        alignSelf='center'
      >
        Stabilizing the isotopes...
      </Text>
    </Box>
  ) : (
    <Box mb={8}>
      <Helmet>
        <title>{guide.title}</title>
        <meta name='description' content={guide.meta.content} />
      </Helmet>

      <LogEvent eventType={guide.logEvent.eventType} />

      <Heading as='h2' size='xl' textAlign='center' mt={16}>
        {guide.heading}
      </Heading>

      {/* Generate description */}
      {description(guide.description)}

      {/* Generate cards */}
      <VerticalTimeline layout='1-column' className='py-0'>
        {guide.cardsArray.map((el) => card(el))}
      </VerticalTimeline>
    </Box>
  )
}
