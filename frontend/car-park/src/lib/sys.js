//TODO: install from npm

var deviceReadyPromise = new Promise(function (resolve) {
  document.addEventListener("deviceready", function () {
    resolve();
  }, false);
});

window.sys = {
  toast: function (text) {
    window.plugins.toast.showLongBottom(text)
  },
  getUserInfo: function (fields, successCallback, failCallback) {
    // fields: [ "name", "mobile", "email" ]
    deviceReadyPromise.then(function () {
      cordova.exec(function (data) {
        successCallback(JSON.parse(data))
      }, failCallback, 'Auth', 'getUserInfo', fields);
    });
  },
  getUserIdentity: function (successCallback) {
    // fields: [ "name", "mobile", "email" ]
    deviceReadyPromise.then(function () {
      cordova.exec(function (data) {
        successCallback(JSON.parse(data))
      }, function () {
        // this request will never fail
      }, 'Auth', 'getUserIdentity');
    });
  },
  requestPayment: function (options, successCallback, failCallback) {
    // options = {amountToPay, orderId, orderTitle, orderDescription}
    deviceReadyPromise.then(function () {
      cordova.exec(function (data) {
        successCallback(JSON.parse(data))
      }, failCallback, 'Auth', 'requestPayment', [options]);
    });
  },
};

/*
 * below are PC shim related code
 */

var pcShimReady = new Promise(resolve => {
  if (!window.$sysOnDevice) {
    window.$appName = window.$appName || "TEST_APP";
    loadScript("http://7xn0vy.dl1.z0.glb.clouddn.com/jsrsasign-all-min.js").then(function () {
      var rsa = new RSAKey();
      rsa.readPKCS8PrvKeyHex(b64tohex(localStorage.private_key_shim));
      window.$rsa = rsa;
      resolve();
    });
  }
});

function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var s;
    s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// shim when developing on a PC
window.sys_shim = {
  toast: function (text) {
    alert(text)
  },
  getUserInfo: function (fields, successCallback, failCallback) {
    if (confirm("授权 " + fields.join(",") + "?")) {
      var data = {};
      if (fields.indexOf("email") >= 0) {
        data["email"] = localStorage["email_shim"]
      }
      if (fields.indexOf("name") >= 0) {
        data["name"] = localStorage["name_shim"]
      }
      if (fields.indexOf("mobile") >= 0) {
        data["mobile"] = localStorage["mobile_shim"]
      }
      successCallback(data)
    } else {
      failCallback();
    }
  },
  getUserIdentity: function (successCallback) {
    pcShimReady.then(function () {
      var toSign = 'APP:' + window.$appName + ':' + (+new Date());
      var signature = hex2b64(window.$rsa.sign(toSign, "sha1"));
      successCallback({
        publicKey: localStorage['public_key_shim'],
        signature: signature,
        signedContent: toSign,
      })
    });
  },
  requestPayment: function (options, successCallback, failCallback) {
    pcShimReady.then(function () {
      var amountToPay = options.amountToPay, orderId = options.orderId,
        orderTitle = options.orderTitle, orderDescription = options.orderDescription;
      if (confirm("支付请求： " + orderTitle + "\n" + (amountToPay / 100).toFixed(2) + "元\n" + orderDescription)) {
        var toSign = JSON.stringify({
          app_name: window.$appName,
          order_id: orderId,
          order_title: orderTitle,
          order_description: orderDescription,
          timestamp: +new Date(),
          amount_to_pay: amountToPay,
        });
        successCallback({
          publicKey: localStorage['public_key_shim'],
          signature: hex2b64(window.$rsa.sign(toSign, 'sha1')),
          signedContent: toSign,
        })
      } else {
        failCallback();
      }
    });
  },
};

if (!window.$sysOnDevice) {
  if (!localStorage['email_shim']) {
    localStorage['email_shim'] = (Math.random() + "").substring(2, 10) + "@example.com";
  }
  if (!localStorage['name_shim']) {
    localStorage['name_shim'] = Math.random().toString(36).substring(7) + " " + Math.random().toString(36).substring(7);
  }
  if (!localStorage['mobile_shim']) {
    localStorage['mobile_shim'] = "1" + (Math.random() + "").substring(2, 12);
  }

  if (!localStorage['public_key_shim']) {
    localStorage['public_key_shim'] = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnNqy/RO+wg6pph7O7OfNYGksVyQWEAdB\nSYzdGX8tA6NZhd6zmAxiBpZnAiqqpGY8HIVaL4CiQyjZKiAEuMwGUXajGIPeAIeaI5pBCEIDgOE5\nzZZP4LGXEcMu5U3AYgdajLL33rv0J5iMZp7LJrtaJn6+w2AqKA5f8Zx8UmvhPdzG2hdw0GO461dX\n8bLOtOT8D6gaieb1xkY0h+zdnj4O9e91id/PIvihRAKpFngKc2y5mO0XpWzVp8+961WcqNxLkO+u\nGHI1IA6dRqBwbQ7Ymd3F90CKTxunwHFnQ/eUkeaQDF62uNibVhaj+elrwcy+XRRWE0a7tjy6HF+v\n+Np0zQIDAQAB";
  }

  if (!localStorage['private_key_shim']) {
    localStorage['private_key_shim'] = "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCc2rL9E77CDqmmHs7s581gaSxX\nJBYQB0FJjN0Zfy0Do1mF3rOYDGIGlmcCKqqkZjwchVovgKJDKNkqIAS4zAZRdqMYg94Ah5ojmkEI\nQgOA4TnNlk/gsZcRwy7lTcBiB1qMsvfeu/QnmIxmnssmu1omfr7DYCooDl/xnHxSa+E93MbaF3DQ\nY7jrV1fxss605PwPqBqJ5vXGRjSH7N2ePg7173WJ388i+KFEAqkWeApzbLmY7RelbNWnz73rVZyo\n3EuQ764YcjUgDp1GoHBtDtiZ3cX3QIpPG6fAcWdD95SR5pAMXra42JtWFqP56WvBzL5dFFYTRru2\nPLocX6/42nTNAgMBAAECggEAD7oR1jQjnTtxIRnXr4MyYWdKLdaNa7/+eMxp4sOQlNvM/xIsOaOM\nNJLh8yKqB1/EyStJtpeULV2sIIAjWRAD1ikqAyw9lxoBh25Q9O4BgeuTKxzWF3ZW6k4CprUcA/gu\nyQqstaVsvoeaFDP5tIF2cYOlxtsefvOqBQSmpnDwnY4cI0Jm5Mcm87ZX0gd4d7/AWH8ROUOmWPY5\nFFl4fH5cIH8XA1SkhpQPYL7nm9tSam/xqDBKz7XEHSfW6awdCSvCOKx3Bm/cwGEahyn+5FLyA0pf\nvASee6qp3GuZ58fOmSO4tnqA2egR+9JoBKksJOejhmw/vuWblGYG4cBcBIuzAQKBgQDN267Aj4uk\nRAHWuPQ0W7L2OIP0XAEZdUycZaICJzherpffijDQJ5C4J405+WB/NzkfNbQmrdlj76ch4PJGKdsS\nxY2b53aorQ/J4Z5+gmxh9wd/nWz2w2Txi6LxpWffRbEUbRx3vVgwZ+pWEzRM1UpDYh0FCk/KB+ln\nbJsD0zR8wQKBgQDDD1/CynIYq/VpNVgBHSakoLz/FyaWNIM8KxNiz2Mqia5T8l98dejJ85Rkhqx5\nSM9vhwcc1byrdbI/zfYloV/qgkTnB00BMzmeXGCTCezSueK9oNXHCduB64GokB5mhkjP9e8sJjQt\n2MTzv0/9nGEdW/uiajFTO/T9/4wI84TfDQKBgCzkf5OWukk0W4JMC1VvufNgF8auWb8HiZGByHbX\nvr9HK++f301Fk5XVakL+U0Dq9hYMTCEzQHk+xh/pQmxyrEfHtT4OmB3ov8yy2zGTl7c1e/kkh6K4\nscbLQNmZzLEwLZHayZ6DODw2LTBgN8OZr/xJ5TI4MXZJi2j2kkefQ48BAoGAJNXKZ6aDVVVjyrJg\nJBW1LnGMPz/H8aWJAtu/lXFEcMv/N6sVjRNXGov9Ad7MwzqUsaL2HOPf9SEMwC/Mw95tloNzL42Z\nZRifUOBw/FNrfX/M6bJtrGCYKzimC4brtsC1D1CKEfRE9kNxLfZ6zJGzZS/xnQIgvm8cHLsdXrNd\n7CECgYB2mane27zGAwp4Qi6Qlbm9qAmp5DlJtrmfFd+WIIDOEXSB9sBqGoraX1jgGkTcxfd6zGBG\n1AwZtLN7rX0LlHYiQQgPIBeOPY183W9oBree3UsHQjZws8uT98F79cRAarnb27O19fs7b35KeBt9\nI1CLRIsH7VSQKAkU4excATh1kQ==";
  }

  window.sys = window.sys_shim;
}