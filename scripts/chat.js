'use strict';

const fs = require('fs');
const joinMessagesFileName = './join_messages.json';
let joinMessages = new Map(); // key: チャンネルID, value: 入室メッセージ

function saveJoinMessages() {
  fs.writeFileSync(
    joinMessagesFileName,
    JSON.stringify(Array.from(joinMessages)),
    'utf8'
  );
}

function loadJoinMessages() {
  try {
    const data = fs.readFileSync(joinMessagesFileName, 'utf8');
    joinMessages = new Map(JSON.parse(data));
  } catch (e) {
    console.log('loadJoinMessages Error:');
    console.log(e);
    console.log('空のjoinMessagesを利用します');
  }
}

module.exports = robot => {
  loadJoinMessages();

  // 発言したチャンネルに入室メッセージを設定する
  robot.hear(/^入室メッセージ登録 (.*)/i, msg => {
    const parsed = msg.message.rawText.match(/^入室メッセージ登録 (.*)/);
    // console.log(msg);
    if (parsed) {
      const joinMessage = parsed[1];
      const channelId = msg.envelope.room;
      joinMessages.set(channelId, joinMessage);
      saveJoinMessages();
      msg.send(`入室メッセージ:「${joinMessage}」を登録しました！`);
    }
  });

  // 発言したチャンネルの入室メッセージの設定を解除する
  robot.hear(/^入室メッセージ削除/i, msg => {
    const channelId = msg.envelope.room;
    joinMessages.delete(channelId);
    saveJoinMessages();
    msg.send(`入室メッセージを削除しました！`);
  });

  //部屋に入ったユーザーへの入室メッセージを案内 %USERNAME% はユーザー名に、%ROOMNAME% は部屋名に置換
  robot.enter(msg => {
    let username;
    if (msg.message.user.profile)
      username = msg.message.user.profile.display_name;
    if (!username) username = msg.message.user.name;

    //チャンネルのIDからチャンネル名を取得
    const channelId = msg.envelope.room;
    const roomname = robot.adapter.client.rtm.dataStore.getChannelGroupOrDMById(
      channelId
    ).name;

    for (let [key, value] of joinMessages) {
      if (channelId === key) {
        let message = value
          .replace('%USERNAME%', username)
          .replace('%ROOMNAME%', '#' + roomname);
        msg.send(message);
      }
    }
  });
};
