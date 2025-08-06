# skin_x
for test in skin_x co,.ltd.UI inspire from medium.
เนื่องจากเป็นการรัน local จึงทำการส่ง .env เเละ protocal ใช้เป็น http 

### requirement
    - MySql
    - Node

### How to run backend
ตั้งค่าการเข้าถึง database ใน /server/.env จากนั้นเข้าไปที่ folder รันคำสั่งตามด้านล่าง
```
# install dependencies
npm install

# ดึง schema จากฐานข้อมูลมาอัปเดตไฟล์ Prisma (ใช้ทดสอบการเชื่อมต่อด้วย)
npx prisma db push

# รัน seed script เพื่อใส่ข้อมูลตัวอย่างลงในฐานข้อมูล
node prisma/seed.js

# run backend
npm run dev

```

### How to run frontend
ก่อนการรัน frontend ควรตรวจสอบเรื่องของ port ก่อนการรันในไฟล์ .env จากนั้นรันคำสั่งด้านล่าง โดยไปที่ /client
```
#install dependencies
npm install

# run frontend
npm run dev
```
