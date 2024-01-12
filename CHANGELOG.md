# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.3](https://github.com/gabrielh-silvestre/s1-agents/compare/v0.3.2...v0.3.3) (2024-01-12)


### Bug Fixes

* adjust build script on publish ([b5a7982](https://github.com/gabrielh-silvestre/s1-agents/commit/b5a7982558fc93ac6ef206b7783c6e8563e6baa1))

### [0.3.2](https://github.com/gabrielh-silvestre/s1-agents/compare/v0.3.1...v0.3.2) (2024-01-12)

### [0.3.1](https://github.com/gabrielh-silvestre/s1-agents/compare/v0.3.0...v0.3.1) (2024-01-12)

## [0.3.0](https://github.com/gabrielh-silvestre/s1-agents/compare/v0.2.4...v0.3.0) (2023-12-27)


### Features

* allow handlers to have multiple agents ([f2701f2](https://github.com/gabrielh-silvestre/s1-agents/commit/f2701f2235b313193eb901e42a1dd62b57e1545f))

### [0.2.4](https://github.com/gabrielh-silvestre/s1-agents/compare/v0.2.3...v0.2.4) (2023-12-26)


### Bug Fixes

* only control execution on handler ([5cae649](https://github.com/gabrielh-silvestre/s1-agents/commit/5cae649f24ee4930a7b24de3ccede5d5b80a9a36))

### [0.2.3](https://github.com/gabrielh-silvestre/s1-agents/compare/v0.2.2...v0.2.3) (2023-12-26)

### [0.2.2](https://github.com/gabrielh-silvestre/s1-agents/compare/v0.2.1...v0.2.2) (2023-12-12)

### [0.2.1](https://github.com/gabrielh-silvestre/s1-agents/compare/v0.2.0...v0.2.1) (2023-12-12)

## [0.2.0](https://github.com/gabrielh-silvestre/s1-agents/compare/v0.1.1...v0.2.0) (2023-12-12)


### Features

* add ClearHandler for clearing chat messages ([e121c4b](https://github.com/gabrielh-silvestre/s1-agents/commit/e121c4bac0ca001088b2872caf751bd2e198b2cd))
* add image handling functionality ([8b00b7f](https://github.com/gabrielh-silvestre/s1-agents/commit/8b00b7f6cfa5ca4f816d6a7b7c340d7482430c1f))
* change chat generation method ([5005055](https://github.com/gabrielh-silvestre/s1-agents/commit/5005055423b8a9724741fcc4668de99a2a306825))


### Bug Fixes

* use yield on proccessStream ([85225e3](https://github.com/gabrielh-silvestre/s1-agents/commit/85225e38ac16420d5a5b7027c7a5089da4dd80ea))

### [0.1.1](https://github.com/gabrielh-silvestre/s1-agents/compare/v0.1.0...v0.1.1) (2023-11-26)

## 0.1.0 (2023-11-26)


### Features

* allow gpt to answer audios ([c450fbb](https://github.com/gabrielh-silvestre/s1-agents/commit/c450fbb44b1737692e91cd1bd8149eedcd7137c8))
* allow gpt to answer with audio ([55ed283](https://github.com/gabrielh-silvestre/s1-agents/commit/55ed283eac071f6b523b1519089fec41b271c48a))
* change chat completion to Agent thread ([168ec5c](https://github.com/gabrielh-silvestre/s1-agents/commit/168ec5c62619ca04ed61454b3098cb014d8cd158))
* connect whatsapp and chat gpt ([24c6f60](https://github.com/gabrielh-silvestre/s1-agents/commit/24c6f602d0a23d437e6b9bbeb4cb591160d66af5))
* create first prompt ([ba95182](https://github.com/gabrielh-silvestre/s1-agents/commit/ba95182b3844e98860138db3d8eeb392463d7ee7))
* create more generic handlers ([b4d337c](https://github.com/gabrielh-silvestre/s1-agents/commit/b4d337c6661bef53c53e64f1bf7202497b036b41))
* define default handlers to decrease start time ([32f059b](https://github.com/gabrielh-silvestre/s1-agents/commit/32f059bf2e61c272895eab5eeca8abd892bc12fe))
* dockerize ([2dd2370](https://github.com/gabrielh-silvestre/s1-agents/commit/2dd237094cba40a4b6980503a682be131705ebad))
* **openai:** allow inject functions into AgentOpenAI ([b335bd6](https://github.com/gabrielh-silvestre/s1-agents/commit/b335bd68a38369ee480bacc6aa590b650769194a))
* split logic ([4767878](https://github.com/gabrielh-silvestre/s1-agents/commit/47678789e4db41f14b18dad537f9a4d538911e15))
* transform into lib ([e0b1d08](https://github.com/gabrielh-silvestre/s1-agents/commit/e0b1d0816cc91e8f9cc3c8ed053b010f3c3ec96e))


### Bug Fixes

* add needed external dependencies into rollup build ([82aaf4e](https://github.com/gabrielh-silvestre/s1-agents/commit/82aaf4e0331d7348d7278cf8ca3ef1e135b1c53b))
* adjust circular dependency on handlers ([738db2d](https://github.com/gabrielh-silvestre/s1-agents/commit/738db2da3cfb67ef2abcb6b24e3d38c1e4dc6d0f))
* adjust publish flux ([07dadc4](https://github.com/gabrielh-silvestre/s1-agents/commit/07dadc4427b0f9e35b3a4698e0d2ca8717612d87))
* adjust route order on manager ([7edd3eb](https://github.com/gabrielh-silvestre/s1-agents/commit/7edd3eb67490b9981f6fe1320887a447242b4cf2))
* **AudioHandler:** adjust exec condition ([ba23d88](https://github.com/gabrielh-silvestre/s1-agents/commit/ba23d88b61f70a4dac0fd3b9442d6d94e6f71824))
* export missing function on entry point ([df16fc6](https://github.com/gabrielh-silvestre/s1-agents/commit/df16fc64502b73b73cb29581ede03fb2945a5fb6))
* import statements and update method signatures ([19131cd](https://github.com/gabrielh-silvestre/s1-agents/commit/19131cd4f20a185b254f996e37dabfa1aad37040))
* install typescript to build correctly ([3b7db24](https://github.com/gabrielh-silvestre/s1-agents/commit/3b7db2438a1bf01577b7233776e1b60b4da94bfa))
* only leave whatsapp-web package as external ([3eecc1f](https://github.com/gabrielh-silvestre/s1-agents/commit/3eecc1f14ddc488304ac3f42f0f70e22567cb939))
* remove ky, use node-fetch again ([acca80e](https://github.com/gabrielh-silvestre/s1-agents/commit/acca80ecbea5474c3ca2861a199bb734a5b05170))
* setup rollup ([751f0d7](https://github.com/gabrielh-silvestre/s1-agents/commit/751f0d72dd53e8abc69b6a37d0936fdb47c2f619))
* update Dockerfile to package structure ([13dd4ca](https://github.com/gabrielh-silvestre/s1-agents/commit/13dd4cab7a3d601eb0df79bbe374b2872cef46c7))

### [1.2.6](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.2.5...v1.2.6) (2023-11-23)

### [1.2.5](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.2.4...v1.2.5) (2023-11-21)


### Bug Fixes

* remove ky, use node-fetch again ([acca80e](https://github.com/gabrielh-silvestre/s1-agents/commit/acca80ecbea5474c3ca2861a199bb734a5b05170))

### [1.2.4](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.2.3...v1.2.4) (2023-11-21)


### Bug Fixes

* only leave whatsapp-web package as external ([3eecc1f](https://github.com/gabrielh-silvestre/s1-agents/commit/3eecc1f14ddc488304ac3f42f0f70e22567cb939))

### [1.2.3](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.2.2...v1.2.3) (2023-11-21)


### Bug Fixes

* add needed external dependencies into rollup build ([82aaf4e](https://github.com/gabrielh-silvestre/s1-agents/commit/82aaf4e0331d7348d7278cf8ca3ef1e135b1c53b))

### [1.2.2](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.2.1...v1.2.2) (2023-11-21)


### Bug Fixes

* install typescript to build correctly ([3b7db24](https://github.com/gabrielh-silvestre/s1-agents/commit/3b7db2438a1bf01577b7233776e1b60b4da94bfa))

### [1.2.1](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.2.0...v1.2.1) (2023-11-21)


### Bug Fixes

* export missing function on entry point ([df16fc6](https://github.com/gabrielh-silvestre/s1-agents/commit/df16fc64502b73b73cb29581ede03fb2945a5fb6))

## [1.2.0](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.1.3...v1.2.0) (2023-11-21)


### Features

* **openai:** allow inject functions into AgentOpenAI ([b335bd6](https://github.com/gabrielh-silvestre/s1-agents/commit/b335bd68a38369ee480bacc6aa590b650769194a))


### Bug Fixes

* adjust circular dependency on handlers ([738db2d](https://github.com/gabrielh-silvestre/s1-agents/commit/738db2da3cfb67ef2abcb6b24e3d38c1e4dc6d0f))
* update Dockerfile to package structure ([13dd4ca](https://github.com/gabrielh-silvestre/s1-agents/commit/13dd4cab7a3d601eb0df79bbe374b2872cef46c7))

### [1.1.3](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.1.2...v1.1.3) (2023-11-19)


### Features

* define default handlers to decrease start time ([32f059b](https://github.com/gabrielh-silvestre/s1-agents/commit/32f059bf2e61c272895eab5eeca8abd892bc12fe))

### [1.1.2](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.1.1...v1.1.2) (2023-11-19)

### [1.1.1](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.1.0...v1.1.1) (2023-11-19)


### Bug Fixes

* adjust publish flux ([07dadc4](https://github.com/gabrielh-silvestre/s1-agents/commit/07dadc4427b0f9e35b3a4698e0d2ca8717612d87))
* setup rollup ([751f0d7](https://github.com/gabrielh-silvestre/s1-agents/commit/751f0d72dd53e8abc69b6a37d0936fdb47c2f619))

## [1.1.0](https://github.com/gabrielh-silvestre/s1-agents/compare/v1.0.0...v1.1.0) (2023-11-19)


### Features

* create more generic handlers ([b4d337c](https://github.com/gabrielh-silvestre/s1-agents/commit/b4d337c6661bef53c53e64f1bf7202497b036b41))
* transform into lib ([e0b1d08](https://github.com/gabrielh-silvestre/s1-agents/commit/e0b1d0816cc91e8f9cc3c8ed053b010f3c3ec96e))


### Bug Fixes

* **AudioHandler:** adjust exec condition ([ba23d88](https://github.com/gabrielh-silvestre/s1-agents/commit/ba23d88b61f70a4dac0fd3b9442d6d94e6f71824))
* import statements and update method signatures ([19131cd](https://github.com/gabrielh-silvestre/s1-agents/commit/19131cd4f20a185b254f996e37dabfa1aad37040))

## 1.0.0 (2023-11-19)


### Features

* allow gpt to answer audios ([c450fbb](https://github.com/gabrielh-silvestre/s1-agents/commit/c450fbb44b1737692e91cd1bd8149eedcd7137c8))
* allow gpt to answer with audio ([55ed283](https://github.com/gabrielh-silvestre/s1-agents/commit/55ed283eac071f6b523b1519089fec41b271c48a))
* change chat completion to Agent thread ([168ec5c](https://github.com/gabrielh-silvestre/s1-agents/commit/168ec5c62619ca04ed61454b3098cb014d8cd158))
* connect whatsapp and chat gpt ([24c6f60](https://github.com/gabrielh-silvestre/s1-agents/commit/24c6f602d0a23d437e6b9bbeb4cb591160d66af5))
* create first prompt ([ba95182](https://github.com/gabrielh-silvestre/s1-agents/commit/ba95182b3844e98860138db3d8eeb392463d7ee7))
* dockerize ([2dd2370](https://github.com/gabrielh-silvestre/s1-agents/commit/2dd237094cba40a4b6980503a682be131705ebad))
* split logic ([4767878](https://github.com/gabrielh-silvestre/s1-agents/commit/47678789e4db41f14b18dad537f9a4d538911e15))


### Bug Fixes

* adjust route order on manager ([7edd3eb](https://github.com/gabrielh-silvestre/s1-agents/commit/7edd3eb67490b9981f6fe1320887a447242b4cf2))
