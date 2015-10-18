// instructions:
// - host a copy of callback.html and odauth.js on your domain.
// - embed odauth.js in your app like this:
//   <script id="odauth" src="odauth.js"
//           clientId="YourClientId" scopes="ScopesYouNeed"
//           redirectUri="YourUrlForCallback.html"></script>
// - define the onAuthenticated(token) function in your app to receive the auth token.
// - call odauth() to begin, as well as whenever you need an auth token
//   to make an API call. if you're making an api call in response to a user's
//   click action, call odAuth(true), otherwise just call odAuth(). the difference
//   is that sometimes odauth needs to pop up a window so the user can sign in,
//   grant your app permission, etc. the pop up can only be launched in response
//   to a user click, otherwise the browser's popup blocker will block it. when
//   odauth isn't called in click mode, it'll put a sign-in button at the top of
//   your page for the user to click. when it's done, it'll remove that button.
//
// how it all works:
// when you call odauth(), we first check if we have the user's auth token stored
// in a cookie. if so, we read it and immediately call your onAuthenticated() method.
// if we can't find the auth cookie, we need to pop up a window and send the user
// to Microsoft Account so that they can sign in or grant your app the permissions
// it needs. depending on whether or not odauth() was called in response to a user
// click, it will either pop up the auth window or display a sign-in button for
// the user to click (which results in the pop-up). when the user finishes the
// auth flow, the popup window redirects back to your hosted callback.html file,
// which calls the onAuthCallback() method below. it then sets the auth cookie
// and calls your app's onAuthenticated() function, passing in the optional 'window'
// argument for the popup window. your onAuthenticated function should close the
// popup window if it's passed in.
//
// subsequent calls to odauth() will usually complete immediately without the
// popup because the cookie is still fresh.

var token_string = 'EwCAAq1DBAAUGCCXc8wU/zFu9QnLdZXy+YnElFkAAeZnkdqfX4jBhulhlx7Tr2BDbg9ZDFleWx33w/0URpGkw+A7WO7kMkx9+eeT9c8X3+snlSQPZVuxNicNwxLHnoEDHe5r9SArj0xLKsnijO1kz1GdXtHBwwTShxsvyTLDq+uf+e5HdUBZlMIMkYPRHawMGgdZ++xZ1Ddx3TPHZkG6RBUkE/xzi6gO5ZXovzgc3JDn3pgI0n0uMqkgwNP2deIA2AvWGyk2i/hJt9yHSndGegDw/g4ps5WBoNDTbMDTjRZCXFSb12ZwAUVMHNzPJOP11TnM2xPZBJSMN2sSaii9kP4/s3fGKLm5VKJVrDm+0uzOwsJiq35N4TDBzMB0q5IDZgAACHQJ74zHVeehUAEjFXDsMcfckIGhH+w8Q9fhCHVaPZfoeMvY7YI0XPqTe+dK0FOcJ4w1rHUvOjbGMVIooUW+kfXeQ/pF6r7JYx0v4WYHPOnMVJ26XlvDY1woWeQIW7XF+90m5lHt7eQQGmKSpUgOCa5AIQaiVRB4infG/obpRFGMEhJFhrOucT8IN4D85zTnp7Q5tdw6tktOcopxtpf+coVeLZwxWCCjClnWdz2Rc8y7wIkZD9xMmZ/D8E8r6yfn08BTpZDMxrwveCTS2bipt5hRu987cBV20r2PCh6NIg54ZcOGoCCy4ceCo2/ySsk7n1jyd4fdE0Gxjn5YePbx3xKmVycRCROlsxvSYWCSsVaFs97c54TwPX0ph86140i484Zy7d9gCnU/OaNX0Whgc1UHOUxX0QuQxkM36pcFmwhGomxkBXD2oU9J5Y1t4cDD/2xkOY7XNlS9x6xoAQ==';

function odauth(wasClicked) {
  var token = token_string;
  if (token) {
    onAuthenticated(token);
  }
  else if (wasClicked) {
    challengeForAuth();
  }
  else {
    showLoginButton();
  }
}

function onAuthCallback() {
  var authInfo = getAuthInfoFromUrl();
  var token = token_string;
  var expiry = parseInt(authInfo["expires_in"]);
  setCookie(token, expiry);
  window.opener.onAuthenticated(token, window);
}

function getAuthInfoFromUrl() {
  if (window.location.hash) {
    var authResponse = window.location.hash.substring(1);
    var authInfo = JSON.parse(
      '{"' + authResponse.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function(key, value) { return key === "" ? value : decodeURIComponent(value); });
    return authInfo;
  }
  else {
    alert("failed to receive auth token");
  }
}

function getTokenFromCookie() {
  var cookies = document.cookie;
  var name = "odauth=";
  var start = cookies.indexOf(name);
  if (start >= 0) {
    start += name.length;
    var end = cookies.indexOf(';', start);
    if (end < 0) {
      end = cookies.length;
    }
    else {
      postCookie = cookies.substring(end);
    }

    var value = cookies.substring(start, end);
    return value;
  }

  return "";
}

function setCookie(token, expiresInSeconds) {
  var expiration = new Date();
  expiration.setTime(expiration.getTime() + expiresInSeconds * 1000);
  var cookie = "odauth=" + token +"; path=/; expires=" + expiration.toUTCString();

  if (document.location.protocol.toLowerCase() == "https") {
    cookie = cookie + ";secure";
  }

  document.cookie = cookie;
}

function getAppInfo() {
  var scriptTag = document.getElementById("odauth");
  if (!scriptTag) {
    alert("the script tag for odauth.js should have its id set to 'odauth'");
  }

  var clientId = scriptTag.getAttribute("clientId");
  if (!clientId) {
    alert("the odauth script tag needs a clientId attribute set to your application id");
  }

  var scopes = scriptTag.getAttribute("scopes");
  if (!scopes) {
    alert("the odauth script tag needs a scopes attribute set to the scopes your app needs");
  }

  var redirectUri = scriptTag.getAttribute("redirectUri");
  if (!redirectUri) {
    alert("the odauth script tag needs a redirectUri attribute set to your redirect landing url");
  }

  var appInfo = {
    "clientId": clientId,
    "scopes": scopes,
    "redirectUri": redirectUri
  };

  return appInfo;
}

function showLoginButton() {
  if (typeof showCustomLoginButton === "function") {
    showCustomLoginButton(true);
    return;
  }

  var loginText = document.createElement('a');
  loginText.href = "#";
  loginText.id = "loginText";
  loginText.onclick = challengeForAuth;
  loginText.innerText = "[sign in]";
  document.body.insertBefore(loginText, document.body.children[0]);
}

function removeLoginButton() {
  if (typeof showCustomLoginButton === "function") {
    showCustomLoginButton(false);
    return;
  }

  var loginText = document.getElementById("loginText");
  if (loginText) {
    document.body.removeChild(loginText);
  }
}

function challengeForAuth() {
  var appInfo = getAppInfo();
  var url =
    "https://login.live.com/oauth20_authorize.srf" +
    "?client_id=" + appInfo.clientId +
    "&scope=" + encodeURIComponent(appInfo.scopes) +
    "&response_type=token" +
    "&redirect_uri=" + encodeURIComponent(appInfo.redirectUri);
  popup(url);
}

function popup(url) {
  var width = 525,
      height = 525,
      screenX = window.screenX,
      screenY = window.screenY,
      outerWidth = window.outerWidth,
      outerHeight = window.outerHeight;

  var left = screenX + Math.max(outerWidth - width, 0) / 2;
  var top = screenY + Math.max(outerHeight - height, 0) / 2;

  var features = [
              "width=" + width,
              "height=" + height,
              "top=" + top,
              "left=" + left,
              "status=no",
              "resizable=yes",
              "toolbar=no",
              "menubar=no",
              "scrollbars=yes"];
  var popup = window.open(url, "oauth", features.join(","));
  if (!popup) {
    alert("failed to pop up auth window");
  }

  popup.focus();
}
