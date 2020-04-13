import React from "react";
import { Route, Link } from "react-router-dom";
import {
    Box,
    Heading,
	Text,
	Icon,
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionPanel,
    AccordionIcon,
    Link as ChakraLink
} from "@chakra-ui/core";
import {
	VerticalTimeline,
	VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import FAQs from "./FAQs";
import LogEvent from './LogEvent';
import Helmet from "react-helmet";
import Footer from "./Footer";
import axios from 'axios';

export default function HelpCenter() {
	
	const [data, setData] = React.useState();

	React.useEffect(async () => {
		const result = await axios(
			'https://my-json-server.typicode.com/suyanksaraswat/task/posts/',
		);
		setData(result.data);
	}, []);

	console.log('[mock-server] Data - ', data);

	return (
			<React.Fragment>
				{/* Help Center Home */}
				<Helmet>
					<title>Polka Analytics Help Center</title>
					<meta name="description" content="Validator key stats" />
				</Helmet>
				<LogEvent eventType="Help center view" />
				<Route exact path="/help-center">
					<Heading as="h2" size="xl" textAlign="center" mt={16}>
						Help Center
					</Heading>
					{/* <Text fontSize="2xl" textAlign="center">
						What are you looking for?
					</Text> */}
					{/* Search Input */}
					{/* <Flex flexDirection="column" alignItems="center">
						<InputGroup mt={8}>
							<Input
								placeholder="Search the documentation"
								variant="filled"
								roundedLeft="2rem"
							/>
							<InputRightAddon
								as={Button}
								children={<Icon name="search" 
									backgroundColor="teal.500"
									roundedRight="2rem"
									px={8}
								/>
							</InputGroup>
						</Flex> */}

						{/* Guides Section */}
						<Text fontSize="2xl" textAlign="center" mt={16}>
							Guides 
						</Text>
						{/* List of guides */}
						{data && data.map(data => (
						<AccordionItem key={data.id} py={4}>
							<AccordionHeader>
								<Box flex="1" textAlign="left">
									<Heading size="md">
										{data.title}
									</Heading>
									{data.des}
								</Box>
								<AccordionIcon />
							</AccordionHeader>
							<AccordionPanel pb={4}>
								{data.steps.map(step => (
								<VerticalTimeline layout="1-column" className="py-0">
									<VerticalTimelineElement
										contentStyle={{
										background: "transparent",
										paddingTop: 0,
										borderRadius: 0
										}}
										contentArrowStyle={{
										borderRight: "7px solid transparent"
										}}
										icon={
										<Heading as="h5" size="sm">
											{step.id}
										</Heading>
										}
										iconStyle={{
										background: "#319795",
										display: "flex",
										justifyContent: "center",
										alignItems: "center"
										}}
									>
										<Heading as="h3" size="lg">
											{step.title}
										</Heading>
										<Text>
											{step.des}
										</Text>
									</VerticalTimelineElement>
								</VerticalTimeline>
								))}
							</AccordionPanel>
						</AccordionItem>
						))}

						{/* FAQs Section */}
						<Text fontSize="2xl" textAlign="center" mt={16} mb={8}>
								FAQs
							</Text>
							<FAQs />

							{/* Contact Us */}
							<Box my={16} textAlign="center">
								<Text fontSize="xl">Can't find what you're looking for?</Text>
								<ChakraLink
									href="mailto:sahil@thevantageproject.com"
									color="teal.500"
								>
									Contact Us
								</ChakraLink>
							</Box>
						</Route>

						<Footer />
	</React.Fragment>
	);
	}
