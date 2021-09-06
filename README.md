# farmer
##### 仿真果树化token应用
--------------------------

仿真果树token化研究应用软件是一个独立的基于区块链的供果农发布即将成熟收获的果树，供购买者竞价的web应用。

- 本系统是一个典型的Dapp应用，主要包含两部分，合约部分以及前端系统部分。
- 合约部分包含竞价信息合约，以及TRC树币合约。竞价信息合约会根据TRC树币合约发行的token数量，映射到相应数量的果树，发布相应数量的竞价信息列表。
- 前端部分通过以太坊公链与合约部分进行交互。完成相应的业务逻辑。

-----------------------------------------------------

##### 安装步骤

1. 从github下载本项目代码. [下载地址](https://github.com/Yyonging/farmer.git)
2. 下载ganache。一个区块链模拟软件，我们的智能合约将部署在其之上。
3. Chrome浏览器安装metamask 插件。一个区块链账户管理插件。
4. 查看ganache相关的网络以及端口配置，在metamask中设置，将metamask与ganache区块链系统链接。并且导入ganache提供的账户（账户拥有100eth用于模拟竞价以及发布我们的合约）
5. 根据ganache的网络配置修改项目代码中的truffle-config.js中的相关的端口配置(默认不需要修改)。
6. 下载npm.　一个js的软件包管理程序。执行npm install -g truffle 安装truffle 框架。该框架将用于部署我们的只能合约到ganache模拟的区块链系统。
7. 在项目的根目录执行./deploy.sh 该脚本将部署我们的智能合约。
8. 进入项目中的app目录。执行npm install 命令。Npm将自动安装前端系统依赖的软件包。　
在app 目录下，执行npm run start 命令。前端项目将启动。　默认情况下，访问本机3000端口将看到本项目的前端界面。


##### 系统流程

![image](https://user-images.githubusercontent.com/14345714/125408829-e396d780-e3ed-11eb-92df-5dcd247aaa1c.png)

##### 系统相关接口

![image](https://user-images.githubusercontent.com/14345714/125408660-b77b5680-e3ed-11eb-87db-54330ecccd8b.png)

##### 成功后的界面
![image](https://user-images.githubusercontent.com/14345714/132198098-eb2dc7a3-d4b9-4ebc-a24f-e0f14faf59af.jpg)

