# 訪問GPSメモ v0.1

公開アプリ: https://mofumofu0409-stack.github.io/visit-gps-memo/

iPhoneのSafariで公開URLを開き、共有 →「ホーム画面に追加」→「追加」を選びます。「記録開始」で位置情報を許可してください。

GPS軌跡・訪問ピンは端末のIndexedDBに保存します。実際の記録・顧客情報・バックアップをこのリポジトリに入れないでください。背景地図はOpenStreetMapから取得します。

以前のURLとGitHub Pagesではブラウザの保存領域が異なります。以前のURLでJSONをバックアップし、新しいURLの「バックアップを読込」から移してください。旧URLの記録は自動移行されません。

画面ロック・バックグラウンドでの連続GPS記録は保証されません。利用後はGPXとJSONを保存してください。

今回の変更は指定画像のアイコン、manifest、apple-touch-icon、キャッシュ更新、公開設定・説明に限定しています。app.js・styles.css・Leafletは元ZIPから変更していません。

GitHub Pages: mainブランチ / (root)。Leafletのライセンスは vendor/LEAFLET-LICENSE.txt を参照してください。
