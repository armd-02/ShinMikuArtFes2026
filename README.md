# 新大阪・三国アートフェスマップ2026

コミュニティマップメーカーの現行システムに、新大阪・三国アートフェスマップ2025の設定と素材を移行した2026年度版です。

- システム: [K-Sakanoshita/community_mapmaker](https://github.com/K-Sakanoshita/community_mapmaker)、取り込みコミット `197f367372950a46b973f3eb5889a42f8be0550f`
- 設定・既存データ・画像: [armd-02/shinmikuartfes2025](https://github.com/armd-02/shinmikuartfes2025)、取り込みコミット `2daa32c6c76d9dbe52edf632a73ac7a3c5db2a15`
- 作成日: 2026年11月12日

## データについて

会場・作品・開催日時は、コミュニティマップメーカーのバックエンドから取得します。接続先のプロジェクトキーは `shinmikuartfes2026` です。切り替え時の取得確認では133件でした。開催日時や作品の内容は、バックエンドに登録された値をそのまま表示します。

`data/config-user.jsonc` の `activity.url` に以下を設定しています。

```text
https://armd-01.sakura.ne.jp/community-mapmaker-backend/api/activities.php?app=shinmikuartfes2026
```

認証方式は `activity.authMode: "basic"` です。閲覧時に認証情報は不要で、編集モードは引き続き無効です。返却IDが `ShinMiku/...` のため、`data/config-activities.jsonc` に `ShinMiku` フォームを追加しています。2025年版Google Apps Scriptへの接続は使用しません。

- 地図中心・表示範囲、カテゴリ、会場・作品・出演者・日時の表示項目は2025年版がベースです。
- `data/st_stores.json` と `data/st_green.json` は、2026年11月12日に `https://armd-01.sakura.ne.jp/api/interpreter` から取得したデータです。取得元のOSM更新基準時刻は2026年11月12日6:07:21（日本時間）です。`st_stores.json` は2026年11月13日時点のバックエンドが参照する会場とその構成要素、および会場範囲の各方向に10%の余白を加えた範囲内のレンタサイクルに絞っています。`st_green.json` のレンタサイクルも同じ範囲に絞っています。元データのODbL表記は保持しています。
- バックエンドの画像パスは `store/`・`actor/` 配下を参照します。ファイル名だけの旧形式は `etc.relativePath`（`./stores/`）を付け、フォルダーを含むパス・絶対URL・Wikimedia Commons指定は保持します。
- サイト名・OGP・訪問記録の保存キーは2026年度版です。訪問記録は2025年度版と分けて保存します。
- 表紙・起動時の画像とOGP共有画像には `image/splash.jpg` を使用しています。
- 施設詳細の「経路を検索」からGoogleマップで経路と移動手段を選べます（`directions.use: true`）。
- OSMの営業時間は施設詳細に表示しません（`poiView.openingHours: false`）。イベントの開催日時は登録データのとおり表示します。
- 閲覧用として編集モードと編集切り替えは無効です。新しい任意機能（3Dモデル、屋内表示、ニュース等）は無効にしています。
- Google Analyticsの計測IDは2025年版の設定を引き継いでいます（`manifest.json` の `gId`）。

## ローカル表示

ビルドや依存パッケージのインストールは不要です。

```bash
python3 -m http.server 8080
```

ブラウザーで `http://localhost:8080/` を開きます。背景地図・ライブラリー・バックエンドAPIにはインターネット接続が必要です。

## 検証

```bash
node tests/generic-config.cjs
node tests/legacy-event-images.cjs
node tests/activity-category-filter.cjs
node tests/activity-index.cjs
node tests/local-filter-render.cjs
node tests/loader-script-groups.cjs
node tests/poi-status.cjs
```

`tests/generic-config.cjs` はこのサイト用の設定・素材参照・旧フォーム互換性を検証します。それ以外はコミュニティマップメーカーから引き継いだテストと画像パス互換の追加テストです。

GitHubへのpush・GitHub Pagesへの公開は別途行います。
