# Changelog

## [3.0.0](https://github.com/LuanRT/YouTube.js/compare/v2.9.0...v3.0.0) (2023-02-17)


### ⚠ BREAKING CHANGES

* cleanup platform support ([#306](https://github.com/LuanRT/YouTube.js/issues/306))

### Features

* add parser support for MultiImage community posts ([#298](https://github.com/LuanRT/YouTube.js/issues/298)) ([de61782](https://github.com/LuanRT/YouTube.js/commit/de61782f1a673cbe66ae9b410341e39b7501ba84))
* add support for hashtag feeds ([#312](https://github.com/LuanRT/YouTube.js/issues/312)) ([bf12740](https://github.com/LuanRT/YouTube.js/commit/bf12740333a82c26fe84e7c702c2fbb8859814fc))
* add support for YouTube Kids ([#291](https://github.com/LuanRT/YouTube.js/issues/291)) ([2bbefef](https://github.com/LuanRT/YouTube.js/commit/2bbefefbb7cb061f3e7b686158b7568c32f0da5d))
* allow checking whether a channel has optional tabs ([#296](https://github.com/LuanRT/YouTube.js/issues/296)) ([ceefbed](https://github.com/LuanRT/YouTube.js/commit/ceefbed98c70bb936e2d2df58c02834842acfdfc))
* **Channel:** Add getters for all optional tabs ([#303](https://github.com/LuanRT/YouTube.js/issues/303)) ([b2900f4](https://github.com/LuanRT/YouTube.js/commit/b2900f48a7aa4c22635e1819ba9f636e81964f2c))
* **Channel:** add support for sorting the playlist tab ([#295](https://github.com/LuanRT/YouTube.js/issues/295)) ([50ef712](https://github.com/LuanRT/YouTube.js/commit/50ef71284db41e5f94bb511892651d22a1d363a0))
* extract channel error alert ([0b99180](https://github.com/LuanRT/YouTube.js/commit/0b991800a5c67f0e702251982b52eb8531f36f19))
* **FormatUtils:** support multiple audio tracks in the DASH manifest ([#308](https://github.com/LuanRT/YouTube.js/issues/308)) ([a69e43b](https://github.com/LuanRT/YouTube.js/commit/a69e43bf3ae02f2428c4aa86f647e3e5e0db5ba6))
* improve support for dubbed content ([#293](https://github.com/LuanRT/YouTube.js/issues/293)) ([d6c5a9b](https://github.com/LuanRT/YouTube.js/commit/d6c5a9b971444d0cd746aaf5310d3389793680ea))
* parse isLive in CompactVideo ([#294](https://github.com/LuanRT/YouTube.js/issues/294)) ([2acb7da](https://github.com/LuanRT/YouTube.js/commit/2acb7da0198bfeca6ff911cf95cf06a220fccaa5))
* **parser:** add `ChannelAgeGate` node ([1cdf701](https://github.com/LuanRT/YouTube.js/commit/1cdf701c8403db6b681a26ecb1df2daa51add454))
* **parser:** Text#toHTML ([#300](https://github.com/LuanRT/YouTube.js/issues/300)) ([e82e23d](https://github.com/LuanRT/YouTube.js/commit/e82e23dfbb24dff3ddf45754c7319d783990e254))
* **ytkids:** add `getChannel()` ([#292](https://github.com/LuanRT/YouTube.js/issues/292)) ([0fc29f0](https://github.com/LuanRT/YouTube.js/commit/0fc29f0bbf965215146a6ae192494c74e6cefcbb))


### Bug Fixes

* assign MetadataBadge's label ([#311](https://github.com/LuanRT/YouTube.js/issues/311)) ([e37cf62](https://github.com/LuanRT/YouTube.js/commit/e37cf627322f688fcef18d41345f77cbccd58829))
* **ChannelAboutFullMetadata:** fix error when there are no primary links ([#299](https://github.com/LuanRT/YouTube.js/issues/299)) ([f62c66d](https://github.com/LuanRT/YouTube.js/commit/f62c66db396ba7d2f93007414101112b49d8375f))
* **TopicChannelDetails:** avatar and subtitle parsing ([#302](https://github.com/LuanRT/YouTube.js/issues/302)) ([d612590](https://github.com/LuanRT/YouTube.js/commit/d612590530f5fe590fee969810b1dd44c37f0457))
* **VideoInfo:** Gracefully handle missing watch next continuation ([#288](https://github.com/LuanRT/YouTube.js/issues/288)) ([13ad377](https://github.com/LuanRT/YouTube.js/commit/13ad3774c9783ed2a9f286aeee88110bd43b3a73))


### Code Refactoring

* cleanup platform support ([#306](https://github.com/LuanRT/YouTube.js/issues/306)) ([2ccbe2c](https://github.com/LuanRT/YouTube.js/commit/2ccbe2ce6260ace3bfac8b4b391e583fbcc4e286))