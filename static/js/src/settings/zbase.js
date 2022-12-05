class Settings	{
	constructor(root)	{
		this.root = root ;
		this.platform = "WEB" ;
		if(this.root.AcWingOS)	this.platform = "ACAPP" ; 

		this.start() ; 
	}

	start() {
		this.getinfo() ; 
	}

	register() {	// 打开注册界面
	}

	login() {	// 打开登录界面
	}
	
	getinfo() {		// 获取服务器信息
		let outer = this ; 
		
		$.ajax({
			url: "https://app3500.acapp.acwing.com.cn/settings/getinfo/",	 // 传入一个字典
			type: "GET",
			data: {
				platform: outer.platform ,
			},
			success: function(resp)	{	// 回调函数
				if(resp.result === "success")	{
					outer.hide() ; 
					outer.root.menu.show() ; 
				}	else {
					outer.login() ; 
				}
			}
		});
	}

	hide() {

	}

	show() {

	}
}
