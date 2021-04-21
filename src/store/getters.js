const getters = {
  user: state => state.user,
  websockEvent: state => state.websock.websockEvent,
  websock: state => state.websock.websock,
  friend: state => state.friend,
  community: state => state.community,
  chat: state => state.chat,
  unprocessedMsg: state => state.websock.unprocessedMsg
}

export default getters
