# API

## https://oj5lch0x53.execute-api.us-east-2.amazonaws.com/v1/sensor_data
### GET

レコードを検索して取得する

#### query

各条件でAnd検索

| key | type | description |
| --- | --- | --- |
| start_at | integer  (optional) |  start_at <= data_time値を持つもの.指定しなかった場合は無条件 |
| end_at | integer  (optional) |  data_time <= end_at値を持つもの.指定しなかった場合は無条件  |
| area | integer array  (optional) | areaに指定値のいずれかを持つもの. カンマ区切りで複数指定可能. 指定しなかった場合, もしくは空配列の場合は無条件 |
| type | integer array  (optional) | typeに指定値のいずれかを持つもの. カンマ区切りで複数指定可能.  指定しなかった場合, もしくは空配列の場合は無条件 |
| page | integer (optional) | ページ数. 省略した場合1ページ目を返す. 1ページあたり30件まで結果を表示.全件確認したい場合bodyが空になるまでpageをインクリメントして取得していく |

e.g. 
https://oj5lch0x53.execute-api.us-east-2.amazonaws.com/v1/sensor_data?start_at=1631952958&end_at=1631956958&type=222,456,444&area=123,455,677

#### response

bodyに結果のjsonが出力される

```json
{
  "statusCode": 200, // 200以外の場合はエラー
  "body": [ // 見つかったデータの配列
    {
      "meta": {
        "area": 123,
        "type": 456,
        "sensor_id": "foobar",
        "data_time":123456789
      },
      "body": [
        {
          "t": 126457289475,
          "d": { "humid": 65.34567, "temp": 23.4567 }
        },
        {
          "t": 126457289490,
          "d": { "humid": 69.34567, "temp": 22.4567 }
        }
      ]
    },
    // query条件に該当して見つかったデータすべて
  ]
}
```
