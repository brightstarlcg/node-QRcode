// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = "85a4648bbd2739257397";
const clientSecret = "8a6eae8c03bbafa9b5123245a05cb210cd72e1f1";

const Koa = require("koa");
const path = require("path");
const serve = require("koa-static");
const route = require("koa-route");
const axios = require("axios");

const app = new Koa();

const main = serve(path.join(__dirname + "/public"));

const oauth = async (ctx) => {
    // code是githup返回到开始授权的回调地址的http://localhost:8080/oauth/redirect
  const requestToken = ctx.request.query.code;
  console.log("authorization code:", requestToken);
  // 通过id和secret拿到code码再去获取accessToken
  const tokenResponse = await axios({
    method: "post",
    url:
      "https://github.com/login/oauth/access_token?" +
      `client_id=${clientID}&` +
      `client_secret=${clientSecret}&` +
      `code=${requestToken}`,
    headers: {
      accept: "application/json",
    },
  });

  const accessToken = tokenResponse.data.access_token;
  console.log(`access token: ${accessToken}`);
//拿到token 去请求githup的基本信息
  const result = await axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      accept: "application/json",
      Authorization: `token ${accessToken}`,
    },
  });
//   从githup上拿到个人基本信息
//   console.log(result.data);
  const name = result.data.login;
//重定向到登录界面 返回头会有location
  ctx.response.redirect(`/welcome.html??name=${name}`);
};

app.use(main);
app.use(route.get("/oauth/redirect", oauth));
console.log("启动node项目");
app.listen(8080);
