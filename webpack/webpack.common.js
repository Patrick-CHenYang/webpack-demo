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
        rules: [
         // css的解析（css-loader）导入（style-loader）和兼容不同浏览器（postcss-preset-env）
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
          // 加载image图像在webpack5之前我们使用`url-loader`来加载图片，在webpack5中我们使用内置的[Asset Modules]来加载图像资源。
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/,
            type: 'asset', 
            generator: {
              filename: 'image/[name].[contenthash:8][ext][query]'
            }
          },
          // 加载fonts字体或者其他资源
          // {
          //   exclude: /\.(js|mjs|ejs|jsx|ts|tsx|css|scss|sass|png|svg|jpg|jpeg|gif)$/i,
          //   type: 'asset/resource', 
          // },
          // 兼容js：将es6语法转换为es5
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
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.ejs')
        }),
      ],
  };
  
};
