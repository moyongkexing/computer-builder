# Computer Builder
## URL
https://computer-builder.vercel.app/

## Demo
![Animation](https://user-images.githubusercontent.com/77483402/119206603-8ca01080-bad6-11eb-9480-19ec4e4c57a1.gif)

## Description
コンピュータサイエンス学習プラットフォーム、Recursion CSの課題作品です。  
素のJavaScriptで、複雑な配列操作やasync/awaitを使った非同期関数の実装にチャレンジしました。
できるだけ読む人が分かりやすいようなコードを意識しました。引数で処理をハンドリングするような関数は作らず、それぞれに独立した名前を付けるなど。

- Pure JavaScript
- Tailwind CSS

## Feature
- 非同期通信
  - APIから非同期でデータを取得し、ステップの最初のセレクトボックスに選択肢をセットしています。
- キャッシュの使用
  - 最初の非同期通信を行った際にデータをキャッシュしており、それにフィルターをかけることで２番目以降の選択肢をセットしています。
  
## Installation
```
$ git clone https://github.com/moyongkexing/computer-builder.git
$ cd computer-builder
```

## Author
Twitter: [mo4g_dev](https://twitter.com/mo4g_dev)
