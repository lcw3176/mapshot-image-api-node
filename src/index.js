const chromium = require('chrome-aws-lambda');
const axios = require('axios');


module.exports.handler = async (event, context) => {
  const WIDTH = 1000;
  const domain = "https://api.kmapshot.com";

  let response_arr = []
  await chromium.font('/opt/NotoSansKR-Regular.otf');

  let type = event.queryStringParameters.type;
  let companyType = event.queryStringParameters.companyType;
  let lng = event.queryStringParameters.lng;
  let lat = event.queryStringParameters.lat;
  let level = event.queryStringParameters.level;
  let layerMode = event.queryStringParameters.layerMode;

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,

    defaultViewport: {
      width: WIDTH,
      height: WIDTH
    },

    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.goto(domain + `/api/image/template/` + companyType + `?`
    + `layerMode=` + layerMode
    + `&lat=` + lat
    + `&level=` + level
    + `&lng=` + lng
    + `&type=` + type
    + `&companyType=` + companyType)

  await page.waitForSelector('#checker_true');

  let goal_width;

  switch (level) {
    case '1':
      goal_width = 5000;
      break;
    case '2':
      goal_width = 4000;
      break;
    case '5':
      goal_width = 5000;
      break;
    case '10':
      goal_width = 5000;
      break;
    default:
      goal_width = 0;
      break;
  }

  for (let y = 0; y < goal_width; y += WIDTH) {
    for (let x = 0; x < goal_width; x += WIDTH) {

      await page.evaluate((x, y) => {
        window.scrollBy(x, y);
      }, x, y);

      let imageBuffer = await page.screenshot({
        type: "jpeg"
      });

      let gen_uuid = uuidv4();

      await axios.post(domain + "/api/image/storage", {
        "uuid": gen_uuid,
        "base64EncodedImage": imageBuffer.toString('base64'),
      });
      
      let response = {
        "uuid": gen_uuid,
        "x": x,
        "y": y
      };

      
      response_arr.push(response);
    }
  }

  await browser.close();

  

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'api.kmapshot.com',
    },
    
    body: JSON.stringify(response_arr)
  }

}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}