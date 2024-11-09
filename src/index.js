const axios = require('axios');

module.exports.handler = async (event, context) => {
  
    
    let layers = event.queryStringParameters.layer;
    
    let yMin = event.queryStringParameters.ymin;
    let xMin = event.queryStringParameters.xmin;
    let yMax = event.queryStringParameters.ymax;  
    let xMax = event.queryStringParameters.xmax;
    let crs = event.queryStringParameters.crs;
    
    let height = event.queryStringParameters.height;
    
    let url =  "http://api.vworld.kr/req/wms?" 
                + "SERVICE=WMS&"
                + "REQUEST=GetMap&"
                + "VERSION=1.3.0&"
                + "LAYERS=" + layers + "&"
                + "STYLES=" + layers + "&"
                + "CRS=" + crs + "&"
                + "BBOX=" +  xMin  + "," + yMin + "," + xMax + "," + yMax + "&"
                + "WIDTH=" + height + "&"
                + "HEIGHT=" + height + "&"
                + "FORMAT=image/png&"
                + "TRANSPARENT=true&"
                + "BGCOLOR=0xFFFFFF&"
                + "EXCEPTIONS=application/json&"
                + "KEY=키값&"
                + "DOMAIN=https://kmapshot.com"
    
    let image = await axios.get(url, 
            { responseType: 'arraybuffer' })
        .then((response) => Buffer.from(response.data, 'binary').toString('base64'))
   
    const response = {
        statusCode: 200,
        body: image,
        isBase64Encoded: true,
        headers: {
          "Content-Type": "image/png"
        },
    
    };
    
    return response;

};

