const express = require("express");
const app = express();
const webpush = require("web-push");
const path = require("path");
const cors = require("cors");
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// VAPID 키는 한 번만 생성하고 안전하게 저장해두어야 합니다. 매번 서버를 시작할 때마다 webpush.generateVAPIDKeys()를 호출해서 키를 새로 생성하는 것은 올바르지 않습니다.
// 키가 변경되면 이전에 구독한 모든 사용자에 대한 참조가 무효화되기 때문입니다.

// 처음에만 실행하여 키를 생성하고 저장
// const vapidKeys = webpush.generateVAPIDKeys();
// console.log('Public Key:', vapidKeys.publicKey);
// console.log('Private Key:', vapidKeys.privateKey);
// 이후 생성된 키를 안전하게 저장 (예: .env 파일, 데이터베이스 등)

// 저장된 publicKey 제공
app.get("/sendpublickey", (req, res) => {
    // 저장된 publicKey 불러오기
    const savedPublicKey = "BNnucd4iCF7usvZqVw7Jo8QaATC8XS94ztaIsPlcmF9HivTjC0csJht3x_WhsGB0ej5QDZXHdJemaUqc3y_6L-U";
    res.send(savedPublicKey);
});

const subjects = "mailto:jkjs79@naver.com";
webpush.setVapidDetails(
    subjects,
    "BNnucd4iCF7usvZqVw7Jo8QaATC8XS94ztaIsPlcmF9HivTjC0csJht3x_WhsGB0ej5QDZXHdJemaUqc3y_6L-U",
    "6SoCRkuEFPYGeyNKbTlx0c0CHNhe_Ah-eEeE1XBQ_iA"
);

// 메모리에 subscription 정보 저장 (테스트용)
let savedSubscription;

// subscription 저장 엔드포인트
app.post("/save-subscription", (req, res) => {
    savedSubscription = req.body;
    console.log(req.body);
    res.status(201).json({ message: "Subscription saved." });
});

// 푸시 알림 전송 엔드포인트
app.post("/send-notification", (req, res) => {
    const notificationPayload = {
        notification: {
            title: "New Notification",
            body: "This is the body of the notification",
            icon: "icon-url.png",
        },
    };

    webpush
        .sendNotification(savedSubscription, JSON.stringify(notificationPayload))
        .then((result) => res.status(200).json({ message: "Notification sent." }))
        .catch((err) => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });
});

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
})

app.use(express.static(path.join(__dirname, "dist"))); //스태틱한 파일들

// // npm run build 후 생긴 html파일 경로를 연결
// app.get("/lms/eng-study", function (req, res) {
//     res.sendFile(path.join(__dirname, "/dist/index.html"));
// });
// // app.get("*", function(req,res){
// //     res.sendFile(path.join(__dirname, "/dist/index.html"));
// // })

app.listen(5000, function () {
    console.log("listening on 5000");
});
