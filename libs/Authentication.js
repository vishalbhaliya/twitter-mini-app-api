function generateToken() {
  var request = require("request");
  var options = {
    method: "POST",
    url: process.env.JWT_TOKEN_URL,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.JWT_AUTH_ID,
      client_secret:
      process.env.JWT_CLIENT_SECRET,
      audience: process.env.JWT_API_AUDIENCE,
    }),
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) {
        reject(error);
      } else{
        console.log("response.body ", response.body);
        resolve(JSON.parse(response.body));
      }
    });
  })
}

module.exports = generateToken;
