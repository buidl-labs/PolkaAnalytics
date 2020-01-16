// listen on port so now.sh likes it
const { createServer } = require('http');
const fs = require('fs'),
  path = require('path'),
  puppeteer = require('puppeteer'),
  Twit = require('twit'),
  //   polkadotInfo = require('./rewardCalculation'),
  config = require('./config');
const mongoose = require('mongoose');
const Validator = require('./Validator');
// Initialize bot
const bot = new Twit(config.twitterKeys);

// const eraChange = polkadotInfo.eraChange;
// const retweet = require("./api/retweet");
// const reply = require("./api/reply");

mongoose
  .connect(
    'mongodb+srv://user:tz33yOKJ8gPnNzCb@cluster0-gtjyu.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('connected to database'))
  .catch(() => console.log('database failed to connect'));

async function getMaxPoolReward() {
  const result = await Validator.find()
    .sort('-poolReward')
    .limit(1);

  return result[0];
}

async function main() {
  console.log('Running...');
  //   console.log('validator', validator);
  const validator = await getMaxPoolReward();
  if (validator) {
    let validatorUrl =
      'https://polkanalytics.com/#/kusama/validator/' + validator.stashId;

    await takeScreenShot(
      __dirname + '/images/' + validator.stashId + '.png',
      validatorUrl,
      '.konvajs-content',
      true
    );

    fs.readdir(__dirname + '/images', (err, files) => {
      if (err) {
        throw err;
      } else {
        let images = [];
        let image = files.find(file => file === `${validator.stashId}.png`);
        images.push(image);
        uploadImage(images, validator.stashId);
      }
    });
  }
  //   const info = await polkadotInfo.info;
  // const newEraStarting = await info.newEraStarting;
  //   const maxRewardValidator = info.maxRewardValidator;
  //   console.log(maxRewardValidator);
  //   eraChange.on('newEra', async () => {
  //     if (maxRewardValidator !== '') {
  //       let validatorAddress = maxRewardValidator.address;
  //       let validatorUrl =
  //         'https://polkanalytics.com/#/kusama/validator/' +
  //         validatorAddress;
  //       await takeScreenShot(
  //         __dirname + '/images/' + validatorAddress + '.png',
  //         validatorUrl,
  //         '.konvajs-content',
  //         true
  //       );
  //       fs.readdir(__dirname + '/images', (err, files) => {
  //         if (err) {
  //           throw err;
  //         } else {
  //           let images = [];
  //           let image = files.find(file => file === `${validatorAddress}.png`);
  //           images.push(image);
  //           uploadImage(images, validatorAddress);
  //         }
  //       });
  // }
  //   });
}

main();

// This will allow the bot to run on now.sh
const server = createServer((req, res) => {
  res.writeHead(302, {
    Location: `https://twitter.com/${config.twitterConfig.username}`
  });
  res.end();
});

server.listen(3000);

// Function to take a screenshot of given URL, waiting for the element to load
async function takeScreenShot(
  outputPath,
  validatorUrl,
  waitForElement,
  fullPage
) {
  console.log('Launching chromium');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('Accessing URL...');
  await page.goto(validatorUrl);
  await page.setViewport({ width: 1920, height: 1080 });
  console.log('Waiting for page to load...');
  await page.waitForSelector(waitForElement, { timeout: 3000000 });
  await page.screenshot({ path: outputPath, fullPage: fullPage });
  console.log('Screenshot taken!');

  await browser.close();
}

function uploadImage(image, address) {
  console.log('Opening the image...');
  let image_path = path.join(__dirname, '/images/' + image);
  let imageFile = fs.readFileSync(image_path, { encoding: 'base64' });

  console.log('Uploading an image...');
  bot.post('media/upload', { media_data: imageFile }, (err, data, res) => {
    if (err) {
      throw err;
    } else {
      console.log('Image successfully uploaded!');
      console.log(data);
      bot.post('statuses/update', {
        status: `The highest rewarding validator for the previous era was ${address}. Check out daily rewards on https://polkanalytics.com`,
        media_ids: new Array(data.media_id_string)
      });
    }
  });
}
