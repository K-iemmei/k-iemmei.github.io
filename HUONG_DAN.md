# 🎯 Hướng dẫn tạo Blog/Portfolio có thể tùy chỉnh

## 📋 Cấu trúc dự án

```
my-note/
├── portfolio.html      (File HTML chính - không cần sửa)
├── data.json          (File DATA - điều này là nơi bạn thay đổi nội dung!)
├── assets/
│   └── profile.jpeg   (Ảnh đại diện)
└── README.md
```

## 🚀 Cách dùng

### Bước 1: Mở file `data.json`
File này chứa TẤT CẢ nội dung của trang. HTML sẽ tự động đọc và hiển thị.

### Bước 2: Chỉnh sửa thông tin cơ bản

```json
{
  "profile": {
    "name": "Tên của bạn",              // Thay bằng tên của bạn
    "title": "Developer | Writer",       // Chức vụ của bạn
    "description": "Mô tả ngắn...",     // Slogan
    "profileImage": "assets/profile.jpeg", // Đường dẫn ảnh
    "bio": "Viết thêm thông tin..."     // Bio dài hơn
  },
  ...
}
```

---

## 📝 Chi tiết các phần

### 1️⃣ Navigation (Menu trên cùng)

```json
"navigation": [
  { "label": "Home", "href": "#" },
  { "label": "Blog", "href": "#blog" },
  { "label": "Projects", "href": "#projects" },
  { "label": "Contact", "href": "#contact" }
]
```

**Cách thêm menu:**
- Thêm object mới vào mảng
- `label`: Tên hiển thị
- `href`: Link đến trang/phần

**Ví dụ:**
```json
"navigation": [
  { "label": "Home", "href": "#" },
  { "label": "Skills", "href": "#skills" },  // ← Thêm như này
  { "label": "Blog", "href": "#blog" }
]
```

---

### 2️⃣ Sections (Các phần nội dung)

#### **Loại 1: Section văn bản đơn giản**

```json
{
  "id": "about",
  "title": "About Me",
  "content": "Đây là phần giới thiệu về bạn..."
}
```

#### **Loại 2: Section với danh sách items (Experience)**

```json
{
  "id": "experience",
  "title": "Experience",
  "items": [
    {
      "company": "Google",
      "role": "Senior Developer",
      "period": "2022 - Now",
      "description": "Mô tả công việc..."
    },
    {
      "company": "Facebook",
      "role": "Developer",
      "period": "2020 - 2022",
      "description": "Mô tả công việc..."
    }
  ]
}
```

#### **Loại 3: Section Projects (với tags)**

```json
{
  "id": "projects",
  "title": "My Projects",
  "items": [
    {
      "name": "E-commerce Platform",
      "description": "Nền tảng bán hàng trực tuyến...",
      "link": "https://github.com/yourname/project1",
      "tags": ["React", "Node.js", "MongoDB"]
    },
    {
      "name": "AI Chat Bot",
      "description": "Chat bot với AI...",
      "link": "https://github.com/yourname/project2",
      "tags": ["Python", "TensorFlow", "Flask"]
    }
  ]
}
```

---

## 💡 Ví dụ thực tế - Thêm section mới

### Ví dụ 1: Thêm section "Skills"

Thêm object này vào mảng `sections`:

```json
{
  "id": "skills",
  "title": "My Skills",
  "content": "Tôi thành thạo các công nghệ: JavaScript, React, Node.js, Python, SQL..."
}
```

### Ví dụ 2: Thêm section "Education"

```json
{
  "id": "education",
  "title": "Education",
  "items": [
    {
      "company": "Stanford University",
      "role": "Bachelor of Science in Computer Science",
      "period": "2015 - 2019",
      "description": "Specialized in AI and Machine Learning"
    },
    {
      "company": "MIT",
      "role": "Master of Science in AI",
      "period": "2019 - 2021",
      "description": "Focus on Deep Learning and NLP"
    }
  ]
}
```

### Ví dụ 3: Thêm project mới

Thêm object vào mảng `items` trong section `projects`:

```json
{
  "name": "Task Manager App",
  "description": "Ứng dụng quản lý công việc hàng ngày",
  "link": "https://github.com/yourname/task-manager",
  "tags": ["Vue.js", "Firebase", "PWA"]
}
```

---

## 🔗 Social Links

Thêm/sửa các liên kết mạng xã hội:

```json
"social": {
  "github": "https://github.com/yourusername",
  "twitter": "https://twitter.com/yourusername",
  "linkedin": "https://linkedin.com/in/yourusername",
  "email": "your@email.com"
}
```

**Xóa link:** Đơn giản xóa dòng hoặc đặt thành `""`

```json
"social": {
  "github": "https://github.com/yourusername",
  "twitter": "",  // Sẽ không hiển thị
  "linkedin": "https://linkedin.com/in/yourusername",
  "email": "your@email.com"
}
```

---

## 🎨 Tùy chỉnh giao diện

File `portfolio.html` có CSS cho phép bạn thay đổi màu sắc:

Tìm dòng này:
```css
.item-meta {
  color: #0066cc;  /* Đây là màu xanh dương */
}
```

Đổi `#0066cc` thành màu khác:
- `#ff6b6b` - Đỏ
- `#51cf66` - Xanh lá
- `#ffa94d` - Cam
- `#845ef7` - Tím

---

## ✅ Checklist bắt đầu

- [ ] Sửa `profile.name` thành tên của bạn
- [ ] Sửa `profile.title` 
- [ ] Sửa `profile.description`
- [ ] Sửa `profileBio`
- [ ] Sửa social links (GitHub, email, etc.)
- [ ] Thêm dự án của bạn vào section `projects`
- [ ] Sửa navigation nếu cần
- [ ] Thêm ảnh đại diện vào thư mục `assets`

---

## 📚 Ví dụ data.json hoàn chỉnh

```json
{
  "profile": {
    "name": "Nguyễn Văn A",
    "title": "Full Stack Developer",
    "description": "Tôi yêu thích lập trình và tìm kiếm các giải pháp sáng tạo",
    "profileImage": "assets/profile.jpeg",
    "bio": "Có hơn 5 năm kinh nghiệm trong phát triển web. Chuyên môn về React, Node.js và MongoDB."
  },
  "navigation": [
    { "label": "Home", "href": "#" },
    { "label": "Blog", "href": "#blog" },
    { "label": "Projects", "href": "#projects" },
    { "label": "Contact", "href": "#contact" }
  ],
  "sections": [
    {
      "id": "about",
      "title": "About Me",
      "content": "Tôi là một lập trình viên đam mê với kinh nghiệm trong phát triển web full stack..."
    },
    {
      "id": "experience",
      "title": "Experience",
      "items": [
        {
          "company": "Tech Company A",
          "role": "Senior Developer",
          "period": "2022 - Now",
          "description": "Lãnh đạo team phát triển các ứng dụng web"
        },
        {
          "company": "Startup B",
          "role": "Developer",
          "period": "2020 - 2022",
          "description": "Phát triển full stack sử dụng React và Node.js"
        }
      ]
    },
    {
      "id": "projects",
      "title": "Projects",
      "items": [
        {
          "name": "Project 1",
          "description": "Mô tả dự án",
          "link": "https://github.com",
          "tags": ["React", "Node.js"]
        }
      ]
    }
  ],
  "social": {
    "github": "https://github.com/yourname",
    "twitter": "https://twitter.com/yourname",
    "linkedin": "https://linkedin.com/in/yourname",
    "email": "your@email.com"
  }
}
```

---

## 🎯 Tips & Tricks

### 1. Thay đổi thứ tự sections
Chỉ cần di chuyển object trong mảng `sections`

### 2. Ẩn một section
Xóa hoặc comment lại object đó

### 3. Thêm section mới
Thêm một object mới vào mảng `sections`

### 4. Định dạng JSON đúng
- Các string phải trong `""`
- Các object phải trong `{}`
- Các mảng phải trong `[]`
- Không được dùng dấu phẩy sau phần tử cuối cùng

### 5. Kiểm tra JSON
Dán `data.json` vào https://jsonlint.com/ để kiểm tra cú pháp

---

## ❌ Lỗi thường gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-----------|----------|
| Trang trắng | JSON sai | Kiểm tra JSON trên jsonlint.com |
| Ảnh không hiện | Đường dẫn sai | Kiểm tra lại `profileImage` |
| Menu không có | Thiếu navigation | Thêm lại mảng `navigation` |

---

## 🎉 Kết luận

Bây giờ bạn có một trang web **dễ tùy chỉnh 100%**:
- ✅ Không cần sửa HTML
- ✅ Chỉ cần sửa `data.json`
- ✅ Dễ thêm sections mới
- ✅ Responsive (thích ứng với mobile/tablet)
- ✅ Nhanh và gọn gàng

**Mỗi khi bạn muốn thay đổi nội dung, chỉ cần edit file `data.json` thôi!** 🚀
