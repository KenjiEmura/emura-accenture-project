# フロントエンドコーディング試験 API

## 概要

本 API は、内閣府 地方創生推進室が提供している [RESAS（地域経済分析システム）](https://resas.go.jp/) のデータを加工して作成しています。

※当該データは 2024 年 10 月時点のものであり、最新性を保証するものではありません。

## 詳細仕様

### ◎ ベース URL について

本 API のベース URL は **`https://frontend-engineer-codecheck-api.mirai.yumemi.io`** です。

各 API は、このベース URL にパスを追加してアクセスします。

### ◎ API 一覧

本 API で利用可能なパスは以下の通りです。

| **メソッド** | **パス** | **説明** |
| --- | --- | --- |
| GET | `/api/v1/prefectures` | 都道府県一覧を取得 |
| GET | `/api/v1/population/composition/perYear` | 人口構成データを取得 |

### ◎ API キーの設定について

本 API へアクセスするには、API キーをリクエストヘッダー **`X-API-KEY`** に設定する必要があります。

リクエストヘッダーに有効な API キーが設定されていない場合、リクエストしたデータは返却されず、**`403 Forbidden`** のエラーが返されます。

※ 本 API は運用の簡素化を図るため、すべての応募者に共通の API キーを提供しております。

| **リクエストヘッダー** | **API キー** |
| --- | --- |
| X-API-KEY | 8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ |

### ◎ レスポンスヘッダーについて

レスポンスヘッダーの Content-Type は **`application/json; charset=UTF-8`** です。

### ◎ エラーについて

#### 400 Bad Request

本 API に必要なパラメータが正しく設定されていない場合に発生します。

必須パラメータの設定が漏れていないか、正しいフォーマットで設定できているか、等をご確認ください。

#### 403 Forbidden

リクエストヘッダーに API キーが存在しないか、指定された API キーが無効な場合に発生します。

API キーが正しく設定されているかご確認ください。

#### 404 Not Found

指定された URL に対応する API が存在しない場合に発生します。

URL が正しいかをご確認ください。

#### 500 Internal Server Error

API サーバーに問題が発生した場合に返されます。

しばらく時間をおいて再度お試しください。問題が解消しない場合は、お手数ですが弊社までお問い合わせください。

## 出典

- RESAS（地域経済分析システム）のデータを加工して作成
- 人口構成データ：
  - 総務省「国勢調査」
  - 厚生労働省「人口動態調査」
  - 国立社会保障・人口問題研究所「日本の地域別将来推計人口」

[RESAS 関連サービス利用規約](https://opendata.resas-portal.go.jp/terms.html)

[MIT License](https://opensource.org/licenses/MIT)

---

## 都道府県一覧

### **GET /api/v1/prefectures**

都道府県に関する一覧データを返します。

**Parameters**

No parameters

**Response Example**

```json
{
  "message": null,
  "result": [
    {
      "prefCode": 1,
      "prefName": "北海道"
    }
  ]
}
```

**使用例**

```bash
curl -X GET "https://frontend-engineer-codecheck-api.mirai.yumemi.io/api/v1/prefectures" \
  -H "X-API-KEY: 8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ" \
  -H "Content-Type: application/json"
```

## 人口構成

### **GET /api/v1/population/composition/perYear**

地域単位、年単位の年齢構成のデータを返します。

**Parameters**

| **Name** | **Description** |
| --- | --- |
| **prefCode** | **都道府県コード** |

**Response Example**

```json
{
  "message": null,
  "result": {
    "boundaryYear": 2020,
    "data": [
      {
        "label": "総人口",
        "data": [
          {
            "year": 1960,
            "value": 5039206
          }
        ]
      },
      {
        "label": "年少人口",
        "data": [
          {
            "year": 1960,
            "value": 1681479,
            "rate": 33.37
          }
        ]
      }
    ]
  }
}
```

**使用例**

```bash
curl -X GET "https://frontend-engineer-codecheck-api.mirai.yumemi.io/api/v1/population/composition/perYear?prefCode=1" \
  -H "X-API-KEY: 8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ" \
  -H "Content-Type: application/json"
```
