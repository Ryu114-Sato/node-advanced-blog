# はじめてつくるバックエンドサーバー発展編（Node.js & Express & MongoDB）: HTMLとCSSの知識だけで本格アプリをつくれる本

## 本章ですること 

- アプリのメイン機能であるブログ部分を作るのが本章です。最初に、Expressを使ったサーバーを作り、そこにデータベースのMongoDBを接続し、そしてブログ機能を構成するCRUD操作（データの作成、読み取り、修正、削除）のコードを追加していきます。

## nodemon 
 - npm install -g nodemon

## HTTP メソッド

| HTTPメソッド | 操作  |CRUD |
| -------- | -------- | -------- |
| GET | 読み込み | Read | 
| POST | 作成 | Create |
| PUT | 修正 |Update |
| DELETE | 削除 | Delete |

## app.use
 - HTMLの<form>から投稿されたデータの中身を解析するために必要なコードです。

## MongoDB

### 2種類　の環境：

- MongoDB　Atlas
 - クラウド環境

- MongoDB 
 - ローカル環境

- (URL)[https://www.mongodb.com/]

### Atlas を始める
Atlas アカウントを作成して認証する
- (参考URL)[https://www.mongodb.com/ja-jp/docs/atlas/getting-started/]

1. 1 つの無料データベースを作成
2. サンプルデータをロード
3. プロジェクトの IP アクセスリストに自分の IP アドレスを追加
4. MongoDB ユーザーを作成
5. Atlas CLI を使用して接続文字列を表示する必要があります。
6. 次のコマンドを実行してください。
 - atlas setup [options]


### mongoose

- Node.js と MongoDB の接続に使う
 - npm install mongoose

### データ修正 (update)

2つの準備が必要になる

1. 修正を行う画面を表示するGETリクエスト
2. データをDBに書き込むPOSTリクエスト

- updateOne()
 
```
BlogModel.updateOne({_id: req.params.id}, req.body)).then(()
```
 - BlogModel.updateOne({_id: 変更するデータの指定}, 変更済みデータの指定))

3. 今回個別のID（記事）を編集する際、HTMLファイルからではなく以下のThunder Client を使ってアップデートする

### Thunder Client 
 *httpメソッドの実行をVScode上で確認できる*

 - なぜ使うのか？：通常POSTはhtmlのformなどから実行してクライアントのリクエストを受け取るが、わざわざhtmlファイルを作成しなくてもPOSTMANやThnder ClientではFormに代わるものが用意されている
     - だからBEではこの様なツールを使って開発を進めることが効率化につながる！

 - 使い方：
     - 例えば、GETリクエストの場合、「New Request」をクリックするとリクエストを実行できるタブが出てきます。アドレスバーに[http://localhost:3000] と入力してSendを押下すると、GETリクエストがThunder Clientから実行され、そのレスポンスとしてres.send("全ブログデータを読み取りました")がコンソールに表示されレスポンスがあったのが分かります。

     - 書き込みデータの用意
         - 書き込むデータを用意します。「Body」タブから「Form-encode」をクリックしてください。
         ここに編集したいデータを入力し、「Send」ボタンを押下して、アドレスバーを『GET』に変更して、『SEND』を押下してデータが編集されたことを確認してください。

    - POSTMAN
         - 同様の働きをするPOSTMANも広く使われています。これらのサービスを使えば、HTMLページを用意することなく各種のリクエスト処理やテストを行えるため、効率よくサーバー開発を進めていけます。
         - https://www.postman.com/

## .ejs テンプレートエンジン

### テンプレートエンジンを使ってデータをブラウザ表示する
  *HTMLではユーザーの操作に応じて変化するデータ（動的データ）が表示できないため*
  1. 種類：pug, Jade, EJS
  2. EJSをインストール
      - npm install ejs
  3. テンプレエンジンとしてEJSを指定するコードを、viewsフォルダ内のEJSのファイルが使える様にする
  4. res.render() を使ってejsのファイルを表示する 
     - *res.send()は単にブラウザにメッセージを表示しているだけ*
  5. 設定しているgetメソッドのポート＋パスをURLに入力してブラウザ表示する
  6. EJS にデータを渡してブラウザに表示します
     - index.js : ```res.render("blogRead",{singleBlog})```
     - blogRead.ejs : 
         - ejs に私たファイルは<%= %> で囲む事によって表示できる 
         ``` 
         <div>
             <h1><%= singleBlog.title %></h1>
             <p><%= singleBlog.textBody %></p>
         </div>
         ```

## セッション管理

 1. ログイン情報が正しい場合、セッションIDを発行する
 2. 発行されたIDはリクエスト（req） の中に保存
 3. 次回以降のログインでは毎回リクエストの中身を確認し、毎回このセッションIDをサーバ側に保存されているかで自動でログインできるかを確認する

 ### install

 - npm install express-session  

### req に保存されたsessionの例
  ```
  sessionStore: MemoryStore {
    _events: [Object: null prototype] {
      disconnect: [Function: ondisconnect],
      connect: [Function: onconnect]
    },
    _eventsCount: 2,
    _maxListeners: undefined,
    sessions: [Object: null prototype] {},
    generate: [Function (anonymous)],
    [Symbol(shapeMode)]: false,
    [Symbol(kCapture)]: false
  },
  sessionID: '5D0SOKgOvxngU6gQNeQhrhO6bq-lq66i',
  session: Session {
    cookie: {
      path: '/',
      _expires: 2025-09-28T09:29:32.404Z,
      originalMaxAge: 3600000,
      httpOnly: true
    }
  },
```
 - 上記のsessionIDはリロードする度に変化するため、サーバー側に保存してもログインしたことがあるかどうかを確認できません、そのためreqのsession部分にMongoDB側のusersの_idを挿入します。

### sessionID が保存されていない場合はログイン画面にリダイレクトする関数を作る

 - 以下の様に、セッションIDが存在しない場合は、ログイン画面へリダイレクトする共通関数を通す

  ```
  if(req.session.userId){
        //res.sendFile(__dirname + "/views/blogCreate.html")
        res.render("blogCreate")
    } else {
        res.redirect("/user/login")
    }
  ````

## git 

1. git init

- 現在のディレクトリで新しい Git リポジトリを初期化します。
  （これにより、バージョン管理が開始されます。）

2. git add README.md

- README.md ファイルをステージングエリアに追加します。
  （全ファイルを追加する場合は git add --all とします。）

3. git commit -m "first commit"

- ステージングエリアにある変更を「first commit」というメッセージでコミットします。
  （最初の変更履歴を記録します。）

4. git branch -M main

- 現在のブランチの名前を強制的に「main」に変更します。
  （ローカルリポジトリのデフォルトブランチを「main」に設定します。）

5. git remote add origin https://github.com/Ryu114-Sato/Kaitaku_App.git

- GitHub 上のリポジトリ URL を「origin」という名前でリモートリポジトリとして登録します。
  （ローカルリポジトリとリモートリポジトリを連携させるための設定です。）

6. git push -u origin feature_202504

- ローカルの「main」ブランチをリモートの「origin」リポジトリにプッシュし、今後のプッシュ・プルの対象として追跡関係を設定します。
  （これにより、リモートにも初回のコミット内容が反映されます。）
- git branch feature_202504