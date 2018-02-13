module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'wetoolboxapi',  //项目名称
      script    : './bin/www',  // 程序入口
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      },
      //配置 out log 的文件路径
      // "out_file": "../log/out.log",

      //配置 error log 的文件路径
      // "error_file": "../log/err.log",
    },
    // 还可以配置第二个应用
    // Second application
    // {
    //   name      : 'WEB',
    //   script    : 'web.js'
    // }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
      // 因为pm2要登录到服务器（Server）中执行命令，所以要提供 name 和 host
      // 这里没有提供密码，也就是为什么要配置ssh免密码登录
    production : {
      user : 'root',  // 服务器用户名
      host : '119.29.186.160',  // 服务器地址

      // 服务器（Server）需要获取GitHub上的仓库
      // 所以要配置Deploy Keys
      ref  : 'origin/production',
      repo : 'git@github.com:Cshiyuan/WeToolBoxNodeJs.git',
      path : '/data/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    // dev : {
    //   user : 'root',
    //   host : '119.29.186.160',
    //   ref  : 'origin/master',
    //   repo : 'git@github.com:repo.git',
    //   path : '/var/www/development',
    //   'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
    //   env  : {
    //     NODE_ENV: 'dev'
    //   }
    // }
  }
};
