# PubStar React Native SDK Architecture Context

## 1. Mục tiêu dự án (Project Overview)
Đây là SDK `rtn-pubstar` dành cho React Native, kết nối trực tiếp xuống Native SDK (iOS/Android) của PubStar.
Dự án sử dụng **React Native New Architecture**, bao gồm TurboModules (cho logic/API) và Fabric (cho UI Components) thông qua Codegen.

## 2. Chỉ dẫn cho AI (AI Instructions)
- Khi yêu cầu refactor, hãy giữ nguyên các file khai báo Codegen (các file có hậu tố `NativeComponent.ts` hoặc bắt đầu bằng `Native...`).
- Tuân thủ chặt chẽ TypeScript interfaces đã được định nghĩa.
- Không tự ý thêm các thư viện bên thứ 3 vào tầng bridge nếu không có yêu cầu.

## 3. Cấu trúc thư mục và Vai trò (Directory & File Responsibilities)

Dự án được chia thành 5 file cốt lõi ở tầng TypeScript:

* **`index.ts`**
    * *Vai trò:* Entry point của SDK. Nơi export tất cả các API, interfaces, và UI Components ra bên ngoài cho ứng dụng React Native tiêu thụ.
* **`Pubstar.ts`**
    * *Vai trò:* Chứa core logic của SDK ở tầng TypeScript. Định nghĩa các interface nội bộ và xử lý logic trước/sau khi gọi các hàm từ tầng Native (thông qua TurboModule). Đây là tầng Facade ẩn đi sự phức tạp của Native module.
* **`NativeRTNPubstar.ts`**
    * *Vai trò:* File khai báo interface cho **TurboModule**. Sử dụng đặc tả của React Native Codegen (`Spec`) để sinh code C++/Java/Objective-C tự động cho tầng Native xử lý logic.
* **`PubstarAdView.tsx`**
    * *Vai trò:* React wrapper component. Khởi tạo native view và cung cấp các props/callbacks thân thiện với React để kết nối với native view component ở dưới.
* **`PubstarAdViewNativeComponent.ts`**
    * *Vai trò:* File khai báo cho **Fabric UI Component**. Sử dụng đặc tả của React Native Codegen để sinh code bridge cho Native UI (chứa các định nghĩa về ViewProps).