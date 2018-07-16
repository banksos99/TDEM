import firebase from 'react-native-firebase';
// Optional flow type
// import type, { RemoteMessage } from 'react-native-firebase';

export default async (message) => {
    // handle your message
    console.log("RemoteMessage", message);

    const newNotification = new firebase.notifications.Notification()
        .android.setSmallIcon(message.data.icon)
        .android.setChannelId(message.data.channel_id)
        .android.setAutoCancel(true)
        .android.setBigText(message.data.body)
        .setNotificationId(message.messageId)
        .setBody(message.data.body);
    if (message.data.title != undefined)
        newNotification.setTitle(message.data.title);
    if (message.data.color != undefined)
        newNotification.android.setColor(message.data.color);
    if (message.data.bigPicture != undefined)
        newNotification.android.setBigPicture(message.data.bigPicture);
    if (message.data.largeIcon != undefined)
        newNotification.android.setLargeIcon(message.data.largeIcon);
    firebase.notifications().displayNotification(newNotification);

    return Promise.resolve();
}