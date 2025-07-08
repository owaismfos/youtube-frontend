import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addUsersList } from '../../features/chat/chatSlice';
import store from '../../app/store';

const GlobalWebSocket = ({ userId }) => {
  const dispatch = useDispatch();
  const state = store.getState()
  const token = state.auth.userData?.accessToken
  const userId = state.auth.userData?.id

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws/chat/?receiverId=${activeUser.id}&token=${token}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === 'user_list' && data.userId !== userId) {
        dispatch(addUsersList(data.data)); // data.data = user list with unread count
      }

    //   if (data.action === 'new_message') {
    //     dispatch(updateUnreadCountIncrement(data.message.sender));
    //   }
    };

    return () => socket.close();
  }, [userId]);

  return null; // no UI
};
