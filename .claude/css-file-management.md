
CSSファイル管理ルール（StrataCSS）
==================================================

新しいCSSを **どのディレクトリのファイルに書き、どの `@layer` に置くか** を判断するための指示書。  
※「CSSをどのように書くか」は、この指示書では範囲外。  

StrataCSS は `@layer` を前提にした「ディレクトリとCSSレイヤーの管理手法」。  
※方法論の詳細は、StrataCSS のドキュメントサイト（https://stratacss.com/）を参照。


3原則
--------------------------------------------------

* **Scoping**：スコープを分離する（Global / Pages、相互取り込み禁止）
* **Layering**：CSS分類と階層を `@layer` に対応させる
* **Aligning**：分類名・ディレクトリ名・`@layer` 名を同じ語で揃える（分類を増減しても一致させる）


手順
--------------------------------------------------

ディレクトリの初期構築は完了しているものとし、編集時は以下に従う。

1. **スコープ** を判断 … 全域なら Global、特定ページのみなら Pages
2. **CSS分類** を決める … 後述のCSS分類を読んで該当するものを選ぶ
3. 同名のディレクトリに、該当ファイルがあれば追記・なければ新規作成

### 新規作成の場合

* Globalの場合、新規作成ファイルは配置したサブディレクトリの `_index.scss` に繋ぎこむ
* Pagesの場合、基本はページごとのCSSファイルで全てのスタイリングをおこなう
  * 例）about.css(scss) → Aboutページのコンテンツ全てをスタイリング
  * Partsへの切り出しと共通化はユーザーが判断・作業する（勝手に判断しない）


スコープ
--------------------------------------------------

* **Global**（`src/styles/global/`）： サイト全域に効くCSS。`global.css(scss)` に統合し全ページで読む。
* **Pages**（`src/styles/pages/`）： 特定ページのみの CSS。ページ別にファイルを作り、該当ページで `global.css` の後に読む。

【**重要**】Global ⇔ Pages 間のファイル相互取り込みは **禁止**（スコープの分離を担保）。


CSS分類とディレクトリ・レイヤー構成
--------------------------------------------------

* ソース管理ディレクトリ： `src/styles/`
* **起点は CSS分類（先頭大文字）**。そこからディレクトリ名・`@layer` 名（小文字）が派生する（＝ Aligning）。
* **以下の上から下が `@layer` の宣言順**（下にあるほど上位で、上位が下位を上書きする）。
* **Generic 〜 Elements は包括分類 Base に属する** … ディレクトリは `global/base/` 配下、`@layer` は `base.*` にネストする。


### Base

Generic 〜 Elements を包括

* ディレクトリ： `global/base/*`
* `@layer`： `base.*`

### Generic

ブラウザ初期スタイルの平滑化（リセット）

* ディレクトリ： `global/base/generic/`
* `@layer`： `base.generic`

### Library

外部で作られた基底系・共通機能のCSS

* ディレクトリ： `global/base/library/`
* `@layer`： `base.library`

### Resources

`@font-face` / `@keyframes` 等の共通アットルール

* ディレクトリ： `global/base/resources/`
* `@layer`： `base.resources`

### Tokens

デザイントークン（CSSカスタムプロパティ）

* ディレクトリ： `global/base/tokens/`
* `@layer`： `base.tokens`

### Themes

テーマ切替（Tokens の上書き）

* ディレクトリ： `global/base/themes/`
* `@layer`： `base.themes`

### Elements

プレーンHTML要素のスタイル

* ディレクトリ： `global/base/elements/`
* `@layer`： `base.elements`

### Layout

ヘッダー/フッター/グローバルナビゲーション等の枠組み

* ディレクトリ： `global/layout/`
* `@layer`： `layout`

### Components

ボタン/カード等の共通部品

* ディレクトリ： `global/components/`
* `@layer`： `components`

### Pages

ページ個別のコンテンツCSS

* ディレクトリ： `pages/`
* `@layer`： `pages`


### Parts

Pagesにおいて、複数ページ間で共通利用する部品。

* ディレクトリ： `pages/_parts/`
* `@layer`： `pages` に統合される

※ Parts は Pages スコープの整理用で、レイヤーは pages を共有（独自レイヤーは持たない）
※ Pagesの共通部品切り出しとして適宜利用する

### Utilities

単機能クラス

* ディレクトリ： `global/utilities/`
* `@layer`： `utilities`

### Print

印刷用の上書き

* ディレクトリ： `global/print/`
* `@layer`： `print`


補助分類（Sass）
--------------------------------------------------

Sass の関数・Mixin・変数を置く。**CSS を出力しないため `@layer` は持たない**。  
ディレクトリは `src/styles/abstracts/`（Global / Pages とは別。Abstracts は Settings + Tools を包括する概念）。
Sass を使わない場合は不要（`abstracts/` ごと省略可）。

### Settings

Sass 変数（色・余白等の元値や算出）。CSSカスタムプロパティは含めない（→ Tokens）

* ディレクトリ： `abstracts/settings/`
* `@layer`： なし（CSS を出力しない）

### Tools

スタイル出力用の Mixin と制作効率化の関数

* ディレクトリ： `abstracts/tools/`
* `@layer`： なし（CSS を出力しない）


判別の要点（迷いやすい境界）
--------------------------------------------------

* **Generic / Elements**：  
	どちらも素のHTML要素（`html` `h1` `a`）。Generic＝ブラウザ差の平滑化（リセット）、Elements＝プロジェクト独自のスタイル。
* **Tokens / Settings**：  
	`:root { --x }`（CSSカスタムプロパティ）は Tokens。Sass 変数 `$x` は Settings（Sass機構の補助分類）。Settings で算出し Tokens で CSS化する。
* **Library**：  
	外部製のCSS（Bootstrap / Swiper 等）。**Tailwind も Library**（Utilities ではない）。
* **Themes**：  
	Tokens の上書き（`[data-theme="dark"]` 等）。classへ直接指定を許す場合は `@layer` 宣言順を Pages の後ろへ移す必要がある。
* **Pages / Components**：  
	Pages＝`<main>` 内の主コンテンツ。Components＝粒度を問わず再利用する共通部品。
