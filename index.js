const chromium = require('chrome-aws-lambda');

module.exports.handler = async (event, context) => {

  await chromium.font('/opt/NotoSansKR-Regular.otf');
  
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.goto("https://www.naver.com");

  const imageBuffer = await page.screenshot({
      type: "jpeg",
      fullPage: true
  });

  await browser.close();


  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type': 'image/jpeg'
    },

    body: imageBuffer.toString('base64'),
    isBase64Encoded: true,
  }

}
