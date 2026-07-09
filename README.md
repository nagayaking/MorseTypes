# MorseTypes

MorseTypes は、モールス信号を用いてひらがなを入力する、ブラウザベースの本格的なタイピングゲームです。
ゲーム感覚でモールス信号を覚えられる環境を整えるために作成しています。

## 主な機能

* モールス信号のリアルタイム入力判定（短音・長音の自動判別）
* KPM（1分間あたりの打鍵数）と正解率による、スコア計算とランク判定
* nanostoresを利用した、ページ遷移後も保持されるユーザー設定（音量・長短判定の閾値など）
* 視線移動を最小限に抑え、入力に合わせて滑らかに左へスライドする問題文UI

## 技術スタック

* **フレームワーク:** Astro
* **UIライブラリ:** React
* **言語:** TypeScript
* **状態管理:** nanostores (@nanostores/persistent)
* **音声処理:** Web Audio API (OscillatorNode, GainNode)

## ディレクトリ構成

プロジェクトの主要なファイルとディレクトリの構成は以下の通りです。

```text
MorseTypes/
├── public/                 # 静的ファイル（faviconなど）
├── src/
│   ├── components/         # UIコンポーネント
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Home.astro
│   │   ├── Button.tsx
│   │   ├── stores.ts       # nanostoresによるグローバル状態管理
│   │   ├── settings/
│   │   │   └── DefaultSettings.tsx
│   │   └── typing/
│   │       ├── Typing.tsx       # ゲーム画面を統括するメインコンポーネント
│   │       ├── WordDisplay.tsx  # 問題文とモールス信号のスライド表示UI
│   │       ├── MorseKeypad.tsx  # モールス入力用の電鍵UI
│   │       └── scoreBoard.tsx   # リザルト（成績表示）画面
│   ├── data/
│   │   ├── morseMap.ts     # ひらがなとモールス信号の変換辞書
│   │   └── wordList.ts     # 出題される問題文のリスト
│   ├── hooks/
│   │   └── useGameLogic.ts # ゲームの進行、スコア計算、状態管理を担うカスタムフック
│   ├── layouts/
│   │   └── Layout.astro    # 画面全体の中央揃えなどを行う共通レイアウト
│   ├── pages/              # ルーティング（Astro）
│   │   ├── index.astro        # ホーム画面
│   │   └── typing/
│   │       ├── game.astro     # ゲームプレイ画面
│   │       └── settings.astro # 設定画面
│   ├── styles/             # コンポーネントごとのCSSスタイル
│   │   ├── button.css
│   │   ├── global.css
│   │   ├── home.css
│   │   ├── scoreBoard.css
│   │   ├── setting.css
│   │   └── wordDisplayLayout.css
│   └── utils/
│       ├── shuffle.ts      # 出題順をランダム化するユーティリティ関数
│       └── sound.ts        # Web Audio API を利用した発音と音量制御
├── package.json
├── tsconfig.json
└── astro.config.mjs

```

## インストールと起動方法

Node.js (v22.12.0以上推奨) がインストールされている環境で、以下のコマンドを実行してください。

```bash
# 依存パッケージのインストール
npm install

# 開発用サーバーの起動
npm run dev
```

起動後、ブラウザで `http://localhost:4321` （またはコンソールに表示されたURL）にアクセスしてください。

## 遊び方

1. ホーム画面からゲームを開始します。
2. 画面に表示されるひらがなに対応するモールス信号を入力します。
* 入力ボタンを短くクリック：短音（・）
* 入力ボタンを長くクリック：長音（ー）
* 入力が一定時間ないと自動的に1文字分の判定が行われます。


3. すべての問題を打ち終えると、入力速度（KPM）、正解率、スコア、ランクが表示されます。
4. 設定画面から、好みに合わせて音量や短音・長音を判定するしきい値（ミリ秒）を変更することが可能です。
