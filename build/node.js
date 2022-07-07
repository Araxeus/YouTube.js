"use strict";
/* eslint-disable */
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// node_modules/uuid/dist/rng.js
var require_rng = __commonJS({
  "node_modules/uuid/dist/rng.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = rng;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var rnds8Pool = new Uint8Array(256);
    var poolPtr = rnds8Pool.length;
    function rng() {
      if (poolPtr > rnds8Pool.length - 16) {
        _crypto.default.randomFillSync(rnds8Pool);
        poolPtr = 0;
      }
      return rnds8Pool.slice(poolPtr, poolPtr += 16);
    }
  }
});

// node_modules/uuid/dist/regex.js
var require_regex = __commonJS({
  "node_modules/uuid/dist/regex.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/validate.js
var require_validate = __commonJS({
  "node_modules/uuid/dist/validate.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _regex = _interopRequireDefault(require_regex());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function validate(uuid) {
      return typeof uuid === "string" && _regex.default.test(uuid);
    }
    var _default = validate;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/stringify.js
var require_stringify = __commonJS({
  "node_modules/uuid/dist/stringify.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var byteToHex = [];
    for (let i = 0; i < 256; ++i) {
      byteToHex.push((i + 256).toString(16).substr(1));
    }
    function stringify(arr, offset = 0) {
      const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
      if (!(0, _validate.default)(uuid)) {
        throw TypeError("Stringified UUID is invalid");
      }
      return uuid;
    }
    var _default = stringify;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/v1.js
var require_v1 = __commonJS({
  "node_modules/uuid/dist/v1.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _stringify = _interopRequireDefault(require_stringify());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var _nodeId;
    var _clockseq;
    var _lastMSecs = 0;
    var _lastNSecs = 0;
    function v1(options, buf, offset) {
      let i = buf && offset || 0;
      const b = buf || new Array(16);
      options = options || {};
      let node = options.node || _nodeId;
      let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
      if (node == null || clockseq == null) {
        const seedBytes = options.random || (options.rng || _rng.default)();
        if (node == null) {
          node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
        }
        if (clockseq == null) {
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
        }
      }
      let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
      let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
      const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
      if (dt < 0 && options.clockseq === void 0) {
        clockseq = clockseq + 1 & 16383;
      }
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
        nsecs = 0;
      }
      if (nsecs >= 1e4) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
      }
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
      msecs += 122192928e5;
      const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
      b[i++] = tl >>> 24 & 255;
      b[i++] = tl >>> 16 & 255;
      b[i++] = tl >>> 8 & 255;
      b[i++] = tl & 255;
      const tmh = msecs / 4294967296 * 1e4 & 268435455;
      b[i++] = tmh >>> 8 & 255;
      b[i++] = tmh & 255;
      b[i++] = tmh >>> 24 & 15 | 16;
      b[i++] = tmh >>> 16 & 255;
      b[i++] = clockseq >>> 8 | 128;
      b[i++] = clockseq & 255;
      for (let n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }
      return buf || (0, _stringify.default)(b);
    }
    var _default = v1;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/parse.js
var require_parse = __commonJS({
  "node_modules/uuid/dist/parse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function parse(uuid) {
      if (!(0, _validate.default)(uuid)) {
        throw TypeError("Invalid UUID");
      }
      let v;
      const arr = new Uint8Array(16);
      arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
      arr[1] = v >>> 16 & 255;
      arr[2] = v >>> 8 & 255;
      arr[3] = v & 255;
      arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
      arr[5] = v & 255;
      arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
      arr[7] = v & 255;
      arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
      arr[9] = v & 255;
      arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
      arr[11] = v / 4294967296 & 255;
      arr[12] = v >>> 24 & 255;
      arr[13] = v >>> 16 & 255;
      arr[14] = v >>> 8 & 255;
      arr[15] = v & 255;
      return arr;
    }
    var _default = parse;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/v35.js
var require_v35 = __commonJS({
  "node_modules/uuid/dist/v35.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = _default;
    exports2.URL = exports2.DNS = void 0;
    var _stringify = _interopRequireDefault(require_stringify());
    var _parse = _interopRequireDefault(require_parse());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function stringToBytes(str) {
      str = unescape(encodeURIComponent(str));
      const bytes = [];
      for (let i = 0; i < str.length; ++i) {
        bytes.push(str.charCodeAt(i));
      }
      return bytes;
    }
    var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    exports2.DNS = DNS;
    var URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    exports2.URL = URL2;
    function _default(name, version, hashfunc) {
      function generateUUID(value, namespace, buf, offset) {
        if (typeof value === "string") {
          value = stringToBytes(value);
        }
        if (typeof namespace === "string") {
          namespace = (0, _parse.default)(namespace);
        }
        if (namespace.length !== 16) {
          throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
        }
        let bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 15 | version;
        bytes[8] = bytes[8] & 63 | 128;
        if (buf) {
          offset = offset || 0;
          for (let i = 0; i < 16; ++i) {
            buf[offset + i] = bytes[i];
          }
          return buf;
        }
        return (0, _stringify.default)(bytes);
      }
      try {
        generateUUID.name = name;
      } catch (err) {
      }
      generateUUID.DNS = DNS;
      generateUUID.URL = URL2;
      return generateUUID;
    }
  }
});

// node_modules/uuid/dist/md5.js
var require_md5 = __commonJS({
  "node_modules/uuid/dist/md5.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function md5(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("md5").update(bytes).digest();
    }
    var _default = md5;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/v3.js
var require_v3 = __commonJS({
  "node_modules/uuid/dist/v3.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _md = _interopRequireDefault(require_md5());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v3 = (0, _v.default)("v3", 48, _md.default);
    var _default = v3;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/v4.js
var require_v4 = __commonJS({
  "node_modules/uuid/dist/v4.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _stringify = _interopRequireDefault(require_stringify());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function v4(options, buf, offset) {
      options = options || {};
      const rnds = options.random || (options.rng || _rng.default)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }
        return buf;
      }
      return (0, _stringify.default)(rnds);
    }
    var _default = v4;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/sha1.js
var require_sha1 = __commonJS({
  "node_modules/uuid/dist/sha1.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function sha1(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("sha1").update(bytes).digest();
    }
    var _default = sha1;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/v5.js
var require_v5 = __commonJS({
  "node_modules/uuid/dist/v5.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _sha = _interopRequireDefault(require_sha1());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v5 = (0, _v.default)("v5", 80, _sha.default);
    var _default = v5;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/nil.js
var require_nil = __commonJS({
  "node_modules/uuid/dist/nil.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _default = "00000000-0000-0000-0000-000000000000";
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/version.js
var require_version = __commonJS({
  "node_modules/uuid/dist/version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function version(uuid) {
      if (!(0, _validate.default)(uuid)) {
        throw TypeError("Invalid UUID");
      }
      return parseInt(uuid.substr(14, 1), 16);
    }
    var _default = version;
    exports2.default = _default;
  }
});

// node_modules/uuid/dist/index.js
var require_dist = __commonJS({
  "node_modules/uuid/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "v1", {
      enumerable: true,
      get: function() {
        return _v.default;
      }
    });
    Object.defineProperty(exports2, "v3", {
      enumerable: true,
      get: function() {
        return _v2.default;
      }
    });
    Object.defineProperty(exports2, "v4", {
      enumerable: true,
      get: function() {
        return _v3.default;
      }
    });
    Object.defineProperty(exports2, "v5", {
      enumerable: true,
      get: function() {
        return _v4.default;
      }
    });
    Object.defineProperty(exports2, "NIL", {
      enumerable: true,
      get: function() {
        return _nil.default;
      }
    });
    Object.defineProperty(exports2, "version", {
      enumerable: true,
      get: function() {
        return _version.default;
      }
    });
    Object.defineProperty(exports2, "validate", {
      enumerable: true,
      get: function() {
        return _validate.default;
      }
    });
    Object.defineProperty(exports2, "stringify", {
      enumerable: true,
      get: function() {
        return _stringify.default;
      }
    });
    Object.defineProperty(exports2, "parse", {
      enumerable: true,
      get: function() {
        return _parse.default;
      }
    });
    var _v = _interopRequireDefault(require_v1());
    var _v2 = _interopRequireDefault(require_v3());
    var _v3 = _interopRequireDefault(require_v4());
    var _v4 = _interopRequireDefault(require_v5());
    var _nil = _interopRequireDefault(require_nil());
    var _version = _interopRequireDefault(require_version());
    var _validate = _interopRequireDefault(require_validate());
    var _stringify = _interopRequireDefault(require_stringify());
    var _parse = _interopRequireDefault(require_parse());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  }
});

// lib/utils/Constants.js
var require_Constants = __commonJS({
  "lib/utils/Constants.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      URLS: {
        YT_BASE: "https://www.youtube.com",
        YT_MUSIC_BASE: "https://music.youtube.com",
        YT_SUGGESTIONS: "https://suggestqueries.google.com/complete/",
        API: {
          BASE: "https://youtubei.googleapis.com",
          PRODUCTION: "https://youtubei.googleapis.com/youtubei/",
          STAGING: "https://green-youtubei.sandbox.googleapis.com/youtubei/",
          RELEASE: "https://release-youtubei.sandbox.googleapis.com/youtubei/",
          TEST: "https://test-youtubei.sandbox.googleapis.com/youtubei/",
          CAMI: "http://cami-youtubei.sandbox.googleapis.com/youtubei/",
          UYTFE: "https://uytfe.sandbox.google.com/youtubei/"
        }
      },
      OAUTH: {
        SCOPE: "http://gdata.youtube.com https://www.googleapis.com/auth/youtube-paid-content",
        GRANT_TYPE: "http://oauth.net/grant_type/device/1.0",
        MODEL_NAME: "ytlr::",
        HEADERS: {
          "accept": "*/*",
          "origin": "https://www.youtube.com",
          "user-agent": "Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version",
          "content-type": "application/json",
          "referer": "https://www.youtube.com/tv",
          "accept-language": "en-US"
        },
        REGEX: {
          AUTH_SCRIPT: /<script id="base-js" src="(.*?)" nonce=".*?"><\/script>/,
          CLIENT_IDENTITY: /.+?={};var .+?={clientId:"(?<client_id>.+?)",.+?:"(?<client_secret>.+?)"},/
        }
      },
      CLIENTS: {
        WEB: {
          NAME: "WEB"
        },
        YTMUSIC: {
          NAME: "WEB_REMIX",
          VERSION: "1.20211213.00.00"
        },
        ANDROID: {
          NAME: "ANDROID",
          VERSION: "17.17.32"
        }
      },
      STREAM_HEADERS: {
        "accept": "*/*",
        "connection": "keep-alive",
        "origin": "https://www.youtube.com",
        "referer": "https://www.youtube.com",
        "DNT": "?1"
      },
      INNERTUBE_HEADERS_BASE: {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json"
      },
      METADATA_KEYS: [
        "embed",
        "view_count",
        "average_rating",
        "allow_ratings",
        "length_seconds",
        "channel_id",
        "channel_url",
        "external_channel_id",
        "is_live_content",
        "is_family_safe",
        "is_unlisted",
        "is_private",
        "has_ypc_metadata",
        "category",
        "owner_channel_name",
        "publish_date",
        "upload_date",
        "keywords",
        "available_countries",
        "owner_profile_url"
      ],
      BLACKLISTED_KEYS: [
        "is_owner_viewing",
        "is_unplugged_corpus",
        "is_crawlable",
        "author"
      ],
      ACCOUNT_SETTINGS: {
        SUBSCRIPTIONS: "NOTIFICATION_SUBSCRIPTION_NOTIFICATIONS",
        RECOMMENDED_VIDEOS: "NOTIFICATION_RECOMMENDATION_WEB_CONTROL",
        CHANNEL_ACTIVITY: "NOTIFICATION_COMMENT_WEB_CONTROL",
        COMMENT_REPLIES: "NOTIFICATION_COMMENT_REPLY_OTHER_WEB_CONTROL",
        USER_MENTION: "NOTIFICATION_USER_MENTION_WEB_CONTROL",
        SHARED_CONTENT: "NOTIFICATION_RETUBING_WEB_CONTROL",
        PLAYLISTS_PRIVACY: "PRIVACY_DISCOVERABLE_SAVED_PLAYLISTS",
        SUBSCRIPTIONS_PRIVACY: "PRIVACY_DISCOVERABLE_SUBSCRIPTIONS"
      },
      BASE64_DIALECT: {
        NORMAL: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""),
        REVERSE: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("")
      },
      SIG_REGEX: {
        ACTIONS: /;.{2}\.(?<name>.{2})\(.*?,(?<param>.*?)\)/g,
        FUNCTIONS: /(?<name>.{2}):function\(.*?\){(.*?)}/g
      },
      NTOKEN_REGEX: {
        CALLS: /c\[(.*?)\]\((.+?)\)/g,
        PLACEHOLDERS: /c\[(.*?)\]=c/g,
        FUNCTIONS: /d\.push\(e\)|d\.reverse\(\)|d\[0\]\)\[0\]\)|f=d\[0];d\[0\]|d\.length;d\.splice\(e,1\)|function\(\){for\(var|function\(d,e,f\){var|function\(d\){for\(var|reverse\(\)\.forEach|unshift\(d\.pop\(\)\)|function\(d,e\){for\(var f/
      },
      FUNCS: {
        PUSH: "d.push(e)",
        REVERSE_1: "d.reverse()",
        REVERSE_2: "function(d){for(var",
        SPLICE: "d.length;d.splice(e,1)",
        SWAP0_1: "d[0])[0])",
        SWAP0_2: "f=d[0];d[0]",
        ROTATE_1: "reverse().forEach",
        ROTATE_2: "unshift(d.pop())",
        BASE64_DIA: "function(){for(var",
        TRANSLATE_1: "function(d,e){for(var f",
        TRANSLATE_2: "function(d,e,f){var"
      }
    };
  }
});

// node_modules/user-agents/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/user-agents/dist/index.js"(exports2, module2) {
    !function(e, t) {
      typeof exports2 == "object" && typeof module2 == "object" ? module2.exports = t() : typeof define == "function" && define.amd ? define("user-agents", [], t) : typeof exports2 == "object" ? exports2["user-agents"] = t() : e["user-agents"] = t();
    }(global, function() {
      return (() => {
        var e = { 442: (e2, t2, i2) => {
          "use strict";
          var o;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = void 0;
          var n = ((o = i2(899)) && o.__esModule ? o : { default: o }).default;
          t2.default = n, e2.exports = t2.default;
        }, 899: (e2, t2, i2) => {
          "use strict";
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = void 0;
          var o = p(i2(465)), n = p(i2(932));
          let r;
          function p(e3) {
            return e3 && e3.__esModule ? e3 : { default: e3 };
          }
          function c(e3, t3) {
            return !t3 || typeof t3 != "object" && typeof t3 != "function" ? a(e3) : t3;
          }
          function a(e3) {
            if (e3 === void 0)
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e3;
          }
          function l(e3) {
            var t3 = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
            return (l = function(e4) {
              if (e4 === null || (i3 = e4, Function.toString.call(i3).indexOf("[native code]") === -1))
                return e4;
              var i3;
              if (typeof e4 != "function")
                throw new TypeError("Super expression must either be null or a function");
              if (t3 !== void 0) {
                if (t3.has(e4))
                  return t3.get(e4);
                t3.set(e4, o2);
              }
              function o2() {
                return g(e4, arguments, d(this).constructor);
              }
              return o2.prototype = Object.create(e4.prototype, { constructor: { value: o2, enumerable: false, writable: true, configurable: true } }), s(o2, e4);
            })(e3);
          }
          function g(e3, t3, i3) {
            return (g = h() ? Reflect.construct : function(e4, t4, i4) {
              var o2 = [null];
              o2.push.apply(o2, t4);
              var n2 = new (Function.bind.apply(e4, o2))();
              return i4 && s(n2, i4.prototype), n2;
            }).apply(null, arguments);
          }
          function h() {
            if (typeof Reflect == "undefined" || !Reflect.construct)
              return false;
            if (Reflect.construct.sham)
              return false;
            if (typeof Proxy == "function")
              return true;
            try {
              return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
              })), true;
            } catch (e3) {
              return false;
            }
          }
          function s(e3, t3) {
            return (s = Object.setPrototypeOf || function(e4, t4) {
              return e4.__proto__ = t4, e4;
            })(e3, t3);
          }
          function d(e3) {
            return (d = Object.setPrototypeOf ? Object.getPrototypeOf : function(e4) {
              return e4.__proto__ || Object.getPrototypeOf(e4);
            })(e3);
          }
          function v(e3, t3, i3) {
            return t3 in e3 ? Object.defineProperty(e3, t3, { value: i3, enumerable: true, configurable: true, writable: true }) : e3[t3] = i3, e3;
          }
          const w = (e3) => {
            const t3 = e3.reduce((e4, [t4]) => e4 + t4, 0);
            let i3 = 0;
            return e3.map(([e4, o2]) => (i3 += e4 / t3, [i3, o2]));
          }, W = n.default.map(({ weight: e3 }, t3) => [e3, t3]), k = w(W), f = (e3, t3 = (e4) => e4) => {
            let i3;
            return i3 = typeof e3 == "function" ? [e3] : e3 instanceof RegExp ? [(t4) => typeof t4 == "object" && t4 && t4.userAgent ? e3.test(t4.userAgent) : e3.test(t4)] : e3 instanceof Array ? e3.map((e4) => f(e4)) : typeof e3 == "object" ? Object.entries(e3).map(([e4, t4]) => f(t4, (t5) => t5[e4])) : [(t4) => typeof t4 == "object" && t4 && t4.userAgent ? e3 === t4.userAgent : e3 === t4], (e4) => {
              try {
                const o2 = t3(e4);
                return i3.every((e5) => e5(o2));
              } catch (e5) {
                return false;
              }
            };
          }, M = (e3, t3) => {
            Object.defineProperty(e3, "cumulativeWeightIndexPairs", { configurable: true, enumerable: false, writable: false, value: t3 });
          };
          r = Symbol.toPrimitive;
          let m = function(e3) {
            !function(e4, t4) {
              if (typeof t4 != "function" && t4 !== null)
                throw new TypeError("Super expression must either be null or a function");
              e4.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e4, writable: true, configurable: true } }), t4 && s(e4, t4);
            }(l2, e3);
            var t3, i3, p2 = (t3 = l2, i3 = h(), function() {
              var e4, o2 = d(t3);
              if (i3) {
                var n2 = d(this).constructor;
                e4 = Reflect.construct(o2, arguments, n2);
              } else
                e4 = o2.apply(this, arguments);
              return c(this, e4);
            });
            function l2(e4) {
              var t4;
              if (function(e5, t5) {
                if (!(e5 instanceof t5))
                  throw new TypeError("Cannot call a class as a function");
              }(this, l2), v(a(t4 = p2.call(this)), r, () => t4.data.userAgent), v(a(t4), "toString", () => t4.data.userAgent), v(a(t4), "random", () => {
                const e5 = new l2();
                return M(e5, t4.cumulativeWeightIndexPairs), e5.randomize(), e5;
              }), v(a(t4), "randomize", () => {
                const e5 = Math.random(), [, i4] = t4.cumulativeWeightIndexPairs.find(([t5]) => t5 > e5), r2 = n.default[i4];
                t4.data = (0, o.default)(r2);
              }), M(a(t4), ((e5) => {
                if (!e5)
                  return k;
                const t5 = f(e5), i4 = [];
                return n.default.forEach((e6, o2) => {
                  t5(e6) && i4.push([e6.weight, o2]);
                }), w(i4);
              })(e4)), t4.cumulativeWeightIndexPairs.length === 0)
                throw new Error("No user agents matched your filters.");
              return t4.randomize(), c(t4, new Proxy(a(t4), { apply: () => t4.random(), get: (e5, t5, i4) => {
                if (e5.data && typeof t5 == "string" && Object.prototype.hasOwnProperty.call(e5.data, t5) && Object.prototype.propertyIsEnumerable.call(e5.data, t5)) {
                  const i5 = e5.data[t5];
                  if (i5 !== void 0)
                    return i5;
                }
                return Reflect.get(e5, t5, i4);
              } }));
            }
            return l2;
          }(l(Function));
          t2.default = m, v(m, "random", (e3) => {
            try {
              return new m(e3);
            } catch (e4) {
              return null;
            }
          }), e2.exports = t2.default;
        }, 465: (e2, t2, i2) => {
          e2 = i2.nmd(e2);
          var o = "__lodash_hash_undefined__", n = 9007199254740991, r = "[object Arguments]", p = "[object Boolean]", c = "[object Date]", a = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", s = "[object Object]", d = "[object Promise]", v = "[object RegExp]", w = "[object Set]", W = "[object String]", k = "[object Symbol]", f = "[object WeakMap]", M = "[object ArrayBuffer]", m = "[object DataView]", H = "[object Float32Array]", u = "[object Float64Array]", N = "[object Int8Array]", T = "[object Int16Array]", L = "[object Int32Array]", A = "[object Uint8Array]", C = "[object Uint8ClampedArray]", K = "[object Uint16Array]", y = "[object Uint32Array]", G = /\w*$/, I = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, b = {};
          b[r] = b["[object Array]"] = b[M] = b[m] = b[p] = b[c] = b[H] = b[u] = b[N] = b[T] = b[L] = b[g] = b[h] = b[s] = b[v] = b[w] = b[W] = b[k] = b[A] = b[C] = b[K] = b[y] = true, b["[object Error]"] = b[a] = b[f] = false;
          var x = typeof global == "object" && global && global.Object === Object && global, z = typeof self == "object" && self && self.Object === Object && self, _ = x || z || Function("return this")(), X = t2 && !t2.nodeType && t2, O = X && e2 && !e2.nodeType && e2, P = O && O.exports === X;
          function E(e3, t3) {
            return e3.set(t3[0], t3[1]), e3;
          }
          function V(e3, t3) {
            return e3.add(t3), e3;
          }
          function U(e3, t3, i3, o2) {
            var n2 = -1, r2 = e3 ? e3.length : 0;
            for (o2 && r2 && (i3 = e3[++n2]); ++n2 < r2; )
              i3 = t3(i3, e3[n2], n2, e3);
            return i3;
          }
          function R(e3) {
            var t3 = false;
            if (e3 != null && typeof e3.toString != "function")
              try {
                t3 = !!(e3 + "");
              } catch (e4) {
              }
            return t3;
          }
          function B(e3) {
            var t3 = -1, i3 = Array(e3.size);
            return e3.forEach(function(e4, o2) {
              i3[++t3] = [o2, e4];
            }), i3;
          }
          function Y(e3, t3) {
            return function(i3) {
              return e3(t3(i3));
            };
          }
          function j(e3) {
            var t3 = -1, i3 = Array(e3.size);
            return e3.forEach(function(e4) {
              i3[++t3] = e4;
            }), i3;
          }
          var F, D = Array.prototype, Q = Function.prototype, $ = Object.prototype, J = _["__core-js_shared__"], q = (F = /[^.]+$/.exec(J && J.keys && J.keys.IE_PROTO || "")) ? "Symbol(src)_1." + F : "", Z = Q.toString, ee = $.hasOwnProperty, te = $.toString, ie = RegExp("^" + Z.call(ee).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), oe = P ? _.Buffer : void 0, ne = _.Symbol, re = _.Uint8Array, pe = Y(Object.getPrototypeOf, Object), ce = Object.create, ae = $.propertyIsEnumerable, le = D.splice, ge = Object.getOwnPropertySymbols, he = oe ? oe.isBuffer : void 0, se = Y(Object.keys, Object), de = Oe(_, "DataView"), ve = Oe(_, "Map"), we = Oe(_, "Promise"), We = Oe(_, "Set"), ke = Oe(_, "WeakMap"), fe = Oe(Object, "create"), Me = Re(de), me = Re(ve), He = Re(we), ue = Re(We), Ne = Re(ke), Te = ne ? ne.prototype : void 0, Le = Te ? Te.valueOf : void 0;
          function Ae(e3) {
            var t3 = -1, i3 = e3 ? e3.length : 0;
            for (this.clear(); ++t3 < i3; ) {
              var o2 = e3[t3];
              this.set(o2[0], o2[1]);
            }
          }
          function Ce(e3) {
            var t3 = -1, i3 = e3 ? e3.length : 0;
            for (this.clear(); ++t3 < i3; ) {
              var o2 = e3[t3];
              this.set(o2[0], o2[1]);
            }
          }
          function Ke(e3) {
            var t3 = -1, i3 = e3 ? e3.length : 0;
            for (this.clear(); ++t3 < i3; ) {
              var o2 = e3[t3];
              this.set(o2[0], o2[1]);
            }
          }
          function ye(e3) {
            this.__data__ = new Ce(e3);
          }
          function Ge(e3, t3) {
            var i3 = Ye(e3) || function(e4) {
              return function(e5) {
                return function(e6) {
                  return !!e6 && typeof e6 == "object";
                }(e5) && je(e5);
              }(e4) && ee.call(e4, "callee") && (!ae.call(e4, "callee") || te.call(e4) == r);
            }(e3) ? function(e4, t4) {
              for (var i4 = -1, o3 = Array(e4); ++i4 < e4; )
                o3[i4] = t4(i4);
              return o3;
            }(e3.length, String) : [], o2 = i3.length, n2 = !!o2;
            for (var p2 in e3)
              !t3 && !ee.call(e3, p2) || n2 && (p2 == "length" || Ve(p2, o2)) || i3.push(p2);
            return i3;
          }
          function Ie(e3, t3, i3) {
            var o2 = e3[t3];
            ee.call(e3, t3) && Be(o2, i3) && (i3 !== void 0 || t3 in e3) || (e3[t3] = i3);
          }
          function Se(e3, t3) {
            for (var i3 = e3.length; i3--; )
              if (Be(e3[i3][0], t3))
                return i3;
            return -1;
          }
          function be(e3, t3, i3, o2, n2, d2, f2) {
            var I2;
            if (o2 && (I2 = d2 ? o2(e3, n2, d2, f2) : o2(e3)), I2 !== void 0)
              return I2;
            if (!Qe(e3))
              return e3;
            var S2 = Ye(e3);
            if (S2) {
              if (I2 = function(e4) {
                var t4 = e4.length, i4 = e4.constructor(t4);
                t4 && typeof e4[0] == "string" && ee.call(e4, "index") && (i4.index = e4.index, i4.input = e4.input);
                return i4;
              }(e3), !t3)
                return function(e4, t4) {
                  var i4 = -1, o3 = e4.length;
                  t4 || (t4 = Array(o3));
                  for (; ++i4 < o3; )
                    t4[i4] = e4[i4];
                  return t4;
                }(e3, I2);
            } else {
              var x2 = Ee(e3), z2 = x2 == a || x2 == l;
              if (Fe(e3))
                return function(e4, t4) {
                  if (t4)
                    return e4.slice();
                  var i4 = new e4.constructor(e4.length);
                  return e4.copy(i4), i4;
                }(e3, t3);
              if (x2 == s || x2 == r || z2 && !d2) {
                if (R(e3))
                  return d2 ? e3 : {};
                if (I2 = function(e4) {
                  return typeof e4.constructor != "function" || Ue(e4) ? {} : (t4 = pe(e4), Qe(t4) ? ce(t4) : {});
                  var t4;
                }(z2 ? {} : e3), !t3)
                  return function(e4, t4) {
                    return _e(e4, Pe(e4), t4);
                  }(e3, function(e4, t4) {
                    return e4 && _e(t4, $e(t4), e4);
                  }(I2, e3));
              } else {
                if (!b[x2])
                  return d2 ? e3 : {};
                I2 = function(e4, t4, i4, o3) {
                  var n3 = e4.constructor;
                  switch (t4) {
                    case M:
                      return ze(e4);
                    case p:
                    case c:
                      return new n3(+e4);
                    case m:
                      return function(e5, t5) {
                        var i5 = t5 ? ze(e5.buffer) : e5.buffer;
                        return new e5.constructor(i5, e5.byteOffset, e5.byteLength);
                      }(e4, o3);
                    case H:
                    case u:
                    case N:
                    case T:
                    case L:
                    case A:
                    case C:
                    case K:
                    case y:
                      return function(e5, t5) {
                        var i5 = t5 ? ze(e5.buffer) : e5.buffer;
                        return new e5.constructor(i5, e5.byteOffset, e5.length);
                      }(e4, o3);
                    case g:
                      return function(e5, t5, i5) {
                        return U(t5 ? i5(B(e5), true) : B(e5), E, new e5.constructor());
                      }(e4, o3, i4);
                    case h:
                    case W:
                      return new n3(e4);
                    case v:
                      return function(e5) {
                        var t5 = new e5.constructor(e5.source, G.exec(e5));
                        return t5.lastIndex = e5.lastIndex, t5;
                      }(e4);
                    case w:
                      return function(e5, t5, i5) {
                        return U(t5 ? i5(j(e5), true) : j(e5), V, new e5.constructor());
                      }(e4, o3, i4);
                    case k:
                      return r2 = e4, Le ? Object(Le.call(r2)) : {};
                  }
                  var r2;
                }(e3, x2, be, t3);
              }
            }
            f2 || (f2 = new ye());
            var _2 = f2.get(e3);
            if (_2)
              return _2;
            if (f2.set(e3, I2), !S2)
              var X2 = i3 ? function(e4) {
                return function(e5, t4, i4) {
                  var o3 = t4(e5);
                  return Ye(e5) ? o3 : function(e6, t5) {
                    for (var i5 = -1, o4 = t5.length, n3 = e6.length; ++i5 < o4; )
                      e6[n3 + i5] = t5[i5];
                    return e6;
                  }(o3, i4(e5));
                }(e4, $e, Pe);
              }(e3) : $e(e3);
            return function(e4, t4) {
              for (var i4 = -1, o3 = e4 ? e4.length : 0; ++i4 < o3 && t4(e4[i4], i4, e4) !== false; )
                ;
            }(X2 || e3, function(n3, r2) {
              X2 && (n3 = e3[r2 = n3]), Ie(I2, r2, be(n3, t3, i3, o2, r2, e3, f2));
            }), I2;
          }
          function xe(e3) {
            return !(!Qe(e3) || (t3 = e3, q && q in t3)) && (De(e3) || R(e3) ? ie : I).test(Re(e3));
            var t3;
          }
          function ze(e3) {
            var t3 = new e3.constructor(e3.byteLength);
            return new re(t3).set(new re(e3)), t3;
          }
          function _e(e3, t3, i3, o2) {
            i3 || (i3 = {});
            for (var n2 = -1, r2 = t3.length; ++n2 < r2; ) {
              var p2 = t3[n2], c2 = o2 ? o2(i3[p2], e3[p2], p2, i3, e3) : void 0;
              Ie(i3, p2, c2 === void 0 ? e3[p2] : c2);
            }
            return i3;
          }
          function Xe(e3, t3) {
            var i3, o2, n2 = e3.__data__;
            return ((o2 = typeof (i3 = t3)) == "string" || o2 == "number" || o2 == "symbol" || o2 == "boolean" ? i3 !== "__proto__" : i3 === null) ? n2[typeof t3 == "string" ? "string" : "hash"] : n2.map;
          }
          function Oe(e3, t3) {
            var i3 = function(e4, t4) {
              return e4 == null ? void 0 : e4[t4];
            }(e3, t3);
            return xe(i3) ? i3 : void 0;
          }
          Ae.prototype.clear = function() {
            this.__data__ = fe ? fe(null) : {};
          }, Ae.prototype.delete = function(e3) {
            return this.has(e3) && delete this.__data__[e3];
          }, Ae.prototype.get = function(e3) {
            var t3 = this.__data__;
            if (fe) {
              var i3 = t3[e3];
              return i3 === o ? void 0 : i3;
            }
            return ee.call(t3, e3) ? t3[e3] : void 0;
          }, Ae.prototype.has = function(e3) {
            var t3 = this.__data__;
            return fe ? t3[e3] !== void 0 : ee.call(t3, e3);
          }, Ae.prototype.set = function(e3, t3) {
            return this.__data__[e3] = fe && t3 === void 0 ? o : t3, this;
          }, Ce.prototype.clear = function() {
            this.__data__ = [];
          }, Ce.prototype.delete = function(e3) {
            var t3 = this.__data__, i3 = Se(t3, e3);
            return !(i3 < 0) && (i3 == t3.length - 1 ? t3.pop() : le.call(t3, i3, 1), true);
          }, Ce.prototype.get = function(e3) {
            var t3 = this.__data__, i3 = Se(t3, e3);
            return i3 < 0 ? void 0 : t3[i3][1];
          }, Ce.prototype.has = function(e3) {
            return Se(this.__data__, e3) > -1;
          }, Ce.prototype.set = function(e3, t3) {
            var i3 = this.__data__, o2 = Se(i3, e3);
            return o2 < 0 ? i3.push([e3, t3]) : i3[o2][1] = t3, this;
          }, Ke.prototype.clear = function() {
            this.__data__ = { hash: new Ae(), map: new (ve || Ce)(), string: new Ae() };
          }, Ke.prototype.delete = function(e3) {
            return Xe(this, e3).delete(e3);
          }, Ke.prototype.get = function(e3) {
            return Xe(this, e3).get(e3);
          }, Ke.prototype.has = function(e3) {
            return Xe(this, e3).has(e3);
          }, Ke.prototype.set = function(e3, t3) {
            return Xe(this, e3).set(e3, t3), this;
          }, ye.prototype.clear = function() {
            this.__data__ = new Ce();
          }, ye.prototype.delete = function(e3) {
            return this.__data__.delete(e3);
          }, ye.prototype.get = function(e3) {
            return this.__data__.get(e3);
          }, ye.prototype.has = function(e3) {
            return this.__data__.has(e3);
          }, ye.prototype.set = function(e3, t3) {
            var i3 = this.__data__;
            if (i3 instanceof Ce) {
              var o2 = i3.__data__;
              if (!ve || o2.length < 199)
                return o2.push([e3, t3]), this;
              i3 = this.__data__ = new Ke(o2);
            }
            return i3.set(e3, t3), this;
          };
          var Pe = ge ? Y(ge, Object) : function() {
            return [];
          }, Ee = function(e3) {
            return te.call(e3);
          };
          function Ve(e3, t3) {
            return !!(t3 = t3 == null ? n : t3) && (typeof e3 == "number" || S.test(e3)) && e3 > -1 && e3 % 1 == 0 && e3 < t3;
          }
          function Ue(e3) {
            var t3 = e3 && e3.constructor;
            return e3 === (typeof t3 == "function" && t3.prototype || $);
          }
          function Re(e3) {
            if (e3 != null) {
              try {
                return Z.call(e3);
              } catch (e4) {
              }
              try {
                return e3 + "";
              } catch (e4) {
              }
            }
            return "";
          }
          function Be(e3, t3) {
            return e3 === t3 || e3 != e3 && t3 != t3;
          }
          (de && Ee(new de(new ArrayBuffer(1))) != m || ve && Ee(new ve()) != g || we && Ee(we.resolve()) != d || We && Ee(new We()) != w || ke && Ee(new ke()) != f) && (Ee = function(e3) {
            var t3 = te.call(e3), i3 = t3 == s ? e3.constructor : void 0, o2 = i3 ? Re(i3) : void 0;
            if (o2)
              switch (o2) {
                case Me:
                  return m;
                case me:
                  return g;
                case He:
                  return d;
                case ue:
                  return w;
                case Ne:
                  return f;
              }
            return t3;
          });
          var Ye = Array.isArray;
          function je(e3) {
            return e3 != null && function(e4) {
              return typeof e4 == "number" && e4 > -1 && e4 % 1 == 0 && e4 <= n;
            }(e3.length) && !De(e3);
          }
          var Fe = he || function() {
            return false;
          };
          function De(e3) {
            var t3 = Qe(e3) ? te.call(e3) : "";
            return t3 == a || t3 == l;
          }
          function Qe(e3) {
            var t3 = typeof e3;
            return !!e3 && (t3 == "object" || t3 == "function");
          }
          function $e(e3) {
            return je(e3) ? Ge(e3) : function(e4) {
              if (!Ue(e4))
                return se(e4);
              var t3 = [];
              for (var i3 in Object(e4))
                ee.call(e4, i3) && i3 != "constructor" && t3.push(i3);
              return t3;
            }(e3);
          }
          e2.exports = function(e3) {
            return be(e3, true, true);
          };
        }, 932: (e2) => {
          "use strict";
        } }, t = {};
        function i(o) {
          if (t[o])
            return t[o].exports;
          var n = t[o] = { id: o, loaded: false, exports: {} };
          return e[o](n, n.exports, i), n.loaded = true, n.exports;
        }
        return i.nmd = (e2) => (e2.paths = [], e2.children || (e2.children = []), e2), i(442);
      })();
    });
  }
});

// node_modules/flat/index.js
var require_flat = __commonJS({
  "node_modules/flat/index.js"(exports2, module2) {
    module2.exports = flatten;
    flatten.flatten = flatten;
    flatten.unflatten = unflatten;
    function isBuffer(obj) {
      return obj && obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    }
    function keyIdentity(key) {
      return key;
    }
    function flatten(target, opts) {
      opts = opts || {};
      const delimiter = opts.delimiter || ".";
      const maxDepth = opts.maxDepth;
      const transformKey = opts.transformKey || keyIdentity;
      const output = {};
      function step(object, prev, currentDepth) {
        currentDepth = currentDepth || 1;
        Object.keys(object).forEach(function(key) {
          const value = object[key];
          const isarray = opts.safe && Array.isArray(value);
          const type = Object.prototype.toString.call(value);
          const isbuffer = isBuffer(value);
          const isobject = type === "[object Object]" || type === "[object Array]";
          const newKey = prev ? prev + delimiter + transformKey(key) : transformKey(key);
          if (!isarray && !isbuffer && isobject && Object.keys(value).length && (!opts.maxDepth || currentDepth < maxDepth)) {
            return step(value, newKey, currentDepth + 1);
          }
          output[newKey] = value;
        });
      }
      step(target);
      return output;
    }
    function unflatten(target, opts) {
      opts = opts || {};
      const delimiter = opts.delimiter || ".";
      const overwrite = opts.overwrite || false;
      const transformKey = opts.transformKey || keyIdentity;
      const result = {};
      const isbuffer = isBuffer(target);
      if (isbuffer || Object.prototype.toString.call(target) !== "[object Object]") {
        return target;
      }
      function getkey(key) {
        const parsedKey = Number(key);
        return isNaN(parsedKey) || key.indexOf(".") !== -1 || opts.object ? key : parsedKey;
      }
      function addKeys(keyPrefix, recipient, target2) {
        return Object.keys(target2).reduce(function(result2, key) {
          result2[keyPrefix + delimiter + key] = target2[key];
          return result2;
        }, recipient);
      }
      function isEmpty(val) {
        const type = Object.prototype.toString.call(val);
        const isArray = type === "[object Array]";
        const isObject = type === "[object Object]";
        if (!val) {
          return true;
        } else if (isArray) {
          return !val.length;
        } else if (isObject) {
          return !Object.keys(val).length;
        }
      }
      target = Object.keys(target).reduce(function(result2, key) {
        const type = Object.prototype.toString.call(target[key]);
        const isObject = type === "[object Object]" || type === "[object Array]";
        if (!isObject || isEmpty(target[key])) {
          result2[key] = target[key];
          return result2;
        } else {
          return addKeys(key, result2, flatten(target[key], opts));
        }
      }, {});
      Object.keys(target).forEach(function(key) {
        const split = key.split(delimiter).map(transformKey);
        let key1 = getkey(split.shift());
        let key2 = getkey(split[0]);
        let recipient = result;
        while (key2 !== void 0) {
          if (key1 === "__proto__") {
            return;
          }
          const type = Object.prototype.toString.call(recipient[key1]);
          const isobject = type === "[object Object]" || type === "[object Array]";
          if (!overwrite && !isobject && typeof recipient[key1] !== "undefined") {
            return;
          }
          if (overwrite && !isobject || !overwrite && recipient[key1] == null) {
            recipient[key1] = typeof key2 === "number" && !opts.object ? [] : {};
          }
          recipient = recipient[key1];
          if (split.length > 0) {
            key1 = getkey(split.shift());
            key2 = getkey(split[0]);
          }
        }
        recipient[key1] = unflatten(target[key], opts);
      });
      return result;
    }
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "youtubei.js",
      version: "2.0.0",
      description: "A full-featured wrapper around YouTube's private API. Allows you to retrieve info about any video, subscribe, unsubscribe, like, dislike, comment, search, download videos/music and much more!",
      author: "LuanRT <luan.lrt4@gmail.com> (https://github.com/LuanRT)",
      contributors: [
        "Wykerd (https://github.com/wykerd/)"
      ],
      funding: "https://ko-fi.com/luanrt",
      license: "MIT",
      engines: {
        node: ">=14"
      },
      scripts: {
        test: "npx jest",
        "test:node": "npm run build:node && npx jest node",
        "test:browser": "npm run build:browser && npx jest browser",
        lint: "npx eslint ./lib",
        "lint:fix": "npx eslint --fix ./lib",
        "build:types": "npx tsc",
        "build:parser-map": "node ./scripts/build-parser-json.js",
        "build:general": 'npm run build:parser-map && npx esbuild ./lib/Innertube.js --banner:js="/* eslint-disable */" --bundle --target=esnext --format=cjs --sourcemap',
        "build:node": "npm run build:general -- --outfile=./build/node.js --platform=node --define:BROWSER=false",
        "build:node:prod": "npm run build:node -- --minify",
        "build:browser": "npm run build:general -- --outfile=./build/browser.js --platform=browser --define:BROWSER=true",
        "build:browser:prod": "npm run build:browser -- --minify"
      },
      types: "./typings/Innertube.d.ts",
      main: "./build/node.js",
      browser: "./build/browser.js",
      directories: {
        test: "./test",
        typings: "./typings",
        examples: "./examples",
        lib: "./lib"
      },
      dependencies: {
        "@stdlib/os-tmpdir": "^0.0.8",
        axios: "^0.21.4",
        buffer: "^6.0.3",
        events: "^3.3.0",
        flat: "^5.0.2",
        idb: "^7.0.2",
        "node-forge": "^1.3.1",
        "protocol-buffers-encodings": "^1.1.1",
        "stream-browserify": "^3.0.0",
        "user-agents": "^1.0.778",
        uuid: "^8.3.2"
      },
      devDependencies: {
        "@types/node": "^17.0.31",
        esbuild: "^0.14.48",
        eslint: "^8.15.0",
        "eslint-plugin-jsdoc": "^39.3.2",
        "fake-dom": "^1.0.4",
        "fake-indexeddb": "^4.0.0",
        jest: "^28.1.0",
        typescript: "^4.6.4",
        xhr2: "^0.2.1",
        "xmlhttprequest-ssl": "^2.0.0"
      },
      repository: {
        type: "git",
        url: "git+https://github.com/LuanRT/YouTube.js.git"
      },
      bugs: {
        url: "https://github.com/LuanRT/YouTube.js/issues"
      },
      homepage: "https://github.com/LuanRT/YouTube.js#readme",
      keywords: [
        "yt",
        "dl",
        "ytdl",
        "youtube",
        "youtubedl",
        "youtube-dl",
        "youtube-downloader",
        "innertube",
        "innertubeapi",
        "unofficial",
        "downloader",
        "livechat",
        "ytmusic",
        "dislike",
        "search",
        "comment",
        "music",
        "like",
        "api"
      ]
    };
  }
});

// lib/utils/Utils.js
var require_Utils = __commonJS({
  "lib/utils/Utils.js"(exports2, module2) {
    "use strict";
    var Crypto = false ? null : require("crypto");
    var UserAgent = require_dist2();
    var Flatten = require_flat();
    var InnertubeError2 = class extends Error {
      constructor(message, info) {
        super(message);
        if (info) {
          this.info = info;
        }
        this.date = new Date();
        this.version = require_package().version;
      }
    };
    var ParsingError = class extends InnertubeError2 {
    };
    var DownloadError = class extends InnertubeError2 {
    };
    var MissingParamError = class extends InnertubeError2 {
    };
    var UnavailableContentError = class extends InnertubeError2 {
    };
    var NoStreamingDataError = class extends InnertubeError2 {
    };
    var OAuthError = class extends InnertubeError2 {
    };
    function findNode(obj, key, target, depth, safe = true) {
      const flat_obj = Flatten(obj, { safe, maxDepth: depth || 2 });
      const result = Object.keys(flat_obj).find((entry) => entry.includes(key) && JSON.stringify(flat_obj[entry] || "{}").includes(target));
      if (!result)
        throw new ParsingError(`Expected to find "${key}" with content "${target}" but got ${result}`, { key, target, data_snippet: `${JSON.stringify(flat_obj, null, 4).slice(0, 300)}..` });
      return flat_obj[result];
    }
    function observe(obj) {
      return new Proxy(obj, {
        get(target, prop) {
          if (prop == "get") {
            return (rule, del_item) => target.find((obj2, index) => {
              const match = deepCompare(rule, obj2);
              if (match && del_item) {
                target.splice(index, 1);
              }
              return match;
            });
          }
          if (prop == "findAll") {
            return (rule, del_items) => target.filter((obj2, index) => {
              const match = deepCompare(rule, obj2);
              if (match && del_items) {
                target.splice(index, 1);
              }
              return match;
            });
          }
          if (prop == "remove") {
            return (index) => target.splice(index, 1);
          }
          return Reflect.get(...arguments);
        }
      });
    }
    function deepCompare(obj1, obj2) {
      const keys = Reflect.ownKeys(obj1);
      return keys.some((key) => {
        const is_text = obj2[key]?.constructor.name === "Text";
        if (!is_text && typeof obj2[key] === "object") {
          return JSON.stringify(obj1[key]) === JSON.stringify(obj2[key]);
        }
        return obj1[key] === (is_text ? obj2[key].toString() : obj2[key]);
      });
    }
    function getStringBetweenStrings(data, start_string, end_string) {
      const regex = new RegExp(`${escapeStringRegexp(start_string)}(.*?)${escapeStringRegexp(end_string)}`, "s");
      const match = data.match(regex);
      return match ? match[1] : void 0;
    }
    function escapeStringRegexp(input) {
      return input.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    }
    function getRandomUserAgent(type) {
      switch (type) {
        case "mobile":
          return new UserAgent(/Android/).data;
        case "desktop":
          return new UserAgent({ deviceCategory: "desktop" }).data;
        default:
      }
    }
    function generateSidAuth(sid) {
      const youtube = "https://www.youtube.com";
      const timestamp = Math.floor(new Date().getTime() / 1e3);
      const input = [timestamp, sid, youtube].join(" ");
      let gen_hash;
      if (false) {
        const hash = Crypto.md.sha1.create();
        hash.update(input);
        gen_hash = hash.digest().toHex();
      } else {
        const hash = Crypto.createHash("sha1");
        const data = hash.update(input, "utf-8");
        gen_hash = data.digest("hex");
      }
      return ["SAPISIDHASH", [timestamp, gen_hash].join("_")].join(" ");
    }
    function generateRandomString2(length) {
      const result = [];
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      for (let i = 0; i < length; i++) {
        result.push(alphabet.charAt(Math.floor(Math.random() * alphabet.length)));
      }
      return result.join("");
    }
    function timeToSeconds(time) {
      const params = time.split(":");
      switch (params.length) {
        case 1:
          return parseInt(+params[0]);
        case 2:
          return parseInt(+params[0] * 60 + +params[1]);
        case 3:
          return parseInt(+params[0] * 3600 + +params[1] * 60 + +params[2]);
        default:
          break;
      }
    }
    function camelToSnake(string) {
      return string[0].toLowerCase() + string.slice(1, string.length).replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    }
    function isValidClient(client) {
      return ["YOUTUBE", "YTMUSIC"].includes(client);
    }
    function throwIfMissing2(params) {
      for (const [key, value] of Object.entries(params)) {
        if (!value)
          throw new MissingParamError(`${key} is missing`);
      }
    }
    function refineNTokenData(data) {
      return data.replace(/function\(d,e\)/g, '"function(d,e)').replace(/function\(d\)/g, '"function(d)').replace(/function\(\)/g, '"function()').replace(/function\(d,e,f\)/g, '"function(d,e,f)').replace(/\[function\(d,e,f\)/g, '["function(d,e,f)').replace(/,b,/g, ',"b",').replace(/,b/g, ',"b"').replace(/b,/g, '"b",').replace(/b]/g, '"b"]').replace(/\[b/g, '["b"').replace(/}]/g, '"]').replace(/},/g, '}",').replace(/""/g, "").replace(/length]\)}"/g, "length])}");
    }
    var errors = { InnertubeError: InnertubeError2, UnavailableContentError, ParsingError, DownloadError, MissingParamError, NoStreamingDataError, OAuthError };
    var functions = {
      findNode,
      observe,
      getRandomUserAgent,
      generateSidAuth,
      generateRandomString: generateRandomString2,
      getStringBetweenStrings,
      camelToSnake,
      isValidClient,
      throwIfMissing: throwIfMissing2,
      timeToSeconds,
      refineNTokenData
    };
    module2.exports = { ...functions, ...errors };
  }
});

// lib/core/OAuth.js
var require_OAuth = __commonJS({
  "lib/core/OAuth.js"(exports2, module2) {
    "use strict";
    var Uuid = require_dist();
    var Constants = require_Constants();
    var { OAuthError } = require_Utils();
    var OAuth2 = class {
      #request;
      #identity;
      #credentials = {};
      #polling_interval = 5;
      #ev = null;
      constructor(ev, request) {
        this.#ev = ev;
        this.#request = request;
      }
      init(credentials) {
        this.#credentials = credentials;
        if (!credentials.access_token) {
          this.#getUserCode();
        }
      }
      async #getUserCode() {
        this.#identity = await this.#getClientIdentity();
        const data = {
          client_id: this.#identity.client_id,
          scope: Constants.OAUTH.SCOPE,
          device_id: Uuid.v4(),
          model_name: Constants.OAUTH.MODEL_NAME
        };
        const response = await this.#request({
          data,
          url: "/o/oauth2/device/code",
          baseURL: Constants.URLS.YT_BASE,
          method: "post"
        }).catch((err) => err);
        if (response instanceof Error)
          return this.#ev.emit("auth", new OAuthError("Could not obtain user code.", response.message));
        this.#ev.emit("auth", {
          ...response.data,
          status: "AUTHORIZATION_PENDING"
        });
        this.#polling_interval = response.data.interval;
        this.#startPolling(response.data.device_code);
      }
      #startPolling(device_code) {
        const poller = setInterval(async () => {
          const data = {
            ...this.#identity,
            code: device_code,
            grant_type: Constants.OAUTH.GRANT_TYPE
          };
          const response = await this.#request({
            data,
            url: "/o/oauth2/token",
            baseURL: Constants.URLS.YT_BASE,
            method: "post"
          }).catch((err) => err);
          if (response instanceof Error)
            return this.#ev.emit("auth", new OAuthError("Could not obtain user code.", { status: "FAILED", message: response.message }));
          if (response.data.error) {
            switch (response.data.error) {
              case "access_denied":
                this.#ev.emit("auth", new OAuthError("Access was denied.", { status: "ACCESS_DENIED" }));
                break;
              case "expired_token":
                this.#ev.emit("auth", new OAuthError("The device code has expired, restarting auth flow.", { status: "DEVICE_CODE_EXPIRED" }));
                clearInterval(poller);
                this.#getUserCode();
                break;
              default:
                break;
            }
            return;
          }
          const expiration_date = new Date(new Date().getTime() + response.data.expires_in * 1e3);
          this.#credentials = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires: expiration_date
          };
          this.#ev.emit("auth", {
            credentials: this.#credentials,
            status: "SUCCESS"
          });
          clearInterval(poller);
        }, this.#polling_interval * 1e3);
      }
      async checkAccessTokenValidity() {
        const timestamp = new Date(this.#credentials.expires).getTime();
        if (new Date().getTime() > timestamp) {
          await this.#refreshAccessToken();
        }
      }
      async #refreshAccessToken() {
        this.#identity = await this.#getClientIdentity();
        const data = {
          ...this.#identity,
          refresh_token: this.#credentials.refresh_token,
          grant_type: "refresh_token"
        };
        const response = await this.#request({
          data,
          url: "/o/oauth2/token",
          baseURL: Constants.URLS.YT_BASE,
          method: "post"
        }).catch((err) => err);
        if (response instanceof Error)
          return this.#ev.emit("update-credentials", new OAuthError("Could not refresh access token.", { status: "FAILED" }));
        const expiration_date = new Date(new Date().getTime() + response.data.expires_in * 1e3);
        this.#credentials = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token || this.credentials.refresh_token,
          expires: expiration_date
        };
        this.#ev.emit("update-credentials", {
          credentials: this.#credentials,
          status: "SUCCESS"
        });
      }
      revokeCredentials() {
        return this.#request({
          url: "/o/oauth2/revoke",
          baseURL: Constants.URLS.YT_BASE,
          params: { token: this.getAccessToken() },
          method: "post"
        });
      }
      async #getClientIdentity() {
        const response = await this.#request({
          url: "/tv",
          baseURL: Constants.URLS.YT_BASE,
          headers: Constants.OAUTH.HEADERS
        });
        const url_body = Constants.OAUTH.REGEX.AUTH_SCRIPT.exec(response.data)[1];
        const script = await this.#request({ url: url_body, baseURL: Constants.URLS.YT_BASE });
        const client_identity = script.data.replace(/\n/g, "").match(Constants.OAUTH.REGEX.CLIENT_IDENTITY);
        return client_identity.groups;
      }
      get credentials() {
        return this.#credentials;
      }
      validateCredentials() {
        return this.#credentials.hasOwnProperty("access_token") && this.#credentials.hasOwnProperty("refresh_token") && this.#credentials.hasOwnProperty("expires");
      }
    };
    module2.exports = OAuth2;
  }
});

// node_modules/varint/encode.js
var require_encode = __commonJS({
  "node_modules/varint/encode.js"(exports2, module2) {
    module2.exports = encode;
    var MSB = 128;
    var REST = 127;
    var MSBALL = ~REST;
    var INT = Math.pow(2, 31);
    function encode(num, out, offset) {
      out = out || [];
      offset = offset || 0;
      var oldOffset = offset;
      while (num >= INT) {
        out[offset++] = num & 255 | MSB;
        num /= 128;
      }
      while (num & MSBALL) {
        out[offset++] = num & 255 | MSB;
        num >>>= 7;
      }
      out[offset] = num | 0;
      encode.bytes = offset - oldOffset + 1;
      return out;
    }
  }
});

// node_modules/varint/decode.js
var require_decode = __commonJS({
  "node_modules/varint/decode.js"(exports2, module2) {
    module2.exports = read;
    var MSB = 128;
    var REST = 127;
    function read(buf, offset) {
      var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
      do {
        if (counter >= l) {
          read.bytes = 0;
          throw new RangeError("Could not decode varint");
        }
        b = buf[counter++];
        res += shift < 28 ? (b & REST) << shift : (b & REST) * Math.pow(2, shift);
        shift += 7;
      } while (b >= MSB);
      read.bytes = counter - offset;
      return res;
    }
  }
});

// node_modules/varint/length.js
var require_length = __commonJS({
  "node_modules/varint/length.js"(exports2, module2) {
    var N1 = Math.pow(2, 7);
    var N2 = Math.pow(2, 14);
    var N3 = Math.pow(2, 21);
    var N4 = Math.pow(2, 28);
    var N5 = Math.pow(2, 35);
    var N6 = Math.pow(2, 42);
    var N7 = Math.pow(2, 49);
    var N8 = Math.pow(2, 56);
    var N9 = Math.pow(2, 63);
    module2.exports = function(value) {
      return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
    };
  }
});

// node_modules/varint/index.js
var require_varint = __commonJS({
  "node_modules/varint/index.js"(exports2, module2) {
    module2.exports = {
      encode: require_encode(),
      decode: require_decode(),
      encodingLength: require_length()
    };
  }
});

// node_modules/signed-varint/index.js
var require_signed_varint = __commonJS({
  "node_modules/signed-varint/index.js"(exports2) {
    var varint = require_varint();
    exports2.encode = function encode(v, b, o) {
      v = v >= 0 ? v * 2 : v * -2 - 1;
      var r = varint.encode(v, b, o);
      encode.bytes = varint.encode.bytes;
      return r;
    };
    exports2.decode = function decode(b, o) {
      var v = varint.decode(b, o);
      decode.bytes = varint.decode.bytes;
      return v & 1 ? (v + 1) / -2 : v / 2;
    };
    exports2.encodingLength = function(v) {
      return varint.encodingLength(v >= 0 ? v * 2 : v * -2 - 1);
    };
  }
});

// node_modules/protocol-buffers-encodings/index.js
var require_protocol_buffers_encodings = __commonJS({
  "node_modules/protocol-buffers-encodings/index.js"(exports2) {
    var varint = require_varint();
    var svarint = require_signed_varint();
    exports2.make = encoder;
    exports2.name = function(enc) {
      var keys = Object.keys(exports2);
      for (var i = 0; i < keys.length; i++) {
        if (exports2[keys[i]] === enc)
          return keys[i];
      }
      return null;
    };
    exports2.skip = function(type, buffer, offset) {
      switch (type) {
        case 0:
          varint.decode(buffer, offset);
          return offset + varint.decode.bytes;
        case 1:
          return offset + 8;
        case 2:
          var len = varint.decode(buffer, offset);
          return offset + varint.decode.bytes + len;
        case 3:
        case 4:
          throw new Error("Groups are not supported");
        case 5:
          return offset + 4;
      }
      throw new Error("Unknown wire type: " + type);
    };
    exports2.bytes = encoder(2, function encode(val, buffer, offset) {
      var oldOffset = offset;
      var len = bufferLength(val);
      varint.encode(len, buffer, offset);
      offset += varint.encode.bytes;
      if (Buffer.isBuffer(val))
        val.copy(buffer, offset);
      else
        buffer.write(val, offset, len);
      offset += len;
      encode.bytes = offset - oldOffset;
      return buffer;
    }, function decode(buffer, offset) {
      var oldOffset = offset;
      var len = varint.decode(buffer, offset);
      offset += varint.decode.bytes;
      var val = buffer.slice(offset, offset + len);
      offset += val.length;
      decode.bytes = offset - oldOffset;
      return val;
    }, function encodingLength(val) {
      var len = bufferLength(val);
      return varint.encodingLength(len) + len;
    });
    exports2.string = encoder(2, function encode(val, buffer, offset) {
      var oldOffset = offset;
      var len = Buffer.byteLength(val);
      varint.encode(len, buffer, offset, "utf-8");
      offset += varint.encode.bytes;
      buffer.write(val, offset, len);
      offset += len;
      encode.bytes = offset - oldOffset;
      return buffer;
    }, function decode(buffer, offset) {
      var oldOffset = offset;
      var len = varint.decode(buffer, offset);
      offset += varint.decode.bytes;
      var val = buffer.toString("utf-8", offset, offset + len);
      offset += len;
      decode.bytes = offset - oldOffset;
      return val;
    }, function encodingLength(val) {
      var len = Buffer.byteLength(val);
      return varint.encodingLength(len) + len;
    });
    exports2.bool = encoder(0, function encode(val, buffer, offset) {
      buffer[offset] = val ? 1 : 0;
      encode.bytes = 1;
      return buffer;
    }, function decode(buffer, offset) {
      var bool = buffer[offset] > 0;
      decode.bytes = 1;
      return bool;
    }, function encodingLength() {
      return 1;
    });
    exports2.int32 = encoder(0, function encode(val, buffer, offset) {
      varint.encode(val < 0 ? val + 4294967296 : val, buffer, offset);
      encode.bytes = varint.encode.bytes;
      return buffer;
    }, function decode(buffer, offset) {
      var val = varint.decode(buffer, offset);
      decode.bytes = varint.decode.bytes;
      return val > 2147483647 ? val - 4294967296 : val;
    }, function encodingLength(val) {
      return varint.encodingLength(val < 0 ? val + 4294967296 : val);
    });
    exports2.int64 = encoder(0, function encode(val, buffer, offset) {
      if (val < 0) {
        var last = offset + 9;
        varint.encode(val * -1, buffer, offset);
        offset += varint.encode.bytes - 1;
        buffer[offset] = buffer[offset] | 128;
        while (offset < last - 1) {
          offset++;
          buffer[offset] = 255;
        }
        buffer[last] = 1;
        encode.bytes = 10;
      } else {
        varint.encode(val, buffer, offset);
        encode.bytes = varint.encode.bytes;
      }
      return buffer;
    }, function decode(buffer, offset) {
      var val = varint.decode(buffer, offset);
      if (val >= Math.pow(2, 63)) {
        var limit = 9;
        while (buffer[offset + limit - 1] === 255)
          limit--;
        limit = limit || 9;
        var subset = Buffer.allocUnsafe(limit);
        buffer.copy(subset, 0, offset, offset + limit);
        subset[limit - 1] = subset[limit - 1] & 127;
        val = -1 * varint.decode(subset, 0);
        decode.bytes = 10;
      } else {
        decode.bytes = varint.decode.bytes;
      }
      return val;
    }, function encodingLength(val) {
      return val < 0 ? 10 : varint.encodingLength(val);
    });
    exports2.sint32 = exports2.sint64 = encoder(0, svarint.encode, svarint.decode, svarint.encodingLength);
    exports2.uint32 = exports2.uint64 = exports2.enum = exports2.varint = encoder(0, varint.encode, varint.decode, varint.encodingLength);
    exports2.fixed64 = exports2.sfixed64 = encoder(1, function encode(val, buffer, offset) {
      val.copy(buffer, offset);
      encode.bytes = 8;
      return buffer;
    }, function decode(buffer, offset) {
      var val = buffer.slice(offset, offset + 8);
      decode.bytes = 8;
      return val;
    }, function encodingLength() {
      return 8;
    });
    exports2.double = encoder(1, function encode(val, buffer, offset) {
      buffer.writeDoubleLE(val, offset);
      encode.bytes = 8;
      return buffer;
    }, function decode(buffer, offset) {
      var val = buffer.readDoubleLE(offset);
      decode.bytes = 8;
      return val;
    }, function encodingLength() {
      return 8;
    });
    exports2.fixed32 = encoder(5, function encode(val, buffer, offset) {
      buffer.writeUInt32LE(val, offset);
      encode.bytes = 4;
      return buffer;
    }, function decode(buffer, offset) {
      var val = buffer.readUInt32LE(offset);
      decode.bytes = 4;
      return val;
    }, function encodingLength() {
      return 4;
    });
    exports2.sfixed32 = encoder(5, function encode(val, buffer, offset) {
      buffer.writeInt32LE(val, offset);
      encode.bytes = 4;
      return buffer;
    }, function decode(buffer, offset) {
      var val = buffer.readInt32LE(offset);
      decode.bytes = 4;
      return val;
    }, function encodingLength() {
      return 4;
    });
    exports2.float = encoder(5, function encode(val, buffer, offset) {
      buffer.writeFloatLE(val, offset);
      encode.bytes = 4;
      return buffer;
    }, function decode(buffer, offset) {
      var val = buffer.readFloatLE(offset);
      decode.bytes = 4;
      return val;
    }, function encodingLength() {
      return 4;
    });
    function encoder(type, encode, decode, encodingLength) {
      encode.bytes = decode.bytes = 0;
      return {
        type,
        encode,
        decode,
        encodingLength
      };
    }
    function bufferLength(val) {
      return Buffer.isBuffer(val) ? val.length : Buffer.byteLength(val);
    }
  }
});

// lib/proto/messages.js
var require_messages = __commonJS({
  "lib/proto/messages.js"(exports2) {
    var encodings = require_protocol_buffers_encodings();
    var varint = encodings.varint;
    var skip = encodings.skip;
    var VisitorData = exports2.VisitorData = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var ChannelAnalytics = exports2.ChannelAnalytics = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var InnertubePayload = exports2.InnertubePayload = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var SoundInfoParams = exports2.SoundInfoParams = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var NotificationPreferences = exports2.NotificationPreferences = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var LiveMessageParams = exports2.LiveMessageParams = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var GetCommentsSectionParams = exports2.GetCommentsSectionParams = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var CreateCommentParams = exports2.CreateCommentParams = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var CreateCommentReplyParams = exports2.CreateCommentReplyParams = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var PeformCommentActionParams = exports2.PeformCommentActionParams = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var MusicSearchFilter = exports2.MusicSearchFilter = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    var SearchFilter = exports2.SearchFilter = {
      buffer: true,
      encodingLength: null,
      encode: null,
      decode: null
    };
    defineVisitorData();
    defineChannelAnalytics();
    defineInnertubePayload();
    defineSoundInfoParams();
    defineNotificationPreferences();
    defineLiveMessageParams();
    defineGetCommentsSectionParams();
    defineCreateCommentParams();
    defineCreateCommentReplyParams();
    definePeformCommentActionParams();
    defineMusicSearchFilter();
    defineSearchFilter();
    function defineVisitorData() {
      VisitorData.encodingLength = encodingLength;
      VisitorData.encode = encode;
      VisitorData.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.id)) {
          var len = encodings.string.encodingLength(obj.id);
          length += 1 + len;
        }
        if (defined(obj.timestamp)) {
          var len = encodings.int32.encodingLength(obj.timestamp);
          length += 1 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.id)) {
          buf[offset++] = 10;
          encodings.string.encode(obj.id, buf, offset);
          offset += encodings.string.encode.bytes;
        }
        if (defined(obj.timestamp)) {
          buf[offset++] = 40;
          encodings.int32.encode(obj.timestamp, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          id: "",
          timestamp: 0
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 1:
              obj.id = encodings.string.decode(buf, offset);
              offset += encodings.string.decode.bytes;
              break;
            case 5:
              obj.timestamp = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defineChannelAnalytics() {
      var Params = ChannelAnalytics.Params = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      defineParams();
      function defineParams() {
        Params.encodingLength = encodingLength2;
        Params.encode = encode2;
        Params.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.channel_id)) {
            var len = encodings.string.encodingLength(obj.channel_id);
            length += 2 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.channel_id)) {
            buf[offset++] = 202;
            buf[offset++] = 62;
            encodings.string.encode(obj.channel_id, buf, offset);
            offset += encodings.string.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            channel_id: ""
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 1001:
                obj.channel_id = encodings.string.decode(buf, offset);
                offset += encodings.string.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      ChannelAnalytics.encodingLength = encodingLength;
      ChannelAnalytics.encode = encode;
      ChannelAnalytics.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.params)) {
          var len = Params.encodingLength(obj.params);
          length += varint.encodingLength(len);
          length += 2 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.params)) {
          buf[offset++] = 130;
          buf[offset++] = 2;
          varint.encode(Params.encodingLength(obj.params), buf, offset);
          offset += varint.encode.bytes;
          Params.encode(obj.params, buf, offset);
          offset += Params.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          params: null
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 32:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.params = Params.decode(buf, offset, offset + len);
              offset += Params.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defineInnertubePayload() {
      var Context = InnertubePayload.Context = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      defineContext();
      function defineContext() {
        var Client = Context.Client = {
          buffer: true,
          encodingLength: null,
          encode: null,
          decode: null
        };
        defineClient();
        function defineClient() {
          Client.encodingLength = encodingLength3;
          Client.encode = encode3;
          Client.decode = decode3;
          function encodingLength3(obj) {
            var length = 0;
            if (defined(obj.unkparam)) {
              var len = encodings.int32.encodingLength(obj.unkparam);
              length += 2 + len;
            }
            if (defined(obj.client_version)) {
              var len = encodings.string.encodingLength(obj.client_version);
              length += 2 + len;
            }
            if (defined(obj.client_name)) {
              var len = encodings.string.encodingLength(obj.client_name);
              length += 2 + len;
            }
            return length;
          }
          function encode3(obj, buf, offset) {
            if (!offset)
              offset = 0;
            if (!buf)
              buf = Buffer.allocUnsafe(encodingLength3(obj));
            var oldOffset = offset;
            if (defined(obj.unkparam)) {
              buf[offset++] = 128;
              buf[offset++] = 1;
              encodings.int32.encode(obj.unkparam, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            if (defined(obj.client_version)) {
              buf[offset++] = 138;
              buf[offset++] = 1;
              encodings.string.encode(obj.client_version, buf, offset);
              offset += encodings.string.encode.bytes;
            }
            if (defined(obj.client_name)) {
              buf[offset++] = 146;
              buf[offset++] = 1;
              encodings.string.encode(obj.client_name, buf, offset);
              offset += encodings.string.encode.bytes;
            }
            encode3.bytes = offset - oldOffset;
            return buf;
          }
          function decode3(buf, offset, end) {
            if (!offset)
              offset = 0;
            if (!end)
              end = buf.length;
            if (!(end <= buf.length && offset <= buf.length))
              throw new Error("Decoded message is not valid");
            var oldOffset = offset;
            var obj = {
              unkparam: 0,
              client_version: "",
              client_name: ""
            };
            while (true) {
              if (end <= offset) {
                decode3.bytes = offset - oldOffset;
                return obj;
              }
              var prefix = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              var tag = prefix >> 3;
              switch (tag) {
                case 16:
                  obj.unkparam = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                case 17:
                  obj.client_version = encodings.string.decode(buf, offset);
                  offset += encodings.string.decode.bytes;
                  break;
                case 18:
                  obj.client_name = encodings.string.decode(buf, offset);
                  offset += encodings.string.decode.bytes;
                  break;
                default:
                  offset = skip(prefix & 7, buf, offset);
              }
            }
          }
        }
        Context.encodingLength = encodingLength2;
        Context.encode = encode2;
        Context.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.client)) {
            var len = Client.encodingLength(obj.client);
            length += varint.encodingLength(len);
            length += 1 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.client)) {
            buf[offset++] = 10;
            varint.encode(Client.encodingLength(obj.client), buf, offset);
            offset += varint.encode.bytes;
            Client.encode(obj.client, buf, offset);
            offset += Client.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            client: null
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 1:
                var len = varint.decode(buf, offset);
                offset += varint.decode.bytes;
                obj.client = Client.decode(buf, offset, offset + len);
                offset += Client.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      InnertubePayload.encodingLength = encodingLength;
      InnertubePayload.encode = encode;
      InnertubePayload.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.context)) {
          var len = Context.encodingLength(obj.context);
          length += varint.encodingLength(len);
          length += 1 + len;
        }
        if (defined(obj.target)) {
          var len = encodings.string.encodingLength(obj.target);
          length += 1 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.context)) {
          buf[offset++] = 10;
          varint.encode(Context.encodingLength(obj.context), buf, offset);
          offset += varint.encode.bytes;
          Context.encode(obj.context, buf, offset);
          offset += Context.encode.bytes;
        }
        if (defined(obj.target)) {
          buf[offset++] = 18;
          encodings.string.encode(obj.target, buf, offset);
          offset += encodings.string.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          context: null,
          target: ""
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 1:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.context = Context.decode(buf, offset, offset + len);
              offset += Context.decode.bytes;
              break;
            case 2:
              obj.target = encodings.string.decode(buf, offset);
              offset += encodings.string.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defineSoundInfoParams() {
      var Sound = SoundInfoParams.Sound = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      defineSound();
      function defineSound() {
        var Params = Sound.Params = {
          buffer: true,
          encodingLength: null,
          encode: null,
          decode: null
        };
        defineParams();
        function defineParams() {
          var Ids = Params.Ids = {
            buffer: true,
            encodingLength: null,
            encode: null,
            decode: null
          };
          defineIds();
          function defineIds() {
            Ids.encodingLength = encodingLength4;
            Ids.encode = encode4;
            Ids.decode = decode4;
            function encodingLength4(obj) {
              var length = 0;
              if (defined(obj.id_1)) {
                var len = encodings.string.encodingLength(obj.id_1);
                length += 1 + len;
              }
              if (defined(obj.id_2)) {
                var len = encodings.string.encodingLength(obj.id_2);
                length += 1 + len;
              }
              if (defined(obj.id_3)) {
                var len = encodings.string.encodingLength(obj.id_3);
                length += 1 + len;
              }
              return length;
            }
            function encode4(obj, buf, offset) {
              if (!offset)
                offset = 0;
              if (!buf)
                buf = Buffer.allocUnsafe(encodingLength4(obj));
              var oldOffset = offset;
              if (defined(obj.id_1)) {
                buf[offset++] = 10;
                encodings.string.encode(obj.id_1, buf, offset);
                offset += encodings.string.encode.bytes;
              }
              if (defined(obj.id_2)) {
                buf[offset++] = 18;
                encodings.string.encode(obj.id_2, buf, offset);
                offset += encodings.string.encode.bytes;
              }
              if (defined(obj.id_3)) {
                buf[offset++] = 26;
                encodings.string.encode(obj.id_3, buf, offset);
                offset += encodings.string.encode.bytes;
              }
              encode4.bytes = offset - oldOffset;
              return buf;
            }
            function decode4(buf, offset, end) {
              if (!offset)
                offset = 0;
              if (!end)
                end = buf.length;
              if (!(end <= buf.length && offset <= buf.length))
                throw new Error("Decoded message is not valid");
              var oldOffset = offset;
              var obj = {
                id_1: "",
                id_2: "",
                id_3: ""
              };
              while (true) {
                if (end <= offset) {
                  decode4.bytes = offset - oldOffset;
                  return obj;
                }
                var prefix = varint.decode(buf, offset);
                offset += varint.decode.bytes;
                var tag = prefix >> 3;
                switch (tag) {
                  case 1:
                    obj.id_1 = encodings.string.decode(buf, offset);
                    offset += encodings.string.decode.bytes;
                    break;
                  case 2:
                    obj.id_2 = encodings.string.decode(buf, offset);
                    offset += encodings.string.decode.bytes;
                    break;
                  case 3:
                    obj.id_3 = encodings.string.decode(buf, offset);
                    offset += encodings.string.decode.bytes;
                    break;
                  default:
                    offset = skip(prefix & 7, buf, offset);
                }
              }
            }
          }
          Params.encodingLength = encodingLength3;
          Params.encode = encode3;
          Params.decode = decode3;
          function encodingLength3(obj) {
            var length = 0;
            if (defined(obj.ids)) {
              var len = Ids.encodingLength(obj.ids);
              length += varint.encodingLength(len);
              length += 1 + len;
            }
            return length;
          }
          function encode3(obj, buf, offset) {
            if (!offset)
              offset = 0;
            if (!buf)
              buf = Buffer.allocUnsafe(encodingLength3(obj));
            var oldOffset = offset;
            if (defined(obj.ids)) {
              buf[offset++] = 18;
              varint.encode(Ids.encodingLength(obj.ids), buf, offset);
              offset += varint.encode.bytes;
              Ids.encode(obj.ids, buf, offset);
              offset += Ids.encode.bytes;
            }
            encode3.bytes = offset - oldOffset;
            return buf;
          }
          function decode3(buf, offset, end) {
            if (!offset)
              offset = 0;
            if (!end)
              end = buf.length;
            if (!(end <= buf.length && offset <= buf.length))
              throw new Error("Decoded message is not valid");
            var oldOffset = offset;
            var obj = {
              ids: null
            };
            while (true) {
              if (end <= offset) {
                decode3.bytes = offset - oldOffset;
                return obj;
              }
              var prefix = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              var tag = prefix >> 3;
              switch (tag) {
                case 2:
                  var len = varint.decode(buf, offset);
                  offset += varint.decode.bytes;
                  obj.ids = Ids.decode(buf, offset, offset + len);
                  offset += Ids.decode.bytes;
                  break;
                default:
                  offset = skip(prefix & 7, buf, offset);
              }
            }
          }
        }
        Sound.encodingLength = encodingLength2;
        Sound.encode = encode2;
        Sound.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.params)) {
            var len = Params.encodingLength(obj.params);
            length += varint.encodingLength(len);
            length += 1 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.params)) {
            buf[offset++] = 10;
            varint.encode(Params.encodingLength(obj.params), buf, offset);
            offset += varint.encode.bytes;
            Params.encode(obj.params, buf, offset);
            offset += Params.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            params: null
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 1:
                var len = varint.decode(buf, offset);
                offset += varint.decode.bytes;
                obj.params = Params.decode(buf, offset, offset + len);
                offset += Params.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      SoundInfoParams.encodingLength = encodingLength;
      SoundInfoParams.encode = encode;
      SoundInfoParams.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.sound)) {
          var len = Sound.encodingLength(obj.sound);
          length += varint.encodingLength(len);
          length += 2 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.sound)) {
          buf[offset++] = 242;
          buf[offset++] = 5;
          varint.encode(Sound.encodingLength(obj.sound), buf, offset);
          offset += varint.encode.bytes;
          Sound.encode(obj.sound, buf, offset);
          offset += Sound.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          sound: null
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 94:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.sound = Sound.decode(buf, offset, offset + len);
              offset += Sound.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defineNotificationPreferences() {
      var Preference = NotificationPreferences.Preference = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      definePreference();
      function definePreference() {
        Preference.encodingLength = encodingLength2;
        Preference.encode = encode2;
        Preference.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.index)) {
            var len = encodings.int32.encodingLength(obj.index);
            length += 1 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.index)) {
            buf[offset++] = 8;
            encodings.int32.encode(obj.index, buf, offset);
            offset += encodings.int32.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            index: 0
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 1:
                obj.index = encodings.int32.decode(buf, offset);
                offset += encodings.int32.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      NotificationPreferences.encodingLength = encodingLength;
      NotificationPreferences.encode = encode;
      NotificationPreferences.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.channel_id)) {
          var len = encodings.string.encodingLength(obj.channel_id);
          length += 1 + len;
        }
        if (defined(obj.pref_id)) {
          var len = Preference.encodingLength(obj.pref_id);
          length += varint.encodingLength(len);
          length += 1 + len;
        }
        if (defined(obj.number_0)) {
          var len = encodings.int32.encodingLength(obj.number_0);
          length += 1 + len;
        }
        if (defined(obj.number_1)) {
          var len = encodings.int32.encodingLength(obj.number_1);
          length += 1 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.channel_id)) {
          buf[offset++] = 10;
          encodings.string.encode(obj.channel_id, buf, offset);
          offset += encodings.string.encode.bytes;
        }
        if (defined(obj.pref_id)) {
          buf[offset++] = 18;
          varint.encode(Preference.encodingLength(obj.pref_id), buf, offset);
          offset += varint.encode.bytes;
          Preference.encode(obj.pref_id, buf, offset);
          offset += Preference.encode.bytes;
        }
        if (defined(obj.number_0)) {
          buf[offset++] = 24;
          encodings.int32.encode(obj.number_0, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        if (defined(obj.number_1)) {
          buf[offset++] = 32;
          encodings.int32.encode(obj.number_1, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          channel_id: "",
          pref_id: null,
          number_0: 0,
          number_1: 0
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 1:
              obj.channel_id = encodings.string.decode(buf, offset);
              offset += encodings.string.decode.bytes;
              break;
            case 2:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.pref_id = Preference.decode(buf, offset, offset + len);
              offset += Preference.decode.bytes;
              break;
            case 3:
              obj.number_0 = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            case 4:
              obj.number_1 = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defineLiveMessageParams() {
      var Params = LiveMessageParams.Params = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      defineParams();
      function defineParams() {
        var Ids = Params.Ids = {
          buffer: true,
          encodingLength: null,
          encode: null,
          decode: null
        };
        defineIds();
        function defineIds() {
          Ids.encodingLength = encodingLength3;
          Ids.encode = encode3;
          Ids.decode = decode3;
          function encodingLength3(obj) {
            var length = 0;
            if (defined(obj.channel_id)) {
              var len = encodings.string.encodingLength(obj.channel_id);
              length += 1 + len;
            }
            if (defined(obj.video_id)) {
              var len = encodings.string.encodingLength(obj.video_id);
              length += 1 + len;
            }
            return length;
          }
          function encode3(obj, buf, offset) {
            if (!offset)
              offset = 0;
            if (!buf)
              buf = Buffer.allocUnsafe(encodingLength3(obj));
            var oldOffset = offset;
            if (defined(obj.channel_id)) {
              buf[offset++] = 10;
              encodings.string.encode(obj.channel_id, buf, offset);
              offset += encodings.string.encode.bytes;
            }
            if (defined(obj.video_id)) {
              buf[offset++] = 18;
              encodings.string.encode(obj.video_id, buf, offset);
              offset += encodings.string.encode.bytes;
            }
            encode3.bytes = offset - oldOffset;
            return buf;
          }
          function decode3(buf, offset, end) {
            if (!offset)
              offset = 0;
            if (!end)
              end = buf.length;
            if (!(end <= buf.length && offset <= buf.length))
              throw new Error("Decoded message is not valid");
            var oldOffset = offset;
            var obj = {
              channel_id: "",
              video_id: ""
            };
            while (true) {
              if (end <= offset) {
                decode3.bytes = offset - oldOffset;
                return obj;
              }
              var prefix = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              var tag = prefix >> 3;
              switch (tag) {
                case 1:
                  obj.channel_id = encodings.string.decode(buf, offset);
                  offset += encodings.string.decode.bytes;
                  break;
                case 2:
                  obj.video_id = encodings.string.decode(buf, offset);
                  offset += encodings.string.decode.bytes;
                  break;
                default:
                  offset = skip(prefix & 7, buf, offset);
              }
            }
          }
        }
        Params.encodingLength = encodingLength2;
        Params.encode = encode2;
        Params.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.ids)) {
            var len = Ids.encodingLength(obj.ids);
            length += varint.encodingLength(len);
            length += 1 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.ids)) {
            buf[offset++] = 42;
            varint.encode(Ids.encodingLength(obj.ids), buf, offset);
            offset += varint.encode.bytes;
            Ids.encode(obj.ids, buf, offset);
            offset += Ids.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            ids: null
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 5:
                var len = varint.decode(buf, offset);
                offset += varint.decode.bytes;
                obj.ids = Ids.decode(buf, offset, offset + len);
                offset += Ids.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      LiveMessageParams.encodingLength = encodingLength;
      LiveMessageParams.encode = encode;
      LiveMessageParams.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.params)) {
          var len = Params.encodingLength(obj.params);
          length += varint.encodingLength(len);
          length += 1 + len;
        }
        if (defined(obj.number_0)) {
          var len = encodings.int32.encodingLength(obj.number_0);
          length += 1 + len;
        }
        if (defined(obj.number_1)) {
          var len = encodings.int32.encodingLength(obj.number_1);
          length += 1 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.params)) {
          buf[offset++] = 10;
          varint.encode(Params.encodingLength(obj.params), buf, offset);
          offset += varint.encode.bytes;
          Params.encode(obj.params, buf, offset);
          offset += Params.encode.bytes;
        }
        if (defined(obj.number_0)) {
          buf[offset++] = 16;
          encodings.int32.encode(obj.number_0, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        if (defined(obj.number_1)) {
          buf[offset++] = 24;
          encodings.int32.encode(obj.number_1, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          params: null,
          number_0: 0,
          number_1: 0
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 1:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.params = Params.decode(buf, offset, offset + len);
              offset += Params.decode.bytes;
              break;
            case 2:
              obj.number_0 = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            case 3:
              obj.number_1 = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defineGetCommentsSectionParams() {
      var Context = GetCommentsSectionParams.Context = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      var Params = GetCommentsSectionParams.Params = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      defineContext();
      defineParams();
      function defineContext() {
        Context.encodingLength = encodingLength2;
        Context.encode = encode2;
        Context.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.video_id)) {
            var len = encodings.string.encodingLength(obj.video_id);
            length += 1 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.video_id)) {
            buf[offset++] = 18;
            encodings.string.encode(obj.video_id, buf, offset);
            offset += encodings.string.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            video_id: ""
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 2:
                obj.video_id = encodings.string.decode(buf, offset);
                offset += encodings.string.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      function defineParams() {
        var Options = Params.Options = {
          buffer: true,
          encodingLength: null,
          encode: null,
          decode: null
        };
        var RepliesOptions = Params.RepliesOptions = {
          buffer: true,
          encodingLength: null,
          encode: null,
          decode: null
        };
        defineOptions();
        defineRepliesOptions();
        function defineOptions() {
          Options.encodingLength = encodingLength3;
          Options.encode = encode3;
          Options.decode = decode3;
          function encodingLength3(obj) {
            var length = 0;
            if (defined(obj.video_id)) {
              var len = encodings.string.encodingLength(obj.video_id);
              length += 1 + len;
            }
            if (defined(obj.sort_by)) {
              var len = encodings.int32.encodingLength(obj.sort_by);
              length += 1 + len;
            }
            if (defined(obj.type)) {
              var len = encodings.int32.encodingLength(obj.type);
              length += 1 + len;
            }
            return length;
          }
          function encode3(obj, buf, offset) {
            if (!offset)
              offset = 0;
            if (!buf)
              buf = Buffer.allocUnsafe(encodingLength3(obj));
            var oldOffset = offset;
            if (defined(obj.video_id)) {
              buf[offset++] = 34;
              encodings.string.encode(obj.video_id, buf, offset);
              offset += encodings.string.encode.bytes;
            }
            if (defined(obj.sort_by)) {
              buf[offset++] = 48;
              encodings.int32.encode(obj.sort_by, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            if (defined(obj.type)) {
              buf[offset++] = 120;
              encodings.int32.encode(obj.type, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            encode3.bytes = offset - oldOffset;
            return buf;
          }
          function decode3(buf, offset, end) {
            if (!offset)
              offset = 0;
            if (!end)
              end = buf.length;
            if (!(end <= buf.length && offset <= buf.length))
              throw new Error("Decoded message is not valid");
            var oldOffset = offset;
            var obj = {
              video_id: "",
              sort_by: 0,
              type: 0
            };
            while (true) {
              if (end <= offset) {
                decode3.bytes = offset - oldOffset;
                return obj;
              }
              var prefix = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              var tag = prefix >> 3;
              switch (tag) {
                case 4:
                  obj.video_id = encodings.string.decode(buf, offset);
                  offset += encodings.string.decode.bytes;
                  break;
                case 6:
                  obj.sort_by = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                case 15:
                  obj.type = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                default:
                  offset = skip(prefix & 7, buf, offset);
              }
            }
          }
        }
        function defineRepliesOptions() {
          var UnkOpts = RepliesOptions.UnkOpts = {
            buffer: true,
            encodingLength: null,
            encode: null,
            decode: null
          };
          defineUnkOpts();
          function defineUnkOpts() {
            UnkOpts.encodingLength = encodingLength4;
            UnkOpts.encode = encode4;
            UnkOpts.decode = decode4;
            function encodingLength4(obj) {
              var length = 0;
              if (defined(obj.unk_param)) {
                var len = encodings.int32.encodingLength(obj.unk_param);
                length += 1 + len;
              }
              return length;
            }
            function encode4(obj, buf, offset) {
              if (!offset)
                offset = 0;
              if (!buf)
                buf = Buffer.allocUnsafe(encodingLength4(obj));
              var oldOffset = offset;
              if (defined(obj.unk_param)) {
                buf[offset++] = 8;
                encodings.int32.encode(obj.unk_param, buf, offset);
                offset += encodings.int32.encode.bytes;
              }
              encode4.bytes = offset - oldOffset;
              return buf;
            }
            function decode4(buf, offset, end) {
              if (!offset)
                offset = 0;
              if (!end)
                end = buf.length;
              if (!(end <= buf.length && offset <= buf.length))
                throw new Error("Decoded message is not valid");
              var oldOffset = offset;
              var obj = {
                unk_param: 0
              };
              while (true) {
                if (end <= offset) {
                  decode4.bytes = offset - oldOffset;
                  return obj;
                }
                var prefix = varint.decode(buf, offset);
                offset += varint.decode.bytes;
                var tag = prefix >> 3;
                switch (tag) {
                  case 1:
                    obj.unk_param = encodings.int32.decode(buf, offset);
                    offset += encodings.int32.decode.bytes;
                    break;
                  default:
                    offset = skip(prefix & 7, buf, offset);
                }
              }
            }
          }
          RepliesOptions.encodingLength = encodingLength3;
          RepliesOptions.encode = encode3;
          RepliesOptions.decode = decode3;
          function encodingLength3(obj) {
            var length = 0;
            if (defined(obj.comment_id)) {
              var len = encodings.string.encodingLength(obj.comment_id);
              length += 1 + len;
            }
            if (defined(obj.unkopts)) {
              var len = UnkOpts.encodingLength(obj.unkopts);
              length += varint.encodingLength(len);
              length += 1 + len;
            }
            if (defined(obj.channel_id)) {
              var len = encodings.string.encodingLength(obj.channel_id);
              length += 1 + len;
            }
            if (defined(obj.video_id)) {
              var len = encodings.string.encodingLength(obj.video_id);
              length += 1 + len;
            }
            if (defined(obj.unk_param_1)) {
              var len = encodings.int32.encodingLength(obj.unk_param_1);
              length += 1 + len;
            }
            if (defined(obj.unk_param_2)) {
              var len = encodings.int32.encodingLength(obj.unk_param_2);
              length += 1 + len;
            }
            return length;
          }
          function encode3(obj, buf, offset) {
            if (!offset)
              offset = 0;
            if (!buf)
              buf = Buffer.allocUnsafe(encodingLength3(obj));
            var oldOffset = offset;
            if (defined(obj.comment_id)) {
              buf[offset++] = 18;
              encodings.string.encode(obj.comment_id, buf, offset);
              offset += encodings.string.encode.bytes;
            }
            if (defined(obj.unkopts)) {
              buf[offset++] = 34;
              varint.encode(UnkOpts.encodingLength(obj.unkopts), buf, offset);
              offset += varint.encode.bytes;
              UnkOpts.encode(obj.unkopts, buf, offset);
              offset += UnkOpts.encode.bytes;
            }
            if (defined(obj.channel_id)) {
              buf[offset++] = 42;
              encodings.string.encode(obj.channel_id, buf, offset);
              offset += encodings.string.encode.bytes;
            }
            if (defined(obj.video_id)) {
              buf[offset++] = 50;
              encodings.string.encode(obj.video_id, buf, offset);
              offset += encodings.string.encode.bytes;
            }
            if (defined(obj.unk_param_1)) {
              buf[offset++] = 64;
              encodings.int32.encode(obj.unk_param_1, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            if (defined(obj.unk_param_2)) {
              buf[offset++] = 72;
              encodings.int32.encode(obj.unk_param_2, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            encode3.bytes = offset - oldOffset;
            return buf;
          }
          function decode3(buf, offset, end) {
            if (!offset)
              offset = 0;
            if (!end)
              end = buf.length;
            if (!(end <= buf.length && offset <= buf.length))
              throw new Error("Decoded message is not valid");
            var oldOffset = offset;
            var obj = {
              comment_id: "",
              unkopts: null,
              channel_id: "",
              video_id: "",
              unk_param_1: 0,
              unk_param_2: 0
            };
            while (true) {
              if (end <= offset) {
                decode3.bytes = offset - oldOffset;
                return obj;
              }
              var prefix = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              var tag = prefix >> 3;
              switch (tag) {
                case 2:
                  obj.comment_id = encodings.string.decode(buf, offset);
                  offset += encodings.string.decode.bytes;
                  break;
                case 4:
                  var len = varint.decode(buf, offset);
                  offset += varint.decode.bytes;
                  obj.unkopts = UnkOpts.decode(buf, offset, offset + len);
                  offset += UnkOpts.decode.bytes;
                  break;
                case 5:
                  obj.channel_id = encodings.string.decode(buf, offset);
                  offset += encodings.string.decode.bytes;
                  break;
                case 6:
                  obj.video_id = encodings.string.decode(buf, offset);
                  offset += encodings.string.decode.bytes;
                  break;
                case 8:
                  obj.unk_param_1 = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                case 9:
                  obj.unk_param_2 = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                default:
                  offset = skip(prefix & 7, buf, offset);
              }
            }
          }
        }
        Params.encodingLength = encodingLength2;
        Params.encode = encode2;
        Params.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.unk_token)) {
            var len = encodings.string.encodingLength(obj.unk_token);
            length += 1 + len;
          }
          if (defined(obj.opts)) {
            var len = Options.encodingLength(obj.opts);
            length += varint.encodingLength(len);
            length += 1 + len;
          }
          if (defined(obj.replies_opts)) {
            var len = RepliesOptions.encodingLength(obj.replies_opts);
            length += varint.encodingLength(len);
            length += 1 + len;
          }
          if (defined(obj.page)) {
            var len = encodings.int32.encodingLength(obj.page);
            length += 1 + len;
          }
          if (defined(obj.target)) {
            var len = encodings.string.encodingLength(obj.target);
            length += 1 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.unk_token)) {
            buf[offset++] = 10;
            encodings.string.encode(obj.unk_token, buf, offset);
            offset += encodings.string.encode.bytes;
          }
          if (defined(obj.opts)) {
            buf[offset++] = 34;
            varint.encode(Options.encodingLength(obj.opts), buf, offset);
            offset += varint.encode.bytes;
            Options.encode(obj.opts, buf, offset);
            offset += Options.encode.bytes;
          }
          if (defined(obj.replies_opts)) {
            buf[offset++] = 26;
            varint.encode(RepliesOptions.encodingLength(obj.replies_opts), buf, offset);
            offset += varint.encode.bytes;
            RepliesOptions.encode(obj.replies_opts, buf, offset);
            offset += RepliesOptions.encode.bytes;
          }
          if (defined(obj.page)) {
            buf[offset++] = 40;
            encodings.int32.encode(obj.page, buf, offset);
            offset += encodings.int32.encode.bytes;
          }
          if (defined(obj.target)) {
            buf[offset++] = 66;
            encodings.string.encode(obj.target, buf, offset);
            offset += encodings.string.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            unk_token: "",
            opts: null,
            replies_opts: null,
            page: 0,
            target: ""
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 1:
                obj.unk_token = encodings.string.decode(buf, offset);
                offset += encodings.string.decode.bytes;
                break;
              case 4:
                var len = varint.decode(buf, offset);
                offset += varint.decode.bytes;
                obj.opts = Options.decode(buf, offset, offset + len);
                offset += Options.decode.bytes;
                break;
              case 3:
                var len = varint.decode(buf, offset);
                offset += varint.decode.bytes;
                obj.replies_opts = RepliesOptions.decode(buf, offset, offset + len);
                offset += RepliesOptions.decode.bytes;
                break;
              case 5:
                obj.page = encodings.int32.decode(buf, offset);
                offset += encodings.int32.decode.bytes;
                break;
              case 8:
                obj.target = encodings.string.decode(buf, offset);
                offset += encodings.string.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      GetCommentsSectionParams.encodingLength = encodingLength;
      GetCommentsSectionParams.encode = encode;
      GetCommentsSectionParams.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.ctx)) {
          var len = Context.encodingLength(obj.ctx);
          length += varint.encodingLength(len);
          length += 1 + len;
        }
        if (defined(obj.unk_param)) {
          var len = encodings.int32.encodingLength(obj.unk_param);
          length += 1 + len;
        }
        if (defined(obj.params)) {
          var len = Params.encodingLength(obj.params);
          length += varint.encodingLength(len);
          length += 1 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.ctx)) {
          buf[offset++] = 18;
          varint.encode(Context.encodingLength(obj.ctx), buf, offset);
          offset += varint.encode.bytes;
          Context.encode(obj.ctx, buf, offset);
          offset += Context.encode.bytes;
        }
        if (defined(obj.unk_param)) {
          buf[offset++] = 24;
          encodings.int32.encode(obj.unk_param, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        if (defined(obj.params)) {
          buf[offset++] = 50;
          varint.encode(Params.encodingLength(obj.params), buf, offset);
          offset += varint.encode.bytes;
          Params.encode(obj.params, buf, offset);
          offset += Params.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          ctx: null,
          unk_param: 0,
          params: null
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 2:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.ctx = Context.decode(buf, offset, offset + len);
              offset += Context.decode.bytes;
              break;
            case 3:
              obj.unk_param = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            case 6:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.params = Params.decode(buf, offset, offset + len);
              offset += Params.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defineCreateCommentParams() {
      var Params = CreateCommentParams.Params = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      defineParams();
      function defineParams() {
        Params.encodingLength = encodingLength2;
        Params.encode = encode2;
        Params.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.index)) {
            var len = encodings.int32.encodingLength(obj.index);
            length += 1 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.index)) {
            buf[offset++] = 8;
            encodings.int32.encode(obj.index, buf, offset);
            offset += encodings.int32.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            index: 0
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 1:
                obj.index = encodings.int32.decode(buf, offset);
                offset += encodings.int32.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      CreateCommentParams.encodingLength = encodingLength;
      CreateCommentParams.encode = encode;
      CreateCommentParams.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.video_id)) {
          var len = encodings.string.encodingLength(obj.video_id);
          length += 1 + len;
        }
        if (defined(obj.params)) {
          var len = Params.encodingLength(obj.params);
          length += varint.encodingLength(len);
          length += 1 + len;
        }
        if (defined(obj.number)) {
          var len = encodings.int32.encodingLength(obj.number);
          length += 1 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.video_id)) {
          buf[offset++] = 18;
          encodings.string.encode(obj.video_id, buf, offset);
          offset += encodings.string.encode.bytes;
        }
        if (defined(obj.params)) {
          buf[offset++] = 42;
          varint.encode(Params.encodingLength(obj.params), buf, offset);
          offset += varint.encode.bytes;
          Params.encode(obj.params, buf, offset);
          offset += Params.encode.bytes;
        }
        if (defined(obj.number)) {
          buf[offset++] = 80;
          encodings.int32.encode(obj.number, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          video_id: "",
          params: null,
          number: 0
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 2:
              obj.video_id = encodings.string.decode(buf, offset);
              offset += encodings.string.decode.bytes;
              break;
            case 5:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.params = Params.decode(buf, offset, offset + len);
              offset += Params.decode.bytes;
              break;
            case 10:
              obj.number = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defineCreateCommentReplyParams() {
      var UnknownParams = CreateCommentReplyParams.UnknownParams = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      defineUnknownParams();
      function defineUnknownParams() {
        UnknownParams.encodingLength = encodingLength2;
        UnknownParams.encode = encode2;
        UnknownParams.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.unk_num)) {
            var len = encodings.int32.encodingLength(obj.unk_num);
            length += 1 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.unk_num)) {
            buf[offset++] = 8;
            encodings.int32.encode(obj.unk_num, buf, offset);
            offset += encodings.int32.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            unk_num: 0
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 1:
                obj.unk_num = encodings.int32.decode(buf, offset);
                offset += encodings.int32.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      CreateCommentReplyParams.encodingLength = encodingLength;
      CreateCommentReplyParams.encode = encode;
      CreateCommentReplyParams.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.video_id)) {
          var len = encodings.string.encodingLength(obj.video_id);
          length += 1 + len;
        }
        if (defined(obj.comment_id)) {
          var len = encodings.string.encodingLength(obj.comment_id);
          length += 1 + len;
        }
        if (defined(obj.params)) {
          var len = UnknownParams.encodingLength(obj.params);
          length += varint.encodingLength(len);
          length += 1 + len;
        }
        if (defined(obj.unk_num)) {
          var len = encodings.int32.encodingLength(obj.unk_num);
          length += 1 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.video_id)) {
          buf[offset++] = 18;
          encodings.string.encode(obj.video_id, buf, offset);
          offset += encodings.string.encode.bytes;
        }
        if (defined(obj.comment_id)) {
          buf[offset++] = 34;
          encodings.string.encode(obj.comment_id, buf, offset);
          offset += encodings.string.encode.bytes;
        }
        if (defined(obj.params)) {
          buf[offset++] = 42;
          varint.encode(UnknownParams.encodingLength(obj.params), buf, offset);
          offset += varint.encode.bytes;
          UnknownParams.encode(obj.params, buf, offset);
          offset += UnknownParams.encode.bytes;
        }
        if (defined(obj.unk_num)) {
          buf[offset++] = 80;
          encodings.int32.encode(obj.unk_num, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          video_id: "",
          comment_id: "",
          params: null,
          unk_num: 0
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 2:
              obj.video_id = encodings.string.decode(buf, offset);
              offset += encodings.string.decode.bytes;
              break;
            case 4:
              obj.comment_id = encodings.string.decode(buf, offset);
              offset += encodings.string.decode.bytes;
              break;
            case 5:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.params = UnknownParams.decode(buf, offset, offset + len);
              offset += UnknownParams.decode.bytes;
              break;
            case 10:
              obj.unk_num = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function definePeformCommentActionParams() {
      var TranslateCommentParams = PeformCommentActionParams.TranslateCommentParams = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      defineTranslateCommentParams();
      function defineTranslateCommentParams() {
        var Params = TranslateCommentParams.Params = {
          buffer: true,
          encodingLength: null,
          encode: null,
          decode: null
        };
        defineParams();
        function defineParams() {
          var Comment = Params.Comment = {
            buffer: true,
            encodingLength: null,
            encode: null,
            decode: null
          };
          defineComment();
          function defineComment() {
            Comment.encodingLength = encodingLength4;
            Comment.encode = encode4;
            Comment.decode = decode4;
            function encodingLength4(obj) {
              var length = 0;
              if (defined(obj.text)) {
                var len = encodings.string.encodingLength(obj.text);
                length += 1 + len;
              }
              return length;
            }
            function encode4(obj, buf, offset) {
              if (!offset)
                offset = 0;
              if (!buf)
                buf = Buffer.allocUnsafe(encodingLength4(obj));
              var oldOffset = offset;
              if (defined(obj.text)) {
                buf[offset++] = 10;
                encodings.string.encode(obj.text, buf, offset);
                offset += encodings.string.encode.bytes;
              }
              encode4.bytes = offset - oldOffset;
              return buf;
            }
            function decode4(buf, offset, end) {
              if (!offset)
                offset = 0;
              if (!end)
                end = buf.length;
              if (!(end <= buf.length && offset <= buf.length))
                throw new Error("Decoded message is not valid");
              var oldOffset = offset;
              var obj = {
                text: ""
              };
              while (true) {
                if (end <= offset) {
                  decode4.bytes = offset - oldOffset;
                  return obj;
                }
                var prefix = varint.decode(buf, offset);
                offset += varint.decode.bytes;
                var tag = prefix >> 3;
                switch (tag) {
                  case 1:
                    obj.text = encodings.string.decode(buf, offset);
                    offset += encodings.string.decode.bytes;
                    break;
                  default:
                    offset = skip(prefix & 7, buf, offset);
                }
              }
            }
          }
          Params.encodingLength = encodingLength3;
          Params.encode = encode3;
          Params.decode = decode3;
          function encodingLength3(obj) {
            var length = 0;
            if (defined(obj.comment)) {
              var len = Comment.encodingLength(obj.comment);
              length += varint.encodingLength(len);
              length += 1 + len;
            }
            return length;
          }
          function encode3(obj, buf, offset) {
            if (!offset)
              offset = 0;
            if (!buf)
              buf = Buffer.allocUnsafe(encodingLength3(obj));
            var oldOffset = offset;
            if (defined(obj.comment)) {
              buf[offset++] = 10;
              varint.encode(Comment.encodingLength(obj.comment), buf, offset);
              offset += varint.encode.bytes;
              Comment.encode(obj.comment, buf, offset);
              offset += Comment.encode.bytes;
            }
            encode3.bytes = offset - oldOffset;
            return buf;
          }
          function decode3(buf, offset, end) {
            if (!offset)
              offset = 0;
            if (!end)
              end = buf.length;
            if (!(end <= buf.length && offset <= buf.length))
              throw new Error("Decoded message is not valid");
            var oldOffset = offset;
            var obj = {
              comment: null
            };
            while (true) {
              if (end <= offset) {
                decode3.bytes = offset - oldOffset;
                return obj;
              }
              var prefix = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              var tag = prefix >> 3;
              switch (tag) {
                case 1:
                  var len = varint.decode(buf, offset);
                  offset += varint.decode.bytes;
                  obj.comment = Comment.decode(buf, offset, offset + len);
                  offset += Comment.decode.bytes;
                  break;
                default:
                  offset = skip(prefix & 7, buf, offset);
              }
            }
          }
        }
        TranslateCommentParams.encodingLength = encodingLength2;
        TranslateCommentParams.encode = encode2;
        TranslateCommentParams.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.params)) {
            var len = Params.encodingLength(obj.params);
            length += varint.encodingLength(len);
            length += 1 + len;
          }
          if (defined(obj.comment_id)) {
            var len = encodings.string.encodingLength(obj.comment_id);
            length += 1 + len;
          }
          if (defined(obj.target_language)) {
            var len = encodings.string.encodingLength(obj.target_language);
            length += 1 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.params)) {
            buf[offset++] = 26;
            varint.encode(Params.encodingLength(obj.params), buf, offset);
            offset += varint.encode.bytes;
            Params.encode(obj.params, buf, offset);
            offset += Params.encode.bytes;
          }
          if (defined(obj.comment_id)) {
            buf[offset++] = 18;
            encodings.string.encode(obj.comment_id, buf, offset);
            offset += encodings.string.encode.bytes;
          }
          if (defined(obj.target_language)) {
            buf[offset++] = 34;
            encodings.string.encode(obj.target_language, buf, offset);
            offset += encodings.string.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            params: null,
            comment_id: "",
            target_language: ""
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 3:
                var len = varint.decode(buf, offset);
                offset += varint.decode.bytes;
                obj.params = Params.decode(buf, offset, offset + len);
                offset += Params.decode.bytes;
                break;
              case 2:
                obj.comment_id = encodings.string.decode(buf, offset);
                offset += encodings.string.decode.bytes;
                break;
              case 4:
                obj.target_language = encodings.string.decode(buf, offset);
                offset += encodings.string.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      PeformCommentActionParams.encodingLength = encodingLength;
      PeformCommentActionParams.encode = encode;
      PeformCommentActionParams.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.type)) {
          var len = encodings.int32.encodingLength(obj.type);
          length += 1 + len;
        }
        if (defined(obj.comment_id)) {
          var len = encodings.string.encodingLength(obj.comment_id);
          length += 1 + len;
        }
        if (defined(obj.video_id)) {
          var len = encodings.string.encodingLength(obj.video_id);
          length += 1 + len;
        }
        if (defined(obj.unk_num)) {
          var len = encodings.int32.encodingLength(obj.unk_num);
          length += 1 + len;
        }
        if (defined(obj.channel_id)) {
          var len = encodings.string.encodingLength(obj.channel_id);
          length += 2 + len;
        }
        if (defined(obj.translate_comment_params)) {
          var len = TranslateCommentParams.encodingLength(obj.translate_comment_params);
          length += varint.encodingLength(len);
          length += 2 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.type)) {
          buf[offset++] = 8;
          encodings.int32.encode(obj.type, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        if (defined(obj.comment_id)) {
          buf[offset++] = 26;
          encodings.string.encode(obj.comment_id, buf, offset);
          offset += encodings.string.encode.bytes;
        }
        if (defined(obj.video_id)) {
          buf[offset++] = 42;
          encodings.string.encode(obj.video_id, buf, offset);
          offset += encodings.string.encode.bytes;
        }
        if (defined(obj.unk_num)) {
          buf[offset++] = 16;
          encodings.int32.encode(obj.unk_num, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        if (defined(obj.channel_id)) {
          buf[offset++] = 186;
          buf[offset++] = 1;
          encodings.string.encode(obj.channel_id, buf, offset);
          offset += encodings.string.encode.bytes;
        }
        if (defined(obj.translate_comment_params)) {
          buf[offset++] = 250;
          buf[offset++] = 1;
          varint.encode(TranslateCommentParams.encodingLength(obj.translate_comment_params), buf, offset);
          offset += varint.encode.bytes;
          TranslateCommentParams.encode(obj.translate_comment_params, buf, offset);
          offset += TranslateCommentParams.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          type: 0,
          comment_id: "",
          video_id: "",
          unk_num: 0,
          channel_id: "",
          translate_comment_params: null
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 1:
              obj.type = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            case 3:
              obj.comment_id = encodings.string.decode(buf, offset);
              offset += encodings.string.decode.bytes;
              break;
            case 5:
              obj.video_id = encodings.string.decode(buf, offset);
              offset += encodings.string.decode.bytes;
              break;
            case 2:
              obj.unk_num = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            case 23:
              obj.channel_id = encodings.string.decode(buf, offset);
              offset += encodings.string.decode.bytes;
              break;
            case 31:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.translate_comment_params = TranslateCommentParams.decode(buf, offset, offset + len);
              offset += TranslateCommentParams.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defineMusicSearchFilter() {
      var Filters = MusicSearchFilter.Filters = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      defineFilters();
      function defineFilters() {
        var Type = Filters.Type = {
          buffer: true,
          encodingLength: null,
          encode: null,
          decode: null
        };
        defineType();
        function defineType() {
          Type.encodingLength = encodingLength3;
          Type.encode = encode3;
          Type.decode = decode3;
          function encodingLength3(obj) {
            var length = 0;
            if (defined(obj.all)) {
              var len = encodings.int32.encodingLength(obj.all);
              length += 1 + len;
            }
            if (defined(obj.song)) {
              var len = encodings.int32.encodingLength(obj.song);
              length += 1 + len;
            }
            if (defined(obj.video)) {
              var len = encodings.int32.encodingLength(obj.video);
              length += 1 + len;
            }
            if (defined(obj.album)) {
              var len = encodings.int32.encodingLength(obj.album);
              length += 1 + len;
            }
            if (defined(obj.artist)) {
              var len = encodings.int32.encodingLength(obj.artist);
              length += 1 + len;
            }
            if (defined(obj.playlist)) {
              var len = encodings.int32.encodingLength(obj.playlist);
              length += 1 + len;
            }
            return length;
          }
          function encode3(obj, buf, offset) {
            if (!offset)
              offset = 0;
            if (!buf)
              buf = Buffer.allocUnsafe(encodingLength3(obj));
            var oldOffset = offset;
            if (defined(obj.all)) {
              buf[offset++] = 0;
              encodings.int32.encode(obj.all, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            if (defined(obj.song)) {
              buf[offset++] = 8;
              encodings.int32.encode(obj.song, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            if (defined(obj.video)) {
              buf[offset++] = 16;
              encodings.int32.encode(obj.video, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            if (defined(obj.album)) {
              buf[offset++] = 24;
              encodings.int32.encode(obj.album, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            if (defined(obj.artist)) {
              buf[offset++] = 32;
              encodings.int32.encode(obj.artist, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            if (defined(obj.playlist)) {
              buf[offset++] = 40;
              encodings.int32.encode(obj.playlist, buf, offset);
              offset += encodings.int32.encode.bytes;
            }
            encode3.bytes = offset - oldOffset;
            return buf;
          }
          function decode3(buf, offset, end) {
            if (!offset)
              offset = 0;
            if (!end)
              end = buf.length;
            if (!(end <= buf.length && offset <= buf.length))
              throw new Error("Decoded message is not valid");
            var oldOffset = offset;
            var obj = {
              all: 0,
              song: 0,
              video: 0,
              album: 0,
              artist: 0,
              playlist: 0
            };
            while (true) {
              if (end <= offset) {
                decode3.bytes = offset - oldOffset;
                return obj;
              }
              var prefix = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              var tag = prefix >> 3;
              switch (tag) {
                case 0:
                  obj.all = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                case 1:
                  obj.song = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                case 2:
                  obj.video = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                case 3:
                  obj.album = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                case 4:
                  obj.artist = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                case 5:
                  obj.playlist = encodings.int32.decode(buf, offset);
                  offset += encodings.int32.decode.bytes;
                  break;
                default:
                  offset = skip(prefix & 7, buf, offset);
              }
            }
          }
        }
        Filters.encodingLength = encodingLength2;
        Filters.encode = encode2;
        Filters.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.type)) {
            var len = Type.encodingLength(obj.type);
            length += varint.encodingLength(len);
            length += 2 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.type)) {
            buf[offset++] = 138;
            buf[offset++] = 1;
            varint.encode(Type.encodingLength(obj.type), buf, offset);
            offset += varint.encode.bytes;
            Type.encode(obj.type, buf, offset);
            offset += Type.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            type: null
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 17:
                var len = varint.decode(buf, offset);
                offset += varint.decode.bytes;
                obj.type = Type.decode(buf, offset, offset + len);
                offset += Type.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      MusicSearchFilter.encodingLength = encodingLength;
      MusicSearchFilter.encode = encode;
      MusicSearchFilter.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.filters)) {
          var len = Filters.encodingLength(obj.filters);
          length += varint.encodingLength(len);
          length += 1 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.filters)) {
          buf[offset++] = 18;
          varint.encode(Filters.encodingLength(obj.filters), buf, offset);
          offset += varint.encode.bytes;
          Filters.encode(obj.filters, buf, offset);
          offset += Filters.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          filters: null
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 2:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.filters = Filters.decode(buf, offset, offset + len);
              offset += Filters.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defineSearchFilter() {
      var Filters = SearchFilter.Filters = {
        buffer: true,
        encodingLength: null,
        encode: null,
        decode: null
      };
      defineFilters();
      function defineFilters() {
        Filters.encodingLength = encodingLength2;
        Filters.encode = encode2;
        Filters.decode = decode2;
        function encodingLength2(obj) {
          var length = 0;
          if (defined(obj.upload_date)) {
            var len = encodings.int32.encodingLength(obj.upload_date);
            length += 1 + len;
          }
          if (defined(obj.type)) {
            var len = encodings.int32.encodingLength(obj.type);
            length += 1 + len;
          }
          if (defined(obj.duration)) {
            var len = encodings.int32.encodingLength(obj.duration);
            length += 1 + len;
          }
          return length;
        }
        function encode2(obj, buf, offset) {
          if (!offset)
            offset = 0;
          if (!buf)
            buf = Buffer.allocUnsafe(encodingLength2(obj));
          var oldOffset = offset;
          if (defined(obj.upload_date)) {
            buf[offset++] = 8;
            encodings.int32.encode(obj.upload_date, buf, offset);
            offset += encodings.int32.encode.bytes;
          }
          if (defined(obj.type)) {
            buf[offset++] = 16;
            encodings.int32.encode(obj.type, buf, offset);
            offset += encodings.int32.encode.bytes;
          }
          if (defined(obj.duration)) {
            buf[offset++] = 24;
            encodings.int32.encode(obj.duration, buf, offset);
            offset += encodings.int32.encode.bytes;
          }
          encode2.bytes = offset - oldOffset;
          return buf;
        }
        function decode2(buf, offset, end) {
          if (!offset)
            offset = 0;
          if (!end)
            end = buf.length;
          if (!(end <= buf.length && offset <= buf.length))
            throw new Error("Decoded message is not valid");
          var oldOffset = offset;
          var obj = {
            upload_date: 0,
            type: 0,
            duration: 0
          };
          while (true) {
            if (end <= offset) {
              decode2.bytes = offset - oldOffset;
              return obj;
            }
            var prefix = varint.decode(buf, offset);
            offset += varint.decode.bytes;
            var tag = prefix >> 3;
            switch (tag) {
              case 1:
                obj.upload_date = encodings.int32.decode(buf, offset);
                offset += encodings.int32.decode.bytes;
                break;
              case 2:
                obj.type = encodings.int32.decode(buf, offset);
                offset += encodings.int32.decode.bytes;
                break;
              case 3:
                obj.duration = encodings.int32.decode(buf, offset);
                offset += encodings.int32.decode.bytes;
                break;
              default:
                offset = skip(prefix & 7, buf, offset);
            }
          }
        }
      }
      SearchFilter.encodingLength = encodingLength;
      SearchFilter.encode = encode;
      SearchFilter.decode = decode;
      function encodingLength(obj) {
        var length = 0;
        if (defined(obj.sort_by)) {
          var len = encodings.int32.encodingLength(obj.sort_by);
          length += 1 + len;
        }
        if (defined(obj.no_filter)) {
          var len = encodings.int32.encodingLength(obj.no_filter);
          length += 2 + len;
        }
        if (defined(obj.filters)) {
          var len = Filters.encodingLength(obj.filters);
          length += varint.encodingLength(len);
          length += 1 + len;
        }
        return length;
      }
      function encode(obj, buf, offset) {
        if (!offset)
          offset = 0;
        if (!buf)
          buf = Buffer.allocUnsafe(encodingLength(obj));
        var oldOffset = offset;
        if (defined(obj.sort_by)) {
          buf[offset++] = 8;
          encodings.int32.encode(obj.sort_by, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        if (defined(obj.no_filter)) {
          buf[offset++] = 152;
          buf[offset++] = 1;
          encodings.int32.encode(obj.no_filter, buf, offset);
          offset += encodings.int32.encode.bytes;
        }
        if (defined(obj.filters)) {
          buf[offset++] = 18;
          varint.encode(Filters.encodingLength(obj.filters), buf, offset);
          offset += varint.encode.bytes;
          Filters.encode(obj.filters, buf, offset);
          offset += Filters.encode.bytes;
        }
        encode.bytes = offset - oldOffset;
        return buf;
      }
      function decode(buf, offset, end) {
        if (!offset)
          offset = 0;
        if (!end)
          end = buf.length;
        if (!(end <= buf.length && offset <= buf.length))
          throw new Error("Decoded message is not valid");
        var oldOffset = offset;
        var obj = {
          sort_by: 0,
          no_filter: 0,
          filters: null
        };
        while (true) {
          if (end <= offset) {
            decode.bytes = offset - oldOffset;
            return obj;
          }
          var prefix = varint.decode(buf, offset);
          offset += varint.decode.bytes;
          var tag = prefix >> 3;
          switch (tag) {
            case 1:
              obj.sort_by = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            case 19:
              obj.no_filter = encodings.int32.decode(buf, offset);
              offset += encodings.int32.decode.bytes;
              break;
            case 2:
              var len = varint.decode(buf, offset);
              offset += varint.decode.bytes;
              obj.filters = Filters.decode(buf, offset, offset + len);
              offset += Filters.decode.bytes;
              break;
            default:
              offset = skip(prefix & 7, buf, offset);
          }
        }
      }
    }
    function defined(val) {
      return val !== null && val !== void 0 && (typeof val !== "number" || !isNaN(val));
    }
  }
});

// lib/proto/index.js
var require_proto = __commonJS({
  "lib/proto/index.js"(exports2, module2) {
    "use strict";
    var messages = require_messages();
    var Proto2 = class {
      static encodeVisitorData(id, timestamp) {
        const buf = messages.VisitorData.encode({ id, timestamp });
        return encodeURIComponent(Buffer.from(buf).toString("base64").replace(/\/|\+/g, "_"));
      }
      static encodeChannelAnalyticsParams(channel_id) {
        const buf = messages.ChannelAnalytics.encode({
          params: {
            channel_id
          }
        });
        return encodeURIComponent(Buffer.from(buf).toString("base64"));
      }
      static encodeSearchFilters(filters) {
        const upload_date = {
          all: null,
          hour: 1,
          today: 2,
          week: 3,
          month: 4,
          year: 5
        };
        const type = {
          all: null,
          video: 1,
          channel: 2,
          playlist: 3,
          movie: 4
        };
        const duration = {
          all: null,
          short: 1,
          long: 2,
          medium: 3
        };
        const order = {
          relevance: null,
          rating: 1,
          upload_date: 2,
          view_count: 3
        };
        const data = {};
        if (filters)
          data.filters = {};
        else
          data.no_filter = 0;
        if (filters) {
          if (filters.upload_date && filters.type !== "video")
            throw new Error(`Upload date filter cannot be used with type ${filters.type}`);
          if (filters.upload_date) {
            data.filters.upload_date = upload_date[filters.upload_date];
          }
          if (filters.type) {
            data.filters.type = type[filters.type];
          }
          if (filters.duration) {
            data.filters.duration = duration[filters.duration];
          }
          if (filters.sort_by && filters.sort_by !== "relevance") {
            data.sort_by = order[filters.sort_by];
          }
        }
        const buf = messages.SearchFilter.encode(data);
        return encodeURIComponent(Buffer.from(buf).toString("base64"));
      }
      static encodeMusicSearchFilters(filters = {}) {
        const data = {
          filters: {
            type: {}
          }
        };
        data.filters.type[filters.type || "all"] = 1;
        const buf = messages.MusicSearchFilter.encode(data);
        return encodeURIComponent(Buffer.from(buf).toString("base64"));
      }
      static encodeMessageParams(channel_id, video_id) {
        const buf = messages.LiveMessageParams.encode({
          params: {
            ids: {
              channel_id,
              video_id
            }
          },
          number_0: 1,
          number_1: 4
        });
        return Buffer.from(encodeURIComponent(Buffer.from(buf).toString("base64"))).toString("base64");
      }
      static encodeCommentsSectionParams(video_id, options = {}) {
        const sort_options = {
          TOP_COMMENTS: 0,
          NEWEST_FIRST: 1
        };
        const buf = messages.GetCommentsSectionParams.encode({
          ctx: {
            video_id
          },
          unk_param: 6,
          params: {
            opts: {
              video_id,
              sort_by: sort_options[options.sort_by || "TOP_COMMENTS"],
              type: options.type || 2
            },
            target: "comments-section"
          }
        });
        return encodeURIComponent(Buffer.from(buf).toString("base64"));
      }
      static encodeCommentRepliesParams(video_id, comment_id) {
        const buf = messages.GetCommentsSectionParams.encode({
          ctx: {
            video_id
          },
          unk_param: 6,
          params: {
            replies_opts: {
              video_id,
              comment_id,
              unkopts: {
                unk_param: 0
              },
              unk_param_1: 1,
              unk_param_2: 10,
              channel_id: " "
            },
            target: `comment-replies-item-${comment_id}`
          }
        });
        return encodeURIComponent(Buffer.from(buf).toString("base64"));
      }
      static encodeCommentParams(video_id) {
        const buf = messages.CreateCommentParams.encode({
          video_id,
          params: {
            index: 0
          },
          number: 7
        });
        return encodeURIComponent(Buffer.from(buf).toString("base64"));
      }
      static encodeCommentReplyParams(comment_id, video_id) {
        const buf = messages.CreateCommentReplyParams.encode({
          video_id,
          comment_id,
          params: {
            unk_num: 0
          },
          unk_num: 7
        });
        return encodeURIComponent(Buffer.from(buf).toString("base64"));
      }
      static encodeCommentActionParams(type, args = {}) {
        const data = {};
        data.type = type;
        data.video_id = args.video_id || "";
        data.comment_id = args.comment_id || "";
        data.unk_num = 2;
        if (args.hasOwnProperty("text")) {
          args.comment_id && delete data.unk_num;
          data.translate_comment_params = {
            params: {
              comment: {
                text: args.text
              }
            },
            comment_id: args.comment_id || "",
            target_language: args.target_language
          };
        }
        const buf = messages.PeformCommentActionParams.encode(data);
        return encodeURIComponent(Buffer.from(buf).toString("base64"));
      }
      static encodeNotificationPref(channel_id, index) {
        const buf = messages.NotificationPreferences.encode({
          channel_id,
          pref_id: {
            index
          },
          number_0: 0,
          number_1: 4
        });
        return encodeURIComponent(Buffer.from(buf).toString("base64"));
      }
      static encodeSoundInfoParams(id) {
        const data = {
          sound: {
            params: {
              ids: {
                id_1: id,
                id_2: id,
                id_3: id
              }
            }
          }
        };
        const buf = messages.SoundInfoParams.encode(data);
        return encodeURIComponent(Buffer.from(buf).toString("base64"));
      }
    };
    module2.exports = Proto2;
  }
});

// lib/core/Actions.js
var require_Actions = __commonJS({
  "lib/core/Actions.js"(exports2, module2) {
    "use strict";
    var Uuid = require_dist();
    var Proto2 = require_proto();
    var Utils = require_Utils();
    var Constants = require_Constants();
    var Actions2 = class {
      #session;
      #request;
      constructor(session) {
        this.#session = session;
        this.#request = session.request;
      }
      async browse(id, args = {}) {
        if (this.#needsLogin(id) && !this.#session.logged_in)
          throw new Utils.InnertubeError("You are not signed in");
        const data = {};
        if (args.params)
          data.params = args.params;
        if (args.is_ctoken) {
          data.continuation = id;
        } else {
          data.browseId = id;
        }
        if (args.client) {
          data.client = args.client;
        }
        const response = await this.#request.post("/browse", data);
        return response;
      }
      async engage(action, args = {}) {
        if (!this.#session.logged_in && !args.hasOwnProperty("text"))
          throw new Utils.InnertubeError("You are not signed in");
        const data = {};
        switch (action) {
          case "like/like":
          case "like/dislike":
          case "like/removelike":
            data.target = {};
            data.target.videoId = args.video_id;
            if (args.params) {
              data.params = args.params;
            }
            break;
          case "subscription/subscribe":
          case "subscription/unsubscribe":
            data.channelIds = [args.channel_id];
            data.params = action === "subscription/subscribe" ? "EgIIAhgA" : "CgIIAhgA";
            break;
          case "comment/create_comment":
            data.commentText = args.text;
            data.createCommentParams = Proto2.encodeCommentParams(args.video_id);
            break;
          case "comment/create_comment_reply":
            data.createReplyParams = Proto2.encodeCommentReplyParams(args.comment_id, args.video_id);
            data.commentText = args.text;
            break;
          case "comment/perform_comment_action":
            const target_action = (() => {
              switch (args.comment_action) {
                case "like":
                  return Proto2.encodeCommentActionParams(5, args);
                case "dislike":
                  return Proto2.encodeCommentActionParams(4, args);
                case "translate":
                  return Proto2.encodeCommentActionParams(22, args);
                default:
                  break;
              }
            })();
            data.actions = [target_action];
            break;
          default:
            throw new Utils.InnertubeError("Action not implemented", action);
        }
        const response = await this.#request.post(`/${action}`, data);
        return response;
      }
      async account(action, args = {}) {
        if (!this.#session.logged_in)
          throw new Utils.InnertubeError("You are not signed in");
        const data = {
          client: args.client
        };
        switch (action) {
          case "account/set_setting":
            data.newValue = {
              boolValue: args.new_value
            };
            data.settingItemId = args.setting_item_id;
            break;
          case "account/accounts_list":
            break;
          default:
            throw new Utils.InnertubeError("Action not implemented", action);
        }
        const response = await this.#request.post(`/${action}`, data);
        return response;
      }
      async search(args = {}) {
        const data = { client: args.client };
        if (args.query) {
          data.query = args.query;
        }
        if (args.ctoken) {
          data.continuation = args.ctoken;
        }
        if (args.params) {
          data.params = args.params;
        }
        if (args.filters) {
          if (args.client == "YTMUSIC") {
            data.params = Proto2.encodeMusicSearchFilters(args.filters);
          } else {
            data.params = Proto2.encodeSearchFilters(args.filters);
          }
        }
        const response = await this.#request.post("/search", data);
        return response;
      }
      async searchSound(args = {}) {
        const data = {
          query: args.query,
          client: "ANDROID"
        };
        const response = await this.#request.post("/sfv/search", data);
        return response;
      }
      async channel(action, args = {}) {
        if (!this.#session.logged_in)
          throw new Utils.InnertubeError("You are not signed in");
        const data = {
          client: args.client || "ANDROID"
        };
        switch (action) {
          case "channel/edit_name":
            data.givenName = args.new_name;
            break;
          case "channel/edit_description":
            data.description = args.new_description;
            break;
          case "channel/get_profile_editor":
            break;
          default:
            throw new Utils.InnertubeError("Action not implemented", action);
        }
        const response = await this.#request.post(`/${action}`, data);
        return response;
      }
      async playlist(action, args = {}) {
        if (!this.#session.logged_in)
          throw new Utils.InnertubeError("You are not signed in");
        const data = {};
        switch (action) {
          case "playlist/create":
            data.title = args.title;
            data.videoIds = args.ids;
            break;
          case "playlist/delete":
            data.playlistId = args.playlist_id;
            break;
          case "browse/edit_playlist":
            data.playlistId = args.playlist_id;
            data.actions = args.ids.map((id) => {
              switch (args.action) {
                case "ACTION_ADD_VIDEO":
                  return {
                    action: args.action,
                    addedVideoId: id
                  };
                case "ACTION_REMOVE_VIDEO":
                  return {
                    action: args.action,
                    setVideoId: id
                  };
                default:
                  break;
              }
            });
            break;
          default:
            throw new Utils.InnertubeError("Action not implemented", action);
        }
        const response = await this.#request.post(`/${action}`, data);
        return response;
      }
      async notifications(action, args = {}) {
        if (!this.#session.logged_in)
          throw new Utils.InnertubeError("You are not signed in");
        const data = {};
        switch (action) {
          case "modify_channel_preference":
            const pref_types = {
              PERSONALIZED: 1,
              ALL: 2,
              NONE: 3
            };
            data.params = Proto2.encodeNotificationPref(args.channel_id, pref_types[args.pref.toUpperCase()]);
            break;
          case "get_notification_menu":
            data.notificationsMenuRequestType = "NOTIFICATIONS_MENU_REQUEST_TYPE_INBOX";
            if (args.ctoken)
              data.ctoken = args.ctoken;
            break;
          case "record_interactions":
            data.serializedRecordNotificationInteractionsRequest = args.params;
            break;
          case "get_unseen_count":
            break;
          default:
            throw new Utils.InnertubeError("Action not implemented", action);
        }
        const response = await this.#request.post(`/notification/${action}`, data);
        return response;
      }
      async livechat(action, args = {}) {
        const data = { client: args.client };
        switch (action) {
          case "live_chat/get_live_chat":
          case "live_chat/get_live_chat_replay":
            data.continuation = args.ctoken;
            break;
          case "live_chat/send_message":
            data.params = Proto2.encodeMessageParams(args.channel_id, args.video_id);
            data.clientMessageId = Uuid.v4();
            data.richMessage = {
              textSegments: [{
                text: args.text
              }]
            };
            break;
          case "live_chat/get_item_context_menu":
            break;
          case "live_chat/moderate":
            data.params = args.params;
            break;
          case "updated_metadata":
            data.videoId = args.video_id;
            if (args.ctoken)
              data.continuation = args.ctoken;
            break;
          default:
            throw new Utils.InnertubeError("Action not implemented", action);
        }
        const response = await this.#request.post(`/${action}`, data);
        return response;
      }
      async thumbnails(args = {}) {
        const data = {
          client: "ANDROID",
          videoId: args.video_id
        };
        const response = await this.#request.post("/thumbnails", data);
        return response;
      }
      async geo(action, args = {}) {
        if (!this.#session.logged_in)
          throw new Utils.InnertubeError("You are not signed in");
        const data = {
          input: args.input,
          client: "ANDROID"
        };
        const response = await this.#request.post(`/geo/${action}`, data);
        return response;
      }
      async flag(action, args) {
        if (!this.#session.logged_in)
          throw new Utils.InnertubeError("You are not signed in");
        const data = {};
        switch (action) {
          case "flag/flag":
            data.action = args.action;
            break;
          case "flag/get_form":
            data.params = args.params;
            break;
          default:
            throw new Utils.InnertubeError("Action not implemented", action);
        }
        const response = await this.#request.post(`/${action}`, data);
        return response;
      }
      async music(action, args) {
        const data = {
          input: args.input || "",
          client: "YTMUSIC"
        };
        const response = await this.#request.post(`/music/${action}`, data);
        return response;
      }
      async next(args = {}) {
        const data = { client: args.client };
        if (args.ctoken) {
          data.continuation = args.ctoken;
        }
        if (args.video_id) {
          data.videoId = args.video_id;
        }
        const response = await this.#request.post("/next", data);
        return response;
      }
      async getVideoInfo(id, cpn, client) {
        const data = {
          playbackContext: {
            contentPlaybackContext: {
              vis: 0,
              splay: false,
              referer: "https://www.youtube.com",
              currentUrl: `/watch?v=${id}`,
              autonavState: "STATE_OFF",
              signatureTimestamp: this.#session.sts,
              autoCaptionsDefaultOn: false,
              html5Preference: "HTML5_PREF_WANTS",
              lactMilliseconds: "-1"
            }
          },
          attestationRequest: {
            omitBotguardData: true
          },
          videoId: id
        };
        if (client) {
          data.client = client;
        }
        if (cpn) {
          data.cpn = cpn;
        }
        const response = await this.#request.post("/player", data);
        return response.data;
      }
      async getSearchSuggestions(client, query) {
        if (!["YOUTUBE", "YTMUSIC"].includes(client))
          throw new Utils.InnertubeError("Invalid client", client);
        const response = await {
          YOUTUBE: () => this.#request({
            url: "search",
            baseURL: Constants.URLS.YT_SUGGESTIONS,
            params: {
              q: query,
              ds: "yt",
              client: "youtube",
              xssi: "t",
              oe: "UTF",
              gl: this.#session.context.client.gl,
              hl: this.#session.context.client.hl
            }
          }),
          YTMUSIC: () => this.music("get_search_suggestions", {
            input: query
          })
        }[client]();
        return response;
      }
      async getUserMentionSuggestions(args = {}) {
        if (!this.#session.logged_in)
          throw new Utils.InnertubeError("You are not signed in");
        const data = {
          input: args.input,
          client: "ANDROID"
        };
        const response = await this.#request.post("get_user_mention_suggestions", data);
        return response;
      }
      async execute(action, args) {
        const data = { ...args };
        if (Reflect.has(data, "request"))
          delete data.request;
        if (Reflect.has(data, "clientActions"))
          delete data.clientActions;
        if (Reflect.has(data, "action")) {
          data.actions = [data.action];
          delete data.action;
        }
        if (Reflect.has(data, "token")) {
          data.continuation = data.token;
          delete data.token;
        }
        return this.#request.post(action, data);
      }
      #needsLogin(id) {
        return [
          "FElibrary",
          "FEhistory",
          "FEsubscriptions",
          "SPaccount_notifications",
          "SPaccount_privacy",
          "SPtime_watched"
        ].includes(id);
      }
    };
    module2.exports = Actions2;
  }
});

// node_modules/@stdlib/os-platform/lib/main.js
var require_main = __commonJS({
  "node_modules/@stdlib/os-platform/lib/main.js"(exports2, module2) {
    "use strict";
    var proc = require("process");
    var PLATFORM = proc.platform;
    module2.exports = PLATFORM;
  }
});

// node_modules/@stdlib/os-platform/lib/index.js
var require_lib = __commonJS({
  "node_modules/@stdlib/os-platform/lib/index.js"(exports2, module2) {
    "use strict";
    var PLATFORM = require_main();
    module2.exports = PLATFORM;
  }
});

// node_modules/@stdlib/assert-is-windows/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/@stdlib/assert-is-windows/lib/index.js"(exports2, module2) {
    "use strict";
    var PLATFORM = require_lib();
    var IS_WINDOWS = PLATFORM === "win32";
    module2.exports = IS_WINDOWS;
  }
});

// node_modules/@stdlib/process-env/lib/main.js
var require_main2 = __commonJS({
  "node_modules/@stdlib/process-env/lib/main.js"(exports2, module2) {
    "use strict";
    var proc = require("process");
    var ENV = proc.env;
    module2.exports = ENV;
  }
});

// node_modules/@stdlib/process-env/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/@stdlib/process-env/lib/index.js"(exports2, module2) {
    "use strict";
    var ENV = require_main2();
    module2.exports = ENV;
  }
});

// node_modules/@stdlib/os-tmpdir/lib/tmpdir.js
var require_tmpdir = __commonJS({
  "node_modules/@stdlib/os-tmpdir/lib/tmpdir.js"(exports2, module2) {
    "use strict";
    var IS_WINDOWS = require_lib2();
    var ENV = require_lib3();
    var RE;
    if (IS_WINDOWS) {
      RE = /[^:]\\$/;
    } else {
      RE = /.\/$/;
    }
    function tmpdir() {
      var tmp;
      if (IS_WINDOWS) {
        tmp = ENV.TEMP || ENV.TMP || (ENV.SystemRoot || ENV.windir || "") + "\\temp";
      } else {
        tmp = ENV.TMPDIR || ENV.TMP || ENV.TEMP || "/tmp";
      }
      if (RE.test(tmp)) {
        tmp = tmp.slice(0, -1);
      }
      return tmp;
    }
    module2.exports = tmpdir;
  }
});

// node_modules/@stdlib/os-tmpdir/lib/index.js
var require_lib4 = __commonJS({
  "node_modules/@stdlib/os-tmpdir/lib/index.js"(exports2, module2) {
    "use strict";
    var tmpdir = require_tmpdir();
    module2.exports = tmpdir;
  }
});

// lib/utils/wrappers/NodeCache.js
var require_NodeCache = __commonJS({
  "lib/utils/wrappers/NodeCache.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var NodeCache = class {
      constructor() {
      }
      async read(key) {
        return (await fs.promises.readFile(key)).buffer;
      }
      async write(key, data) {
        const parts = key.split("/").slice(0, -1);
        let current = "";
        for (let i = 0; i < parts.length; i++) {
          current += `${parts[i]}/`;
          if (!await this.exists(current)) {
            await fs.promises.mkdir(current);
          }
        }
        return await fs.promises.writeFile(key, data);
      }
      async exists(key) {
        return await fs.promises.stat(key).then(() => true).catch(() => false);
      }
      async remove(key) {
        return await fs.promises.rm(key);
      }
    };
    module2.exports = new NodeCache();
  }
});

// lib/deciphers/Signature.js
var require_Signature = __commonJS({
  "lib/deciphers/Signature.js"(exports2) {
    "use strict";
    var { SIG_REGEX } = require_Constants();
    var SignatureOperation = exports2.SignatureOperation = {
      REVERSE: 0,
      SPLICE: 1,
      SWAP: 2
    };
    var Signature = class {
      constructor(action_sequence) {
        this.action_sequence = action_sequence;
      }
      static fromSourceCode(sig_decipher_sc) {
        let actions;
        const action_sequence = [];
        const functions = Signature.getFunctions(sig_decipher_sc);
        while ((actions = SIG_REGEX.ACTIONS.exec(sig_decipher_sc)) !== null) {
          const action = actions.groups;
          if (!action)
            continue;
          switch (action.name) {
            case functions[0]:
              action_sequence.push([SignatureOperation.REVERSE, 0]);
              break;
            case functions[1]:
              action_sequence.push([SignatureOperation.SPLICE, parseInt(action.param)]);
              break;
            case functions[2]:
              action_sequence.push([SignatureOperation.SWAP, parseInt(action.param)]);
              break;
            default:
          }
        }
        return new Signature(action_sequence);
      }
      decipher(url) {
        const args = new URLSearchParams(url);
        const signature = args.get("s")?.split("");
        if (!signature)
          throw new TypeError("Invalid signature");
        for (const action of this.action_sequence) {
          switch (action[0]) {
            case SignatureOperation.REVERSE:
              signature.reverse();
              break;
            case SignatureOperation.SPLICE:
              signature.splice(0, action[1]);
              break;
            case SignatureOperation.SWAP:
              {
                const index = action[1];
                const orig_arr = signature[0];
                signature[0] = signature[index % signature.length];
                signature[index % signature.length] = orig_arr;
              }
              break;
            default:
              break;
          }
        }
        return signature.join("");
      }
      toJSON() {
        return [...this.action_sequence];
      }
      toArrayBuffer() {
        const buffer = new ArrayBuffer(4 + 4 + this.action_sequence.length * (1 + 2));
        const view = new DataView(buffer);
        let offset = 0;
        view.setUint32(offset, Signature.LIBRARY_VERSION, true);
        offset += 4;
        view.setUint32(offset, this.action_sequence.length, true);
        offset += 4;
        for (let i = 0; i < this.action_sequence.length; i++) {
          view.setUint8(offset, this.action_sequence[i][0]);
          offset += 1;
          view.setUint16(offset, this.action_sequence[i][1], true);
          offset += 2;
        }
        return buffer;
      }
      static fromArrayBuffer(buffer) {
        const view = new DataView(buffer);
        let offset = 0;
        const version = view.getUint32(offset, true);
        offset += 4;
        if (version !== Signature.LIBRARY_VERSION)
          throw new TypeError("Invalid library version");
        const action_sequence_length = view.getUint32(offset, true);
        offset += 4;
        const action_sequence = new Array(action_sequence_length);
        for (let i = 0; i < action_sequence_length; i++) {
          action_sequence[i] = [
            view.getUint8(offset),
            view.getUint16(offset + 1, true)
          ];
          offset += 3;
        }
        return new Signature(action_sequence);
      }
      static getFunctions(sc) {
        let func;
        const functions = [];
        while ((func = SIG_REGEX.FUNCTIONS.exec(sc)) !== null) {
          if (func[0].includes("reverse")) {
            functions[0] = func[1];
          } else if (func[0].includes("splice")) {
            functions[1] = func[1];
          } else {
            functions[2] = func[1];
          }
        }
        return functions;
      }
      static get LIBRARY_VERSION() {
        return 1;
      }
    };
    exports2.default = Signature;
  }
});

// lib/deciphers/NToken.js
var require_NToken = __commonJS({
  "lib/deciphers/NToken.js"(exports2) {
    "use strict";
    var { NTOKEN_REGEX, BASE64_DIALECT } = require_Constants();
    var NTokenTransformOperation = exports2.NTokenTransformOperation = {
      NO_OP: 0,
      PUSH: 1,
      REVERSE_1: 2,
      REVERSE_2: 3,
      SPLICE: 4,
      SWAP0_1: 5,
      SWAP0_2: 6,
      ROTATE_1: 7,
      ROTATE_2: 8,
      BASE64_DIA: 9,
      TRANSLATE_1: 10,
      TRANSLATE_2: 11
    };
    var NTokenTransformOpType = exports2.NTokenTransformOpType = {
      FUNC: 0,
      N_ARR: 1,
      LITERAL: 2,
      REF: 3
    };
    var OP_LOOKUP = {
      "d.push(e)": NTokenTransformOperation.PUSH,
      "d.reverse()": NTokenTransformOperation.REVERSE_1,
      "function(d){for(var": NTokenTransformOperation.REVERSE_2,
      "d.length;d.splice(e,1)": NTokenTransformOperation.SPLICE,
      "d[0])[0])": NTokenTransformOperation.SWAP0_1,
      "f=d[0];d[0]": NTokenTransformOperation.SWAP0_2,
      "reverse().forEach": NTokenTransformOperation.ROTATE_1,
      "unshift(d.pop())": NTokenTransformOperation.ROTATE_2,
      "function(){for(var": NTokenTransformOperation.BASE64_DIA,
      "function(d,e){for(var f": NTokenTransformOperation.TRANSLATE_1,
      "function(d,e,f){var": NTokenTransformOperation.TRANSLATE_2
    };
    var NTokenTransforms = class {
      static translate1(arr, token, is_reverse_base64) {
        const characters = is_reverse_base64 ? BASE64_DIALECT.REVERSE : BASE64_DIALECT.NORMAL;
        const token_chars = token.split("");
        arr.forEach((char, index, loc) => {
          token_chars.push(loc[index] = characters[(characters.indexOf(char) - characters.indexOf(token_chars[index]) + 64) % characters.length]);
        });
      }
      static translate2(arr, token, characters) {
        let chars_length = characters.length;
        const token_chars = token.split("");
        arr.forEach((char, index, loc) => {
          token_chars.push(loc[index] = characters[(characters.indexOf(char) - characters.indexOf(token_chars[index]) + index + chars_length--) % characters.length]);
        });
      }
      static getBase64Dia(is_reverse_base64) {
        const characters = is_reverse_base64 ? BASE64_DIALECT.REVERSE : BASE64_DIALECT.NORMAL;
        return characters;
      }
      static swap0(arr, index) {
        const old_elem = arr[0];
        index = (index % arr.length + arr.length) % arr.length;
        arr[0] = arr[index];
        arr[index] = old_elem;
      }
      static rotate(arr, index) {
        index = (index % arr.length + arr.length) % arr.length;
        arr.splice(-index).reverse().forEach((el) => arr.unshift(el));
      }
      static splice(arr, index) {
        index = (index % arr.length + arr.length) % arr.length;
        arr.splice(index, 1);
      }
      static reverse(arr) {
        arr.reverse();
      }
      static push(arr, item) {
        if (Array.isArray(arr?.[0]))
          arr.push([NTokenTransformOpType.LITERAL, item]);
        else
          arr.push(item);
      }
    };
    exports2.NTokenTransforms = NTokenTransforms;
    var TRANSFORM_FUNCTIONS = [{
      [NTokenTransformOperation.PUSH]: NTokenTransforms.push,
      [NTokenTransformOperation.SPLICE]: NTokenTransforms.splice,
      [NTokenTransformOperation.SWAP0_1]: NTokenTransforms.swap0,
      [NTokenTransformOperation.SWAP0_2]: NTokenTransforms.swap0,
      [NTokenTransformOperation.ROTATE_1]: NTokenTransforms.rotate,
      [NTokenTransformOperation.ROTATE_2]: NTokenTransforms.rotate,
      [NTokenTransformOperation.REVERSE_1]: NTokenTransforms.reverse,
      [NTokenTransformOperation.REVERSE_2]: NTokenTransforms.reverse,
      [NTokenTransformOperation.BASE64_DIA]: () => NTokenTransforms.getBase64Dia(false),
      [NTokenTransformOperation.TRANSLATE_1]: (...args) => NTokenTransforms.translate1.apply(null, [...args, false]),
      [NTokenTransformOperation.TRANSLATE_2]: NTokenTransforms.translate2
    }, {
      [NTokenTransformOperation.PUSH]: NTokenTransforms.push,
      [NTokenTransformOperation.SPLICE]: NTokenTransforms.splice,
      [NTokenTransformOperation.SWAP0_1]: NTokenTransforms.swap0,
      [NTokenTransformOperation.SWAP0_2]: NTokenTransforms.swap0,
      [NTokenTransformOperation.ROTATE_1]: NTokenTransforms.rotate,
      [NTokenTransformOperation.ROTATE_2]: NTokenTransforms.rotate,
      [NTokenTransformOperation.REVERSE_1]: NTokenTransforms.reverse,
      [NTokenTransformOperation.REVERSE_2]: NTokenTransforms.reverse,
      [NTokenTransformOperation.BASE64_DIA]: () => NTokenTransforms.getBase64Dia(true),
      [NTokenTransformOperation.TRANSLATE_1]: (...args) => NTokenTransforms.translate1.apply(null, [...args, true]),
      [NTokenTransformOperation.TRANSLATE_2]: NTokenTransforms.translate2
    }];
    var NToken = class {
      constructor(transformer) {
        this.transformer = transformer;
      }
      static fromSourceCode(raw) {
        const transformation_data = NToken.getTransformationData(raw);
        const transformations = transformation_data.map((el) => {
          if (el != null && typeof el != "number") {
            const is_reverse_base64 = el.includes("case 65:");
            const opcode = OP_LOOKUP[NToken.getFunc(el)?.[0]];
            if (opcode) {
              el = [
                NTokenTransformOpType.FUNC,
                opcode,
                0 + is_reverse_base64
              ];
            } else if (el == "b") {
              el = [NTokenTransformOpType.N_ARR];
            } else {
              el = [NTokenTransformOpType.LITERAL, el];
            }
          } else if (el != null) {
            el = [NTokenTransformOpType.LITERAL, el];
          }
          return el;
        });
        const placeholder_indexes = [...raw.matchAll(NTOKEN_REGEX.PLACEHOLDERS)].map((item) => parseInt(item[1]));
        placeholder_indexes.forEach((i) => transformations[i] = [NTokenTransformOpType.REF]);
        const function_calls = [...raw.replace(/\n/g, "").match(/try\{(.*?)\}catch/s)[1].matchAll(NTOKEN_REGEX.CALLS)].map((params) => [
          parseInt(params[1]),
          params[2].split(",").map((param) => parseInt(param.match(/c\[(.*?)\]/)?.[1]))
        ]);
        return new NToken([transformations, function_calls]);
      }
      evaluate(i, n_token, transformer) {
        switch (i[0]) {
          case NTokenTransformOpType.FUNC:
            return TRANSFORM_FUNCTIONS[i[2]][i[1]];
          case NTokenTransformOpType.N_ARR:
            return n_token;
          case NTokenTransformOpType.LITERAL:
            return i[1];
          case NTokenTransformOpType.REF:
            return transformer[0];
        }
      }
      transform(n) {
        const n_token = n.split("");
        const transformer = this.getTransformerClone();
        try {
          transformer[1].forEach(([index, param_index]) => {
            const base64_dia = param_index[2] && this.evaluate(transformer[0][param_index[2]], n_token, transformer)();
            this.evaluate(transformer[0][index], n_token, transformer)(param_index[0] !== void 0 && this.evaluate(transformer[0][param_index[0]], n_token, transformer), param_index[1] !== void 0 && this.evaluate(transformer[0][param_index[1]], n_token, transformer), base64_dia);
          });
        } catch (err) {
          console.error(new Error(`Could not transform n-token, download may be throttled.
Original Token:${n}Error:
${err}`));
          return n;
        }
        return n_token.join("");
      }
      getTransformerClone() {
        return [
          [...this.transformer[0]],
          [...this.transformer[1]]
        ];
      }
      toJSON() {
        return this.getTransformerClone();
      }
      toArrayBuffer() {
        let size = 4 * 3;
        for (const instruction of this.transformer[0]) {
          switch (instruction[0]) {
            case NTokenTransformOpType.FUNC:
              size += 2;
              break;
            case NTokenTransformOpType.N_ARR:
            case NTokenTransformOpType.REF:
              size += 1;
              break;
            case NTokenTransformOpType.LITERAL:
              if (typeof instruction[1] === "string")
                size += 1 + 4 + new TextEncoder().encode(instruction[1]).byteLength;
              size += 4 + 1;
              break;
          }
        }
        for (const call of this.transformer[1]) {
          size += 2 + call[1].length;
        }
        const buffer = new ArrayBuffer(size);
        const view = new DataView(buffer);
        let offset = 0;
        view.setUint32(offset, NToken.LIBRARY_VERSION, true);
        offset += 4;
        view.setUint32(offset, this.transformer[0].length, true);
        offset += 4;
        view.setUint32(offset, this.transformer[1].length, true);
        offset += 4;
        for (const instruction of this.transformer[0]) {
          switch (instruction[0]) {
            case NTokenTransformOpType.FUNC:
              {
                const opcode = instruction[0] << 6 | instruction[2];
                view.setUint8(offset, opcode);
                offset += 1;
                view.setUint8(offset, instruction[1]);
                offset += 1;
              }
              break;
            case NTokenTransformOpType.N_ARR:
            case NTokenTransformOpType.REF:
              {
                const opcode = instruction[0] << 6;
                view.setUint8(offset, opcode);
                offset += 1;
              }
              break;
            case NTokenTransformOpType.LITERAL:
              {
                const type = typeof instruction[1] === "string" ? 1 : 0;
                const opcode = instruction[0] << 6 | type;
                view.setUint8(offset, opcode);
                offset += 1;
                if (type === 0) {
                  view.setInt32(offset, instruction[1], true);
                  offset += 4;
                } else {
                  const encoded = new TextEncoder().encode(instruction[1]);
                  view.setUint32(offset, encoded.byteLength, true);
                  offset += 4;
                  for (let i = 0; i < encoded.byteLength; i++) {
                    view.setUint8(offset, encoded[i]);
                    offset += 1;
                  }
                }
              }
              break;
          }
        }
        for (const call of this.transformer[1]) {
          view.setUint8(offset, call[0]);
          offset += 1;
          view.setUint8(offset, call[1].length);
          offset += 1;
          for (const param of call[1]) {
            view.setUint8(offset, param);
            offset += 1;
          }
        }
        return buffer;
      }
      static fromArrayBuffer(buffer) {
        const view = new DataView(buffer);
        let offset = 0;
        const version = view.getUint32(offset, true);
        offset += 4;
        if (version !== NToken.LIBRARY_VERSION)
          throw new TypeError("Invalid library version");
        const transformations_length = view.getUint32(offset, true);
        offset += 4;
        const function_calls_length = view.getUint32(offset, true);
        offset += 4;
        const transformations = new Array(transformations_length);
        for (let i = 0; i < transformations_length; i++) {
          const opcode = view.getUint8(offset++);
          const op = opcode >> 6;
          switch (op) {
            case NTokenTransformOpType.FUNC:
              {
                const is_reverse_base64 = opcode & 1;
                const operation = view.getUint8(offset++);
                transformations[i] = [op, operation, is_reverse_base64];
              }
              break;
            case NTokenTransformOpType.N_ARR:
            case NTokenTransformOpType.REF:
              transformations[i] = [op];
              break;
            case NTokenTransformOpType.LITERAL:
              {
                const type = opcode & 1;
                if (type === 0) {
                  const literal = view.getInt32(offset, true);
                  offset += 4;
                  transformations[i] = [op, literal];
                } else {
                  const length = view.getUint32(offset, true);
                  offset += 4;
                  const literal = new Uint8Array(length);
                  for (let i2 = 0; i2 < length; i2++) {
                    literal[i2] = view.getUint8(offset++);
                  }
                  transformations[i] = [op, new TextDecoder().decode(literal)];
                }
              }
              break;
            default:
              throw new Error("Invalid opcode");
          }
        }
        const function_calls = new Array(function_calls_length);
        for (let i = 0; i < function_calls_length; i++) {
          const index = view.getUint8(offset++);
          const num_params = view.getUint8(offset++);
          const params = new Array(num_params);
          for (let j = 0; j < num_params; j++) {
            params[j] = view.getUint8(offset++);
          }
          function_calls[i] = [index, params];
        }
        return new NToken([transformations, function_calls]);
      }
      static get LIBRARY_VERSION() {
        return 1;
      }
      static getFunc(el) {
        return el.match(NTOKEN_REGEX.FUNCTIONS);
      }
      static getTransformationData(raw) {
        const data = `[${raw.replace(/\n/g, "").match(/c=\[(.*?)\];c/s)?.[1]}]`;
        return JSON.parse(this.refineNTokenData(data));
      }
      static refineNTokenData(data) {
        return data.replace(/function\(d,e\)/g, '"function(d,e)').replace(/function\(d\)/g, '"function(d)').replace(/function\(\)/g, '"function()').replace(/function\(d,e,f\)/g, '"function(d,e,f)').replace(/\[function\(d,e,f\)/g, '["function(d,e,f)').replace(/,b,/g, ',"b",').replace(/,b/g, ',"b"').replace(/b,/g, '"b",').replace(/b]/g, '"b"]').replace(/\[b/g, '["b"').replace(/}]/g, '"]').replace(/},/g, '}",').replace(/""/g, "").replace(/length]\)}"/g, "length])}");
      }
    };
    exports2.default = NToken;
  }
});

// lib/core/Player.js
var require_Player = __commonJS({
  "lib/core/Player.js"(exports2, module2) {
    "use strict";
    var tmpdir = require_lib4();
    var Cache = false ? null : require_NodeCache();
    var Utils = require_Utils();
    var Constants = require_Constants();
    var { default: Signature } = require_Signature();
    var { default: NToken } = require_NToken();
    var Player = class {
      #request;
      #player_id;
      #player_url;
      #player_path;
      #ntoken;
      #signature;
      #signature_timestamp;
      #cache_dir;
      constructor(id, request) {
        this.#player_id = id;
        this.#request = request;
        this.#cache_dir = `${tmpdir()}/yt-cache`;
        this.#player_url = `${Constants.URLS.YT_BASE}/s/player/${this.#player_id}/player_ias.vflset/en_US/base.js`;
        this.#player_path = `${this.#cache_dir}/${this.#player_id}.bin`;
      }
      async init() {
        if (await this.isCached()) {
          const buffer = await Cache.read(this.#player_path);
          const view = new DataView(buffer);
          const version = view.getUint32(0, true);
          if (version == Player.LIBRARY_VERSION) {
            const sig_decipher_len = view.getUint32(8, true);
            const sig_decipher_buf = buffer.slice(12, 12 + sig_decipher_len);
            const ntoken_transform_buf = buffer.slice(12 + sig_decipher_len);
            this.#ntoken = NToken.fromArrayBuffer(ntoken_transform_buf);
            this.#signature = Signature.fromArrayBuffer(sig_decipher_buf);
            this.#signature_timestamp = view.getUint32(4, true);
            return this;
          }
        }
        const response = await this.#request.get(this.#player_url, { headers: { "content-type": "text/javascript" } });
        this.#signature_timestamp = this.#extractSigTimestamp(response.data);
        const signature_decipher_sc = this.#extractSigDecipherSc(response.data);
        const ntoken_decipher_sc = this.#extractNTokenSc(response.data);
        this.#signature = Signature.fromSourceCode(signature_decipher_sc);
        this.#ntoken = NToken.fromSourceCode(ntoken_decipher_sc);
        try {
          await Cache.exists(this.#cache_dir) && await Cache.remove(this.#cache_dir, { recursive: true });
          const ntoken_buf = this.#ntoken.toArrayBuffer();
          const sig_decipher_buf = this.#signature.toArrayBuffer();
          const buffer = new ArrayBuffer(12 + sig_decipher_buf.byteLength + ntoken_buf.byteLength);
          const view = new DataView(buffer);
          view.setUint32(0, Player.LIBRARY_VERSION, true);
          view.setUint32(4, this.#signature_timestamp, true);
          view.setUint32(8, sig_decipher_buf.byteLength, true);
          new Uint8Array(buffer).set(new Uint8Array(sig_decipher_buf), 12);
          new Uint8Array(buffer).set(new Uint8Array(ntoken_buf), 12 + sig_decipher_buf.byteLength);
          await Cache.write(this.#player_path, new Uint8Array(buffer));
        } finally {
        }
        return this;
      }
      decipher(url, signature_cipher, cipher) {
        url = url || signature_cipher || cipher;
        Utils.throwIfMissing({ url });
        const args = new URLSearchParams(url);
        const url_components = new URL(args.get("url") || url);
        url_components.searchParams.set("ratebypass", "yes");
        if (signature_cipher || cipher) {
          const signature = this.#signature.decipher(url);
          args.get("sp") ? url_components.searchParams.set(args.get("sp"), signature) : url_components.searchParams.set("signature", signature);
        }
        if (url_components.searchParams.get("n")) {
          const ntoken = this.#ntoken.transform(url_components.searchParams.get("n"));
          url_components.searchParams.set("n", ntoken);
        }
        return url_components.toString();
      }
      get url() {
        return this.#player_url;
      }
      get sts() {
        return this.#signature_timestamp;
      }
      static get LIBRARY_VERSION() {
        return 1;
      }
      #extractSigTimestamp(data) {
        return parseInt(Utils.getStringBetweenStrings(data, "signatureTimestamp:", ","));
      }
      #extractSigDecipherSc(data) {
        const sig_alg_sc = Utils.getStringBetweenStrings(data, "this.audioTracks};var", "};");
        const sig_data = Utils.getStringBetweenStrings(data, 'function(a){a=a.split("")', 'return a.join("")}');
        return sig_alg_sc + sig_data;
      }
      #extractNTokenSc(data) {
        return `var b=a.split("")${Utils.getStringBetweenStrings(data, 'b=a.split("")', '}return b.join("")}')}} return b.join("");`;
      }
      async isCached() {
        return await Cache.exists(this.#player_path);
      }
    };
    module2.exports = Player;
  }
});

// lib/core/SessionBuilder.js
var require_SessionBuilder = __commonJS({
  "lib/core/SessionBuilder.js"(exports2, module2) {
    "use strict";
    var Player = require_Player();
    var Proto2 = require_proto();
    var Utils = require_Utils();
    var Constants = require_Constants();
    var UserAgent = require_dist2();
    var SessionBuilder2 = class {
      #config;
      #request;
      #key;
      #client_name;
      #client_version;
      #api_version;
      #remote_host;
      #context;
      #player;
      constructor(config, request) {
        this.#config = config;
        this.#request = request;
      }
      async build() {
        const data = await Promise.all([
          this.#getYtConfig(),
          this.#getPlayerId()
        ]);
        const ytcfg = data[0][0][2];
        this.#key = ytcfg[1];
        this.#api_version = `v${ytcfg[0][0][6]}`;
        this.#client_name = Constants.CLIENTS.WEB.NAME;
        this.#client_version = ytcfg[0][0][16];
        this.#remote_host = ytcfg[0][0][3];
        this.#player = await new Player(data[1], this.#request).init();
        this.#context = this.#buildContext();
        return this;
      }
      #buildContext() {
        const user_agent = new UserAgent({ deviceCategory: "desktop" });
        const id = Utils.generateRandomString(11);
        const timestamp = Math.floor(Date.now() / 1e3);
        const visitor_data = Proto2.encodeVisitorData(id, timestamp);
        const context = {
          client: {
            hl: "en",
            gl: this.#config.gl || "US",
            remoteHost: this.#remote_host,
            deviceMake: user_agent.vendor,
            deviceModel: user_agent.platform,
            visitorData: visitor_data,
            userAgent: user_agent.toString(),
            clientName: this.#client_name,
            clientVersion: this.#client_version,
            originalUrl: Constants.URLS.API.BASE
          },
          user: { lockedSafetyMode: false },
          request: { useSsl: true }
        };
        return context;
      }
      async #getYtConfig() {
        const response = await this.#request.get(`${Constants.URLS.YT_BASE}/sw.js_data`);
        return JSON.parse(response.data.replace(")]}'", ""));
      }
      async #getPlayerId() {
        const response = await this.#request.get(`${Constants.URLS.YT_BASE}/iframe_api`);
        return Utils.getStringBetweenStrings(response.data, "player\\/", "\\/");
      }
      get key() {
        return this.#key;
      }
      get context() {
        return this.#context;
      }
      get api_version() {
        return this.#api_version;
      }
      get client_version() {
        return this.#client_version;
      }
      get client_name() {
        return this.#client_name;
      }
      get player() {
        return this.#player;
      }
    };
    module2.exports = SessionBuilder2;
  }
});

// lib/parser/contents/classes/Format.js
var require_Format = __commonJS({
  "lib/parser/contents/classes/Format.js"(exports2, module2) {
    "use strict";
    var Format = class {
      constructor(data) {
        this.itag = data.itag;
        this.mime_type = data.mimeType;
        this.bitrate = data.bitrate;
        this.average_bitrate = data.averageBitrate;
        this.width = data.width || null;
        this.height = data.height || null;
        this.init_range = data.initRange && {
          start: parseInt(data.initRange.start),
          end: parseInt(data.initRange.end)
        };
        this.index_range = data.indexRange && {
          start: parseInt(data.indexRange.start),
          end: parseInt(data.indexRange.end)
        };
        this.last_modified = new Date(Math.floor(parseInt(data.lastModified) / 1e3));
        this.content_length = parseInt(data.contentLength);
        this.quality = data.quality;
        this.quality_label = data.qualityLabel || null;
        this.fps = data.fps || null;
        this.url = data.url || null;
        this.cipher = data.cipher || null;
        this.signature_cipher = data.signatureCipher || null;
        this.audio_quality = data.audioQuality;
        this.approx_duration_ms = parseInt(data.approxDurationMs);
        this.audio_sample_rate = parseInt(data.audioSampleRate);
        this.audio_channels = data.audioChannels;
        this.loudness_db = data.loudnessDb;
        this.has_audio = !!data.audioBitrate || !!data.audioQuality;
        this.has_video = !!data.qualityLabel;
      }
      decipher(player) {
        return player.decipher(this.url, this.signature_cipher, this.cipher);
      }
    };
    module2.exports = Format;
  }
});

// lib/parser/contents/classes/Thumbnail.js
var require_Thumbnail = __commonJS({
  "lib/parser/contents/classes/Thumbnail.js"(exports2, module2) {
    "use strict";
    var Thumbnail = class {
      url;
      width;
      height;
      constructor({ url, width, height }) {
        this.url = url;
        this.width = width;
        this.height = height;
      }
      static fromResponse(data) {
        if (!data || !data.thumbnails)
          return;
        return data.thumbnails.map((x) => new Thumbnail(x)).sort((a, b) => b.width - a.width);
      }
    };
    module2.exports = Thumbnail;
  }
});

// lib/parser/contents/classes/VideoDetails.js
var require_VideoDetails = __commonJS({
  "lib/parser/contents/classes/VideoDetails.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var VideoDetails = class {
      id;
      channel_id;
      title;
      keywords;
      short_description;
      author;
      constructor(data) {
        this.id = data.videoId;
        this.channel_id = data.channelId;
        this.title = data.title;
        this.duration = parseInt(data.lengthSeconds);
        this.keywords = data.keywords;
        this.is_owner_viewing = !!data.isOwnerViewing;
        this.short_description = data.shortDescription;
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
        this.allow_ratings = !!data.allowRatings;
        this.view_count = parseInt(data.viewCount);
        this.author = data.author;
        this.is_private = !!data.isPrivate;
        this.is_live_content = !!data.isLiveContent;
        this.is_crawlable = !!data.isCrawlable;
      }
    };
    module2.exports = VideoDetails;
  }
});

// lib/parser/contents/classes/DataModelSection.js
var require_DataModelSection = __commonJS({
  "lib/parser/contents/classes/DataModelSection.js"(exports2, module2) {
    "use strict";
    var DataModelSection = class {
      type = "DataModelSection";
      constructor(data) {
        this.title = data.title;
        this.subtitle = data.subtitle;
        this.metric_value = data.metricValue;
        this.comparison_indicator = data.comparisonIndicator;
        this.series_configuration = {
          line_series: {
            lines_data: data.seriesConfiguration.lineSeries.linesData,
            domain_axis: data.seriesConfiguration.lineSeries.domainAxis,
            measure_axis: data.seriesConfiguration.lineSeries.measureAxis
          }
        };
      }
    };
    module2.exports = DataModelSection;
  }
});

// lib/parser/contents/classes/AnalyticsMainAppKeyMetrics.js
var require_AnalyticsMainAppKeyMetrics = __commonJS({
  "lib/parser/contents/classes/AnalyticsMainAppKeyMetrics.js"(exports2, module2) {
    "use strict";
    var DataModelSection = require_DataModelSection();
    var AnalyticsMainAppKeyMetrics = class {
      type = "AnalyticsMainAppKeyMetrics";
      constructor(data) {
        this.period = data.cardData.periodLabel;
        const metrics_data = data.cardData.sections[0].analyticsKeyMetricsData;
        this.sections = metrics_data.dataModel.sections.map((section) => new DataModelSection(section));
      }
    };
    module2.exports = AnalyticsMainAppKeyMetrics;
  }
});

// lib/parser/contents/classes/AnalyticsVideo.js
var require_AnalyticsVideo = __commonJS({
  "lib/parser/contents/classes/AnalyticsVideo.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var AnalyticsVideo = class {
      type = "AnalyticsVideo";
      constructor(data) {
        this.title = data.videoTitle;
        this.metadata = {
          views: data.videoDescription.split("\xB7")[0].trim(),
          published: data.videoDescription.split("\xB7")[1].trim(),
          thumbnails: Thumbnail.fromResponse(data.thumbnailDetails),
          duration: data.formattedLength,
          is_short: data.isShort
        };
      }
    };
    module2.exports = AnalyticsVideo;
  }
});

// lib/parser/contents/classes/AnalyticsVodCarouselCard.js
var require_AnalyticsVodCarouselCard = __commonJS({
  "lib/parser/contents/classes/AnalyticsVodCarouselCard.js"(exports2, module2) {
    "use strict";
    var Video = require_AnalyticsVideo();
    var AnalyticsVodCarouselCard = class {
      type = "AnalyticsVodCarouselCard";
      constructor(data) {
        this.title = data.title;
        this.videos = data.videoCarouselData.videos.map((video) => new Video(video));
      }
    };
    module2.exports = AnalyticsVodCarouselCard;
  }
});

// lib/parser/contents/classes/NavigationEndpoint.js
var require_NavigationEndpoint = __commonJS({
  "lib/parser/contents/classes/NavigationEndpoint.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var NavigationEndpoint = class {
      type = "NavigationEndpoint";
      constructor(data) {
        const name = Object.keys(data || {}).find((item) => item.endsWith("Endpoint") || item.endsWith("Command"));
        this.payload = data?.[name] || {};
        if (Reflect.has(this.payload, "dialog")) {
          this.dialog = Parser.parse(this.payload.dialog);
        }
        if (data?.serviceEndpoint) {
          data = data.serviceEndpoint;
        }
        this.metadata = {};
        if (data?.commandMetadata?.webCommandMetadata?.url) {
          this.metadata.url = data.commandMetadata.webCommandMetadata.url;
        }
        if (data?.commandMetadata?.webCommandMetadata?.webPageType) {
          this.metadata.page_type = data.commandMetadata.webCommandMetadata.webPageType;
        }
        if (data?.commandMetadata?.webCommandMetadata?.apiUrl) {
          this.metadata.api_url = data.commandMetadata.webCommandMetadata.apiUrl.replace("/youtubei/v1/", "");
        }
        if (data?.commandMetadata?.webCommandMetadata?.sendPost) {
          this.metadata.send_post = data.commandMetadata.webCommandMetadata.sendPost;
        }
        if (data?.browseEndpoint) {
          const configs = data?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig;
          this.browse = {
            id: data?.browseEndpoint?.browseId || null,
            params: data?.browseEndpoint.params || null,
            base_url: data?.browseEndpoint?.canonicalBaseUrl || null,
            page_type: configs?.pageType || null
          };
        }
        if (data?.watchEndpoint) {
          const configs = data?.watchEndpoint?.watchEndpointMusicSupportedConfigs?.watchEndpointMusicConfig;
          this.watch = {
            video_id: data?.watchEndpoint?.videoId,
            playlist_id: data?.watchEndpoint.playlistId || null,
            params: data?.watchEndpoint.params || null,
            index: data?.watchEndpoint.index || null,
            supported_onesie_config: data?.watchEndpoint?.watchEndpointSupportedOnesieConfig,
            music_video_type: configs?.musicVideoType || null
          };
        }
        if (data?.searchEndpoint) {
          this.search = {
            query: data.searchEndpoint.query,
            params: data.searchEndpoint.params
          };
        }
        if (data?.subscribeEndpoint) {
          this.subscribe = {
            channel_ids: data.subscribeEndpoint.channelIds,
            params: data.subscribeEndpoint.params
          };
        }
        if (data?.unsubscribeEndpoint) {
          this.unsubscribe = {
            channel_ids: data.unsubscribeEndpoint.channelIds,
            params: data.unsubscribeEndpoint.params
          };
        }
        if (data?.likeEndpoint) {
          this.like = {
            status: data.likeEndpoint.status,
            target: {
              video_id: data.likeEndpoint.target.videoId,
              playlist_id: data.likeEndpoint.target.playlistId
            },
            params: data.likeEndpoint?.removeLikeParams || data.likeEndpoint?.likeParams || data.likeEndpoint?.dislikeParams
          };
        }
        if (data?.performCommentActionEndpoint) {
          this.perform_comment_action = {
            action: data?.performCommentActionEndpoint.action
          };
        }
        if (data?.offlineVideoEndpoint) {
          this.offline_video = {
            video_id: data.offlineVideoEndpoint.videoId,
            on_add_command: {
              get_download_action: {
                video_id: data.offlineVideoEndpoint.videoId,
                params: data.offlineVideoEndpoint.onAddCommand.getDownloadActionCommand.params
              }
            }
          };
        }
        if (data?.continuationCommand) {
          this.continuation = {
            request: data?.continuationCommand?.request || null,
            token: data?.continuationCommand?.token || null
          };
        }
        if (data?.feedbackEndpoint) {
          this.feedback = {
            token: data.feedbackEndpoint.feedbackToken
          };
        }
        if (data?.watchPlaylistEndpoint) {
          this.watch_playlist = {
            playlist_id: data.watchPlaylistEndpoint?.playlistId
          };
        }
        if (data?.playlistEditEndpoint) {
          this.playlist_edit = {
            playlist_id: data.playlistEditEndpoint.playlistId,
            actions: data.playlistEditEndpoint.actions.map((item) => ({
              action: item.action,
              removed_video_id: item.removedVideoId
            }))
          };
        }
        if (data?.addToPlaylistEndpoint) {
          this.add_to_playlist = {
            video_id: data.addToPlaylistEndpoint.videoId
          };
        }
        if (data?.addToPlaylistServiceEndpoint) {
          this.add_to_playlist = {
            video_id: data.addToPlaylistServiceEndpoint.videoId
          };
        }
        if (data?.getReportFormEndpoint) {
          this.get_report_form = {
            params: data.getReportFormEndpoint.params
          };
        }
        if (data?.liveChatItemContextMenuEndpoint) {
          this.live_chat_item_context_menu = {
            params: data?.liveChatItemContextMenuEndpoint?.params
          };
        }
        if (data?.sendLiveChatVoteEndpoint) {
          this.send_live_chat_vote = {
            params: data.sendLiveChatVoteEndpoint.params
          };
        }
        if (data?.liveChatItemContextMenuEndpoint) {
          this.live_chat_item_context_menu = {
            params: data.liveChatItemContextMenuEndpoint.params
          };
        }
      }
      async callTest(actions, args = { parse: true, params: {} }) {
        if (!actions)
          throw new Error("An active caller must be provided");
        const response = await actions.execute(this.metadata.api_url, { ...this.payload, ...args.params });
        if (args.parse) {
          return Parser.parseResponse(response.data);
        }
        return response;
      }
      async call(actions, client) {
        if (!actions)
          throw new Error("An active caller must be provided");
        if (this.continuation) {
          switch (this.continuation.request) {
            case "CONTINUATION_REQUEST_TYPE_BROWSE": {
              const response = await actions.browse(this.continuation.token, { is_ctoken: true });
              return Parser.parseResponse(response.data);
            }
            case "CONTINUATION_REQUEST_TYPE_SEARCH": {
              const response = await actions.search({ ctoken: this.continuation.token });
              return Parser.parseResponse(response.data);
            }
            case "CONTINUATION_REQUEST_TYPE_WATCH_NEXT": {
              const response = await actions.next({ ctoken: this.continuation.token });
              return Parser.parseResponse(response.data);
            }
            default:
              throw new Error(`${this.continuation.request} not implemented`);
          }
        }
        if (this.search) {
          const response = await actions.search({ query: this.search.query, params: this.search.params, client });
          return Parser.parseResponse(response.data);
        }
        if (this.browse) {
          const response = await actions.browse(this.browse.id, { ...this.browse, client });
          return Parser.parseResponse(response.data);
        }
        if (this.like) {
          const response = await actions.engage(this.metadata.api_url, { video_id: this.like.target.video_id, params: this.like.params });
          return response;
        }
      }
    };
    module2.exports = NavigationEndpoint;
  }
});

// lib/parser/contents/classes/TextRun.js
var require_TextRun = __commonJS({
  "lib/parser/contents/classes/TextRun.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var TextRun = class {
      constructor(data) {
        this.text = data.text;
        this.endpoint = data.navigationEndpoint ? new NavigationEndpoint(data.navigationEndpoint) : {};
      }
    };
    module2.exports = TextRun;
  }
});

// lib/parser/contents/classes/EmojiRun.js
var require_EmojiRun = __commonJS({
  "lib/parser/contents/classes/EmojiRun.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var EmojiRun = class {
      constructor(data) {
        this.text = data.emoji?.emojiId || data.emoji?.shortcuts?.[0] || null;
        this.emoji = {
          emoji_id: data.emoji.emojiId,
          shortcuts: data.emoji.shortcuts,
          search_terms: data.emoji.searchTerms,
          image: Thumbnail.fromResponse(data.emoji.image)
        };
      }
    };
    module2.exports = EmojiRun;
  }
});

// lib/parser/contents/classes/Text.js
var require_Text = __commonJS({
  "lib/parser/contents/classes/Text.js"(exports2, module2) {
    "use strict";
    var TextRun = require_TextRun();
    var EmojiRun = require_EmojiRun();
    var Text = class {
      text;
      constructor(data) {
        if (data?.hasOwnProperty("runs")) {
          this.runs = data.runs.map((run) => run.emoji && new EmojiRun(run) || new TextRun(run));
          this.text = this.runs.map((run) => run.text).join("");
        } else {
          this.text = data?.simpleText || "N/A";
        }
      }
      toString() {
        return this.text;
      }
    };
    module2.exports = Text;
  }
});

// lib/parser/contents/classes/NavigatableText.js
var require_NavigatableText = __commonJS({
  "lib/parser/contents/classes/NavigatableText.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var NavigatableText = class extends Text {
      type = "NavigatableText";
      endpoint;
      constructor(node) {
        super(node);
        this.endpoint = node.runs?.[0]?.navigationEndpoint ? new NavigationEndpoint(node.runs[0].navigationEndpoint) : node.navigationEndpoint ? new NavigationEndpoint(node.navigationEndpoint) : node.titleNavigationEndpoint ? new NavigationEndpoint(node.titleNavigationEndpoint) : null;
      }
      toJSON() {
        return this;
      }
    };
    module2.exports = NavigatableText;
  }
});

// lib/parser/contents/classes/Author.js
var require_Author = __commonJS({
  "lib/parser/contents/classes/Author.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var NavigatableText = require_NavigatableText();
    var Thumbnail = require_Thumbnail();
    var Constants = require_Constants();
    var Author = class {
      #nav_text;
      constructor(item, badges, thumbs) {
        this.#nav_text = new NavigatableText(item);
        this.id = this.#nav_text.runs?.[0].endpoint.browse?.id || this.#nav_text.endpoint?.browse?.id || "N/A";
        this.name = this.#nav_text.text || "N/A";
        this.thumbnails = thumbs ? Thumbnail.fromResponse(thumbs) : [];
        this.endpoint = this.#nav_text.runs?.[0].endpoint || this.#nav_text.endpoint;
        this.badges = Array.isArray(badges) ? Parser.parse(badges) : [];
        this.is_verified = this.badges?.some((badge) => badge.style == "BADGE_STYLE_TYPE_VERIFIED") || null;
        this.is_verified_artist = this.badges?.some((badge) => badge.style == "BADGE_STYLE_TYPE_VERIFIED_ARTIST") || null;
        this.url = this.#nav_text.runs?.[0].endpoint.browse && `${Constants.URLS.YT_BASE}${this.#nav_text.runs[0].endpoint.browse?.base_url || `/u/${this.#nav_text.runs[0].endpoint.browse?.id}`}` || `${Constants.URLS.YT_BASE}${this.#nav_text.endpoint?.browse?.base_url || `/u/${this.#nav_text.endpoint?.browse?.id}`}` || null;
      }
      get best_thumbnail() {
        return this.thumbnails[0];
      }
    };
    module2.exports = Author;
  }
});

// lib/parser/contents/classes/BackstageImage.js
var require_BackstageImage = __commonJS({
  "lib/parser/contents/classes/BackstageImage.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var BackstageImage = class {
      type = "BackstageImage";
      constructor(data) {
        this.image = Thumbnail.fromResponse(data.image);
      }
    };
    module2.exports = BackstageImage;
  }
});

// lib/parser/contents/classes/BackstagePost.js
var require_BackstagePost = __commonJS({
  "lib/parser/contents/classes/BackstagePost.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Author = require_Author();
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var BackstagePost = class {
      type = "BackstagePost";
      constructor(data) {
        this.id = data.postId;
        this.author = new Author({
          ...data.authorText,
          navigationEndpoint: data.authorEndpoint
        }, null, data.authorThumbnail);
        this.content = new Text(data.contentText, "");
        this.published = new Text(data.publishedTimeText);
        this.poll_status = data.pollStatus;
        this.vote_status = data.voteStatus;
        this.likes = new Text(data.voteCount);
        this.menu = Parser.parse(data.actionMenu) || null;
        this.actions = Parser.parse(data.actionButtons);
        this.vote_button = Parser.parse(data.voteButton);
        this.surface = data.surface;
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.attachment = Parser.parse(data.backstageAttachment) || null;
      }
    };
    module2.exports = BackstagePost;
  }
});

// lib/parser/contents/classes/BackstagePostThread.js
var require_BackstagePostThread = __commonJS({
  "lib/parser/contents/classes/BackstagePostThread.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var BackstagePostThread = class {
      type = "BackstagePostThread";
      constructor(data) {
        this.post = Parser.parse(data.post);
      }
    };
    module2.exports = BackstagePostThread;
  }
});

// lib/parser/contents/classes/BrowseFeedActions.js
var require_BrowseFeedActions = __commonJS({
  "lib/parser/contents/classes/BrowseFeedActions.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var BrowseFeedActions = class {
      type = "BrowseFeedActions";
      constructor(data) {
        this.contents = Parser.parse(data.contents);
      }
    };
    module2.exports = BrowseFeedActions;
  }
});

// lib/parser/contents/classes/Button.js
var require_Button = __commonJS({
  "lib/parser/contents/classes/Button.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Button = class {
      type = "Button";
      constructor(data) {
        this.text = new Text(data.text).toString();
        if (data.accessibility?.label) {
          this.label = data.accessibility?.label;
        }
        if (data.tooltip) {
          this.tooltip = data.tooltip;
        }
        if (data.icon?.iconType) {
          this.iconType = data.icon?.iconType;
        }
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint || data.serviceEndpoint || data.command);
      }
    };
    module2.exports = Button;
  }
});

// lib/parser/contents/classes/C4TabbedHeader.js
var require_C4TabbedHeader = __commonJS({
  "lib/parser/contents/classes/C4TabbedHeader.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Author = require_Author();
    var Thumbnail = require_Thumbnail();
    var Text = require_Text();
    var C4TabbedHeader = class {
      type = "C4TabbedHeader";
      constructor(data) {
        this.author = new Author({
          simpleText: data.title,
          navigationEndpoint: data.navigationEndpoint
        }, data.badges, data.avatar);
        this.banner = data.banner ? Thumbnail.fromResponse(data.banner) : [];
        this.tv_banner = data.tvBanner ? Thumbnail.fromResponse(data.tvBanner) : [];
        this.mobile_banner = data.mobileBanner ? Thumbnail.fromResponse(data.mobileBanner) : [];
        this.subscribers = new Text(data.subscriberCountText);
        this.sponsor_button = data.sponsorButton && Parser.parse(data.sponsorButton);
        this.subscribe_button = data.subscribeButton && Parser.parse(data.subscribeButton);
        this.header_links = data.headerLinks && Parser.parse(data.headerLinks);
      }
    };
    module2.exports = C4TabbedHeader;
  }
});

// lib/parser/contents/classes/CallToActionButton.js
var require_CallToActionButton = __commonJS({
  "lib/parser/contents/classes/CallToActionButton.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var CallToActionButton = class {
      type = "CallToActionButton";
      constructor(data) {
        this.label = new Text(data.label);
        this.icon_type = data.icon.iconType;
        this.style = data.style;
      }
    };
    module2.exports = CallToActionButton;
  }
});

// lib/parser/contents/classes/Card.js
var require_Card = __commonJS({
  "lib/parser/contents/classes/Card.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Card = class {
      type = "Card";
      constructor(data) {
        this.teaser = Parser.parse(data.teaser);
        this.content = Parser.parse(data.content);
        this.card_id = data.cardId;
        this.feature = data.feature;
        this.cue_ranges = data.cueRanges.map((cr) => ({
          start_card_active_ms: cr.startCardActiveMs,
          end_card_active_ms: cr.endCardActiveMs,
          teaser_duration_ms: cr.teaserDurationMs,
          icon_after_teaser_ms: cr.iconAfterTeaserMs
        }));
      }
    };
    module2.exports = Card;
  }
});

// lib/parser/contents/classes/CardCollection.js
var require_CardCollection = __commonJS({
  "lib/parser/contents/classes/CardCollection.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var CardCollection = class {
      type = "CardCollection";
      constructor(data) {
        this.cards = Parser.parse(data.cards);
        this.header = new Text(data.headerText);
        this.allow_teaser_dismiss = data.allowTeaserDismiss;
      }
    };
    module2.exports = CardCollection;
  }
});

// lib/parser/contents/classes/Channel.js
var require_Channel = __commonJS({
  "lib/parser/contents/classes/Channel.js"(exports2, module2) {
    "use strict";
    var Author = require_Author();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Text = require_Text();
    var Channel2 = class {
      type = "Channel";
      constructor(data) {
        this.id = data.channelId;
        this.author = new Author({
          ...data.title,
          navigationEndpoint: data.navigationEndpoint
        }, data.ownerBadges, data.thumbnail);
        this.subscribers = new Text(data.subscriberCountText);
        this.videos = new Text(data.videoCountText);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.description_snippet = new Text(data.descriptionSnippet);
      }
    };
    module2.exports = Channel2;
  }
});

// lib/parser/contents/classes/ChannelAboutFullMetadata.js
var require_ChannelAboutFullMetadata = __commonJS({
  "lib/parser/contents/classes/ChannelAboutFullMetadata.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Text = require_Text();
    var Parser = require_contents();
    var ChannelAboutFullMetadata = class {
      type = "ChannelAboutFullMetadata";
      constructor(data) {
        this.id = data.channelId;
        this.name = new Text(data.title);
        this.avatar = Thumbnail.fromResponse(data.avatar);
        this.canonical_channel_url = data.canonicalChannelUrl;
        this.views = new Text(data.viewCountText);
        this.joined = new Text(data.joinedDateText);
        this.description = new Text(data.description);
        this.email_reveal = new NavigationEndpoint(data.onBusinessEmailRevealClickCommand);
        this.can_reveal_email = !data.signInForBusinessEmail;
        this.country = new Text(data.country);
        this.buttons = Parser.parse(data.actionButtons);
      }
    };
    module2.exports = ChannelAboutFullMetadata;
  }
});

// lib/parser/contents/classes/ChannelFeaturedContent.js
var require_ChannelFeaturedContent = __commonJS({
  "lib/parser/contents/classes/ChannelFeaturedContent.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var ChannelFeaturedContent = class {
      type = "ChannelFeaturedContent";
      constructor(data) {
        this.title = new Text(data.title);
        this.items = Parser.parse(data.items);
      }
    };
    module2.exports = ChannelFeaturedContent;
  }
});

// lib/parser/contents/classes/ChannelHeaderLinks.js
var require_ChannelHeaderLinks = __commonJS({
  "lib/parser/contents/classes/ChannelHeaderLinks.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var HeaderLink = class {
      constructor(data) {
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.icon = Thumbnail.fromResponse(data.icon);
        this.title = new Text(data.title);
      }
    };
    var ChannelHeaderLinks = class {
      type = "ChannelHeaderLinks";
      constructor(data) {
        this.primary = data.primaryLinks?.map((link) => new HeaderLink(link)) || [];
        this.secondary = data.secondaryLinks?.map((link) => new HeaderLink(link)) || [];
      }
    };
    module2.exports = ChannelHeaderLinks;
  }
});

// lib/parser/contents/classes/ChannelMetadata.js
var require_ChannelMetadata = __commonJS({
  "lib/parser/contents/classes/ChannelMetadata.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var ChannelMetadata = class {
      type = "ChannelMetadata";
      constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.url = data.channelUrl;
        this.rss_urls = data.rssUrl;
        this.vanity_channel_url = data.vanityChannelUrl;
        this.external_id = data.externalId;
        this.is_family_safe = data.isFamilySafe;
        this.keywords = data.keywords;
        this.avatar = Thumbnail.fromResponse(data.avatar);
        this.available_countries = data.availableCountryCodes;
        this.android_deep_link = data.androidDeepLink;
        this.android_appindexing_link = data.androidAppindexingLink;
        this.ios_appindexing_link = data.iosAppindexingLink;
      }
    };
    module2.exports = ChannelMetadata;
  }
});

// lib/parser/contents/classes/ChannelMobileHeader.js
var require_ChannelMobileHeader = __commonJS({
  "lib/parser/contents/classes/ChannelMobileHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ChannelMobileHeader = class {
      constructor(data) {
        this.title = new Text(data.title);
      }
    };
    module2.exports = ChannelMobileHeader;
  }
});

// lib/parser/contents/classes/ChannelThumbnailWithLink.js
var require_ChannelThumbnailWithLink = __commonJS({
  "lib/parser/contents/classes/ChannelThumbnailWithLink.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var ChannelThumbnailWithLink = class {
      type = "ChannelThumbnailWithLink";
      constructor(data) {
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.label = data.accessibility.accessibilityData.label;
      }
    };
    module2.exports = ChannelThumbnailWithLink;
  }
});

// lib/parser/contents/classes/ChannelVideoPlayer.js
var require_ChannelVideoPlayer = __commonJS({
  "lib/parser/contents/classes/ChannelVideoPlayer.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ChannelVideoPlayer = class {
      type = "ChannelVideoPlayer";
      constructor(data) {
        this.id = data.videoId;
        this.title = new Text(data.title, "");
        this.description = new Text(data.description, "");
        this.views = new Text(data.viewCountText, "");
        this.published_at = new Text(data.publishedTimeText, "");
      }
    };
    module2.exports = ChannelVideoPlayer;
  }
});

// lib/parser/contents/classes/ChildVideo.js
var require_ChildVideo = __commonJS({
  "lib/parser/contents/classes/ChildVideo.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var Utils = require_Utils();
    var Text = require_Text();
    var ChildVideo = class {
      type = "ChildVideo";
      constructor(data) {
        this.id = data.videoId;
        this.title = new Text(data.title);
        this.duration = {
          text: data.lengthText.simpleText,
          seconds: Utils.timeToSeconds(data.lengthText.simpleText)
        };
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
      }
    };
    module2.exports = ChildVideo;
  }
});

// lib/parser/contents/classes/ChipCloud.js
var require_ChipCloud = __commonJS({
  "lib/parser/contents/classes/ChipCloud.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var ChipCloud = class {
      type = "ChipCloud";
      constructor(data) {
        this.chips = Parser.parse(data.chips);
        this.next_button = Parser.parse(data.nextButton);
        this.previous_button = Parser.parse(data.previousButton);
        this.horizontal_scrollable = data.horizontalScrollable;
      }
    };
    module2.exports = ChipCloud;
  }
});

// lib/parser/contents/classes/ChipCloudChip.js
var require_ChipCloudChip = __commonJS({
  "lib/parser/contents/classes/ChipCloudChip.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var ChipCloudChip = class {
      type = "ChipCloudChip";
      constructor(data) {
        this.is_selected = data.isSelected;
        this.endpoint = data.navigationEndpoint && new NavigationEndpoint(data.navigationEndpoint);
        this.text = new Text(data.text).toString();
      }
    };
    module2.exports = ChipCloudChip;
  }
});

// lib/parser/contents/classes/CollageHeroImage.js
var require_CollageHeroImage = __commonJS({
  "lib/parser/contents/classes/CollageHeroImage.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var Thumbnail = require_Thumbnail();
    var CollageHeroImage = class {
      type = "CollageHeroImage";
      constructor(data) {
        this.left = Thumbnail.fromResponse(data.leftThumbnail);
        this.top_right = Thumbnail.fromResponse(data.topRightThumbnail);
        this.bottom_right = Thumbnail.fromResponse(data.bottomRightThumbnail);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
      }
    };
    module2.exports = CollageHeroImage;
  }
});

// lib/parser/contents/classes/Comment.js
var require_Comment = __commonJS({
  "lib/parser/contents/classes/Comment.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var Author = require_Author();
    var Proto2 = require_proto();
    var { InnertubeError: InnertubeError2 } = require_Utils();
    var Comment = class {
      type = "Comment";
      #actions;
      constructor(data) {
        this.content = new Text(data.contentText);
        this.published = new Text(data.publishedTimeText);
        this.author_is_channel_owner = data.authorIsChannelOwner;
        this.current_user_reply_thumbnail = Thumbnail.fromResponse(data.currentUserReplyThumbnail);
        this.author_badge = Parser.parse(data.authorCommentBadge, "comments");
        this.author = new Author({
          ...data.authorText,
          navigationEndpoint: data.authorEndpoint
        }, this.author_badge ? [{
          metadataBadgeRenderer: this.author_badge?.orig_badge
        }] : null, data.authorThumbnail);
        this.action_menu = Parser.parse(data.actionMenu);
        this.action_buttons = Parser.parse(data.actionButtons, "comments");
        this.comment_id = data.commentId;
        this.vote_status = data.voteStatus;
        this.vote_count = {
          text: data.voteCount ? data.voteCount.accessibility.accessibilityData?.label.replace(/\D/g, "") : "0",
          short_text: data.voteCount ? new Text(data.voteCount).toString() : "0"
        };
        this.reply_count = data.replyCount || 0;
        this.is_liked = this.action_buttons.like_button.is_toggled;
        this.is_disliked = this.action_buttons.dislike_button.is_toggled;
        this.is_pinned = !!data.pinnedCommentBadge;
      }
      async like() {
        const button = this.action_buttons.like_button;
        if (button.is_toggled)
          throw new InnertubeError2("This comment is already liked", { comment_id: this.comment_id });
        const response = await button.endpoint.callTest(this.#actions, { parse: false });
        return response;
      }
      async dislike() {
        const button = this.action_buttons.dislike_button;
        if (button.is_toggled)
          throw new InnertubeError2("This comment is already disliked", { comment_id: this.comment_id });
        const response = await button.endpoint.callTest(this.#actions, { parse: false });
        return response;
      }
      async reply(text) {
        if (!this.action_buttons.reply_button)
          throw new InnertubeError2("Cannot reply to another reply. Try mentioning the user instead.", { comment_id: this.comment_id });
        const button = this.action_buttons.reply_button;
        const dialog_button = button.endpoint.dialog.reply_button;
        const payload = {
          params: {
            commentText: text
          }
        };
        const response = await dialog_button.endpoint.callTest(this.#actions, payload);
        return response;
      }
      async translate(target_language) {
        const text = this.content.toString().replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, "");
        const payload = {
          text,
          target_language,
          comment_id: this.comment_id
        };
        const action = Proto2.encodeCommentActionParams(22, payload);
        const response = await this.#actions.execute("comment/perform_comment_action", { action, client: "ANDROID" });
        const mutations = response.data.frameworkUpdates.entityBatchUpdate.mutations;
        const content = mutations[0].payload.commentEntityPayload.translatedContent.content;
        return { ...response, content };
      }
      setActions(actions) {
        this.#actions = actions;
      }
    };
    module2.exports = Comment;
  }
});

// lib/parser/contents/classes/CommentReplyDialog.js
var require_CommentReplyDialog = __commonJS({
  "lib/parser/contents/classes/CommentReplyDialog.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Thumbnail = require_Thumbnail();
    var Text = require_Text();
    var CommentReplyDialog = class {
      type = "CommentReplyDialog";
      constructor(data) {
        this.reply_button = Parser.parse(data.replyButton);
        this.cancel_button = Parser.parse(data.cancelButton);
        this.author_thumbnail = Thumbnail.fromResponse(data.authorThumbnail);
        this.placeholder = new Text(data.placeholderText);
        this.error_message = new Text(data.errorMessage);
      }
    };
    module2.exports = CommentReplyDialog;
  }
});

// lib/parser/contents/classes/comments/AuthorCommentBadge.js
var require_AuthorCommentBadge = __commonJS({
  "lib/parser/contents/classes/comments/AuthorCommentBadge.js"(exports2, module2) {
    "use strict";
    var AuthorCommentBadge = class {
      type = "AuthorCommentBadge";
      #data;
      constructor(data) {
        this.icon_type = data.icon.iconType;
        this.tooltip = data.iconTooltip;
        this.tooltip === "Verified" && (this.style = "BADGE_STYLE_TYPE_VERIFIED") && (data.style = "BADGE_STYLE_TYPE_VERIFIED");
        this.#data = data;
      }
      get orig_badge() {
        return this.#data;
      }
    };
    module2.exports = AuthorCommentBadge;
  }
});

// lib/parser/contents/classes/comments/CommentActionButtons.js
var require_CommentActionButtons = __commonJS({
  "lib/parser/contents/classes/comments/CommentActionButtons.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var CommentActionButtons = class {
      type = "CommentActionButtons";
      constructor(data) {
        this.like_button = Parser.parse(data.likeButton);
        this.dislike_button = Parser.parse(data.dislikeButton);
        this.reply_button = Parser.parse(data.replyButton);
      }
    };
    module2.exports = CommentActionButtons;
  }
});

// lib/parser/contents/classes/comments/CommentReplies.js
var require_CommentReplies = __commonJS({
  "lib/parser/contents/classes/comments/CommentReplies.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var CommentReplies = class {
      type = "CommentReplies";
      constructor(data) {
        this.contents = Parser.parse(data.contents);
        this.view_replies = Parser.parse(data.viewReplies);
        this.hide_replies = Parser.parse(data.hideReplies);
      }
    };
    module2.exports = CommentReplies;
  }
});

// lib/parser/contents/classes/comments/CommentSimplebox.js
var require_CommentSimplebox = __commonJS({
  "lib/parser/contents/classes/comments/CommentSimplebox.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Thumbnail = require_Thumbnail();
    var Text = require_Text();
    var CommentSimplebox = class {
      type = "CommentSimplebox";
      constructor(data) {
        this.submit_button = Parser.parse(data.submitButton);
        this.cancel_button = Parser.parse(data.cancelButton);
        this.author_thumbnails = Thumbnail.fromResponse(data.authorThumbnail);
        this.placeholder = new Text(data.placeholderText);
        this.avatar_size = data.avatarSize;
      }
    };
    module2.exports = CommentSimplebox;
  }
});

// lib/parser/contents/classes/CommentsEntryPointHeader.js
var require_CommentsEntryPointHeader = __commonJS({
  "lib/parser/contents/classes/CommentsEntryPointHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var CommentsEntryPointHeader = class {
      type = "CommentsEntryPointHeader";
      constructor(data) {
        this.header = new Text(data.headerText);
        this.comment_count = new Text(data.commentCount);
        this.teaser_avatar = Thumbnail.fromResponse(data.teaserAvatar || data.simpleboxAvatar);
        this.teaser_content = new Text(data.teaserContent);
        this.simplebox_placeholder = new Text(data.simpleboxPlaceholder);
      }
    };
    module2.exports = CommentsEntryPointHeader;
  }
});

// lib/parser/contents/classes/CommentsHeader.js
var require_CommentsHeader = __commonJS({
  "lib/parser/contents/classes/CommentsHeader.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var CommentsHeader = class {
      type = "CommentsHeader";
      constructor(data) {
        this.title = new Text(data.titleText);
        this.count = new Text(data.countText);
        this.comments_count = new Text(data.commentsCount);
        this.create_renderer = Parser.parse(data.createRenderer, "comments");
        this.sort_menu = Parser.parse(data.sortMenu);
        this.custom_emojis = data.customEmojis?.map((emoji) => ({
          emoji_id: emoji.emojiId,
          shortcuts: emoji.shortcuts,
          search_terms: emoji.searchTerms,
          image: Thumbnail.fromResponse(emoji.image),
          is_custom_emoji: emoji.isCustomEmoji
        })) || null;
      }
    };
    module2.exports = CommentsHeader;
  }
});

// lib/parser/contents/classes/CommentThread.js
var require_CommentThread = __commonJS({
  "lib/parser/contents/classes/CommentThread.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var { InnertubeError: InnertubeError2 } = require_Utils();
    var CommentThread = class {
      type = "CommentThread";
      #replies;
      #actions;
      #continuation;
      constructor(data) {
        this.comment = Parser.parse(data.comment);
        this.#replies = Parser.parse(data.replies, "comments");
        this.is_moderated_elq_comment = data.isModeratedElqComment;
      }
      async getReplies() {
        if (!this.#replies)
          throw new InnertubeError2("This comment has no replies.", { comment_id: this.comment.comment_id });
        const continuation = this.#replies.contents.get({ type: "ContinuationItem" });
        const response = await continuation.endpoint.callTest(this.#actions);
        this.replies = response.on_response_received_endpoints_memo.get("Comment").map((comment) => {
          comment.setActions(this.#actions);
          return comment;
        });
        this.#continuation = response.on_response_received_endpoints_memo.get("ContinuationItem")?.[0];
        return this;
      }
      async getContinuation() {
        if (!this.replies)
          throw new InnertubeError2("Continuation not available.");
        if (!this.#continuation)
          throw new InnertubeError2("Continuation not found.");
        const response = await this.#continuation.button.endpoint.callTest(this.#actions);
        this.replies = response.on_response_received_endpoints_memo.get("Comment").map((comment) => {
          comment.setActions(this.#actions);
          return comment;
        });
        this.#continuation = response.on_response_received_endpoints_memo.get("ContinuationItem")?.[0];
        return this;
      }
      setActions(actions) {
        this.#actions = actions;
      }
    };
    module2.exports = CommentThread;
  }
});

// lib/parser/contents/classes/CompactLink.js
var require_CompactLink = __commonJS({
  "lib/parser/contents/classes/CompactLink.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var CompactLink = class {
      type = "CompactLink";
      constructor(data) {
        this.title = new Text(data.title).toString();
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.style = data.style;
      }
    };
    module2.exports = CompactLink;
  }
});

// lib/parser/contents/classes/PlaylistAuthor.js
var require_PlaylistAuthor = __commonJS({
  "lib/parser/contents/classes/PlaylistAuthor.js"(exports2, module2) {
    "use strict";
    var Author = require_Author();
    var PlaylistAuthor = class extends Author {
      constructor(data) {
        super(data);
        delete this.badges;
        delete this.is_verified;
        delete this.is_verified_artist;
      }
    };
    module2.exports = PlaylistAuthor;
  }
});

// lib/parser/contents/classes/Playlist.js
var require_Playlist = __commonJS({
  "lib/parser/contents/classes/Playlist.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Parser = require_contents();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var PlaylistAuthor = require_PlaylistAuthor();
    var Playlist2 = class {
      type = "Playlist";
      constructor(data) {
        this.id = data.playlistId;
        this.title = new Text(data.title);
        this.author = data.shortBylineText?.simpleText ? new Text(data.shortBylineText) : new PlaylistAuthor(data.longBylineText, data.ownerBadges, null);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail || { thumbnails: data.thumbnails.map((th) => th.thumbnails).flat(1) });
        this.video_count = new Text(data.thumbnailText);
        this.video_count_short = new Text(data.videoCountShortText);
        this.first_videos = Parser.parse(data.videos) || [];
        this.share_url = data.shareUrl || null;
        this.menu = Parser.parse(data.menu);
        this.badges = Parser.parse(data.ownerBadges);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.thumbnail_overlays = Parser.parse(data.thumbnailOverlays) || [];
      }
    };
    module2.exports = Playlist2;
  }
});

// lib/parser/contents/classes/CompactMix.js
var require_CompactMix = __commonJS({
  "lib/parser/contents/classes/CompactMix.js"(exports2, module2) {
    "use strict";
    var Playlist2 = require_Playlist();
    var CompactMix = class extends Playlist2 {
      type = "CompactMix";
      constructor(data) {
        super(data);
      }
    };
    module2.exports = CompactMix;
  }
});

// lib/parser/contents/classes/CompactPlaylist.js
var require_CompactPlaylist = __commonJS({
  "lib/parser/contents/classes/CompactPlaylist.js"(exports2, module2) {
    "use strict";
    var Playlist2 = require_Playlist();
    var CompactPlaylist = class extends Playlist2 {
      type = "CompactPlaylist";
      constructor(data) {
        super(data);
      }
    };
    module2.exports = CompactPlaylist;
  }
});

// lib/parser/contents/classes/CompactVideo.js
var require_CompactVideo = __commonJS({
  "lib/parser/contents/classes/CompactVideo.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Author = require_Author();
    var Utils = require_Utils();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var CompactVideo = class {
      type = "CompactVideo";
      constructor(data) {
        this.id = data.videoId;
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail) || null;
        this.rich_thumbnail = data.richThumbnail && Parser.parse(data.richThumbnail);
        this.title = new Text(data.title);
        this.author = new Author(data.longBylineText, data.ownerBadges, data.channelThumbnail);
        this.view_count = new Text(data.viewCountText);
        this.short_view_count = new Text(data.shortViewCountText);
        this.published = new Text(data.publishedTimeText);
        this.duration = {
          text: new Text(data.lengthText).toString(),
          seconds: Utils.timeToSeconds(new Text(data.lengthText).toString())
        };
        this.thumbnail_overlays = Parser.parse(data.thumbnailOverlays);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.menu = Parser.parse(data.menu);
      }
      get best_thumbnail() {
        return this.thumbnails[0];
      }
    };
    module2.exports = CompactVideo;
  }
});

// lib/parser/contents/classes/ContinuationItem.js
var require_ContinuationItem = __commonJS({
  "lib/parser/contents/classes/ContinuationItem.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var NavigationEndpoint = require_NavigationEndpoint();
    var ContinuationItem = class {
      type = "ContinuationItem";
      constructor(data) {
        this.trigger = data.trigger;
        data.button && (this.button = Parser.parse(data.button));
        this.endpoint = new NavigationEndpoint(data.continuationEndpoint);
      }
    };
    module2.exports = ContinuationItem;
  }
});

// lib/parser/contents/classes/CtaGoToCreatorStudio.js
var require_CtaGoToCreatorStudio = __commonJS({
  "lib/parser/contents/classes/CtaGoToCreatorStudio.js"(exports2, module2) {
    "use strict";
    var CtaGoToCreatorStudio = class {
      type = "CtaGoToCreatorStudio";
      constructor(data) {
        this.title = data.buttonLabel;
        this.use_new_specs = data.useNewSpecs;
      }
    };
    module2.exports = CtaGoToCreatorStudio;
  }
});

// lib/parser/contents/classes/DidYouMean.js
var require_DidYouMean = __commonJS({
  "lib/parser/contents/classes/DidYouMean.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var DidYouMean = class {
      type = "DidYouMean";
      constructor(data) {
        this.corrected_query = new Text(data.correctedQuery);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
      }
    };
    module2.exports = DidYouMean;
  }
});

// lib/parser/contents/classes/DownloadButton.js
var require_DownloadButton = __commonJS({
  "lib/parser/contents/classes/DownloadButton.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var DownloadButton = class {
      type = "DownloadButton";
      constructor(data) {
        this.style = data.style;
        this.size = data.size;
        this.endpoint = new NavigationEndpoint(data.command);
        this.target_id = data.targetId;
      }
    };
    module2.exports = DownloadButton;
  }
});

// lib/parser/contents/classes/Element.js
var require_Element = __commonJS({
  "lib/parser/contents/classes/Element.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Element = class {
      type = "Element";
      constructor(data) {
        const type = data.newElement.type.componentType;
        return Parser.parse(type.model);
      }
    };
    module2.exports = Element;
  }
});

// lib/parser/contents/classes/EmergencyOnebox.js
var require_EmergencyOnebox = __commonJS({
  "lib/parser/contents/classes/EmergencyOnebox.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Parser = require_contents();
    var EmergencyOnebox = class {
      type = "EmergencyOnebox";
      constructor(data) {
        this.title = new Text(data.title);
        this.first_option = Parser.parse(data.firstOption);
        this.menu = Parser.parse(data.menu);
      }
    };
    module2.exports = EmergencyOnebox;
  }
});

// lib/parser/contents/classes/Endscreen.js
var require_Endscreen = __commonJS({
  "lib/parser/contents/classes/Endscreen.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Endscreen = class {
      type = "Endscreen";
      constructor(data) {
        this.elements = Parser.parse(data.elements);
        this.start_ms = data.startMs;
      }
    };
    module2.exports = Endscreen;
  }
});

// lib/parser/contents/classes/EndscreenElement.js
var require_EndscreenElement = __commonJS({
  "lib/parser/contents/classes/EndscreenElement.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Text = require_Text();
    var EndscreenElement = class {
      type = "EndscreenElement";
      constructor(data) {
        this.style = data.style;
        this.title = new Text(data.title);
        this.endpoint = new NavigationEndpoint(data.endpoint);
        if (data.image) {
          this.image = Thumbnail.fromResponse(data.image);
        }
        if (data.icon) {
          this.icon = Thumbnail.fromResponse(data.icon);
        }
        if (data.metadata) {
          this.metadata = new Text(data.metadata);
        }
        if (data.callToAction) {
          this.call_to_action = new Text(data.callToAction);
        }
        if (data.hovercardButton) {
          this.hovercard_button = Parser.parse(data.hovercardButton);
        }
        if (data.isSubscribe) {
          this.is_subscribe = data.isSubscribe;
        }
        this.thumbnail_overlays = Parser.parse(data.thumbnailOverlays);
        this.left = data.left;
        this.width = data.width;
        this.top = data.top;
        this.aspect_ratio = data.aspectRatio;
        this.start_ms = data.startMs;
        this.end_ms = data.endMs;
        this.id = data.id;
      }
    };
    module2.exports = EndscreenElement;
  }
});

// lib/parser/contents/classes/EndScreenPlaylist.js
var require_EndScreenPlaylist = __commonJS({
  "lib/parser/contents/classes/EndScreenPlaylist.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var EndScreenPlaylist = class {
      type = "EndScreenPlaylist";
      constructor(data) {
        this.id = data.playlistId;
        this.title = new Text(data.title);
        this.author = new Text(data.longBylineText);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.video_count = new Text(data.videoCountText);
      }
    };
    module2.exports = EndScreenPlaylist;
  }
});

// lib/parser/contents/classes/EndScreenVideo.js
var require_EndScreenVideo = __commonJS({
  "lib/parser/contents/classes/EndScreenVideo.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Author = require_Author();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var EndScreenVideo = class {
      type = "EndScreenVideo";
      constructor(data) {
        this.id = data.videoId;
        this.title = new Text(data.title);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.thumbnail_overlays = Parser.parse(data.thumbnailOverlays);
        this.author = new Author(data.shortBylineText, data.ownerBadges);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.short_view_count_text = new Text(data.shortViewCountText);
        this.badges = Parser.parse(data.badges);
        this.duration = {
          text: new Text(data.lengthText).toString(),
          seconds: data.lengthInSeconds
        };
      }
    };
    module2.exports = EndScreenVideo;
  }
});

// lib/parser/contents/classes/ExpandableTab.js
var require_ExpandableTab = __commonJS({
  "lib/parser/contents/classes/ExpandableTab.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var NavigationEndpoint = require_NavigationEndpoint();
    var ExpandableTab = class {
      type = "ExpandableTab";
      constructor(data) {
        this.title = data.title;
        this.endpoint = new NavigationEndpoint(data.endpoint);
        this.selected = data.selected;
        this.content = data.content ? Parser.parse(data.content) : null;
      }
    };
    module2.exports = ExpandableTab;
  }
});

// lib/parser/contents/classes/ExpandedShelfContents.js
var require_ExpandedShelfContents = __commonJS({
  "lib/parser/contents/classes/ExpandedShelfContents.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var ExpandedShelfContents = class {
      type = "ExpandedShelfContents";
      constructor(data) {
        this.items = Parser.parse(data.items);
      }
      get contents() {
        return this.items;
      }
    };
    module2.exports = ExpandedShelfContents;
  }
});

// lib/parser/contents/classes/FeedFilterChipBar.js
var require_FeedFilterChipBar = __commonJS({
  "lib/parser/contents/classes/FeedFilterChipBar.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var FeedFilterChipBar = class {
      type = "FeedFilterChipBar";
      constructor(data) {
        this.contents = Parser.parse(data.contents);
      }
    };
    module2.exports = FeedFilterChipBar;
  }
});

// lib/parser/contents/classes/FeedTabbedHeader.js
var require_FeedTabbedHeader = __commonJS({
  "lib/parser/contents/classes/FeedTabbedHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var FeedTabbedHeader = class {
      constructor(data) {
        this.title = new Text(data.title);
      }
    };
    module2.exports = FeedTabbedHeader;
  }
});

// lib/parser/contents/classes/Grid.js
var require_Grid = __commonJS({
  "lib/parser/contents/classes/Grid.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Grid = class {
      type = "Grid";
      constructor(data) {
        this.items = Parser.parse(data.items);
        this.is_collapsible = data.isCollapsible;
        this.visible_row_count = data.visibleRowCount;
        this.target_id = data.targetId;
      }
      get contents() {
        return this.items;
      }
    };
    module2.exports = Grid;
  }
});

// lib/parser/contents/classes/GridChannel.js
var require_GridChannel = __commonJS({
  "lib/parser/contents/classes/GridChannel.js"(exports2, module2) {
    "use strict";
    var Author = require_Author();
    var Parser = require_contents();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Text = require_Text();
    var GridChannel = class {
      type = "GridChannel";
      constructor(data) {
        this.id = data.channelId;
        this.author = new Author({
          ...data.title,
          navigationEndpoint: data.navigationEndpoint
        }, data.ownerBadges, data.thumbnail);
        this.subscribers = new Text(data.subscriberCountText);
        this.video_count = new Text(data.videoCountText);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.subscribe_button = Parser.parse(data.subscribeButton);
      }
    };
    module2.exports = GridChannel;
  }
});

// lib/parser/contents/classes/GridPlaylist.js
var require_GridPlaylist = __commonJS({
  "lib/parser/contents/classes/GridPlaylist.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Parser = require_contents();
    var Thumbnail = require_Thumbnail();
    var PlaylistAuthor = require_PlaylistAuthor();
    var NavigationEndpoint = require_NavigationEndpoint();
    var NavigatableText = require_NavigatableText();
    var GridPlaylist = class {
      type = "GridPlaylist";
      constructor(data) {
        this.id = data.playlistId;
        this.title = new Text(data.title);
        if (data.shortBylineText) {
          this.author = new PlaylistAuthor(data.shortBylineText, data.ownerBadges);
        }
        this.badges = Parser.parse(data.ownerBadges);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.view_playlist = new NavigatableText(data.viewPlaylistText);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.thumbnail_renderer = Parser.parse(data.thumbnailRenderer);
        this.sidebar_thumbnails = [].concat(...data.sidebarThumbnails?.map((thumbnail) => Thumbnail.fromResponse(thumbnail)) || []) || null;
        this.video_count = new Text(data.thumbnailText);
        this.video_count_short_text = new Text(data.videoCountShortText);
      }
    };
    module2.exports = GridPlaylist;
  }
});

// lib/parser/contents/classes/GridVideo.js
var require_GridVideo = __commonJS({
  "lib/parser/contents/classes/GridVideo.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Author = require_Author();
    var GridVideo = class {
      type = "GridVideo";
      constructor(data) {
        const length_alt = data.thumbnailOverlays.find((overlay) => overlay.hasOwnProperty("thumbnailOverlayTimeStatusRenderer"))?.thumbnailOverlayTimeStatusRenderer;
        this.id = data.videoId;
        this.title = new Text(data.title);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.thumbnail_overlays = Parser.parse(data.thumbnailOverlays);
        this.rich_thumbnail = data.richThumbnail && Parser.parse(data.richThumbnail);
        this.published = new Text(data.publishedTimeText);
        this.duration = data.lengthText ? new Text(data.lengthText) : length_alt?.text ? new Text(length_alt.text) : "";
        this.author = data.shortBylineText && new Author(data.shortBylineText, data.ownerBadges);
        this.views = new Text(data.viewCountText);
        this.short_view_count = new Text(data.shortViewCountText);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.menu = Parser.parse(data.menu);
      }
    };
    module2.exports = GridVideo;
  }
});

// lib/parser/contents/classes/HorizontalCardList.js
var require_HorizontalCardList = __commonJS({
  "lib/parser/contents/classes/HorizontalCardList.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var HorizontalCardList = class {
      type = "HorizontalCardList";
      constructor(data) {
        this.cards = Parser.parse(data.cards);
        this.header = Parser.parse(data.header);
        this.previous_button = Parser.parse(data.previousButton);
        this.next_button = Parser.parse(data.nextButton);
      }
    };
    module2.exports = HorizontalCardList;
  }
});

// lib/parser/contents/classes/HorizontalList.js
var require_HorizontalList = __commonJS({
  "lib/parser/contents/classes/HorizontalList.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var HorizontalList = class {
      type = "HorizontalList";
      constructor(data) {
        this.visible_item_count = data.visibleItemCount;
        this.items = Parser.parse(data.items);
      }
      get contents() {
        return this.items;
      }
    };
    module2.exports = HorizontalList;
  }
});

// lib/parser/contents/classes/ItemSection.js
var require_ItemSection = __commonJS({
  "lib/parser/contents/classes/ItemSection.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var ItemSection = class {
      type = "ItemSection";
      constructor(data) {
        this.header = Parser.parse(data.header);
        this.contents = Parser.parse(data.contents);
        if (data.targetId || data.sectionIdentifier) {
          this.target_id = data?.target_id || data?.sectionIdentifier;
        }
      }
    };
    module2.exports = ItemSection;
  }
});

// lib/parser/contents/classes/ItemSectionHeader.js
var require_ItemSectionHeader = __commonJS({
  "lib/parser/contents/classes/ItemSectionHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ItemSectionHeader = class {
      constructor(data) {
        this.title = new Text(data.title);
      }
    };
    module2.exports = ItemSectionHeader;
  }
});

// lib/parser/contents/classes/LikeButton.js
var require_LikeButton = __commonJS({
  "lib/parser/contents/classes/LikeButton.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var LikeButton = class {
      type = "LikeButton";
      constructor(data) {
        this.target = {
          video_id: data.target.videoId
        };
        this.like_status = data.likeStatus;
        this.likes_allowed = data.likesAllowed;
        if (data.serviceEndpoints) {
          this.endpoints = data.serviceEndpoints?.map((endpoint) => new NavigationEndpoint(endpoint));
        }
      }
    };
    module2.exports = LikeButton;
  }
});

// lib/parser/contents/classes/LiveChat.js
var require_LiveChat = __commonJS({
  "lib/parser/contents/classes/LiveChat.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var LiveChat = class {
      type = "LiveChat";
      constructor(data) {
        this.header = Parser.parse(data.header);
        this.initial_display_state = data.initialDisplayState;
        this.continuation = data.continuations[0]?.reloadContinuationData?.continuation;
        this.client_messages = {
          reconnect_message: new Text(data.clientMessages.reconnectMessage),
          unable_to_reconnect_message: new Text(data.clientMessages.unableToReconnectMessage),
          fatal_error: new Text(data.clientMessages.fatalError),
          reconnected_message: new Text(data.clientMessages.reconnectedMessage),
          generic_error: new Text(data.clientMessages.genericError)
        };
        this.is_replay = data.isReplay || false;
      }
    };
    module2.exports = LiveChat;
  }
});

// lib/parser/contents/classes/livechat/AddBannerToLiveChatCommand.js
var require_AddBannerToLiveChatCommand = __commonJS({
  "lib/parser/contents/classes/livechat/AddBannerToLiveChatCommand.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var AddBannerToLiveChatCommand = class {
      constructor(data) {
        return Parser.parse(data.bannerRenderer, "livechat/items");
      }
    };
    module2.exports = AddBannerToLiveChatCommand;
  }
});

// lib/parser/contents/classes/livechat/AddChatItemAction.js
var require_AddChatItemAction = __commonJS({
  "lib/parser/contents/classes/livechat/AddChatItemAction.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var AddChatItemAction = class {
      type = "AddChatItemAction";
      constructor(data) {
        this.item = Parser.parse(data.item, "livechat/items");
        this.client_id = data.clientId || null;
      }
    };
    module2.exports = AddChatItemAction;
  }
});

// lib/parser/contents/classes/livechat/AddLiveChatTickerItemAction.js
var require_AddLiveChatTickerItemAction = __commonJS({
  "lib/parser/contents/classes/livechat/AddLiveChatTickerItemAction.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var AddLiveChatTickerItemAction = class {
      type = "AddLiveChatTickerItemAction";
      constructor(data) {
        this.item = Parser.parse(data.item, "livechat/items");
        this.duration_sec = data.durationSec;
      }
    };
    module2.exports = AddLiveChatTickerItemAction;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatBanner.js
var require_LiveChatBanner = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatBanner.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var LiveChatBanner = class {
      type = "LiveChatBanner";
      constructor(data) {
        this.header = Parser.parse(data.header, "livechat/items");
        this.contents = Parser.parse(data.contents, "livechat/items");
        this.action_id = data.actionId;
        this.viewer_is_creator = data.viewerIsCreator;
        this.target_id = data.targetId;
        this.is_stackable = data.isStackable;
        this.background_type = data.backgroundType;
      }
    };
    module2.exports = LiveChatBanner;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatBannerHeader.js
var require_LiveChatBannerHeader = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatBannerHeader.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var LiveChatBannerHeader = class {
      type = "LiveChatBannerHeader";
      constructor(data) {
        this.text = new Text(data.text).toString();
        this.icon_type = data.icon.iconType;
        this.context_menu_button = Parser.parse(data.contextMenuButton);
      }
    };
    module2.exports = LiveChatBannerHeader;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatBannerPoll.js
var require_LiveChatBannerPoll = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatBannerPoll.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var LiveChatBannerPoll = class {
      type = "LiveChatBannerPoll";
      constructor(data) {
        this.poll_question = new Text(data.pollQuestion);
        this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
        this.choices = data.pollChoices.map((choice) => ({
          option_id: choice.pollOptionId,
          text: new Text(choice.text).toString()
        }));
        this.collapsed_state_entity_key = data.collapsedStateEntityKey;
        this.live_chat_poll_state_entity_key = data.liveChatPollStateEntityKey;
        this.context_menu_button = Parser.parse(data.contextMenuButton);
      }
    };
    module2.exports = LiveChatBannerPoll;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatMembershipItem.js
var require_LiveChatMembershipItem = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatMembershipItem.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var LiveChatMembershipItem = class {
      type = "LiveChatMembershipItem";
      constructor(data) {
        this.id = data.id;
        this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
        this.header_subtext = new Text(data.headerSubtext);
        this.author = {
          id: data.authorExternalChannelId,
          name: new Text(data?.authorName),
          thumbnails: Thumbnail.fromResponse(data.authorPhoto),
          badges: Parser.parse(data.authorBadges)
        };
        this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
      }
    };
    module2.exports = LiveChatMembershipItem;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatPaidMessage.js
var require_LiveChatPaidMessage = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatPaidMessage.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Parser = require_contents();
    var LiveChatPaidMessage = class {
      type = "LiveChatPaidMessage";
      constructor(data) {
        this.message = new Text(data.message);
        this.author = {
          id: data.authorExternalChannelId,
          name: new Text(data.authorName),
          thumbnails: Thumbnail.fromResponse(data.authorPhoto),
          badges: Parser.parse(data.authorBadges)
        };
        const badges = Parser.parse(data.authorBadges);
        this.author.badges = badges;
        this.author.is_moderator = badges?.some((badge) => badge.icon_type == "MODERATOR") || null;
        this.author.is_verified = badges?.some((badge) => badge.style == "BADGE_STYLE_TYPE_VERIFIED") || null;
        this.author.is_verified_artist = badges?.some((badge) => badge.style == "BADGE_STYLE_TYPE_VERIFIED_ARTIST") || null;
        this.purchase_amount = new Text(data.purchaseAmountText).toString();
        this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
        this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
        this.timestamp_text = new Text(data.timestampText).toString();
        this.id = data.id;
      }
    };
    module2.exports = LiveChatPaidMessage;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatPaidSticker.js
var require_LiveChatPaidSticker = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatPaidSticker.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Thumbnail = require_Thumbnail();
    var Text = require_Text();
    var LiveChatPaidSticker = class {
      type = "LiveChatPaidSticker";
      constructor(data) {
        this.id = data.id;
        this.author = {
          id: data.authorExternalChannelId,
          name: new Text(data.authorName),
          thumbnails: Thumbnail.fromResponse(data.authorPhoto),
          badges: Parser.parse(data.authorBadges)
        };
        this.sticker = Thumbnail.fromResponse(data.sticker);
        this.purchase_amount = new Text(data.purchaseAmountText).toString();
        this.context_menu = new NavigationEndpoint(data.contextMenuEndpoint);
        this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
      }
    };
    module2.exports = LiveChatPaidSticker;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatPlaceholderItem.js
var require_LiveChatPlaceholderItem = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatPlaceholderItem.js"(exports2, module2) {
    "use strict";
    var LiveChatPlaceholderItem = class {
      type = "LiveChatPlaceholderItem";
      constructor(data) {
        this.id = data.id;
        this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
      }
    };
    module2.exports = LiveChatPlaceholderItem;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatTextMessage.js
var require_LiveChatTextMessage = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatTextMessage.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Parser = require_contents();
    var LiveChatTextMessage = class {
      type = "LiveChatTextMessage";
      constructor(data) {
        this.message = new Text(data.message);
        this.author = {
          id: data.authorExternalChannelId,
          name: new Text(data.authorName),
          thumbnails: Thumbnail.fromResponse(data.authorPhoto)
        };
        const badges = Parser.parse(data.authorBadges);
        this.author.badges = badges;
        this.author.is_moderator = badges?.some((badge) => badge.icon_type == "MODERATOR") || null;
        this.author.is_verified = badges?.some((badge) => badge.style == "BADGE_STYLE_TYPE_VERIFIED") || null;
        this.author.is_verified_artist = badges?.some((badge) => badge.style == "BADGE_STYLE_TYPE_VERIFIED_ARTIST") || null;
        this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
        this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
        this.id = data.id;
      }
    };
    module2.exports = LiveChatTextMessage;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatTickerPaidMessageItem.js
var require_LiveChatTickerPaidMessageItem = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatTickerPaidMessageItem.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Parser = require_contents();
    var LiveChatTickerPaidMessageItem = class {
      type = "LiveChatTickerPaidMessageItem";
      constructor(data) {
        this.author = {
          id: data.authorExternalChannelId,
          thumbnails: Thumbnail.fromResponse(data.authorPhoto),
          badges: Parser.parse(data.authorBadges)
        };
        const badges = Parser.parse(data.authorBadges);
        this.author.badges = badges;
        this.author.is_moderator = badges?.some((badge) => badge.icon_type == "MODERATOR") || null;
        this.author.is_verified = badges?.some((badge) => badge.style == "BADGE_STYLE_TYPE_VERIFIED") || null;
        this.author.is_verified_artist = badges?.some((badge) => badge.style == "BADGE_STYLE_TYPE_VERIFIED_ARTIST") || null;
        this.amount = new Text(data.amount);
        this.duration_sec = data.durationSec;
        this.full_duration_sec = data.fullDurationSec;
        this.show_item = Parser.parse(data.showItemEndpoint.showLiveChatItemEndpoint.renderer, "livechat/items");
        this.show_item_endpoint = new NavigationEndpoint(data.showItemEndpoint);
        this.id = data.id;
      }
    };
    module2.exports = LiveChatTickerPaidMessageItem;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatTickerSponsorItem.js
var require_LiveChatTickerSponsorItem = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatTickerSponsorItem.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var LiveChatTickerSponsorItem = class {
      type = "LiveChatTickerSponsorItem";
      constructor(data) {
        this.id = data.id;
        this.detail_text = new Text(data.detailText).toString();
        this.author = {
          id: data.authorExternalChannelId,
          name: new Text(data?.authorName),
          thumbnails: Thumbnail.fromResponse(data.sponsorPhoto)
        };
        this.duration_sec = data.durationSec;
      }
    };
    module2.exports = LiveChatTickerSponsorItem;
  }
});

// lib/parser/contents/classes/livechat/items/LiveChatViewerEngagementMessage.js
var require_LiveChatViewerEngagementMessage = __commonJS({
  "lib/parser/contents/classes/livechat/items/LiveChatViewerEngagementMessage.js"(exports2, module2) {
    "use strict";
    var LiveChatTextMessage = require_LiveChatTextMessage();
    var Parser = require_contents();
    var LiveChatViewerEngagementMessage = class extends LiveChatTextMessage {
      type = "LiveChatViewerEngagementMessage";
      constructor(data) {
        super(data);
        delete this.author;
        delete this.menu_endpoint;
        this.icon_type = data.icon.iconType;
        this.action_button = Parser.parse(data.actionButton);
      }
    };
    module2.exports = LiveChatViewerEngagementMessage;
  }
});

// lib/parser/contents/classes/livechat/items/Poll.js
var require_Poll = __commonJS({
  "lib/parser/contents/classes/livechat/items/Poll.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Poll = class {
      type = "Poll";
      constructor(data) {
        this.header = Parser.parse(data.header, "livechat/items");
        this.choices = data.choices.map((choice) => ({
          text: new Text(choice.text).toString(),
          selected: choice.selected,
          vote_ratio: choice.voteRatio,
          vote_percentage: new Text(choice.votePercentage).toString(),
          select_endpoint: new NavigationEndpoint(choice.selectServiceEndpoint)
        }));
        this.live_chat_poll_id = data.liveChatPollId;
      }
    };
    module2.exports = Poll;
  }
});

// lib/parser/contents/classes/livechat/items/PollHeader.js
var require_PollHeader = __commonJS({
  "lib/parser/contents/classes/livechat/items/PollHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var Parser = require_contents();
    var PollHeader = class {
      type = "PollHeader";
      constructor(data) {
        this.poll_question = new Text(data.pollQuestion);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.metadata = new Text(data.metadataText);
        this.live_chat_poll_type = data.liveChatPollType;
        this.context_menu_button = Parser.parse(data.contextMenuButton);
      }
    };
    module2.exports = PollHeader;
  }
});

// lib/parser/contents/classes/livechat/LiveChatActionPanel.js
var require_LiveChatActionPanel = __commonJS({
  "lib/parser/contents/classes/livechat/LiveChatActionPanel.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var LiveChatActionPanel = class {
      type = "LiveChatActionPanel";
      constructor(data) {
        this.id = data.id;
        this.contents = Parser.parse(data.contents, "livechat/items");
        this.target_id = data.targetId;
      }
    };
    module2.exports = LiveChatActionPanel;
  }
});

// lib/parser/contents/classes/livechat/MarkChatItemAsDeletedAction.js
var require_MarkChatItemAsDeletedAction = __commonJS({
  "lib/parser/contents/classes/livechat/MarkChatItemAsDeletedAction.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var MarkChatItemAsDeletedAction = class {
      type = "MarkChatItemAsDeletedAction";
      constructor(data) {
        this.deleted_state_message = new Text(data.deletedStateMessage);
        this.target_item_id = data.targetItemId;
      }
    };
    module2.exports = MarkChatItemAsDeletedAction;
  }
});

// lib/parser/contents/classes/livechat/MarkChatItemsByAuthorAsDeletedAction.js
var require_MarkChatItemsByAuthorAsDeletedAction = __commonJS({
  "lib/parser/contents/classes/livechat/MarkChatItemsByAuthorAsDeletedAction.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var MarkChatItemsByAuthorAsDeletedAction = class {
      type = "MarkChatItemsByAuthorAsDeletedAction";
      constructor(data) {
        this.deleted_state_message = new Text(data.deletedStateMessage);
        this.channel_id = data.externalChannelId;
      }
    };
    module2.exports = MarkChatItemsByAuthorAsDeletedAction;
  }
});

// lib/parser/contents/classes/livechat/RemoveBannerForLiveChatCommand.js
var require_RemoveBannerForLiveChatCommand = __commonJS({
  "lib/parser/contents/classes/livechat/RemoveBannerForLiveChatCommand.js"(exports2, module2) {
    "use strict";
    var RemoveBannerForLiveChatCommand = class {
      type = "RemoveBannerForLiveChatCommand";
      constructor(data) {
        this.target_action_id = data.targetActionId;
      }
    };
    module2.exports = RemoveBannerForLiveChatCommand;
  }
});

// lib/parser/contents/classes/livechat/ReplaceChatItemAction.js
var require_ReplaceChatItemAction = __commonJS({
  "lib/parser/contents/classes/livechat/ReplaceChatItemAction.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var ReplaceChatItemAction = class {
      constructor(data) {
        this.target_item_id = data.targetItemId;
        this.replacement_item = Parser.parse(data.replacementItem, "livechat/items");
      }
    };
    module2.exports = ReplaceChatItemAction;
  }
});

// lib/parser/contents/classes/livechat/ReplayChatItemAction.js
var require_ReplayChatItemAction = __commonJS({
  "lib/parser/contents/classes/livechat/ReplayChatItemAction.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var ReplayChatItemAction = class {
      type = "ReplayChatItemAction";
      constructor(data) {
        this.actions = Parser.parse(data.actions?.map((action) => {
          delete action.clickTrackingParams;
          return action;
        }), "livechat") || [];
        this.video_offset_time_msec = data.videoOffsetTimeMsec;
      }
    };
    module2.exports = ReplayChatItemAction;
  }
});

// lib/parser/contents/classes/livechat/ShowLiveChatActionPanelAction.js
var require_ShowLiveChatActionPanelAction = __commonJS({
  "lib/parser/contents/classes/livechat/ShowLiveChatActionPanelAction.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var ShowLiveChatActionPanelAction = class {
      type = "ShowLiveChatActionPanelAction";
      constructor(data) {
        this.panel_to_show = Parser.parse(data.panelToShow, "livechat");
      }
    };
    module2.exports = ShowLiveChatActionPanelAction;
  }
});

// lib/parser/contents/classes/livechat/ShowLiveChatTooltipCommand.js
var require_ShowLiveChatTooltipCommand = __commonJS({
  "lib/parser/contents/classes/livechat/ShowLiveChatTooltipCommand.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var ShowLiveChatTooltipCommand = class {
      type = "ShowLiveChatTooltipCommand";
      constructor(data) {
        this.tooltip = Parser.parse(data.tooltip);
      }
    };
    module2.exports = ShowLiveChatTooltipCommand;
  }
});

// lib/parser/contents/classes/livechat/UpdateDateTextAction.js
var require_UpdateDateTextAction = __commonJS({
  "lib/parser/contents/classes/livechat/UpdateDateTextAction.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var UpdateDateTextAction = class {
      type = "UpdateDateTextAction";
      constructor(data) {
        this.date_text = new Text(data.dateText).toString();
      }
    };
    module2.exports = UpdateDateTextAction;
  }
});

// lib/parser/contents/classes/livechat/UpdateDescriptionAction.js
var require_UpdateDescriptionAction = __commonJS({
  "lib/parser/contents/classes/livechat/UpdateDescriptionAction.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var UpdateDescriptionAction = class {
      type = "UpdateDescriptionAction";
      constructor(data) {
        this.description = new Text(data.description);
      }
    };
    module2.exports = UpdateDescriptionAction;
  }
});

// lib/parser/contents/classes/livechat/UpdateLiveChatPollAction.js
var require_UpdateLiveChatPollAction = __commonJS({
  "lib/parser/contents/classes/livechat/UpdateLiveChatPollAction.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var UpdateLiveChatPollAction = class {
      type = "UpdateLiveChatPollAction";
      constructor(data) {
        this.poll_to_update = Parser.parse(data.pollToUpdate, "livechat/items");
      }
    };
    module2.exports = UpdateLiveChatPollAction;
  }
});

// lib/parser/contents/classes/livechat/UpdateTitleAction.js
var require_UpdateTitleAction = __commonJS({
  "lib/parser/contents/classes/livechat/UpdateTitleAction.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var UpdateTitleAction = class {
      type = "UpdateTitleAction";
      constructor(data) {
        this.title = new Text(data.title);
      }
    };
    module2.exports = UpdateTitleAction;
  }
});

// lib/parser/contents/classes/livechat/UpdateToggleButtonTextAction.js
var require_UpdateToggleButtonTextAction = __commonJS({
  "lib/parser/contents/classes/livechat/UpdateToggleButtonTextAction.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var UpdateToggleButtonTextAction = class {
      type = "UpdateToggleButtonTextAction";
      constructor(data) {
        this.default_text = new Text(data.defaultText).toString();
        this.toggled_text = new Text(data.toggledText).toString();
        this.button_id = data.buttonId;
      }
    };
    module2.exports = UpdateToggleButtonTextAction;
  }
});

// lib/parser/contents/classes/livechat/UpdateViewershipAction.js
var require_UpdateViewershipAction = __commonJS({
  "lib/parser/contents/classes/livechat/UpdateViewershipAction.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var UpdateViewershipAction = class {
      type = "UpdateViewershipAction";
      constructor(data) {
        const view_count_renderer = data.viewCount.videoViewCountRenderer;
        this.view_count = new Text(view_count_renderer.viewCount);
        this.extra_short_view_count = new Text(view_count_renderer.extraShortViewCount);
        this.is_live = view_count_renderer.isLive;
      }
    };
    module2.exports = UpdateViewershipAction;
  }
});

// lib/parser/contents/classes/MetadataBadge.js
var require_MetadataBadge = __commonJS({
  "lib/parser/contents/classes/MetadataBadge.js"(exports2, module2) {
    "use strict";
    var MetadataBadge = class {
      constructor(data) {
        data.icon && (this.icon_type = data.icon.iconType);
        data.style && (this.style = data.style);
        this.tooltip = data.tooltip || data.iconTooltip || null;
      }
    };
    module2.exports = MetadataBadge;
  }
});

// lib/parser/contents/classes/LiveChatAuthorBadge.js
var require_LiveChatAuthorBadge = __commonJS({
  "lib/parser/contents/classes/LiveChatAuthorBadge.js"(exports2, module2) {
    "use strict";
    var MetadataBadge = require_MetadataBadge();
    var Thumbnail = require_Thumbnail();
    var LiveChatAuthorBadge = class extends MetadataBadge {
      constructor(data) {
        super(data);
        this.custom_thumbnail = data.customThumbnail ? Thumbnail.fromResponse(data.customThumbnail) : null;
      }
    };
    module2.exports = LiveChatAuthorBadge;
  }
});

// lib/parser/contents/classes/LiveChatHeader.js
var require_LiveChatHeader = __commonJS({
  "lib/parser/contents/classes/LiveChatHeader.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var LiveChatHeader = class {
      type = "LiveChatHeader";
      constructor(data) {
        this.overflow_menu = Parser.parse(data.overflowMenu);
        this.collapse_button = Parser.parse(data.collapseButton);
        this.view_selector = Parser.parse(data.viewSelector);
      }
    };
    module2.exports = LiveChatHeader;
  }
});

// lib/parser/contents/classes/LiveChatItemList.js
var require_LiveChatItemList = __commonJS({
  "lib/parser/contents/classes/LiveChatItemList.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var LiveChatItemList = class {
      type = "LiveChatItemList";
      constructor(data) {
        this.max_items_to_display = data.maxItemsToDisplay;
        this.more_comments_below_button = Parser.parse(data.moreCommentsBelowButton);
      }
    };
    module2.exports = LiveChatItemList;
  }
});

// lib/parser/contents/classes/LiveChatMessageInput.js
var require_LiveChatMessageInput = __commonJS({
  "lib/parser/contents/classes/LiveChatMessageInput.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Parser = require_contents();
    var Thumbnail = require_Thumbnail();
    var LiveChatMessageInput = class {
      constructor(data) {
        this.author_name = new Text(data.authorName);
        this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
        this.send_button = Parser.parse(data.sendButton);
        this.target_id = data.targetId;
      }
    };
    module2.exports = LiveChatMessageInput;
  }
});

// lib/parser/contents/classes/LiveChatParticipant.js
var require_LiveChatParticipant = __commonJS({
  "lib/parser/contents/classes/LiveChatParticipant.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var LiveChatParticipant = class {
      type = "LiveChatParticipant";
      constructor(data) {
        this.name = new Text(data.authorName);
        this.photo = Thumbnail.fromResponse(data.authorPhoto);
        this.badges = Parser.parse(data.authorBadges);
      }
    };
    module2.exports = LiveChatParticipant;
  }
});

// lib/parser/contents/classes/LiveChatParticipantsList.js
var require_LiveChatParticipantsList = __commonJS({
  "lib/parser/contents/classes/LiveChatParticipantsList.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var LiveChatParticipantsList = class {
      type = "LiveChatParticipantsList";
      constructor(data) {
        this.title = new Text(data.title);
        this.participants = Parser.parse(data.participants);
      }
    };
    module2.exports = LiveChatParticipantsList;
  }
});

// lib/parser/contents/classes/Menu.js
var require_Menu = __commonJS({
  "lib/parser/contents/classes/Menu.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Menu = class {
      type = "Menu";
      constructor(data) {
        this.items = Parser.parse(data.items) || [];
        this.top_level_buttons = Parser.parse(data.topLevelButtons) || [];
        this.label = data.accessibility?.accessibilityData?.label || null;
      }
      get contents() {
        return this.items;
      }
    };
    module2.exports = Menu;
  }
});

// lib/parser/contents/classes/MenuNavigationItem.js
var require_MenuNavigationItem = __commonJS({
  "lib/parser/contents/classes/MenuNavigationItem.js"(exports2, module2) {
    "use strict";
    var Button = require_Button();
    var MenuNavigationItem = class extends Button {
      type = "MenuNavigationItem";
      constructor(data) {
        super(data);
      }
    };
    module2.exports = MenuNavigationItem;
  }
});

// lib/parser/contents/classes/MenuServiceItem.js
var require_MenuServiceItem = __commonJS({
  "lib/parser/contents/classes/MenuServiceItem.js"(exports2, module2) {
    "use strict";
    var Button = require_Button();
    var MenuServiceItem = class extends Button {
      type = "MenuServiceItem";
      constructor(data) {
        super(data);
      }
    };
    module2.exports = MenuServiceItem;
  }
});

// lib/parser/contents/classes/MenuServiceItemDownload.js
var require_MenuServiceItemDownload = __commonJS({
  "lib/parser/contents/classes/MenuServiceItemDownload.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var MenuServiceItemDownload = class {
      type = "MenuServiceItemDownload";
      constructor(data) {
        this.has_separator = data.hasSeparator;
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint || data.serviceEndpoint);
      }
    };
    module2.exports = MenuServiceItemDownload;
  }
});

// lib/parser/contents/classes/MerchandiseItem.js
var require_MerchandiseItem = __commonJS({
  "lib/parser/contents/classes/MerchandiseItem.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var MerchandiseItem = class {
      type = "MerchandiseItem";
      constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.price = data.price;
        this.vendor_name = data.vendorName;
        this.button_text = data.buttonText;
        this.button_accessibility_text = data.buttonAccessibilityText;
        this.from_vendor_text = data.fromVendorText;
        this.additional_fees_text = data.additionalFeesText;
        this.region_format = data.regionFormat;
        this.endpoint = new NavigationEndpoint(data.buttonCommand);
      }
    };
    module2.exports = MerchandiseItem;
  }
});

// lib/parser/contents/classes/MerchandiseShelf.js
var require_MerchandiseShelf = __commonJS({
  "lib/parser/contents/classes/MerchandiseShelf.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var MerchandiseShelf = class {
      type = "MerchandiseShelf";
      constructor(data) {
        this.title = data.title;
        this.menu = Parser.parse(data.actionButton);
        this.items = Parser.parse(data.items);
      }
      get contents() {
        return this.items;
      }
    };
    module2.exports = MerchandiseShelf;
  }
});

// lib/parser/contents/classes/Message.js
var require_Message = __commonJS({
  "lib/parser/contents/classes/Message.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Message = class {
      type = "Message";
      constructor(data) {
        this.text = new Text(data.text).toString();
      }
    };
    module2.exports = Message;
  }
});

// lib/parser/contents/classes/MetadataRow.js
var require_MetadataRow = __commonJS({
  "lib/parser/contents/classes/MetadataRow.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var MetadataRow = class {
      type = "MetadataRow";
      constructor(data) {
        this.title = new Text(data.title);
        this.contents = data.contents.map((content) => new Text(content));
      }
    };
    module2.exports = MetadataRow;
  }
});

// lib/parser/contents/classes/MetadataRowContainer.js
var require_MetadataRowContainer = __commonJS({
  "lib/parser/contents/classes/MetadataRowContainer.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var MetadataRowContainer = class {
      type = "MetadataRowContainer";
      constructor(data) {
        this.rows = Parser.parse(data.rows);
        this.collapsed_item_count = data.collapsedItemCount;
      }
    };
    module2.exports = MetadataRowContainer;
  }
});

// lib/parser/contents/classes/MetadataRowHeader.js
var require_MetadataRowHeader = __commonJS({
  "lib/parser/contents/classes/MetadataRowHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var MetadataRowHeader = class {
      type = "MetadataRowHeader";
      constructor(data) {
        this.content = new Text(data.content);
        this.has_divider_line = data.hasDividerLine;
      }
    };
    module2.exports = MetadataRowHeader;
  }
});

// lib/parser/contents/classes/MicroformatData.js
var require_MicroformatData = __commonJS({
  "lib/parser/contents/classes/MicroformatData.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var MicroformatData = class {
      type = "MicroformatData";
      constructor(data) {
        this.url_canonical = data.urlCanonical;
        this.title = data.title;
        this.description = data.description;
        this.thumbnail = data.thumbnail && Thumbnail.fromResponse(data.thumbnail);
        this.site_name = data.siteName;
        this.app_name = data.appName;
        this.android_package = data.androidPackage;
        this.ios_app_store_id = data.iosAppStoreId;
        this.ios_app_arguments = data.iosAppArguments;
        this.og_type = data.ogType;
        this.url_applinks_web = data.urlApplinksWeb;
        this.url_applinks_ios = data.urlApplinksIos;
        this.url_applinks_android = data.urlApplinksAndroid;
        this.url_twitter_ios = data.urlTwitterIos;
        this.url_twitter_android = data.urlTwitterAndroid;
        this.twitter_card_type = data.twitterCardType;
        this.twitter_site_handle = data.twitterSiteHandle;
        this.schema_dot_org_type = data.schemaDotOrgType;
        this.noindex = data.noindex;
        this.is_unlisted = data.unlisted;
        this.is_family_safe = data.familySafe;
        this.tags = data.tags;
        this.available_countries = data.availableCountries;
      }
    };
    module2.exports = MicroformatData;
  }
});

// lib/parser/contents/classes/Mix.js
var require_Mix = __commonJS({
  "lib/parser/contents/classes/Mix.js"(exports2, module2) {
    "use strict";
    var Playlist2 = require_Playlist();
    var Mix = class extends Playlist2 {
      type = "Mix";
      constructor(data) {
        super(data);
      }
    };
    module2.exports = Mix;
  }
});

// lib/parser/contents/classes/Movie.js
var require_Movie = __commonJS({
  "lib/parser/contents/classes/Movie.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Author = require_Author();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Utils = require_Utils();
    var Text = require_Text();
    var Movie = class {
      type = "Movie";
      constructor(data) {
        const overlay_time_status = data.thumbnailOverlays.find((overlay) => overlay.thumbnailOverlayTimeStatusRenderer)?.thumbnailOverlayTimeStatusRenderer.text || "N/A";
        this.id = data.videoId;
        this.title = new Text(data.title);
        this.description_snippet = data.descriptionSnippet ? new Text(data.descriptionSnippet, "") : null;
        this.top_metadata_items = new Text(data.topMetadataItems);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.thumbnail_overlays = Parser.parse(data.thumbnailOverlays);
        this.author = new Author(data.longBylineText, data.ownerBadges, data.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer?.thumbnail);
        this.duration = {
          text: data.lengthText ? new Text(data.lengthText).text : new Text(overlay_time_status).text,
          seconds: Utils.timeToSeconds(data.lengthText ? new Text(data.lengthText).text : new Text(overlay_time_status).text)
        };
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.badges = Parser.parse(data.badges);
        this.use_vertical_poster = data.useVerticalPoster;
        this.show_action_menu = data.showActionMenu;
        this.menu = Parser.parse(data.menu);
      }
    };
    module2.exports = Movie;
  }
});

// lib/parser/contents/classes/MovingThumbnail.js
var require_MovingThumbnail = __commonJS({
  "lib/parser/contents/classes/MovingThumbnail.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var MovingThumbnail = class {
      type = "MovingThumbnail";
      constructor(data) {
        return data.movingThumbnailDetails?.thumbnails.map((thumbnail) => new Thumbnail(thumbnail)).sort((a, b) => b.width - a.width);
      }
    };
    module2.exports = MovingThumbnail;
  }
});

// lib/parser/contents/classes/MusicCarouselShelf.js
var require_MusicCarouselShelf = __commonJS({
  "lib/parser/contents/classes/MusicCarouselShelf.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var MusicCarouselShelf = class {
      type = "MusicCarouselShelf";
      constructor(data) {
        this.header = Parser.parse(data.header);
        this.contents = Parser.parse(data.contents);
        if (data.numItemsPerColumn) {
          this.num_items_per_column = data.numItemsPerColumn;
        }
      }
    };
    module2.exports = MusicCarouselShelf;
  }
});

// lib/parser/contents/classes/MusicCarouselShelfBasicHeader.js
var require_MusicCarouselShelfBasicHeader = __commonJS({
  "lib/parser/contents/classes/MusicCarouselShelfBasicHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var MusicCarouselShelfBasicHeader = class {
      type = "MusicCarouselShelfBasicHeader";
      constructor(data) {
        if (data.strapline) {
          this.strapline = new Text(data.strapline).toString();
        }
        this.title = new Text(data.title).toString();
        if (data.thumbnail) {
          this.thumbnail = Thumbnail.fromResponse(data.thumbnail.musicThumbnailRenderer.thumbnail);
        }
      }
    };
    module2.exports = MusicCarouselShelfBasicHeader;
  }
});

// lib/parser/contents/classes/MusicDescriptionShelf.js
var require_MusicDescriptionShelf = __commonJS({
  "lib/parser/contents/classes/MusicDescriptionShelf.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var MusicDescriptionShelf = class {
      type = "MusicDescriptionShelf";
      constructor(data) {
        this.description = new Text(data.description);
        if (this.max_collapsed_lines) {
          this.max_collapsed_lines = data.maxCollapsedLines;
        }
        if (this.max_expanded_lines) {
          this.max_expanded_lines = data.maxExpandedLines;
        }
        this.footer = new Text(data.footer);
      }
    };
    module2.exports = MusicDescriptionShelf;
  }
});

// lib/parser/contents/classes/MusicDetailHeader.js
var require_MusicDetailHeader = __commonJS({
  "lib/parser/contents/classes/MusicDetailHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var Parser = require_contents();
    var MusicDetailHeader = class {
      type = "MusicDetailHeader";
      constructor(data) {
        this.title = new Text(data.title);
        this.description = new Text(data.description);
        this.subtitle = new Text(data.subtitle);
        this.second_subtitle = new Text(data.secondSubtitle);
        this.year = this.subtitle.runs.find((run) => /^[12][0-9]{3}$/.test(run.text)).text;
        this.song_count = this.second_subtitle.runs[0].text;
        this.total_duration = this.second_subtitle.runs[2].text;
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail.croppedSquareThumbnailRenderer.thumbnail);
        this.badges = Parser.parse(data.subtitleBadges);
        const author = this.subtitle.runs.find((run) => run.endpoint.browse?.id.startsWith("UC"));
        if (author) {
          this.author = {
            name: author.text,
            channel_id: author.endpoint.browse.id,
            endpoint: author.endpoint
          };
        }
        this.menu = Parser.parse(data.menu);
      }
    };
    module2.exports = MusicDetailHeader;
  }
});

// lib/parser/contents/classes/MusicHeader.js
var require_MusicHeader = __commonJS({
  "lib/parser/contents/classes/MusicHeader.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var MusicHeader = class {
      type = "MusicHeader";
      constructor(data) {
        this.header = Parser.parse(data.header);
      }
    };
    module2.exports = MusicHeader;
  }
});

// lib/parser/contents/classes/MusicImmersiveHeader.js
var require_MusicImmersiveHeader = __commonJS({
  "lib/parser/contents/classes/MusicImmersiveHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Parser = require_contents();
    var MusicImmersiveHeader = class {
      type = "MusicImmersiveHeader";
      constructor(data) {
        this.title = new Text(data.title);
        this.description = new Text(data.description);
        this.thumbnails = Parser.parse(data.thumbnail);
      }
    };
    module2.exports = MusicImmersiveHeader;
  }
});

// lib/parser/contents/classes/MusicInlineBadge.js
var require_MusicInlineBadge = __commonJS({
  "lib/parser/contents/classes/MusicInlineBadge.js"(exports2, module2) {
    "use strict";
    var MusicInlineBadge = class {
      type = "MusicInlineBadge";
      constructor(data) {
        this.icon_type = data.icon.iconType;
        this.label = data.accessibilityData.accessibilityData.label;
      }
    };
    module2.exports = MusicInlineBadge;
  }
});

// lib/parser/contents/classes/MusicItemThumbnailOverlay.js
var require_MusicItemThumbnailOverlay = __commonJS({
  "lib/parser/contents/classes/MusicItemThumbnailOverlay.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var MusicItemThumbnailOverlay = class {
      type = "MusicItemThumbnailOverlay";
      constructor(data) {
        this.content = Parser.parse(data.content);
        this.content_position = data.contentPosition;
        this.display_style = data.displayStyle;
      }
    };
    module2.exports = MusicItemThumbnailOverlay;
  }
});

// lib/parser/contents/classes/MusicNavigationButton.js
var require_MusicNavigationButton = __commonJS({
  "lib/parser/contents/classes/MusicNavigationButton.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var MusicNavigationButton = class {
      type = "MusicNavigationButton";
      constructor(data) {
        this.button_text = new Text(data.buttonText).toString();
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
      }
    };
    module2.exports = MusicNavigationButton;
  }
});

// lib/parser/contents/classes/MusicPlayButton.js
var require_MusicPlayButton = __commonJS({
  "lib/parser/contents/classes/MusicPlayButton.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var MusicPlayButton = class {
      type = "MusicPlayButton";
      constructor(data) {
        this.endpoint = new NavigationEndpoint(data.playNavigationEndpoint);
        this.play_icon_type = data.playIcon.iconType;
        this.pause_icon_type = data.pauseIcon.iconType;
        if (data.accessibilityPlayData) {
          this.play_label = data.accessibilityPlayData.accessibilityData.label;
        }
        if (data.accessibilityPlayData) {
          this.pause_label = data.accessibilityPauseData?.accessibilityData.label;
        }
        this.icon_color = data.iconColor;
      }
    };
    module2.exports = MusicPlayButton;
  }
});

// lib/parser/contents/classes/MusicPlaylistShelf.js
var require_MusicPlaylistShelf = __commonJS({
  "lib/parser/contents/classes/MusicPlaylistShelf.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var MusicPlaylistShelf = class {
      type = "MusicPlaylistShelf";
      #continuations;
      constructor(data) {
        this.playlist_id = data.playlistId;
        this.contents = Parser.parse(data.contents);
        this.collapsed_item_count = data.collapsedItemCount;
        this.#continuations = data.continuations;
      }
      get continuation() {
        return this.#continuations?.[0]?.nextContinuationData;
      }
    };
    module2.exports = MusicPlaylistShelf;
  }
});

// lib/parser/contents/classes/MusicQueue.js
var require_MusicQueue = __commonJS({
  "lib/parser/contents/classes/MusicQueue.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var MusicQueue = class {
      type = "MusicQueue";
      constructor(data) {
        this.content = Parser.parse(data.content);
      }
    };
    module2.exports = MusicQueue;
  }
});

// lib/parser/contents/classes/MusicResponsiveListItem.js
var require_MusicResponsiveListItem = __commonJS({
  "lib/parser/contents/classes/MusicResponsiveListItem.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Utils = require_Utils();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var MusicResponsiveListItem = class {
      #flex_columns;
      #fixed_columns;
      #playlist_item_data;
      constructor(data) {
        this.type = null;
        this.#flex_columns = Parser.parse(data.flexColumns);
        this.#fixed_columns = Parser.parse(data.fixedColumns);
        this.#playlist_item_data = {
          video_id: data?.playlistItemData?.videoId || null,
          playlist_set_video_id: data?.playlistItemData?.playlistSetVideoId || null
        };
        this.endpoint = data.navigationEndpoint && new NavigationEndpoint(data.navigationEndpoint) || null;
        switch (this.endpoint?.browse?.page_type) {
          case "MUSIC_PAGE_TYPE_ALBUM":
            this.type = "album";
            this.#parseAlbum();
            break;
          case "MUSIC_PAGE_TYPE_PLAYLIST":
            this.type = "playlist";
            this.#parsePlaylist();
            break;
          case "MUSIC_PAGE_TYPE_ARTIST":
          case "MUSIC_PAGE_TYPE_USER_CHANNEL":
            this.type = "artist";
            this.#parseArtist();
            break;
          default:
            this.#parseVideoOrSong();
            break;
        }
        if (data.index) {
          this.index = new Text(data.index);
        }
        this.thumbnails = data.thumbnail ? Thumbnail.fromResponse(data.thumbnail.musicThumbnailRenderer.thumbnail) : [];
        this.badges = Parser.parse(data.badges) || [];
        this.menu = Parser.parse(data.menu);
        this.overlay = Parser.parse(data.overlay);
      }
      #parseVideoOrSong() {
        const is_video = this.#flex_columns[1].title.runs?.some((run) => run.text.match(/(.*?) views/));
        if (is_video) {
          this.type = "video";
          this.#parseVideo();
        } else {
          this.type = "song";
          this.#parseSong();
        }
      }
      #parseSong() {
        this.id = this.#playlist_item_data.video_id || this.endpoint.watch.video_id;
        this.title = this.#flex_columns[0].title.toString();
        const duration_text = this.#flex_columns[1].title.runs?.find((run) => /^\d+$/.test(run.text.replace(/:/g, "")))?.text || this.#fixed_columns?.[0]?.title?.text;
        duration_text && (this.duration = {
          text: duration_text,
          seconds: Utils.timeToSeconds(duration_text)
        });
        const album = this.#flex_columns[1].title.runs?.find((run) => run.endpoint.browse?.id.startsWith("MPR"));
        if (album) {
          this.album = {
            id: album.endpoint.browse.id,
            name: album.text,
            endpoint: album.endpoint
          };
        }
        const artists = this.#flex_columns[1].title.runs?.filter((run) => run.endpoint.browse?.id.startsWith("UC"));
        if (artists) {
          this.artists = artists.map((artist) => ({
            name: artist.text,
            channel_id: artist.endpoint.browse.id,
            endpoint: artist.endpoint
          }));
        }
      }
      #parseVideo() {
        this.id = this.#playlist_item_data.video_id;
        this.title = this.#flex_columns[0].title.toString();
        this.views = this.#flex_columns[1].title.runs.find((run) => run.text.match(/(.*?) views/)).text;
        const authors = this.#flex_columns[1].title.runs?.filter((run) => run.endpoint.browse?.id.startsWith("UC"));
        if (authors) {
          this.authors = authors.map((author) => ({
            name: author.text,
            channel_id: author.endpoint.browse.id,
            endpoint: author.endpoint
          }));
        }
        const duration_text = this.#flex_columns[1].title.runs.find((run) => /^\d+$/.test(run.text.replace(/:/g, "")))?.text;
        duration_text && (this.duration = {
          text: duration_text,
          seconds: Utils.timeToSeconds(duration_text)
        });
      }
      #parseArtist() {
        this.id = this.endpoint.browse.id;
        this.name = this.#flex_columns[0].title.toString();
        this.subscribers = this.#flex_columns[1].title.runs[2]?.text || "";
      }
      #parseAlbum() {
        this.id = this.endpoint.browse.id;
        this.title = this.#flex_columns[0].title.toString();
        const author = this.#flex_columns[1].title.runs.find((run) => run.endpoint.browse?.id.startsWith("UC"));
        author && (this.author = {
          name: author.text,
          channel_id: author.endpoint.browse.id,
          endpoint: author.endpoint
        });
        this.year = this.#flex_columns[1].title.runs.find((run) => /^[12][0-9]{3}$/.test(run.text)).text;
      }
      #parsePlaylist() {
        this.id = this.endpoint.browse.id;
        this.title = this.#flex_columns[0].title.toString();
        this.item_count = parseInt(this.#flex_columns[1].title.runs.find((run) => run.text.match(/\d+ (song|songs)/)).text.match(/\d+/g));
        const author = this.#flex_columns[1].title.runs.find((run) => run.endpoint.browse?.id.startsWith("UC"));
        author && (this.author = {
          name: author.text,
          channel_id: author.endpoint.browse.id,
          endpoint: author.endpoint
        });
      }
    };
    module2.exports = MusicResponsiveListItem;
  }
});

// lib/parser/contents/classes/MusicResponsiveListItemFixedColumn.js
var require_MusicResponsiveListItemFixedColumn = __commonJS({
  "lib/parser/contents/classes/MusicResponsiveListItemFixedColumn.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var MusicResponsiveListItemFixedColumn = class {
      type = "musicResponsiveListItemFlexColumnRenderer";
      constructor(data) {
        this.title = new Text(data.text);
        this.display_priority = data.displayPriority;
      }
    };
    module2.exports = MusicResponsiveListItemFixedColumn;
  }
});

// lib/parser/contents/classes/MusicResponsiveListItemFlexColumn.js
var require_MusicResponsiveListItemFlexColumn = __commonJS({
  "lib/parser/contents/classes/MusicResponsiveListItemFlexColumn.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var MusicResponsiveListItemFlexColumn = class {
      type = "musicResponsiveListItemFlexColumnRenderer";
      constructor(data) {
        this.title = new Text(data.text);
        this.display_priority = data.displayPriority;
      }
    };
    module2.exports = MusicResponsiveListItemFlexColumn;
  }
});

// lib/parser/contents/classes/MusicShelf.js
var require_MusicShelf = __commonJS({
  "lib/parser/contents/classes/MusicShelf.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var MusicShelf = class {
      type = "MusicShelf";
      constructor(data) {
        this.title = new Text(data.title).toString();
        this.contents = Parser.parse(data.contents);
        if (data.bottomEndpoint) {
          this.endpoint = new NavigationEndpoint(data.bottomEndpoint);
        }
        if (this.continuation) {
          this.continuation = data.continuations?.[0].nextContinuationData.continuation;
        }
        if (data.bottomText) {
          this.bottom_text = new Text(data.bottomText);
        }
      }
    };
    module2.exports = MusicShelf;
  }
});

// lib/parser/contents/classes/MusicThumbnail.js
var require_MusicThumbnail = __commonJS({
  "lib/parser/contents/classes/MusicThumbnail.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var MusicThumbnail = class {
      type = "MusicThumbnail";
      constructor(data) {
        return Thumbnail.fromResponse(data.thumbnail);
      }
    };
    module2.exports = MusicThumbnail;
  }
});

// lib/parser/contents/classes/MusicTwoRowItem.js
var require_MusicTwoRowItem = __commonJS({
  "lib/parser/contents/classes/MusicTwoRowItem.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var MusicTwoRowItem = class {
      type = "MusicTwoRowItem";
      constructor(data) {
        this.title = new Text(data.title);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.id = this.endpoint.browse?.id || this.endpoint.watch.video_id;
        this.subtitle = new Text(data.subtitle);
        this.badges = Parser.parse(data.subtitleBadges);
        switch (this.endpoint.browse?.page_type) {
          case "MUSIC_PAGE_TYPE_ARTIST":
            this.type = "artist";
            this.subscribers = this.subtitle.toString();
            break;
          case "MUSIC_PAGE_TYPE_PLAYLIST":
            this.type = "playlist";
            this.item_count = parseInt(this.subtitle.runs.find((run) => run.text.match(/\d+ (songs|song)/))?.text.match(/\d+/g)) || null;
            break;
          case "MUSIC_PAGE_TYPE_ALBUM":
            this.type = "album";
            const artists = this.subtitle.runs.filter((run) => run.endpoint.browse?.id.startsWith("UC"));
            if (artists) {
              this.artists = artists.map((artist) => ({
                name: artist.text,
                channel_id: artist.endpoint.browse.id,
                endpoint: artist.endpoint
              }));
            }
            this.year = this.subtitle.runs.slice(-1)[0].text;
            if (isNaN(this.year))
              delete this.year;
            break;
          default:
            if (this.subtitle.runs[0].text !== "Song") {
              this.type = "video";
            } else {
              this.type = "song";
            }
            if (this.type == "video") {
              this.views = this.subtitle.runs.find((run) => run.text.match(/(.*?) views/)).text;
              const author = this.subtitle.runs.find((run) => run.endpoint.browse?.id.startsWith("UC"));
              if (author) {
                this.author = {
                  name: author.text,
                  channel_id: author.endpoint.browse.id,
                  endpoint: author.endpoint
                };
              }
            } else {
              const artists2 = this.subtitle.runs.filter((run) => run.endpoint.browse?.id.startsWith("UC"));
              if (artists2) {
                this.artists = artists2.map((artist) => ({
                  name: artist.text,
                  channel_id: artist.endpoint.browse.id,
                  endpoint: artist.endpoint
                }));
              }
            }
            break;
        }
        this.thumbnail = Thumbnail.fromResponse(data.thumbnailRenderer.musicThumbnailRenderer.thumbnail);
        this.thumbnail_overlay = Parser.parse(data.thumbnailOverlay);
        this.menu = Parser.parse(data.menu);
      }
    };
    module2.exports = MusicTwoRowItem;
  }
});

// lib/parser/contents/classes/PlayerAnnotationsExpanded.js
var require_PlayerAnnotationsExpanded = __commonJS({
  "lib/parser/contents/classes/PlayerAnnotationsExpanded.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var PlayerAnnotationsExpanded = class {
      type = "PlayerAnnotationsExpanded";
      constructor(data) {
        this.featured_channel = {
          start_time_ms: data.featuredChannel.startTimeMs,
          end_time_ms: data.featuredChannel.endTimeMs,
          watermark: Thumbnail.fromResponse(data.featuredChannel.watermark),
          channel_name: data.featuredChannel.channelName,
          endpoint: new NavigationEndpoint(data.featuredChannel.navigationEndpoint),
          subscribe_button: Parser.parse(data.featuredChannel.subscribeButton)
        };
        this.allow_swipe_dismiss = data.allowSwipeDismiss;
        this.annotation_id = data.annotationId;
      }
    };
    module2.exports = PlayerAnnotationsExpanded;
  }
});

// lib/parser/contents/classes/PlayerCaptionsTracklist.js
var require_PlayerCaptionsTracklist = __commonJS({
  "lib/parser/contents/classes/PlayerCaptionsTracklist.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var PlayerCaptionsTracklist = class {
      type = "PlayerCaptionsTracklist";
      constructor(data) {
        this.caption_tracks = data.captionTracks.map((ct) => ({
          base_url: ct.baseUrl,
          name: new Text(ct.name),
          vss_id: ct.vssId,
          language_code: ct.languageCode,
          kind: ct.kind,
          is_translatable: ct.isTranslatable
        }));
        this.audio_tracks = data.audioTracks.map((at) => ({
          caption_track_indices: at.captionTrackIndices
        }));
        this.translation_languages = data.translationLanguages.map((tl) => ({
          language_code: tl.languageCode,
          language_name: new Text(tl.languageName)
        }));
      }
    };
    module2.exports = PlayerCaptionsTracklist;
  }
});

// lib/parser/contents/classes/PlayerErrorMessage.js
var require_PlayerErrorMessage = __commonJS({
  "lib/parser/contents/classes/PlayerErrorMessage.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var PlayerErrorMessage = class {
      type = "PlayerErrorMessage";
      constructor(data) {
        this.subreason = new Text(data.subreason);
        this.reason = new Text(data.reason);
        this.proceed_button = Parser.parse(data.proceedButton);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.icon_type = data.icon.iconType;
      }
    };
    module2.exports = PlayerErrorMessage;
  }
});

// lib/parser/contents/classes/PlayerLiveStoryboardSpec.js
var require_PlayerLiveStoryboardSpec = __commonJS({
  "lib/parser/contents/classes/PlayerLiveStoryboardSpec.js"(exports2, module2) {
    "use strict";
    var PlayerLiveStoryboardSpec = class {
      type = "PlayerLiveStoryboardSpec";
      constructor() {
      }
    };
    module2.exports = PlayerLiveStoryboardSpec;
  }
});

// lib/parser/contents/classes/PlayerMicroformat.js
var require_PlayerMicroformat = __commonJS({
  "lib/parser/contents/classes/PlayerMicroformat.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var PlayerMicroformat = class {
      type = "PlayerMicroformat";
      constructor(data) {
        this.title = new Text(data.title);
        this.description = new Text(data.description);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.embed = {
          iframe_url: data.embed.iframeUrl,
          flash_url: data.embed.flashUrl,
          flash_secure_url: data.embed.flashSecureUrl,
          width: data.embed.width,
          height: data.embed.height
        };
        this.length_seconds = parseInt(data.lengthSeconds);
        this.channel = {
          id: data.externalChannelId,
          name: data.ownerChannelName,
          url: data.ownerProfileUrl
        };
        this.is_family_safe = data.isFamilySafe;
        this.is_unlisted = data.isUnlisted;
        this.has_ypc_metadata = data.hasYpcMetadata;
        this.view_count = parseInt(data.viewCount);
        this.category = data.category;
        this.publish_date = data.publishDate;
        this.upload_date = data.uploadDate;
        this.available_countries = data.availableCountries;
      }
    };
    module2.exports = PlayerMicroformat;
  }
});

// lib/parser/contents/classes/PlayerOverlay.js
var require_PlayerOverlay = __commonJS({
  "lib/parser/contents/classes/PlayerOverlay.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var PlayerOverlay = class {
      type = "PlayerOverlay";
      constructor(data) {
        this.end_screen = Parser.parse(data.endScreen);
        this.autoplay = Parser.parse(data.autoplay);
        this.share_button = Parser.parse(data.shareButton);
        this.add_to_menu = Parser.parse(data.addToMenu);
        this.fullscreen_engagement = Parser.parse(data.fullscreenEngagement);
      }
    };
    module2.exports = PlayerOverlay;
  }
});

// lib/parser/contents/classes/PlayerOverlayAutoplay.js
var require_PlayerOverlayAutoplay = __commonJS({
  "lib/parser/contents/classes/PlayerOverlayAutoplay.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Author = require_Author();
    var Thumbnail = require_Thumbnail();
    var PlayerOverlayAutoplay = class {
      type = "PlayerOverlayAutoplay";
      constructor(data) {
        this.title = new Text(data.title);
        this.video_id = data.videoId;
        this.video_title = new Text(data.videoTitle);
        this.short_view_count = new Text(data.shortViewCountText);
        this.prefer_immediate_redirect = data.preferImmediateRedirect;
        this.count_down_secs_for_fullscreen = data.countDownSecsForFullscreen;
        this.published = new Text(data.publishedTimeText);
        this.background = Thumbnail.fromResponse(data.background);
        this.thumbnail_overlays = Parser.parse(data.thumbnailOverlays);
        this.author = new Author(data.byline);
        this.cancel_button = Parser.parse(data.cancelButton);
        this.next_button = Parser.parse(data.nextButton);
        this.close_button = Parser.parse(data.closeButton);
      }
    };
    module2.exports = PlayerOverlayAutoplay;
  }
});

// lib/parser/contents/classes/PlayerStoryboardSpec.js
var require_PlayerStoryboardSpec = __commonJS({
  "lib/parser/contents/classes/PlayerStoryboardSpec.js"(exports2, module2) {
    "use strict";
    var PlayerStoryboardSpec = class {
      type = "PlayerStoryboardSpec";
      constructor(data) {
        const parts = data.spec.split("|");
        const url = new URL(parts.shift());
        this.boards = parts.map((part, i) => {
          let [
            thumbnail_width,
            thumbnail_height,
            thumbnail_count,
            columns,
            rows,
            interval,
            name,
            sigh
          ] = part.split("#");
          url.searchParams.set("sigh", sigh);
          thumbnail_count = parseInt(thumbnail_count, 10);
          columns = parseInt(columns, 10);
          rows = parseInt(rows, 10);
          const storyboard_count = Math.ceil(thumbnail_count / (columns * rows));
          return {
            template_url: url.toString().replace("$L", i).replace("$N", name),
            thumbnail_width: parseInt(thumbnail_width, 10),
            thumbnail_height: parseInt(thumbnail_height, 10),
            thumbnail_count,
            interval: parseInt(interval, 10),
            columns,
            rows,
            storyboard_count
          };
        });
      }
    };
    module2.exports = PlayerStoryboardSpec;
  }
});

// lib/parser/contents/classes/PlaylistHeader.js
var require_PlaylistHeader = __commonJS({
  "lib/parser/contents/classes/PlaylistHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var PlaylistAuthor = require_PlaylistAuthor();
    var Parser = require_contents();
    var PlaylistHeader = class {
      type = "PlaylistHeader";
      constructor(data) {
        this.id = data.playlistId;
        this.title = new Text(data.title);
        this.stats = data.stats.map((stat) => new Text(stat));
        this.brief_stats = data.briefStats.map((stat) => new Text(stat));
        this.author = new PlaylistAuthor({ ...data.ownerText, navigationEndpoint: data.ownerEndpoint }, data.ownerBadges, null);
        this.description = new Text(data.descriptionText);
        this.num_videos = new Text(data.numVideosText);
        this.view_count = new Text(data.viewCountText);
        this.can_share = data.shareData.canShare;
        this.can_delete = data.editableDetails.canDelete;
        this.is_editable = data.isEditable;
        this.privacy = data.privacy;
        this.save_button = Parser.parse(data.saveButton);
        this.shuffle_play_button = Parser.parse(data.shufflePlayButton);
        this.menu = Parser.parse(data.moreActionsMenu);
      }
    };
    module2.exports = PlaylistHeader;
  }
});

// lib/parser/contents/classes/PlaylistMetadata.js
var require_PlaylistMetadata = __commonJS({
  "lib/parser/contents/classes/PlaylistMetadata.js"(exports2, module2) {
    "use strict";
    var PlaylistMetadata = class {
      type = "PlaylistMetadata";
      constructor(data) {
        this.title = data.title;
        this.description = data.description || null;
      }
    };
    module2.exports = PlaylistMetadata;
  }
});

// lib/parser/contents/classes/PlaylistPanel.js
var require_PlaylistPanel = __commonJS({
  "lib/parser/contents/classes/PlaylistPanel.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var PlaylistPanel = class {
      type = "PlaylistPanel";
      constructor(data) {
        this.title = data.title;
        this.title_text = new Text(data.titleText);
        this.contents = Parser.parse(data.contents);
        this.playlist_id = data.playlistId;
        this.is_infinite = data.isInfinite;
        this.continuation = data.continuations[0]?.nextRadioContinuationData?.continuation;
        this.is_editable = data.isEditable;
        this.preview_description = data.previewDescription;
        this.num_items_to_show = data.numItemsToShow;
      }
    };
    module2.exports = PlaylistPanel;
  }
});

// lib/parser/contents/classes/PlaylistPanelVideo.js
var require_PlaylistPanelVideo = __commonJS({
  "lib/parser/contents/classes/PlaylistPanelVideo.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Utils = require_Utils();
    var PlaylistPanelVideo = class {
      type = "PlaylistPanelVideo";
      constructor(data) {
        this.title = new Text(data.title);
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.selected = data.selected;
        this.video_id = data.videoId;
        this.duration = {
          text: new Text(data.lengthText).toString(),
          seconds: Utils.timeToSeconds(new Text(data.lengthText).toString())
        };
        const album = new Text(data.longBylineText).runs.find((run) => run.endpoint.browse?.id.startsWith("MPR"));
        const artists = new Text(data.longBylineText).runs.filter((run) => run.endpoint.browse?.id.startsWith("UC"));
        this.author = new Text(data.shortBylineText).toString();
        album && (this.album = {
          id: album.endpoint.browse.id,
          name: album.text,
          year: new Text(data.longBylineText).runs.slice(-1)[0].text,
          endpoint: album.endpoint
        });
        this.artists = artists.map((artist) => ({
          name: artist.text,
          channel_id: artist.endpoint.browse.id,
          endpoint: artist.endpoint
        }));
        this.badges = Parser.parse(data.badges);
        this.menu = Parser.parse(data.menu);
        this.set_video_id = data.playlistSetVideoId;
      }
    };
    module2.exports = PlaylistPanelVideo;
  }
});

// lib/parser/contents/classes/PlaylistSidebar.js
var require_PlaylistSidebar = __commonJS({
  "lib/parser/contents/classes/PlaylistSidebar.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var PlaylistSidebar = class {
      type = "PlaylistSidebar";
      constructor(data) {
        this.items = Parser.parse(data.items);
      }
      get contents() {
        return this.items;
      }
    };
    module2.exports = PlaylistSidebar;
  }
});

// lib/parser/contents/classes/PlaylistSidebarPrimaryInfo.js
var require_PlaylistSidebarPrimaryInfo = __commonJS({
  "lib/parser/contents/classes/PlaylistSidebarPrimaryInfo.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Text = require_Text();
    var PlaylistSidebarPrimaryInfo = class {
      type = "PlaylistSidebarPrimaryInfo";
      constructor(data) {
        this.stats = data.stats.map((stat) => new Text(stat));
        this.thumbnail_renderer = Parser.parse(data.thumbnailRenderer);
        this.title = new Text(data.title);
        this.menu = data.menu && Parser.parse(data.menu);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.description = new Text(data.description);
      }
    };
    module2.exports = PlaylistSidebarPrimaryInfo;
  }
});

// lib/parser/contents/classes/PlaylistSidebarSecondaryInfo.js
var require_PlaylistSidebarSecondaryInfo = __commonJS({
  "lib/parser/contents/classes/PlaylistSidebarSecondaryInfo.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var PlaylistSidebarSecondaryInfo = class {
      type = "PlaylistSidebarSecondaryInfo";
      constructor(data) {
        this.owner = Parser.parse(data.videoOwner) || null;
        this.button = Parser.parse(data.button) || null;
      }
    };
    module2.exports = PlaylistSidebarSecondaryInfo;
  }
});

// lib/parser/contents/classes/PlaylistVideo.js
var require_PlaylistVideo = __commonJS({
  "lib/parser/contents/classes/PlaylistVideo.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Parser = require_contents();
    var Thumbnail = require_Thumbnail();
    var PlaylistAuthor = require_PlaylistAuthor();
    var NavigationEndpoint = require_NavigationEndpoint();
    var PlaylistVideo = class {
      type = "PlaylistVideo";
      constructor(data) {
        this.id = data.videoId;
        this.index = new Text(data.index);
        this.title = new Text(data.title);
        this.author = new PlaylistAuthor(data.shortBylineText);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.thumbnail_overlays = Parser.parse(data.thumbnailOverlays);
        this.set_video_id = data?.setVideoId;
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.is_playable = data.isPlayable;
        this.menu = Parser.parse(data.menu);
        this.duration = {
          text: new Text(data.lengthText).text,
          seconds: parseInt(data.lengthSeconds)
        };
      }
    };
    module2.exports = PlaylistVideo;
  }
});

// lib/parser/contents/classes/PlaylistVideoList.js
var require_PlaylistVideoList = __commonJS({
  "lib/parser/contents/classes/PlaylistVideoList.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var PlaylistVideoList = class {
      type = "PlaylistVideoList";
      constructor(data) {
        this.id = data.playlistId;
        this.is_editable = data.isEditable;
        this.can_reorder = data.canReorder;
        this.videos = Parser.parse(data.contents);
      }
    };
    module2.exports = PlaylistVideoList;
  }
});

// lib/parser/contents/classes/PlaylistVideoThumbnail.js
var require_PlaylistVideoThumbnail = __commonJS({
  "lib/parser/contents/classes/PlaylistVideoThumbnail.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var PlaylistVideoThumbnail = class {
      type = "PlaylistVideoThumbnail";
      constructor(data) {
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
      }
    };
    module2.exports = PlaylistVideoThumbnail;
  }
});

// lib/parser/contents/classes/Poll.js
var require_Poll2 = __commonJS({
  "lib/parser/contents/classes/Poll.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Poll = class {
      type = "Poll";
      constructor(data) {
        this.choices = data.choices.map((choice) => ({
          text: new Text(choice.text).toString(),
          select_endpoint: new NavigationEndpoint(choice.selectServiceEndpoint),
          deselect_endpoint: new NavigationEndpoint(choice.deselectServiceEndpoint),
          vote_ratio_if_selected: choice.voteRatioIfSelected,
          vote_percentage_if_selected: new Text(choice.votePercentageIfSelected),
          vote_ratio_if_not_selected: choice.voteRatioIfSelected,
          vote_percentage_if_not_selected: new Text(choice.votePercentageIfSelected),
          image: Thumbnail.fromResponse(choice.image)
        }));
        this.total_votes = new Text(data.totalVotes);
        this.poll_type = data.type;
      }
    };
    module2.exports = Poll;
  }
});

// lib/parser/contents/classes/Post.js
var require_Post = __commonJS({
  "lib/parser/contents/classes/Post.js"(exports2, module2) {
    "use strict";
    var BackstagePost = require_BackstagePost();
    var Post = class extends BackstagePost {
      type = "Post";
      constructor(data) {
        super(data);
      }
    };
    module2.exports = Post;
  }
});

// lib/parser/contents/classes/ProfileColumn.js
var require_ProfileColumn = __commonJS({
  "lib/parser/contents/classes/ProfileColumn.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var ProfileColumn = class {
      type = "ProfileColumn";
      constructor(data) {
        this.items = Parser.parse(data.items);
      }
      get contents() {
        return this.items;
      }
    };
    module2.exports = ProfileColumn;
  }
});

// lib/parser/contents/classes/ProfileColumnStats.js
var require_ProfileColumnStats = __commonJS({
  "lib/parser/contents/classes/ProfileColumnStats.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var ProfileColumnStats = class {
      type = "ProfileColumnStats";
      constructor(data) {
        this.items = Parser.parse(data.items);
      }
      get contents() {
        return this.items;
      }
    };
    module2.exports = ProfileColumnStats;
  }
});

// lib/parser/contents/classes/ProfileColumnStatsEntry.js
var require_ProfileColumnStatsEntry = __commonJS({
  "lib/parser/contents/classes/ProfileColumnStatsEntry.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ProfileColumnStatsEntry = class {
      type = "ProfileColumnStatsEntry";
      constructor(data) {
        this.label = new Text(data.label);
        this.value = new Text(data.value);
      }
    };
    module2.exports = ProfileColumnStatsEntry;
  }
});

// lib/parser/contents/classes/ProfileColumnUserInfo.js
var require_ProfileColumnUserInfo = __commonJS({
  "lib/parser/contents/classes/ProfileColumnUserInfo.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var ProfileColumnUserInfo = class {
      type = "ProfileColumnUserInfo";
      constructor(data) {
        this.title = new Text(data.title);
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
      }
    };
    module2.exports = ProfileColumnUserInfo;
  }
});

// lib/parser/contents/classes/ReelItem.js
var require_ReelItem = __commonJS({
  "lib/parser/contents/classes/ReelItem.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var ReelItem = class {
      type = "ReelItem";
      constructor(data) {
        this.id = data.videoId;
        this.title = new Text(data.headline, "");
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.views = new Text(data.viewCountText, "");
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
      }
    };
    module2.exports = ReelItem;
  }
});

// lib/parser/contents/classes/ReelShelf.js
var require_ReelShelf = __commonJS({
  "lib/parser/contents/classes/ReelShelf.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Text = require_Text();
    var ReelShelf = class {
      type = "ReelShelf";
      constructor(data) {
        this.title = new Text(data.title);
        this.items = Parser.parse(data.items);
        this.endpoint = data.endpoint ? new NavigationEndpoint(data.endpoint) : null;
      }
      get contents() {
        return this.items;
      }
    };
    module2.exports = ReelShelf;
  }
});

// lib/parser/contents/classes/RelatedChipCloud.js
var require_RelatedChipCloud = __commonJS({
  "lib/parser/contents/classes/RelatedChipCloud.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var RelatedChipCloud = class {
      type = "RelatedChipCloud";
      constructor(data) {
        this.content = Parser.parse(data.content);
      }
    };
    module2.exports = RelatedChipCloud;
  }
});

// lib/parser/contents/classes/RichGrid.js
var require_RichGrid = __commonJS({
  "lib/parser/contents/classes/RichGrid.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var RichGrid = class {
      type = "RichGrid";
      constructor(data) {
        this.header = Parser.parse(data.header);
        this.contents = Parser.parse(data.contents);
      }
    };
    module2.exports = RichGrid;
  }
});

// lib/parser/contents/classes/RichItem.js
var require_RichItem = __commonJS({
  "lib/parser/contents/classes/RichItem.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var RichItem = class {
      type = "RichItem";
      constructor(data) {
        return Parser.parse(data.content);
      }
    };
    module2.exports = RichItem;
  }
});

// lib/parser/contents/classes/RichListHeader.js
var require_RichListHeader = __commonJS({
  "lib/parser/contents/classes/RichListHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var RichListHeader = class {
      constructor(data) {
        this.title = new Text(data.title);
        this.icon_type = data.icon.iconType;
      }
    };
    module2.exports = RichListHeader;
  }
});

// lib/parser/contents/classes/RichSection.js
var require_RichSection = __commonJS({
  "lib/parser/contents/classes/RichSection.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var RichSection = class {
      type = "RichSection";
      constructor(data) {
        this.contents = Parser.parse(data.content);
      }
    };
    module2.exports = RichSection;
  }
});

// lib/parser/contents/classes/RichShelf.js
var require_RichShelf = __commonJS({
  "lib/parser/contents/classes/RichShelf.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Text = require_Text();
    var RichShelf = class {
      type = "RichShelf";
      constructor(data) {
        this.title = new Text(data.title);
        this.contents = Parser.parse(data.contents);
        this.endpoint = data.endpoint ? new NavigationEndpoint(data.endpoint) : null;
      }
    };
    module2.exports = RichShelf;
  }
});

// lib/parser/contents/classes/SearchBox.js
var require_SearchBox = __commonJS({
  "lib/parser/contents/classes/SearchBox.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var SearchBox = class {
      type = "SearchBox";
      constructor(data) {
        this.endpoint = new NavigationEndpoint(data.endpoint);
        this.search_button = Parser.parse(data.searchButton);
        this.clear_button = Parser.parse(data.clearButton);
        this.placeholder_text = new Text(data.placeholderText);
      }
    };
    module2.exports = SearchBox;
  }
});

// lib/parser/contents/classes/SearchRefinementCard.js
var require_SearchRefinementCard = __commonJS({
  "lib/parser/contents/classes/SearchRefinementCard.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var Thumbnail = require_Thumbnail();
    var Text = require_Text();
    var SearchRefinementCard = class {
      type = "SearchRefinementCard";
      constructor(data) {
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.endpoint = new NavigationEndpoint(data.searchEndpoint);
        this.query = new Text(data.query).toString();
      }
    };
    module2.exports = SearchRefinementCard;
  }
});

// lib/parser/contents/classes/SecondarySearchContainer.js
var require_SecondarySearchContainer = __commonJS({
  "lib/parser/contents/classes/SecondarySearchContainer.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var SecondarySearchContainer = class {
      type = "SecondarySearchContainer";
      constructor(data) {
        this.contents = Parser.parse(data.contents);
      }
    };
    module2.exports = SecondarySearchContainer;
  }
});

// lib/parser/contents/classes/SectionList.js
var require_SectionList = __commonJS({
  "lib/parser/contents/classes/SectionList.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var SectionList = class {
      type = "SectionList";
      constructor(data) {
        if (data.targetId) {
          this.target_id = data.targetId;
        }
        this.contents = Parser.parse(data.contents);
        if (data.continuations) {
          if (data.continuations[0].nextContinuationData) {
            this.continuation = data.continuations[0].nextContinuationData.continuation;
          } else if (data.continuations[0].reloadContinuationData) {
            this.continuation = data.continuations[0].reloadContinuationData.continuation;
          }
        }
        if (data.header) {
          this.header = Parser.parse(data.header);
        }
      }
    };
    module2.exports = SectionList;
  }
});

// lib/parser/contents/classes/Shelf.js
var require_Shelf = __commonJS({
  "lib/parser/contents/classes/Shelf.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Parser = require_contents();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Shelf = class {
      type = "Shelf";
      constructor(data) {
        this.title = new Text(data.title);
        if (data.endpoint) {
          this.endpoint = new NavigationEndpoint(data.endpoint);
        }
        this.content = Parser.parse(data.content) || [];
        if (data.icon?.iconType) {
          this.icon_type = data.icon?.iconType;
        }
        if (data.menu) {
          this.menu = Parser.parse(data.menu);
        }
      }
    };
    module2.exports = Shelf;
  }
});

// lib/parser/contents/classes/ShowingResultsFor.js
var require_ShowingResultsFor = __commonJS({
  "lib/parser/contents/classes/ShowingResultsFor.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var ShowingResultsFor = class {
      type = "ShowingResultsFor";
      constructor(data) {
        this.corrected_query = new Text(data.correctedQuery);
        this.endpoint = new NavigationEndpoint(data.correctedQueryEndpoint);
        this.original_query_endpoint = new NavigationEndpoint(data.originalQueryEndpoint);
      }
    };
    module2.exports = ShowingResultsFor;
  }
});

// lib/parser/contents/classes/SimpleCardTeaser.js
var require_SimpleCardTeaser = __commonJS({
  "lib/parser/contents/classes/SimpleCardTeaser.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var SimpleCardTeaser = class {
      type = "SimpleCardTeaser";
      constructor(data) {
        this.message = new Text(data.message);
        this.prominent = data.prominent;
      }
    };
    module2.exports = SimpleCardTeaser;
  }
});

// lib/parser/contents/classes/SingleActionEmergencySupport.js
var require_SingleActionEmergencySupport = __commonJS({
  "lib/parser/contents/classes/SingleActionEmergencySupport.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var SingleActionEmergencySupport = class {
      type = "SingleActionEmergencySupport";
      constructor(data) {
        this.action_text = new Text(data.actionText);
        this.nav_text = new Text(data.navigationText);
        this.details = new Text(data.detailsText);
        this.icon_type = data.icon.iconType;
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
      }
    };
    module2.exports = SingleActionEmergencySupport;
  }
});

// lib/parser/contents/classes/SingleColumnBrowseResults.js
var require_SingleColumnBrowseResults = __commonJS({
  "lib/parser/contents/classes/SingleColumnBrowseResults.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var SingleColumnBrowseResults = class {
      type = "SingleColumnBrowseResults";
      constructor(data) {
        this.tabs = Parser.parse(data.tabs);
      }
    };
    module2.exports = SingleColumnBrowseResults;
  }
});

// lib/parser/contents/classes/SingleColumnMusicWatchNextResults.js
var require_SingleColumnMusicWatchNextResults = __commonJS({
  "lib/parser/contents/classes/SingleColumnMusicWatchNextResults.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var SingleColumnMusicWatchNextResults = class {
      type = "SingleColumnMusicWatchNextResults";
      constructor(data) {
        return Parser.parse(data);
      }
    };
    module2.exports = SingleColumnMusicWatchNextResults;
  }
});

// lib/parser/contents/classes/SingleHeroImage.js
var require_SingleHeroImage = __commonJS({
  "lib/parser/contents/classes/SingleHeroImage.js"(exports2, module2) {
    "use strict";
    var Thumbnail = require_Thumbnail();
    var SingleHeroImage = class {
      type = "SingleHeroImage";
      constructor(data) {
        this.thumbnails = new Thumbnail(data.thumbnail).thumbnails;
        this.style = data.style;
      }
    };
    module2.exports = SingleHeroImage;
  }
});

// lib/parser/contents/classes/SortFilterSubMenu.js
var require_SortFilterSubMenu = __commonJS({
  "lib/parser/contents/classes/SortFilterSubMenu.js"(exports2, module2) {
    "use strict";
    var { observe } = require_Utils();
    var SortFilterSubMenu = class {
      type = "SortFilterSubMenu";
      constructor(data) {
        this.sub_menu_items = observe(data.subMenuItems.map((item) => ({
          title: item.title,
          selected: item.selected,
          continuation: item.continuation?.reloadContinuationData.continuation,
          subtitle: item.subtitle
        })));
        this.label = data.accessibility.accessibilityData.label;
      }
    };
    module2.exports = SortFilterSubMenu;
  }
});

// lib/parser/contents/classes/SubFeedOption.js
var require_SubFeedOption = __commonJS({
  "lib/parser/contents/classes/SubFeedOption.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var SubFeedOption = class {
      type = "SubFeedOption";
      constructor(data) {
        this.name = new Text(data.name);
        this.is_selected = data.isSelected;
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
      }
    };
    module2.exports = SubFeedOption;
  }
});

// lib/parser/contents/classes/SubFeedSelector.js
var require_SubFeedSelector = __commonJS({
  "lib/parser/contents/classes/SubFeedSelector.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var SubFeedSelector = class {
      type = "SubFeedSelector";
      constructor(data) {
        this.title = new Text(data.title);
        this.options = Parser.parse(data.options);
      }
    };
    module2.exports = SubFeedSelector;
  }
});

// lib/parser/contents/classes/SubscribeButton.js
var require_SubscribeButton = __commonJS({
  "lib/parser/contents/classes/SubscribeButton.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var SubscribeButton = class {
      type = "SubscribeButton";
      constructor(data) {
        this.title = new Text(data.buttonText);
        this.subscribed = data.subscribed;
        this.enabled = data.enabled;
        this.type = data.type;
        this.channel_id = data.channelId;
        this.show_preferences = data.showPreferences;
        this.subscribed_text = new Text(data.subscribedButtonText);
        this.unsubscribed_text = new Text(data.unsubscribedButtonText);
        this.notification_preference_button = Parser.parse(data.notificationPreferenceButton);
        this.endpoint = new NavigationEndpoint(data.serviceEndpoints?.[0] || data.onSubscribeEndpoints?.[0]);
      }
    };
    module2.exports = SubscribeButton;
  }
});

// lib/parser/contents/classes/SubscriptionNotificationToggleButton.js
var require_SubscriptionNotificationToggleButton = __commonJS({
  "lib/parser/contents/classes/SubscriptionNotificationToggleButton.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var SubscriptionNotificationToggleButton = class {
      type = "SubscriptionNotificationToggleButton";
      constructor(data) {
        this.states = data.states.map((state) => ({
          id: state.stateId,
          next_id: state.nextStateId,
          state: Parser.parse(state.state)
        }));
        this.current_state_id = data.currentStateId;
        this.target_id = data.targetId;
      }
    };
    module2.exports = SubscriptionNotificationToggleButton;
  }
});

// lib/parser/contents/classes/Tab.js
var require_Tab = __commonJS({
  "lib/parser/contents/classes/Tab.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Tab = class {
      type = "Tab";
      constructor(data) {
        this.title = data.title || "N/A";
        this.selected = data.selected || false;
        this.endpoint = new NavigationEndpoint(data.endpoint);
        this.content = Parser.parse(data.content);
      }
    };
    module2.exports = Tab;
  }
});

// lib/parser/contents/classes/Tabbed.js
var require_Tabbed = __commonJS({
  "lib/parser/contents/classes/Tabbed.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Tabbed = class {
      type = "Tabbed";
      constructor(data) {
        return Parser.parse(data);
      }
    };
    module2.exports = Tabbed;
  }
});

// lib/parser/contents/classes/TabbedSearchResults.js
var require_TabbedSearchResults = __commonJS({
  "lib/parser/contents/classes/TabbedSearchResults.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var TabbedSearchResults = class {
      type = "TabbedSearchResults";
      #data;
      constructor(data) {
        this.#data = data;
      }
      get tabs() {
        return Parser.parse(this.#data.tabs);
      }
    };
    module2.exports = TabbedSearchResults;
  }
});

// lib/parser/contents/classes/TextHeader.js
var require_TextHeader = __commonJS({
  "lib/parser/contents/classes/TextHeader.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var TextHeader = class {
      type = "TextHeader";
      constructor(data) {
        this.title = new Text(data.title);
        this.style = data.style;
      }
    };
    module2.exports = TextHeader;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayBottomPanel.js
var require_ThumbnailOverlayBottomPanel = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayBottomPanel.js"(exports2, module2) {
    "use strict";
    var ThumbnailOverlayBottomPanel = class {
      type = "ThumbnailOverlayBottomPanel";
      constructor(data) {
        this.type = data.icon.iconType;
      }
    };
    module2.exports = ThumbnailOverlayBottomPanel;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayEndorsement.js
var require_ThumbnailOverlayEndorsement = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayEndorsement.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ThumbnailOverlayEndorsement = class {
      type = "ThumbnailOverlayEndorsement";
      constructor(data) {
        this.text = new Text(data.text).toString();
      }
    };
    module2.exports = ThumbnailOverlayEndorsement;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayHoverText.js
var require_ThumbnailOverlayHoverText = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayHoverText.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ThumbnailOverlayHoverText = class {
      type = "ThumbnailOverlayHoverText";
      constructor(data) {
        this.text = new Text(data.text);
        this.type = data.icon.iconType;
      }
    };
    module2.exports = ThumbnailOverlayHoverText;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayInlineUnplayable.js
var require_ThumbnailOverlayInlineUnplayable = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayInlineUnplayable.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ThumbnailOverlayInlineUnplayable = class {
      type = "ThumbnailOverlayInlineUnplayable";
      constructor(data) {
        this.text = new Text(data.text).toString();
        this.icon_type = data.icon.iconType;
      }
    };
    module2.exports = ThumbnailOverlayInlineUnplayable;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayLoadingPreview.js
var require_ThumbnailOverlayLoadingPreview = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayLoadingPreview.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ThumbnailOverlayLoadingPreview = class {
      type = "ThumbnailOverlayLoadingPreview";
      constructor(data) {
        this.text = new Text(data.text);
      }
    };
    module2.exports = ThumbnailOverlayLoadingPreview;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayNowPlaying.js
var require_ThumbnailOverlayNowPlaying = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayNowPlaying.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ThumbnailOverlayNowPlaying = class {
      type = "ThumbnailOverlayNowPlaying";
      constructor(data) {
        this.text = new Text(data.text).text;
      }
    };
    module2.exports = ThumbnailOverlayNowPlaying;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayPinking.js
var require_ThumbnailOverlayPinking = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayPinking.js"(exports2, module2) {
    "use strict";
    var ThumbnailOverlayPinking = class {
      type = "ThumbnailOverlayPinking";
      constructor(data) {
        this.hack = data.hack;
      }
    };
    module2.exports = ThumbnailOverlayPinking;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayPlaybackStatus.js
var require_ThumbnailOverlayPlaybackStatus = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayPlaybackStatus.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ThumbnailOverlayPlaybackStatus = class {
      type = "ThumbnailOverlayPlaybackStatus";
      constructor(data) {
        this.text = data.texts.map((text) => new Text(text))[0].toString();
      }
    };
    module2.exports = ThumbnailOverlayPlaybackStatus;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayResumePlayback.js
var require_ThumbnailOverlayResumePlayback = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayResumePlayback.js"(exports2, module2) {
    "use strict";
    var ThumbnailOverlayResumePlayback = class {
      type = "ThumbnailOverlayResumePlayback";
      constructor(data) {
        this.percent_duration_watched = data.percentDurationWatched;
      }
    };
    module2.exports = ThumbnailOverlayResumePlayback;
  }
});

// lib/parser/contents/classes/ThumbnailOverlaySidePanel.js
var require_ThumbnailOverlaySidePanel = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlaySidePanel.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ThumbnailOverlaySidePanel = class {
      type = "ThumbnailOverlaySidePanel";
      constructor(data) {
        this.text = new Text(data.text);
        this.type = data.icon.iconType;
      }
    };
    module2.exports = ThumbnailOverlaySidePanel;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayTimeStatus.js
var require_ThumbnailOverlayTimeStatus = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayTimeStatus.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var ThumbnailOverlayTimeStatus = class {
      type = "ThumbnailOverlayTimeStatus";
      constructor(data) {
        this.text = new Text(data.text).text;
      }
    };
    module2.exports = ThumbnailOverlayTimeStatus;
  }
});

// lib/parser/contents/classes/ThumbnailOverlayToggleButton.js
var require_ThumbnailOverlayToggleButton = __commonJS({
  "lib/parser/contents/classes/ThumbnailOverlayToggleButton.js"(exports2, module2) {
    "use strict";
    var NavigationEndpoint = require_NavigationEndpoint();
    var ThumbnailOverlayToggleButton = class {
      type = "ThumbnailOverlayToggleButton";
      constructor(data) {
        this.is_toggled = data.isToggled || null;
        this.icon_type = {
          toggled: data.toggledIcon.iconType,
          untoggled: data.untoggledIcon.iconType
        };
        this.tooltip = {
          toggled: data.toggledTooltip,
          untoggled: data.untoggledTooltip
        };
        this.toggled_endpoint = new NavigationEndpoint(data.toggledServiceEndpoint);
        this.untoggled_endpoint = new NavigationEndpoint(data.untoggledServiceEndpoint);
      }
    };
    module2.exports = ThumbnailOverlayToggleButton;
  }
});

// lib/parser/contents/classes/ToggleButton.js
var require_ToggleButton = __commonJS({
  "lib/parser/contents/classes/ToggleButton.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var ToggleButton = class {
      type = "ToggleButton";
      constructor(data) {
        this.text = new Text(data.defaultText);
        this.toggled_text = new Text(data.toggledText);
        this.tooltip = data.defaultTooltip;
        this.toggled_tooltip = data.toggledTooltip;
        this.is_toggled = data.isToggled;
        this.is_disabled = data.isDisabled;
        this.icon_type = data.defaultIcon.iconType;
        const acc_label = data?.defaultText?.accessibility?.accessibilityData.label || data?.accessibilityData?.accessibilityData.label || data?.accessibility?.label;
        if (this.icon_type == "LIKE") {
          this.like_count = parseInt(acc_label.replace(/\D/g, ""));
          this.short_like_count = new Text(data.defaultText).toString();
        }
        this.endpoint = data.defaultServiceEndpoint?.commandExecutorCommand?.commands && new NavigationEndpoint(data.defaultServiceEndpoint.commandExecutorCommand.commands.pop()) || new NavigationEndpoint(data.defaultServiceEndpoint);
        this.toggled_endpoint = new NavigationEndpoint(data.toggledServiceEndpoint);
        this.button_id = data.toggleButtonSupportedData?.toggleButtonIdData?.id || null;
        this.target_id = data.targetId || null;
      }
    };
    module2.exports = ToggleButton;
  }
});

// lib/parser/contents/classes/ToggleMenuServiceItem.js
var require_ToggleMenuServiceItem = __commonJS({
  "lib/parser/contents/classes/ToggleMenuServiceItem.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var ToggleMenuServiceItem = class {
      type = "ToggleMenuServiceItem";
      constructor(data) {
        this.text = new Text(data.defaultText);
        this.toggled_text = new Text(data.toggledText);
        this.icon_type = data.defaultIcon.iconType;
        this.toggled_icon_type = data.toggledIcon.iconType;
        this.endpoint = new NavigationEndpoint(data.toggledServiceEndpoint);
      }
    };
    module2.exports = ToggleMenuServiceItem;
  }
});

// lib/parser/contents/classes/Tooltip.js
var require_Tooltip = __commonJS({
  "lib/parser/contents/classes/Tooltip.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Tooltip = class {
      type = "Tooltip";
      constructor(data) {
        this.promo_config = {
          promo_id: data.promoConfig.promoId,
          impression_endpoints: data.promoConfig.impressionEndpoints.map((endpoint) => new NavigationEndpoint(endpoint)),
          accept: new NavigationEndpoint(data.promoConfig.acceptCommand),
          dismiss: new NavigationEndpoint(data.promoConfig.dismissCommand)
        };
        this.target_id = data.targetId;
        this.details = new Text(data.detailsText);
        this.suggested_position = data.suggestedPosition.type;
        this.dismiss_stratedy = data.dismissStrategy.type;
        this.dwell_time_ms = parseInt(data.dwellTimeMs);
      }
    };
    module2.exports = Tooltip;
  }
});

// lib/parser/contents/classes/TwoColumnBrowseResults.js
var require_TwoColumnBrowseResults = __commonJS({
  "lib/parser/contents/classes/TwoColumnBrowseResults.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var TwoColumnBrowseResults = class {
      type = "TwoColumnBrowseResults";
      constructor(data) {
        this.tabs = Parser.parse(data.tabs);
        this.secondary_contents = Parser.parse(data.secondaryContents);
      }
    };
    module2.exports = TwoColumnBrowseResults;
  }
});

// lib/parser/contents/classes/TwoColumnSearchResults.js
var require_TwoColumnSearchResults = __commonJS({
  "lib/parser/contents/classes/TwoColumnSearchResults.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var TwoColumnSearchResults = class {
      type = "TwoColumnSearchResults";
      constructor(data) {
        this.primary_contents = Parser.parse(data.primaryContents);
        this.secondary_contents = Parser.parse(data.secondaryContents);
      }
    };
    module2.exports = TwoColumnSearchResults;
  }
});

// lib/parser/contents/classes/TwoColumnWatchNextResults.js
var require_TwoColumnWatchNextResults = __commonJS({
  "lib/parser/contents/classes/TwoColumnWatchNextResults.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var TwoColumnWatchNextResults = class {
      type = "TwoColumnWatchNextResults";
      constructor(data) {
        this.results = Parser.parse(data.results?.results.contents);
        this.secondary_results = Parser.parse(data.secondaryResults?.secondaryResults.results);
        this.conversation_bar = Parser.parse(data?.conversationBar);
      }
    };
    module2.exports = TwoColumnWatchNextResults;
  }
});

// lib/parser/contents/classes/UniversalWatchCard.js
var require_UniversalWatchCard = __commonJS({
  "lib/parser/contents/classes/UniversalWatchCard.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var UniversalWatchCard = class {
      type = "UniversalWatchCard";
      constructor(data) {
        this.header = Parser.parse(data.header);
        this.call_to_action = Parser.parse(data.callToAction);
        this.sections = Parser.parse(data.sections);
      }
    };
    module2.exports = UniversalWatchCard;
  }
});

// lib/parser/contents/classes/VerticalList.js
var require_VerticalList = __commonJS({
  "lib/parser/contents/classes/VerticalList.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var VerticalList = class {
      type = "VerticalList";
      constructor(data) {
        this.items = Parser.parse(data.items);
        this.collapsed_item_count = data.collapsedItemCount;
        this.collapsed_state_button_text = new Text(data.collapsedStateButtonText);
      }
      get contents() {
        return this.items;
      }
    };
    module2.exports = VerticalList;
  }
});

// lib/parser/contents/classes/VerticalWatchCardList.js
var require_VerticalWatchCardList = __commonJS({
  "lib/parser/contents/classes/VerticalWatchCardList.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var NavigationEndpoint = require_NavigationEndpoint();
    var VerticalWatchCardList = class {
      type = "VerticalWatchCardList";
      constructor(data) {
        this.items = Parser.parse(data.items);
        this.contents = this.items;
        this.view_all_text = new Text(data.viewAllText);
        this.view_all_endpoint = new NavigationEndpoint(data.viewAllEndpoint);
      }
    };
    module2.exports = VerticalWatchCardList;
  }
});

// lib/parser/contents/classes/Video.js
var require_Video = __commonJS({
  "lib/parser/contents/classes/Video.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var Author = require_Author();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Utils = require_Utils();
    var Video = class {
      type = "Video";
      constructor(data) {
        const overlay_time_status = data.thumbnailOverlays.find((overlay) => overlay.thumbnailOverlayTimeStatusRenderer)?.thumbnailOverlayTimeStatusRenderer.text || "N/A";
        this.id = data.videoId;
        this.title = new Text(data.title);
        this.description_snippet = data.descriptionSnippet ? new Text(data.descriptionSnippet, "") : null;
        this.snippets = data.detailedMetadataSnippets?.map((snippet) => ({
          text: new Text(snippet.snippetText),
          hover_text: new Text(snippet.snippetHoverText)
        })) || [];
        this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
        this.thumbnail_overlays = Parser.parse(data.thumbnailOverlays);
        this.rich_thumbnail = data.richThumbnail && Parser.parse(data.richThumbnail);
        this.author = new Author(data.ownerText, data.ownerBadges, data.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer?.thumbnail);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.published = new Text(data.publishedTimeText);
        this.view_count_text = new Text(data.viewCountText);
        this.short_view_count_text = new Text(data.shortViewCountText);
        const upcoming = data.upcomingEventData && Number(`${data.upcomingEventData.startTime}000`);
        if (upcoming)
          this.upcoming = new Date(upcoming);
        this.duration = {
          text: data.lengthText ? new Text(data.lengthText).text : new Text(overlay_time_status).text,
          seconds: Utils.timeToSeconds(data.lengthText ? new Text(data.lengthText).text : new Text(overlay_time_status).text)
        };
        this.show_action_menu = data.showActionMenu;
        this.is_watched = data.isWatched || false;
        this.menu = Parser.parse(data.menu);
      }
      get description() {
        if (this.snippets.length > 0) {
          return this.snippets.map((snip) => snip.text.toString()).join("");
        }
        return this.description_snippet?.toString() || "";
      }
      get is_live() {
        return this.badges.some((badge) => badge.style === "BADGE_STYLE_TYPE_LIVE_NOW");
      }
      get is_upcoming() {
        return this.upcoming && this.upcoming > new Date();
      }
      get has_captions() {
        return this.badges.some((badge) => badge.label === "CC");
      }
      get best_thumbnail() {
        return this.thumbnails[0];
      }
    };
    module2.exports = Video;
  }
});

// lib/parser/contents/classes/VideoInfoCardContent.js
var require_VideoInfoCardContent = __commonJS({
  "lib/parser/contents/classes/VideoInfoCardContent.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Thumbnail = require_Thumbnail();
    var NavigationEndpoint = require_NavigationEndpoint();
    var VideoInfoCardContent = class {
      type = "VideoInfoCardContent";
      constructor(data) {
        this.title = new Text(data.videoTitle);
        this.channel_name = new Text(data.channelName);
        this.view_count = new Text(data.viewCountText);
        this.video_thumbnails = Thumbnail.fromResponse(data.videoThumbnail);
        this.duration = new Text(data.lengthString);
        this.endpoint = new NavigationEndpoint(data.action);
      }
    };
    module2.exports = VideoInfoCardContent;
  }
});

// lib/parser/contents/classes/VideoOwner.js
var require_VideoOwner = __commonJS({
  "lib/parser/contents/classes/VideoOwner.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var Author = require_Author();
    var VideoOwner = class {
      type = "VideoOwner";
      constructor(data) {
        this.subscription_button = data.subscriptionButton || null;
        this.subscriber_count = new Text(data.subscriberCountText);
        this.author = new Author({
          ...data.title,
          navigationEndpoint: data.navigationEndpoint
        }, data.badges, data.thumbnail);
      }
    };
    module2.exports = VideoOwner;
  }
});

// lib/parser/contents/classes/VideoPrimaryInfo.js
var require_VideoPrimaryInfo = __commonJS({
  "lib/parser/contents/classes/VideoPrimaryInfo.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var VideoPrimaryInfo = class {
      type = "VideoPrimaryInfo";
      constructor(data) {
        this.title = new Text(data.title);
        this.super_title_link = new Text(data.superTitleLink);
        this.view_count = new Text(data.viewCount.videoViewCountRenderer.viewCount);
        this.short_view_count = new Text(data.viewCount.videoViewCountRenderer.shortViewCount);
        this.published = new Text(data.dateText);
        this.menu = Parser.parse(data.videoActions);
      }
    };
    module2.exports = VideoPrimaryInfo;
  }
});

// lib/parser/contents/classes/VideoSecondaryInfo.js
var require_VideoSecondaryInfo = __commonJS({
  "lib/parser/contents/classes/VideoSecondaryInfo.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var VideoSecondaryInfo = class {
      type = "VideoSecondaryInfo";
      constructor(data) {
        this.owner = Parser.parse(data.owner);
        this.description = new Text(data.description);
        this.subscribe_button = Parser.parse(data.subscribeButton);
        this.metadata = Parser.parse(data.metadataRowContainer);
        this.show_more_text = data.showMoreText;
        this.show_less_text = data.showLessText;
        this.default_expanded = data.defaultExpanded;
        this.description_collapsed_lines = data.descriptionCollapsedLines;
      }
    };
    module2.exports = VideoSecondaryInfo;
  }
});

// lib/parser/contents/classes/WatchCardCompactVideo.js
var require_WatchCardCompactVideo = __commonJS({
  "lib/parser/contents/classes/WatchCardCompactVideo.js"(exports2, module2) {
    "use strict";
    var Text = require_Text();
    var { timeToSeconds } = require_Utils();
    var WatchCardCompactVideo = class {
      type = "WatchCardCompactVideo";
      constructor(data) {
        this.title = new Text(data.title);
        this.subtitle = new Text(data.subtitle);
        this.duration = {
          text: new Text(data.lengthText).toString(),
          seconds: timeToSeconds(data.lengthText.simpleText)
        };
        this.style = data.style;
      }
    };
    module2.exports = WatchCardCompactVideo;
  }
});

// lib/parser/contents/classes/WatchCardHeroVideo.js
var require_WatchCardHeroVideo = __commonJS({
  "lib/parser/contents/classes/WatchCardHeroVideo.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var NavigationEndpoint = require_NavigationEndpoint();
    var WatchCardHeroVideo = class {
      type = "WatchCardHeroVideo";
      constructor(data) {
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.call_to_action_button = Parser.parse(data.callToActionButton);
        this.hero_image = Parser.parse(data.heroImage);
        this.label = data.accessibility.accessibilityData.label;
      }
    };
    module2.exports = WatchCardHeroVideo;
  }
});

// lib/parser/contents/classes/WatchCardRichHeader.js
var require_WatchCardRichHeader = __commonJS({
  "lib/parser/contents/classes/WatchCardRichHeader.js"(exports2, module2) {
    "use strict";
    var Author = require_Author();
    var NavigationEndpoint = require_NavigationEndpoint();
    var Text = require_Text();
    var WatchCardRichHeader = class {
      type = "WatchCardRichHeader";
      constructor(data) {
        this.title = new Text(data.title);
        this.title_endpoint = new NavigationEndpoint(data.titleNavigationEndpoint);
        this.subtitle = new Text(data.subtitle);
        this.author = new Author(data, data.titleBadge ? [data.titleBadge] : null, data.avatar);
        this.author.name = this.title;
        this.style = data.style;
      }
    };
    module2.exports = WatchCardRichHeader;
  }
});

// lib/parser/contents/classes/WatchCardSectionSequence.js
var require_WatchCardSectionSequence = __commonJS({
  "lib/parser/contents/classes/WatchCardSectionSequence.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var WatchCardSectionSequence = class {
      type = "WatchCardSectionSequence";
      constructor(data) {
        this.lists = Parser.parse(data.lists);
      }
    };
    module2.exports = WatchCardSectionSequence;
  }
});

// lib/parser/contents/classes/WatchNextEndScreen.js
var require_WatchNextEndScreen = __commonJS({
  "lib/parser/contents/classes/WatchNextEndScreen.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Text = require_Text();
    var WatchNextEndScreen = class {
      constructor(data) {
        this.results = Parser.parse(data.results);
        this.title = new Text(data.title).toString();
      }
    };
    module2.exports = WatchNextEndScreen;
  }
});

// lib/parser/contents/classes/WatchNextTabbedResults.js
var require_WatchNextTabbedResults = __commonJS({
  "lib/parser/contents/classes/WatchNextTabbedResults.js"(exports2, module2) {
    "use strict";
    var TwoColumnBrowseResults = require_TwoColumnBrowseResults();
    var WatchNextTabbedResults = class extends TwoColumnBrowseResults {
      type = "WatchNextTabbedResults";
      constructor(data) {
        super(data);
      }
    };
    module2.exports = WatchNextTabbedResults;
  }
});

// lib/parser/contents/map.js
var require_map = __commonJS({
  "lib/parser/contents/map.js"(exports2, module2) {
    var map = { "AnalyticsMainAppKeyMetrics": () => require_AnalyticsMainAppKeyMetrics(), "AnalyticsVideo": () => require_AnalyticsVideo(), "AnalyticsVodCarouselCard": () => require_AnalyticsVodCarouselCard(), "Author": () => require_Author(), "BackstageImage": () => require_BackstageImage(), "BackstagePost": () => require_BackstagePost(), "BackstagePostThread": () => require_BackstagePostThread(), "BrowseFeedActions": () => require_BrowseFeedActions(), "Button": () => require_Button(), "C4TabbedHeader": () => require_C4TabbedHeader(), "CallToActionButton": () => require_CallToActionButton(), "Card": () => require_Card(), "CardCollection": () => require_CardCollection(), "Channel": () => require_Channel(), "ChannelAboutFullMetadata": () => require_ChannelAboutFullMetadata(), "ChannelFeaturedContent": () => require_ChannelFeaturedContent(), "ChannelHeaderLinks": () => require_ChannelHeaderLinks(), "ChannelMetadata": () => require_ChannelMetadata(), "ChannelMobileHeader": () => require_ChannelMobileHeader(), "ChannelThumbnailWithLink": () => require_ChannelThumbnailWithLink(), "ChannelVideoPlayer": () => require_ChannelVideoPlayer(), "ChildVideo": () => require_ChildVideo(), "ChipCloud": () => require_ChipCloud(), "ChipCloudChip": () => require_ChipCloudChip(), "CollageHeroImage": () => require_CollageHeroImage(), "Comment": () => require_Comment(), "CommentReplyDialog": () => require_CommentReplyDialog(), "comments/AuthorCommentBadge": () => require_AuthorCommentBadge(), "comments/CommentActionButtons": () => require_CommentActionButtons(), "comments/CommentReplies": () => require_CommentReplies(), "comments/CommentSimplebox": () => require_CommentSimplebox(), "CommentsEntryPointHeader": () => require_CommentsEntryPointHeader(), "CommentsHeader": () => require_CommentsHeader(), "CommentThread": () => require_CommentThread(), "CompactLink": () => require_CompactLink(), "CompactMix": () => require_CompactMix(), "CompactPlaylist": () => require_CompactPlaylist(), "CompactVideo": () => require_CompactVideo(), "ContinuationItem": () => require_ContinuationItem(), "CtaGoToCreatorStudio": () => require_CtaGoToCreatorStudio(), "DataModelSection": () => require_DataModelSection(), "DidYouMean": () => require_DidYouMean(), "DownloadButton": () => require_DownloadButton(), "Element": () => require_Element(), "EmergencyOnebox": () => require_EmergencyOnebox(), "EmojiRun": () => require_EmojiRun(), "Endscreen": () => require_Endscreen(), "EndscreenElement": () => require_EndscreenElement(), "EndScreenPlaylist": () => require_EndScreenPlaylist(), "EndScreenVideo": () => require_EndScreenVideo(), "ExpandableTab": () => require_ExpandableTab(), "ExpandedShelfContents": () => require_ExpandedShelfContents(), "FeedFilterChipBar": () => require_FeedFilterChipBar(), "FeedTabbedHeader": () => require_FeedTabbedHeader(), "Format": () => require_Format(), "Grid": () => require_Grid(), "GridChannel": () => require_GridChannel(), "GridPlaylist": () => require_GridPlaylist(), "GridVideo": () => require_GridVideo(), "HorizontalCardList": () => require_HorizontalCardList(), "HorizontalList": () => require_HorizontalList(), "ItemSection": () => require_ItemSection(), "ItemSectionHeader": () => require_ItemSectionHeader(), "LikeButton": () => require_LikeButton(), "LiveChat": () => require_LiveChat(), "livechat/AddBannerToLiveChatCommand": () => require_AddBannerToLiveChatCommand(), "livechat/AddChatItemAction": () => require_AddChatItemAction(), "livechat/AddLiveChatTickerItemAction": () => require_AddLiveChatTickerItemAction(), "livechat/items/LiveChatBanner": () => require_LiveChatBanner(), "livechat/items/LiveChatBannerHeader": () => require_LiveChatBannerHeader(), "livechat/items/LiveChatBannerPoll": () => require_LiveChatBannerPoll(), "livechat/items/LiveChatMembershipItem": () => require_LiveChatMembershipItem(), "livechat/items/LiveChatPaidMessage": () => require_LiveChatPaidMessage(), "livechat/items/LiveChatPaidSticker": () => require_LiveChatPaidSticker(), "livechat/items/LiveChatPlaceholderItem": () => require_LiveChatPlaceholderItem(), "livechat/items/LiveChatTextMessage": () => require_LiveChatTextMessage(), "livechat/items/LiveChatTickerPaidMessageItem": () => require_LiveChatTickerPaidMessageItem(), "livechat/items/LiveChatTickerSponsorItem": () => require_LiveChatTickerSponsorItem(), "livechat/items/LiveChatViewerEngagementMessage": () => require_LiveChatViewerEngagementMessage(), "livechat/items/Poll": () => require_Poll(), "livechat/items/PollHeader": () => require_PollHeader(), "livechat/LiveChatActionPanel": () => require_LiveChatActionPanel(), "livechat/MarkChatItemAsDeletedAction": () => require_MarkChatItemAsDeletedAction(), "livechat/MarkChatItemsByAuthorAsDeletedAction": () => require_MarkChatItemsByAuthorAsDeletedAction(), "livechat/RemoveBannerForLiveChatCommand": () => require_RemoveBannerForLiveChatCommand(), "livechat/ReplaceChatItemAction": () => require_ReplaceChatItemAction(), "livechat/ReplayChatItemAction": () => require_ReplayChatItemAction(), "livechat/ShowLiveChatActionPanelAction": () => require_ShowLiveChatActionPanelAction(), "livechat/ShowLiveChatTooltipCommand": () => require_ShowLiveChatTooltipCommand(), "livechat/UpdateDateTextAction": () => require_UpdateDateTextAction(), "livechat/UpdateDescriptionAction": () => require_UpdateDescriptionAction(), "livechat/UpdateLiveChatPollAction": () => require_UpdateLiveChatPollAction(), "livechat/UpdateTitleAction": () => require_UpdateTitleAction(), "livechat/UpdateToggleButtonTextAction": () => require_UpdateToggleButtonTextAction(), "livechat/UpdateViewershipAction": () => require_UpdateViewershipAction(), "LiveChatAuthorBadge": () => require_LiveChatAuthorBadge(), "LiveChatHeader": () => require_LiveChatHeader(), "LiveChatItemList": () => require_LiveChatItemList(), "LiveChatMessageInput": () => require_LiveChatMessageInput(), "LiveChatParticipant": () => require_LiveChatParticipant(), "LiveChatParticipantsList": () => require_LiveChatParticipantsList(), "Menu": () => require_Menu(), "MenuNavigationItem": () => require_MenuNavigationItem(), "MenuServiceItem": () => require_MenuServiceItem(), "MenuServiceItemDownload": () => require_MenuServiceItemDownload(), "MerchandiseItem": () => require_MerchandiseItem(), "MerchandiseShelf": () => require_MerchandiseShelf(), "Message": () => require_Message(), "MetadataBadge": () => require_MetadataBadge(), "MetadataRow": () => require_MetadataRow(), "MetadataRowContainer": () => require_MetadataRowContainer(), "MetadataRowHeader": () => require_MetadataRowHeader(), "MicroformatData": () => require_MicroformatData(), "Mix": () => require_Mix(), "Movie": () => require_Movie(), "MovingThumbnail": () => require_MovingThumbnail(), "MusicCarouselShelf": () => require_MusicCarouselShelf(), "MusicCarouselShelfBasicHeader": () => require_MusicCarouselShelfBasicHeader(), "MusicDescriptionShelf": () => require_MusicDescriptionShelf(), "MusicDetailHeader": () => require_MusicDetailHeader(), "MusicHeader": () => require_MusicHeader(), "MusicImmersiveHeader": () => require_MusicImmersiveHeader(), "MusicInlineBadge": () => require_MusicInlineBadge(), "MusicItemThumbnailOverlay": () => require_MusicItemThumbnailOverlay(), "MusicNavigationButton": () => require_MusicNavigationButton(), "MusicPlayButton": () => require_MusicPlayButton(), "MusicPlaylistShelf": () => require_MusicPlaylistShelf(), "MusicQueue": () => require_MusicQueue(), "MusicResponsiveListItem": () => require_MusicResponsiveListItem(), "MusicResponsiveListItemFixedColumn": () => require_MusicResponsiveListItemFixedColumn(), "MusicResponsiveListItemFlexColumn": () => require_MusicResponsiveListItemFlexColumn(), "MusicShelf": () => require_MusicShelf(), "MusicThumbnail": () => require_MusicThumbnail(), "MusicTwoRowItem": () => require_MusicTwoRowItem(), "NavigatableText": () => require_NavigatableText(), "NavigationEndpoint": () => require_NavigationEndpoint(), "PlayerAnnotationsExpanded": () => require_PlayerAnnotationsExpanded(), "PlayerCaptionsTracklist": () => require_PlayerCaptionsTracklist(), "PlayerErrorMessage": () => require_PlayerErrorMessage(), "PlayerLiveStoryboardSpec": () => require_PlayerLiveStoryboardSpec(), "PlayerMicroformat": () => require_PlayerMicroformat(), "PlayerOverlay": () => require_PlayerOverlay(), "PlayerOverlayAutoplay": () => require_PlayerOverlayAutoplay(), "PlayerStoryboardSpec": () => require_PlayerStoryboardSpec(), "Playlist": () => require_Playlist(), "PlaylistAuthor": () => require_PlaylistAuthor(), "PlaylistHeader": () => require_PlaylistHeader(), "PlaylistMetadata": () => require_PlaylistMetadata(), "PlaylistPanel": () => require_PlaylistPanel(), "PlaylistPanelVideo": () => require_PlaylistPanelVideo(), "PlaylistSidebar": () => require_PlaylistSidebar(), "PlaylistSidebarPrimaryInfo": () => require_PlaylistSidebarPrimaryInfo(), "PlaylistSidebarSecondaryInfo": () => require_PlaylistSidebarSecondaryInfo(), "PlaylistVideo": () => require_PlaylistVideo(), "PlaylistVideoList": () => require_PlaylistVideoList(), "PlaylistVideoThumbnail": () => require_PlaylistVideoThumbnail(), "Poll": () => require_Poll2(), "Post": () => require_Post(), "ProfileColumn": () => require_ProfileColumn(), "ProfileColumnStats": () => require_ProfileColumnStats(), "ProfileColumnStatsEntry": () => require_ProfileColumnStatsEntry(), "ProfileColumnUserInfo": () => require_ProfileColumnUserInfo(), "ReelItem": () => require_ReelItem(), "ReelShelf": () => require_ReelShelf(), "RelatedChipCloud": () => require_RelatedChipCloud(), "RichGrid": () => require_RichGrid(), "RichItem": () => require_RichItem(), "RichListHeader": () => require_RichListHeader(), "RichSection": () => require_RichSection(), "RichShelf": () => require_RichShelf(), "SearchBox": () => require_SearchBox(), "SearchRefinementCard": () => require_SearchRefinementCard(), "SecondarySearchContainer": () => require_SecondarySearchContainer(), "SectionList": () => require_SectionList(), "Shelf": () => require_Shelf(), "ShowingResultsFor": () => require_ShowingResultsFor(), "SimpleCardTeaser": () => require_SimpleCardTeaser(), "SingleActionEmergencySupport": () => require_SingleActionEmergencySupport(), "SingleColumnBrowseResults": () => require_SingleColumnBrowseResults(), "SingleColumnMusicWatchNextResults": () => require_SingleColumnMusicWatchNextResults(), "SingleHeroImage": () => require_SingleHeroImage(), "SortFilterSubMenu": () => require_SortFilterSubMenu(), "SubFeedOption": () => require_SubFeedOption(), "SubFeedSelector": () => require_SubFeedSelector(), "SubscribeButton": () => require_SubscribeButton(), "SubscriptionNotificationToggleButton": () => require_SubscriptionNotificationToggleButton(), "Tab": () => require_Tab(), "Tabbed": () => require_Tabbed(), "TabbedSearchResults": () => require_TabbedSearchResults(), "Text": () => require_Text(), "TextHeader": () => require_TextHeader(), "TextRun": () => require_TextRun(), "Thumbnail": () => require_Thumbnail(), "ThumbnailOverlayBottomPanel": () => require_ThumbnailOverlayBottomPanel(), "ThumbnailOverlayEndorsement": () => require_ThumbnailOverlayEndorsement(), "ThumbnailOverlayHoverText": () => require_ThumbnailOverlayHoverText(), "ThumbnailOverlayInlineUnplayable": () => require_ThumbnailOverlayInlineUnplayable(), "ThumbnailOverlayLoadingPreview": () => require_ThumbnailOverlayLoadingPreview(), "ThumbnailOverlayNowPlaying": () => require_ThumbnailOverlayNowPlaying(), "ThumbnailOverlayPinking": () => require_ThumbnailOverlayPinking(), "ThumbnailOverlayPlaybackStatus": () => require_ThumbnailOverlayPlaybackStatus(), "ThumbnailOverlayResumePlayback": () => require_ThumbnailOverlayResumePlayback(), "ThumbnailOverlaySidePanel": () => require_ThumbnailOverlaySidePanel(), "ThumbnailOverlayTimeStatus": () => require_ThumbnailOverlayTimeStatus(), "ThumbnailOverlayToggleButton": () => require_ThumbnailOverlayToggleButton(), "ToggleButton": () => require_ToggleButton(), "ToggleMenuServiceItem": () => require_ToggleMenuServiceItem(), "Tooltip": () => require_Tooltip(), "TwoColumnBrowseResults": () => require_TwoColumnBrowseResults(), "TwoColumnSearchResults": () => require_TwoColumnSearchResults(), "TwoColumnWatchNextResults": () => require_TwoColumnWatchNextResults(), "UniversalWatchCard": () => require_UniversalWatchCard(), "VerticalList": () => require_VerticalList(), "VerticalWatchCardList": () => require_VerticalWatchCardList(), "Video": () => require_Video(), "VideoDetails": () => require_VideoDetails(), "VideoInfoCardContent": () => require_VideoInfoCardContent(), "VideoOwner": () => require_VideoOwner(), "VideoPrimaryInfo": () => require_VideoPrimaryInfo(), "VideoSecondaryInfo": () => require_VideoSecondaryInfo(), "WatchCardCompactVideo": () => require_WatchCardCompactVideo(), "WatchCardHeroVideo": () => require_WatchCardHeroVideo(), "WatchCardRichHeader": () => require_WatchCardRichHeader(), "WatchCardSectionSequence": () => require_WatchCardSectionSequence(), "WatchNextEndScreen": () => require_WatchNextEndScreen(), "WatchNextTabbedResults": () => require_WatchNextTabbedResults() };
    module2.exports = function req(name) {
      const func = map[name];
      if (!func) {
        const error = new Error("Module not found: " + name);
        error.code = "MODULE_NOT_FOUND";
        throw error;
      }
      return func();
    };
  }
});

// lib/parser/contents/index.js
var require_contents = __commonJS({
  "lib/parser/contents/index.js"(exports2, module2) {
    "use strict";
    var { InnertubeError: InnertubeError2, observe } = require_Utils();
    var Format = require_Format();
    var VideoDetails = require_VideoDetails();
    var requireParserClass = require_map();
    var AppendContinuationItemsAction = class {
      type = "appendContinuationItemsAction";
      constructor(data) {
        this.contents = Parser.parse(data.continuationItems);
      }
    };
    var ReloadContinuationItemsCommand = class {
      type = "reloadContinuationItemsCommand";
      constructor(data) {
        this.target_id = data.targetId;
        this.contents = Parser.parse(data.continuationItems);
      }
    };
    var SectionListContinuation = class {
      type = "sectionListContinuation";
      constructor(data) {
        this.contents = Parser.parse(data.contents);
        this.continuation = data.continuations[0].nextContinuationData.continuation;
      }
    };
    var TimedContinuation = class {
      type = "timedContinuationData";
      constructor(data) {
        this.timeout_ms = data.timeoutMs || data.timeUntilLastMessageMsec;
        this.token = data.continuation;
      }
    };
    var LiveChatContinuation = class {
      type = "liveChatContinuation";
      constructor(data) {
        this.actions = Parser.parse(data.actions?.map((action) => {
          delete action.clickTrackingParams;
          return action;
        }), "livechat") || [];
        this.action_panel = Parser.parse(data.actionPanel);
        this.item_list = Parser.parse(data.itemList);
        this.header = Parser.parse(data.header);
        this.participants_list = Parser.parse(data.participantsList);
        this.popout_message = Parser.parse(data.popoutMessage);
        this.emojis = data.emojis?.map((emoji) => ({
          emoji_id: emoji.emojiId,
          shortcuts: emoji.shortcuts,
          search_terms: emoji.searchTerms,
          image: emoji.image,
          is_custom_emoji: emoji.isCustomEmoji
        })) || null;
        this.continuation = new TimedContinuation(data.continuations?.[0].timedContinuationData || data.continuations?.[0].invalidationContinuationData || data.continuations?.[0].liveChatReplayContinuationData);
        this.viewer_name = data.viewerName;
      }
    };
    var _memo, _clearMemo, clearMemo_fn, _createMemo, createMemo_fn, _addToMemo, addToMemo_fn;
    var _Parser = class {
      static parseResponse(data) {
        __privateMethod(this, _createMemo, createMemo_fn).call(this);
        const contents = _Parser.parse(data.contents);
        const contents_memo = __privateGet(_Parser, _memo);
        __privateMethod(this, _clearMemo, clearMemo_fn).call(this);
        __privateMethod(this, _createMemo, createMemo_fn).call(this);
        const on_response_received_actions = data.onResponseReceivedActions ? _Parser.parseRR(data.onResponseReceivedActions) : null;
        const on_response_received_actions_memo = __privateGet(_Parser, _memo);
        __privateMethod(this, _clearMemo, clearMemo_fn).call(this);
        __privateMethod(this, _createMemo, createMemo_fn).call(this);
        const on_response_received_endpoints = data.onResponseReceivedEndpoints ? _Parser.parseRR(data.onResponseReceivedEndpoints) : null;
        const on_response_received_endpoints_memo = __privateGet(_Parser, _memo);
        __privateMethod(this, _clearMemo, clearMemo_fn).call(this);
        __privateMethod(this, _createMemo, createMemo_fn).call(this);
        const on_response_received_commands = data.onResponseReceivedCommands ? _Parser.parseRR(data.onResponseReceivedCommands) : null;
        const on_response_received_commands_memo = __privateGet(_Parser, _memo);
        __privateMethod(this, _clearMemo, clearMemo_fn).call(this);
        return {
          contents,
          contents_memo,
          on_response_received_actions,
          on_response_received_actions_memo,
          on_response_received_endpoints,
          on_response_received_endpoints_memo,
          on_response_received_commands,
          on_response_received_commands_memo,
          continuation: data.continuation ? _Parser.parseC(data.continuation) : null,
          continuation_contents: data.continuationContents ? _Parser.parseLC(data.continuationContents) : null,
          actions: data.actions && _Parser.parseLA(data.actions),
          metadata: _Parser.parse(data.metadata),
          header: _Parser.parse(data.header),
          microformat: data.microformat && _Parser.parse(data.microformat),
          sidebar: _Parser.parse(data.sidebar),
          overlay: _Parser.parse(data.overlay),
          refinements: data.refinements || null,
          estimated_results: data.estimatedResults || null,
          player_overlays: _Parser.parse(data.playerOverlays),
          playability_status: data.playabilityStatus && {
            status: data.playabilityStatus.status,
            error_screen: _Parser.parse(data.playabilityStatus.errorScreen),
            embeddable: data.playabilityStatus.playableInEmbed || null,
            reason: data.reason || ""
          },
          streaming_data: data.streamingData && {
            expires: new Date(Date.now() + parseInt(data.streamingData.expiresInSeconds) * 1e3),
            formats: _Parser.parseFormats(data.streamingData.formats),
            adaptive_formats: _Parser.parseFormats(data.streamingData.adaptiveFormats),
            dash_manifest_url: data.streamingData?.dashManifestUrl || null,
            dls_manifest_url: data.streamingData?.dashManifestUrl || null
          },
          captions: _Parser.parse(data.captions),
          video_details: data.videoDetails && new VideoDetails(data.videoDetails),
          annotations: _Parser.parse(data.annotations),
          storyboards: _Parser.parse(data.storyboards),
          endscreen: _Parser.parse(data.endscreen),
          cards: _Parser.parse(data.cards)
        };
      }
      static parseC(data) {
        if (data.timedContinuationData)
          return new TimedContinuation(data.timedContinuationData);
      }
      static parseLC(data) {
        if (data.sectionListContinuation)
          return new SectionListContinuation(data.sectionListContinuation);
        if (data.liveChatContinuation)
          return new LiveChatContinuation(data.liveChatContinuation);
      }
      static parseRR(actions) {
        return observe(actions.map((action) => {
          if (action.reloadContinuationItemsCommand)
            return new ReloadContinuationItemsCommand(action.reloadContinuationItemsCommand);
          if (action.appendContinuationItemsAction)
            return new AppendContinuationItemsAction(action.appendContinuationItemsAction);
        }).filter((item) => item));
      }
      static parseLA(data) {
        if (Array.isArray(data)) {
          return _Parser.parse(data.map((action) => {
            delete action.clickTrackingParams;
            return action;
          }), "livechat");
        }
        return _Parser.parse(data) || null;
      }
      static parseFormats(formats) {
        return observe(formats?.map((format) => new Format(format)) || []);
      }
      static parse(data, module3) {
        if (!data)
          return null;
        if (Array.isArray(data)) {
          const results = [];
          for (const item of data) {
            const keys2 = Object.keys(item);
            const classname2 = this.sanitizeClassName(keys2[0]);
            if (!this.shouldIgnore(classname2)) {
              try {
                const path = module3 ? `${module3}/` : "";
                const TargetClass = requireParserClass(path + classname2);
                const result = new TargetClass(item[keys2[0]]);
                results.push(result);
                __privateMethod(this, _addToMemo, addToMemo_fn).call(this, classname2, result);
              } catch (err) {
                this.formatError({ classname: classname2, classdata: item[keys2[0]], err });
              }
            }
          }
          return observe(results);
        }
        const keys = Object.keys(data);
        const classname = this.sanitizeClassName(keys[0]);
        if (!this.shouldIgnore(classname)) {
          try {
            const path = module3 ? `${module3}/` : "";
            const TargetClass = requireParserClass(path + classname);
            const result = new TargetClass(data[keys[0]]);
            __privateMethod(this, _addToMemo, addToMemo_fn).call(this, classname, result);
            return result;
          } catch (err) {
            this.formatError({ classname, classdata: data[keys[0]], err });
            return null;
          }
        }
      }
      static formatError({ classname, classdata, err }) {
        if (err.code == "MODULE_NOT_FOUND") {
          return console.warn(new InnertubeError2(`${classname} not found!
This is a bug, please report it at ${require_package().bugs.url}`, classdata));
        }
        console.warn(new InnertubeError2(`Something went wrong at ${classname}!
This is a bug, please report it at ${require_package().bugs.url}`, { stack: err.stack }));
      }
      static sanitizeClassName(input) {
        return (input.charAt(0).toUpperCase() + input.slice(1)).replace(/Renderer|Model/g, "").replace(/Radio/g, "Mix").trim();
      }
      static shouldIgnore(classname) {
        return [
          "DisplayAd",
          "SearchPyv",
          "MealbarPromo",
          "BackgroundPromo",
          "PromotedSparklesWeb",
          "RunAttestationCommand"
        ].includes(classname);
      }
    };
    var Parser = _Parser;
    _memo = new WeakMap();
    _clearMemo = new WeakSet();
    clearMemo_fn = function() {
      __privateSet(_Parser, _memo, null);
    };
    _createMemo = new WeakSet();
    createMemo_fn = function() {
      __privateSet(_Parser, _memo, /* @__PURE__ */ new Map());
    };
    _addToMemo = new WeakSet();
    addToMemo_fn = function(classname, result) {
      if (!__privateGet(_Parser, _memo))
        return;
      if (!__privateGet(_Parser, _memo).has(classname))
        return __privateGet(_Parser, _memo).set(classname, [result]);
      __privateGet(_Parser, _memo).get(classname).push(result);
    };
    __privateAdd(Parser, _clearMemo);
    __privateAdd(Parser, _createMemo);
    __privateAdd(Parser, _addToMemo);
    __privateAdd(Parser, _memo, /* @__PURE__ */ new Map());
    module2.exports = Parser;
  }
});

// lib/parser/youtube/Analytics.js
var require_Analytics = __commonJS({
  "lib/parser/youtube/Analytics.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Analytics = class {
      #page;
      constructor(response) {
        this.#page = Parser.parseResponse(response);
        const tab = this.#page.contents.tabs.get({ selected: true });
        const item = tab.content.contents.get({ target_id: null });
        this.sections = item.contents;
      }
      get page() {
        return this.#page;
      }
    };
    module2.exports = Analytics;
  }
});

// lib/core/AccountManager.js
var require_AccountManager = __commonJS({
  "lib/core/AccountManager.js"(exports2, module2) {
    "use strict";
    var Utils = require_Utils();
    var Constants = require_Constants();
    var Analytics = require_Analytics();
    var Proto2 = require_proto();
    var AccountManager2 = class {
      #actions;
      constructor(actions) {
        this.#actions = actions;
        this.channel = {
          editName: (new_name) => this.#actions.channel("channel/edit_name", { new_name }),
          editDescription: (new_description) => this.#actions.channel("channel/edit_description", { new_description }),
          getBasicAnalytics: () => this.getAnalytics()
        };
        this.settings = {
          notifications: {
            setSubscriptions: (option) => this.#setSetting(Constants.ACCOUNT_SETTINGS.SUBSCRIPTIONS, "SPaccount_notifications", option),
            setRecommendedVideos: (option) => this.#setSetting(Constants.ACCOUNT_SETTINGS.RECOMMENDED_VIDEOS, "SPaccount_notifications", option),
            setChannelActivity: (option) => this.#setSetting(Constants.ACCOUNT_SETTINGS.CHANNEL_ACTIVITY, "SPaccount_notifications", option),
            setCommentReplies: (option) => this.#setSetting(Constants.ACCOUNT_SETTINGS.COMMENT_REPLIES, "SPaccount_notifications", option),
            setMentions: (option) => this.#setSetting(Constants.ACCOUNT_SETTINGS.USER_MENTION, "SPaccount_notifications", option),
            setSharedContent: (option) => this.#setSetting(Constants.ACCOUNT_SETTINGS.SHARED_CONTENT, "SPaccount_notifications", option)
          },
          privacy: {
            setSubscriptionsPrivate: (option) => this.#setSetting(Constants.ACCOUNT_SETTINGS.SUBSCRIPTIONS_PRIVACY, "SPaccount_privacy", option),
            setSavedPlaylistsPrivate: (option) => this.#setSetting(Constants.ACCOUNT_SETTINGS.PLAYLISTS_PRIVACY, "SPaccount_privacy", option)
          }
        };
      }
      async #setSetting(setting_id, type, new_value) {
        Utils.throwIfMissing({ setting_id, type, new_value });
        const values = { ON: true, OFF: false };
        if (!values.hasOwnProperty(new_value))
          throw new Utils.InnertubeError("Invalid option", { option: new_value, available_options: Object.keys(values) });
        const response = await this.#actions.browse(type);
        const contents = (() => {
          switch (type.trim()) {
            case "SPaccount_notifications":
              return Utils.findNode(response.data, "contents", "Your preferences", 13, false).options;
            case "SPaccount_privacy":
              return Utils.findNode(response.data, "contents", "settingsSwitchRenderer", 13, false).options;
            default:
              throw new TypeError("undefined is not a function");
          }
        })();
        const option = contents.find((option2) => option2.settingsSwitchRenderer.enableServiceEndpoint.setSettingEndpoint.settingItemIdForClient == setting_id);
        const setting_item_id = option.settingsSwitchRenderer.enableServiceEndpoint.setSettingEndpoint.settingItemId;
        const set_setting = await this.#actions.account("account/set_setting", {
          new_value: type == "SPaccount_privacy" ? !values[new_value] : values[new_value],
          setting_item_id
        });
        return set_setting;
      }
      async getInfo() {
        const response = await this.#actions.account("account/accounts_list", { client: "ANDROID" });
        const account_item_section_renderer = Utils.findNode(response.data, "contents", "accountItem", 8, false);
        const profile = account_item_section_renderer.accountItem.serviceEndpoint.signInEndpoint.directSigninUserProfile;
        const name = profile.accountName;
        const email = profile.email;
        const photo = profile.accountPhoto.thumbnails;
        const subscriber_count = account_item_section_renderer.accountItem.accountByline.runs.map((run) => run.text).join("");
        const channel_id = response.data.contents[0].accountSectionListRenderer.footers[0].accountChannelRenderer.navigationEndpoint.browseEndpoint.browseId;
        return { name, email, channel_id, subscriber_count, photo };
      }
      async getTimeWatched() {
        const response = await this.#actions.browse("SPtime_watched", { client: "ANDROID" });
        const rows = Utils.findNode(response.data, "contents", "statRowRenderer", 11, false);
        const stats = rows.map((row) => {
          const renderer = row.statRowRenderer;
          if (renderer) {
            return {
              title: renderer.title.runs.map((run) => run.text).join(""),
              time: renderer.contents.runs.map((run) => run.text).join("")
            };
          }
        }).filter((stat) => stat);
        return stats;
      }
      async getAnalytics() {
        const info = await this.getInfo();
        const params = Proto2.encodeChannelAnalyticsParams(info.channel_id);
        const response = await this.#actions.browse("FEanalytics_screen", { params, client: "ANDROID" });
        return new Analytics(response.data);
      }
    };
    module2.exports = AccountManager2;
  }
});

// lib/core/PlaylistManager.js
var require_PlaylistManager = __commonJS({
  "lib/core/PlaylistManager.js"(exports2, module2) {
    "use strict";
    var Utils = require_Utils();
    var PlaylistManager2 = class {
      #actions;
      constructor(actions) {
        this.#actions = actions;
      }
      async create(title, video_ids) {
        Utils.throwIfMissing({ title, video_ids });
        const response = await this.#actions.playlist("playlist/create", { title, ids: video_ids });
        return {
          success: response.success,
          status_code: response.status_code,
          playlist_id: response.data.playlistId,
          data: response.data
        };
      }
      async delete(playlist_id) {
        Utils.throwIfMissing({ playlist_id });
        const response = await this.#actions.playlist("playlist/delete", { playlist_id });
        return {
          playlist_id,
          success: response.success,
          status_code: response.status_code,
          data: response.data
        };
      }
      async addVideos(playlist_id, video_ids) {
        Utils.throwIfMissing({ playlist_id, video_ids });
        const response = await this.#actions.playlist("browse/edit_playlist", {
          ids: video_ids,
          action: "ACTION_ADD_VIDEO",
          playlist_id
        });
        return {
          playlist_id,
          success: response.success,
          status_code: response.status_code,
          data: response.data
        };
      }
      async removeVideos(playlist_id, video_ids) {
        Utils.throwIfMissing({ playlist_id, video_ids });
        const plinfo = await this.#actions.browse(`VL${playlist_id}`);
        const list = Utils.findNode(plinfo.data, "contents", "contents", 13, false);
        if (!list.isEditable)
          throw new Utils.InnertubeError("This playlist cannot be edited.", playlist_id);
        const videos = list.contents.filter((item) => video_ids.includes(item.playlistVideoRenderer.videoId));
        const set_video_ids = videos.map((video) => video.playlistVideoRenderer.setVideoId);
        const response = await this.#actions.playlist("browse/edit_playlist", {
          ids: set_video_ids,
          action: "ACTION_REMOVE_VIDEO",
          playlist_id
        });
        return {
          success: response.success,
          status_code: response.status_code,
          playlist_id,
          data: response.data
        };
      }
    };
    module2.exports = PlaylistManager2;
  }
});

// lib/core/InteractionManager.js
var require_InteractionManager = __commonJS({
  "lib/core/InteractionManager.js"(exports2, module2) {
    "use strict";
    var Utils = require_Utils();
    var InteractionManager2 = class {
      #actions;
      constructor(actions) {
        this.#actions = actions;
      }
      async like(video_id) {
        Utils.throwIfMissing({ video_id });
        const action = await this.#actions.engage("like/like", { video_id });
        return action;
      }
      async dislike(video_id) {
        Utils.throwIfMissing({ video_id });
        const action = await this.#actions.engage("like/dislike", { video_id });
        return action;
      }
      async removeLike(video_id) {
        Utils.throwIfMissing({ video_id });
        const action = await this.actions.engage("like/removelike", { video_id });
        return action;
      }
      async subscribe(channel_id) {
        Utils.throwIfMissing({ channel_id });
        const action = await this.#actions.engage("subscription/subscribe", { channel_id });
        return action;
      }
      async unsubscribe(channel_id) {
        Utils.throwIfMissing({ channel_id });
        const action = await this.#actions.engage("subscription/unsubscribe", { channel_id });
        return action;
      }
      async comment(video_id, text) {
        Utils.throwIfMissing({ video_id, text });
        const action = await this.#actions.engage("comment/create_comment", { video_id, text });
        return action;
      }
      async translate(text, target_language, args = {}) {
        Utils.throwIfMissing({ text, target_language });
        const response = await await this.#actions.engage("comment/perform_comment_action", {
          video_id: args.video_id,
          comment_id: args.comment_id,
          target_language,
          comment_action: "translate",
          text
        });
        const translated_content = Utils.findNode(response.data, "frameworkUpdates", "content", 7, false);
        return {
          success: response.success,
          status_code: response.status_code,
          translated_content: translated_content.content,
          data: response.data
        };
      }
      async setNotificationPreferences(channel_id, type) {
        Utils.throwIfMissing({ channel_id, type });
        const action = await this.#actions.notifications("modify_channel_preference", { channel_id, pref: type || "NONE" });
        return action;
      }
    };
    module2.exports = InteractionManager2;
  }
});

// lib/core/Feed.js
var require_Feed = __commonJS({
  "lib/core/Feed.js"(exports2, module2) {
    "use strict";
    var ResultsParser = require_contents();
    var { InnertubeError: InnertubeError2 } = require_Utils();
    var Feed = class {
      #page;
      #continuation;
      #actions;
      #memo;
      constructor(actions, data, already_parsed = false) {
        if (data.on_response_received_actions || data.on_response_received_endpoints || already_parsed) {
          this.#page = data;
        } else {
          this.#page = ResultsParser.parseResponse(data);
        }
        this.#memo = this.#page.on_response_received_commands ? this.#page.on_response_received_commands_memo : this.#page.on_response_received_endpoints ? this.#page.on_response_received_endpoints_memo : this.#page.contents ? this.#page.contents_memo : this.#page.on_response_received_actions ? this.#page.on_response_received_actions_memo : [];
        this.#actions = actions;
      }
      static getVideosFromMemo(memo) {
        const videos = memo.get("Video") || [];
        const grid_videos = memo.get("GridVideo") || [];
        const compact_videos = memo.get("CompactVideo") || [];
        const playlist_videos = memo.get("PlaylistVideo") || [];
        const playlist_panel_videos = memo.get("PlaylistPanelVideo") || [];
        const watch_card_compact_videos = memo.get("WatchCardCompactVideo") || [];
        return [
          ...videos,
          ...grid_videos,
          ...compact_videos,
          ...playlist_videos,
          ...playlist_panel_videos,
          ...watch_card_compact_videos
        ];
      }
      static getPlaylistsFromMemo(memo) {
        const playlists = memo.get("Playlist") || [];
        const grid_playlists = memo.get("GridPlaylist") || [];
        return [...playlists, ...grid_playlists];
      }
      get videos() {
        return Feed.getVideosFromMemo(this.#memo);
      }
      get posts() {
        return this.#memo.get("BackstagePost") || this.#memo.get("Post") || [];
      }
      get channels() {
        const channels = this.#memo.get("Channel") || [];
        const grid_channels = this.#memo.get("GridChannel") || [];
        return [...channels, ...grid_channels];
      }
      get playlists() {
        return Feed.getPlaylistsFromMemo(this.#memo);
      }
      get memo() {
        return this.#memo;
      }
      get contents() {
        const tab_content = this.#memo.get("Tab")?.[0]?.content;
        const reload_continuation_items = this.#memo.get("reloadContinuationItemsCommand")?.[0];
        const append_continuation_items = this.#memo.get("appendContinuationItemsAction")?.[0];
        return tab_content || reload_continuation_items || append_continuation_items;
      }
      get shelves() {
        const shelf = this.#page.contents_memo.get("Shelf") || [];
        const rich_shelf = this.#page.contents_memo.get("RichShelf") || [];
        const reel_shelf = this.#page.contents_memo.get("ReelShelf") || [];
        return [...shelf, ...rich_shelf, ...reel_shelf];
      }
      getShelf(title) {
        return this.shelves.find((shelf) => shelf.title.toString() === title);
      }
      get secondary_contents() {
        return this.page.contents?.secondary_contents;
      }
      get actions() {
        return this.#actions;
      }
      get page() {
        return this.#page;
      }
      get has_continuation() {
        return (this.#memo.get("ContinuationItem") || []).length > 0;
      }
      async getContinuationData() {
        if (this.#continuation) {
          if (this.#continuation.length > 1)
            throw new InnertubeError2("There are too many continuations, you'll need to find the correct one yourself in this.page");
          if (this.#continuation.length === 0)
            throw new InnertubeError2("There are no continuations");
          const response = await this.#continuation[0].endpoint.call(this.#actions);
          return response;
        }
        this.#continuation = this.#memo.get("ContinuationItem");
        if (this.#continuation)
          return this.getContinuationData();
        return null;
      }
      async getContinuation() {
        const continuation_data = await this.getContinuationData();
        return new Feed(this.actions, continuation_data, true);
      }
    };
    module2.exports = Feed;
  }
});

// lib/parser/youtube/Search.js
var require_Search = __commonJS({
  "lib/parser/youtube/Search.js"(exports2, module2) {
    "use strict";
    var Feed = require_Feed();
    var { InnertubeError: InnertubeError2 } = require_Utils();
    var Search2 = class extends Feed {
      constructor(actions, data, already_parsed = false) {
        super(actions, data, already_parsed);
        const contents = this.page.contents?.primary_contents.contents || this.page.on_response_received_commands[0].contents;
        const secondary_contents = this.page.contents?.secondary_contents?.contents;
        this.results = contents.get({ type: "ItemSection" }).contents;
        const card_list = this.results.get({ type: "HorizontalCardList" }, true);
        const universal_watch_card = secondary_contents?.get({ type: "UniversalWatchCard" });
        this.refinements = this.page.refinements || [];
        this.estimated_results = this.page.estimated_results;
        this.watch_card = {
          header: universal_watch_card?.header || null,
          call_to_action: universal_watch_card?.call_to_action || null,
          sections: universal_watch_card?.sections || []
        };
        this.refinement_cards = {
          header: card_list?.header || null,
          cards: card_list?.cards || []
        };
      }
      async selectRefinementCard(card) {
        let target_card;
        if (typeof card === "string") {
          target_card = this.refinement_cards.cards.get({ query: card });
          if (!target_card)
            throw new InnertubeError2("Refinement card not found!", { available_cards: this.refinement_card_queries });
        } else if (card.type === "SearchRefinementCard") {
          target_card = card;
        } else {
          throw new InnertubeError2("Invalid refinement card!");
        }
        const page = await target_card.endpoint.call(this.actions);
        return new Search2(this.actions, page, true);
      }
      get refinement_card_queries() {
        return this.refinement_cards.cards.map((card) => card.query);
      }
      async getContinuation() {
        const continuation = await this.getContinuationData();
        return new Search2(this.actions, continuation, true);
      }
    };
    module2.exports = Search2;
  }
});

// node_modules/axios/lib/helpers/bind.js
var require_bind = __commonJS({
  "node_modules/axios/lib/helpers/bind.js"(exports2, module2) {
    "use strict";
    module2.exports = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };
  }
});

// node_modules/axios/lib/utils.js
var require_utils = __commonJS({
  "node_modules/axios/lib/utils.js"(exports2, module2) {
    "use strict";
    var bind = require_bind();
    var toString = Object.prototype.toString;
    function isArray(val) {
      return toString.call(val) === "[object Array]";
    }
    function isUndefined(val) {
      return typeof val === "undefined";
    }
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
    }
    function isArrayBuffer(val) {
      return toString.call(val) === "[object ArrayBuffer]";
    }
    function isFormData(val) {
      return typeof FormData !== "undefined" && val instanceof FormData;
    }
    function isArrayBufferView(val) {
      var result;
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && val.buffer instanceof ArrayBuffer;
      }
      return result;
    }
    function isString(val) {
      return typeof val === "string";
    }
    function isNumber(val) {
      return typeof val === "number";
    }
    function isObject(val) {
      return val !== null && typeof val === "object";
    }
    function isPlainObject(val) {
      if (toString.call(val) !== "[object Object]") {
        return false;
      }
      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }
    function isDate(val) {
      return toString.call(val) === "[object Date]";
    }
    function isFile(val) {
      return toString.call(val) === "[object File]";
    }
    function isBlob(val) {
      return toString.call(val) === "[object Blob]";
    }
    function isFunction(val) {
      return toString.call(val) === "[object Function]";
    }
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
    }
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    }
    function isStandardBrowserEnv() {
      if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
        return false;
      }
      return typeof window !== "undefined" && typeof document !== "undefined";
    }
    function forEach(obj, fn) {
      if (obj === null || typeof obj === "undefined") {
        return;
      }
      if (typeof obj !== "object") {
        obj = [obj];
      }
      if (isArray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }
    function merge() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === "function") {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }
    function stripBOM(content) {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    }
    module2.exports = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isObject,
      isPlainObject,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isFunction,
      isStream,
      isURLSearchParams,
      isStandardBrowserEnv,
      forEach,
      merge,
      extend,
      trim,
      stripBOM
    };
  }
});

// node_modules/axios/lib/helpers/buildURL.js
var require_buildURL = __commonJS({
  "node_modules/axios/lib/helpers/buildURL.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    function encode(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    module2.exports = function buildURL(url, params, paramsSerializer) {
      if (!params) {
        return url;
      }
      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];
        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === "undefined") {
            return;
          }
          if (utils.isArray(val)) {
            key = key + "[]";
          } else {
            val = [val];
          }
          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + "=" + encode(v));
          });
        });
        serializedParams = parts.join("&");
      }
      if (serializedParams) {
        var hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
      }
      return url;
    };
  }
});

// node_modules/axios/lib/core/InterceptorManager.js
var require_InterceptorManager = __commonJS({
  "node_modules/axios/lib/core/InterceptorManager.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    function InterceptorManager() {
      this.handlers = [];
    }
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };
    module2.exports = InterceptorManager;
  }
});

// node_modules/axios/lib/helpers/normalizeHeaderName.js
var require_normalizeHeaderName = __commonJS({
  "node_modules/axios/lib/helpers/normalizeHeaderName.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };
  }
});

// node_modules/axios/lib/core/enhanceError.js
var require_enhanceError = __commonJS({
  "node_modules/axios/lib/core/enhanceError.js"(exports2, module2) {
    "use strict";
    module2.exports = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }
      error.request = request;
      error.response = response;
      error.isAxiosError = true;
      error.toJSON = function toJSON() {
        return {
          message: this.message,
          name: this.name,
          description: this.description,
          number: this.number,
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          config: this.config,
          code: this.code
        };
      };
      return error;
    };
  }
});

// node_modules/axios/lib/core/createError.js
var require_createError = __commonJS({
  "node_modules/axios/lib/core/createError.js"(exports2, module2) {
    "use strict";
    var enhanceError = require_enhanceError();
    module2.exports = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };
  }
});

// node_modules/axios/lib/core/settle.js
var require_settle = __commonJS({
  "node_modules/axios/lib/core/settle.js"(exports2, module2) {
    "use strict";
    var createError = require_createError();
    module2.exports = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError("Request failed with status code " + response.status, response.config, null, response.request, response));
      }
    };
  }
});

// node_modules/axios/lib/helpers/cookies.js
var require_cookies = __commonJS({
  "node_modules/axios/lib/helpers/cookies.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + "=" + encodeURIComponent(value));
          if (utils.isNumber(expires)) {
            cookie.push("expires=" + new Date(expires).toGMTString());
          }
          if (utils.isString(path)) {
            cookie.push("path=" + path);
          }
          if (utils.isString(domain)) {
            cookie.push("domain=" + domain);
          }
          if (secure === true) {
            cookie.push("secure");
          }
          document.cookie = cookie.join("; ");
        },
        read: function read(name) {
          var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      };
    }() : function nonStandardBrowserEnv() {
      return {
        write: function write() {
        },
        read: function read() {
          return null;
        },
        remove: function remove() {
        }
      };
    }();
  }
});

// node_modules/axios/lib/helpers/isAbsoluteURL.js
var require_isAbsoluteURL = __commonJS({
  "node_modules/axios/lib/helpers/isAbsoluteURL.js"(exports2, module2) {
    "use strict";
    module2.exports = function isAbsoluteURL(url) {
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };
  }
});

// node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS({
  "node_modules/axios/lib/helpers/combineURLs.js"(exports2, module2) {
    "use strict";
    module2.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    };
  }
});

// node_modules/axios/lib/core/buildFullPath.js
var require_buildFullPath = __commonJS({
  "node_modules/axios/lib/core/buildFullPath.js"(exports2, module2) {
    "use strict";
    var isAbsoluteURL = require_isAbsoluteURL();
    var combineURLs = require_combineURLs();
    module2.exports = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };
  }
});

// node_modules/axios/lib/helpers/parseHeaders.js
var require_parseHeaders = __commonJS({
  "node_modules/axios/lib/helpers/parseHeaders.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var ignoreDuplicateOf = [
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent"
    ];
    module2.exports = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;
      if (!headers) {
        return parsed;
      }
      utils.forEach(headers.split("\n"), function parser(line) {
        i = line.indexOf(":");
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));
        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === "set-cookie") {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        }
      });
      return parsed;
    };
  }
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var require_isURLSameOrigin = __commonJS({
  "node_modules/axios/lib/helpers/isURLSameOrigin.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement("a");
      var originURL;
      function resolveURL(url) {
        var href = url;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin(requestURL) {
        var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }() : function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    }();
  }
});

// node_modules/axios/lib/adapters/xhr.js
var require_xhr = __commonJS({
  "node_modules/axios/lib/adapters/xhr.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var settle = require_settle();
    var cookies = require_cookies();
    var buildURL = require_buildURL();
    var buildFullPath = require_buildFullPath();
    var parseHeaders = require_parseHeaders();
    var isURLSameOrigin = require_isURLSameOrigin();
    var createError = require_createError();
    module2.exports = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        if (utils.isFormData(requestData)) {
          delete requestHeaders["Content-Type"];
        }
        var request = new XMLHttpRequest();
        if (config.auth) {
          var username = config.auth.username || "";
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
          requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        request.timeout = config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };
          settle(resolve, reject, response);
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(createError("Request aborted", config, "ECONNABORTED", request));
          request = null;
        };
        request.onerror = function handleError() {
          reject(createError("Network Error", config, null, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = "timeout of " + config.timeout + "ms exceeded";
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError(timeoutErrorMessage, config, config.transitional && config.transitional.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED", request));
          request = null;
        };
        if (utils.isStandardBrowserEnv()) {
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }
        if ("setRequestHeader" in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
              delete requestHeaders[key];
            } else {
              request.setRequestHeader(key, val);
            }
          });
        }
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = config.responseType;
        }
        if (typeof config.onDownloadProgress === "function") {
          request.addEventListener("progress", config.onDownloadProgress);
        }
        if (typeof config.onUploadProgress === "function" && request.upload) {
          request.upload.addEventListener("progress", config.onUploadProgress);
        }
        if (config.cancelToken) {
          config.cancelToken.promise.then(function onCanceled(cancel) {
            if (!request) {
              return;
            }
            request.abort();
            reject(cancel);
            request = null;
          });
        }
        if (!requestData) {
          requestData = null;
        }
        request.send(requestData);
      });
    };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(() => {
    }, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return new Date().toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/follow-redirects/debug.js
var require_debug = __commonJS({
  "node_modules/follow-redirects/debug.js"(exports2, module2) {
    var debug;
    module2.exports = function() {
      if (!debug) {
        try {
          debug = require_src()("follow-redirects");
        } catch (error) {
        }
        if (typeof debug !== "function") {
          debug = function() {
          };
        }
      }
      debug.apply(null, arguments);
    };
  }
});

// node_modules/follow-redirects/index.js
var require_follow_redirects = __commonJS({
  "node_modules/follow-redirects/index.js"(exports2, module2) {
    var url = require("url");
    var URL2 = url.URL;
    var http = require("http");
    var https = require("https");
    var Writable = require("stream").Writable;
    var assert = require("assert");
    var debug = require_debug();
    var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
    var eventHandlers = /* @__PURE__ */ Object.create(null);
    events.forEach(function(event) {
      eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
      };
    });
    var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "Redirected request failed");
    var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded");
    var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
    var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
    function RedirectableRequest(options, responseCallback) {
      Writable.call(this);
      this._sanitizeOptions(options);
      this._options = options;
      this._ended = false;
      this._ending = false;
      this._redirectCount = 0;
      this._redirects = [];
      this._requestBodyLength = 0;
      this._requestBodyBuffers = [];
      if (responseCallback) {
        this.on("response", responseCallback);
      }
      var self2 = this;
      this._onNativeResponse = function(response) {
        self2._processResponse(response);
      };
      this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);
    RedirectableRequest.prototype.abort = function() {
      abortRequest(this._currentRequest);
      this.emit("abort");
    };
    RedirectableRequest.prototype.write = function(data, encoding, callback) {
      if (this._ending) {
        throw new WriteAfterEndError();
      }
      if (!(typeof data === "string" || typeof data === "object" && "length" in data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
      }
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = null;
      }
      if (data.length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({ data, encoding });
        this._currentRequest.write(data, encoding, callback);
      } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
      }
    };
    RedirectableRequest.prototype.end = function(data, encoding, callback) {
      if (typeof data === "function") {
        callback = data;
        data = encoding = null;
      } else if (typeof encoding === "function") {
        callback = encoding;
        encoding = null;
      }
      if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
      } else {
        var self2 = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function() {
          self2._ended = true;
          currentRequest.end(null, null, callback);
        });
        this._ending = true;
      }
    };
    RedirectableRequest.prototype.setHeader = function(name, value) {
      this._options.headers[name] = value;
      this._currentRequest.setHeader(name, value);
    };
    RedirectableRequest.prototype.removeHeader = function(name) {
      delete this._options.headers[name];
      this._currentRequest.removeHeader(name);
    };
    RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
      var self2 = this;
      function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
      }
      function startTimer(socket) {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
        }
        self2._timeout = setTimeout(function() {
          self2.emit("timeout");
          clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
      }
      function clearTimer() {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
          self2._timeout = null;
        }
        self2.removeListener("abort", clearTimer);
        self2.removeListener("error", clearTimer);
        self2.removeListener("response", clearTimer);
        if (callback) {
          self2.removeListener("timeout", callback);
        }
        if (!self2.socket) {
          self2._currentRequest.removeListener("socket", startTimer);
        }
      }
      if (callback) {
        this.on("timeout", callback);
      }
      if (this.socket) {
        startTimer(this.socket);
      } else {
        this._currentRequest.once("socket", startTimer);
      }
      this.on("socket", destroyOnTimeout);
      this.on("abort", clearTimer);
      this.on("error", clearTimer);
      this.on("response", clearTimer);
      return this;
    };
    [
      "flushHeaders",
      "getHeader",
      "setNoDelay",
      "setSocketKeepAlive"
    ].forEach(function(method) {
      RedirectableRequest.prototype[method] = function(a, b) {
        return this._currentRequest[method](a, b);
      };
    });
    ["aborted", "connection", "socket"].forEach(function(property) {
      Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function() {
          return this._currentRequest[property];
        }
      });
    });
    RedirectableRequest.prototype._sanitizeOptions = function(options) {
      if (!options.headers) {
        options.headers = {};
      }
      if (options.host) {
        if (!options.hostname) {
          options.hostname = options.host;
        }
        delete options.host;
      }
      if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
          options.pathname = options.path;
        } else {
          options.pathname = options.path.substring(0, searchPos);
          options.search = options.path.substring(searchPos);
        }
      }
    };
    RedirectableRequest.prototype._performRequest = function() {
      var protocol = this._options.protocol;
      var nativeProtocol = this._options.nativeProtocols[protocol];
      if (!nativeProtocol) {
        this.emit("error", new TypeError("Unsupported protocol " + protocol));
        return;
      }
      if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
      }
      var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
      request._redirectable = this;
      for (var event of events) {
        request.on(event, eventHandlers[event]);
      }
      this._currentUrl = /^\//.test(this._options.path) ? url.format(this._options) : this._currentUrl = this._options.path;
      if (this._isRedirect) {
        var i = 0;
        var self2 = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
          if (request === self2._currentRequest) {
            if (error) {
              self2.emit("error", error);
            } else if (i < buffers.length) {
              var buffer = buffers[i++];
              if (!request.finished) {
                request.write(buffer.data, buffer.encoding, writeNext);
              }
            } else if (self2._ended) {
              request.end();
            }
          }
        })();
      }
    };
    RedirectableRequest.prototype._processResponse = function(response) {
      var statusCode = response.statusCode;
      if (this._options.trackRedirects) {
        this._redirects.push({
          url: this._currentUrl,
          headers: response.headers,
          statusCode
        });
      }
      var location = response.headers.location;
      if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        this._requestBodyBuffers = [];
        return;
      }
      abortRequest(this._currentRequest);
      response.destroy();
      if (++this._redirectCount > this._options.maxRedirects) {
        this.emit("error", new TooManyRedirectsError());
        return;
      }
      var requestHeaders;
      var beforeRedirect = this._options.beforeRedirect;
      if (beforeRedirect) {
        requestHeaders = Object.assign({
          Host: response.req.getHeader("host")
        }, this._options.headers);
      }
      var method = this._options.method;
      if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }
      var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
      var currentUrlParts = url.parse(this._currentUrl);
      var currentHost = currentHostHeader || currentUrlParts.host;
      var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url.format(Object.assign(currentUrlParts, { host: currentHost }));
      var redirectUrl;
      try {
        redirectUrl = url.resolve(currentUrl, location);
      } catch (cause) {
        this.emit("error", new RedirectionError(cause));
        return;
      }
      debug("redirecting to", redirectUrl);
      this._isRedirect = true;
      var redirectUrlParts = url.parse(redirectUrl);
      Object.assign(this._options, redirectUrlParts);
      if (redirectUrlParts.protocol !== currentUrlParts.protocol && redirectUrlParts.protocol !== "https:" || redirectUrlParts.host !== currentHost && !isSubdomain(redirectUrlParts.host, currentHost)) {
        removeMatchingHeaders(/^(?:authorization|cookie)$/i, this._options.headers);
      }
      if (typeof beforeRedirect === "function") {
        var responseDetails = {
          headers: response.headers,
          statusCode
        };
        var requestDetails = {
          url: currentUrl,
          method,
          headers: requestHeaders
        };
        try {
          beforeRedirect(this._options, responseDetails, requestDetails);
        } catch (err) {
          this.emit("error", err);
          return;
        }
        this._sanitizeOptions(this._options);
      }
      try {
        this._performRequest();
      } catch (cause) {
        this.emit("error", new RedirectionError(cause));
      }
    };
    function wrap(protocols) {
      var exports3 = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024
      };
      var nativeProtocols = {};
      Object.keys(protocols).forEach(function(scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports3[scheme] = Object.create(nativeProtocol);
        function request(input, options, callback) {
          if (typeof input === "string") {
            var urlStr = input;
            try {
              input = urlToOptions(new URL2(urlStr));
            } catch (err) {
              input = url.parse(urlStr);
            }
          } else if (URL2 && input instanceof URL2) {
            input = urlToOptions(input);
          } else {
            callback = options;
            options = input;
            input = { protocol };
          }
          if (typeof options === "function") {
            callback = options;
            options = null;
          }
          options = Object.assign({
            maxRedirects: exports3.maxRedirects,
            maxBodyLength: exports3.maxBodyLength
          }, input, options);
          options.nativeProtocols = nativeProtocols;
          assert.equal(options.protocol, protocol, "protocol mismatch");
          debug("options", options);
          return new RedirectableRequest(options, callback);
        }
        function get(input, options, callback) {
          var wrappedRequest = wrappedProtocol.request(input, options, callback);
          wrappedRequest.end();
          return wrappedRequest;
        }
        Object.defineProperties(wrappedProtocol, {
          request: { value: request, configurable: true, enumerable: true, writable: true },
          get: { value: get, configurable: true, enumerable: true, writable: true }
        });
      });
      return exports3;
    }
    function noop() {
    }
    function urlToOptions(urlObject) {
      var options = {
        protocol: urlObject.protocol,
        hostname: urlObject.hostname.startsWith("[") ? urlObject.hostname.slice(1, -1) : urlObject.hostname,
        hash: urlObject.hash,
        search: urlObject.search,
        pathname: urlObject.pathname,
        path: urlObject.pathname + urlObject.search,
        href: urlObject.href
      };
      if (urlObject.port !== "") {
        options.port = Number(urlObject.port);
      }
      return options;
    }
    function removeMatchingHeaders(regex, headers) {
      var lastValue;
      for (var header in headers) {
        if (regex.test(header)) {
          lastValue = headers[header];
          delete headers[header];
        }
      }
      return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
    }
    function createErrorType(code, defaultMessage) {
      function CustomError(cause) {
        Error.captureStackTrace(this, this.constructor);
        if (!cause) {
          this.message = defaultMessage;
        } else {
          this.message = defaultMessage + ": " + cause.message;
          this.cause = cause;
        }
      }
      CustomError.prototype = new Error();
      CustomError.prototype.constructor = CustomError;
      CustomError.prototype.name = "Error [" + code + "]";
      CustomError.prototype.code = code;
      return CustomError;
    }
    function abortRequest(request) {
      for (var event of events) {
        request.removeListener(event, eventHandlers[event]);
      }
      request.on("error", noop);
      request.abort();
    }
    function isSubdomain(subdomain, domain) {
      const dot = subdomain.length - domain.length - 1;
      return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
    }
    module2.exports = wrap({ http, https });
    module2.exports.wrap = wrap;
  }
});

// node_modules/axios/package.json
var require_package2 = __commonJS({
  "node_modules/axios/package.json"(exports2, module2) {
    module2.exports = {
      name: "axios",
      version: "0.21.4",
      description: "Promise based HTTP client for the browser and node.js",
      main: "index.js",
      scripts: {
        test: "grunt test",
        start: "node ./sandbox/server.js",
        build: "NODE_ENV=production grunt build",
        preversion: "npm test",
        version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
        postversion: "git push && git push --tags",
        examples: "node ./examples/server.js",
        coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
        fix: "eslint --fix lib/**/*.js"
      },
      repository: {
        type: "git",
        url: "https://github.com/axios/axios.git"
      },
      keywords: [
        "xhr",
        "http",
        "ajax",
        "promise",
        "node"
      ],
      author: "Matt Zabriskie",
      license: "MIT",
      bugs: {
        url: "https://github.com/axios/axios/issues"
      },
      homepage: "https://axios-http.com",
      devDependencies: {
        coveralls: "^3.0.0",
        "es6-promise": "^4.2.4",
        grunt: "^1.3.0",
        "grunt-banner": "^0.6.0",
        "grunt-cli": "^1.2.0",
        "grunt-contrib-clean": "^1.1.0",
        "grunt-contrib-watch": "^1.0.0",
        "grunt-eslint": "^23.0.0",
        "grunt-karma": "^4.0.0",
        "grunt-mocha-test": "^0.13.3",
        "grunt-ts": "^6.0.0-beta.19",
        "grunt-webpack": "^4.0.2",
        "istanbul-instrumenter-loader": "^1.0.0",
        "jasmine-core": "^2.4.1",
        karma: "^6.3.2",
        "karma-chrome-launcher": "^3.1.0",
        "karma-firefox-launcher": "^2.1.0",
        "karma-jasmine": "^1.1.1",
        "karma-jasmine-ajax": "^0.1.13",
        "karma-safari-launcher": "^1.0.0",
        "karma-sauce-launcher": "^4.3.6",
        "karma-sinon": "^1.0.5",
        "karma-sourcemap-loader": "^0.3.8",
        "karma-webpack": "^4.0.2",
        "load-grunt-tasks": "^3.5.2",
        minimist: "^1.2.0",
        mocha: "^8.2.1",
        sinon: "^4.5.0",
        "terser-webpack-plugin": "^4.2.3",
        typescript: "^4.0.5",
        "url-search-params": "^0.10.0",
        webpack: "^4.44.2",
        "webpack-dev-server": "^3.11.0"
      },
      browser: {
        "./lib/adapters/http.js": "./lib/adapters/xhr.js"
      },
      jsdelivr: "dist/axios.min.js",
      unpkg: "dist/axios.min.js",
      typings: "./index.d.ts",
      dependencies: {
        "follow-redirects": "^1.14.0"
      },
      bundlesize: [
        {
          path: "./dist/axios.min.js",
          threshold: "5kB"
        }
      ]
    };
  }
});

// node_modules/axios/lib/adapters/http.js
var require_http = __commonJS({
  "node_modules/axios/lib/adapters/http.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var settle = require_settle();
    var buildFullPath = require_buildFullPath();
    var buildURL = require_buildURL();
    var http = require("http");
    var https = require("https");
    var httpFollow = require_follow_redirects().http;
    var httpsFollow = require_follow_redirects().https;
    var url = require("url");
    var zlib = require("zlib");
    var pkg = require_package2();
    var createError = require_createError();
    var enhanceError = require_enhanceError();
    var isHttps = /https:?/;
    function setProxy(options, proxy, location) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.port = proxy.port;
      options.path = location;
      if (proxy.auth) {
        var base64 = Buffer.from(proxy.auth.username + ":" + proxy.auth.password, "utf8").toString("base64");
        options.headers["Proxy-Authorization"] = "Basic " + base64;
      }
      options.beforeRedirect = function beforeRedirect(redirection) {
        redirection.headers.host = redirection.host;
        setProxy(redirection, proxy, redirection.href);
      };
    }
    module2.exports = function httpAdapter(config) {
      return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
        var resolve = function resolve2(value) {
          resolvePromise(value);
        };
        var reject = function reject2(value) {
          rejectPromise(value);
        };
        var data = config.data;
        var headers = config.headers;
        if ("User-Agent" in headers || "user-agent" in headers) {
          if (!headers["User-Agent"] && !headers["user-agent"]) {
            delete headers["User-Agent"];
            delete headers["user-agent"];
          }
        } else {
          headers["User-Agent"] = "axios/" + pkg.version;
        }
        if (data && !utils.isStream(data)) {
          if (Buffer.isBuffer(data)) {
          } else if (utils.isArrayBuffer(data)) {
            data = Buffer.from(new Uint8Array(data));
          } else if (utils.isString(data)) {
            data = Buffer.from(data, "utf-8");
          } else {
            return reject(createError("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", config));
          }
          headers["Content-Length"] = data.length;
        }
        var auth = void 0;
        if (config.auth) {
          var username = config.auth.username || "";
          var password = config.auth.password || "";
          auth = username + ":" + password;
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        var parsed = url.parse(fullPath);
        var protocol = parsed.protocol || "http:";
        if (!auth && parsed.auth) {
          var urlAuth = parsed.auth.split(":");
          var urlUsername = urlAuth[0] || "";
          var urlPassword = urlAuth[1] || "";
          auth = urlUsername + ":" + urlPassword;
        }
        if (auth) {
          delete headers.Authorization;
        }
        var isHttpsRequest = isHttps.test(protocol);
        var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
        var options = {
          path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ""),
          method: config.method.toUpperCase(),
          headers,
          agent,
          agents: { http: config.httpAgent, https: config.httpsAgent },
          auth
        };
        if (config.socketPath) {
          options.socketPath = config.socketPath;
        } else {
          options.hostname = parsed.hostname;
          options.port = parsed.port;
        }
        var proxy = config.proxy;
        if (!proxy && proxy !== false) {
          var proxyEnv = protocol.slice(0, -1) + "_proxy";
          var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
          if (proxyUrl) {
            var parsedProxyUrl = url.parse(proxyUrl);
            var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
            var shouldProxy = true;
            if (noProxyEnv) {
              var noProxy = noProxyEnv.split(",").map(function trim(s) {
                return s.trim();
              });
              shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
                if (!proxyElement) {
                  return false;
                }
                if (proxyElement === "*") {
                  return true;
                }
                if (proxyElement[0] === "." && parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
                  return true;
                }
                return parsed.hostname === proxyElement;
              });
            }
            if (shouldProxy) {
              proxy = {
                host: parsedProxyUrl.hostname,
                port: parsedProxyUrl.port,
                protocol: parsedProxyUrl.protocol
              };
              if (parsedProxyUrl.auth) {
                var proxyUrlAuth = parsedProxyUrl.auth.split(":");
                proxy.auth = {
                  username: proxyUrlAuth[0],
                  password: proxyUrlAuth[1]
                };
              }
            }
          }
        }
        if (proxy) {
          options.headers.host = parsed.hostname + (parsed.port ? ":" + parsed.port : "");
          setProxy(options, proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
        }
        var transport;
        var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
        if (config.transport) {
          transport = config.transport;
        } else if (config.maxRedirects === 0) {
          transport = isHttpsProxy ? https : http;
        } else {
          if (config.maxRedirects) {
            options.maxRedirects = config.maxRedirects;
          }
          transport = isHttpsProxy ? httpsFollow : httpFollow;
        }
        if (config.maxBodyLength > -1) {
          options.maxBodyLength = config.maxBodyLength;
        }
        var req = transport.request(options, function handleResponse(res) {
          if (req.aborted)
            return;
          var stream = res;
          var lastRequest = res.req || req;
          if (res.statusCode !== 204 && lastRequest.method !== "HEAD" && config.decompress !== false) {
            switch (res.headers["content-encoding"]) {
              case "gzip":
              case "compress":
              case "deflate":
                stream = stream.pipe(zlib.createUnzip());
                delete res.headers["content-encoding"];
                break;
            }
          }
          var response = {
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            config,
            request: lastRequest
          };
          if (config.responseType === "stream") {
            response.data = stream;
            settle(resolve, reject, response);
          } else {
            var responseBuffer = [];
            var totalResponseBytes = 0;
            stream.on("data", function handleStreamData(chunk) {
              responseBuffer.push(chunk);
              totalResponseBytes += chunk.length;
              if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
                stream.destroy();
                reject(createError("maxContentLength size of " + config.maxContentLength + " exceeded", config, null, lastRequest));
              }
            });
            stream.on("error", function handleStreamError(err) {
              if (req.aborted)
                return;
              reject(enhanceError(err, config, null, lastRequest));
            });
            stream.on("end", function handleStreamEnd() {
              var responseData = Buffer.concat(responseBuffer);
              if (config.responseType !== "arraybuffer") {
                responseData = responseData.toString(config.responseEncoding);
                if (!config.responseEncoding || config.responseEncoding === "utf8") {
                  responseData = utils.stripBOM(responseData);
                }
              }
              response.data = responseData;
              settle(resolve, reject, response);
            });
          }
        });
        req.on("error", function handleRequestError(err) {
          if (req.aborted && err.code !== "ERR_FR_TOO_MANY_REDIRECTS")
            return;
          reject(enhanceError(err, config, null, req));
        });
        if (config.timeout) {
          var timeout = parseInt(config.timeout, 10);
          if (isNaN(timeout)) {
            reject(createError("error trying to parse `config.timeout` to int", config, "ERR_PARSE_TIMEOUT", req));
            return;
          }
          req.setTimeout(timeout, function handleRequestTimeout() {
            req.abort();
            reject(createError("timeout of " + timeout + "ms exceeded", config, config.transitional && config.transitional.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED", req));
          });
        }
        if (config.cancelToken) {
          config.cancelToken.promise.then(function onCanceled(cancel) {
            if (req.aborted)
              return;
            req.abort();
            reject(cancel);
          });
        }
        if (utils.isStream(data)) {
          data.on("error", function handleStreamError(err) {
            reject(enhanceError(err, config, null, req));
          }).pipe(req);
        } else {
          req.end(data);
        }
      });
    };
  }
});

// node_modules/axios/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/axios/lib/defaults.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var normalizeHeaderName = require_normalizeHeaderName();
    var enhanceError = require_enhanceError();
    var DEFAULT_CONTENT_TYPE = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
        headers["Content-Type"] = value;
      }
    }
    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== "undefined") {
        adapter = require_xhr();
      } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
        adapter = require_http();
      }
      return adapter;
    }
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== "SyntaxError") {
            throw e;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
    }
    var defaults = {
      transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
      },
      adapter: getDefaultAdapter(),
      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, "Accept");
        normalizeHeaderName(headers, "Content-Type");
        if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
          return data.toString();
        }
        if (utils.isObject(data) || headers && headers["Content-Type"] === "application/json") {
          setContentTypeIfUnset(headers, "application/json");
          return stringifySafely(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
        if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw enhanceError(e, this, "E_JSON_PARSE");
              }
              throw e;
            }
          }
        }
        return data;
      }],
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      }
    };
    defaults.headers = {
      common: {
        "Accept": "application/json, text/plain, */*"
      }
    };
    utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    module2.exports = defaults;
  }
});

// node_modules/axios/lib/core/transformData.js
var require_transformData = __commonJS({
  "node_modules/axios/lib/core/transformData.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var defaults = require_defaults();
    module2.exports = function transformData(data, headers, fns) {
      var context = this || defaults;
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });
      return data;
    };
  }
});

// node_modules/axios/lib/cancel/isCancel.js
var require_isCancel = __commonJS({
  "node_modules/axios/lib/cancel/isCancel.js"(exports2, module2) {
    "use strict";
    module2.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };
  }
});

// node_modules/axios/lib/core/dispatchRequest.js
var require_dispatchRequest = __commonJS({
  "node_modules/axios/lib/core/dispatchRequest.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var transformData = require_transformData();
    var isCancel = require_isCancel();
    var defaults = require_defaults();
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
    }
    module2.exports = function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = config.headers || {};
      config.data = transformData.call(config, config.data, config.headers, config.transformRequest);
      config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
      utils.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function cleanHeaderConfig(method) {
        delete config.headers[method];
      });
      var adapter = config.adapter || defaults.adapter;
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData.call(config, response.data, response.headers, config.transformResponse);
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData.call(config, reason.response.data, reason.response.headers, config.transformResponse);
          }
        }
        return Promise.reject(reason);
      });
    };
  }
});

// node_modules/axios/lib/core/mergeConfig.js
var require_mergeConfig = __commonJS({
  "node_modules/axios/lib/core/mergeConfig.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = function mergeConfig(config1, config2) {
      config2 = config2 || {};
      var config = {};
      var valueFromConfig2Keys = ["url", "method", "data"];
      var mergeDeepPropertiesKeys = ["headers", "auth", "proxy", "params"];
      var defaultToConfig2Keys = [
        "baseURL",
        "transformRequest",
        "transformResponse",
        "paramsSerializer",
        "timeout",
        "timeoutMessage",
        "withCredentials",
        "adapter",
        "responseType",
        "xsrfCookieName",
        "xsrfHeaderName",
        "onUploadProgress",
        "onDownloadProgress",
        "decompress",
        "maxContentLength",
        "maxBodyLength",
        "maxRedirects",
        "transport",
        "httpAgent",
        "httpsAgent",
        "cancelToken",
        "socketPath",
        "responseEncoding"
      ];
      var directMergeKeys = ["validateStatus"];
      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(void 0, config1[prop]);
        }
      }
      utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(void 0, config2[prop]);
        }
      });
      utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
      utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(void 0, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(void 0, config1[prop]);
        }
      });
      utils.forEach(directMergeKeys, function merge(prop) {
        if (prop in config2) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          config[prop] = getMergedValue(void 0, config1[prop]);
        }
      });
      var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
      var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
        return axiosKeys.indexOf(key) === -1;
      });
      utils.forEach(otherKeys, mergeDeepProperties);
      return config;
    };
  }
});

// node_modules/axios/lib/helpers/validator.js
var require_validator = __commonJS({
  "node_modules/axios/lib/helpers/validator.js"(exports2, module2) {
    "use strict";
    var pkg = require_package2();
    var validators = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
      validators[type] = function validator(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
      };
    });
    var deprecatedWarnings = {};
    var currentVerArr = pkg.version.split(".");
    function isOlderVersion(version, thanVersion) {
      var pkgVersionArr = thanVersion ? thanVersion.split(".") : currentVerArr;
      var destVer = version.split(".");
      for (var i = 0; i < 3; i++) {
        if (pkgVersionArr[i] > destVer[i]) {
          return true;
        } else if (pkgVersionArr[i] < destVer[i]) {
          return false;
        }
      }
      return false;
    }
    validators.transitional = function transitional(validator, version, message) {
      var isDeprecated = version && isOlderVersion(version);
      function formatMessage(opt, desc) {
        return "[Axios v" + pkg.version + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return function(value, opt, opts) {
        if (validator === false) {
          throw new Error(formatMessage(opt, " has been removed in " + version));
        }
        if (isDeprecated && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
        }
        return validator ? validator(value, opt, opts) : true;
      };
    };
    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== "object") {
        throw new TypeError("options must be an object");
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === void 0 || validator(value, opt, options);
          if (result !== true) {
            throw new TypeError("option " + opt + " must be " + result);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw Error("Unknown option " + opt);
        }
      }
    }
    module2.exports = {
      isOlderVersion,
      assertOptions,
      validators
    };
  }
});

// node_modules/axios/lib/core/Axios.js
var require_Axios = __commonJS({
  "node_modules/axios/lib/core/Axios.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var buildURL = require_buildURL();
    var InterceptorManager = require_InterceptorManager();
    var dispatchRequest = require_dispatchRequest();
    var mergeConfig = require_mergeConfig();
    var validator = require_validator();
    var validators = validator.validators;
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    Axios.prototype.request = function request(config) {
      if (typeof config === "string") {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }
      config = mergeConfig(this.defaults, config);
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = "get";
      }
      var transitional = config.transitional;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean, "1.0.0"),
          forcedJSONParsing: validators.transitional(validators.boolean, "1.0.0"),
          clarifyTimeoutError: validators.transitional(validators.boolean, "1.0.0")
        }, false);
      }
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      var promise;
      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, void 0];
        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);
        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
      }
      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }
      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }
      return promise;
    };
    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
    };
    utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      Axios.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data
        }));
      };
    });
    module2.exports = Axios;
  }
});

// node_modules/axios/lib/cancel/Cancel.js
var require_Cancel = __commonJS({
  "node_modules/axios/lib/cancel/Cancel.js"(exports2, module2) {
    "use strict";
    function Cancel(message) {
      this.message = message;
    }
    Cancel.prototype.toString = function toString() {
      return "Cancel" + (this.message ? ": " + this.message : "");
    };
    Cancel.prototype.__CANCEL__ = true;
    module2.exports = Cancel;
  }
});

// node_modules/axios/lib/cancel/CancelToken.js
var require_CancelToken = __commonJS({
  "node_modules/axios/lib/cancel/CancelToken.js"(exports2, module2) {
    "use strict";
    var Cancel = require_Cancel();
    function CancelToken(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;
      executor(function cancel(message) {
        if (token.reason) {
          return;
        }
        token.reason = new Cancel(message);
        resolvePromise(token.reason);
      });
    }
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    };
    module2.exports = CancelToken;
  }
});

// node_modules/axios/lib/helpers/spread.js
var require_spread = __commonJS({
  "node_modules/axios/lib/helpers/spread.js"(exports2, module2) {
    "use strict";
    module2.exports = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
  }
});

// node_modules/axios/lib/helpers/isAxiosError.js
var require_isAxiosError = __commonJS({
  "node_modules/axios/lib/helpers/isAxiosError.js"(exports2, module2) {
    "use strict";
    module2.exports = function isAxiosError(payload) {
      return typeof payload === "object" && payload.isAxiosError === true;
    };
  }
});

// node_modules/axios/lib/axios.js
var require_axios = __commonJS({
  "node_modules/axios/lib/axios.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var bind = require_bind();
    var Axios = require_Axios();
    var mergeConfig = require_mergeConfig();
    var defaults = require_defaults();
    function createInstance(defaultConfig) {
      var context = new Axios(defaultConfig);
      var instance = bind(Axios.prototype.request, context);
      utils.extend(instance, Axios.prototype, context);
      utils.extend(instance, context);
      return instance;
    }
    var axios = createInstance(defaults);
    axios.Axios = Axios;
    axios.create = function create(instanceConfig) {
      return createInstance(mergeConfig(axios.defaults, instanceConfig));
    };
    axios.Cancel = require_Cancel();
    axios.CancelToken = require_CancelToken();
    axios.isCancel = require_isCancel();
    axios.all = function all(promises) {
      return Promise.all(promises);
    };
    axios.spread = require_spread();
    axios.isAxiosError = require_isAxiosError();
    module2.exports = axios;
    module2.exports.default = axios;
  }
});

// node_modules/axios/index.js
var require_axios2 = __commonJS({
  "node_modules/axios/index.js"(exports2, module2) {
    module2.exports = require_axios();
  }
});

// lib/parser/youtube/LiveChat.js
var require_LiveChat2 = __commonJS({
  "lib/parser/youtube/LiveChat.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var EventEmitter2 = require("events");
    var LiveChat = class {
      ev;
      #actions;
      #video_info;
      #continuation;
      #mcontinuation;
      #lc_polling_interval_ms = 1e3;
      #md_polling_interval_ms = 5e3;
      initial_info;
      live_metadata;
      running = false;
      is_replay = false;
      constructor(video_info) {
        this.#video_info = video_info;
        this.#actions = video_info.actions;
        this.#continuation = this.#video_info.livechat.continuation;
        this.is_replay = this.#video_info.livechat.is_replay;
        this.live_metadata = {
          title: null,
          description: null,
          views: null,
          likes: null,
          date: null
        };
        this.ev = new EventEmitter2();
      }
      start() {
        if (!this.running) {
          this.running = true;
          this.#pollLivechat();
          this.#pollMetadata();
        }
      }
      stop() {
        this.running = false;
      }
      #pollLivechat() {
        const lc_poller = setTimeout(() => {
          (async () => {
            const endpoint = this.is_replay ? "live_chat/get_live_chat_replay" : "live_chat/get_live_chat";
            const response = await this.#actions.livechat(endpoint, { ctoken: this.#continuation });
            const data = Parser.parseResponse(response.data);
            const contents = data.continuation_contents;
            this.#continuation = contents.continuation.token;
            this.#lc_polling_interval_ms = contents.continuation.timeout_ms;
            if (contents.header) {
              this.initial_info = contents;
              this.ev.emit("start", contents);
            } else {
              await this.#emitSmoothedActions(contents.actions);
            }
            clearTimeout(lc_poller);
            this.running && this.#pollLivechat();
          })().catch((err) => Promise.reject(err));
        }, this.#lc_polling_interval_ms);
      }
      async #emitSmoothedActions(actions) {
        const base = 1e4;
        let delay = actions.length < base / 80 ? 1 : 0;
        const emit_delay_ms = delay == 1 ? (delay = base / actions.length, delay *= Math.random() + 0.5, delay = Math.min(1e3, delay), delay = Math.max(80, delay)) : delay = 80;
        for (const action of actions) {
          await this.#wait(emit_delay_ms);
          this.ev.emit("chat-update", action);
        }
      }
      #pollMetadata() {
        const md_poller = setTimeout(() => {
          (async () => {
            const payload = { video_id: this.#video_info.basic_info.id };
            if (this.#mcontinuation) {
              payload.ctoken = this.#mcontinuation;
            }
            const response = await this.#actions.livechat("updated_metadata", payload);
            const data = Parser.parseResponse(response.data);
            this.#mcontinuation = data.continuation.token;
            this.#md_polling_interval_ms = data.continuation.timeout_ms;
            this.metadata = {
              title: data.actions.get({ type: "UpdateTitleAction" }) || this.metadata?.title,
              description: data.actions.get({ type: "UpdateDescriptionAction" }) || this.metadata?.description,
              views: data.actions.get({ type: "UpdateViewershipAction" }) || this.metadata?.views,
              likes: data.actions.get({ type: "UpdateToggleButtonTextAction" }) || this.metadata?.likes,
              date: data.actions.get({ type: "UpdateDateTextAction" }) || this.metadata?.date
            };
            this.ev.emit("metadata-update", this.metadata);
            clearTimeout(md_poller);
            this.running && this.#pollMetadata();
          })().catch((err) => Promise.reject(err));
        }, this.#md_polling_interval_ms);
      }
      async sendMessage(text) {
        const response = await this.#actions.livechat("live_chat/send_message", {
          text,
          ...{
            video_id: this.#video_info.basic_info.id,
            channel_id: this.#video_info.basic_info.channel_id
          }
        });
        const data = Parser.parseResponse(response.data);
        return data.actions;
      }
      async #wait(ms) {
        return new Promise((resolve) => setTimeout(() => resolve(), ms));
      }
    };
    module2.exports = LiveChat;
  }
});

// lib/parser/youtube/VideoInfo.js
var require_VideoInfo = __commonJS({
  "lib/parser/youtube/VideoInfo.js"(exports2, module2) {
    "use strict";
    var { InnertubeError: InnertubeError2 } = require_Utils();
    var { PassThrough: PassThrough2, Readable } = false ? null : require("stream");
    var Axios = require_axios2();
    var Parser = require_contents();
    var LiveChat = require_LiveChat2();
    var Constants = require_Constants();
    var CancelToken = Axios.CancelToken;
    var VideoInfo2 = class {
      #page;
      #actions;
      #player;
      #cpn;
      #watch_next_continuation;
      constructor(data, actions, player, cpn) {
        this.#actions = actions;
        this.#player = player;
        this.#cpn = cpn;
        const info = Parser.parseResponse(data[0]);
        const next = Parser.parseResponse(data[1].data || {});
        this.#page = [info, next];
        if (info.playability_status.status === "ERROR")
          throw new InnertubeError2("This video is unavailable", info.playability_status);
        this.basic_info = {
          ...info.video_details,
          ...{
            embed: info.microformat.embed,
            channel: info.microformat.channel,
            is_unlisted: info.microformat.is_unlisted,
            is_family_safe: info.microformat.is_family_safe,
            has_ypc_metadata: info.microformat.has_ypc_metadata
          }
        };
        this.streaming_data = info.streaming_data || null;
        this.playability_status = info.playability_status;
        this.annotations = info.annotations;
        this.storyboards = info.storyboards;
        this.endscreen = info.endscreen;
        this.captions = info.captions;
        this.cards = info.cards;
        const results = next.contents?.results;
        const secondary_results = next.contents?.secondary_results;
        if (results && secondary_results) {
          this.primary_info = results.get({ type: "VideoPrimaryInfo" });
          this.secondary_info = results.get({ type: "VideoSecondaryInfo" });
          this.merchandise = results?.get({ type: "MerchandiseShelf" }) || null;
          this.related_chip_cloud = secondary_results?.get({ type: "RelatedChipCloud" })?.content;
          this.watch_next_feed = secondary_results?.get({ type: "ItemSection" })?.contents;
          this.#watch_next_continuation = this.watch_next_feed?.pop();
          this.player_overlays = next.player_overlays;
          this.basic_info.like_count = this.primary_info.menu.top_level_buttons.get({ icon_type: "LIKE" }).like_count;
          this.basic_info.is_liked = this.primary_info.menu.top_level_buttons.get({ icon_type: "LIKE" }).is_toggled;
          this.basic_info.is_disliked = this.primary_info.menu.top_level_buttons.get({ icon_type: "DISLIKE" }).is_toggled;
          const comments_entry_point = results.get({ target_id: "comments-entry-point" });
          this.comments_entry_point_header = comments_entry_point?.contents.get({ type: "CommentsEntryPointHeader" }) || null;
          this.livechat = next.contents_memo.get("LiveChat")?.[0] || null;
        }
      }
      async selectFilter(name) {
        if (!this.filters.includes(name))
          throw new InnertubeError2("Invalid filter", { available_filters: this.filters });
        const filter = this.related_chip_cloud.chips.get({ text: name });
        if (filter.is_selected)
          return this;
        const response = await filter.endpoint.call(this.#actions);
        const data = response.on_response_received_endpoints.get({ target_id: "watch-next-feed" });
        this.watch_next_feed = data.contents;
        return this;
      }
      async getWatchNextContinuation() {
        const response = await this.#watch_next_continuation.endpoint.call(this.#actions);
        const data = response.on_response_received_endpoints.get({ type: "appendContinuationItemsAction" });
        this.watch_next_feed = data.contents;
        this.#watch_next_continuation = this.watch_next_feed.pop();
        return this.watch_next_feed;
      }
      async like() {
        const button = this.primary_info.menu.top_level_buttons.get({ button_id: "TOGGLE_BUTTON_ID_TYPE_LIKE" });
        if (button.is_toggled)
          throw new InnertubeError2("This video is already liked", { video_id: this.basic_info.id });
        const response = await button.endpoint.call(this.#actions);
        return response;
      }
      async dislike() {
        const button = this.primary_info.menu.top_level_buttons.get({ button_id: "TOGGLE_BUTTON_ID_TYPE_DISLIKE" });
        if (button.is_toggled)
          throw new InnertubeError2("This video is already disliked", { video_id: this.basic_info.id });
        const response = await button.endpoint.call(this.#actions);
        return response;
      }
      async removeLike() {
        const button = this.primary_info.menu.top_level_buttons.get({ is_toggled: true });
        if (!button)
          throw new InnertubeError2("This video is not liked/disliked", { video_id: this.basic_info.id });
        const response = await button.toggled_endpoint.call(this.#actions);
        return response;
      }
      async getLiveChat(mode) {
        if (!this.livechat)
          throw new InnertubeError2("Live Chat is not available", { video_id: this.id });
        return new LiveChat(this, mode);
      }
      get filters() {
        return this.related_chip_cloud?.chips.map((chip) => chip.text.toString()) || [];
      }
      get actions() {
        return this.#actions;
      }
      get page() {
        return this.#page;
      }
      get music_tracks() {
        const metadata = this.secondary_info.metadata;
        if (!metadata)
          return [];
        const songs = [];
        let current_song = {};
        let is_music_section = false;
        for (let i = 0; i < metadata.rows.length; i++) {
          const row = metadata.rows[i];
          if (row.type === "MetadataRowHeader") {
            if (row.content.toString().toLowerCase().startsWith("music")) {
              is_music_section = true;
              i++;
            }
            continue;
          }
          if (!is_music_section)
            continue;
          current_song[row.title.toString().toLowerCase().replace(/ /g, "_")] = row.contents;
          if (row.has_divider_line) {
            songs.push(current_song);
            current_song = {};
          }
        }
        if (is_music_section)
          songs.push(current_song);
        return songs;
      }
      chooseFormat(options) {
        const formats = [
          ...this.streaming_data.formats || [],
          ...this.streaming_data.adaptive_formats || []
        ];
        const requires_audio = options.type.includes("audio");
        const requires_video = options.type.includes("video");
        let best_width = -1;
        const is_best = ["best", "bestefficiency"].includes(options.quality);
        const use_most_efficient = options.quality !== "best";
        let candidates = formats.filter((format) => {
          if (requires_audio && !format.has_audio)
            return false;
          if (requires_video && !format.has_video)
            return false;
          if (options.format !== "any" && !format.mime_type.includes(options.format))
            return false;
          if (!is_best && format.quality_label !== options.quality)
            return false;
          if (best_width < format.width)
            best_width = format.width;
          return true;
        });
        if (candidates.length === 0) {
          throw new InnertubeError2("No matching formats found", {
            options
          });
        }
        if (is_best && requires_video)
          candidates = candidates.filter((format) => format.width === best_width);
        if (requires_audio && !requires_video) {
          const audio_only = candidates.filter((format) => !format.has_video);
          if (audio_only.length > 0) {
            candidates = audio_only;
          }
        }
        if (use_most_efficient) {
          candidates.sort((a, b) => a.bitrate - b.bitrate);
        } else {
          candidates.sort((a, b) => b.bitrate - a.bitrate);
        }
        return candidates[0];
      }
      download(options = {}, _stream) {
        const stream = _stream ? _stream : new PassThrough2();
        let cancel;
        let cancelled = false;
        (async () => {
          if (this.playability_status === "UNPLAYABLE")
            return stream.emit("error", new InnertubeError2("Video is unplayable", { video: this, error_type: "UNPLAYABLE" }));
          if (this.playability_status === "LOGIN_REQUIRED")
            return stream.emit("error", new InnertubeError2("Video is login required", { video: this, error_type: "LOGIN_REQUIRED" }));
          if (!this.streaming_data)
            return stream.emit("error", new InnertubeError2("Streaming data not available.", { video: this, error_type: "NO_STREAMING_DATA" }));
          const opts = {
            quality: "360p",
            type: "videoandaudio",
            format: "mp4",
            range: void 0,
            ...options
          };
          const format = this.chooseFormat(opts);
          const format_url = format.decipher(this.#player);
          if (opts.type === "videoandaudio" && !options.range) {
            const response = await Axios.get(`${format_url}&cpn=${this.#cpn}`, {
              responseType: "stream",
              cancelToken: new CancelToken(function executor(c) {
                cancel = c;
              }),
              headers: Constants.STREAM_HEADERS
            }).catch((error) => error);
            if (response instanceof Error) {
              stream.emit("error", new InnertubeError2(response.message, { type: "REQUEST_FAILED" }));
              return stream;
            }
            stream.emit("start");
            let downloaded_size = 0;
            if (typeof response.data === "object") {
              response.data.on("data", (chunk) => {
                downloaded_size += chunk.length;
                const size = (format.content_length / 1024 / 1024).toFixed(2);
                const percentage = Math.floor(downloaded_size / format.content_length * 100);
                stream.emit("progress", {
                  size,
                  percentage,
                  chunk_size: chunk.length,
                  downloaded_size: (downloaded_size / 1024 / 1024).toFixed(2),
                  raw_data: {
                    chunk_size: chunk.length,
                    downloaded: downloaded_size,
                    size: response.headers["content-length"]
                  }
                });
              });
              response.data.on("error", (err) => {
                cancelled && stream.emit("error", new InnertubeError2("The download was cancelled.", { type: "DOWNLOAD_CANCELLED" })) || stream.emit("error", new InnertubeError2(err.message, { type: "DOWNLOAD_ABORTED" }));
              });
              response.data.pipe(stream, { end: true });
            } else {
              const readable = new Readable();
              readable.push(response.data);
              readable.pipe(stream, { end: true });
            }
          } else {
            const chunk_size = 1048576 * 10;
            let chunk_start = options.range ? options.range.start : 0;
            let chunk_end = options.range ? options.range.end : chunk_size;
            let downloaded_size = 0;
            let must_end = false;
            stream.emit("start");
            const downloadChunk = async () => {
              if (chunk_end >= format.content_length || options.range) {
                must_end = true;
              }
              if (options.range) {
                format.content_length = options.range.end;
              }
              const response = await Axios.get(`${format_url}&cpn=${this.#cpn}&range=${chunk_start}-${chunk_end || ""}`, {
                responseType: "stream",
                cancelToken: new CancelToken(function executor(c) {
                  cancel = c;
                }),
                headers: Constants.STREAM_HEADERS
              }).catch((error) => error);
              if (response instanceof Error) {
                stream.emit("error", { message: response.message, type: "REQUEST_FAILED" });
                return stream;
              }
              if (typeof response.data === "object") {
                response.data.on("data", (chunk) => {
                  downloaded_size += chunk.length;
                  const size = (format.content_length / 1024 / 1024).toFixed(2);
                  const percentage = Math.floor(downloaded_size / format.content_length * 100);
                  stream.emit("progress", {
                    size,
                    percentage,
                    chunk_size: chunk.length,
                    downloaded_size: (downloaded_size / 1024 / 1024).toFixed(2),
                    raw_data: {
                      chunk_size: chunk.length,
                      downloaded: downloaded_size,
                      size: response.headers["content-length"]
                    }
                  });
                });
                response.data.on("error", (err) => {
                  cancelled && stream.emit("error", { message: "The download was cancelled.", type: "DOWNLOAD_CANCELLED" }) || stream.emit("error", { message: err.message, type: "DOWNLOAD_ABORTED" });
                });
                response.data.on("end", () => {
                  if (!must_end && !options.range) {
                    chunk_start = chunk_end + 1;
                    chunk_end += chunk_size;
                    downloadChunk();
                  }
                });
                response.data.pipe(stream, { end: must_end });
              } else {
                const readable = new Readable();
                readable.push(response.data);
                readable.pipe(stream, { end: must_end });
              }
            };
            downloadChunk();
          }
        })().catch((err) => {
          stream.emit("error", err);
        });
        stream.cancel = () => {
          cancelled = true;
          cancel && cancel();
        };
        return stream;
      }
    };
    module2.exports = VideoInfo2;
  }
});

// lib/core/TabbedFeed.js
var require_TabbedFeed = __commonJS({
  "lib/core/TabbedFeed.js"(exports2, module2) {
    "use strict";
    var { InnertubeError: InnertubeError2 } = require_Utils();
    var Feed = require_Feed();
    var TabbedFeed2 = class extends Feed {
      #tabs;
      #actions;
      constructor(actions, data, already_parsed = false) {
        super(actions, data, already_parsed);
        this.#actions = actions;
        this.#tabs = this.page.contents_memo.get("Tab");
      }
      get tabs() {
        return this.#tabs.map((tab) => tab.title.toString());
      }
      async getTab(title) {
        const tab = this.#tabs.find((tab2) => tab2.title.toLowerCase() === title.toLowerCase());
        if (!tab)
          throw new InnertubeError2(`Tab "${title}" not found`);
        if (tab.selected)
          return this;
        const response = await tab.endpoint.call(this.#actions);
        return new TabbedFeed2(this.#actions, response, true);
      }
      get title() {
        return this.page.contents_memo("Tab")?.find((tab) => tab.selected)?.title.toString();
      }
    };
    module2.exports = TabbedFeed2;
  }
});

// lib/parser/youtube/Channel.js
var require_Channel2 = __commonJS({
  "lib/parser/youtube/Channel.js"(exports2, module2) {
    "use strict";
    var TabbedFeed2 = require_TabbedFeed();
    var Channel2 = class extends TabbedFeed2 {
      #tab;
      constructor(actions, data, already_parsed = false) {
        super(actions, data, already_parsed);
        this.header = {
          author: this.page.header.author,
          subscribers: this.page.header.subscribers.toString(),
          banner: this.page.header.banner,
          tv_banner: this.page.header.tv_banner,
          mobile_banner: this.page.header.mobile_banner,
          header_links: this.page.header.header_links
        };
        this.metadata = { ...this.page.metadata, ...this.page.microformat };
        this.sponsor_button = this.page.header.sponsor_button || null;
        this.subscribe_button = this.page.header.subscribe_button || null;
        const tab = this.page.contents.tabs.get({ selected: true });
        this.current_tab = tab;
      }
      async getVideos() {
        const tab = await this.getTab("Videos");
        return new Channel2(this.actions, tab.page, true);
      }
      async getPlaylists() {
        const tab = await this.getTab("Playlists");
        return new Channel2(this.actions, tab.page, true);
      }
      async getHome() {
        const tab = await this.getTab("Home");
        return new Channel2(this.actions, tab.page, true);
      }
      async getCommunity() {
        const tab = await this.getTab("Community");
        return new Channel2(this.actions, tab.page, true);
      }
      async getChannels() {
        const tab = await this.getTab("Channels");
        return new Channel2(this.actions, tab.page, true);
      }
      async getAbout() {
        const tab = await this.getTab("About");
        return tab.memo.get("ChannelAboutFullMetadata")?.[0];
      }
    };
    module2.exports = Channel2;
  }
});

// lib/parser/youtube/Playlist.js
var require_Playlist2 = __commonJS({
  "lib/parser/youtube/Playlist.js"(exports2, module2) {
    "use strict";
    var Feed = require_Feed();
    var Playlist2 = class extends Feed {
      constructor(actions, data, already_parsed = false) {
        super(actions, data, already_parsed);
        const primary_info = this.page.sidebar.contents.get({ type: "PlaylistSidebarPrimaryInfo" });
        const secondary_info = this.page.sidebar.contents.get({ type: "PlaylistSidebarSecondaryInfo" });
        this.info = {
          ...this.page.metadata,
          ...{
            author: secondary_info.owner.author,
            thumbnails: primary_info.thumbnail_renderer.thumbnail,
            total_items: this.#getStat(0, primary_info),
            views: this.#getStat(1, primary_info),
            last_updated: this.#getStat(2, primary_info),
            can_share: this.page.header.can_share,
            can_delete: this.page.header.can_delete,
            is_editable: this.page.header.is_editable,
            privacy: this.page.header.privacy
          }
        };
        this.menu = primary_info.menu;
        this.endpoint = primary_info.endpoint;
      }
      #getStat(index, primary_info) {
        if (!primary_info || !primary_info.stats)
          return "N/A";
        return primary_info.stats[index]?.toString() || "N/A";
      }
      get items() {
        return this.videos;
      }
    };
    module2.exports = Playlist2;
  }
});

// lib/parser/youtube/History.js
var require_History = __commonJS({
  "lib/parser/youtube/History.js"(exports2, module2) {
    "use strict";
    var Feed = require_Feed();
    var History2 = class extends Feed {
      constructor(actions, data, already_parsed = false) {
        super(actions, data, already_parsed);
        this.sections = this.memo.get("ItemSection");
        this.feed_actions = this.memo.get("BrowseFeedActions")?.[0] || [];
      }
      async getContinuation() {
        const continuation = await this.getContinuationData();
        return new History2(this.actions, continuation, true);
      }
    };
    module2.exports = History2;
  }
});

// lib/parser/youtube/Library.js
var require_Library = __commonJS({
  "lib/parser/youtube/Library.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var History2 = require_History();
    var Playlist2 = require_Playlist2();
    var Feed = require_Feed();
    var { observe } = require_Utils();
    var Library2 = class {
      #actions;
      #page;
      constructor(response, actions) {
        this.#actions = actions;
        this.#page = Parser.parseResponse(response);
        const tab = this.#page.contents.tabs.get({ selected: true });
        const shelves = tab.content.contents.map((section) => section.contents[0]);
        const stats = this.#page.contents.secondary_contents.items.get({ type: "ProfileColumnStats" }).items;
        const user_info = this.#page.contents.secondary_contents.items.get({ type: "ProfileColumnUserInfo" });
        this.profile = { stats, user_info };
        this.sections = observe(shelves.map((shelf) => ({
          type: shelf.icon_type,
          title: shelf.title,
          contents: shelf.content.items,
          getAll: () => this.#getAll(shelf)
        })));
      }
      async #getAll(shelf) {
        if (!shelf.menu?.top_level_buttons)
          throw new Error(`The ${shelf.title.text} section doesn't have more items`);
        const button = await shelf.menu.top_level_buttons.get({ text: "See all" });
        const page = await button.endpoint.call(this.#actions);
        switch (shelf.icon_type) {
          case "LIKE":
          case "WATCH_LATER":
            return new Playlist2(this.#actions, page, true);
          case "WATCH_HISTORY":
            return new History2(this.#actions, page, true);
          case "CONTENT_CUT":
            return new Feed(this.#actions, page, true);
          default:
        }
      }
      get history() {
        return this.sections.get({ type: "WATCH_HISTORY" });
      }
      get watch_later() {
        return this.sections.get({ type: "WATCH_LATER" });
      }
      get liked_videos() {
        return this.sections.get({ type: "LIKE" });
      }
      get playlists() {
        return this.sections.get({ type: "PLAYLISTS" });
      }
      get clips() {
        return this.sections.get({ type: "CONTENT_CUT" });
      }
      get page() {
        return this.#page;
      }
    };
    module2.exports = Library2;
  }
});

// lib/parser/youtube/Comments.js
var require_Comments = __commonJS({
  "lib/parser/youtube/Comments.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var { InnertubeError: InnertubeError2 } = require_Utils();
    var Comments2 = class {
      #page;
      #actions;
      #continuation;
      constructor(actions, data, already_parsed = false) {
        this.#page = already_parsed ? data : Parser.parseResponse(data);
        this.#actions = actions;
        const contents = this.#page.on_response_received_endpoints;
        this.header = contents[0].contents.get({ type: "CommentsHeader" });
        const threads = contents[1].contents.findAll({ type: "CommentThread" });
        this.contents = threads.map((thread) => {
          thread.comment.setActions(this.#actions);
          thread.setActions(this.#actions);
          return thread;
        });
        this.#continuation = contents[1].contents.get({ type: "ContinuationItem" });
      }
      async comment(text) {
        const button = this.header.create_renderer.submit_button;
        const payload = {
          params: {
            commentText: text
          },
          parse: false
        };
        const response = await button.endpoint.callTest(this.#actions, payload);
        return response;
      }
      async getContinuation() {
        if (!this.#continuation)
          throw new InnertubeError2("Continuation not found");
        const data = await this.#continuation.endpoint.callTest(this.#actions);
        const page = Object.assign({}, this.#page);
        page.on_response_received_endpoints.pop();
        page.on_response_received_endpoints.push(data.on_response_received_endpoints[0]);
        return new Comments2(this.#actions, page, true);
      }
      get page() {
        return this.#page;
      }
    };
    module2.exports = Comments2;
  }
});

// lib/parser/ytmusic/Search.js
var require_Search2 = __commonJS({
  "lib/parser/ytmusic/Search.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var { observe, InnertubeError: InnertubeError2 } = require_Utils();
    var Search2 = class {
      #page;
      #actions;
      #continuation;
      #header;
      constructor(response, actions, args = {}) {
        this.#actions = actions;
        this.#page = args.is_continuation && response || Parser.parseResponse(response.data);
        const tab = this.#page.contents.tabs.get({ selected: true });
        const shelves = tab.content.contents;
        const item_section = shelves.get({ type: "ItemSection" });
        this.#header = tab.content.header;
        this.did_you_mean = item_section?.contents.get({ type: "DidYouMean" }) || null;
        this.showing_results_for = item_section?.contents.get({ type: "ShowingResultsFor" }) || null;
        (!!this.did_you_mean || !!this.showing_results_for) && shelves.shift();
        if (args.is_continuation || args.is_filtered) {
          const shelf = shelves.get({ type: "MusicShelf" });
          this.results = shelf.contents;
          this.#continuation = shelf.continuation;
          return;
        }
        this.sections = observe(shelves.map((shelf) => ({
          title: shelf.title,
          contents: shelf.contents,
          getMore: () => this.#getMore(shelf)
        })));
      }
      async #getMore(shelf) {
        if (!shelf.endpoint)
          throw new InnertubeError2(`${shelf.title} doesn't have more items`);
        const response = await shelf.endpoint.call(this.#actions, "YTMUSIC");
        return new Search2(response, this.#actions, { is_continuation: true });
      }
      async getContinuation() {
        if (!this.#continuation)
          throw new InnertubeError2("Looks like you've reached the end");
        const response = await this.#actions.search({ ctoken: this.#continuation, client: "YTMUSIC" });
        const data = response.data.continuationContents.musicShelfContinuation;
        this.results = Parser.parse(data.contents);
        this.#continuation = data?.continuations?.[0]?.nextContinuationData?.continuation;
        return this;
      }
      async selectFilter(name) {
        if (!this.filters.includes(name))
          throw new InnertubeError2("Invalid filter", { available_filters: this.filters });
        const filter = this.#header.chips.get({ text: name });
        if (filter.is_selected)
          return this;
        const response = await filter.endpoint.call(this.#actions, "YTMUSIC");
        return new Search2(response, this.#actions, { is_continuation: true });
      }
      get has_continuation() {
        return !!this.#continuation;
      }
      get filters() {
        return this.#header.chips.map((chip) => chip.text);
      }
      get songs() {
        return this.sections.get({ title: "Songs" });
      }
      get videos() {
        return this.sections.get({ title: "Videos" });
      }
      get albums() {
        return this.sections.get({ title: "Albums" });
      }
      get artists() {
        return this.sections.get({ title: "Artists" });
      }
      get playlists() {
        return this.sections.get({ title: "Community playlists" });
      }
      get page() {
        return this.#page;
      }
    };
    module2.exports = Search2;
  }
});

// lib/parser/ytmusic/HomeFeed.js
var require_HomeFeed = __commonJS({
  "lib/parser/ytmusic/HomeFeed.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var HomeFeed = class {
      #page;
      #actions;
      #continuation;
      constructor(response, actions) {
        this.#actions = actions;
        this.#page = Parser.parseResponse(response.data);
        const tab = this.#page.contents.tabs.get({ title: "Home" });
        this.#continuation = tab.content?.continuation || this.#page.continuation_contents.continuation;
        this.sections = tab.content?.contents || this.#page.continuation_contents.contents;
      }
      async getContinuation() {
        const response = await this.#actions.browse(this.#continuation, { is_ctoken: true, client: "YTMUSIC" });
        return new HomeFeed(response, this.#actions);
      }
    };
    module2.exports = HomeFeed;
  }
});

// lib/parser/ytmusic/Explore.js
var require_Explore = __commonJS({
  "lib/parser/ytmusic/Explore.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Explore = class {
      #page;
      constructor(response) {
        this.#page = Parser.parseResponse(response.data);
        const tab = this.page.contents.tabs.get({ selected: true });
        this.top_buttons = tab.content.contents.get({ type: "Grid" }).items;
        this.sections = tab.content.contents.findAll({ type: "MusicCarouselShelf" });
      }
      get page() {
        return this.#page;
      }
    };
    module2.exports = Explore;
  }
});

// lib/parser/ytmusic/Library.js
var require_Library2 = __commonJS({
  "lib/parser/ytmusic/Library.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Library2 = class {
      #page;
      constructor(response) {
        this.#page = Parser.parseResponse(response.data);
      }
      get page() {
        return this.#page;
      }
    };
    module2.exports = Library2;
  }
});

// lib/parser/ytmusic/Artist.js
var require_Artist = __commonJS({
  "lib/parser/ytmusic/Artist.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var { observe } = require_Utils();
    var Artist = class {
      #page;
      #actions;
      constructor(response, actions) {
        this.#page = Parser.parseResponse(response.data);
        this.#actions = actions;
        this.header = this.page.header;
        const music_shelf = this.#page.contents_memo.get("MusicShelf");
        const music_carousel_shelf = this.#page.contents_memo.get("MusicCarouselShelf");
        this.sections = observe([...music_shelf, ...music_carousel_shelf]);
      }
      async getAllSongs() {
        const shelf = this.sections.get({ type: "MusicShelf" });
        const page = await shelf.endpoint.call(this.#actions, "YTMUSIC");
        return page.contents_memo.get("MusicPlaylistShelf")?.[0] || [];
      }
      get page() {
        return this.#page;
      }
    };
    module2.exports = Artist;
  }
});

// lib/parser/ytmusic/Album.js
var require_Album = __commonJS({
  "lib/parser/ytmusic/Album.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Album = class {
      #page;
      #actions;
      constructor(response, actions) {
        this.#page = Parser.parseResponse(response.data);
        this.#actions = actions;
        this.header = this.#page.header;
        this.url = this.#page.microformat.url_canonical;
        this.contents = this.#page.contents_memo.get("MusicShelf")?.[0].contents;
        this.sections = this.#page.contents_memo.get("MusicCarouselShelf") || [];
      }
      get page() {
        return this.#page;
      }
    };
    module2.exports = Album;
  }
});

// lib/core/Music.js
var require_Music = __commonJS({
  "lib/core/Music.js"(exports2, module2) {
    "use strict";
    var Parser = require_contents();
    var Search2 = require_Search2();
    var HomeFeed = require_HomeFeed();
    var Explore = require_Explore();
    var Library2 = require_Library2();
    var Artist = require_Artist();
    var Album = require_Album();
    var { InnertubeError: InnertubeError2, observe } = require_Utils();
    var Music = class {
      #session;
      #actions;
      constructor(session) {
        this.#session = session;
        this.#actions = session.actions;
      }
      async search(query, filters) {
        const response = await this.#actions.search({ query, filters, client: "YTMUSIC" });
        return new Search2(response, this.#actions, { is_filtered: filters?.hasOwnProperty("type") && filters.type !== "all" });
      }
      async getHomeFeed() {
        const response = await this.#actions.browse("FEmusic_home", { client: "YTMUSIC" });
        return new HomeFeed(response, this.#actions);
      }
      async getExplore() {
        const response = await this.#actions.browse("FEmusic_explore", { client: "YTMUSIC" });
        return new Explore(response, this.#actions);
      }
      async getLibrary() {
        const response = await this.#actions.browse("FEmusic_liked_albums", { client: "YTMUSIC" });
        return new Library2(response, this.#actions);
      }
      async getArtist(artist_id) {
        if (!artist_id.startsWith("UC"))
          throw new InnertubeError2("Invalid artist id", artist_id);
        const response = await this.#actions.browse(artist_id, { client: "YTMUSIC" });
        return new Artist(response, this.#actions);
      }
      async getAlbum(album_id) {
        if (!album_id.startsWith("MPR"))
          throw new InnertubeError2("Invalid album id", album_id);
        const response = await this.#actions.browse(album_id, { client: "YTMUSIC" });
        return new Album(response, this.#actions);
      }
      async getLyrics(video_id) {
        const response = await this.#actions.next({ video_id, client: "YTMUSIC" });
        const data = Parser.parseResponse(response.data);
        const tab = data.contents.tabs.get({ title: "Lyrics" });
        const page = await tab.endpoint.call(this.#actions, "YTMUSIC");
        if (!page)
          throw new InnertubeError2("Invalid video id");
        if (page.contents.constructor.name === "Message")
          throw new InnertubeError2(page.contents.text, video_id);
        const description_shelf = page.contents.contents.get({ type: "MusicDescriptionShelf" });
        return {
          text: description_shelf.description.toString(),
          footer: description_shelf.footer
        };
      }
      async getUpNext(video_id) {
        const response = await this.#actions.next({ video_id, client: "YTMUSIC" });
        const data = Parser.parseResponse(response.data);
        const tab = data.contents.tabs.get({ title: "Up next" });
        const upnext_content = tab.content.content;
        if (!upnext_content)
          throw new InnertubeError2("Invalid id", video_id);
        return {
          id: upnext_content.playlist_id,
          title: upnext_content.title,
          is_editable: upnext_content.is_editable,
          contents: observe(upnext_content.contents)
        };
      }
      async getRelated(video_id) {
        const response = await this.#actions.next({ video_id, client: "YTMUSIC" });
        const data = Parser.parseResponse(response.data);
        const tab = data.contents.tabs.get({ title: "Related" });
        const page = await tab.endpoint.call(this.#actions, "YTMUSIC");
        if (!page)
          throw new InnertubeError2("Invalid video id");
        const shelves = page.contents.contents.findAll({ type: "MusicCarouselShelf" });
        const info = page.contents.contents.get({ type: "MusicDescriptionShelf" });
        return {
          sections: shelves,
          info: info?.description.toString() || ""
        };
      }
    };
    module2.exports = Music;
  }
});

// lib/core/FilterableFeed.js
var require_FilterableFeed = __commonJS({
  "lib/core/FilterableFeed.js"(exports2, module2) {
    "use strict";
    var { InnertubeError: InnertubeError2 } = require_Utils();
    var Feed = require_Feed();
    var FilterableFeed2 = class extends Feed {
      #chips;
      constructor(actions, data, already_parsed = false) {
        super(actions, data, already_parsed);
      }
      get filter_chips() {
        if (this.#chips)
          return this.#chips || [];
        if (this.memo.get("FeedFilterChipBar")?.length > 1)
          throw new InnertubeError2("There are too many feed filter chipbars, you'll need to find the correct one yourself in this.page");
        if (this.memo.get("FeedFilterChipBar")?.length === 0)
          throw new InnertubeError2("There are no feed filter chipbars");
        this.#chips = this.memo.get("ChipCloudChip") || [];
        return this.#chips || [];
      }
      get filters() {
        return this.filter_chips.map((chip) => chip.text.toString()) || [];
      }
      async getFilteredFeed(filter) {
        let target_filter;
        if (typeof filter === "string") {
          if (!this.filters.includes(filter))
            throw new InnertubeError2("Filter not found", {
              available_filters: this.filters
            });
          target_filter = this.filter_chips.find((chip) => chip.text.toString() === filter);
        } else if (filter.type === "ChipCloudChip") {
          target_filter = filter;
        } else {
          throw new InnertubeError2("Invalid filter");
        }
        if (target_filter.is_selected)
          return this;
        const response = await target_filter.endpoint.call(this.actions);
        return new Feed(this.actions, response, true);
      }
    };
    module2.exports = FilterableFeed2;
  }
});

// lib/utils/Request.js
var require_Request = __commonJS({
  "lib/utils/Request.js"(exports2, module2) {
    "use strict";
    var Axios = require_axios2();
    var Constants = require_Constants();
    var Utils = require_Utils();
    var Request2 = class {
      #instance;
      #session;
      constructor(config) {
        this.config = config;
        this.#instance = Axios.create({
          proxy: config.proxy,
          httpAgent: config.http_agent,
          httpsAgent: config.https_agent,
          params: { prettyPrint: false },
          headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate",
            "content-type": "application/json",
            "user-agent": Utils.getRandomUserAgent("desktop").userAgent
          },
          validateStatus: () => true,
          timeout: 15e3
        });
        this.#setupRequestInterceptor();
        this.#setupResponseInterceptor();
      }
      #setupRequestInterceptor() {
        this.#instance.interceptors.request.use(async (config) => {
          if (this.#session) {
            const innertube_url = `${Constants.URLS.API.PRODUCTION}${this.#session.version}`;
            config.baseURL = config.baseURL || innertube_url;
            config.headers["accept-language"] = `en-${this.#session.config.gl || "US"}`;
            config.headers["x-goog-visitor-id"] = this.#session.context.client.visitorData || "";
            config.headers["x-youtube-client-version"] = this.#session.context.client.clientVersion;
            config.headers["x-origin"] = new URL(config.baseURL).origin;
            config.headers["origin"] = new URL(config.baseURL).origin;
            config.params.key = this.#session.key;
            const is_innertube_req = config.baseURL == innertube_url;
            if (is_innertube_req && typeof config.data === "object") {
              config.data = {
                context: JSON.parse(JSON.stringify(this.#session.context)),
                ...config.data
              };
              this.#adjustContext(config.data.context, config.data.client);
              config.headers["x-youtube-client-version"] = config.data.context.client.clientVersion;
              delete config.data.client;
            }
            if (this.#session.logged_in && is_innertube_req) {
              const oauth = this.#session.oauth;
              if (oauth.validateCredentials()) {
                await oauth.checkAccessTokenValidity();
                config.headers.authorization = `Bearer ${oauth.credentials.access_token}`;
                delete config.params.key;
              }
              if (this.config.cookie) {
                const papisid = Utils.getStringBetweenStrings(this.config.cookie, "PAPISID=", ";");
                config.headers.authorization = Utils.generateSidAuth(papisid);
                config.headers.cookie = this.config.cookie;
              }
            }
          }
          if (this.config.debug) {
            const url = `${config.baseURL ? `${config.baseURL}` : ""}${config.url}`;
            console.info("\n", `[${config.method.toUpperCase()}] > ${url}`, "\n", config?.data || "N/A", "\n");
          }
          return config;
        }, (error) => {
          throw new Utils.InnertubeError(error.message, error);
        });
      }
      #setupResponseInterceptor() {
        this.#instance.interceptors.response.use((res) => {
          const response = {
            success: res.status === 200,
            status_code: res.status,
            data: res.data
          };
          if (res.status !== 200)
            throw new Utils.InnertubeError(`Request to ${res.config.url} failed with status code ${res.status}`, response);
          return response;
        });
        this.#instance.interceptors.response.use(void 0, (error) => {
          if (error.info)
            return Promise.reject(error);
          throw new Utils.InnertubeError("Could not complete this operation", error.message);
        });
      }
      #adjustContext(ctx, client) {
        switch (client) {
          case "YTMUSIC":
            ctx.client.clientVersion = Constants.CLIENTS.YTMUSIC.VERSION;
            ctx.client.clientName = Constants.CLIENTS.YTMUSIC.NAME;
            break;
          case "ANDROID":
            ctx.client.clientVersion = Constants.CLIENTS.ANDROID.VERSION;
            ctx.client.clientFormFactor = "SMALL_FORM_FACTOR";
            ctx.client.clientName = Constants.CLIENTS.ANDROID.NAME;
            break;
          default:
            break;
        }
      }
      setSession(session) {
        this.#session = session;
      }
      get instance() {
        return this.#instance;
      }
    };
    module2.exports = Request2;
  }
});

// lib/parser/youtube/search/VideoResultItem.js
var require_VideoResultItem = __commonJS({
  "lib/parser/youtube/search/VideoResultItem.js"(exports2, module2) {
    "use strict";
    var Utils = require_Utils();
    var Constants = require_Constants();
    var VideoResultItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item)).filter((item) => item);
      }
      static parseItem(item) {
        const renderer = item.videoRenderer || item.compactVideoRenderer;
        if (renderer)
          return {
            id: renderer.videoId,
            url: `https://youtu.be/${renderer.videoId}`,
            title: renderer.title.runs[0].text,
            description: renderer?.detailedMetadataSnippets ? renderer?.detailedMetadataSnippets[0].snippetText.runs.map((item2) => item2.text).join("") : "N/A",
            channel: {
              id: renderer?.ownerText?.runs[0]?.navigationEndpoint?.browseEndpoint?.browseId,
              name: renderer?.ownerText?.runs[0]?.text,
              url: `${Constants.URLS.YT_BASE}${renderer?.ownerText?.runs[0].navigationEndpoint?.browseEndpoint?.canonicalBaseUrl}`
            },
            metadata: {
              view_count: renderer?.viewCountText?.simpleText || "N/A",
              short_view_count_text: {
                simple_text: renderer?.shortViewCountText?.simpleText || "N/A",
                accessibility_label: renderer?.shortViewCountText?.accessibility?.accessibilityData?.label || "N/A"
              },
              thumbnails: renderer?.thumbnail.thumbnails,
              duration: {
                seconds: Utils.timeToSeconds(renderer?.lengthText?.simpleText || "0"),
                simple_text: renderer?.lengthText?.simpleText || "N/A",
                accessibility_label: renderer?.lengthText?.accessibility?.accessibilityData?.label || "N/A"
              },
              published: renderer?.publishedTimeText?.simpleText || "N/A",
              badges: renderer?.badges?.map((item2) => item2.metadataBadgeRenderer.label) || [],
              owner_badges: renderer?.ownerBadges?.map((item2) => item2.metadataBadgeRenderer.tooltip) || []
            }
          };
      }
    };
    module2.exports = VideoResultItem;
  }
});

// lib/parser/youtube/search/SearchSuggestionItem.js
var require_SearchSuggestionItem = __commonJS({
  "lib/parser/youtube/search/SearchSuggestionItem.js"(exports2, module2) {
    "use strict";
    var SearchSuggestionItem = class {
      static parse(data) {
        return {
          query: data[0],
          results: data[1].map((res) => res[0])
        };
      }
    };
    module2.exports = SearchSuggestionItem;
  }
});

// lib/parser/youtube/others/PlaylistItem.js
var require_PlaylistItem = __commonJS({
  "lib/parser/youtube/others/PlaylistItem.js"(exports2, module2) {
    "use strict";
    var Utils = require_Utils();
    var PlaylistItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item)).filter((item) => item);
      }
      static parseItem(item) {
        if (item.playlistVideoRenderer)
          return {
            id: item?.playlistVideoRenderer?.videoId,
            title: item?.playlistVideoRenderer?.title?.runs[0]?.text,
            author: item?.playlistVideoRenderer?.shortBylineText?.runs[0]?.text,
            duration: {
              seconds: Utils.timeToSeconds(item?.playlistVideoRenderer?.lengthText?.simpleText || "0"),
              simple_text: item?.playlistVideoRenderer?.lengthText?.simpleText || "N/A",
              accessibility_label: item?.playlistVideoRenderer?.lengthText?.accessibility?.accessibilityData?.label || "N/A"
            },
            thumbnails: item?.playlistVideoRenderer?.thumbnail?.thumbnails
          };
      }
    };
    module2.exports = PlaylistItem;
  }
});

// lib/parser/youtube/others/NotificationItem.js
var require_NotificationItem = __commonJS({
  "lib/parser/youtube/others/NotificationItem.js"(exports2, module2) {
    "use strict";
    var NotificationItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item)).filter((item) => item);
      }
      static parseItem(item) {
        if (item.notificationRenderer) {
          const notification = item.notificationRenderer;
          return {
            title: notification?.shortMessage?.simpleText,
            sent_time: notification?.sentTimeText?.simpleText,
            timestamp: notification.notificationId,
            channel_name: notification?.contextualMenu?.menuRenderer?.items[1]?.menuServiceItemRenderer?.text?.runs[1]?.text || "N/A",
            channel_thumbnail: notification?.thumbnail?.thumbnails[0],
            video_thumbnail: notification?.videoThumbnail?.thumbnails[0],
            video_url: notification.navigationEndpoint.watchEndpoint ? `https://youtu.be/${notification.navigationEndpoint.watchEndpoint.videoId}` : "N/A",
            read: notification.read
          };
        }
      }
    };
    module2.exports = NotificationItem;
  }
});

// lib/parser/youtube/others/VideoItem.js
var require_VideoItem = __commonJS({
  "lib/parser/youtube/others/VideoItem.js"(exports2, module2) {
    "use strict";
    var Utils = require_Utils();
    var Constants = require_Constants();
    var VideoItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item)).filter((item) => item);
      }
      static parseItem(item) {
        item = item.richItemRenderer && item.richItemRenderer.content.videoRenderer && item.richItemRenderer.content || item;
        if (item.videoRenderer)
          return {
            id: item.videoRenderer.videoId,
            title: item.videoRenderer.title.runs.map((run) => run.text).join(" "),
            description: item?.videoRenderer?.descriptionSnippet?.runs[0]?.text || "N/A",
            channel: {
              id: item?.videoRenderer?.shortBylineText?.runs[0]?.navigationEndpoint?.browseEndpoint?.browseId,
              name: item?.videoRenderer?.shortBylineText?.runs[0]?.text || "N/A",
              url: `${Constants.URLS.YT_BASE}${item?.videoRenderer?.shortBylineText?.runs[0]?.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl}`
            },
            metadata: {
              view_count: item?.videoRenderer?.viewCountText?.simpleText || "N/A",
              short_view_count_text: {
                simple_text: item?.videoRenderer?.shortViewCountText?.simpleText || "N/A",
                accessibility_label: item?.videoRenderer?.shortViewCountText?.accessibility?.accessibilityData?.label || "N/A"
              },
              thumbnail: item?.videoRenderer?.thumbnail?.thumbnails.slice(-1)[0] || {},
              moving_thumbnail: item?.videoRenderer?.richThumbnail?.movingThumbnailRenderer?.movingThumbnailDetails?.thumbnails[0] || {},
              published: item?.videoRenderer?.publishedTimeText?.simpleText || "N/A",
              duration: {
                seconds: Utils.timeToSeconds(item?.videoRenderer?.lengthText?.simpleText || "0"),
                simple_text: item?.videoRenderer?.lengthText?.simpleText || "N/A",
                accessibility_label: item?.videoRenderer?.lengthText?.accessibility?.accessibilityData?.label || "N/A"
              },
              badges: item?.videoRenderer?.badges?.map((badge) => badge.metadataBadgeRenderer.label) || [],
              owner_badges: item?.videoRenderer?.ownerBadges?.map((badge) => badge.metadataBadgeRenderer.tooltip) || []
            }
          };
      }
    };
    module2.exports = VideoItem;
  }
});

// lib/parser/youtube/others/GridVideoItem.js
var require_GridVideoItem = __commonJS({
  "lib/parser/youtube/others/GridVideoItem.js"(exports2, module2) {
    "use strict";
    var Constants = require_Constants();
    var GridVideoItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item)).filter((item) => item);
      }
      static parseItem(item) {
        return {
          id: item.gridVideoRenderer.videoId,
          title: item?.gridVideoRenderer?.title?.runs?.map((run) => run.text).join(" "),
          channel: {
            id: item?.gridVideoRenderer?.shortBylineText?.runs[0]?.navigationEndpoint?.browseEndpoint?.browseId,
            name: item?.gridVideoRenderer?.shortBylineText?.runs[0]?.text || "N/A",
            url: `${Constants.URLS.YT_BASE}${item?.gridVideoRenderer?.shortBylineText?.runs[0]?.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl}`
          },
          metadata: {
            view_count: item?.gridVideoRenderer?.viewCountText?.simpleText || "N/A",
            short_view_count_text: {
              simple_text: item?.gridVideoRenderer?.shortViewCountText?.simpleText || "N/A",
              accessibility_label: item?.gridVideoRenderer?.shortViewCountText?.accessibility?.accessibilityData?.label || "N/A"
            },
            thumbnail: item?.gridVideoRenderer?.thumbnail?.thumbnails.slice(-1)[0] || [],
            moving_thumbnail: item?.gridVideoRenderer?.richThumbnail?.movingThumbnailRenderer?.movingThumbnailDetails?.thumbnails[0] || {},
            published: item?.gridVideoRenderer?.publishedTimeText?.simpleText || "N/A",
            badges: item?.gridVideoRenderer?.badges?.map((badge) => badge.metadataBadgeRenderer.label) || [],
            owner_badges: item?.gridVideoRenderer?.ownerBadges?.map((badge) => badge.metadataBadgeRenderer.tooltip) || []
          }
        };
      }
    };
    module2.exports = GridVideoItem;
  }
});

// lib/parser/youtube/others/GridPlaylistItem.js
var require_GridPlaylistItem = __commonJS({
  "lib/parser/youtube/others/GridPlaylistItem.js"(exports2, module2) {
    "use strict";
    var GridPlaylistItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item)).filter((item) => item);
      }
      static parseItem(item) {
        return {
          id: item?.gridPlaylistRenderer.playlistId,
          title: item?.gridPlaylistRenderer.title?.runs?.map((run) => run.text).join(""),
          metadata: {
            thumbnail: item?.gridPlaylistRenderer.thumbnail?.thumbnails?.slice(-1)[0] || {},
            video_count: item?.gridPlaylistRenderer.videoCountShortText?.simpleText || "N/A"
          }
        };
      }
    };
    module2.exports = GridPlaylistItem;
  }
});

// lib/parser/youtube/others/ChannelMetadata.js
var require_ChannelMetadata2 = __commonJS({
  "lib/parser/youtube/others/ChannelMetadata.js"(exports2, module2) {
    "use strict";
    var ChannelMetadata = class {
      static parse(data) {
        return {
          title: data.channelMetadataRenderer.title,
          description: data.channelMetadataRenderer.description,
          metadata: {
            url: data.channelMetadataRenderer?.channelUrl,
            rss_urls: data.channelMetadataRenderer?.rssUrl,
            vanity_channel_url: data.channelMetadataRenderer?.vanityChannelUrl,
            external_id: data.channelMetadataRenderer?.externalId,
            is_family_safe: data.channelMetadataRenderer?.isFamilySafe,
            keywords: data.channelMetadataRenderer?.keywords
          }
        };
      }
    };
    module2.exports = ChannelMetadata;
  }
});

// lib/parser/youtube/others/ShelfRenderer.js
var require_ShelfRenderer = __commonJS({
  "lib/parser/youtube/others/ShelfRenderer.js"(exports2, module2) {
    "use strict";
    var VideoItem = require_VideoItem();
    var GridVideoItem = require_GridVideoItem();
    var ShelfRenderer = class {
      static parse(data) {
        return {
          title: this.getTitle(data.title),
          videos: this.parseItems(data.content)
        };
      }
      static getTitle(data) {
        if ("runs" in (data || {})) {
          return data.runs.map((run) => run.text).join("");
        } else if ("simpleText" in (data || {})) {
          return data.simpleText;
        }
        return "Others";
      }
      static parseItems(data) {
        let items;
        if ("expandedShelfContentsRenderer" in data) {
          items = data.expandedShelfContentsRenderer.items;
        } else if ("horizontalListRenderer" in data) {
          items = data.horizontalListRenderer.items;
        }
        const videos = "gridVideoRenderer" in items[0] && GridVideoItem.parse(items) || VideoItem.parse(items);
        return videos;
      }
    };
    module2.exports = ShelfRenderer;
  }
});

// lib/parser/youtube/others/CommentThread.js
var require_CommentThread2 = __commonJS({
  "lib/parser/youtube/others/CommentThread.js"(exports2, module2) {
    "use strict";
    var Constants = require_Constants();
    var CommentThread = class {
      static parseItem(item) {
        if (item.commentThreadRenderer || item.commentRenderer) {
          const comment = item?.commentThreadRenderer?.comment || item;
          const like_btn = comment.commentRenderer?.actionButtons?.commentActionButtonsRenderer.likeButton;
          const dislike_btn = comment.commentRenderer?.actionButtons?.commentActionButtonsRenderer.dislikeButton;
          return {
            text: comment.commentRenderer.contentText.runs.map((run) => run.text).join(""),
            author: {
              name: comment.commentRenderer.authorText.simpleText,
              thumbnails: comment.commentRenderer.authorThumbnail.thumbnails,
              channel_id: comment.commentRenderer.authorEndpoint.browseEndpoint.browseId,
              channel_url: Constants.URLS.YT_BASE + comment.commentRenderer.authorEndpoint.browseEndpoint.canonicalBaseUrl
            },
            metadata: {
              published: comment.commentRenderer.publishedTimeText.runs[0].text,
              is_reply: !!item.commentRenderer,
              is_liked: like_btn.toggleButtonRenderer.isToggled,
              is_disliked: dislike_btn.toggleButtonRenderer.isToggled,
              is_pinned: !!comment.commentRenderer.pinnedCommentBadge,
              is_channel_owner: comment.commentRenderer.authorIsChannelOwner,
              like_count: parseInt(like_btn?.toggleButtonRenderer?.accessibilityData?.accessibilityData.label.replace(/\D/g, "")),
              reply_count: comment.commentRenderer.replyCount || 0,
              id: comment.commentRenderer.commentId
            }
          };
        }
      }
    };
    module2.exports = CommentThread;
  }
});

// lib/parser/youtube/index.js
var require_youtube = __commonJS({
  "lib/parser/youtube/index.js"(exports2, module2) {
    "use strict";
    var VideoResultItem = require_VideoResultItem();
    var SearchSuggestionItem = require_SearchSuggestionItem();
    var PlaylistItem = require_PlaylistItem();
    var NotificationItem = require_NotificationItem();
    var VideoItem = require_VideoItem();
    var GridVideoItem = require_GridVideoItem();
    var GridPlaylistItem = require_GridPlaylistItem();
    var ChannelMetadata = require_ChannelMetadata2();
    var ShelfRenderer = require_ShelfRenderer();
    var CommentThread = require_CommentThread2();
    module2.exports = { VideoResultItem, SearchSuggestionItem, PlaylistItem, NotificationItem, VideoItem, GridVideoItem, GridPlaylistItem, ChannelMetadata, ShelfRenderer, CommentThread };
  }
});

// lib/parser/ytmusic/search/SongResultItem.js
var require_SongResultItem = __commonJS({
  "lib/parser/ytmusic/search/SongResultItem.js"(exports2, module2) {
    "use strict";
    var SongResultItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item)).filter((item) => item);
      }
      static parseItem(item) {
        const list_item = item.musicResponsiveListItemRenderer;
        if (list_item.playlistItemData) {
          let artists = list_item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text.runs;
          artists.splice(0, 2);
          const meta = artists.splice(artists.length - 4, 4);
          artists = artists.filter((artist, index) => !(index % 2));
          return {
            id: list_item.playlistItemData.videoId,
            title: list_item.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text.runs[0]?.text,
            artist: artists.map((artist) => artist.text),
            album: meta[1]?.text,
            duration: meta[3]?.text,
            thumbnails: list_item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
          };
        }
      }
    };
    module2.exports = SongResultItem;
  }
});

// lib/parser/ytmusic/search/VideoResultItem.js
var require_VideoResultItem2 = __commonJS({
  "lib/parser/ytmusic/search/VideoResultItem.js"(exports2, module2) {
    "use strict";
    var VideoResultItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item)).filter((item) => item);
      }
      static parseItem(item) {
        const list_item = item.musicResponsiveListItemRenderer;
        if (list_item.playlistItemData) {
          let authors = list_item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text.runs;
          authors.splice(0, 2);
          const meta = authors.splice(authors.length - 4, 4);
          authors = authors.filter((author, index) => !(index % 2));
          return {
            id: list_item.playlistItemData.videoId,
            title: list_item.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text.runs[0]?.text,
            author: authors.map((author) => author.text),
            views: meta[1]?.text,
            duration: meta[3]?.text,
            thumbnails: list_item?.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
          };
        }
      }
    };
    module2.exports = VideoResultItem;
  }
});

// lib/parser/ytmusic/search/AlbumResultItem.js
var require_AlbumResultItem = __commonJS({
  "lib/parser/ytmusic/search/AlbumResultItem.js"(exports2, module2) {
    "use strict";
    var AlbumResultItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item));
      }
      static parseItem(item) {
        const list_item = item.musicResponsiveListItemRenderer;
        return {
          id: list_item.navigationEndpoint.browseEndpoint.browseId,
          title: list_item.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text.runs[0]?.text,
          author: list_item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text.runs[2]?.text,
          year: list_item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text.runs.find((run) => /^[12][0-9]{3}$/.test(run.text)).text,
          thumbnails: list_item?.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails,
          playlistId: list_item?.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint.watchPlaylistEndpoint.playlistId
        };
      }
    };
    module2.exports = AlbumResultItem;
  }
});

// lib/parser/ytmusic/search/ArtistResultItem.js
var require_ArtistResultItem = __commonJS({
  "lib/parser/ytmusic/search/ArtistResultItem.js"(exports2, module2) {
    "use strict";
    var ArtistResultItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item));
      }
      static parseItem(item) {
        const list_item = item.musicResponsiveListItemRenderer;
        return {
          id: list_item.navigationEndpoint.browseEndpoint.browseId,
          name: list_item.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text.runs[0]?.text,
          subscribers: list_item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text.runs[2]?.text,
          thumbnails: list_item?.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
        };
      }
    };
    module2.exports = ArtistResultItem;
  }
});

// lib/parser/ytmusic/search/PlaylistResultItem.js
var require_PlaylistResultItem = __commonJS({
  "lib/parser/ytmusic/search/PlaylistResultItem.js"(exports2, module2) {
    "use strict";
    var PlaylistResultItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item));
      }
      static parseItem(item) {
        const list_item = item.musicResponsiveListItemRenderer;
        const watch_playlist_endpoint = list_item?.overlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchPlaylistEndpoint;
        return {
          id: watch_playlist_endpoint?.playlistId,
          title: list_item.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text.runs[0]?.text,
          author: list_item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text.runs[2]?.text,
          channel_id: list_item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text.runs[2]?.navigationEndpoint?.browseEndpoint.browseId || "0",
          total_items: parseInt(list_item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text.runs[4]?.text.match(/\d+/g))
        };
      }
    };
    module2.exports = PlaylistResultItem;
  }
});

// lib/parser/ytmusic/search/MusicSearchSuggestionItem.js
var require_MusicSearchSuggestionItem = __commonJS({
  "lib/parser/ytmusic/search/MusicSearchSuggestionItem.js"(exports2, module2) {
    "use strict";
    var MusicSearchSuggestionItem = class {
      static parse(data) {
        return {
          query: this.parseItem(data[0]).runs[0].text.trim(),
          results: data.map((item) => this.parseItem(item).runs.map((run) => run.text).join("").trim())
        };
      }
      static parseItem(item) {
        let suggestion;
        if (item.historySuggestionRenderer) {
          suggestion = item.historySuggestionRenderer.suggestion;
        } else {
          suggestion = item.searchSuggestionRenderer.suggestion;
        }
        return suggestion;
      }
    };
    module2.exports = MusicSearchSuggestionItem;
  }
});

// lib/parser/ytmusic/search/TopResultItem.js
var require_TopResultItem = __commonJS({
  "lib/parser/ytmusic/search/TopResultItem.js"(exports2, module2) {
    "use strict";
    var SongResultItem = require_SongResultItem();
    var VideoResultItem = require_VideoResultItem2();
    var AlbumResultItem = require_AlbumResultItem();
    var ArtistResultItem = require_ArtistResultItem();
    var PlaylistResultItem = require_PlaylistResultItem();
    var TopResultItem = class {
      static parse(data) {
        return data.map((item) => {
          const list_item = item.musicResponsiveListItemRenderer;
          const runs = list_item.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text.runs;
          const type = runs[0].text.toLowerCase();
          const parsed_item = (() => {
            switch (type) {
              case "playlist":
                return PlaylistResultItem.parseItem(item);
              case "song":
                return SongResultItem.parseItem(item);
              case "video":
                return VideoResultItem.parseItem(item);
              case "artist":
                return ArtistResultItem.parseItem(item);
              case "album":
                return AlbumResultItem.parseItem(item);
              case "single":
                return AlbumResultItem.parseItem(item);
              default:
                return void 0;
            }
          })();
          if (parsed_item) {
            parsed_item.type = type;
          }
          return parsed_item;
        }).filter((item) => item);
      }
    };
    module2.exports = TopResultItem;
  }
});

// lib/parser/ytmusic/others/PlaylistItem.js
var require_PlaylistItem2 = __commonJS({
  "lib/parser/ytmusic/others/PlaylistItem.js"(exports2, module2) {
    "use strict";
    var Utils = require_Utils();
    var PlaylistItem = class {
      static parse(data) {
        return data.map((item) => this.parseItem(item)).filter((item) => item.id);
      }
      static parseItem(item) {
        const item_renderer = item.musicResponsiveListItemRenderer;
        const fixed_columns = item_renderer.fixedColumns;
        const flex_columns = item_renderer.flexColumns;
        return {
          id: item_renderer.playlistItemData && item_renderer.playlistItemData.videoId,
          title: flex_columns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
          author: flex_columns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
          duration: {
            seconds: Utils.timeToSeconds(fixed_columns[0].musicResponsiveListItemFixedColumnRenderer.text.runs[0].text || "0"),
            simple_text: fixed_columns[0].musicResponsiveListItemFixedColumnRenderer.text.runs[0].text
          },
          thumbnails: item_renderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails
        };
      }
    };
    module2.exports = PlaylistItem;
  }
});

// lib/parser/ytmusic/index.js
var require_ytmusic = __commonJS({
  "lib/parser/ytmusic/index.js"(exports2, module2) {
    "use strict";
    var SongResultItem = require_SongResultItem();
    var VideoResultItem = require_VideoResultItem2();
    var AlbumResultItem = require_AlbumResultItem();
    var ArtistResultItem = require_ArtistResultItem();
    var PlaylistResultItem = require_PlaylistResultItem();
    var MusicSearchSuggestionItem = require_MusicSearchSuggestionItem();
    var TopResultItem = require_TopResultItem();
    var PlaylistItem = require_PlaylistItem2();
    module2.exports = { SongResultItem, VideoResultItem, AlbumResultItem, ArtistResultItem, PlaylistResultItem, MusicSearchSuggestionItem, TopResultItem, PlaylistItem };
  }
});

// lib/parser/index.js
var require_parser = __commonJS({
  "lib/parser/index.js"(exports2, module2) {
    "use strict";
    var Utils = require_Utils();
    var Constants = require_Constants();
    var YTDataItems = require_youtube();
    var YTMusicDataItems = require_ytmusic();
    var Proto2 = require_proto();
    var Parser = class {
      constructor(session, data, args = {}) {
        this.data = data;
        this.session = session;
        this.args = args;
      }
      parse() {
        const client = this.args.client;
        const data_type = this.args.data_type;
        let processed_data;
        switch (client) {
          case "YOUTUBE":
            processed_data = (() => {
              switch (data_type) {
                case "SEARCH":
                  return this.#processSearch();
                case "CHANNEL":
                  return this.#processChannel();
                case "PLAYLIST":
                  return this.#processPlaylist();
                case "SUBSFEED":
                  return this.#processSubscriptionFeed();
                case "HOMEFEED":
                  return this.#processHomeFeed();
                case "LIBRARY":
                  return this.#processLibrary();
                case "TRENDING":
                  return this.#processTrending();
                case "HISTORY":
                  return this.#processHistory();
                case "COMMENTS":
                  return this.#processComments();
                case "VIDEO_INFO":
                  return this.#processVideoInfo();
                case "NOTIFICATIONS":
                  return this.#processNotifications();
                case "SEARCH_SUGGESTIONS":
                  return this.#processSearchSuggestions();
                default:
                  throw new TypeError("undefined is not a function");
              }
            })();
            break;
          case "YTMUSIC":
            processed_data = (() => {
              switch (data_type) {
                case "SEARCH":
                  return this.#processMusicSearch();
                case "PLAYLIST":
                  return this.#processMusicPlaylist();
                case "SEARCH_SUGGESTIONS":
                  return this.#processMusicSearchSuggestions();
                default:
                  throw new TypeError("undefined is not a function");
              }
            })();
            break;
          default:
            throw new Utils.InnertubeError("Invalid client");
        }
        return processed_data;
      }
      #processSearch() {
        const contents = Utils.findNode(this.data, "contents", "contents", 5);
        const processed_data = {};
        const parseItems = (contents2) => {
          const content = contents2[0].itemSectionRenderer.contents;
          processed_data.query = content[0]?.showingResultsForRenderer?.originalQuery?.simpleText || this.args.query;
          processed_data.corrected_query = content[0]?.showingResultsForRenderer?.correctedQueryEndpoint?.searchEndpoint?.query || "N/A";
          processed_data.estimated_results = parseInt(this.data.estimatedResults);
          processed_data.videos = YTDataItems.VideoResultItem.parse(content);
          processed_data.getContinuation = async () => {
            const citem = contents2.find((item) => item.continuationItemRenderer);
            const ctoken = citem.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
            const response = await this.session.actions.search({ ctoken });
            const continuation_items = Utils.findNode(response.data, "onResponseReceivedCommands", "itemSectionRenderer", 4, false);
            return parseItems(continuation_items);
          };
          return processed_data;
        };
        return parseItems(contents);
      }
      #processMusicSearch() {
        const tabs = Utils.findNode(this.data, "contents", "tabs").tabs;
        const contents = Utils.findNode(tabs, "0", "contents", 5);
        const did_you_mean_item = contents.find((content) => content.itemSectionRenderer);
        const did_you_mean_renderer = did_you_mean_item?.itemSectionRenderer.contents[0].didYouMeanRenderer;
        const processed_data = {
          query: "",
          corrected_query: "",
          results: {}
        };
        processed_data.query = this.args.query;
        processed_data.corrected_query = did_you_mean_renderer?.correctedQuery.runs.map((run) => run.text).join("") || "N/A";
        contents.forEach((content) => {
          const section = content?.musicShelfRenderer;
          if (section) {
            const section_title = section.title.runs[0].text;
            const section_items = ({
              ["Top result"]: () => YTMusicDataItems.TopResultItem.parse(section.contents),
              ["Songs"]: () => YTMusicDataItems.SongResultItem.parse(section.contents),
              ["Videos"]: () => YTMusicDataItems.VideoResultItem.parse(section.contents),
              ["Featured playlists"]: () => YTMusicDataItems.PlaylistResultItem.parse(section.contents),
              ["Community playlists"]: () => YTMusicDataItems.PlaylistResultItem.parse(section.contents),
              ["Artists"]: () => YTMusicDataItems.ArtistResultItem.parse(section.contents),
              ["Albums"]: () => YTMusicDataItems.AlbumResultItem.parse(section.contents)
            }[section_title] || (() => {
            }))();
            processed_data.results[section_title.replace(/ /g, "_").toLowerCase()] = section_items;
          }
        });
        return processed_data;
      }
      #processSearchSuggestions() {
        return YTDataItems.SearchSuggestionItem.parse(JSON.parse(this.data.replace(")]}'", "")));
      }
      #processMusicSearchSuggestions() {
        const contents = this.data.contents[0].searchSuggestionsSectionRenderer.contents;
        return YTMusicDataItems.MusicSearchSuggestionItem.parse(contents);
      }
      #processPlaylist() {
        const details = this.data.sidebar.playlistSidebarRenderer.items[0];
        const metadata = {
          title: this.data.metadata.playlistMetadataRenderer.title,
          description: details.playlistSidebarPrimaryInfoRenderer?.description?.simpleText || "N/A",
          total_items: details.playlistSidebarPrimaryInfoRenderer.stats[0].runs[0]?.text || "N/A",
          last_updated: details.playlistSidebarPrimaryInfoRenderer.stats[2].runs[1]?.text || "N/A",
          views: details.playlistSidebarPrimaryInfoRenderer.stats[1].simpleText
        };
        const list = Utils.findNode(this.data, "contents", "contents", 13, false);
        const items = YTDataItems.PlaylistItem.parse(list.contents);
        return {
          ...metadata,
          items
        };
      }
      #processMusicPlaylist() {
        const details = this.data.header.musicDetailHeaderRenderer;
        const metadata = {
          title: details?.title?.runs[0].text,
          description: details?.description?.runs?.map((run) => run.text).join("") || "N/A",
          total_items: parseInt(details?.secondSubtitle?.runs[0].text.match(/\d+/g)),
          duration: details?.secondSubtitle?.runs[2].text,
          year: details?.subtitle?.runs[4].text
        };
        const contents = this.data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents;
        const playlist_content = contents[0].musicPlaylistShelfRenderer.contents;
        const items = YTMusicDataItems.PlaylistItem.parse(playlist_content);
        return {
          ...metadata,
          items
        };
      }
      #processVideoInfo() {
        const playability_status = this.data.playabilityStatus;
        if (playability_status.status == "ERROR")
          throw new Error(`Could not retrieve video details: ${playability_status.status} - ${playability_status.reason}`);
        const details = this.data.videoDetails;
        const microformat = this.data.microformat.playerMicroformatRenderer;
        const streaming_data = this.data.streamingData;
        const mf_raw_data = Object.entries(microformat);
        const dt_raw_data = Object.entries(details);
        const processed_data = {
          id: "",
          title: "",
          description: "",
          thumbnail: [],
          metadata: {}
        };
        mf_raw_data.forEach((entry) => {
          const key = Utils.camelToSnake(entry[0]);
          if (Constants.METADATA_KEYS.includes(key)) {
            if (key == "view_count") {
              processed_data.metadata[key] = parseInt(entry[1]);
            } else if (key == "owner_profile_url") {
              processed_data.metadata.channel_url = entry[1];
            } else if (key == "owner_channel_name") {
              processed_data.metadata.channel_name = entry[1];
            } else {
              processed_data.metadata[key] = entry[1];
            }
          } else {
            processed_data[key] = entry[1];
          }
        });
        dt_raw_data.forEach((entry) => {
          const key = Utils.camelToSnake(entry[0]);
          if (Constants.BLACKLISTED_KEYS.includes(key))
            return;
          if (Constants.METADATA_KEYS.includes(key)) {
            if (key == "view_count") {
              processed_data.metadata[key] = parseInt(entry[1]);
            } else {
              processed_data.metadata[key] = entry[1];
            }
          } else if (key == "short_description") {
            processed_data.description = entry[1];
          } else if (key == "thumbnail") {
            processed_data.thumbnail = entry[1].thumbnails.slice(-1)[0];
          } else if (key == "video_id") {
            processed_data.id = entry[1];
          } else {
            processed_data[key] = entry[1];
          }
        });
        if (this.data.continuation) {
          const primary_info_renderer = this.data.continuation.contents.twoColumnWatchNextResults.results.results.contents.find((item) => item.videoPrimaryInfoRenderer).videoPrimaryInfoRenderer;
          const secondary_info_renderer = this.data.continuation.contents.twoColumnWatchNextResults.results.results.contents.find((item) => item.videoSecondaryInfoRenderer).videoSecondaryInfoRenderer;
          const like_btn = primary_info_renderer.videoActions.menuRenderer.topLevelButtons.find((item) => item.toggleButtonRenderer.defaultIcon.iconType == "LIKE");
          const dislike_btn = primary_info_renderer.videoActions.menuRenderer.topLevelButtons.find((item) => item.toggleButtonRenderer.defaultIcon.iconType == "DISLIKE");
          const notification_toggle_btn = secondary_info_renderer.subscribeButton.subscribeButtonRenderer?.notificationPreferenceButton?.subscriptionNotificationToggleButtonRenderer;
          processed_data.metadata.is_liked = like_btn.toggleButtonRenderer.isToggled;
          processed_data.metadata.is_disliked = dislike_btn.toggleButtonRenderer.isToggled;
          processed_data.metadata.is_subscribed = secondary_info_renderer.subscribeButton.subscribeButtonRenderer?.subscribed || false;
          processed_data.metadata.subscriber_count = secondary_info_renderer.owner.videoOwnerRenderer?.subscriberCountText?.simpleText || "N/A";
          processed_data.metadata.current_notification_preference = notification_toggle_btn?.states.find((state) => state.stateId == notification_toggle_btn.currentStateId).state.buttonRenderer.icon.iconType || "N/A";
          processed_data.metadata.publish_date_text = primary_info_renderer.dateText.simpleText;
          if (processed_data.metadata.allow_ratings) {
            processed_data.metadata.likes = {
              count: parseInt(like_btn.toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(/\D/g, "")),
              short_count_text: like_btn.toggleButtonRenderer.defaultText.simpleText
            };
          }
          processed_data.metadata.owner_badges = secondary_info_renderer.owner.videoOwnerRenderer?.badges?.map((badge) => badge.metadataBadgeRenderer.tooltip) || [];
        }
        if (streaming_data && streaming_data.adaptiveFormats) {
          processed_data.metadata.available_qualities = [...new Set(streaming_data.adaptiveFormats.filter((v) => v.qualityLabel).map((v) => v.qualityLabel).sort((a, b) => +a.replace(/\D/gi, "") - +b.replace(/\D/gi, "")))];
        } else {
          processed_data.metadata.available_qualities = [];
        }
        return processed_data;
      }
      #processComments() {
        if (!this.data.onResponseReceivedEndpoints)
          throw new Utils.UnavailableContentError("Comments section not available", this.args);
        const header = Utils.findNode(this.data, "onResponseReceivedEndpoints", "commentsHeaderRenderer", 5, false);
        const comment_count = parseInt(header.commentsHeaderRenderer.countText.runs[0].text.replace(/,/g, ""));
        const page_count = parseInt(comment_count / 20);
        const parseComments = (data) => {
          const items = Utils.findNode(data, "onResponseReceivedEndpoints", "commentRenderer", 4, false);
          const response = {
            page_count,
            comment_count,
            items: []
          };
          response.items = items.map((item) => {
            const comment = YTDataItems.CommentThread.parseItem(item);
            if (comment) {
              comment.like = () => this.session.actions.engage("comment/perform_comment_action", { comment_action: "like", comment_id: comment.metadata.id, video_id: this.args.video_id });
              comment.dislike = () => this.session.actions.engage("comment/perform_comment_action", { comment_action: "dislike", comment_id: comment.metadata.id, video_id: this.args.video_id });
              comment.reply = (text) => this.session.actions.engage("comment/create_comment_reply", { text, comment_id: comment.metadata.id, video_id: this.args.video_id });
              comment.report = async () => {
                const payload = Utils.findNode(item, "commentThreadRenderer", "params", 10, false);
                const form = await this.session.actions.flag("flag/get_form", { params: payload.params });
                const action = Utils.findNode(form, "actions", "flagAction", 13, false);
                const flag = await this.session.actions.flag("flag/flag", { action: action.flagAction });
                return flag;
              };
              comment.getReplies = async () => {
                if (comment.metadata.reply_count === 0)
                  throw new Utils.InnertubeError("This comment has no replies", comment);
                const payload = Proto2.encodeCommentRepliesParams(this.args.video_id, comment.metadata.id);
                const next = await this.session.actions.next({ ctoken: payload });
                return parseComments(next.data);
              };
              comment.translate = async (target_language) => {
                const response2 = await this.session.actions.engage("comment/perform_comment_action", {
                  text: comment.text,
                  comment_action: "translate",
                  comment_id: comment.metadata.id,
                  video_id: this.args.video_id,
                  target_language
                });
                const translated_content = Utils.findNode(response2.data, "frameworkUpdates", "content", 7, false);
                return {
                  success: response2.success,
                  status_code: response2.status_code,
                  translated_content: translated_content.content
                };
              };
              return comment;
            }
          }).filter((c) => c);
          response.comment = (text) => this.session.actions.engage("comment/create_comment", { video_id: this.args.video_id, text });
          response.getContinuation = async () => {
            const continuation_item = items.find((item) => item.continuationItemRenderer);
            if (!continuation_item)
              throw new Utils.InnertubeError("You've reached the end");
            const is_reply = !!continuation_item.continuationItemRenderer.button;
            const payload = Utils.findNode(continuation_item, "continuationItemRenderer", "token", is_reply ? 5 : 3);
            const next = await this.session.actions.next({ ctoken: payload.token });
            return parseComments(next.data);
          };
          return response;
        };
        return parseComments(this.data);
      }
      #processHomeFeed() {
        const contents = Utils.findNode(this.data, "contents", "videoRenderer", 9, false);
        const parseItems = (contents2) => {
          const videos = YTDataItems.VideoItem.parse(contents2);
          const getContinuation = async () => {
            const citem = contents2.find((item) => item.continuationItemRenderer);
            const ctoken = citem.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
            const response = await this.session.actions.browse(ctoken, { is_ctoken: true });
            return parseItems(response.data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems);
          };
          return { videos, getContinuation };
        };
        return parseItems(contents);
      }
      #processLibrary() {
        const profile_data = Utils.findNode(this.data, "contents", "profileColumnRenderer", 3);
        const stats_data = profile_data.profileColumnRenderer.items.find((item) => item.profileColumnStatsRenderer);
        const stats_items = stats_data.profileColumnStatsRenderer.items;
        const userinfo = profile_data.profileColumnRenderer.items.find((item) => item.profileColumnUserInfoRenderer);
        const stats = {};
        stats_items.forEach((item) => {
          const label = item.profileColumnStatsEntryRenderer.label.runs.map((run) => run.text).join("");
          stats[label.toLowerCase()] = parseInt(item.profileColumnStatsEntryRenderer.value.simpleText);
        });
        const profile = {
          name: userinfo.profileColumnUserInfoRenderer?.title?.simpleText,
          thumbnails: userinfo.profileColumnUserInfoRenderer?.thumbnail.thumbnails,
          stats
        };
        return {
          profile
        };
      }
      #processSubscriptionFeed() {
        const contents = Utils.findNode(this.data, "contents", "contents", 9, false);
        const subsfeed = { items: [] };
        const parseItems = (contents2) => {
          contents2.forEach((section) => {
            if (!section.itemSectionRenderer)
              return;
            const section_contents = section.itemSectionRenderer.contents[0];
            const section_title = section_contents.shelfRenderer.title.runs[0].text;
            const section_items = section_contents.shelfRenderer.content.gridRenderer.items;
            const items = YTDataItems.GridVideoItem.parse(section_items);
            subsfeed.items.push({
              date: section_title,
              videos: items
            });
          });
          subsfeed.getContinuation = async () => {
            const citem = contents2.find((item) => item.continuationItemRenderer);
            const ctoken = citem.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
            const response = await this.session.actions.browse(ctoken, { is_ctoken: true });
            const ccontents = Utils.findNode(response.data, "onResponseReceivedActions", "itemSectionRenderer", 4, false);
            subsfeed.items = [];
            return parseItems(ccontents);
          };
          return subsfeed;
        };
        return parseItems(contents);
      }
      #processChannel() {
        const tabs = this.data.contents.twoColumnBrowseResultsRenderer.tabs;
        const metadata = this.data.metadata;
        const home_tab = tabs.find((tab) => tab.tabRenderer.title == "Home");
        const home_contents = home_tab.tabRenderer.content.sectionListRenderer.contents;
        const home_shelves = [];
        home_contents.forEach((content) => {
          if (content.itemSectionRenderer) {
            const contents = content.itemSectionRenderer.contents[0];
            const list = contents?.shelfRenderer?.content.horizontalListRenderer;
            if (!list)
              return;
            const shelf = {
              title: contents.shelfRenderer.title.runs[0].text,
              content: []
            };
            shelf.content = list.items.map((item) => {
              if (item.gridVideoRenderer) {
                return YTDataItems.GridVideoItem.parseItem(item);
              } else if (item.gridPlaylistRenderer) {
                return YTDataItems.GridPlaylistItem.parseItem(item);
              }
            });
            home_shelves.push(shelf);
          }
        });
        const ch_info = YTDataItems.ChannelMetadata.parse(metadata);
        return {
          ...ch_info,
          content: {
            home_page: home_shelves,
            getVideos: () => {
            },
            getPlaylists: () => {
            },
            getCommunity: () => {
            },
            getChannels: () => {
            },
            getAbout: () => {
            }
          }
        };
      }
      #processNotifications() {
        const contents = this.data.actions[0].openPopupAction.popup.multiPageMenuRenderer.sections[0];
        if (!contents.multiPageMenuNotificationSectionRenderer)
          throw new Utils.InnertubeError("No notifications");
        const parseItems = (items) => {
          const parsed_items = YTDataItems.NotificationItem.parse(items);
          const getContinuation = async () => {
            const citem = items.find((item) => item.continuationItemRenderer);
            const ctoken = citem?.continuationItemRenderer?.continuationEndpoint?.getNotificationMenuEndpoint?.ctoken;
            const response = await this.session.actions.notifications("get_notification_menu", { ctoken });
            return parseItems(response.data.actions[0].appendContinuationItemsAction.continuationItems);
          };
          return { items: parsed_items, getContinuation };
        };
        return parseItems(contents.multiPageMenuNotificationSectionRenderer.items);
      }
      #processTrending() {
        const tabs = Utils.findNode(this.data, "contents", "tabRenderer", 4, false);
        const categories = {};
        tabs.forEach((tab) => {
          const tab_renderer = tab.tabRenderer;
          const tab_content = tab_renderer?.content;
          const category_title = tab_renderer.title.toLowerCase();
          categories[category_title] = {};
          if (tab_content) {
            const contents = tab_content.sectionListRenderer.contents;
            categories[category_title].content = contents.map((content) => {
              const shelf = content.itemSectionRenderer.contents[0].shelfRenderer;
              const parsed_shelf = YTDataItems.ShelfRenderer.parse(shelf);
              return parsed_shelf;
            });
          } else {
            const params = tab_renderer.endpoint.browseEndpoint.params;
            categories[category_title].getVideos = async () => {
              const response = await this.session.actions.browse("FEtrending", { params });
              const tabs2 = Utils.findNode(response, "contents", "tabRenderer", 4, false);
              const tab2 = tabs2.find((tab3) => tab3.tabRenderer.title === tab_renderer.title);
              const contents = tab2.tabRenderer.content.sectionListRenderer.contents;
              const items = Utils.findNode(contents, "itemSectionRenderer", "items", 8, false);
              return YTDataItems.VideoItem.parse(items);
            };
          }
        });
        return categories;
      }
      #processHistory() {
        const contents = Utils.findNode(this.data, "contents", "videoRenderer", 9, false);
        const history = { items: [] };
        const parseItems = (contents2) => {
          contents2.forEach((section) => {
            if (!section.itemSectionRenderer)
              return;
            const header = section.itemSectionRenderer.header.itemSectionHeaderRenderer.title;
            const section_title = header?.simpleText || header?.runs.map((run) => run.text).join("");
            const contents3 = section.itemSectionRenderer.contents;
            const section_items = YTDataItems.VideoItem.parse(contents3);
            history.items.push({
              date: section_title,
              videos: section_items
            });
          });
          history.getContinuation = async () => {
            const citem = contents2.find((item) => item.continuationItemRenderer);
            const ctoken = citem.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
            const response = await this.session.actions.browse(ctoken, { is_ctoken: true });
            history.items = [];
            return parseItems(response.data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems);
          };
          return history;
        };
        return parseItems(contents);
      }
    };
    module2.exports = Parser;
  }
});

// lib/Innertube.js
var OAuth = require_OAuth();
var Actions = require_Actions();
var SessionBuilder = require_SessionBuilder();
var AccountManager = require_AccountManager();
var PlaylistManager = require_PlaylistManager();
var InteractionManager = require_InteractionManager();
var Search = require_Search();
var VideoInfo = require_VideoInfo();
var Channel = require_Channel2();
var Playlist = require_Playlist2();
var Library = require_Library();
var History = require_History();
var Comments = require_Comments();
var YTMusic = require_Music();
var FilterableFeed = require_FilterableFeed();
var TabbedFeed = require_TabbedFeed();
var EventEmitter = require("events");
var { PassThrough } = false ? null : require("stream");
var Request = require_Request();
var {
  InnertubeError,
  throwIfMissing,
  generateRandomString
} = require_Utils();
var OldParser = require_parser();
var Proto = require_proto();
var Innertube = class {
  #player;
  #request;
  constructor(config) {
    this.config = config || {};
    return this.#init();
  }
  async #init() {
    const request = new Request(this.config);
    const session = await new SessionBuilder(this.config, request.instance).build();
    this.key = session.key;
    this.version = session.api_version;
    this.context = session.context;
    this.logged_in = !!this.config.cookie;
    this.sts = session.player.sts;
    this.player_url = session.player.url;
    this.#player = session.player;
    request.setSession(this);
    this.#request = request.instance;
    this.ev = new EventEmitter();
    this.oauth = new OAuth(this.ev, request.instance);
    this.actions = new Actions(this);
    this.account = new AccountManager(this.actions);
    this.playlist = new PlaylistManager(this.actions);
    this.interact = new InteractionManager(this.actions);
    this.music = new YTMusic(this);
    return this;
  }
  signIn(credentials = {}) {
    return new Promise(async (resolve) => {
      this.oauth.init(credentials);
      if (this.oauth.validateCredentials()) {
        await this.oauth.checkAccessTokenValidity();
        this.logged_in = true;
        resolve();
      }
      this.ev.on("auth", (data) => {
        this.logged_in = true;
        if (data.status === "SUCCESS")
          resolve();
      });
    });
  }
  async signOut() {
    if (!this.logged_in)
      throw new InnertubeError("You are not signed in");
    const response = await this.oauth.revokeAccessToken();
    this.logged_in = false;
    return response;
  }
  async getInfo(video_id) {
    throwIfMissing({ video_id });
    const cpn = generateRandomString(16);
    const initial_info = this.actions.getVideoInfo(video_id, cpn);
    const continuation = this.actions.next({ video_id });
    const response = await Promise.all([initial_info, continuation]);
    return new VideoInfo(response, this.actions, this.#player, cpn);
  }
  async getBasicInfo(video_id) {
    throwIfMissing({ video_id });
    const cpn = generateRandomString(16);
    const response = await this.actions.getVideoInfo(video_id, cpn);
    return new VideoInfo([response, {}], this.actions, this.#player, cpn);
  }
  async search(query, filters = {}) {
    throwIfMissing({ query });
    const response = await this.actions.search({ query, filters });
    return new Search(this.actions, response.data);
  }
  async getSearchSuggestions(query, options = { client: "YOUTUBE" }) {
    throwIfMissing({ query });
    const response = await this.actions.getSearchSuggestions(options.client, query);
    if (options.client === "YTMUSIC" && !response.data.contents)
      return [];
    const suggestions = new OldParser(this, response.data, {
      client: options.client,
      data_type: "SEARCH_SUGGESTIONS"
    }).parse();
    return suggestions;
  }
  async getComments(video_id, sort_by) {
    throwIfMissing({ video_id });
    const payload = Proto.encodeCommentsSectionParams(video_id, {
      sort_by: sort_by || "TOP_COMMENTS"
    });
    const response = await this.actions.next({ ctoken: payload });
    return new Comments(this.actions, response.data);
  }
  async getHomeFeed() {
    const response = await this.actions.browse("FEwhat_to_watch");
    return new FilterableFeed(this.actions, response.data);
  }
  async getLibrary() {
    const response = await this.actions.browse("FElibrary");
    return new Library(response.data, this.actions);
  }
  async getHistory() {
    const response = await this.actions.browse("FEhistory");
    return new History(this.actions, response.data);
  }
  async getTrending() {
    const response = await this.actions.browse("FEtrending");
    return new TabbedFeed(this.actions, response.data);
  }
  async getSubscriptionsFeed() {
    const response = await this.actions.browse("FEsubscriptions");
    const subsfeed = new OldParser(this, response, {
      client: "YOUTUBE",
      data_type: "SUBSFEED"
    }).parse();
    return subsfeed;
  }
  async getChannel(id) {
    throwIfMissing({ id });
    const response = await this.actions.browse(id);
    return new Channel(this.actions, response.data);
  }
  async getNotifications() {
    const response = await this.actions.notifications("get_notification_menu");
    const notifications = new OldParser(this, response.data, {
      client: "YOUTUBE",
      data_type: "NOTIFICATIONS"
    }).parse();
    return notifications;
  }
  async getUnseenNotificationsCount() {
    const response = await this.actions.notifications("get_unseen_count");
    return response.data.unseenCount;
  }
  async getPlaylist(playlist_id) {
    throwIfMissing({ playlist_id });
    const response = await this.actions.browse(`VL${playlist_id.replace(/VL/g, "")}`);
    return new Playlist(this.actions, response.data);
  }
  async getStreamingData(video_id, options = {}) {
    const info = await this.getBasicInfo(video_id);
    return info.chooseFormat(options);
  }
  download(video_id, options = {}) {
    throwIfMissing({ video_id });
    const stream = new PassThrough();
    (async () => {
      const info = await this.getBasicInfo(video_id);
      stream.emit("info", info);
      info.download(options, stream);
    })();
    return stream;
  }
  getPlayer() {
    return this.#player;
  }
  get request() {
    return this.#request;
  }
};
module.exports = Innertube;
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
//# sourceMappingURL=node.js.map