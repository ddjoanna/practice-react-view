# practice-react-view

## 專案目的

    學習React前端應用

## 專案目標

    使用React實作
        - 基本後台畫面切版
        - 產品分類管理 CRUD 畫面
        - 產品管理 CRUD 畫面

## 啟動專案步驟

1. 啟動 API 服務
   1. clone [API 專案](https://github.com/ddjoanna/web-php-laravel-api-template)
   2. 設定 `.env` 檔案(可參考 `.env.example`)
   3. 執行 `composer install` 安裝套件包
   4. 執行 `php artisan serve` 啟動服務
2. 啟動前端服務
   1. clone 專案
   2. 執行 `npm install` 安裝套件包
   3. 執行 `npm run dev` 啟動後端服務
3. 開啟 http://localhost:5173/
   - 註冊
   - 登入
   - 商品管理
     - 查看產品
     - 編輯產品
     - 刪除產品
     - 列表
   - 產品分類管理
     - 查看分類
     - 編輯分類
     - 刪除分類
     - 列表可以拖曳編輯排序
