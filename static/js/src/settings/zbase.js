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
					<div class="ac-game-settings-title">
					注册
				</div>
				<div class="ac-game-settings-username">
					<div class="ac-game-settings-item">
						<input type="text" placeholder="用户名">
					</div> 
				</div>
				<div class="ac-game-settings-password ac-game-settings-password-first">
					<div class="ac-game-settings-item">	
						<input type="password" placeholder="密码">
					</div>
				</div>
				<div class="ac-game-settings-password ac-game-settings-password-second">
					<div class="ac-game-settings-item">	
						<input type="password" placeholder="确认密码">
					</div>
				</div>
				<div class="ac-game-settings-submit">
					<div class="ac-game-settings-item">
						<button>提交注册</button>
					</div>
				</div>
				<div class="ac-game-settings-error-message">

				</div>
				<div class="ac-game-settings-option">
					登录
				</div>
				<br>       
				<div class="ac-game-settings-acwing">
					<img width="30" src="https://cdn.acwing.com/media/article/image/2021/11/18/1_ea3d5e7448-logo64x64_2.png">
					<div>
						Acwing一键登录
					</div>
				</div>
				</div>	
			</div> 
		</div>
		`);			
		// 分离静态页面							// 查div --- 存一下子div 
		this.$login = this.$settings.find(".ac-game-settings-login") ; 			// 登陆界面
		this.$login_username = this.$login.find(".ac-game-settings-username input") ; 
		this.$login_password = this.$login.find(".ac-game-settings-password input") ; 
		this.$login_submit = this.$login.find(".ac-game-settings-submit button") ; 
		this.$login_error_message = this.$login.find(".ac-game-settings-error-message") ; 
		this.$login_register =  this.$login.find(".ac-game-settings-option") ; 
		
		this.$login.hide() ; 
																// 空格表示在div的所有位置查 input , >表示查两个级联的div 
		this.$register = this.$settings.find(".ac-game-settings-register") ; 		// 注册界面
		this.$register_username = this.$register.find(".ac-game-settings-username input") ; 
		this.$register_password = this.$register.find(".ac-game-settings-password-first input") ; 
		this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input") ; 
		this.$register_submit = this.$register.find(".ac-game-settings-submit button") ; 
		this.$register_error_message = this.$register.find(".ac-game-settings-error-message") ; 
		this.$register_login = this.$register.find(".ac-game-settings-option") ; 
 		
		this.$register.hide() ; 

		this.$acwing_login = this.$settings.find(".ac-game-settings-acwing img") ; 
		this.root.$ac_game.append(this.$settings) ;			// 总的静态页面append
		
		this.start() ; 
	}

	start() {
		if(this.platform === "ACAPP") {
			this.getinfo_acapp() ; 
		} else {
			this.getinfo_web() ; 
			this.add_listening_events() ; 		// 监听函数
		}
	}

	add_listening_events() {		// 注册和登录页面跳转的 --绑定函数hhh
		let outer = this ; 

		this.add_listening_events_login() ; 
		this.add_listening_events_register() ; 
		this.$acwing_login.click(function(){
			outer.acwing_login() ; 
		})
	}

	acwing_login() {
		//console.log("click_acwing_login_in") ;
		$.ajax({
			url: "https://app3500.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
			type: "GET",
			success: function(resp) {
				if(resp.result === "success")
					window.location.replace(resp.apply_code_url) ; 		// 跳转到第三方认证界面
			}

		}) 
	}

	add_listening_events_login() {
		let outer = this ; 			// outer存外面的this
		this.$login_register.click(function(){
			outer.register() ; 				// 返回注册界面
 		})
		this.$login_submit.click(function(){
			outer.login_on_remote() ;    // 提交登陆
		})

	}

	add_listening_events_register() {
		let outer = this ; 
		this.$register_login.click(function(){
			outer.login(); 			// 返回登陆界面
		})	
		this.$register_submit.click(function(){
			outer.register_on_remote() ; 		// 提交注册
		})
	}

	login_on_remote() {			// 在远程服务器上登录
		let outer = this ;
		let username = this.$login_username.val() ; 
		let password = this.$login_password.val() ; 		// 取input的值
		this.$login_error_message.empty() ; 		// 清空	
		
		$.ajax({
			url: "https://app3500.acapp.acwing.com.cn/settings/login/",
			type: "GET",
			data: {
				username: username , 
				password: password ,
			},
			success: function(resp){
				console.log(resp);
				if(resp.result === "success") {
					location.reload() ; 		// reload刷新 --- 完成登录
				}	else {
					outer.$login_error_message.html(resp.result) ; 
				}

			}
		})
	}

	register_on_remote() {			// 在远程服务器上注册
		let outer = this ; 
		let username = this.$register_username.val() ; 
		let password = this.$register_password.val() ; 
		let password_confirm = this.$register_password_confirm.val() ; 
		this.$register_error_message.empty() ;
		
		$.ajax({
			url: "https://app3500.acapp.acwing.com.cn/settings/register/",
			type: "GET",
			data: {
				username: username,
				password: password,
				password_confirm: password_confirm, 
			},
			success: function(resp) {
				console.log(resp) ; 
				if(resp.result === "success") {
					location.reload();   		
				} else {
					outer.$register_error_message.html(resp.result);
				}
			}
		});
	}

	logout_on_remote() {		// 退出
		if(this.platform === "ACAPP")	return false ;	

		$.ajax({
			url: "https://app3500.acapp.acwing.com.cn/settings/logout/",
			type: "GET",
			success: function(resp){
				console.log(resp) ; 
				if(resp.result === "success")
					location.reload() ; 
			}	
		})
	}

	register() {	// 打开注册界面
		this.$login.hide() ; 
		this.$register.show() ; 	
	}

	login() {	// 打开登录界面
		this.$register.hide() ;
		this.$login.show() ; 
	}

	acapp_login(appid,redirect_uri,scope,state) {  	
		let outer = this ;
		this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp){
			console.log(resp);
			if(resp.result === "success") {
				outer.username = resp.username ; 
				outer.photo = resp.photo ; 
				outer.hide() ; 
				outer.root.menu.show() ; 
 			}
		})
	}

	getinfo_acapp() {
		let outer = this ; 

		$.ajax({
			url: "https://app3500.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
			type: "GET",
			success: function(resp) {
				if(resp.result === "success") {
					outer.acapp_login(resp.appid,resp.redirect_uri,resp.scope,resp.state); 
				}
			}

		})
	}

	getinfo_web() {		// 获取服务器信息
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
					//outer.register() ;
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
 