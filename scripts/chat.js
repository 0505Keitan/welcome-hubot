'use strict';

module.exports = (robot) => {
    // :+1: が付くと名前付きで褒めてくれる
    const sentSet = new Set();
    robot.react((res) => {
      const ts = res.message.item.ts;
      if (res.message.type == 'added' 
             && res.message.reaction == '+1'
             && !sentSet.has(ts)
            ) {
        const username = res.message.item_user.name;
        res.send(`${username}ちゃん、すごーい！`);

        if(sentSet.size > 100000) {
          sentSet.clear(); // 10万以上、すごーいしたら一旦クリア
        }
        sentSet.add(ts);
      }
    });

    // サーバルと呼びかけると答えてくれる
    robot.hear(/サーバル/i, (msg) => {
        const username = msg.message.user.name;
        const messages = [
          `${username}ちゃん、なんだい？`,
          'わーーい！',
          'たーのしー！',
          `${username}ちゃん、すごーい！`,
          'かりごっこだねー！',
          `${username}ちゃん、まけないんだからー！`,
          'みゃー！うみゃー！みゃーー！',
          'た、たべないよー！',
          `${username}ちゃん、あ、ちょっとげんきになったー？`,
          'ここはジャパリパークだよ！わたしはサーバル！このへんはわたしのなわばりなの！',
          'あなたこそ、しっぽとみみのないフレンズ？めずらしいねー！',
          'どこからきたの？なわばりは？',
          'あ！きのうのサンドスターでうまれたこかなー？',
          'へーきへーき！フレンズによってとくいなことちがうからー！',
          'あ！だめ！それはセルリアンだよ！にげてー！',
          'だいじょうぶだよ！わたしだって、みんなからよく「どじー！」とか、「ぜんぜんよわいー！」とかいわれるもん！',
          'わたし、あなたのつよいところ、だんだんわかってきたよ！きっとすてきなどうぶつだよ！たのしみだねー！',
          'なっ！なんでわかったのー！？',
          'ボスー！',
          `${username}ちゃん、ねーなんかいってよー！`,
          'いーなー！わたしもおひるねしたいなー！',
          'わたしのことしってるのー？',
          'つよそうなこだったねー！',
          'ここはほんとにたくさんのこがいるねー！',
          'あはは！おもしろいかたちー！',
          'え、なになにー！',
          `${username}ちゃん！`,
          'わたしひとりでもいくよ、まってて！',
          'わかった！よーし、やるぞー！'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        msg.send(message);
    });

};