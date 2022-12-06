class Settings	{
	constructor(root)	{
		this.root = root ;
		this.platform = "WEB" ;
		if(this.root.AcWingOS)	this.platform = "ACAPP" ; 	
		console.log(this.platform) ; 		// 输出前端
		
		this.photo = ""; 
		this.username = "";				// js使用$引入静态html 
		this.$settings = $(`		
		<div class="ac-game-settings">
			<div class="ac-game-settings-login">
				<div class="ac-game-settings-title">
					登录
				</div>
				<div class="ac-game-settings-username">
					<div class="ac-game-settings-item">
						<input type="text" placeholder="用户名">
					</div> 
				</div>
				<div class="ac-game-settings-password">
					<div class="ac-game-settings-item">	
						<input type="password" placeholder="密码">
					</div>
				</div>
				<div class="ac-game-settings-submit">
					<div class="ac-game-settings-item">
						<button>登录</button>
					</div>
				</div>
				<div class="ac-game-settings-error-message">
					用户名或密码错误
				</div>
				<div class="ac-game-settings-option">
					注册
				</div>
				<br>       
				<div class="ac-game-settings-acwing">
					<img width="30" src="https://cdn.acwing.com/media/article/image/2021/11/18/1_ea3d5e7448-logo64x64_2.png">
					<div>
						Acwing一键登录
					</div>
				</div>
			</div>	
			<div class="ac-game-settings-register">

			</div> 
		</div>
		`);								// 查div --- 存一下子div 
		this.$login = this.$settings.find(".ac-game-settings-login") ; 

		this.$login.hide() ; 

		this.$register = this.$settings.find(".ac-game-settings-register") ; 

		this.$register.hide() ; 

		this.root.$ac_game.append(this.$settings) ;
		
		this.start() ; 
	}

	start() {
		this.getinfo() ; 
	}

	register() {	// 打开注册界面
		this.$login.hide() ; 
		this.$register.show() ; 	
	}

	login() {	// 打开登录界面
		this.$register.hide() ;
		this.$login.show() ; 
	}
	
	getinfo() {		// 获取服务器信息
		let outer = this ; 	

		$.ajax({		// ajax是向url发请求 --- getinfo向后端发请求 --- 获取平台
			url: "https://app3500.acapp.acwing.com.cn/settings/getinfo/",	 // 传入一个字典
			type: "GET",
			data: {
				platform: outer.platform ,
			},
			success: function(resp)	{	// 回调函数
				console.log(resp);
				if(resp.result === "success")	{
 					outer.username = resp.username ;
					outer.photo	 = resp.photo ;		// 存用户名和头像
					outer.hide() ; 
					outer.root.menu.show() ; 
				}	else {
					outer.login() ; 		// 未登录状态默认打开登录界面
				}
			}
		});
	}

	hide() {
		this.$settings.hide() ; 
	}

	show() {
		this.$settings.show() ; 
	}
}
 