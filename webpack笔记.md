## webpack5构建

## 准备工作

首先我们创建一个项目`webpack-demo`，然后初始化`npm`，然后在本地安装`webpack`和`webpack-cli`：

```
mkdir webpack-demo
cd webpack-demo
npm init -y
npm install webpack webpack-cli --save-dev

```

安装的`webpack包`则是webpack的核心功能包，`webpack-cli`则是webpack的命令行工具，可以在终端中使用webpack命令启动项目和打包项目。

然后我们在项目的根目录下创建一个文件夹`webpack`，在这个文件夹中创建三个文件用以区分环境：

```
webpack.common.js // 公用配置

webpack.dev.js // 开发时的配置

webpack.prod.js // 打包构建时的配置

```

![1637049449030.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa039631b78d45adb0d7ee3548987ad7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

然后在根目录创建src文件夹，在src文件夹下面创建index.js：

```
// src/index.js

const el = document.getElementById('root');
el.innerHTML = 'hello webpack5';

```

## 基本配置

我们在`webpack`文件夹下的`webpack.common.js`中来写基本的配置：

```
// webpack/webpack.common.js

const path = require('path');

module.exports = (webpackEnv) => {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    return {
      mode: webpackEnv, 
      entry: './src/index.js',
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
      },
      module: {
          rules: []
      },
      plugins: [],
    };
};

```

这里我们导出了一个函数，函数中返回了webpack的配置信息。当这个函数被调用时，会传入当前运行的环境标识`webpackEnv`，它的值是`development`或者`production`，并将`webpackEnv`赋值给了`mode`，用于根据不同模式开启相应的内置优化，还有个作用则是根据不同环境自定义开启不同的配置，在后续配置中会用到。

在配置信息中是webpack的5大基本模块：

1. `mode`：模式，通过选择：`development，production，none`这三个参数来告诉webpack使用相应模式的内置优化。
2. `entry`：设置入口文件。
3. `output`：告诉webpack打包出的文件存放在哪里
4. `module.rules`：loader（加载器），webpack本身只支持处理js，json文件，要想能够处理其它类型的文件，如：css，jsx，ts，vue等，则需要相应的loader将这些文件转换成有效的模块。
5. `plugins`：插件，loader用于处理不支持的类型的文件，而plugin则可以用于执行范围更广的任务，如：压缩代码(`new TerserWebpackPlugin()`)，资源管理(`new HtmlWebPackPlugin()`)，注入环境变量（`new webpack.DefinePlugin({...})`)等。

### 配置webpack-dev-server

基本配置完成了，我们现在想要让代码运行起来，并且当代码修改后可以自动刷新页面。

首先先安装`webpack-dev-server`：

```
npm install --save-dev webpack-dev-server
```

安装完成后，我们进入webpack.dev.js中来添加开发时的配置：

```
const webpackCommonConfig = require('./webpack.common.js')('development');

module.exports = {
  devServer: {
    host: 'localhost', // 指定host，，改为0.0.0.0可以被外部访问
    port: 8081, // 指定端口号
    open: true, // 服务启动后自动打开默认浏览器
    historyApiFallback: true, // 当找不到页面时，会返回index.html
    hot: true, // 启用模块热替换HMR，在修改模块时不会重新加载整个页面，只会更新改变的内容
    compress: true, // 启动GZip压缩
    https: false, // 是否启用https协议
    proxy: { // 启用请求代理，可以解决前端跨域请求的问题
      '/api': 'www.baidu.com',
    },
  },
  ...webpackCommonConfig,
};

```

在这里我们首先引入了`webpack.common.js`，上面我们介绍了这个文件导出一个函数，接收环境标识作为参数，这里我们传入的是`development`，然后将返回的配置对象`webpackCommonConfig`，与开发时的配置进行了合并。

### 配置html-webpack-plugin

`html-webpack-plugin`的作用是生成一个html文件，并且会将webpack构建好的文件自动引用。

```
npm install --save-dev html-webpack-plugin

```

安装完成后，在`webpack.common.js`中添加该插件：

```
// webpack/webpack.common.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (webpackEnv) => {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    return {
      mode: webpackEnv, 
      entry: './src/index.js',
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
      },
      module: {
          rules: []
      },
      plugins: [
          new HtmlWebpackPlugin(),
      ],
    };
};

```

`html-webpack-plugin`还可以添加一个模板文件，让`html-webpack-plugin`根据模板文件生成html文件。

我们在根目录下创建一个`public`文件夹，在文件夹下创建一个`index.ejs`:

```
// public/index.ejs

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using create-react-app" />
    <title>Webpack5</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>


```

然后在插件中引入模板：

```
// webpack/webpack.common.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (webpackEnv) => {
   ...

    return {
      ...
      plugins: [
          new HtmlWebpackPlugin({
              template: path.resolve(__dirname, '../public/index.ejs')
          }),
      ],
    };
};

```

`注意：`：这里我引用`.html`后缀的模板，`html-webpack-plugin`始终无法正常的生成html，然后改为了`.ejs`后就正常了。

### 在package.json中配置启动，打包命令

然后我们在package.js中来配置启动和打包的命令：

```
{
  "name": "fcc-template-typescript",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "build": "webpack --config ./webpack/webpack.prod.js",
    "start": "webpack server --config ./webpack/webpack.dev.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  ...
}

```

我们在`scripts`中添加了build和start命令，build用于打包发布，start用以开发时启动项目。

然后我们命令行中进入到项目的更目录下，运行：`npm start` 或者 `yarn start`命令来启动项目。

### 加载CSS

我们知道webpack本身只支持处理`js和json`类型的文件，如果我们想处理其它类型的文件，则需要使用相应的`loader`。

提前列出需要使用到的loader：

1. `style-loader`
2. `css-loader`
3. `postcss-loader`

安装：

```
npm install --save-dev style-loader css-loader postcss-loader postcss postcss-preset-env

```

对于css文件，则需要添加：`css-loader`：

**webpack.common.js**

```
// webpack/webpack.common.js
...
module.exports = (webpackEnv) => {
   ...
    return {
        ...
        module: {
            rules: [
                {
                    test: /.css$/i,
                    use: ["css-loader"],
                },
            ],
        },
    };
};

```

**index.js**

```
// src/index.js

import './index.css';

```

**index.css**

```
#root {
  color: red;
}

```

此时我们运行发现文字并没有添加颜色，这是为什么？

因为`css-loader`只负责解析css文件，解析完成后会返回一个包含了css样式的js对象：

![1637054164915.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48d0a4036982462391912de58741ea12~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

我们需要css样式生效，则需要将css样式插入到dom中，那么又需要安装自动插入样式的loader：`style-loader`。

**webpack.common.js**

```
// webpack/webpack.common.js
...

module.exports = (webpackEnv) => {
   ...

    return {
        ...
        module: {
            rules: [
                {
                    test: /.css$/i,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
    };
};

```

这里需要注意，loader的执行顺序是`倒序执行`（从右向左或者说从下向上），我们需要先使用`css-loader`解析css生成js对象后，将css对象交给`style-loader`，`style-loader`会创建style标签，将css样式抽取出来放在style标签中，然后插入到head中。

在不同浏览器上css的支持是不一样的，所以我们需要使用`postcss-loader`来做css的兼容： **webpack.common.js**

```
module: {
    rules: [
        {
            test: /.css$/i,
            use: [
                "style-loader", 
                "css-loader",
                 {
                    // css兼容性处理
                    loader: 'postcss-loader',
                    options: {
                      postcssOptions: {
                        plugins: [
                          [
                            'postcss-preset-env',
                            {
                              autoprefixer: {
                                flexbox: 'no-2009',
                              },
                              stage: 3,
                            },
                          ],
                        ],
                      },
                    }
                },
            ],
        },
    ],
},

```

在postcss中使用了`postcss-preset-env`插件来自动添加前缀。

### 加载image图像

在webpack5之前我们使用`url-loader`来加载图片，在webpack5中我们使用内置的[Asset Modules](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.docschina.org%2Fguides%2Fasset-modules%2F)来加载图像资源。

在 webpack 5 之前，通常使用：

- [`raw-loader`](https://link.juejin.cn?target=https%3A%2F%2Fv4.webpack.js.org%2Floaders%2Fraw-loader%2F) 将文件导入为字符串
- [`url-loader`](https://link.juejin.cn?target=https%3A%2F%2Fv4.webpack.js.org%2Floaders%2Furl-loader%2F) 将文件作为 data URI 内联到 bundle 中
- [`file-loader`](https://link.juejin.cn?target=https%3A%2F%2Fv4.webpack.js.org%2Floaders%2Ffile-loader%2F) 将文件发送到输出目录

资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：

- `asset/resource` 发送一个单独的文件并导出 URL。之前通过使用 `file-loader` 实现。
- `asset/inline` 导出一个资源的 data URI。之前通过使用 `url-loader` 实现。
- `asset/source` 导出资源的源代码。之前通过使用 `raw-loader` 实现。
- `asset` 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现。

**webpack.common.js**

```
 module: {
   rules: [
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/,
      type: 'asset', 
      generator: {
        filename: 'image/[name].[contenthash:8][ext][query]'
      }
    },
   ]
  },

```

添加`generator`属性自定义文件名与文件存放位置。

也可以在`output`中定义`assetModuleFilename`设置默认存放位置与文件名格式：

```
output: {
  assetModuleFilename: 'asset/[name].[contenthash:8][ext][query]', 
}

```

### 加载fonts字体或者其他资源

**webpack.common.js**

```
 module: {
   rules: [
    {
      exclude: /\.(js|mjs|ejs|jsx|ts|tsx|css|scss|sass|png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource', 
    },
   ]
  },

```

我们通过排除其他资源的后缀名来加载其他资源。

### 兼容js：将es6语法转换为es5

需要使用到的loader：

1. `babel-loader`

安装：

```
npm install --save-dev babel-loader @babel/core @babel/preset-env

```

需要用到的babel插件：

1. `@babel/plugin-transform-runtime`
2. `@babel/runtime`

安装：

```
npm install --save-dev @babel/plugin-transform-runtime
```

```
npm install --save @babel/runtime
```

**webpack.common.js**

```
 module: {
   rules: [
    {
        test: /\.js$/,
        include: path.resolve(__dirname, './src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                    "@babel/preset-env",
                    {
                        "useBuiltIns": "usage",
                        "corejs": 3,
                    }
                ]
              ],
            }
          },
        ],
      },
   ]
  },

```

这里我们会使用babel的插件：`@babel/preset-env`，它是转译插件的集合。

比如说我们使用了箭头函数，浏览器是不识别的需要转译成普通函数，那么我们就需要添加babel插件：`@babel/plugin-transform-arrow-functions`来处理箭头函数，如果我们使用了很多es6的api，都需要手动添加插件，这样会非常麻烦，babel为了简便开发者的使用，将所有需要转换的es6特性的插件都集合到了`@babel/preset-env`中。

在使用`@babel/preset-env`我们需要配置`corejs`属性，什么是corejs？

babel只支持最新语法的转换，比如：`extends`，但是它没办法支持最新的Api，比如：Map，Set，Promise等，需要在不兼容的环境中也支持最新的Api那么则需要通过Polyfill的方式在目标环境中添加缺失的Api，这时我们就需要引入`core-js`来实现polyfill。

`useBuiltIns`则是告诉babel怎么引入polyfill。

当选择`entry`时，babel不会引入polyfill，需要我们手动全量引入：

```
import "core-js"; 

var a = new Promise();

```

当选择`usage`时，babel会根据当前的代码自动引入需要的polyfill：

```
import "core-js/modules/es.promise"; 

var a = new Promise();
```

但是我们发现这样使用polyfill，会污染全局对象，如下：

```
"foobar".includes("foo");

使用polyfill后，会在String的原型对象上添加includes方法：

String.prototype.includes = function() {}

```

如果我们使用了其它插件也在原型对象上添加了同名方法的，那就会导致出现问题。

这时我们则可以使用`@babel/plugin-transform-runtime`插件，通过引入模块的方式来实现polyfill：

```
 module: {
   rules: [
    {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                "@babel/preset-env",
              ],
              plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {
                    "helpers": true, 
                    "corejs": 3,
                    "regenerator": true,
                  }
                ]
              ],
            }
          },
        ],
      },
   ]
  },

```

我们来看下效果：

```
"foobar".includes("foo");
```

转译后：

```
var _babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_1__);


_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_1___default()(_context = "foobar").call(_context, "foo");

```

可以看到转译后`includes`的实现是通过调用了`runtime—corejs3`中的`includes`方法。

通过上面我们知道了`@babel/plugin-transform-runtime`的作用，我们再来看看它常用的配置属性。

`helpers`，我们将helpers先设置为false来看看编译后的效果。

```
class Test {}
```

转义后：

```
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Test = function Test() {
  _classCallCheck(this, Test);
};

```

我们看到在转译后，在顶部添加了一个`_classCallCheck`工具函数，如果打包后有多个文件，每个文件中都是用了`class`，那么在顶部都会生成同样的`_classCallCheck`工具函数，这会使我们最后打包出来的文件体积变大。

我们将`helpers`设置为true，再来看转译后的效果：

```
var _babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

var Test = function Test() {
  (0,_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Test);
};

```

我们看到`_classCallCheck`函数通过模块的方式被引入，这样就使babel通用的工具函数能够被复用，从而减小文件打包后的体积。

`corejs`：指定依赖corejs的版本进行polyfill。

`regenerator`：在我们使用generate时，会在全局环境上注入generate的实现函数，这样会造成全局污染，将regenerator设置true，通过模块引入的方式来调用generate，避免全局污染：

```
function* test() {
  yield 1;
}

```

`regenerator`设置为false时：

```
function test() {
  return regeneratorRuntime.wrap(function test$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 1;

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

```

可以看到`regeneratorRuntime`这个对象是直接使用的，并没有引入，那么它肯定就是存在于全局环境上。

`regenerator`设置为true时：

```
function test() {
  return _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function test$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 1;

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

```

可以看到，这次使用的`generate`函数是从`runtime-corejs3`中导出引用的。

**注意**：还需要在`package.json`中配置目标浏览器，告诉babel我们要为哪些浏览器进行`polyfill`：

```
// package.json

{
  "name": "webpack5",
  "version": "1.0.0",
  ...
  "browserslist": {
   // 开发时配置，针对较少的浏览器，使polyfill的代码更少，编译更快
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    // 生产的配置，需要考虑所有支持的浏览器，支持的浏览器越多，polyfill的代码也就越多
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  }
}
```

## 进阶配置