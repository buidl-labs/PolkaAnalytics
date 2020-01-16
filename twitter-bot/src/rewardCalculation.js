// const { ApiPromise, WsProvider } = require("@polkadot/api");
// const EventEmitter = require("events");
// const ERA_PER_DAY = 4;
// let stakeAmount = 1000;

// let previousReward = 0;

// const eraChange = new EventEmitter();

// async function main() {
// 	const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io");
// 	const api = await ApiPromise.create({ provider: wsProvider });
// 	const getRewardEvents = async () => {
// 		console.log("getRewardEvents running...");
// 		const rewardEventsList = await fetch(
// 			"https://polkascan.io/kusama-cc3/api/v1/event?&filter[module_id]=staking&filter[event_id]=Reward&page[size]=10"
// 		);
// 		const rewardEventsListJSON = await rewardEventsList.json();
// 		const rewardEvents = await rewardEventsListJSON.data;
// 		previousReward = await rewardEvents[0].attributes.attributes[0].value;
// 		const endOfEraBlockHashes = await Promise.all(
// 			rewardEvents.map(async event => {
// 				const eventInfoJSON = await fetch(
// 					`https://polkascan.io/kusama-cc3/api/v1/block/${event.attributes
// 						.block_id - 1}?include=transactions,inherents,events,logs`
// 				);
// 				const eventInfo = await eventInfoJSON.json();
// 				const blockHash = eventInfo.data.attributes.parent_hash;
// 				return blockHash;
// 			})
// 		);
// 		return endOfEraBlockHashes;
// 	};
// 	const endOfEraBlocks = await getRewardEvents();
// 	const validators = await Promise.all(
// 		endOfEraBlocks.map(async block => {
// 			const eraPointsArray = await api.query.staking.currentEraPointsEarned.at(
// 				`${block}`
// 			);
// 			const validatorsArray = await api.query.staking.currentElected.at(
// 				`${block}`
// 			);
// 			const validators = eraPointsArray.individual.map((eraPoints, index) => ({
// 				address: validatorsArray[index].toString(),
// 				eraPoints: eraPoints.toNumber(),
// 				eraPointsTotal: eraPointsArray.total.toNumber()
// 			}));
// 			return validators;
// 		})
// 	);
// 	let validatorObj = {};

// 	validators.forEach(curr => {
// 		curr.forEach(validator => {
// 			validatorObj[validator.address] = {
// 				address: validator.address,
// 				points: [],
// 				totalStake: "",
// 				commission: "",
// 				dailyEarning: ""
// 			};
// 		});
// 	});

// 	validators.forEach(curr => {
// 		curr.forEach(validator => {
// 			validatorObj[validator.address].points.push(
// 				validator.eraPoints / validator.eraPointsTotal
// 			);
// 		});
// 	});

// 	validatorData = await Promise.all(
// 		Object.keys(validatorObj).map(async (validator, index) => {
// 			const validatorPoolReward =
// 				((validatorObj[validator].points.reduce((acc, curr) => acc + curr, 0) /
// 					validatorObj[validator].points.length) *
// 					previousReward) /
// 				10 ** 12;
// 			const stakeInfo = await api.derive.staking.account(validator.toString());
// 			const totalStake =
// 				stakeInfo !== undefined
// 					? stakeInfo.stakers.total.toString() / 10 ** 12
// 					: undefined;
// 			const commissionInfo = await api.query.staking.validators(validator);
// 			const commission = commissionInfo[0].commission.toNumber() / 10 ** 7;
// 			const userStakeFraction = stakeAmount / (stakeAmount + totalStake);
// 			const poolReward = isNaN(validatorPoolReward)
// 				? "Not enough data"
// 				: (1 - commission / 100) * validatorPoolReward;
// 			const dailyEarning = userStakeFraction * poolReward * ERA_PER_DAY;
// 			validatorObj[validator].totalStake = totalStake;
// 			validatorObj[validator].commission = commission;
// 			validatorObj[validator].dailyEarning = dailyEarning;
// 			return validatorObj[validator];
// 		})
// 	);

// 	const currentValidators = await api.query.staking.currentElected();
// 	const filteredData = validatorData.filter(validator =>
// 		currentValidators.includes(validator.address)
// 	);
// 	const maxReward = Math.max.apply(
// 		Math,
// 		filteredData.map(validator => {
// 			return validator.dailyEarning;
// 		})
// 	);
// 	const maxRewardValidator = filteredData.find(
// 		validator => validator.dailyEarning === maxReward
// 	);
// 	let previousEraIndex = await api.query.staking.currentEra();
// 	api.query.staking.currentEra(current => {
// 		const change = current.sub(previousEraIndex);
// 		if (!change.isZero()) {
// 			console.log("era change");
// 			previousEraIndex = current;
// 			eraChange.emit("newEra");
// 		} else console.log("no change");
// 	});
// 	return {
// 		maxRewardValidator: maxRewardValidator,
// 		eraChange: eraChange
// 	};
// }

// eraChange.on("newEra", () => {
// 	main();
// });

// module.exports = {
// 	info: main(),
// 	eraChange: eraChange
// };
