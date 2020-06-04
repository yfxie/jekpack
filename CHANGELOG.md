# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.8.2](https://github.com/yfxie/jekpack/compare/v1.8.1...v1.8.2) (2020-06-04)


### Bug Fixes

* added context root to modules of resolveLoader ([f27f6f3](https://github.com/yfxie/jekpack/commit/f27f6f3cd4ebbfb6c2fe513af2424ac5a4d6a8e2))

### [1.8.1](https://github.com/yfxie/jekpack/compare/v1.8.0...v1.8.1) (2020-06-04)

# [1.8.0](https://github.com/yfxie/jekpack/compare/v1.7.0...v1.8.0) (2019-11-04)


### Features

* default .gitignore ([c6b09bf](https://github.com/yfxie/jekpack/commit/c6b09bf))
* determine the path manifest from webpack output.path ([bbc2fe5](https://github.com/yfxie/jekpack/commit/bbc2fe5))
* initial scripts ([35e4102](https://github.com/yfxie/jekpack/commit/35e4102))



# [1.7.0](https://github.com/yfxie/jekpack/compare/v1.6.2...v1.7.0) (2019-08-24)


### Features

* upgrade the version of jekyll to 4.0 ([809735e](https://github.com/yfxie/jekpack/commit/809735e))



## [1.6.2](https://github.com/yfxie/jekpack/compare/v1.6.1...v1.6.2) (2019-07-16)


### Bug Fixes

* load host config ([6dfbafe](https://github.com/yfxie/jekpack/commit/6dfbafe))



## [1.6.1](https://github.com/yfxie/jekpack/compare/v1.6.0...v1.6.1) (2019-07-16)


### Bug Fixes

* removed url-loader ([40f7b26](https://github.com/yfxie/jekpack/commit/40f7b26))



# [1.6.0](https://github.com/yfxie/jekpack/compare/v1.5.3...v1.6.0) (2019-07-16)


### Features

* added more static extensions to file-loader ([289e664](https://github.com/yfxie/jekpack/commit/289e664))



## [1.5.3](https://github.com/yfxie/jekpack/compare/v1.5.2...v1.5.3) (2019-07-15)


### Bug Fixes

* mkdir -p ([994d627](https://github.com/yfxie/jekpack/commit/994d627))



## [1.5.2](https://github.com/yfxie/jekpack/compare/v1.5.1...v1.5.2) (2019-07-15)


### Bug Fixes

* resolved exception when project has Gemfile ([f66e53e](https://github.com/yfxie/jekpack/commit/f66e53e))



## [1.5.1](https://github.com/yfxie/jekpack/compare/v1.5.0...v1.5.1) (2019-07-14)


### Bug Fixes

* missing media assets in manifest after rebuilding ([998a272](https://github.com/yfxie/jekpack/commit/998a272))



# [1.5.0](https://github.com/yfxie/jekpack/compare/v1.4.0...v1.5.0) (2019-07-01)


### Features

* eval filter ([91740c5](https://github.com/yfxie/jekpack/commit/91740c5))



# [1.4.0](https://github.com/yfxie/jekpack/compare/v1.3.6...v1.4.0) (2019-06-26)


### Features

* redirect rules ([5dd3de5](https://github.com/yfxie/jekpack/commit/5dd3de5))



## [1.3.6](https://github.com/yfxie/jekpack/compare/v1.3.5...v1.3.6) (2019-06-25)


### Bug Fixes

* 🐛 media assets ([f596408](https://github.com/yfxie/jekpack/commit/f596408))



## [1.3.5](https://github.com/yfxie/jekpack/compare/v1.3.4...v1.3.5) (2019-05-27)


### Bug Fixes

* 🐛 fixed HMR ([bd06135](https://github.com/yfxie/jekpack/commit/bd06135))



## [1.3.4](https://github.com/yfxie/jekpack/compare/v1.3.3...v1.3.4) (2019-05-27)


### Bug Fixes

* 🐛 fixed the feature HMR ([ed04d2f](https://github.com/yfxie/jekpack/commit/ed04d2f))



## [1.3.3](https://github.com/yfxie/jekpack/compare/v1.3.2...v1.3.3) (2019-04-07)


### Bug Fixes

* 🐛 added tzinfo for the other platforms ([0176769](https://github.com/yfxie/jekpack/commit/0176769))



## [1.3.2](https://github.com/yfxie/jekpack/compare/v1.3.1...v1.3.2) (2019-04-06)


### Bug Fixes

* the new command doesn't create the media folder ([84c2a96](https://github.com/yfxie/jekpack/commit/84c2a96))



## [1.3.1](https://github.com/yfxie/jekpack/compare/v1.3.0...v1.3.1) (2019-04-06)


### Bug Fixes

* fixed media resources cannot be referred to after the second build ([0c6bc47](https://github.com/yfxie/jekpack/commit/0c6bc47))
* removed hardsource plugin due to too many unresolved issues ([928b97a](https://github.com/yfxie/jekpack/commit/928b97a))



# [1.3.0](https://github.com/yfxie/jekpack/compare/v1.2.0...v1.3.0) (2019-04-05)


### Features

* **webpack:** added hard-source plugin to speed up building time ([aeb99fe](https://github.com/yfxie/jekpack/commit/aeb99fe))



# [1.2.0](https://github.com/yfxie/jekpack/compare/v1.1.0...v1.2.0) (2019-04-02)


### Bug Fixes

* 🐛 removed slash ([38ac849](https://github.com/yfxie/jekpack/commit/38ac849))


### Features

* 🎸 page_stylesheet_tag and page_javascript_tag ([c902cf4](https://github.com/yfxie/jekpack/commit/c902cf4))



# [1.1.0](https://github.com/yfxie/jekpack/compare/v1.0.1...v1.1.0) (2019-03-31)


### Bug Fixes

* 🐛 avoid cached manifest ([3201600](https://github.com/yfxie/jekpack/commit/3201600))


### Features

* **commands:** develop build and jekyll commands ([fcc92bf](https://github.com/yfxie/jekpack/commit/fcc92bf))
* 🎸 media assets ([81275bd](https://github.com/yfxie/jekpack/commit/81275bd))
* 🎸 read the jekyll config from host ([2faeda3](https://github.com/yfxie/jekpack/commit/2faeda3))
* prompt inquiry for the issue of project already existing ([7122286](https://github.com/yfxie/jekpack/commit/7122286))



## 1.0.1 (2019-03-21)


### Bug Fixes

* **bin:** fixed deploy option ([0f83a3b](https://github.com/yfxie/jekpack/commit/0f83a3b))


### Features

* **initial-release:** added release script ([1dade64](https://github.com/yfxie/jekpack/commit/1dade64))



# 1.0.0 (2019-03-21)


### Features

* **initial-release:** added release script ([1dade64](https://github.com/yfxie/jekpack/commit/1dade64))
