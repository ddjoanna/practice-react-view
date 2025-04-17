import React from "react";
import ReactDOM from "react-dom/client"; // 使用 'react-dom/client'
import App from "./App"; // 引入 App 元件

// 創建根節點
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
// // 渲染 App 元件
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
