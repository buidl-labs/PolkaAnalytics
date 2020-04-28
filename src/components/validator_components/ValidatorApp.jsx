import React from "react";
import {
	Box,
	Text,
	Spinner,
	Flex,
	Divider,
	InputGroup,
	InputRightAddon,
	Input,
	Grid,
	Link,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	CloseButton,
	Heading,
	Link as ChakraLink
} from "@chakra-ui/core";
import {
	Stage,
	Layer,
	Arc,
	Line,
	Rect,
	Circle,
	Text as TextRK
} from "react-konva";
import { ApiPromise, WsProvider } from "@polkadot/api";
import WhiteCircles from "./WhiteCircles";
import { withRouter } from "react-router-dom";
import { hexToString } from "@polkadot/util";
import { Helmet } from "react-helmet";
import LogEvent from "../LogEvent";
import axios from "axios";
import ErrorMessage from "../ErrorMessage";
import Media from "react-media";
import Footer from "../Footer";

const ERA_PER_DAY = 4;
class ValidatorApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validator: props.history.location.pathname.split("/")[3].toString(),
			validatorsandintentions: props.validatorsandintentions,
			nominators: [],
			totalStaked: 0,
			stakedBySelf: 0,
			stakedByOther: 0,
			backers: 0,
			showValidatorAddress: false,
			stash: "",
			controller: "",
			name: `Validator (...${props.history.location.pathname
				.split("/")[3]
				.toString()
				.slice(-6)})`,
			isloading: true,
			totalinfo: [],
			valinfo: {},
			validatorInfo: "",
			copied: false,
			isLoaded: false,
			stakeInput: 1000,
			currentValidatorData: [],
			dailyEarning: 0,
			errorState: false,
			showInfo: true,
			noValidator: false,
			poolReward: 0,
			commission: 0
		};
		this.pathArray = window.location.href.split("/");
		this.ismounted = false;
		this.totalvalue = 0;
		this.ownvalue = 0;
	}

	componentDidMount() {
		// this.deriveInfo();
		axios
			.get(
				`https://polka-analytic-api.herokuapp.com/validatorinfo/${this.state.validator}`
			)
			.then(({ data: res }) => {
				if (res.noValidator) {
					this.setState({
						noValidator: true
					});
				}

				const currentValidator = this.props.validatorTableData.find(
					validator => validator.stashId === this.state.validator
				);
				this.setState({
					name: currentValidator.name,
					totalinfo: res.currentvalidator,
					currentValidatorData: res.currentvalidator,
					nominators: res.nominators,
					totalStaked: res.totalStaked,
					stakedBySelf: res.stakedBySelf,
					stakedByOther: res.stakedByOther,
					backers: res.backers,
					dailyEarning: (() => {
						const poolReward = res.poolReward;
						const totalStaked = res.totalStaked;
						const userStakeFraction = 1000 / (1000 + parseFloat(totalStaked));
						const dailyEarning = userStakeFraction * poolReward * ERA_PER_DAY;
						return parseFloat(dailyEarning.toFixed(3));
					})(),
					poolReward: res.poolReward,
					commission: res.commission,
					isloading: false,
					isLoaded: true
				});
			})
			.catch(err => {
				this.setState({
					errorState: true
				});
			});
	}

	handleOnMouseOver = () => {
		this.setState({ showValidatorAddress: true });
	};

	handleOnMouseOut = () => {
		this.setState({ showValidatorAddress: false });
	};

	onCopy = () => {
		if (this.ismounted) {
			this.setState({ copied: true }, () => {
				console.log("copied state set");
				setInterval(() => {
					this.setState({ copied: false });
				}, 3000);
			});
		}
	};

	render() {
		const width = window.innerWidth + 120;
		const desktopWidth = window.innerWidth - 400;
		const height = window.innerHeight - (64 + 69 + 120);
		let radius = 120;

		if (this.state.noValidator) {
			return (
				<Box maxW="960px" mx="auto" textAlign="center" mt={16}>
					<Heading as="h1" size="xl">
						Validator address not found
					</Heading>
					<Text>
						The validator you're looking for either doesn't exist or hasn't
						finished loading yet.
					</Text>
					<Text color="gray.500" mt={8}>
						If you think this is a mistake, then please report it to{" "}
						<ChakraLink
							href="mailto:bhaskar@thevantageproject.com"
							color="teal.500"
						>
							bhaskar@thevantageproject.com
						</ChakraLink>
						, we will reach out to you as soon as possible
					</Text>
					{/* <p
				style={{
					fontSize: "30px",
					fontWeight: "bold",
					margin: "0 50px"
				}}
			>
				Oops! validator's address doesn't exist, or it might not
				be activated yet.
			</p> */}
				</Box>
			);
		}

		if (this.state.errorState) {
			return <ErrorMessage />;
		}

		if (
			this.state.nominators !== undefined &&
			this.state.nominators.length > 10
		) {
			radius = 200;
		}
		let opacity = 0.3;
		let color = "#E50B7B";
		// if (this.props.intentions.includes(this.state.validator)) {
		// 	opacity = 0;
		// 	color = "yellow";
		// }
		if (this.state.isLoaded) {
			return (
				<React.Fragment>
					<Helmet>
						<title>{this.state.name} | Polka Analytics</title>
						<meta name="description" content="Validator key stats" />
					</Helmet>
					<LogEvent eventType="Validator view" />
					<Media queries={{ small: "(max-width: 500px)" }}>
						{matches =>
							matches.small ? (
								<Box width="90%" textAlign="center" mx="auto" mt={32}>
									<Text>
										We're working on mobile support for specific views, we
										apologize for the inconvenience. You can view this page on a
										larger device.
									</Text>
								</Box>
							) : (
								<React.Fragment>
									<Box textAlign="center">
										<Box
											display="flex"
											justifyContent="center"
											alignItems="center"
											flexDirection="column"
											// mt={20}
											// mb={8}
										>
											<Text fontSize="3xl" alignSelf="center">
												{this.state.name}
											</Text>
											<Link
												color="teal.500"
												href={
													"https://polkadot.js.org/apps/#/staking/query/" +
													this.state.validator
												}
												width="fit-content"
												isExternal
											>
												View on Polkadot UI
											</Link>
											<Alert
												status="info"
												display={this.state.showInfo ? "flex" : "none"}
												flexDirection="column"
												mt={4}
											>
												<Box
													as="span"
													display="flex"
													flexDirection="row"
													alignItems="end"
												>
													<AlertIcon />
													<AlertTitle mr={2}>
														Instructions to view nominator specific view
													</AlertTitle>
												</Box>
												<AlertDescription>
													Click on the nominator circles to open nominator's
													specfic view data and visualization
												</AlertDescription>
												<CloseButton
													position="absolute"
													right="8px"
													top="8px"
													onClick={() =>
														this.setState({
															...this.state,
															showInfo: !this.state.showInfo
														})
													}
												/>
											</Alert>
										</Box>
										{/* <Text mt={8} color="brand.900" opacity={this.state.copied ? 1 : 0}>
							Copied to your clipboard
						</Text> */}
									</Box>

									<Grid templateColumns="1fr 2fr" gap={2} overflowX="hidden">
										<Box
											width={350}
											height={580}
											style={{
												marginLeft: 40,
												marginTop: 30,
												boxShadow:
													"0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
												borderRadius: "10px",
												padding: "5px 10px"
											}}
										>
											<Flex flexDirection="column" alignItems="center">
												<Text
													align="center"
													mt={2}
													fontSize="2xl"
													fontWeight="semibold"
													lineHeight="short"
												>
													Key Stats
												</Text>
											</Flex>
											<Divider />
											<Flex
												flexDirection="column"
												style={{ padding: "0 20px" }}
											>
												<Text
													mt={2}
													fontSize="md"
													fontWeight="bold"
													lineHeight="short"
												>
													Stake amount
												</Text>
												<Text fontSize="md" color="gray.500">
													(change input to see potential earnings)
												</Text>
												<InputGroup>
													<Input
														placeholder="Stake Amount"
														variant="filled"
														type="number"
														min="0"
														step="0.000000000001"
														max="999999999999999"
														value={this.state.stakeInput}
														textAlign="center"
														roundedLeft="2rem"
														onChange={e => {
															const stakeAmount = isNaN(
																parseFloat(e.target.value)
															)
																? 0
																: parseFloat(e.target.value);
															const { totalStaked, poolReward } = this.state;
															const userStakeFraction =
																stakeAmount /
																(stakeAmount + parseFloat(totalStaked));
															const dailyEarning =
																userStakeFraction * poolReward * ERA_PER_DAY; //if pool reward is zero then what ?
															this.setState({
																stakeInput: stakeAmount,
																dailyEarning: dailyEarning.toFixed(3)
															});
														}}
													/>
													<InputRightAddon
														children="KSM"
														backgroundColor="teal.500"
														roundedRight="2rem"
													/>
												</InputGroup>
												<Text fontWeight="bold" mt="3" fontSize="md">
													Daily Earning
												</Text>
												<Text>
													<span
														style={{
															textTransform: "uppercase",
															fontWeight: "bold",
															color: "#E50B7B"
														}}
													>
														{this.state.dailyEarning} KSM
													</span>
												</Text>
											</Flex>
											<Divider />
											<Flex
												flexDirection="column"
												style={{ padding: "0 20px" }}
											>
												<Text fontWeight="bold">Commission</Text>
												<Text>{this.state.commission}%</Text>
											</Flex>
											<Divider />
											<Flex
												flexDirection="column"
												style={{ padding: "0 20px" }}
											>
												<Text fontWeight="bold">
													Backers{" "}
													<span style={{ color: "#718096", fontSize: 12 }}>
														(number of stakers)
													</span>
												</Text>
												<Text>{this.state.backers}</Text>
											</Flex>
											<Divider />
											<Flex
												flexDirection="column"
												style={{ padding: "0 20px" }}
											>
												<Text fontWeight="bold">Amount of stake</Text>
												<Text mt={3} fontSize="12px">
													Total
												</Text>
												<Text style={{ color: "#E50B7B", fontWeight: "bold" }}>
													{this.state.totalStaked} KSM
												</Text>
												<Text fontSize="12px">Staked by self</Text>
												<Text fontWeight="bold">
													{this.state.stakedBySelf} KSM
												</Text>
												<Text fontSize="12px">staked by others</Text>
												<Text fontWeight="bold">
													{this.state.stakedByOther} KSM
												</Text>
											</Flex>
										</Box>
										<Stage
											width={desktopWidth}
											height={height}
											draggable={true}
										>
											<Layer>
												{/* Here n is number of white circles to draw
		                	r is radius of the imaginary circle on which we have to draw white circles
		                	x,y is center of imaginary circle
		             	*/}

												<WhiteCircles
													colorMode={this.props.colorMode}
													n={this.state.nominators.length}
													r={radius}
													x={desktopWidth / 2 + 13 - 10}
													y={height / 2 + 6}
													nominators={this.state.nominators}
													history={this.props.history}
													totalinfo={this.state.totalinfo}
													valinfo={""}
												/>

												{/* Arc used to create the semicircle on the right,
		            		Rotation is used to rotate the arc drawn by 90 degrees in clockwise direction
		       			*/}
												<Arc
													x={desktopWidth - 2}
													y={height / 2}
													innerRadius={height / 2 - 25}
													outerRadius={height / 2 - 24}
													rotation={90}
													angle={180}
													stroke={
														this.props.colorMode === "light"
															? "#CBD5E0"
															: "#718096"
													}
													strokeWidth={4}
												/>
												<Circle
													x={desktopWidth - 348}
													y={height - 50}
													radius={10}
													fill="#319795"
												/>
												<TextRK
													x={desktopWidth - 325}
													y={height - 56}
													text="Nominator"
													fill={
														this.props.colorMode === "light"
															? "#1A202C"
															: "#718096"
													}
													fontSize={15}
												/>
												<Rect
													x={desktopWidth - 360}
													y={height - 30}
													width={26}
													height={15}
													fill={color}
													cornerRadius={10}
												/>
												<TextRK
													x={desktopWidth - 325}
													y={height - 30}
													text="Validator"
													fill={
														this.props.colorMode === "light"
															? "#1A202C"
															: "#718096"
													}
													fontSize={15}
												/>
												{/* Adding 6 to stating and ending y point and 24 to length of line
		            		because the upper left corner of rectangle is at width/2,height/2
		            		so mid point of rectangle becomes width/2+12,height/2+6
		         		*/}
												<Line
													points={[
														desktopWidth / 2 - 10,
														height / 2 + 6,
														desktopWidth - height / 2 + 23,
														height / 2 + 6
													]}
													fill={
														this.props.colorMode === "light"
															? "#1A202C"
															: "#FFFFFF"
													}
													stroke={
														this.props.colorMode === "light"
															? "#1A202C"
															: "#FFFFFF"
													}
													opacity={opacity}
												/>

												<TextRK
													x={desktopWidth / 2 + 25}
													y={height / 2 - 15}
													text={this.state.name}
													fill={
														this.props.colorMode === "light"
															? "#1A202C"
															: "#FFFFFF"
													}
													fontSize={15}
												/>

												<Rect
													x={desktopWidth / 2 - 10}
													y={height / 2}
													width={26}
													height={12}
													fill={color}
													cornerRadius={10}
													onMouseOver={this.handleOnMouseOver}
													onMouseOut={this.handleOnMouseOut}
												/>
											</Layer>
										</Stage>
									</Grid><Footer />
								</React.Fragment>
							)
						}
					</Media>
					{/* <Flex justifyContent="center">
						<Box
							mt={12}
							display="flex"
							justifyContent="space-between"
							width="100%"
							maxW="960px"
							alignSelf="center"
							mb={8}
						>
							<Text>Total Staked: {this.totalvalue.toFixed(3)} KSM</Text>
							<Text>
								Validator Self Stake: {this.ownvalue.toString().slice(0, 7)} KSM
							</Text>
							<Text>
								Nominator Stake: {totalBonded.toString().slice(0, 8)} KSM
							</Text>
						</Box>
					</Flex> */}
					
				</React.Fragment>
			);
		} else {
			return (
				<Box
					display="flex"
					flexDirection="column"
					position="absolute"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%)"
					alignSelf="center"
					justifyContent="center"
					textAlign="center"
					mt={-16}
					zIndex={-1}
				>
					<Spinner as="span" size="lg" alignSelf="center" />
					<Text
						mt={4}
						fontSize="xl"
						color="gray.500"
						textAlign="center"
						alignSelf="center"
					>
						Stabilizing the isotopes...
					</Text>
				</Box>
			);
		}
	}
}

export default withRouter(ValidatorApp);
