const cron = require("node-cron");
const request = require("request");
// const accountSid = "";
// const authToken = "";
const client = require("twilio")(accountSid, authToken);

const formData = {
  lat: "28.5363974",
  lng: "77.27057889999999",
  city: "Hyderabad",
  av: "5.1",
  mid: "NHO00013701",
  date: "2018-10-11",
  userid: "0",
  did: "22442454141538646376919",
  pt: "WEBSITE"
};

cron.schedule("*/1 * * * *", () => {
  console.log("running a task every 1 minute");

  request.post(
    {
      url: "https://api1.pvrcinemas.com/PVRCinemasCMS/api/content/msessionsnew",
      formData: formData
    },
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error("upload failed:", err);
      }
      var info = JSON.parse(body);
      console.log(
        "Upload successful!  Server responded with:",
        info.output.cinemas.map(cn => cn.cn)
      );

      var cinemas = info.output.cinemas.map(cn => cn.cn);

      var forumExists = cinemas.some(
        cinema => cinema.toLowerCase().indexOf("kukatpally") != -1
      );

      console.log("FORUM MALL EXISTS: ", forumExists);

      if (forumExists) makeCall();
    }
  );
});

function makeCall() {
  client.calls
    .create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to: "+919652341380",
      from: "+14242767214"
    })
    .then(call => console.log(call.sid))
    .done();
}
